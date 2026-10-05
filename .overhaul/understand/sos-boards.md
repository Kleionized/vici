# sos-boards — the 30 SOS response boards (95A–95G · 96A–96M · 97A–97J)

Analysis for the implementation pass. Everything below was read out of the split frames
(`.overhaul/final/Email-Login/SOS-{Loc,Feel,Trig}-*.html`) with `body.mjs`/`decl.mjs`, measured on the
design server (`:8097`, Lato loaded — `document.fonts.check` true on every frame) and checked against the
current app source. Scratch scripts that produced the numbers are in
`.overhaul/understand/scratch-sos-boards/` (see §12); re-run them rather than re-deriving.

---

## 0. The short version

1. **All 30 frames are one template** in two variants. Stripped of text and art, the 13 `SOS-Feel-*`
   frames hash identical (primary at `bottom:96` + ghost "Give me another" at `bottom:60`), and the 17
   `SOS-Loc-*` / `SOS-Trig-*` frames hash identical (primary at `bottom:48`, no ghost). Per board the only
   data is: **kicker, hero id, title, body, CTA, another?**
2. **The art is no longer bespoke.** Each board's hero is an `<svg data-hero="…">` whose body is
   **byte-for-byte (whitespace-normalised) the first 393×240 svg of a `Lesson-Illustrations-v4` card** — 22
   distinct drawings for 30 boards, all 30 matched (§4). The same hero ids appear on 121 other
   Email-Login frames (151 carry a `data-hero`) across most groups. The old 239-layer CSS scene system (`SosSceneLayer`, `layers[]`) is obsolete.
3. **The same board template is used app-wide** (hero `top:190 scale 1.1`, stack `top:452 gap 18`, h1
   30/36, primary 48|96, ghost 60): slip's 19 `Slip-Feel-*`/`Slip-Trigger-*` cards, the three SOS moves
   (`Surf-Step-1`, `Surf-Step-3`, `Cue-Set-Confirmation`), `Cue-Intro-Modal`, `Surf-Complete`,
   `Relapse-*`, `Slip-*` hero screens, `Letter-Arrival`, `Report-Ready` (§10). It should be one kit
   component (`HeroBoard`) — orchestrator decision. 78 Email-Login frames place a hero at `top:190 scale 1.1`.
4. **Copy:** titles and bodies are unchanged. **13 CTAs changed** to `Continue` (every bespoke verb on the
   location and trigger branches); the four that were `Done` stay `Done`; all feeling boards stay `Done`.
   A **kicker** is new in the nav centre: `Where you are` / `What’s feeding it` / `What’s underneath`.
5. **Six boards need explicit line breaks** (`text-wrap: balance`/`pretty` differ from greedy): three titles,
   three bodies (§6). All six breaks also fit at 375 wide.
6. **Short screens break the template:** at 375×667 every feeling board's text runs 7–43 pt *into* the
   `Done` pill (§9.3). Needs an app-wide rule for hero boards (proposed: lift hero+stack by the deficit).
7. `src/content/sosResponses.ts` is **GENERATED** by `scripts/vicifull/gen-sos-responses.mjs` (an identical
   copy with a `.uifinal1` DIR lives at `scripts/uifinal1/gen-sos-responses.mjs`). Both read stale dirs
   and the layer model. Replace with `scripts/overhaul/gen-sos-boards.mjs` (spec in §8).

---

## 1. Where the app draws these today

| thing | where |
|---|---|
| routes | `/urge` (`src/app/urge.tsx`) and `/rough-first90` (`src/app/rough-first90.tsx`) — both render `UrgeFlow` |
| flow + step machine | `src/components/urge/index.tsx` → `UrgeFlow` (≈2683), `FLOW` (≈2593): `intro → strength → where → place-said → stand → leave → phone → reason → trigger-said → feeling → feeling-said → reassess → afterward → sos → done` (D037) |
| board renderer | same file → `ResponsePage` (≈1550) + `SosSceneLayer` (≈1438) + helpers `SoftBlob` (677), `BlurredSolid` (728), `EllipticBox` (796) inside `PaperSheet` (592) / `SheetClose` (610) |
| answer → board | `PLACE_BOARD` (2622), `TRIGGER_BOARD` (2630), `FEELING_BOARD` (2642), `FEELING_ROTATION` (2660, 14 entries incl. `SOS-Challenge`) |
| render calls | 2843 `place-said` → `ResponsePage answer={PLACE_BOARD[place]}`; 2844 `trigger-said` → `TRIGGER_BOARD[trigger] ?? 'SOS-Trig-Unknown'`; 2845–2851 `feeling-said` → `suggestion` with `onAnother={() => setRoll(r+1)}` |
| content | `src/content/sosResponses.ts` — header "generated from the frames by `scripts/vicifull/gen-sos-responses.mjs` — do not edit by hand"; 31 entries `{title, body, cta, another?, challenge?, layers[]}` |
| generator | `scripts/vicifull/gen-sos-responses.mjs` (DIR `.vicifull/final/Email-Login`, art box `left:76 top:180 240×220`) ≡ `scripts/uifinal1/gen-sos-responses.mjs` (DIR `.uifinal1/…`) — the two differ only in DIR and the usage/header line |
| spec | `specs/117-sos-response-boards.md` (describes the old paper template — needs a rewrite), sibling `specs/104-sos-challenge.md` |
| decisions | D037 (each picker hands to its board), D038 (5/9/9 options vs 7/10/13 boards; "Give me another" rotation), D146 (render-proof of unreachable boards by temporary map swap) |
| recipes | `.overhaul/recipes/sos.json` (shared with sos-flow) → `.overhaul/drives/b-SOS-*.js` (28 drives: 27 boards + `b-SOS-Challenge.js`) and `d038-loc-bathroom.js`, `d038-loc-home-alone.js`, `d038-trig-rejection.js` |

**What it looks like today** (captured `SOS-Loc-Bed` via `b-SOS-Loc-Bed.js`): light paper sheet `#F4F3F0`,
grey ✕ at `right 22 top 18` of the sheet, a soft layered bed scene in a clipped 240×220 box at sheet-top 180,
title 23/500 `#1D1C1A` at 434, body 15.5/23 `#55534E` at 480, ink pill `#131313` 54 tall at `bottom 88`
labelled `I’m up` (16.5/600 white), no kicker, `StatusBar style="dark"`.

### How to reach each board (state)

