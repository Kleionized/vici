# Property audit — Log tab + Lapse flow

Frames audited (read in full, pretty form, `.uifinal/pretty/final/Email Login/`):
`Log-Chooser.html`, `Lapse-When.html`, `Lapse-Trigger.html`, `Lapse-Done.html`,
`Log-Urges.html`, `Log-Check-ins.html`, `Log-Reports.html` — 7 frames.

App files read in full:
- `/Users/admin/Documents/tideline/src/app/(app)/log.tsx` (chooser + history)
- `/Users/admin/Documents/tideline/src/app/lapse.tsx` (3-step lapse flow)
- `/Users/admin/Documents/tideline/src/app/urge-log.tsx` — supplies `FlowTop`, `Heading`,
  `PrimaryButton`, `TriggerCard`, `TimeWheel`, `LoggedNote`, `SummaryRow`, `WHEN_CHIPS`,
  `TRIGGERS`, `GRID_GUTTER`, `GRID_GAP`, `triggerTileWidth` to `lapse.tsx`
- `/Users/admin/Documents/tideline/src/components/ui/marks.tsx` (`TriggerMark`, `BackGlyph`,
  `CloseGlyph`), `/Users/admin/Documents/tideline/src/components/ui/AppText.tsx`,
  `/Users/admin/Documents/tideline/src/components/ui/press-scale.tsx`,
  `/Users/admin/Documents/tideline/src/components/ui/Grain.tsx`,
  `/Users/admin/Documents/tideline/src/lib/theme.ts`,
  `/Users/admin/Documents/tideline/src/components/StoicTabBar.tsx`,
  `/Users/admin/Documents/tideline/src/app/(app)/_layout.tsx`

## Conventions

- Frame is 393 × 852. Every canvas `top` includes a 54px status bar the app never builds, so the
  **app-equivalent top = canvas top − 54**. Both numbers are given in every offset row as
  `canvas N → app N−54`.
- Absolute canvas y is used when comparing things anchored to the *bottom* of the frame.
- The app anchors its content at the device's real top safe-area inset (59pt on a 393 × 852
  iPhone), not the canvas's 54. That is a uniform +5pt shift on every screen in the app and is
  outside this audit's remit — it is recorded once here and not repeated per row.
- Nothing is rounded. Colours are compared as written, including alpha.

## Legend

| Mark | Meaning |
| --- | --- |
| match | app value is identical to the design literal |
| match† | literal differs but there is provably no rendering difference (or the design literal is corrupt/unrenderable and the app reproduces the intended geometry) — always explained in the row |
| MISMATCH | a real difference the app can close |
| MISMATCH\* | RN/react-native-svg cannot express the CSS; the substitute is named in the row |

Sample *content* that varies with user data (a trigger name, a mood word, a timestamp) is not
treated as a spec — only fixed chrome copy and format templates are. Where the design's sample
string is not derivable from any rule, the row says so.

---

