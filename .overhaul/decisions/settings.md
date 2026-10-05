# settings decisions — Vici Overhaul run, Phase 1 (D290–D299)

Files: `src/app/(app)/settings.tsx`, `src/app/profile.tsx`, `src/app/vow.tsx`, `src/app/privacy.tsx`,
`src/app/applock.tsx`, `src/app/backtap.tsx`, `src/app/(app)/all.tsx`, `src/app/(app)/support.tsx`.
Seeds: `.overhaul/settings-seed.js` (premium + 10-of-12 history), new `.overhaul/settings-profile-seed.js`
and `.overhaul/settings-vow-dated-seed.js` (clock-pinned). Drives: `.overhaul/drives/settings-func-*.js`.
Recipes: `.overhaul/recipes/settings.json`. Captures and strips: `.overhaul/shots/settings/`.

## D290 — The settings rows are the kit's `RowGroup`/`Row`/`Toggle`; nothing is group-local
settings.md §11 planned a group-local 54-row kit; CRITIC C3 moved it to `mono/rows.tsx`, and every
screen here is built from it (Settings, Edit Profile, the photo sheet, Data & privacy, App lock, Back Tap,
All). No local `Section`/`Row`/`Divider`/`Toggle` survives. Supersedes the per-group row heights
(52/48/50/46), the inset hairlines and the paper cards of D118-era Settings.

## D291 — D118, D119, D121 (shelf half) and the `from=settings` visual variants are obsolete
`Sheet Sign Out`'s backdrop is exactly today's `Settings` (whole composite 0.00 %), so D118 is gone on
both halves. The vow page has no signature stamp (D119): the stamp, its `signedOnDay` derivation, the sun
halo, the serif line and the script signature are removed. Edit Profile's medallion shelf is replaced by
the Journey card's `Medallions · N of 12` row, read from `src/lib/album.ts` `useAlbumStanding()` — the
album's own ledger, so the profile and the Medallions page cannot disagree (the shelf's 8-face maths is
deleted). `Weekly reports` moves from Anchors to Reminders as `Weekly report` (frame) and still opens the
report (CRITIC §5); Edit Profile's own `Weekly reports` line is removed (Settings carries the door).
The Settings Weekly Report / Check-in Time boards are the logs / paywall-reminders boards unchanged;
this group keeps only the `?from=settings` wiring (Back and Save return to Settings — driven).

## D292 — `Manage subscription`'s value is the active plan's name, else nothing
`Yearly` / `Monthly` / `Lifetime` (Subscription's own words) while the membership is active; a free
account shows the chevron alone, as the row did before this drop (settings OQ4; no copy invented).

## D293 — Username and Email draw their chevrons and stay display rows
CRITIC §5 (settings Q2): the frame draws chevrons; nothing edits either field, so the rows have no button
role. Name is the one control (it opens the name sheet). The monogram disc is a second door to the photo
sheet (`Profile photo`); the words `Change photo` stay the first.

## D294 — "Re-sign the vow" re-signs, after a confirmation in the sign-out sheet's shell
The frame draws the ghost and nothing after it (OQ 1, CRITIC D-20); the page before this drop had no
re-sign control at all. Re-signing writes a new journal entry `{ tag: 'Vow', title: 'Vow', body: <the
words on the page> }`; the page reads the newest Vow (else the newest Pledge), so `Signed` becomes today
and `Held for` restarts — "It resets the promise, never the progress": no entry is removed or rewritten.
The new entry is an ordinary journal entry, like the morning pledge: it is listed in Past pledges (as
`Vow`) and counts toward the album's Archive (entries) and Vidi (days with a record) — re-signing is
writing something down. A vow already signed today has nothing to restart, so a second `Sign it again`
the same day writes nothing (no Archive inflation by repeated taps; driven: 2 Vow entries after two
confirms on one day). On an account with no Vow and no Pledge the page shows the canvas's sentence as
the vow, as it did before this run (`vow?.body ?? PLACEHOLDER`); re-signing stores exactly the words the
confirmation was given over. The root cause is outside this group: onboarding's `The Vow` (tail,
`O3TheVow`) signs without storing anything. Because one tap would otherwise restart the count, the
ghost opens a confirmation: the `Sheet Sign Out` shell (T 556, gap 10, pill at 96, ghost at 60) with
`Re-sign the vow?` / `It resets the promise, never the progress.` / `Sign it again` / `Cancel` — every
string is already on this page, the slip flow's pledge board, or the photo sheet; no new copy. **Needs the
user's approval** with the other undrawn-state strings (CRITIC D-20).

## D295 — Edit Profile's name sheet edits a draft; the row shows the saved name
Before, the row read the unsaved draft, so a dismissed edit still showed. Now opening the sheet copies the
saved name into the draft; Save writes it (`updateProfile`) and closes; the scrim, Escape, a downward drag
and Android back close without saving. The row keeps `accessibilityLabel="Name, <name>"` (recipes).

