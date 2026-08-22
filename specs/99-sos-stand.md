# Surf Step 1

* **Design frame** `Email-Login/Surf Step 1`
* **App file** src/components/urge/index.tsx → UrgeFlow → MovePage index 0

## Transcription — `Surf Step 1`

Source `UI Final 1/project/Email Login.dc.html`, frame `Surf-Step-1.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  left:0  right:0  top:52px  bottom:0  background:#F4F3F0  overflow:hidden
    <svg> viewBox="0 0 20 20"  width="20"  height="20"  position:absolute  right:22px  top:18px
      <path> d="M3 3l14 14M17 3L3 17"  stroke="#55534E"  stroke-width="2"  stroke-linecap="round"
    <div> position:absolute  left:0  right:0  top:25px  display:flex  align-items:center  justify-content:center  gap:7px
      <div> width:18px  height:6px  background:#131313  border-radius:3px
      <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
      <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> position:absolute  left:76px  top:180px  width:240px  height:200px
      <div> position:absolute  inset:0  overflow:hidden
        <div> position:absolute  left:50px  top:44px  width:120px  height:120px  background:radial-gradient(closest-side,rgba(226,186,120,0.4),rgba(226,186,120,0) 74%)  border-radius:50%  filter:blur(4px)
        <div> position:absolute  left:20px  top:14px  width:34px  height:34px  background:#DCDED8  border-radius:50%
        <div> position:absolute  left:12px  top:8px  width:34px  height:34px  background:#F4F3F0  border-radius:50%
        <div> position:absolute  left:24px  top:120px  width:96px  height:30px  background:#E0DFDA  border-radius:10px 10px 4px 4px
        <div> position:absolute  left:30px  top:112px  width:44px  height:15px  background:#C6C5C0  border-radius:8px
        <div> position:absolute  left:18px  top:120px  width:6px  height:52px  background:#D6D5D0  border-radius:3px
        <div> position:absolute  left:118px  top:120px  width:6px  height:52px  background:#D6D5D0  border-radius:3px
        <div> position:absolute  left:168px  top:40px  width:52px  height:138px  background:#E4E3DE  border-radius:8px
        <div> position:absolute  left:174px  top:46px  width:34px  height:126px  background:linear-gradient(180deg, #F7F6F2, #EDECE7)  border-radius:5px
        <div> position:absolute  left:150px  top:150px  width:70px  height:26px  background:rgba(226,186,120,0.22)  border-radius:50%  filter:blur(5px)
        <div> position:absolute  left:136px  top:96px  width:10px  height:22px  background:#B4B1AB  border-radius:5px
        <div> position:absolute  left:12px  top:174px  width:116px  height:14px  background:rgba(0,0,0,0.10)  border-radius:50%  filter:blur(5px)
        <div> position:absolute  left:160px  top:180px  width:66px  height:12px  background:rgba(0,0,0,0.08)  border-radius:50%  filter:blur(4px)
        <div> position:absolute  left:28px  top:128px  width:88px  height:8px  background:#D6D5D0  border-radius:4px
        <div> position:absolute  left:96px  top:186px  width:56px  height:9px  background:#E4E3DE  border-radius:5px
        <div> position:absolute  left:216px  top:20px  width:2px  height:2px  background:rgba(200,225,235,0.4)  border-radius:50%
        <div> position:absolute  left:6px  top:52px  width:2px  height:2px  background:rgba(200,225,235,0.3)  border-radius:50%
    <div> position:absolute  left:0  right:0  top:398px  color:#1D1C1A  font-size:23px  font-weight:500  letter-spacing:0.1px  text-align:center
      · Stand up.
    <div> position:absolute  left:24px  right:24px  bottom:88px  height:54px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:27px  cursor:pointer
      <span> color:#FFFFFF  font-size:17px  font-weight:600  letter-spacing:0.2px
        · I’m up
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
| div at 174.5, 77 | box · paint · type | 174.5, 77 · 18 × 6 · rgb(19, 19, 19) · r 3px · — | identical | match |
| div at 199.5, 77 | box · paint · type | 199.5, 77 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 212.5, 77 | box · paint · type | 212.5, 77 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 76, 232 | box · paint · type | 76, 232 · 240 × 200 · — · — | identical | match |
| div at 126, 276 | radius | 50% | - | **mismatch** |
| div at 96, 246 | radius | 50% | 17px | **mismatch** |
| div at 88, 240 | radius | 50% | 17px | **mismatch** |
| div at 100, 352 | box · paint · type | 100, 352 · 96 × 30 · rgb(224, 223, 218) · r 10px 10px 4px 4px · — | identical | match |
| div at 106, 344 | box · paint · type | 106, 344 · 44 × 15 · rgb(198, 197, 192) · r 8px · — | identical | match |
| div at 94, 352 | box · paint · type | 94, 352 · 6 × 52 · rgb(214, 213, 208) · r 3px · — | identical | match |
| div at 194, 352 | box · paint · type | 194, 352 · 6 × 52 · rgb(214, 213, 208) · r 3px · — | identical | match |
| div at 244, 272 | box · paint · type | 244, 272 · 52 × 138 · rgb(228, 227, 222) · r 8px · — | identical | match |
| div at 250, 278 | box · paint · type | 250, 278 · 34 × 126 · r 5px · — | identical | match |
| div at 226, 382 | background | rgba(226, 186, 120, 0.22) | - | **mismatch** |
| div at 226, 382 | radius | 50% | - | **mismatch** |
| div at 212, 328 | box · paint · type | 212, 328 · 10 × 22 · rgb(180, 177, 171) · r 5px · — | identical | match |
| div at 88, 406 | background | rgba(0, 0, 0, 0.1) | - | **mismatch** |
| div at 88, 406 | radius | 50% | - | **mismatch** |
| div at 236, 412 | background | rgba(0, 0, 0, 0.08) | - | **mismatch** |
| div at 236, 412 | radius | 50% | - | **mismatch** |
| div at 104, 360 | box · paint · type | 104, 360 · 88 × 8 · rgb(214, 213, 208) · r 4px · — | identical | match |
| div at 172, 418 | box · paint · type | 172, 418 · 56 × 9 · rgb(228, 227, 222) · r 5px · — | identical | match |
| div at 292, 252 | radius | 50% | 1px | **mismatch** |
| div at 82, 284 | radius | 50% | 1px | **mismatch** |
| “Stand up.” | box · paint · type | 0, 450 · 393 × 27 · — · 23px/500/0.1px/normal/rgb(29, 28, 26) | identical | match |
| div at 24, 710 | box · paint · type | 24, 710 · 345 × 54 · rgb(19, 19, 19) · r 27px · — | identical | match |
| “I’m up” | box · paint · type | 171.2, 727 · 50.6 × 20 · — · 17px/600/0.2px/normal/rgb(255, 255, 255) | identical | match |

**28 elements compared; 20 match, 8 differ.**

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

Frame-specific: the three moves were resequenced and made place-independent, and
this is the first of them. Its scene — the bed and the lit doorway — is the one
the app called `MoveStepArt`, which the previous bundle attached to the *second*
board; the pairing moved with the copy. The body the previous bundle drew here
is deleted, "Skip this step" with it, and the pill says **"I'm up"** rather
than a shared "Done — next". The pager moved from 28 to 25.
