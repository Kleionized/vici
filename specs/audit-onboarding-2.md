# Property audit — onboarding run 2 (V3 Section 5 → Q26, plus the four lesson interstitials)

**Frames audited (19):** V3-Section-5-Intro, V3-Q15, V3-Q16, V3-Q17, V3-Q18, V3-Section-6-Intro,
V3-Q19, V3-Q20, V3-Section-7-Intro, V3-Q21, V3-Q22, V3-Q23, V3-Q24-Name, V3-Q25-Age,
V3-Q26-Gender, Lesson-Willpower, Lesson-Rewire, Lesson-Anchor, Lesson-Small-Steps.

**Design source:** `.uifinal/pretty/final/Email Login/<Slug>.html` (read in full, every line;
raw `.uifinal/final/Email Login/<Slug>.html` consulted for byte-level text entities).

**App source:**
- `/Users/admin/Documents/tideline/src/components/onboarding/v3.tsx` (read in full, 2056 lines)
- `/Users/admin/Documents/tideline/src/components/onboarding/art.tsx` (lesson art + field table)
- `/Users/admin/Documents/tideline/src/app/(onboarding)/welcome.tsx` (funnel order, chrome map)
- `/Users/admin/Documents/tideline/src/lib/theme.ts` (`sans()`, `colors`)
- `/Users/admin/Documents/tideline/src/components/ui/AppText.tsx`, `src/components/ui/press-scale.tsx`

## The 54px offset

Every canvas frame is a 393 × 852 div whose `top` values include a 54px status-bar strip the app
never builds — the app spends that strip as `SafeAreaView edges={['top']}` padding instead. So for
every absolutely placed element:

```
app top  =  canvas top − 54
```

Both numbers are stated in every row below (`canvas T / app T−54`). Bottom-anchored elements are
not offset: the canvas frame's bottom edge and the app's screen bottom are the same line, so
`bottom = 852 − canvasTop − height` holds exactly.

## Layout assumption (stated, not audited)

Every screen in this run places its content absolutely inside
`O3Shell`'s content box — `v3.tsx:278`, `<View style={{flex:1, paddingHorizontal:24, paddingTop:76,
paddingBottom:32}}>`. The port depends on Yoga positioning an absolutely-placed child from its
parent's **border** box and ignoring that padding (the author states this at `v3.tsx:275-277` and
again at `v3.tsx:244-248`). Every `left: 24` / `top: 104` below is read under that assumption. If
Yoga ever consults padding on this RN version, *every* row in this audit shifts by +24 x and +76 y
at once — that is a single global question, not per-element drift, and it cannot be settled by
reading source.

## Row-count note

Frames in this run share a chrome block that is **byte-identical** across all 19 pretty files —
verified by `diff` of lines 1–101 plus the rule/Back blocks; the only lines that differ are the
`data-screen-label`, the field gradient and the low-sun box. That shared chrome is compared once
in Table A rather than transcribed 19 times; the per-frame values that *do* differ are in Tables B
and C, one row per frame per property.

---

## Table A — shared frame chrome (applies to all 19 frames)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| all 19 | frame root | width | 393px | device width (`flex:1`) | match (canvas reference width) |
| all 19 | frame root | height | 852px | device height (`flex:1`) | match (canvas reference height) |
| all 19 | frame root | position | relative | `View {flex:1}` | match |
| all 19 | frame root | overflow | hidden | not set on root; ambient layer clips itself (`v3.tsx:302`) | match (nothing else overflows) |
| all 19 | frame root | background | `linear-gradient(180deg, <top> 0%, <bot> 100%)` | `<LinearGradient colors={[field.top, field.bot]}>` `v3.tsx:303`, default start `{0.5,0}` → end `{0.5,1}` = 180deg | match (per-frame stops in Table B) |
| all 19 | frame root | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | iOS `'System'`; web `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif` (`theme.ts:159,161`) | match on iOS (both resolve SF Pro); web stack literal differs — see Finding 2 |
| all 19 | frame root | -webkit-font-smoothing | antialiased | `WebkitFontSmoothing:'antialiased'` on web only (`AppText.tsx:126`) | match |
| all 19 | frame root | flex-shrink | 0 | n/a (canvas gallery layout property) | n/a |
| all 19 | frame root | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | n/a — canvas device-frame chrome, not app UI |
| all 19 | ambient wrapper | position / inset | absolute / 0 | `position:'absolute', top:0,left:0,right:0,bottom:0` `v3.tsx:302` | match |
| all 19 | ambient wrapper | overflow | hidden | `overflow:'hidden'` `v3.tsx:302` | match |
| all 19 | ambient wrapper | pointer-events | none | `pointerEvents="none"` `v3.tsx:302` | match |
| all 19 | ambient wrapper | z-order | first child, below all content | first child of root, before `SafeAreaView` `v3.tsx:242` | match |
| all 19 | corner bloom | left | −40px | `left:-40` `v3.tsx:307` | match |
| all 19 | corner bloom | top | −140px | `top:-140` `v3.tsx:307` | match |
| all 19 | corner bloom | width | 540px | `width={540}` `v3.tsx:307` | match |
| all 19 | corner bloom | height | 270px | `height={270}` `v3.tsx:307` | match |
| all 19 | corner bloom | border-radius | 50% | `<Ellipse cx=270 cy=135 rx=270 ry=135>` `v3.tsx:314` | match |
| all 19 | corner bloom | gradient shape | `radial-gradient(closest-side, …)` on 540×270 → rx 270 ry 135 | RadialGradient `cx 50% cy 50% rx 50% ry 50%` on a 540×270 ellipse `v3.tsx:309` | match |
| all 19 | corner bloom | stop 0 | `rgba(180,170,150,0.14)` | `stopColor="#B4AA96" stopOpacity={0.14}` `v3.tsx:310` (180,170,150 = B4,AA,96) | match |
| all 19 | corner bloom | stop 2 | `rgba(19,19,19,0)` at 72% | `offset="0.72" stopColor="#131313" stopOpacity={0}` `v3.tsx:311` (19,19,19 = 13,13,13) | match |
| all 19 | corner bloom | filter | `blur(6px)` | not applied (RN SVG has no blur filter) `v3.tsx:304-306` | deviation — documented platform substitution, see Note D1 |
| all 19 | low sun | left | 50% | `left:'50%'` `v3.tsx:316` | match |
| all 19 | low sun | margin-left | −S/2 (per frame) | `marginLeft:-sun/2` `v3.tsx:316` | match (per-frame values in Table B) |
| all 19 | low sun | bottom | per frame | `bottom:off` `v3.tsx:316` | match (Table B) |
| all 19 | low sun | width / height | S × S per frame | `width={sun} height={sun}` `v3.tsx:316` | match (Table B) |
| all 19 | low sun | border-radius | 50% | `<Ellipse rx={sun/2} ry={sun/2}>` `v3.tsx:324` | match |
| all 19 | low sun | gradient stop offsets | 0 (implicit), 45%, 72% | `offset="0"`, `"0.45"`, `"0.72"` `v3.tsx:319-321` | match |
| all 19 | low sun | stop 3 alpha | 0 at 72% | `stopOpacity={0}` at 0.72 `v3.tsx:321` | match |
| all 19 | noise | background-image | `url('noise-dark.png')` | `require('../../../assets/images/noise-dark.png')` `v3.tsx:55,326` | match |
| all 19 | noise | opacity | 0.12 | `opacity:0.12` `v3.tsx:326` | match |
| all 19 | noise | inset | 0 | `top:0,left:0,right:0,bottom:0` `v3.tsx:326` | match |
| all 19 | noise | fit | (tiled png) | `contentFit="cover"` `v3.tsx:326` | deviation — cover vs repeat, see Note D2 |
| all 19 | status bar | height / padding / z-index | 54px / `6px 32px 0 46px` / 20 | not built — OS status bar occupies the inset | n/a by design (the 54px offset above) |
| all 19 | status bar | clock "9:41" | 17px / 600 / `#F4F3F0` / ls −0.2px | not built | n/a |
| all 19 | status bar | signal svg | 19×12, four rects rx 0.7, fill `#F4F3F0` | not built | n/a |
| all 19 | status bar | wifi svg | 17×12, two paths + circle r 1.5, fill `#F4F3F0` | not built | n/a |
| all 19 | status bar | battery svg | 27×13, rect stroke `#F4F3F0`@0.35, fill rect, cap `fill-opacity 0.4` | not built | n/a |
| all 19 | progress track | left / right | 24px / 24px | `left:24, right:24` `v3.tsx:258` | match |
| all 19 | progress track | top | canvas 66 / app 12 | `top:12` `v3.tsx:258` | match |
| all 19 | progress track | height | 4px | `height:4` `v3.tsx:258` | match |
| all 19 | progress track | border-radius | 2px | `borderRadius:2` `v3.tsx:258` | match |
| all 19 | progress track | background | `rgba(255,255,255,0.2)` | `tone.track` = `'rgba(255,255,255,0.2)'` `v3.tsx:81` | match |
| all 19 | progress fill | left / top | 0 / 0 | first flex child of the track, no offset `v3.tsx:259` | match |
| all 19 | progress fill | width | per frame % | `width: \`${pct}%\`` with `pct = field.rule` `v3.tsx:233,259` | match (Table C) |
| all 19 | progress fill | height | 4px | `height:4` `v3.tsx:259` | match |
| all 19 | progress fill | border-radius | 2px | `borderRadius:2` `v3.tsx:259` | match |
| all 19 | progress fill | background | `#F4F3F0` | `tone.ink` = `'#F4F3F0'` `v3.tsx:76` | match |
| all 19 | Back row | left | 16px | `left:16` `v3.tsx:268` | match |
| all 19 | Back row | top | canvas 94 (questions/intros) / 96 (lessons) | `backTop ?? 40` `v3.tsx:268`; lessons pass `PAPER_BACK = 96−54 = 42` (`welcome.tsx:121,124-127`) | match (40 = 94−54; 42 = 96−54) |
| all 19 | Back row | display / align-items | flex / center | `flexDirection:'row', alignItems:'center'` `v3.tsx:268` | match |
| all 19 | Back row | gap | 9px | `gap:9` `v3.tsx:268` | match |
| all 19 | Back chevron | svg width / height | 11 / 19 | `width={11} height={19}` `v3.tsx:269` | match |
| all 19 | Back chevron | viewBox | `0 0 11 19` | `viewBox="0 0 11 19"` `v3.tsx:269` | match |
| all 19 | Back chevron | path `d` | `M9.5 1.5L2 9.5l7.5 8` | `"M9.5 1.5L2 9.5l7.5 8"` `v3.tsx:270` | match |
| all 19 | Back chevron | fill | none | `fill="none"` `v3.tsx:269` | match |
| all 19 | Back chevron | stroke | `rgba(244,243,240,0.75)` | `backInk` = `'rgba(244,243,240,0.75)'` `v3.tsx:236` | match |
| all 19 | Back chevron | stroke-width | 2.4 | `strokeWidth={2.4}` `v3.tsx:270` | match |
| all 19 | Back chevron | stroke-linecap / linejoin | round / round | `strokeLinecap="round" strokeLinejoin="round"` `v3.tsx:270` | match |
| all 19 | Back label | font-size | 17px | `fontSize:17` `v3.tsx:272` | match |
| all 19 | Back label | font-weight | 400 | `sans('400')` `v3.tsx:272` | match |
| all 19 | Back label | line-height | not stated (natural) | inherited leading dropped because the caller names `fontSize` without `lineHeight` (`AppText.tsx:119-121,138`) | match |
| all 19 | Back label | letter-spacing | not stated (normal) | inherited tracking dropped, same rule (`AppText.tsx:120,137`) | match |
| all 19 | Back label | color | `rgba(244,243,240,0.75)` | `backInk` `v3.tsx:272` | match |
| all 19 | Back label | text | `Back` | `Back` `v3.tsx:272` | match |