## 1 · Log-Chooser (canvas 029) → `src/app/(app)/log.tsx`, chooser mode

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Log-Chooser | Frame | background | `#F4F3F0` | `colors.bg` = `#F4F3F0` (log.tsx:174) | match |
| Log-Chooser | Frame | font family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | iOS `System` via `sans()` (theme.ts:161-197) | match |
| Log-Chooser | Grain | background-image | `noise-dark.png` | `require('../../../assets/images/noise-dark.png')` (log.tsx:22) | match |
| Log-Chooser | Grain | opacity | `0.07` | `0.07` (log.tsx:175) | match |
| Log-Chooser | Grain | inset | `inset:0` | `top/left/right/bottom: 0` absolute (Grain.tsx) | match |
| Log-Chooser | Grain | tiling | `background-image` with no size ⇒ repeat at 96 × 96 | `resizeMode="repeat"` (Grain.tsx) | match |
| Log-Chooser | Grain | pointer-events | `none` | `pointerEvents="none"` on wrapper | match |
| Log-Chooser | Grain | z-order | first child, under all content | rendered before `SafeAreaView` (log.tsx:175-176) | match |
| Log-Chooser | Close X | position | `right:20px; top:66px` → app top 12 | `right: 20, top: 12` (log.tsx:182) | match |
| Log-Chooser | Close X | icon size | `18 × 18` | `width={18} height={18}` (log.tsx:183) | match |
| Log-Chooser | Close X | viewBox | `0 0 18 18` | `0 0 18 18` | match |
| Log-Chooser | Close X | path `d` | `M3 3l12 12M15 3L3 15` | `M3 3l12 12M15 3L3 15` | match |
| Log-Chooser | Close X | stroke | `#1D1C1A` | `#1D1C1A` | match |
| Log-Chooser | Close X | stroke-width | `2.2` | `2.2` | match |
| Log-Chooser | Close X | stroke-linecap | `round` | `round` | match |
| Log-Chooser | Close X | fill | attribute absent (default `black`) | `fill="none"` | match† — both subpaths are zero-area line runs; fill is a no-op either way |
| Log-Chooser | Title | top | `118px` → app 64 | `top: 64` (log.tsx:188) | match |
| Log-Chooser | Title | left / right | `30 / 30` | `left: 30, right: 30` | match |
| Log-Chooser | Title | text-align | `center` | `center` prop → `textAlign:'center'` | match |
| Log-Chooser | Title | font-size | `22px` | `22` | match |
| Log-Chooser | Title | font-weight | `500` | `sans('500')` | match |
| Log-Chooser | Title | line-height | `29px` | `29` | match |
| Log-Chooser | Title | letter-spacing | not set | not set — `AppText` drops the variant's `-0.1` when a caller names its own size (AppText.tsx:117-138) | match |
| Log-Chooser | Title | colour | `#2A2924` | `#2A2924` | match |
| Log-Chooser | Title | copy | `What are you logging?` | `What are you logging?` | match |
| Log-Chooser | Card 1/2/3 | top | `214 / 356 / 498` → app `160 / 302 / 444` | `CARD_TOP = [160, 302, 444]` (log.tsx:93) | match |
| Log-Chooser | Card | left / right | `56 / 56` | `left: 56, right: 56` (log.tsx:110-111) | match |
| Log-Chooser | Card | height | `128px` | `128` | match |
| Log-Chooser | Card | border-radius | `20px` (all four corners) | `borderRadius: 20` | match |
| Log-Chooser | Card | overflow | not set | `overflow: 'hidden'` (log.tsx:114) | match† — added only to clip the gradient child to the radius; the gradient exactly fills the box, so nothing is clipped that the canvas draws |
| Log-Chooser | Card (light) | gradient angle | `linear-gradient(150deg, …)` | start `{0.276,-0.35}` end `{0.724,1.35}` (log.tsx:81-82) | match — the exact 150° solution for a 281 × 128 box is (0.2764, −0.3503) → (0.7236, 1.3503); the stated pair is that, to 3 dp |
| Log-Chooser | Card (light) | gradient stop 0 | `#E9E8E3 0%` | `'#E9E8E3'` (implicit 0) | match |
| Log-Chooser | Card (light) | gradient stop 1 | `#C9C8C1 100%` | `'#C9C8C1'` (implicit 1) | match |
| Log-Chooser | Card (light) | shadow | `inset 0 0 0 1px rgba(0,0,0,0.05)` | `'inset 0 0 0 1px rgba(0,0,0,0.05)'` (log.tsx:115) | match |
| Log-Chooser | Card (dark) | gradient stop 0 | `#33322D 0%` | `'#33322D'` | match |
| Log-Chooser | Card (dark) | gradient stop 1 | `#131311 100%` | `'#131311'` | match |
| Log-Chooser | Card (dark) | shadow | `0 10px 24px rgba(19,19,17,0.25)` | `'0 10px 24px rgba(19,19,17,0.25)'` | match |
| Log-Chooser | Card mark box | position | `right:18px; top:16px` | `right: 18, top: 16` (log.tsx:123) | match |
| Log-Chooser | Sun mark | size / viewBox | `30 × 30`, `0 0 24 24` | `30 × 30`, `0 0 24 24` (log.tsx:43) | match |
| Log-Chooser | Sun mark | core | `circle cx12 cy12 r4.2 fill #2A2924` | `Circle cx 12 cy 12 r 4.2 fill #2A2924` | match |
| Log-Chooser | Sun mark | rays `d` | `M12 3v2.6M12 18.4V21M3 12h2.6M18.4 12H21M5.6 5.6l1.9 1.9M16.5 16.5l1.9 1.9M18.4 5.6l-1.9 1.9M7.5 16.5l-1.9 1.9` | identical (log.tsx:46) | match |
| Log-Chooser | Sun mark | ray stroke / width / cap | `#2A2924` / `2` / `round` | `#2A2924` / `2` / `round` | match |
| Log-Chooser | Sun mark | ray fill | attribute absent (default black) | `fill="none"` | match† — zero-area subpaths, no-op |
| Log-Chooser | Wave mark | size / viewBox | `34 × 22`, `0 0 26 16` | `34 × 22`, `0 0 26 16` (log.tsx:59) | match |
| Log-Chooser | Wave mark | path `d` | `M2 12c4-7 8 3 12-3s8 2 10-2` | identical | match |
| Log-Chooser | Wave mark | stroke / width / cap / fill | `#2A2924` / `2.6` / `round` / `none` | same | match |
| Log-Chooser | Moon mark | size / viewBox | `28 × 28`, `0 0 24 24` | `28 × 28`, `0 0 24 24` (log.tsx:68) | match |
| Log-Chooser | Moon mark | path `d` | `M14 3 A9 9 0 1 0 21 12 A7.2 7.2 0 0 1 14 3Z` | identical | match |
| Log-Chooser | Moon mark | fill | `#F4F3F0` | `#F4F3F0` | match |
| Log-Chooser | Card label | position | `left:18px; bottom:16px` | `left: 18, bottom: 16` (log.tsx:124) | match |
| Log-Chooser | Card label | font-size | `16.5px` | `16.5` | match |
| Log-Chooser | Card label | font-weight | `500` | `sans('500')` | match |
| Log-Chooser | Card label | colour (light / dark) | `#1D1C1A` / `#F4F3F0` | `#1D1C1A` / `#F4F3F0` | match |
| Log-Chooser | Card label | copy | `Daily check-in` / `An urge` / `A lapse` | identical (log.tsx:87-89) | match |
| Log-Chooser | Selected pip | position | `right:16px; bottom:13px` | `right: 16, bottom: 13` (log.tsx:132-133) | match |
| Log-Chooser | Selected pip | size / radius | `26 × 26`, `50%` | `26 × 26`, `borderRadius: 13` | match |
| Log-Chooser | Selected pip | background | `#131313` | `INK` = `#131313` (log.tsx:27) | match |
| Log-Chooser | Selected pip | shadow | `0 0 0 2px rgba(244,243,240,0.9)` | `'0 0 0 2px rgba(244,243,240,0.9)'` | match |
| Log-Chooser | Selected pip | check size / viewBox | `12 × 10`, `0 0 14 12` | `12 × 10`, `0 0 14 12` | match |
| Log-Chooser | Selected pip | check `d` | `M2 6.5 L5.5 10 L12 2.5` | `M2 6.5L5.5 10L12 2.5` | match† — whitespace only, identical geometry |
| Log-Chooser | Selected pip | check stroke / width / caps | `#F4F3F0` / `2.4` / `round`,`round` | same | match |
| Log-Chooser | Unselected ring | position | `right:16px; bottom:14px` | `right: 16, bottom: 14` (log.tsx:149-150) | match |
| Log-Chooser | Unselected ring | size / radius | `24 × 24`, `50%` | `24 × 24`, `borderRadius: 12` | match |
| Log-Chooser | Unselected ring (light) | shadow | `inset 0 0 0 2px rgba(0,0,0,0.20)` | identical | match |
| Log-Chooser | Unselected ring (dark) | shadow | `inset 0 0 0 2px rgba(244,243,240,0.35)` | identical | match |
| Log-Chooser | States drawn | selection | card 1 pip, cards 2 & 3 rings | `picked` initial `0` (log.tsx:165) | match |
| Log-Chooser | Continue pill | left / right | `24 / 24` | `left: 24, right: 24` (log.tsx:201-202) | match |
| Log-Chooser | Continue pill | height | `54px` | `54` | match |
| Log-Chooser | Continue pill | border-radius | `27px` | `27` | match |
| Log-Chooser | Continue pill | background | `#131313` | `INK` = `#131313` | match |
| Log-Chooser | Continue pill | bottom offset | `bottom:88` ⇒ occupies canvas y 710–764 | `bottom: Math.max(0, 88 − tabBar)` = 0 (tabBar = 63 + max(34,20) = 97) ⇒ occupies canvas y 701–755 (log.tsx:203) | **MISMATCH** — 9pt high; the frame draws no tab bar for this screen, the app renders one |
| Log-Chooser | Continue pill | label font-size | `16.5px` | `16.5` (log.tsx:211) | match |
| Log-Chooser | Continue pill | label weight | `600` | `sans('600')` | match |
| Log-Chooser | Continue pill | label letter-spacing | `0.2px` | `0.2` | match |
| Log-Chooser | Continue pill | label colour | `#FFFFFF` | `#FFFFFF` | match |
| Log-Chooser | Continue pill | label copy | `Continue` | `Continue` | match |
| Log-Chooser | Screen | tab bar | not drawn | `StoicTabBar` renders (not in `NO_BAR`, StoicTabBar.tsx:66) | **MISMATCH** — same defect as the pill row above; recorded once in Findings |

