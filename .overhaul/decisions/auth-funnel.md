# auth-funnel decisions — Vici Overhaul run, Phase 1 (D200–D209)

Files: `src/app/(auth)/{_layout,sign-in,sign-up,splash,welcome-back}.tsx` (`_layout` unchanged),
`src/app/(onboarding)/_layout.tsx`, `src/app/index.tsx`, `src/components/auth/kit.tsx`,
`src/components/onboarding/funnel.tsx`, `src/content/onboardingFunnel.ts` (GENERATED) +
`scripts/overhaul/gen-funnel.mjs` (new fork),
`src/components/ui/Waterline.tsx`, unframed `src/app/(app)/lifemap.tsx`. Recipes:
`.overhaul/recipes/auth-funnel.json` (replaces `auth.json` and `funnel.json`, deleted). Scratch tools:
`.overhaul/af-sweep.mjs` (size sweep + contact sheet), `.overhaul/af-func.mjs` (drives every control).

## D200 — The questionnaire's data is regenerated from the overhaul frames
`node scripts/overhaul/gen-funnel.mjs` (fork of `scripts/vicifull/gen-funnel.mjs`) reads
`.overhaul/scenes/Email-Login.json` and writes, per step, only what a frame states for itself: `kind`
(`text` | `wheel` | `list` | `chips` | `statement`), the nav's inked `dashes` (`null` on Start — the frame
draws no dash row), the `stack` (top 136 / 140 / 451, gap 14 / 18 / 20, centred), `title`, `sub`,
`spacer`, the statement `body`, Goal confirmation's `card` as runs (`{text, bold}`, the trimmed scene's
space restored before the bold span), `placeholder`, the `wheel`'s drawn values, `options`,
`drawnSelected` (recipes/checks only, never read at runtime), the `hero` (`data-hero` id checked against
`heroes.ts`, top, scale), and the primary's label (`null` on the single-select screens). The run throws
on any stack child or option row it cannot read, on a missing title/options, and on a non-Start frame
with no dash row. The answer ids are unchanged (every later screen reads them). Copy is unchanged from
the previous drop's generated file (auth-funnel §1) — verified by the frames' text in the new file.
`backTop` stays on the type as a deprecated `60` because `welcome.tsx` (tail's) still reads it.
`FUNNEL_GLYPHS` (and its `FunnelGlyph`/`FunnelSvgKid` types) has no source in this drop; it was carried
as a frozen legacy block while `plan.tsx` imported it, and dropped once the tail group decoupled
`planSignals()` from it (grepped: no consumer left in `src/` or `scripts/overhaul/`).

## D201 — `O3Shell` is a pass-through; each funnel screen draws its own frame
The overhaul frames are two templates (question; statement = the kit's `HeroBoard`, 26/33 title, stack
451). `O3FunnelStep` and `O3AgeGate` render the whole frame (`Screen`, nav, content, primary) and read
`onBack` from the shell through context, so the dash count comes from the step's own data with no
publish-after-mount flash. `O3Shell` keeps every prop `welcome.tsx` passes (`progress`, `bar`, `lit`,
`paper`, `segments`, `backTop`) and ignores all but `onBack`; any other child (the tail's `reading`
step, which D324 removes) gets the ground, a back chevron and the previous shell's padded box. The shell
no longer imports `onboarding/art.tsx` (tail's), so tail can delete `CampaignMapField` & co. without
breaking this file. The previous engine's night field, sun, bloom, rule, "‹ Back" label, `O3H`/`O3Sub`/
`O3CTA`/`O3Chip`/…, the glyph grid, check rows, row marks, header drawings and First Principle's wave and
dots are deleted (nothing outside `funnel.tsx` imported them — grepped).

## D202 — The age wheel (bespoke; no kit primitive draws it)
Five rows at rest exactly as drawn (30/700 `#2E2E2E` lh 56 · 34/700 `#5A574F` lh 60 · rule 200×1.5 ink ·
72/700 ls −2 ink lh 100 · rule · 34 · 30), so the non-uniform pitch is reproduced; nothing animates.
The value steps under the finger — one year per 40 pt of vertical drag (RNGH `Pan`, `runOnJS`,
claims at ±4 pt, yields at ±10 pt sideways, as the kit `TimeWheel` does) — and a visible neighbour is a
button that steps to it (the click a mouse drag ends in is ignored for 250 ms). Range 13–99 (D331);
rows past either end are blank. `accessibilityRole="adjustable"`, label "Age", `aria-valuetext`,
increment/decrement. An untouched wheel answers: arriving on Age with no stored value stores "24", so
`welcome.tsx`'s gate and age-80 projection read the age shown.

## D203 — Name takes focus on arrival
The frame draws the focused, empty state (the 2×24 bar before the `#9B968E` placeholder — CRITIC C9;
the kit `TextField name` shows the bar only while focused). `autoFocus`; and because the keyboard then
covers the bottom primary on a device, the return key ("next") does what Continue does. Empty names are
still allowed (unchanged).

## D204 — Selection behaviour
Single-select screens (now including Gender, D324) show the ink fill and turn over 260 ms later (the
engine's own timer, unchanged). Multi-select screens use the kit `Chips` (`toggleChoice` = the old
`pick`, D350): "Nothing in particular" / "Nothing obvious" / "Nothing yet" exclusive, What it affects
capped at 3 (a fourth pick refused); the primary is the D321 disabled pill while nothing is chosen,
except What it affects after "Not really" (zero allowed, unchanged). Goal confirmation keeps its four
title/line readings; the card is drawn only for "Keep it, just without porn" (its runs come from the
frame).

## D205 — Small screens (D320) and native line breaks (D332)
Question screens: the stack lives in a `ScrollRegion` from the nav's bottom (100) to the primary's top
(106 off the edge; 0 with no primary), with the frame's stack top as its top padding — identical at 852
(0.00 %), scrolling at 375×667 where Q5 / Q17's chips would run under the pill. Heroes pass `controls`
(106 / 0) and drop out on a short phone (rule 1). Statement screens are `HeroBoard`s (rule 2 lift).
Age's wheel stays absolute — it ends at canvas 571, above the 667 phone's primary top (595). The
auth doors keep the frame's 852 of height and scroll: at 667 all four controls are on the first screen
and the footer and caption sit under them, never across them; at 932 they stay on the bottom edge as
drawn. Native has no `text-wrap: balance/pretty`: the twelve fixed question titles and Login's paragraph
whose greedy wrap at 393 differs from the canvas carry the canvas's `\n` (auth-funnel §3.8) — only at
≥ 393 wide and only when the copy is the frame's own (not Start's name, not Goal confirmation's
variants); web balances them itself.

## D206 — The doors and the splash
`AuthBoard` is the door's stack: laurel 104 at 150 (centred), title/paragraph at 284 (gap 12), controls
at 436 (gap 14: Apple ink pill with the 16×19 glyph, Google card pill with the 19 G, the "or" rule, the
email pill), the footer bottom 108 and the caption bottom 64. The footer's whole row is the control (the
frame puts the pointer on the bold run; six letters are not a finger target). A back chevron is drawn
only when the door was pushed (`router.canGoBack()` — from Name's Back or All), at the nav row's 60. An
SSO refusal (D330: 14/700 ink, lh 20) is centred in the frame's empty gap 672–726. Splash: the laurel at
`left: 50%, marginLeft: −60.5` (the frame's 136 is half a point left of the axis — measured: centring it
put it at 136.5 and cost 0.46 %), its top at 330/852 of the window, the wordmark 148 under it.

## D207 — The boards behind the doors (no frame)
Copy and behaviour unchanged. Address step: the door's laurel and a centred 26/33 title over Name's
field (`TextField name`, email keyboard, autofocus, a mute ✕ accessory while it holds text) and the
primary in flow under it, so the keyboard that opens with the board never covers it. Password, verify
and the sign-up form: Name's template (`AuthSurface` — nav chevron, left 26/33 title at 136, 15/22 mute
labels 8 above 60/18 fields, primary in flow, "Resend code" as an in-flow ghost link). Sign-up's gate:
the door's stack with its three pills (Apple/Google with their glyphs, email plain; no "or" — the gate
never had one) and the legal line as the caption (inset 24). The updates checkbox is the kit's 26
`CheckDisc` (done when on, pending when off), `role=checkbox` + `aria-checked`; the info card is Goal
confirmation's card (r18 `#1E1E1E`, padding 18/22, 15/23 sub) with its toggle as a 700 ink run. Legal:
12/700 ls 0.4 mute, underlines kept. The verify boards are unreachable on the mock build (mock auth never
asks for verification); they are the password board's pieces.

