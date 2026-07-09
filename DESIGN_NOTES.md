# Design Notes

## Current direction — "Stoic"-style calm journaling (this pass)

Tideline's UI was redesigned to a calm, premium **Stoic-app aesthetic** (referenced
from Mobbin: `stoic.`, 5 Minute Journal, Jour, Calm). The signature moves:

- A cool, quiet **"paper" field** (`#EFEEE8`) with near-white cards — lots of
  negative space, hairline borders, near-flat elevation.
- One high-contrast **ink** hero surface (near-black `#1B1A17`) used for the most
  important card on a screen (today's lesson, the urge "wave" timer, the onboarding
  welcome, the lesson practice prompt, the optional dashboard stat). Light text on
  ink; a white pill button — the classic Stoic "white pill on black".
- **Fraunces** (old-style editorial serif) for all headlines; system sans for body.
- A **week ribbon** (M–S circular nodes, today ringed) on Today.
- A minimal **bottom tab bar** with quiet, geometric per-route line icons.

> Note: previous notes in this file described a dark slate-navy theme and then a
> warm-parchment theme. Both are superseded by the Stoic paper+ink system below.

## The surface system (how light-on-ink "just works")

`src/components/ui/surface.tsx` exposes a React context with two values: `'paper'`
(default light field) and `'ink'` (the near-black hero). `Card tone="ink"` wraps its
children in `<InkSurface>`, and `AppText` / `Button` / `Pill` / `WeekStrip` read the
context and flip their colours automatically. Screens never pass text colours for
the hero cards — they just drop content inside `<Card tone="ink">`.

This is the "surface-aware `AppText`" that earlier notes listed as a future step.

## Token inventory (`src/lib/theme.ts`)

| Token | Value | Role |
|---|---|---|
| `bg` | `#EFEEE8` | cool paper field (global background) |
| `surface` / `surfaceAlt` | `#FBFAF6` / `#E6E4DB` | near-white card / inset chip |
| `ink` / `inkAlt` | `#1B1A17` / `#262420` | hero surface + elevated element on it |
| `inkText` / `inkTextMuted` / `inkTextSoft` | `#F3F0E7` / 66% / 40% | text on ink |
| `text` / `textMuted` / `textSoft` / `textSofter` | `#201E19` / `#605B51` / `#928B7D` / `#BDB5A5` | text on paper |
| `border` / `borderStrong` | `#E2DED2` / `#CEC8B9` | warm hairlines |
| `accent` / `accentText` | `#1B1A17` / `#F3F0E7` | crisp near-black pills/buttons |
| `event.lapse` | `#9C8463` (warm clay) | **invariant #2** — deliberately not red |
| serif | **Fraunces** (400/500/600/700 + 400 italic) | headlines, quotes |
| `radius.lg` / `radius.xl` | 22 / 28 | generous card rounding (xl for ink) |

## Bugs fixed this pass

1. **Fraunces was never loaded.** `theme.ts` referenced `Fraunces_*` families but
   nothing called `useFonts`, so every "serif" headline silently fell back to the
   system font. Now loaded via `@expo-google-fonts/fraunces` + `useFonts` in
   `app/_layout.tsx`, with the native splash held until the serif is ready
   (`expo-splash-screen`). Web renders immediately (the static export prerenders in
   Node, so gating there would produce blank pages) and lets `@font-face` swap in.
2. **Status bar + splash were dark-theme leftovers.** Root `StatusBar` was
   `style="light"` (invisible glyphs on the light field) → now `"dark"`. Splash
   `backgroundColor` was `#222E36` (old navy) → now `#EFEEE8` (paper).

## Verification

- `npx tsc --noEmit` — clean.
- `npx expo export -p web` — all **32 routes** prerendered (no runtime errors in the
  new font loading / surface context / ink `Card` / `WeekStrip`).
- Rendered HTML proves the tokens flow through: `welcome.html` carries the ink bg
  `rgb(27,26,23)`, light-on-ink text `rgb(243,240,231)`, the 42px hero serif, and
  `Fraunces_600SemiBold` as the applied font-family; the paper field
  `rgb(239,238,232)` is present on every page.

