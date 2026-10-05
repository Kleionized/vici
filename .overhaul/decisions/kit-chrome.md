# kit-chrome decisions — Vici Overhaul run, Phase 0 Part D (D380–D389)

Files: `src/components/mono/TabBar.tsx`, `scales.tsx`, `Feedback.tsx`, `lab/tabbar.tsx`, `lab/misc.tsx`;
`src/components/StoicTabBar.tsx`, `src/app/(app)/_layout.tsx`, `src/app/+html.tsx`, `src/lib/format.ts`,
`src/components/ui/Feedback.tsx`, `.overhaul/clock.js`; moved `src/app/score.tsx` → `src/app/(app)/score.tsx`;
new `scripts/overhaul/format-test.mjs`.

## D380 — The tab bar is the canvas's five items, lit by the navigator's focused route
`mono/TabBar.tsx` exports the presentational `TabBar` (`active`, `onTab`, `onSOS`, `variant`, `ground`,
`inline`), the router-wired `AppTabBar`, `TAB_ITEMS`, `TAB_FOR_ROUTE`, `tabForPath()`, `useTabBarHeight()`,
`tabBarHeight()`, `SOS_ROUTE`. Geometry is design-system §7.18 verbatim (row space-between, padding 14 14 0,
72-wide items, 26 glyph, gap 4, 11.5 label 700 ink / 400 `#9B968E`, 60 ink disc at −6 with "SOS" 13/700
`#111111`). Destinations: Today `/(app)/today`; Log `/log-chooser` (D124); SOS pushes `/urge` (CRITIC C12,
never lit); Library `/(app)/library`; Journey `/(app)/milestones`. Lit: Today on `today`; Log on `log`;
Library on `library` (and `/week/*` via `tabForPath` for a standalone bar); Journey on `milestones` **and
`score`** (the three Score Detail frames light it). `StoicTabBar` (the navigator adapter) reads the lit item
from `state.routes[state.index].name`, not the URL: a screen pushed over the tabs (Log chooser, a lesson)
changes the URL while the tab screen stays mounted under it, and a URL rule would drop that screen's bar
during the push and the back-swipe. Routes not in `TAB_FOR_ROUTE` draw no bar (Settings, All, Journal,
Insights, Life map, Weeks, Rough days, Support — the old `NO_BAR` list plus `all`). Each item is
`role="tab"` with `aria-selected` (not `accessibilityState`, which react-native-web 0.21 drops without an
ARIA attribute — the lit tab was invisible to assistive tech on web); RN maps `aria-selected` to the
native selected state.

