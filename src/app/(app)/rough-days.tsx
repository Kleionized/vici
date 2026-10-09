import { useRouter } from 'expo-router';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { ChevronR, MonoText, NavBar, Row, RowGroup, Screen, ScrollRegion, Tap } from '@/components/mono';
import { RD_KEYS, RD_PROTOCOLS } from '@/content/roughDays';
import { lhNormal, mono, sans } from '@/lib/theme';

/**
 * Rough days — the shelf the seven protocols sit on, with the universal
 * interrupt on top. No frame draws it (routes §4.6), so it is set in the
 * system's list idiom, after `Settings`: the nav row with its caption, then
 * captioned groups from canvas 120, `gap 18`. The interrupt is the card Today
 * III draws for "Urge surfing" (`r24 #1E1E1E`, padding `18 20`, a 52 ink disc
 * with the stopwatch, title 18/700, line 14/400 sub, chevron); the seven are one
 * settings group. The copy is the screen's own (CRITIC G12); the interrupt's
 * name is in the case the flow's first board ("The first 90 seconds.") and the
 * All drawer give it.
 *
 * Between the nav and the screen's foot the column scrolls (D320); at 393 × 852
 * it fits and nothing moves.
 *
 * Back goes through the tabs' history (D340) — to the All drawer, the shelf's
 * one door; opened cold it falls back there too (the Library tab is the week
 * pages now and has no link here).
 */

function Stopwatch() {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26">
      <Circle cx={13} cy={15} r={8} fill="none" stroke="#111111" strokeWidth={2.4} />
      <Path d="M13 15V10M13 3h0M10 3h6M13 3v4" stroke="#111111" strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  );
}

export default function RoughDays() {
  const router = useRouter();

  return (
    <Screen>
      <NavBar
        left="back"
        centre={{ title: 'Rough days' }}
        onBack={() => (router.canGoBack() ? router.back() : router.navigate('/(app)/all'))}
      />
      <ScrollRegion top={100} contentStyle={{ paddingTop: 20, paddingHorizontal: 24, paddingBottom: 48, gap: 18 }}>
        <View style={{ gap: 10 }}>
          <MonoText v="caps">For any urge</MonoText>
          <Tap
            onPress={() => router.push('/rough-first90')}
            style={{ borderRadius: 24, backgroundColor: mono.card, paddingVertical: 18, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: mono.ink, alignItems: 'center', justifyContent: 'center' }}>
              <Stopwatch />
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <MonoText v="p" wrap="wrap" color={mono.ink} style={{ ...sans('700'), fontSize: 18, lineHeight: lhNormal(18) }}>
                The first 90 seconds
              </MonoText>
              <MonoText v="p" wrap="pretty" style={{ fontSize: 14, lineHeight: lhNormal(14) }}>
                Three moves for when an urge hits.
              </MonoText>
            </View>
            <ChevronR color={mono.mute} />
          </Tap>
        </View>
        <RowGroup label="What today feels like">
          {RD_KEYS.map((key) => (
            <Row key={key} label={RD_PROTOCOLS[key].title} onPress={() => router.push({ pathname: '/rough-protocol', params: { key } })} />
          ))}
        </RowGroup>
      </ScrollRegion>
    </Screen>
  );
}
