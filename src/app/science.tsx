import { useRouter } from 'expo-router';
import { Linking, View } from 'react-native';

import { Institutions } from '@/components/onboarding/science';
import { MonoText, NavBar, Screen, ScrollRegion, Tap } from '@/components/mono';
import { METHOD, NO_CLAIMS, NOT_AFFILIATED, STUDIES, URGE_STUDY } from '@/content/science';
import { mono } from '@/lib/theme';

/**
 * Settings › The science (D64): the method in three lines, where the studies
 * ran, each study with its finding, its limit and the paper, and what VICI
 * won't claim. The same sources as onboarding's research board
 * (`src/content/science.ts`).
 */
export default function Science() {
  const router = useRouter();
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));
  return (
    <Screen>
      <NavBar left="back" centre={{ title: 'The science' }} right="empty" onBack={back} />
      <ScrollRegion top={100} contentStyle={{ paddingTop: 20, paddingHorizontal: 24, paddingBottom: 40, gap: 16 }}>
        <MonoText v="h1">How VICI works.</MonoText>
        <MonoText v="p">VICI is built on acceptance and commitment therapy (ACT) and relapse prevention, methods tested in clinical trials. It keeps your record when you slip.</MonoText>

        <View style={{ gap: 6, marginTop: 8 }}>
          {METHOD.map((m, i) => (
            <View key={m.title} style={{ borderRadius: 16, backgroundColor: mono.card, padding: 16, flexDirection: 'row', gap: 14 }}>
              <MonoText v="rowValue" style={{ width: 14 }}>
                {String(i + 1)}
              </MonoText>
              <View style={{ flex: 1, gap: 2 }}>
                <MonoText v="rowLabel">{m.title}</MonoText>
                <MonoText v="p" style={{ fontSize: 14, lineHeight: 21 }}>
                  {m.body}
                </MonoText>
              </View>
            </View>
          ))}
        </View>

        <View style={{ gap: 12, marginTop: 12 }}>
          <MonoText v="caps">Where the studies ran</MonoText>
          <Institutions />
          <MonoText v="p" color={mono.mute} style={{ fontSize: 12, lineHeight: 18 }}>
            {NOT_AFFILIATED}
          </MonoText>
        </View>

        <View style={{ gap: 12, marginTop: 12 }}>
          <MonoText v="caps">The studies</MonoText>
          <View style={{ gap: 6 }}>
            {[...STUDIES, URGE_STUDY].map((s) => (
              <Tap key={s.id} onPress={() => void Linking.openURL(s.url).catch(() => {})} label={`${s.title} Open the paper.`} style={{ borderRadius: 16, backgroundColor: mono.card, padding: 16, gap: 6 }}>
                <MonoText v="caps">{s.source}</MonoText>
                <MonoText v="rowLabel">{s.title}</MonoText>
                <MonoText v="p" style={{ fontSize: 14, lineHeight: 21 }}>
                  {s.body}
                </MonoText>
                <MonoText v="p" color={mono.mute} style={{ fontSize: 12, lineHeight: 18 }}>
                  {`${s.authors}, ${s.institutions.join(', ')}. ${s.limit}`}
                </MonoText>
              </Tap>
            ))}
          </View>
        </View>

        <View style={{ gap: 12, marginTop: 12 }}>
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
