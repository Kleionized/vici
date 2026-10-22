# 97 · SOS — Urge or Relapse — spec

Source: `Vici UI 2/project/Email Login.dc.html`, section SOS — ENTRY, artboard `SOS Chooser` (row `app__293`). New in this bundle.
App: `src/app/sos.tsx` (route `/sos`), opened by the tab bar's SOS disc (`SOS_ROUTE`). Drawings: `src/content/sosChooserArt.ts` (generated, `scripts/vici-ui-2/gen-chooser.mjs`). Harness: `view=chooser`.

| element | value |
|---|---|
| frame | 393 × 852, `#0D0D0D`, grain `noise.png` 0.05 |
| nav row | top 60, h 40, padding 0 22, space-between: an empty 36 × 40 slot; ✕ in a 36 × 40 slot, right-aligned (svg 18, stroke `#F2F0EC` 2, round caps) — the kit's `NavBar left="empty" right="close"` |
| block | left 24 right 24 top 120, column gap 20 |
| heading | "What's happening?" 26/700 ls −0.6 lh 33 `#F2F0EC` balance |
| cards | column gap 12; each h 288, r 22, `#1E1E1E`, padding 18 20 20, column |
| drawing | flex 1, centred; svg 100 % wide (305), 100 % tall capped at 176, `xMidYMid meet`; urge `74 50 244 169` (hourglass on a shelf with a phone), relapse `68.1 80 255.9 139` (dominoes on a shelf) |
| text row | row, centre-aligned, gap 12: column flex 1 gap 4 — title 20/700 ls −0.3 (line-height normal, 24) `#F2F0EC`; line 14/400 lh 20 `#9B968E`; chevron svg 14 `M5 2l5 5-5 5` stroke `#5A574F` 2 round |
| card 1 | "An urge" · "It's here and you haven't acted on it" → `/urge` |
| card 2 | "A relapse" · "It already happened. Stop it here." → `/slip` |

States: the cards' press state is the kit's `Tap` press scale. No disabled or loading state.
