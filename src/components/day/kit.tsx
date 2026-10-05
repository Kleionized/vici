import Svg, { Path } from 'react-native-svg';

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
 * One concrete thing to do, for a day the course has no lesson task for. The
 * night check-in sets tomorrow's action from the day's lesson (`lessonForDay`)
 * and falls back to `nightAction`; the morning asks after yesterday's row and
 * falls back to `dayAction`. Both are picked by day number, so a day always
 * asks the same thing twice — once tonight, once when the morning asks whether
 * it happened.
 */
export const NIGHT_ACTIONS = [
  'Put your phone somewhere hard to reach before you sleep.',
  'Set out tomorrow’s clothes before the lights go off.',
  'Leave the charger in another room tonight.',
  'Read a page of something on paper before bed.',
  'Decide now what time you are getting up.',
];

export const DAY_ACTIONS = [
  'Write down each trigger the moment you notice it.',
  'Take the first walk before you take the first scroll.',
  'Eat one proper meal sitting down.',
  'Tell one person one true thing about today.',
  'Put the phone in another room for an hour.',
];

/** Day one is the first line; after that the list simply turns over. */
export const nightAction = (day: number) => NIGHT_ACTIONS[Math.max(0, day - 1) % NIGHT_ACTIONS.length];
export const dayAction = (day: number) => DAY_ACTIONS[Math.max(0, day - 1) % DAY_ACTIONS.length];
