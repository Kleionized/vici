/**
 * Reminders — the local notifications VICI schedules on this phone.
 *
 *   - the two check-ins: a weekly repeat for every day ticked under each
 *     check-in time, at the saved morning and night times, in the words the
 *     onboarding cards already promise (`REMINDER_COPY`). A tap opens that
 *     check-in.
 *   - the trial: one reminder a day before a free trial ends
 *     (`scheduleTrialReminder`, for the paywall).
 *
 * Nothing leaves the phone: these are local notifications, no push token is
 * ever requested. Whether check-in reminders are on is kept on this phone per
 * account (`tideline.reminders.enabled.v1:<userId>`), like the times
 * themselves. Signing out — or a session that ends while the app runs —
 * cancels everything scheduled but keeps that account's choice, so signing
 * back in brings the reminders back and a different account starts without
 * them (D420). A launch that first reports "signed out" (offline, Clerk may
 * not have been able to check the session) leaves them as they are.
 *
 * `expo-notifications` is loaded lazily and only after its native module is
 * known to be in the binary, so a dev client built before it was added — and
 * the web build — run with reminders simply unavailable rather than crashing.
 */

import { useRouter, usePathname } from 'expo-router';
import { requireOptionalNativeModule } from 'expo';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { AppState, Linking, Platform } from 'react-native';

import { withSystemPrompt } from '@/components/AppLockGate';
import { ACCOUNT_KEYS, accountAtLaunch, accountKey, writeAccountJSON } from '@/lib/accountState';
import { useAuth } from '@/lib/auth';
import { useCurrentUser } from '@/lib/backend';
import { loadCheckinDays, loadRoutines, minutesOf, type CheckinKind, type TimeOfDay } from '@/lib/routines';
import { getJSON, setJSON } from '@/lib/storage';

type NotificationsModule = typeof import('expo-notifications');
type NotificationResponse = import('expo-notifications').NotificationResponse;

// ── the copy ─────────────────────────────────────────────────────────

/**
 * The words each reminder lands with — the two the onboarding cards draw
 * (`components/onboarding/reminders.tsx` reads them from here). Discreet by
 * design: nothing names the habit, so no setting has to hide them.
 */
export const REMINDER_COPY = {
  morning: { title: 'Morning check-in', body: 'Twenty seconds — where’s your head at today?', url: '/day/morning' },
  night: { title: 'Late night ahead', body: 'The time you told us about. SOS is one tap away.', url: '/day/night' },
} as const;

const TRIAL_COPY = {
  title: 'Your free trial ends tomorrow',
  body: 'Nothing is charged before then. Keep going, or cancel from your subscription settings.',
  url: '/subscription',
} as const;

const CHECKIN_ID = 'vici.checkin.';
const TRIAL_ID = 'vici.trial';
const CHANNEL_ID = 'reminders';
const ENABLED_KEY = ACCOUNT_KEYS.remindersOn;
/**
 * The launch gate's "check-in shown at" stamp (`(app)/_layout.tsx`), the
 * account's own (D490). A tap on a check-in reminder opens the check-in
 * itself, so it stamps this too, or the gate would push a second copy of the
 * same check-in on top of it.
 */
const CHECKIN_PROMPT_KEY = ACCOUNT_KEYS.checkinPromptAt;

// ── the module, lazily ───────────────────────────────────────────────

let mod: NotificationsModule | null | undefined;

/** `expo-notifications`, or null where it cannot run (web, a binary built without it). */
function notifications(): NotificationsModule | null {
  if (mod !== undefined) return mod;
  mod = null;
  if (Platform.OS === 'web') return mod;
  try {
    // Checked first so a binary without the module never evaluates its JS,
    // which throws on the first missing native module.
    if (!requireOptionalNativeModule('ExpoNotificationScheduler') || !requireOptionalNativeModule('ExpoNotificationPermissionsModule')) return mod;
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- loaded lazily on purpose (see the header)
    const N = require('expo-notifications') as NotificationsModule;
    // A reminder that arrives while VICI is open still shows, quietly.
    N.setNotificationHandler({
      handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
    });
    mod = N;
  } catch {
    mod = null;
  }
  return mod;
}

