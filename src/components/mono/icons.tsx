import Svg, { Path } from 'react-native-svg';

import { mono } from '@/lib/theme';

import { Glyph } from './glyphs';

/**
 * Every inline glyph the bundle draws (design-system §6), at the frame's own
 * size. The pictograms are the solid set in `glyphs.tsx` (D55); the marks
 * below — chevrons, close, check, share, arrows — stay stroked, and these
 * notes are about them. Strokes are in viewBox units, so a glyph drawn larger
 * thickens with it — as the canvas's does. Colours default to the context the
 * frames use most; pass `color` wherever a frame differs.
 */
type IconProps = { color?: string; size?: number };
const R = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export function ChevronL({ color = mono.ink }: IconProps) {
  return (
    <Svg width={12} height={20} viewBox="0 0 12 20">
      <Path d="M10 2L2 10l8 8" stroke={color} strokeWidth={2.2} {...R} />
    </Svg>
  );
}

export function ChevronR({ color = mono.mute, size = 14 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14">
      <Path d="M5 2l5 5-5 5" stroke={color} strokeWidth={2} {...R} />
    </Svg>
  );
}

export function ChevronD({ color = mono.ink, size = 14 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14">
      <Path d="M2 5l5 5 5-5" stroke={color} strokeWidth={2} {...R} />
    </Svg>
  );
}

/** The next FAB's chevron: 14×22 drawn from a 12×20 viewBox, stroke 2.4. */
export function FabChevron({ color = mono.onInk }: IconProps) {
  return (
    <Svg width={14} height={22} viewBox="0 0 12 20">
      <Path d="M2 2l8 8-8 8" stroke={color} strokeWidth={2.4} {...R} />
    </Svg>
  );
}

/** The ✕ — round caps, no join (the canvas states none). */
export function CloseX({ color = mono.ink, size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18">
      <Path d="M2 2l14 14M16 2L2 16" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function Check({ color = mono.onInk, size = 14 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14">
      <Path d="M2 7.5l3.2 3L12 3.5" stroke={color} strokeWidth={2.2} {...R} />
    </Svg>
  );
}

export function Share({ color = mono.ink }: IconProps) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18">
      <Path d="M9 11V2M5.5 5.5L9 2l3.5 3.5M4 9v5.5A1.5 1.5 0 0 0 5.5 16h7a1.5 1.5 0 0 0 1.5-1.5V9" stroke={color} strokeWidth={1.8} {...R} />
    </Svg>
  );
}

export function Flame({ color = mono.ink }: IconProps) {
  return (
    <Svg width={16} height={18} viewBox="0 0 16 18">
      <Path d="M8 1c1 3 4 4.5 4 8.5A4 4 0 0 1 4 9.5c0-1.5.6-2.5 1.3-3.3.2 1 .8 1.8 1.7 2C6.5 6 6.5 3.5 8 1z" fill={color} />
    </Svg>
  );
}

export function Person({ color = mono.ink, size = 22 }: IconProps) {
  return <Glyph name="person" size={size} color={color} />;
}

export function Bolt({ color = mono.ink, size = 14 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14">
      <Path d="M8 1L2 8h5l-1 5 6-7H7z" fill={color} />
    </Svg>
  );
}

