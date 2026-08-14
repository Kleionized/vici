# VICI / Tideline — Overnight Implementation Prompt

> Hand this whole document to the coding agent. It is the single source of truth for updating the app's UI, visualizations, and features to match the current design. It supersedes any earlier version of this prompt.

---

## 0. How to work (autonomy directives)

- **Work autonomously, overnight.** Do **not** stop to ask clarifying questions. Where a detail is unspecified, make the choice most consistent with the design system and principles below, then keep going.
- **One strong version of everything.** Never build A/B variants, option pickers, or "explore a few directions." Each screen, component, and visualization has exactly one canonical implementation. No feature flags for competing looks.
- **Onboarding is always v3.** Delete/ignore any older onboarding (v1/v2). The v3 funnel described in §5 is the only onboarding.
- **Skip empty scaffolding.** Any screen that is a bare template, a placeholder, or has no real content today does **not** need to be built. **Everything with real content or a real job described here MUST be implemented.**
- **Ship working code, then self-review.** After each screen/feature, verify it renders with no console/runtime errors, matches the spec, and reads with the correct copy voice. Fix before moving on.
- **Reuse, don't reinvent.** Keep the existing navigation, data layer, and component structure where sound; restyle and extend rather than rewriting the app shell.
- **Respect the data model.** Where a feature needs new persistence (journal entries, entitlement, notification prefs), add the table/field and wire it end to end; don't fake it with local state only.

---

## 1. Product & principles

VICI (working surface name "tideline") is a calm, private recovery app for compulsive behavior. It is **stoic in tone, clinical in restraint, never preachy.** Every screen must obey four principles — they explain *why* the UI is shaped the way it is:

1. **A lapse is neutral data, not a moral event.** Logging a slip uses the exact same calm UI as logging a win. No red, no shame, no "you failed."
2. **Leading indicators over streaks.** Emphasize logged urges, triggers, check-ins, and patterns — the things that predict success — over a fragile day counter.
3. **Calm, not shame.** Quiet typography, generous space, monochrome. Reassurance is factual, never gushing.
4. **Not medical advice.** Never diagnose or promise clinical outcomes. Frame projections as estimates ("a projection of the plan's shape"), not guarantees.

---

## 2. Design system (strict)

### Color — monochrome only
- **No hue accents, ever.** Black, white, and warm grays only — the Stoic discipline. No blue, green, or colored CTAs.
- Light base ("paper"): background `#F4F3F0`, ink `#1D1C1A`, secondary ink `#55534E`, tertiary `#8B8882`, hairline `rgba(0,0,0,0.08)`, card `#FFFFFF`, soft fill `#EFEDE7`.
- Primary fill (buttons, selected chips): near-black `#22201D` with paper-white text `#F7F6F1`.
- **Dark-dominant heroes.** Full-bleed moments (auth, relapse, lesson image beats, urge finish) sit on near-black `#0B0B0C` / `#08080A` with light text. Any illustration that used to read beige/cream/gray-heavy must be re-toned **black-dominant**.
- Provide the scene kit in two tones (paper + ink) switched by a single `setSceneTone` call; default app is paper, heroes are ink.

### Type
- **Display / hero:** an editorial serif (Newsreader / Spectral / EB Garamond family), weight 500, tight leading, letter-spacing ~+0.01em. Used for headings, quotes, band names, celebration lines.
- **Body / UI:** a neutral grotesque (Inter-class), weights 400/500/600.
- **Eyebrows:** small caps, letter-spaced — used **sparingly**. Do **not** stamp a tiny all-caps sans subtitle on top of every screen (see §4).
- Minimum on-device body ~13–14px; hero text large and confident.

### Icons & marks
- Monotone, engraved **line** icons — single ink weight, no fills-as-color. Slightly more iconography than a bare wireframe, but always monochrome.
- The **laurel wreath** is the brand mark (replaces earlier wave/flame marks in hero spots, e.g. above the home quote and on lesson-complete). Draw it generously — larger than a typical inline icon.

