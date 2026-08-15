# Property audit — SOS (First 90 Seconds) + Relapse

Nine frames, three app files, every declaration compared one at a time.

**Frames (pretty source, read in full):** `.uifinal/pretty/final/Email Login/{Cue-Intro-Modal, SOS-Strength, Cue-Set-Confirmation, Surf-Step-1, Surf-Step-3, Surf-Complete, Relapse-Log, Relapse-Twice, Relapse-Begin}.html`

**App source (read in full):**
- `/Users/admin/Documents/tideline/src/app/urge.tsx` (11 lines — a bare re-export of `UrgeFlow`, no styling)
- `/Users/admin/Documents/tideline/src/components/urge/index.tsx` (2338 lines) — cited below as `urge:NNN`
- `/Users/admin/Documents/tideline/src/app/relapse.tsx` (473 lines) — cited below as `rel:NNN`

## Coordinate rules used throughout

1. Each frame is a `393 × 852` div. Its `top` values include a **54px status bar the app never builds**.
2. Seven of the nine frames draw a **paper sheet** at frame `top:52`, `bottom:0` — an 800pt box. Every child inside that sheet is positioned against the *sheet*, not the frame, so **child tops are compared verbatim**; only the sheet itself carries the −54. Sheet top: canvas `52` → **app-equivalent `−2`** (2pt above where the status bar ends). App writes `marginTop: Math.max(0, insets.top − 2)` (`urge:587`) / `top: insets.top − 2` (`rel:99`).
3. Two frames (Surf-Complete, Relapse-Begin) break the sheet and put content under the safe-area top. Their text tops are frame-absolute, so **app-equivalent = canvas top − 54**. Their *background* layers are frame-absolute with no deduction (the layer's origin is the frame's), which is why the shafts keep raw `−40 / −60 / −40`.
4. **Device caveat, stated once:** the canvas models a 393×852 device with a 54pt bar; a real 393×852 iPhone reports a 59pt top inset. Everything inside the sheet therefore lands 5pt lower on device than on canvas. That is a canvas-vs-hardware fact, not a port defect, and is not counted as a mismatch below. Bottom-anchored elements are unaffected (both sheets end at the screen bottom).

## Verdict tokens

- `match` — the app carries the design's literal.
- `MISMATCH` — the app carries a different value; actionable.
- `MISMATCH*` — the design uses a CSS feature React Native cannot express (`filter: blur()`, `mask-image`, CSS gradient extent keywords). The app substitutes an approximation. Listed separately in Findings; no code change is being recommended, but the numbers differ and the row says so.

Rows are `(element, property)`. Where the design declares nothing for a property, a row appears only if the app declares something (so additions are visible).

---

## 0 · Shared chrome (identical in all nine frames — audited once)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| all 9 | Frame root | width | `393px` | device viewport width (393 on the modelled device) | match |
| all 9 | Frame root | height | `852px` | device viewport height (852) | match |
| all 9 | Frame root | position | `relative` | root `View flex:1` (`urge:582`, `urge:2127`, `rel:91`, `rel:168`) | match |
| all 9 | Frame root | overflow | `hidden` | screen root, nothing to clip | match |
| 7 sheet frames | Frame root | background | `#EDECE7` | `SHEET_EDGE = '#EDECE7'` (`urge:530`, `urge:582`); `'#EDECE7'` (`rel:91`) | match |
| Surf-Complete, Relapse-Begin | Frame root | background | `#F0EFEB` | `'#F0EFEB'` (`urge:2127`, `rel:168`) | match |
| all 9 | Frame root | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | iOS `'System'` for every weight (`theme.ts:163`) | match |
| all 9 | Frame root | -webkit-font-smoothing | `antialiased` | applied on web only (`AppText.tsx:126`) | match |
| all 9 | Frame root | flex-shrink | `0` | n/a (canvas gallery layout) | n/a |
| all 9 | Frame root | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | n/a — canvas device-frame chrome, not an app surface | n/a |
| all 9 | Status bar row | height / padding / z-index | `54px` / `6px 32px 0 46px` / `20` | not built — OS status bar | match (by design) |
| all 9 | Status bar · clock | text / size / weight / letter-spacing / colour | `9:41` / `17px` / `600` / `-0.2px` / `#1D1C1A` | OS-drawn; app sets `StatusBar style="dark"` (`urge:583`, `urge:2128`, `rel:92`, `rel:169`) | match (by design) |
| all 9 | Status bar · signal svg | 4 rects, `19×12` viewBox `0 0 19 12`, rx `0.7`, fill `#1D1C1A` | OS-drawn | match (by design) |
| all 9 | Status bar · wifi svg | 2 paths + circle, `17×12` viewBox `0 0 17 12`, fill `#1D1C1A` | OS-drawn | match (by design) |
| all 9 | Status bar · battery svg | `27×13`, stroke `#1D1C1A` @ `0.35`, fill `#1D1C1A`, cap `#1D1C1A` @ `0.4` | OS-drawn | match (by design) |

