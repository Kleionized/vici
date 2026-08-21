# Property audit — onboarding run 1c (V3 Q10 → Q14, plus the Section 4 intro)

**Frames audited (6):** V3-Q10, V3-Section-4-Intro, V3-Q11, V3-Q12, V3-Q13, V3-Q14.

**Design source (read in full, every line):**
`/Users/admin/Documents/tideline/.uifinal/pretty/final/Email Login/<Slug>.html`
(257 / 205 / 281 / 257 / 233 / 257 lines). The raw frames
`/Users/admin/Documents/tideline/.uifinal/final/Email Login/<Slug>.html` were consulted for
byte-level text: every text node was extracted, HTML-unescaped and compared character for
character against the app literals (see Table F).

**App source (read in full):**
- `/Users/admin/Documents/tideline/src/components/onboarding/v3.tsx` (2056 lines) — shell,
  ambient field table, question engine, section intro, CTA
- `/Users/admin/Documents/tideline/src/app/(onboarding)/welcome.tsx` — funnel order, chrome map
- `/Users/admin/Documents/tideline/src/lib/theme.ts` — `sans()`, `sansFamily`
- `/Users/admin/Documents/tideline/src/components/ui/AppText.tsx` — variant metrics, the
  leading/tracking drop rules, the web `textWrap` assignment
- `/Users/admin/Documents/tideline/src/components/ui/press-scale.tsx` — `minHeight: 44`
- `/Users/admin/Documents/tideline/src/components/ui/Grain.tsx` — noise tiling

## The 54px offset

Each canvas frame is a 393 × 852 div whose `top` values include a 54px status-bar strip the app
never builds — the app spends that strip as `SafeAreaView edges={['top']}` padding instead
(`v3.tsx:242`). So for every absolutely placed element:

```
app top  =  canvas top − 54
```

Both numbers are given in every row below. Bottom-anchored elements are **not** offset: the canvas
frame's bottom edge and the app's screen bottom are the same line (`SafeAreaView` claims only the
top edge), so `bottom = 852 − canvasTop − height` holds exactly.

## Layout note — absolute insets vs. the shell's padding

Every element in this run is placed absolutely inside `O3Shell`'s content box, which carries
`paddingHorizontal: 24, paddingTop: 76, paddingBottom: 32` (`v3.tsx:277`). That padding does **not**
shift these children, in either engine: CSS resolves `left`/`top` on an absolutely positioned box
against its containing block's **padding edge**, and Yoga does the same (inset + parent border,
padding never added). The parent has no border, so `left: 24` lands at x 24 of the shell's box and
`top: 104` at y 104 below the safe-area inset. The port's numbers are therefore read literally
throughout, and this is a verified reading rather than an assumption.

## Row-sharing note

The six pretty frames were diffed against each other. Lines 48–141 (status bar, progress rule,
Back row) are **byte-identical across all six** except one line — the rule fill's `width:` percent.
Lines 1–47 (root + ambient) differ only in `data-screen-label`, the field gradient stops and the
low-sun block; the corner bloom and the noise layer are byte-identical across all six. That shared
chrome is compared once in Table A and its per-frame variables in Tables B and C, rather than being
transcribed six times.

---

