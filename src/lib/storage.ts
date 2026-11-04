/**
 * Local persistence helpers.
 *
 *  - `secure*`  → expo-secure-store (Keychain / Keystore), for small secrets
 *    such as the mock session token and the storage key below.
 *  - `getJSON` / `setJSON` → AsyncStorage, **encrypted at rest**: every value is
 *    sealed with AES-256-GCM under a per-install key that lives only in the
 *    Keychain/Keystore (device-only, available after first unlock). Someone
 *    with a copy of the app's files — a backup, a jailbroken phone's sandbox —
 *    sees `tl1:…`, not the journal, the urge log or the onboarding answers.
 *
 * Reading is tolerant: a value written before encryption existed is read as
 * plain JSON and sealed the next time it is written. If the platform cannot
 * encrypt (an old Expo Go, a key that cannot be made), values are stored as
 * before rather than lost — the app keeps working, just without the extra
 * layer. On web there is no keychain, so the key sits beside the data; that is
 * obfuscation, not protection, and the web build is a design preview only.
 *
 * Source of truth for real data is Convex; this layer backs the offline mock and
 * the genuinely-ephemeral local state (build spec §2).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AESEncryptionKey, AESKeySize, AESSealedData, aesDecryptAsync, aesEncryptAsync } from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// expo-secure-store has no web implementation, so on web the secure* helpers
// would silently no-op and the session would be lost on every reload. Fall
// back to AsyncStorage (localStorage-backed) on web to keep it usable.
const WEB = Platform.OS === 'web';

const SEALED = 'tl1:';
const KEY_NAME = 'tideline.storage.key.v1';
const SECURE_OPTS: SecureStore.SecureStoreOptions = { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY };

// ── utf-8, without relying on TextEncoder/TextDecoder being in the engine ──

function utf8Encode(s: string): Uint8Array {
  const out: number[] = [];
  for (let i = 0; i < s.length; i++) {
    let c = s.charCodeAt(i);
    if (c >= 0xd800 && c <= 0xdbff && i + 1 < s.length) {
      const d = s.charCodeAt(i + 1);
      if (d >= 0xdc00 && d <= 0xdfff) {
        c = 0x10000 + ((c - 0xd800) << 10) + (d - 0xdc00);
        i++;
      }
    }
    if (c < 0x80) out.push(c);
    else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
    else if (c < 0x10000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    else out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
  }
  return Uint8Array.from(out);
}

function utf8Decode(b: Uint8Array): string {
  let s = '';
  for (let i = 0; i < b.length; ) {
    const c = b[i++];
    let cp: number;
    if (c < 0x80) cp = c;
    else if (c < 0xe0) cp = ((c & 31) << 6) | (b[i++] & 63);
    else if (c < 0xf0) cp = ((c & 15) << 12) | ((b[i++] & 63) << 6) | (b[i++] & 63);
    else cp = ((c & 7) << 18) | ((b[i++] & 63) << 12) | ((b[i++] & 63) << 6) | (b[i++] & 63);
    if (cp >= 0x10000) {
      cp -= 0x10000;
      s += String.fromCharCode(0xd800 + (cp >> 10), 0xdc00 + (cp & 1023));
    } else s += String.fromCharCode(cp);
  }
  return s;
}

// ── the storage key ──────────────────────────────────────────────────

let keyPromise: Promise<AESEncryptionKey | null> | null = null;

async function storageKey(): Promise<AESEncryptionKey | null> {
  if (!keyPromise) {
    keyPromise = (async () => {
      try {
        const stored = await secureGet(KEY_NAME, SECURE_OPTS);
        if (stored) return await AESEncryptionKey.import(stored, 'base64');
        const key = await AESEncryptionKey.generate(AESKeySize.AES256);
        const encoded = await key.encoded('base64');
        await secureSet(KEY_NAME, encoded, SECURE_OPTS);
        // read it back: if the keychain did not keep it, encrypting would lose data on the next launch
        if ((await secureGet(KEY_NAME, SECURE_OPTS)) !== encoded) return null;
        return key;
      } catch {
        return null;
      }
    })();
  }
  return keyPromise;
}

async function sealString(plain: string): Promise<string> {
  const key = await storageKey();
  if (!key) return plain;
  try {
    const sealed = await aesEncryptAsync(utf8Encode(plain), key);
    return SEALED + (await sealed.combined('base64'));
  } catch {
    return plain;
  }
}

async function openString(raw: string): Promise<string | null> {
  if (!raw.startsWith(SEALED)) return raw; // legacy plaintext
  const key = await storageKey();
  if (!key) return null;
  try {
    const sealed = AESSealedData.fromCombined(raw.slice(SEALED.length));
    const bytes = await aesDecryptAsync(sealed, key, { output: 'bytes' });
    return utf8Decode(bytes);
  } catch {
    return null;
  }
}

// ── the API ──────────────────────────────────────────────────────────

export async function getJSON<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const plain = await openString(raw);
    return plain ? (JSON.parse(plain) as T) : null;
  } catch {
    return null;
  }
}

export async function setJSON(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, await sealString(JSON.stringify(value)));
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

/** Every key this app wrote — used when an account is deleted from the device. */
export async function removeKeysWithPrefix(prefix: string): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const mine = keys.filter((k) => k.startsWith(prefix));
    if (mine.length) await AsyncStorage.multiRemove(mine);
  } catch {
    // ignore
  }
}

export async function secureGet(key: string, opts?: SecureStore.SecureStoreOptions): Promise<string | null> {
  try {
    return WEB ? await AsyncStorage.getItem(key) : await SecureStore.getItemAsync(key, opts);
  } catch {
    return null;
  }
}

export async function secureSet(key: string, value: string, opts?: SecureStore.SecureStoreOptions): Promise<void> {
  try {
    if (WEB) await AsyncStorage.setItem(key, value);
    else await SecureStore.setItemAsync(key, value, opts);
  } catch {
    // ignore
  }
}

export async function secureDelete(key: string, opts?: SecureStore.SecureStoreOptions): Promise<void> {
  try {
    if (WEB) await AsyncStorage.removeItem(key);
    else await SecureStore.deleteItemAsync(key, opts);
  } catch {
    // ignore
  }
}
