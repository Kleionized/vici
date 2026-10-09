# VICI voice: plain, direct, stoic

The model is Ryan Holiday's prose (The Obstacle Is the Way, Ego Is the Enemy, Stillness Is the Key, Courage Is
Calling, Discipline Is Destiny, The Daily Stoic), measured across ~570,000 words, plus the catalogue of AI-writing
tells (Wikipedia: Signs of AI writing) and the plain-English rules of Orwell and Strunk. This guide describes the
patterns; it does not quote the books. App copy is original and must never reproduce passages from them.

## What the books do (measured)

- Short sentences. Median 11 to 15 words in the books; one sentence in four is six words or fewer. In the app,
  aim lower: most lines under 12 words.
- Almost no semicolons. Few adjectives. Strong, ordinary verbs: do, start, stop, hold, act, wait, get up.
- The reader is addressed directly ("you"), and often included ("we"). Never "users", never "one".
- One idea per paragraph, often one line per paragraph. A point is stated, then left alone.
- Fragments for weight, used sparingly, usually at the end: a short line that lands the point after a longer one.
- Short runs of parallel commands or facts, two or three in a row: "Get up. Get dressed. Start." Each is short
  and concrete. (A run of commands is fine; a run of adjectives is an AI tell.)
- Questions put to the reader, then a plain answer. Never a rhetorical question answered with a flourish.
- Titles are one of three shapes: a command ("Just Show Up", "Do the Hard Thing First"), a direct question
  ("What Can You Endure?", "Can You Get Back Up?"), or a flat statement ("Silence Is Strength").
- Failure is named without drama and without comfort: what happened, whose it was, then what to do next. No pity,
  no shame, no "it's okay". The turn is always toward the next action.
- Praise is understated and factual. Progress is shown by the number, not by adjectives.
- Encouragement is practical. Small, specific steps; "start small" rather than "you've got this".

## Rules for VICI copy

1. Say what it is or what to do. Cut any line that only sets a mood.
2. Prefer the shorter version. If a line can lose words and keep its meaning, it loses them. Never make a string
   longer than the original unless the original was unclear.
3. Use plain words: "log", "slip", "urge", "day", "check-in", "lesson", "plan". No coined metaphors for app
   features (no "the post is in", "enclosure", "waterline", "tide", "harbor", "breakwater" as metaphors in
   instructions; medallion names stay as names).
4. Headings: 1 to 5 words; a command, a direct question, or a flat statement. Sentence case. Keep the trailing
   period where the screen's other headings use one.
5. Buttons: a verb first, 1 to 3 words ("Continue", "Log it", "Start again", "Read"). No "Let's".
6. Body: one or two sentences. State the fact, then the next step.
7. Slips: plain and steady. "You slipped. Log it and start again." Never "Don't worry", "It's okay", "Be gentle
   with yourself", "You've got this", "Every journey has setbacks".
8. Wins: the fact and a short push. "Seven clean days. Keep going." No "Amazing!", no "You're crushing it".
9. Second person, present tense, active voice.
10. No exclamation marks. No emoji. No em dashes (use a period or a comma). No ellipses for drama.
11. Numbers as digits for counts and times ("3 days", "8:00 AM"); words are fine for one-off small numbers in
    sentences where digits look odd.
12. Keep every variable, placeholder, count and condition in a string exactly as it works now.

## Banned (AI tells)

- Inflated significance: testament, pivotal, crucial, vital, profound, powerful, transformative, journey (as a
  metaphor), embark, unlock, unleash, empower, elevate, thrive, flourish, game-changer, "this matters",
  "worth keeping", "means a lot".
- Promotional and soft words: vibrant, rich, seamless, effortless, beautiful (of the app), meaningful, amazing,
  incredible, wonderful, truly, deeply, genuinely, honestly, actually, really, simply, just (as filler).
- Structures: "It's not X, it's Y"; "not just X but Y"; "X, not Y" used as a slogan; adjective triplets
  ("calm, clear and confident"); trailing "-ing" clauses that add commentary ("…, giving you clarity");
  "Here's the thing"; "Let's"; "Ready to…?"; questions answered by the next line for effect.
- Self-narration: "We'll walk you through", "We've put together", "Take a moment to", "Feel free to".
- Therapy and coaching cliches: hold space, honor your feelings, be kind to yourself, self-care, you've got this,
  you're doing great, every step counts, progress not perfection, on your terms.
- Vague hedges: might, perhaps, maybe, a bit, kind of, somewhat (unless the uncertainty is real and stated).
- Fake specificity: invented statistics, research claims or quotes. Quotes only with a real, correct source.

## Out of scope (owner edits these)

- Lessons: all lesson content and the lesson reader (src/content/lessons.ts, curriculum84.ts,
  interactiveLessons.ts, seedLessons.ts, lessonReader.ts, lessonPlates.ts, src/content/interactive/*,
  src/components/lesson/*, src/app/lesson/*, src/app/task/*, src/app/lesson-card/*).
- Notifications: the reminder and trial notification text (src/lib/reminders.ts) and the notification previews
  on the reminders board (REMINDER_NOTES in src/components/onboarding/reminders.tsx).
- Emails / letters: the bodies of VICI's letters (the text read inside a letter: letter.tsx and Letter.tsx
  letter bodies, the day-zero letter in handover.tsx, the medallion letter body). The screens around them
  (arrival boards, buttons, titles, Mail rows) are in scope.

## Before and after (from the app)

| Before | After |
|---|---|
| The post is in. A short letter from VICI — two minutes, worth keeping. | A letter came. It takes two minutes to read. |
| Finding the waterline… | Loading… |
| Sign in or create an account to keep your plan and progress. | Create an account to save your progress. |
| Your reflections, your log, your path — kept safe across devices. | Keep your log and lessons safe across devices. |
| You came back. | (keep: short, factual, earned) |
