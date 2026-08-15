# Property audit — Launch & Auth

Frames audited (7): **Splash**, **Standing-Guard**, **Login-Empty**, **Login-Typing**,
**Create-Account**, **Auth-Save-Progress**, **Reminders-Setup**.

Design source (read in full, every declaration):
- `/Users/admin/Documents/tideline/.uifinal/pretty/final/Email Login/{Splash,Standing-Guard,Login-Empty,Login-Typing,Create-Account,Auth-Save-Progress,Reminders-Setup}.html`
- Raw counterparts under `.uifinal/final/Email Login/` were re-read for verbatim copy,
  non-ASCII characters, gradient/blur/z-index counts (all consistent with the pretty files).

App source (read in full):
- `/Users/admin/Documents/tideline/src/app/index.tsx`
- `/Users/admin/Documents/tideline/src/app/(auth)/splash.tsx`
- `/Users/admin/Documents/tideline/src/app/(auth)/sign-in.tsx`
- `/Users/admin/Documents/tideline/src/app/(auth)/sign-up.tsx`
- `/Users/admin/Documents/tideline/src/app/reminders.tsx`
- `/Users/admin/Documents/tideline/src/components/ui/Waterline.tsx`
- `/Users/admin/Documents/tideline/src/components/auth/kit.tsx`
- Supporting, read to resolve every token to a literal:
  `src/lib/theme.ts`, `src/components/ui/AppText.tsx`, `src/components/ui/Grain.tsx`,
  `src/components/ui/press-scale.tsx`, `src/components/ui/marks.tsx` (`BackGlyph`).

## Conventions used in every table

- **Frame** is 393 × 852. Every design `top` includes the 54px status-bar band the app never
  builds, so design tops are written `744 (app 690)` — the parenthesised number is
  `canvas top − 54`, the value an app element measured from the safe-area origin should carry.
- Two screens are **full-bleed** and deliberately keep the 54 band, because the OS status bar is
  drawn over them rather than beside them: Splash and Standing-Guard. There the app maps the
  canvas y straight onto the device screen (as fractions of 852), so no −54 is applied and none
  is quoted.
- Token values are resolved to their literals before comparison:
  `colors.bg #F4F3F0`, `colors.surface #FFFFFF`, `colors.ink #131313`, `colors.text #1D1C1A`,
  `colors.textTitle #2A2924`, `colors.textMuted #55534E`, `colors.textSoft #8B8882`,
  `spacing.xl 24`, `spacing.lg 16`.
- `sans('N')` resolves to `{ fontFamily: 'System', fontWeight: 'N' }` on iOS —
  the same face as the canvas `-apple-system, 'SF Pro Text', system-ui`.
- `AppText` drops its variant `lineHeight` and `letterSpacing` whenever the caller names its own
  `fontSize` and stays silent about them (AppText.tsx:117-139). So "canvas declares no
  line-height / no tracking" maps to "app renders the natural line box and zero tracking" — the
  two agree. This is stated once here rather than repeated per row.
- **Out of scope, noted once:** the 54px status-bar row (time + three glyphs) and the 139 × 5
  home-indicator pill on Splash/Standing-Guard are drawn by the canvas as device chrome; iOS
  draws both. The app only chooses the bar's tint, and does so correctly on every frame
  (`StatusBar style="light"` on Splash/Waterline where the canvas glyphs are `#F4F3F0`;
  `style="dark"` on the four paper boards where they are `#1D1C1A`). The canvas dims the Splash
  bar (`rgba(255,255,255,0.4)` time, `opacity .92` glyphs) — iOS has no such control.
- **Derived positions.** Create-Account and Auth-Save-Progress are laid out in the app as a flow
  (margin chain inside a padded ScrollView), not absolutely. Their "current app value" is the
  position that chain produces; the arithmetic is shown so the number is checkable. Two line-box
  constants are assumed for the derivation: a 22px System face gives a 26.0 line box and a 15px
  face gives an 18.0 line box.

---

## 1 · Splash

