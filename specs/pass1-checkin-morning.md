# Pass 1 — second reader — morning check-in

Bundle **Email Login**. Frames audited in full:

- `.uifinal/pretty/final/Email Login/Morning-1-Yesterday.html` (raw cross-read)
- `.uifinal/pretty/final/Email Login/Morning-Task-Check.html` (raw cross-read, byte-checked against pretty)
- `.uifinal/pretty/final/Email Login/Morning-5-Done.html` (raw cross-read)

Supporting evidence read in full because D-009 depends on it:

- `.uifinal/pretty/prev/Email Login/Morning-Task-Check.html` (the superseded step-2 board)
- `.uifinal/pretty/prev/Email Login/Morning-Action-Reminder.html` (the board `UI Final` deletes)
- `.uifinal/diffs/Morning-1-Yesterday.html.diff`, `…/Morning-5-Done.html.diff` (rail only: 5 dots → 7)
- `.uifinal/final/Email Login/_notes.json` lines 546–557 (the sticky notes: 21D1 / 21D2 / 21D7)

App files read in full:

- `/Users/admin/Documents/tideline/src/app/day/morning.tsx`
- `/Users/admin/Documents/tideline/src/components/day/kit.tsx`
- supporting: `src/components/MoodLogger.tsx` (`BoardTitle`), `src/components/ui/marks.tsx`
  (`BackGlyph`), `src/components/ui/Grain.tsx`, `src/components/ui/AppText.tsx`,
  `src/components/ui/press-scale.tsx`, `src/lib/theme.ts`

## Coordinate note

Every canvas `top` includes the 54px status bar the app never builds, so the app's
equivalent is `canvas top − 54`. Both numbers appear in the Design column.

Bottom-anchored values are given as canvas-from-frame-bottom; the app's `SafeAreaView`
bottom edge takes 34 on a 393×852 device, so the app number is `canvas bottom − 34`.
Verified arithmetic on a 393×852 device (top inset 59, bottom inset 34, inner
height 759):

| Element | Canvas | App | Absolute from screen top | Verdict |
| --- | --- | --- | --- | --- |
| flow CTA pill top | 852 − 84(unused) → `top:756` | `min(702, 759−52−10) = 697` | 59 + 697 = **756** | exact |
| `ActionButton` pill top | `bottom:84` → 852−84−54 = 714 | `bottom:50` → 759−50−54 = 655 | 59 + 655 = **714** | exact |
| `DidYouRow` discs top | `bottom:100` → 852−100−74 = 678 | `bottom:66` → 759−66−74 = 619 | 59 + 619 = **678** | exact |

Systemic (not itemised per row): every *top-anchored* child sits at `canvas − 54`
inside a safe area whose real inset is 59, so it renders 5pt lower than the canvas
in absolute screen terms. The task's stated canvas fact normalises this away; it is
noted once here and not scored.

---

## Section A — shell, drawn identically on all three frames

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| all | frame root | background | `#F4F3F0` | `#F4F3F0` (kit.tsx:175) | match |
| all | frame root | width × height | 393 × 852 | device viewport | n/a (canvas artefact) |
| all | frame root | overflow | `hidden` | RN default `hidden` | match |
| all | frame root | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | iOS `System`; web `-apple-system, BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif` (theme.ts:159,161-169) | match (iOS resolves the same face; web stack leads with `-apple-system`) |
| all | frame root | `-webkit-font-smoothing` | `antialiased` | web-only `WebkitFontSmoothing:'antialiased'` (AppText.tsx:126) | match |
| all | frame root | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | not drawn | n/a (canvas frame chrome) |
| all | grain | background-image | `url('noise-dark.png')` | `require('assets/images/noise-dark.png')` (kit.tsx:21,176) | match |
| all | grain | opacity | `0.07` | `0.07` (kit.tsx:176) | match |
| all | grain | inset | `0` | `top/left/right/bottom: 0` (Grain.tsx:16) | match |
| all | grain | tiling | CSS default `repeat` | `resizeMode="repeat"` (Grain.tsx:17) | match |
| all | grain | pointer-events | `none` | `pointerEvents="none"` (Grain.tsx:16) | match |
| all | grain | z-order | first child, under everything | rendered first in `DayShell` (kit.tsx:176) | match |
| all | status bar | height / padding / glyphs | 54; `6px 32px 0 46px`; `9:41` 17/600/−0.2 `#1D1C1A`; three svgs | OS bar, `StatusBar style="dark"` (morning.tsx:167) | n/a (app never builds it) |
| all | back | left | `16` | `16` (kit.tsx:132) | match |
| all | back | top | `66` → 12 | `12` (kit.tsx:132) | match |
| all | back | flex direction / align | `row` / `center` | `row` / `center` (kit.tsx:132) | match |
| all | back | gap | `9` | `9` (kit.tsx:132) | match |
| all | back chevron | svg width × height | `11 × 19` | `11 × 19` (marks.tsx:216) | match |
| all | back chevron | viewBox | `0 0 11 19` | `0 0 11 19` (marks.tsx:216) | match |
| all | back chevron | path `d` | `M9.5 1.5L2 9.5l7.5 8` | `M9.5 1.5L2 9.5l7.5 8` (marks.tsx:217) | match |
| all | back chevron | fill | `none` | `none` (marks.tsx:216-217) | match |
| all | back chevron | stroke | `#55534E` | `#55534E` (kit.tsx:133) | match |
| all | back chevron | stroke-width | `2.4` | `2.4` (marks.tsx:217) | match |
| all | back chevron | linecap / linejoin | `round` / `round` | `round` / `round` (marks.tsx:217) | match |
| all | back label | text | `Back` | `Back` (kit.tsx:134) | match |
| all | back label | font-size | `17` | `17` (kit.tsx:134) | match |
| all | back label | weight | `400` | `sans('400')` (kit.tsx:134) | match |
| all | back label | colour | `#55534E` | `#55534E` (kit.tsx:134) | match |
| all | back label | letter-spacing | unset | none (AppText drops inherited tracking when caller names a size, AppText.tsx:120,138) | match |
| all | back hit area | — | not drawn | `hitSlop 16` all sides, `minHeight:0` (kit.tsx:131-132) | match (affordance only) |
| all | rail | left / right | `0` / `0` | `0` / `0` (kit.tsx:89) | match |
| all | rail | top | `72` → 18 | `18` (kit.tsx:89) | match |
| all | rail | flex direction | `row` (CSS flex default) | `row` (kit.tsx:89) | match |
| all | rail | justify-content | `center` | `center` (kit.tsx:89) | match |
| all | rail | gap | `7` | `7` (kit.tsx:89) | match |
| all | rail | child count | 7 | `STEPS = 7` (morning.tsx:52,169) | match |
| all | rail active | width | `18` | `18` (kit.tsx:95) | match |
| all | rail active | height | `6` | `6` (kit.tsx:96) | match |
| all | rail active | border-radius | `3` | `3` (kit.tsx:96) | match |
| all | rail active | background | `#131313` | `#131313` (kit.tsx:97) | match |
| all | rail idle | width × height | `6 × 6` | `6 × 6` (kit.tsx:95-96) | match |
| all | rail idle | border-radius | `3` | `3` (kit.tsx:96) | match |
| all | rail idle | background | `rgba(19,19,19,0.18)` | `rgba(19,19,19,0.18)` (kit.tsx:97) | match |
| M1 | rail | active index | 1st of 7 | `step === 0` (morning.tsx:96,169) | match |
| MTC | rail | active index | 2nd of 7 | `step === 1` (morning.tsx:219) | match |
| M5 | rail | active index | 7th of 7 | `step === 6` (morning.tsx:292) | match |
| M1, M5 | CTA pill | left / right | `16` / `16` | `16` / `16` (kit.tsx:197-198) | match |
| M1, M5 | CTA pill | top | `756` → 702 | `min(702, h−52−10)` = 697 → abs 756 (kit.tsx:112-114,173) | match |
| M1, M5 | CTA pill | height | `52` | `52` (kit.tsx:113,200-201) | match |
| M1, M5 | CTA pill | border-radius | `26` | `pill/2` = 26 (kit.tsx:202) | match |
| M1, M5 | CTA pill | background | `#131313` | `#131313` (kit.tsx:203) | match |
| M1, M5 | CTA pill | align / justify | `center` / `center` | `center` / `center` (kit.tsx:204-205) | match |
| M1, M5 | CTA label | font-size | `17` | `17` (kit.tsx:207) | match |
| M1, M5 | CTA label | weight | `600` | `sans('600')` (kit.tsx:207) | match |
| M1, M5 | CTA label | colour | `#FFFFFF` | `#FFFFFF` (kit.tsx:207) | match |
| M1, M5 | CTA label | letter-spacing | unset | `0` when `ctaWide` false (kit.tsx:207) | match |
| M1 | CTA label | text | `Begin day 13` | `` `Begin day ${day}` `` (morning.tsx:152) | match |
| M5 | CTA label | text | `Done` | `Done` (morning.tsx:152) | match |

