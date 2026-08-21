# V3 Q1

* **Design frame** `Email-Login/V3 Q1`
* **App file** src/components/onboarding/v3.tsx (O3FunnelStep) + src/content/onboardingFunnel.ts

## Transcription — `V3 Q1`

Source `UI Final 1/project/Email Login.dc.html`, frame `V3-Q1.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:linear-gradient(180deg, rgb(15,15,13) 0%, rgb(26,25,23) 100%)  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  overflow:hidden  pointer-events:none
    <div> position:absolute  left:-40px  top:-140px  width:540px  height:270px  background:radial-gradient(closest-side, rgba(180,170,150,0.14), rgba(19,19,19,0) 72%)  border-radius:50%  filter:blur(6px)
    <div> position:absolute  left:50%  bottom:-231px  width:420px  height:420px  margin-left:-210px  background:radial-gradient(closest-side, rgba(255,236,196,0.10), rgba(255,236,196,0.05) 45%, rgba(255,236,196,0) 72%)  border-radius:50%
    <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.12
  <div> position:absolute  left:24px  right:24px  top:66px  height:4px  background:rgba(255,255,255,0.2)  border-radius:2px
    <div> position:absolute  left:0  top:0  width:4%  height:4px  background:#F4F3F0  border-radius:2px
  <div> position:absolute  left:16px  top:94px  display:flex  align-items:center  gap:9px
    <svg> viewBox="0 0 11 19"  width="11"  height="19"
      <path> d="M9.5 1.5L2 9.5l7.5 8"  fill="none"  stroke="rgba(244,243,240,0.75)"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
    <span> color:rgba(244,243,240,0.75)  font-size:17px  font-weight:400
      · Back
  <div> position:absolute  left:44px  right:44px  top:158px  color:#F4F3F0  font-size:22px  font-weight:500  letter-spacing:0.1px  line-height:1.32  text-align:center  text-wrap:pretty
    · How often do you watch porn right now?
  <div> position:absolute  left:24px  right:24px  top:310px  height:60px  padding:0 22px  display:flex  align-items:center  justify-content:space-between  gap:12px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.22)
    <span> color:#F4F3F0  font-size:17px  font-weight:500  line-height:20px
      · Several times a day
  <div> position:absolute  left:24px  right:24px  top:384px  height:60px  padding:0 22px  display:flex  align-items:center  justify-content:space-between  gap:12px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.22)
    <span> color:#F4F3F0  font-size:17px  font-weight:500  line-height:20px
      · About once a day
  <div> position:absolute  left:24px  right:24px  top:458px  height:60px  padding:0 22px  display:flex  align-items:center  justify-content:space-between  gap:12px  background:#F4F3F0  border-radius:16px  box-shadow:0 0 0 1px rgba(0,0,0,0)
    <span> color:#131313  font-size:17px  font-weight:500  line-height:20px
      · A few times a week
    <svg> viewBox="0 0 16 12"  width="16"  height="12"
      <path> d="M1.5 6l4.4 4.5L14.5 1.5"  fill="none"  stroke="#131313"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
  <div> position:absolute  left:24px  right:24px  top:532px  height:60px  padding:0 22px  display:flex  align-items:center  justify-content:space-between  gap:12px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.22)
    <span> color:#F4F3F0  font-size:17px  font-weight:500  line-height:20px
      · About once a week
  <div> position:absolute  left:24px  right:24px  top:606px  height:60px  padding:0 22px  display:flex  align-items:center  justify-content:space-between  gap:12px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.22)
    <span> color:#F4F3F0  font-size:17px  font-weight:500  line-height:20px
      · A few times a month
  <div> position:absolute  left:24px  right:24px  top:680px  height:60px  padding:0 22px  display:flex  align-items:center  justify-content:space-between  gap:12px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.22)
    <span> color:#F4F3F0  font-size:17px  font-weight:500  line-height:20px
      · Less than once a month
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at -40, -140 | radius | 50% | - | **mismatch** |
| div at -13.5, 663 | radius | 50% | - | **mismatch** |
| div at 24, 66 | box · paint · type | 24, 66 · 345 × 4 · rgba(255, 255, 255, 0.2) · r 2px · — | identical | match |
| div at 24, 66 | box · paint · type | 24, 66 · 13.8 × 4 · rgb(244, 243, 240) · r 2px · — | identical | match |
| div at 16, 94 | box · paint · type | 16, 94 · 57.6 × 20 · — · — | identical | match |
| svg at 16, 94.5 | box · paint · type | 16, 94.5 · 11 × 19 · — · — | identical | match |
| path at 18, 96 | box · paint · type | 18, 96 · 7.5 × 16 · — · — | identical | match |
| “Back” | box · paint · type | 36, 94 · 37.6 × 20 · — · 17px/400/normal/normal/rgba(244, 243, 240, 0.75) | identical | match |
| “How often do you watch porn right now?” | box · paint · type | 44, 158 · 305 × 58.1 · — · 22px/500/0.1px/29.04px/rgb(244, 243, 240) | identical | match |
| div at 24, 310 | box · paint · type | 24, 310 · 345 × 60 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.22) 0px 0px 0px 1px · — | identical | match |
| “Several times a day” | box · paint · type | 46, 330 · 150.4 × 20 · — · 17px/500/normal/20px/rgb(244, 243, 240) | identical | match |
| div at 24, 384 | box · paint · type | 24, 384 · 345 × 60 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.22) 0px 0px 0px 1px · — | identical | match |
| “About once a day” | box · paint · type | 46, 404 · 135.3 × 20 · — · 17px/500/normal/20px/rgb(244, 243, 240) | identical | match |
| div at 24, 458 | box · paint · type | 24, 458 · 345 × 60 · rgb(244, 243, 240) · r 16px · rgba(0, 0, 0, 0) 0px 0px 0px 1px · — | identical | match |
| “A few times a week” | box · paint · type | 46, 478 · 149.3 × 20 · — · 17px/500/normal/20px/rgb(19, 19, 19) | identical | match |
| svg at 331, 482 | box · paint · type | 331, 482 · 16 × 12 · — · — | identical | match |
| path at 332.5, 483.5 | box · paint · type | 332.5, 483.5 · 13 × 9 · — · — | identical | match |
| div at 24, 532 | box · paint · type | 24, 532 · 345 × 60 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.22) 0px 0px 0px 1px · — | identical | match |
| “About once a week” | box · paint · type | 46, 552 · 148 × 20 · — · 17px/500/normal/20px/rgb(244, 243, 240) | identical | match |
| div at 24, 606 | box · paint · type | 24, 606 · 345 × 60 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.22) 0px 0px 0px 1px · — | identical | match |
| “A few times a month” | box · paint · type | 46, 626 · 158.5 × 20 · — · 17px/500/normal/20px/rgb(244, 243, 240) | identical | match |
| div at 24, 680 | box · paint · type | 24, 680 · 345 × 60 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.22) 0px 0px 0px 1px · — | identical | match |
| “Less than once a month” | box · paint · type | 46, 700 · 184.7 × 20 · — · 17px/500/normal/20px/rgb(244, 243, 240) | identical | match |

**23 elements compared; 21 match, 2 differ.**

## Resolutions

The canvas draws a sample selection on this frame; the comparison ran with the same options
selected in the app, so both sides measure the same state. The remaining rows are the two
background washes, which the app draws as SVG ellipses with the same box and stops rather than as
radial-gradient divs — `DECISIONS.md` D015 and D010.

The night field and the progress rule are the frame's own; they are not monotonic in this bundle's
flow order — `DECISIONS.md` D014.
