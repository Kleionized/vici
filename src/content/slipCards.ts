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
  /**
   * What 98E's fourth row reads back as `Change for next time`.
   *
   * The canvas states the row, its label and one value — `Phone charges outside
   * the bedroom`, next to a slip fed by `Phone in bed, late night`, which is
   * the Late night card's own instruction restated as a standing rule. No frame
   * asks the question, so the other eighteen are written here to the same
   * pattern: each card's move, in one line, in the log's voice.
   */
  change: string;
};

/** The nav row's kicker over each family (the frames' only per-family string). */
export const SLIP_KICKER: Readonly<Record<SlipCard['kind'], string>> = {
  feeling: 'After the slip',
  trigger: 'What fed it',
};

export const SLIP_CARDS: readonly SlipCard[] = [
  { id: 'feel-ashamed', change: 'No self-lecture — straight to the next thing', key: 'Ashamed', kind: 'feeling', hero: 'mirror', cta: 'Done', headline: 'Skip the self-lecture.', body: 'Don’t spend the next ten minutes punishing yourself. The useful part starts now: change what happens next.' },
  { id: 'feel-bored', change: 'One thing chosen instead of the feed', key: 'Bored', kind: 'feeling', hero: 'stairs', cta: 'Done', headline: 'Pick the next thing.', body: 'The slip doesn’t get to decide the rest of your day. Choose one thing to do and get out of the feed.' },
  { id: 'feel-lonely', change: 'Not alone with it tonight', key: 'Lonely', kind: 'feeling', hero: 'envelope', cta: 'Done', headline: 'Don’t stay cut off.', body: 'You don’t have to tell anyone what happened. Just don’t stay alone with it tonight.' },
  { id: 'feel-stressed', change: 'A real break before the next hour', key: 'Stressed', kind: 'feeling', hero: 'kettle', cta: 'Done', headline: 'The problem can wait.', body: 'Ten minutes. Stop here, take a real break, and give yourself a clean next hour.' },
  { id: 'feel-rejected', change: 'No messages until it has cooled down', key: 'Rejected', kind: 'feeling', hero: 'phoneTable', cta: 'Done', headline: 'Don’t go back yet.', body: 'No messages, no profiles, no replies. Cool down first — then decide.' },
  { id: 'feel-tired', change: 'Phone away, the night made easier', key: 'Tired', kind: 'feeling', hero: 'bed', cta: 'Done', headline: 'Do less, not more.', body: 'Put the phone away and make the rest of the night easier.' },
  { id: 'feel-turned-on', change: 'The cue goes, not the feeling', key: 'Turned on', kind: 'feeling', hero: 'campfire', cta: 'Done', headline: 'Stop feeding it.', body: 'Being turned on is not the problem. Cut the cue and let the rest of it pass.' },
  { id: 'feel-not-sure', change: 'Stop at the first one, no story needed', key: 'Not sure', kind: 'feeling', hero: 'signpost', cta: 'Done', headline: 'No reason needed tonight.', body: 'You don’t need the story. Stop here and make the next slip harder.' },

  { id: 'trig-late-night', change: 'Phone charges outside the bedroom', key: 'Late night', kind: 'trigger', hero: 'charger', cta: 'Continue', headline: 'Move the phone.', body: 'Charge it outside the bedroom tonight.' },
  { id: 'trig-scrolling', change: 'The feed stays closed for the night', key: 'Scrolling', kind: 'trigger', hero: 'feedOff', cta: 'Continue', headline: 'Get off the feed.', body: 'Close it for the rest of the night. Don’t replace it with another feed.' },
  { id: 'trig-sexual-content', change: 'The account that got me there is closed', key: 'Sexual content', kind: 'trigger', hero: 'tab', cta: 'Continue', headline: 'Close everything.', body: 'Close the page, app, or account that got you there. Don’t look again.' },
  { id: 'trig-boredom', change: 'The next hour gets a job', key: 'Boredom', kind: 'trigger', hero: 'stairs', cta: 'Done', headline: 'Give the next hour a job.', body: 'A short, hard set beats an open feed. Then pick one thing to actually do.' },
  { id: 'trig-loneliness', change: 'One person messaged instead', key: 'Loneliness', kind: 'trigger', hero: 'twoCups', cta: 'Done', headline: 'Move toward people.', body: 'Message one person, or go where people are. No explanation required.' },
  { id: 'trig-stress', change: 'One task named for later, then a break', key: 'Stress', kind: 'trigger', hero: 'kettle', cta: 'Done', headline: 'Contained break.', body: 'Step away from the problem properly. Name one task for later — just one.' },
  { id: 'trig-argument', change: 'Ten minutes before I reply', key: 'Argument', kind: 'trigger', hero: 'bubbles', cta: 'Continue', headline: 'Don’t reply yet.', body: 'Stop rereading the messages. Leave it alone for ten minutes.' },
  { id: 'trig-couldnt-sleep', change: 'Out of bed rather than on the phone', key: 'Couldn’t sleep', kind: 'trigger', hero: 'bed', cta: 'Continue', headline: 'Get out of bed for\na few minutes.', body: 'Stay off feeds. Go back when you are actually ready to sleep.' },
  { id: 'trig-being-alone', change: 'Somewhere less private for ten minutes', key: 'Being alone', kind: 'trigger', hero: 'openDoor', cta: 'Continue', headline: 'Leave the room.', body: 'Move somewhere less private for the next ten minutes.' },
  { id: 'trig-habit', change: 'Something different after a slip', key: 'Habit', kind: 'trigger', hero: 'signpost', cta: 'Continue', headline: 'Change what\nhappens next.', body: 'Do something different from what you normally do after a slip.' },
  { id: 'trig-not-sure', change: 'Phone out of reach for ten minutes', key: 'Not sure', kind: 'trigger', hero: 'phoneTable', cta: 'Continue', headline: 'Put the phone away.', body: 'Move somewhere different and keep the phone out of reach for ten minutes.' },
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