---

## Table B — per-frame ambient field

Design columns read from each frame's root `background` and its bottom-glow div. App columns read
from `O3_FIELD` in `v3.tsx:123-161`, addressed through `O3_Q_FIELD` (`v3.tsx:164`),
`O3_SECTION_FIELD` (`v3.tsx:165`) and `O3_LESSON_FIELD` (`v3.tsx:166`).

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Section-5-Intro | field | gradient stop 0 / stop 100 | `rgb(28,28,26)` / `rgb(46,45,43)` | row 20 `'rgb(28,28,26)'` / `'rgb(46,45,43)'` (`v3.tsx:144`) | match |
| Section-5-Intro | low sun | size / bottom / margin-left | 567 / −312 / −283.5 | `sun 567`, `off −312`, `marginLeft −283.5` | match |
| Section-5-Intro | low sun | glow colour | `rgba(255,255,255,·)` | `O3_COOL = '#FFFFFF'` | match |
| Section-5-Intro | low sun | stop 0 alpha / stop 45% alpha | 0.39 / 0.18 | `a0 0.39` / `a45 0.18` | match |
| V3-Q15 | field | gradient stop 0 / stop 100 | `rgb(28,28,26)` / `rgb(46,45,43)` | row 21 (`v3.tsx:145`) same | match |
| V3-Q15 | low sun | size / bottom / margin-left | 567 / −312 / −283.5 | 567 / −312 / −283.5 | match |
| V3-Q15 | low sun | glow colour / alphas | `rgba(255,255,255,·)` 0.39 / 0.18 | `#FFFFFF` 0.39 / 0.18 | match |
| V3-Q16 | field | gradient stop 0 / stop 100 | `rgb(28,28,26)` / `rgb(47,46,44)` | row 22 (`v3.tsx:146`) same | match |
| V3-Q16 | low sun | size / bottom / margin-left | 576 / −317 / −288 | 576 / −317 / −288 | match |
| V3-Q16 | low sun | glow colour / alphas | `rgba(255,236,196,·)` 0.41 / 0.18 | `O3_WARM = '#FFECC4'` 0.41 / 0.18 | match |
| V3-Q17 | field | gradient stop 0 / stop 100 | `rgb(29,29,27)` / `rgb(49,48,46)` | row 23 (`v3.tsx:147`) same | match |
| V3-Q17 | low sun | size / bottom / margin-left | 585 / −322 / −292.5 | 585 / −322 / −292.5 | match |
| V3-Q17 | low sun | glow colour / alphas | `rgba(255,255,255,·)` 0.43 / 0.19 | `#FFFFFF` 0.43 / 0.19 | match |
| V3-Q18 | field | gradient stop 0 / stop 100 | `rgb(30,30,28)` / `rgb(50,49,47)` | row 25 (`v3.tsx:149`) same | match |
| V3-Q18 | low sun | size / bottom / margin-left | 594 / −327 / −297 | 594 / −327 / −297 | match |
| V3-Q18 | low sun | glow colour / alphas | `rgba(255,236,196,·)` 0.45 / 0.20 | `#FFECC4` 0.45 / 0.2 | match |
| Section-6-Intro | field | gradient stop 0 / stop 100 | `rgb(31,31,29)` / `rgb(51,50,48)` | row 26 (`v3.tsx:150`) same | match |
| Section-6-Intro | low sun | size / bottom / margin-left | 603 / −332 / −301.5 | 603 / −332 / −301.5 | match |
| Section-6-Intro | low sun | glow colour / alphas | `rgba(255,255,255,·)` 0.47 / 0.21 | `#FFFFFF` 0.47 / 0.21 | match |
| V3-Q19 | field | gradient stop 0 / stop 100 | `rgb(31,31,29)` / `rgb(51,50,48)` | row 27 (`v3.tsx:151`) same | match |
| V3-Q19 | low sun | size / bottom / margin-left | 603 / −332 / −301.5 | 603 / −332 / −301.5 | match |
| V3-Q19 | low sun | glow colour / alphas | `rgba(255,255,255,·)` 0.47 / 0.21 | `#FFFFFF` 0.47 / 0.21 | match |
| V3-Q20 | field | gradient stop 0 / stop 100 | `rgb(32,32,30)` / `rgb(54,53,51)` | row 29 (`v3.tsx:153`) same | match |
| V3-Q20 | low sun | size / bottom / margin-left | 622 / −342 / −311 | 622 / −342 / −311 | match |
| V3-Q20 | low sun | glow colour / alphas | `rgba(255,236,196,·)` 0.50 / 0.23 | `#FFECC4` 0.5 / 0.23 | match |
| Section-7-Intro | field | gradient stop 0 / stop 100 | `rgb(33,33,31)` / `rgb(55,54,52)` | row 30 (`v3.tsx:154`) same | match |
| Section-7-Intro | low sun | size / bottom / margin-left | 631 / −347 / −315.5 | 631 / −347 / −315.5 | match |
| Section-7-Intro | low sun | glow colour / alphas | `rgba(255,255,255,·)` 0.52 / 0.23 | `#FFFFFF` 0.52 / 0.23 | match |
| V3-Q21 | field | gradient stop 0 / stop 100 | `rgb(33,33,31)` / `rgb(55,54,52)` | row 31 (`v3.tsx:155`) same | match |
| V3-Q21 | low sun | size / bottom / margin-left | 631 / −347 / −315.5 | 631 / −347 / −315.5 | match |
| V3-Q21 | low sun | glow colour / alphas | `rgba(255,255,255,·)` 0.52 / 0.23 | `#FFFFFF` 0.52 / 0.23 | match |
| V3-Q22 | field | gradient stop 0 / stop 100 | `rgb(34,34,32)` / `rgb(56,55,53)` | row 32 (`v3.tsx:156`) same | match |
| V3-Q22 | low sun | size / bottom / margin-left | 640 / −352 / −320 | 640 / −352 / −320 | match |
| V3-Q22 | low sun | glow colour / alphas | `rgba(255,236,196,·)` 0.54 / 0.24 | `#FFECC4` 0.54 / 0.24 | match |
| V3-Q23 | field | gradient stop 0 / stop 100 | `rgb(35,35,33)` / `rgb(58,57,55)` | row 33 (`v3.tsx:157`) same | match |
| V3-Q23 | low sun | size / bottom / margin-left | 640 / −352 / −320 | 640 / −352 / −320 | match |
| V3-Q23 | low sun | glow colour / alphas | `rgba(255,236,196,·)` 0.56 / 0.25 | `#FFECC4` 0.56 / 0.25 | match |
| V3-Q24-Name | field | gradient stop 0 / stop 100 | `rgb(36,36,34)` / `rgb(59,58,56)` | row 34 (`v3.tsx:158`) same | match |
| V3-Q24-Name | low sun | size / bottom / margin-left | 640 / −352 / −320 | 640 / −352 / −320 | match |
| V3-Q24-Name | low sun | glow colour / alphas | `rgba(255,236,196,·)` 0.56 / 0.25 | `#FFECC4` 0.56 / 0.25 | match |
| V3-Q25-Age | field | gradient stop 0 / stop 100 | `rgb(37,37,35)` / `rgb(60,59,57)` | row 35 (`v3.tsx:159`) same | match |
| V3-Q25-Age | low sun | size / bottom / margin-left | 640 / −352 / −320 | 640 / −352 / −320 | match |
| V3-Q25-Age | low sun | glow colour / alphas | `rgba(255,236,196,·)` 0.56 / 0.25 | `#FFECC4` 0.56 / 0.25 | match |
| V3-Q26-Gender | field | gradient stop 0 / stop 100 | `rgb(38,38,36)` / `rgb(61,60,58)` | row 36 (`v3.tsx:160`) same | match |
| V3-Q26-Gender | low sun | size / bottom / margin-left | 640 / −352 / −320 | 640 / −352 / −320 | match |
| V3-Q26-Gender | low sun | glow colour / alphas | `rgba(255,236,196,·)` 0.56 / 0.25 | `#FFECC4` 0.56 / 0.25 | match |
| Lesson-Willpower | field | gradient stop 0 / stop 100 | `rgb(21,21,19)` / `rgb(35,34,32)` | row 4 (`v3.tsx:128`) same | match |
| Lesson-Willpower | low sun | size / bottom / margin-left | 484 / −266 / −242 | 484 / −266 / −242 | match |
| Lesson-Willpower | low sun | glow colour / alphas | `rgba(255,236,196,·)` 0.28 / 0.12 | `#FFECC4` 0.28 / 0.12 | match |
| Lesson-Rewire | field | gradient stop 0 / stop 100 | `rgb(27,27,25)` / `rgb(45,44,42)` | row 10 (`v3.tsx:134`) same | match |
| Lesson-Rewire | low sun | size / bottom / margin-left | 558 / −307 / −279 | 558 / −307 / −279 | match |
| Lesson-Rewire | low sun | glow colour / alphas | `rgba(255,236,196,·)` 0.38 / 0.17 | `#FFECC4` 0.38 / 0.17 | match |
| Lesson-Anchor | field | gradient stop 0 / stop 100 | `rgb(30,30,28)` / `rgb(50,49,47)` | row 24 (`v3.tsx:148`) same | match |
| Lesson-Anchor | low sun | size / bottom / margin-left | 590 / −320 / −295 | 590 / −320 / −295 | match |
| Lesson-Anchor | low sun | glow colour / alphas | `rgba(255,236,196,·)` 0.44 / 0.20 | `#FFECC4` 0.44 / 0.2 | match |
| Lesson-Small-Steps | field | gradient stop 0 / stop 100 | `rgb(32,32,30)` / `rgb(52,51,49)` | row 28 (`v3.tsx:152`) same | match |
| Lesson-Small-Steps | low sun | size / bottom / margin-left | 613 / −337 / −306.5 | 613 / −337 / −306.5 | match |
| Lesson-Small-Steps | low sun | glow colour / alphas | `rgba(255,255,255,·)` 0.48 / 0.22 | `#FFFFFF` 0.48 / 0.22 | match |

