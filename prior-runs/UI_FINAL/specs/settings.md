# Spec — Settings, and the three screens it hands off to

| Sticky | Frame (`data-screen-label`) | Split file | Target app file |
| --- | --- | --- | --- |
| 92 | `Settings` | `.uifinal/final/Email Login/Settings.html` | `src/app/(app)/settings.tsx` |
| 92D | `Sheet Sign Out` | `.uifinal/final/Email Login/Sheet-Sign-Out.html` | `src/app/(app)/settings.tsx` |
| 93D | `Settings Weekly Report` | `.uifinal/final/Email Login/Settings-Weekly-Report.html` | `src/app/(app)/settings.tsx` (ledger) — the frame is really `src/app/weekly-report.tsx` |
| 92B | `Settings Check-in Time` | `.uifinal/final/Email Login/Settings-Check-in-Time.html` | `src/app/routines/night-time.tsx` + `src/components/routines/kit.tsx` + `src/components/routines/wheel.tsx` |

Pretty-printed sources read for this spec:
`.uifinal/pretty/final/Email Login/{Settings,Sheet-Sign-Out,Settings-Weekly-Report,Settings-Check-in-Time}.html`,
`.uifinal/pretty/prev/Email Login/Settings.html`, `.uifinal/diffs/Settings.html.diff`.

Bundle status (`.uifinal/diff-email-login.txt`): `Settings` **CHANGED** (6307 → 8420,
+2113). `Settings Weekly Report`, `Settings Check-in Time` and `Sheet Sign Out` are
**ADDED** — there is no prev frame and no diff for those three.

> Every canvas `top` includes the frame's 54px status bar, which the app never
> builds. Each table below gives **canvas top** and **app top = canvas − 54**.

---

## 0. Shared frame chrome (all four frames)

| Property | Value |
| --- | --- |
| frame | `width:393px; height:852px; position:relative; overflow:hidden` |
| frame background | `#F4F3F0` |
| frame font stack | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` |
| smoothing | `-webkit-font-smoothing:antialiased` |
| frame shadow (canvas chrome only, never build) | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` |
| noise layer | `position:absolute; inset:0; background-image:url('noise-dark.png'); opacity:0.07; pointer-events:none` |
| status bar | `top:0; left:0; right:0; height:54px; display:flex; align-items:center; justify-content:space-between; padding:6px 32px 0 46px; box-sizing:border-box; z-index:20` |

**`Settings`, `Sheet Sign Out` and `Settings Weekly Report` all carry the noise layer.
`Settings Check-in Time` does NOT** — its first child is the status bar. That is not an
omission in transcription; the file has no noise div. The app agrees (`RoutineShell`
paints no noise).

### The back row — identical in all four frames

| Property | Design value |
| --- | --- |
| container | `position:absolute; left:16px; top:64px; display:flex; align-items:center; gap:9px` |
| app top | `10` |
| chevron | `<svg width="11" height="19" viewBox="0 0 11 19">` |
| chevron stroke | `#55534E`, `stroke-width:2.4`, `stroke-linecap:round`, `stroke-linejoin:round`, `fill:none` |
| label size / weight / colour | `17px` / `400` / `#55534E` |
| label text | `Settings`: **Back** · `Sheet Sign Out`: **Back** · `Settings Weekly Report`: **Settings** · `Settings Check-in Time`: **Settings** |

```
M9.5 1.5L2 9.5l7.5 8
```

### The list chevron — every disclosure row in every frame

```
M1 1l6 6-6 6
```
`<svg width="8" height="14" viewBox="0 0 8 14">`, `fill:none`, `stroke:#B0AEA8`,
`stroke-width:2`, `stroke-linecap:round`, `stroke-linejoin:round`.

---

## 1. Frame 92 · `Settings`

### 1.1 What the diff did to this frame

Read from `.uifinal/diffs/Settings.html.diff` against `.uifinal/pretty/prev/Email Login/Settings.html`:

| Change | Prev | Final |
| --- | --- | --- |
| top-left / top-right affordance | `Done`, `right:16px; top:78px; 17px/400/#3A3934` | back row (chevron + `Back`) at `left:16px; top:64px` — **`Done` is deleted** |
| title top | `70px` | `114px` |
| section 1 | `Progress` @134, card @160, toggle row `padding:16px 18px` | `Reminders` @158, card @184, `padding:4px 0`, two 52-tall rows |
| section 2 | `Daily reminder` @254, card @280, one reminder-time row | *(gone)* — folded into `Reminders` |
| section 3 | `Anchors` @380, card @406, rows 52 tall: `Edit your Life Map` / `Find support` / `Medallions` | `Anchors` @318, card @344, rows **48** tall: `Your vow` / `Your letter` (`Opens Week XII`) / `Weekly reports` (`Every Sunday`) |
| new section | — | `Privacy` @518, card @544, rows 50 tall: `App lock` (`Face ID`) / `Data & privacy` |
| section 4 | `Account` @600, card @626, `padding:6px 18px 14px`, Name/Email 40-tall records + outlined 42-tall Sign-out pill | `Account` @674, card @700, `padding:4px 0`, rows **46** tall `Edit profile` / `Manage subscription`, then a **44-tall centred `Sign out` text link**, `15.5px/600/#8B8882` |
| sign-out treatment | `margin-top:8px; height:42px; border-radius:21px; background:#F4F3F0; box-shadow:0 0 0 1.5px rgba(0,0,0,0.2)`, label `15px/600/#55534E` | no box at all — `height:44px; justify-content:center`, label `15.5px/600/#8B8882` |
| toggle | 44×26 `#131313` track, 20×20 `#ffffff` knob inset 3 | **removed from the frame entirely** |

### 1.2 Vertical skeleton

