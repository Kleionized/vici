# 92C · Your vow — pixel spec

| | |
|---|---|
| **Sticky note** | `92C · Your vow` (from `.uifinal/final/Email Login/_notes.json`, entry `{"label": "Your Vow Page", "note": "92C &middot; Your vow"}`) |
| **Frame label** | `Your Vow Page` (`data-screen-label`) |
| **Split file (pretty)** | `/Users/admin/Documents/tideline/.uifinal/pretty/final/Email Login/Your-Vow-Page.html` (240 lines) |
| **Split file (raw)** | `/Users/admin/Documents/tideline/.uifinal/final/Email Login/Your-Vow-Page.html` |
| **Diff** | **None.** `.uifinal/diffs/Your-Vow-Page.html.diff` does not exist and `.uifinal/pretty/prev/Email Login/Your-Vow-Page.html` does not exist — this is a **brand-new frame** in this bundle. |
| **Sibling frame (unchanged)** | `108 · The Vow` — `.uifinal/pretty/final/Email Login/The-Vow.html`, present in `prev` with **no diff file**, i.e. unchanged. It is the *signing* screen; 92C is the *read-back* screen. |
| **Entry point in the design** | `92 · Settings` → Anchors group, first row `Your vow` (`.uifinal/pretty/final/Email Login/Settings.html` lines 224–252) |
| **Target app files** | `/Users/admin/Documents/tideline/src/app/(app)/settings.tsx` (entry row), `/Users/admin/Documents/tideline/src/components/onboarding/v3.tsx` (`O3Pledge`, the only existing vow rendering), and its dependency `/Users/admin/Documents/tideline/src/components/onboarding/art.tsx` (`VowSunArt`, `VowSignaturePanel`) |
| **New file the frame requires** | `/Users/admin/Documents/tideline/src/app/vow.tsx` — **does not exist today** |

**Fidelity check.** The pretty file was compared against the raw file after stripping whitespace and the pretty-printer's `|` gutter: the two are identical except for the 10 `·` text-node markers the pretty-printer inserts. Every number below is transcribed from the pretty file character for character.

**Coordinate convention.** Canvas frame is 393 × 852. Canvas `top` includes the 54px status bar the app never builds, so **app top = canvas top − 54**. Both are given in every row. `left`/`right` need no adjustment.

---

## A. Frame shell

| Property | Canvas value | App value | Notes |
|---|---|---|---|
| Frame size | `width:393px; height:852px` | — | reference only |
| `position` | `relative`, `overflow:hidden` | `flex:1` | |
| Background | `#F4F3F0` | `#F4F3F0` | = `colors.bg` |
| Font family (screen default) | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | `sans()` → `System` on iOS | |
| Font smoothing | `-webkit-font-smoothing:antialiased` | n/a | |
| Frame shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | n/a | canvas-only bezel, never built |
| Noise layer | `position:absolute; inset:0; background-image:url('noise-dark.png'); opacity:0.07; pointer-events:none` | `assets/images/noise-dark.png`, `contentFit="cover"`, `opacity 0.07`, `pointerEvents="none"`, absolutely filling | declared first → paints under everything |
| Status bar | `top:0; left:0; right:0; height:54px; padding:6px 32px 0 46px; display:flex; align-items:center; justify-content:space-between; box-sizing:border-box; z-index:20` | **not built** | time `9:41` at 17px/600/`#1D1C1A`/ls −0.2; signal, wifi, battery glyphs — all system chrome |
| Tab bar / home indicator | **not drawn** | none | 92C is a pushed stack route, not a tab screen |
| Primary CTA | **none** | none | unlike 108, this frame has no pill and no "Read it once more" link |

---

## B. Element-by-element transcription

### B1 · Back affordance ("← Settings")

| Property | Value |
|---|---|
| Container | `position:absolute; left:16px; top:64px` → **app top 10**; `display:flex; align-items:center; gap:9px` |
| Chevron `<svg>` | `width="11" height="19" viewBox="0 0 11 19"` |
| Chevron path | `fill="none" stroke="#55534E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"` |
| Label text | `Settings` |
| Label type | `font-size:17px; font-weight:400; color:#55534E`; no letter-spacing, no transform |

```
M9.5 1.5L2 9.5l7.5 8
```

This is byte-identical to `BackGlyph` in `src/components/ui/marks.tsx:205–211` (11 × 19, viewBox `0 0 11 19`, same `d`, `strokeWidth={2.4}`, round cap/join) with `color = colors.textMuted = #55534E`.