## 2 · Log history chrome — shared by Log-Urges / Log-Check-ins / Log-Reports (canvas 033–035) → `log.tsx` `History`

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| 033–035 | Frame | background | `#F4F3F0` | `colors.bg` (log.tsx:371) | match |
| 033–035 | Grain | opacity / source | `0.07` / `noise-dark.png` | `0.07` / same asset (log.tsx:372) | match |
| 033–035 | Back | position | `left:16px; top:64px` → app 10 | `left: 16, top: 10` (log.tsx:386) | match |
| 033–035 | Back | flex direction / align / gap | row, center, `9px` | `row`, `center`, `gap: 9` | match |
| 033–035 | Back chevron | size / viewBox | `11 × 19`, `0 0 11 19` | `11 × 19`, `0 0 11 19` (log.tsx:387) | match |
| 033–035 | Back chevron | path `d` | `M9.5 1.5L2 9.5l7.5 8` | identical | match |
| 033–035 | Back chevron | stroke / width / cap / join / fill | `#55534E` / `2.4` / `round` / `round` / `none` | same | match |
| 033–035 | Back label | font-size / weight / colour | `17px` / `400` / `#55534E` | `17` / `sans('400')` / `#55534E` (log.tsx:390) | match |
| 033–035 | Back label | copy | `Back` | `Back` | match |
| 033–035 | Title | position | `left:16px; top:114px` → app 60 | `left: 16, top: 60` (log.tsx:392) | match |
| 033–035 | Title | font-size / weight | `27px` / `600` | `27` / `sans('600')` | match |
| 033–035 | Title | letter-spacing / colour | `-0.2px` / `#1D1C1A` | `-0.2` / `#1D1C1A` | match |
| 033–035 | Title | copy | `Your log` | `Your log` | match |
| 033–035 | Tab track | position | `left:16; right:16; top:168` → app 114 | `left: 16, right: 16, top: 114` (log.tsx:395) | match |
| 033–035 | Tab track | height / radius | `38px` / `19px` | `38` / `19` (log.tsx:242) | match |
| 033–035 | Tab track | background | `rgba(0,0,0,0.06)` | `'rgba(0,0,0,0.06)'` | match |
| 033–035 | Tab track | padding / box-sizing | `3px`, `border-box` | `padding: 3` (RN is border-box) | match |
| 033–035 | Tab track | flex | `display:flex` row, three `flex:1` cells | `flexDirection: 'row'`, `flex: 1` per cell | match |
| 033–035 | Tab pill (on) | radius / background | `16px` / `#FFFFFF` | `16` / `#FFFFFF` (log.tsx:255-256) | match |
| 033–035 | Tab pill (on) | shadow | `0 1px 4px rgba(40,38,32,0.14), 0 0 0 0.5px rgba(0,0,0,0.04)` | identical string (log.tsx:257) | match |
| 033–035 | Tab pill (off) | background / shadow | none / none | `'transparent'` / `undefined` | match |
| 033–035 | Tab label | font-size | `14px` both states | `14` | match |
| 033–035 | Tab label | weight (on / off) | `600` / `500` | `sans(on ? '600' : '500')` | match |
| 033–035 | Tab label | colour (on / off) | `#1D1C1A` / `#8B8882` | `#1D1C1A` / `#8B8882` | match |
| 033–035 | Tab labels | copy | `Urges` `Check-ins` `Reports` | identical (log.tsx:229-233) | match |
| 033–035 | Group caption | position | `left:24px; top:230px` → app 176 | header box 152 + `marginTop: 24` = 176 (log.tsx:311, 381) | match |
| 033–035 | Group caption | font-size / weight / colour | `12.5px` / `600` / `#8B8882` | `12.5` / `sans('600')` / `#8B8882` (log.tsx:314) | match |
| 033–035 | Caption→first row | gap | caption top 230 → first row top 256 = 26 | caption box `height: 26` (log.tsx:313) | match |
| 033–035 | Row | left / right | `24 / 24` | `paddingHorizontal: 24` (log.tsx:316) | match |
| 033–035 | Row | height | `60px` content | `60`, or `61` when it carries the rule (log.tsx:290) | match — CSS content-box height 60 + 1px border = 61 box |
| 033–035 | Row | pitch | tops 256 / 320 / 384 = 64 | `61 + marginBottom 3` = 64 (log.tsx:290-291) | match |
| 033–035 | Row | flex / align / gap | row, center, `13px` | `row`, `center`, `gap: 13` (log.tsx:292-294) | match |
| 033–035 | Row divider | width / colour | `1px solid rgba(0,0,0,0.05)` | `borderBottomWidth: 1`, `'rgba(0,0,0,0.05)'` (log.tsx:295-296) | match |
| 033–035 | Row divider | which rows | every row except the last in its group | `divider={i < rows.length - 1}` (log.tsx:318) | match |
| 033–035 | Row disc | size / radius | `36 × 36` / `50%` | `36 × 36` / `18` (log.tsx:298) | match |
| 033–035 | Row disc | background | `#F1EFE9` | `#F1EFE9` | match |
| 033–035 | Row disc | flex-shrink | `0` | RN default `0` | match |
| 033–035 | Row title | font-size / weight / colour | `14.5px` / `600` / `#1D1C1A` | `14.5` / `sans('600')` / `#1D1C1A` (log.tsx:300) | match |
| 033–035 | Row subtitle | margin-top | `2px` | `marginTop: 2` (log.tsx:301) | match |
| 033–035 | Row subtitle | font-size / weight / colour | `12px` / `400` / `#8B8882` | `12` / `sans('400')` / `#8B8882` | match |
| 033–035 | Row outcome | font-size / weight / colour | `12.5px` / `400` / `#8B8882` | `12.5` / `sans('400')` / `#8B8882` (log.tsx:303) | match |
| 033–035 | Row chevron | size / viewBox | `6 × 10`, `0 0 8 14` | `6 × 10`, `0 0 8 14` (log.tsx:272) | match |
| 033–035 | Row chevron | path `d` | `M1.5 1.5L6.5 7l-5 5.5` | identical | match |
| 033–035 | Row chevron | stroke / width / cap / fill | `#B0AEA8` / `2` / `round` / `none` | same | match |
| 033–035 | Group 2 caption | top | `468px` → app 414 | 3-row group ends at 390, `marginTop: 24` → 414 | match |
| 033–035 | Group 2 first row | top | `494px` → app 440 | 414 + 26 caption box = 440 | match |
| 033–035 | List | scroll padding-bottom | none (frame does not scroll) | `paddingBottom: tabBar` = 97 (log.tsx:377) | **MISMATCH** — the tab bar is a laid-out sibling, not an overlay (`Tabs` default, `_layout.tsx:78`), so this is a second inset: 97pt of dead scroll below the last row |

### 2a · Log-Urges (canvas 033) deltas

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Log-Urges | Tab state | selected | `Urges` | `useState<LogTab>('urges')` (log.tsx:341) | match |
| Log-Urges | Group captions | copy | `This week`, `Last week` | `This week`, `Last week` (+ `Earlier`, app-only third bucket) (log.tsx:439-441) | match |
| Log-Urges | Row 1 mark | size / viewBox | `15 × 15`, `0 0 30 30` | `15 × 15`, `0 0 30 30` (log.tsx:457) | match |
| Log-Urges | Row 1 mark | path `d` | `M17 3 A11 11 0 1 0 25.5 20 A8.6 8.6 0 1 1 17 3 Z` | identical (log.tsx:458) | match |
| Log-Urges | Row 1 mark | fill | `#131313` | `INK` = `#131313` | match |
| Log-Urges | Row 1 mark | trigger→glyph rule | crescent for `Late night` | `name.includes('night')` → crescent (log.tsx:455) | match |
| Log-Urges | Row 2 mark | fallback ring | `12 × 12`, radius 50%, `inset 0 0 0 3.5px #131313` | `12 × 12`, `borderRadius: 6`, `'inset 0 0 0 3.5px #131313'` (log.tsx:477) | match |
| Log-Urges | Row 3 mark | size / viewBox | `14 × 11`, `0 0 14 11` | `14 × 11`, `0 0 14 11` (log.tsx:464) | match |
| Log-Urges | Row 3 mark | path `d` | `M1 9.5L5 5l3 3 5-6.5` | identical | match |
| Log-Urges | Row 3 mark | stroke / width / cap / join | `#131313` / `2.6` / `round` / `round` | same | match |
| Log-Urges | Row 4 mark | size / viewBox | `15 × 15`, `0 0 24 24` | `15 × 15`, `0 0 24 24` (log.tsx:471) | match |
| Log-Urges | Row 4 mark | path 1 `d` | `M4 11l8-7 8 7` | identical | match |
| Log-Urges | Row 4 mark | path 2 `d` | `M6 10v10h12V10` | identical | match |
| Log-Urges | Row 4 mark | stroke / width | `#131313` / `2.5` (cap round on path 1, join round on both) | same, path 2 has no cap (matches design) | match |
| Log-Urges | Row title | format | `<trigger> · <severity>` (`Late night · Intense`) | `[trigger \|\| 'Urge', severityWord(severity)].join(' · ')` (log.tsx:352) | match |
| Log-Urges | Row severity words | vocabulary | `Intense`, `Mild`, `Strong` | `Faint/Mild/Strong/Intense/Overwhelming` (weeklyReport.ts:123-130) | match |
| Log-Urges | Row subtitle | format | `<Day> · <h:mm am/pm>` (`Tuesday · 11:40 pm`) | `${dayWord} · ${time.toLowerCase()}` (log.tsx:509-511) | match |
| Log-Urges | Row subtitle | day words | `Tuesday`, `Thursday`, `Friday`, `Sunday`, `Wednesday` | `Today`/`Yesterday`/weekday <14d/`Mon D` (log.tsx:499-506) | match |
| Log-Urges | Row outcome | vocabulary | `rode it out`, `surfed the timer`, `slipped` | `OUTCOME_WORD` map + `'slipped'` for lapse (log.tsx:481-492) | match |
| Log-Urges | Row order | sort | newest first | `.sort((a,b) => b.createdAt - a.createdAt)` (log.tsx:346) | match |

