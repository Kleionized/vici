# V3 Q25 Age

* **Design frame** `Email-Login/V3 Q25 Age`
* **App file** src/components/onboarding/v3.tsx (O3FunnelStep) + src/content/onboardingFunnel.ts

## Transcription — `V3 Q25 Age`

Source `UI Final 1/project/Email Login.dc.html`, frame `V3-Q25-Age.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:linear-gradient(180deg, rgb(37,37,35) 0%, rgb(60,59,57) 100%)  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  overflow:hidden  pointer-events:none
    <div> position:absolute  left:-40px  top:-140px  width:540px  height:270px  background:radial-gradient(closest-side, rgba(180,170,150,0.14), rgba(19,19,19,0) 72%)  border-radius:50%  filter:blur(6px)
    <div> position:absolute  left:50%  bottom:-352px  width:640px  height:640px  margin-left:-320px  background:radial-gradient(closest-side, rgba(255,236,196,0.56), rgba(255,236,196,0.25) 45%, rgba(255,236,196,0) 72%)  border-radius:50%
    <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.12
  <div> position:absolute  left:24px  right:24px  top:66px  height:4px  background:rgba(255,255,255,0.2)  border-radius:2px
    <div> position:absolute  left:0  top:0  width:100%  height:4px  background:#F4F3F0  border-radius:2px
  <div> position:absolute  left:16px  top:94px  display:flex  align-items:center  gap:9px
    <svg> viewBox="0 0 11 19"  width="11"  height="19"
      <path> d="M9.5 1.5L2 9.5l7.5 8"  fill="none"  stroke="rgba(244,243,240,0.75)"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
    <span> color:rgba(244,243,240,0.75)  font-size:17px  font-weight:400
      · Back
  <div> position:absolute  left:44px  right:44px  top:158px  color:#F4F3F0  font-size:22px  font-weight:500  letter-spacing:0.1px  line-height:1.32  text-align:center  text-wrap:pretty
    · How old are you?
  <div> position:absolute  left:24px  right:24px  top:281px  height:60px  padding:0 22px  display:flex  align-items:center  gap:3px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.22)
    <span> color:#F4F3F0  font-size:17px  font-weight:500  font-variant-numeric:tabular-nums
      · 24
    <div> width:2px  height:22px  background:#F4F3F0  border-radius:1px
  <div> position:absolute  left:44px  right:44px  top:365px  color:rgba(244,243,240,0.6)  font-size:13.5px  font-weight:400  line-height:20px  text-align:center  text-wrap:pretty
    · We use this for the long-term projection later on.
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
| div at -123.5, 564 | radius | 50% | - | **mismatch** |
| div at 24, 66 | box · paint · type | 24, 66 · 345 × 4 · rgba(255, 255, 255, 0.2) · r 2px · — | identical | match |
| div at 24, 66 | box · paint · type | 24, 66 · 345 × 4 · rgb(244, 243, 240) · r 2px · — | identical | match |
| div at 16, 94 | box · paint · type | 16, 94 · 57.6 × 20 · — · — | identical | match |
| svg at 16, 94.5 | box · paint · type | 16, 94.5 · 11 × 19 · — · — | identical | match |
| path at 18, 96 | box · paint · type | 18, 96 · 7.5 × 16 · — · — | identical | match |
| “Back” | box · paint · type | 36, 94 · 37.6 × 20 · — · 17px/400/normal/normal/rgba(244, 243, 240, 0.75) | identical | match |
| “How old are you?” | box · paint · type | 44, 158 · 305 × 29 · — · 22px/500/0.1px/29.04px/rgb(244, 243, 240) | identical | match |
| div at 24, 281 | box · paint · type | 24, 281 · 345 × 60 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.22) 0px 0px 0px 1px · — | identical | match |
| “24” | box · paint · type | 46, 301 · 21 × 20 · — · 17px/500/normal/normal/rgb(244, 243, 240) | identical | match |
| div at 70, 300 | box · paint · type | 70, 300 · 2 × 22 · rgb(244, 243, 240) · r 1px · — | identical | match |
| “We use this for the long-term projection later o” | box · paint · type | 44, 365 · 305 × 20 · — · 13.5px/400/normal/20px/rgba(244, 243, 240, 0.6) | identical | match |
| div at 24, 744 | box · paint · type | 24, 744 · 345 × 58 · rgb(244, 243, 240) · r 29px · — | identical | match |
| “Continue” | box · paint · type | 159.7, 763 · 73.7 × 20 · — · 17px/600/0.2px/normal/rgb(19, 19, 19) | identical | match |

**15 elements compared; 13 match, 2 differ.**

## Resolutions

* **The value and the bar** — the canvas draws `24` and then the 2 × 22 caret bar 3pt after it, so
  a field stretched to the row would push the bar to the edge. The value is drawn as a text run and
  the input is a transparent layer over the whole row that takes the typing. Measured: value at
  x 46, bar at x 70, both the canvas's own numbers.
* `24` is the canvas's sample value; the app shows whatever the man types. The comparison was run
  with `24` in the field so the two sides are measuring the same state.
* The two `radius: 50% → -` rows are the background washes — `DECISIONS.md` D015.
