# Group `tail` — onboarding plan, cost, line, handover keepsakes (19 frames)

Analysis only. Every number below is the frame's own (`node scripts/overhaul/body.mjs`), cross-checked
against the design layout signatures in `.overhaul/sig/d-Email-Login-<Frame>.txt` and the PNGs in
`.overhaul/shots/design/Email-Login/`. Canvas y is quoted; the app subtracts 54 (D009) for anything
hung from the top, and measures `bottom:` offsets off the screen edge (D026).

Scratch: `.overhaul/understand/scratch-tail/*.txt` holds the full `body.mjs` dump of every frame here;
`scratch-tail/lcg-check.mjs` proves that the two dot fields come out of the designer's generator (see §Data).

---

## 0. The flow in this drop, and how it differs from the app

`.overhaul/FLOW.txt` (canvas badges) runs:

```
23 Goal confirmation → 24 Enlisting Aegis → 25 Where We’d Start → 26 Start Here → 26A Step 1 → 26A2 Step 2
→ 27 Your Plan → 28 Starting Score → 29 Cost Next 30 → 30 Cost Next 365 → 31 Cost By Age 80
→ 32 Line If Nothing Changes → 32A Line With the Plan → 32B A Clean Day → 33 One Bad Day
→ 34 What You Want Back → 38 Letter Received → 39 Letter Week XII → 40 The Vow → 41 Medallion Received
→ 42 Reminders Setup → 43 Paywall → 44 Day Zero
```

Against `src/app/(onboarding)/welcome.tsx` `STEPS` (lines 86–113) that means:

| app step id (kind) | this drop |
|---|---|
| `plan-together` … `want-back` | kept, all restyled (below) |
| `change-line` (`O3ChangeTheLine`) | **gone** — split into two new boards, `Line If Nothing Changes` and `Line With the Plan` |
| `reading` (`O3Reading`, the three-page Campaign Map, v3.tsx:1117) | **withdrawn** — `Campaign Map I–III` no longer exist in the bundle; badges 35–37 are absent from the flow; `What You Want Back`’s CTA changed from “See the twelve weeks” to “Continue”. Recommend removing the step (open question Q4). The twelve weeks are still reachable in Library (`Week-II-…`, `Week-XII-…` frames). |
| `letter-arrived` … `medallion` | kept, restyled, copy changed |
| `reminders`, `paywall`, `day-zero` | not this group (paywall-reminders) |

Every tail board is still “whole-frame” (rendered outside `O3Shell`, `WHOLE_FRAME` set at welcome.tsx:129).
New: most of them now draw the kit’s **nav row with a Back chevron** (the previous drop drew none), so
`welcome.tsx` must pass its `back` (= `move(i,-1)`) into each.

