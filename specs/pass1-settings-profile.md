# Pass 1 — second reader — Settings / Vow / Profile

Bundle **Email Login**. Frames audited (read in full, pretty + raw colon-count cross-checked):

| Frame | Pretty path | App file |
|---|---|---|
| Settings | `.uifinal/pretty/final/Email Login/Settings.html` | `src/app/(app)/settings.tsx` |
| Sheet-Sign-Out | `.uifinal/pretty/final/Email Login/Sheet-Sign-Out.html` | `src/app/(app)/settings.tsx` |
| Your-Vow-Page | `.uifinal/pretty/final/Email Login/Your-Vow-Page.html` | `src/app/vow.tsx` |
| Edit-Profile | `.uifinal/pretty/final/Email Login/Edit-Profile.html` | `src/app/profile.tsx` |
| Sheet-Profile-Photo | `.uifinal/pretty/final/Email Login/Sheet-Profile-Photo.html` | `src/app/profile.tsx` |
| Sheet-Edit-Name | `.uifinal/pretty/final/Email Login/Sheet-Edit-Name.html` | `src/app/profile.tsx` |

Frames are 393 × 852 and every `top` includes a 54px status bar the app never builds, so
**app top = canvas top − 54**. Both numbers are given as `canvas (app N)`.

Verified before starting: `head -618` of Sheet-Profile-Photo and Sheet-Edit-Name are byte-identical
to Edit-Profile apart from `data-screen-label`. Their page bodies are therefore not re-tabled; only
the overlays are audited.

---

## 1. Frame: Settings

### 1.1 Shell

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Settings | Screen | width | 393px | device width | match |
| Settings | Screen | height | 852px | device height | match |
| Settings | Screen | background | `#F4F3F0` | `colors.bg` = `#F4F3F0` (theme.ts:31) — literal verified | match |
| Settings | Screen | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | `sansFamily` ios `System` (theme.ts:161–170) | match |
| Settings | Screen | overflow | hidden | `ScrollView` (settings.tsx:71) | match |
| Settings | Screen | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | match (frame-mount chrome, not screen art) |
| Settings | Grain | background-image | `noise-dark.png` | `require('assets/images/noise-dark.png')` (settings.tsx:28) | match |
| Settings | Grain | opacity | 0.07 | 0.07 (settings.tsx:54) | match |
| Settings | Grain | inset | 0 | absolute 0/0/0/0 (Grain.tsx:16) | match |
| Settings | Grain | pointer-events | none | `pointerEvents="none"` | match |
| Settings | Grain | repeat | CSS default `repeat` at 96×96 | `resizeMode="repeat"` | match |
| Settings | Status bar | height | 54 | not built; SafeAreaView `edges={['top']}` | match (stated convention) |
| Settings | Status bar | z-index | 20 | n/a | match |

### 1.2 Back row

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Settings | Back row | position | absolute | absolute (settings.tsx:64) | match |
| Settings | Back row | left | 16px | 16 | match |
| Settings | Back row | top | 64 (app 10) | 10 | match |
| Settings | Back row | flex-direction | row (default) | `row` | match |
| Settings | Back row | align-items | center | center | match |
| Settings | Back row | gap | 9px | 9 | match |
| Settings | BackGlyph | width × height | 19 tall × 11 wide | 11 × 19 (marks.tsx:216) | match |
| Settings | BackGlyph | viewBox | `0 0 11 19` | `0 0 11 19` | match |
| Settings | BackGlyph | d | `M9.5 1.5L2 9.5l7.5 8` | `M9.5 1.5L2 9.5l7.5 8` (marks.tsx:217) | match |
| Settings | BackGlyph | fill | none | none | match |
| Settings | BackGlyph | stroke | `#55534E` | `#55534E` (settings.tsx:65) | match |
| Settings | BackGlyph | stroke-width | 2.4 | 2.4 | match |
| Settings | BackGlyph | stroke-linecap | round | round | match |
| Settings | BackGlyph | stroke-linejoin | round | round | match |
| Settings | Back label | text | `Back` | `Back` | match |
| Settings | Back label | font-size | 17px | 17 | match |
| Settings | Back label | font-weight | 400 | `sans('400')` | match |
| Settings | Back label | color | `#55534E` | `#55534E` | match |
| Settings | Back label | letter-spacing | undeclared | dropped by AppText (own fontSize, no letterSpacing → AppText.tsx:138) | match |

### 1.3 Title

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Settings | Title | text | `Settings` | `Settings` | match |
| Settings | Title | left | 16px | 16 | match |
| Settings | Title | top | 114 (app 60) | 60 | match |
| Settings | Title | font-size | 27px | 27 | match |
| Settings | Title | font-weight | 600 | `sans('600')` | match |
| Settings | Title | letter-spacing | −0.2px | −0.2 | match |
| Settings | Title | color | `#1D1C1A` | `#1D1C1A` | match |
| Settings | Title | line-height | undeclared (normal) | inherited variant leading deleted (AppText.tsx:139) | match |

### 1.4 Section captions and vertical rhythm

Canvas card heights, computed (rows are `content-box`, so a `border-bottom` adds 1 outside the
declared height; Settings uses standalone 1px divider divs, so no border-box question arises):

- Reminders card `184 → 297` = 4 + 52 + 1 + 52 + 4 = 113
- Anchors card `344 → 498` = 4 + 48 + 1 + 48 + 1 + 48 + 4 = 154
- Privacy card `544 → 653` = 4 + 50 + 1 + 50 + 4 = 109
- Account card `700 → 846` = 4 + 46 + 1 + 46 + 1 + 44 + 4 = 146

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Settings | Caption | font-size | 13px | 13 (settings.tsx:173) | match |
| Settings | Caption | font-weight | 600 | `sans('600')` | match |
| Settings | Caption | color | `#55534E` | `#55534E` | match |
| Settings | Caption | left | 16px | `paddingHorizontal: 16` | match |
| Settings | Caption | caption-top → card-top | 26 | `height: 26` caption box (settings.tsx:172) | match |
| Settings | Caption "Reminders" | top | 158 (app 104) | 104 (header block 104) | match |
| Settings | Caption "Anchors" | top | 318 (app 264) | 264 | match |
| Settings | Caption "Privacy" | top | 518 (app 464) | **465** | **MISMATCH** |
| Settings | Caption "Account" | top | 674 (app 620) | **671** (620 if the extra Privacy row is removed) | **MISMATCH** |
| Settings | Gap Reminders-card → Anchors-caption | margin | 21 (318−297) | `marginBottom` 21 (default, settings.tsx:72) | match |
| Settings | Gap Anchors-card → Privacy-caption | margin | **20** (518−498) | **21** (default gap, settings.tsx:78) | **MISMATCH** |
| Settings | Gap Privacy-card → Account-caption | margin | **21** (674−653) | **20** (`gap={20}`, settings.tsx:87) | **MISMATCH** |
| Settings | Gap after Account card | margin | n/a (last) | `gap={0}` | match |

The 20 and the 21 are transposed. The `gap` prop is the section's `marginBottom`, i.e. the space
*after* its card, but the comment at settings.tsx:86 reads it as the space *before* Privacy.

