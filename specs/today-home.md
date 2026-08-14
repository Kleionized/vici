# Spec — Today Home (pages 1–3)

| Sticky | Frame | Split file (final) | Diff | Prev |
| --- | --- | --- | --- | --- |
| `21 · Today` | `Today Home` | `.uifinal/pretty/final/Email Login/Today-Home.html` | `.uifinal/diffs/Today-Home.html.diff` | `.uifinal/pretty/prev/Email Login/Today-Home.html` |
| `21 · Today — p2` | `Today Home II` | `.uifinal/pretty/final/Email Login/Today-Home-II.html` | `.uifinal/diffs/Today-Home-II.html.diff` | `.uifinal/pretty/prev/Email Login/Today-Home-II.html` |
| `21p2B · Today — Task summary` | `Today Home Task` | `.uifinal/pretty/final/Email Login/Today-Home-Task.html` | *(new frame — no diff, no prev)* | — |
| `21 · Today — p3` | `Today Home III` | `.uifinal/pretty/final/Email Login/Today-Home-III.html` | *(new frame — no diff, no prev)* | — |

**Target app files**

- `/Users/admin/Documents/tideline/src/app/(app)/today.tsx`
- `/Users/admin/Documents/tideline/src/components/today/kit.tsx`

**Coordinate convention.** Every frame is a 393 × 852 div whose `top` values include
a 54px status bar the app never builds. Each table below gives **canvas top** and
**app top = canvas top − 54**. Where the app expresses a position as a margin
chain instead of an absolute offset, the "Layout ledger" section (§7) converts.

**Frame shell (all four frames, identical).**

| Property | Value |
| --- | --- |
| size | `width:393px; height:852px; position:relative; overflow:hidden` |
| background | `#F4F3F0` |
| font stack | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` |
| smoothing | `-webkit-font-smoothing:antialiased` |
| frame shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` — *device chrome only, not part of the screen* |
| noise | `position:absolute; inset:0; background-image:url('noise-dark.png'); opacity:0.07; pointer-events:none` |

---

## 0. The headline change

The bundle restructured Today from **two pages into three**, and moved three
blocks between them. Nothing about the score card, the lesson card or the pledge
card changed *internally* — what changed is which page each one lives on, plus a
brand-new card and a taller task card.

| | prev (what the app was built to) | final |
| --- | --- | --- |
| page 1 | Day · Score · **Lesson** · 3 page dots | Day · Score · **This morning + readings** · **Last 30 days (new)** |
| page 2 | This morning + readings · Task (246 tall) · Goal & pledge + Pledge · 4 page dots | **This week + Lesson** · Task (**274** tall) |
| page 3 | — | **Goal & pledge + Pledge** |
| page dots | page 1 had 3, page 2 had 4 (already contradictory) | **removed from every frame** |

Both diffs end with a removed page-dot block: `Today-Home.html.diff` lines 512–542
delete the 3-dot row at `top:622`, and `Today-Home-II.html.diff` lines 454–492
delete the 4-dot row at `top:752`. No frame in the family carries a pager
indicator any more.

---

## 1. Shared chrome (present on all four frames)

### 1.1 Status bar — not built by the app

`position:absolute; top:0; left:0; right:0; height:54px; display:flex;
align-items:center; justify-content:space-between; padding:6px 32px 0 46px;
box-sizing:border-box; z-index:20`. Clock `9:41`, 17px/600, `#1D1C1A`,
letter-spacing −0.2px. Right cluster `display:flex; align-items:center; gap:7px`.
The app draws the real status bar, so this is reference only.

### 1.2 Mark + profile row

| Element | Canvas | App top | Value |
| --- | --- | --- | --- |
| laurel mark | `left:16px; top:64px` | 10 | `laurel-mark.webp`, `width:27 height:27; display:block; object-fit:contain` |
| profile glyph | `right:16px; top:64px` | 10 | `<svg width="26" height="26" viewBox="0 0 26 26">` |
| head | — | — | `<circle cx="13" cy="9.5" r="4" fill="none" stroke="#55534E" stroke-width="2">` |
| shoulders | — | — | see path below, `stroke="#55534E" stroke-width="2" stroke-linecap="round" fill="none"` |

```
M4.5 22.5c1-4.5 4.2-6.8 8.5-6.8s7.5 2.3 8.5 6.8
```

### 1.3 Urge bar (all four frames, byte-identical)

| Property | Value |
| --- | --- |
| box | `position:absolute; left:0; right:0; top:705px (app 651); height:64px` |
| radius | `18px 18px 0 0` |
| background | `#131313` |
| layout | `display:flex; align-items:center; gap:13px; padding:0 16px; box-sizing:border-box; cursor:pointer` |
| icon well | `width:40px; height:40px; border-radius:50%; background:rgba(244,243,240,0.12); display:flex; align-items:center; justify-content:center; flex-shrink:0` |
| wave icon | `<svg width="20" height="13" viewBox="0 0 26 16">`, `stroke="#F4F3F0" stroke-width="2.4" fill="none" stroke-linecap="round"` |
| title | `font-size:14.5px; font-weight:600; color:#F7F6F2` — "Stay present. Surf the wave." |
| sub | `margin-top:2px; font-size:12.5px; font-weight:400; color:rgba(244,243,240,0.55)` — "Urge surfing · SOS" |
| chevron | `<svg width="7" height="12" viewBox="0 0 8 14" style="flex-shrink:0">`, `stroke="rgba(244,243,240,0.5)" stroke-width="2" stroke-linecap="round" fill="none"` |

```
M2 12c4-7 8 3 12-3s8 2 10-2
M1.5 1.5L6.5 7l-5 5.5
```

**Match:** `today.tsx` lines 146–172 reproduce every one of these values exactly.

### 1.4 Tab bar — owned by `StoicTabBar`, out of scope

