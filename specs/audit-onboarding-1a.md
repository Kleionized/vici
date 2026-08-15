# Property audit — onboarding run 1a (V3 Section 1 → Q4, Section 2)

**Frames audited (6):** V3-Section-1-Intro, V3-Q1, V3-Q2, V3-Q3, V3-Q4, V3-Section-2-Intro.

**Design source:** `/Users/admin/Documents/tideline/.uifinal/pretty/final/Email Login/<Slug>.html`
— all six read in full, every line. The raw
`/Users/admin/Documents/tideline/.uifinal/final/Email Login/<Slug>.html` was consulted for
byte-level text (entities un-escaped and diffed against the app literals in Python, not by eye).

**App source (read in full):**
- `/Users/admin/Documents/tideline/src/components/onboarding/v3.tsx` (2056 lines)
- `/Users/admin/Documents/tideline/src/app/(onboarding)/welcome.tsx` (283 lines)
- supporting: `/Users/admin/Documents/tideline/src/lib/theme.ts` (`sans()`, `colors`),
  `/Users/admin/Documents/tideline/src/components/ui/AppText.tsx`,
  `/Users/admin/Documents/tideline/src/components/ui/press-scale.tsx`,
  `/Users/admin/Documents/tideline/src/components/ui/Grain.tsx`

---

## The 54px offset

Every canvas frame is a 393 × 852 div whose `top` values include a 54px status-bar strip the app
never builds — the app spends that strip as `SafeAreaView edges={['top']}` padding instead
(`v3.tsx:242`). So for every absolutely placed element:

```
app top  =  canvas top − 54
```

Both numbers are stated in every row below. Bottom-anchored elements take **no** offset: the canvas
frame's bottom edge and the app's screen bottom are the same line, so
`bottom = 852 − canvasTop − height` holds exactly.

One consequence, stated once and not repeated: the canvas strip is 54, the device inset is 59 on a
393 × 852 iPhone. Everything below the inset therefore lands 5pt lower on device than on the canvas.
That is the port's declared substitution (a real safe area for a drawn one), not per-element drift.

## Layout basis — verified, not assumed

Every element in this run is placed absolutely inside `O3Shell`'s content box
(`v3.tsx:277`, `<View style={{flex:1, paddingHorizontal:24, paddingTop:76, paddingBottom:32}}>`).
The port depends on Yoga positioning an inset-bearing absolute child from its parent's **border**
box, ignoring that padding. The previous audit in this series recorded that as an untested
assumption. It is now checked against the Yoga shipped with this RN:

`/Users/admin/Documents/tideline/node_modules/react-native/ReactCommon/yoga/yoga/algorithm/AbsoluteLayout.cpp`
(react-native 0.85.3), `positionAbsoluteChild`:

- inline-start branch, lines 187–192 —
  `computeInlineStartPosition(...) + containingNode->style().computeInlineStartBorder(...) + child margin`
- inline-end branch, lines 202–210 —
  `containingNode measuredDimension − child measuredDimension − computeInlineEndBorder(...) − child margin − computeInlineEndPosition(...)`

Neither branch has a padding term, and `measuredDimension` is the border-box size. The
`Errata::AbsolutePositionWithoutInsetsExcludesPadding` switch (lines 26, 43, 63, 77) only guards the
*no-inset* justify/align path, which nothing in this run takes. So `left: 24` is 24 from the screen
edge and `top: 104` is 104 below the safe-area inset, exactly as the port's comments claim
(`v3.tsx:244-248, 274-277`). **The basis holds; every offset row below is read on solid ground.**

## Grading key