/** Whether this build can schedule reminders at all. */
export function remindersAvailable(): boolean {
  return notifications() !== null;
}

/** Every scheduling call runs one after another, so a cancel never lands in the middle of a reschedule. */
let queue: Promise<unknown> = Promise.resolve();
function serial<T>(job: () => Promise<T>): Promise<T> {
  const run = queue.then(job, job);
  queue = run.catch(() => {});
  return run;
}

let channelReady: Promise<void> | null = null;
/** Android needs a channel before it will even show the permission prompt (13+). */
function ensureChannel(N: NotificationsModule): Promise<void> {
  if (Platform.OS !== 'android') return Promise.resolve();
  if (!channelReady) {
    channelReady = N.setNotificationChannelAsync(CHANNEL_ID, { name: 'Reminders', importance: N.AndroidImportance.DEFAULT })
      .then(() => undefined)
      .catch(() => {
        channelReady = null;
      });
  }
  return channelReady;
}

// ── state: on/off and the permission ─────────────────────────────────

export type ReminderPermission = 'granted' | 'denied' | 'undetermined' | 'unavailable';

export type ReminderState = {
  /** this phone has read its choice from disk */
  loaded: boolean;
  /** the user asked for check-in reminders on this phone */
  enabled: boolean;
  permission: ReminderPermission;
  /** false once the OS will no longer ask (only Settings can turn it on) */
  canAskAgain: boolean;
};

let state: ReminderState = { loaded: false, enabled: false, permission: 'undetermined', canAskAgain: true };
const listeners = new Set<() => void>();

function setState(patch: Partial<ReminderState>) {
  state = { ...state, ...patch };
  for (const l of listeners) l();
}

type PermissionReading = { permission: ReminderPermission; canAskAgain: boolean };

function reading(N: NotificationsModule, p: import('expo-notifications').NotificationPermissionsStatus): PermissionReading {
  const iosStatus = p.ios?.status;
  const provisional = iosStatus === N.IosAuthorizationStatus.PROVISIONAL || iosStatus === N.IosAuthorizationStatus.EPHEMERAL;
  const permission: ReminderPermission = p.granted || provisional ? 'granted' : p.status === 'undetermined' ? 'undetermined' : 'denied';
  return { permission, canAskAgain: p.canAskAgain };
}

async function readPermission(): Promise<PermissionReading> {
  const N = notifications();
  if (!N) return { permission: 'unavailable', canAskAgain: false };
  try {
    return reading(N, await N.getPermissionsAsync());
  } catch {
    return { permission: 'unavailable', canAskAgain: false };
  }
}

/** The signed-in account whose switch is in memory (null signed out). */
let account: string | null = null;
const enabledKey = (id: string) => accountKey(ENABLED_KEY, id);

/**
 * Point the switch at an account (the root lifecycle does, as auth settles).
 * Signed out, it reads off and nothing is written.
 */
function setReminderAccount(id: string | null) {
  if (id === account) return;
  account = id;
  enabledRead = null;
  setState({ loaded: false, enabled: false });
  void readEnabled();
}

let enabledRead: Promise<void> | null = null;
/** The account's switch is read from disk once; after that memory is the truth (every write goes through `setEnabled`). */
function readEnabled(): Promise<void> {
  if (!enabledRead) {
    const id = account;
    enabledRead = id
      ? getJSON<boolean>(enabledKey(id)).then((stored) => {
          if (account === id && !state.loaded) setState({ loaded: true, enabled: stored === true });
        })
      : Promise.resolve().then(() => {
          if (account === null && !state.loaded) setState({ loaded: true, enabled: false });
        });
  }
  return enabledRead;
}

/** Re-read the OS permission (the user may have changed it in system Settings) and, once, the switch. */
export async function refreshReminderState(): Promise<ReminderState> {
  const [, perm] = await Promise.all([readEnabled(), readPermission()]);
  setState(perm);
  return state;
}

async function setEnabled(enabled: boolean) {
  await readEnabled();
  const id = account;
  setState({ loaded: true, enabled });
  if (id) await setJSON(enabledKey(id), enabled);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!state.loaded) void refreshReminderState();
  return () => {
    listeners.delete(listener);
  };
}
const snapshot = () => state;