## Table A — shared frame chrome (applies to all 6 frames)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| all 6 | frame root | width | 393px | device width (`flex:1`, `v3.tsx:239`) | match (canvas reference width) |
| all 6 | frame root | height | 852px | device height (`flex:1`) | match (canvas reference height) |
| all 6 | frame root | position | relative | `View {flex:1}` `v3.tsx:239` | match |
| all 6 | frame root | overflow | hidden | not set on root; the ambient layer clips itself (`v3.tsx:301`) | match (nothing else overflows) |
| all 6 | frame root | background | `linear-gradient(180deg, <top> 0%, <bot> 100%)` | `<LinearGradient colors={[field.top, field.bot]}>` `v3.tsx:302`; expo default start `{0.5,0}` → end `{0.5,1}` = 180deg, implicit stops 0/1 | match (per-frame stops in Table B) |
| all 6 | frame root | fill under the gradient | none stated | `backgroundColor: tone.bg` = `#0F0F0D` `v3.tsx:72,239` | match (fully covered by the gradient) |
| all 6 | frame root | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | iOS `'System'` (`theme.ts:161-169`); web `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif` (`theme.ts:159`) | match on iOS (both resolve SF Pro Text) — **MISMATCH on web**, Finding 3 |
| all 6 | frame root | -webkit-font-smoothing | antialiased | `WebkitFontSmoothing:'antialiased'` on web (`AppText.tsx:127`) | match |
| all 6 | frame root | flex-shrink | 0 | n/a — canvas gallery layout property | n/a |
| all 6 | frame root | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | n/a — canvas device-frame chrome, not app UI |
| all 6 | ambient wrapper | position / inset | absolute / 0 | `position:'absolute', top:0,left:0,right:0,bottom:0` `v3.tsx:301` | match |
| all 6 | ambient wrapper | overflow | hidden | `overflow:'hidden'` `v3.tsx:301` | match |
| all 6 | ambient wrapper | pointer-events | none | `pointerEvents="none"` `v3.tsx:301` | match |
| all 6 | ambient wrapper | z-order | first child of the frame, under all content | rendered before `SafeAreaView` `v3.tsx:241-242` | match |
| all 6 | corner bloom | left | −40px | `left:-40` `v3.tsx:306` | match |
| all 6 | corner bloom | top | −140px | `top:-140` `v3.tsx:306` | match |
| all 6 | corner bloom | width | 540px | `width={540}` `v3.tsx:306` | match |
| all 6 | corner bloom | height | 270px | `height={270}` `v3.tsx:306` | match |
| all 6 | corner bloom | border-radius | 50% | `<Ellipse cx=270 cy=135 rx=270 ry=135>` `v3.tsx:313` | match |
| all 6 | corner bloom | gradient shape | `radial-gradient(closest-side, …)` on 540×270 → rx 270 / ry 135 | `RadialGradient cx="50%" cy="50%" rx="50%" ry="50%"` on that ellipse `v3.tsx:308` | match |
| all 6 | corner bloom | stop 1 | `rgba(180,170,150,0.14)` at 0 | `offset="0" stopColor="#B4AA96" stopOpacity={0.14}` `v3.tsx:309` (B4,AA,96 = 180,170,150) | match |
| all 6 | corner bloom | stop 2 | `rgba(19,19,19,0)` at 72% | `offset="0.72" stopColor="#131313" stopOpacity={0}` `v3.tsx:310` (13,13,13 = 19,19,19) | match |
| all 6 | corner bloom | filter | `blur(6px)` | not applied — no blur primitive in react-native-svg (`v3.tsx:303-305`) | **MISMATCH\*** — Note D1 |
| all 6 | corner bloom | z-order | ambient child 1 (under sun and noise) | first `Svg` in `Ambient` `v3.tsx:306` | match |
| all 6 | low sun | left | 50% | `left:'50%'` `v3.tsx:315` | match |
| all 6 | low sun | margin-left | −(size/2), per frame | `marginLeft:-sun/2` `v3.tsx:315` | match (values in Table B) |
| all 6 | low sun | border-radius | 50% | `<Ellipse rx={sun/2} ry={sun/2}>` `v3.tsx:323` | match |
| all 6 | low sun | gradient shape | `radial-gradient(closest-side, …)` on a square box → circle | `RadialGradient cx/cy/rx/ry = 50%` on a square `Svg` `v3.tsx:317` | match |
| all 6 | low sun | stop offsets | 0 (implicit) / 45% / 72% | `offset="0"`, `"0.45"`, `"0.72"` `v3.tsx:318-320` | match |
| all 6 | low sun | stop 3 alpha | 0 | `stopOpacity={0}` `v3.tsx:320` | match |
| all 6 | low sun | filter | none stated | none | match |
| all 6 | low sun | z-order | ambient child 2 (over bloom, under noise) | second `Svg` `v3.tsx:315` | match |
| all 6 | noise | background-image | `url('noise-dark.png')` | `require('../../../assets/images/noise-dark.png')` `v3.tsx:54,325` | match |
| all 6 | noise | opacity | 0.12 | `opacity={0.12}` `v3.tsx:325` | match |
| all 6 | noise | inset | 0 | `top:0,left:0,right:0,bottom:0` (`Grain.tsx:16`) | match |
| all 6 | noise | repeat | `background-repeat` default → repeat at the file's own size | RN `Image resizeMode="repeat"` (`Grain.tsx:17`) | match |
| all 6 | noise | z-order | ambient child 3 (over bloom and sun) | last child of `Ambient` `v3.tsx:325` | match |
| all 6 | status bar | height | 54px | not built — OS status bar occupies the safe-area inset | n/a by design (the 54px offset) |
| all 6 | status bar | padding | `6px 32px 0 46px` | not built | n/a |
| all 6 | status bar | display / align / justify | flex / center / space-between | not built | n/a |
| all 6 | status bar | z-index | 20 | not built | n/a |
| all 6 | status bar | clock text / size / weight / colour / letter-spacing | `9:41` / 17px / 600 / `#F4F3F0` / −0.2px | not built | n/a |
| all 6 | status bar | icon cluster gap | 7px | not built | n/a |
| all 6 | status bar | signal svg | 19×12, four rects rx 0.7, fill `#F4F3F0` | not built | n/a |
| all 6 | status bar | wifi svg | 17×12, two paths + circle r 1.5, fill `#F4F3F0` | not built | n/a |
| all 6 | status bar | battery svg | 27×13, rect stroke `#F4F3F0` @0.35, inner rect fill, cap `fill-opacity 0.4` | not built | n/a |
| all 6 | progress track | left / right | 24px / 24px | `left:24, right:24` `v3.tsx:257` | match |
| all 6 | progress track | top | canvas 66 / app 12 | `top:12` `v3.tsx:257` | match |
| all 6 | progress track | height | 4px | `height:4` `v3.tsx:257` | match |
| all 6 | progress track | border-radius | 2px | `borderRadius:2` `v3.tsx:257` | match |
| all 6 | progress track | background | `rgba(255,255,255,0.2)` | `tone.track` = `'rgba(255,255,255,0.2)'` `v3.tsx:80` | match |
| all 6 | progress fill | left / top | 0 / 0 | first flow child of the track, no offset `v3.tsx:258` | match |
| all 6 | progress fill | width | per frame % | `` width:`${pct}%` `` with `pct = field.rule` `v3.tsx:232,258` | match (Table C) |
| all 6 | progress fill | height | 4px | `height:4` `v3.tsx:258` | match |
| all 6 | progress fill | border-radius | 2px | `borderRadius:2` `v3.tsx:258` | match |
| all 6 | progress fill | background | `#F4F3F0` | `tone.ink` = `'#F4F3F0'` `v3.tsx:74` | match |
| all 6 | Back row | presence | drawn on all six frames | `onBack` non-null for every step past index 0 (`welcome.tsx:274`) | match |
| all 6 | Back row | left | 16px | `left:16` `v3.tsx:267` | match |
| all 6 | Back row | top | canvas 94 / app 40 | `backTop ?? 40` `v3.tsx:267`; `welcome.tsx:279` passes `undefined` for these six | match |
| all 6 | Back row | display / align-items | flex / center | `flexDirection:'row', alignItems:'center'` `v3.tsx:267` | match |
| all 6 | Back row | gap | 9px | `gap:9` `v3.tsx:267` | match |
| all 6 | Back row | min-height | none stated | `minHeight:0` cancels `PressScale`'s 44 (`v3.tsx:267`, `press-scale.tsx:33`) | match |
| all 6 | Back chevron | width / height | 11 / 19 | `width={11} height={19}` `v3.tsx:268` | match |
| all 6 | Back chevron | viewBox | `0 0 11 19` | `viewBox="0 0 11 19"` `v3.tsx:268` | match |
| all 6 | Back chevron | path `d` | `M9.5 1.5L2 9.5l7.5 8` | `"M9.5 1.5L2 9.5l7.5 8"` `v3.tsx:269` | match |
| all 6 | Back chevron | fill | none | `fill="none"` `v3.tsx:268` | match |
| all 6 | Back chevron | stroke | `rgba(244,243,240,0.75)` | `backInk` = `'rgba(244,243,240,0.75)'` `v3.tsx:235` (night branch) | match |
| all 6 | Back chevron | stroke-width | 2.4 | `strokeWidth={2.4}` `v3.tsx:269` | match |
| all 6 | Back chevron | stroke-linecap / linejoin | round / round | `strokeLinecap="round" strokeLinejoin="round"` `v3.tsx:269` | match |
| all 6 | Back label | text | `Back` | `Back` `v3.tsx:271` | match |
| all 6 | Back label | font-size | 17px | `fontSize:17` `v3.tsx:271` | match |
| all 6 | Back label | font-weight | 400 | `sans('400')` `v3.tsx:271` | match |
| all 6 | Back label | line-height | not stated (natural) | inherited variant leading deleted — caller names `fontSize` without `lineHeight` (`AppText.tsx:120-121,142`) | match |
| all 6 | Back label | letter-spacing | not stated (normal) | inherited variant tracking deleted, same rule (`AppText.tsx:122,140`) | match |
| all 6 | Back label | colour | `rgba(244,243,240,0.75)` | `backInk` `v3.tsx:271` | match |