| Element | Canvas top | App top | Height | Bottom (canvas) |
| --- | --- | --- | --- | --- |
| back row | 64 | 10 | 19 (chevron) | 83 |
| title `Settings` | 114 | 60 | 27px type, no `line-height` declared | — |
| caption `Reminders` | 158 | 104 | 13px type | — |
| card A | 184 | 130 | **113** = 4 + 52 + 1 + 52 + 4 | 297 |
| caption `Anchors` | 318 | 264 | — | — |
| card B | 344 | 290 | **154** = 4 + 48 + 1 + 48 + 1 + 48 + 4 | 498 |
| caption `Privacy` | 518 | 464 | — | — |
| card C | 544 | 490 | **109** = 4 + 50 + 1 + 50 + 4 | 653 |
| caption `Account` | 674 | 620 | — | — |
| card D | 700 | 646 | **146** = 4 + 46 + 1 + 46 + 1 + 44 + 4 | 846 |

Derived rhythm (this is the load-bearing part):

* caption top → its own card top = **26**, all four times.
* card bottom → next caption top = **21** (A→Anchors), **20** (B→Privacy), **21** (C→Account).
* last card bottom 846 on an 852 frame ⇒ **6px** of slack. The frame draws **no tab bar**.

### 1.3 Type and colour

| Element | Family | Weight | Size | Line-height | Tracking | Transform | Colour |
| --- | --- | --- | --- | --- | --- | --- | --- |
| title | frame stack | 600 | 27px | *(not declared)* | −0.2px | none | `#1D1C1A` |
| back label | frame stack | 400 | 17px | — | — | none | `#55534E` |
| section caption | frame stack | 600 | 13px | — | — | **none — sentence case, not caps** | `#55534E` |
| row title | frame stack | 500 | 16px | — | — | none | `#1D1C1A` |
| row detail | frame stack | *(not declared → 400)* | **13px** | — | — | none | `#8B8882` |
| time-chip value | frame stack | 600 | 15px | — | — | none | `#1D1C1A` |
| sign-out link | frame stack | 600 | **15.5px** | — | — | none | `#8B8882` |

No `max-lines`, no `opacity`, no `text-transform`, no `text-align` anywhere in this
frame except the sign-out row's `justify-content:center`.

### 1.4 Card box

| Property | Value |
| --- | --- |
| position | `absolute; left:12px; right:12px` → width **369** on a 393 frame |
| radius | `border-radius:16px` — all four corners, no per-corner override |
| background | `#FFFFFF` (flat; no gradient, no blend mode, no backdrop blur) |
| padding | `4px 0` with `box-sizing:border-box` |
| border | none |
| shadow | none |

### 1.5 Rows

Common to every row: `display:flex; align-items:center; justify-content:space-between; padding:0 18px`.
Content width = 369 − 36 = **333**.

| # | Card | Row | Height | Right side |
| --- | --- | --- | --- | --- |
| 1 | A `Reminders` | `Morning check-in` | 52 | cluster: `display:flex; align-items:center; gap:10px` → time chip `8:00 AM` + chevron |
| 2 | A | `Night check-in` | 52 | cluster gap 10 → time chip `9:30 PM` + chevron |
| 3 | B `Anchors` | `Your vow` | 48 | chevron only, as a **direct** flex child (no wrapper, no gap) |
| 4 | B | `Your letter` | 48 | cluster gap 10 → detail `Opens Week XII` + chevron |
| 5 | B | `Weekly reports` | 48 | cluster gap 10 → detail `Every Sunday` + chevron |
| 6 | C `Privacy` | `App lock` | 50 | cluster gap 10 → detail `Face ID` + chevron |
| 7 | C | `Data & privacy` (`Data &amp; privacy`) | 50 | chevron only, direct child |
| 8 | D `Account` | `Edit profile` | 46 | chevron only, direct child |
| 9 | D | `Manage subscription` | 46 | chevron only, direct child |
| 10 | D | `Sign out` | 44 | — `justify-content:center`, `cursor:pointer`, no chevron, no background, no border |

**Time chip** (rows 1–2): `height:32px; border-radius:16px; background:#EDECE7; display:flex; align-items:center; padding:0 14px`.

**Divider**: `height:1px; background:rgba(0,0,0,0.06); margin:0 18px` → inset 18 both
sides, drawn width 333. One after rows 1, 3, 4, 6, 8 and 9 — so card D reads
`row 46 · hairline · row 46 · hairline · row 44`, i.e. the `Sign out` row **does** carry
a hairline above it.

### 1.6 States the frame shows

Default only. No pressed, disabled, selected or empty state is drawn; the only
interaction hint in the whole frame is `cursor:pointer` on the sign-out row. Nothing
in the frame licenses a pressed-scale value — the app's existing `PressScale` (0.96 over
110ms) is not contradicted by anything here.

---

## 2. Frame 92D · `Sheet Sign Out`

### 2.1 The background disagrees with frame 92 — read this first

`Sheet Sign Out` paints a **third** version of the Settings list underneath its scrim,
matching neither prev nor final:

| | prev `Settings` | final `Settings` (92) | `Sheet Sign Out` background |
| --- | --- | --- | --- |
| caption 1 | `Progress` @134 | `Reminders` @158 | `Reminders` **@168** |
| card 1 top | 160 | 184 | **194** |
| card 1 rows | toggle row | 52 / 52, chip **+ chevron** | 52 / 52, chip, **no chevron** |
| caption 2 | `Anchors` @380 | `Anchors` @318 | `Anchors` **@330** |
| card 2 rows | Life Map / Find support / Medallions, 52 tall | Your vow / Your letter / Weekly reports, **48** tall | Your vow / Your letter / **Medallions**, **52** tall |
| `Privacy` group | absent | present @518 | **absent** |
| `Account` card | record idiom, `padding:6px 18px 14px` | list idiom, `padding:4px 0` | record idiom @574, `padding:6px 18px 14px`, **plus** a 44-tall `Manage subscription` row |
| sign out | 42-tall outlined pill | 44-tall centred text link | **42-tall outlined pill** |

