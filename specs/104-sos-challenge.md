# SOS Challenge

* **Design frame** `Email-Login/SOS Challenge`
* **App file** src/components/urge/index.tsx → UrgeFlow → ResponsePage

## Transcription — `SOS Challenge`

Source `UI Final 1/project/Email Login.dc.html`, frame `SOS-Challenge.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  left:0  right:0  top:52px  bottom:0  background:#F4F3F0  overflow:hidden
    <svg> viewBox="0 0 20 20"  width="20"  height="20"  position:absolute  right:22px  top:18px
      <path> d="M3 3l14 14M17 3L3 17"  stroke="#55534E"  stroke-width="2"  stroke-linecap="round"
    <div> position:absolute  left:44px  right:44px  top:150px  color:#1D1C1A  font-size:23px  font-weight:500  letter-spacing:0.1px  line-height:31px  text-align:center  text-wrap:balance
      · Break the isolation.
    <div> position:absolute  left:44px  right:44px  top:214px  color:#55534E  font-size:15px  font-weight:400  line-height:23px  text-align:center  text-wrap:pretty
      · Rejection makes quick comfort look more valuable than it is. Don&rsquo;t check their profile.
    <div> position:absolute  left:24px  right:24px  top:330px  padding:22px 22px 24px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.08)
      <div> color:#A5A29B  font-size:12px  font-weight:600  letter-spacing:1.2px
        · THE CHALLENGE
      <div> color:#1D1C1A  font-size:17px  font-weight:500  line-height:26px  text-wrap:pretty  margin-top:12px
        · Send one message &mdash; anything &mdash; or go stand where other people are for ten minutes.
    <div> position:absolute  left:24px  right:24px  bottom:88px  height:54px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:27px  cursor:pointer
      <span> color:#FFFFFF  font-size:17px  font-weight:600  letter-spacing:0.2px
        · Done
    <div> position:absolute  left:0  right:0  bottom:44px  color:#8B8882  font-size:15px  font-weight:500  text-align:center
      · Give me another
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
| “Break the isolation.” | box · paint · type | 44, 202 · 305 × 31 · — · 23px/500/0.1px/31px/rgb(29, 28, 26) | identical | match |
| “Rejection makes quick comfort look more valuable” | box · paint · type | 44, 266 · 305 × 46 · — · 15px/400/normal/23px/rgb(85, 83, 78) | identical | match |
| div at 24, 382 | box · paint · type | 24, 382 · 345 × 150 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.08) 0px 0px 0px 1px · — | identical | match |
| “THE CHALLENGE” | box · paint · type | 46, 404 · 301 × 14 · — · 12px/600/1.2px/normal/rgb(165, 162, 155) | identical | match |
| “Send one message — anything — or go stand where ” | box · paint · type | 46, 430 · 301 × 78 · — · 17px/500/normal/26px/rgb(29, 28, 26) | identical | match |
| div at 24, 710 | box · paint · type | 24, 710 · 345 × 54 · rgb(19, 19, 19) · r 27px · — | identical | match |
| “Done” | box · paint · type | 175.3, 727 · 42.5 × 20 · — · 17px/600/0.2px/normal/rgb(255, 255, 255) | identical | match |
| “Give me another” | box · paint · type | 0, 790.5 · 393 × 17.5 · — · 15px/500/normal/normal/rgb(139, 136, 130) | identical | match |

**11 elements compared; 11 match, 0 differ.**

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

Frame-specific: zero differing rows — this frame matches the app to the point.

It is the response board's second shape: the same headline and body slots, moved
up to 150 and 214 where the scene is not, plus a card at 330 carrying the
eyebrow **THE CHALLENGE** and one sentence. It is the only frame in the bundle
that draws one, and its copy answers an answer neither picker offers, so it is
reached through the feeling branch's "Give me another" rotation — see
`DECISIONS.md` D038.
