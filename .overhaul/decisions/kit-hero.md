# Kit-hero decisions — Phase 0 Part C (D370–D379)

Merged into DECISIONS.md by the orchestrator. Files: `scripts/overhaul/gen-heroes.mjs` (new),
`src/content/heroes.ts` (GENERATED), `src/components/mono/Hero.tsx`, `LaurelMark.tsx`, `MedalTier.tsx`,
`lab/hero.tsx`; `scripts/overhaul/body.mjs` (`SVG_ATTRS`).

## D370 — The hero registry is generated from the 53 cards and checked against every hero the bundle draws
`node scripts/overhaul/gen-heroes.mjs` reads the **first** 393×240 svg of each
`Lesson-Illustrations-v4` card (the second is the `Before` thumbnail) and writes `src/content/heroes.ts`:
`HERO_IDS`/`HeroId` (the cards' own `data-hero` ids, canvas order), `HERO_ALIASES` + `heroId()`
(`windowNight → nightMoon`, D338), `HERO_LABEL`, `HERO_SCALE` (1.1; `medal` 1), `HERO_BOUNDS`, `HERO_BOX`,
`HEROES` (node trees). Attribute **values are the canvas's strings verbatim**; names are
react-native-svg's (`stroke-width` → `strokeWidth` …); an attribute with no mapping stops the run.
The run fails unless:
- each card's parsed tree serialises back to the card's markup byte for byte (nothing dropped);
- `paint-order="stroke"` is on exactly 22 shapes in 17 cards — each is emitted twice (as written, then
  the same shape with `stroke: 'none'`, whose fill covers the stroke's inner half exactly as the
  browser's stroke-under-fill order does; react-native-svg ignores the property). Opaque fills only —
  asserted, because a translucent fill would be painted twice;
- every `<svg data-hero>` on the 254 Email-Login frames (151: 150 by their own id, `Checkin-Emotions`
  via the alias) and in the 1,273 lesson frames (284) is byte-identical to its card; all 53 cards used;
- `HERO_BOX` reproduces the hero box height and svg top of all 286 lesson hero boxes (284 + the two
  Lesson Scroll frames on Email-Login);
- the Today crop formula reproduces the three cropped svgs' `width/height/viewBox` strings.

The medal's `<text>` ("V", `'Lato'` 700) names the app's face, `fontFamily: 'Lato_700Bold'`,
`fontWeight: 'normal'` (theme `sans()` rule — a weight is a family).

## D371 — `HERO_BOUNDS` is the designer's `gen/hero-bounds.json`, verbatim, and it covers the paint
The canvas computed the lesson boxes (`heroFit`) and the Today crops from these numbers, so they are the
spec. They are not the painted extents: `--verify-paint` rasterises every card at 4× in headless Chrome
and finds the vertical bounds sit 0.80–8.6 user units outside the paint (never inside); left/right are
the object's and leave out the full-bleed floor lines (17 cards paint −40…433). `Hero` therefore sizes
its canvas from the vertical bounds (+2 pt) and spans the screen width — nothing a card paints is clipped.

## D372 — `Hero` (CSS mode): a screen-wide `<Svg>` over the art's band, the transform folded into one `<G>`
CRITIC §7.1's ruling (screen-wide, no `overflow: visible`, always absolute) with one change of form: the
canvas is not `240 + 2P` tall but only the art's vertical band (`round(T)+190+s(t−190)` … bottom, ±2 pt,
snapped to whole points), and the frame's `scale(s)` about (196, 190) plus the centring offset
`(W−393)/2` become `translate(ox oy) scale(s)` on the art. Same mapping (X = (W−393)/2 + 196 + s(x−196),
Y = T + 190 + s(y−190)), a smaller canvas, and the art's sub-point position is independent of how the box
is rounded. `scale` defaults to the card's own (`HERO_SCALE`: 1.1, the medal 1 — Medallion Received draws
it at 1), not a flat 1.1. `HeroArt` (memoised) is exported for a caller that needs the bare art in its own
`<Svg>`.

