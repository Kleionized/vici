# Property audit — urge log flow, Data & privacy, App lock

Frames (byte-identical between the last-built bundle and the current one — the design did not
move; nothing below is inherited from a previous pass):

| # | Frame | Pretty source | App file |
|---|-------|---------------|----------|
| 1 | Urge-Log-Intensity | `.uifinal/pretty/final/Email Login/Urge-Log-Intensity.html` | `src/app/urge-log.tsx` |
| 2 | Urge-Log-Trigger | `.uifinal/pretty/final/Email Login/Urge-Log-Trigger.html` | `src/app/urge-log.tsx` |
| 3 | Urge-Log-Outcome | `.uifinal/pretty/final/Email Login/Urge-Log-Outcome.html` | `src/app/urge-log.tsx` |
| 4 | Urge-Log-When | `.uifinal/pretty/final/Email Login/Urge-Log-When.html` | `src/app/urge-log.tsx` |
| 5 | Urge-Log-Done | `.uifinal/pretty/final/Email Login/Urge-Log-Done.html` | `src/app/urge-log.tsx` |
| 6 | Data-Privacy | `.uifinal/pretty/final/Email Login/Data-Privacy.html` | `src/app/privacy.tsx` |
| 7 | App-Lock | `.uifinal/pretty/final/Email Login/App-Lock.html` | `src/app/applock.tsx` |

Supporting app files read in full: `src/components/ui/marks.tsx`, `src/components/ui/AppText.tsx`,
`src/components/ui/IntensityBands.tsx`, `src/components/ui/Grain.tsx`,
`src/components/ui/press-scale.tsx`, `src/lib/theme.ts`.

## Method notes

- **Pretty frames verified against raw.** Declaration multisets extracted from
  `.uifinal/final/Email Login/<Frame>.html` and `.uifinal/pretty/final/Email Login/<Frame>.html`
  are identical for all seven frames (156/288/241/344/181/168/188 declarations respectively). No
  value in this audit is taken on trust from the pretty printer.
- **Canvas → app offset.** Every canvas `top` includes the 54px status bar the app never builds, so
  the app equivalent is `canvas top − 54`. Both numbers are given in every offset row.
- **Text metrics are measured, not eyeballed.** Wrap-dependent offsets were measured with
  `NSAttributedString.boundingRect` at the real system face and size (Swift, `AppKit`); the numbers
  appear inline where they are load-bearing.
- **Nothing was edited.** This is read-only.

Measured line counts used below:

| String | Size / weight | Column | Single-line width | Wrapped height | Lines |
|---|---|---|---|---|---|
| "Your journal, urges and Life Map stay on your device and your private account. We never sell your data, ever." | 14.5 regular | 300pt | 719.13pt | 51.00pt @ 17pt natural | **3** |
| "This work is personal. Keep VICI behind Face ID so it opens only for you." | 14 regular | 313pt | 464.09pt | 34.00pt @ 17pt natural | **2** |
| "How strong was the urge?" | 22 medium | 305pt | 253.63pt | — | **1** |
| "What set it off?" | 22 medium | 305pt | 148.23pt | — | **1** |
| "What did you do?" | 22 medium | 305pt | 169.90pt | — | **1** |
| "When was it?" | 22 medium | 305pt | 129.93pt | — | **1** |
| "Late night · Boredom" | 14.5 medium | 305pt row | 142.15pt | — | **1** |
| "Deleting your account erases … undone." | 13 regular | 337pt | 591.58pt | — | **2** |
| "Hides journal previews … app switcher." | 13 regular | 337pt | 456.85pt | — | **2** |

---

## A · Shared flow chrome (frames 1–4; frame 5 draws none of it)

App source: `FlowTop` / `Heading` / `PrimaryButton`, `src/app/urge-log.tsx:61–111`.

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| 1–5 | Screen field | background | `#F4F3F0` | `colors.bg` = `#F4F3F0` (theme.ts:29, urge-log.tsx:453) | match |
| 1–5 | Screen field | width × height | 393 × 852 | device frame (393 × 852 reference) | match |
| 1–5 | Screen field | overflow | `hidden` | n/a — no scroller on the flow steps | match |
| 1–5 | Grain layer | background-image | `url('noise-dark.png')` | `require('../../assets/images/noise-dark.png')` (urge-log.tsx:27) | match |
| 1–5 | Grain layer | opacity | `0.07` | `0.07` (urge-log.tsx:456) | match |
| 1–5 | Grain layer | inset | `0` | `position:absolute; top/left/right/bottom: 0` (Grain.tsx:16) | match |
| 1–5 | Grain layer | tiling | CSS `background-image` with no `background-size` → repeats at file size | `resizeMode="repeat"` (Grain.tsx:17) | match |
| 1–5 | Grain layer | pointer-events | `none` | `pointerEvents="none"` (Grain.tsx:16) | match |
| 1–5 | Root type | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | iOS `'System'` (theme.ts:163–170) | match |
| 1–5 | Root type | letter-spacing | not set (0) | AppText drops the inherited variant tracking whenever a caller names its own `fontSize` without `letterSpacing` (AppText.tsx:119–138) | match |
| 1–4 | Back control | left | `16px` | `16` (urge-log.tsx:69) | match |
| 1–4 | Back control | top | canvas `66px` → app `12` | `12` (urge-log.tsx:69) | match |
| 1–4 | Back control | flex-direction | `row` | `'row'` (urge-log.tsx:69) | match |
| 1–4 | Back control | align-items | `center` | `'center'` (urge-log.tsx:69) | match |
| 1–4 | Back control | gap | `9px` | `9` (urge-log.tsx:69) | match |
| 1–4 | Back chevron | size / viewBox | `11 × 19`, `0 0 11 19` | `width={11} height={19} viewBox="0 0 11 19"` (marks.tsx:207) | match |
| 1–4 | Back chevron | path `d` | `M9.5 1.5L2 9.5l7.5 8` | `M9.5 1.5L2 9.5l7.5 8` (marks.tsx:208) | match |
| 1–4 | Back chevron | stroke | `#55534E` | `'#55534E'` passed at urge-log.tsx:70 | match |
| 1–4 | Back chevron | stroke-width | `2.4` | `2.4` (marks.tsx:208) | match |
| 1–4 | Back chevron | stroke-linecap / linejoin | `round` / `round` | `round` / `round` (marks.tsx:208) | match |
| 1–4 | Back chevron | fill | `none` | `"none"` (marks.tsx:208) | match |
| 1–4 | "Back" label | font-size | `17px` | `17` (urge-log.tsx:71) | match |
| 1–4 | "Back" label | font-weight | `400` | `sans('400')` (urge-log.tsx:71) | match |
| 1–4 | "Back" label | color | `#55534E` | `'#55534E'` (urge-log.tsx:71) | match |
| 1–4 | Close control | right | `22px` | `22` (urge-log.tsx:83) | match |
| 1–4 | Close control | top | canvas `70px` → app `16` | `16` (urge-log.tsx:83) | match |
| 1–4 | Close glyph | size / viewBox | `20 × 20`, `0 0 20 20` | `size={20}`, `viewBox="0 0 20 20"` (marks.tsx:216, urge-log.tsx:84) | match |
| 1–4 | Close glyph | path `d` | `M3 3l14 14M17 3L3 17` | `M3 3l14 14M17 3L3 17` (marks.tsx:217) | match |
| 1–4 | Close glyph | stroke / width / linecap | `#55534E` / `2` / `round` | `'#55534E'` / `2` / `round` (marks.tsx:217, urge-log.tsx:84) | match |
| 1–4 | Step-bar row | left / right | `0` / `0` | `0` / `0` (urge-log.tsx:73) | match |
| 1–4 | Step-bar row | top | canvas `74px` → app `20` | `20` (urge-log.tsx:73) | match |
| 1–4 | Step-bar row | justify-content | `center` | `'center'` (urge-log.tsx:73) | match |
| 1–4 | Step-bar row | gap | `8px` | `8` (urge-log.tsx:73) | match |
| 1–4 | Step bar | width × height | `36 × 4` | `36 × 4` (urge-log.tsx:75) | match |
| 1–4 | Step bar | border-radius | `2px` | `2` (urge-log.tsx:75) | match |
| 1–4 | Step bar | count | 4 | `steps={4}` (urge-log.tsx:459) | match |
| 1–4 | Step bar | filled colour | `#131313` | `'#131313'` (urge-log.tsx:75) | match |
| 1–4 | Step bar | empty colour | `rgba(0,0,0,0.14)` | `'rgba(0,0,0,0.14)'` (urge-log.tsx:75) | match |
| 1 | Step bars | fill pattern | bar 1 ink, bars 2–4 `rgba(0,0,0,0.14)` | `bar <= index` with `index = 0` | match |
| 2 | Step bars | fill pattern | bars 1–2 ink, 3–4 faint | `index = 1` | match |
| 3 | Step bars | fill pattern | bars 1–3 ink, 4 faint | `index = 2` | match |
| 4 | Step bars | fill pattern | all 4 ink | `index = 3` | match |
| 5 | Chrome | back / bars / close | none drawn | `step < 4 ? <FlowTop/> : null` (urge-log.tsx:459) | match |
| 1–4 | Heading | left / right | `44px` / `44px` | `44` / `44` (urge-log.tsx:95) | match |
| 1–4 | Heading | top | canvas `138px` → app `84` | `84` (urge-log.tsx:95) | match |
| 1–4 | Heading | text-align | `center` | `center` prop (urge-log.tsx:94) | match |
| 1–4 | Heading | font-size | `22px` | `22` (urge-log.tsx:95) | match |
| 1–4 | Heading | font-weight | `500` | `sans('500')` (urge-log.tsx:95) | match |
| 1–4 | Heading | line-height | `30px` | `30` (urge-log.tsx:95) | match |
| 1–4 | Heading | letter-spacing | `0.1px` | `0.1` (urge-log.tsx:95) | match |
| 1–4 | Heading | color | `#1D1C1A` | `'#1D1C1A'` (urge-log.tsx:95) | match |
| 1–4 | Heading | text-wrap | `balance` | native: nothing; web: `textWrap:'pretty'` for the `body` variant (AppText.tsx:126–129) | **MISMATCH\*** — RN has no `text-wrap`; inert here (all four headings measure ≤ 253.63pt in a 305pt box → one line) |
| 1–5 | Primary pill | left / right | `24px` / `24px` | footer `paddingHorizontal: 24` (urge-log.tsx:568) | match |
| 1–5 | Primary pill | top | canvas `744px` → app `690` | footer-anchored: 852 − 34 safe-bottom − 16 padding − 58 height = canvas 744 (urge-log.tsx:568) | match |
| 1–5 | Primary pill | height | `58px` | `58` (urge-log.tsx:107) | match |
| 1–5 | Primary pill | border-radius | `29px` | `29` (urge-log.tsx:107) | match |
| 1–5 | Primary pill | background | `#131313` | `'#131313'` (urge-log.tsx:107) | match |
| 1–5 | Primary pill | align / justify | `center` / `center` | `'center'` / `'center'` (urge-log.tsx:107) | match |
| 1–5 | Primary label | font-size | `17px` | `17` (urge-log.tsx:108) | match |
| 1–5 | Primary label | font-weight | `600` | `sans('600')` (urge-log.tsx:108) | match |
| 1–5 | Primary label | letter-spacing | `0.2px` | `0.2` (urge-log.tsx:108) | match |
| 1–5 | Primary label | color | `#FFFFFF` | `'#FFFFFF'` (urge-log.tsx:108) | match |
| 1–5 | Primary pill | disabled state | not drawn | `opacity: 0.34` when `enabled === false` (urge-log.tsx:107) | n/a — state undrawn |