Not done here: a pixel diff on a booted simulator (needs a native dev build —
`npx expo run:ios` — because of Clerk/secure-store native modules). Data-gated
screens (today/dashboard) render their loaders during static prerender, so an
on-device pass is the recommended way to see the ink hero cards with live data.

## Pass 2 — data-viz + Quittr-style onboarding

Two follow-up asks: make the app "more polished, with real visualizations and
proper spacing" (like the actual Stoic app), and rebuild onboarding to copy
**Quittr**. Both referenced from Mobbin.

**New dependencies:** `react-native-svg` + `expo-linear-gradient` (both Expo-managed,
web-compatible — verified in the static export).

**Chart primitives** (`src/components/ui/`): `LineChart` (smooth Catmull-Rom curve
with area gradient + null-gap handling — mood + the onboarding projection), `Ring`
(SVG progress arc with optional gradient — onboarding "analyzing" + the dashboard
lessons ring), `BarChart` (sleep, surface-aware), `Heatmap` (GitHub-style check-in
consistency grid), `WeekStrip` (Mon–Sun nodes). All read the surface context so
they work on paper and on ink/night.

**Dashboard** ("You") was rebuilt into a real insights screen: a black summary hero
(progress ring + stat row), a smooth mood line chart with a headline summary, a
sleep bar chart, weekly behaviour meters, a check-in heatmap, and the optional
days-since ink card. Consistent `xxl` section rhythm throughout.

**Onboarding** is now a dark "night" starfield flow (`src/components/onboarding/`:
`OnbBackground`, `OnbScaffold`, `OnbOption`) wrapped in `<InkSurface>` so text +
buttons render light automatically. Eight steps: welcome → reasons → pattern → why
→ analyzing (animated ring) → plan (projection chart + personalised reasons) →
values → done. Quittr's visual structure (progress bar, numbered/checkbox option
cards, gradient selection, analysis reveal) with Tideline's anti-shame copy and the
unchanged data model (persists `whyStatement` + `values`; quiz answers cached in
AsyncStorage for the plan reveal). New `night.*` tokens in `theme.ts`.

**Verified live** (mock-mode web, phone viewport, driven through sign-up → the full
onboarding → app): every screen renders as designed — the serif loads, the ink hero
cards, the gradient option cards + selection state, the animated ring, the smooth
projection + mood line charts, the heatmap, and the new tab-bar icons. Status bar
goes light on the dark onboarding and dark on the light app.

## Pass 3 — art layer + type refinement

Follow-up: "more visualizations/drawings/images" + "fix the font sizes".

**Art layer** (SVG, themeable, surface-aware): `Wave` — the Tideline tide motif
(stacked sine "tide lines"), used as a `Card art={...}` decoration behind the ink
hero cards on Today, Dashboard, and Urge ("an urge is a wave"); `Icon` — a ~15-glyph
line-icon set (moon, mood, pulse, people, calendar, sun, wave, anchor, …) used on
dashboard section labels + behaviour meters + the week-strip label; `Illustration` —
spot line-art (`horizon`, `breathe`, `path`, `tide`) used on the onboarding welcome
(sun-over-tide) and empty states. `Card` gained an `art` prop that renders a
full-bleed layer clipped to the card's rounded corners.

**Type scale** tightened to a cleaner modular scale (display 34→30, title 26→24,
subtitle 21→20, hero 42→38) with refined per-variant line-heights and letter-spacing
in `AppText` — less shouty headlines, better-fitting hero cards.

## Pass 4 — designed components + lesson identity

Feedback: cards/buttons looked "AI-generated / not polished" and lessons "too
basic". The fix was *designed components*, not more decoration:

- **`ActionTile`** — a tappable tile (icon in a tinted disc over a label). Replaced
  the flat full-width ghost buttons on Today ("Add to log / Check-in / Life Map").
- **`CategoryBadge` + `LESSON_VISUAL`** — every lesson category now has an identity
  (icon + tint; `colors.category.*` in `theme.ts`). Applied to the Today lesson card
  (badge + clean "Week · Category · min" meta + position count), every **Weeks** row
  + section header, and a tinted **category hero band** atop the lesson player.
