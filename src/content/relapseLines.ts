/**
 * Post-relapse encouragements. Each is a single short line; the relapse screen
 * reveals them one word at a time, like the screen is speaking to you. The
 * sequence is shuffled per show, so it reads differently every time.
 *
 * Tone is anti-shame (invariant #2): a slip is data and a chance to grow, never a
 * verdict. Curated for now (the AI-tailored version can swap this pool later).
 */

const OPENERS = [
  'Okay. Take a breath.',
  'Hey — you came back to this screen. That already counts.',
  'You’re still here. Let’s start from there.',
];

const BODY = [
  'A slip is not a collapse.',
  'You haven’t lost the ground you’ve gained — it’s still yours.',
  'Nobody learns to ride the wave without going under a few times.',
  'If you set out to box, you can’t expect to never get hit.',
  'Getting back up is the whole skill. You’re doing it right now.',
  'This isn’t proof you can’t. It’s information about what you needed.',
  'Shame keeps the loop spinning. You don’t owe it anything tonight.',
  'What would you say to a friend who slipped? Try saying that to yourself.',
  'The goal was never a clean record. It was a life you actually want.',
  'Be curious, not cruel — what was today really asking for?',
  'Strength isn’t never falling. It’s how quietly you stand back up.',
  'Progress was never a straight line. Yours bends, then keeps going.',
];

const CLOSERS = [
  'Never fail twice. Tonight ends here.',
  'Tomorrow doesn’t need you perfect. It needs you to show up.',
  'Stand up. Dust off. Onward.',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** A fresh opener + three random body lines + a closer. Different every call. */
export function relapseSequence(): string[] {
  return [pick(OPENERS), ...shuffle(BODY).slice(0, 3), pick(CLOSERS)];
}
