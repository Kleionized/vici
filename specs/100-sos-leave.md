# Surf Step 3

* **Design frame** `Email-Login/Surf Step 3`
* **App file** src/components/urge/index.tsx → UrgeFlow → MovePage index 1, LeaveStepArt

## Transcription — `Surf Step 3`

Source `UI Final 1/project/Email Login.dc.html`, frame `Surf-Step-3.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
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
      <div> width:18px  height:6px  background:#131313  border-radius:3px
      <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> position:absolute  left:76px  top:180px  width:240px  height:200px
      <div> position:absolute  inset:0  overflow:hidden
        <div> position:absolute  left:58px  top:28px  width:124px  height:124px  background:radial-gradient(closest-side,rgba(226,186,120,0.4),rgba(226,186,120,0) 74%)  border-radius:50%  filter:blur(4px)
        <div> position:absolute  left:82px  top:22px  width:80px  height:152px  background:#E4E3DE  border-radius:7px
        <div> position:absolute  left:88px  top:28px  width:68px  height:146px  background:linear-gradient(180deg, #F7F6F2, #EFE4CF)  border-radius:4px
        <div> position:absolute  left:146px  top:26px  width:32px  height:148px  background:#DCDBD5  border-radius:3px 6px 6px 3px  box-shadow:inset 1px 0 0 rgba(0,0,0,0.05)
        <div> position:absolute  left:152px  top:96px  width:4px  height:4px  background:#B4B1AB  border-radius:50%
        <div> position:absolute  left:84px  top:176px  width:100px  height:16px  background:rgba(226,186,120,0.25)  border-radius:50%  filter:blur(5px)
        <div> position:absolute  left:70px  top:180px  width:130px  height:13px  background:rgba(0,0,0,0.10)  border-radius:50%  filter:blur(5px)
    <div> position:absolute  left:0  right:0  top:398px  color:#1D1C1A  font-size:23px  font-weight:500  letter-spacing:0.1px  text-align:center
      · Leave the room.
    <div> position:absolute  left:24px  right:24px  bottom:88px  height:54px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:27px  cursor:pointer
      <span> color:#FFFFFF  font-size:17px  font-weight:600  letter-spacing:0.2px
        · I’ve left
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
| div at 187.5, 77 | box · paint · type | 187.5, 77 · 18 × 6 · rgb(19, 19, 19) · r 3px · — | identical | match |
| div at 212.5, 77 | box · paint · type | 212.5, 77 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 76, 232 | box · paint · type | 76, 232 · 240 × 200 · — · — | identical | match |
| div at 134, 260 | radius | 50% | - | **mismatch** |
| div at 158, 254 | box · paint · type | 158, 254 · 80 × 152 · rgb(228, 227, 222) · r 7px · — | identical | match |
| div at 164, 260 | box · paint · type | 164, 260 · 68 × 146 · r 4px · — | identical | match |
| div at 222, 258 | shadow | rgba(0, 0, 0, 0.05) 1px 0px 0px 0px inset | - | **mismatch** |
| div at 228, 328 | radius | 50% | 2px | **mismatch** |
| div at 160, 408 | background | rgba(226, 186, 120, 0.25) | - | **mismatch** |
| div at 160, 408 | radius | 50% | - | **mismatch** |
| div at 146, 412 | background | rgba(0, 0, 0, 0.1) | - | **mismatch** |
| div at 146, 412 | radius | 50% | - | **mismatch** |
| “Leave the room.” | box · paint · type | 0, 450 · 393 × 27 · — · 23px/500/0.1px/normal/rgb(29, 28, 26) | identical | match |
| div at 24, 710 | box · paint · type | 24, 710 · 345 × 54 · rgb(19, 19, 19) · r 27px · — | identical | match |
| “I’ve left” | box · paint · type | 166.2, 727 · 60.5 × 20 · — · 17px/600/0.2px/normal/rgb(255, 255, 255) | identical | match |

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

Frame-specific: the largest non-picker change in the group. The running tap over
a basin the previous bundle drew here — seventeen layers in a cool
`rgb(150,190,210)` palette — is retired whole, and a door slab in the warm
palette takes its place: seven layers, three of them blurred, drawn by
`LeaveStepArt`. The canvas's `inset 1px 0 0 rgba(0,0,0,0.05)` on the spine has
no React Native equivalent as an inset shadow on a partly-rounded box, so it is
the 1pt hairline it paints.
