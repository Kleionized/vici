# Relapse Twice

* **Design frame** `Email-Login/Relapse Twice`
* **App file** src/app/relapse.tsx → PAGES[1]

## Transcription — `Relapse Twice`

Source `UI Final 1/project/Email Login.dc.html`, frame `Relapse-Twice.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  left:0  right:0  top:52px  bottom:0  background:#F4F3F0  overflow:hidden
    <svg> viewBox="0 0 20 20"  width="20"  height="20"  position:absolute  right:22px  top:18px
      <path> d="M3 3l14 14M17 3L3 17"  stroke="#55534E"  stroke-width="2"  stroke-linecap="round"
    <div> position:absolute  left:76px  top:180px  width:240px  height:200px
      <div> position:absolute  inset:0  overflow:hidden
        <div> position:absolute  left:70px  top:52px  width:130px  height:130px  background:radial-gradient(closest-side,rgba(226,186,120,0.38),rgba(226,186,120,0) 74%)  border-radius:50%  filter:blur(4px)
        <div> position:absolute  left:20px  top:14px  width:34px  height:34px  background:#DCDED8  border-radius:50%
        <div> position:absolute  left:12px  top:8px  width:34px  height:34px  background:#F4F3F0  border-radius:50%
        <div> position:absolute  left:34px  top:158px  width:78px  height:16px  background:rgba(0,0,0,0.10)  border-radius:50%  filter:blur(5px)
        <div> position:absolute  left:42px  top:118px  width:18px  height:66px  background:#C6C5C0  border-radius:6px  transform:rotate(76deg)  transform-origin:bottom right
        <div> position:absolute  left:112px  top:144px  width:14px  height:28px  background:#B4B1AB  border-radius:4px
        <div> position:absolute  left:150px  top:162px  width:44px  height:12px  background:rgba(0,0,0,0.14)  border-radius:50%  filter:blur(4px)
        <div> position:absolute  left:152px  top:100px  width:20px  height:68px  background:#3A3934  border-radius:6px
        <div> position:absolute  left:157px  top:110px  width:10px  height:3px  background:rgba(244,243,240,0.35)  border-radius:2px
    <div> position:absolute  left:0  right:0  top:398px  color:#1D1C1A  font-size:23px  font-weight:500  letter-spacing:0.1px  text-align:center
      · Don’t let it become two.
    <div> position:absolute  left:44px  right:44px  top:444px  color:#55534E  font-size:15.5px  font-weight:400  line-height:23px  text-align:center  text-wrap:pretty
      · One slip happened. You can still turn the rest of today around.
    <div> position:absolute  left:24px  right:24px  bottom:88px  height:54px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:27px  cursor:pointer
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
| div at 0, 52 | box · paint · type | 0, 52 · 393 × 800 · rgb(244, 243, 240) · — | identical | match |
| svg at 351, 70 | box · paint · type | 351, 70 · 20 × 20 · — · — | identical | match |
| path at 354, 73 | box · paint · type | 354, 73 · 14 × 14 · — · — | identical | match |
| div at 76, 232 | box · paint · type | 76, 232 · 240 × 200 · — · — | identical | match |
| div at 76, 232 | box · paint · type | 76, 232 · 240 × 200 · — · — | identical | match |
| div at 146, 284 | radius | 50% | - | **mismatch** |
| div at 96, 246 | radius | 50% | 17px | **mismatch** |
| div at 88, 240 | radius | 50% | 17px | **mismatch** |
| div at 110, 390 | background | rgba(0, 0, 0, 0.1) | - | **mismatch** |
| div at 110, 390 | radius | 50% | - | **mismatch** |
| div at 131.6, 382.6 | box · paint · type | 131.6, 382.6 · 68.4 × 33.4 · rgb(198, 197, 192) · r 6px · — | identical | match |
| div at 188, 376 | box · paint · type | 188, 376 · 14 × 28 · rgb(180, 177, 171) · r 4px · — | identical | match |
| div at 226, 394 | background | rgba(0, 0, 0, 0.14) | - | **mismatch** |
| div at 226, 394 | radius | 50% | - | **mismatch** |
| div at 228, 332 | box · paint · type | 228, 332 · 20 × 68 · rgb(58, 57, 52) · r 6px · — | identical | match |
| div at 233, 342 | box · paint · type | 233, 342 · 10 × 3 · rgba(244, 243, 240, 0.35) · r 2px · — | identical | match |
| “Don’t let it become two.” | box · paint · type | 0, 450 · 393 × 27 · — · 23px/500/0.1px/normal/rgb(29, 28, 26) | identical | match |
| “One slip happened. You can still turn the rest o” | box · paint · type | 44, 496 · 305 × 46 · — · 15.5px/400/normal/23px/rgb(85, 83, 78) | identical | match |
| div at 24, 710 | box · paint · type | 24, 710 · 345 × 54 · rgb(19, 19, 19) · r 27px · — | identical | match |
| “Continue” | box · paint · type | 159.7, 727 · 73.7 × 20 · — · 17px/600/0.2px/normal/rgb(255, 255, 255) | identical | match |

**18 elements compared; 13 match, 5 differ.**

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
