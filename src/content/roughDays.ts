// Rough Days — the protocol book (canvas: frames 001–021). Seven feelings, three
// pages each: I names the feeling, II explains why the urge showed up, III hands
// over one move. Data only — the picker lives in src/app/(app)/rough-days.tsx
// and the flow in src/app/rough-protocol.tsx.

import type { HeroId } from './heroes';

/**
 * Each page draws one of the shared illustrations (`src/content/heroes.ts`,
 * the Lesson-Illustrations-v4 cards) — the previous drop's twenty-one bespoke
 * paper drawings are gone with the paper system. No frame draws a protocol, so
 * each page takes the card nearest the drawing it had (named after it here):
 *
 * | protocol | I | II | III |
 * | --- | --- | --- | --- |
 * | Loneliness | lamp (a lit, empty room) | twoCups (a mug, company) | envelope (send a text) |
 * | Anxiety | brain (the knot, the wiring) | kettle (the kettle) | match (the candle) |
 * | Stress | books (the heavy stack) | clipboard (the pile) | openDoor (step out) |
 * | Boredom | hourglass (the empty hour) | plant (the shelf) | sneaker (move) |
 * | Late night | bed (bed and phone) | nightPhone (the late screen) | charger (charging) |
 * | Home alone | nightMoon (the house at dusk) | door (the front door) | sunrise (curtains open) |
 * | An argument | bubbles (the clash) | dominoes2 (the toppled piece) | fountainPen (write it) |
 */
/** One page of a protocol. `act` is the instruction line the third page carries. */
export type RDPage = { hero: HeroId; h: string; s: string; act?: string };
export type RDProtocol = { title: string; pages: [RDPage, RDPage, RDPage] };

/** The order the previous drop ran them in (frames 001 → 021). */
export const RD_KEYS = ['loneliness', 'anxiety', 'stress', 'boredom', 'latenight', 'homealone', 'argument'] as const;
export type RDKey = (typeof RD_KEYS)[number];

/**
 * The space before each em dash is a no-break space (` `), as Paywall's
 * trial line has it: the dash stays with the word before it instead of opening
 * the next line ("…can be seen ⏎ — or leave…" at 393).
 */
export const RD_PROTOCOLS: Record<RDKey, RDProtocol> = {
  loneliness: {
    title: 'Loneliness',
    pages: [
      { hero: 'lamp', h: 'Lonely tonight.', s: 'The pull isn’t about the screen. It’s about the empty room.' },
      { hero: 'twoCups', h: 'It wants company.', s: 'The itch is for another person, not a screen\u00A0— the screen just answers fastest.' },
      { hero: 'envelope', h: 'One text.', s: 'Reach outward, not inward.', act: 'Message one person\u00A0— not about this. A meme counts.' },
    ],
  },
  anxiety: {
    title: 'Anxiety',
    pages: [
      { hero: 'brain', h: 'Wound up, not turned on.', s: 'Anxiety and arousal share wiring\u00A0— the body confuses one for the other.' },
      { hero: 'kettle', h: 'The valve refills itself.', s: 'The urge promises release, then hands the pressure back with interest.' },
      { hero: 'match', h: 'Ten slow breaths.', s: 'Slow the body first; the mind follows.', act: 'Four counts in, six counts out\u00A0— ten times through.' },
    ],
  },
  stress: {
    title: 'Stress',
    pages: [
      { hero: 'books', h: 'Heavy day.', s: 'Stress narrows the mind to the nearest exit\u00A0— and it knows a fast one.' },
      { hero: 'clipboard', h: 'The fast exit is a trapdoor.', s: 'Relief that costs tomorrow isn’t relief. The pile is still there after.' },
      { hero: 'openDoor', h: 'Put the day down.', s: 'Ten minutes off duty, on purpose.', act: 'Step outside and walk one lap\u00A0— no phone in your pocket.' },
    ],
  },
  boredom: {
    title: 'Boredom',
    pages: [
      { hero: 'hourglass', h: 'Nothing to do.', s: 'An empty hour is the oldest trigger there is.' },
      { hero: 'plant', h: 'The itch is for anything.', s: 'Boredom doesn’t want the screen\u00A0— it wants motion, any motion.' },
      { hero: 'sneaker', h: 'The second-easiest thing.', s: 'The easiest thing is the screen. Pick the next one.', act: 'Ten push-ups, one glass of water, one open window.' },
    ],
  },
  latenight: {
    title: 'Late night',
    pages: [
      { hero: 'bed', h: 'Past your window.', s: 'After eleven, the odds tilt\u00A0— willpower goes to sleep before you do.' },
      { hero: 'nightPhone', h: 'Nothing good is on.', s: 'The last hour awake is the weakest hour of the day.' },
      { hero: 'charger', h: 'End it on purpose.', s: 'Close the day before it closes you.', act: 'Phone on the charger, outside the room. Go to bed bored.' },
    ],
  },
  homealone: {
    title: 'Home alone',
    pages: [
      { hero: 'nightMoon', h: 'Empty house.', s: 'Privacy is opportunity\u00A0— the brain clocks it before you do.' },
      { hero: 'door', h: 'The door is a switch.', s: 'Alone drops the cost of a slip to zero. Knowing that is half the defense.' },
      { hero: 'sunrise', h: 'Change the room.', s: 'Light and sightlines change the odds.', act: 'Open the curtains and work where you can be seen\u00A0— or leave for twenty minutes.' },
    ],
  },
  argument: {
    title: 'An argument',
    pages: [
      { hero: 'bubbles', h: 'Still burning.', s: 'Anger wants a win\u00A0— and a slip feels like one, briefly.' },
      { hero: 'dominoes2', h: 'It offers control back.', s: 'The urge shows up right after the argument took your control away.' },
      { hero: 'fountainPen', h: 'Write, don’t send.', s: 'Spend the charge somewhere it can’t cost you.', act: 'Write the reply you won’t send. Then put it down.' },
    ],
  },
};

/**
 * Old links that name a protocol by another word. `All`'s "A rough-day
 * protocol" row has always pushed `?key=lonely`, which matched nothing and drew
 * a blank page (routes §1.8).
 */
const RD_ALIASES: Record<string, RDKey> = { lonely: 'loneliness', anxious: 'anxiety', stressed: 'stress', bored: 'boredom', late: 'latenight', alone: 'homealone' };

/** The protocol a route's `key` names — an alias, or the first protocol for a key nobody knows (never a blank page). */
export function rdProtocolKey(key: string | undefined): RDKey {
  if (key && (RD_KEYS as readonly string[]).includes(key)) return key as RDKey;
  return (key && RD_ALIASES[key]) || RD_KEYS[0];
}
