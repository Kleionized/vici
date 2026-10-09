/**
 * The two documents every door into an account or a subscription has to
 * reach: the Terms of Use and the Privacy Policy (App Store 3.1.2, 5.1.1).
 *
 * - Terms default to Apple's standard licensed-application EULA, which is what
 *   an App Store app is under unless it ships its own; set
 *   `EXPO_PUBLIC_TERMS_URL` to the app's own terms to replace it.
 * - The privacy policy is VICI's own (`src/content/privacyPolicy.json`) and is
 *   always available in the app at `/legal/privacy` (D521). When
 *   `EXPO_PUBLIC_PRIVACY_URL` points at a hosted copy (built from the same
 *   text), links open that instead; App Store Connect needs that public URL.
 * - `EXPO_PUBLIC_PRIVACY_EMAIL` is where privacy questions go, shown in the
 *   policy's Contact section.
 *
 * Expo inlines `EXPO_PUBLIC_*` at build time, so each is read by its full name.
 */

import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Linking } from 'react-native';

export const APPLE_STANDARD_EULA = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';

const RAW_TERMS = process.env.EXPO_PUBLIC_TERMS_URL ?? '';
const RAW_PRIVACY = process.env.EXPO_PUBLIC_PRIVACY_URL ?? '';

export const TERMS_URL: string = RAW_TERMS.trim() || APPLE_STANDARD_EULA;
export const PRIVACY_URL: string = RAW_PRIVACY.trim();
export const PRIVACY_EMAIL: string = (process.env.EXPO_PUBLIC_PRIVACY_EMAIL ?? '').trim();

/** The in-app copy of the privacy policy. */
export const PRIVACY_ROUTE = '/legal/privacy';

export type LegalKind = 'terms' | 'privacy';

export function legalUrl(kind: LegalKind): string {
  return kind === 'terms' ? TERMS_URL : PRIVACY_URL;
}

/** Whether the document has somewhere to open: always, now the policy ships in the app. */
export function hasLegal(_kind: LegalKind): boolean {
  return true;
}

/**
 * Open the document: the privacy policy in the app unless a hosted copy is
 * configured; anything with a URL in the in-app browser (SFSafariViewController
 * / Custom Tabs; a new tab on web — call it straight from the tap), falling
 * back to the system browser. Resolves false when nothing could open it.
 */
export async function openLegal(kind: LegalKind): Promise<boolean> {
  const url = legalUrl(kind);
  if (!url) {
    if (kind !== 'privacy') return false;
    router.push(PRIVACY_ROUTE as never);
    return true;
  }
  try {
    await WebBrowser.openBrowserAsync(url, { dismissButtonStyle: 'done' });
    return true;
  } catch {
    try {
      await Linking.openURL(url);
      return true;
    } catch {
      return false;
    }
  }
}
