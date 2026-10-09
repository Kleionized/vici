import type { HeroKey } from '@/content/heroes';

/**
 * The nineteen post-slip cards — canvas 99A–99H (`Slip Feeling — …`) and
 * 100A–100K (`Slip Trigger — …`).
 *
 * All nineteen frames are one hero board: the nav's kicker, the card's
 * illustration at 190 / 1.1, the headline and body in the centred stack at
 * 452, the primary at `bottom 96` and the ghost link **Give me another**.
 * Stripped of their art and strings, all nineteen hash identical, so the only
 * per-card data is what is here.
 *
 * `hero` is the frame's own `data-hero` id (D338); the art itself lives once,
 * in the shared registry, so the cards that share a picture (`stairs`,
 * `kettle`, `phoneTable`, `bed`, `signpost`, plus the flow's `tab` and
 * `charger`) share it rather than copy it.
 *
 * The CTA is data, not a rule: every Feeling card and the three "do something"
 * triggers (Boredom, Loneliness, Stress) say **Done**; every other trigger says
 * **Continue** — the Overhaul drop renamed seven per-card verbs to it.
 *
 * Two headlines carry a `\n`: web balances them to the same two lines, native
 * wraps greedily and would not (D332).
 */
export type SlipCard = {
  /** Unique across the two families — `Not sure` is a card in both of them. */
  id: string;
  /** The canvas's own key: the words after the em dash in the frame's badge. */
  key: string;
  kind: 'feeling' | 'trigger';
  headline: string;
  body: string;
  cta: string;
  hero: HeroKey;
  /*
   * There was a `change` here — 98E's "Change for next time" row, a card's move
   * restated as if the user had made it. No board asks what will change, so
   * the summary no longer claims one (P4, deploy WP5 D469).
   */
};

/** The nav row's kicker over each family (the frames' only per-family string). */
export const SLIP_KICKER: Readonly<Record<SlipCard['kind'], string>> = {
  feeling: 'After the slip',
  trigger: 'What fed it',
};

export const SLIP_CARDS: readonly SlipCard[] = [
  { id: 'feel-ashamed', key: 'Ashamed', kind: 'feeling', hero: 'mirror', cta: 'Done', headline: 'Skip the self-lecture.', body: 'Don’t spend the next ten minutes punishing yourself. The useful part starts now: change what happens next.' },
  { id: 'feel-bored', key: 'Bored', kind: 'feeling', hero: 'stairs', cta: 'Done', headline: 'Pick the next thing.', body: 'The slip doesn’t get to decide the rest of your day. Choose one thing to do and get out of the feed.' },
  { id: 'feel-lonely', key: 'Lonely', kind: 'feeling', hero: 'envelope', cta: 'Done', headline: 'Don’t stay cut off.', body: 'You don’t have to tell anyone what happened. Just don’t stay alone with it tonight.' },
  { id: 'feel-stressed', key: 'Stressed', kind: 'feeling', hero: 'kettle', cta: 'Done', headline: 'The problem can wait.', body: 'Ten minutes. Stop here, take a real break, and give yourself a clean next hour.' },
  { id: 'feel-rejected', key: 'Rejected', kind: 'feeling', hero: 'phoneTable', cta: 'Done', headline: 'Don’t go back yet.', body: 'No messages, no profiles, no replies. Cool down first — then decide.' },
  { id: 'feel-tired', key: 'Tired', kind: 'feeling', hero: 'bed', cta: 'Done', headline: 'Do less, not more.', body: 'Put the phone away and make the rest of the night easier.' },
  { id: 'feel-turned-on', key: 'Turned on', kind: 'feeling', hero: 'campfire', cta: 'Done', headline: 'Stop feeding it.', body: 'Being turned on is not the problem. Cut the cue and let the rest of it pass.' },
  { id: 'feel-not-sure', key: 'Not sure', kind: 'feeling', hero: 'signpost', cta: 'Done', headline: 'No reason needed tonight.', body: 'You don’t need the story. Stop here and make the next slip harder.' },

  { id: 'trig-late-night', key: 'Late night', kind: 'trigger', hero: 'charger', cta: 'Continue', headline: 'Move the phone.', body: 'Charge it outside the bedroom tonight.' },
  { id: 'trig-scrolling', key: 'Scrolling', kind: 'trigger', hero: 'feedOff', cta: 'Continue', headline: 'Get off the feed.', body: 'Close it for the rest of the night. Don’t replace it with another feed.' },
  { id: 'trig-sexual-content', key: 'Sexual content', kind: 'trigger', hero: 'tab', cta: 'Continue', headline: 'Close everything.', body: 'Close the page, app, or account that got you there. Don’t look again.' },
  { id: 'trig-boredom', key: 'Boredom', kind: 'trigger', hero: 'stairs', cta: 'Done', headline: 'Give the next hour a job.', body: 'A short, hard set beats an open feed. Then pick one thing to actually do.' },
  { id: 'trig-loneliness', key: 'Loneliness', kind: 'trigger', hero: 'twoCups', cta: 'Done', headline: 'Move toward people.', body: 'Message one person, or go where people are. No explanation required.' },
  { id: 'trig-stress', key: 'Stress', kind: 'trigger', hero: 'kettle', cta: 'Done', headline: 'Contained break.', body: 'Step away from the problem properly. Name one task for later — just one.' },
  { id: 'trig-argument', key: 'Argument', kind: 'trigger', hero: 'bubbles', cta: 'Continue', headline: 'Don’t reply yet.', body: 'Stop rereading the messages. Leave it alone for ten minutes.' },
  { id: 'trig-couldnt-sleep', key: 'Couldn’t sleep', kind: 'trigger', hero: 'bed', cta: 'Continue', headline: 'Get out of bed for\na few minutes.', body: 'Stay off feeds. Go back when you are actually ready to sleep.' },
  { id: 'trig-being-alone', key: 'Being alone', kind: 'trigger', hero: 'openDoor', cta: 'Continue', headline: 'Leave the room.', body: 'Move somewhere less private for the next ten minutes.' },
  { id: 'trig-habit', key: 'Habit', kind: 'trigger', hero: 'signpost', cta: 'Continue', headline: 'Change what\nhappens next.', body: 'Do something different from what you normally do after a slip.' },
  { id: 'trig-not-sure', key: 'Not sure', kind: 'trigger', hero: 'phoneTable', cta: 'Continue', headline: 'Put the phone away.', body: 'Move somewhere different and keep the phone out of reach for ten minutes.' },
] as const;

/**
 * Which card a `What fed it?` chip opens. The canvas states no mapping — the
 * chips and the cards are two lists that overlap without matching — so this is
 * the reading the words support: the five feelings on the chips open their own
 * Feeling card, and the four situations open the Trigger card that names the
 * same situation. `Phone in bed` has no card of its own; `Late night` is the
 * one that tells you to charge the phone outside the bedroom, so it takes both.
 */
export const SLIP_FED_TO_CARD: Readonly<Record<string, string>> = {
  Bored: 'feel-bored',
  Lonely: 'feel-lonely',
  Stressed: 'feel-stressed',
  Tired: 'feel-tired',
  'Phone in bed': 'trig-late-night',
  'Late night': 'trig-late-night',
  'Sexual content': 'trig-sexual-content',
  Argument: 'trig-argument',
  'Not sure': 'feel-not-sure',
};
