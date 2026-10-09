# Voice pass: onboarding package

Changed 30 strings across 6 files. `npx tsc --noEmit -p .` and `npx eslint` on the changed files are both clean.

| File | Before | After |
|---|---|---|
| src/content/onboardingFunnel.ts (03 · Name, title) | What should we call you? | What’s your name? |
| src/content/onboardingFunnel.ts (06 · Start, title) | Sam, let’s figure out what usually leads you back to porn. | Sam, what usually leads you back to porn? |
| src/content/onboardingFunnel.ts (06 · Start, body) | It’ll take about two minutes. Then we’ll show you what we’d change first. | It takes about two minutes. Then you’ll see what to change first. |
| src/content/onboardingFunnel.ts (09B · Relapse, title) | When you’ve tried to quit, how long do you usually make it before watching again? | When you try to quit, how long until you watch again? |
| src/content/onboardingFunnel.ts (10 · First principle, title) | An urge doesn’t stay at its worst for very long. | An urge doesn’t stay at its worst for long. |
| src/content/onboardingFunnel.ts (10 · First principle, body) | The first job is getting through the part where giving in feels easiest. | The first job is to get through the worst of it. |
| src/content/onboardingFunnel.ts (15 · Transition, title) | Okay. That’s enough to see where things usually start. | That’s enough to see where it usually starts. |
| src/content/onboardingFunnel.ts (15 · Transition, body) | A few more questions, then we’ll show you what we’d change first. | A few more questions. Then you’ll see what to change first. |
| src/content/onboardingFunnel.ts (23 · Goal confirmation, masturbation card) | Masturbation isn’t part of what you’re trying to stop. **Porn is.** | Masturbation isn’t what you’re changing. **Porn is.** |
| src/components/onboarding/funnel.tsx (23 · Goal confirmation, "Watch much less") | You want porn to take up a lot less of your life. | You want to watch much less. |
| src/components/onboarding/funnel.tsx (23 · Goal confirmation, "Set a limit") | You want to set a limit and actually keep it. | You want to set a limit and keep it. |
| src/components/onboarding/funnel.tsx (23 · Goal confirmation, "Not sure", line 2) | We’ll start with getting the choice back. | First, get the choice back. |
| src/components/onboarding/funnel.tsx (under-18 gate, title) | This one is for over-18s. | VICI is for over-18s. |
| src/components/onboarding/funnel.tsx (under-18 gate, body) | Come back when you are. If porn is already getting in the way, someone you trust — a doctor, a counsellor, a parent — is a better first step than an app. | Come back when you are. If porn is already getting in the way, talk to someone you trust: a parent, a doctor or a counsellor. |
| src/components/onboarding/plan.tsx (26 · Start Here, sentence when no answer applies) | It’s one small change, and it’s yours to make tonight. | It’s one small change. Make it tonight. |
| src/components/onboarding/plan.tsx (25 · Where to start, title with name) | ${name}, this is where we’d start. | ${name}, this is where to start. |
| src/components/onboarding/plan.tsx (25 · Where to start, title without name) | This is where we’d start. | This is where to start. |
| src/components/onboarding/plan.tsx (27 · Your Plan, row 3 sub) | What tends to set it off | What sets it off |
| src/components/onboarding/plan.tsx (27 · Your Plan, row 5 title) | SOS gets you out first | Open SOS |
| src/components/onboarding/tail.tsx (24 · Build plan, row 2) | Looking at what tends to set it off | Looking at what sets it off |
| src/components/onboarding/tail.tsx (29 · Next 30 days, paragraph) | If the rate you reported stayed the same, **{share}** could end with porn. | At the rate you reported, **{share}** could end with porn. |
| src/components/onboarding/tail.tsx (29 · Next 30 days, footnote) | The line can start changing with the next one. | It can change, starting today. |
| src/components/onboarding/tail.tsx (32 · If nothing changes, body) | Left alone, the pattern stays — and it can grow. An illustration, not a forecast. | Left alone, the habit stays and can grow. This is not a forecast. |
| src/components/onboarding/tail.tsx (32A · With the plan, body) | You only have to make the next decision different. Then the next one. Then come back tomorrow. | Get the next decision right. Then the next one. Then come back tomorrow. |
| src/components/onboarding/tail.tsx (33 · One bad day, closing line) | What matters is that you come back. | Log it and come back. |
| src/components/onboarding/tail.tsx (34 · What you want back, line 1) | Not a perfect streak for its own sake. | The streak is only a number. |
| src/components/onboarding/tail.tsx (34 · What you want back, line 2) | More of your time and attention going where you actually want them. | Get your time and attention back. |
| src/components/onboarding/reminders.tsx (42 · Reminders, sub) | Want VICI there before that time? | VICI can remind you before then. |
| src/components/onboarding/reminders.tsx (Day 0, line under the lesson card) | Your first lesson is ready. Start with one thing today. | Your first lesson is ready. Read it today. |
| src/components/onboarding/v3.tsx (`windowFor`, window name for “When I’m bored”, shown in the 42 · Reminders title) | Boredom in the day | Boredom |