`top:769px; bottom:0; background:rgba(255,255,255,0.95); z-index:14`. Items at
`left:48/170/288`, `top:14`, widths `44/52/60`, glyph `30×29 viewBox 0 0 24 26`,
label `margin-top:5px; font-size:13px; font-weight:500`, active `#2A2924`,
inactive `#8B8882`, inactive glyph fill `#C6C5C0`. Verified against
`src/components/StoicTabBar.tsx` (`TAB_BAR_CONTENT`, `top:14`, `height:29`,
`marginTop:5`, `fontSize:13`, `colors.textTitle`/`colors.textSoft`,
`colors.track`) — **matches; no finding.**

```
M4.5 24 L4.5 10 Q4.5 2 12 2 Q19.5 2 19.5 10 L19.5 24 Z
M8.5 8.5h7M8.5 13h7M8.5 17.5h4.5
```

---

## 2. Page 1 — `Today Home`

### 2.1 Day title

| Property | Canvas | App top |
| --- | --- | --- |
| position | `left:16px; top:114px` | 60 |
| type | `font-size:27px; font-weight:600; letter-spacing:-0.2px; line-height:1; color:#1D1C1A` | |
| text | `Day 41` | |

### 2.2 Score card — **internally unchanged; app already matches**

Card box: `left:12px; right:12px; top:164px` (app 110) `height:222px;
border-radius:22px; overflow:hidden; background:#0C0D10; box-shadow:0 0 0 1px
rgba(0,0,0,0.25), 0 14px 30px rgba(30,28,24,0.28)`. Inner width on a 393 frame =
**369**; the app derives it as `useWindowDimensions().width − 24`.

| Layer (paint order) | Canvas | Value |
| --- | --- | --- |
| 1 sky | `inset:0` | `linear-gradient(180deg, #08090B 0%, #0E1014 55%, #151920 100%)` |
| 2 star A | `left:116px; top:34px` | `2×2`, `border-radius:50%`, `rgba(244,243,240,0.45)` → centre (117, 35) r 1 |
| 3 star B | `right:150px; top:56px` | `2.5×2.5`, `rgba(244,243,240,0.35)` → centre (W−151.25, 57.25) r 1.25 |
| 4 star C | `left:52px; top:96px` | `2×2`, `rgba(244,243,240,0.3)` → centre (53, 97) r 1 |
| 5 moon halo | `right:24px; top:34px` | `84×84`, `radial-gradient(closest-side, rgba(223,220,211,0.15), rgba(223,220,211,0) 72%)`, `filter:blur(5px)` |
| 6 moon | `right:48px; top:56px` | `30×30`, `radial-gradient(circle at 36% 30%, #F5F3EC 0%, #D9D6CD 46%, #A5A197 100%)`, `box-shadow:0 0 26px rgba(223,220,211,0.26)` |
| 7 ridges | `left:0; right:0; top:102px; width:100%; height:64px` | `<svg viewBox="0 0 369 76" preserveAspectRatio="none">` |
| 8 waterline glow | `left:0; right:0; top:154px; height:12px` | `linear-gradient(180deg, rgba(233,199,138,0) 0%, rgba(233,199,138,0.12) 100%)`, `filter:blur(3px)` |
| 9 sea | `left:0; right:0; top:166px; bottom:0` | `linear-gradient(180deg, #131720 0%, #0B0C0F 100%)` |
| 10 reflection shaft | `right:50px; top:168px` | `38×44`, `linear-gradient(180deg, rgba(223,220,211,0.15), rgba(223,220,211,0))`, `filter:blur(5px)` |
| 19 card noise | `inset:0` | `noise-dark.png`, `opacity:0.06`, `pointer-events:none` |

Ridge gradients: `hsH1` `x1=0 y1=0 x2=0 y2=1`, stop 0 `#232830` → stop 1
`#0A0B0D`; `hsH2` same axis, stop 0 `#2A303B` → stop 1 `#0C0D10`.

```
M-4,76 L-4,50 Q56,22 124,48 Q160,61 188,68 L188,76 Z
M168,76 L168,66 Q226,57 270,36 Q316,17 373,25 L373,76 Z
```

| Text / control | Canvas | Value |
| --- | --- | --- |
| "Recovery score" | `left:20px; top:22px` | `font-size:13px; font-weight:500; color:#F7F6F2` |
| Trend pill | `right:16px; top:16px` | `height:30px; border-radius:15px; border:1px solid rgba(244,243,240,0.28); background:rgba(20,19,16,0.25); display:flex; align-items:center; gap:6px; padding:0 12px; cursor:pointer` |
| Trend icon | — | `<svg width="14" height="10" viewBox="0 0 14 10">`, `stroke="#F4F3F0" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"` |
| Trend label | — | `font-size:12px; font-weight:600; color:#F4F3F0` |
| number row | `left:20px; top:48px` | `display:flex; align-items:baseline; gap:9px` |
| number | — | `font-size:43px; font-weight:500; letter-spacing:1.5px; color:#F7F6F2` — `1,240` |
| delta group | — | `display:flex; align-items:baseline; gap:3px` |
| delta triangle | — | `<svg width="9" height="8" viewBox="0 0 10 9">`, `fill="rgba(244,243,240,0.8)"` |
| delta number | — | `font-size:13px; font-weight:500; color:rgba(244,243,240,0.8)` — `18` |
| meter track | `left:20px; right:20px; bottom:50px` | `height:6px; border-radius:3px; background:rgba(244,243,240,0.14)` |
| meter fill | — | `width:60%; height:100%; border-radius:3px; background:rgba(244,243,240,0.92)` |
| rank row | `left:20px; right:20px; bottom:22px` | `display:flex; justify-content:space-between` |
| rank text | — | `font-size:11px; font-weight:500; color:rgba(244,243,240,0.55)` — "Navigator · 1,150" / "Helmsman · 1,300" |

```
M1 8.5L5 4.5l2.5 2L12.5 1.5
M9.2 1.5h3.3V4.8
M5 0.5L9.5 8.5H0.5z
```

