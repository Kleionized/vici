import { useRouter } from 'expo-router';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Seal, StudyCard } from '@/components/onboarding/science';
import { Glyph, MonoText, NavBar, riseStyle, Screen, ScrollRegion, STAGGER, useMotion } from '@/components/mono';
import { INSTITUTIONS, METHOD, NO_CLAIMS, NOT_AFFILIATED, STUDIES, URGE_STUDY } from '@/content/science';
import { mono } from '@/lib/theme';

/**
 * Settings › The science (D64, D67): the method as three pictograms, the
 * universities as seals, each study as its chart, and what VICI won't claim.
 * The same parts as onboarding's research board (`src/components/onboarding/science.tsx`).
 */
export default function Science() {
  const router = useRouter();
  const motion = useMotion();
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));
  return (
    <Screen>
      <NavBar left="back" centre={{ title: 'The science' }} right="empty" onBack={back} />
      <ScrollRegion top={100} contentStyle={{ paddingTop: 20, paddingHorizontal: 24, paddingBottom: 40, gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Glyph name="flask" size={28} color={mono.ink} />
          <MonoText v="h1">How VICI works.</MonoText>
        </View>
        <MonoText v="p">Built on ACT and relapse prevention, tested in clinical trials.</MonoText>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
          {METHOD.map((m, i) => (
            <Animated.View
              key={m.title}
              style={[{ flex: 1, height: 116, borderRadius: 18, backgroundColor: mono.card, padding: 14, justifyContent: 'space-between' }, riseStyle(motion, { delay: 120 + i * STAGGER * 2 })]}>
              <Glyph name={m.icon} size={26} color={mono.ink} />
              <MonoText v="rowLabel" wrap="wrap" style={{ fontSize: 14, lineHeight: 19 }}>
                {m.title}
              </MonoText>
            </Animated.View>
          ))}
        </View>

        <View style={{ gap: 14, marginTop: 16 }}>
          <MonoText v="caps">Where the studies ran</MonoText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 18, columnGap: 10 }}>
            {INSTITUTIONS.map((name) => (
              <Seal key={name} name={name} width={108} />
            ))}
          </View>
          <MonoText v="p" color={mono.mute} style={{ fontSize: 12, lineHeight: 18 }}>
            {NOT_AFFILIATED}
          </MonoText>
        </View>

        <View style={{ gap: 12, marginTop: 16 }}>
          <MonoText v="caps">The studies</MonoText>
          {[...STUDIES, URGE_STUDY].map((s) => (
            <StudyCard key={s.id} s={s} />
          ))}
        </View>

        <View style={{ gap: 12, marginTop: 16 }}>
          <MonoText v="caps">What we don’t claim</MonoText>
          <View style={{ borderRadius: 16, borderWidth: 1.5, borderColor: mono.line, padding: 16, gap: 8 }}>
            {NO_CLAIMS.lines.map((l) => (
              <MonoText key={l} v="p" style={{ fontSize: 14, lineHeight: 21 }}>
                {l}
              </MonoText>
            ))}
          </View>
        </View>
      </ScrollRegion>
    </Screen>
  );
}