**Small screens, rule 1 (D320).** A decorative hero between the content and the bottom controls (the
question boards' T 458 / 506 / 582, the check-in heroes) takes `controls` — the space the controls take
off the screen's bottom edge (106 for the primary at bottom 48; 0 for a board with none, so the screen's
edge is the limit). Given, the hero is not drawn when its art's bottom (bounds) would come within 16 of
that line. Measured over every Email-Login hero with controls, the frames keep ≥ 21.8 there at 852
(Cue Hue Picker is the closest), so the prop never acts at 393 × 852; at 375 × 667 it drops Cue Hue
Picker's door (which ran under Continue) and V3 Q3b's calendar (which the screen's edge would cut). It
is the screen's opt-in: without `controls` the hero always draws. `heroArtBottom()` joins
`heroArtTop()` for screens that need the numbers.

## D373 — A fractional hero `top` draws from the whole point (measured)
The canvas boxes at 241.3 / 231.5 (Today crops) and 114.4 (Week IV cover) do not land where the numbers
say: Chrome paints an `<svg>`'s content from its border-box origin snapped to the whole point, at the
unsnapped scale. Measured by band-wise sub-pixel fitting of the app capture to the design: Today Task
lands as if at 241, Today III at 232, Week IV at 114 (every band within 0.07 pt once snapped; 0.3–0.5 pt
off before, 0.44–1.53 % of the hero band in mismatch). `Hero` uses `Math.round(top)` in CSS and crop
mode; the week covers' 98.9 / 63.9 / 88.8 follow the same rule (inferred, not captured). Box mode needs
nothing: its svg offset inside the box is an integer, so on web the browser snaps the app's svg exactly as
it snaps the canvas's (L2 Frame 1's box sits at y 154.5 → 0.00 %).

## D374 — Crop mode (Today II / Task / III) and box mode (lesson reader)
Crop: today-day §0.5 verbatim (`vy = t−3`, `vh = b−t+6`, `s = round2(148/vh)`, `vw = W/s`,
`vx = 196.5−vw/2`, height `round1(vh·s)`, rounded as the frame writes them), then the browser's
`xMidYMid meet` fit of that viewBox into that box, drawn without clipping (the canvas sets
`overflow: visible`). At W ≠ 393 the crop widens with the screen and stays centred. Box: an in-flow
`View` `width W, height HERO_BOX.h, marginHorizontal −bleed (32)`, art placed with `HERO_BOX.top` at the
card's scale — the medal's box uses the 1.1 formula and its art scale 1, as the canvas does.

## D375 — `HeroBoard`
`tone` (light | dark), `nav` (`left` default `'empty'`, `centre`, `right` default `'close'`, handlers),
`hero` + `heroTop` (190) + `heroScale`, or `art` (a canvas-coordinate layer, e.g. Drop Received's medal)
+ `artTop`; `stackTop` (452), `gap` (18), `caps`, `title`, `titleSize` 30 | 26 | 34 (→ `title` 30/36,
`h1` 26/33, `titleCover` 34/40, centred, balance), `body` (string → 15/24 sub, dark 0.62; node replaces
it), `extra`, `cta`/`onCta`/`ctaDisabled`, `ctaBottom` (96 when there is a ghost, else 48),
`ghost`/`onGhost`, `children`. Small screens (D320 rule 2): the stack is measured (`onLayout`); when
`stackTop + height + 16` passes the highest control's top, hero (or art) and stack rise together by the
deficit, capped so the art's top stays ≥ canvas 108. The lift is a whole number of points (`ceil` of the deficit, `floor` of the
room), so the hero (drawn at `round(top)`, D373) and the stack move by exactly the same amount and the
clearance is never under 16. Until the stack has been measured, the hero/art and the stack render at
opacity 0, so a short screen never paints one unlifted frame and then jumps. **When the deficit is
larger than the room** (no frame and no real phone needs it; Dynamic Type 1.3× on a 667 phone could),
the art is dropped — it is decoration, rule 1 — and the stack rises alone as far as canvas 108; if it
still does not fit, it scrolls in a `ScrollRegion` from 108 to the primary's top (16 end padding).
Never under a control. Verified at 375×667 (Slip Entry and Drop Received lift 23 / 37, body bottom 16 pt
above the pill), at 430×932 (full-bleed grounds reach both edges), and the two fallbacks on Slip Entry
at 375×480 (art dropped, stack 16 pt above the pill) and 375×340 (stack scrolls from 108).

