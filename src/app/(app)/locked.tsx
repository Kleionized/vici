import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AppText, Glyph, Screen, ScreenHeader } from '@/components/ui';
import { SC, SCairn, SGull, SPine, lens } from '@/components/scene/SceneKit';
import { colors, fonts, sans, spacing } from '@/lib/theme';

// ── Locked curriculum (canvas: screens-money LockedScreen) — week one walked,
// the weeks beyond ghosted, and the road winding up into the mist. ──

const LOCKED: [string, string][] = [
  ['Week II · Riding the wave', 'Urge surfing & the 20-minute rule'],
  ['Week III · Your triggers, mapped', 'Spot the leading indicators early'],
  ['Week IV · Never fail twice', 'A plan for the moment after a lapse'],
];

export default function Locked() {
  const router = useRouter();
  return (
    <Screen contentStyle={{ paddingTop: spacing.md }}>
      <ScreenHeader eyebrow="Curriculum" title="Weeks" pad={0} />

      {/* week 1 — walked */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 10, paddingBottom: 18 }}>
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
          {Glyph.check(colors.inkText)}
        </View>
        <View style={{ flex: 1 }}>
          <AppText style={[sans('500'), { fontSize: 14.5, color: colors.text }]}>Week I · The first calm</AppText>
          <AppText style={[sans('400'), { fontSize: 13, color: colors.textMuted, marginTop: 2 }]}>Completed · 5 lessons</AppText>
        </View>
      </View>

      {/* the weeks beyond — ghosted, hairline separated */}
      {LOCKED.map(([t, s]) => (
        <View
          key={t}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 15, borderTopWidth: 1, borderTopColor: colors.border, opacity: 0.55 }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 19, height: 19 }}>{Glyph.lock(colors.textMuted)}</View>
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={[sans('500'), { fontSize: 14.5, color: colors.text }]}>{t}</AppText>
            <AppText style={[sans('400'), { fontSize: 13, color: colors.textMuted, marginTop: 2 }]}>{s}</AppText>
          </View>
        </View>
      ))}

      {/* the road continues into the mist */}
      <View style={{ alignItems: 'center', marginTop: 40 }}>
        <MistPath />
        <AppText style={{ fontFamily: fonts.serif, fontSize: 21, letterSpacing: 0.2, color: colors.text, marginTop: 8 }}>
          11 more weeks ahead
        </AppText>
        <AppText center variant="muted" style={{ fontSize: 14, lineHeight: 20, marginTop: 8, maxWidth: 270 }}>
          You’ve finished week one. The road carries on past the mist.
        </AppText>
        <Pressable
          onPress={() => router.push('/paywall')}
          style={{ alignSelf: 'stretch', marginTop: 18, backgroundColor: colors.ink, borderRadius: 9999, paddingVertical: 17, alignItems: 'center' }}>
          <AppText style={[sans('600'), { fontSize: 15.5, color: colors.inkText }]}>Unlock tideline</AppText>
        </Pressable>
      </View>
    </Screen>
  );
}

function MistPath() {
  return (
    <Svg width={240} height={112} viewBox="0 0 240 112" fill="none">
      <Path d={lens(120, 94, 112, 13)} fill={SC.fgLit} />
      <Path d="M36 100 C 80 96 150 96 202 100 C 160 106 84 106 36 100 Z" fill={SC.fgShade} opacity={0.5} />
      {/* the path, winding up and into the mist */}
      <Path d="M102 108 C 110 94 120 84 128 76 C 134 70 137 63 135 56 L126 56 C 127 63 123 69 117 75 C 108 84 98 94 90 108 Z" fill={SC.path} />
      {/* the summit flag beyond, faint */}
      <Path d="M166 42 L166 20" stroke={SC.ink} strokeWidth={2} strokeLinecap="round" opacity={0.45} />
      <Path d="M166 21 L151 25.5 L166 31 Z" fill={SC.ink} opacity={0.45} />
      {/* mist bank swallowing the road */}
      <Path d="M18 56 C 32 46 56 42 80 46 C 90 36 114 34 128 42 C 146 34 174 36 190 44 C 206 40 220 44 226 50 C 232 56 226 62 214 62 L38 62 C 26 62 18 60 18 56 Z" fill="#FBFAF4" opacity={0.95} />
      <Path d="M38 66 C 78 62 148 62 202 66 C 168 72 88 72 38 66 Z" fill="#FFFFFF" opacity={0.7} />
      <SPine x={46} y={94} s={0.8} />
      <SCairn x={196} y={90} s={0.7} />
      <SGull x={58} y={24} s={0.75} o={0.4} />
    </Svg>
  );
}
