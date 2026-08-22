# Surf Complete

* **Design frame** `Email-Login/Surf Complete`
* **App file** src/components/urge/index.tsx → UrgeFlow → DonePage

## Transcription — `Surf Complete`

Source `UI Final 1/project/Email Login.dc.html`, frame `Surf-Complete.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F0EFEB  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  left:0  right:0  top:0  bottom:0  background:linear-gradient(180deg, #F2E7D6 0%, #E6CFAC 39%, #FBFAF7 65%, #F0EFEB 82%)  overflow:hidden
    <div> position:absolute  left:-30px  top:-40px  width:150px  height:420px  background-image:url('noise-dark.png')  opacity:0.2  transform:rotate(24deg)  transform-origin:top center  -webkit-mask-image:linear-gradient(180deg, #000 30%, transparent)  mask-image:linear-gradient(180deg, #000 30%, transparent)
    <div> position:absolute  left:130px  top:-60px  width:140px  height:430px  background-image:url('noise-dark.png')  opacity:0.24  transform:rotate(6deg)  transform-origin:top center  -webkit-mask-image:linear-gradient(180deg, #000 30%, transparent)  mask-image:linear-gradient(180deg, #000 30%, transparent)
    <div> position:absolute  left:290px  top:-40px  width:150px  height:420px  background-image:url('noise-dark.png')  opacity:0.2  transform:rotate(-14deg)  transform-origin:top center  -webkit-mask-image:linear-gradient(180deg, #000 30%, transparent)  mask-image:linear-gradient(180deg, #000 30%, transparent)
    <div> position:absolute  left:0  right:0  top:0  height:558px  overflow:hidden
      <div> position:absolute  left:96px  top:425px  width:200px  height:200px  background:radial-gradient(circle at 50% 30%, #FBF3E4, #F0DDBC 65%, #DFC79E 100%)  border-radius:50%  overflow:hidden
        <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.5
      <div> position:absolute  left:56px  top:385px  width:280px  height:280px  background:radial-gradient(closest-side, rgba(250,238,214,0.4), rgba(250,238,214,0) 72%)  border-radius:50%
    <div> position:absolute  left:0  right:0  top:542px  height:32px  background:linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)
    <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.10
  <div> position:absolute  left:40px  right:40px  top:128px  z-index:5  color:#1D1C1A  font-size:22px  font-weight:500  line-height:32px  text-align:center
    · The wave passed.
    <br> 
    · You outlasted it.
  <div> position:absolute  left:0  right:0  top:200px  z-index:5  color:#55534E  font-size:14px  font-weight:400  text-align:center
    · Logged — rode it out · ×3
  <div> position:absolute  left:16px  top:756px  width:361px  height:48px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:25px  z-index:5  cursor:pointer
    <span> color:#FFFFFF  font-size:17.5px  font-weight:600  letter-spacing:0.2px
      · Back to Today
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
| div at 96, 425 | radius | 50% | 100px | **mismatch** |
| div at 96, 425 | opacity | 0.5 | - | **mismatch** |
| div at 56, 385 | radius | 50% | - | **mismatch** |
| div at 0, 542 | box · paint · type | 0, 542 · 393 × 32 · — · — | identical | match |
| “The wave passed.You outlasted it.” | box · paint · type | 40, 128 · 313 × 64 · — · 22px/500/normal/32px/rgb(29, 28, 26) | same box and metrics, value "The wave passed. You outlasted it." | match (value) |
| br at 283.7, 131 | box · paint | 283.7, 131 · 0 × 26 · — | *absent* | **mismatch** |
| “Logged — rode it out · ×3” | box · paint · type | 0, 200 · 393 × 16.5 · — · 14px/400/normal/normal/rgb(85, 83, 78) | same box and metrics, value "Logged — rode it out · ×22" | match (value) |
| div at 16, 756 | box · paint · type | 16, 756 · 361 × 48 · rgb(19, 19, 19) · r 25px · — | identical | match |
| “Back to Today” | box · paint · type | 137.8, 769.8 · 117.4 × 20.5 · — · 17.5px/600/0.2px/normal/rgb(255, 255, 255) | identical | match |

**13 elements compared; 6 match, 7 differ.**

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

Frame-specific: `fdiff` returns eleven lines against the previous bundle and all
eleven are entity re-encodings — `&mdash;` → `—`, `&times;` → `×`. Nothing this
frame draws changed, and the app matched it already.

Two rows are the account's: the ride count in "Logged — rode it out · ×N", and
the headline, which the canvas breaks with a `<br>` and the app breaks with a
space — the probe reads the canvas's two runs as one string with no space
between them.
