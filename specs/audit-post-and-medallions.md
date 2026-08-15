# Property audit — the post and the medallions

Eleven frames, read line by line from `.uifinal/pretty/final/Email Login/`, against the code that
draws them. Nothing here was judged by eye; every row is a transcribed design literal set beside a
value read out of the source.

**Frames** Letter-Received, Letter-Arrival, Letter-Read, Medallion-Letter, Yearly-Drop,
Drop-Received, Detail-Paper, Detail-Bronze, Detail-Silver, Detail-Gold, Detail-Platinum.

**App files**
`src/app/letter.tsx` · `src/app/mail.tsx` · `src/app/drop.tsx` · `src/app/medallion-post.tsx` ·
`src/app/medallions/[key].tsx` · `src/components/keepsakes/Medallion.tsx`

## The 54pt rule

Each frame is a 393 × 852 div whose `top` values include a 54px status bar the app never builds.
The app's equivalent top is **canvas top − 54**. Both numbers are stated in the Design column as
`top N (app N−54)`. Three positioning conventions are in play and each is exact on the reference
393 × 852 device:

| Screen | Origin | Convention |
| --- | --- | --- |
| `MailArrival` (letter/drop arrivals) | flex child of `SafeAreaView edges={['top']}` | tops carried as canvas−54; the two actions pinned from the **bottom** instead (`852 − top − height`) |
| `MailSheet` (letter/drop/medallion sheets) | the sheet box itself, `top: -2` from the safe-area top | canvas tops inside the sheet are already sheet-relative, so they are carried literally |
| `medallions/[key]` | `ScrollView` content box, height `852 − insets.top` | every top carried as canvas−54, bottom edge = screen bottom |

## Verdict legend

| Verdict | Meaning |
| --- | --- |
| `match` | the app's literal equals the design's literal |
| `MISMATCH` | a real difference the app can and should close |
| `MISMATCH (platform)` | the design literal has no React Native equivalent; the app carries a documented substitute. Listed in Findings, separated out |
| `n/a (canvas chrome)` | the frame draws it, the app never builds it (status bar, gallery drop shadow) |

## About `mail.tsx`

`src/app/mail.tsx` is in scope as a named file but draws **none** of these eleven frames. It is the
Mail index: a `BackChevron`, a 27/600 "Mail" title and a list of `PressScale` rows on
`colors.surface`. Its only relationship to this audit is routing — `go: () => router.push('/letter')`
(line 75) reaches Letter-Received/Arrival, and `router.push('/medallion-post')` (line 66) reaches
Medallion-Letter. No frame in this set specifies the Mail index, so no rows are written against it.

---

## Frame 1 — Letter-Received

`src/app/letter.tsx`, `variant=week12`, `phase='arrive'` → `MailArrival` + `EnvelopeArt`.

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Letter-Received | frame | width | 393px | device width (393 reference) | match |
| Letter-Received | frame | height | 852px | device height (852 reference) | match |
| Letter-Received | frame | position / overflow | relative / hidden | root `View flex:1` (letter.tsx:101) | match |
| Letter-Received | frame | background | `#F4F3F0` | `'#F4F3F0'` (letter.tsx:101, arrive branch) | match |
| Letter-Received | frame | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | iOS `'System'` (theme.ts:163); web `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif` (theme.ts:159) | match (iOS); web stack differs literally, resolves to the same face |
| Letter-Received | frame | -webkit-font-smoothing | antialiased | `WebkitFontSmoothing:'antialiased'` on web (AppText.tsx:126) | match |
| Letter-Received | frame | flex-shrink | 0 | n/a — gallery layout | n/a (canvas chrome) |
| Letter-Received | frame | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none — gallery device frame | n/a (canvas chrome) |
| Letter-Received | grain | position / inset | absolute / 0 | `position:'absolute', top/left/right/bottom:0` (letter.tsx:210) | match |
| Letter-Received | grain | source | `noise-dark.png` | `require('../../assets/images/noise-dark.png')` (letter.tsx:34) | match |
| Letter-Received | grain | tiling | CSS `background-image`, no `background-size` → repeats at the file's natural 96 × 96 | `contentFit="cover"` — one 96 × 96 copy scaled to 393 × 852 (≈8.9× magnification) | **MISMATCH** |
| Letter-Received | grain | opacity | 0.07 | 0.07 | match |
| Letter-Received | grain | pointer-events | none | `pointerEvents="none"` | match |
| Letter-Received | grain | z-order | painted first, both washes over it | rendered before the wash `View` (letter.tsx:210 → 212) | match |
| Letter-Received | wash wrapper | position / inset / overflow / pointer-events | absolute / 0 / hidden / none | same (letter.tsx:212) | match |
| Letter-Received | wash top | left | -15% | `-width * 0.15` (letter.tsx:214) | match |
| Letter-Received | wash top | top | -190px | -190 | match |
| Letter-Received | wash top | width | 130% | `width * 1.3` | match |
| Letter-Received | wash top | height | 300px | 300 | match |
| Letter-Received | wash top | border-radius | 50% | drawn as `Ellipse rx (width*1.3)/2 ry 150` | match |
| Letter-Received | wash top | gradient shape | `radial-gradient(closest-side, …)` | `RadialGradient cx/cy 50% rx/ry 50%` on the box's own ellipse | match |
| Letter-Received | wash top | stop 1 | `rgba(180,170,150,0.32)` @ 0 | `#B4AA96` opacity 0.32 @ 0 | match |
| Letter-Received | wash top | stop 2 | `rgba(180,170,150,0.1)` @ 55% | `#B4AA96` opacity 0.1 @ 0.55 | match |
| Letter-Received | wash top | stop 3 | `rgba(180,170,150,0)` @ 75% | `#B4AA96` opacity 0 @ 0.75 | match |
| Letter-Received | wash top | filter | `blur(5px)` | none — RN SVG has no filter primitive | MISMATCH (platform) |
| Letter-Received | wash bottom | left / margin-left | 50% / -260px | `left:'50%', marginLeft:-260` (letter.tsx:224) | match |
| Letter-Received | wash bottom | bottom | -260px | -260 | match |
| Letter-Received | wash bottom | width × height | 520 × 520 | 520 × 520 | match |
| Letter-Received | wash bottom | border-radius | 50% | `Ellipse rx 260 ry 260` | match |
| Letter-Received | wash bottom | stop 1 | `rgba(255,236,196,0.4)` @ 0 | `#FFECC4` opacity 0.4 @ 0 | match |
| Letter-Received | wash bottom | stop 2 | `rgba(255,236,196,0.18)` @ 45% | `#FFECC4` opacity 0.18 @ 0.45 | match |
| Letter-Received | wash bottom | stop 3 | `rgba(255,236,196,0)` @ 72% | `#FFECC4` opacity 0 @ 0.72 | match |
| Letter-Received | wash bottom | filter | none | none | match |
| Letter-Received | status bar | height / padding / z | 54px / `6px 32px 0 46px` / 20 | OS-drawn; height reserved by `SafeAreaView edges={['top']}` | n/a (canvas chrome) |
| Letter-Received | status bar | ink | `#1D1C1A` (time 17/600, ls -0.2; three glyph SVGs) | `StatusBar style="dark"` (letter.tsx:102) | match |
| Letter-Received | close X | svg size / viewBox | 18 × 18 / `0 0 18 18` | 18 × 18 / `0 0 18 18` (letter.tsx:248) | match |
| Letter-Received | close X | right | 20px | 20 | match |
| Letter-Received | close X | top | 66px (app 12) | 12 | match |
| Letter-Received | close X | path d | `M3 3l12 12M15 3L3 15` | `M3 3l12 12M15 3L3 15` | match |
| Letter-Received | close X | stroke | `#55534E` | `#55534E` | match |
| Letter-Received | close X | stroke-width | 2.2 | 2.2 | match |
| Letter-Received | close X | stroke-linecap | round | round | match |
| Letter-Received | art frame | left / margin-left | 50% / -130px | `left:'50%', marginLeft:-130` (letter.tsx:259) | match |
| Letter-Received | art frame | top | 160px (app 106) | `artTop = 106` (letter.tsx:166) | match |
| Letter-Received | art frame | width × height | 260 × 260 | 260 × 260 | match |
| Letter-Received | envelope glow | left / top | 40px / 10px | 40 / 10 (letter.tsx:317) | match |
| Letter-Received | envelope glow | width × height | 180 × 180 | 180 × 180 | match |
| Letter-Received | envelope glow | border-radius | 50% | `Ellipse rx 90 ry 90` | match |
| Letter-Received | envelope glow | stop 1 | `rgba(226,186,120,0.5)` @ 0 | `#E2BA78` opacity 0.5 @ 0 | match |
| Letter-Received | envelope glow | stop 2 | `rgba(226,186,120,0)` @ 74% | `#E2BA78` opacity 0 @ 0.74 | match |
| Letter-Received | envelope glow | filter | `blur(5px)` | none | MISMATCH (platform) |
| Letter-Received | contact shadow | left / top | 40px / 226px | 40 / 226 (letter.tsx:326) | match |
| Letter-Received | contact shadow | width × height | 180 × 16 | 180 × 16 | match |
| Letter-Received | contact shadow | border-radius | 50% | `Ellipse rx 90 ry 8` | match |
| Letter-Received | contact shadow | fill | flat `rgba(0,0,0,0.10)` | radial ramp `#000` 0.1 @ 0 → 0.05 @ 0.6 → 0 @ 1 | MISMATCH (platform) |
| Letter-Received | contact shadow | filter | `blur(6px)` | none | MISMATCH (platform) |
| Letter-Received | envelope card | left / top | 46px / 70px | 46 / 70 (letter.tsx:337) | match |
| Letter-Received | envelope card | width × height | 168 × 118 | 168 × 118 | match |
| Letter-Received | envelope card | border-radius | 10px, all four corners | `borderRadius: 10` | match |
| Letter-Received | envelope card | background | `linear-gradient(180deg, #FCFAF4, #F1EEE4)` | `LinearGradient colors={['#FCFAF4','#F1EEE4']}`, default vertical (letter.tsx:349) | match |
| Letter-Received | envelope card | shadow ring | `0 0 0 1px rgba(0,0,0,0.07)` | same string | match |
| Letter-Received | envelope card | drop shadow | `0 16px 32px rgba(40,38,32,0.18)` | same string | match |
| Letter-Received | envelope card | transform | `rotate(-2deg)` | `[{ rotate: '-2deg' }]` | match |
| Letter-Received | envelope card | overflow | hidden | `'hidden'` | match |
| Letter-Received | envelope noise | inset / opacity | 0 / 0.07 | 0 / 0.07 (letter.tsx:350) | match |
| Letter-Received | envelope noise | tiling | repeat at 96 × 96 | `contentFit="cover"` scaled to 168 × 118 | **MISMATCH** |
| Letter-Received | crease | svg size / viewBox | 168 × 118 / `0 0 168 118` | 168 × 118 / `0 0 168 118` (letter.tsx:351) | match |
| Letter-Received | crease | path d | `M2 4 L84 66 L166 4` | `M2 4 L84 66 L166 4` | match |
| Letter-Received | crease | fill / stroke / width | none / `rgba(0,0,0,0.12)` / 1.6 | none / `rgba(0,0,0,0.12)` / 1.6 | match |
| Letter-Received | wax seal | left / top | 106px / 112px | 106 / 112 (letter.tsx:356) | match |
| Letter-Received | wax seal | width × height | 48 × 48 | `size={48}` | match |
| Letter-Received | wax seal | border-radius | 50% | `size/2 = 24` | match |
| Letter-Received | wax seal | gradient centre | `circle at 38% 30%` | `cx="38%" cy="30%"` (letter.tsx:372) | match |
| Letter-Received | wax seal | gradient extent | default farthest-corner = 93.5% of the box | `rx="93.5%" ry="93.5%"` | match |
| Letter-Received | wax seal | stop 1 | `#F0DBB4` @ 0 | `#F0DBB4` @ 0 | match |
| Letter-Received | wax seal | stop 2 | `#E2BA78` @ 62% | `#E2BA78` @ 0.62 | match |
| Letter-Received | wax seal | stop 3 | `#C99F5F` @ 100% | `#C99F5F` @ 1 | match |
| Letter-Received | wax seal | inner ring | `inset 0 0 0 3px rgba(255,255,255,0.25)` | same string (letter.tsx:357) | match |
| Letter-Received | wax seal | drop shadow | `0 5px 12px rgba(180,140,70,0.45)` | same string | match |
| Letter-Received | wax seal | transform | `rotate(-2deg)` | `[{ rotate: '-2deg' }]` | match |
| Letter-Received | wax seal | flex | align-items / justify-content center | `alignItems / justifyContent: 'center'` | match |
| Letter-Received | laurel | viewBox / width | `0 0 40 26` / 20px | `0 0 40 26` / 20 (height 13) | match |
| Letter-Received | laurel | opacity | 0.55 | 0.55 | match |
| Letter-Received | laurel | path 1 d | `M21 3 L21 16 L12 16 Z` | identical | match |
| Letter-Received | laurel | path 2 d | `M7 18 L33 18 Q30 24 20 24 Q10 24 7 18 Z` | identical | match |
| Letter-Received | laurel | fill | `#5b4a28` | `#5b4a28` | match |
| Letter-Received | title | left / right | 36px / 36px | 36 / 36 (letter.tsx:267) | match |
| Letter-Received | title | top | 472px (app 418) | `titleTop = 418` | match |
| Letter-Received | title | text-align | center | `center` prop | match |
| Letter-Received | title | font-size | 24px | 24 | match |
| Letter-Received | title | font-weight | 500 | `sans('500')` | match |
| Letter-Received | title | line-height | 32px | 32 | match |
| Letter-Received | title | letter-spacing | -0.1px | -0.1 | match |
| Letter-Received | title | color | `#1D1C1A` | `#1D1C1A` | match |
| Letter-Received | title | text-wrap | balance | `pretty` on web (AppText.tsx:128, `body` variant) | **MISMATCH** (web only) |
| Letter-Received | title | copy | `A letter arrived.` | `ARRIVAL.week12.title` (letter.tsx:51) | match |
| Letter-Received | sub | left / right | 44px / 44px | 44 / 44 (letter.tsx:279) | match |
| Letter-Received | sub | top | 522px (app 468) | `subTop = 468` | match |
| Letter-Received | sub | text-align | center | `center` prop | match |
| Letter-Received | sub | font-size | 15.5px | 15.5 | match |
| Letter-Received | sub | font-weight | 400 | `sans('400')` | match |
| Letter-Received | sub | line-height | 23px | 23 | match |
| Letter-Received | sub | color | `#55534E` | `#55534E` | match |
| Letter-Received | sub | text-wrap | pretty | `pretty` on web | match |
| Letter-Received | sub | copy | `From the man at week XII — sealed the night you started.` | identical (letter.tsx:52) | match |
| Letter-Received | primary pill | left / right | 24px / 24px | 24 / 24 (letter.tsx:283) | match |
| Letter-Received | primary pill | top | 688px | `bottom: 108` = 852 − 688 − 56 | match |
| Letter-Received | primary pill | height | 56px | 56 | match |
| Letter-Received | primary pill | border-radius | 28px | 28 | match |
| Letter-Received | primary pill | background | `#131313` | `#131313` | match |
| Letter-Received | primary pill | flex | align-items / justify-content center | same | match |
| Letter-Received | primary label | font-size / weight | 17px / 600 | 17 / `sans('600')` | match |
| Letter-Received | primary label | letter-spacing | 0.2px | 0.2 | match |
| Letter-Received | primary label | color | `#FFFFFF` | `#FFFFFF` | match |
| Letter-Received | primary label | copy | `Open it` | `ARRIVAL.week12.open` | match |
| Letter-Received | secondary | left / right | 0 / 0 | 0 / 0 (letter.tsx:299) | match |
| Letter-Received | secondary | top | 764px | `bottom: 70` (852 − 70 − ~18pt natural line box = 764) | match |
| Letter-Received | secondary | text-align | center | `alignItems:'center'` | match |
| Letter-Received | secondary | font-size / weight | 15px / 500 | 15 / `sans('500')` | match |
| Letter-Received | secondary | color | `#8B8882` | `#8B8882` | match |
| Letter-Received | secondary | copy | `Save it for tonight` | `ARRIVAL.week12.defer` | match |
| Letter-Received | — | eyebrow / chip / field / halo | none drawn | all four props undefined on this call | match |
| Letter-Received | — | states drawn | one (resting) | one | match |

