import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { GhostLink, MonoText, NavBar, PrimaryButton, Row, RowGroup, Screen, ScrollRegion } from '@/components/mono';
import { mono } from '@/lib/theme';

/**
 * Back Tap — how to put the urge tool on a double tap of the phone's back. No
 * frame draws it (it is a settings sub-page, reached from All); it is set after
 * `App Lock` (settings.md §12): the nav row with its caption, a 76 ink disc with
 * the wave in `#111111`, the line centred under it, the four steps in a ruled
 * card, the link they point to under them as one settings row (tap to copy —
 * step 2 says "the link below"; it used to sit above the steps), the footnote,
 * and the two actions as the frames' primary + ghost pair. The copy is the
 * screen's own (CRITIC G12).
 *
 * Between the nav and the pair the column scrolls (D320).
 */

/**
 * The link the Shortcut opens: the app's own URL scheme (app.json `scheme`,
 * read from the build's config so a renamed scheme follows on its own) and
 * the SOS route. "Test it now" opens that same route, so the test is the
 * shortcut (D468).
 */
function appScheme(): string {
  const scheme = Constants.expoConfig?.scheme;
  return (Array.isArray(scheme) ? scheme[0] : scheme) || 'tideline';
}
const URGE_ROUTE = '/urge';
const DEEP_LINK = `${appScheme()}:/${URGE_ROUTE}`;

const STEPS = [
  'Open the Shortcuts app and tap + to create a new shortcut.',
  'Add the “Open URLs” action and paste the link below.',
  'Name it something like “Ride it out” and save.',
  // the menu names hold together (no-break spaces): a 430 phone broke `Back | Tap`;
  // each arrow holds to the name before it, so no line opens on `→` (393 broke
  // `Touch | → Back Tap`)
  'Go to Settings\u00a0→ Accessibility\u00a0→ Touch\u00a0→ Back\u00a0Tap\u00a0→ Double\u00a0Tap, and pick your shortcut.',
];

/** the primary's top off the screen's foot (58 at `bottom 96`); the column stops 16 above it */
const CONTROLS = 96 + 58;

function Wave() {
  return (
    <Svg width={30} height={30} viewBox="0 0 24 24">
      <Path d="M2 9c2.5-3 4.5-3 7 0s4.5 3 7 0 4.5-3 6-1.5M2 15c2.5-3 4.5-3 7 0s4.5 3 7 0 4.5-3 6-1.5" fill="none" stroke={mono.onInk} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function BackTap() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  async function copy() {
    await Clipboard.setStringAsync(DEEP_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }
  const openShortcuts = () => Linking.openURL('shortcuts://').catch(() => {});

  return (
    <Screen>
      <NavBar left="back" centre={{ title: 'Back Tap' }} right="empty" onBack={back} />

      <ScrollRegion top={100} bottom={CONTROLS + 16} contentStyle={{ paddingTop: 24, paddingHorizontal: 24, paddingBottom: 24, gap: 14 }}>
        <View style={{ alignSelf: 'center', width: 76, height: 76, borderRadius: 38, backgroundColor: mono.ink, alignItems: 'center', justifyContent: 'center' }}>
          <Wave />
        </View>
        <MonoText v="p" center style={{ marginTop: 8 }}>
          Double-tap the back of your iPhone to open the urge tool from anywhere. It works through an iOS Shortcut.
        </MonoText>
        <View style={{ height: 4 }} />

        <View style={{ borderRadius: 20, backgroundColor: mono.card, overflow: 'hidden' }}>
          {STEPS.map((step, i) => (
            <View
              key={i}
              style={[
                { flexDirection: 'row', gap: 14, paddingVertical: 16, paddingHorizontal: 18 },
                i > 0 ? { borderTopWidth: 1, borderTopColor: mono.line } : null,
              ]}>
              <MonoText v="rowLabel" color={mono.mute} style={{ width: 12, lineHeight: 22 }}>
                {i + 1}
              </MonoText>
              <MonoText v="pTight" color={mono.ink} style={{ flex: 1 }}>
                {step}
              </MonoText>
            </View>
          ))}
        </View>

        {/* after the steps: step 2 says "paste the link below" */}
        <RowGroup label="Shortcut link">
          <Row label={DEEP_LINK} value={copied ? 'Copied' : 'Copy'} chevron={false} onPress={() => void copy()} accessibilityLabel="Copy the shortcut link" />
        </RowGroup>

        <MonoText v="p" color={mono.mute} style={{ fontSize: 13, lineHeight: 19 }}>
          Back Tap is an iOS accessibility setting, so it’s set up once on your phone. VICI only provides the link it opens.
        </MonoText>
      </ScrollRegion>

      <PrimaryButton label="Open Shortcuts app" bottom={96} onPress={openShortcuts} />
      <GhostLink label="Test it now" onPress={() => router.push(URGE_ROUTE)} />
    </Screen>
  );
}
