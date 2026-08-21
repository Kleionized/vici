# Week Overview — Weeks I–VI (pixel spec)

Source frames (read in full, line by line):
`.uifinal/pretty/final/Email Login/` — `Week-I-Reset.html`, `Week-I-Reset-P2.html`,
`Week-II-Changing-Your-Mindset.html`, `Week-II-Changing-Your-Mindset-P2.html`,
`Week-III-In-the-Moment.html`, `Week-III-In-the-Moment-P2.html`,
`Week-IV-Know-Your-Brain.html`, `Week-IV-Know-Your-Brain-P2.html`,
`Week-V-Why-It-Feels-Worth-It.html`, `Week-V-Why-It-Feels-Worth-It-P2.html`,
`Week-VI-Discipline.html`, `Week-VI-Discipline-P2.html`.
Raw equivalents under `.uifinal/final/Email Login/` were used to confirm the literal
text nodes (the pretty-printer prefixes every text run with `· `; that middle dot is a
printer marker and **is not** in the copy).

Every frame is a `393 × 852` div. Its `top` values include a 54px status bar the app
never builds. **Every offset below is given as `canvas → canvas − 54`.**

---

## a. Frame inventory

| Frame | Page kind | App component that should own it |
|---|---|---|
| `Week-I-Reset` | Week Overview — page 1 of 2 (rows 01–04) | new `WeekOverview` in `src/components/journey/WeekOverview.tsx`, routed at `src/app/week/[n].tsx` |
| `Week-I-Reset-P2` | Week Overview — page 2 of 2 (rows 05–07) | same component, scrolled row column |
| `Week-II-Changing-Your-Mindset` | Week Overview — page 1 (rows 08–11) | same |
| `Week-II-Changing-Your-Mindset-P2` | Week Overview — page 2 (rows 12–14) | same |
| `Week-III-In-the-Moment` | Week Overview — page 1 (rows 15–18) | same |
| `Week-III-In-the-Moment-P2` | Week Overview — page 2 (rows 19–21) | same |
| `Week-IV-Know-Your-Brain` | Week Overview — page 1 (rows 22–25) | same |
| `Week-IV-Know-Your-Brain-P2` | Week Overview — page 2 (rows 26–28) | same |
| `Week-V-Why-It-Feels-Worth-It` | Week Overview — page 1 (rows 29–32) | same |
| `Week-V-Why-It-Feels-Worth-It-P2` | Week Overview — page 2 (rows 33–35) | same |
| `Week-VI-Discipline` | Week Overview — page 1 (rows 36–39) | same |
| `Week-VI-Discipline-P2` | Week Overview — page 2 (rows 40–42) | same |

There is exactly **one page kind** across all twelve frames. P1/P2 are the same screen
at two scroll positions, not two kinds — see "The P1/P2 question" below.

### The P1/P2 question (canvas self-consistency)

Verified programmatically: for each of the six weeks, the byte range covering the back
row + title + subtitle, the whole scene band, and the whole footer band is **identical**
between `<Week>.html` and `<Week>-P2.html`. Only the row block differs.

Two readings are possible:

1. Two static pages of one scrolling screen. The row window runs from card top `486` to
   the footer top `798` = **312pt**. Four cards at the 80pt pitch occupy
   `3 × 80 + 56 = 296pt` and end at `798 − 96 = 702`… i.e. the fourth card's bottom is
   `486 + 296 = 782`, leaving 16pt of clear air before the footer. Five cards would need
   376pt and would run under the band. So the window fits **exactly four** rows, which is
   exactly what P1 draws, and P2 draws the remaining three.
2. A horizontal pager of two discrete pages.

**The evidence supports reading 1.** The window fitting exactly four rows is not a
coincidence, and a pager would not normally reproduce the closing land band on both
pages. Build it as one screen: fixed back row + title + subtitle + scene + footer band,
with the seven rows in a vertically scrolling column occupying the 312pt window.

---

## b. Page grammar — the one kind: **Week Overview**

Every value below is literal from the canvas. Nothing is rounded or substituted.

### b.0 Frame shell (identical on all 12 frames)

| Property | Value |
|---|---|
| width / height | `393px` / `852px` |
| position | `relative` |
| overflow | `hidden` |
| background | `#F4F3F0` |
| font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` |
| font smoothing | `-webkit-font-smoothing:antialiased` |
| flex-shrink | `0` |
| box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` (frame chrome for the board — **not** part of the screen) |

Noise overlay (first child, all 12 frames):

| Property | Value |
|---|---|
| position / inset | `absolute` / `0` |
| background-image | `url('noise-dark.png')` |
| opacity | `0.07` |
| pointer-events | `none` |

### b.1 Status bar (all 12 frames byte-identical; the app never builds it)

| Property | Value |
|---|---|
| position | `absolute; top:0; left:0; right:0` |
| height | `54px` |
| display / align / justify | `flex` / `center` / `space-between` |
| padding | `6px 32px 0 46px` |
| box-sizing | `border-box` |
| z-index | `20` |
| clock text | `9:41` — font-size `17px`, weight `600`, color `#1D1C1A`, letter-spacing `-0.2px` |
| glyph row | `display:flex; align-items:center; gap:7px` |

Signal bars — `<svg width="19" height="12" viewBox="0 0 19 12">`, four rects, all
`rx="0.7" fill="#1D1C1A"`: `x=0 y=7.5 w=3.2 h=4.5`, `x=4.8 y=5 w=3.2 h=7`,
`x=9.6 y=2.5 w=3.2 h=9.5`, `x=14.4 y=0 w=3.2 h=12`.

Wifi — `<svg width="17" height="12" viewBox="0 0 17 12">`:

```
M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z
M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z
```
both `fill="#1D1C1A"`, plus `<circle cx="8.5" cy="10.5" r="1.5" fill="#1D1C1A">`.

Battery — `<svg width="27" height="13" viewBox="0 0 27 13">`:
`<rect x=0.5 y=0.5 w=23 h=12 rx=3.5 stroke="#1D1C1A" stroke-opacity="0.35" fill="none">`,
`<rect x=2 y=2 w=20 h=9 rx=2 fill="#1D1C1A">`, and

```
M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z
```
`fill="#1D1C1A" fill-opacity="0.4"`.

### b.2 Back affordance (all 12 frames identical)

| Property | Value |
|---|---|
| position | `absolute; left:16px; top:64px → 10px` |
| display / align / gap | `flex` / `center` / `9px` |
| child count | **one** — the chevron SVG only. **There is no "Back" word on these frames.** |
| chevron | `<svg width="11" height="19" viewBox="0 0 11 19">` |
| chevron stroke | `#55534E`, `stroke-width="2.4"`, `stroke-linecap="round"`, `stroke-linejoin="round"`, `fill="none"` |

```
M9.5 1.5L2 9.5l7.5 8
```

The `gap:9px` with a single child is dead CSS on the canvas; it is the slot the word
would occupy. Do not render a label — none of the twelve frames carries one.

### b.3 Title

| Property | Value |
|---|---|
| position | `absolute; left:24px; top:114px → 60px` |
| right | *(unset — intrinsic width, single line)* |
| font-size | `27px` |
| font-weight | `600` |
| letter-spacing | `-0.2px` |
| line-height | *(unset — normal)* |
| color | `#1D1C1A` |
| text-transform | none |
| text-align | left (default) |

### b.4 Subtitle

