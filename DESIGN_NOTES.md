# Design Notes

## Source of the design

The human provided **5 reference screenshots pasted into the build session** (not
dropped in `/design-references/`, which is why that folder only holds a README).
TODO(jerry): drop the actual image files into `/design-references/` so future
passes can sample exact pixels.

### What the references show

1. **Onboarding card ("Imprint"-style).** Dark slate-navy background; a large
   **serif** headline in white with a phrase emphasised in **sage green**; a white
   rounded note-card with a soft shadow and an orange line-chart; a coral calendar
   glyph; a white full-width pill "Continue" button with dark text. Status bar 21:06.
2–4. **"Journeys" modal ("Fabulous"-style).** White sheets, **bold rounded-sans**
   dark-navy headings ("The Passages", "The Return", "The Mountains"), grey-blue
   body text, pink monochrome landscape illustrations, and vivid gradient promo
   cards (purple→magenta, multicolour).
5. **Journey "Current" tab (Fabulous).** White bg; a **segmented pill** control
   (Current / All Journeys); a blue gradient hero card showing a large **completion
   %** and "events achieved"; circular journey nodes connected by dotted lines; a
   5-item bottom tab bar with a blue active accent.

## The conflict (build spec §6.5)

These are **two different visual languages** and cannot both be the one system:

| | Imprint ref (#1) | Fabulous refs (#2–5) |
|---|---|---|
| Field | dark slate-navy | light / white |
| Headlines | serif | bold rounded sans |
| Accent | sage green + coral | blue + multicolour, pink art |
| Mood | calm, editorial, premium | playful, gamified, bright |

**Resolution:** I took the **Imprint** language as primary — it best fits Tideline's
calm, anti-shame, ACT-grounded brief and the "tide/water" name. The **Fabulous**
references contributed *structure* ideas already present in the app: the segmented
pill control (Log tabs, journey Current/All), the bottom tab bar, the progress
hero, and the lesson-path/weeks list. No invariant is violated: the Fabulous "large
completion %" is treated as a **leading-indicator** surface, never a zero-reset
streak (invariant #1).

## Token inventory (applied → `src/lib/theme.ts`)

Hex values are **sampled by eye** from the references and marked approximate.

| Token | Value | From |
|---|---|---|
| `bg` | `#222E36` | Imprint navy field |
| `surface` / `surfaceAlt` | `#2B3942` / `#31404A` | adapted: Imprint's white note-card → dark elevated card (see note) |
| `text` / `textMuted` / `textSoft` | `#F2F0EA` / `#C3CBCF` / `#939DA3` | warm off-white on dark |
| `accent` | `#7CB093` (sage) | Imprint's emphasised headline green |
| `accentText` | `#15201A` | dark text on the green button |
| `event.lapse` | `#A99BC0` (soft lavender) | **invariant #2** — deliberately not red |
| display font | serif (`Georgia` iOS / `serif`) | Imprint serif headlines |
| body font | platform system sans | — |
| `radius.lg` / `radius.xl` | 18 / 24 | the references' generous card rounding |
| card | dark surface + hairline border + soft shadow | references' elevated cards |

### Adaptation note
The Imprint reference uses **white cards on a navy field**. Mixing white cards
(needing dark text) with on-navy white text would require context-aware text colours
— a refactor risky to do unsable/un-previewed overnight. So cards became **dark
elevated surfaces**, giving the whole UI one consistent light-on-dark text colour.
This keeps the palette faithful while staying robust. Revisiting white cards (with a
surface-aware `AppText`) is a clean future step.

## Self-comparison (build spec §6.3)

Honest status: the design pass was validated by **`npx tsc --noEmit` (clean)** and
**`npx expo export --platform ios` (clean, 1783 modules)** — i.e. it compiles and
bundles. It was **not** visually diffed against the references in a running simulator
this session, because the app's native modules (Clerk, secure-store) require a dev
build (`npx expo run:ios`) rather than Expo Go. The palette/typography choices are
reasoned from the references and the contrast is light-on-dark throughout (no
low-contrast traps), but a side-by-side visual pass on device is the recommended
next step. Everything visual lives in `src/lib/theme.ts`, so tuning is one file.

## Still TODO (visual)
- Load the exact reference serif (looks Tiempos/Lora-ish) via `expo-font`.
- Real icons for the tab bar + cards (currently neutral geometric placeholders).
- Decide white-card vs dark-card treatment with a surface-aware text colour.
- Sample exact hex from the image files once they're in `/design-references/`.
- Pull in the coral/illustration accents from the references where they fit.