---

## Table C — per-frame progress-rule fill width

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Section-5-Intro | progress fill | width | 65% | `O3_SECTION_FIELD[4] = 20` → `rule 65` | match |
| V3-Q15 | progress fill | width | 65% | `O3_Q_FIELD[14] = 21` → `rule 65` | match |
| V3-Q16 | progress fill | width | 70% | `O3_Q_FIELD[15] = 22` → `rule 70` | match |
| V3-Q17 | progress fill | width | 74% | `O3_Q_FIELD[16] = 23` → `rule 74` | match |
| V3-Q18 | progress fill | width | 78% | `O3_Q_FIELD[17] = 25` → `rule 78` | match |
| Section-6-Intro | progress fill | width | 83% | `O3_SECTION_FIELD[5] = 26` → `rule 83` | match |
| V3-Q19 | progress fill | width | 83% | `O3_Q_FIELD[18] = 27` → `rule 83` | match |
| V3-Q20 | progress fill | width | 87% | `O3_Q_FIELD[19] = 29` → `rule 87` | match |
| Section-7-Intro | progress fill | width | 91% | `O3_SECTION_FIELD[6] = 30` → `rule 91` | match |
| V3-Q21 | progress fill | width | 91% | `O3_Q_FIELD[20] = 31` → `rule 91` | match |
| V3-Q22 | progress fill | width | 96% | `O3_Q_FIELD[21] = 32` → `rule 96` | match |
| V3-Q23 | progress fill | width | 100% | `O3_Q_FIELD[22] = 33` → `rule 100` | match |
| V3-Q24-Name | progress fill | width | 100% | `O3_Q_FIELD[23] = 34` → `rule 100` | match |
| V3-Q25-Age | progress fill | width | 100% | `O3_Q_FIELD[24] = 35` → `rule 100` | match |
| V3-Q26-Gender | progress fill | width | 100% | `O3_Q_FIELD[25] = 36` → `rule 100` | match |
| Lesson-Willpower | progress fill | width | 15% | `O3_LESSON_FIELD.willpower = 4` → `rule 15` | match |
| Lesson-Rewire | progress fill | width | 32% | `O3_LESSON_FIELD.rewire = 10` → `rule 32` | match |
| Lesson-Anchor | progress fill | width | 76% | `O3_LESSON_FIELD.anchor = 24` → `rule 76` | match |
| Lesson-Small-Steps | progress fill | width | 85% | `O3_LESSON_FIELD.steps = 28` → `rule 85` | match |

---

## Table D — the section-intro layout (Section 5, Section 6, Section 7)

All three frames draw the identical four content elements; only the strings differ (Table E).

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| S5 · S6 · S7 | eyebrow | left / right | 0 / 0 | `left:0, right:0` `v3.tsx:1181` | match |
| S5 · S6 · S7 | eyebrow | top | canvas 308 / app 254 | `top:254` `v3.tsx:1181` | match |
| S5 · S6 · S7 | eyebrow | text-align | center | `center` prop → `textAlign:'center'` `v3.tsx:1181` | match |
| S5 · S6 · S7 | eyebrow | font-size | 13px | `fontSize:13` `v3.tsx:1181` | match |
| S5 · S6 · S7 | eyebrow | font-weight | 600 | `sans('600')` `v3.tsx:1181` | match |
| S5 · S6 · S7 | eyebrow | letter-spacing | 0.3px | `letterSpacing:0.3` `v3.tsx:1181` | match |
| S5 · S6 · S7 | eyebrow | line-height | not stated (natural) | inherited leading dropped (`AppText.tsx:119,138`) | match |
| S5 · S6 · S7 | eyebrow | text-transform | none | none set | match |
| S5 · S6 · S7 | eyebrow | color | `rgba(244,243,240,0.55)` | `'rgba(244,243,240,0.55)'` `v3.tsx:1181` | match |
| S5 · S6 · S7 | eyebrow | max lines | none | none | match |
| S5 · S6 · S7 | title | left / right | 36px / 36px | `left:36, right:36` `v3.tsx:1184` | match |
| S5 · S6 · S7 | title | top | canvas 338 / app 284 | `top:284` `v3.tsx:1184` | match |
| S5 · S6 · S7 | title | text-align | center | `center` `v3.tsx:1184` | match |
| S5 · S6 · S7 | title | font-size | 26px | `fontSize:26` `v3.tsx:1184` | match |
| S5 · S6 · S7 | title | font-weight | 500 | `sans('500')` `v3.tsx:1184` | match |
| S5 · S6 · S7 | title | line-height | 1.3 → 33.8px | `lineHeight:33.8` `v3.tsx:1184` | match |
| S5 · S6 · S7 | title | letter-spacing | −0.2px | `letterSpacing:-0.2` `v3.tsx:1184` | match |
| S5 · S6 · S7 | title | color | `#F4F3F0` | `INK` = `'#F4F3F0'` `v3.tsx:697,1184` | match |
| S5 · S6 · S7 | title | text-wrap | balance | web: `textWrap:'pretty'` (variant `body`, `AppText.tsx:127`); native: n/a | deviation, web-only — see Finding 3 |
| S5 · S6 · S7 | body | left / right | 44px / 44px | `left:44, right:44` `v3.tsx:1187` | match |
| S5 · S6 · S7 | body | top | canvas 420 / app 366 | `top:366` `v3.tsx:1187` | match |
| S5 · S6 · S7 | body | text-align | center | `center` `v3.tsx:1187` | match |
| S5 · S6 · S7 | body | font-size | 15.5px | `fontSize:15.5` `v3.tsx:1187` | match |
| S5 · S6 · S7 | body | font-weight | 400 | `sans('400')` `v3.tsx:1187` | match |
| S5 · S6 · S7 | body | line-height | 24px | `lineHeight:24` `v3.tsx:1187` | match |
| S5 · S6 · S7 | body | letter-spacing | not stated | inherited tracking dropped | match |
| S5 · S6 · S7 | body | color | `rgba(244,243,240,0.7)` | `'rgba(244,243,240,0.7)'` `v3.tsx:1187` | match |
| S5 · S6 · S7 | body | text-wrap | pretty | web `textWrap:'pretty'`; native n/a | match |
| S5 · S6 · S7 | CTA pill | left / right | 24px / 24px | `left:24, right:24` `v3.tsx:1190` | match |
| S5 · S6 · S7 | CTA pill | top / bottom | canvas top 744 → bottom 852−744−56 = 52 | `bottom: O3_MD_CTA_BOTTOM` = `852−744−56` = 52 `v3.tsx:415,1190` | match |
| S5 · S6 · S7 | CTA pill | height | 56px | `size="md"` → `height:56` `v3.tsx:397` | match |
| S5 · S6 · S7 | CTA pill | border-radius | 28px (all four corners) | `borderRadius:28` `v3.tsx:399` | match |
| S5 · S6 · S7 | CTA pill | background | `#F4F3F0` | `tone.fill` = `'#F4F3F0'` `v3.tsx:82,398` | match |
| S5 · S6 · S7 | CTA pill | border width / colour | none | none | match |
| S5 · S6 · S7 | CTA pill | shadow | none | none | match |
| S5 · S6 · S7 | CTA pill | display / align-items / justify-content | flex / center / center | `alignItems:'center', justifyContent:'center'` `v3.tsx:400-401` | match |
| S5 · S6 · S7 | CTA pill | opacity | 1 (implicit) | `opacity: enabled ? 1 : 0.26`; always enabled here | match |
| S5 · S6 · S7 | CTA label | font-size | 16.5px | `fontSize: md ? 16.5 : 17` → 16.5 `v3.tsx:405` | match |
| S5 · S6 · S7 | CTA label | font-weight | 600 | `sans('600')` `v3.tsx:405` | match |
| S5 · S6 · S7 | CTA label | letter-spacing | not stated (normal) | `letterSpacing: md ? 0 : 0.2` → 0 `v3.tsx:405` | match |
| S5 · S6 · S7 | CTA label | color | `#131313` | `tone.onFill` = `'#131313'` `v3.tsx:83,405` | match |

