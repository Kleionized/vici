# SOS Strength

* **Design frame** `Email-Login/SOS Strength`
* **App file** src/components/urge/index.tsx → UrgeFlow → StrengthPage

## Transcription — `SOS Strength`

Source `UI Final 1/project/Email Login.dc.html`, frame `SOS-Strength.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  left:0  right:0  top:52px  bottom:0  background:#F4F3F0  overflow:hidden
    <svg> viewBox="0 0 20 20"  width="20"  height="20"  position:absolute  right:22px  top:18px
      <path> d="M3 3l14 14M17 3L3 17"  stroke="#55534E"  stroke-width="2"  stroke-linecap="round"
    <div> position:absolute  left:44px  right:44px  top:150px  color:#1D1C1A  font-size:23px  font-weight:500  letter-spacing:0.1px  line-height:31px  text-align:center  text-wrap:balance
      · How strong is it right now?
    <div> position:absolute  left:36px  right:36px  top:330px  display:flex  justify-content:space-between
      <div> width:48px  height:48px  background:#FFFFFF  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.12)
      <div> width:48px  height:48px  background:#FFFFFF  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.12)
      <div> width:48px  height:48px  background:#FFFFFF  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.12)
      <div> width:48px  height:48px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:50%  box-shadow:0 0 0 2px #F4F3F0, 0 0 0 4px #131313
        <div> width:11px  height:11px  background:#F4F3F0  border-radius:50%
      <div> width:48px  height:48px  background:#FFFFFF  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.12)
    <div> position:absolute  left:0  right:0  top:452px  color:#1D1C1A  font-size:19px  font-weight:600  text-align:center
      · Intense
    <div> position:absolute  left:0  right:0  top:482px  color:#8B8882  font-size:13.5px  font-weight:400  text-align:center
      · Hard to resist
    <div> position:absolute  left:24px  right:24px  bottom:88px  height:54px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:27px  cursor:pointer
      <span> color:#FFFFFF  font-size:17px  font-weight:600  letter-spacing:0.2px
        · Continue
    <div> position:absolute  left:0  right:0  bottom:44px  color:#8B8882  font-size:15px  font-weight:500  text-align:center
      · Skip this step
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
| “How strong is it right now?” | box · paint · type | 44, 202 · 305 × 31 · — · 23px/500/0.1px/31px/rgb(29, 28, 26) | identical | match |
| div at 36, 382 | box · paint · type | 36, 382 · 321 × 48 · — · — | identical | match |
| div at 36, 382 | radius | 50% | 24px | **mismatch** |
| div at 104.3, 382 | radius | 50% | 24px | **mismatch** |
| div at 172.5, 382 | radius | 50% | 24px | **mismatch** |
| div at 240.8, 382 | radius | 50% | 24px | **mismatch** |
| div at 259.3, 400.5 | radius | 50% | 5.5px | **mismatch** |
| div at 309, 382 | radius | 50% | 24px | **mismatch** |
| “Intense” | box · paint · type | 0, 504 · 393 × 22.5 · — · 19px/600/normal/normal/rgb(29, 28, 26) | identical | match |
| “Hard to resist” | box · paint · type | 0, 534 · 393 × 16 · — · 13.5px/400/normal/normal/rgb(139, 136, 130) | identical | match |
| div at 24, 710 | box · paint · type | 24, 710 · 345 × 54 · rgb(19, 19, 19) · r 27px · — | identical | match |
| “Continue” | box · paint · type | 159.7, 727 · 73.7 × 20 · — · 17px/600/0.2px/normal/rgb(255, 255, 255) | identical | match |
| “Skip this step” | box · paint · type | 0, 790.5 · 393 × 17.5 · — · 15px/500/normal/normal/rgb(139, 136, 130) | identical | match |

**16 elements compared; 10 match, 6 differ.**

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

Frame-specific: `UI Final 1` deleted the line under the headline — "Just a read,
not a test — it helps you watch it pass." — and the two end labels the previous
bundle drew under the disc row. The five discs, their treatments and their
read-out are unchanged. "Skip this step" survives on this frame and on no other
in the group.
