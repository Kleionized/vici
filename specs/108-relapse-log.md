# Relapse Log

* **Design frame** `Email-Login/Relapse Log`
* **App file** src/app/relapse.tsx → PAGES[0]

## Transcription — `Relapse Log`

Source `UI Final 1/project/Email Login.dc.html`, frame `Relapse-Log.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
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
        <div> position:absolute  left:56px  top:44px  width:136px  height:136px  background:radial-gradient(closest-side,rgba(142,153,168,0.32),rgba(142,153,168,0) 74%)  border-radius:50%  filter:blur(4px)
        <div> position:absolute  left:56px  top:72px  width:126px  height:94px  background:#E0DFDA  border-radius:10px  transform:rotate(-2deg)
        <div> position:absolute  left:62px  top:66px  width:114px  height:94px  background:#F7F6F2  border-radius:8px  box-shadow:0 0 0 1px rgba(0,0,0,0.05)  transform:rotate(-2deg)
        <div> position:absolute  left:118px  top:68px  width:2px  height:88px  background:#E0DFDA  transform:rotate(-2deg)
        <div> position:absolute  left:74px  top:88px  width:34px  height:4px  background:#E0DFDA  border-radius:2px
        <div> position:absolute  left:74px  top:102px  width:34px  height:4px  background:#E0DFDA  border-radius:2px
        <div> position:absolute  left:74px  top:116px  width:24px  height:4px  background:#E0DFDA  border-radius:2px
        <div> position:absolute  left:130px  top:86px  width:34px  height:4px  background:#E0DFDA  border-radius:2px
        <div> position:absolute  left:130px  top:100px  width:26px  height:4px  background:#E0DFDA  border-radius:2px
        <div> position:absolute  left:148px  top:118px  width:64px  height:8px  background:#55534E  border-radius:4px  transform:rotate(-28deg)  transform-origin:left center
        <div> position:absolute  left:204px  top:86px  width:8px  height:8px  background:#B4B1AB  border-radius:2px  transform:rotate(17deg)
        <div> position:absolute  left:174px  top:48px  width:30px  height:30px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:50%
          <svg> viewBox="0 0 14 14"  width="13"  height="13"
            <path> d="M2.5 7.5l3 3 6-7"  fill="none"  stroke="#F4F3F0"  stroke-width="2.2"  stroke-linecap="round"  stroke-linejoin="round"
    <div> position:absolute  left:0  right:0  top:398px  color:#1D1C1A  font-size:23px  font-weight:500  letter-spacing:0.1px  text-align:center
      · It happened.
    <div> position:absolute  left:44px  right:44px  top:450px  color:#55534E  font-size:15.5px  font-weight:400  line-height:23px  text-align:center  text-wrap:pretty
      · The day isn’t over. Log what happened, then stop it here.
    <div> position:absolute  left:44px  right:44px  top:444px  color:#55534E  font-size:15.5px  font-weight:400  line-height:23px  text-align:center  text-wrap:pretty
      · Same calm screen as a win. Note what set it off while it's fresh — the pattern is the prize, not the streak.
    <div> position:absolute  left:24px  right:24px  bottom:88px  height:54px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:27px  cursor:pointer
      <span> color:#FFFFFF  font-size:17px  font-weight:600  letter-spacing:0.2px
        · Log the slip
    <div> position:absolute  left:0  right:0  bottom:44px  color:#8B8882  font-size:15px  font-weight:500  text-align:center
      · Back to the wave tool
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
| div at 132, 276 | radius | 50% | - | **mismatch** |
| div at 130.4, 301.8 | box · paint · type | 130.4, 301.8 · 129.2 × 98.3 · rgb(224, 223, 218) · r 10px · — | identical | match |
| div at 136.4, 296 | box · paint · type | 136.4, 296 · 117.2 × 97.9 · rgb(247, 246, 242) · r 8px · rgba(0, 0, 0, 0.05) 0px 0px 0px 1px · — | identical | match |
| div at 192.5, 300 | box · paint · type | 192.5, 300 · 5.1 × 88 · rgb(224, 223, 218) · — | identical | match |
| div at 150, 320 | box · paint · type | 150, 320 · 34 × 4 · rgb(224, 223, 218) · r 2px · — | identical | match |
| div at 150, 334 | box · paint · type | 150, 334 · 34 × 4 · rgb(224, 223, 218) · r 2px · — | identical | match |
| div at 150, 348 | box · paint · type | 150, 348 · 24 × 4 · rgb(224, 223, 218) · r 2px · — | identical | match |
| div at 206, 318 | box · paint · type | 206, 318 · 34 × 4 · rgb(224, 223, 218) · r 2px · — | identical | match |
| div at 206, 332 | box · paint · type | 206, 332 · 26 × 4 · rgb(224, 223, 218) · r 2px · — | identical | match |
| div at 222.1, 320.4 | box · paint · type | 222.1, 320.4 · 60.3 × 37.1 · rgb(85, 83, 78) · r 4px · — | identical | match |
| div at 279, 317 | box · paint · type | 279, 317 · 10 × 10 · rgb(180, 177, 171) · r 2px · — | identical | match |
| div at 250, 280 | radius | 50% | 15px | **mismatch** |
| svg at 258.5, 288.5 | box · paint · type | 258.5, 288.5 · 13 × 13 · — · — | identical | match |
| path at 260.8, 291.8 | box · paint · type | 260.8, 291.8 · 8.4 × 6.5 · — · — | identical | match |
| “It happened.” | box · paint · type | 0, 450 · 393 × 27 · — · 23px/500/0.1px/normal/rgb(29, 28, 26) | identical | match |
| “The day isn’t over. Log what happened, then stop” | box · paint · type | 44, 502 · 305 × 46 · — · 15.5px/400/normal/23px/rgb(85, 83, 78) | identical | match |
| “Same calm screen as a win. Note what set it off ” | box · paint | 44, 496 · 305 × 69 · — | *absent* | **mismatch** |
| div at 24, 710 | box · paint · type | 24, 710 · 345 × 54 · rgb(19, 19, 19) · r 27px · — | identical | match |
| “Log the slip” | box · paint · type | 149.6, 727 · 93.8 × 20 · — · 17px/600/0.2px/normal/rgb(255, 255, 255) | identical | match |
| “Back to the wave tool” | box · paint · type | 0, 790.5 · 393 × 17.5 · — · 15px/500/normal/normal/rgb(139, 136, 130) | identical | match |

**25 elements compared; 22 match, 3 differ.**

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

Frame-specific: **this frame draws two body paragraphs, overlapping.** One at
`top: 444` — the previous bundle's, "Same calm screen as a win…" — and one at
`top: 450`, this bundle's, "The day isn't over. Log what happened, then stop it
here." Same gutters, same size, same colour, on the same 23pt line. Only the new
one is built, and the one reported absent is the old one; see `DECISIONS.md`
D039.

The art box is pinned at the canvas's own `left: 76` rather than centred, which
on a 393 frame differs by half a point.
