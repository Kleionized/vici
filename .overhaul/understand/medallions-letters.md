# Group `medallions-letters` — the album, the two medallion boards, the ladders, the post (27 frames)

Analysis only (nothing under `src/` was touched). Every number below is the frame's own
(`node scripts/overhaul/body.mjs`), cross-checked against the design layout signatures
`.overhaul/sig/d-Email-Login-<Frame>.txt` and the PNGs in `.overhaul/shots/design/Email-Login/`.
Canvas y is quoted unless a line says "app y"; the app subtracts 54 for anything hung from the top
(D009) and measures `bottom:` offsets off the screen edge (D026).

Scratch: `.overhaul/understand/scratch-medallions-letters/`
* `<Frame>.txt` — the full `body.mjs` dump of all 27 frames;
* `<Frame>.c.txt` — the same with each 40-dot coin rim collapsed to one line (`<circle>×40 …`);
* `glyphs.txt` — the twelve face glyphs exactly as the three album frames draw them (earned and
  unearned variants), which is the source table for the new coin component (§1.2).

---

## 0. What changed, in one paragraph per family

**Album (`Medallions`, `Medallions Still To Earn`, `Album Earned II`).** Paper board → dark kit board.
The 2-column white cards with the gradient "struck" coin, the low sun, the triple rim, the page marks
and the earned-fraction rail are all gone. New: kit `titleHead` (back chevron + 32/700 "Medallions"),
kit `segmented` (`Earned` / `Still to earn`), a centred count line, and a **3-column grid of bare
cells** (64pt face coin + name + state line), **six per page**: `Album Earned II` redraws the grid
from the same origin (288) with faces 7–10, and `Medallions` leaves the space where row 3 would sit
(578–687, fully above the bar at 748) empty — so this is a pager, not the D102 scroll (§2.1, Q1).
Kit tab bar with **Journey** active.

**Medallion boards (`Breakwater *` ×5, `Detail *` ×5).** The metal-skinned boards (bronze/silver/gold
washes, platinum night board, glow lights, the 150pt struck coin, the pill, the quote card, the
"Back to medallions" quiet link) are all gone. Every board is the same dark frame: nav (back chevron
+ **share icon**), a **168pt face coin** that is identical on every tier except its Roman numeral,
centred h1/p/caps, a **five-node tier track** (kit `medal(i,30)` nodes on a 2px rail, filled to the
current rung), an **italic quote** (renders Lato 700 italic — the italic trap), and one primary
(`Share this`; `Back to medallions` on the unearned board). The `Detail *` frames are no longer
stale: Bronze…Platinum now state Tiers Vici's own ladder (`Tier II, ×25` … `Tier V, ×1,000`), so
D057/D101's content divergence shrinks to `Detail Paper` alone (§2.3).

**Ladders (`Tiers *` ×9).** Rebuilt from a reference list (five white rows) into a **state page**
that reads account data: the same board as the detail (coin, h1, blurb, caps, track — now with the
threshold under each metal and a **fractional fill**), then a big count (`Day 13` / `×23`) and a
"to next tier" line, and `Back to medallions`. `Tiers One-offs` becomes a 2×2 grid of 84pt coins
with requirement + date, and now reads account data too (dates, "Not yet").

**The post (`Letter Arrival`, `Letter Read`, `Medallion Letter`, `Yearly Drop`, `Drop Received`).**
Paper field, washes, wax seal, the sheet with a grabber, the lamp, the year tile — all gone. The
arrival is a kit hero board (the `H.envelope` illustration, caps/h1/p, primary + ghost); the letter
is a **#1E1E1E card on a #121212 frame** with a kit nav title and a bottom fade; the drop is a kit
price card; the drop received is the kit platinum `medal(4,176,'V')`. Several CTA strings change.

---

## 1. Shared vocabulary for this group

