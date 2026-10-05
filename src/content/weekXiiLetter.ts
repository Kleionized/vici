/**
 * `39 · A Letter From Week XII` — the letter, word for word off the frame.
 *
 * GENERATED FILE — do not edit by hand. Written by `scripts/overhaul/gen-letter.mjs`
 * from `.overhaul/final/Email-Login/Letter-Week-XII.html`. Re-run the generator instead.
 *
 * Four paragraphs as runs (the frame sets one in 700 ink); only the name is his.
 */

export type LetterRun = { text: string; bold?: boolean };

/** Each paragraph as the frame draws it — the bold run marked. */
export const WEEK_XII_RUNS: LetterRun[][] = [
  [{ text: "I’m writing this at the end of week XII. I remember where you are right now — you want this to be the time it finally changes, and part of you is already wondering how long you’ll last." }],
  [{ text: "Here is the part I wish you knew: " }, { text: "you do not need twelve perfect weeks.", bold: true }, { text: " You need to stop turning one bad night into a reason to quit." }],
  [{ text: "There were nights I wanted to watch badly. Some days the only thing I did right was get through the evening. That still counted." }],
  [{ text: "Every time I waited one out, left the room, or used the SOS instead, I learned the same thing: the urge ends whether you obey it or not." }],
];

/** The same paragraphs as plain text (the journal entry, and callers that pass strings). */
export const WEEK_XII_LETTER: string[] = WEEK_XII_RUNS.map((p) => p.map((r) => r.text).join(''));
