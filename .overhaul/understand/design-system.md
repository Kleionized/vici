# design-system — the Vici Overhaul visual system, measured from the frames, for one RN kit

Scope: the shared visual vocabulary of the whole bundle, to be ported once into `src/lib/theme.ts`
(tokens) and `src/components/mono/*` (components). Screen-specific layouts live in the per-group
docs (`today-day.md`, `settings.md`, `sos-*.md`, `auth-funnel.md`, `library.md`, `tail.md`,
`paywall-reminders.md`); this doc is the reference those screens build from. Machine-readable
companion: **`.overhaul/understand/tokens.json`** (every number below, keyed).

**Method.** Every split frame was parsed with `scripts/overhaul/decl.mjs`'s `parse()` and tallied:
254 Email-Login frames, 1,273 week-canvas lesson frames, 53 illustration tiles. Scripts (re-runnable,
read-only) in `.overhaul/understand/scratch-design-system/`:

| script | output | what it does |
| --- | --- | --- |
| `tally.mjs` | `tally-all.txt`, `tally.json`, `perframe.json` | every colour (with the CSS property / SVG attribute it sits in), every effective type combo (inherited through the ancestor chain), radii, shadows, opacities, borders, transforms, images, text-wrap, depth-1 absolute positions, noise layer, status/home colour per frame |
| `shapes.mjs [--bundle=…]` | `shapes-email.txt`, `shapes-all.txt` | every painted box grouped by its exact visual signature, with the type of its first text and the frames it appears in |
| `comp.mjs <component> [--bundle=…]` | `comp-email.txt`, `comp-weeks.txt` | detector for each kit component, instances grouped into exact variants (full declaration string + child summary) |
| `nav.mjs` | `nav.txt` | every top-60 nav row: left slot / centre / right slot, grouped, with frames |
| `icons.mjs [--weeks]` | `icons.txt`, `icons-weeks.txt` | every inline SVG ≤ 44px, geometry with colours abstracted, colours used, frames |
| `abs.mjs` | — | recurring depth-1 absolute containers (stack tops, CTA anchors) |
| `noise.mjs`, `noise2.mjs`, `ttf.mjs` | — | noise PNG statistics / composite effect; Lato vertical metrics |
| `dumps/<Frame>.txt` | 254 files | `body.mjs` output of every Email-Login frame (chrome stripped) |

The designer's kit (`gen/mono-kit.js`, read in full; `mono-core/onboarding/sos/log/misc/lessons.js`
skimmed) was used only to name things. **The frames were hand-edited after generation and differ
from the kit in many places; every difference is listed in §8 and the frame always wins.**

---

## 1. Frame shell, noise, status bar

Every frame is `width:393px; height:852px; position:relative; overflow:hidden; background:<ground>;
font-family:'Lato',-apple-system,system-ui,sans-serif; -webkit-font-smoothing:antialiased`, plus an
outer canvas shadow (`0 0 0 1px rgba(0,0,0,0.12), 0 16px 40px rgba(20,20,22,0.18)` on app frames,
`0.09 / 0.14` on lesson + dark frames) that is **canvas chrome — never built**. The root sets no
`font-size`, so every block inherits **16px** (matters for the CSS strut, D020).

The second child of every frame is the noise layer: `position:absolute; inset:0;
background-image:url('<file>'); opacity:<o>; pointer-events:none` — no `background-size`, so the
96×96 PNG **tiles at its own size from the frame's (0,0)**, beneath every other element (all content
sits in later positioned siblings).

