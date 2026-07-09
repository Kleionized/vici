/**
 * Local persistence helpers.
 *
 *  - `secure*`  → expo-secure-store, for anything sensitive (e.g. the mock auth
 *    session token). Values are small strings.
 *  - `getJSON` / `setJSON` → AsyncStorage, for everything else (mock data layer,
 *    in-progress urge session, onboarding draft).
 *
 * Source of truth for real data is Convex; this layer backs the offline mock and
 * the genuinely-ephemeral local state (build spec §2).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// expo-secure-store has no web implementation, so on web the secure* helpers
// would silently no-op and the session would be lost on every reload. Fall
// back to AsyncStorage (localStorage-backed) on web to keep it usable.
const WEB = Platform.OS === 'web';

export async function getJSON<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function setJSON(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // best-effort; mock layer tolerates a failed write
  }
}

export async function removeKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export async function secureGet(key: string): Promise<string | null> {
  try {
    return WEB ? await AsyncStorage.getItem(key) : await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

export async function secureSet(key: string, value: string): Promise<void> {
  try {
    if (WEB) await AsyncStorage.setItem(key, value);
    else await SecureStore.setItemAsync(key, value);
  } catch {
    // ignore
  }
}

export async function secureDelete(key: string): Promise<void> {
  try {
    if (WEB) await AsyncStorage.removeItem(key);
    else await SecureStore.deleteItemAsync(key);
  } catch {
    // ignore
  }
}