### 1.5 Cards, rows, dividers

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Settings | Card | left / right | 12 / 12 | `marginHorizontal: 12` | match |
| Settings | Card | border-radius | 16px (all four corners) | 16, `borderCurve: 'continuous'` | match |
| Settings | Card | background | `#FFFFFF` | `#FFFFFF` | match |
| Settings | Card | padding | `4px 0` | `paddingVertical: 4` | match |
| Settings | Card | box-sizing | border-box | n/a in RN | match |
| Settings | Card | border | none | none | match |
| Settings | Card | box-shadow | none | none | match |
| Settings | Row (Reminders) | height | 52px | 52 (settings.tsx:73,75) | match |
| Settings | Row (Anchors) | height | 48px | 48 (settings.tsx:79,81,83) | match |
| Settings | Row (Privacy) | height | 50px | 50 (settings.tsx:88,90) | match |
| Settings | Row (Account) | height | 46px | 46 (settings.tsx:99,101) | match |
| Settings | Row | padding | `0 18px` | `paddingHorizontal: 18` | match |
| Settings | Row | display | flex row | `flexDirection: 'row'` | match |
| Settings | Row | align-items | center | center | match |
| Settings | Row | justify-content | space-between | title `flex: 1` then right group | match (equivalent) |
| Settings | Row title | font-size | 16px | 16 | match |
| Settings | Row title | font-weight | 500 | `sans('500')` | match |
| Settings | Row title | color | `#1D1C1A` | `#1D1C1A` | match |
| Settings | Row right group | display | flex row | row | match |
| Settings | Row right group | align-items | center | center | match |
| Settings | Row right group | gap | 10px | 10 | match |
| Settings | Detail text | font-size | 13px | 13 | match |
| Settings | Detail text | font-weight | undeclared (400) | `sans('400')` | match |
| Settings | Detail text | color | `#8B8882` | `#8B8882` | match |
| Settings | Time pill | height | 32px | 32 | match |
| Settings | Time pill | border-radius | 16px | 16 | match |
| Settings | Time pill | background | `#EDECE7` | `#EDECE7` | match |
| Settings | Time pill | padding | `0 14px` | `paddingHorizontal: 14` | match |
| Settings | Time pill | align-items | center | `justifyContent: 'center'` | match |
| Settings | Time pill text | font-size | 15px | 15 | match |
| Settings | Time pill text | font-weight | 600 | `sans('600')` | match |
| Settings | Time pill text | color | `#1D1C1A` | `#1D1C1A` | match |
| Settings | Time pill text | value | `8:00 AM` / `9:30 PM` | `formatTime(routines)`; defaults `7:00 AM` / `10:00 PM` (routines.ts:29–30) | note (user data, frame shows a sample) |
| Settings | Chevron | width × height | 8 × 14 | 8 × 14 (marks.tsx:234) | match |
| Settings | Chevron | viewBox | `0 0 8 14` | `0 0 8 14` | match |
| Settings | Chevron | d | `M1 1l6 6-6 6` | `M1 1l6 6-6 6` | match |
| Settings | Chevron | fill | none | none | match |
| Settings | Chevron | stroke | `#B0AEA8` | `#B0AEA8` (settings.tsx:201) | match |
| Settings | Chevron | stroke-width | 2 | 2 | match |
| Settings | Chevron | linecap / linejoin | round / round | round / round | match |
| Settings | Divider | height | 1px | 1 | match |
| Settings | Divider | margin | `0 18px` | `marginHorizontal: 18` | match |
| Settings | Divider | background | `rgba(0,0,0,0.06)` | `HAIRLINE = 'rgba(0,0,0,0.06)'` (settings.tsx:30) | match |

### 1.6 Row content and states

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Settings | Reminders rows | labels | `Morning check-in`, `Night check-in` | same | match |
| Settings | Reminders rows | trailing | pill + chevron | pill + chevron | match |
| Settings | Anchors rows | labels | `Your vow`, `Your letter`, `Weekly reports` | same | match |
| Settings | `Your vow` | trailing | chevron only | chevron only | match |
| Settings | `Your letter` | detail | `Opens Week XII` | `Opens Week XII` | match |
| Settings | `Weekly reports` | detail | `Every Sunday` | `Every Sunday` | match |
| Settings | Privacy rows | labels | `App lock`, `Data & privacy` | + a third row `Find support` | deviation (documented D-024) |
| Settings | `App lock` | detail | `Face ID` | hardcoded `Face ID` | match |
| Settings | Account rows | labels | `Edit profile`, `Manage subscription` | same | match |
| Settings | Sign-out link | height | 44px | 44 | match |
| Settings | Sign-out link | justify-content | center | center | match |
| Settings | Sign-out link | font-size | 15.5px | 15.5 | match |
| Settings | Sign-out link | font-weight | 600 | `sans('600')` | match |
| Settings | Sign-out link | color | `#8B8882` | `#8B8882` | match |
| Settings | Sign-out link | background / ring | none / none | none / none | match |
| Settings | Sign-out link | cursor | pointer | `PressScale` button | match |
| Settings | Page | scroll extent | none — content ends at 846 of 852 (app 792 of 798) | `paddingBottom: useTabBarHeight()` = 63 + max(inset,20) = **97pt of dead space**; `StoicTabBar` returns `null` for `/settings` (StoicTabBar.tsx:66,73) | **MISMATCH** |

**Settings rows: 95.**

---

## 2. Frame: Sheet-Sign-Out

### 2.1 Canvas self-contradiction — the page under the sheet

Sheet-Sign-Out draws a *different* Settings page from Settings.html. Both cannot be right:

| Property | Settings.html | Sheet-Sign-Out.html |
|---|---|---|
| Caption tops | 158 / 318 / 518 / 674 | 168 / 330 / 548 (three groups) |
| Card tops | 184 / 344 / 544 / 700 | 194 / 356 / 574 |
| Groups | Reminders, Anchors, **Privacy**, Account | Reminders, Anchors, Account |
| Anchors rows | Your vow, Your letter, Weekly reports @ 48 | Your vow, Your letter, **Medallions** @ 52 |
| Reminders trailing | pill **+ chevron** | pill only, no chevron |
| Account group | Edit profile, Manage subscription, 44-tall bare text link | Name/Sam Reyes @40, Email @40, Manage subscription @44, then a **42-tall pill** r21 `#F4F3F0` ring `0 0 0 1.5px rgba(0,0,0,0.2)`, label 15/600/`#55534E` |
| Account card padding | `4px 0` | `6px 18px 14px` |

**Evidence supports Settings.html for the page.** It is the frame whose `data-screen-label` is the
screen itself; it is the only one that draws the Privacy group, and the bundle ships dedicated
`App-Lock.html` and `Data-Privacy.html` frames that nothing else routes to; and its Account group
matches the app's separate `Edit-Profile` frame (which owns Name/Email/Medallions, so the
Sheet-Sign-Out page duplicates them). Sheet-Sign-Out is load-bearing only for the overlay.
The app made this call correctly; no app change is implied by the contradiction.

