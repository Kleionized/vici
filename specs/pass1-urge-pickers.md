# Pass 1 — Urge pickers (second reader)

**Frames audited** (bundle `Email Login`, all read in full, pretty + raw):

| Slug | Pretty | Raw |
|---|---|---|
| Cue-Hue-Picker | `.uifinal/pretty/final/Email Login/Cue-Hue-Picker.html` (360 lines) | `.uifinal/final/Email Login/Cue-Hue-Picker.html` |
| SOS-Feeling-Picker | `.uifinal/pretty/final/Email Login/SOS-Feeling-Picker.html` (496 lines) | `.uifinal/final/Email Login/SOS-Feeling-Picker.html` |
| SOS-Reason-Picker | `.uifinal/pretty/final/Email Login/SOS-Reason-Picker.html` (468 lines) | `.uifinal/final/Email Login/SOS-Reason-Picker.html` |

**App file audited in full:** `/Users/admin/Documents/tideline/src/components/urge/index.tsx`
(`PaperSheet` 578, `PickerRow` 861, `PickerGlyph` 941, `PickerNote` 951, `PickerContinue` 960,
`PickerBack` 983, `PickerHead` 1000, `PLACE_GLYPH` 1016, `WherePage` 1050, `FEELINGS` 1078,
`FeelingPage` 1114, `URGE_REASONS` 1144, `ReasonPage` 1186, state defaults 2211–2213).
Supporting primitives read in full: `src/components/ui/press-scale.tsx`,
`src/components/ui/AppText.tsx`, `src/lib/theme.ts` (`sans`, `sansFamily`).

**Verification method.** The pretty frames were proved lossless against the raw frames by
comparing declaration multisets (207 / 289 / 276 declarations, identical in all three). Every
glyph primitive was extracted from the raw HTML and from the JSX and compared by machine
(31 shapes across 17 glyph slots — `d` strings compared as exact strings, numerics normalised);
every visible frame string was extracted and substring-matched against the app source.

## Coordinate convention

Each frame is 393 × 852 and the first 54px is a status bar the app never builds. Every element
on these three boards lives inside the sheet `div`, whose own frame-absolute `top` is **52**, so
the inner `top` values quoted by the frame are already sheet-relative. Three readings are given
below where they matter:

* **canvas abs** = 52 + sheet-relative (the frame's own y)
* **app-equiv** = canvas abs − 54 (offset from the safe-area top)
* **app value** = what the source actually writes (sheet-relative, because `PaperSheet` puts the
  sheet at `insets.top − 2`, i.e. at app-equiv −2 = canvas abs 52)

E.g. headline: sheet-rel 62 → canvas abs 114 → app-equiv 60; app writes `top: 62` inside a sheet
whose top is app-equiv −2, so it lands at app-equiv 60. Consistent.

---

## A. Sheet shell — `PaperSheet` (index.tsx:578)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 3 | Phone ground | background | `#EDECE7` | `SHEET_EDGE = '#EDECE7'` (581) | match |
| all 3 | Phone ground | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | ios `'System'`, web `-apple-system, BlinkMacSystemFont, …` (theme.ts:159–189) | match |
| all 3 | Phone ground | -webkit-font-smoothing | `antialiased` | native default; web branch sets `WebkitFontSmoothing:'antialiased'` (AppText.tsx:127) | match |
| all 3 | Sheet | top | 52 (abs 52 / app-equiv −2) | `marginTop: Math.max(0, insets.top - 2)` (586) | match |
| all 3 | Sheet | left / right / bottom | 0 / 0 / 0 | `flex: 1` fills (585) | match |
| all 3 | Sheet | background | `#F4F3F0` | `SHEET_PAPER = '#F4F3F0'` (587) | match |
| all 3 | Sheet | border-radius | `24px 24px 0 0` | `borderTopLeftRadius: 24, borderTopRightRadius: 24` (588–589) | match |
| all 3 | Sheet | overflow | `hidden` | `overflow: 'hidden'` (590) | match |
| all 3 | Status bar | whole group | drawn (time + 3 glyphs, height 54) | not built (`StatusBar style="dark"`, 583) | match (canvas fact) |
| all 3 | Sheet | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` on the 393×852 frame | none | match (frame-mount chrome, not app chrome) |

## B. Back control — `PickerBack` (index.tsx:983)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 3 | Back group | left | 16 | `left: 16` (990) | match |
| all 3 | Back group | top | 14 (abs 66 / app-equiv 12) | `top: 14` (990) | match |
| all 3 | Back group | display / align-items | `flex` / `center` | `flexDirection:'row', alignItems:'center'` (990) | match |
| all 3 | Back group | gap | 9 | `gap: 9` (990) | match |
| all 3 | Back group | min-height | none (intrinsic) | `minHeight: 0` overrides PressScale's 44 (990) | match |
| all 3 | Back chevron | width × height | 11 × 19 | `width={11} height={19}` (991) | match |
| all 3 | Back chevron | viewBox | `0 0 11 19` | `"0 0 11 19"` (991) | match |
| all 3 | Back chevron | path `d` | `M9.5 1.5L2 9.5l7.5 8` | `M9.5 1.5L2 9.5l7.5 8` (992) | match |
| all 3 | Back chevron | fill | `none` | `fill="none"` on `<Svg>` (991) | match |
| all 3 | Back chevron | stroke | `#55534E` | `"#55534E"` (992) | match |
| all 3 | Back chevron | stroke-width | `2.4` | `2.4` (992) | match |
| all 3 | Back chevron | stroke-linecap / linejoin | `round` / `round` | `round` / `round` (992) | match |
| all 3 | "Back" | text | `Back` | `Back` (994) | match |
| all 3 | "Back" | font-size | 17 | `fontSize: 17` (994) | match |
| all 3 | "Back" | font-weight | 400 | `sans('400')` (994) | match |
| all 3 | "Back" | color | `#55534E` | `SHEET_MUTED = '#55534E'` (994) | match |
| all 3 | "Back" | letter-spacing | none | dropped by AppText (own fontSize, no own letterSpacing → AppText.tsx:138) | match |
| all 3 | "Back" | line-height | none | dropped by AppText (AppText.tsx:139) | match |
| all 3 | Back group | pressed state | not drawn | PressScale scales to 0.96 | match (no drawn state) |

## C. Header — `PickerHead` (index.tsx:1000)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 3 | Headline | left / right | 0 / 0 | `left: 0, right: 0` (1003) | match |
| all 3 | Headline | top | 62 (abs 114 / app-equiv 60) | `top: 62` (1003) | match |
| all 3 | Headline | text-align | `center` | `center` prop (1003) | match |
| all 3 | Headline | font-size | 22 | `fontSize: 22` (1003) | match |
| all 3 | Headline | font-weight | 500 | `sans('500')` (1003) | match |
| all 3 | Headline | letter-spacing | `0.1px` | `letterSpacing: 0.1` (1003) | match |
| all 3 | Headline | line-height | none | dropped (own fontSize, no own lineHeight) | match |
| all 3 | Headline | color | `#1D1C1A` | `SHEET_TEXT = '#1D1C1A'` (1003) | match |
| Cue-Hue | Headline | text | `Where are you right now?` | same (1054) | match |
| Feeling | Headline | text | `What’s underneath it?` (`&rsquo;`) | `What’s underneath it?` (1119) | match |
| Reason | Headline | text | `What’s feeding it?` (`&rsquo;`) | `What’s feeding it?` (1191) | match |
| all 3 | Sub | top | 106 (abs 158 / app-equiv 104) | `top: 106` (1006) | match |
| Cue-Hue | Sub | left / right | 40 / 40 | `inset={40}` (1054) | match |
| Feeling | Sub | left / right | 36 / 36 | `inset={36}` (1121) | match |
| Reason | Sub | left / right | 36 / 36 | `inset={36}` (1193) | match |
| all 3 | Sub | text-align | `center` | `center` prop (1006) | match |
| all 3 | Sub | font-size | 15.5 | `fontSize: 15.5` (1006) | match |
| all 3 | Sub | font-weight | 400 | `sans('400')` (1006) | match |
| all 3 | Sub | line-height | 23 | `lineHeight: 23` (1006) | match |
| all 3 | Sub | color | `#55534E` | `SHEET_MUTED = '#55534E'` (1006) | match |
| all 3 | Sub | letter-spacing | none | dropped by AppText | match |
| Feeling, Reason | Sub | text-wrap | `pretty` | no RN equivalent; native falls back to greedy wrapping (AppText sets `textWrap:'pretty'` on **web only**, AppText.tsx:128) | **MISMATCH\*** |
| Cue-Hue | Sub | text-wrap | *(not declared)* | web branch applies `textWrap:'pretty'` anyway (variant `body`) | **MISMATCH\*** (web only) |
| Cue-Hue | Sub | text | `The first move depends on it. Be honest — nobody's watching.` (`&mdash;`, straight `'`) | identical, char for char (1054) | match |
| Feeling | Sub | text | `The urge is rarely the whole story. Name the feeling under it and it loses most of its grip.` | identical (1120) | match |
| Reason | Sub | text | `Urges borrow fuel from somewhere. Point at the source — picking it is half the defusing.` | identical (1192) | match |

## D. Row shell — `PickerRow` (index.tsx:861)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 3 | Row | position | `absolute` | `absolute` (889) | match |
| all 3 | Row | left / right | 24 / 24 | `left: 24, right: 24` (890–891) | match |
| Cue-Hue, Reason | Row | height | 60 | `height={60}` (1059, 1199) | match |
| Feeling | Row | height | 66 | `height={66}` (1127) | match |
| all 3 | Row | min-height | n/a (height fixed) | `minHeight: height` overrides PressScale's 44 (894) | match |
| all 3 | Row | border-radius | `18px` (circular, all 4 corners) | `borderRadius: 18` (895) | match |
| all 3 | Row | corner curve | circular (CSS has no continuous curve) | `borderCurve: 'continuous'` (896) — iOS squircle | **MISMATCH** |
| all 3 | Row | background | `#FFFFFF` (both states) | `'#FFFFFF'` (897) | match |
| all 3 | Row (selected) | box-shadow | `0 0 0 1.6px #131313` | `'0 0 0 1.6px #131313'` (898) | match |
| all 3 | Row (unselected) | box-shadow | `0 0 0 1px rgba(0,0,0,0.10)` | `'0 0 0 1px rgba(0,0,0,0.10)'` (898) | match |
| all 3 | Row | padding | `0 18px` | `paddingHorizontal: 18` (899) | match |
| all 3 | Row | display / flex-direction | `flex` / row | `flexDirection: 'row'` (900) | match |
| all 3 | Row | align-items | `center` | `alignItems: 'center'` (901) | match |
| all 3 | Row | gap | 14 | `gap: 14` (902) | match |
| all 3 | Row | cursor | `pointer` | n/a on native | match (not expressible, no visual) |
| all 3 | Row | active transform | `scale(0.99)` | PressScale `withTiming(0.96, {duration:110})` (press-scale.tsx:25) | **MISMATCH** |
| all 3 | Disc | width × height | 38 × 38 | `width: 38, height: 38` (904) | match |
| all 3 | Disc | border-radius | `50%` (= 19) | `borderRadius: 19` (904) | match |
| all 3 | Disc (selected) | background | `#131313` | `'#131313'` (904) | match |
| all 3 | Disc (unselected) | background | `#F1EFE9` | `'#F1EFE9'` (904) | match |
| all 3 | Disc | align / justify | `center` / `center` | `alignItems:'center', justifyContent:'center'` (904) | match |
| all 3 | Disc | flex-shrink | 0 | RN default `flexShrink: 0` | match |
| all 3 | Text column | flex | 1 | `flex: 1` (907) | match |
| all 3 | Text column | min-width | 0 | `minWidth: 0` (907) | match |
| all 3 | Label | font-size | 15 | `fontSize: 15` (908) | match |
| all 3 | Label (selected) | font-weight | 600 | `sans('600')` (908) | match |
| all 3 | Label (unselected) | font-weight | 500 | `sans('500')` (908) | match |
| all 3 | Label | color | `#1D1C1A` (both states) | `SHEET_TEXT = '#1D1C1A'` (908) | match |
| all 3 | Label | letter-spacing / line-height | none / none | both dropped by AppText | match |
| all 3 | Label | max lines | unconstrained (no `white-space`/clamp) | `numberOfLines={1}` (908) | **MISMATCH** (inert at these strings) |
| Feeling | Note | margin-top | 1 | `marginTop: 1` (912) | match |
| Feeling | Note | font-size | 12.5 | `fontSize: 12.5` (912) | match |
| Feeling | Note | font-weight | 400 (all rows, incl. selected) | `sans('400')` unconditional (912) | match |
| Feeling | Note | color | `#8B8882` (all rows, incl. selected) | `SHEET_SOFT = '#8B8882'` unconditional (912) | match |
| Feeling | Note | white-space / overflow / text-overflow | `nowrap` / `hidden` / `ellipsis` | `numberOfLines={1}` + default `ellipsizeMode="tail"` (912) | match |
| Cue-Hue, Reason | Note | presence | absent | `note` undefined → not rendered (911) | match |
| Cue-Hue, Feeling | Trailing dot | render condition | selected row only | `trailing === 'dot' && selected` (917) | match |
| Cue-Hue, Feeling | Trailing dot | width × height | 7 × 7 | `width: 7, height: 7` (917) | match |
| Cue-Hue, Feeling | Trailing dot | border-radius | `50%` (= 3.5) | `borderRadius: 3.5` (917) | match |
| Cue-Hue, Feeling | Trailing dot | background | `#131313` | `'#131313'` (917) | match |
| Reason | Trailing check | render condition | every row (filled or ring) | `trailing === 'check'` unconditional (918) | match |
| Reason | Trailing check | width × height | 24 × 24 | `width: 24, height: 24` (921–922) | match |
| Reason | Trailing check | border-radius | `50%` (= 12) | `borderRadius: 12` (923) | match |
| Reason | Trailing check (on) | background | `#131313` | `'#131313'` (924) | match |
| Reason | Trailing check (on) | box-shadow | none | `undefined` (925) | match |
| Reason | Trailing check (off) | background | none | `undefined` (924) | match |
| Reason | Trailing check (off) | box-shadow | `inset 0 0 0 1.5px rgba(0,0,0,0.22)` | `'inset 0 0 0 1.5px rgba(0,0,0,0.22)'` (925) | match |
| Reason | Trailing check (off) | box-sizing | `border-box` | RN box model is border-box | match |
| Reason | Tick svg | width × height | 12 × 12 | `width={12} height={12}` (930) | match |
| Reason | Tick svg | viewBox | `0 0 14 14` | `"0 0 14 14"` (930) | match |
| Reason | Tick path | `d` | `M2.5 7.5l3 3 6-7` | `M2.5 7.5l3 3 6-7` (931) | match |
| Reason | Tick path | stroke | `#F4F3F0` | `"#F4F3F0"` (931) | match |
| Reason | Tick path | stroke-width | `2.2` | `2.2` (931) | match |
| Reason | Tick path | fill | `none` | `fill="none"` on `<Svg>` (930) | match |
| Reason | Tick path | linecap / linejoin | `round` / `round` | `round` / `round` (931) | match |

## E. Glyph frame — `PickerGlyph` (index.tsx:941)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 3 | Glyph svg | width × height | 21 × 21 | `width={21} height={21}` (944) | match |
| all 3 | Glyph svg | viewBox | `0 0 24 24` | `"0 0 24 24"` (944) | match |
| all 3 | Glyph svg | fill | `none` | `fill="none"` (944) | match |
| all 3 | Glyph svg (selected) | stroke | `#F4F3F0` | `'#F4F3F0'` (942) | match |
| all 3 | Glyph svg (unselected) | stroke | `#1D1C1A` | `'#1D1C1A'` (942) | match |
| all 3 | Glyph svg | stroke-width | `2` | `strokeWidth={2}` (944) | match |
| all 3 | Glyph svg | stroke-linecap | `round` | `strokeLinecap="round"` (944) | match |
| all 3 | Glyph svg | stroke-linejoin | `round` | `strokeLinejoin="round"` (944) | match |

### E1. The 17 glyph slots — every primitive compared by machine

`PLACE_GLYPH` (1016–1048) · `FEELINGS[].glyph` (1078–1112) · `URGE_REASONS[].glyph` (1144–1184).
31 primitives, all identical. `d` strings compared as exact strings; numerics normalised.

| Frame | Glyph | Primitive | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Cue-Hue | private | rect | `x=6 y=3.5 w=12 h=17 rx=1.6` | `x={6} y={3.5} width={12} height={17} rx={1.6}` (1019) | match |
| Cue-Hue | private | circle | `cx=14.6 cy=12.5 r=1.1` | `cx={14.6} cy={12.5} r={1.1}` (1020) | match |
| Cue-Hue | bed | path `d` | `M3.5 18.5v-8M3.5 14.5h17v4M3.5 14.5V9h6.6c2.4 0 3.7 1.3 3.7 3.3v2.2` | identical (1025) | match |
| Cue-Hue | bed | circle | `cx=7.1 cy=11.4 r=1.2` | identical (1026) | match |
| Cue-Hue | public | circle A | `cx=8.5 cy=9 r=3.2` | identical (1031) | match |
| Cue-Hue | public | circle B | `cx=16.5 cy=9 r=3.2` | identical (1032) | match |
| Cue-Hue | public | path `d` | `M2.5 20c.8-3.4 3.2-5 6-5 1.4 0 2.7.4 3.5 1.2.8-.8 2.1-1.2 3.5-1.2 2.8 0 5.2 1.6 6 5` | identical (1033) | match |
| Cue-Hue | work | rect | `x=3 y=8 w=18 h=12 rx=2.5` | identical (1038) | match |
| Cue-Hue | work | path `d` | `M9 8V6a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18` | identical (1039) | match |
| Cue-Hue | out | path `d` | `M12 21s7-5.4 7-11a7 7 0 0 0-14 0c0 5.6 7 11 7 11z` | identical (1044) | match |
| Cue-Hue | out | circle | `cx=12 cy=10 r=2.6` | identical (1045) | match |
| Feeling | Hungry | path 1 `d` | `M4.5 10.5h15a7.5 6.5 0 0 1-15 0z` | identical (1084) | match |
| Feeling | Hungry | path 2 `d` | `M9.5 7c0-1 .7-1.3.7-2.3M13.8 7c0-1 .7-1.3.7-2.3` | identical (1085) | match |
| Feeling | Angry | path `d` | `M13 2L5 13.5h5.5L10 22l8-11.5h-5.5z` | identical (1089) | match |
| Feeling | Lonely | circle | `cx=12 cy=8 r=3.6` | identical (1095) | match |
| Feeling | Lonely | path `d` | `M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6` | identical (1096) | match |
| Feeling | Tired | path `d` | `M14.5 3.5a8.5 8.5 0 1 0 6 12.5 8 8 0 0 1-6-12.5z` | identical (1100) | match |
| Feeling | Bored | path 1 `d` | `M3.5 13c2.4-3.4 4.6-3.4 7 0s4.6 3.4 7 0` | identical (1106) | match |
| Feeling | Bored | path 2 `d` | `M6.5 7h.01M14.5 7h.01` | identical (1107) | match |
| Feeling | Stressed | path `d` | `M3 13.5h3.5L9 8l3 9 2.5-6.5 1.5 3H21` | identical (1111) | match |
| Reason | Relationship | path `d` | `M12 20.5s-7.6-4.7-9.3-9.1A5.2 5.2 0 0 1 12 6.4a5.2 5.2 0 0 1 9.3 5c-1.7 4.4-9.3 9.1-9.3 9.1z` | identical (1145) | match |
| Reason | Work or school | rect | `x=3 y=8 w=18 h=12 rx=2.5` | identical (1150) | match |
| Reason | Work or school | path `d` | `M9 8V6a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18` | identical (1151) | match |
| Reason | Family | path 1 `d` | `M4 11.5 12 4l8 7.5` | identical (1159) | match |
| Reason | Family | path 2 `d` | `M6.5 10v10h11V10` | identical (1160) | match |
| Reason | Money | rect | `x=3 y=7 w=18 h=10.5 rx=2.2` | identical (1168) | match |
| Reason | Money | circle | `cx=12 cy=12.2 r=2.5` | identical (1169) | match |
| Reason | Money | path `d` | `M6.2 10h.01M17.8 14.5h.01` | identical (1170) | match |
| Reason | Health | path `d` | `M3 12.5h4l2.5-6 3 11 2.5-6.5H21` | identical (1174) | match |
| Reason | No clear reason | circle | `cx=12 cy=12 r=8.5` | identical (1179) | match |
| Reason | No clear reason | path `d` | `M9.8 9.7a2.3 2.3 0 0 1 4.4.5c0 1.5-2.2 1.7-2.2 3.2M12 16.6h.01` | identical (1180) | match |

Note: `rx` with no `ry` — SVG implies `ry = rx`; react-native-svg does the same. All three rects
match on that reading.

## F. Footnote — `PickerNote` (index.tsx:951)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Feeling, Reason | Note | left / right | 24 / 24 | `left: 24, right: 24` (953) | match |
| Feeling, Reason | Note | top | 660 (abs 712 / app-equiv 658) | `top: 660` (953) | match |
| Feeling, Reason | Note | text-align | `center` | `center` prop (953) | match |
| Feeling, Reason | Note | font-size | 12 | `fontSize: 12` (953) | match |
| Feeling, Reason | Note | font-weight | 500 | `sans('500')` (953) | match |
| Feeling, Reason | Note | color | `#A8A5A0` | `'#A8A5A0'` literal (953) | match |
| Feeling | Note | text | `H·A·L·T — the four states that fake an urge best.` | identical (1137) | match |
| Reason | Note | text | `Nothing here is an excuse — it’s a map.` | identical (1208) | match |
| Cue-Hue | Note | presence | absent | not rendered by `WherePage` (1050–1071) | match |

## G. Continue pill — `PickerContinue` (index.tsx:960)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 3 | Pill | left / right | 24 / 24 | `left: 24, right: 24` (968–969) | match |
| all 3 | Pill | top | 688 (abs 740 / app-equiv 686) → 60 above the 800pt sheet's bottom | `bottom: 60` (970) | match |
| all 3 | Pill | height | 52 | `height: 52, minHeight: 52` (971) | match |
| all 3 | Pill | border-radius | 26 | `borderRadius: 26` (972) | match |
| all 3 | Pill | background | `#131313` | `SHEET_INK = '#131313'` (973) | match |
| all 3 | Pill | align / justify | `center` / `center` | `alignItems:'center', justifyContent:'center'` (974–975) | match |
| all 3 | Pill label | text | `Continue` | `Continue` (977) | match |
| all 3 | Pill label | font-size | 17.5 | `fontSize: 17.5` (977) | match |
| all 3 | Pill label | font-weight | 600 | `sans('600')` (977) | match |
| all 3 | Pill label | letter-spacing | `0.3px` | `letterSpacing: 0.3` (977) | match |
| all 3 | Pill label | color | `#FFFFFF` | `'#FFFFFF'` (977) | match |
| all 3 | Pill | active transform | `scale(0.99)` | PressScale `0.96` (press-scale.tsx:25) | **MISMATCH** |
| Feeling, Reason | Note → Pill | gap between tops | 28 (660 → 688) | note top-anchored at 660, pill bottom-anchored at 60 — equal only when the sheet is exactly 800pt tall | **MISMATCH** (0pt error on the reference geometry, 5pt on a real 393×852 device where `insets.top` is 59) |

## H. Per-board row geometry and drawn states

### Cue-Hue-Picker — `WherePage` (index.tsx:1050), `PLACES` (544)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Cue-Hue | Rows | count | 5 | `PLACES.length === 5` | match |
| Cue-Hue | Rows | tops | 170, 242, 314, 386, 458 (pitch 72) | `170 + index * 72` (1058) | match |
| Cue-Hue | Rows | order + labels | Somewhere private, In bed, A public space, At work or school, Out and about | identical order (544–550) | match |
| Cue-Hue | Rows | trailing kind | dot | `trailing="dot"` (1063) | match |
| Cue-Hue | Rows | role | single-select | `role="radio"` (1064) | match |
| Cue-Hue | Row 1 | drawn state | selected (1.6px ring, ink disc, `#F4F3F0` glyph, weight 600, dot) | default `place = 'private'` → row 1 selected (2211) | match |
| Cue-Hue | Rows 2–5 | drawn state | unselected | unselected | match |
| Cue-Hue | Board | footnote | none | none | match |

### SOS-Feeling-Picker — `FeelingPage` (index.tsx:1114), `FEELINGS` (1078)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Feeling | Rows | count | 6 | `FEELINGS.length === 6` | match |
| Feeling | Rows | tops | 170, 246, 322, 398, 474, 550 (pitch 76) | `170 + index * 76` (1126) | match |
| Feeling | Rows | height | 66 | `height={66}` (1127) | match |
| Feeling | Rows | order + labels | Hungry, Angry, Lonely, Tired, Bored, Stressed | identical order (1078–1112) | match |
| Feeling | Rows | notes | see §D texts | identical, all six | match |
| Feeling | Rows | trailing kind | dot | `trailing="dot"` (1132) | match |
| Feeling | Rows | role | single-select | `role="radio"` (1133) | match |
| Feeling | Row 5 (Bored) | drawn state | selected | initial `feeling = undefined` → nothing selected until tapped (2212) | match (illustrative state — see note) |

*Note on the drawn selection.* Cue-Hue draws row 1 selected and the app defaults to row 1;
Feeling draws row 5 (`Bored`) selected and Reason draws rows 1+2 selected. Read literally those
two would mean `Bored` and `Relationship + Work or school` are pre-answered. The evidence
supports reading them as state illustrations, not defaults: the frames pick a mid-list row and a
pair, which is how a mock demonstrates the selected treatment, and pre-answering a question the
board is asking would defeat it. Cue-Hue is the one board where the drawn row is also the
sensible default, and the app matches it there.

### SOS-Reason-Picker — `ReasonPage` (index.tsx:1186), `URGE_REASONS` (1144)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Reason | Rows | count | 6 | `URGE_REASONS.length === 6` | match |
| Reason | Rows | tops | 170, 242, 314, 386, 458, 530 (pitch 72) | `170 + index * 72` (1198) | match |
| Reason | Rows | height | 60 | `height={60}` (1199) | match |
| Reason | Rows | order + labels | Relationship, Work or school, Family, Money, Health, No clear reason | identical order (1144–1184) | match |
| Reason | Rows | notes | none | `note` not passed | match |
| Reason | Rows | trailing kind | check | `trailing="check"` (1203) | match |
| Reason | Rows | role | multi-select | `role="checkbox"` + array toggle (1204, 2316) | match |
| Reason | Rows 1–2 | drawn state | selected (ring 1.6px, ink disc, weight 600, filled tick) | initial `reasons = []` (2213) | match (illustrative state — see note above) |
| Reason | Rows 3–6 | drawn state | unselected (ring trailing) | unselected | match |

---

## Findings

**Row count behind this pass: 197 (element, property) comparison rows.** 7 of them carry a
MISMATCH verdict, consolidating into **5 distinct findings** — finding 1 covers 2 rows (row +
pill press state) and finding 3 covers 2 rows (the native `MISMATCH*` and its web inverse).

1. **Pressed-state scale is 0.96, design says 0.99.**
   `src/components/ui/press-scale.tsx:25` — `scale.value = withTiming(0.96, { duration: 110 })`.
   Design: `style-active="transform:scale(0.99)"` — 6 occurrences in Cue-Hue-Picker, 7 in
   SOS-Feeling-Picker, 7 in SOS-Reason-Picker (verified in the raw frames). Reached from
   `PickerRow` (`src/components/urge/index.tsx:883`) and `PickerContinue`
   (`src/components/urge/index.tsx:962`). Current 0.96 → design 0.99. This is a shared primitive,
   so closing it needs a scale prop on `PressScale` rather than an edit in the urge file.

2. **`borderCurve: 'continuous'` on the picker row — the frame draws a circular 18px radius.**
   `src/components/urge/index.tsx:896`. Current `borderCurve: 'continuous'` (iOS squircle) →
   design `border-radius: 18px` with no continuous-curve equivalent in CSS. The rows'
   1.6px/1px ring shadows follow the same curve, so the corners read visibly rounder than the
   frame's.

3. **`text-wrap: pretty` is unavailable on native (MISMATCH\*).**
   `src/components/urge/index.tsx:1006` (`PickerHead` sub). Design: `text-wrap:pretty` on the
   SOS-Feeling-Picker sub (line 119 of the pretty frame) and the SOS-Reason-Picker sub (line 119).
   Current: no substitute on native — RN wraps greedily, so the last line of both two-line subs
   can orphan a word where the frame balances it. Substitute available if wanted: a manual
   `{'\n'}` break or a narrower `inset`. Also note the inverse on web: AppText applies
   `textWrap:'pretty'` to the Cue-Hue sub, which the frame does **not** declare
   (`src/components/ui/AppText.tsx:128`).

4. **Row label is clamped to one line; the frame sets no clamp.**
   `src/components/urge/index.tsx:908` — `numberOfLines={1}`. Design: only the *note* carries
   `white-space:nowrap; overflow:hidden; text-overflow:ellipsis`; the label div carries none of
   the three. Current `numberOfLines={1}` → design unconstrained. Inert at every string these
   boards ship (longest is `At work or school` at 15pt in a 271pt content width), but it becomes
   visible under Dynamic Type or a longer localisation, where the frame would wrap and the app
   truncates.

5. **Footnote and Continue pill use opposite anchors, so their 28pt spacing is not fixed.**
   `src/components/urge/index.tsx:953` anchors the note `top: 660` (sheet-relative), while
   `src/components/urge/index.tsx:970` anchors the pill `bottom: 60`. Design: note top 660, pill
   top 688 — a fixed 28pt gap inside an 800pt sheet. The two agree exactly only when the sheet is
   800pt, i.e. when `insets.top` is 54. On the actual 393×852 device the canvas targets,
   `insets.top` is 59, the sheet is 795pt, and the gap closes to 23pt. Current: mixed anchors →
   design: one anchor for both.

### Not findings, recorded for the next reader

* Sheet-relative offsets are exact throughout: back 14, headline 62, sub 106, rows 170 + pitch,
  note 660, pill 60-from-bottom — all reproduce the canvas's absolute y once the sheet's own
  top (52) is added back. Nothing is rounded anywhere in these three boards.
* Every one of the 31 glyph primitives across the 17 glyph slots is byte-identical to the frame,
  including the two `h.01` dot-pairs and the three arc flags.
* Every visible string on all three boards matches character for character, including the
  `&rsquo;` in both headlines and the reason footnote, the straight apostrophe in the Cue-Hue
  sub, the `&mdash;` in four places and the `&middot;` separators in `H·A·L·T`.
* `AppText` drops its variant leading and tracking whenever the caller names a `fontSize`
  (`AppText.tsx:118–139`), which is why every size-only call here lands on the frame's own
  metrics rather than the `body` variant's `letterSpacing: -0.1`.
* `PressScale` injects `minHeight: 44` ahead of the caller's style; `PickerRow` (60/66),
  `PickerContinue` (52) and `PickerBack` (0) each override it, so no control is inflated.
* `allowFontScaling` is left at RN's default `true` on every text in these boards while the row
  heights are fixed at 60/66. The frame has no equivalent, so this is not a mismatch, but a large
  Dynamic Type setting will clip the Feeling rows' two-line stack.