---

## Table B — per-frame ambient field

Design read from each frame's root `background` and its bottom-glow div. App read from `O3_FIELD`
(`v3.tsx:122-160`), addressed through `O3_Q_FIELD` (`v3.tsx:163`) and `O3_SECTION_FIELD`
(`v3.tsx:164`). Row resolution was recomputed from source, not assumed:
`connection`→q-index 9→row 14, `age`→10→row 16, `relationship`→11→row 17, `alone`→12→row 18,
`framing`→13→row 19; section 4 (`at: 10`) → section-index 3 → row 15.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| V3-Q10 | field | gradient stop 0 / stop 100 | `rgb(23,23,21)` / `rgb(39,38,36)` | row 14 `'rgb(23,23,21)'` / `'rgb(39,38,36)'` (`v3.tsx:137`) | match |
| V3-Q10 | low sun | width / height | 512 / 512 | `sun 512` (`v3.tsx:137`) | match |
| V3-Q10 | low sun | bottom / margin-left | −282 / −256 | `off −282`, `marginLeft −512/2 = −256` | match |
| V3-Q10 | low sun | glow colour | `rgba(255,236,196,·)` | `O3_WARM = '#FFECC4'` (`v3.tsx:118`) | match |
| V3-Q10 | low sun | stop 0 alpha / stop 45% alpha | 0.28 / 0.13 | `a0 0.28` / `a45 0.13` | match |
| V3-Section-4-Intro | field | gradient stop 0 / stop 100 | `rgb(24,24,22)` / `rgb(40,39,37)` | row 15 (`v3.tsx:138`) same | match |
| V3-Section-4-Intro | low sun | width / height | 521 / 521 | `sun 521` | match |
| V3-Section-4-Intro | low sun | bottom / margin-left | −287 / −260.5 | `off −287`, `−521/2 = −260.5` | match |
| V3-Section-4-Intro | low sun | glow colour | `rgba(255,255,255,·)` | `O3_COOL = '#FFFFFF'` (`v3.tsx:119`) | match |
| V3-Section-4-Intro | low sun | stop 0 alpha / stop 45% alpha | 0.30 / 0.14 | `a0 0.3` / `a45 0.14` | match |
| V3-Q11 | field | gradient stop 0 / stop 100 | `rgb(24,24,22)` / `rgb(40,39,37)` | row 16 (`v3.tsx:139`) same | match |
| V3-Q11 | low sun | width / height | 521 / 521 | `sun 521` | match |
| V3-Q11 | low sun | bottom / margin-left | −287 / −260.5 | `off −287`, `−260.5` | match |
| V3-Q11 | low sun | glow colour | `rgba(255,255,255,·)` | `#FFFFFF` | match |
| V3-Q11 | low sun | stop 0 alpha / stop 45% alpha | 0.30 / 0.14 | 0.3 / 0.14 | match |
| V3-Q12 | field | gradient stop 0 / stop 100 | `rgb(25,25,23)` / `rgb(41,40,38)` | row 17 (`v3.tsx:140`) same | match |
| V3-Q12 | low sun | width / height | 530 / 530 | `sun 530` | match |
| V3-Q12 | low sun | bottom / margin-left | −292 / −265 | `off −292`, `−530/2 = −265` | match |
| V3-Q12 | low sun | glow colour | `rgba(255,236,196,·)` | `#FFECC4` | match |
| V3-Q12 | low sun | stop 0 alpha / stop 45% alpha | 0.32 / 0.14 | 0.32 / 0.14 | match |
| V3-Q13 | field | gradient stop 0 / stop 100 | `rgb(25,25,23)` / `rgb(42,41,39)` | row 18 (`v3.tsx:141`) same | match |
| V3-Q13 | low sun | width / height | 539 / 539 | `sun 539` | match |
| V3-Q13 | low sun | bottom / margin-left | −296 / −269.5 | `off −296`, `−539/2 = −269.5` | match |
| V3-Q13 | low sun | glow colour | `rgba(255,255,255,·)` | `#FFFFFF` | match |
| V3-Q13 | low sun | stop 0 alpha / stop 45% alpha | 0.34 / 0.15 | 0.34 / 0.15 | match |
| V3-Q14 | field | gradient stop 0 / stop 100 | `rgb(26,26,24)` / `rgb(44,43,41)` | row 19 (`v3.tsx:142`) same | match |
| V3-Q14 | low sun | width / height | 548 / 548 | `sun 548` | match |
| V3-Q14 | low sun | bottom / margin-left | −301 / −274 | `off −301`, `−548/2 = −274` | match |
| V3-Q14 | low sun | glow colour | `rgba(255,236,196,·)` | `#FFECC4` | match |
| V3-Q14 | low sun | stop 0 alpha / stop 45% alpha | 0.36 / 0.16 | 0.36 / 0.16 | match |