- **match** — the app states the design literal.
- **MISMATCH** — a difference the app can close.
- **MISMATCH\*** — RN cannot express the CSS; the substitution is named in the row.
- **n/a** — canvas-gallery chrome that has no native counterpart (the drawn status bar, the
  gallery's own mounting shadow). Counted separately, never as a match.

---

## Table A — shared frame chrome (identical in all six frames)

Verified identical across the six pretty files line for line: lines 1–141 differ only in
`data-screen-label`, the two field gradient stops, the low-sun box, and the rule fill percent. Those
four are in Table B; everything else in the chrome is compared once here.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| all 6 | frame root | width | `393px` | device width (`View {flex:1}` `v3.tsx:239`) | match (canvas reference width) |
| all 6 | frame root | height | `852px` | device height (`flex:1`) | match (canvas reference height) |
| all 6 | frame root | position | `relative` | `View {flex:1}` | match |
| all 6 | frame root | overflow | `hidden` | not set on root; the ambient layer clips itself (`v3.tsx:301`) | match (nothing else overflows) |
| all 6 | frame root | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | `sans()` → `'System'` on iOS (`theme.ts:161-170,191-197`) | match on iOS (web stack differs — Note D2) |
| all 6 | frame root | -webkit-font-smoothing | `antialiased` | `WebkitFontSmoothing:'antialiased'` on web only (`AppText.tsx:124-129`); iOS antialiases natively | match |
| all 6 | frame root | flex-shrink | `0` | — | n/a (gallery layout) |
| all 6 | frame root | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | not drawn | n/a (gallery mounting shadow) |
| all 6 | frame root | background | `linear-gradient(180deg, <top> 0%, <bot> 100%)` | `<LinearGradient colors={[field.top, field.bot]}>` `v3.tsx:302`; expo-linear-gradient default `start {0.5,0}` → `end {0.5,1}` = 180deg | match (per-frame stops in Table B) |
| all 6 | frame root | background under the gradient | — | `backgroundColor: tone.bg` = `#0F0F0D` `v3.tsx:239,72` | match (fully covered by the gradient) |
| all 6 | ambient layer | position / inset | `absolute` / `0` | `position:'absolute', top/left/right/bottom: 0` `v3.tsx:301` | match |
| all 6 | ambient layer | overflow | `hidden` | `overflow:'hidden'` `v3.tsx:301` | match |
| all 6 | ambient layer | pointer-events | `none` | `pointerEvents="none"` `v3.tsx:301` | match |
| all 6 | corner bloom | left | `-40px` | `left:-40` `v3.tsx:306` | match |
| all 6 | corner bloom | top | `-140px` | `top:-140` `v3.tsx:306` | match |
| all 6 | corner bloom | width / height | `540px` / `270px` | `width={540} height={270}` `v3.tsx:306` | match |
| all 6 | corner bloom | border-radius | `50%` | `<Ellipse cx=270 cy=135 rx=270 ry=135>` `v3.tsx:313` | match (the ellipse *is* the 50% clip) |
| all 6 | corner bloom | gradient extent | `closest-side` on 540 × 270 from centre → rx 270 / ry 135 | `RadialGradient cx="50%" cy="50%" rx="50%" ry="50%"` on a 540 × 270 Svg = rx 270 / ry 135 `v3.tsx:308` | match |
| all 6 | corner bloom | stop 0 | `rgba(180,170,150,0.14)` | `#B4AA96` @ `0.14`, offset `0` `v3.tsx:309` | match (`#B4AA96` = rgb(180,170,150)) |
| all 6 | corner bloom | stop 72% | `rgba(19,19,19,0)` | `#131313` @ `0`, offset `0.72` `v3.tsx:310` | match (`#131313` = rgb(19,19,19)) |
| all 6 | corner bloom | filter | `blur(6px)` | none | **MISMATCH\*** — react-native-svg has no blur filter; the app substitutes the gradient's own falloff (`v3.tsx:303-305`) |
| all 6 | low sun | left / margin-left | `50%` / `-(w/2)` | `left:'50%', marginLeft:-sun/2` `v3.tsx:315` | match |
| all 6 | low sun | border-radius | `50%` | `<Ellipse rx={sun/2} ry={sun/2}>` `v3.tsx:323` | match |
| all 6 | low sun | gradient extent | `closest-side` on a square box → r = w/2 | `RadialGradient rx/ry 50%` of a `sun × sun` Svg `v3.tsx:317` | match |
| all 6 | low sun | stop offsets | `0` / `45%` / `72%` | `offset 0` / `0.45` / `0.72` `v3.tsx:318-320` | match (alphas per frame in Table B) |
| all 6 | low sun | stop-3 alpha | `0` | `stopOpacity={0}` `v3.tsx:320` | match |
| all 6 | noise | inset | `0` | absolute fill (`Grain.tsx:16`) | match |
| all 6 | noise | background-image | `url('noise-dark.png')` | `require('../../../assets/images/noise-dark.png')` `v3.tsx:54,325` | match |
| all 6 | noise | background-repeat | `repeat` (initial) | `resizeMode="repeat"` (`Grain.tsx:17`) | match |
| all 6 | noise | background-size | `auto` → the file's intrinsic 96 × 96 | asset is 96 × 96 @1x → 96 × 96pt tile | match |
| all 6 | noise | opacity | `0.12` | `opacity={0.12}` `v3.tsx:325` | match |
| all 6 | status bar | height / padding / z-index | `54px` / `6px 32px 0 46px` / `20` | not built; spent as the SafeAreaView top inset `v3.tsx:242` | n/a |
| all 6 | status-bar clock | size / weight / colour / tracking | `17px` / `600` / `#F4F3F0` / `-0.2px` | — | n/a |
| all 6 | status-bar glyphs | signal / wifi / battery svg | `19×12` / `17×12` / `27×13`, gap `7px` | — | n/a |
| all 6 | progress rule | position / left / right | `absolute` / `24px` / `24px` | `position:'absolute', left:24, right:24` `v3.tsx:257` | match |
| all 6 | progress rule | top | canvas `66` / app `12` | `top:12` `v3.tsx:257` | match |
| all 6 | progress rule | height | `4px` | `height:4` `v3.tsx:257` | match |
| all 6 | progress rule | border-radius | `2px` | `borderRadius:2` `v3.tsx:257` | match |
| all 6 | progress rule | background | `rgba(255,255,255,0.2)` | `tone.track` = `'rgba(255,255,255,0.2)'` `v3.tsx:79,257` | match |
| all 6 | rule fill | left / top | `0` / `0` | first flow child of the track, no padding `v3.tsx:258` | match |
| all 6 | rule fill | height | `4px` | `height:4` `v3.tsx:258` | match |
| all 6 | rule fill | border-radius | `2px` | `borderRadius:2` `v3.tsx:258` | match |
| all 6 | rule fill | background | `#F4F3F0` | `tone.ink` = `'#F4F3F0'` `v3.tsx:81,258` | match |
| all 6 | rule fill | width | per frame (Table B) | `field.rule` off `O3_FIELD` `v3.tsx:232,258` | match (per-frame in Table B) |
| all 6 | Back row | position / left | `absolute` / `16px` | `position:'absolute', left:16` `v3.tsx:267` | match |
| all 6 | Back row | top | canvas `94` / app `40` | `backTop ?? 40` `v3.tsx:267`; `welcome.tsx:122-141` passes no `backTop` for these six ids | match |
| all 6 | Back row | display / align-items | `flex` / `center` | `flexDirection:'row', alignItems:'center'` `v3.tsx:267` | match |
| all 6 | Back row | gap | `9px` | `gap:9` `v3.tsx:267` | match |
| all 6 | Back row | height | auto (content box ≈ 20.3) | `minHeight:0` `v3.tsx:267` cancels `PressScale`'s `minHeight:44` (`press-scale.tsx:33`) → content box | match |
| all 6 | Back chevron | size / viewBox | `11 × 19` / `0 0 11 19` | `width={11} height={19} viewBox="0 0 11 19"` `v3.tsx:268` | match |
| all 6 | Back chevron | path `d` | `M9.5 1.5L2 9.5l7.5 8` | `M9.5 1.5L2 9.5l7.5 8` `v3.tsx:269` | match (character for character) |
| all 6 | Back chevron | fill | `none` | `fill="none"` on `<Svg>` `v3.tsx:268` | match |
| all 6 | Back chevron | stroke | `rgba(244,243,240,0.75)` | `backInk` = `'rgba(244,243,240,0.75)'` `v3.tsx:235,269` | match |
| all 6 | Back chevron | stroke-width | `2.4` | `strokeWidth={2.4}` `v3.tsx:269` | match |
| all 6 | Back chevron | linecap / linejoin | `round` / `round` | `strokeLinecap="round" strokeLinejoin="round"` `v3.tsx:269` | match |
| all 6 | Back label | text | `Back` | `Back` `v3.tsx:271` | match |
| all 6 | Back label | font-size | `17px` | `fontSize:17` `v3.tsx:271` | match |
| all 6 | Back label | font-weight | `400` | `sans('400')` `v3.tsx:271` | match |
| all 6 | Back label | color | `rgba(244,243,240,0.75)` | `backInk` `v3.tsx:271` | match |
| all 6 | Back label | letter-spacing | not stated → `normal` | inherited `-0.1` dropped by AppText's own-size rule (`AppText.tsx:117,138`) | match |
| all 6 | Back label | line-height | not stated → `normal` | inherited leading dropped (`AppText.tsx:116,139`) → platform line box | match |
| all 6 | paint order | z-order | ambient → status bar (z 20) → rule → Back → content | ambient → rule → Back → content (`v3.tsx:241-277`) | match (status bar n/a; nothing else overlaps) |

*Table A: 62 rows.*

---

## Table B — the per-frame field, low sun and rule

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Section-1-Intro | field | gradient stop 0 / 100 | `rgb(15,15,13)` / `rgb(26,25,23)` | `O3_FIELD[0]` `'rgb(15,15,13)'` / `'rgb(26,25,23)'` `v3.tsx:123` | match |
| Section-1-Intro | low sun | width / height | `420px` / `420px` | `sun = 420` `v3.tsx:123` | match |
| Section-1-Intro | low sun | bottom | `-231px` | `off = -231` `v3.tsx:123` | match |
| Section-1-Intro | low sun | margin-left | `-210px` | `-sun/2` = `-210` `v3.tsx:315` | match |
| Section-1-Intro | low sun | glow colour | `rgba(255,236,196,·)` | `O3_WARM` = `#FFECC4` `v3.tsx:118` | match |
| Section-1-Intro | low sun | stop-1 / stop-2 alpha | `0.10` / `0.05` | `a0 = 0.1` / `a45 = 0.05` `v3.tsx:123` | match |
| Section-1-Intro | rule fill | width | `4%` | `rule = 4` via `O3_SECTION_FIELD[0] = 0` `v3.tsx:164,1177` | match |
| V3-Q1 | field | gradient stop 0 / 100 | `rgb(15,15,13)` / `rgb(26,25,23)` | `O3_FIELD[1]` same `v3.tsx:124` | match |
| V3-Q1 | low sun | width / height | `420px` / `420px` | `420` `v3.tsx:124` | match |
| V3-Q1 | low sun | bottom | `-231px` | `-231` `v3.tsx:124` | match |
| V3-Q1 | low sun | margin-left | `-210px` | `-210` | match |
| V3-Q1 | low sun | glow colour | `rgba(255,236,196,·)` | `#FFECC4` | match |
| V3-Q1 | low sun | stop-1 / stop-2 alpha | `0.10` / `0.05` | `0.1` / `0.05` `v3.tsx:124` | match |
| V3-Q1 | rule fill | width | `4%` | `rule = 4` via `O3_Q_FIELD[0] = 1` `v3.tsx:163,732` | match |
| V3-Q2 | field | gradient stop 0 / 100 | `rgb(16,16,14)` / `rgb(27,26,24)` | `O3_FIELD[2]` `v3.tsx:125` | match |
| V3-Q2 | low sun | width / height | `429px` / `429px` | `429` `v3.tsx:125` | match |
| V3-Q2 | low sun | bottom | `-236px` | `-236` `v3.tsx:125` | match |
| V3-Q2 | low sun | margin-left | `-214.5px` | `-sun/2` = `-214.5` | match |
| V3-Q2 | low sun | glow colour | `rgba(255,255,255,·)` | `O3_COOL` = `#FFFFFF` `v3.tsx:119` | match |
| V3-Q2 | low sun | stop-1 / stop-2 alpha | `0.12` / `0.05` | `0.12` / `0.05` `v3.tsx:125` | match |
| V3-Q2 | rule fill | width | `9%` | `rule = 9` via `O3_Q_FIELD[1] = 2` | match |
| V3-Q3 | field | gradient stop 0 / 100 | `rgb(17,17,15)` / `rgb(29,28,26)` | `O3_FIELD[3]` `v3.tsx:126` | match |
| V3-Q3 | low sun | width / height | `438px` / `438px` | `438` `v3.tsx:126` | match |
| V3-Q3 | low sun | bottom | `-241px` | `-241` `v3.tsx:126` | match |
| V3-Q3 | low sun | margin-left | `-219px` | `-219` | match |
| V3-Q3 | low sun | glow colour | `rgba(255,236,196,·)` | `#FFECC4` | match |
| V3-Q3 | low sun | stop-1 / stop-2 alpha | `0.14` / `0.06` | `0.14` / `0.06` `v3.tsx:126` | match |
| V3-Q3 | rule fill | width | `13%` | `rule = 13` via `O3_Q_FIELD[2] = 3` | match |
| V3-Q4 | field | gradient stop 0 / 100 | `rgb(17,17,15)` / `rgb(30,29,27)` | `O3_FIELD[5]` `v3.tsx:128` | match |
| V3-Q4 | low sun | width / height | `448px` / `448px` | `448` `v3.tsx:128` | match |
| V3-Q4 | low sun | bottom | `-246px` | `-246` `v3.tsx:128` | match |
| V3-Q4 | low sun | margin-left | `-224px` | `-224` | match |
| V3-Q4 | low sun | glow colour | `rgba(255,236,196,·)` | `#FFECC4` | match |
| V3-Q4 | low sun | stop-1 / stop-2 alpha | `0.15` / `0.07` | `0.15` / `0.07` `v3.tsx:128` | match |
| V3-Q4 | rule fill | width | `17%` | `rule = 17` via `O3_Q_FIELD[3] = 5` (skips row 4, the willpower lesson) | match |
| Section-2-Intro | field | gradient stop 0 / 100 | `rgb(18,18,16)` / `rgb(31,30,28)` | `O3_FIELD[6]` `v3.tsx:129` | match |
| Section-2-Intro | low sun | width / height | `457px` / `457px` | `457` `v3.tsx:129` | match |
| Section-2-Intro | low sun | bottom | `-251px` | `-251` `v3.tsx:129` | match |
| Section-2-Intro | low sun | margin-left | `-228.5px` | `-228.5` | match |
| Section-2-Intro | low sun | glow colour | `rgba(255,255,255,·)` | `#FFFFFF` | match |
| Section-2-Intro | low sun | stop-1 / stop-2 alpha | `0.17` / `0.08` | `0.17` / `0.08` `v3.tsx:129` | match |
| Section-2-Intro | rule fill | width | `22%` | `rule = 22` via `O3_SECTION_FIELD[1] = 6` | match |

*Table B: 42 rows.*

---

## Table C — the two section intros

### C1 — shared structure (Section-1-Intro, Section-2-Intro)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| both | eyebrow | left / right | `0` / `0` | `left:0, right:0` `v3.tsx:1180` | match |
| both | eyebrow | top | canvas `308` / app `254` | `top:254` `v3.tsx:1180` | match |
| both | eyebrow | text-align | `center` | `center` prop → `textAlign:'center'` (`AppText.tsx:134`) | match |
| both | eyebrow | font-size | `13px` | `fontSize:13` `v3.tsx:1180` | match |
| both | eyebrow | font-weight | `600` | `sans('600')` `v3.tsx:1180` | match |
| both | eyebrow | letter-spacing | `0.3px` | `letterSpacing:0.3` `v3.tsx:1180` | match |
| both | eyebrow | color | `rgba(244,243,240,0.55)` | `'rgba(244,243,240,0.55)'` `v3.tsx:1180` | match |
| both | eyebrow | line-height | not stated → `normal` | own size + no leading → inherited leading dropped (`AppText.tsx:116,139`) | match |
| both | eyebrow | text-transform | not stated → `none` | not set (the `O3Eyebrow` caps primitive is **not** used here) | match |
| both | title | left / right | `36px` / `36px` | `left:36, right:36` `v3.tsx:1183` | match |
| both | title | top | canvas `338` / app `284` | `top:284` `v3.tsx:1183` | match |
| both | title | text-align | `center` | `center` prop `v3.tsx:1183` | match |
| both | title | font-size | `26px` | `fontSize:26` `v3.tsx:1183` | match |
| both | title | font-weight | `500` | `sans('500')` `v3.tsx:1183` | match |
| both | title | line-height | `1.3` → `33.8px` | `lineHeight:33.8` `v3.tsx:1183` | match (not rounded to 34) |
| both | title | letter-spacing | `-0.2px` | `letterSpacing:-0.2` `v3.tsx:1183` | match |
| both | title | color | `#F4F3F0` | `INK` = `'#F4F3F0'` `v3.tsx:696,1183` | match |
| both | title | text-wrap | `balance` | native: no equivalent; web: `AppText.tsx:127` assigns `'pretty'` to the `body` variant | **MISMATCH\*** on native (greedy last-fit wrapping substituted); **MISMATCH** on web (`pretty` ≠ `balance`) |
| both | body | left / right | `44px` / `44px` | `left:44, right:44` `v3.tsx:1186` | match |
| both | body | top | canvas `420` / app `366` | `top:366` `v3.tsx:1186` | match |
| both | body | text-align | `center` | `center` prop `v3.tsx:1186` | match |
| both | body | font-size | `15.5px` | `fontSize:15.5` `v3.tsx:1186` | match |
| both | body | font-weight | `400` | `sans('400')` `v3.tsx:1186` | match |
| both | body | line-height | `24px` | `lineHeight:24` `v3.tsx:1186` | match |
| both | body | letter-spacing | not stated → `normal` | inherited `-0.1` dropped (`AppText.tsx:117,138`) | match |
| both | body | color | `rgba(244,243,240,0.7)` | `'rgba(244,243,240,0.7)'` `v3.tsx:1186` | match |
| both | body | text-wrap | `pretty` | native: no equivalent; web: `AppText.tsx:127` assigns `'pretty'` | **MISMATCH\*** on native (greedy wrapping substituted); match on web |
| both | CTA pill | left / right | `24px` / `24px` | `left:24, right:24` `v3.tsx:1189` | match |
| both | CTA pill | top → bottom | canvas top `744`, h 56 → bottom `52` | `bottom: O3_MD_CTA_BOTTOM` = `852−744−56` = `52` `v3.tsx:414,1189` | match |
| both | CTA pill | height | `56px` | `height: md ? 56 : 58` → `56` (`size="md"`) `v3.tsx:397,1189` | match |
| both | CTA pill | border-radius | `28px` | `borderRadius: md ? 28 : 29` → `28` `v3.tsx:398` | match |
| both | CTA pill | background | `#F4F3F0` | `tone.fill` = `'#F4F3F0'` `v3.tsx:81,396` | match |
| both | CTA pill | display / align-items / justify-content | `flex` / `center` / `center` | `alignItems:'center', justifyContent:'center'` `v3.tsx:399-400` | match |
| both | CTA pill | opacity | not stated → `1` | `opacity: enabled ? 1 : 0.26`; `enabled` defaults true and no `enabled` prop is passed | match |
| both | CTA pill | cursor | `pointer` | — | n/a (no cursor on touch) |
| both | CTA label | text | `Continue` | `'Continue'` `v3.tsx:1189` | match |
| both | CTA label | font-size | `16.5px` | `fontSize: md ? 16.5 : 17` → `16.5` `v3.tsx:404` | match |
| both | CTA label | font-weight | `600` | `sans('600')` `v3.tsx:404` | match |
| both | CTA label | color | `#131313` | `tone.onFill` = `'#131313'` `v3.tsx:82,404` | match |
| both | CTA label | letter-spacing | not stated → `normal` | `letterSpacing: md ? 0 : 0.2` → `0` `v3.tsx:404` | match (0 is the numeric identity of `normal`; see Note D4) |

### C2 — per-frame copy

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Section-1-Intro | eyebrow | text | `Section 1 of 6` | `'Section 1 of 6'` `v3.tsx:1166` | match |
| Section-1-Intro | title | text | `Where you’re starting` (U+2019) | `'Where you’re starting'` `v3.tsx:1166` | match (byte-compared) |
| Section-1-Intro | body | text | `The honest baseline. None of this is graded.` | same `v3.tsx:1166` | match |
| Section-2-Intro | eyebrow | text | `Section 2 of 6` | `'Section 2 of 6'` `v3.tsx:1167` | match |
| Section-2-Intro | title | text | `When and why it happens` | same `v3.tsx:1167` | match |
| Section-2-Intro | body | text | `This is where the plan gets specific to you. Pick everything that fits.` | same `v3.tsx:1167` | match |

*Table C: 46 rows.*

---

## Table D — the four question frames

### D1 — shared title

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Q1–Q4 | title | left / right | `44px` / `44px` | `left:44, right:44` `v3.tsx:926` | match |
| Q1–Q4 | title | top | canvas `158` / app `104` | `top:104` `v3.tsx:926` | match |
| Q1–Q4 | title | text-align | `center` | `center` prop `v3.tsx:926` | match |
| Q1–Q4 | title | font-size | `22px` | `fontSize:22` `v3.tsx:926` | match |
| Q1–Q4 | title | font-weight | `500` | `sans('500')` `v3.tsx:926` | match |
| Q1–Q4 | title | line-height | `1.32` → `29.04px` | `lineHeight:29.04` `v3.tsx:926` | match (not rounded to 29) |
| Q1–Q4 | title | letter-spacing | `0.1px` | `letterSpacing:0.1` `v3.tsx:926` | match |
| Q1–Q4 | title | color | `#F4F3F0` | `INK` `v3.tsx:926` | match |
| Q1–Q4 | title | max-width | none beyond the 44/44 inset (305pt) | absolute `left:44 right:44`, no `maxWidth` (the 305pt `O3H` primitive is not used here) `v3.tsx:926` | match |
| Q1–Q4 | title | text-wrap | `pretty` | native: no equivalent; web: `AppText.tsx:127` assigns `'pretty'` | **MISMATCH\*** on native (greedy wrapping substituted); match on web |

### D2 — shared answer row

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Q1–Q4 | answer row | position | `absolute` | `position:'absolute'` `v3.tsx:903` | match |
| Q1–Q4 | answer row | left / right | `24px` / `24px` | `left:24, right:24` `v3.tsx:904-905` | match |
| Q1–Q4 | answer row | top (row i) | canvas `310 + 74·i` / app `256 + 74·i` | `top: 256 + 74*i` `v3.tsx:906` | match |
| Q1–Q4 | answer row | height | `60px` | `height:60` `v3.tsx:907` | match |
| Q1–Q4 | answer row | border-radius | `16px` | `borderRadius:16` `v3.tsx:908` (circular corners both sides — no `borderCurve` override) | match |
| Q1–Q4 | answer row | background, unselected | `rgba(255,255,255,0.07)` | `'rgba(255,255,255,0.07)'` `v3.tsx:914` | match |
| Q1–Q4 | answer row | box-shadow, unselected | `0 0 0 1px rgba(255,255,255,0.22)` | `'0 0 0 1px rgba(255,255,255,0.22)'` `v3.tsx:915` | match (outset 1px ring, x0 y0 blur0 spread1) |
| Q1–Q4 | answer row | background, selected | `#F4F3F0` | `INK` `v3.tsx:914` | match |
| Q1–Q4 | answer row | box-shadow, selected | `0 0 0 1px rgba(0,0,0,0)` | `undefined` `v3.tsx:915` | match (a fully transparent ring paints nothing) |
| Q1–Q4 | answer row | display / flex-direction | `flex` / row | `flexDirection:'row'` `v3.tsx:909` | match |
| Q1–Q4 | answer row | align-items | `center` | `alignItems:'center'` `v3.tsx:910` | match |
| Q1–Q4 | answer row | justify-content | `space-between` | `justifyContent:'space-between'` `v3.tsx:911` | match |
| Q1–Q4 | answer row | gap | `12px` | `gap:12` `v3.tsx:912` | match |
| Q1–Q4 | answer row | padding | `0 22px` | `paddingHorizontal:22`, no vertical padding `v3.tsx:913` | match |
| Q1–Q4 | answer row | min-height | — | `minHeight:44` from `PressScale` (`press-scale.tsx:33`) is under the stated `height:60` | match (no effect) |
| Q1–Q4 | row label | font-size | `17px`, or `15.5px` on the long rows (per row, Table D3) | `fontSize: opt.fs ?? 17` `v3.tsx:917` | match |
| Q1–Q4 | row label | font-weight | `500` | `sans('500')` `v3.tsx:917` | match |
| Q1–Q4 | row label | line-height | `20px` (both sizes) | `lineHeight:20` `v3.tsx:917` | match |
| Q1–Q4 | row label | letter-spacing | not stated → `normal` | inherited `-0.1` dropped (`AppText.tsx:117,138`) | match |
| Q1–Q4 | row label | color, unselected | `#F4F3F0` | `INK` `v3.tsx:917` | match |
| Q1–Q4 | row label | color, selected | `#131313` | `ON_INK` = `'#131313'` `v3.tsx:697,917` | match |
| Q1–Q4 | row label | flex | auto (shrink-to-fit span) | `flex:1` `v3.tsx:917` | match (left-aligned text in a `space-between` row lands identically) |
| Q1–Q4 | tick | drawn when | selected row only | `on ? <O3Tick/> : null` `v3.tsx:918` | match |
| Q1–Q4 | tick | size / viewBox | `16 × 12` / `0 0 16 12` | `width={16} height={12} viewBox="0 0 16 12"` `v3.tsx:529` | match |
| Q1–Q4 | tick | path `d` | `M1.5 6l4.4 4.5L14.5 1.5` | `M1.5 6l4.4 4.5L14.5 1.5` `v3.tsx:530` | match (character for character) |
| Q1–Q4 | tick | fill | `none` | `fill="none"` on `<Svg>` `v3.tsx:529` | match |
| Q1–Q4 | tick | stroke | `#131313` | `c = tone.onFill`/`ON_INK` = `'#131313'` `v3.tsx:918` | match |
| Q1–Q4 | tick | stroke-width | `2.4` | `strokeWidth={2.4}` `v3.tsx:530` | match |
| Q1–Q4 | tick | linecap / linejoin | `round` / `round` | `round` / `round` `v3.tsx:530` | match |
| Q1–Q4 | frame | CTA pill | none drawn | `hasCta = multi \|\| typed \|\| !!skip` = false for all four `v3.tsx:737,948` | match |
| Q1–Q4 | frame | "Select all that apply" | not drawn | rendered only when `multi` `v3.tsx:929` — none of the four is multi | match |

### D3 — per-frame rows, states and copy

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| V3-Q1 | title | text | `How often are you using porn right now?` | same `v3.tsx:1122` | match |
| V3-Q1 | row count | count | 6 (tops 310, 384, 458, 532, 606, 680) | 6 options `v3.tsx:1122` | match |
| V3-Q1 | row 1 | top / state / text / size | `310` / unselected / `Several times a day` / `17` | i=0 → 256 / same / 17 | match |
| V3-Q1 | row 2 | top / state / text / size | `384` / unselected / `About once a day` / `17` | i=1 → 330 / same / 17 | match |
| V3-Q1 | row 3 | top / state / text / size | `458` / **selected** / `A few times a week` / `17` | i=2 → 404 / selected state drawn identically / 17 | match |
| V3-Q1 | row 4 | top / state / text / size | `532` / unselected / `About once a week` / `17` | i=3 → 478 / same / 17 | match |
| V3-Q1 | row 5 | top / state / text / size | `606` / unselected / `A few times a month` / `17` | i=4 → 552 / same / 17 | match |
| V3-Q1 | row 6 | top / state / text / size | `680` / unselected / `Less than once a month` / `17` | i=5 → 626 / same / 17 | match |
| V3-Q2 | title | text | `How long has this been something you’ve wanted to change?` | same `v3.tsx:1123` | match |
| V3-Q2 | row count | count | 5 (tops 310, 384, 458, 532, 606) | 5 options `v3.tsx:1123` | match |
| V3-Q2 | row 1 | top / state / text / size | `310` / unselected / `Less than a year` / `17` | i=0 → 256 / same / 17 | match |
| V3-Q2 | row 2 | top / state / text / size | `384` / unselected / `1 to 3 years` / `17` | i=1 → 330 / same / 17 | match |
| V3-Q2 | row 3 | top / state / text / size | `458` / **selected** / `4 to 10 years` / `17` | i=2 → 404 / same / 17 | match |
| V3-Q2 | row 4 | top / state / text / size | `532` / unselected / `More than 10 years` / `17` | i=3 → 478 / same / 17 | match |
| V3-Q2 | row 5 | top / state / text / size | `606` / unselected / `I can’t remember a time without it` / **`15.5`** | i=4 → 552 / same / `o(..., 15.5)` `v3.tsx:1123` | match |
| V3-Q3 | title | text | `How much control do you feel over it right now?` | same `v3.tsx:1124` | match |
| V3-Q3 | row count | count | 4 (tops 310, 384, 458, 532) | 4 options `v3.tsx:1124` | match |
| V3-Q3 | row 1 | top / state / text / size | `310` / unselected / `I feel powerless over it` / `17` | i=0 → 256 / same / 17 | match |
| V3-Q3 | row 2 | top / state / text / size | `384` / **selected** / `I resist sometimes, but usually give in` / **`15.5`** | i=1 → 330 / same / `o(..., 15.5)` `v3.tsx:1124` | match |
| V3-Q3 | row 3 | top / state / text / size | `458` / unselected / `I win about half the time` / `17` | i=2 → 404 / same / 17 | match |
| V3-Q3 | row 4 | top / state / text / size | `532` / unselected / `I mostly stay in control, but I want to be free of it` / **`15.5`** | i=3 → 478 / same / `o(..., 15.5)` | match |
| V3-Q4 | title | text | `Which of these sounds most like your pattern?` | same `v3.tsx:1125` | match |
| V3-Q4 | row count | count | 5 (tops 310, 384, 458, 532, 606) | 5 options `v3.tsx:1125` | match |
| V3-Q4 | row 1 | top / state / text / size | `310` / unselected / `A quick habit I barely think about` / `17` | i=0 → 256 / same / 17 | match |
| V3-Q4 | row 2 | top / state / text / size | `384` / **selected** / `A way I unwind, numb out, or escape` / `17` | i=1 → 330 / same / 17 | match |
| V3-Q4 | row 3 | top / state / text / size | `458` / unselected / `Something I binge on for hours at a time` / **`15.5`** | i=2 → 404 / same / `o(..., 15.5)` | match |
| V3-Q4 | row 4 | top / state / text / size | `532` / unselected / `An escalating thing — more, or more extreme` (U+2014) / **`15.5`** | i=3 → 478 / same em dash / `o(..., 15.5)` | match (byte-compared) |
| V3-Q4 | row 5 | top / state / text / size | `606` / unselected / `It comes in waves — intense, then quiet` (U+2014) / **`15.5`** | i=4 → 552 / same / `o(..., 15.5)` | match (byte-compared) |

*Table D: 69 rows.*

---

## Notes — documented deviations that are not per-element drift

**D1 · Safe area vs drawn strip.** The canvas draws a 54px status bar; the app spends a real
device inset (59 on this reference device). Everything below the inset therefore sits 5pt lower on
hardware than on the canvas. Declared substitution, applies to all six frames, counted once.

**D2 · Web font stack.** `theme.ts:159` `SANS_WEB_STACK` is
`-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`; the canvas states
`-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif`. Both lead with
`-apple-system`, so the resolved face is identical on Apple platforms and invisible on iOS, where
`sans()` returns `'System'`. Carried over from the run-2 audit; unchanged.

**D3 · One-frame rule transient.** `useO3Field` publishes the frame index from a passive
`useEffect` (`v3.tsx:174-181`), so the first paint of every screen renders the rule at the
step-count fallback `Math.round(max(0.04, min(1, progress)) · 100)` (`v3.tsx:232`) before the
per-frame `field.rule` lands one commit later. For Section-1-Intro that is 6% for one frame instead
of 4%. The steady-state width is the design literal, so this is not a property mismatch — recorded
so it is on the ledger.

**D4 · `letterSpacing: 0` vs unstated.** The `md` CTA sets `letterSpacing: 0` where the canvas
states nothing (`normal`). In CSS those are numerically the same; on iOS, `letterSpacing: 0` maps to
`NSKernAttributeName = 0`, which pins tracking rather than leaving it to the font. No measurable
difference at 16.5pt SF. Recorded, not counted.

---

## Findings

**Row count: 219 comparison rows across 6 frames** (Table A 62, Table B 42, Table C 46, Table D 69).
Of those: **4 rows carry a MISMATCH mark — 3 distinct findings, all MISMATCH\*** (RN cannot express
the CSS), **1 of which is additionally a real MISMATCH on the web build**; **6 are `n/a`**
canvas-gallery chrome (the drawn status bar, its glyph set, its clock, the frame's mounting shadow,
`flex-shrink`, `cursor`); and the remaining **209 match**.

1. **MISMATCH\* — corner bloom loses `filter: blur(6px)`.**
   `/Users/admin/Documents/tideline/src/components/onboarding/v3.tsx:306-314` (`Ambient`).
   Design: the top-left bloom div carries `filter: blur(6px)` on top of its
   `radial-gradient(closest-side, rgba(180,170,150,0.14), rgba(19,19,19,0) 72%)`.
   App: no blur — react-native-svg exposes no blur filter primitive, so the app substitutes the
   radial gradient's own falloff (the substitution is stated in the source comment at
   `v3.tsx:303-305`). The gradient box, both stops and the ellipse geometry are exact; only the
   6px softening of the already-soft edge is absent. Applies to all six frames.