### Motion
- Calm, short (≤300ms), ease-out entrances. Letterpress "press-and-settle" for confirmations; a firm double-tap haptic for seals/milestones.
- **No** decorative bubble/particle bursts on celebration (the bubble animation was removed). **No** infinite decorative loops on content. Reduced-motion and print must show the finished state, never a pre-animation blank.

### Scene art
- Faceted / planar landscape vignettes (sea-to-summit metaphor) drawn in flat ink planes, not gradients. Paper tone for in-app, **black-dominant** ink tone for heroes.
- Breathing-tool wave: a clean rising/falling crest for inhale/exhale. **No birds/gulls.** Keep it minimal.

### Anti-slop rules (hard constraints)
- No gradient-wash backgrounds, no emoji, no rounded-card-with-colored-left-border, no gratuitous stat/number/icon "data slop."
- Less is more. One thousand no's for every yes. If a section feels empty, solve it with layout — not filler.

---

## 3. Global layout & components

- **Device:** phone-first, iOS framing.
- **Five-tab bar:** Today · Weeks · Urge · Log · You. Monochrome line icons, label under each.
- **Screen header:** back chevron · optional segmented progress · close (✕). Consistent across flows (onboarding, urge, urge-log, lesson, paywall).
- **Primary button:** full-width pill, near-black fill, paper text.
- **Selection cells:** white card, radius ~18; selected = `inset 0 0 0 1.8px ink`; icon chip fills ink when active.
- **Cards:** white, radius 18–24, hairline dividers for row lists (the "home checklist" grammar). No heavy shadows.
- **Overlays:** launch **Urge** overlay (one-tap from anywhere), **Relapse** screen, **Mood logger**, **Letter** delivery — all full-screen, dark chrome where the moment is heavy.

---

## 4. Copy voice (enforce on every string)

- **Short and factual. Never "cool."** Do not write lines that try to sound poetic or profound. State what the thing is and what it does.
- **Non-shame, neutral for lapses.** "A slip is data, not failure." Never "you failed."
- **Kill redundant eyebrows/subtitles.** No tiny all-caps sans label restating the heading ("The reading", "How you've been", "The first wave", "Before anything is asked"). If a subtitle doesn't add function, delete it.
- **VICI-flavored, not wave-clichéd.** The brand line is about *conquering / steady progress*, not "the urge is a wave." Do not use "the urge is a wave" as a slogan (it may appear once as literal instruction inside the breathing tool only).
- Reassurance captions are allowed only when functional and plain: e.g. "Never graded," "Nothing leaves your phone," "The urge tool is free forever."

**Concrete deletions/rewrites already decided (do not reintroduce):**
- ✗ "Sealed on day zero for exactly this morning. Open it before you decide anything about yourself."
- ✗ "It rose, crested, and passed" → ✓ "Waited; it passed"
- ✗ "Told someone, broke the spell" → ✓ "Told someone"
- ✗ "That's okay — begin again" → ✓ "It happened"
- ✗ "Noted, gently." / "Every urge you log is a pattern you can see — and a pull that lost its grip." → ✓ "Urge logged." / "Each one adds to your pattern data."
- ✗ "Small steps. Steady days. That's how it changes." (sloppy filler) — remove.
- ✗ "everything true tonight," "no one reads this but you," "Late nights. The most common ground there is…," "The one tool you'll use mid-crisis is free, forever…," "First, your privacy," 'It means "I conquered." Everyone who gets there started right here.' — all removed; keep it plain.
- Replace any "you don't conquer once…" line with a short **Stoic philosopher quote** (Epictetus voice) on the home screen, set under the laurel.

---

## 5. Onboarding v3 (the only onboarding)

A ~3-minute personalized intake that builds each user their own plan. Implement **every** question from the intake spec (the provided questions doc). Present them with **varied input grammars**, not endless vertical pill lists:

- **Icon grids** — boxes with a monochrome line icon + label (e.g. triggers, what you've tried).
- **Segment / meter scales** — for frequency and severity.
- **Chip wraps** — multi-select tags.
- **Pills** — only where a short single choice fits.
- Some branches are **questionnaire-first**: ask (e.g. "on a laptop / in bed?") on its own step, *then* show the tailored response — never show the answer before asking.

**Flow order:**
1. Intake questions (grouped: "Where you're starting," etc.) — no redundant eyebrows.
2. **The reading** — a constructed pause that reflects their answers back.
3. **Creating your plan** — the v2-style "building your plan" beat.
4. **Results** — projected timeline. Include a stakes page driven by their answers (e.g. "~365 more times by next July" if unresolved) and a hope page ("Your brain can rewire," with a projected ~12-week curve). Frame as projection, not promise.
5. **Campaign map reveal** — the sea-to-summit map, animated.
6. **First tool: the wave, ridden** — a live breathing exercise (fixed inhale/exhale crest, no birds).
7. **Pledge** — "set your mark."
8. **The letter** — the user **reads** a letter *from the version of them at week XII*, assembled from their own intake answers (their listed costs, triggers, the ending they didn't meet). The user does **not** write it. It is kept in the Log.
9. **Day I.**
10. **Notification primer** — permission ask, pre-screened.
11. **Save** — plan saved (medallions row etc.).
12. **Paywall** — placed here, mid-onboarding, after the plan. See §7. The onboarding paywall must include the **actual payment pages**, not just a pitch.

---

## 6. The five tabs

**Today (home).** Parchment ground, serif voice, engraved icons. Top-left **mood chip** showing today's logged mood (this replaced the streak/laurel pill). A **Stoic quote** (Epictetus) under a large **laurel wreath** mark. A dark full-bleed **"next lesson"** card. **Today's steps** checklist (hairline rows, N of M).

**Weeks (curriculum).** Journey overview list + an immersive **per-world hub**. Sea-to-summit terrain map in warm ink. Weeks/grounds counted in **Roman numerals**.

**Urge.** Rate → guide → outcome:
- **Where are you?** icon grid.
- **How strong is it?** a **vertical list of intensity bands**, each row an ink **ring that fills** with the level (the mood-check-in circular grammar) + short factual note. (This matches the Urge-**Log** intensity step — see §8.)
- **Breathe / ride it out** — the breathing tool (clean wave, no birds), phase tips are literal ("Notice it," "It rises," "The crest," "It breaks").
- **You rode it out** — a **full-screen night-sea** finish (dark, immersive). If a bottom popup is used, give it dark chrome so it fits.

**Log.** A **one-door chooser** ("what are you capturing?" — check-in / urge / moment / journal), then:
- **Urge log:** intensity (vertical band list) → triggers (icon grid, multi) → outcome (single-select: rode it out / used the timer / did something else / told someone / I slipped) → when (day chips + time wheel) → **done** (factual confirmation + summary card).
- **Check-in** and **moment** logs.
- **History.**

**You (insights).** Read off the logs: mood-trend **TideChart**, **when-in-the-day** buckets, top triggers/reasons/feelings, a row of **monument numerals** (check-ins, urges logged, days kept), and a **weekly report** (this week vs last).

---

## 7. Off-tab screens & global overlays

**Lesson reader.** **Paged**, one idea per page (urge-flow grammar): title → idea (one serif line) → full-bleed image beat → the move → close → done (laurel). Keep it minimal and factual. A scroll fallback may exist but paged is primary.

**Medallions** (renamed from "Keepsakes"). A campaign album of ~11 medallions grouped earned / within reach / ahead; tap → story. Each medallion is a small faceted ink scene. Redraw the weak ones cleanly — e.g. "Never failed twice" (a mended sail) and "Vici" (a standing rock the sea can't move); the "letter sent" medallion's envelope must be **centered**. Include "Storm weathered," world-progress, "Let someone in," etc. Stories are terse.

**The letter (relapse).** A sealed envelope (use the supplied **wax-seal artwork**) waits in the Log; the morning after a slip it arrives over Today. Breaking the wax unfolds a serif letter whose message is **"don't fail twice"** — nothing since day zero is erased. It then **reseals** itself back into the Log. No flowery subtitle on the arrival card.

**Life Map, Settings, Support** — implement Settings (incl. manage-billing, notifications, app-lock, profile, legal — see §9); Life Map from the onboarding seed; Support.

**Overlays:** launch Urge overlay, Relapse screen, Mood logger (circular medallion disc).

---

## 8. Visualizations (exact grammar)

- **Mood check-in disc:** a framed circular "medallion" whose ground floods along a 5-step **MOOD_TONES ramp** (pale → near-black) as mood rises; content drawn duotone. This is the canonical circular grammar.
- **Urge intensity (surf + log):** a **vertical list of five bands** — Faint, Mild, Strong, Intense, Overwhelming — each row with a small **ink ring that fills** proportionally + a short factual descriptor ("Barely noticeable," "Hard to ignore," "Almost gave in"). **Not** a slider, **not** a morphing wave scene. Both the Urge tab and the Log flow use this identical component.
- **TideChart (insights):** mood/urge trend as a tide line with band guides; black-dominant, no color.
- **When-in-the-day:** 2-hour buckets, dark hours washed; one mark per logged urge.
- **Campaign map:** sea-to-summit, ink terrain, Roman numerals riding the course.
- **Scene kit:** paper tone in-app, **ink (black-dominant) tone** for heroes; switch via `setSceneTone`. Any previously beige/cream/gray-heavy visualization must be re-toned darker.
- **Medallions:** faceted ink vignettes, consistent foam-line grounding.

---

## 9. New features to build (part-2 gaps — all required)

**Monetisation (launch blocker).**
- **Multi-page paywall** (higher-converting): page 1 **pitch** (summit hero + "everything unlocked" checklist, built from the user's intake answers) → page 2 **plans**: **Yearly $39.99** ($3.33/mo) and **Monthly $12.99**. No trial offered up front.
- Pressing **✕** on the plans page (or declining in the funnel) is **rescued once** by a **3-day free-trial** offer (a simple timeline: today unlocks → day 2 reminder → day 3 charge). Declining that actually exits. "The urge tool is free forever."
- **Real payment**: an Apple-Pay-style sheet showing app, (trial if applicable), account, card, billing, due-today, then a **Confirmed** screen ("Begin Day I"). The onboarding paywall includes these pages.
- **Manage subscription** in Settings; **locked-feature** states elsewhere; an **entitlement** concept on the user (RevenueCat). The urge tool is never locked.

**Journaling.** A free-form, **dated, searchable** journal, distinct from the structured Log. New `journalEntries` table. It is the natural home for lesson reflections and the urge "what I learned" notes.

**Notifications.** `expo-notifications`: the permission-primer onboarding step, stored reminder time(s), and **smart trigger-time nudges** (not just one fixed time).

**Account / trust.** Edit profile, **data export**, **delete account** (store-required for this category), **app-lock / Face ID**, legal pages.

**Intelligence (AI).** Personalized roadmap from onboarding answers; AI-tailored lesson copy; custom relapse-letter lines; custom panic plans. Wire these to real answers, degrade gracefully offline.

**Depth.** "Never fail twice" milestones, library search, optional community, home-screen widgets.

---

## 10. Definition of done

- Every screen in §5–§9 that has real content is implemented as **one** polished version; pure templates skipped.
- Strict monochrome throughout; heroes/relapse/finish are black-dominant.
- Onboarding is v3 only, with varied input grammars and all intake questions; the letter is read (from week-XII self); paywall + payment sit mid-funnel.
- Urge intensity is the shared vertical band-list component everywhere; mood uses the circular disc; no slider, no wave-scene intensity, no bubble bursts, no birds.
- All copy is short, factual, non-shame; none of the deleted lines in §4 reappear; no redundant all-caps subtitles.
- New data (journal, entitlement, notification prefs) is persisted and wired end to end.
- No console/runtime errors; reduced-motion and cold launch render finished states.