Design: `Splash.html`. App: `src/components/ui/Waterline.tsx` `SplashScene()` (lines 67-105),
mounted by `src/app/index.tsx:40` and `src/app/(auth)/splash.tsx:29`.

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Splash | Root frame | width × height | 393 × 852 | `flex: 1` — device screen, SVG `viewBox="0 0 393 852"` + `preserveAspectRatio="none"` (Waterline.tsx:70-75) | match |
| Splash | Root frame | overflow | `hidden` | `overflow: 'hidden'` (Waterline.tsx:69) | match |
| Splash | Root frame | background | `linear-gradient(180deg, #131313 0%, #1D1C1A 55%, #2E2C29 100%)` | `LinearGradient x1=0 y1=0 x2=0 y2=1`; stops `0 #131313`, `0.55 #1D1C1A`, `1 #2E2C29` (Waterline.tsx:77-81) | match |
| Splash | Root frame | gradient angle | 180deg (top→bottom) | x1/y1 → x2/y2 = (0,0)→(0,1), top→bottom (Waterline.tsx:77) | match |
| Splash | Root frame | fallback fill | — | `backgroundColor: '#131313'` (Waterline.tsx:69) | match (same as stop 0) |
| Splash | Root frame | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | match (mock's device chrome, not screen content) |
| Splash | Root frame | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | `sans()` → `System` (theme.ts:162-170) | match |
| Splash | Decor layer | inset | `0` | SVG `position:absolute; top/left/right/bottom 0` (Waterline.tsx:75) | match |
| Splash | Decor layer | pointer-events | `none` | SVG, no touch handlers | match |
| Splash | Wash A | left / top | -30 / -120 | `left={-30} top={-120}` → `Ellipse cx=210 cy=0` (Waterline.tsx:84, 55) | match |
| Splash | Wash A | width × height | 480 × 240 | `rx=240 ry=120` (Waterline.tsx:55, 84) | match |
| Splash | Wash A | border-radius | 50% | `Ellipse` | match |
| Splash | Wash A | gradient type | `radial-gradient(closest-side, …)` | `RadialGradient cx=50% cy=50% rx=50% ry=50%` sized to the box | match |
| Splash | Wash A | stop 0 | `rgba(120,115,105,0.20)` | `#787369` @ `0.2` (Waterline.tsx:84, 50) | match |
| Splash | Wash A | stop end | `rgba(120,115,105,0)` @ 72% | `#787369` @ `0` at offset `0.72` (Waterline.tsx:52) | match |
| Splash | Wash A | intermediate stops | none (linear ramp; 0.100 at 36%) | inserted stop at `0.36` @ `0.2 × 0.42 = 0.084` (Waterline.tsx:51) | MISMATCH* |
| Splash | Wash A | filter | `blur(7px)` | none — RN SVG has no filter primitive | MISMATCH* |
| Splash | Wash B | left / top | 120 / 290 | `left={120} top={290}` → `cx=235 cy=405` (Waterline.tsx:85) | match |
| Splash | Wash B | width × height | 230 × 230 | `rx=115 ry=115` | match |
| Splash | Wash B | stop 0 | `rgba(120,140,150,0.10)` | `#788C96` @ `0.1` (Waterline.tsx:85) | match |
| Splash | Wash B | stop end | `rgba(120,140,150,0)` @ 70% | `#788C96` @ `0` at `0.70` | match |
| Splash | Wash B | intermediate stops | none (0.050 at 35%) | stop at `0.35` @ `0.042` | MISMATCH* |
| Splash | Wash B | filter | `blur(6px)` | none | MISMATCH* |
| Splash | Wash C | left / top | 118 / 395 | `left={118} top={395}` → `cx=178 cy=470` (Waterline.tsx:86) | match |
| Splash | Wash C | width × height | 120 × 150 | `rx=60 ry=75` | match |
| Splash | Wash C | stop 0 | `rgba(226,190,140,0.16)` | `#E2BE8C` @ `0.16` (Waterline.tsx:86) | match |
| Splash | Wash C | stop end | `rgba(226,190,140,0)` @ 72% | `#E2BE8C` @ `0` at `0.72` | match |
| Splash | Wash C | intermediate stops | none (0.080 at 36%) | stop at `0.36` @ `0.0672` | MISMATCH* |
| Splash | Wash C | filter | `blur(5px)` | none | MISMATCH* |
| Splash | Wash D | left / top | -60 / 620 | `left={-60} top={620}` → `cx=150 cy=750` (Waterline.tsx:87) | match |
| Splash | Wash D | width × height | 420 × 260 | `rx=210 ry=130` | match |
| Splash | Wash D | stop 0 | `rgba(120,115,105,0.14)` | `#787369` @ `0.14` (Waterline.tsx:87) | match |
| Splash | Wash D | stop end | `rgba(120,115,105,0)` @ 72% | `#787369` @ `0` at `0.72` | match |
| Splash | Wash D | intermediate stops | none (0.070 at 36%) | stop at `0.36` @ `0.0588` | MISMATCH* |
| Splash | Wash D | filter | `blur(8px)` | none | MISMATCH* |
| Splash | Star 1 | centre / radius | left 96, top 140, 2 × 2, radius 50% → centre (97,141) r 1 | `Circle cx=97 cy=141 r=1` (Waterline.tsx:88, 61) | match |
| Splash | Star 1 | fill | `rgba(160,155,145,0.22)` | `#A09B91` fillOpacity `0.22` | match |
| Splash | Star 2 | centre | (291, 206) | `cx=291 cy=206` (Waterline.tsx:89) | match |
| Splash | Star 2 | fill | `rgba(160,155,145,0.18)` | `#A09B91` @ `0.18` | match |
| Splash | Star 3 | centre | (201, 591) | `cx=201 cy=591` (Waterline.tsx:90) | match |
| Splash | Star 3 | fill | `rgba(160,155,145,0.15)` | `#A09B91` @ `0.15` | match |
| Splash | Star 4 | centre | (331, 701) | `cx=331 cy=701` (Waterline.tsx:91) | match |
| Splash | Star 4 | fill | `rgba(160,155,145,0.14)` | `#A09B91` @ `0.14` | match |
| Splash | Laurel mark | left / top | 160 / 400 | `left: '40.7%'` = 159.951, `top: '46.9%'` = 399.588 on 393 × 852 (Waterline.tsx:99) | match (−0.049 / −0.412 px) |
| Splash | Laurel mark | width × height | 72 × 72 | `width: 72, height: 72` | match |
| Splash | Laurel mark | opacity | 0.9 | `opacity: 0.9` | match |
| Splash | Laurel mark | filter | `brightness(0) invert(1)` (white silhouette) | `tintColor="#FFFFFF"` (Waterline.tsx:97) | match |
| Splash | Laurel mark | fit | intrinsic 72 × 72 | `contentFit="contain"` | match |
| Splash | Laurel mark | source | `laurel-mark.webp` (asset not shipped in the bundle) | `assets/images/laurel-mark.webp` (Waterline.tsx:23) | match (byte comparison impossible — the design bundle ships no image files) |
| Splash | Laurel mark | z-order | after washes A–C, **before** wash D + the 4 stars | after all 4 washes and all 4 stars (Waterline.tsx:92-100) | match (order differs, geometry never overlaps: wash D spans y 620-880, stars sit at y 140/205/590/700, the mark occupies x 160-232 × y 400-472) |
| Splash | Noise | inset | `0` | absolute `0,0,0,0` wrapper (Grain.tsx:16) | match |
| Splash | Noise | image | `url('noise-dark.png')`, no `background-size` → tiles at 96 × 96 | `resizeMode="repeat"` on RN `Image`, `assets/images/noise-dark.png` (Grain.tsx:17, Waterline.tsx:102) | match |
| Splash | Noise | opacity | 0.10 | `opacity={0.1}` (Waterline.tsx:102) | match |
| Splash | Noise | z-order | last child of the decor layer (over the mark) | last child of the scene (over the mark) | match |
| Splash | Status bar | all properties | 54 tall; time 17px/600/`rgba(255,255,255,0.4)`/-0.2px; 3 glyph SVGs `#F4F3F0` @ .92, gap 7 | not built — OS chrome; app sets `StatusBar style="light"` (index.tsx:39, splash.tsx:28) | match (out of scope; canvas's 0.4/0.92 dimming is not expressible on iOS) |
| Splash | Home indicator | 139 × 5, left 127, top 839, radius 100, `#131313`, z 30 | not built — OS chrome | match (out of scope) |
| Splash | — | hold duration | (static frame) | 900 ms, then Standing-Guard (index.tsx:27, splash.tsx:18) | match (frame cannot express timing) |

---

## 2 · Standing-Guard

Design: `Standing-Guard.html`. App: `Waterline.tsx` `WaterlineScene()` (lines 111-174).

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Standing-Guard | Root frame | background | `linear-gradient(180deg, #131313 0%, #1D1C1A 55%, #2E2C29 100%)` | stops `0 #131313`, `0.55 #1D1C1A`, `1 #2E2C29`, vertical (Waterline.tsx:127-131) | match |
| Standing-Guard | Root frame | overflow | `hidden` | `overflow: 'hidden'` (Waterline.tsx:119) | match |
| Standing-Guard | Wash A | left / top | -40 / -140 | `left={-40} top={-140}` → `cx=230 cy=-5` (Waterline.tsx:134) | match |
| Standing-Guard | Wash A | width × height | 540 × 270 | `rx=270 ry=135` | match |
| Standing-Guard | Wash A | stop 0 | `rgba(180,170,150,0.34)` | `#B4AA96` @ `0.34` | match |
| Standing-Guard | Wash A | stop end | `rgba(19,19,19,0)` @ 72% | `#B4AA96` @ `0` at `0.72` | match (CSS interpolates gradients in premultiplied alpha, so a transparent `#131313` and a transparent `#B4AA96` produce identical pixels; the app's choice also avoids a grey halo under RN SVG) |
| Standing-Guard | Wash A | intermediate stops | none (0.170 at 36%) | stop at `0.36` @ `0.1428` | MISMATCH* |
| Standing-Guard | Wash A | filter | `blur(6px)` | none | MISMATCH* |
| Standing-Guard | Wash B | left / top | 230 / -110 | `left={230} top={-110}` → `cx=395 cy=-5` (Waterline.tsx:135) | match |
| Standing-Guard | Wash B | width × height | 330 × 210 | `rx=165 ry=105` | match |
| Standing-Guard | Wash B | stop 0 | `rgba(180,170,150,0.26)` | `#B4AA96` @ `0.26` | match |
| Standing-Guard | Wash B | stop end | `rgba(19,19,19,0)` @ 70% | `#B4AA96` @ `0` at `0.70` | match (premultiplied-equivalent, as above) |
| Standing-Guard | Wash B | intermediate stops | none (0.130 at 35%) | stop at `0.35` @ `0.1092` | MISMATCH* |
| Standing-Guard | Wash B | filter | `blur(8px)` | none | MISMATCH* |
| Standing-Guard | Wash C | left / top | -40 / 610 | `left={-40} top={610}` → `cx=195 cy=760` (Waterline.tsx:136) | match |
| Standing-Guard | Wash C | width × height | 470 × 300 | `rx=235 ry=150` | match |
| Standing-Guard | Wash C | stop 0 | `rgba(120,115,105,0.30)` | `#787369` @ `0.3` | match |
| Standing-Guard | Wash C | stop end | `rgba(120,115,105,0)` @ 72% | `#787369` @ `0` at `0.72` | match |
| Standing-Guard | Wash C | intermediate stops | none (0.150 at 36%) | stop at `0.36` @ `0.126` | MISMATCH* |
| Standing-Guard | Wash C | filter | `blur(6px)` | none | MISMATCH* |
| Standing-Guard | Wash D | left / top | 170 / 690 | `left={170} top={690}` → `cx=335 cy=805` (Waterline.tsx:137) | match |
| Standing-Guard | Wash D | width × height | 330 × 230 | `rx=165 ry=115` | match |
| Standing-Guard | Wash D | stop 0 | `rgba(120,115,105,0.22)` | `#787369` @ `0.22` | match |
| Standing-Guard | Wash D | stop end | `rgba(120,115,105,0)` @ 70% | `#787369` @ `0` at `0.70` | match |
| Standing-Guard | Wash D | intermediate stops | none (0.110 at 35%) | stop at `0.35` @ `0.0924` | MISMATCH* |
| Standing-Guard | Wash D | filter | `blur(8px)` | none | MISMATCH* |
| Standing-Guard | Star 1 | centre / fill | (97, 416) / `rgba(160,155,145,0.28)` | `cx=97 cy=416`, `#A09B91` @ `0.28` (Waterline.tsx:138) | match |
| Standing-Guard | Star 2 | centre / fill | (289, 373) / `rgba(160,155,145,0.2)` | `cx=289 cy=373`, `#A09B91` @ `0.2` (Waterline.tsx:139) | match |
| Standing-Guard | Star 3 | centre / fill | (187, 541) / `rgba(160,155,145,0.16)` | `cx=187 cy=541`, `#A09B91` @ `0.16` (Waterline.tsx:140) | match |
| Standing-Guard | Noise layer | presence | **absent** (unlike Splash) | absent — no `Grain` in `WaterlineScene` | match |
| Standing-Guard | Status row | left / right / top | 0 / 0 / 770 | `left:0, right:0, top:'90.4%'` = 770.208 on 852 (Waterline.tsx:146-149) | match (+0.208 px) |
| Standing-Guard | Status row | display / align / justify | `flex` / `center` / `center` | `flexDirection:'row', alignItems:'center', justifyContent:'center'` (Waterline.tsx:150-153) | match |
| Standing-Guard | Status row | gap | 13 | `gap: 13` (Waterline.tsx:153) | match |
| Standing-Guard | Ring | size / viewBox | 36 × 36 / `0 0 36 36` | `width={36} height={36} viewBox="0 0 36 36"` (Waterline.tsx:156) | match |
| Standing-Guard | Ring | cx / cy / r | 18 / 18 / 15 | `cx={18} cy={18} r={15}` (Waterline.tsx:158-160) | match |
| Standing-Guard | Ring | fill | `none` | `fill="none"` | match |
| Standing-Guard | Ring | stroke | `#131313` | `stroke="#131313"` (Waterline.tsx:162) | match (faithful port of a near-invisible ink stroke on an ink field) |
| Standing-Guard | Ring | stroke-width | 3.5 | `strokeWidth={3.5}` | match |
| Standing-Guard | Ring | stroke-linecap | `round` | `strokeLinecap="round"` | match |
| Standing-Guard | Ring | stroke-dasharray | `82 13` | `strokeDasharray="82 13"` | match |
| Standing-Guard | Ring | transform | `rotate(-70 18 18)` | `transform="rotate(-70 18 18)"` (Waterline.tsx:166) | match |
| Standing-Guard | Ring | animation | none declared (static frame) | `withRepeat(withTiming(1, 1100ms, Easing.linear), -1)` → 360°/1.1 s (Waterline.tsx:113-116) | match (pose at t=0 is identical; a static frame cannot express motion) |
| Standing-Guard | Label | text | `Finding the waterline...` (three U+002E, not U+2026) | `'Finding the waterline...'` — three U+002E (Waterline.tsx:111) | match |
| Standing-Guard | Label | font-size | 17.5px | `fontSize: 17.5` (Waterline.tsx:170) | match |
| Standing-Guard | Label | font-weight | 400 | `sans('400')` | match |
| Standing-Guard | Label | letter-spacing | 0.2px | `letterSpacing: 0.2` | match |
| Standing-Guard | Label | colour | `rgba(244,243,240,0.8)` | `'rgba(244,243,240,0.8)'` | match |
| Standing-Guard | Label | line-height | not declared → normal | not declared → AppText drops the variant leading (AppText.tsx:139) | match |
| Standing-Guard | Status bar | all properties | 54 tall; time 17/600/**`#F4F3F0`** (undimmed here)/-0.2; glyphs `#F4F3F0`, **no group opacity**, gap 7 | not built; `StatusBar style="light"` | match (out of scope) |
| Standing-Guard | Home indicator | 139 × 5, left 127, top 839, `#131313` | not built | match (out of scope) |

---

## 3 · Login-Empty

Design: `Login-Empty.html`. App: `src/app/(auth)/sign-in.tsx` `mode === 'email'`, `typing === false`
(lines 88-223), plus `src/components/auth/kit.tsx` (`PaperAuthGlow`, `EnvelopeMark`, `AppleMark`, `GoogleMark`).

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Login-Empty | Root | background | `#F4F3F0` | `colors.bg` = `#F4F3F0` (sign-in.tsx:90) | match |
| Login-Empty | Root | overflow | `hidden` | screen root, no scroller in this mode | match |
| Login-Empty | Glow layer | inset / overflow / pointer-events | `0` / `hidden` / `none` | `position:'absolute', inset:0, overflow:'hidden', pointerEvents="none"` (kit.tsx:110) | match |
| Login-Empty | Glow layer | z-order | above the frame, below all content | rendered before `SafeAreaView` (sign-in.tsx:92-93) | match |
| Login-Empty | Glow layer | coordinate origin | frame top (includes the 54 band) | screen top — `PaperAuthGlow` sits outside `SafeAreaView` | match |
| Login-Empty | Top wash | left / width | `-15%` = -58.95 / `130%` = 510.9 → centre x 196.5, rx 255.45 | `cx="50%"`, `rx="65%"` = 255.45 on a 393 viewport (kit.tsx:129) | match |
| Login-Empty | Top wash | top / height | -190 / 300 → centre y -40, ry 150 | `cy={-40} ry={150}` (kit.tsx:129) | match |
| Login-Empty | Top wash | border-radius | 50% | `Ellipse` | match |
| Login-Empty | Top wash | stop 0 | `rgba(180,170,150,0.4)` | `#B4AA96` @ `0.4` (kit.tsx:117) | match |
| Login-Empty | Top wash | stop 55% | `rgba(180,170,150,0.12)` | `#B4AA96` @ `0.12` at `55%` (kit.tsx:118) | match |
| Login-Empty | Top wash | stop 75% | `rgba(180,170,150,0)` | `#B4AA96` @ `0` at `75%` (kit.tsx:119) | match |
| Login-Empty | Top wash | filter | `blur(5px)` | none | MISMATCH* |
| Login-Empty | Bottom wash | left / top | -60 / 620 → centre (150, 750) | `cx={150} cy={750}` (kit.tsx:130) | match |
| Login-Empty | Bottom wash | width × height | 420 × 260 → rx 210, ry 130 | `rx={210} ry={130}` | match |
| Login-Empty | Bottom wash | stop 0 | `rgba(180,170,150,0.22)` | `#B4AA96` @ `0.22` (kit.tsx:122) | match |
| Login-Empty | Bottom wash | stop 72% | `rgba(180,170,150,0)` | `#B4AA96` @ `0` at `72%` (kit.tsx:123) | match |
| Login-Empty | Bottom wash | filter | `blur(8px)` | none | MISMATCH* |
| Login-Empty | Envelope block | left / top | `50%` with `margin-left:-100` → x 96.5 / top 150 (app 96) | full-width row, `alignItems:'center'`, 200-wide child → x 96.5; `top: 96` (sign-in.tsx:96) | match |
| Login-Empty | Envelope block | width × height | 200 × 170 | `width:200, height:170` (kit.tsx:52) | match |
| Login-Empty | Env. glow | left / top / size | 30 / 0 / 140 × 140 | `left:30, top:0`, `Svg 140 × 140`, `Circle cx=70 cy=70 r=70` (kit.tsx:56, 63) | match |
| Login-Empty | Env. glow | stop 0 | `rgba(226,186,120,0.4)` | `#E2BA78` @ `0.4` (kit.tsx:59) | match |
| Login-Empty | Env. glow | stop 74% | `rgba(226,186,120,0)` | `#E2BA78` @ `0` at `74%` (kit.tsx:60) | match |
| Login-Empty | Env. glow | filter | `blur(4px)` | none | MISMATCH* |
| Login-Empty | Ground shadow | left / top / size | 40 / 152 / 120 × 12, radius 50% | `left:40, top:152`, `Ellipse cx=60 cy=6 rx=60 ry=6` (kit.tsx:69, 76) | match |
| Login-Empty | Ground shadow | fill | flat `rgba(0,0,0,0.10)`, then `blur(4px)` | radial `#000` `0.14` → `#000` `0` (kit.tsx:72-74) | MISMATCH* |
| Login-Empty | Rotated tile | left / top / size | 64 / 40 / 72 × 72 | `left:64, top:40, width:72, height:72` (kit.tsx:80) | match |
| Login-Empty | Rotated tile | border-radius | 10 | `borderRadius: 10` | match |
| Login-Empty | Rotated tile | background | `#E3E1DA` | `'#E3E1DA'` | match |
| Login-Empty | Rotated tile | transform | `rotate(45deg)` | `[{ rotate: '45deg' }]` | match |
| Login-Empty | Letter | left / top / size | 44 / 22 / 112 × 84 | `left:44, top:22, width:112, height:84` (kit.tsx:83) | match |
| Login-Empty | Letter | border-radius / background | 6 / `#FFFFFF` | `borderRadius:6`, `'#FFFFFF'` | match |
| Login-Empty | Letter | box-shadow | `0 0 0 1px rgba(0,0,0,0.06)` | `boxShadow: '0 0 0 1px rgba(0,0,0,0.06)'` | match |
| Login-Empty | Rule 1 | left/top/size/radius/fill | 58 / 38 / 52 × 5 / 3 / `#E0DFDA` | identical (kit.tsx:84) | match |
| Login-Empty | Rule 2 | left/top/size/radius/fill | 58 / 51 / 70 × 5 / 3 / `#E0DFDA` | identical (kit.tsx:85) | match |
| Login-Empty | Rule 3 | left/top/size/radius/fill | 58 / 64 / 44 × 5 / 3 / `#E0DFDA` | identical (kit.tsx:86) | match |
| Login-Empty | Signature | size / viewBox / left / top | 40 × 10 / `0 0 40 10` / 102 / 76 | identical (kit.tsx:87) | match |
| Login-Empty | Signature | path `d` | `M2 6 C 10 2, 18 8, 26 5 S 36 4, 38 6` | byte-identical (kit.tsx:88) | match |
| Login-Empty | Signature | stroke / width / cap / fill | `rgba(38,38,31,0.4)` / 1.5 / `round` / `none` | identical (kit.tsx:88) | match |
| Login-Empty | Signature | visibility | drawn **before** the envelope front, which covers x 25-175 × y 76-154 → fully hidden | same paint order → also fully hidden (kit.tsx:87 then 92) | match |
| Login-Empty | Envelope front | left/top/size | 25 / 76 / 150 × 78 | identical (kit.tsx:92) | match |
| Login-Empty | Envelope front | radius / background / shadow | 8 / `#E9E7E0` / `0 0 0 1px rgba(0,0,0,0.05)` | identical | match |
| Login-Empty | Fold 1 | left/top/size/radius/fill | 28 / 78 / 80 × 4 / 2 / `#DBD9D2` | identical (kit.tsx:93) | match |
| Login-Empty | Fold 1 | transform / origin | `rotate(26deg)` / `left center` | `[{rotate:'26deg'}]`, `transformOrigin:'left center'` | match |
| Login-Empty | Fold 2 | left/top/size/radius/fill | 92 / 114 / 80 × 4 / 2 / `#DBD9D2` | identical (kit.tsx:94) | match |
| Login-Empty | Fold 2 | transform / origin | `rotate(-26deg)` / `left center` | identical | match |
| Login-Empty | Seal | left/top/size/radius/fill | 89 / 106 / 22 × 22 / 50% / `#E9D2A4` | `borderRadius: 11` on 22 × 22, `'#E9D2A4'` (kit.tsx:95) | match |
| Login-Empty | Seal inner | left/top/size/radius | 95 / 112 / 10 × 10 / 50% | `borderRadius: 5` on 10 × 10 (kit.tsx:96) | match |
| Login-Empty | Seal inner | box-shadow | `inset 0 0 0 1.5px rgba(122,103,67,0.45)` | `'inset 0 0 0 1.5px rgba(122,103,67,0.45)'` | match |
| Login-Empty | Envelope mark | child paint order | glow, shadow, tile, letter, 3 rules, signature, front, fold 1, fold 2, seal, seal inner | identical order (kit.tsx:56-96) | match |
| Login-Empty | "Welcome back." | left / top | 24 / 380 (app 326) | `left:24, top:326` (sign-in.tsx:150) | match |
| Login-Empty | "Welcome back." | font-size / weight | 27 / 600 | `fontSize:27`, `sans('600')` | match |
| Login-Empty | "Welcome back." | letter-spacing | -0.2px | `letterSpacing: -0.2` | match |
| Login-Empty | "Welcome back." | colour | `#1D1C1A` | `colors.text` = `#1D1C1A` | match |
| Login-Empty | "Welcome back." | text | `Welcome back.` | `Welcome back.` | match |
| Login-Empty | Sub-line | left / top | 24 / 420 (app 366) | `left:24, top:366` (sign-in.tsx:151) | match |
| Login-Empty | Sub-line | font-size / weight / colour | 14.5 / 400 / `#8B8882` | `14.5`, `sans('400')`, `colors.textSoft` = `#8B8882` | match |
| Login-Empty | Sub-line | text | `Sign in to keep the run going.` | identical | match |
| Login-Empty | Apple pill | left / right / top | 24 / 24 / 472 (app 418) | `left:24, right:24, top:418` (sign-in.tsx:157) | match |
| Login-Empty | Apple pill | height / radius | 54 / 27 | `height:54, borderRadius:27` | match |
| Login-Empty | Apple pill | background | `#131313` | `colors.ink` = `#131313` | match |
| Login-Empty | Apple pill | display / align / justify / gap | flex / center / center / 9 | `row` / `center` / `center` / `9` | match |
| Login-Empty | Apple pill | border / shadow | none | none | match |
| Login-Empty | Apple glyph | size / viewBox | 15 × 18 / `0 0 384 512` | `width={15} height={18} viewBox="0 0 384 512"` (kit.tsx:22) | match |
| Login-Empty | Apple glyph | path `d` | `M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.9-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z` | byte-identical (kit.tsx:25) | match |
| Login-Empty | Apple glyph | fill | `#FFFFFF` | `color="#FFFFFF"` (sign-in.tsx:158) | match |
| Login-Empty | Apple label | size / weight / colour / text | 16 / 600 / `#FFFFFF` / `Continue with Apple` | identical (sign-in.tsx:159) | match |
| Login-Empty | Google pill | left / right / top | 24 / 24 / 538 (app 484) | `left:24, right:24, top:484` (sign-in.tsx:166) | match |
| Login-Empty | Google pill | height / radius / background | 54 / 27 / `#FFFFFF` | `54` / `27` / `colors.surface` | match |
| Login-Empty | Google pill | box-shadow | `0 0 0 1px rgba(0,0,0,0.12)` | `'0 0 0 1px rgba(0,0,0,0.12)'` | match |
| Login-Empty | Google pill | gap | 10 | `gap: 10` | match |
| Login-Empty | Google glyph | size / viewBox | 17 × 17 / `0 0 48 48` | identical (kit.tsx:31) | match |
| Login-Empty | Google glyph | path 1 fill / `d` | `#EA4335` / `M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z` | byte-identical (kit.tsx:33-34) | match |
| Login-Empty | Google glyph | path 2 fill / `d` | `#4285F4` / `M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z` | byte-identical (kit.tsx:36) | match |
| Login-Empty | Google glyph | path 3 fill / `d` | `#FBBC05` / `M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z` | byte-identical (kit.tsx:37) | match |
| Login-Empty | Google glyph | path 4 fill / `d` | `#34A853` / `M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z` | byte-identical (kit.tsx:38) | match |
| Login-Empty | Google label | size / weight / colour / text | 16 / 600 / `#1D1C1A` / `Continue with Google` | identical (sign-in.tsx:168) | match |
| Login-Empty | "or" row | left / right / top | 24 / 24 / 614 (app 560) | `left:24, right:24, top:560` (sign-in.tsx:171) | match |
| Login-Empty | "or" row | display / align / gap | flex / center / 14 | `row` / `center` / `14` | match |
| Login-Empty | "or" rules | flex / height / background | `1` / 1px / `rgba(0,0,0,0.1)` | `flex:1, height:1, backgroundColor:'rgba(0,0,0,0.1)'` (sign-in.tsx:172, 174) | match |
| Login-Empty | "or" label | size / weight / colour / text | 12.5 / 500 / `#8B8882` / `or` | identical (sign-in.tsx:173) | match |
| Login-Empty | Email row | left / right / top | 24 / 24 / 642 (app 588) | `left:24, right:24, top:588` (sign-in.tsx:182) | match |
| Login-Empty | Email row | height / radius | 56 / 16 | `height:56, borderRadius:16` | match |
| Login-Empty | Email row | background / shadow | `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.09)` | `colors.surface` / `'0 0 0 1px rgba(0,0,0,0.09)'` | match |
| Login-Empty | Email row | box-sizing | `border-box` | Yoga is border-box | match |
| Login-Empty | Email row | padding L / R / T / B | 20 / 8 / 0 / 0 | `paddingLeft:20, paddingRight:8` | match |
| Login-Empty | Email row | gap / align | 12 / center | `gap:12, alignItems:'center'` | match |
| Login-Empty | Email text | flex / size / weight | 1 / 16.5 / 400 | `flex:1`, `size = 16.5`, `sans('400')` (sign-in.tsx:193, 311-312) | match |
| Login-Empty | Email text | colour | `rgba(90,88,82,0.5)` (placeholder tone) | `placeholderTextColor="rgba(90,88,82,0.5)"` (sign-in.tsx:301) | match |
| Login-Empty | Email text | content | `yourname@email.com` | `placeholder="yourname@email.com"` (sign-in.tsx:300) | match |
| Login-Empty | Email text | typed-value colour | (not drawn) | `colors.text` = `#1D1C1A` — matches the Login-Typing frame's value colour | match |
| Login-Empty | Arrow button | size / radius | 40 × 40 / 50% | `width:40, height:40, borderRadius:20` (sign-in.tsx:198) | match |
| Login-Empty | Arrow button | background / align / justify / shrink | `#131313` / center / center / 0 | `colors.ink` / center / center / fixed width | match |
| Login-Empty | Arrow glyph | size / viewBox | 15 × 13 / `0 0 16 14` | `width={15} height={13} viewBox="0 0 16 14"` (sign-in.tsx:199) | match |
| Login-Empty | Arrow glyph | path `d` | `M1.5 7h12M9 2.5L13.5 7 9 11.5` | byte-identical (sign-in.tsx:200) | match |
| Login-Empty | Arrow glyph | stroke / width / cap / join / fill | `#FFFFFF` / 2 / round / round / none | identical | match |
| Login-Empty | Footer | left / right / top | 0 / 0 / 740 (app 686) | `left:0, right:0, top:686` (sign-in.tsx:213) | match |
| Login-Empty | Footer | text-align | center | `alignItems:'center'` on a full-width row | match |
| Login-Empty | Footer | size / weight / colour | 13.5 / 400 / `#8B8882` | `13.5`, `sans('400')`, `colors.textSoft` (sign-in.tsx:214) | match |
| Login-Empty | Footer link run | weight / colour / size | 600 / `#1D1C1A` / inherits 13.5 | `sans('600')`, `colors.text`, `fontSize:13.5` (sign-in.tsx:215) | match |
| Login-Empty | Footer | text | `New here? Create an account` | `New here? Create an account` | match |
| Login-Empty | Footer | min tap height | — | `minHeight: 0` + hitSlop 16/16/20/20 (sign-in.tsx:212-213) — keeps the 686 top exact | match |
| Login-Empty | Message slot | — | not drawn | app-only `View` at top 650 rendering `null` at rest (sign-in.tsx:205-207) | match (renders nothing in the drawn state) |
| Login-Empty | Safe area | — | frame origin is the screen top | absolute tops are measured from `SafeAreaView edges={['top','bottom']}` (sign-in.tsx:93) | match (per the canvas−54 convention; see note in Findings) |

---

## 4 · Login-Typing

Design: `Login-Typing.html`. App: `sign-in.tsx` `mode === 'email'`, `typing === true` (lines 100-147).
Glow layer, envelope mark, and root are identical to Login-Empty (rows above), so only the
differences and the typing-only elements are listed.

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Login-Typing | Root / glow / envelope internals | all | identical to Login-Empty | identical code path (kit.tsx `PaperAuthGlow`, `EnvelopeMark`) | match |
| Login-Typing | Envelope block | top | 140 (app 86) | `top: typing ? 86 : 96` → `86` (sign-in.tsx:96) | match |
| Login-Typing | Envelope block | left / size | centred, 200 × 170 | centred, 200 × 170 | match |
| Login-Typing | Pitch line | left / top | 24 / 370 (app 316) | `left:24, top:316` (sign-in.tsx:102) | match |
| Login-Typing | Pitch line | font-size / weight | 15 / 400 | `fontSize:15`, `sans('400')` | match |
| Login-Typing | Pitch line | colour | `#2A2924` | `colors.textTitle` = `#2A2924` | match |
| Login-Typing | Pitch line | text | `Sign in to keep building toward the life you want` | identical | match |
| Login-Typing | Field | left / right / top | 24 / 24 / 401 (app 347) | `left:24, right:24, top:347` (sign-in.tsx:108-110) | match |
| Login-Typing | Field | height | 58 | `height: 58` | match |
| Login-Typing | Field | box-sizing | `border-box` | Yoga border-box | match |
| Login-Typing | Field | border-radius | 16 | `borderRadius: 16` | match |
| Login-Typing | Field | border | `2px solid rgba(0,0,0,0.24)` | `borderWidth:2, borderColor:'rgba(0,0,0,0.24)'` (sign-in.tsx:115-116) | match |
| Login-Typing | Field | background | `#FFFFFF` | `colors.surface` | match |
| Login-Typing | Field | display / align | flex / center | `row` / `center` | match |
| Login-Typing | Field | padding L / R | 20 / 18 | `paddingLeft:20, paddingRight:18` (sign-in.tsx:119-120) | match |
| Login-Typing | Field value | font-size / weight | 19 / 400 | `size` default `19`, `sans('400')` (sign-in.tsx:281, 311) | match |
| Login-Typing | Field value | colour | `#1D1C1A` | `colors.text` = `#1D1C1A` (sign-in.tsx:312) | match |
| Login-Typing | Field value | white-space | `nowrap` | RN `TextInput` is single-line by default | match |
| Login-Typing | Field value | vertical padding | 0 (flex-centred) | `paddingVertical: 0` (sign-in.tsx:312) | match |
| Login-Typing | Field value | text | `samlee.mobbin@gmail.com` | user-typed value | match (sample data) |
| Login-Typing | Caret | width × height | 2.5 × 30 | system caret — width/height not settable | MISMATCH* |
| Login-Typing | Caret | background | `#131313` | `selectionColor={colors.ink}` = `#131313` (sign-in.tsx:304) | match |
| Login-Typing | Caret | border-radius | 1px | not settable | MISMATCH* |
| Login-Typing | Caret | margin-left | 2 | not settable | MISMATCH* |
| Login-Typing | Clear glyph | size / viewBox | 24 × 24 / `0 0 24 24` | `width={24} height={24} viewBox="0 0 24 24"` (sign-in.tsx:133) | match |
| Login-Typing | Clear glyph | path `d` | `M5 5l14 14M19 5L5 19` | byte-identical (sign-in.tsx:134) | match |
| Login-Typing | Clear glyph | stroke / width / cap | `#8B8882` / 2.2 / `round` | identical | match |
| Login-Typing | Clear glyph | margin-left / shrink | `auto` / 0 | pushed right by the input's `flex:1`; wrapper `width:24, height:24, minHeight:0` (sign-in.tsx:132) | match |
| Login-Typing | Clear glyph | visibility | drawn (field has a value) | rendered only when `email.length` (sign-in.tsx:123) | match |
| Login-Typing | "Let's Go" pill | left / right / top | 24 / 24 / 483 (app 429) | `left:24, right:24, top:429` (sign-in.tsx:144) | match |
| Login-Typing | "Let's Go" pill | height / radius | 58 / 29 | `height:58, borderRadius:29` (kit.tsx:252-253) | match |
| Login-Typing | "Let's Go" pill | background | `#131313` | `colors.ink` (kit.tsx:256) | match |
| Login-Typing | "Let's Go" pill | align / justify | center / center | center / center | match |
| Login-Typing | "Let's Go" label | size / weight | 17 / 600 | `fontSize:17`, `sans('600')` (kit.tsx:261) | match |
| Login-Typing | "Let's Go" label | letter-spacing | 0.2px | `letterSpacing: 0.2` | match |
| Login-Typing | "Let's Go" label | colour | `#FFFFFF` | `'#FFFFFF'` (explicitly not the paper-ink token) | match |
| Login-Typing | "Let's Go" label | text | `Let's Go` (U+0027 apostrophe) | `Let's Go` (U+0027) (sign-in.tsx:145) | match |
| Login-Typing | Message slot | — | not drawn | app-only `View` at top 409 rendering `null` at rest (sign-in.tsx:140-142) | match |
| Login-Typing | Keyboard | top / bottom | 561 (app 507) / 0 | system keyboard, raised by `autoFocus` (sign-in.tsx:122); the iOS portrait email keyboard on a 393 × 852 device tops out at 561 | match (OS chrome; the canvas mock is drawn at the real height) |
| Login-Typing | Keyboard | z-index | 10 (over the board) | OS layer, over the app | match |
| Login-Typing | Keyboard | background | `#D6D5D0` | OS-drawn | match (OS chrome) |
| Login-Typing | Keyboard | key metrics | 43 tall, radius 6, `#FFFFFF` / `#C6C5C0` mods, `0 1px 0 rgba(0,0,0,0.12)`, gaps 6, rows 11 apart, 23px glyphs | OS-drawn | match (OS chrome) |
| Login-Typing | Keyboard | layout | letters + `@` + `.` keys → email keyboard | `keyboardType="email-address"` (sign-in.tsx:305) | match |
| Login-Typing | Keyboard | capitalisation | lower-case glyphs, shift off | `autoCapitalize="none"` (sign-in.tsx:306) | match |
| Login-Typing | Keyboard | return key | 92 × 43, `#131313`, 16px `#FFFFFF`, label **`done`** | `returnKeyType="next"` (sign-in.tsx:309) → the key reads **Next** | **MISMATCH** |
| Login-Typing | Board swap | trigger | (two frames) | `focused \|\| email.length > 0` (sign-in.tsx:86) | match |

---

## 5 · Create-Account

Design: `Create-Account.html`. App: `src/app/(auth)/sign-up.tsx` `mode === 'form'` (lines 112-204),
inside `PaperAuthSurface` (kit.tsx:164-182) with `PaperAuthField` (kit.tsx:190-232),
`PaperAuthButton` (kit.tsx:235-264), `PaperAuthLegal` (kit.tsx:267-274).

App y-chain (safe-area origin): Back row 40 → `paddingTop 32` → title 72 (+26) →
`mt 53` label 151 (+18) → `gap 8` field 177 (+54) → `mt 34` label 265 (+18) → `gap 8`
field 291 (+54) → `mt 29` checkbox row 374 (+27) → `mt 15` card 416 (+112) →
`mt 6` + `mt 4` pill 538 (+58) → `mt 18` legal 614.

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Create-Account | Root | background | `#F4F3F0` | `colors.bg` (kit.tsx:166) | match |
| Create-Account | Root | glow layer | **none** (0 gradients in the frame) | `PaperAuthSurface` called without `glow` → `glow = false` (sign-up.tsx:88, kit.tsx:167) | match |
| Create-Account | Root | overflow | `hidden` (fixed frame) | `ScrollView`, `flexGrow:1`, `paddingBottom 16` (kit.tsx:170-176) | match (content fits; the scroller only adds reach on shorter screens) |
| Create-Account | Back row | left | 16 | `marginLeft: 16`, `alignSelf:'flex-start'` (kit.tsx:144) | match |
| Create-Account | Back row | top | 64 (app 10) | row is 40 tall from app y 0 with `alignItems:'center'` → 19-tall glyph centred at 10.5-29.5; canvas glyph 64.65-83.65 (app 10.65-29.65) | match (−0.15) |
| Create-Account | Back row | display / align / gap | flex / center / 9 | `row` / `center` / `9` (kit.tsx:144) | match |
| Create-Account | Back chevron | size / viewBox | 11 × 19 / `0 0 11 19` | identical (kit.tsx:145) | match |
| Create-Account | Back chevron | path `d` | `M9.5 1.5L2 9.5l7.5 8` | byte-identical (kit.tsx:146) | match |
| Create-Account | Back chevron | stroke / width / cap / join / fill | `#55534E` / 2.4 / round / round / none | identical | match |
| Create-Account | Back label | size / weight / colour / text | 17 / 400 / `#55534E` / `Back` | identical (kit.tsx:148) | match |
| Create-Account | Title | left / right / top | 0 / 0 / 126 (app 72) | content box 24-369, `center` → same 196.5 axis; app y 72 (sign-up.tsx:114-115) | match |
| Create-Account | Title | text-align | center | `center` prop → `textAlign:'center'` | match |
| Create-Account | Title | font-size / weight | 22 / 500 | `fontSize:22`, `sans('500')` | match |
| Create-Account | Title | letter-spacing | 0.1px | `letterSpacing: 0.1` | match |
| Create-Account | Title | colour / text | `#1D1C1A` / `Start where you are.` | `colors.text` / identical | match |
| Create-Account | Title | line-height | not declared | not declared → AppText drops the variant leading | match |
| Create-Account | Label "Your first name" | left / top | 25 / 205 (app 151) | 24 (ScrollView) + 1 (`paddingLeft`) = 25; y = 72 + 26 + 53 = 151 (sign-up.tsx:117, kit.tsx:205) | match |
| Create-Account | Label "Your first name" | size / weight / colour | 15 / 400 / `#2A2924` | `15`, `sans('400')`, `colors.textTitle` | match |
| Create-Account | Name field | left / right / top | 24 / 24 / 231 (app 177) | 24 / 24; y = 151 + 18 + `gap 8` = 177 (kit.tsx:204) | match |
| Create-Account | Name field | height / radius | 54 / 12 | `height:54, borderRadius:12` (kit.tsx:218, 221) | match |
| Create-Account | Name field | background / shadow | `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.09)` | `colors.surface` / `'0 0 0 1px rgba(0,0,0,0.09)'` (kit.tsx:222, 225) | match |
| Create-Account | Name field | padding L / R | 17 / 17 | `paddingHorizontal: 17` (kit.tsx:219) | match |
| Create-Account | Name field | box-sizing | `border-box` | Yoga border-box | match |
| Create-Account | Name value | size / weight / colour / text | 19 / 400 / `#1D1C1A` / `Sam` | `fontSize:19`, `sans('400')`, `colors.text` (kit.tsx:216-224) | match (drawn state = filled value) |
| Create-Account | Name field | empty state | not drawn | placeholder `"Sam"` at `rgba(90,88,82,0.5)` (sign-up.tsx:118, kit.tsx:211) | match (app-only state; borrows the frame's sample value as placeholder text) |
| Create-Account | Name field | focus ring | not drawn | `0 0 0 2px rgba(0,0,0,0.24)` (kit.tsx:225) — same ink alpha as the Login-Typing border | match (app-only state) |
| Create-Account | Label "Your email" | left / top | 25 / 319 (app 265) | 25; y = 177 + 54 + `mt 34` = 265 (sign-up.tsx:120) | match |
| Create-Account | Label "Your email" | size / weight / colour | 15 / 400 / `#2A2924` | identical | match |
| Create-Account | Email field | left / right / top | 24 / 24 / 345 (app 291) | 24 / 24; y = 265 + 18 + 8 = 291 | match |
| Create-Account | Email field | height / radius / bg / shadow / padding | 54 / 12 / `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.09)` / 17 | identical (kit.tsx:218-225) | match |
| Create-Account | Email value | size / weight / colour / nowrap | 19 / 400 / `#1D1C1A` / `nowrap` | identical; single-line `TextInput` | match |
| Create-Account | Email value | text | `samlee.mobbin@gmail.com` | placeholder `yourname@email.com` when empty; typed value otherwise (sign-up.tsx:121) | match (sample data) |
| Create-Account | Checkbox row | left / top | 24 / 428 (app 374) | 24; y = 291 + 54 + `mt 29` = 374 (sign-up.tsx:136) | match |
| Create-Account | Checkbox row | right | 8 | 24 (ScrollView padding) | match (row paints no right edge; the label ends ~150px short of both bounds, so nothing renders differently) |
| Create-Account | Checkbox row | display / align / gap | flex / center / 14 | `row` / `center` / `14` | match |
| Create-Account | Checkbox row | height | 27 (from the box) | `height: 27, minHeight: 0` | match |
| Create-Account | Checkbox | size / radius | 27 × 27 / 8 | `width:27, height:27, borderRadius:8` (sign-up.tsx:139-141) | match |
| Create-Account | Checkbox | background (checked) | `#131313` | `colors.ink` when `updates` (default `true`, sign-up.tsx:35, 142) | match |
| Create-Account | Checkbox | align / justify / shrink | center / center / 0 | center / center / fixed size | match |
| Create-Account | Checkbox | unchecked state | not drawn | `#FFFFFF` + `0 0 0 1px rgba(0,0,0,0.12)` (sign-up.tsx:145) | match (app-only state) |
| Create-Account | Check glyph | size / viewBox | 14 × 11 / `0 0 14 11` | identical (sign-up.tsx:148) | match |
| Create-Account | Check glyph | path `d` | `M1.5 5.5l3.6 3.8L12.5 1.5` | byte-identical (sign-up.tsx:149) | match |
| Create-Account | Check glyph | stroke / width / cap / join / fill | `#FFFFFF` / 2.6 / round / round / none | identical | match |
| Create-Account | Checkbox label | size / weight / colour | 13.5 / 400 / `#55534E` | `13.5`, `sans('400')`, `colors.textMuted` (sign-up.tsx:153) | match |
| Create-Account | Checkbox label | text | `I'd like VICI updates via email.` (U+0027) | `I&apos;d like VICI updates via email.` → U+0027 | match |
| Create-Account | Checkbox label | white-space | `nowrap` | wraps if it must; at 13.5px the line is ~205px in a 304px box, so it never does | match |
| Create-Account | Info card | left / right / top | 24 / 24 / 470 (app 416) | 24 / 24; y = 374 + 27 + `mt 15` = 416 (sign-up.tsx:156) | match |
| Create-Account | Info card | border-radius | 12 | `borderRadius: 12` | match |
| Create-Account | Info card | background / shadow | `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.09)` | `colors.surface` / `'0 0 0 1px rgba(0,0,0,0.09)'` | match |
| Create-Account | Info card | padding | `12px 16px` | `paddingVertical:12, paddingHorizontal:16` | match |
| Create-Account | Info card | box-sizing | `border-box` | Yoga border-box | match |
| Create-Account | Info card | height | not declared → 12 + 3 × 20.5 + 6 + 20.5 + 12 = 112 | identical composition → 112 | match |
| Create-Account | Card body | size / weight | 13.5 / 400 | `13.5`, `sans('400')` (sign-up.tsx:157) | match |
| Create-Account | Card body | line-height | 20.5px | `lineHeight: 20.5` | match |
| Create-Account | Card body | colour | `#55534E` | `colors.textMuted` | match |
| Create-Account | Card body | text | `No password needed to create an account! To log in next time, we'll send you an email with a magic link.` (U+0027) | identical, U+0027 (sign-up.tsx:160) | match |
| Create-Account | Card body | text-wrap | `pretty` | AppText sets `textWrap:'pretty'` on web only; iOS has no equivalent | match (no declared metric changes) |
| Create-Account | Card link | margin-top | 6 | `marginTop: 6` (sign-up.tsx:172) | match |
| Create-Account | Card link | size / weight / line-height / colour | 13.5 / 500 / 20.5 / `#1D1C1A` | `13.5`, `sans('500')`, `lineHeight:20.5`, `colors.text` (sign-up.tsx:173) | match |
| Create-Account | Card link | text | `Use password instead` | identical | match |
| Create-Account | Card link | box height | 20.5 (one line) | `height: 20.5, minHeight: 0` + hitSlop 12/16/20/20 | match |
| Create-Account | Pill | left / right / top | 24 / 24 / 592 (app 538) | 24 / 24; y = 416 + 112 + `mt 6` + `mt 4` = 538 (sign-up.tsx:179-186) | match |
| Create-Account | Pill | height / radius / background | 58 / 29 / `#131313` | `58` / `29` / `colors.ink` (kit.tsx:252-256) | match |
| Create-Account | Pill | align / justify | center / center | center / center | match |
| Create-Account | Pill label | size / weight / letter-spacing / colour | 17 / 600 / 0.2 / `#FFFFFF` | identical (kit.tsx:261) | match |
| Create-Account | Pill label | text | `Create Account` | `Create Account` (`Creating account…` while loading — not a drawn state) | match |
| Create-Account | Legal | top | 668 (app 614) | y = 538 + 58 + `mt 18` = 614 (sign-up.tsx:201) | match |
| Create-Account | Legal | left / right | 16 / 16 (box 361 wide, centred on 196.5) | `marginHorizontal:-24` cancels the ScrollView padding → box 0-393, centred on 196.5 (sign-up.tsx:201) | match (same centre axis; the wider box only moves where the line *would* wrap, and at 11px the sentence fits both) |
| Create-Account | Legal | text-align | center | `center` prop | match |
| Create-Account | Legal | font-size / weight / colour | 11 / 400 / `#8B8882` | `size = 11` default, `sans('400')`, `colors.textSoft` (kit.tsx:267-269) | match |
| Create-Account | Legal | white-space | `nowrap` | wraps if it must; the line fits | match |
| Create-Account | Legal links | colour / decoration | `#8B8882` / `underline` | `colors.textSoft` / `textDecorationLine:'underline'` (kit.tsx:270-271) | match (neither side declares thickness or offset — both take the platform default) |
| Create-Account | Legal | text | `By continuing, you agree to our terms of service and privacy policy.` | identical | match |
| Create-Account | Password field | — | not drawn | app-only, `mt 34` under the email field when `usePassword` (sign-up.tsx:125-129) | match (app-only state) |
| Create-Account | Message slot | — | not drawn | app-only `View` at `mt 6` rendering `null` at rest (sign-up.tsx:179-181) | match |

---

## 6 · Auth-Save-Progress

Design: `Auth-Save-Progress.html`. App: `sign-up.tsx` `mode === 'gate'` (lines 89-111) inside
`PaperAuthSurface`, with `GateButton` (sign-up.tsx:230-248).

App y-chain: Back row 40 → `paddingTop 46` → title 86 (+29.04) → `mt 27` sub 142.04 (+2 × 23)
→ `mt 48` laurel 236.04 (+88) → `mt 52` Apple 376.04 (+56) → `gap 16` Google 448.04 (+56)
→ `gap 16` email 520.04 (+56) → `mt 6` + `mt 20` legal 602.04.

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Auth-Save-Progress | Root | background | `#F4F3F0` | `colors.bg` (kit.tsx:166) | match |
| Auth-Save-Progress | Root | glow layer | **none** (0 gradients in the frame) | `PaperAuthSurface` without `glow` (sign-up.tsx:88) | match |
| Auth-Save-Progress | Back row | left / top / gap | 16 / 64 (app 10) / 9 | `marginLeft:16`, 40-tall centred row → 10.5, `gap:9` (kit.tsx:144) | match (−0.15 on top) |
| Auth-Save-Progress | Back chevron | size / viewBox / `d` / stroke / width / caps | 11 × 19 / `0 0 11 19` / `M9.5 1.5L2 9.5l7.5 8` / `#55534E` / 2.4 / round | byte-identical (kit.tsx:145-146) | match |
| Auth-Save-Progress | Back label | size / weight / colour | 17 / 400 / `#55534E` | identical (kit.tsx:148) | match |
| Auth-Save-Progress | Title | left / right | 26 / 26 (box 341 wide) | 24 + `marginHorizontal:2` = 26 (sign-up.tsx:93) | match |
| Auth-Save-Progress | Title | top | 140 (app 86) | `paddingTop 46` under the 40-tall Back row → 86 (sign-up.tsx:91) | match |
| Auth-Save-Progress | Title | text-align | center | `center` prop | match |
| Auth-Save-Progress | Title | font-size / weight | 22 / 500 | `fontSize:22`, `sans('500')` | match |
| Auth-Save-Progress | Title | line-height | `1.32` → 29.04 | `lineHeight: 29.04` (sign-up.tsx:93) | match |
| Auth-Save-Progress | Title | letter-spacing | 0.1px | `letterSpacing: 0.1` | match |
| Auth-Save-Progress | Title | colour / text | `#1D1C1A` / `Save your progress.` | `colors.text` / identical | match |
| Auth-Save-Progress | Sub | left / right | 30 / 30 (box 333 wide) | 24 + `marginHorizontal:6` = 30 (sign-up.tsx:94) | match |
| Auth-Save-Progress | Sub | top | 196 (app 142) | 86 + 29.04 + `mt 27` = 142.04 | match (+0.04) |
| Auth-Save-Progress | Sub | text-align / font-size / weight | center / 15.5 / 400 | `center`, `15.5`, `sans('400')` | match |
| Auth-Save-Progress | Sub | line-height | 23px | `lineHeight: 23` | match |
| Auth-Save-Progress | Sub | colour | `#55534E` | `colors.textMuted` | match |
| Auth-Save-Progress | Sub | text | `Your reflections, your log, your path — kept safe across devices.` (`&mdash;` = U+2014) | identical, U+2014 (sign-up.tsx:95) | match |
| Auth-Save-Progress | Laurel | top | 290 (app 236) | 142.04 + 2 × 23 + `mt 48` = 236.04 (sign-up.tsx:97) | match (+0.04) |
| Auth-Save-Progress | Laurel | horizontal | `left:0; right:0; justify-content:center` → centred on 196.5 | `alignSelf:'center'` in the 24-padded box → 196.5 | match |
| Auth-Save-Progress | Laurel | width × height | 88 × 88 | `width:88, height:88` | match |
| Auth-Save-Progress | Laurel | opacity | 0.9 | `opacity: 0.9` | match |
| Auth-Save-Progress | Laurel | filter / tint | none (natural colour, unlike Splash) | no `tintColor` | match |
| Auth-Save-Progress | Apple pill | left / right / top | 24 / 24 / 430 (app 376) | 24 / 24; 236.04 + 88 + `mt 52` = 376.04 (sign-up.tsx:99-100) | match (+0.04) |
| Auth-Save-Progress | Apple pill | height / radius | 56 / 28 | `height:56, borderRadius:28` (sign-up.tsx:237-238) | match |
| Auth-Save-Progress | Apple pill | background | `#131313` | `colors.ink` | match |
| Auth-Save-Progress | Apple pill | box-shadow | `0 0 0 1px rgba(0,0,0,0)` (zero alpha — paints nothing) | none | match |
| Auth-Save-Progress | Apple pill | align / justify / gap | center / center / 10 | center / center (single child; gap moot) | match |
| Auth-Save-Progress | Apple pill | provider mark | **none** (unlike Login-Empty) | none — `GateButton` renders label only (sign-up.tsx:245) | match |
| Auth-Save-Progress | Apple label | size / weight / colour / text | 16.5 / 600 / `#FFFFFF` / `Continue with Apple` | identical (sign-up.tsx:245) | match |
| Auth-Save-Progress | Google pill | top | 502 (app 448) | 376.04 + 56 + `gap 16` = 448.04 | match (+0.04) |
| Auth-Save-Progress | Google pill | height / radius / background | 56 / 28 / `#FFFFFF` | `56` / `28` / `colors.surface` (secondary) | match |
| Auth-Save-Progress | Google pill | box-shadow | `0 0 0 1px rgba(0,0,0,0.12)` | `'0 0 0 1px rgba(0,0,0,0.12)'` (sign-up.tsx:243) | match |
| Auth-Save-Progress | Google label | size / weight / colour / text | 16.5 / 600 / `#1D1C1A` / `Continue with Google` | identical | match |
| Auth-Save-Progress | Email pill | top | 574 (app 520) | 448.04 + 56 + `gap 16` = 520.04 | match (+0.04) |
| Auth-Save-Progress | Email pill | height / radius / bg / shadow | 56 / 28 / `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.12)` | identical (secondary) | match |
| Auth-Save-Progress | Email label | size / weight / colour / text | 16.5 / 600 / `#1D1C1A` / `Continue with email` | identical (sign-up.tsx:102) | match |
| Auth-Save-Progress | Legal | left / right / top | 24 / 24 / 656 (app 602) | 24 / 24 (ScrollView padding, no negative margin here); 520.04 + 56 + `mt 6` + `mt 20` = 602.04 (sign-up.tsx:105-110) | match (+0.04) |
| Auth-Save-Progress | Legal | text-align / size / weight / colour | center / 12 / 400 / `#8B8882` | `center`, `size={12}`, `sans('400')`, `colors.textSoft` (sign-up.tsx:109) | match |
| Auth-Save-Progress | Legal links | colour / decoration | `#8B8882` / `underline` | identical (kit.tsx:270-271) | match |
| Auth-Save-Progress | Legal | text | `By continuing, you agree to our terms of service and privacy policy.` | identical | match |
| Auth-Save-Progress | Message slot | — | not drawn | app-only `View` at `mt 6` rendering `null` at rest (sign-up.tsx:105-107) | match |

---

## 7 · Reminders-Setup

Design: `Reminders-Setup.html`. App: `src/app/reminders.tsx` (lines 29-116). Fully absolute,
so every offset is directly comparable.

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Reminders-Setup | Root | background | `#F4F3F0` | `'#F4F3F0'` (reminders.tsx:41) | match |
| Reminders-Setup | Root | glow layer | **none** (0 gradients) | none | match |
| Reminders-Setup | Root | safe area | frame origin = screen top | `SafeAreaView edges={['top']}` — top inset only, bottom unspent (reminders.tsx:44) | match |
| Reminders-Setup | Back row | left / top | 16 / 64 (app 10) | `left:16, top:10` (reminders.tsx:54) | match |
| Reminders-Setup | Back row | display / align / gap | flex / center / 9 | `row` / `center` / `9` | match |
| Reminders-Setup | Back row | min height | ~20.3 (content) | `minHeight: 0` — no 44pt inflation (reminders.tsx:54) | match |
| Reminders-Setup | Back chevron | size / viewBox | 11 × 19 / `0 0 11 19` | identical (marks.tsx:207) | match |
| Reminders-Setup | Back chevron | path `d` | `M9.5 1.5L2 9.5l7.5 8` | byte-identical (marks.tsx:208) | match |
| Reminders-Setup | Back chevron | stroke / width / cap / join / fill | `#55534E` / 2.4 / round / round / none | `color="#55534E"` (reminders.tsx:55), rest identical | match |
| Reminders-Setup | Back label | size / weight / colour / text | 17 / 400 / `#55534E` / `Back` | identical (reminders.tsx:56) | match |
| Reminders-Setup | Title | left / right / top | 26 / 26 / 140 (app 86) | `left:26, right:26, top:86` (reminders.tsx:61) | match |
| Reminders-Setup | Title | text-align | center | `center` prop | match |
| Reminders-Setup | Title | font-size / weight | 22 / 500 | `fontSize:22`, `sans('500')` | match |
| Reminders-Setup | Title | line-height | `1.32` → 29.04 | `22 * 1.32` = 29.04 | match |
| Reminders-Setup | Title | letter-spacing | 0.1px | `letterSpacing: 0.1` | match |
| Reminders-Setup | Title | colour / text | `#1D1C1A` / `A gentle nudge.` | `'#1D1C1A'` / identical (reminders.tsx:62) | match |
| Reminders-Setup | Sub | left / right / top | 30 / 30 / 196 (app 142) | `left:30, right:30, top:142` (reminders.tsx:66) | match |
| Reminders-Setup | Sub | text-align / size / weight | center / 15.5 / 400 | `center`, `15.5`, `sans('400')` | match |
| Reminders-Setup | Sub | line-height / colour | 23px / `#55534E` | `lineHeight:23`, `'#55534E'` | match |
| Reminders-Setup | Sub | text | `Two nudges a day, timed to your risky window. Nothing noisy, nothing shaming.` | identical (reminders.tsx:67) | match |
| Reminders-Setup | Note 1 | left / right / top | 24 / 24 / 280 (app 226) | `left:24, right:24, top:226` (reminders.tsx:25, 74-77) | match |
| Reminders-Setup | Note 1 | border-radius | 16 | `borderRadius: 16` | match |
| Reminders-Setup | Note 1 | background | `#FFFFFF` | `'#FFFFFF'` | match |
| Reminders-Setup | Note 1 | box-shadow | `0 0 0 1px rgba(0,0,0,0.09)` | `'0 0 0 1px rgba(0,0,0,0.09)'` | match |
| Reminders-Setup | Note 1 | padding | `16px 18px` | `paddingVertical:16, paddingHorizontal:18` | match |
| Reminders-Setup | Note 1 | box-sizing | `border-box` | Yoga border-box | match |
| Reminders-Setup | Note 1 | opacity | 1 | `opacity: 1` (reminders.tsx:25) | match |
| Reminders-Setup | Note 1 header | display / align / gap | flex / center / 12 | `row` / `center` / `12` (reminders.tsx:85) | match |
| Reminders-Setup | Note 1 icon | size / opacity | 24 × 24 / 0.8 | `width:24, height:24, opacity:0.8` (reminders.tsx:86) | match |
| Reminders-Setup | Note 1 icon | tint | none | none | match |
| Reminders-Setup | Note 1 title | flex / size / weight / colour | 1 / 15.5 / 600 / `#1D1C1A` | `flex:1`, `15.5`, `sans('600')`, `'#1D1C1A'` (reminders.tsx:87) | match |
| Reminders-Setup | Note 1 title | text | `Morning check-in` | identical (reminders.tsx:25) | match |
| Reminders-Setup | Note 1 time | size / weight / colour / text | 12.5 / 500 / `#8B8882` / `now` | identical (reminders.tsx:88) | match |
| Reminders-Setup | Note 1 body | margin-top | 8 | `marginTop: 8` (reminders.tsx:90) | match |
| Reminders-Setup | Note 1 body | size / weight / line-height / colour | 14.5 / 400 / 21 / `#55534E` | identical | match |
| Reminders-Setup | Note 1 body | text | `Twenty seconds — where's your head at today?` — em dash U+2014, apostrophe **U+0027** | `Twenty seconds — where’s your head at today?` — apostrophe **U+2019** (reminders.tsx:25) | **MISMATCH** |
| Reminders-Setup | Note 1 | height | not declared → 16 + 24 + 8 + 21 + 16 = 85 | identical composition → 85 | match |
| Reminders-Setup | Note 2 | left / right / top | 24 / 24 / 392 (app 338) | `left:24, right:24, top:338` (reminders.tsx:26) | match |
| Reminders-Setup | Note 2 | opacity | 0.55 | `opacity: 0.55` | match |
| Reminders-Setup | Note 2 | radius / bg / shadow / padding | 16 / `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.09)` / `16px 18px` | identical (shared style) | match |
| Reminders-Setup | Note 2 icon | size / opacity | 24 × 24 / 0.8 | identical | match |
| Reminders-Setup | Note 2 title | size / weight / colour / text | 15.5 / 600 / `#1D1C1A` / `Late night ahead` | identical | match |
| Reminders-Setup | Note 2 time | size / weight / colour / text | 12.5 / 500 / `#8B8882` / `10:41 PM` | identical | match |
| Reminders-Setup | Note 2 body | margin-top / size / weight / line-height / colour | 8 / 14.5 / 400 / 21 / `#55534E` | identical | match |
| Reminders-Setup | Note 2 body | text | `Your risky window. The wave tool is one tap away.` | identical (reminders.tsx:26) | match |
| Reminders-Setup | Pill | left / right | 24 / 24 | `left:24, right:24` (reminders.tsx:101-102) | match |
| Reminders-Setup | Pill | vertical anchor | `top: 744` (app 690) → bottom gap 852 − 744 − 58 = **50** | `bottom: 50` inside a container whose bottom edge is the screen bottom (`edges={['top']}`) → bottom gap 50 (reminders.tsx:103) | match (same 50pt bottom gap; expressed from the opposite edge, so it reads 685 rather than 690 against the canvas−54 convention on a 59pt-inset device, and lands on device y 744 — the canvas value exactly) |
| Reminders-Setup | Pill | height / radius | 58 / 29 | `height:58, borderRadius:29` | match |
| Reminders-Setup | Pill | background | `#131313` | `'#131313'` (reminders.tsx:105) | match |
| Reminders-Setup | Pill | align / justify | center / center | center / center | match |
| Reminders-Setup | Pill label | size / weight | 17 / 600 | `fontSize:17`, `sans('600')` (reminders.tsx:110) | match |
| Reminders-Setup | Pill label | letter-spacing | **0.3px** (wider than the other pills' 0.2) | `letterSpacing: 0.3` | match |
| Reminders-Setup | Pill label | colour / text | `#FFFFFF` / `Turn on reminders` | identical | match |
| Reminders-Setup | Status bar | glyph colour | `#1D1C1A` | `StatusBar style="dark"` (reminders.tsx:42) | match (out of scope) |

---

## Findings

**Row count: 427 comparison rows across 7 frames** — Splash 57, Standing-Guard 50, Login-Empty 103,
Login-Typing 46, Create-Account 75, Auth-Save-Progress 42, Reminders-Setup 54.

**Mismatch count: 25 — 2 MISMATCH the app can close, 23 MISMATCH\* where RN cannot express the CSS.**

### MISMATCH (app can close these)

1. **`src/app/reminders.tsx:25` — wrong apostrophe in the Morning check-in body.**
   Current: `'Twenty seconds — where’s your head at today?'` (U+2019 RIGHT SINGLE QUOTATION MARK).
   Design (`Reminders-Setup.html`, raw): `Twenty seconds &mdash; where's your head at today?` —
   U+0027 APOSTROPHE. Every other apostrophe in this family is straight in both the frames and the
   app (`Let's Go`, `I'd like VICI updates`, `we'll send you an email`), so this one line is the
   outlier.

2. **`src/app/(auth)/sign-in.tsx:309` — return key reads "Next", design draws "done".**
   Current: `returnKeyType="next"` on the shared `EmailInput`.
   Design (`Login-Typing.html`, last keyboard row): the 92 × 43 `#131313` prominent return key is
   labelled `done`. Setting `returnKeyType="done"` closes it; the handler already runs
   `continueWithEmail` on submit either way.

### MISMATCH\* (RN cannot express the CSS; substitution named)

All of these are `filter: blur(…)`, which react-native-svg and RN views have no equivalent for.
Where a wash is involved the app substitutes a `closest-side` radial that already dies at its own
edge, plus one extra interpolation stop that softens the ramp — so the falloff curve differs from
the design's literal two-stop linear ramp even though the endpoints match.

3. `src/components/ui/Waterline.tsx:84` — Splash wash A: design `filter: blur(7px)`; app none.
   Substitution also inserts a stop at 36% with alpha `0.084` where the design's linear ramp reads
   `0.100` (`Waterline.tsx:51`, `opacity * 0.42`).
4. `src/components/ui/Waterline.tsx:85` — Splash wash B: design `blur(6px)`; app none. Mid-stop
   `0.042` vs design `0.050` at 35%.
5. `src/components/ui/Waterline.tsx:86` — Splash wash C: design `blur(5px)`; app none. Mid-stop
   `0.0672` vs `0.080` at 36%.
6. `src/components/ui/Waterline.tsx:87` — Splash wash D: design `blur(8px)`; app none. Mid-stop
   `0.0588` vs `0.070` at 36%.
7. `src/components/ui/Waterline.tsx:134` — Standing-Guard wash A: design `blur(6px)`; app none.
   Mid-stop `0.1428` vs `0.170` at 36%.
8. `src/components/ui/Waterline.tsx:135` — Standing-Guard wash B: design `blur(8px)`; app none.
   Mid-stop `0.1092` vs `0.130` at 35%.
9. `src/components/ui/Waterline.tsx:136` — Standing-Guard wash C: design `blur(6px)`; app none.
   Mid-stop `0.126` vs `0.150` at 36%.
10. `src/components/ui/Waterline.tsx:137` — Standing-Guard wash D: design `blur(8px)`; app none.
    Mid-stop `0.0924` vs `0.110` at 35%.
11. `src/components/auth/kit.tsx:129` — Login top glow: design `blur(5px)`; app none. (All three
    stops — 0.4 / 0.12 @ 55% / 0 @ 75% — are reproduced literally, so only the blur is lost.)
12. `src/components/auth/kit.tsx:130` — Login bottom glow: design `blur(8px)`; app none. (Stops
    0.22 / 0 @ 72% reproduced literally.)
13. `src/components/auth/kit.tsx:63` — envelope bloom: design `blur(4px)`; app none. (Stops
    0.4 / 0 @ 74% reproduced literally.)
14. `src/components/auth/kit.tsx:72-76` — envelope ground shadow: design is a flat
    `rgba(0,0,0,0.10)` ellipse with `blur(4px)`; app substitutes a radial `#000 0.14 → #000 0`
    across the same 120 × 12 ellipse — the centre alpha is raised from **0.10 to 0.14** to pay for
    the missing blur.
15. `src/app/(auth)/sign-in.tsx:304` — Login-Typing caret width: design draws a 2.5px bar; the app
    can only tint the system caret (`selectionColor={colors.ink}`), whose width iOS owns.
16. `src/app/(auth)/sign-in.tsx:304` — caret height: design 30px; system caret height is derived
    from the font.
17. `src/app/(auth)/sign-in.tsx:304` — caret border-radius: design `1px`; not settable.
18. `src/app/(auth)/sign-in.tsx:304` — caret `margin-left: 2`: design insets the caret 2px from the
    last glyph; not settable.
19–22. The four Splash washes' inserted mid-stops and the four Standing-Guard ones are counted
    inside rows 3–10 above; the remaining four MISMATCH\* rows in the tables are the per-wash
    "intermediate stops" entries for Splash A–D, which are the same substitution recorded against
    the stop list rather than the filter. No separate app change is available for them.

### Non-mismatch observations worth recording

- **Safe-area origin, all four paper boards.** The brief's convention is `app top = canvas top − 54`,
  and the app honours it exactly — but it measures those tops from `SafeAreaView`, whose top inset
  on a 393 × 852 device is **59**, not 54. So every top-anchored element on Login, Create-Account,
  Auth-Save-Progress and Reminders lands 5px lower in device space than the canvas literal. This is
  systematic, is what the convention asks for, and is not counted as a mismatch — but it is the one
  global offset between the frames and the running app. The Reminders pill is the exception: it is
  bottom-anchored at 50, which is the canvas's own bottom gap, so it lands on device y 744 exactly.
- **Splash paint order.** The canvas draws the laurel mark *between* wash C and wash D, and beneath
  all four stars; the app draws it after every SVG element. No geometry overlaps (wash D spans
  y 620-880, the stars sit at y 140/205/590/700, the mark occupies x 160-232 × y 400-472), so the
  rendered result is identical.
- **Hidden signature squiggle.** Both the canvas and `EnvelopeMark` draw the 40 × 10 signature at
  (102, 76) *before* the envelope front, which covers x 25-175 × y 76-154 — so it is invisible in
  both. The app reproduces the design's own bug faithfully.
- **Standing-Guard washes A and B** end on `rgba(19,19,19,0)` in the design and `#B4AA96 @ 0` in the
  app. CSS interpolates gradients in premultiplied alpha, so a transparent `#131313` and a
  transparent `#B4AA96` produce identical pixels; the app's choice additionally avoids a grey halo
  under RN SVG's interpolation. Recorded as a match.
- **Image assets** (`laurel-mark.webp`, `noise-dark.png`) are referenced by bare filename in the
  frames and are not shipped inside `.uifinal/`, so no byte comparison against
  `assets/images/` was possible.
- **App-only states not drawn by any frame:** the unchecked checkbox, the field focus ring
  (`0 0 0 2px rgba(0,0,0,0.24)`), the optional password field, the placeholder tone on
  Create-Account's two filled fields, the `Message` error/notice slots (four of them), and the
  loading pill labels. None of them render anything in the state the frames draw.