### 2b · Log-Check-ins (canvas 034) deltas

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Log-Check-ins | Tab state | selected | `Check-ins` | `tab === 'checkins'` (log.tsx:408) | match |
| Log-Check-ins | Row mark | size / viewBox | `16 × 16`, `0 0 26 26` | `SunriseMark size={16}`, `0 0 26 26` (log.tsx:32, 359) | match |
| Log-Check-ins | Row mark | path 1 `d` | `M13 4.5V1.5M6.2 7.6L4.2 5.6M19.8 7.6l2-2` | identical (log.tsx:33) | match |
| Log-Check-ins | Row mark | path 2 `d` | `M6.8 15a6.2 6.2 0 0 1 12.4 0Z` | identical (log.tsx:34) | match |
| Log-Check-ins | Row mark | path 3 `d` | `M3 15h20M8 19.5h10` | identical (log.tsx:35) | match |
| Log-Check-ins | Row mark | stroke / width / cap | `#131313` / `2.5` / `round` | `INK` / `2.5` / `round` | match |
| Log-Check-ins | Row mark | path 2 fill | `#131313` | `INK` | match |
| Log-Check-ins | Row mark | paths 1 & 3 fill | attribute absent (default black) | `fill="none"` | match† — zero-area subpaths, no-op |
| Log-Check-ins | Row title | format | `Mood N/5 · Xh sleep` | `Mood ${mood}/5` + `${sleepHours}h sleep` joined by ` · ` (log.tsx:360-365) | match |
| Log-Check-ins | Row subtitle | format | `<Day> · <h:mm am>` — `Today · 8:44 am`, `Yesterday · 8:51 am`, `Friday · 8:39 am`, `Sunday · 9:02 am`, `Tuesday · 8:47 am` (all five rows carry a time) | `dayWord(...)` only → `Today` (log.tsx:366) | **MISMATCH** — the ` · h:mm am` clause is missing; `DailyCheckin` (types.ts:148-170, schema.ts:144-160) stores only a `YYYY-MM-DD` date, so closing it needs `_creationTime` or a `loggedAt` field |
| Log-Check-ins | Row outcome | words | `steady`, `flat`, `good`, `rested`, `rough` | `moodLabel(mood).toLowerCase()` → `heavy/overcast/mixed/mostly clear/clear` (MoodLogger.tsx:29-35, log.tsx:367) | match† — the design's samples are not derivable: Mood 4/5 appears as `steady`, `good` and `rested` on three separate rows, so the frame states no mood→word rule to port |
| Log-Check-ins | Row order | sort | newest first | `.sort((a,b) => (a.date < b.date ? 1 : -1))` (log.tsx:347) | match |

### 2c · Log-Reports (canvas 035) deltas

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Log-Reports | Tab state | selected | `Reports` | `tab === 'reports'` (log.tsx:416) | match |
| Log-Reports | Group caption | copy | `Weekly reports` | `Weekly reports` (log.tsx:528) | match |
| Log-Reports | Group | row count / dividers | 4 rows at 256 / 320 / 384 / 448 → app 202 / 266 / 330 / 394, last with no rule | one `LogGroup`, 64pt pitch, `divider` false on last | match |
| Log-Reports | Row mark | size / viewBox | `16 × 12`, `0 0 16 13` | `16 × 12`, `0 0 16 13` (log.tsx:532) | match |
| Log-Reports | Row mark | path 1 `d` | `M1.5 10.5L6 6l3 2.5L14.5 2.5` | identical | match |
| Log-Reports | Row mark | path 2 `d` | `M10.8 2.5h3.7V6.2` | identical | match |
| Log-Reports | Row mark | stroke / width / cap / join / fill | `#131313` / `2.4` / `round` / `round` / `none` | same | match |
| Log-Reports | Row title | format | `Jul 14–20`, `Jun 30–Jul 6` (U+2013, month repeated only when the week straddles) | `weekLabel()` (log.tsx:551-557) | match |
| Log-Reports | Row subtitle | format | `Score 1,240 · 3 urges · 0 relapses`; `1 relapse` singular | `Score ${score.toLocaleString('en-US')} · ${n} urge(s) · ${n} relapse(s)` (log.tsx:538) | match |
| Log-Reports | Row outcome | format | `+12`, `+8`, `−4` (U+2212 for negative) | `+${delta}` / `−${Math.abs(delta)}` (log.tsx:539) | match |
| Log-Reports | Row | press target | chevron drawn on every row | `onPress → /weekly-report?week=` (log.tsx:540) | match |
| Log-Reports | Row order | sort | newest week first | `reportWeeks(...).reverse()` (log.tsx:587) | match |

