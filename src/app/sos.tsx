import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import Svg, { Path, SvgXml } from 'react-native-svg';

import { NavBar, Screen, Tap, WrapText } from '@/components/mono';
import { SOS_CHOOSER_ART } from '@/content/sosChooserArt';
import { mono, sans } from '@/lib/theme';

/**
 * `97 · SOS — Urge or Relapse` (`Vici UI 2`, section SOS — ENTRY): what the
 * SOS tab opens. An urge goes to the SOS (`/urge`); a relapse to the relapse
 * flow (`/slip`).
 *
 * The frame: ✕ alone on the nav row; at 120, "What's happening?" and, 20
 * below, two 288-tall cards 12 apart (`r22`, `#1E1E1E`, padding 18 20 20), each
 * its drawing over a title (20/700, −0.3), a line (14/400/20 mute) and a
 * chevron.
 */
const CARDS = [
  { key: 'urge', title: 'An urge', line: 'It’s here and you haven’t acted on it', route: '/urge' },
  { key: 'relapse', title: 'A relapse', line: 'It already happened. Stop it here.', route: '/slip' },
] as const;

export default function SosChooser() {
  const router = useRouter();
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));
  return (
    <Screen>
      <NavBar left="empty" right="close" onClose={close} />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 120, gap: 20 }}>
        <WrapText style={{ ...sans('700'), fontSize: 26, letterSpacing: -0.6, lineHeight: 33, color: mono.ink }} w={345}>
          What’s happening?
        </WrapText>
        <View style={{ gap: 12 }}>
          {CARDS.map((c) => {
            const art = SOS_CHOOSER_ART[c.key];
            return (
              <Tap
                key={c.key}
                label={c.title}
                onPress={() => router.replace(c.route as never)}
                style={{ height: 288, borderRadius: 22, backgroundColor: mono.card, paddingTop: 18, paddingHorizontal: 20, paddingBottom: 20 }}>
                <View style={{ flex: 1, minHeight: 0, alignItems: 'center', justifyContent: 'center' }}>
                  <SvgXml xml={`<svg viewBox="${art.viewBox}" preserveAspectRatio="xMidYMid meet">${art.markup}</svg>`} width={305} height={176} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text maxFontSizeMultiplier={1.3} style={{ ...sans('700'), fontSize: 20, letterSpacing: -0.3, lineHeight: 24, color: mono.ink }}>
                      {c.title}
                    </Text>
                    <Text maxFontSizeMultiplier={1.3} style={{ ...sans('400'), fontSize: 14, lineHeight: 20, color: mono.mute }}>
                      {c.line}
                    </Text>
                  </View>
                  <Svg width={14} height={14} viewBox="0 0 14 14">
                    <Path d="M5 2l5 5-5 5" fill="none" stroke={mono.art} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </View>
              </Tap>
            );
          })}
        </View>
      </View>
    </Screen>
  );
}