## D381 — In the navigator the bar is laid out in flow; it paints ground + noise in phase with the window
`height = 70 + max(insets.bottom, 34)` (104 on a 34-inset phone and on the mock web build). In `(app)` the
bar sits under the scene in react-navigation's column (`inline`), so a tab scene ends at the bar's top
(748 at 852) — where every one of the 37 bar frames' content already ends; none anchors anything to the
bottom edge (checked: no depth-1 `bottom:` on any bar frame). The kit contract ("bottom is off the screen
edge") is unchanged for every non-tab screen; a screen outside the navigator that draws the bar
(`/week/*` if it stays a root route) renders `AppTabBar` absolutely over its own `Screen` and pads its
scroller by `useTabBarHeight()`. Overlay mode was built first and rejected: with a full-height scene,
today.tsx's pinned "Urge surfing" bar went under the tab bar (a hidden control) and the old Score footer
lost 104 pt. Per D327 the bar paints `#0D0D0D` + `noise.png`@0.05 over its own band; the tile is offset by
`(windowH − barH) mod 96` so its speckle is in phase with the screen's (0 px over 6/255 on the band). Below
376 wide the four items shrink (CSS's default `flex-shrink:1`, which Yoga lacks) so the SOS disc keeps its
circle. `(app)` scenes get `sceneStyle: {backgroundColor: #0D0D0D}` (the navigator default was the light
theme's grey).

## D382 — Scales: 0-based values, radio semantics, tappable pager dots; a chosen dark disc takes the double ring alone
No frame chooses disc 0 or 1. The frames' selected rule replaces `box-shadow` (gap ring `#0D0D0D` 4 +
ink 6), so a chosen `#34322F`/`#5A5751` disc loses its inset `#45423E` ring — the 4 pt ground gap and ink
ring define its edge. Scales take the app's own 0-based index (the dials and `INTENSITY_BANDS` already
store 0–4). Every scale's row is a `radiogroup` of `radio`s carrying `aria-checked` (logs §3.16: "role
radio, label = band, `checked`"; the kit's choices/rows already do this) — `accessibilityState.selected`
emitted nothing on web and announced "selected", not "checked", on native. Energy's fill meter checks only
the chosen bar; the lit bars under it are drawing. `ScaleReading`'s word is the scale's value, not a
heading: it is an `aria-live="polite"` region (it rendered as an `<h1>` before).

**PagerDots are controls when given `onChange`** (sos-flow §3.17: "dots tappable (`accessibilityLabel`
"Pane N")"; the hub's five dots call `goToPane(i)`). Each dot is then a `Tap` of the same 6×6 box —
`label` defaults to `Pane N`, `aria-selected` on the active one — with `hitSlop` 19 above and below and 3
to each side (44 tall; 12 of the 13 between centres, so neighbours' areas never meet); the row passes
other touches through (`box-none`). Without `onChange` it stays drawing only (`pointerEvents: none`).
Geometry unchanged: the replica's dots measure 6×6 at y 666, x 167.5 + 13n, 0.00 % on the frame.

## D383 — Reassess's previous level: dashed outline as an overlay, shown only when it differs
The frame draws `background:transparent; outline:1.5px dashed #F2F0EC; outline-offset:-1.5px` + an 8 ink
dot (design-system §7.22 missed the outline). Ported as an absolutely-positioned 1.5 dashed border over
the bar (same box as an inset outline) — not the bar's own border, because Chrome snaps border widths in
layout and that moved the dot 0.5 pt. Dash pattern matches the frame at t=8 (0 px). Shown only when
`previous !== value`, as `gen/mono-sos.js scale()` does.

## D384 — `/score` lives under `(app)` (URL unchanged)
`src/app/score.tsx` → `src/app/(app)/score.tsx` (+ its one relative `require` re-pointed), registered as a
`Tabs.Screen` so it draws the bar with Journey lit (D326, today-day §6). `router.push('/score')` (Today,
All) and the `/score` recipes still resolve — checked. Behaviour that comes with being a tab route, for
today-day to know: it is a tab switch now (no slide-in, no iOS back-swipe; the back chevron's
`router.back()` goes to the first tab, Today, per the navigator's default `backBehavior`); the screen stays
mounted between visits (its `useState` page / range / `now` persist); a deep link passes the `(app)`
guards and launch prompts like every tab; and the **old** Score layout's footer card is cut at 748 by the
scene end — the frames' Score Detail ends above 748, so the rebuild resolves it. (The old pages place
their cards at fixed tops, so sizing the pages to the shorter scene would not bring the card back; the old
sheet's 3-dot page indicator, at canvas 806, is cut off with it — paging by swipe still works.)

## D385 — `All` leaves the bar; its door is a long press on Today (mock / dev builds only)
The canvas draws five items and no drawer. `/all` stays registered (D328); in `FORCE_MOCK || __DEV__`
builds a long press on the Today tab pushes it (routes §5.4 proposed the Today avatar — that is today-day's
file; the tab gives the same pixel-free door now, and both can coexist). `SHOW_ALL_TAB` is kept, `false`.

## D386 — Loading and empty states
`LoadingView` = a mono `Screen` (ground + noise) with, after 300 ms, the bundle's own loading mark — Part B's
`Spinner` (Enlisting Aegis's dotted ring + arc) at 44 in `#9B968E` — rather than the platform activity
indicator no frame draws; `onBack`/`onClose` keep the nav row's way out; `bare` (no ground, for a wait
inside a painted screen); `spinner={false}` (ground only — routes §7's choice for Today). A `label` shows at once (as the old
`LoadingView` did) under a 44 box kept from the first frame, so it does not jump when the spinner lands.
The `Screen` keeps its light `StatusBar` (`status` prop, default true): its own ground is dark and so is
every mono screen, and a stack screen that sets nothing would inherit the screen under it. Two old paper
screens still nest it under a light header (milestones' safe-area view, journal's header) — a dark block
with light glyphs over paper until they are rebuilt; the noise there is anchored to the nested box.
`EmptyState` = optional caps (13/700 mute), optional title (22/700/28/−0.6 ink; `h1` → 26/33), body
15/400/24 `#9B968E`, centred, gap 8, 24 gutter, no illustration (the paper `tide` art is gone). Its 32
above and below is not in routes §8: it is the old `EmptyState`'s `paddingVertical: spacing.xxl` (32),
kept so callers' lists keep their spacing; `style` overrides it. `ui/Feedback.tsx` now re-exports
both, so every existing caller (17 sites) gets the new look with unchanged props. Copy stays the callers'.

## D387 — Web root document (`src/app/+html.tsx`)
Expo's default static document (viewport, `ScrollViewStyleReset`, `headNodes`/`bodyNodes`) plus
`html,body{background-color:#0D0D0D;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}`
and `theme-color #0D0D0D`. Deliberately **not** `color-scheme: dark` — it changes the browser's default
text/caret/control colours under RN-web's styles. Verified served on :8096; V3-Q1 still diffs 0.00 %.

## D388 — `src/lib/format.ts` rules
Number words: hyphenated compounds, British "and" in hundreds ("one hundred and five", "one thousand and
one" — the app's copy is British), `capital: true` for sentence-initial; `minutesWords` ("One minute",
"Twenty-two minutes"); `groupDigits` ("1,240"); `countOf` ("0 slips"); `roman` (≤ 0 prints digits). Day
parts (logs Q5 = slip Q3): the **moment's own hour** decides — same calendar day → `Today` / `Tonight`
from 18:00; previous day → `Yesterday` / `Last night` from 18:00; older or future → no word.
`dayPartDate` → `Tonight, Tue Jul 22` / `Sun Jul 20`; `dayPartTime` → `Tonight, 11:40 PM` /
`Jul 20, 9:05 PM` (`lower` for the Log/hub's `pm`; `withTime:false` → Lapse Done's `Last night`).
`joinLower` → `Late night, boredom` (keeps `I …` and initialisms like `TV`); `splitStored` reads the
`' · '` storage join. Dates are assembled by hand in en-US (`Sep`, never `Sept`; no Intl dependence);
`dayMonthYear` keeps Edit Profile's `14 Mar 2026`; `dateRange` → `Jul 14–20` / `Jun 30–Jul 6`. 89 checks:
`node scripts/overhaul/format-test.mjs`.

## D389 — `.overhaul/clock.js` (CRITIC G3)
An init script that replaces `Date` (constructor, `Date()`, `Date.now`; `instanceof Date` intact via
`Reflect.construct`) with one pinned to a moment from `window.__CLOCK` (set by a line concatenated above
it), else `?now=` on the route, else `sessionStorage['vici.clock']` (so a seed's reload keeps it).
Local date-time strings (`2025-07-22T23:40`) or epoch ms. While installed, the shared prototype's
`constructor` is the replacement and its `name`/`length` are `Date`/7, so `new Date().constructor === Date`
holds (it did not before). Frozen by default; `__CLOCK_TICK = true` /
`?clock=tick` runs it from the moment. `performance.now()`/rAF untouched. Verified: `/kit-lab?…&now=
2025-07-22T23:40` reads `Tue Jul 22 2025 23:40:00`; the concatenated `__CLOCK` + tick form advances 500 ms
in 500 ms.

## Evidence (kit lab, `/kit-lab?f=<stem>`, pxdiff t=24 unless noted)
| replica | whole frame | outside named regions | residual (not this part) |
| --- | --- | --- | --- |
| Today-Home (bar only) | 7.55 % | 0.00 % on 748–852 (also at t=6) | rest of the frame not built (today-day) |
| Log-Urges (bar only) | 4.56 % | 0.00 % on 748–852 | rest not built (logs) |
| Medallions, Week-I-Reset (bar only, extra) | — | 0.00 % on 748–852 (t=6) | rest not built |
| SOS-Strength | 0.67 % | 0.00 % | hero `thermometer` T458 ×0.731 (Part C) |
| SOS-Reassess | 1.41 % | 0.00 % (also t=8) | hero T506 ×1.062 (Part C) |
| Morning-Feeling | 5.87 % | 0.00 % | hero `sunrise` T506 (Part C) |
| Morning-Energy | 2.89 % | 0.00 % | hero `battery` T506 (Part C) |
| Urge-Hub-Score | 0.00 % (mean Δ 0.00) | — | the card's dot grid is now three rows of ten `flex: 1` dots, which lands where CSS's `repeat(10, 1fr)` does (flex-wrap at a computed width left 804 px of edge AA and wrapped nine-across at 375). Dots are the tappable form (`onChange`); tapping Pane 4 moves the white dot. |
Live app, bar band 748–852 vs the frame: `/today` 0.00 %, `/log` 0.00 %, `/milestones` 0.00 %, `/score`
0.00 % (the recipes' own seeds); `/library` 0.00 % vs Week I Reset with `logs-seed.js` — there is no
`/library` recipe, and `weeks-seed.js` opens the launch check-in prompt over it. Drive: Journey→`/milestones`, Library→`/library`,
Today→`/today`, Log→`/log-chooser`, SOS→`/urge`, long-press Today→`/all`. 375×667 and 430×932: bar, scales and
readings neither clip nor overlap.
