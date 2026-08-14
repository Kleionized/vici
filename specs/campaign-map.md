# Spec — Campaign Map I / II / III ("Your twelve weeks")

| Sticky | Frame label | Split file (final) | Pretty file | Prev / diff |
| --- | --- | --- | --- | --- |
| `90B · Your twelve weeks — I–IV (1/3)` | `Campaign Map` | `.uifinal/final/Email Login/Campaign-Map.html` | `.uifinal/pretty/final/Email Login/Campaign-Map.html` | prev + `.uifinal/diffs/Campaign-Map.html.diff` |
| `90C · Your twelve weeks — V–VIII` | `Campaign Map II` | `.uifinal/final/Email Login/Campaign-Map-II.html` | `.uifinal/pretty/final/Email Login/Campaign-Map-II.html` | **new frame** — no prev, no diff |
| `90D · Your twelve weeks — IX–XII` | `Campaign Map III` | `.uifinal/final/Email Login/Campaign-Map-III.html` | `.uifinal/pretty/final/Email Login/Campaign-Map-III.html` | **new frame** — no prev, no diff |

Target app files:

- `/Users/admin/Documents/tideline/src/components/onboarding/v3.tsx` — `O3Reading()` (line 1600), `O3PaperCTA()` (line 421), `O3Shell()` (line 205)
- `/Users/admin/Documents/tideline/src/components/onboarding/art.tsx` — `CampaignMapField()` (line 1006), `CAMPAIGN_WEEKS` (line 1032), `CampaignWeekArt()` (line 1040), `CampaignWeekRow()` (line 1096)
- Routing/chrome context only (not to be edited by this spec): `/Users/admin/Documents/tideline/src/app/(onboarding)/welcome.tsx` — step `reading`, `CHROME.reading = { paper: 'map', backTop: 64 - 54 }`, `NOBAR` includes `reading`.

**Canvas → app top conversion.** Every canvas `top` includes a 54px status bar the app never builds (`SafeAreaView edges={['top']}` stands in for it). Every table below prints **canvas top** and **app top = canvas − 54**. `left` / `right` / `bottom` values carry over unchanged (Yoga measures the absolutely-placed children of `O3Shell`'s content view from that view's edge — this is the convention the existing `CampaignWeekRow` already uses with `left: 24, right: 24`).

Frame box: `393 × 852`, `position:relative; overflow:hidden`. The outer `box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` is the canvas's device bezel, not app chrome — do not port it.

---

## 1. Page model — one map, three pages

The three frames are byte-identical apart from (a) the four week rows and (b) the scroll-indicator thumb position. Everything else — field, chrome, headline, caption, CTA, row tops, halo alphas — repeats verbatim.

| Page | Sticky | Weeks, top → bottom | Thumb declaration | Thumb offset inside track |
| --- | --- | --- | --- | --- |
| 1 (default / entry) | 90B | IV, III, II, I | `bottom:0` | 306px from track top |
| 2 | 90C | VIII, VII, VI, V | `top:153px` | 153px |
| 3 | 90D | XII, XI, X, IX | `top:0` | 0px |

- Row tops on **every** page: `192 / 310 / 428 / 546` (app `138 / 256 / 374 / 492`). Pitch 118, row height 96, gap 22.
- Halo alpha on **every** page, top row → bottom row: `0.62 / 0.5 / 0.38 / 0.3`. Halo `top:7px` on all twelve rows.
- The `You are here` badge appears **once**, on page 1, row 4 (Week I).
- Week numbering runs **upward as you scroll up**: page 1 (weeks I–IV) sits at the bottom of the stack, page 3 (IX–XII) at the top. The frame with no numeral (`Campaign Map`, sticky "1/3") is the entry state, so the map **opens on page 1 with the thumb at the bottom**.

### Contradiction to resolve, and the reading the evidence supports

The indicator can be read two ways:

1. **Three discrete pages, indicator drawn from the page index.** Thumb travel = `450 − 144 = 306`; the three stated offsets `306 / 153 / 0` are exact halves of that travel (`thumbTop = 153 × (3 − page)`), i.e. positions computed from a 3-state index, not from a scroll offset.
2. **One continuous 12-row scroll with a proportional scrollbar.** A proportional thumb of 144 in a 450 track implies content height `450 × 450 / 144 = 1406.25`. Twelve rows at pitch 118 measure `11 × 118 + 96 = 1394`. The numbers do not reconcile (12.25px out), and a proportional thumb over three viewports would be 150, not 144.

**Reading 1 is what the evidence supports**, on three counts: the exact-thirds thumb travel; the halo ramp `0.62 / 0.5 / 0.38 / 0.3` restarting identically on each page (under a continuous scroll the halo belongs to the week, so week VIII and week XII could not both be 0.62); and the sticky note on the entry frame reading literally "(1/3)".

Build it as a horizontally-or-vertically paged container of three fixed pages (or a vertical `ScrollView` with `pagingEnabled`/snap of exactly 450 and `showsVerticalScrollIndicator={false}`), and drive the thumb off the page index with `top = 153 × (3 − page)`.

