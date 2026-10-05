# Group `lesson-scroll` — the lesson reader, Lesson 1, Frames 1–14

Analysis only; no app file was touched. Every number below is the frame's own (`node scripts/overhaul/body.mjs`),
cross-checked against the design layout signatures `.overhaul/sig/d-Email-Login-Lesson-Scroll-<k>.txt` and
the PNGs `.overhaul/shots/design/Email-Login/Lesson-Scroll-<k>.png`. Canvas y is quoted throughout. Anything
hung from the top is `insets.top + (canvasY − 54)` in the app (D009), and anything hung from the bottom is
measured off the **screen** edge (D026). In the mock web build (`insets = {top:54,bottom:0}`) both come out
equal to the canvas y, so an app capture compares directly with the frame.

Scratch: `.overhaul/understand/scratch-lesson-scroll/body-Lesson-Scroll-<k>.txt` holds the full `body.mjs` dump of
each frame. `measure.mjs` re-lays every frame's stack at 375/390/430 widths (§6). `wrapcmp.mjs` compares each
frame's own line breaks with greedy wrapping (§6.2). Both run in the design server's Lato.

---

## 0. Headline facts (verified, not assumed)

1. **The 14 frames are Week-01-Reset `L1 Frame 1–14`.** Raw `diff` of each pair differs only in
   `data-screen-label` (`Lesson Scroll k` vs `L1 Frame k`), and the `body.mjs` dumps are identical for all 14.
   The lessons group's L1 and these 14 are therefore the **same 14 screens**: one implementation and one audit.
