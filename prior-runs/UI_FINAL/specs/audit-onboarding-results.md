# Property audit — onboarding results run (13 frames)

**Design source (pretty):** `/Users/admin/Documents/tideline/.uifinal/pretty/final/Email Login/<Slug>.html`
**Design source (raw):** `/Users/admin/Documents/tideline/.uifinal/final/Email Login/<Slug>.html`
**App source:** `/Users/admin/Documents/tideline/src/components/onboarding/v3.tsx`, `/Users/admin/Documents/tideline/src/components/onboarding/art.tsx`
**Shell wiring:** `/Users/admin/Documents/tideline/src/app/(onboarding)/welcome.tsx`
**Primitives consulted (read-only):** `/Users/admin/Documents/tideline/src/components/ui/AppText.tsx`, `/Users/admin/Documents/tideline/src/components/ui/press-scale.tsx`, `/Users/admin/Documents/tideline/src/lib/theme.ts`

## Coordinate convention used in every row

Each canvas frame is a `393 × 852` div. Its `top` values are measured from the **frame's own top edge**, which includes a **54px status bar strip the app never builds** (iOS draws it). Two different app conventions therefore appear, and both are stated per row:

* **Inside `SafeAreaView edges={['top']}`** — everything the screen positions itself. App `top` = **canvas top − 54**.
* **Outside the safe area** (full-bleed fields: `AegisField`, `PlanReadyField`, `OnbPaperField`, the `Ambient` washes) — app `top` = **canvas top**, unchanged, because the layer spans the physical screen the canvas frame also spans.
* **Bottom-anchored controls** (`O3PaperCTA`, `O3PaperLink`) — app `bottom` = **852 − canvas top − height**, so the pill keeps its distance from the screen foot on a taller device. Every such row states the arithmetic.

The 54 assumption is exact only where the device's top safe-area inset is 54pt. That is a single systemic approximation, listed once in **Notes**, not repeated per row.

## Frame 1 — Enlisting-Aegis (095) · `O3ReadingPause`

App: `v3.tsx:1355–1397` (screen) + `art.tsx:313–376` (`AegisField`, `AegisCheck`, `AegisSpinner`). Rendered by an early return in `welcome.tsx:268`, so it owns the whole frame — no `O3Shell`, no rule, no Back.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Enlisting-Aegis | frame root | width | `393px` | device width (RN `flex:1`) | match (canvas is the device frame) |
| Enlisting-Aegis | frame root | height | `852px` | device height (RN `flex:1`) | match |
| Enlisting-Aegis | frame root | background | `#F4F3F0` | `backgroundColor: '#F4F3F0'` — `v3.tsx:1369` | match |
| Enlisting-Aegis | frame root | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | `sansFamily['400'..'600'] = 'System'` (iOS) via `sans()` — `theme.ts:160` | match |
| Enlisting-Aegis | frame root | overflow | `hidden` | RN default (no overflow scroll) | match |
| Enlisting-Aegis | frame root | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | not drawn | match (canvas gallery chrome, not screen content) |
| Enlisting-Aegis | field wash | position / inset | `absolute; inset:0` | `StyleSheet.absoluteFill` — `art.tsx:315` | match |
| Enlisting-Aegis | field wash | gradient angle | `linear-gradient(180deg, …)` | `start={{x:0,y:0}} end={{x:0,y:1}}` — `art.tsx:319–320` | match |
| Enlisting-Aegis | field wash | stop 1 | `#131313 0%` | `'#131313'` @ `locations[0]=0` — `art.tsx:317–318` | match |
| Enlisting-Aegis | field wash | stop 2 | `#2A2924 26%` | `'#2A2924'` @ `0.26` | match |
| Enlisting-Aegis | field wash | stop 3 | `#6E7069 52%` | `'#6E7069'` @ `0.52` | match |
| Enlisting-Aegis | field wash | stop 4 | `#C9C8C4 74%` | `'#C9C8C4'` @ `0.74` | match |
| Enlisting-Aegis | field wash | stop 5 | `#FFFFFF 100%` | `'#FFFFFF'` @ `1` | match |
| Enlisting-Aegis | noise overlay | image | `url('noise-dark.png')` | `require('../../../assets/images/noise-dark.png')` — `art.tsx:25` | match |
| Enlisting-Aegis | noise overlay | opacity | `0.12` | `<Noise opacity={0.12} />` — `art.tsx:323` | match |
| Enlisting-Aegis | noise overlay | pointer-events | `none` | `pointerEvents="none"` on wrapper + `Noise` — `art.tsx:315`, `art.tsx:59` | match |
| Enlisting-Aegis | noise overlay | z-order | after gradient, before disc | same document order — `art.tsx:316–337` | match |
| Enlisting-Aegis | status bar | height / padding / z | `54px`, `6px 32px 0 46px`, `z-index:20` | not built | match (OS-drawn) |
| Enlisting-Aegis | caption "Charting your plan. One moment." | absolute top | `150px` | `top: 96` (150 − 54) — `v3.tsx:1373` | match |
| Enlisting-Aegis | caption | left / right | `0 / 0` | `left: 0, right: 0` | match |
| Enlisting-Aegis | caption | text-align | `center` | `center` prop → `textAlign:'center'` | match |
| Enlisting-Aegis | caption | font-size | `15px` | `fontSize: 15` | match |
| Enlisting-Aegis | caption | numeric weight | `400` | `sans('400')` | match |
| Enlisting-Aegis | caption | colour with alpha | `rgba(244,243,240,0.8)` | `'rgba(244,243,240,0.8)'` | match |
| Enlisting-Aegis | caption | line-height | not stated (normal) | none set → dropped by `AppText` (`AppText.tsx:120`) | match |
| Enlisting-Aegis | caption | letter-spacing | not stated | none set → dropped by `AppText` | match |
| Enlisting-Aegis | caption | max lines | unbounded | unbounded | match |
| Enlisting-Aegis | bar track | absolute left / top | `41px / 177px` | `left: 41, top: 123` (177 − 54) — `v3.tsx:1376` | match |
| Enlisting-Aegis | bar track | width / height | `311px / 3px` | `width: 311, height: 3` | match |
| Enlisting-Aegis | bar track | border-radius | `2px` (all four corners) | `borderRadius: 2` | match |
| Enlisting-Aegis | bar track | background | `rgba(244,243,240,0.25)` | `'rgba(244,243,240,0.25)'` | match |
| Enlisting-Aegis | bar track | overflow | not stated | `overflow: 'hidden'` | match (fill never exceeds track) |
| Enlisting-Aegis | bar fill | left / top | `0 / 0` | flow child at origin | match |
| Enlisting-Aegis | bar fill | width | `186px` of `311` (59.807%) — the frame's mid-state | animated `'0%' → '100%'`, `bar` starts at `0.04`, `duration = AEGIS_MS − 400 = 6400ms`, `Easing.bezier(0.25,0.6,0.3,1)` — `v3.tsx:1357–1359, 1377` | deviation (documented, see Notes N-1) |
| Enlisting-Aegis | bar fill | height / radius | `3px / 2px` | `height: 3, borderRadius: 2` | match |
| Enlisting-Aegis | bar fill | background | `#F4F3F0` | `'#F4F3F0'` | match |
| Enlisting-Aegis | steps stack | absolute top | `262px` | `top: 208` (262 − 54) — `v3.tsx:1379` | match |
| Enlisting-Aegis | steps stack | left / right | `0 / 0` | `left: 0, right: 0` | match |
| Enlisting-Aegis | steps stack | flex-direction | `column` | RN default `column` | match |
| Enlisting-Aegis | steps stack | align-items | `center` | `alignItems: 'center'` | match |
| Enlisting-Aegis | steps stack | gap | `16px` | `gap: 16` | match |
| Enlisting-Aegis | step row | flex-direction / align | `row` (flex default) / `center` | `flexDirection:'row', alignItems:'center'` — `v3.tsx:1383` | match |
| Enlisting-Aegis | step row | gap | `10px` | `gap: 10` | match |
| Enlisting-Aegis | tick glyph | icon size | `15 × 15` | `width={15} height={15}` — `art.tsx:345` | match |
| Enlisting-Aegis | tick glyph | viewBox | `0 0 15 15` | `viewBox="0 0 15 15"` | match |
| Enlisting-Aegis | tick glyph | path `d` | `M2.5 8l3.2 3.2L12.5 4` | `"M2.5 8l3.2 3.2L12.5 4"` — `art.tsx:346` | match |
| Enlisting-Aegis | tick glyph | fill | `none` | `fill="none"` | match |
| Enlisting-Aegis | tick glyph | stroke colour | `#F4F3F0` | `stroke="#F4F3F0"` | match |
| Enlisting-Aegis | tick glyph | stroke width | `2.4` | `strokeWidth={2.4}` | match |
| Enlisting-Aegis | tick glyph | caps / joins | `round` / `round` | `strokeLinecap="round" strokeLinejoin="round"` | match |
| Enlisting-Aegis | spinner ring | width / height | `13px / 13px` | `width: 13, height: 13` — `art.tsx:366–367` | match |
| Enlisting-Aegis | spinner ring | border-radius | `50%` | `borderRadius: 6.5` | match |
| Enlisting-Aegis | spinner ring | border width / colour | `2px solid rgba(244,243,240,0.55)` | `borderWidth: 2, borderColor:'rgba(244,243,240,0.55)'` | match |
| Enlisting-Aegis | spinner ring | border-top-color | `transparent` | `borderTopColor: 'transparent'` | match |
| Enlisting-Aegis | spinner ring | box-sizing | `border-box` | RN border-box always | match |
| Enlisting-Aegis | spinner ring | state drawn | one still three-quarter ring | rotates `0deg→360deg`, `1100ms`, `Easing.linear`, looped — `art.tsx:359` | deviation (documented, see Notes N-2) |
| Enlisting-Aegis | step label (ticked) | font-size | `15.5px` | `fontSize: 15.5` — `v3.tsx:1385` | match |
| Enlisting-Aegis | step label (ticked) | numeric weight | `500` | `sans('500')` | match |
| Enlisting-Aegis | step label (ticked) | colour | `#F4F3F0` | `'#F4F3F0'` | match |
| Enlisting-Aegis | step label (running) | colour with alpha | `rgba(244,243,240,0.75)` | `'rgba(244,243,240,0.75)'` | match |
| Enlisting-Aegis | step labels | copy | `Reading your answers` / `Mapping your risky window` / `Choosing your first week` | `AEGIS_STEPS` identical — `v3.tsx:1352` | match |
| Enlisting-Aegis | step ticking | which rows are ticked | rows 1–2 ticked, row 3 running | `setDone(k)` at `(6800/3.4)·k` → all three tick in turn — `v3.tsx:1360` | deviation (documented, see Notes N-1) |
| Enlisting-Aegis | headline | absolute top | `434px` | `top: 380` (434 − 54) — `v3.tsx:1390` | match |
| Enlisting-Aegis | headline | left / right | `20px / 20px` | `left: 20, right: 20` | match |
| Enlisting-Aegis | headline | text-align | `center` | `center` prop | match |
| Enlisting-Aegis | headline | font-size | `20px` | `fontSize: 20` | match |
| Enlisting-Aegis | headline | numeric weight | `500` | `sans('500')` | match |
| Enlisting-Aegis | headline | letter-spacing | `0.1px` | `letterSpacing: 0.1` | match |
| Enlisting-Aegis | headline | line-height | `31px` | `lineHeight: 31` | match |
| Enlisting-Aegis | headline | colour | `#2A2924` | `'#2A2924'` | match |
| Enlisting-Aegis | headline | text-wrap | `pretty` | no RN equivalent (web only, `AppText.tsx:126`) | match (platform gap, no numeric drift) |
| Enlisting-Aegis | headline | copy | `From the dark hours to first light — your plan guards the risky window first.` | identical, em dash — `v3.tsx:1391` | match |
| Enlisting-Aegis | sunrise disc | absolute left | `-3px` | `left: -3` — `art.tsx:327` | match |
| Enlisting-Aegis | sunrise disc | absolute top | `563px` (frame-absolute, outside safe area) | `discTop = 563`, unchanged — `art.tsx:313, 328` | match |
| Enlisting-Aegis | sunrise disc | width / height | `399px / 399px` | `399 / 399` | match |
| Enlisting-Aegis | sunrise disc | border-radius | `50%` | `borderRadius: 199.5` | match |
| Enlisting-Aegis | sunrise disc | background | `#FFFFFF` | `'#FFFFFF'` | match |
| Enlisting-Aegis | sunrise disc | shadow x/y/blur/spread/colour | `0 / −20px / 70px / 0 / rgba(255,255,255,0.6)` | `boxShadow: '0 -20px 70px rgba(255,255,255,0.6)'` — `art.tsx:333` | match |
| Enlisting-Aegis | sunrise disc | overflow | `hidden` | `overflow: 'hidden'` | match |
| Enlisting-Aegis | disc noise | opacity | `0.08` | `<Noise opacity={0.08} />` — `art.tsx:336` | match |

## Frame 2 — Plan-Ready (096) · `O3PlanReady`

