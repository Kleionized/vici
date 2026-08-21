# First Principle

* **Design frame** `Email-Login/First Principle`
* **App file** src/components/onboarding/v3.tsx (O3FunnelStep) + src/content/onboardingFunnel.ts

## Transcription — `First Principle`

Source `UI Final 1/project/Email Login.dc.html`, frame `First-Principle.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:linear-gradient(180deg, rgb(21,21,19) 0%, rgb(35,34,32) 100%)  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  overflow:hidden  pointer-events:none
    <div> position:absolute  left:-40px  top:-140px  width:540px  height:270px  background:radial-gradient(closest-side, rgba(180,170,150,0.14), rgba(19,19,19,0) 72%)  border-radius:50%  filter:blur(6px)
    <div> position:absolute  left:50%  bottom:-266px  width:484px  height:484px  margin-left:-242px  background:radial-gradient(closest-side, rgba(255,236,196,0.28), rgba(255,236,196,0.12) 45%, rgba(255,236,196,0) 72%)  border-radius:50%
    <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.12
  <div> position:absolute  left:16px  top:96px  display:flex  align-items:center  gap:9px
    <svg> viewBox="0 0 11 19"  width="11"  height="19"
      <path> d="M9.5 1.5L2 9.5l7.5 8"  fill="none"  stroke="rgba(244,243,240,0.75)"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
    <span> color:rgba(244,243,240,0.75)  font-size:17px  font-weight:400
      · Back
  <div> position:absolute  left:24px  right:24px  top:66px  height:4px  background:rgba(255,255,255,0.2)  border-radius:2px
    <div> position:absolute  left:0  top:0  width:15%  height:4px  background:#F4F3F0  border-radius:2px
  <div> position:absolute  left:0  right:0  top:206px  height:310px
    <div> position:absolute  left:50%  top:60px  width:220px  height:200px  margin-left:-110px  background:radial-gradient(closest-side, rgba(255,236,196,0.3), rgba(255,236,196,0) 74%)  border-radius:50%  filter:blur(7px)
    <div> position:absolute  left:50%  top:158px  width:180px  height:18px  margin-left:-90px  background:rgba(0,0,0,0.4)  border-radius:50%  filter:blur(10px)
    <svg> viewBox="0 0 230 180"  width="230"  height="180"  position:absolute  left:50%  top:36px  margin-left:-115px
      <defs> 
        <lineargradient> id="obW"  x1="0"  y1="0"  x2="1"  y2="0"
          <stop> offset="0"  stop-color="#F7F6F2"
          <stop> offset="1"  stop-color="#C9C6BD"
      <path> d="M14 96 C40 88 62 86 92 90"  fill="none"  stroke="url(#obW)"  stroke-width="15"  stroke-linecap="round"
      <path> d="M138 92 C168 96 194 104 216 114"  fill="none"  stroke="url(#obW)"  stroke-width="15"  stroke-linecap="round"
      <path> d="M92 88 C104 84 112 86 120 90"  fill="none"  stroke="rgba(244,243,240,0.55)"  stroke-width="3.5"  stroke-linecap="round"
      <path> d="M94 94 C106 94 116 92 134 92"  fill="none"  stroke="rgba(244,243,240,0.4)"  stroke-width="3.5"  stroke-linecap="round"
      <path> d="M96 100 C106 104 118 100 136 97"  fill="none"  stroke="rgba(244,243,240,0.28)"  stroke-width="3.5"  stroke-linecap="round"
      <circle> cx="115"  cy="76"  r="4"  fill="#E9D2A4"
  <div> position:absolute  left:26px  right:26px  top:514px  color:#F4F3F0  font-size:22px  font-weight:500  letter-spacing:0.1px  line-height:1.32  text-align:center  text-wrap:pretty
    · Urges do not stay at full strength forever.
  <div> position:absolute  left:26px  right:26px  top:593px  color:rgba(244,243,240,0.75)  font-size:15.5px  font-weight:400  line-height:23px  text-align:center  text-wrap:pretty
    · The first job is to get through the few minutes when acting on one feels easiest.
  <div> position:absolute  left:0  right:0  top:712px  display:flex  justify-content:center  gap:10px
    <div> width:7px  height:7px  background:#F4F3F0  border-radius:50%
    <div> width:7px  height:7px  background:rgba(255,255,255,0.25)  border-radius:50%
    <div> width:7px  height:7px  background:rgba(255,255,255,0.25)  border-radius:50%
    <div> width:7px  height:7px  background:rgba(255,255,255,0.25)  border-radius:50%
  <div> position:absolute  left:24px  right:24px  top:744px  height:58px  display:flex  align-items:center  justify-content:center  background:#F4F3F0  border-radius:29px  cursor:pointer
    <span> color:#131313  font-size:17px  font-weight:600  letter-spacing:0.2px
      · Continue
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at -40, -140 | radius | 50% | - | **mismatch** |
| div at -45.5, 634 | radius | 50% | - | **mismatch** |
| div at 16, 96 | box · paint · type | 16, 96 · 57.6 × 20 · — · — | identical | match |
| svg at 16, 96.5 | box · paint · type | 16, 96.5 · 11 × 19 · — · — | identical | match |
| path at 18, 98 | box · paint · type | 18, 98 · 7.5 × 16 · — · — | identical | match |
| “Back” | box · paint · type | 36, 96 · 37.6 × 20 · — · 17px/400/normal/normal/rgba(244, 243, 240, 0.75) | identical | match |
| div at 24, 66 | box · paint · type | 24, 66 · 345 × 4 · rgba(255, 255, 255, 0.2) · r 2px · — | identical | match |
| div at 24, 66 | box · paint · type | 24, 66 · 51.8 × 4 · rgb(244, 243, 240) · r 2px · — | identical | match |
| div at 0, 206 | box · paint · type | 0, 206 · 393 × 310 · — · — | identical | match |
| div at 86.5, 266 | radius | 50% | - | **mismatch** |
| div at 106.5, 364 | background | rgba(0, 0, 0, 0.4) | - | **mismatch** |
| div at 106.5, 364 | radius | 50% | - | **mismatch** |
| svg at 81.5, 242 | box · paint · type | 81.5, 242 · 230 × 180 · — · — | identical | match |
| path at 95.5, 330 | box · paint · type | 95.5, 330 · 78 × 8 · — · — | identical | match |
| path at 219.5, 334 | box · paint · type | 219.5, 334 · 78 × 22 · — · — | identical | match |
| path at 173.5, 327.8 | box · paint · type | 173.5, 327.8 · 28 × 4.2 · — · — | identical | match |
| path at 175.5, 334 | box · paint · type | 175.5, 334 · 40 × 2 · — · — | identical | match |
| path at 177.5, 339 | box · paint · type | 177.5, 339 · 40 × 4.7 · — · — | identical | match |
| circle at 192.5, 314 | box · paint · type | 192.5, 314 · 8 × 8 · — · — | identical | match |
| “Urges do not stay at full strength forever.” | box · paint · type | 26, 514 · 341 × 58.1 · — · 22px/500/0.1px/29.04px/rgb(244, 243, 240) | identical | match |
| “The first job is to get through the few minutes ” | box · paint · type | 26, 593 · 341 × 46 · — · 15.5px/400/normal/23px/rgba(244, 243, 240, 0.75) | identical | match |
| div at 0, 712 | box · paint · type | 0, 712 · 393 × 7 · — · — | identical | match |
| div at 167.5, 712 | radius | 50% | 3.5px | **mismatch** |
| div at 184.5, 712 | radius | 50% | 3.5px | **mismatch** |
| div at 201.5, 712 | radius | 50% | 3.5px | **mismatch** |
| div at 218.5, 712 | radius | 50% | 3.5px | **mismatch** |
| div at 24, 744 | box · paint · type | 24, 744 · 345 × 58 · rgb(244, 243, 240) · r 29px · — | identical | match |
| “Continue” | box · paint · type | 159.7, 763 · 73.7 × 20 · — · 17px/600/0.2px/normal/rgb(19, 19, 19) | identical | match |

**27 elements compared; 19 match, 8 differ.**

## Resolutions

* **Back at 96, not 94** — this frame alone puts the Back row 2px lower than every other funnel
  frame. The app reads the offset off the frame (`FunnelStep.backTop`) rather than sharing one
  constant, so the 2px is kept.
* **The four pager dots** — the canvas draws four, the first filled, and the three screens that
  used to occupy positions 2–4 (`Lesson Rewire`, `Lesson Anchor`, `Lesson Small Steps`) are
  withdrawn from this bundle. The dots are drawn as drawn, four of them, with the first filled;
  three of them will never light. This is the canvas contradicting itself and it is implemented as
  the canvas draws it, per the brief's rule 3. The `radius: 50% → 3.5px` rows are those dots —
  `DECISIONS.md` D015.
* **The wave art** is drawn from the frame's own path data: two 15pt strokes on a left-to-right
  `#F7F6F2 → #C9C6BD` gradient with a gap between them, three thin arcs at 3.5pt in
  `rgba(244,243,240,0.55/0.4/0.28)` running through the gap, and a 4pt `#E9D2A4` dot at (115, 76).
  The warm bloom and the ground shadow are radials standing in for `blur(7px)` and `blur(10px)` —
  `DECISIONS.md` D010.
