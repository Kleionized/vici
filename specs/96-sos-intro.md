# Cue Intro Modal

* **Design frame** `Email-Login/Cue Intro Modal`
* **App file** src/components/urge/index.tsx → UrgeFlow → IntroPage

## Transcription — `Cue Intro Modal`

Source `UI Final 1/project/Email Login.dc.html`, frame `Cue-Intro-Modal.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  left:0  right:0  top:52px  bottom:0  background:#F4F3F0  overflow:hidden
    <svg> viewBox="0 0 20 20"  width="20"  height="20"  position:absolute  right:22px  top:18px
      <path> d="M3 3l14 14M17 3L3 17"  stroke="#55534E"  stroke-width="2"  stroke-linecap="round"
    <div> position:absolute  left:96px  top:150px  width:200px  height:280px  background:radial-gradient(closest-side, rgba(220,222,216,0.28), rgba(220,222,216,0) 75%)  border-radius:50%  filter:blur(8px)
    <div> position:absolute  left:76px  top:170px  width:240px  height:250px
      <div> position:absolute  inset:0  overflow:hidden
        <div> position:absolute  left:58px  top:64px  width:124px  height:124px  background:radial-gradient(closest-side,rgba(226,186,120,0.45),rgba(226,186,120,0) 74%)  border-radius:50%  filter:blur(4px)
        <div> position:absolute  left:152px  top:22px  width:42px  height:42px  background:#DCDED8  border-radius:50%
        <div> position:absolute  left:142px  top:14px  width:42px  height:42px  background:#F4F3F0  border-radius:50%
        <div> position:absolute  left:70px  top:152px  width:100px  height:32px  background:#E0DFDA  border-radius:10px 10px 4px 4px
        <div> position:absolute  left:76px  top:144px  width:50px  height:16px  background:#C6C5C0  border-radius:8px
        <div> position:absolute  left:64px  top:152px  width:6px  height:54px  background:#D6D5D0  border-radius:3px
        <div> position:absolute  left:170px  top:152px  width:6px  height:54px  background:#D6D5D0  border-radius:3px
        <div> position:absolute  left:58px  top:202px  width:130px  height:14px  background:rgba(0,0,0,0.09)  border-radius:50%  filter:blur(5px)
        <div> position:absolute  left:78px  top:160px  width:84px  height:8px  background:#D6D5D0  border-radius:4px
        <div> position:absolute  left:186px  top:120px  width:38px  height:38px  display:flex  align-items:center  justify-content:center  background:#F7F6F2  border-radius:50%  box-shadow:0 0 0 1px rgba(0,0,0,0.08), 0 6px 14px rgba(40,38,32,0.14)
          <svg> viewBox="0 0 24 24"  width="22"  height="22"  fill="none"
            <circle> cx="12"  cy="12"  r="9"  stroke="#3A3934"  stroke-width="1.8"
            <path> d="M12 12V6.5A5.5 5.5 0 0 1 17.5 12z"  fill="#3A3934"
    <div> position:absolute  left:88px  top:112px  width:2px  height:2px  background:rgba(200,225,235,0.4)  border-radius:50%
    <div> position:absolute  left:296px  top:88px  width:2px  height:2px  background:rgba(200,225,235,0.3)  border-radius:50%
    <div> position:absolute  left:250px  top:180px  width:2px  height:2px  background:rgba(200,225,235,0.25)  border-radius:50%
    <div> position:absolute  left:0  right:0  top:500px  color:#1D1C1A  font-size:22px  font-weight:500  letter-spacing:0.1px  text-align:center
      · The First 90 Seconds
    <div> position:absolute  left:30px  right:30px  top:552px  color:#55534E  font-size:15.5px  font-weight:400  line-height:23px  text-align:center  text-wrap:pretty
      · A universal interrupt for the moment the wave hits. Six small moves — decide nothing until it passes.
    <div> position:absolute  left:24px  right:24px  top:692px  height:52px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:26px  cursor:pointer
      <span> color:#FFFFFF  font-size:17.5px  font-weight:600  letter-spacing:0.3px
        · Start the interrupt
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at 0, 52 | box · paint · type | 0, 52 · 393 × 800 · rgb(244, 243, 240) · — | identical | match |
| svg at 351, 70 | box · paint · type | 351, 70 · 20 × 20 · — · — | identical | match |
| path at 354, 73 | box · paint · type | 354, 73 · 14 × 14 · — · — | identical | match |
| div at 96, 202 | radius | 50% | - | **mismatch** |
| div at 76, 222 | box · paint · type | 76, 222 · 240 × 250 · — · — | identical | match |
| div at 76, 222 | box · paint · type | 76, 222 · 240 × 250 · — · — | identical | match |
| div at 134, 286 | radius | 50% | - | **mismatch** |
| div at 228, 244 | radius | 50% | 21px | **mismatch** |
| div at 218, 236 | radius | 50% | 21px | **mismatch** |
| div at 146, 374 | box · paint · type | 146, 374 · 100 × 32 · rgb(224, 223, 218) · r 10px 10px 4px 4px · — | identical | match |
| div at 152, 366 | box · paint · type | 152, 366 · 50 × 16 · rgb(198, 197, 192) · r 8px · — | identical | match |
| div at 140, 374 | box · paint · type | 140, 374 · 6 × 54 · rgb(214, 213, 208) · r 3px · — | identical | match |
| div at 246, 374 | box · paint · type | 246, 374 · 6 × 54 · rgb(214, 213, 208) · r 3px · — | identical | match |
| div at 134, 424 | background | rgba(0, 0, 0, 0.09) | - | **mismatch** |
| div at 134, 424 | radius | 50% | - | **mismatch** |
| div at 154, 382 | box · paint · type | 154, 382 · 84 × 8 · rgb(214, 213, 208) · r 4px · — | identical | match |
| div at 262, 342 | radius | 50% | 19px | **mismatch** |
| svg at 270, 350 | box · paint · type | 270, 350 · 22 × 22 · — · — | identical | match |
| circle at 272.8, 352.8 | box · paint · type | 272.8, 352.8 · 16.5 × 16.5 · — · — | identical | match |
| path at 281, 356 | box · paint · type | 281, 356 · 5 × 5 · — · — | identical | match |
| div at 88, 164 | radius | 50% | 1px | **mismatch** |
| div at 296, 140 | radius | 50% | 1px | **mismatch** |
| div at 250, 232 | radius | 50% | 1px | **mismatch** |
| “The First 90 Seconds” | box · paint · type | 0, 552 · 393 × 26 · — · 22px/500/0.1px/normal/rgb(29, 28, 26) | identical | match |
| “A universal interrupt for the moment the wave hi” | box · paint · type | 30, 604 · 333 × 69 · — · 15.5px/400/normal/23px/rgb(85, 83, 78) | identical | match |
| div at 24, 744 | box · paint · type | 24, 744 · 345 × 52 · rgb(19, 19, 19) · r 26px · — | identical | match |
| “Start the interrupt” | box · paint · type | 119.7, 759.8 · 153.6 × 20.5 · — · 17.5px/600/0.3px/normal/rgb(255, 255, 255) | identical | match |

**26 elements compared; 17 match, 9 differ.**

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