| Property | Value |
|---|---|
| position | `absolute; left:24px; right:60px; top:158px → 104px` |
| font-size | `14.5px` |
| font-weight | `400` |
| line-height | `21px` |
| letter-spacing | *(unset)* |
| color | `#55534E` |
| text-wrap | `pretty` |
| max-width | implied `393 − 24 − 60 = 309px` |

### b.5 Scene band (the picture)

| Property | Value |
|---|---|
| position | `absolute; left:0; right:0; top:214px → 160px` |
| height | `258px` |
| overflow | `hidden` |
| background | `linear-gradient(180deg, #F4F3F0 0%, #F3EEE1 58%, #F4F3F0 100%)` |
| z-index | *(unset — document order)* |

Bottom fade (last child of the band, every week):

| Property | Value |
|---|---|
| position | `absolute; left:0; right:0; bottom:0` |
| height | `44px` |
| background | `linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)` |

Band ends at canvas `214 + 258 = 472 → 418`. First row card begins at `486 → 432`, so
there is a clear 14pt of field between the band and the first card.

All per-week art is transcribed in the **Visualization** section below.

### b.6 Lesson row card — geometry (identical in all three states)

| Property | Value |
|---|---|
| position | `absolute; left:24px; right:24px` |
| tops (page 1) | `486 → 432`, `566 → 512`, `646 → 592`, `726 → 672` |
| tops (page 2) | `486 → 432`, `566 → 512`, `646 → 592` |
| height | `56px` — **all three states, including the current row** |
| pitch | `80px` (`56` card + `24` gap) |
| border-radius | `14px` (all four corners) |
| background | `#FFFFFF` |
| display / align | `flex` / `center` |
| gap | `13px` |
| padding | `0 16px` (top 0, right 16, bottom 0, left 16) |
| box-sizing | `border-box` |
| border-width | `0` (definition is by box-shadow ring, not border) |
| opacity | `1` in every state, including locked |

Internal order: glyph disc → title span (`flex:1`) → number span.

### b.7 Lesson row card — the three states

#### State: **done** (rows 01–11)

| Property | Value |
|---|---|
| card box-shadow | `0 0 0 1px rgba(0,0,0,0.06)` |
| disc size | `30px × 30px`, `border-radius:50%` |
| disc background | `#131313` |
| disc layout | `display:flex; align-items:center; justify-content:center; flex-shrink:0` |
| disc inner shadow | none |
| icon | `<svg width="12" height="10" viewBox="0 0 16 13">` |
| icon stroke | `#F4F3F0`, `stroke-width="2.8"`, caps/joins `round`, `fill="none"` |
| title font | `15.5px` / weight `500` / color `#1D1C1A` / `flex:1` |
| number font | `12.5px` / weight `500` / color `#8B8882` |

```
M1.5 7l4.4 4.5L14.5 1.5
```

#### State: **current** (row 12 only — `Week-II-…-P2` first row)

| Property | Value |
|---|---|
| card box-shadow | `0 0 0 2px #131313, 0 10px 24px rgba(40,38,32,0.12)` |
| card height | `56px` (unchanged) |
| disc size | `30px × 30px`, `border-radius:50%` |
| disc background | `#131313` |
| disc inner shadow | none |
| icon | `<svg width="13" height="13" viewBox="0 0 24 24">` — a crescent moon |
| icon fill | `#F4F3F0` (filled path, no stroke) |
| title font | `15.5px` / weight **`500`** / color `#1D1C1A` |
| number font | `12.5px` / weight **`600`** / color **`#1D1C1A`** |

```
M14 3 A9 9 0 1 0 21 12 A7.2 7.2 0 0 1 14 3Z
```

#### State: **locked** (rows 13–42)

| Property | Value |
|---|---|
| card box-shadow | `0 0 0 1px rgba(0,0,0,0.06)` |
| card opacity | `1` — the canvas does **not** dim a locked card |
| disc size | `30px × 30px`, `border-radius:50%` |
| disc background | `rgba(19,19,19,0.05)` |
| disc inner shadow | `inset 0 0 0 1.5px rgba(0,0,0,0.08)` |
| icon | `<svg width="12" height="13" viewBox="0 0 16 17">` — padlock |
| icon body | `<rect x="3" y="7.5" width="10" height="7.5" rx="2" fill="#A5A29B">` |
| icon shackle | stroke `#A5A29B`, `stroke-width="1.8"`, `fill="none"` |
| title font | `15.5px` / weight `500` / color **`#8B8882`** |
| number font | `12.5px` / weight `500` / color **`#B0AEA8`** |

```
M5.2 7.5 V5.6 a2.8 2.8 0 0 1 5.6 0 V7.5
```

### b.8 The gap pips

Between every consecutive pair of rows, two dots, drawn as frame-absolute divs:

| Property | Value |
|---|---|
| position | `absolute; left:52px` (= 28px inside the 24px-inset row column) |
| tops | `547 → 493` / `555 → 501` (gap 1); `627 → 573` / `635 → 581` (gap 2); `707 → 653` / `715 → 661` (gap 3) |
| size | `3.5px × 3.5px` |
| border-radius | `50%` (i.e. `1.75px`) |
| background | `rgba(40,38,32,0.2)` |

Relative to a 24pt gap starting at the card's bottom edge, the pips sit at gap-local
`+5` and `+13`.

### b.9 Closing land band (all 12 frames byte-identical)

| Property | Value |
|---|---|
| position | `absolute; left:0; right:0; top:798px → 744px; bottom:0` (height `54px`) |
| overflow | `hidden` |
| background | `linear-gradient(180deg, #ECEBE6, #E7E6E0)` (no explicit stop positions → `0%`/`100%`) |

Headland 1:

| Property | Value |
|---|---|
| position | `absolute; left:-30px; right:40%; top:30px` |
| height | `80px` |
| border-radius | `50% 50% 0 0 / 44px 44px 0 0` |
| background | `#CFD9E2` |

Headland 2:

| Property | Value |
|---|---|
| position | `absolute; left:35%; right:-40px; top:38px` |
| height | `80px` |
| border-radius | `50% 50% 0 0 / 40px 40px 0 0` |
| background | `#C4D2DE` |

### b.10 What varies per week, and what does not

**Varies:** title string, the week's Roman numeral (carried inside the subtitle only),
the subtitle line, the scene art, and the list of lesson titles + their two-digit
numbers.

**Does not vary:** every colour token, every radius, every font size/weight, the row
geometry and pitch, the pips, the back chevron, the scene band's own gradient and
height, and the closing land band. **There is no per-week accent colour, no per-week
hue rotation, and no per-week glyph.** The only per-week visual identity is the scene.

Scene-level per-week variation, as data:

| Week | Sun disc | Sun left/top (band-local) | Halo | Cloud tone | Terrain family | Mast + flag |
|---|---|---|---|---|---|---|
| I | `46 × 46` | `146 / 58` | one, `106×106` @ `0.42` | white | 4 water swells (`#C8D7E5`,`#D5E1EA`,`#EDE7D8`,`#F2EDE0`) | yes (`126/152`, h`54`) |
| II | `40 × 40` | `266 / 48` | one, `100×100` @ `0.42` | white | 2 grey ridges (`#DEDDD6`,`#CFCEC7`) | yes (`206/128`, h`46`) |
| III | `38 × 38` | `80 / 44` | one, `98×98` @ `0.42` | white | 2 water swells (`#C8D7E5`,`#D5E1EA`) | no |
| IV | `58 × 58` | `160 / 50` | **two** — `200×200` @ `0.55` + `118×118` @ `0.42` | white ×2 | 2 grey ridges (`#DEDDD6`,`#CFCEC7`) | no |
| V | `42 × 42` | `78 / 46` | one, `102×102` @ `0.42` | **grey** (`#D6D5D0`,`#DDDCD5`) | 2 grey ridges (`#DEDDD6`,`#CFCEC7`) | no |
| VI | `30 × 30` | `56 / 42` | one, `90×90` @ `0.42` | white | 2 clip-path triangles + 1 foothill (`#DEDDD6`) | yes (`214/24`, h`38`) |