/** The score delta's arrow (10) and the ink-on-ink 16 variant. */
export function ArrowUp({ color = mono.ink, size = 10 }: IconProps) {
  if (size === 16) {
    return (
      <Svg width={16} height={16} viewBox="0 0 16 16">
        <Path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" stroke={color} strokeWidth={2.2} {...R} />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10">
      <Path d="M5 9V1M1.5 4.5L5 1l3.5 3.5" stroke={color} strokeWidth={1.8} {...R} />
    </Svg>
  );
}

export function Quote({ color = mono.art }: IconProps) {
  return (
    <Svg width={28} height={22} viewBox="0 0 28 22">
      <Path d="M2 12c0-6 4-10 10-10v4c-3 0-5 2-5 5h5v9H2zM16 12c0-6 4-10 10-10v4c-3 0-5 2-5 5h5v9H16z" fill={color} />
    </Svg>
  );
}

/** The calendar page: the check-in covers' day, the task card's "Yesterday", 16. */
export function CalendarGlyph({ color = mono.mute, size = 16 }: IconProps) {
  return <Glyph name="calendar" size={size} color={color} />;
}

/** The clock face: the check-in covers' "2 min", 16. */
export function ClockGlyph({ color = mono.mute, size = 16 }: IconProps) {
  return <Glyph name="clock" size={size} color={color} />;
}

/** The crescent moon: the night's action disc, 22. */
export function MoonGlyph({ color = mono.ink, size = 22 }: IconProps) {
  return <Glyph name="moon" size={size} color={color} />;
}

/** A line going up: the weekly report's rating, 16. */
export function TrendGlyph({ color = mono.mute, size = 16 }: IconProps) {
  return <Glyph name="bars" size={size} color={color} />;
}

/** The sun: Today's "This morning" caption, 16. */
export function Sun({ color = mono.mute, size = 16 }: IconProps) {
  return <Glyph name="sun" size={size} color={color} />;
}

/** A tick in a ring: Today's "Today's task" caption, 16. */
export function CheckCircle({ color = mono.mute, size = 16 }: IconProps) {
  return <Glyph name="checkCircle" size={size} color={color} />;
}

/** The quotation mark that heads a pledge (Today Home III, the morning's pledge), 24. */
export function QuoteMark({ color = mono.art, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4 18.5c0-5 1.8-8.6 5.4-10.8l1.1 1.7c-2.1 1.5-3.2 3.3-3.4 5.3H10.5v3.8zM13.5 18.5c0-5 1.8-8.6 5.4-10.8l1.1 1.7c-2.1 1.5-3.2 3.3-3.4 5.3H20v3.8z" fill={color} />
    </Svg>
  );
}

/** The open book (a lesson): Day 0's lesson card at 20, Today's lesson labels at 16. */
export function Book({ color = mono.ink, size = 20 }: IconProps) {
  return <Glyph name="book" size={size} color={color} />;
}

export function Pencil({ color = mono.mute }: IconProps) {
  return <Glyph name="pencil" size={16} color={color} />;
}

export function Apple({ color = mono.onInk }: IconProps) {
  return (
    <Svg width={16} height={19} viewBox="0 0 16 19">
      <Path
        d="M13.3 10c0-2.5 2-3.6 2.1-3.7-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.8-1.7 0-3.2 1-4.1 2.5-1.8 3-.5 7.6 1.3 10.1.8 1.2 1.8 2.6 3.2 2.5 1.3 0 1.8-.8 3.3-.8s2 .8 3.3.8c1.4 0 2.3-1.3 3.1-2.5.6-.9 1.1-1.9 1.4-2.9-.1 0-2.9-1.1-2.9-4.1zM10.9 2.7c.7-.9 1.2-2 1-3.2-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.5 2.9-1.3z"
        fill={color}
      />
    </Svg>
  );
}

export function Google() {
  return (
    <Svg width={19} height={19} viewBox="0 0 48 48">
      <Path d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" fill="#EA4335" />
      <Path d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" fill="#4285F4" />
      <Path d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" fill="#FBBC05" />
      <Path d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" fill="#34A853" />
    </Svg>
  );
}

// ── tab bar (26×26, stroke 1.8, fill none) ──

export function TabToday({ color }: { color: string }) {
  return <Glyph name="house" size={26} color={color} />;
}

export function TabLog({ color }: { color: string }) {
  return <Glyph name="doc" size={26} color={color} />;
}

export function TabLibrary({ color }: { color: string }) {
  return <Glyph name="book" size={26} color={color} />;
}

export function TabJourney({ color }: { color: string }) {
  return <Glyph name="medal" size={26} color={color} />;
}