### B2 · Screen title

| Property | Value |
|---|---|
| Text | `Your vow` |
| Position | `left:16px; right:16px; top:114px` → **app top 60** |
| Type | `font-size:27px; font-weight:600; letter-spacing:-0.2px; color:#1D1C1A` |
| Wrapping | `white-space:nowrap` → `numberOfLines={1}` |
| Align | default left (no `text-align`) |

### B3 · The sun (halo + disc)

| Property | Halo | Disc |
|---|---|---|
| Position | `left:50%; top:168px` → **app top 114**; `margin-left:-85px` | `left:50%; top:196px` → **app top 142**; `margin-left:-23px` |
| Size | `170px × 170px` | `46px × 46px` |
| Radius | `border-radius:50%` | `border-radius:50%` (→ RN `borderRadius: 23`) |
| Fill | `radial-gradient(closest-side, rgba(226,186,120,0.38), rgba(226,186,120,0) 72%)` | `radial-gradient(circle at 50% 38%, #F8E9CB, #EFD3A2 70%, #E3BE85 100%)` |
| Gradient stops | `rgb(226,186,120) @ 0%, α 0.38` → `rgb(226,186,120) @ 72%, α 0` | `#F8E9CB @ 0%` → `#EFD3A2 @ 70%` → `#E3BE85 @ 100%` |
| Filter | `filter:blur(3px)` | — |
| Shadow | none | `0 6px 18px rgba(226,186,120,0.45)` |
| Blend / backdrop | none | none |

Derived geometry (frame centre x = 196.5):
- Halo box: x 111.5 → 281.5, canvas y 168 → 338 (app 114 → 284). Halo centre (196.5, canvas 253 / app 199).
- Disc box: x 173.5 → 219.5, canvas y 196 → 242 (app 142 → 188). Disc centre (196.5, canvas 219 / app 165).
- **Disc offset inside the halo box: left 62, top 28.** Disc centre sits **34px above** the halo centre.
- The disc's own gradient centre `50% 38%` sits at disc-local (23, 17.48).

### B4 · The vow line

| Property | Value |
|---|---|
| Text | `I’m done letting the wave decide. One evening at a time, I take the watch back.` (`&rsquo;` = U+2019) |
| Position | `left:40px; right:40px; top:296px` → **app top 242**; column width 313 |
| Font family | `Georgia,'Times New Roman',serif` (= `fonts.quote`) |
| Size / leading | `font-size:20px; line-height:32px` |
| Weight | none declared → 400 |
| Colour | `#1D1C1A` |
| Align | `text-align:center` |
| Balance | `text-wrap:balance` — RN has no equivalent; accept natural wrapping |
| Max lines | none |

### B5 · Signature card

| Property | Value |
|---|---|
| Position | `left:36px; right:36px; top:452px` → **app top 398**; width 321 |
| Height | `170px` (card bottom: canvas 622 / **app 568**) |
| Radius | `border-radius:18px` (all four corners) |
| Background | `#FFFFFF` |
| Shadow | `0 0 0 1.5px rgba(0,0,0,0.08), 0 14px 34px rgba(40,38,32,0.10)` — an **outer** 1.5px ring plus a soft drop shadow |
| Border | none (the ring is a spread shadow, not `border-width`) |
| Overflow | not set |

#### Children (offsets are relative to the card box; `bottom` is measured from the card's bottom edge)

| # | Element | Position | Type / paint |
|---|---|---|---|
| 1 | `SIGNATURE` | `left:16px; top:13px` | `font-size:10.5px; font-weight:600; letter-spacing:1.6px; color:#C6C3BC`; no `text-transform` — the string is literally uppercase |
| 2 | Ink stroke `<svg>` | `position:absolute; left:50px; bottom:40px` | `width="216" height="64" viewBox="0 0 216 64"` (1:1, no scaling) |
| 3 | `×` | `left:24px; bottom:42px` | `font-size:14px; color:#B0AEA8` (`&times;` = U+00D7); no weight declared → 400 |
| 4 | Rule | `left:22px; right:22px; bottom:38px` | `height:1.5px; background:rgba(0,0,0,0.26)`; width 277 (321 − 22 − 22) |
| 5 | Signer name | `left:24px; bottom:15px` | `font-size:11.5px; font-weight:500; color:#B0AEA8`; text `Sam` |
| 6 | Stamp | `right:22px; bottom:15px` | `font-size:11.5px; font-weight:500; color:#B0AEA8`; text `14 Mar 2026 · Day 0` (`&middot;` = U+00B7) |
| — | **`Clear` affordance** | **absent** | 108 has one at `right:16px; top:11px`; **92C deliberately has none** — this screen is read-only |

