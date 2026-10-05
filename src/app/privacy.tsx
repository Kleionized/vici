import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { LoadingView, MonoText, NavBar, Row, RowGroup, Screen, ScrollRegion } from '@/components/mono';
import { useCurrentUser, useUpdateSettings } from '@/lib/backend';
import { mono } from '@/lib/theme';

/**
 * 94 · Data & privacy — the nav row with its caption, then a `gap 16` column
 * from canvas 120: the promise as a heading and its line, what you can take
 * with you, what you can switch off, and the warning under `Delete account`.
 *
 * `Pause analytics` is the one live control (`settings.pauseAnalytics`, read by
 * the RevenueCat provider); the other four rows were inert before this drop and
 * stay so — the frame draws them as doors, nothing behind them exists yet. The
 * column scrolls between the nav and the screen's foot if it has to (D320).
 * The switch waits for the account, as on App lock, so it never opens on the
 * default and slides to the stored value.
 */

export default function Privacy() {
  const router = useRouter();
  const user = useCurrentUser();
  const update = useUpdateSettings();
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  if (user === undefined) return <LoadingView onBack={back} />;
  const pauseAnalytics = user?.settings.pauseAnalytics ?? false;

  return (
    <Screen>
      <NavBar left="back" centre={{ title: 'Data & privacy' }} right="empty" onBack={back} />

      <ScrollRegion top={100} contentStyle={{ paddingTop: 20, paddingHorizontal: 24, paddingBottom: 24, gap: 16 }}>
        <MonoText v="h1">Yours, and only yours.</MonoText>
        <MonoText v="p">Your journal, urges and log stay on your device and your private account. We never sell your data, ever.</MonoText>
        <View style={{ height: 2 }} />

        <RowGroup label="Your data">
          <Row label="Export my data" value="JSON" />
          <Row label="Privacy policy" />
          <Row label="Terms of service" />
        </RowGroup>

        <RowGroup label="Controls">
          <Row label="Pause analytics" toggle={{ value: pauseAnalytics, onChange: (next) => void update({ pauseAnalytics: next }) }} />
          <Row label="Delete account" muted />
        </RowGroup>

        <MonoText v="p" color={mono.mute} style={{ fontSize: 13, lineHeight: 19 }}>
          Deleting your account erases your journal, urges and log permanently. This can’t be undone.
        </MonoText>
      </ScrollRegion>
    </Screen>
  );
}