`/urge`, no seed needed. Path (current labels → **post-overhaul labels**, which sos-flow is renaming):
`The First 90 Seconds` / `Start the interrupt` → **`The first 90 seconds.` / `Start`**; `How strong is it right
now?` → `Continue`; `Where are you right now?` → tap place → `Continue` ⇒ **location board**. Its CTA
(today `Door is open` etc.; **now `Continue`**, or `Done` on Elsewhere) → three moves (today `I’m up`, `I’ve left`,
`Phone is away`; **now `Continue` ×3**, kickers `Move I of 3` … `Move III of 3`) → `What’s feeding it right now?`
→ tap trigger → `Continue` ⇒ **trigger board** → CTA → `What’s underneath it?` → tap feeling → `Continue` ⇒
**feeling board**; `Give me another` steps through `FEELING_ROTATION`. The last column of the table in §5 says which
answer reaches which board.

---

## 2. The template, in the designer's kit vocabulary

`mono-kit.js` / `mono-sos.js` `coping()`:

```
frame(label,
  nav({ close: true, noBack: true, title: kicker })
  svgWrap(heroArt, 190)                       // 393×240, scale 1.1, origin 196px 190px
  stack(452, [ h1(title, {center, size:30, lh:36}), p(body, {center}) ], {center, gap:18})
  primary(cta, { bottom: another ? 96 : 48 })
  another ? ghost('Give me another', { bottom: 60 }) : ''
)
```

**The generator is stale, the frames win** (BRIEF): `mono-sos.js` `coping()` still says `hero(110)`,
`stack(352 …)`, `h1 size 32 lh 38`, `gap 14`, and the bespoke CTAs (`I’m up`, `Locked`…); six of its hero
choices differ from the frames (Work/Public `H.people` → frame `bench`; Turned On `H.wave` → `umbrella`; Stressed
`H.pause` → `kettle`; Restless `H.route` → `sneaker`; Fantasy `H.cloud` → `balloon`; Rejected/Trig-Rejection/
Trig-Unknown `H.phoneDown` → `phoneTable`). Its `frame()` uses `noise-dark.png @ 0.06`; the frames say
`noise.png @ 0.05`. Its `H.*` hero bodies are older drawings — never port art from the kit.

### 2.1 Every element, canvas numbers verbatim (`body.mjs`), and the app's numbers

Canvas y is measured from the frame top; the app measures from the safe-area top, so app = canvas − 54
(D009; the mock injects `top: 54`). Bottom-anchored values are off the frame/screen edge (D026).