---

## Table C — per-frame progress-rule fill width

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| V3-Q10 | progress fill | width | 43% | `O3_Q_FIELD[9] = 14` → `rule 43` (`v3.tsx:137`) | match |
| V3-Section-4-Intro | progress fill | width | 48% | `O3_SECTION_FIELD[3] = 15` → `rule 48` (`v3.tsx:138`) | match |
| V3-Q11 | progress fill | width | 48% | `O3_Q_FIELD[10] = 16` → `rule 48` (`v3.tsx:139`) | match |
| V3-Q12 | progress fill | width | 52% | `O3_Q_FIELD[11] = 17` → `rule 52` (`v3.tsx:140`) | match |
| V3-Q13 | progress fill | width | 57% | `O3_Q_FIELD[12] = 18` → `rule 57` (`v3.tsx:141`) | match |
| V3-Q14 | progress fill | width | 61% | `O3_Q_FIELD[13] = 19` → `rule 61` (`v3.tsx:142`) | match |

---

## Table D — V3-Section-4-Intro content

App: `O3SectionIntro` (`v3.tsx:1175-1192`), copy row `v3.tsx:1169`.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Section-4-Intro | eyebrow | left / right | 0 / 0 | `left:0, right:0` `v3.tsx:1180` | match |
| Section-4-Intro | eyebrow | top | canvas 308 / app 254 | `top:254` `v3.tsx:1180` | match |
| Section-4-Intro | eyebrow | text-align | center | `center` prop → `textAlign:'center'` `v3.tsx:1180` | match |
| Section-4-Intro | eyebrow | font-size | 13px | `fontSize:13` `v3.tsx:1180` | match |
| Section-4-Intro | eyebrow | font-weight | 600 | `sans('600')` `v3.tsx:1180` | match |
| Section-4-Intro | eyebrow | letter-spacing | 0.3px | `letterSpacing:0.3` `v3.tsx:1180` | match |
| Section-4-Intro | eyebrow | line-height | not stated (natural) | inherited leading deleted (`AppText.tsx:121,142`) | match |
| Section-4-Intro | eyebrow | text-transform | none (literal casing) | none set | match |
| Section-4-Intro | eyebrow | colour | `rgba(244,243,240,0.55)` | `'rgba(244,243,240,0.55)'` `v3.tsx:1180` | match |
| Section-4-Intro | eyebrow | text | `Section 4 of 6` | `'Section 4 of 6'` `v3.tsx:1169` | match |
| Section-4-Intro | title | left / right | 36 / 36 | `left:36, right:36` `v3.tsx:1183` | match |
| Section-4-Intro | title | top | canvas 338 / app 284 | `top:284` `v3.tsx:1183` | match |
| Section-4-Intro | title | text-align | center | `center` `v3.tsx:1183` | match |
| Section-4-Intro | title | font-size | 26px | `fontSize:26` `v3.tsx:1183` | match |
| Section-4-Intro | title | font-weight | 500 | `sans('500')` `v3.tsx:1183` | match |
| Section-4-Intro | title | line-height | 1.3 → 33.8px | `lineHeight:33.8` `v3.tsx:1183` | match |
| Section-4-Intro | title | letter-spacing | −0.2px | `letterSpacing:-0.2` `v3.tsx:1183` | match |
| Section-4-Intro | title | colour | `#F4F3F0` | `INK` = `'#F4F3F0'` `v3.tsx:696` | match |
| Section-4-Intro | title | text-wrap | balance | web: `textWrap:'pretty'` (body variant, `AppText.tsx:128`); native: no such property | **MISMATCH\*** — Finding 2 |
| Section-4-Intro | title | text | `A little about your life` | `'A little about your life'` `v3.tsx:1169` | match |
| Section-4-Intro | body | left / right | 44 / 44 | `left:44, right:44` `v3.tsx:1186` | match |
| Section-4-Intro | body | top | canvas 420 / app 366 | `top:366` `v3.tsx:1186` | match |
| Section-4-Intro | body | text-align | center | `center` `v3.tsx:1186` | match |
| Section-4-Intro | body | font-size | 15.5px | `fontSize:15.5` `v3.tsx:1186` | match |
| Section-4-Intro | body | font-weight | 400 | `sans('400')` `v3.tsx:1186` | match |
| Section-4-Intro | body | line-height | 24px | `lineHeight:24` `v3.tsx:1186` | match |
| Section-4-Intro | body | letter-spacing | not stated (normal) | inherited tracking deleted (`AppText.tsx:122,140`) | match |
| Section-4-Intro | body | colour | `rgba(244,243,240,0.7)` | `'rgba(244,243,240,0.7)'` `v3.tsx:1186` | match |
| Section-4-Intro | body | text-wrap | pretty | web `textWrap:'pretty'` (`AppText.tsx:128`) | match |
| Section-4-Intro | body | text | `So the plan fits your actual days, not a generic user.` | identical `v3.tsx:1169` | match |
| Section-4-Intro | CTA | left / right | 24 / 24 | `left:24, right:24` `v3.tsx:1189` | match |
| Section-4-Intro | CTA | top / bottom | canvas top 744 → bottom 52 | `bottom: O3_MD_CTA_BOTTOM` = `852−744−56` = 52 `v3.tsx:414,1189` | match |
| Section-4-Intro | CTA | height | 56px | `size="md"` → `height:56` `v3.tsx:396` | match |
| Section-4-Intro | CTA | border-radius | 28px | `borderRadius:28` `v3.tsx:398` | match |
| Section-4-Intro | CTA | background | `#F4F3F0` | `tone.fill` = `'#F4F3F0'` `v3.tsx:81,397` | match |
| Section-4-Intro | CTA | display / align-items / justify-content | flex / center / center | `alignItems:'center', justifyContent:'center'` `v3.tsx:399-400` | match |
| Section-4-Intro | CTA | border / shadow | none stated | none | match |
| Section-4-Intro | CTA | opacity | none stated (1) | `opacity: enabled ? 1 : 0.26`; always enabled here `v3.tsx:401` | match |
| Section-4-Intro | CTA | cursor | pointer | RN Pressable (web default pointer) | match |
| Section-4-Intro | CTA label | font-size | 16.5px | `fontSize:16.5` `v3.tsx:404` | match |
| Section-4-Intro | CTA label | font-weight | 600 | `sans('600')` `v3.tsx:404` | match |
| Section-4-Intro | CTA label | letter-spacing | not stated (normal) | `letterSpacing:0` for `md` `v3.tsx:404` | match |
| Section-4-Intro | CTA label | line-height | not stated (natural) | inherited leading deleted (`AppText.tsx:121,142`) | match |
| Section-4-Intro | CTA label | colour | `#131313` | `tone.onFill` = `'#131313'` `v3.tsx:82` | match |
| Section-4-Intro | CTA label | text | `Continue` | `'Continue'` `v3.tsx:1189` | match |
| Section-4-Intro | frame | extra elements | none beyond the above | none rendered | match |

