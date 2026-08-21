# Results Pattern

* **Design frame** `Email-Login/Results Pattern`
* **App file** src/components/onboarding/tail.tsx + src/content/onboardingTail.ts

## Transcription — `Results Pattern`

Source `UI Final 1/project/Email Login.dc.html`, frame `Results-Pattern.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:linear-gradient(180deg, #FAF9F8 0%, #FDFDFC 100%)  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  overflow:hidden  pointer-events:none
    <div> position:absolute  left:-40px  top:-140px  width:540px  height:270px  background:radial-gradient(closest-side, rgba(180,170,150,0.14), rgba(19,19,19,0) 72%)  border-radius:50%  filter:blur(6px)
    <div> position:absolute  left:50%  bottom:-300px  width:560px  height:560px  margin-left:-280px  background:radial-gradient(closest-side, rgba(255,236,196,0.42), rgba(255,236,196,0.19) 45%, rgba(255,236,196,0) 72%)  border-radius:50%
    <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.12
  <div> position:absolute  left:26px  right:26px  top:158px  color:#1D1C1A  font-size:22px  font-weight:500  letter-spacing:0.1px  line-height:1.32  text-align:center  text-wrap:pretty
    · The window to protect first.
  <div> position:absolute  left:24px  right:24px  top:268px  height:250px  background:#FFFFFF  border-radius:16px  box-shadow:0 0 0 1px rgba(0,0,0,0.09)
    <div> position:absolute  left:20px  top:18px  color:#8B8882  font-size:12.5px  font-weight:600
      · Urges by night
    <div> position:absolute  left:20px  right:20px  bottom:44px  height:130px  display:flex  align-items:flex-end  gap:14px
      <div> height:42px  flex:1  background:#DCDBD6  border-radius:6px 6px 2px 2px
      <div> height:58px  flex:1  background:#DCDBD6  border-radius:6px 6px 2px 2px
      <div> height:50px  flex:1  background:#DCDBD6  border-radius:6px 6px 2px 2px
      <div> height:72px  flex:1  background:#DCDBD6  border-radius:6px 6px 2px 2px
      <div> height:96px  flex:1  background:#131313  border-radius:6px 6px 2px 2px
      <div> height:120px  flex:1  background:#131313  border-radius:6px 6px 2px 2px
      <div> height:84px  flex:1  background:#DCDBD6  border-radius:6px 6px 2px 2px
    <div> position:absolute  left:20px  right:20px  bottom:16px  display:flex  gap:14px
      <div> flex:1  color:#8B8882  font-size:11.5px  font-weight:500  text-align:center
        · Mo
      <div> flex:1  color:#8B8882  font-size:11.5px  font-weight:500  text-align:center
        · Tu
      <div> flex:1  color:#8B8882  font-size:11.5px  font-weight:500  text-align:center
        · We
      <div> flex:1  color:#8B8882  font-size:11.5px  font-weight:500  text-align:center
        · Th
      <div> flex:1  color:#8B8882  font-size:11.5px  font-weight:500  text-align:center
        · Fr
      <div> flex:1  color:#8B8882  font-size:11.5px  font-weight:500  text-align:center
        · Sa
      <div> flex:1  color:#8B8882  font-size:11.5px  font-weight:500  text-align:center
        · Su
  <div> position:absolute  left:24px  right:24px  top:540px  height:76px  padding:0 20px  display:flex  align-items:center  gap:16px  background:#FFFFFF  border-radius:16px  box-shadow:0 0 0 1px rgba(0,0,0,0.09)
    <div> width:44px  height:44px  display:flex  flex-shrink:0  align-items:center  justify-content:center  background:#F1EFE9  border-radius:50%
      <svg> viewBox="0 0 24 24"  width="20"  height="20"
        <path> d="M14.5 2.5a9.5 9.5 0 1 0 7 14 9 9 0 0 1-7-14z"  fill="#131313"
    <div> 
      <div> color:#8B8882  font-size:12.5px  font-weight:600
        · Most active trigger
      <div> color:#1D1C1A  font-size:17.5px  font-weight:600  margin-top:4px
        · Late night · Weekends · Phone in bed
  <div> position:absolute  left:26px  right:26px  top:648px  color:#55534E  font-size:15px  font-weight:400  line-height:22px
    · Protect this window first, and a lot of the rest gets easier.
  <div> position:absolute  left:24px  right:24px  top:764px  height:58px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:29px  cursor:pointer
    <span> color:#FFFFFF  font-size:17px  font-weight:600  letter-spacing:0.3px
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
| div at -83.5, 592 | radius | 50% | - | **mismatch** |
| “The window to protect first.” | box · paint · type | 26, 158 · 341 × 29 · — · 22px/500/0.1px/29.04px/rgb(29, 28, 26) | identical | match |
| div at 24, 268 | box · paint · type | 24, 268 · 345 × 250 · rgb(255, 255, 255) · r 16px · rgba(0, 0, 0, 0.09) 0px 0px 0px 1px · — | identical | match |
| “Urges by night” | box · paint · type | 44, 286 · 89.4 × 14.5 · — · 12.5px/600/normal/normal/rgb(139, 136, 130) | identical | match |
| div at 44, 344 | box · paint · type | 44, 344 · 305 × 130 · — · — | identical | match |
| div at 44, 432 | box · paint · type | 44, 432 · 31.6 × 42 · rgb(220, 219, 214) · r 6px 6px 2px 2px · — | identical | match |
| div at 89.6, 416 | box · paint · type | 89.6, 416 · 31.6 × 58 · rgb(220, 219, 214) · r 6px 6px 2px 2px · — | identical | match |
| div at 135.1, 424 | box · paint · type | 135.1, 424 · 31.6 × 50 · rgb(220, 219, 214) · r 6px 6px 2px 2px · — | identical | match |
| div at 180.7, 402 | box · paint · type | 180.7, 402 · 31.6 × 72 · rgb(220, 219, 214) · r 6px 6px 2px 2px · — | identical | match |
| div at 226.3, 378 | box · paint · type | 226.3, 378 · 31.6 × 96 · rgb(19, 19, 19) · r 6px 6px 2px 2px · — | identical | match |
| div at 271.9, 354 | box · paint · type | 271.9, 354 · 31.6 × 120 · rgb(19, 19, 19) · r 6px 6px 2px 2px · — | identical | match |
| div at 317.4, 390 | box · paint · type | 317.4, 390 · 31.6 × 84 · rgb(220, 219, 214) · r 6px 6px 2px 2px · — | identical | match |
| div at 44, 488.5 | box · paint · type | 44, 488.5 · 305 × 13.5 · — · — | identical | match |
| “Mo” | box · paint · type | 44, 488.5 · 31.6 × 13.5 · — · 11.5px/500/normal/normal/rgb(139, 136, 130) | identical | match |
| “Tu” | box · paint · type | 89.6, 488.5 · 31.6 × 13.5 · — · 11.5px/500/normal/normal/rgb(139, 136, 130) | identical | match |
| “We” | box · paint · type | 135.1, 488.5 · 31.6 × 13.5 · — · 11.5px/500/normal/normal/rgb(139, 136, 130) | identical | match |
| “Th” | box · paint · type | 180.7, 488.5 · 31.6 × 13.5 · — · 11.5px/500/normal/normal/rgb(139, 136, 130) | identical | match |
| “Fr” | box · paint · type | 226.3, 488.5 · 31.6 × 13.5 · — · 11.5px/500/normal/normal/rgb(139, 136, 130) | identical | match |
| “Sa” | box · paint · type | 271.9, 488.5 · 31.6 × 13.5 · — · 11.5px/500/normal/normal/rgb(139, 136, 130) | identical | match |
| “Su” | box · paint · type | 317.4, 488.5 · 31.6 × 13.5 · — · 11.5px/500/normal/normal/rgb(139, 136, 130) | identical | match |
| div at 24, 540 | box · paint · type | 24, 540 · 345 × 76 · rgb(255, 255, 255) · r 16px · rgba(0, 0, 0, 0.09) 0px 0px 0px 1px · — | identical | match |
| div at 44, 556 | radius | 50% | 22px | **mismatch** |
| svg at 56, 568 | box · paint · type | 56, 568 · 20 × 20 · — · — | identical | match |
| path at 59.1, 570 | box · paint · type | 59.1, 570 · 14.8 × 15.8 · — · — | identical | match |
| div at 104, 548.3 | box · paint · type | 104, 548.3 · 245 × 59.5 · — · — | identical | match |
| “Most active trigger” | box · paint · type | 104, 548.3 · 245 × 14.5 · — · 12.5px/600/normal/normal/rgb(139, 136, 130) | identical | match |
| “Late night · Weekends · Phone in bed” | box · paint | 104, 566.8 · 245 × 41 · — | *absent* | **mismatch** |
| “Protect this window first, and a lot of the rest” | box · paint · type | 26, 648 · 341 × 44 · — · 15px/400/normal/22px/rgb(85, 83, 78) | identical | match |
| div at 24, 764 | box · paint · type | 24, 764 · 345 × 58 · rgb(19, 19, 19) · r 29px · — | identical | match |
| “Continue” | box · paint · type | 159.3, 783 · 74.5 × 20 · — · 17px/600/0.3px/normal/rgb(255, 255, 255) | identical | match |

**31 elements compared; 27 match, 4 differ.**

## Resolutions

The "Most active trigger" line is personalised — the canvas's sample lists
"Late night · Weekends · Phone in bed", the app lists what was picked — so it reads as one row
missing and one extra. The seven bars, their heights, which two are inked and the day labels are
read off the frame into `WINDOW_BARS`. The rest is `DECISIONS.md` D015.
