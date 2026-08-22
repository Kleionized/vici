# Checkin Emotions

* **Design frame** `Email-Login/Checkin Emotions`
* **App file** src/components/MoodLogger.tsx → EmotionsBoard

## Transcription — `Checkin Emotions`

Source `UI Final 1/project/Email Login.dc.html`, frame `Checkin-Emotions.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
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
    <div> width:18px  height:6px  background:#131313  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
  <div> position:absolute  left:0  right:0  top:118px  color:#1D1C1A  font-size:22px  font-weight:500  letter-spacing:0.1px  text-align:center
    · What did today feel like?
  <div> position:absolute  left:0  right:0  top:158px  color:#55534E  font-size:15px  font-weight:400  text-align:center
    · Pick any that ring true.
  <div> position:absolute  left:24px  right:24px  top:218px  height:54px  padding:0 18px  display:flex  align-items:center  gap:14px  background:#FFFFFF  border-radius:16px  box-shadow:0 0 0 1.6px #131313  cursor:pointer
    <span> flex:1  color:#1D1C1A  font-size:15px  font-weight:600
      · Calm
    <div> width:24px  height:24px  display:flex  flex-shrink:0  align-items:center  justify-content:center  background:#131313  border-radius:50%
      <svg> viewBox="0 0 12 10"  width="12"  height="10"
        <path> d="M1.5 5L4.5 8L10.5 1.5"  fill="none"  stroke="#FFFFFF"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
  <div> position:absolute  left:24px  right:24px  top:282px  height:54px  padding:0 18px  display:flex  align-items:center  gap:14px  background:#FFFFFF  border-radius:16px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
    <span> flex:1  color:#1D1C1A  font-size:15px  font-weight:500
      · Tense
    <div> width:24px  height:24px  box-sizing:border-box  flex-shrink:0  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.22)
  <div> position:absolute  left:24px  right:24px  top:346px  height:54px  padding:0 18px  display:flex  align-items:center  gap:14px  background:#FFFFFF  border-radius:16px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
    <span> flex:1  color:#1D1C1A  font-size:15px  font-weight:500
      · Tired
    <div> width:24px  height:24px  box-sizing:border-box  flex-shrink:0  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.22)
  <div> position:absolute  left:24px  right:24px  top:410px  height:54px  padding:0 18px  display:flex  align-items:center  gap:14px  background:#FFFFFF  border-radius:16px  box-shadow:0 0 0 1.6px #131313  cursor:pointer
    <span> flex:1  color:#1D1C1A  font-size:15px  font-weight:600
      · Hopeful
    <div> width:24px  height:24px  display:flex  flex-shrink:0  align-items:center  justify-content:center  background:#131313  border-radius:50%
      <svg> viewBox="0 0 12 10"  width="12"  height="10"
        <path> d="M1.5 5L4.5 8L10.5 1.5"  fill="none"  stroke="#FFFFFF"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
  <div> position:absolute  left:24px  right:24px  top:474px  height:54px  padding:0 18px  display:flex  align-items:center  gap:14px  background:#FFFFFF  border-radius:16px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
    <span> flex:1  color:#1D1C1A  font-size:15px  font-weight:500
      · Flat
    <div> width:24px  height:24px  box-sizing:border-box  flex-shrink:0  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.22)
  <div> position:absolute  left:24px  right:24px  top:538px  height:54px  padding:0 18px  display:flex  align-items:center  gap:14px  background:#FFFFFF  border-radius:16px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
    <span> flex:1  color:#1D1C1A  font-size:15px  font-weight:500
      · Proud
    <div> width:24px  height:24px  box-sizing:border-box  flex-shrink:0  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.22)
  <div> position:absolute  left:24px  right:24px  top:602px  height:54px  padding:0 18px  display:flex  align-items:center  gap:14px  background:#FFFFFF  border-radius:16px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
    <span> flex:1  color:#1D1C1A  font-size:15px  font-weight:500
      · Lonely
    <div> width:24px  height:24px  box-sizing:border-box  flex-shrink:0  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.22)
  <div> position:absolute  left:24px  right:24px  top:666px  height:54px  padding:0 18px  display:flex  align-items:center  gap:14px  background:#FFFFFF  border-radius:16px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
    <span> flex:1  color:#1D1C1A  font-size:15px  font-weight:500
      · Restless
    <div> width:24px  height:24px  box-sizing:border-box  flex-shrink:0  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.22)
  <div> position:absolute  left:24px  right:24px  top:744px  height:58px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:29px  cursor:pointer
    <span> color:#FFFFFF  font-size:17px  font-weight:600  letter-spacing:0.2px
      · Continue
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
| div at 168, 72 | box · paint · type | 168, 72 · 18 × 6 · rgb(19, 19, 19) · r 3px · — | identical | match |
| div at 193, 72 | box · paint · type | 193, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 206, 72 | box · paint · type | 206, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 219, 72 | box · paint · type | 219, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 232, 72 | box · paint · type | 232, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| “What did today feel like?” | box · paint · type | 0, 118 · 393 × 26 · — · 22px/500/0.1px/normal/rgb(29, 28, 26) | identical | match |
| “Pick any that ring true.” | box · paint · type | 0, 158 · 393 × 17.5 · — · 15px/400/normal/normal/rgb(85, 83, 78) | identical | match |
| div at 24, 218 | box · paint · type | 24, 218 · 345 × 54 · rgb(255, 255, 255) · r 16px · rgb(19, 19, 19) 0px 0px 0px 1.6px · — | identical | match |
| “Calm” | box · paint · type | 42, 236.3 · 271 × 17.5 · — · 15px/600/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 327, 233 | radius | 50% | 12px | **mismatch** |
| svg at 333, 240 | box · paint · type | 333, 240 · 12 × 10 · — · — | identical | match |
| path at 334.5, 241.5 | box · paint · type | 334.5, 241.5 · 9 × 6.5 · — · — | identical | match |
| div at 24, 282 | box · paint · type | 24, 282 · 345 × 54 · rgb(255, 255, 255) · r 16px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| “Tense” | box · paint · type | 42, 300.3 · 271 × 17.5 · — · 15px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 327, 297 | radius | 50% | 12px | **mismatch** |
| div at 24, 346 | box · paint · type | 24, 346 · 345 × 54 · rgb(255, 255, 255) · r 16px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| “Tired” | box · paint · type | 42, 364.3 · 271 × 17.5 · — · 15px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 327, 361 | radius | 50% | 12px | **mismatch** |
| div at 24, 410 | box · paint · type | 24, 410 · 345 × 54 · rgb(255, 255, 255) · r 16px · rgb(19, 19, 19) 0px 0px 0px 1.6px · — | identical | match |
| “Hopeful” | box · paint · type | 42, 428.3 · 271 × 17.5 · — · 15px/600/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 327, 425 | radius | 50% | 12px | **mismatch** |
| svg at 333, 432 | box · paint · type | 333, 432 · 12 × 10 · — · — | identical | match |
| path at 334.5, 433.5 | box · paint · type | 334.5, 433.5 · 9 × 6.5 · — · — | identical | match |
| div at 24, 474 | box · paint · type | 24, 474 · 345 × 54 · rgb(255, 255, 255) · r 16px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| “Flat” | box · paint · type | 42, 492.3 · 271 × 17.5 · — · 15px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 327, 489 | radius | 50% | 12px | **mismatch** |
| div at 24, 538 | box · paint · type | 24, 538 · 345 × 54 · rgb(255, 255, 255) · r 16px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| “Proud” | box · paint · type | 42, 556.3 · 271 × 17.5 · — · 15px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 327, 553 | radius | 50% | 12px | **mismatch** |
| div at 24, 602 | box · paint · type | 24, 602 · 345 × 54 · rgb(255, 255, 255) · r 16px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| “Lonely” | box · paint · type | 42, 620.3 · 271 × 17.5 · — · 15px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 327, 617 | radius | 50% | 12px | **mismatch** |
| div at 24, 666 | box · paint · type | 24, 666 · 345 × 54 · rgb(255, 255, 255) · r 16px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| “Restless” | box · paint · type | 42, 684.3 · 271 × 17.5 · — · 15px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 327, 681 | radius | 50% | 12px | **mismatch** |
| div at 24, 744 | box · paint · type | 24, 744 · 345 × 58 · rgb(19, 19, 19) · r 29px · — | identical | match |
| “Continue” | box · paint · type | 159.7, 763 · 73.7 × 20 · — · 17px/600/0.2px/normal/rgb(255, 255, 255) | identical | match |

**43 elements compared; 35 match, 8 differ.**

## Reading — every row that is not `match`

Three classes of row can differ without the screen differing, and they are the
only classes present unless a row below says otherwise. `DECISIONS.md` D015
names them:

* **`radius: 50% → <n>px`.** React Native's `borderRadius` takes a number, not a
  percentage. Every one of these is exactly half the box's shorter side, so the
  painted shape is the same circle; only the notation differs.
* **`radius: 50% → -` with a node-count of 1 against 3.** A CSS
  `radial-gradient` on a `<div>` has no React Native equivalent; it is drawn as
  an `<Svg><Circle fill="url(#…)">`, which is a View, an Svg and a Circle on the
  same rect where the canvas has one div. The rect, and the gradient's stops,
  are identical.
* **`radius: 50% 50% 0 0 / Npx Npx 0 0 → -`.** An elliptical corner radius
  cannot be expressed in React Native at all, so the hill is drawn as an SVG arc
  by `src/components/ui/Hill.tsx`. Same rect, same silhouette, three nodes
  instead of one.

A row marked **match (value)** is a value the account owns rather than the
canvas: the box, the colour and the type metrics are identical and only the
characters differ, because the frame is drawn against a sample account and the
app is drawing the seeded one (`scripts/uifinal1/seed.mjs`).

Frame-specific: this frame was redrawn from scratch. The eight-sector wheel —
its `viewBox="38 244 316 316"` svg, its eight sector paths, the `r=44` hub
circle, the eight 88-wide labels and the four-layer `HubScene` inside the 64pt
disc — is deleted, and eight stacked pill rows take its place on a 64 pitch from
`top: 218`. The vocabulary is now **fixed** (Calm, Tense, Tired, Hopeful, Flat,
Proud, Lonely, Restless) rather than one of five sets keyed to the mood just
logged, so `WHEELS`, `wheelFor()`, `EmotionWheel`, `HubScene`, `FeelingChip`,
`ALL_FEELINGS` and the "Something else…" composer are all removed from
`src/components/MoodLogger.tsx` rather than left unreferenced.

The sub-line over the rows reads **"Pick any that ring true."** and the second
line the previous bundle put under the wheel at `top: 582` — "Pick as many as
fit." — is gone.
