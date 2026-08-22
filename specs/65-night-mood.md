# Night 1 Mood

* **Design frame** `Email-Login/Night 1 Mood`
* **App file** src/app/day/night.tsx step MOOD; src/components/day/kit.tsx → WarmNightSky, MoodDial, ScaleReading

## Transcription — `Night 1 Mood`

Source `UI Final 1/project/Email Login.dc.html`, frame `Night-1-Mood.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.07  pointer-events:none
  <div> position:absolute  left:0  right:0  top:0  height:212px  background:linear-gradient(180deg, #171A20 0%, #202129 55%, #33302B 100%)  overflow:hidden
    <div> position:absolute  left:96px  top:44px  width:2.5px  height:2.5px  background:rgba(226,232,240,0.6)  border-radius:50%
    <div> position:absolute  left:238px  top:30px  width:2px  height:2px  background:rgba(226,232,240,0.45)  border-radius:50%
    <div> position:absolute  left:300px  top:70px  width:2px  height:2px  background:rgba(226,232,240,0.35)  border-radius:50%
    <div> position:absolute  left:50%  top:24px  width:200px  height:200px  margin-left:-100px  background:radial-gradient(closest-side, rgba(214,140,100,0.42), rgba(214,140,100,0) 72%)  border-radius:50%  filter:blur(4px)
    <div> position:absolute  left:50%  top:118px  width:44px  height:44px  margin-left:-22px  background:#E8B488  border-radius:50%
    <div> position:absolute  left:-60px  right:-60px  top:138px  height:110px  background:linear-gradient(180deg, #232830 0%, #232830 45%, rgba(35,40,48,0) 100%)  border-radius:50% 50% 0 0 / 46px 46px 0 0
    <div> position:absolute  left:-120px  right:-30px  top:158px  height:110px  background:linear-gradient(180deg, #1C2129 0%, #1C2129 50%, rgba(28,33,41,0) 100%)  border-radius:50% 50% 0 0 / 44px 44px 0 0
    <div> position:absolute  left:70px  top:180px  width:18px  height:2.5px  background:rgba(244,243,240,0.12)  border-radius:2px
  <div> position:absolute  left:16px  top:66px  display:flex  align-items:center  gap:9px
    <svg> viewBox="0 0 11 19"  width="11"  height="19"
      <path> d="M9.5 1.5L2 9.5l7.5 8"  fill="none"  stroke="#55534E"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
    <span> color:#55534E  font-size:17px  font-weight:400
      · Back
  <div> position:absolute  left:0  right:0  top:72px  display:flex  justify-content:center  gap:7px
    <div> width:18px  height:6px  background:#F4F3F0  border-radius:3px
    <div> width:6px  height:6px  background:rgba(244,243,240,0.35)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(244,243,240,0.35)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(244,243,240,0.35)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(244,243,240,0.35)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(244,243,240,0.35)  border-radius:3px
  <div> position:absolute  left:16px  right:16px  top:756px  height:52px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:26px  cursor:pointer
    <span> color:#FFFFFF  font-size:17px  font-weight:600
      · Continue
  <div> position:absolute  left:24px  top:270px  color:#1D1C1A  font-size:27px  font-weight:500  letter-spacing:-0.1px
    · How was today?
  <div> position:absolute  left:0  right:0  top:502px  color:#1D1C1A  font-size:19px  font-weight:600  text-align:center
    · Mixed
  <div> position:absolute  left:0  right:0  top:532px  color:#8B8882  font-size:13.5px  font-weight:400  text-align:center
    · Some of both
  <div> position:absolute  left:24px  right:24px  top:380px  display:flex  justify-content:space-between
    <div> width:48px  height:48px  background:#FFFFFF  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.12)
    <div> width:48px  height:48px  background:#FFFFFF  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.12)
    <div> width:48px  height:48px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:50%  box-shadow:0 0 0 2px #F4F3F0, 0 0 0 4px #131313
      <div> width:11px  height:11px  background:#F4F3F0  border-radius:50%
    <div> width:48px  height:48px  background:#FFFFFF  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.12)
    <div> width:48px  height:48px  background:#FFFFFF  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.12)
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at 0, 0 | box · paint · type | 0, 0 · 393 × 212 · — · — | identical | match |
| div at 96, 44 | radius | 50% | 1.25px | **mismatch** |
| div at 238, 30 | radius | 50% | 1px | **mismatch** |
| div at 300, 70 | radius | 50% | 1px | **mismatch** |
| div at 96.5, 24 | radius | 50% | - | **mismatch** |
| div at 174.5, 118 | radius | 50% | 22px | **mismatch** |
| div at -60, 138 | radius | 50% 50% 0px 0px / 46px 46px 0px 0px | - | **mismatch** |
| div at -120, 158 | radius | 50% 50% 0px 0px / 44px 44px 0px 0px | - | **mismatch** |
| div at 70, 180 | box · paint · type | 70, 180 · 18 × 2.5 · rgba(244, 243, 240, 0.12) · r 2px · — | identical | match |
| div at 16, 66 | box · paint · type | 16, 66 · 57.6 × 20 · — · — | identical | match |
| svg at 16, 66.5 | box · paint · type | 16, 66.5 · 11 × 19 · — · — | identical | match |
| path at 18, 68 | box · paint · type | 18, 68 · 7.5 × 16 · — · — | identical | match |
| “Back” | box · paint · type | 36, 66 · 37.6 × 20 · — · 17px/400/normal/normal/rgb(85, 83, 78) | identical | match |
| div at 0, 72 | box · paint · type | 0, 72 · 393 × 6 · — · — | identical | match |
| div at 155, 72 | box · paint · type | 155, 72 · 18 × 6 · rgb(244, 243, 240) · r 3px · — | identical | match |
| div at 180, 72 | box · paint · type | 180, 72 · 6 × 6 · rgba(244, 243, 240, 0.35) · r 3px · — | identical | match |
| div at 193, 72 | box · paint · type | 193, 72 · 6 × 6 · rgba(244, 243, 240, 0.35) · r 3px · — | identical | match |
| div at 206, 72 | box · paint · type | 206, 72 · 6 × 6 · rgba(244, 243, 240, 0.35) · r 3px · — | identical | match |
| div at 219, 72 | box · paint · type | 219, 72 · 6 × 6 · rgba(244, 243, 240, 0.35) · r 3px · — | identical | match |
| div at 232, 72 | box · paint · type | 232, 72 · 6 × 6 · rgba(244, 243, 240, 0.35) · r 3px · — | identical | match |
| div at 16, 756 | box · paint · type | 16, 756 · 361 × 52 · rgb(19, 19, 19) · r 26px · — | identical | match |
| “Continue” | box · paint · type | 160.5, 772 · 72.1 × 20 · — · 17px/600/normal/normal/rgb(255, 255, 255) | identical | match |
| “How was today?” | box · paint · type | 24, 270 · 194.5 × 31.5 · — · 27px/500/-0.1px/normal/rgb(29, 28, 26) | identical | match |
| “Mixed” | box · paint · type | 0, 502 · 393 × 22.5 · — · 19px/600/normal/normal/rgb(29, 28, 26) | identical | match |
| “Some of both” | box · paint · type | 0, 532 · 393 × 16 · — · 13.5px/400/normal/normal/rgb(139, 136, 130) | identical | match |
| div at 24, 380 | box · paint · type | 24, 380 · 345 × 48 · — · — | identical | match |
| div at 24, 380 | radius | 50% | 24px | **mismatch** |
| div at 98.3, 380 | radius | 50% | 24px | **mismatch** |
| div at 172.5, 380 | radius | 50% | 24px | **mismatch** |
| div at 191, 398.5 | radius | 50% | 5.5px | **mismatch** |
| div at 246.8, 380 | radius | 50% | 24px | **mismatch** |
| div at 321, 380 | radius | 50% | 24px | **mismatch** |

**32 elements compared; 19 match, 13 differ.**

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

Frame-specific notes, all implemented as drawn:

* The sky is a **new drawing**, not a recolour of `NightSky`: the horizon browns
  off (`#33302B` where the closing frame keeps `#232B34`), the crescent moon is
  replaced by a plain `#E8B488` disc, five stars become three on an
  `rgba(226,232,240,·)` base rather than `rgba(244,243,240,·)`, both hills fade
  out instead of filling flat, and the ridge light sits at `hillTop + 42`, not
  the `+ 30` the closing frame uses. It is built as a second component,
  `WarmNightSky`, so `21E6 · Night — Closed` keeps the cold sky it still draws.
* **Paint order is inverted.** The old sky drew glow → moon → stars; this frame
  draws stars → glow → disc, so the warm glow lies over the three stars and
  tints them. The 200×200 glow at `top: 24` covers all three.
* **The hills swapped relative value**: the front hill is now the lighter
  `#232830` over a darker `#1C2129`, where the previous bundle had the darker in
  front.
* The canvas puts `filter: blur(4px)` on the glow. React Native has no filter
  primitive (`DECISIONS.md` D010); a closest-side radial already dies at its own
  edge and its falloff carries the softening, so the blur term is dropped and
  the stops are drawn as stated.
