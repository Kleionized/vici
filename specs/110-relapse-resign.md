# Relapse Resign

* **Design frame** `Email-Login/Relapse Resign`
* **App file** src/app/relapse.tsx → ResignPledge

## Transcription — `Relapse Resign`

Source `UI Final 1/project/Email Login.dc.html`, frame `Relapse-Resign.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  left:36px  right:36px  top:150px  color:#1D1C1A  font-size:26px  font-weight:500  letter-spacing:-0.2px  line-height:33px  text-align:center
    · The pledge still stands.
  <div> position:absolute  left:44px  right:44px  top:196px  color:#55534E  font-size:15px  font-weight:400  line-height:22px  text-align:center  text-wrap:pretty
    · A slip doesn’t erase what you decided. Sign it again and keep going.
  <div> position:absolute  left:36px  right:36px  top:294px  height:236px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.08), 0 10px 26px rgba(40,38,32,0.08)  overflow:hidden
    <div> position:absolute  inset:0  pointer-events:none
      <div> position:absolute  right:-40px  top:-52px  width:180px  height:180px  background:radial-gradient(closest-side, rgba(233,210,164,0.34), rgba(233,210,164,0) 74%)  border-radius:50%
      <div> position:absolute  right:28px  top:26px  width:30px  height:30px  background:#F0DDB4  border-radius:50%
      <div> position:absolute  left:-30px  right:-30px  bottom:-64px  height:110px  background:#EFEEE9  border-radius:50% 50% 0 0 / 50px 50px 0 0
      <div> position:absolute  left:-60px  right:-10px  bottom:-78px  height:110px  background:#E9E8E2  border-radius:50% 50% 0 0 / 44px 44px 0 0
    <div> position:absolute  left:0  right:0  top:42px  color:#C9C0AC  font-size:40px  font-weight:600  line-height:26px  text-align:center
      · “
    <div> position:absolute  left:36px  right:36px  top:86px  color:#3A3934  font-size:22px  font-weight:500  letter-spacing:-0.2px  line-height:32px  text-align:center  text-wrap:balance
      · The mornings are mine again.
    <div> position:absolute  left:16px  right:20px  bottom:16px  display:flex  align-items:flex-end  justify-content:space-between
      <span> 
      <div> text-align:right
        <div> transform:rotate(-3.5deg)  color:#1D1C1A  font-family:'Snell Roundhand','Savoye LET','Segoe Script',cursive  font-size:26px  line-height:1
          · Jerry
        <div> width:104px  height:1px  margin-left:auto  background:rgba(0,0,0,0.2)  margin-top:5px
  <div> position:absolute  left:24px  right:24px  top:688px  height:54px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:27px  cursor:pointer
    <span> color:#FFFFFF  font-size:17px  font-weight:600  letter-spacing:0.2px
      · Sign it again
  <div> position:absolute  left:0  right:0  top:760px  color:#8B8882  font-size:15px  font-weight:500  text-align:center
    · Change the pledge
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| “The pledge still stands.” | box · paint · type | 36, 150 · 321 × 33 · — · 26px/500/-0.2px/33px/rgb(29, 28, 26) | identical | match |
| “A slip doesn’t erase what you decided. Sign it a” | box · paint · type | 44, 196 · 305 × 44 · — · 15px/400/normal/22px/rgb(85, 83, 78) | identical | match |
| div at 36, 294 | box · paint · type | 36, 294 · 321 × 236 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(40, 38, 32, 0.08) 0px 10px 26px 0px · — | identical | match |
| div at 36, 294 | box · paint · type | 36, 294 · 321 × 236 · — · — | identical | match |
| div at 217, 242 | radius | 50% | - | **mismatch** |
| div at 299, 320 | radius | 50% | 15px | **mismatch** |
| div at 6, 484 | background | rgb(239, 238, 233) | - | **mismatch** |
| div at 6, 484 | radius | 50% 50% 0px 0px / 50px 50px 0px 0px | - | **mismatch** |
| div at -24, 498 | background | rgb(233, 232, 226) | - | **mismatch** |
| div at -24, 498 | radius | 50% 50% 0px 0px / 44px 44px 0px 0px | - | **mismatch** |
| ““” | box · paint · type | 36, 336 · 321 × 26 · — · 40px/600/normal/26px/rgb(201, 192, 172) | identical | match |
| “The mornings are mine again.” | box · paint · type | 72, 380 · 249 × 64 · — · 22px/500/-0.2px/32px/rgb(58, 57, 52) | identical | match |
| div at 52, 482 | box · paint · type | 52, 482 · 285 × 32 · — · — | identical | match |
| span at 52, 514 | box · paint | 52, 514 · 0 × 0 · — | *absent* | **mismatch** |
| div at 233, 482 | box · paint | 233, 482 · 104 × 32 · — | *absent* | **mismatch** |
| “Jerry” | box · paint · type | 232.3, 478.8 · 105.4 × 32.3 · — · 26px/400/normal/26px/rgb(29, 28, 26) | same box and metrics, value "Marcus" | match (value) |
| div at 233, 513 | box · paint · type | 233, 513 · 104 × 1 · rgba(0, 0, 0, 0.2) · — | identical | match |
| div at 24, 688 | box · paint · type | 24, 688 · 345 × 54 · rgb(19, 19, 19) · r 27px · — | identical | match |
| “Sign it again” | box · paint · type | 146.5, 705 · 100 × 20 · — · 17px/600/0.2px/normal/rgb(255, 255, 255) | identical | match |
| “Change the pledge” | box · paint · type | 0, 760 · 393 × 17.5 · — · 15px/500/normal/normal/rgb(139, 136, 130) | identical | match |

**18 elements compared; 12 match, 6 differ.**

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

Frame-specific: a new frame, and the only one in the group with no sheet, no
close cross and no back chevron. The card is the pledge card `21 · Today — p3`
draws, at its own size: the sun wash, the disc, the two hills, the quote mark,
the words centred rather than left-aligned, and the signature bottom-right over
its 104pt rule.

Two rows are reported absent and both are the canvas's own construction: an
**empty `<span>`** at `52, 514` with no size and no paint — the flex spacer that
pushes the signature right, which the app states as `alignItems: 'flex-end'` —
and the `text-align: right` wrapper the canvas puts around the name, which the
app expresses as a 104-wide right-aligned Text. The name is the account's.
