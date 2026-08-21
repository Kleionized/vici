# Free Trial Paywall

* **Design frame** `Email-Login/Free Trial Paywall`
* **App file** see the Comparison table below

## Transcription — `Free Trial Paywall`

Source `UI Final 1/project/Email Login.dc.html`, frame `Free-Trial-Paywall.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  left:0  right:0  top:0  height:296px  overflow:hidden
    <div> position:absolute  inset:0  background:linear-gradient(180deg, #F0EFE9 0%, #F0EBDF 100%)  overflow:hidden
      <div> position:absolute  left:52%  top:-4%  width:44%  height:44%  background:radial-gradient(closest-side, rgba(243,227,196,0.95), rgba(243,227,196,0) 78%)  border-radius:50%
      <div> position:absolute  left:8%  top:12%  width:16%  height:5%  background:#FFFFFF  border-radius:999px  opacity:0.7
      <div> position:absolute  left:74%  top:20%  width:12%  height:4%  background:#FFFFFF  border-radius:999px  opacity:0.55
      <svg> viewBox="0 0 40 26"  position:absolute  left:58%  top:30%  width:11%
        <circle> cx="20"  cy="13"  r="9"  fill="#E9D2A4"
      <div> position:absolute  left:-20%  right:-20%  top:48%  height:80%  background:#DEDDD6  border-radius:50% 50% 0 0 / 60% 60% 0 0
      <div> position:absolute  left:-42%  right:-10%  top:62%  height:80%  background:#C8D7E5  border-radius:50% 50% 0 0 / 52% 52% 0 0
      <div> position:absolute  left:-10%  right:-42%  top:78%  height:80%  background:#C0BFB8  border-radius:50% 50% 0 0 / 46% 46% 0 0
    <div> position:absolute  left:0  right:0  bottom:0  height:240px  background:linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 62%, #F4F3F0 100%)
  <div> position:absolute  left:0  right:0  top:288px  height:38px  background:#F4F3F0  z-index:2
  <div> position:absolute  left:20px  top:66px  width:34px  height:34px  display:flex  align-items:center  justify-content:center  background:rgba(19,19,19,0.06)  border-radius:50%  box-shadow:0 0 0 1px rgba(0,0,0,0.18)  z-index:5
    <svg> viewBox="0 0 20 20"  width="15"  height="15"
      <path> d="M3 3l14 14M17 3L3 17"  stroke="#1D1C1A"  stroke-width="2.4"  stroke-linecap="round"
  <div> position:absolute  right:20px  top:74px  z-index:5  color:#55534E  font-size:14px  font-weight:500
    · Restore
  <div> position:absolute  left:20px  top:228px  display:flex  align-items:center  gap:9px  z-index:5
    <span> color:#1D1C1A  font-family:Georgia,'Times New Roman',serif  font-size:15px  font-weight:500  letter-spacing:4px
      · VICI
    <span> padding:3px 8px  background:#131313  border-radius:7px  color:#F4F3F0  font-size:10.5px  font-weight:600  letter-spacing:1px
      · PLUS
  <div> position:absolute  left:20px  right:80px  top:260px  z-index:5  color:#1D1C1A  font-size:28px  font-weight:500  letter-spacing:-0.2px  line-height:36px
    · Give it twelve weeks
  <div> position:absolute  left:16px  right:16px  top:330px  height:76px  padding:0 18px  box-sizing:border-box  display:flex  align-items:center  gap:14px  background:#131313  border-radius:18px  z-index:4
    <div> width:23px  height:23px  display:flex  flex-shrink:0  align-items:center  justify-content:center  background:#F4F3F0  border-radius:50%
      <svg> viewBox="0 0 24 24"  width="12"  height="12"
        <path> d="M4 12l5 5L20 6"  fill="none"  stroke="#131313"  stroke-width="3.2"  stroke-linecap="round"  stroke-linejoin="round"
    <div> flex:1
      <div> display:flex  align-items:center  gap:8px
        <span> color:#F5F4F1  font-size:15px  font-weight:500
          · Yearly
        <span> padding:3px 8px  flex-shrink:0  border:1px solid rgba(245,244,241,0.4)  border-radius:9px  color:#F5F4F1  font-size:12.5px  font-weight:500  white-space:nowrap
          · Best value
      <div> color:rgba(245,244,241,0.62)  font-size:13px  margin-top:3px
        · $3.33 a month
    <div> text-align:right
      <div> color:#F5F4F1  font-size:16px  font-weight:500
        · $39.99
      <div> color:rgba(245,244,241,0.45)  font-size:12px
        · /year
  <div> position:absolute  left:16px  right:16px  top:418px  height:76px  padding:0 18px  box-sizing:border-box  display:flex  align-items:center  gap:14px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.08)  z-index:4
    <div> width:23px  height:23px  box-sizing:border-box  flex-shrink:0  border:2px solid rgba(0,0,0,0.18)  border-radius:50%
    <div> flex:1
      <span> color:#1D1C1A  font-size:15px  font-weight:500
        · Monthly
      <div> color:#8B8882  font-size:13px  margin-top:3px
        · Cancel anytime
    <div> text-align:right
      <div> color:#1D1C1A  font-size:16px  font-weight:500
        · $12.99
      <div> color:#8B8882  font-size:12px
        · /month
  <div> position:absolute  left:18px  top:530px  color:#8B8882  font-size:12.5px  font-weight:600
    · Everything, unlocked
  <div> position:absolute  left:18px  top:560px  width:165px  display:flex  align-items:flex-start  gap:9px
    <svg> viewBox="0 0 24 24"  width="13"  height="13"  flex-shrink:0  margin-top:2.5px
      <path> d="M4 12.5l4.8 4.8L20 6.5"  fill="none"  stroke="#1D1C1A"  stroke-width="3"  stroke-linecap="round"  stroke-linejoin="round"
    <span> color:#55534E  font-size:13.5px  line-height:18px
      · The full twelve-week programme
  <div> position:absolute  left:208px  top:560px  width:165px  display:flex  align-items:flex-start  gap:9px
    <svg> viewBox="0 0 24 24"  width="13"  height="13"  flex-shrink:0  margin-top:2.5px
      <path> d="M4 12.5l4.8 4.8L20 6.5"  fill="none"  stroke="#1D1C1A"  stroke-width="3"  stroke-linecap="round"  stroke-linejoin="round"
    <span> color:#55534E  font-size:13.5px  line-height:18px
      · SOS whenever an urge hits
  <div> position:absolute  left:18px  top:610px  width:165px  display:flex  align-items:flex-start  gap:9px
    <svg> viewBox="0 0 24 24"  width="13"  height="13"  flex-shrink:0  margin-top:2.5px
      <path> d="M4 12.5l4.8 4.8L20 6.5"  fill="none"  stroke="#1D1C1A"  stroke-width="3"  stroke-linecap="round"  stroke-linejoin="round"
    <span> color:#55534E  font-size:13.5px  line-height:18px
      · Weekly reports from what you log
  <div> position:absolute  left:208px  top:610px  width:165px  display:flex  align-items:flex-start  gap:9px
    <svg> viewBox="0 0 24 24"  width="13"  height="13"  flex-shrink:0  margin-top:2.5px
      <path> d="M4 12.5l4.8 4.8L20 6.5"  fill="none"  stroke="#1D1C1A"  stroke-width="3"  stroke-linecap="round"  stroke-linejoin="round"
    <span> color:#55534E  font-size:13.5px  line-height:18px
      · Progress and medallions in one place
  <div> position:absolute  left:16px  right:16px  top:684px  height:52px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:26px  cursor:pointer
    <span> color:#FFFFFF  font-size:16.5px  font-weight:600
      · Start my free trial
  <div> position:absolute  left:0  right:0  top:756px  color:#8B8882  font-size:13px  text-align:center
    · Terms &nbsp;·&nbsp; Restore
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at 0, 0 | box · paint · type | 0, 0 · 393 × 296 · — · — | identical | match |
| div at 0, 0 | box · paint · type | 0, 0 · 393 × 296 · — · — | identical | match |
| div at 204.4, -11.8 | radius | 50% | - | **mismatch** |
| div at 31.4, 35.5 | background | rgb(255, 255, 255) | - | **mismatch** |
| div at 31.4, 35.5 | radius | 999px | - | **mismatch** |
| div at 290.8, 59.2 | background | rgb(255, 255, 255) | - | **mismatch** |
| div at 290.8, 59.2 | radius | 999px | - | **mismatch** |
| svg at 227.9, 88.8 | box · paint | 227.9, 88.8 · 43.2 × 28.1 · — | *absent* | **mismatch** |
| circle at 239.8, 93.1 | box · paint · type | 239.8, 93.1 · 19.4 × 19.4 · — · — | identical | match |
| div at -78.6, 142.1 | background | rgb(222, 221, 214) | - | **mismatch** |
| div at -78.6, 142.1 | radius | 50% 50% 0px 0px / 60% 60% 0px 0px | - | **mismatch** |
| div at -165.1, 183.5 | background | rgb(200, 215, 229) | - | **mismatch** |
| div at -165.1, 183.5 | radius | 50% 50% 0px 0px / 52% 52% 0px 0px | - | **mismatch** |
| div at -39.3, 230.9 | background | rgb(192, 191, 184) | - | **mismatch** |
| div at -39.3, 230.9 | radius | 50% 50% 0px 0px / 46% 46% 0px 0px | - | **mismatch** |
| div at 0, 56 | box · paint · type | 0, 56 · 393 × 240 · — · — | identical | match |
| div at 0, 288 | box · paint · type | 0, 288 · 393 × 38 · rgb(244, 243, 240) · — | identical | match |
| div at 20, 66 | background | rgba(19, 19, 19, 0.06) | - | **mismatch** |
| div at 20, 66 | radius | 50% | - | **mismatch** |
| div at 20, 66 | shadow | rgba(0, 0, 0, 0.18) 0px 0px 0px 1px | - | **mismatch** |
| svg at 29.5, 75.5 | box · paint · type | 29.5, 75.5 · 15 × 15 · — · — | identical | match |
| path at 31.8, 77.8 | box · paint · type | 31.8, 77.8 · 10.5 × 10.5 · — · — | identical | match |
| “Restore” | box · paint · type | 322.2, 74 · 50.8 × 16.5 · — · 14px/500/normal/normal/rgb(85, 83, 78) | identical | match |
| div at 20, 228 | box · paint · type | 20, 228 · 104.5 × 18 · — · — | identical | match |
| “VICI” | box · paint · type | 20, 228.3 · 47.3 × 17.5 · — · 15px/500/4px/normal/rgb(29, 28, 26) | identical | match |
| “PLUS” | x | 76.3 | 84.3 | **mismatch** |
| “PLUS” | y | 228 | 231 | **mismatch** |
| “PLUS” | width | 48.1 | 32.1 | **mismatch** |
| “PLUS” | height | 18 | 12 | **mismatch** |
| “PLUS” | background | rgb(19, 19, 19) | - | **mismatch** |
| “PLUS” | radius | 7px | - | **mismatch** |
| “Give it twelve weeks” | box · paint · type | 20, 260 · 293 × 36 · — · 28px/500/-0.2px/36px/rgb(29, 28, 26) | identical | match |
| div at 16, 330 | box · paint · type | 16, 330 · 361 × 76 · rgb(19, 19, 19) · r 18px · — | identical | match |
| div at 34, 356.5 | radius | 50% | 11.5px | **mismatch** |
| svg at 39.5, 362 | box · paint · type | 39.5, 362 · 12 × 12 · — · — | identical | match |
| path at 41.5, 365 | box · paint · type | 41.5, 365 · 8 × 5.5 · — · — | identical | match |
| div at 71, 347.8 | box · paint · type | 71, 347.8 · 220.3 × 40.5 · — · — | identical | match |
| div at 71, 347.8 | box · paint · type | 71, 347.8 · 220.3 × 22.5 · — · — | identical | match |
| “Yearly” | box · paint · type | 71, 350.3 · 43 × 17.5 · — · 15px/500/normal/normal/rgb(245, 244, 241) | identical | match |
| “Best value” | x | 122 | 131 | **mismatch** |
| “Best value” | y | 347.8 | 351.8 | **mismatch** |
| “Best value” | width | 80 | 62 | **mismatch** |
| “Best value” | height | 22.5 | 14.5 | **mismatch** |
| “Best value” | radius | 9px | - | **mismatch** |
| “$3.33 a month” | box · paint · type | 71, 373.3 · 220.3 × 15 · — · 13px/400/normal/normal/rgba(245, 244, 241, 0.62) | identical | match |
| div at 305.3, 351.5 | box · paint · type | 305.3, 351.5 · 53.7 × 33 · — · — | identical | match |
| “$39.99” | box · paint · type | 305.3, 351.5 · 53.7 × 19 · — · 16px/500/normal/normal/rgb(245, 244, 241) | identical | match |
| “/year” | x | 305.3 | 331 | **mismatch** |
| “/year” | width | 53.7 | 28 | **mismatch** |
| div at 16, 418 | box · paint · type | 16, 418 · 361 × 76 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.08) 0px 0px 0px 1px · — | identical | match |
| div at 34, 444.5 | radius | 50% | 11.5px | **mismatch** |
| div at 71, 437.5 | box · paint · type | 71, 437.5 · 223 × 37 · — · — | identical | match |
| “Monthly” | box · paint · type | 71, 438.5 · 56.8 × 17.5 · — · 15px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| “Cancel anytime” | box · paint · type | 71, 459.5 · 223 × 15 · — · 13px/400/normal/normal/rgb(139, 136, 130) | identical | match |
| div at 308, 439.5 | box · paint · type | 308, 439.5 · 51 × 33 · — · — | identical | match |
| “$12.99” | box · paint · type | 308, 439.5 · 51 × 19 · — · 16px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| “/month” | x | 308 | 319.4 | **mismatch** |
| “/month” | width | 51 | 39.6 | **mismatch** |
| “Everything, unlocked” | box · paint · type | 18, 530 · 128.8 × 14.5 · — · 12.5px/600/normal/normal/rgb(139, 136, 130) | identical | match |
| div at 18, 560 | box · paint · type | 18, 560 · 165 × 36 · — · — | identical | match |
| svg at 18, 562.5 | box · paint · type | 18, 562.5 · 13 × 13 · — · — | identical | match |
| path at 20.2, 566 | box · paint · type | 20.2, 566 · 8.7 × 5.9 · — · — | identical | match |
| “The full twelve-week programme” | box · paint · type | 40, 560 · 143 × 36 · — · 13.5px/400/normal/18px/rgb(85, 83, 78) | identical | match |
| div at 208, 560 | box · paint · type | 208, 560 · 165 × 36 · — · — | identical | match |
| svg at 208, 562.5 | box · paint · type | 208, 562.5 · 13 × 13 · — · — | identical | match |
| path at 210.2, 566 | box · paint · type | 210.2, 566 · 8.7 × 5.9 · — · — | identical | match |
| “SOS whenever an urge hits” | box · paint · type | 230, 560 · 143 × 36 · — · 13.5px/400/normal/18px/rgb(85, 83, 78) | identical | match |
| div at 18, 610 | box · paint · type | 18, 610 · 165 × 36 · — · — | identical | match |
| svg at 18, 612.5 | box · paint · type | 18, 612.5 · 13 × 13 · — · — | identical | match |
| path at 20.2, 616 | box · paint · type | 20.2, 616 · 8.7 × 5.9 · — · — | identical | match |
| “Weekly reports from what you log” | box · paint · type | 40, 610 · 143 × 36 · — · 13.5px/400/normal/18px/rgb(85, 83, 78) | identical | match |
| div at 208, 610 | box · paint · type | 208, 610 · 165 × 54 · — · — | identical | match |
| svg at 208, 612.5 | box · paint · type | 208, 612.5 · 13 × 13 · — · — | identical | match |
| path at 210.2, 616 | box · paint · type | 210.2, 616 · 8.7 × 5.9 · — · — | identical | match |
| “Progress and medallions in one place” | box · paint · type | 230, 610 · 143 × 54 · — · 13.5px/400/normal/18px/rgb(85, 83, 78) | identical | match |
| div at 16, 684 | background | rgb(19, 19, 19) | - | **mismatch** |
| div at 16, 684 | radius | 26px | - | **mismatch** |
| “Start my free trial” | box · paint · type | 128.6, 700.3 · 135.8 × 19.5 · — · 16.5px/600/normal/normal/rgb(255, 255, 255) | identical | match |
| “Terms · Restore” | box · paint · type | 0, 756 · 393 × 15 · — · 13px/400/normal/normal/rgb(139, 136, 130) | identical | match |

**60 elements compared; 45 match, 15 differ.**