---

## Section B — `Morning 1 Yesterday` (21D1)

### B1 · the ledger drawing (canvas `top:150` → app 96)

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| M1 | art container | left / right | `0` / `0` | `0` / `0` (kit.tsx:407) | match |
| M1 | art container | top | `150` → 96 | `top={96}` (morning.tsx:187; kit.tsx:407) | match |
| M1 | art container | height | `190` | `190` (kit.tsx:407) | match |
| M1 | art container | pointer-events | not stated | `none` (kit.tsx:407) | match (inert art) |
| M1 | warm glow | width × height | `140 × 140` | `size={140}` (kit.tsx:408) | match |
| M1 | warm glow | left | `50%` | `'50%'` (kit.tsx:408) | match |
| M1 | warm glow | margin-left | `−34` | `−34` (kit.tsx:408) | match |
| M1 | warm glow | top | `6` | `6` (kit.tsx:408) | match |
| M1 | warm glow | border-radius | `50%` | `Circle r = size/2` (kit.tsx:41) | match |
| M1 | warm glow | gradient type | `radial-gradient(closest-side, …)` | `RadialGradient cx/cy 50% rx/ry 50%` on a square box (kit.tsx:36) | match |
| M1 | warm glow | stop 0 | `rgba(226,186,120,0.38)` | `#E2BA78` @ 0.38 (kit.tsx:408) | match |
| M1 | warm glow | stop 1 | `rgba(226,186,120,0) 75%` | offset `0.75`, opacity 0 (kit.tsx:38,408) | match |
| M1 | warm glow | filter | `blur(2px)` | none — gradient falloff stands in (kit.tsx:27-29) | **MISMATCH\*** (RN has no CSS blur; substitute = the gradient's own falloff) |
| M1 | cast shadow | width × height | `180 × 20` | `180 × 20` (kit.tsx:409) | match |
| M1 | cast shadow | left / margin-left | `50%` / `−90` | `'50%'` / `−90` (kit.tsx:409) | match |
| M1 | cast shadow | top | `134` | `134` (kit.tsx:409) | match |
| M1 | cast shadow | border-radius | `50%` | `Ellipse rx=w/2 ry=h/2` (kit.tsx:64) | match |
| M1 | cast shadow | fill | `rgba(40,38,32,0.10)` (solid) | `#282620` @ 0.10 held to offset 0.55, then ramped to 0 (kit.tsx:59-61,409) | **MISMATCH\*** (solid + `blur(7px)` redrawn as a gradient ellipse of the *unblurred* size; the substitute does not spread past the original bounds) |
| M1 | cast shadow | filter | `blur(7px)` | none | **MISMATCH\*** (same substitute) |
| M1 | left page | left / margin-left | `50%` / `−86` | `'50%'` / `−86` (kit.tsx:414-415) | match |
| M1 | left page | top | `34` | `34` (kit.tsx:416) | match |
| M1 | left page | width × height | `80 × 98` | `80 × 98` (kit.tsx:417-418) | match |
| M1 | left page | border-radius | `8px 3px 3px 8px` | TL 8 / TR 3 / BR 3 / BL 8 (kit.tsx:419-422) | match |
| M1 | left page | background | `#F7F6F2` | `#F7F6F2` (kit.tsx:423) | match |
| M1 | left page | box-shadow | `0 0 0 1px rgba(0,0,0,0.05)` | same string (kit.tsx:424) | match |
| M1 | left page | transform | `rotate(-5deg)` | `rotate: '-5deg'` (kit.tsx:425) | match |
| M1 | left page rule 1 | left / top / w / h | `12 / 16 / 44 / 5` | `12 / 16 / 44 / 5` (kit.tsx:427) | match |
| M1 | left page rule 1 | radius / colour | `3` / `#DBDAD3` | `3` / `#DBDAD3` (kit.tsx:427) | match |
| M1 | left page rule 2 | left / top / w / h | `12 / 29 / 52 / 5` | `12 / 29 / 52 / 5` (kit.tsx:428) | match |
| M1 | left page rule 2 | radius / colour | `3` / `#E1E0D9` | `3` / `#E1E0D9` (kit.tsx:428) | match |
| M1 | left page rule 3 | left / top / w / h | `12 / 42 / 38 / 5` | `12 / 42 / 38 / 5` (kit.tsx:429) | match |
| M1 | left page rule 3 | radius / colour | `3` / `#E1E0D9` | `3` / `#E1E0D9` (kit.tsx:429) | match |
| M1 | right page | left / margin-left | `50%` / `−4` | `'50%'` / `−4` (kit.tsx:435-436) | match |
| M1 | right page | top | `30` | `30` (kit.tsx:437) | match |
| M1 | right page | width × height | `80 × 98` | `80 × 98` (kit.tsx:438-439) | match |
| M1 | right page | border-radius | `3px 8px 8px 3px` | TL 3 / TR 8 / BR 8 / BL 3 (kit.tsx:440-443) | match |
| M1 | right page | background | `#F7F6F2` | `#F7F6F2` (kit.tsx:444) | match |
| M1 | right page | box-shadow | `0 0 0 1px rgba(0,0,0,0.05)` | same (kit.tsx:445) | match |
| M1 | right page | transform | `rotate(3deg)` | `rotate: '3deg'` (kit.tsx:446) | match |
| M1 | right page rule 1 | left / top / w / h / radius / colour | `14 / 16 / 40 / 5 / 3 / #DBDAD3` | identical (kit.tsx:448) | match |
| M1 | right page rule 2 | left / top / w / h / radius / colour | `14 / 29 / 48 / 5 / 3 / #E1E0D9` | identical (kit.tsx:449) | match |
| M1 | pen | left / margin-left | `50%` / `−6` | `'50%'` / `−6` (kit.tsx:452) | match |
| M1 | pen | top | `66` | `66` (kit.tsx:452) | match |
| M1 | pen | width × height | `92 × 7` | `92 × 7` (kit.tsx:452) | match |
| M1 | pen | border-radius | `4` | `4` (kit.tsx:452) | match |
| M1 | pen | background | `#55534E` | `#55534E` (kit.tsx:452) | match |
| M1 | pen | transform | `rotate(-33deg)` | `rotate: '-33deg'` (kit.tsx:452) | match |
| M1 | seal disc | left / margin-left | `50%` / `56` | `'50%'` / `56` (kit.tsx:454) | match |
| M1 | seal disc | top | `12` | `12` (kit.tsx:454) | match |
| M1 | seal disc | width × height | `30 × 30` | `30 × 30` (kit.tsx:454) | match |
| M1 | seal disc | border-radius | `50%` | `15` (kit.tsx:454) | match |
| M1 | seal disc | background | `#131313` | `#131313` (kit.tsx:454) | match |
| M1 | seal disc | align / justify | `center` / `center` | `center` / `center` (kit.tsx:454) | match |
| M1 | seal tick | svg w × h | `13 × 11` | `13 × 11` (kit.tsx:455) | match |
| M1 | seal tick | viewBox | `0 0 16 13` | `0 0 16 13` (kit.tsx:455) | match |
| M1 | seal tick | path `d` | `M1.5 7l4.4 4.5L14.5 1.5` | identical (kit.tsx:456) | match |
| M1 | seal tick | stroke / width | `#F4F3F0` / `2.8` | `#F4F3F0` / `2.8` (kit.tsx:456) | match |
| M1 | seal tick | linecap / linejoin / fill | `round` / `round` / `none` | `round` / `round` / `none` (kit.tsx:455-456) | match |
| M1 | art z-order | paint sequence | glow → shadow → left page → right page → pen → seal | identical (kit.tsx:408-458) | match |

### B2 · headline

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| M1 | title | text | `Yesterday held.` | `Yesterday held.` (morning.tsx:188) | match |
| M1 | title | left | `24` | `24` (kit.tsx:254) | match |
| M1 | title | right bound | none (runs to frame edge) | none set (kit.tsx:254) | match |
| M1 | title | top | `378` → 324 | `top={324}` (morning.tsx:188) | match |
| M1 | title | font-size | `27` | `27` (kit.tsx:254) | match |
| M1 | title | weight | `500` | `sans('500')` (kit.tsx:254) | match |
| M1 | title | letter-spacing | `−0.1` | `−0.1` (kit.tsx:254) | match |
| M1 | title | colour | `#1D1C1A` | `#1D1C1A` (kit.tsx:254) | match |
| M1 | title | line-height | unset (natural box) | inherited leading dropped because caller names a size (AppText.tsx:121,139) | match |
| M1 | title | text-align | unset → left | default left (kit.tsx:254) | match |

### B3 · the ledger card

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| M1 | card | left / right | `12` / `12` | `12` / `12` (morning.tsx:189) | match |
| M1 | card | top | `438` → 384 | `384` (morning.tsx:189) | match |
| M1 | card | height | `242` | `242` (morning.tsx:189) | match |
| M1 | card | border-radius | `14` | `14` (morning.tsx:189) | match |
| M1 | card | background | `#FFFFFF` | `#FFFFFF` (morning.tsx:189) | match |
| M1 | card | box-shadow | `0 0 0 1px rgba(0,0,0,0.06)` | same string (morning.tsx:189) | match |
| M1 | row (all four) | left / right | `16` / `16` | `16` / `16` (kit.tsx:735) | match |
| M1 | row (all four) | height | `48` | `48` (kit.tsx:735) | match |
| M1 | row (all four) | flex direction / align | `row` / `center` | `row` / `center` (kit.tsx:735) | match |
| M1 | row (all four) | gap | `13` | `13` (kit.tsx:735) | match |
| M1 | row tops | top | `14 / 70 / 126 / 182` (card-relative, no bar subtraction) | `14 / 70 / 126 / 182` (morning.tsx:190,193,201,209) | match |
| M1 | rule tops | top | `62 / 118 / 174` | `62 / 118 / 174` (morning.tsx:191,199,207) | match |
| M1 | rule | left / right / height | `16` / `16` / `1` | `16` / `16` / `1` (kit.tsx:749) | match |
| M1 | rule | background | `rgba(0,0,0,0.06)` | `rgba(0,0,0,0.06)` (kit.tsx:749) | match |
| M1 | glyph chip | width × height | `36 × 36` | `36 × 36` (kit.tsx:736) | match |
| M1 | glyph chip | border-radius | `50%` | `18` (kit.tsx:736) | match |
| M1 | glyph chip | background | `#F1EFE9` | `#F1EFE9` (kit.tsx:736) | match |
| M1 | glyph chip | align / justify | `center` / `center` | `center` / `center` (kit.tsx:736) | match |
| M1 | glyph chip | flex-shrink | `0` | RN default 0 (kit.tsx:736) | match |
| M1 | row title | flex | `1` | `flex: 1` (kit.tsx:739) | match |
| M1 | row title | font-size | `15` | `15` (kit.tsx:739) | match |
| M1 | row title | weight | `500` | `sans('500')` (kit.tsx:739) | match |
| M1 | row title | colour | `#1D1C1A` | `#1D1C1A` (kit.tsx:739) | match |
| M1 | detail (row 1) | font-size | `13.5` | `13.5` (kit.tsx:741) | match |
| M1 | detail (row 1) | weight | `600` | `sans('600')` via `strong` (kit.tsx:741; morning.tsx:190) | match |
| M1 | detail (row 1) | colour | `#131313` | `#131313` (kit.tsx:741) | match |
| M1 | detail (rows 2–4) | font-size | `13.5` | `13.5` (kit.tsx:741) | match |
| M1 | detail (rows 2–4) | weight | `500` | `sans('500')` (kit.tsx:741) | match |
| M1 | detail (rows 2–4) | colour | `#8B8882` | `#8B8882` (kit.tsx:741) | match |
| M1 | gauge glyph | svg w × h | `18 × 11` | `glyph={[18, 11]}` (morning.tsx:190) | match |
| M1 | gauge glyph | viewBox | `0 0 22 13` | `0 0 22 13` (kit.tsx:702) | match |
| M1 | gauge glyph | track `d` | `M2,11 A9,9 0 0 1 20,11` | identical (kit.tsx:703) | match |
| M1 | gauge glyph | track stroke / width / cap | `rgba(19,19,19,0.15)` / `3` / `round` | identical (kit.tsx:703) | match |
| M1 | gauge glyph | needle `d` | `M2,11 A9,9 0 0 1 16.5,4` | identical (kit.tsx:704) | match |
| M1 | gauge glyph | needle stroke / width / cap | `#131313` / `3` / `round` | identical (kit.tsx:704) | match |
| M1 | wave glyph | svg w × h | `17 × 12` | `glyph={[17, 12]}` (morning.tsx:194) | match |
| M1 | wave glyph | viewBox | `0 0 26 20` | `0 0 26 20` (kit.tsx:710) | match |
| M1 | wave glyph | path `d` | `M2 13c4-8 9 3 13-3s7 2 9-2` | identical (kit.tsx:711) | match |
| M1 | wave glyph | stroke / width / fill / cap | `#131313` / `2.4` / `none` / `round` | identical (kit.tsx:710-711) | match |
| M1 | check glyph | svg w × h | `13 × 11` | `glyph={[13, 11]}` (morning.tsx:202) | match |
| M1 | check glyph | viewBox / `d` | `0 0 16 13` / `M1.5 7l4.4 4.5L14.5 1.5` | identical (kit.tsx:717-718) | match |
| M1 | check glyph | stroke / width / caps | `#131313` / `2.6` / `round`,`round` | identical (kit.tsx:718) | match |
| M1 | play glyph | svg w × h | `11 × 14` | `glyph={[11, 14]}` (morning.tsx:210) | match |
| M1 | play glyph | viewBox | `0 0 18 22` | `0 0 18 22` (kit.tsx:723) | match |
| M1 | play glyph | path `d` / fill | `M3 2v18L16.5 11z` / `#131313` | identical (kit.tsx:724) | match |
| M1 | play glyph | margin-left | `2` | `marginLeft: 2` (kit.tsx:723) | match |
| M1 | row 1 | title text | `Recovery score` | `Recovery score` (morning.tsx:190) | match |
| M1 | row 1 | detail text | `+12 → 1,240` | `` `+${gained} → ${score.total.toLocaleString()}` `` (morning.tsx:190) | match (same shape, live data) |
| M1 | row 2 | title text | `One urge · 7:42 PM` | `` `One urge · ${clockTime(...)}` `` (morning.tsx:196) | match (same shape, live data) |
| M1 | row 2 | detail text | `passed in 4 min` | `'rode it out'` / `'logged'` (morning.tsx:197) | **MISMATCH** (design states an elapsed duration; `events` carries no duration field — see Findings) |
| M1 | row 3 | title / detail text | `Pledge kept` / `signed 7:12 AM` | same shape (morning.tsx:204-205) | match |
| M1 | row 4 | title / detail text | `Part III finished` / `7 min` | `` `Part ${roman(...)} finished` `` / `` `${estimatedMinutes ?? 7} min` `` (morning.tsx:212-213) | match |
| M1 | empty states | — | not drawn | `No urges logged` / `No pledge signed` / `No lesson yesterday`, detail omitted (morning.tsx:196-213) | match (frame draws only the full state) |
| M1 | card vs CTA | z-order | card painted *after* the CTA pill | CTA painted after the card (kit.tsx:188-209) | match (card 438–680, pill 756–808 — no overlap, so paint order is unobservable) |

---

## Section C — `Morning Task Check` (21D2)

### C0 · the D-009 reading, re-derived

D-009 claims the frame carries three values (sun mark, `Today` label, `Got it` pill)
from `Morning Action Reminder`, which `UI Final` deletes. Checked independently:

| Evidence | Reading it supports |
| --- | --- |
| `_notes.json` line 552: `21D2 · Morning — Yesterday's task` | the board is step 2 |
| rail: idle, **active**, idle ×5 — the stadium is at index 1 of 7 | the board is step 2 (D-009 does not cite this; it is the decisive datum) |
| title `Did you complete this task?` | step 2 |
| art: night sky, moon, bed, phone shelved | last night |
| mark disc: sun, `viewBox 0 0 24 24`, 16px | **identical** to prev `Morning-Action-Reminder` line 238-243 |
| label `Today` 13/600 `#1D1C1A` | **identical** to prev `Morning-Action-Reminder` line 245-251 |
| footer `Got it` pill, `bottom:84`, 54 tall, r27, 16.5/600/+0.2 | **identical** to prev `Morning-Action-Reminder` line 265-286 |
| prev `Morning-Task-Check` drew moon 15px, `Last night`, two 74pt discs at `bottom:100` | the three properties step 2 lost |

Verdict: **the evidence supports D-009.** The rail index alone rules out reading the
frame as the step-6 board, and all three foreign properties are byte-identical to the
deleted board's. The app's split (step 2 = moon 15 / `Last night` / discs; step 6 =
sun 16 / `Today` / `Got it`) is the only reading consistent with both frames.

One property is **not** covered by D-009: the prev board's caption
`Honesty counts more than the streak.` (prev frame line 373-386). `UI Final` deletes
it, D-009 does not reassign it, and the app still draws it — see Findings.

Card `top` provenance, checked: step 2 uses canvas `186` → 132 (this frame, and the
prev step-2 frame, agree at 186); step 6 uses canvas `248` → 194 (prev
`Morning-Action-Reminder` line 149). Both are drawn values, neither is invented.

### C1 · heading and card box

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| MTC | title | text | `Did you complete this task?` | same (morning.tsx:221) | match |
| MTC | title | left / right | `0` / `0` | `0` / `0` (MoodLogger.tsx:533) | match |
| MTC | title | top | `118` → 64 | `64` (MoodLogger.tsx:533) | match |
| MTC | title | text-align | `center` | `center` (MoodLogger.tsx:533) | match |
| MTC | title | font-size | `22` | `22` (MoodLogger.tsx:533) | match |
| MTC | title | weight | `500` | `sans('500')` (MoodLogger.tsx:533) | match |
| MTC | title | letter-spacing | `0.1` | `0.1` (MoodLogger.tsx:533) | match |
| MTC | title | colour | `#1D1C1A` | `#1D1C1A` (MoodLogger.tsx:533) | match |
| MTC | card | left / right | `56` / `56` | `56` / `56` (kit.tsx:891-892) | match |
| MTC | card | top | `186` → 132 | `top={132}` (morning.tsx:222) | match |
| MTC | card | height | intrinsic (248 art + 16/18/18 body) | intrinsic (kit.tsx:897-898) | match |
| MTC | card | border-radius | `18` | `18` (kit.tsx:893) | match |
| MTC | card | overflow | `hidden` | `hidden` (kit.tsx:894) | match |
| MTC | card | background | `#FFFFFF` | `#FFFFFF` (kit.tsx:894) | match |
| MTC | card | box-shadow | `0 0 0 1px rgba(0,0,0,0.05), 0 10px 24px rgba(40,38,32,0.07)` | same string (kit.tsx:895) | match |

### C2 · the night art (`NightActionArt`)

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| MTC | art box | height | `248` | `248` (kit.tsx:843,897) | match |
| MTC | art box | overflow | `hidden` | `hidden` (kit.tsx:843,897) | match |
| MTC | art box | position | `relative` | absolute fill inside a 248 box (kit.tsx:843) | match |
| MTC | art gradient | angle | `180deg` | vertical default (kit.tsx:844) | match |
| MTC | art gradient | stop 1 | `#0B0C0F 0%` | `#0B0C0F` @ 0 (kit.tsx:844) | match |
| MTC | art gradient | stop 2 | `#12151B 60%` | `#12151B` @ 0.6 (kit.tsx:844) | match |
| MTC | art gradient | stop 3 | `#1A2027 100%` | `#1A2027` @ 1 (kit.tsx:844) | match |
| MTC | speck a | left / top / w / h | `64 / 40 / 2 / 2` | identical (kit.tsx:834) | match |
| MTC | speck a | radius / colour | `50%` / `rgba(244,243,240,0.45)` | `1` / same (kit.tsx:834) | match |
| MTC | speck b | left / top / w / h | `104 / 72 / 1.5 / 1.5` | identical (kit.tsx:835) | match |
| MTC | speck b | radius / colour | `50%` / `rgba(244,243,240,0.3)` | `0.75` / same (kit.tsx:835) | match |
| MTC | speck c | right / top / w / h | `40 / 34 / 2 / 2` | identical (kit.tsx:836) | match |
| MTC | speck c | radius / colour | `50%` / `rgba(244,243,240,0.35)` | `1` / same (kit.tsx:836) | match |
| MTC | speck d | right / top / w / h | `96 / 58 / 1.5 / 1.5` | identical (kit.tsx:837) | match |
| MTC | speck d | radius / colour | `50%` / `rgba(244,243,240,0.3)` | `0.75` / same (kit.tsx:837) | match |
| MTC | moon glow | left / top | `22` / `26` | `22` / `26` (kit.tsx:848) | match |
| MTC | moon glow | width × height | `56 × 56` | `size={56}` (kit.tsx:848) | match |
| MTC | moon glow | stops | `rgba(223,220,211,0.16)` → `rgba(223,220,211,0) 72%` | `#DFDCD3` @ 0.16 → 0 at offset 0.72 (kit.tsx:848) | match |
| MTC | moon glyph | left / top | `37` / `41` | `37` / `41` (kit.tsx:849) | match |
| MTC | moon glyph | svg w × h | `26 × 26` | `size={26}` (kit.tsx:850) | match |
| MTC | moon glyph | viewBox | `0 0 24 24` | `0 0 24 24` (kit.tsx:790) | match |
| MTC | moon glyph | path `d` | `M14 3 A9 9 0 1 0 21 12 A7.2 7.2 0 0 1 14 3Z` | identical (kit.tsx:785) | match |
| MTC | moon glyph | fill | `#E8E6DC` | `#E8E6DC` (kit.tsx:850) | match |
| MTC | ridge | viewBox | `0 0 281 248` | `0 0 281 248` (kit.tsx:855) | match |
| MTC | ridge | preserveAspectRatio | `none` | `none` (kit.tsx:855) | match |
| MTC | ridge | size | `inset:0; 100% × 100%` | `w = window − 112` × 248, absolute 0,0 (kit.tsx:781-783,855) | match (281 = 393 − 112) |
| MTC | ridge | path `d` | `M-4,248 L-4,196 Q60,178 140,190 Q210,200 285,186 L285,248 Z` | identical (kit.tsx:856) | match |
| MTC | ridge | fill | `#171B22` | `#171B22` (kit.tsx:856) | match |
| MTC | headboard | left / top / w / h / radius / colour | `38 / 152 / 8 / 58 / 3 / #2C3844` | identical (kit.tsx:860) | match |
| MTC | mattress | left / top / w / h / radius / colour | `44 / 178 / 82 / 21 / 6 / #394656` | identical (kit.tsx:861) | match |
| MTC | pillow | left / top / w / h / radius / colour | `50 / 169 / 28 / 11 / 5 / #55677C` | identical (kit.tsx:862) | match |
| MTC | bed foot | left / top / w / h / radius / colour | `118 / 199 / 6 / 12 / 2 / #26303C` | identical (kit.tsx:863) | match |
| MTC | shelf glow | right / top | `24` / `118` | `24` / `118` (kit.tsx:866) | match |
| MTC | shelf glow | width × height | `92 × 92` | `size={92}` (kit.tsx:866) | match |
| MTC | shelf glow | stops | `rgba(226,186,120,0.20)` → `rgba(226,186,120,0) 74%` | `#E2BA78` @ 0.2 → 0 at 0.74 (kit.tsx:866) | match |
| MTC | shelf | right / top / w / h / radius / colour | `56 / 168 / 52 / 9 / 3 / #2C3844` | identical (kit.tsx:867) | match |
| MTC | shelf leg | right / top / w / h / radius / colour | `76 / 177 / 8 / 34 / 2 / #26303C` | identical (kit.tsx:868) | match |
| MTC | phone | right / top / w / h / radius / colour | `70 / 140 / 15 / 26 / 3 / #DCE3EA` | identical (kit.tsx:869) | match |
| MTC | seal disc | right / top / w / h | `48 / 128 / 19 / 19` | identical (kit.tsx:870) | match |
| MTC | seal disc | radius / background | `50%` / `#E9D2A4` | `9.5` / `#E9D2A4` (kit.tsx:870) | match |
| MTC | seal disc | align / justify | `center` / `center` | `center` / `center` (kit.tsx:870) | match |
| MTC | seal tick | svg w × h | `10 × 9` | `10 × 9` (kit.tsx:871) | match |
| MTC | seal tick | viewBox | `0 0 9 8` | `0 0 9 8` (kit.tsx:871) | match |
| MTC | seal tick | path `d` | `M1.5 4l2 2 4-4.5` | identical (kit.tsx:872) | match |
| MTC | seal tick | stroke / width / caps / fill | `#131313` / `1.6` / `round`,`round` / `none` | identical (kit.tsx:871-872) | match |
| MTC | art | z-order | gradient → specks → glow → moon → ridge → bed → shelf glow → shelf → leg → phone → seal | identical order (kit.tsx:844-874) | match |

### C3 · card body

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| MTC | body | padding | `16px 18px 18px` | `paddingTop 16 / horizontal 18 / bottom 18` (kit.tsx:898) | match |
| MTC | body | flex-direction | `column` | default column (kit.tsx:898) | match |
| MTC | body | gap | `12` | `12` (kit.tsx:898) | match |
| MTC | mark row | flex-direction / align | `row` / `center` | `row` / `center` (kit.tsx:899) | match |
| MTC | mark row | gap | `10` | `10` (kit.tsx:899) | match |
| MTC | mark disc | width × height | `34 × 34` | `34 × 34` (kit.tsx:900) | match |
| MTC | mark disc | radius / background | `50%` / `#131313` | `17` / `#131313` (kit.tsx:900) | match |
| MTC | mark disc | align / justify / flex-shrink | `center` / `center` / `0` | `center` / `center` / RN default 0 (kit.tsx:900) | match |
| MTC | mark glyph (frame draws sun) | svg w × h | `16 × 16` | step 6 `SunGlyph size={16}` (kit.tsx:901) | match — assigned to step 6 per D-009 |
| MTC | mark glyph (sun) | viewBox | `0 0 24 24` | `0 0 24 24` (kit.tsx:813) | match |
| MTC | mark glyph (sun) | circle | `cx 12 cy 12 r 4.5 fill #F4F3F0` | identical (kit.tsx:814,901) | match |
| MTC | mark glyph (sun) | rays `d` | `M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2.1 2.1M16.9 16.9L19 19M19 5l-2.1 2.1M7.1 16.9L5 19` | identical (kit.tsx:816) | match |
| MTC | mark glyph (sun) | stroke / width / cap | `#F4F3F0` / `2` / `round` | identical (kit.tsx:817-819,901) | match |
| MTC | mark glyph (step 2 substitute) | moon | not on this frame — prev frame line 306: 15 × 15, `viewBox 0 0 24 24`, fill `#F4F3F0` | `MoonGlyph size={15} color="#F4F3F0"` (kit.tsx:901) | match — D-009 restoration |
| MTC | label | text (frame draws) | `Today` | step 6 `label="Today"` (morning.tsx:229) | match — assigned to step 6 |
| MTC | label | text (step 2 substitute) | prev frame line 316: `Last night` | `label="Last night"` (morning.tsx:222) | match — D-009 restoration |
| MTC | label | font-size | `13` | `13` (kit.tsx:903) | match |
| MTC | label | weight | `600` | `sans('600')` (kit.tsx:903) | match |
| MTC | label | colour | `#1D1C1A` | `#1D1C1A` (kit.tsx:903) | match |
| MTC | line | text-align | `left` | default left (kit.tsx:906) | match (prev frame was `center` — the app took the new value) |
| MTC | line | font-size | `15` | `15` (kit.tsx:906) | match |
| MTC | line | weight | `500` | `sans('500')` (kit.tsx:906) | match |
| MTC | line | line-height | `22` | `22` (kit.tsx:906) | match |
| MTC | line | colour | `#1D1C1A` | `#1D1C1A` (kit.tsx:906) | match |
| MTC | line | text-wrap | `pretty` | web only via AppText body variant; native has no equivalent (AppText.tsx:127) | **MISMATCH\*** (substitute: platform greedy wrapping on native) |
| MTC | line | copy | `Write down each trigger the moment you notice it.` | `DAY_ACTIONS[0]`, same string (kit.tsx:769) | match |

### C4 · footer

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| MTC | `Got it` pill (frame draws) | left / right | `16` / `16` | step 6 `ActionButton` 16 / 16 (kit.tsx:224-225) | match — assigned to step 6 |
| MTC | `Got it` pill | bottom | `84` | `50` (+34 bottom inset = 84) (kit.tsx:226) | match |
| MTC | `Got it` pill | height | `54` | `54` (kit.tsx:227-228) | match |
| MTC | `Got it` pill | border-radius | `27` | `27` (kit.tsx:229) | match |
| MTC | `Got it` pill | background | `#131313` | `#131313` (kit.tsx:230) | match |
| MTC | `Got it` label | font-size | `16.5` | `16.5` (kit.tsx:234) | match |
| MTC | `Got it` label | weight | `600` | `sans('600')` (kit.tsx:234) | match |
| MTC | `Got it` label | letter-spacing | `0.2` | `0.2` (kit.tsx:234) | match |
| MTC | `Got it` label | colour | `#FFFFFF` | `#FFFFFF` (kit.tsx:234) | match |
| MTC | answer discs (step 2 substitute) | container | prev line 331-339: `left 0 / right 0 / bottom 100 / justify center / gap 20` | `left 0 / right 0 / bottom 66` (+34 = 100) / center / gap 20 (kit.tsx:918) | match — D-009 restoration |
| MTC | no-disc | size / radius | `74 × 74` / `50%` | `74 × 74` / `37` (kit.tsx:923) | match |
| MTC | no-disc | background / box-shadow | `#FFFFFF` / `inset 0 0 0 1.5px rgba(0,0,0,0.14)` | identical (kit.tsx:923) | match |
| MTC | no-disc glyph | svg / viewBox / `d` | `22 × 22` / `0 0 18 18` / `M3 3 L15 15 M15 3 L3 15` | identical (kit.tsx:924-925) | match |
| MTC | no-disc glyph | stroke / width / cap | `#55534E` / `2.2` / `round` | identical (kit.tsx:925) | match |
| MTC | yes-disc | size / radius / background | `74 × 74` / `50%` / `#131313` | `74 × 74` / `37` / `#131313` (kit.tsx:932) | match |
| MTC | yes-disc | box-shadow | `0 8px 20px rgba(19,19,19,0.24)` | same string (kit.tsx:932) | match |
| MTC | yes-disc glyph | svg / viewBox / `d` | `26 × 21` / `0 0 20 16` / `M2 8.5 L7.5 14 L18 2.5` | identical (kit.tsx:933-934) | match |
| MTC | yes-disc glyph | stroke / width / caps / fill | `#F4F3F0` / `2.6` / `round`,`round` / `none` | identical (kit.tsx:934) | match |
| MTC | honesty caption | existence | **not drawn** by `UI Final` (present only in prev frame line 373-386; D-009 does not reassign it) | drawn on step 2: `left 36 / right 36 / bottom 14 / 13 / 400 / lh 19 / #8B8882` (morning.tsx:177-179) | **MISMATCH** |
| MTC | pill vs discs | mutual exclusion | frame draws the pill only | step 2 draws discs and no pill; step 6 draws the pill and no discs (morning.tsx:154,171-183) | match (D-009) |

---

## Section D — `Morning 5 Done` (21D7)

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| M5 | dawn band | left / right | `0` / `0` | `0` / `0` (kit.tsx:530) | match |
| M5 | dawn band | top | `150` → 96 | `top={96}` (morning.tsx:294) | match |
| M5 | dawn band | height | `300` | `300` (kit.tsx:530) | match |
| M5 | dawn band | overflow | `hidden` | `hidden` (kit.tsx:530) | match |
| M5 | dawn band | gradient angle | `180deg` | vertical default (kit.tsx:531) | match |
| M5 | dawn band | stop 1 | `#EFEEE8 0%` | `#EFEEE8` (kit.tsx:531) | match |
| M5 | dawn band | stop 2 | `#F3EEE1 100%` | `#F3EEE1` (kit.tsx:531) | match |
| M5 | sun glow | left | `126` (absolute; 0.5 left of the 196.5 centre line) | `'50%'` − 70 = 126.5 on a 393 frame (kit.tsx:532) | **MISMATCH** (0.5pt) |
| M5 | sun glow | top | `20` | `20` (kit.tsx:532) | match |
| M5 | sun glow | width × height | `140 × 140` | `size={140}` (kit.tsx:532) | match |
| M5 | sun glow | radius | `50%` | `Circle r = 70` (kit.tsx:41) | match |
| M5 | sun glow | stops | `rgba(226,186,120,0.4)` → `rgba(226,186,120,0) 74%` | `#E2BA78` @ 0.4 → 0 at 0.74 (kit.tsx:532) | match |
| M5 | sun glow | filter | `blur(4px)` | none | **MISMATCH\*** (RN has no CSS blur; substitute = gradient falloff) |
| M5 | sun disc | left | `177` (absolute) | `'50%'` − 19 = 177.5 on a 393 frame (kit.tsx:533) | **MISMATCH** (0.5pt) |
| M5 | sun disc | top | `71` | `71` (kit.tsx:533) | match |
| M5 | sun disc | width × height | `38 × 38` | `38 × 38` (kit.tsx:533) | match |
| M5 | sun disc | radius | `50%` | `19` (kit.tsx:533) | match |
| M5 | sun disc | background | `#E9D2A4` | `#E9D2A4` (kit.tsx:533) | match |
| M5 | hill 1 | left / right | `−70` / `−70` | `−70` / `−70` (kit.tsx:534) | match |
| M5 | hill 1 | top | `192` | `192` (kit.tsx:534) | match |
| M5 | hill 1 | height | `150` | `150` (kit.tsx:534) | match |
| M5 | hill 1 | border-radius | `50% 50% 0 0 / 68px 68px 0 0` | SVG arc `rx = w/2`, `ry = 68`, flat foot (kit.tsx:79,534) | match (RN cannot express elliptical corner radii; the arc is exact, not a substitute) |
| M5 | hill 1 | background | `#DEDDD6` | `#DEDDD6` (kit.tsx:534) | match |
| M5 | hill 2 | left / right / top / height | `−130` / `−40` / `218` / `150` | identical (kit.tsx:535) | match |
| M5 | hill 2 | corner ry / colour | `58px` / `#CFCEC7` | `ry 58` / `#CFCEC7` (kit.tsx:535) | match |
| M5 | hill 3 | left / right / top / height | `−40` / `−140` / `244` / `150` | identical (kit.tsx:536) | match |
| M5 | hill 3 | corner ry / colour | `50px` / `#C5C4BD` | `ry 50` / `#C5C4BD` (kit.tsx:536) | match |
| M5 | hills | clipping | parent 300 tall, `overflow:hidden` (hill 3 runs to 394) | same parent, `overflow:'hidden'` (kit.tsx:530) | match |
| M5 | band | z-order | gradient → glow → sun → hill 1 → hill 2 → hill 3 | identical (kit.tsx:531-536) | match |
| M5 | badge wrapper | left / right | `0` / `0` | `0` / `0` (kit.tsx:644) | match |
| M5 | badge wrapper | top | `492` → 438 | `top={438}` (morning.tsx:295) | match |
| M5 | badge wrapper | justify | `center` | `alignItems: 'center'` (column axis) (kit.tsx:644) | match |
| M5 | badge disc | width × height | `64 × 64` | `64 × 64` (kit.tsx:647-648) | match |
| M5 | badge disc | radius | `50%` | `32` (kit.tsx:649) | match |
| M5 | badge disc | background | `#FFFFFF` | `#FFFFFF` (kit.tsx:650) | match |
| M5 | badge disc | box-shadow | `0 0 0 1px rgba(0,0,0,0.07), 0 8px 18px rgba(40,38,32,0.12)` | same string (kit.tsx:651) | match |
| M5 | badge disc | align / justify | `center` / `center` | `center` / `center` (kit.tsx:652-653) | match |
| M5 | laurel | source | `laurel-mark.webp` | `assets/images/laurel-mark.webp` (kit.tsx:22,656) | match |
| M5 | laurel | width × height | `34 × 34` | `34 × 34` (kit.tsx:656) | match |
| M5 | laurel | object-fit | `contain` | `contentFit="contain"` (kit.tsx:656) | match |
| M5 | headline | text | `Day 13, underway.` | `` `Day ${day}, underway.` `` (morning.tsx:296) | match |
| M5 | headline | left / right | `0` / `0` | `0` / `0` (kit.tsx:671) | match |
| M5 | headline | top | `580` → 526 | `top={526}` (morning.tsx:296) | match |
| M5 | headline | text-align | `center` | `center` prop (kit.tsx:671) | match |
| M5 | headline | font-size | `27` | `27` (kit.tsx:671) | match |
| M5 | headline | weight | `500` | `sans('500')` (kit.tsx:671) | match |
| M5 | headline | letter-spacing | `−0.1` | `−0.1` (kit.tsx:671) | match |
| M5 | headline | colour | `#1D1C1A` | `#1D1C1A` (kit.tsx:671) | match |
| M5 | sub-line | text | `Pledge signed · 13-day run` | `` `Pledge signed · ${day}-day run` `` (morning.tsx:296) | match |
| M5 | sub-line | left / right | `0` / `0` | `0` / `0` (kit.tsx:674) | match |
| M5 | sub-line | top | `622` → 568 | `top + 42` = 568 (kit.tsx:674) | match |
| M5 | sub-line | text-align | `center` | `center` prop (kit.tsx:674) | match |
| M5 | sub-line | font-size | `14.5` | `14.5` (kit.tsx:674) | match |
| M5 | sub-line | weight | `400` | `sans('400')` (kit.tsx:674) | match |
| M5 | sub-line | colour | `#8B8882` | `#8B8882` (kit.tsx:674) | match |
| M5 | badge check variant | — | not drawn on this frame (laurel) | `mark="laurel"` (morning.tsx:295) | match |

---

## Findings

Four real MISMATCHes and four MISMATCH\* platform gaps, in order of consequence.

1. **`src/app/day/morning.tsx:177-179` — an element `UI Final` deleted is still drawn.**
   Current: step 2 renders `Honesty counts more than the streak.` at
   `left 36 / right 36 / bottom 14 (= canvas 48) / fontSize 13 / weight 400 / lineHeight 19 / #8B8882`.
   Design: the final `Morning-Task-Check` frame draws no such line. It exists only in
   `.uifinal/pretty/prev/Email Login/Morning-Task-Check.html` line 373-386, and D-009's
   resolution enumerates exactly three properties step 2 keeps from the old board — the
   moon, `Last night`, and the two answer discs. The caption is not among them, and
   D-008's "withdrawn boards keep their previous drawing" does not apply because this
   board is *not* withdrawn: `UI Final` redraws it and drops the line. Either delete it
   or extend D-009 to cover it; as it stands the app draws an unsanctioned element.

2. **`src/app/day/morning.tsx:197` — the urge row's detail is not the drawn copy.**
   Current: `lastUrge.type === 'urge_rode_out' ? 'rode it out' : 'logged'`.
   Design: `passed in 4 min` (frame line 423) — a duration, not a verdict.
   `convex/schema.ts:131-146` gives `events` no duration or `endedAt` field, so the
   drawn string cannot be computed today. Closing it needs a schema field; the row's
   geometry, weight (500) and colour (`#8B8882`) are already right.

3. **`src/components/day/kit.tsx:532` — `DawnBand` glow is 0.5pt right of the drawn position.**
   Current: `left: '50%', marginLeft: -70` → 126.5 on a 393 frame.
   Design: `left:126px` (frame line 164). The canvas uses the `left:50% / margin-left`
   idiom elsewhere (`LedgerMark`) and an absolute `left` here, so 126 is deliberate.

4. **`src/components/day/kit.tsx:533` — `DawnBand` sun disc is 0.5pt right of the drawn position.**
   Current: `left: '50%', marginLeft: -19` → 177.5 on a 393 frame.
   Design: `left:177px` (frame line 175). Same cause as #3; both elements agree on a
   196 centre line, so this is the canvas's own convention rather than a drafting slip.

5. **Platform gaps (MISMATCH\*), no app-side fix available:**
   - `kit.tsx:408` — `filter: blur(2px)` on the M1 ledger glow. Substitute: the radial
     gradient's own falloff.
   - `kit.tsx:409` — `filter: blur(7px)` on the M1 cast shadow, which is a *solid*
     `rgba(40,38,32,0.10)` ellipse in CSS. Substitute: `SoftShadow`, a gradient ellipse
     at full alpha to 55% then ramped to 0 at the unblurred boundary — it therefore does
     not spread past the original 180 × 20 box the way a real 7px blur does.
   - `kit.tsx:532` — `filter: blur(4px)` on the M5 sun glow. Same substitute as above.
   - `kit.tsx:906` — `text-wrap: pretty` on the action card's line. Applied on web via
     the AppText body variant; native falls back to platform greedy wrapping.

**Row count: 345 comparison rows** — Section A 58, Section B 123 (B1 59, B2 10, B3 54),
Section C 107 (C1 15, C2 46, C3 26, C4 20), Section D 56 — plus a 3-row
coordinate-arithmetic table and the 8-row D-009 evidence table. Nine rows carry a
MISMATCH verdict (five real, four platform gaps, two of which — the M1 cast shadow's
solid fill and its `blur(7px)` — are the same substitution counted on two properties).
Everything else in the three frames matches the app literal for literal, including every
SVG `viewBox` and verbatim path `d`, every gradient stop and its position, every radius,
shadow string and hex.