---

## B · Frame 1 — Urge-Log-Intensity

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| 1 | Heading text | content | "How strong was the urge?" | same (urge-log.tsx:463) | match |
| 1 | Disc row | left / right | `24px` / `24px` | `24` / `24` (urge-log.tsx:119) | match |
| 1 | Disc row | top | canvas `330px` → app `276` | `276` (urge-log.tsx:119) | match |
| 1 | Disc row | flex-direction | `row` (default) | `'row'` (urge-log.tsx:119) | match |
| 1 | Disc row | justify-content | `space-between` | `'space-between'` (urge-log.tsx:119) | match |
| 1 | Disc row | derived inter-disc gap | (345 − 5 × 48) / 4 = 26.25 | same layout → 26.25 | match |
| 1 | Disc | width × height | `48 × 48` | `48 × 48` (urge-log.tsx:131–132) | match |
| 1 | Disc | border-radius | `50%` | `24` (urge-log.tsx:133) | match |
| 1 | Disc, resting | background | `#FFFFFF` | `'#FFFFFF'` (urge-log.tsx:134) | match |
| 1 | Disc, resting | box-shadow | `inset 0 0 0 1.5px rgba(0,0,0,0.12)` | `'inset 0 0 0 1.5px rgba(0,0,0,0.12)'` (urge-log.tsx:135) | match |
| 1 | Disc, selected | background | `#131313` | `'#131313'` (urge-log.tsx:134) | match |
| 1 | Disc, selected | box-shadow | `0 0 0 2px #F4F3F0, 0 0 0 4px #131313` | `'0 0 0 2px #F4F3F0, 0 0 0 4px #131313'` (urge-log.tsx:135) | match |
| 1 | Disc, selected | align / justify | `center` / `center` | `'center'` / `'center'` (urge-log.tsx:136–137) | match |
| 1 | Selected pip | width × height | `11 × 11` | `11 × 11` (urge-log.tsx:139) | match |
| 1 | Selected pip | border-radius | `50%` | `5.5` (urge-log.tsx:139) | match |
| 1 | Selected pip | background | `#F4F3F0` | `'#F4F3F0'` (urge-log.tsx:139) | match |
| 1 | Disc row | which disc is inked | 4th of 5 (index 3) | `useState(3)` (urge-log.tsx:418) | match |
| 1 | Scale captions | left / right | `24px` / `24px` | `24` / `24` (urge-log.tsx:144) | match |
| 1 | Scale captions | top | canvas `394px` → app `340` | `340` (urge-log.tsx:144) | match |
| 1 | Scale captions | justify-content | `space-between` | `'space-between'` (urge-log.tsx:144) | match |
| 1 | Scale captions | font-size | `12.5px` | `12.5` (urge-log.tsx:145–146) | match |
| 1 | Scale captions | font-weight | `500` | `sans('500')` (urge-log.tsx:145–146) | match |
| 1 | Scale captions | color | `#8B8882` | `'#8B8882'` (urge-log.tsx:145–146) | match |
| 1 | Scale captions | content | "Faint" / "Overwhelming" | same (urge-log.tsx:145–146) | match |
| 1 | Band label | left / right / top | `0` / `0` / canvas `460px` → app `406` | `0` / `0` / `406` (urge-log.tsx:148) | match |
| 1 | Band label | text-align | `center` | `center` prop (urge-log.tsx:148) | match |
| 1 | Band label | font-size | `19px` | `19` (urge-log.tsx:148) | match |
| 1 | Band label | font-weight | `600` | `sans('600')` (urge-log.tsx:148) | match |
| 1 | Band label | color | `#1D1C1A` | `'#1D1C1A'` (urge-log.tsx:148) | match |
| 1 | Band label | content | "Intense" | `INTENSITY_BANDS[3].label` = `'Intense'` (IntensityBands.tsx:18) | match |
| 1 | Band note | left / right / top | `0` / `0` / canvas `490px` → app `436` | `0` / `0` / `436` (urge-log.tsx:151) | match |
| 1 | Band note | text-align | `center` | `center` prop (urge-log.tsx:151) | match |
| 1 | Band note | font-size | `13.5px` | `13.5` (urge-log.tsx:151) | match |
| 1 | Band note | font-weight | `400` | `sans('400')` (urge-log.tsx:151) | match |
| 1 | Band note | color | `#8B8882` | `'#8B8882'` (urge-log.tsx:151) | match |
| 1 | Band note | content | "Hard to resist" | `INTENSITY_BANDS[3].note` = `'Hard to resist'` (IntensityBands.tsx:18) | match |
| 1 | Primary label | content | "Continue" | `'Continue'` (urge-log.tsx:569) | match |

---

## C · Frame 2 — Urge-Log-Trigger

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| 2 | Heading text | content | "What set it off?" | same (urge-log.tsx:470) | match |
| 2 | Subtitle | left / right | `0` / `0` | `0` / `0` (urge-log.tsx:471) | match |
| 2 | Subtitle | top | canvas `186px` → app `132` | `132` (urge-log.tsx:471) | match |
| 2 | Subtitle | text-align | `center` | `center` prop (urge-log.tsx:471) | match |
| 2 | Subtitle | font-size | `14.5px` | `14.5` (urge-log.tsx:471) | match |
| 2 | Subtitle | font-weight | `400` | `sans('400')` (urge-log.tsx:471) | match |
| 2 | Subtitle | color | `#55534E` | `'#55534E'` (urge-log.tsx:471) | match |
| 2 | Subtitle | content | "Tap all that apply." | same (urge-log.tsx:472) | match |
| 2 | Grid | left / right | `24px` / `24px` | `GRID_GUTTER = 24` (urge-log.tsx:160, 474) | match |
| 2 | Grid | top | canvas `234px` → app `180` | `180` (urge-log.tsx:474) | match |
| 2 | Grid | columns | `grid-template-columns: 1fr 1fr 1fr` | `flexWrap:'wrap'` with `width = floor((393 − 48 − 24)/3) = 107` (urge-log.tsx:164–166) | match — exact at 393 (321/3 = 107, no remainder) |
| 2 | Grid | gap (row & column) | `12px` | `GRID_GAP = 12` (urge-log.tsx:161, 474) | match |
| 2 | Grid | tile count / rows | 9 tiles, 3 rows → 3 × 112 + 2 × 12 = 360 | 9 tiles wrapping at 3 → 360 | match |
| 2 | Trigger tile | height | `112px` | `112` (urge-log.tsx:176) | match |
| 2 | Trigger tile | border-radius | `18px` | `18` (urge-log.tsx:177) | match |
| 2 | Trigger tile | background | `#FFFFFF` | `'#FFFFFF'` (urge-log.tsx:178) | match |
| 2 | Trigger tile, resting | box-shadow | `0 0 0 1px rgba(0,0,0,0.10)` | `'0 0 0 1px rgba(0,0,0,0.10)'` (urge-log.tsx:179) | match |
| 2 | Trigger tile, selected | box-shadow | `0 0 0 1.8px #131313` | `'0 0 0 1.8px #131313'` (urge-log.tsx:179) | match |
| 2 | Trigger tile | flex-direction | `column` | default column (urge-log.tsx:174–183) | match |
| 2 | Trigger tile | align / justify | `center` / `center` | `'center'` / `'center'` (urge-log.tsx:180–181) | match |
| 2 | Trigger tile | gap | `10px` | `10` (urge-log.tsx:182) | match |
| 2 | Icon disc | width × height | `46 × 46` | `46 × 46` (urge-log.tsx:184) | match |
| 2 | Icon disc | border-radius | `50%` | `23` (urge-log.tsx:184) | match |
| 2 | Icon disc, resting | background | `#F1EFE9` | `'#F1EFE9'` (urge-log.tsx:184) | match |
| 2 | Icon disc, selected | background | `#131313` | `'#131313'` (urge-log.tsx:184) | match |
| 2 | Trigger glyph | size / viewBox | `24 × 24`, `0 0 24 24` | `width={24} height={24} viewBox="0 0 24 24"` (marks.tsx:149) | match |
| 2 | Trigger glyph | colour, resting | `#1D1C1A` | `'#1D1C1A'` (urge-log.tsx:185) | match |
| 2 | Trigger glyph | colour, selected | `#F4F3F0` | `'#F4F3F0'` (urge-log.tsx:185) | match |
| 2 | Tile label | font-size | `14px` | `14` (urge-log.tsx:187) | match |
| 2 | Tile label | font-weight, resting | `500` | `sans('500')` (urge-log.tsx:187) | match |
| 2 | Tile label | font-weight, selected | `600` | `sans('600')` (urge-log.tsx:187) | match |
| 2 | Tile label | color | `#1D1C1A` | `'#1D1C1A'` (urge-log.tsx:187) | match |
| 2 | Tile order | content | Stress, Boredom, Lonely, Tired, Social, Phone, Late night, Argument, Craving | same order (urge-log.tsx:29–39) | match |
| 2 | Selected tiles | which | Boredom (2nd), Late night (7th) | any subset; label weight + disc + shadow all key off `selected` | match |