### 2.2 Scrim and sheet shell

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Sheet-Sign-Out | Scrim | inset | 0 | absolute 0/0/0/0 (settings.tsx:140) | match |
| Sheet-Sign-Out | Scrim | background | `rgba(19,19,19,0.45)` | `rgba(19,19,19,0.45)` | match |
| Sheet-Sign-Out | Scrim | z-index | 30 | painted after SafeAreaView in the root View | match |
| Sheet-Sign-Out | Scrim | dismiss | implied | `onPress={onCancel}` | match |
| Sheet-Sign-Out | Sheet | left / right / bottom | 0 / 0 / 0 | `justifyContent: 'flex-end'` full-bleed | match |
| Sheet-Sign-Out | Sheet | border-radius | `24px 24px 0 0` | `borderTopLeftRadius: 24, borderTopRightRadius: 24` (settings.tsx:143) | match |
| Sheet-Sign-Out | Sheet | background | `#F4F3F0` | `#F4F3F0` | match |
| Sheet-Sign-Out | Sheet | box-shadow | `0 -12px 40px rgba(19,19,19,0.3)` | same string | match |
| Sheet-Sign-Out | Sheet | z-index | 31 | above the scrim | match |
| Sheet-Sign-Out | Sheet | padding-top | 10px | 10 (settings.tsx:144) | match |
| Sheet-Sign-Out | Sheet | padding-left/right | 20px | 20 | match |
| Sheet-Sign-Out | Sheet | padding-bottom | 30px | 30 + `SafeAreaView edges={['bottom']}` inset (~34) | note (home-indicator allowance; consistent with profile.tsx) |
| Sheet-Sign-Out | Grabber | width | 36px | 36 | match |
| Sheet-Sign-Out | Grabber | height | 5px | 5 | match |
| Sheet-Sign-Out | Grabber | border-radius | 3px | 3 | match |
| Sheet-Sign-Out | Grabber | background | `rgba(19,19,19,0.15)` | `rgba(19,19,19,0.15)` | match |
| Sheet-Sign-Out | Grabber | margin | `0 auto` | `alignSelf: 'center'` | match |

### 2.3 Sheet contents

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Sheet-Sign-Out | Title | margin-top | **16px** | **18** (settings.tsx:146) | **MISMATCH** |
| Sheet-Sign-Out | Title | text-align | center | `center` | match |
| Sheet-Sign-Out | Title | font-size | 17px | 17 | match |
| Sheet-Sign-Out | Title | font-weight | 600 | `sans('600')` | match |
| Sheet-Sign-Out | Title | color | `#1D1C1A` | `#1D1C1A` | match |
| Sheet-Sign-Out | Title | text | `Sign out?` | `Sign out?` | match |
| Sheet-Sign-Out | Body | margin-top | **10px** | **8** (settings.tsx:147) | **MISMATCH** |
| Sheet-Sign-Out | Body | padding | **`0 12px`** | **none** | **MISMATCH** |
| Sheet-Sign-Out | Body | text-align | center | `center` | match |
| Sheet-Sign-Out | Body | font-size | 14.5px | 14.5 | match |
| Sheet-Sign-Out | Body | line-height | 21px | 21 | match |
| Sheet-Sign-Out | Body | font-weight | undeclared (400) | `sans('400')` | match |
| Sheet-Sign-Out | Body | color | `#55534E` | `#55534E` | match |
| Sheet-Sign-Out | Body | text | `Your log, letters and medallions stay saved to sam@example.com.` | `You are signed in as ${email}. Your progress stays on the account — signing back in brings it all back.` | **MISMATCH** |
| Sheet-Sign-Out | CTA pill | margin-top | **18px** | **20** (settings.tsx:153) | **MISMATCH** |
| Sheet-Sign-Out | CTA pill | height | 54px | 54 | match |
| Sheet-Sign-Out | CTA pill | border-radius | 27px | 27 | match |
| Sheet-Sign-Out | CTA pill | background | `#131313` | `#131313` | match |
| Sheet-Sign-Out | CTA pill | align/justify | center / center | center / center | match |
| Sheet-Sign-Out | CTA label | font-size | 17px | 17 | match |
| Sheet-Sign-Out | CTA label | font-weight | 600 | `sans('600')` | match |
| Sheet-Sign-Out | CTA label | color | `#FFFFFF` | `#FFFFFF` | match |
| Sheet-Sign-Out | CTA label | text | `Sign out` | `Sign out` | match |
| Sheet-Sign-Out | Cancel line | margin-top | 14px | 14 (settings.tsx:156) | match |
| Sheet-Sign-Out | Cancel line | text-align | center | `alignItems: 'center'` | match |
| Sheet-Sign-Out | Cancel line | font-size | 15px | 15 | match |
| Sheet-Sign-Out | Cancel line | font-weight | 500 | `sans('500')` | match |
| Sheet-Sign-Out | Cancel line | color | `#8B8882` | `#8B8882` | match |
| Sheet-Sign-Out | Cancel line | text | `Stay signed in` | `Stay signed in` | match |
| Sheet-Sign-Out | Cancel line | action | implied dismiss | `onCancel` | match |

**Sheet-Sign-Out rows: 44** (plus the 7-row contradiction table).

---

## 3. Frame: Your-Vow-Page

### 3.1 Shell and header

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Your-Vow-Page | Screen | background | `#F4F3F0` | literal `#F4F3F0` (vow.tsx:43) | match |
| Your-Vow-Page | Grain | image / opacity | `noise-dark.png` / 0.07 | same / 0.07 (vow.tsx:45) | match |
| Your-Vow-Page | Back row | left | 16px | 16 (vow.tsx:54) | match |
| Your-Vow-Page | Back row | top | 64 (app 10) | 10 | match |
| Your-Vow-Page | Back row | gap | 9px | 9 | match |
| Your-Vow-Page | Back row | align-items | center | center | match |
| Your-Vow-Page | BackGlyph | viewBox / d | `0 0 11 19` / `M9.5 1.5L2 9.5l7.5 8` | identical | match |
| Your-Vow-Page | BackGlyph | stroke / width | `#55534E` / 2.4 | `#55534E` / 2.4 | match |
| Your-Vow-Page | Back label | text | **`Settings`** (not "Back") | `Settings` (vow.tsx:56) | match |
| Your-Vow-Page | Back label | font-size / weight / color | 17 / 400 / `#55534E` | 17 / `sans('400')` / `#55534E` | match |
| Your-Vow-Page | Title | text | `Your vow` | `Your vow` | match |
| Your-Vow-Page | Title | left / right | 16 / 16 | 16 / 16 (vow.tsx:60) | match |
| Your-Vow-Page | Title | top | 114 (app 60) | 60 | match |
| Your-Vow-Page | Title | font-size / weight | 27 / 600 | 27 / `sans('600')` | match |
| Your-Vow-Page | Title | letter-spacing | −0.2px | −0.2 | match |
| Your-Vow-Page | Title | color | `#1D1C1A` | `#1D1C1A` | match |
| Your-Vow-Page | Title | white-space | **nowrap** | not set (wraps) | **MISMATCH** (`numberOfLines={1}`) |

### 3.2 Halo and sun

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Your-Vow-Page | Halo | top | 168 (app 114) | container `top: 114` (vow.tsx:65) | match |
| Your-Vow-Page | Halo | horizontal | `left:50%; margin-left:-85px` → centred | `left:0,right:0, alignItems:'center'` | match |
| Your-Vow-Page | Halo | width × height | 170 × 170 | `Svg width={170} height={170}` | match |
| Your-Vow-Page | Halo | border-radius | 50% | circle r 85 | match |
| Your-Vow-Page | Halo | gradient type | `radial-gradient(closest-side, …)` on a square box → r = 85 | `RadialGradient cx 85 cy 85 rx/ry 85 userSpaceOnUse` (vow.tsx:68) | match |
| Your-Vow-Page | Halo | stop 0 | `rgba(226,186,120,0.38)` at 0 | `#E2BA78` @ 0.38 opacity, offset 0 | match |
| Your-Vow-Page | Halo | stop 1 | `rgba(226,186,120,0)` at 72% | `#E2BA78` opacity 0, offset 0.72 | match |
| Your-Vow-Page | Halo | filter | **`blur(3px)`** | not applied | **MISMATCH\*** — RN has no CSS filter; nothing substituted (a wider, softer final stop or a Skia blur would be the substitute) |
| Your-Vow-Page | Halo | pointer-events | n/a | `pointerEvents="none"` | match |
| Your-Vow-Page | Sun | top | 196 (app 142) | container 114 + (cy 51 − r 23) = 142 | match |
| Your-Vow-Page | Sun | width × height | 46 × 46 | `Circle r={23}` | match |
| Your-Vow-Page | Sun | horizontal | `left:50%; margin-left:-23px` → centred | `cx={85}` in a centred 170 box | match |
| Your-Vow-Page | Sun | border-radius | 50% | circle | match |
| Your-Vow-Page | Sun | gradient centre | `circle at 50% 38%` | `cx 85, cy 82.48` (= 51 − 23 + 0.38·46) | match |
| Your-Vow-Page | Sun | gradient extent | default `farthest-corner` = √(23² + 28.52²) = 36.66 | `rx/ry 36.66` (vow.tsx:75, arithmetic verified) | match |
| Your-Vow-Page | Sun | stop 0 | `#F8E9CB` | `#F8E9CB` @ 0 | match |
| Your-Vow-Page | Sun | stop 1 | `#EFD3A2` at 70% | `#EFD3A2` @ 0.7 | match |
| Your-Vow-Page | Sun | stop 2 | `#E3BE85` at 100% | `#E3BE85` @ 1 | match |
| Your-Vow-Page | Sun | box-shadow | **`0 6px 18px rgba(226,186,120,0.45)`** | **absent** | **MISMATCH** |