## D376 — `LaurelMark`: `Image` + `tintColor="#FFFFFF"` + `resizeMode="stretch"`
The canvas's `filter: brightness(0) invert(1)` on a 280×252 webp drawn into a square box. `size` and an
optional `radius` (Reminders Setup's 40 r10 notification icon); the caller positions it. Splash and Login
diff at 0 px over 6/255 — the laurel is pixel-identical, including the stretch.

## D377 — `MedalTier` + `TierLadder`
`MedalTier({tier 0–4, size 30, dim, disc, glyph})` is the kit's `medal(tier, size, glyph)` (radii `c−2`, `c·0.72`,
`c·0.74`, `c·0.82`, `c·0.66`; platinum's 16 ticks with `toFixed(1)` endpoints and `size·0.04` stroke, so
at 30 every path string is the frame's). Unearned: Paper is redrawn as the dashed `#5A574F` ring
(`3 6`), tiers 1–4 keep their drawing at opacity 0.32 (`TIER_DIM`). The frames set each medal on a
`#0D0D0D` disc of its size (it masks the tier track) — `disc` (default on). `glyph` is
Drop Received's centred letter (`medal(4, 176, 'V')`, the only frame that draws one): Lato 700 at
`round(s·0.34)`, baseline `c + fontSize·0.36`, fill ground on tiers 3–4, else ink (`#5A574F` dim) — so
at 176 it is the frame's `x 88 y 109.6 font-size 60`; that frame draws no disc (`disc={false}`).

`TierLadder({reached: −1..4, progress?, thresholds?})` is the ladder of the five Breakwater / Detail
boards **and** the eight Tiers pages (18 frames, one track): rail `left/right 10% top 14 h2`, ink fill,
five medals, names 13/700 ink when reached, mute otherwise. The boards fill to the reached tier
(`progress` defaults to `reached`); the Tiers pages run part-way to the next rung —
`width = (progress·20).toFixed(1) %` as the frames print it, none at 0 or when nothing is reached — and
carry `thresholds` (12/700 nowrap, `#B5B0A8` reached, `#5A574F` not) under the names (`gap 3`).
`ladderStanding(count, rungs)` gives `{reached, progress}` per medallions-letters §1.4 (reached = rungs
met − 1; progress = reached + (count − rung[reached]) / (rung[reached+1] − rung[reached]); 4 at the top;
−1 when unearned — Archive's 9 of 10 draws no fill). It reproduces all eight frames' fills (Vidi 5.2,
Vici 18.0, Rebound 2.2, Breakwater 10.0, Logbook 20.4, Pulse 14.0, Lessons 7.0, Archive none).
Reached is told by colour and opacity only, so the ladder is one accessibility element:
`role="progressbar"`, label "Tiers", value 0–5, and a value text that reads each tier, its rung and
whether it is reached (RN-web renders the aria attributes and no tab stop).
Verified: Breakwater Paper / Gold / Platinum, Detail Paper, all eight Tiers pages (0 px over 6/255 with
the 168 coin — the medallions group's — masked) and Drop Received (0 px over 6/255, whole frame).

## D378 — `body.mjs` prints `data-hero`, `paint-order` and `font-family`
Those are the attributes the frames carry that it dropped (tallied over all 1,580 frames: the only others
are `data-screen-label` on frame roots and the illustration canvas's `sc-if` wrappers, neither of which
is screen content). `decl.mjs` keeps its own, unpatched copy of the list (not this part's file).

## D379 — Kit-lab replicas are not written to `.overhaul/recipes/`
`audit.mjs` keys recipes by frame label across every file, so a kit-lab "Splash" or "Login" entry would
override the auth group's real one. The replicas live in `LAB_HERO` (`/kit-lab?f=<stem>`) and are re-run
from there.
