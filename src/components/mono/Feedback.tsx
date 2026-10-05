import { useEffect, useState } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { mono } from '@/lib/theme';

import { NavBar } from './NavBar';
import { Spinner } from './Progress';
import { Screen, type ScreenVariant } from './Screen';
import { MonoText } from './Text';

/**
 * No frame draws a loading or an empty state (routes §7–8); these are the kit's
 * readings of them, in the frames' own vocabulary and nothing else.
 */

/** True once `ms` have passed — a wait shorter than that never shows a spinner. */
function useAfter(ms: number, enabled: boolean) {
  const [shown, setShown] = useState(enabled && ms <= 0);
  useEffect(() => {
    if (!enabled || ms <= 0) return;
    const t = setTimeout(() => setShown(true), ms);
    return () => clearTimeout(t);
  }, [ms, enabled]);
  return enabled && shown;
}

/** The wait's mark: the bundle's own spinner (Enlisting Aegis's 88), at icon size. */
const SPINNER_SIZE = 44;

/**
 * The wait. The frame's ground and noise (a mono `Screen`), and — only after
 * 300 ms, because mock data and most Convex reads land sooner and a spinner
 * that flashes reads as a fault — the bundle's one loading mark in the middle:
 * Enlisting Aegis's dotted ring and turning arc, drawn at 44 in `#9B968E`
 * rather than the platform's activity indicator, which no frame draws (D386).
 * A `label` shows at once, as it always did; the spinner's box is kept from
 * the start so the label does not jump when the mark arrives. Pass `onBack` /
 * `onClose` to keep the screen's way out drawn (the nav row's chevron / ✕)
 * while it waits.
 *
 * Its `Screen` sets light status glyphs, right for its own dark ground and for
 * every mono screen; `status={false}` leaves them to a caller that drops the
 * wait under a header of its own. (Several old paper screens still nest it
 * under a light header — milestones, journal — until their rebuild; the last
 * mounted `StatusBar` wins, so the light one is what shows there meanwhile.)
 *
 * `bare` drops the ground for a wait that sits inside a screen that already
 * painted one (a list under its header). `spinner={false}` is ground only —
 * Today's choice, where the screen appears at once in practice.
 */
export function LoadingView({
  label,
  onBack,
  onClose,
  variant = 'app',
  bare,
  spinner = true,
  delay = 300,
  status = true,
  style,
}: {
  label?: string;
  onBack?: () => void;
  onClose?: () => void;
  variant?: ScreenVariant;
  bare?: boolean;
  spinner?: boolean;
  delay?: number;
  /** set the light status glyphs (the `Screen` default) */
  status?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const shown = useAfter(delay, spinner);
  const body = (
    <View
      style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 24 }, style]}>
      {spinner ? <View style={{ width: SPINNER_SIZE, height: SPINNER_SIZE }}>{shown ? <Spinner size={SPINNER_SIZE} color={mono.mute} /> : null}</View> : null}
      {label ? (
        <MonoText v="pTight" center color={mono.mute}>
          {label}
        </MonoText>
      ) : null}
    </View>
  );
  if (bare) return body;
  return (
    <Screen variant={variant} status={status}>
      {onBack || onClose ? (
        <NavBar left={onBack ? 'back' : 'empty'} right={onClose ? 'close' : null} onBack={onBack} onClose={onClose} />
      ) : null}
      {body}
    </Screen>
  );
}

/**
 * Nothing to show yet. No illustration — the old paper `tide` art has no place
 * in a flat system — just the frames' type on the ground, centred, inside the
 * 24 gutter: an optional caps eyebrow (13/700 `#9B968E`), an optional title
 * (22/700/28, −0.6, ink — the sheets' heading; `h1` takes the 26/33 page
 * heading instead) and the line under it (15/400/24 `#9B968E`).
 */
export function EmptyState({
  caps,
  title,
  body,
  h1,
  style,
}: {
  caps?: string;
  title?: string;
  body?: string;
  h1?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  // routes §8 sets only the 24 gutter; the 32 above and below is the old
  // EmptyState's own (`spacing.xxl`), kept so the callers' lists keep their
  // spacing around it — `style` overrides it
  return (
    <View style={[{ alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 32 }, style]}>
      {caps ? (
        <MonoText v="caps" center>
          {caps}
        </MonoText>
      ) : null}
      {title ? (
        <MonoText v={h1 ? 'h1' : 'h1Sheet'} center style={{ alignSelf: 'stretch' }}>
          {title}
        </MonoText>
      ) : null}
      {body ? (
        <MonoText v="p" center color={mono.mute} style={{ alignSelf: 'stretch' }}>
          {body}
        </MonoText>
      ) : null}
    </View>
  );
}