**Which reading the evidence supports:** frame 92 is the authority for the settings
list. It is the frame the bundle marks CHANGED, its diff shows the pill → text-link and
record → list moves as deliberate edits, and it is the only frame carrying the `Privacy`
group. `Sheet Sign Out` was drawn against an in-between state of the list and is
authoritative **only for the scrim and the sheet**. Do not transcribe its background.

### 2.2 Scrim

| Property | Value |
| --- | --- |
| box | `position:absolute; inset:0` |
| fill | `rgba(19,19,19,0.45)` |
| z-index | `30` |
| blend mode / backdrop blur | none declared |

### 2.3 Sheet

| Property | Value |
| --- | --- |
| box | `position:absolute; left:0; right:0; bottom:0` |
| radius | `border-radius:24px 24px 0 0` (top-left 24, top-right 24, bottom 0, bottom 0) |
| background | `#F4F3F0` |
| shadow | `0 -12px 40px rgba(19,19,19,0.3)` |
| z-index | `31` |
| padding | `10px 20px 30px` with `box-sizing:border-box` → content width **353** |
| height | content-driven; the frame draws **no home indicator**, so `30` is the literal bottom padding |

Content stack, top to bottom:

| Element | Box | Type |
| --- | --- | --- |
| grabber | `width:36px; height:5px; border-radius:3px; background:rgba(19,19,19,0.15); margin:0 auto` | — |
| title | `margin-top:16px; text-align:center` | `17px` / `600` / `#1D1C1A` — “Sign out?” |
| body | `margin-top:10px; text-align:center; padding:0 12px` → 329 wide | `14.5px` / *(weight not declared → 400)* / `line-height:21px` / `#55534E` — “Your log, letters and medallions stay saved to sam@example.com.” |
| primary | `margin-top:18px; height:54px; border-radius:27px; background:#131313; display:flex; align-items:center; justify-content:center` | label `17px` / `600` / `#FFFFFF` — “Sign out” |
| secondary | `margin-top:14px; text-align:center` | `15px` / `500` / `#8B8882` — “Stay signed in” |

No border, no icon, no destructive red anywhere. The body line is the only place the
signed-in email is echoed.

---

## 3. Frame 93D · `Settings Weekly Report`

**`Settings Weekly Report` is byte-identical to the already-shipped `Weekly Report`
frame except for one span.** Verified with `diff`:

```
1c1
< <div data-screen-label="Weekly Report" ...
> <div data-screen-label="Settings Weekly Report" ...
91c91
<       · Back
>       · Settings
```

So the entire design delta for this sticky is: **the back label reads `Settings` when the
report is opened from Settings.** Everything below is transcribed anyway so the table can
be checked against the app rather than asserted.

### 3.1 Standing header

| Element | Canvas | App top | Design value |
| --- | --- | --- | --- |
| back row | `left:16; top:64` | 10 | see §0; label **`Settings`** |
| week label | `right:20; top:68` | 14 | `14px` / `500` / `#8B8882` — “Jul 14–20” (`Jul 14&ndash;20`) |
| title | `left:24; top:114` | 60 | `27px` / `600` / `letter-spacing:-0.2px` / `line-height:1` / `#1D1C1A` |
| subtitle | `left:24; top:157` | 103 | `14.5px` / `400` / `#8B8882` |
| lamp box | `right:16; top:100; width:88; height:78` | 46 | see §3.3 |
| chip row | `left:24; top:212; display:flex; gap:8px` | 158 | chips below |
| page dots | `left:0; right:0; top:684; justify-content:center; gap:8px` | 630 | 7×7, `border-radius:50%`; active `#131313`, rest `rgba(19,19,19,0.16)` |

Chip: `height:27px; border-radius:14px; background:#FFFFFF; box-shadow:0 0 0 1px rgba(0,0,0,0.08); padding:0 12px`, label `13px`/`600`/`#1D1C1A`. Texts: `7 check-ins`, `3 urges`, `0 relapses`.

### 3.2 Score page furniture

| Element | Canvas | App top | Design value |
| --- | --- | --- | --- |
| section title | `left:24; top:294` | 240 | `20px` / `600` / `letter-spacing:-0.1px` / `#1D1C1A` — “Recovery score” |
| trend pill | `right:24; top:288; height:30; border-radius:15; background:#FFFFFF; box-shadow:0 0 0 1px rgba(0,0,0,0.1); gap:6; padding:0 12` | 234 | label `12px`/`600`/`#1D1C1A` — “steady climb” |
| trend glyph | `<svg width="13" height="9" viewBox="0 0 14 10">` | — | stroke `#1D1C1A`, `stroke-width:1.8`, round cap+join, `fill:none` |
| axis labels | `left:16; top:362 / 426 / 490` | 308 / 372 / 436 | `11.5px` / `500` / `#B0AEA8` — `1,240` `1,220` `1,200` |
| day letters | `left:50; right:16; top:564; justify-content:space-between` | 510 | `12px` / `500` / `#8B8882` — M T W T F S S |
| reading pill | `left:352; top:330; transform:translateX(-50%); height:28; border-radius:14; background:#131313; padding:0 12; box-shadow:0 6px 14px rgba(19,19,19,0.22); z-index:6` | 276 | label `12.5px`/`600`/`#FFFFFF` — `1,240` |
| verdict card | `left:16; right:16; top:592; height:76; border-radius:18; background:#FFFFFF; box-shadow:0 0 0 1px rgba(0,0,0,0.06), 0 10px 24px rgba(40,38,32,0.06); gap:12; padding:0 14` | 538 | — |
| verdict disc | `38×38; border-radius:50%; background:#131313` | — | glyph `16×11` on `viewBox="0 0 16 11"`, stroke `#FFFFFF`, `1.9`, round |
| verdict title / sub | `flex-shrink:0` column | — | `13.5px`/`600`/`#1D1C1A`; sub `margin-top:2px`, `11.5px`/`400`/`#8B8882` |
| verdict body | `flex:1; padding-left:8px` | — | `12.5px` / `400` / `line-height:17px` / `#55534E` |