---

## Frame 2 — Letter-Arrival

`src/app/letter.tsx`, `variant=post` (default), `phase='arrive'`. Byte-identical to Letter-Received
apart from four strings; every row is still written out.

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Letter-Arrival | frame | width × height | 393 × 852 | device (393 × 852 reference) | match |
| Letter-Arrival | frame | position / overflow | relative / hidden | root `View flex:1` | match |
| Letter-Arrival | frame | background | `#F4F3F0` | `'#F4F3F0'` (letter.tsx:101) | match |
| Letter-Arrival | frame | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | iOS `'System'`; web stack per theme.ts:159 | match (iOS) |
| Letter-Arrival | frame | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | n/a (canvas chrome) |
| Letter-Arrival | grain | inset / opacity / pointer-events | 0 / 0.07 / none | 0 / 0.07 / none (letter.tsx:210) | match |
| Letter-Arrival | grain | tiling | repeat at 96 × 96 | `contentFit="cover"` | **MISMATCH** |
| Letter-Arrival | grain | z-order | under both washes | rendered before the wash `View` | match |
| Letter-Arrival | wash wrapper | inset / overflow / pointer-events | 0 / hidden / none | same (letter.tsx:212) | match |
| Letter-Arrival | wash top | left / top | -15% / -190px | `-width*0.15` / -190 | match |
| Letter-Arrival | wash top | width / height | 130% / 300px | `width*1.3` / 300 | match |
| Letter-Arrival | wash top | border-radius | 50% | `Ellipse rx (width*1.3)/2 ry 150` | match |
| Letter-Arrival | wash top | stop 1 | `rgba(180,170,150,0.32)` @ 0 | `#B4AA96` 0.32 @ 0 | match |
| Letter-Arrival | wash top | stop 2 | `rgba(180,170,150,0.1)` @ 55% | `#B4AA96` 0.1 @ 0.55 | match |
| Letter-Arrival | wash top | stop 3 | `rgba(180,170,150,0)` @ 75% | `#B4AA96` 0 @ 0.75 | match |
| Letter-Arrival | wash top | filter | `blur(5px)` | none | MISMATCH (platform) |
| Letter-Arrival | wash bottom | left / margin-left / bottom | 50% / -260px / -260px | `'50%'` / -260 / -260 | match |
| Letter-Arrival | wash bottom | width × height | 520 × 520 | 520 × 520 | match |
| Letter-Arrival | wash bottom | border-radius | 50% | `Ellipse rx 260 ry 260` | match |
| Letter-Arrival | wash bottom | stops | `rgba(255,236,196,0.4)` @ 0, `0.18` @ 45%, `0` @ 72% | `#FFECC4` 0.4 @ 0, 0.18 @ 0.45, 0 @ 0.72 | match |
| Letter-Arrival | status bar | height / ink | 54px / `#1D1C1A` | OS-drawn; `StatusBar style="dark"` | n/a (canvas chrome) / match |
| Letter-Arrival | close X | size / viewBox | 18 × 18 / `0 0 18 18` | 18 × 18 / `0 0 18 18` | match |
| Letter-Arrival | close X | right / top | 20px / 66px (app 12) | 20 / 12 | match |
| Letter-Arrival | close X | path d | `M3 3l12 12M15 3L3 15` | identical | match |
| Letter-Arrival | close X | stroke / width / linecap | `#55534E` / 2.2 / round | `#55534E` / 2.2 / round | match |
| Letter-Arrival | art frame | left / margin-left / top | 50% / -130px / 160px (app 106) | `'50%'` / -130 / 106 | match |
| Letter-Arrival | art frame | width × height | 260 × 260 | 260 × 260 | match |
| Letter-Arrival | envelope glow | left / top / size | 40px / 10px / 180 × 180 | 40 / 10 / 180 × 180 | match |
| Letter-Arrival | envelope glow | stops | `rgba(226,186,120,0.5)` @ 0, `0` @ 74% | `#E2BA78` 0.5 @ 0, 0 @ 0.74 | match |
| Letter-Arrival | envelope glow | filter | `blur(5px)` | none | MISMATCH (platform) |
| Letter-Arrival | contact shadow | left / top / size | 40px / 226px / 180 × 16 | 40 / 226 / 180 × 16 | match |
| Letter-Arrival | contact shadow | fill | flat `rgba(0,0,0,0.10)` | radial ramp 0.1 → 0.05 @ 0.6 → 0 @ 1 | MISMATCH (platform) |
| Letter-Arrival | contact shadow | filter | `blur(6px)` | none | MISMATCH (platform) |
| Letter-Arrival | envelope card | left / top / size | 46px / 70px / 168 × 118 | 46 / 70 / 168 × 118 | match |
| Letter-Arrival | envelope card | border-radius | 10px ×4 | 10 | match |
| Letter-Arrival | envelope card | background | `linear-gradient(180deg, #FCFAF4, #F1EEE4)` | `['#FCFAF4','#F1EEE4']` vertical | match |
| Letter-Arrival | envelope card | box-shadow | `0 0 0 1px rgba(0,0,0,0.07), 0 16px 32px rgba(40,38,32,0.18)` | same string | match |
| Letter-Arrival | envelope card | transform / overflow | `rotate(-2deg)` / hidden | `-2deg` / hidden | match |
| Letter-Arrival | envelope noise | inset / opacity | 0 / 0.07 | 0 / 0.07 | match |
| Letter-Arrival | envelope noise | tiling | repeat at 96 × 96 | `contentFit="cover"` | **MISMATCH** |
| Letter-Arrival | crease | size / viewBox / d | 168 × 118 / `0 0 168 118` / `M2 4 L84 66 L166 4` | identical | match |
| Letter-Arrival | crease | stroke / width | `rgba(0,0,0,0.12)` / 1.6 | identical | match |
| Letter-Arrival | wax seal | left / top / size | 106px / 112px / 48 × 48 | 106 / 112 / 48 | match |
| Letter-Arrival | wax seal | gradient | `circle at 38% 30%`, `#F0DBB4` → `#E2BA78` 62% → `#C99F5F` 100% | `cx 38% cy 30% rx/ry 93.5%`, same three stops | match |
| Letter-Arrival | wax seal | box-shadow | `inset 0 0 0 3px rgba(255,255,255,0.25), 0 5px 12px rgba(180,140,70,0.45)` | same string | match |
| Letter-Arrival | wax seal | transform | `rotate(-2deg)` | `-2deg` | match |
| Letter-Arrival | laurel | viewBox / width / opacity / fill | `0 0 40 26` / 20px / 0.55 / `#5b4a28` | identical | match |
| Letter-Arrival | laurel | path 1 / path 2 | `M21 3 L21 16 L12 16 Z` / `M7 18 L33 18 Q30 24 20 24 Q10 24 7 18 Z` | identical | match |
| Letter-Arrival | title | left / right / top | 36 / 36 / 472px (app 418) | 36 / 36 / 418 | match |
| Letter-Arrival | title | size / weight / line-height | 24px / 500 / 32px | 24 / `sans('500')` / 32 | match |
| Letter-Arrival | title | letter-spacing / color / align | -0.1px / `#1D1C1A` / center | -0.1 / `#1D1C1A` / center | match |
| Letter-Arrival | title | text-wrap | balance | `pretty` on web | **MISMATCH** (web only) |
| Letter-Arrival | title | copy | `The post is in.` | `ARRIVAL.post.title` (letter.tsx:44) | match |
| Letter-Arrival | sub | left / right / top | 44 / 44 / 522px (app 468) | 44 / 44 / 468 | match |
| Letter-Arrival | sub | size / weight / line-height / color | 15.5px / 400 / 23px / `#55534E` | 15.5 / `sans('400')` / 23 / `#55534E` | match |
| Letter-Arrival | sub | text-wrap / align | pretty / center | pretty / center | match |
| Letter-Arrival | sub | copy | `A short letter from VICI — two minutes, worth keeping.` | identical (letter.tsx:45) | match |
| Letter-Arrival | primary pill | left / right / top | 24 / 24 / 688px | 24 / 24 / `bottom:108` | match |
| Letter-Arrival | primary pill | height / radius / background | 56 / 28 / `#131313` | 56 / 28 / `#131313` | match |
| Letter-Arrival | primary label | size / weight / letter-spacing / color | 17px / 600 / 0.2px / `#FFFFFF` | 17 / 600 / 0.2 / `#FFFFFF` | match |
| Letter-Arrival | primary label | copy | `Read it` | `ARRIVAL.post.open` | match |
| Letter-Arrival | secondary | left / right / top | 0 / 0 / 764px | 0 / 0 / `bottom:70` | match |
| Letter-Arrival | secondary | size / weight / color / align | 15px / 500 / `#8B8882` / center | 15 / 500 / `#8B8882` / center | match |
| Letter-Arrival | secondary | copy | `Tonight` | `ARRIVAL.post.defer` | match |
| Letter-Arrival | — | states drawn | one (resting) | one | match |

---

## Frame 3 — Letter-Read

