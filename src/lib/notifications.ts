/**
 * Reminders — local notifications, scheduled on the device. Nothing is pushed
 * from a server, so nothing about when someone is at risk ever leaves the phone.
 *
 * Four kinds, each behind its own setting:
 *
 *   morning   the morning check-in, at the time chosen in Personalization
 *             (`settings.morningCheckin`)
 *   night     the nightly check-in (`settings.eveningWindDown`)
 *   risk      a quiet heads-up half an hour before the risky window the
 *             onboarding answers named (`settings.riskTimeSupport`)
 *   weekly    Sunday evening: the week's report is ready (`settings.weeklyReflection`)
 *
 * Rather than one repeating trigger each, the next fourteen days are scheduled
 * as dated, one-off notifications and rebuilt whenever anything they depend on
 * changes (and each time the app comes to the foreground). That is what lets a
 * reminder *not* fire: a morning already checked in, a day the person switched
 * off on the days picker, a night already closed. Repeating triggers cannot
 * skip a day; nobody needs nagging about a check-in they already did.
 *
 * Every word is discreet: no reminder names the habit, and with "Hide sensitive
 * previews" on (the default) the lock screen sees only a neutral line.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { addDays, startOfDay, toDateKey } from '@/lib/date';
import { minutesOf, type Routines, type TimeOfDay } from '@/lib/routines';
import { getJSON, setJSON } from '@/lib/storage';

const SUPPORTED = Platform.OS === 'ios' || Platform.OS === 'android';
const CHANNEL = 'reminders';
const HORIZON_DAYS = 14;
/** How early the risky-window heads-up lands. */
const RISK_LEAD_MIN = 30;
const ID_PREFIX = 'tl-';

export type ReminderKind = 'morning' | 'night' | 'risk' | 'weekly';

export type ReminderPrefs = Record<ReminderKind, boolean> & {
  /** Neutral wording on the lock screen. */
  discreet: boolean;
};

/** Where tapping each kind lands. */
export const REMINDER_ROUTES: Record<ReminderKind, string> = {
  morning: '/day/morning',
  night: '/day/night',
  risk: '/urge-hub',
  weekly: '/weekly-report',
};

type Copy = { title: string; body: string };

/** The words. The `discreet` set is what a glance at a locked phone can show. */
const COPY: Record<ReminderKind, { open: Copy[]; discreet: Copy }> = {
  morning: {
    open: [
      { title: 'Morning check-in', body: 'Twenty seconds — where’s your head at today?' },
      { title: 'Morning check-in', body: 'How did you sleep? One tap to start the day.' },
      { title: 'Morning check-in', body: 'A new day. Name how it feels.' },
    ],
    discreet: { title: 'Good morning', body: 'Twenty seconds for yourself?' },
  },
  night: {
    open: [
      { title: 'Close the day', body: 'Two minutes: how did today go, and what’s tomorrow’s one thing?' },
      { title: 'Close the day', body: 'Put today down before you sleep.' },
    ],
    discreet: { title: 'Evening', body: 'A minute to close the day?' },
  },
  risk: {
    open: [
      { title: 'Late night ahead', body: 'The time you told us about. SOS is one tap away.' },
      { title: 'Your window is coming up', body: 'Phone on the charger, out of reach. SOS is one tap away.' },
    ],
    discreet: { title: 'A heads-up', body: 'The time you told us about. We’re here.' },
  },
  weekly: {
    open: [{ title: 'Your week is in', body: 'Seven days, read back to you. Two minutes.' }],
    discreet: { title: 'Your week is in', body: 'Two minutes to look back.' },
  },
};

// ── foreground presentation ──────────────────────────────────────────

let handlerSet = false;

/** Show reminders as a banner even while the app is open (quietly: no sound). */
export function installNotificationHandler(): void {
  if (!SUPPORTED || handlerSet) return;
  handlerSet = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
  });
}

// ── permission ───────────────────────────────────────────────────────

export type ReminderPermission = 'granted' | 'denied' | 'undetermined' | 'unsupported';

