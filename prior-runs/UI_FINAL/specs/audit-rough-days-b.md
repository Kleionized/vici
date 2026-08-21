# Property audit — Rough Days, batch B

Frames (canvas `.uifinal/pretty/final/Email Login/`, raw cross-checked in `.uifinal/final/Email Login/`):

| Frame | `data-screen-label` | Protocol / page | Art slug |
| --- | --- | --- | --- |
| Rough-Stress-II | Rough Stress II | `stress` page 2 (index 1 of 3) | `pileclock` |
| Rough-Stress-III | Rough Stress III | `stress` page 3 (index 2 of 3) | `stepout` |
| Rough-Boredom-I | Rough Boredom I | `boredom` page 1 (index 0 of 3) | `sofa` |
| Rough-Boredom-II | Rough Boredom II | `boredom` page 2 (index 1 of 3) | `shelf` |
| Rough-Late-night-I | Rough Late night I | `latenight` page 1 (index 0 of 3) | `bedphone` |
| Rough-Late-night-II | Rough Late night II | `latenight` page 2 (index 1 of 3) | `latescreen` |

App under audit: `/Users/admin/Documents/tideline/src/components/roughDays/kit.tsx` (749 lines, read in full).
Supporting files read for resolved values: `src/app/rough-protocol.tsx`, `src/content/roughDays.ts`,
`src/components/ui/AppText.tsx`, `src/components/ui/Grain.tsx`, `src/components/ui/press-scale.tsx`,
`src/lib/theme.ts`.

Raw-vs-pretty integrity check (element counts identical, so the pretty reformat lost nothing):

| Frame | div | svg | path | rect | circle |
| --- | --- | --- | --- | --- | --- |
| Rough-Stress-II | 26 | 6 | 6 | 7 | 2 |
| Rough-Stress-III | 29 | 6 | 6 | 6 | 1 |
| Rough-Boredom-I | 30 | 5 | 5 | 6 | 2 |
| Rough-Boredom-II | 31 | 5 | 5 | 6 | 1 |
| Rough-Late-night-I | 35 | 4 | 4 | 6 | 1 |
| Rough-Late-night-II | 28 | 5 | 6 | 6 | 2 |

**Coordinate convention.** Each frame is 393 × 852 and every `top` inside it includes a 54 px status
bar the app never builds. Only one design `top` in this batch is stated against the frame (the sheet,
at 52); its app-equivalent is **52 − 54 = −2**, and the app writes that as `insets.top − 2`. Every
other offset in these frames is stated against the sheet's own box or the artwork's own box, so the
app's number is the canvas number unchanged.

---

## 1. Shared chrome — identical declarations in all six frames