### C.1 · Trigger glyph geometry, path by path

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| 2 | Stress | path `d` | `M13 2L4 13h6l-1 9 9-12h-6z` | identical (marks.tsx:150) | match |
| 2 | Stress | fill | `#1D1C1A` | `{color}` | match |
| 2 | Boredom | ring | `circle cx=12 cy=12 r=9`, stroke-width `2.1`, fill `none` | identical (marks.tsx:153) | match |
| 2 | Boredom | mouth `d` | `M8.5 14.5h7`, stroke-width `2.1`, linecap `round` | identical (marks.tsx:154) | match |
| 2 | Boredom | eyes | `circle cx=9 cy=10 r=1.2`, `circle cx=15 cy=10 r=1.2`, filled | identical (marks.tsx:155–156) | match |
| 2 | Boredom | stroke colour (selected) | `#F4F3F0` | `{color}` = `'#F4F3F0'` | match |
| 2 | Lonely | head | `circle cx=12 cy=8 r=4`, filled | identical (marks.tsx:161) | match |
| 2 | Lonely | body `d` | `M4.5 20c0-3.9 3.4-6.2 7.5-6.2S19.5 16.1 19.5 20z` | identical (marks.tsx:162) | match |
| 2 | Tired | path 1 `d` | `M13 3h6l-6 7h6` | identical (marks.tsx:167) | match |
| 2 | Tired | path 2 `d` | `M4 13h5l-5 6h5` | identical (marks.tsx:168) | match |
| 2 | Tired | stroke-width / linecap / linejoin | `2.5` / `round` / `round` | `2.5` / `round` / `round` (marks.tsx:167–168) | match |
| 2 | Social | circles | `cx=8.5 cy=8.5 r=3.3`, `cx=16 cy=9.5 r=2.7` | identical (marks.tsx:173–174) | match |
| 2 | Social | body `d` | `M2.5 19c0-3.2 2.7-5 6-5s6 1.8 6 5z` | identical (marks.tsx:175) | match |
| 2 | Social | shoulder `d` | `M14.5 14.2c2.6.2 5 1.8 5 4.8h-3.2z` | identical (marks.tsx:176) | match |
| 2 | Phone | body rect | `x=6 y=2.5 w=12 h=19 rx=3`, fill `#1D1C1A` | identical, fill `{color}` (marks.tsx:181) | match |
| 2 | Phone | screen rect | `x=8 y=5 w=8 h=11 rx=1`, fill `#F1EFE9` | identical, fill hardcoded `'#F1EFE9'` (marks.tsx:182) | match in the drawn (resting) state |
| 2 | Phone | screen rect, selected | not drawn — no frame in the bundle selects Phone | stays `#F1EFE9` on a `#131313` disc (marks.tsx:182–183) | **MISMATCH** (inferred) — every drawn selected tile flips its glyph ink to `#F4F3F0`; the cutout should track the disc |
| 2 | Phone | home dot | `circle cx=12 cy=18.6 r=1`, fill `#F1EFE9` | identical, hardcoded (marks.tsx:183) | same as above |
| 2 | Late night | path `d` | `M20.1 15.1A8.7 8.7 0 1 1 8.9 3.9 8.7 8.7 0 0 0 20.1 15.1Z` | identical (marks.tsx:186) | match |
| 2 | Late night | fill | `#F4F3F0` (selected) | `{color}` | match |
| 2 | Late night | fill-rule | `evenodd` (present in both Urge-Log-Trigger and Lapse-Trigger) | attribute absent → `nonzero` (marks.tsx:186) | **MISMATCH** — literal missing; renders identically because the crescent is a simple closed curve (the two arcs meet only at their shared endpoints) |
| 2 | Argument | bubble 1 `d` | `M3 5.5A1.5 1.5 0 0 1 4.5 4h9A1.5 1.5 0 0 1 15 5.5v5A1.5 1.5 0 0 1 13.5 12H8l-3.4 3v-3H4.5A1.5 1.5 0 0 1 3 10.5z` | identical (marks.tsx:189) | match |
| 2 | Argument | bubble 2 `d` | `M17 9h3a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1v2.5L16.5 16H12a1 1 0 0 1-1-1z` | identical (marks.tsx:190) | match |
| 2 | Argument | bubble 2 opacity | `0.55` | `0.55` (marks.tsx:190) | match |
| 2 | Craving | path `d` | `M12 22c4.5-2.4 7-5.6 7-9.4 0-3-2-5-4.3-5-1.5 0-2.4.8-2.7 2-.3-1.2-1.2-2-2.7-2#1D1C1A7 7.2 5 9.2 5 12.2 5 16 7.5 19.2 12 22z` | `…-1.2-1.2-2-2.7-2C7 7.2 5 9.2 5 12.2 5 16 7.5 19.2 12 22z` (marks.tsx:196) | match — the **design literal is corrupt**: the token `#1D1C1A` sits inside the path data (identically in `Urge-Log-Trigger.html` and `Lapse-Trigger.html`), so the design string is unrenderable. The app substitutes the only command that consumes the following six numbers, `C`. |

### C.2 · Frame 2 primary pill

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| 2 | Primary label | content | "Continue · 2" (`&middot;`, U+00B7) | `` `Continue · ${triggers.length}` `` with U+00B7 (urge-log.tsx:571) | match |
| 2 | Primary label | zero-selection form | not drawn | `'Continue'` + `enabled={false}` (urge-log.tsx:571) | n/a — state undrawn |

---

## D · Frame 3 — Urge-Log-Outcome

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| 3 | Heading text | content | "What did you do?" | same (urge-log.tsx:484) | match |
| 3 | Rows | left / right | `24px` / `24px` | `24` / `24` (urge-log.tsx:202–203) | match |
| 3 | Row 1 | top | canvas `210px` → app `156` | `156 + 0 × 76` = 156 (urge-log.tsx:486) | match |
| 3 | Row 2 | top | canvas `286px` → app `232` | `156 + 1 × 76` = 232 | match |
| 3 | Row 3 | top | canvas `362px` → app `308` | `156 + 2 × 76` = 308 | match |
| 3 | Row 4 | top | canvas `438px` → app `384` | `156 + 3 × 76` = 384 | match |
| 3 | Row 5 | top | canvas `514px` → app `460` | `156 + 4 × 76` = 460 | match |
| 3 | Outcome row | height | `64px` | `64` (urge-log.tsx:205) | match |
| 3 | Outcome row | border-radius | `18px` | `18` (urge-log.tsx:206) | match |
| 3 | Outcome row | background | `#FFFFFF` | `'#FFFFFF'` (urge-log.tsx:207) | match |
| 3 | Outcome row, resting | box-shadow | `0 0 0 1px rgba(0,0,0,0.10)` | same (urge-log.tsx:208) | match |
| 3 | Outcome row, selected | box-shadow | `0 0 0 1.8px #131313` | same (urge-log.tsx:208) | match |
| 3 | Outcome row | flex-direction | `row` | `'row'` (urge-log.tsx:209) | match |
| 3 | Outcome row | align-items | `center` | `'center'` (urge-log.tsx:210) | match |
| 3 | Outcome row | gap | `14px` | `14` (urge-log.tsx:211) | match |
| 3 | Outcome row | padding | `0 18px` | `paddingHorizontal: 18` (urge-log.tsx:212) | match |
| 3 | Icon tile | width × height | `42 × 42` | `42 × 42` (urge-log.tsx:216–217) | match |
| 3 | Icon tile | border-radius | `12px` | `12` (urge-log.tsx:218) | match |
| 3 | Icon tile | flex-shrink | `0` | not set → RN default `0` (urge-log.tsx:214–222) | match |
| 3 | Icon tile, resting | background | `#F1EFE9` | `'#F1EFE9'` (urge-log.tsx:219) | match |
| 3 | Icon tile, selected | background | `#131313` | `'#131313'` (urge-log.tsx:219) | match |
| 3 | Icon tile | align / justify | `center` / `center` | `'center'` / `'center'` (urge-log.tsx:220–221) | match |
| 3 | Outcome glyph | size / viewBox | `22 × 22`, `0 0 24 24` | `width={22} height={22} viewBox="0 0 24 24"` (marks.tsx:80, 90, 101, 111, 126) | match |
| 3 | Outcome glyph | stroke, resting | `#55534E` | `'#55534E'` (urge-log.tsx:223) | match |
| 3 | Outcome glyph | stroke, selected | `#F4F3F0` | `'#F4F3F0'` (urge-log.tsx:223) | match |
| 3 | Row label | flex | `1` | `flex: 1` (urge-log.tsx:225) | match |
| 3 | Row label | font-size | `15px` | `15` (urge-log.tsx:225) | match |
| 3 | Row label | font-weight, resting | `500` | `sans('500')` (urge-log.tsx:225) | match |
| 3 | Row label | font-weight, selected | `600` | `sans('600')` (urge-log.tsx:225) | match |
| 3 | Row label | color | `#1D1C1A` | `'#1D1C1A'` (urge-log.tsx:225) | match |
| 3 | Radio pip | width × height | `22 × 22` | `22 × 22` (urge-log.tsx:228–229) | match |
| 3 | Radio pip | border-radius | `50%` | `11` (urge-log.tsx:230) | match |
| 3 | Radio pip | flex-shrink | `0` | not set → RN default `0` | match |
| 3 | Radio pip, resting | box-shadow | `inset 0 0 0 2px rgba(0,0,0,0.18)` | same (urge-log.tsx:234) | match |
| 3 | Radio pip, resting | background | not set (transparent) | `'transparent'` (urge-log.tsx:233) | match |
| 3 | Radio pip, selected | background | `#131313` | `'#131313'` (urge-log.tsx:233) | match |
| 3 | Radio pip, selected | box-shadow | none | `undefined` (urge-log.tsx:234) | match |
| 3 | Check glyph | size / viewBox | `13 × 13`, `0 0 24 24` | `size={13}`, `viewBox="0 0 24 24"` (marks.tsx:244, urge-log.tsx:236) | match |
| 3 | Check glyph | path `d` | `M5 12.5l4.5 4.5L19 7` | identical (marks.tsx:245) | match |
| 3 | Check glyph | stroke / width / caps | `#FFFFFF` / `3` / `round`+`round`, fill `none` | identical (marks.tsx:245, urge-log.tsx:236) | match |
| 3 | Row 1 glyph | "Rode it out" paths | `M2 13c4-6 8 2 11-2s6 1 9-2` sw `2.1` linecap `round`; `M4 17.5h16` sw `1.9` linecap `round` opacity `0.5` | identical (marks.tsx:81–82) | match |
| 3 | Row 2 glyph | "Surfed with the timer" | `circle cx=12 cy=13 r=8` sw `2`; `M12 9v4l2.6 2` sw `2` linecap `round`; `M9.5 3h5` sw `2` linecap `round` | identical (marks.tsx:91–93) | match |
| 3 | Row 3 glyph | "Distracted myself" | `circle cx=12 cy=12 r=9` sw `2` fill `none`; `M15.5 8.5l-2 5-5 2 2-5z` filled | identical (marks.tsx:102–103) | match |
| 3 | Row 4 glyph | "Reached out" | `M12 20c4.2-2.3 6.6-5.2 6.6-8.7 0-2.8-1.9-4.6-4-4.6-1.4 0-2.3.7-2.6 1.8-.3-1.1-1.2-1.8-2.6-1.8-2.1 0-4 1.8-4 4.6 0 3.5 2.4 6.4 6.6 8.7z` sw `2` fill `none` linejoin `round` | identical (marks.tsx:113–117) | match |
| 3 | Row 5 glyph | "I slipped" | `M19 14.5A7.8 7.8 0 1 1 9.5 5 6.2 6.2 0 0 0 19 14.5z` sw `2` fill `none` linejoin `round` | identical (marks.tsx:127) | match |
| 3 | Row labels | content | Rode it out / Surfed with the timer / Distracted myself / Reached out / I slipped | same order (urge-log.tsx:43–49) | match |
| 3 | Selection | which row | row 1, "Rode it out" | `useState(0)` (urge-log.tsx:420) | match |
| 3 | Primary label | content | "Continue" | `'Continue'` (urge-log.tsx:573) | match |