`src/app/letter.tsx`, `phase='read'`, post variant → `MailSheet` + `PostLetter` + `LetterFooter`.
Tops inside the sheet are sheet-relative in both the frame and the code.

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Letter-Read | frame | width × height | 393 × 852 | device | match |
| Letter-Read | frame | background | `#EDECE7` | `'#EDECE7'` (letter.tsx:101, read branch) | match |
| Letter-Read | frame | overflow | hidden | root `View` | match |
| Letter-Read | frame | font-family | `-apple-system,'SF Pro Text',system-ui,…` | iOS `'System'` | match (iOS) |
| Letter-Read | frame | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | n/a (canvas chrome) |
| Letter-Read | frame | grain / washes | none on the frame | none rendered in the read phase | match |
| Letter-Read | status bar | height / ink | 54px / `#1D1C1A` | OS-drawn; `StatusBar style="dark"` | n/a (canvas chrome) / match |
| Letter-Read | sheet | left / right | 0 / 0 | 0 / 0 (letter.tsx:415) | match |
| Letter-Read | sheet | top | 52px | `-2` from the safe-area top (54 − 2 on the reference inset) | match |
| Letter-Read | sheet | bottom | 0 | 0 | match |
| Letter-Read | sheet | border-radius | `24px 24px 0 0` | `borderTopLeftRadius:24, borderTopRightRadius:24`, bottom corners 0 | match |
| Letter-Read | sheet | background | `#F4F3F0` | `#F4F3F0` | match |
| Letter-Read | sheet | overflow | hidden | `'hidden'` | match |
| Letter-Read | sheet grain | inset / opacity / pointer-events | 0 / 0.07 / none | 0 / 0.07 / none (letter.tsx:427) | match |
| Letter-Read | sheet grain | tiling | repeat at 96 × 96 | `contentFit="cover"` | **MISMATCH** |
| Letter-Read | grabber row | left / right / top | 0 / 0 / 12px | 0 / 0 / 12 (letter.tsx:429) | match |
| Letter-Read | grabber row | justify | center | `alignItems:'center'` | match |
| Letter-Read | grabber | width × height | 38 × 5 | 38 × 5 | match |
| Letter-Read | grabber | border-radius | 3px | 3 | match |
| Letter-Read | grabber | background | `rgba(19,19,19,0.16)` | `rgba(19,19,19,0.16)` | match |
| Letter-Read | close X | size / viewBox | 20 × 20 / `0 0 20 20` | 20 × 20 / `0 0 20 20` (letter.tsx:439) | match |
| Letter-Read | close X | right / top | 22px / 26px | 22 / 26 | match |
| Letter-Read | close X | path d | `M3 3l14 14M17 3L3 17` | identical | match |
| Letter-Read | close X | stroke / width / linecap | `#55534E` / 2 / round | `#55534E` / 2 / round | match |
| Letter-Read | body | left / right | 34px / 34px | 34 / 34 (letter.tsx:459) | match |
| Letter-Read | body | top | 84px | 84 | match |
| Letter-Read | body | bottom | 160px | `bottom = 160` (post variant, letter.tsx:118) | match |
| Letter-Read | body | overflow | auto | `ScrollView`, `showsVerticalScrollIndicator={false}` | match |
| Letter-Read | salutation | font-size | 22px | 22 (letter.tsx:532) | match |
| Letter-Read | salutation | font-weight | 600 | `sans('600')` | match |
| Letter-Read | salutation | letter-spacing | 0.6px | 0.6 | match |
| Letter-Read | salutation | color | `#1D1C1A` | `#1D1C1A` | match |
| Letter-Read | salutation | margin | `0 0 24px` | `marginBottom: 24`, no other margins | match |
| Letter-Read | salutation | line-height | not stated (normal) | none set — AppText drops the inherited variant leading (AppText.tsx:119) | match |
| Letter-Read | salutation | copy | `Dear Sam,` | `Dear {name},` — first name, fallback `friend` (letter.tsx:66) | match |
| Letter-Read | paragraph ×4 | font-size | 15.5px | 15.5 (letter.tsx:538) | match |
| Letter-Read | paragraph ×4 | font-weight | 400 | `sans('400')` | match |
| Letter-Read | paragraph ×4 | line-height | 1.8 (= 27.9) | `15.5 * 1.8` = 27.9 | match |
| Letter-Read | paragraph ×4 | color | `#3A3934` | `#3A3934` | match |
| Letter-Read | paragraph ×4 | margin | `0 0 26px` | `marginBottom: 26` | match |
| Letter-Read | paragraph ×4 | text-wrap | pretty | `pretty` on web | match |
| Letter-Read | paragraph 1 | copy | `If you're reading this, it happened. Good — you opened the letter instead of disappearing. That's the only door that matters this morning.` — straight `'` in both places | same words, U+2019 `’` in both places | **MISMATCH** (see Findings 3) |
| Letter-Read | paragraph 2 | copy | `One slip is a wave, not the sea. Nothing since day zero is erased — the days stood, the urges outlasted, the reason you started:` | identical | match |
| Letter-Read | em run | font-style | normal | RN default upright | match |
| Letter-Read | em run | font-weight | 500 | `sans('500')` (letter.tsx:579) | match |
| Letter-Read | em run | font-size | inherited 15.5px | 15.5 restated | match |
| Letter-Read | em run | line-height | inherited 1.8 | `15.5 * 1.8` restated | match |
| Letter-Read | em run | color | `#1D1C1A` | `#1D1C1A` | match |
| Letter-Read | em run | text-decoration | underline | `textDecorationLine:'underline'` | match |
| Letter-Read | em run | decoration colour | `rgba(0,0,0,0.28)` | `rgba(0,0,0,0.28)` | match |
| Letter-Read | em run | decoration thickness | 1.5px | not expressible in RN | MISMATCH (platform) |
| Letter-Read | em run | underline offset | 4px | not expressible in RN | MISMATCH (platform) |
| Letter-Read | em run | copy | `I want to be present for the people I love` | `lifeMap.whyStatement` with that exact fallback (letter.tsx:67) | match |
| Letter-Read | paragraph 2 tail | copy | `. All still yours.` | `. All still yours.` | match |
| Letter-Read | paragraph 3 | copy | `The only slip that can end this is the one you answer with a second. So: water, daylight, one lesson. Don’t fail twice.` | identical, `Don&rsquo;t` | match |
| Letter-Read | paragraph 4 | copy | `I'll see you tonight, steadier.` — straight `'` | `I’ll` — U+2019 | **MISMATCH** (see Findings 3) |
| Letter-Read | signoff | font-size / weight / color | 16px / 600 / `#1D1C1A` | 16 / `sans('600')` / `#1D1C1A` (letter.tsx:552) | match |
| Letter-Read | signoff | margin-top | 20px, collapsing against the paragraph's 26 → effective gap 26 | `marginTop: 0`; the paragraph's `marginBottom:26` is the whole gap | match |
| Letter-Read | signoff | copy | `— the you who makes it out` | identical | match |
| Letter-Read | signature | svg size / viewBox | 150 × 12 / `0 0 150 12` | 150 × 12 / `0 0 150 12` (letter.tsx:553) | match |
| Letter-Read | signature | margin-top | 4px | 4 | match |
| Letter-Read | signature | path d | `M2 8 C 34 2, 58 10, 86 6 S 132 4, 148 7` | identical | match |
| Letter-Read | signature | stroke / width / fill / linecap | `rgba(38,38,31,0.5)` / 1.6 / none / round | identical | match |
| Letter-Read | keep pill | left / right | 24px / 24px | 24 / 24 (letter.tsx:519) | match |
| Letter-Read | keep pill | bottom | 88px | 88 | match |
| Letter-Read | keep pill | height | 54px | 54 (`minHeight:54` too) | match |
| Letter-Read | keep pill | border-radius | 27px | 27 | match |
| Letter-Read | keep pill | background | `#131313` | `#131313` | match |
| Letter-Read | keep pill | flex direction / align / justify | row (default) / center / center | `'row'` / center / center | match |
| Letter-Read | keep pill | gap | 9px | 9 | match |
| Letter-Read | bookmark icon | size / viewBox / fill | 16 × 16 / `0 0 24 24` / none | 16 × 16 / `0 0 24 24` / none (letter.tsx:490) | match |
| Letter-Read | bookmark icon | path d | `M6 4.4h12a1 1 0 0 1 1 1v14.3a.8.8 0 0 1-1.27.65L12 16.7l-5.73 3.65A.8.8 0 0 1 5 19.7V5.4a1 1 0 0 1 1-1z` | identical | match |
| Letter-Read | bookmark icon | stroke / width / linejoin | `#FFFFFF` / 2 / round | `#FFFFFF` / 2 / round | match |
| Letter-Read | keep label | size / weight / letter-spacing / color | 16.5px / 600 / 0.2px / `#FFFFFF` | 16.5 / 600 / 0.2 / `#FFFFFF` | match |
| Letter-Read | keep label | copy | `Tuck it into your Log` | identical (letter.tsx:130) | match |
| Letter-Read | close link | left / right / bottom | 0 / 0 / 44px | 0 / 0 / 44 (`secondaryBottom` default) | match |
| Letter-Read | close link | align / size / weight / color | center / 14.5px / 500 / `#8B8882` | center / 14.5 / 500 / `#8B8882` | match |
| Letter-Read | close link | copy | `Close` | `secondary="Close"` (letter.tsx:130) | match |
| Letter-Read | — | states drawn | one (resting, scrolled to top) | one | match |

---

## Frame 4 — Medallion-Letter

`src/app/medallion-post.tsx`, `phase='read'` → the same `MailSheet` / `LetterBody` / `LetterFooter`
furniture from `letter.tsx`, two paragraphs, no signoff.

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Medallion-Letter | frame | width × height | 393 × 852 | device | match |
| Medallion-Letter | frame | background | `#EDECE7` | `'#EDECE7'` (medallion-post.tsx:59, read branch) | match |
| Medallion-Letter | frame | overflow / font-family | hidden / `-apple-system,'SF Pro Text',…` | root `View` / iOS `'System'` | match |
| Medallion-Letter | frame | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | n/a (canvas chrome) |
| Medallion-Letter | status bar | height / ink | 54px / `#1D1C1A` | OS-drawn; `StatusBar style="dark"` | n/a (canvas chrome) / match |
| Medallion-Letter | sheet | left / right / top / bottom | 0 / 0 / 52px / 0 | 0 / 0 / `-2` from safe-area top / 0 | match |
| Medallion-Letter | sheet | border-radius | `24px 24px 0 0` | 24 / 24 / 0 / 0 | match |
| Medallion-Letter | sheet | background / overflow | `#F4F3F0` / hidden | `#F4F3F0` / hidden | match |
| Medallion-Letter | sheet grain | inset / opacity / pointer-events | 0 / 0.07 / none | 0 / 0.07 / none | match |
| Medallion-Letter | sheet grain | tiling | repeat at 96 × 96 | `contentFit="cover"` | **MISMATCH** |
| Medallion-Letter | grabber row | left / right / top / justify | 0 / 0 / 12px / center | 0 / 0 / 12 / center | match |
| Medallion-Letter | grabber | size / radius / background | 38 × 5 / 3px / `rgba(19,19,19,0.16)` | 38 × 5 / 3 / `rgba(19,19,19,0.16)` | match |
| Medallion-Letter | close X | size / viewBox / right / top | 20 × 20 / `0 0 20 20` / 22px / 26px | identical | match |
| Medallion-Letter | close X | d / stroke / width / linecap | `M3 3l14 14M17 3L3 17` / `#55534E` / 2 / round | identical | match |
| Medallion-Letter | body | left / right / top / bottom | 34 / 34 / 84px / 160px | 34 / 34 / 84 / 160 (default, medallion-post.tsx:85) | match |
| Medallion-Letter | body | overflow | auto | `ScrollView` | match |
| Medallion-Letter | salutation | size / weight / letter-spacing / color | 22px / 600 / 0.6px / `#1D1C1A` | 22 / 600 / 0.6 / `#1D1C1A` | match |
| Medallion-Letter | salutation | margin | `0 0 24px` | `marginBottom:24` | match |
| Medallion-Letter | salutation | copy | `Dear Sam,` | `Dear {name},` (medallion-post.tsx:86) | match |
| Medallion-Letter | paragraph ×2 | size / weight | 15.5px / 400 | 15.5 / `sans('400')` | match |
| Medallion-Letter | paragraph ×2 | line-height | 1.8 (= 27.9) | 27.9 | match |
| Medallion-Letter | paragraph ×2 | color / margin | `#3A3934` / `0 0 26px` | `#3A3934` / `marginBottom:26` | match |
| Medallion-Letter | paragraph ×2 | text-wrap | pretty | pretty on web | match |
| Medallion-Letter | paragraph 1 | copy | `Last night an urge rose, crested, and left without you. This morning you opened the app anyway — logged it, stayed. Most men vanish for a week after a night like that. You came back.` | identical (medallion-post.tsx:88) | match |
| Medallion-Letter | paragraph 2 | copy | `The return is the strongest predictor there is — stronger than any count. This one isn't for resisting. It's for coming back.` — straight `'` twice | same words, U+2019 twice | **MISMATCH** (see Findings 3) |
| Medallion-Letter | — | signoff / signature | not drawn | not rendered | match |
| Medallion-Letter | keep pill | left / right / bottom | 24 / 24 / 88px | 24 / 24 / 88 | match |
| Medallion-Letter | keep pill | height / radius / background | 54px / 27px / `#131313` | 54 / 27 / `#131313` | match |
| Medallion-Letter | keep pill | flex / gap | row, centred / 9px | row, centred / 9 | match |
| Medallion-Letter | bookmark icon | size / viewBox / d | 16 × 16 / `0 0 24 24` / `M6 4.4h12a1 1 0 0 1 1 1v14.3a.8.8 0 0 1-1.27.65L12 16.7l-5.73 3.65A.8.8 0 0 1 5 19.7V5.4a1 1 0 0 1 1-1z` | identical | match |
| Medallion-Letter | bookmark icon | stroke / width / linejoin | `#FFFFFF` / 2 / round | identical | match |
| Medallion-Letter | keep label | size / weight / letter-spacing / color | 16.5px / 600 / 0.2px / `#FFFFFF` | identical | match |
| Medallion-Letter | keep label | copy | `Tuck it into your Log` | identical (medallion-post.tsx:95) | match |
| Medallion-Letter | secondary | left / right / bottom | 0 / 0 / 44px | 0 / 0 / 44 | match |
| Medallion-Letter | secondary | align / size / weight / color | center / 14.5px / 500 / `#8B8882` | center / 14.5 / 500 / `#8B8882` | match |
| Medallion-Letter | secondary | copy | `Open the enclosure` | identical (medallion-post.tsx:95) | match |
| Medallion-Letter | — | states drawn | one (resting) | one | match |

---

## Frame 5 — Yearly-Drop