---

## 2. Field (background) — identical on all three frames

Drawn today by `CampaignMapField()` in `art.tsx`. Transcription for verification:

| Layer | Design value |
| --- | --- |
| base | `background: linear-gradient(180deg, #F6F4F0 0%, #FCFBF9 100%)` (top → bottom, 2 stops, 0% and 100%) |
| wrapper | `position:absolute; inset:0; overflow:hidden; pointer-events:none` |
| bloom (top-left) | `left:-40px; top:-140px; width:540px; height:270px; border-radius:50%; filter:blur(6px)`; `background: radial-gradient(closest-side, rgba(180,170,150,0.14), rgba(19,19,19,0) 72%)` |
| low sun (bottom) | `left:50%; bottom:-300px; width:560px; height:560px; margin-left:-280px; border-radius:50%`; `background: radial-gradient(closest-side, rgba(255,236,196,0.52), rgba(255,236,196,0.23) 45%, rgba(255,236,196,0) 72%)` |
| grain | `inset:0; background-image:url('noise-dark.png'); opacity:0.12` |

No blend mode, no backdrop blur anywhere in these frames.

---

## 3. Chrome (status bar, Back, headline, caption, CTA)

### 3.1 Status bar — canvas only, app does not build it

`top:0; left:0; right:0; height:54px; display:flex; align-items:center; justify-content:space-between; padding:6px 32px 0 46px; box-sizing:border-box; z-index:20`. Clock `9:41`, 17px/600, `#1D1C1A`, `letter-spacing:-0.2px`. Right cluster `display:flex; align-items:center; gap:7px` with three SVGs (`19×12` bars, `17×12` wifi, `27×13` battery), all `#1D1C1A`. **Not ported** — the device draws it. Listed so the 54px offset is auditable.

### 3.2 Back

| Property | Design value | App (`O3Shell`, v3.tsx 261–272) |
| --- | --- | --- |
| container | `position:absolute; left:16px; top:64px` (app top **10**); `display:flex; align-items:center; gap:9px` | `left: 16, top: backTop ?? 40` → `CHROME.reading.backTop = 64 - 54 = 10`; `flexDirection:'row', alignItems:'center', gap: 9` |
| chevron | `<svg width="11" height="19" viewBox="0 0 11 19">` | `Svg width={11} height={19} viewBox="0 0 11 19"` |
| chevron path | see code block below; `fill:none; stroke:#55534E; stroke-width:2.4; stroke-linecap:round; stroke-linejoin:round` | same path, `strokeWidth={2.4}`, round/round, stroke = `PAPER.ink2` = `colors.textMuted` = `#55534E` |
| label | `Back`, 17px/400, `#55534E` | `sans('400'), fontSize 17, color #55534E` |

```
M9.5 1.5L2 9.5l7.5 8
```

### 3.3 Headline

| Property | Design value | App value (`O3Reading`, v3.tsx 1603–1605) |
| --- | --- | --- |
| text | `Your twelve weeks.` | `Your first four weeks.` |
| box | `left:26px; right:26px; top:126px` (app **72**) | `left: 26, right: 26, top: 72` |
| font | 22px / weight 500 / `line-height:1.32` (= 29.04px) / `letter-spacing:0.1px` | `sans('500'), fontSize 22, lineHeight 29.04, letterSpacing 0.1` |
| align, colour | `text-align:center`, `#1D1C1A`, `text-wrap:pretty` | `center`, `#1D1C1A` (no RN equivalent for `text-wrap:pretty`) |

### 3.4 Caption

| Property | Design value | App value (v3.tsx 1609–1611) |
| --- | --- | --- |
| text | `Twelve weeks, one path. Move at your own pace — there's no clock.` (em dash U+2014, straight apostrophe U+0027) | `Four weeks, one path. Move at your own pace — there's no clock.` |
| box | `left:26px; right:26px; top:696px` (app **642**) | `left: 26, right: 26, top: 642` |
| font | 15px / 400 / `line-height:22px` / `#55534E` / `text-align:center` | `sans('400'), fontSize 15, lineHeight 22, color #55534E`, centered |

### 3.5 Primary CTA

| Property | Design value | App value (`O3PaperCTA` via `y={764} ls={0.3}`) |
| --- | --- | --- |
| box | `left:24px; right:24px; top:764px` (app **710**); `height:58px` | `left:24, right:24, bottom: 852 − 764 − 58 = 30, height 58` |
| radius / fill | `border-radius:29px`, `background:#131313` | `borderRadius: 58/2 = 29`, `#131313` |
| layout | `display:flex; align-items:center; justify-content:center; cursor:pointer` | `alignItems:'center', justifyContent:'center'` |
| label | `Show me my path`, 17px/600, `letter-spacing:0.3px`, `#FFFFFF` | `sans('600'), fontSize 17, letterSpacing 0.3, #FFFFFF` |
| states | frame shows default only — no pressed/disabled/selected variant | `PressScale` + `opacity: enabled ? 1 : 0.26` (app-only, always enabled here) |