export async function getReminderPermission(): Promise<ReminderPermission> {
  if (!SUPPORTED) return 'unsupported';
  try {
    const p = await Notifications.getPermissionsAsync();
    if (p.granted || p.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) return 'granted';
    return p.canAskAgain ? 'undetermined' : 'denied';
  } catch {
    return 'unsupported';
  }
}

async function ensureChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL, {
    name: 'Reminders',
    description: 'Check-ins and a heads-up before your risky window',
    importance: Notifications.AndroidImportance.DEFAULT,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PRIVATE,
    enableVibrate: true,
    showBadge: false,
  });
}

/** Ask once, when the person has just said yes to reminders. */
export async function requestReminderPermission(): Promise<boolean> {
  if (!SUPPORTED) return false;
  try {
    await ensureChannel();
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    if (!current.canAskAgain) return false;
    const asked = await Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowSound: true, allowBadge: false } });
    return asked.granted || asked.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  } catch {
    return false;
  }
}

// ── scheduling ───────────────────────────────────────────────────────

export type ReminderPlan = {
  prefs: ReminderPrefs;
  routines: Routines;
  /** 0 = Sunday … 6 = Saturday — the days picker on the check-in time boards */
  days: { morning: number[]; night: number[] };
  /** date keys already checked in, so that day's reminder is skipped */
  done: { morning: Set<string>; night: Set<string> };
  now?: number;
};

type Planned = { id: string; kind: ReminderKind; at: number };

function at(dayStart: number, time: TimeOfDay, leadMin = 0): number {
  const d = new Date(dayStart);
  const minutes = minutesOf(time) - leadMin;
  d.setHours(Math.floor(minutes / 60), ((minutes % 60) + 60) % 60, 0, 0);
  return d.getTime();
}

/** The notifications the next fortnight should hold — pure, so it can be checked without a device. */
export function planReminders({ prefs, routines, days, done, now = Date.now() }: ReminderPlan): Planned[] {
  const out: Planned[] = [];
  const today = startOfDay(now);
  for (let i = 0; i < HORIZON_DAYS; i++) {
    const day = addDays(today, i);
    const key = toDateKey(new Date(day));
    const dow = new Date(day).getDay();
    if (prefs.morning && days.morning.includes(dow) && !done.morning.has(key)) out.push({ id: `${ID_PREFIX}morning-${key}`, kind: 'morning', at: at(day, routines.morning) });
    if (prefs.night && days.night.includes(dow) && !done.night.has(key)) out.push({ id: `${ID_PREFIX}night-${key}`, kind: 'night', at: at(day, routines.night) });
    if (prefs.risk && routines.risk) out.push({ id: `${ID_PREFIX}risk-${key}`, kind: 'risk', at: at(day, routines.risk, RISK_LEAD_MIN) });
    if (prefs.weekly && dow === 0) out.push({ id: `${ID_PREFIX}weekly-${key}`, kind: 'weekly', at: at(day, { hour: 7, minute: 0, period: 'PM' }) });
  }
  // a night check-in time after midnight belongs to the small hours of the next day; a risk lead can cross midnight too
  return out.filter((p) => p.at > now + 30_000).sort((a, b) => a.at - b.at);
}

function copyFor(kind: ReminderKind, id: string, discreet: boolean): Copy {
  if (discreet) return COPY[kind].discreet;
  const options = COPY[kind].open;
  // the same day always gets the same line; consecutive days differ
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return options[Math.abs(h) % options.length];
}

let syncing: Promise<void> | null = null;
let queued: ReminderPlan | null = null;

/**
 * Make the scheduled set match the plan. Only touches this app's reminders
 * (ids starting `tl-`), adds what is missing and cancels what is no longer
 * wanted, so a sync that changes nothing schedules nothing. Calls made while a
 * sync is running are folded into one follow-up.
 */