/**
 * The reminders' real state on this phone, re-read whenever the app comes back
 * to the foreground. `on` is what a switch should show: asked for *and*
 * allowed by the OS.
 */
export function useReminderState(): ReminderState & { available: boolean; on: boolean } {
  const s = useSyncExternalStore(subscribe, snapshot, snapshot);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') void refreshReminderState();
    });
    return () => sub.remove();
  }, []);
  const available = remindersAvailable();
  return { ...s, available, on: available && s.enabled && s.permission === 'granted' };
}

type PermissionAnswer = {
  granted: boolean;
  /** the OS would not show its prompt at all: refused before, and it no longer asks */
  blocked: boolean;
};

/**
 * Ask the OS, when it will still ask. `blocked` is read *before* asking: iOS
 * reports "can't ask again" the moment someone taps Don't Allow, so reading it
 * afterwards would treat a refusal just given as a phone that never shows the
 * prompt.
 */
async function askPermission(): Promise<PermissionAnswer> {
  const N = notifications();
  if (!N) return { granted: false, blocked: false };
  try {
    await ensureChannel(N);
    let perm = reading(N, await N.getPermissionsAsync());
    const blocked = perm.permission !== 'granted' && !perm.canAskAgain;
    if (perm.permission !== 'granted' && perm.canAskAgain) {
      // the alert makes VICI inactive; the privacy cover leaves the board in view
      const answer = await withSystemPrompt(() => N.requestPermissionsAsync({ ios: { allowAlert: true, allowSound: true, allowBadge: false } }));
      perm = reading(N, answer);
    }
    setState(perm);
    return { granted: perm.permission === 'granted', blocked };
  } catch {
    return { granted: false, blocked: false };
  }
}

/**
 * Ask the OS for permission to show reminders (once — after a refusal the OS
 * no longer asks, and this answers false without a prompt). True when allowed.
 */
export async function requestReminderPermission(): Promise<boolean> {
  return (await askPermission()).granted;
}

// ── the check-ins ────────────────────────────────────────────────────

/** "8:00 PM" → 20, 0 */
function clock(time: TimeOfDay) {
  const m = minutesOf(time);
  return { hour: Math.floor(m / 60), minute: m % 60 };
}

export type CheckinPlan = {
  morning: TimeOfDay;
  night: TimeOfDay;
  /** the ticked days per check-in (0 = Sunday), or one list for both */
  days: Record<CheckinKind, number[]> | number[];
};

const validDays = (days: number[]) => [...new Set(days)].filter((d) => Number.isInteger(d) && d >= 0 && d <= 6);

async function cancelCheckinsNow(N: NotificationsModule) {
  const scheduled = await N.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled.filter((r) => r.identifier.startsWith(CHECKIN_ID)).map((r) => N.cancelScheduledNotificationAsync(r.identifier).catch(() => {})),
  );
}

/**
 * Replace this app's check-in reminders: cancels every one scheduled before,
 * then schedules a weekly repeat for each ticked day (0 = Sunday) at the
 * morning and night times. Needs the permission already granted — without it
 * the old ones are still cleared and nothing new is set (returns false).
 */
export function scheduleCheckinReminders(plan: CheckinPlan): Promise<boolean> {
  return serial(() => scheduleCheckinsNow(plan));
}

async function scheduleCheckinsNow({ morning, night, days }: CheckinPlan): Promise<boolean> {
  const N = notifications();
  if (!N) return false;
  try {
    await cancelCheckinsNow(N);
    const perm = await readPermission();
    setState(perm);
    if (perm.permission !== 'granted') return false;
    await ensureChannel(N);
    const perKind: Record<CheckinKind, number[]> = Array.isArray(days) ? { morning: days, night: days } : days;
    const times: Record<CheckinKind, TimeOfDay> = { morning, night };
    const jobs: Promise<string>[] = [];
    for (const kind of ['morning', 'night'] as const) {
      const { hour, minute } = clock(times[kind]);
      const copy = REMINDER_COPY[kind];
      for (const day of validDays(perKind[kind])) {
        jobs.push(
          N.scheduleNotificationAsync({
            identifier: `${CHECKIN_ID}${kind}.${day}`,
            content: { title: copy.title, body: copy.body, sound: 'default', data: { url: copy.url, kind: 'checkin', part: kind } },
            // expo counts weekdays 1–7 from Sunday; the toggles count 0–6 from Sunday
            trigger: { type: N.SchedulableTriggerInputTypes.WEEKLY, weekday: day + 1, hour, minute, channelId: CHANNEL_ID },
          }),
        );
      }
    }
    await Promise.all(jobs);
    return true;
  } catch {
    return false;
  }
}