---

## E · Frame 4 — Urge-Log-When

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| 4 | Heading text | content | "When was it?" | same (urge-log.tsx:493) | match |
| 4 | Chip row | left / right / top | `0` / `0` / canvas `206px` → app `152` | `0` / `0` / `152` (urge-log.tsx:494) | match |
| 4 | Chip row | justify-content | `center` | `'center'` (urge-log.tsx:494) | match |
| 4 | Chip row | gap | `10px` | `10` (urge-log.tsx:494) | match |
| 4 | Chip row | derived total width | 99.44 + 123.06 + 105.67 + 2 × 10 = 348.17 in 393 | same measurement | match — fits centred, no wrap |
| 4 | Chip | padding | `13px 20px` | `paddingVertical: 13`, `paddingHorizontal: 20` (urge-log.tsx:509–510) | match |
| 4 | Chip | border-radius | `24px` | `24` (urge-log.tsx:511) | match |
| 4 | Chip, selected | background | `#131313` | `'#131313'` (urge-log.tsx:512) | match |
| 4 | Chip, selected | box-shadow | none | `undefined` (urge-log.tsx:513) | match |
| 4 | Chip, resting | background | `#FFFFFF` | `'#FFFFFF'` (urge-log.tsx:512) | match |
| 4 | Chip, resting | box-shadow | `0 0 0 1px rgba(0,0,0,0.10)` | same (urge-log.tsx:513) | match |
| 4 | Chip label | font-size | `14px` | `14` (urge-log.tsx:515) | match |
| 4 | Chip label | font-weight | `500` | `sans('500')` (urge-log.tsx:515) | match |
| 4 | Chip label | color, selected | `#FFFFFF` | `'#FFFFFF'` (urge-log.tsx:515) | match |
| 4 | Chip label | color, resting | `#1D1C1A` | `'#1D1C1A'` (urge-log.tsx:515) | match |
| 4 | Chip labels | content | Just now / Earlier today / Yesterday | same (urge-log.tsx:51–55) | match |
| 4 | Chip selection | which | "Just now" | `when = 0`, `customAt == null` (urge-log.tsx:421, 496) | match |
| 4 | "Specify time" | left / right / top | `0` / `0` / canvas `276px` → app `222` | `0` / `0` / `222` (urge-log.tsx:524) | match |
| 4 | "Specify time" | text-align | `center` | `alignItems: 'center'` (urge-log.tsx:524) | match |
| 4 | "Specify time" | font-size | `14px` | `14` (urge-log.tsx:525) | match |
| 4 | "Specify time" | font-weight | `500` | `sans('500')` (urge-log.tsx:525) | match |
| 4 | "Specify time" | color | `#55534E` | `'#55534E'` (urge-log.tsx:525) | match |
| 4 | Time wheel | rendered at rest | drawn — the frame shows the wheel with "Just now" still chip-selected | hidden: `showWheel` starts `false` (urge-log.tsx:422) and the card is gated at urge-log.tsx:527 | **MISMATCH** — the frame's default state is not reachable without tapping "Specify time" |
| 4 | Wheel card | left / right | `24px` / `24px` | `24` / `24` (urge-log.tsx:292–293) | match |
| 4 | Wheel card | top | canvas `330px` → app `276` | `276` (urge-log.tsx:294) | match |
| 4 | Wheel card | border-radius | `20px` | `20` (urge-log.tsx:295) | match |
| 4 | Wheel card | background | `#FFFFFF` | `'#FFFFFF'` (urge-log.tsx:296) | match |
| 4 | Wheel card | box-shadow | `0 0 0 1px rgba(0,0,0,0.10)` | same (urge-log.tsx:297) | match |
| 4 | Wheel card | overflow | `hidden` | `'hidden'` (urge-log.tsx:298) | match |
| 4 | Wheel body | padding | `8px 12px` | `paddingVertical: 8`, `paddingHorizontal: 12` (urge-log.tsx:300) | match |
| 4 | Wheel body | justify-content | `center` | `'center'` (urge-log.tsx:300) | match |
| 4 | Highlight band | left / right | `12px` / `12px` | `12` / `12` (urge-log.tsx:303) | match |
| 4 | Highlight band | top | `50%` + `translateY(-50%)` → padding box 5 × 34 + 16 = 186; 93 − 18 = **75** | `75` (urge-log.tsx:303) | match — numerically identical; the app hardcodes the resolved value because RN would need a percentage transform |
| 4 | Highlight band | height | `36px` | `36` (urge-log.tsx:303) | match |
| 4 | Highlight band | border-radius | `10px` | `10` (urge-log.tsx:303) | match |
| 4 | Highlight band | background | `rgba(0,0,0,0.045)` | `'rgba(0,0,0,0.045)'` (urge-log.tsx:303) | match |
| 4 | Highlight band | z-order | first child, painted under the columns (columns are `position:relative`) | first child in source order, columns after (urge-log.tsx:303–307) | match |
| 4 | Date column | width | `132px` | `132` (urge-log.tsx:304) | match |
| 4 | Hour column | width | `42px` | `42` (urge-log.tsx:305) | match |
| 4 | Minute column | width | `48px` | `48` (urge-log.tsx:306) | match |
| 4 | Meridiem column | width | `42px` | `42` (urge-log.tsx:307) | match |
| 4 | Wheel row | height | `34px` | `34` (urge-log.tsx:257) | match |
| 4 | Wheel row | align / justify | `center` / `center` | `'center'` / `'center'` (urge-log.tsx:257) | match |
| 4 | Wheel row | rows per column | 5 | 5 (`[-2,-1,0,1,2]`, urge-log.tsx:276–286) | match |
| 4 | Wheel row, picked | font-size | `21px` | `21` (urge-log.tsx:261) | match |
| 4 | Wheel row, picked | font-weight | `500` | `sans('500')` (urge-log.tsx:260) | match |
| 4 | Wheel row, picked | opacity | `1` | `WHEEL_FADE[0]` = `1` (urge-log.tsx:245, 261) | match |
| 4 | Wheel row, ±1 | font-size / weight | `18px` / `400` | `18` / `sans('400')` (urge-log.tsx:260–261) | match |
| 4 | Wheel row, ±1 | opacity | `0.42` | `WHEEL_FADE[1]` = `0.42` | match |
| 4 | Wheel row, ±2 | font-size / weight | `18px` / `400` | `18` / `sans('400')` | match |
| 4 | Wheel row, ±2 | opacity | `0.16` | `WHEEL_FADE[2]` = `0.16` | match |
| 4 | Wheel row | color | `#1D1C1A` | `'#1D1C1A'` (urge-log.tsx:261) | match |
| 4 | Date column | value format | `Sat Jul 18` / `Today` in the picked row | `` `${WEEKDAY[d]} ${MONTH[m]} ${date}` ``, `'Today'` when it is today (urge-log.tsx:276–281) | match |
| 4 | Hour column | value format | `9 10 11 12 1` (unpadded, 12-hour) | `String(((hour12 - 1 + step + 12) % 12) + 1)` (urge-log.tsx:282) | match |
| 4 | Minute column | value format | `38 39 40 41 42` (2-digit) | `padStart(2, '0')` (urge-log.tsx:283) | match |
| 4 | Meridiem column | fill pattern | row 0 `AM` @0.42, row 1 `PM` @1 (21/500), rows 2–4 empty @0.42/0.16/0.16 | `['AM','PM','','','']` with `pick = pm ? 1 : 0` (urge-log.tsx:286, 307) | match — reproduces the drawn PM case row for row |
| 4 | Wheel footer | border-top | `1px solid rgba(0,0,0,0.09)` | `borderTopWidth: 1`, `borderTopColor: 'rgba(0,0,0,0.09)'` (urge-log.tsx:309) | match |
| 4 | Cancel | flex | `1` | `flex: 1` (urge-log.tsx:310) | match |
| 4 | Cancel | padding | `15px 0` | `paddingVertical: 15` (urge-log.tsx:310) | match |
| 4 | Cancel | text-align | `center` | `alignItems: 'center'` (urge-log.tsx:310) | match |
| 4 | Cancel | font-size / weight / color | `16px` / `400` / `#55534E` | `16` / `sans('400')` / `'#55534E'` (urge-log.tsx:311) | match |
| 4 | Footer divider | width / background | `1px` / `rgba(0,0,0,0.09)` | `1` / `'rgba(0,0,0,0.09)'` (urge-log.tsx:313) | match |
| 4 | Save | flex / padding / align | `1` / `15px 0` / `center` | `1` / `paddingVertical: 15` / `'center'` (urge-log.tsx:314) | match |
| 4 | Save | font-size | `15.5px` | `15.5` (urge-log.tsx:315) | match |
| 4 | Save | font-weight | `600` | `sans('600')` (urge-log.tsx:315) | match |
| 4 | Save | color | `#131313` | `'#131313'` (urge-log.tsx:315) | match |
| 4 | Primary label | content | "Log the urge" | `'Log the urge'` (urge-log.tsx:574) | match |
| 4 | Primary label | in-flight form | not drawn | `'Logging…'` + disabled (urge-log.tsx:574) | n/a — state undrawn |