2. **The reader chrome is byte-identical on all 1,273 lesson frames** (84 lessons × 13–18 frames; every
   Week bundle checked by regex after normalising lesson number and progress width):
   * close X: identical on 1,273 of 1,273;
   * header label `Lesson <n>`: present on every frame **except Frame 1 of each lesson** (84 of 84 covers lack
     it, no other frame does);
   * progress fill = `Math.round(k / total × 100)` % on **1,273 of 1,273** (k is 1-based; total is that lesson's frame count);
   * bottom control: **316 frames draw the primary pill** (84 `Begin`, 64 `Continue`, 84 `Finish lesson`,
     84 `Done`) and **957 draw the 44pt ring**. Each frame draws exactly one of the two.
   * Exactly one frame in the corpus uses the designer's scroll treatment (top-aligned stack and a bottom fade):
     `Week-01-Reset/L7-Frame-11` (a 5-option question). See §1.6 and §6.
3. **App route:** `/lesson/day/[day]` → `src/app/lesson/day/[day].tsx` (behaviour) +
   `src/components/lesson/scroll.tsx` (`LessonScroll`: shell, chrome, centred scroller) +
   `src/components/lesson/reader.tsx` (`Part`/`Run`/`Board`/`Cta`) + `src/content/lessonReader.ts`
   (**GENERATED** by `scripts/vicifull/gen-lesson-scrolls.mjs` from the previous drop). Entry is the lesson card
   `/lesson-card/[day]` → `Start lesson` → `router.push('/lesson/day/<day>')`. The debug index
   `src/app/(app)/all.tsx:98` links `/lesson/day/1` directly.
4. **Today the app draws the previous drop's lesson 1**, `Surviving the Night`, in **26 pages**: light paper ground
   `#F4F3F0` with grain at 0.07, a `Close` *word* at left 16/top 12 (safe area), a 2pt hairline, a serif epigraph,
   cascades, sun/crescent/clock/sunrise marks, an in-column pick list, a task-options board and a chevron on the
   cover. **None of that survives.** The new lesson 1 is `Prepare for tonight` in 14 pages on the dark mono
   system. The chrome, the page model, the type, the art and the copy all change.
5. Recipes on disk are **stale and will mislead the audit**: `.overhaul/recipes/lesson-scrolls.json` maps
   `Lesson Scroll 1–26` to `designBundle: "Lesson-1-Surviving-the-Night"`, and that bundle no longer exists in
   `.overhaul/final/`. It also sorts after `lesson-scroll.json`, so its entries would override a new file's (§8).

---

## 1. The reader chrome: the exact spec shared by all 1,273 frames

Kit vocabulary: `frame` (ground + noise), `closeX`, `caps` (the header label), `primary` (the pill), `check`,
`chevronR` (the glyph in the ring). The rail, the ring and the content block are bespoke to the lesson generator
(`Vici Overhaul/project/gen/lesson-v3.js`: `chrome()`, `hint`, `block()`). Where that generator and a frame
disagree, the frame wins. For these 14 frames they agree everywhere.

### 1.1 Ground and noise (`frame`)
* Ground `#0D0D0D` over the whole 393×852, status bar included. Today: `#F4F3F0`.
* Noise: `position:absolute; inset:0; background-image:url('noise-dark.png'); opacity:0.06`. It is the frame's
  **first** child, so every positioned sibling paints above it. The PNG is 96×96 and repeats at its own size
  (no `background-size`). Use `Grain` (`src/components/ui/Grain.tsx`, `resizeMode="repeat"`) with
  `source=noise-dark.png` and **opacity 0.06** (today 0.07). Pin it to the **screen's** top-left, not to the safe area,
  so the tile phase matches the canvas, whose tile starts at frame (0,0).
* Status bar glyphs: the canvas draws them white on dark. `[day].tsx` currently mounts `<StatusBar style="dark" />`;
  that must become `light` or be removed, since the root layout already sets `light`.

### 1.2 Close X (`closeX`): every frame
```
<div position:absolute left:22 top:60 height:40 display:flex align-items:center z-index:5>
  <svg 18×18 viewBox 0 0 18 18><path d="M2 2l14 14M16 2L2 16" fill=none stroke=#F2F0EC stroke-width=2 stroke-linecap=round>
```
Signature: svg at (22, 71) 18×18. App: `PressScale` at `left:22, top: insets.top + 6, height:40,
justifyContent:'center', zIndex:5`, holding `<Svg width={18} height={18} viewBox="0 0 18 18"><Path d="M2 2l14 14M16 2L2 16"
stroke="#F2F0EC" strokeWidth={2} strokeLinecap="round" fill="none"/></Svg>`. Keep `accessibilityRole="button"`, **add
`accessibilityLabel="Close"`**, because the word `Close` that drivers and screen readers found is gone. Keep a
generous `hitSlop` (today `{top:16,bottom:16,left:16,right:24}`).
Copy: `Close` (17pt Lato 400, `#3A3934`) → X glyph.

### 1.3 Header label (`caps`): every frame except the cover
```
<div position:absolute left:0 right:0 top:60 height:40 display:flex align-items:center justify-content:center z-index:4>
  <div width:100% white-space:nowrap font-size:13 font-weight:700 color:#9B968E text-align:center>Lesson 1
```
* **No line-height and no letter-spacing** are stated. The run lays out at Lato's natural `normal` box
  (16 tall in the signature, top **72**). This is *not* the cover's `Lesson 1` label, which is 13/16 with
  `letter-spacing:0.2` (§2.1). Do not merge the two styles.
* App: absolute row `left:0,right:0,top: insets.top + 6, height:40, alignItems/justifyContent center,
  zIndex:4, pointerEvents:'none'`, so the full-width row never steals the X's tap. Text:
  `sans('700'), fontSize:13, color:'#9B968E'`, with **no `lineHeight`** (AppText then drops its variant leading;
  see `AppText.tsx` `dropLeading`), `numberOfLines={1}`, web `textWrap:'nowrap'`.
* String: `Lesson ${n}`, where `n` is the **global** lesson number 1–84 (verified: `L8 Frame 1` says
  `Lesson 8`, `L84 Frame 2` says `Lesson 84`). It equals the route's `day`.
* Hidden on page index 0 (the cover): `idx === 1 ? '' : …` in `lesson-v3.js chrome()`.

### 1.4 Progress rail: every frame
```
<div position:absolute left:24 right:24 top:108 height:3 border-radius:2 background:#2E2E2E>
  <div width:P% height:3 border-radius:2 background:#F2F0EC>
```
* `P = Math.round(k / total * 100)`. Lesson 1 runs **7, 14, 21, 29, 36, 43, 50, 57, 64, 71, 79, 86, 93, 100**.
  Fill widths in the signature (track 345): 24.1, 48.3, 72.4, 100, 124.2, 148.3, 172.5, 196.6, 220.8,
  244.9, 272.5, 296.7, 320.8, 345.
* Today: `left:16,right:16, top:54 (safe), height:2, radius:1, rgba(0,0,0,0.05)`, with a `#B4B1AB` fill and the
  percent read from the data (`page.progress`). New: `left:24, right:24, top: insets.top + 54, height:3,
  borderRadius:2, backgroundColor:'#2E2E2E'`, and the fill `width:\`${P}%\`, height:3, borderRadius:2,
  backgroundColor:'#F2F0EC'`. The value is now **computed** and the data no longer needs to carry it, though carrying
  it does no harm. Keep the fill's `LinearTransition.duration(320)` and reduced-motion guard.

### 1.5 The content block, where every page's body sits
```
<div position:absolute left:32 right:32 top:140 bottom:128 padding-bottom:24 box-sizing:border-box
     display:flex flex-direction:column justify-content:center [text-align:center]>
```
* Column width **329**. The block runs y 140–724. Its content box is 140–**700** (560 tall, the 24 lift), and the
  stack is **vertically centred in 140–700**, so the stack's centre is y 420. `text-align:center` is set on the cover,
  quote and complete pages (Frames 1, 2, 11, 14), and each text run there also states `text-align:center`.
* Today the stack is centred across the **whole** 852 (`paddingVertical:72`, `paddingHorizontal:38`, the
  ScrollView pinned at `top:-insets.top`). Both change.
* App recommendation (keeps today's "a page that fits is centred, a taller one scrolls" behaviour): the ScrollView is
  `position:absolute, left:0, right:0, top: insets.top + 86, bottom: 128`, with
  `contentContainerStyle={{ flexGrow:1, justifyContent:'center', paddingHorizontal:32, paddingBottom:24 }}`.
  Inside it, keep the full-size `PressScale` (accessibilityLabel `Next`, `static`) and the `Animated.View` keyed on
  the page index (`FadeIn.duration(220).easing(bezier(0.2,0,0,1))`). Drop the stack `gap`, because the new pages
  state per-element `margin-top`s (§1.8). Use `marginTop` on each element; **do not** use a uniform gap.
* `bottom:128` is off the screen edge (D026), so on a device with a home indicator it stays 128 from the glass.

### 1.6 Bottom control: pill **or** ring, never both
**Primary pill** (`primary`): Frames 1 (`Begin`), 13 (`Finish lesson`), 14 (`Done`). In other lessons `Continue`
also appears, on question and answer pages.
```
<div position:absolute left:24 right:24 bottom:48 height:58 border-radius:29 background:#F2F0EC display:flex
     align-items:center justify-content:center cursor:pointer z-index:6>
  <span font-size:16 font-weight:700 letter-spacing:0.1 white-space:nowrap color:#111111>Begin
```
Signature: pill 24/746, 345×58. Label 19 tall (line-height `normal`) at y 765.5. App: `PressScale`
`position:absolute, left:24, right:24, bottom:48, height:58, minHeight:58, borderRadius:29,
backgroundColor:'#F2F0EC', alignItems/justifyContent:'center', zIndex:6`. Label `sans('700'), fontSize:16,
letterSpacing:0.1, color:'#111111'`, **no lineHeight**, nowrap. Today's `Cta` is `left:16, bottom:30, h52,
r26, #131313, white 17/600 +0.2`. Every value changes.

**Ring** (the generator's `hint`): Frames 2–12.
```
<div position:absolute left:0 right:0 bottom:52 display:flex justify-content:center>
  <div width:44 height:44 border-radius:22 box-shadow:0 0 0 1.5px #2E2E2E display:flex align-items:center justify-content:center>
    <svg 14×14 viewBox 0 0 14 14><path d="M5 2l5 5-5 5" fill=none stroke=#F2F0EC stroke-width=2 stroke-linecap=round stroke-linejoin=round>
```
Signature: ring 174.5/756, 44×44; chevron svg at (189.5, 771). **No fill**: the ground shows through. The ring
is a spread-only shadow **outside** the 44 box (BRIEF rule 5): `boxShadow:'0 0 0 1.5px #2E2E2E'`, never a
border. The canvas gives it no `cursor` and no z-index, so the designer treats it as a hint, consistent with "the page advances
by tapping". In the app make it a real control: `PressScale` with `accessibilityRole="button"`,
`accessibilityLabel="Next"`, `hitSlop` of about 12, same action as a page tap. Today's equivalent is the cover-only
chevron (`22×12`, `#B0AEA8`, bottom 42). That chevron is **removed**, and the ring now appears on every reading page.

**Which page gets which** (`lesson-v3.js`): cover → `Begin`; question and answer → `Continue`; the **last** task
page → `Finish lesson`; complete → `Done`; every other page (quote, section, continuation, non-last task page) →
ring.

### 1.7 Z-order
noise (first) < block/scroller < header row (z 4) < X (z 5) < pill (z 6). On the one scroll frame, the bottom fade is z 5,
under the pill. The ring states no z-index. Put it after the scroller so it paints above the scroller and receives taps.

### 1.8 Type styles used by these 14 frames (`lesson-v3.js` `ST`), Lato throughout
| style | size/line | weight | tracking | colour | wrap | used on |
|---|---|---|---|---|---|---|
| display | 30/36 | 700 | −0.6 | `#F2F0EC` | balance | cover title (F1), `Lesson complete.` (F14) |
| title | 24/31 | 700 | −0.4 | `#F2F0EC` | balance | section titles, quotes, task title |
| body | 18/28 | 400 | 0 | `#B5B0A8` | pretty | every paragraph |
| label | 13/16 | 700 | +0.2 | `#9B968E` | balance | `Lesson 1` on cover, `Part n`, attributions, `Today’s task`, chain caption, `Done when` |
| chainT | 15/22 | 400 | 0 | `#F2F0EC` | pretty | chain steps (F5) |
| cardT | 16/22 | 700 | 0 | `#F2F0EC` | pretty | done-card line (F13) |
| header caps | 13/normal | 700 | none | `#9B968E` | nowrap | chrome header (§1.3) |
| pill label | 16/normal | 700 | +0.1 | `#111111` | nowrap | §1.6 |
| chain tag | 13/16 | 700 | none | `#111111` | nowrap | `Change this part` (F5) |

`sans('700')`/`sans('400')` for the family. State `textWrap` explicitly on web (`balance` / `pretty` / `nowrap`)
the way `reader.tsx` `wrapOf()` does today, because `AppText` defaults non-headings to `pretty` on web.

### 1.9 Vertical rhythm (`lesson-v3.js` `G`, verified in every frame)
hero → next text **36**; visualisation → next **28**; label → title **12**; title → first body **28**;
paragraph → paragraph **22**; body → done card **28**; quote glyph → quote **24**; quote → attribution **18**;
complete disc → `Lesson complete.` **36**; `Lesson complete.` → line **14**. (`labelBody` 20 is not used in these 14 frames.)

---

## 2. Per frame

Format: **kind** (generator page kind) · what it draws (with signature y) · what the app shows today at the equivalent
point · what must change. Route for all 14 after the rebuild: `/lesson/day/1`, page k = tap `Next` (or `Begin`
on the cover) k−1 times. No seed needed: the reader reads no account state.

### 2.1 Lesson Scroll 1: cover (`coverPage`)
* **Draws.** No header label. Rail 7%. Centred block, `text-align:center`:
  1. **Hero `nightPhone`** (Lesson-Illustrations-v4 `Phone-parked-for-the-night`, the first `<svg>` of that card only;
     the later `<sc-if>` thumbnails are older variants). Wrapper `position:relative; width:393; height:176; margin:0 −32;
     flex-shrink:0` at **y 282–458**. Inside it, `<svg viewBox 0 0 393 240 width 393 height 240 position:absolute left:0
     top:−36 overflow:visible transform:scale(1.1) transform-origin:196px 190px>` with
     `<g transform="translate(-6 0)">` containing, in order:
     crescent `M265.71 64.4 A10 10 0 1 1 255.67 52.01 A8 8 0 1 0 265.71 64.4 Z` #F2F0EC; three 4-point stars
     (`M222 51.7 Q222 54 224.3 54 Q222 54 222 56.3 Q222 54 219.7 54 Q222 54 222 51.7 Z`,
     `M290 82 Q290 84 292 84 Q290 84 290 86 Q290 84 288 84 Q290 84 290 82 Z`,
     `M230 90.3 Q230 92 231.7 92 Q230 92 230 93.7 Q230 92 228.3 92 Q230 92 230 90.3 Z`) #F2F0EC;
     table top `rect 100,188 200×7 rx3.5`, legs `rect 112,195 6×14 rx1.5` and `rect 282,195 6×14 rx1.5` #F2F0EC;
     phone body `rect 132,92 46×96 rx11` #F2F0EC, screen `rect 135.5,95.5 39×89 rx8` #0D0D0D, glare
     `M135.5 150 L174.5 118 V134 L135.5 166 Z` #3A3835, speaker `rect 148,100 14×4.5 rx2.25` #F2F0EC; dock
     `rect 126,180 58×8 rx3` #55524D; water `M238.5 156 H263.5 L261.7 185.5 H240.3 Z` #55524D; glass outline
     `M236 140 H266 L263 186 Q262.8 188 261 188 H241 Q239.2 188 239 186 Z` fill none stroke #F2F0EC sw 3 round/round.
  2. `Lesson 1`: **label** style, centred, margin-top 36, at **y 494**.
  3. `Prepare for tonight`: **display** 30/36 −0.6, centred, margin-top 12, at **y 522** (one line).
  4. Pill `Begin` (§1.6).
  Stack 176+36+16+12+36 = 276 → (560−276)/2 = 142 → top 282 ✓.
* **App today** (old page 1, progress 3%): `WEEK I · RESET` eyebrow (12/600 +1.8, `#B0AEA8`), `Surviving the Night`
  (24/500 `#1D1C1A`), `6 min`, the `CoverSceneL1` room (window, lamp, bed on paper), and a chevron at the foot. No pill;
  a tap anywhere advanced.
* **Change.** Replace the whole page. Copy: `WEEK I · RESET` → removed; `Surviving the Night` → `Prepare for tonight`;
  `6 min` → removed; **new** `Lesson 1` label above the title; **new** pill `Begin`. Art `CoverSceneL1` → hero
  `nightPhone`. Chevron removed. `Begin` advances to page 2. Keep tap-anywhere too, as today (open question Q4).
* **Hero in RN.** Wrapper `View {alignSelf:'stretch', marginHorizontal:-32, height:176}` (it is 393 wide at 393).
  `<Svg width={393} height={240} viewBox="0 0 393 240" style={{position:'absolute', top:-36, left:(W-393)/2}}>`
  with `<G transform="matrix(1.1 0 0 1.1 -19.6 -19)">`, which is `translate(196 190) scale(1.1) translate(-196 -190)`,
  then the frame's own `<G transform="translate(-6 0)">`. Check: table top → x 94·1.1−19.6 = 83.8, y 246+188·1.1−19 =
  433.8, which equals the signature's `rect 83.8 | 433.8 | 220 | 7.7` ✓. Stroke widths scale with the group (3 → 3.3), as the
  canvas does. Never pass `rotation/origin*` to `<Svg>` (BRIEF). The art's top lies 0.77 inside the wrapper, so nothing
  clips vertically. Horizontally the `<Svg>` viewport clips at 0–393, the same as the frame's `overflow:hidden`.
  Centring the 393 Svg (`left:(W−393)/2`) keeps the art centred on 375/430 widths.
  `heroFit` gives the hero's top and height: `st = floor(190 + (top−190)·1.1)`, `h = ceil(190 + (bot−190)·1.1) − st`, from
  `gen/hero-bounds.json`: nightPhone [50.7, 210] → st 36, h 176.

### 2.2 Lesson Scroll 2: opening quote (`quotePage`)
* **Draws.** Header `Lesson 1`, rail 14%, ring. Centred block:
  quote glyph row (flex centre) `<svg 28×22 viewBox 0 0 28 22><path d="M2 12c0-6 4-10 10-10v4c-3 0-5 2-5 5h5v9H2zM16 12c0-6 4-10 10-10v4c-3 0-5 2-5 5h5v9H16z" fill="#5A574F">` at **y 349**;
  `A journey of a thousand miles begins with a single step.` **title** 24/31 −0.4 centred, margin-top 24, **y 395**,
  2 lines (`A journey of a thousand miles / begins with a single step.`);
  `Lao Tzu` **label** centred, margin-top 18, **y 475**.
* **App today** (old page 2, 7%): sun dot with a halo, the same quote in **serif** (Iowan, 26/39 500 `#1D1C1A`), and the
  attribution `LAO TZU` in caps (12/600 +1.8) between two 22×1.5 rules.
* **Change.** The quote text is unchanged. Font serif 26/39 → Lato 700 24/31 −0.4 `#F2F0EC`. Attribution `LAO TZU` + rules → `Lao Tzu`
  label, no rules. Sun dot → quote glyph. Close word → X. Header label added. Ring added.

### 2.3 Lesson Scroll 3: section opener (`sec`, Part 1)
* **Draws.** Rail 21%, ring. Left-aligned block:
  `Part 1` label **y 267.5**; `The smaller decision` title, mt 12, **y 295.5**; body mt 28 **y 354.5**, 4 lines:
  `It’s late. Your phone is beside you, and / you’re making another promise about / never watching porn again. You might / mean every word.`;
  body mt 22 **y 488.5**, 3 lines: `But at midnight, the useful decision is / smaller: what will you do with the phone / before you go to sleep?`
* **App today:** no counterpart. Old pages 3–6 carry different copy ("You do not need to fix your life tonight.",
  "Make the problem smaller") as centred 17/26 runs.
* **Change.** New page type: left-aligned (`text-align` start) label, title and paragraphs. The old reader centred every run
  (`AppText center`). The new reading pages are **not** centred.

### 2.4 Lesson Scroll 4: continuation (`cont`)
* Rail 29%, ring. Body **y 297** (3 lines: `Put it somewhere you can’t reach from / bed. Check the alarm first. If you need to / receive urgent calls, keep those available.`), body mt 22 **y 403** (5 lines:
  `A shelf across the room is enough if / leaving it outside the bedroom would / cause problems. Put the laptop away too. / Otherwise, you’ve moved one screen and / left another waiting.`).
* App today: nearest is old pages 17–19 ("Add distance"). New copy.

### 2.5 Lesson Scroll 5: section with a lead visualisation (`sec`, Part 2, `VIZ.chain`)
* **Draws.** Rail 36%, ring. Left block, top to bottom:
  1. **Chain card** at **y 178.5–378.5** (200 tall), full column width: `border-radius:20; background:#1E1E1E;
     padding:20`. Caption `A familiar evening` (label) at y 198.5; rows container margin-top 14 (y 228.5), column.
     Each row: `display:flex; gap:14`.
     * Left rail column `width:12; align-items:center` (stretches to the row's height): dot `margin-top:5; 12×12;
       radius 6; box-sizing:border-box`. The **marked** step (index 0) is filled `#F2F0EC`. The others are `border:2px solid
       #9B968E` with no fill. Connector under every non-last dot: `flex:1; width:2; margin-top:5; background:#5A574F`.
     * Right column `flex:1; min-width:0; padding-bottom:16` (0 on the last row): step text **chainT** 15/22.
       On the marked row, below the text: `margin-top:8; display:flex` → tag `height:24; padding:0 10; radius 12;
       background:#F2F0EC; 13/16 700 #111111 nowrap` reading `Change this part` (content-width, 115.1 wide).
     * Rows: `Get into bed to answer a message` (row y 228.5, h 70) · `Check a feed` (298.5, h 38) ·
       `Twenty minutes later, searching` (336.5, h 22). Connectors: 57/250.5 2×48 and 57/320.5 2×16.
  2. `Part 2` label, margin-top **28** after the card, **y 406.5**; `An earlier moment` title, mt 12, **y 434.5**.
  3. Body mt 28 **y 493.5**, 6 lines: `Think of the evening that usually goes / wrong. You get into bed to answer a / message. Then you check a feed. / Twenty minutes later, you’re searching / for something you had decided to / stop watching.`
     (These are `pretty` breaks. Greedy wrapping differs; §6.2.)
  Stack 200+28+16+12+31+28+168 = 483 → top 140 + (560−483)/2 = 178.5 ✓.
* **App today:** no visualisation exists anywhere in the old reader (nearest: old page 13 "Think about the last night" with the
  clock mark, and old page 15's "Before the search." cascade).
* **Change.** New component: the chain card. The selected-vs-unselected dot is the only two-state element in these 14 frames.
  It is static, not interactive.
* **Tallest page in the lesson.** It overflows the 375×667 band (§6).

### 2.6 Lesson Scroll 6: continuation
* Rail 43%, ring. Body **y 311** (4 lines: `By then, putting the phone down feels / much harder. Charging it elsewhere / changes an earlier decision, before that / search begins.`), mt 22 **y 445** (3 lines: `This won’t make every urge disappear. It / gives you a few seconds in which you have / to get up and choose.`).

### 2.7 Lesson Scroll 7: continuation with a mid-lesson hero (`cont` + `hero = pool[1]`)
* **Draws.** Rail 50%, ring. Hero **`bed`** (Lesson-Illustrations-v4 `Bed-at-night`, its first `<svg>`), wrapper 393×**162**
  at **y 237–399**, svg `top:−32`, same `scale(1.1)` about (196,190). Contents, outside any group: floor `rect −40,189 473×3 rx1.5`
  #55524D. Then `<g transform="translate(12 0)">`: nightstand `rect 66,150 44×40 rx4` #55524D, drawer pull `rect 75,166 26×3
  rx1.5` #0D0D0D; lamp foot `rect 80,144 16×6 rx2`, stem `rect 86,122 4×22`, shade `M72 122 H104 L98 100 H78 Z` (all
  #F2F0EC); crescent `M260.74 60.16 A9 9 0 1 1 251.7 49 A7.2 7.2 0 1 0 260.74 60.16 Z`; stars
  `M218 47.8 Q218 50 220.2 50 Q218 50 218 52.2 Q218 50 215.8 50 Q218 50 218 47.8 Z`,
  `M284 74.1 Q284 76 285.9 76 Q284 76 284 77.9 Q284 76 282.1 76 Q284 76 284 74.1 Z`,
  `M226 84.4 Q226 86 227.6 86 Q226 86 226 87.6 Q226 86 224.4 86 Q226 86 226 84.4 Z`; headboard `rect 124,96 12×94 rx3`;
  footboard `rect 290,132 10×58 rx3`; mattress `rect 124,146 176×30 rx6`; **pillow `rect 142,130 46×18 rx8 fill #F2F0EC
  stroke #0D0D0D stroke-width 4 stroke-linejoin round paint-order="stroke"`**; sheet fold `M198 148 V174` and blanket line
  `M206 167 H284`, both stroke #0D0D0D sw 2.6 round/round.
  Body mt **36** at **y 435**, 6 lines: `Use those seconds to begin something / you’ve already decided on: wash, read a / few pages, or turn out the light. Another / search for recovery advice can wait until / tomorrow if it keeps you awake beside the / same screen.`
  `bed`: bounds [46.8, 193] → st 32, h 162.
* **TRAP: `paint-order="stroke"`.** `body.mjs` does **not print `paint-order`** (raw HTML has it), and react-native-svg does not
  implement it. With it, the 4px dark stroke is painted *under* the fill, leaving a 2px dark halo **outside** the pillow that
  cuts it off the headboard and mattress. Without it, the stroke eats 2px into the pillow and the pillow shrinks. Reproduce it as two
  rects: first `<Rect x=142 y=130 width=46 height=18 rx=8 fill="#0D0D0D" stroke="#0D0D0D" strokeWidth=4 strokeLinejoin="round"/>`,
  then `<Rect … fill="#F2F0EC"/>` with no stroke. 49 Email-Login frames and 17 illustration cards use `paint-order`
  (`grep -l paint-order .overhaul/final/*/*.html`). Tell the lessons and illustration owners.
* **App today:** old page 14 (bed-and-phone mark) and old page 18 (room scene) are the nearest. Both are paper art.

### 2.8 Lesson Scroll 8: continuation
* Rail 57%, ring. Body **y 311** (4: `Marcus Aurelius reminded himself to deal / with the trouble in front of him instead of / carrying every possible future trouble / into it.`), mt 22 **y 445** (3: `You can apply that idea tonight. You don’t / have to settle the coming year before / putting the phone down.`). New copy.

### 2.9 Lesson Scroll 9: section opener (Part 3)
* Rail 64%, ring. `Part 3` **y 306.5**; `Where you’re starting` title **y 334.5**; body mt 28 **y 393.5** (5: `Before you finish, write a few facts about / where you’re starting. When do you / usually watch? How much time does it / take, if you know? What does it interrupt? / What tends to happen afterwards?`).

### 2.10 Lesson Scroll 10: continuation
* Rail 71%, ring. Body **y 350** (5: `Approximate answers are useful. / Guessing precise numbers isn’t. You’ll / return to these notes later to see what / changed. Tonight, they only need to / be honest.` These are `pretty` breaks; greedy puts `be` on line 4).

### 2.11 Lesson Scroll 11: closing quote (`quotePage`)
* Rail 79%, ring. Glyph **y 364.5**; `Well begun is half done.` title, centred, 1 line, **y 410.5**; `Aristotle` label, centred, **y 459.5**.
* **App today:** old page 25 (96%), the same quote in serif with `ARISTOTLE` and rules. Same change as §2.2.

### 2.12 Lesson Scroll 12: first task page (`task`, first; no hero because it does not fit)
* **Draws.** Rail 86%, **ring** (not the pill: this is not the last task page). `Today’s task` label **y 253.5**
  (the same string on all 84 lessons); `Prepare for tonight` title (= the lesson title), mt 12, **y 281.5**; body mt 28 **y 340.5**
  (2: `Start one private note called My / recovery plan.`, a `pretty` break; greedy puts `recovery` on line 1); body mt 22
  **y 418.5** (6: `Write your porn boundary and what you / know about your starting point: when you / usually watch, roughly how often or for / how long, what it interrupts, and what you / do after an urge or slip. Write “unknown” / where needed.`).
  Curly quotes `“unknown”` are verbatim.
* **App today:** old page 23 (88%): spacer, `Surviving the night` (24/500), body, the room scene scaled 0.85 in a 170 box,
  and a white rule card. Then old page 24 is the task-options board `Match where you sleep` with four glyph rows
  (`Own bedroom`, `Shared room`, `Studio, sofa bed, or temporary space`, `Phone needed as an alarm`).
* **Change.** Both old task boards are gone from lesson 1. The task is now two reading pages (12–13) in the lesson's own type.

### 2.13 Lesson Scroll 13: last task page, with the done card (`task`, last)
* **Draws.** Rail 93%, **pill `Finish lesson`**. Body **y 247** (3: `Prepare tonight: set the alarm, put the / phone out of reach from bed, and put / other devices away.`),
  body mt 22 **y 353** (4: `Keep needed calls and accessibility / available. If the device must stay close, / close the content and choose a practical / limit on browsing.`).
  **Done card** margin-top 28, **y 493–593** (100 tall): `border-radius:20; background:#1E1E1E; padding:18px 20px;
  display:flex; gap:14; align-items:flex-start`. Disc 28×28 radius 14 `#F2F0EC` (at 52/511) holding the kit `check`
  `<svg 12×12 viewBox 0 0 14 14><path d="M2 7.5l3.2 3L12 3.5" stroke=#111111 stroke-width=2.2 round/round fill=none>`.
  Text column `flex:1; min-width:0; flex-direction:column; gap:4`: `Done when` label (y 511) and **cardT** 16/22 700
  `Your starting notes are saved and / tonight’s device setup is ready.` (y 531, 2 lines, width 247).
* **App today:** old page 23's white rule card (`Done when you can’t reach your usual device from bed without standing up.`,
  15/500 `#55534E`, an outlined tick on white, `0 0 0 1px rgba(0,0,0,0.07)…`).
* **Change.** Rule card → dark done card. Tick glyph → kit check on an ink disc. Copy changes completely. **New** pill
  `Finish lesson` (the old lesson had no pill until the completion page).

### 2.14 Lesson Scroll 14: complete (`completePage`)
* **Draws.** Header `Lesson 1`, rail 100%, pill `Done`. Centred block: disc **96×96 radius 48 `#F2F0EC`** at 148.5/315 with
  `check` at **34×34** (viewBox 14, so its 2.2 stroke draws ≈5.34pt); `Lesson complete.` **display** 30/36 −0.6 centred,
  mt 36, **y 447**; `One thing left today — the task.` **body** 18/28 centred, mt 14, **y 497** (em dash verbatim).
  Stack 96+36+36+14+28 = 210 → top 315 ✓.
* For lessons **with** a question, the line reads `Your answers are saved to the log. One thing left today — the task.`
  (`lesson-v3.js completePage`). Lesson 1 has none.
* **App today:** old page 26 (100%): a 36pt sun with a 115 halo, `Lesson complete.` (24/500 `#1D1C1A`),
  `Your answer is saved to the log. One decision tonight — get to tomorrow.`, and a `Done` pill (`#131313`, white).
* **Change.** Sun → ink disc + check. Copy: `Your answer is saved to the log. One decision tonight — get to tomorrow.` →
  `One thing left today — the task.`. Pill restyled (§1.6). `Done` still closes the reader.

---

## 3. What the content layer must hand the reader for these 14 frames

The page model and copy belong to the lessons group (`lessonReader.ts` is generated). These 14 frames need only
this, and it is exactly what `lesson-v3.js lessonPages()` produces from `gen/lessons-v3.json` week 1 lesson 1 +
`gen/lesson-pool.json["1"] = ["nightPhone","bed","charger"]`:

| # | kind | content | hero | bottom |
|---|---|---|---|---|
| 1 | cover | n=1, title | pool[0] nightPhone | pill `Begin` |
| 2 | quote | openingQuote {text, by} | – | ring |
| 3 | sec | part 1, title, items [p, p] | – | ring |
| 4 | cont | items [p, p] | – | ring |
| 5 | sec | part 2, title, items [viz chain, p] (the viz leads, above the label) | – | ring |
| 6 | cont | [p, p] | – | ring |
| 7 | cont | [p] | pool[1] bed | ring |
| 8 | cont | [p, p] | – | ring |
| 9 | sec | part 3, title, [p] | – | ring |
| 10 | cont | [p] | – | ring |
| 11 | quote | closingQuote | – | ring |
| 12 | task first | `Today’s task`, lesson title, [p, p] | (only if it fits; not here) | ring |
| 13 | task last | [p, p, done card] | – | pill `Finish lesson` |
| 14 | done | `Lesson complete.` + line (+ “Your answers are saved…” if the lesson has a question) | – | pill `Done` |

The pagination is a cost-minimising DP (`paginate()`), and the hero placement a heuristic. **Do not re-derive it in
the app.** Generate the page list offline from the Week bundles' frames (or by running `lesson-v3.js` with
`lines-v3.json`) and verify it against `.overhaul/final/Week-*/L<n>-Frame-<k>.html`. The data needs neither the progress percent
nor the header label, since both are computed from `k`, `total` and `n`.

---

## 4. Behaviour to preserve (the frames do not show it)

From `src/app/lesson/day/[day].tsx` and `LessonScroll`:
1. `day` param parsing, including a `day-` prefix (`Number(String(day).replace(/^day-/,'')) || 1`).
2. The cursor carries its lesson (`{day, index}`), so opening a different lesson resets to page 1 even though the component is reused.
3. **Tap anywhere on a reading page turns it.** The stack is `pointerEvents:'none'` unless the page has interactive
   content (question rows in other lessons), the full-band `PressScale` (`static`, `accessibilityLabel="Next"`) takes the
   tap, and a drag scrolls instead (`keyboardShouldPersistTaps="handled"`). Keep this, and **add** the ring and the pill as
   explicit controls that call the same `next()`.
4. `next()` on the last page closes the reader. `close()` = `router.canGoBack() ? router.back() : router.replace('/lesson-card/<n>')`.
   The fallback depends on whether the card route survives (Q1).
5. Per-page `FadeIn` (220 ms, bezier 0.2/0/0/1) keyed on the index; progress fill `LinearTransition` (320 ms);
   both off under `useReducedMotion()`.
6. Pages taller than the band scroll (`flexGrow:1` + centred main axis): a page that fits sits exactly where the frame
   puts it, and a taller one scrolls (§6).
7. Returns `null` for a lesson with no pages (unknown day).
8. Stack push with `slide_from_right` and the back gesture (root `Stack` options). Android back pops.
9. Other lessons only (lessons group): question rows own their taps and `Continue` advances. The current pick rows
   keep **local** state only; nothing is persisted (`PickRows` uses `useState`). The old copy "Your answer is saved to the log"
   was never backed by a write.
10. Nothing marks a lesson complete today: `useCompleteLesson` (`src/lib/backend/{convex,mock}.ts`) has **no caller in
    the UI**, and the library and today reckon progress by day number (`library.md` §3). Q3.

Drivers and accessibility: keep `accessibilityLabel="Next"` on the page press and the ring, and `Close` on the X.
`tap('Next')` in `.overhaul/drive.js` matches by text, then aria-label.

---

## 5. App screens and states in this area that no frame in this group draws

| screen/state | today | closest frame for style |
|---|---|---|
| `/lesson-card/[day]` (the lesson card sheet: dots, `LESSON 01 · WEEK I`, plate, title, summary, `Start lesson`, `Back to Week I`) | `src/app/lesson-card/[day].tsx`, paper sheet | **No frame in this drop.** Its job (title + way in) is now the cover, Lesson Scroll 1 with `Begin`. Recommend retiring it and pushing `/lesson/day/<n>` from every entry point (Q1). If kept, restyle from Lesson Scroll 1 (hero + `Lesson n` label + display title + primary). |
| Reader for lessons 2–84 | same reader, old content | Week bundles `L<n> Frame <k>` (lessons group). Chrome identical (§0.2). |
| Question / answer pages, the scrolling question (`L7 F11`), multi-page tasks, other visualisations (compare, pairs, wave, track, bars) | old pick board, task-options board | Week bundles (lessons group). Chrome as §1. Pill `Continue`. |
| Short-screen overflow (page taller than the band) | centred ScrollView, no fade | `L7-Frame-11`: block `justify-content:flex-start; padding-bottom:0`, plus `position:absolute; left:0; right:0; bottom:0; height:150; background:linear-gradient(rgba(13,13,13,0), #0D0D0D 40%); z-index:5; pointer-events:none` under the pill. |
| Unknown lesson (`/lesson/day/999`) | renders `null` (blank screen) | no frame. Recommend a blank ground with the X so the user can leave (Frame 1's chrome without content). |
| `/task/[day]` (`Task DNN Intro/Options` boards) | `src/app/task/[day].tsx`, paper | No frame in Email-Login. The task now lives inside the lesson (Frames 12–13). Today p2's task tile currently routes there (`today-day.md` §1.5). Its owner should restyle it from Lesson Scroll 12/13 (label + title + body + done card) or retire it. |

---

## 6. Small screens

### 6.1 Band and stack heights (measured in Lato by `scratch-lesson-scroll/measure.mjs`)
Band available to the centred stack = `screenH − (insets.top + 86) − 128 − 24`.
375×667 (top inset 20): **409**. 390×844 (47/34): 559 (the bottom stays 128 off the glass). 393×852: 560. 430×932 (59/34): 635.

| frame | 375 (col 311) | 390 (326) | 393 (329) | 430 (366) |
|---|---|---|---|---|
| 1 | 276 | 276 | 276 | 276 |
| 2 | 142 | 142 | 142 | 142 |
| 3 | 305 | 305 | 305 | 277 |
| 4 | 274 | 246 | 246 | 218 |
| **5** | **483** | 483 | 483 | 455 |
| 6 | 218 | 218 | 218 | 190 |
| 7 | 366 | 366 | 366 | 338 |
| 8 | 218 | 218 | 218 | 190 |
| 9 | 255 | 227 | 227 | 227 |
| 10 | 140 | 140 | 140 | 112 |
| 11 | 111 | 111 | 111 | 111 |
| 12 | 361 | 333 | 333 | 277 |
| 13 | 368 | 346 | 346 | 318 |
| 14 | 210 | 210 | 210 | 210 |

Only **Frame 5 at 375×667** overflows (483 > 409, or 433 without the lift). It must scroll inside the band and must not run under
the rail or the ring. With the ScrollView bounded at `top: insets.top+86 / bottom: 128`, it clips at y 106 and y 539 on that phone,
and the ring sits at 571–615, so nothing overlaps. Optional: the designer's own fade (§5) when `contentHeight > layoutHeight`.
Hero width: the wrapper is screen-wide, and the 393 art is centred (`left:(W−393)/2`), so it stays centred at 375 and 430.
Header `Lesson 84` (the longest) is nowrap and fits easily.

### 6.2 Line breaks: web vs native
`scratch-lesson-scroll/wrapcmp.mjs` shows only three runs whose `text-wrap:pretty` breaks differ from greedy:
F5 body (greedy: `…check a feed. Twenty / minutes later, you’re searching for / something you had decided to stop / watching.`),
F10 (greedy ends `…need to be / honest.`), F12 first paragraph (greedy: `…called My recovery / plan.`). Every `balance` run
matches greedy here. On web, state `textWrap` and the capture matches the frame. On native the three differ by one word;
the copy is generated data, so do not hard-code `\n` (BRIEF rule 6). Record it as a native-only divergence.

---

## 7. Files

**Rewrite (the reader; one owner with the lessons group, see Risks):**
* `src/app/lesson/day/[day].tsx`: behaviour. Header label from `n`, progress from `(index+1)/count`, bottom-control
  rule, StatusBar → light, close fallback.
* `src/components/lesson/scroll.tsx` → the new shell: ground, noise at 0.06, X, header, rail, band ScrollView, ring, pill slot.
  The paper marks in this file (`SunDot`, `CrescentMark`, `SunriseMark`, `ClockMark`, `BedPhoneMark`) become unused.
* `src/components/lesson/reader.tsx` → the new parts: text styles (§1.8), quote glyph, hero, chain card, done card,
  complete disc, primary pill. `Run`, `Mark`, `cascade`, `attribution`, `rule`, `picklist`, `Board`, `OptionRow`, `GlyphArt`,
  the serif `SERIF` stack, `READER_RAMPS` usage: all gone for lesson 1. Other lessons need the question/answer rows (lessons group).

**Dead today already:** `src/components/lesson/pages.tsx` has no importer. With it go `cover.tsx`, `marks.tsx` and `scenes.tsx`, whose only
importer is `pages.tsx`. After the rewrite `coverL1.tsx` (only `reader.tsx` imports it), `src/content/coverScene.ts` and
`src/content/readerRoom.ts` (only the reader) go dead too. Delete them in the implementation phase, or leave them to the lessons owner.

**Shared, conflict risk:**
* `src/content/lessonReader.ts`: GENERATED by `scripts/vicifull/gen-lesson-scrolls.mjs` (also `gen-dry.mjs`) from the
  previous drop. Needs a new generator (suggest `scripts/overhaul/gen-lesson-reader.mjs`) that reads the Week bundles. Lessons group.
* `src/content/curriculum84.ts`: lesson titles (`Prepare for tonight`), read by today, library, card, task and search. One owner.
* Kit primitives: `src/components/mono/*` (orchestrator) once it exists: `primary`, `closeX`, `check`, `chevronR`, the
  frame/noise. Use them if they land with these exact numbers. Otherwise keep the reader's own copies, which are trivial.
* `src/lib/theme.ts`: read only. `mono.{ground,card,line,art,ink,sub,mute,onInk}` already equal the kit's palette. Note
  `mono.art` is `#5A574F` (quote glyph, chain connector). The illustrations use **`#55524D`** (DIM) and **`#3A3835`**
  (DIM2), which are *not* theme tokens: transcribe them literally inside the hero art.
* `src/app/_layout.tsx`: no change needed (root `StatusBar style="light"`, `CANVAS_INSETS`).
* Entry points that push `/lesson-card/<day>`: `(app)/today.tsx:176`, `week/[week].tsx:95`,
  `components/library/WeekBoard.tsx:245`, `lessons-browser.tsx:120`, `search.tsx:79`, `first-steps.tsx:93`. They change only if the card retires.

---

## 8. Recipes and drives (for the implementation phase)

* **Replace** `.overhaul/recipes/lesson-scrolls.json`. It has 31 entries for the old 26-page lesson, all with
  `designBundle:"Lesson-1-Surviving-the-Night"` (missing from `.overhaul/final/`). `audit.mjs` reads recipe files in
  directory order and a later file's `frame` key overwrites an earlier one, so `lesson-scrolls.json` would beat a new
  `lesson-scroll.json`. Delete it and write `lesson-scroll.json` with 14 entries, **no `designBundle`/`designFile`** (the
  Email-Login `Lesson-Scroll-k.html` is the default, and body-identical to `Week-01-Reset/L1-Frame-k.html`):
  `{frame:"Lesson Scroll k", route:"/lesson/day/1", script:".overhaul/lsdrive/p<k>.js", wait:1200, note:"expect rail k%"}`,
  with Frame 1 needing no script (`wait:1600`).
* **Fix the drivers** `.overhaul/lsdrive/p*.js`. `rail()` finds the track by `clientHeight === 2 && clientWidth > 300`,
  but the new track is **3** tall and 345 wide. Expected return values: 7, 14, 21, 29, 36, 43, 50, 57, 64, 71, 79, 86, 93, 100.
  `tap('Next')` keeps working if the page press or the ring carries `Next`. On the cover the pill says `Begin`, and the page press
  (if kept, Q4) still matches `Next`.
* Compare with `--ignore=0,0,393,54` (status bar). Check Frame 5 at `--w=375 --h=667 --scroll=end`.

---

## 9. Traps specific to this group

1. **`paint-order="stroke"`** on the `bed` pillow is invisible in `body.mjs` and unsupported in react-native-svg (§2.7).
2. **Hero transform:** `scale(1.1)` about (196,190) → `matrix(1.1 0 0 1.1 -19.6 -19)` on a `<G>`. The Svg is `position:absolute`
   with `top:-st`. The wrapper is 393 wide via `marginHorizontal:-32`. Look at the PNG: a passing signature does not prove the art is visible.
3. **Two different `Lesson 1` styles:** chrome header (13/normal, no tracking) vs cover label (13/16, +0.2).
4. **No uniform stack gap:** every gap is a stated `margin-top` (§1.9). The current `LessonScroll` applies a single `gap`.
5. **Reading pages are left-aligned** (3–10, 12, 13). Only 1, 2, 11 and 14 are centred. The old reader centred everything.
6. **Ring = outside spread shadow, transparent inside**, never a border. Pill text has **no lineHeight** (normal → 19).
7. **AppText on web** forces `textWrap:'pretty'` on non-headings. State `balance`/`pretty`/`nowrap` explicitly (§1.8).
8. Grain opacity **0.06**, not 0.07. Ground `#0D0D0D`, not paper.
9. The reader's own `<StatusBar style="dark">` paints dark glyphs on the dark ground: remove it.

---

## 10. Open questions

* **Q1 — the lesson card.** `/lesson-card/[day]` has no frame in this drop, and Lesson Scroll 1 carries its title and its way
  in (`Begin`). Retire the card, so every entry point pushes `/lesson/day/<n>` and the X's fallback becomes
  `replace('/(app)/today')` or the week? The library analysis (`library.md` §5) defers to this group and the lessons group.
  Recommendation: retire it.
* **Q2 — where `Done` goes.** The frame says "One thing left today — the task." but draws no destination. Today it is
  `close()` (back to wherever the lesson was opened). Keep that, or route to Today's task (Today p2) or `/task/<n>`?
  Recommendation: keep `close()`.
* **Q3 — completion.** "Lesson complete." / "Finish lesson" imply a record, but the app writes none
  (`useCompleteLesson` has no caller). Call `completeLesson(slug)` on `Finish lesson`? That is new behaviour, not a restyle.
  Needs a decision (the D200+ log).
* **Q4 — tap-anywhere on pill pages.** The canvas makes the pill the control (`cursor:pointer`) and the ring a hint (no cursor). Today
  a tap anywhere advances on every non-question page, including the cover and the completion page. Recommendation: keep
  tap-anywhere on ring pages **and** pill pages, as today (no functionality lost), and make the ring and pill real buttons.
* **Q5 — Frame 13's done line** ("Your starting notes are saved…") and the task pages ask for a private note the app does not
  host. It is copy only, and no control is drawn. Confirm no notes field is expected (the generator's `noteField` appears only on
  answer pages of other lessons: "Add a note (optional)").
* **Q6 — scroll treatment.** Overflow happens only on small phones (Frame 5 at 375×667). Use the plain clipped scroll, or reproduce
  `L7-Frame-11`'s top-aligned stack plus 150pt fade whenever a page overflows? The canvas uses the fade once, on a 852 frame.
* **Q7 — native line breaks** for the three `pretty` runs (§6.2): accept the one-word differences on device?