Frame-absolute positions of the card's children (canvas / app):
- Ink svg box: x 86 → 302; y canvas 518 → 582, **app 464 → 528**.
- Rule: x 58 → 335; y canvas 582.5 → 584, **app 528.5 → 530**. The ink svg's bottom edge stops exactly **0.5px above** the rule's top edge.
- `×` box bottom: canvas 580 / app 526. Name + stamp box bottom: canvas 607 / app 553.

### B6 · Footer lines

| Property | "Held" line | Footnote |
|---|---|---|
| Text | `Held for 92 days.` | `After a relapse you can re-sign the vow. It resets the promise, never the progress.` |
| Position | `left:0; right:0; top:648px` → **app top 594** | `left:36px; right:36px; top:692px` → **app top 638** |
| Align | `text-align:center` | `text-align:center` |
| Size | `13px` | `13px` |
| Weight | `500` | `400` |
| Line height | not declared (natural) | `19px` |
| Colour | `#8B8882` (= `colors.textSoft`) | `#8B8882` |
| Column width | 393 | 321 |

**Vertical rhythm (app coords):** back 10 → title 60 (+50) → halo 114 (+54) → disc 142 → quote 242 → card 398 (card ends 568) → "Held" 594 (+26 from card bottom) → footnote 638 (+44 from "Held" top).

### B7 · States the frame shows

| State | Shown? | Rendering |
|---|---|---|
| Signed / default | **yes** | ink stroke + terminal dot painted, name and stamp printed, "Held for N days." present |
| Unsigned / empty | no | frame never draws it. 108 covers signing; 92C shows only the signed result |
| Pressed | no | no pressed treatment anywhere; the back row is the only tappable thing |
| Disabled | no | — |
| Selected | no | — |
| Clear / re-sign | no control | the copy points at a *relapse* flow re-signing the vow, not an in-place Clear |

---

## C. Visualization — the signature ink

The only custom drawing on the frame (the sun is CSS gradients, covered in B3).

| Property | Value |
|---|---|
| Coordinate system | `viewBox="0 0 216 64"` rendered at `216 × 64` CSS px → **scale 1.0**, no aspect distortion |
| Placement | card-relative `left:50px; bottom:40px`; frame x 86 → 302, app y 464 → 528 |
| Stroke colour | `#26261F` |
| Stroke width | `2.2` |
| Line cap | `round` |
| Line join | `round` |
| Fill | `none` |
| Dash array | none (solid) |
| Terminal point | `<circle cx="138" cy="34" r="2.6" fill="#26261F">` — a filled dot, same ink, no stroke |
| Clip / mask | none |
| Gradient | none |
| Painted extent (path) | x 6 → 138 in viewBox units; the dot pushes the right edge to 140.6, so the ink occupies roughly the left 141 of the 216 box — **the box is deliberately wider than the drawing**; do not re-fit it |

Path `d`, verbatim:

```
M6 46 C 20 8, 44 6, 40 30 C 36 52, 12 56, 34 44 C 58 30, 78 22, 96 36 C 108 46, 122 30, 138 34
```

Reading of the geometry: one absolute move to (6,46), then four cubic Bézier segments — an upstroke loop, a descending back-loop, a long rightward sweep, and a final flick that ends at (138,34) where the dot is planted. The ink floats above the rule (it does not sit on it): the svg's bottom edge is 0.5px above the rule's top edge and the stroke's terminal is 30px higher still.

Rendering at the edge cases (design is silent; these are the decisions the build must make, flagged as such):
- **No vow record** — 92C draws no empty state. Either the screen is unreachable until the vow exists, or the ink and stamp are omitted and only the rule, `×` and name remain. Do not invent a new visual.
- **Day 0 / signed today** — stamp reads `… · Day 0`; the "Held" line would read `Held for 0 days.` on the frame's own arithmetic.
- **Long name** — the stamp is right-anchored at 22 and the name left-anchored at 24; with a long display name they will collide. Design shows a 3-character name. Clamp the name to one line and let it shrink/ellipsize; the stamp is fixed-width copy.

---

## D. Comparison

### D1 · Screen-level: design 92C vs the app today

No `vow` screen exists. Verified: `src/app` and `src/app/(app)` contain no `vow.tsx`; `grep -rni "vow" src/` returns only comments, lesson prose, `JourneyScreens` row labels, and the onboarding `O3Pledge` / `VowSunArt` / `VowSignaturePanel`.

