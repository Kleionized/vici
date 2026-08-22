# Morning Resign Pledge

* **Design frame** `Email-Login/Morning Resign Pledge`
* **App file** src/app/day/morning.tsx step PLEDGE; src/components/day/kit.tsx → MorningSky

## Transcription — `Morning Resign Pledge`

Source `UI Final 1/project/Email Login.dc.html`, frame `Morning-Resign-Pledge.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.07  pointer-events:none
  <div> position:absolute  left:16px  top:66px  display:flex  align-items:center  gap:9px
    <svg> viewBox="0 0 11 19"  width="11"  height="19"
      <path> d="M9.5 1.5L2 9.5l7.5 8"  fill="none"  stroke="#55534E"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
    <span> color:#55534E  font-size:17px  font-weight:400
      · Back
  <div> position:absolute  left:0  right:0  top:72px  display:flex  justify-content:center  gap:7px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:18px  height:6px  background:#131313  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
  <div> position:absolute  left:50%  top:-13px  width:260px  height:260px  margin-left:-130px  background:radial-gradient(closest-side, rgba(226,176,104,0.32), rgba(226,176,104,0) 72%)  border-radius:50%  filter:blur(4px)
  <div> position:absolute  left:50%  top:92px  width:50px  height:50px  margin-left:-25px  background:#E9D2A4  border-radius:50%
  <div> position:absolute  left:-80px  right:-80px  top:150px  height:150px  background:linear-gradient(180deg, #EAE8DF 0%, rgba(244,243,240,0) 80%)  border-radius:50% 50% 0 0 / 88px 88px 0 0
  <div> position:absolute  left:-150px  right:-50px  top:172px  height:150px  background:linear-gradient(180deg, #E2E0D6 0%, rgba(244,243,240,0) 80%)  border-radius:50% 50% 0 0 / 70px 70px 0 0
  <div> position:absolute  left:24px  top:270px  color:#1D1C1A  font-size:27px  font-weight:500  letter-spacing:-0.1px
    · Re-sign your pledge.
  <div> position:absolute  left:0  right:0  top:330px  color:#C9C6BE  font-family:Georgia,'Times New Roman',serif  font-size:46px  line-height:1  text-align:center
    · “
  <div> position:absolute  left:44px  right:44px  top:378px  color:#1D1C1A  font-size:21px  font-weight:500  line-height:31px  text-align:center  text-wrap:balance
    · The mornings are mine again.
  <div> position:absolute  left:0  right:0  top:548px  transform:rotate(-3deg)  color:#C9C6BE  font-family:'Snell Roundhand','Savoye LET','Segoe Script',cursive  font-size:42px  line-height:1  text-align:center
    · Jerry
  <div> position:absolute  left:64px  right:64px  top:616px  height:1.5px  background:#131313
  <div> position:absolute  left:0  right:0  top:716px  color:#8B8882  font-size:13.5px  font-weight:500  text-align:center  cursor:pointer
    · Change the pledge
  <div> position:absolute  left:16px  right:16px  top:756px  height:52px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:26px  cursor:pointer
    <span> color:#FFFFFF  font-size:17px  font-weight:600
      · Sign for today
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at 16, 66 | box · paint · type | 16, 66 · 57.6 × 20 · — · — | identical | match |
| svg at 16, 66.5 | box · paint · type | 16, 66.5 · 11 × 19 · — · — | identical | match |
| path at 18, 68 | box · paint · type | 18, 68 · 7.5 × 16 · — · — | identical | match |
| “Back” | box · paint · type | 36, 66 · 37.6 × 20 · — · 17px/400/normal/normal/rgb(85, 83, 78) | identical | match |
| div at 0, 72 | box · paint · type | 0, 72 · 393 × 6 · — · — | identical | match |
| div at 155, 72 | box · paint · type | 155, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 168, 72 | box · paint · type | 168, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 181, 72 | box · paint · type | 181, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 194, 72 | box · paint · type | 194, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 207, 72 | box · paint · type | 207, 72 · 18 × 6 · rgb(19, 19, 19) · r 3px · — | identical | match |
| div at 232, 72 | box · paint · type | 232, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 66.5, -13 | radius | 50% | - | **mismatch** |
| div at 171.5, 92 | radius | 50% | 25px | **mismatch** |
| div at -80, 150 | radius | 50% 50% 0px 0px / 88px 88px 0px 0px | - | **mismatch** |
| div at -150, 172 | radius | 50% 50% 0px 0px / 70px 70px 0px 0px | - | **mismatch** |
| “Re-sign your pledge.” | box · paint · type | 24, 270 · 244.9 × 31.5 · — · 27px/500/-0.1px/normal/rgb(29, 28, 26) | identical | match |
| ““” | box · paint · type | 0, 330 · 393 × 46 · — · 46px/400/normal/46px/rgb(201, 198, 190) | identical | match |
| “The mornings are mine again.” | box · paint · type | 44, 378 · 305 × 31 · — · 21px/500/normal/31px/rgb(29, 28, 26) | identical | match |
| “Jerry” | box · paint · type | -0.8, 537.7 · 394.7 × 62.5 · — · 42px/400/normal/42px/rgb(201, 198, 190) | same box and metrics, value "Marcus" | match (value) |
| div at 64, 616 | box · paint · type | 64, 616 · 265 × 1.5 · rgb(19, 19, 19) · — | identical | match |
| “Change the pledge” | box · paint · type | 0, 716 · 393 × 16 · — · 13.5px/500/normal/normal/rgb(139, 136, 130) | identical | match |
| div at 16, 756 | box · paint · type | 16, 756 · 361 × 52 · rgb(19, 19, 19) · r 26px · — | identical | match |
| “Sign for today” | box · paint · type | 140.9, 772 · 111.2 × 20 · — · 17px/600/normal/normal/rgb(255, 255, 255) | identical | match |

**23 elements compared; 19 match, 4 differ.**

## Reading — every row that is not `match`

Three classes of row differ without the screen differing — `DECISIONS.md` D015,
D019 and D022 — plus the account's own values:

* **`radius: 50% → <n>px`.** React Native's `borderRadius` is a number, not a
  percentage; every one is exactly half the box's shorter side.
* **`radius: 50% → -` with a node count of 1 against 3.** A CSS
  `radial-gradient` div is drawn as `<Svg><Circle fill="url(#…)">` — a View, an
  Svg and a Circle on the same rect. The canvas also blurs these 4px; a
  closest-side radial already dies at its own edge, so the blur term is dropped
  (D010).
* **`radius: 50% 50% 0 0 / Npx … → -`.** An elliptical corner radius cannot be
  expressed in React Native, so each hill is an SVG arc drawn by
  `src/components/ui/Hill.tsx`. Same rect, same silhouette, three nodes.
* **`opacity: 0.07 → -`** on the grain: `expo-image` carries the opacity on the
  image and leaves its wrapper plain (D019).

A row marked **match (value)** is the account's rather than the canvas's: same
box, same colour, same type metrics, different characters. The frames are drawn
against a sample account on day 13 named Jerry; the seeded one is on day 41 and
named Marcus.

Frame-specific: this screen was rebuilt from nothing. The app's compose-a-pledge
card — its reroll glyph, its three `OPENERS`, its italic opener line, its
multiline field and the `SignaturePad` under it — is withdrawn whole; composing
now happens in the sheet behind this page's link
(`specs/62-change-pledge-sheet.md`).

What is drawn instead is the standing pledge set in type: a `#C9C6BE` Georgia
quote mark at 276, the pledge body centred at `left: 44 right: 44 top: 324` in
21/500 on a 31 line, the signature at 494 in `fonts.script` at 42, rotated −3°,
a full-ink 1.5pt rule at 562, a "Change the pledge" link at 662, and the pill
**"Sign for today"**.

The pledge body is data, not a literal — the same string is drawn on five frames
in the bundle and the app reads it off the journal entry tagged `Pledge`. The
signature is `user.displayName`; the canvas's "Jerry" is the seeded account's
"Marcus" here.

The signature's colour is the one value on this frame that had to be decided
rather than transcribed — see `DECISIONS.md` D031. The canvas draws only the
ghost.

This frame's sky carries no clouds, which no other sky in the group omits.

One more thing the audit of `.uifinal1/gaps/morning.md` turned up and this spec
records: `Relapse-Resign.html` draws the **same pledge sentence** with the
signature in full `#1D1C1A` under a pill that says "Sign it again". That is the
signed state of this act, in this bundle, and it is what D031 takes the inked
colour from.
