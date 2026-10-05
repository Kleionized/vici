# slip — analysis for the `Vici Overhaul` implementation pass

Group: **slip** (31 frames, all in `Email-Login`): the twelve-board post-slip flow `98A–98L` and its
nineteen response cards `99A–99H` (feelings) and `100A–100K` (triggers). Read-only analysis; nothing
under `src/` was changed.

* Frame transcriptions (verbatim `node scripts/overhaul/body.mjs`): `.overhaul/understand/scratch-slip/<Frame>.txt`
* Design PNGs: `.overhaul/shots/design/Email-Login/<Frame>.png` (all 31 looked at)
* Measured design layout signatures (exact boxes, already captured by the orchestrator):
  `.overhaul/sig/d-Email-Login-Slip-<…>.txt` — quoted below wherever a number is not literally in the CSS.
* The illustration each frame draws is named by the frame's own `data-hero="…"` attribute (body.mjs drops it;
  `grep -o 'data-hero="[a-zA-Z0-9]*"' .overhaul/final/Email-Login/Slip-*.html`). Every one of them was verified
  to be a byte-exact copy of the first 393×240 svg of a `Lesson-Illustrations-v4` card (svg-body hash).

All canvas `top` values are frame coordinates. **App top = canvas top − 54** (D009; the mock web build
injects a 54pt top inset). Bottom-anchored values (`bottom:48/96/60`) are measured off the frame edge and stay
as they are (D026).

---

## 0. What changed, in one paragraph

The previous drop drew this flow as a **light paper sheet** (`#F4F3F0`, a sheet cresting at y 52, ink `#131313`
pills 54 tall at `bottom 88`, Lato-500 23/30 headlines, a 20×20 grey ✕, sixteen bespoke `View`-built drawings in
`src/components/slip/art.tsx`, a white 3×3 tile grid with glyph discs for "What fed it?", a pop-over time wheel
with a date column and Cancel/Save, a notebook drawing on "Slip logged.", 64-tall answer rows with radio dots, a
paper pledge card with sun, hills, quote glyph and a script signature, and a dawn gradient for "Begin again").
This drop redraws every board in the **flat dark kit**: `#0D0D0D` ground + `noise.png` @ 0.05 (one board,
98I, uses the darker "hub" tone), the kit `nav` row (✕ on every board; back + 8 dashes on 98C/98D; a 13px
kicker on the nineteen cards), Lato 700 headlines (30/36 centred on the hero boards, 26/33 left on the question
boards), `#F2F0EC` primary pills 58 tall at `bottom 48` or `96`, a kit `ghost` at `bottom 60`, and every
illustration is a flat 393×240 **hero** from the shared illustration set (21 distinct ids across the group, all
shared with other groups). "What fed it?" becomes kit **chips** (no glyphs), the time wheel is **inline and always
open** with a new **date row** ("Tonight, Tue Jul 22" · `Change`), "Slip logged." gets an 84pt check disc and
a dark summary card with comma-joined values, "Do you still want to keep watching?" gets a sub line and kit
**options**, the pledge card is the dark kit pledge card (Lato 700 italic signature on a full-width rule),
**"Begin again" gains a ✕**, the nineteen cards gain a **kicker** ("After the slip" / "What fed it"), and **ten
CTAs are renamed to "Continue"**.

---

## 1. Where the group lives in the app today