## Second pass (review)

- Relapse question: "how long do you usually last" can be read as sexual stamina. It now says what is timed.
- First principle body: "get through it" lost the point that only the peak passes quickly. Now "the worst of it".
- One bad day: "Come back the next day" read as "stay away for the rest of the day" and echoed "With the plan".
  Now "Log it and come back."
- Masturbation card: it shows for every porn goal when he keeps masturbation, so "trying to stop" contradicted
  "watch much less" and "set a limit". The card text is display-only.
- Day 0: "Start with one thing" never said which thing. The thing is the lesson in the card above.
- `windowFor` "Boredom in the day": he gave no time of day, and the check-in for this answer is set before 9:00 pm.
  Only `windowFor(a)[2]` feeds the reminders title; nothing stores or compares it. The title now reads "Boredom is
  when you’re most likely to watch."

## Supporting edits (not new copy)

- `funnel.tsx` `NATIVE_BREAKS`: the native line breaks for the two changed titles follow the new words, so the
  break still applies. `relapseSpan` drops from three lines to two ("When you try to quit, how / long until you
  watch again?"; Lato Bold 26 at -0.6 measures 286 and 296 in the 345 column). `firstPrinciple` keeps its break ("An urge doesn’t stay at / its worst for long.").
- `funnel.tsx`: one doc comment quoted the old Start title; it now quotes the new one.

## Note for the owner

`src/content/onboardingFunnel.ts` says it is generated by `scripts/overhaul/gen-funnel.mjs` from the canvas. It has
been hand-edited before (the name screen's encryption line). If that generator runs again, it puts back the canvas
copy for the nine funnel rows above, so redo them by hand after it runs.

## Left alone on purpose

- Answer options on every question (frequency, duration, quit attempts, relapse span, triggers, feelings, places,
  what starts it, impact, what it affects, loneliness, time alone, both goals, what you’ve tried). They are stored
  as answers and compared in code: `welcome.tsx` (skip rules, sample answers), `v3.tsx` (`DAYS_PER_30`,
  `windowFor`), `plan.tsx` (`CHIP_LABEL`, `WHEN_SHORT`, `WHERE_SHORT`, `STARTER`, `FIRST_CHANGES` keys),
  `funnel.tsx` (`O3_EXCLUSIVE`, `O3_GOAL_CONFIRM` keys, the "Not really" zero-pick rule) and the paywall.
- "Encrypted in transit and at rest.": set on purpose in commit a520d89a ("encryption stated as it is").
- Questions already plain and short: age, gender, how long, tried before, when, feeling, where, what sets it off,
  impact, what it affects, loneliness, time alone, goals, what you’ve tried. "Select all that apply", "Choose up to
  three", "Your name", "Continue", "Start", "Next", "Choose another", "Step 1 of 2".
- 23 · Goal confirmation: "You want to stop.", "That’s what we’ll work toward." and "You don’t need to decide
  forever today.". These are already short and direct.
- The four first-change boards in `plan.tsx` (headings, steps, notes, plan rows). They are already short commands.
  Their native line breaks are keyed on the exact heading text.
- The short pill and sentence forms in `plan.tsx` (`CHIP_LABEL`, `WHEN_SHORT`, `WHERE_SHORT`, `STARTER`). They
  are plain fragments made from his answers.
- "Putting your plan together…", the recovery-rating board, "This is your next 30 days.", "One year from now.",
  "By age 80", "If nothing changes.", "With the plan.", the chart caption and tooltips, "One clean day. / That’s
  all today has to be.", "One bad day is one bad day." and its body, "This is what you’re doing it for.". These
  are already plain.
- `v3.tsx` `windowFor`: the other window names ("Late night", "After stress" …) shown in the reminders title are
  plain. The second field ("before the tide rises" …) is never displayed anywhere in the app.
- `handover.tsx`: "A letter arrived.", "From VICI, written as you at week twelve." (also used by `/letter`),
  "Open", "Save it for later", "Keep this letter", "The vow.", "Signed on day 0", "Sign", "Not now". The letter
  card's eyebrow and salutation belong to the letter, which the owner edits.
- `reminders.tsx`: `REMINDER_NOTES` and its "You pick the time" are notification copy (out of scope). The rest of
  the Day 0 board ("Today", "Day 0", "Begin") is already plain.
  The fallback "Prepare for tonight" is a lesson title (out of scope).
- `welcome.tsx`: the sign-out sheet ("Use a different account?", "You’re signed in as …", "Sign out", "Keep
  going"), the medallion ("Veni", "Your first medallion.", "You started.") and the journal entry titles. These are
  already plain. The journal letter body is the letter (out of scope).
- `src/content/onboardingTail.ts` has no user-visible text.
- Dev-only lab screens (`src/components/mono/lab/*`) still show the old onboarding copy as samples (out of scope).