```
M1 8.5L5 4.5l2.5 2L12.5 1.5
```
```
M1.5 9.5L6 5l3 2.5L14.5 1.5
```
```
M10.8 1.5h3.7V5.2
```

### 3.3 Desk lamp

Box `position:absolute; right:16px; top:100px; width:88px; height:78px` (app top 46).

Glow, drawn as a **div**, not SVG: `left:4px; top:-2px; width:56px; height:56px;
border-radius:50%; background:radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%); filter:blur(3px)`
→ centre (32, 26) in lamp-box coordinates, radius 28, stops **0 → rgba(226,186,120,0.45)**
and **0.74 → rgba(226,186,120,0)**.

`<svg width="88" height="78" viewBox="0 0 88 78" style="position:absolute; inset:0">`

Gradients:

| id | type | coords | stops |
| --- | --- | --- | --- |
| `wrTh1a` | linear | `x1=0 y1=0 x2=0 y2=1` | `0 #4A4843`, `1 #1D1C19` |
| `wrTh1b` | linear | `x1=0 y1=0 x2=1 y2=1` | `0 #E6E5DE`, `1 #C3C2BB` — **declared and never referenced** |
| `wrTh1c` | linear | `x1=0 y1=0 x2=1 y2=1` | `0 #FFFFFF`, `1 #E8E7E0` |

| Shape | Geometry | Paint |
| --- | --- | --- |
| lamp shadow | `ellipse cx=28 cy=67 rx=15 ry=2.6` | `rgba(40,38,32,0.13)` |
| book shadow | `ellipse cx=66 cy=69 rx=19 ry=2.8` | `rgba(40,38,32,0.13)` |
| stem | `rect x=26.8 y=34 w=2.6 h=30 rx=1.3` | `#C4C3BC` |
| shade | `circle cx=28 cy=27 r=8.5` | `url(#wrTh1a)` |
| shade highlight | path below | `stroke rgba(255,255,255,0.22)`, `1.6`, round cap, `fill:none` |
| base | `rect x=20 y=63 w=16 h=2.6 rx=1.3` | `#C4C3BC` |
| book spine | `rect x=58 y=43 w=16 h=6.5 rx=2.4` | `url(#wrTh1a)` |
| book | `rect x=50 y=50 w=34 h=16 rx=3` | `url(#wrTh1c)`, `stroke rgba(0,0,0,0.14)`, `1` |
| page rule | path below | `stroke rgba(0,0,0,0.1)`, `1.4`, round cap |
| foot L | `rect x=53 y=66 w=2.4 h=4` | `#C4C3BC` |
| foot R | `rect x=78.6 y=66 w=2.4 h=4` | `#C4C3BC` |

```
M22.5 24.5 A7 7 0 0 1 28 21.5
```
```
M56 58 L78 58
```

---

## 4. Frame 92B · `Settings Check-in Time`

**Also a one-span clone.** `diff Settings-Check-in-Time.html Nightly-Check-in-Time.html`
returns only the `data-screen-label` and the back label (`Settings` vs `Back`). The
whole design delta is the contextual back label.

| Element | Canvas top | App top | Design value |
| --- | --- | --- | --- |
| back row | 64 | 10 | §0, label **`Settings`** |
| question | 132 | 78 | `left:0; right:0; text-align:center`, `22px` / `500` / `#1D1C1A` — “When should the nightly check-in come?” |
| `Select time` | 208 | 154 | centred, `14.5px` / `600` / `#2A2924` |
| selection band | 335 | 281 | `left:46px; width:301px; height:44px; border-radius:11px; background:rgba(0,0,0,0.08)` |
| hour column | 250 | 196 | `left:105px; width:40px; text-align:center` |
| minute column | 250 | 196 | `left:172px; width:50px; text-align:center` |
| period column | 337 | 283 | `left:238px; width:60px; text-align:center` |
| `Select days` | 508 | 454 | centred, `14.5px` / `600` / `#2A2924` |
| day chips | 548 | 494 | `left:34px; right:34px; display:flex; justify-content:space-between` |
| note | 676 | 622 | `left:36px; right:36px; text-align:center`, `15px` / `400` / `line-height:22px` / `#55534E` / `text-wrap:pretty` |
| CTA | 744 | 690 | `left:16px; width:361px; height:48px; border-radius:25px; background:#131313` |

Wheel rows, straight off the frame:

| Distance from selection | Size | `line-height` | Colour |
| --- | --- | --- | --- |
| 0 (selected) | `30px` | `44px` | `#1D1C1A` |
| ±1 | `22px` | `29px` | `rgba(90,88,82,0.55)` |
| ±2 | `21px` | `29px` | `rgba(120,117,110,0.5)` |
| ±3 | `20px` | `29px` | `rgba(140,137,130,0.45)` |

Column stack is 3 rows above + selected + 3 below (7 rows), no weight declared → 400.
Period column shows only `AM` (±1 tone) and `PM` (selected) — nothing above or below.

Day chip: `width:38px; height:38px; border-radius:50%; background:#131313;
display:flex; align-items:center; justify-content:center; font-size:14px;
font-weight:600; color:#F4F3F0`. Labels `Su M Tu W Th F Sa`. **All seven are drawn
selected** — the frame never shows an unselected chip, so the off-state fill and label
colour are not specified by this frame.

CTA label: `17.5px` / `600` / `#FFFFFF`, and the frame declares tracking twice —
`letter-spacing:0.3px;` then `letter-spacing:0.2px;`. **Canvas contradicts itself.** CSS
last-declaration-wins ⇒ the effective value is **0.2px**, which is also what the app
already uses.

