# Morning 5 Done

* **Design frame** `Email-Login/Morning 5 Done`
* **App file** src/app/day/morning.tsx step DONE; src/components/day/kit.tsx → MorningSky, DayBadge, DayClosing

## Transcription — `Morning 5 Done`

Source `UI Final 1/project/Email Login.dc.html`, frame `Morning-5-Done.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.07  pointer-events:none
  <div> position:absolute  left:16px  top:66px  display:flex  align-items:center  gap:9px
    <svg> viewBox="0 0 11 19"  width="11"  height="19"
      <path> d="M9.5 1.5L2 9.5l7.5 8"  fill="none"  stroke="#55534E"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
    <span> color:#55534E  font-size:17px  font-weight:400
      · Back
  <div> position:absolute  left:0  right:0  top:72px  display:flex  justify-content:center  gap:7px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:18px  height:6px  background:#131313  border-radius:3px
  <div> position:absolute  left:50%  top:27px  width:340px  height:340px  margin-left:-170px  background:radial-gradient(closest-side, rgba(226,186,120,0.34), rgba(226,186,120,0) 72%)  border-radius:50%  filter:blur(4px)
  <div> position:absolute  left:50%  top:168px  width:58px  height:58px  margin-left:-29px  background:#E9D2A4  border-radius:50%
  <div> position:absolute  left:64px  top:140px  width:54px  height:8px  background:rgba(255,255,255,0.6)  border-radius:5px
  <div> position:absolute  left:272px  top:168px  width:42px  height:8px  background:rgba(255,255,255,0.5)  border-radius:5px
  <div> position:absolute  left:-80px  right:-80px  top:360px  height:150px  background:linear-gradient(180deg, #E7E5DB 0%, rgba(244,243,240,0) 80%)  border-radius:50% 50% 0 0 / 88px 88px 0 0
  <div> position:absolute  left:-150px  right:-50px  top:385px  height:150px  background:linear-gradient(180deg, #DFDDD3 0%, rgba(244,243,240,0) 80%)  border-radius:50% 50% 0 0 / 70px 70px 0 0
  <div> position:absolute  left:0  right:0  top:492px  display:flex  justify-content:center
    <div> width:64px  height:64px  display:flex  align-items:center  justify-content:center  background:#FFFFFF  border-radius:50%  box-shadow:0 0 0 1px rgba(0,0,0,0.07), 0 8px 18px rgba(40,38,32,0.12)
      <img> width="34"  height="34"  src="laurel-mark.webp"  alt=""  display:block  object-fit:contain
  <div> position:absolute  left:0  right:0  top:580px  color:#1D1C1A  font-size:27px  font-weight:500  letter-spacing:-0.1px  text-align:center
    · Day 13, underway.
  <div> position:absolute  left:0  right:0  top:622px  color:#8B8882  font-size:14.5px  font-weight:400  text-align:center
    · Pledge re-signed · Day 13
  <div> position:absolute  left:16px  right:16px  top:756px  height:52px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:26px  cursor:pointer
    <span> color:#FFFFFF  font-size:17px  font-weight:600
      · Done
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at 16, 66 | box · paint · type | 16, 66 · 57.6 × 20 · — · — | identical | match |
| svg at 16, 66.5 | box · paint · type | 16, 66.5 · 11 × 19 · — · — | identical | match |
| path at 18, 68 | box · paint · type | 18, 68 · 7.5 × 16 · — · — | identical | match |
| “Back” | box · paint · type | 36, 66 · 37.6 × 20 · — · 17px/400/normal/normal/rgb(85, 83, 78) | identical | match |
| div at 0, 72 | box · paint · type | 0, 72 · 393 × 6 · — · — | identical | match |
| div at 155, 72 | box · paint · type | 155, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 168, 72 | box · paint · type | 168, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 181, 72 | box · paint · type | 181, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 194, 72 | box · paint · type | 194, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 207, 72 | box · paint · type | 207, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 220, 72 | box · paint · type | 220, 72 · 18 × 6 · rgb(19, 19, 19) · r 3px · — | identical | match |
| div at 26.5, 27 | radius | 50% | - | **mismatch** |
| div at 167.5, 168 | radius | 50% | 29px | **mismatch** |
| div at 64, 140 | box · paint · type | 64, 140 · 54 × 8 · rgba(255, 255, 255, 0.6) · r 5px · — | identical | match |
| div at 272, 168 | box · paint · type | 272, 168 · 42 × 8 · rgba(255, 255, 255, 0.5) · r 5px · — | identical | match |
| div at -80, 360 | radius | 50% 50% 0px 0px / 88px 88px 0px 0px | - | **mismatch** |
| div at -150, 385 | radius | 50% 50% 0px 0px / 70px 70px 0px 0px | - | **mismatch** |
| div at 0, 492 | box · paint · type | 0, 492 · 393 × 64 · — · — | identical | match |
| div at 164.5, 492 | radius | 50% | 32px | **mismatch** |
| img at 179.5, 507 | box · paint · type | 179.5, 507 · 34 × 34 · — · — | identical | match |
| “Day 13, underway.” | box · paint · type | 0, 580 · 393 × 31.5 · — · 27px/500/-0.1px/normal/rgb(29, 28, 26) | same box and metrics, value "Day 41, underway." | match (value) |
| “Pledge re-signed · Day 13” | box · paint · type | 0, 622 · 393 × 17 · — · 14.5px/400/normal/normal/rgb(139, 136, 130) | same box and metrics, value "Pledge re-signed · Day 41" | match (value) |
| div at 16, 756 | box · paint · type | 16, 756 · 361 × 52 · rgb(19, 19, 19) · r 26px · — | identical | match |
| “Done” | box · paint · type | 175.7, 772 · 41.7 × 20 · — · 17px/600/normal/normal/rgb(255, 255, 255) | identical | match |

**24 elements compared; 19 match, 5 differ.**

## Reading — every row that is not `match`

Three classes of row differ without the screen differing — `DECISIONS.md` D015,
D019 and D022 — plus the account's own values:

* **`radius: 50% → <n>px`.** React Native's `borderRadius` is a number, not a
  percentage; every one is exactly half the box's shorter side.
* **`radius: 50% → -` with a node count of 1 against 3.** A CSS
  `radial-gradient` div is drawn as `<Svg><Circle fill="url(#…)">` — a View, an
  Svg and a Circle on the same rect. The canvas also blurs these 4px; a
  closest-side radial already dies at its own edge, so the blur term is dropped
  (D010).
* **`radius: 50% 50% 0 0 / Npx … → -`.** An elliptical corner radius cannot be
  expressed in React Native, so each hill is an SVG arc drawn by
  `src/components/ui/Hill.tsx`. Same rect, same silhouette, three nodes.
* **`opacity: 0.07 → -`** on the grain: `expo-image` carries the opacity on the
  image and leaves its wrapper plain (D019).

A row marked **match (value)** is the account's rather than the canvas's: same
box, same colour, same type metrics, different characters. The frames are drawn
against a sample account on day 13 named Jerry; the seeded one is on day 41 and
named Marcus.

Frame-specific: `DawnBand` is deleted outright — its `#EFEEE8 → #F3EEE1` band,
its 140pt glow, its 38pt disc and its three flat hills are all off the canvas —
and the standard morning sky takes its place, bleeding the full frame rather than
living in a 300-tall box. The badge at 438, the headline at 526 and the note at
568 were already right; the note's copy changed from
`Pledge signed · N-day run` to **`Pledge re-signed · Day N`**.