`src/app/drop.tsx`, `phase='offer'` → `MailSheet` + `Offer`. Tops are sheet-relative.

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Yearly-Drop | frame | width × height | 393 × 852 | device | match |
| Yearly-Drop | frame | background | `#EDECE7` | `'#EDECE7'` (drop.tsx:74) | match |
| Yearly-Drop | frame | overflow / font-family | hidden / `-apple-system,'SF Pro Text',…` | root `View` / iOS `'System'` | match |
| Yearly-Drop | frame | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | n/a (canvas chrome) |
| Yearly-Drop | status bar | height / ink | 54px / `#1D1C1A` | OS-drawn; `StatusBar style="dark"` (drop.tsx:75) | n/a (canvas chrome) / match |
| Yearly-Drop | sheet | left / right / top / bottom | 0 / 0 / 52px / 0 | 0 / 0 / `-2` from safe-area top / 0 | match |
| Yearly-Drop | sheet | border-radius / background / overflow | `24px 24px 0 0` / `#F4F3F0` / hidden | 24 / 24 / 0 / 0, `#F4F3F0`, hidden | match |
| Yearly-Drop | sheet grain | inset / opacity / pointer-events | 0 / 0.07 / none | 0 / 0.07 / none | match |
| Yearly-Drop | sheet grain | tiling | repeat at 96 × 96 | `contentFit="cover"` | **MISMATCH** |
| Yearly-Drop | grabber row | left / right / top / justify | 0 / 0 / 12px / center | 0 / 0 / 12 / center | match |
| Yearly-Drop | grabber | size / radius / background | 38 × 5 / 3px / `rgba(19,19,19,0.16)` | identical | match |
| Yearly-Drop | close X | size / viewBox / right / top | 20 × 20 / `0 0 20 20` / 22px / 26px | identical | match |
| Yearly-Drop | close X | d / stroke / width / linecap | `M3 3l14 14M17 3L3 17` / `#55534E` / 2 / round | identical | match |
| Yearly-Drop | title | left / right / top | 0 / 0 / 112px | 0 / 0 / 112 (drop.tsx:95) | match |
| Yearly-Drop | title | text-align | center | `center` prop | match |
| Yearly-Drop | title | font-size / weight | 26px / 500 | 26 / `sans('500')` | match |
| Yearly-Drop | title | letter-spacing / line-height | -0.2px / 33px | -0.2 / 33 | match |
| Yearly-Drop | title | color | `#1D1C1A` | `#1D1C1A` | match |
| Yearly-Drop | title | copy | `The year, at a drop` | identical | match |
| Yearly-Drop | subline | left / right / top | 56px / 56px / 158px | 56 / 56 / 158 (drop.tsx:98) | match |
| Yearly-Drop | subline | align / size / weight | center / 14.5px / 400 | center / 14.5 / `sans('400')` | match |
| Yearly-Drop | subline | line-height / color | 21px / `#8B8882` | 21 / `#8B8882` | match |
| Yearly-Drop | subline | text-wrap | balance | `pretty` on web | **MISMATCH** (web only) |
| Yearly-Drop | subline | copy | `One payment covers all twelve months.` | identical | match |
| Yearly-Drop | diagram frame | left / right / top / height | 36px / 36px / 232px / 206px | 36 / 36 / 232 / 206 (drop.tsx:102) | match |
| Yearly-Drop | diagram glow | left / margin-left / top | 50% / -85px / -24px | `'50%'` / -85 / -24 (drop.tsx:104) | match |
| Yearly-Drop | diagram glow | width × height / radius | 170 × 170 / 50% | 170 × 170 / `Ellipse rx 85 ry 85` | match |
| Yearly-Drop | diagram glow | stop 1 | `rgba(226,186,120,0.38)` @ 0 | `#E2BA78` 0.38 @ 0 | match |
| Yearly-Drop | diagram glow | stop 2 | `rgba(226,186,120,0)` @ 75% | `#E2BA78` 0 @ 0.75 | match |
| Yearly-Drop | diagram glow | filter | `blur(4px)` | none | MISMATCH (platform) |
| Yearly-Drop | laurel mark | left / margin-left / top | 50% / -32px / 2px | `'50%'` / -32 / 2 (drop.tsx:114) | match |
| Yearly-Drop | laurel mark | width × height | 64 × 64 | 64 × 64 | match |
| Yearly-Drop | laurel mark | object-fit / display | contain / block | `contentFit="contain"` | match |
| Yearly-Drop | rays | width / height | 100% (= 321 interior) / 58 | `width - 72` (= 321 at 393) / 58 (drop.tsx:117) | match |
| Yearly-Drop | rays | viewBox / preserveAspectRatio | `0 0 321 58` / none | `0 0 321 58` / `"none"` | match |
| Yearly-Drop | rays | left / top | 0 / 70px | 0 / 70 | match |
| Yearly-Drop | rays | path d | `M160.5 0 C160.5 20 40 24 12 50 M160.5 0 C160.5 20 281 24 309 50 M160.5 0 C160.5 24 104 28 78 52 M160.5 0 C160.5 24 217 28 243 52 M160.5 0 L160.5 52` | identical (drop.tsx:119) | match |
| Yearly-Drop | rays | stroke / width / fill | `rgba(19,19,19,0.15)` / 1.5 / none | identical | match |
| Yearly-Drop | rays | stroke-dasharray / linecap | `1 6` / round | `"1 6"` / round | match |
| Yearly-Drop | month row | left / right / top | 0 / 0 / 130px | 0 / 0 / 130 (drop.tsx:128) | match |
| Yearly-Drop | month row | display / justify / gap | flex / center / 8px | row / center / 8 | match |
| Yearly-Drop | month chip ×12 | count | 12 | `Array.from({length: 12})` | match |
| Yearly-Drop | month chip ×12 | width × height | 19 × 19 | 19 × 19 | match |
| Yearly-Drop | month chip ×12 | border-radius | 6px | 6 | match |
| Yearly-Drop | month chip ×12 | background | `#131313` | `#131313` | match |
| Yearly-Drop | Jan label | left / top | 0 / 160px | 0 / 160 (drop.tsx:134) | match |
| Yearly-Drop | Jan label | size / weight / color | 11.5px / 500 / `#B0AEA8` | 11.5 / `sans('500')` / `#B0AEA8` | match |
| Yearly-Drop | Jan label | copy | `Jan` | `Jan` | match |
| Yearly-Drop | Dec label | right / top | 0 / 160px | 0 / 160 (drop.tsx:135) | match |
| Yearly-Drop | Dec label | size / weight / color / copy | 11.5px / 500 / `#B0AEA8` / `Dec` | identical | match |
| Yearly-Drop | price row | left / right / top | 0 / 0 / 494px | 0 / 0 / 494 (drop.tsx:138) | match |
| Yearly-Drop | price row | display / align-items / justify / gap | flex / baseline / center / 12px | row / `'baseline'` / center / 12 | match |
| Yearly-Drop | struck price | size / weight | 17px / 500 | 17 / `sans('500')` | match |
| Yearly-Drop | struck price | color | `#A5A29B` | `#A5A29B` | match |
| Yearly-Drop | struck price | text-decoration | line-through | `textDecorationLine:'line-through'` | match |
| Yearly-Drop | struck price | copy | `$39.99` | `FULL_PRICE = '$39.99'` (drop.tsx:30) | match |
| Yearly-Drop | drop price | font-size / weight | 46px / 600 | 46 / `sans('600')` | match |
| Yearly-Drop | drop price | letter-spacing | -0.5px | -0.5 | match |
| Yearly-Drop | drop price | line-height | 1 (= 46) | 46 | match |
| Yearly-Drop | drop price | color | `#131313` | `#131313` | match |
| Yearly-Drop | drop price | copy | `$26.99` | `DROP_PRICE = '$26.99'` (drop.tsx:31) | match |
| Yearly-Drop | per-year | size / weight / color / copy | 14px / 500 / `#8B8882` / `/year` | identical | match |
| Yearly-Drop | billed chip row | left / right / top / justify | 0 / 0 / 556px / center | 0 / 0 / 556 / center (drop.tsx:144) | match |
| Yearly-Drop | billed chip | height / border-radius | 30px / 15px | 30 / 15 | match |
| Yearly-Drop | billed chip | background | `#FFFFFF` | `#FFFFFF` | match |
| Yearly-Drop | billed chip | box-shadow | `0 0 0 1px rgba(0,0,0,0.1)` | same string | match |
| Yearly-Drop | billed chip | padding | `0 14px` | `paddingHorizontal: 14` | match |
| Yearly-Drop | billed chip | align-items | center | `justifyContent:'center'` on a 30-high box | match |
| Yearly-Drop | billed chip | size / weight / color | 12.5px / 600 / `#55534E` | 12.5 / `sans('600')` / `#55534E` | match |
| Yearly-Drop | billed chip | copy | `Billed once · $2.25 a month` | identical (drop.tsx:146) | match |
| Yearly-Drop | CTA | left / right / bottom | 24px / 24px / 96px | 24 / 24 / 96 (drop.tsx:150) | match |
| Yearly-Drop | CTA | height / border-radius | 58px / 29px | 58 / 29 | match |
| Yearly-Drop | CTA | background / flex | `#131313` / centred | `#131313` / centred | match |
| Yearly-Drop | CTA label | size / weight / letter-spacing / color | 16.5px / 600 / 0.2px / `#FFFFFF` | identical | match |
| Yearly-Drop | CTA label | copy | `Claim the year — $26.99` | `Claim the year — {DROP_PRICE}` | match |
| Yearly-Drop | later link | left / right / bottom | 0 / 0 / 56px | 0 / 0 / 56 (drop.tsx:166) | match |
| Yearly-Drop | later link | align / size / weight / color | center / 14px / 500 / `#8B8882` | identical | match |
| Yearly-Drop | later link | copy | `Maybe later` | `Maybe later` | match |
| Yearly-Drop | — | states drawn | one (resting) | one | match |

---

## Frame 6 — Drop-Received

`src/app/drop.tsx`, `phase='claimed'` → `MailArrival` + `YearTile`.

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Drop-Received | frame | width × height | 393 × 852 | device | match |
| Drop-Received | frame | background | `#F4F3F0` | `'#F4F3F0'` (drop.tsx:57) | match |
| Drop-Received | frame | overflow / font-family | hidden / `-apple-system,'SF Pro Text',…` | root `View` / iOS `'System'` | match |
| Drop-Received | frame | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | n/a (canvas chrome) |
| Drop-Received | grain | inset / opacity / pointer-events | 0 / 0.07 / none | 0 / 0.07 / none | match |
| Drop-Received | grain | tiling | repeat at 96 × 96 | `contentFit="cover"` | **MISMATCH** |
| Drop-Received | wash wrapper | inset / overflow / pointer-events | 0 / hidden / none | same | match |
| Drop-Received | wash top | left / top / width / height | -15% / -190px / 130% / 300px | `-width*0.15` / -190 / `width*1.3` / 300 | match |
| Drop-Received | wash top | stops | `rgba(180,170,150,0.32)` @ 0, `0.1` @ 55%, `0` @ 75% | `#B4AA96` 0.32 / 0.1 @ 0.55 / 0 @ 0.75 | match |
| Drop-Received | wash top | filter | `blur(5px)` | none | MISMATCH (platform) |
| Drop-Received | wash bottom | left / margin-left / bottom / size | 50% / -260px / -260px / 520 × 520 | identical | match |
| Drop-Received | wash bottom | stops | `rgba(255,236,196,0.4)` @ 0, `0.18` @ 45%, `0` @ 72% | `#FFECC4` 0.4 / 0.18 @ 0.45 / 0 @ 0.72 | match |
| Drop-Received | status bar | height / ink | 54px / `#1D1C1A` | OS-drawn; `StatusBar style="dark"` | n/a (canvas chrome) / match |
| Drop-Received | close X | size / viewBox / right / top | 18 × 18 / `0 0 18 18` / 20px / 66px (app 12) | 18 × 18 / `0 0 18 18` / 20 / 12 | match |
| Drop-Received | close X | d / stroke / width / linecap | `M3 3l12 12M15 3L3 15` / `#55534E` / 2.2 / round | identical | match |
| Drop-Received | art frame | left / margin-left / top / size | 50% / -130px / 160px (app 106) / 260 × 260 | `'50%'` / -130 / 106 / 260 × 260 | match |
| Drop-Received | tile glow | left / top | 30px / 20px | 30 / 20 (drop.tsx:187) | match |
| Drop-Received | tile glow | width × height / radius | 200 × 200 / 50% | 200 × 200 / `Ellipse rx 100 ry 100` | match |
| Drop-Received | tile glow | stop 1 | `rgba(226,186,120,0.55)` @ 0 | `#E2BA78` 0.55 @ 0 | match |
| Drop-Received | tile glow | stop 2 | `rgba(226,186,120,0)` @ 74% | `#E2BA78` 0 @ 0.74 | match |
| Drop-Received | tile glow | filter | `blur(6px)` | none | MISMATCH (platform) |
| Drop-Received | contact shadow | left / top | 52px / 230px | 52 / 230 (drop.tsx:196) | match |
| Drop-Received | contact shadow | width × height / radius | 156 × 16 / 50% | 156 × 16 / `Ellipse rx 78 ry 8` | match |
| Drop-Received | contact shadow | fill | flat `rgba(0,0,0,0.11)` | radial ramp 0.11 → 0.055 @ 0.6 → 0 @ 1 | MISMATCH (platform) |
| Drop-Received | contact shadow | filter | `blur(6px)` | none | MISMATCH (platform) |
| Drop-Received | year tile | left / top | 62px / 52px | 62 / 52 (drop.tsx:207) | match |
| Drop-Received | year tile | width × height | 136 × 136 | 136 × 136 | match |
| Drop-Received | year tile | border-radius | 32px ×4 | 32 | match |
| Drop-Received | year tile | background | `#131313` | `#131313` | match |
| Drop-Received | year tile | inner hairline | `inset 0 0 0 1.5px rgba(244,243,240,0.14)` | same string | match |
| Drop-Received | year tile | drop shadow | `0 14px 30px rgba(30,28,24,0.35)` | same string | match |
| Drop-Received | year tile | transform | `rotate(-3deg)` | `[{ rotate: '-3deg' }]` | match |
| Drop-Received | year tile | flex-direction / align / justify | column / center / center | `'column'` / center / center | match |
| Drop-Received | year tile | gap | 10px | 10 | match |
| Drop-Received | tile mark | width × height | 58 × 58 | 58 × 58 (drop.tsx:223) | match |
| Drop-Received | tile mark | object-fit / display | contain / block | `contentFit="contain"` | match |
| Drop-Received | tile mark | filter | `invert(1) brightness(1.6)` | `tintColor="#FFFFFF"` — a flat tint; a per-pixel invert+lift of the mark's darkest ink clamps to `#FFFFFF`, so any internal tone in the webp is flattened | MISMATCH (platform) |
| Drop-Received | tile label | font-size / weight | 12px / 600 | 12 / `sans('600')` | match |
| Drop-Received | tile label | letter-spacing | 2.5px | 2.5 | match |
| Drop-Received | tile label | color | `rgba(244,243,240,0.65)` | `rgba(244,243,240,0.65)` | match |
| Drop-Received | tile label | margin-right | -2.5px | -2.5 | match |
| Drop-Received | tile label | text-transform | none (copy already caps) | string literal `'THE YEAR'` | match |
| Drop-Received | tile label | copy | `THE YEAR` | `THE YEAR` | match |
| Drop-Received | title | left / right / top | 36 / 36 / 472px (app 418) | 36 / 36 / 418 | match |
| Drop-Received | title | align / size / weight | center / 24px / 500 | center / 24 / `sans('500')` | match |
| Drop-Received | title | line-height / letter-spacing / color | 32px / -0.1px / `#1D1C1A` | 32 / -0.1 / `#1D1C1A` | match |
| Drop-Received | title | text-wrap | balance | `pretty` on web | **MISMATCH** (web only) |
| Drop-Received | title | copy | `You received a drop.` | identical (drop.tsx:61) | match |
| Drop-Received | sub | left / right / top | 44 / 44 / 522px (app 468) | 44 / 44 / 468 | match |
| Drop-Received | sub | align / size / weight / line-height / color | center / 15.5px / 400 / 23px / `#55534E` | identical | match |
| Drop-Received | sub | text-wrap | pretty | pretty on web | match |
| Drop-Received | sub | copy | `One drop covers the year — twelve months of VICI, billed once.` | identical (drop.tsx:62) | match |
| Drop-Received | primary pill | left / right / top | 24 / 24 / 688px | 24 / 24 / `bottom:108` | match |
| Drop-Received | primary pill | height / radius / background / flex | 56px / 28px / `#131313` / centred | identical | match |
| Drop-Received | primary label | size / weight / letter-spacing / color | 17px / 600 / 0.2px / `#FFFFFF` | identical | match |
| Drop-Received | primary label | copy | `Begin the year` | identical (drop.tsx:63) | match |
| Drop-Received | secondary | left / right / top | 0 / 0 / 764px | 0 / 0 / `bottom:70` | match |
| Drop-Received | secondary | align / size / weight / color | center / 15px / 500 / `#8B8882` | identical | match |
| Drop-Received | secondary | copy | `See the receipt` | identical (drop.tsx:64) | match |
| Drop-Received | — | eyebrow / chip / field / halo | none drawn | undefined on this call | match |
| Drop-Received | — | states drawn | one (resting) | one | match |

---

## Frame 7 — Detail-Paper

