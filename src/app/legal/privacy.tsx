import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { MonoText, NavBar, Screen, ScrollRegion } from '@/components/mono';
import POLICY from '@/content/privacyPolicy.json';
import { PRIVACY_EMAIL } from '@/lib/legal';
import { mono, sans } from '@/lib/theme';

/**
 * VICI's privacy policy, in the app (D521). Every "Privacy policy" link opens
 * this page unless `EXPO_PUBLIC_PRIVACY_URL` points at a hosted copy; the same
 * text (`src/content/privacyPolicy.json`) builds the hostable page with
 * `node scripts/legal/build-privacy-html.mjs`, so the two never drift. It is a
 * top-level route, readable signed in or out — it is linked from sign-up.
 */

type Section = { heading: string; paragraphs?: string[]; bullets?: string[] };

/** The policy's one variable: who to write to. */
export function contactLine(): string {
  return PRIVACY_EMAIL
    ? `Questions about your privacy, or a request to use your rights: email ${PRIVACY_EMAIL}.`
    : 'Questions about your privacy, or a request to use your rights: use the support link on VICI’s App Store page.';
}

const fill = (text: string) => text.replace('{contact}', contactLine());

export default function PrivacyPolicy() {
  const router = useRouter();
  const back = () => (router.canGoBack() ? router.back() : router.replace('/'));
  return (
    <Screen>
      <NavBar left="back" centre={{ title: 'Privacy' }} right="empty" onBack={back} />
      <ScrollRegion top={100} contentStyle={{ paddingTop: 20, paddingHorizontal: 24, paddingBottom: 48 }}>
        <MonoText v="h1" accessibilityRole="header">
          {POLICY.title}
        </MonoText>
        <MonoText v="caps" style={{ marginTop: 10 }}>{`Effective ${POLICY.effective}`}</MonoText>
        <MonoText v="p" style={{ marginTop: 20 }}>
          {POLICY.intro}
        </MonoText>
        {(POLICY.sections as Section[]).map((s) => (
          <View key={s.heading} style={{ marginTop: 32, gap: 12 }}>
            <MonoText v="rowLabel" wrap="wrap" accessibilityRole="header" style={{ fontSize: 17, lineHeight: 23 }}>
              {s.heading}
            </MonoText>
            {(s.paragraphs ?? []).map((p) => (
              <MonoText key={p.slice(0, 40)} v="p">
                {fill(p)}
              </MonoText>
            ))}
            {(s.bullets ?? []).map((b) => (
              <View key={b.slice(0, 40)} style={{ flexDirection: 'row', gap: 10 }}>
                <Text style={{ ...sans('700'), fontSize: 15, lineHeight: 24, color: mono.mute }}>•</Text>
                <MonoText v="p" style={{ flex: 1 }}>
                  {b}
                </MonoText>
              </View>
            ))}
          </View>
        ))}
      </ScrollRegion>
    </Screen>
  );
}
