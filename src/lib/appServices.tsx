/**
 * The app's background services, mounted once at the root inside the data
 * providers. Renders nothing.
 *
 * - keeps the scheduled reminders in step with the settings, the check-in
 *   times and days, and what has already been done today (`notifications.ts`)
 * - routes a tapped reminder to its screen while the app is running (a tap that
 *   cold-launches the app is picked up by the `(app)` layout's arrival logic,
 *   which knows when the app is ready to navigate)
 * - keeps the home-screen widgets' snapshot current (`widgets.ts`)
 */

import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { AppState } from 'react-native';

import { useCheckinDays } from '@/components/routines/kit';
import { useAuth } from '@/lib/auth';
import { useCheckins, useCurrentUser, useEvents, useJournalEntries, useLessonProgressMap } from '@/lib/backend';
import { useNow } from '@/lib/date';
import { cancelAllReminders, installNotificationHandler, onReminderTap, syncReminders, type ReminderPrefs } from '@/lib/notifications';
import { useRoutines } from '@/lib/routines';
import { syncWidgets } from '@/lib/widgets';

installNotificationHandler();

/** A check-in row counts as the morning's once it has the energy reading; the night's once it has its words. */
const morningDone = (c: { energy?: number }) => c.energy != null;
const nightDone = (c: { emotions?: string[]; reasons?: string[] }) => !!(c.emotions?.length || c.reasons?.length);

function ReminderSync() {
  const { isSignedIn } = useAuth();
  const user = useCurrentUser();
  const checkins = useCheckins();
  const routines = useRoutines();
  const morningDays = useCheckinDays('morning');
  const nightDays = useCheckinDays('night');
  const now = useNow();
  const wasOn = useRef(false);

  const settings = user?.settings;
  const ready = !!isSignedIn && !!user?.onboardingComplete && checkins !== undefined;
  const prefs = useMemo<ReminderPrefs>(
    () => ({
      morning: !!settings?.morningCheckin,
      night: !!settings?.eveningWindDown,
      risk: !!settings?.riskTimeSupport,
      weekly: !!settings?.weeklyReflection,
      // on unless switched off — the App lock screen's default
      discreet: settings?.hideSensitivePreviews ?? true,
    }),
    [settings?.morningCheckin, settings?.eveningWindDown, settings?.riskTimeSupport, settings?.weeklyReflection, settings?.hideSensitivePreviews],
  );
  const doneKey = (checkins ?? [])
    .slice(0, 16)
    .map((c) => `${c.date}${morningDone(c) ? 'm' : ''}${nightDone(c) ? 'n' : ''}`)
    .join(',');

  useEffect(() => {
    if (!ready) {
      // signed out: nothing of this account's should still ring
      if (wasOn.current && !isSignedIn) void cancelAllReminders();
      return;
    }
    wasOn.current = true;
    const run = () =>
      void syncReminders({
        prefs,
        routines,
        days: { morning: morningDays, night: nightDays },
        done: {
          morning: new Set((checkins ?? []).filter(morningDone).map((c) => c.date)),
          night: new Set((checkins ?? []).filter(nightDone).map((c) => c.date)),
        },
      });
    run();
    const sub = AppState.addEventListener('change', (s) => (s === 'active' ? run() : undefined));
    return () => sub.remove();
    // `doneKey` stands for `checkins`: only what the reminders read re-plans them
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, isSignedIn, prefs, routines, morningDays, nightDays, doneKey, now]);

  return null;
}

function ReminderTaps() {
  const router = useRouter();
  const user = useCurrentUser();
  const onboarded = !!user?.onboardingComplete;
  const onboardedRef = useRef(onboarded);
  useEffect(() => {
    onboardedRef.current = onboarded;
  }, [onboarded]);
  useEffect(() => onReminderTap((route) => (onboardedRef.current ? router.push(route as never) : undefined)), [router]);
  return null;
}

function WidgetSync() {
  const { isSignedIn } = useAuth();
  const user = useCurrentUser();
  const checkins = useCheckins();
  const events = useEvents();
  const journal = useJournalEntries();
  const progress = useLessonProgressMap();
  const routines = useRoutines();
  const now = useNow();

  useEffect(() => {
    if (!isSignedIn || !user?.onboardingComplete) {
      syncWidgets(null);
      return;
    }
    if (checkins === undefined || events === undefined || progress === undefined) return;
    syncWidgets({ user, checkins, events, journal: journal ?? [], progress, routines, discreet: user.settings.hideSensitivePreviews ?? true, now });
  }, [isSignedIn, user, checkins, events, journal, progress, routines, now]);

  return null;
}

export function AppServices() {
  return (
    <>
      <ReminderSync />
      <ReminderTaps />
      <WidgetSync />
    </>
  );
}