| # | element | canvas (verbatim) | app |
|---|---|---|---|
| 1 | frame | `393×852`, `background:#0D0D0D`, `font-family:'Lato'…`, `-webkit-font-smoothing:antialiased` | full-screen `View` `backgroundColor: mono.ground` (`#0D0D0D`); `StatusBar style="light"` |
| 2 | noise | `position:absolute; inset:0; background-image:url('noise.png'); opacity:0.05; pointer-events:none` — **2nd child, no z-index ⇒ paints UNDER every later positioned sibling (art, text, nav, pills)** | `Grain source={require('assets/images/noise.png')} opacity={0.05}` as the **first** child, edge to edge (asset is byte-identical to the bundle's: md5 `ecf3b31a…`) |
| 3 | nav row | `left:0 right:0 top:60px height:40px; display:flex; align-items:center; justify-content:space-between; padding:0 22px; z-index:5` | `top: 6`, height 40, `paddingHorizontal: 22`, row, space-between, `zIndex 5` |
| 3a | left slot | `width:36px height:40px` — **empty** (`noBack`) | empty 36×40 spacer (keeps the kicker centred) |
| 3b | kicker | `font-size:13px; font-weight:700; white-space:nowrap; color:#9B968E` — measured box 16 tall at y 72, centred on x 196.5 | `sans('700')`, 13, `lineHeight 16`, `color: mono.mute`, `numberOfLines 1` |
| 3c | right slot | `width:36px height:40px; justify-content:flex-end` → `<svg viewBox="0 0 18 18" width=18 height=18><path d="M2 2l14 14M16 2L2 16" fill="none" stroke="#F2F0EC" stroke-width="2" stroke-linecap="round">` — glyph measured at **353,71 18×18** | `PressScale` 36×40, glyph right-aligned; `accessibilityLabel="Close"`, generous `hitSlop`; `onPress = close` |
| 4 | hero | `<svg data-hero="<id>" width=393 height=240 viewBox="0 0 393 240" style="position:absolute; left:0; top:190px; overflow:visible; transform:scale(1.1); transform-origin:196px 190px">` — no z-index. Scaled box measured `-19.6, 171, 432.3×264` | shared `Hero id={…} top={136} scale={1.1}` (§4.3) |
| 5 | stack | `left:24px right:24px top:452px; display:flex; flex-direction:column; gap:18px; align-items:center; text-align:center` | `position:absolute; left 24; right 24; top: 398`, column, `gap 18`, centred |
| 5a | h1 | `width:100%; font-size:30px; font-weight:700; letter-spacing:-0.6px; line-height:36px; color:#F2F0EC; text-wrap:balance; text-align:center` | `sans('700')`, 30, `lineHeight 36`, `letterSpacing -0.6`, `mono.ink`, centred, explicit `\n` where §6 says |
| 5b | p | `width:100%; font-size:15px; font-weight:400; line-height:24px; color:#B5B0A8; text-wrap:pretty; text-align:center` | `sans('400')`, 15, `lineHeight 24`, `mono.sub`, centred, explicit `\n` where §6 says |
| 6 | primary | `left:24px right:24px bottom:48px` (**96px** on feeling boards) `height:58px; border-radius:29px; background:#F2F0EC; display:flex; align-items:center; justify-content:center; z-index:6` → `<span>` `font-size:16px; font-weight:700; letter-spacing:0.1px; white-space:nowrap; color:#111111` — measured pill top 746 (698 with ghost); label box 19 tall | `PressScale` `left 24 right 24 bottom 48|96 height 58 borderRadius 29 backgroundColor mono.ink zIndex 6`; label `sans('700')` 16, `letterSpacing 0.1`, `mono.onInk`; `onPress = next` |
| 7 | ghost (feeling only) | `left:0 right:0 bottom:60px; text-align:center; font-size:15px; font-weight:400; color:#9B968E; z-index:6` — text box measured `0,774 393×18` | `PressScale` `left 0 right 0 bottom 60`, text `sans('400')` 15, `lineHeight 18`, `mono.mute`, centred; `hitSlop` as today; `onPress = onAnother` |

Derived positions (canvas): title line 1 at 452–488; body starts at **506** under a one-line title, **542**
under a two-line title; text stack ends at 554 (typical) / 578 (Feel-Unknown, 3-line body) / 590 (Feel-Rejected,
Trig-Habit); pill 746–804 (or 698–756); ghost text 774–792.

**Paint order** (all `position:absolute`, document order, z-index): noise (auto) < hero svg (auto) <
stack (auto) < nav (5) < primary, ghost (6). Knock-out shapes inside the art are filled `#0D0D0D` flat — they
are not under the noise, so a pixel diff sees the grain only on the ground.

### 2.2 What the board does not draw

No status-bar content (chrome, D009), no home indicator (chrome), no back chevron, no stepper dashes, no tab
bar, no scroll (fixed composition — nothing below the fold), no card behind the text, no selected/pressed
state (the app's `PressScale` press feedback stays).

---

## 3. Variants and states drawn

| variant | frames | pill | ghost | kicker |
|---|---|---|---|---|
| location | 7 `SOS-Loc-*` | bottom 48 · `Continue` (Elsewhere: `Done`) | none | `Where you are` |
| trigger | 10 `SOS-Trig-*` | bottom 48 · `Continue` (Cant-Sleep, Alone, Unknown: `Done`) | none | `What’s feeding it` |
| feeling | 13 `SOS-Feel-*` | bottom 96 · `Done` | `Give me another` at bottom 60 | `What’s underneath` |

Each board is a single static state. Interaction states that exist in the app but are not drawn: pill pressed
(PressScale), ghost pressed, ✕ pressed — keep the app's existing press feedback, styled consistently.

---

## 4. Hero art

### 4.1 Every board's hero is a Lesson-Illustrations-v4 card, verbatim

Verified by comparing the whitespace-normalised inner markup of each board's `<svg data-hero>` with every
393×240 svg in `.overhaul/final/Lesson-Illustrations-v4/*.html`: **30/30 match the card's first (current) svg**.
The card itself carries the same `data-hero` id, so the id is the key.

| hero id | card file | elements | `paint-order="stroke"` | `<g>` wrappers (must be kept) | other attrs | boards |
|---|---|---|---|---|---|---|
| `bed` | Bed-at-night | 17 | 1 (pillow rect, stroke `#0D0D0D` 4) | `translate(12 0)` | — | Loc-Bed, Trig-Cant-Sleep |
| `openDoor` | Open-door | 11 | 1 (door leaf path, stroke `#0D0D0D` 3) | `translate(-7 0)` | `fill-opacity="0.09"` (light spill) | Loc-Bathroom, Loc-Private-Room, Trig-Alone |
| `lamp` | Desk-lamp | 11 | 0 | — | `fill-opacity="0.08"` (light cone) | Loc-Home-Alone, Feel-Low |
| `bench` | Park-bench | 18 | 0 | — | — | Loc-Work, Loc-Public |
| `signpost` | Signpost | 20 | 0 | `fill="#55524D"` ×2 (inherited fill) | — | Loc-Elsewhere, Trig-Habit |
| `umbrella` | Umbrella-in-the-rain | 16 | 0 | — | — | Feel-Turned-On |
| `stairs` | Stairs | 9 | 0 | — | — | Feel-Bored |
| `envelope` | Envelope | 7 | 0 | `rotate(-5 197 146)` | — | Feel-Lonely |
| `kettle` | Kettle | 17 | 1 (tray rect, stroke `#0D0D0D` 3) | — | — | Feel-Stressed |
| `clock` | Alarm-clock | 30 | 0 | `translate(158.7 79.6) rotate(-40)`, `translate(233.3 79.6) rotate(40)` | — | Feel-Anxious |
| `mountain` | Mountain | 11 | 0 | — | `stroke-dasharray` ×1 (trail) | Feel-Angry |
| `phoneTable` | Phone-face-down | 13 | 0 | `rotate(-12 176 136)` | — | Feel-Rejected, Trig-Rejection, Trig-Unknown |
| `nightPhone` | Phone-parked-for-the-night | 15 | 0 | `translate(-6 0)` | — | Feel-Tired |
| `sneaker` | Sneaker | 12 | 0 | `rotate(7 298 190)` | — | Feel-Restless |
| `shower` | Shower | 14 | 0 | — | `stroke-dasharray` + `stroke-dashoffset` ×5 (water) | Feel-Numb |
| `mirror` | Mirror | 14 | 0 | — | — | Feel-Ashamed |
| `door` | Closed-door | 10 | 0 | `translate(-14 0)` | — | Feel-Unknown |
| `tab` | Browser-tabs | 22 | 1 (cursor path, stroke `#0D0D0D` 3) | `translate(223 72)` | — | Trig-Content |
| `feedOff` | Feed-locked | 14 | 1 (padlock body rect, stroke `#0D0D0D` 4) | — | — | Trig-Doomscroll |
| `balloon` | Balloon | 15 | 0 | `fill="#55524D"` ×2 | — | Trig-Fantasy |
| `charger` | Phone-on-charge | 14 | 1 (dock rect, stroke `#0D0D0D` 3) | `translate(-25 0)` | — | Trig-Late-Phone |
| `bubbles` | Speech-bubbles | 6 | 0 | `translate(-4 0)` | — | Trig-Argument |

Element vocabulary across all 22: `rect`, `path`, `circle`, `ellipse`, `g` only — no gradients, filters, defs,
masks or text. Colours: `#F2F0EC`, `#55524D`, `#0D0D0D`, `#A8A39A`, `#3A3835`, `#232220`, `none`.

### 4.2 Traps

* **`paint-order="stroke"`** (6 of the 22 drawings, 9 frames). `body.mjs` does **not** print it (not in
  `SVG_ATTRS`), and react-native-svg ignores it. It paints the stroke first and the fill over it, so only the
  outer half of the `#0D0D0D` stroke shows as a knock-out halo (e.g. the gap around the pillow on the bed).
  Emit two elements: the shape with fill + stroke, then the same shape with `stroke="none"` on top.
* `body.mjs` also drops `data-hero`; read it from the raw HTML (`decl.mjs`'s `parse()` keeps every attribute).
* Inner `<g transform>` and inherited `<g fill>` must be preserved (signpost/balloon would lose their hills'
  colour without the inherited fill).
* Art overflows the 393×240 box: measured rendered bounds (frame coords, `getBoundingClientRect`) range
  x −63.6…456.7 (full-bleed grounds: mountain, stairs, sneaker, door, openDoor, bed, signpost, bench, balloon,
  charger) and y 204…421.8 (openDoor's light spill is the lowest). The frame root clips at x 0/393.

### 4.3 Placement in React Native

Canvas mapping for a 1.1 hero at `top:T`: user point (x, y) → frame point (1.1·x − 19.6, T − 19 + 1.1·y), i.e.
`matrix(1.1 0 0 1.1 −19.6 T−19)`. For the boards T = 190 (app 136). Do **not** put a CSS transform on `<Svg>`.
Use the shared component the library group proposed (`library.md` §3.3/§7.3) — an absolutely positioned
`<Svg>` (`style={{ position:'absolute', left:0, top: … }}` — SVG trap 1: the board has absolutely positioned
siblings) padded so strokes never clip on native, centred on wider/narrower phones via the viewBox, with an
inner `<G transform="translate(196 190) scale(1.1) translate(-196 -190)">`. Example:
`top: 136 − 20 = 116`, `width: W`, `height: 280`, `viewBox = "${-(W−393)/2} -20 ${W} 280"`.

---

## 5. Every board — content as the frames state it

Lines are the frame's own rendered lines (`⏎` = line break; measured on `:8097` with Lato loaded).
"CTA" shows `old → new` where the copy changed. All titles and bodies are **unchanged** from the current app.

| badge | frame | kicker (new) | hero (card) | title | body | CTA | ghost / pill | reached by |
|---|---|---|---|---|---|---|---|---|
| 95A | `SOS-Loc-Bed` | Where you are | `bed` (Bed-at-night) | Get out of bed. | Both feet on the floor. Stand up and leave ⏎ the bedroom. | `I’m up` → **`Continue`** | no · primary bottom 48 | where: In bed |
| 95B | `SOS-Loc-Bathroom` | Where you are | `openDoor` (Open-door) | Leave the bathroom. | Finish what you need to do, then take your phone ⏎ with you and leave. | `I’m out` → **`Continue`** | no · primary bottom 48 | UNREACHABLE (D038) |
| 95C | `SOS-Loc-Home-Alone` | Where you are | `lamp` (Desk-lamp) | Move somewhere open. | Turn the lights on and leave the room where you ⏎ usually watch. | `Lights are on` → **`Continue`** | no · primary bottom 48 | UNREACHABLE (D038) |
| 95D | `SOS-Loc-Private-Room` | Where you are | `openDoor` (Open-door) | Open the door and move. | Get away from the bed or chair and make the room ⏎ less private. | `Door is open` → **`Continue`** | no · primary bottom 48 | where: Somewhere private |
| 95E | `SOS-Loc-Work` | Where you are | `bench` (Park-bench) | Stay where people are. | Put your phone away. Don’t move somewhere ⏎ more private. | `Staying put` → **`Continue`** | no · primary bottom 48 | where: At work or school |
| 95F | `SOS-Loc-Public` | Where you are | `bench` (Park-bench) | Stay here. | You’re in a safer place already. Keep the phone away ⏎ and stay around people. | `Staying public` → **`Continue`** | no · primary bottom 48 | where: A public space |
| 95G | `SOS-Loc-Elsewhere` | Where you are | `signpost` (Signpost) | Get somewhere ⏎ less private. | Move somewhere you’d be less likely to watch. | `Done` | no · primary bottom 48 | where: Out and about |
| 96A | `SOS-Feel-Turned-On` | What’s underneath | `umbrella` (Umbrella-in-the-rain) | Let it pass. | You don’t have to do anything with the feeling. Stay ⏎ away from anything that makes it stronger. | `Done` | yes · primary bottom 96 | feeling: Turned on |
| 96B | `SOS-Feel-Bored` | What’s underneath | `stairs` (Stairs) | Do something physical. | Walk, train, take the stairs, or do a short set of ⏎ something. Get moving for five minutes. | `Done` | yes · primary bottom 96 | feeling: Bored |
| 96C | `SOS-Feel-Lonely` | What’s underneath | `envelope` (Envelope) | Talk to someone. | Send one message or go somewhere you’re around ⏎ other people. | `Done` | yes · primary bottom 96 | feeling: Lonely |
| 96D | `SOS-Feel-Stressed` | What’s underneath | `kettle` (Kettle) | Take ten minutes off. | Step away from what’s stressing you without ⏎ replacing it with porn or scrolling. | `Done` | yes · primary bottom 96 | feeling: Stressed or anxious |
| 96E | `SOS-Feel-Anxious` | What’s underneath | `clock` (Alarm-clock) | Give yourself one job. | Pick one simple thing to do for the next five minutes ⏎ and keep your attention there. | `Done` | yes · primary bottom 96 | rotation only (Stressed board + 1× Give me another) |
| 96F | `SOS-Feel-Angry` | What’s underneath | `mountain` (Mountain) | Use the energy. | Walk fast, train, or do a hard set of something before ⏎ you open another app or send a message. | `Done` | yes · primary bottom 96 | feeling: Angry |
| 96G | `SOS-Feel-Low` | What’s underneath | `lamp` (Desk-lamp) | Get out of the room. | Change clothes, shower, walk, or sit somewhere ⏎ brighter. Don’t stay where you usually watch. | `Done` | yes · primary bottom 96 | feeling: Low |
| 96H | `SOS-Feel-Rejected` | What’s underneath | `phoneTable` (Phone-face-down) | Leave it alone ⏎ for ten minutes. | Don’t check their profile or messages. Give yourself ⏎ ten minutes with no new information. | `Done` | yes · primary bottom 96 | rotation only (Low board + 1×) |
| 96I | `SOS-Feel-Tired` | What’s underneath | `nightPhone` (Phone-parked-for-the-night) | Make tonight easier. | Put the phone away, leave the risky room, and start ⏎ getting ready to sleep. | `Done` | yes · primary bottom 96 | feeling: Tired |
| 96J | `SOS-Feel-Restless` | What’s underneath | `sneaker` (Sneaker) | Move. | Walk, take the stairs, stretch, or train until the ⏎ restless feeling comes down. | `Done` | yes · primary bottom 96 | feeling: Restless |
| 96K | `SOS-Feel-Numb` | What’s underneath | `shower` (Shower) | Wake yourself up. | Wash your face, go for a walk, change rooms, or put ⏎ some music on and move. | `Done` | yes · primary bottom 96 | rotation only (Restless + 1×) |
| 96L | `SOS-Feel-Ashamed` | What’s underneath | `mirror` (Mirror) | Stop punishing yourself. | Put the phone away and do the next useful thing. ⏎ Thinking about how bad you feel can wait. | `Done` | yes · primary bottom 96 | rotation only (Restless + 2×) |
| 96M | `SOS-Feel-Unknown` | What’s underneath | `door` (Closed-door) | Move first. | You don’t need to know why right now. Change ⏎ rooms and put some distance between you and ⏎ the phone. | `Done` | yes · primary bottom 96 | feeling: I don’t know (also the fallback) |
| 97A | `SOS-Trig-Content` | What’s feeding it | `tab` (Browser-tabs) | Close it. | Don’t look again to see if the urge is still there. Close ⏎ it and leave it closed. | `Closed` → **`Continue`** | no · primary bottom 48 | trigger: Something online |
| 97B | `SOS-Trig-Doomscroll` | What’s feeding it | `feedOff` (Feed-locked) | Get off the feed. | Close the app for 15 minutes. Don’t replace one feed ⏎ with another. | `Locked` → **`Continue`** | no · primary bottom 48 | trigger: Doomscrolling |
| 97C | `SOS-Trig-Fantasy` | What’s feeding it | `balloon` (Balloon) | Stop adding to it. | Don’t keep the thought going. Get up and do ⏎ something that needs your attention. | `Started` → **`Continue`** | no · primary bottom 48 | trigger: A stuck fantasy |
| 97D | `SOS-Trig-Late-Phone` | What’s feeding it | `charger` (Phone-on-charge) | Put the phone away. | Charge it away from the bed and leave it there for ⏎ the next 15 minutes. | `It’s outside` → **`Continue`** | no · primary bottom 48 | trigger: Phone in bed |
| 97E | `SOS-Trig-Habit` | What’s feeding it | `signpost` (Signpost) | Change what ⏎ happens next. | Do something different from what you normally do ⏎ right before you watch. | `Swapped` → **`Continue`** | no · primary bottom 48 | trigger: Pure habit |
| 97F | `SOS-Trig-Cant-Sleep` | What’s feeding it | `bed` (Bed-at-night) | Get out of bed. | Leave the bed for a few minutes. Keep the lights low ⏎ and stay off feeds. | `Done` | no · primary bottom 48 | trigger: Can’t sleep |
| 97G | `SOS-Trig-Argument` | What’s feeding it | `bubbles` (Speech-bubbles) | Don’t reply yet. | Stop rereading the messages. Give yourself ten ⏎ minutes before you respond. | `Stepping away` → **`Continue`** | no · primary bottom 48 | trigger: An argument |
| 97H | `SOS-Trig-Rejection` | What’s feeding it | `phoneTable` (Phone-face-down) | Stop checking. | No profile checks, message refreshes, or looking for ⏎ something else to numb it. | `Not checking` → **`Continue`** | no · primary bottom 48 | UNREACHABLE (D038) |
| 97I | `SOS-Trig-Alone` | What’s feeding it | `openDoor` (Open-door) | Leave the room. | Move somewhere less private. If it’s safe, go ⏎ somewhere other people are around. | `Done` | no · primary bottom 48 | trigger: Being alone |
| 97J | `SOS-Trig-Unknown` | What’s feeding it | `phoneTable` (Phone-face-down) | Put the phone down. | Move somewhere different and keep the phone out ⏎ of reach for ten minutes. | `Done` | no · primary bottom 48 | trigger: I don’t know (also the fallback) |

All strings use the curly `’`; the kickers are `What’s underneath` / `What’s feeding it` (curly) and
`Where you are`.

---

## 6. Line breaks (`text-wrap: balance` on h1, `pretty` on p)

Measured by rendering each frame on `:8097`, then again with `text-wrap: wrap` (greedy, which is what RN's
breaker does): **24 boards break identically; 6 differ** and need an explicit `\n` (BRIEF rule 6 — the copy
is fixed):

| frame | field | frame lines (use these) | greedy would give | line widths at 30/700/−0.6 or 15/400 |
|---|---|---|---|---|
| SOS-Feel-Rejected | title | `Leave it alone` ⏎ `for ten minutes.` | `Leave it alone for ten` ⏎ `minutes.` | 174.6 / 201.5 (one line = 381.3 > 345) |
| SOS-Loc-Elsewhere | title | `Get somewhere` ⏎ `less private.` | `Get somewhere less` ⏎ `private.` | 203.9 / 151.8 (one line 360.9) |
| SOS-Trig-Habit | title | `Change what` ⏎ `happens next.` | `Change what happens` ⏎ `next.` | 168.8 / 177.6 (one line 351.6) |
| SOS-Loc-Bed | body | `Both feet on the floor. Stand up and leave` ⏎ `the bedroom.` | `…leave the` ⏎ `bedroom.` | 267.1 |
| SOS-Loc-Work | body | `Put your phone away. Don’t move somewhere` ⏎ `more private.` | `…somewhere more` ⏎ `private.` | 296.7 |
| SOS-Feel-Unknown | body | `You don’t need to know why right now. Change` ⏎ `rooms and put some distance between you and` ⏎ `the phone.` | `…between you and the` ⏎ `phone.` | 303.5 / 304.4 |

Every forced line is ≤ 304.4 wide, so all six still fit the 327-wide stack at 375 (no extra wraps); the other
24 boards keep natural wrapping (at 375 their bodies stay 2 lines). Longest single-line titles: `Open the door
and move.` 321.6, `Move somewhere open.` 306.0, `Stop punishing yourself.` 303.6 — all fit 327.
Note: a `\n` in a title changes `innerText`, so a drive must `waitFor('Get somewhere')`, not the full title.

---

## 7. What must change in the app

**Structure** (`ResponsePage` for the 30 boards):
1. Drop `PaperSheet` (no sheet, no `marginTop: insets.top − 2`); the board is a full-screen `#0D0D0D` frame with
   the 5 % `noise.png` grain under everything, `StatusBar style="light"`, content positioned from the safe-area
   top (−54 rule) and the pills off the screen bottom.
2. Replace `SheetClose` (20×20, `M3 3l14 14M17 3L3 17`, `#55534E`, sheet `right 22 top 18`) with the kit nav row
   (§2.1 #3): empty left slot, **new kicker** centred, 18×18 `M2 2l14 14M16 2L2 16` `#F2F0EC` ✕ at 353,71.
3. Replace the clipped 240×220 layered scene (`left 76 top 180`, `SosSceneLayer`) with the shared hero
   (`top 136` app / 190 canvas, scale 1.1, full-width, unclipped horizontally).
4. Text: title 23/500 `#1D1C1A` `left/right 36 top 434` → **30/700, −0.6, LH 36, `#F2F0EC`** in a
   `left/right 24, top 398 (452)` column with `gap 18`; body 15.5/23 `#55534E` `left/right 44 top 480` → **15/400,
   LH 24, `#B5B0A8`** in the same column (its top now follows the title's height: 506 or 542 canvas).
5. Pill: `#131313` h 54 r 27 `bottom 88`, label 16.5/600 +0.2 white → **`#F2F0EC` h 58 r 29, bottom 48 (96 on
   feeling boards)**, label **16/700 +0.1 `#111111`**.
6. Ghost: `bottom 44`, 15/500 `#8B8882` → **`bottom 60`, 15/400 `#9B968E`**, box height 18.
7. Copy: 13 CTAs → `Continue` (§5); add the three kickers; six explicit breaks (§6).

**Removed:** the `layers[]` data and its renderer `SosSceneLayer`; `EllipticBox` (only `SosSceneLayer` uses it —
dead after this); the radial washes / blurred solids / CSS triangles / box-shadows of the old scenes. `SoftBlob`
and `BlurredSolid` are still used by other urge art (sos-flow decides).

**Navigation:** unchanged — no back on any board (frame `noBack`), ✕ = `close()`, pill = `next()`,
ghost = `onAnother`. Board order in the flow unchanged (D037).

---

## 8. Generator — `scripts/overhaul/gen-sos-boards.mjs` (replaces both `gen-sos-responses.mjs`)

Output: `src/content/sosResponses.ts` (keep the file name and the `SOS_RESPONSES` export so the import in
`urge/index.tsx` stays put), header `GENERATED FILE — do not edit by hand` naming the new script.

**Input:** `.overhaul/final/Email-Login/SOS-{Loc,Feel,Trig}-*.html` (30) + `SOS-Challenge.html` (the 14th entry
of the feeling rotation — layout owned by sos-flow, data by this file; see §11).

**Per frame**, using `parse()` from `scripts/overhaul/decl.mjs` (it keeps every attribute, unlike `body.mjs`):
1. Drop the chrome the way `body.mjs` does (the `top:0 height:54px` status row; the `139×5` indicator).
2. `kind` from the file name (`Loc`→location, `Feel`→feeling, `Trig`→trigger).
3. **nav**: the `top:60px; height:40px` row → its middle child's text = `kicker`. (Challenge instead has a back
   chevron + 8 dashes — record `nav: {back: true, step: 7, of: 8}` for it.)
4. **hero**: the `<svg>` with `data-hero` → `hero: id`, `heroTop: num(style.top)` (190; Challenge 111),
   `heroScale` from `transform:scale(…)` (1.1); **assert** `transform-origin:196px 190px` and that the svg body
   equals the body of the `Lesson-Illustrations-v4` card with the same `data-hero` (normalise whitespace) — fail
   loudly otherwise, because the board will draw the shared hero, not its own copy.
5. **stack**: the `left:24px; right:24px; top:Npx` column → `title` = first text, `body` = second; Challenge also
   has the card: `challengeLabel` (`The challenge`) and `challenge` text.
6. **primary**: the `height:58px; border-radius:29px` div → `cta` = its span text, `ctaBottom` = 48|96.
7. **ghost**: a `bottom:60px` div whose text is `Give me another` → `another: true`.
8. **Template asserts** (throw on any deviation, so a future drop that moves one board is caught): noise
   `noise.png`/`0.05`; nav `top:60px height:40px padding:0 22px`; kicker `13px/700 #9B968E`; ✕ path
   `M2 2l14 14M16 2L2 16`; stack `top:452px gap:18px`; h1 `30px/700/-0.6px/36px #F2F0EC`; p `15px/400/24px #B5B0A8`;
   primary `left/right 24 height 58 radius 29 #F2F0EC`, label `16px/700/0.1px #111111`; ghost `15px/400 #9B968E`;
   `ctaBottom === (another ? 96 : 48)`.
9. Decode entities (`&rsquo;` etc. — reuse the old script's `ENTITIES`) — the current split files already contain
   literal `’`, but decode anyway.
10. **Line breaks**: the frames carry no `\n`. Put a small `BREAKS` table in the generator (the six entries of §6,
    keyed by frame, giving the full string with `\n`) and assert that `BREAKS[k].replace(/\n/g, ' ') === text`.
    `.overhaul/understand/scratch-sos-boards/lines.mjs` re-measures every frame on `:8097` (balance/pretty vs greedy)
    and prints any board whose wrap differs — move it to `scripts/overhaul/sos-breaks.mjs` as the check.

Suggested emitted shape:

```ts
export type SosBoardKind = 'location' | 'trigger' | 'feeling';
export interface SosResponse {
  kind: SosBoardKind | 'challenge';
  kicker?: string;            // the nav's centre title; Challenge draws dashes instead
  hero: HeroId;               // data-hero → the shared hero registry
  heroTop: number;            // canvas px (190; Challenge 111)
  heroScale: number;          // 1.1
  title: string;              // may contain \n (balance), §6
  body: string;               // may contain \n (pretty), §6
  cta: string;
  ctaBottom: 48 | 96;
  another?: true;
  challengeLabel?: string;    // 'The challenge' (Challenge only)
  challenge?: string;
}
export const SOS_RESPONSES: Record<SosBoardKey, SosResponse>;   // SosBoardKey = the 31 literal keys
```

Typing the keys as a literal union makes `PLACE_BOARD`/`TRIGGER_BOARD`/`FEELING_ROTATION` typos a compile
error (today an unknown key silently renders `null`). `HeroId` comes from the shared hero module (§11) — the
generator must not inline art.

Diff check after running: every title/body string must equal the old file's (only the six `\n`s differ);
CTA diffs must be exactly the 13 in §5; `layers` gone.

---

## 9. Functionality to preserve, gaps the frames do not draw

### 9.1 Behaviour the boards have today (keep, styled per §2)

* ✕ → `close()`: `clearUrgeSession()`, then `router.back()` or `router.replace('/(app)/today')`.
* Pill → `next()` (place board → move I; trigger board → feeling picker; feeling board → reassess). `Continue`
  and `Done` do the same thing — the label is copy only.
* `Give me another` (feeling boards only, and `SOS-Challenge`) → `setRoll(r + 1)`; rotation =
  `FEELING_ROTATION` from the picked feeling's board, wrapping after `SOS-Challenge` to `SOS-Feel-Turned-On`.
* Answer → board maps and fallbacks (`SOS-Trig-Unknown`, `SOS-Feel-Unknown` when nothing was picked).
* The urge session persists across the boards (`saveUrgeSession` on mount); `finish()` later writes
  `precedingState.location/feeling/reasons` — boards write nothing themselves.
* Both doors: `/urge` and `/rough-first90` render the same flow (and the Rough Days shelf links to it).
* Press feedback (`PressScale`), accessibility roles (`button`), `hitSlop` on ✕ and ghost.

### 9.2 States with no frame

| state | where | closest analog to style it on |
|---|---|---|
| boards on short phones (375×667) | all 30 | this template + the §9.3 lift rule |
| `SOS-Loc-Bathroom`, `SOS-Loc-Home-Alone`, `SOS-Trig-Rejection` | built, unreachable (D038) | their own frames — they still need building and a render proof |
| a multi-select answer set (pickers now say "Select all that apply.") | trigger & feeling boards | their own frames; which board shows is Q1 below |
| the `/rough-first90` door | same flow | identical rendering |
| pressed pill / ghost / ✕ | all | `PressScale` as elsewhere in the kit |

### 9.3 Device sizes (computed, not yet captured)

Stack bottom vs pill top (`gap` = pill top − text bottom; negative = overlap), using the frame's metrics, the
§6 breaks, the mock's insets (375×667 → top 20; others → 54) and pills off the screen bottom:

| board group | 375×667 | 390×844 | 393×852 | 430×932 |
|---|---|---|---|---|
| 11 feeling boards (1-line title, 2-line body) | **−7** | 136 | 144 | 224 |
| SOS-Feel-Unknown (3-line body) | **−31** | 112 | 120 | 200 |
| SOS-Feel-Rejected (2-line title) | **−43** | 100 | 108 | 188 |
| 15 location/trigger boards | 41 | 184 | 192 | 272 |
| SOS-Loc-Elsewhere (2/1) | 29 | 172 | 180 | 260 |
| SOS-Trig-Habit (2/2) | **5** | 148 | 156 | 236 |

So on a home-button phone every feeling board's text runs under the `Done` pill. Proposal (needs one rule for
every hero board app-wide — §10): when `textBottom + 24 > pillTop`, translate the hero **and** the stack up by the
deficit (measured with `onLayout`), capped so the art never rises above the nav (there are ≈100 pt of empty
ground between the nav's bottom at canvas 100 and the highest art at canvas 204; worst case needed here is 67).
At 393×852 the lift is 0, so the canvas match is untouched. Horizontal: content insets 24/24 scale with width;
the hero stays centred (viewBox offset) — full-bleed grounds simply show more/less at the edges.

---

## 10. Shared files and conflicts

1. **`src/components/urge/index.tsx`** — shared with **sos-flow** (whose doc §5.1 proposes the same split):
   move `ResponsePage` (+ the Challenge layout sos-flow specs in its §3.9) into a new **`src/components/urge/boards.tsx`**
   owned by sos-boards before both groups edit; `UrgeFlow` keeps `PLACE_BOARD`/`TRIGGER_BOARD`/`FEELING_BOARD`/
   `FEELING_ROTATION` (sos-flow edits them for multi-select). Delete `SosSceneLayer` and `EllipticBox` with it.
2. **`src/components/mono/*` (orchestrator)** — needed from the kit port: `MonoFrame` (ground + noise 0.05 under
   content + light status bar), `MonoNav` (`noBack` + `title` kicker + `close`), `Hero` + generated hero registry
   (`src/content/heroes.ts` from `Lesson-Illustrations-v4`, keyed by `data-hero`, with `paint-order` emitted as two
   elements — exactly library.md §7.3; the 22 ids in §4.1 must be in it), `H1`/`P`/`Stack` (center; h1 size
   30/36 variant), `Primary` (`bottom` prop), `Ghost` (`bottom` prop). Ideally one composite **`HeroBoard`**
   (`kicker`, `back?`, `hero`, `heroTop`, `title`, `body`, `titleSize` 30/36|26/33|34/40, `stackTop` 452|451,
   `gap` 18|16|12, `cta`, `ctaBottom`, `ghost?`, `onClose`, `onCta`, `onGhost`) — the same template is drawn by
   78 Email-Login frames (`top:190px … scale(1.1)` hero): sos-boards (30), slip (`Slip-Feel-*` ×8 kicker `After the slip`, `Slip-Trigger-*` ×11 kicker
   `What fed it`, plus Entry/Close-It/Dont-Fail-Twice/Stop-Here/Third/Begin-Again/Morning-After), sos-flow
   (`Cue-Intro-Modal`, `Surf-Step-1`/`-3`, `Cue-Set-Confirmation` with kickers `Move I of 3`…, `Surf-Complete`,
   `Relapse-Log`/`-Twice`/`-Begin`), medallions-letters (`Letter-Arrival`), logs (`Report-Ready`), and 26/33
   variants in auth-funnel/tail (`First-Principle`, `Transition`, `Onboarding-Start`, `Goal-Confirmation`,
   `Start-Here*`, `Where-We-d-Start`, `Letter-Received`). The §9.3 short-screen rule belongs in it.
3. **`src/content/sosResponses.ts`** (generated; this group) — read by sos-flow for `SOS-Challenge`. Note the
   Challenge's caps changed `THE CHALLENGE` → `The challenge` and it now has a hero (`twoCups`, top 111).
4. **`src/app/slip.tsx`, `src/components/slip/kit.tsx`, `src/content/slipCards.ts`** (slip group) — the same
   template; agree to share `HeroBoard`. `relapse-workflow.md` also says slip location resets should "Reuse SOS
   pools", so slip may want to read `SOS_RESPONSES` too.
5. **Recipes/drives** — `.overhaul/recipes/sos.json` and `.overhaul/drives/b-SOS-*.js`, `d038-*.js` are shared with
   sos-flow. Put this group's recipes in **`.overhaul/recipes/sos-boards.json`** and rewrite the board drives (§13).
6. **`specs/117-sos-response-boards.md`** — rewrite for the new template; add a D2xx entry to `DECISIONS.md`
   (CTA renames, kicker, shared heroes, explicit breaks, short-screen lift, D038 still in force).
7. `scripts/vicifull/gen-sos-responses.mjs` / `scripts/uifinal1/gen-sos-responses.mjs` — leave in place (history)
   but nothing should run them again; the new header must name `scripts/overhaul/gen-sos-boards.mjs`.

---

## 11. Open questions / contradictions

* **Q1 — multi-select pickers.** `SOS-Reason-Picker` and `SOS-Feeling-Picker` now say "Select all that apply." and
  draw checked chips, but each branch still shows **one** board (D037) and `relapse-workflow.md` says "show one
  action chosen from the relevant trigger/location pool". Proposal (matches sos-flow Q4): the board is the one for
  the **first selected answer in picker order**; on the feeling branch, "Give me another" could walk the other
  *selected* feelings' boards first, then the rest of `FEELING_ROTATION` (as `slip.tsx` already does for its deck).
  Needs agreement with sos-flow. Also: if sos-flow pre-selects the frame's chips (`Phone in bed`, `Lonely`) as
  defaults, "first selected" changes which board a drive lands on — drives must deselect first.
* **Q2 — `Continue` vs `Done`.** The designer swept the 13 bespoke CTAs to `Continue` but left `Done` on
  `Loc-Elsewhere`, `Trig-Cant-Sleep`, `Trig-Alone`, `Trig-Unknown` (which were already `Done`), although all four
  advance to a further step exactly like their `Continue` siblings. Implement verbatim; flag for the user.
* **Q3 — unreachable boards stay unreachable** (`Loc-Bathroom`, `Loc-Home-Alone`, `Trig-Rejection`; D038): the
  pickers still draw 5 and 9 options. Keep D038. For verification, prefer a mock-only deep link (e.g.
  `/urge?board=SOS-Loc-Bathroom`, honoured only when `EXPO_PUBLIC_FORCE_MOCK=1`) over D146's temporary source
  edits — orchestrator's call, since it adds a (dev-only) entry point.
* **Q4 — short screens** (§9.3): the canvas has one size; the lift rule is a proposal and should be decided once
  for every `HeroBoard`.
* **Kit vs frame contradictions** (frames win): `coping()` positions/sizes/CTAs/hero choices and the kit's
  `noise-dark.png @ 0.06` (§2).
* `Feel-Stressed`'s picker label is `Stressed or anxious`, but the bundle also draws a separate `Feel-Anxious` board
  reachable only by rotation — unchanged from the previous drop; no new mapping is implied.

---

## 12. Scratch tools (reuse them)

All in `.overhaul/understand/scratch-sos-boards/`:

| file | what it does |
|---|---|
| `SOS-*.txt` | `body.mjs` transcription of each of the 30 frames |
| `summarize.mjs` | groups the frames by skeleton (proves the 2 template variants) and prints each frame's strings |
| `vocab.mjs` | SVG tag/attr/colour census of the 30 heroes |
| `lines.mjs` → `lines.json` | renders each frame on `:8097`, prints rendered vs greedy line breaks and element rects |
| `widths.mjs` | Lato advance widths of given strings (for wrap-safety checks) |
| `bbox.mjs` | rendered art bounds per board in frame coordinates |
| `sizes.mjs` | text-vs-pill clearance at 375×667 / 390×844 / 393×852 / 430×932 |
| `oldnew.mjs`, `table.mjs` | copy diff vs the current `sosResponses.ts`; the §5 table |
| `montage.mjs`, `m-*.png` | contact sheets of the 30 design PNGs |

---

## 13. Verification plan for the implementers

* Design: `node scripts/overhaul/shot.mjs design Email-Login SOS-Loc-Bed.html .overhaul/shots/d-sos-loc-bed.png --sig=d-sos-loc-bed`
  (PNGs for all 30 already exist in `.overhaul/shots/design/Email-Login/`).
* App: `node scripts/overhaul/shot.mjs app /urge .overhaul/shots/a-sos-loc-bed.png --sig=a-sos-loc-bed --script=<drive>`
  then `pxdiff … --ignore=0,0,393,54;127,839,139,5` (status bar + home indicator) and `sigdiff`. Look at the strip:
  the hero must be visible (SVG trap), the halo of `paint-order` shapes must show (bed pillow, door leaf, kettle
  tray, padlock, charger dock, cursor).
* New drive template (after sos-flow's renames; one per board, `.overhaul/drives/b-SOS-<Key>.js`):
  ```js
  await __sleep(900);
  await waitFor('The first 90 seconds.'); await tap('Start');
  await waitFor('How strong is it right now?'); await tap('Continue');
  await waitFor('Where are you right now?'); await tap('In bed'); await tap('Continue');
  await waitFor('Where you are'); await waitFor('Get out of bed.');            // SOS-Loc-Bed
  // trigger boards: + tap('Continue'|'Done') on the place board, then
  //   waitFor('Move I of 3'); tap('Continue'); waitFor('Move II of 3'); tap('Continue');
  //   waitFor('Move III of 3'); tap('Continue'); waitFor('What’s feeding it right now?');
  //   tap('<trigger>'); tap('Continue'); waitFor('<board title>')
  // feeling boards: + trigger board CTA, waitFor('What’s underneath it?'), tap('<feeling>'), tap('Continue'),
  //   waitFor('<title>'); rotation-only boards: tap('Give me another') ×n
  ```
  Traps: three titles are shared with other screens (`Get out of bed.` Loc-Bed/Trig-Cant-Sleep; `Leave the room.`
  Trig-Alone/Move II; `Put the phone away.` Trig-Late-Phone/Move III) and the kickers are substrings of the
  picker titles (`What’s feeding it` ⊂ `What’s feeding it right now?`) — wait on the step before *and* the board
  title; for titles with a `\n` wait on the first line only.
* Sizes: repeat each variant (one Loc, one Feel incl. `SOS-Feel-Rejected`, `SOS-Feel-Unknown`, `SOS-Trig-Habit`)
  at `--w=375 --h=667`, `--w=390 --h=844`, `--w=430 --h=932`.
* Unreachable three: per Q3 (deep link) or D146's temporary map swap, then revert and diff the source.