| Property | Design value | Current app value | Verdict |
|---|---|---|---|
| Route | a screen reachable from Settings | **no route** — `src/app/vow.tsx` absent | **MISMATCH** |
| Settings entry row | `Your vow`, first row of the Anchors card (Settings frame 92, `height:48px`, 16/500 `#1D1C1A`, chevron 8 × 14 `#B0AEA8`) | Anchors rows in `settings.tsx:102–110` are `Edit your Life Map`, `Find support`, `Medallions`, `Open urge surf with a Back Tap` — **no `Your vow` row** | **MISMATCH** |
| Screen background | `#F4F3F0` | absent | **MISMATCH** |
| Noise overlay | `opacity 0.07`, inset 0 | absent (pattern exists at `settings.tsx:58`) | **MISMATCH** |
| Back row | `left 16, app top 10`, gap 9, `BackGlyph` `#55534E` + `Settings` 17/400 `#55534E` | absent (identical pattern exists at `src/app/privacy.tsx:41–48`) | **MISMATCH** |
| Title | `Your vow`, left 16, app top 60, 27/600, ls −0.2, `#1D1C1A`, 1 line | absent (identical token trio at `settings.tsx:63` and `privacy.tsx:53`) | **MISMATCH** |
| Halo | 170 box, app top 114, `rgba(226,186,120,.38) → 0 @72%`, blur 3 | absent | **MISMATCH** |
| Sun disc | 46 box, app top 142, `SUN_97` stops, `0 6px 18px rgba(226,186,120,0.45)` | absent | **MISMATCH** |
| Vow line | Georgia 20/32, `#1D1C1A`, centred, left/right 40, app top 242 | absent. Nearest: `v3.tsx:1779–1781` renders the same sentence as `sans('400')` **15.5/24 `#55534E`**, left/right 44, top 120 — a different screen (108) and not reusable as-is | **MISMATCH** |
| Signature card | white, app top 398, 321 × 170, r18, outer ring + drop shadow | absent | **MISMATCH** |
| "Held for 92 days." | 13/500 `#8B8882`, centred, app top 594 | absent; the app has **no day-count helper on this path** (`dayNumber()` is local to `src/app/day/morning.tsx:76–78`) | **MISMATCH** |
| Footnote | 13/400, lh 19, `#8B8882`, centred, left/right 36, app top 638 | absent | **MISMATCH** |
| Stamp data source | `14 Mar 2026 · Day 0` — a persisted signing date | **nothing persists the vow signing.** `O3Pledge` (`v3.tsx:1772–1793`) holds `inked` in local `useState` and `next()` discards it; `convex/schema.ts` `users` has only `createdAt` and `settings`, no vow field; `JourneyScreens.tsx:303` infers `vowed` from a `journalEntries` row with `tag === 'Pledge'` (which is the *daily* pledge from `src/app/day/morning.tsx:147`, not the vow) | **MISMATCH** |
| Signer name | `Sam` | available: `useAuth().displayName` / `user.displayName` (`settings.tsx:52` uses `displayName \|\| user?.displayName \|\| 'You'`) | match (source exists) |

### D2 · Component-level: design 92C vs `art.tsx` / `v3.tsx` as they stand

These are the components an engineer would reach for. Every row is a real delta that must be resolved before reuse.

