/**
 * `Lesson Scroll 1…26` — lesson 01, *Surviving the Night*, page by page.
 *
 * Copy is transcribed character for character from the canvas, with its HTML
 * entities resolved: `&middot;` → `·`, `&rsquo;` → `’`, `&ldquo;` / `&rdquo;` →
 * `“` / `”`, `&mdash;` → `—`. This is the only lesson `UI Final` authors a body
 * for; the other 83 get a card and a task and no pages (DECISIONS D-015).
 */

export type ScrollPage =
  /** Frame 1 — the cover. */
  | { kind: 'cover'; eyebrow: string; title: string; meta: string }
  /** Frames 2 and 25 — an epigraph and who said it. */
  | { kind: 'epigraph'; quote: string; who: string; mark?: 'sun12' }
  /**
   * A mark over a statement, or a statement on its own. The canvas authors four
   * different `max-width`s for this slot across the 26 frames — 300 on eleven,
   * 280 on frame 3, 310 on 16 and 320 on 24 — so it travels with the page.
   */
  | { kind: 'statement'; mark?: 'crescent' | 'sunrise' | 'sun14'; before?: string; text: string; width?: number }
  /** One or two paragraphs, the second in ink when the page has a landing. */
  | { kind: 'prose'; mark?: 'clock' | 'bedphone' | 'room'; title?: string; soft: string; ink?: string }
  /** Three graded lines. */
  | { kind: 'cascade'; ramp: 'fading' | 'solid'; before?: string; lines: readonly string[]; after?: string }
  /** Frame 16 — pick where it begins. */
  | { kind: 'pick'; title: string; helper: string; options: readonly string[] }
  /** Frames 23 and 24 — the day's task, in two boards. */
  | { kind: 'task'; eyebrow: string; title: string; body: string; rule: string; room?: boolean }
  | { kind: 'taskOptions'; eyebrow: string; title: string; width?: number; options: readonly { head: string; note: string }[] }
  /** Frame 26. */
  | { kind: 'done'; title: string; body: string; cta: string };

export const LESSON_SCROLL_01: readonly ScrollPage[] = [
  { kind: 'cover', eyebrow: 'WEEK I · RESET', title: 'Surviving the Night', meta: '6 min' },
  { kind: 'epigraph', mark: 'sun12', quote: 'A journey of a thousand miles begins with a single step.', who: 'LAO TZU' },
  { kind: 'statement', mark: 'crescent', width: 280, text: 'You do not need to fix your life tonight.' },
  {
    kind: 'prose',
    soft: 'Maybe you opened this after a relapse. Maybe the last few days have been bad. Maybe nothing dramatic happened at all.',
    ink: 'You are simply tired of ending up in the same place.',
  },
  { kind: 'statement', mark: 'sun14', before: 'Good. That gives us somewhere to start.', text: 'For tonight, one decision is enough.' },
  { kind: 'prose', title: 'Make the problem smaller', soft: 'The mind likes to turn quitting into an enormous promise.' },
  { kind: 'cascade', ramp: 'fading', lines: ['Never again.', 'Ninety days.', 'The rest of your life.'] },
  {
    kind: 'prose',
    soft: 'At midnight, those promises are almost useless. They ask a tired version of you to carry a future that has not happened yet.',
    ink: 'So do not carry it.',
  },
  { kind: 'statement', mark: 'sunrise', text: 'Get to tomorrow.' },
  { kind: 'prose', title: 'What tonight requires', soft: 'For the next few hours, the job is simple: do not relapse.' },
  {
    kind: 'cascade',
    ramp: 'fading',
    lines: ['Not forever.', 'Not for the next three months.', 'Not even for the rest of the week.'],
    after: 'Just tonight.',
  },
  {
    kind: 'prose',
    soft: 'Tomorrow, we can work on the habit itself.',
    ink: 'Tonight, make sure it does not get another round.',
  },
  {
    kind: 'prose',
    mark: 'clock',
    title: 'Think about the last night',
    soft: 'Go back to the last time it happened at night. Where were you before the searching started?',
  },
  {
    kind: 'prose',
    mark: 'bedphone',
    soft: 'Maybe you were in bed with your phone. Maybe you could not sleep. Maybe you had a bad day and wanted something that would switch your head off for a while.',
  },
  {
    kind: 'cascade',
    ramp: 'solid',
    before: 'There is usually an earlier moment when stopping is cheap.',
    lines: ['Before the search.', 'Before the tab.', 'Before you are fully caught in it.'],
  },
  {
    kind: 'pick',
    title: 'Where do most of your night-time relapses begin?',
    helper: 'Pick the one that happens most.',
    options: ['In bed with my phone', 'Alone on my computer', 'When I can’t sleep', 'Somewhere else'],
  },
  {
    kind: 'prose',
    title: 'Add distance',
    soft: 'An urge at midnight is much more convincing when the whole habit sits one thumb-movement away.',
    ink: 'Change that.',
  },
  { kind: 'prose', mark: 'room', soft: 'If the phone is across the room, you have to stand up. If it is downstairs, you have to leave the bed.' },
  {
    kind: 'prose',
    soft: 'If the laptop is closed and put away, you have to make another decision before anything happens.',
    ink: 'That small gap matters. Do not spend willpower where distance will do the job.',
  },
  { kind: 'prose', title: 'Before you sleep', soft: 'Once you have done that, you are finished for today.' },
  {
    kind: 'cascade',
    ramp: 'fading',
    lines: ['No autopsy of the past.', 'No huge promise about the future.', 'No test of whether you are “strong enough.”'],
  },
  { kind: 'prose', title: 'Get through tonight.', soft: 'Tomorrow can have tomorrow.' },
  {
    kind: 'task',
    room: true,
    eyebrow: 'DAY 1 · TONIGHT’S TASK',
    title: 'Surviving the night',
    body: 'Set up tonight before you get tired. Use the option that matches where you sleep.',
    rule: 'Done when you can’t reach your usual device from bed without standing up.',
  },
  {
    kind: 'taskOptions',
    eyebrow: 'DAY 1 · TONIGHT’S TASK',
    title: 'Match where you sleep',
    width: 320,
    options: [
      { head: 'Own bedroom', note: 'Set the alarm now. Charge the phone outside the room. Put a laptop or tablet in a closed bag, drawer, or cupboard away from the bed.' },
      { head: 'Shared room', note: 'Put the device in a bag, locker, desk drawer, or fixed charging spot that you cannot reach while lying down.' },
      {
        head: 'Studio, sofa bed, or temporary space',
        note: 'Put the device at the farthest practical point from where you sleep: a kitchen counter, shelf, zipped bag, or other fixed place.',
      },
      { head: 'Phone needed as an alarm', note: 'Set the alarm first. Put the phone across the room or outside it. Turn off non-essential notifications before you put it down.' },
    ],
  },
  { kind: 'epigraph', quote: 'Well begun is half done.', who: 'ARISTOTLE' },
  { kind: 'done', title: 'Lesson complete.', body: 'Your answer is saved to the log. One decision tonight — get to tomorrow.', cta: 'Done' },
];
