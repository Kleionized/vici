# Group `settings` — analysis (Vici Overhaul)

Frames (bundle `Email-Login`, split files in `.overhaul/final/Email-Login/`):
`Settings`, `Edit-Profile`, `Sheet-Profile-Photo`, `Sheet-Edit-Name`, `Settings-Weekly-Report`,
`Settings-Check-in-Time`, `Your-Vow-Page`, `Sheet-Sign-Out`, `Data-Privacy`, `App-Lock`.

Design PNGs: `.overhaul/shots/design/Email-Login/<Frame>.png`. Layout signatures (all ten now exist):
`.overhaul/sig/d-Email-Login-<Frame>.txt` — `Sheet-Edit-Name` and `Sheet-Sign-Out` were captured
this pass. Diff an app capture with `node scripts/overhaul/sigdiff.mjs d-Email-Login-<Frame> <app-sig>`.

All y below are **canvas y**; "app y" = canvas y − 54 for top-anchored boxes (D009). Bottom-anchored
boxes (`ghost`, `primary`, sheet pills) are measured off the frame's own bottom edge (D026) and keep
their canvas `bottom` value. Every frame is Lato only: 400 / 700 (+ one 700 italic). Weight →
family via `sans('700')`; the italic is `sansItalic()`.

---

## 0. The headline findings

1. **Two of the ten frames are byte-identical copies of frames another group owns.**
   `Settings-Weekly-Report` (93D) `diff`s empty against `Weekly-Report` (91C, group **logs**), and
   `Settings-Check-in-Time` (92B) `diff`s empty against `Nightly-Check-in-Time` (19C, group
   **paywall-reminders**, see `paywall-reminders.md` §7). This group owns only the **wiring**
   (Settings rows → `?from=settings` routes); both boards must render **identically** whichever way
   they are entered, so the `from=settings` *visual* variants the app carries today (back word
   "Settings", reassurance note) are withdrawn — the *navigation* (`back()` to Settings, Save returns
   to Settings) stays.
2. **`Sheet-Sign-Out`'s backdrop is now exactly the current `Settings`** (body diff = the sheet
   only). DECISIONS **D118 is obsolete on both halves** (no stale 93D header, no stale Settings
   backdrop). **D119** (vow signature stamp) is obsolete — the stamp/signature block is gone.
   **D120** is obsolete (paywall group: the wheel is now drawn straight). **D121**'s shelf half is
   obsolete (the medallion shelf is gone); its Journey-card contradiction **persists** (§2).
3. **The rows these frames use are not the kit's `listRows`.** All of them (Settings, Edit Profile,
   the photo sheet, Data & privacy, App lock) use `mono-misc.js`'s **local** `rows()`/`group()`:
   54-tall rows, `padding 0 18`, 15/700 labels, 14/700 `#9B968E` values, an `ART #5A574F` chevron,
   radius **20** (kit `listRows` is 60 tall, 16/400 labels, radius 22, `MUTE` chevron). No frame
   outside this group draws the 54-row variant (grep: only these 7 files), so build it as a
   **group-local kit** (`src/components/settings/kit.tsx`, §11).
4. **The frame overrides the kit in several places — the frame wins**, listed so nobody "fixes" back
   to the generator: sheet scrim `rgba(0,0,0,0.68)` and sheet ground **`#171717`** (kit: `rgba(17,17,17,0.5)` /
   `#0D0D0D`); toggle knob **`#1E1E1E`** on an `#F2F0EC` track (kit: `#FFFFFF` knob); App-lock disc
   glyph **`#111111`** with an `#F2F0EC` keyhole (kit: white glyph, ink keyhole); avatar letter and
   vow "Held for" pill text **`#111111`** (generator: `#FFFFFF`); Edit Profile's week value
   **"Week VI, Discipline"** (generator: `VI · Discipline`); the vow page's **flag** art is the
   `Lesson-Illustrations-v4/Flag` art (ground −40…433), not kit `H.flag`.
5. **New functionality drawn:** Your-Vow-Page ends on a **"Re-sign the vow"** ghost link the app does
   not have (OQ 1). Edit Profile's Journey card gains a **Medallions · N of 12** row (the 12-face
   album count `milestones.tsx` computes; the profile's 8-face shelf maths must not be reused, §2).
   Settings' Account row carries the **plan** ("Yearly").

---

## 1. `Settings` (FLOW `92 · Settings`)

**Where today.** `src/app/(app)/settings.tsx` (`Settings`, local `Section`, `Row`, `Divider`,
`SignOutSheet`). Route `/settings` (tab-group route; `StoicTabBar.NO_BAR` hides the bar on it).
Entry: Today header avatar (`accessibilityLabel="Open settings"`, `today.tsx:141` →
`/(app)/settings`), All → "Settings".