App: `v3.tsx:1246–1262` + `art.tsx:381–461` (`PlanReadyField`, `PlanReadyArt`, `SunDisc`/`SUN_86`). Chrome from `welcome.tsx:128` — `{ seg: 8, paper: 'plan', back: false }`.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Plan-Ready | frame root | background | `#F4F3F0` | `PlanReadyField` paints `backgroundColor:'#F4F3F0'` full-bleed — `art.tsx:383` | match |
| Plan-Ready | noise overlay | opacity | `0.07` | `<Noise opacity={0.07} />` — `art.tsx:384` | match |
| Plan-Ready | top dust wash | left / top | `-15% / -190px` | `left:'-15%', top:-190` — `art.tsx:392` | match |
| Plan-Ready | top dust wash | width / height | `130% / 300px` | `width:'130%', height:300` | match |
| Plan-Ready | top dust wash | border-radius | `50%` | ellipse inscribed by `Wash` radial `rx/ry 50%` — `art.tsx:42` | match |
| Plan-Ready | top dust wash | gradient shape | `radial-gradient(closest-side, …)` | `RadialGradient cx/cy 50% rx/ry 50%` | match |
| Plan-Ready | top dust wash | stop 1 | `rgba(180,170,150,0.32)` @ 0% | `rgb(180,170,150)` @ `0%`, opacity `0.32` — `art.tsx:388` | match |
| Plan-Ready | top dust wash | stop 2 | `rgba(180,170,150,0.1)` @ 55% | `0.1` @ `55%` | match |
| Plan-Ready | top dust wash | stop 3 | `rgba(180,170,150,0)` @ 75% | `0` @ `75%` | match |
| Plan-Ready | top dust wash | filter | `blur(5px)` | no RN SVG blur; falloff carries it — `art.tsx:385` | deviation (documented, see Notes N-3) |
| Plan-Ready | bottom warm wash | left / bottom | `50% / -260px` | `left:'50%', bottom:-260` — `art.tsx:400` | match |
| Plan-Ready | bottom warm wash | width / height | `520px / 520px` | `520 / 520` | match |
| Plan-Ready | bottom warm wash | margin-left | `-260px` | `marginLeft: -260` | match |
| Plan-Ready | bottom warm wash | stop 1 | `rgba(255,236,196,0.4)` @ 0% | `rgb(255,236,196)` @ `0%`, `0.4` — `art.tsx:396` | match |
| Plan-Ready | bottom warm wash | stop 2 | `rgba(255,236,196,0.18)` @ 45% | `0.18` @ `45%` | match |
| Plan-Ready | bottom warm wash | stop 3 | `rgba(255,236,196,0)` @ 72% | `0` @ `72%` | match |
| Plan-Ready | progress rule | absolute top | `66px` | `top: 12` (66 − 54) — `v3.tsx:252` | match |
| Plan-Ready | progress rule | left / right | `24px / 24px` | `left: 24, right: 24` | match |
| Plan-Ready | progress rule | gap | `8px` | `gap: 8` | match |
| Plan-Ready | progress rule | segment count | 8 | `Array.from({length: 8})` — `v3.tsx:253` | match |
| Plan-Ready | progress rule | segments inked | 8 of 8 | `seg: 8` — `welcome.tsx:128` | match |
| Plan-Ready | progress rule | segment flex / height / radius | `flex:1 / 4px / 2px` | `flex:1, height:4, borderRadius:2` — `v3.tsx:254` | match |
| Plan-Ready | progress rule | inked colour | `#131313` | `'#131313'` | match |
| Plan-Ready | progress rule | unfilled colour | `rgba(0,0,0,0.14)` (not used on this frame) | `'rgba(0,0,0,0.14)'` | match |
| Plan-Ready | Back control | presence | not drawn | `back: false` — `welcome.tsx:128` | match |
| Plan-Ready | art stage | absolute left / top | `50% / 150px` | `left:'50%', top: 96` (150 − 54) — `v3.tsx:1249` | match |
| Plan-Ready | art stage | width / height | `260px / 280px` | `width: 260, height: 280` — `art.tsx:412` | match |
| Plan-Ready | art stage | margin-left | `-130px` | `marginLeft: -130` | match |
| Plan-Ready | art halo | left / top | `44px / 16px` | `left: 44, top: 16` — `art.tsx:419` | match |
| Plan-Ready | art halo | width / height | `172px / 172px` | `172 / 172` | match |
| Plan-Ready | art halo | stop 1 | `rgba(226,186,120,0.46)` @ 0% | `rgb(226,186,120)` @ `0%`, `0.46` — `art.tsx:416` | match |
| Plan-Ready | art halo | stop 2 | `rgba(226,186,120,0)` @ 74% | `0` @ `74%` | match |
| Plan-Ready | art halo | filter | `blur(5px)` | radial falloff | deviation (N-3) |
| Plan-Ready | ground shadow | left / top | `52px / 248px` | `left: 52, top: 248` — `art.tsx:427` | match |
| Plan-Ready | ground shadow | width / height | `156px / 15px` | `156 / 15` | match |
| Plan-Ready | ground shadow | colour | `rgba(0,0,0,0.10)` | `rgb(0,0,0)` @ `0%`, `0.1` → `0` @ `100%` — `art.tsx:424–425` | match |
| Plan-Ready | ground shadow | filter | `blur(6px)` | radial falloff | deviation (N-3) |
| Plan-Ready | paper card | left / top | `56px / 52px` | `left: 56, top: 52` — `art.tsx:432–433` | match |
| Plan-Ready | paper card | width / height | `148px / 152px` | `148 / 152` | match |
| Plan-Ready | paper card | border-radius | `9px` | `borderRadius: 9` | match |
| Plan-Ready | paper card | background | `#FFFFFF` | `'#FFFFFF'` | match |
| Plan-Ready | paper card | shadow | `0 0 0 1px rgba(0,0,0,0.07), 0 18px 36px rgba(40,38,32,0.16)` | identical string — `art.tsx:439` | match |
| Plan-Ready | paper card | transform | `rotate(-2deg)` | `transform:[{rotate:'-2deg'}]` | match |
| Plan-Ready | paper card | overflow | `hidden` | `overflow:'hidden'` | match |
| Plan-Ready | paper card | corner style | circular (CSS) | `borderCurve:'continuous'` | deviation (N-4) |
| Plan-Ready | card noise | opacity | `0.05` | `<Noise opacity={0.05} />` — `art.tsx:443` | match |
| Plan-Ready | card title bar | left / top | `14px / 13px` | `left: 14, top: 13` — `art.tsx:444` | match |
| Plan-Ready | card title bar | width / height / radius | `52px / 5px / 3px` | `52 / 5 / 3` | match |
| Plan-Ready | card title bar | background | `#E0DFDA` | `'#E0DFDA'` | match |
| Plan-Ready | route svg | width / height | `120 / 100` | `width={120} height={104}` — `art.tsx:448` | deviation (N-5, same on-screen mapping) |
| Plan-Ready | route svg | viewBox | `0 0 120 100` | `0 -4 120 104` | deviation (N-5) |
| Plan-Ready | route svg | left / top | `14px / 30px` | `left: 14, top: 26` | deviation (N-5; user-space y maps to `30 + y` in both) |
| Plan-Ready | route path | `d` | `M8 88 C30 74 22 52 44 44 C68 35 78 26 104 12` | identical — `art.tsx:449` | match |
| Plan-Ready | route path | stroke / width / fill | `#131313` / `2.4` / `none` | `#131313` / `2.4` / `none` | match |
| Plan-Ready | route path | cap | `round` | `strokeLinecap="round"` | match |
| Plan-Ready | route path | dash array | `1 8` | `strokeDasharray="1 8"` | match |
| Plan-Ready | route start dot | cx / cy / r / fill | `8 / 88 / 5 / #131313` | identical — `art.tsx:450` | match |
| Plan-Ready | route mid dot | cx / cy / r | `44 / 44 / 4` | identical — `art.tsx:451` | match |
| Plan-Ready | route mid dot | fill / stroke / width | `#FFFFFF` / `#131313` / `2` | identical | match |
| Plan-Ready | flag corner path | `d` | `M104 12 L104 0 L96 0` | identical — `art.tsx:453` | match |
| Plan-Ready | flag corner path | fill | unset → SVG default black | `fill="#000000"` | match |
| Plan-Ready | flag corner path | stroke | `none` | unset → RN SVG default none | match |
| Plan-Ready | flagpole | x / y / width / height / rx | `102 / -2 / 3 / 18 / 1.5` | identical — `art.tsx:454` | match |
| Plan-Ready | flagpole | fill | `#131313` | `#131313` | match |
| Plan-Ready | flagpole | clipping at viewport top | top 2 user-units clipped by `viewBox` | not clipped (viewBox lifted 4) | deviation (N-5) |
| Plan-Ready | pennant | `d` / fill | `M105 0 L118 4.5 L105 9 Z` / `#131313` | identical — `art.tsx:455` | match |
| Plan-Ready | corner sun | right / bottom | `12px / 12px` | `right: 12, bottom: 12` — `art.tsx:457` | match |
| Plan-Ready | corner sun | width / height | `26px / 26px` | `size={26}` | match |
| Plan-Ready | corner sun | border-radius | `50%` | `Circle r = size/2` fills the box — `art.tsx:518` | match |
| Plan-Ready | corner sun | gradient centre | `circle at 38% 30%` | `cx="38%" cy="30%"` | match |
| Plan-Ready | corner sun | gradient radius | CSS default `farthest-corner` | `r="93.5%"` (√(0.62²+0.70²)) — `art.tsx:457, 488` | match |
| Plan-Ready | corner sun | stop 1 | `#F0DBB4` @ 0% | `SUN_86[0] = ['0%','#F0DBB4']` — `art.tsx:469` | match |
| Plan-Ready | corner sun | stop 2 | `#E2BA78` @ 70% | `['70%','#E2BA78']` | match |
| Plan-Ready | headline | absolute top | `472px` | `top: 418` (472 − 54) — `v3.tsx:1252` | match |
| Plan-Ready | headline | left / right | `36px / 36px` | `left: 36, right: 36` | match |
| Plan-Ready | headline | text-align | `center` | `center` prop | match |
| Plan-Ready | headline | font-size | `24px` | `fontSize: 24` | match |
| Plan-Ready | headline | numeric weight | `500` | `sans('500')` | match |
| Plan-Ready | headline | line-height | `32px` | `lineHeight: 32` | match |
| Plan-Ready | headline | letter-spacing | `-0.1px` | `letterSpacing: -0.1` | match |
| Plan-Ready | headline | colour | `#1D1C1A` | `'#1D1C1A'` | match |
| Plan-Ready | headline | text-wrap | `balance` | no RN equivalent | match (platform gap) |
| Plan-Ready | headline | copy | `Your plan is ready.` | identical | match |
| Plan-Ready | sub-line | absolute top | `522px` | `top: 468` (522 − 54) — `v3.tsx:1255` | match |
| Plan-Ready | sub-line | left / right | `44px / 44px` | `left: 44, right: 44` | match |
| Plan-Ready | sub-line | font-size / weight | `15.5px / 400` | `fontSize: 15.5`, `sans('400')` | match |
| Plan-Ready | sub-line | line-height | `23px` | `lineHeight: 23` | match |
| Plan-Ready | sub-line | colour | `#55534E` | `'#55534E'` | match |
| Plan-Ready | sub-line | copy | `Built from your answers — it re-tunes as you log.` | identical, em dash | match |
| Plan-Ready | CTA pill | absolute top | `688px` | `bottom: 852 − 688 − 56 = 108` — `v3.tsx:432, 1258` | match |
| Plan-Ready | CTA pill | left / right | `24px / 24px` | `left: 24, right: 24` | match |
| Plan-Ready | CTA pill | height | `56px` | `h={56}` | match |
| Plan-Ready | CTA pill | border-radius | `28px` | `borderRadius: h/2 = 28` | match |
| Plan-Ready | CTA pill | background | `#131313` | `'#131313'` | match |
| Plan-Ready | CTA pill | align / justify | `center / center` | `alignItems:'center', justifyContent:'center'` | match |
| Plan-Ready | CTA label | font-size / weight | `17px / 600` | `fontSize: 17`, `sans('600')` — `v3.tsx:441` | match |
| Plan-Ready | CTA label | letter-spacing | `0.2px` | `ls` default `0.2` | match |
| Plan-Ready | CTA label | colour | `#FFFFFF` | `'#FFFFFF'` | match |
| Plan-Ready | CTA label | copy | `See my plan` | identical | match |
| Plan-Ready | ghost link | absolute top | `764px` | `bottom: 852 − 764 − 18 = 70` — `v3.tsx:458, 1259` | match |
| Plan-Ready | ghost link | left / right | `0 / 0` | `left: 0, right: 0` | match |
| Plan-Ready | ghost link | font-size / weight | `15px / 500` | `fontSize: 15`, `sans('500')` | match |
| Plan-Ready | ghost link | colour | `#8B8882` | `'#8B8882'` | match |
| Plan-Ready | ghost link | copy | `Change an answer` | identical | match |

## Shared paper chrome — Root-Loop, Current-Pattern, Cost-Next-30, Cost-Next-365, Cost-By-Age-80, Hopeful-Reversal, Streak-Sawtooth, Campaign-Line, Rewire-Curve, Results-Pattern