### 3.3 The vow line

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Your-Vow-Page | Vow text | left / right | 36? no — 40 / 40 | 40 / 40 (vow.tsx:89) | match |
| Your-Vow-Page | Vow text | top | 296 (app 242) | 242 | match |
| Your-Vow-Page | Vow text | text-align | center | `center` | match |
| Your-Vow-Page | Vow text | font-family | `Georgia,'Times New Roman',serif` | `fonts.quote` = ios `Georgia` (theme.ts:220) | match |
| Your-Vow-Page | Vow text | font-size | 20px | 20 | match |
| Your-Vow-Page | Vow text | line-height | 32px | 32 | match |
| Your-Vow-Page | Vow text | font-weight | undeclared (400) | `sans('400')` base, family overridden | match |
| Your-Vow-Page | Vow text | letter-spacing | undeclared | dropped by AppText | match |
| Your-Vow-Page | Vow text | color | `#1D1C1A` | `#1D1C1A` | match |
| Your-Vow-Page | Vow text | text-wrap | **balance** | AppText sets `textWrap` only on web and only for hero/display/title; this is `body` → `pretty` | **MISMATCH\*** — no native equivalent; nearest substitute is a hand-set break or `pretty` |
| Your-Vow-Page | Vow text | copy | `I’m done letting the wave decide. One evening at a time, I take the watch back.` | identical `PLACEHOLDER` (vow.tsx:24), overridden by the signed entry | match |

### 3.4 Signature card

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Your-Vow-Page | Card | left / right | 36 / 36 | 36 / 36 (vow.tsx:97–98) | match |
| Your-Vow-Page | Card | top | 452 (app 398) | 398 | match |
| Your-Vow-Page | Card | height | 170px | 170 | match |
| Your-Vow-Page | Card | border-radius | 18px | 18 | match |
| Your-Vow-Page | Card | background | `#FFFFFF` | `#FFFFFF` | match |
| Your-Vow-Page | Card | box-shadow | `0 0 0 1.5px rgba(0,0,0,0.08), 0 14px 34px rgba(40,38,32,0.10)` | identical string (vow.tsx:104) | match |
| Your-Vow-Page | SIGNATURE cap | left / top | 16 / 13 (card-local) | 16 / 13 | match |
| Your-Vow-Page | SIGNATURE cap | font-size | 10.5px | 10.5 | match |
| Your-Vow-Page | SIGNATURE cap | font-weight | 600 | `sans('600')` | match |
| Your-Vow-Page | SIGNATURE cap | letter-spacing | 1.6px | 1.6 | match |
| Your-Vow-Page | SIGNATURE cap | color | `#C6C3BC` | `#C6C3BC` | match |
| Your-Vow-Page | SIGNATURE cap | text-transform | literal caps in markup | literal `SIGNATURE` | match |
| Your-Vow-Page | Signature mark | element | `<svg width=216 height=64 viewBox="0 0 216 64">` at `left:50; bottom:40` | `<AppText fontFamily={fonts.script} fontSize 34 lineHeight 34>` rendering the user's first name | **MISMATCH** |
| Your-Vow-Page | Signature mark | path d | `M6 46 C 20 8, 44 6, 40 30 C 36 52, 12 56, 34 44 C 58 30, 78 22, 96 36 C 108 46, 122 30, 138 34` | not drawn | **MISMATCH** |
| Your-Vow-Page | Signature mark | stroke / width | `#26261F` / 2.2 | text colour `#1D1C1A` | **MISMATCH** |
| Your-Vow-Page | Signature mark | fill | none | n/a | **MISMATCH** |
| Your-Vow-Page | Signature mark | linecap / linejoin | round / round | n/a | **MISMATCH** |
| Your-Vow-Page | Signature terminal | circle | `cx 138 cy 34 r 2.6 fill #26261F` | not drawn | **MISMATCH** |
| Your-Vow-Page | `×` mark | left / bottom | 24 / 42 | 24 / 42 (vow.tsx:112) | match |
| Your-Vow-Page | `×` mark | font-size | 14px | 14 | match |
| Your-Vow-Page | `×` mark | color | `#B0AEA8` | `#B0AEA8` | match |
| Your-Vow-Page | `×` mark | glyph | `&times;` | `×` | match |
| Your-Vow-Page | Rule | left / right | 22 / 22 | 22 / 22 (vow.tsx:113) | match |
| Your-Vow-Page | Rule | bottom | 38 | 38 | match |
| Your-Vow-Page | Rule | height | 1.5px | 1.5 | match |
| Your-Vow-Page | Rule | background | `rgba(0,0,0,0.26)` | `rgba(0,0,0,0.26)` | match |
| Your-Vow-Page | Name label | left / bottom | 24 / 15 | 24 / 15 (vow.tsx:114) | match |
| Your-Vow-Page | Name label | font-size | 11.5px | 11.5 | match |
| Your-Vow-Page | Name label | font-weight | 500 | `sans('500')` | match |
| Your-Vow-Page | Name label | color | `#B0AEA8` | `#B0AEA8` | match |
| Your-Vow-Page | Name label | text | `Sam` (first name) | `user.displayName.split(' ')[0]` | match |
| Your-Vow-Page | Date stamp | right / bottom | 22 / 15 | 22 / 15 (vow.tsx:115) | match |
| Your-Vow-Page | Date stamp | font-size | 11.5px | 11.5 | match |
| Your-Vow-Page | Date stamp | font-weight | 500 | `sans('500')` | match |
| Your-Vow-Page | Date stamp | color | `#B0AEA8` | `#B0AEA8` | match |
| Your-Vow-Page | Date stamp | format | `14 Mar 2026 · Day 0` (en-GB `d MMM yyyy`) | `toLocaleDateString(undefined, …)` (vow.tsx:39) → `Mar 14, 2026` under en-US | **MISMATCH** |
| Your-Vow-Page | Date stamp | separator | ` · ` (`&middot;`) | ` · ` | match |