---

## F · Frame 5 — Urge-Log-Done

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| 5 | Illustration box | left | `86px` | `86` (urge-log.tsx:327) | match |
| 5 | Illustration box | top | canvas `130px` → app `76` | `76` (urge-log.tsx:327) | match |
| 5 | Illustration box | width × height | `220 × 160` | `220 × 160` (urge-log.tsx:327) | match |
| 5 | Glow | left / top | `44px` / `6px` | `44` / `6` (urge-log.tsx:330) | match |
| 5 | Glow | width × height | `130 × 130` | `130 × 130` (urge-log.tsx:330) | match |
| 5 | Glow | border-radius | `50%` | ellipse `rx=65 ry=65` on a 130 box (urge-log.tsx:337) | match |
| 5 | Glow | gradient type | `radial-gradient(closest-side, …)` | `RadialGradient rx="50%" ry="50%"` on a square bbox → r = 65 = closest side (urge-log.tsx:332) | match |
| 5 | Glow | stop 1 | `rgba(226,186,120,0.36)` @ 0% | `#E2BA78` @ opacity `0.36`, offset `0` (urge-log.tsx:333) — `#E2BA78` = rgb(226,186,120) | match |
| 5 | Glow | stop 2 | `rgba(226,186,120,0)` @ 74% | `#E2BA78` @ opacity `0`, offset `0.74` (urge-log.tsx:334) | match |
| 5 | Glow | filter | `blur(4px)` | none | **MISMATCH\*** — RN SVG has no blur filter; the app draws the ramp hard, leaving the ~2px softening at the 74% kink unmodelled |
| 5 | Ground shadow | left / top | `50px` / `134px` | `50` / `134` (urge-log.tsx:341) | match |
| 5 | Ground shadow | width × height | `120 × 12` | `120 × 12` (urge-log.tsx:341) | match |
| 5 | Ground shadow | border-radius | `50%` | ellipse `rx=60 ry=6` (urge-log.tsx:349) | match |
| 5 | Ground shadow | fill | flat `rgba(0,0,0,0.10)` | 3-stop radial ramp: `#000` @0.1 (0), @0.055 (0.6), @0 (1) (urge-log.tsx:344–346) | **MISMATCH\*** — the design's flat fill only reads as a shadow once blurred; RN SVG has no blur, so the app substitutes the falloff |
| 5 | Ground shadow | filter | `blur(4px)` | none (substituted as above) | **MISMATCH\*** — same substitution |
| 5 | Back page | left / top | `48px` / `38px` | `48` / `38` (urge-log.tsx:351) | match |
| 5 | Back page | width × height | `126 × 94` | `126 × 94` (urge-log.tsx:351) | match |
| 5 | Back page | border-radius | `10px` | `10` (urge-log.tsx:351) | match |
| 5 | Back page | background | `#E0DFDA` | `'#E0DFDA'` (urge-log.tsx:351) | match |
| 5 | Back page | transform | `rotate(-2deg)` | `[{ rotate: '-2deg' }]` (urge-log.tsx:351) | match |
| 5 | Back page | transform-origin | default (centre) | default (centre) | match |
| 5 | Front page | left / top | `54px` / `32px` | `54` / `32` (urge-log.tsx:355–356) | match |
| 5 | Front page | width × height | `114 × 94` | `114 × 94` (urge-log.tsx:357–358) | match |
| 5 | Front page | border-radius | `8px` | `8` (urge-log.tsx:359) | match |
| 5 | Front page | background | `#F7F6F2` | `'#F7F6F2'` (urge-log.tsx:360) | match |
| 5 | Front page | box-shadow | `0 0 0 1px rgba(0,0,0,0.05)` | same (urge-log.tsx:361) | match |
| 5 | Front page | transform | `rotate(-2deg)` | `[{ rotate: '-2deg' }]` (urge-log.tsx:362) | match |
| 5 | Spine | left / top | `110px` / `34px` | `110` / `34` (urge-log.tsx:365) | match |
| 5 | Spine | width × height | `2 × 88` | `2 × 88` (urge-log.tsx:365) | match |
| 5 | Spine | background | `#E0DFDA` | `'#E0DFDA'` (urge-log.tsx:365) | match |
| 5 | Spine | transform | `rotate(-2deg)` | `[{ rotate: '-2deg' }]` (urge-log.tsx:365) | match |
| 5 | Rule 1 | left / top / size / radius / fill | `66` / `54` / `34 × 4` / `2` / `#E0DFDA` | identical (urge-log.tsx:366) | match |
| 5 | Rule 2 | left / top / size / radius / fill | `66` / `68` / `34 × 4` / `2` / `#E0DFDA` | identical (urge-log.tsx:367) | match |
| 5 | Rule 3 | left / top / size / radius / fill | `122` / `52` / `34 × 4` / `2` / `#E0DFDA` | identical (urge-log.tsx:368) | match |
| 5 | Pen | left / top | `140px` / `84px` | `140` / `84` (urge-log.tsx:373–374) | match |
| 5 | Pen | width × height | `64 × 8` | `64 × 8` (urge-log.tsx:375–376) | match |
| 5 | Pen | border-radius | `4px` | `4` (urge-log.tsx:377) | match |
| 5 | Pen | background | `#55534E` | `'#55534E'` (urge-log.tsx:378) | match |
| 5 | Pen | transform | `rotate(-28deg)` | `[{translateX:-32},{rotate:'-28deg'},{translateX:32}]` (urge-log.tsx:379) | match |
| 5 | Pen | transform-origin | `left center` | reproduced by the ±32 bracket: the composed matrix `T(−32)·R·T(+32)` about the centre has its fixed point at `−32x̂`, i.e. the left-centre edge | match — algebraically equivalent |
| 5 | Check badge | left / top | `170px` / `26px` | `170` / `26` (urge-log.tsx:383) | match |
| 5 | Check badge | width × height | `30 × 30` | `30 × 30` (urge-log.tsx:383) | match |
| 5 | Check badge | border-radius | `50%` | `15` (urge-log.tsx:383) | match |
| 5 | Check badge | background | `#131313` | `'#131313'` (urge-log.tsx:383) | match |
| 5 | Check badge | align / justify | `center` / `center` | `'center'` / `'center'` (urge-log.tsx:383) | match |
| 5 | Badge glyph | size / viewBox | `13 × 13`, `0 0 14 14` | `width={13} height={13} viewBox="0 0 14 14"` (urge-log.tsx:384) | match |
| 5 | Badge glyph | path `d` | `M2.5 7.5l3 3 6-7` | identical (urge-log.tsx:385) | match |
| 5 | Badge glyph | stroke / width / caps / fill | `#F4F3F0` / `2.2` / `round`+`round` / `none` | identical (urge-log.tsx:385) | match |
| 5 | Title | left / right / top | `0` / `0` / canvas `316px` → app `262` | `0` / `0` / `262` (urge-log.tsx:545) | match |
| 5 | Title | text-align | `center` | `center` prop (urge-log.tsx:545) | match |
| 5 | Title | font-size | `27px` | `27` (urge-log.tsx:545) | match |
| 5 | Title | font-weight | `500` | `sans('500')` (urge-log.tsx:545) | match |
| 5 | Title | letter-spacing | `-0.2px` | `-0.2` (urge-log.tsx:545) | match |
| 5 | Title | line-height | not set | dropped by AppText because the caller names `fontSize` without `lineHeight` (AppText.tsx:119, 139) | match |
| 5 | Title | color | `#1D1C1A` | `'#1D1C1A'` (urge-log.tsx:545) | match |
| 5 | Title | content | "Urge logged." | same (urge-log.tsx:546) | match |
| 5 | Summary card | left / right | `24px` / `24px` | `24` / `24` (urge-log.tsx:551–552) | match |
| 5 | Summary card | top | canvas `376px` → app `322` | `322` (urge-log.tsx:553) | match |
| 5 | Summary card | border-radius | `18px` | `18` (urge-log.tsx:554) | match |
| 5 | Summary card | background | `#FFFFFF` | `'#FFFFFF'` (urge-log.tsx:555) | match |
| 5 | Summary card | box-shadow | `0 0 0 1px rgba(0,0,0,0.09)` | same (urge-log.tsx:556) | match |
| 5 | Summary card | padding | `4px 20px` | `paddingVertical: 4`, `paddingHorizontal: 20` (urge-log.tsx:557–558) | match |
| 5 | Summary row | flex-direction / align / justify | `row` / `center` / `space-between` | `'row'` / `'center'` / `'space-between'` (urge-log.tsx:396–398) | match |
| 5 | Summary row | padding | `15px 0` | `paddingVertical: 15` (urge-log.tsx:399) | match |
| 5 | Summary rows 1–2 | border-bottom | `1px solid rgba(0,0,0,0.06)` | `borderBottomWidth: 1`, `borderBottomColor: 'rgba(0,0,0,0.06)'` (urge-log.tsx:400–401) | match |
| 5 | Summary row 3 | border-bottom | none | `last` → `borderBottomWidth: 0` (urge-log.tsx:400, 562) | match |
| 5 | Summary label | font-size | `12.5px` | `12.5` (urge-log.tsx:403) | match |
| 5 | Summary label | font-weight | `600` | `sans('600')` (urge-log.tsx:403) | match |
| 5 | Summary label | color | `#8B8882` | `'#8B8882'` (urge-log.tsx:403) | match |
| 5 | Summary labels | content | Intensity / Set off by / What I did | same (urge-log.tsx:560–562) | match |
| 5 | Summary value | font-size | `14.5px` | `14.5` (urge-log.tsx:406) | match |
| 5 | Summary value | font-weight | `500` | `sans('500')` (urge-log.tsx:406) | match |
| 5 | Summary value | color | `#1D1C1A` | `'#1D1C1A'` (urge-log.tsx:406) | match |
| 5 | Summary value | flex-shrink | `1` (CSS flex-item default) | `flexShrink: 1` (urge-log.tsx:406) | match |
| 5 | Summary value | text-align | not set → inherits `left` | `'right'` (urge-log.tsx:406) | **MISMATCH** — inert on the drawn content (label 59.22 + value 142.15 = 201.37 in a 305pt row → one line, right-hugging either way); diverges the moment a value wraps |
| 5 | Summary value | max lines | none | `numberOfLines={2}` (urge-log.tsx:406) | **MISMATCH** — inert on the drawn content; clamps a long trigger join the design would let wrap |
| 5 | Summary values | content | Intense / Late night · Boredom / Rode it out | band label, `triggers.join(' · ')`, outcome label (urge-log.tsx:560–562) | match — the design's separator is U+00B7, so is the app's; join order follows tap order |
| 5 | Summary value | empty-trigger form | not drawn | `'—'` (urge-log.tsx:561) | n/a — state undrawn |
| 5 | Primary label | content | "Done" | `'Done'` (urge-log.tsx:575) | match |