/** Cancel this app's check-in reminders (the trial reminder stays). */
export function cancelCheckinReminders(): Promise<void> {
  return serial(async () => {
    const N = notifications();
    if (!N) return;
    try {
      await cancelCheckinsNow(N);
    } catch {
      // nothing scheduled to cancel
    }
  });
}

/**
 * Bring this phone's check-in reminders in line with what is saved: the
 * switch, the OS permission, the two times and their days. Safe to call any
 * time — on launch, on return to the app, after `Save time`.
 */
export function syncCheckinReminders(): Promise<void> {
  const N = notifications();
  if (!N) return Promise.resolve();
  // read inside the queue, so a switch-off queued earlier is already in memory
  return serial(async () => {
    const [s, routines, days] = await Promise.all([refreshReminderState(), loadRoutines(), loadCheckinDays()]);
    if (s.enabled && s.permission === 'granted') await scheduleCheckinsNow({ morning: routines.morning, night: routines.night, days });
    else await cancelCheckinsNow(N).catch(() => {});
  });
}

/**
 * "Turn on reminders": records the choice, asks the OS, and schedules from the
 * saved times. The choice is kept even when the OS says no, so allowing VICI
 * later in system Settings starts them on the next return to the app. With
 * `openSettingsIfBlocked`, a phone that would not even show the prompt (it was
 * refused on an earlier visit) is sent to VICI's page in system Settings
 * instead; someone who has just tapped Don't Allow stays where they are
 * (D422). Resolves whether reminders are on.
 */
export async function turnOnReminders({ openSettingsIfBlocked = false }: { openSettingsIfBlocked?: boolean } = {}): Promise<boolean> {
  if (!notifications()) return false;
  await setEnabled(true);
  const { granted, blocked } = await askPermission();
  await syncCheckinReminders();
  if (!granted && blocked && openSettingsIfBlocked) await Linking.openSettings().catch(() => {});
  return granted;
}

/** Switch check-in reminders off on this phone. */
export async function turnOffReminders(): Promise<void> {
  await setEnabled(false);
  await cancelCheckinReminders();
}

// ── the trial ────────────────────────────────────────────────────────

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * One reminder a day before a free trial ends (`endsAtMs`, epoch ms), opening
 * Manage Subscription. Replaces any earlier trial reminder. Asks for
 * permission first unless `ask: false`. Resolves whether it was scheduled —
 * false when the reminder time has already passed or reminders are not allowed.
 */
export async function scheduleTrialReminder(endsAtMs: number, { ask = true }: { ask?: boolean } = {}): Promise<boolean> {
  const N = notifications();
  if (!N || !Number.isFinite(endsAtMs)) return false;
  const at = endsAtMs - DAY_MS;
  if (at <= Date.now() + 60_000) return false;
  const allowed = ask ? await requestReminderPermission() : (await readPermission()).permission === 'granted';
  if (!allowed) return false;
  return serial(async () => {
    try {
      await ensureChannel(N);
      await N.cancelScheduledNotificationAsync(TRIAL_ID).catch(() => {});
      await N.scheduleNotificationAsync({
        identifier: TRIAL_ID,
        content: { title: TRIAL_COPY.title, body: TRIAL_COPY.body, sound: 'default', data: { url: TRIAL_COPY.url, kind: 'trial' } },
        trigger: { type: N.SchedulableTriggerInputTypes.DATE, date: at, channelId: CHANNEL_ID },
      });
      return true;
    } catch {
      return false;
    }
  });
}