### Shared sheet + shared controls (used by Cue-Intro-Modal, SOS-Strength, Cue-Set-Confirmation, Surf-Step-1, Surf-Step-3, Relapse-Log, Relapse-Twice)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| 7 sheet frames | Paper sheet | position | `absolute` | absolute (`rel:95`) / flex child with `marginTop` (`urge:586`) — same box | match |
| 7 sheet frames | Paper sheet | left | `0` | `0` (`rel:97`) / flex fill (`urge:586`) | match |
| 7 sheet frames | Paper sheet | right | `0` | `0` (`rel:98`) / flex fill | match |
| 7 sheet frames | Paper sheet | top | `52` (frame) → app-equivalent `−2` | `insets.top − 2` (`urge:587`, `rel:99`) | match |
| 7 sheet frames | Paper sheet | bottom | `0` | `0` (`rel:100`) / `flex:1` (`urge:586`) | match |
| 7 sheet frames | Paper sheet | border-radius | `24px 24px 0 0` | `borderTopLeftRadius 24`, `borderTopRightRadius 24`, bottom corners unset (`urge:589-590`, `rel:101-102`) | match |
| 7 sheet frames | Paper sheet | background | `#F4F3F0` | `SHEET_PAPER = '#F4F3F0'` (`urge:531`, `urge:588`); `PAPER = '#F4F3F0'` (`rel:41`, `rel:103`) | match |
| 7 sheet frames | Paper sheet | overflow | `hidden` | `'hidden'` (`urge:591`, `rel:104`) | match |
| 6 frames w/ close | Close X | position / right / top | `absolute` / `22` / `24` | `absolute` / `22` / `24` (`urge:606`, `rel:111`) | match |
| 6 frames w/ close | Close X | svg width / height / viewBox | `20` / `20` / `0 0 20 20` | `20` / `20` / `0 0 20 20` (`urge:607`, `rel:112`) | match |
| 6 frames w/ close | Close X | path `d` | `M3 3l14 14M17 3L3 17` | `M3 3l14 14M17 3L3 17` (`urge:608`, `rel:113`) | match |
| 6 frames w/ close | Close X | stroke | `#55534E` | `#55534E` (`urge:608`) / `MUTED = '#55534E'` (`rel:43`, `rel:113`) | match |
| 6 frames w/ close | Close X | stroke-width | `2` | `2` (`urge:608`, `rel:113`) | match |
| 6 frames w/ close | Close X | stroke-linecap | `round` | `round` (`urge:608`, `rel:113`) | match |
| 6 frames w/ close | Close X | z-order | DOM-first inside the sheet (paints under later siblings) | `zIndex: 6` in urge (`urge:606`), none in relapse | match (inert — nothing overlaps at 22/24) |
| 5 frames w/ pill | Primary pill | position / left / right | `absolute` / `24` / `24` | `absolute` / `24` / `24` (`urge:632-634`, `rel:138-139`) | match |
| 5 frames w/ pill | Primary pill | bottom | `88` | `88` (`urge:625` default, `rel:140`) | match |
| 5 frames w/ pill | Primary pill | height | `54` | `54` (`urge:635`, `rel:141`) | match |
| 5 frames w/ pill | Primary pill | border-radius | `27` (all 4 corners) | `27` (`urge:636`, `rel:143`) | match |
| 5 frames w/ pill | Primary pill | background | `#131313` | `SHEET_INK = '#131313'` (`urge:532`, `urge:637`); `'#131313'` (`rel:144`) | match |
| 5 frames w/ pill | Primary pill | display / align-items / justify-content | `flex` / `center` / `center` | flex default / `center` / `center` (`urge:638-639`, `rel:145-146`) | match |
| 5 frames w/ pill | Primary pill label | font-size | `17px` | `17` (`urge:641`, `rel:148`) | match |
| 5 frames w/ pill | Primary pill label | font-weight | `600` | `sans('600')` (`urge:641`, `rel:148`) | match |
| 5 frames w/ pill | Primary pill label | letter-spacing | `0.2px` | `0.2` (`urge:641`, `rel:148`) | match |
| 5 frames w/ pill | Primary pill label | colour | `#FFFFFF` | `'#FFFFFF'` (`urge:641`, `rel:148`) | match |
| 4 frames w/ skip | Skip link | position / left / right / bottom | `absolute` / `0` / `0` / `44` | `absolute` / `0` / `0` / `44` (`urge:652`) | match |
| 4 frames w/ skip | Skip link | text-align | `center` | `alignItems: 'center'` (`urge:652`) | match |
| 4 frames w/ skip | Skip link | font-size / weight / colour | `15px` / `500` / `#8B8882` | `15` / `sans('500')` / `SHEET_SOFT = '#8B8882'` (`urge:535`, `urge:653`) | match |
| 4 frames w/ skip | Skip link | text | `Skip this step` | `Skip this step` (`urge:653`) | match |
| all pressables | any pressable | pressed-state transform | `scale(0.99)` (declared on Cue-Intro-Modal's pill only) | `withTiming(0.96)` on every `PressScale` (`press-scale.tsx:25`) | **MISMATCH** |

---

## 1 · Cue-Intro-Modal → `IntroPage` (`urge:761-796`)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Cue-Intro-Modal | Halo wash | position / left / top | `absolute` / `96` / `150` | `absolute` / `96` / `150` (`urge:765`) | match |
| Cue-Intro-Modal | Halo wash | width / height | `200` / `280` | `200` / `280` (`urge:765`) | match |
| Cue-Intro-Modal | Halo wash | border-radius | `50%` | `Ellipse rx=100 ry=140` (`urge:687`) | match |
| Cue-Intro-Modal | Halo wash | gradient type | `radial-gradient(closest-side, …)` | `RadialGradient cx 50% cy 50% rx 50% ry 50%` (`urge:682`) | match |
| Cue-Intro-Modal | Halo wash | stop 1 | `rgba(220,222,216,0.28)` @ `0` | `rgb(220,222,216)` @ opacity `0.28`, offset `0` (`urge:683`, `urge:765`) | match |
| Cue-Intro-Modal | Halo wash | stop 2 | `rgba(220,222,216,0)` @ `75%` | opacity `0` @ offset `0.75` (`urge:684`, `stop={0.75}` `urge:765`) | match |
| Cue-Intro-Modal | Halo wash | filter | `blur(8px)` | none — falloff carries it | MISMATCH* |
| Cue-Intro-Modal | Art box | position / left / top | `absolute` / `76` / `170` | `absolute` / `76` / `170` (`urge:710`) | match |
| Cue-Intro-Modal | Art box | width / height | `240` / `250` | `240` / `250` (`urge:711`) | match |
| Cue-Intro-Modal | Art inner | inset | `0` | collapsed into the 240×250 box (`urge:711`) | match |
| Cue-Intro-Modal | Art inner | overflow | `hidden` | not set → `visible` (`urge:711`) | **MISMATCH** (inert — no child exceeds 240×250) |
| Cue-Intro-Modal | Art · warm wash | left / top | `58` / `64` | `58` / `64` (`urge:712`) | match |
| Cue-Intro-Modal | Art · warm wash | width / height | `124` / `124` | `124` / `124` (`urge:712`) | match |
| Cue-Intro-Modal | Art · warm wash | border-radius | `50%` | `Ellipse rx=62 ry=62` (`urge:687`) | match |
| Cue-Intro-Modal | Art · warm wash | stop 1 | `rgba(226,186,120,0.45)` @ `0` | `rgb(226,186,120)` @ `0.45`, offset `0` (`urge:712`) | match |
| Cue-Intro-Modal | Art · warm wash | stop 2 | `rgba(226,186,120,0)` @ `74%` | opacity `0` @ `0.74` (default `stop` `urge:676`) | match |
| Cue-Intro-Modal | Art · warm wash | filter | `blur(4px)` | none | MISMATCH* |
| Cue-Intro-Modal | Art · moon shadow | left / top / width / height | `152` / `22` / `42` / `42` | `152` / `22` / `42` / `42` (`urge:713`) | match |
| Cue-Intro-Modal | Art · moon shadow | border-radius | `50%` | `21` (`urge:713`) | match |
| Cue-Intro-Modal | Art · moon shadow | background | `#DCDED8` | `'#DCDED8'` (`urge:713`) | match |
| Cue-Intro-Modal | Art · moon | left / top / width / height | `142` / `14` / `42` / `42` | `142` / `14` / `42` / `42` (`urge:714`) | match |
| Cue-Intro-Modal | Art · moon | border-radius | `50%` | `21` (`urge:714`) | match |
| Cue-Intro-Modal | Art · moon | background | `#F4F3F0` | `'#F4F3F0'` (`urge:714`) | match |
| Cue-Intro-Modal | Art · bench seat | left / top / width / height | `70` / `152` / `100` / `32` | `70` / `152` / `100` / `32` (`urge:718-721`) | match |
| Cue-Intro-Modal | Art · bench seat | border-radius | `10px 10px 4px 4px` | TL `10`, TR `10`, BL `4`, BR `4` (`urge:722-725`) | match |
| Cue-Intro-Modal | Art · bench seat | background | `#E0DFDA` | `'#E0DFDA'` (`urge:726`) | match |
| Cue-Intro-Modal | Art · seat back | left / top / width / height | `76` / `144` / `50` / `16` | `76` / `144` / `50` / `16` (`urge:729`) | match |
| Cue-Intro-Modal | Art · seat back | border-radius / background | `8` / `#C6C5C0` | `8` / `'#C6C5C0'` (`urge:729`) | match |
| Cue-Intro-Modal | Art · leg L | left / top / width / height | `64` / `152` / `6` / `54` | `64` / `152` / `6` / `54` (`urge:730`) | match |
| Cue-Intro-Modal | Art · leg L | border-radius / background | `3` / `#D6D5D0` | `3` / `'#D6D5D0'` (`urge:730`) | match |
| Cue-Intro-Modal | Art · leg R | left / top / width / height | `170` / `152` / `6` / `54` | `170` / `152` / `6` / `54` (`urge:731`) | match |
| Cue-Intro-Modal | Art · leg R | border-radius / background | `3` / `#D6D5D0` | `3` / `'#D6D5D0'` (`urge:731`) | match |
| Cue-Intro-Modal | Art · ground shadow | left / top / width / height | `58` / `202` / `130` / `14` | `58` / `202` / `130` / `14` (`urge:732`) | match |
| Cue-Intro-Modal | Art · ground shadow | border-radius | `50%` | `Ellipse rx=65 ry=7` | match |
| Cue-Intro-Modal | Art · ground shadow | background | solid `rgba(0,0,0,0.09)` | radial ramp `rgb(0,0,0)` `0.09` @ `0` → `0` @ `1.0` (`urge:732`) | MISMATCH* |
| Cue-Intro-Modal | Art · ground shadow | filter | `blur(5px)` | none | MISMATCH* |
| Cue-Intro-Modal | Art · seat slat | left / top / width / height | `78` / `160` / `84` / `8` | `78` / `160` / `84` / `8` (`urge:733`) | match |
| Cue-Intro-Modal | Art · seat slat | border-radius / background | `4` / `#D6D5D0` | `4` / `'#D6D5D0'` (`urge:733`) | match |
| Cue-Intro-Modal | Art · disc button | left / top / width / height | `186` / `120` / `38` / `38` | `186` / `120` / `38` / `38` (`urge:736-739`) | match |
| Cue-Intro-Modal | Art · disc button | border-radius | `50%` | `19` (`urge:740`) | match |
| Cue-Intro-Modal | Art · disc button | background | `#F7F6F2` | `'#F7F6F2'` (`urge:741`) | match |
| Cue-Intro-Modal | Art · disc button | box-shadow | `0 0 0 1px rgba(0,0,0,0.08), 0 6px 14px rgba(40,38,32,0.14)` | `'0 0 0 1px rgba(0,0,0,0.08), 0 6px 14px rgba(40,38,32,0.14)'` (`urge:742`) | match |
| Cue-Intro-Modal | Art · disc button | align-items / justify-content | `center` / `center` | `center` / `center` (`urge:743-744`) | match |
| Cue-Intro-Modal | Art · disc glyph | svg width / height / viewBox / fill | `22` / `22` / `0 0 24 24` / `none` | `22` / `22` / `0 0 24 24` / `none` (`urge:747`) | match |
| Cue-Intro-Modal | Art · disc glyph | circle cx / cy / r | `12` / `12` / `9` | `12` / `12` / `9` (`urge:748`) | match |
| Cue-Intro-Modal | Art · disc glyph | circle stroke / stroke-width | `#3A3934` / `1.8` | `'#3A3934'` / `1.8` (`urge:748`) | match |
| Cue-Intro-Modal | Art · disc glyph | path `d` | `M12 12V6.5A5.5 5.5 0 0 1 17.5 12z` | `M12 12V6.5A5.5 5.5 0 0 1 17.5 12z` (`urge:749`) | match |
| Cue-Intro-Modal | Art · disc glyph | path fill | `#3A3934` | `'#3A3934'` (`urge:749`) | match |
| Cue-Intro-Modal | Sky dot A | left / top / width / height | `88` / `112` / `2` / `2` | `88` / `112` / `2` / `2` (`urge:767`, `urge:758`) | match |
| Cue-Intro-Modal | Sky dot A | border-radius / background | `50%` / `rgba(200,225,235,0.4)` | `1` / `rgba(200,225,235,0.4)` (`urge:758`) | match |
| Cue-Intro-Modal | Sky dot B | left / top / background | `296` / `88` / `rgba(200,225,235,0.3)` | `296` / `88` / `0.3` (`urge:768`) | match |
| Cue-Intro-Modal | Sky dot C | left / top / background | `250` / `180` / `rgba(200,225,235,0.25)` | `250` / `180` / `0.25` (`urge:769`) | match |
| Cue-Intro-Modal | Sky dots | z-order | after the art box | rendered after `<IntroArt/>` (`urge:766-769`) | match |
| Cue-Intro-Modal | Headline | position / left / right / top | `absolute` / `0` / `0` / `500` | `absolute` / `0` / `0` / `500` (`urge:770`) | match |
| Cue-Intro-Modal | Headline | text-align | `center` | `center` prop (`urge:770`) | match |
| Cue-Intro-Modal | Headline | font-size | `22px` | `22` (`urge:770`) | match |
| Cue-Intro-Modal | Headline | font-weight | `500` | `sans('500')` (`urge:770`) | match |
| Cue-Intro-Modal | Headline | letter-spacing | `0.1px` | `0.1` (`urge:770`) | match |
| Cue-Intro-Modal | Headline | line-height | not declared (`normal`) | none — variant leading dropped (`AppText.tsx:139`) | match |
| Cue-Intro-Modal | Headline | colour | `#1D1C1A` | `SHEET_TEXT = '#1D1C1A'` (`urge:533`) | match |
| Cue-Intro-Modal | Headline | max lines | none | none | match |
| Cue-Intro-Modal | Headline | text | `The First 90 Seconds` | `The First 90 Seconds` (`urge:771`) | match |
| Cue-Intro-Modal | Sub | left / right / top | `30` / `30` / `552` | `30` / `30` / `552` (`urge:773`) | match |
| Cue-Intro-Modal | Sub | text-align | `center` | `center` prop (`urge:773`) | match |
| Cue-Intro-Modal | Sub | font-size | `15.5px` | `15.5` (`urge:773`) | match |
| Cue-Intro-Modal | Sub | font-weight | `400` | `sans('400')` (`urge:773`) | match |
| Cue-Intro-Modal | Sub | line-height | `23px` | `23` (`urge:773`) | match |
| Cue-Intro-Modal | Sub | letter-spacing | not declared (`0`) | `0` — variant `-0.1` dropped (`AppText.tsx:138`) | match |
| Cue-Intro-Modal | Sub | colour | `#55534E` | `SHEET_MUTED = '#55534E'` (`urge:534`) | match |
| Cue-Intro-Modal | Sub | text-wrap | `pretty` | web only (`AppText.tsx:128`); native n/a | match |
| Cue-Intro-Modal | Sub | text | `A universal interrupt for the moment the wave hits. Six small moves — decide nothing until it passes.` (`&mdash;` = U+2014) | identical, U+2014 verified (`urge:774`) | match |
| Cue-Intro-Modal | Pill | position / left / right | `absolute` / `24` / `24` | `absolute` / `24` / `24` (`urge:782-784`) | match |
| Cue-Intro-Modal | Pill | top | `692` in an 800pt sheet → `bottom 56` | `bottom: 56` (`urge:785`) | match |
| Cue-Intro-Modal | Pill | height | `52` | `52` (`urge:786`) | match |
| Cue-Intro-Modal | Pill | border-radius | `26` | `26` (`urge:787`) | match |
| Cue-Intro-Modal | Pill | background | `#131313` | `SHEET_INK` (`urge:788`) | match |
| Cue-Intro-Modal | Pill | align-items / justify-content | `center` / `center` | `center` / `center` (`urge:789-790`) | match |
| Cue-Intro-Modal | Pill | pressed transform | `scale(0.99)` | `scale(0.96)` (`press-scale.tsx:25`) | **MISMATCH** |
| Cue-Intro-Modal | Pill label | font-size | `17.5px` | `17.5` (`urge:792`) | match |
| Cue-Intro-Modal | Pill label | font-weight | `600` | `sans('600')` (`urge:792`) | match |
| Cue-Intro-Modal | Pill label | letter-spacing | `0.3px` | `0.3` (`urge:792`) | match |
| Cue-Intro-Modal | Pill label | colour | `#FFFFFF` | `'#FFFFFF'` (`urge:792`) | match |
| Cue-Intro-Modal | Pill label | text | `Start the interrupt` | `Start the interrupt` (`urge:792`) | match |
| Cue-Intro-Modal | — | progress pager | not drawn | not rendered (`IntroPage` has no `StepPager`) | match |

---

## 2 · SOS-Strength → `StrengthPage` (`urge:800-849`)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| SOS-Strength | Headline | position / left / right / top | `absolute` / `44` / `44` / `150` | `absolute` / `44` / `44` / `150` (`urge:804`) | match |
| SOS-Strength | Headline | text-align | `center` | `center` prop (`urge:804`) | match |
| SOS-Strength | Headline | font-size | `23px` | `23` (`urge:804`) | match |
| SOS-Strength | Headline | font-weight | `500` | `sans('500')` (`urge:804`) | match |
| SOS-Strength | Headline | line-height | `31px` | `31` (`urge:804`) | match |
| SOS-Strength | Headline | letter-spacing | `0.1px` | `0.1` (`urge:804`) | match |
| SOS-Strength | Headline | colour | `#1D1C1A` | `SHEET_TEXT` (`urge:804`) | match |
| SOS-Strength | Headline | text-wrap | `balance` | web only for hero/display/title; body variant is `pretty` (`AppText.tsx:128`) | match (native n/a) |
| SOS-Strength | Headline | text | `How strong is it right now?` | `How strong is it right now?` (`urge:805`) | match |
| SOS-Strength | Sub | left / right / top | `44` / `44` / `210` | `44` / `44` / `210` (`urge:807`) | match |
| SOS-Strength | Sub | font-size / weight / line-height | `15px` / `400` / `22px` | `15` / `sans('400')` / `22` (`urge:807`) | match |
| SOS-Strength | Sub | colour / align | `#55534E` / `center` | `SHEET_MUTED` / `center` (`urge:807`) | match |
| SOS-Strength | Sub | text | `Just a read, not a test — it helps you watch it pass.` (U+2014) | identical, U+2014 verified (`urge:808`) | match |
| SOS-Strength | Dot row | position / left / right / top | `absolute` / `36` / `36` / `330` | `absolute` / `36` / `36` / `330` (`urge:810`) | match |
| SOS-Strength | Dot row | display / justify-content | `flex` / `space-between` | `row` / `space-between` (`urge:810`) | match |
| SOS-Strength | Dot row | member count | 5 | `INTENSITY_BANDS` → 5 (`IntensityBands.tsx:14-20`) | match |
| SOS-Strength | Dot 1/2/3/5 (off) | width / height | `48` / `48` | `48` / `48` (`urge:822-823`) | match |
| SOS-Strength | Dot 1/2/3/5 (off) | border-radius | `50%` | `24` (`urge:824`) | match |
| SOS-Strength | Dot 1/2/3/5 (off) | background | `#FFFFFF` | `'#FFFFFF'` (`urge:825`) | match |
| SOS-Strength | Dot 1/2/3/5 (off) | box-shadow | `inset 0 0 0 1.5px rgba(0,0,0,0.12)` | `'inset 0 0 0 1.5px rgba(0,0,0,0.12)'` (`urge:826`) | match |
| SOS-Strength | Dot 4 (on) | which index is drawn on | 4th of 5 (index 3) | default `band = 3` (`urge:2211`) | match |
| SOS-Strength | Dot 4 (on) | background | `#131313` | `SHEET_INK` (`urge:825`) | match |
| SOS-Strength | Dot 4 (on) | box-shadow | `0 0 0 2px #F4F3F0, 0 0 0 4px #131313` | `'0 0 0 2px #F4F3F0, 0 0 0 4px #131313'` (`urge:826`) | match |
| SOS-Strength | Dot 4 (on) | align-items / justify-content | `center` / `center` | `center` / `center` (`urge:827-828`) | match |
| SOS-Strength | Dot 4 · inner | width / height | `11` / `11` | `11` / `11` (`urge:830`) | match |
| SOS-Strength | Dot 4 · inner | border-radius | `50%` | `5.5` (`urge:830`) | match |
| SOS-Strength | Dot 4 · inner | background | `#F4F3F0` | `SHEET_PAPER` (`urge:830`) | match |
| SOS-Strength | Scale row | left / right / top | `36` / `36` / `394` | `36` / `36` / `394` (`urge:835`) | match |
| SOS-Strength | Scale row | display / justify-content | `flex` / `space-between` | `row` / `space-between` (`urge:835`) | match |
| SOS-Strength | Scale row | font-size / weight / colour | `12.5px` / `500` / `#8B8882` | `12.5` / `sans('500')` / `SHEET_SOFT` (`urge:836-837`) | match |
| SOS-Strength | Scale label L | text | `Faint` | `Faint` (`urge:836`) | match |
| SOS-Strength | Scale label R | text | `Overwhelming` | `Overwhelming` (`urge:837`) | match |
| SOS-Strength | Band label | left / right / top / align | `0` / `0` / `452` / `center` | `0` / `0` / `452` / `center` (`urge:839`) | match |
| SOS-Strength | Band label | font-size / weight / colour | `19px` / `600` / `#1D1C1A` | `19` / `sans('600')` / `SHEET_TEXT` (`urge:839`) | match |
| SOS-Strength | Band label | letter-spacing | not declared (`0`) | dropped (`AppText.tsx:138`) | match |
| SOS-Strength | Band label | text | `Intense` | `INTENSITY_BANDS[3].label` = `Intense` (`IntensityBands.tsx:18`) | match |
| SOS-Strength | Band note | left / right / top / align | `0` / `0` / `482` / `center` | `0` / `0` / `482` / `center` (`urge:842`) | match |
| SOS-Strength | Band note | font-size / weight / colour | `13.5px` / `400` / `#8B8882` | `13.5` / `sans('400')` / `SHEET_SOFT` (`urge:842`) | match |
| SOS-Strength | Band note | text | `Hard to resist` | `INTENSITY_BANDS[3].note` = `Hard to resist` (`IntensityBands.tsx:18`) | match |
| SOS-Strength | Pill | geometry / colour / label | see shared table — `bottom 88`, `h 54`, `r 27`, `#131313`, `Continue` 17/600/0.2/#FFFFFF | `SheetPrimary label="Continue"` (`urge:845`) | match |
| SOS-Strength | Skip | geometry / type / text | see shared table — `bottom 44`, 15/500/#8B8882, `Skip this step` | `SheetSkip` (`urge:846`) | match |
| SOS-Strength | — | progress pager | not drawn | not rendered | match |
| SOS-Strength | — | art layer | none | none | match |

---

## 3 · Cue-Set-Confirmation → `MovePage index=0` + `ScreenStepArt` (`urge:1218-1248`, `urge:2314-2316`)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Cue-Set-Confirmation | Pager row | position / left / right / top | `absolute` / `0` / `0` / `28` | `absolute` / `0` / `0` / `28` (`urge:617`) | match |
| Cue-Set-Confirmation | Pager row | display / justify-content / align-items / gap | `flex` / `center` / `center` / `7` | `row` / `center` / `center` / `7` (`urge:617`) | match |
| Cue-Set-Confirmation | Pager dot 1 (active) | width / height / border-radius | `18` / `6` / `3` | `18` / `6` / `3` (`urge:619`) | match |
| Cue-Set-Confirmation | Pager dot 1 (active) | background | `#131313` | `SHEET_INK` (`urge:619`) | match |
| Cue-Set-Confirmation | Pager dots 2,3 | width / height / border-radius | `6` / `6` / `3` | `6` / `6` / `3` (`urge:619`) | match |
| Cue-Set-Confirmation | Pager dots 2,3 | background | `rgba(19,19,19,0.18)` | `'rgba(19,19,19,0.18)'` (`urge:619`) | match |
| Cue-Set-Confirmation | Pager | which index is active | 1st of 3 | `index={0}` (`urge:2315`) | match |
| Cue-Set-Confirmation | Art box | position / left / top / width / height | `absolute` / `76` / `180` / `240` / `200` | `absolute` / `76` / `180` / `240` / `200` (`urge:1333`) | match |
| Cue-Set-Confirmation | Art inner | overflow | `hidden` | not set → `visible` (`urge:1333`) | **MISMATCH** (inert — no child exceeds 240×200) |
| Cue-Set-Confirmation | Art · warm wash | left / top / width / height | `112` / `56` / `130` / `130` | `112` / `56` / `130` / `130` (`urge:1221`) | match |
| Cue-Set-Confirmation | Art · warm wash | stop 1 / stop 2 | `rgba(226,186,120,0.4)` @ `0` / `rgba(226,186,120,0)` @ `74%` | `rgb(226,186,120)` `0.4` @ `0` / `0` @ `0.74` (`urge:1221`) | match |
| Cue-Set-Confirmation | Art · warm wash | border-radius / filter | `50%` / `blur(4px)` | `Ellipse rx/ry 65` / none | MISMATCH* (filter) |
| Cue-Set-Confirmation | Art · moon shadow | left / top / width / height / radius / background | `20` / `14` / `34` / `34` / `50%` / `#DCDED8` | `20` / `14` / `34` / `34` / `17` / `'#DCDED8'` (`urge:1222`) | match |
| Cue-Set-Confirmation | Art · moon | left / top / width / height / radius / background | `12` / `8` / `34` / `34` / `50%` / `#F4F3F0` | `12` / `8` / `34` / `34` / `17` / `'#F4F3F0'` (`urge:1223`) | match |
| Cue-Set-Confirmation | Art · pillow | left / top / width / height / radius / background | `30` / `62` / `34` / `22` / `8` / `#C6C5C0` | `30` / `62` / `34` / `22` / `8` / `'#C6C5C0'` (`urge:1224`) | match |
| Cue-Set-Confirmation | Art · post | left / top / width / height / radius / background | `44` / `84` / `6` / `88` / `3` / `#B4B1AB` | `44` / `84` / `6` / `88` / `3` / `'#B4B1AB'` (`urge:1225`) | match |
| Cue-Set-Confirmation | Art · light pool | left / top / width / height | `24` / `150` / `70` / `24` | `24` / `150` / `70` / `24` (`urge:1226`) | match |
| Cue-Set-Confirmation | Art · light pool | background | solid `rgba(226,186,120,0.22)`, `border-radius 50%` | radial ramp `rgb(226,186,120)` `0.22` @ `0` → `0` @ `1.0` (`urge:1226`) | MISMATCH* |
| Cue-Set-Confirmation | Art · light pool | filter | `blur(5px)` | none | MISMATCH* |
| Cue-Set-Confirmation | Art · phone body | left / top / width / height | `128` / `124` / `92` / `32` | `128` / `124` / `92` / `32` (`urge:1230-1233`) | match |
| Cue-Set-Confirmation | Art · phone body | border-radius | `10px 10px 4px 4px` | TL `10` TR `10` BL `4` BR `4` (`urge:1234-1237`) | match |
| Cue-Set-Confirmation | Art · phone body | background | `#E0DFDA` | `'#E0DFDA'` (`urge:1238`) | match |
| Cue-Set-Confirmation | Art · phone nub | left / top / width / height / radius / background | `166` / `136` / `16` / `5` / `3` / `#C6C5C0` | identical (`urge:1241`) | match |
| Cue-Set-Confirmation | Art · leg L | left / top / width / height / radius / background | `134` / `156` / `6` / `22` / `3` / `#D6D5D0` | identical (`urge:1242`) | match |
| Cue-Set-Confirmation | Art · leg R | left / top / width / height / radius / background | `208` / `156` / `6` / `22` / `3` / `#D6D5D0` | identical (`urge:1243`) | match |
| Cue-Set-Confirmation | Art · screen bar | left / top / width / height / radius / background | `146` / `110` / `54` / `12` / `6` / `#3A3934` | identical (`urge:1244`) | match |
| Cue-Set-Confirmation | Art · camera dot | left / top / width / height / radius / background | `188` / `113` / `4` / `4` / `50%` / `#8B8882` | `188` / `113` / `4` / `4` / `2` / `'#8B8882'` (`urge:1245`) | match |
| Cue-Set-Confirmation | Art | paint order | warm, moon-shadow, moon, pillow, post, pool, phone, nub, legL, legR, screen bar, camera dot | identical order (`urge:1221-1245`) | match |
| Cue-Set-Confirmation | Headline | left / right / top / align | `0` / `0` / `398` / `center` | `0` / `0` / `398` / `center` (`urge:1336`) | match |
| Cue-Set-Confirmation | Headline | font-size / weight / letter-spacing / colour | `23px` / `500` / `0.1px` / `#1D1C1A` | `23` / `sans('500')` / `0.1` / `SHEET_TEXT` (`urge:1336`) | match |
| Cue-Set-Confirmation | Headline | line-height | not declared | none — dropped (`AppText.tsx:139`) | match |
| Cue-Set-Confirmation | Headline | text | `Phone down, now.` | `SCREEN_STEP[place].title` = `Phone down, now.` for all 5 places (`urge:559-565`) | match |
| Cue-Set-Confirmation | Body | left / right / top / align | `44` / `44` / `444` / `center` | `44` / `44` / `444` / `center` (`urge:1339`) | match |
| Cue-Set-Confirmation | Body | font-size / weight / line-height / colour | `15.5px` / `400` / `23px` / `#55534E` | `15.5` / `sans('400')` / `23` / `SHEET_MUTED` (`urge:1339`) | match |
| Cue-Set-Confirmation | Body | text-wrap | `pretty` | web only | match (native n/a) |
| Cue-Set-Confirmation | Body | text | `Lock the screen. Face down, across the room — out of reach, not in your pocket.` | identical for `private`/`public`/`work`/`out` (`urge:560,562,563,564`); `bed` swaps the tail to `not under the covers` (`urge:561`) — an app-only branch the frame does not draw | match (drawn branch) |
| Cue-Set-Confirmation | Pill | geometry / colour | `bottom 88`, `h 54`, `r 27`, `#131313` | `SheetPrimary` (`urge:1342`) | match |
| Cue-Set-Confirmation | Pill label | text | `Done — next` (U+2014) | `Done — next`, U+2014 verified (`urge:1342`) | match |
| Cue-Set-Confirmation | Skip | geometry / text | `bottom 44`, 15/500/#8B8882, `Skip this step` | `SheetSkip` (`urge:1343`) | match |
| Cue-Set-Confirmation | Close X | present | yes, `right 22 top 24` | `SheetClose` (`urge:1331`) | match |

---

## 4 · Surf-Step-1 → `MovePage index=1` + `MoveStepArt` (`urge:1251-1288`, `urge:2317`)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Surf-Step-1 | Pager row | left / right / top / gap / justify / align | `0` / `0` / `28` / `7` / `center` / `center` | identical (`urge:617`) | match |
| Surf-Step-1 | Pager | which index is active | 2nd of 3 (`18×6` in the middle) | `index={1}` (`urge:2317`) | match |
| Surf-Step-1 | Pager dot 1,3 | width / height / radius / background | `6` / `6` / `3` / `rgba(19,19,19,0.18)` | identical (`urge:619`) | match |
| Surf-Step-1 | Pager dot 2 | width / height / radius / background | `18` / `6` / `3` / `#131313` | identical (`urge:619`) | match |
| Surf-Step-1 | Art box | left / top / width / height | `76` / `180` / `240` / `200` | `76` / `180` / `240` / `200` (`urge:1333`) | match |
| Surf-Step-1 | Art inner | overflow | `hidden` | not set → `visible` (`urge:1333`) | **MISMATCH** (inert) |
| Surf-Step-1 | Art · warm wash | left / top / width / height | `50` / `44` / `120` / `120` | `50` / `44` / `120` / `120` (`urge:1254`) | match |
| Surf-Step-1 | Art · warm wash | stop 1 / stop 2 | `rgba(226,186,120,0.4)` @ `0` / `rgba(226,186,120,0)` @ `74%` | `0.4` @ `0` / `0` @ `0.74` (`urge:1254`) | match |
| Surf-Step-1 | Art · warm wash | filter | `blur(4px)` | none | MISMATCH* |
| Surf-Step-1 | Art · moon shadow | left / top / w / h / radius / background | `20` / `14` / `34` / `34` / `50%` / `#DCDED8` | `20` / `14` / `34` / `34` / `17` / `'#DCDED8'` (`urge:1255`) | match |
| Surf-Step-1 | Art · moon | left / top / w / h / radius / background | `12` / `8` / `34` / `34` / `50%` / `#F4F3F0` | `12` / `8` / `34` / `34` / `17` / `'#F4F3F0'` (`urge:1256`) | match |
| Surf-Step-1 | Art · bed base | left / top / w / h | `24` / `120` / `96` / `30` | `24` / `120` / `96` / `30` (`urge:1259-1263`) | match |
| Surf-Step-1 | Art · bed base | border-radius | `10px 10px 4px 4px` | TL `10` TR `10` BL `4` BR `4` (`urge:1264-1267`) | match |
| Surf-Step-1 | Art · bed base | background | `#E0DFDA` | `'#E0DFDA'` (`urge:1268`) | match |
| Surf-Step-1 | Art · pillow | left / top / w / h / radius / background | `30` / `112` / `44` / `15` / `8` / `#C6C5C0` | identical (`urge:1271`) | match |
| Surf-Step-1 | Art · leg L | left / top / w / h / radius / background | `18` / `120` / `6` / `52` / `3` / `#D6D5D0` | identical (`urge:1272`) | match |
| Surf-Step-1 | Art · leg R | left / top / w / h / radius / background | `118` / `120` / `6` / `52` / `3` / `#D6D5D0` | identical (`urge:1273`) | match |
| Surf-Step-1 | Art · door frame | left / top / w / h / radius / background | `168` / `40` / `52` / `138` / `8` / `#E4E3DE` | identical (`urge:1274`) | match |
| Surf-Step-1 | Art · door light | left / top / w / h / radius | `174` / `46` / `34` / `126` / `5` | `174` / `46` / `34` / `126` / `5` (`urge:1275`) | match |
| Surf-Step-1 | Art · door light | background gradient angle | `180deg` | `LinearGradient` default start `{0.5,0}` → end `{0.5,1}` = 180deg (`urge:1276`) | match |
| Surf-Step-1 | Art · door light | gradient stops | `#F7F6F2` @ `0` → `#EDECE7` @ `100%` | `['#F7F6F2', '#EDECE7']`, no `locations` = 0/1 (`urge:1276`) | match |
| Surf-Step-1 | Art · door light | overflow | implicit (radius clips) | `overflow: 'hidden'` (`urge:1275`) | match |
| Surf-Step-1 | Art · light pool | left / top / w / h | `150` / `150` / `70` / `26` | `150` / `150` / `70` / `26` (`urge:1278`) | match |
| Surf-Step-1 | Art · light pool | background | solid `rgba(226,186,120,0.22)`, radius `50%` | radial ramp `0.22` @ `0` → `0` @ `1.0` (`urge:1278`) | MISMATCH* |
| Surf-Step-1 | Art · light pool | filter | `blur(5px)` | none | MISMATCH* |
| Surf-Step-1 | Art · figure | left / top / w / h / radius / background | `136` / `96` / `10` / `22` / `5` / `#B4B1AB` | identical (`urge:1279`) | match |
| Surf-Step-1 | Art · shadow A | left / top / w / h | `12` / `174` / `116` / `14` | `12` / `174` / `116` / `14` (`urge:1280`) | match |
| Surf-Step-1 | Art · shadow A | background / filter | solid `rgba(0,0,0,0.10)`, radius `50%` / `blur(5px)` | radial ramp `0.1` → `0` @ `1.0`, no blur (`urge:1280`) | MISMATCH* |
| Surf-Step-1 | Art · shadow B | left / top / w / h | `160` / `180` / `66` / `12` | `160` / `180` / `66` / `12` (`urge:1281`) | match |
| Surf-Step-1 | Art · shadow B | background / filter | solid `rgba(0,0,0,0.08)`, radius `50%` / `blur(4px)` | radial ramp `0.08` → `0` @ `1.0`, no blur (`urge:1281`) | MISMATCH* |
| Surf-Step-1 | Art · duvet | left / top / w / h / radius / background | `28` / `128` / `88` / `8` / `4` / `#D6D5D0` | identical (`urge:1282`) | match |
| Surf-Step-1 | Art · floor mark | left / top / w / h / radius / background | `96` / `186` / `56` / `9` / `5` / `#E4E3DE` | identical (`urge:1283`) | match |
| Surf-Step-1 | Art · sky dot A | left / top / w / h / radius / background | `216` / `20` / `2` / `2` / `50%` / `rgba(200,225,235,0.4)` | `216` / `20` / `2` / `2` / `1` / `0.4` (`urge:1284`, `urge:758`) | match |
| Surf-Step-1 | Art · sky dot B | left / top / background | `6` / `52` / `rgba(200,225,235,0.3)` | `6` / `52` / `0.3` (`urge:1285`) | match |
| Surf-Step-1 | Art | paint order | warm, moon-shadow, moon, base, pillow, legL, legR, frame, light, pool, figure, shadowA, shadowB, duvet, floor, dotA, dotB (17) | identical 17 in the same order (`urge:1254-1285`) | match |
| Surf-Step-1 | Headline | left / right / top / align | `0` / `0` / `398` / `center` | identical (`urge:1336`) | match |
| Surf-Step-1 | Headline | font-size / weight / letter-spacing / colour | `23px` / `500` / `0.1px` / `#1D1C1A` | identical (`urge:1336`) | match |
| Surf-Step-1 | Headline | text | `Get out of bed.` | `MOVE_STEP.bed.title` = `Get out of bed.` (`urge:569`); default `place='private'` renders `Change the room.` (`urge:568`) — the frame draws the `bed` branch | match (drawn branch) |
| Surf-Step-1 | Body | left / right / top / align | `44` / `44` / `444` / `center` | identical (`urge:1339`) | match |
| Surf-Step-1 | Body | font-size / weight / line-height / colour | `15.5px` / `400` / `23px` / `#55534E` | identical (`urge:1339`) | match |
| Surf-Step-1 | Body | text | `Change the room and the wave loses its grip. Stand up, move somewhere with light.` | `MOVE_STEP.bed.body`, character-identical (`urge:569`) | match |
| Surf-Step-1 | Pill | geometry / colour / label | `bottom 88`, `h 54`, `r 27`, `#131313`, `Done — next` | `SheetPrimary label="Done — next"` (`urge:1342`) | match |
| Surf-Step-1 | Skip | geometry / text | `bottom 44`, 15/500/#8B8882, `Skip this step` | `SheetSkip` (`urge:1343`) | match |
| Surf-Step-1 | Close X | present / position | yes / `right 22 top 24` | `SheetClose` (`urge:1331`) | match |

---

## 5 · Surf-Step-3 → `MovePage index=2` + `ColdStepArt` (`urge:1291-1326`, `urge:2318-2327`)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Surf-Step-3 | Pager | which index is active | 3rd of 3 | `index={2}` (`urge:2320`) | match |
| Surf-Step-3 | Pager dot 1,2 | width / height / radius / background | `6` / `6` / `3` / `rgba(19,19,19,0.18)` | identical (`urge:619`) | match |
| Surf-Step-3 | Pager dot 3 | width / height / radius / background | `18` / `6` / `3` / `#131313` | identical (`urge:619`) | match |
| Surf-Step-3 | Art box | left / top / width / height | `76` / `180` / `240` / `200` | identical (`urge:1333`) | match |
| Surf-Step-3 | Art inner | overflow | `hidden` | not set → `visible` (`urge:1333`) | **MISMATCH** (inert) |
| Surf-Step-3 | Art · cool wash | left / top / w / h | `56` / `30` / `130` / `130` | `56` / `30` / `130` / `130` (`urge:1294`) | match |
| Surf-Step-3 | Art · cool wash | stop 1 / stop 2 | `rgba(150,190,210,0.3)` @ `0` / `rgba(150,190,210,0)` @ `74%` | `rgb(150,190,210)` `0.3` @ `0` / `0` @ `0.74` (`urge:1294`) | match |
| Surf-Step-3 | Art · cool wash | filter | `blur(4px)` | none | MISMATCH* |
| Surf-Step-3 | Art · tap body | left / top / w / h / radius / background | `96` / `34` / `56` / `14` / `7` / `#C6C5C0` | identical (`urge:1295`) | match |
| Surf-Step-3 | Art · tap neck | left / top / w / h / radius / background | `140` / `44` / `12` / `26` / `4` / `#B4B1AB` | identical (`urge:1296`) | match |
| Surf-Step-3 | Art · water column | left / top / w / h / radius / background | `142` / `70` / `8` / `64` / `4` / `#E4E9F1` | identical (`urge:1297`) | match |
| Surf-Step-3 | Art · droplet | left / top / w / h / radius / background | `139` / `130` / `14` / `14` / `50%` / `#E4E9F1` | `139` / `130` / `14` / `14` / `7` / `'#E4E9F1'` (`urge:1298`) | match |
| Surf-Step-3 | Art · droplet | filter | `blur(1px)` | none — drawn hard-edged (`urge:1298`) | MISMATCH* |
| Surf-Step-3 | Art · basin | left / top / w / h | `70` / `142` / `120` / `34` | `70` / `142` / `120` / `34` (`urge:1302-1305`) | match |
| Surf-Step-3 | Art · basin | border-radius | `14px 14px 18px 18px` | TL `14` TR `14` BL `18` BR `18` (`urge:1306-1309`) | match |
| Surf-Step-3 | Art · basin | background | `#E0DFDA` | `'#E0DFDA'` (`urge:1310`) | match |
| Surf-Step-3 | Art · basin water | left / top / w / h / radius / background | `82` / `148` / `96` / `14` / `8` / `#EDF1F4` | identical (`urge:1313`) | match |
| Surf-Step-3 | Art · splash dot A | left / top / w / h / radius / background | `118` / `96` / `5` / `5` / `50%` / `#E4E9F1` | `118` / `96` / `5` / `5` / `2.5` / `'#E4E9F1'` (`urge:1314`) | match |
| Surf-Step-3 | Art · splash dot B | left / top / w / h / radius / background | `166` / `104` / `4` / `4` / `50%` / `#E4E9F1` | `166` / `104` / `4` / `4` / `2` / `'#E4E9F1'` (`urge:1315`) | match |
| Surf-Step-3 | Art · shadow | left / top / w / h | `64` / `182` / `130` / `14` | `64` / `182` / `130` / `14` (`urge:1316`) | match |
| Surf-Step-3 | Art · shadow | background / filter | solid `rgba(0,0,0,0.10)`, radius `50%` / `blur(5px)` | radial ramp `0.1` → `0` @ `1.0`, no blur (`urge:1316`) | MISMATCH* |
| Surf-Step-3 | Art · ripple 1 | left / top / w / h / radius / background | `100` / `152` / `60` / `3` / `2` / `#C9D6E4` | identical (`urge:1317`) | match |
| Surf-Step-3 | Art · ripple 2 | left / top / w / h / radius / background | `112` / `158` / `36` / `3` / `2` / `#D8E2EC` | identical (`urge:1318`) | match |
| Surf-Step-3 | Art · bubble | left / top / w / h / radius / background | `128` / `138` / `8` / `8` / `50%` / `#E4E9F1` | `128` / `138` / `8` / `8` / `4` / `'#E4E9F1'` (`urge:1319`) | match |
| Surf-Step-3 | Art · bubble | opacity | `0.8` | `0.8` (`urge:1319`) | match |
| Surf-Step-3 | Art · spray R | left / top / w / h / radius / background | `158` / `128` / `12` / `4` / `2` / `#D8E2EC` | identical (`urge:1320`) | match |
| Surf-Step-3 | Art · spray R | transform | `rotate(24deg)` | `rotate: '24deg'` (`urge:1320`) | match |
| Surf-Step-3 | Art · spray L | left / top / w / h / radius / background | `120` / `126` / `12` / `4` / `2` / `#D8E2EC` | identical (`urge:1321`) | match |
| Surf-Step-3 | Art · spray L | transform | `rotate(-24deg)` | `rotate: '-24deg'` (`urge:1321`) | match |
| Surf-Step-3 | Art · sky dot | left / top / w / h / radius / background | `88` / `40` / `2` / `2` / `50%` / `rgba(200,225,235,0.5)` | `88` / `40` / `2` / `2` / `1` / `0.5` (`urge:1322`) | match |
| Surf-Step-3 | Art · drop glow | left / top / w / h | `44` / `96` / `14` / `14` | `44` / `96` / `14` / `14` (`urge:1323`) | match |
| Surf-Step-3 | Art · drop glow | stop 1 / stop 2 | `rgba(150,190,210,0.5)` @ `0` / `rgba(150,190,210,0)` @ `74%` | `0.5` @ `0` / `0` @ `0.74` (`urge:1323`) | match |
| Surf-Step-3 | Art | paint order | cool, tap, neck, column, droplet, basin, water, dotA, dotB, shadow, ripple1, ripple2, bubble, sprayR, sprayL, sky dot, drop glow (17) | identical 17 in the same order (`urge:1294-1323`) | match |
| Surf-Step-3 | Headline | left / right / top / align | `0` / `0` / `398` / `center` | identical (`urge:1336`) | match |
| Surf-Step-3 | Headline | font-size / weight / letter-spacing / colour | `23px` / `500` / `0.1px` / `#1D1C1A` | identical (`urge:1336`) | match |
| Surf-Step-3 | Headline | text | `Cold water on your wrists.` | literal `Cold water on your wrists.` (`urge:2321`) | match |
| Surf-Step-3 | Body | left / right / top / align | `44` / `44` / `444` / `center` | identical (`urge:1339`) | match |
| Surf-Step-3 | Body | font-size / weight / line-height / colour | `15.5px` / `400` / `23px` / `#55534E` | identical (`urge:1339`) | match |
| Surf-Step-3 | Body | text | `Thirty seconds. The body resets faster than the mind can argue.` | literal, character-identical (`urge:2322`) | match |
| Surf-Step-3 | Pill | geometry / colour / label | `bottom 88`, `h 54`, `r 27`, `#131313`, `Done — next` | `SheetPrimary` (`urge:1342`) | match |
| Surf-Step-3 | Skip | geometry / text | `bottom 44`, 15/500/#8B8882, `Skip this step` | `SheetSkip` (`urge:1343`) | match |
| Surf-Step-3 | Close X | present / position | yes / `right 22 top 24` | `SheetClose` (`urge:1331`) | match |

---

## 6 · Surf-Complete → `DonePage` (`urge:2124-2192`)

Frame-absolute tops. Background layer takes them raw; the text layer sits under `top: insets.top`, so its tops are canvas − 54.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Surf-Complete | Root | background | `#F0EFEB` | `'#F0EFEB'` (`urge:2127`) | match |
| Surf-Complete | Field layer | inset | `left 0 top 0 right 0 bottom 0` | `top/left/right/bottom 0` (`urge:2129`) | match |
| Surf-Complete | Field layer | overflow | `hidden` | `'hidden'` (`urge:2129`) | match |
| Surf-Complete | Field layer | gradient angle | `180deg` | `LinearGradient` default vertical (`urge:2130`) | match |
| Surf-Complete | Field layer | stop 1 | `#F2E7D6` @ `0%` | `'#F2E7D6'` @ `0` (`urge:2130`) | match |
| Surf-Complete | Field layer | stop 2 | `#E6CFAC` @ `39%` | `'#E6CFAC'` @ `0.39` (`urge:2130`) | match |
| Surf-Complete | Field layer | stop 3 | `#FBFAF7` @ `65%` | `'#FBFAF7'` @ `0.65` (`urge:2130`) | match |
| Surf-Complete | Field layer | stop 4 | `#F0EFEB` @ `82%` | `'#F0EFEB'` @ `0.82` (`urge:2130`) | match |
| Surf-Complete | Shaft A | left / top / width / height | `-30` / `-40` / `150` / `420` | `-30` / `-40` / `150` / `420` (`urge:2131`) | match |
| Surf-Complete | Shaft A | background-image | `url('noise-dark.png')` | `assets/images/noise-dark.png` (`urge:528`, `urge:2117`) | match |
| Surf-Complete | Shaft A | opacity | `0.2` | `0.2` (`urge:2131`) | match |
| Surf-Complete | Shaft A | transform / transform-origin | `rotate(24deg)` / `top center` | `rotate: '24deg'` / `transformOrigin: 'top center'` (`urge:2105`) | match |
| Surf-Complete | Shaft A | mask-image | `linear-gradient(180deg, #000 30%, transparent)` | SVG luminance mask, white @ `0.3` → black @ `1` (`urge:2109-2114`) | MISMATCH* |
| Surf-Complete | Shaft B | left / top / width / height / opacity / rotate | `130` / `-60` / `140` / `430` / `0.24` / `6deg` | identical (`urge:2132`) | match |
| Surf-Complete | Shaft C | left / top / width / height / opacity / rotate | `290` / `-40` / `150` / `420` / `0.2` / `-14deg` | identical (`urge:2133`) | match |
| Surf-Complete | Horizon clip | left / top / right / height | `0` / `0` / `0` / `558` | `left 0 right 0 top 0 height 558` (`urge:2141`) | match |
| Surf-Complete | Horizon clip | overflow | `hidden` | `'hidden'` (`urge:2141`) | match |
| Surf-Complete | Sun | left / top / width / height | `96` / `425` / `200` / `200` | `96` / `425` / `200` / `200` (`urge:2142`) | match |
| Surf-Complete | Sun | border-radius | `50%` | `100` (`urge:2142`) | match |
| Surf-Complete | Sun | overflow | `hidden` | `'hidden'` (`urge:2142`) | match |
| Surf-Complete | Sun | gradient centre | `circle at 50% 30%` | `cx 50% cy 30%` (`urge:2146`) | match |
| Surf-Complete | Sun | gradient extent | farthest-corner from (100,60) in a 200 box = `172.05` | `rx/ry 86%` = `172.0` (`urge:2146`) | match (0.05pt short; documented `urge:2145`) |
| Surf-Complete | Sun | stop 1 | `#FBF3E4` @ `0` | `'#FBF3E4'` @ `0` (`urge:2147`) | match |
| Surf-Complete | Sun | stop 2 | `#F0DDBC` @ `65%` | `'#F0DDBC'` @ `0.65` (`urge:2148`) | match |
| Surf-Complete | Sun | stop 3 | `#DFC79E` @ `100%` | `'#DFC79E'` @ `1` (`urge:2149`) | match |
| Surf-Complete | Sun · grain | inset / image / opacity | `0` / `noise-dark.png` / `0.5` | full-bleed `Image` / `NOISE_DARK` / `0.5` (`urge:2154`) | match |
| Surf-Complete | Halo | left / top / width / height | `56` / `385` / `280` / `280` | `56` / `385` / `280` / `280` (`urge:2156`) | match |
| Surf-Complete | Halo | border-radius | `50%` | `Ellipse rx/ry 140` (`urge:687`) | match |
| Surf-Complete | Halo | stop 1 | `rgba(250,238,214,0.4)` @ `0` | `rgb(250,238,214)` @ `0.4`, offset `0` (`urge:2156`) | match |
| Surf-Complete | Halo | stop 2 | `rgba(250,238,214,0)` @ `72%` | `0` @ `0.72` (`urge:2156`) | match |
| Surf-Complete | Sun / halo | paint order | sun first, halo over it | sun `urge:2142`, halo `urge:2156` | match |
| Surf-Complete | Horizon scrim | left / right / top / height | `0` / `0` / `542` / `32` | `0` / `0` / `542` / `32` (`urge:2161`) | match |
| Surf-Complete | Horizon scrim | gradient angle | `180deg` | vertical default (`urge:2158`) | match |
| Surf-Complete | Horizon scrim | stops | `rgba(255,255,255,0)` @ `0%`, `rgba(255,255,255,0.55)` @ `50%`, `rgba(255,255,255,0)` @ `100%` | same three, `locations [0, 0.5, 1]` (`urge:2159-2160`) | match |
| Surf-Complete | Page grain | inset / image / opacity | `0` / `noise-dark.png` / `0.10` | full-bleed / `NOISE_DARK` / `0.1` (`urge:2163`) | match |
| Surf-Complete | Headline | left / right | `40` / `40` | `40` / `40` (`urge:2167`) | match |
| Surf-Complete | Headline | top | `128` (frame) → app-equivalent `74` | `74` under `top: insets.top` (`urge:2166-2167`) | match |
| Surf-Complete | Headline | text-align | `center` | `center` prop (`urge:2167`) | match |
| Surf-Complete | Headline | font-size / weight | `22px` / `500` | `22` / `sans('500')` (`urge:2167`) | match |
| Surf-Complete | Headline | line-height | `32px` | `32` (`urge:2167`) | match |
| Surf-Complete | Headline | colour | `#1D1C1A` | `SHEET_TEXT = '#1D1C1A'` (`urge:2167`) | match |
| Surf-Complete | Headline | z-index | `5` | later sibling than the field layer (`urge:2166`) | match |
| Surf-Complete | Headline | text / line break | `The wave passed.` `<br>` `You outlasted it.` | `The wave passed.{'\n'}You outlasted it.` (`urge:2168`) | match |
| Surf-Complete | Sub | left / right | `0` / `0` | `0` / `0` (`urge:2170`) | match |
| Surf-Complete | Sub | top | `200` (frame) → app-equivalent `146` | `146` (`urge:2170`) | match |
| Surf-Complete | Sub | font-size / weight / colour / align | `14px` / `400` / `#55534E` / `center` | `14` / `sans('400')` / `SHEET_MUTED` / `center` (`urge:2170`) | match |
| Surf-Complete | Sub | z-index | `5` | later sibling (`urge:2166`) | match |
| Surf-Complete | Sub | text | `Logged — rode it out · ×3` (U+2014, U+00B7, U+00D7) | `Logged — rode it out · ×{count}`, all three code points verified (`urge:2171`); `count = Math.max(1, rodeOut)` (`urge:2335`) — frame draws the `3` state | match |
| Surf-Complete | Pill | left | `16` | `16` (`urge:2178`) | match |
| Surf-Complete | Pill | width | `361` (→ right edge 377 = right inset 16) | `right: 16` (`urge:2179`) | match |
| Surf-Complete | Pill | top | `756` (+48 = 804 of 852) → `bottom 48` | `bottom: 48` (`urge:2180`) | match |
| Surf-Complete | Pill | height | `48` | `48` (`urge:2181`) | match |
| Surf-Complete | Pill | border-radius | `25` | `25` (`urge:2182`) | match |
| Surf-Complete | Pill | background | `#131313` | `SHEET_INK` (`urge:2183`) | match |
| Surf-Complete | Pill | align-items / justify-content | `center` / `center` | `center` / `center` (`urge:2184-2185`) | match |
| Surf-Complete | Pill | z-index | `5` | later sibling (`urge:2166`) | match |
| Surf-Complete | Pill label | font-size / weight / letter-spacing / colour | `17.5px` / `600` / `0.2px` / `#FFFFFF` | `17.5` / `sans('600')` / `0.2` / `'#FFFFFF'` (`urge:2187`) | match |
| Surf-Complete | Pill label | text | `Back to Today` | `Back to Today` (`urge:2187`) | match |
| Surf-Complete | — | close / back control | none drawn | none rendered (`urge:2166-2189`) | match |
| Surf-Complete | — | paper sheet | none (frame breaks the sheet) | none — `DonePage` is full-bleed (`urge:2127`) | match |