---

## G · Frame 6 — Data-Privacy

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| 6 | Screen field | background | `#F4F3F0` | `colors.bg` (privacy.tsx:33) | match |
| 6 | Grain layer | image / opacity / inset | `noise-dark.png` / `0.07` / `0` | same (privacy.tsx:35) | match |
| 6 | Back control | left | `16px` | `16` (privacy.tsx:44) | match |
| 6 | Back control | top | canvas `64px` → app `10` | `10` (privacy.tsx:44) | match |
| 6 | Back control | flex-direction / align / gap | `row` / `center` / `9px` | `'row'` / `'center'` / `9` (privacy.tsx:44) | match |
| 6 | Back chevron | size / viewBox / `d` | `11 × 19` / `0 0 11 19` / `M9.5 1.5L2 9.5l7.5 8` | identical (marks.tsx:207–208) | match |
| 6 | Back chevron | stroke | `#55534E` | `colors.textMuted` = `#55534E`, default (theme.ts:55, marks.tsx:205) | match |
| 6 | Back chevron | stroke-width / caps | `2.4` / `round`+`round` | `2.4` / `round`+`round` | match |
| 6 | Back label | font-size / weight / color | `17px` / `400` / `#55534E` | `17` / `sans('400')` / `'#55534E'` (privacy.tsx:46) | match |
| 6 | Back label | content | "Settings" | "Settings" (privacy.tsx:46) | match |
| 6 | Title | left | `16px` | `paddingHorizontal: 16` (privacy.tsx:50) | match |
| 6 | Title | top | canvas `114px` → app `60` | header box `height: 60` (privacy.tsx:38) then the title box | match |
| 6 | Title | font-size | `27px` | `27` (privacy.tsx:51) | match |
| 6 | Title | font-weight | `600` | `sans('600')` (privacy.tsx:51) | match |
| 6 | Title | letter-spacing | `-0.2px` | `-0.2` (privacy.tsx:51) | match |
| 6 | Title | color | `#1D1C1A` | `'#1D1C1A'` (privacy.tsx:51) | match |
| 6 | Title | content | "Data & privacy" | `Data &amp; privacy` (privacy.tsx:51) | match |
| 6 | Promise panel | left / right | `12px` / `12px` | `marginHorizontal: 12` (privacy.tsx:60) | match |
| 6 | Promise panel | top | canvas `172px` → app `118` | 60 (header) + 58 (title box) = 118 (privacy.tsx:38, 50) | match |
| 6 | Promise panel | border-radius | `16px` | `16` (privacy.tsx:62) | match |
| 6 | Promise panel | background | `#EDECE7` | `'#EDECE7'` (privacy.tsx:63) | match |
| 6 | Promise panel | padding | `16px 18px` | `paddingVertical: 16`, `paddingHorizontal: 18` (privacy.tsx:64–65) | match |
| 6 | Promise panel | flex-direction | `row` | `'row'` (privacy.tsx:66) | match |
| 6 | Promise panel | gap | `13px` | `13` (privacy.tsx:67) | match |
| 6 | Promise panel | align-items | `flex-start` | `'flex-start'` (privacy.tsx:68) | match |
| 6 | Promise panel | derived height | 3 × 21 + 32 = **95** → closes at canvas 267 / app 213 | same (measured: 3 lines at 300pt) | match |
| 6 | Shield | size / viewBox | `20 × 24` / `0 0 20 24` | `width={20} height={24} viewBox="0 0 20 24"` (privacy.tsx:71) | match |
| 6 | Shield | flex-shrink | `0` | not set → RN default `0` | match |
| 6 | Shield | margin-top | `2px` | `marginTop: 2` on the wrapper (privacy.tsx:70) | match |
| 6 | Shield | outline `d` | `M10 1l8 3v7c0 5.5-3.5 9.5-8 11-4.5-1.5-8-5.5-8-11V4z` | identical (privacy.tsx:72) | match |
| 6 | Shield | outline stroke / width / linejoin / fill | `#55534E` / `2` / `round` / `none` | identical (privacy.tsx:72) | match |
| 6 | Shield | tick `d` | `M6.5 11.5l2.5 2.5 4.5-5` | identical (privacy.tsx:73) | match |
| 6 | Shield | tick stroke / width / caps / fill | `#55534E` / `2` / `round`+`round` / `none` | identical (privacy.tsx:73) | match |
| 6 | Promise text | font-size | `14.5px` | `14.5` (privacy.tsx:76) | match |
| 6 | Promise text | font-weight | `400` | `sans('400')` (privacy.tsx:76) | match |
| 6 | Promise text | line-height | `21px` | `21` (privacy.tsx:76) | match |
| 6 | Promise text | color | `#55534E` | `'#55534E'` (privacy.tsx:76) | match |
| 6 | Promise text | width behaviour | flex item, `flex-shrink: 1` default → 300pt column | `flex: 1` → same 300pt column (privacy.tsx:76) | match |
| 6 | Promise text | content | "Your journal, urges and Life Map stay on your device and your private account. We never sell your data, ever." | same (privacy.tsx:77) | match |
| 6 | "Your data" caption | left | `16px` | `paddingHorizontal: 16` (privacy.tsx:113) | match |
| 6 | "Your data" caption | top | canvas `298px` → app `244` | 213 + `marginBottom: 31` = 244 (privacy.tsx:61) | match |
| 6 | "Your data" caption | font-size / weight / color | `13px` / `600` / `#55534E` | `13` / `sans('600')` / `'#55534E'` (privacy.tsx:114) | match |
| 6 | Caption → card gap | derived | 324 − 298 = `26px` | caption box `height: 26` (privacy.tsx:113) | match |
| 6 | "Your data" card | left / right | `12px` / `12px` | `marginHorizontal: 12` (privacy.tsx:116) | match |
| 6 | "Your data" card | top | canvas `324px` → app `270` | 244 + 26 = 270 | match |
| 6 | "Your data" card | border-radius | `16px` | `16` (privacy.tsx:116) | match |
| 6 | "Your data" card | background | `#FFFFFF` | `'#FFFFFF'` (privacy.tsx:116) | match |
| 6 | "Your data" card | padding | `4px 0` | `paddingVertical: 4` (privacy.tsx:81) | match |
| 6 | List row | height | `50px` | `50` (privacy.tsx:129) | match |
| 6 | List row | flex-direction / align | `row` / `center` | `'row'` / `'center'` (privacy.tsx:129) | match |
| 6 | List row | justify-content | `space-between` | title `flex: 1` pushes the trailing cluster to the end (privacy.tsx:130) | match |
| 6 | List row | padding | `0 18px` | `paddingHorizontal: 18` (privacy.tsx:129) | match |
| 6 | Row title | font-size / weight / color | `16px` / `500` / `#1D1C1A` | `16` / `sans('500')` / `'#1D1C1A'` (privacy.tsx:130) | match |
| 6 | Trailing cluster | flex-direction / align / gap | `row` / `center` / `10px` | `'row'` / `'center'` / `10` (privacy.tsx:132) | match |
| 6 | Detail "JSON" | font-size | `14px` | `14` (privacy.tsx:133) | match |
| 6 | Detail "JSON" | font-weight | not set → inherits `400` | `sans('400')` (privacy.tsx:133) | match |
| 6 | Detail "JSON" | color | `#8B8882` | `'#8B8882'` (privacy.tsx:133) | match |
| 6 | Chevron | size / viewBox | `8 × 14` / `0 0 8 14` | identical (marks.tsx:225) | match |
| 6 | Chevron | path `d` | `M1 1l6 6-6 6` | identical (marks.tsx:226) | match |
| 6 | Chevron | stroke | `#B0AEA8` | `color="#B0AEA8"` (privacy.tsx:134) | match |
| 6 | Chevron | stroke-width / caps / fill | `2` / `round`+`round` / `none` | identical (marks.tsx:226) | match |
| 6 | Divider | height | `1px` | `1` (privacy.tsx:143) | match |
| 6 | Divider | background | `rgba(0,0,0,0.06)` | `HAIRLINE` = `'rgba(0,0,0,0.06)'` (privacy.tsx:23, 143) | match |
| 6 | Divider | margin | `0 18px` | `marginHorizontal: 18` (privacy.tsx:143) | match |
| 6 | "Your data" rows | content | Export my data (JSON ›) / Privacy policy (›) / Terms of service (›) | same (privacy.tsx:82–86) | match |
| 6 | "Your data" card | derived height | 4 + 50 + 1 + 50 + 1 + 50 + 4 = **160** | same | match |
| 6 | "Controls" caption | top | canvas `514px` → app `460` | 270 + 160 + `gap: 30` = 460 (privacy.tsx:81) | match |
| 6 | "Controls" caption | left / font-size / weight / color | `16px` / `13px` / `600` / `#55534E` | same (privacy.tsx:113–114) | match |
| 6 | "Controls" card | top | canvas `540px` → app `486` | 460 + 26 = 486 | match |
| 6 | "Controls" card | left / right / radius / bg / padding | `12` / `12` / `16px` / `#FFFFFF` / `4px 0` | same (privacy.tsx:89, 116) | match |
| 6 | "Controls" rows | content | Pause analytics (toggle) / Delete account (›) | same (privacy.tsx:90–97) | match |
| 6 | Toggle track | width × height | `44 × 26` | `44 × 26` (privacy.tsx:149) | match |
| 6 | Toggle track | border-radius | `13px` | `13` (privacy.tsx:149) | match |
| 6 | Toggle track | background (on) | `#131313` | `'#131313'` (privacy.tsx:149) | match |
| 6 | Toggle track | flex-shrink | `0` | not set → RN default `0` | match |
| 6 | Toggle knob | right / top | `3px` / `3px` | `right: 3`, `top: 3` when on (privacy.tsx:151) | match |
| 6 | Toggle knob | width × height | `20 × 20` | `20 × 20` (privacy.tsx:151) | match |
| 6 | Toggle knob | border-radius | `50%` | `10` (privacy.tsx:151) | match |
| 6 | Toggle knob | background (on) | `#ffffff` | `'#ffffff'` (privacy.tsx:151) | match |
| 6 | Toggle | off state | not drawn | track `colors.borderStrong` = `rgba(0,0,0,0.14)`, knob `left: 3`, `#F2F2EE` (privacy.tsx:149–151) | n/a — state undrawn |
| 6 | Pause analytics | drawn value | on | `user?.settings.pauseAnalytics ?? false` → off by default (privacy.tsx:30) | n/a — user data, not a style |
| 6 | "Controls" card | derived height | 4 + 50 + 1 + 50 + 4 = **109** | same | match |
| 6 | Footnote | left / right | `28px` / `28px` | `marginHorizontal: 28` (privacy.tsx:100) | match |
| 6 | Footnote | top | canvas `664px` → app `610` | 486 + 109 + `marginTop: 15` = 610 (privacy.tsx:89, 100) | match |
| 6 | Footnote | font-size | `13px` | `13` (privacy.tsx:100) | match |
| 6 | Footnote | font-weight | `400` | `sans('400')` (privacy.tsx:100) | match |
| 6 | Footnote | line-height | `18.5px` | `18.5` (privacy.tsx:100) | match |
| 6 | Footnote | color | `#8B8882` | `'#8B8882'` (privacy.tsx:100) | match |
| 6 | Footnote | content | "Deleting your account erases your journal, urges and Life Map permanently. This can't be undone." | same (privacy.tsx:101) | match |
| 6 | Footnote | measured lines | 2 lines at 337pt | 2 lines | match |

