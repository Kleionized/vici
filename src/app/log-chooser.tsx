import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { ChevronR, Hero, MonoText, NavBar, PrimaryButton, Screen, ScrollRegion, Tap } from '@/components/mono';
import { checkinPartNow } from '@/lib/routines';
import { mono, ring, sans } from '@/lib/theme';

/**
 * 90 · Log — Chooser. What is being logged: the day's check-in, an urge, or a
 * lapse. The Log tab opens this (D124); it draws no tab bar, and its ✕ goes on
 * to the log itself. Continue opens the chosen flow.
 *
 * The frame draws the urge row chosen with nothing tapped, so the urge is the
 * default (CRITIC §5, logs Q1).
 */

type Kind = { key: 'checkin' | 'urge' | 'lapse'; title: string; sub: string; route: string; glyph: string };

const OPTIONS: Kind[] = [
  { key: 'checkin', title: 'Daily check-in', sub: 'Mood, energy, the pledge', route: '/checkin', glyph: 'M11 3v3M11 16v3M3 11h3M16 11h3M6 6l2 2M14 14l2 2M6 16l2-2M14 8l2-2' },
  { key: 'urge', title: 'An urge', sub: 'How strong, what fed it, what you did', route: '/urge-log', glyph: 'M3 15c3 0 4-6 8-6s5 6 8 6M3 18c3 0 4-3 8-3s5 3 8 3' },
  { key: 'lapse', title: 'A lapse', sub: 'When it happened, what fed it', route: '/lapse', glyph: 'M3 12c3 0 5-4 8-4s3 8 6 8 2-4 2-4' },
];

/**
 * One 84 row (`r22, padding 0 20, gap 16`): a 44 ring (outside 1.5 — line, or
 * `#111111` at 0.3 on the ink row) holding the 22 glyph, the 17/700 title over
 * the 13/400 line (gap 3), and a `#5A574F` chevron — or, chosen, the ink fill
 * with a 10 `#1E1E1E` dot.
 */
function KindRow({ kind, on, onPress }: { kind: Kind; on: boolean; onPress: () => void }) {
  const fg = on ? mono.onInk : mono.ink;
  return (
    <Tap
      onPress={onPress}
      accessibilityRole="radio"
      aria-checked={on}
      label={kind.title}
      style={{ height: 84, borderRadius: 22, paddingHorizontal: 20, gap: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: on ? mono.ink : mono.card }}>
      <View style={{ width: 44, height: 44, borderRadius: 22, boxShadow: on ? ring.outlineOnInk : ring.outline, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Svg width={22} height={22} viewBox="0 0 22 22">
          <Path d={kind.glyph} fill="none" stroke={fg} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <MonoText v="rowLabel" wrap="wrap" style={{ fontSize: 17, lineHeight: 21 }} color={fg}>
          {kind.title}
        </MonoText>
        {/* one line at 393; where a narrower phone wraps it, balance keeps "did" off a line of its own */}
        <MonoText v="pill" wrap="balance" style={sans('400')} color={on ? mono.onInkMuted : mono.mute}>
          {kind.sub}
        </MonoText>
      </View>
      {on ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: mono.card }} /> : <ChevronR color={mono.art} />}
    </Tap>
  );
}

export default function LogChooser() {
  const router = useRouter();
  const [picked, setPicked] = useState(1);

  return (
    <Screen>
      {/* the notebook is painted first, under everything, as the frame does; it
          drops out on a phone too short to hold it between the rows and the pill */}
      <Hero id="notebook" top={506} controls={106} />
      <NavBar left="empty" right="close" onClose={() => router.navigate('/(app)/log')} />
      <ScrollRegion top={100} bottom={106} contentStyle={{ paddingTop: 36, paddingHorizontal: 24, paddingBottom: 16 }}>
        <View style={{ gap: 14 }}>
          <MonoText v="h1">What are you logging?</MonoText>
          <View style={{ height: 6 }} />
          <View accessibilityRole="radiogroup" style={{ gap: 12 }}>
            {OPTIONS.map((kind, i) => (
              <KindRow key={kind.key} kind={kind} on={picked === i} onPress={() => setPicked(i)} />
            ))}
          </View>
        </View>
      </ScrollRegion>
      <PrimaryButton label="Continue" onPress={() => router.push((OPTIONS[picked].key === 'checkin' ? `/day/${checkinPartNow()}` : OPTIONS[picked].route) as never)} />
    </Screen>
  );
}
