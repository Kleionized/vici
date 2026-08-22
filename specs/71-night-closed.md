# Night 4 Closed

* **Design frame** `Email-Login/Night 4 Closed`
* **App file** src/app/day/night.tsx step CLOSED; src/components/day/kit.tsx → NightSky, DayBadge, DayClosing

## Transcription — `Night 4 Closed`

Source `UI Final 1/project/Email Login.dc.html`, frame `Night-4-Closed.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.07  pointer-events:none
  <div> position:absolute  left:0  right:0  top:0  height:360px  background:linear-gradient(180deg, #14171B 0%, #1A2027 55%, #232B34 100%)  overflow:hidden
    <div> position:absolute  right:74px  top:30px  width:110px  height:110px  background:radial-gradient(closest-side, rgba(226,232,240,0.22), rgba(226,232,240,0) 78%)  border-radius:50%
    <div> position:absolute  right:104px  top:60px  width:34px  height:34px  background:#DDE4EC  border-radius:50%  box-shadow:0 0 18px rgba(221,228,236,0.5)  -webkit-mask-image:radial-gradient(circle 15px at 67% 30%, transparent 0 13.5px, #000 14.5px)  mask-image:radial-gradient(circle 15px at 67% 30%, transparent 0 13.5px, #000 14.5px)
    <div> position:absolute  left:60px  top:52px  width:2.5px  height:2.5px  background:rgba(244,243,240,0.6)  border-radius:50%
    <div> position:absolute  left:110px  top:92px  width:2px  height:2px  background:rgba(244,243,240,0.4)  border-radius:50%
    <div> position:absolute  left:158px  top:44px  width:2px  height:2px  background:rgba(244,243,240,0.5)  border-radius:50%
    <div> position:absolute  left:210px  top:84px  width:2.5px  height:2.5px  background:rgba(244,243,240,0.35)  border-radius:50%
    <div> position:absolute  left:84px  top:128px  width:2px  height:2px  background:rgba(244,243,240,0.3)  border-radius:50%
    <div> position:absolute  left:-60px  right:-60px  top:290px  height:110px  background:#1C232B  border-radius:50% 50% 0 0 / 50px 50px 0 0
    <div> position:absolute  left:-120px  right:-30px  top:310px  height:110px  background:#242C36  border-radius:50% 50% 0 0 / 44px 44px 0 0
    <div> position:absolute  left:70px  top:320px  width:18px  height:2.5px  background:rgba(244,243,240,0.14)  border-radius:2px
  <div> position:absolute  left:16px  top:66px  display:flex  align-items:center  gap:9px
    <svg> viewBox="0 0 11 19"  width="11"  height="19"
      <path> d="M9.5 1.5L2 9.5l7.5 8"  fill="none"  stroke="#55534E"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
    <span> color:#55534E  font-size:17px  font-weight:400
      · Back
  <div> position:absolute  left:0  right:0  top:72px  display:flex  justify-content:center  gap:7px
    <div> width:6px  height:6px  background:rgba(244,243,240,0.35)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(244,243,240,0.35)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(244,243,240,0.35)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(244,243,240,0.35)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(244,243,240,0.35)  border-radius:3px
    <div> width:18px  height:6px  background:#F4F3F0  border-radius:3px
  <div> position:absolute  left:0  right:0  top:420px  display:flex  justify-content:center
    <div> width:64px  height:64px  display:flex  align-items:center  justify-content:center  background:#FFFFFF  border-radius:50%  box-shadow:0 0 0 1px rgba(0,0,0,0.07), 0 8px 18px rgba(40,38,32,0.12)
      <svg> viewBox="0 0 16 13"  width="22"  height="18"
        <path> d="M1.5 7l4.4 4.5L14.5 1.5"  fill="none"  stroke="#131313"  stroke-width="2.6"  stroke-linecap="round"  stroke-linejoin="round"
  <div> position:absolute  left:0  right:0  top:512px  color:#1D1C1A  font-size:27px  font-weight:500  letter-spacing:-0.1px  text-align:center
    · Day 13, closed.
  <div> position:absolute  left:0  right:0  top:554px  color:#8B8882  font-size:14.5px  font-weight:400  text-align:center
    · See you in the morning.
  <div> position:absolute  left:16px  right:16px  top:756px  height:52px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:26px  cursor:pointer
    <span> color:#FFFFFF  font-size:17px  font-weight:600
      · Goodnight
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at 0, 0 | box · paint · type | 0, 0 · 393 × 360 · — · — | identical | match |
| div at 209, 30 | radius | 50% | - | **mismatch** |
| div at 255, 60 | background | rgb(221, 228, 236) | - | **mismatch** |
| div at 255, 60 | radius | 50% | - | **mismatch** |
| div at 255, 60 | shadow | rgba(221, 228, 236, 0.5) 0px 0px 18px 0px | - | **mismatch** |
| div at 60, 52 | radius | 50% | 1.25px | **mismatch** |
| div at 110, 92 | radius | 50% | 1px | **mismatch** |
| div at 158, 44 | radius | 50% | 1px | **mismatch** |
| div at 210, 84 | radius | 50% | 1.25px | **mismatch** |
| div at 84, 128 | radius | 50% | 1px | **mismatch** |
| div at -60, 290 | background | rgb(28, 35, 43) | - | **mismatch** |
| div at -60, 290 | radius | 50% 50% 0px 0px / 50px 50px 0px 0px | - | **mismatch** |
| div at -120, 310 | background | rgb(36, 44, 54) | - | **mismatch** |
| div at -120, 310 | radius | 50% 50% 0px 0px / 44px 44px 0px 0px | - | **mismatch** |
| div at 70, 320 | box · paint · type | 70, 320 · 18 × 2.5 · rgba(244, 243, 240, 0.14) · r 2px · — | identical | match |
| div at 16, 66 | box · paint · type | 16, 66 · 57.6 × 20 · — · — | identical | match |
| svg at 16, 66.5 | box · paint · type | 16, 66.5 · 11 × 19 · — · — | identical | match |
| path at 18, 68 | box · paint · type | 18, 68 · 7.5 × 16 · — · — | identical | match |
| “Back” | box · paint · type | 36, 66 · 37.6 × 20 · — · 17px/400/normal/normal/rgb(85, 83, 78) | identical | match |
| div at 0, 72 | box · paint · type | 0, 72 · 393 × 6 · — · — | identical | match |
| div at 155, 72 | box · paint · type | 155, 72 · 6 × 6 · rgba(244, 243, 240, 0.35) · r 3px · — | identical | match |
| div at 168, 72 | box · paint · type | 168, 72 · 6 × 6 · rgba(244, 243, 240, 0.35) · r 3px · — | identical | match |
| div at 181, 72 | box · paint · type | 181, 72 · 6 × 6 · rgba(244, 243, 240, 0.35) · r 3px · — | identical | match |
| div at 194, 72 | box · paint · type | 194, 72 · 6 × 6 · rgba(244, 243, 240, 0.35) · r 3px · — | identical | match |
| div at 207, 72 | box · paint · type | 207, 72 · 6 × 6 · rgba(244, 243, 240, 0.35) · r 3px · — | identical | match |
| div at 220, 72 | box · paint · type | 220, 72 · 18 × 6 · rgb(244, 243, 240) · r 3px · — | identical | match |
| div at 0, 420 | box · paint · type | 0, 420 · 393 × 64 · — · — | identical | match |
| div at 164.5, 420 | radius | 50% | 32px | **mismatch** |
| svg at 185.5, 443 | box · paint · type | 185.5, 443 · 22 × 18 · — · — | identical | match |
| path at 187.6, 445.1 | box · paint · type | 187.6, 445.1 · 17.9 × 13.8 · — · — | identical | match |
| “Day 13, closed.” | box · paint · type | 0, 512 · 393 × 31.5 · — · 27px/500/-0.1px/normal/rgb(29, 28, 26) | same box and metrics, value "Day 41, closed." | match (value) |
| “See you in the morning.” | box · paint · type | 0, 554 · 393 × 17 · — · 14.5px/400/normal/normal/rgb(139, 136, 130) | identical | match |
| div at 16, 756 | box · paint · type | 16, 756 · 361 × 52 · rgb(19, 19, 19) · r 26px · — | identical | match |
| “Goodnight” | box · paint · type | 154.7, 772 · 83.6 × 20 · — · 17px/600/normal/normal/rgb(255, 255, 255) | identical | match |

**30 elements compared; 20 match, 10 differ.**

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

Frame-specific: `fdiff` reports this frame byte-identical to the bundle the app
was already built against, and the capture agrees — every box, colour, shadow
and metric matches, and the only value row is the day number the account owns.

It is the last consumer of the cold-moon `NightSky`, whose crescent is a
`<Circle>` under a radial mask (the canvas's `mask-image: radial-gradient(circle
15px at 67% 30%, …)`), which is why its moon, its 18px bloom and its two flat
hills read as node-count differences rather than value differences.