### 3.5 Footer

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Your-Vow-Page | Held line | left / right | 0 / 0 | 0 / 0 (vow.tsx:119) | match |
| Your-Vow-Page | Held line | top | 648 (app 594) | 594 | match |
| Your-Vow-Page | Held line | text-align | center | `center` | match |
| Your-Vow-Page | Held line | font-size | 13px | 13 | match |
| Your-Vow-Page | Held line | font-weight | 500 | `sans('500')` | match |
| Your-Vow-Page | Held line | color | `#8B8882` | `#8B8882` | match |
| Your-Vow-Page | Held line | copy | `Held for 92 days.` | `Held for ${held} day(s).` | match (92 is sample data) |
| Your-Vow-Page | Footnote | left / right | 36 / 36 | 36 / 36 (vow.tsx:122) | match |
| Your-Vow-Page | Footnote | top | 692 (app 638) | 638 | match |
| Your-Vow-Page | Footnote | text-align | center | `center` | match |
| Your-Vow-Page | Footnote | font-size | 13px | 13 | match |
| Your-Vow-Page | Footnote | font-weight | 400 | `sans('400')` | match |
| Your-Vow-Page | Footnote | line-height | 19px | 19 | match |
| Your-Vow-Page | Footnote | color | `#8B8882` | `#8B8882` | match |
| Your-Vow-Page | Footnote | copy | `After a relapse you can re-sign the vow. It resets the promise, never the progress.` | identical | match |

**Your-Vow-Page rows: 79.**

---

## 4. Frame: Edit-Profile

### 4.1 Shell and header

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Edit-Profile | Screen | background | `#F4F3F0` | `colors.bg` = `#F4F3F0` | match |
| Edit-Profile | Grain | image / opacity | `noise-dark.png` / 0.07 | same / 0.07 (profile.tsx:91) | match |
| Edit-Profile | Back row | left / top | 16 / 64 (app 10) | 16 / 10 (profile.tsx:102) | match |
| Edit-Profile | Back row | gap | 9px | 9 | match |
| Edit-Profile | BackGlyph | viewBox / d / stroke / width | `0 0 11 19` / `M9.5 1.5L2 9.5l7.5 8` / `#55534E` / 2.4 | identical | match |
| Edit-Profile | Back label | text / size / weight / colour | `Back` / 17 / 400 / `#55534E` | identical | match |
| Edit-Profile | Title | text | `Edit profile` | `Edit profile` | match |
| Edit-Profile | Title | left / top | 16 / 114 (app 60) | 16 / 60 | match |
| Edit-Profile | Title | font-size / weight | 27 / 600 | 27 / `sans('600')` | match |
| Edit-Profile | Title | letter-spacing | −0.2px | −0.2 | match |
| Edit-Profile | Title | color | `#1D1C1A` | `#1D1C1A` | match |
| Edit-Profile | Header block | height | title 114 → monogram 166 | fixed `height: 112` (profile.tsx:96) puts the monogram at 112 = 166 − 54 | match |

### 4.2 Monogram block

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Edit-Profile | Monogram block | top | 166 (app 112) | 112 | match |
| Edit-Profile | Monogram block | left / right | 0 / 0 | full width | match |
| Edit-Profile | Monogram block | flex-direction | column | column (default) | match |
| Edit-Profile | Monogram block | align-items | center | `alignItems: 'center'` (profile.tsx:113) | match |
| Edit-Profile | Avatar | width × height | 88 × 88 | 88 × 88 | match |
| Edit-Profile | Avatar | border-radius | 50% | 44 | match |
| Edit-Profile | Avatar | background | `#EDECE7` | `#EDECE7` | match |
| Edit-Profile | Avatar | align / justify | center / center | center / center | match |
| Edit-Profile | Initial | font-size | 28px | 28 | match |
| Edit-Profile | Initial | font-weight | 600 | `sans('600')` | match |
| Edit-Profile | Initial | color | `#55534E` | `#55534E` | match |
| Edit-Profile | Initial | content | single letter `S` | `((name \|\| email \|\| 'You').trim()[0]).toUpperCase()` | match |
| Edit-Profile | Pencil badge | bottom / right | −2 / −2 | −2 / −2 (profile.tsx:118) | match |
| Edit-Profile | Pencil badge | width × height | 30 × 30 | 30 × 30 | match |
| Edit-Profile | Pencil badge | border-radius | 50% | 15 | match |
| Edit-Profile | Pencil badge | background | `#131313` | `#131313` | match |
| Edit-Profile | Pencil icon | width × height | 14 × 14 | 14 × 14 | match |
| Edit-Profile | Pencil icon | viewBox | `0 0 24 24` | `0 0 24 24` | match |
| Edit-Profile | Pencil icon | d | `M4 20l4-1L19 8a2 2 0 00-3-3L5 16l-1 4z` | identical (profile.tsx:120) | match |
| Edit-Profile | Pencil icon | stroke | `#F4F3F0` | `#F4F3F0` | match |
| Edit-Profile | Pencil icon | stroke-width | 2 | 2 | match |
| Edit-Profile | Pencil icon | fill | none | none | match |
| Edit-Profile | Pencil icon | stroke-linejoin | round | round | match |
| Edit-Profile | Pencil icon | stroke-linecap | undeclared (butt) | not set (butt) | match |
| Edit-Profile | Change photo | margin-top | 12px | 12 (profile.tsx:128) | match |
| Edit-Profile | Change photo | font-size | 14.5px | 14.5 | match |
| Edit-Profile | Change photo | font-weight | 600 | `sans('600')` | match |
| Edit-Profile | Change photo | color | `#1D1C1A` | `#1D1C1A` | match |
| Edit-Profile | Change photo | text | `Change photo` | `Change photo` | match |

### 4.3 Identity card

Canvas height check: rows are `content-box`, so the two rows carrying `border-bottom:1px` occupy 47.
Card = 4 + 47 + 47 + 46 + 4 = 148 → `318 → 466`. Next caption at 486 ⇒ gap 20.

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Edit-Profile | Identity card | top | 318 (app 264) | 112 + 152 = 264 (profile.tsx:113,133) | match |
| Edit-Profile | Identity card | left / right | 12 / 12 | `marginHorizontal: 12` | match |
| Edit-Profile | Identity card | border-radius | 16px | 16 | match |
| Edit-Profile | Identity card | background | `#FFFFFF` | `#FFFFFF` | match |
| Edit-Profile | Identity card | padding | `4px 18px` | `paddingVertical: 4, paddingHorizontal: 18` | match |
| Edit-Profile | Identity card | computed height | 148 | 4 + 46 + 1 + 46 + 1 + 46 + 4 = 148 | match |
| Edit-Profile | Identity card | margin-bottom | 20 (466 → 486) | `marginBottom: 20` (profile.tsx:133) | match |
| Edit-Profile | Field row | height | 46px | 46 | match |
| Edit-Profile | Field row | display / align | flex row / center | row / center | match |
| Edit-Profile | Field row | gap | 12px | 12 | match |
| Edit-Profile | Field row | justify-content | undeclared (flex-start) | `flex-start` when `record` is false | match |
| Edit-Profile | Field row separator | border-bottom | `1px solid rgba(0,0,0,0.06)` | standalone `height: 1` View, `HAIRLINE` | match (equivalent, same 1px, same colour) |
| Edit-Profile | Field label | width | 86px | 86 (profile.tsx:310) | match |
| Edit-Profile | Field label | flex-shrink | 0 | fixed width, no shrink | match |
| Edit-Profile | Field label | font-size | 13.5px | 13.5 | match |
| Edit-Profile | Field label | font-weight | undeclared (400) | `sans('400')` | match |
| Edit-Profile | Field label | color | `#8B8882` | `#8B8882` | match |
| Edit-Profile | Field value | font-size | 14.5px | 14.5 | match |
| Edit-Profile | Field value | font-weight | 500 | `sans('500')` | match |
| Edit-Profile | Field value | color | `#1D1C1A` | `#1D1C1A` | match |
| Edit-Profile | Row 1 | label / value | `Name` / `Sam Reyes` | `Name` / `user.displayName` | match |
| Edit-Profile | Row 2 | label / value | `Username` / `@sam` | `Username` / `@${email.split('@')[0]}` | match |
| Edit-Profile | Row 3 | label / value | `Email` / `sam@example.com` | `Email` / `email` | match |
| Edit-Profile | Row 1 | interactivity | none drawn | tappable → opens Sheet-Edit-Name | match (that sheet must be reachable) |