| Property | Design value (92C) | Current app value | Verdict |
|---|---|---|---|
| Sun art box | `170 × 170` | `VowSunArt` (`art.tsx:929`) `200 × 200` | **MISMATCH** |
| Halo `Wash` box | `170 × 170` at halo origin | `art.tsx:936` `left 0, top 0, width 200, height 200` | **MISMATCH** |
| Halo stops | `rgb(226,186,120) 0% α.38` → `rgb(226,186,120) 72% α0` | `art.tsx:932–935` identical | match |
| Halo blur | `blur(3px)` | not implemented (comment `art.tsx:930` acknowledges it) | MISMATCH (accepted precedent — RN has no view blur here) |
| Disc size | `46` | `art.tsx:939` `size={56}` | **MISMATCH** |
| Disc offset in box | `left 62, top 28` | `art.tsx:944` `left: 72, top: 26` | **MISMATCH** |
| Disc `borderRadius` | 23 | `art.tsx:944` `borderRadius: 28` | **MISMATCH** |
| Disc gradient centre / r | `circle at 50% 38%` → `r 79.6%` | `art.tsx:941–942` `cx="50%" cy="38%" r="79.6%"` | match |
| Disc stops | `#F8E9CB 0%, #EFD3A2 70%, #E3BE85 100%` | `SUN_97` (`art.tsx:479–483`) identical | match |
| Disc shadow | `0 6px 18px rgba(226,186,120,0.45)` | `art.tsx:944` identical | match |
| Panel background | `#FFFFFF` | `VowSignaturePanel` (`art.tsx:958`) `#FAF9F6` | **MISMATCH** |
| Panel shadow | `0 0 0 1.5px rgba(0,0,0,0.08), 0 14px 34px rgba(40,38,32,0.10)` (outer ring + lift) | `art.tsx:958` `inset 0 0 0 1.5px rgba(0,0,0,0.10)` (inset ring, no lift) | **MISMATCH** |
| Panel size / radius | `321 × 170`, r18, left/right 36 | `art.tsx:958` height 170, r18, `borderCurve:'continuous'`; inset supplied by caller (`v3.tsx:1785` left/right 36) | match |
| `SIGNATURE` caption | left 16, top 13, 10.5/600, ls 1.6, `#C6C3BC` | `art.tsx:959` identical | match |
| `Clear` affordance | **absent** | `art.tsx:960–968` always rendered, `right 16, top 11`, 12.5/500 `#B0AEA8` | **MISMATCH** |
| Tap-to-sign hit area | **absent** (read-only screen) | `art.tsx:989–995` full-width `Pressable` from `top 38` down | **MISMATCH** |
| Ink svg offset | `left 50, bottom 40` | `art.tsx:970` `left: 44, bottom: 36` | **MISMATCH** |
| Ink svg size / viewBox | `216 × 64`, `0 0 216 64` | `art.tsx:970` identical | match |
| Ink path `d` | see fenced block above | `art.tsx:972` identical string | match |
| Ink stroke | `#26261F`, 2.2, round/round, no fill | `art.tsx:974–977` identical | match |
| Terminal dot | `cx 138 cy 34 r 2.6 #26261F` | `art.tsx:979` identical | match |
| `×` offset | `left 24, bottom 42` | `art.tsx:982` `left 24, bottom 38` | **MISMATCH** |
| `×` type | 14px `#B0AEA8` | `art.tsx:982` identical | match |
| Rule offset | `left 22, right 22, bottom 38`, h 1.5, `rgba(0,0,0,0.26)` | `art.tsx:983` `bottom 34`, everything else identical | **MISMATCH** |
| Name offset | `left 24, bottom 15` | `art.tsx:984` `left 24, bottom 13` | **MISMATCH** |
| Stamp offset | `right 22, bottom 15` | `art.tsx:985` `right 22, bottom 13` | **MISMATCH** |
| Name / stamp type | 11.5/500 `#B0AEA8` | `art.tsx:984–985` identical | match |
| Stamp format | `14 Mar 2026 · Day 0` — `d MMM yyyy · Day N` | `vowStamp()` (`v3.tsx:1767–1770`) `toLocaleDateString('en-US', { month:'short', day:'numeric' })` → `Mar 14 · Day 0` — **wrong order, no year, always "Day 0"** | **MISMATCH** |
| Signed state | always inked | `art.tsx:969` gated on the `signed` prop | needs `signed` pinned true (config, not a defect) |

**Contradiction in the bundle, named explicitly:** 92C and 108 draw the same panel with different arithmetic — 108 puts the ink at `left 44 / bottom 36`, the rule at `bottom 34`, the name/stamp at `bottom 13`; 92C puts them at `left 50 / bottom 40`, `bottom 38`, `bottom 15`. The panel is otherwise identical (same height, radius, caption, path, stroke). The evidence supports **two variants of one panel, not a redrawn one**: every 92C interior offset is exactly +4 (rule, `×`, ink) or +2 (name, stamp) higher than 108's, and the ink also moves +6 right. Build it as one component with a variant prop rather than duplicating the drawing, and keep 108's numbers untouched (108 has no diff, so it is still correct).

**Open question for the product owner (not a spec value):** the frame prints `Held for 92 days.` unconditionally, but the app gates any days-since number behind `settings.showStreak` (`settings.tsx:54, 77` — "Show a 'days since' number") and `convex/schema.ts:8–10` records the deliberate absence of a stored streak. Decide whether this line respects `showStreak`. The canvas does not answer this; do not silently pick one.

---

## E. What must change

