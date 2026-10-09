/**
 * What this phone keeps outside the account: letter and post delivery flags,
 * report-seen marks, check-in times and days, SOS settings, an urge session in
 * progress — every `tideline.*` AsyncStorage key the screens write.
 *
 * Deleting an account clears them, so nothing of the deleted account is left
 * on the phone for the next person to open. The mock build's own account
 * book (`tideline.mock.*`) is the offline stand-in for the server and is left
 * to the mock auth and store, which remove the deleted account's entries.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_PREFIX = 'tideline.';
const KEEP_PREFIX = 'tideline.mock.';

export async function clearDeviceState(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const doomed = keys.filter((k) => k.startsWith(DEVICE_PREFIX) && !k.startsWith(KEEP_PREFIX));
    if (doomed.length) await AsyncStorage.multiRemove(doomed);
  } catch {
    // best-effort: the account and its server data are already gone
  }
}