---

## H · Frame 7 — App-Lock

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| 7 | Screen field | background | `#F4F3F0` | `colors.bg` (applock.tsx:37) | match |
| 7 | Grain layer | image / opacity / inset | `noise-dark.png` / `0.07` / `0` | same (applock.tsx:39) | match |
| 7 | Back control | left / top | `16px` / canvas `64px` → app `10` | `16` / `10` (applock.tsx:48) | match |
| 7 | Back control | flex-direction / align / gap | `row` / `center` / `9px` | `'row'` / `'center'` / `9` (applock.tsx:48) | match |
| 7 | Back chevron | size / viewBox / `d` / stroke / width / caps | `11 × 19` / `0 0 11 19` / `M9.5 1.5L2 9.5l7.5 8` / `#55534E` / `2.4` / `round` | identical (marks.tsx:207–208, applock.tsx:49) | match |
| 7 | Back label | font-size / weight / color / content | `17px` / `400` / `#55534E` / "Settings" | same (applock.tsx:50) | match |
| 7 | Title | left | `16px` | `paddingHorizontal: 16` (applock.tsx:54) | match |
| 7 | Title | top | canvas `114px` → app `60` | header box `height: 60` (applock.tsx:42) | match |
| 7 | Title | font-size / weight / letter-spacing / color | `27px` / `600` / `-0.2px` / `#1D1C1A` | same (applock.tsx:55) | match |
| 7 | Title | content | "App lock" | "App lock" (applock.tsx:55) | match |
| 7 | Face disc | left / right / justify | `0` / `0` / `center` | `alignItems: 'center'` (applock.tsx:59) | match |
| 7 | Face disc | top | canvas `178px` → app `124` | 60 (header) + 64 (title box) = 124 (applock.tsx:42, 54) | match |
| 7 | Face disc | width × height | `92 × 92` | `92 × 92` (applock.tsx:60) | match |
| 7 | Face disc | border-radius | `50%` | `46` (applock.tsx:60) | match |
| 7 | Face disc | background | `#131313` | `'#131313'` (applock.tsx:60) | match |
| 7 | Face disc | align / justify | `center` / `center` | `'center'` / `'center'` (applock.tsx:60) | match |
| 7 | Face icon | size / viewBox | `40 × 40` / `0 0 40 40` | `width={40} height={40} viewBox="0 0 40 40"` (applock.tsx:61) | match |
| 7 | Face icon | bracket `d` | `M6 13V9a3 3 0 013-3h4M27 6h4a3 3 0 013 3v4M34 27v4a3 3 0 01-3 3h-4M13 34H9a3 3 0 01-3-3v-4` | identical (applock.tsx:62) | match |
| 7 | Face icon | bracket stroke / width / linecap / fill | `#F4F3F0` / `2.4` / `round` / `none` | identical (applock.tsx:62) | match |
| 7 | Face icon | features `d` | `M14 16v2M26 16v2M20 16v6h-2` | identical (applock.tsx:63) | match |
| 7 | Face icon | features stroke / width / caps / fill | `#F4F3F0` / `2.2` / `round`+`round` / `none` | identical (applock.tsx:63) | match |
| 7 | Face icon | smile `d` | `M14 26c1.6 1.8 3.6 2.8 6 2.8s4.4-1 6-2.8` | identical (applock.tsx:64) | match |
| 7 | Face icon | smile stroke / width / linecap / fill | `#F4F3F0` / `2.2` / `round` / `none` | identical (applock.tsx:64) | match |
| 7 | Blurb | left / right | `40px` / `40px` | `marginHorizontal: 40` (applock.tsx:71) | match |
| 7 | Blurb | top | canvas `296px` → app `242` | 124 + 92 + `marginTop: 26` = 242 (applock.tsx:71) | match |
| 7 | Blurb | text-align | `center` | `center` prop (applock.tsx:71) | match |
| 7 | Blurb | font-size | `14px` | `14` (applock.tsx:71) | match |
| 7 | Blurb | font-weight | `400` | `sans('400')` (applock.tsx:71) | match |
| 7 | Blurb | line-height | `20px` | `20` (applock.tsx:71) | match |
| 7 | Blurb | color | `#55534E` | `'#55534E'` (applock.tsx:71) | match |
| 7 | Blurb | content | "This work is personal. Keep VICI behind Face ID so it opens only for you." | same (applock.tsx:72) | match |
| 7 | Blurb | measured lines | 2 lines at 313pt → block height 40 | 2 lines | match |
| 7 | "Lock" caption | left | `16px` | `paddingHorizontal: 16` (applock.tsx:100) | match |
| 7 | "Lock" caption | top | canvas `370px` → app `316` | 242 + 40 + `marginBottom: 34` = 316 (applock.tsx:71) | match |
| 7 | "Lock" caption | font-size / weight / color | `13px` / `600` / `#55534E` | `13` / `sans('600')` / `'#55534E'` (applock.tsx:101) | match |
| 7 | Caption → card gap | derived | 396 − 370 = `26px` | caption box `height: 26` (applock.tsx:100) | match |
| 7 | "Lock" card | left / right | `12px` / `12px` | `marginHorizontal: 12` (applock.tsx:103) | match |
| 7 | "Lock" card | top | canvas `396px` → app `342` | 316 + 26 = 342 | match |
| 7 | "Lock" card | border-radius / background / padding | `16px` / `#FFFFFF` / `4px 0` | `16` / `'#FFFFFF'` / `paddingVertical: 4` (applock.tsx:75, 103) | match |
| 7 | List row | height / flex / align / padding | `50px` / `row` / `center` / `0 18px` | `50` / `'row'` / `'center'` / `paddingHorizontal: 18` (applock.tsx:116) | match |
| 7 | List row | justify-content | `space-between` | title `flex: 1` (applock.tsx:117) | match |
| 7 | Row title | font-size / weight / color | `16px` / `500` / `#1D1C1A` | `16` / `sans('500')` / `'#1D1C1A'` (applock.tsx:117) | match |
| 7 | "Lock" rows | content | Require Face ID (toggle) / Lock when I leave the app (toggle) / Ask after (Immediately ›) | same (applock.tsx:76–80) | match |
| 7 | Detail "Immediately" | font-size / weight / color | `14px` / inherited `400` / `#8B8882` | `14` / `sans('400')` / `'#8B8882'` (applock.tsx:120) | match |
| 7 | Trailing cluster | flex / align / gap | `row` / `center` / `10px` | `'row'` / `'center'` / `10` (applock.tsx:119) | match |
| 7 | Chevron | size / viewBox / `d` / stroke / width / caps | `8 × 14` / `0 0 8 14` / `M1 1l6 6-6 6` / `#B0AEA8` / `2` / `round` | identical (marks.tsx:225–226, applock.tsx:121) | match |
| 7 | Divider | height / background / margin | `1px` / `rgba(0,0,0,0.06)` / `0 18px` | `1` / `HAIRLINE` / `marginHorizontal: 18` (applock.tsx:23, 130) | match |
| 7 | Toggle track | width × height / radius / bg (on) / flex-shrink | `44 × 26` / `13px` / `#131313` / `0` | `44 × 26` / `13` / `'#131313'` / RN default `0` (applock.tsx:136) | match |
| 7 | Toggle knob | right / top / size / radius / bg (on) | `3px` / `3px` / `20 × 20` / `50%` / `#ffffff` | `3` / `3` / `20 × 20` / `10` / `'#ffffff'` (applock.tsx:138) | match |
| 7 | Toggle | off state | not drawn | track `rgba(0,0,0,0.14)`, knob `left: 3`, `#F2F2EE` (applock.tsx:136–138) | n/a — state undrawn |
| 7 | Toggles | drawn values | all three on | defaults: `appLockFaceId` false, `appLockOnLeave` false, `hideSensitivePreviews` true (applock.tsx:76, 78, 84) | n/a — user data, not a style |
| 7 | "Lock" card | derived height | 4 + 50 + 1 + 50 + 1 + 50 + 4 = **160** | same | match |
| 7 | "Privacy" caption | top | canvas `588px` → app `534` | 342 + 160 + `gap: 32` = 534 (applock.tsx:75) | match |
| 7 | "Privacy" caption | left / font-size / weight / color | `16px` / `13px` / `600` / `#55534E` | same (applock.tsx:100–101) | match |
| 7 | "Privacy" card | top | canvas `614px` → app `560` | 534 + 26 = 560 | match |
| 7 | "Privacy" card | left / right / radius / bg / padding | `12` / `12` / `16px` / `#FFFFFF` / `4px 0` | same (applock.tsx:83, 103) | match |
| 7 | "Privacy" row | content | Hide sensitive previews (toggle) | same (applock.tsx:84) | match |
| 7 | "Privacy" card | derived height | 4 + 50 + 4 = **58** | same | match |
| 7 | Footnote | left / right | `28px` / `28px` | `marginHorizontal: 28` (applock.tsx:87) | match |
| 7 | Footnote | top | canvas `692px` → app `638` | 560 + 58 + `marginTop: 20` = 638 (applock.tsx:83, 87) | match |
| 7 | Footnote | font-size / weight / line-height / color | `13px` / `400` / `18.5px` / `#8B8882` | same (applock.tsx:87) | match |
| 7 | Footnote | content | "Hides journal previews and entry titles in notifications and the app switcher." | same (applock.tsx:88) | match |
| 7 | Footnote | measured lines | 2 lines at 337pt | 2 lines | match |

