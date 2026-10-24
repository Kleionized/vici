import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Platform } from 'react-native';

/**
 * The app's three touches (D59): a light tap when a choice is made, a success
 * when something is completed, and a tick when a lesson's page turns. Phones
 * only; a device without a haptic engine, or one that refuses, is ignored.
 */
const PHONE = Platform.OS === 'ios' || Platform.OS === 'android';

const quiet = (p: Promise<void>) => void p.catch(() => {});

export const haptic = {
  /** a chip, an option, a tile, a scale step, a switch */
  choice() {
    if (PHONE) quiet(Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
  },
  /** a check-in closed, an urge logged, a lesson finished, a medallion earned */
  success() {
    if (PHONE) quiet(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
  },
  /** a lesson page turning */
  tick() {
    if (PHONE) quiet(Haptics.selectionAsync());
  },
};

/** The success touch, once, when the board that shows a completion opens. */
export function useSuccessHaptic(when = true) {
  useEffect(() => {
    if (when) haptic.success();
  }, [when]);
}

/**
 * The hold boards' touches (D64): a press that grows as a hold fills, and the
 * heavy drop a streak counter makes when it falls to zero.
 */
export const holdHaptic = {
  /** 0 to 1: light, then medium, then heavy as the hold fills */
  step(progress: number) {
    if (!PHONE) return;
    const s = progress < 0.4 ? Haptics.ImpactFeedbackStyle.Light : progress < 0.8 ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Heavy;
    quiet(Haptics.impactAsync(s));
  },
  /** a hold let go before it filled */
  release() {
    if (PHONE) quiet(Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft));
  },
  /** the counter hitting zero */
  thud() {
    if (PHONE) quiet(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
  },
};