No progress bar / segment rail on these frames (`NOBAR` already contains `reading` — correct).

---

## 4. Row geometry — identical for all twelve rows

| Property | Design value | App value (`CampaignWeekRow`, art.tsx 1096–1127) |
| --- | --- | --- |
| row box | `position:absolute; left:24px; right:24px; top:{192\|310\|428\|546}; height:96px` | `left:24, right:24, top: w.top, height:96` |
| tile | `position:absolute; inset:0; overflow:hidden; border-radius:14px; background:#F0EFE9; box-shadow:0 0 0 1px rgba(0,0,0,0.05)` | same + **`borderCurve:'continuous'`** (app addition, not in canvas) |
| ground shadow | `left:38px; top:74px; width:52px; height:9px; border-radius:50%; background:rgba(0,0,0,0.08); filter:blur(3px)` | `Wash stops [['0%','rgb(0,0,0)',0.08], ['100%','rgb(0,0,0)',0]]` at `left:38, top:74, 52×9` — documented blur substitute |
| halo | `left:9px; top:7px; width:110px; height:110px; border-radius:50%; background:radial-gradient(closest-side, rgba(255,236,196,α), rgba(255,236,196,0) 72%)` | `Wash stops [['0%','rgb(255,236,196)', w.halo], ['72%','rgb(255,236,196)',0]]` at `left:9, top: w.haloTop, 110×110` |
| copy block | `position:absolute; left:126px; right:14px; top:50%; transform:translateY(-50%)` | `left:126, right:14, top:0, bottom:0, justifyContent:'center'` (equivalent) |
| eyebrow row | `display:flex; align-items:center; gap:8px` (only on the row that carries the badge; the others are a plain block) | always a `flexDirection:'row', alignItems:'center', gap:8` (equivalent) |
| eyebrow | 12.5px / 600 / `#8B8882` | `sans('600'), fontSize 12.5, color #8B8882` |
| badge | 12.5px / 600 / `#FFFFFF`; `background:#131313; border-radius:8px; padding:3px 8px` | `borderRadius:8, backgroundColor:'#131313', paddingHorizontal:8, paddingVertical:3`, label `sans('600') 12.5 #FFFFFF` |
| title | `margin-top:4px`; 15.5 or 16px / 600 / `#1D1C1A`; no max-lines stated (every title fits one line) | `marginTop:4, fontSize: w.titleSize, color:'#1D1C1A'`, `numberOfLines={2}` (app addition) |

Z-order inside the tile, painting order first → last: ground shadow, halo, then the week art in the order transcribed in §6. The copy block is a sibling of the tile and paints above it (it never overlaps).

---

## 5. The twelve weeks

Canvas top is the row top; app top = canvas − 54. `α` = halo alpha; halo `top` is 7 on every row.

| # | Page | Canvas top | App top | Eyebrow | Title | Title size | α | Badge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | 192 | 138 | `Week XII` | `Leave It Behind` | 16 | 0.62 | — |
| 2 | 3 | 310 | 256 | `Week XI` | `Build a Life You Want` | 15.5 | 0.5 | — |
| 3 | 3 | 428 | 374 | `Week X` | `Yourself` | 16 | 0.38 | — |
| 4 | 3 | 546 | 492 | `Week IX` | `Connection` | 16 | 0.3 | — |
| 5 | 2 | 192 | 138 | `Week VIII` | `Boredom and Meaning` | 15.5 | 0.62 | — |
| 6 | 2 | 310 | 256 | `Week VII` | `Relapse and Adversity` | 15.5 | 0.5 | — |
| 7 | 2 | 428 | 374 | `Week VI` | `Discipline` | 16 | 0.38 | — |
| 8 | 2 | 546 | 492 | `Week V` | `Why It Feels Worth It` | 15.5 | 0.3 | — |
| 9 | 1 | 192 | 138 | `Week IV` | `Know Your Brain` | 16 | 0.62 | — |
| 10 | 1 | 310 | 256 | `Week III` | `In the Moment` | 16 | 0.5 | — |
| 11 | 1 | 428 | 374 | `Week II` | `Changing Your Mindset` | 15.5 | 0.38 | — |
| 12 | 1 | 546 | 492 | `Week I` | `Reset` | 16 | 0.3 | **`You are here`** |

---

## 6. Week art — element by element

