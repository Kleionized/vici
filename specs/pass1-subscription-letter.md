# Pass 1 — second reader — `Manage-Subscription`, `Letter-Week-XII`

Bundle: **Email Login**.
Frames read in full: `.uifinal/pretty/final/Email Login/Manage-Subscription.html`,
`.uifinal/pretty/final/Email Login/Letter-Week-XII.html` (raw counterparts diffed
mechanically for dropped declarations and verbatim path `d`).
App read in full: `src/app/subscription.tsx` (193 lines), `src/app/letter.tsx` (669 lines),
plus `src/lib/theme.ts` (`sans`), `src/components/ui/AppText.tsx`,
`src/components/ui/Grain.tsx`, `src/components/ui/press-scale.tsx`, `src/app/_layout.tsx`.

Frames are 393 × 852 and every `top` includes the 54px status bar the app never
builds, so **app top = canvas top − 54**. Both are given. Values inside the letter
sheet are sheet-relative and carry no −54.

MISMATCH = the app can close it. MISMATCH\* = RN cannot express the CSS; the
substitute is named.

---

## Frame: Manage-Subscription → `src/app/subscription.tsx`

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Manage-Subscription | Screen root | background | `#F4F3F0` | `#F4F3F0` (L125) | match |
| Manage-Subscription | Screen root | width / height | 393 × 852 | `flex:1` (device) | match |
| Manage-Subscription | Screen root | overflow | `hidden` | ScrollView clips (L129) | match |
| Manage-Subscription | Screen root | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | `sans()` → `System` (iOS) / `-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif` (web) | match |
| Manage-Subscription | Screen root | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | match (device-frame shadow, not app chrome) |
| Manage-Subscription | Grain | position / inset | `absolute; inset:0` | `absolute; top/left/right/bottom:0` (Grain.tsx) | match |
| Manage-Subscription | Grain | background-image | `url('noise-dark.png')`, no `background-size` → tile at native 96×96 | `require('assets/images/noise-dark.png')`, `resizeMode="repeat"` | match |
| Manage-Subscription | Grain | opacity | `0.07` | `0.07` (L127) | match |
| Manage-Subscription | Grain | pointer-events | `none` | `pointerEvents="none"` | match |
| Manage-Subscription | Grain | z-order | first child, under everything | rendered before `SafeAreaView` (L127) | match |
| Manage-Subscription | Status bar | height / glyphs | 54px, `9:41` 17/600/−0.2, 3 SVG glyphs | not built (native status bar) | match (canvas fact) |
| Manage-Subscription | Back row | position | `absolute; left:16; top:64` | `left:16; top:10` (= 64−54) (L135) | match |
| Manage-Subscription | Back row | flex direction / align / gap | `flex; align-items:center; gap:9` | `row; center; gap:9` (L135) | match |
| Manage-Subscription | Back chevron | size / viewBox | `19×11`? no — `width=11 height=19 viewBox="0 0 11 19"` | `11 × 19`, `viewBox="0 0 11 19"` (L136) | match |
| Manage-Subscription | Back chevron | path `d` | `M9.5 1.5L2 9.5l7.5 8` | identical (L137) | match |
| Manage-Subscription | Back chevron | stroke / width / caps | `#55534E`, `2.4`, `round`/`round`, `fill:none` | identical (L137) | match |
| Manage-Subscription | Back label | text | `Back` | `Back` (L139) | match |
| Manage-Subscription | Back label | size / weight / colour | `17` / `400` / `#55534E` | `17` / `sans('400')` / `#55534E` (L139) | match |
| Manage-Subscription | Back label | letter-spacing / line-height | none stated | AppText drops inherited `-0.1` / lineHeight because size is named | match |
| Manage-Subscription | Title "Subscription" | position | `absolute; left:24; top:122` | `left:24; top:68` (= 122−54) (L142) | match |
| Manage-Subscription | Title | size / weight | `27` / `600` | `27` / `sans('600')` (L142) | match |
| Manage-Subscription | Title | letter-spacing | `-0.2px` | `-0.2` (L142) | match |
| Manage-Subscription | Title | colour | `#1D1C1A` | `#1D1C1A` (L142) | match |
| Manage-Subscription | Membership block | position | `absolute; left:24; right:24; top:204` | `left:24; right:24; top:150` (= 204−54) (L145) | match |
| Manage-Subscription | Membership head row | flex / justify / align / gap | `flex; space-between; flex-start; gap:12` | `row; space-between; flex-start; gap:12` (L146) | match |
| Manage-Subscription | "Yearly" | size / weight / tracking / colour | `24` / `600` / `-0.2px` / `#1D1C1A` | `24` / `600` / `-0.2` / `#1D1C1A` (L148) | match |
| Manage-Subscription | "Yearly" | text (premium state) | `Yearly` | `Yearly` when `premium`; `Free tools` otherwise | match (frame draws the premium state only) |
| Manage-Subscription | Price/renewal line | margin-top | `5px` | `marginTop: 5` (L149) | match |
| Manage-Subscription | Price/renewal line | size / weight / colour | `14` / `400` / `#55534E` | `14` / `sans('400')` / `#55534E` (L149) | match |
| Manage-Subscription | Price/renewal line | text | `$39.99 / year · renews 10 Jul 2027` | `` `${price} / year · renews ${renews}` `` — `$39.99` (or `$26.99` on `yearlyDrop`), date = today + 1y `en-GB` `d MMM yyyy` | match (literal is live data) |
| Manage-Subscription | "Active" badge | background | `#131313` | `#131313` (L153) | match |
| Manage-Subscription | "Active" badge | border-radius | `14px` | `14` (L153) | match |
| Manage-Subscription | "Active" badge | padding | `7px 12px` | `paddingVertical:7; paddingHorizontal:12` (L153) | match |
| Manage-Subscription | "Active" badge | margin-top | `3px` | `marginTop: 3` (L153) | match |
| Manage-Subscription | "Active" badge | flex-shrink | `0` | RN default `0` | match |
| Manage-Subscription | "Active" label | size / weight / colour | `12.5` / `600` / `#F4F3F0` | `12.5` / `sans('600')` / `#F4F3F0` (L154) | match |
| Manage-Subscription | Divider | height / colour | `1px` / `rgba(0,0,0,0.09)` | `1` / `rgba(0,0,0,0.09)` (L159) | match |
| Manage-Subscription | Divider | margin | `18px 0 14px` | `marginTop:18; marginBottom:14` (L159) | match |
| Manage-Subscription | Next-charge row | flex / justify | `flex; space-between` | `row; space-between` (L160) | match |
| Manage-Subscription | "Next charge" | size / weight / colour | `14` / `400` / `#55534E` | `14` / `sans('400')` / `#55534E` (L161) | match |
| Manage-Subscription | Next-charge value | size / weight / colour | `14` / `500` / `#1D1C1A` | `14` / `sans('500')` / `#1D1C1A` (L162) | match |
| Manage-Subscription | Next-charge value | text | `$39.99 on 10 Jul 2027` | `` `${price} on ${renews}` `` (L163) | match |
| Manage-Subscription | Group label "Plan" | position | `absolute; left:28; top:330` | `left:28; top:276` (= 330−54) (L170) | match |
| Manage-Subscription | Group label "Plan" | size / weight / colour | `12.5` / `600` / `#8B8882` | `12.5` / `sans('600')` / `#8B8882` (L51) | match |
| Manage-Subscription | Group label "Plan" | text-transform | none (sentence case) | AppText default variant `body` — no `uppercase` | match |
| Manage-Subscription | Plan card | position | `absolute; left:24; right:24; top:352` | `left:24; right:24; top:298` (= 352−54) (L171) | match |
| Manage-Subscription | Plan card | border-radius | `18px` | `18` (L61) | match |
| Manage-Subscription | Plan card | background | `#FFFFFF` | `#FFFFFF` (L62) | match |
| Manage-Subscription | Plan card | box-shadow | `0 0 0 1px rgba(0,0,0,0.09)` | `boxShadow: '0 0 0 1px rgba(0,0,0,0.09)'` (L64) | match |
| Manage-Subscription | Plan card | padding | `4px 20px` | `paddingVertical:4; paddingHorizontal:20` (L65–66) | match |
| Manage-Subscription | Card row | flex / align / gap | `flex; center; gap:14` | `row; center; gap:14` (L41) | match |
| Manage-Subscription | Card row | padding | `13px 0` | `paddingVertical: 13` (L41) | match |
| Manage-Subscription | Card row | border-bottom | `1px solid rgba(0,0,0,0.06)` on rows 1–2 (Plan) and row 1 (Billing); absent on the last row of each card | `borderBottomWidth: last ? 0 : 1`, `rgba(0,0,0,0.06)`; `last` on Restore purchases (L174) and Receipts (L180) | match |
| Manage-Subscription | Card row | cursor | `pointer` (all 5 rows) | pressable only on "Change plan" (L172); the other four pass no `onPress` → `disabled` (L38) | **MISMATCH** |
| Manage-Subscription | Row icon chip | width / height | `32 × 32` | `32 × 32` (L42) | match |
| Manage-Subscription | Row icon chip | border-radius | `9px` | `9` (L42) | match |
| Manage-Subscription | Row icon chip | background | `#F1EFE9` | `#F1EFE9` (L42) | match |
| Manage-Subscription | Row icon chip | align / justify / shrink | `center` / `center` / `0` | `center` / `center` / RN default `0` (L42) | match |
| Manage-Subscription | Row title | flex / size / weight / colour | `1` / `15` / `500` / `#1D1C1A` | `flex:1` / `15` / `sans('500')` / `#1D1C1A` (L43) | match |
| Manage-Subscription | Row detail | size / weight / colour | `13.5` / `400` / `#8B8882` | `13.5` / `sans('400')` / `#8B8882` (L44) | match |
| Manage-Subscription | Row chevron | size / viewBox | `7 × 12`, `viewBox="0 0 8 14"` | `7 × 12`, `viewBox="0 0 8 14"` (L28) | match |
| Manage-Subscription | Row chevron | path `d` | `M1.5 1.5 6 7l-4.5 5.5` | identical (L24) | match |
| Manage-Subscription | Row chevron | stroke / width / caps / fill | `rgba(0,0,0,0.28)` / `2` / `round`,`round` / `none` | identical (L29) | match |
| Manage-Subscription | Icon "Change plan" | svg size / viewBox | `19 × 19`, `0 0 24 24` | `19 × 19`, `0 0 24 24` (L75) | match |
| Manage-Subscription | Icon "Change plan" | circle | `cx12 cy12 r9`, stroke `#1D1C1A`, sw `1.9`, fill `none` | identical (L76) | match |
| Manage-Subscription | Icon "Change plan" | needle `d` / fill | `M15.5 8.5l-2 5-5 2 2-5z` / `#1D1C1A` | identical (L77) | match |
| Manage-Subscription | Row 1 title / detail | text | `Change plan` / `Yearly · $39.99` | `Change plan` / `` `Yearly · ${price}` `` (L172) | match |
| Manage-Subscription | Icon "Redeem a code" | rect | `x3.5 y8 w17 h4 rx1`, `#1D1C1A`, sw `1.9`, fill `none` | identical (L82) | match |
| Manage-Subscription | Icon "Redeem a code" | ribbon `d` | `M5 12v7.5h14V12M12 8v11.5M12 8c-4 0-5.5-1.6-5.5-3a2 2 0 0 1 3.6-1.2C11.2 5 12 8 12 8zm0 0c4 0 5.5-1.6 5.5-3a2 2 0 0 0-3.6-1.2C12.8 5 12 8 12 8z` | identical (L84) | match |
| Manage-Subscription | Icon "Redeem a code" | stroke / width / fill / linejoin | `#1D1C1A` / `1.9` / `none` / `round` | identical (L85–88) | match |
| Manage-Subscription | Row 2 title | text | `Redeem a code` | `Redeem a code` (L173) | match |
| Manage-Subscription | Icon "Restore purchases" | `d` / stroke / width / caps | `M4.5 12a7.5 7.5 0 1 1 2.2 5.3M4.5 12V7.5M4.5 12H9` / `#1D1C1A` / `1.9` / `round`,`round` | identical (L94) | match |
| Manage-Subscription | Row 3 title | text | `Restore purchases` | `Restore purchases` (L174) | match |
| Manage-Subscription | Group label "Billing" | position | `absolute; left:28; top:544` | `left:28; top:490` (= 544−54) (L177) | match |
| Manage-Subscription | Billing card | position | `absolute; left:24; right:24; top:566` | `left:24; right:24; top:512` (= 566−54) (L178) | match |
| Manage-Subscription | Billing card | radius / bg / shadow / padding | `18` / `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.09)` / `4px 20px` | identical (L61–66) | match |
| Manage-Subscription | Icon "Payment method" | rect | `x3 y5.5 w18 h13 rx2.4`, stroke `#1D1C1A`, sw `1.9`, fill `none` | identical (L99) | match |
| Manage-Subscription | Icon "Payment method" | stripe `d` / sw | `M3 9.5h18` / `1.9` (no linecap) | identical (L100) | match |
| Manage-Subscription | Billing row 1 | title / detail | `Payment method` / `Apple ID` | `Payment method` / `Apple ID` (L179) | match |
| Manage-Subscription | Icon "Receipts" | page `d` / stroke / sw / linejoin | `M6 3.5h8l4 4v13H6z` / `#1D1C1A` / `1.9` / `round` | identical (L105) | match |
| Manage-Subscription | Icon "Receipts" | lines `d` / sw / caps | `M9 12h6M9 15.5h6` / `1.7` / `round` | identical (L106) | match |
| Manage-Subscription | Billing row 2 | title | `Receipts & invoices` | `Receipts & invoices` (L180) | match |
| Manage-Subscription | Cancel subscription | position | `absolute; left:0; right:0; top:712` | `left:0; right:0; top:658` (= 712−54) (L184) | match |
| Manage-Subscription | Cancel subscription | text-align | `center` | `center` prop → `textAlign:'center'` (L184) | match |
| Manage-Subscription | Cancel subscription | size / weight / colour | `15` / `500` / `#8B8882` | `15` / `sans('500')` / `#8B8882` (L184) | match |
| Manage-Subscription | Cancel subscription | cursor | `pointer` | plain `AppText`, no `PressScale`, no `onPress`, no `accessibilityRole`, no hit target (L184–186) | **MISMATCH** |
| Manage-Subscription | Below the cancel | content | nothing drawn | nothing rendered | match |
| Manage-Subscription | Scroll geometry | — | frame is a fixed 852 board | `contentContainerStyle={{height:700}}` clears the 658 + ~18 cancel | match |