export async function syncReminders(plan: ReminderPlan): Promise<void> {
  if (!SUPPORTED) return;
  if (syncing) {
    queued = plan;
    return syncing;
  }
  syncing = (async () => {
    try {
      if ((await getReminderPermission()) !== 'granted') return;
      await ensureChannel();
      const want = planReminders(plan);
      const wantIds = new Set(want.map((p) => p.id));
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      const ours = scheduled.filter((n) => n.identifier.startsWith(ID_PREFIX));
      const have = new Map(ours.map((n) => [n.identifier, n]));
      for (const n of ours) {
        const wanted = want.find((p) => p.id === n.identifier);
        const sameTime = wanted && (n.content.data as { at?: number } | undefined)?.at === wanted.at;
        const sameWords = wanted && (n.content.data as { discreet?: boolean } | undefined)?.discreet === plan.prefs.discreet;
        if (!wantIds.has(n.identifier) || !sameTime || !sameWords) {
          await Notifications.cancelScheduledNotificationAsync(n.identifier);
          have.delete(n.identifier);
        }
      }
      for (const p of want) {
        if (have.has(p.id)) continue;
        const copy = copyFor(p.kind, p.id, plan.prefs.discreet);
        await Notifications.scheduleNotificationAsync({
          identifier: p.id,
          content: {
            title: copy.title,
            body: copy.body,
            sound: false,
            data: { url: REMINDER_ROUTES[p.kind], kind: p.kind, at: p.at, discreet: plan.prefs.discreet },
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: p.at, channelId: CHANNEL },
        });
      }
    } catch (error) {
      if (__DEV__) console.warn('Reminders could not be scheduled', error);
    }
  })();
  try {
    await syncing;
  } finally {
    syncing = null;
    const next = queued;
    queued = null;
    if (next) await syncReminders(next);
  }
}

/** Take back today's reminder of one kind (the check-in was just done). */
export async function cancelReminderFor(kind: ReminderKind, dateKey: string): Promise<void> {
  if (!SUPPORTED) return;
  await Notifications.cancelScheduledNotificationAsync(`${ID_PREFIX}${kind}-${dateKey}`).catch(() => {});
}

/** Every reminder this app scheduled (sign-out, account deletion, all switched off). */
export async function cancelAllReminders(): Promise<void> {
  if (!SUPPORTED) return;
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(scheduled.filter((n) => n.identifier.startsWith(ID_PREFIX)).map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)));
  } catch {
    // nothing to do
  }
}

/** The route a tapped reminder asks for, if it is one of ours and a known one. */
export function routeFromResponse(response: Notifications.NotificationResponse | null | undefined): string | null {
  const url = (response?.notification.request.content.data as { url?: unknown } | undefined)?.url;
  if (typeof url !== 'string') return null;
  return Object.values(REMINDER_ROUTES).includes(url) ? url : null;
}

// ── taps ─────────────────────────────────────────────────────────────

const HANDLED_KEY = 'tideline.reminders.handled';
let handledCache: string | null = null;

async function markHandled(id: string): Promise<boolean> {
  if (handledCache == null) handledCache = (await getJSON<string>(HANDLED_KEY)) ?? '';
  if (handledCache === id) return false;
  handledCache = id;
  await setJSON(HANDLED_KEY, id);
  return true;
}

/**
 * The route of the reminder that opened the app, once. The OS keeps handing
 * back the last response on every later launch, so the one already acted on is
 * remembered and not routed to again.
 */
export async function consumeLaunchReminder(): Promise<string | null> {
  if (!SUPPORTED) return null;
  try {
    const response = await Notifications.getLastNotificationResponseAsync();
    const route = routeFromResponse(response);
    if (!route || !response) return null;
    if (response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return null;
    return (await markHandled(response.notification.request.identifier)) ? route : null;
  } catch {
    return null;
  }
}

/** Taps on a reminder while the app is running. */
export function onReminderTap(handler: (route: string) => void): () => void {
  if (!SUPPORTED) return () => {};
  const sub = Notifications.addNotificationResponseReceivedListener((response) => {
    const route = routeFromResponse(response);
    if (!route || response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return;
    void markHandled(response.notification.request.identifier).then((fresh) => (fresh ? handler(route) : undefined));
  });
  return () => sub.remove();
}