**Verified line by line against `ScoreCard` (`today.tsx` 231–392): every value above is already in the app.** The blur-substituting radial stops
(`moonGlow`, `halo`, `shaft`) are documented approximations of CSS blur, which RN
SVG cannot express; keep them.

### 2.3 "This morning" section row — **moved from page 2**

| Property | Canvas | App top |
| --- | --- | --- |
| label | `left:20px; top:402px` | 348 |
| label type | `font-size:12.5px; font-weight:600; color:#8B8882` | |
| chevron | `right:20px; top:402px`, `<svg width="7" height="12" viewBox="0 0 8 14">`, `stroke="#B0AEA8" stroke-width="2" stroke-linecap="round" fill="none"` | 348 |
| action label | **none** (chevron only) | |
| action vertical offset | **0** (chevron top == label top) | |

### 2.4 Readings strip — **moved from page 2, geometry unchanged**

| Property | Canvas | App top |
| --- | --- | --- |
| row | `left:12px; right:12px; top:428px; height:48px; display:grid; grid-template-columns:1fr 1fr; gap:8px` | 374 |
| pill | `border-radius:12px; background:#FFFFFF; box-shadow:0 0 0 1px rgba(0,0,0,0.06); position:relative` | |
| word | `right:13px; top:0; bottom:0; display:flex; align-items:center; font-size:12px; font-weight:600; color:#1D1C1A` — "Fine" / "Low" | |
| mood dots | `left:13px; top:0; bottom:0; display:flex; align-items:center; gap:5px` | |
| dot | `9×9; border-radius:50%` — on `#131313`, off `rgba(19,19,19,0.13)` | |
| dot cursor | on the **selected** dot only: `box-shadow:0 0 0 1.5px #FFFFFF, 0 0 0 2.5px #131313` | |
| energy bars | `left:13px; bottom:9px; display:flex; align-items:flex-end; gap:3.5px` | |
| bar | `width:6.5px; border-radius:3px`, heights **9 / 13 / 17 / 21 / 25** — on `#131313`, off `rgba(19,19,19,0.13)` | |
| bar cursor | on the selected bar only: `box-shadow:0 0 0 1.5px #FFFFFF, 0 0 0 2.5px #131313` | |
| frame state | mood = index 2 of 5 ("Fine"), energy = index 1 of 5 ("Low") | |

**Matches `ReadingsStrip` / `MoodDots` / `EnergyBars` in `kit.tsx` exactly.**

### 2.5 "Last 30 days" card — **NEW, no counterpart in the app**

| Property | Canvas | App top |
| --- | --- | --- |
| card | `left:12px; right:12px; top:492px; height:184px` | 438 |
| radius / clip | `border-radius:20px; overflow:hidden` | |
| background | `#FFFFFF` | |
| shadow | `0 0 0 1px rgba(0,0,0,0.05), 0 10px 24px rgba(40,38,32,0.07)` | |
| press affordance | **none** — no `cursor:pointer`, no chevron | |
| title | `left:20px; top:20px; font-size:13px; font-weight:500; color:#1D1C1A` — "Last 30 days" | |
| counter | `right:20px; top:20px; font-size:12.5px; font-weight:500; color:#8B8882` — "27 held" | |
| dot grid | `left:35px; top:58px; width:299px; display:flex; flex-wrap:wrap; gap:11px` | |
| held dot | `width:20px; height:20px; border-radius:50%; background:#131313` | |
| not-held dot | `width:20px; height:20px; border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.18)` — **no background**, the paper shows through | |
| count | exactly **30** dots; rings at 1-based indices **9, 17, 26** → 27 filled, matching "27 held" | |

Geometry falls out exactly: `10 × 20 + 9 × 11 = 299`, so the container width pins
the grid to **10 columns × 3 rows**; block height `3 × 20 + 2 × 11 = 82`, running
from card-y 58 to 140. Insets are symmetric — `35` left, `369 − 334 = 35` right.

**Canvas oddity, stated rather than resolved:** the card is 184 tall but its
content ends at 140, leaving 44px of empty paper at the bottom. There is no
element in the frame occupying it and no evidence of a clipped child (the card
sets `overflow:hidden` but nothing else is declared inside). Build the 184 as
written; do not shrink the card to 144.

See §8 for the data mapping and the states the frame does not draw.

---

## 3. Page 2 — `Today Home II` and `Today Home Task`

Both frames draw the same page. They differ only inside the task card, which has
two states (§3.3).

### 3.1 "This week" section row

| Property | Canvas | App top |
| --- | --- | --- |
| label | `left:20px; top:138px` | 84 |
| label type | `font-size:12.5px; font-weight:600; color:#8B8882` — "This week" | |
| action group | `right:20px; top:136px; display:flex; align-items:center; gap:5px` | 82 |
| action label | `font-size:11px; font-weight:600; letter-spacing:0.5px; color:#8B8882` — "Library" | |
| chevron | `<svg width="7" height="12" viewBox="0 0 8 14">`, `stroke="#B0AEA8" stroke-width="2" stroke-linecap="round"` | |
| action vertical offset | **−2** relative to the label | |

### 3.2 Lesson card — **internally unchanged; app already matches**