Sun fill is `#E9D2A4` on every week. Mast is `4 × N`, `border-radius:2px`, `#B4B1AB`;
flag is `22 × 14`, `border-radius:1px`, `#E9D2A4`, always offset `+4px` right of the
mast's left edge and sharing the mast's top.

---

## c. Per-frame table — kind and exact copy

HTML entities in the source, resolved to the real character:
`&middot;` → `·` (U+00B7 MIDDLE DOT) · `&rsquo;` → `’` (U+2019 RIGHT SINGLE QUOTATION
MARK) · `&ldquo;` → `“` (U+201C) · `&rdquo;` → `”` (U+201D). **No `&mdash;` appears in
any of the twelve frames.** All hyphens in row titles are plain ASCII `-` (U+002D):
`All-or-Nothing`, `Short-Term`, `Long-Term`. The literal strings below are given with
the entities already resolved.

| Frame | Kind | Title | Subtitle | Rows (title · number · state) |
|---|---|---|---|---|
| `Week-I-Reset` | Week Overview p1 | `Reset` | `Week I · Survive the nights and steady the basics.` | `Surviving the Night` · `01` · done<br>`A New Start` · `02` · done<br>`Get Outside` · `03` · done<br>`Fix Your Sleep` · `04` · done |
| `Week-I-Reset-P2` | Week Overview p2 | `Reset` | `Week I · Survive the nights and steady the basics.` | `What Replaces Porn?` · `05` · done<br>`Isolation` · `06` · done<br>`One Week In` · `07` · done |
| `Week-II-Changing-Your-Mindset` | p1 | `Changing Your Mindset` | `Week II · Streaks, relapses, and how you talk to yourself.` | `More Than a Streak` · `08` · done<br>`After a Relapse` · `09` · done<br>`The All-or-Nothing Trap` · `10` · done<br>`Progress Isn’t Linear` · `11` · done |
| `Week-II-Changing-Your-Mindset-P2` | p2 | `Changing Your Mindset` | `Week II · Streaks, relapses, and how you talk to yourself.` | `Identity` · `12` · **current**<br>`Values, Not Shame` · `13` · locked<br>`Keep Going` · `14` · locked |
| `Week-III-In-the-Moment` | p1 | `In the Moment` | `Week III · What to do in the sixty seconds that matter.` | `The Life of an Urge` · `15` · locked<br>`What’s the Urge Really For?` · `16` · locked<br>`Move First` · `17` · locked<br>`Redirection` · `18` · locked |
| `Week-III-In-the-Moment-P2` | p2 | `In the Moment` | `Week III · What to do in the sixty seconds that matter.` | `HALT` · `19` · locked<br>`Urge Surfing` · `20` · locked<br>`Masturbation` · `21` · locked |
| `Week-IV-Know-Your-Brain` | p1 | `Know Your Brain` | `Week IV · The machinery behind the pull.` | `The Reward System` · `22` · locked<br>`The Control Center` · `23` · locked<br>`Hungry and Tired` · `24` · locked<br>`Angry and Lonely` · `25` · locked |
| `Week-IV-Know-Your-Brain-P2` | p2 | `Know Your Brain` | `Week IV · The machinery behind the pull.` | `The Pull of Novelty` · `26` · locked<br>`Change Your State` · `27` · locked<br>`Autopilot` · `28` · locked |
| `Week-V-Why-It-Feels-Worth-It` | p1 | `Why It Feels Worth It` | `Week V · The honest math of what it gives and takes.` | `The Scale` · `29` · locked<br>`The “Benefits” of Porn` · `30` · locked<br>`The Hidden Reward` · `31` · locked<br>`The Short-Term Cost` · `32` · locked |
| `Week-V-Why-It-Feels-Worth-It-P2` | p2 | `Why It Feels Worth It` | `Week V · The honest math of what it gives and takes.` | `The Long-Term Cost` · `33` · locked<br>`Tipping the Scale` · `34` · locked<br>`Repairing the Scale` · `35` · locked |
| `Week-VI-Discipline` | p1 | `Discipline` | `Week VI · Training the response you want on hard nights.` | `What is Willpower?` · `36` · locked<br>`Train Your Response` · `37` · locked<br>`What Discipline Isn’t` · `38` · locked<br>`What Discipline Is` · `39` · locked |
| `Week-VI-Discipline-P2` | p2 | `Discipline` | `Week VI · Training the response you want on hard nights.` | `Thoughts and Feelings` · `40` · locked<br>`Choose Your Action` · `41` · locked<br>`Damage Control` · `42` · locked |

Note the copy quirks — transcribe exactly, do not "correct":
- `The Control Center` uses the US spelling.
- `What is Willpower?` uses lowercase `is` where the rest of the deck title-cases.
- `Progress Isn’t Linear` / `What’s the Urge Really For?` / `What Discipline Isn’t` use
  the curly apostrophe `’`, never `'`.
- `The “Benefits” of Porn` uses curly double quotes, never `"`.

### Derived data model

Seven lessons per week, numbered continuously across weeks, two-digit zero-padded:
week `n` covers lessons `(n−1)·7 + 1 … n·7`. Weeks I–VI cover `01`–`42`.

The progress state the canvas snapshots: lessons `01`–`11` done, `12` current,
`13`–`42` locked. That is a data-driven state, not a per-frame constant.

---

## d. Chrome shared by every frame

| Element | Present? | Detail |
|---|---|---|
| Status bar | yes, all 12, byte-identical | §b.1. The app never builds it; it is why every `top` is `−54`. |
| Close / back affordance | yes, all 12, byte-identical | A **back chevron only** at `left:16px; top:64 → 10`. No "Back" word, no X, no "Cancel". §b.2. |
| **Progress bar** | **NO** | **There is no progress bar, no step dots, no percentage element on any of the twelve frames.** The only progress signal is the per-row glyph (check / moon / padlock) and the number colour. Do not add one; there is no fill percentage to report. |
| Title + subtitle | yes, all 12 | Per-week copy, identical geometry. |
| Scene band | yes, all 12 | Identical geometry and gradient; per-week art. |
| Row column | yes, all 12 | Identical geometry; 4 cards on p1, 3 on p2. |
| Gap pips | yes | 2 per gap; 3 gaps on p1, 2 on p2. |
| Closing land band | yes, all 12, byte-identical | §b.9. |
| Tab bar | **NO** | The land band runs 798→852, which a tab bar would cover. This is a pushed route, not a tab. |
| Noise overlay | yes, all 12 | `noise-dark.png` @ `opacity:0.07`. |

---

## e. Visualization — the six scenes