| thing | file | notes |
| --- | --- | --- |
| the whole flow (one route, internal step state) | `src/app/slip.tsx` (586 lines) → `Slip()` | route **`/slip`**; `?stage=morning` opens 98L directly. `Step = 'entry' \| 'closeit' \| 'when' \| 'fed' \| 'logged' \| 'urgenow' \| 'warn' \| 'card' \| 'pledge' \| 'begin' \| 'morning'` |
| paper chrome + bespoke widgets | `src/components/slip/kit.tsx` (524) | `SlipClose`, `SlipSheet`, `SlipPage`, `SlipPrimary`, `SlipGhost`, `SlipHeading`, `FedGlyph`, `SlipFedTile`, `SLIP_FED`, `FedName`, `SlipSummaryRow`, `SlipAnswerRow`, `SlipPledgeCard`, `SlipBeginSky` — **all retired by this drop** (only `SLIP_FED`/`FedName` survive as data) |
| the sixteen old drawings | `src/components/slip/art.tsx` (461) | `SlipArt`, `SlipArtName` — imported only by `slip/kit.tsx`, `slip.tsx`, `slipCards.ts` (grep confirmed). **Delete** once heroes land. |
| the nineteen cards' data | `src/content/slipCards.ts` (80, hand-written, **not** generated) | `SLIP_CARDS` (id, key, kind, headline, body, cta, art, change), `SLIP_FED_TO_CARD` |
| borrowed from the urge log (logs group's file) | `src/app/urge-log.tsx` | `FlowTop`, `GRID_GAP`, `GRID_GUTTER`, `LoggedNote`, `PrimaryButton`, `TimeWheel`, `triggerTileWidth`, `WHEN_CHIPS`. After the restyle slip needs **only `WHEN_CHIPS`** (+ the shared when-board, §8). |

### Doors into `/slip` (unchanged; none in this group's files)
* `src/components/urge/index.tsx:2810` `logSlip()` → `router.replace('/slip')` (surf stage "I slipped"; sos-flow's file)
* `src/components/urge/index.tsx:3591` hub's **I slipped** → `router.push('/slip')` (sos-flow's file; new hub ghost "I slipped")
* `src/app/(app)/all.tsx:69` dev index "Post-slip flow"
* in-flow: 98K → `go('morning')` when the slip was logged for a day that is not today.

### The flow (unchanged order; frames confirm it)
```
entry(98A) → closeit(98B) → when(98C) → fed(98D) ─save()→ logged(98E) → urgenow(98F)
   98F: "I’m already watching again" → router.replace('/urge-hub')   (D149; see Q6)
        otherwise → warn: 98G / 98H / 98I by slips already logged that day (0 / 1 / 2+)
 → card (99A–100K; deck from the Fed answers; "Give me another" = next) 
 → pledge(98J) only if a Pledge exists and no slip stands between its signature and this one (D148)
 → begin(98K) → today, or → morning(98L) if the slip was not today
```
Back chevron exists only on 98C/98D (`back()` walks `ORDER`). ✕ everywhere = `close()` (`router.back()` or
`replace('/(app)/today')`).

---

## 2. Shared vocabulary (kit decomposition + exact numbers)

### 2.1 Grounds (both `inset:0`, i.e. under the status bar too)
| tone | frames | ground | noise |
| --- | --- | --- | --- |
| **sos** | 30 of 31 | `#0D0D0D` | `noise.png` (96×96, repeat) opacity **0.05** |
| **hub** | **98I Slip-Third only** | `#111111` | `noise-dark.png` (96×96, repeat) opacity **0.09** |

`assets/images/noise.png` is byte-identical to the bundle's (md5 `ecf3b31a…`). Use `Grain`
(`src/components/ui/Grain.tsx`). The kit's `frame()` says `noise-dark @ 0.06` — the frames win. `StatusBar
style="light"` on every board (today every board but 98I sets `dark`).

### 2.2 `nav` (kit) — canvas top 60 (app 6), height 40, `padding 0 22`, `space-between`
* left slot 36×40 (x 22–58): back chevron `svg 12×20 viewBox 0 0 12 20`, `d="M10 2L2 10l8 8"`, stroke `#F2F0EC`
  2.2, round caps/joins → drawn at x 22, y 70. **Only 98C and 98D draw it**; every other board has an empty slot.
* centre, one of:
  - **dashes**: 8 × (24×2, radius 1), gap 6, row 234 wide at x 79.5, y 79; lit `#F2F0EC`, unlit `#2E2E2E`.
    98C lights **3**, 98D lights **5** (kit `nav({step, total: 3})` → `round(step/3·8)`).
  - **kicker title** (the 19 cards): 13 / 700, nowrap, `#9B968E`, no explicit line height (Lato normal → box
    16), centred on the frame (measured x 158.7–234.2, y 72–88 for "After the slip").
  - nothing (98A, 98B, 98E–98L).
* right slot 36×40, `justify-content:flex-end`: ✕ `svg 18×18 viewBox 0 0 18 18`, `d="M2 2l14 14M16 2L2 16"`,
  stroke 2, round caps; `#F2F0EC` (sos) / `#FFFFFF` (98I). Drawn at x 353–371, y 71–89 (app y 17–35).

### 2.3 `primary` (kit) — `left 24; right 24; height 58; radius 29`
bg `#F2F0EC` (98I: `#FFFFFF`); label 16 / 700 / letter-spacing 0.1 / nowrap / `#111111` (box 19 tall).
`bottom: 48` (no ghost) → canvas 746–804; `bottom: 96` (with ghost) → 698–756.

### 2.4 `ghost` (kit) — `left 0; right 0; bottom 60; text-align center`
15 / 400 `#9B968E`, no line height (Lato normal → line box 18, canvas y 774–792). Give it `lineHeight: 18`
explicitly so native agrees. (Kit default is `bottom:62`; every frame here states 60.)

### 2.5 Type
| role | size / weight / tracking / line height | colour | wrap |
| --- | --- | --- | --- |
| h1, hero boards (98A, B, G, H, I, K, L, all cards) | **30** / 700 / −0.6 / **36**, centred | `#F2F0EC` (98I `#FFFFFF`) | balance |
| h1, question boards (98C, D, E, F, J) | 26 / 700 / −0.6 / 33 (left; 98E centred) | `#F2F0EC` | balance |
| p, hero boards + 98E + 98J | 15 / 400 / 24 | `#B5B0A8` (98I `rgba(255,255,255,0.62)`) | pretty |
| p, sub (98D "Tap all that apply.", 98F "Honest answer…") | 15 / 400 / **22** | `#9B968E` | pretty |
| caps (98C "Or choose a time", 98J "Your pledge") | 13 / 700, nowrap, sentence case | `#9B968E` | — |

All weights via `sans('700')` etc. (Lato families). 98J's signature is `font-style: italic; font-weight: 700` →
`sansItalic()` (Lato 700 italic). 98C's wheel centre row is **900** → `sans('900')` (Lato Black).

**Text-wrap (D052):** `text-wrap` works on web through `AppText` (react-native-web forwards `textWrap`).
`AppText` defaults non-headings to `pretty`; every run the frame states **no** `text-wrap` for must set
`wrap` (the existing `PLAIN` style in `slip/kit.tsx`) — in this group that is the **98J pledge sentence**
(greedy "The mornings are mine / again."; `pretty` would pull "mine" down), the **98E summary values**, the 98C
date label, chip/option labels (nowrap anyway). For native, the three balanced two-line headings with fixed copy
should carry explicit breaks: `'Do you still want\nto keep watching?'` (98F), `'Get out of bed for\na few
minutes.'` (100H), `'Change what\nhappens next.'` (100J).

### 2.6 `stack` (kit) — `position:absolute; left 24; right 24; top T; flex column; gap G`
Centred stacks add `align-items:center; text-align:center`. Spacers are literal `<div height:N>` children
**inside** the gap (a spacer of 6 adds 6 + one more gap). In a centred stack the spacer is 0 wide (no visual
effect).

### 2.7 Hero illustrations (kit `svgWrap`)
Every illustration is `<svg width=393 height=240 viewBox="0 0 393 240" style="position:absolute; left:0;
top:T; overflow:visible; transform:scale(S); transform-origin:196px 190px">` and its children are a byte-exact
copy of a `Lesson-Illustrations-v4` card. In RN (the shared `Hero` the library group proposed for
`src/components/mono/Hero.tsx`, generated `src/content/heroes.ts`):

```tsx
<Svg width={393} height={240} viewBox="0 0 393 240"
     style={{ position: 'absolute', left: 0, top: T - 54, overflow: 'visible' }}>
  <G transform={`translate(196 190) scale(${S}) translate(-196 -190)`}>{/* the card's children */}</G>
</Svg>
```
Several heroes have ground lines running x −40…433 (sunrise, campfire, charger, openDoor, signpost hills) — they
are meant to be clipped by the frame edge; on native the `Svg` must be padded wide enough (library §7.3) or
`overflow: visible` honoured. Vertically every hero in this group stays inside 0–240 after scaling.

**`paint-order="stroke"` (body.mjs does not print it)** — seven heroes here carry one such element; react-native-svg
ignores the attribute, so emit the shape twice (fill+stroke, then the same shape `stroke="none"` on top):
`tab` (cursor `M0 0 V24 L6 18.5…` in `translate(223 72)`), `campfire` (outer flame `M196 60 C 214 84…`), `kettle`
(`rect 132,180 128×8`), `feedOff` (lock body `rect 214,148 44×38` stroke 4), `charger` (puck `rect 166,124 52×14`),
`bed` (pillow `rect 142,130 46×18` stroke 4), `openDoor` (door leaf `M151 61 L112 50 V204 L151 190 Z`).
`openDoor` also has the group's only art `fill-opacity` (`0.09` on the light-spill path) — body.mjs prints it.

**Hero usage in this group** (id = the frame's `data-hero`; file = `Lesson-Illustrations-v4/<file>.html`):

| hero id | file | this group (top / scale) | old `SlipArtName` it replaces |
| --- | --- | --- | --- |
| `dominoes` | Dominoes | 98A 190/1.1 | `phoneflat` |
| `tab` | Browser-tabs | 98B 190/1.1 · **98F 506/0.965** · 100C 190/1.1 | `phoneup` · — · `phonerays` |
| `nightPhone` | Phone-parked-for-the-night | **98D 506/1.1** (new; 98D had no art) | — |
| `dominoes2` | First-domino-tipping | 98G 190/1.1 · 98H 190/1.1 | `dominoes` · `screendark` |
| `charger` | Phone-on-charge | 98I 190/1.1 · 100A 190/1.1 | `tvnight` · `phoneflat` |
| `fountainPen` | Fountain-pen | **98J 458/0.869** (new) | — |
| `sunrise` | Sunrise | 98K 190/1.1 | `SlipBeginSky` (gradient field) |
| `bell` | Bell | 98L 190/1.1 | `sunhills` |
| `mirror` | Mirror | 99A | `cards` |
| `stairs` | Stairs | 99B · 100D | `steps` |
| `envelope` | Envelope | 99C | `bubbles` |
| `kettle` | Kettle | 99D · 100F | `deskclock` |
| `phoneTable` | Phone-face-down | 99E · 100K | `phonerays` · `dots` |
| `bed` | Bed-at-night | 99F · 100H | `bed` |
| `campfire` | Campfire | 99G | `nighthills` |
| `signpost` | Signpost | 99H · 100J | `dots` · `rings` |
| `feedOff` | Feed-locked | 100B | `phoneup` |
| `twoCups` | Two-cups | 100E | `bubbles` |
| `bubbles` | Speech-bubbles | 100G | `bubbles` |
| `openDoor` | Open-door | 100I | `door` |

(98E Slip-Logged and 98C Slip-When draw no hero.) Note: sos-flow's doc proposed different ids for some of these
(`bedroom`, `penSigning`, `dominoesTipping`, `phoneLock`, `envelopeTilted`); **use the frames' own `data-hero` ids**
above — they are what the canvas names them, and the library group's generator proposal keys on them too.

### 2.8 `chips` (kit) — 98D
`display:flex; flex-wrap:wrap; gap:12`. Chip: height 48, radius 24, `padding 0 20`, row, `align-items:center`,
gap 8, label 15 / 400 nowrap (box 18).
* unselected: bg `#1E1E1E`, label `#F2F0EC`, **no ring**
* selected: bg `#F2F0EC`, leading check `svg 13×13 viewBox 0 0 14 14`, `d="M2 7.5l3.2 3L12 3.5"`, stroke `#111111`
  2.2 round caps/joins (at chip-x+20, centred), then the label in `#111111`.
Measured (98D): rows at y 221 / 281 / 341 / 401; Bored 24 (80.3w), Lonely 116.3 (83.5), Stressed 211.8 (96.7);
✓Tired 24 (96), ✓Phone in bed 132 (145.7); ✓Late night 24 (126.5), Sexual content 162.5 (136.7);
Argument 24 (106.4), Not sure 142.4 (96.9). Same rows fall out at 375 wide.

### 2.9 `options` (kit, but **15px**) — 98F
column gap 12; row height 58, radius 18, `padding 0 22`, label **15** / 400 nowrap (kit says 16; frame says 15 —
frame wins). unselected bg `#1E1E1E` / `#F2F0EC`; selected bg `#F2F0EC` / `#111111`. **No radio dot, no check, no
ring.** Rows at y 254 / 324 / 394 / 464 (labels x 46).

### 2.10 `timePicker` (kit, `mono-core.js`) + date row — 98C (identical in Lapse-When, Urge-Log-When, Morning/Nightly/Settings-Check-in-Time)
* box `position:relative; height 220; flex; justify-content:center` (canvas 24,307,345×220).
* band: `position:absolute; left 40; right 40; top 88; height 44; radius 14; bg #1E1E1E` → x 64–329, y 395–439.
* cluster `position:relative; display:flex; gap 12`, centred (x 74.5–318.5): hour col **70** · colon col (8 wide,
  `height 220; align-items:center`, ":" 30/700 `#F2F0EC`) · minute col **70** · meridiem col **60** (x 74.5 /
  156.5 / 176.5 / 258.5).
* each column = 5 rows × height 44, text centred; distance from the centre row: **0 → 30 / 900 `#F2F0EC`**,
  1 → 22 / 400 `#9B968E`, 2 → 22 / 400 `#2E2E2E`.
* 98C values: hours `9 · 10 · [11] · 12 · 1`; minutes `38 · 39 · [40] · 41 · 42`; meridiem
  `'' · AM · [PM] · '' · ''` — a real two-item wheel (AM above PM). For an AM time the column reads
  `'' · '' · [AM] · PM · ''`.
* **date row (new):** `height 44; radius 14; bg #1E1E1E; padding 0 6 0 18; flex; space-between; align center`
  (24,541,345×44): label `<span>` 15 / 700 `#F2F0EC` **"Tonight, Tue Jul 22"** (x 42, y 554, 18 tall); button
  `height 32; radius 16; bg #0D0D0D; padding 0 14`, 13 / 700 `#F2F0EC` **"Change"** (x 291–363, y 547–579).

### 2.11 `summaryRows` (bespoke in `mono-sos.js`/`mono-log.js`) — 98E (also logs' Lapse-Done, Urge-Log-Done)
card `radius 22; bg #1E1E1E; overflow hidden`. Row: `flex; space-between; align-items:flex-start; gap 16;
padding 16 20`; rows after the first add `border-top: 1px solid #2E2E2E`. Label 14 / 700 `#9B968E` nowrap
`padding-top 1` (box 18); value 15 / 700 `#F2F0EC`, **text-align right, line-height 22**, wraps (flex-shrink 1,
no text-wrap). Measured rows 54 / 55 / 55 / 77 (last value wraps "Phone charges outside / the bedroom", 158.5 wide
at x 190.5) → card 241 tall. In RN: label `flexShrink: 0`, value `flexShrink: 1, textAlign: 'right'`.
The card sits in a **centred** stack with no width → CSS shrink-to-fit; its max-content always exceeds 345 with
this copy, so it renders 345 wide — give it `alignSelf: 'stretch'` in RN (same result, robust).

### 2.12 `pledgeCard(true)` (kit, `mono-core.js`) — 98J (also Morning-Pledge-Signed, Relapse-Resign)
`card` radius 24, bg `#1E1E1E`, `padding 24 24 20` → column gap 22: caps "Your pledge" · pledge 24 / 700 / −0.4 /
33 `#F2F0EC` (no text-wrap) · signature row: `padding-top 12; height 44 (content-box); padding-bottom 8;
display:flex; align-items:flex-end; border-bottom 1.5px solid #F2F0EC`, first name 28 / 700 **italic** `#F2F0EC`,
left-aligned, the rule spans the full inner width (297). RN (border-box): `height 65.5, paddingTop 12,
paddingBottom 8, borderBottomWidth 1.5, justifyContent:'flex-end'` (sig measures 65 at DPR 1 — check the 2× PNG).

### 2.13 Check disc — 98E (also Lapse-Done, Urge-Log-Done)
row `left 0; right 0; top 200; flex; justify-content:center` → disc 84×84 radius 42 bg `#F2F0EC` (x 154.5,
canvas y 200–284, app 146–230), check `svg 36×36 viewBox 0 0 14 14 d="M2 7.5l3.2 3L12 3.5"` stroke `#111111` 2.2
(user-space, so it renders ≈5.66 thick) round caps/joins.

---

## 3. The hero-board template (26 of the 31 frames) — and the 19-card template

Twenty-six frames are one layout: **98A, 98B, 98G, 98H, 98I, 98K, 98L and the nineteen cards.** Stripped of
art and strings, every one of the nineteen cards hashes identical (diffed), and they are also identical to the
sos-boards group's 30 response boards (`SOS-Feel-*`, `SOS-Trig-*`, `SOS-Loc-*`: same nav kicker, same hero
geometry, same stack, same pill/ghost) and to sos-flow's Relapse-Log/Twice/Begin, Surf-Step-*, Cue-Intro,
Surf-Complete. It is the kit's `coping()` / `hero()` helper.

```
HeroBoard
  ground: tone 'sos' (#0D0D0D + noise.png .05) | 'hub' (#111111 + noise-dark.png .09)     — 98I only = hub
  nav (top 60): left empty · centre = kicker? (13/700 #9B968E) · right ✕ (#F2F0EC | hub #FFFFFF)
  hero: data-hero id, top 190 (app 136), scale 1.1                                         — all 26
  stack(452, gap 18, centred)  (app 398)
      h1  30/700/−0.6/36  #F2F0EC (hub #FFFFFF)  balance
      p   15/400/24       #B5B0A8 (hub rgba(255,255,255,0.62))  pretty
  primary(cta, bottom: ghost ? 96 : 48)   bg #F2F0EC (hub #FFFFFF), label #111111
  ghost(text, bottom 60)?                 #9B968E
```
Measured: h1 at y 452 (36, or 72 when two lines); p at 452 + h1 + 18 = 506 (or 542).

Proposed props (one component, ideally in the kit so sos-boards/sos-flow/relapse reuse it — see §8):
`{ tone?: 'sos'|'hub'; kicker?: string; onClose; hero: HeroId; heroTop?: 190; heroScale?: 1.1; title; body;
cta; onCta; ghost?; onGhost? }`.

### 3.1 Per-board data — the seven flow boards
| badge · frame | kicker | hero | h1 | p (lines) | primary (bottom) | ghost | tone |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 98A Slip-Entry | — | `dominoes` | It happened. | The day isn’t over. Log what happened, then stop it here. (2) | Log the slip (96) | Not now | sos |
| 98B Slip-Close-It | — | `tab` | Close it now. | Everything else can wait. Close the tab, close the app, put the screen down. (2) | **Continue** (48) | — | sos |
| 98G Slip-Dont-Fail-Twice | — | `dominoes2` | Don’t let it become two. | One slip happened. You can still turn the rest of today around. (2) | Continue (48) | — | sos |
| 98H Slip-Stop-Here | — | `dominoes2` | Stop here. | It happened again. The next hour can still be different. (2) | **Continue** (48) | — | sos |
| 98I Slip-Third | — | `charger` | You can still stop here. | The day is not gone. The phone goes away for the rest of the evening — that’s the only job. (2) | **Continue** (48) | — | **hub** |
| 98K Slip-Begin-Again | — | `sunrise` | The day is still yours. | One part of it went wrong. Nothing else has to. (1) | Start again (48) | — | sos |
| 98L Slip-Morning-After | — | `bell` | Morning after. | Last night happened. Today still counts. Start with the next decision. (2) | Check in (96) | Later | sos |

### 3.2 Per-board data — the nineteen cards (`src/content/slipCards.ts`)
All: kicker by family, hero at 190/1.1, primary `bottom 96`, ghost **"Give me another"** `bottom 60`. Headline and
body strings are **unchanged** from `slipCards.ts` (checked character by character). Deck index = position when
only `Bored` is picked (used by the recipes).

| badge · frame | deck | kicker (new) | hero (old art) | h1 (lines) | p lines | CTA old → new | `change` (98E row 4, unchanged) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 99A Slip-Feel-Ashamed | 1 | After the slip | `mirror` (cards) | Skip the self-lecture. (1) | **3** | Done | No self-lecture — straight to the next thing |
| 99B Slip-Feel-Bored | 0 | After the slip | `stairs` (steps) | Pick the next thing. | 2 | Done | One thing chosen instead of the feed |
| 99C Slip-Feel-Lonely | 2 | After the slip | `envelope` (bubbles) | Don’t stay cut off. | 2 | Done | Not alone with it tonight |
| 99D Slip-Feel-Stressed | 3 | After the slip | `kettle` (deskclock) | The problem can wait. | 2 | Done | A real break before the next hour |
| 99E Slip-Feel-Rejected | 4 | After the slip | `phoneTable` (phonerays) | Don’t go back yet. | 2 | Done | No messages until it has cooled down |
| 99F Slip-Feel-Tired | 5 | After the slip | `bed` (bed) | Do less, not more. | 2 | Done | Phone away, the night made easier |
| 99G Slip-Feel-Turned-on | 6 | After the slip | `campfire` (nighthills) | Stop feeding it. | 2 | Done | The cue goes, not the feeling |
| 99H Slip-Feel-Not-sure | 7 | After the slip | `signpost` (dots) | No reason needed tonight. | 2 | Done | Stop at the first one, no story needed |
| 100A Slip-Trigger-Late-night | 8 | What fed it | `charger` (phoneflat) | Move the phone. | **1** | Phone is away → **Continue** | Phone charges outside the bedroom |
| 100B Slip-Trigger-Scrolling | 9 | What fed it | `feedOff` (phoneup) | Get off the feed. | 2 | Feed is closed → **Continue** | The feed stays closed for the night |
| 100C Slip-Trigger-Sexual-content | 10 | What fed it | `tab` (phonerays) | Close everything. | 2 | Closed → **Continue** | The account that got me there is closed |
| 100D Slip-Trigger-Boredom | 11 | What fed it | `stairs` (steps) | Give the next hour a job. | 2 | Done | The next hour gets a job |
| 100E Slip-Trigger-Loneliness | 12 | What fed it | `twoCups` (bubbles) | Move toward people. | 2 | Done | One person messaged instead |
| 100F Slip-Trigger-Stress | 13 | What fed it | `kettle` (deskclock) | Contained break. | 2 | Done | One task named for later, then a break |
| 100G Slip-Trigger-Argument | 14 | What fed it | `bubbles` (bubbles) | Don’t reply yet. | 2 | I’ll leave it → **Continue** | Ten minutes before I reply |
| 100H Slip-Trigger-Couldn-t-sleep | 15 | What fed it | `bed` (bed) | Get out of bed for / a few minutes. (**2**) | 2 (p at 542) | I’m out of bed → **Continue** | Out of bed rather than on the phone |
| 100I Slip-Trigger-Being-alone | 16 | What fed it | `openDoor` (door) | Leave the room. | 2 | I’ve moved → **Continue** | Somewhere less private for ten minutes |
| 100J Slip-Trigger-Habit | 17 | What fed it | `signpost` (rings) | Change what / happens next. (**2**) | 2 (p at 542) | Continue | Something different after a slip |
| 100K Slip-Trigger-Not-sure | 18 | What fed it | `phoneTable` (dots) | Put the phone away. | 2 | Phone is away → **Continue** | Phone out of reach for ten minutes |

**Template → data extraction for `slipCards.ts`** (hand-written file, safe to edit):
* `art: SlipArtName` → `hero: HeroId` (the `data-hero` column above; type from the generated heroes module).
* `cta`: the seven renames above. Rule that falls out: every feeling card and the three "do something" triggers
  (Boredom, Loneliness, Stress) say **Done**; every other trigger says **Continue**. Keep it as data, not a rule.
* kicker: derive from `kind` (`feeling` → "After the slip", `trigger` → "What fed it"); no per-card field needed.
* headline: add the two `\n` breaks (100H, 100J) for native; web balances to the same lines.
* `change`, `id`, `key`, `kind`, `SLIP_FED_TO_CARD`: unchanged.
* The illustration paths themselves are **not** copied into this file — they come from the shared hero registry
  (one generated module), so the six pairs (`stairs`, `kettle`, `phoneTable`, `bed`, `signpost`, plus `tab`×3 and
  `charger`×2, `dominoes2`×2 across the flow) are shared rather than duplicated.

---

## 4. Frame by frame

Each entry: **route/state** · **draws** · **must change** · **keep** (functionality the frame does not show).
Seeds named "seed0/1/2" are `.overhaul/f-slip-seed{0,1,2}-2340.js` (mock account Jerry, pledge 6 days old, 0/1/2
slips already logged today, page clock frozen at tonight 23:40) — see §9 for the date change 98C needs.

### 4.1 98A · Slip-Entry — "It happened."
* **Route/state:** `/slip`, step `entry`, seed0.
* **Draws:** HeroBoard (§3.1): ✕ only; `dominoes` (a 268-wide table x 62–330 at y 188, five upright dominoes of
  rising height) at 190/1.1; stack 452; `primary('Log the slip', bottom 96)`; `ghost('Not now')`.
* **Must change:** `SlipPage` paper sheet → HeroBoard; art `phoneflat` @170 → hero; headline 23/500/30 @446 →
  30/700/36 @452; body 15.5/23 `#55534E` @492 → 15/24 `#B5B0A8` in the stack; pill `bottom 88, 54, #131313,
  17/600` → kit primary `bottom 96`; ghost 15/500 `#8B8882` `bottom 44` → 15/400 `#9B968E` `bottom 60`; ✕ 20×20
  `#55534E` at right 22 / top 18 → nav ✕ 18×18 `#F2F0EC`; StatusBar → light.
* **Keep:** Log the slip → `closeit`; Not now → `close()`; ✕ → `close()`.
* Twin: sos-flow's **Relapse-Log** = this frame with ghost "Back to the wave tool".

### 4.2 98B · Slip-Close-It — "Close it now."
* **Route/state:** `/slip` → tap **Log the slip**.
* **Draws:** HeroBoard: ✕; `tab` (laptop with browser tabs, the active tab's ✕ and a cursor) at 190/1.1;
  "Close it now." / "Everything else can wait. Close the tab, close the app, put the screen down."; `primary
  ('Continue', bottom 48)`, no ghost.
* **Must change:** as 98A; art `phoneup` → `tab`; **CTA "Closed" → "Continue"**; pill to `bottom 48`.
* **Keep:** Continue → `when`; ✕.

### 4.3 98C · Slip-When — "When did it happen?"
* **Route/state:** `/slip` → Log the slip → Continue. Frame draws **Just now** selected and the wheel at the
  current time 11:40 PM, date **Tonight, Tue Jul 22** (needs the clock frozen at Tue 22 Jul 23:40, §9).
* **Draws** (no hero): nav **back + 3/8 dashes + ✕**; `stack(136, gap 14)` left-aligned:
  h1 "When did it happen?" (136–169) · spacer 2 · chip row `flex; gap 10` at y 199 — three chips 44 tall,
  radius 22, `padding 0 18`, 14 / 700 nowrap: selected bg `#F2F0EC` text `#111111`, unselected bg `#1E1E1E`
  text `#F2F0EC` ("Just now" x 24 w 91.3 · "Earlier today" 125.3 w 116.5 · "Yesterday" 251.8 w 98.8) · spacer 6
  · caps "Or choose a time" (y 277, 16 tall) · `timePicker` (§2.10, y 307–527) · date row (§2.10, y 541–585);
  `primary('Continue', bottom 48)`.
* **Must change:**
  - `FlowTop index 0 steps 4` (paper bars) → kit nav (chevron, **8 dashes, 3 lit**, ✕).
  - `SlipHeading` centred 22/500 → h1 26/700 left at 136.
  - chips: white/`#131313` 14/500 `paddingVertical 13` centred row at 152 → kit chips above, left-aligned at 199.
  - **"Choose a time" link → "Or choose a time" caps label** (not a control). **The wheel is inline and always
    open** — no Cancel/Save, no pop-over card, no date column (Q1 re D150).
  - wheel: 34pt rows, 18/21 type with opacity fade, white card at 276 → kit timePicker (44pt rows, 22/30-900,
    three-step palette, `#1E1E1E` band, a static ":" column, widths 70/70/60 gap 12).
  - **new date row** "Tonight, Tue Jul 22" + **Change** (Q2/Q3).
  - CTA `PrimaryButton` at top 690 → kit primary `bottom 48`.
* **Keep:** `WHEN_CHIPS` presets (0 / −4 h / −24 h); `customAt` (any wheel touch overrides the chips and
  deselects all three — undrawn state: all chips `#1E1E1E`); tap-a-neighbour-row-to-step on hour (±1 h), minute
  (±1 min) and meridiem (±12 h); date stepping (today via the old date column → now via **Change**); `now`
  frozen at mount; back → `closeit`; ✕; Continue → `fed`. Clamp the date so the picked time cannot be in the
  future (the old ±2-day column allowed it).
* **Identical frame:** logs' **Lapse-When** (byte-identical transcription) and, but for 5 dashes/h1/CTA,
  **Urge-Log-When**. One component (§8).

### 4.4 98D · Slip-Fed — "What fed it?"
* **Route/state:** … → When **Continue** → tap **Tired**, **Phone in bed**, **Late night** (the frame's three).
* **Draws:** nav back + **5/8 dashes** + ✕; `stack(136, gap 8)`: h1 "What fed it?" (136–169) · p "Tap all that
  apply." 15/22 `#9B968E` (177–199) · spacer 6 · kit **chips** (§2.8) Bored · Lonely · Stressed · Tired · Phone in
  bed · Late night · Sexual content · Argument · Not sure (rows 221–449); hero **`nightPhone`** (a phone and a
  glass on a bedside shelf under a moon and stars, inner `translate(-6 0)`) at **506 / 1.1**; `primary
  ('Continue', bottom 48)`.
* **Must change:** paper grid of nine 112-tall white tiles with glyph discs (`SlipFedTile`, `FedGlyph`, 13.5/500
  → 14/600 when picked) → kit chips (no glyphs, check mark when picked); heading/sub to the stack; add the hero;
  **CTA "Continue · N" → "Continue"** (the label no longer counts); `FlowTop` → kit nav.
* **Keep:** multi-select toggle in grid order (`SLIP_FED`); `accessibilityRole="checkbox"`; Continue writes the
  event (`save()`: `createEvent({type:'lapse', trigger: fed.join(' · '), createdAt: at})` — the stored ` · `
  join is data, keep it) and sets `tideline.letter.pending`, then → `logged`; the **disabled-until-one-is-picked
  gate** (undrawn — Q4); back → `when`; ✕.

### 4.5 98E · Slip-Logged — "Slip logged."
* **Route/state:** … → Fed **Continue** (Tired · Phone in bed · Late night).
* **Draws:** nav ✕ only (no back); check disc (§2.13) at 200; `stack(308, gap 12, centred)`: h1 "Slip logged."
  26/33 (308–341) · p "You stopped, logged it, and changed something for next time." 15/24 `#B5B0A8` (353–401,
  breaks after "for") · spacer 6 · summary card (§2.11, 431–672): **When** "Tonight, 11:40 PM" · **What was going
  on** "Tired" · **Set off by** "Phone in bed, late night" · **Change for next time** "Phone charges outside the
  bedroom"; `primary('Continue', bottom 48)`.
* **Must change:** `LoggedNote` (notebook + pen + glow) → check disc; centred 27/500 headline @244 → h1 26/700/33
  in the stack @308; sub 13.5/19 `#8B8882` @286 → p 15/24; white card r18 @338 with `SlipSummaryRow`
  (12.5/600 label, 14.5/500 value, 200 max width, `rgba(0,0,0,0.06)` rules) → kit summary card; add the ✕ (the
  old board had none); CTA to `bottom 48`.
  Copy/format: **"Tonight · 11:40 PM" → "Tonight, 11:40 PM"** (`slipStamp` separator `' · '` → `', '`);
  **"Phone in bed · Late night" → "Phone in bed, late night"** — values join with `", "` and every item after
  the first is lower-cased (Lapse-Done draws the same rule: "Late night, boredom"); apply the same to the
  feelings row (Q5).
* **Keep:** feelings/situations split (`FED_FEELINGS`); change line = the first picked trigger card's `change`,
  else the first card's; Continue → `urgenow`; ✕. Empty-row handling is undrawn (Q5).
* **Twin:** logs' **Lapse-Done** (same layout, three rows, different copy) and Urge-Log-Done.

### 4.6 98F · Slip-Urge-Now — "Do you still want to keep watching?"
* **Route/state:** … → Logged **Continue** → tap **A little** (the frame's selection).
* **Draws:** nav ✕ only; `stack(136, gap 8)`: h1 "Do you still want / to keep watching?" (balance → two lines,
  136–202) · **p "Honest answer. It changes what comes next."** 15/22 `#9B968E` (210–232, new string) · spacer 6 ·
  kit **options** (§2.9) No · **A little** (selected) · Yes · I’m already watching again (254–522); hero **`tab`
  at 506 / 0.965**; `primary('Continue', bottom 48)`.
* **Must change:** paper sheet + 22/500 centred heading @98 → left h1 26/700 @136; add the sub line; 64-tall white
  rows with a right-hand radio dot/check (`SlipAnswerRow`) → kit option rows (fill-only selection, no indicator);
  add the hero; pill `top 692, 54` → kit primary `bottom 48`; ✕ to the nav.
* **Keep:** single select (`accessibilityRole="radio"`), default **none selected** (undrawn first-paint state:
  all four rows `#1E1E1E`); Continue with nothing picked is allowed (D149); "I’m already watching again" →
  `router.replace('/urge-hub')` (D149 text says `/urge` — Q6); otherwise → `warn`.

### 4.7 98G · Slip-Dont-Fail-Twice — first slip today
* **Route/state:** … → Urge-Now **Continue**, seed0 (0 slips before this one).
* **Draws:** HeroBoard: ✕; `dominoes2` (the 98A table and dominoes, first domino `rotate(26.74 98.8 188)`, a
  `#A8A39A` arc + arrowhead) at 190/1.1; "Don’t let it become two." / "One slip happened. You can still turn the
  rest of today around."; `primary('Continue', bottom 48)`.
* **Must change:** `WARNINGS[0]` geometry (art 166, headline 382, body 426) → HeroBoard; art `dominoes` →
  `dominoes2`.
* **Keep:** chosen when `priorToday === 0`; Continue → `card`; ✕. Twin: sos-flow's **Relapse-Twice** (identical).

### 4.8 98H · Slip-Stop-Here — second slip today
* **Route/state:** as 98G with **seed1**.
* **Draws:** identical to 98G (same `dominoes2` hero) with "Stop here." / "It happened again. The next hour can
  still be different." and `primary('Continue', bottom 48)`.
* **Must change:** `WARNINGS[1]` art `screendark` → `dominoes2`; **CTA "Turn it around" → "Continue"**.
* **Keep:** chosen when `priorToday === 1`; Continue → `card`.

### 4.9 98I · Slip-Third — third or later slip today (the group's only **hub-tone** frame)
* **Route/state:** as 98G with **seed2**.
* **Draws:** ground `#111111` + `noise-dark.png` @ 0.09; ✕ `#FFFFFF`; `charger` (bedside table, phone on a
  charging puck, cable to a wall socket; ground line `#55524D` x −40…433; inner `translate(-25 0)`) at 190/1.1 —
  the art keeps its own `#F2F0EC/#55524D/#0D0D0D` fills; h1 `#FFFFFF` "You can still stop here."; p
  `rgba(255,255,255,0.62)` "The day is not gone. The phone goes away for the rest of the evening — that’s the
  only job."; `primary('Continue', bottom 48)` with **bg `#FFFFFF`**.
* **Must change:** `#131313` sheet with paper ink and `tvnight` art @176 → hub-tone HeroBoard; **CTA "Phone is
  away" → "Continue"**; headline/body to the stack @452 (were 428/478); StatusBar light (already).
* **Keep:** chosen when `priorToday >= 2`; Continue → `card`.

### 4.10 Cards 99A–99H, 100A–100K — see §3.2
* **Route/state:** … → warn **Continue** → card; the deck is the cards the Fed answers name (via
  `SLIP_FED_TO_CARD`, in grid order) then every other card in file order; **Give me another** advances
  (`deck % cards.length`, wraps). With only **Bored** picked, N taps of Give me another reaches deck index N.
* **Draws:** HeroBoard with **kicker** ("After the slip" / "What fed it"), the card's hero at 190/1.1, h1/p,
  `primary(cta, bottom 96)`, `ghost('Give me another', bottom 60)`.
* **Must change:** `SlipPage` @ art 180 / headline 434 / body 480 → HeroBoard; add the kicker; art → hero; the
  seven CTA renames; ✕ to the nav.
* **Keep:** the deck logic; CTA → `pledge` if `pledgeEligible` else `begin`; ✕.

### 4.11 98J · Slip-Pledge — "The pledge still stands."
* **Route/state:** … → a card's CTA, seed0 (pledge exists, no slip since it was signed). Not drawn without a
  pledge (D148).
* **Draws:** nav ✕ only; `stack(136, gap 14)` **left-aligned**: h1 "The pledge still stands." (136–169) · p "A
  slip doesn’t erase what you decided. Sign it again and keep going." 15/24 `#B5B0A8` (183–231, breaks after
  "again") · spacer 6 · kit pledge card (§2.12, 265–500: caps "Your pledge" 289 · pledge "The mornings are mine /
  again." 327–393 · signature "Jerry" 415–480 on a full-width 1.5 `#F2F0EC` rule); hero **`fountainPen`** (a
  lined card rotated −3°, a white squiggle signature, a pen at `translate(134.6 62.1) rotate(35)`) at
  **458 / 0.869**; `primary('Sign it again', bottom 96)`; `ghost('Read my pledge', bottom 60)`.
* **Must change:** everything — centred 26/500 heading @96 and 15/22 sub @142 → left stack @136; the white card
  at 240 (sun wash, disc, hills, two-lobe quote glyph, centred 22/500 pledge, a 26pt `fonts.script` name
  rotated −3.5° over a 104-wide `rgba(0,0,0,0.2)` rule) → the dark kit card (left 24/700 pledge, Lato 700 italic 28 name on a
  full-width rule); add the hero and the ✕; pill `top 634` → `bottom 96`; ghost `top 706` 15/500 → `bottom 60`
  15/400.
* **Keep:** D148 gate (`pledgeEligible`); pledge text = newest `Pledge` journal entry body (required, no
  fallback); name = first word of `user.displayName` (fallback "You" — undrawn); Sign it again → `begin`; Read
  my pledge → `router.push('/vow')`; ✕.
* **Twins:** sos-flow's **Relapse-Resign** (ghost "Change the pledge"), today-day's **Morning-Pledge-Signed**
  (same card, hero at 458/**1.1**, gap 18, "Re-sign your pledge.", "Confirm"). One `PledgeCard` component (§8).

### 4.12 98K · Slip-Begin-Again — "The day is still yours."
* **Route/state:** … → Pledge **Sign it again** (seed0), or straight from a card's CTA when there is no pledge.
* **Draws:** HeroBoard: **✕ (new)**; `sunrise` (half sun r68 with five rays, two `#55524D` hills, a 3.5 ground line
  x −40…433) at 190/1.1; "The day is still yours." / "One part of it went wrong. Nothing else has to." (one
  line); `primary('Start again', bottom 48)`.
* **Must change:** `#F0EFEB` + `SlipBeginSky` (four-stop dawn, sun disc with grain, halo, horizon band) → sos
  shell + hero; headline 22/500 @74 → 30/700/36 @452; body 14/21 @146 → 15/24 in the stack; pill 361×48 r25
  `bottom 48` at left/right 16 → kit primary (left/right 24, 58, r29); **add the ✕** (the old board had no close).
* **Keep:** Start again → `go('morning')` if the slip's day ≠ today, else `router.replace('/(app)/today')`;
  ✕ → `close()`. Twin: sos-flow's **Relapse-Begin** (which adds a back chevron).

### 4.13 98L · Slip-Morning-After — "Morning after."
* **Route/state:** `/slip?stage=morning` (no seed needed), or in-flow from 98K when the slip was logged for
  yesterday/earlier.
* **Draws:** HeroBoard: ✕; `bell` (bell with hanger loop, a highlight arc, ring marks, a `#3A3835` shadow
  ellipse) at 190/1.1; "Morning after." / "Last night happened. Today still counts. Start with the next decision.";
  `primary('Check in', bottom 96)`; `ghost('Later', bottom 60)`.
* **Must change:** art `sunhills` @170 → `bell`; HeroBoard geometry (headline was @428).
* **Keep:** Check in → `router.replace('/day/morning')`; Later → `router.replace('/(app)/today')`; ✕.

---

## 5. Functionality the frames do not show (must be preserved, styled consistently)

1. `?stage=morning` deep entry to 98L.
2. Back chevron on 98C/98D (`ORDER` walk); ✕ on every board (`close()`).
3. 98C: three presets, wheel override (`customAt`), per-column tap stepping, date change, frozen `now`.
4. 98D: multi-select, Continue gate (≥ 1), the event write + letter-pending flag on Continue (and the
   `saving` re-entry guard).
5. 98E: computed values (stamp, feelings vs situations, change line).
6. 98F: optional single choice; "I’m already watching again" leaves the flow (D149).
7. 98G/H/I chosen by today's prior slip count (`priorToday`, discounting this run's own event).
8. Card deck built from the Fed answers + "Give me another" wrap-around.
9. 98J gate (D148), `/vow` link, first-name signature.
10. 98K → 98L branch for a slip not logged today.
11. Error handling: `save()` is `void`-ed with no catch (relapse.tsx catches). Not drawn; recommend a
    `.catch(() => {})` like relapse.tsx so an offline write cannot raise an unhandled rejection — no UI.

---

## 6. App screens / states no frame draws (they still need the new look)

| state | where | closest frame analog | proposal |
| --- | --- | --- | --- |
| 98C after a wheel touch (no preset) | step `when` | Slip-When | all three chips unselected (`#1E1E1E`/`#F2F0EC`) |
| 98C with Earlier today / Yesterday | step `when` | Slip-When | same chips, wheel + date row show the preset's time (Q3 for the day word) |
| 98C **Change** (date chooser) | step `when` | Change-Pledge-Sheet / Sheet-Sign-Out (kit `sheet`) for the shell, Slip-Urge-Now for rows | Q2 |
| 98D with nothing picked | step `fed` | Slip-Fed | Q4 (kit-level disabled primary) |
| 98E with no feelings / no situations / several feelings / long change | step `logged` | Slip-Logged | Q5 |
| 98F first paint (nothing selected) | step `urgenow` | Slip-Urge-Now | four `#1E1E1E` rows — this is the real first state |
| 98J long pledge (3+ lines) / long first name / no display name | step `pledge` | Slip-Pledge | card grows downward from 265; the hero at 458 will be covered — see Risks |
| card deck past the 19th | step `card` | any card | wraps (`deck % length`) |
| loading: `useEvents`/`useJournalEntries` undefined | gating reads | — | unchanged behaviour (counts treat undefined as empty) |
| `/relapse` (four boards) | `src/app/relapse.tsx` | Relapse-Log/Twice/Resign/Begin — **sos-flow group's frames** | should render through this group's HeroBoard/PledgeCard (§8) |

---

## 7. Copy changes (old → new), complete list

| board | old | new |
| --- | --- | --- |
| 98B CTA | Closed | **Continue** |
| 98C link/label | Choose a time (button) | **Or choose a time** (caps label) |
| 98C | (date column "Sat Jul 18 … Today …"), Cancel, Save | **Tonight, Tue Jul 22** · **Change** (date row); Cancel/Save removed |
| 98D CTA | Continue · 3 | **Continue** |
| 98E When | Tonight · 11:40 PM | **Tonight, 11:40 PM** |
| 98E Set off by | Phone in bed · Late night | **Phone in bed, late night** |
| 98F sub | — | **Honest answer. It changes what comes next.** |
| 98H CTA | Turn it around | **Continue** |
| 98I CTA | Phone is away | **Continue** |
| 99A–99H nav | — | **After the slip** |
| 100A–100K nav | — | **What fed it** |
| 100A / 100K CTA | Phone is away | **Continue** |
| 100B CTA | Feed is closed | **Continue** |
| 100C CTA | Closed | **Continue** |
| 100G CTA | I’ll leave it | **Continue** |
| 100H CTA | I’m out of bed | **Continue** |
| 100I CTA | I’ve moved | **Continue** |

Every other string in the group (headlines, bodies, labels, ghosts, chip/option labels) is unchanged.

---

## 8. Shared files and conflicts

1. **Own files (this group rewrites):** `src/app/slip.tsx`, `src/components/slip/kit.tsx`, `src/content/slipCards.ts`;
   **delete** `src/components/slip/art.tsx` (no other importer).
2. **`src/components/mono/*` + `src/content/heroes.ts` (orchestrator).** Needed here, all also needed elsewhere:
   - `Hero` + the generated hero registry (21 ids above; with the paint-order split, §2.7) — library, sos-flow,
     sos-boards, today-day, logs, tail, auth-funnel all place the same art.
   - `MonoScreen` ground (tone `sos` / `hub`), `Nav` (back / dashes n-of-8 / kicker / ✕, tone colours), `Primary`
     (bottom, tone), `Ghost`, text styles `H1` (30/36 and 26/33), `P` (24 and 22 leading), `Caps`, `Stack`.
   - **`HeroBoard`** (§3) — 26 frames here, 30 sos-boards frames, sos-flow's moves/intro/complete/relapse ×3.
     If the orchestrator prefers not to own it, build it in `src/components/slip/kit.tsx` and let sos-flow's
     `relapse.tsx` and sos-boards import it — agree the owner before both groups start.
   - `Chips` (multi, check), `Options` (single, 58/18, **15px** here), `CheckDisc`, `SummaryCard`, `PledgeCard`
     (signed + unsigned dashed state for today-day), `TimePicker`.
3. **`src/app/urge-log.tsx` (logs group).** Slip imports eight symbols from it today. Slip-When ≡ Lapse-When
   (byte-identical) ≈ Urge-Log-When, and Slip-Logged ≈ Lapse-Done ≈ Urge-Log-Done. Recommend one **`WhenStep`**
   (chips + caps + `TimePicker` + date row + the date chooser) and one **`LoggedCard`** (disc + h1 + p + summary
   card) shared by `/urge-log`, `/lapse` and `/slip` — in the kit or a new `src/components/log/` — and that slip
   then imports only `WHEN_CHIPS` (or nothing) from `urge-log.tsx`. The **wheel** itself is also the kit
   `timePicker` drawn by Morning/Nightly/Settings-Check-in-Time (`src/components/routines/wheel.tsx`,
   paywall-reminders group, scroll + snap). One `TimePicker` for all six frames; at minimum the slip/log one
   must keep tap-to-step.
4. **`src/app/relapse.tsx` (sos-flow).** Twins: Relapse-Log ≡ 98A (ghost differs), Relapse-Twice ≡ 98G,
   Relapse-Resign ≡ 98J (ghost differs), Relapse-Begin ≡ 98K (+ back chevron). Reuse HeroBoard/PledgeCard.
5. **`src/components/urge/index.tsx` (sos-flow)** — the two doors; no change needed.
6. **Recipes/seeds:** `.overhaul/recipes/slip.json`, `.overhaul/f-slip-seed{0,1,2}-2340.js`,
   `-nopledge-2340.js` (§9).
7. **DECISIONS.md** — new D2xx entries needed: 98C wheel always open (supersedes D150's first half); D150's
   second half (impossible date column) is moot — the column is gone and the date row matches with a dated seed;
   the comma join on 98E; the CTA renames; D149 destination wording (Q6).

---

## 9. Recipes and seeds to update (`.overhaul/recipes/slip.json`)

* **Seeds:** the frozen clock must also freeze the **date** for 98C's date row: **Tue 22 Jul 2025, 23:40** local
  (22 Jul 2025 is a Tuesday). In each seed replace
  `const d = new RealDate(); d.setHours(23, 40, 0, 0);` with `new RealDate(2025, 6, 22, 23, 40, 0, 0)`.
  Every other seeded timestamp is relative to the frozen `new Date()` and stays consistent. 98E then reads
  "Tonight, 11:40 PM" and 98C "Tonight, Tue Jul 22" with hours 9·10·**11**·12·1, minutes 38–42, **PM**.
* **Label renames on the path:** 98B `Closed` → **`Continue`**; 98C no longer taps `Choose a time`;
  98D `Continue · 3` / `Continue · 1` → **`Continue`**; 98H/98I CTAs → `Continue`; trigger cards' CTAs →
  `Continue` (feelings keep `Done`). `tap()` matches exact text first, and each step renders only its own
  controls, so repeated `Continue` taps are unambiguous.
* New `do` strings (all `--initseed` seed0 unless noted; `wait 2500`):
  - Slip Close It: `await tap("Log the slip")`
  - Slip When: `… ; await tap("Continue")`
  - Slip Fed: `… ; await tap("Continue"); await tap("Tired"); await tap("Phone in bed"); await tap("Late night")`
  - Slip Logged: Fed `+ await tap("Continue")`
  - Slip Urge Now: Logged `+ await tap("Continue"); await tap("A little")`
  - Slip Dont Fail Twice: Urge Now `+ await tap("Continue")`; **Stop Here** = same with seed1 (pick only `Tired`
    is fine); **Third** = same with seed2
  - cards: `tap("Log the slip"); tap("Continue"); tap("Continue"); tap("Bored"); tap("Continue"); tap("Continue");
    tap("Continue"); tap("Continue")` → deck 0 = Slip-Feel-Bored, then N × `tap("Give me another")` (§3.2 deck
    column)
  - Slip Pledge: deck 0 `+ await tap("Done")`; Slip Begin Again: Pledge `+ await tap("Sign it again")`
  - Slip Morning After: `/slip?stage=morning`, no seed.
* Compare each with `--ignore=0,0,393,54` (status bar). The previous run's notes on Expo's dev overlay landing in
  the bottom-left corner still apply (retake).

---

## 10. Open questions (canvas ambiguous / contradicts itself)

* **Q1 — 98C wheel always open vs D150.** The frame draws the wheel inline under a caps label, with no "Choose
  a time" control and no Cancel/Save; `relapse-workflow.md` §6 says the picker opens only on "Specify time" and
  D150 kept it closed. The canvas is the source of truth → **recommended: always open**; the caps is a label.
  The logs group must take the same reading for Lapse-When/Urge-Log-When.
* **Q2 — what "Change" does.** Undrawn. Recommended: open a kit `sheet` listing today and the previous six days
  as kit option rows (labels in the date-row format, current day selected), keeping the wheel's time; no title
  string invented if possible (or an app-authored h1). Cheaper alternative with no new UI: each tap steps the
  date back one day, cycling over the last seven. Either way, never into the future.
* **Q3 — day words.** The canvas draws only "Tonight, Tue Jul 22" (date row) and "Tonight, 11:40 PM" (98E).
  Proposal (both places): today ≥ 18:00 → `Tonight`, today earlier → `Today`, yesterday ≥ 18:00 → `Last night`,
  yesterday earlier → `Yesterday`, older → no day word (date row `Sun Jul 20`; 98E `Jul 20, 9:05 PM`). Date row =
  `${word}, ${Wkd} ${Mon} ${d}`; 98E = `${word}, ${h:mm AM/PM}`. (Today's `slipStamp` never says "Last night".)
* **Q4 — 98D with nothing picked.** No frame draws a disabled primary (kit-level question, also raised by
  auth-funnel and today-day). Keep the gate; style per the orchestrator's kit decision.
* **Q5 — 98E rows.** Empty feelings or empty situations: today `—`. Lapse-Done simply has fewer rows →
  recommended: **omit a row whose value is empty**. Several feelings: same comma/lower-case join as "Set off by"
  ("Tired, bored").
* **Q6 — "I’m already watching again" destination.** D149's text says `/urge` (the interrupt); the code does
  `router.replace('/urge-hub')`. With sos-flow's Q1 making `/urge` the SOS entry, recommend `/urge` as D149 says —
  needs a call.
* **Q7 — generator vs frames.** `mono-sos.js` disagrees with the frames on 98A's hero (`H.dip`), stack top (352 vs
  452), h1 size (32/38 vs 30/36), 98C date string ("Tonight · Tue, Jul 22" vs "Tonight, Tue Jul 22"), 98D CTA
  ("Continue · 3" vs "Continue"), 98E disc (top 120, ink fill vs top 200, `#F2F0EC`) and copy (· vs ,), 98F option
  size (16 vs 15), the cards' CTAs (per-card verbs vs "Continue"), and the warn boards' art. **Frames followed
  everywhere.**
* **Q8 — 98J vs Morning-Pledge-Signed.** Same card, different hero scale (0.869 vs 1.1) and stack gap (14 vs 18).
  Not a contradiction (different boards) — just make both props of `PledgeCard`'s host, not constants.

---

## 11. Risks

* **Short phones (375×667, top inset 20 → canvas y − 34):** HeroBoard with ghost: pill top 513 while the stack ends
  at 520 (2-line p), 544 (Ashamed, 3 lines), 556 (100H/100J two-line h1) → overlap; without ghost (pill 561) only
  100H/100J are tight. **98E**: card ends 638 vs pill 561 → 77pt overlap — needs a scroll container (or a
  compressed layout). **98D / 98F**: bottom heroes run 510–683 / 519–670 under the pill at 561. **98J**: card 466,
  pen art 503–626 under the pill 513 and ghost. 98C: date row ends 551 vs pill 561 (10pt, OK). Needs the kit-level
  rule sos-flow also asked for (proposal: hide decorative bottom heroes when they do not fit above `pillTop − 16`;
  scroll question boards; anchor hero-board stacks no lower than `pillTop − 16`).
* **Text-wrap:** web gets `balance`/`pretty` through `AppText`; native does not — the three fixed two-line
  headings take explicit `\n`; the pledge sentence and summary values must be `wrap`, not AppText's default
  `pretty` (D052).
* **SVG traps:** every `Hero` `Svg` is absolutely positioned (98D/98F/98J have the hero beside absolutely
  positioned stacks — it must carry `position:absolute; top; left` or it vanishes on web); use the `G` transform,
  never `Svg` rotation/origin props; the seven paint-order elements need the two-element split; full-bleed ground
  lines need a padded `Svg` on native.
* **Lato 900** for the wheel's centre row and **Lato 700 italic** for the signature must be loaded (`shot.mjs`
  warns `[fonts] Lato NOT loaded`).
* **Shared components with three other groups** (logs: when/logged; sos-flow: relapse twins; sos-boards: the
  board template; paywall-reminders: the wheel). Decide owners before implementation or the same board is built
  three times with drift.
* **Data:** the stored trigger join stays `' · '` (logs/insights read it); only the 98E display changes to commas.