- **Today** urge prompt is now a tappable card (wave icon disc + chevron, tide
  motif) instead of an outlined button; the "why" card is a real **pull-quote**
  (large decorative quotation mark + serif-italic statement + edit affordance).
- Two more icons (`edit`, `plus`).

## Pass 5 — lessons as a full-screen picture-book story (Fabulous-style)

Lessons were rebuilt from a scrollable markdown doc into a full-screen, vertically
**paged story** (referenced from Mobbin: bless. / Numo "story lesson", the
Fabulous-style journey). `src/app/lesson/[slug].tsx` is now two phases:

- **Story** (dark/ink, immersive): a `pagingEnabled` vertical `ScrollView` of
  full-height pages — a cover (category badge + serif title + illustration) then
  one page per markdown section (heading → eyebrow, first paragraph → big serif
  lead, the rest → body), each with a spot illustration. Story-style segmented
  progress + close at the top; a "Scroll ↓" hint that becomes **"Begin the
  practice"** on the last page. Light status bar.
- **Task** (light/paper): a "Your practice" page — category band, the reflection
  prompt as the goal headline, the reflection inputs + the fits-me scale, and
  "Complete lesson". This is the end-of-lesson task/goal.

Supporting work: `parseMarkdown` / `renderInline` / `MdBlock` are now exported from
`MarkdownView` and reused to split a lesson into pages; `Illustration` gained six
abstract line-art scenes (`orbit`, `balance`, `growth`, `mountain`, `spark`,
`steps`) so consecutive pages feel distinct, tinted by the lesson category.

