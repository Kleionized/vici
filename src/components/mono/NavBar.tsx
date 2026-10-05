import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { mono, monoDark } from '@/lib/theme';

import { ChevronL, CloseX, Share } from './icons';
import { Tap } from './Tap';
import { MonoText } from './Text';

const SLOP = { top: 4, bottom: 4, left: 12, right: 12 };

/**
 * The 8-dash step indicator: 24×2 r1 dashes, gap 6, ink up to the step and
 * line after it. The active count is `max(1, round(step/total·8))` — the
 * canvas's own rule, checked against every dashed frame.
 */
export function NavDashes({ step, total, tone = 'light' }: { step: number; total: number; tone?: 'light' | 'dark' }) {
  const on = Math.max(1, Math.round((step / total) * 8));
  const onC = tone === 'dark' ? monoDark.text : mono.ink;
  const offC = tone === 'dark' ? 'rgba(255,255,255,0.2)' : mono.line;
  return (
    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
      {Array.from({ length: 8 }, (_, i) => (
        <View key={i} style={{ width: 24, height: 2, borderRadius: 1, backgroundColor: i < on ? onC : offC }} />
      ))}
    </View>
  );
}

export type NavLeft = 'back' | 'none' | 'empty';
export type NavCentre = { title: string } | { step: number; total: number } | null;
export type NavRight =
  | 'close'
  | 'share'
  | 'empty'
  | { text: string; onPress?: () => void }
  | { node: ReactNode }
  | null;

/**
 * The nav row (design-system §7.1): `top 60, height 40, padding 0 22`, a 36×40
 * slot either side (80×40 when the right slot holds words) and the title or the
 * dashes centred between them. `left: 'none'` reserves nothing; `'empty'`
 * reserves the slot without a glyph (a row the frame keeps for alignment).
 *
 * Slots get `hitSlop` rather than growing: the box is the frame's, the finger
 * gets a little more.
 */
export function NavBar({
  left = 'back',
  centre = null,
  right = null,
  tone = 'light',
  onBack,
  onClose,
  onShare,
  chevronColor,
  top = 60,
  zIndex = 5,
  style,
}: {
  left?: NavLeft;
  centre?: NavCentre;
  right?: NavRight;
  tone?: 'light' | 'dark';
  onBack?: () => void;
  onClose?: () => void;
  onShare?: () => void;
  /** Cost By Age 80 strokes its chevron in the old light kit's `#17160F` — reproduce it there */
  chevronColor?: string;
  top?: number;
  zIndex?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const fg = tone === 'dark' ? monoDark.text : mono.ink;
  const wide = right != null && typeof right === 'object' && 'text' in right;
  const slotW = wide ? 80 : 36;

  let leftEl: ReactNode = null;
  if (left === 'back') {
    leftEl = (
      <Tap label="Back" onPress={onBack} hitSlop={SLOP} style={{ width: slotW, height: 40, justifyContent: 'center' }}>
        <ChevronL color={chevronColor ?? fg} />
      </Tap>
    );
  } else if (left === 'empty') {
    leftEl = <View style={{ width: slotW, height: 40 }} />;
  } else {
    leftEl = <View style={{ width: slotW, height: 40 }} />;
  }

  let centreEl: ReactNode = null;
  if (centre && 'title' in centre) {
    centreEl = <MonoText v="navTitle" color={tone === 'dark' ? monoDark.caps : mono.mute}>{centre.title}</MonoText>;
  } else if (centre && 'step' in centre) {
    centreEl = <NavDashes step={centre.step} total={centre.total} tone={tone} />;
  }

  let rightEl: ReactNode = <View style={{ width: slotW, height: 40 }} />;
  if (right === 'close') {
    rightEl = (
      <Tap label="Close" onPress={onClose} hitSlop={SLOP} style={{ width: slotW, height: 40, alignItems: 'flex-end', justifyContent: 'center' }}>
        <CloseX color={fg} />
      </Tap>
    );
  } else if (right === 'share') {
    rightEl = (
      <Tap label="Share" onPress={onShare} hitSlop={SLOP} style={{ width: slotW, height: 40, alignItems: 'flex-end', justifyContent: 'center' }}>
        <Share color={fg} />
      </Tap>
    );
  } else if (right && typeof right === 'object' && 'text' in right) {
    rightEl = (
      <Tap onPress={right.onPress} hitSlop={SLOP} style={{ width: slotW, height: 40, alignItems: 'flex-end', justifyContent: 'center' }}>
        <MonoText v="rowLabel" color={fg}>{right.text}</MonoText>
      </Tap>
    );
  } else if (right && typeof right === 'object' && 'node' in right) {
    rightEl = <View style={{ height: 40, alignItems: 'flex-end', justifyContent: 'center' }}>{right.node}</View>;
  }

  return (
    <View
      style={[
        {
          position: 'absolute',
          left: 0,
          right: 0,
          top,
          height: 40,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 22,
          zIndex,
          // The row spans the frame; only its slots are controls. Without this a
          // swipe that starts in the band (the Library pager) never reaches
          // what lies under it.
          pointerEvents: 'box-none',
        },
        style,
      ]}>
      {leftEl}
      {centreEl}
      {rightEl}
    </View>
  );
}

/**
 * A page title under a back row (`left 24 right 24 top 108`, 32/700/38/−0.6):
 * Your log, Medallions, the tier pages (which centre it).
 */
export function TitleHead({ title, center, top = 108 }: { title: string; center?: boolean; top?: number }) {
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, top }}>
      <MonoText v="titlePage" center={center}>{title}</MonoText>
    </View>
  );
}