| Property | Canvas | App top |
| --- | --- | --- |
| card | `left:12px; right:12px; top:164px; height:152px` | 110 |
| radius / clip | `border-radius:20px; overflow:hidden` | |
| background / shadow | `#FFFFFF`, `0 0 0 1px rgba(0,0,0,0.05), 0 10px 24px rgba(40,38,32,0.07)` | |
| title | `left:20px; top:26px; font-size:19px; font-weight:600; letter-spacing:-0.2px; color:#1D1C1A` — "Naming your triggers" | |
| meta | `left:20px; top:56px; font-size:12.5px; font-weight:400; color:#8B8882` — "Lesson 5 · Week II" | |
| dome | `right:44px; top:16px; width:108px; height:80px; border-radius:999px 999px 0 0; overflow:hidden; background:linear-gradient(180deg, #F1F0EA 0%, #E8E6DF 100%)` | |
| dome glow | `left:50%; top:10px; width:70px; height:58px; margin-left:-35px; border-radius:50%; background:radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 75%); filter:blur(3px)` | |
| dome svg | `viewBox="0 0 108 80"; inset:0; width:100%; height:100%` | |
| tag gradient `hmTag` | `x1=0 y1=0 x2=0 y2=1`, stop 0 `#4A4843`, stop 1 `#1D1C19` | |
| shadow ellipse | `cx=55 cy=66 rx=21 ry=3.5 fill="rgba(40,38,32,0.12)"` | |
| tag group | `transform="rotate(-16 54 42)"` | |
| tag body | `rect x=37 y=30 width=36 height=23 rx=5 fill="url(#hmTag)"` | |
| tag hole | `circle cx=44.5 cy=41.5 r=3 fill="#F1F0EA"` | |
| tag rules | `stroke="rgba(255,255,255,0.28)" stroke-width="2.2" stroke-linecap="round"` | |
| string | `stroke="#C4C3BC" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-dasharray="none"` | |
| chevron | `right:16px; top:22px`, `<svg width="8" height="14" viewBox="0 0 8 14">`, `stroke="#8B8882" stroke-width="2" stroke-linecap="round"` | |
| rule row | `left:20px; right:20px; bottom:20px; display:flex; gap:7px` | |
| rule | `flex:1; height:4.5px; border-radius:2.5px` — done `#131313`, todo `rgba(19,19,19,0.15)`; frame shows **4 of 6** | |

```
M52 37.5 L66 37.5 M52 45 L61 45
M42 38 C 34 30, 32 20, 33 10
```

**Verified against `LessonCard` (`today.tsx` 395–429) + `LessonDome` (`kit.tsx` 369–404): every value matches.** The app adds `right:168` +
`numberOfLines={1}` on the title, which the canvas does not state; it is a
sensible guard against the dome (dome left edge = 369 − 44 − 108 = 217; the guard
stops the title at 201). Keep it.

### 3.3 Task card

Card box (both states):

| Property | Canvas | App top | Prev |
| --- | --- | --- | --- |
| card | `left:12px; right:12px; top:340px` | 286 | `top:256px` |
| height | **274px** | | `246px` |
| radius / clip | `border-radius:20px; overflow:hidden` | | same |
| background / shadow | `#FFFFFF`, `0 0 0 1px rgba(0,0,0,0.05), 0 10px 24px rgba(40,38,32,0.07)` | | same |

#### 3.3.1 The night (top band) — shared

| Property | Canvas (card-relative) | Prev |
| --- | --- | --- |
| band | `left:0; right:0; top:0; height:124px; overflow:hidden` | `height:96px` |
| sky | `linear-gradient(180deg, #0B0C0F 0%, #12151B 60%, #1A2027 100%)` | same |
| star A | `left:58px; top:18px; 2×2; border-radius:50%; rgba(244,243,240,0.45)` | same |
| star B | `left:112px; top:40px; 1.5×1.5; rgba(244,243,240,0.3)` | same |
| star C | `right:124px; top:22px; 2×2; rgba(244,243,240,0.35)` | same |
| moon halo | `left:26px; top:12px; 44×44; radial-gradient(closest-side, rgba(223,220,211,0.16), rgba(223,220,211,0) 72%)` | same |
| crescent | `left:38px; top:22px; 20×20`, `<svg width="20" height="20" viewBox="0 0 24 24">`, `fill="#E8E6DC"` | same |
| ridge | `<svg viewBox="0 0 361 96" preserveAspectRatio="none" style="inset:0; width:100%; height:100%">`, `fill="#171B22"` | same viewBox, but stretched over 96 not 124 |

```
M14 3 A9 9 0 1 0 21 12 A7.2 7.2 0 0 1 14 3Z
M-4,96 L-4,72 Q80,58 170,68 Q260,80 365,66 L365,96 Z
```

Because the ridge svg keeps `viewBox="0 0 361 96"` with `preserveAspectRatio:none`
inside a **124**-tall band, the ridge is now scaled vertically by 124 / 96 =
**1.29167**. Its `y` units are unchanged; only the box grows.

#### 3.3.2 Night contents — state A (`Today Home II`, generic day step)

| Element | Canvas (card-relative) | Value |
| --- | --- | --- |
| warm glow | `right:40px; top:20px` | `70×70; border-radius:50%; radial-gradient(closest-side, rgba(226,186,120,0.20), rgba(226,186,120,0) 74%)` |
| phone body | `right:60px; top:26px` | `38×52; border-radius:5px; linear-gradient(180deg, #343A44 0%, #262B33 100%)` |
| card A | `left:4px; right:4px; top:7px` | `height:14px; border-radius:3px; rgba(244,243,240,0.10)` |
| card B | `left:4px; right:4px; top:24px` | `height:14px; border-radius:3px; rgba(244,243,240,0.06)` |
| handle | `left:14px; top:12px` | `10×3; border-radius:1.5px; rgba(244,243,240,0.35)` |
| phone | `left:8px; top:5px` | `9×17; border-radius:2px; background:#0E1116; box-shadow:inset 0 0 0 1px rgba(244,243,240,0.22); transform:rotate(-14deg)` |

#### 3.3.3 Night contents — state B (`Today Home Task`, lesson-sourced task)

**No warm glow in this frame.** The band goes straight from the ridge to the
scene. Paint order is DOM order:

| # | Element | Canvas (card-relative) | Value |
| --- | --- | --- | --- |
| 1 | headboard | `left:96px; top:62px` | `7×38; border-radius:2.5px; #2C3844` |
| 2 | bed body | `left:101px; top:80px` | `64×17; border-radius:5px; #394656` |
| 3 | pillow | `left:106px; top:73px` | `22×9; border-radius:4px; #55677C` |
| 4 | bed foot | `left:158px; top:90px` | `5×10; border-radius:2px; #26303C` |
| 5 | shelf top | `right:64px; top:66px` | `42×8; border-radius:3px; #2C3844` |
| 6 | shelf leg | `right:81px; top:74px` | `7×28; border-radius:2px; #26303C` |
| 7 | phone standing | `right:76px; top:42px` | `13×22; border-radius:3px; #DCE3EA` |
| 8 | check badge | `right:60px; top:34px` | `17×17; border-radius:50%; #E9D2A4; display:flex; align-items:center; justify-content:center` |
| 8a | badge tick | inside 8 | `<svg width="9" height="8" viewBox="0 0 9 8">`, `stroke="#131313" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"` |

```
M1.5 4l2 2 4-4.5
```

#### 3.3.4 Card body — the two states side by side

| Property | State A (`Today Home II`) | State B (`Today Home Task`) |
| --- | --- | --- |
| label row | `left:20px; top:142px; display:flex; align-items:center; gap:10px` | identical |
| glyph well | `34×34; border-radius:50%; background:#131313; display:flex; align-items:center; justify-content:center; flex-shrink:0` | identical |
| glyph | crescent, `<svg width="15" height="15" viewBox="0 0 24 24">`, `fill="#F4F3F0"` | bed, `<svg width="16" height="16" viewBox="0 0 20 20">`, `stroke="#F4F3F0" stroke-width="1.7"` |
| label | `font-size:13px; font-weight:600; color:#1D1C1A` — **"Today's task"** (`&rsquo;`) | same type — **"Surviving the night"** (the source lesson's title) |
| check ring | `right:20px; top:146px; 26×26; border-radius:50%; box-shadow:inset 0 0 0 2px rgba(19,19,19,0.22)` | identical |
| caption box | `left:20px; right:24px; top:194px` | `left:20px; right:24px; top:190px` |
| caption type | `font-size:18px; font-weight:600; line-height:26px; letter-spacing:-0.1px; color:#1D1C1A; text-wrap:pretty` | `font-size:15px; font-weight:500; line-height:22px; color:#1D1C1A; text-wrap:pretty` — **no letter-spacing** |
| caption text | "Put your phone somewhere difficult to access before you sleep." | "Put the device you use for porn out of reach before you sleep." |

State B's glyph paths, verbatim (three children in one `viewBox="0 0 20 20"`,
all `stroke="#F4F3F0" stroke-width="1.7"`; the second adds
`stroke-linejoin="round" fill="none"`; the circle is a fill):

```
M3 15.5V6
M3 12.5h14M17 15.5v-5a2 2 0 0 0-2-2H8v4.5
<circle cx="5.6" cy="8.9" r="1.5" fill="#F4F3F0">
```

**Reading the two states.** They are not a transcription slip: the label text,
the well glyph, the caption size, the caption weight, the caption leading, the
caption top *and* the whole night scene differ together. The evidence supports
two genuine states of one card — **A** = the app's own fallback day step, labelled
generically and set large; **B** = a task that came from a lesson, labelled with
the lesson's name and glyph and set one step smaller because the sentence is
longer. Build both.

**Checked state.** Neither frame draws the ring filled. The app's filled
treatment (`backgroundColor: colors.ink` + a 13×13 tick,
`M5 12.5l4.5 4.5L19 7`, `stroke="#F4F3F0" strokeWidth={2.6}`) has no canvas
counterpart in this family — keep it, and note it as app-authored.

---

## 4. Page 3 — `Today Home III`

### 4.1 "Goal & pledge" section row

| Property | Canvas | App top |
| --- | --- | --- |
| label | `left:20px; top:138px` — `font-size:12.5px; font-weight:600; color:#8B8882` | 84 |
| action group | `right:20px; top:136px; display:flex; align-items:center; gap:5px` | 82 |
| action label | `font-size:11px; font-weight:600; letter-spacing:0.5px; color:#8B8882` — "Past pledges" | |
| chevron | `<svg width="7" height="12" viewBox="0 0 8 14" style="">`, `stroke="#B0AEA8" stroke-width="2" stroke-linecap="round"` | |
| action vertical offset | **−2** | |

### 4.2 Pledge card — **internally unchanged; app already matches**

| Property | Canvas | App top |
| --- | --- | --- |
| card | `left:12px; right:12px; top:164px; height:140px` | 110 |
| clip / radius | `overflow:hidden; border-radius:14px` | |
| background / shadow | `#FFFFFF`, `0 0 0 1px rgba(0,0,0,0.06)` | |
| open quote | `left:16px; top:26px; font-family:Georgia,'Times New Roman',serif; font-size:32px; line-height:20px; color:#C9C0AC` — `&ldquo;` | |
| body | `left:38px; right:38px; top:32px; font-family:Georgia,'Times New Roman',serif; font-size:17.5px; line-height:27px; color:#3A3934; text-wrap:pretty` | |
| body text | "I am abstaining today because " + *reason* + "." | |
| reason run | `border-bottom:1px solid rgba(0,0,0,0.22); padding-bottom:1px` — "the mornings are mine again" | |
| footer | `left:16px; right:16px; bottom:11px; display:flex; align-items:flex-end; justify-content:space-between` | |
| signed | `font-size:11px; font-weight:500; letter-spacing:0.3px; color:#A5A29B` — "Signed 7:12 AM" | |
| signature block | `text-align:right` | |
| signature | `font-family:'Snell Roundhand','Savoye LET','Segoe Script',cursive; font-size:24px; line-height:1; color:#1D1C1A; transform:rotate(-3.5deg)` — "Jerry" | |
| rule | `margin-top:4px; margin-left:auto; width:92px; height:1px; background:rgba(0,0,0,0.2)` | |

**Verified against `PledgeCard` (`today.tsx` 519–568): every value matches.**

---

## 5. What the app has that the final frames do not