`src/app/medallions/[key].tsx` with `tier=paper`, plus `KKMedallion` from
`src/components/keepsakes/Medallion.tsx`. Tops carried as canvas − 54.

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Detail-Paper | frame | width × height | 393 × 852 | device | match |
| Detail-Paper | frame | background | `#F4F3F0` (flat) | `SKIN.paper.page = '#F4F3F0'` ([key].tsx:66) | match |
| Detail-Paper | frame | overflow / font-family | hidden / `-apple-system,'SF Pro Text',…` | root `View` / iOS `'System'` | match |
| Detail-Paper | frame | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | n/a (canvas chrome) |
| Detail-Paper | board wrapper | inset / overflow / pointer-events | 0 / hidden / none | same ([key].tsx:152) | match |
| Detail-Paper | glow | count | none drawn | `glows: []` | match |
| Detail-Paper | grain | layer count | 2 (one inside the wrapper, one after it) | `noiseLayers: 2` ([key].tsx:62) — both inside the wrapper, same stacking result | match |
| Detail-Paper | grain | opacity | 0.07 on both layers | `noise: 0.07` | match |
| Detail-Paper | grain | tiling | repeat at 96 × 96 | `contentFit="cover"` | **MISMATCH** |
| Detail-Paper | status bar | height / ink | 54px / `#1D1C1A` | OS-drawn; `StatusBar style="dark"` (`bar:'dark'`) | n/a (canvas chrome) / match |
| Detail-Paper | back chevron | left / top | 16px / 64px (app 10) | 16 / 10 ([key].tsx:178) | match |
| Detail-Paper | back chevron | svg size / viewBox | 11 × 19 / `0 0 11 19` | 11 × 19 / `0 0 11 19` | match |
| Detail-Paper | back chevron | path d | `M9.5 1.5L2 9.5l7.5 8` | identical | match |
| Detail-Paper | back chevron | fill / stroke | none / `#55534E` | none / `skin.chrome = '#55534E'` | match |
| Detail-Paper | back chevron | stroke-width | 2.4 | 2.4 | match |
| Detail-Paper | back chevron | linecap / linejoin | round / round | round / round | match |
| Detail-Paper | back chevron | wrapper gap | 9px (inert — one child) | not set (one child) | match |
| Detail-Paper | back chevron | z-index | 20 | DOM order: first child of the scroll box | match |
| Detail-Paper | page dots | right / top | 20px / 72px (app 18) | 20 / 18 ([key].tsx:185) | match |
| Detail-Paper | page dots | display / gap | flex / 4.5px | row / 4.5 | match |
| Detail-Paper | page dots | count | 3 | `[0,1,2]` | match |
| Detail-Paper | page dots | width × height | 4.5 × 4.5 | 4.5 × 4.5 | match |
| Detail-Paper | page dots | border-radius | 50% | 2.25 | match |
| Detail-Paper | page dots | background | `#55534E` | `skin.chrome = '#55534E'` | match |
| Detail-Paper | page dots | z-index | 6 (inert — nothing overlaps) | DOM order | match |
| Detail-Paper | disc mount | left / margin-left / top | 50% / -75px / 128px (app 74) | `left:0,right:0,alignItems:'center'` / 74 ([key].tsx:192) | match |
| Detail-Paper | disc mount | width × height | 150 × 150 | `size={150}` | match |
| Detail-Paper | disc mount | border-radius / overflow | 50% / hidden | `borderRadius: 9999`; disc clipped by `ClipPath circle r 50` | match |
| Detail-Paper | disc mount | hairline | `0 0 0 1.5px rgba(0,0,0,0.2)` | same string ([key].tsx:193) | match |
| Detail-Paper | disc mount | board ring | `0 0 0 7px #F4F3F0` | `0 0 0 7px ${skin.mount}` = `#F4F3F0` | match |
| Detail-Paper | disc mount | outer ring | `0 0 0 8.5px rgba(0,0,0,0.16)` | same string | match |
| Detail-Paper | disc face | background | `linear-gradient(180deg, #F1F0EB 0%, #ECEAE3 100%)` | stock gradient `#F1F0EB` → `#ECEAE3`, x1/y1 0 → x2 0 y2 1 (Medallion.tsx:50, 370) | match |
| Detail-Paper | dune 1 | box | left -25%, right -25%, top 64%, height 80% | arc from x -25 to 125, crown y 64, foot y 144 | match |
| Detail-Paper | dune 1 | border-radius | `50% 50% 0 0 / 46% 46% 0 0` → rx 75, ry 36.8 | `A75 36.8 0 0 1` (Medallion.tsx:425) | match |
| Detail-Paper | dune 1 | path | — | `M-25 100.8 A75 36.8 0 0 1 125 100.8 L125 144 L-25 144 Z` | match |
| Detail-Paper | dune 1 | background | `#DEDDD6` | `dunes[0] = '#DEDDD6'` | match |
| Detail-Paper | dune 2 | box | left -45%, right -15%, top 78%, height 80% | arc from x -45 to 115, crown y 78, foot y 158 | match |
| Detail-Paper | dune 2 | border-radius | `50% 50% 0 0 / 40% 40% 0 0` → rx 80, ry 32 | `A80 32 0 0 1` (Medallion.tsx:426) | match |
| Detail-Paper | dune 2 | path | — | `M-45 110 A80 32 0 0 1 115 110 L115 158 L-45 158 Z` | match |
| Detail-Paper | dune 2 | background | `#CFCEC7` | `dunes[1] = '#CFCEC7'` | match |
| Detail-Paper | disc | glare layer | not drawn on paper | skipped — `face.kind === 'stock'` (Medallion.tsx:427) | match |
| Detail-Paper | disc | sheen layer | not drawn | `sheen: false` | match |
| Detail-Paper | disc | inner rim / seat | not drawn | skipped with the struck branch | match |
| Detail-Paper | device svg | viewBox / inset / size | `0 0 100 100` / 0 / 100% × 100% | `viewBox="0 0 100 100"`, 150 × 150 | match |
| Detail-Paper | device gradient | id / axis | `vzG`, x1 0 y1 0 x2 0 y2 1 | `kkv-*`, same axis (Medallion.tsx:364) | match |
| Detail-Paper | device gradient | stops | `#4A4843` @ 0, `#1D1C19` @ 1 | identical | match |
| Detail-Paper | device ground | ellipse cx / cy / rx / ry | 48 / 72 / 16 / 3 | 48 / 72 / 16 / 3 (Medallion.tsx:177) | match |
| Detail-Paper | device ground | fill | `rgba(40,38,32,0.14)` | `GROUND = 'rgba(40,38,32,0.14)'` | match |
| Detail-Paper | device staff | rect x / y / w / h / rx | 44 / 22 / 4.5 / 48 / 2.2 | identical (Medallion.tsx:178) | match |
| Detail-Paper | device staff | fill | `#8A857C` | `variant==='detail' → '#8A857C'` (Medallion.tsx:441) | match |
| Detail-Paper | device banner | path d | `M50 24 C57 21.5 61 25.5 69 24 L69 37 C61 38.5 57 34.5 50 40 Z` | identical (Medallion.tsx:179) | match |
| Detail-Paper | device banner | fill | `url(#vzG)` | `url(#kkv-*)` | match |
| Detail-Paper | disc | progress arc | not drawn | `progress` null on this call | match |
| Detail-Paper | disc | sun | not drawn | `sun` false (default) | match |
| Detail-Paper | name | left / right / top | 24px / 24px / 326px (app 272) | 24 / 24 / 272 ([key].tsx:198) | match |
| Detail-Paper | name | text-align / size / weight | center / 26px / 600 | center / 26 / `sans('600')` | match |
| Detail-Paper | name | letter-spacing / color | -0.2px / `#1D1C1A` | -0.2 / `skin.title = '#1D1C1A'` | match |
| Detail-Paper | name | copy | `Vici` | `face.name = 'Vici'` (Medallion.tsx:516) | match |
| Detail-Paper | blurb | left / right / top | 36px / 36px / 366px (app 312) | 36 / 36 / 312 ([key].tsx:201) | match |
| Detail-Paper | blurb | align / size / weight | center / 15px / 400 | center / 15 / `sans('400')` | match |
| Detail-Paper | blurb | line-height / color | 22px / `#55534E` | 22 / `skin.body = '#55534E'` | match |
| Detail-Paper | blurb | copy | `Urges met and outlasted — the conquering half of the campaign.` | `face.long` (Medallion.tsx:518) | match |
| Detail-Paper | pill row | left / right / top / justify | 0 / 0 / 424px (app 370) / center | 0 / 0 / 370 / center ([key].tsx:206) | match |
| Detail-Paper | pill | height / border-radius | 30px / 15px | 30 / 15 | match |
| Detail-Paper | pill | background | `#FFFFFF` | `pill.bg = '#FFFFFF'` | match |
| Detail-Paper | pill | ring | `0 0 0 1px rgba(0,0,0,0.1)` | `0 0 0 1px ${pill.ring}` = `rgba(0,0,0,0.1)` | match |
| Detail-Paper | pill | padding | `0 14px` | `paddingHorizontal: 14` | match |
| Detail-Paper | pill | size / weight / color | 12.5px / 600 / `#55534E` | 12.5 / `sans('600')` / `pill.ink = '#55534E'` | match |
| Detail-Paper | pill | copy | `Not yet · first ×1` | `kkReached=0` → `Not yet · first ${kkRung(steps[0]=1)}` = `Not yet · first ×1` | match |
| Detail-Paper | card | left / right / top | 12px / 12px / 502px (app 448) | 12 / 12 / 448 ([key].tsx:213) | match |
| Detail-Paper | card | height / border-radius | 118px / 16px | 118 / 16 | match |
| Detail-Paper | card | background | `#FFFFFF` | `card.bg = '#FFFFFF'` | match |
| Detail-Paper | card | ring | `0 0 0 1px rgba(0,0,0,0.06)` | `0 0 0 1px ${card.ring}` = `rgba(0,0,0,0.06)` | match |
| Detail-Paper | card title | left / top | 20px / 18px | 20 / 18 ([key].tsx:224) | match |
| Detail-Paper | card title | size / weight / color | 15.5px / 600 / `#1D1C1A` | 15.5 / `sans('600')` / `card.title` | match |
| Detail-Paper | card title | copy | `What waits at tier one` | `reached===0 && tiered` branch ([key].tsx:141) | match |
| Detail-Paper | card body | left / right / top | 20px / 20px / 48px | 20 / 20 / 48 ([key].tsx:225) | match |
| Detail-Paper | card body | size / weight / line-height | 14px / 400 / 21px | 14 / `sans('400')` / 21 | match |
| Detail-Paper | card body | color / text-wrap | `#55534E` / pretty | `card.body = '#55534E'` / pretty on web | match |
| Detail-Paper | card body | copy | `“Nine minutes, start to finish. You watched it rise, crest, and leave without you.” — waiting at ×1.` | `` `“${stories[0]}” — waiting at ×1.` `` ([key].tsx:140) | match |
| Detail-Paper | CTA | left / right / top | 24px / 24px / 688px (app 634) | 24 / 24 / 634 ([key].tsx:229) | match |
| Detail-Paper | CTA | height / border-radius | 56px / 28px | 56 / 28 | match |
| Detail-Paper | CTA | background | `#131313` | `cta.bg = '#131313'` | match |
| Detail-Paper | CTA | flex / gap | row, centred / 10px | row, centred / 10 | match |
| Detail-Paper | CTA label | size / weight / letter-spacing / color | 16.5px / 600 / 0.2px / `#FFFFFF` | 16.5 / 600 / 0.2 / `cta.ink = '#FFFFFF'` | match |
| Detail-Paper | CTA label | copy | `Share this` | `Share this` | match |
| Detail-Paper | share icon | size / viewBox | 15 × 17 / `0 0 16 18` | 15 × 17 / `0 0 16 18` ([key].tsx:247) | match |
| Detail-Paper | share icon | path 1 d | `M8 1.5v9.5M4.7 4.6L8 1.5l3.3 3.1` | identical | match |
| Detail-Paper | share icon | path 2 d | `M4.5 8H3.4A1.9 1.9 0 0 0 1.5 9.9v4.7a1.9 1.9 0 0 0 1.9 1.9h9.2a1.9 1.9 0 0 0 1.9-1.9V9.9A1.9 1.9 0 0 0 12.6 8h-1.1` | identical | match |
| Detail-Paper | share icon | stroke / width / fill | `#FFFFFF` / 1.9 / none | `cta.ink` / 1.9 / none | match |
| Detail-Paper | share icon | linecap / linejoin | round / round (path 1), round (path 2) | identical | match |
| Detail-Paper | back link | left / right / top | 0 / 0 / 764px (app 710) | 0 / 0 / 710 ([key].tsx:260) | match |
| Detail-Paper | back link | align / size / weight / color | center / 14.5px / 500 / `#55534E` | center / 14.5 / `sans('500')` / `back = '#55534E'` | match |
| Detail-Paper | back link | copy | `Back to medallions` | identical | match |
| Detail-Paper | — | states drawn | one (unearned/paper) | one | match |

---

## Frame 8 — Detail-Bronze