Palette (kit, `src/lib/theme.ts` `mono`): ground `#0D0D0D`, card `#1E1E1E`, line `#2E2E2E`,
art `#5A574F`, ink/text `#F2F0EC`, sub `#B5B0A8`, mute `#9B968E`, on-ink `#111111`. Group-only
greys: `#141414` (unearned coin field), `#3A3833` (unearned coin dashed rim), `#2A2926` (unearned
coin inner ring), `#121212` (the two letter frames' ground), `#111111` (letter fade end).

### 1.1 Kit pieces (from `Vici Overhaul/project/gen/mono-kit.js`, confirmed in the frames)

* **frame** — 393×852, bg `#0D0D0D` (letters: `#121212`), `noise.png` (96×96 tile,
  `assets/images/noise.png`) repeated at **opacity 0.05**, first child, anchored at the screen
  origin. (The kit file says `noise-dark.png` 0.06; every frame in this group says `noise.png` 0.05 —
  frame wins.)
* **nav / backRow** — `top:60 height:40 padding:0 22 space-between align-center z5`. Slots 36×40
  (80×40 when one side carries `rightText`). `chevronL`: svg 12×20 `M10 2L2 10l8 8` stroke `#F2F0EC`
  2.2 round/round → x 22–34, y 70–90. `closeX`: svg 18×18 `M2 2l14 14M16 2L2 16` stroke `#F2F0EC` 2
  round → x 353–371, y 71–89. **`shareIcon`**: svg 18×18
  `M9 11V2M5.5 5.5L9 2l3.5 3.5M4 9v5.5A1.5 1.5 0 0 0 5.5 16h7a1.5 1.5 0 0 0 1.5-1.5V9` stroke
  `#F2F0EC` 1.8 round/round, in a right slot `justify-content:flex-end` → svg at 353,71. Nav title:
  `13/700 #9B968E nowrap`, centred by `space-between` (From VICI at 166.9,72 59.2×16; Enclosure from
  VICI at 138.2,72 116.6×16). `rightText`: `15/700 #F2F0EC` (Restore, box 291,60 80×40).
* **titleHead** (album, One-offs) — backRow + `left:24 right:24 top:108` h1 **32/700 ls −0.6 lh 38
  `#F2F0EC`** `text-wrap:balance`.
* **h1** — `700 ls −0.6 #F2F0EC balance`; sizes used here: 32/38 (boards, album), 30/36 (Letter
  Arrival, Yearly Drop, Drop Received), 26/33 (Letter Received — tail).
* **p** — `15/400 #B5B0A8 pretty`; lh 22 on the boards/One-offs, lh 24 on the post.
* **caps** — `13/700 nowrap`, mixed case, `#9B968E` (or `#5A574F` when the face is unearned).
* **primary** — `left:24 right:24 bottom:B h58 r29 bg #F2F0EC`, label `16/700 ls 0.1 #111111 nowrap`
  (19 tall at y top+19.5). `B=48` (top 746) alone, `B=96` (top 698) over a ghost.
* **ghost** — `left:0 right:0 bottom:60`, centred `15/400 #9B968E`, box 0,774 393×18, full width is the
  tap target.
* **segmented** — `h44 r22 bg #1E1E1E padding 4 flex`; halves `flex:1 h36 r18`, `13/700 nowrap`
  centred; selected `bg #F2F0EC color #111111` (kit says `#FFFFFF` text — frame wins), unselected
  `transparent #9B968E`. Halves at x 20 / 196.5, 176.5 wide.
* **card** — `r24 bg #1E1E1E padding …`.
* **tabBar('Journey')** — `bottom:0 h104 padding 14 14 0 space-between`, **no background**; Today/Log/
  Library/Journey items 72 wide, icon 26 + gap 4 + label 11.5 (700 `#F2F0EC` active / 400 `#9B968E`);
  SOS disc 60 `#F2F0EC` `margin-top:-6` label 13/700 `#111111`. Owned by whoever owns the tab bar
  (§7) — this group only needs `/milestones` to light **Journey**.
* **medal(tier, size, glyph)** — the kit's tier medal (§1.3). Used as the track nodes (30) and as the
  Drop Received hero (176).
* **H.envelope** hero (Letter Arrival; also tail's Letter Received) — `<svg 393×240 viewBox 0 0 393 240
  style="position:absolute;left:0;top:190;overflow:visible;transform:scale(1.1);transform-origin:196px
  190px">`: `ellipse 197,206 rx66 ry3.96 #3A3835`; `<g rotate(-5 197 146)>`: `rect 122,102 150×88 rx8
  #F2F0EC`; flap `M132 112 L197 158 L262 112` stroke `#0D0D0D` 3.4 round/round; folds
  `M132 180 L176 146 M262 180 L218 146` stroke `#0D0D0D` 2.2 round/round; seal `circle 197,158 r10
  #F2F0EC` + `circle 197,158 r6 fill none stroke #0D0D0D 1.8 linejoin round`. RN: `<Svg 393×240
  style={{position:'absolute',left:0,top:136}}><G transform="translate(196 190) scale(1.1)
  translate(-196 -190)">…` (BRIEF SVG traps). Should be one shared component with tail (§7).

### 1.2 Bespoke: the **face coin** (replaces `KKMedallion` entirely)

One SVG, `viewBox="0 0 64 64"`, drawn at **44** (Medallion Letter enclosure), **64** (album),
**84** (One-offs), **168** (boards and ladders). Four states:

| state | where drawn | field | rim | glyph | numeral | svg opacity |
|---|---|---|---|---|---|---|
| **earned, tiered** | album, boards, ladders, letter | `circle 32,32 r30 #F2F0EC` | 40 dots + ring (below) | `#0D0D0D`, wrapped in `<g transform="translate(0 -2.6)">` | yes | 1 |
| **earned, one-off** | album, One-offs | same | same | `#0D0D0D`, **no** translate | **no** | 1 |
| **unearned, one-off** | album (Return), One-offs (Return) | same as earned one-off | same | same | no | **0.32** (on the `<svg>`) |
| **unearned, tiered — small** | album Still to earn (Archive, 64) | `circle r30 fill #141414 stroke #3A3833 1.6 dasharray "2.6 3.4"` | `circle r25.5 fill none stroke #2A2926 1` (no dots) | `#5A574F`, in translate(0 −2.6) | yes, `#5A574F`, the target tier "I" | 1 |
| **unearned, tiered — 168** | Detail Paper (Vici), Tiers Archive | same field + ring as the row above | same | `#5A574F`, **no** translate | **no** | 1 |

(The rule that explains every frame: the glyph is lifted 2.6 **iff** a numeral is drawn under it.)

* **Dots** — `<g fill="#0D0D0D" fill-opacity="0.3">` of 40 `circle r0.7` at radius 28.1 about 32,32,
  starting at angle 0 (60.1, 32) and stepping +9° clockwise (y grows): `cx = +(32 + 28.1·cos(i·9°))
  .toFixed(2)`, `cy = +(32 + 28.1·sin(i·9°)).toFixed(2)` reproduces every printed value (59.75/36.4,
  58.72/40.68 …).
* **Ring** — `circle r25.5 fill none stroke #0D0D0D 1.1 stroke-opacity 0.5`.
* **Numeral** — `<text x=32 y=53.2 text-anchor=middle font-size=6.4 font-weight=900
  letter-spacing=0.6 fill=#0D0D0D>` Roman of the standing (I…V). In RN: `fontFamily="Lato_900Black"`
  (theme `LATO.black`), **no** `fontWeight`.
* **The twelve glyphs** (verbatim in `scratch…/glyphs.txt`; strokes are `#0D0D0D` earned / `#5A574F`
  unearned-tiered):
  * **Veni** (one-off) — `M23 42V31a9 9 0 0 1 18 0v11` none, 2.6 round/round; `M19 42h26` 2.6 round.
  * **First light** (one-off) — `M24.5 39a7.5 7.5 0 0 1 15 0z` fill; five rays 2.4 round:
    `M22.13 35.41L18.37 34.04`, `M25.98 30.4L23.68 27.12`, `M32 28.5L32 24.5`,
    `M38.02 30.4L40.32 27.12`, `M41.87 35.41L45.63 34.04`; `M17 39h30` 2.4 round.
  * **Vidi** — eye `M17 32c4-6.5 9-9.5 15-9.5s11 3 15 9.5c-4 6.5-9 9.5-15 9.5s-11-3-15-9.5z` none
    2.4 linejoin round; pupil `circle 32,32 r4.6` fill.
  * **Vici** — crown `M20 40l-1.5-14 7.5 6 6-9 6 9 7.5-6L44 40z` fill + stroke 1.6 linejoin round;
    `M20 44h24` 2.4 round.
  * **Breakwater** — `rect 39.5,22 6.5×21 rx1` fill; waves `M17 29c2.5-3 5.5-3 8 0s5.5 3 8 0` and
    `M17 36.5c2.5-3 5.5-3 8 0s5.5 3 8 0` none 2.4 round; `M17 44h29` 2.4 round.
  * **Rebound** — `M19.5 22Q27 56 37 30.5` none 2.4 round **dasharray "0 4.4"** (a dotted arc of round
    caps); ball `circle 41,25 r4.2` fill; `M17 43.5h30` 2.4 round.
  * **Logbook** — `rect 21.5,20 21×25 rx2.5` none 2.4; `M26.5 27h11M26.5 32.5h11M26.5 38h7` 2.4 round.
  * **Pulse** — `M15.5 33h7.5l3-7.5 5 15 4.5-18 3 10.5h10` none 2.6 round/round.
  * **Black Box** (one-off) — handle `M27.5 25v-3a1.5 1.5 0 0 1 1.5-1.5h6a1.5 1.5 0 0 1 1.5 1.5v3` none
    2.4; `rect 19.5,25 25×18.5 rx2.6` fill; `M23.5 31.5h17M23.5 36.5h17` stroke **`#F2F0EC`** 1.8 round.
  * **Lessons** — `M32 25.5c-3.5-2.6-8-3.4-14-3v18.5c6-.4 10.5.4 14 3 3.5-2.6 8-3.4 14-3V22.5c-6-.4-10.5.4-14 3z`
    none 2.4 linejoin round; spine `M32 25.5v18` 2.2 (butt).
  * **Archive** — lid `rect 18,21.5 28×6.5 rx1.6` none 2.4; box
    `M20.5 28v13.5a1.5 1.5 0 0 0 1.5 1.5h20a1.5 1.5 0 0 0 1.5-1.5V28` none 2.4 linejoin round;
    handle `M28.5 34h7` 2.4 round.
  * **Return** (one-off) — `M40.6 25.98A10.5 10.5 0 1 1 27.56 22.48` none 2.6 round; arrowhead
    `M31.37 20.71L25.14 19.19L28.53 26.44z` fill + stroke 1.2 linejoin round; `circle 32,32 r2.6` fill.

### 1.3 Bespoke: the **tier medal** (kit `medal()`)

`s = size, c = s/2`, `ground #0D0D0D`, `ink #F2F0EC`:
* tier 0 Paper — `circle c,c r(c−2) fill #0D0D0D stroke #F2F0EC 2 dasharray none`; **unearned
  first node**: stroke **`#5A574F`**, dasharray **"3 6"**, *not* opacity-dimmed.
* tier 1 Bronze — `circle r(c−2) fill #0D0D0D stroke #F2F0EC 2.5` + `circle r(c·0.72) fill none
  stroke #F2F0EC 1.5 dasharray "2 4"`.
* tier 2 Silver — `r(c−2) stroke 3` + `r(c·0.72) none stroke 2`.
* tier 3 Gold — `r(c−2) fill #F2F0EC` + `r(c·0.74) none stroke #0D0D0D 1.6`.
* tier 4 Platinum — `r(c·0.82) fill #F2F0EC` + 16 ticks `M(c+cos a·0.9c) (…) L(c+cos a·(c−1)) (…)`
  (a = i/16·2π, coordinates `toFixed(1)`) stroke `#F2F0EC` width `(s·0.04).toFixed(1)` round +
  `r(c·0.66) none stroke #0D0D0D 1.6`.
* glyph (Drop Received only): `<text x=c y=c+round(s·.34)·.36 middle font-size=round(s·.34) 700>`
  fill `#0D0D0D` on tiers ≥3.
* dimmed (not reached, tiers 1–4): `opacity:0.32` on the `<svg>`.
* At 30 the printed radii are 13 / 10.8 / 11.1 / 12.3 / 9.9, ticks 13.5→14 width 1.2; at 176: 72.16,
  ticks 79.2→87 width 7.0, ring 58.08, "V" 60px at y 109.6.

### 1.4 Bespoke: the **tier track** (boards + ladders)

Container `position:absolute left:24 right:24 top:T+338`, column gap 10:
1. `position:relative height:30`:
   * rail `position:absolute left:10% right:10% top:14 h2 #2E2E2E` (x 58.5, w 276);
   * fill `position:absolute left:10% width:P% top:14 h2 #F2F0EC` — **omitted when P = 0** (Paper and
     unearned frames draw no fill element);
   * `position:absolute inset:0 display:flex` of five `flex:1 justify-content:center` cells (69 wide;
     node centres x 58.5 / 127.5 / 196.5 / 265.5 / 334.5), each a **30×30 disc `border-radius:50%
     bg #0D0D0D`** (it masks the rail) holding `medal(i,30)`.
2. labels: `display:flex` of five `flex:1 column center gap:3`: name `13/700` (`#F2F0EC` if reached,
   else `#9B968E`; h16) and — **ladders only** — threshold `12/700 nowrap` (`#B5B0A8` if reached, else
   `#5A574F`; h15). Labels top T+378; thresholds T+397.

Reached = `i < standing` (standing 0 = unearned). Node 0 unreached is the dashed `#5A574F` ring;
nodes 1–4 unreached are their own medal at 0.32.

**Fill P:**
* boards: `P = (standing − 1) × 20` → Paper none, Bronze 20, Silver 40, Gold 60, Platinum 80.
* ladders: `P = ((standing − 1) + frac) × 20`, `frac = (count − step[standing−1]) / (step[standing] −
  step[standing−1])`, printed `toFixed(1)`; standing 5 → 80; standing 0 → no fill. Verified on all
  eight: Vidi (13−7)/23 → 5.2, Vici (23−5)/20 → 18.0, Rebound 1/9 → 2.2, Breakwater 2/4 → 10.0,
  Logbook 1+1/50 → 20.4, Pulse 14/20 → 14.0, Lessons 7/20 → 7.0, Archive none.

### 1.5 Bespoke: the **board** (Breakwater/Detail/Tiers share one layout)

All offsets from an anchor **T** (canvas y of the coin's top):

| piece | canvas y | spec |
|---|---|---|
| coin | T | `left:0 right:0 top:T flex center` → 168×168 face coin at x 112.5 |
| text stack | T+196 | `left:24 right:24 column center gap:8`: h1 32/700 ls −0.6 lh 38 centred balance (h 38); p 15/400 lh 22 `#B5B0A8` centred pretty; **4px spacer div**; caps 13/700 nowrap centred (h16) |
| track | T+338 | §1.4 (absolute — it does **not** follow the stack: a 2-line blurb leaves only 16 between caps and track) |
| quote (boards) | T+438 | `left:44 right:44` centred, `font-size:18 font-style:italic font-weight:400 lh 28 #F2F0EC pretty` — **renders Lato 700 italic** (signature says `18px/700i`; theme `sansItalic()`) |
| count block (ladders) | T+448 | `left:24 right:24 column center gap:6`: count **48/700 ls −1.7 lh 50** `#F2F0EC` nowrap (h50); next line 15/400 lh 22 `#9B968E` nowrap centred (h22) |
| primary | bottom 48 | `Share this` (earned boards) / `Back to medallions` (unearned board, all ladders) |

**T, measured on all 18 frames:**

| frames | T |
|---|---|
| Breakwater Paper/Bronze/Silver/Gold, Detail Bronze/Gold (2-line quote) | 170 |
| Detail Paper, Detail Silver (3-line quote) | 157 |
| Breakwater Platinum (2-line) | **171** |
| Detail Platinum (3-line) | **158** |
| all eight Tiers (count block instead of quote) | 155 |

It does not depend on the blurb's line count (Detail Bronze's 2-line blurb sits at 170 like
Breakwater's 1-line). Reproduces exactly with **`T = 196 − 13·quoteLines + (standing === 5 ? 1 : 0)`**
on the boards and **`T = 155`** on the ladders. The +1 on Platinum is unexplained (designer's centring
rounding) but holds on both Platinum frames — see Q4. App y = T − 54; quote line count needs
`onTextLayout` (or height/28).

---

## 2. Per frame

### 2.1 `88 · Medallions` — **Medallions.html**

* **Route/state:** `/milestones` (`src/app/(app)/milestones.tsx`, in the `(app)` tab group), segment
  Earned, page 1. Recipe `.overhaul/recipes/medallions.json` ("Medallions"): `--initseed=.overhaul/
  medallions-seed.js`, wait 2000. Seed must be rewritten (§8). Entry points: Edit Profile's
  "Medallions" row (`profile.tsx:156`, settings group), dashboard (`dashboard.tsx:132`), `/(app)/all`.
* **App today:** paper board `#F4F3F0`, back chevron `#55534E` at app (16,10), three page dots, title
  27/600 at app 60, translucent segmented (h38 r19, white selected pill with shadow), count 13/600 at
  176, an earned-fraction **rail** at 202, then a vertical ScrollView of 2-column white cards (168 tall,
  r16) with the 68pt `KKMedallion` in a triple rim, `paddingBottom 126` (D102).
* **Frame draws:**
  * backRow with chevronL (22,70); right slot empty.
  * h1 "Medallions" 32/700 ls −0.6 lh 38 at 24,108 (titleHead).
  * segmented `left:16 right:16 top:164` (§1.1), Earned selected.
  * count `left:0 right:0 top:238`, `13/700 lh 22 #9B968E` centred nowrap: **"10 of 12 earned"**.
  * grid `left:24 right:24 top:288; display:grid; grid-template-columns: 1fr 1fr 1fr; row-gap:36;
    column-gap:8` → cells 109.7 wide at x 24 / 141.7 / 259.3, rows at 288 / 433 (cell h 109).
    Cell: `column center text-center gap:10`: coin 64 (§1.2); text column gap 2: name **15/700 ls −0.2
    nowrap** (`#F2F0EC` earned / `#9B968E` unearned; h18), state **12/700 `#9B968E` nowrap** (h15).
  * Faces: Veni "Jun 9" · First light "Jun 9" · Vidi "Tier I, Day 7" · Vici "Tier I, ×5" ·
    Breakwater "Tier I, ×1" · Rebound "Tier I, ×1". **Nothing** below row 2 (578–748 empty).
  * kit tabBar, **Journey** active.
* **Change:** everything visual (dark frame + noise, kit nav/h1/segmented, centred count, 3-col
  bare cells, new coin, tab bar). **Removed:** page dots, rail, cards, triple rim, low sun, struck
  metals. **Structure:** the grid is **paged six at a time** (3×2), not one vertical scroll — §2.3/Q1.
  **Copy:** state line `Tier I · Day VII` → **`Tier I, Day 7`** (comma separator; Arabic day — D061
  is superseded), `Tier I · ×5` → `Tier I, ×5`; Veni `Day 0 · Jun 9` → **`Jun 9`**.
* **States:** segmented Earned/Still to earn; earned/unearned coins; ≤2 / 3–6 / 7–12 faces per segment
  (only 6, 4 and 2 drawn — Q2); loading (today `LoadingView` on paper).
* **Preserve:** live counts (COUNT/DATE logic, lines 97–147 today), segment switch resets the grid to
  page 1 (`show()`), card tap → `/medallions/${key}?tier=${metal|'none'}`, back → `router.back()` or
  `/(app)/today`, segment halves keep `accessibilityRole="tab"` (the recipe's driver relies on it),
  card `accessibilityLabel` "<name>. <state>".

### 2.2 `88B · Medallions — Still to earn` — **Medallions-Still-To-Earn.html**

* **Route/state:** `/milestones`, tap the "Still to earn" half (recipe: `__fire` the `[role=tab]`).
* **Frame draws:** same head; segmented with **Still to earn** selected; count **"2 still to earn"**.
  The two faces are **not** in the grid: `left:24 right:24 top:288; display:flex;
  justify-content:center; gap:48` — shrink-wrapped cells (Archive 76.6 wide at x 86.6; Return 95.3 at
  211.1).
  * **Archive** — unearned tiered small coin (§1.2 row 4: dashed `#141414` field, `#5A574F` glyph and
    numeral "I", lifted 2.6); name `#9B968E`; state "9 of 10 entries"; then a **progress bar**: `w56 h3
    r2 bg #2E2E2E` with a `h3 r2 #F2F0EC` fill at **90%** (= count/first step), at y 407 (cell gap 10).
  * **Return** — unearned one-off: the earned-look coin at `opacity:0.32`, no numeral; name `#9B968E`;
    state "After 7 days away"; **no bar**.
* **Change:** layout as above; the coin's sun on Return (D100) is gone with the sun itself; unearned
  tiered cards now carry the bar (one-offs don't).
* **States:** what the segment draws for 0, 1, 3+ faces is not drawn (Q2).

### 2.3 `88C · Medallions — Earned II` — **Album-Earned-II.html**

* **Route/state:** `/milestones`, Earned, **page 2**. Recipe today scrolls vertically to the end; with
  a horizontal pager it becomes `d=[...document.querySelectorAll('div')].find(x=>x.scrollWidth>
  x.clientWidth+8); d.scrollLeft=393`.
* **Frame draws:** identical head (count still "10 of 12 earned"), grid rows at **288 / 433** again:
  Logbook "Tier II, ×25" (numeral **II**), Pulse "Tier I, ×5", Black Box "Jul 20" (one-off: no
  numeral, no lift; its two bars are `#F2F0EC`), Lessons "Tier I, ×5".
* **Reading:** with D102's scroll the bottomed-out grid would need a 206pt bottom pad *and* page 1
  would show row 3 at 578 — which `Medallions` leaves empty. Six per page is the only reading that
  draws both frames. Recommend a horizontal `ScrollView pagingEnabled` (page width = screen width,
  each page a 3-col grid of ≤6 at the frame's own metrics), no page dots (none drawn). Q1.

### 2.4 `88D–88H · Breakwater — Paper … Platinum` — **Breakwater-{Paper,Bronze,Silver,Gold,Platinum}.html**

* **Route/state:** `/medallions/breakwater?tier=<paper|bronze|silver|gold|platinum>`
  (`src/app/medallions/[key].tsx`), no seed (reads face + metal off the route). From the album, a
  Breakwater card pushes its own metal.
* **App today:** five skins (paper/bronze/silver/gold light washes + glows, platinum dark board), 150pt
  struck coin with mount ring, 26/600 title, blurb, a tappable **pill** (state → opens the ladder,
  D060), a white quote card headed "What it says", black 56pt `Share this` pill with an icon, quiet
  "Back to medallions", page dots.
* **Frame draws (board, §1.5, T = 170; Platinum 171):** backRow chevronL + **shareIcon**; 168 coin
  Breakwater earned with numeral I/II/III/IV/V; h1 "Breakwater"; p **"An overwhelming urge that ended
  without a slip."** (lowercase *o*; 1 line); caps `Tier I, ×1` / `Tier II, ×5` / `Tier III, ×10` /
  `Tier IV, ×25` / `Tier V, ×50` (`#9B968E`); track names only, reached labels `#F2F0EC`, fill
  0/20/40/60/80%; quote (2 lines each):
  * Paper “The first wave broke against you, not over you.”
  * Bronze “Five storms met at full height. The wall is real now.”
  * Silver “Ten overwhelming urges, none of them decisive.”
  * Gold “Twenty-five. What used to flood you now only gets loud.”
  * Platinum “Fifty waves. The sea hasn’t changed. The wall did.”
  
  (= `KK_ALBUM.breakwater.stories`, unchanged). Primary **`Share this`** bottom 48. No ghost.
* **Change:** whole board rebuilt; skins/glows/`LinearGradient`/`Glowlight`/mount ring/page dots
  removed; the coin no longer changes per metal — only its numeral does; the pill becomes plain caps
  (`Tier I · ×1` → **`Tier I, ×1`**); the quote card (title + body) becomes one centred italic line
  with no heading ("What it says" is gone); "Back to medallions" ghost removed; share moves to the nav
  icon **and** the primary (icon in the pill removed). Blurb copy change (`Overwhelming` →
  `overwhelming`; the old D-comment about the capital is void).
* **Preserve:** Share (nav icon and primary both → `Share.share({message})`), back, the way into the
  ladder (the pill is gone — recommend the **track block** as the Pressable, Q5), `?tier=` contract,
  "Medallion not found" fallback.

### 2.5 `89A–89F · Vici Detail — Paper … Platinum` — **Detail-{Paper,Bronze,Silver,Gold,Platinum}.html**

* **Route/state:** `/medallions/vici?tier=none` (Paper = unearned), `?tier=bronze|silver|gold|platinum`.
* **Bronze…Platinum** — the Breakwater board for Vici: coin Vici (crown) numeral II…V; p **"Urges met
  and outlasted — the conquering half of the campaign."** (`face.long`, **2 lines**, break after
  "half of"); caps `Tier II, ×25` / `Tier III, ×100` / `Tier IV, ×250` / `Tier V, ×1,000`; fill
  20/40/60/80; quotes:
  * Bronze “Twenty-five behind you now — the pattern is unmistakable.” (2 lines, T 170)
  * Silver “A hundred waves met and outlasted. This stopped being a fight you were unsure of a while
    ago.” (3 lines, T 157)
  * Gold **“Two hundred and fifty. The sea keeps coming. You keep standing.”** (2 lines, T 170) —
    **copy change**: app's `vici.stories[3]` says "…Vici isn’t a moment anymore. It’s just what you do."
  * Platinum “A thousand. The sea hasn’t changed. You’re just not the one it moves anymore.” (3 lines,
    T 158)
  
  Primary `Share this`. These now agree with Tiers Vici's ladder, so **D057/D101's "stale Detail"
  divergence is resolved for these four** — the app's computed pill/quote will now match them.
* **Detail Paper (unearned)** — T **157**; coin = unearned tiered 168 (§1.2 row 5: dashed `#141414`
  field, crown fill+stroke `#5A574F`, **no numeral, no lift**); h1 "Vici"; same 2-line p; caps
  **"Not yet. First at ×1"** in **`#5A574F`**; track: node 0 dashed `#5A574F` (not dimmed), nodes 1–4
  at 0.32, all names `#9B968E`, no fill; quote “Nine minutes, start to finish. You watched it rise,
  crest, and leave without you.” (3 lines); primary **`Back to medallions`**; nav still carries the
  share icon.
* **Change vs app:** unearned pill `Not yet · first ×5` → caps `Not yet. First at ×N`; heading "What
  waits at tier one" and suffix "— waiting at ×N." removed; primary becomes Back to medallions.
* **Remaining content divergence (Q3):** the frame's `×1` and "Nine minutes…" contradict Tiers Vici
  (Paper ×5) and `vici.stories[0]` ("Five ridden. Each one shortens the next."). Recommend the app
  keep computing (`First at ×5`, stories[0]) as D057 did — this is the only board where words differ.
* **Preserve:** as §2.4. Vici's darker staff override (D059) is moot (the device is now a crown glyph
  in one colour).

### 2.6 `88I–88P · Tiers — <face>` — **Tiers-{Vidi,Vici,Rebound,Breakwater,Logbook,Pulse,Archive,Lessons}.html**

* **Route/state:** `/medallions/tiers/<key>` (`src/app/medallions/tiers/[key].tsx`). **Now needs a
  seed** (the page reads live counts); the old recipe's "No seed: the ladder reads no account data"
  is obsolete.
* **App today:** paper board, title 27/600, subtitle 13/600, five white 96pt rows (coin 64 struck in
  each metal + "Paper"/"Tier I · ×5"), no earned state, no CTA.
* **Frame draws (board, §1.5, T = 155):** backRow chevron, **no share**; 168 coin (earned w/ numeral,
  or unearned-168 for Archive); h1 name; p = `face.blurb` (1 line on all eight); caps
  `Tier <roman>, <rung>` or `Not yet. First at <rung>` (`#5A574F`); track **with thresholds** and
  **fractional fill** (§1.4); count block at T+448: big count and next line; primary **`Back to
  medallions`** bottom 48.

  | frame | blurb | caps | thresholds | count | next |
  |---|---|---|---|---|---|
  | Vidi | Days Vici was opened and something recorded. | Tier I, Day 7 | Day 7 · Day 30 · Day 90 · Day 180 · Day 365 | **Day 13** | **17 days to Bronze** |
  | Vici | Urge logs that did not end in a slip. | Tier I, ×5 | ×5 ×25 ×100 ×250 ×1,000 | ×23 | 2 more to Bronze |
  | Rebound | A check-in on the day after a slip. | Tier I, ×1 | ×1 ×10 ×25 ×50 ×100 | ×2 | 8 more to Bronze |
  | Breakwater | An overwhelming urge that ended without a slip. | Tier I, ×1 | ×1 ×5 ×10 ×25 ×50 | ×3 | 2 more to Bronze |
  | Logbook | Urge logs saved, whatever the outcome. | Tier II, ×25 (numeral II) | ×5 ×25 ×75 ×200 ×500 | ×26 | 49 more to Silver |
  | Pulse | Check-ins completed. | Tier I, ×5 | ×5 ×25 ×75 ×200 ×500 | ×19 | 6 more to Bronze |
  | Archive (unearned) | Journal entries saved. | Not yet. First at ×10 | ×10 ×50 ×100 ×200 ×365 | ×9 | 1 more to Paper |
  | Lessons | Lessons completed. | Tier I, ×5 | ×5 ×25 ×50 ×75 ×110 | ×12 | 13 more to Bronze |

  Rules: count = `Day N` for `unit:'day'`, else `×N` (`toLocaleString('en-US')`); next =
  `${step[next]−count} days to ${tierName[next]}` for days, `${…} more to ${tierName[next]}` otherwise,
  with next = Paper when unearned. Threshold labels use the rung text with Arabic days.
* **Change:** page is now a **state page** (D060's "reference page, no earned mark" is superseded);
  subtitle → centred blurb; rows → track; new count/next block and primary. Ladder rungs and blurbs
  match `KK_ALBUM` except Breakwater's lowercase *o*.
* **Preserve:** back; "Medallion not found" fallback; `once` key routing for One-offs.
* **Not drawn:** standing 5 (no next tier), `1 days` singular, a 2-line blurb on a narrow phone (§6, Q6).

### 2.7 `88Q · Tiers — One-offs` — **Tiers-One-offs.html**

* **Route/state:** `/medallions/tiers/once`. Needs the seed (dates).
* **Frame draws:** titleHead **"Earned once"**; p `left:24 right:24 top:160` 15/400 lh 22 `#B5B0A8`
  **"One tier. Kept for good."**; grid `left:32 right:32 top:240; 1fr 1fr; row-gap 44; column-gap 16`
  (cells 156.5 wide at x 32 / 204.5; rows 240 / 442; cell h 158): `column center gap:12`: coin **84**
  (earned one-off; Return at 0.32); text column gap 3: name **17/700 ls −0.2 nowrap** (`#F2F0EC` /
  `#9B968E` unearned; h21), requirement **13/400 lh 18 `#9B968E` nowrap**, date **12/700 `#B5B0A8`
  nowrap margin-top 2** (h15) — or **"Not yet"** in `#5A574F`.
  * Veni · Finished onboarding · Jun 9
  * First light · **The first check-in** · Jun 9
  * Black Box · **First slip logged** · Jul 20
  * Return · **Back after 7+ days away** · Not yet
  
  No CTA, no tab bar.
* **Change:** title same; subtitle `One tier only · platinum` → **`One tier. Kept for good.`**; rows →
  2×2 grid; requirement copy changes (`KK_ALBUM` blurbs: `The first completed check-in` → `The first
  check-in`; `First slip recorded in an urge log` → `First slip logged`; `A check-in after 7+ days
  away` → `Back after 7+ days away`); now reads dates/earned state (same DATE logic as the album).
* **Preserve:** back.

### 2.8 `90B · VICI Post — Arrival` — **Letter-Arrival.html**

* **Route/state:** `/letter` phase `arrive` (`src/app/letter.tsx`, `MailArrival`), seed
  `.overhaul/letters-seed.js`. Arrives the launch after a slip (`(app)/_layout.tsx` gate on
  `tideline.letter.pending`, set by slip/lapse/relapse/urge-log).
* **App today:** paper field, two washes, close X `#55534E`, envelope card + wax seal art, 24/500
  title at app 418, sub 15.5 at 468, black 56pt pill "Read it" bottom 108, "Tonight" bottom 70.
* **Frame draws:** nav: empty left slot, **closeX** right; hero `H.envelope` at top 190 (§1.1); stack
  `left:24 right:24 top:452 column center gap:18`: caps **"Week XII post"** (h16, 452), h1 **30/700 lh
  36** "The post is in." (486), p 15/400 lh 24 "A short letter from VICI — two minutes, worth
  keeping." (540, 2 lines, break after "minutes,"); primary **"Read"** bottom 96; ghost "Tonight"
  bottom 60.
* **Change:** all visual; CTA **"Read it" → "Read"**; new caps line (Q7: "Week XII" is the canvas's
  mock — recommend `Week ${roman(currentWeek)} post`); `MailArrival` is replaced by a kit "hero board"
  (hero + stack + primary/ghost + optional close) that Letter Received (tail) and the medallion-post
  arrival can share.
* **Preserve:** Read → read phase; Tonight → `later` (clears `tideline.letter.pending`, dismiss);
  close X → `later`. Route stack option `animation:'fade', gestureEnabled:false` (root `_layout.tsx`).

### 2.9 `39 · The Letter — Read` — **Letter-Read.html**

* **Route/state:** `/letter` → tap **Read** (recipe taps "Read it" today — update to "Read").
* **App today:** `MailSheet` (paper sheet from app y −2 with grabber + close), `LetterBody` ScrollView
  (left/right 34, top 84), salutation 22/600 ls 0.6, paragraphs 15.5 lh 1.8 `#3A3934`, the why-run
  underlined 500, sign-off 16/600 with a pen-stroke SVG, `KeepPill` "Tuck it into your Log" (with
  bookmark icon) bottom 88, "Close" bottom 44.
* **Frame draws:** frame bg **`#121212`** + noise 0.05; nav: empty left, title **"From VICI"**
  (13/700 `#9B968E`, 166.9,72), closeX right. Card `left:16 right:16 top:112 bottom:150 r26
  bg #1E1E1E overflow:hidden` (361×590); inner `padding:28 26 0; column gap:16` (text x 42, w 309):
  * "Dear Sam," **22/700 ls −0.3** `#F2F0EC` (line-height normal → h27, at 140);
  * ¶ 15.5/400 **lh 25** `#B5B0A8` pretty — "If you’re reading this, it happened. Good — you opened the
    letter instead of disappearing. That’s the only door that matters this morning." (183, **4 lines**:
    pretty moves "this morning." down — `AppText` applies `text-wrap:pretty` on web, D052);
  * ¶ "One slip is a wave, not the sea. Nothing since day zero is erased — the days stood, the urges
    outlasted, the reason you started: **I want to be present for the people I love.** All still
    yours." (299, 5 lines) — the why-run is a **700 `#F2F0EC` span**, no underline;
  * ¶ "The only slip that can end this is the one you answer with a second. So: water, daylight, one
    lesson. Don’t fail twice." (440, 3 lines);
  * ¶ "I’ll see you tonight, steadier." (531);
  * sign-off 15.5/**700** lh 25 `#F2F0EC` "— the you who makes it out" (572);
  * fade `position:absolute left:0 right:0 bottom:0 h70` `linear-gradient(180deg, rgba(30,30,30,0),
    #111111)` (632–702). Draw it with a transparent stop of the *end* colour
    (`['rgba(17,17,17,0)','#111111']`) — CSS interpolates premultiplied, a straight RN gradient from
    `rgba(30,30,30,0)` runs ~3/255 light mid-ramp (D048's rule).
  
  Primary **"Save to Log"** bottom 96; ghost **"Close"** bottom 60.
* **Change:** sheet/grabber/paper → frame + card; nav title new; type metrics (22/700 −0.3, 15.5/25,
  `#B5B0A8`); straight apostrophes → **curly** (`you’re`, `That’s`, `I’ll`) — the old D-comment
  "frame sets this paragraph with straight apostrophes" is void; underline → bold span; pen stroke
  removed; **"Tuck it into your Log" → "Save to Log"** (pill 58 tall, no icon); Close moves to bottom 60.
* **Preserve:** Save to Log → `keep` (LETTER_KEY kept, clear pending, one journal entry tag 'Letter'
  title 'Don’t fail twice' — update its body's apostrophes to match); Close and X → `later`; name
  fallback "friend"; why fallback; on short phones the card's column must scroll (the frame's card is
  `overflow:hidden` and the copy ends at 597 of 702 — at 667 tall it would clip). `week12` variant: see
  §6 (tail owns those frames).

### 2.10 `39B · Post — Medallion Letter` — **Medallion-Letter.html**

* **Route/state:** `/medallion-post` → tap the arrival's primary (today "Take it"). Seed
  `letters-seed.js`. Arrives the launch after a ridden-out urge was logged
  (`tideline.post.backondeck.pending`).
* **Frame draws:** the letter card of §2.9 with nav title **"Enclosure from VICI"** (138.2,72);
  "Dear Sam,"; ¶ "Last night an urge rose, crested, and left without you. This morning you opened the
  app anyway — logged it, stayed. Most men vanish for a week after a night like that. You came back."
  (183, 5 lines); ¶ "The return is the strongest predictor there is — stronger than any count. This one
  isn’t for resisting. It’s for coming back." (324, 3 lines); sign-off **"— VICI"** (415); **enclosure
  card** `margin-top:6` (→ 462) `flex row align-center gap:14 padding:14 16 r18 bg #0D0D0D` (309×72):
  face coin **44** earned **Rebound** numeral I (glyph lifted), text column gap 2: **"Rebound, Tier I"**
  15/700 `#F2F0EC` (h18, 116,480), "A check-in on the day after a slip." 13/400 `#9B968E` (h16, 500).
  Fade; primary **"Save to Log"**; ghost "Open the enclosure".
* **Change:** sheet → card; new nav title; new sign-off line; new enclosure card; apostrophes curly;
  "Tuck it into your Log" → **"Save to Log"**.
* **Q8:** the frame encloses **Rebound**; the app's post fires on a ridden-out urge and delivers the face
  that rule earns (**Vici**, F11 / the medallion-post docblock). Recommend the card stay data-driven
  (`<Name>, Tier <roman>` + `face.blurb`, standing ≥ 1) and name the divergence in a D2xx.
* **Preserve:** Save to Log → `keep` (POST_DONE + journal entry 'VICI Post · A medallion' — append the
  new "— VICI" line to its body), Open the enclosure → `router.push('/drop')`, X → `shelve`.

### 2.11 `39C · Post — The Yearly Drop` — **Yearly-Drop.html**

* **Route/state:** `/drop` phase `offer` (`src/app/drop.tsx`), seed `letters-seed.js`; reached from the
  medallion letter's "Open the enclosure" and `/(app)/all`.
* **App today:** `#FAF8F3` board, white 34pt close disc at left, "Restore" 15/400, 26/600 title, the
  dotted-arc **lamp** illustration, a white price card with SAVE 74% badge, three perk icons between
  hairlines, black 56pt "Unlock my year" with arrow at app 694, "Terms · Restore" 11.5 caption at 762.
* **Frame draws:** nav: **empty 80-wide left slot** (no close), `rightText` **"Restore"** 15/700
  `#F2F0EC` (80-wide right slot, flex-end). Stack `top:175 column center gap:12`: h1 30/700 lh 36
  "One decision.<br>A year of change." (explicit break; 2 lines, 175–247); p 15/400 lh 24 "Unlock
  everything VICI has to offer for an entire year." (259, 2 lines, break after "for an"). Stack
  `left:24 right:24 top:325`: card `r24 bg #1E1E1E padding:22 22 24` (345×285), column gap 18:
  * row `space-between center`: caps "Yearly access" (flexes to 226 wide, 353) + pill **"Save 74%"**
    `h28 r14 bg #F2F0EC padding 0 12` 12/700 `#111111` (75×28 at 272,347);
  * price row `align-items:baseline gap:10`: **"$26.99" 44/700 ls −1.6 lh 48** `#F2F0EC` (393);
    "/ year" 16/700 `#9B968E` nowrap; "$39.99" 16/700 `#5A574F` nowrap **line-through** (418);
  * "That’s $2.25 a month." **15/700** `#B5B0A8` (459);
  * perks row `gap:10 padding-top:16 border-top:1px solid #2E2E2E` (495): three `flex:1 column center
    gap:8` cells (93.7 wide): disc `32×32 r16 bg #F2F0EC` with `check` 13 (`M2 7.5l3.2 3L12 3.5`,
    stroke **#111111** 2.2 round/round), label **12/700 lh 17** `#B5B0A8` centred, 2 lines: "Full
    12-week / programme", "SOS support / anytime", "Track your / progress".
  
  Primary **"Unlock my year"** bottom 96 (no arrow); ghost **"Terms · Restore"** bottom 60.
* **Change:** board, lamp (removed entirely — `Lamp`, its blur filters, the arc), price card, perks
  (bespoke icons → kit check discs), pill (no arrow), footer (caption 11.5 → kit ghost 15/400 at
  774), close disc removed (Q9).
* **Preserve:** Unlock my year → `claim()` (purchase('yearly', DROP_OFFERING_ID), Alerts on
  error/unavailable, `updateSettings({yearlyDrop:true})`, → claimed); Restore → `restorePurchases()`
  (all three Alerts); `later` (DROP_SEEN + close) — needs a control (Q9); prices are constants today
  (`FULL_PRICE`/`DROP_PRICE`, add the monthly `$2.25`).

### 2.12 `39D · You Received a Drop` — **Drop-Received.html**

* **Route/state:** `/drop` → "Unlock my year" (mock purchase grants immediately — recipe).
* **Frame draws:** nav closeX right; hero `left:0 right:0 top:212 flex center`: kit
  **`medal(4, 176, 'V')`** (§1.3; svg at 108.5,212); stack `top:432 column center gap:18`: caps "The
  year" (432), h1 30/700 lh 36 "You received a drop." (466), p 15/400 lh 24 "One drop covers the year
  — twelve months of VICI, billed once." (520, 2 lines, break after "VICI,"); primary **"Continue"**
  bottom 96; ghost "See the receipt" bottom 60.
* **Change:** year tile (laurel image, `invert`/`brightness` filter, D137) → platinum tier medal;
  `MailArrival` → kit hero board; new caps line; **"Begin the year" → "Continue"**.
* **Preserve:** Continue → `close`; See the receipt → `router.replace('/subscription')`; X → `close`.

---

## 3. Data/model changes (`src/components/keepsakes/Medallion.tsx`)

* **Retire** `KKMedallion` and everything drawing it: `DISC`, `ACCENT`, `GROUND`, `KK_SCENES`, `SEAT`,
  `INNER`, `SUN`, `kkSun`, `KK_METALS` as a skin table (keep the five tier names). **Add** `FaceCoin`
  (§1.2), `TierMedal` (§1.3) and `TierTrack` (§1.4). One coin, one numeral — the metal is no longer
  painted.
* `KK_ALBUM` copy: `breakwater.blurb` → "An overwhelming urge that ended without a slip.";
  `firstlight.blurb` → "The first check-in"; `blackbox.blurb` → "First slip logged"; `return.blurb` →
  "Back after 7+ days away" (`ahead` stays "After 7 days away"); `vici.stories[3]` → "Two hundred and
  fifty. The sea keeps coming. You keep standing."
* `kkRung` defaults to **Arabic** (D061 superseded — album, caps, thresholds all read `Day 7`).
  Tier lines use `", "`: `Tier ${roman}, ${rung}`. Unearned caps: `Not yet. First at ${rung(step0)}`.
* **Extract the counting** (milestones.tsx lines 97–147: `recorded`, `rebounds`, `returned`, COUNT,
  DATE) into one hook (e.g. `useMedallionLedger()` in `src/components/keepsakes/` or `src/lib/`) so the
  album, the ladders, One-offs, the medallion letter's enclosure and (settings group) Edit Profile's
  "10 of 12" all read the same numbers. Add `frac`/`next` helpers for §1.4/§2.6.

---

## 4. Navigation (old → new)

| from | today | proposed |
|---|---|---|
| album card (tiered) | `/medallions/<key>?tier=<metal|none>` | same |
| album card (one-off) | same (pill reads "Earned once") | same board without the track (§6) |
| detail → ladder | the pill (D060) | **the track block** (nodes + names, 345×56 at T+338) as a Pressable, label "See every tier" (Q5) |
| one-off detail → One-offs | pill → `/medallions/tiers/once` | the caps line (date/"Not yet") as the Pressable |
| ladder "Back to medallions" | (none) | pop to `/milestones` (`router.dismissTo('/(app)/milestones')` if in stack, else navigate) |
| detail "Back to medallions" (unearned) | quiet link → back | primary → back |
| `/letter` arrive → read | "Read it" | "Read" |
| `/medallion-post` arrive → read | "Take it" | the arrival's primary (Q10) |
| medallion letter → drop | "Open the enclosure" → push `/drop` | same |
| drop claimed → | "Begin the year" → close | "Continue" → close |

---

## 5. Functionality to preserve (consolidated)

* Album: live COUNT/DATE derivation; segment switch (+ reset to page 1); card → detail with `?tier=`;
  back fallback to Today; loading state while 6 queries resolve.
* Detail: `?tier=` contract incl. `none`; Share (now 2 controls); the door to the ladder; back;
  not-found fallback.
* Ladder: `once` key; not-found fallback for unknown/one-off keys; back.
* `/letter`: two variants (`post`, `week12`); `later`/`keep`/`dismiss` side effects (storage keys
  `tideline.letter.day3`, `tideline.letter.pending`); journal entry once; name/why fallbacks; launch
  gate push from `(app)/_layout.tsx`; root Stack `fade`, gesture disabled.
* `/medallion-post`: `shelve` (POST_DONE) from the X; `keep` (POST_DONE + journal entry); push `/drop`;
  the face/standing read from events.
* `/drop`: purchase + restore flows with Alerts; DROP_SEEN; claimed phase; receipt → `/subscription`.
* `/mail`: inbox items (weekly reports newest first with verdicts, the medallion post re-read row when
  delivered, the sealed letter row with kept state), empty state.

---

## 6. App screens/states in this area that no frame draws

| state | how reached | closest analog |
|---|---|---|
| Album **Earned** with 1–2 faces (fresh account: Veni only) | new user | `Medallions` grid (or the centred row of Still to earn — Q2) |
| Album Earned with 7–9 / 11–12 faces; a 3rd page never happens (12 max → 2 pages) | data | `Album Earned II` |
| Album **Still to earn** with 3+ faces (fresh account: 11) | new user | `Medallions` 3-col pages (Q2) |
| Still to earn **empty** (all 12) | data | count line "0 still to earn", nothing below (no copy invented) |
| Album / detail / ladder **loading** | first paint | kit frame (ground + noise), nothing else, or `LoadingView` restyled dark |
| Detail for an **earned one-off** (Veni/First light/Black Box) | album | Breakwater board: coin w/o numeral (no lift), caps = date (`Jun 9`), **no track**, quote = `stories[0]`, `Share this` |
| Detail for an **unearned one-off** (Return) | album Still to earn | Detail Paper: coin = earned look at 0.32, caps "Not yet" `#5A574F`, no track, `Back to medallions` |
| Detail for unearned tiered faces other than Vici (Archive, …) | album | Detail Paper (Vici's blurb is `long`; others use `blurb`) |
| Detail with a 1-line or 4-line quote | other faces/tiers | T formula §1.5 (extrapolated) |
| Ladder at **standing 5** (no next tier) | data | Tiers board; count kept, next line omitted or "Every tier earned" (Q6) |
| Ladder next line with 1 left ("1 days to …") | data | singular "1 day to Bronze" (Q6) |
| Ladder **One-offs** with other earned states | data | Tiers One-offs (dates / "Not yet") |
| "Medallion not found" (unknown key) | bad link | kit frame + nav back + centred h1/p, `EmptyState` restyled |
| **`/mail` inbox** (list + empty) | dashboard "Your mail", `/(app)/all` | titleHead "Mail" (32/700 at 108) + kit `listRows`-style card as in `Log-Reports`/`Settings` (title 16/700 + sub 13 `#9B968E`, chevronR); empty: centred h1 26/33 + p |
| `/letter?variant=week12` arrival | Settings › Your letter, `/(app)/all` | **Letter Received** (tail): envelope hero, stack **451** gap 18, h1 **26/33** "A letter arrived.", p "From you, twelve weeks from now.", primary **"Open"** (was "Open it"), ghost "Save it for later", **no close X** |
| `/letter?variant=week12` read | → Open | **Letter Week XII** (tail's `O3LetterRead`, API changing to `{name,onClose,onContinue,onKeep}` — letter.tsx:130 must update) |
| `/medallion-post` arrival | ridden-out urge post | Medallion Received (tail) **or** Letter Arrival (Q10) |
| `/drop` store errors / restore results | Alerts | native `Alert` — no restyle possible |
| Share sheet | share icon / Share this | native |
| Letter card on a short phone (667) | device | card column becomes a ScrollView inside the card; fade + buttons fixed |
| Boards/ladders on a short phone | device | ScrollView whose content is the canvas's 852 − inset (today's convention), primary inside it |

---

## 7. Shared files and conflicts

* `src/components/keepsakes/Medallion.tsx` — **this group rewrites it**; it is also imported by
  `src/app/profile.tsx` (settings group: `KKMedallion size 48 metal paper sun`, `kkSun`, `kkStanding`,
  `kkFace`). Edit Profile's new frame shows a "Medallions · 10 of 12" row, so profile's shelf likely
  goes — coordinate, or keep a thin `KKMedallion` → `FaceCoin` shim until settings lands.
* `src/components/onboarding/handover.tsx` (tail) — `O3LetterRead` API change breaks
  `letter.tsx:130`; `WEEK_XII_LETTER` (generated `src/content/weekXiiLetter.ts`) regenerated by tail.
  The envelope hero and the "hero board" (hero + centred stack + primary/ghost) are needed by both
  groups — ideally one component in `src/components/mono/*` (orchestrator) or exported by one side.
* `src/components/StoicTabBar.tsx` / the new tab bar — `/milestones` must light **Journey** (today it
  lights `home`). Owner: whoever builds the tab bar.
* `src/components/mono/*` (orchestrator, does not exist yet) — this group needs: frame (ground + 96px
  noise 0.05, optional bg `#121212`), nav/backRow (back, close, share, title, rightText), h1/p/caps,
  primary/ghost, segmented, card, `medal()` → `TierMedal`, `check`, `chevronL`, `closeX`,
  `shareIcon`, `H.envelope`. If the kit lands without `medal`/`shareIcon`, this group adds them in
  `src/components/keepsakes/`.
* `src/lib/theme.ts` (orchestrator) — no change needed (`LATO.black` and `sansItalic()` exist).
* `src/app/_layout.tsx` (orchestrator) — no change needed (letter `fade`/no gesture kept).
* `src/app/(app)/_layout.tsx` — no change (launch gate pushes `/letter` and `/medallion-post`).
* `src/app/letter.tsx` exports (`MailArrival`, `MailSheet`, `LetterBody`, `LetterFooter`, `KeepPill`,
  `Salutation`, `LetterP`, `Signoff`, `ContactShadow`, `WaxSeal`, `LaurelStrike`, `EnvelopeArt`,
  `insetOf`) are imported only by `medallion-post.tsx` and `drop.tsx` (this group) — safe to replace
  wholesale with the new card/arrival pieces.

---

## 8. Seeds and recipes for verification

* **`.overhaul/medallions-seed.js` must be rewritten.** The frames' dataset (one consistent ledger
  except Vidi): created **Jun 9**; first check-in Jun 9; **23** `urge_rode_out` (3 of them severity ≥ 9
  → Breakwater ×3); **3** `urge_acted_on`, the first on **Jul 20** (Black Box; Logbook = 26); **2**
  `lapse` each followed next day by a check-in (Rebound ×2); **19** check-ins with no 7-day gap (Pulse
  ×19, Return unearned); **9** journal entries (Archive 9 of 10); **12** lessons completed (Lessons
  ×12). That draws all three album frames ("10 of 12 earned"), One-offs, and Tiers
  Vici/Rebound/Breakwater/Logbook/Pulse/Archive/Lessons.
* **Tiers Vidi needs its own seed**: "Day 13" with 13 recorded days is impossible alongside 19
  check-ins (check-ins are one record per date, `checkins` keyed by `YYYY-MM-DD`), so the canvas's
  mock ledger is internally inconsistent there. E.g. `.overhaul/medallions-vidi-seed.js` with 13
  recorded days.
* Boards stay seedless (`?tier=`). Album page 2 recipe: horizontal scroll (§2.3).
* Letters: `letters-seed.js` (name "Sam", why "I want to be present for the people I love");
  `tap('Read')`, not `'Read it'`; medallion letter via the arrival's new primary label.
* The recipe tool notes about `mdiff.mjs` (CSS coin boxes vs SVG) are obsolete — the coin is SVG in
  the frames now; plain `sigdiff`/`pxdiff` apply.

---

## 9. Open questions (canvas ambiguous or self-contradictory)

* **Q1 — album paging.** `Medallions` + `Album Earned II` only make sense as pages of six (§2.3).
  Horizontal pager (recommended) or vertical snap? No page indicator is drawn; adding kit `pagerDots`
  would be invention.
* **Q2 — ≤2 vs grid.** `Still to earn` lays its two faces out as a centred row (gap 48), `Earned`
  uses the 3-col grid. Recommend: n ≤ 2 → centred row, n ≥ 3 → grid pages, on both segments.
* **Q3 — Detail Paper.** "Not yet. First at ×1" and "Nine minutes…" vs Tiers Vici's Paper ×5 and
  `vici.stories[0]`. Recommend compute (`First at ×5`, stories[0]) — successor of D057/D101, now the
  *only* board whose words differ.
* **Q4 — Platinum +1.** Breakwater Platinum (171) and Detail Platinum (158) sit 1pt below their
  siblings; reproduce (formula §1.5) or treat as noise?
* **Q5 — ladder door.** No frame draws a way from a detail board to a `Tiers *` page (the pill is
  gone). Recommend the track block. Alternative: album → Tiers for *unearned* faces.
* **Q6 — ladder at standing 5 / singular day.** Not drawn.
* **Q7 — "Week XII post".** Static canvas mock or the current program week?
* **Q8 — enclosure face.** Frame says Rebound; the post's trigger earns Vici (§2.10).
* **Q9 — Yearly Drop has no close.** Left nav slot is empty (80 wide). Same problem as the paywall
  group's OQ1; recommend the same resolution (kit `closeX`, here in the empty **left** slot, x 22–40)
  and make "Restore" in the ghost tappable only if the paywall group does the same for its footer.
* **Q10 — medallion-post arrival.** No frame draws it. Option A (previous run, D138): tail's
  `Medallion Received` board (medal hero, caps = face name, h1 + p, `Continue` bottom 48, **no close,
  no ghost** — the shelve path then only survives via the letter's X). Option B: the canvas's own post
  arrival `90B` (`Letter Arrival`, envelope, "The post is in.") for both posts — no invented copy.
  Recommend B.
* **Q11 — italic quote.** `font-style:italic; font-weight:400` → Chrome draws Lato 700 italic (the
  only italic loaded; signature `18px/700i`). Use `sansItalic()`.
* **Q12 — generator vs frame** (frame wins; listed so nobody "fixes" back): kit `segmented` selected
  text `#FFFFFF` vs `#111111`; kit `medCard` 2-col cards 56pt vs frame bare 3-col 64pt cells; kit
  detail `medal(tier,164)` + pill + quote card vs frame face coin 168 + caps + italic line; kit tiers
  "So far" card + list vs frame board; kit `nav` noise `noise-dark.png` 0.06 vs `noise.png` 0.05; kit
  letter `bg:#EEEBE6` / fade to CARD vs frame `#121212` / fade to `#111111`; kit "Read it" / "Tuck it
  into your Log" / "Begin the year" vs frame "Read" / "Save to Log" / "Continue"; kit Drop Received
  medal top 120 vs 212; kit Yearly Drop stack 122/272 vs 175/325.

---

## 10. Risks

* **SVG paint-order trap** on the boards: the coin wrapper and the track's rail/fill are absolute
  siblings — every `<Svg>` sharing a parent with an absolute box needs `position:'absolute'` (BRIEF).
  The 30pt node `<Svg>`s sit inside their own 30×30 discs, which keeps them clear.
* `text-wrap: pretty/balance` line breaks: the letter's ¶1 ("this morning." on its own line), the
  quotes and the Drop/Arrival p's must be checked against the PNGs; `AppText` applies `pretty` on web.
* The 40-dot rim × 12 coins on a page is ~500 `<Circle>`s — fine on web; on native consider one
  `<Path>` of 40 arcs (same pixels) if the album stutters.
* Numeral letter-spacing (0.6 in a 64 viewBox) under `text-anchor:middle` — Chrome adds trailing
  spacing; native SVG may centre differently by 0.3 units (0.8pt at 168).
* Removing `KKMedallion` breaks `profile.tsx` until the settings group lands (§7).
* `D057/D059/D060/D061/D062/D100/D101/D102/D137/D138` all describe retired geometry; the
  implementation should record successors (D2xx) rather than leave them reading as current.
