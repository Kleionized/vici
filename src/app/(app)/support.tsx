import { useRouter } from 'expo-router';
import { Linking, View } from 'react-native';

import { GhostLink, MonoText, NavBar, Screen, ScrollRegion, Tap } from '@/components/mono';
import { lhNormal, mono, sans } from '@/lib/theme';

/**
 * Crisis / professional-help route (invariant #5). Tideline is NOT medical
 * advice. Real, localised resources are loaded by the human later — everything
 * here is a clearly-marked placeholder. TODO(jerry): replace with vetted,
 * region-aware crisis + professional-help resources.
 *
 * No frame draws it; it is set after `Data & privacy` (settings.md §12): the nav
 * row, the heading and its line, the resources as `#1E1E1E` r20 cards, the build
 * note in the footnote's 13/19, and the way back as the frames' ghost at
 * `bottom 48`. The column scrolls between the nav and the ghost (D320).
 */
const PLACEHOLDER_RESOURCES = [
  {
    name: '[PLACEHOLDER] Crisis line',
    detail: 'Add a real, region-appropriate 24/7 crisis number or text line here.',
    url: undefined as string | undefined,
  },
  {
    name: '[PLACEHOLDER] Find a therapist',
    detail: 'Link to a vetted directory for professional support.',
    url: undefined as string | undefined,
  },
];

/** the ghost's 18 line box at `bottom 48` */
const GHOST_RESERVE = 48 + 18;

export default function Support() {
  const router = useRouter();

  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  return (
    <Screen>
      {/* The way back is where it is on every other pushed screen — a screen
          someone opens in a bad moment must not make them scroll to leave. */}
      <NavBar left="back" right="empty" onBack={back} />

      <ScrollRegion top={100} bottom={GHOST_RESERVE} contentStyle={{ paddingTop: 20, paddingHorizontal: 24, paddingBottom: 24, gap: 16 }}>
        <MonoText v="h1">You’re not alone in this.</MonoText>
        <MonoText v="p">
          VICI is a self-help tool, not medical advice or a crisis service. If you’re in danger or thinking about harming yourself, please reach out to a real person now.
        </MonoText>
        <View style={{ height: 2 }} />

        {PLACEHOLDER_RESOURCES.map((r) => (
          <View key={r.name} style={{ borderRadius: 20, backgroundColor: mono.card, paddingVertical: 16, paddingHorizontal: 18, gap: 4 }}>
            <MonoText v="rowLabel" wrap="pretty">
              {r.name}
            </MonoText>
            <MonoText v="p" color={mono.mute} style={{ fontSize: 14, lineHeight: 20 }}>
              {r.detail}
            </MonoText>
            {r.url ? (
              <Tap onPress={() => Linking.openURL(r.url as string)} hitSlop={6} style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                <MonoText v="p" color={mono.ink} style={{ ...sans('700'), fontSize: 14, lineHeight: lhNormal(14) }}>
                  Open →
                </MonoText>
              </Tap>
            ) : null}
          </View>
        ))}

        <MonoText v="p" color={mono.mute} style={{ fontSize: 13, lineHeight: 19 }}>
          Note for the build: these are placeholders. Real crisis and professional-help resources must be added before this ships to anyone.
        </MonoText>
      </ScrollRegion>

      <GhostLink label="Back" bottom={48} onPress={back} />
    </Screen>
  );
}
