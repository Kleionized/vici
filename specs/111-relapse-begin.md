# Relapse Begin

* **Design frame** `Email-Login/Relapse Begin`
* **App file** src/app/relapse.tsx → BeginAgain

## Transcription — `Relapse Begin`

Source `UI Final 1/project/Email Login.dc.html`, frame `Relapse-Begin.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F0EFEB  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  left:0  right:0  top:0  bottom:0  background:linear-gradient(180deg, #F2E3D8 0%, #E4C6A8 39%, #FBFAF7 65%, #F0EFEB 82%)  overflow:hidden
    <div> position:absolute  left:-30px  top:-40px  width:150px  height:420px  background-image:url('noise-dark.png')  opacity:0.2  transform:rotate(24deg)  transform-origin:top center  -webkit-mask-image:linear-gradient(180deg, #000 30%, transparent)  mask-image:linear-gradient(180deg, #000 30%, transparent)
    <div> position:absolute  left:130px  top:-60px  width:140px  height:430px  background-image:url('noise-dark.png')  opacity:0.24  transform:rotate(6deg)  transform-origin:top center  -webkit-mask-image:linear-gradient(180deg, #000 30%, transparent)  mask-image:linear-gradient(180deg, #000 30%, transparent)
    <div> position:absolute  left:290px  top:-40px  width:150px  height:420px  background-image:url('noise-dark.png')  opacity:0.2  transform:rotate(-14deg)  transform-origin:top center  -webkit-mask-image:linear-gradient(180deg, #000 30%, transparent)  mask-image:linear-gradient(180deg, #000 30%, transparent)
    <div> position:absolute  left:0  right:0  top:0  height:558px  overflow:hidden
      <div> position:absolute  left:96px  top:368px  width:200px  height:200px  background:radial-gradient(circle at 50% 30%, #FBF2E2, #F0DBB4 65%, #DFC08B 100%)  border-radius:50%  overflow:hidden
        <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.5
      <div> position:absolute  left:56px  top:328px  width:280px  height:280px  background:radial-gradient(closest-side, rgba(250,236,210,0.5), rgba(250,236,210,0) 72%)  border-radius:50%
    <div> position:absolute  left:0  right:0  top:542px  height:32px  background:linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)
    <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.10
  <div> position:absolute  left:16px  top:64px  display:flex  align-items:center  gap:9px  z-index:5
    <svg> viewBox="0 0 11 19"  width="11"  height="19"
      <path> d="M9.5 1.5L2 9.5l7.5 8"  fill="none"  stroke="#2A2924"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
    <span> color:#2A2924  font-size:17px  font-weight:400
      · Back
  <div> position:absolute  left:40px  right:40px  top:128px  z-index:5  color:#1D1C1A  font-size:22px  font-weight:500  line-height:32px  text-align:center
    · The day is still yours.
  <div> position:absolute  left:30px  right:30px  top:204px  z-index:5  color:#55534E  font-size:14px  font-weight:400  text-align:center
    · One part of it went wrong. Nothing else has to.
  <div> position:absolute  left:16px  top:756px  width:361px  height:48px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:25px  z-index:5  cursor:pointer
    <span> color:#FFFFFF  font-size:17.5px  font-weight:600  letter-spacing:0.2px
      · Start again
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at -194.3, -70.5 | opacity | 0.2 | - | **mismatch** |
| div at 85.4, -67.3 | opacity | 0.24 | - | **mismatch** |
| div at 292.2, -58.1 | opacity | 0.2 | - | **mismatch** |
| div at 0, 0 | box · paint · type | 0, 0 · 393 × 558 · — · — | identical | match |
| div at 96, 368 | x | 96 | 96.5 | **mismatch** |
| div at 96, 368 | radius | 50% | 100px | **mismatch** |
| div at 56, 328 | x | 56 | 56.5 | **mismatch** |
| div at 56, 328 | radius | 50% | - | **mismatch** |
| div at 0, 542 | box · paint · type | 0, 542 · 393 × 32 · — · — | identical | match |
| div at 16, 64 | box · paint · type | 16, 64 · 57.6 × 20 · — · — | identical | match |
| svg at 16, 64.5 | box · paint · type | 16, 64.5 · 11 × 19 · — · — | identical | match |
| path at 18, 66 | box · paint · type | 18, 66 · 7.5 × 16 · — · — | identical | match |
| “Back” | box · paint · type | 36, 64 · 37.6 × 20 · — · 17px/400/normal/normal/rgb(42, 41, 36) | identical | match |
| “The day is still yours.” | box · paint · type | 40, 128 · 313 × 32 · — · 22px/500/normal/32px/rgb(29, 28, 26) | identical | match |
| “One part of it went wrong. Nothing else has to.” | box · paint · type | 30, 204 · 333 × 16.5 · — · 14px/400/normal/normal/rgb(85, 83, 78) | identical | match |
| div at 16, 756 | box · paint · type | 16, 756 · 361 × 48 · rgb(19, 19, 19) · r 25px · — | identical | match |
| “Start again” | box · paint · type | 150.7, 769.8 · 91.7 × 20.5 · — · 17.5px/600/0.2px/normal/rgb(255, 255, 255) | identical | match |

**15 elements compared; 10 match, 5 differ.**

## Reading — every row that is not `match`

The classes that differ without the screen differing, all recorded in
`DECISIONS.md`:

* **`radius: 50% → <n>px`** (D015) — React Native's `borderRadius` is a number.
  Every one is half the box's shorter side.
* **`radius: 50% → -` with a node count of 1 against 3** (D015) — a CSS
  `radial-gradient` div is `<Svg><Ellipse fill="url(#…)">`: three nodes on one
  rect. The canvas blurs several of these 4–5px; a closest-side radial already
  dies at its own edge, so the blur term is dropped (D010) rather than faked.
* **`bg: <colour> → -`** where the canvas's box became an SVG shape — the paint
  moves to `fill`, which the probe does not read as a background.
* **The canvas's painted `<span>` is the app's View plus Text** (D022).
* **`opacity: 0.07 → -`** on grain (D019).

A row marked **match (value)** is the account's rather than the canvas's.