**Coordinate system.** The canvas builds every scene from absolutely-positioned `<div>`s
inside the band, so there is no `viewBox` in the source. Port each to a
`react-native-svg` `<Svg width={w} height={258} viewBox={"0 0 " + w + " 258"}>` whose
origin is the **band's** top-left, i.e. canvas `(0, 214)` → app `(0, 160)`. Every `left`
/ `top` below is band-local and needs **no** −54: the −54 has already been paid by the
band's own top.

**Width anchoring.** The swells/ridges are `473px` or `483px` wide on a `393px` frame —
they deliberately overhang. Port them as `w + 80` / `w + 90` measured off the live width
rather than scaling 473, exactly as `WorldArt.tsx` already does.

**Shape helpers.** `border-radius: 50% 50% 0 0 / Rpx Rpx 0 0` on a `W × H` box turns the
whole top edge into one elliptical arc of radii `W/2 × R` — the existing
`swell(x, y, w, h, ry)` helper in `src/components/journey/WorldArt.tsx` emits precisely
this path and should be reused:

```
M{x} {y+ry}A{w/2} {ry} 0 0 1 {x+w} {y+ry}L{x+w} {y+h}L{x} {y+h}Z
```

**Blur.** `filter: blur(4px)` on the halos and drop shadows has no RN SVG equivalent;
fold it into the radial gradient falloff exactly as `WorldArt.tsx` does today
(`stop 0 = α`, `stop 0.4 = α × 0.58`, `stop 0.74 = 0`).