Audited once; every row below was verified byte-for-byte in all six pretty frames.

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| all six | Frame root | width / height | 393 × 852 | device viewport (`flex: 1`), kit.tsx:702 | match (canvas device box) |
| all six | Frame root | background | `#EDECE7` | `#EDECE7`, kit.tsx:702 | match |
| all six | Frame root | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | `sans()` → `'System'` on iOS, `SANS_WEB_STACK` on web (theme.ts:161–189) | match |
| all six | Frame root | -webkit-font-smoothing | `antialiased` | `WebkitFontSmoothing:'antialiased'` on web (AppText.tsx:127); native default | match |
| all six | Frame root | overflow | `hidden` | n/a — device screen | match |
| all six | Frame root | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | n/a — canvas device-frame shadow, never app chrome |
| all six | Status bar block | whole block | `top 0, height 54, padding 6px 32px 0 46px, z-index 20`, "9:41" 17/600/−0.2/#1D1C1A + three glyph SVGs | OS status bar, `<StatusBar style="dark" />` (rough-protocol.tsx:28) | n/a — app never builds it |
| all six | Sheet | position | `absolute` | `absolute`, kit.tsx:705 | match |
| all six | Sheet | left / right | `0` / `0` | `0` / `0`, kit.tsx:706–707 | match |
| all six | Sheet | top | canvas `52` → app-equivalent `−2` | `Math.max(0, insets.top − 2)`, kit.tsx:708 | match |
| all six | Sheet | bottom | `0` | `0`, kit.tsx:709 | match |
| all six | Sheet | border-radius | `24px 24px 0 0` | `borderTopLeftRadius 24`, `borderTopRightRadius 24`, bottom corners unset (0), kit.tsx:710–711 | match |
| all six | Sheet | background | `#F4F3F0` | `#F4F3F0`, kit.tsx:712 | match |
| all six | Sheet | overflow | `hidden` | `hidden`, kit.tsx:713 | match |
| all six | Noise layer | inset | `0` | `top/left/right/bottom: 0` (Grain.tsx:16) | match |
| all six | Noise layer | image | `url('noise-dark.png')` | `require('assets/images/noise-dark.png')`, kit.tsx:9 | match |
| all six | Noise layer | repeat / size | `repeat` / `auto` (initial) | `resizeMode="repeat"` at native size (Grain.tsx:17) | match |
| all six | Noise layer | opacity | `0.07` | `0.07`, kit.tsx:715 | match |
| all six | Noise layer | pointer-events | `none` | `pointerEvents="none"` (Grain.tsx:16) | match |
| all six | Grabber wrap | left / right / top | `0` / `0` / `12` | `0` / `0` / `12`, kit.tsx:637 | match |
| all six | Grabber wrap | main-axis align | `display:flex; justify-content:center` (row) | `alignItems:'center'` (column) | match |
| all six | Grabber | width / height | `38` × `5` | `38` × `5`, kit.tsx:638 | match |
| all six | Grabber | border-radius | `3` | `3`, kit.tsx:638 | match |
| all six | Grabber | background | `rgba(19,19,19,0.16)` | `rgba(19,19,19,0.16)`, kit.tsx:638 | match |
| all six | Close | absolute offsets | `right 22`, `top 26` | `right 22`, `top 26`, kit.tsx:649 | match |
| all six | Close | icon size / viewBox | `20 × 20` / `0 0 20 20` | `20 × 20` / `"0 0 20 20"`, kit.tsx:650 | match |
| all six | Close | path `d` | `M3 3l14 14M17 3L3 17` | `M3 3l14 14M17 3L3 17`, kit.tsx:651 | match |
| all six | Close | stroke | `#55534E` | `#55534E`, kit.tsx:651 | match |
| all six | Close | stroke-width | `2` | `2`, kit.tsx:651 | match |
| all six | Close | stroke-linecap | `round` | `round`, kit.tsx:651 | match |
| all six | Close | hit area | 20 × 20 box, `cursor:pointer` | 20 × 20 + `hitSlop 16` all sides, `minHeight: 0`, kit.tsx:648–649 | match (tap-only, paints nothing) |
| all six | Dots row | left / right / top | `0` / `0` / `66` | `0` / `0` / `66`, kit.tsx:659 | match |
| all six | Dots row | flex direction / justify / gap | `row` / `center` / `6` | `row` / `center` / `6`, kit.tsx:659 | match |
| all six | Dot (inactive) | width / height | `6.5` × `6.5` | `6.5` × `6.5`, kit.tsx:661 | match |
| all six | Dot (inactive) | border-radius | `4` | `4`, kit.tsx:661 | match |
| all six | Dot (inactive) | background | `rgba(19,19,19,0.18)` | `rgba(19,19,19,0.18)`, kit.tsx:661 | match |
| all six | Dot (active) | width / height | `20` × `6.5` | `20` × `6.5`, kit.tsx:661 | match |
| all six | Dot (active) | border-radius | `4` | `4`, kit.tsx:661 | match |
| all six | Dot (active) | background | `#131313` | `#131313`, kit.tsx:661 | match |
| all six | Headline | left / right / top | `36` / `36` / `104` | `36` / `36` / `104`, kit.tsx:719 | match |
| all six | Headline | text-align | `center` | `center` prop → `textAlign:'center'` (AppText.tsx:132) | match |
| all six | Headline | font-size | `26` | `26`, kit.tsx:719 | match |
| all six | Headline | font-weight | `500` | `sans('500')` → `fontWeight:'500'`, kit.tsx:719 | match |
| all six | Headline | letter-spacing | `−0.2` | `−0.2`, kit.tsx:719 | match |
| all six | Headline | line-height | `33` | `33`, kit.tsx:719 | match |
| all six | Headline | color | `#1D1C1A` | `#1D1C1A`, kit.tsx:719 | match |
| all six | Headline | max lines | not set | not set | match |
| all six | Sub | left / right / top | `44` / `44` / `152` | `44` / `44` / `152`, kit.tsx:722 | match |
| all six | Sub | text-align | `center` | `center` prop | match |
| all six | Sub | font-size | `14.5` | `14.5`, kit.tsx:722 | match |
| all six | Sub | font-weight | `400` | `sans('400')`, kit.tsx:722 | match |
| all six | Sub | line-height | `21` | `21`, kit.tsx:722 | match |
| all six | Sub | color | `#8B8882` | `#8B8882`, kit.tsx:722 | match |
| all six | Sub | letter-spacing | not declared → `normal` (0) | inherited `body` −0.1 deleted because the caller names `fontSize` without `letterSpacing` (AppText.tsx:120,138) → 0 | match |
| all six | Sub | text-wrap | `balance` | native: property does not exist; RN-web emits `text-wrap:pretty` for `body` (AppText.tsx:128) | **MISMATCH\*** — RN has no line-balancing; app substitutes the platform greedy breaker |
| all six | Art slot | left / top | `76` / `216` | `76` / `216`, kit.tsx:725 | match |
| all six | Art slot | width / height | `240` × `220` | `240` × `220`, kit.tsx:725 | match |
| all six | Art slot inner | inset / overflow | `inset:0` / `hidden` | `RDArtwork` root `240 × 220`, `overflow:'hidden'`, kit.tsx:121 | match |
| all six | CTA | left / right / bottom | `24` / `24` / `88` | `24` / `24` / `88`, kit.tsx:736 | match |
| all six | CTA | height | `54` | `54` (`minHeight: 54` overrides PressScale's 44), kit.tsx:736 | match |
| all six | CTA | border-radius | `27` | `27`, kit.tsx:736 | match |
| all six | CTA | background | `#131313` | `#131313`, kit.tsx:736 | match |
| all six | CTA | align / justify | `center` / `center` | `alignItems:'center'`, `justifyContent:'center'`, kit.tsx:736 | match |
| all six | CTA label | font-size | `16.5` | `16.5`, kit.tsx:737 | match |
| all six | CTA label | font-weight | `600` | `sans('600')`, kit.tsx:737 | match |
| all six | CTA label | letter-spacing | `0.2` | `0.2`, kit.tsx:737 | match |
| all six | CTA label | color | `#FFFFFF` | `#FFFFFF`, kit.tsx:737 | match |
| all six | CTA | states drawn | one (default; `cursor:pointer`) | default + press `scale 0.96 / 110 ms` (press-scale.tsx:25) | match — design draws no pressed state |
| all six | Ghost | left / right / bottom | `0` / `0` / `44` | `0` / `0` / `44`, kit.tsx:743 | match |
| all six | Ghost | text-align | `center` | `alignItems:'center'`, kit.tsx:743 | match |
| all six | Ghost | font-size | `14.5` | `14.5`, kit.tsx:744 | match |
| all six | Ghost | font-weight | `500` | `sans('500')`, kit.tsx:744 | match |
| all six | Ghost | color | `#8B8882` | `#8B8882`, kit.tsx:744 | match |
| all six | Ghost | letter-spacing | not declared → 0 | deleted per AppText.tsx:138 → 0 | match |
| all six | Ghost | states drawn | one (default; `cursor:pointer`) | default + press `scale 0.96`; `hitSlop 16/20` | match — design draws no pressed state |

### Two helper substitutions used by every artwork below

| Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- |
| `Glow` (kit.tsx:28–40) | gradient extent | `radial-gradient(closest-side, …)` on a square box → radius = ½·side | SVG `RadialGradient r="50%"` in objectBoundingBox units on a square box → radius = ½·side | match (identical for a square box) |
| `Glow` | gradient stops | stop 1 `rgba(226,186,120,α)` @ 0%, stop 2 `rgba(226,186,120,0)` @ 74% | `Stop offset 0` α, `Stop offset 0.74` α 0 | match |
| `Glow` | filter | `blur(4px)` | none | **MISMATCH\*** — RN SVG has no blur filter; the gradient falloff alone stands in for the 4 px blur |
| `Shade` (kit.tsx:44–57) | shape | `border-radius:50%` box → ellipse | `<Ellipse rx=w/2 ry=h/2>` | match |
| `Shade` | fill | solid `rgba(0,0,0,0.10)` | 3-stop radial: `#000` α 0.10 @ 0, α 0.10 @ 0.45, α 0 @ 1 | **MISMATCH\*** — part of the blur substitution below |
| `Shade` | filter | `blur(5px)` | none | **MISMATCH\*** — RN SVG has no blur filter; app substitutes the radial falloff above, which keeps the solid core to 45 % and fades to nothing at the box edge instead of spreading past it |
| `Oval`, `VGrad` | — | see per-frame rows | see per-frame rows | — |

---

## 2. Rough-Stress-II — `pileclock`, dot index 1/3

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Stress-II | Dots | active index | dot 2 of 3 wide | `index = 1`, `total = 3` (rough-protocol.tsx:22–24) | match |
| Stress-II | Headline | text | `The fast exit is a trapdoor.` | `The fast exit is a trapdoor.` (roughDays.ts:65) | match |
| Stress-II | Sub | text | `Relief that costs tomorrow isn’t relief. The pile is still there after.` | identical, `’` U+2019 (roughDays.ts:65) | match |
| Stress-II | Act line | presence | absent | `act` undefined → block not rendered (kit.tsx:728) | match |
| Stress-II | CTA label | text | `Next` | `RD_CTA[1]` = `Next` (kit.tsx:669) | match |
| Stress-II | Ghost label | text | `Back` | `RD_GHOST[1]` = `Back` (kit.tsx:670) | match |
| Stress-II | Glow | absolute offsets | `left 118`, `top 46` | `l={118} t={46}`, kit.tsx:270 | match |
| Stress-II | Glow | width / height | `104` × `104` | `size={104}` | match |
| Stress-II | Glow | colour + alpha | `rgba(226,186,120,0.3)` → `rgba(226,186,120,0)` @74% | `#E2BA78` α `0.3` → α 0 @0.74 | match |
| Stress-II | Glow | filter | `blur(4px)` | none | **MISMATCH\*** (gradient-only substitution) |
| Stress-II | Speck A | offsets / size / radius / colour | `left 216`, `top 20`, `2×2`, 50 %, `rgba(200,225,235,0.4)` | `Specks` default `a=[216,20]`, `2×2`, `borderRadius 1`, `rgba(200,225,235,0.4)` (kit.tsx:103) | match |
| Stress-II | Speck B | offsets / size / radius / colour | `left 8`, `top 48`, `2×2`, 50 %, `rgba(200,225,235,0.3)` | `b=[8,48]`, `2×2`, `borderRadius 1`, `rgba(200,225,235,0.3)` (kit.tsx:104) | match |
| Stress-II | Clock SVG | size / viewBox / offsets | `38×38`, `0 0 38 38`, `left 38`, `top 36` | `38×38`, `"0 0 38 38"`, `left 38`, `top 36`, kit.tsx:272 | match |
| Stress-II | Clock face | cx / cy / r | `19` / `19` / `17.5` | `19` / `19` / `17.5`, kit.tsx:273 | match |
| Stress-II | Clock face | fill / stroke / stroke-width | `#F7F6F2` / `#D6D5D0` / `2.5` | `#F7F6F2` / `#D6D5D0` / `2.5` | match |
| Stress-II | Clock hands | path `d` | `M19 8.55 L19 19 L26.979999999999997 22.8` | `M19 8.55 L19 19 L26.98 22.8`, kit.tsx:274 | **MISMATCH** (literal differs; Δ = 3.55e-15 px — nil render impact) |
| Stress-II | Clock hands | stroke / width / fill / linecap | `#8B8880` / `2.2` / `none` / `round` | `#8B8880` / `2.2` / `none` / `round` | match |
| Stress-II | Desk line | offsets / size / radius / fill | `left 28`, `top 158`, `184×4`, r `2`, `#D6D5D0` | `abs(28,158,184,4)`, r `2`, `#D6D5D0`, kit.tsx:276 | match |
| Stress-II | Paper 1 | offsets / size / radius / fill / transform | `left 96`, `top 146`, `76×9`, r `2`, `#E4E3DE`, `rotate(-1.5deg)` | `abs(96,146,76,9)`, r `2`, `#E4E3DE`, `rotate '-1.5deg'`, kit.tsx:277 | match |
| Stress-II | Paper 2 | offsets / size / radius / fill / transform | `left 98`, `top 136`, `72×9`, r `2`, `#D6D5D0`, `rotate(1.5deg)` | `abs(98,136,72,9)`, r `2`, `#D6D5D0`, `rotate '1.5deg'`, kit.tsx:278 | match |
| Stress-II | Paper 3 | offsets / size / radius / fill / transform | `left 95`, `top 126`, `78×9`, r `2`, `#E4E3DE`, `rotate(-1deg)` | `abs(95,126,78,9)`, r `2`, `#E4E3DE`, `rotate '-1deg'`, kit.tsx:279 | match |
| Stress-II | Paper 4 | offsets / size / radius / fill / transform | `left 99`, `top 116`, `70×9`, r `2`, `#C6C5C0`, `rotate(2deg)` | `abs(99,116,70,9)`, r `2`, `#C6C5C0`, `rotate '2deg'`, kit.tsx:280 | match |
| Stress-II | Letter SVG | size / viewBox / offsets | `44×34`, `0 0 44 34`, `left 182`, `top 76` | `44×34`, `"0 0 44 34"`, `left 182`, `top 76`, kit.tsx:281 | match |
| Stress-II | Letter group | transform | `rotate(14 22 17)` | `rotate(14 22 17)`, kit.tsx:282 | match |
| Stress-II | Letter body | x/y/w/h/rx | `4` / `4` / `36` / `26` / `2` | `4` / `4` / `36` / `26` / `2`, kit.tsx:283 | match |
| Stress-II | Letter body | fill / stroke / stroke-width | `#F7F6F2` / `#D6D5D0` / `1.5` | `#F7F6F2` / `#D6D5D0` / `1.5` | match |
| Stress-II | Letter rules | path `d` | `M10 11 h24 M10 17 h24 M10 23 h14` | identical, kit.tsx:284 | match |
| Stress-II | Letter rules | stroke / width / linecap | `#D6D5D0` / `2` / `round` | `#D6D5D0` / `2` / `round` | match |
| Stress-II | Ground shadow | offsets / size | `left 88`, `top 166`, `92×13` | `l={88} t={166} w={92} h={13}`, kit.tsx:287 | match |
| Stress-II | Ground shadow | fill + filter | `rgba(0,0,0,0.10)` + `blur(5px)` | radial `#000` α 0.10 core → 0 at edge, no blur | **MISMATCH\*** (blur substitution) |
| Stress-II | Artwork | z-order | glow → speck A → speck B → clock → desk line → papers 1–4 → letter → shadow | same sequence, kit.tsx:270–287 | match |

## 3. Rough-Stress-III — `stepout`, dot index 2/3

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Stress-III | Dots | active index | dot 3 of 3 wide | `index = 2`, `total = 3` | match |
| Stress-III | Headline | text | `Put the day down.` | `Put the day down.` (roughDays.ts:66) | match |
| Stress-III | Sub | text | `Ten minutes off duty, on purpose.` | identical | match |
| Stress-III | Act line | left / right / top | `48` / `48` / `452` | `48` / `48` / `452`, kit.tsx:729 | match |
| Stress-III | Act line | text-align | `center` | `center` prop | match |
| Stress-III | Act line | font-size | `16` | `16`, kit.tsx:729 | match |
| Stress-III | Act line | font-weight | `500` | `sans('500')`, kit.tsx:729 | match |
| Stress-III | Act line | line-height | `24` | `24`, kit.tsx:729 | match |
| Stress-III | Act line | color | `#1D1C1A` | `#1D1C1A`, kit.tsx:729 | match |
| Stress-III | Act line | letter-spacing | not declared → 0 | dropped per AppText.tsx:138 → 0 | match |
| Stress-III | Act line | text-wrap | `balance` | native: unsupported; web `pretty` | **MISMATCH\*** (same substitution as the sub) |
| Stress-III | Act line | text | `Step outside and walk one lap — no phone in your pocket.` | identical, `—` U+2014 (roughDays.ts:66) | match |
| Stress-III | CTA label | text | `Done` | `RD_CTA[2]` = `Done` | match |
| Stress-III | Ghost label | text | `Back` | `RD_GHOST[2]` = `Back` | match |
| Stress-III | Glow | offsets / size | `left 96`, `top 52`, `112×112` | `l={96} t={52} size={112}`, kit.tsx:293 | match |
| Stress-III | Glow | colour + alpha | `rgba(226,186,120,0.36)` → 0 @74 % | `#E2BA78` α `0.36` → 0 @0.74 | match |
| Stress-III | Glow | filter | `blur(4px)` | none | **MISMATCH\*** |
| Stress-III | Specks | offsets / colours | `216,20` α 0.4 · `8,48` α 0.3 | defaults, kit.tsx:294 | match |
| Stress-III | Floor line | offsets / size / radius / fill | `left 26`, `top 160`, `190×4`, r `2`, `#D6D5D0` | `abs(26,160,190,4)`, r `2`, `#D6D5D0`, kit.tsx:295 | match |
| Stress-III | Door frame | offsets / size / radius / fill | `left 80`, `top 52`, `84×112`, r `6`, `#D6D5D0` | `abs(80,52,84,112)`, r `6`, `#D6D5D0`, kit.tsx:296 | match |
| Stress-III | Door leaf | offsets / size / radius / fill | `left 86`, `top 58`, `58×100`, r `4`, `#E4E3DE` | `abs(86,58,58,100)`, r `4`, `#E4E3DE`, kit.tsx:297 | match |
| Stress-III | Door leaf | transform / origin | `rotate(-9deg)` / `left bottom` | `rotate '-9deg'` / `transformOrigin:'left bottom'`, kit.tsx:297 | match |
| Stress-III | Door knob | offsets / size / radius / fill / transform | `left 124`, `top 106`, `6×6`, 50 %, `#8B8880`, `rotate(-9deg)` | `abs(124,106,6,6)`, `borderRadius 3`, `#8B8880`, `rotate '-9deg'`, kit.tsx:298 | match |
| Stress-III | Light wedge SVG | size / viewBox / offsets | `52×102`, `0 0 52 102`, `left 140`, `top 58` | `52×102`, `"0 0 52 102"`, `left 140`, `top 58`, kit.tsx:299 | match |
| Stress-III | Light wedge | path `d` | `M2 0 L50 30 L50 102 L2 100 Z` | identical, kit.tsx:300 | match |
| Stress-III | Light wedge | fill | `rgba(226,186,120,0.30)` | `rgba(226,186,120,0.30)` | match |
| Stress-III | Shoe L | offsets / size / radius per corner / fill | `left 180`, `top 156`, `20×9`, `5 / 7 / 2 / 2`, `#B4B1AB` | `abs(180,156,20,9)`, TL 5 · TR 7 · BR 2 · BL 2, `#B4B1AB`, kit.tsx:302 | match |
| Stress-III | Shoe R | offsets / size / radius per corner / fill | `left 203`, `top 154`, `20×9`, `5 / 7 / 2 / 2`, `#C6C5C0` | `abs(203,154,20,9)`, TL 5 · TR 7 · BR 2 · BL 2, `#C6C5C0`, kit.tsx:303 | match |
| Stress-III | Plant stem | offsets / size / radius / fill | `left 44`, `top 64`, `3×30`, r `2`, `#C6C5C0` | `abs(44,64,3,30)`, r `2`, `#C6C5C0`, kit.tsx:304 | match |
| Stress-III | Plant leaf SVG | size / viewBox / offsets | `22×30`, `0 0 22 30`, `left 38`, `top 88` | `22×30`, `"0 0 22 30"`, `left 38`, `top 88`, kit.tsx:305 | match |
| Stress-III | Plant leaf | path `d` / fill | `M11 0 C2 6 2 26 11 28 C18 26 20 8 11 0 Z` / `#C6C5C0` | identical / `#C6C5C0`, kit.tsx:306 | match |
| Stress-III | Ground shadow | offsets / size | `left 76`, `top 172`, `100×13` | `l={76} t={172} w={100} h={13}`, kit.tsx:308 | match |
| Stress-III | Ground shadow | fill + filter | `rgba(0,0,0,0.10)` + `blur(5px)` | radial falloff, no blur | **MISMATCH\*** |
| Stress-III | Artwork | z-order | glow → specks → floor → frame → leaf → knob → wedge → shoe L → shoe R → stem → plant → shadow | same sequence, kit.tsx:293–308 | match |

## 4. Rough-Boredom-I — `sofa`, dot index 0/3

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Boredom-I | Dots | active index | dot 1 of 3 wide | `index = 0`, `total = 3` | match |
| Boredom-I | Headline | text | `Nothing to do.` | `Nothing to do.` (roughDays.ts:72) | match |
| Boredom-I | Sub | text | `An empty hour is the oldest trigger there is.` | identical | match |
| Boredom-I | Act line | presence | absent | not rendered | match |
| Boredom-I | CTA label | text | `Walk through it` | `RD_CTA[0]` = `Walk through it` | match |
| Boredom-I | Ghost label | text | `Not tonight` | `RD_GHOST[0]` = `Not tonight` | match |
| Boredom-I | Glow | offsets / size | `left 120`, `top 30`, `104×104` | `l={120} t={30} size={104}`, kit.tsx:314 | match |
| Boredom-I | Glow | colour + alpha | `rgba(226,186,120,0.3)` → 0 @74 % | `#E2BA78` α `0.3` → 0 @0.74 | match |
| Boredom-I | Glow | filter | `blur(4px)` | none | **MISMATCH\*** |
| Boredom-I | Clock SVG | size / viewBox / offsets | `34×34`, `0 0 34 34`, `left 34`, `top 34` | `34×34`, `"0 0 34 34"`, `left 34`, `top 34`, kit.tsx:315 | match |
| Boredom-I | Clock face | cx / cy / r / fill / stroke / width | `17` / `17` / `15.5` / `#F7F6F2` / `#D6D5D0` / `2.5` | identical, kit.tsx:316 | match |
| Boredom-I | Clock hands | path `d` | `M17 7.65 L17 17 L24.14 20.4` | `M17 7.65 L17 17 L24.14 20.4`, kit.tsx:317 | match |
| Boredom-I | Clock hands | stroke / width / fill / linecap | `#8B8880` / `2.2` / `none` / `round` | identical | match |
| Boredom-I | Specks | offsets / colours | `216,20` α 0.4 · `8,48` α 0.3 | defaults, kit.tsx:319 | match |
| Boredom-I | Sofa back | offsets / size / radius per corner / fill | `left 48`, `top 110`, `140×32`, `10 / 10 / 4 / 4`, `#C6C5C0` | `abs(48,110,140,32)`, TL 10 · TR 10 · BR 4 · BL 4, `#C6C5C0`, kit.tsx:320 | match |
| Boredom-I | Cushion L | offsets / size / radius / fill | `left 54`, `top 134`, `62×22`, r `6`, `#D6D5D0` | `abs(54,134,62,22)`, r `6`, `#D6D5D0`, kit.tsx:321 | match |
| Boredom-I | Cushion R | offsets / size / radius / fill | `left 120`, `top 134`, `62×22`, r `6`, `#D6D5D0` | `abs(120,134,62,22)`, r `6`, `#D6D5D0`, kit.tsx:322 | match |
| Boredom-I | Arm L | offsets / size / radius / fill | `left 38`, `top 120`, `14×40`, r `7`, `#C6C5C0` | `abs(38,120,14,40)`, r `7`, `#C6C5C0`, kit.tsx:323 | match |
| Boredom-I | Arm R | offsets / size / radius / fill | `left 184`, `top 120`, `14×40`, r `7`, `#C6C5C0` | `abs(184,120,14,40)`, r `7`, `#C6C5C0`, kit.tsx:324 | match |
| Boredom-I | Leg L | offsets / size / radius / fill | `left 52`, `top 160`, `6×12`, none, `#B4B1AB` | `abs(52,160,6,12)`, no radius, `#B4B1AB`, kit.tsx:325 | match |
| Boredom-I | Leg R | offsets / size / radius / fill | `left 178`, `top 160`, `6×12`, none, `#B4B1AB` | `abs(178,160,6,12)`, no radius, `#B4B1AB`, kit.tsx:326 | match |
| Boredom-I | Remote | offsets / size / radius / fill | `left 88`, `top 126`, `22×8`, r `3`, `#8B8880` | `abs(88,126,22,8)`, r `3`, `#8B8880`, kit.tsx:327 | match |
| Boredom-I | Side panel | offsets / size / radius / fill | `left 204`, `top 52`, `26×52`, r `5`, `#E4E3DE` | `abs(204,52,26,52)`, r `5`, `#E4E3DE`, kit.tsx:328 | match |
| Boredom-I | Ground shadow | offsets / size | `left 40`, `top 178`, `160×13` | `l={40} t={178} w={160} h={13}`, kit.tsx:329 | match |
| Boredom-I | Ground shadow | fill + filter | `rgba(0,0,0,0.10)` + `blur(5px)` | radial falloff, no blur | **MISMATCH\*** |
| Boredom-I | Artwork | z-order | glow → clock → specks → back → cushions → arms → legs → remote → panel → shadow | same sequence, kit.tsx:314–329 | match |

## 5. Rough-Boredom-II — `shelf`, dot index 1/3

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Boredom-II | Dots | active index | dot 2 of 3 wide | `index = 1`, `total = 3` | match |
| Boredom-II | Headline | text | `The itch is for anything.` | identical (roughDays.ts:73) | match |
| Boredom-II | Sub | text | `Boredom doesn’t want the screen — it wants motion, any motion.` | identical, `’` U+2019 + `—` U+2014 | match |
| Boredom-II | Act line | presence | absent | not rendered | match |
| Boredom-II | CTA label | text | `Next` | `RD_CTA[1]` = `Next` | match |
| Boredom-II | Ghost label | text | `Back` | `RD_GHOST[1]` = `Back` | match |
| Boredom-II | Glow | offsets / size | `left 64`, `top 44`, `116×116` | `l={64} t={44} size={116}`, kit.tsx:335 | match |
| Boredom-II | Glow | colour + alpha | `rgba(226,186,120,0.3)` → 0 @74 % | `#E2BA78` α `0.3` → 0 @0.74 | match |
| Boredom-II | Glow | filter | `blur(4px)` | none | **MISMATCH\*** |
| Boredom-II | Specks | offsets / colours | `216,20` α 0.4 · `8,48` α 0.3 | defaults, kit.tsx:336 | match |
| Boredom-II | Shelf top | offsets / size / radius / fill | `left 56`, `top 88`, `128×5`, r `2`, `#C6C5C0` | `abs(56,88,128,5)`, r `2`, `#C6C5C0`, kit.tsx:337 | match |
| Boredom-II | Shelf bottom | offsets / size / radius / fill | `left 56`, `top 148`, `128×5`, r `2`, `#C6C5C0` | `abs(56,148,128,5)`, r `2`, `#C6C5C0`, kit.tsx:338 | match |
| Boredom-II | Book 1 | offsets / size / radius / fill | `left 64`, `top 54`, `11×34`, r `2`, `#D6D5D0` | `abs(64,54,11,34)`, r `2`, `#D6D5D0`, kit.tsx:339 | match |
| Boredom-II | Book 2 | offsets / size / radius / fill | `left 78`, `top 48`, `13×40`, r `2`, `#B4B1AB` | `abs(78,48,13,40)`, r `2`, `#B4B1AB`, kit.tsx:340 | match |
| Boredom-II | Book 3 | offsets / size / radius / fill | `left 94`, `top 58`, `10×30`, r `2`, `#E4E3DE` | `abs(94,58,10,30)`, r `2`, `#E4E3DE`, kit.tsx:341 | match |
| Boredom-II | Book 4 | offsets / size / radius / fill | `left 107`, `top 50`, `12×38`, r `2`, `#C6C5C0` | `abs(107,50,12,38)`, r `2`, `#C6C5C0`, kit.tsx:342 | match |
| Boredom-II | Book 5 (leaning) | offsets / size / radius / fill | `left 126`, `top 52`, `11×40`, r `2`, `#D6D5D0` | `abs(126,52,11,40)`, r `2`, `#D6D5D0`, kit.tsx:343 | match |
| Boredom-II | Book 5 (leaning) | transform / origin | `rotate(-16deg)` / `left bottom` | `rotate '-16deg'` / `transformOrigin:'left bottom'` | match |
| Boredom-II | Pot | offsets / size / radius per corner / fill | `left 150`, `top 112`, `20×16`, `3 / 3 / 5 / 5`, `#B4B1AB` | `abs(150,112,20,16)`, TL 3 · TR 3 · BR 5 · BL 5, `#B4B1AB`, kit.tsx:344 | match |
| Boredom-II | Plant SVG | size / viewBox / offsets | `28×20`, `0 0 28 20`, `left 146`, `top 94` | `28×20`, `"0 0 28 20"`, `left 146`, `top 94`, kit.tsx:345 | match |
| Boredom-II | Plant | path `d` | `M14 18 C6 14 4 4 10 2 C14 8 14 12 14 18 C14 12 14 8 18 2 C24 4 22 14 14 18 Z` | identical, kit.tsx:346 | match |
| Boredom-II | Plant | fill | `#C6C5C0` | `#C6C5C0` | match |
| Boredom-II | Box L | offsets / size / radius / fill | `left 66`, `top 112`, `34×36`, r `3`, `#E4E3DE` | `abs(66,112,34,36)`, r `3`, `#E4E3DE`, kit.tsx:348 | match |
| Boredom-II | Box R | offsets / size / radius / fill | `left 104`, `top 118`, `30×30`, r `3`, `#D6D5D0` | `abs(104,118,30,30)`, r `3`, `#D6D5D0`, kit.tsx:349 | match |
| Boredom-II | Ground shadow | offsets / size | `left 58`, `top 162`, `130×13` | `l={58} t={162} w={130} h={13}`, kit.tsx:350 | match |
| Boredom-II | Ground shadow | fill + filter | `rgba(0,0,0,0.10)` + `blur(5px)` | radial falloff, no blur | **MISMATCH\*** |
| Boredom-II | Artwork | z-order | glow → specks → shelves → books 1–5 → pot → plant → box L → box R → shadow | same sequence, kit.tsx:335–350 | match |

## 6. Rough-Late-night-I — `bedphone`, dot index 0/3

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Late-night-I | Dots | active index | dot 1 of 3 wide | `index = 0`, `total = 3` | match |
| Late-night-I | Headline | text | `Past your window.` | identical (roughDays.ts:80) | match |
| Late-night-I | Sub | text | `After eleven, the odds tilt — willpower goes to sleep before you do.` | identical, `—` U+2014 | match |
| Late-night-I | Act line | presence | absent | not rendered | match |
| Late-night-I | CTA label | text | `Walk through it` | `RD_CTA[0]` | match |
| Late-night-I | Ghost label | text | `Not tonight` | `RD_GHOST[0]` | match |
| Late-night-I | Glow | offsets / size | `left 44`, `top 36`, `110×110` | `l={44} t={36} size={110}`, kit.tsx:373 | match |
| Late-night-I | Glow | colour + alpha | `rgba(226,186,120,0.38)` → 0 @74 % | `#E2BA78` α `0.38` → 0 @0.74 | match |
| Late-night-I | Glow | filter | `blur(4px)` | none | **MISMATCH\*** |
| Late-night-I | Moon (back disc) | offsets / size / radius / fill | `left 26`, `top 12`, `32×32`, 50 %, `#DCDED8` | `Moon l=18 t=6 size=32` → `abs(26,12,32,32)`, `borderRadius 16`, `#DCDED8`, kit.tsx:113 | match |
| Late-night-I | Moon (front disc) | offsets / size / radius / fill | `left 18`, `top 6`, `32×32`, 50 %, `#F4F3F0` | `abs(18,6,32,32)`, `borderRadius 16`, `#F4F3F0`, kit.tsx:114 | match |
| Late-night-I | Specks | offsets / colours | `216,20` α 0.4 · `8,48` α 0.3 | defaults, kit.tsx:375 | match |
| Late-night-I | Headboard | offsets / size / radius / fill | `left 36`, `top 104`, `11×60`, r `5`, `#C6C5C0` | `abs(36,104,11,60)`, r `5`, `#C6C5C0`, kit.tsx:376 | match |
| Late-night-I | Mattress | offsets / size / radius / fill | `left 44`, `top 126`, `112×28`, r `8`, `#E0DFDA` | `abs(44,126,112,28)`, r `8`, `#E0DFDA`, kit.tsx:377 | match |
| Late-night-I | Pillow | offsets / size / radius / fill | `left 50`, `top 117`, `36×14`, r `7`, `#C6C5C0` | `abs(50,117,36,14)`, r `7`, `#C6C5C0`, kit.tsx:378 | match |
| Late-night-I | Duvet | offsets / size / radius / fill | `left 52`, `top 134`, `98×8`, r `4`, `#D6D5D0` | `abs(52,134,98,8)`, r `4`, `#D6D5D0`, kit.tsx:379 | match |
| Late-night-I | Bed leg L | offsets / size / radius / fill | `left 44`, `top 154`, `6×18`, none, `#B4B1AB` | `abs(44,154,6,18)`, no radius, `#B4B1AB`, kit.tsx:380 | match |
| Late-night-I | Bed leg R | offsets / size / radius / fill | `left 146`, `top 154`, `6×18`, none, `#B4B1AB` | `abs(146,154,6,18)`, no radius, `#B4B1AB`, kit.tsx:381 | match |
| Late-night-I | Nightstand | offsets / size / radius / fill | `left 170`, `top 132`, `38×28`, r `4`, `#D6D5D0` | `abs(170,132,38,28)`, r `4`, `#D6D5D0`, kit.tsx:382 | match |
| Late-night-I | Phone | offsets / size / radius / fill | `left 176`, `top 118`, `26×13`, r `3`, `#55534E` | `abs(176,118,26,13)`, r `3`, `#55534E`, kit.tsx:383 | match |
| Late-night-I | Screen dot 1 | offsets / size / radius / fill | `left 181`, `top 122`, `3×3`, 50 %, `#E2BA78` | `abs(181,122,3,3)`, `borderRadius 1.5`, `#E2BA78`, kit.tsx:384 | match |
| Late-night-I | Screen dot 2 | offsets / size / radius / fill | `left 187`, `top 122`, `3×3`, 50 %, `#E2BA78` | `abs(187,122,3,3)`, `borderRadius 1.5`, `#E2BA78`, kit.tsx:385 | match |
| Late-night-I | Screen dot 3 | offsets / size / radius / fill | `left 193`, `top 122`, `3×3`, 50 %, `#E2BA78` | `abs(193,122,3,3)`, `borderRadius 1.5`, `#E2BA78`, kit.tsx:386 | match |
| Late-night-I | Bed shadow | offsets / size | `left 40`, `top 176`, `120×13` | `l={40} t={176} w={120} h={13}`, kit.tsx:387 | match |
| Late-night-I | Bed shadow | fill + filter | `rgba(0,0,0,0.10)` + `blur(5px)` | radial falloff, no blur | **MISMATCH\*** |
| Late-night-I | Stand shadow | offsets / size | `left 166`, `top 166`, `48×13` | `l={166} t={166} w={48} h={13}`, kit.tsx:388 | match |
| Late-night-I | Stand shadow | fill + filter | `rgba(0,0,0,0.10)` + `blur(5px)` | radial falloff, no blur | **MISMATCH\*** |
| Late-night-I | Artwork | z-order | glow → moon back → moon front → specks → headboard → mattress → pillow → duvet → legs → nightstand → phone → dots → bed shadow → stand shadow | same sequence, kit.tsx:373–388 | match |

## 7. Rough-Late-night-II — `latescreen`, dot index 1/3

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Late-night-II | Dots | active index | dot 2 of 3 wide | `index = 1`, `total = 3` | match |
| Late-night-II | Headline | text | `Nothing good is on.` | identical (roughDays.ts:81) | match |
| Late-night-II | Sub | text | `The last hour awake is the weakest hour of the day.` | identical | match |
| Late-night-II | Act line | presence | absent | not rendered | match |
| Late-night-II | CTA label | text | `Next` | `RD_CTA[1]` | match |
| Late-night-II | Ghost label | text | `Back` | `RD_GHOST[1]` | match |
| Late-night-II | Glow | offsets / size | `left 84`, `top 58`, `120×120` | `l={84} t={58} size={120}`, kit.tsx:394 | match |
| Late-night-II | Glow | colour + alpha | `rgba(226,186,120,0.42)` → 0 @74 % | `#E2BA78` α `0.42` → 0 @0.74 | match |
| Late-night-II | Glow | filter | `blur(4px)` | none | **MISMATCH\*** |
| Late-night-II | Moon (back disc) | offsets / size / radius / fill | `left 200`, `top 14`, `24×24`, 50 %, `#DCDED8` | `Moon l=192 t=8 size=24` → `abs(200,14,24,24)`, `borderRadius 12`, `#DCDED8` | match |
| Late-night-II | Moon (front disc) | offsets / size / radius / fill | `left 192`, `top 8`, `24×24`, 50 %, `#F4F3F0` | `abs(192,8,24,24)`, `borderRadius 12`, `#F4F3F0` | match |
| Late-night-II | Specks | offsets / colours | `216,20` α 0.4 · `8,48` α 0.3 | defaults, kit.tsx:396 | match |
| Late-night-II | Table line | offsets / size / radius / fill | `left 48`, `top 150`, `150×4`, r `2`, `#D6D5D0` | `abs(48,150,150,4)`, r `2`, `#D6D5D0`, kit.tsx:397 | match |
| Late-night-II | Phone body | offsets / size / radius / fill | `left 104`, `top 82`, `42×68`, r `8`, `#C6C5C0` | `abs(104,82,42,68)`, r `8`, `#C6C5C0`, kit.tsx:398 | match |
| Late-night-II | Phone screen | offsets / size / radius | `left 109`, `top 88`, `32×56`, r `5` | `VGrad l=109 t=88 w=32 h=56 r=5`, kit.tsx:399 | match |
| Late-night-II | Phone screen | gradient angle | `linear-gradient(180deg, …)` (top → bottom) | `x1 0 y1 0 → x2 0 y2 1` (top → bottom), kit.tsx:75 | match |
| Late-night-II | Phone screen | gradient stops | `#FCFBF7` @0, `#EDE9DC` @100 % | `Stop 0 #FCFBF7`, `Stop 1 #EDE9DC`, kit.tsx:399 | match |
| Late-night-II | Alarm SVG | size / viewBox / offsets | `30×30`, `0 0 30 30`, `left 58`, `top 96` | `30×30`, `"0 0 30 30"`, `left 58`, `top 96`, kit.tsx:400 | match |
| Late-night-II | Alarm face | cx / cy / r / fill / stroke / width | `15` / `17` / `11` / `#F7F6F2` / `#D6D5D0` / `2.5` | identical, kit.tsx:401 | match |
| Late-night-II | Alarm hands | path `d` / stroke / width / fill / linecap | `M15 11 L15 17 L20 20` / `#8B8880` / `2` / `none` / `round` | identical, kit.tsx:402 | match |
| Late-night-II | Alarm bells | path `d` / stroke / width / linecap | `M6 8 L10 4 M24 8 L20 4` / `#B4B1AB` / `2.5` / `round` | identical, kit.tsx:403 | match |
| Late-night-II | Glass | offsets / size / radius per corner | `left 160`, `top 122`, `18×28`, `3 / 3 / 4 / 4` | `abs(160,122,18,28)`, TL 3 · TR 3 · BR 4 · BL 4, kit.tsx:405 | match |
| Late-night-II | Glass | fill | `#F7F6F2` | `#F7F6F2` | match |
| Late-night-II | Glass | inner rim | `box-shadow: inset 0 0 0 1.2px rgba(0,0,0,0.08)` | `borderWidth 1.2`, `borderColor 'rgba(0,0,0,0.08)'`, kit.tsx:405 | match — same 1.2 band inside the same box, same inner radius (r − 1.2) |
| Late-night-II | Water | offsets / size / radius per corner / fill | `left 162`, `top 134`, `14×14`, `0 / 0 / 3 / 3`, `#D9E2E8` | `abs(162,134,14,14)`, TL 0 · TR 0 · BR 3 · BL 3, `#D9E2E8`, kit.tsx:406 | match |
| Late-night-II | Ground shadow | offsets / size | `left 96`, `top 160`, `64×13` | `l={96} t={160} w={64} h={13}`, kit.tsx:407 | match |
| Late-night-II | Ground shadow | fill + filter | `rgba(0,0,0,0.10)` + `blur(5px)` | radial falloff, no blur | **MISMATCH\*** |
| Late-night-II | Artwork | z-order | glow → moon back → moon front → specks → table → phone body → screen → alarm → glass → water → shadow | same sequence, kit.tsx:394–407 | match |

---

## Findings

**1 real MISMATCH. 15 MISMATCH\* instances (RN cannot express the CSS), carried on 18 rows —
15 per-frame rows plus 3 rows in the shared-helper table above.**

### MISMATCH

1. **`src/components/roughDays/kit.tsx:274` — `pileclock` clock-hand path literal.**
   Current: `d="M19 8.55 L19 19 L26.98 22.8"`. Design (Rough-Stress-II, pretty line 217 / raw
   verified): `d="M19 8.55 L19 19 L26.979999999999997 22.8"`. The two differ as doubles by
   3.552713678800501e-15, i.e. the rendered endpoint moves by ~3.6e-15 px. Reported because the
   token is not the design literal; the visual impact is nil.

### MISMATCH\* — RN cannot express the CSS; the app substitutes

2. **Sub line, all six frames — `kit.tsx:722`.** Design declares `text-wrap: balance`. RN has no
   line-balancing property, so on native the app gets the platform's greedy line breaker; on RN-web
   `AppText` emits `text-wrap: pretty` for the `body` variant (`AppText.tsx:128`). Substitution:
   greedy/pretty breaking instead of balanced.
3. **Act line, Rough-Stress-III — `kit.tsx:729`.** Same `text-wrap: balance` gap as above.
4–9. **Glow `filter: blur(4px)`, one per frame** — `kit.tsx:270` (Stress-II), `:293` (Stress-III),
   `:314` (Boredom-I), `:335` (Boredom-II), `:373` (Late-night-I), `:394` (Late-night-II).
   `react-native-svg` has no blur filter primitive. Substitution: the `Glow` helper
   (`kit.tsx:28–40`) draws the bare `radial-gradient(closest-side, …, transparent 74%)` with no
   extra softening. Geometry and both stops are exact; only the 4 px blur is missing.
10–16. **Ground-shadow `filter: blur(5px)` + solid fill, eight shadows across the six frames** —
   `kit.tsx:287` (Stress-II), `:308` (Stress-III), `:329` (Boredom-I), `:350` (Boredom-II),
   `:387` and `:388` (Late-night-I), `:407` (Late-night-II). Design draws a solid
   `rgba(0,0,0,0.10)` ellipse and blurs it 5 px. Substitution: the `Shade` helper
   (`kit.tsx:44–57`) draws a three-stop radial — α 0.10 held to 45 % of the radius, then a linear
   fade to 0 at the box edge — so the softness lives inside the design's box instead of spreading
   past it.

### Row count behind the verdict

**256 audit rows** written across the six frames: **234 match**, **18 MISMATCH\***, **1 MISMATCH**,
**2 n/a** (the canvas device-frame drop shadow and the 54 px status bar, neither of which the app
builds), **1 pointer row** (`Oval`/`VGrad`, resolved in the per-frame rows).

The 234 matching rows cover: sheet offset, per-corner radius, fill and clipping; the grain layer
(source, tiling, opacity, hit-testing); the grabber; the close icon down to its verbatim path `d`,
stroke, width and cap; the three-dot pager including which dot is wide on each of the six frames;
headline / sub / act / CTA / ghost geometry, size, numeric weight, leading, tracking, colour and
verbatim copy including the U+2019 and U+2014 glyphs; the CTA pill and both drawn button states;
and all **83 artwork primitives** (11 in `pileclock`, 13 in `stepout`, 14 in `sofa`, 15 in `shelf`,
18 in `bedphone`, 12 in `latescreen`) — absolute offsets, sizes, per-corner radii, transforms with
their origins, fills with alpha, the one linear-gradient's angle and both stops, SVG sizes,
viewBoxes and verbatim path `d` strings, stroke colours, widths and caps — plus the paint order of
all six drawings, which is element-for-element the canvas's own.