## Table E — section-intro strings

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Section-5-Intro | eyebrow | text | `Section 5 of 6` | `'Section 5 of 6'` `v3.tsx:1171` | match |
| Section-5-Intro | title | text | `What you want` | `'What you want'` `v3.tsx:1171` | match |
| Section-5-Intro | body | text | `Your goal, in your words. Porn and masturbation are two separate choices — you set each.` (`&mdash;`) | same, `—` `v3.tsx:1171` | match |
| Section-5-Intro | CTA | label | `Continue` | `'Continue'` `v3.tsx:1190` | match |
| Section-6-Intro | eyebrow | text | `Section 6 of 6` | `'Section 6 of 6'` `v3.tsx:1172` | match |
| Section-6-Intro | title | text | `How you want the plan to run` | same `v3.tsx:1172` | match |
| Section-6-Intro | body | text | `The settings. Easy to change any time.` | same `v3.tsx:1172` | match |
| Section-6-Intro | CTA | label | `Continue` | `'Continue'` | match |
| Section-7-Intro | eyebrow | text | `Almost done` | `'Almost done'` `v3.tsx:1173` | match |
| Section-7-Intro | title | text | `A quick wellbeing check` | same `v3.tsx:1173` | match |
| Section-7-Intro | body | text | `A few gentle questions. Not a test, not a diagnosis — your answers stay private.` (`&mdash;`) | same, `—` `v3.tsx:1173` | match |
| Section-7-Intro | CTA | label | `Continue` | `'Continue'` | match |

---

## Table F — the question-title block (Q15–Q26, 12 frames)

Byte-identical across all twelve question frames; only the string differs (Table J).

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Q15–Q26 | title | left / right | 44px / 44px | `left:44, right:44` `v3.tsx:927` | match |
| Q15–Q26 | title | top | canvas 158 / app 104 | `top:104` `v3.tsx:927` | match |
| Q15–Q26 | title | text-align | center | `center` `v3.tsx:927` | match |
| Q15–Q26 | title | font-size | 22px | `fontSize:22` `v3.tsx:927` | match |
| Q15–Q26 | title | font-weight | 500 | `sans('500')` `v3.tsx:927` | match |
| Q15–Q26 | title | line-height | 1.32 → 29.04px | `lineHeight:29.04` `v3.tsx:927` | match |
| Q15–Q26 | title | letter-spacing | 0.1px | `letterSpacing:0.1` `v3.tsx:927` | match |
| Q15–Q26 | title | color | `#F4F3F0` | `INK` `v3.tsx:927` | match |
| Q15–Q26 | title | text-wrap | pretty | web `textWrap:'pretty'`; native n/a | match |
| Q15–Q26 | title | max lines / max-width | none | none | match |
| Q17 · Q20 | "Select all that apply" | left / right | 0 / 0 | `left:0, right:0` `v3.tsx:931` | match |
| Q17 · Q20 | "Select all that apply" | top | canvas 226 / app 172 | `top:172` `v3.tsx:931` | match |
| Q17 · Q20 | "Select all that apply" | text-align | center | `center` `v3.tsx:931` | match |
| Q17 · Q20 | "Select all that apply" | font-size | 13px | `fontSize:13` `v3.tsx:931` | match |
| Q17 · Q20 | "Select all that apply" | font-weight | 500 | `sans('500')` `v3.tsx:931` | match |
| Q17 · Q20 | "Select all that apply" | line-height | not stated | inherited leading dropped | match |
| Q17 · Q20 | "Select all that apply" | color | `rgba(244,243,240,0.55)` | `'rgba(244,243,240,0.55)'` `v3.tsx:931` | match |
| Q17 · Q20 | "Select all that apply" | text | `Select all that apply` | `Select all that apply` `v3.tsx:932` | match |
| Q15 · Q16 · Q18 · Q19 · Q21 · Q22 · Q23 | "Select all" line | presence | absent | `multi` undefined → not rendered `v3.tsx:930` | match |
| Q24 · Q25 · Q26 | "Select all" line | presence | absent | `multi` undefined → not rendered | match |

---

## Table G — the single-select answer row (the `list` primitive)

Every answer row on Q15, Q16, Q18, Q19, Q21, Q22, Q23 and Q26 states the same geometry and the
same two state fills; only the top, the state, the label and the label size vary (Table H).

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| 8 list frames | answer row | left / right | 24px / 24px | `left:24, right:24` `v3.tsx:905-906` | match |
| 8 list frames | answer row | top | canvas 310 + 74·i | `top: 256 + 74*i` `v3.tsx:907` → canvas 310 + 74·i | match |
| 8 list frames | answer row | height | 60px | `height:60` `v3.tsx:908` | match |
| 8 list frames | answer row | border-radius | 16px (all four corners) | `borderRadius:16` `v3.tsx:909` | match |
| 8 list frames | answer row | display / flex-direction | flex / row | `flexDirection:'row'` `v3.tsx:910` | match |
| 8 list frames | answer row | align-items | center | `alignItems:'center'` `v3.tsx:911` | match |
| 8 list frames | answer row | justify-content | space-between | `justifyContent:'space-between'` `v3.tsx:912` | match |
| 8 list frames | answer row | flex-wrap | not stated (nowrap) | not set (nowrap) | match |
| 8 list frames | answer row | gap | 12px | `gap:12` `v3.tsx:913` | match |
| 8 list frames | answer row | padding | `0 22px` (top 0, right 22, bottom 0, left 22) | `paddingHorizontal:22`, no vertical padding `v3.tsx:914` | match |
| 8 list frames | answer row | margin | none | none | match |
| 8 list frames | answer row | background, unselected | `rgba(255,255,255,0.07)` | `'rgba(255,255,255,0.07)'` `v3.tsx:915` | match |
| 8 list frames | answer row | background, selected | `#F4F3F0` | `INK` = `'#F4F3F0'` `v3.tsx:915` | match |
| 8 list frames | answer row | ring, unselected | `0 0 0 1px rgba(255,255,255,0.22)` (x0 y0 blur0 spread1) | `boxShadow:'0 0 0 1px rgba(255,255,255,0.22)'` `v3.tsx:916` | match |
| 8 list frames | answer row | ring, selected | `0 0 0 1px rgba(0,0,0,0)` (fully transparent) | `undefined` (no shadow) `v3.tsx:916` | match (both render nothing) |
| 8 list frames | answer row | border width / colour | none | none | match |
| 8 list frames | answer row | opacity | 1 | 1 | match |
| 8 list frames | answer row | overflow | not stated | not set | match |
| 8 list frames | answer row | z-order | document order, above ambient | absolute children of the content box, after ambient | match |
| 8 list frames | row label | font-size | 17px, or 15.5px on the long rows | `fontSize: opt.fs ?? 17` `v3.tsx:918` | match (per-row in Table H) |
| 8 list frames | row label | font-weight | 500 | `sans('500')` `v3.tsx:918` | match |
| 8 list frames | row label | line-height | 20px | `lineHeight:20` `v3.tsx:918` | match |
| 8 list frames | row label | letter-spacing | not stated | inherited tracking dropped | match |
| 8 list frames | row label | text-align | not stated (left) | default left `v3.tsx:918` | match |
| 8 list frames | row label | color, unselected | `#F4F3F0` | `INK` `v3.tsx:918` | match |
| 8 list frames | row label | color, selected | `#131313` | `ON_INK` = `'#131313'` `v3.tsx:698,918` | match |
| 8 list frames | row label | max lines | none | none | match |
| 8 list frames | selected tick | presence | selected row only | `{on ? <O3Tick .../> : null}` `v3.tsx:919` | match |
| 8 list frames | selected tick | svg width / height | 16 / 12 | `width={16} height={12}` `v3.tsx:530` | match |
| 8 list frames | selected tick | viewBox | `0 0 16 12` | `viewBox="0 0 16 12"` `v3.tsx:530` | match |
| 8 list frames | selected tick | path `d` | `M1.5 6l4.4 4.5L14.5 1.5` | `"M1.5 6l4.4 4.5L14.5 1.5"` `v3.tsx:531` | match |
| 8 list frames | selected tick | fill | none | `fill="none"` `v3.tsx:530` | match |
| 8 list frames | selected tick | stroke | `#131313` | `c = ON_INK` `v3.tsx:919,531` | match |
| 8 list frames | selected tick | stroke-width | 2.4 | `strokeWidth={2.4}` `v3.tsx:531` | match |
| 8 list frames | selected tick | linecap / linejoin | round / round | `round` / `round` `v3.tsx:531` | match |
| Q15 · Q16 · Q18 · Q19 · Q21 · Q22 · Q23 | CTA pill | presence | absent (tap settles the answer) | `hasCta = multi \|\| typed \|\| !!skip` → false `v3.tsx:738,949` | match |