Same file at `tier=bronze`. Every row restated.

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Detail-Bronze | frame | width × height | 393 × 852 | device | match |
| Detail-Bronze | frame | background | `linear-gradient(180deg, #F4EBDF 0%, #EEDEC7 100%)` | `page: ['#F4EBDF','#EEDEC7']`, `start {0,0} end {0,1}` ([key].tsx:73, 154) | match |
| Detail-Bronze | frame | overflow / font-family | hidden / `-apple-system,'SF Pro Text',…` | root `View` / iOS `'System'` | match |
| Detail-Bronze | frame | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | n/a (canvas chrome) |
| Detail-Bronze | board wrapper | inset / overflow / pointer-events | 0 / hidden / none | same | match |
| Detail-Bronze | glow | left / margin-left | 50% / -170px | `left:0,right:0,alignItems:'center'` | match |
| Detail-Bronze | glow | top | 60px (app 6) | `insets.top + 6` ([key].tsx:71, 288) | match |
| Detail-Bronze | glow | width × height | 340 × 340 | 340 × 340 | match |
| Detail-Bronze | glow | border-radius | 50% | `Ellipse rx 170 ry 170` | match |
| Detail-Bronze | glow | stop 1 | `rgba(184,127,76,0.30)` @ 0 | `#B87F4C` (= 184,127,76) opacity 0.3 @ 0 | match |
| Detail-Bronze | glow | stop 2 | `rgba(184,127,76,0)` @ 74% | `#B87F4C` opacity 0 @ 0.74 | match |
| Detail-Bronze | grain | layer count / opacity | 2 / 0.07 | 2 / 0.07 | match |
| Detail-Bronze | grain | tiling | repeat at 96 × 96 | `contentFit="cover"` | **MISMATCH** |
| Detail-Bronze | status bar | height / ink | 54px / `#1D1C1A` | OS-drawn; `StatusBar style="dark"` | n/a (canvas chrome) / match |
| Detail-Bronze | back chevron | left / top / size / viewBox | 16px / 64px (app 10) / 11 × 19 / `0 0 11 19` | 16 / 10 / 11 × 19 / `0 0 11 19` | match |
| Detail-Bronze | back chevron | d / fill / stroke / width | `M9.5 1.5L2 9.5l7.5 8` / none / `#55534E` / 2.4 | identical | match |
| Detail-Bronze | back chevron | linecap / linejoin | round / round | round / round | match |
| Detail-Bronze | page dots | right / top / gap / count | 20px / 72px (app 18) / 4.5px / 3 | 20 / 18 / 4.5 / 3 | match |
| Detail-Bronze | page dots | size / radius / background | 4.5 × 4.5 / 50% / `#55534E` | 4.5 × 4.5 / 2.25 / `#55534E` | match |
| Detail-Bronze | disc mount | left / margin-left / top / size | 50% / -75px / 128px (app 74) / 150 × 150 | centred / 74 / 150 | match |
| Detail-Bronze | disc mount | border-radius / overflow | 50% / hidden | 9999 / SVG clip | match |
| Detail-Bronze | disc mount | hairline / board ring / outer ring | `0 0 0 1.5px rgba(0,0,0,0.2)` / `0 0 0 7px #F2E8DA` / `0 0 0 8.5px rgba(0,0,0,0.16)` | same string with `mount = '#F2E8DA'` ([key].tsx:75) | match |
| Detail-Bronze | disc face | gradient centre | `circle at 36% 28%` | `cx 36 cy 28`, userSpaceOnUse (Medallion.tsx:55) | match |
| Detail-Bronze | disc face | gradient extent | default farthest-corner = √(64²+72²) = 96.3327 | `r: 96.33` | match |
| Detail-Bronze | disc face | stop 1 | `#E0A96F` @ 0 | `#E0A96F` @ 0 | match |
| Detail-Bronze | disc face | stop 2 | `#B87F4C` @ 58% | `#B87F4C` @ 0.58 | match |
| Detail-Bronze | disc face | stop 3 | `#7E5527` @ 100% | `#7E5527` @ 1 | match |
| Detail-Bronze | dune 1 | box / radius | left -25%, right -25%, top 64%, h 80%, `50% 50% 0 0 / 46% 46% 0 0` | `M-25 100.8 A75 36.8 0 0 1 125 100.8 L125 144 L-25 144 Z` | match |
| Detail-Bronze | dune 1 | background | `rgba(70,40,10,0.20)` | `dunes[0]` identical | match |
| Detail-Bronze | dune 2 | box / radius | left -45%, right -15%, top 78%, h 80%, `50% 50% 0 0 / 40% 40% 0 0` | `M-45 110 A80 32 0 0 1 115 110 L115 158 L-45 158 Z` | match |
| Detail-Bronze | dune 2 | background | `rgba(70,40,10,0.32)` | `dunes[1]` identical | match |
| Detail-Bronze | glare | gradient angle | `linear-gradient(135deg, …)` → (0,0) → (100,100) in a square box | `x1 0 y1 0 x2 100 y2 100`, userSpaceOnUse (Medallion.tsx:390) | match |
| Detail-Bronze | glare | stop 1 | `rgba(255,255,255,0.5)` @ 0% | `#FFFFFF` 0.5 @ 0 | match |
| Detail-Bronze | glare | stop 2 | `rgba(255,255,255,0)` @ 40% | `#FFFFFF` 0 @ 0.4 | match |
| Detail-Bronze | glare | stop 3 | `rgba(0,0,0,0.10)` @ 100% | `#000000` 0.1 @ 1 | match |
| Detail-Bronze | sheen | drawn? | not drawn on bronze | `sheen: false` | match |
| Detail-Bronze | inner rim | inset | 3px | `INNER.detail.inset = 3` → ring r 47.5 in disc units | match |
| Detail-Bronze | inner rim | border-radius | 50% | `Circle` | match |
| Detail-Bronze | inner rim | hairline | `inset 0 0 0 1.5px rgba(255,255,255,0.4)` | `stroke rgba(255,255,255,0.4)`, width `1.5 × (100/150)` = 1.0 disc units = 1.5px on screen | match |
| Detail-Bronze | inner rim | seat | `inset 0 -7px 12px rgba(0,0,0,0.14)` | linear wash from y 87.333 to 100, `#000` 0 → 0.14, across the full disc rather than inside the 3px inset (Medallion.tsx:404) | MISMATCH (platform) |
| Detail-Bronze | device svg | viewBox / size | `0 0 100 100` / 100% × 100% | `0 0 100 100` / 150 × 150 | match |
| Detail-Bronze | device gradient | stops | `#4A4843` @ 0, `#1D1C19` @ 1, vertical | identical | match |
| Detail-Bronze | device ground | cx / cy / rx / ry / fill | 48 / 72 / 16 / 3 / `rgba(40,38,32,0.14)` | identical | match |
| Detail-Bronze | device staff | x / y / w / h / rx / fill | 44 / 22 / 4.5 / 48 / 2.2 / `#8A857C` | identical (`variant='detail'` holds the paper grey) | match |
| Detail-Bronze | device banner | d / fill | `M50 24 C57 21.5 61 25.5 69 24 L69 37 C61 38.5 57 34.5 50 40 Z` / `url(#vzG)` | identical | match |
| Detail-Bronze | name | left / right / top / align | 24 / 24 / 326px (app 272) / center | 24 / 24 / 272 / center | match |
| Detail-Bronze | name | size / weight / letter-spacing / color | 26px / 600 / -0.2px / `#1D1C1A` | 26 / 600 / -0.2 / `#1D1C1A` | match |
| Detail-Bronze | name | copy | `Vici` | `face.name` | match |
| Detail-Bronze | blurb | left / right / top / align | 36 / 36 / 366px (app 312) / center | 36 / 36 / 312 / center | match |
| Detail-Bronze | blurb | size / weight / line-height / color | 15px / 400 / 22px / `#55534E` | 15 / 400 / 22 / `#55534E` | match |
| Detail-Bronze | blurb | copy | `Urges met and outlasted — the conquering half of the campaign.` | `face.long` | match |
| Detail-Bronze | pill row | left / right / top / justify | 0 / 0 / 424px (app 370) / center | 0 / 0 / 370 / center | match |
| Detail-Bronze | pill | height / radius / background / ring | 30px / 15px / `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.1)` | identical | match |
| Detail-Bronze | pill | padding / size / weight / color | `0 14px` / 12.5px / 600 / `#55534E` | 14 / 12.5 / 600 / `#55534E` | match |
| Detail-Bronze | pill | copy | `Tier I · ×1` | `kkReached(bronze)=1` → `Tier I · ×1` | match |
| Detail-Bronze | card | left / right / top / height / radius | 12 / 12 / 502px (app 448) / 118px / 16px | 12 / 12 / 448 / 118 / 16 | match |
| Detail-Bronze | card | background / ring | `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.06)` | identical | match |
| Detail-Bronze | card title | left / top / size / weight / color | 20 / 18 / 15.5px / 600 / `#1D1C1A` | identical | match |
| Detail-Bronze | card title | copy | `What it says` | `reached > 0` branch | match |
| Detail-Bronze | card body | left / right / top | 20 / 20 / 48 | 20 / 20 / 48 | match |
| Detail-Bronze | card body | size / weight / line-height / color | 14px / 400 / 21px / `#55534E` | identical | match |
| Detail-Bronze | card body | text-wrap | pretty | pretty on web | match |
| Detail-Bronze | card body | copy | `“Nine minutes, start to finish. You watched it rise, crest, and leave without you.”` | `` `“${stories[0]}”` `` (Medallion.tsx:522) | match |
| Detail-Bronze | CTA | left / right / top / height / radius | 24 / 24 / 688px (app 634) / 56px / 28px | identical | match |
| Detail-Bronze | CTA | background / flex / gap | `#131313` / row, centred / 10px | identical | match |
| Detail-Bronze | CTA label | size / weight / letter-spacing / color / copy | 16.5px / 600 / 0.2px / `#FFFFFF` / `Share this` | identical | match |
| Detail-Bronze | share icon | size / viewBox / two d strings / stroke / width | 15 × 17 / `0 0 16 18` / as Detail-Paper / `#FFFFFF` / 1.9 | identical | match |
| Detail-Bronze | back link | left / right / top / align | 0 / 0 / 764px (app 710) / center | 0 / 0 / 710 / center | match |
| Detail-Bronze | back link | size / weight / color / copy | 14.5px / 500 / `#55534E` / `Back to medallions` | identical | match |
| Detail-Bronze | — | states drawn | one (tier I) | one | match |

---

## Frame 9 — Detail-Silver

Same file at `tier=silver`.

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Detail-Silver | frame | width × height | 393 × 852 | device | match |
| Detail-Silver | frame | background | `linear-gradient(180deg, #F4F5F6 0%, #EBEDF0 100%)` | `page: ['#F4F5F6','#EBEDF0']`, vertical ([key].tsx:81) | match |
| Detail-Silver | frame | overflow / font-family | hidden / `-apple-system,'SF Pro Text',…` | root `View` / iOS `'System'` | match |
| Detail-Silver | frame | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | n/a (canvas chrome) |
| Detail-Silver | board wrapper | inset / overflow / pointer-events | 0 / hidden / none | same | match |
| Detail-Silver | glow | left / margin-left / top | 50% / -170px / 60px (app 6) | centred / `insets.top + 6` | match |
| Detail-Silver | glow | width × height / radius | 340 × 340 / 50% | 340 × 340 / `Ellipse rx 170 ry 170` | match |
| Detail-Silver | glow | stop 1 colour | `rgba(150,160,172,0.30)` (= `#96A0AC`) | `#969DA6` (= 150,157,166) at 0.3 ([key].tsx:77) | **MISMATCH** |
| Detail-Silver | glow | stop 2 colour | `rgba(150,160,172,0)` @ 74% | `#969DA6` at 0 @ 0.74 | **MISMATCH** |
| Detail-Silver | glow | stop 1 alpha / stop 2 position | 0.30 / 74% | 0.3 / 0.74 | match |
| Detail-Silver | grain | layer count / opacity | 2 / 0.07 | 2 / 0.07 | match |
| Detail-Silver | grain | tiling | repeat at 96 × 96 | `contentFit="cover"` | **MISMATCH** |
| Detail-Silver | status bar | height / ink | 54px / `#1D1C1A` | OS-drawn; `StatusBar style="dark"` | n/a (canvas chrome) / match |
| Detail-Silver | back chevron | left / top / size / viewBox | 16px / 64px (app 10) / 11 × 19 / `0 0 11 19` | identical | match |
| Detail-Silver | back chevron | d / fill / stroke / width / caps | `M9.5 1.5L2 9.5l7.5 8` / none / `#55534E` / 2.4 / round | identical | match |
| Detail-Silver | page dots | right / top / gap / count | 20px / 72px (app 18) / 4.5px / 3 | identical | match |
| Detail-Silver | page dots | size / radius / background | 4.5 × 4.5 / 50% / `#55534E` | 4.5 × 4.5 / 2.25 / `#55534E` | match |
| Detail-Silver | disc mount | left / margin-left / top / size | 50% / -75px / 128px (app 74) / 150 × 150 | centred / 74 / 150 | match |
| Detail-Silver | disc mount | hairline / board ring / outer ring | `0 0 0 1.5px rgba(0,0,0,0.2)` / `0 0 0 7px #F1F2F4` / `0 0 0 8.5px rgba(0,0,0,0.16)` | same string with `mount = '#F1F2F4'` ([key].tsx:82) | match |
| Detail-Silver | disc face | gradient centre / extent | `circle at 36% 28%` / farthest-corner 96.3327 | `cx 36 cy 28 r 96.33` (Medallion.tsx:60) | match |
| Detail-Silver | disc face | stop 1 | `#F2F3F5` @ 0 | `#F2F3F5` @ 0 | match |
| Detail-Silver | disc face | stop 2 | `#C6CBD1` @ 60% | `#C6CBD1` @ 0.6 | match |
| Detail-Silver | disc face | stop 3 | `#969DA6` @ 100% | `#969DA6` @ 1 | match |
| Detail-Silver | dune 1 | box / radius / background | left -25%, right -25%, top 64%, h 80%, `…/46%…` / `rgba(55,65,78,0.15)` | `M-25 100.8 A75 36.8 …` / identical fill | match |
| Detail-Silver | dune 2 | box / radius / background | left -45%, right -15%, top 78%, h 80%, `…/40%…` / `rgba(55,65,78,0.24)` | `M-45 110 A80 32 …` / identical fill | match |
| Detail-Silver | glare | angle / three stops | `135deg`, `rgba(255,255,255,0.5)` 0%, `rgba(255,255,255,0)` 40%, `rgba(0,0,0,0.10)` 100% | (0,0)→(100,100); 0.5 / 0 @ 0.4 / 0.1 @ 1 | match |
| Detail-Silver | sheen | drawn? | not drawn on silver | `sheen: false` | match |
| Detail-Silver | inner rim | inset / radius / hairline | 3px / 50% / `inset 0 0 0 1.5px rgba(255,255,255,0.4)` | ring r 47.5, stroke `rgba(255,255,255,0.4)` width 1.5px on screen | match |
| Detail-Silver | inner rim | seat | `inset 0 -7px 12px rgba(0,0,0,0.14)` | linear wash y 87.333 → 100, 0 → 0.14 | MISMATCH (platform) |
| Detail-Silver | device gradient | stops | `#4A4843` @ 0, `#1D1C19` @ 1 | identical | match |
| Detail-Silver | device ground | cx / cy / rx / ry / fill | 48 / 72 / 16 / 3 / `rgba(40,38,32,0.14)` | identical | match |
| Detail-Silver | device staff | x / y / w / h / rx / fill | 44 / 22 / 4.5 / 48 / 2.2 / `#8A857C` | identical | match |
| Detail-Silver | device banner | d / fill | `M50 24 C57 21.5 61 25.5 69 24 L69 37 C61 38.5 57 34.5 50 40 Z` / `url(#vzG)` | identical | match |
| Detail-Silver | name | left / right / top / align / size / weight / letter-spacing / color | 24 / 24 / 326px (app 272) / center / 26px / 600 / -0.2px / `#1D1C1A` | identical | match |
| Detail-Silver | name | copy | `Vici` | `face.name` | match |
| Detail-Silver | blurb | left / right / top / align / size / weight / line-height / color | 36 / 36 / 366px (app 312) / center / 15px / 400 / 22px / `#55534E` | identical | match |
| Detail-Silver | blurb | copy | `Urges met and outlasted — the conquering half of the campaign.` | `face.long` | match |
| Detail-Silver | pill row | left / right / top / justify | 0 / 0 / 424px (app 370) / center | identical | match |
| Detail-Silver | pill | height / radius / background / ring / padding | 30px / 15px / `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.1)` / `0 14px` | identical | match |
| Detail-Silver | pill | size / weight / color | 12.5px / 600 / `#55534E` | identical | match |
| Detail-Silver | pill | copy | `Tier III · ×25` | `kkReached(silver)= round(7×0.4)=3` → `Tier III · ×25` (steps[2]=25) | match |
| Detail-Silver | card | left / right / top / height / radius / background / ring | 12 / 12 / 502px (app 448) / 118px / 16px / `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.06)` | identical | match |
| Detail-Silver | card title | left / top / size / weight / color / copy | 20 / 18 / 15.5px / 600 / `#1D1C1A` / `What it says` | identical | match |
| Detail-Silver | card body | left / right / top / size / weight / line-height / color / text-wrap | 20 / 20 / 48 / 14px / 400 / 21px / `#55534E` / pretty | identical | match |
| Detail-Silver | card body | copy | `“Twenty-five behind you now — the pattern is unmistakable.”` | `` `“${stories[2]}”` `` (Medallion.tsx:524) | match |
| Detail-Silver | CTA | left / right / top / height / radius / background / gap | 24 / 24 / 688px (app 634) / 56px / 28px / `#131313` / 10px | identical | match |
| Detail-Silver | CTA label | size / weight / letter-spacing / color / copy | 16.5px / 600 / 0.2px / `#FFFFFF` / `Share this` | identical | match |
| Detail-Silver | share icon | size / viewBox / two d strings / stroke / width / caps | 15 × 17 / `0 0 16 18` / as Detail-Paper / `#FFFFFF` / 1.9 / round | identical | match |
| Detail-Silver | back link | left / right / top / align / size / weight / color / copy | 0 / 0 / 764px (app 710) / center / 14.5px / 500 / `#55534E` / `Back to medallions` | identical | match |
| Detail-Silver | — | states drawn | one (tier III) | one | match |

