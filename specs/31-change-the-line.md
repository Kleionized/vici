# Change the Line

* **Design frame** `Email-Login/Change the Line`
* **App file** src/components/onboarding/tail.tsx + src/content/onboardingTail.ts

## Transcription — `Change the Line`

Source `UI Final 1/project/Email Login.dc.html`, frame `Change-the-Line.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:linear-gradient(180deg, #FAF9F8 0%, #FDFDFC 100%)  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  overflow:hidden  pointer-events:none
    <div> position:absolute  left:-40px  top:-140px  width:540px  height:270px  background:radial-gradient(closest-side, rgba(180,170,150,0.14), rgba(19,19,19,0) 72%)  border-radius:50%  filter:blur(6px)
    <div> position:absolute  left:50%  bottom:-300px  width:560px  height:560px  margin-left:-280px  background:radial-gradient(closest-side, rgba(255,236,196,0.42), rgba(255,236,196,0.19) 45%, rgba(255,236,196,0) 72%)  border-radius:50%
    <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.12
  <div> position:absolute  left:32px  right:32px  top:148px  color:#1D1C1A  font-size:26px  font-weight:500  letter-spacing:-0.2px  text-align:center
    · You don’t have to fix the next year tonight.
  <div> position:absolute  left:44px  right:44px  top:237px  z-index:6  color:#55534E  font-size:14.5px  font-weight:400  line-height:22px  text-align:center  text-wrap:pretty
    · You only have to make the next decision different. Then again tomorrow. That is how the line changes.
  <div> position:absolute  inset:0  background:linear-gradient(180deg, rgba(6,6,6,0) 38%, rgba(6,6,6,0.45) 50%, rgba(6,6,6,0.85) 58%, #060606 66%)  z-index:4
  <div> position:absolute  left:24px  right:24px  top:744px  height:58px  display:flex  align-items:center  justify-content:center  background:#FFFFFF  border-radius:29px  z-index:6  cursor:pointer
    <span> color:#131313  font-size:17px  font-weight:600  letter-spacing:0.2px
      · Start changing it
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
| “You don’t have to fix the next year tonight.” | box · paint · type | 32, 148 · 329 × 61 · — · 26px/500/-0.2px/normal/rgb(29, 28, 26) | identical | match |
| “You only have to make the next decision differen” | box · paint · type | 44, 237 · 305 × 66 · — · 14.5px/400/normal/22px/rgb(85, 83, 78) | identical | match |
| div at 24, 744 | box · paint · type | 24, 744 · 345 × 58 · rgb(255, 255, 255) · r 29px · — | identical | match |
| “Start changing it” | box · paint · type | 128.8, 763 · 135.5 × 20 · — · 17px/600/0.2px/normal/rgb(19, 19, 19) | identical | match |

**6 elements compared; 4 match, 2 differ.**

## Resolutions

The veil is the frame's own four-stop gradient — transparent to `#060606` between 38% and 66% of
the frame — laid over the field and under nothing, which is where the canvas's `z-index: 4` puts
it relative to the copy above it (both sit in the transparent half). The two remaining rows are
the background washes, `DECISIONS.md` D015.
