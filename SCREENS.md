# Tideline — Screen Map & Roadmap

What every screen in the app does today, and the screens it still needs. This is a
product/behaviour map, not a component spec — it describes *purpose, content, and
flow*, not where each `<View>` lives.

Tideline is a recovery-companion app (porn/compulsive-behaviour recovery) built
around a few non-negotiable principles that explain a lot of the design:

- **A lapse is neutral data, not a failure.** Nothing "resets to zero."
- **Leading indicators are the hero** (sleep, mood, connection, structure) — not a
  streak counter. A "days since" number is opt-in and deliberately secondary.
- **Calm over shame.** Copy reframes setbacks as information and growth.
- **Not medical advice.** A crisis/support route is always one tap away.

---

# Part 1 — Current screens

## Entry & authentication

### Splash / route decision (`index.tsx`)
The traffic-cop screen. Shows the "Tideline" wordmark + loader while it figures out
where you belong, then redirects:
- not signed in → **Sign in**
- signed in but onboarding not finished → **Onboarding / Welcome**
- signed in and onboarded → **Today**

Auth has two interchangeable modes: **Clerk** (real, when API keys are present) and a
local **offline/mock** mode (accounts stored on-device) so the app is fully usable
without a backend.

### Sign in
Email + password, "Welcome back" header. Errors render inline. Link to create an
account. In offline mode, shows a "accounts are stored locally on this device" note.

### Sign up
Name + email + password → creates the account and drops you into onboarding.

## Onboarding (the dark "starfield" flow)
A deliberately separate, immersive dark world (Quittr-style). Six numbered steps with a
progress indicator, no back-gestures, each saving as you go. Its job is to (a) make the
user feel understood and (b) seed the Life Map that the rest of the app references.

1. **Welcome** — brand moment: meditation-figure illustration, "TIDELINE", the tagline
   *"Embrace the pause. Build a life worth living."*, 5 stars, social-proof line, "Get
   started."
2. **Reasons** — "What brings you here?" Multi-select (reclaim time/focus, be present,
   feel in control, quiet the shame spiral, sleep/think clearly, rebuild self-respect).
   Stored to shape what the app reflects back.
3. **Pattern** — "When are urges strongest?" Multi-select HALT-style triggers (tired,
   alone, bored, stressed, late at night, after conflict).
4. **Why** — "Why now?" A free-text statement in the user's own words. This becomes the
   **why statement** on the Life Map and the pull-quote on the home screen.
5. **Analyzing** — a ~3-second "Building your plan" animation (progress ring + changing
   status text) that makes the prior answers feel processed. Auto-advances.
6. **Plan** — "This is where it can go": an illustrative 12-week upward curve (explicitly
   *not* a literal forecast) plus a checklist echoing the reasons they picked.
7. **Values** — "What do you value?" Chip multi-select (Connection, Health, Growth, …)
   saved as Life Map values.
8. **Done** — recap of their *why* + values, "Enter Tideline." Marks onboarding complete
   and clears the temporary onboarding scratch data.

## Main app (5-tab bar: Today · Weeks · Urge · Log · You)

### Today (home)
The daily landing pad. Contains:
- A top row: a **leaf chip** showing this week's check-in count (a gentle, non-streak
  signal) and an avatar that opens Settings.
- A time-aware lowercase greeting ("good morning/afternoon/evening.").
- A **week strip** (Sun–Sat) with checkmarks on days you checked in, today highlighted.
- **Today's lesson** hero card — category badge, title, "Week · Category · min", and a
  smart CTA ("Start / Continue / Review lesson" depending on progress).
- A **"Why you're here"** pull-quote card (the onboarding why statement) → taps to Life
  Map. Only shows once a why exists.
- A **"Riding out an urge?"** card → the Urge flow.
- **Tools** row: Add to log · Check-in · Life Map.
- A quiet "Need support right now?" link → Support.

### Weeks (the curriculum / path)
The full lesson library, grouped by week with a category header per week. Shows "X of Y
lessons complete" and lets the user move at their own pace ("there's no clock"). Each row
is a lesson with its category badge, status (Not started / In progress / Completed, with a
checkmark when done), and a "sensitive" tag where relevant. Tapping a row opens the lesson.

### Lesson reader (`lesson/[slug]`, full-screen, opened from Today/Weeks)
Two phases:
1. **Story** — a full-screen, dark picture-book. The lesson's content is split into a
   cover + one page per section. Lines **auto-reveal and crossfade one at a time**, then
   each page auto-advances to the next with a fade. Each page pairs a solid-silhouette
   illustration with a tinted eyebrow, a big serif lead sentence, and muted body lines.
   Tap to skip/advance; a progress bar and close (✕) sit on top. The last page shows
   **"Begin the practice."**