### 4.4 Medallions group

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Edit-Profile | Caption | text | `Medallions` | `Medallions` | match |
| Edit-Profile | Caption | left / top | 16 / 486 (app 432) | 16 / 432 (412 + 20) | match |
| Edit-Profile | Caption | font-size / weight / colour | 13 / 600 / `#55534E` | 13 / `sans('600')` / `#55534E` | match |
| Edit-Profile | Caption → card | gap | 26 (486 → 512) | caption box `height: 26` (profile.tsx:291) | match |
| Edit-Profile | Card | top | 512 (app 458) | 432 + 26 = 458 | match |
| Edit-Profile | Card | left / right | 12 / 12 | `marginHorizontal: 12` | match |
| Edit-Profile | Card | border-radius | 16px | 16 | match |
| Edit-Profile | Card | background | `#FFFFFF` | `#FFFFFF` | match |
| Edit-Profile | Card | padding | `16px 18px` | `paddingVertical: 16, paddingHorizontal: 18` | match |
| Edit-Profile | Shelf | display / align | flex row / center | row / center | match |
| Edit-Profile | Shelf | gap | 10px | 10 | match |
| Edit-Profile | Coin | width × height | 48 × 48 | 48 × 48 | match |
| Edit-Profile | Coin | border-radius | 50% | 24 | match |
| Edit-Profile | Coin | overflow | hidden | `overflow: 'hidden'` | match |
| Edit-Profile | Coin | box-shadow | `0 0 0 1.5px rgba(0,0,0,0.2), 0 0 0 4px #FFFFFF, 0 0 0 5.4px rgba(0,0,0,0.16)` | identical string (profile.tsx:157) | match |
| Edit-Profile | Coin | flex-shrink | 0 | fixed 48 | match |
| Edit-Profile | Coin count | drawn | 4 coins | `earnedShelf.slice(0, 4)` | match |
| Edit-Profile | Coin art | scenes | 4 hand-drawn scenes (`#EFEEE8→#EFEDE6` field, `rgba(243,227,196,·)` sun, `#DEDDD6`/`#CFCEC7`/`#C0BFB8` waves, one `#D8E3ED` wave, one with the `cg8` bell path) | `KKMedallion scene size={48}` | out of scope here — coin art parity belongs to `specs/medallions.md`; frame/size/gap verified above |
| Edit-Profile | Overflow chip | width × height | 48 × 48 | 48 × 48 | match |
| Edit-Profile | Overflow chip | border-radius | 50% | 24 | match |
| Edit-Profile | Overflow chip | background | `#EDECE7` | `#EDECE7` | match |
| Edit-Profile | Overflow chip | align / justify | center / center | center / center | match |
| Edit-Profile | Overflow chip text | font-size | 12.5px | 12.5 | match |
| Edit-Profile | Overflow chip text | font-weight | 600 | `sans('600')` | match |
| Edit-Profile | Overflow chip text | color | `#55534E` | `#55534E` | match |
| Edit-Profile | Overflow chip text | content | `+3` | `+{shelfMore}` | match |
| Edit-Profile | Spacer | flex | 1 | `<View style={{ flex: 1 }} />` | match |
| Edit-Profile | Chevron | size / viewBox / d / stroke / width | 8×14 / `0 0 8 14` / `M1 1l6 6-6 6` / `#B0AEA8` / 2 | identical | match |
| Edit-Profile | Card | computed height | 16 + 48 + 16 = 80 (512 → 592) | same | match |
| Edit-Profile | Section | margin-bottom | 28 (592 → 620) | `gap={28}` (profile.tsx:149) | match |

### 4.5 Journey group

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Edit-Profile | Caption | text | `Journey` | `Journey` | match |
| Edit-Profile | Caption | left / top | 16 / 620 (app 566) | 16 / 566 | match |
| Edit-Profile | Caption | font-size / weight / colour | 13 / 600 / `#55534E` | identical | match |
| Edit-Profile | Card | top | 646 (app 592) | 566 + 26 = 592 | match |
| Edit-Profile | Card | left / right | 12 / 12 | `marginHorizontal: 12` | match |
| Edit-Profile | Card | border-radius | 16px | 16 | match |
| Edit-Profile | Card | background | `#FFFFFF` | `#FFFFFF` | match |
| Edit-Profile | Card | padding | `4px 18px` | `paddingVertical: 4, paddingHorizontal: 18` (profile.tsx:171) | match |
| Edit-Profile | Record row | height | 46px | 46 | match |
| Edit-Profile | Record row | justify-content | space-between | `space-between` when `record` | match |
| Edit-Profile | Record row | border-bottom | `1px solid rgba(0,0,0,0.06)` | standalone 1px `HAIRLINE` View | match |
| Edit-Profile | Record label | font-size | 15px | 15 | match |
| Edit-Profile | Record label | font-weight | undeclared (400) | `sans('400')` | match |
| Edit-Profile | Record label | color | `#55534E` | `#55534E` | match |
| Edit-Profile | Record value | font-size | 15px | 15 | match |
| Edit-Profile | Record value | font-weight | 600 | `sans('600')` | match |
| Edit-Profile | Record value | color | `#1D1C1A` | `#1D1C1A` | match |
| Edit-Profile | Row 1 | label / value | `Started VICI` / `14 Mar 2026` | `Started VICI` / `toLocaleDateString('en-GB', …)` | match |
| Edit-Profile | Row 2 | label / value | `Current week` / `VI · Discipline` | `Current week` / `${week.roman} · ${week.name}` | match |
| Edit-Profile | Row 3 | height | 46px | 46 (ActionLine) | match |
| Edit-Profile | Row 3 | label | `Weekly reports` | `Weekly reports` | match |
| Edit-Profile | Row 3 | font-size / weight / colour | 16 / 500 / `#1D1C1A` | 16 / `sans('500')` / `#1D1C1A` | match |
| Edit-Profile | Row 3 | trailing | chevron `#B0AEA8` | `ChevronGlyph color="#B0AEA8"` | match |
| Edit-Profile | Row 3 | border-bottom | none | none | match |
| Edit-Profile | Card | computed height | 4 + 47 + 47 + 46 + 4 = 148 (646 → 794) | same → app 592 → 740 | match |
| Edit-Profile | Page | content end | 794 of 852 (app 740 of 798); no scroll | ScrollView; an extra `App` section (`My values`, `Settings`) pushes content to ~893 + 40 padding | deviation (documented D-026) |

**Edit-Profile rows: 103.**

---