---

## Table E — question layout shared by V3-Q10 · Q11 · Q12 · Q13 · Q14

App: `O3Question` (`v3.tsx:707-959`), `kind` defaults to `'list'` for all five (`v3.tsx:1133-1138`
state no `kind`), so the `list` branch at `v3.tsx:894-921` draws every row.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Q10–Q14 | title | left / right | 44 / 44 | `left:44, right:44` `v3.tsx:926` | match |
| Q10–Q14 | title | top | canvas 158 / app 104 | `top:104` `v3.tsx:926` | match |
| Q10–Q14 | title | text-align | center | `center` `v3.tsx:926` | match |
| Q10–Q14 | title | font-size | 22px | `fontSize:22` `v3.tsx:926` | match |
| Q10–Q14 | title | font-weight | 500 | `sans('500')` `v3.tsx:926` | match |
| Q10–Q14 | title | line-height | 1.32 → 29.04px | `lineHeight:29.04` `v3.tsx:926` | match |
| Q10–Q14 | title | letter-spacing | 0.1px | `letterSpacing:0.1` `v3.tsx:926` | match |
| Q10–Q14 | title | colour | `#F4F3F0` | `INK` `v3.tsx:696,926` | match |
| Q10–Q14 | title | text-wrap | pretty | web `textWrap:'pretty'` (`AppText.tsx:128`) | match |
| Q10–Q14 | title | max lines / max-width | unlimited, width 393−44−44 = 305 | no `numberOfLines`; `left/right 44` on a 393-wide box = 305 | match |
| Q10–Q14 | answer row | position | absolute | `position:'absolute'` `v3.tsx:903` | match |
| Q10–Q14 | answer row | left / right | 24 / 24 | `left:24, right:24` `v3.tsx:904-905` | match |
| Q10–Q14 | answer row | first top | canvas 310 / app 256 | `256 + 74*0` `v3.tsx:906` | match |
| Q10–Q14 | answer row | pitch | 74px (310→384→458→532→606) | `256 + 74*i` `v3.tsx:906` | match |
| Q10–Q14 | answer row | height | 60px | `height:60` `v3.tsx:907` | match |
| Q10–Q14 | answer row | min-height | none stated | `PressScale` `minHeight:44` < 60, no effect (`press-scale.tsx:33`) | match |
| Q10–Q14 | answer row | border-radius | 16px (all four corners) | `borderRadius:16` `v3.tsx:908` | match |
| Q10–Q14 | answer row | border-curve | none stated (circular) | not set — circular | match |
| Q10–Q14 | answer row | display / flex-direction | flex / row | `flexDirection:'row'` `v3.tsx:909` | match |
| Q10–Q14 | answer row | align-items | center | `alignItems:'center'` `v3.tsx:910` | match |
| Q10–Q14 | answer row | justify-content | space-between | `justifyContent:'space-between'` `v3.tsx:911` | match |
| Q10–Q14 | answer row | gap | 12px | `gap:12` `v3.tsx:912` | match |
| Q10–Q14 | answer row | padding | `0 22px` | `paddingHorizontal:22`, no vertical padding `v3.tsx:913` | match |
| Q10–Q14 | answer row | flex-wrap | none stated (nowrap) | RN default `nowrap` | match |
| Q10–Q14 | answer row (unselected) | background | `rgba(255,255,255,0.07)` | `'rgba(255,255,255,0.07)'` `v3.tsx:914` | match |
| Q10–Q14 | answer row (unselected) | box-shadow | `0 0 0 1px rgba(255,255,255,0.22)` | `boxShadow:'0 0 0 1px rgba(255,255,255,0.22)'` `v3.tsx:915` | match |
| Q10–Q14 | answer row (selected) | background | `#F4F3F0` | `INK` `v3.tsx:914` | match |
| Q10–Q14 | answer row (selected) | box-shadow | `0 0 0 1px rgba(0,0,0,0)` (fully transparent ring) | `undefined` `v3.tsx:915` | match (a 0-alpha ring paints nothing) |
| Q10–Q14 | answer row | border-width | none stated | none | match |
| Q10–Q14 | answer row | z-order | source order, after the title | rendered after the title `v3.tsx:926,934` | match |
| Q10–Q14 | row label | font-size | 17px | `opt.fs ?? 17`; none of these 20 options carries `fs` (`v3.tsx:1133-1138`) | match |
| Q10–Q14 | row label | font-weight | 500 | `sans('500')` `v3.tsx:917` | match |
| Q10–Q14 | row label | line-height | 20px | `lineHeight:20` `v3.tsx:917` | match |
| Q10–Q14 | row label | letter-spacing | not stated (normal) | inherited tracking deleted (`AppText.tsx:122,140`) | match |
| Q10–Q14 | row label | colour (unselected) | `#F4F3F0` | `INK` `v3.tsx:917` | match |
| Q10–Q14 | row label | colour (selected) | `#131313` | `ON_INK` = `'#131313'` `v3.tsx:697,917` | match |
| Q10–Q14 | row label | width behaviour | span, shrinkable, sits left of the tick | `flex:1` `v3.tsx:917` | match (same box for every label in this run — all fit one line) |
| Q10–Q14 | row label | max lines | unlimited | no `numberOfLines` | match |
| Q10–Q14 | tick | presence | selected row only | `{on ? <O3Tick/> : null}` `v3.tsx:918` | match |
| Q10–Q14 | tick | width / height | 16 / 12 | `width={16} height={12}` `v3.tsx:529` | match |
| Q10–Q14 | tick | viewBox | `0 0 16 12` | `viewBox="0 0 16 12"` `v3.tsx:529` | match |
| Q10–Q14 | tick | path `d` | `M1.5 6l4.4 4.5L14.5 1.5` | `"M1.5 6l4.4 4.5L14.5 1.5"` `v3.tsx:530` | match |
| Q10–Q14 | tick | fill | none | `fill="none"` `v3.tsx:529` | match |
| Q10–Q14 | tick | stroke | `#131313` | `c = ON_INK` `v3.tsx:918,530` | match |
| Q10–Q14 | tick | stroke-width | 2.4 | `strokeWidth={2.4}` `v3.tsx:530` | match |
| Q10–Q14 | tick | stroke-linecap / linejoin | round / round | `strokeLinecap="round" strokeLinejoin="round"` `v3.tsx:530` | match |