## Table H — per-row state, text and type size

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| V3-Q15 | row 1 | top / state / text / size | 310 / selected / `Quit it completely` / 17 | i=0 → 310 / `o('Quit it completely')` / 17 `v3.tsx:1141` | match |
| V3-Q15 | row 2 | top / state / text / size | 384 / unselected / `Cut it down a lot` / 17 | i=1 → 384 / `o('Cut it down a lot')` / 17 | match |
| V3-Q15 | row 3 | top / state / text / size | 458 / unselected / `Keep it to a level I set myself` / 17 | i=2 → 458 / same / 17 | match |
| V3-Q15 | row 4 | top / state / text / size | 532 / unselected / `Not sure yet — I want to explore` / 15.5 | i=3 → 532 / `o('Not sure yet — I want to explore', 15.5)` | match |
| V3-Q16 | row 1 | top / state / text / size | 310 / unselected / `Stop that too — a full reset` / 17 | i=0 → 310 / `o('Stop that too — a full reset')` / 17 `v3.tsx:1142` | match |
| V3-Q16 | row 2 | top / state / text / size | 384 / selected / `Keep it, just without porn` / 17 | i=1 → 384 / same / 17 | match |
| V3-Q16 | row 3 | top / state / text / size | 458 / unselected / `Cut it down` / 17 | i=2 → 458 / same / 17 | match |
| V3-Q16 | row 4 | top / state / text / size | 532 / unselected / `I’m not trying to change that` (`&rsquo;`) / 17 | i=3 → 532 / `o('I’m not trying to change that')` (U+2019) / 17 | match |
| V3-Q18 | row 1 | top / state / text / size | 310 / unselected / `Just exploring` / 17 | i=0 → 310 / same / 17 `v3.tsx:1144` | match |
| V3-Q18 | row 2 | top / state / text / size | 384 / unselected / `Thinking about it` / 17 | i=1 → 384 / same / 17 | match |
| V3-Q18 | row 3 | top / state / text / size | 458 / selected / `Ready to start` / 17 | i=2 → 458 / same / 17 | match |
| V3-Q18 | row 4 | top / state / text / size | 532 / unselected / `Already started — I want structure` / 15.5 | i=3 → 532 / `o('Already started — I want structure', 15.5)` | match |
| V3-Q19 | row 1 | top / state / text / size | 310 / unselected / `One small lesson` / 17 | i=0 → 310 / same / 17 `v3.tsx:1146` | match |
| V3-Q19 | row 2 | top / state / text / size | 384 / selected / `A lesson plus a task` / 17 | i=1 → 384 / same / 17 | match |
| V3-Q19 | row 3 | top / state / text / size | 458 / unselected / `As much as I can` / 17 | i=2 → 458 / same / 17 | match |
| V3-Q19 | row 4 | top / state / text / size | 532 / unselected / `Just the bad-day tools for now` / 17 | i=3 → 532 / same / 17 | match |
| V3-Q21 | row 1 | top / state / text / size | 310 / unselected / `Not really` / 17 | i=0 → 310 / same / 17 `v3.tsx:1149` | match |
| V3-Q21 | row 2 | top / state / text / size | 384 / selected / `A little` / 17 | i=1 → 384 / same / 17 | match |
| V3-Q21 | row 3 | top / state / text / size | 458 / unselected / `Quite a bit` / 17 | i=2 → 458 / same / 17 | match |
| V3-Q21 | row 4 | top / state / text / size | 532 / unselected / `A lot` / 17 | i=3 → 532 / same / 17 | match |
| V3-Q22 | row 1 | top / state / text / size | 310 / selected / `No` / 17 | i=0 → 310 / same / 17 `v3.tsx:1150` | match |
| V3-Q22 | row 2 | top / state / text / size | 384 / unselected / `Maybe` / 17 | i=1 → 384 / same / 17 | match |
| V3-Q22 | row 3 | top / state / text / size | 458 / unselected / `Yes` / 17 | i=2 → 458 / same / 17 | match |
| V3-Q22 | row 4 | presence | no fourth row | 3 options | match |
| V3-Q23 | row 1 | top / state / text / size | 310 / unselected / `Not at all` / 17 | i=0 → 310 / same / 17 `v3.tsx:1151` | match |
| V3-Q23 | row 2 | top / state / text / size | 384 / selected / `Some days` / 17 | i=1 → 384 / same / 17 | match |
| V3-Q23 | row 3 | top / state / text / size | 458 / unselected / `Most days` / 17 | i=2 → 458 / same / 17 | match |
| V3-Q23 | row 4 | top / state / text / size | 532 / unselected / `Nearly every day` / 17 | i=3 → 532 / same / 17 | match |
| V3-Q26-Gender | row 1 | top / state / text / size | 310 / selected / `Male` / 17 | i=0 → 310 / same / 17 `v3.tsx:1155` | match |
| V3-Q26-Gender | row 2 | top / state / text / size | 384 / unselected / `Female` / 17 | i=1 → 384 / same / 17 | match |
| V3-Q26-Gender | row 3 | top / state / text / size | 458 / unselected / `Non-binary` / 17 | i=2 → 458 / same / 17 | match |
| V3-Q26-Gender | row 4 | top / state / text / size | 532 / unselected / `Another identity` / 17 | i=3 → 532 / same / 17 | match |
| V3-Q26-Gender | row 5 | top / state / text / size | 606 / unselected / `Prefer not to say` / 17 | i=4 → 606 / same / 17 | match |

---

## Table I — the multi-select check row (Q17, Q20)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Q17 · Q20 | check row | left / right | 24px / 24px | `left:24, right:24` `v3.tsx:815-816` | match |
| V3-Q17 | check row | first top | canvas 288 / app 234 | `(tight ? 288 : 306) − 54` with `tight = options.length > 5` = true (7 options) → 234 `v3.tsx:803-804` | match |
| V3-Q17 | check row | pitch | 62px (288, 350, 412, 474, 536, 598, 660) | `top + 62*i` `v3.tsx:817` | match |
| V3-Q17 | check row | height | 52px | `tight ? 52 : 56` → 52 `v3.tsx:818` | match |
| V3-Q20 | check row | first top | canvas 306 / app 252 | `tight` false (5 options) → 306−54 = 252 | match |
| V3-Q20 | check row | pitch | 70px (306, 376, 446, 516, 586) | `top + 70*i` `v3.tsx:817` | match |
| V3-Q20 | check row | height | 56px | `tight ? 52 : 56` → 56 `v3.tsx:818` | match |
| Q17 · Q20 | check row | border-radius | 15px (all four corners) | `borderRadius:15` `v3.tsx:819` | match |
| Q17 · Q20 | check row | display / flex-direction | flex / row | `flexDirection:'row'` `v3.tsx:820` | match |
| Q17 · Q20 | check row | align-items | center | `alignItems:'center'` `v3.tsx:821` | match |
| Q17 · Q20 | check row | justify-content | not stated (flex-start) | not set (flex-start) | match |
| Q17 · Q20 | check row | gap | 14px | `gap:14` `v3.tsx:822` | match |
| Q17 · Q20 | check row | padding | `0 18px` | `paddingHorizontal:18` `v3.tsx:823` | match |
| Q17 · Q20 | check row | background, checked | `rgba(255,255,255,0.13)` | `'rgba(255,255,255,0.13)'` `v3.tsx:824` | match |
| Q17 · Q20 | check row | background, unchecked | `rgba(255,255,255,0.06)` | `'rgba(255,255,255,0.06)'` `v3.tsx:824` | match |
| Q17 · Q20 | check row | ring, checked | `0 0 0 1px rgba(255,255,255,0.45)` | `'0 0 0 1px rgba(255,255,255,0.45)'` `v3.tsx:825` | match |
| Q17 · Q20 | check row | ring, unchecked | `0 0 0 1px rgba(255,255,255,0.18)` | `'0 0 0 1px rgba(255,255,255,0.18)'` `v3.tsx:825` | match |
| Q17 · Q20 | checkbox | width / height | 22 / 22 | `width:22, height:22` `v3.tsx:829-830` | match |
| Q17 · Q20 | checkbox | border-radius | 7px | `borderRadius:7` `v3.tsx:831` | match |
| Q17 · Q20 | checkbox | flex-shrink | 0 | absolute-free flex child, no shrink applied (fixed width/height) `v3.tsx:827-836` | match |
| Q17 · Q20 | checkbox | background, checked | `#F4F3F0` | `INK` `v3.tsx:834` | match |
| Q17 · Q20 | checkbox | background, unchecked | none | `undefined` `v3.tsx:834` | match |
| Q17 · Q20 | checkbox | ring, unchecked | `inset 0 0 0 1.5px rgba(244,243,240,0.4)` | `'inset 0 0 0 1.5px rgba(244,243,240,0.4)'` `v3.tsx:835` | match |
| Q17 · Q20 | checkbox | ring, checked | none | `undefined` `v3.tsx:835` | match |
| Q17 · Q20 | checkbox | align-items / justify-content | center / center | `alignItems:'center', justifyContent:'center'` `v3.tsx:832-833` | match |
| Q17 · Q20 | check glyph | svg width / height | 12 / 9 | `width={12} height={9}` `v3.tsx:838` | match |
| Q17 · Q20 | check glyph | viewBox | `0 0 16 12` | `viewBox="0 0 16 12"` `v3.tsx:838` | match |
| Q17 · Q20 | check glyph | path `d` | `M1.5 6l4.4 4.5L14.5 1.5` | `"M1.5 6l4.4 4.5L14.5 1.5"` `v3.tsx:839` | match |
| Q17 · Q20 | check glyph | fill / stroke | none / `#131313` | `fill="none"`, `stroke={ON_INK}` `v3.tsx:838-839` | match |
| Q17 · Q20 | check glyph | stroke-width | 2.6 | `strokeWidth={2.6}` `v3.tsx:839` | match |
| Q17 · Q20 | check glyph | linecap / linejoin | round / round | `round` / `round` `v3.tsx:839` | match |
| Q17 · Q20 | row label | font-size | 15.5px | `fontSize:15.5` `v3.tsx:843` | match |
| Q17 · Q20 | row label | font-weight | 500 | `sans('500')` `v3.tsx:843` | match |
| Q17 · Q20 | row label | line-height | 19px | `lineHeight:19` `v3.tsx:843` | match |
| Q17 · Q20 | row label | color (both states) | `#F4F3F0` | `INK`, unconditional `v3.tsx:843` | match |
| V3-Q17 | rows 1–7 | state / text | 288 on `Blockers or filters`; 350 on `Going cold turkey`; 412 off `An accountability partner`; 474 on `Deleting accounts or apps`; 536 off `Therapy or counselling`; 598 off `Replacing it with other habits`; 660 off `Nothing structured yet` | same seven labels, same order `v3.tsx:1143` | match |
| V3-Q20 | rows 1–5 | state / text | 306 on `Morning`; 376 off `Midday`; 446 on `Evening`; 516 on `Late night — my danger zone`; 586 off `No reminders` | same five labels, same order `v3.tsx:1147` | match |
| Q17 · Q20 | CTA pill | left / right / bottom | 24 / 24 / canvas top 744 → 52 | `left:24, right:24, bottom:O3_MD_CTA_BOTTOM` = 52 `v3.tsx:955` | match |
| Q17 · Q20 | CTA pill | height / radius | 56 / 28 | `size="md"` → 56 / 28 `v3.tsx:397,399` | match |
| Q17 · Q20 | CTA pill | background | `#F4F3F0` | `tone.fill` | match |
| Q17 · Q20 | CTA label | font-size / weight / colour | 16.5 / 600 / `#131313` | 16.5 / `sans('600')` / `tone.onFill` `v3.tsx:405` | match |
| Q17 · Q20 | CTA label | text | `Continue · 3` (`&middot;`) | `` `Continue · ${chosen.length}` `` `v3.tsx:952`; 3 checked on both frames | match |

---