All coordinates are **local to the 96pt tile** (the tile's own `inset:0` box), exactly as the canvas states them. Painting order is declaration order.

### Week I — `Reset` (page 1, row 4) — *already correct in the app*

| # | Design value |
| --- | --- |
| 1 | `left:40px; top:58px; width:48px; height:11px; border-radius:3px; background:#C6C5C0` |
| 2 | `left:46px; top:46px; width:34px; height:11px; border-radius:3px; background:#D6D5D0` |
| 3 | `left:53px; top:36px; width:20px; height:9px; border-radius:3px; background:#E0DFDA` |

App has this exact art at `CampaignWeekArt` index 3 (art.tsx 1086–1092). Keep.

### Week II — `Changing Your Mindset` (page 1, row 3) — **new art**

| # | Design value |
| --- | --- |
| 1 | `left:66px; top:22px; width:20px; height:20px; border-radius:50%; background:#E9D2A4` |
| 2 | `left:38px; top:40px; width:24px; height:24px; border-radius:50%; background:#E0DFDA` |
| 3 | `left:54px; top:34px; width:30px; height:30px; border-radius:50%; background:#D6D5D0` |
| 4 | `left:34px; top:52px; width:56px; height:16px; border-radius:10px; background:#E0DFDA` |

Pure RN views (`borderRadius` = half of width for the circles: 10 / 12 / 15; pill 10).

### Week III — `In the Moment` (page 1, row 2) — the wave SVG

`<svg width="52" height="40" viewBox="0 0 26 20" style="position:absolute; left:38px; top:26px">` with one path, `stroke="#55534E" stroke-width="2.2" fill="none" stroke-linecap="round"` (no `stroke-linejoin` stated):

```
M2 13c4-8 9 3 13-3s7 2 9-2
```

App has this exact SVG at `CampaignWeekArt` index 2 (art.tsx 1080–1082) — it must **move from week II to week III**.

### Week IV — `Know Your Brain` (page 1, row 1) — **new art**

| # | Design value |
| --- | --- |
| 1 | `left:38px; top:22px; width:48px; height:48px; border-radius:50%; box-shadow: inset 0 0 0 2px #D6D5D0` — no background fill |
| 2 | `left:50px; top:34px; width:24px; height:24px; border-radius:50%; background:#E9D2A4` |
| 3 | `left:82px; top:30px; width:6px; height:6px; border-radius:50%; background:#C6C5C0` |

The 2px inset ring goes through as a verbatim `boxShadow: 'inset 0 0 0 2px #D6D5D0'` string — the codebase already relies on inset `boxShadow` (`v3.tsx:834`).

### Week V — `Why It Feels Worth It` (page 2, row 4) — **new art** (the scales)

| # | Design value |
| --- | --- |
| 1 | `left:52px; top:60px; width:24px; height:6px; border-radius:3px; background:#C6C5C0` |
| 2 | `left:61px; top:32px; width:4px; height:30px; border-radius:2px; background:#C6C5C0` |
| 3 | `left:40px; top:30px; width:46px; height:4px; border-radius:2px; background:#8A857C; transform:rotate(7deg)` |
| 4 | `left:34px; top:32px; width:16px; height:8px; border-radius:0 0 9px 9px; background:#D6D5D0` |
| 5 | `left:76px; top:42px; width:16px; height:8px; border-radius:0 0 9px 9px; background:#E9D2A4` |

**Radius overflow, transcribed exactly:** items 4 and 5 state `9px` bottom radii on a 16×8 box. Horizontally `9 + 9 = 18 > 16` and vertically `9 > 8`, so CSS scales every radius by `f = min(16/18, 8/9) = 0.888…` → **effective 8px**, i.e. a bottom half-disc. RN clamps the same way; write `borderBottomLeftRadius: 9, borderBottomRightRadius: 9` and the result matches. Rotation origin is the box centre in both CSS and RN (no `transform-origin` stated).

### Week VI — `Discipline` (page 2, row 3) — **new art** (mountains, clip-path)

| # | Design value | RN port |
| --- | --- | --- |
| 1 | `left:34px; top:42px; width:34px; height:26px; clip-path:polygon(50% 0, 100% 100%, 0 100%); background:#E0DFDA` | SVG polygon `51,42 68,68 34,68` |
| 2 | `left:52px; top:26px; width:42px; height:42px; clip-path:polygon(50% 0, 100% 100%, 0 100%); background:#D6D5D0` | SVG polygon `73,26 94,68 52,68` |
| 3 | `left:66px; top:26px; width:14px; height:11px; clip-path:polygon(50% 0, 100% 100%, 72% 70%, 50% 95%, 28% 70%, 0 100%); background:#F9F8F4` | SVG polygon `73,26 80,37 76.08,33.7 73,36.45 69.92,33.7 66,37` |
| 4 | `left:72px; top:12px; width:2.5px; height:15px; border-radius:1px; background:#8A857C` | plain View |
| 5 | `left:74px; top:12px; width:10px; height:7px; background:#E9D2A4; clip-path:polygon(0 0, 100% 50%, 0 100%)` | SVG polygon `74,12 84,15.5 74,19` |

Verbatim clip-path strings (do not paraphrase):

```
polygon(50% 0, 100% 100%, 0 100%)
polygon(50% 0, 100% 100%, 72% 70%, 50% 95%, 28% 70%, 0 100%)
polygon(0 0, 100% 50%, 0 100%)
```

RN has no `clip-path`; draw items 1/2/3/5 in one `react-native-svg` `<Svg>` sized to the tile (or one per shape at the stated offsets) using `<Polygon>` / `<Path>` with the absolute points above. Item 4 stays a `View`.

### Week VII — `Relapse and Adversity` (page 2, row 2) — the compass

| # | Design value |
| --- | --- |
| 1 | `left:40px; top:22px; width:48px; height:48px; border-radius:50%; background:#E0DFDA` |
| 2 | `left:53px; top:35px; width:22px; height:22px; border-radius:50%; background:#FAF8F4` |
| 3 | `left:61px; top:24px; width:6px; height:8px; border-radius:2px; background:#C6C5C0` |
| 4 | `left:61px; top:60px; width:6px; height:8px; border-radius:2px; background:#C6C5C0` |
| 5 | `left:42px; top:43px; width:8px; height:6px; border-radius:2px; background:#C6C5C0` |
| 6 | `left:78px; top:43px; width:8px; height:6px; border-radius:2px; background:#C6C5C0` |

App has this exact art at `CampaignWeekArt` index 1 (art.tsx 1064–1075) — it must **move from week III to week VII**.

### Week VIII — `Boredom and Meaning` (page 2, row 1) — **new art**

| # | Design value | Note |
| --- | --- | --- |
| 1 | `left:58px; top:26px; width:18px; height:18px; border-radius:50%; background:#E9D2A4` | plain View, `borderRadius:9` |
| 2 | `left:30px; top:52px; width:66px; height:18px; border-radius:50% 50% 0 0 / 10px 10px 0 0; background:#E0DFDA` | **elliptical radius** — `rx=33, ry=10` on both top corners, 0 on both bottom corners |
| 3 | `left:42px; top:48px; width:3px; height:6px; border-radius:2px; background:#C6C5C0; transform:rotate(-12deg)` | plain View |
| 4 | `left:80px; top:46px; width:3px; height:6px; border-radius:2px; background:#C6C5C0; transform:rotate(10deg)` | plain View |

Item 2 as SVG (tile-local coordinates), since RN `borderRadius` is circular only:

```
M30 70 L30 62 A 33 10 0 0 1 96 62 L96 70 Z
```

### Week IX — `Connection` (page 3, row 4) — **new art**

| # | Design value | Note |
| --- | --- | --- |
| 1 | `left:28px; top:44px; width:40px; height:26px; border-radius:50% 50% 0 0 / 24px 24px 0 0; background:#E0DFDA` | elliptical, `rx=20, ry=24` |
| 2 | `left:58px; top:38px; width:44px; height:32px; border-radius:50% 50% 0 0 / 28px 28px 0 0; background:#D6D5D0` | elliptical, `rx=22, ry=28` |
| 3 | `left:46px; top:32px; width:2.5px; height:13px; border-radius:1px; background:#8A857C` | plain View |
| 4 | `left:48px; top:32px; width:9px; height:6px; background:#E9D2A4; clip-path:polygon(0 0, 100% 50%, 0 100%)` | SVG polygon `48,32 57,35 48,38` |
| 5 | `left:78px; top:26px; width:2.5px; height:13px; border-radius:1px; background:#8A857C` | plain View |
| 6 | `left:80px; top:26px; width:9px; height:6px; background:#E9D2A4; clip-path:polygon(0 0, 100% 50%, 0 100%)` | SVG polygon `80,26 89,29 80,32` |

Items 1 and 2 as SVG (tile-local):

```
M28 70 L28 68 A 20 24 0 0 1 68 68 L68 70 Z
M58 70 L58 66 A 22 28 0 0 1 102 66 L102 70 Z
```

Note item 2 runs to x = 102, which is **inside** the tile only because the tile is `right:14`-wide (row width = 393 − 48 = 345); the tile's `overflow:hidden` is what clips anything that runs past. Keep `overflow:'hidden'` on the tile.

### Week X — `Yourself` (page 3, row 3) — **new art**

| # | Design value | Note |
| --- | --- | --- |
| 1 | `left:46px; top:22px; width:32px; height:44px; border-radius:16px / 22px; background:#F9F8F4; box-shadow: inset 0 0 0 3px #D6D5D0` | `rx=16, ry=22` on all four corners = a **full ellipse** (rx·2 = width, ry·2 = height) |
| 2 | `left:53px; top:28px; width:7px; height:14px; border-radius:4px; background:#FFFFFF; transform:rotate(18deg)` | radius 4 clamps to 3.5 horizontally |
| 3 | `left:50px; top:64px; width:5px; height:9px; border-radius:2px; background:#C6C5C0; transform:rotate(18deg)` | |
| 4 | `left:69px; top:64px; width:5px; height:9px; border-radius:2px; background:#C6C5C0; transform:rotate(-18deg)` | |

Item 1 as SVG (tile-local): outer fill `<Ellipse cx=62 cy=44 rx=16 ry=22 fill="#F9F8F4" />` plus the inset 3px ring as `<Ellipse cx=62 cy=44 rx=14.5 ry=20.5 stroke="#D6D5D0" strokeWidth=3 fill="none" />` (an inset box-shadow of width *w* draws entirely inside the edge, so the stroke centreline sits at `r − w/2`).

### Week XI — `Build a Life You Want` (page 3, row 2) — the house

| # | Design value |
| --- | --- |
| 1 | `left:40px; top:22px; width:48px; height:46px; border-radius:6px 6px 0 0; background:#E0DFDA` |
| 2 | `left:47px; top:28px; width:34px; height:40px; border-radius:3px 3px 0 0; background:#F9F8F4` |
| 3 | `left:60px; top:40px; width:9px; height:9px; border-radius:50%; background:#E9D2A4` |
| 4 | `left:88px; top:26px; width:15px; height:44px; border-radius:2px; background:#D6D5D0; transform:skewY(-8deg); transform-origin:left top` |

App has this exact art at `CampaignWeekArt` index 0 (art.tsx 1041–1062, including `transformOrigin:'left top'`) — it must **move from week IV to week XI**.

### Week XII — `Leave It Behind` (page 3, row 1) — **new art**

| # | Design value | Note |
| --- | --- | --- |
| 1 | `left:44px; top:54px; width:42px; height:11px; border-radius:3px 3px 12px 12px; background:#C6C5C0` | TL 3, TR 3, BR 12, BL 12; vertical 12 > height 11 → CSS scales by `11/12` → effective ≈ 2.75 / 2.75 / 11 / 11 |
| 2 | `left:64px; top:24px; width:2.5px; height:30px; border-radius:1px; background:#8A857C` | plain View |
| 3 | `left:50px; top:26px; width:14px; height:28px; background:#F9F8F4; clip-path:polygon(100% 0, 100% 100%, 0 100%)` | SVG polygon `64,26 64,54 50,54` |
| 4 | `left:68px; top:30px; width:13px; height:24px; background:#E9D2A4; clip-path:polygon(0 0, 100% 100%, 0 100%)` | SVG polygon `68,30 81,54 68,54` |
| 5 | `left:36px; top:68px; width:20px; height:3px; border-radius:2px; background:#D6D5D0` | plain View |

Verbatim clip-paths:

```
polygon(100% 0, 100% 100%, 0 100%)
polygon(0 0, 100% 100%, 0 100%)
```

---

## 7. Visualization — the scroll-position indicator and the halo ramp

### 7.1 Scroll indicator (a 3-state rail, not a proportional scrollbar)

**Coordinate system.** Anchored to the frame, not the row stack: `right:9px; top:192px` (app top **138**). No viewBox — it is two nested boxes, no SVG needed.

| Element | Design value |
| --- | --- |
| track | `position:absolute; right:9px; top:192px; width:4px; height:450px; border-radius:2px; background:rgba(0,0,0,0.06)` |
| thumb | `position:absolute; left:0; width:4px; height:144px; border-radius:2px; background:#C6C5C0` |
| thumb, page 1 | `bottom:0` → offset 306 from track top |
| thumb, page 2 | `top:153px` |
| thumb, page 3 | `top:0` |

**Domain → pixel mapping.** Domain is the page index `p ∈ {1,2,3}` (1 = weeks I–IV). Travel `T = 450 − 144 = 306`. `thumbTop = 153 × (3 − p)` = `T × (3 − p) / 2`. Track top 192 coincides exactly with the first row top (192) and `192 + 450 = 642` coincides with the caption top (696) minus its 54pt gap — i.e. the rail spans exactly the row band `192 … 642`.

- **Axis range:** 0 … 306 (thumb top), no ticks, no labels, no gridlines, no dash arrays.
- **Weights:** track and thumb both 4px wide, radius 2 (full round cap at both ends).
- **No-data / single-page state:** not drawn by any frame. If the map is ever rendered with fewer than 3 pages, hide the rail rather than inventing a thumb size — 144 is a stated constant, not a computed one.
- **Min state (p = 3, top of the stack):** thumb flush with the track top, 306px of empty track below.
- **Max state (p = 1, entry):** thumb flush with the track bottom, 306px of empty track above.
- **Overflow:** the thumb never exceeds the track; `144 + 306 = 450` exactly.

### 7.2 Halo ramp (per-row radial wash)

Four alphas, positional not per-week: row 1 `0.62`, row 2 `0.5`, row 3 `0.38`, row 4 `0.3`, restarting on each page.

- Box: `110 × 110` at `left:9px; top:7px` inside a 96pt-tall tile → the wash overhangs the tile by 21px at the bottom and is clipped by `overflow:hidden`.
- Gradient: `radial-gradient(closest-side, rgba(255,236,196,α) [0%], rgba(255,236,196,0) 72%)`. `closest-side` on a square box = a circle of r = 55 centred at (64, 62) in tile coordinates. The RN `Wash` primitive paints it as an SVG `RadialGradient cx=50% cy=50% rx=50% ry=50%` over a `Rect` filling the same box, with stops `0% → α` and `72% → 0`, which reproduces the stop percentages 1:1.
- Beyond 72% the gradient is fully transparent — there is **no** third colour and no hard edge.

### 7.3 Ground shadow

`52 × 9` ellipse at `left:38px; top:74px`, flat `rgba(0,0,0,0.08)` with `filter:blur(3px)`. RN has no blur filter; the app substitutes a radial wash `0% → rgba(0,0,0,0.08)`, `100% → rgba(0,0,0,0)` over the same box. Keep the substitution (already documented in `art.tsx:1101`), and keep it identical on all twelve rows.

---

## 8. Comparison — design vs current app

App values read from `src/components/onboarding/v3.tsx` (`O3Reading`) and `src/components/onboarding/art.tsx` (`CAMPAIGN_WEEKS`, `CampaignWeekArt`, `CampaignWeekRow`, `CampaignMapField`).

| Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- |
| Frames in the family | 3 (`Campaign Map`, `II`, `III`) | 1 screen, no paging | **MISMATCH** |
| Weeks shown | 12 (I–XII) | 4 (`CAMPAIGN_WEEKS` has 4 entries) | **MISMATCH** |
| Headline text | `Your twelve weeks.` | `Your first four weeks.` | **MISMATCH** |
| Headline box / font | `left:26 right:26 top:126` (app 72); 22/500/29.04/0.1/#1D1C1A/center | `left:26 right:26 top:72`; `sans('500') 22 / 29.04 / 0.1 / #1D1C1A` center | match |
| Caption text | `Twelve weeks, one path. Move at your own pace — there's no clock.` | `Four weeks, one path. Move at your own pace — there's no clock.` | **MISMATCH** |
| Caption box / font | `left:26 right:26 top:696` (app 642); 15/400/22/#55534E/center | `left:26 right:26 top:642`; `sans('400') 15/22 #55534E` center | match |
| Scroll indicator track | `right:9 top:192 (app 138) 4×450 r2 rgba(0,0,0,0.06)` | not rendered | **MISMATCH** |
| Scroll indicator thumb | `4×144 r2 #C6C5C0`, offsets 306 / 153 / 0 | not rendered | **MISMATCH** |
| Row tops | 192 / 310 / 428 / 546 (app 138 / 256 / 374 / 492) | `top: 138, 256, 374, 492` | match |
| Row height / pitch | 96 / 118 | 96 / 118 | match |
| Row inset | `left:24 right:24` | `left:24 right:24` | match |
| Tile | `r14 #F0EFE9 shadow 0 0 0 1px rgba(0,0,0,0.05) overflow:hidden` | same, plus `borderCurve:'continuous'` | match (app adds a squircle the canvas does not state) |
| Ground shadow | `38 / 74 / 52×9 / rgba(0,0,0,0.08) blur 3` | `Wash 0%→0.08, 100%→0` at `38 / 74 / 52×9` | match (documented blur substitute) |
| Halo alphas (rows 1–4) | 0.62 / 0.5 / 0.38 / 0.3 per page | 0.62 / 0.5 / 0.38 / 0.3 | match |
| Halo `top` (rows 1–4) | **7 / 7 / 7 / 7** on all three frames | **7 / 8 / 8 / 8** (`haloTop` in `CAMPAIGN_WEEKS`) | **MISMATCH** (rows 2, 3, 4) |
| Halo box / gradient | `left:9 110×110`, `0% α → 72% 0`, `#FFECC4` | `left:9 110×110`, `0% α → 72% 0`, `rgb(255,236,196)` | match |
| Copy block | `left:126 right:14`, vertically centred | `left:126 right:14 top:0 bottom:0 justifyContent:'center'` | match |
| Eyebrow | 12.5 / 600 / `#8B8882` | `sans('600') 12.5 #8B8882` | match |
| Badge | `#131313`, r8, pad `3px 8px`, 12.5/600/#FFFFFF, gap 8 | same | match |
| Title `margin-top` | 4 | `marginTop: 4` | match |
| Title colour / weight | `#1D1C1A` / 600 | `#1D1C1A` / `sans('600')` | match |
| Week IV title | `Know Your Brain` | `Building the life` | **MISMATCH** |
| Week IV title size | 16 | 16 | match |
| Week IV art | ring `38/22 48×48 inset 0 0 0 2px #D6D5D0` + core `50/34 24×24 #E9D2A4` + dot `82/30 6×6 #C6C5C0` | the house (4 shapes, `40/22 48×46` etc.) | **MISMATCH** |
| Week III title | `In the Moment` | `Setbacks & self-compassion` | **MISMATCH** |
| Week III title size | 16 | 15.5 | **MISMATCH** |
| Week III art | wave SVG `52×40 vb 0 0 26 20` at `38/26` | the compass (6 shapes) | **MISMATCH** |
| Week II title | `Changing Your Mindset` | `Understanding urges` | **MISMATCH** |
| Week II title size | 15.5 | 16 | **MISMATCH** |
| Week II art | 3 circles + pill (`66/22 20`, `38/40 24`, `54/34 30`, `34/52 56×16 r10`) | the wave SVG | **MISMATCH** |
| Week I title | `Reset` | `Foundations` | **MISMATCH** |
| Week I title size | 16 | 16 | match |
| Week I art | 3 bars `40/58 48×11`, `46/46 34×11`, `53/36 20×9` | identical | match |
| Week I badge | `You are here` | `You are here` (`here: true`) | match |
| Weeks V–XII rows | 8 rows, tops/eyebrows/titles/sizes per §5 | absent | **MISMATCH** |
| Weeks V–XII art | 8 drawings per §6 | absent | **MISMATCH** |
| CTA box | `left:24 right:24 top:764 (app 710) h58 r29 #131313` | `O3PaperCTA y=764 h=58` → `bottom:30`, r29, `#131313` | match |
| CTA label | `Show me my path` 17/600/ls0.3/#FFFFFF | same, `ls={0.3}` | match |
| Back | `left:16 top:64 (app 10) gap 9`, chevron `11×19`, sw 2.4, `#55534E`, label 17/400 | `backTop: 64-54 = 10`, same svg/path/width, `PAPER.ink2 = colors.textMuted = #55534E`, 17/400 | match |
| Progress rail | none on any of the three frames | `NOBAR` includes `reading` | match |
| Field base gradient | `linear-gradient(180deg, #F6F4F0 0%, #FCFBF9 100%)` | `LinearGradient ['#F6F4F0','#FCFBF9']` 0,0→0,1 | match |
| Field bloom | `-40 / -140 / 540×270`, `rgba(180,170,150,0.14) → rgba(19,19,19,0) 72%` | identical stops in `CampaignMapField` | match |
| Field low sun | `50% / -300 bottom / 560×560 / ml -280`, `0.52 → 0.23 @45% → 0 @72%` `#FFECC4` | identical | match |
| Field grain | `noise-dark.png` @ `opacity 0.12` | `Noise opacity={0.12}` | match |
| Title max-lines | not stated (all titles single-line) | `numberOfLines={2}` | app addition — harmless, keep |

**Mismatch count: 20 rows.**

---

## 9. What must change

Ordered. No app source has been edited by this spec.

1. **`src/components/onboarding/art.tsx` — `CAMPAIGN_WEEKS`.** Replace the 4-entry array with 12 entries carrying `page` (1–3), the per-page `top` (138 / 256 / 374 / 492), `eyebrow`, `title`, `titleSize` and `halo`, exactly as §5. Set `haloTop: 7` on **every** entry (delete the 8s), or drop `haloTop` from the type and hard-code 7 in `CampaignWeekRow`.
2. **`src/components/onboarding/art.tsx` — `CampaignWeekArt`.** Re-key the switch from row-index to week number. Keep the three existing drawings but re-attach them: house → **week XI**, compass → **week VII**, wave → **week III**, bars stay on **week I**. Add the eight new drawings from §6: weeks II, IV, V, VI, VIII, IX, X, XII.
3. **`src/components/onboarding/art.tsx` — new SVG helpers.** Weeks VI, IX and XII need `clip-path` polygons and weeks VIII, IX, X need elliptical corner radii; neither exists in RN styling. Draw those shapes with `react-native-svg` (`Polygon` / `Path` / `Ellipse`) using the absolute tile-local coordinates and path strings in §6. Week IV and week X keep their rings as verbatim `boxShadow: 'inset 0 0 0 Npx #D6D5D0'` strings.
4. **`src/components/onboarding/art.tsx` — new `CampaignMapRail({ page })`.** Track `position:absolute; right:9; top:138; width:4; height:450; borderRadius:2; backgroundColor:'rgba(0,0,0,0.06)'`; thumb `width:4; height:144; borderRadius:2; backgroundColor:'#C6C5C0'; top: 153 * (3 - page)`.
5. **`src/components/onboarding/v3.tsx` — `O3Reading`.** Change the headline to `Your twelve weeks.` and the caption to `Twelve weeks, one path. Move at your own pace — there's no clock.` (tops, insets and type stay as they are).
6. **`src/components/onboarding/v3.tsx` — `O3Reading` paging.** Hold a `page` state (1 = weeks I–IV, the entry page), render the four rows whose `page` matches, and render `<CampaignMapRail page={page} />`. Wire vertical paging with a snap of exactly 450 (`showsVerticalScrollIndicator={false}`) so the rail stays the only indicator; page 1 must be the initial view. Leave `CHROME.reading`, `NOBAR` and the `O3PaperCTA y={764} ls={0.3}` untouched — they already match.
7. **Do not touch** `CampaignMapField`, the tile/halo/shadow geometry in `CampaignWeekRow`, the Back row, or the CTA: every one of those was verified against all three frames and matches.