Pressed state: `style-active="transform:scale(0.99);"` — the only pressed value in this
whole screen family.

### 4.1 A second canvas contradiction — the hour column

The hour column reads, top to bottom: `7`, `11`, `12`, **`10`**, `11`, `12`, `1`. Below
the selection that is correct for a wrapping 1–12 wheel (10 → 11 → 12 → 1). Above it,
`7 / 11 / 12` is impossible: three rows above a selected `10` must read `7 / 8 / 9`.
**Evidence supports the app's reading** (`HOURS = 1…12`, looped, in
`components/routines/wheel.tsx`); the frame's upper rows are a drawing slip and must not
be transcribed.

---

## 5. Visualization — the recovery-score chart (frame 93D)

### 5.1 Coordinate system

`<svg width="393" height="220" viewBox="0 0 393 220" style="position:absolute; left:0; top:340px">`
→ **app top 286**, 1:1 user-units to px on a 393-wide frame. The plot gutters are 50 left
and 16 right (gridlines run x 50 → 377); the data band is x 56 → 352.

### 5.2 Gridlines, axis, guide

| Element | Geometry | Paint |
| --- | --- | --- |
| gridline 1 | `x1=50 y1=30 x2=377 y2=30` | `rgba(19,19,19,0.07)`, `stroke-width:1`, no dash |
| gridline 2 | `x1=50 y1=94 x2=377 y2=94` | same |
| gridline 3 | `x1=50 y1=158 x2=377 y2=158` | same |
| end guide | `x1=352 y1=16 x2=352 y2=195` | `rgba(19,19,19,0.14)`, `stroke-width:1`, `stroke-dasharray="3 5"` |

Gridline spacing **64px = 20 score points** (labels 1,240 / 1,220 / 1,200), so
**1 point = 3.2px**. Axis label boxes sit at canvas y 362 / 426 / 490 = svg-local
22 / 86 / 150, i.e. the 11.5px label box starts 8px above its gridline. Only three ticks;
no x-axis rule, no tick marks, no axis line. The x labels are the seven day letters in a
separate `justify-content:space-between` row (§3.2), not part of the SVG.

The floor of the fill and of the dashed guide is **y 195**; the drawn low point is y 178.

### 5.3 Series

Area fill:

```
M56,178 C110,170 150,158 200,132 C250,106 310,60 352,30 L352,195 L56,195 Z
```

Line:

```
M56,178 C110,170 150,158 200,132 C250,106 310,60 352,30
```

| Property | Value |
| --- | --- |
| line stroke | `#131313` |
| stroke width | `2.4` |
| line cap | `round` (no `stroke-linejoin` declared) |
| dash | none |
| fill gradient | `linearGradient id="wr3F" x1=0 y1=0 x2=0 y2=1`; stop `0` = `rgba(19,19,19,0.10)`, stop `1` = `rgba(19,19,19,0)` |
| clip path / mask | none |
| end point outer | `circle cx=352 cy=30 r=9`, fill `#F6F5F2`, stroke `rgba(19,19,19,0.22)`, `stroke-width:1.5` |
| end point inner | `circle cx=352 cy=30 r=4.5`, fill `#131313` |
| intermediate points | not drawn |

The canvas curve is two hand-drawn cubics over sample data — it is **not** a
seven-point series; only the endpoints (56,178) and (352,30) and the 20-point gridline
quantisation are real constraints.

### 5.4 Domain → pixel mapping the app must keep

`src/app/weekly-report.tsx` already generalises the frame:

* `px(x) = 50 + (x − 50) × (width − 66) / 327` — the 50/16 gutters hold at any width, only the interior stretches.
* `y(v) = 30 + (top − v) × 64 / step`, `top = ceil(hi / step) × step`, `step` chosen from `[10,20,25,50,100,200,250,500,1000]` — the frame's own step is **20**.
* seven samples at `x = 56 + i × (352 − 56) / 6`, i.e. every **49.333px**.
* Catmull-Rom tangents (`smoothPath`) stand in for the frame's two hand cubics.

### 5.5 Rendering at the edges

| Case | Behaviour required |
| --- | --- |
| no data at all | the report never opens — `hasReportContent` false ⇒ the empty board (“Your first week is still being written…”) |
| week closed, nothing logged | same empty board, copy “Nothing was logged that week…” |
| flat week (`hi == lo`) | `range` floors at 20 ⇒ step 20 ⇒ line sits flat on the top gridline; trend pill reads “holding”, verdict body “A flat week. Same anchors, nothing new.” |
| falling week | trend pill “a dip, then back”, verdict title uses `−` (U+2212), body “The week gave some back. One anchor at a time.” |
| min / max | the axis rescales; the top gridline is the first multiple of `step` at or above `hi`, the floor stays y 195 |
| end point high or low | the dashed guide runs `endY − 14 → 195` and the reading pill's top is `286 + endY − 40`, so both ride the dot instead of pinning to y 30 |
| overflow (span > 148px at every step) | falls through to the largest step, 1000 |

---

## 6. Comparison — frame 92 `Settings` vs `src/app/(app)/settings.tsx`

| Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- |
| screen background | `#F4F3F0` | `colors.bg` = `#F4F3F0` | match |
| noise layer | `inset:0`, opacity `0.07` | `Image noiseDark`, absolute inset, `opacity: 0.07` | match |
| top-left affordance | back row: 11×19 chevron `#55534E`/2.4 + `Back` 17/400/`#55534E`, `left 16`, app top **10**, gap 9 | none | **MISMATCH** |
| top-right affordance | none (`Done` deleted by the diff) | `Done`, `right 16`, top 24, 17/400/`#3A3934` | **MISMATCH** |
| title top | app **60** | `16` | **MISMATCH** |
| title left / size / weight / tracking / colour | 16 / 27 / 600 / −0.2 / `#1D1C1A` | 16 / 27 / 600 / −0.2 / `#1D1C1A` | match |
| first caption top | app **104** | `80` (header `View` is 80 tall) | **MISMATCH** (24 short) |
| caption style | 13 / 600 / `#55534E`, left 16 | `sans('600')`, 13, `#55534E`, `paddingHorizontal 16` | match |
| caption → card gap | 26 | caption box `height: 26` | match |
| card bottom → next caption | **21 / 20 / 21** | `Section gap` = 36 (28 before `Plan`, 0 before `Account`) | **MISMATCH** |
| card inset | `left 12 / right 12` | `marginHorizontal: 12` | match |
| card radius / background | 16 / `#FFFFFF` | 16 / `#FFFFFF` | match |
| card padding | `4px 0` on **all four** cards | 4 vertical on Anchors/Check-ins/Security/Plan; none on Progress & Daily reminder; `6 / 14 / 18` on Account | **MISMATCH** |
| section list | Reminders · Anchors · Privacy · Account (4) | Progress · Daily reminder · Anchors · Check-ins · Security & privacy · Plan · Account (7) | **MISMATCH** |
| card A rows | `Morning check-in` 52, `Night check-in` 52 | `Check-ins`: `Morning check-in`, `Nightly check-in`, both `Row` height 52 | **MISMATCH** (label “Nightly”, and the group is 4th not 1st) |
| card A value control | pill `h32 r16 #EDECE7 pad 0 14`, `15/600/#1D1C1A`, **then a chevron**, gap 10 | plain detail text `14/400/#8B8882` + chevron | **MISMATCH** |
| the pill that does exist | — | `Daily reminder` row: `h32 r16 #EDECE7 pad 0 14`, `15/600/#1D1C1A`, **no chevron** | **MISMATCH** (right box, wrong row) |
| morning value shown | `8:00 AM` | `formatTime(routines.morning)`, default `7:00 AM` | **MISMATCH** (default) |
| night value shown | `9:30 PM` | default `10:00 PM` | **MISMATCH** (default) |
| card B row height | **48** | `Row` fixed `height: 52` | **MISMATCH** |
| card B rows | `Your vow` · `Your letter` + `Opens Week XII` · `Weekly reports` + `Every Sunday` | `Edit your Life Map` · `Find support` · `Medallions` · `Open urge surf with a Back Tap` | **MISMATCH** |
| card C row height | **50** | 52 | **MISMATCH** |
| card C rows | `App lock` + detail `Face ID` · `Data & privacy`; caption `Privacy` | `App lock · Face ID` (one string, no detail slot) · `Data & privacy`; caption `Security & privacy` | **MISMATCH** |
| card D row heights | 46 / 46 / 44 | `AccountLine` 40 / 40, pill 42 | **MISMATCH** |
| card D rows | `Edit profile` › · `Manage subscription` › · centred `Sign out` | `Name` / value · `Email` / value · outlined `Sign out` pill | **MISMATCH** |
| sign-out treatment | `h44`, centred, `15.5/600/#8B8882`, no box | `marginTop 8`, `h42`, `r21`, bg `#F4F3F0`, `boxShadow '0 0 0 1.5px rgba(0,0,0,0.2)'`, `15/600/#55534E` | **MISMATCH** |
| sign-out behaviour | frame 92D: opens a confirmation sheet | signs out immediately, then `router.replace('/')` | **MISMATCH** |
| row title type | 16 / 500 / `#1D1C1A` | `sans('500')`, 16, `#1D1C1A`, `flex: 1` | match |
| row detail type | **13** / 400 / `#8B8882` | **14** / 400 / `#8B8882` | **MISMATCH** |
| detail → chevron gap | 10 | 10 | match |
| chevron | 8×14, `M1 1l6 6-6 6`, `#B0AEA8`, 2, round/round | `ChevronGlyph` — identical | match |
| divider | `h1`, `rgba(0,0,0,0.06)`, inset 18 | `Divider`: `h1`, `marginHorizontal 18`, `HAIRLINE` = `rgba(0,0,0,0.06)` | match |
| toggle | not drawn anywhere in the final frame | `Toggle` 44×26 in `Progress` | **MISMATCH** (extra) |
| tab bar | frame draws none; last card ends 6px off the frame bottom | `Settings` is a `Tabs.Screen`; `paddingBottom: tabBar` | **MISMATCH** (structural) |
| pressed state | not drawn (only `cursor:pointer`) | `PressScale` 0.96 / 110ms | canvas silent — no finding |

Destinations the frame names and the app can reach today: `/reminders`,
`/routines/morning-time`, `/routines/night-time`, `/letter`, `/weekly-report`,
`/applock`, `/privacy`, `/profile`, `/subscription`. **`Your vow` has no route** —
`src/app/vow.tsx` does not exist (`UI_FINAL_LEDGER.md` lists frame `Your Vow Page` →
`src/app/vow.tsx`, NOT_STARTED). The frame also drops four live destinations the app
currently exposes: `/lifemap`, `/(app)/support`, `/milestones`, `/backtap` (and
`/paywall` in the non-premium branch).

## 7. Comparison — frame 92D `Sheet Sign Out`

| Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- |
| confirmation step | scrim + bottom sheet | none — `signOut()` fires on the first press | **MISMATCH** |
| scrim | `inset:0`, `rgba(19,19,19,0.45)`, `z-index:30` | — | **MISMATCH** |
| sheet box | bottom-pinned, `border-radius:24px 24px 0 0`, `#F4F3F0`, `0 -12px 40px rgba(19,19,19,0.3)`, `padding:10px 20px 30px` | — | **MISMATCH** |
| grabber | 36×5, `r3`, `rgba(19,19,19,0.15)`, centred | — | **MISMATCH** |
| title | `17/600/#1D1C1A`, centred, `margin-top:16` | — | **MISMATCH** |
| body | `14.5/400/lh21/#55534E`, centred, `margin-top:10`, `padding:0 12` | — | **MISMATCH** |
| primary button | `margin-top:18`, `h54`, `r27`, `#131313`, label `17/600/#FFFFFF` | — | **MISMATCH** |
| secondary | `margin-top:14`, `15/500/#8B8882`, centred | — | **MISMATCH** |