---

## Table F — per-frame answer rows (position, text, state)

Text compared against the raw frames after HTML-unescape, character for character, against the
literals in `O3_QUESTIONS` (`v3.tsx:1133-1138`). `&rsquo;` → U+2019 and `&mdash;` → U+2014 both
appear in the app literals in the same places; no other frame in this run contains a non-ASCII byte
or an entity.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| V3-Q10 | title | text | `How connected do you feel to the people around you?` | identical `v3.tsx:1133` | match |
| V3-Q10 | row 1 | top | canvas 310 / app 256 | `256 + 74·0` | match |
| V3-Q10 | row 1 | text | `Pretty isolated` | `o('Pretty isolated')` `v3.tsx:1133` | match |
| V3-Q10 | row 1 | state drawn | unselected (0.07 fill, 0.22 ring, ink `#F4F3F0`, no tick) | same treatment when `on === false` `v3.tsx:914-918` | match |
| V3-Q10 | row 2 | top | canvas 384 / app 330 | `256 + 74·1` | match |
| V3-Q10 | row 2 | text | `A few people, but I feel distant` | identical `v3.tsx:1133` | match |
| V3-Q10 | row 2 | state drawn | **selected** (`#F4F3F0` fill, no ring, ink `#131313`, tick) | same treatment when `on === true` | match |
| V3-Q10 | row 3 | top | canvas 458 / app 404 | `256 + 74·2` | match |
| V3-Q10 | row 3 | text | `Reasonably connected` | identical `v3.tsx:1133` | match |
| V3-Q10 | row 3 | state drawn | unselected | same | match |
| V3-Q10 | row 4 | top | canvas 532 / app 478 | `256 + 74·3` | match |
| V3-Q10 | row 4 | text | `Strongly connected` | identical `v3.tsx:1133` | match |
| V3-Q10 | row 4 | state drawn | unselected | same | match |
| V3-Q10 | rows | count | 4 | 4 options `v3.tsx:1133` | match |
| V3-Q11 | title | text | `Your age range.` | identical `v3.tsx:1135` | match |
| V3-Q11 | row 1 | top / text / state | canvas 310 / app 256 · `Under 18` · unselected | `256 + 74·0` · identical · same | match |
| V3-Q11 | row 2 | top / text / state | canvas 384 / app 330 · `18 to 24` · unselected | `256 + 74·1` · identical · same | match |
| V3-Q11 | row 3 | top | canvas 458 / app 404 | `256 + 74·2` | match |
| V3-Q11 | row 3 | text | `25 to 34` | identical `v3.tsx:1135` | match |
| V3-Q11 | row 3 | state drawn | **selected** | same treatment | match |
| V3-Q11 | row 4 | top / text / state | canvas 532 / app 478 · `35 to 44` · unselected | `256 + 74·3` · identical · same | match |
| V3-Q11 | row 5 | top / text / state | canvas 606 / app 552 · `45 or older` · unselected | `256 + 74·4` · identical · same | match |
| V3-Q11 | rows | count | 5 | 5 options `v3.tsx:1135` | match |
| V3-Q12 | title | text | `Relationship status.` | identical `v3.tsx:1136` | match |
| V3-Q12 | row 1 | top | canvas 310 / app 256 | `256 + 74·0` | match |
| V3-Q12 | row 1 | text | `Single` | identical `v3.tsx:1136` | match |
| V3-Q12 | row 1 | state drawn | **selected** | same treatment | match |
| V3-Q12 | row 2 | top / text / state | canvas 384 / app 330 · `Dating or in a relationship` · unselected | `256 + 74·1` · identical · same | match |
| V3-Q12 | row 3 | top / text / state | canvas 458 / app 404 · `Married or living with a partner` · unselected | `256 + 74·2` · identical · same | match |
| V3-Q12 | row 3 | font-size | 17px (the canvas does **not** drop this long label to 15.5) | no `fs` on this option `v3.tsx:1136` → 17 | match |
| V3-Q12 | row 4 | top | canvas 532 / app 478 | `256 + 74·3` | match |
| V3-Q12 | row 4 | text | `It&rsquo;s complicated` → `It’s complicated` (U+2019) | `'It’s complicated'` (U+2019) `v3.tsx:1136` | match |
| V3-Q12 | row 4 | state drawn | unselected | same | match |
| V3-Q12 | rows | count | 4 | 4 options `v3.tsx:1136` | match |
| V3-Q13 | title | text | `Do you have a lot of unstructured time alone?` | identical `v3.tsx:1137` | match |
| V3-Q13 | row 1 | top | canvas 310 / app 256 | `256 + 74·0` | match |
| V3-Q13 | row 1 | text | `Yes, most days` | identical `v3.tsx:1137` | match |
| V3-Q13 | row 1 | state drawn | **selected** | same treatment | match |
| V3-Q13 | row 2 | top / text / state | canvas 384 / app 330 · `Sometimes` · unselected | `256 + 74·1` · identical · same | match |
| V3-Q13 | row 3 | top / text / state | canvas 458 / app 404 · `Rarely` · unselected | `256 + 74·2` · identical · same | match |
| V3-Q13 | rows | count | 3 | 3 options `v3.tsx:1137` | match |
| V3-Q14 | title | text | `Does faith or a moral code play a part in why you want to stop?` | identical `v3.tsx:1138` | match |
| V3-Q14 | title | line count | wraps to three lines inside 305pt | same string, same box, same metrics | match |
| V3-Q14 | row 1 | top | canvas 310 / app 256 | `256 + 74·0` | match |
| V3-Q14 | row 1 | text | `Yes, it&rsquo;s central for me` → `Yes, it’s central for me` (U+2019) | `'Yes, it’s central for me'` `v3.tsx:1138` | match |
| V3-Q14 | row 1 | state drawn | unselected | same | match |
| V3-Q14 | row 2 | top / text / state | canvas 384 / app 330 · `Somewhat` · unselected | `256 + 74·1` · identical · same | match |
| V3-Q14 | row 3 | top | canvas 458 / app 404 | `256 + 74·2` | match |
| V3-Q14 | row 3 | text | `No &mdash; my reasons are practical` → `No — my reasons are practical` (U+2014) | `'No — my reasons are practical'` (U+2014) `v3.tsx:1138` | match |
| V3-Q14 | row 3 | state drawn | **selected** | same treatment | match |
| V3-Q14 | row 4 | top / text / state | canvas 532 / app 478 · `Prefer not to say` · unselected | `256 + 74·3` · identical · same | match |
| V3-Q14 | rows | count | 4 | 4 options `v3.tsx:1138` | match |