---

## Frame 10 — Detail-Gold

Same file at `tier=gold`. Two glows on this board.

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Detail-Gold | frame | width × height | 393 × 852 | device | match |
| Detail-Gold | frame | background | `linear-gradient(180deg, #F7EEDA 0%, #F2E2BC 100%)` | `page: ['#F7EEDA','#F2E2BC']`, vertical ([key].tsx:81) | match |
| Detail-Gold | frame | overflow / font-family | hidden / `-apple-system,'SF Pro Text',…` | root `View` / iOS `'System'` | match |
| Detail-Gold | frame | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | n/a (canvas chrome) |
| Detail-Gold | board wrapper | inset / overflow / pointer-events | 0 / hidden / none | same | match |
| Detail-Gold | glow 1 | left / margin-left | 50% / -200px | centred | match |
| Detail-Gold | glow 1 | top | 40px (app -14) | `insets.top + (-14)` ([key].tsx:84) | match |
| Detail-Gold | glow 1 | width × height / radius | 400 × 400 / 50% | 400 × 400 / `Ellipse rx 200 ry 200` | match |
| Detail-Gold | glow 1 | stop 1 | `rgba(226,186,120,0.55)` @ 0 | `#E2BA78` (= 226,186,120) 0.55 @ 0 | match |
| Detail-Gold | glow 1 | stop 2 | `rgba(226,186,120,0)` @ 74% | `#E2BA78` 0 @ 0.74 | match |
| Detail-Gold | glow 2 | left / margin-left / bottom | 50% / -260px / -220px | centred / `bottom: -220` ([key].tsx:85) | match |
| Detail-Gold | glow 2 | width × height / radius | 520 × 440 / 50% | 520 × 440 / `Ellipse rx 260 ry 220` | match |
| Detail-Gold | glow 2 | stop 1 | `rgba(255,236,196,0.6)` @ 0 | `#FFECC4` (= 255,236,196) 0.6 @ 0 | match |
| Detail-Gold | glow 2 | stop 2 | `rgba(255,236,196,0)` @ 72% | `#FFECC4` 0 @ 0.72 | match |
| Detail-Gold | grain | layer count / opacity | 2 / 0.07 | 2 / 0.07 | match |
| Detail-Gold | grain | tiling | repeat at 96 × 96 | `contentFit="cover"` | **MISMATCH** |
| Detail-Gold | status bar | height / ink | 54px / `#1D1C1A` | OS-drawn; `StatusBar style="dark"` | n/a (canvas chrome) / match |
| Detail-Gold | back chevron | left / top / size / viewBox | 16px / 64px (app 10) / 11 × 19 / `0 0 11 19` | identical | match |
| Detail-Gold | back chevron | d / fill / stroke / width / caps | `M9.5 1.5L2 9.5l7.5 8` / none / `#55534E` / 2.4 / round | identical | match |
| Detail-Gold | page dots | right / top / gap / count | 20px / 72px (app 18) / 4.5px / 3 | identical | match |
| Detail-Gold | page dots | size / radius / background | 4.5 × 4.5 / 50% / `#55534E` | 4.5 × 4.5 / 2.25 / `#55534E` | match |
| Detail-Gold | disc mount | left / margin-left / top / size | 50% / -75px / 128px (app 74) / 150 × 150 | centred / 74 / 150 | match |
| Detail-Gold | disc mount | hairline / board ring / outer ring | `0 0 0 1.5px rgba(0,0,0,0.2)` / `0 0 0 7px #F5EBD2` / `0 0 0 8.5px rgba(0,0,0,0.16)` | same string with `mount = '#F5EBD2'` ([key].tsx:82) | match |
| Detail-Gold | disc face | gradient centre / extent | `circle at 36% 28%` / farthest-corner 96.3327 | `cx 36 cy 28 r 96.33` (Medallion.tsx:65) | match |
| Detail-Gold | disc face | stop 1 | `#F8E3AC` @ 0 | `#F8E3AC` @ 0 | match |
| Detail-Gold | disc face | stop 2 | `#E7BE72` @ 58% | `#E7BE72` @ 0.58 | match |
| Detail-Gold | disc face | stop 3 | `#BC8536` @ 100% | `#BC8536` @ 1 | match |
| Detail-Gold | dune 1 | box / radius / background | left -25%, right -25%, top 64%, h 80%, `…/46%…` / `rgba(140,90,20,0.22)` | `M-25 100.8 A75 36.8 …` / identical fill | match |
| Detail-Gold | dune 2 | box / radius / background | left -45%, right -15%, top 78%, h 80%, `…/40%…` / `rgba(140,90,20,0.34)` | `M-45 110 A80 32 …` / identical fill | match |
| Detail-Gold | glare | angle / three stops | `135deg`, 0.5 white @ 0%, 0 white @ 40%, `rgba(0,0,0,0.10)` @ 100% | (0,0)→(100,100); identical stops | match |
| Detail-Gold | sheen | drawn? | not drawn on gold | `sheen: false` | match |
| Detail-Gold | inner rim | inset / radius / hairline | 3px / 50% / `inset 0 0 0 1.5px rgba(255,255,255,0.4)` | ring r 47.5, stroke `rgba(255,255,255,0.4)` at 1.5px on screen | match |
| Detail-Gold | inner rim | seat | `inset 0 -7px 12px rgba(0,0,0,0.14)` | linear wash y 87.333 → 100, 0 → 0.14 | MISMATCH (platform) |
| Detail-Gold | device gradient | stops | `#4A4843` @ 0, `#1D1C19` @ 1 | identical | match |
| Detail-Gold | device ground | cx / cy / rx / ry / fill | 48 / 72 / 16 / 3 / `rgba(40,38,32,0.14)` | identical | match |
| Detail-Gold | device staff | x / y / w / h / rx / fill | 44 / 22 / 4.5 / 48 / 2.2 / `#8A857C` | identical | match |
| Detail-Gold | device banner | d / fill | `M50 24 C57 21.5 61 25.5 69 24 L69 37 C61 38.5 57 34.5 50 40 Z` / `url(#vzG)` | identical | match |
| Detail-Gold | name | left / right / top / align / size / weight / letter-spacing / color | 24 / 24 / 326px (app 272) / center / 26px / 600 / -0.2px / `#1D1C1A` | identical | match |
| Detail-Gold | name | copy | `Vici` | `face.name` | match |
| Detail-Gold | blurb | left / right / top / align / size / weight / line-height / color | 36 / 36 / 366px (app 312) / center / 15px / 400 / 22px / `#55534E` | identical | match |
| Detail-Gold | blurb | copy | `Urges met and outlasted — the conquering half of the campaign.` | `face.long` | match |
| Detail-Gold | pill row | left / right / top / justify | 0 / 0 / 424px (app 370) / center | identical | match |
| Detail-Gold | pill | height / radius / background / ring / padding | 30px / 15px / `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.1)` / `0 14px` | identical | match |
| Detail-Gold | pill | size / weight / color | 12.5px / 600 / `#55534E` | identical | match |
| Detail-Gold | pill | copy | `Tier IV · ×100` | `kkReached(gold)= round(7×0.6)=4` → `Tier IV · ×100` (steps[3]=100) | match |
| Detail-Gold | card | left / right / top / height / radius / background / ring | 12 / 12 / 502px (app 448) / 118px / 16px / `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.06)` | identical | match |
| Detail-Gold | card title | left / top / size / weight / color / copy | 20 / 18 / 15.5px / 600 / `#1D1C1A` / `What it says` | identical | match |
| Detail-Gold | card body | left / right / top / size / weight / line-height / color / text-wrap | 20 / 20 / 48 / 14px / 400 / 21px / `#55534E` / pretty | identical | match |
| Detail-Gold | card body | copy | `“A hundred waves met and outlasted. This stopped being a fight you were unsure of a while ago.”` | `` `“${stories[3]}”` `` (Medallion.tsx:525) | match |
| Detail-Gold | CTA | left / right / top / height / radius / background / gap | 24 / 24 / 688px (app 634) / 56px / 28px / `#131313` / 10px | identical | match |
| Detail-Gold | CTA label | size / weight / letter-spacing / color / copy | 16.5px / 600 / 0.2px / `#FFFFFF` / `Share this` | identical | match |
| Detail-Gold | share icon | size / viewBox / two d strings / stroke / width / caps | 15 × 17 / `0 0 16 18` / as Detail-Paper / `#FFFFFF` / 1.9 / round | identical | match |
| Detail-Gold | back link | left / right / top / align / size / weight / color / copy | 0 / 0 / 764px (app 710) / center / 14.5px / 500 / `#55534E` / `Back to medallions` | identical | match |
| Detail-Gold | — | states drawn | one (tier IV) | one | match |

---

## Frame 11 — Detail-Platinum

