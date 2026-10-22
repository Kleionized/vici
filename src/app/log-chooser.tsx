import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ChevronR, Glyph, Hero, MonoText, NavBar, PrimaryButton, Screen, ScrollRegion, Tap, type GlyphName } from '@/components/mono';
import { checkinPartNow } from '@/lib/routines';
import { alpha, mono, sans } from '@/lib/theme';

/**
 * 90 · Log — Chooser. What is being logged: the day's check-in, an urge, or a
 * lapse. The Log tab opens this (D124); it draws no tab bar, and its ✕ goes on
 * to the log itself. Continue opens the chosen flow.
 *
 * The frame draws the urge row chosen with nothing tapped, so the urge is the
 * default (CRITIC §5, logs Q1).
 */

type Kind = { key: 'checkin' | 'urge' | 'lapse'; title: string; sub: string; route: string; glyph: GlyphName };

const OPTIONS: Kind[] = [
  { key: 'checkin', title: 'Daily check-in', sub: 'How today is going', route: '/checkin', glyph: 'sun' },
  { key: 'urge', title: 'An urge', sub: 'How strong, what fed it, what you did', route: '/urge-log', glyph: 'waves' },
  { key: 'lapse', title: 'A relapse', sub: 'When it happened and what led up to it', route: '/slip', glyph: 'again' },
];

/**
 * One 84 row (`r22, padding 0 20, gap 16`): a 44 disc (`#2E2E2E`, or black at
 * 0.08 on the ink row) holding the 22 solid glyph, the 17/700 title over
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
      {/* a filled disc holding the solid glyph (D55), not an outlined ring */}
      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: on ? alpha.black(0.08) : mono.line, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Glyph name={kind.glyph} size={22} color={fg} />
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
      <Hero id="notebook" top={481.5} controls={106} />
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