| variant | ground | noise | opacity | status / home colour | frames |
| --- | --- | --- | --- | --- | --- |
| **app** | `#0D0D0D` | `noise.png` | **0.05** | `#F2F0EC` | 228 — every Email-Login frame not listed below |
| **lesson** | `#0D0D0D` | `noise-dark.png` | **0.06** | `#F2F0EC` | Lesson Scroll 1–14 + all 1,273 week-canvas frames (+ the 53 illustration tiles' 393×240 well) |
| **dark** | `#111111` | `noise-dark.png` | **0.09** | `#FFFFFF` | Cost By Age 80, Night 4 Closed, Night Check-in Cover, Slip Third, Urge Hub Breathe / Now / Pledges / Proof / Score / Surfed (10) |
| **letter** | `#121212` | `noise.png` | **0.05** | `#F2F0EC` | Letter Read, Medallion Letter (2) |

The kit's `frame()` says `noise-dark.png` 0.06 everywhere (0.09 dark) — true only for lesson and dark
frames; **app frames use `noise.png` at 0.05**.

Measured composite (per-pixel over the tile, in 0–255): `noise.png@0.05` on `#0D0D0D` → mean 13.72,
range 13.00–16.27 (a sparse light speckle); `noise-dark.png@0.06` → mean 13.13, range 12.99–13.85
(nearly invisible); `noise-dark@0.09` on `#111111` → 17.18 (16.98–18.20); `noise.png@0.05` on
`#121212` → 18.70 (18.00–21.21). Both PNGs are already in `assets/images/` (md5-identical).

**Status bar:** every frame draws light glyphs (`#F2F0EC`; `#FFFFFF` on dark) → `StatusBar
style="light"` app-wide (already in `src/app/_layout.tsx`). The status bar and home indicator
(`left 127 top 839 139×5 r100`) are chrome (D009). On sheet frames the scrim (z 40) is drawn over
the status bar (z 20) — the native status bar cannot be dimmed; ignore the 0–54 band in pxdiff.

**RN port — `<Screen variant>`**
- Root `View` `flex:1, backgroundColor:<ground>`; first child the existing
  `src/components/ui/Grain.tsx` (`Image resizeMode="repeat"`, absolute fill, `pointerEvents
  none`) with `source=require('assets/images/noise(.png|-dark.png)')`, `opacity` per variant.
- **Anchor the noise at the window's (0,0), not at the safe-area top.** The frame's tile phase starts
  at y 0; a layer starting at y 54 shifts the speckle by 54 px (amplitude ≤ 3/255 — below pxdiff's
  threshold, but it shows in a raw diff). Keep the noise **outside** any ScrollView (it is fixed in
  every frame).
- Tab screens: the bar has no background (§7.18), so the ground + noise must be painted by a
  full-window layer behind both the scene and the bar (tabs layout background / `sceneStyle`
  transparent), otherwise the bar area shows the navigator's own background.

---

## 2. Colour

### 2.1 Core palette (kit names) — counts are all frames (Email-Login + weeks), by occurrence

| token | value | occurrences / frames | where (property × count) |
| --- | --- | --- | --- |
| `ink` | `#F2F0EC` | 12,395 / 1,573 | svg stroke 3,936 · svg fill 3,888 · background 2,506 · color 2,034 · box-shadow 23 · border-bottom 4 |
| `ground` | `#0D0D0D` | 3,742 / 1,570 | background 1,717 · svg fill 1,192 · svg stroke 831 · box-shadow 2 (`0 0 0 4px #0D0D0D` gap ring) |
| `mute` | `#9B968E` | 3,251 / 1,480 | color 2,795 · svg stroke 241 · box-shadow 159 (lesson radios) · svg fill 33 · border 22 |
| `line` | `#2E2E2E` | 2,693 / 1,385 | background 1,488 (dashes, bars, tracks) · box-shadow 1,043 (outline ring) · border-top 99 · color 38 (far wheel digits) |
| `sub` | `#B5B0A8` | 1,737 / 1,191 | color only |
| `onInk` | `#111111` | 990 / 560 | color 651 · svg stroke 296 (checks, chevrons on ink) · svg fill 29 · background 14 (dark grounds) |
| `card` | `#1E1E1E` | 683 / 288 | background |
| `art` | `#5A574F` | 356 / 223 | svg fill 173 · svg stroke 94 (row chevrons) · color 68 (scale digits, ×N tier counts) · background 15 · dashed borders 5 |

`ink` is both the text colour and the fill of every "on" control; anything drawn **on** an ink fill is
`#111111` (glyphs, labels, checks) or `rgba(17,17,17,0.6)` (secondary label on ink: lesson-row
number, `/year`, `Best value`) / `rgba(17,17,17,0.7)` (Paywall `$3.33 a month`) /
`rgba(17,17,17,0.3)` (outline ring on ink, Log Chooser + Cue Hue Picker).

### 2.2 Secondary surfaces

| value | where |
| --- | --- |
| `#111111` | dark-variant ground (10 frames) |
| `#121212` | letter ground (Letter Read, Medallion Letter) |
| `#171717` | bottom-sheet panel (Change Pledge Sheet, Sheet Edit Name, Sheet Profile Photo, Sheet Sign Out) |
| `rgba(0,0,0,0.68)` | sheet scrim (same 4) |
| `transparent` | explicit unselected backgrounds (segmented, week-strip discs, outline discs) — 53 |
| gradients | `linear-gradient(180deg, rgba(30,30,30,0), #111111)` h70 (Letter Read/Medallion Letter foot fade); `linear-gradient(180deg, #111111 0%, #111111 62%, rgba(17,17,17,0) 100%)` h230 top 96 (Cost By Age 80); `linear-gradient(180deg, rgba(30,30,30,0) 0%, #1E1E1E 60%)` h190 (Letter Week XII paper foot); SVG `linearGradient` `#F2F0EC` 0.22→0 (Today Home score fill) |

### 2.3 Dark-variant palette (`#111111` frames only — `#FFFFFF` appears on no other Email-Login frame)

`#FFFFFF` text / primary fill / close X / dots-on · `rgba(255,255,255,0.55)` caps & nav title ·
`rgba(255,255,255,0.62)` body (also its outline ring `0 0 0 1.5px`) · `rgba(255,255,255,0.6)` ghost
· `rgba(255,255,255,0.28)` dots-off and inactive bars · `rgba(255,255,255,0.15)` chip ring /
track · `rgba(255,255,255,0.3)` quote glyph, faint labels · `rgba(255,255,255,0.5)` /`0.4` /`0.75`
one-offs. Cards on dark frames stay `#1E1E1E`.

### 2.4 Tone ramp (mood / feeling discs — Morning Feeling, Night 1 Mood)

`#34322F` → `#5A5751` → `#8A857D` → `#BAB5AD` → `#F2F0EC`; the two darkest carry `inset 0 0 0 1.5px
#45423E`; the selected disc is 64×64 r32 with `box-shadow: 0 0 0 4px #0D0D0D, 0 0 0 6px #F2F0EC`
(gap ring then ink ring). `#BAB5AD` is also the 14px "Fine" dot on Today Home. (The kit's `moodFace`
smiley is not used by any frame.)

### 2.5 Illustration palette (SVG only — heroes, spot art, medals)

`#F2F0EC` ink · `#0D0D0D` ground cut-outs · `#A8A39A` mid (strokes 258, fills 98) · `#55524D` dim
(fills 1,525) · `#3A3835` dim2 (shadow ellipses) · `#232220` tile · `#5A574F` art · `#6B675F` chart
label · medal "paper" `#141414` / `#3A3833` / `#2A2926`. Chart dot fields: `rgba(255,255,255,0.22)`
(Cost By Age 80, 1,623 dots), `rgba(242,240,236,0.28)` (Cost Next 365). Brand: Google `#EA4335
#4285F4 #FBBC05 #34A853` (Login, Welcome Back).

### 2.6 Canvas errors to reproduce (do not "fix")

- **Cost By Age 80**: back chevron stroked `#17160F` (old light kit's TXT) on `#111111` — essentially
  invisible in the PNG. Reproduce the colour (keep it tappable).
- **Onboarding V3 options / chips / Reminders card** carry `box-shadow: 0 1px 2px rgba(0,0,0,0.04)`
  (old light-kit lift; 68 instances in 17 frames). On `#0D0D0D` it darkens ≤ 1 level — invisible.
  Transcribing it is harmless; omitting it costs nothing measurable.

---

## 3. Typography

### 3.1 Faces, weights, italic

- Email-Login loads `Lato:ital,wght@0,400;0,700;0,900;1,700`; the week canvases and illustrations
  load `400;700;900` only (no italic). The app loads `Lato_400Regular, Lato_700Bold,
  Lato_700Bold_Italic, Lato_900Black` (`src/app/_layout.tsx`) — exactly the canvas set.
- Weight use (text runs): **700 ×5,072**, **400 ×2,454**, **900 ×44** (time-wheel selected value
  30/900 ×18, tier-medal SVG numerals 6.4/900 ×25, Score Detail Ranks "Navigator" 18/900),
  **600 ×22** (SVG `<text>` axis labels: Today Home, Score Detail, Starting Score, Settings Weekly
  Report, Weekly Report, Urge Hub Now, Urge Overview When) → resolves to **700**, **800 ×2** (SVG
  text "S" in Weekly Report + Settings Weekly Report) → resolves to **900**. `theme.ts sans()`
  already maps 600→700, 800→900.
- **The italic trap.** `font-style:italic; font-weight:400` occurs **10×**, all medallion quotes:
  Breakwater-Paper/Bronze/Silver/Gold/Platinum and Detail-Paper/Bronze/Silver/Gold/Platinum — 18px,
  lh 28, `#F2F0EC`, centred, pretty. Style is matched before weight, the only italic face is 700, so
  the canvas renders **Lato 700 Bold Italic**. Use `sansItalic()` (family `Lato_700Bold_Italic`,
  `fontStyle:'normal'`, `fontWeight:'normal'`). `font-style:italic; font-weight:700` occurs 7× — the
  signatures: Morning Pledge Signed / Relapse Resign / Slip Pledge ("Jerry", 28px), The Vow ("Sam",
  30px, ls −0.5), Your Vow Page ("Jerry", 24px), Urge Hub Pledges ("Jerry", 22px,
  `rgba(255,255,255,0.62)`), Today Home III ("Jerry", 16px, `#9B968E`). Same face.

### 3.2 `line-height: normal` — what Chrome actually lays out

Lato's metrics: unitsPerEm 2000, hhea ascent 1974, descent −426, lineGap 0 (ratio 1.2). Chrome rounds
ascent and descent **separately**, so a `normal` line box is `round(0.987·size) + round(0.213·size)` —
**not** `1.2·size`. Verified against every text box in the design signatures (11px→13 … 76px→91):

| size | 11 | 11.5 | 12 | 13 | 14 | 15 | 15.5 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 26 | 28 | 30 | 32 | 34 | 38 | 40 | 44 | 48 | 56 | 60 | 64 | 72 |
| --- |---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| line box | 13 | 13 | 15 | 16 | 17 | 18 | 18 | 19 | 21 | 22 | 23 | 24 | 25 | 27 | 28 | 29 | 32 | 34 | 36 | 39 | 41 | 46 | 48 | 52 | 57 | 67 | 72 | 77 | 86 |

RN port: where a frame says `normal` and the text's box position matters (anything in a flex
column), state `lineHeight` from this table (a `lhNormal(size)` helper in theme.ts). On web, leaving
`lineHeight` unset also yields this value (RN-web leaves CSS `normal`), but native does not, and the
CSS **strut** (D020: a block's own 16px font gives a 19px minimum line box around a smaller inline
run) only exists on the canvas — wherever the canvas text is an inline run inside a non-flex block,
size the box from the block's font, not the run's.

### 3.3 Type scale — named styles (runs counted over all frames)

`lh —` = normal (use §3.2). `ls` in px. Colour by token name.

| name | size / weight | lh | ls | colour | other | runs | used by |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `h1` (kit) | 26 / 700 | 33 | −0.6 | ink | width 100%, `text-wrap:balance`; centred variant ×22 | 83 | every question/statement screen top-left (stack top 136) |
| `h1Sheet` | 22 / 700 | 28 | −0.6 | ink | balance | 2 | Sheet Edit Name, Sheet Profile Photo |
| `h1SheetLg` | 24 / 700 | 30 | −0.6 | ink | balance | 1 | Sheet Sign Out |
| `title` | 30 / 700 | 36 | −0.6 | ink (`#FFFFFF` dark) | centred, balance | 262 (91 Email) | hero statements (stack top 452), week covers, lesson cover + "Lesson complete." |
| `titlePage` | 32 / 700 | 38 | −0.6 | ink | balance (centred ×18 on Breakwater/Tiers) | 33 | titleHead pages: Your log, Medallions, Weekly report, Urge overview, Archive… |
| `titleCover` | 34 / 700 | 40 | −0.6 | ink / `#FFFFFF` | centred | 4 | Morning/Night Check-in Cover, Night 4 Closed, Paywall |
| `greeting` | 26 / 700 | 32 | −0.7 | ink | nowrap | 4 | Today Home ×4 |
| `lessonHeading` | 24 / 700 | 31 | −0.4 | ink | balance (centred for quotes) | 575 | lesson readers |
| `lessonBody` | 18 / 400 | 28 | 0 | sub | pretty | 1,356 | lesson readers |
| `lessonCaps` | 13 / 700 | **16** | **0.2** | mute | balance | 819 | lesson "Part 2", "Question", "Done when", authors |
| `lessonOption` | 16 / 400 | 22 | 0 | ink | pretty | 159 | lesson radio/checkbox rows |
| `lessonDoneWhen` | 16 / 700 | 22 | 0 | ink | pretty | 101 | done-when card |
| `p` (kit) | 15 / 400 | 24 | 0 | sub | pretty; centred ×95 | 114 | under titles |
| `pTight` | 15 / 400 | 22 | 0 | sub or mute | pretty / centred | 143 | week-cover subtitle, "Choose one.", "Select all that apply.", tier copy |
| `caps` (kit) | 13 / 700 | — | 0 | mute | nowrap; centred variant | 1,450 | section labels, nav titles, eyebrows |
| `primaryLabel` | 16 / 700 | — | **0.1** | onInk | nowrap | 487 | primary pill |
| `ghost` | 15 / 400 | — | 0 | mute | centred | 65 | ghost link |
| `optionLabel` | **15** / 400 | — | 0 | ink / onInk | nowrap | 109 | options, chips (kit says 16 — frames 15) |
| `gridLabel` | 16 / 700 | — | 0 | ink / onInk | nowrap | 22 | grid2 |
| `rowLabel` | 15 / 700 | — | 0 | ink (mute for Delete account / Remove photo) | nowrap | 191 | settings rows, log rows, week lesson rows |
| `rowValue` | 14 / 700 | — | 0 | mute | nowrap | 118 | settings row values |
| `pill` | 13 / 700 | — | 0 | ink / onInk | nowrap | ~130 | segmented, pills, SOS label |
| `tabLabel` | 11.5 / 400 · 700 | — | 0 | mute · ink | | 148 | tab bar |
| `authButton` | 17 / 700 | — | 0 | onInk / ink | | 6 | Login, Welcome Back |
| `legal` | 12 / 700 | — | 0.4 | mute | | 3 | "Terms · Privacy", "Terms · Restore" |
| `statValue` | 64 / 700 | 67 | −2.2 | ink | nowrap | 9 | Log Urges/Check-ins/Reports, Urge Hub Proof (68 lh, `#FFFFFF`) |
| `scoreDetail` | 60 / 700 | 70 | −2.4 | ink | centred | 3 | Score Detail ×3 |
| `scoreToday` | 56 / 700 | 56 | −0.5 | ink | | 1 | Today Home |
| `tierCount` | 48 / 700 | 50 | −1.7 | ink | nowrap | 8 | Tiers-* |
| `costBig` | 44 / 700 | 52 | −1.5 | ink / `#FFFFFF` | | 2 | Cost Next 365, Cost By Age 80 (44/67 on Urge Overview ×2, 44/50/−0.6 on Day Zero) |
| `wheel` | 30/900 · 22/400 | — | 0 | ink · mute · line | | 54 | time wheels |
| `medalQuote` | 18 / 400 italic → **700 italic** | 28 | 0 | ink | centred | 10 | Breakwater/Detail |
| `splashWordmark` | 14 / 700 | — | **7** | ink | centred | 1 | Splash "VICI" |

One-offs (exact values in `tally-all.txt` § type combos): 40/46/−0.6 The Vow title; 21/33 vow body;
23/32/−0.4 Your Vow Page; 22/34 Night 3 Reflection input; 20/30 SOS Afterward input; 20/29 Change
Pledge input (700); 15.5/25 letter body (`#B5B0A8`, 700 `#F2F0EC` sign-off); 22/−0.3 "Dear Sam,";
72/100/−2 age wheel; 30/56 & 34/60 age neighbours (`#2E2E2E`, `#5A574F`); 26/−0.8 paywall prices.

**Letter-spacing set (all values):** 0.2 ×821 · −0.4 ×582 · 0.1 ×487 · −0.6 ×401 · −0.2 ×74 · 0.3
(illustration labels only) · −2.2 · −1.7 · −1.5 · −0.5 · −0.7 · −0.3 · 0.4 · −2.4 · −0.8 · 1 · 7 ·
0.5 · −2 · −1.6. RN `letterSpacing` takes the number verbatim.

**text-wrap:** `pretty` 2,091 runs, `balance` 1,770 runs. RN has neither. Rule (BRIEF §6): compare line
breaks against the PNG; for fixed copy break with `\n`; otherwise constrain the width so the same
breaks fall out. `balance` matters for every `h1`/`title` that wraps (e.g. V3 Q1 "How often are you /
watching porn right now?" breaks before "watching", not greedily).

---

## 4. Radii, rings, borders, shadows, opacity

**Radii in use** (count, frames): 2 (lesson bar, grabber) · 22 ×1,066 (44-ring, segmented, pills,
lesson small options) · 29 ×495 (primary pill) · 1 ×377 (nav dashes) · 18 ×328 (options, week lesson
rows, segmented thumb, 36-pills, lesson split cards) · 24 ×243 (cards, chips48, lesson options) · 12
×195 (24-discs, 24-pills) · 50% ×162 · 20 ×157 (row groups, grid2, lesson cards) · 14 ×113
(wheel band, lesson 28-disc) · 48 ×88 (96-disc) · 7 (lesson checkbox; week-strip 14-dot) · 6 · 30
(60-disc: SOS, fab) · 3 · 21 (42 day toggles) · 15 (toggle; intensity bars) · 4 · 16 · 11 · 17 · 13 ·
9 · 26 (letter card) · 32 · `28px 28px 0 0` (sheet) · 42 · 5 · 66 · 10 · `24px 24px 0 0` (Letter
Week XII). RN: `borderRadius` number; `50%` → half the size; `28 28 0 0` →
`borderTopLeftRadius/borderTopRightRadius: 28`.

**Rings (spread-only box-shadows — 1,023 outline instances):**

| ring | use |
| --- | --- |
| `0 0 0 1.5px #2E2E2E` | **the kit outline**: grid2 unselected, 44 ring-next, week-strip future disc, avatar ring, auth buttons (Google/email), intensity bars, mood-ring discs, 34/44 icon circles |
| `0 0 0 1.5px #F2F0EC` | "current" outline: week-strip today, step-list current, Paywall badge, Cost Next 30 |
| `0 0 0 1.5px #5A574F` · `rgba(17,17,17,0.3)` · `rgba(255,255,255,0.62)` · `0 0 0 1px rgba(255,255,255,0.15)` | one-offs (Cost Next 30; ring on ink; dark frames) |
| `inset 0 0 0 1.5px #9B968E` | lesson radio (r12) / checkbox (r7) |
| `inset 0 0 0 1.5px #2E2E2E` | lesson note chip; Weekly Report Days (written `0 0 0 1.5px #2E2E2E inset`) |
| `inset 0 0 0 1.5px #F2F0EC` | lesson split card selected; Score Detail Moves bar outline |
| `inset 0 0 0 1.5px #45423E` | tone discs 1–2 |
| `0 0 0 2px #F2F0EC inset` | Weekly Report Days today disc |
| `0 0 0 4px #0D0D0D, 0 0 0 6px #F2F0EC` | selected tone disc |

RN port (BRIEF §5): `boxShadow: '0 0 0 1.5px #2E2E2E'` (string syntax; RN 0.85 new arch + RN-web
both honour spread and `inset`). Never a `border` (eats into the box). A spread lies wholly
**outside** the border box (D156) and is clipped by any ancestor `overflow:hidden` — inside a
ScrollView, keep ≥ 1.5px of padding around ringed elements at the content edges.

**Borders:** `border-top: 1px solid #2E2E2E` ×99 (row dividers — never on the first row);
`border: 2px solid #9B968E` (lesson timeline hollow dot, `box-sizing:border-box`);
`border-bottom: 1.5px solid #F2F0EC` (signature line, h44); `border-left: 2px dashed #5A574F` (rank /
timeline connectors); `border-bottom: 1.5px dashed #5A574F` (Morning Resign Pledge unsigned line).
RN: dashed borders render differently per platform — draw dashed connectors as SVG lines
(`strokeDasharray`) if pixel parity matters.

**Drop shadows:** none in the app. The only blurred shadows are canvas chrome (frame shadow,
illustration-card shadow) and the invisible `0 1px 2px rgba(0,0,0,0.04)` (§2.6).

**Opacity:** element opacity only for noise (0.05 / 0.06 / 0.09) and dimmed medals (`opacity:0.32`
on unearned tier SVGs, 53× in 18 frames). SVG `fill-opacity` 0.3 / 0.12 / 0.09 / 0.08 and
`stroke-opacity` 0.5 inside art.

---

## 5. Layout grid and recurring positions (canvas y; app y is identical with the mock 54 inset)

| element | geometry | frames |
| --- | --- | --- |
| nav row | `left 0 right 0 top 60 height 40; padding 0 22; flex row space-between; align center; z 5` | 219 |
| lesson close | `left 22 top 60 height 40; flex align center; z 5` (X 18×18) | 38 Email + 1,273 lesson |
| lesson title | `left 0 right 0 top 60 h40; justify center; z 4` | lesson frames 2+ |
| lesson progress | `left 24 right 24 top 108 height 3 r2 #2E2E2E` (fill `width:N%`) | all lesson frames |
| lesson content | `left 32 right 32 top 140 bottom 128; padding-bottom 24; border-box; flex column; justify center` | all lesson frames |
| question stack | `left 24 right 24 top 136; flex column; gap 14 / 8 / 18 / 20` | ~60 |
| settings stack | `left 24 right 24 top 120; column gap 18` (groups gap 10 inside) | Settings, Sheet Sign Out |
| profile stack | `left 24 right 24 top 124; column gap 18` | Edit Profile + 2 sheets |
| titleHead | back row (top 60) + title block `left 24 right 24 top 108` (32/38) + body `left 16 right 16 top 164` | 15 (Log ×3, Medallions ×3, Tiers ×9) |
| hero svg | `left 0 top T; 393×240; transform scale(s); origin 196px 190px` — T = 190 (×79), 506 (×24), 80 (×10 week covers), 98.9, 582 (×9 V3), 458 | ~130 |
| statement under hero | `left 24 right 24 top 452; column gap 18; centred` (caps + title + p) | 66 (451 ×7, 16-gap ×4) |
| week cover text / rows | text `top 338` (gap 8, centred); rows `left 16 right 16 top 472` (gap 20; rows gap 8) | 24 |
| primary pill | `left 24 right 24 bottom 48 height 58; z 6` | 106 Email + 316 lesson |
| primary over ghost | primary `bottom 96`; ghost `left 0 right 0 bottom 60` | 65 |
| Paywall CTA | primary `bottom 82`; small line `bottom 52` | 2 |
| ghost alone | `bottom 48` (Settings "Sign out", Your Vow Page); `bottom 56` (Manage Subscription, Sheet Profile Photo "Cancel" 15/**700**) | 5 |
| next FAB | `right 24 bottom 52 60×60` | 3 |
| ring next | `left 0 right 0 bottom 52; justify center` → 44×44 at x 174.5 | 11 Email + 957 lesson |
| tab bar | `left 0 right 0 bottom 0 height 104` | 37 |
| pager dots | `left 0 right 0 bottom 180; gap 7; centred` | 5 (Urge Hub) |
| sheet content | `left 24 right 24 top 44` inside the panel | 4 |

Gutters: **24** (default), **16** (week rows, Today strip, titleHead body, Letter card), **32** (lesson
content, Log day row), **40** (wheel band), **44** (Breakwater progress). Bottom-anchored offsets
are measured from the frame edge (D026).

---

## 6. Icons (every inline glyph, exact)

All `fill="none"`, `stroke-linecap="round"`, `stroke-linejoin="round"` unless noted. Colours vary by
context (listed). Port each as a tiny `Svg` component taking `color` (and `size` where it varies —
**keep the viewBox and stroke-width in viewBox units; the stroke scales with size**).

| icon | svg size / viewBox | geometry | stroke | colours seen (count) |
| --- | --- | --- | --- | --- |
| `ChevronL` | 12×20 / `0 0 12 20` | `M10 2L2 10l8 8` | 2.2 | `#F2F0EC` 132 · `#FFFFFF` 1 · `#17160F` 1 |
| `ChevronR` | 14×14 / `0 0 14 14` | `M5 2l5 5-5 5` | 2 | `#5A574F` 83 (settings rows, upcoming lessons) · `#9B968E` 43 (done lessons, kit listRows) · `#F2F0EC` 11 + 957 lesson (ring-next) |
| `ChevronD` | 14×14 | `M2 5l5 5 5-5` | 2 | `#F2F0EC` (Score Detail "Months") |
| `FabChevron` | 14×22 / `0 0 12 20` | `M2 2l8 8-8 8` | 2.4 | `#111111` |
| `CloseX` | 18×18 / `0 0 18 18` | `M2 2l14 14M16 2L2 16` (cap round, no join) | 2 | `#F2F0EC` 121 + 1,273 lesson · `#FFFFFF` 9 |
| `Check` | N×N / `0 0 14 14` | `M2 7.5l3.2 3L12 3.5` | 2.2 | `#111111` (on ink) almost always; sizes 11 (in 22 disc), 12 (24 / 28 discs), 13 (chips, 26 / 30 / 32 discs), 14 (36 / 34 discs), 16 (40 disc), 20, 34 (96 disc), 36 (84 disc), 56 (132 disc) |
| `Share` | 18×18 | `M9 11V2M5.5 5.5L9 2l3.5 3.5M4 9v5.5A1.5 1.5 0 0 0 5.5 16h7a1.5 1.5 0 0 0 1.5-1.5V9` | 1.8 | `#F2F0EC` (Breakwater/Detail nav right) |
| `Flame` | 16×18 | `M8 1c1 3 4 4.5 4 8.5A4 4 0 0 1 4 9.5c0-1.5.6-2.5 1.3-3.3.2 1 .8 1.8 1.7 2C6.5 6 6.5 3.5 8 1z` | fill | `#F2F0EC` |
| `Person` | 22×22 | `circle 11,8 r4` + `M3.5 19a7.5 7.5 0 0 1 15 0` (cap round) | 1.8 | `#F2F0EC` (outline — kit's filled avatar is not used) |
| `Bolt` | 14×14 | `M8 1L2 8h5l-1 5 6-7H7z` | fill | `#F2F0EC` |
| `ArrowUp` | 10×10 | `M5 9V1M1.5 4.5L5 1l3.5 3.5` | 1.8 | `#F2F0EC` (score delta chip) · 16×16 `M8 13V3M3.5 7.5L8 3l4.5 4.5` 2.2 `#111111` |
| `Quote` | 28×22 | `M2 12c0-6 4-10 10-10v4c-3 0-5 2-5 5h5v9H2zM16 12c0-6 4-10 10-10v4c-3 0-5 2-5 5h5v9H16z` | fill | `#5A574F` (lesson ×168) · `#2E2E2E` · `rgba(255,255,255,0.3)` |
| `Pencil` | 16×16 | `M3 13l1-3.5L10.5 3l2.5 2.5L6.5 12z` (join round) | 1.6 | `#9B968E` (lesson note chip) |
| `Apple` / `Google` | 16×19 / 19×19 (vb 48) | brand paths (see Login dump) | fill | `#111111` / four Google colours |
| tab icons | 26×26 | see §7.18 | 1.8 | `#F2F0EC` active / `#9B968E` |
| misc 18 / 20 / 22 / 26 | Today Home III (+, star, share-up, stopwatch), Log Chooser (sun, wave ×2), Cue Hue Picker (home, bed, people, briefcase, pin — `stroke=currentColor`), Your Plan (moon, bed, phone, calendar, bolt), Weekly Report Days (wave), App Lock (lock 30) | see `icons.txt` | 1.6–2.6 | per frame |

Laurel mark: `<img src="laurel-mark.webp">` (280×252 source) with `filter: brightness(0) invert(1)`
= pure `#FFFFFF` silhouette. Sizes: Splash 120×120 at (136, 330); Login / Welcome Back 104×104 at
(144.5, 150); Reminders Setup 40×40 r10 (notification icon); Paywall 28×28. RN: `Image`
`tintColor="#FFFFFF"` (identical maths: every non-transparent pixel → white, alpha kept). The source
is 280×252 but every `<img>` states a square width and height with no `object-fit`, so the browser
**stretches** it (`object-fit: fill`) — use `resizeMode="stretch"`, not `contain`.

---

## 7. Component catalogue (exact CSS, variants, frames, deviations, RN port)

Notation: `W×H rR bg … ring …`. "kit" = `mono-kit.js`; deviations are also collected in §8.

### 7.1 `NavBar`
Row: `position:absolute; left 0; right 0; top 60; height 40; display flex; align-items center;
justify-content space-between; padding 0 22; box-sizing border-box; z-index 5`. Slots: left and right
`36×40` (`80×40` when the right slot holds text), left `align-items:center`, right
`justify-content:flex-end` + `font-size 15 font-weight 700 color ink` (inherited by a text action).

| variant | left | centre | right | frames |
| --- | --- | --- | --- | --- |
| title + close | empty | `navTitle` 13/700 mute, nowrap | CloseX | 54: Cue Set Confirmation ("Move III of 3"), Letter Read ("From VICI"), Medallion Letter ("Enclosure from VICI"), SOS-Feel-* / SOS-Loc-* / SOS-Trig-* ("What’s underneath" / "Where you are" / …), Slip-Feel-*, Slip-Trigger-* |
| close only | empty | — | CloseX | 23: Cue Intro Modal, Drop Received, Lapse Done, Letter Arrival, Log Chooser, Morning 5 Done, Morning Check-in Cover, Relapse Log/Resign/Twice, Report Ready, SOS Afterward, Slip Begin Again / Close It / Dont Fail Twice / Entry / Logged / Morning After / Pledge / Stop Here / Urge Now, Surf Complete, Urge Log Done; + 3 with a plain right box: Letter Week XII, Paywall Rescue, The Vow |
| close only, dark | empty | — | CloseX `#FFFFFF` | Night 4 Closed, Night Check-in Cover, Slip Third |
| title + close, dark | empty | title `rgba(255,255,255,0.55)` | CloseX `#FFFFFF` | Urge Hub Now/Pledges/Proof/Score/Surfed ("Ride it out"); Urge Hub Breathe adds ChevronL `#FFFFFF` |
| back + dashes (+ close) | ChevronL | 8 dashes | CloseX or empty | check-ins, SOS steps, logs (with close); V3 onboarding questions (no close) — §7.26 |
| back + title | ChevronL | title | empty (15/700 box) | 9: App Lock, Data & Privacy, Edit Profile, Manage Subscription ("Subscription"), Settings, Sheet Edit Name, Sheet Profile Photo, Sheet Sign Out, Your Vow Page; 2: Start Here Step 1/2 ("Step 1 of 2") |
| back only | ChevronL | — | `<div>` empty | 15 titleHead pages (Album Earned II, Log ×3, Medallions ×2, Tiers ×9) |
| back only | ChevronL | — | 36×40 empty | 10: A Clean Day, Cost Next 30/365, Line ×2, Onboarding Start, One Bad Day, Starting Score, What You Want Back, Your Plan; 3: Morning/Nightly/Settings Check-in Time; Cost By Age 80 (`#17160F`) |
| empty both | empty | — | empty | 7: Day Zero, Letter Received, Medallion Received, Paywall Confirmed, Reminders Setup, Start Here, Where We’d Start (reserve the row; no back) |
| back + share | ChevronL | — | Share 18 | Breakwater-*, Detail-* (10) |
| back + pill | ChevronL | — | pill 32h (`r16 card padding 0 14 13/700 ink`, inline-flex) in a `height:40` box | 8: Urge Overview ×4 ("Last 30 days"), Weekly Report ×3 + Settings Weekly Report ("Jul 14–20") |
| back + dropdown | ChevronL **svg as direct child** (no 36 box), row has **no z-index** | — | `44h r22 card padding 0 18 gap 10` "Months" 15/700 + ChevronD | Score Detail ×3 |
| back + text | 80×40 empty | — | 80×40 "Restore" 15/700 ink | Yearly Drop |
| week cover | ChevronL svg directly in `left 22 top 60 h40 flex` (no row) | — | — | 24 week covers |

RN: one `NavBar` with `left: 'back'|'none'`, `centre: {title}|{step,total}|null`, `right:
'close'|'share'|{text}|{pill}|{dropdown}|null`, `tone: 'light'|'dark'`. Give the 36×40 slots
`hitSlop` rather than growing them. The chevron's 12×20 SVG sits at x 22 (left edge of the slot),
vertically centred in 40 → y 70.

### 7.2 `LessonChrome` (lesson readers — 14 Email + 1,273 week frames)
- Close: `left 22 top 60 h40 flex align center z5` → CloseX 18 `#F2F0EC` (no 36 slot).
- Title (frames 2+): full-width row `top 60 h40 justify center z4`, `navTitle` "Lesson N" — frame 1
  (cover) has no title.
- Progress: track `left 24 right 24 top 108 h3 r2 #2E2E2E`; fill `width:N% h3 r2 #F2F0EC`
  (N = round(k/total·100): 7, 14, 21 … 93, 100 for 14 frames; other totals give 6, 13, 19, 25 … —
  read per frame).
- Content: `left 32 right 32 top 140 bottom 128; padding-bottom 24; border-box; column;
  justify-content center` (text-align center on cover/quote/complete frames).
- Advance: `RingNext` (§7.9) on reading frames; primary pill "Begin" (cover) / "Continue" (question)
  / "Finish lesson" (task) / "Done" (complete).

### 7.3 `TitleHead` (page title under a back row)
`left 24 right 24 top 108` holding `titlePage` 32/700/38/−0.6 ink, balance; page body begins `left 16
right 16 top 164` (segmented) or per frame. 15 frames (Log ×3, Medallions ×3 incl. Album Earned II,
Tiers ×9 — tiers centre it).

### 7.4 Text primitives — `H1`, `Title`, `P`, `Caps`, `Body`
Exactly the §3.3 styles. Kit `h1` = `width:100%` + balance; `p` = `width:100%` + pretty; `caps` =
`width:100%; white-space:nowrap`. RN: `Text` with `sans('700')`, `fontSize`, `lineHeight`,
`letterSpacing`, `color`; `textAlign:'center'` for centred variants. Never `numberOfLines` for
`nowrap` (that truncates; nowrap overflows) — keep the container wide enough.

### 7.5 `PrimaryButton`
`position absolute; left 24; right 24; bottom 48; height 58; border-radius 29; background #F2F0EC;
flex center; z 6` → `<span>` 16/700 ls 0.1 `#111111` nowrap (box 746–804 at bottom 48; text line
box 19, centred → 765.5–784.5).

| variant | change | frames |
| --- | --- | --- |
| default | bottom 48 | 101 Email + 316 lesson |
| over ghost | bottom 96 | 58 |
| dark | `background:#FFFFFF` (bottom 96 ×6 Urge Hub, bottom 48 ×4) | 10 dark frames |
| paywall | bottom 82 | Paywall, Paywall Confirmed |
| sheet | `z-index 42`, **no `letter-spacing`** (Sheet Edit Name "Save" also drops `white-space`) | Sheet Edit Name (bottom 48), Sheet Sign Out (bottom 96) |
| auth | in-flow, `height 58 r29`, `gap 10`, 17/700, **no ls**; Apple: ink fill + Apple glyph 16×19 `#111111`; Google / email: `#1E1E1E` + ring `0 0 0 1.5px #2E2E2E`, 17/700 ink | Login, Welcome Back |

No disabled state is drawn anywhere. If the app needs one, do not invent a colour silently —
raise it (open question §10).

### 7.6 `GhostLink`
`position absolute; left 0; right 0; bottom 60; text-align center; 15/400 #9B968E; z 6` (line box
18 → y 774–792). Variants: dark `rgba(255,255,255,0.6)` (Urge Hub "I slipped"); bottom 48 alone
(Settings "Sign out", Your Vow Page "Re-sign the vow"); bottom 56 (Manage Subscription "Cancel
subscription"; Sheet Profile Photo "Cancel" **15/700**, z 42); sheet z 42 (Sheet Sign Out "Stay
signed in" bottom 60). Kit default is `bottom 62` — **frames use 60**.
RN: a full-width `Pressable` row would make the whole 393 width tappable; the canvas's box is the
full width too (`left 0 right 0`), so that is faithful.

### 7.7 Login / auxiliary text links
Login & Welcome Back: `left 0 right 0 bottom 108; centred; 15/400 #B5B0A8` with an inline `<span>`
700 `#F2F0EC` ("Sign in" / "Create account" — keep as nested `Text`); legal line `bottom 64; 12/700
ls 0.4 mute` ("Terms · Privacy"); Paywall `bottom 52` "Terms · Restore"; Paywall Confirmed `bottom 52`
12/700 mute "Receipt sent to …". Divider "or": `flex row gap 12 padding 2 0` with two `flex 1 h1
#2E2E2E` rules and 13/700 mute text.

### 7.8 `NextFab`
`position absolute; right 24; bottom 52; 60×60 r30 #F2F0EC; flex center; z 6` → FabChevron 14×22
(vb `0 0 12 20`) `M2 2l8 8-8 8` stroke **`#111111`** 2.4. Frames: Checkin Emotions, Checkin Reasons,
Morning Task Check. **Kit draws `#FFFFFF` (invisible on ink) — frame wins.**

### 7.9 `RingNext` (lesson advance)
Row `left 0 right 0 bottom 52; flex; justify center` → `44×44 r22; box-shadow 0 0 0 1.5px #2E2E2E;
flex center` → ChevronR 14 `#F2F0EC` stroke 2. 957 lesson frames + Lesson Scroll 2–12. Kit
`iconCircle` is the same shape (44 transparent + ring) — also used on Log Chooser (22px glyphs) and,
at 34px, on Cue Hue Picker.

### 7.10 `OptionList` / `Option` (single choice, full-width rows)
Column `gap 12` → each `height 58; r18; padding 0 22; border-box; flex; align center` →
`<span>` **15**/400 nowrap.
- off: `bg #1E1E1E`, text ink (+ `box-shadow 0 1px 2px rgba(0,0,0,0.04)` on V3 frames).
- on: `bg #F2F0EC`, text `#111111`, `box-shadow none`.
- Frames: V3 Q1, Q2, Q3, Q3b, Q10, Q13, Q15, Q16, Q21, Q26 Gender (with shadow); Slip Urge Now, Urge
  Log Outcome (without).
- Kit says 16px — **frames draw 15px**. In V3 frames the list sits in the question stack after an
  `h1` and an 18px spacer div (`gap 14` + `height 18`); selecting advances (no CTA drawn).

**Lesson row** (week covers — library group): `height 58; r18; #1E1E1E; gap 16; padding 0 18` →
28-wide slot (done: 24 disc r12 ink + Check 12; current/upcoming: lesson number 14/700 —
`rgba(17,17,17,0.6)` on current, mute on upcoming) · label `flex 1` 15/700 · trailing ChevronR 14
(`#9B968E` done, `#5A574F` upcoming) or "Continue" 13/700 `#111111` on the current row, whose fill
is `#F2F0EC` with label `#111111`. Rows gap 8.

### 7.11 `Grid2` (two-column tiles)
`display grid; grid-template-columns 1fr 1fr; gap 12` → tiles `height 62; r20; flex center`:
off `bg #1E1E1E` + `box-shadow 0 0 0 1.5px #2E2E2E`, label 16/700 ink nowrap; on `bg #F2F0EC`,
`box-shadow none`, label `#111111`. Frames: Checkin Emotions, Checkin Reasons, Morning Task Check
(matches kit). RN: no CSS grid → row-wrap with tile width `(contentWidth − 12) / 2` (= 166.5 at 345)
and `rowGap/columnGap 12`.

### 7.12 `Chips` (multi-select, wrapping)
`display flex; flex-wrap wrap; gap 12` → chip `height 48; r24; padding 0 20; gap 8; flex align
center` → [Check 13 `#111111` when on] + `<span>` 15/400 nowrap. Off `#1E1E1E`/ink, on
`#F2F0EC`/`#111111`. With the 0.04 shadow on V3 Q5, Q6, Q7, Q17, What It Affects, What Starts It;
without on Lapse Trigger, SOS Feeling Picker, SOS Reason Picker, Slip Fed, Urge Log Trigger.
Matches kit. RN: `flexDirection row, flexWrap wrap, gap 12`; chip width is content-sized
(`alignSelf flex-start` in a column parent).

### 7.13 Cards
- **Filled card (kit `card`)**: `r24 #1E1E1E padding 22 22` (variants `22 22 24`, `22 22 20`, `24 24
  20` pledge card, `26 28 30` / `26 26 24` quote cards, `20 22`, `18 20`, `16 20 18`). Frames:
  pledge cards ×4, SOS Challenge, Yearly Drop, Manage Subscription plan card, Morning Task Check,
  Today Home III, Urge Hub Pledges/Score/Surfed, Your Vow Page, Score Detail Moves/Ranks.
- **Row-group card**: `r20 #1E1E1E overflow hidden` (§7.14).
- **Outline card**: `r22 #1E1E1E + 0 0 0 1.5px #2E2E2E padding 20 18 18` (Paywall Monthly); selected
  plan `r22 #F2F0EC padding 20 18 18`. Kit's transparent outline card is not drawn anywhere.
- **Tile cards**: Today Home II/Task `height 150 r24 card padding 18; column; space-between`.
- **Icon list card**: `r18 card padding 16 18 gap 16` with a 42 ink disc + 20px glyph (Your Plan).
- **Input card**: `min-height 100 r20 card padding 20 22` 20/700/29 (Change Pledge Sheet); `min-height
  150 r22 padding 22 24` 20/400/30 (SOS Afterward) — §7.28.
- **Letter card**: `left 16 right 16 top 112 bottom 150; r26 card; overflow hidden`, inner `padding 28
  26 0; column gap 16`.
- RN: `View` with `borderRadius`, `backgroundColor`, `padding*`; `overflow:'hidden'` only where the
  frame says so.

### 7.14 Row groups (settings) and list rows
**`RowGroup`** (the dominant one — Settings, App Lock, Data & Privacy, Edit Profile, the 3 sheets):
caps label (13/700 mute nowrap) + `gap 10` + card `r20 #1E1E1E overflow hidden` → rows `height 54;
padding 0 18; flex; space-between; align center; gap 12`; rows 2+ add `border-top 1px solid
#2E2E2E`. Left: `rowLabel` 15/700 ink nowrap (mute for "Delete account", "Remove photo"). Right:
`flex; gap 10` → optional value 14/700 mute nowrap + ChevronR 14 `#5A574F` (or a Toggle, or nothing:
"Started VICI", "Current week"). Groups stack with `gap 18`.
**Kit `listRows`** (`r22`, rows `height 60 padding 0 20`, 16/400 ink, ChevronR `#9B968E`, value 16/700
ink) — **only Manage Subscription** draws it.
**Log rows** (no card): `height 52; padding 0 2; gap 14; space-between`, divider on rows 2+; left
15/700 ink; right 14/700 mute (`flex; gap 8`, optional 6×6 r3 ink dot + ink text for "Slipped").
Weekly Report Urges 56; Urge Overview 46 with a 96-wide label and dot bars.
**Detail rows** (Lapse Done, Slip Logged, Urge Log Done): card `r22 overflow hidden`, rows `padding 16
20; flex; space-between; align flex-start; gap 16`; label 14/700 mute (`padding-top 1`), value 15/700
ink right-aligned lh 22.
**Check rows** (Morning 1 Yesterday, Night 2 Record): `height 58; padding 0 2; gap 14`; 22 ink disc
+ Check 11; 16/400 ink.

### 7.15 `Toggle`
`50×30 r15 position relative`; on: track `#F2F0EC`, knob `position absolute top 3 right 3 24×24 r12
#1E1E1E`. Frames: App Lock ("Require Face ID", "Lock when I leave the app"), Data & Privacy ("Hide
sensitive previews", "Pause analytics") — **all on**. Kit knob is `#FFFFFF` (invisible on ink) — the
frames use `#1E1E1E`. **Off state is never drawn**: kit off = track `#2E2E2E`, knob left 3; the kit's
`#FFFFFF` knob would be the only pure white on a standard frame — recommend knob `#F2F0EC` (open
question §10). RN: a `Pressable` with an absolutely positioned knob; animate `left 3 ↔ 23`.

### 7.16 `Segmented`
`height 44; r22; #1E1E1E; padding 4; border-box; flex` → segments `flex 1; height 36; r18; flex
center; 13/700 nowrap`; selected `bg #F2F0EC` text **`#111111`**, others `transparent` / mute. Sits at
`left 16 right 16 top 164`. Exactly one segment is selected on every frame. Sets: Log ×3 (Urges ·
Check-ins · Reports), Medallions + Medallions Still To Earn + Album Earned II (Earned · Still to
earn), Weekly Report ×3 + Settings Weekly Report (Score · Days · Urges), Urge Overview ×4 (Overview ·
Strength · Mood · Timing). Kit selected text is `#FFFFFF` — frames `#111111`.

### 7.17 Pills / tags
| pill | spec | where |
| --- | --- | --- |
| range | `h32 r16 #1E1E1E padding 0 14 inline-flex; 13/700 ink nowrap` (+ 8×8 r4 ink dot, gap 8, on Score) | nav right: Urge Overview, Weekly Report, Score Detail |
| when-chip | `h44 r22 padding 0 18; 14/700`; off `#1E1E1E`/ink, on `#F2F0EC`/`#111111` | Lapse/Slip/Urge Log When ("Just now", "Earlier today", "Yesterday") |
| date row | `h44 r14 #1E1E1E padding 0 6 0 18; space-between` + inner `h32 r16 #0D0D0D padding 0 14` "Change" 13/700 | Lapse/Slip/Urge Log When |
| streak | `h36 r18 #1E1E1E padding 0 12 0 10 gap 6` Flame 16×18 + 15/700 | Today Home ×4 |
| delta | `h30 r15 #1E1E1E padding 0 12 gap 5` ArrowUp 10 + 14/700, `margin-bottom 8` | Today Home |
| check-in chip | `h44 r22 #1E1E1E padding 0 18 0 8 gap 10` + 30 disc (`#1E1E1E` + ring `#2E2E2E`) + 15/700 | Today Home ("Fine", "Low energy"), Surf Complete (ink disc + Check 13) |
| badge | `h28 r14 #F2F0EC padding 0 12; 12/700 #111111` | Manage Subscription "Active", Yearly Drop "Save 74%" |
| status | `h36 r18 padding 0 14; 13/700` ink-filled ("Held for 92 days") or card ("Signed Apr 18") | Your Vow Page |
| dark tag | `h36 r18 #1E1E1E + 0 0 0 1px rgba(255,255,255,0.15) padding 0 14; 13/700 #FFFFFF` | Urge Hub Now |
| place | `h44 r22 #F2F0EC padding 0 18 inline-flex; 15/700 #111111` | Where We’d Start |
| lesson tag | `h24 r12 #F2F0EC padding 0 10; 13/700/16 #111111` | lesson timeline "Change this part" |
| outline small | `h34 r17 #1E1E1E + ring #2E2E2E padding 0 16; 13/700 ink` | Starting Score |
RN: `View` (paint, padding, radius) + `Text` (D022); `alignSelf:'flex-start'` for inline-flex.

### 7.18 `TabBar`
Container `position absolute; left 0; right 0; bottom 0; height 104; flex row; align flex-start;
justify space-between; padding 14 14 0; border-box; z 8` — **no background, no border, no shadow**.
Items `width 72; column; align center; gap 4` → 26×26 icon (stroke 1.8, `fill none`) + label 11.5
(box h13): active **700 `#F2F0EC`**, inactive **400 `#9B968E`**; the icon stroke follows the label.
Middle: SOS disc `60×60 r30 #F2F0EC; flex center; margin-top −6` → "SOS" 13/700 **`#111111`** (kit:
`#FFFFFF`). Item centres x 50 / 126.25 / 196.5 / 266.75 / 343; icon tops 762; labels 792–805; SOS
disc 756–816.

| tab | icon geometry (viewBox 0 0 26 26) |
| --- | --- |
| Today | `M4 12.5L13 4l9 8.5V21a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 4 21z` (join round) |
| Log | `<rect x=5 y=3.5 width=16 height=19 rx=3>` + `M9 9h8M9 13h8M9 17h5` (cap round) |
| Library | `M13 6.5C11 5 8 4.5 4 4.5v15c4 0 7 .5 9 2 2-1.5 5-2 9-2v-15c-4 0-7 .5-9 2z M13 6.5v15` (join round) |
| Journey | `<circle cx=13 cy=10 r=6.5>` + `M9 15.5L7 23l6-3 6 3-2-7.5` (join round) |

Active per frame: Today → Today Home ×4; Log → Log Urges / Check-ins / Reports; Library → 24 week
covers; **Journey → Medallions, Medallions Still To Earn, Album Earned II AND Score Detail ×3**.
Detailed route mapping in `today-day.md §0.6`. RN: a custom `tabBar` for expo-router Tabs, background
transparent, height `70 + max(insets.bottom, 34)`; the 26px icons as `Svg`; `marginTop:-6` on the
SOS disc works in Yoga.

### 7.19 Today header + week strip (Today Home ×4)
Header row `left 24 right 24 top 64; flex; space-between; align center`: greeting 26/700/32/−0.7
nowrap; right group `gap 10` = streak pill (§7.17) + avatar `40×40 r20 ring #2E2E2E` with Person 22
outline. Week strip `left 24 right 24 top 136; flex; space-between` → 7 columns `column; align
center; gap 12`: label 12/400 mute (today 12/700 ink), disc 36×36 r18:
done `#F2F0EC` + Check 14 `#111111` (`box-shadow none`); today `transparent` + `0 0 0 1.5px #F2F0EC`
+ 14/700 ink; future `transparent` + `0 0 0 1.5px #2E2E2E` + 14/700 mute. **Kit `header()` /
`weekStrip()` (44×58 r14 cells, filled avatar) are not what the frames draw.**

### 7.20 `PagerDots`
`left 0 right 0 bottom 180; flex; justify center; gap 7` → 5 × `6×6 r3`; active `#FFFFFF`, others
`rgba(255,255,255,0.28)`. Active index: Urge Hub Now 1, Score 2, Proof 3, Surfed 4, Pledges 5 (the
five Urge Hub pages are one pager). **Kit draws the active dot 18 wide — frames keep all dots 6×6.**

### 7.21 `ToneScale` (feeling / mood)
Row `left 0 right 0 top 232 height 150; flex; center; gap 18` → discs 48×48 r24 (§2.4 ramp); the
selected one 64×64 r32 with the double ring. Label block `left 24 right 24 top 440; column gap 6;
centred`: 30/700/−0.6 (normal lh) + 15/24 sub. Frames: Morning Feeling, Night 1 Mood.

### 7.22 `IntensityScale` (SOS Strength, SOS Reassess, Urge Log Intensity; Morning Energy is 44-wide)
Bars row `flex; align flex-end; justify center; gap 14; height 150` → 5 bars `46 wide`, heights
46 / 72 / 98 / 124 / 150, `r15`, `padding-top 12`: off `#1E1E1E` + ring `#2E2E2E`; on `#F2F0EC`
(`box-shadow none`) with an 8×8 r4 `#1E1E1E` dot; labels row `gap 14` → `46 wide` 13/700 `#5A574F`
(selected ink). SOS Reassess shows the previous level as a `transparent` bar (124h, no ring). Morning
Energy differs: 44-wide bars r14 heights 50/75/100/125/150, and **every bar up to the chosen level
is ink** (`#F2F0EC`, `box-shadow none`; level 2 in the frame), the rest `#1E1E1E` + ring — a fill
meter, not a single-select.

### 7.23 Check discs
Ink fill + Check `#111111` (disc → glyph): 22 → 11 (Morning 1 Yesterday, Night 2 Record), 24 → 12
(week lesson rows), 26 → 13 (Enlisting Aegis step list) / 12 (Score Detail Ranks), 28 → 12 (lesson
done-when), 30 → 13 (Surf Complete chip), 32 → 13 (Yearly Drop), 34 → 14 (Paywall features), 36 → 14
(week strip), 40 → 16 (Weekly Report Days), 52 → 20 (Today Home Task), 84 r42 → 36 (Lapse Done, Slip
Logged, Urge Log Done), 96 r48 → 34 (lesson complete), 132 r66 → 56 (Morning 5 Done, Paywall
Confirmed). The one inverse: Paywall's selected-plan radio is a 22 r11 **`#1E1E1E`** disc with a 12
Check stroked `#F2F0EC` on the ink plan card. Hollow / pending: `26 r13 #1E1E1E + ring #2E2E2E`;
current: `+ ring #F2F0EC` with an 8×8 ink dot (Enlisting Aegis). Port as `<CheckDisc size glyph
inverse?>` (glyph viewBox stays `0 0 14 14`, stroke 2.2 in viewBox units).

### 7.24 Sheets & scrim
Scrim `position absolute; inset 0; background rgba(0,0,0,0.68); z 40` (covers the status bar). Panel
`left 0 right 0 top T bottom 0; border-radius 28 28 0 0; background #171717; z 41` → grabber
`left 50% top 10 40×4 margin-left −20 r2 #2E2E2E`; content `left 24 right 24 top 44 (bottom 0);
column; gap 12` (Sheet Sign Out gap 10). Buttons stay frame-level, `z 42`. T: Change Pledge Sheet
120, Sheet Edit Name 420, Sheet Profile Photo 512, Sheet Sign Out 556. **Kit `sheet()` (scrim
`rgba(17,17,17,0.5)`, panel `#0D0D0D`, gap 14) is not what the frames draw.** The underlying screen is
fully rendered beneath (the sheet frames contain the whole Edit Profile / Settings / pledge screen).
RN: a transparent `Modal` with `statusBarTranslucent` (or an in-tree overlay) so the scrim reaches
y 0; the panel is a `View` anchored by `top`. Letter Week XII's "paper" (`left 24 right 24 top 112
bottom 0; r 24 24 0 0; #1E1E1E; padding 34 28 0` + 190px fade) is a card, not a sheet.

### 7.25 Progress indicators
- **Nav dashes**: `flex; gap 6; align center` → 8 × `24×2 r1`, on `#F2F0EC`, off `#2E2E2E`
  (234 wide, centred: x 79.5). Active count `max(1, round(step/total·8))` (verified in `today-day.md`).
- **Lesson bar**: §7.2.
- **Tier bar** (Breakwater/Detail ×10): track `position absolute left 10% right 10% top 14 h2
  #2E2E2E`; fill `left 10% top 14 h2 width 20/40/60/80% #F2F0EC` behind 30px tier medals.
- **Spinner** (Enlisting Aegis): 88×88 svg — `circle r38 stroke #F2F0EC 2 dasharray "2 7"` + arc
  `M44 6 A38 38 0 0 1 82 44` stroke 4 round; static in the frame (rotate it in the app — the only
  loading visual the bundle draws). **Step list**: `column gap 18` → `flex gap 14` rows: done 26 ink
  disc + Check 13 + 16/700 ink; current 26 `#1E1E1E` + ring ink + 8 dot, 16/700 ink; pending 26
  `#1E1E1E` + ring `#2E2E2E`, 16/**400** mute.
- **Urge timer ring** (Urge Hub Now): svg 46/700 "17:42" — sos group.

### 7.26 `TimeWheel` + `DayToggles` (Morning/Nightly/Settings Check-in Time; Lapse/Slip/Urge Log When)
Wheel `position relative; height 220; flex; justify center; gap 10` → band `absolute left 40 right
40 top 88 h44 r14 #1E1E1E`; columns row `relative; flex; gap 12` → hour col 70 / minute col 70 /
am-pm col 60, each `column; align center` of 5 rows `height 44; flex; align center`: selected (2nd
index) 30/900 ink, ±1 22/400 mute, ±2 22/400 `#2E2E2E`; colon `height 220; flex; align center; 30/700
ink`. Matches kit. Day toggles `flex; space-between` → 7 × `42×42 r21 #F2F0EC; 14/700 #111111`
(Su M Tu W Th F Sa) — all on in every frame; kit off = `#1E1E1E` + ink text (inferred). Kit on-text
`#FFFFFF` — frames `#111111`. RN: a real wheel must snap to 44-row multiples and fade by distance
exactly as above; Your Plan / Today Home III use 42 discs as icon holders.

### 7.27 Text inputs (fake caret — there is no native-looking field in the bundle)
- **Name field** (V3 Q24 Name): `height 60; r18; #1E1E1E; padding 0 22; flex align center; gap 2` →
  caret `2×24 r1 #F2F0EC` then placeholder 17/400 mute "Your name".
- **Sheet field** (Sheet Edit Name): `height 60 r18 #1E1E1E padding 0 20; 18/700 ink` "Sam Reyes" +
  caret `inline-block 2×22 #F2F0EC margin-left 2`; helper 14/400/20 mute below.
- **Long-text cards**: Change Pledge Sheet (20/700/29, caret 2×22 `vertical-align −3px`), SOS
  Afterward (20/400/30, caret margin-left 3), Night 3 Reflection (no card: 22/400/34 ink, caret 2×24
  `vertical-align −4px`).
- RN: a `TextInput` styled with the same font, `padding`, `selectionColor/cursorColor #F2F0EC`,
  `placeholderTextColor #9B968E`, `underlineColorAndroid transparent`; on web set `outlineStyle:
  'none'`. The caret's 2px width is the platform's — the drawn caret is only a static frame's
  stand-in. For captures, focus state decides whether a caret shows; note it rather than faking it.

### 7.28 Charts (conventions only; each chart is owned by its screen's group)
Grid lines `stroke #2E2E2E width 1 dasharray "2 5"`; series line `#F2F0EC width 3, cap/join round`;
end marker `circle r7 fill #0D0D0D stroke #F2F0EC 3`; area fill `linearGradient` `#F2F0EC` 0.22 → 0;
axis labels SVG `<text>` 12/600 (→700) mute, the "now" label 12/700 ink `text-anchor end`. Dot fields
(Cost pages) are SVG circles. Score detail / urge overview / weekly report bars are divs (r6 12-high
bars, 12-wide `r6` columns in `rgba(255,255,255,0.28)` on dark). RN: `react-native-svg` with the same
attributes; `<Text>` in SVG with `fontFamily` set explicitly (`Lato_700Bold`) — SVG text does not
inherit the app font.

### 7.29 `Hero` (393×240 illustration wrapper)
Canvas: `<svg width=393 height=240 viewBox="0 0 393 240" style="position:absolute; left:0; top:T;
overflow:visible; transform:scale(s); transform-origin:196px 190px">`. s = 1.1 almost everywhere
(520×); per-frame fits elsewhere (0.723 Cue Hue Picker, 0.731 SOS Strength, 0.76 V3 Q3b, 0.869 Relapse
Resign / Slip Pledge, 0.877 V3 Q26, 0.954, 0.965, 0.989, 1.0, 1.062, 1.071, 1.075, 1.089). A point
(x, y) lands at **X = 196 + s·(x − 196), Y = T + 190 + s·(y − 190)**. Art overflows the viewBox
(`gen/hero-bounds.json` = [top, bottom, left, right]: e.g. sunrise x −40…432).
RN port (exact, no reliance on `overflow:visible`, which native SVG does not honour): choose bounds
(bx0, by0, bx1, by1) covering the art (e.g. −60, −40, 453, 280), render `<Svg width={(bx1−bx0)·s}
height={(by1−by0)·s} viewBox={`${bx0} ${by0} ${bx1−bx0} ${by1−by0}`} style={{position:'absolute',
left: 196 + (bx0−196)·s, top: T + 190 + (by0−190)·s}}>`. Inside a lesson frame the svg sits in a
`position:relative; width:393; height:176; margin:0 −32` box with `top:−36` etc. — same formula
relative to that box. Never `rotation/originX` props; inner `<g transform="translate(-6 0)">`
strings carry over verbatim.

### 7.30 Lesson reader primitives (kit-level; 1,273 frames)
- **Cover**: hero box (above), caps "Lesson N" `margin-top 36` 13/700/16/0.2 centred; title 30/36
  `margin-top 12`.
- **Section**: `lessonCaps` "Part N" + `margin-top 12` `lessonHeading` + `margin-top 28` body
  paragraphs (`margin-top 22` between) 18/28 sub.
- **Quote**: Quote glyph 28×22 `#5A574F` centred; `margin-top 24` 24/31/−0.4 centred balance;
  `margin-top 18` author caps centred.
- **Question**: caps "Question" + `margin-top 12` heading + `margin-top 8` 15/22 mute instruction +
  `margin-top 20` column `gap 8` of option rows: `min-height 48 r24 #1E1E1E; flex align center gap
  12; padding 13 16 13 14` → 24×24 marker (radio `r12`, checkbox `r7`; `box-shadow inset 0 0 0 1.5px
  #9B968E`; letter 12/700/16 `#B5B0A8`) + 16/400/22 ink. Compact variant `min-height 44 r22 padding
  11 16 11 14`. **No selected option row is drawn** in any frame (open question §10).
- **Split choice cards**: `flex 1 1 0; min-width 0; r18; #1E1E1E; padding 16` (caps + `margin-top 8`
  15/22 ink); selected `box-shadow inset 0 0 0 1.5px #F2F0EC`.
- **Timeline card**: `r20 #1E1E1E padding 20`; rows `flex gap 14` → 12-wide rail: dot `margin-top 5
  12×12 r6` (ink, or `border 2px solid #9B968E`, or `#1E1E1E` + that border), connector `flex 1; w2;
  margin-top 5; #5A574F`; text 15/22 ink, `padding-bottom 16` (0 on last); lesson tag pill (§7.17).
- **Table card**: `r20 #1E1E1E padding 6 20`; rows `flex gap 16 padding 12 0 10` (or `14 0`),
  `border-top` on rows 2+, label column 112 (64 / 44 variants).
- **Numbered steps**: `r18 #1E1E1E padding 16 18 gap 14` → 28 disc (r14) or square (r8) ink with
  13/700 `#111111` number.
- **Done when**: `margin-top 28; r20; #1E1E1E; padding 18 20; flex gap 14; align flex-start` → 28
  disc ink + Check 12; column `gap 4`: caps "Done when" + 16/700/22 ink.
- **Note chip**: `margin-top 32; height 48; r24; box-shadow inset 0 0 0 1.5px #2E2E2E; padding 0 20;
  gap 12` → Pencil 16 + 16/22 mute "Add a note (optional)".
- **Complete**: 96 disc + Check 34; `margin-top 36` title "Lesson complete."; `margin-top 14` 18/28
  sub centred; primary "Done".
- Margins between siblings are CSS `margin-top`s inside a flex column (no collapsing in flex — Yoga
  matches).

### 7.31 Medal tiers (30px, Breakwater/Detail/Tiers ×18 each) — matches kit `medal(tier, 30)`
Tier 0 paper: `circle r13 fill #0D0D0D stroke #F2F0EC 2` (dim: stroke `#5A574F` dasharray `3 6`);
1 bronze: r13 stroke 2.5 + `r10.8 stroke 1.5 dasharray 2 4`; 2 silver: r13 stroke 3 + r10.8 stroke
2; 3 gold: r13 fill ink + r11.1 stroke `#0D0D0D` 1.6; 4 platinum: r12.3 fill ink + 16 ticks (stroke
1.2) + inner ring. Unearned tiers `opacity 0.32`. The 64/84px album medals (dot rims, glyphs, 6.4/900
numerals) are drawn per medallion — medallions group.

---

## 8. Kit vs frames — every deviation found (the frame wins)

| kit (`mono-kit.js`) | frames | instances |
| --- | --- | --- |
| `frame()` noise `noise-dark.png` 0.06 | app frames `noise.png` 0.05 (lesson/dark frames do follow the kit) | 228 |
| frame shadow 0.09/0.14 | app frames 0.12/0.18 (chrome either way) | 228 |
| `options` label 16/400 | **15/400**; + `0 1px 2px rgba(0,0,0,0.04)` on V3 | 12 frames |
| `ghost` bottom 62 | **60** (48 / 56 alone) | 65 |
| `nextFab` chevron `#FFFFFF` | **`#111111`** | 3 |
| `tabBar` SOS label `#FFFFFF` | **`#111111`** | 37 |
| `segmented` selected text `#FFFFFF` | **`#111111`** | 14 |
| `dayToggles` on text `#FFFFFF` | **`#111111`** | 5 |
| `toggle` knob `#FFFFFF` | on-knob **`#1E1E1E`** | 2 |
| `avatar()` ink disc + white glyph | **outline ring `#2E2E2E` + stroked Person** | 4 |
| `header()` (streak left, centred title, avatar right) | greeting left 26/700/−0.7, streak + avatar right, top 64 | 4 |
| `weekStrip()` 44×58 r14 cells | label 12px + 36 discs (done ink+check, today ink ring, future line ring) | 4 |
| `pagerDots` active 18×6 | **all 6×6**, active `#FFFFFF` | 5 |
| `sheet()` scrim `rgba(17,17,17,0.5)`, panel `#0D0D0D`, gap 14 | scrim **`rgba(0,0,0,0.68)`**, panel **`#171717`**, gap 12/10 | 4 |
| `pager()` 66h range pill | not used | 0 |
| `moodFace()` | not used — tone discs | 0 |
| `listRows` 60h 16/400 | used only on Manage Subscription; settings use 54h 15/700 rows (`mono-misc rows`) | — |
| `card({outline})` transparent + ring | not used; outline cards are `#1E1E1E` + ring | — |
| `primary` | matches (sheets drop `letter-spacing:0.1px`) | 2 |
| `nav`, `h1`, `p`, `caps`, `grid2`, `chips`, `timePicker`, `medal(30)`, `iconCircle` | match | — |
| `mono-onboarding.js` light palette (`#17160F` …) | converted to dark in the frames except Cost By Age 80's chevron (`#17160F`) | 1 |

---

## 9. States: drawn vs not drawn

Drawn: option on/off · grid on/off · chip on/off · segmented (one selected, or none) · toggle **on
only** · day toggle **on only** · week-strip done/today/future · lesson rows done/current/upcoming ·
step list done/current/pending · intensity off/on/previous · tone discs + selected · dashes on/off ·
dots on/off · tab active/inactive · medal tiers earned/dim · nav light/dark · primary light/dark ·
spinner (static).
**Not drawn anywhere** (decide, record in DECISIONS, keep consistent): primary **disabled/pressed**,
toggle **off**, day toggle **off**, lesson option **selected**, lesson checkbox **checked**, chip /
option **pressed**, text-field **focus/error**, list **empty** states beyond what the screens draw,
network **error** states. Suggested defaults (kit-faithful, none invent a new colour): off toggle =
track `#2E2E2E` + knob `#F2F0EC`; off day toggle = `#1E1E1E` + 14/700 ink; selected lesson option =
the screen-level option's ink fill (`#F2F0EC` bg, marker inverted: `#111111` ring/letter); pressed =
opacity only if the app already uses one.

---

## 10. RN porting rules (apply everywhere)

1. **Fonts**: `sans(w)` / `sansItalic()` from theme.ts; never `fontWeight` alone. Italic 400 → 700
   italic face (§3.1).
2. **Line boxes**: explicit `lineHeight` from the frame, or `lhNormal(size)` (§3.2) where the frame
   says normal and position matters. A canvas `<span>` with paint is `View` + `Text` (D022).
3. **Rings**: `boxShadow` strings (§4); inset rings likewise. Not borders.
4. **Grids**: CSS grid → flex-wrap with computed widths; `repeat(10,1fr)` gap 10 → width
   `(W − 90)/10`, `aspectRatio 1`.
5. **Positions**: transcribe absolute `top/bottom/left/right` verbatim; status bar 54 is the inset
   (D009); bottom offsets from the frame edge (D026); margins don't collapse in Yoga (D023) — flex
   columns in the frames don't collapse either.
6. **SVG**: `react-native-svg` paths verbatim; an `Svg` with an absolutely-positioned sibling gets
   `position:'absolute', top:0, left:0` (BRIEF); transform strings, not `rotation` props; hero
   scaling via §7.29; SVG text needs an explicit Lato family.
7. **Images**: laurel mark via `Image tintColor="#FFFFFF" resizeMode="stretch"`; noise via `Grain`
   (`resizeMode="repeat"`), never `expo-image` (no repeat mode).
8. **Gradients**: `expo-linear-gradient` with `locations` equal to the CSS stops (`[0, 0.62, 1]`
   etc.); SVG gradients inside SVG.
9. **text-wrap**: no RN equivalent — fixed copy gets `\n` where the PNG breaks; dynamic copy gets a
   width constraint; verify against the PNG (BRIEF §6).
10. **nowrap**: do not use `numberOfLines` (truncates); size the container so it never wraps at 393 and
    check 375/360 widths for overflow.
11. **z-order**: siblings in DOM order, with z 4/5/6/8/40/41/42 as listed (§5); RN `zIndex` on the
    absolutely positioned siblings.
12. **Web parity extra**: the canvas root sets `-webkit-font-smoothing:antialiased`; the app does not
    (no `+html.tsx`). On macOS Chrome this changes glyph rasterisation (subpixel → grayscale). If
    glyph-edge residue shows in pxdiff, add it on web (orchestrator's call).

---

## 11. Proposed kit (`src/components/mono/`) and theme additions

`theme.ts` (orchestrator): keep `mono`; add `mono.groundDark #111111`, `mono.groundLetter #121212`,
`mono.sheet #171717`, `mono.scrim 'rgba(0,0,0,0.68)'`, `mono.onInkMuted 'rgba(17,17,17,0.6)'`, a
`dark` sub-palette (§2.3), `tone` ramp (§2.4), `illus` palette (§2.5), `ring` strings (§4),
`type` named styles (§3.3) as ready `TextStyle`s built from `sans()`, `lhNormal(size)` (§3.2) and
the layout constants (§5). Values are in `tokens.json`.

Components (one file each, or grouped): `Screen` (variant app/lesson/dark/letter, noise),
`NavBar`, `NavDashes`, `LessonChrome`, `LessonProgress`, `TitleHead`, `H1/Title/P/Caps` (or `T`
with a `v` prop), `PrimaryButton`, `GhostLink`, `NextFab`, `RingNext`/`IconCircle`, `OptionList`,
`Grid2`, `Chips`, `Card`, `RowGroup`/`Row`, `ListRows`, `Toggle`, `Segmented`, `Pill`, `TabBar`
(+ `TabIcon`s), `WeekStrip`, `TodayHeader`, `PagerDots`, `ToneScale`, `IntensityScale`,
`CheckDisc`, `Sheet` (scrim + panel + grabber), `TimeWheel`, `DayToggles`, `FieldCard` (input),
`Spinner`, `StepList`, `Hero`, `LaurelMark`, `MedalTier`, icons (`ChevronL/R/D`, `FabChevron`,
`CloseX`, `Check`, `Share`, `Flame`, `Person`, `Bolt`, `ArrowUp`, `Quote`, `Pencil`, `Apple`,
`Google`), lesson primitives (`LessonOption`, `ChoiceCard`, `TimelineCard`, `TableCard`, `StepCard`,
`DoneWhen`, `NoteChip`, `QuoteBlock`, `LessonComplete`).

---

## 12. Open questions and risks

1. **Undrawn states** (§9): toggle off, day toggle off, lesson option selected, disabled primary —
   pick the suggested defaults or ask; record in DECISIONS (D200+).
2. **Tab bar background**: none in the frames; scrolling content under the bar would show through.
   Either end scenes at the bar top (748) or paint ground+noise behind the bar; confirm per tab
   screen (`today-day.md` §0.6 makes the same point).
3. **Noise phase**: anchor at window (0,0); a layer below the safe area shifts the speckle (≤ 3/255).
4. **Cost By Age 80** back chevron `#17160F` is invisible — reproduce (frame wins) but it remains the
   only back affordance; flag to the user.
5. **Pure white** exists only on the 10 dark-variant frames; any kit literal `#FFFFFF` on a standard
   frame is a kit bug the frames already corrected (§8) — do not reintroduce it.
6. **text-wrap balance/pretty** cannot be reproduced generically in RN; every wrapping `h1`/`title`
   needs a PNG check, and narrow devices (375, 360) will break differently.
7. **Native vs web line metrics**: the comparison target is the web build; on iOS/Android an explicit
   `lineHeight` positions glyphs slightly differently — verify natively by eye.
8. **`-webkit-font-smoothing`** not set on the app's web root (§10.12).
9. **Hero overflow**: native SVG clips at its box; use the enlarged-viewBox formula (§7.29), not
   `overflow:visible`.