---

## Table G — what each frame does *not* draw

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Q10–Q14 | CTA pill | presence | none drawn on any of the five | `hasCta = multi \|\| typed \|\| skip` = false for all five (`v3.tsx:735,948`) | match |
| Q10–Q14 | "Select all that apply" | presence | not drawn | `multi` false → not rendered `v3.tsx:929` | match |
| Q10–Q14 | note line | presence | not drawn | `note` undefined for all five (`v3.tsx:1133-1138,935`) | match |
| Q10–Q14 | option glyphs | presence | none (list rows, no icons) | `kind` defaults to `'list'`; icons only in the `grid` branch `v3.tsx:791` | match |
| Section-4-Intro | answer rows | presence | none | `O3SectionIntro` draws none | match |
| Section-4-Intro | progress rule | presence | drawn (48%) | `bar` true — `'section-3'` is not in `NOBAR` (`welcome.tsx:142,275`) | match |
| all 6 | eight-segment rule | presence | not drawn (single rule) | `segments` undefined for these steps (`welcome.tsx:118-140,276`) | match |
| all 6 | paper register | applies | night register | `lit = i >= PLAN_IDX` false here → `NIGHT` (`welcome.tsx:224`, `v3.tsx:226`) | match |
| all 6 | funnel order | position | Q10 → S4 intro → Q11 → Q12 → Q13 → Q14 | `O3_QUESTIONS[9]`, section intro (`at:10`), then `[10] [11] [12] [13]` (`welcome.tsx:71-81`, `v3.tsx:1169`) | match |