| App element | App location | Canvas |
| --- | --- | --- |
| 3-dot pager on page one | `today.tsx` 217–221 — `marginTop:34`, `6.5×6.5`, `colors.ink` / `rgba(19,19,19,0.16)` | **Deleted** by `Today-Home.html.diff` 512–542 |
| (page two never had dots in the app) | — | `Today-Home-II.html.diff` 454–492 also deletes the prev 4-dot row |

---

## 6. Comparison — design vs the code as it stands

`T` = today.tsx, `K` = components/today/kit.tsx.

### 6.1 Structure

| Property | Design value | Current app value | |
| --- | --- | --- | --- |
| number of pages | 3 | 2 (`T` 117–140: two `View`s of `pageH`) | **MISMATCH** |
| page-1 contents | Day, Score, This-morning row, readings, Last-30 card | Day, Score, Lesson card, pager dots (`T` 196–223) | **MISMATCH** |
| page-2 contents | This-week row, Lesson card, Task card | This-morning row, readings, Task card, Goal-&-pledge row, Pledge card (`T` 454–479) | **MISMATCH** |
| page-3 contents | Goal-&-pledge row, Pledge card | *(no page 3)* | **MISMATCH** |
| pager dots | none in any frame | 3 dots, `marginTop:34`, `6.5×6.5`, ink / `rgba(19,19,19,0.16)` (`T` 217–221) | **MISMATCH** |
| `page` state / `onMomentumScrollEnd` | still needed for snapping only | drives the dots (`T` 56, 115) | **MISMATCH** (dots go; snapping stays) |

### 6.2 Page 1

| Property | Design value | Current app value | |
| --- | --- | --- | --- |
| Day left / top | 16 / canvas 114 → app 60 | `marginLeft:16`, `marginTop:23` after a 37 header → 60 | match |
| Day type | 27 / 600 / −0.2 / lh 1 / `#1D1C1A` | 27 / `sans('600')` / −0.2 / `lineHeight:27` / `colors.text` | match |
| Score card top | canvas 164 → app 110 | `marginTop:23` after Day (60 + 27) → 110 | match |
| Score card box | 222 tall, r22, `#0C0D10`, `0 0 0 1px rgba(0,0,0,0.25), 0 14px 30px rgba(30,28,24,0.28)` | identical (`T` 241–249) | match |
| Score card internals | §2.2 | identical (`T` 251–389) | match |
| "This morning" row top | canvas 402 → app 348 (16 under the score card) | on page **two**, `marginTop:47` → app 84 (`T` 457) | **MISMATCH** |
| "This morning" action | chevron only, offset 0 | chevron only, offset 0 | match (position aside) |
| readings strip top | canvas 428 → app 374 | on page two, `marginTop:11.5` → app 110 (`T` 459) | **MISMATCH** |
| readings strip geometry | 12/12 gutter, h48, gap 8, pills r12, `0 0 0 1px rgba(0,0,0,0.06)` | identical (`K` 78–89, 66–75) | match |
| mood dots / energy bars | §2.4 | identical (`K` 20–63) | match |
| **"Last 30 days" card** | 369×184 at canvas 492 → app 438, r20, `#FFFFFF`, `0 0 0 1px rgba(0,0,0,0.05), 0 10px 24px rgba(40,38,32,0.07)` | **does not exist** | **MISMATCH** |
| card title | `left:20 top:20`, 13 / 500 / `#1D1C1A` | — | **MISMATCH** |
| card counter | `right:20 top:20`, 12.5 / 500 / `#8B8882` | — | **MISMATCH** |
| dot grid | `left:35 top:58 width:299`, wrap, gap 11, 30 × 20px dots | — | **MISMATCH** |
| held / not-held fill | `#131313` / `inset 0 0 0 1.5px rgba(0,0,0,0.18)` on no background | — | **MISMATCH** |
| Lesson card page | page 2 | page 1, `marginTop:50` (`T` 207) | **MISMATCH** |

### 6.3 Page 2

| Property | Design value | Current app value | |
| --- | --- | --- | --- |
| "This week" row | label "This week", action "Library", offset −2, canvas 138 → app 84 | no such row; page two opens with "This morning", no action, offset 0 (`T` 457) | **MISMATCH** |
| Lesson card top | canvas 164 → app 110 | app 382 on page one (37 + 23 + 27 + 23 + 222 + 50) | **MISMATCH** |
| Lesson card box + internals | §3.2 | identical (`T` 395–429, `K` 369–404) | match |
| Task card top | canvas 340 → app 286 | `marginTop:44` after the readings → app 202 (`T` 469) | **MISMATCH** |
| Task card height | **274** | **246** (`K` 195) | **MISMATCH** |
| Task night height | **124** | **96** (`K` 152, 153, 161) | **MISMATCH** |
| Task ridge svg height | 124 (viewBox stays `0 0 361 96`, `preserveAspectRatio:none`) | `height={96}` (`K` 170) | **MISMATCH** |
| Task night sky/stars/moon/ridge | §3.3.1 | identical values (`K` 155–172) | match |
| warm glow `right:40 top:20 70×70 rgba(226,186,120,0.20)→0 @74%` | state A only; **absent** in state B | rendered unconditionally inside `TaskNight` (`K` 173) | **MISMATCH** |
| label row top | 142 | 114 (`K` 202) | **MISMATCH** |
| check ring top | 146 | 118 (`K` 213) | **MISMATCH** |
| check ring box | 26×26, r13, `inset 0 0 0 2px rgba(19,19,19,0.22)` | identical (`K` 214–221) | match |
| label text (state A) | "Today's task" (constant) | `step.when` → "Tonight"/"Today"/"Before bed" (`K` 206, `T` 40–46) | **MISMATCH** |
| label glyph (state A) | crescent 15×15 `#F4F3F0` | crescent 15 `#F4F3F0` (`K` 204) | match |
| label text/glyph (state B) | source lesson title + bed glyph 16×16 | no such state | **MISMATCH** |
| caption top (state A) | 194 | 166 (`K` 230) | **MISMATCH** |
| caption type (state A) | 18 / 600 / lh 26 / −0.1 | 18 / 600 / lh 26 / −0.1 | match |
| caption top/type (state B) | 190; 15 / 500 / lh 22 / no tracking | no such state | **MISMATCH** |
| state-B night scene (8 shapes + tick) | §3.3.3 | no such art (`K` exports Doorway/PhoneDown/Water/Bed/Note only) | **MISMATCH** |