---

## Findings

**509 comparison rows** written across the seven frames: **492 match**, **9 MISMATCH rows**
(4 of them `MISMATCH*` — CSS React Native cannot express), **8 n/a** (a state the design never
draws, or user data rather than styling).

The 9 mismatch rows group into **7 findings** — the Urge-Log-Done ground shadow contributes two rows
(fill and filter) and the summary value contributes two (text-align and max lines). In severity
order:

1. **Urge-Log-When — the time wheel is not drawn at rest.**
   `src/app/urge-log.tsx:422` — `const [showWheel, setShowWheel] = useState(false);`, gated at
   `src/app/urge-log.tsx:527`.
   Current: step 3 renders the three chips and the "Specify time" link only; the wheel appears after
   a tap.
   Design: `Urge-Log-When.html:213–539` draws the wheel card at canvas top 330 in the same state
   where "Just now" is still the selected chip and "Specify time" carries no active treatment — so
   the frame is the resting state of the step, not a tapped one.

2. **Trigger "Phone" glyph keeps a paper-coloured screen on the ink disc when selected.**
   `src/components/ui/marks.tsx:182` — `<Rect x={8} y={5} width={8} height={11} rx={1} fill="#F1EFE9" />`
   and `:183` — `<Circle cx={12} cy={18.6} r={1} fill="#F1EFE9" />`.
   Current: `#F1EFE9` hardcoded, so a selected Phone tile shows a cream screen sitting on the
   `#131313` disc.
   Design: no frame in the bundle draws a selected Phone tile (checked `Urge-Log-Trigger.html:400`
   and `Lapse-Trigger.html`; both draw it resting), so the value is inferred — every selected tile
   that *is* drawn flips its glyph ink to `#F4F3F0` (Boredom `Urge-Log-Trigger.html:232–239`,
   Late night `:422`). The cutout should track the disc, not stay paper.

3. **Trigger "Late night" glyph is missing `fill-rule="evenodd"`.**
   `src/components/ui/marks.tsx:186`.
   Current: no `fillRule` prop → SVG default `nonzero`.
   Design: `Urge-Log-Trigger.html:422` — `fill-rule="evenodd"`.
   The crescent is a simple closed curve (the two arcs meet only at their shared endpoints), so both
   rules paint the same pixels today; the literal is still absent.

4. **`MISMATCH*` — Urge-Log-Done ground shadow: flat fill + blur replaced by a radial ramp.**
   `src/app/urge-log.tsx:341–350`.
   Current: a three-stop radial gradient, `#000` at opacity `0.1` → `0.055` at 60% → `0` at 100%.
   Design: `Urge-Log-Done.html:92–102` — a flat `rgba(0,0,0,0.10)` ellipse with `filter: blur(4px)`.
   `react-native-svg` has no blur filter, so the falloff is the substitution; the app already
   documents it at `urge-log.tsx:339–340`.

5. **`MISMATCH*` — Urge-Log-Done glow drops `filter: blur(4px)`.**
   `src/app/urge-log.tsx:330–338`.
   Current: the two-stop `closest-side` ramp transferred literally, no blur.
   Design: `Urge-Log-Done.html:81–91` — the same ramp plus `filter: blur(4px)`.
   Unmodelled effect is the ~2px rounding of the kink at the 74% stop.

6. **`MISMATCH*` — flow headings drop `text-wrap: balance`.**
   `src/app/urge-log.tsx:95` via `AppText` (`src/components/ui/AppText.tsx:126–129`, which sets
   `textWrap: 'pretty'` on web for the `body` variant and nothing on native).
   Design: `text-wrap: balance` on all four step headings.
   Inert today — measured at 22pt medium in the 305pt box, the four headings are 253.63 / 148.23 /
   169.90 / 129.93pt wide, all one line.

7. **Urge-Log-Done summary value adds a right alignment and a 2-line clamp the design does not have.**
   `src/app/urge-log.tsx:406` — `numberOfLines={2}` and `textAlign: 'right'`.
   Design: `Urge-Log-Done.html:233–239, 255–261, 276–282` — the value span sets only `font-size`,
   `font-weight` and `color`; no `text-align` (inherits left) and no line clamp.
   Inert on the drawn content (label 59.22pt + value 142.15pt in a 305pt row → one line), but a
   longer trigger join wraps left-aligned in the design and truncates right-aligned in the app.

### Non-mismatch notes (recorded, not counted)

- **Corrupt design literal, correctly reconstructed.** The Craving glyph's path `d` contains the
  colour token `#1D1C1A` inside its command stream in *both* frames that use it
  (`Urge-Log-Trigger.html:492`, `Lapse-Trigger.html`), making the design string unrenderable. The
  app writes `C` in that position (`marks.tsx:196`), the only command that takes the six numbers
  that follow. Treated as a match against intent.
- **States the design never draws** (so no literal to audit): the disabled primary pill
  (`opacity: 0.34`), the "Logging…" label, the `'—'` empty-trigger value, and both toggles' off
  state (`rgba(0,0,0,0.14)` track, `#F2F2EE` knob).
- **Toggle values are user data, not styling.** The frames draw Pause analytics, Require Face ID,
  Lock when I leave the app and Hide sensitive previews all on; the app's defaults are off, off, off
  and on respectively.
- **Behavioural gaps outside the property audit:** `Export my data`, `Privacy policy`,
  `Terms of service`, `Delete account` (privacy.tsx:82–97) and `Ask after` (applock.tsx:80) render
  the disclosure chevron with no `onPress`.
- **Grid width generalisation.** `triggerTileWidth` floors, which is exact at the 393 canvas
  (321 / 3 = 107) but drops sub-pixel width on other screen widths where the design's `1fr` would
  not.
- **Highlight-band coupling.** The wheel band's `top: 75` is the resolved value of the design's
  `top: 50% + translateY(-50%)`; identical today, but it will not follow if the wheel ever changes
  row count or padding.