## Table J — question titles and per-frame notes

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| V3-Q15 | title | text | `What is your goal with porn?` | same `v3.tsx:1141` | match |
| V3-Q16 | title | text | `And masturbation?` | same `v3.tsx:1142` | match |
| V3-Q17 | title | text | `What have you already tried?` | same `v3.tsx:1143` | match |
| V3-Q18 | title | text | `How ready do you feel to change right now?` | same `v3.tsx:1144` | match |
| V3-Q19 | title | text | `How much do you want to do each day?` | same `v3.tsx:1146` | match |
| V3-Q20 | title | text | `When should we check in with you?` | same `v3.tsx:1147` | match |
| V3-Q21 | title | text | `Is this affecting your sleep, work, relationships, or money?` | same `v3.tsx:1149` | match |
| V3-Q22 | title | text | `Are you using porn mainly to cope with something heavy right now?` | same `v3.tsx:1150` | match |
| V3-Q23 | title | text | `In the last two weeks, how often have you felt down or hopeless?` | same `v3.tsx:1151` | match |
| V3-Q24-Name | title | text | `What should we call you?` | same `v3.tsx:1153` | match |
| V3-Q25-Age | title | text | `How old are you?` | same `v3.tsx:1154` | match |
| V3-Q26-Gender | title | text | `How do you describe your gender?` | same `v3.tsx:1155` | match |
| V3-Q25-Age | note | left / right | 44px / 44px | `left:44, right:44` `v3.tsx:941` | match |
| V3-Q25-Age | note | top | canvas 394 / app 340 | `top:340` `v3.tsx:943` | match |
| V3-Q25-Age | note | text-align | center | `center` `v3.tsx:938` | match |
| V3-Q25-Age | note | font-size | 13.5px | `fontSize:13.5` `v3.tsx:943` | match |
| V3-Q25-Age | note | font-weight | 400 | `sans('400')` `v3.tsx:940` | match |
| V3-Q25-Age | note | line-height | 20px | `lineHeight:20` `v3.tsx:943` | match |
| V3-Q25-Age | note | color | `rgba(244,243,240,0.6)` | `'rgba(244,243,240,0.6)'` `v3.tsx:943` | match |
| V3-Q25-Age | note | text-wrap | pretty | web pretty; native n/a | match |
| V3-Q25-Age | note | text | `This helps us show how the pattern could develop over time.` | same `v3.tsx:1154` | match |
| V3-Q26-Gender | note | left / right | 44px / 44px | `left:44, right:44` `v3.tsx:941` | match |
| V3-Q26-Gender | note | top | canvas 688 / app 634 | `top:634` `v3.tsx:944` | match |
| V3-Q26-Gender | note | text-align | center | `center` | match |
| V3-Q26-Gender | note | font-size | 12.5px | `fontSize:12.5` `v3.tsx:944` | match |
| V3-Q26-Gender | note | font-weight | 400 | `sans('400')` `v3.tsx:940` | match |
| V3-Q26-Gender | note | line-height | not stated | inherited leading dropped | match |
| V3-Q26-Gender | note | color | `rgba(244,243,240,0.55)` | `'rgba(244,243,240,0.55)'` `v3.tsx:944` | match |
| V3-Q26-Gender | note | text | `Optional — it never changes your projection.` (`&mdash;`) | `'Optional — it never changes your projection.'` `v3.tsx:1155` | match |

---