## 3 · Lapse-When (canvas 030) → `src/app/lapse.tsx` step 0 (+ `urge-log.tsx` shared parts)

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Lapse-When | Frame | background | `#F4F3F0` | `colors.bg` (lapse.tsx:81) | match |
| Lapse-When | Grain | opacity / source | `0.07` / `noise-dark.png` | `0.07` / same asset (lapse.tsx:83) | match |
| Lapse-When | Back | position | `left:16px; top:66px` → app 12 | `left: 16, top: 12` (urge-log.tsx:69) | match |
| Lapse-When | Back | gap / align | `9px`, center | `gap: 9`, `center` | match |
| Lapse-When | Back chevron | size / viewBox / `d` | `11 × 19`, `0 0 11 19`, `M9.5 1.5L2 9.5l7.5 8` | identical (marks.tsx:205-212) | match |
| Lapse-When | Back chevron | stroke / width / cap / join | `#55534E` / `2.4` / `round` / `round` | same | match |
| Lapse-When | Back label | size / weight / colour / copy | `17px` / `400` / `#55534E` / `Back` | same (urge-log.tsx:71) | match |
| Lapse-When | Close | position | `right:22px; top:70px` → app 16 | `right: 22, top: 16` (urge-log.tsx:83) | match |
| Lapse-When | Close | size / viewBox | `20 × 20`, `0 0 20 20` | `size = 20`, `0 0 20 20` (marks.tsx:214-220) | match |
| Lapse-When | Close | path `d` / stroke / width / cap | `M3 3l14 14M17 3L3 17` / `#55534E` / `2` / `round` | identical | match |
| Lapse-When | Step rail | top | `74px` → app 20 | `top: 20` (urge-log.tsx:73) | match |
| Lapse-When | Step rail | justify / gap | center, `8px` | `justifyContent:'center'`, `gap: 8` | match |
| Lapse-When | Step bar | size / radius | `36 × 4` / `2px` | `36 × 4` / `2` (urge-log.tsx:75) | match |
| Lapse-When | Step bar | count | 3 | `steps={3}` (lapse.tsx:87) | match |
| Lapse-When | Step bar | fill (on / off) | `#131313` / `rgba(0,0,0,0.14)` | same | match |
| Lapse-When | Step bar | state drawn | bar 1 on, 2 and 3 off | `index = step = 0`, `bar <= index` | match |
| Lapse-When | Heading | top | `138px` → app 84 | `top: 84` (urge-log.tsx:95) | match |
| Lapse-When | Heading | left / right | `44 / 44` | `left: 44, right: 44` | match |
| Lapse-When | Heading | size / weight / line-height | `22px` / `500` / `30px` | `22` / `sans('500')` / `30` | match |
| Lapse-When | Heading | letter-spacing / colour / align | `0.1px` / `#1D1C1A` / center | `0.1` / `#1D1C1A` / `center` | match |
| Lapse-When | Heading | `text-wrap` | `balance` | native RN has no equivalent; web build sets `balance` only for hero/display/title (AppText.tsx:128) | MISMATCH\* — RN cannot express `text-wrap: balance`; the app substitutes the platform's default greedy wrap. `When did it happen?` fits one line at 22px in a 305pt box, so nothing moves here |
| Lapse-When | Heading | copy | `When did it happen?` | `When did it happen?` (lapse.tsx:91) | match |
| Lapse-When | Chip row | top | `206px` → app 152 | `top: 152` (lapse.tsx:92) | match |
| Lapse-When | Chip row | justify / gap | center, `10px` | `center`, `gap: 10` | match |
| Lapse-When | Chip | padding | `13px 20px` | `paddingVertical: 13, paddingHorizontal: 20` (lapse.tsx:107-108) | match |
| Lapse-When | Chip | border-radius | `24px` | `24` | match |
| Lapse-When | Chip (on) | background / shadow | `#131313` / none | `#131313` / `undefined` | match |
| Lapse-When | Chip (off) | background / shadow | `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.10)` | same (lapse.tsx:110-111) | match |
| Lapse-When | Chip label | size / weight | `14px` / `500` | `14` / `sans('500')` | match |
| Lapse-When | Chip label | colour (on / off) | `#FFFFFF` / `#1D1C1A` | same | match |
| Lapse-When | Chip labels | copy | `Just now`, `Earlier today`, `Yesterday` | `WHEN_CHIPS` (urge-log.tsx:51-55) | match |
| Lapse-When | Chip state | selected | chip 1 | `when` initial `0`, `customAt == null` (lapse.tsx:53, 94) | match |
| Lapse-When | Specify time | top | `276px` → app 222 | `top: 222` (lapse.tsx:122) | match |
| Lapse-When | Specify time | align / size / weight / colour | center / `14px` / `500` / `#55534E` | same (lapse.tsx:123) | match |
| Lapse-When | Specify time | copy | `Specify time` | `Specify time` | match |
| Lapse-When | Wheel card | top | `330px` → app 276 | `top: 276` (urge-log.tsx:295) | match |
| Lapse-When | Wheel card | left / right | `24 / 24` | `left: 24, right: 24` | match |
| Lapse-When | Wheel card | radius / background | `20px` / `#FFFFFF` | `20` / `#FFFFFF` | match |
| Lapse-When | Wheel card | shadow / overflow | `0 0 0 1px rgba(0,0,0,0.10)` / `hidden` | identical / `hidden` | match |
| Lapse-When | Wheel body | padding | `8px 12px` | `paddingVertical: 8, paddingHorizontal: 12` (urge-log.tsx:300) | match |
| Lapse-When | Wheel body | justify | center | `justifyContent: 'center'` | match |
| Lapse-When | Highlight band | geometry | `top:50%; translateY(-50%); height:36` in a 186pt box ⇒ top 75 | `top: 75, height: 36` (urge-log.tsx:303) | match |
| Lapse-When | Highlight band | left / right / radius / fill | `12 / 12` / `10px` / `rgba(0,0,0,0.045)` | same | match |
| Lapse-When | Wheel columns | widths | `132 / 42 / 48 / 42` | `132 / 42 / 48 / 42` (urge-log.tsx:304-307) | match |
| Lapse-When | Wheel row | height / align | `34px`, centred both axes | `height: 34`, centred (urge-log.tsx:257) | match |
| Lapse-When | Wheel row (picked) | size / weight / opacity | `21px` / `500` / `1` | `21` / `sans('500')` / `1` (urge-log.tsx:245, 261) | match |
| Lapse-When | Wheel row (±1) | size / weight / opacity | `18px` / `400` / `0.42` | `18` / `sans('400')` / `0.42` | match |
| Lapse-When | Wheel row (±2) | size / weight / opacity | `18px` / `400` / `0.16` | `18` / `sans('400')` / `0.16` | match |
| Lapse-When | Wheel row | colour | `#1D1C1A` | `#1D1C1A` | match |
| Lapse-When | Date column | content | `Sat Jul 18` / `Sun Jul 19` / `Today` / `Wed Jul 22` / `Thu Jul 23` | `Wkd Mon D`, with `Today` substituted on the matching day (urge-log.tsx:276-281) | match |
| Lapse-When | Meridiem column | fill order | `AM` row 0, `PM` row 1 (picked), rows 2–4 blank | `['AM','PM','','','']`, `pick = pm ? 1 : 0` (urge-log.tsx:286, 307) | match |
| Lapse-When | Meridiem column | opacities | `0.42` / `1` / `0.42` / `0.16` / `0.16` | same, from `WHEEL_FADE[min(abs(row−1),2)]` | match |
| Lapse-When | Wheel footer | border-top | `1px solid rgba(0,0,0,0.09)` | `borderTopWidth: 1`, `'rgba(0,0,0,0.09)'` (urge-log.tsx:309) | match |
| Lapse-When | Cancel | flex / padding / align | `flex:1` / `15px 0` / center | `flex: 1` / `paddingVertical: 15` / `alignItems:'center'` | match |
| Lapse-When | Cancel | size / weight / colour / copy | `16px` / `400` / `#55534E` / `Cancel` | same (urge-log.tsx:311) | match |
| Lapse-When | Footer divider | width / colour | `1px` / `rgba(0,0,0,0.09)` | `width: 1` / same (urge-log.tsx:313) | match |
| Lapse-When | Save | size / weight / colour / copy | `15.5px` / `600` / `#131313` / `Save` | same (urge-log.tsx:315) | match |
| Lapse-When | Primary pill | position | `top:744px`, height 58 ⇒ canvas y 744–802 | flex footer, `paddingBottom: 16` under a 34pt inset ⇒ canvas y 744–802 (lapse.tsx:182) | match |
| Lapse-When | Primary pill | left / right | `24 / 24` | `paddingHorizontal: 24` | match |
| Lapse-When | Primary pill | height / radius / background | `58px` / `29px` / `#131313` | `58` / `29` / `#131313` (urge-log.tsx:107) | match |
| Lapse-When | Primary pill | label size / weight / tracking / colour | `17px` / `600` / `0.2px` / `#FFFFFF` | same (urge-log.tsx:108) | match |
| Lapse-When | Primary pill | label copy | `Log the urge` | `Continue` (lapse.tsx:183) | **MISMATCH** — see Findings; the frame's own rail marks this step 1 of 3, so the canvas string is carried over from the urge flow |