These ten frames state a byte-identical field, status bar, rule and Back row. Audited once here rather than repeated ten times; per-frame tables below carry only the segment count and the frame's own content.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| (shared paper) | frame root | background | `linear-gradient(180deg, #FAF9F8 0%, #FDFDFC 100%)` | `OnbPaperField` `LinearGradient colors={['#FAF9F8','#FDFDFC']}`, `start y0 → end y1` — `art.tsx:531` | match |
| (shared paper) | frame root | shell background under field | — | `tone.bg = PAPER.bg = '#FAF9F8'` — `v3.tsx:87, 240` | match (identical to the gradient's first stop) |
| (shared paper) | top bloom | left / top | `-40px / -140px` | `left: -40, top: -140` — `art.tsx:538` | match |
| (shared paper) | top bloom | width / height | `540px / 270px` | `540 / 270` | match |
| (shared paper) | top bloom | border-radius | `50%` | inscribed ellipse (`Wash`) | match |
| (shared paper) | top bloom | stop 1 | `rgba(180,170,150,0.14)` @ 0% | `rgb(180,170,150)` @ `0%`, `0.14` — `art.tsx:535` | match |
| (shared paper) | top bloom | stop 2 | `rgba(19,19,19,0)` @ 72% | `rgb(19,19,19)` @ `72%`, `0` | match |
| (shared paper) | top bloom | filter | `blur(6px)` | radial falloff | deviation (N-3) |
| (shared paper) | bottom warm wash | left / bottom | `50% / -300px` | `left:'50%', bottom:-300` — `art.tsx:546` | match |
| (shared paper) | bottom warm wash | width / height | `560px / 560px` | `560 / 560` | match |
| (shared paper) | bottom warm wash | margin-left | `-280px` | `marginLeft: -280` | match |
| (shared paper) | bottom warm wash | stop 1 | `rgba(255,236,196,0.42)` @ 0% | `0.42` @ `0%` — `art.tsx:542` | match |
| (shared paper) | bottom warm wash | stop 2 | `rgba(255,236,196,0.19)` @ 45% | `0.19` @ `45%` | match |
| (shared paper) | bottom warm wash | stop 3 | `rgba(255,236,196,0)` @ 72% | `0` @ `72%` | match |
| (shared paper) | field noise | opacity | `0.12` | `<Noise opacity={0.12} />` — `art.tsx:548` | match |
| (shared paper) | field noise | z-order | last inside the field layer | last child — `art.tsx:548` | match |
| (shared paper) | status bar | all properties | `54px` strip, `z-index:20`, `#1D1C1A` glyphs | not built | match (OS-drawn) |
| (shared paper) | progress rule | absolute top | `66px` | `top: 12` (66 − 54) — `v3.tsx:252` | match |
| (shared paper) | progress rule | left / right / gap | `24px / 24px / 8px` | `24 / 24 / 8` | match |
| (shared paper) | progress segment | flex / height / border-radius | `1 / 4px / 2px` | `flex:1, height:4, borderRadius:2` | match |
| (shared paper) | progress segment | inked colour | `#131313` | `'#131313'` | match |
| (shared paper) | progress segment | unfilled colour | `rgba(0,0,0,0.14)` | `'rgba(0,0,0,0.14)'` | match |
| (shared paper) | Back row | absolute left / top | `16px / 96px` | `left: 16, top: 42` (96 − 54, `PAPER_BACK`) — `v3.tsx:268`, `welcome.tsx:121` | match |
| (shared paper) | Back row | flex-direction / align / gap | `row / center / 9px` | `flexDirection:'row', alignItems:'center', gap: 9` | match |
| (shared paper) | Back chevron | icon size / viewBox | `11 × 19` / `0 0 11 19` | `width={11} height={19} viewBox="0 0 11 19"` — `v3.tsx:269` | match |
| (shared paper) | Back chevron | path `d` | `M9.5 1.5L2 9.5l7.5 8` | identical — `v3.tsx:270` | match |
| (shared paper) | Back chevron | fill / stroke / width | `none` / `#55534E` / `2.4` | `none` / `backInk = tone.ink2 = colors.textMuted = '#55534E'` / `2.4` — `theme.ts:53`, `v3.tsx:236` | match |
| (shared paper) | Back chevron | caps / joins | `round` / `round` | `round` / `round` | match |
| (shared paper) | Back label | font-size / weight / colour | `17px / 400 / #55534E` | `fontSize: 17`, `sans('400')`, `#55534E` — `v3.tsx:272` | match |
| (shared paper) | Back label | copy | `Back` | `Back` | match |
| (shared paper) | screen content box | horizontal padding | — (frames position absolutely) | `paddingHorizontal: 24, paddingTop: 76, paddingBottom: 32` on the flow box; absolute children measure from the box edge, not its content — `v3.tsx:278` | match |

## Frame 3 — Root-Loop (097) · `O3Root`

App: `v3.tsx:1421–1446` + `art.tsx:579–621` (`RootLoopCard`, `LoopLabel`, `SUN_87`). Chrome: `{ seg: 2, backTop: 42 }` — `welcome.tsx:129`.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Root-Loop | progress rule | segments inked | 2 of 8 | `seg: 2` — `welcome.tsx:129` | match |
| Root-Loop | headline | absolute top | `166px` | `top: 112` (166 − 54) — `v3.tsx:1438` | match |
| Root-Loop | headline | left / right | `36px / 36px` | `inset={36}` — `v3.tsx:466` | match |
| Root-Loop | headline | text-align | `center` | `center` prop | match |
| Root-Loop | headline | font-size | `24px` | `fontSize: 24` — `v3.tsx:467` | match |
| Root-Loop | headline | numeric weight | `500` | `sans('500')` | match |
| Root-Loop | headline | line-height | `32px` | `lineHeight: 32` | match |
| Root-Loop | headline | letter-spacing | `-0.2px` | `letterSpacing: -0.2` | match |
| Root-Loop | headline | colour | `#1D1C1A` | `'#1D1C1A'` | match |
| Root-Loop | headline | text-wrap | `balance` | no RN equivalent | match (platform gap) |
| Root-Loop | headline | copy | `Porn isn't the problem, Sam. It's your anesthetic for loneliness.` (U+0027 apostrophes) | `Porn isn’t the problem, {name}. It’s your anesthetic for {word}.` (U+2019) — `v3.tsx:1428` | **MISMATCH** |
| Root-Loop | card | absolute top | `316px` | `top: 262` (316 − 54) — `v3.tsx:1439` | match |
| Root-Loop | card | left / right | `24px / 24px` | `left: 24, right: 24` | match |
| Root-Loop | card | border-radius | `20px` | `CARD.borderRadius = 20` — `art.tsx:66` | match |
| Root-Loop | card | corner style | circular | `borderCurve:'continuous'` | deviation (N-4) |
| Root-Loop | card | background | `#FFFFFF` | `'#FFFFFF'` | match |
| Root-Loop | card | shadow (hairline) | `0 0 0 1px rgba(0,0,0,0.09)` | `boxShadow:'0 0 0 1px rgba(0,0,0,0.09)'` | match |
| Root-Loop | card | padding top / x / bottom | `18px / 12px / 12px` | `paddingTop:18, paddingHorizontal:12, paddingBottom:12` — `art.tsx:581` | match |
| Root-Loop | card | overflow | `hidden` | `overflow:'hidden'` | match |
| Root-Loop | card noise | opacity | `0.05` | `<Noise opacity={0.05} radius={20} />` — `art.tsx:582` | match |
| Root-Loop | card noise | pointer-events | `none` | `pointerEvents="none"` — `art.tsx:59` | match |
| Root-Loop | card noise | z-order vs the chart | the `<svg>` carries `position:relative`, so it paints **above** the absolute noise | chart wrapper declared last → paints above the noise — `art.tsx:582–601` | match |
| Root-Loop | centre halo | left / top | `50% / 50%` | `left:'50%', top:'50%'` — `art.tsx:589` | match |
| Root-Loop | centre halo | width / height | `64px / 64px` | `64 / 64` | match |
| Root-Loop | centre halo | margin | `-32px 0 0 -32px` | `marginLeft:-32, marginTop:-32` | match |
| Root-Loop | centre halo | stop 1 | `rgba(226,186,120,0.5)` @ 0% | `0.5` @ `0%` — `art.tsx:586` | match |
| Root-Loop | centre halo | stop 2 | `rgba(226,186,120,0)` @ 74% | `0` @ `74%` | match |
| Root-Loop | centre halo | filter | `blur(3px)` | radial falloff | deviation (N-3) |
| Root-Loop | sun disc | left / top | `50% / 50%` | `left:'50%', top:'50%'` — `art.tsx:597` | match |
| Root-Loop | sun disc | width / height | `34px / 34px` | `size={34}` | match |
| Root-Loop | sun disc | margin | `-14px 0 0 -17px` | `marginTop:-14, marginLeft:-17` | match |
| Root-Loop | sun disc | border-radius | `50%` | `borderRadius: 17` + inscribed `Circle` | match |
| Root-Loop | sun disc | gradient centre | `circle at 50% 30%` | `cx="50%" cy="30%"` | match |
| Root-Loop | sun disc | gradient radius | CSS `farthest-corner` | `r="86%"` (√(0.5²+0.70²)) — `art.tsx:488` | match |
| Root-Loop | sun disc | stop 1 | `#FBF2E2` @ 0% | `SUN_87[0]` — `art.tsx:473` | match |
| Root-Loop | sun disc | stop 2 | `#F0DBB4` @ 65% | `['65%','#F0DBB4']` | match |
| Root-Loop | sun disc | stop 3 | `#DFC08B` @ 100% | `['100%','#DFC08B']` | match |
| Root-Loop | sun disc | shadow | `0 0 0 1px rgba(0,0,0,0.06)` | identical — `art.tsx:597` | match |
| Root-Loop | sun disc | overflow | `hidden` | `overflow:'hidden'` | match |
| Root-Loop | sun disc noise | opacity | `0.4` | `<Noise opacity={0.4} />` — `art.tsx:598` | match |
| Root-Loop | caption | absolute top | `566px` | `top: 512` (566 − 54) — `v3.tsx:1442` | match |
| Root-Loop | caption | left / right | `44px / 44px` | `inset` default `44` — `v3.tsx:474` | match |
| Root-Loop | caption | font-size / weight | `14px / 400` | `fontSize: 14`, `sans('400')` — `v3.tsx:476` | match |
| Root-Loop | caption | line-height | `21px` | `lineHeight: 21` | match |
| Root-Loop | caption | colour | `#55534E` | `'#55534E'` | match |
| Root-Loop | caption | text-align | `center` | `center` prop | match |
| Root-Loop | caption | copy | `Late at night, home alone — the loneliness rises, relief lasts minutes, and the loop turns again.` | `{Cap(triggers[0..2])} — the {word} rises, relief lasts minutes, and the loop turns again.` — `v3.tsx:1434` | match (same template; frame shows the two-trigger case) |
| Root-Loop | CTA pill | absolute top | `744px` | `bottom: 852 − 744 − 58 = 50` — `v3.tsx:1443` | match |
| Root-Loop | CTA pill | height / border-radius | `58px / 29px` | `h` default `58`, `borderRadius: 29` — `v3.tsx:422, 435` | match |
| Root-Loop | CTA pill | left / right / background | `24px / 24px / #131313` | `24 / 24 / '#131313'` | match |
| Root-Loop | CTA label | size / weight / tracking / colour | `17px / 600 / 0.2px / #FFFFFF` | `17 / sans('600') / 0.2 / '#FFFFFF'` | match |
| Root-Loop | CTA label | copy | `Follow it forward` | identical | match |

### Root-Loop — visualization geometry

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Root-Loop | loop svg | viewBox | `0 0 300 172` | `viewBox="0 0 300 172"` — `art.tsx:601` | match |
| Root-Loop | loop svg | width | `100%` | `width="100%" height="100%"` in an `aspectRatio: 300/172` box — `art.tsx:600` | match |
| Root-Loop | loop svg | display / position | `block` / `relative` | `CHART = {position:'absolute', top:0, left:0}` inside the ratio box — `art.tsx:75` | match (same paint order and box) |
| Root-Loop | loop svg | user→px scale | card 345 − 24 padding = 321 wide → 321/300 = 1.07; drawn height 184.04 | identical (aspect-ratio box) | match |
| Root-Loop | loop ellipse | cx / cy | `150 / 86` | `cx={150} cy={86}` — `art.tsx:602` | match |
| Root-Loop | loop ellipse | rx / ry | `104 / 55` | `rx={104} ry={55}` | match |
| Root-Loop | loop ellipse | stroke / width / fill | `#8B8882` / `1.7` / `none` | identical | match |
| Root-Loop | loop ellipse | caps / joins / dash | not stated (butt / miter / solid) | not set → same defaults | match |
| Root-Loop | right arrowhead | `d` / fill | `M249 80 h11 l-5.5 10 z` / `#8B8882` | identical — `art.tsx:603` | match |
| Root-Loop | left arrowhead | `d` / fill | `M40 92 h11 l-5.5 -10 z` / `#8B8882` | identical — `art.tsx:604` | match |
| Root-Loop | label 1 | x / y / anchor | `150 / 36 / middle` | `x={150} y={36}`, `textAnchor:'middle'` — `art.tsx:605, 562` | match |
| Root-Loop | label 1 | font-size / weight / fill | `11.5` / `600` / `#1D1C1A` | `11.5` / `'600'` / `'#1D1C1A'` | match |
| Root-Loop | label 1 | halo (paint-order) | `paint-order:stroke; stroke:#FFFFFF; stroke-width:7px; stroke-linejoin:round` | same text drawn twice: stroked `#FFFFFF` `strokeWidth={7}` `strokeLinejoin="round"`, then filled — `art.tsx:565–570` | match |
| Root-Loop | label 1 | copy | `the loneliness rises` | `stations[0]` = `the {word} rises` — `v3.tsx:1431` | match |
| Root-Loop | label 2 | x / y / size / weight / fill | `254 / 90 / 11 / 400 / #55534E` | identical — `art.tsx:608` | match |
| Root-Loop | label 2 | copy | `the escape` | `stations[1]` | match |
| Root-Loop | label 3 | x / y / size / weight / fill | `150 / 143 / 11 / 400 / #55534E` | identical — `art.tsx:611` | match |
| Root-Loop | label 3 | copy | `minutes of relief` | `stations[2]` | match |
| Root-Loop | label 4 | x / y / size / weight / fill | `46 / 90 / 11 / 400 / #55534E` | identical — `art.tsx:614` | match |
| Root-Loop | label 4 | copy | `back — deeper` | `stations[3]` = `back — deeper` | match |
| Root-Loop | loop svg | font family for `<text>` | inherited `-apple-system…` | `fontFamily: fonts.sans` = `'System'` (iOS) — `art.tsx:562` | match |
| Root-Loop | loop svg | axes / gridlines / ticks | none drawn | none drawn | match |
| Root-Loop | loop svg | clip paths / masks | none | none | match |

## Frame 4 — Current-Pattern (098) · `O3CurrentPattern`

App: `v3.tsx:1199–1210` + `art.tsx:643–665` (`MonthGrid`, `LAST_30`). Chrome: `{ seg: 3, backTop: 42 }`.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Current-Pattern | progress rule | segments inked | 3 of 8 | `seg: 3` — `welcome.tsx:130` | match |
| Current-Pattern | eyebrow | absolute top | `152px` | `top: 98` (152 − 54) — `v3.tsx:487` | match |
| Current-Pattern | eyebrow | left / right / align | `0 / 0 / center` | `left:0, right:0`, `center` prop | match |
| Current-Pattern | eyebrow | font-size / weight | `12.5px / 600` | `fontSize: 12.5`, `sans('600')` | match |
| Current-Pattern | eyebrow | colour | `#8B8882` | `'#8B8882'` | match |
| Current-Pattern | eyebrow | copy | `Your current pattern` | `eyebrow="Your current pattern"` — `v3.tsx:1202` | match |
| Current-Pattern | numeral block | absolute top | `190px` | `top: 136` (190 − 54) — `v3.tsx:488` | match |
| Current-Pattern | numeral | font-size | `56px` | `fontSize: 56` — `v3.tsx:489` | match |
| Current-Pattern | numeral | numeric weight | `600` | `sans('600')` | match |
| Current-Pattern | numeral | letter-spacing | `-1.5px` | `letterSpacing: -1.5` | match |
| Current-Pattern | numeral | line-height | `1` (= 56px) | `lineHeight: 56` | match |
| Current-Pattern | numeral | colour | `#1D1C1A` | `'#1D1C1A'` | match |
| Current-Pattern | numeral | font-variant-numeric | `tabular-nums` | `fontVariant: ['tabular-nums']` | match |
| Current-Pattern | numeral | value | `9` | `marks(LAST_30) = 9` (verified by count) — `v3.tsx:1202` | match |
| Current-Pattern | numeral | entry state | static | eased count-up, cubic-out, 1500 ms — `v3.tsx:1453–1467` | deviation (N-6) |
| Current-Pattern | unit line | margin-top | `10px` | `marginTop: 10` — `v3.tsx:492` | match |
| Current-Pattern | unit line | font-size / weight / colour | `12.5px / 600 / #8B8882` | identical | match |
| Current-Pattern | unit line | copy | `times in the last 30 days` | identical | match |
| Current-Pattern | card | absolute top | `300px` | `top: 246` (300 − 54) — `v3.tsx:1203` | match |
| Current-Pattern | card | left / right | `24px / 24px` | `left: 24, right: 24` — `v3.tsx:505` | match |
| Current-Pattern | card | height | `232px` | `height={232}` | match |
| Current-Pattern | card | border-radius | `20px` | `borderRadius: 20` | match |
| Current-Pattern | card | corner style | circular | `borderCurve:'continuous'` | deviation (N-4) |
| Current-Pattern | card | background / shadow | `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.09)` | identical — `v3.tsx:510–511` | match |
| Current-Pattern | card | padding | `0 18px` | `paddingHorizontal: 18` | match |
| Current-Pattern | card | flex-direction / align / justify | `column / center / center` | RN default column, `alignItems:'center', justifyContent:'center'` | match |
| Current-Pattern | card | gap | not stated | `gap` undefined | match |
| Current-Pattern | grid | width | `100%` | `width:'100%'` — `art.tsx:645` | match |
| Current-Pattern | grid | columns | `repeat(7, 1fr)` | 7 `flex:1` cells per row — `art.tsx:647–658` | match |
| Current-Pattern | grid | gap | `6px` (both axes) | `gap: 6` on the column and each row | match |
| Current-Pattern | grid cell | height | `27px` | `height: 27` | match |
| Current-Pattern | grid cell | border-radius | `7px` | `borderRadius: 7` | match |
| Current-Pattern | grid cell (marked) | background | `#131313` | `CELL_DARK = '#131313'` — `art.tsx:633` | match |
| Current-Pattern | grid cell (unmarked) | background | `#F1F0EB` | `CELL_LIGHT = '#F1F0EB'` — `art.tsx:634` | match |
| Current-Pattern | grid cell (unmarked) | inset shadow | `inset 0 0 0 1px rgba(0,0,0,0.06)` | `boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)'` — `art.tsx:656` | match |
| Current-Pattern | grid cell (marked) | inset shadow | none | none | match |
| Current-Pattern | grid | cell count | 30 | 30 (`LAST_30.length`) | match |
| Current-Pattern | grid | data string (parsed cell-by-cell from the raw frame) | `011000100001110000100001000100` | `LAST_30 = '011000100001110000100001000100'` — `art.tsx:626` | match (byte-equal, 9 marks) |
| Current-Pattern | caption | absolute top | `552px` | `top: 498` (552 − 54) — `v3.tsx:1206` | match |
| Current-Pattern | caption | left / right / size / weight / lh / colour | `44 / 44 / 14px / 400 / 21px / #55534E` | `44 / 44 / 14 / sans('400') / 21 / '#55534E'` | match |
| Current-Pattern | caption | copy | `This is where the projection begins.` | identical | match |
| Current-Pattern | CTA pill | top / height / radius | `744px / 58px / 29px` | `bottom: 50`, `58`, `29` — `v3.tsx:1207` | match |
| Current-Pattern | CTA label | copy / tracking | `Next` / `0.2px` | `Next` / `0.2` | match |

## Frame 5 — Cost-Next-30 (099) · `O3CostPage h={1}`

App: `v3.tsx:1513–1523` + `art.tsx:643–665`, `NEXT_30`. Chrome: `{ seg: 3, backTop: 42 }`.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Cost-Next-30 | progress rule | segments inked | 3 of 8 | `seg: 3` — `welcome.tsx:131` | match |
| Cost-Next-30 | eyebrow | top / left / right / align | `152px / 0 / 0 / center` | `top: 98`, `0 / 0`, centered | match |
| Cost-Next-30 | eyebrow | size / weight / colour | `12.5px / 600 / #8B8882` | identical | match |
| Cost-Next-30 | eyebrow | copy | `If nothing changes` | `eyebrow="If nothing changes"` — `v3.tsx:1515` | match |
| Cost-Next-30 | numeral | top / size / weight / tracking / lh / colour / variant | `190px / 56px / 600 / -1.5px / 1 / #1D1C1A / tabular-nums` | `136 / 56 / '600' / -1.5 / 56 / '#1D1C1A' / tabular-nums` | match |
| Cost-Next-30 | numeral | value | `9` | `marks(NEXT_30) = 9` | match |
| Cost-Next-30 | unit line | margin-top / size / weight / colour | `10px / 12.5px / 600 / #8B8882` | identical | match |
| Cost-Next-30 | unit line | copy | `times in the next 30 days` | identical | match |
| Cost-Next-30 | card | top / left / right | `300px / 24px / 24px` | `top: 246`, `24 / 24` — `v3.tsx:1516` | match |
| Cost-Next-30 | card | height | `248px` | `height={248}` | match |
| Cost-Next-30 | card | radius / background / shadow / padding | `20px / #FFFFFF / 0 0 0 1px rgba(0,0,0,0.09) / 0 18px` | identical | match |
| Cost-Next-30 | card | gap | `14px` | `gap={14}` | match |
| Cost-Next-30 | card | align / justify | `center / center` | identical | match |
| Cost-Next-30 | grid | columns / gap / cell height / radius | `repeat(7,1fr) / 6px / 27px / 7px` | identical | match |
| Cost-Next-30 | grid | marked / unmarked fills | `#131313` / `#F1F0EB` + `inset 0 0 0 1px rgba(0,0,0,0.06)` | identical | match |
| Cost-Next-30 | grid | cell count | 30 | 30 | match |
| Cost-Next-30 | grid | data string | `001001000100100010010001001001` | `NEXT_30 = '001001000100100010010001001001'` — `art.tsx:628` | match (byte-equal, 9 marks) |
| Cost-Next-30 | card note | font-size / weight / colour | `11.5px / 500 / #B0AEA8` | `fontSize: 11.5`, `sans('500')`, `'#B0AEA8'` — `v3.tsx:524` | match |
| Cost-Next-30 | card note | copy | `Based on your last 30 days` | identical — `v3.tsx:1518` | match |
| Cost-Next-30 | caption | top / insets / size / weight / lh / colour | `552px / 44 / 14px / 400 / 21px / #55534E` | `498 / 44 / 14 / '400' / 21 / '#55534E'` | match |
| Cost-Next-30 | caption | copy | `At your current pace, the next month may look much like the last.` | identical | match |
| Cost-Next-30 | CTA pill | top / height / radius / background | `744px / 58px / 29px / #131313` | `bottom: 50 / 58 / 29 / '#131313'` | match |
| Cost-Next-30 | CTA label | copy / size / weight / tracking / colour | `Next / 17px / 600 / 0.2px / #FFFFFF` | identical | match |

## Frame 6 — Cost-Next-365 (100) · `O3CostPage h={2}`

App: `v3.tsx:1500–1511` + `art.tsx:686–716` (`YearGrid`), `NEXT_365`. Chrome: `{ seg: 4, backTop: 42 }`.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Cost-Next-365 | progress rule | segments inked | 4 of 8 | `seg: 4` — `welcome.tsx:132` | match |
| Cost-Next-365 | eyebrow | top / size / weight / colour / copy | `152px / 12.5px / 600 / #8B8882 / If nothing changes` | `98` + identical — `v3.tsx:1503` | match |
| Cost-Next-365 | numeral | top / size / weight / tracking / lh / colour / variant | `190px / 56px / 600 / -1.5px / 1 / #1D1C1A / tabular-nums` | `136` + identical | match |
| Cost-Next-365 | numeral | value | `110` | `marks(NEXT_365) = 110` (counted) | match |
| Cost-Next-365 | numeral | thousands format | n/a at 110 | `toLocaleString('en-US')` — `v3.tsx:490` | match |
| Cost-Next-365 | unit line | copy | `times in the next 365 days` | identical | match |
| Cost-Next-365 | card | top / left / right | `300px / 24px / 24px` | `top: 246`, `24 / 24` — `v3.tsx:1504` | match |
| Cost-Next-365 | card | height | `242px` | `height={242}` | match |
| Cost-Next-365 | card | gap | `12px` | `gap={12}` | match |
| Cost-Next-365 | card | radius / background / shadow / padding / align / justify | `20px / #FFFFFF / 0 0 0 1px rgba(0,0,0,0.09) / 0 18px / center / center` | identical | match |
| Cost-Next-365 | card note | size / weight / colour | `11.5px / 500 / #B0AEA8` | identical | match |
| Cost-Next-365 | card note | copy | `Projection based on your current pace` | identical — `v3.tsx:1506` | match |
| Cost-Next-365 | caption | top / insets / size / weight / lh / colour | `552px / 44 / 14px / 400 / 21px / #55534E` | `498 / 44 / 14 / '400' / 21 / '#55534E'` | match |
| Cost-Next-365 | caption | copy | `A repeated night slowly becomes a year-long pattern.` | identical | match |
| Cost-Next-365 | CTA pill | top / height / radius / label / tracking | `744px / 58px / 29px / Next / 0.2px` | `bottom: 50 / 58 / 29 / Next / 0.2` | match |

### Cost-Next-365 — visualization geometry (year grid)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Cost-Next-365 | year grid | width | `100%` | `width:'100%'` — `art.tsx:693` | match |
| Cost-Next-365 | year grid | columns | `repeat(26, 1fr)` | 26 `flex:1` cells per row, `rows(days, 26)` — `art.tsx:694–695` | match |
| Cost-Next-365 | year grid | gap | `2.5px` (both axes) | `gap: 2.5` on the column and each row | match |
| Cost-Next-365 | year grid | cell aspect | `aspect-ratio: 1` | `aspectRatio: 1` — `art.tsx:709` | match |
| Cost-Next-365 | year grid | cell border-radius | `2.5px` | `borderRadius: 2.5` | match |
| Cost-Next-365 | year grid | marked fill | `#131313` | `CELL_DARK` | match |
| Cost-Next-365 | year grid | unmarked fill | `#F1F0EB` | `CELL_LIGHT` | match |
| Cost-Next-365 | year grid | unmarked inset ring | none (unlike the 7-column grid) | none | match |
| Cost-Next-365 | year grid | cell count | 365 | 365 (`NEXT_365.length`) | match |
| Cost-Next-365 | year grid | row count / last row | 15 (14 × 26 + 1) | `rows()` yields 15, last row padded with 1 flex spacer — `art.tsx:711` | match |
| Cost-Next-365 | year grid | data string | 365 chars, 110 marks (parsed cell-by-cell) | `NEXT_365` — `art.tsx:630–631` | match (byte-equal) |
| Cost-Next-365 | year grid | axes / ticks / gridlines | none | none | match |
| Cost-Next-365 | year grid | domain→pixel mapping | 26 equal columns across the card's inner width (345 − 36 = 309 → cell ≈ 11.4pt) | same, computed by flex | match |
| Cost-Next-365 | year grid | clip paths / masks | none | none | match |

## Frame 7 — Cost-By-Age-80 (101) · `O3CostPage h={3}`

App: `v3.tsx:1488–1499` + `art.tsx:723–739` (`ByAge80Card`). Chrome: `{ seg: 4, backTop: 42 }`.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Cost-By-Age-80 | progress rule | segments inked | 4 of 8 | `seg: 4` — `welcome.tsx:133` | match |
| Cost-By-Age-80 | eyebrow | top / size / weight / colour / copy | `152px / 12.5px / 600 / #8B8882 / If nothing changes` | `98` + identical — `v3.tsx:1491` | match |
| Cost-By-Age-80 | numeral | top / size / weight / tracking / lh / colour / variant | `190px / 56px / 600 / -1.5px / 1 / #1D1C1A / tabular-nums` | `136` + identical | match |
| Cost-By-Age-80 | numeral | value | `6,132` | `Math.round(365 · (9/30) · (80 − 24)) = 6132`, rendered `toLocaleString('en-US')` → `6,132` — `v3.tsx:1486, 1491` | match |
| Cost-By-Age-80 | unit line | copy | `more times by age 80` | `more times by age ${AGE_END}` with `AGE_END = 80` — `v3.tsx:1479` | match |
| Cost-By-Age-80 | card | top / left / right | `300px / 24px / 24px` | wrapper `top: 246, left: 24, right: 24` — `v3.tsx:1492` | match |
| Cost-By-Age-80 | card | height | `268px` | `height: 268` — `art.tsx:726` | match |
| Cost-By-Age-80 | card | border-radius / background / shadow | `20px / #FFFFFF / 0 0 0 1px rgba(0,0,0,0.09)` | `CARD` — `art.tsx:66` | match |
| Cost-By-Age-80 | card | padding | none | none | match |
| Cost-By-Age-80 | top age label | left / top | `18px / 13px` | `left: 18, top: 13` — `art.tsx:727` | match |
| Cost-By-Age-80 | top age label | size / weight / colour | `10.5px / 600 / #8B8882` | identical | match |
| Cost-By-Age-80 | top age label | copy | `24` | `{from}` = typed age else `AGE_DEFAULT = 24` — `v3.tsx:1480, 1484` | match |
| Cost-By-Age-80 | bottom age label | left / bottom | `18px / 34px` | `left: 18, bottom: 34` — `art.tsx:728` | match |
| Cost-By-Age-80 | bottom age label | size / weight / colour / copy | `10.5px / 600 / #8B8882 / 80` | identical | match |
| Cost-By-Age-80 | hairline stack | left / right | `44px / 18px` | `left: 44, right: 18` — `art.tsx:729` | match |
| Cost-By-Age-80 | hairline stack | top / bottom | `16px / 38px` | `top: 16, bottom: 38` | match |
| Cost-By-Age-80 | hairline stack | flex-direction | `column` | RN default column | match |
| Cost-By-Age-80 | hairline stack | justify-content | `space-between` | `justifyContent:'space-between'` | match |
| Cost-By-Age-80 | hairline | height | `2.2px` | `height: 2.2` — `art.tsx:731` | match |
| Cost-By-Age-80 | hairline | border-radius | `1px` | `borderRadius: 1` | match |
| Cost-By-Age-80 | hairline | background | `#131313` | `'#131313'` | match |
| Cost-By-Age-80 | hairline | opacity | `0.78` | `opacity: 0.78` | match |
| Cost-By-Age-80 | hairline | count | 56 (counted in the raw frame) | `Math.max(1, 80 − 24) = 56` — `art.tsx:724` | match |
| Cost-By-Age-80 | card footnote | bottom / align | `11px / center` | `bottom: 11`, `center` prop — `art.tsx:734` | match |
| Cost-By-Age-80 | card footnote | left / right | `0 / 0` | `left: 0, right: 0` | match |
| Cost-By-Age-80 | card footnote | size / weight / colour | `11.5px / 500 / #B0AEA8` | identical | match |
| Cost-By-Age-80 | card footnote | copy | `Based on your current pace — not a fixed outcome` | identical, em dash — `art.tsx:735` | match |
| Cost-By-Age-80 | caption | absolute top | `580px` | `top: 526` (580 − 54) — `v3.tsx:1495` | match |
| Cost-By-Age-80 | caption | insets / size / weight / lh / colour | `44 / 14px / 400 / 21px / #55534E` | `44 / 14 / '400' / 21 / '#55534E'` | match |
| Cost-By-Age-80 | caption | copy | `Small patterns repeated over decades become part of a life.` | identical | match |
| Cost-By-Age-80 | CTA pill | top / height / radius / label / tracking | `744px / 58px / 29px / Next / 0.2px` | `bottom: 50 / 58 / 29 / Next / 0.2` | match |

### Cost-By-Age-80 — visualization geometry (decade stack)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Cost-By-Age-80 | decade stack | data domain | ages 24 → 80, one row per year | `from` → 80, `years = 80 − from` | match |
| Cost-By-Age-80 | decade stack | domain→pixel mapping | 56 rows of 2.2px distributed `space-between` in a 268 − 16 − 38 = 214px column → 2.2 ink + 1.6945… gap | identical (same box, same flexbox rule) | match |
| Cost-By-Age-80 | decade stack | axis range labels | `24` at top, `80` at bottom, x = 18 | identical | match |
| Cost-By-Age-80 | decade stack | tick format | bare integers, no per-bar labels | identical | match |
| Cost-By-Age-80 | decade stack | gridlines | none | none | match |
| Cost-By-Age-80 | decade stack | stroke / caps / joins / dash | n/a (filled rects) | n/a | match |
| Cost-By-Age-80 | decade stack | fill gradients | none (flat `#131313` @ 0.78) | none | match |
| Cost-By-Age-80 | decade stack | clip paths / masks | none | none | match |

## Frame 8 — Hopeful-Reversal (102) · `O3Reversal`

App: `v3.tsx:1217–1243` + `art.tsx:668–716` (`YearGrid clearing`, `REVERSAL_CLEARED`). Chrome: `{ seg: 4, backTop: 42 }`.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Hopeful-Reversal | progress rule | segments inked | 4 of 8 | `seg: 4` — `welcome.tsx:134` | match |
| Hopeful-Reversal | headline | absolute top | `148px` | `top: 94` (148 − 54) — `v3.tsx:1225` | match |
| Hopeful-Reversal | headline | left / right | `0 / 0` | `left: 0, right: 0` | match |
| Hopeful-Reversal | headline | text-align | `center` | `center` prop | match |
| Hopeful-Reversal | headline | font-size | `26px` | `fontSize: 26` | match |
| Hopeful-Reversal | headline | numeric weight | `500` | `sans('500')` | match |
| Hopeful-Reversal | headline | letter-spacing | `-0.2px` | `letterSpacing: -0.2` | match |
| Hopeful-Reversal | headline | line-height | not stated (normal) | none set → `AppText` drops the inherited leading (`AppText.tsx:120`) | match |
| Hopeful-Reversal | headline | colour | `#1D1C1A` | `'#1D1C1A'` | match |
| Hopeful-Reversal | headline | copy | `But this can change.` | identical | match |
| Hopeful-Reversal | sub-line | absolute top | `194px` | `top: 140` (194 − 54) — `v3.tsx:1228` | match |
| Hopeful-Reversal | sub-line | left / right | `44px / 44px` | `left: 44, right: 44` | match |
| Hopeful-Reversal | sub-line | font-size | `14.5px` | `fontSize: 14.5` | match |
| Hopeful-Reversal | sub-line | numeric weight | `400` | `sans('400')` | match |
| Hopeful-Reversal | sub-line | line-height | `21px` | `lineHeight: 21` | match |
| Hopeful-Reversal | sub-line | colour | `#55534E` | `'#55534E'` | match |
| Hopeful-Reversal | sub-line | copy | `This is a projection of your current pattern. It is not your future.` | identical | match |
| Hopeful-Reversal | card | absolute top | `266px` | `top: 212` (266 − 54) — `v3.tsx:1231` | match |
| Hopeful-Reversal | card | left / right | `24px / 24px` | `24 / 24` | match |
| Hopeful-Reversal | card | height | `240px` | `height={240}` | match |
| Hopeful-Reversal | card | radius / background / shadow / padding | `20px / #FFFFFF / 0 0 0 1px rgba(0,0,0,0.09) / 0 18px` | identical | match |
| Hopeful-Reversal | card | gap | not stated | `gap` undefined (no card note on this frame) | match |
| Hopeful-Reversal | caption | absolute top | `534px` | `top: 480` (534 − 54) — `v3.tsx:1234` | match |
| Hopeful-Reversal | caption | left / right | `44px / 44px` | `left: 44, right: 44` | match |
| Hopeful-Reversal | caption | size / weight / lh / colour | `14px / 400 / 21px / #55534E` | `14 / '400' / 21 / '#55534E'` — `v3.tsx:1235` | match |
| Hopeful-Reversal | caption | initial opacity | `0` | `Animated.Value(0)` — `v3.tsx:1219` | match |
| Hopeful-Reversal | caption | animation duration / easing / fill | `0.9s ease forwards` | `duration: 900, Easing.out(Easing.ease)`, holds at 1 — `v3.tsx:1221` | match |
| Hopeful-Reversal | caption | animation delay | `5s` | `REVERSAL_CAPTION_DELAY_MS = 5000` — `art.tsx:677` | match |
| Hopeful-Reversal | caption | copy | `Every time you interrupt the pattern, you change the shape of the year.` | identical | match |
| Hopeful-Reversal | CTA pill | top / height / radius / background | `744px / 58px / 29px / #131313` | `bottom: 50 / 58 / 29 / '#131313'` — `v3.tsx:1239` | match |
| Hopeful-Reversal | CTA label | copy / size / weight / tracking / colour | `Change the pattern / 17px / 600 / 0.2px / #FFFFFF` | identical | match |
| Hopeful-Reversal | ghost link | absolute top | `812px` | `bottom: 852 − 812 − 18 = 22` — `v3.tsx:1240` | match |
| Hopeful-Reversal | ghost link | left / right / align | `0 / 0 / center` | `0 / 0`, `alignItems:'center'` | match |
| Hopeful-Reversal | ghost link | size / weight / colour | `15px / 500 / #8B8882` | identical — `v3.tsx:459` | match |
| Hopeful-Reversal | ghost link | copy | `Review my projection` | identical | match |

### Hopeful-Reversal — visualization geometry (clearing year grid)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Hopeful-Reversal | year grid | columns / gap / aspect / radius | `repeat(26,1fr) / 2.5px / 1 / 2.5px` | identical — `art.tsx:693–709` | match |
| Hopeful-Reversal | year grid | cell count / data string | 365 cells, identical to Cost-Next-365 (110 marks) | `NEXT_365` | match (byte-equal) |
| Hopeful-Reversal | year grid | marked / unmarked fills | `#131313` / `#F1F0EB` | `CELL_DARK` / `CELL_LIGHT` | match |
| Hopeful-Reversal | clearing set | number of animated cells | 47 | `REVERSAL_CLEARED.length = 47` — `art.tsx:668–674` | match |
| Hopeful-Reversal | clearing set | cell indices | `2, 36, 81, 88, 98, 99, 104, 105, 106, 107, 118, 119, 120, 154, 169, 190, 196, 213, 226, 234, 235, 236, 249, 256, 259, 261, 274, 275, 276, 277, 279, 280, 293, 295, 296, 300, 301, 302, 305, 306, 307, 310, 311, 312, 328, 333, 342` | identical list | match (index-for-index) |
| Hopeful-Reversal | clearing set | per-cell delays (s) | `4.62, 2.39, 3.17, 3.95, 1.31, 1.85, 3.97, 1.4, 2.43, 4.15, 4.35, 3.73, 4.0, 3.38, 1.46, 2.62, 1.33, 4.15, 1.79, 1.27, 3.74, 1.79, 1.83, 1.72, 2.57, 3.45, 1.22, 1.33, 3.07, 3.89, 1.54, 2.71, 3.51, 4.36, 3.72, 4.7, 3.87, 3.29, 1.44, 2.28, 1.9, 2.14, 2.73, 2.87, 1.58, 4.3, 2.62` | identical list | match (value-for-value) |
| Hopeful-Reversal | clearing set | per-cell duration | `0.9s` | `REVERSAL_CLEAR_MS = 900` — `art.tsx:676` | match |
| Hopeful-Reversal | clearing set | easing | `ease` | `Easing.linear` driver + per-cell colour interpolation over the 900 ms window, `extrapolate:'clamp'` — `art.tsx:690, 704–708` | deviation (N-7) |
| Hopeful-Reversal | clearing set | target colour | `#F1F0EB` (`vici-clear` keyframe) | `outputRange: [CELL_DARK, CELL_LIGHT]` — `art.tsx:706` | match |
| Hopeful-Reversal | clearing set | timeline span | max delay 4.7 + 0.9 = 5.6 s | `REVERSAL_SPAN_MS = 5600` — `art.tsx:678` | match |
| Hopeful-Reversal | year grid | axes / ticks / gridlines / clips | none | none | match |

## Frame 9 — Streak-Sawtooth (103) · `O3Streaks`

App: `v3.tsx:1315–1326` + `art.tsx:748–787` (`SAWTOOTH`, `StreakSawtoothCard`). Chrome: `{ seg: 5, backTop: 42 }`.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Streak-Sawtooth | progress rule | segments inked | 5 of 8 | `seg: 5` — `welcome.tsx:135` | match |
| Streak-Sawtooth | headline | absolute top | `170px` | `top: 116` (170 − 54) — `v3.tsx:1318` | match |
| Streak-Sawtooth | headline | left / right | `40px / 40px` | `inset={40}` | match |
| Streak-Sawtooth | headline | size / weight / lh / tracking / colour / align | `24px / 500 / 32px / -0.2px / #1D1C1A / center` | identical (`O3PaperH`) — `v3.tsx:467` | match |
| Streak-Sawtooth | headline | text-wrap | `balance` | no RN equivalent | match (platform gap) |
| Streak-Sawtooth | headline | copy | `Streaks reset.` | identical | match |
| Streak-Sawtooth | card | absolute top | `264px` | `top: 210` (264 − 54) — `v3.tsx:1319` | match |
| Streak-Sawtooth | card | left / right | `24px / 24px` | `24 / 24` | match |
| Streak-Sawtooth | card | height | content-driven (20 + 185.94 + 16 = 221.94) | content-driven, same arithmetic (`aspectRatio: 320/190`) — `art.tsx:763` | match |
| Streak-Sawtooth | card | radius / background / shadow | `20px / #FFFFFF / 0 0 0 1px rgba(0,0,0,0.09)` | `CARD` | match |
| Streak-Sawtooth | card | padding top / x / bottom | `20px / 16px / 16px` | `paddingTop:20, paddingHorizontal:16, paddingBottom:16` — `art.tsx:761` | match |
| Streak-Sawtooth | card | overflow | `hidden` | `overflow:'hidden'` | match |
| Streak-Sawtooth | card noise | opacity / pointer-events | `0.05 / none` | `<Noise opacity={0.05} radius={20} />` — `art.tsx:762` | match |
| Streak-Sawtooth | card noise | z-order vs the chart | noise is `position:absolute`, the `<svg>` is `display:block` (non-positioned) → CSS paints the noise **above** the chart | `<Noise/>` declared first, chart wrapper second → Yoga paints the chart **above** the noise — `art.tsx:762–763` | **MISMATCH** |
| Streak-Sawtooth | caption | absolute top | `510px` | `top: 456` (510 − 54) — `v3.tsx:1322` | match |
| Streak-Sawtooth | caption | left / right | `52px / 52px` | `inset={52}` | match |
| Streak-Sawtooth | caption | size / weight / lh / colour / align | `14px / 400 / 21px / #55534E / center` | identical | match |
| Streak-Sawtooth | caption | copy | `Fourteen days, then nine, then five — every reset lands on zero.` | identical, em dash | match |
| Streak-Sawtooth | CTA pill | top / height / radius / label / tracking | `744px / 58px / 29px / Next / 0.2px` | `bottom: 50 / 58 / 29 / Next / 0.2` — `v3.tsx:1323` | match |

### Streak-Sawtooth — visualization geometry

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Streak-Sawtooth | chart svg | viewBox | `0 0 320 190` | `viewBox="0 0 320 190"` — `art.tsx:764` | match |
| Streak-Sawtooth | chart svg | width / height | `100%` / intrinsic (aspect 320:190) | `width="100%" height="100%"` in an `aspectRatio: 320/190` box — `art.tsx:763` | match |
| Streak-Sawtooth | chart svg | display / overflow | `block` / `visible` | `CHART` absolute inside the ratio box; card clips at radius 20 | match (no geometry leaves the viewBox) |
| Streak-Sawtooth | chart svg | user→px scale | (345 − 32)/320 = 0.978125 → drawn height 185.84 | identical | match |
| Streak-Sawtooth | baseline | x1 / y1 / x2 / y2 | `16 / 152 / 304 / 152` | `x1={16} y1={152} x2={304} y2={152}` — `art.tsx:765` | match |
| Streak-Sawtooth | baseline | stroke colour / width | `rgba(19,19,19,0.16)` / `1.5` | identical | match |
| Streak-Sawtooth | baseline | dash / caps | none / butt | none set | match |
| Streak-Sawtooth | climb 1 | `d` | `M22,152 L116,44` | `M${22},152 L${116},${44}` — `art.tsx:767` | match |
| Streak-Sawtooth | climb 2 | `d` | `M130,152 L198,74` | `M130,152 L198,74` | match |
| Streak-Sawtooth | climb 3 | `d` | `M212,152 L262,98` | `M212,152 L262,98` | match |
| Streak-Sawtooth | climbs | stroke / width / fill / cap | `#131313` / `3` / `none` / `round` | identical | match |
| Streak-Sawtooth | drop line 1 | x1,y1 → x2,y2 | `116,44 → 116,146` | `x1={116} y1={44} x2={116} y2={146}` — `art.tsx:770` | match |
| Streak-Sawtooth | drop line 2 | x1,y1 → x2,y2 | `198,74 → 198,146` | identical | match |
| Streak-Sawtooth | drop line 3 | x1,y1 → x2,y2 | `262,98 → 262,146` | identical | match |
| Streak-Sawtooth | drop lines | stroke / width / dash array | `rgba(19,19,19,0.25)` / `2` / `3 6` | identical | match |
| Streak-Sawtooth | peak dots | cx / cy | `116,44` · `198,74` · `262,98` | identical — `art.tsx:773` | match |
| Streak-Sawtooth | peak dots | r / fill | `4` / `#131313` | `r={4}` / `#131313` | match |
| Streak-Sawtooth | peak label 1 | x / y / anchor | `116 / 30 / middle` | `x={116} y={30}`, `textAnchor="middle"` — `art.tsx:776` | match |
| Streak-Sawtooth | peak label 1 | size / weight / fill / copy | `13 / 600 / #1D1C1A / 14 days` | identical — `art.tsx:749` | match |
| Streak-Sawtooth | peak label 2 | x / y / size / weight / fill / copy | `198 / 62 / 13 / 600 / #55534E / 9 days` | identical — `art.tsx:750` | match |
| Streak-Sawtooth | peak label 3 | x / y / size / weight / fill / copy | `262 / 86 / 13 / 600 / #8B8882 / 5 days` | identical — `art.tsx:751` | match |
| Streak-Sawtooth | peak labels | font family | inherited `-apple-system…` | `fontFamily: fonts.sans` = `'System'` | match |
| Streak-Sawtooth | cross 1 | `d` | `M110 152 l12 12 M122 152 l-12 12` | `M${116−6} 152 l12 12 M${116+6} 152 l-12 12` — `art.tsx:781` | match |
| Streak-Sawtooth | cross 2 | `d` | `M192 152 l12 12 M204 152 l-12 12` | same formula at x = 198 | match |
| Streak-Sawtooth | cross 3 | `d` | `M256 152 l12 12 M268 152 l-12 12` | same formula at x = 262 | match |
| Streak-Sawtooth | crosses | stroke / width / cap | `#B0AEA8` / `2.6` / `round` | identical | match |
| Streak-Sawtooth | chart | paint order | baseline, climb1, drop1, climb2, drop2, climb3, drop3, dots, labels, crosses | baseline, all climbs, all drops, all dots, all labels, all crosses — `art.tsx:765–782` | match (no drop line overlaps another climb's x-range, so the raster is identical) |
| Streak-Sawtooth | chart | axes / ticks / gridlines | none beyond the baseline | none | match |
| Streak-Sawtooth | chart | fills / gradients / clips / masks | none | none | match |

## Frame 10 — Campaign-Line (104) · `O3CampaignLine`

App: `v3.tsx:1329–1340` + `art.tsx:793–820` (`CampaignLineCard`). Chrome: `{ seg: 5, backTop: 42 }`.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Campaign-Line | progress rule | segments inked | 5 of 8 | `seg: 5` — `welcome.tsx:136` | match |
| Campaign-Line | headline | top / insets | `170px / 40px` | `top: 116`, `inset={40}` — `v3.tsx:1332` | match |
| Campaign-Line | headline | size / weight / lh / tracking / colour / align | `24px / 500 / 32px / -0.2px / #1D1C1A / center` | identical (`O3PaperH`) | match |
| Campaign-Line | headline | copy | `Campaigns don’t.` (`&rsquo;`) | `Campaigns don’t.` (U+2019) | match |
| Campaign-Line | card | top / left / right | `264px / 24px / 24px` | `top: 210`, `24 / 24` — `v3.tsx:1333` | match |
| Campaign-Line | card | radius / background / shadow | `20px / #FFFFFF / 0 0 0 1px rgba(0,0,0,0.09)` | `CARD` | match |
| Campaign-Line | card | padding top / x / bottom | `20px / 16px / 16px` | identical — `art.tsx:795` | match |
| Campaign-Line | card | overflow / noise | `hidden` / `0.05` | identical — `art.tsx:795–796` | match |
| Campaign-Line | card noise | z-order vs the chart | absolute noise above a non-positioned `<svg>` | chart painted above the noise — `art.tsx:796–797` | **MISMATCH** |
| Campaign-Line | caption | top / insets | `510px / 52px` | `top: 456`, `inset={52}` — `v3.tsx:1336` | match |
| Campaign-Line | caption | size / weight / lh / colour | `14px / 400 / 21px / #55534E` | identical | match |
| Campaign-Line | caption | copy | `A slip costs a day, not the campaign — it never returns to zero.` | identical, em dash | match |
| Campaign-Line | CTA pill | top / height / radius / label / tracking | `744px / 58px / 29px / Next / 0.2px` | `bottom: 50 / 58 / 29 / Next / 0.2` | match |

### Campaign-Line — visualization geometry

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Campaign-Line | chart svg | viewBox | `0 0 320 190` | identical — `art.tsx:798` | match |
| Campaign-Line | chart svg | width / aspect | `100%` / 320:190 | `aspectRatio: 320/190` — `art.tsx:797` | match |
| Campaign-Line | chart svg | user→px scale | 313/320 = 0.978125 → drawn height 185.84 | identical | match |
| Campaign-Line | baseline | x1,y1 → x2,y2 | `16,152 → 304,152` | identical — `art.tsx:799` | match |
| Campaign-Line | baseline | stroke / width | `rgba(19,19,19,0.16)` / `1.5` | identical | match |
| Campaign-Line | origin dot | cx / cy / r / fill | `24 / 148 / 4.5 / #131313` | identical — `art.tsx:800` | match |
| Campaign-Line | campaign curve | `d` | `M24,148 C100,136 180,92 288,34` | identical — `art.tsx:801` | match |
| Campaign-Line | campaign curve | stroke / width / fill / cap | `#131313` / `3` / `none` / `round` | identical | match |
| Campaign-Line | campaign curve | join / dash | not stated / solid | not set | match |
| Campaign-Line | arrowhead | `d` | `M288,34 l-10.5,-1 M288,34 l-4,9.5` | identical — `art.tsx:802` | match |
| Campaign-Line | arrowhead | stroke / width / cap | `#131313` / `3` / `round` | identical | match |
| Campaign-Line | slip ticks | `d` | `M118,116 l8 8 M212,74 l8 8` | identical — `art.tsx:803` | match |
| Campaign-Line | slip ticks | stroke / width / cap | `#E2BA78` / `3.6` / `round` | identical | match |
| Campaign-Line | slip label 1 | x / y / size / weight / fill / anchor | `122 / 140 / 11 / 500 / #C99F5F / start` | identical, no `textAnchor` — `art.tsx:804` | match |
| Campaign-Line | slip label 2 | x / y / size / weight / fill | `216 / 98 / 11 / 500 / #C99F5F` | identical — `art.tsx:807` | match |
| Campaign-Line | slip labels | copy | `slip` | `slip` | match |
| Campaign-Line | axis label left | x / y / size / weight / fill / copy | `24 / 170 / 10.5 / 500 / #8B8882 / day 0` | identical — `art.tsx:810` | match |
| Campaign-Line | axis label right | x / y / size / weight / fill / anchor | `304 / 170 / 10.5 / 500 / #8B8882 / end` | identical — `art.tsx:813` | match |
| Campaign-Line | axis label right | copy | `today · day 41` (`&middot;`) | `today · day 41` | match |
| Campaign-Line | chart | tick positions / format | two text anchors only (`day 0`, `today · day 41`); no tick marks | identical | match |
| Campaign-Line | chart | gridlines | none beyond the baseline | none | match |
| Campaign-Line | chart | fill gradients / clips / masks | none | none | match |

## Frame 11 — Rewire-Curve (105) · `O3Rewire`

App: `v3.tsx:1645–1660` + `art.tsx:825–858` (`REWIRE_BARS`, `RewireCurveCard`). Chrome: `{ seg: 6, backTop: 42 }`.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Rewire-Curve | progress rule | segments inked | 6 of 8 | `seg: 6` — `welcome.tsx:137` | match |
| Rewire-Curve | headline | top / insets | `170px / 40px` | `top: 116`, `inset={40}` — `v3.tsx:1650` | match |
| Rewire-Curve | headline | size / weight / lh / tracking / colour / align | `24px / 500 / 32px / -0.2px / #1D1C1A / center` | identical (`O3PaperH`) | match |
| Rewire-Curve | headline | copy | `Sam, your brain can rewire.` | `` `${name}, your brain can rewire.` `` (falls back to `Your brain can rewire.`) — `v3.tsx:1650` | match |
| Rewire-Curve | card | absolute top | `250px` | `top: 196` (250 − 54) — `v3.tsx:1651` | match |
| Rewire-Curve | card | left / right | `24px / 24px` | `24 / 24` | match |
| Rewire-Curve | card | height | content-driven (20 + 177.37 + 10 = 207.37) | content-driven, `aspectRatio: 300/170` — `art.tsx:839` | match |
| Rewire-Curve | card | radius / background / shadow | `20px / #FFFFFF / 0 0 0 1px rgba(0,0,0,0.09)` | `CARD` | match |
| Rewire-Curve | card | padding top / x / bottom | `20px / 16px / 10px` | `paddingTop:20, paddingHorizontal:16, paddingBottom:10` — `art.tsx:837` | match |
| Rewire-Curve | card | overflow / noise | `hidden` / `0.05` | identical — `art.tsx:837–838` | match |
| Rewire-Curve | card noise | z-order vs the chart | absolute noise above a non-positioned `<svg>` | chart painted above the noise — `art.tsx:838–839` | **MISMATCH** |
| Rewire-Curve | caption | absolute top | `494px` | `top: 440` (494 − 54) — `v3.tsx:1654` | match |
| Rewire-Curve | caption | left / right | `44px / 44px` | `inset` default `44` | match |
| Rewire-Curve | caption | size / weight / lh / colour / align | `14px / 400 / 21px / #55534E / center` | identical | match |
| Rewire-Curve | caption | copy | `Twelve weeks of kept days — the late-night window guarded, urges shorter each week, until an evening is just an evening.` | `Twelve weeks of kept days — the {trig} window guarded, …` where `trig = 'Late night'.toLowerCase() = 'late night'` — `v3.tsx:1647, 1655` | **MISMATCH** |
| Rewire-Curve | CTA pill | top / height / radius / label / tracking | `744px / 58px / 29px / Next / 0.2px` | `bottom: 50 / 58 / 29 / Next / 0.2` | match |

### Rewire-Curve — visualization geometry

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Rewire-Curve | chart svg | viewBox | `0 0 300 170` | identical — `art.tsx:840` | match |
| Rewire-Curve | chart svg | width / aspect | `100%` / 300:170 | `aspectRatio: 300/170` — `art.tsx:839` | match |
| Rewire-Curve | chart svg | user→px scale | 313/300 = 1.043333 → drawn height 177.37 | identical | match |
| Rewire-Curve | chart title | x / y / size / weight / fill | `18 / 18 / 11 / 500 / #B0AEA8` | identical — `art.tsx:841` | match |
| Rewire-Curve | chart title | copy | `how hard urges pull` | identical | match |
| Rewire-Curve | bar 1 | x / y / w / h / rx / fill-opacity | `18.0 / 38 / 14 / 100 / 4 / 1.00` | `[18.0, 38, 100, 1.0]` — `art.tsx:826` | match |
| Rewire-Curve | bar 2 | x / y / h / fill-opacity | `40.4 / 48 / 90 / 0.94` | `[40.4, 48, 90, 0.94]` | match |
| Rewire-Curve | bar 3 | x / y / h / fill-opacity | `62.8 / 58 / 80 / 0.88` | `[62.8, 58, 80, 0.88]` | match |
| Rewire-Curve | bar 4 | x / y / h / fill-opacity | `85.2 / 67 / 71 / 0.81` | `[85.2, 67, 71, 0.81]` | match |
| Rewire-Curve | bar 5 | x / y / h / fill-opacity | `107.6 / 76 / 62 / 0.75` | `[107.6, 76, 62, 0.75]` — `art.tsx:827` | match |
| Rewire-Curve | bar 6 | x / y / h / fill-opacity | `130.0 / 84 / 54 / 0.69` | `[130.0, 84, 54, 0.69]` | match |
| Rewire-Curve | bar 7 | x / y / h / fill-opacity | `152.4 / 92 / 46 / 0.63` | `[152.4, 92, 46, 0.63]` | match |
| Rewire-Curve | bar 8 | x / y / h / fill-opacity | `174.8 / 99 / 39 / 0.57` | `[174.8, 99, 39, 0.57]` | match |
| Rewire-Curve | bar 9 | x / y / h / fill-opacity | `197.2 / 106 / 32 / 0.50` | `[197.2, 106, 32, 0.5]` — `art.tsx:828` | match |
| Rewire-Curve | bar 10 | x / y / h / fill-opacity | `219.6 / 112 / 26 / 0.44` | `[219.6, 112, 26, 0.44]` | match |
| Rewire-Curve | bar 11 | x / y / h / fill-opacity | `242.0 / 117 / 21 / 0.38` | `[242.0, 117, 21, 0.38]` | match |
| Rewire-Curve | bar 12 | x / y / h / fill-opacity | `264.4 / 122 / 16 / 0.32` | `[264.4, 122, 16, 0.32]` | match |
| Rewire-Curve | bars | width / rx / fill | `14` / `4` / `#131313` | `width={14} rx={4} fill="#131313"` — `art.tsx:845` | match |
| Rewire-Curve | bars | x pitch | 22.4 user units | 22.4 (from the table) | match |
| Rewire-Curve | bars | domain→pixel mapping | week I..XII → x 18 + 22.4·k; "pull" 100..16 px tall, all bottoms at y 138 | identical (values stated, not derived) | match |
| Rewire-Curve | baseline | x1,y1 → x2,y2 | `14,138 → 286,138` | identical — `art.tsx:847` | match |
| Rewire-Curve | baseline | stroke / width / dash | `rgba(19,19,19,0.16)` / `1.5` / solid | identical | match |
| Rewire-Curve | axis label left | x / y / size / weight / fill / copy | `18 / 158 / 10.5 / 500 / #8B8882 / week I` | identical — `art.tsx:848` | match |
| Rewire-Curve | axis label right | x / y / size / weight / fill / anchor / copy | `282 / 158 / 10.5 / 500 / #8B8882 / end / week XII` | identical — `art.tsx:851` | match |
| Rewire-Curve | chart | y-axis / ticks / gridlines | none | none | match |
| Rewire-Curve | chart | fill gradients / clips / masks | none | none | match |
| Rewire-Curve | chart | paint order | title, 12 bars, baseline, two axis labels | identical | match |

## Frame 12 — Results-Pattern (106) · `O3Pattern`

App: `v3.tsx:1537–1555` + `art.tsx:862–922` (`UrgesByNightCard`, `MoonGlyph`, `MostActiveTriggerCard`). Chrome: `{ seg: 8, backTop: 42 }`.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Results-Pattern | progress rule | segments inked | 8 of 8 | `seg: 8` — `welcome.tsx:138` | match |
| Results-Pattern | headline | absolute top | `158px` | `top: 104` (158 − 54) — `v3.tsx:1540` | match |
| Results-Pattern | headline | left / right | `26px / 26px` | `left: 26, right: 26` | match |
| Results-Pattern | headline | text-align | `center` | `center` prop | match |
| Results-Pattern | headline | font-size | `22px` | `fontSize: 22` | match |
| Results-Pattern | headline | numeric weight | `500` | `sans('500')` | match |
| Results-Pattern | headline | line-height | `1.32` (= 29.04px) | `lineHeight: 29.04` | match |
| Results-Pattern | headline | letter-spacing | `0.1px` | `letterSpacing: 0.1` | match |
| Results-Pattern | headline | colour | `#1D1C1A` | `'#1D1C1A'` | match |
| Results-Pattern | headline | copy | `Your pattern, mapped.` | identical | match |
| Results-Pattern | chart card | absolute top | `268px` | `top: 214` (268 − 54) — `v3.tsx:1543` | match |
| Results-Pattern | chart card | left / right | `24px / 24px` | `24 / 24` | match |
| Results-Pattern | chart card | height | `250px` | `height: 250` — `art.tsx:869` | match |
| Results-Pattern | chart card | border-radius | `16px` | `borderRadius: 16` (overrides `CARD`'s 20) | match |
| Results-Pattern | chart card | background / shadow | `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.09)` | `CARD` | match |
| Results-Pattern | chart title | left / top | `20px / 18px` | `left: 20, top: 18` — `art.tsx:870` | match |
| Results-Pattern | chart title | size / weight / colour | `12.5px / 600 / #8B8882` | identical | match |
| Results-Pattern | chart title | copy | `Urges by night` | identical | match |
| Results-Pattern | trigger card | absolute top | `540px` | `top: 486` (540 − 54) — `v3.tsx:1546` | match |
| Results-Pattern | trigger card | left / right | `24px / 24px` | `24 / 24` | match |
| Results-Pattern | trigger card | height / radius | `76px / 16px` | `height: 76, borderRadius: 16` — `art.tsx:910` | match |
| Results-Pattern | trigger card | background / shadow | `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.09)` | `CARD` | match |
| Results-Pattern | trigger card | flex-direction / align | `row / center` | `flexDirection:'row', alignItems:'center'` | match |
| Results-Pattern | trigger card | padding | `0 20px` | `paddingHorizontal: 20` | match |
| Results-Pattern | trigger card | gap | `16px` | `gap: 16` | match |
| Results-Pattern | trigger avatar | width / height | `44px / 44px` | `44 / 44` — `art.tsx:911` | match |
| Results-Pattern | trigger avatar | border-radius | `50%` | `borderRadius: 22` | match |
| Results-Pattern | trigger avatar | background | `#F1EFE9` | `'#F1EFE9'` | match |
| Results-Pattern | trigger avatar | align / justify / flex-shrink | `center / center / 0` | identical | match |
| Results-Pattern | moon glyph | icon size / viewBox | `20 × 20` / `0 0 24 24` | `size = 20`, `viewBox="0 0 24 24"` — `art.tsx:901` | match |
| Results-Pattern | moon glyph | path `d` | `M14.5 2.5a9.5 9.5 0 1 0 7 14 9 9 0 0 1-7-14z` | identical — `art.tsx:902` | match |
| Results-Pattern | moon glyph | fill / stroke | `#131313` / none | `fill="#131313"`, no stroke | match |
| Results-Pattern | trigger label | size / weight / colour | `12.5px / 600 / #8B8882` | identical — `art.tsx:915` | match |
| Results-Pattern | trigger label | copy | `Most active trigger` | identical | match |
| Results-Pattern | trigger value | margin-top | `4px` | `marginTop: 4` — `art.tsx:916` | match |
| Results-Pattern | trigger value | size / weight / colour | `17.5px / 600 / #1D1C1A` | identical | match |
| Results-Pattern | trigger value | copy | `Late nights, weekends` | `busiestTrigger()` default `'Late nights, weekends'` — `v3.tsx:1529` | match |
| Results-Pattern | trigger value | max lines | not stated (unbounded) | `numberOfLines={1}` — `art.tsx:916` | **MISMATCH** |
| Results-Pattern | window line | absolute top | `648px` | `top: 594` (648 − 54) — `v3.tsx:1549` | match |
| Results-Pattern | window line | left / right | `26px / 26px` | `left: 26, right: 26` | match |
| Results-Pattern | window line | text-align | not stated → `left` | no `center` prop → left | match |
| Results-Pattern | window line | size / weight / lh / colour | `15px / 400 / 22px / #55534E` | `15 / sans('400') / 22 / '#55534E'` | match |
| Results-Pattern | window line | copy | `Your risky window is Friday and Saturday night. We'll pay gentle attention there first.` | `Your risky window is {PEAK_NAMES[4]} and {PEAK_NAMES[5]} night. We'll pay gentle attention there first.` → `Friday` / `Saturday`, `&apos;` = U+0027 — `v3.tsx:1534–1535, 1550` | match |
| Results-Pattern | CTA pill | absolute top | `764px` | `bottom: 852 − 764 − 58 = 30` — `v3.tsx:1552` | match |
| Results-Pattern | CTA pill | left / right / height / radius / background | `24 / 24 / 58px / 29px / #131313` | identical | match |
| Results-Pattern | CTA label | size / weight / colour | `17px / 600 / #FFFFFF` | identical | match |
| Results-Pattern | CTA label | letter-spacing | `0.3px` | `ls={0.3}` | match |
| Results-Pattern | CTA label | copy | `See what's ahead` | `See what's ahead` (U+0027) | match |

### Results-Pattern — visualization geometry (urges by night)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Results-Pattern | bar plot | left / right | `20px / 20px` | `left: 20, right: 20` — `art.tsx:871` | match |
| Results-Pattern | bar plot | bottom | `44px` | `bottom: 44` | match |
| Results-Pattern | bar plot | height (plot band) | `130px` | `height: 130` | match |
| Results-Pattern | bar plot | flex-direction / align-items | `row` / `flex-end` | `flexDirection:'row', alignItems:'flex-end'` | match |
| Results-Pattern | bar plot | gap | `14px` | `gap: 14` | match |
| Results-Pattern | bar plot | domain→pixel mapping | value = px height directly, baseline at the band foot; 7 equal `flex:1` columns across 345 − 40 = 305 − 6·14 = 221 → 31.57 wide | identical | match |
| Results-Pattern | bar Mo | height / fill | `42px / #DCDBD6` | `NIGHT_BARS[0] = 42`, non-peak `#DCDBD6` — `art.tsx:864, 882` | match |
| Results-Pattern | bar Tu | height / fill | `58px / #DCDBD6` | `58` / `#DCDBD6` | match |
| Results-Pattern | bar We | height / fill | `50px / #DCDBD6` | `50` / `#DCDBD6` | match |
| Results-Pattern | bar Th | height / fill | `72px / #DCDBD6` | `72` / `#DCDBD6` | match |
| Results-Pattern | bar Fr | height / fill | `96px / #131313` | `96` / peak (`peaks=[4,5]`) `#131313` — `v3.tsx:1534` | match |
| Results-Pattern | bar Sa | height / fill | `120px / #131313` | `120` / `#131313` | match |
| Results-Pattern | bar Su | height / fill | `84px / #DCDBD6` | `84` / `#DCDBD6` | match |
| Results-Pattern | bars | border-radius per corner | `6px 6px 2px 2px` | `borderTopLeftRadius:6, borderTopRightRadius:6, borderBottomLeftRadius:2, borderBottomRightRadius:2` — `art.tsx:878–881` | match |
| Results-Pattern | bars | stroke / gradient | none | none | match |
| Results-Pattern | axis row | left / right / bottom | `20px / 20px / 16px` | `left:20, right:20, bottom:16` — `art.tsx:887` | match |
| Results-Pattern | axis row | flex-direction / gap | `row` (flex) / `14px` | `flexDirection:'row', gap: 14` | match |
| Results-Pattern | axis tick labels | text / order | `Mo Tu We Th Fr Sa Su` | `NIGHT_DAYS` — `art.tsx:862` | match |
| Results-Pattern | axis tick labels | flex / align / size / weight / colour | `1 / center / 11.5px / 500 / #8B8882` | identical — `art.tsx:889` | match |
| Results-Pattern | chart | gridlines / y-axis / baseline rule | none drawn | none | match |
| Results-Pattern | chart | clip paths / masks | none | none | match |

## Frame 13 — The-Vow (108) · `O3Pledge`

App: `v3.tsx:1799–1820` + `art.tsx:927–998` (`VowSunArt`, `VowSignaturePanel`, `SUN_97`). Chrome: `{ paper: 'plain', back: false }`, `pledge` in `NOBAR`.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| The-Vow | frame root | background | `#FFFFFF` (flat, no field, no noise) | `paper === 'plain'` → full-bleed `backgroundColor:'#FFFFFF'` — `v3.tsx:293` | match |
| The-Vow | progress rule | presence | not drawn | `NOBAR.has('pledge')` → `bar={false}` — `welcome.tsx:142, 275` | match |
| The-Vow | Back control | presence | not drawn | `back: false` — `welcome.tsx:140` | match |
| The-Vow | title | absolute top | `130px` | `top: 76` (130 − 54) — `v3.tsx:1803` | match |
| The-Vow | title | left / right / align | `0 / 0 / center` | `left:0, right:0`, `center` prop | match |
| The-Vow | title | font-size | `22px` | `fontSize: 22` | match |
| The-Vow | title | numeric weight | `500` | `sans('500')` | match |
| The-Vow | title | letter-spacing | `0.1px` | `letterSpacing: 0.1` | match |
| The-Vow | title | line-height | not stated (normal) | not set → dropped by `AppText` | match |
| The-Vow | title | colour | `#1D1C1A` | `'#1D1C1A'` | match |
| The-Vow | title | copy | `The vow.` | identical | match |
| The-Vow | vow line | absolute top | `174px` | `top: 120` (174 − 54) — `v3.tsx:1806` | match |
| The-Vow | vow line | left / right | `44px / 44px` | `left: 44, right: 44` | match |
| The-Vow | vow line | size / weight | `15.5px / 400` | `15.5` / `sans('400')` | match |
| The-Vow | vow line | line-height | `24px` | `lineHeight: 24` | match |
| The-Vow | vow line | colour | `#55534E` | `'#55534E'` | match |
| The-Vow | vow line | copy | `I'm done letting the wave decide. One evening at a time, I take the watch back.` (U+0027) | `I&apos;m done letting the wave decide. One evening at a time, I take the watch back.` (U+0027) | match |
| The-Vow | sun halo | absolute left / top | `50% / 252px` | stage at `left:'50%', top: 198` (252 − 54); halo at `left:0, top:0` inside it — `v3.tsx:1809`, `art.tsx:936` | match |
| The-Vow | sun halo | width / height | `200px / 200px` | `200 / 200` | match |
| The-Vow | sun halo | margin-left | `-100px` | `marginLeft: -100` | match |
| The-Vow | sun halo | border-radius | `50%` | inscribed ellipse (`Wash`) | match |
| The-Vow | sun halo | stop 1 | `rgba(226,186,120,0.38)` @ 0% | `rgb(226,186,120)` @ `0%`, `0.38` — `art.tsx:932` | match |
| The-Vow | sun halo | stop 2 | `rgba(226,186,120,0)` @ 72% | `0` @ `72%` | match |
| The-Vow | sun halo | filter | `blur(3px)` | radial falloff | deviation (N-3) |
| The-Vow | sun disc | absolute left / top | `50% − 28 / 278px` | `left: 72, top: 26` inside the 200-wide stage at `left:'50%', marginLeft:-100, top:198` → 50% − 28 / 278 — `art.tsx:944` | match |
| The-Vow | sun disc | width / height | `56px / 56px` | `size={56}` | match |
| The-Vow | sun disc | border-radius | `50%` | `borderRadius: 28` + inscribed `Circle` | match |
| The-Vow | sun disc | gradient centre | `circle at 50% 38%` | `cx="50%" cy="38%"` — `art.tsx:941–942` | match |
| The-Vow | sun disc | gradient radius | CSS `farthest-corner` | `r="79.6%"` (√(0.5²+0.62²)) — `art.tsx:488` | match |
| The-Vow | sun disc | stop 1 | `#F8E9CB` @ 0% | `SUN_97[0]` — `art.tsx:479` | match |
| The-Vow | sun disc | stop 2 | `#EFD3A2` @ 70% | `['70%','#EFD3A2']` | match |
| The-Vow | sun disc | stop 3 | `#E3BE85` @ 100% | `['100%','#E3BE85']` | match |
| The-Vow | sun disc | shadow x/y/blur/colour | `0 / 6px / 18px / rgba(226,186,120,0.45)` | `boxShadow:'0 6px 18px rgba(226,186,120,0.45)'` — `art.tsx:944` | match |
| The-Vow | signature panel | absolute top | `428px` | `top: 374` (428 − 54) — `v3.tsx:1812` | match |
| The-Vow | signature panel | left / right | `36px / 36px` | `left: 36, right: 36` | match |
| The-Vow | signature panel | height | `170px` | `height: 170` — `art.tsx:958` | match |
| The-Vow | signature panel | border-radius | `18px` | `borderRadius: 18` | match |
| The-Vow | signature panel | corner style | circular | `borderCurve:'continuous'` | deviation (N-4) |
| The-Vow | signature panel | background | `#FAF9F6` | `'#FAF9F6'` | match |
| The-Vow | signature panel | inset ring | `inset 0 0 0 1.5px rgba(0,0,0,0.10)` | `boxShadow:'inset 0 0 0 1.5px rgba(0,0,0,0.10)'` | match |
| The-Vow | SIGNATURE caption | left / top | `16px / 13px` | `left: 16, top: 13` — `art.tsx:959` | match |
| The-Vow | SIGNATURE caption | size / weight | `10.5px / 600` | `10.5` / `sans('600')` | match |
| The-Vow | SIGNATURE caption | letter-spacing | `1.6px` | `letterSpacing: 1.6` | match |
| The-Vow | SIGNATURE caption | colour | `#C6C3BC` | `'#C6C3BC'` | match |
| The-Vow | SIGNATURE caption | text-transform | none (literal caps in the copy) | literal caps `'SIGNATURE'` | match |
| The-Vow | Clear affordance | right / top | `16px / 11px` | `right: 16, top: 11` — `art.tsx:966` | match |
| The-Vow | Clear affordance | size / weight / colour | `12.5px / 500 / #B0AEA8` | identical — `art.tsx:967` | match |
| The-Vow | Clear affordance | copy | `Clear` | `Clear` | match |
| The-Vow | ink stroke svg | width / height | `216 / 64` | `width={216} height={64}` — `art.tsx:970` | match |
| The-Vow | ink stroke svg | viewBox | `0 0 216 64` | `viewBox="0 0 216 64"` | match |
| The-Vow | ink stroke svg | left / bottom | `44px / 36px` | `left: 44, bottom: 36` | match |
| The-Vow | ink stroke | path `d` | `M6 46 C 20 8, 44 6, 40 30 C 36 52, 12 56, 34 44 C 58 30, 78 22, 96 36 C 108 46, 122 30, 138 34` | identical — `art.tsx:972` | match |
| The-Vow | ink stroke | fill / stroke / width | `none` / `#26261F` / `2.2` | identical | match |
| The-Vow | ink stroke | cap / join | `round` / `round` | identical | match |
| The-Vow | ink stroke | terminal dot cx/cy/r/fill | `138 / 34 / 2.6 / #26261F` | identical — `art.tsx:979` | match |
| The-Vow | ink stroke | state drawn | present (signed) | rendered only when `signed`; `onSign` sets it — `art.tsx:969, 989–995` | match (frame draws the signed state) |
| The-Vow | rule cross `×` | left / bottom | `24px / 38px` | `left: 24, bottom: 38` — `art.tsx:982` | match |
| The-Vow | rule cross `×` | font-size / colour | `14px / #B0AEA8` | `fontSize: 14`, `'#B0AEA8'` | match |
| The-Vow | signature rule | left / right / bottom | `22px / 22px / 34px` | `left: 22, right: 22, bottom: 34` — `art.tsx:983` | match |
| The-Vow | signature rule | height / colour | `1.5px / rgba(0,0,0,0.26)` | `height: 1.5`, `'rgba(0,0,0,0.26)'` | match |
| The-Vow | printed name | left / bottom | `24px / 13px` | `left: 24, bottom: 13` — `art.tsx:984` | match |
| The-Vow | printed name | size / weight / colour | `11.5px / 500 / #B0AEA8` | identical | match |
| The-Vow | printed name | copy | `Sam` | `{name || 'You'}` | match |
| The-Vow | printed date | right / bottom | `22px / 13px` | `right: 22, bottom: 13` — `art.tsx:985` | match |
| The-Vow | printed date | size / weight / colour | `11.5px / 500 / #B0AEA8` | identical | match |
| The-Vow | printed date | format | `Jun 9 · Day 0` | `` `${toLocaleDateString('en-US',{month:'short',day:'numeric'})} · Day 0` `` — `v3.tsx:1794–1797` | match |
| The-Vow | CTA pill | absolute top | `688px` | `bottom: 852 − 688 − 54 = 110` — `v3.tsx:1815` | match |
| The-Vow | CTA pill | left / right | `24px / 24px` | `24 / 24` | match |
| The-Vow | CTA pill | height | `54px` | `h={54}` | match |
| The-Vow | CTA pill | border-radius | `27px` | `borderRadius: h/2 = 27` | match |
| The-Vow | CTA pill | background | `#131313` | `'#131313'` | match |
| The-Vow | CTA pill | disabled state | not drawn (frame shows it live) | `opacity: 0.26` until `inked` — `v3.tsx:439, 1815` | match (frame draws the signed/enabled state) |
| The-Vow | CTA label | size / weight / tracking / colour | `17px / 600 / 0.2px / #FFFFFF` | identical | match |
| The-Vow | CTA label | copy | `I sign it` | identical | match |
| The-Vow | ghost link | absolute top | `760px` | `bottom: 852 − 760 − 18 = 74` — `v3.tsx:1817` | match |
| The-Vow | ghost link | left / right / align | `0 / 0 / center` | `0 / 0`, centered | match |
| The-Vow | ghost link | size / weight / colour | `15px / 500 / #8B8882` | identical | match |
| The-Vow | ghost link | copy | `Read it once more` | identical | match |

## Notes — stated deviations (not counted as mismatches)

These are places where the app deliberately departs from the frame, each already carrying a comment in the source. They are recorded so they are never mistaken for drift, and so the next reader can re-decide them.

* **N-1 · Enlisting-Aegis is a still of a running process.** The canvas can only draw one moment: bar at 186 of 311 (59.807%), steps 1–2 ticked, step 3 turning. The app runs the whole sequence — bar `0.04 → 1` over 6400 ms on `Easing.bezier(0.25,0.6,0.3,1)`, ticks at 2000/4000/6000 ms, screen advances at 6800 ms (`v3.tsx:1353–1366`). The frame's state is one instant inside that timeline.
* **N-2 · Aegis spinner turns.** The frame draws a static three-quarter ring; `AegisSpinner` rotates it 0→360° every 1100 ms, linear (`art.tsx:356–376`).
* **N-3 · `filter: blur(n)` has no RN SVG equivalent.** Every blurred CSS wash is redrawn as a `closest-side` radial with the frame's own stops (`art.tsx:11–13, 36–52`). Stop offsets and alphas are byte-identical; only the extra Gaussian softening is absent.
* **N-4 · `borderCurve: 'continuous'`.** The frames state plain circular `border-radius`; the app adds iOS continuous (squircle) corners on `CARD`, `O3PaperCard`, the plan card and the vow panel. Radius values are identical; the corner curve is not.
* **N-5 · Plan-Ready flag SVG viewBox.** The frame's `viewBox="0 0 120 100"` clips the top 2 user-units of the flagpole (`y = -2`). The app uses `viewBox="0 -4 120 104"` with `top` pulled back 4, which maps every user-space `y` to the same on-screen pixel (`30 + y`) but leaves the pole unclipped (`art.tsx:445–448`).
* **N-6 · Tally numerals count up.** The frames print the final number; `useCountUp` eases 0 → n over 1500 ms, cubic-out (`v3.tsx:1453–1467`). The resting value is the frame's.
* **N-7 · Reversal clearing easing.** The frame's keyframe uses CSS `ease` per cell; the app drives one linear master timeline and interpolates each cell's colour linearly across its own 900 ms window (`art.tsx:686–708`). Indices, delays, duration, span and target colour are all exact; only the per-cell easing curve differs.
* **N-8 · The 54pt status-bar assumption.** Every "canvas top − 54" placement is exact only where the device's top safe-area inset is 54pt. On an inset of 59 (iPhone 14/15 Pro) or 50 (13 mini) every in-safe-area element shifts by the difference. This is systemic to the port, not specific to these frames.
* **N-9 · `text-wrap: balance` / `pretty`.** Stated on most headlines and captions; React Native has no equivalent (`AppText` applies it on web only, `AppText.tsx:126`). No numeric value drifts, but long wrapped lines will break differently from the frame.
* **N-10 · Canvas gallery chrome.** Each frame div carries `box-shadow: 0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` and `flex-shrink: 0`. That is the gallery's card treatment, not screen content, and is correctly absent from the app.
* **N-11 · Canvas self-contradiction on apostrophes.** `Root-Loop` and `The-Vow` and `Results-Pattern` use U+0027 (`'`) in body copy; `Campaign-Line` uses `&rsquo;` (U+2019). The frames disagree with each other. The evidence supports treating U+2019 as the intended typography (it is the only *deliberate* entity in the set — a straight quote is what a plain text editor produces by default, an `&rsquo;` is not), which makes Finding 1 a candidate for fixing the *frame* rather than the app. It is reported as a mismatch because the audit's rule is character-for-character.

## Findings

Six rows failed. Ordered most-substantive first.

1. **`src/components/onboarding/art.tsx:762–763` — Streak-Sawtooth card noise paints under the chart, not over it.**
   Current app value: `<Noise opacity={0.05} radius={20} />` is declared *before* the chart wrapper, and React Native paints children in declaration order, so the chart sits on top of the noise.
   Design value: the frame's noise div is `position:absolute; inset:0` while the `<svg>` is `display:block` (non-positioned), so CSS paints the noise **above** the chart.
   Visual delta is a 5%-alpha texture over vs under the ink — small, but it is a z-order inversion, and it is the property the frame states.

2. **`src/components/onboarding/art.tsx:796–797` — Campaign-Line card noise paints under the chart.** Same inversion as Finding 1, same cause, same frame construction (`padding:20px 16px 16px`, absolute noise, static `<svg viewBox="0 0 320 190">`).

3. **`src/components/onboarding/art.tsx:838–839` — Rewire-Curve card noise paints under the chart.** Same inversion as Finding 1, on the `viewBox="0 0 300 170"` bar chart.

4. **`src/components/onboarding/art.tsx:916` — `MostActiveTriggerCard` clamps the trigger value to one line.**
   Current app value: `numberOfLines={1}`.
   Design value: the frame's value div (`Results-Pattern`, `top:540px` card) states no clamp — `font-size:17.5px; font-weight:600; color:#1D1C1A; margin-top:4px` and nothing else, so it wraps.
   Invisible on the frame's own string (`Late nights, weekends` fits), but a two-trigger answer such as `Bored daytime, Phone in bed` will truncate in the app where the frame would wrap.

5. **`src/components/onboarding/v3.tsx:1655` — Rewire-Curve caption drops the hyphen in "late-night".**
   Current app value: `` `…the ${trig} window guarded…` `` with `trig` from `v3.tsx:1647` = `'Late night'.toLowerCase()` → renders **`the late night window guarded`**.
   Design value: **`the late-night window guarded`** (hyphenated compound modifier).
   The app builds the phrase from the raw option label, so no substitution path can produce the frame's hyphen.

6. **`src/components/onboarding/v3.tsx:1428` — Root-Loop headline uses curly apostrophes where the frame uses straight ones.**
   Current app value: `Porn isn’t the problem, {name}. It’s your anesthetic for {word}.` (U+2019 ×2).
   Design value: `Porn isn't the problem, Sam. It's your anesthetic for loneliness.` (U+0027 ×2).
   Same applies to the `auto` variant at `v3.tsx:1429`. See **N-11**: the canvas contradicts itself across frames on this character, and the evidence favours the app's U+2019 as the intended glyph — the fix most likely belongs in the frame.

### Row count supporting the result

**743 comparison rows** across **13 frames** (plus one shared-chrome table covering the ten identical paper frames' field, rule and Back row). 6 rows are MISMATCH, 19 rows are stated deviations (N-1 … N-11), the remaining 718 match.
