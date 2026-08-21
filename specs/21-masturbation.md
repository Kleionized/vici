# V3 Q16

* **Design frame** `Email-Login/V3 Q16`
* **App file** src/components/onboarding/v3.tsx (O3FunnelStep) + src/content/onboardingFunnel.ts

## Transcription — `V3 Q16`

Source `UI Final 1/project/Email Login.dc.html`, frame `V3-Q16.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:linear-gradient(180deg, rgb(28,28,26) 0%, rgb(47,46,44) 100%)  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  overflow:hidden  pointer-events:none
    <div> position:absolute  left:-40px  top:-140px  width:540px  height:270px  background:radial-gradient(closest-side, rgba(180,170,150,0.14), rgba(19,19,19,0) 72%)  border-radius:50%  filter:blur(6px)
    <div> position:absolute  left:50%  bottom:-317px  width:576px  height:576px  margin-left:-288px  background:radial-gradient(closest-side, rgba(255,236,196,0.41), rgba(255,236,196,0.18) 45%, rgba(255,236,196,0) 72%)  border-radius:50%
    <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.12
  <div> position:absolute  left:24px  right:24px  top:66px  height:4px  background:rgba(255,255,255,0.2)  border-radius:2px
    <div> position:absolute  left:0  top:0  width:70%  height:4px  background:#F4F3F0  border-radius:2px
  <div> position:absolute  left:16px  top:94px  display:flex  align-items:center  gap:9px
    <svg> viewBox="0 0 11 19"  width="11"  height="19"
      <path> d="M9.5 1.5L2 9.5l7.5 8"  fill="none"  stroke="rgba(244,243,240,0.75)"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
    <span> color:rgba(244,243,240,0.75)  font-size:17px  font-weight:400
      · Back
  <div> position:absolute  left:44px  right:44px  top:158px  color:#F4F3F0  font-size:22px  font-weight:500  letter-spacing:0.1px  line-height:1.32  text-align:center  text-wrap:pretty
    · What do you want to do about masturbation?
  <div> position:absolute  left:24px  right:24px  top:281px  height:60px  padding:0 22px  display:flex  align-items:center  justify-content:space-between  gap:12px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.22)
    <span> color:#F4F3F0  font-size:17px  font-weight:500  line-height:20px
      · Stop for now
  <div> position:absolute  left:24px  right:24px  top:355px  height:60px  padding:0 22px  display:flex  align-items:center  justify-content:space-between  gap:12px  background:#F4F3F0  border-radius:16px  box-shadow:0 0 0 1px rgba(0,0,0,0)
    <span> color:#131313  font-size:17px  font-weight:500  line-height:20px
      · Do it less often
    <svg> viewBox="0 0 16 12"  width="16"  height="12"
      <path> d="M1.5 6l4.4 4.5L14.5 1.5"  fill="none"  stroke="#131313"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
  <div> position:absolute  left:24px  right:24px  top:429px  height:60px  padding:0 22px  display:flex  align-items:center  justify-content:space-between  gap:12px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.22)
    <span> color:#F4F3F0  font-size:17px  font-weight:500  line-height:20px
      · Keep it, just without porn
  <div> position:absolute  left:24px  right:24px  top:503px  height:60px  padding:0 22px  display:flex  align-items:center  justify-content:space-between  gap:12px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.22)
    <span> color:#F4F3F0  font-size:17px  font-weight:500  line-height:20px
      · I haven’t decided yet
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at -40, -140 | radius | 50% | - | **mismatch** |
| div at -91.5, 593 | radius | 50% | - | **mismatch** |
| div at 24, 66 | box · paint · type | 24, 66 · 345 × 4 · rgba(255, 255, 255, 0.2) · r 2px · — | identical | match |
| div at 24, 66 | box · paint · type | 24, 66 · 241.5 × 4 · rgb(244, 243, 240) · r 2px · — | identical | match |
| div at 16, 94 | box · paint · type | 16, 94 · 57.6 × 20 · — · — | identical | match |
| svg at 16, 94.5 | box · paint · type | 16, 94.5 · 11 × 19 · — · — | identical | match |
| path at 18, 96 | box · paint · type | 18, 96 · 7.5 × 16 · — · — | identical | match |
| “Back” | box · paint · type | 36, 94 · 37.6 × 20 · — · 17px/400/normal/normal/rgba(244, 243, 240, 0.75) | identical | match |
| “What do you want to do about masturbation?” | box · paint · type | 44, 158 · 305 × 58.1 · — · 22px/500/0.1px/29.04px/rgb(244, 243, 240) | identical | match |
| div at 24, 281 | box · paint · type | 24, 281 · 345 × 60 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.22) 0px 0px 0px 1px · — | identical | match |
| “Stop for now” | box · paint · type | 46, 301 · 99 × 20 · — · 17px/500/normal/20px/rgb(244, 243, 240) | identical | match |
| div at 24, 355 | box · paint · type | 24, 355 · 345 × 60 · rgb(244, 243, 240) · r 16px · rgba(0, 0, 0, 0) 0px 0px 0px 1px · — | identical | match |
| “Do it less often” | box · paint · type | 46, 375 · 116.2 × 20 · — · 17px/500/normal/20px/rgb(19, 19, 19) | identical | match |
| svg at 331, 379 | box · paint · type | 331, 379 · 16 × 12 · — · — | identical | match |
| path at 332.5, 380.5 | box · paint · type | 332.5, 380.5 · 13 × 9 · — · — | identical | match |
| div at 24, 429 | box · paint · type | 24, 429 · 345 × 60 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.22) 0px 0px 0px 1px · — | identical | match |
| “Keep it, just without porn” | box · paint · type | 46, 449 · 194.3 × 20 · — · 17px/500/normal/20px/rgb(244, 243, 240) | identical | match |
| div at 24, 503 | box · paint · type | 24, 503 · 345 × 60 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.22) 0px 0px 0px 1px · — | identical | match |
| “I haven’t decided yet” | box · paint · type | 46, 523 · 161.5 × 20 · — · 17px/500/normal/20px/rgb(244, 243, 240) | identical | match |

**19 elements compared; 17 match, 2 differ.**

## Resolutions

The canvas draws a sample selection on this frame; the comparison ran with the same options
selected in the app, so both sides measure the same state. The remaining rows are the two
background washes, which the app draws as SVG ellipses with the same box and stops rather than as
radial-gradient divs — `DECISIONS.md` D015 and D010.

The night field and the progress rule are the frame's own; they are not monotonic in this bundle's
flow order — `DECISIONS.md` D014.