## D208 — The slow-boot board
`WaterlineScene` (unframed, unreachable in mock — D131) is the splash with the kit `Spinner` at 44 in
`#9B968E` (as `LoadingView` draws it, D386) and its label in the ghost line's 15/400 mute, bottom 96.

## D209 — Recipes and the walks other groups use
`.overhaul/recipes/auth-funnel.json` holds all 25 frames; every single-select AFTER neutralises the 260 ms
turn-over, and the AFTERs now tap the frames' drawn selections (Q3 "Yes, several times", Q3b "A few
days", Q5 four chips, Q6 + Tired, Q7 In bed only, Q21 "Quite a bit", What it affects Focus/Sleep/
Confidence, Q13 "A few days a week", Q16 "Keep it, just without porn", Q17 two chips).
`.overhaul/drives/funnel-walk.js` changed two rows: Age is `t('Continue')` (no input any more — the wheel
opens on 24), Gender is `t('Male')` alone (no Continue — it turns over). **The other groups' walks through
the funnel (`f-plan-walk.js`, `handover-walk.js`, `tail-walk.js`, `v-plan-walk.js`) need the same two
rows** — reported to the orchestrator; not edited here.

## Phase 2 amendments (no new numbers — the range D200–D209 is full)

* **D206 — the door's message keeps its distance and is seen.** The refusal a door says back (no frame draws
  one) sat centred in the 54 the frame leaves between the email pill (672) and the footer (726): the mock's
  two-line SSO refusal (and most of Clerk's) filled 40 of it, 7 from the pill and 7 from the footer, and a
  three-line one would have run across both. `AuthBoard` now measures the line and keeps 12 (the stack's gap)
  clear above and below it, growing the board by whatever the message needs past the gap — the footer and
  caption move down with the bottom edge, never under the text (a two-line refusal at 852: footer 736, caption
  bottom 54, nothing scrolls out of view). On a 667 phone that gap is below the fold, so the line answering a
  tap on Apple or Google landed off-screen; the board now scrolls it into view when it appears (React 19's
  `ref` prop through `ScrollRegion`'s spread). `AuthMessage` balances on web (`text-wrap: balance`, as the
  frames' centred copy does), so "…Use email / for now." no longer strands two words. The undisturbed doors are
  unchanged (Login, Welcome Back 0.00 %).
* **D205 — what stays as it is.** At 375 × 667 the doors' footer link ("Already have an account? Sign in" /
  "New here? Create an account") is below the fold, one short scroll away: lifting the board by the laurel's
  room (art top ≥ 108, rule 2) brings it 42 up and leaves it 1 pt short, and the remaining options — dropping
  the laurel, tightening the frame's gaps — are not in D320's list. The four controls are on the first screen.
  On 430 × 932 the question boards' spot illustrations keep the frame's top (T 506 / 582), so the 80 the taller
  phone adds falls between the art and the primary; every other group's question and check-in boards do the
  same (kit `Hero`), so it is reported to the orchestrator rather than changed here.
* **Carry-over.** `FUNNEL_GLYPHS` was already gone (D200; `gen-funnel.mjs` re-run as a dry run: byte-identical
  output, no consumer in `src/` or `scripts/overhaul/`). `.overhaul/settings-seed.js` stored `lifeMap.values`
  as bare strings; it — and the two seeds that copy its dataset, `settings-profile-seed.js` and
  `r-set-seed-pinned.js` — now store `{label, importance}[]` (Presence 5, Health 4, Honesty 3: Life Map's own
  save order), the shape `convex/schema.ts`, `src/lib/types.ts`, the funnel's `finish()` and Life Map's save
  write. The readers of `lifeMap.values`: `src/app/(app)/lifemap.tsx` (reads both shapes — kept, for rows a
  pre-schema mock store may hold) and nothing else (`letter.tsx` reads only `whyStatement`; Convex's
  `lifemap:update` writes, `lifemap:get` returns the row).
* **Back paths (D340).** Life Map ← All goes back to All (it is a hidden tab; history back). Name's Back
  replaces into the door when nothing is behind `/welcome` — the sign-up path ends in a replace — so the door
  draws no chevron there (it would be a dead control); `.overhaul/af-func.mjs` expected one and now checks the
  opposite.