**Reach.** `/settings`, `--initseed=.overhaul/settings-seed.js`, `--wait=2000` (recipe
`.overhaul/recipes/settings.json`). In-app: `/today` → `await tap('Open settings')`.
**Seed change needed:** the `Manage subscription · Yearly` value needs a premium account — add
`settings.premium: true` to the seeded user (mock `PurchasesProvider` derives `plan: 'yearly'` from it).
The seed already writes routines 8:00 AM / 9:30 PM (the frame's values).

**Today in the app** (captured this pass): paper-era layout half-remapped by the theme — dark
ground but **white** cards (`#FFFFFF` hard-coded), "‹ Back" + a 27/600 "Settings" title at
canvas 114 (rendering `#1D1C1A` on `#0D0D0D`, nearly invisible), time values in `#EDECE7` pills,
`Weekly reports` in Anchors, `Sign out` as a third row inside the Account card.

**What the frame draws** (`d-Email-Login-Settings.txt`):
- `frame` (ground `#0D0D0D`, `noise.png` tiled, opacity 0.05), light status bar.
- `nav({ title: 'Settings' })`: row `top 60, height 40, padding 0 22`, `space-between`; left slot
  36×40 with **chevronL** (svg 12×20 at 22,70, `M10 2L2 10l8 8`, stroke `#F2F0EC` 2.2, round caps
  & joins); centre title **"Settings" 13/700 `#9B968E` nowrap** (box 172.8,72 47.3×16 — centred
  because both slots are 36); right slot 36×40 empty.
- `stack(120, gap 18)`, `left/right 24` — four `group()`s, each = `caps(title)` (13/700 `#9B968E`
  nowrap, `width:100%` box, line box 16) + `gap 10` + `rows()` card:
  - card: `radius 20`, bg `#1E1E1E`, `overflow hidden`.
  - row: `height 54`, `padding 0 18`, flex row `space-between`, `align center`, `gap 12`; every row
    after the first has `border-top: 1px solid #2E2E2E` **on top of** its 54 (CSS content-box ⇒
    the row box is **55**: in RN write `height: 55, borderTopWidth: 1` or a 1px `#2E2E2E` View +
    54 row). Label 15/700 `#F2F0EC` nowrap (line box 18, at row-top + 18); right cluster
    `gap 10`: value 14/700 `#9B968E` nowrap (line box 17, at +18.5) + **chevronR** svg 14×14
    `M5 2l5 5-5 5`, stroke **`#5A574F`** width 2 round (at x 337, y row-top + 20). Values end at
    x 327; chevrons end at 351.
  - groups (canvas → app y):

    | group | caps y | card y..y | rows (label · value) |
    | --- | --- | --- | --- |
    | Reminders | 120 (66) | 146..310 (92..256) | Morning check-in · `8:00 AM` / Night check-in · `9:30 PM` / **Weekly report · `Every Sunday`** |
    | Anchors | 328 (274) | 354..463 (300..409) | Your vow · — / Your letter · `Opens Week XII` |
    | Privacy | 481 (427) | 507..616 (453..562) | App lock · `Face ID` / Data & privacy · — |
    | Account | 634 (580) | 660..769 (606..715) | Edit profile · — / Manage subscription · **`Yearly`** |
- `ghost('Sign out', bottom 48)`: full-width centred block, **15/400 `#9B968E`** (box 0,786 393×18).
  17pt below the Account card's foot.

**What must change.**
- Paper/`Grain noise-dark 0.07` → kit Frame (ground + `noise.png` 0.05); `<StatusBar style="light" />`.
- Header: "‹ Back" (`#55534E` 17/400) + 27/600 title → kit `Nav` with chevron only + centred 13/700
  caption. Remove the `height: 104` header block.
- Groups: caption 13/600 `#55534E` shrink-wrapped at x 16 → 13/700 `#9B968E` at x 24 (full width);
  cards `marginHorizontal 12, radius 16, #FFFFFF, paddingVertical 4` → `left/right 24, radius 20,
  #1E1E1E`, no vertical padding; per-group row heights 52/48/50/46 → **54 everywhere** (+1 border);
  inter-group gaps 21/20/… → **18**; hairline inset 18 → **full-width** `#2E2E2E` border.
- Row type: 16/500 `#1D1C1A` → 15/700 `#F2F0EC`; detail 13/400 `#8B8882` → 14/700 `#9B968E`;
  time **pills** (`#EDECE7` 32-tall chip, 15/600) → plain value text; chevron `#B0AEA8` → kit
  chevronR `#5A574F`.
- Structure: **move "Weekly reports" out of Anchors into Reminders as its third row and rename it
  "Weekly report"** (`Weekly reports` → `Weekly report`); Anchors becomes two rows.
- `Manage subscription` gains a value: `usePurchases().membership` → `Yearly` / `Monthly` /
  `Lifetime` (same mapping as `subscription.tsx`'s `planName`); not premium → OQ 4.
- `Sign out`: 44-tall centred 15.5/600 `#8B8882` row inside the Account card → **ghost at
  `bottom 48`**, 15/400 `#9B968E`, outside every card.
- Short phones: content ends at 804 with the ghost; on 375×667 (inset 20, 647pt of app height) the
  stack alone runs app 66..715. Use the scroll-with-min-height frame (content `minHeight = window −
  topInset`; nav + stack in flow at their canvas offsets; `flex: 1` spacer with `minHeight 17`;
  ghost with `marginBottom 48`) — identical at 852, scrolls on 667. The nav scrolls with the
  content (the canvas draws no bar behind it).

**Preserve.** Every row's navigation: Morning → `/routines/morning-time?from=settings`, Night →
`/routines/night-time?from=settings`, Weekly report → `/weekly-report?from=settings`, Your vow →
`/vow`, Your letter → `/letter?variant=week12`, App lock → `/applock`, Data & privacy → `/privacy`,
Edit profile → `/profile`, Manage subscription → `/subscription`. Live time values
(`formatTime(useRoutines().morning|night)`). Back: `router.back()` or `replace('/(app)/today')`.
Loading state (`user === undefined` → `LoadingView`, now on ground). Sign out opens the sheet (§8).
`accessibilityRole="button"` on rows; the ghost keeps the text "Sign out" (recipes tap it by text —
it must remain the **first** "Sign out" in DOM order, ahead of the sheet's pill).

---

## 2. `Edit Profile` (FLOW `93 · Edit Profile`)

**Where today.** `src/app/profile.tsx` (`Profile`, `ProfileSheet`, `SheetRow`, `ActionLine`,
`Section`, `FieldLine`; medallion shelf via `@/components/keepsakes/Medallion`). Route `/profile`.
Entry: Settings → Edit profile; All → "Edit profile".

**Reach.** `/profile`, `--initseed=.overhaul/settings-seed.js`, `--wait=2000`.

**What the frame draws** (`d-Email-Login-Edit-Profile.txt`):
- `nav({ title: 'Edit profile' })` — caption box 164.4,72 64.3×16.
- `stack(124, gap 18)`:
  1. avatar block (`flex column, align center, gap 12`): disc **96×96 `radius 48` bg `#F2F0EC`**,
     centred letter **"S" 38/700 `#111111`** (flex-centred, line box ≈46) at 148.5,124 (app 70);
     "Change photo" **14/700 `#F2F0EC`** (box 152.9,232 87.3×17; app 178). No pencil badge.
  2. spacer `height 4` (267..271).
  3. `rows()` card at **289..453** (app 235..399): `Name · Sam Reyes ›`, `Username · @sam ›`,
     `Email · sam@example.com ›` — **all three** draw value + chevronR.
  4. `group('Journey')`: caps at 471 (app 417); card **497..661** (app 443..607):
     `Started VICI · 14 Mar 2026` (**no chevron** — `right: ''`, value ends at 351),
     `Current week · Week VI, Discipline` (**no chevron**), `Medallions · 10 of 12 ›`.
- Nothing below; no bottom control. Fits 375×667 without scrolling (ends app 607 + 20 = 627).

**What must change.**
- Frame/status bar as §1. Header "‹ Back" + 27/600 "Edit profile" → `Nav` caption.
- Monogram: 88pt `#EDECE7` disc, 28/600 `#55534E` letter, **pencil badge** (30pt `#131313` disc) →
  96pt `#F2F0EC` disc, 38/700 `#111111` letter, **no badge**. "Change photo" 14.5/600 `#1D1C1A`
  `marginTop 12` → 14/700 `#F2F0EC` (gap 12). The block was 152 tall → 125 + spacer.
- Identity card: fixed 86pt label column (13.5/400 `#8B8882`) + value (14.5/500) at 46 tall →
  **settings rows** (label 15/700 ink left, value 14/700 mute right + chevron), 54/55 tall.
- **Remove the Medallions shelf section** (coins, `+N` chip, `KKMedallion` imports) — replaced by the
  Journey card's `Medallions` row (value `${earned} of ${total}` + chevron → `/(app)/milestones`,
  the shelf's old destination).
- **Remove the `Weekly reports` ActionLine** from Journey (Weekly report now lives in Settings →
  Reminders, §1).
- Journey rows: `FieldLine record` (15/400 `#55534E` label, 15/600 value, 46 tall) → settings rows.
- Copy: Current week `${roman} · ${name}` → **`Week ${roman}, ${name}`** ("VI · Discipline" →
  "Week VI, Discipline").
- Started date: keep `14 Mar 2026` form, but **assemble it** (`${d} ${monthShort en-US} ${yyyy}`)
  as `subscription.tsx` does — `toLocaleDateString('en-GB', {month:'short'})` prints **`Sept`** for
  September, which the canvas's three-letter convention never does.
- **Medallions count:** the frame's `10 of 12` is the 12-face album (`KK_ALBUM`, `Medallions` frame
  "10 of 12 earned"). `profile.tsx`'s shelf maths covers only 8 faces with simplified counts
  (e.g. `veni` hard-wired earned, `rebound` = "any lapse") and would disagree with the album page.
  Lift `milestones.tsx`'s `COUNT` + `KK_ALBUM.map(kkStanding)` into a shared hook (e.g.
  `src/lib/album.ts → useAlbumStanding(): { earned, total }`) and consume it in both files
  (coordinate with group **medallions-letters**, which owns `milestones.tsx`).

**Preserve.** Back → `back()` / `replace('/(app)/settings')`. "Change photo" opens the photo sheet
(recipes tap the text `Change photo`; make the avatar disc a second trigger if desired). The Name
row opens the name sheet and keeps `accessibilityLabel={\`Name, ${name || 'not set'}\`}` (recipe
taps `Name, Sam Reyes`). Empty-name placeholder (`Your name`) and offline account
(`Email · Offline account`) values, derived `@username`. Medallions row → `/(app)/milestones`.

**Data note (carried from D121).** `Started VICI · 14 Mar 2026` and `Current week · Week VI` still
cannot hold for one account (the canvas's "today" is ~19 Jul 2026 — `Jul 14–20` on the report,
`Signed Apr 18` + 92 days on the vow — and 14 Mar is week 19 → capped XII). Keep D121's ruling:
the seed holds the week (36 days back) and the date reads its own value. The seed must also earn
**exactly 10 of the 12** album faces for `10 of 12` (borrow `.overhaul/medallions-seed.js`'s
history, which the medallions recipe measured at "10 of 12 earned").

---

## 3. `Sheet Profile Photo` (FLOW `93B`)

**Where today.** `profile.tsx` → `<ProfileSheet open={photoOpen} title="Profile photo">` (RN
`Modal`, transparent, `animationType="slide"`) with three `SheetRow`s and a Cancel pill.

**Reach.** `/profile` + `--do="await __sleep(1500); await tap('Change photo'); await __sleep(900)"`.

**What the frame draws** (backdrop = `Edit Profile` exactly; `d-Email-Login-Sheet-Profile-Photo.txt`):
- scrim: `position absolute; inset 0` (whole 852 frame, status bar included), **`rgba(0,0,0,0.68)`**.
- sheet: `left/right 0, top 512, bottom 0` ⇒ **height 340, bottom-anchored**;
  `border-radius 28 28 0 0`; bg **`#171717`**; **no shadow**.
- handle: `left 50%, top 10, 40×4, margin-left −20, radius 2, #2E2E2E` (176.5,522).
- content: `left/right 24, top 44, bottom 0`, column, **gap 12**:
  1. h1 "Profile photo" **22/700/−0.6/lh 28** `#F2F0EC` (balance; 1 line) at 556.
  2. spacer `height 2` (596..598).
  3. `rows()` card at **610..774** (`radius 20`, `#1E1E1E`): `Take photo`, `Choose from library`,
     `Remove photo` — **label only** (empty right cluster: no chevron, no value); `Remove photo`
     label **`#9B968E`** (muted), the other two `#F2F0EC`.
- "Cancel": `position absolute; left/right 0; bottom 56`, centred **15/700 `#9B968E`** (box
  0,778 393×18) — z above the sheet; 4pt under the card.

**What must change.** Sheet `#F4F3F0` r24 with `0 -12px 40px` lift → `#171717` r28, no lift. Scrim
`rgba(19,19,19,0.45)` → `rgba(0,0,0,0.68)`. Handle 36×5 r3 `rgba(19,19,19,0.15)` → 40×4 r2
`#2E2E2E`. Title centred 17/600 → left h1 22/700/−0.6/28 at sheet-local 44. Rows: centred 16/500
labels at 52 tall in a white r16 card with inset hairlines → left 15/700 labels, 54/55 rows,
`#1E1E1E` r20 card, full-width `#2E2E2E` borders. "Remove photo" `#A4613C` (rust) → `#9B968E`.
Cancel: 50-tall outlined pill (`boxShadow 0 0 0 1.5px`) → **plain text** at `bottom 56`. Remove
`SafeAreaView edges={['bottom']}` + `paddingBottom 30` arithmetic — the sheet is a fixed 340 from
the frame's bottom (D026: no home-indicator inset).

**Preserve.** Scrim tap closes (`accessibilityLabel="Dismiss"`, web `outlineStyle: none`); each of the
three rows closes the sheet (they do nothing else today — no photo pipeline exists; unchanged);
Cancel closes; `onRequestClose` (Android back) closes.

---

## 4. `Sheet Edit Name` (FLOW `93C`)

**Where today.** `profile.tsx` → `<ProfileSheet open={nameOpen} title="Name">` with an autofocused
`TextInput`, helper line, and an ink Save pill (`save()` → `updateProfile(name)` → close).

**Reach.** `/profile` + `--do="await __sleep(1500); await tap('Name, Sam Reyes'); await __sleep(900)"`.

**What the frame draws** (`d-Email-Login-Sheet-Edit-Name.txt`, captured this pass):
- same scrim + sheet shell as §3 with `top 420` ⇒ **height 432**; handle at 430.
- content `top 44` (464), **gap 12**:
  1. h1 "Name" 22/700/−0.6/28 `#F2F0EC` (464..492).
  2. field: `height 60, radius 18, bg #1E1E1E, display flex, align center, padding 0 20`, text
     **18/700 `#F2F0EC`** "Sam Reyes" (text x 44) followed by a drawn caret `inline-block 2×22
     #F2F0EC margin-left 2` (131.6,523) — field box 24,504 345×60. **No ring.**
  3. helper p "Shown on your vow and your letters." **14/400/lh 20 `#9B968E`** (576..596).
- Save pill: `left/right 24, bottom 48, height 58, radius 29, bg #F2F0EC` (746..804); label
  **16/700 `#111111`**, **no letter-spacing, no nowrap** (unlike kit `primary`'s 0.1) — span
  179.8,765.5 33.5×19.

**What must change.** Shell as §3. Field: 54-tall white r16 with `0 0 0 1.5px rgba(0,0,0,0.14)` ring,
16.5/500 `#1D1C1A` → 60-tall `#1E1E1E` r18 no ring, `paddingHorizontal 20`, **18/700 `#F2F0EC`**.
Caret: the canvas draws a 2×22 ink bar; use the platform caret coloured ink (`selectionColor` /
`cursorColor` `#F2F0EC`, web `caretColor`) — its width cannot be set (risk R4). Placeholder colour
`#B0AEA8` → `#9B968E` (auth-funnel's name field convention). Helper 12.5/400 `#8B8882` `marginTop 8`
→ 14/400/20 `#9B968E` with gap 12. Save: 54-tall `#131313` pill in flow (`marginTop 16`, 17/600
white) → **bottom-anchored** 58/29 `#F2F0EC` pill at sheet-bottom 48, 16/700 `#111111`.

**Preserve.** `autoFocus`, `onChangeText` draft, `save()` (await `updateProfile`, then close), scrim
/ back closes without saving, web `outlineStyle: none` on the input. **Keyboard:** with the pill
pinned 48 off the bottom, the native keyboard covers it — wrap the sheet in a keyboard-avoiding
container (iOS `behavior="padding"`) so the pill rides above the keyboard; at rest (web/capture)
geometry must equal the frame (R3).

---

## 5. `Settings Weekly Report` (FLOW `93D · Weekly report`)

**The frame is byte-identical to `Weekly-Report.html` (91C, group logs).** Nothing in it belongs to
this group except the entry.

**Where today.** `src/app/weekly-report.tsx` (owned by **logs**), entered from Settings with
`router.push('/weekly-report?from=settings')`. Today `from === 'settings'` swaps the back word
"Back" → "Settings" (`backLabel`, line 52).

**Reach.** `/settings` + `--do="await __sleep(1500); await tap('Weekly report'); await __sleep(1600)"`
— **the tap label changes** from `Weekly reports` to `Weekly report` (recipe update). Same seed.

**What the frame draws** (for reference; spec lives in `logs.md`): nav with chevronL only (no word)
and, in the right position, a date chip **"Jul 14–20"** (`height 32, radius 16, #1E1E1E, padding 0
14`, 13/700 `#F2F0EC`, box 286.3,64 84.7×32); h1 **"Weekly report" 32/700/−0.6/38** at 108;
`segmented(['Score','Days','Urges'], 0)` at `left/right 16, top 164` (44 tall, r22, `#1E1E1E`,
pad 4; selected `#F2F0EC` r18 with **`#111111`** text 13/700 — the kit's segmented writes `#FFFFFF`,
frame wins); score "1,240" 64/700/−2.2/lh 67 + "+12 this week" 15/400/22 `#9B968E` centred at 236;
a 330×140 polyline chart at `left/right 32, top 352` (stroke `#F2F0EC` 3, hollow dots r4.5
`#0D0D0D`/`#F2F0EC` 2.5, last dot solid r6.5, day letters 12 — weights **600 → Lato 700**,
**800 → Lato 900** for the last "S").

**What must change for this group.** Nothing to draw. Ask logs to **drop `backLabel`** (the frame
has no back word on either entry) while keeping `back()`; keep `?from=settings` as a no-op-safe
param (harmless, and it documents the entry). If logs drops the param handling entirely, Settings
can push `/weekly-report` bare.

**Preserve.** Settings → report → Back returns to Settings (`router.back()`).

---

## 6. `Settings Check-in Time` (FLOW `92B · Night check-in time`)

**The frame is byte-identical to `Nightly-Check-in-Time.html` (19C, group paywall-reminders).**
Full spec: `paywall-reminders.md` §7 (h1 with explicit `\n` after "the", 5-row flat wheel on a 44
pitch, band `#1E1E1E` r14 at 64..329 × 366..410, `:` column, 42pt day discs, `primary('Save time')`
at `bottom 48`). Wheel parks on **10:30 PM**.

**Where today.** `src/app/routines/night-time.tsx` (+ `src/components/routines/kit.tsx`,
`wheel.tsx`), entered from Settings with `?from=settings`; today that param adds the back word
"Settings" and the reassurance `note` ("Set it for the start of your riskiest hours — you can
change this any time.").

**Reach.** `/settings` + `--do="await __sleep(1500); await tap('Night check-in'); await __sleep(1500)"`,
`--initseed=.overhaul/settings-checkin-seed.js` (parks 10:30 PM). Or `/routines/night-time?from=settings`.

**What must change for this group.** Nothing to draw. The paywall-reminders group already plans to
remove `backLabel`/`note` from `RoutineShell` and keep the `fromSettings` navigation — that is
exactly what this frame needs. The recipe note about "back label + reassurance line" is obsolete.

**Preserve.** `Save time` saves time + days and `back()`s to Settings (not `replace('/today')`);
Back → `back()` / `replace('/(app)/settings')`. The morning row's `/routines/morning-time?from=settings`
is the undrawn twin (renders as `Morning Check-in Time`, 8:00 AM).

**Contradiction (carried from D120's last paragraph).** `Settings` writes Night `9:30 PM`; this
frame parks the wheel on `10:30 PM`. Keep `DEFAULT_ROUTINES.night = 10:30 PM` and seed per frame,
as before.

---

## 7. `Your Vow Page` (FLOW `92C · Your vow`)

**Where today.** `src/app/vow.tsx`. Route `/vow`. Entry: Settings → Your vow; `slip.tsx:506`; All.

**Reach.** `/vow`, `--initseed=.overhaul/settings-vow-seed.js` (Jerry, vow signed 92 days back at
local midnight), `--wait=1800`. The pill `Signed Apr 18` will read the seed's own date (today −
92 d) unless the capture fakes the clock — a known data residue, or move the seed's signing date
and accept `Held for N` ≠ 92 (OQ 6).

**Today in the app:** "‹ Settings" + 27/600 title; a 170pt gold **sun halo** (two radial gradients
+ glow shadow); the vow in the **serif** (`fonts.quote` 20/32, balance) at 296; the name in the
**script** face 44pt rotated −3°, an "×" and a rule, a `Mon D · Day N` stamp (D119); "Held for N
days." 13/500 text; closing line 13/19.

**What the frame draws** (`d-Email-Login-Your-Vow-Page.txt`):
- `nav({ title: 'Your vow' })` — caption box 169.3,72 54.5×16.
- **Hero `flag`** (`data-hero="flag"`; identical to `Lesson-Illustrations-v4/Flag`, also used by
  Goal-Confirmation, V3-Q15, Week VI): `<svg viewBox="0 0 393 240" width 393 height 240>` at
  `left 0, top 104` (app **50**), `overflow visible`, `transform: scale(1.1)`,
  `transform-origin 196px 190px` ⇒ `<G transform="translate(196 190) scale(1.1) translate(-196 -190)">`
  (x' = 1.1x − 19.6, y' = 104 + 1.1y − 19). Rendered bounds −19.6..412.7 × 85..349 (ground rect
  reaches −63.6..456.7 and is clipped by the frame). Paint order:
  1. `<path d="M-40 190 V184 C 10 160, 92 146, 152 172 C 180 186, 212 188, 240 176 C 300 150, 382 158, 433 182 V190 Z" fill="#55524D">` (far hills)
  2. cloud `<g fill="#55524D">`: circles (70,76,r9) (82,71,r12) (96,76,r9) + rect x68 y76 30×9 rx4.5
  3. cloud `<g fill="#55524D">`: circles (300,66,r8.1) (310.8,61.5,r10.8) (323.4,66,r8.1) + rect x298.2 y66 27×8.1 rx4.05
  4. `<rect x=-40 y=188.25 width=473 height=3.5 rx=1.75 fill=#F2F0EC>` (ground line)
  5. tufts: `M96 190 l-3 -8 M96 190 v-11 M96 190 l3 -8` and `M296 190 …` stroke `#F2F0EC` 1.6 round
  6. pole `<rect x=144 y=52 width=5 height=138 fill=#F2F0EC>`, finial `<circle cx=146.5 cy=50 r=4.5>`
  7. flag `<path d="M149 58 C 180 50, 210 66, 249 58 L 231 82 L 249 106 C 210 114, 180 98, 149 106 Z" fill="#F2F0EC">`
  Use the shared hero module (`<Hero id="flag" top={50} scale={1.1} />`, library.md §7.3) — do
  not hand-port. The `<Svg>` must be `position: absolute` (SVG trap) and allow overflow.
- `stack(340, gap 16)` (app 286):
  1. `card` `radius 24`, bg `#1E1E1E`, `padding 26 26 24` (24,340 345×229; app 286..515); inner
     column `align center, text-align center, gap 16`:
     - quote mark svg 28×22 `M2 12c0-6 4-10 10-10v4c-3 0-5 2-5 5h5v9H2zM16 12c0-6 4-10 10-10v4c-3 0-5 2-5 5h5v9H16z`
       fill **`#2E2E2E`** (182.5,366).
     - vow **23/700/−0.4/lh 32 `#F2F0EC`**, centred, **no `text-wrap`** (greedy — AppText's web
       default `pretty` must be overridden with `textWrap: 'wrap'`) in the 293 column: 3 lines
       `I’m done letting the wave` / `decide. One evening at a time,` / `I take the watch back.`
       (50,404 293×96).
     - name **"Jerry" 24 Lato 700 italic** `#F2F0EC`, line-height normal (29) — `sansItalic()`
       (171.3,516 50.4×29).
  2. pills row `justify center, gap 10` (585..621; app 531..567): `height 36, radius 18, padding 0 14`,
     13/700 nowrap — **"Held for 92 days"** bg `#F2F0EC` text **`#111111`** (75.9, w 122.2) and
     **"Signed Apr 18"** bg `#1E1E1E` text `#F2F0EC` (208.1, w 109).
  3. p **14/400/lh 21 `#9B968E`** centred, pretty: `After a relapse you can re-sign the vow. It resets the`
     / `promise, never the progress.` (637..679).
- `ghost('Re-sign the vow', bottom 48)` 15/400 `#9B968E` (0,786 393×18).

**What must change.**
- Remove: sun halo + glow, serif vow line, script signature + rotation, "×", rule, `stamp`
  (`Mon D · Day N`) and its D119 derivation (`signedOnDay`), "Held for N days." text line.
- Add: flag hero; vow card with quote glyph; Lato 23/700 vow; Lato 700-italic first name; two pills;
  ghost link.
- Copy: `Held for ${held} ${held === 1 ? 'day' : 'days'}.` → **no trailing period**
  (`Held for 92 days`); new `Signed ${MMM D}` (`toLocaleDateString('en-US', { month: 'short', day: 'numeric' })`
  → "Apr 18"); closing line unchanged (14/21 now, was 13/19).
- Short phones: content ends 679 and the ghost sits at 786; on 667 the ghost (app top 581) would
  land on the closing line (ends app 625 + 20) → scroll-with-min-height frame as §1. A long
  user-written vow grows the card — same mechanism keeps it clear of the ghost.

**Preserve.** Vow text = newest `Vow` entry, else `Pledge`, else the placeholder (the frame's own
sentence); name = first word of `displayName` (fallback `You`); `held` frozen at mount; Back →
`back()` / `replace('/(app)/settings')`. **New:** "Re-sign the vow" must do something (OQ 1).

---

## 8. `Sheet Sign Out` (FLOW `92D`)

**Where today.** `settings.tsx` → `SignOutSheet` (absolute overlay inside the screen, not a Modal).

**Reach.** `/settings` + `--do="await __sleep(1500); await tap('Sign out'); await __sleep(900)"` (the
ghost is the first "Sign out" in DOM order; the sheet's pill is second and would sign out).

**What the frame draws** (`d-Email-Login-Sheet-Sign-Out.txt`, captured this pass; backdrop =
`Settings` exactly, so the whole composite is now comparable):
- scrim + shell as §3, `top 556` ⇒ **height 296**; handle at 566.
- content `top 44` (600), **gap 10**:
  1. h1 "Sign out?" **24/700/−0.6/lh 30** `#F2F0EC` (600..630).
  2. p "Your log, letters and medallions stay saved to sam@example.com." **15/400/lh 23
     `#B5B0A8`**, left, pretty → 2 lines (`…stay saved to` / `sam@example.com.`) (640..686).
- pill "Sign out": `left/right 24, bottom 96, height 58, radius 29, bg #F2F0EC` (698..756), label
  **16/700 `#111111` nowrap, no letter-spacing** (167.6,717.5 57.8×19).
- "Stay signed in": `left/right 0, bottom 60`, centred **15/400 `#9B968E`** (774..792).

**What must change.** Shell as §3 (was `#F4F3F0` r24 + lift, scrim `rgba(19,19,19,0.45)`, 36×5
handle). Title centred 17/600 `#1D1C1A` → **left** h1 24/700/30. Body centred 14.5/21 `#55534E` with
`paddingHorizontal 12` → **left** 15/23 `#B5B0A8`. Pill 54-tall `#131313` 17/600 white in flow →
58/29 `#F2F0EC` 16/700 `#111111` at `bottom 96`. "Stay signed in" 15/500 `#8B8882` in flow
(`marginTop 14`) → 15/400 `#9B968E` at `bottom 60`. Drop the `SafeAreaView edges={['bottom']}`.

**Preserve.** Only the pill signs out (`await signOut()` → `router.replace('/')`); scrim and "Stay
signed in" close; email fallback `this device`; scrim web `outlineStyle: none`; the full-width
"Stay signed in" target.

---

## 9. `Data Privacy` (FLOW `94 · Data & Privacy`)

**Where today.** `src/app/privacy.tsx` (`Privacy`, `Section`, `Row`, `Divider`, `Toggle`). Route
`/privacy`. Entry: Settings → Data & privacy; All.

**Reach.** `/privacy`, `--initseed=.overhaul/settings-seed.js` (sets `pauseAnalytics: true` — the
frame draws only ON), `--wait=1600`.

**What the frame draws** (`d-Email-Login-Data-Privacy.txt`):
- `nav({ title: 'Data & privacy' })` — caption box 153.6,72 85.7×16.
- `stack(120, gap 16)`:
  1. h1 **"Yours, and only yours."** 26/700/−0.6/33 `#F2F0EC` balance (1 line; 120..153).
  2. p "Your journal, urges and log stay on your device and your private account. We never sell your
     data, ever." 15/400/24 `#B5B0A8` pretty → `…on your device and` / `your private account. We
     never sell your data, ever.` (169..217).
  3. spacer `height 2` (233..235).
  4. `group('Your data')`: caps 251; card 277..441: `Export my data · JSON ›`, `Privacy policy ›`,
     `Terms of service ›`.
  5. `group('Controls')`: caps 457; card 483..592: `Pause analytics` + **toggle ON**;
     `Delete account ›` with label **`#9B968E`** (muted).
  6. footnote 13/400/lh 19 `#9B968E` pretty: `Deleting your account erases your journal, urges and log`
     / `permanently. This can’t be undone.` (608..646).
- **Toggle (frame variant):** `50×30, radius 15, bg #F2F0EC`; knob `absolute top 3 right 3, 24×24,
  radius 12, bg #1E1E1E` (track 301,495; knob 324,498). Centred in the 54 row (12 top).
- Fits 667 without scrolling (ends app 592 + 20).

**What must change.**
- Header "‹ Settings" + 27/600 "Data & privacy" title → `Nav` caption "Data & privacy".
- **Remove** the inset `#EDECE7` promise panel with the shield glyph; **add** the h1 and the p.
- **Copy:** `Your journal, urges and Life Map stay on your device and your private account. We never
  sell your data, ever.` → `Your journal, urges and log stay …` ; footnote `Deleting your account
  erases your journal, urges and Life Map permanently. This can&apos;t be undone.` → `… urges and
  log permanently. This can’t be undone.` (**`Life Map` → `log` twice; ASCII `'` → `’`**).
- Rows → settings rows (54/55, 15/700, 14/700 values, `#5A574F` chevron, r20 `#1E1E1E`);
  `Delete account` label → `#9B968E`.
- Toggle 44×26 `#131313`/`colors.borderStrong`, 20pt knob → **50×30**, ON `#F2F0EC` track +
  `#1E1E1E` knob; OFF per OQ 3.
- Footnote `marginHorizontal 28`, 13/18.5 `#8B8882` → `left/right 24`, 13/19 `#9B968E`, gap 16.

**Preserve.** `Pause analytics` toggles `settings.pauseAnalytics` via `useUpdateSettings` (role
`switch`, `accessibilityState.checked`), read by `purchases/revenuecat.tsx`. The other four rows
are inert today (no handlers) — keep them inert unless OQ 5 says otherwise. Back → `back()` /
`replace('/(app)/settings')`.

---

## 10. `App Lock` (FLOW `95 · App Lock`)

**Where today.** `src/app/applock.tsx` (`AppLock`, `Section`, `Row`, `Divider`, `Toggle`, `flag()`).
Route `/applock`. Entry: Settings → App lock; All.

**Reach.** `/applock`, `--initseed=.overhaul/settings-seed.js` (sets the three flags true),
`--wait=2000`.

**What the frame draws** (`d-Email-Login-App-Lock.txt`):
- `nav({ title: 'App lock' })` — caption box 171.1,72 50.7×16.
- icon row `left/right 0, top 124, justify center` → `iconCircle(lockIcon, {size 76, fill})`:
  disc **76×76 radius 38 bg `#F2F0EC`**, no ring (158.5,124; app 70). Glyph svg 30×30 (181.5,147):
  `<rect x=6 y=13 width=18 height=13 rx=3.5 fill=#111111>`,
  `<path d="M10 13V9.5a5 5 0 0 1 10 0V13" fill=none stroke=#111111 stroke-width=2.6>` (butt caps),
  `<circle cx=15 cy=19.5 r=2 fill=#F2F0EC>` (keyhole).
- `stack(222, gap 14)` (app 168):
  1. h1 **"Only opens for you."** 26/700/−0.6/33 **centred** (222..255).
  2. p "This work is personal. Keep VICI behind Face ID so it opens only for you." 15/400/24
     `#B5B0A8` **centred**, pretty → `…behind Face ID so it` / `opens only for you.` (269..317).
  3. spacer `height 4` (331..335).
  4. `group('Lock')`: caps 349 (left-aligned); card 375..539: `Require Face ID` + toggle ON,
     `Lock when I leave the app` + toggle ON, `Ask after · Immediately ›`.
  5. `group('Privacy')`: caps 553; card 579..633 (one 54 row): `Hide sensitive previews` + toggle ON.
  6. footnote 13/400/19 `#9B968E` left, pretty: `Hides journal previews and entry titles in
     notifications and` / `the app switcher.` (647..685).
- Fits 667 (ends app 631 + 20 = 651).

**What must change.**
- Header "‹ Settings" + 27/600 "App lock" → `Nav` caption.
- Disc 92pt `#131313` with the **Face-ID corner-bracket glyph** (40×40) → 76pt `#F2F0EC` disc with the
  **padlock** glyph above (art replaced, not restyled).
- **Add** h1 "Only opens for you." Body 14/20 `#55534E` `marginHorizontal 40` → 15/24 `#B5B0A8`
  full 345 width, centred.
- Rows/toggles/footnote as §9 (toggle 50×30 frame variant; footnote 13/19 `#9B968E`).
- Gaps: 26/34/32/20 → stack gap 14 + spacer 4.

**Preserve.** The three switches write `appLockFaceId` (default false), `appLockOnLeave` (default
false), `hideSensitivePreviews` (default true) through `useUpdateSettings`, role `switch` +
`checked`. `Ask after · Immediately` is inert today (keep). Back → `back()` /
`replace('/(app)/settings')`. (Nothing in the app enforces the lock yet — out of scope, unchanged.)

---

## 11. Implementation plan for this group

**Group-local kit — new file `src/components/settings/kit.tsx`** (owned by this group; nothing else
draws these variants):
- `SettingsGroup({ caps, children })` — `Caps` (13/700 `#9B968E` nowrap) + `gap 10` + card.
- `SettingsCard` — `borderRadius 20`, bg `#1E1E1E`, `overflow hidden`.
- `SettingsRow({ label, value?, chevron = true, muted?, right?, onPress?, first? })` — 54 (+1 top
  border `#2E2E2E` when not first), `paddingHorizontal 18`, `gap 12`, label 15/700 (`#9B968E` when
  `muted`), right cluster `gap 10`: value 14/700 `#9B968E` + `ChevronR` (`#5A574F`). Value
  `numberOfLines={1}` + `flexShrink: 1` so long values ellipsise on 375 instead of overflowing (R1).
  Accessibility: `button` when `onPress`; `switch` + `checked` when `right` is a toggle.
- `SettingsToggle({ on })` — frame variant 50×30 (ON: `#F2F0EC` track, `#1E1E1E` knob right 3).
- `SettingsSheet({ open, height, onClose, children, footer })` — **unless the orchestrator adds the
  kit `Sheet`** (preferred: `Change-Pledge-Sheet`, group today-day, uses the identical shell —
  scrim `rgba(0,0,0,0.68)`, `#171717` r28, handle 40×4 `#2E2E2E` at 10, content `left/right 24 top 44`).

**Screens:** rewrite `settings.tsx`, `profile.tsx`, `vow.tsx`, `privacy.tsx`, `applock.tsx` on kit
`Frame` + `Nav` + `Stack` + `H1`/`P`/`Caps`/`Ghost`/`Primary` + the local kit above. Remove
`Grain noise-dark`, `BackGlyph`/`ChevronGlyph`, all `#FFFFFF`/`#1D1C1A`/`#55534E` literals,
`StatusBar style="dark"`.

**Recipes** (`.overhaul/recipes/settings.json`): Weekly report tap label → `Weekly report`;
Settings Check-in Time note (back label/reassurance) obsolete; Sheet Sign Out note (stale backdrop,
D118) obsolete — whole composite now comparable; Your Vow Page note (D119 stamp, sun disc) obsolete;
Edit Profile note (coin row) obsolete — needs the 10-of-12 history; `settings-seed.js` +
`premium: true`.

**DECISIONS to record (D2xx):** D118/D119/D121-shelf superseded; the 54-row family is group-local;
the frame's toggle/sheet/disc colours over the kit's; vow re-sign behaviour (OQ 1); toggle OFF
(OQ 3); Manage-subscription value when free (OQ 4); Username/Email chevrons (OQ 2); the persisting
Started-vs-week contradiction (D121) and Night 9:30 vs 10:30 (D120 tail).

---

## 12. App screens / states in this area that no frame draws

| screen / state | where | closest frame analog | notes |
| --- | --- | --- | --- |
| Settings loading (`user === undefined`) | `settings.tsx` → `LoadingView` | Settings (ground only) | Theme-driven spinner on ground; keep. |
| `Manage subscription` value: monthly / lifetime / not premium | `settings.tsx` | Settings | `Monthly`/`Lifetime`; free → OQ 4. |
| `Morning check-in` from Settings | `/routines/morning-time?from=settings` | Morning Check-in Time | paywall-reminders §7; renders identical to onboarding's board. |
| Weekly report Days / Urges pages, empty week | `/weekly-report?from=settings` | Weekly Report Days / Urges | logs group. |
| Edit Profile: no name / no email (offline) / long email / long week name | `profile.tsx` | Edit Profile | `Your name` muted? (value `#9B968E` already); `Offline account`; ellipsise (R1). |
| Edit Profile: Medallions `0 of 12` | `profile.tsx` | Edit Profile | Same row. |
| Name sheet: empty field (placeholder), keyboard up | `profile.tsx` | Sheet Edit Name | placeholder `#9B968E`; keyboard-avoid (R3). |
| Photo sheet: (actions are no-ops) | `profile.tsx` | Sheet Profile Photo | unchanged behaviour. |
| Toggle OFF (App lock ×3, Pause analytics) | `applock.tsx`, `privacy.tsx` | App Lock / Data Privacy | OQ 3. |
| Vow: no vow entry (placeholder sentence), `Held for 1 day`, `Held for 0 days`, long vow | `vow.tsx` | Your Vow Page | singular "day"; card grows; scroll frame. |
| Vow re-sign confirmation / result | `vow.tsx` | Sheet Sign Out (sheet idiom) | OQ 1. |
| `/backtap` (All → Back Tap) | `src/app/backtap.tsx` (uses `SettingsTopBar`, `Card`, `IconChip`, `Button`) | **App Lock** (Nav caption "Back Tap", 76 disc + h1 + p, numbered steps as settings rows or a `card`, copy-link row, `primary('Open Shortcuts')`) | Unowned by any group; it is a settings sub-page, so this group should take it. Keep copy/clipboard + `shortcuts://` + `→ /urge-hub` behaviours. |
| `/(app)/support` (All → Find support, invariant #5) | `src/app/(app)/support.tsx` (`Screen`, `Header`, `Card`, `Button`) | **Data & privacy** (h1 + p + rows) | Unowned; crisis placeholders must stay visibly placeholder. |
| `/(app)/all` (review drawer, `SHOW_ALL_TAB`) | `src/app/(app)/all.tsx` | **Settings** (caps + 54-row groups, chevron, `numberOfLines` details) | Not a canvas screen; orchestrator decides owner. It already says it is "built in the Settings idiom" — reuse the local kit. |
| Sign-out in progress | `settings.tsx` | — | Sheet closes, `signOut()`, `replace('/')`. Unchanged. |

---

## 13. Shared files this group needs to touch or depends on

- `src/app/weekly-report.tsx` (**logs**) — drop `backLabel` (frame has no back word); keep `from`.
- `src/app/routines/night-time.tsx`, `morning-time.tsx`, `src/components/routines/kit.tsx`
  (**paywall-reminders**) — drop `backLabel`/`note` for `from=settings`; keep the navigation.
- `src/app/(app)/milestones.tsx` (**medallions-letters**) — extract the album standing maths into a
  shared hook (`src/lib/album.ts` suggested) for the profile's `N of 12`.
- `src/lib/routines.ts` (paywall-reminders proposes morning default 8:00 AM) — read only here.
- `src/lib/purchases` — read only (`usePurchases().membership`).
- `src/content/curriculum84.ts` (generated) — read only (`weekFor(n).roman/.name`).
- Orchestrator: `src/components/mono/*` (kit), `src/lib/theme.ts`, `src/components/StoicTabBar.tsx`
  (`NO_BAR` must keep `/settings`), shared hero module (`flag`).
- Recipes/seeds: `.overhaul/recipes/settings.json`, `.overhaul/settings-seed.js`,
  `.overhaul/settings-vow-seed.js`.

## 14. Kit components needed (`src/components/mono/*`)

`Frame` (ground + `noise.png` 0.05; light status bar; scroll-with-min-height mode so bottom-anchored
ghosts fall into flow on short phones), `Nav` (chevronL 12×20 in a 36×40 slot at 22; centred
13/700 `#9B968E` caption; empty right slot), `Stack`, `H1` (26/33 default, 22/28, 24/30; `center`;
balance on web), `P` (15/24, 15/23, 14/21, 14/20, 13/19; `center`; pretty — plus a `wrap` escape),
`Caps`, `Ghost` (`bottom`), `Primary` (`bottom`; a `tracking={0}` option for the two sheet pills),
`ChevronR` (colour param — `#5A574F` here), `ChevronL`, `Card` (r24 pad 26/26/24), `Sheet` (frame
shell, see §11), `Hero` (`flag`), `IconCircle` (76 filled disc), a 36-tall `Pill` (filled / card),
`Toggle` if the kit wants it shared (frame variant).

---

## 15. Open questions / contradictions

1. **"Re-sign the vow" has no behaviour in the app and no frame for what follows** (Your Vow Page).
   Recommended: re-sign in place — write a new journal entry `{ tag: 'Vow', title: 'Vow', body:
   <current vow text> }` (the tag `vow.tsx` already reads first), so `Signed <today>` /
   `Held for 0 days` update immediately — "It resets the promise, never the progress." Optionally
   confirm first with a sheet in the §8 idiom (h1 "Re-sign the vow?", p, primary "Re-sign", ghost
   "Not now") — unauthored copy, needs a ruling. Alternative: route to a standalone `The Vow` board
   (tail group's `O3TheVow`), whose Sign currently writes nothing.
2. **Username and Email rows draw chevrons, but nothing edits them** (Edit Profile). Options: keep
   them inert with the drawn chevron (pixel parity; a dead-looking affordance), or omit the chevron
   (functional honesty; parity loss of two 14×14 glyphs). Recommended: **draw the chevrons, keep
   both rows inert (no `button` role), record a D2xx.**
3. **Toggle OFF state is never drawn** (App Lock, Data Privacy). The frame's ON variant inverts the
   kit's knob to `#1E1E1E`. Recommended OFF: kit track `#2E2E2E`, knob at `left 3` in **`#9B968E`**
   (a `#1E1E1E` knob vanishes on `#2E2E2E`; the kit's `#FFFFFF` appears nowhere else in this palette).
4. **`Manage subscription` value when not subscribed** (Settings draws only `Yearly`). Recommended:
   no value, chevron only (or `Free`); `Monthly` / `Lifetime` per plan.
5. **Export / Privacy policy / Terms / Delete account / Ask after are inert** and the frame draws
   them as navigable rows. Out of scope for a UI overhaul — keep inert unless the product says
   otherwise.
6. **Vow sample date vs seed.** `Held for 92 days` + `Signed Apr 18` only coexist on 19 Jul. Seed for
   92 days (date pill differs by data) — or fake `Date` in the capture. Record which.
7. **`Edit Profile` Journey contradiction persists** (D121): `Started VICI 14 Mar 2026` with `Week VI`.
   Keep D121's ruling (hold the week).
8. **`Settings` Night `9:30 PM` vs `Settings Check-in Time` wheel `10:30 PM`** persists (D120 tail).
   Keep 10:30 PM default; seed per frame.
9. **Weekly report row's meaning.** The row sits under *Reminders* with `Every Sunday`, suggesting a
   reminder schedule, but the frame labelled `93D · Weekly report` is the report board itself. No
   schedule screen exists → the row opens the report (as today).
10. **Generator vs frame** (frame wins; listed in §0.4) — sheet scrim/ground, toggle knob, App-lock
    glyph colours, avatar/vow-pill text colour, week value format, flag art.

## 16. Risks

- **R1 Long values on 375 wide.** `Current week · Week II, Changing Your Mindset` (~210pt of 14/700)
  plus the 92pt label overflows a 327 row; long emails likewise. CSS `nowrap` would overflow; RN
  must `numberOfLines={1}` + `flexShrink` the value (ellipsis), never the label.
- **R2 Short phones.** Settings and Your vow overlap their bottom ghost at 667 unless built on the
  scroll-with-min-height frame. Edit Profile, Data & privacy and App lock fit (≤ 651 of 667).
- **R3 Keyboard vs the name sheet's Save** (bottom 48) on native.
- **R4 Caret.** The frame draws a 2×22 bar with 2pt margin; the platform caret is ~1–2pt and blinks —
  expect a residue in the caret column of `Sheet Edit Name` (recipe already notes it).
- **R5 SVG on web.** The flag `<Svg>` shares a parent with absolutely-positioned siblings → must be
  `position: absolute; top: 0; left: 0` or it renders invisible while the signature passes.
- **R6 `Modal` animation.** `animationType="slide"` slides the scrim with the sheet; captures must
  wait (900ms) and the scrim should ideally fade. Web `Modal` portals to the window — fine (the
  scrim covers the status bar, as the frame does).
- **R7 Medallion count drift** if the profile computes its own count instead of sharing
  `milestones.tsx`'s maths.
- **R8 Recipe label drift**: `tap('Weekly reports')` → `Weekly report`; `tap('Sign out')` must still
  hit the ghost first (keep it before the sheet in render order).
- **R9 Text wrap on web.** AppText defaults to `pretty`; the vow body has no `text-wrap` (greedy) —
  pass `textWrap: 'wrap'`; h1s want `balance`; verify every multi-line break against the PNGs
  (Data-Privacy p/footnote, App-Lock p/footnote, vow body/closing, sign-out body).