Same file at `tier=platinum`. The whole board flips to night: its own chrome palette, one grain
layer at a heavier opacity, and the disc gains the raking sheen.

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Detail-Platinum | frame | width × height | 393 × 852 | device | match |
| Detail-Platinum | frame | background | `linear-gradient(180deg, #171715 0%, #26251F 100%)` | `page: ['#171715','#26251F']`, vertical ([key].tsx:89) | match |
| Detail-Platinum | frame | overflow / font-family | hidden / `-apple-system,'SF Pro Text',…` | root `View` / iOS `'System'` | match |
| Detail-Platinum | frame | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | n/a (canvas chrome) |
| Detail-Platinum | board wrapper | inset / overflow / pointer-events | 0 / hidden / none | same | match |
| Detail-Platinum | glow 1 | left / margin-left | 50% / -210px | centred | match |
| Detail-Platinum | glow 1 | top | 30px (app -24) | `insets.top + (-24)` ([key].tsx:92) | match |
| Detail-Platinum | glow 1 | width × height / radius | 420 × 420 / 50% | 420 × 420 / `Ellipse rx 210 ry 210` | match |
| Detail-Platinum | glow 1 | stop 1 | `rgba(235,240,248,0.13)` @ 0 | `#EBF0F8` (= 235,240,248) 0.13 @ 0 | match |
| Detail-Platinum | glow 1 | stop 2 | `rgba(235,240,248,0)` @ 74% | `#EBF0F8` 0 @ 0.74 | match |
| Detail-Platinum | glow 2 | left / margin-left / bottom | 50% / -280px / -240px | centred / `bottom: -240` ([key].tsx:93) | match |
| Detail-Platinum | glow 2 | width × height / radius | 560 × 460 / 50% | 560 × 460 / `Ellipse rx 280 ry 230` | match |
| Detail-Platinum | glow 2 | stop 1 | `rgba(226,186,120,0.12)` @ 0 | `#E2BA78` 0.12 @ 0 | match |
| Detail-Platinum | glow 2 | stop 2 | `rgba(226,186,120,0)` @ 72% | `#E2BA78` 0 @ 0.72 | match |
| Detail-Platinum | grain | layer count | 1 | `noiseLayers: 1` ([key].tsx:95) | match |
| Detail-Platinum | grain | opacity | 0.12 | `noise: 0.12` | match |
| Detail-Platinum | grain | tiling | repeat at 96 × 96 | `contentFit="cover"` | **MISMATCH** |
| Detail-Platinum | status bar | height | 54px | OS-drawn | n/a (canvas chrome) |
| Detail-Platinum | status bar | ink | `#F4F3F0` (time and all three glyphs) | `StatusBar style="light"` (`bar:'light'`, [key].tsx:104) | match |
| Detail-Platinum | back chevron | left / top / size / viewBox | 16px / 64px (app 10) / 11 × 19 / `0 0 11 19` | 16 / 10 / 11 × 19 / `0 0 11 19` | match |
| Detail-Platinum | back chevron | path d | `M9.5 1.5L2 9.5l7.5 8` | identical | match |
| Detail-Platinum | back chevron | fill / stroke | none / `rgba(244,243,240,0.75)` | none / `chrome: 'rgba(244,243,240,0.75)'` ([key].tsx:97) | match |
| Detail-Platinum | back chevron | stroke-width / caps | 2.4 / round, round | 2.4 / round, round | match |
| Detail-Platinum | back chevron | wrapper gap | not set on this frame (the light frames set an inert 9px) | not set | match |
| Detail-Platinum | page dots | right / top / gap / count | 20px / 72px (app 18) / 4.5px / 3 | 20 / 18 / 4.5 / 3 | match |
| Detail-Platinum | page dots | size / radius | 4.5 × 4.5 / 50% | 4.5 × 4.5 / 2.25 | match |
| Detail-Platinum | page dots | background | `rgba(244,243,240,0.75)` | `skin.chrome` | match |
| Detail-Platinum | page dots | z-index | 20 (6 on the light frames) | DOM order; nothing overlaps either way | match |
| Detail-Platinum | disc mount | left / margin-left / top / size | 50% / -75px / 128px (app 74) / 150 × 150 | centred / 74 / 150 | match |
| Detail-Platinum | disc mount | hairline / board ring / outer ring | `0 0 0 1.5px rgba(0,0,0,0.2)` / `0 0 0 7px #201F1C` / `0 0 0 8.5px rgba(0,0,0,0.16)` | same string with `mount = '#201F1C'` ([key].tsx:90) | match |
| Detail-Platinum | disc face | gradient centre | `circle at 35% 26%` | `cx 35 cy 26` (Medallion.tsx:70) | match |
| Detail-Platinum | disc face | gradient extent | default farthest-corner = √(65²+74²) = 98.4937 | `r: 98.49` | match |
| Detail-Platinum | disc face | stop 1 | `#FFFFFF` @ 0 | `#FFFFFF` @ 0 | match |
| Detail-Platinum | disc face | stop 2 | `#EDF0F4` @ 55% | `#EDF0F4` @ 0.55 | match |
| Detail-Platinum | disc face | stop 3 | `#C7CDD8` @ 100% | `#C7CDD8` @ 1 | match |
| Detail-Platinum | dune 1 | box / radius / background | left -25%, right -25%, top 64%, h 80%, `…/46%…` / `rgba(90,100,118,0.14)` | `M-25 100.8 A75 36.8 …` / identical fill | match |
| Detail-Platinum | dune 2 | box / radius / background | left -45%, right -15%, top 78%, h 80%, `…/40%…` / `rgba(90,100,118,0.22)` | `M-45 110 A80 32 …` / identical fill | match |
| Detail-Platinum | glare | angle / three stops | `135deg`, 0.5 white @ 0%, 0 white @ 40%, `rgba(0,0,0,0.10)` @ 100% | (0,0)→(100,100); identical stops | match |
| Detail-Platinum | sheen | drawn? | drawn — the only frame with it | `sheen: true` (Medallion.tsx:72) | match |
| Detail-Platinum | sheen | angle | `linear-gradient(115deg, …)` → line (-10.21, 21.92) → (110.21, 78.08) in a 100 box | `x1 -10.21 y1 21.92 x2 110.21 y2 78.08` (Medallion.tsx:396) | match |
| Detail-Platinum | sheen | stop 1 | `rgba(255,255,255,0)` @ 30% | `#FFFFFF` 0 @ 0.3 | match |
| Detail-Platinum | sheen | stop 2 | `rgba(255,255,255,0.75)` @ 42% | `#FFFFFF` 0.75 @ 0.42 | match |
| Detail-Platinum | sheen | stop 3 | `rgba(255,255,255,0)` @ 54% | `#FFFFFF` 0 @ 0.54 | match |
| Detail-Platinum | sheen | paint order | after the 135° glare, before the rim | same order (Medallion.tsx:429–432) | match |
| Detail-Platinum | inner rim | inset / radius / hairline | 3px / 50% / `inset 0 0 0 1.5px rgba(255,255,255,0.4)` | ring r 47.5, stroke `rgba(255,255,255,0.4)` at 1.5px on screen | match |
| Detail-Platinum | inner rim | seat | `inset 0 -7px 12px rgba(0,0,0,0.14)` | linear wash y 87.333 → 100, 0 → 0.14 | MISMATCH (platform) |
| Detail-Platinum | device gradient | stops | `#4A4843` @ 0, `#1D1C19` @ 1 | identical | match |
| Detail-Platinum | device ground | cx / cy / rx / ry / fill | 48 / 72 / 16 / 3 / `rgba(40,38,32,0.14)` | identical | match |
| Detail-Platinum | device staff | x / y / w / h / rx / fill | 44 / 22 / 4.5 / 48 / 2.2 / `#8A857C` | identical | match |
| Detail-Platinum | device banner | d / fill | `M50 24 C57 21.5 61 25.5 69 24 L69 37 C61 38.5 57 34.5 50 40 Z` / `url(#vzG)` | identical | match |
| Detail-Platinum | name | left / right / top / align | 24 / 24 / 326px (app 272) / center | 24 / 24 / 272 / center | match |
| Detail-Platinum | name | size / weight / letter-spacing | 26px / 600 / -0.2px | 26 / `sans('600')` / -0.2 | match |
| Detail-Platinum | name | color | `#F4F3F0` | `title: '#F4F3F0'` ([key].tsx:98) | match |
| Detail-Platinum | name | copy | `Vici` | `face.name` | match |
| Detail-Platinum | blurb | left / right / top / align | 36 / 36 / 366px (app 312) / center | 36 / 36 / 312 / center | match |
| Detail-Platinum | blurb | size / weight / line-height | 15px / 400 / 22px | 15 / `sans('400')` / 22 | match |
| Detail-Platinum | blurb | color | `rgba(244,243,240,0.75)` | `body: 'rgba(244,243,240,0.75)'` | match |
| Detail-Platinum | blurb | copy | `Urges met and outlasted — the conquering half of the campaign.` | `face.long` | match |
| Detail-Platinum | pill row | left / right / top / justify | 0 / 0 / 424px (app 370) / center | 0 / 0 / 370 / center | match |
| Detail-Platinum | pill | height / border-radius / padding | 30px / 15px / `0 14px` | 30 / 15 / 14 | match |
| Detail-Platinum | pill | background | `rgba(255,255,255,0.09)` | `pill.bg` ([key].tsx:100) | match |
| Detail-Platinum | pill | ring | `0 0 0 1px rgba(255,255,255,0.22)` | `0 0 0 1px ${pill.ring}` | match |
| Detail-Platinum | pill | size / weight | 12.5px / 600 | 12.5 / `sans('600')` | match |
| Detail-Platinum | pill | color | `rgba(244,243,240,0.55)` | `pill.ink` | match |
| Detail-Platinum | pill | copy | `Tier VII · ×1,000` | `kkReached(platinum)=7` → `Tier VII · ×1,000` (`toLocaleString('en-US')`) | match |
| Detail-Platinum | card | left / right / top / height / radius | 12 / 12 / 502px (app 448) / 118px / 16px | 12 / 12 / 448 / 118 / 16 | match |
| Detail-Platinum | card | background | `rgba(255,255,255,0.07)` | `card.bg` ([key].tsx:101) | match |
| Detail-Platinum | card | ring | `0 0 0 1px rgba(255,255,255,0.18)` | `0 0 0 1px ${card.ring}` | match |
| Detail-Platinum | card title | left / top / size / weight | 20 / 18 / 15.5px / 600 | 20 / 18 / 15.5 / 600 | match |
| Detail-Platinum | card title | color | `#F4F3F0` | `card.title` | match |
| Detail-Platinum | card title | copy | `What it says` | `reached > 0` branch | match |
| Detail-Platinum | card body | left / right / top / size / weight / line-height | 20 / 20 / 48 / 14px / 400 / 21px | identical | match |
| Detail-Platinum | card body | color | `rgba(244,243,240,0.75)` | `card.body` | match |
| Detail-Platinum | card body | text-wrap | pretty | pretty on web | match |
| Detail-Platinum | card body | copy | `“A thousand. The sea hasn’t changed. You’re just not the one it moves anymore.”` | `` `“${stories[6]}”` `` (Medallion.tsx:528), same curly apostrophes | match |
| Detail-Platinum | CTA | left / right / top / height / radius / gap | 24 / 24 / 688px (app 634) / 56px / 28px / 10px | identical | match |
| Detail-Platinum | CTA | background | `#F4F3F0` | `cta.bg = '#F4F3F0'` ([key].tsx:102) | match |
| Detail-Platinum | CTA label | size / weight / letter-spacing | 16.5px / 600 / 0.2px | 16.5 / 600 / 0.2 | match |
| Detail-Platinum | CTA label | color | `#131313` | `cta.ink = '#131313'` | match |
| Detail-Platinum | CTA label | copy | `Share this` | `Share this` | match |
| Detail-Platinum | share icon | size / viewBox | 15 × 17 / `0 0 16 18` | 15 × 17 / `0 0 16 18` | match |
| Detail-Platinum | share icon | path 1 / path 2 d | as Detail-Paper | identical | match |
| Detail-Platinum | share icon | stroke | `#131313` | `cta.ink` | match |
| Detail-Platinum | share icon | width / caps | 1.9 / round | 1.9 / round | match |
| Detail-Platinum | back link | left / right / top / align | 0 / 0 / 764px (app 710) / center | 0 / 0 / 710 / center | match |
| Detail-Platinum | back link | size / weight | 14.5px / 500 | 14.5 / `sans('500')` | match |
| Detail-Platinum | back link | color | `rgba(244,243,240,0.55)` | `back: 'rgba(244,243,240,0.55)'` ([key].tsx:103) | match |
| Detail-Platinum | back link | copy | `Back to medallions` | identical | match |
| Detail-Platinum | — | states drawn | one (tier VII) | one | match |

---

# Findings

**11 frames audited, 802 rows** — Letter-Received 123, Letter-Arrival 65, Letter-Read 79,
Medallion-Letter 37, Yearly-Drop 79, Drop-Received 61, Detail-Paper 95, Detail-Bronze 70,
Detail-Silver 50, Detail-Gold 54, Detail-Platinum 89.

Of those, **22 rows are real drift** (four distinct defects, section A) and **20 rows are
platform-limited substitutions** (nine distinct ones, section B). The remaining 760 rows match
literally, or are canvas chrome the app never builds. Ordered by how much of the screen they move.

## A. Real drift — fixable

1. **The grain is stretched, not tiled.** *(13 rows across all 11 frames)*
   Every frame declares `background-image:url('noise-dark.png')` with no `background-size`, which
   tiles the 96 × 96 file across the box. Every app surface renders it as
   `<Image … contentFit="cover">`, which scales **one** 96 × 96 copy to fill — roughly 8.9× on a
   full-screen field. The grain reads as soft blotching rather than paper tooth.
   - `src/app/letter.tsx:210` (arrival field), `:350` (envelope card), `:427` (sheet)
   - `src/app/medallions/[key].tsx:160` (both board layers)
   - Design: tiled at 96 × 96, opacity 0.07 (0.12 on Detail-Platinum). App: one copy, `cover`.
   - Fix: `resizeMode="repeat"` on an RN `Image`/`ImageBackground` — expo-image has no tiling
     `contentFit`.

2. **Detail-Silver's page glow is the wrong grey.** *(2 rows)*
   - `src/app/medallions/[key].tsx:77` — `rgb: '#969DA6'` (= 150, 157, 166).
   - Design (`Detail-Silver.html:26`): `rgba(150,160,172,0.30)` → `#96A0AC`.
   - The code borrowed the *disc's* darkest silver (`Medallion.tsx:60`, `c2: '#969DA6'`) for the
     *board's* halo. Green is 3 low and blue 6 low, so the light behind the coin is warmer and
     flatter than drawn. Bronze, gold and both platinum glows all carry their literals exactly;
     silver is the only one that drifted.

3. **Five straight apostrophes are rendered curly.** *(3 rows)*
   - `Letter-Read.html`: `you're`, `That's` (paragraph 1) and `I'll` (paragraph 4) are U+0027 in the
     frame; `src/app/letter.tsx:568, 587` renders `&rsquo;` (U+2019).
   - `Medallion-Letter.html`: `isn't`, `It's` are U+0027; `src/app/medallion-post.tsx:92` renders
     U+2019.
   - **The canvas contradicts itself here.** The same Letter-Read paragraph set writes
     `Don&rsquo;t fail twice` with a proper right single quote, and every other punctuation mark on
     both frames is an entity (`&mdash;`, `&ldquo;`, `&rdquo;`, `&rsquo;`). The evidence supports the
     app's reading — the straight quotes are frame typos — so this is listed for the record, not as
     something to change in the app.

4. **`text-wrap: balance` becomes `pretty` on web.** *(4 rows: the three arrival titles and the
   Yearly-Drop subline)*
   - `src/components/ui/AppText.tsx:128` emits `balance` only for the `hero`, `display` and `title`
     variants; these callers use the default `body` variant with an explicit `fontSize`, so they get
     `pretty`.
   - Design: `text-wrap:balance` on `Letter-Received.html:204`, `Letter-Arrival.html:204`,
     `Drop-Received.html:184`, `Yearly-Drop.html:132`.
   - Web only — native ignores the property entirely, so nothing moves on device.

## B. Platform-limited — the literal has no RN equivalent

These are carried in the code as documented substitutions. They are differences from the frame, but
not ones the current stack can close.

5. `src/app/letter.tsx:214` — top wash `filter: blur(5px)` (Letter-Received, Letter-Arrival,
   Drop-Received). App: no blur; the gradient's own falloff stands in. RN SVG has no filter.
6. `src/app/letter.tsx:317` — envelope glow `filter: blur(5px)`. Same substitution.
7. `src/app/letter.tsx:326` — envelope contact shadow: design is a flat `rgba(0,0,0,0.10)` ellipse
   blurred 6px; app draws a radial ramp `0.1 → 0.05 @ 60% → 0 @ 100%` with no blur.
8. `src/app/drop.tsx:104` — Yearly-Drop diagram glow `filter: blur(4px)`. No blur in the app.
9. `src/app/drop.tsx:187` — YearTile glow `filter: blur(6px)`. No blur in the app.
10. `src/app/drop.tsx:196` — YearTile contact shadow: flat `rgba(0,0,0,0.11)` blurred 6px; app draws
    a radial ramp `0.11 → 0.055 @ 60% → 0 @ 100%`.
11. `src/app/drop.tsx:223` — tile mark `filter: invert(1) brightness(1.6)` → `tintColor="#FFFFFF"`.
    The clamped result of invert+lift on the mark's ink is `#FFFFFF`, so the peak is right, but a
    flat tint discards any internal tone the webp carries.
12. `src/app/letter.tsx:580` — the underlined *why* run: `text-decoration-thickness:1.5px` and
    `text-underline-offset:4px` (Letter-Read). RN gives the line and its colour, neither metric.
13. `src/components/keepsakes/Medallion.tsx:404` — the disc's seat, `inset 0 -7px 12px
    rgba(0,0,0,0.14)`, on Detail-Bronze / Silver / Gold / Platinum. Redrawn as a linear wash from
    y 87.333 to 100 across the whole disc rather than an inset shadow confined to the 3px ring.

## What did not drift

Worth stating plainly, because it is most of the surface: every top, left, right, width, height,
radius, gap and padding on all eleven frames carries its literal, including the four bottom-pinned
actions whose canvas tops (688 / 764 / 88 / 44) resolve to exactly the frame's own numbers on an 852
board. Every colour except the one silver glow is exact to the hex or the rgba. Every gradient's
angle and every stop's position and alpha match, including the two computed extents
(`farthest-corner` 96.33 and 98.49) and the 115° sheen's four endpoint coordinates. Every `d` string
in every icon and device — the two closes, the chevron, the share mark, the bookmark, the crease, the
signature, the twelve-month rays, the laurel, the standard — is character-identical. All five pill
strings and all five card strings on the Detail frames fall out of `kkReached` / `kkRung` at exactly
the tiers the canvas drew.
