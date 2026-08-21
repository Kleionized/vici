# Cost By Age 80

* **Design frame** `Email-Login/Cost By Age 80`
* **App file** src/components/onboarding/tail.tsx + src/content/onboardingTail.ts

## Transcription — `Cost By Age 80`

Source `UI Final 1/project/Email Login.dc.html`, frame `Cost-By-Age-80.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#060606  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  background-image:radial-gradient(circle 1.3px at 61px 132px, #FFFFFF 99%, rgba(255,255,255,0) 100%), radial-gradient(circle 1.3px at 287px 96px, #FFFFFF 99%, rgba(255,255,255,0) 100%), radial-gradient(circle 1.3px at 174px 214px, #FFFFFF 99%, rgba(255,255,255,0) 100%), radial-gradient(circle 1.3px at 329px 291px, #FFFFFF 99%, rgba(255,255,255,0) 100%), radial-gradient(circle 1.3px at 96px 348px, #FFFFFF 99%, rgba(255,255,255,0) 100%), radial-gradient(circle 1.3px at 244px 407px, #FFFFFF 99%, rgba(255,255,255,0) 100%), radial-gradient(circle 1.3px at 52px 489px, #FFFFFF 99%, rgba(255,255,255,0) 100%), radial-gradient(circle 1.3px at 331px 542px, #FFFFFF 99%, rgba(255,255,255,0) 100%), radial-gradient(circle 1.3px at 158px 596px, #FFFFFF 99%, rgba(255,255,255,0) 100%), radial-gradient(circle 1.3px at 262px 671px, #FFFFFF 99%, rgba(255,255,255,0) 100%), radial-gradient(circle 1.3px at 84px 703px, #FFFFFF 99%, rgba(255,255,255,0) 100%)  z-index:5  background-repeat:no-repeat
  <div> position:absolute  left:50%  bottom:120px  padding:13px 24px 14px  background:rgba(19,19,19,0.82)  backdrop-filter:blur(12px)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.16), 0 18px 44px rgba(0,0,0,0.5)  transform:translateX(-50%)  z-index:12  white-space:nowrap  -webkit-backdrop-filter:blur(12px)
    <span> color:#FFFFFF  font-size:15px  font-weight:500
      · By age 80 — about 6,100 days
  <div> position:absolute  left:24px  right:24px  top:744px  height:58px  display:flex  align-items:center  justify-content:center  background:#FFFFFF  border-radius:29px  z-index:15  cursor:pointer
    <span> color:#131313  font-size:17px  font-weight:600  letter-spacing:0.2px
      · Next
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at 66.9, 686 | background | rgba(19, 19, 19, 0.82) | - | **mismatch** |
| “By age 80 — about 6,100 days” | box · paint · type | 90.9, 700 · 211.3 × 17.5 · — · 15px/500/normal/normal/rgb(255, 255, 255) | identical | match |
| div at 24, 744 | box · paint · type | 24, 744 · 345 × 58 · rgb(255, 255, 255) · r 29px · — | identical | match |
| “Next” | box · paint · type | 177.5, 763 · 38 × 20 · — · 17px/600/0.2px/normal/rgb(19, 19, 19) | identical | match |

**4 elements compared; 3 match, 1 differ.**

## Resolutions

Eleven 1.3pt stars at the frame's own points on `#060606`, and the pill 120 off the bottom edge.
The one row that differs is the pill's fill reading on the inner box rather than the clip that
carries its ring and shadow — the same composite, one level down (`DECISIONS.md` D018).

The day count is the app's arithmetic on the canvas's own numbers: 365 × 9/30 × (80 − age),
rounded to the nearest hundred, which reproduces the frame's "about 6,100 days" for its
twenty-four-year-old exactly.