## 8. Comparison — frame 93D vs `src/app/weekly-report.tsx`

| Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- |
| back label | **`Settings`** when entered from Settings | `BackRow` hard-codes `Back` | **MISMATCH** |
| back row geometry | `left 16`, app top 10, gap 9, 11×19 chevron `#55534E`/2.4 | `left: 16, top: 10`, gap 9, same Svg | match |
| week label | `right 20`, app top 14, `14/500/#8B8882` | `right: 20, top: 14`, `sans('500')`, 14, `#8B8882` | match |
| title | `left 24`, app top 60, `27/600/−0.2/lh 1` | `left: 24, top: 60, fontSize 27, lineHeight 27, letterSpacing −0.2` | match |
| subtitle | `left 24`, app top 103, `14.5/400/#8B8882` | `left: 24, top: 103`, same | match |
| lamp box | `right 16`, app top 46, 88×78 | `right: 16, top: 46, width 88, height 78` | match |
| lamp glow | div, radial `closest-side` `rgba(226,186,120,0.45)` → `0` @74%, `blur(3px)` | `RadialGradient` 50%/50%/50%, `#E2BA78` α0.45 → α0 @0.74 on `Ellipse cx32 cy26 r28`; **no blur** (RN SVG has no filter) | documented deviation |
| lamp shapes | §3.3 table | identical geometry, `wrTh1b` correctly omitted | match |
| chips | `h27 r14 #FFFFFF`, `0 0 0 1px rgba(0,0,0,0.08)`, `pad 0 12`, `13/600` | same | match |
| chip row | `left 24`, app top 158, gap 8 | `left: 24, top: 158, gap: 8` | match |
| section title | `left 24`, app top 240, `20/600/−0.1` | `left: 24, top: 240, fontSize 20, letterSpacing −0.1` | match |
| trend pill | `right 24`, app top 234, `h30 r15`, `0 0 0 1px rgba(0,0,0,0.1)`, gap 6, `pad 0 12`, `12/600` | same | match |
| axis labels | `left 16`, app tops 308 / 372 / 436, `11.5/500/#B0AEA8` | `left: 16, top: 308 + row*64`, same type | match |
| chart origin | app top 286, height 220 | `top: 286`, height 220 | match |
| gridlines | y 30 / 94 / 158, `rgba(19,19,19,0.07)`, 1 | same | match |
| dashed guide | `x 352`, `16 → 195`, `rgba(19,19,19,0.14)`, `3 5` | `endY − 14 → 195`, same paint | match (generalised) |
| line | `#131313`, 2.4, round cap | same | match |
| fill gradient | `rgba(19,19,19,0.10)` → `rgba(19,19,19,0)` | same | match |
| end dot | `r9 #F6F5F2` + `rgba(19,19,19,0.22)`/1.5, inner `r4.5 #131313` | same | match |
| reading pill | `h28 r14 #131313`, `pad 0 12`, `0 6px 14px rgba(19,19,19,0.22)`, `12.5/600/#FFFFFF`, centred on x 352 | same, `top: 286 + endY − 40`, width 100 centred | match |
| day letters | `left 50 / right 16`, app top 510, `12/500/#8B8882` | `left: 50, right: 16, top: 510`, same | match |
| verdict card | `left/right 16`, app top 538, `h76 r18`, two shadows, gap 12, `pad 0 14` | same | match |
| verdict type | `13.5/600`, sub `11.5/400 mt2`, body `12.5/400/lh17/#55534E` | same | match |
| page dots | app top 630, 7×7, gap 8, `#131313` / `rgba(19,19,19,0.16)` | `top: 630`, `borderRadius: 3.5`, same fills | match |

## 9. Comparison — frame 92B vs `routines/night-time.tsx` + `routines/kit.tsx` + `routines/wheel.tsx`

| Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- |
| noise layer | absent | absent | match |
| back label | **`Settings`** | `RoutineBack` hard-codes `Back` | **MISMATCH** |
| back row | `left 16`, app top 10, gap 9, chevron 11×19 `#55534E`/2.4 | `paddingLeft 16`, `marginTop 10` inside a 20-tall centred box (chevron top 10.5), gap 9, same Svg | match (±0.5) |
| question | app top 78, centred, `22/500/#1D1C1A` | 10 + 20 + 48 = **78**, `center`, `sans('500')`, 22, `#1D1C1A` | match |
| `Select time` | app top 154, `14.5/600/#2A2924` | 78 + 76 = **154**, same type | match |
| selection band | `left 46`, app top 281, `301×44`, `r11`, `rgba(0,0,0,0.08)` | wheel top 196 + band `top: 85` = **281**, `left 46, width 301, height 44, borderRadius 11, rgba(0,0,0,0.08)` | match |
| column x / widths | 105/40, 172/50, 238/60 | `paddingLeft 105`, widths 40 / 27 gap / 50 / 16 gap / 60 | match |
| wheel top | app 196 | 154 + 42 = **196** | match |
| selected row | 30 / lh44 / `#1D1C1A` | `STEPS[0]` identical | match |
| ±1 / ±2 / ±3 rows | 22·29·`rgba(90,88,82,0.55)` / 21·29·`rgba(120,117,110,0.5)` / 20·29·`rgba(140,137,130,0.45)` | `STEPS[1..3]` identical | match |
| period column | `AM` at ±1 tone, `PM` selected, no rows beyond | `PERIODS` rendered without `loop` | match |
| `Select days` | app top 454, `14.5/600/#2A2924` | 196 + 218 + 40 = **454**, same type | match |
| day chips | app top 494, `left/right 34`, space-between, 38×38 `r19` | 454 + 40 = **494**, `paddingHorizontal 34`, `justifyContent 'space-between'`, 38×38 `r19` | match |
| selected chip fill | `#131313` | `#131313` | match |
| selected chip label | `14 / 600 / #F4F3F0` | `14 / 600 / #1D1C1A` — near-black on near-black | **MISMATCH** |
| unselected chip | not drawn by the frame | fill `#EFEEEA`, label `#1D1C1A` | canvas silent |
| note | app top 622, `left/right 36`, `15/400/lh22/#55534E`, centred, `text-wrap:pretty` | `paddingHorizontal 36`, 15 / lh 22 / `#55534E`, `center`; placed by `flex:1, minHeight:90` ⇒ **622** on a 54/34-inset 852 phone | match |
| CTA | app top 690, `left 16`, `361×48`, `r25`, `#131313` | `marginHorizontal 16` (⇒ 361), `height 48`, `borderRadius 25`, `#131313`; stack lands it at **690** | match |
| CTA label | `17.5 / 600 / #FFFFFF`, tracking **0.2px** (last of two declarations) | `sans('600')`, 17.5, `letterSpacing 0.2`, `#FFFFFF` | match |
| CTA pressed | `transform:scale(0.99)` | `PressScale` → `scale 0.96` | **MISMATCH** |
| hour column contents | `7 / 11 / 12 / [10] / 11 / 12 / 1` | `1…12` looped ⇒ `7 / 8 / 9 / [10] / 11 / 12 / 1` | canvas is wrong; app is right |

