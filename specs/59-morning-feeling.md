# Morning Feeling

* **Design frame** `Email-Login/Morning Feeling`
* **App file** src/app/day/morning.tsx step FEELING; src/components/day/kit.tsx → MorningSky, MoodDial, ScaleReading

## Transcription — `Morning Feeling`

Source `UI Final 1/project/Email Login.dc.html`, frame `Morning-Feeling.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.07  pointer-events:none
  <div> position:absolute  left:50%  top:53px  width:240px  height:240px  margin-left:-120px  background:radial-gradient(closest-side, rgba(226,186,120,0.3), rgba(226,186,120,0) 72%)  border-radius:50%  filter:blur(4px)
  <div> position:absolute  left:50%  top:150px  width:46px  height:46px  margin-left:-23px  background:#E9D2A4  border-radius:50%
  <div> position:absolute  left:76px  top:118px  width:48px  height:8px  background:rgba(255,255,255,0.55)  border-radius:5px
  <div> position:absolute  left:268px  top:138px  width:38px  height:8px  background:rgba(255,255,255,0.45)  border-radius:5px
  <div> position:absolute  left:-80px  right:-80px  top:196px  height:150px  background:linear-gradient(180deg, #E7E5DB 0%, rgba(244,243,240,0) 80%)  border-radius:50% 50% 0 0 / 88px 88px 0 0
  <div> position:absolute  left:-150px  right:-50px  top:218px  height:150px  background:linear-gradient(180deg, #DFDDD3 0%, rgba(244,243,240,0) 80%)  border-radius:50% 50% 0 0 / 70px 70px 0 0
  <div> position:absolute  left:16px  top:66px  display:flex  align-items:center  gap:9px
    <svg> viewBox="0 0 11 19"  width="11"  height="19"
      <path> d="M9.5 1.5L2 9.5l7.5 8"  fill="none"  stroke="#55534E"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
    <span> color:#55534E  font-size:17px  font-weight:400
      · Back
  <div> position:absolute  left:0  right:0  top:72px  display:flex  justify-content:center  gap:7px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:18px  height:6px  background:#131313  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
  <div> position:absolute  left:24px  top:270px  color:#1D1C1A  font-size:27px  font-weight:500  letter-spacing:-0.1px
    · How are you feeling?
  <div> position:absolute  left:24px  right:24px  top:380px  display:flex  justify-content:space-between
    <div> width:48px  height:48px  background:#FFFFFF  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.12)
    <div> width:48px  height:48px  background:#FFFFFF  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.12)
    <div> width:48px  height:48px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:50%  box-shadow:0 0 0 2px #F4F3F0, 0 0 0 4px #131313
      <div> width:11px  height:11px  background:#F4F3F0  border-radius:50%
    <div> width:48px  height:48px  background:#FFFFFF  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.12)
    <div> width:48px  height:48px  background:#FFFFFF  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.12)
  <div> position:absolute  left:0  right:0  top:502px  color:#1D1C1A  font-size:19px  font-weight:600  text-align:center
    · Steady
  <div> position:absolute  left:0  right:0  top:532px  color:#8B8882  font-size:13.5px  font-weight:400  text-align:center
    · On level ground
  <div> position:absolute  left:16px  right:16px  top:756px  height:52px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:26px  cursor:pointer
    <span> color:#FFFFFF  font-size:17px  font-weight:600
      · Continue
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at 76.5, 53 | radius | 50% | - | **mismatch** |
| div at 173.5, 150 | radius | 50% | 23px | **mismatch** |
| div at 76, 118 | box · paint · type | 76, 118 · 48 × 8 · rgba(255, 255, 255, 0.55) · r 5px · — | identical | match |
| div at 268, 138 | box · paint · type | 268, 138 · 38 × 8 · rgba(255, 255, 255, 0.45) · r 5px · — | identical | match |
| div at -80, 196 | radius | 50% 50% 0px 0px / 88px 88px 0px 0px | - | **mismatch** |
| div at -150, 218 | radius | 50% 50% 0px 0px / 70px 70px 0px 0px | - | **mismatch** |
| div at 16, 66 | box · paint · type | 16, 66 · 57.6 × 20 · — · — | identical | match |
| svg at 16, 66.5 | box · paint · type | 16, 66.5 · 11 × 19 · — · — | identical | match |
| path at 18, 68 | box · paint · type | 18, 68 · 7.5 × 16 · — · — | identical | match |
| “Back” | box · paint · type | 36, 66 · 37.6 × 20 · — · 17px/400/normal/normal/rgb(85, 83, 78) | identical | match |
| div at 0, 72 | box · paint · type | 0, 72 · 393 × 6 · — · — | identical | match |
| div at 155, 72 | box · paint · type | 155, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 168, 72 | box · paint · type | 168, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 181, 72 | box · paint · type | 181, 72 · 18 × 6 · rgb(19, 19, 19) · r 3px · — | identical | match |
| div at 206, 72 | box · paint · type | 206, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 219, 72 | box · paint · type | 219, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 232, 72 | box · paint · type | 232, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| “How are you feeling?” | box · paint · type | 24, 270 · 245.5 × 31.5 · — · 27px/500/-0.1px/normal/rgb(29, 28, 26) | identical | match |
| div at 24, 380 | box · paint · type | 24, 380 · 345 × 48 · — · — | identical | match |
| div at 24, 380 | radius | 50% | 24px | **mismatch** |
| div at 98.3, 380 | radius | 50% | 24px | **mismatch** |
| div at 172.5, 380 | radius | 50% | 24px | **mismatch** |
| div at 191, 398.5 | radius | 50% | 5.5px | **mismatch** |
| div at 246.8, 380 | radius | 50% | 24px | **mismatch** |
| div at 321, 380 | radius | 50% | 24px | **mismatch** |
| “Steady” | box · paint · type | 0, 502 · 393 × 22.5 · — · 19px/600/normal/normal/rgb(29, 28, 26) | identical | match |
| “On level ground” | box · paint · type | 0, 532 · 393 × 16 · — · 13.5px/400/normal/normal/rgb(139, 136, 130) | identical | match |
| div at 16, 756 | box · paint · type | 16, 756 · 361 × 52 · rgb(19, 19, 19) · r 26px · — | identical | match |
| “Continue” | box · paint · type | 160.5, 772 · 72.1 × 20 · — · 17px/600/normal/normal/rgb(255, 255, 255) | identical | match |

**29 elements compared; 19 match, 10 differ.**

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

Frame-specific: a new frame. The whole backdrop is the morning sky —
`MorningSky` in `src/components/day/kit.tsx`, passed as `DayShell`'s **backdrop**
so it is measured from the true screen top rather than from under the safe-area
inset. `SunMark`'s single cloud bar and two grey ground bars, which the canvas
never drew, are deleted.

The title, dial and reading all moved up 20 — 216 / 326 / 448 — and the reading's
copy for the rung the frame draws changed from "Even · Nothing pulling" to
**"Steady · On level ground"**. The other four rungs are the app's own and cannot
be checked against this frame.