## 4 · Lapse-Trigger (canvas 031) → `lapse.tsx` step 1

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Lapse-Trigger | Chrome | back / close / rail | as Lapse-When | `FlowTop` unchanged (lapse.tsx:87) | match |
| Lapse-Trigger | Step rail | state drawn | bars 1 and 2 on, 3 off | `index = 1` | match |
| Lapse-Trigger | Heading | top / metrics | `138px` → app 84, `22/500/30/0.1/#1D1C1A` | same `Heading` (urge-log.tsx:95) | match |
| Lapse-Trigger | Heading | copy | `What fed it?` | `What fed it?` (lapse.tsx:142) | match |
| Lapse-Trigger | Sub | top | `186px` → app 132 | `top: 132` (lapse.tsx:143) | match |
| Lapse-Trigger | Sub | align / size / weight / colour | center / `14.5px` / `400` / `#55534E` | same | match |
| Lapse-Trigger | Sub | copy | `Tap all that apply.` | `Tap all that apply.` | match |
| Lapse-Trigger | Grid | top | `234px` → app 180 | `top: 180` (lapse.tsx:146) | match |
| Lapse-Trigger | Grid | left / right | `24 / 24` | `GRID_GUTTER = 24` (urge-log.tsx:160) | match |
| Lapse-Trigger | Grid | gap | `12px` (row and column) | `gap: 12` (`GRID_GAP`) | match |
| Lapse-Trigger | Grid | columns | `1fr 1fr 1fr` ⇒ 107.0pt at 393 wide | `floor((393 − 48 − 24)/3)` = 107 (urge-log.tsx:164-166) | match — exact at the canvas width; on widths where the division is not whole, `floor` leaves ≤2pt unclaimed at the right |
| Lapse-Trigger | Grid | wrap | grid, 3 per row | `flexWrap: 'wrap'` | match |
| Lapse-Trigger | Tile | height / radius | `112px` / `18px` | `112` / `18` (urge-log.tsx:176-177) | match |
| Lapse-Trigger | Tile | background | `#FFFFFF` both states | `#FFFFFF` | match |
| Lapse-Trigger | Tile (off) | shadow | `0 0 0 1px rgba(0,0,0,0.10)` | identical | match |
| Lapse-Trigger | Tile (on) | shadow | `0 0 0 1.8px #131313` | identical | match |
| Lapse-Trigger | Tile | direction / align / gap | column, center, `10px` | `column` (RN default), centred, `gap: 10` | match |
| Lapse-Trigger | Tile disc | size / radius | `46 × 46` / `50%` | `46 × 46` / `23` (urge-log.tsx:184) | match |
| Lapse-Trigger | Tile disc | background (off / on) | `#F1EFE9` / `#131313` | same | match |
| Lapse-Trigger | Tile glyph | size / viewBox | `24 × 24`, `0 0 24 24` | `24 × 24`, `0 0 24 24` (marks.tsx:146) | match |
| Lapse-Trigger | Tile glyph | colour (off / on) | `#1D1C1A` / `#F4F3F0` | same (urge-log.tsx:185) | match |
| Lapse-Trigger | Tile label | size / colour | `14px` / `#1D1C1A` | `14` / `#1D1C1A` (urge-log.tsx:187) | match |
| Lapse-Trigger | Tile label | weight (off / on) | `500` / `600` | `sans(selected ? '600' : '500')` | match |
| Lapse-Trigger | Tile order | labels | Stress, Boredom, Lonely, Tired, Social, Phone, Late night, Argument, Craving | identical order (urge-log.tsx:29-39) | match |
| Lapse-Trigger | Tile state | drawn | Boredom and Late night selected | multi-select, none preselected (lapse.tsx:57) | match — the frame shows a mid-interaction state the app reaches by tapping |
| Lapse-Trigger | Stress glyph | path `d` | `M13 2L4 13h6l-1 9 9-12h-6z` | identical (marks.tsx:147) | match |
| Lapse-Trigger | Boredom glyph | circle / stroke | `cx12 cy12 r9`, width `2.1`, fill none | identical (marks.tsx:150) | match |
| Lapse-Trigger | Boredom glyph | mouth `d` / width / cap | `M8.5 14.5h7` / `2.1` / `round` | identical | match |
| Lapse-Trigger | Boredom glyph | eyes | `cx9 cy10 r1.2`, `cx15 cy10 r1.2` | identical | match |
| Lapse-Trigger | Lonely glyph | head / body `d` | `cx12 cy8 r4`; `M4.5 20c0-3.9 3.4-6.2 7.5-6.2S19.5 16.1 19.5 20z` | identical (marks.tsx:158-159) | match |
| Lapse-Trigger | Tired glyph | paths `d` / width / caps | `M13 3h6l-6 7h6`, `M4 13h5l-5 6h5` / `2.5` / round, round | identical (marks.tsx:164-165) | match |
| Lapse-Trigger | Social glyph | four elements | `r3.3 @8.5,8.5`; `r2.7 @16,9.5`; `M2.5 19c0-3.2 2.7-5 6-5s6 1.8 6 5z`; `M14.5 14.2c2.6.2 5 1.8 5 4.8h-3.2z` | identical (marks.tsx:170-173) | match |
| Lapse-Trigger | Phone glyph | body / screen / button | `rect 6,2.5 12×19 rx3`; `rect 8,5 8×11 rx1 #F1EFE9`; `circle 12,18.6 r1 #F1EFE9` | identical (marks.tsx:178-180) | match — the frame only draws Phone unselected, so `#F1EFE9` for the screen has no selected-state literal to check against |
| Lapse-Trigger | Late night glyph | path `d` | `M20.1 15.1A8.7 8.7 0 1 1 8.9 3.9 8.7 8.7 0 0 0 20.1 15.1Z` | identical (marks.tsx:183) | match |
| Lapse-Trigger | Late night glyph | fill-rule | `evenodd` | not set (default `nonzero`) | match† — one closed, non-self-intersecting subpath, so both rules fill the same region |
| Lapse-Trigger | Argument glyph | path 1 `d` | `M3 5.5A1.5 1.5 0 0 1 4.5 4h9A1.5 1.5 0 0 1 15 5.5v5A1.5 1.5 0 0 1 13.5 12H8l-3.4 3v-3H4.5A1.5 1.5 0 0 1 3 10.5z` | identical (marks.tsx:186) | match |
| Lapse-Trigger | Argument glyph | path 2 `d` / opacity | `M17 9h3a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1v2.5L16.5 16H12a1 1 0 0 1-1-1z` / `0.55` | identical / `0.55` (marks.tsx:187) | match |
| Lapse-Trigger | Craving glyph | path `d` | `M12 22c4.5-2.4 7-5.6 7-9.4 0-3-2-5-4.3-5-1.5 0-2.4.8-2.7 2-.3-1.2-1.2-2-2.7-2#1D1C1A7 7.2 5 9.2 5 12.2 5 16 7.5 19.2 12 22z` | `…-2.7-2C7 7.2 5 9.2 5 12.2 5 16 7.5 19.2 12 22z` (marks.tsx:193) | match† — the design literal is **corrupt in both the raw and pretty frames**: a colour token `#1D1C1A` sits where the command letter belongs, so a browser aborts the path at that character and draws a broken heart. The app reads it as absolute `C`, which is the only reading that closes the curve symmetrically (left side ends at 5,12.2 against the right side's 19,12.6) |
| Lapse-Trigger | Primary pill | geometry | `top:744`, `24/24`, `58 × r29`, `#131313` | same as Lapse-When | match |
| Lapse-Trigger | Primary pill | label metrics | `17px` / `600` / `0.2px` / `#FFFFFF` | same | match |
| Lapse-Trigger | Primary pill | label copy | `Continue · 2` (word + count of selected triggers) | `Log the lapse` / `Logging…` while saving, no count (lapse.tsx:184) | **MISMATCH** — both the word and the count suffix |
| Lapse-Trigger | Primary pill | disabled state | not drawn (2 tiles selected, pill fully opaque) | `enabled={!saving}`, i.e. enabled at 0 triggers; `opacity 0.34` when disabled | match — no design literal for the empty state |

## 5 · Lapse-Done (canvas 032) → `lapse.tsx` step 2

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Lapse-Done | Chrome | back / close / rail | none drawn | `FlowTop` hidden at `step === 2` (lapse.tsx:87) | match |
| Lapse-Done | Art frame | position / size | `left:86px; top:130px` → app 76, `220 × 160` | `left: 86, top: 76, width: 220, height: 160` (urge-log.tsx:327) | match |
| Lapse-Done | Glow | position / size | `left:44; top:6`, `130 × 130` | same (urge-log.tsx:330) | match |
| Lapse-Done | Glow | gradient | `radial-gradient(closest-side, rgba(226,186,120,0.36), rgba(226,186,120,0) 74%)` | `RadialGradient` rx/ry 50%, stop 0 `#E2BA78` @ 0.36, stop 0.74 @ 0 (urge-log.tsx:332-337) | match — `closest-side` on a square box is exactly rx = ry = 65 |
| Lapse-Done | Glow | filter | `blur(4px)` | none | MISMATCH\* — RN SVG has no blur filter; the app ships the unblurred two-stop ramp, which softens the 74% kink by roughly 2px less than the canvas |
| Lapse-Done | Ground shadow | position / size | `left:50; top:134`, `120 × 12`, radius 50% | `Svg 120 × 12` at `left: 50, top: 134`, `Ellipse rx60 ry6` (urge-log.tsx:341-349) | match |
| Lapse-Done | Ground shadow | fill | flat `rgba(0,0,0,0.10)` + `blur(4px)` | 3-stop radial: `#000` @ 0.1 → @0.6 0.055 → @1 0 (urge-log.tsx:344-346) | MISMATCH\* — no blur filter in RN SVG; the app substitutes a hand-fitted radial falloff |
| Lapse-Done | Back leaf | geometry | `left:48; top:38`, `126 × 94`, radius 10 | identical (urge-log.tsx:351) | match |
| Lapse-Done | Back leaf | fill / rotation | `#E0DFDA` / `rotate(-2deg)` | `#E0DFDA` / `rotate: '-2deg'` | match |
| Lapse-Done | Front leaf | geometry | `left:54; top:32`, `114 × 94`, radius 8 | identical (urge-log.tsx:352-364) | match |
| Lapse-Done | Front leaf | fill / shadow / rotation | `#F7F6F2` / `0 0 0 1px rgba(0,0,0,0.05)` / `rotate(-2deg)` | identical | match |
| Lapse-Done | Spine | geometry / fill / rotation | `left:110; top:34`, `2 × 88`, `#E0DFDA`, `rotate(-2deg)` | identical (urge-log.tsx:365) | match |
| Lapse-Done | Rule 1 | geometry | `left:66; top:54`, `34 × 4`, radius 2, `#E0DFDA` | identical (urge-log.tsx:366) | match |
| Lapse-Done | Rule 2 | geometry | `left:66; top:68`, `34 × 4`, radius 2, `#E0DFDA` | identical (urge-log.tsx:367) | match |
| Lapse-Done | Rule 3 | geometry | `left:122; top:52`, `34 × 4`, radius 2, `#E0DFDA` | identical (urge-log.tsx:368) | match |
| Lapse-Done | Pen | geometry / fill | `left:140; top:84`, `64 × 8`, radius 4, `#55534E` | identical (urge-log.tsx:371-381) | match |
| Lapse-Done | Pen | rotation + origin | `rotate(-28deg)`, `transform-origin: left center` | `[translateX -32, rotate '-28deg', translateX 32]` | match — RN has no `transformOrigin` token here, and T(−32)·R·T(+32) about the centre is algebraically the same map as R about the left edge |
| Lapse-Done | Check badge | geometry / fill | `left:170; top:26`, `30 × 30`, radius 50%, `#131313` | `30 × 30`, `borderRadius: 15`, `#131313` (urge-log.tsx:383) | match |
| Lapse-Done | Check badge | glyph size / viewBox / `d` | `13 × 13`, `0 0 14 14`, `M2.5 7.5l3 3 6-7` | identical (urge-log.tsx:384-385) | match |
| Lapse-Done | Check badge | stroke / width / caps / fill | `#F4F3F0` / `2.2` / round, round / none | identical | match |
| Lapse-Done | Title | top | `316px` → app 262 | `top: 262` (lapse.tsx:157) | match |
| Lapse-Done | Title | align / size / weight | center / `27px` / `500` | same | match |
| Lapse-Done | Title | letter-spacing / colour | `-0.2px` / `#1D1C1A` | `-0.2` / `#1D1C1A` | match |
| Lapse-Done | Title | copy | `Lapse logged.` | `Lapse logged.` | match |
| Lapse-Done | Summary card | top | `376px` → app 322 | `top: 322` (lapse.tsx:165) | match |
| Lapse-Done | Summary card | left / right | `24 / 24` | `left: 24, right: 24` | match |
| Lapse-Done | Summary card | radius / background | `18px` / `#FFFFFF` | `18` / `#FFFFFF` | match |
| Lapse-Done | Summary card | shadow | `0 0 0 1px rgba(0,0,0,0.09)` | identical (lapse.tsx:168) | match |
| Lapse-Done | Summary card | padding | `4px 20px` | `paddingVertical: 4, paddingHorizontal: 20` (lapse.tsx:169-170) | match |
| Lapse-Done | Summary row | padding / align / justify | `15px 0` / center / space-between | `paddingVertical: 15` / center / space-between (urge-log.tsx:395-399) | match |
| Lapse-Done | Summary row | divider | `1px solid rgba(0,0,0,0.06)`, absent on the last row | `borderBottomWidth: last ? 0 : 1`, `'rgba(0,0,0,0.06)'` (urge-log.tsx:400-401) | match |
| Lapse-Done | Summary label | size / weight / colour | `12.5px` / `600` / `#8B8882` | same (urge-log.tsx:403) | match |
| Lapse-Done | Summary value | size / weight / colour | `14.5px` / `500` / `#1D1C1A` | same (urge-log.tsx:406) | match |
| Lapse-Done | Summary value | max lines | not stated | `numberOfLines={2}`, `flexShrink: 1`, right-aligned | match† — the canvas value box is content-sized and never wraps in the frame; the cap only bites on data the frame does not draw |
| Lapse-Done | Summary labels | copy | `When`, `Set off by`, `What I did` | identical (lapse.tsx:172-176) | match |
| Lapse-Done | Row 1 value | content | `Last night` | chip label (`Just now` / `Earlier today` / `Yesterday`) or `Today · 11:40 pm` (lapse.tsx:172) | match† — `Last night` is not one of the chips the frame's own Lapse-When offers, so the sample is not a portable rule |
| Lapse-Done | Row 2 value | format | `Late night · Boredom` (selected triggers joined by ` · `) | `triggers.join(' · ')`, `—` when empty (lapse.tsx:173) | match |
| Lapse-Done | Row 3 value | content | `Rode it out` | `Slipped` — a fixed literal, since the lapse flow asks no outcome question (lapse.tsx:176) | **MISMATCH** — see Findings; `Rode it out` is an urge-flow outcome that the lapse flow cannot produce |
| Lapse-Done | Primary pill | geometry / metrics | `top:744`, `24/24`, `58 × r29`, `#131313`, `17/600/0.2/#FFFFFF` | same footer pill (lapse.tsx:185) | match |
| Lapse-Done | Primary pill | label copy | `Done` | `Done` | match |

## 6 · Tab bar drawn in Log-Urges / Log-Check-ins / Log-Reports

Owned by `/Users/admin/Documents/tideline/src/components/StoicTabBar.tsx`, i.e. outside the two
target files. Audited because the frames draw it; counted separately in the summary.

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| 033–035 | Bar | background | `rgba(255,255,255,0.95)` | `'rgba(255,255,255,0.95)'` (StoicTabBar.tsx:87) | match |
| 033–035 | Bar | top / height | `top:769`, `bottom:0` ⇒ 83 tall | `63 + max(insets.bottom, 20)` = 97 on a 393 × 852 device (insets.bottom 34) ⇒ top 755 | **MISMATCH** — 14pt taller; the canvas assumed a 20pt bottom inset |
| 033–035 | Bar | padding-top | `14px` (each tab is `top:14`) | `paddingTop: 14` plus each tab absolute at `top: 14` — padding does not offset an absolutely positioned child (its containing block is the padding box), so the glyph top is 14 | match |
| 033–035 | Tabs | count | 3 (`Home`, `Log`, `Library`) | 4 (`Home`, `Log`, `Library`, `All`) (StoicTabBar.tsx:38-43) | **MISMATCH** — deliberate per the file's own comment, still a difference from the frame |
| 033–035 | Tabs | centres | 70 / 196 / 318 | 12.5% / 37.5% / 62.5% / 87.5% of 393 = 49.125 / 147.375 / 245.625 / 343.875 | **MISMATCH** — consequence of the fourth tab |
| 033–035 | Tab label box | width | 44 / 52 / 60 | 60 / 60 / 66 / 60 (StoicTabBar.tsx:39-42) | **MISMATCH** — labels are centred, so the visible effect is confined to the hit box |
| 033–035 | Tab glyph | size / viewBox | `30 × 29`, `0 0 24 26` | `30 × 29`, `0 0 24 26` | match |
| 033–035 | Home glyph | path `d` | `M4.5 24 L4.5 10 Q4.5 2 12 2 Q19.5 2 19.5 10 L19.5 24 Z` | identical (StoicTabBar.tsx:115) | match |
| 033–035 | Home glyph | dot | `cx15.2 cy14 r1.7`, `#FFFFFF` @ `0.92` | identical | match |
| 033–035 | Log glyph | body / lines | `rect 4.5,2 15×22 rx3`; `M8.5 8.5h7M8.5 13h7M8.5 17.5h4.5` stroke `#FFFFFF` 2.2 round @0.95 | identical (StoicTabBar.tsx:125-126) | match |
| 033–035 | Library glyph | three rects | `5 / 10.9 / 16.8`, `4.4 × 21`, rx `1.8` | identical (StoicTabBar.tsx:136-138) | match |
| 033–035 | Glyph fill | inactive / active | `#C6C5C0` / `#2A2924` | `colors.track` = `#C6C5C0` / `colors.textTitle` = `#2A2924` | match |
| 033–035 | Tab label | margin-top / size / weight | `5px` / `13px` / `500` | `marginTop: 5` / `13` / `sans('500')` (StoicTabBar.tsx:101) | match |
| 033–035 | Tab label | colour inactive / active | `#8B8882` / `#2A2924` | `colors.textSoft` = `#8B8882` / `#2A2924` | match |
| 033–035 | Tab state | selected on these frames | `Log` | `pathname === '/log'` (StoicTabBar.tsx:77) | match |

---

## Findings

**327 property rows** written across the 7 frames — 303 match, 10 match† (literal differs, no
rendering difference), **11 MISMATCH**, **3 MISMATCH\***.

Of those: **7 MISMATCH rows in the two target files**, covering **6 distinct defects** (the chooser
pill's offset and the "tab bar drawn" row are one root cause); **3 MISMATCH\* rows** where RN cannot
express the CSS; and **4 MISMATCH rows in the adjacent `StoicTabBar.tsx`**.

Per-frame row counts: Log-Chooser 77 · history chrome shared by 033–035 47 · Log-Urges +20 ·
Log-Check-ins +12 · Log-Reports +12 · Lapse-When 62 · Lapse-Trigger 42 · Lapse-Done 40 ·
tab bar (in 033–035) 15.

### In `src/app/(app)/log.tsx`

1. **`log.tsx:203` — chooser Continue pill sits 9pt high.**
   Current: `bottom: Math.max(0, 88 - tabBar)` where `tabBar = 63 + max(insets.bottom, 20)` = 97 on a
   393 × 852 device, so the offset clamps to `0` and the pill occupies canvas y **701–755**.
   Design (`Log-Chooser`, `bottom:88`, `height:54`): canvas y **710–764**.
   Root cause: the frame draws **no tab bar** on the chooser while the app's Log tab renders one
   (`/log` is absent from `NO_BAR`, `StoicTabBar.tsx:66`). The 9pt cannot be recovered without either
   adding `/log` to `NO_BAR` or letting the pill overlap the bar.

2. **`log.tsx:366` — check-in rows drop the time from the second line.**
   Current: `when: dayWord(dateKeyToMs(checkin.date), now)` → `Today`.
   Design (`Log-Check-ins`, all five rows): `Today · 8:44 am`, `Yesterday · 8:51 am`,
   `Friday · 8:39 am`, `Sunday · 9:02 am`, `Tuesday · 8:47 am` — day, then ` · `, then a lowercase
   `h:mm am/pm`, i.e. the same template `whenLabel()` already builds for urge rows (`log.tsx:509`).
   `DailyCheckin` carries only a `YYYY-MM-DD` `date` (`src/lib/types.ts:151`,
   `convex/schema.ts:144-160`), so closing this needs `_creationTime` surfaced or a `loggedAt` field.

3. **`log.tsx:377` — 97pt of dead scroll under the last row.**
   Current: `contentContainerStyle={{ paddingBottom: tabBar }}` (97).
   Design: no such padding; the list ends at its last row.
   The comment above the line says the bar "floats over this screen", but `(app)/_layout.tsx:78`
   uses `Tabs` with a plain custom `tabBar`, which is laid out as a sibling below the screen, not as
   an overlay — the screen is already inset by the bar's height, so this pads it a second time.

### In `src/app/lapse.tsx`

4. **`lapse.tsx:183` — step-0 pill label.**
   Current: `Continue`. Design (`Lapse-When`): `Log the urge`.
   Caveat before closing: the frame's own rail shows this as step **1 of 3** and the next frame's
   pill reads `Continue · 2`, so the canvas string is an unedited carry-over from the urge flow
   (`Urge-Log-When` is that flow's *last* question). The app's `Continue` is the correct word for the
   position; the design literal is what is wrong. Recommend fixing the frame, not the app.

5. **`lapse.tsx:184` — step-1 pill label and missing count.**
   Current: `Log the lapse` (`Logging…` while saving), no selection count.
   Design (`Lapse-Trigger`): `Continue · 2` — the same `Continue · N` count suffix that
   `urge-log.tsx:571` already builds for the identical trigger grid.
   Same caveat as #4: on the design's wording the lapse would be committed on a later step that the
   canvas never draws (frame 3 of the rail is the logged card). If the frame's wording is taken as
   authoritative, the flow needs a step; if the flow is authoritative, at minimum the count suffix
   (`Log the lapse · 2`) is portable today.

6. **`lapse.tsx:176` — "What I did" value on the logged card.**
   Current: fixed literal `Slipped`. Design (`Lapse-Done`): `Rode it out`.
   Same carry-over as #4/#5 — `Rode it out` is an urge-flow outcome and contradicts the screen's own
   title (`Lapse logged.`). Do not close this against the app.

### RN-inexpressible (MISMATCH\*) — items 7 and 8 are in the shared `LoggedNote` used by Lapse-Done

7. **`urge-log.tsx:330-338` — warm glow has no blur.**
   Design: `filter: blur(4px)` over `radial-gradient(closest-side, rgba(226,186,120,0.36),
   rgba(226,186,120,0) 74%)`. App: the same two-stop ramp with no blur (react-native-svg has no
   filter primitive). Visible effect: the falloff's kink at 74% stays ~2px sharper than the canvas.

8. **`urge-log.tsx:341-350` — ground shadow has no blur.**
   Design: flat `rgba(0,0,0,0.10)` ellipse under `filter: blur(4px)`.
   App substitutes a 3-stop radial falloff (`0 → 0.1`, `0.6 → 0.055`, `1 → 0`).

9. **`urge-log.tsx:95` / `AppText.tsx:128` — heading has no balanced wrap.**
   Design (`Lapse-When`, `Lapse-Trigger`): `text-wrap: balance` on the heading box.
   App: the platform's greedy wrap (`AppText` sets `textWrap` only on web, and only for
   hero/display/title). Neither `When did it happen?` nor `What fed it?` wraps at 22px inside the
   305pt box, so no glyph moves on these two frames.

### In `src/components/StoicTabBar.tsx` (adjacent; frames 033–035 draw it)

10. Bar height **97** vs the canvas's **83** (the canvas assumed a 20pt bottom inset; the device gives 34).
11. **4 tabs** vs the canvas's **3** — the extra `All` tab (StoicTabBar.tsx:42).
12. Tab centres **49.125 / 147.375 / 245.625 / 343.875** vs the canvas's **70 / 196 / 318**.
13. Label box widths **60 / 60 / 66 / 60** vs the canvas's **44 / 52 / 60**.

Items 11–13 are documented as deliberate in the file's header comment; they are still differences
from the frame and are listed so the decision stays visible rather than assumed.

## Behavioural notes (not property rows)

- `log.tsx:349-368` — urge rows and check-in rows carry the design's disclosure chevron but set no
  `onPress`, so they render an affordance that does nothing. Only report rows navigate
  (`log.tsx:540`). The drawn properties match; the behaviour does not follow the drawn promise.
- `log.tsx:404-412, 523` — three empty states (`No urges logged yet`, `No check-ins yet`,
  `No reports yet`) have no frame in this set; they are app-only and were not audited.
- `log.tsx:441` — the `Earlier` bucket is a third group heading the canvas never draws; the frames
  only ever show `This week` and `Last week`.
- `Log-Chooser`'s X is a dismiss glyph on the canvas; the app maps it to "open log history"
  (`log.tsx:179`). The frames give no other route into 033–035, and 033–035's `Back` returns to the
  chooser, so the mapping is consistent with the set.