1. **`src/app/vow.tsx` — create the screen (new file).** Copy the shell of `src/app/privacy.tsx`: `View flex:1 bg #F4F3F0` → noise `Image` at `opacity 0.07` → `SafeAreaView edges={['top']}` → inner plain `View flex:1` for absolute children. Back row `PressScale` at `left 16, top 10`, `flexDirection:'row'`, `gap 9`, `BackGlyph color="#55534E"` + `AppText sans('400') 17 #55534E` reading `Settings`, `accessibilityLabel="Back to Settings"`, falling back to `router.replace('/(app)/settings')`. Title `AppText sans('600')` at `left 16, top 60`, `fontSize 27`, `letterSpacing -0.2`, `color '#1D1C1A'`, `numberOfLines={1}`.
2. **`src/app/vow.tsx` — the sun.** Halo `View` at `left:'50%', marginLeft:-85, top:114, width:170, height:170` and disc at `left:'50%', marginLeft:-23, top:142, width:46, height:46`. Do **not** reuse `VowSunArt` unscaled: 170/200 = 0.85 but the disc is 46 (not 47.6) and its top offset is 28 (not 22.1), so this is a distinct variant. Add a `VowSunArt` size variant in `art.tsx` (`{ box:170, disc:46, discLeft:62, discTop:28, discRadius:23 }`) reusing `Wash` and `SunDisc` with `SUN_97` and `r="79.6%"`.
3. **`src/components/onboarding/art.tsx` — parameterise `VowSignaturePanel`.** Add a read-back variant: background `#FFFFFF`, `boxShadow: '0 0 0 1.5px rgba(0,0,0,0.08), 0 14px 34px rgba(40,38,32,0.10)'`, no `Clear` control, no tap-to-sign `Pressable`, ink svg at `left 50, bottom 40`, `×` at `bottom 42`, rule at `bottom 38`, name and stamp at `bottom 15`. Leave the existing 108 numbers (`#FAF9F6`, inset ring, 44/36/38/34/13/13) exactly as they are — 108 is unchanged in this bundle.
4. **`src/app/vow.tsx` — the vow line.** `AppText center` at `left 40, right 40, top 242`, `fontFamily: fonts.quote`, `fontSize 20`, `lineHeight 32`, `color '#1D1C1A'`. Do not reuse `O3Pledge`'s 15.5/24 `#55534E` sans treatment — that is 108's subtitle, not this screen's hero line.
5. **`src/app/vow.tsx` — the two footer lines.** `Held for {n} days.` at `left 0, right 0, top 594`, `sans('500') 13 #8B8882`, centred; footnote at `left 36, right 36, top 638`, `sans('400') 13`, `lineHeight 19`, `#8B8882`, centred, text `After a relapse you can re-sign the vow. It resets the promise, never the progress.`
6. **Stamp format — fix `vowStamp()` or write a screen-local formatter.** 92C needs `d MMM yyyy · Day N` (`14 Mar 2026 · Day 0`), i.e. `toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })` plus the day number at signing. `v3.tsx:1767` currently produces `Mar 14 · Day 0`. Changing `vowStamp()` in place would alter 108, which is unchanged in this bundle — so add a second formatter rather than editing that one.
7. **Persist the vow.** Nothing stores it today (`O3Pledge`'s `inked` is local state; `users` has no vow field; the `Pledge`-tagged journal row is the *daily* pledge). Add a signing timestamp — the smallest change consistent with the schema's no-streak invariant is a `vowSignedAt: v.optional(v.number())` on `users`, written when `O3Pledge` advances (`src/app/(onboarding)/welcome.tsx:239–240`) and re-written on the relapse re-sign path. `Day N` and `Held for N days.` both derive from it via the `Math.floor((Date.now() - t) / 86_400_000)` arithmetic already used at `src/app/day/morning.tsx:78`.
8. **`src/app/(app)/settings.tsx` — add the entry row.** The Settings frame puts `Your vow` first in the Anchors card, above `Your letter`. Add `<Row title="Your vow" onPress={() => router.push('/vow')} />` plus a `<Divider />` as the first child of the existing `<Section header="Anchors" …>` block (currently `settings.tsx:102–110`, opening with `Edit your Life Map`). Note the Settings frame's Anchors rows are `height:48px` while `Row` renders 52 — that delta belongs to `specs/settings.md`, not here; do not change `Row` from this spec.
9. **Decide the `showStreak` question in item D2's note before shipping item 5.** The frame prints the day count unconditionally; the app has a user toggle for exactly that number.