Note: the discriminated-union narrowing for `MdBlock` uses `'text' in block`
(this TS toolchain won't narrow on negation of a union-literal discriminant).

## Pass 6 — Stoic **dark mode** (black + gradient cards)

The whole app flipped from the light "paper" theme to Stoic's dark mode (referenced
1:1 from Mobbin's Stoic dark screens):

- **Palette** (`theme.ts`): `bg` near-black `#08080A`, white text family, faint white
  hairlines, **`accent` = white** (so primary buttons + selected chips are white
  pills with dark text). Status/category/chart tints brightened for dark. Added a
  `gradient` token group.
- **Cards** now paint a subtle charcoal **LinearGradient** (`Card`): `paper` tone =
  `gradient.card`, `ink` hero = a brighter `gradient.hero`. `ActionTile` gets
  `gradient.surface`. Depth comes from the gradient + hairline, not shadow.
- **Filled logos/viz**: `CategoryBadge` is now a filled gradient disc with a white
  glyph; charts keep their area fills; tab icons fill when active.
- Fixes for dark: `SegmentedControl` track/selected lightness inverted; root +
  lesson-task `StatusBar` → light; splash `backgroundColor` → black.

Onboarding keeps its indigo "night" starfield (the Quittr flow is a deliberately
separate dark world); could be unified to pure black if desired.

## Pass 7 — match the Stoic home 1:1 + solid silhouettes

- **Onboarding → pure black**: `night.top/mid/bottom` are now near-black (white
  starfield on black) instead of indigo.
- **Solid-silhouette illustrations**: `Illustration` was rewritten from line-art to
  **filled white shapes** (Stoic "explore" style) — added `figure` (meditation),
  `bird`, `book`, and made the existing names filled. Used on the onboarding
  welcome (figure) and rotated through the lesson story.
- **Today home = Stoic home**: a leaf "streak" chip (this-week check-in count) +
  avatar in the top row, a lowercase time-based **bold-sans greeting** ("good
  morning/afternoon/evening."), and the weekday strip moved out of its card to sit
  bare on black.
- **`WeekStrip`** redesigned to Stoic's exact pattern: Sun–Sat letters with white
  **checkmarks** for completed days and **today in a rounded box**.
- **`TabIcon`** → filled silhouettes (solid disc / bars / ring / card / person).

## Pass 8 — auto-playing lesson reader (line-by-line crossfade)

The lesson story view (`lesson/[slug].tsx`) was reworked from the Pass-5 swipe-paged
ScrollView into an **auto-playing reader** that reveals one line at a time and
crossfades between pages on its own — no scrolling.

- **Beats**: each page is decomposed into ordered "beats" (`pageBeats`) — cover →
  category line / hero title / minutes; a section → tinted eyebrow, serif lead, then
  each body sentence (`splitSentences`) and list item as its own muted line. Each
  beat mounts behind a `FadeIn` (Animated opacity 0→1).
- **Auto-advance**: a per-page effect reveals beats on a timer (~0.95s apart), then
  after a short hold crossfades to the next page (`pageOpacity` fade-out → `setPage`
  → fade-in). Tap to skip the reveal / advance; the last page swaps the "Tap to
  continue" hint for the **Begin the practice** button.
- **Correctness**: animated values use lazy `useState(() => new Animated.Value())`
  (not `useRef(new …).current`, which re-allocates each render); pending timers live
  in a ref so skip/advance can cancel them (no backwards-flash). The full-bleed tap
  target is a **sibling** of the top/bottom chrome (progress + close, begin button),
  never their parent, so web never nests a `<button>` inside a `<button>`.

## Pass 9 — the VICI paper system (imported from the claude.ai/design canvas)

The whole app migrated from the Stoic dark theme to the design canvas's **VICI
paper system** (project "tideline", `index.html` — the source of truth):

- **Tokens** (`theme.ts`): warm parchment field `#F4F3F0`, flat solid-white
  cards (no borders, shadows, or gradients — `shadow.*` are now no-ops), the
  ink text family (`#1D1C1A / #55534E / #8B8882 / #B4B1AB`), and ONE dark
  surface `#131313` (`colors.ink`) for hero cards, the urge circle, and
  primary pills. **Strictly monochrome** — `accent` IS the ink; category /
  event / chart tints all resolve to the neutral ink scale (lapse keeps its
  warm-clay invariant `#9C8463`; `danger #B5624F` for destructive only).
  `colors.moodTones` is the app-wide 5-step gray mood ramp.
- **Type**: EB Garamond (display identity — `AppText` hero/display/title/
  subtitle are serif now, weight 500, positive tracking, never bold),
  Newsreader (editorial quotes — the home maxim), Gill Sans body on iOS /
  Hanken Grotesk static weights on Android / a CSS stack on web. Use the
  `sans(weight)` helper for correct {family, weight} pairs per platform.
  Fonts load in `_layout.tsx` with a native-only splash gate.
- **Nav** (`StoicTabBar`): the canvas bar exactly — flat parchment, thin
  stroke icons, Today · Journey · **raised 52px ink circle with the wave
  glyph (→ /urge)** · Log · You.
- **Today** rebuilt to the board: streak pill · DAY <roman> rule · avatar,
  the big Newsreader “ maxim, the dark NEXT LESSON card (night-mountain art,
  white circular go button), the hairline-divided TODAY'S STEPS checklist
  (real data: lesson / check-in / log), YOUR WEEK MOODS (tone circles, today
  ringed → /checkin), wave-divider footer + valley-river photo. Assets
  imported from the design project into `assets/images/`.
- **Log tab** = the canvas chooser front door (check-in / an urge / a moment /
  journal), first option dark; the event composer survives as "A moment";
  history behind the footer link. **New `/urge-log`** flow: intensity (ink
  wave grows with the pull + band slider) → trigger grid → outcome
  (slip = danger ring, routes to `urge_acted_on`) → when chips → quiet
  summary confirmation.
- **Urge surfing** re-grounded on paper: night sky → parchment + sparse ink
  dots, tide-mark art replaces the white PNG, serif headlines, ink pill; the
  breathing wave redrawn in ink washes with a paper-white guide dot. Severity
  = darker ink, never redder.
- **Journey tab** = the canvas itinerary: scrolling grounds each led by their
  (still-dark, by design) landscape art, roman numerals, ink progress rules,
  rotated CROSSED stamps, ghosted+locked future grounds, dotted legs; side
  worlds as quiet rows. The old full-screen dark map
  (`journey/JourneyScreens.tsx`) is now unused.
- **Everything else** (dashboard, journal, keepsakes/milestones, money,
  notify, account, search, lesson reader, onboarding, mood logger) inherits
  the system through the primitives; onboarding's per-step hues were pinned
  to chroma≈0 and its ACCENT → ink. All status bars → dark-on-paper.

**Verified**: `tsc --noEmit` clean; `expo export -p web` prerenders every
route; the exported HTML carries the paper field, ink text, and
EBGaramond/Newsreader families.

## Pass 10 — board-for-board parity port

Follow-up: "make sure all pages are identical." Each screen was rebuilt to match
its specific claude.ai/design board, not just inherit the tokens. New shared
modules: **`components/scene/SceneKit.tsx`** (a react-native-svg port of the
canvas faceted-planar scene kit — the `SC` paper-grey palette + SSun, SGull,
SBoat, SMoonF, SBuoy, SPine, SCairn, SeaStack, banded water) and
**`components/keepsakes/Medallion.tsx`** (the postmark-ring medallion + 15
faceted keepsake scenes).

Ported board-for-board:
- **Insights / You** (`dashboard.tsx` ← screens-analytics): the 14-day mood
  drawn as a layered sea (the tide chart), a sealed dark verdict, monument
  numerals, a dot-per-urge trigger list, a when-they-hit histogram, and quiet
  correlation readings — all off real check-in / event data.
- **Journey** (`weeks.tsx` ← screens-worlds): the itinerary of grounds, each
  led by its landscape, with CROSSED stamps, ink progress rules, ghosted+locked
  future grounds, dotted legs.
- **Log** (`log.tsx` ← screens-log-hub): the chooser front door + `/urge-log`
  (intensity → triggers → outcome → when → summary).
- **Keepsakes** (`milestones.tsx` ← screens-keepsakes): the medallion album —
  newest hero (dark), earned grid, within-reach rows with progress arcs,
  still-ahead blanks, and a detail modal with the tier ladder. Real counts
  (rode-out, check-ins, days, journal, lessons) drive earned/progress.
- **Money** (`paywall` summit-scene header + two dark-selectable plan rows;
  `locked` mist-path vignette; `subscription` unboxed membership monument).
- **Journal** (serif entry titles + quote-mark empty state), **notify primer**
  (real lock-screen banners), **app-lock** (dark Face-ID disc), **search**,
  **auth** (already the provider-button kit).
- **Onboarding v3** (`(onboarding)/welcome.tsx` + `components/onboarding/v3.tsx`
  ← screens-onb3 / -map / -tool): the full campaign funnel replaces the v2
  flow. Opens on **night water** with light gathering low, breaking to paper
  exactly at the reading; one growing ink rule for progress; Roman numerals.
  Threshold → privacy oath → the door → name → 8-question assessment with
  steady reflections → the streak-vs-campaign interstitial → reading pause →
  **the reading** (engraved sea-to-summit route map) → **the wave, ridden**
  (live UrgeWave surf → deepening → the First Wave medallion) → pledge (sign
  the vow) → letter to week XII → Day I → pre-screened notifications → save →
  Plus. Persists name → profile, the letter → life-map "why" + a journal
  entry, the prize → values, then marks onboarding complete.

**Verified**: `tsc --noEmit` clean; `expo export -p web` prerenders all 45
routes; exported HTML carries the paper field + EB Garamond / Newsreader.

## Still TODO (visual)
- Canvas micro-motion not yet ported: the day-3 **letter** wax-seal → unfold,
  the keepsake **etch/letterpress** reward animations, and the **ink-bleed**
  chip fill (chips select instantly instead). Structure/copy/layout all match;
  only the animation choreography is simplified.
- The **interactive-lesson** layer (tip → collect → quiz → pick, screens-lesson)
  is a new feature with no route yet; the current reader is the paper-serif
  story reader.
- Insights: the canvas "weekly report · this week vs last" second board.
- Lesson body copy is still placeholder (content pipeline).
