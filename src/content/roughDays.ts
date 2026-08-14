// Rough Days — the protocol book (canvas: frames 001–021). Seven feelings, three
// pages each: I names the feeling, II explains why the urge showed up, III hands
// over one move. Data only — the picker lives in src/app/(app)/rough-days.tsx
// and the flow in src/app/rough-protocol.tsx.

/**
 * One drawing per page — twenty-one of them, no two alike. Named for what the
 * frame draws, grouped by the protocol they belong to.
 */
export type RDArt =
  // Loneliness — 001–003
  | 'emptyroom' // a lit window, a moon, an empty chair
  | 'mugphone' // a mug steaming beside a phone laid face down
  | 'sendtext' // a phone, a message bubble, a paper plane
  // Anxiety — 004–006
  | 'tangle' // a scribbled knot with one loose end
  | 'kettle' // a kettle steaming on a burner
  | 'candle' // a candle, lit, one curl of smoke
  // Stress — 007–009
  | 'loadbag' // a heavy bag and a stack of slabs
  | 'pileclock' // a clock over a pile of paper
  | 'stepout' // a door ajar with light coming through
  // Boredom — 010–012
  | 'sofa' // a sofa, a remote, a clock
  | 'shelf' // two shelves of books, a plant, two boxes
  | 'threethings' // an open window, a glass of water, a dumbbell
  // Late night — 013–015
  | 'bedphone' // a bed and a lit phone on the nightstand
  | 'latescreen' // a phone standing up, an alarm clock, a glass
  | 'charging' // a socket, a cable, a phone on the floor
  // Home alone — 016–018
  | 'house' // a house at dusk, one window lit, a path out
  | 'frontdoor' // the front door, a coat on the hook
  | 'curtains' // curtains drawn back, light on the floor
  // An argument — 019–021
  | 'clash' // two speech bubbles and a cross between them
  | 'toppled' // a toppled piece on a board, one still standing
  | 'writeit'; // an open notebook, a pen, two crumpled drafts

/** One page of a protocol. `act` is the instruction line the third page carries. */
export type RDPage = { art: RDArt; h: string; s: string; act?: string };
export type RDProtocol = { title: string; pages: [RDPage, RDPage, RDPage] };

export const RD_PROTOCOLS: Record<string, RDProtocol> = {
  loneliness: {
    title: 'Loneliness',
    pages: [
      { art: 'emptyroom', h: 'Lonely tonight.', s: 'The pull isn’t about the screen. It’s about the empty room.' },
      { art: 'mugphone', h: 'It wants company.', s: 'The itch is for another person, not a screen — the screen just answers fastest.' },
      { art: 'sendtext', h: 'One text.', s: 'Reach outward, not inward.', act: 'Message one person — not about this. A meme counts.' },
    ],
  },
  anxiety: {
    title: 'Anxiety',
    pages: [
      { art: 'tangle', h: 'Wound up, not turned on.', s: 'Anxiety and arousal share wiring — the body confuses one for the other.' },
      { art: 'kettle', h: 'The valve refills itself.', s: 'The urge promises release, then hands the pressure back with interest.' },
      { art: 'candle', h: 'Ten slow breaths.', s: 'Slow the body first; the mind follows.', act: 'Four counts in, six counts out — ten times through.' },
    ],
  },
  stress: {
    title: 'Stress',
    pages: [
      { art: 'loadbag', h: 'Heavy day.', s: 'Stress narrows the mind to the nearest exit — and it knows a fast one.' },
      { art: 'pileclock', h: 'The fast exit is a trapdoor.', s: 'Relief that costs tomorrow isn’t relief. The pile is still there after.' },
      { art: 'stepout', h: 'Put the day down.', s: 'Ten minutes off duty, on purpose.', act: 'Step outside and walk one lap — no phone in your pocket.' },
    ],
  },
  boredom: {
    title: 'Boredom',
    pages: [
      { art: 'sofa', h: 'Nothing to do.', s: 'An empty hour is the oldest trigger there is.' },
      { art: 'shelf', h: 'The itch is for anything.', s: 'Boredom doesn’t want the screen — it wants motion, any motion.' },
      { art: 'threethings', h: 'The second-easiest thing.', s: 'The easiest thing is the screen. Pick the next one.', act: 'Ten push-ups, one glass of water, one open window.' },
    ],
  },
  latenight: {
    title: 'Late night',
    pages: [
      { art: 'bedphone', h: 'Past your window.', s: 'After eleven, the odds tilt — willpower goes to sleep before you do.' },
      { art: 'latescreen', h: 'Nothing good is on.', s: 'The last hour awake is the weakest hour of the day.' },
      { art: 'charging', h: 'End it on purpose.', s: 'Close the day before it closes you.', act: 'Phone on the charger, outside the room. Go to bed bored.' },
    ],
  },
  homealone: {
    title: 'Home alone',
    pages: [
      { art: 'house', h: 'Empty house.', s: 'Privacy is opportunity — the brain clocks it before you do.' },
      { art: 'frontdoor', h: 'The door is a switch.', s: 'Alone drops the cost of a slip to zero. Knowing that is half the defense.' },
      { art: 'curtains', h: 'Change the room.', s: 'Light and sightlines change the odds.', act: 'Open the curtains and work where you can be seen — or leave for twenty minutes.' },
    ],
  },
  argument: {
    title: 'An argument',
    pages: [
      { art: 'clash', h: 'Still burning.', s: 'Anger wants a win — and a slip feels like one, briefly.' },
      { art: 'toppled', h: 'It offers control back.', s: 'The urge shows up right after the argument took your control away.' },
      { art: 'writeit', h: 'Write, don’t send.', s: 'Spend the charge somewhere it can’t cost you.', act: 'Write the reply you won’t send. Then put it down.' },
    ],
  },
};

/** The order the canvas runs them in (frames 001 → 021). */
export const RD_KEYS = ['loneliness', 'anxiety', 'stress', 'boredom', 'latenight', 'homealone', 'argument'];