| frame | nav row | Back | right slot | primary | ghost |
|---|---|---|---|---|---|
| Enlisting Aegis | none at all | – | – | none (auto-advance) | – |
| Where We’d Start | empty row | – | – | Continue @ bottom 48 | – |
| Start Here | empty row | – | – | Continue @ bottom 96 | Choose another @ bottom 60 |
| Start Here Step 1 | title “Step 1 of 2” | ✓ | – | Next @48 | – |
| Start Here Step 2 | title “Step 2 of 2” | ✓ | – | Continue @48 | – |
| Your Plan | | ✓ | – | Continue @48 | – |
| Starting Score | | ✓ | – | Next @48 | – |
| Cost Next 30 | | ✓ | – | Next @48 | – |
| Cost Next 365 | | ✓ | – | Next @48 | – |
| Cost By Age 80 | | ✓ (stroke **#17160F**, invisible — Q3) | – | Next @48, **#FFFFFF** fill | – |
| Line If Nothing Changes | | ✓ | – | Next @48 | – |
| Line With the Plan | | ✓ | – | Continue @48 | – |
| A Clean Day | | ✓ | – | Continue @48 | – |
| One Bad Day | | ✓ | – | Continue @48 | – |
| What You Want Back | | ✓ | – | Continue @48 | – |
| Letter Received | empty row | – | – | Open @96 | Save it for later @60 |
| Letter Week XII | | – | close X | Continue @96 | Keep this letter @60 |
| The Vow | | – | close X | Sign @96 | Not now @60 |
| Medallion Received | empty row | – | – | Continue @48 | – |

---

## 1. Shared vocabulary (kit pieces these 19 frames use, with exact numbers)

All from `Vici Overhaul/project/gen/mono-kit.js`, confirmed against the frames. Palette: ground `#0D0D0D`,
card `#1E1E1E`, line `#2E2E2E`, art `#5A574F`, ink/text `#F2F0EC`, sub `#B5B0A8`, mute `#9B968E`,
on-ink `#111111`; hero tones DIM `#55524D`, DIM2 `#3A3835`.

* **frame** — 393×852, bg `#0D0D0D`, `noise.png` (96×96 tile, `assets/images/noise.png`) repeated at
  opacity **0.05**, first child (under everything). Exception: **Cost By Age 80** is the kit’s *dark*
  frame — bg **#111111**, `noise-dark.png` at **0.09**. The noise tile must be anchored at the
  screen origin (canvas 0,0), not at the safe-area top, or its phase shifts 54pt and pxdiff reads grain.
* **nav** — `top:60 height:40`, `padding:0 22`, `justify-content:space-between; align-items:center`,
  z 5. Left slot 36×40 (`align-items:center`) holds `chevronL`: svg 12×20, `M10 2L2 10l8 8`, stroke
  `#F2F0EC` 2.2 round/round → sits at x 22–34, y 70–90. Centre: title `13/700 #9B968E nowrap`
  (Step 1 of 2 lands at 166.1,72, 60.9×16). Right slot 36×40 (`justify-content:flex-end`) holds
  `closeX`: svg 18×18 `M2 2l14 14M16 2L2 16` stroke `#F2F0EC` 2 round → x 353–371, y 71–89.
  “empty row” = the two slots with nothing in them (no control, nothing to tap).
* **h1** — `26/700`, ls −0.6, lh 33, `#F2F0EC`, `text-wrap:balance` (centred variant `text-align:center`).
  The Vow uses size 40 / lh 46.
* **p** — `15/400`, lh 24, `#B5B0A8`, `text-wrap:pretty`. Variant “ink” `16/400 lh 25 #F2F0EC`
  (One Bad Day line 3, What You Want Back line 2).
* **caps** — `13/700 #9B968E nowrap`, *mixed case* despite the name (no text-transform).
* **stack** — `position:absolute; left:24; right:24; top:T; display:flex; flex-direction:column; gap:G`
  (+ `align-items:center; text-align:center` when centred).
* **primary** — `left:24 right:24 bottom:B height:58 radius:29 bg #F2F0EC`, label `16/700 ls 0.1 #111111
  nowrap`, centred, z 6. `B = 48` (top 746) alone, `B = 96` (top 698) when a ghost sits under it.
  Dark-frame variant (Age 80): bg `#FFFFFF`, label `#111111`.
* **ghost** — `left:0 right:0 bottom:60`, centred `15/400 #9B968E`, line box normal (18) → box 0,774 393×18.
  Full-width box is the tap target in the canvas.
* **hero** (`svgWrap`) — `<svg width=393 height=240 viewBox="0 0 393 240" style="position:absolute;
  left:0; top:T; overflow:visible; transform:scale(1.1); transform-origin:196px 190px">`. Canvas point
  of a hero coordinate (x,y): `X = 1.1x − 19.6`, `Y = T + 1.1y − 19`. In RN: `<Svg 393×240
  style={{position:'absolute',left:0,top:T−54}}><G transform="translate(196 190) scale(1.1)
  translate(-196 -190)">…`. Every hero in this group stays inside the 393×240 viewport after scaling
  (checked: charger 60–192, door 54–202, envelope ≈86–210), so `overflow` does not matter except
  horizontally where the frame clips anyway. Medallion uses `scale(1)`; A Clean Day has **no transform**
  and `top:175`.
* **`paint-order="stroke"`** — `body.mjs` does **not** print this attribute, and react-native-svg does not
  support it. It is on: the charger’s base rect (`x166 y124 52×14 rx4`, stroke `#0D0D0D` 3) in
  Where We’d Start / Start Here / Step 1, and on the medal’s right ribbon path and disc circle
  (Medallion Received). Reproduce as two draws: first the shape stroked `#0D0D0D` at the stated width
  with `fill="none"`, then the same shape filled with no stroke (net: a dark halo of half the stroke
  width outside the fill, which “cuts” what is behind it).

Typography in SVG `<text>`: frames say `font-weight="600"` on several labels; the canvas only loads
400/700/900, so 600 renders in **Lato 700**. In RN pass `fontFamily="Lato_700Bold"` (theme `LATO.bold`)
and **no** `fontWeight` (the old `O3OneBadDay` passed `fontWeight="500"` with `fonts.sans` — the trap).

---

## 2. Per frame

### 2.1 `24 · Build plan` — **Enlisting-Aegis.html**

* **Route/state:** `/welcome`, step `plan-together`. Recipe: `.overhaul/recipes/tail.json` pattern —
  seedScript `.overhaul/tail-session-seed.js`, script `.overhaul/drives/tail-walk.js`; the walk passes
  through it (needle “Putting your plan together”). It auto-advances after 6.8s, so a capture must land
  inside that window (stop the walk on this needle; add a `__T` for it).
* **App today:** `O3PuttingTogether`, `src/components/onboarding/tail.tsx:331` — a 5-stop sunrise gradient,
  15/400 caption at 150, 311-wide progress rule, three centred rows with 15pt ticks, a 399pt white disc.
* **Frame draws (no nav row, no buttons):**
  * spinner: flex row `top:236` centring an 88×88 svg (→ x 152.5): `circle cx44 cy44 r38 fill none stroke
    #F2F0EC 2 dasharray "2 7"` + arc `path M44 6 A38 38 0 0 1 82 44 stroke #F2F0EC 4 round`.
  * `stack(352, centred, gap 20)`: h1 centred “Putting your plan together…”.
  * `stack(462, gap 18)` of three `planRow`s: `display:flex; align-items:center; gap:14`; disc 26×26 r13;
    label `<span flex:1>` → x 64, width 305.
    * row 1 (done) — disc `#F2F0EC`, `check` 13×13 (`M2 7.5l3.2 3L12 3.5`, stroke `#111111` 2.2 round);
      label `16/700 #F2F0EC` “Finding where you usually struggle” (text box 64,465.5).
    * row 2 (now) — disc `#1E1E1E` + ring `0 0 0 1.5px #F2F0EC` (outside) + 8×8 r4 `#F2F0EC` dot;
      label `16/700 #F2F0EC` “Looking at what tends to set it off” (509.5).
    * row 3 (todo) — disc `#1E1E1E` + ring 1.5 `#2E2E2E`; label `16/400 #9B968E` “Choosing where to start” (553.5).
* **Change:** replace the whole board (gradient, rule, sunrise disc, 15.5/500 rows) with the above. Copy is
  unchanged character for character; “Putting your plan together…” is now an h1, not a caption.
* **Preserve:** the 6.8 s auto-handover (`AEGIS_MS`), no control drawn. Whether the three rows step through
  todo→now→done during the 6.8 s and whether the arc rotates is Q9 — the frame draws exactly the state above.

### 2.2 `25 · This Is Where We’d Start` — **Where-We-d-Start.html**

* **Route/state:** `/welcome` step `whered-start`. Recipe `.overhaul/recipes/plan.json` (“Where We’d Start”):
  seedScript `.overhaul/f-plan-user.js`, script `.overhaul/drives/f-plan-walk.js`, `window.__T='whered-start'`.
  The walk answers `13 · When` = Late at night + When I’m home alone, which `planSignals` tops up with
  While scrolling → the frame’s three chips.
* **App today:** `O3WhereWedStart`, `src/components/onboarding/plan.tsx:472` — light field, 24/500 heading at
  140, a 345×150 gradient night card with stars/moon/bed, three 56pt white glyph discs on a dashed rule,
  two copy blocks.
* **Frame draws:**
  * empty nav row (no Back).
  * hero **charger** (`data-hero="charger"`, kit `H.charger`), `svgWrap` top **190**, scale 1.1:
    `rect -40,189 473×3 rx1.5 #55524D` (floor) then `<g translate(-25 0)>`: drawer `120,147 152×32 rx3
    #55524D`; handle `178,160 36×3.5 rx1.75 #0D0D0D`; legs `126,179 7×11` and `259,179 7×11 #F2F0EC`;
    top `112,138 168×9 rx4.5 #F2F0EC`; phone `178,72 28×58 rx6 #F2F0EC`, screen `181,75 22×46 rx4 #0D0D0D`,
    bolt `M194.5 86.5 L186.5 100 H192 L189.5 110.5 L198 97 H192.5 Z #F2F0EC`; dock `166,124 52×14 rx4
    #F2F0EC` **stroke #0D0D0D 3, paint-order stroke, linejoin round**; socket `300,92 30×42 rx6 #55524D`;
    cable `M218 130 C 252 131, 306 138, 315 121` stroke `#F2F0EC` 3 round/round; plug `306,100 18×22 rx4
    #F2F0EC`.
  * `stack(451, centred, gap 16)`:
    1. h1 centred “Sam, this is where we’d start.” (one line, 24,451 345×33).
    2. chip row: `display:flex; gap:8; justify-content:center; flex-wrap:wrap; margin-top:4` → starts 504.
       Each chip `height:44 radius:22 bg #F2F0EC padding:0 18`, `15/700 #111111` (bespoke “signal pill”,
       not kit `chips`). Measured: “Late at night” 74.5,504 119.6w · “Home alone” 202.1,504 116.4w ·
       “Phone in bed” 135.3,556 122.5w (wraps to a second row, row gap 8).
    3. p centred “These came up together in your answers.” (616).
    4. p centred “You don’t need to change everything at once. **Start with this.**” — one paragraph, the
       bold run is a `<span>` `font-weight:700 color:#F2F0EC`; breaks after “Start” (656, 2 lines, 48 tall).
  * primary “Continue” bottom 48.
* **Change:** remove the night card, the glyph discs, the dashed rule and `PlanGlyph`; add the charger hero;
  chips become wrapping 44pt ink pills (`CHIP_LABEL` still supplies the words — the frame still draws
  “Home alone”/“Phone in bed” for `When I’m home alone`/`While scrolling`, so D053 stands; the 100pt
  `nowrap` column of D092 is gone, so “Bored”/“Stressed”/“Can’t sleep” could revert to fuller forms if
  wanted). The two runs “You don’t need…” / “Start with this.” become ONE paragraph with an inline bold run.
  Name fallback stays: no name → “This is where we’d start.”
* **Preserve:** name personalisation; `planSignals` (≤3 chips, topped up); Continue → next.
* **Dependency risk:** `planSignals` filters with `FUNNEL_GLYPHS[t]` (plan.tsx:404). This drop’s `13 · When`
  is a glyph-less chip picker, so the funnel group will very likely drop `FUNNEL_GLYPHS`; then `planSignals`
  returns `[]`. Decouple: filter against the nine `13 · When` labels (the keys of `CHIP_LABEL`).

### 2.3 `26 · Start Here` — **Start-Here.html**

* **Route/state:** `/welcome` step `start-here`; plan.json recipe `__T='start-here'`.
* **App today:** `O3StartHere`, plan.tsx:590 — bed + nightstand scene in a 240×200 art box (SoftBlobs),
  24/500 heading at 432, evidence line at 516, “I can do that” pill (56 tall) at 688, “Choose another” at 764.
* **Frame draws:** empty nav row; **charger** hero identical to 2.2 (top 190, scale 1.1, same paint-order dock);
  `stack(451, centred, gap 18)`: h1 “Keep your phone out of bed tonight.” — balanced to two lines
  “Keep your phone / out of bed tonight.” (24,451 345×66); p “Late night, bed and scrolling came up together
  in your answers.” (535, two lines, break before “your answers.”). Primary “Continue” **bottom 96**;
  ghost “Choose another” bottom 60.
* **Change:** scene → charger hero; heading/evidence restyled to kit h1/p (strings unchanged, still from
  `change.heading` and `evidenceLine(...)`); **CTA copy “I can do that” → “Continue”**, 58 tall (was 56);
  “Choose another” becomes the kit ghost (15/400 #9B968E, full-width 18pt box).
* **Preserve:** D054 “Choose another” (`onAnother` → `setPlanPick(p+1)`), D093 evidence line, the artwork
  stays the charger for every alternative board (D054).
* **Native note:** `text-wrap:balance` on a dynamic heading — web passes `textWrap:'balance'`; native needs
  either explicit `\n` in `FIRST_CHANGES` headings or a width constraint so the same break falls out.

### 2.4 `26A · Start Here — Step 1` — **Start-Here-Step-1.html**

* **Route/state:** `/welcome` step `start-here-1`; plan.json `__T='start-here-1'`.
* **App today:** `O3StartHereStep1`, plan.tsx:654 — two-dot `StepDots` at 132, nightstand scene, heading 432, note 516.
* **Frame draws:** nav with **Back** + title **“Step 1 of 2”**; **charger** hero (same as 2.2, paint-order dock);
  `stack(451, centred, gap 16)`: h1 “Charge it away from the bed.” (1 line); p “Tonight, before you lie down.”
  (500); primary “Next” bottom 48.
* **Change:** delete `StepDots`; add nav (Back → `back()`, title); scene → charger hero (the frame reuses the
  Start Here hero; the old distinct phone-on-table scene is retired). Strings unchanged
  (`change.steps[0]`).

### 2.5 `26A2 · Start Here — Step 2` — **Start-Here-Step-2.html**

* **Route/state:** `/welcome` step `start-here-2`; plan.json `__T='start-here-2'`.
* **App today:** `O3StartHereStep2`, plan.tsx:685 — dots, bed/moon/door scene, heading 432, note 548.
* **Frame draws:** nav Back + “Step 2 of 2”; hero **door** (`data-hero="door"`, `H.door`), top 190, scale 1.1:
  floor rect as 2.2; `<g translate(-14 0)>`: frame `144,54 104×136 rx3 #55524D`; door `151,61 90×129 rx1.5
  #F2F0EC`; panels `163,75 66×46 rx2` and `163,133 66×44 rx2` both `fill none stroke #0D0D0D 2.6 join round`;
  knob `circle 229,127 r3.6 #0D0D0D`; mat `160,195 72×6 rx2.5 #55524D`; pot `M286 190 L289.5 168 H306.5 L310 190 Z
  #55524D`; sprig `M298 168 V150 M298 158 C 290 155, 287 147, 289 141 C 296 144, 299 151, 298 158 M298 154
  C 306 151, 309 143, 307 137 C 300 140, 297 147, 298 154` stroke `#F2F0EC` 2.2 round/round.
  `stack(451, centred, gap 16)`: h1 “Can’t sleep? Get out of bed before you start scrolling.” balanced
  “Can’t sleep? Get out of bed / before you start scrolling.” (66 tall); p “One change tonight. Build from there.”
  (533). Primary “Continue” bottom 48.
* **Change:** as Step 1 (nav, door hero, kit type). Strings unchanged (`change.steps[1]`).

### 2.6 `27 · Your Plan` — **Your-Plan.html**

* **Route/state:** `/welcome` step `your-plan`; plan.json `__T='your-plan'`.
* **App today:** `O3YourPlan`, plan.tsx:770 — centred 22/500 “Your plan” at 126, five hairline rows with
  48pt white discs at 190.
* **Frame draws:** nav Back. `stack(170, gap 14)`: h1 left-aligned “Your plan” (24,170); spacer div 6 tall
  (217); five cards (tops 237, 325, 413, 501, 589; each 345×74): `display:flex; align-items:center; gap:16;
  padding:16px 18px; radius 18; bg #1E1E1E`; disc 42×42 r21 `#F2F0EC` (x 42) with a 20×20 icon in `#111111`;
  text column `gap:2; flex:1; min-width:0` at x 100, w 251: title `16/700 #F2F0EC nowrap`, sub `13/400 #9B968E`
  (line boxes normal → 19 / 16; title text top = card top + 18.5).
  Icons (viewBox 0 0 20 20):
  1. moon `M14 3a8 8 0 1 0 3 12.5A7 7 0 0 1 14 3z` fill `#111111`
  2. bed `M3 6v9M3 12h14v3M17 12v-3a2 2 0 0 0-2-2H8v4` stroke 2 round/round
  3. phone `rect 5,2.5 10×15 rx2.5 stroke 2` + `M10 7v6M8 11l2 2 2-2` stroke 1.8 round/round
  4. plug `M7 3v4M13 3v4M5 7h10v3a5 5 0 0 1-10 0z M10 15v3` stroke 2 round/round
  5. bolt `M11 2L4 11h6l-1 7 7-9h-6z` fill
  Rows: “Late at night / When it usually happens”, “In bed / Where it usually happens”, “Scrolling / What
  tends to set it off”, “Phone out of bed / Your first change”, “SOS gets you out first / When an urge hits”.
  Primary “Continue” bottom 48.
* **Change:** hairline list → cards; new five icons (row 5 is now a bolt, was a crosshair); heading left-aligned
  26/700; Back added. Strings unchanged; row titles still `[when, where, starterFor(starter).row, change.row,
  'SOS gets you out first']` (D055 still holds — icons belong to the row).

### 2.7 `28 · Your VICI Rating` — **Starting-Score.html**

* **Route/state:** `/welcome` step `starting-point`; tail.json recipe `__T="starting-point"` (needle must
  change, see §6).
* **App today:** `O3StartingPoint`, tail.tsx:414 — ring gauge (`SCORE_RING`, 0…3,000), ELO bell
  (`SCORE_CURVE`), “YOUR VICI RATING” 12.5/600 tracked, 60/500 number, “Starting point” under it.
* **Frame draws:** nav Back.
  * caps centred “Your VICI rating” at top **224** (full-width div, 13/700 #9B968E).
  * gauge: flex row at top **270** centring an svg **300×196** (→ left 46.5). Centre (150,156). 49 ticks,
    i = 0…48, angle θ = 180° − 3.75°·i (0 = left end, 48 = right end):
    * **filled** ticks (i/48 ≤ score/1000 → i ≤ 40 for 842): from r 108 to r 128, stroke `#F2F0EC` **3.4** round;
    * **unfilled** ticks: from r 119 to r 128, stroke `#F2F0EC` **2** round.
    * endpoints are written to one decimal (`(150 + r cosθ).toFixed(1)`, `(156 − r sinθ).toFixed(1)`) — e.g.
      i=0 `M42.0 156.0L22.0 156.0`, i=41 `M256.7 103.4L264.8 99.4`.
    * marker `circle r6 #F2F0EC` at r **96**, angle 180° − 180°·score/1000 → (234.4, 110.3) for 842.
    * `<text>` middle-anchored: “842” x150 y146 `76/700 ls −3 #F2F0EC`; “of 1,000” x150 y176 `14/600(→700)
      #9B968E`; “0” x22 y192 and “1,000” x278 y192 `12/600(→700) #9B968E`.
  * pill: flex row at top **494** centring `height:34 radius:17 bg #1E1E1E ring 0 0 0 1.5px #2E2E2E
    padding:0 16`, `13/700 #F2F0EC nowrap` “Starting point” (140.5,494 112×34).
  * `stack(556, centred, gap 20)`: p “This is where you start. What you do from here matters more than the
    questionnaire.” (2 lines, break after “here”).
  * primary “Next” bottom 48.
* **Change:** retire the ring, the ELO curve, `SCORE_RING`/`SCORE_CURVE`/`SCORE_SAMPLE` data; build the tick
  gauge parametrically from the score; “YOUR VICI RATING” → “Your VICI rating” (no caps transform);
  “Starting point” moves into an outlined pill; new texts “of 1,000”, “0”, “1,000”.
* **Open:** Q1 — the frame scale is 0…1,000 and prints 842; the app’s opening rating is `SCORE_BASE = 1_000`
  (`src/lib/score.ts:12`) and Score Detail still ranks from Deckhand 1,000 upward (1,240 on its frames).

### 2.8 `29 · The Next 30 Days` — **Cost-Next-30.html**

* **Route/state:** `/welcome` step `next30`; tail.json `__T="next30"`.
* **App today:** `O3Next30`, tail.tsx:484 — white card with a 6×5 grid of rounded squares, square key, light field.
* **Frame draws:** nav Back.
  * `stack(199, gap 18)`: h1 “This is your next 30 days.”; p “If the rate you reported stayed the same, about
    **9 of the next 30 days** could end with porn.” (bold span `700 #F2F0EC`; break after “9 of”, 2 lines).
  * dots: flex row `left:24 right:24 top:343 justify-content:center` with svg **334×244** (→ left 29.5).
    30 circles r **14**, `cx = 22 + 58·col`, `cy = 22 + 50·row` (6 across, 5 rows):
    * the 9 relapse days, indices **2, 6, 9, 13, 16, 20, 23, 27, 29**: `fill #0D0D0D stroke #F2F0EC 1.6`;
    * the other 21: `fill #111111 stroke #F2F0EC 1.8`.
    (Visually all 30 read as identical outlined circles — Q2.)
  * key: row `left:0 right:0 top:603 justify-content:center gap:28`; each item `flex, align center, gap 8,
    14/700 #B5B0A8`; swatch 12×12 r6: “Relapse” `bg #0D0D0D ring 1.5 #F2F0EC`; “Clean day” `bg #1E1E1E ring
    1.5 #5A574F`. (Relapse 107.3,603 · Clean day 204.5,603.)
  * footnote: `left:24 right:24 top:653` centred `15px lh 22 #9B968E` (weight 400) “The line can start changing
    with the next one.”
  * primary “Next” bottom 48.
* **Change:** card + squares → bare SVG circle grid; new `COST_30` (relapse index set above — differs from the
  current `[2,5,9,12,16,19,23,26,28]`); text restyle; bold inline run. `NEXT_30_TIMES` stays the count of
  relapse cells (= 9), so the sentence stays consistent.

### 2.9 `30 · One Year From Now` — **Cost-Next-365.html**

* **Route/state:** `/welcome` step `one-year`; tail.json `__T="one-year"`.
* **App today:** `O3OneYear`, tail.tsx:552 — 17-across square grid edge to edge from y 60, floating blurred
  pill card (`TailPill`, expo-blur).
* **Frame draws:** nav Back.
  * `stack(199, gap 20)`: h1 “One year from now.”.
  * dots: div `left:24 top:284` with svg **345×208**: 365 circles, **25 across**, `cx = 7 + 13.8·col`,
    `cy = 7 + 13.8·row` (15 rows; last row 15 dots). 110 dark: `r 4.4 fill #F2F0EC`; 255 light:
    `r 2.4 fill rgba(242,240,236,0.28)`. Pattern = the generator’s LCG (§Data).
    Coordinates are float-accumulated in the frame (`48.400000000000006` etc.) — compute `7 + 13.8*c`.
  * `stack(530, gap 6)`: “About 110 days” `44/700 ls −1.5 lh 52 #F2F0EC` (left-aligned); p “Where you’re
    predicted to relapse.” (588).
  * primary “Next” bottom 48.
* **Change:** remove the square grid, the blur pill and `BlurView`; add the dot grid and the left-aligned figure
  block. “One year from now.” is now the h1 (was the pill’s 15/500 lead); “Where you’re predicted to relapse.”
  is a p. `YEAR_DAYS` = dark count = 110 (unchanged meaning).

### 2.10 `31 · If Nothing Changes` — **Cost-By-Age-80.html**

* **Route/state:** `/welcome` step `age80`; tail.json `__T="age80"` (age 24 → 6,100).
* **App today:** `O3IfNothingChanges`, tail.tsx:599 — `#060606` sky with eleven 1.3pt stars, dark blur pill,
  white CTA.
* **Frame draws (dark kit frame):** bg `#111111`; noise-dark 0.09.
  * nav Back — chevron stroke **#17160F** (the light palette’s TXT; on #111111 it is effectively invisible —
    the PNG shows a faint mark at 22,70). Q3.
  * field: `div inset:0` containing svg **393×852** at the frame origin — 33 × 71 dots at `cx = 6 + 12·c`,
    `cy = 6 + 12·r`; 720 bright `r 2.6 #FFFFFF`, 1,623 dim `r 1.6 rgba(255,255,255,0.22)` (LCG, §Data);
    then a veil `left:0 right:0 top:96 height:230` `linear-gradient(180deg, #111111 0%, #111111 62%,
    rgba(17,17,17,0) 100%)` — solid to y 238.6, fading out by 326. Dots above y 96 (rows at 6…90, i.e. under
    the status bar and round the nav) stay visible. The nav row (z 5) paints above the field.
  * caps “By age 80” `left:24 top:126 z2` `13/700 rgba(255,255,255,0.55)`.
  * figure `left:24 top:160 z2` `44/700 ls −1.5 lh 52 #FFFFFF` “About 6,100 days” (shrink-to-fit, 318.4 wide).
  * sub `left:24 top:222 z2` `17/400 lh 26 rgba(255,255,255,0.75)` “If nothing changes.”
  * primary “Next” bottom 48, **bg #FFFFFF**.
* **Change:** sky/stars/pill → dot field + veil + top-left text block; `AGE_80_STARS` retired. The field must
  start at screen y 0 (under the status-bar inset), not at the safe-area top. Number still `byAge80`
  (welcome.tsx:242) formatted `toLocaleString('en-US')`; within the age gate (18…79) it is always ≤ 4 digits
  (18 → 6,800; 79 → 100), so the 44pt line never wraps at 345.
* **Perf:** 2,343 `<Circle>`s is heavy on native; draw the two classes as two `<Path>`s of concatenated circle
  arcs (`M cx−r cy a r r 0 1 0 2r 0 a r r 0 1 0 −2r 0`) — same pixels, two nodes. Same for the 365 grid.
  For screens taller than 852, continue the LCG for extra rows (the first 2,343 stay identical).

### 2.11 `32 · If Nothing Changes` — **Line-If-Nothing-Changes.html** (NEW board)

* **Route/state:** `/welcome`, new step (suggest id `line-nothing`, kind `lineNothing`) after `age80`. No
  recipe yet — add `__T='line-nothing'` to tail-walk with needle “The line keeps climbing” (NOT
  “If nothing changes.” — Age 80 draws that string too).
* **App today:** nothing; the slot is `O3ChangeTheLine` (tail.tsx:631), which is retired.
* **Frame draws:** nav Back. `stack(199, gap 18)`: h1 “If nothing changes.”; p “The line keeps climbing.
  Relapses get more frequent, not less.” (2 lines). Chart: div `left:24 top:389`, svg **345×270**:
  * `text` “Relapse frequency” x0 y16 `14/700 #F2F0EC` (start-anchored);
  * axis `M0 236H345` stroke `#F2F0EC` 1.5;
  * lead-in `M0 172 C 30 168, 60 158, 86 150` stroke `#F2F0EC` 4.5 round, fill none;
  * line `M86 150 C 170 128, 250 92, 330 58` same stroke;
  * drop `M208 104V236` stroke `#F2F0EC` 1.5 dasharray “3 5”;
  * tooltip `rect 144,46 128×40 rx10 #F2F0EC`; “3 MONTHS” x208 y62 middle `11/700 ls 1.2 #6B675F`;
    “5× a week” x208 y78 middle `14/700 #111111`;
  * marker `circle 208,104 r9 fill #0D0D0D stroke #F2F0EC 4`.
  Primary “Next” bottom 48.
* **Change:** new component. All chart values are literals (Q7).

### 2.12 `32A · With the Plan` — **Line-With-the-Plan.html** (NEW board)

* **Route/state:** `/welcome`, new step (`line-plan`) after `line-nothing`; needle “With the plan.”.
* **Frame draws:** identical to 2.11 except: h1 “With the plan.”; p “You only have to make the next decision
  different. Then the next one. Then come back tomorrow.” (2 lines, break after “different.”); line
  `M86 150 C 140 138, 190 172, 240 190 C 272 200, 304 206, 330 208`; drop `M208 172V236`; tooltip rect y 114,
  “3 MONTHS” y130, **“2× a week”** y146; marker cy 172; primary **“Continue”** bottom 48.
* **Change:** the paragraph is the old Change-the-Line body copy (kept); its heading “You don’t have to fix the
  next year tonight.” and CTA “Start with today” are retired (the generator wrote “Start with today”; the frame
  says “Continue” — frame wins). Share one `LineChart({mode})` component with 2.11.

### 2.13 `32B · A Clean Day` — **A-Clean-Day.html**

* **Route/state:** `/welcome` step `clean-day`; tail.json `__T="clean-day"`.
* **App today:** `O3CleanDay`, tail.tsx:659 — flat white ground, seedling-in-pot made of Views, 24/500 at 150.
* **Frame draws:** nav Back. Calendar svg 393×240 at **top 175, no transform**, overflow visible:
  body `rect 126,40 140×150 rx16 #F2F0EC`; page `134,82 124×100 rx8 #0D0D0D`; rings `150,26 10×30 rx5` and
  `232,26 10×30 rx5 #F2F0EC` with slots `153,30 4×22 rx2` / `235,30 4×22 rx2 #0D0D0D`; “1” x196 y152 middle
  `68/700 ls −2 #F2F0EC`; “Clean day” x196 y172 middle `11/700 #9B968E`; bar `M170 66h52` stroke `#0D0D0D` 3
  round. `stack(451, centred, gap 18)`: h1 “One clean day.”; p “That’s all today has to be.” (502).
  Primary “Continue” bottom 48.
* **Change:** white board → dark kit frame; seedling → calendar; strings unchanged.

### 2.14 `33 · One Bad Day` — **One-Bad-Day.html**

* **Route/state:** `/welcome` step `one-bad-day`; tail.json `__T="one-bad-day"`.
* **App today:** `O3OneBadDay`, tail.tsx:745 — white card with a line chart, two “slip” marks, “day 0” /
  “today · day 41” labels.
* **Frame draws:** nav Back. Week strip: flex row `top:329` centring svg **344×86** (→ left 24.5). Seven
  columns at `cx = 22 + 48·i`: letter `text` x cx y12 middle `12/700 #9B968E` (M T W T F S S); cell
  `rect (cx−18),22 36×56 rx12`. Days 0–2, 4–6: `fill #F2F0EC stroke #F2F0EC 0` + check `M(cx−8) 51 l5 5 l11 −12`
  stroke `#0D0D0D` 3 round/round. Day 3 (Thursday): `fill #0D0D0D stroke #F2F0EC 2.5` + `circle cx 50 r4
  #F2F0EC`. `stack(451, centred, gap 16)`: h1 “One bad day is one bad day.”; p “It doesn’t erase the work before
  it. Your lessons, logs, rating history and medallions stay.” (2 lines, break after “logs,”); ink p
  `16/400 lh 25 #F2F0EC` “What matters is that you come back.” (564). Primary “Continue” bottom 48.
* **Change:** chart, card and the `day` prop retired (welcome.tsx:298 passes `day={41}` — drop it); week strip
  added; line 3 becomes ink 16/25.

### 2.15 `34 · What You Want Back` — **What-You-Want-Back.html**

* **Route/state:** `/welcome` step `want-back`; tail.json `__T="want-back"`.
* **App today:** `O3WhatYouWantBack`, tail.tsx:813 — sunrise art box, three 56pt glyph discs FOCUS / SLEEP /
  CONFIDENCE, CTA “See the twelve weeks”.
* **Frame draws:** nav Back. `stack(193, gap 18)`: h1 “This is what you’re doing it for.” (1 line); spacer
  10; three pills `height:64 radius:32 bg #F2F0EC`, centred `16/700 #111111`: “Focus” (272), “Sleep” (354),
  “Confidence” (436; Lato ligates “fi”); spacer 10; p “Not a perfect streak for its own sake.” (546);
  ink p `16/400 lh 25 #F2F0EC` “More of your time and attention going where you actually want them.” (588,
  2 lines, break after “you”). Primary **“Continue”** bottom 48.
* **Change:** art box and glyph discs retired; pills are mixed case (“FOCUS” → “Focus” …); CTA
  “See the twelve weeks” → “Continue” (and it now leads to Letter Received, §0).
* **Open:** Q5 — `What it affects` in this drop selects exactly Focus, Sleep, Confidence, and the pills no
  longer carry bespoke glyphs, so the pills can now read his `affects` answers back (D051’s reason is gone).
  If adopted, the walk must tap Focus + Sleep + Confidence (it taps only Focus today) to reproduce the frame.

### 2.16 `38 · A Letter Arrived` — **Letter-Received.html**

* **Route/state:** `/welcome` step `letter-arrived`. Recipe `.overhaul/recipes/handover.json` (“Letter
  Received”): `handover-walk.js` with `__H='letter'` (seed `.overhaul/f-funnel-user.js` or
  `.overhaul/letters-onb-seed.js`). **Second caller:** `/letter?variant=week12` (Settings › Your letter,
  `/(app)/all`) draws the same frame through `MailArrival` in `src/app/letter.tsx` (letters group).
* **App today:** `O3LetterArrived`, handover.tsx:185 — paper field, close cross, envelope with wax seal, 24/500
  title at 472, “Open it” at 688, “Save it for later” at 764.
* **Frame draws:** empty nav row (no close cross). Hero **envelope** (`H.envelope`), top 190, scale 1.1:
  shadow `ellipse 197,206 rx66 ry3.96 #3A3835`; `<g rotate(-5 197 146)>`: `rect 122,102 150×88 rx8 #F2F0EC`;
  flap `M132 112 L197 158 L262 112` stroke `#0D0D0D` 3.4 round/round; folds `M132 180 L176 146 M262 180 L218 146`
  stroke `#0D0D0D` 2.2 round/round; seal `circle 197,158 r10 #F2F0EC` + `circle r6 fill none stroke #0D0D0D 1.8`.
  `stack(451, centred, gap 18)`: h1 “A letter arrived.”; p “From you, twelve weeks from now.” (502).
  Primary **“Open”** bottom 96; ghost “Save it for later” bottom 60.
* **Change:** everything visual; CTA “Open it” → **“Open”**; the close cross is removed (“Save it for later”
  already does the same — `skipLetter`, i+2 → The Vow).
* **Shared:** `letter.tsx`’s `ARRIVAL.week12` still says “Open it” and uses the paper `MailArrival`; it should
  render this component (or the same kit layout) — letters group to wire.

### 2.17 `39 · A Letter From Week XII` — **Letter-Week-XII.html**

* **Route/state:** `/welcome` step `letter-read`; handover.json `__H='read'`. Second caller:
  `/letter?variant=week12` → “Open” (letter.tsx:130 renders `O3LetterRead`).
* **App today:** `O3LetterRead`, handover.tsx:274 — paper sheet from y 52 with grabber, close cross, a
  2,100pt ScrollView of the twelve-paragraph letter, a shore illustration (`LetterMark`) after ¶3, sign-off
  “— Sam, at week XII”, “Keep this letter” as an in-scroll ink pill, “Continue” as a quiet link at bottom 36.
* **Frame draws:** nav with close X (right). Card `left:24 right:24 top:112 bottom:0 radius:24 24 0 0
  bg #1E1E1E padding:34 28 0 overflow:hidden` (text column x 52, w 289):
  * eyebrow `13/700 #9B968E mb 18` “Week XII, from Sam” (146);
  * salutation `26/700 ls −0.6 #F2F0EC mb 18` (line-height normal ≈ 31.2) “Sam —” (180);
  * paragraphs: column `gap:14`, `15px lh 24 #B5B0A8`, no text-wrap:
    1. “I’m writing this at the end of week XII. I remember where you are right now — you want this to be the
       time it finally changes, and part of you is already wondering how long you’ll last.” (230, 5 lines)
    2. “Here is the part I wish you knew: **you do not need twelve perfect weeks.** You need to stop turning one
       bad night into a reason to quit.” (bold span `700 #F2F0EC`; 364, 4 lines)
    3. “There were nights I wanted to watch badly. Some days the only thing I did right was get through the
       evening. That still counted.” (474, 3 lines)
    4. “Every time I waited one out, left the room, or used the SOS instead, I learned the same thing: the urge
       ends whether you obey it or not.” (560, 4 lines; ends 656)
  * fade `left:24 right:24 bottom:0 height:190` `linear-gradient(180deg, rgba(30,30,30,0) 0%, #1E1E1E 60%)`,
    pointer-events none (top 662);
  * primary **“Continue”** bottom 96; ghost **“Keep this letter”** bottom 60 (both z 6, above the fade).
* **Change:** sheet/grabber/paper → kit card; the **letter text is replaced** — `src/content/weekXiiLetter.ts`
  (GENERATED by `scripts/uifinal1/gen-letter.mjs`) must be regenerated from this frame by a fork in
  `scripts/overhaul/` and must carry the bold run (e.g. `{text,bold}` runs per paragraph, plus a plain-text
  join for the journal entry `finish()` writes at welcome.tsx:207). `LetterMark` and the sign-off line are
  retired. “Keep this letter” moves from in-scroll pill to ghost; “Continue” from quiet link to primary.
  New eyebrow line with the name.
* **Preserve:** Continue → `next`; Keep this letter → `onKeep` (onboarding: next; `/letter` week12: `later`);
  close X → `next` (as today). Name fallback (“Friend —”; eyebrow fallback Q14). Small screens: the frame’s
  card is `overflow:hidden` and the copy fits at 852; on a 667-tall screen paragraph 4 falls under the
  buttons — make the text column a ScrollView inside the card (fade + buttons stay fixed). API change:
  `O3LetterRead` should take `{name, onClose, onContinue, onKeep}` and read the copy itself — this breaks
  letter.tsx:130 (letters group must update the call).

### 2.18 `40 · The Vow` — **The-Vow.html**

* **Route/state:** `/welcome` step `vow`; handover.json `__H='vow'`. The date is `new Date()`
  (welcome.tsx:223); `.overhaul/r-handover-vowdate.mjs` freezes the clock at 2026-06-09 to match.
* **App today:** `O3TheVow`, handover.tsx:371 — white board, centred 22/500 “The vow.”, centred vow, sun disc,
  signature in the script face with an “×”, rule and date, “I sign it” 54-tall pill at 688, “Not now” at 760.
* **Frame draws:** nav with close X. `stack(150, gap 18)` (left-aligned):
  caps **“Day 0, Jun 9”** (150); h1 `40/700 ls −0.6 lh 46` “The vow.” (184); vow `21/400 lh 33 #F2F0EC
  margin-top 8` “I’m giving this twelve weeks. I don’t need to be perfect. When I want to watch, I’ll use the
  plan first. If I have a bad day, I’ll come back the next day.” (256, 4 lines, no text-wrap).
  Signature block `left:24 right:24 top:530`: name `30/700 italic ls −0.5 #F2F0EC padding-bottom 10
  border-bottom 1.5px solid #F2F0EC` “Sam” (box 47.5 tall incl. border; Lato 700 italic = `sansItalic()`);
  “Signed on day 0” `margin-top 10, 13/700 ls 0.5 #9B968E` (587). Primary **“Sign”** bottom 96; ghost
  “Not now” bottom 60.
* **Change:** layout left-aligned; sun/glow/× retired; date moves to the caps line and its format changes
  `"Jun 9 · Day 0"` → **`"Day 0, Jun 9"`** (welcome.tsx:223); new “Signed on day 0”; CTA “I sign it” → “Sign”
  (58 tall); close X added.
* **Preserve:** Sign → `onSign` (next); Not now and the X → `skip` (next). Name fallback “Friend”.

### 2.19 `41 · Medallion Earned` — **Medallion-Received.html**

* **Route/state:** `/welcome` step `medallion`; handover.json `__H='med'`. The `/medallion-post` arrival
  (letters group, `src/app/medallion-post.tsx` via `MailArrival`) borrows this frame’s layout (D138).
* **App today:** `O3MedallionEarned`, handover.tsx:425 — warm cream field, close cross, gold struck disc,
  27/600 title “Veni” at 432, body “Your first medallion. You started.” at 482, CTA “Take it”.
* **Frame draws:** empty nav row (no close). Hero **medal** (`H.medal`), svg 393×240 at top **190**,
  `transform:scale(1)` (no scaling): 12 rays stroke `#55524D` 2.5 round/round (endpoints verbatim in
  `scratch-tail/Medallion-Received.txt`); four sparkles (`#F2F0EC` quad-curve stars at 92,70 r3 · 302,64 r2.6
  · 84,186 r2.2 · 310,192 r2.4); ribbon left `M170 38 H190 L210 98 L198 108 L184 94 Z #55524D`; ribbon right
  `M223 38 H203 L183 98 L195 108 L209 94 Z #F2F0EC` **stroke #0D0D0D 3 paint-order stroke**; disc `circle
  196.5,146 r64 #F2F0EC` **stroke #0D0D0D 4 paint-order stroke**; inner ring `r53 fill none stroke #0D0D0D 1.6`;
  “V” x196.5 y170 middle `66/700 #0D0D0D`. `stack(452, centred, gap 12)`: caps “Veni”; h1 “Your first
  medallion.” (480); p “You started.” (525). Primary **“Continue”** bottom 48.
* **Change:** everything visual; copy restructured: title/body → **eyebrow “Veni” + h1 “Your first
  medallion.” + p “You started.”** (welcome.tsx:310 passes `title="Veni" body="Your first medallion. You
  started."` — change the API to `{eyebrow, title, body}`); CTA “Take it” → “Continue”; close cross removed.

---

## 3. App screens/states in this area that no frame draws

| state | how it is reached | closest analog |
|---|---|---|
| Start Here / Step 1 / Step 2 / Your Plan after **Choose another** (D054 boards: “Keep one door open tonight.”, “Pick the hour you stop tonight.”, “Leave the room instead of lying there.”) | Start Here › Choose another | the same four frames — same layout, charger/door heroes unchanged, only strings swap |
| Where We’d Start with other signals / one or two chips / no name | different `13 · When` answers | Where We’d Start (chips wrap naturally) |
| Enlisting Aegis intermediate states (if the rows animate) | first 6.8 s | Enlisting Aegis `planRow` todo/now/done |
| Starting Score at the app’s own rating (Q1) | always | Starting Score with the gauge recomputed |
| Cost By Age 80 at other ages | `04 · Age` | same frame, number changes |
| What You Want Back with 0–2 or other `affects` picks (if Q5 adopted) | `17 · What it affects` | same frame, fewer/other pills; text below reflows (stack) |
| **Twelve Weeks / Campaign Map** (`reading`, 3 pages) | after Want Back today | withdrawn — recommend removal (Q4); if kept, nearest analog is Your Plan’s card list |
| Letter Week XII scrolled / without a name / on a short screen | – | Letter Week XII |
| The Vow without a name | – | The Vow |
| `/letter?variant=week12` arrival + read | Settings › Your letter, `/(app)/all` | Letter Received / Letter Week XII (letters group owns the route) |
| `/medallion-post` arrival | ridden-out urge post | Medallion Received (letters group owns) |
| every tail board at 375×667 and 390×844 | device | see §5 |

---

## 4. Data and generated content

* `src/content/onboardingTail.ts` is GENERATED by `scripts/vicifull/gen-tail.mjs` (reads `.vicifull/scenes`).
  Fork to `scripts/overhaul/gen-tail.mjs` reading `.overhaul/scenes/Email-Login.json` and emit:
  * `COST_30: boolean[30]` — true at **2, 6, 9, 13, 16, 20, 23, 27, 29** (frame circles with `fill="#0D0D0D"`).
  * `COST_365: boolean[365]` — `r="4.4"` circles in document order (25 across), 110 true.
  * `AGE_80_FIELD: boolean[2343]` (33×71, `r="2.6"` true, 720 true) — or generate at runtime (below).
  * drop `AGE_80_STARS`, `SCORE_RING`, `SCORE_CURVE`; `SCORE_SAMPLE` becomes `{ score: 842 }`.
  * **Both dot fields are exactly the designer’s generator** (`Vici Overhaul/project/gen/mono-onboarding.js`
    lines ~308–317), verified by `scratch-tail/lcg-check.mjs` (both `match true`):
    `rnd = () => (seed = (seed*9301+49297) % 233280) / 233280`; 365: `seed=7`, 25 cols, dark iff
    `dark < 110 && rnd() < 0.31`; Age 80: `seed=3`, rows 0…70 × cols 0…32, bright iff `rnd() < 0.3`.
    Runtime generation is an option and lets the Age-80 field extend on taller screens.
* `src/content/weekXiiLetter.ts` — GENERATED by `scripts/uifinal1/gen-letter.mjs`; fork to `scripts/overhaul/`
  pointing at `Letter-Week-XII.html`; output 4 paragraphs with the one bold run (§2.17).
* The gauge (Starting Score) needs no data: it is a function of the score (§2.7).

## 5. Small screens (375×667, 390×844)

Every board hangs its copy from the top and its buttons from the bottom. At 852 they clear; at 667 the primary
top is 561 (bottom 48) or 513 (bottom 96). Content bottoms on the canvas vs those lines:

| frame | last content bottom | collides at 667? |
|---|---|---|
| Enlisting Aegis | 572 (no button) | no |
| Where We’d Start | 704 | **yes** (CTA 561) |
| Start Here | 583 | **yes** (CTA 513) |
| Step 1 / Step 2 | 524 / 557 | no / barely (4pt) |
| Your Plan | 663 | **yes** |
| Starting Score | 604 | **yes** |
| Cost Next 30 | 675 | **yes** |
| Cost Next 365 | 612 | **yes** |
| Cost By Age 80 | 248 (field is full-bleed) | no |
| Line ×2 | chart axis 625, svg 659 | **yes** |
| A Clean Day | 526 | no |
| One Bad Day | 589 | **yes** |
| What You Want Back | 638 | **yes** |
| Letter Received | 526 | **yes** (13pt, CTA 513) |
| Letter Week XII | 656 | **yes** (needs scroll) |
| The Vow | 603 | **yes** (CTA 513) |
| Medallion Received | 549 | no |

The previous run never solved this (D139 records only that both anchoring styles match at 852). It needs a
kit-level policy from the orchestrator (Q12): e.g. a frame body that is laid out at canvas tops when the
screen is ≥ 852 tall and, when shorter, either lifts the hero+stack by `(852 − H)` clamped to the free space
above the hero, or scrolls the region between the nav and the button zone.

## 6. Capture recipes / drives to update (`.overhaul/drives/`)

* `tail-walk.js` — needles/taps that change: Start Here tap `'I can do that'` → `'Continue'`; `TAIL` table:
  `'YOUR VICI RATING'` → `'Your VICI rating'`; replace `change-line` with
  `['line-nothing','The line keeps climbing','Next']` and `['line-plan','With the plan.','Continue']`;
  want-back CTA `'See the twelve weeks'` → `'Continue'`; add `['aegis','Putting your plan together…',null]`
  so Aegis can be captured inside its 6.8 s. If Q5 is adopted, the `What does it affect most?` board must tap
  Focus, Sleep, Confidence.
* `f-plan-walk.js` — Start Here tap `'I can do that'` → `'Continue'`.
* `handover-walk.js` — remove the `'Start with today'` tap and the three map pages (`waitFor('The next twelve
  weeks')`, `map1…3`); add the two Line boards (`Next`, `Continue`); `'See the twelve weeks'` → `'Continue'`;
  `'Open it'` → `'Open'`; `'I sign it'` → `'Sign'`; `'Take it'` → `'Continue'`.
* Seeds: `.overhaul/tail-session-seed.js` (tail), `.overhaul/f-plan-user.js` (plan), `.overhaul/f-funnel-user.js`
  / `.overhaul/letters-onb-seed.js` (handover), clock freeze `.overhaul/r-handover-vowdate.mjs` (The Vow date).

---

## 7. Files

**Owned (rewrite):** `src/components/onboarding/tail.tsx`, `src/components/onboarding/plan.tsx`,
the four tail components in `src/components/onboarding/handover.tsx` (`O3LetterArrived`, `O3LetterRead` +
`LetterMark`, `O3TheVow`, `O3MedallionEarned`), `src/content/onboardingTail.ts` (+ `scripts/overhaul/gen-tail.mjs`),
`src/content/weekXiiLetter.ts` (+ `scripts/overhaul/gen-letter.mjs`), the tail portion of
`src/app/(onboarding)/welcome.tsx` (STEPS 89–112, WHOLE_FRAME, the `body` switch cases, `vowDate`).

**Shared (conflict risk):**
* `src/app/(onboarding)/welcome.tsx` — also edited by auth-funnel (funnel steps, O3Shell) and paywall-reminders
  (reminders/paywall/day-zero cases).
* `src/components/onboarding/handover.tsx` — also holds `O3Reminders` and `O3DayZero` (paywall-reminders).
  Suggest the orchestrator split the file before parallel work (e.g. move those two to
  `src/components/onboarding/reminders.tsx`), or serialise the two groups’ edits.
* `src/app/letter.tsx` (letters group) imports `O3LetterRead` and `WEEK_XII_LETTER`; both APIs change; its
  `ARRIVAL.week12` should become this group’s Letter Received.
* `src/components/onboarding/v3.tsx` — `buildWeekXiiLetter` (wraps `WEEK_XII_LETTER`), `O3Reading` (campaign
  map, Q4), `windowFor`; `src/components/onboarding/art.tsx` (Campaign* helpers become dead if Q4 removes the map).
* `src/content/onboardingFunnel.ts` — `FUNNEL_GLYPHS` (plan.tsx depends on it, §2.2).
* `src/components/mono/*` (orchestrator) — kit needed: Frame (+dark variant: bg #111111, noise-dark 0.09,
  origin-anchored noise), Nav (back/title/close/empty; chevron colour override for Age 80), H1 (26/33 and
  40/46), P (sub and ink variants, inline bold runs), Caps, Stack, Primary (bottom 48/96, dark-frame white
  variant), Ghost, Hero (svgWrap 393×240 with scale/origin, absolute-positioned `<Svg>`), a “cut stroke”
  helper for `paint-order="stroke"`, check / chevronL / closeX icons, Card (Your Plan row). Bespoke to this
  group: signal pill (44/22/15-700), Starting-Score gauge, dot grids, line chart, week strip, calendar,
  envelope, medal, charger, door.
* `src/app/(onboarding)/_layout.tsx` — `<StatusBar style="dark" />` under a comment that says “light
  status-bar glyphs”; on the new #0D0D0D ground the glyphs must be light (`style="light"`). Owner: auth-funnel
  or orchestrator.

---

## 8. Open questions

* **Q1 Starting Score (frame `Starting-Score`)** — the frame prints **842 of 1,000** on a 0…1,000 gauge. The
  app opens every account at `SCORE_BASE` 1,000 and Score Detail frames rank 1,000 → 1,500 (1,240 shown).
  D017/D050 had the app show its own rating; under that reading the gauge renders 1,000 of 1,000 with all 49
  ticks filled and the marker at the right end — legal arithmetic but reads as “maxed”. Showing 842 literally
  contradicts Today/Score Detail one screen later. Needs a D2xx decision; until then the gauge should be
  parametric (`filled iff i/48 ≤ min(score,1000)/1000`).
* **Q2 Cost Next 30** — the key says Relapse = `#0D0D0D` + `#F2F0EC` ring, Clean day = `#1E1E1E` + `#5A574F`
  ring; the grid draws no cell in the Clean-day style — 9 cells `#0D0D0D`/1.6 and 21 cells `#111111`/1.8, all
  ringed `#F2F0EC`, which look identical (the dark port of the generator’s light `CARD/ART` vs filled-`INK`
  pair went wrong). Recommend reproducing the frame literally (it is what pxdiff compares) and recording it.
* **Q3 Cost By Age 80** — Back chevron is `#17160F` on `#111111` (invisible). Reproduce the colour, keep the
  36×40 tap target working.
* **Q4** — the Twelve Weeks campaign map has no frame in this drop and the flow skips badges 35–37; remove the
  `reading` step (and the `CHROME`/`NOBAR` entries) or keep it restyled?
* **Q5 What You Want Back** — read back his `affects` answers (frame’s trio = the trio selected on
  `What-it-affects.html`) or keep the fixed trio (D051)? Recommend reading back, fallback to the trio.
* **Q6 Where We’d Start** — keep `planSignals`’ top-up-to-three now that chips wrap freely? (The designer’s own
  sample answers on `V3-Q5` — Late at night, When I can’t sleep, When I’m home alone, While scrolling — would
  give “Late at night · Can’t sleep · Home alone” under the current rule, not the frame’s three; the recipe’s
  two-answer walk does give the frame’s three.)
* **Q7 Line boards** — “5× a week” / “2× a week” / “3 MONTHS” and both curves are literals; keep fixed (they are
  illustrations, like D054’s artwork) rather than derive from `07 · Frequency`.
* **Q8 Letter** — the twelve-paragraph letter (and its shore illustration) is retired for four paragraphs; the
  journal entry `finish()` writes should carry the new text. Confirm nothing else must keep the long letter.
* **Q9 Enlisting Aegis** — static (frame state for the full 6.8 s) or animated rows/arc? Animation makes the
  capture time-dependent.
* **Q10** — Medallion Received and Letter Received drop their close crosses; the remaining controls already do
  the same thing, so nothing is lost. Confirm.
* **Q11** — `Line With the Plan` CTA: frame “Continue” vs generator “Start with today” → frame wins.
* **Q12** — small-screen policy (§5) is kit-level.
* **Q13** — `Your Plan` row-5 icon is now a bolt; keep D055 (icons per row, not per answer).
* **Q14** — Letter Week XII eyebrow with no name: suggest “Week XII, from you” (salutation keeps “Friend —”).