### 6.4 Page 3

| Property | Design value | Current app value | |
| --- | --- | --- | --- |
| "Goal & pledge" row top | canvas 138 → app 84 (top of page 3) | page two, `marginTop:24` after the task card (`T` 473) | **MISMATCH** |
| action label / offset | "Past pledges", −2 | "Past pledges", −2 | match |
| Pledge card top | canvas 164 → app 110 | page two, `marginTop:11.5` after the row | **MISMATCH** |
| Pledge card box + internals | §4.2 | identical (`T` 529–566) | match |

### 6.5 Shared chrome

| Property | Design value | Current app value | |
| --- | --- | --- | --- |
| field background | `#F4F3F0` | `colors.bg` = `#F4F3F0` | match |
| screen noise | `noise-dark.png`, opacity 0.07, inset 0 | identical (`T` 93) | match |
| mark | 27×27 at canvas 64 → app 10 | 27×27, header `height:37; paddingTop:10; paddingHorizontal:16` | match |
| profile glyph | 26×26, `#55534E`, sw 2 | 26×26, `colors.textMuted` = `#55534E`, sw 2 | match |
| urge bar | §1.3 | identical (`T` 146–172) | match |
| tab bar | §1.4 | `StoicTabBar` | match |

---

## 7. Layout ledger — the margin chain to build

Content area starts at app y 37 (canvas 91) and is `pageH` = 614 tall on the
393 × 852 frame (`852 − 54 status − 37 header − 64 urge − 83 tab`), which is what
`T` 63 already computes.

**Page 1**

| Block | Canvas top | App top | Chain |
| --- | --- | --- | --- |
| Day | 114 | 60 | `marginTop: 23` (unchanged) |
| Score card | 164 | 110 | `marginTop: 23` (unchanged) |
| — score bottom | 386 | 332 | |
| "This morning" row | 402 | 348 | `marginTop: 16` |
| readings strip | 428 | 374 | `marginTop: 11.5` (label box ≈ 14.5) |
| Last 30 days card | 492 | 438 | `marginTop: 16` |
| — card bottom | 676 | 622 | 29px of slack before the urge bar |

**Page 2**

| Block | Canvas top | App top | Chain |
| --- | --- | --- | --- |
| "This week" row | 138 | 84 | `marginTop: 47` |
| Lesson card | 164 | 110 | `marginTop: 11.5` |
| — lesson bottom | 316 | 262 | |
| Task card | 340 | 286 | `marginTop: 24` |
| — task bottom | 614 | 560 | 91px of slack |

**Page 3**

| Block | Canvas top | App top | Chain |
| --- | --- | --- | --- |
| "Goal & pledge" row | 138 | 84 | `marginTop: 47` |
| Pledge card | 164 | 110 | `marginTop: 11.5` |
| — pledge bottom | 304 | 250 | |