**Halo gradient (weeks I, II, III, V, VI, and week IV's inner halo)**

```
radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)
```
Stops: `#E2BA78 @ 0.42` at offset `0`; `#E2BA78 @ 0` at offset `0.74`.
Week IV's **outer** halo is the same gradient with the centre alpha at `0.55`.

**Drop-shadow ellipses**

```
background: rgba(0,0,0,0.08); border-radius:50%; filter: blur(4px)
```
(week V's is `rgba(0,0,0,0.05)` with `blur(5px)`).

---

### Week I — "Reset" · low sun over four swells, mast and flag

Band-local layer list, in paint order:

| # | left | top | w | h | radius / clip | fill | filter |
|---|---|---|---|---|---|---|---|
| 1 halo | `116` | `28` | `106` | `106` | `50%` | `radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)` | `blur(4px)` |
| 2 sun | `146` | `58` | `46` | `46` | `50%` | `#E9D2A4` | — |
| 3 cloud A base | `52` | `52` | `44` | `11` | `8px` | `rgba(255,255,255,0.85)` | — |
| 4 cloud A cap | `66` | `45` | `26` | `10` | `7px` | `rgba(255,255,255,0.75)` | — |
| 5 cloud B base | `292` | `40` | `35.2` | `8.8` | `8px` | `rgba(255,255,255,0.85)` | — |
| 6 cloud B cap | `303.2` | `34.4` | `20.8` | `8` | `7px` | `rgba(255,255,255,0.75)` | — |
| 7 swell 1 | `-40` | `150` | `473` | `90` | `50% 50% 0 0 / 26px 26px 0 0` | `#C8D7E5` | — |
| 8 swell 2 | `-60` | `170` | `473` | `84` | `50% 50% 0 0 / 22px 22px 0 0` | `#D5E1EA` | — |
| 9 swell 3 | `-40` | `196` | `473` | `90` | `50% 50% 0 0 / 22px 22px 0 0` | `#EDE7D8` | — |
| 10 swell 4 | `-70` | `216` | `473` | `80` | `50% 50% 0 0 / 18px 18px 0 0` | `#F2EDE0` | — |
| 11 shadow | `106` | `204` | `56` | `10` | `50%` | `rgba(0,0,0,0.08)` | `blur(4px)` |
| 12 mast | `126` | `152` | `4` | `54` | `2px` | `#B4B1AB` | — |
| 13 flag | `130` | `152` | `22` | `14` | `1px` | `#E9D2A4` | — |
| 14 glint | `58` | `178` | `24` | `4` | `2px` | `rgba(255,255,255,0.6)` | — |
| 15 glint | `316` | `186` | `20` | `4` | `2px` | `rgba(255,255,255,0.5)` | — |
| 16 glint | `206` | `206` | `26` | `4` | `2px` | `rgba(255,255,255,0.45)` | — |
| 17 fade | `0` | *(bottom `0`)* | full | `44` | — | `linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)` | — |

Edge cases: the mast/flag has **no hull** in this scene — the boat is implied by the
shadow ellipse at layer 11. On a narrower phone the swells still overhang because they
are `w + 80` wide; on a wider phone the sun and mast keep their absolute lefts (they are
composed against the left half of the frame, not centred).

Path forms (with `w` = live width, `swell()` as above):

```
swell(-40, 150, w + 80, 90, 26)
swell(-60, 170, w + 80, 84, 22)
swell(-40, 196, w + 80, 90, 22)
swell(-70, 216, w + 90, 80, 18)
```

---

### Week II — "Changing Your Mindset" · two ridges, four footprints, summit flag

| # | left | top | w | h | radius / transform | fill | filter |
|---|---|---|---|---|---|---|---|
| 1 halo | `236` | `18` | `100` | `100` | `50%` | `radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)` | `blur(4px)` |
| 2 sun | `266` | `48` | `40` | `40` | `50%` | `#E9D2A4` | — |
| 3 cloud base | `64` | `44` | `44` | `11` | `8px` | `rgba(255,255,255,0.85)` | — |
| 4 cloud cap | `78` | `37` | `26` | `10` | `7px` | `rgba(255,255,255,0.75)` | — |
| 5 ridge 1 | `-40` | `150` | `473` | `110` | `50% 50% 0 0 / 48px 48px 0 0` | `#DEDDD6` | — |
| 6 ridge 2 | `-90` | `176` | `483` | `100` | `50% 50% 0 0 / 42px 42px 0 0` | `#CFCEC7` | — |
| 7 step | `92` | `212` | `14` | `4` | `2px`, `rotate(10deg)` | `rgba(255,255,255,0.75)` | — |
| 8 step | `122` | `200` | `14` | `4` | `2px`, `rotate(6deg)` | `rgba(255,255,255,0.75)` | — |
| 9 step | `152` | `190` | `14` | `4` | `2px`, `rotate(2deg)` | `rgba(255,255,255,0.7)` | — |
| 10 step | `180` | `180` | `13` | `4` | `2px`, `rotate(-2deg)` | `rgba(255,255,255,0.7)` | — |
| 11 shadow | `186` | `172` | `56` | `10` | `50%` | `rgba(0,0,0,0.08)` | `blur(4px)` |
| 12 mast | `206` | `128` | `4` | `46` | `2px` | `#B4B1AB` | — |
| 13 flag | `210` | `128` | `22` | `14` | `1px` | `#E9D2A4` | — |
| 14 fade | `0` | *(bottom `0`)* | full | `44` | — | `linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)` | — |

```
swell(-40, 150, w + 80, 110, 48)
swell(-90, 176, w + 90, 100, 42)
```

The four steps read as a footpath climbing right and up: each is `30px` right and
`10–12px` up from the last, rotating from `+10deg` to `-2deg`. Rotate about the rect's
own centre (`transform-origin: 50% 50%` is the CSS default; RN SVG needs an explicit
`rotate(deg cx cy)`).

Edge case: the flag sits at the crest of ridge 2, so if the ridge is re-anchored to a
live width the flag's left must stay absolute — the canvas composes the summit at
`x ≈ 206–232`, not at a percentage.

---

### Week III — "In the Moment" · two swells, whitecap, six glints

| # | left | top | w | h | radius | fill | filter |
|---|---|---|---|---|---|---|---|
| 1 halo | `50` | `14` | `98` | `98` | `50%` | `radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)` | `blur(4px)` |
| 2 sun | `80` | `44` | `38` | `38` | `50%` | `#E9D2A4` | — |
| 3 cloud base | `250` | `48` | `39.6` | `9.9` | `8px` | `rgba(255,255,255,0.85)` | — |
| 4 cloud cap | `262.6` | `41.7` | `23.400000000000002` | `9` | `7px` | `rgba(255,255,255,0.75)` | — |
| 5 wave 1 | `-40` | `148` | `473` | `90` | `50% 50% 0 0 / 26px 26px 0 0` | `#C8D7E5` | — |
| 6 whitecap base | `168` | `140` | `36` | `10` | `6px` | `rgba(255,255,255,0.9)` | — |
| 7 whitecap cap | `200` | `136` | `18` | `8` | `5px` | `rgba(255,255,255,0.75)` | — |
| 8 glint | `84` | `166` | `28` | `4` | `2px` | `rgba(255,255,255,0.6)` | — |
| 9 glint | `230` | `160` | `32` | `4` | `2px` | `rgba(255,255,255,0.55)` | — |
| 10 wave 2 | `-60` | `186` | `473` | `84` | `50% 50% 0 0 / 22px 22px 0 0` | `#D5E1EA` | — |
| 11 glint | `130` | `212` | `26` | `4` | `2px` | `rgba(255,255,255,0.55)` | — |
| 12 glint | `288` | `220` | `20` | `4` | `2px` | `rgba(255,255,255,0.45)` | — |
| 13 glint | `66` | `228` | `22` | `4` | `2px` | `rgba(255,255,255,0.4)` | — |
| 14 fade | `0` | *(bottom `0`)* | full | `44` | — | `linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)` | — |

```
swell(-40, 148, w + 80, 90, 26)
swell(-60, 186, w + 80, 84, 22)
```

Note the paint order: glints 8 and 9 are painted **between** wave 1 and wave 2, so wave 2
partially covers them. Preserve the order; do not group all glints together.

`23.400000000000002px` is verbatim from the canvas — a float artefact of `26 × 0.9`.
Emit `23.4`; do not round to `23`.

---

### Week IV — "Know Your Brain" · a doubled halo, big sun, two ridges

| # | left | top | w | h | radius | fill | filter |
|---|---|---|---|---|---|---|---|
| 1 outer halo | `96` | `-4` | `200` | `200` | `50%` | `radial-gradient(closest-side, rgba(226,186,120,0.55), rgba(226,186,120,0) 74%)` | `blur(4px)` |
| 2 inner halo | `130` | `20` | `118` | `118` | `50%` | `radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)` | `blur(4px)` |
| 3 sun | `160` | `50` | `58` | `58` | `50%` | `#E9D2A4` | — |
| 4 cloud A base | `48` | `72` | `39.6` | `9.9` | `8px` | `rgba(255,255,255,0.85)` | — |
| 5 cloud A cap | `60.6` | `65.7` | `23.400000000000002` | `9` | `7px` | `rgba(255,255,255,0.75)` | — |
| 6 cloud B base | `296` | `60` | `35.2` | `8.8` | `8px` | `rgba(255,255,255,0.85)` | — |
| 7 cloud B cap | `307.2` | `54.4` | `20.8` | `8` | `7px` | `rgba(255,255,255,0.75)` | — |
| 8 ridge 1 | `-40` | `154` | `473` | `110` | `50% 50% 0 0 / 48px 48px 0 0` | `#DEDDD6` | — |
| 9 ridge 2 | `-90` | `180` | `483` | `100` | `50% 50% 0 0 / 42px 42px 0 0` | `#CFCEC7` | — |
| 10 glint | `150` | `196` | `44` | `4` | `2px` | `rgba(255,255,255,0.5)` | — |
| 11 fade | `0` | *(bottom `0`)* | full | `44` | — | `linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)` | — |

```
swell(-40, 154, w + 80, 110, 48)
swell(-90, 180, w + 90, 100, 42)
```

Edge case: the outer halo's `top:-4` puts it partly above the band, so it must be clipped
by the band's `overflow:hidden` (the SVG's own viewBox does this for free). It is the
only scene with two stacked halos and the only one whose centre alpha reaches `0.55`.

---

### Week V — "Why It Feels Worth It" · grey overcast, two ridges, a soft weight

| # | left | top | w | h | radius | fill | filter |
|---|---|---|---|---|---|---|---|
| 1 halo | `48` | `16` | `102` | `102` | `50%` | `radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)` | `blur(4px)` |
| 2 sun | `78` | `46` | `42` | `42` | `50%` | `#E9D2A4` | — |
| 3 cloud A | `232` | `52` | `48` | `13` | `8px` | `#D6D5D0` | — |
| 4 cloud B | `250` | `42` | `30` | `11` | `7px` | `#DDDCD5` | — |
| 5 cloud C | `224` | `62` | `28` | `9` | `6px` | `#D6D5D0` | — |
| 6 ridge 1 | `-40` | `152` | `473` | `110` | `50% 50% 0 0 / 48px 48px 0 0` | `#DEDDD6` | — |
| 7 ridge 2 | `-90` | `178` | `483` | `100` | `50% 50% 0 0 / 42px 42px 0 0` | `#CFCEC7` | — |
| 8 glint | `76` | `192` | `40` | `4` | `2px` | `rgba(255,255,255,0.6)` | — |
| 9 shadow | `230` | `188` | `70` | `16` | `50%` | `rgba(0,0,0,0.05)` | `blur(5px)` |
| 10 fade | `0` | *(bottom `0`)* | full | `44` | — | `linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)` | — |

```
swell(-40, 152, w + 80, 110, 48)
swell(-90, 178, w + 90, 100, 42)
```

Week V is the only scene whose clouds are **opaque grey solids** rather than translucent
white, and the only one with a wide (`70 × 16`) soft shadow and no object casting it —
the shadow stands in for the missing weight on the scale.

---

### Week VI — "Discipline" · two clip-path peaks, a snow cap, a summit flag

| # | left | top | w | h | radius / clip-path | fill | filter |
|---|---|---|---|---|---|---|---|
| 1 halo | `26` | `12` | `90` | `90` | `50%` | `radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)` | `blur(4px)` |
| 2 sun | `56` | `42` | `30` | `30` | `50%` | `#E9D2A4` | — |
| 3 cloud base | `238` | `38` | `39.6` | `9.9` | `8px` | `rgba(255,255,255,0.85)` | — |
| 4 cloud cap | `250.6` | `31.7` | `23.400000000000002` | `9` | `7px` | `rgba(255,255,255,0.75)` | — |
| 5 small peak | `20` | `128` | `190` | `132` | `polygon(50% 0, 100% 100%, 0 100%)` | `#E0DFDA` | — |
| 6 main peak | `112` | `60` | `212` | `200` | `polygon(50% 0, 100% 100%, 0 100%)` | `linear-gradient(180deg, #D2D1CA 0%, #C1C0B9 100%)` | — |
| 7 snow cap | `196` | `60` | `44` | `36` | `polygon(50% 0, 100% 100%, 72% 72%, 50% 96%, 28% 72%, 0 100%)` | `rgba(255,255,255,0.85)` | — |
| 8 shadow | `194` | `60` | `56` | `10` | `50%` | `rgba(0,0,0,0.08)` | `blur(4px)` |
| 9 mast | `214` | `24` | `4` | `38` | `2px` | `#B4B1AB` | — |
| 10 flag | `218` | `24` | `22` | `14` | `1px` | `#E9D2A4` | — |
| 11 foothill | `-40` | `212` | `473` | `70` | `50% 50% 0 0 / 28px 28px 0 0` | `#DEDDD6` | — |
| 12 fade | `0` | *(bottom `0`)* | full | `44` | — | `linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)` | — |

Clip paths resolved to explicit SVG paths (percentages expanded against each layer's own
`w × h`, in band-local coordinates):

Small peak — `polygon(50% 0, 100% 100%, 0 100%)` over `left 20, top 128, 190 × 132`:

```
M115 128L210 260L20 260Z
```

Main peak — `polygon(50% 0, 100% 100%, 0 100%)` over `left 112, top 60, 212 × 200`:

```
M218 60L324 260L112 260Z
```

Snow cap — `polygon(50% 0, 100% 100%, 72% 72%, 50% 96%, 28% 72%, 0 100%)` over
`left 196, top 60, 44 × 36`:

```
M218 60L240 96L227.68 85.92L218 94.56L208.32 85.92L196 96Z
```

Main-peak gradient: `linear-gradient(180deg, #D2D1CA 0%, #C1C0B9 100%)` — an
`x1=0 y1=0 x2=0 y2=1` linear gradient with stops `#D2D1CA @ 0` and `#C1C0B9 @ 1`, applied
over the peak's own bounding box (`objectBoundingBox`).

```
swell(-40, 212, w + 80, 70, 28)
```

Edge cases: the snow cap's apex is coincident with the main peak's apex at `(218, 60)`,
so any rounding drift shows as a notch — compute both from the same `218`. The mast base
at `top 24 + h 38 = 62` overlaps the apex by 2px on purpose; do not close the gap. The
main peak's base at `260` is 2px past the band bottom (`258`), so it must be clipped, not
shortened.

---

## f. Comparison against the current app

The app has **no week-overview screen**. The middle column below is read directly from
the files named; "n/a — not built" means the property has no counterpart in the app at
all, which is itself the finding.

### f.1 Route / ownership

| Property | Design | Current app | Verdict |
|---|---|---|---|
| Route for a week | one screen per week, `Week I…VI` | n/a — no route. Nearest: `src/app/journey/[chapter].tsx` (4 *chapters*, not 12 weeks) | **MISMATCH** |
| Screen taxonomy | 12 weeks × 7 lessons = 84 numbered lessons | `src/lib/curriculum.ts` + `src/content/interactiveLessons.ts`: **10 parts, 110 lessons**, weeks named `Part 0 · The Model` … `Part IX · Run the campaign`, day counts 7/23/20/9/6/17/10/5/9/4 | **MISMATCH** |
| Week titles | `Reset`, `Changing Your Mindset`, `In the Moment`, `Know Your Brain`, `Why It Feels Worth It`, `Discipline` | `Part 0 · The Model`, `Part I · Shrink the payoff`, `Part II · Fewer moments of choice`, `Part III · Survive the wave`, `Part IV · Make the cost felt in advance`, `Part V · Raise what watching would spend` | **MISMATCH** (no overlap) |
| Week subtitle | `Week I · Survive the nights and steady the basics.` etc. | `src/lib/lessonArt.ts` `weekHeading(n)` = `Week ${roman} · ${WORLDS[n].sub}` → `Week I · Motivation & framing`, `Week II · The body first`, `Week III · Rebuild the space`, `Week IV · The mind's tools`, `Week V · Deeper patterns`, `Week VI · Meaning & values` (from `src/lib/worlds.ts`) | **MISMATCH** (no overlap) |
| Lesson titles | 42 titles, `Surviving the Night` … `Damage Control` | 42 different titles, `The slip equation` … `Paying yourself for the wins` | **MISMATCH** (no overlap) |
| Lesson numbering | two-digit zero-padded, continuous `01`–`42` | `order` 0-based `0`–`41`, never rendered as a padded number | **MISMATCH** |
| `src/app/(app)/lifemap.tsx` | — | A values/why editor built from `Header` + `Field` + `Button` + `PressScale` pills; shares nothing with this screen but the `Screen` primitive | not a candidate owner |
| `src/lib/worlds.ts` | — | 10 worlds + 2 side-worlds with `hue` numbers `224…300`; the canvas has **no hue** anywhere on these frames | **MISMATCH** (the hue model is dead here) |

### f.2 Layout (design vs `ChapterBody` in `src/components/journey/JourneyScreens.tsx`, the closest existing template)

| Property | Design (canvas → −54) | Current app (`ChapterBody`) | Verdict |
|---|---|---|---|
| Back row position | `left 16`, `top 64 → 10` | `left: 16, top: 10` (`BackRow`) | match |
| Back row content | chevron **only** | chevron **plus** `AppText` `Back`, `sans('400')`, `fontSize 17`, `#55534E` | **MISMATCH** |
| Chevron | `11 × 19`, viewBox `0 0 11 19`, `d="M9.5 1.5L2 9.5l7.5 8"`, stroke `#55534E`, width `2.4` | identical | match |
| Title | `left 24`, `top 114 → 60`, `27px`, `600`, `-0.2`, `#1D1C1A` | `left: 24, top: 60, fontSize: 27, sans('600'), letterSpacing: -0.2, color '#1D1C1A'` | match |
| Subtitle | `left 24`, `right 60`, `top 158 → 104`, `14.5px`, `400`, `line-height 21`, `#55534E`, `text-wrap: pretty` | `left: 24, right: 60, top: 108, fontSize 14.5, lineHeight 21, sans('400'), '#55534E'`; no wrap-balance | **MISMATCH** (`108` vs `104`) |
| Scene band top | `214 → 160` | `top: 160` | match |
| Scene band height | `258` | `SCENE_H = 338` (`src/components/journey/WorldArt.tsx:43`) | **MISMATCH** |
| Scene band gradient | `linear-gradient(180deg, #F4F3F0 0%, #F3EEE1 58%, #F4F3F0 100%)` | same three stops in `band-` gradient | match |
| Scene bottom fade | `44` tall, `rgba(244,243,240,0) → #F4F3F0` | `Rect y={SCENE_H-44} height={44}` with `fade-` gradient | match |
| Row column left/right | `24` / `24` | `left: 24, right: 24` | match |
| First row top | `486 → 432` | `top: 512` | **MISMATCH** |
| Row pitch | `80` (`56` + `24` gap) | `56/60` + `RowGap` `24` | pitch matches for non-current rows only |
| Row count | **7** per week (4 + 3, scrolling) | fixed **3** (`rows: [ChapterRow, ChapterRow, ChapterRow]`) | **MISMATCH** |
| Row column scrolls | yes (312pt window, 536pt of content) | no — three rows, no scroll | **MISMATCH** |
| Footer band | `top 798 → 744`, height `54` | `bottom: 0, height: FOOTER_H = 54` | match |
| Footer gradient | `linear-gradient(180deg, #ECEBE6, #E7E6E0)` | `land-` gradient `#ECEBE6 → #E7E6E0` | match |
| Footer hills | `#CFD9E2` @ `left -30 / right 40% / top 30 / h 80 / ry 44`; `#C4D2DE` @ `left 35% / right -40 / top 38 / h 80 / ry 40` | `FOOTER_HILLS.landing = ['#CFD9E2','#C4D2DE']` with `swell(-30, 30, width*0.6+30, 80, 44)` and `swell(width*0.35, 38, width*0.65+40, 80, 40)` | match |
| Noise overlay | `opacity 0.07` | `opacity: 0.07` | match |
| Field colour | `#F4F3F0` | `#F4F3F0` | match |

### f.3 Row card

| Property | Design | Current app (`ChapterRowCard` / `RowGlyph`) | Verdict |
|---|---|---|---|
| Height, non-current | `56` | `56` | match |
| Height, current | `56` | `60` (`here ? 60 : 56`) | **MISMATCH** |
| Radius | `14` | `14` | match |
| Background | `#FFFFFF` | `#FFFFFF` | match |
| Padding | `0 16px` | `paddingHorizontal: 16` | match |
| Gap | `13` | `13` | match |
| Shadow, done/locked | `0 0 0 1px rgba(0,0,0,0.06)` | `'0 0 0 1px rgba(0,0,0,0.06)'` | match |
| Shadow, current | `0 0 0 2px #131313, 0 10px 24px rgba(40,38,32,0.12)` | `'0 0 0 2px #131313, 0 10px 22px rgba(40,38,32,0.12)'` | **MISMATCH** (`22` vs `24` blur) |
| Locked opacity | `1` | `0.6` | **MISMATCH** |
| Title size | `15.5` | `15.5` | match |
| Title weight, done | `500` | `500` | match |
| Title weight, current | `500` | `700` | **MISMATCH** |
| Title weight, locked | `500` | `500` | match |
| Title colour, done | `#1D1C1A` | `#1D1C1A` | match |
| Title colour, current | `#1D1C1A` | `#1D1C1A` | match |
| Title colour, locked | `#8B8882` | `#1D1C1A` (dimmed only by the card's `0.6` opacity) | **MISMATCH** |
| Trailing text | two-digit lesson number `01`–`42` | day-range/meta string (`'Days 1–7 · held'`, `'Day 13 of 30'`, `'×1'`) | **MISMATCH** |
| Trailing size | `12.5` | `12.5` | match |
| Trailing weight, done | `500` | `500` | match |
| Trailing weight, current | `600` | `600` | match |
| Trailing weight, locked | `500` | `500` | match |
| Trailing colour, done | `#8B8882` | `#8B8882` | match |
| Trailing colour, current | `#1D1C1A` | `#1D1C1A` | match |
| Trailing colour, locked | `#B0AEA8` | `#8B8882` | **MISMATCH** |

### f.4 Row glyphs

| Property | Design | Current app (`RowGlyph`) | Verdict |
|---|---|---|---|
| Done disc | `30 × 30`, `50%`, `#131313` | `30 × 30, borderRadius 15, #131313` | match |
| Done icon | `12 × 10`, viewBox `0 0 16 13`, `M1.5 7l4.4 4.5L14.5 1.5`, stroke `#F4F3F0` `2.8` round/round | identical | match |
| Current disc | `30 × 30`, `50%`, `#131313` | `32 × 32, borderRadius 16, #131313` | **MISMATCH** |
| Current icon | crescent moon, `13 × 13`, viewBox `0 0 24 24`, `M14 3 A9 9 0 1 0 21 12 A7.2 7.2 0 0 1 14 3Z`, fill `#F4F3F0` | a **boat**, `18 × 11.7`, viewBox `0 0 40 26`, `M21 3 L21 16 L12 16 Z` + `M7 18 L33 18 Q30 24 20 24 Q10 24 7 18 Z`, fill `#F4F3F0` | **MISMATCH** |
| Locked disc size | `30 × 30`, `50%` | `30 × 30, borderRadius 15` | match |
| Locked disc fill | `rgba(19,19,19,0.05)` | `#EDECE7` | **MISMATCH** |
| Locked disc ring | `inset 0 0 0 1.5px rgba(0,0,0,0.08)` | none | **MISMATCH** |
| Locked icon box | `12 × 13`, viewBox `0 0 16 17` | `11 × 13`, viewBox `0 0 14 16` | **MISMATCH** |
| Locked icon body | `rect x=3 y=7.5 w=10 h=7.5 rx=2 fill #A5A29B` | `Rect x=1.5 y=7 w=11 h=8 rx=2 fill #8B8882` | **MISMATCH** |
| Locked icon shackle | `M5.2 7.5 V5.6 a2.8 2.8 0 0 1 5.6 0 V7.5`, stroke `#A5A29B`, width `1.8`, `fill:none` | `M4 7V5a3 3 0 016 0v2`, stroke `#8B8882`, width `2`, `fill:none` | **MISMATCH** |

### f.5 Pips

| Property | Design | Current app (`RowGap`) | Verdict |
|---|---|---|---|
| Gap height | `24` | `24` | match |
| Pip left (row-column-relative) | `52 − 24 = 28` | `28` | match |
| Pip tops (gap-local) | `+5` / `+13` | `5` / `13` | match |
| Pip size | `3.5 × 3.5`, radius `1.75` | `3.5 × 3.5`, radius `1.75` | match |
| Pip fill | `rgba(40,38,32,0.2)` | `rgba(40,38,32,0.2)` | match |

### f.6 Scenes

| Property | Design | Current app (`ChapterScene` in `src/components/journey/WorldArt.tsx`) | Verdict |
|---|---|---|---|
| Number of scenes | 6 (one per week I–VI; 12 if the full deck is built) | 4 (`landing`, `crossing`, `highlands`, `watch`) | **MISMATCH** |
| Scene height | `258` | `SCENE_H = 338` | **MISMATCH** |
| Halo hue | `#E2BA78` (from `rgba(226,186,120,…)`) | `#E2BA78` | match |
| Halo alphas | `0.42` ×5 weeks, plus a second `0.55` on week IV | `HALO = { landing: 0.42, crossing: 0.42, highlands: 0.4, watch: 0.45 }` — no `0.55`, no doubled halo | **MISMATCH** |
| Sun fill | `#E9D2A4` | `#E9D2A4` | match |
| Mast / flag | `4 × N` `#B4B1AB` + `22 × 14` `#E9D2A4` `radius 1` | `Rect w=4 #B4B1AB` + `Rect w=20/18/10 h=12/11/7 rx=2 #E9D2A4` | **MISMATCH** (flag is `22 × 14`, `rx 1`, on all three weeks that carry one) |
| Swell colours | `#C8D7E5 / #D5E1EA / #EDE7D8 / #F2EDE0` (weeks I, III) and `#DEDDD6 / #CFCEC7` (weeks II, IV, V) | `#C8D7E5 / #D5E1EA / #EDE7D8 / #F2EDE0` present on `landing`; `#DEDDD6 / #D2D1CA` on `crossing`; `#D8D7D0 / #CBCAC3 / #C0BFB8` on `highlands` | partial — the ridge pair `#DEDDD6 / #CFCEC7` does not exist in the app |
| Clip-path peaks (week VI) | two triangles + a 6-point snow cap | nothing equivalent | **MISMATCH** |
| Grey clouds (week V) | `#D6D5D0` / `#DDDCD5` opaque | nothing equivalent | **MISMATCH** |
| `swell()` helper | needed | present and correct | reusable as-is |
| Blur folding into gradients | needed | present (`halo-`, `shade-`, `wake-`) | reusable as-is |

### f.7 Tokens

| Token used by the canvas | `src/lib/theme.ts` | Verdict |
|---|---|---|
| `#F4F3F0` field | `colors.bg` | same value — usable |
| `#FFFFFF` card | `colors.surface` | same value — usable |
| `#131313` disc/ring | `colors.ink` / `colors.accent` | same value — usable |
| `#1D1C1A` title ink | `colors.text` | same value — usable |
| `#55534E` subtitle | `colors.textMuted` | same value — usable |
| `#8B8882` locked title / done number | `colors.textSoft` | same value — usable |
| `#B0AEA8` locked number | **no token** — `colors.textSofter` is `#B4B1AB`, a different colour | **do not substitute**; hard-code `#B0AEA8` |
| `#A5A29B` padlock | **no token** | hard-code |
| `rgba(0,0,0,0.06)` card ring | `colors.hairline` | same value — usable |
| `rgba(19,19,19,0.05)` locked disc | **no token** — `colors.accentSoft` is `rgba(0,0,0,0.045)`, a different colour | **do not substitute**; hard-code |
| `radius 14` | `radius.md` = `14` | usable |
| weight `600` | `weight.semibold` = `'600'` | usable via `sans('600')` |
| weight `500` | `weight.medium` = `'500'` | usable via `sans('500')` |

---

## g. What must change — ordered

1. **`src/content/interactiveLessons.ts` (or a new `src/content/weeks.ts`) — author the week data.**
   Add the 12-week × 7-lesson model the canvas draws: per week a `title`, a `roman`
   numeral, a `line` (the sentence after the `·`), and 7 lesson titles. Weeks I–VI are
   fully specified in section (c) above; weeks VII–XII come from the six frames not in
   this spec's scope. Lesson numbers are `(n−1)·7 + i`, rendered zero-padded to two
   digits. **This is new data, not a rename** — none of the 42 canvas titles exists in
   the current curriculum, and the current curriculum's part boundaries (7/23/20/9/6/17…
   lessons) cannot be re-cut into sevens.

2. **`src/components/journey/WeekArt.tsx` (new) — the six scenes.**
   Export `WEEK_SCENE_H = 258` and `WeekScene({ week, width })` covering weeks I–VI,
   transcribing section (e) layer by layer in paint order. Reuse `swell()`, `roundRect()`
   and the halo/shade gradient recipe from `src/components/journey/WorldArt.tsx`; do not
   reuse `SCENE_H`, `HALO` or `ChapterScene` itself — every one of those values differs.
   Add the week-VI clip-path triangles as the three literal `d` strings given above.

3. **`src/components/journey/WeekOverview.tsx` (new) — the screen.**
   Layout, from the back row's own origin (canvas − 54):
   title `top 60`; subtitle `top 104`, `left 24`, `right 60`; scene `top 160`,
   `height 258`; row column `left 24, right 24, top 432, bottom 54` (the block is `852 − 54 = 798`
   tall and the footer band starts at `798 − 54 = 744`, so the column's window is
   `432 → 744`, i.e. `312`); footer band `bottom 0, height 54`.
   The row column is a `ScrollView` with `showsVerticalScrollIndicator={false}` holding
   all seven rows at the 80pt pitch. Reuse `ChapterFooter` with `scene="landing"` — its
   hill colours and geometry already match byte for byte.

4. **`src/components/journey/WeekOverview.tsx` — the row card.**
   Do **not** reuse `ChapterRowCard`. Build a `LessonRow` with: fixed `height: 56` in all
   states; `borderRadius 14`; `#FFFFFF`; `paddingHorizontal 16`; `gap 13`;
   `boxShadow` `'0 0 0 1px rgba(0,0,0,0.06)'` except current
   `'0 0 0 2px #131313, 0 10px 24px rgba(40,38,32,0.12)'`; **no opacity change when
   locked**; title `sans('500')` `15.5` with colour `#1D1C1A` (done, current) /
   `#8B8882` (locked); number `sans(current ? '600' : '500')` `12.5` with colour
   `#1D1C1A` (current) / `#8B8882` (done) / `#B0AEA8` (locked).

5. **`src/components/journey/WeekOverview.tsx` — the row glyph.**
   Do **not** reuse `RowGlyph`. Done: keep the existing `30 × 30` `#131313` disc and the
   `12 × 10` viewBox `0 0 16 13` tick verbatim. Current: `30 × 30` `#131313` disc with a
   `13 × 13` viewBox `0 0 24 24` moon `M14 3 A9 9 0 1 0 21 12 A7.2 7.2 0 0 1 14 3Z` filled
   `#F4F3F0` — replace the boat. Locked: `30 × 30` disc, background
   `rgba(19,19,19,0.05)`, `boxShadow: 'inset 0 0 0 1.5px rgba(0,0,0,0.08)'`, padlock
   `12 × 13` viewBox `0 0 16 17` with `rect x=3 y=7.5 w=10 h=7.5 rx=2 fill #A5A29B` and
   `M5.2 7.5 V5.6 a2.8 2.8 0 0 1 5.6 0 V7.5` stroked `#A5A29B` at `1.8`.

6. **`src/components/journey/JourneyScreens.tsx:162–176` — the back row.**
   The week frames carry a chevron with **no** word. Either add a `label` prop to
   `BackRow` (defaulting to `'Back'` so the four chapter screens are untouched) and pass
   `undefined` from the week screen, or give the week screen its own chevron-only row.
   Do not change the chapter screens' label.

7. **`src/app/week/[n].tsx` (new) — the route.**
   Mirror `src/app/journey/[chapter].tsx`: `StatusBar style="dark"`, no tab bar (the land
   band runs to the frame bottom and a bar would sit on it), `onBack` falling back to
   `/(app)/library`. Parse `n` as `1…12`, clamping out of range.

8. **`src/app/(app)/library.tsx` / `src/app/lessons-browser.tsx` — wire the entry.**
   A week heading in the browser should push `/week/[n]`. `src/lib/lessonArt.ts`
   `weekHeading()` currently composes `Week ${roman} · ${WORLDS[n].sub}` from
   `src/lib/worlds.ts`; point it at the new week data instead so the subtitle on the
   overview and the heading in the browser read the same string.

9. **`src/lib/worlds.ts` — leave alone, but stop treating it as the week source.**
   Its `hue` values (`224…300`) have no counterpart on any of these twelve frames, and
   its `sub` strings are not the canvas's week lines. Step 8 removes the last read of it
   for week naming; the file stays for `src/lib/lessonArt.ts`'s other consumers and
   `src/app/lesson-overview/[slug].tsx`.

10. **Nothing to do in `src/app/(app)/lifemap.tsx`.** It is a Life Map values editor and
    shares no structure with this screen. It was listed as a comparison target and is
    recorded here as "no overlap" so the next reader does not re-derive that.

---

### Contradictions found in the canvas

One, and it is minor: the back row declares `display:flex; align-items:center; gap:9px`
but contains a single child, so the `9px` gap paints nothing. The evidence — twelve
frames, zero text nodes in that div, and the raw HTML confirming it — supports rendering
the chevron alone. The `gap` is a leftover from the chapter frames
(`Journey-Chapter-*.html`), which do carry the word "Back".
