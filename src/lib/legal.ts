/**
 * The two documents every door into an account or a subscription has to
 * reach: the Terms of Use and the Privacy Policy (App Store 3.1.2, 5.1.1).
 *
 * - Terms default to Apple's standard licensed-application EULA, which is what
 *   an App Store app is under unless it ships its own; set
 *   `EXPO_PUBLIC_TERMS_URL` to the app's own terms to replace it.
 * - The privacy policy has no default — it has to be VICI's own, hosted page:
 *   `EXPO_PUBLIC_PRIVACY_URL`. Until it is set, `PRIVACY_URL` is empty and the
 *   screens say the policy is still to be linked rather than drawing a dead
 *   link (a release build refuses to start without it).
 *
 * Expo inlines `EXPO_PUBLIC_*` at build time, so each is read by its full name.
 */

import * as WebBrowser from 'expo-web-browser';
import { Linking } from 'react-native';

export const APPLE_STANDARD_EULA = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';

const RAW_TERMS = process.env.EXPO_PUBLIC_TERMS_URL ?? '';
const RAW_PRIVACY = process.env.EXPO_PUBLIC_PRIVACY_URL ?? '';

export const TERMS_URL: string = RAW_TERMS.trim() || APPLE_STANDARD_EULA;
export const PRIVACY_URL: string = RAW_PRIVACY.trim();

export type LegalKind = 'terms' | 'privacy';

export function legalUrl(kind: LegalKind): string {
  return kind === 'terms' ? TERMS_URL : PRIVACY_URL;
}

/** Whether the document has somewhere to open (the terms always do). */
export function hasLegal(kind: LegalKind): boolean {
  return legalUrl(kind) !== '';
}

/**
 * Open the document in the in-app browser (SFSafariViewController / Custom
 * Tabs; a new tab on web — call it straight from the tap). Falls back to the
 * system browser if the in-app one can't start. Resolves false when there is
 * no URL to open or nothing could open it.
 */
export async function openLegal(kind: LegalKind): Promise<boolean> {
  const url = legalUrl(kind);
  if (!url) return false;
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