`SectionRow` keeps `minHeight: 0` (it overrides `PressScale`'s default 44) so the
row is exactly as tall as its 12.5px label — that is what makes 11.5 land the
card on 110/374. Do not add padding to the row; widen `hitSlop` instead.

---

## 8. Visualization — the "Last 30 days" held grid

**Coordinate system.** Card-local, origin at the card's top-left, card 369 × 184
on a 393 frame. No SVG: the grid is 30 plain `20 × 20` views in a wrapping flex
row. Grid origin **(35, 58)**; pitch **31** on both axes (20 dot + 11 gap);
10 columns × 3 rows; block occupies x 35 → 334, y 58 → 140.

Dot centre for 1-based `(row r, column c)`:

```
cx = 35 + (c − 1) × 31 + 10
cy = 58 + (r − 1) × 31 + 10
```

so the first centre is (45, 68) and the last (324, 130).

**Data domain → pixels.** 30 slots, index 0 … 29, oldest first: index `i` is the
day `29 − i` days before today, i.e. index 29 is today. `row = floor(i / 10) + 1`,
`col = (i mod 10) + 1`. The frame's own data is 27 held with rings at 1-based
9, 17, 26 → zero-based 8, 16, 25 → (row 1, col 9), (row 2, col 7), (row 3, col 6).

**Marks.**

| State | Rendering |
| --- | --- |
| held | `20×20`, `borderRadius: 10`, `backgroundColor: '#131313'` |
| not held | `20×20`, `borderRadius: 10`, **no background**, `boxShadow: 'inset 0 0 0 1.5px rgba(0,0,0,0.18)'` |

There is no stroke, no dash, no gridline, no axis, no tick and no label inside
the grid — the only annotation is the "27 held" counter in the card header.

**Counter.** `held = 30 − rings`; the frame's "27 held" is exactly the count of
filled dots, so derive it, never hard-code it.

**Suggested source (the canvas does not state one).** A day is *not held* when a
`lapse` event falls on it — `useEvents()` rows with `type === 'lapse'`, bucketed
by local date key with the same `${y}-${mm}-${dd}` formatter `today.tsx` already
uses at line 77. Everything else is held.

**States the frame does not draw — decide explicitly.**

| Case | Recommended rendering | Basis |
| --- | --- | --- |
| account younger than 30 days | draw all 30 slots; days before `user.createdAt` use the **ring**, and the counter counts only real held days | the frame draws exactly 30 slots with only two marks; adding a third tone has no canvas support |
| no events at all | 30 filled dots, "30 held" | held is the default state |
| every day lapsed | 30 rings, "0 held" | |
| more than 30 days of history | truncate to the trailing 30 | the card is titled "Last 30 days" |
| today, still in progress | held until a lapse lands | matches the ring-on-lapse rule |

**Width portability — the one thing to get right.** `10 × 20 + 9 × 11 = 299`
is exact at a 393pt frame, with no slack. A wrapping flex row with a fixed 11pt
gap will drop to 9 columns on any narrower device (at 375pt the container is 281
and only 9 dots fit), which silently turns the 3-row block into 4 rows and pushes
it past the card's 140 content line. Pin the columns and derive the gap:

```
inner = screenWidth − 24 (card gutters) − 70 (35 left + 35 right)
gap   = (inner − 10 × 20) / 9     // = 11 exactly at 393
```

Ten per row, three rows, always. The dot size (20) stays fixed.

### 8.1 The other drawn things on these pages

| Visual | Domain → pixels | Notes |
| --- | --- | --- |
| score meter | `progress` 0–1 → `width: progress × 100%` of a 329pt track (369 − 20 − 20), h6 r3 | frame shows 60%: `(1240 − 1150) / (1300 − 1150)` = 0.6, which `rankFor()` already returns |
| score delta | sign → triangle direction; `M5 0.5L9.5 8.5H0.5z` up, app uses `M5 8.5L0.5 0.5h9z` down (no canvas counterpart — keep) | hidden when delta is 0 (app behaviour; frame only shows the up state) |
| mood dots | index 0–4 → dots 1–5 filled, cursor ring on the index itself | frame: index 2 |
| energy bars | index 0–4 → bars filled up to the index; heights 9/13/17/21/25 fixed | frame: index 1 |
| lesson rules | `done` 0–6 → first `done` bars ink, rest `rgba(19,19,19,0.15)`; each `flex:1`, gap 7 | frame: 4 of 6 |

---

## 9. What must change

Ordered. Nothing outside these two files.

1. **`src/app/(app)/today.tsx` — split into three pages.** Add a third
   `<View style={{ height: pageH }}>` inside the pager (currently `T` 117–140) and
   re-deal the blocks: page 1 = Day + Score + "This morning" row + readings +
   the new Last-30 card; page 2 = "This week" row + Lesson card + Task card;
   page 3 = "Goal & pledge" row + Pledge card.
2. **`today.tsx` — delete the pager dots** (`T` 216–221). Keep `page`/`setPage`
   only if something else needs it; otherwise drop the `page` prop from `PageOne`
   and the `useState` at `T` 56 with it.
3. **`today.tsx` — page 1 spacing.** After `ScoreCard`, add
   `SectionRow label="This morning" marginTop={16}` (no `action`, offset 0), then
   the existing `ReadingsStrip` at `marginTop: 11.5`, then the new card at
   `marginTop: 16`. Remove `marginTop: 50` + `LessonCard` from `PageOne`.
4. **`src/components/today/kit.tsx` — new `HeldStrip` (or equivalent) component.**
   369-wide card, `height: 140 + 44` → build the full **184**; `borderRadius: 20`,
   `borderCurve: 'continuous'`, `backgroundColor: colors.surface`,
   `boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 10px 24px rgba(40,38,32,0.07)'`,
   `marginHorizontal: 12`, no press affordance. Title `left 20 / top 20`,
   `sans('500')`, 13, `colors.text`. Counter `right 20 / top 20`, `sans('500')`,
   12.5, `colors.textSoft`. Grid at `left 35 / top 58`, 10 columns, pitch derived
   per §8, dots 20×20 r10, held `colors.ink`, not-held
   `boxShadow: 'inset 0 0 0 1.5px rgba(0,0,0,0.18)'` with **no** backgroundColor.
5. **`today.tsx` — page 2 header.** New
   `SectionRow label="This week" action="Library" actionOffset={-2} marginTop={47}`
   routed to the Library tab, then `LessonCard` at `marginTop: 11.5`, then
   `TaskCard` at `marginTop: 24`.
6. **`kit.tsx` — grow the task card.** `height: 246 → 274` (`K` 195);
   `TaskNight` band `height: 96 → 124` in all three places (`K` 152, 153, 161);
   ridge `<Svg height={96} → {124}` keeping `viewBox="0 0 361 96"` and
   `preserveAspectRatio="none"` (`K` 170).
7. **`kit.tsx` — move the task card's body.** label row `top: 114 → 142`
   (`K` 202); check ring `top: 118 → 146` (`K` 213); caption `top: 166 → 194`
   (`K` 230).
8. **`kit.tsx` — task label copy.** The generic state's label is the constant
   **"Today's task"**, not `step.when` (`K` 206). Either drop `when` from
   `DayStep` or keep it for accessibility only; the `DAY_STEPS` table in
   `today.tsx` (40–46) no longer renders "Tonight"/"Before bed".
9. **`kit.tsx` — add the lesson-sourced state (state B).** When the task comes
   from a lesson: label = the lesson's title, well glyph = the lesson's own
   16×16 mark (bed glyph paths in §3.3.4), caption `top: 190`, `sans('500')`,
   `fontSize: 15`, `lineHeight: 22`, **no** `letterSpacing`. Add the bedroom
   night art of §3.3.3 as a new `DayStep.art` (8 absolute views + the 17px
   `#E9D2A4` tick badge).
10. **`kit.tsx` — move the warm glow out of `TaskNight`.** `Glow twarm`
    (`K` 173, `right 40 / top 20 / 70 / #E2BA78 / 0.2 / stop 0.74`) appears in
    `Today Home II` but **not** in `Today Home Task`, so it belongs to the phone
    art, not to the shared night. Render it from the art function.
11. **`today.tsx` — page 3.** `SectionRow label="Goal & pledge"
    action="Past pledges" actionOffset={-2} marginTop={47}` then `PledgeCard` at
    `marginTop: 11.5`. Values inside `PledgeCard` stay exactly as they are.
