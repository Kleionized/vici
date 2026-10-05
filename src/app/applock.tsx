import { useRouter } from 'expo-router';
import { View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { LoadingView, MonoText, NavBar, Row, RowGroup, Screen, ScrollRegion } from '@/components/mono';
import { useCurrentUser, useUpdateSettings } from '@/lib/backend';
import type { UserSettings } from '@/lib/types';
import { mono } from '@/lib/theme';

/**
 * 95 · App lock — the padlock on a 76 ink disc at canvas 124, then a `gap 14`
 * column from 222: the heading and its line centred, the Lock and Privacy
 * groups, and the footnote.
 *
 * The three switches write `appLockFaceId` (default off), `appLockOnLeave`
 * (default off) and `hideSensitivePreviews` (default on); the row is the
 * control (role `switch`). `Ask after · Immediately` was inert before this drop
 * and stays so. Nothing in the app enforces the lock yet — unchanged. The
 * column scrolls between the nav and the screen's foot if it has to (D320).
 *
 * The switches wait for the account: drawn from the defaults first, the two
 * that default off opened off and slid on once the settings arrived (a cold
 * open — a reload, a deep link — showed it).
 */

type Flag = 'appLockFaceId' | 'appLockOnLeave' | 'hideSensitivePreviews';

export default function AppLock() {
  const router = useRouter();
  const user = useCurrentUser();
  const update = useUpdateSettings();
  const s = user?.settings;
  const flag = (key: Flag, def: boolean) => {
    const value = (s?.[key as keyof UserSettings] as boolean | undefined) ?? def;
    return { value, onChange: (next: boolean) => void update({ [key]: next }) };
  };
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  if (user === undefined) return <LoadingView onBack={back} />;

  return (
    <Screen>
      <NavBar left="back" centre={{ title: 'App lock' }} right="empty" onBack={back} />

      <ScrollRegion top={100} contentStyle={{ paddingTop: 24, paddingHorizontal: 24, paddingBottom: 24 }}>
        {/* the frame's disc keeps the kit's palette inverted: a `#111111` padlock
            with an ink keyhole on the ink disc */}
        <View style={{ alignSelf: 'center', width: 76, height: 76, borderRadius: 38, backgroundColor: mono.ink, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={30} height={30} viewBox="0 0 30 30">
            <Rect width={18} height={13} x={6} y={13} rx={3.5} fill={mono.onInk} />
            <Path d="M10 13V9.5a5 5 0 0 1 10 0V13" fill="none" stroke={mono.onInk} strokeWidth={2.6} />
            <Circle cx={15} cy={19.5} r={2} fill={mono.ink} />
          </Svg>
        </View>

        {/* 124 + 76 = 200; the column starts at 222 */}
        <View style={{ marginTop: 22, gap: 14 }}>
          <MonoText v="h1" center>
            Only opens for you.
          </MonoText>
          <MonoText v="p" center>
            This work is personal. Keep VICI behind Face ID so it opens only for you.
          </MonoText>
          <View style={{ height: 4 }} />
          <RowGroup label="Lock">
            <Row label="Require Face ID" toggle={flag('appLockFaceId', false)} />
            <Row label="Lock when I leave the app" toggle={flag('appLockOnLeave', false)} />
            <Row label="Ask after" value="Immediately" />
          </RowGroup>
          <RowGroup label="Privacy">
            <Row label="Hide sensitive previews" toggle={flag('hideSensitivePreviews', true)} />
          </RowGroup>
          <MonoText v="p" color={mono.mute} style={{ fontSize: 13, lineHeight: 19 }}>
            Hides journal previews and entry titles in notifications and the app switcher.
          </MonoText>
        </View>
      </ScrollRegion>
    </Screen>
  );
}