## 5. Frame: Sheet-Profile-Photo (overlay only)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Sheet-Profile-Photo | Page under sheet | all | byte-identical to Edit-Profile | see §4 | match |
| Sheet-Profile-Photo | Scrim | inset / background | 0 / `rgba(19,19,19,0.45)` | absolute fill / `rgba(19,19,19,0.45)` (profile.tsx:248) | match |
| Sheet-Profile-Photo | Scrim | z-index | 30 | Modal, scrim first child | match |
| Sheet-Profile-Photo | Sheet | left / right / bottom | 0 / 0 / 0 | `justifyContent: 'flex-end'` | match |
| Sheet-Profile-Photo | Sheet | border-radius | `24px 24px 0 0` | `borderTopLeftRadius/RightRadius: 24` (profile.tsx:251) | match |
| Sheet-Profile-Photo | Sheet | background | `#F4F3F0` | `#F4F3F0` | match |
| Sheet-Profile-Photo | Sheet | box-shadow | **`0 -12px 40px rgba(19,19,19,0.3)`** | **absent** | **MISMATCH** |
| Sheet-Profile-Photo | Sheet | z-index | 31 | above scrim | match |
| Sheet-Profile-Photo | Sheet | padding | `10px 20px 30px` | 10 / 20 / 30 (+ bottom safe-area inset) | match (note as §2.2) |
| Sheet-Profile-Photo | Grabber | 36 × 5, r 3, `rgba(19,19,19,0.15)`, centred | as stated | identical (profile.tsx:253) | match |
| Sheet-Profile-Photo | Title | margin-top | 16px | 16 (profile.tsx:254) | match |
| Sheet-Profile-Photo | Title | text-align | center | `center` | match |
| Sheet-Profile-Photo | Title | font-size / weight / colour | 17 / 600 / `#1D1C1A` | identical | match |
| Sheet-Profile-Photo | Title | text | `Profile photo` | `Profile photo` | match |
| Sheet-Profile-Photo | Options card | margin-top | 16px | 16 (profile.tsx:191) | match |
| Sheet-Profile-Photo | Options card | border-radius | 16px | 16 | match |
| Sheet-Profile-Photo | Options card | background | `#FFFFFF` | `#FFFFFF` | match |
| Sheet-Profile-Photo | Options card | padding | `4px 0` | `paddingVertical: 4` | match |
| Sheet-Profile-Photo | Option row | height | 52px | 52 (profile.tsx:268) | match |
| Sheet-Profile-Photo | Option row | align / justify | center / center | center / center | match |
| Sheet-Profile-Photo | Option row | font-size | 16px | 16 | match |
| Sheet-Profile-Photo | Option row | font-weight | 500 | `sans('500')` | match |
| Sheet-Profile-Photo | Option 1 | text / colour | `Take photo` / `#1D1C1A` | identical | match |
| Sheet-Profile-Photo | Option 2 | text / colour | `Choose from library` / `#1D1C1A` | identical | match |
| Sheet-Profile-Photo | Option 3 | text / colour | `Remove photo` / **`#A4613C`** | `Remove photo` / `#A4613C` (profile.tsx:196) — not `colors.danger` | match |
| Sheet-Profile-Photo | Divider | height / margin / colour | 1 / `0 18px` / `rgba(0,0,0,0.06)` | 1 / `marginHorizontal: 18` / `HAIRLINE` | match |
| Sheet-Profile-Photo | Cancel | margin-top | 12px | 12 (profile.tsx:201) | match |
| Sheet-Profile-Photo | Cancel | height | 50px | 50 | match |
| Sheet-Profile-Photo | Cancel | border-radius | 25px | 25 | match |
| Sheet-Profile-Photo | Cancel | background | `#F4F3F0` | `#F4F3F0` | match |
| Sheet-Profile-Photo | Cancel | box-shadow (ring) | `0 0 0 1.5px rgba(0,0,0,0.2)` | identical string | match |
| Sheet-Profile-Photo | Cancel | align / justify | center / center | center / center | match |
| Sheet-Profile-Photo | Cancel label | font-size | 16px | 16 | match |
| Sheet-Profile-Photo | Cancel label | font-weight | 600 | `sans('600')` | match |
| Sheet-Profile-Photo | Cancel label | color | `#55534E` | `#55534E` | match |
| Sheet-Profile-Photo | Cancel label | text | `Cancel` | `Cancel` | match |

**Sheet-Profile-Photo rows: 36.**

---

## 6. Frame: Sheet-Edit-Name (overlay only)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Sheet-Edit-Name | Page under sheet | all | byte-identical to Edit-Profile | see §4 | match |
| Sheet-Edit-Name | Scrim | inset / background / z | 0 / `rgba(19,19,19,0.45)` / 30 | identical | match |
| Sheet-Edit-Name | Sheet | radius / background / padding | `24 24 0 0` / `#F4F3F0` / `10px 20px 30px` | identical | match |
| Sheet-Edit-Name | Sheet | box-shadow | **`0 -12px 40px rgba(19,19,19,0.3)`** | **absent** (same shell as §5) | **MISMATCH** (same defect as §5) |
| Sheet-Edit-Name | Grabber | 36 × 5, r 3, `rgba(19,19,19,0.15)`, centred | as stated | identical | match |
| Sheet-Edit-Name | Title | margin-top | 16px | 16 | match |
| Sheet-Edit-Name | Title | font-size / weight / colour / align | 17 / 600 / `#1D1C1A` / center | identical | match |
| Sheet-Edit-Name | Title | text | `Name` | `Name` | match |
| Sheet-Edit-Name | Input box | margin-top | 16px | 16 (profile.tsx:209) | match |
| Sheet-Edit-Name | Input box | height | 54px | 54 | match |
| Sheet-Edit-Name | Input box | border-radius | 16px | 16 | match |
| Sheet-Edit-Name | Input box | background | `#FFFFFF` | `#FFFFFF` | match |
| Sheet-Edit-Name | Input box | box-shadow (ring) | `0 0 0 1.5px rgba(0,0,0,0.14)` | identical string (profile.tsx:214) | match |
| Sheet-Edit-Name | Input box | padding | `0 18px` | `paddingHorizontal: 18` | match |
| Sheet-Edit-Name | Input box | align-items | center | `justifyContent: 'center'` | match |
| Sheet-Edit-Name | Input text | font-size | 16.5px | 16.5 | match |
| Sheet-Edit-Name | Input text | font-weight | 500 | `sans('500')` | match |
| Sheet-Edit-Name | Input text | color | `#1D1C1A` | `#1D1C1A` | match |
| Sheet-Edit-Name | Input text | value | `Sam Reyes` | bound `name` | match |
| Sheet-Edit-Name | Caret | width | 2px | native caret (`selectionColor` unset) | **MISMATCH\*** — RN cannot size a caret; the closable part is the colour |
| Sheet-Edit-Name | Caret | height | 22px | native | MISMATCH\* (same) |
| Sheet-Edit-Name | Caret | background | `#131313` | system default (iOS blue) | **MISMATCH** — `selectionColor="#131313"` / `cursorColor` |
| Sheet-Edit-Name | Caret | margin-left | 2px | native | MISMATCH\* (same) |
| Sheet-Edit-Name | Caret | state drawn | focused | `autoFocus` (profile.tsx:223) | match |
| Sheet-Edit-Name | Hint | margin-top | 8px | 8 (profile.tsx:227) | match |
| Sheet-Edit-Name | Hint | font-size | 12.5px | 12.5 | match |
| Sheet-Edit-Name | Hint | font-weight | undeclared (400) | `sans('400')` | match |
| Sheet-Edit-Name | Hint | color | `#8B8882` | `#8B8882` | match |
| Sheet-Edit-Name | Hint | text-align | undeclared (left) | left | match |
| Sheet-Edit-Name | Hint | text | `Shown on your vow and your letters.` | identical | match |
| Sheet-Edit-Name | Save pill | margin-top | 16px | 16 (profile.tsx:231) | match |
| Sheet-Edit-Name | Save pill | height | 54px | 54 | match |
| Sheet-Edit-Name | Save pill | border-radius | 27px | 27 | match |
| Sheet-Edit-Name | Save pill | background | `#131313` | `#131313` | match |
| Sheet-Edit-Name | Save pill | align / justify | center / center | center / center | match |
| Sheet-Edit-Name | Save label | font-size | 17px | 17 | match |
| Sheet-Edit-Name | Save label | font-weight | 600 | `sans('600')` | match |
| Sheet-Edit-Name | Save label | color | `#FFFFFF` | `#FFFFFF` | match |
| Sheet-Edit-Name | Save label | text | `Save` | `Save` | match |
| Sheet-Edit-Name | Sheet | cancel affordance | none drawn | scrim tap | match |