/** Cancel the trial reminder (the trial was cancelled or converted early). */
export function cancelTrialReminder(): Promise<void> {
  return serial(async () => {
    const N = notifications();
    if (!N) return;
    await N.cancelScheduledNotificationAsync(TRIAL_ID).catch(() => {});
  });
}

// ── signing out ──────────────────────────────────────────────────────

/**
 * Everything off on this phone: every reminder this app scheduled is
 * cancelled and any that already arrived are cleared from the notification
 * centre. The account's own switch is left as it was, so signing back in to
 * the same account brings its reminders back, while a different account reads
 * its own (off until it turns them on).
 */
export async function cancelAllReminders(): Promise<void> {
  await serial(async () => {
    const N = notifications();
    if (!N) return;
    await N.cancelAllScheduledNotificationsAsync().catch(() => {});
    await N.dismissAllNotificationsAsync().catch(() => {});
  });
}

// ── taps ─────────────────────────────────────────────────────────────

function urlOf(response: NotificationResponse | null | undefined): string | null {
  const url = response?.notification.request.content.data?.url;
  return typeof url === 'string' && url.startsWith('/') ? url : null;
}

/**
 * Mount once at the root. Opens what a tapped reminder points at — on a cold
 * start, only once the account has loaded and the app has left the boot route
 * (pushing before then would land under the boot redirect) — and keeps this
 * phone's check-in schedule in step at launch and on every return to the app.
 */
export function useReminderLifecycle(): void {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded, isSignedIn, userId } = useAuth();
  const user = useCurrentUser();
  const ready = isLoaded && isSignedIn && !!user?.onboardingComplete && pathname !== '/';

  const pending = useRef<string | null>(null);
  const readyRef = useRef(false);
  const routerRef = useRef(router);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => {
    readyRef.current = ready;
    if (ready && pending.current) {
      const url = pending.current;
      pending.current = null;
      router.push(url as never);
    }
  }, [ready, router]);

  useEffect(() => {
    const N = notifications();
    if (!N) return;
    const take = (response: NotificationResponse | null | undefined) => {
      const url = urlOf(response);
      if (!url) return;
      if (url.startsWith('/day/')) void writeAccountJSON(CHECKIN_PROMPT_KEY, Date.now());
      try {
        N.clearLastNotificationResponse();
      } catch {
        // an older binary without the call: the response is simply kept
      }
      if (readyRef.current) routerRef.current.push(url as never);
      else pending.current = url;
    };
    try {
      take(N.getLastNotificationResponse());
    } catch {
      // no launch response
    }
    let sub: { remove(): void } | undefined;
    try {
      sub = N.addNotificationResponseReceivedListener(take);
    } catch {
      sub = undefined;
    }
    return () => sub?.remove();
  }, []);

  // Signed in: this phone's schedule follows the account's switch and the
  // saved times and days, checked at launch and on every return. Signed out
  // while the app runs — by the sheet, by an expired session, by deleting the
  // account — nothing stays scheduled, but the account's switch is kept for
  // its next sign-in. A launch whose first report is "signed out" cancels
  // nothing: offline, Clerk can load with no session it could check, and the
  // owner's reminders must not go quiet for that. The first sign-in of a run
  // by an account other than the phone's last clears what that one left
  // (the trial reminder too) before its own are set.
  const signedIn = useRef(false);
  const seenSignedIn = useRef(false);
  useEffect(() => {
    if (!isLoaded) return;
    signedIn.current = isSignedIn;
    setReminderAccount(isSignedIn ? userId : null);
    if (isSignedIn) {
      const first = !seenSignedIn.current;
      seenSignedIn.current = true;
      void (async () => {
        if (first) {
          const last = await accountAtLaunch().catch(() => null);
          if (last && last !== userId) await cancelAllReminders();
        }
        await syncCheckinReminders();
      })();
    } else if (seenSignedIn.current) {
      void cancelAllReminders();
    }
  }, [isLoaded, isSignedIn, userId]);
  useEffect(() => {
    if (!notifications()) return;
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active' && signedIn.current) void syncCheckinReminders();
    });
    return () => sub.remove();
  }, []);
}
