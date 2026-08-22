# Cue Set Confirmation

* **Design frame** `Email-Login/Cue Set Confirmation`
* **App file** src/components/urge/index.tsx → UrgeFlow → MovePage index 2

## Transcription — `Cue Set Confirmation`

Source `UI Final 1/project/Email Login.dc.html`, frame `Cue-Set-Confirmation.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  left:0  right:0  top:52px  bottom:0  background:#F4F3F0  overflow:hidden
    <svg> viewBox="0 0 20 20"  width="20"  height="20"  position:absolute  right:22px  top:18px
      <path> d="M3 3l14 14M17 3L3 17"  stroke="#55534E"  stroke-width="2"  stroke-linecap="round"
    <div> position:absolute  left:0  right:0  top:25px  display:flex  align-items:center  justify-content:center  gap:7px
      <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
      <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
      <div> width:18px  height:6px  background:#131313  border-radius:3px
    <div> position:absolute  left:76px  top:180px  width:240px  height:200px
      <div> position:absolute  inset:0  overflow:hidden
        <div> position:absolute  left:112px  top:56px  width:130px  height:130px  background:radial-gradient(closest-side,rgba(226,186,120,0.4),rgba(226,186,120,0) 74%)  border-radius:50%  filter:blur(4px)
        <div> position:absolute  left:20px  top:14px  width:34px  height:34px  background:#DCDED8  border-radius:50%
        <div> position:absolute  left:12px  top:8px  width:34px  height:34px  background:#F4F3F0  border-radius:50%
        <div> position:absolute  left:30px  top:62px  width:34px  height:22px  background:#C6C5C0  border-radius:8px
        <div> position:absolute  left:44px  top:84px  width:6px  height:88px  background:#B4B1AB  border-radius:3px
        <div> position:absolute  left:24px  top:150px  width:70px  height:24px  background:rgba(226,186,120,0.22)  border-radius:50%  filter:blur(5px)
        <div> position:absolute  left:128px  top:124px  width:92px  height:32px  background:#E0DFDA  border-radius:10px 10px 4px 4px
        <div> position:absolute  left:166px  top:136px  width:16px  height:5px  background:#C6C5C0  border-radius:3px
        <div> position:absolute  left:134px  top:156px  width:6px  height:22px  background:#D6D5D0  border-radius:3px
        <div> position:absolute  left:208px  top:156px  width:6px  height:22px  background:#D6D5D0  border-radius:3px
        <div> position:absolute  left:146px  top:110px  width:54px  height:12px  background:#3A3934  border-radius:6px
        <div> position:absolute  left:188px  top:113px  width:4px  height:4px  background:#8B8882  border-radius:50%
    <div> position:absolute  left:0  right:0  top:398px  color:#1D1C1A  font-size:23px  font-weight:500  letter-spacing:0.1px  text-align:center
      · Put the phone away.
    <div> position:absolute  left:44px  right:44px  top:444px  color:#55534E  font-size:15.5px  font-weight:400  line-height:23px  text-align:center  text-wrap:pretty
      · Put it somewhere you cannot reach from where you’re sitting.
    <div> position:absolute  left:24px  right:24px  bottom:88px  height:54px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:27px  cursor:pointer
      <span> color:#FFFFFF  font-size:17px  font-weight:600  letter-spacing:0.2px
        · Phone is away
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
| div at 0, 77 | box · paint · type | 0, 77 · 393 × 6 · — · — | identical | match |
| div at 174.5, 77 | box · paint · type | 174.5, 77 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 187.5, 77 | box · paint · type | 187.5, 77 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 200.5, 77 | box · paint · type | 200.5, 77 · 18 × 6 · rgb(19, 19, 19) · r 3px · — | identical | match |
| div at 76, 232 | box · paint · type | 76, 232 · 240 × 200 · — · — | identical | match |
| div at 188, 288 | radius | 50% | - | **mismatch** |
| div at 96, 246 | radius | 50% | 17px | **mismatch** |
| div at 88, 240 | radius | 50% | 17px | **mismatch** |
| div at 106, 294 | box · paint · type | 106, 294 · 34 × 22 · rgb(198, 197, 192) · r 8px · — | identical | match |
| div at 120, 316 | box · paint · type | 120, 316 · 6 × 88 · rgb(180, 177, 171) · r 3px · — | identical | match |
| div at 100, 382 | background | rgba(226, 186, 120, 0.22) | - | **mismatch** |
| div at 100, 382 | radius | 50% | - | **mismatch** |
| div at 204, 356 | box · paint · type | 204, 356 · 92 × 32 · rgb(224, 223, 218) · r 10px 10px 4px 4px · — | identical | match |
| div at 242, 368 | box · paint · type | 242, 368 · 16 × 5 · rgb(198, 197, 192) · r 3px · — | identical | match |
| div at 210, 388 | box · paint · type | 210, 388 · 6 × 22 · rgb(214, 213, 208) · r 3px · — | identical | match |
| div at 284, 388 | box · paint · type | 284, 388 · 6 × 22 · rgb(214, 213, 208) · r 3px · — | identical | match |
| div at 222, 342 | box · paint · type | 222, 342 · 54 × 12 · rgb(58, 57, 52) · r 6px · — | identical | match |
| div at 264, 345 | radius | 50% | 2px | **mismatch** |
| “Put the phone away.” | box · paint · type | 0, 450 · 393 × 27 · — · 23px/500/0.1px/normal/rgb(29, 28, 26) | identical | match |
| “Put it somewhere you cannot reach from where you” | box · paint · type | 44, 496 · 305 × 46 · — · 15.5px/400/normal/23px/rgb(85, 83, 78) | identical | match |
| div at 24, 710 | box · paint · type | 24, 710 · 345 × 54 · rgb(19, 19, 19) · r 27px · — | identical | match |
| “Phone is away” | box · paint · type | 138.9, 727 · 115.2 × 20 · — · 17px/600/0.2px/normal/rgb(255, 255, 255) | identical | match |

**24 elements compared; 19 match, 5 differ.**

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
