#!/usr/bin/env node
/**
 * Build the mock account the canvas's frames are drawn for.
 *
 * Half the app's screens are a picture of somebody's data: the score is 1,240
 * at `Navigator · II`, the strip holds twenty-seven of thirty days, the Log has
 * urges and check-ins in it, the medallion case has some earned and some not.
 * A fresh account renders none of that, so the app and the canvas cannot be
 * compared on those screens at all.
 *
 * This writes the account the frames describe straight into the store's own
 * AsyncStorage key, so the app reads it on the next load exactly as if it had
 * been lived. Every number below is the canvas's own, from the frames named
 * beside it.
 *
 * Usage: node scripts/uifinal1/seed.mjs > .uifinal1/seed.json
 */

const DAY = 24 * 60 * 60 * 1000;
/** `21 · Today` heads the page "Day 41", so the account opened 40 days ago. */
const DAYS_IN = 41;

const key = (d) => {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const now = Date.now();
const start = now - (DAYS_IN - 1) * DAY;
const at = (daysAgo, hour = 21, minute = 30) => {
  const d = new Date(now - daysAgo * DAY);
  d.setHours(hour, minute, 0, 0);
  return d.getTime();
};

/**
 * `21 · Today`'s thirty-day strip: three of the thirty are unheld, at 0-based
 * indices 5, 12 and 20 counting back from the oldest.
 */
const UNHELD = new Set([5, 12, 20]);

const events = [];
let n = 0;
const ev = (type, createdAt, extra = {}) => events.push({ _id: `seed-${++n}`, userId: 'SEED', type, createdAt, ...extra });

/**
 * The month ledger `20B · Score Detail — What Moved It` prints:
 * clean days +64 (16 × 4), check-ins +18 (9 × 2), lessons +12 (4 × 3),
 * urges ridden +8 (4 × 2), one slip −16. The whole run then carries the rest
 * of the way to 1,240.
 */
const TRIGGERS = ['Late night', 'Home alone', 'Phone in bed', 'After stress', 'Boredom'];
const HELPED = ['Left the room', 'Phone in another room', 'Cold water', 'Walked it off', 'Messaged someone'];
const FEELINGS = ['Lonely', 'Bored', 'Stressed', 'Tired', 'Restless'];

// twenty-nine of the last thirty days close with a check-in, and the count of
// urges ridden and lessons finished builds the score the frames print
const checkins = {};
for (let i = DAYS_IN - 1; i >= 0; i--) {
  const d = new Date(now - i * DAY);
  const k = key(d);
  const idx = DAYS_IN - 1 - i; // 0 = oldest
  const slipped = i < 30 && UNHELD.has(29 - i);
  if (slipped) ev('lapse', at(i, 23, 10), { trigger: TRIGGERS[idx % TRIGGERS.length], precedingState: FEELINGS[idx % FEELINGS.length], lesson: 'Phone charges outside the bedroom' });
  else ev('win', at(i, 22, 0), { note: 'Held.' });

  if (i === 0) {
    // Today is checked in but not closed: `21 · Today` reads "Fine" and "Low"
    // off this morning and still offers the night check-in.
    //
    // No `dailyAction`: `21 · Today — task` draws the card in its
    // lesson-sourced register — the bed scene, the lesson's own name and the
    // smaller sentence — and a hand-named action takes precedence over it, so
    // naming one here would hide the state the frame draws.
    checkins[k] = { _id: 'seed-c-today', userId: 'SEED', date: k, mood: 3, energy: 2 };
    continue;
  }
  checkins[k] = {
    _id: `seed-c-${idx}`,
    userId: 'SEED',
    date: k,
    // `21 · Today` reads "Fine" for mood (3 of 5) and "Low" for energy (2 of 5)
    mood: 3,
    energy: idx % 4 === 0 ? 2 : 3,
    sleepHours: 6.5 + (idx % 3) * 0.5,
    emotions: idx % 3 === 0 ? ['Tired', 'Restless'] : ['Steady'],
    reasons: idx % 3 === 0 ? ['Late night'] : [],
    dailyAction: 'Phone out of the bedroom',
    dailyActionDone: idx % 5 !== 0,
    movedBody: idx % 2 === 0,
    socialContact: idx % 3 !== 0,
    structureFollowed: true,
    note: '',
  };
  ev('check_in', at(i, 22, 5));
}

// `91B · Urge Overview — Strength` and `85D · Urge Hub — Surfed before` both
// need a run of urges with severities across the band
for (let i = 0; i < 24; i++) {
  const daysAgo = Math.floor(i * 1.5);
  ev(i % 8 === 3 ? 'urge_acted_on' : 'urge_rode_out', at(daysAgo, 20 + (i % 4), (i * 13) % 60), {
    severity: 3 + (i % 7),
    trigger: TRIGGERS[i % TRIGGERS.length],
    precedingState: FEELINGS[i % FEELINGS.length],
    whatHelped: HELPED[i % HELPED.length],
    reopens: i % 5 === 0 ? 1 : 0,
  });
}

/**
 * `21 · Today — p2` sits on lesson 5 of week II, so four are behind it: week
 * II's first four, which `lessonSlug()` names `day-08` … `day-11`.
 *
 * `21E5 · Night — Record` reads "Part IV finished", so the fourth of them — the
 * one whose `dayInWeek` is 4 — has to be finished *today*, not on some earlier
 * day. They are listed newest first and stepped back two days apiece.
 */
const progress = {};
const LESSON_SLUGS = ['day-11', 'day-10', 'day-09', 'day-08'];
LESSON_SLUGS.forEach((slug, i) => {
  progress[slug] = { userId: 'SEED', lessonSlug: slug, status: 'completed', completedAt: at(i * 2, 8, 0), fitsMeRating: 4 };
  ev('win', at(i * 2, 8, 1), { note: 'Lesson finished.' });
});

const data = {
  user: {
    clerkUserId: 'SEED',
    displayName: 'Marcus',
    createdAt: start,
    onboardingComplete: true,
    settings: { showStreak: false },
  },
  progress,
  reflections: {},
  lifeMap: {
    userId: 'SEED',
    values: [
      { label: 'Focus', importance: 3 },
      { label: 'Sleep', importance: 3 },
      { label: 'Confidence', importance: 3 },
    ],
    whyStatement: 'The mornings are mine again.',
    updatedAt: start,
  },
  events,
  checkins,
  journalEntries: [
    {
      _id: 'seed-j-1',
      userId: 'SEED',
      tag: 'Pledge',
      title: 'Today’s pledge',
      body: 'The mornings are mine again.',
      createdAt: at(0, 7, 12),
    },
  ],
};

process.stdout.write(JSON.stringify(data));
