/**
 * Haptics — one vocabulary for the whole app, so the same kind of moment always
 * feels the same under the thumb.
 *
 *   tap       a button or row was pressed (very light; most presses)
 *   select    a choice changed — a chip, a radio row, a wheel step, a tab
 *   commit    a primary action was taken — Continue, Sign, Log
 *   success   something was finished — a check-in filed, a wave ridden out,
 *             a medallion struck
 *   warning   a gentle "stop and look" — never used for a slip itself (a lapse
 *             is data, not failure: invariant #2)
 *   soft      the breath pacer's in/out, a sheet settling
 *
 * Every call is fire-and-forget and swallowed: a device without a Taptic
 * engine, the web, or a simulator simply does nothing. Calls are throttled so
 * a fast scroll through a wheel cannot buzz continuously, and the whole thing
 * can be turned off from Settings (`setHapticsEnabled`).
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { getJSON, setJSON } from '@/lib/storage';

export type HapticKind = 'tap' | 'select' | 'commit' | 'success' | 'warning' | 'soft';

const KEY = 'tideline.haptics.enabled';
const SUPPORTED = Platform.OS === 'ios' || Platform.OS === 'android';
/** The least gap between two haptics of the same kind. */
const MIN_GAP_MS: Record<HapticKind, number> = { tap: 40, select: 35, commit: 80, success: 250, warning: 250, soft: 60 };

let enabled = true;
const last: Partial<Record<HapticKind, number>> = {};

void getJSON<boolean>(KEY).then((stored) => {
  if (stored === false) enabled = false;
});

export function hapticsEnabled(): boolean {
  return enabled;
}

export async function setHapticsEnabled(on: boolean): Promise<void> {
  enabled = on;
  await setJSON(KEY, on);
}

/** Play one haptic. Safe to call anywhere, any time. */
export function haptic(kind: HapticKind = 'tap'): void {
  if (!SUPPORTED || !enabled) return;
  const now = Date.now();
  if (now - (last[kind] ?? 0) < MIN_GAP_MS[kind]) return;
  last[kind] = now;
  let p: Promise<void>;
  switch (kind) {
    case 'tap':
      p = Platform.OS === 'android' ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Virtual_Key) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      break;
    case 'select':
      p = Platform.OS === 'android' ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Segment_Tick) : Haptics.selectionAsync();
      break;
    case 'commit':
      p = Platform.OS === 'android' ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      break;
    case 'success':
      p = Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      break;
    case 'warning':
      p = Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      break;
    case 'soft':
      p = Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      break;
  }
  p.catch(() => {});
}