## Table K — the typed fields (Q24 Name, Q25 Age)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Q24 · Q25 | field | left / right | 24px / 24px | `left:24, right:24` `v3.tsx:854-855` | match |
| Q24 · Q25 | field | top | canvas 310 / app 256 | `top:256` `v3.tsx:856` | match |
| Q24 · Q25 | field | height | 60px | `height:60` `v3.tsx:857` | match |
| Q24 · Q25 | field | border-radius | 16px | `borderRadius:16` `v3.tsx:858` | match |
| Q24 · Q25 | field | display / flex-direction | flex / row | `flexDirection:'row'` `v3.tsx:859` | match |
| Q24 · Q25 | field | align-items | center | `alignItems:'center'` `v3.tsx:860` | match |
| Q24 · Q25 | field | padding | `0 22px` | `paddingHorizontal:22` `v3.tsx:861` | match |
| Q24 · Q25 | field | gap | 3px | not a flex gap; carried as `marginLeft: 5` on the input (2px bar + 3px gap) `v3.tsx:888` | match (same resulting x) |
| Q24 · Q25 | field | background | `rgba(255,255,255,0.07)` | `'rgba(255,255,255,0.07)'` `v3.tsx:862` | match |
| Q24 · Q25 | field | ring | `0 0 0 1px rgba(255,255,255,0.22)` | `'0 0 0 1px rgba(255,255,255,0.22)'` `v3.tsx:863` | match |
| V3-Q24-Name | caret bar | order | before the placeholder | absolutely placed at `left:22` = screen x 46, text at x 51 `v3.tsx:873,888` | match |
| V3-Q24-Name | caret bar | width / height | 2 / 22 | `width:2, height:22` `v3.tsx:873` | match |
| V3-Q24-Name | caret bar | border-radius | 1px | `borderRadius:1` `v3.tsx:873` | match |
| V3-Q24-Name | caret bar | background | `#F4F3F0` | `INK` `v3.tsx:873` | match |
| V3-Q24-Name | caret bar | vertical centring | `align-items:center` in a 60 box → y 19 | `top:19` (= (60−22)/2) `v3.tsx:873` | match |
| V3-Q24-Name | placeholder | font-size | 17px | `fontSize:17` `v3.tsx:888` | match |
| V3-Q24-Name | placeholder | font-weight | 400 | `sans('400')` `v3.tsx:887` | match |
| V3-Q24-Name | placeholder | line-height | not stated | not set | match |
| V3-Q24-Name | placeholder | color | `rgba(244,243,240,0.45)` | `placeholderTextColor="rgba(244,243,240,0.45)"` `v3.tsx:879` | match |
| V3-Q24-Name | placeholder | text | `Your name` | `'Your name'` `v3.tsx:878` | match |
| V3-Q25-Age | value | font-size | 17px | `fontSize:17` `v3.tsx:888` | match |
| V3-Q25-Age | value | font-weight | 500 | `sans('500')` (num branch) `v3.tsx:887` | match |
| V3-Q25-Age | value | color | `#F4F3F0` | `INK` `v3.tsx:888` | match |
| V3-Q25-Age | value | font-variant-numeric | tabular-nums | `fontVariant:['tabular-nums']` `v3.tsx:889` | match |
| V3-Q25-Age | value | text | `24` (frame's sample) | user input; placeholder `''` `v3.tsx:878` | match (sample data) |
| V3-Q25-Age | caret bar | order / geometry | after the value, 2×22, r 1, `#F4F3F0` | not drawn; native caret used instead (`selectionColor={INK}`, `caretHidden` false for num) `v3.tsx:872-884` | deviation — documented substitution, see Note D3 |
| V3-Q25-Age | field | left inset of value | 22px padding → x 46 | `marginLeft: 0` for num → x 46 `v3.tsx:888` | match |
| Q24 · Q25 | CTA pill | left / right / bottom | 24 / 24 / canvas top 744, h 58 → 50 | `left:24, right:24, bottom:50` `v3.tsx:955` | match |
| Q24 · Q25 | CTA pill | height | 58px | `size='lg'` → 58 `v3.tsx:397` | match |
| Q24 · Q25 | CTA pill | border-radius | 29px | `borderRadius:29` `v3.tsx:399` | match |
| Q24 · Q25 | CTA pill | background | `#F4F3F0` | `tone.fill` | match |
| Q24 · Q25 | CTA label | font-size | 17px | `fontSize: md ? 16.5 : 17` → 17 `v3.tsx:405` | match |
| Q24 · Q25 | CTA label | font-weight | 600 | `sans('600')` `v3.tsx:405` | match |
| Q24 · Q25 | CTA label | letter-spacing | 0.2px | `letterSpacing: md ? 0 : 0.2` → 0.2 `v3.tsx:405` | match |
| Q24 · Q25 | CTA label | color | `#131313` | `tone.onFill` | match |
| Q24 · Q25 | CTA label | text | `Continue` | `ctaLabel ?? 'Continue'`, no `ctaLabel` set `v3.tsx:952` | match |
| V3-Q26-Gender | CTA pill | height / radius / size / weight / ls | 58 / 29 / 17 / 600 / 0.2 | `skip:true` → `hasCta` true, `multi` false → `size='lg'` `v3.tsx:738,951` | match |
| V3-Q26-Gender | CTA pill | bottom | canvas top 744, h 58 → 50 | `bottom:50` `v3.tsx:955` | match |
| V3-Q26-Gender | CTA pill | text | `Continue` | `'Continue'` | match |

---

## Table L — the four lesson interstitials

Identical layout across all four frames; per-frame values in Table M.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| 4 lessons | Back row | top | canvas 96 / app 42 | `PAPER_BACK = 96 − 54 = 42` (`welcome.tsx:121,124-127`) | match |
| 4 lessons | Back row | z-order | drawn before the rule in document order | drawn after the rule `v3.tsx:250-274` | match (no overlap; rule y 12–16, Back y 42+) |
| 4 lessons | art stage | left / right | 0 / 0 | `left:0, right:0` `v3.tsx:1100` | match |
| 4 lessons | art stage | top | canvas 206 / app 152 | `top:152` `v3.tsx:1100` | match |
| 4 lessons | art stage | height | 310px | `height:310` (`art.tsx:267`) | match |
| 4 lessons | halo | left / margin-left | 50% / −110 | `left:'50%', marginLeft:-110` (`art.tsx:274`) | match |
| 4 lessons | halo | top | 60px (inside the stage) | `top:60` (`art.tsx:274`) | match |
| 4 lessons | halo | width / height | 220 / 200 | `width:220, height:200` (`art.tsx:274`) | match |
| 4 lessons | halo | border-radius | 50% | radial `cx/cy 50%`, `rx/ry 50%` (`art.tsx:42`) | match |
| 4 lessons | halo | stop 0 | `rgba(255,236,196,0.3)` | `['0%','rgb(255,236,196)',0.3]` (`art.tsx:271`) | match |
| 4 lessons | halo | stop 2 | `rgba(255,236,196,0)` at 74% | `['74%','rgb(255,236,196)',0]` (`art.tsx:272`) | match |
| 4 lessons | halo | filter | `blur(7px)` | not applied (`art.tsx:268`) | deviation — Note D1 |
| 4 lessons | ground shadow | left / margin-left | 50% / −90 | `left:'50%', marginLeft:-90` (`art.tsx:283`) | match |
| 4 lessons | ground shadow | width / height | 180 / 18 | `width:180, height:18` (`art.tsx:283`) | match |
| 4 lessons | ground shadow | border-radius | 50% | radial ellipse | match |
| 4 lessons | ground shadow | fill | flat `rgba(0,0,0,0.4)` | radial `0.4 → 0.18@62% → 0@100%` (`art.tsx:279-281`) | deviation — Note D1 (stands in for `blur(10px)`) |
| 4 lessons | ground shadow | filter | `blur(10px)` | not applied | deviation — Note D1 |
| 4 lessons | drawing wrapper | left / margin-left | 50% / −width/2 | `left:'50%', marginLeft:-a.width/2` (`art.tsx:285`) | match |
| 4 lessons | title | left / right | 26px / 26px | `left:26, right:26` `v3.tsx:1103` | match |
| 4 lessons | title | top | canvas 530 / app 476 | `top:476` `v3.tsx:1103` | match |
| 4 lessons | title | text-align | center | `center` `v3.tsx:1103` | match |
| 4 lessons | title | font-size | 22px | `fontSize:22` `v3.tsx:1103` | match |
| 4 lessons | title | font-weight | 500 | `sans('500')` `v3.tsx:1103` | match |
| 4 lessons | title | line-height | 1.32 → 29.04px | `lineHeight:29.04` `v3.tsx:1103` | match |
| 4 lessons | title | letter-spacing | 0.1px | `letterSpacing:0.1` `v3.tsx:1103` | match |
| 4 lessons | title | color | `#F4F3F0` | `INK` `v3.tsx:1103` | match |
| 4 lessons | title | text-wrap | pretty | web pretty; native n/a | match |
| 4 lessons | body | text-align | center | `center` `v3.tsx:1106` | match |
| 4 lessons | body | font-size | 15.5px | `fontSize:15.5` `v3.tsx:1106` | match |
| 4 lessons | body | font-weight | 400 | `sans('400')` `v3.tsx:1106` | match |
| 4 lessons | body | line-height | 23px | `lineHeight:23` `v3.tsx:1106` | match |
| 4 lessons | body | letter-spacing | not stated | inherited tracking dropped | match |
| 4 lessons | body | color | `rgba(244,243,240,0.75)` | `'rgba(244,243,240,0.75)'` `v3.tsx:1106` | match |
| 4 lessons | body | text-wrap | pretty | web pretty; native n/a | match |
| 4 lessons | pager | left / right | 0 / 0 | `left:0, right:0` `v3.tsx:1109` | match |
| 4 lessons | pager | top | canvas 712 / app 658 | `top:658` `v3.tsx:1109` | match |
| 4 lessons | pager | display / justify-content | flex / center | `flexDirection:'row', justifyContent:'center'` (`art.tsx:295`) | match |
| 4 lessons | pager | gap | 10px | `gap:10` (`art.tsx:295`) | match |
| 4 lessons | pager dot | width / height | 7 / 7 | `width:7, height:7` (`art.tsx:297`) | match |
| 4 lessons | pager dot | border-radius | 50% | `borderRadius:3.5` (`art.tsx:297`) | match |
| 4 lessons | pager dot | active fill | `#F4F3F0` | `'#F4F3F0'` (`art.tsx:297`) | match |
| 4 lessons | pager dot | inactive fill | `rgba(255,255,255,0.25)` | `'rgba(255,255,255,0.25)'` (`art.tsx:297`) | match |
| 4 lessons | pager | count | 4 | `n = 4` (`art.tsx:293`) | match |
| 4 lessons | CTA pill | left / right | 24 / 24 | `left:24, right:24` `v3.tsx:1112` | match |
| 4 lessons | CTA pill | bottom | canvas top 744, h 58 → 50 | `bottom:50` `v3.tsx:1112` | match |
| 4 lessons | CTA pill | height / radius | 58 / 29 | default `size='lg'` → 58 / 29 `v3.tsx:397,399` | match |
| 4 lessons | CTA pill | background | `#F4F3F0` | `tone.fill` | match |
| 4 lessons | CTA label | font-size / weight / letter-spacing / colour | 17 / 600 / 0.2px / `#131313` | 17 / `sans('600')` / 0.2 / `tone.onFill` `v3.tsx:405` | match |

## Table M — per-lesson art, copy and pager index

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Lesson-Willpower | drawing | svg width / height | 230 / 180 | `width={230} height={180}` (`art.tsx:177`) | match |
| Lesson-Willpower | drawing | viewBox | `0 0 230 180` | `viewBox="0 0 230 180"` (`art.tsx:177`) | match |
| Lesson-Willpower | drawing | top / margin-left | 36 / −115 | `artTop 36`, `marginLeft −230/2 = −115` (`art.tsx:109,285`) | match |
| Lesson-Willpower | ground shadow | top | 158 | `shadowTop 158` (`art.tsx:109`) | match |
| Lesson-Willpower | gradient `obW` | x1/y1/x2/y2 | 0 / 0 / 1 / 0 | `x1="0" y1="0" x2="1" y2="0"` (`art.tsx:179`) | match |
| Lesson-Willpower | gradient `obW` | stops | `#F7F6F2` @0 → `#C9C6BD` @1 | same (`art.tsx:180-181`) | match |
| Lesson-Willpower | cable 1 | `d` / stroke-width / linecap | `M14 96 C40 88 62 86 92 90` / 15 / round | identical (`art.tsx:184`) | match |
| Lesson-Willpower | cable 2 | `d` / stroke-width / linecap | `M138 92 C168 96 194 104 216 114` / 15 / round | identical (`art.tsx:185`) | match |
| Lesson-Willpower | frayed strand 1 | `d` / stroke / width | `M92 88 C104 84 112 86 120 90` / `rgba(244,243,240,0.55)` / 3.5 | identical (`art.tsx:186`) | match |
| Lesson-Willpower | frayed strand 2 | `d` / stroke / width | `M94 94 C106 94 116 92 134 92` / `rgba(244,243,240,0.4)` / 3.5 | identical (`art.tsx:187`) | match |
| Lesson-Willpower | frayed strand 3 | `d` / stroke / width | `M96 100 C106 104 118 100 136 97` / `rgba(244,243,240,0.28)` / 3.5 | identical (`art.tsx:188`) | match |
| Lesson-Willpower | spark | cx / cy / r / fill | 115 / 76 / 4 / `#E9D2A4` | identical (`art.tsx:189`) | match |
| Lesson-Willpower | tension mark L | `d` / stroke / width / linecap | `M26 106 l-4 8 M42 104 l-3 7` / `rgba(244,243,240,0.25)` / 2.5 / round | identical (`art.tsx:190`) | match |
| Lesson-Willpower | tension mark R | `d` / stroke / width / linecap | `M196 118 l4 8 M182 114 l3 7` / `rgba(244,243,240,0.25)` / 2.5 / round | identical (`art.tsx:191`) | match |
| Lesson-Willpower | title | text | `It's not a willpower problem.` (U+0027, straight) | `'It’s not a willpower problem.'` (U+2019, curly) (`art.tsx:103`) | **MISMATCH** — Finding 1 |
| Lesson-Willpower | body | left / right | 26 / 26 | `bodyInset 26` (`art.tsx:106`) | match |
| Lesson-Willpower | body | top | canvas 614 / app 560 | `bodyTop 614` − 54 = 560 `v3.tsx:1106` | match |
| Lesson-Willpower | body | text | `Urges follow a wave — they rise, crest, and pass. VICI teaches you to ride them out instead of fighting them head-on.` | identical (`art.tsx:104`) | match |
| Lesson-Willpower | pager | active index | dot 1 of 4 | `step: 0` (`art.tsx:101`) | match |
| Lesson-Willpower | CTA | label | `Next` | `cta:'Next'` (`art.tsx:107`) | match |
| Lesson-Rewire | drawing | svg width / height / viewBox | 200 / 180 / `0 0 200 180` | identical (`art.tsx:200`) | match |
| Lesson-Rewire | drawing | top / margin-left | 34 / −100 | `artTop 34`, `−200/2 = −100` (`art.tsx:120`) | match |
| Lesson-Rewire | ground shadow | top | 177 | `shadowTop 177` (`art.tsx:120`) | match |
| Lesson-Rewire | gradient `obR` | x1/y1/x2/y2 | 0 / 0 / 1 / 1 | `x1="0" y1="0" x2="1" y2="1"` (`art.tsx:202`) | match |
| Lesson-Rewire | gradient `obR` | stops | `#F7F6F2` → `#C9C6BD` | same (`art.tsx:203-204`) | match |
| Lesson-Rewire | arc | `d` / stroke-width / linecap | `M148 96 a52 52 0 1 1-16-37` / 13 / round | identical (`art.tsx:207`) | match |
| Lesson-Rewire | arrow head | `d` / fill | `M120 42 l24 16 -28 10 Z` / `#F4F3F0` | identical (`art.tsx:208`) | match |
| Lesson-Rewire | core | cx / cy / r / fill | 96 / 96 / 7 / `#E9D2A4` | identical (`art.tsx:209`) | match |
| Lesson-Rewire | title | text | `Your brain can change.` | identical (`art.tsx:114`) | match |
| Lesson-Rewire | body | left / right | 30 / 30 | `bodyInset 30` (`art.tsx:117`) | match |
| Lesson-Rewire | body | top | canvas 586 / app 532 | `bodyTop 586` − 54 = 532 | match |
| Lesson-Rewire | body | text | `Every urge you outlast weakens the old loop and strengthens the new one. Neuroplasticity is on your side.` | identical (`art.tsx:115`) | match |
| Lesson-Rewire | pager | active index | dot 2 of 4 | `step: 1` (`art.tsx:112`) | match |
| Lesson-Rewire | CTA | label | `Continue` | `cta:'Continue'` (`art.tsx:118`) | match |
| Lesson-Anchor | drawing | svg width / height / viewBox | 190 / 185 / `0 0 190 185` | identical (`art.tsx:218`) | match |
| Lesson-Anchor | drawing | top / margin-left | 32 / −95 | `artTop 32`, `−190/2 = −95` (`art.tsx:131`) | match |
| Lesson-Anchor | ground shadow | top | 150 | `shadowTop 150` (`art.tsx:131`) | match |
| Lesson-Anchor | gradient `obA` | x1/y1/x2/y2 | 0 / 0 / 0 / 1 | `x1="0" y1="0" x2="0" y2="1"` (`art.tsx:220`) | match |
| Lesson-Anchor | gradient `obA` | stops | `#F7F6F2` → `#C4C1B8` | same (`art.tsx:221-222`) | match |
| Lesson-Anchor | ring | cx / cy / r / fill / stroke-width | 95 / 30 / 12 / none / 9 | identical (`art.tsx:225`) | match |
| Lesson-Anchor | shank | x / y / w / h / rx | 90.5 / 42 / 9 / 82 / 4.5 | identical (`art.tsx:226`) | match |
| Lesson-Anchor | stock | x / y / w / h / rx | 66 / 58 / 58 / 8 / 4 | identical (`art.tsx:227`) | match |
| Lesson-Anchor | flukes | `d` | `M95 124 C70 124 50 108 46 88 l-12 10 6-30 26 12 -12 6 c6 14 22 24 41 24 19 0 35-10 41-24 l-12-6 26-12 6 30 -12-10 c-4 20-24 36-49 36 Z` | identical, character for character (`art.tsx:229`) | match |
| Lesson-Anchor | title | text | `You won't do it on willpower alone.` (U+0027, straight) | `'You won’t do it on willpower alone.'` (U+2019) (`art.tsx:125`) | **MISMATCH** — Finding 1 |
| Lesson-Anchor | body | left / right / top | 30 / 30 / canvas 586 → app 532 | `bodyInset 30`, `bodyTop 586` (`art.tsx:127-128`) | match |
| Lesson-Anchor | body | text | `Structure beats resolve. Your cues, lessons, and check-ins carry you when motivation dips.` | identical (`art.tsx:126`) | match |
| Lesson-Anchor | pager | active index | dot 3 of 4 | `step: 2` (`art.tsx:123`) | match |
| Lesson-Anchor | CTA | label | `Continue` | `cta:'Continue'` (`art.tsx:129`) | match |
| Lesson-Small-Steps | drawing | svg width / height / viewBox | 200 / 180 / `0 0 200 180` | identical (`art.tsx:240`) | match |
| Lesson-Small-Steps | drawing | top / margin-left | 40 / −100 | `artTop 40`, `−200/2 = −100` (`art.tsx:142`) | match |
| Lesson-Small-Steps | ground shadow | top | 180 | `shadowTop 180` (`art.tsx:142`) | match |
| Lesson-Small-Steps | gradient `obS1` | x1/y1/x2/y2 | 0 / 0 / 0 / 1 | `x1="0" y1="0" x2="0" y2="1"` (`art.tsx:242`) | match |
| Lesson-Small-Steps | gradient `obS1` | stops | `#F7F6F2` → `#C9C6BD` | same (`art.tsx:243-244`) | match |
| Lesson-Small-Steps | step 1 | x / y / w / h / rx / opacity | 42 / 118 / 116 / 28 / 14 / 1 | identical (`art.tsx:247`) | match |
| Lesson-Small-Steps | step 2 | x / y / w / h / rx / opacity | 56 / 90 / 84 / 25 / 12.5 / 0.88 | identical (`art.tsx:248`) | match |
| Lesson-Small-Steps | step 3 | x / y / w / h / rx / opacity | 70 / 64 / 54 / 22 / 11 / 0.75 | identical (`art.tsx:249`) | match |
| Lesson-Small-Steps | beacon | cx / cy / r / fill | 97 / 44 / 7 / `#E9D2A4` | identical (`art.tsx:250`) | match |
| Lesson-Small-Steps | title | text | `Progress isn't a straight line.` (U+0027, straight) | `'Progress isn’t a straight line.'` (U+2019) (`art.tsx:136`) | **MISMATCH** — Finding 1 |
| Lesson-Small-Steps | body | left / right / top | 30 / 30 / canvas 586 → app 532 | `bodyInset 30`, `bodyTop 586` (`art.tsx:138-139`) | match |
| Lesson-Small-Steps | body | text | `Real change moves like a tide — in, out, in again. The waterline shifts over weeks, not hours.` | identical (`art.tsx:137`) | match |
| Lesson-Small-Steps | pager | active index | dot 4 of 4 | `step: 3` (`art.tsx:134`) | match |
| Lesson-Small-Steps | CTA | label | `Next` | `cta:'Next'` (`art.tsx:140`) | match |

---

## Table N — funnel order and per-frame CTA presence

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Lesson-Anchor | funnel position | sits between | Q17 (rule 74) and Q18 (rule 78) | inserted after `O3_QUESTIONS[16]` = `tried` (`welcome.tsx:85`) | match |
| Lesson-Small-Steps | funnel position | sits between | Q19 (rule 83) and Q20 (rule 87) | inserted after `O3_QUESTIONS[18]` = `load` (`welcome.tsx:86`) | match |
| Lesson-Willpower | funnel position | rule 15%, before section 2 | after `O3_QUESTIONS[2]` (`welcome.tsx:83`) | match |
| Lesson-Rewire | funnel position | rule 32%, before section 3 | after `O3_QUESTIONS[6]` (`welcome.tsx:84`) | match |
| Q15 · Q16 · Q18 · Q19 · Q21 · Q22 · Q23 | CTA | presence | none drawn | `hasCta` false → none `v3.tsx:949` | match |
| Q17 · Q20 | CTA | presence | drawn, `Continue · 3` | `multi` → drawn `v3.tsx:949` | match |
| Q24 · Q25 | CTA | presence | drawn, `Continue` | `typed` → drawn | match |
| Q26 | CTA | presence | drawn, `Continue` | `skip:true` → drawn | match |
| S5 · S6 · S7 | CTA | presence | drawn, `Continue` | always drawn `v3.tsx:1190` | match |
| 4 lessons | CTA | presence | drawn | always drawn `v3.tsx:1112` | match |
| all 19 | Back | presence | drawn on every frame | `onBack` non-null for every step past index 0 (`welcome.tsx:274`) | match |

---

## Notes — documented deviations (not counted as mismatches)

**D1 — CSS blur filters.** The canvas states `filter: blur(6px)` on the corner bloom,
`blur(7px)` on the lesson halo and `blur(10px)` on the lesson ground shadow. `react-native-svg`
has no blur filter primitive, so the port substitutes a softer radial falloff in each case
(`v3.tsx:304-306`, `art.tsx:152`, `art.tsx:268`, `art.tsx:276-282`). This is applied consistently
across all 19 frames and is the author's stated intent, not drift. The ground shadow is the one
place where the substitution changes the *stop list* (a flat 0.4 ellipse becomes a
0.4 → 0.18@62% → 0@100% ramp) rather than only the edge softness.

**D2 — noise tiling.** The canvas paints `noise-dark.png` as a CSS `background-image` (tiled);
the port uses `expo-image` with `contentFit="cover"` (`v3.tsx:326`, `art.tsx:58`), which scales the
asset to the frame instead of repeating it. Same opacity (0.12), different grain scale.

**D3 — the age-field caret.** Q25 draws a 2 × 22 `#F4F3F0` bar after the value as HTML's stand-in
for a text caret. The port renders a real `TextInput` caret instead (`v3.tsx:865-871, 884`), which
is the behaviour the frame is depicting. Q24 keeps the drawn bar because the frame needs it to
place the placeholder at x 51.

---

## Findings

**Row count: 515 comparison rows across 19 frames.** Of those, 3 are MISMATCHes, 5 are documented
platform deviations (Notes D1–D3), 1 is a web-only text-wrap difference, 9 are canvas-chrome rows
that are `n/a` to a native port (the status bar and the gallery frame's own shadow), and the
remaining 497 match.

1. **Lesson titles use a straight apostrophe in the canvas and a curly one in the app** — three
   occurrences, all in `/Users/admin/Documents/tideline/src/components/onboarding/art.tsx`:
   - line 103 — app `'It’s not a willpower problem.'` (U+2019); design `It's not a willpower problem.` (U+0027)
   - line 125 — app `'You won’t do it on willpower alone.'` (U+2019); design `You won't do it on willpower alone.` (U+0027)
   - line 136 — app `'Progress isn’t a straight line.'` (U+2019); design `Progress isn't a straight line.` (U+0027)

   **The canvas contradicts itself here.** Verified by hexdump of the raw frames: those three
   strings are plain ASCII `'` (0x27), and the three lesson files contain no `&rsquo;` entity and
   no non-ASCII bytes at all. Every other string in this same run uses the curly form — V3-Q16
   ships `I&rsquo;m not trying to change that`, and the wider run carries `you&rsquo;re`,
   `can&rsquo;t`, `It&rsquo;s`. The evidence supports the **curly** reading: the straight quotes
   are an authoring slip confined to the lesson deck, and the app is right. Recorded as a mismatch
   because the literals differ; the correct resolution is to fix the canvas, not the app.

2. **Web font stack literal differs** —
   `/Users/admin/Documents/tideline/src/lib/theme.ts:159`, `SANS_WEB_STACK` is
   `"-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"`; the canvas
   states `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif`. Both lead with
   `-apple-system`, so on Apple platforms the resolved face is identical and this is invisible;
   on a non-Apple web client the fallback chain diverges (`Segoe UI`/`Arial` vs
   `system-ui`/`Helvetica Neue`). No effect on iOS, where `sans()` returns `'System'`.

3. **Section-intro title loses `text-wrap: balance` on web** —
   `/Users/admin/Documents/tideline/src/components/onboarding/v3.tsx:1184` renders the 26px
   section title through `AppText` with the default `body` variant, and
   `/Users/admin/Documents/tideline/src/components/ui/AppText.tsx:127` assigns
   `textWrap: 'pretty'` to every variant except `hero`/`display`/`title`. The canvas states
   `text-wrap: balance` on that element (and `pretty` on the body under it, which does match).
   No effect on native — RN has no `textWrap` — so this only shows on the web build, where a
   two-line section title may break unevenly.

No other drift found: all 19 field gradients, all 19 low-sun boxes and glow stop-triples, all 19
progress-rule widths, every answer-row geometry and state fill, every checkbox and tick path,
both typed fields, all four lesson drawings (every `d` string compared character for character),
all four pager indices and every string in the run are identical between the canvas and the port.
