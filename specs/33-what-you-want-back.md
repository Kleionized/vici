# What You Want Back

* **Design frame** `Email-Login/What You Want Back`
* **App file** src/components/onboarding/tail.tsx + src/content/onboardingTail.ts

## Transcription — `What You Want Back`

Source `UI Final 1/project/Email Login.dc.html`, frame `What-You-Want-Back.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:linear-gradient(180deg, #FAF9F8 0%, #FDFDFC 100%)  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  overflow:hidden  pointer-events:none
    <div> position:absolute  left:-40px  top:-140px  width:540px  height:270px  background:radial-gradient(closest-side, rgba(180,170,150,0.14), rgba(19,19,19,0) 72%)  border-radius:50%  filter:blur(6px)
    <div> position:absolute  left:50%  bottom:-300px  width:560px  height:560px  margin-left:-280px  background:radial-gradient(closest-side, rgba(255,236,196,0.42), rgba(255,236,196,0.19) 45%, rgba(255,236,196,0) 72%)  border-radius:50%
    <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.12
  <div> position:absolute  left:40px  right:40px  top:170px  color:#1D1C1A  font-size:24px  font-weight:500  letter-spacing:-0.2px  line-height:32px  text-align:center  text-wrap:balance
    · The goal is not a long streak.
  <div> position:absolute  left:44px  right:44px  top:230px  color:#55534E  font-size:14px  font-weight:400  line-height:21px  text-align:center  text-wrap:pretty
    · You said porn gets in the way of your focus, sleep, and confidence. These twelve weeks are about taking those back.
  <div> position:absolute  left:24px  right:24px  top:338px  padding:20px 16px 10px  background:#FFFFFF  border-radius:20px  box-shadow:0 0 0 1px rgba(0,0,0,0.09)  overflow:hidden
    <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.05  pointer-events:none
    <svg> viewBox="0 0 300 170"  width="100%"  display:block  overflow:visible
      <text> x="18"  y="18"  fill="#B0AEA8"  font-size="11"  font-weight="500"
        · how hard urges pull
      <rect> width="14"  height="100"  x="18.0"  y="38"  rx="4"  fill="#131313"  fill-opacity="1.00"
      <rect> width="14"  height="90"  x="40.4"  y="48"  rx="4"  fill="#131313"  fill-opacity="0.94"
      <rect> width="14"  height="80"  x="62.8"  y="58"  rx="4"  fill="#131313"  fill-opacity="0.88"
      <rect> width="14"  height="71"  x="85.2"  y="67"  rx="4"  fill="#131313"  fill-opacity="0.81"
      <rect> width="14"  height="62"  x="107.6"  y="76"  rx="4"  fill="#131313"  fill-opacity="0.75"
      <rect> width="14"  height="54"  x="130.0"  y="84"  rx="4"  fill="#131313"  fill-opacity="0.69"
      <rect> width="14"  height="46"  x="152.4"  y="92"  rx="4"  fill="#131313"  fill-opacity="0.63"
      <rect> width="14"  height="39"  x="174.8"  y="99"  rx="4"  fill="#131313"  fill-opacity="0.57"
      <rect> width="14"  height="32"  x="197.2"  y="106"  rx="4"  fill="#131313"  fill-opacity="0.50"
      <rect> width="14"  height="26"  x="219.6"  y="112"  rx="4"  fill="#131313"  fill-opacity="0.44"
      <rect> width="14"  height="21"  x="242.0"  y="117"  rx="4"  fill="#131313"  fill-opacity="0.38"
      <rect> width="14"  height="16"  x="264.4"  y="122"  rx="4"  fill="#131313"  fill-opacity="0.32"
      <line> x1="14"  y1="138"  x2="286"  y2="138"  stroke="rgba(19,19,19,0.16)"  stroke-width="1.5"
      <text> x="18"  y="158"  fill="#8B8882"  font-size="10.5"  font-weight="500"
        · week I
      <text> x="282"  y="158"  fill="#8B8882"  text-anchor="end"  font-size="10.5"  font-weight="500"
        · week XII
  <div> position:absolute  left:24px  right:24px  top:744px  height:58px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:29px  cursor:pointer
    <span> color:#FFFFFF  font-size:17px  font-weight:600  letter-spacing:0.2px
      · See the twelve weeks
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at -40, -140 | radius | 50% | - | **mismatch** |
| div at -83.5, 592 | radius | 50% | - | **mismatch** |
| “The goal is not a long streak.” | box · paint · type | 40, 170 · 313 × 32 · — · 24px/500/-0.2px/32px/rgb(29, 28, 26) | identical | match |
| “You said porn gets in the way of your focus, sle” | box · paint | 44, 230 · 305 × 63 · — | *absent* | **mismatch** |
| div at 24, 338 | box · paint · type | 24, 338 · 345 × 207.4 · rgb(255, 255, 255) · r 20px · rgba(0, 0, 0, 0.09) 0px 0px 0px 1px · — | identical | match |
| div at 24, 338 | opacity | 0.05 | - | **mismatch** |
| svg at 40, 358 | box · paint · type | 40, 358 · 313 × 177.4 · — · — | identical | match |
| “how hard urges pull” | box · paint · type | 58.8, 365.8 · 109.8 × 13.5 · — · 11px/500/normal/normal/rgb(0, 0, 0) | identical | match |
| rect at 58.8, 397.6 | box · paint · type | 58.8, 397.6 · 14.6 × 104.3 · — · — | identical | match |
| rect at 82.2, 408.1 | box · paint · type | 82.2, 408.1 · 14.6 × 93.9 · — · — | identical | match |
| rect at 105.5, 418.5 | box · paint · type | 105.5, 418.5 · 14.6 × 83.5 · — · — | identical | match |
| rect at 128.9, 427.9 | box · paint · type | 128.9, 427.9 · 14.6 × 74.1 · — · — | identical | match |
| rect at 152.3, 437.3 | box · paint · type | 152.3, 437.3 · 14.6 × 64.7 · — · — | identical | match |
| rect at 175.6, 445.6 | box · paint · type | 175.6, 445.6 · 14.6 × 56.3 · — · — | identical | match |
| rect at 199, 454 | box · paint · type | 199, 454 · 14.6 × 48 · — · — | identical | match |
| rect at 222.4, 461.3 | box · paint · type | 222.4, 461.3 · 14.6 × 40.7 · — · — | identical | match |
| rect at 245.7, 468.6 | box · paint · type | 245.7, 468.6 · 14.6 × 33.4 · — · — | identical | match |
| rect at 269.1, 474.8 | box · paint · type | 269.1, 474.8 · 14.6 × 27.1 · — · — | identical | match |
| rect at 292.5, 480.1 | box · paint · type | 292.5, 480.1 · 14.6 × 21.9 · — · — | identical | match |
| rect at 315.9, 485.3 | box · paint · type | 315.9, 485.3 · 14.6 × 16.7 · — · — | identical | match |
| line at 54.6, 502 | box · paint · type | 54.6, 502 · 283.8 × 0 · — · — | identical | match |
| “week I” | box · paint · type | 58.8, 512.3 · 34.1 × 13 · — · 10.5px/500/normal/normal/rgb(0, 0, 0) | identical | match |
| “week XII” | box · paint · type | 289.2, 512.3 · 45 × 13 · — · 10.5px/500/normal/normal/rgb(0, 0, 0) | identical | match |
| div at 24, 744 | box · paint · type | 24, 744 · 345 × 58 · rgb(19, 19, 19) · r 29px · — | identical | match |
| “See the twelve weeks” | box · paint · type | 109.1, 763 · 174.7 × 20 · — · 17px/600/0.2px/normal/rgb(255, 255, 255) | identical | match |

**25 elements compared; 21 match, 4 differ.**

## Resolutions

Twelve bars falling 100 → 16 with the fill opacity stepping 1.00 → 0.32, at the frame's own x
positions and heights. The subtitle is personalised from what he said the habit interferes with,
so it reads as one row missing and one extra with the same box and metrics.