---

## Notes — documented platform substitutions

**D1 — CSS blur.** The canvas states `filter: blur(6px)` on the corner bloom of all six frames.
`react-native-svg` has no blur filter primitive, so the port draws the same two-stop radial
gradient with no blur and lets the gradient's own falloff carry the edge (`v3.tsx:303-305`). The
box, the stop colours and the stop positions are identical; only the edge softness differs. Counted
as `MISMATCH*` once (it is one shared element), not six times.

**D2 — noise tiling.** Earlier runs recorded the grain as a `contentFit="cover"` deviation. That is
no longer true: `Grain` now uses React Native's own `Image` with `resizeMode="repeat"`
(`Grain.tsx:17`), which tiles the asset at its native size exactly as the CSS `background-image`
does. No deviation remains.

**D3 — the frame's own drop shadow.** `box-shadow: 0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px
rgba(40,38,32,0.16)` on the root div is the canvas gallery's device-frame chrome. Not app UI; `n/a`
rather than a mismatch.

---

## Findings

**Row count: 264 comparison rows across 6 frames** (Table A 75, B 30, C 6, D 46, E 46, F 52, G 9).
Of those, **2 are MISMATCH\*** (Findings 1–2), **1 is a web-only MISMATCH** (Finding 3), 11 are
`n/a` canvas-chrome rows (the nine unbuilt status-bar rows, the gallery frame's `flex-shrink` and
its drop shadow), and the remaining 250 match.

1. **Corner bloom loses `filter: blur(6px)`** — MISMATCH\*, one element shared by all six frames.
   App file `/Users/admin/Documents/tideline/src/components/onboarding/v3.tsx`, lines 303–314.
   Current app value: no blur; a `RadialGradient` (`#B4AA96` @0.14 → `#131313` @0 at 72%) on a
   540 × 270 ellipse. Design value: the same gradient with `filter: blur(6px)` applied.
   **What the app substitutes:** the gradient's own falloff. RN SVG has no blur primitive, so this
   cannot be closed without a different technique (a pre-blurred PNG, or `expo-blur` over a solid
   ellipse). Every other property of the bloom — box, radius, both stops and their positions — is
   exact.

2. **Section-intro title loses `text-wrap: balance`** — MISMATCH\*.
   App file `/Users/admin/Documents/tideline/src/components/onboarding/v3.tsx`, line 1183; the
   value is assigned in `/Users/admin/Documents/tideline/src/components/ui/AppText.tsx`, line 128.
   Current app value: `textWrap: 'pretty'` (every variant except `hero`/`display`/`title` gets
   `pretty`, and line 1183 renders through the default `body` variant). Design value:
   `text-wrap: balance` on the 26px `A little about your life`.
   **What the app substitutes:** on native, nothing — React Native has no `textWrap`, so the line
   breaks are the platform's. On the web build the property *is* expressible and the app is
   choosing `pretty`, so on web this is closable by passing `variant="title"` or an explicit
   `textWrap`. The body line under it correctly states `pretty` and matches. This title fits on one
   line at 26px inside 321pt, so nothing visibly differs today.

3. **Web font-stack literal differs** — MISMATCH on the web build only.
   App file `/Users/admin/Documents/tideline/src/lib/theme.ts`, line 159. Current app value:
   `"-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"`. Design value:
   `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif`. Both lead with
   `-apple-system`, so on Apple platforms the resolved face is identical; on a non-Apple web client
   the fallback chain diverges (`Segoe UI`/`Arial` vs `system-ui`/`Helvetica Neue`). No effect on
   iOS, where `sans()` returns `'System'` (`theme.ts:161-169`) and SF Pro Text is what renders.

No other drift found. All six field gradients, all six low-sun boxes with their sizes, hangs,
margins, glow colours and stop-triples, all six progress-rule widths, the shared status-bar-relative
chrome, the Back row and its path `d`, the question title block, all twenty answer rows with their
tops, fills, rings, inks, tick path and drawn states, every string down to the apostrophe and the
em dash, and the section intro's eyebrow, title, body and 56pt pill are identical between the canvas
and the port.