2. **MISMATCH\* / MISMATCH — section-intro title: `text-wrap: balance` is not expressed, and the
   web build sends `pretty` instead.**
   `/Users/admin/Documents/tideline/src/components/onboarding/v3.tsx:1183` renders the 26px section
   title through `AppText` with the default `body` variant. Design (both intros, line 166 of each
   pretty file): `text-wrap: balance`. On native there is no equivalent and the app substitutes
   RN's greedy last-fit wrapping. On web, `/Users/admin/Documents/tideline/src/components/ui/AppText.tsx:127`
   assigns `textWrap: 'pretty'` to every variant except `hero`/`display`/`title`, so the web build
   ships `pretty` where the canvas states `balance` — that half is a difference the app can close
   (render the section title through a `title`-family variant, or set `textWrap` explicitly).
   Affects V3-Section-1-Intro and V3-Section-2-Intro. *(Same defect the run-2 audit recorded for
   Sections 5–7; still open.)*

3. **MISMATCH\* — question title and section body lose `text-wrap: pretty` on native.**
   `/Users/admin/Documents/tideline/src/components/onboarding/v3.tsx:926` (question title, Q1–Q4)
   and `:1186` (section body, both intros). Design states `text-wrap: pretty`; RN has no
   line-breaking control on native and the app substitutes greedy wrapping. The web build does
   emit `pretty` (`AppText.tsx:127`), so this is native-only and not closable there.

**No MISMATCH found in anything the app can express.** Every one of the six field gradients, six
low-sun boxes (width, height, bottom, margin-left, glow colour, both stated alphas), six rule
percents, both intros' eyebrow/title/body/pill geometry and colour, all four question titles, all
twenty answer rows (top, state, label text, per-row 17 / 15.5 size split), the answer-row ring and
flood colours, the Back chevron and the selection tick (`d` compared character for character) are
identical between the canvas and the port. All twenty-six strings in this run were compared as
byte sequences in Python — including `you’re`, `you’ve`, `can’t` (U+2019) and the two em dashes
(U+2014) on Q4 — with no divergence.

**Upgrade to the run-2 ledger:** that audit listed the Yoga absolute-positioning basis as "stated,
not audited" and warned that every offset row would shift by +24x / +76y if the assumption failed.
It does not fail. Verified against
`node_modules/react-native/ReactCommon/yoga/yoga/algorithm/AbsoluteLayout.cpp:187-192` and `202-210`
(react-native 0.85.3): both inset branches add only the containing node's **border**, never its
padding, and `measuredDimension` is the border-box size. `left: 24` is 24 from the screen edge;
`top: 104` is 104 below the safe-area inset. The basis under both audits is sound.
