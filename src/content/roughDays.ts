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

export const RD_PROTOCOLS: Record<RDKey, RDProtocol> = {
  loneliness: {
    title: 'Loneliness',
    pages: [
      { hero: 'lamp', h: 'Lonely tonight.', s: 'Urges are stronger when you’re alone.' },
      { hero: 'twoCups', h: 'You want company.', s: 'Porn is the quickest fix, but it isn’t company.' },
      { hero: 'envelope', h: 'One text.', s: 'Talk to someone.', act: 'Message one person about anything. A meme counts.' },
    ],
  },
  anxiety: {
    title: 'Anxiety',
    pages: [
      { hero: 'brain', h: 'Wound up.', s: 'Anxiety can feel a lot like arousal.' },
      { hero: 'kettle', h: 'Relief doesn’t last.', s: 'Watching feels like relief, but the stress comes back worse.' },
      { hero: 'match', h: 'Ten slow breaths.', s: 'Slow breathing calms you down.', act: 'Four counts in, six counts out. Ten times.' },
    ],
  },
  stress: {
    title: 'Stress',
    pages: [
      { hero: 'books', h: 'Heavy day.', s: 'Stress makes you want a quick escape.' },
      { hero: 'clipboard', h: 'It solves nothing.', s: 'The relief is short, and the work is still there after.' },
      { hero: 'openDoor', h: 'Take a break.', s: 'Ten minutes away from everything.', act: 'Step outside and walk one lap. Leave the phone behind.' },
    ],
  },
  boredom: {
    title: 'Boredom',
    pages: [
      { hero: 'hourglass', h: 'Nothing to do.', s: 'Urges often come when you have nothing to do.' },
      { hero: 'plant', h: 'You need to move.', s: 'Doing something helps. The screen is just the easiest option.' },
      { hero: 'sneaker', h: 'Pick something else.', s: 'Do something other than the easiest thing.', act: 'Ten push-ups, one glass of water, one open window.' },
    ],
  },
  latenight: {
    title: 'Late night',
    pages: [
      { hero: 'bed', h: 'It’s late.', s: 'You’re tired, and your guard is down.' },
      { hero: 'nightPhone', h: 'It gets harder late.', s: 'Urges are hardest to resist just before bed.' },
      { hero: 'charger', h: 'Go to bed.', s: 'Decide when the day ends.', act: 'Phone on the charger, outside the room. Go to bed bored.' },
    ],
  },
  homealone: {
    title: 'Home alone',
    pages: [
      { hero: 'nightMoon', h: 'Empty house.', s: 'Being alone makes it feel easier to watch.' },
      { hero: 'door', h: 'It still counts.', s: 'A slip when you’re alone still costs you.' },
      { hero: 'sunrise', h: 'Change the room.', s: 'Make the room less private.', act: 'Open the curtains and work where you can be seen, or go out for twenty minutes.' },
    ],
  },
  argument: {
    title: 'An argument',
    pages: [
      { hero: 'bubbles', h: 'Still angry.', s: 'When you’re angry, watching can feel like getting something back.' },
      { hero: 'dominoes2', h: 'You want control back.', s: 'After an argument, you may want to feel in control again.' },
      { hero: 'fountainPen', h: 'Write, don’t send.', s: 'Get the anger out without sending anything.', act: 'Write the reply you won’t send. Then put it down.' },
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
