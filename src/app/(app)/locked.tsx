import { useRouter } from 'expo-router';
import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { AppText, Glyph, Screen, ScreenHeader } from '@/components/ui';
import { colors, fonts, sans } from '@/lib/theme';

/**
 * The locked curriculum (canvas: money · LockedScreen) — week I walked,
 * the weeks beyond as ghosted rows, then the road disappearing into the
 * mist: "11 more weeks ahead", and the unlock pill.
 */

const LOCKED: [string, string][] = [
  ['Week II · Riding the wave', 'Urge surfing & the 20-minute rule'],
  ['Week III · Your triggers, mapped', 'Spot the leading indicators early'],
  ['Week IV · Never fail twice', 'A plan for the moment after a lapse'],
];

// the road ahead, lost in mist — the locked curriculum's vignette
function MistPathArt() {
  const lit = '#EDEAE0';
  const shade = '#D9D5C7';
  const path = '#CBC6B4';
  const ink = '#4A4A42';
  return (
    <Svg width={240} height={112} viewBox="0 0 240 112" fill="none">
      <Path d="M8 94 a112 13 0 1 0 224 0 a112 13 0 1 0 -224 0" fill={lit} />
      <Path d="M36 100 C 80 96 150 96 202 100 C 160 106 84 106 36 100 Z" fill={shade} opacity={0.5} />
      <Path d="M102 108 C 110 94 120 84 128 76 C 134 70 137 63 135 56 L126 56 C 127 63 123 69 117 75 C 108 84 98 94 90 108 Z" fill={path} />
      <G opacity={0.45}>
        <Path d="M166 42 L166 20" stroke={ink} strokeWidth={2} strokeLinecap="round" />
        <Path d="M166 21 L151 25.5 L166 31 Z" fill={ink} />
      </G>
      <Path
        d="M18 56 C 32 46 56 42 80 46 C 90 36 114 34 128 42 C 146 34 174 36 190 44 C 206 40 220 44 226 50 C 232 56 226 62 214 62 L38 62 C 26 62 18 60 18 56 Z"
        fill="#FBFAF4"
        opacity={0.95}
      />
      <Path d="M38 66 C 78 62 148 62 202 66 C 168 72 88 72 38 66 Z" fill="#FFFFFF" opacity={0.7} />
    </Svg>
  );
}

export default function Locked() {
  const router = useRouter();
  return (
    <Screen contentStyle={{ paddingTop: 8, flexGrow: 1 }}>
      <ScreenHeader eyebrow="Curriculum" title="Weeks" pad={0} onBack={() => (router.canGoBack() ? router.back() : router.replace('/(app)/weeks'))} />

      {/* week 1 — walked */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 18, paddingBottom: 18 }}>
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
            <Path d="M5 12.5l4.5 4.5L19 7" stroke={colors.inkText} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>
        <View style={{ flex: 1 }}>
          <AppText style={[sans('500'), { fontSize: 14.5, color: colors.text }]}>Week I · The first calm</AppText>
          <AppText style={[sans('400'), { fontSize: 13, color: colors.textMuted, marginTop: 2 }]}>Completed · 5 lessons</AppText>
        </View>
      </View>

      {/* the weeks beyond — ghosted rows, hairline separated */}
      {LOCKED.map(([t, s]) => (
        <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 15, borderTopWidth: 1, borderTopColor: colors.border, opacity: 0.55 }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
              {Glyph.lock(colors.textMuted)}
            </Svg>
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={[sans('500'), { fontSize: 14.5, color: colors.text }]}>{t}</AppText>
            <AppText style={[sans('400'), { fontSize: 13, color: colors.textMuted, marginTop: 2 }]}>{s}</AppText>
          </View>
        </View>
      ))}

      <View style={{ flex: 1 }} />

      {/* the road continues into the mist */}
      <View style={{ alignItems: 'center', paddingBottom: 18 }}>
        <MistPathArt />
        <AppText style={{ fontFamily: fonts.serif, fontSize: 21, letterSpacing: 0.1, color: colors.text, marginTop: 8 }}>11 more weeks ahead</AppText>
        <AppText center style={[sans('400'), { fontSize: 14, lineHeight: 20.5, color: colors.textMuted, marginTop: 8, maxWidth: 270 }]}>
          You’ve finished week one. The road carries on past the mist.
        </AppText>
        <View style={{ alignSelf: 'stretch', marginTop: 18 }}>
          <AppText
            onPress={() => router.push('/paywall')}
            center
            style={[sans('600'), { fontSize: 15.5, color: colors.inkText, backgroundColor: colors.ink, borderRadius: 9999, paddingVertical: 16, overflow: 'hidden' }]}>
            Unlock VICI
          </AppText>
        </View>
      </View>
    </Screen>
  );
}