### Geometry cross-check (derived, not stated in the frame)

| Derived | Design | App | Verdict |
|---|---|---|---|
| Card row height | 13 + 32 + 13 = 58 (+1 hairline) | icon 32 forces 58; `PressScale` `minHeight:44` never binds | match |
| Plan card height | 4 + 59 + 59 + 58 + 4 = 184 → bottom 536, "Billing" at 544 | same | match |
| Billing card height | 4 + 59 + 58 + 4 = 125 → bottom 691, cancel at 712 | same | match |

---

## Frame: Letter-Week-XII → `src/app/letter.tsx` (`variant='week12'`, `phase='read'`)

Path through the file: `LetterScreen` → `MailSheet` → `LetterBody bottom={80} showsIndicator`
→ `Week12Letter` (`Salutation` / `LetterP` / `Week12Scene` / `Signoff` / `KeepPill`)
→ the standalone `Continue`.

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Letter-Week-XII | Screen root | background | `#EDECE7` | `#EDECE7` when `phase==='read'` (L100) | match |
| Letter-Week-XII | Screen root | grain | **none** at root (grain lives inside the sheet only) | no root `Grain` in the read branch | match |
| Letter-Week-XII | Screen root | box-shadow | `0 0 0 1px …, 0 16px 40px rgba(40,38,32,0.16)` | none | match (device-frame shadow) |
| Letter-Week-XII | Status bar | 54px, `9:41`, 3 glyphs | drawn | not built | match (canvas fact) |
| Letter-Week-XII | Sheet | position | `absolute; left:0; right:0; top:52; bottom:0` | `left:0; right:0; top:-2` (= 52−54); `bottom:0` (L417–420) | match |
| Letter-Week-XII | Sheet | border-radius | `24px 24px 0 0` | `borderTopLeftRadius:24; borderTopRightRadius:24` (L421–422) | match |
| Letter-Week-XII | Sheet | background | `#F4F3F0` | `#F4F3F0` (L423) | match |
| Letter-Week-XII | Sheet | overflow | `hidden` | `overflow:'hidden'` (L424) | match |
| Letter-Week-XII | Sheet grain | inset / image / opacity / pointer-events | `inset:0` / `noise-dark.png` / `0.07` / `none` | identical (L426) | match |
| Letter-Week-XII | Grabber wrap | position / justify | `absolute; left:0; right:0; top:12; flex; center` | `left:0; right:0; top:12; alignItems:'center'` (L428) | match |
| Letter-Week-XII | Grabber | width / height | `38 × 5` | `38 × 5` (L429) | match |
| Letter-Week-XII | Grabber | border-radius | `3px` | `3` (L429) | match |
| Letter-Week-XII | Grabber | background | `rgba(19,19,19,0.16)` | `rgba(19,19,19,0.16)` (L429) | match |
| Letter-Week-XII | Close X | position | `absolute; right:22; top:26` | `right:22; top:26` (L437) | match |
| Letter-Week-XII | Close X | size / viewBox | `20 × 20`, `0 0 20 20` | `20 × 20`, `0 0 20 20` (L438) | match |
| Letter-Week-XII | Close X | path `d` | `M3 3l14 14M17 3L3 17` | identical (L439) | match |
| Letter-Week-XII | Close X | stroke / width / caps | `#55534E` / `2` / `round` | identical (L439) | match |
| Letter-Week-XII | Body | position | `absolute; left:34; right:34; top:84; bottom:80` | `left:34; right:34; top:84; bottom:80` (L458, L117) | match |
| Letter-Week-XII | Body | overflow | `auto` | `ScrollView`, `showsVerticalScrollIndicator` true for week12 (L117, L459) | match |
| Letter-Week-XII | Body | computed width | 393 − 34 − 34 = 325 | same | match |
| Letter-Week-XII | Salutation | size / weight | `18` / `600` | `18` / `sans('600')` (L596, L532) | match |
| Letter-Week-XII | Salutation | letter-spacing | `-0.1px` | `-0.1` (L596) | match |
| Letter-Week-XII | Salutation | colour | `#1D1C1A` | `#1D1C1A` (L532) | match |
| Letter-Week-XII | Salutation | line-height | not stated → `normal` | AppText drops the inherited variant leading (own `fontSize`, no `lineHeight`) | match |
| Letter-Week-XII | Salutation | margin | `0 0 22px` | `marginBottom: 22` (L596) | match |
| Letter-Week-XII | Salutation | text | `Sam —` | `{name} —`, name = first token of `displayName` or `friend` (L65, L597) | match |
| Letter-Week-XII | Paragraph (all 4) | size / weight | `15.5` / `400` | `15.5` / `sans('400')` (L537) | match |
| Letter-Week-XII | Paragraph | line-height | `1.8` → 27.9 | `15.5 * 1.8` = 27.9 (L537) | match |
| Letter-Week-XII | Paragraph | colour | `#3A3934` | `#3A3934` (L537) | match |
| Letter-Week-XII | Paragraph | letter-spacing | not stated | AppText drops the inherited `-0.1` | match |
| Letter-Week-XII | Paragraph | `text-wrap` | `pretty` | web only (`AppText` sets `textWrap:'pretty'` on web); no native equivalent | MISMATCH\* — no RN/Yoga substitute; native keeps greedy line breaking |
| Letter-Week-XII | P1 | margin-bottom | `20px` (next margin-top 0 → gap 20) | `gap={20}` (L599) | match |
| Letter-Week-XII | P1 | text | `It's week XII where I'm writing from, and the first thing to say is: we made it out.` | identical (L599) | match |
| Letter-Week-XII | P2 | margin-bottom | `16px`, collapsed against the scene's `36px` margin-top → **36** | `gap={36}`, scene has no `marginTop` (L602, L634) | match |
| Letter-Week-XII | P2 | text | `The first three weekends were the worst of it, so I'll say it plainly: nothing you feel this month lasts longer than a night. You wait one out, and the next one comes back smaller.` | identical (L603–604) | match |
| Letter-Week-XII | Scene frame | width / height | `240 × 186` | `240 × 186`, `viewBox="0 0 240 186"` (L634) | match |
| Letter-Week-XII | Scene frame | margin | `36px auto 40px` | `alignSelf:'center'; marginBottom:40` (top gap carried by P2) (L634) | match |
| Letter-Week-XII | Scene frame | overflow | `hidden` | SVG viewport clips to 240 × 186 | match |
| Letter-Week-XII | Scene · sun glow | box | `left:128; top:4; 112 × 112; radius 50%` → centre (184, 60) r 56 | `Ellipse cx=184 cy=60 rx=56 ry=56` (L648) | match |
| Letter-Week-XII | Scene · sun glow | gradient | `radial-gradient(closest-side, rgba(226,186,120,0.38), rgba(226,186,120,0) 74%)` | `RadialGradient` 50%/50%, stop 0 `#E2BA78` @ 0.38, stop 0.74 `#E2BA78` @ 0 (L636–639) | match (`#E2BA78` = rgb(226,186,120); `closest-side` on a square = the 56 radius) |
| Letter-Week-XII | Scene · sun glow | filter | `blur(4px)` | none | MISMATCH\* — RN has no `filter: blur`; the gradient's own 0→0.74 falloff is the substitute |
| Letter-Week-XII | Scene · sun disc | box / colour | `left:162; top:32; 34 × 34; radius 50%; #E9D2A4` → centre (179, 49) r 17 | `Circle cx=179 cy=49 r=17 fill="#E9D2A4"` (L649) | match |
| Letter-Week-XII | Scene · star 1 | box / colour | `left:14; top:24; 2 × 2; radius 50%; rgba(200,225,235,0.4)` → (15, 25) r 1 | `Circle cx=15 cy=25 r=1 fill="rgba(200,225,235,0.4)"` (L650) | match |
| Letter-Week-XII | Scene · star 2 | box / colour | `left:44; top:52; 2 × 2; rgba(200,225,235,0.3)` → (45, 53) r 1 | `Circle cx=45 cy=53 r=1 fill="rgba(200,225,235,0.3)"` (L651) | match |
| Letter-Week-XII | Scene · hill 1 | box | `left:-40; right:-40; top:100; height:100` → x −40…280, w 320 | `hill(-40, 320, 100, 48)` (L653) | match |
| Letter-Week-XII | Scene · hill 1 | border-radius | `50% 50% 0 0 / 48px 48px 0 0` → rx 160, ry 48, no corner scaling (160+160 = 320 = width) | arc `A160 48 0 0 1` (L630) | match |
| Letter-Week-XII | Scene · hill 1 | background | `#DEDDD6` | `#DEDDD6` (L653) | match |
| Letter-Week-XII | Scene · hill 2 | box / radius / colour | `left:-90; right:-30; top:126; h100`; `… / 42px`; `#CFCEC7` → x −90…270, w 360, rx 180, ry 42 | `hill(-90, 360, 126, 42)`, `#CFCEC7` (L654) | match |
| Letter-Week-XII | Scene · hill 3 | box / radius / colour | `left:-30; right:-100; top:148; h100`; `… / 36px`; `#C5C4BD` → x −30…340, w 370, rx 185, ry 36 | `hill(-30, 370, 148, 36)`, `#C5C4BD` (L655) | match |
| Letter-Week-XII | Scene · path dash 1 | box / radius / fill | `left:34; top:150; 13 × 4; radius 2; rgba(255,255,255,0.55)` | `Rect x=34 y=150 w=13 h=4 rx=2` same fill (L657) | match |
| Letter-Week-XII | Scene · path dash 1 | transform | `rotate(14deg)`, origin 50% 50% → (40.5, 152) | `rotate(14 40.5 152)` (L657) | match |
| Letter-Week-XII | Scene · path dash 2 | box / transform | `left:58; top:136; rotate(10deg)` → origin (64.5, 138) | `Rect x=58 y=136`, `rotate(10 64.5 138)` (L658) | match |
| Letter-Week-XII | Scene · path dash 3 | box / transform | `left:84; top:124; rotate(6deg)` → origin (90.5, 126) | `Rect x=84 y=124`, `rotate(6 90.5 126)` (L659) | match |
| Letter-Week-XII | Scene · signpost | box / fill | `left:139; top:56; 3 × 46; #C6C5C0` | `Rect x=139 y=56 w=3 h=46 fill="#C6C5C0"` (L662) | match |
| Letter-Week-XII | Scene · signpost | border-radius | `2px` — CSS scales overlapping radii by `3/(2+2)=0.75` → **1.5** on a 3-wide box | `rx={1.5}` (SVG clamps rx to width/2 = 1.5 identically) (L662) | match (computed value, both render 1.5) |
| Letter-Week-XII | Scene · sign board | box / fill | `left:142; top:57; 15 × 10; #E9D2A4` | path from (142,57) to (157,67), fill `#E9D2A4` (L663) | match |
| Letter-Week-XII | Scene · sign board | border-radius | `1px 3px 3px 1px` (TL 1, TR 3, BR 3, BL 1) | `A1 1` on the two left corners, `A3 3` on the two right (L663) | match |
| Letter-Week-XII | Scene · head | box / radius / fill | `left:112; top:64; 11 × 11; 50%; #B4B1AB` → (117.5, 69.5) r 5.5 | `Circle cx=117.5 cy=69.5 r=5.5 fill="#B4B1AB"` (L664) | match |
| Letter-Week-XII | Scene · torso | box / radius / fill | `left:110; top:77; 15 × 27; radius 7; #C6C5C0` (no corner scaling) | `Rect x=110 y=77 w=15 h=27 rx=7 fill="#C6C5C0"` (L665) | match |
| Letter-Week-XII | Scene · cast shadow | box | `left:100; top:100; 44 × 10; radius 50%` → (122, 105) rx 22 ry 5 | `Ellipse cx=122 cy=105 rx=22 ry=5` (L666) | match |
| Letter-Week-XII | Scene · cast shadow | fill + filter | flat `rgba(0,0,0,0.10)` + `filter: blur(4px)` | radial `#000` 0.1 → 0.05 @0.62 → 0 @1 (L640–644, L666) | MISMATCH\* — RN has no `filter: blur`; a 3-stop radial falloff stands in for the flat-fill-plus-blur |
| Letter-Week-XII | Scene | paint order | glow, sun, star, star, hill×3, dash×3, post, sign, head, torso, shadow | identical order (L648–666) | match |
| Letter-Week-XII | P3 | margin-bottom / text | `20px` / `The late nights stopped being dangerous around week IV. The urges got shorter, then quieter, then rare — somewhere in week IX I stopped bracing for them.` | `gap={20}`, identical text (L607–610) | match |
| Letter-Week-XII | P4 | margin / text | `0` / `Everything you circled tonight — it's here, waiting.` | `gap={0}`, identical text (L611) | match |
| Letter-Week-XII | Signoff | margin-top | `26px` (P4's margin-bottom is 0 → gap 26) | `gap={26}` → `marginTop:26` (L612, L551) | match |
| Letter-Week-XII | Signoff | size / weight / colour | `16` / `600` / `#1D1C1A` | `16` / `sans('600')` / `#1D1C1A` (L551) | match |
| Letter-Week-XII | Signoff | text | `— Sam, at week XII` | `— {name}, at week XII` (L612) | match |
| Letter-Week-XII | Signature | svg size / viewBox | `150 × 12`, `0 0 150 12` | `150 × 12`, `0 0 150 12` (L552) | match |
| Letter-Week-XII | Signature | margin-top | `4px` | `marginTop: 4` (L552) | match |
| Letter-Week-XII | Signature | display model | inline replaced element — sits in a line box, so the parent's strut adds ~4px of descender space **below** it | laid out as a block; no strut, so everything below rides ~4px higher | MISMATCH\* — RN has no inline-replaced layout; the block Svg is the substitute |
| Letter-Week-XII | Signature | path `d` | `M2 8 C 34 2, 58 10, 86 6 S 132 4, 148 7` | identical (L553) | match |
| Letter-Week-XII | Signature | stroke / width / fill / caps | `rgba(38,38,31,0.5)` / `1.6` / `none` / `round` | identical (L553) | match |
| Letter-Week-XII | Keep pill | margin | `56px 0 6px` | `marginTop:56; marginBottom:6` (L615) | match |
| Letter-Week-XII | Keep pill | height | `54px` | `height:54; minHeight:54` (overrides `PressScale`'s 44) (L479–480) | match |
| Letter-Week-XII | Keep pill | border-radius | `27px` | `27` (L480) | match |
| Letter-Week-XII | Keep pill | background | `#131313` | `#131313` (L481) | match |
| Letter-Week-XII | Keep pill | flex / align / justify / gap | `flex; center; center; gap:9` | `row; center; center; gap:9` (L482–485) | match |
| Letter-Week-XII | Keep pill | width | block child of the 325 body | stretches to 325 (no left/right) | match |
| Letter-Week-XII | Keep pill | scrolls with the words | in-flow, last child of the scrolling body | last child of `LetterBody` (L615) | match |
| Letter-Week-XII | Keep pill | cursor | `pointer` | `PressScale onPress={onKeep}` (L615) | match |
| Letter-Week-XII | Pill icon | size / viewBox / fill | `16 × 16`, `0 0 24 24`, `fill="none"` | identical (L489) | match |
| Letter-Week-XII | Pill icon | path `d` | `M6 4.4h12a1 1 0 0 1 1 1v14.3a.8.8 0 0 1-1.27.65L12 16.7l-5.73 3.65A.8.8 0 0 1 5 19.7V5.4a1 1 0 0 1 1-1z` | identical (L491) | match |
| Letter-Week-XII | Pill icon | stroke / width / linejoin | `#FFFFFF` / `2` / `round` | identical (L492–494) | match |
| Letter-Week-XII | Pill label | size / weight / tracking / colour | `16.5` / `600` / `0.2px` / `#FFFFFF` | `16.5` / `sans('600')` / `0.2` / `#FFFFFF` (L497) | match |
| Letter-Week-XII | Pill label | text | `Tuck it into your Log` | `Tuck it into your Log` (L615) | match |
| Letter-Week-XII | Continue | position | `absolute; left:0; right:0; bottom:36` (sheet-relative) | `left:0; right:0; bottom:36`, child of the sheet (L125) | match |
| Letter-Week-XII | Continue | text-align | `center` | `alignItems:'center'` (L125) | match |
| Letter-Week-XII | Continue | size / weight / colour | `14.5` / `500` / `#8B8882` | `14.5` / `sans('500')` / `#8B8882` (L126) | match |
| Letter-Week-XII | Continue | cursor | `pointer` | `PressScale onPress={later}` + hitSlop (L121–125) | match |
| Letter-Week-XII | Below the body floor | content | only `Continue`; no pinned pill, no second action | `LetterFooter` is skipped for week12 (L120–130) | match |

### Behaviour note (not a pixel row)

`onKeep` for `variant='week12'` only dismisses — it writes no journal entry
(`letter.tsx` L77–80), which the file documents as deliberate (the week-XII letter
was already written to the Log the night it was sealed). The frame states only the
label, so this is out of the frame's reach; recorded so a later pass does not
"fix" it blind.

---

## Findings

Every MISMATCH, in order.

1. **`src/app/subscription.tsx` L173** — `<Row icon={ICON.code} title="Redeem a code" />` passes no `onPress`, so `PressScale` renders it `disabled`: no press target, no `scale(0.99)` press state. Design: the row carries `cursor:pointer` (frame line 199 region, `Manage-Subscription.html`).
2. **`src/app/subscription.tsx` L174** — `<Row icon={ICON.restore} title="Restore purchases" last />` — same: inert. Design: `cursor:pointer`.
3. **`src/app/subscription.tsx` L179** — `<Row icon={ICON.card} title="Payment method" detail="Apple ID" />` — same: inert. Design: `cursor:pointer`.
4. **`src/app/subscription.tsx` L180** — `<Row icon={ICON.receipts} title="Receipts & invoices" last />` — same: inert. Design: `cursor:pointer`.
5. **`src/app/subscription.tsx` L184–186** — "Cancel subscription" is a bare `AppText` (no `PressScale`, no `onPress`, no `accessibilityRole="button"`, no hit target). Design: `cursor:pointer` on the element at `top:712`, i.e. the frame draws it as the screen's last control.
6. **`src/app/letter.tsx` L648** (MISMATCH\*) — sun-glow ellipse has no blur. Design: `filter: blur(4px)` over `radial-gradient(closest-side, rgba(226,186,120,0.38), rgba(226,186,120,0) 74%)`. RN has no `filter`; substitute in place is the gradient's own 0 → 0.74 falloff.
7. **`src/app/letter.tsx` L666** (MISMATCH\*) — cast-shadow ellipse is filled with the `w12-cast` radial (`#000` 0.1 → 0.05 @ 0.62 → 0 @ 1). Design: flat `rgba(0,0,0,0.10)` plus `filter: blur(4px)`. RN has no `filter`; the 3-stop radial is the named substitute.
8. **`src/app/letter.tsx` L537** (MISMATCH\*) — `LetterP` gets `text-wrap: pretty` only on web (`AppText.tsx` L120–124). Design: `text-wrap:pretty` on all four paragraphs. No native RN equivalent; native falls back to greedy line breaking.
9. **`src/app/letter.tsx` L552** (MISMATCH\*) — the signature `Svg` is a block child, so the ~4px of line-box descender the CSS inline replaced element carries below it is absent, and the 56pt gap above the keep pill is measured from the stroke rather than from the line box — everything below the signature rides ~4px higher than the frame. RN has no inline-replaced layout; the block `Svg` with `marginTop:4` is the substitute.

No numeric, colour, typographic, path, radius, gradient-stop, offset, or z-order
error was found on either frame: all 8 canvas `top` values on Manage-Subscription
map exactly to `canvas − 54`, all 16 SVG `d` strings are verbatim, every hex/rgba
literal is the design's own (no theme token stands in for a literal anywhere in
either file), and the three CSS margin-collapse pairs in the letter body
(16↔36, 40↔0, 0↔26) are resolved to the CSS result rather than summed.
