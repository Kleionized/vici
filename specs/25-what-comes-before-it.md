# What Comes Before It

* **Design frame** `Email-Login/What Comes Before It`
* **App file** src/components/onboarding/tail.tsx + src/content/onboardingTail.ts

## Transcription — `What Comes Before It`

Source `UI Final 1/project/Email Login.dc.html`, frame `What-Comes-Before-It.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.07  pointer-events:none
  <div> position:absolute  inset:0  overflow:hidden  pointer-events:none
    <div> position:absolute  left:-15%  top:-190px  width:130%  height:300px  background:radial-gradient(closest-side, rgba(180,170,150,0.32), rgba(180,170,150,0.1) 55%, rgba(180,170,150,0) 75%)  border-radius:50%  filter:blur(5px)
    <div> position:absolute  left:50%  bottom:-260px  width:520px  height:520px  margin-left:-260px  background:radial-gradient(closest-side, rgba(255,236,196,0.4), rgba(255,236,196,0.18) 45%, rgba(255,236,196,0) 72%)  border-radius:50%
  <div> position:absolute  left:50%  top:150px  width:260px  height:280px  margin-left:-130px
    <div> position:absolute  left:44px  top:16px  width:172px  height:172px  background:radial-gradient(closest-side, rgba(226,186,120,0.46), rgba(226,186,120,0) 74%)  border-radius:50%  filter:blur(5px)
    <div> position:absolute  left:52px  top:248px  width:156px  height:15px  background:rgba(0,0,0,0.10)  border-radius:50%  filter:blur(6px)
    <div> position:absolute  left:56px  top:52px  width:148px  height:152px  background:#FFFFFF  border-radius:9px  box-shadow:0 0 0 1px rgba(0,0,0,0.07), 0 18px 36px rgba(40,38,32,0.16)  transform:rotate(-2deg)  overflow:hidden
      <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.05
      <div> position:absolute  left:14px  top:13px  width:52px  height:5px  background:#E0DFDA  border-radius:3px
      <svg> viewBox="0 0 120 100"  width="120"  height="100"  position:absolute  left:14px  top:30px
        <path> d="M8 88 C30 74 22 52 44 44 C68 35 78 26 104 12"  fill="none"  stroke="#131313"  stroke-width="2.4"  stroke-linecap="round"  stroke-dasharray="1 8"
        <circle> cx="8"  cy="88"  r="5"  fill="#131313"
        <circle> cx="44"  cy="44"  r="4"  fill="#FFFFFF"  stroke="#131313"  stroke-width="2"
        <path> d="M104 12 L104 0 L96 0"  stroke="none"
        <rect> width="3"  height="18"  x="102"  y="-2"  rx="1.5"  fill="#131313"
        <path> d="M105 0 L118 4.5 L105 9 Z"  fill="#131313"
      <div> position:absolute  right:12px  bottom:12px  width:26px  height:26px  background:radial-gradient(circle at 38% 30%, #F0DBB4, #E2BA78 70%)  border-radius:50%
  <div> position:absolute  left:36px  right:36px  top:472px  color:#1D1C1A  font-size:24px  font-weight:500  letter-spacing:-0.1px  line-height:32px  text-align:center  text-wrap:balance
    · You said stress often shows up before you watch.
  <div> position:absolute  left:44px  right:44px  top:560px  color:#55534E  font-size:15.5px  font-weight:400  line-height:23px  text-align:center  text-wrap:pretty
    · When that happens, SOS will first help you get out of the situation — not sit and argue with the urge.
  <div> position:absolute  left:24px  right:24px  top:688px  height:56px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:28px  cursor:pointer
    <span> color:#FFFFFF  font-size:17px  font-weight:600  letter-spacing:0.2px
      · Continue
  <div> position:absolute  left:0  right:0  top:764px  color:#8B8882  font-size:15px  font-weight:500  text-align:center
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at -58.9, -190 | radius | 50% | - | **mismatch** |
| div at -63.5, 592 | radius | 50% | - | **mismatch** |
| div at 66.5, 150 | box · paint · type | 66.5, 150 · 260 × 280 · — · — | identical | match |
| div at 110.5, 166 | radius | 50% | - | **mismatch** |
| div at 118.5, 398 | background | rgba(0, 0, 0, 0.1) | - | **mismatch** |
| div at 118.5, 398 | radius | 50% | - | **mismatch** |
| div at 119.9, 199.5 | box · paint · type | 119.9, 199.5 · 153.2 × 157.1 · rgb(255, 255, 255) · r 9px · rgba(0, 0, 0, 0.07) 0px 0px 0px 1px, rgba(40, 38, 32, 0.16) 0px 18px 36px 0px · — | identical | match |
| div at 119.9, 199.5 | opacity | 0.05 | - | **mismatch** |
| div at 134.3, 215.3 | box · paint · type | 134.3, 215.3 · 52.1 × 6.8 · rgb(224, 223, 218) · r 3px · — | identical | match |
| svg at 134.9, 229.9 | box · paint · type | 134.9, 229.9 · 123.4 × 104.1 · — · — | identical | match |
| path at 143.3, 242.5 | box · paint · type | 143.3, 242.5 · 98.6 × 79.3 · — · — | identical | match |
| circle at 140.8, 316.6 | box · paint · type | 140.8, 316.6 · 10.3 × 10.3 · — · — | identical | match |
| circle at 176.3, 272.4 | box · paint · type | 176.3, 272.4 · 8.3 × 8.3 · — · — | identical | match |
| path at 230.9, 230.5 | box · paint | 230.9, 230.5 · 8.4 × 12.3 · — | *absent* | **mismatch** |
| rect at 236.8, 228.5 | box · paint · type | 236.8, 228.5 · 3.6 × 18.1 · — · — | identical | match |
| path at 239.9, 230 | box · paint · type | 239.9, 230 · 13.3 × 9.4 · — · — | identical | match |
| div at 233.8, 313.8 | radius | 50% | - | **mismatch** |
| “You said stress often shows up before you watch.” | box · paint | 36, 472 · 321 × 64 · — | *absent* | **mismatch** |
| “When that happens, SOS will first help you get o” | box · paint · type | 44, 560 · 305 × 69 · — · 15.5px/400/normal/23px/rgb(85, 83, 78) | identical | match |
| div at 24, 688 | box · paint · type | 24, 688 · 345 × 56 · rgb(19, 19, 19) · r 28px · — | identical | match |
| “Continue” | box · paint · type | 159.7, 706 · 73.7 × 20 · — · 17px/600/0.2px/normal/rgb(255, 255, 255) | identical | match |
| div at 0, 764 | box · paint | 0, 764 · 393 × 0 · — | *absent* | **mismatch** |

**21 elements compared; 12 match, 9 differ.**

## Resolutions

* The title is personalised — the canvas's sample says "stress", the app says the noun its answers
  select — so it reads as one row missing and one extra with the same box and metrics.
* **One design element is invisible.** The card's climb art carries
  `<path d="M104 12 L104 0 L96 0" stroke="none">` with no fill and no stroke. It paints nothing;
  its only trace is a bounding box. It is not drawn.
* The frame carries a `15px/500 #8B8882` line at y 764 with **no words in it**; no empty element is
  rendered for it.
* This frame states its own field rather than the tail's: `#F4F3F0` ground, 0.07 grain, a
  `rgba(180,170,150,0.32)` top wash and a 520pt sun hung 260 below the bottom edge.