2. **Practice (task)** — a light page: the lesson's reflection prompt as the goal, the
   reflection input fields, and a 1–5 **"Did this approach fit you?"** scale (this
   "fits-me" signal is core — the app learns which *methods* suit each person rather than
   assuming one path). "Complete lesson" saves and marks it done. Sensitive lessons add a
   "find support" link.

### Urge ("Ride it out")
A guided in-the-moment tool. Flow:
1. **Rate** — an intensity slider (1–10): "How strong is it?"
2. Branches on intensity:
   - **Crisis** (≥7) — a breathing illustration with **typewriter** coaching ("one deep
     breath…"), then **one concrete, no-thinking action plan**: phone face-down → stand
     up → clothes/shoes → out the door → go to the furthest safe place → stay 15 minutes.
   - **Guided** (<7) — one breath, an optional "what's underneath it?" note, and
     **"Spot the trick"** cards: tap a cognitive distortion ("I can always quit later")
     to flip it to the truth.
3. **Outcome** — neutral logging: HALT state, what helped, what it taught you, then **"I
   rode it out"** or **"I acted on it."** Either way it's framed as data. Acting on it
   routes into the Relapse screen (below). Riding it out logs a win-shaped event and
   returns to the Log.

### Log
Three segmented tabs:
- **Log (event)** — record a Win / Lapse / Urge rode out / Urge acted on, plus optional
  HALT state, trigger, what helped, and what you learned. Saving a **lapse** opens the
  Relapse screen. Everything is framed as "data to learn from — never a scorecard."
- **Check-in** — the daily leading-indicators form: hours of sleep, a **"How are you
  feeling?"** card that opens the full **Mood Logger**, and toggles for moved my body /
  real connection / kept some structure, plus a free note. Upserts one row per day.
- **History** — a reverse-chronological feed of events and check-ins, each with a coloured
  icon badge and its details.

### You (Dashboard / Insights)
The "what's actually moving" view — explicitly *not* a number to protect. Contains:
- A hero card: a lessons-completed **progress ring**, check-ins this week, reflections
  count, average mood.
- **Mood** — 7-day line chart with a plain-language summary ("Steady", "Heavy", …).
- **Sleep** — 7-day bar chart with an average and a verbal read.
- **This week** — meters for moved body / real connection / kept structure (n out of 7).
- **Check-in rhythm** — a consistency heatmap (how complete each day's check-in was).
- *Optional* "days since last lapse" card — only if the user opted into the streak number
  in Settings, and worded as "not a streak to defend."
- A link into the full Log.

### Life Map (off-tab, from Today/Settings)
The user's anchor, editable any time: their **why**, a "one year from now" answer, and a
set of **values** (suggested chips + add-your-own). The app surfaces these back at useful
moments. Saves on demand.

### Settings (off-tab)
- **Progress** — toggle the optional "days since" number (off by default, with a careful
  explanation that a lapse never resets it as a failure).
- **Daily reminder** — a reminder time field (stored now; real notification scheduling is
  not yet wired — see roadmap).
- **Anchors** — shortcuts to edit Life Map / find Support.
- **Account** — name, email, current data + auth mode, and Sign out.

### Support (off-tab)
The crisis/professional-help route. Clear "this is a self-help tool, not medical advice or
a crisis service" framing. **Currently placeholder resources** — real, region-aware crisis
lines and a vetted therapist directory must be added before shipping to anyone.

## Global overlays (not routes, but full-screen experiences)

- **Launch urge overlay** — on each app open, a "Riding a wave?" overlay offers an
  immediate **Urge surf** button (→ Urge flow) or "I'm steady right now" to dismiss. Shows
  once per launch.
- **Relapse screen** — shown after logging a lapse / "acted on it." A full-screen, dark,
  **speaks-to-you** moment: encouraging one-line sentences appear word-by-word and
  crossfade, reframing the relapse as growth (different each time), ending in **"Begin
  again."** No shame, no counter reset.
- **Mood Logger** — an Apple-Health-style 3-step sheet: pick a pleasantness level (very
  unpleasant → very pleasant), then emotion words appropriate to that valence, then what's
  driving it. Feeds the daily check-in.

---

# Part 2 — Screens the app still needs

Grouped by priority. Each notes what it does and what it depends on.

## A. Monetisation (needed before launch)

### Paywall / Subscription screen
The pricing page: plan options (e.g. monthly / annual / lifetime), the value
proposition, free-trial terms, restore-purchases, and legal links. Almost certainly shown
**during onboarding** (after the "Plan" projection, before "Done" — the highest-intent
moment) and reachable any time from Settings.
- *Depends on:* RevenueCat (recommended for Expo) or native StoreKit/Play Billing; a
  `subscription`/`entitlement` concept on the user; App Store / Play products configured.

### Manage subscription / billing (in Settings)
Current plan, renewal date, upgrade/downgrade, restore purchases, cancel guidance, and
links to the store-managed subscription. Required by both app stores.

### Hard/soft gate states
Locked-lesson and locked-feature states for free users (a tasteful "unlock with Tideline
Plus" rather than a dead end), plus the "trial ending" nudge.

## B. Journaling (explicitly requested)

### Journal (free-form)
A standalone journaling space distinct from the structured Log: open-ended entries, dated,
optionally tagged or mood-stamped, browsable as a timeline and searchable. Likely its own
tab or a prominent Today entry point. Good home for guided prompts ("What did the urge cost
you / what did riding it out give you?"). The end-of-lesson reflections and the urge "what
I learned" notes could surface here too, so the user has one place that accumulates their
own words over time.
- *Depends on:* a new `journalEntries` table (date, body, tags, optional mood/links);
  search.

### Entry composer + entry detail
Write/edit an entry (text first; later: photos, voice-to-text), and a read view with edit
/ delete. Prompted vs. blank modes.

## C. Intelligence (the "set up AI later" work)

### Personalised roadmap
Turn onboarding answers (reasons, patterns, values, why) into an actual sequenced plan —
"your next 7 days / 12 weeks" — instead of a static lesson list. A screen that shows the
tailored path and adapts as the user logs.

### AI-tailored content surfaces
- **Tailored lessons** — lesson copy adapted to the user's situation (the current lesson
  bodies are partly placeholder/lorem; real curriculum + AI personalisation both live
  here).
- **Custom relapse text** — relapse lines generated for *this* person's stated why and
  values, not from a fixed pool.
- **Custom urge/panic screens** — the panic plan tailored to their actual triggers and
  environment.
- *Depends on:* an LLM integration (server-side), prompt context assembled from Life Map +
  recent events, and content-safety guardrails.

## D. Notifications & re-engagement

### Real reminders / notifications
The Settings reminder time currently only stores a value. Needs: a permission-priming
screen (ideally in onboarding), real local-notification scheduling, daily check-in nudges,
and "your urge-prone time is coming up" smart nudges based on the Pattern answers. A
later check-in reminder was explicitly wanted.
- *Depends on:* `expo-notifications`, permission UX, scheduling logic.

### Notification permission primer (onboarding step)
A "turn on gentle reminders" screen explaining the value before the OS prompt — raises
opt-in rates dramatically.

## E. Account, data & trust

### Profile / edit account
Change name, email, password, avatar; manage connected auth.

### Privacy, data export & delete-account
Given the sensitive subject matter this is essential and store-required: export my data,
delete my account/data, privacy explainer. A "panic-hide / app-lock (Face ID / PIN)" and
discreet app-icon option are strongly worth considering for this category.

### Legal
Terms, Privacy Policy, subscription terms — linked from paywall, settings, and sign-up.

## F. Engagement & depth (post-MVP)

- **Milestones / "never fail twice"** — gentle, opt-in milestone moments and a "don't miss
  twice in a row" mechanic that rewards getting back on track rather than raw streak
  length (consistent with the no-shame principle).
- **Achievements / progress story** — a narrative of growth over time (lessons, reflections
  written, urges ridden out) rather than a counter.
- **Community / accountability** *(optional)* — anonymous peer support, an accountability
  partner, or check-in buddies. High-value but high-moderation-cost; decide deliberately.
- **Lesson library browse/search** — filter the curriculum by category/approach, search,
  and "fits me" filtering once enough fits-me signal exists.
- **Education / "why this works"** — the science/rationale content for skeptical users.
- **Widgets & lock-screen** — a daily check-in or "ride it out" shortcut outside the app.

## G. Smaller gaps in what already exists

- **Support screen needs real resources** (currently placeholders — blocker for any
  release).
- **Empty/first-run states** for Weeks, History, and Dashboard when there's no data yet
  (Dashboard especially reads oddly with zero check-ins).
- **Error / offline / loading polish** beyond the current simple loaders.
- **Settings → theme** (the data model already has a `theme` slot; currently dark-only).

---

## Suggested build order

1. **Pre-launch blockers:** real Support resources, paywall + subscription management,
   privacy/data-export/delete, legal pages.
2. **Requested core:** Journaling, real notifications (+ onboarding primer).
3. **Differentiators:** personalised roadmap + AI-tailored lessons/relapse/urge text.
4. **Depth:** milestones/"never fail twice", library search, community (if pursued),
   widgets, app-lock.