## D296 — Pinned clocks remove two data residues the previous run excused
Edit Profile's `Started VICI · 14 Mar 2026` with `Week VI` (D121) holds on 19 Apr 2026; Your Vow Page's
`Held for 92 days` with `Signed Apr 18` holds on 19 Jul 2026. The group's two dated seeds pin those days
(`.overhaul/clock.js`), so both frames diff 0.00 % with the app reading its own live data. D120's Night
9:30 PM (Settings) vs 10:30 PM (Check-in Time) remains a canvas contradiction: `DEFAULT_ROUTINES` is
untouched and each capture seeds its frame's value.

## D297 — Short phones and dynamic copy
Settings, Your vow, Back Tap, Find support: the column between the fixed nav and the fixed bottom control
is a `ScrollRegion` (D320 rule 3); at 393 × 852 Settings fits flush (`paddingBottom 16` = the frame's 17 to
the ghost, less a point) and nothing scrolls. **Your vow** follows `HeroBoard`'s rule (D368) for the flag:
flag and stack rise together within the flag's room above 108 (25 pt), and past it the flag goes. With the
flag gone the stack is **centred in the band it frees** (nav foot 100 → 16 above the ghost, never above
108) instead of rising by the deficit alone: the deficit-only lift left ~180 pt of bare ground over the
card on a 667 phone with the vow pressed onto the ghost (verifier). At 375 × 667 the card now starts at
canvas 190 (90 under the nav's foot, 106 over the ghost). Like `HeroBoard`, flag and stack stay at
opacity 0 until the stack is measured, so a short phone never paints the unlifted layout for a frame
(rAF log: first painted frame is already the final one). Phones from 390 × 844 up draw the frame as is.
**Sheet Sign Out**: its body names the account's own address, and the kit `Sheet` keeps the panel's drawn
height, so an address past ~45 characters wrapped a third line under the pill. Settings measures the body
and raises the panel by what it adds beyond the drawn two lines (`SHEET_TOP.signOut − lift`): the 12 pt
over the pill holds at every length and width (up to the kit's canvas-60 ceiling), and at the frame's address nothing moves (0.00 %). The
pre-drop sheet grew in flow the same way. Edit Profile, Data & privacy and App lock fit 375 × 667 (App
lock scrolls 8 pt). Dynamic values (`Name`, `Username`, `Email`, `Current week`, the plan, All's notes)
ellipsise (`valueLines`, CRITIC C11); fixed copy never does.

## D298 — Unframed screens: Back Tap, Find support, All
Copy is each screen's own (CRITIC G12; straight apostrophes made curly). **Back Tap** after App Lock: 76
ink disc with the app's wave glyph in `#111111`, centred line, `Shortcut link` as one settings row (tap
copies; value `Copy`/`Copied`), the four steps in a ruled `#1E1E1E` r20 card, footnote 13/19 (the shield
glyph dropped — no frame draws one), `Open Shortcuts app` primary at 96 + `Test it now` ghost (was a
secondary button); the column stops 16 above the pill. **Find support** after Data & privacy: nav back
row, h1 + line, the two placeholder resources as r20 cards (still visibly `[PLACEHOLDER]`), the build
note as the footnote, `Back` as the ghost at 48. **All** in the Settings idiom with its own back row —
the drawer left the tab bar (D385), so without one a long press on Today led into a page with no exit.

## D299 — Toggles: the kit's frame-variant on state and D322's off state
Pause analytics and the three App-lock switches are kit `Row toggle=` rows (the row is the switch, role
`switch`, `aria-checked`); ON = ink track + `#1E1E1E` knob (frames), OFF = `#2E2E2E` track + ink knob at
left 3 (D322). Every switch writes through `useUpdateSettings` as before (driven: flips and stores).

## Verification (393 × 852, Lato loaded, strips looked at)

| frame | pxdiff | residue |
| --- | --- | --- |
| Settings | 0.00 % (0 px) | — |
| Sheet Sign Out | 0.00 % (0 px, status bar ignored) | — (a long address raises the panel, D297) |
| Edit Profile | 0.00 % (2 px) | — |
| Sheet Profile Photo | 0.00 % (0 px) | — |
| Sheet Edit Name | 0.01 % | the drawn 2×22 caret (D364) |
| Your Vow Page | 0.00 % | — (flag drawn) |
| Data Privacy | 0.00 % (4 px) | toggle track edge AA |
| App Lock | 0.00 % (6 px) | toggle track ends AA |
| Settings Check-in Time (via Settings) | 0.00 % | paywall-reminders' board |
| Settings Weekly Report (via Settings) | 0.01 % | logs' board, reached by tapping the Settings row on logs' dated seed; the `W` day label sits ~0.5 px right |