**Sheet-Edit-Name rows: 39.**

---

## Findings

**Row count: 403.** (Settings 95, Sheet-Sign-Out 44 + 7 contradiction, Your-Vow-Page 79,
Edit-Profile 103, Sheet-Profile-Photo 36, Sheet-Edit-Name 39.)

**14 MISMATCH + 4 MISMATCH\*.** Documented deviations are listed separately below and are not
counted.

### MISMATCH (the app can close these)

1. **`src/app/(app)/settings.tsx:78`** — `<Section header="Anchors">` takes the default
   `gap = 21`. The canvas leaves **20** between the Anchors card bottom (498) and the Privacy
   caption (518). Should be `gap={20}`.
2. **`src/app/(app)/settings.tsx:87`** — `<Section header="Privacy" gap={20}>`. The canvas leaves
   **21** between the Privacy card bottom (653) and the Account caption (674). Should be `gap={21}`.
   (1 and 2 are transposed; together they push the whole Privacy group 1pt low.)
3. **`src/app/(app)/settings.tsx:71`** — `contentContainerStyle={{ paddingBottom: tabBar }}` adds
   `TAB_BAR_CONTENT (63) + max(inset, 20)` ≈ **97pt** of empty scroll below the last card, but
   `StoicTabBar` returns `null` for `/settings` (`StoicTabBar.tsx:66,73`) so there is no bar to
   clear. Design: content ends at 846 of 852 with no scroll. Should be 0 (or a small trailing pad).
4. **`src/app/(app)/settings.tsx:146`** — sign-out sheet title `marginTop: 18`; design `margin-top: 16px`.
5. **`src/app/(app)/settings.tsx:147`** — sign-out sheet body `marginTop: 8`; design `margin-top: 10px`.
6. **`src/app/(app)/settings.tsx:147`** — sign-out sheet body has no horizontal padding; design
   `padding: 0 12px`.
7. **`src/app/(app)/settings.tsx:148`** — sign-out sheet copy is
   `You are signed in as ${email}. Your progress stays on the account — signing back in brings it all back.`;
   design is `Your log, letters and medallions stay saved to sam@example.com.`
8. **`src/app/(app)/settings.tsx:153`** — sign-out CTA pill `marginTop: 20`; design `margin-top: 18px`.
9. **`src/app/vow.tsx:109`** — the signature is rendered as the user's first name in
   `fonts.script` at 34/34, `#1D1C1A`. The frame draws a **vector mark**: `<svg width="216"
   height="64" viewBox="0 0 216 64">` at `left:50px; bottom:40px`, path
   `d="M6 46 C 20 8, 44 6, 40 30 C 36 52, 12 56, 34 44 C 58 30, 78 22, 96 36 C 108 46, 122 30, 138 34"`,
   `fill="none" stroke="#26261F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"`,
   plus `<circle cx="138" cy="34" r="2.6" fill="#26261F"/>`. Wrong element, wrong colour, wrong
   geometry.
10. **`src/app/vow.tsx:66–83`** — the 46pt sun has no shadow; design
    `box-shadow: 0 6px 18px rgba(226,186,120,0.45)`. (Needs a wrapper `View` with `boxShadow`, since
    the circle is inside the `Svg`.)
11. **`src/app/vow.tsx:60`** — the `Your vow` title has no `numberOfLines`; design declares
    `white-space: nowrap` on that element. Should be `numberOfLines={1}`.
12. **`src/app/vow.tsx:39`** — date stamp uses `toLocaleDateString(undefined, …)`, which renders
    `Mar 14, 2026` under en-US. Design literal is `14 Mar 2026 · Day 0`; `profile.tsx:57` already
    pins `'en-GB'` for the same date format.
13. **`src/app/profile.tsx:251`** — `ProfileSheet`'s `SafeAreaView` has no `boxShadow`; both sheet
    frames declare `box-shadow: 0 -12px 40px rgba(19,19,19,0.3)`. Affects Sheet-Profile-Photo and
    Sheet-Edit-Name. (`settings.tsx:143` has it — this is the same shell missing it.)
14. **`src/app/profile.tsx:218–225`** — the name `TextInput` sets neither `selectionColor` nor
    `cursorColor`; the frame draws the caret as `#131313`. On iOS this renders as system blue.

### MISMATCH\* (RN cannot express the CSS)

- **`src/app/vow.tsx:66–71`** — halo `filter: blur(3px)`. RN has no CSS filter and **no substitute
  was applied**. Nearest substitutes: soften the final gradient stop / add an intermediate stop, or
  a Skia blur. The halo currently has a harder edge than the frame.
- **`src/app/vow.tsx:87–91`** — vow line `text-wrap: balance`. `AppText` applies `textWrap` only on
  web and only for `hero`/`display`/`title` variants, so this `body` text gets `pretty` on web and
  nothing on native. Substitute: a hand-placed break, or promoting the variant.
- **`src/app/profile.tsx:218–225`** — caret `width: 2px`, `height: 22px`, `margin-left: 2px`. RN
  exposes no caret geometry; the native caret is the substitute (only its colour is closable — see
  MISMATCH 14).
- **`src/app/vow.tsx:68,75`** — `radial-gradient(closest-side, …)` and
  `radial-gradient(circle at 50% 38%, …)` extent keywords. RN's `RadialGradient` has no extent
  keywords; the app substitutes `gradientUnits="userSpaceOnUse"` with hand-computed radii (85 and
  36.66). **Both computations check out** — recorded as the accepted substitute, not a defect.

### Canvas self-contradiction

- **Sheet-Sign-Out.html vs Settings.html** draw two different Settings pages (see §2.1: different
  caption tops, a Medallions row instead of Weekly reports, no Privacy group, a Name/Email account
  card, and a ringed pill instead of a bare sign-out link). **The evidence supports Settings.html**
  for the page — it is the frame labelled as the screen, it is the only one drawing the Privacy
  group that `App-Lock.html` / `Data-Privacy.html` depend on, and its account group does not
  duplicate what `Edit-Profile.html` owns. Sheet-Sign-Out is authoritative only for the overlay.
  The app already follows this reading; no change implied.

### Documented deviations (not counted as mismatches)

- `settings.tsx:95` — a third Privacy row, `Find support`, not on the canvas (D-024). It adds 51pt
  and is what actually pushes the Account group off its canvas top, independent of findings 1–2.
- `profile.tsx:182–186` — an `App` section (`My values`, `Settings`) not on the canvas (D-026).
- `settings.tsx` / `profile.tsx` sheets — `paddingBottom: 30` plus a bottom safe-area inset, where
  the frame has a flat 30. Consistent across both files; recorded as the home-indicator allowance.
- `routines.ts:29–30` — check-in pill defaults are `7:00 AM` / `10:00 PM`; the frame samples
  `8:00 AM` / `9:30 PM`. User data, not a design token.
