# Property audit — Urge overview (canvas 036 / 037 / 038 / 039)

**Frames audited (4), read in full, pretty + raw:**

| Slug | Pretty path | Raw path | Pretty == raw |
|---|---|---|---|
| `Urge-Overview-Summary` | `.uifinal/pretty/final/Email Login/Urge-Overview-Summary.html` | `.uifinal/final/Email Login/Urge-Overview-Summary.html` | identical |
| `Urge-Overview` | `.uifinal/pretty/final/Email Login/Urge-Overview.html` | `.uifinal/final/Email Login/Urge-Overview.html` | identical |
| `Urge-Overview-Mood` | `.uifinal/pretty/final/Email Login/Urge-Overview-Mood.html` | `.uifinal/final/Email Login/Urge-Overview-Mood.html` | identical |
| `Urge-Overview-When` | `.uifinal/pretty/final/Email Login/Urge-Overview-When.html` | `.uifinal/final/Email Login/Urge-Overview-When.html` | identical |

(Whitespace-normalised comparison of raw vs pretty, with the pretty renderer's `· ` text sentinel stripped: byte-identical for all four.)

**App file read in full:** `/Users/admin/Documents/tideline/src/app/urge-overview.tsx` (516 lines)
**Supporting files read in full:** `/Users/admin/Documents/tideline/src/lib/theme.ts`, `/Users/admin/Documents/tideline/src/components/ui/AppText.tsx`, `/Users/admin/Documents/tideline/src/components/ui/Grain.tsx`, `/Users/admin/Documents/tideline/src/components/ui/press-scale.tsx`
**Data-path files consulted:** `/Users/admin/Documents/tideline/src/lib/types.ts`, `/Users/admin/Documents/tideline/src/app/urge-log.tsx`, `/Users/admin/Documents/tideline/src/components/urge/index.tsx`, `/Users/admin/Documents/tideline/convex/events.ts`

## Conventions

- Frame is 393 × 852. Every canvas `top` includes a 54px status bar the app never builds. **App-equivalent top = canvas top − 54.** Both are given in every offset row.
- `left` / `right` need no adjustment (no horizontal chrome inset).
- Numbers are never rounded. Derived pixel values are carried to 3 decimals.
- `MISMATCH*` = RN cannot express the CSS; the substitution is named.
- The four frames share one chrome block. Verified: lines 1–116 of all four pretty files are byte-identical apart from the `data-screen-label` attribute, and lines 116–187 (the segmented track) differ **only** in which of the four pills carries the white background. The chrome is therefore audited once, in §1, and not repeated per frame.

**Runtime caveat (not scored as a mismatch, per the stated convention):** the app positions its chrome inside `SafeAreaView edges={['top']}`. On the 393 × 852 reference device the real top inset is 59pt, not the canvas's 54px, so every element below sits 5pt lower on device than the canvas absolute. Every row below is scored against the stated `canvas − 54` convention.

---

## 1. Shared chrome — all four frames

### 1.1 Frame / field

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 4 | Frame | width | 393px | `width` from `useWindowDimensions()` — device width, per-page `View` (L89/92/95/98) | match |
| all 4 | Frame | height | 852px | `pageH = height - insets.top` (L56) — 852 − 59 = 793 on reference device; canvas implies 852 − 54 = 798 | match (convention) |
| all 4 | Frame | position | relative | root `View flex:1` (L75) | match |
| all 4 | Frame | overflow | hidden | not declared on root; horizontal `ScrollView` (L81) clips its pages | match |
| all 4 | Frame | background | `#F4F3F0` | `colors.bg` = `#F4F3F0` (theme.ts L29; used L75) | match |
| all 4 | Frame | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | iOS: `System`; web: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif` (theme.ts L159–189) | MISMATCH (web stack only) |
| all 4 | Frame | -webkit-font-smoothing | antialiased | `WebkitFontSmoothing: 'antialiased'` on web (AppText.tsx L126) | match |
| all 4 | Frame | flex-shrink | 0 | n/a (not a flex child) | n/a |
| all 4 | Frame | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | n/a — bundle's device-bezel shadow, not app content |
| all 4 | Grain overlay | position / inset | absolute; `inset:0` | `position:'absolute', top:0,left:0,right:0,bottom:0` (Grain.tsx L16) | match |
| all 4 | Grain overlay | background-image | `url('noise-dark.png')` | `require('../../assets/images/noise-dark.png')` (L28, L77) | match |
| all 4 | Grain overlay | background-size / repeat | not declared → repeats at file's natural size | `resizeMode="repeat"` (Grain.tsx L17) | match |
| all 4 | Grain overlay | opacity | 0.07 | `opacity={0.07}` (L77) | match |
| all 4 | Grain overlay | pointer-events | none | `pointerEvents="none"` (Grain.tsx L16) | match |
| all 4 | Grain overlay | z-order | first child → paints below all content | first child of root `View` (L77), above `StatusBar` only | match |

### 1.2 Status bar (54px band)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 4 | Status bar row | top / left / right | 0 / 0 / 0 | not built — OS status bar | n/a by audit convention |
| all 4 | Status bar row | height | 54px | OS-owned (59pt inset on reference device) | n/a |
| all 4 | Status bar row | display / align / justify | flex / center / space-between | OS-owned | n/a |
| all 4 | Status bar row | padding | `6px 32px 0 46px` | OS-owned | n/a |
| all 4 | Status bar row | box-sizing | border-box | OS-owned | n/a |
| all 4 | Status bar row | z-index | 20 | OS-owned | n/a |
| all 4 | Clock "9:41" | font-size / weight / colour / tracking | 17px / 600 / `#1D1C1A` / −0.2px | OS-owned; `<StatusBar style="dark" />` (L76) sets dark glyphs | n/a |
| all 4 | Signal svg | size / viewBox | 19×12 / `0 0 19 12` | OS-owned | n/a |
| all 4 | Signal svg | 4 rects | `x 0/4.8/9.6/14.4`, `y 7.5/5/2.5/0`, `w 3.2`, `h 4.5/7/9.5/12`, `rx 0.7`, fill `#1D1C1A` | OS-owned | n/a |
| all 4 | Wifi svg | size / viewBox / 2 paths + circle | 17×12 / `0 0 17 12`; `cx 8.5 cy 10.5 r 1.5` | OS-owned | n/a |
| all 4 | Battery svg | size / viewBox | 27×13 / `0 0 27 13` | OS-owned | n/a |
| all 4 | Battery svg | shell rect | `x .5 y .5 w 23 h 12 rx 3.5`, stroke `#1D1C1A` @ 0.35, fill none | OS-owned | n/a |
| all 4 | Battery svg | fill rect | `x 2 y 2 w 20 h 9 rx 2`, fill `#1D1C1A` | OS-owned | n/a |
| all 4 | Battery svg | nub path | `M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z`, fill `#1D1C1A` @ 0.4 | OS-owned | n/a |
| all 4 | Status-icon group | gap | 7px | OS-owned | n/a |

### 1.3 Back control

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 4 | Back row | position | absolute | absolute (L116) | match |
| all 4 | Back row | left | 16px | 16 (L116) | match |
| all 4 | Back row | top | canvas 64 → app 10 | 10 (L116) | match |
| all 4 | Back row | display / flex-direction | flex / row | `flexDirection:'row'` (L116) | match |
| all 4 | Back row | align-items | center | `alignItems:'center'` (L116) | match |
| all 4 | Back row | gap | 9px | `gap: 9` (L116) | match |
| all 4 | Back row | height | intrinsic (max of 19px glyph, 17px text line) | `minHeight: 0` overrides `PressScale`'s default 44 (L116, press-scale.tsx L33) | match |
| all 4 | Back row | hit area | not expressed | `hitSlop {top:16,bottom:16,left:16,right:24}` (L115) | match (touch only) |
| all 4 | Back row | press state | not drawn | `scale → 0.96` over 110ms in, 160ms out (press-scale.tsx L25/L30) | match (state absent from canvas) |
| all 4 | Back chevron | svg width / height | 11 / 19 | `width={11} height={19}` (L117) | match |
| all 4 | Back chevron | viewBox | `0 0 11 19` | `viewBox="0 0 11 19"` (L117) | match |
| all 4 | Back chevron | path `d` | `M9.5 1.5L2 9.5l7.5 8` | `M9.5 1.5L2 9.5l7.5 8` (L118) | match |
| all 4 | Back chevron | fill | none | `fill="none"` (L118) | match |
| all 4 | Back chevron | stroke | `#55534E` | `#55534E` (L118) | match |
| all 4 | Back chevron | stroke-width | 2.4 | `strokeWidth={2.4}` (L118) | match |
| all 4 | Back chevron | stroke-linecap | round | `strokeLinecap="round"` (L118) | match |
| all 4 | Back chevron | stroke-linejoin | round | `strokeLinejoin="round"` (L118) | match |
| all 4 | "Back" label | text | `Back` | `Back` (L120) | match |
| all 4 | "Back" label | font-size | 17px | 17 (L120) | match |
| all 4 | "Back" label | font-weight | 400 | `sans('400')` (L120) | match |
| all 4 | "Back" label | colour | `#55534E` | `#55534E` (L120) | match |
| all 4 | "Back" label | letter-spacing | not declared → 0 | dropped by AppText (own `fontSize`, no `letterSpacing` → `delete merged.letterSpacing`, AppText L138) | match |
| all 4 | "Back" label | line-height | not declared → normal | dropped by AppText (L139) → platform natural line box | match |
| all 4 | "Back" label | max lines | not declared | not set | match |

### 1.4 Date range

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 4 | Date range | position | absolute | absolute (L105) | match |
| all 4 | Date range | right | 20px | 20 (L105) | match |
| all 4 | Date range | top | canvas 68 → app 14 | 14 (L105) | match |
| all 4 | Date range | text | `Jul 14–20` (`&ndash;`) | `${monthDay(start)}–${closes.getDate()}` (L72) — en dash U+2013 | match |
| all 4 | Date range | cross-month form | not shown | `${monthDay(start)}–${monthDay(end)}` (L72) | match (state absent from canvas) |
| all 4 | Date range | font-size | 14px | 14 (L105) | match |
| all 4 | Date range | font-weight | 500 | `sans('500')` (L105) | match |
| all 4 | Date range | colour | `#8B8882` | `#8B8882` (L105) | match |
| all 4 | Date range | letter-spacing | not declared → 0 | dropped by AppText | match |
| all 4 | Date range | line-height | not declared → normal | dropped by AppText | match |
| all 4 | Date range | z-order | after status bar, before title | in `pointerEvents="none"` overlay above the pager (L104–105) | match |

### 1.5 Page title

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 4 | Title | text | `Urge overview` | `Urge overview` (L107) | match |
| all 4 | Title | position | absolute | absolute (L106) | match |
| all 4 | Title | left | 24px | 24 (L106) | match |
| all 4 | Title | top | canvas 114 → app 60 | 60 (L106) | match |
| all 4 | Title | font-size | 27px | 27 (L106) | match |
| all 4 | Title | font-weight | 600 | `sans('600')` (L106) | match |
| all 4 | Title | letter-spacing | −0.2px | −0.2 (L106) | match |
| all 4 | Title | line-height | `1` → 27.000px | 27 (L106) | match |
| all 4 | Title | colour | `#1D1C1A` | `#1D1C1A` (L106) | match |
| all 4 | Title | max lines | not declared | not set | match |
| all 4 | Title | text-wrap | not declared | `'balance'` never applies (variant is `body`); web gets `'pretty'` (AppText L128) | MISMATCH (web only) |

### 1.6 Segmented control

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 4 | Track | position | absolute | absolute (L123) | match |
| all 4 | Track | left / right | 16px / 16px | 16 / 16 (L123) | match |
| all 4 | Track | top | canvas 168 → app 114 | 114 (L123) | match |
| all 4 | Track | height | 38px | 38 (L123) | match |
| all 4 | Track | width (derived) | 393 − 16 − 16 = 361.000px | device width − 32 | match |
| all 4 | Track | border-radius | 19px | 19 (L123) | match |
| all 4 | Track | background | `rgba(0,0,0,0.06)` | `rgba(0,0,0,0.06)` (L123) | match |
| all 4 | Track | display / direction | flex / row | `flexDirection:'row'` (L123) | match |
| all 4 | Track | padding | 3px all sides | `padding: 3` (L123) | match |
| all 4 | Track | box-sizing | border-box | RN border-box (implicit) | match |
| all 4 | Track | border-width | none | none | match |
| all 4 | Track | box-shadow | none | none | match |
| all 4 | Segment | flex | 1 | `flex: 1` (L136) | match |
| all 4 | Segment | width (derived) | (361 − 6) / 4 = 88.750px | same | match |
| all 4 | Segment | height (derived) | 38 − 6 = 32.000px | same | match |
| all 4 | Segment | display / align / justify | flex / center / center | `alignItems:'center', justifyContent:'center'` (L137–138) | match |
| all 4 | Segment (active) | border-radius | 16px | 16 (L139) | match |
| all 4 | Segment (active) | background | `#FFFFFF` | `'#FFFFFF'` (L140) | match |
| all 4 | Segment (active) | box-shadow | `0 1px 4px rgba(40,38,32,0.14), 0 0 0 0.5px rgba(0,0,0,0.04)` | identical string (L141) | match |
| all 4 | Segment (inactive) | background | not declared → transparent | `'transparent'` (L140) | match |
| all 4 | Segment (inactive) | box-shadow | not declared → none | `undefined` (L141) | match |
| all 4 | Segment (inactive) | border-radius | not declared | 16 applied to all (L139) — invisible while transparent | match |
| all 4 | Segment label | font-size | 14px (all four) | 14 (L143) | match |
| all 4 | Segment label (active) | font-weight | 600 | `sans('600')` (L143) | match |
| all 4 | Segment label (active) | colour | `#1D1C1A` | `#1D1C1A` (L143) | match |
| all 4 | Segment label (inactive) | font-weight | 500 | `sans('500')` (L143) | match |
| all 4 | Segment label (inactive) | colour | `#8B8882` | `#8B8882` (L143) | match |
| all 4 | Segment label | letter-spacing | not declared → 0 | dropped by AppText | match |
| all 4 | Segment labels | order | `Overview`, `Strength`, `Mood`, `Timing` | `SEGMENTS = ['Overview','Strength','Mood','Timing']` (L43) | match |
| Summary | Active segment | index | 0 (`Overview`) | `page === 0` (L125) | match |
| Overview | Active segment | index | 1 (`Strength`) | `page === 1` → `Triggers` page (L93) | match |
| Mood | Active segment | index | 2 (`Mood`) | `page === 2` → `MoodBefore` (L96) | match |
| When | Active segment | index | 3 (`Timing`) | `page === 3` → `WhenWhere` (L99) | match |
| all 4 | Segment | role / state | not expressible in CSS | `accessibilityRole="tab"`, `accessibilityState={{selected}}` (L133–134) | match (additive) |

---

## 2. Frame `Urge-Overview-Summary` (canvas 036)

### 2.1 Card

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Summary | Card | position | absolute | absolute (L253) | match |
| Summary | Card | left / right | 12px / 12px | 12 / 12 (L253) | match |
| Summary | Card | top | canvas 230 → app 176 | 176 (L253) | match |
| Summary | Card | height | 188px | 188 (L253) | match |
| Summary | Card | width (derived) | 393 − 24 = 369.000px | device width − 24 | match |
| Summary | Card | border-radius | 14px (all four corners) | 14 (L253) | match |
| Summary | Card | background | `#FFFFFF` | `'#FFFFFF'` (L253) | match |
| Summary | Card | box-shadow | `0 0 0 1px rgba(0,0,0,0.06)` | identical string (L253) | match |
| Summary | Card | border-width | 0 | 0 | match |
| Summary | Card | overflow | not declared | not declared | match |

### 2.2 Row 1 — Urges logged (canvas top 14, card-relative)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Summary | Row 1 | position | absolute (card-relative) | absolute (L241) | match |
| Summary | Row 1 | left / right | 16px / 16px | 16 / 16 (L241) | match |
| Summary | Row 1 | top | 14px (card-relative — no status-bar term) | `top={14}` (L255) | match |
| Summary | Row 1 | height | 48px | 48 (L241) | match |
| Summary | Row 1 | width (derived) | 369 − 32 = 337.000px | same | match |
| Summary | Row 1 | display / direction | flex / row | `flexDirection:'row'` (L241) | match |
| Summary | Row 1 | align-items | center | `alignItems:'center'` (L241) | match |
| Summary | Row 1 | gap | 13px | `gap: 13` (L241) | match |
| Summary | Row 1 disc | width / height | 36px / 36px | 36 / 36 (L242) | match |
| Summary | Row 1 disc | border-radius | 50% → 18.000px | 18 (L242) | match |
| Summary | Row 1 disc | background | `#F1EFE9` | `'#F1EFE9'` (L242) | match |
| Summary | Row 1 disc | display / align / justify | flex / center / center | `alignItems:'center', justifyContent:'center'` (L242) | match |
| Summary | Row 1 disc | flex-shrink | 0 | RN default 0 | match |
| Summary | Row 1 icon | svg width / height | 17 / 12 | `width={17} height={12}` (L257) | match |
| Summary | Row 1 icon | viewBox | `0 0 26 20` | `0 0 26 20` (L257) | match |
| Summary | Row 1 icon | uniform scale (derived) | `min(17/26, 12/20)` = 0.600000; rendered 15.600 × 12.000; x-offset 0.700 | same (default `xMidYMid meet`) | match |
| Summary | Row 1 icon | path `d` | `M2 13c4-8 9 3 13-3s7 2 9-2` | `M2 13c4-8 9 3 13-3s7 2 9-2` (L258) | match |
| Summary | Row 1 icon | stroke | `#131313` | `#131313` (L258) | match |
| Summary | Row 1 icon | stroke-width | 2.4 | `strokeWidth={2.4}` (L258) | match |
| Summary | Row 1 icon | fill | none | `fill="none"` (L258) | match |
| Summary | Row 1 icon | stroke-linecap | round | `strokeLinecap="round"` (L258) | match |
| Summary | Row 1 icon | stroke-linejoin | not declared → miter | not set | match |
| Summary | Row 1 label | text | `Urges logged` | `Urges logged` (L261) | match |
| Summary | Row 1 label | flex | 1 | `flex: 1` (L243) | match |
| Summary | Row 1 label | font-size | 15px | 15 (L243) | match |
| Summary | Row 1 label | font-weight | 500 | `sans('500')` (L243) | match |
| Summary | Row 1 label | colour | `#1D1C1A` | `#1D1C1A` (L243) | match |
| Summary | Row 1 label | letter-spacing / line-height | not declared | dropped by AppText | match |
| Summary | Row 1 value | text | `3 this week` | `` `${urges.length} this week` `` (L262) | match |
| Summary | Row 1 value | font-size | 13.5px | 13.5 (L244) | match |
| Summary | Row 1 value | font-weight | 600 | `sans('600')` via `strong` (L244, L263) | match |
| Summary | Row 1 value | colour | `#131313` | `'#131313'` via `strong` (L244) | match |
| Summary | Row 1 value | text-align | not declared (flex end of row) | not declared | match |

### 2.3 Divider 1

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Summary | Divider 1 | position | absolute | absolute (L265) | match |
| Summary | Divider 1 | left / right | 16px / 16px | 16 / 16 (L265) | match |
| Summary | Divider 1 | top | 62px (card-relative) | 62 (L265) | match |
| Summary | Divider 1 | height | 1px | 1 (L265) | match |
| Summary | Divider 1 | background | `rgba(0,0,0,0.06)` | `rgba(0,0,0,0.06)` (L265) | match |

### 2.4 Row 2 — Average intensity (card-relative top 70)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Summary | Row 2 | top | 70px | `top={70}` (L267) | match |
| Summary | Row 2 | left / right / height / gap | 16 / 16 / 48 / 13 | same (L241) | match |
| Summary | Row 2 disc | 36×36, r 18, `#F1EFE9` | as row 1 | same (L242) | match |
| Summary | Row 2 icon | svg width / height | 18 / 11 | `width={18} height={11}` (L269) | match |
| Summary | Row 2 icon | viewBox | `0 0 22 13` | `0 0 22 13` (L269) | match |
| Summary | Row 2 icon | uniform scale (derived) | `min(18/22, 11/13)` = 0.818182; rendered 18.000 × 10.636; y-offset 0.182 | same | match |
| Summary | Row 2 icon | track path `d` | `M2,11 A9,9 0 0 1 20,11` | identical (L270) | match |
| Summary | Row 2 icon | track stroke | `rgba(19,19,19,0.15)` | `rgba(19,19,19,0.15)` (L270) | match |
| Summary | Row 2 icon | track stroke-width | 3 | `strokeWidth={3}` (L270) | match |
| Summary | Row 2 icon | track fill / linecap | none / round | `fill="none"`, `strokeLinecap="round"` (L270) | match |
| Summary | Row 2 icon | value path `d` | `M2,11 A9,9 0 0 1 16.5,4` | identical (L271) | match |
| Summary | Row 2 icon | value stroke | `#131313` | `#131313` (L271) | match |
| Summary | Row 2 icon | value stroke-width | 3 | `strokeWidth={3}` (L271) | match |
| Summary | Row 2 icon | value fill / linecap | none / round | `fill="none"`, `strokeLinecap="round"` (L271) | match |
| Summary | Row 2 icon | paint order | track then value | track then value (L270→L271) | match |
| Summary | Row 2 label | text | `Average intensity` | `Average intensity` (L274) | match |
| Summary | Row 2 label | flex / size / weight / colour | 1 / 15px / 500 / `#1D1C1A` | same (L243) | match |
| Summary | Row 2 value | text | `Strong` | `titleCase(severityWord(avg))` → `Strong` for avg ≥ 6 (L229–234, L275) | match |
| Summary | Row 2 value | font-size | 13.5px | 13.5 (L244) | match |
| Summary | Row 2 value | font-weight | 500 | `sans('500')` (`strong` unset) (L244) | match |
| Summary | Row 2 value | colour | `#8B8882` | `'#8B8882'` (L244) | match |
| Summary | Row 2 value | empty-week form | not drawn | `'—'` when `avg == null` (L275) | match (state absent from canvas) |

### 2.5 Divider 2

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Summary | Divider 2 | top | 118px (card-relative) | 118 (L277) | match |
| Summary | Divider 2 | left / right / height / background | 16 / 16 / 1 / `rgba(0,0,0,0.06)` | same (L277) | match |

### 2.6 Row 3 — Ridden out (card-relative top 126)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Summary | Row 3 | top | 126px | `top={126}` (L279) | match |
| Summary | Row 3 | left / right / height / gap | 16 / 16 / 48 / 13 | same (L241) | match |
| Summary | Row 3 disc | 36×36, r 18, `#F1EFE9` | as row 1 | same (L242) | match |
| Summary | Row 3 icon | svg width / height | 13 / 11 | `width={13} height={11}` (L281) | match |
| Summary | Row 3 icon | viewBox | `0 0 16 13` | `0 0 16 13` (L281) | match |
| Summary | Row 3 icon | uniform scale (derived) | `min(13/16, 11/13)` = 0.812500; rendered 13.000 × 10.563; y-offset 0.219 | same | match |
| Summary | Row 3 icon | path `d` | `M1.5 7l4.4 4.5L14.5 1.5` | identical (L282) | match |
| Summary | Row 3 icon | stroke / width | `#131313` / 2.6 | `#131313` / 2.6 (L282) | match |
| Summary | Row 3 icon | fill / linecap / linejoin | none / round / round | same (L282) | match |
| Summary | Row 3 label | text | `Ridden out, start to finish` | `Ridden out, start to finish` (L285) | match |
| Summary | Row 3 label | flex / size / weight / colour | 1 / 15px / 500 / `#1D1C1A` | same (L243) | match |
| Summary | Row 3 value | text | `2 of 3` | `` `${rode} of ${urges.length}` `` (L286) | match |
| Summary | Row 3 value | font-size / weight / colour | 13.5px / 500 / `#8B8882` | same (L244) | match |
| Summary | Row 3 value | `rode` definition | 2 of 3 | `type === 'urge_rode_out'` count (L63) | match |
| Summary | Card | bottom padding (derived) | 188 − (126 + 48) = 14.000px | same | match |

### 2.7 Footnote

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Summary | Footnote | text | `Each one is a data point, not a verdict — the pages ahead break them down.` (`&mdash;`) | identical, em dash U+2014 (L290) | match |
| Summary | Footnote | position | absolute | absolute (L289) | match |
| Summary | Footnote | left / right | 24px / 24px | 24 / 24 (L289) | match |
| Summary | Footnote | top | canvas 446 → app 392 | 392 (L289) | match |
| Summary | Footnote | width (derived) | 393 − 48 = 345.000px | device width − 48 | match |
| Summary | Footnote | font-size | 14px | 14 (L289) | match |
| Summary | Footnote | font-weight | 400 | `sans('400')` (L289) | match |
| Summary | Footnote | line-height | 21px | 21 (L289) | match |
| Summary | Footnote | colour | `#55534E` | `#55534E` (L289) | match |
| Summary | Footnote | letter-spacing | not declared → 0 | dropped by AppText (explicit `fontSize`) | match |
| Summary | Footnote | text-wrap | pretty | `textWrap:'pretty'` on web (AppText L128) | match |
| Summary | Footnote | max lines | not declared | not set | match |
| Summary | Page | element count | 1 card + 3 rows + 2 dividers + 1 footnote | same set | match |
| Summary | Page | empty-week state | not drawn | rows still render (`0 this week`, `—`, `0 of 0`) | match (state absent from canvas) |

---

## 3. Frame `Urge-Overview` (canvas 037 — `Strength` pill active, "Common triggers" body)

### 3.1 Chart geometry — horizontal trigger bars

| Term | Value |
|---|---|
| Chart type | Horizontal proportional bars, one row per trigger, top-3 |
| Coordinate system | CSS flex box; **no SVG, no viewBox** |
| Row box | `left:24; right:24` → row width = 393 − 24 − 24 = **345.000px** |
| Row children | `[label 88px, gap 16px, track flex:1]` |
| **Track (plot) width** | 345 − 88 − 16 = **241.000px** |
| Plot origin | x = 24 + 88 + 16 = **128.000px** from frame left |
| Data domain | `count / max(count)` ∈ (0, 1] — normalised to the top trigger, **not** to the urge total |
| Domain → pixel | `x_px = pct × 241.000` |
| Design data points | Stress 100% → **241.000px**; Boredom 62% → **149.420px**; Tiredness 34% → **81.940px** |
| Bar height | 10px |
| Bar radius | 5px per corner (= height/2 → stadium ends) |
| Bar fill | flat solid; no gradient, no stroke, no shadow |
| Series ramp | `#131313` → `#767267` → `#CDC9BD` (index 0/1/2) |
| Axis / gridlines / ticks | **none drawn** — no axis line, no gridline, no tick, no dash array, no value label on this page |
| Row tops (canvas) | 306, 364, 422 — pitch **58.000px** |
| Row tops (app) | 252, 310, 368 — pitch **58.000px** |
| Row box height | intrinsic: `max(10px bar, 15.5px text line box)` — the text line box governs |
| Vertical alignment | `align-items:center` — bar centred against the label line box |

App equivalent: `TRIGGER_ROW_Y = [252, 310, 368]` (L39), `TRIGGER_TONES = ['#131313','#767267','#CDC9BD']` (L34), `fill={`${Math.round((count / max) * 100)}%`}` (L312), track `View {flex:1}` + bar `{width: fill, height:10, borderRadius:5}` (L180–181). **Geometry matches term for term.**

### 3.2 Rows

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Overview | Heading | text | `Common triggers` | `Common triggers` (L309) | match |
| Overview | Heading | position / left | absolute / 24px | absolute / 24 (L158) | match |
| Overview | Heading | top | canvas 244 → app 190 | `top={190}` (L309) | match |
| Overview | Heading | font-size | 20px | 20 (L158) | match |
| Overview | Heading | font-weight | 600 | `sans('600')` (L158) | match |
| Overview | Heading | letter-spacing | −0.1px | −0.1 (L158) | match |
| Overview | Heading | colour | `#1D1C1A` | `#1D1C1A` (L158) | match |
| Overview | Heading | line-height | not declared → normal | dropped by AppText (own `fontSize`, no `lineHeight`) | match |
| Overview | Bar row 1 | position / left / right | absolute / 24 / 24 | absolute / 24 / 24 (L176) | match |
| Overview | Bar row 1 | top | canvas 306 → app 252 | `TRIGGER_ROW_Y[0] = 252` (L39) | match |
| Overview | Bar row 1 | display / direction / align / gap | flex / row / center / 16px | same (L176) | match |
| Overview | Bar row 1 label | text | `Stress` | data-driven from `trigger` chip labels (L302) | match |
| Overview | Bar row 1 label | width | 88px | 88 (L177) | match |
| Overview | Bar row 1 label | flex-shrink | 0 | RN default 0 | match |
| Overview | Bar row 1 label | font-size | 15.5px | 15.5 (L177) | match |
| Overview | Bar row 1 label | font-weight | 500 | `sans('500')` (L177) | match |
| Overview | Bar row 1 label | colour | `#1D1C1A` | `#1D1C1A` (L177) | match |
| Overview | Bar row 1 label | letter-spacing / line-height | not declared | dropped by AppText | match |
| Overview | Bar row 1 label | max lines | not declared → wraps | `numberOfLines={1}` (L177) | MISMATCH |
| Overview | Bar row 1 track | flex | 1 | `flex: 1` (L180) | match |
| Overview | Bar row 1 track | width (derived) | 241.000px | same | match |
| Overview | Bar row 1 bar | width | `100%` → 241.000px | `${round(count/max*100)}%` (L312) | match |
| Overview | Bar row 1 bar | height | 10px | 10 (L181) | match |
| Overview | Bar row 1 bar | border-radius | 5px ×4 | 5 (L181) | match |
| Overview | Bar row 1 bar | background | `#131313` | `TRIGGER_TONES[0]` = `#131313` (L34) | match |
| Overview | Bar row 1 bar | border / shadow / gradient | none | none | match |
| Overview | Bar row 1 | percent column | absent | `percent` prop omitted (L312) | match |
| Overview | Bar row 2 | top | canvas 364 → app 310 | `TRIGGER_ROW_Y[1] = 310` (L39) | match |
| Overview | Bar row 2 label | text | `Boredom` | data-driven | match |
| Overview | Bar row 2 bar | width | `62%` → 149.420px | data-driven | match |
| Overview | Bar row 2 bar | background | `#767267` | `TRIGGER_TONES[1]` (L34) | match |
| Overview | Bar row 3 | top | canvas 422 → app 368 | `TRIGGER_ROW_Y[2] = 368` (L39) | match |
| Overview | Bar row 3 label | text | `Tiredness` | log chip label is `Tired` (urge-log.tsx L32) | MISMATCH |
| Overview | Bar row 3 bar | width | `34%` → 81.940px | data-driven | match |
| Overview | Bar row 3 bar | background | `#CDC9BD` | `TRIGGER_TONES[2]` (L34) | match |
| Overview | Bar rows | count | exactly 3 | `counts.slice(0, 3)` (L311) | match |
| Overview | Bar rows | source vocabulary | trigger words (Stress / Boredom / Tiredness) | `trigger` string split on `' · '` (L302); SOS flow also packs **place** and **reason** labels into the same field (`components/urge/index.tsx` L2271) | MISMATCH |
| Overview | Empty state | — | not drawn | `Empty top={252}` (L315) | match (state absent from canvas) |

### 3.3 Insight card

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Overview | Insight | position | absolute | absolute (L194) | match |
| Overview | Insight | left / right | 16px / 16px | 16 / 16 (L195–196) | match |
| Overview | Insight | top | canvas 566 → app 512 | default `top = 512` (L189) | match |
| Overview | Insight | height | 76px | 76 (L197) | match |
| Overview | Insight | width (derived) | 393 − 32 = 361.000px | device width − 32 | match |
| Overview | Insight | border-radius | 18px ×4 | 18 (L198) | match |
| Overview | Insight | background | `#FFFFFF` | `'#FFFFFF'` (L199) | match |
| Overview | Insight | box-shadow | `0 0 0 1px rgba(0,0,0,0.06), 0 10px 24px rgba(40,38,32,0.06)` | identical string (L200) | match |
| Overview | Insight | display / direction | flex / row | `flexDirection:'row'` (L201) | match |
| Overview | Insight | align-items | center | `alignItems:'center'` (L202) | match |
| Overview | Insight | gap | 12px | `gap: 12` (L203) | match |
| Overview | Insight | padding | `0 14px` | `paddingHorizontal: 14` (L204) | match |
| Overview | Insight | box-sizing | border-box | RN border-box | match |
| Overview | Insight disc | width / height | 38px / 38px | 38 / 38 (L206) | match |
| Overview | Insight disc | border-radius | 50% → 19.000px | 19 (L206) | match |
| Overview | Insight disc | background | `#131313` | `'#131313'` (L206) | match |
| Overview | Insight disc | align / justify / flex-shrink | center / center / 0 | `alignItems:'center', justifyContent:'center'`; RN default flexShrink 0 (L206) | match |
| Overview | Insight icon | svg width / height | 16 / 14 | `width={16} height={14}` (L320) | match |
| Overview | Insight icon | viewBox | `0 0 16 14` | `0 0 16 14` (L320) | match |
| Overview | Insight icon | scale (derived) | 16/16 = 1.000000, 14/14 = 1.000000 → 1:1, no offset | same | match |
| Overview | Insight icon | rect 1 | `x 1, y 6, w 3.4, h 7, rx 1.2`, fill `#FFFFFF` | identical (L321) | match |
| Overview | Insight icon | rect 2 | `x 6.3, y 3, w 3.4, h 10, rx 1.2`, fill `#FFFFFF` | identical (L322) | match |
| Overview | Insight icon | rect 3 | `x 11.6, y 0.5, w 3.4, h 12.5, rx 1.2`, fill `#FFFFFF` | identical (L323) | match |
| Overview | Insight icon | derived pitch / gap / baseline | pitch 5.300; gap 1.900; common baseline y = 13.000 | same | match |
| Overview | Insight icon | ry | not declared → equals rx (1.2) | not declared | match |
| Overview | Insight title | text | `Stress on top` | `` `${counts[0][0]} on top` `` (L326) | match |
| Overview | Insight title | font-size | 13.5px | 13.5 (L208) | match |
| Overview | Insight title | font-weight | 600 | `sans('600')` (L208) | match |
| Overview | Insight title | colour | `#1D1C1A` | `#1D1C1A` (L208) | match |
| Overview | Insight note | text | `most common` | `most common` (L327) | match |
| Overview | Insight note | margin-top | 2px | `marginTop: 2` (L209) | match |
| Overview | Insight note | font-size | 11.5px | 11.5 (L209) | match |
| Overview | Insight note | font-weight | 400 | `sans('400')` (L209) | match |
| Overview | Insight note | colour | `#8B8882` | `#8B8882` (L209) | match |
| Overview | Insight title block | flex-shrink | 0 | RN default 0 (L207) | match |
| Overview | Insight body | text | `Most land after 10 pm. The evening drill helps.` | `` `Most land ${BAND_PHRASE[band]}. The evening drill helps.` ``; `Late night → 'after 10 pm'` (L328, L491) | match |
| Overview | Insight body | flex | 1 | `flex: 1` (L211) | match |
| Overview | Insight body | padding-left | 8px | `paddingLeft: 8` (L211) | match |
| Overview | Insight body | font-size | 12.5px | 12.5 (L211) | match |
| Overview | Insight body | font-weight | 400 | `sans('400')` (L211) | match |
| Overview | Insight body | line-height | 17px | 17 (L211) | match |
| Overview | Insight body | colour | `#55534E` | `#55534E` (L211) | match |
| Overview | Insight body | max lines | not declared | not set | match |
| Overview | Insight body | no-band fallback | not drawn | `'The evening drill helps.'` (L328) | match (state absent from canvas) |

---

## 4. Frame `Urge-Overview-Mood` (canvas 038)

### 4.1 Chart geometry — mood share bars

| Term | Value |
|---|---|
| Chart type | Horizontal share bars with a right-hand value column, one row per mood, top-4 |
| Coordinate system | CSS flex box; **no SVG, no viewBox** |
| Row box | `left:24; right:24` → row width = 393 − 48 = **345.000px** |
| Row children | `[label 88px, gap 16px, track flex:1, gap 16px, value 44px]` |
| **Track (plot) width** | 345 − 88 − 44 − 16 − 16 = **181.000px** |
| Plot origin | x = 24 + 88 + 16 = **128.000px** from frame left |
| Plot right edge | 128 + 181 = **309.000px** |
| Data domain | share of urges ∈ [0, 100] — bars do **not** sum to 100 (70 + 45 + 30 + 15 = 160) |
| Domain → pixel | `x_px = pct × 1.810` (i.e. `pct/100 × 181.000`) |
| Design data points | Tense 70% → **126.700px**; Flat 45% → **81.450px**; Restless 30% → **54.300px**; Low 15% → **27.150px** |
| Bar height | 10px |
| Bar radius | 5px per corner (stadium) |
| Bar fill | flat solid; no gradient, no stroke, no shadow |
| Series ramp | `#131313` → `#767267` → `#A9A597` → `#CDC9BD` (index 0/1/2/3) |
| Axis / gridlines / ticks | **none** — the value column is the only tick format, integer + `%`, right-aligned |
| Value format | `70%`, `45%`, `30%`, `15%` — no decimals, no thousands separator |
| Row tops (canvas) | 306, 360, 414, 468 — pitch **54.000px** |
| Row tops (app) | 252, 306, 360, 414 — pitch **54.000px** |
| Vertical alignment | `align-items:center` |

App equivalent: `MOOD_ROW_Y = [252, 306, 360, 414]` (L40), `MOOD_TONES = ['#131313','#767267','#A9A597','#CDC9BD']` (L35), `share = round(count / max(1, urges.length) × 100)` (L347), rendered as both bar width and value text (L354). **Geometry matches term for term.**

### 4.2 Rows

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Mood | Heading | text | `Mood before the urge` | `Mood before the urge` (L351) | match |
| Mood | Heading | top | canvas 244 → app 190 | `top={190}` (L351) | match |
| Mood | Heading | left / size / weight / tracking / colour | 24 / 20px / 600 / −0.1px / `#1D1C1A` | same (L158) | match |
| Mood | Bar row 1 | top | canvas 306 → app 252 | `MOOD_ROW_Y[0] = 252` (L40) | match |
| Mood | Bar row 1 | left / right / gap / align | 24 / 24 / 16 / center | same (L176) | match |
| Mood | Bar row 1 label | text | `Tense` | `STATE_WORD` yields `Hungry`/`Tired`/`Lonely`/`Bored` (L337) | MISMATCH |
| Mood | Bar row 1 label | width / flex-shrink | 88px / 0 | 88 / RN default 0 (L177) | match |
| Mood | Bar row 1 label | font-size / weight / colour | 15.5px / 500 / `#1D1C1A` | same (L177) | match |
| Mood | Bar row 1 label | max lines | not declared → wraps | `numberOfLines={1}` (L177) | MISMATCH |
| Mood | Bar row 1 track | flex / derived width | 1 / 181.000px | `flex: 1` (L180) | match |
| Mood | Bar row 1 bar | width | `70%` → 126.700px | `${share(count)}%` (L354) | match |
| Mood | Bar row 1 bar | height / radius | 10px / 5px ×4 | 10 / 5 (L181) | match |
| Mood | Bar row 1 bar | background | `#131313` | `MOOD_TONES[0]` (L35) | match |
| Mood | Bar row 1 value | text | `70%` | `` `${share(count)}%` `` (L354) | match |
| Mood | Bar row 1 value | width | 44px | 44 (L183) | match |
| Mood | Bar row 1 value | flex-shrink | 0 | RN default 0 | match |
| Mood | Bar row 1 value | text-align | right | `textAlign:'right'` (L183) | match |
| Mood | Bar row 1 value | font-size | 14.5px | 14.5 (L183) | match |
| Mood | Bar row 1 value | font-weight | 500 | `sans('500')` (L183) | match |
| Mood | Bar row 1 value | colour | `#55534E` | `#55534E` (L183) | match |
| Mood | Bar row 1 value | letter-spacing / line-height | not declared | dropped by AppText | match |
| Mood | Bar row 2 | top | canvas 360 → app 306 | `MOOD_ROW_Y[1] = 306` (L40) | match |
| Mood | Bar row 2 label | text | `Flat` | see row-1 vocabulary mismatch | MISMATCH |
| Mood | Bar row 2 bar | width | `45%` → 81.450px | data-driven | match |
| Mood | Bar row 2 bar | background | `#767267` | `MOOD_TONES[1]` (L35) | match |
| Mood | Bar row 2 value | text | `45%` | data-driven | match |
| Mood | Bar row 3 | top | canvas 414 → app 360 | `MOOD_ROW_Y[2] = 360` (L40) | match |
| Mood | Bar row 3 label | text | `Restless` | see row-1 vocabulary mismatch | MISMATCH |
| Mood | Bar row 3 bar | width | `30%` → 54.300px | data-driven | match |
| Mood | Bar row 3 bar | background | `#A9A597` | `MOOD_TONES[2]` (L35) | match |
| Mood | Bar row 3 value | text | `30%` | data-driven | match |
| Mood | Bar row 4 | top | canvas 468 → app 414 | `MOOD_ROW_Y[3] = 414` (L40) | match |
| Mood | Bar row 4 label | text | `Low` | see row-1 vocabulary mismatch | MISMATCH |
| Mood | Bar row 4 bar | width | `15%` → 27.150px | data-driven | match |
| Mood | Bar row 4 bar | background | `#CDC9BD` | `MOOD_TONES[3]` (L35) | match |
| Mood | Bar row 4 value | text | `15%` | data-driven | match |
| Mood | Bar rows | count | exactly 4 | `counts.slice(0, 4)` (L353) | match |
| Mood | Bar rows | reachability | 4 bars drawn | `counts` derives from `e.precedingState` (L341–345); **no screen in the app ever writes `precedingState`** — the page always falls through to `Empty` | MISMATCH |

### 4.3 Insight card

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Mood | Insight | top | canvas 566 → app 512 | default `top = 512` (L189) | match |
| Mood | Insight | left / right / height / radius | 16 / 16 / 76 / 18 | same (L195–198) | match |
| Mood | Insight | background / box-shadow / gap / padding | `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.06), 0 10px 24px rgba(40,38,32,0.06)` / 12 / `0 14px` | identical (L199–204) | match |
| Mood | Insight disc | 38×38 / r 19 / `#131313` | as Overview | same (L206) | match |
| Mood | Insight icon | svg width / height | 18 / 11 | `width={18} height={11}` (L362) | match |
| Mood | Insight icon | viewBox | `0 0 26 16` | `0 0 26 16` (L362) | match |
| Mood | Insight icon | uniform scale (derived) | `min(18/26, 11/16)` = 0.687500; rendered 17.875 × 11.000; x-offset 0.063 | same | match |
| Mood | Insight icon | path `d` | `M2 12c4-7 8 3 12-3s8 2 10-2` | identical (L363) | match |
| Mood | Insight icon | stroke / width / fill / linecap | `#FFFFFF` / 2.4 / none / round | identical (L363) | match |
| Mood | Insight title | text | `Tense first` | `` `${counts[0][0]} first` `` (L366) — first word from `STATE_WORD` | MISMATCH (inherits §4.2 vocabulary) |
| Mood | Insight title | font-size / weight / colour | 13.5px / 600 / `#1D1C1A` | same (L208) | match |
| Mood | Insight note | text | `7 in 10 urges` | `` `${Math.round(share(counts[0][1]) / 10)} in 10 urges` `` → 70 % → `7 in 10 urges` (L367) | match |
| Mood | Insight note | margin-top / size / weight / colour | 2px / 11.5px / 400 / `#8B8882` | same (L209) | match |
| Mood | Insight body | text | `Two minutes of unclenching beats the spike.` | identical (L368) | match |
| Mood | Insight body | flex / padding-left / size / weight / line-height / colour | 1 / 8px / 12.5px / 400 / 17px / `#55534E` | same (L211) | match |
| Mood | Insight card | reachability | drawn | gated on `counts.length` (L359) — unreachable, see §4.2 | MISMATCH |

---

## 5. Frame `Urge-Overview-When` (canvas 039)

### 5.1 Chart geometry — three-band dot scale

| Term | Value |
|---|---|
| Chart type | 3-up categorical strip; each cell is a glyph + label + 3-dot ordinal scale |
| Coordinate system | CSS flex box; **no SVG, no viewBox** (glyphs are separate SVGs) |
| Strip box | `left:12; right:12` → strip width = 393 − 24 = **369.000px** |
| Strip children | `[cell flex:1, divider 1px, cell flex:1, divider 1px, cell flex:1]` |
| **Cell width (derived)** | (369 − 2) / 3 = 367 / 3 = **122.333px** |
| Cell x-origins (derived) | 12.000, 135.333, 258.667 (from frame left) |
| Divider x (derived) | 134.333, 257.667 |
| Divider | width 1px, height 56px, colour `rgba(0,0,0,0.08)`, no radius, no dash |
| Strip height | **56.000px** — set entirely by the dividers (cell content is ≈54.5px) |
| Strip vertical align | `align-items:center` → cells centred against the 56px dividers |
| Cell stack | column, `align-items:center`, `gap:8px` |
| Cell content height (derived) | 17 (glyph) + 8 + 13px-label line box + 8 + 6 (dots) ≈ **54.5px** (label line box is the only unstated term) |
| Data domain | urge count per band, ordinal, **clamped to 3** |
| Domain → mark | dot *i* filled iff `i < count`; 3 dots per cell |
| Dot | 6 × 6px, border-radius 50% → **3.000px** |
| Dot gap | 5px → dot-row width = 3×6 + 2×5 = **28.000px** |
| Dot fill (on) | `#131313` |
| Dot fill (off) | `rgba(19,19,19,0.16)` |
| Design data points | Late night 2/3, Evening 2/3, Afternoon 1/3 |
| Axis / gridlines / ticks | **none** — the dividers are separators, not axis rules; no tick labels, no dash arrays |
| Band label | 13px / 500 / `#55534E` |
| Strip top (canvas) | 294 |
| Strip top (app) | 240 |

App equivalent: strip `{left:12, right:12, top:240, flexDirection:'row', alignItems:'center'}` (L394); divider `{width:1, height:56, backgroundColor:'rgba(0,0,0,0.08)'}` (L397); cell `{flex:1, alignItems:'center', gap:8}` (L398); dots `{width:6, height:6, borderRadius:3, gap:5}` with `dot < count ? '#131313' : 'rgba(19,19,19,0.16)'` (L401–403). **Geometry matches term for term.**

**Ordering difference:** the canvas fixes the cells as Late night → Evening → Afternoon. The app orders them by count descending (`tally`, L511–515), padding absent bands from `BAND_ORDER` (L383, L488). `tally`'s sort is stable, so ties fall back to Map insertion order, which is the event order — and `useEvents` returns newest-first (`convex/events.ts` L15 `.order('desc')`). With the canvas's own 2 / 2 / 1 data the app therefore only reproduces the canvas order when the most recent urge is a Late night one.

### 5.2 Band cells

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| When | Heading 1 | text | `When they hit` | `When they hit` (L392) | match |
| When | Heading 1 | top | canvas 244 → app 190 | `top={190}` (L392) | match |
| When | Heading 1 | left / size / weight / tracking / colour | 24 / 20px / 600 / −0.1px / `#1D1C1A` | same (L158) | match |
| When | Strip | position / left / right | absolute / 12 / 12 | absolute / 12 / 12 (L394) | match |
| When | Strip | top | canvas 294 → app 240 | 240 (L394) | match |
| When | Strip | display / direction / align | flex / row / center | same (L394) | match |
| When | Strip | gap | not declared → 0 | not declared → 0 | match |
| When | Cell 1..3 | flex | 1 | `flex: 1` (L398) | match |
| When | Cell 1..3 | direction / align / gap | column / center / 8px | `alignItems:'center', gap:8` (L398) — RN default direction is column | match |
| When | Divider ×2 | width / height / colour | 1px / 56px / `rgba(0,0,0,0.08)` | 1 / 56 / `rgba(0,0,0,0.08)` (L397) | match |
| When | Divider ×2 | placement | between cells 1-2 and 2-3 | rendered before each cell where `i > 0` (L397) | match |
| When | Cell 1 glyph | svg width / height | 17 / 17 | `width={17} height={17}` (L454) | match |
| When | Cell 1 glyph | viewBox | `0 0 30 30` | `0 0 30 30` (L454) | match |
| When | Cell 1 glyph | scale (derived) | 17/30 = 0.566667 uniform, no offset | same | match |
| When | Cell 1 glyph | path `d` | `M17 3 A11 11 0 1 0 25.5 20 A8.6 8.6 0 1 1 17 3 Z` | identical (L455) | match |
| When | Cell 1 glyph | fill | `#131313` | `#131313` (L455) | match |
| When | Cell 1 glyph | stroke | not declared → none | not set | match |
| When | Cell 1 label | text | `Late night` | `Late night` from `timeBand` (hour ≥ 22 or < 5) (L481) | match |
| When | Cell 1 label | font-size | 13px | 13 (L400) | match |
| When | Cell 1 label | font-weight | 500 | `sans('500')` (L400) | match |
| When | Cell 1 label | colour | `#55534E` | `#55534E` (L400) | match |
| When | Cell 1 label | letter-spacing / line-height | not declared | dropped by AppText | match |
| When | Cell 1 dots | direction / gap | row / 5px | `flexDirection:'row', gap:5` (L401) | match |
| When | Cell 1 dots | size / radius | 6×6 / 50% → 3.000 | 6 / 6 / 3 (L403) | match |
| When | Cell 1 dots | filled count | 2 of 3 | `dot < count` (L403) | match |
| When | Cell 1 dots | on colour | `#131313` | `#131313` (L403) | match |
| When | Cell 1 dots | off colour | `rgba(19,19,19,0.16)` | `rgba(19,19,19,0.16)` (L403) | match |
| When | Cell 2 glyph | svg width / height | 19 / 17 | `width={19} height={17}` (L473) | match |
| When | Cell 2 glyph | viewBox | `0 0 20 17` | `0 0 20 17` (L473) | match |
| When | Cell 2 glyph | uniform scale (derived) | `min(19/20, 17/17)` = 0.950000; rendered 19.000 × 16.150; y-offset 0.425 | same | match |
| When | Cell 2 glyph | arc path `d` | `M5.5 11a4.5 4.5 0 0 1 9 0` | identical (L474) | match |
| When | Cell 2 glyph | arc fill / stroke / width | none / `#131313` / 2.3 | identical (L474) | match |
| When | Cell 2 glyph | arc linecap | not declared → butt | not set (L474) | match |
| When | Cell 2 glyph | rays path `d` | `M2 14h16M10 1.5v2.5M3.6 4.6l1.8 1.8M16.4 4.6l-1.8 1.8` | identical (L475) | match |
| When | Cell 2 glyph | rays stroke / width / linecap | `#131313` / 2.3 / round | identical (L475) | match |
| When | Cell 2 label | text | `Evening` | `Evening` (hour ≥ 17) (L482) | match |
| When | Cell 2 label | size / weight / colour | 13px / 500 / `#55534E` | same (L400) | match |
| When | Cell 2 dots | filled count | 2 of 3 | data-driven | match |
| When | Cell 3 glyph | svg width / height | 17 / 17 | `width={17} height={17}` (L461) | match |
| When | Cell 3 glyph | viewBox | `0 0 20 20` | `0 0 20 20` (L461) | match |
| When | Cell 3 glyph | scale (derived) | 17/20 = 0.850000 uniform, no offset | same | match |
| When | Cell 3 glyph | circle | `cx 10, cy 10, r 3.6`, fill none, stroke `#131313`, width 2.3 | identical (L462) | match |
| When | Cell 3 glyph | rays path `d` | `M10 1.5v2.6M10 15.9v2.6M1.5 10h2.6M15.9 10h2.6M3.9 3.9l1.9 1.9M14.2 14.2l1.9 1.9M16.1 3.9l-1.9 1.9M5.8 14.2l-1.9 1.9` | identical (L464) | match |
| When | Cell 3 glyph | rays stroke / width / linecap | `#131313` / 2.3 / round | identical (L465–467) | match |
| When | Cell 3 label | text | `Afternoon` | `Afternoon` (hour ≥ 12) (L483) | match |
| When | Cell 3 dots | filled count | 1 of 3 | data-driven | match |
| When | Cells | count | exactly 3 | `bands = [...seen, ...missing].slice(0, 3)` (L383) | match |
| When | Cells | order | Late night, Evening, Afternoon | count-descending, ties by newest-event order (L379, L511–515) | MISMATCH |
| When | Band glyph | 4th band (`Morning`) | not drawn (canvas has 3 bands) | falls through to the Evening sun-on-horizon glyph (L472–477) | match (state absent from canvas) |
| When | Empty state | — | not drawn | `Empty top={252}` (L411) | match (state absent from canvas) |

### 5.3 Places list

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| When | Heading 2 | text | `Where they showed up` | `Where they showed up` (L414) | match |
| When | Heading 2 | top | canvas 414 → app 360 | `top={360}` (L414) | match |
| When | Heading 2 | left / size / weight / tracking / colour | 24 / 20px / 600 / −0.1px / `#1D1C1A` | same (L158) | match |
| When | Place row 1 | position / left / right | absolute / 24 / 24 | absolute / 24 / 24 (L417) | match |
| When | Place row 1 | top | canvas 454 → app 400 | `PLACE_ROW_Y[0] = 400` (L41) | match |
| When | Place row 1 | display / direction / align | flex / row / center | same (L417) | match |
| When | Place row 1 | gap | not declared → 0 | not declared → 0 (L417) | match |
| When | Place rows | pitch | 492 − 454 = 38.000; 530 − 492 = 38.000 | 438 − 400 = 38; 476 − 438 = 38 (L41) | match |
| When | Place row 1 index | text | `1.` | `` `${i + 1}.` `` (L418) | match |
| When | Place row 1 index | width | 28px | 28 (L418) | match |
| When | Place row 1 index | font-size | 14px | 14 (L418) | match |
| When | Place row 1 index | font-weight | 500 | `sans('500')` (L418) | match |
| When | Place row 1 index | colour | `#8B8882` | `#8B8882` (L418) | match |
| When | Place row 1 label | text | `Bedroom` | data-driven (see reachability row) | match |
| When | Place row 1 label | flex | 1 | `flex: 1` (L419) | match |
| When | Place row 1 label | font-size | 15.5px | 15.5 (L419) | match |
| When | Place row 1 label | font-weight | 500 | `sans('500')` (L419) | match |
| When | Place row 1 label | colour | `#1D1C1A` | `#1D1C1A` (L419) | match |
| When | Place row 1 label | max lines | not declared → wraps | `numberOfLines={1}` (L419) | MISMATCH |
| When | Place row 1 count | text | `2` | `{count}` (L422) | match |
| When | Place row 1 count | font-size | 15px | 15 (L422) | match |
| When | Place row 1 count | font-weight | 600 | `sans('600')` (L422) | match |
| When | Place row 1 count | colour | `#1D1C1A` | `count ? '#1D1C1A' : '#8B8882'` (L422) | match |
| When | Place row 2 | top | canvas 492 → app 438 | `PLACE_ROW_Y[1] = 438` (L41) | match |
| When | Place row 2 index | text / width / size / weight / colour | `2.` / 28 / 14px / 500 / `#8B8882` | same (L418) | match |
| When | Place row 2 label | text | `Desk` | data-driven | match |
| When | Place row 2 count | text / size / weight / colour | `1` / 15px / 600 / `#1D1C1A` | same (L422) | match |
| When | Place row 3 | top | canvas 530 → app 476 | `PLACE_ROW_Y[2] = 476` (L41) | match |
| When | Place row 3 index | text / width / size / weight / colour | `3.` / 28 / 14px / 500 / `#8B8882` | same (L418) | match |
| When | Place row 3 label | text | `Bathroom` | data-driven | match |
| When | Place row 3 count | text | `0` | `tally` only ever emits counts ≥ 1 (L511–515) — a zero row cannot be produced | MISMATCH |
| When | Place row 3 count | colour (zero state) | `#8B8882` | `'#8B8882'` branch present but unreachable (L422) | MISMATCH |
| When | Place rows | count | exactly 3 | `places.slice(0, 3)` (L416) — fewer when fewer distinct places | MISMATCH |
| When | Place rows | source field | place names | `e.precedingState?.location ?? e.note` (L388); **neither field is ever written** — the SOS flow packs the place label into `trigger` instead (`components/urge/index.tsx` L2271) | MISMATCH |
| When | Empty state | — | not drawn | `Empty top={400}` (L426) | match (state absent from canvas) |

### 5.4 Insight card

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| When | Insight | top | canvas 606 → app 552 | `top={552}` (L440) | match |
| When | Insight | left / right / height / radius | 16 / 16 / 76 / 18 | same (L195–198) | match |
| When | Insight | background / box-shadow | `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.06), 0 10px 24px rgba(40,38,32,0.06)` | identical (L199–200) | match |
| When | Insight | direction / align / gap / padding | row / center / 12 / `0 14px` | same (L201–204) | match |
| When | Insight disc | 38×38 / r 19 / `#131313` / center | same | same (L206) | match |
| When | Insight icon | svg width / height | 16 / 16 | `width={16} height={16}` (L432) | match |
| When | Insight icon | viewBox | `0 0 20 20` | `0 0 20 20` (L432) | match |
| When | Insight icon | scale (derived) | 16/20 = 0.800000 uniform, no offset | same | match |
| When | Insight icon | circle | `cx 10, cy 10, r 8`, fill none, stroke `#FFFFFF`, width 1.9 | identical (L433) | match |
| When | Insight icon | hand path `d` | `M10 5.5V10l3 2` | identical (L434) | match |
| When | Insight icon | hand stroke / width / fill | `#FFFFFF` / 1.9 / none | identical (L434) | match |
| When | Insight icon | hand linecap / linejoin | round / round | identical (L434) | match |
| When | Insight title | text | `11 pm – 1 am` (`&ndash;`, spaced) | `` `${clockHour(peak)} – ${clockHour(peak + 2)}` `` (L437) — en dash, spaced | match |
| When | Insight title | window length | 2 hours | `peak` → `peak + 2` (L437) | match |
| When | Insight title | hour format | `11 pm`, `1 am` — no leading zero, lowercase meridiem, single space | `clockHour` (L505–508) | match |
| When | Insight title | font-size / weight / colour | 13.5px / 600 / `#1D1C1A` | same (L208) | match |
| When | Insight note | text | `peak window` | `peak window` (L438) | match |
| When | Insight note | margin-top / size / weight / colour | 2px / 11.5px / 400 / `#8B8882` | same (L209) | match |
| When | Insight body | text | `Lights out earlier shrinks the window.` | `BAND_ADVICE['Late night']` = identical (L439, L498) | match |
| When | Insight body | flex / padding-left / size / weight / line-height / colour | 1 / 8px / 12.5px / 400 / 17px / `#55534E` | same (L211) | match |
| When | Insight body | other-band forms | not drawn | Evening / Afternoon / Morning strings (L499–501) | match (state absent from canvas) |

---

## 6. Row count

Counted mechanically from the tables above (every 6-column data row, header and separator rows excluded).

| Section | Rows |
|---|---|
| 1.1 Frame / field | 15 |
| 1.2 Status bar (54px band) | 15 |
| 1.3 Back control | 24 |
| 1.4 Date range | 11 |
| 1.5 Page title | 11 |
| 1.6 Segmented control | 34 |
| **§1 shared chrome subtotal** | **110** |
| 2.1 Card | 10 |
| 2.2 Row 1 — Urges logged | 33 |
| 2.3 Divider 1 | 5 |
| 2.4 Row 2 — Average intensity | 22 |
| 2.5 Divider 2 | 2 |
| 2.6 Row 3 — Ridden out | 15 |
| 2.7 Footnote | 14 |
| **§2 `Urge-Overview-Summary` subtotal** | **101** |
| 3.2 Rows | 38 |
| 3.3 Insight card | 44 |
| **§3 `Urge-Overview` subtotal** | **82** |
| 4.2 Rows | 38 |
| 4.3 Insight card | 16 |
| **§4 `Urge-Overview-Mood` subtotal** | **54** |
| 5.2 Band cells | 50 |
| 5.3 Places list | 35 |
| 5.4 Insight card | 21 |
| **§5 `Urge-Overview-When` subtotal** | **106** |
| **Total** | **453** |

Chart-geometry sections carry a further 60 term rows not counted above (§3.1 = 18, §4.1 = 19, §5.1 = 23).

---

## Findings

**19 MISMATCH rows, 0 MISMATCH\* rows, across 453 comparison rows** — 434 clean. The 19 rows collapse into **11 distinct defects** (the mood vocabulary spans 5 rows, the one-line clamp 3, the places list 4). Two of them (F1, F2) make an entire canvas body unreachable at runtime.

**F1 — `Urge-Overview-Mood` never renders. Nothing in the app writes `precedingState`.**
`src/app/urge-overview.tsx` L341–345 builds the mood tally from `e.precedingState`. A repo-wide search finds exactly one read (this file) and zero writes: `urge-log.tsx` L439–444 writes `type`, `severity`, `trigger`, `whatHelped`, `createdAt`; `components/urge/index.tsx` L2272 writes `type`, `severity`, `trigger`; `lapse.tsx` L73 writes `type`, `trigger`; `relapse.tsx` L81 writes `type`. `precedingState` exists in the Convex schema (`convex/schema.ts` L66/L132) and in `convex/events.ts` L24/L39, but no caller ever supplies it.
- Current app value: `counts.length === 0` always → `Empty top={252}` (L357), "Nothing logged this week, so there is no mood pattern to read yet."
- Design value: four bars (Tense 70 %, Flat 45 %, Restless 30 %, Low 15 %) at app tops 252 / 306 / 360 / 414, plus the insight card at app top 512.

**F2 — "Where they showed up" never renders. It reads two fields nothing writes, while the place data sits in a third.**
`src/app/urge-overview.tsx` L388: `tally(urges.map((e) => e.precedingState?.location ?? e.note)…)`. Neither `precedingState.location` nor `note` is ever set on an urge event. The SOS flow does capture a place — `components/urge/index.tsx` L2271 puts `PLACES` labels (`Somewhere private`, `In bed`, `A public space`, `At work or school`, `Out and about`) into the **`trigger`** string, joined with `' · '`.
- Current app value: `places.length === 0` always → `Empty top={400}` (L426).
- Design value: three ranked rows at app tops 400 / 438 / 476 — `1. Bedroom 2`, `2. Desk 1`, `3. Bathroom 0`.
- Side effect: those place labels instead land in the **Common triggers** bars on canvas 037.

**F3 — Zero-count place row is unreachable.**
`src/app/urge-overview.tsx` L422 selects `count ? '#1D1C1A' : '#8B8882'`, and L416 slices `places` to 3. `tally` (L511–515) counts occurrences, so it can never emit `0`.
- Current app value: fewer than three rows whenever fewer than three distinct places exist; the `#8B8882` zero-count branch is dead code.
- Design value: always exactly three rows, the third being `3. Bathroom` / `0` in `#8B8882` at 15px / 600.

**F4 — Mood bar labels use HALT states, not the canvas's mood words.**
`src/app/urge-overview.tsx` L337: `STATE_WORD = { hungry: 'Hungry', tired: 'Tired', lonely: 'Lonely', bored: 'Bored' }`.
- Current app value: `Hungry` / `Tired` / `Lonely` / `Bored`.
- Design value: `Tense` / `Flat` / `Restless` / `Low` (canvas 038, rows at canvas 306 / 360 / 414 / 468). `src/components/MoodLogger.tsx` L46 already carries the canvas vocabulary (`… 'Restless', 'Flat', … 'Tense', 'Bored'`).

**F5 — Mood insight title inherits F4's vocabulary.**
`src/app/urge-overview.tsx` L366: `` `${counts[0][0]} first` ``.
- Current app value: `Hungry first` / `Tired first` / `Lonely first` / `Bored first`.
- Design value: `Tense first`.

**F6 — Trigger row 3 label reads `Tired`, not `Tiredness`.**
`src/app/urge-log.tsx` L32: `{ label: 'Tired', mark: 'tired' }`, which is what `urge-overview.tsx` L302 tallies and L312 renders.
- Current app value: `Tired`.
- Design value: `Tiredness` (canvas 037, row 3 at canvas top 422 → app 368).

**F7 — Trigger bars mix three vocabularies into one "Common triggers" list.**
`src/app/urge-overview.tsx` L302 splits `e.trigger` on `' · '`. `components/urge/index.tsx` L2271 writes place + feeling + reason labels into that same field.
- Current app value: bars can read `Somewhere private`, `At work or school`, `Work or school`, `Relationship`, `Angry`, alongside the intended `Stress` / `Boredom`.
- Design value: trigger words only — `Stress`, `Boredom`, `Tiredness`. Compounding: the 88px label column plus `numberOfLines={1}` truncates `At work or school` and `Somewhere private`.

**F8 — Band cells are ordered by count, not by the canvas's fixed day order.**
`src/app/urge-overview.tsx` L379 + `tally` L514 sort descending by count; L383 pads absent bands from `BAND_ORDER` (L488). `tally`'s sort is stable, so ties resolve to Map insertion order, and `useEvents` returns newest-first (`convex/events.ts` L15 `.order('desc')`).
- Current app value: with the canvas's own 2 / 2 / 1 data, cell order depends on which band the most recent urge fell in.
- Design value: fixed `Late night`, `Evening`, `Afternoon` left to right (canvas 039, strip at canvas top 294 → app 240).

**F9 — Bar and place labels are clamped to one line; the canvas declares no clamp.**
`src/app/urge-overview.tsx` L177 (`BarRow` label) and L419 (place label): `numberOfLines={1}`.
- Current app value: 1 line, tail-truncated inside the 88px / flex:1 column.
- Design value: no `overflow`, no `text-overflow`, no `-webkit-line-clamp` — the 88px span wraps.

**F10 — Web font stack does not carry the canvas's family list.**
`src/lib/theme.ts` L159: `SANS_WEB_STACK = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"`.
- Current app value: as above (web); `System` on iOS.
- Design value: `-apple-system, 'SF Pro Text', system-ui, 'Helvetica Neue', sans-serif`. `-apple-system` matches first on Apple platforms, so the rendered face is identical there; the two stacks diverge from the second family onward on every other web target.

**F11 — Page title gets `text-wrap: pretty` on web; the canvas declares none.**
`src/components/ui/AppText.tsx` L128 applies `textWrap:'pretty'` to every non-hero/display/title variant on web. The title at `urge-overview.tsx` L106–108 uses the default `body` variant, so it inherits `pretty`.
- Current app value: `text-wrap: pretty` (web).
- Design value: not declared on the title (canvas declares `text-wrap:pretty` only on the Summary footnote, canvas top 446 → app 392, where the app agrees).

### Verified clean

Every offset on all four frames satisfies `app top = canvas top − 54` exactly: back 64→10, date 68→14, title 114→60, segment track 168→114, summary card 230→176, summary footnote 446→392, headings 244→190 and 414→360, trigger rows 306/364/422→252/310/368, mood rows 306/360/414/468→252/306/360/414, band strip 294→240, place rows 454/492/530→400/438/476, insight cards 566→512 and 606→552. All 10 app-built SVG glyphs match verbatim (back chevron; summary wave, intensity arc pair, check; three insight glyphs; three band glyphs) — every `viewBox`, every path `d`, every stroke width, cap, join, and fill. Every colour literal matches including alpha. Both multi-shadow strings match character for character. The two bar ramps and the dot on/off pair match. All three chart geometries (§3.1, §4.1, §5.1) reproduce term for term, including the derived 241.000px trigger track, the 181.000px mood track, and the 122.333px band cell. **434 of 453 rows are clean.**
