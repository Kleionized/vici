# V3 Q13

* **Design frame** `Email-Login/V3 Q13`
* **App file** src/components/onboarding/v3.tsx (O3FunnelStep) + src/content/onboardingFunnel.ts

## Transcription — `V3 Q13`

Source `UI Final 1/project/Email Login.dc.html`, frame `V3-Q13.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:linear-gradient(180deg, rgb(25,25,23) 0%, rgb(42,41,39) 100%)  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  overflow:hidden  pointer-events:none
    <div> position:absolute  left:-40px  top:-140px  width:540px  height:270px  background:radial-gradient(closest-side, rgba(180,170,150,0.14), rgba(19,19,19,0) 72%)  border-radius:50%  filter:blur(6px)
    <div> position:absolute  left:50%  bottom:-296px  width:539px  height:539px  margin-left:-269.5px  background:radial-gradient(closest-side, rgba(255,255,255,0.34), rgba(255,255,255,0.15) 45%, rgba(255,255,255,0) 72%)  border-radius:50%
    <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.12
  <div> position:absolute  left:24px  right:24px  top:66px  height:4px  background:rgba(255,255,255,0.2)  border-radius:2px
    <div> position:absolute  left:0  top:0  width:57%  height:4px  background:#F4F3F0  border-radius:2px
  <div> position:absolute  left:16px  top:94px  display:flex  align-items:center  gap:9px
    <svg> viewBox="0 0 11 19"  width="11"  height="19"
      <path> d="M9.5 1.5L2 9.5l7.5 8"  fill="none"  stroke="rgba(244,243,240,0.75)"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
    <span> color:rgba(244,243,240,0.75)  font-size:17px  font-weight:400
      · Back
  <div> position:absolute  left:44px  right:44px  top:158px  color:#F4F3F0  font-size:22px  font-weight:500  letter-spacing:0.1px  line-height:1.32  text-align:center  text-wrap:pretty
    · How often do you have long stretches of time alone?
  <div> position:absolute  left:24px  right:24px  top:310px  height:60px  padding:0 22px  display:flex  align-items:center  justify-content:space-between  gap:12px  background:#F4F3F0  border-radius:16px  box-shadow:0 0 0 1px rgba(0,0,0,0)
    <span> color:#131313  font-size:17px  font-weight:500  line-height:20px
      · Most days
    <svg> viewBox="0 0 16 12"  width="16"  height="12"
      <path> d="M1.5 6l4.4 4.5L14.5 1.5"  fill="none"  stroke="#131313"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
  <div> position:absolute  left:24px  right:24px  top:384px  height:60px  padding:0 22px  display:flex  align-items:center  justify-content:space-between  gap:12px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.22)
    <span> color:#F4F3F0  font-size:17px  font-weight:500  line-height:20px
      · A few days a week
  <div> position:absolute  left:24px  right:24px  top:458px  height:60px  padding:0 22px  display:flex  align-items:center  justify-content:space-between  gap:12px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.22)
    <span> color:#F4F3F0  font-size:17px  font-weight:500  line-height:20px
      · Occasionally
  <div> position:absolute  left:24px  right:24px  top:532px  height:60px  padding:0 22px  display:flex  align-items:center  justify-content:space-between  gap:12px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.22)
    <span> color:#F4F3F0  font-size:17px  font-weight:500  line-height:20px
      · Rarely
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at -40, -140 | radius | 50% | - | **mismatch** |
| div at -73, 609 | radius | 50% | - | **mismatch** |
| div at 24, 66 | box · paint · type | 24, 66 · 345 × 4 · rgba(255, 255, 255, 0.2) · r 2px · — | identical | match |
| div at 24, 66 | box · paint · type | 24, 66 · 196.6 × 4 · rgb(244, 243, 240) · r 2px · — | identical | match |
| div at 16, 94 | box · paint · type | 16, 94 · 57.6 × 20 · — · — | identical | match |
| svg at 16, 94.5 | box · paint · type | 16, 94.5 · 11 × 19 · — · — | identical | match |
| path at 18, 96 | box · paint · type | 18, 96 · 7.5 × 16 · — · — | identical | match |
| “Back” | box · paint · type | 36, 94 · 37.6 × 20 · — · 17px/400/normal/normal/rgba(244, 243, 240, 0.75) | identical | match |
| “How often do you have long stretches of time alo” | box · paint · type | 44, 158 · 305 × 58.1 · — · 22px/500/0.1px/29.04px/rgb(244, 243, 240) | identical | match |
| div at 24, 310 | box · paint · type | 24, 310 · 345 × 60 · rgb(244, 243, 240) · r 16px · rgba(0, 0, 0, 0) 0px 0px 0px 1px · — | identical | match |
| “Most days” | box · paint · type | 46, 330 · 79.9 × 20 · — · 17px/500/normal/20px/rgb(19, 19, 19) | identical | match |
| svg at 331, 334 | box · paint · type | 331, 334 · 16 × 12 · — · — | identical | match |
| path at 332.5, 335.5 | box · paint · type | 332.5, 335.5 · 13 × 9 · — · — | identical | match |
| div at 24, 384 | box · paint · type | 24, 384 · 345 × 60 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.22) 0px 0px 0px 1px · — | identical | match |
| “A few days a week” | box · paint · type | 46, 404 · 143 × 20 · — · 17px/500/normal/20px/rgb(244, 243, 240) | identical | match |
| div at 24, 458 | box · paint · type | 24, 458 · 345 × 60 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.22) 0px 0px 0px 1px · — | identical | match |
| “Occasionally” | box · paint · type | 46, 478 · 99.1 × 20 · — · 17px/500/normal/20px/rgb(244, 243, 240) | identical | match |
| div at 24, 532 | box · paint · type | 24, 532 · 345 × 60 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.22) 0px 0px 0px 1px · — | identical | match |
| “Rarely” | box · paint · type | 46, 552 · 48.8 × 20 · — · 17px/500/normal/20px/rgb(244, 243, 240) | identical | match |

**19 elements compared; 17 match, 2 differ.**

## Resolutions

The canvas draws a sample selection on this frame; the comparison ran with the same options
selected in the app, so both sides measure the same state. The remaining rows are the two
background washes, which the app draws as SVG ellipses with the same box and stops rather than as
radial-gradient divs — `DECISIONS.md` D015 and D010.

The night field and the progress rule are the frame's own; they are not monotonic in this bundle's
flow order — `DECISIONS.md` D014.
