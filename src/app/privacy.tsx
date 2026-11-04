import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Share, View } from 'react-native';

import { GhostLink, LoadingView, MonoText, NavBar, PrimaryButton, Row, RowGroup, Screen, ScrollRegion, Sheet, SHEET_TOP } from '@/components/mono';
import { useAuth } from '@/lib/auth';
import {
  useCheckins,
  useCurrentUser,
  useDeleteAccount,
  useEvents,
  useJournalEntries,
  useLessonProgressMap,
  useLifeMap,
  useUpdateSettings,
} from '@/lib/backend';
import { haptic, hapticsEnabled, setHapticsEnabled } from '@/lib/haptics';
import { cancelAllReminders } from '@/lib/notifications';
import { removeKeysWithPrefix } from '@/lib/storage';
import { mono } from '@/lib/theme';

/**
 * 94 · Data & privacy — the nav row with its caption, then a `gap 16` column
 * from canvas 120: the promise as a heading and its line, what you can take
 * with you, what you can switch off, and the warning under `Delete account`.
 *
 * `Export my data` hands the whole record (log, check-ins, journal, life map,
 * lesson progress) to the share sheet as JSON — save it to Files, mail it to
 * yourself. `Delete account` asks once on a sheet, then erases the account's
 * rows on the server (in batches, server-side), the sign-in itself, every
 * reminder, and everything this app keeps on the device. `Haptics` is the
 * device-local switch for the app's vibration feedback.
 */

export default function Privacy() {
  const router = useRouter();
  const user = useCurrentUser();
  const update = useUpdateSettings();
  const auth = useAuth();
  const events = useEvents();
  const checkins = useCheckins();
  const journal = useJournalEntries();
  const lifeMap = useLifeMap();
  const progress = useLessonProgressMap();
  const deleteAccount = useDeleteAccount();
  const [haptics, setHaptics] = useState(hapticsEnabled());
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  if (user === undefined) return <LoadingView onBack={back} />;
  const pauseAnalytics = user?.settings.pauseAnalytics ?? false;

  const exportData = () => {
    const record = {
      exportedAt: new Date().toISOString(),
      account: { email: auth.email, displayName: user?.displayName, createdAt: user?.createdAt ? new Date(user.createdAt).toISOString() : null, settings: user?.settings },
      lifeMap: lifeMap ?? null,
      lessonProgress: Object.values(progress ?? {}),
      checkins: checkins ?? [],
      events: (events ?? []).map((e) => ({ ...e, at: new Date(e.createdAt).toISOString() })),
      journal: (journal ?? []).map((j) => ({ ...j, at: new Date(j.createdAt).toISOString() })),
    };
    void Share.share({ title: 'Your data', message: JSON.stringify(record, null, 2) }).catch(() => {});
  };

  const erase = async () => {
    if (deleting) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteAccount();
      const res = await auth.deleteAccount();
      if (!res.ok) throw new Error(res.error ?? 'Could not delete the sign-in.');
      await cancelAllReminders().catch(() => {});
      await removeKeysWithPrefix('tideline.');
      setConfirm(false);
      router.replace('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Nothing was deleted twice; try again.');
      setDeleting(false);
    }
  };

  return (
    <Screen>
      <NavBar left="back" centre={{ title: 'Data & privacy' }} right="empty" onBack={back} />

      <ScrollRegion top={100} contentStyle={{ paddingTop: 20, paddingHorizontal: 24, paddingBottom: 24, gap: 16 }}>
        <MonoText v="h1">Yours, and only yours.</MonoText>
        <MonoText v="p">
          Your journal, urges and log stay on your device and your private account, encrypted at rest. We never sell your data, ever.
        </MonoText>
        <View style={{ height: 2 }} />

        <RowGroup label="Your data">
          <Row label="Export my data" value="JSON" onPress={exportData} />
          <Row label="Privacy policy" />
          <Row label="Terms of service" />
        </RowGroup>

        <RowGroup label="Controls">
          <Row label="Pause analytics" toggle={{ value: pauseAnalytics, onChange: (next) => void update({ pauseAnalytics: next }) }} />
          <Row
            label="Haptics"
            toggle={{
              value: haptics,
              onChange: (next) => {
                setHaptics(next);
                void setHapticsEnabled(next).then(() => (next ? haptic('select') : undefined));
              },
            }}
          />
          <Row label="Delete account" muted onPress={() => setConfirm(true)} />
        </RowGroup>

        <MonoText v="p" color={mono.mute} style={{ fontSize: 13, lineHeight: 19 }}>
          Deleting your account erases your journal, urges and log permanently. This can’t be undone.
        </MonoText>
      </ScrollRegion>

      <Sheet
        open={confirm}
        top={SHEET_TOP.signOut - 40}
        gap={10}
        onClose={() => (deleting ? undefined : setConfirm(false))}
        footer={
          <>
            <PrimaryButton label={deleting ? 'Deleting…' : 'Delete everything'} bottom={96} sheet disabled={deleting} onPress={() => void erase()} />
            <GhostLink label="Keep my account" zIndex={42} onPress={() => (deleting ? undefined : setConfirm(false))} />
          </>
        }>
        <MonoText v="h1SheetLg">Delete your account?</MonoText>
        <MonoText v="p" color={error ? mono.ink : mono.sub} style={{ lineHeight: 23 }}>
          {error ?? 'Your journal, urges, check-ins, letters and medallions are erased for good, here and on the server.'}
        </MonoText>
      </Sheet>
    </Screen>
  );
}