---

## 10. What must change

Ordered, most structural first.

1. **`src/app/(app)/settings.tsx` — replace the header.** Delete the right-aligned
   `Done` `PressScale`. Add a back row at `left 16, top 10`: `BackGlyph` (already
   `11×19`, `#55534E`, 2.4) + `AppText sans('400') 17 #55534E` reading `Back`, gap 9.
   Move the title to `top 60` and set the header block to `height: 104` so the first
   caption opens the scroll at **104** (canvas 158 − 54).
2. **`src/app/(app)/settings.tsx` — re-cut the sections to the frame's four.**
   `Reminders` (Morning check-in / Night check-in) → `Anchors` (Your vow / Your letter /
   Weekly reports) → `Privacy` (App lock / Data & privacy) → `Account` (Edit profile /
   Manage subscription / Sign out). Decide explicitly what happens to `/lifemap`,
   `/(app)/support`, `/milestones`, `/backtap`, `/paywall` and the `Show a "days since"`
   toggle — the frame drops all six, and `Your vow` has no route to point at yet
   (`src/app/vow.tsx` is unwritten).
3. **`src/app/(app)/settings.tsx` — `Section` must take a row height and a real gap.**
   `gap` default 36 → **21**, with 20 between Anchors and Privacy; `Row` gains a `height`
   prop (52 / 48 / 50 / 46 per group) instead of the fixed 52.
4. **`src/app/(app)/settings.tsx` — rebuild the `Account` card in the list idiom.**
   `padding: 4px 0`, two 46-tall `Row`s with chevrons, hairline, then a 44-tall centred
   `Sign out` press target with **no background and no ring**, label `sans('600') 15.5
   #8B8882`. Delete `AccountLine` and the `0 0 0 1.5px rgba(0,0,0,0.2)` pill.
5. **`src/app/(app)/settings.tsx` — the check-in rows get the pill *and* a chevron.**
   Move the `#EDECE7` `h32 r16` pill (`15/600/#1D1C1A`, `paddingHorizontal 14`) onto the
   two check-in rows, inside the existing gap-10 cluster, with `ChevronGlyph` after it;
   rename `Nightly check-in` → `Night check-in`.
6. **`src/app/(app)/settings.tsx` — row detail type is 13px, not 14px** (`Opens Week XII`,
   `Every Sunday`, `Face ID`), colour unchanged at `#8B8882`.
7. **`src/app/(app)/settings.tsx` — add the sign-out confirmation sheet (frame 92D).**
   Scrim `rgba(19,19,19,0.45)`; sheet bottom-pinned, `borderTopLeftRadius/Right 24`,
   `#F4F3F0`, `boxShadow '0 -12px 40px rgba(19,19,19,0.3)'`, `padding 10 / 20 / 30`;
   grabber 36×5 `r3` `rgba(19,19,19,0.15)`; title `17/600`; body `14.5/400/lh21/#55534E`
   with the signed-in email inlined; primary `h54 r27 #131313` / `17/600/#FFFFFF`;
   `Stay signed in` `15/500/#8B8882`. Only the primary calls `signOut()`.
8. **`src/app/(app)/settings.tsx` — decide the tab question.** The frame gives Settings a
   back row and no tab bar, and its last card ends 6px off the frame bottom. Either push
   Settings as a stack screen or keep `paddingBottom: tabBar` and accept the delta —
   this is the one item the spec cannot settle from the canvas alone.
9. **`src/components/routines/kit.tsx` — selected day chips need a light label.**
   `color: on ? '#F4F3F0' : '#1D1C1A'`. Today a selected chip paints `#1D1C1A` on
   `#131313` and the letter disappears.
10. **`src/components/routines/kit.tsx` + `src/app/weekly-report.tsx` — contextual back
    label.** `RoutineBack` and `BackRow` should take a `label` prop so the boards entered
    from Settings read `Settings` and the ones entered from the flows keep `Back`
    (`Morning Check-in Time` and `Nightly Check-in Time` both still say `Back`).
11. **`src/components/routines/kit.tsx` — CTA press scale.** The frame's only pressed
    state is `scale(0.99)`; `PressScale`'s 0.96 is the app's own value. Low priority, but
    it is a stated design value that the app contradicts.
