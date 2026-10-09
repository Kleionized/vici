import Svg, { Path } from 'react-native-svg';

import type { HeroKey } from '@/content/heroes';
import { mono } from '@/lib/theme';

/**
 * What the check-ins keep from their previous drop: the day's action lists
 * (content, not drawing) and the reroll glyph `affirmation.tsx` borrows. The
 * check-in boards themselves are the mono kit's now — `board.tsx` holds the
 * pieces the two flows share.
 */

/** The circular-arrow "give me another" mark. Drawn in the mute ink unless told otherwise. */
export function RerollGlyph({ size, color = mono.mute }: { size: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M13.5 6.5A6 6 0 1 0 14 9" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M14 3v3.5h-3.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/**
 * One concrete thing to do, for a day the course has no lesson task for (past
 * day 84). One list, picked by day number, for all three places that name the
 * day's action: Today shows `dayStep(day)` when nobody named one, the night
 * check-in names `dayStep(day)` as the next day's action, and the morning asks
 * after `dayStep(day − 1)` when yesterday's row names none — so the morning
 * asks about the sentence Today actually showed (L4). Each step carries the
 * illustration Today draws over it; each fills the crop's width at 375–430
 * (the open door's floor line stops short of the edges at 393, so "get
 * outside" draws the park bench).
 */
export type DayStep = { caption: string; hero: HeroKey };

export const DAY_STEPS: DayStep[] = [
  // the first is the one Today Home II draws ("hard to reach" — the frame's words)
  { caption: 'Put your phone somewhere hard to reach before you sleep.', hero: 'nightPhone' },
  { caption: 'Drink a full glass of water before anything else.', hero: 'twoCups' },
  { caption: 'Get outside for ten minutes, even if it is only around the block.', hero: 'bench' },
  { caption: 'Write down what set it off, in the words you would say out loud.', hero: 'notebook' },
  { caption: 'Make the bed now, so tonight you walk into a room that is ready.', hero: 'bed' },
];

/** Day one is the first step; after that the list simply turns over. */
export const dayStep = (day: number): DayStep => DAY_STEPS[Math.max(0, day - 1) % DAY_STEPS.length];
