import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Linking } from 'react-native';

import { GhostLink, MonoText, NavBar, Row, RowGroup, Screen, ScrollRegion } from '@/components/mono';
import { mono } from '@/lib/theme';

/**
 * Find support — the crisis and professional-help page (B2). VICI is a
 * self-help tool, not medical advice or a crisis service, and the page says so.
 *
 * The resource is one maintained international directory rather than a
 * hand-kept list of numbers: findahelpline.com lists free, confidential crisis
 * lines and text services by country and topic, and keeps them current, which
 * a list baked into an app release cannot (D470). The emergency line is
 * worded for every country rather than naming one number.
 *
 * No frame draws it; it is set after `Data & privacy` (settings.md §12): the
 * nav row, the heading and its line, the resource as a settings row group,
 * the notes in the footnote's mute, and the way back as the frames' ghost at
 * `bottom 48`. The column scrolls between the nav and the ghost (D320).
 */
const HELPLINES_URL = 'https://findahelpline.com';

/** the ghost's 18 line box at `bottom 48` */
const GHOST_RESERVE = 48 + 18;

/** In-app browser first (it keeps the user one tap from VICI); the system browser if that fails. */
function openHelplines() {
  WebBrowser.openBrowserAsync(HELPLINES_URL).catch(() => {
    Linking.openURL(HELPLINES_URL).catch(() => {});
  });
}

export default function Support() {
  const router = useRouter();

  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  return (
    <Screen>
      {/* The way back is where it is on every other pushed screen — a screen
          someone opens in a bad moment must not make them scroll to leave. */}
      <NavBar left="back" right="empty" onBack={back} />

      <ScrollRegion top={100} bottom={GHOST_RESERVE} contentStyle={{ paddingTop: 20, paddingHorizontal: 24, paddingBottom: 24, gap: 16 }}>
        <MonoText v="h1">Get help.</MonoText>
        <MonoText v="p" color={mono.ink}>
          If you’re in danger right now, call your local emergency number.
        </MonoText>
        <MonoText v="p">If you’re struggling and want to talk to someone, a helpline is free and confidential.</MonoText>

        <RowGroup label="Talk to someone" style={{ marginTop: 4 }}>
          <Row label="Find a helpline near you" onPress={openHelplines} accessibilityLabel="Find a helpline near you. Opens findahelpline.com" />
        </RowGroup>
        <MonoText v="p" color={mono.mute} style={{ fontSize: 14, lineHeight: 20 }}>
          findahelpline.com lists crisis lines and text services by country.
        </MonoText>

        <MonoText v="p" color={mono.mute} style={{ fontSize: 13, lineHeight: 19, marginTop: 8 }}>
          VICI is a self-help tool. It isn’t a crisis service or medical care, and it can’t respond to an emergency.
        </MonoText>
      </ScrollRegion>

      <GhostLink label="Back" bottom={48} onPress={back} />
    </Screen>
  );
}
