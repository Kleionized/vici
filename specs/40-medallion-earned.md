# Medallion Received

* **Design frame** `Email-Login/Medallion Received`
* **App file** see the Comparison table below

## Transcription — `Medallion Received`

Source `UI Final 1/project/Email Login.dc.html`, frame `Medallion-Received.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:linear-gradient(180deg, #F6EEDD 0%, #F0E1C2 100%)  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  overflow:hidden  pointer-events:none
    <div> position:absolute  left:50%  top:70px  width:340px  height:340px  margin-left:-170px  background:radial-gradient(closest-side, rgba(226,186,120,0.38), rgba(226,186,120,0) 74%)  border-radius:50%
    <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.07
  <svg> viewBox="0 0 18 18"  width="18"  height="18"  position:absolute  right:20px  top:66px
    <path> d="M3 3l12 12M15 3L3 15"  stroke="#55534E"  stroke-width="2.2"  stroke-linecap="round"
  <div> position:absolute  left:0  right:0  top:100px  color:rgba(91,74,40,0.55)  font-size:11px  font-weight:600  letter-spacing:1.6px  text-align:center
    · MEDALLION EARNED
  <div> position:absolute  left:50%  top:140px  width:260px  height:260px  margin-left:-130px
    <div> position:absolute  left:30px  top:20px  width:200px  height:200px  background:radial-gradient(closest-side, rgba(226,186,120,0.55), rgba(226,186,120,0) 74%)  border-radius:50%  filter:blur(6px)
    <div> position:absolute  left:52px  top:230px  width:156px  height:16px  background:rgba(0,0,0,0.11)  border-radius:50%  filter:blur(6px)
    <div> position:absolute  left:62px  top:52px  width:136px  height:136px  display:flex  flex-direction:column  align-items:center  justify-content:center  gap:7px  background:radial-gradient(circle at 38% 30%, #F0DBB4, #E2BA78 62%, #C99F5F 100%)  border-radius:50%  box-shadow:inset 0 0 0 4px rgba(255,255,255,0.25), inset 0 -8px 18px rgba(120,88,40,0.28), 0 14px 30px rgba(180,140,70,0.45)  transform:rotate(-3deg)
      <div> position:absolute  inset:9px  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(91,74,40,0.35)
      <svg> viewBox="0 0 40 26"  width:42px  opacity:0.55
        <path> d="M21 3 L21 16 L12 16 Z"  fill="#5b4a28"
        <path> d="M7 18 L33 18 Q30 24 20 24 Q10 24 7 18 Z"  fill="#5b4a28"
      <div> opacity:0.6  color:#5b4a28  font-family:Georgia,'Times New Roman',serif  font-size:17px  font-weight:600  letter-spacing:3px  margin-right:-3px
        · V
  <div> position:absolute  left:36px  right:36px  top:432px  color:#1D1C1A  font-size:27px  font-weight:600  letter-spacing:-0.2px  text-align:center
    · Veni
  <div> position:absolute  left:0  right:0  top:476px  display:flex  justify-content:center
    <div> height:30px  padding:0 14px  display:flex  align-items:center  background:#FFFFFF  border-radius:15px  box-shadow:0 0 0 1px rgba(0,0,0,0.1)
      <span> color:#55534E  font-size:12.5px  font-weight:600
        · Tier I
  <div> position:absolute  left:44px  right:44px  top:530px  color:#55534E  font-size:15.5px  font-weight:400  line-height:23px  text-align:center  text-wrap:pretty
    · You started.
  <div> position:absolute  left:24px  right:24px  top:688px  height:56px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:28px  cursor:pointer
    <span> color:#FFFFFF  font-size:17px  font-weight:600  letter-spacing:0.2px
      · Take it
  <div> position:absolute  left:0  right:0  top:764px  color:#8B8882  font-size:15px  font-weight:500  text-align:center
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at 26.5, 70 | radius | 50% | - | **mismatch** |
| svg at 355, 66 | box · paint · type | 355, 66 · 18 × 18 · — · — | identical | match |
| path at 358, 69 | box · paint · type | 358, 69 · 12 × 12 · — · — | identical | match |
| “MEDALLION EARNED” | box · paint · type | 0, 100 · 393 × 13 · — · 11px/600/1.6px/normal/rgba(91, 74, 40, 0.55) | identical | match |
| div at 66.5, 140 | box · paint · type | 66.5, 140 · 260 × 260 · — · — | identical | match |
| div at 96.5, 160 | radius | 50% | - | **mismatch** |
| div at 118.5, 370 | background | rgba(0, 0, 0, 0.11) | - | **mismatch** |
| div at 118.5, 370 | radius | 50% | - | **mismatch** |
| div at 125, 188.5 | radius | 50% | 68px | **mismatch** |
| div at 134.5, 198 | radius | 50% | 59px | **mismatch** |
| svg at 174.1, 232.3 | height | 29.5 | 29.2 | **mismatch** |
| path at 186.9, 236.5 | box · paint · type | 186.9, 236.5 · 10.2 × 14.1 · — · — | identical | match |
| path at 182.5, 251.5 | width | 27.6 | 27.3 | **mismatch** |
| “V” | box · paint · type | 190.4, 267.1 · 16.9 × 19.8 · α 0.6 · 17px/600/3px/normal/rgb(91, 74, 40) | identical | match |
| “Veni” | box · paint · type | 36, 432 · 321 × 31.5 · — · 27px/600/-0.2px/normal/rgb(29, 28, 26) | identical | match |
| div at 0, 476 | box · paint · type | 0, 476 · 393 × 30 · — · — | identical | match |
| div at 167, 476 | box · paint · type | 167, 476 · 58.9 × 30 · rgb(255, 255, 255) · r 15px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| “Tier I” | box · paint · type | 181, 483.8 · 30.9 × 14.5 · — · 12.5px/600/normal/normal/rgb(85, 83, 78) | identical | match |
| “You started.” | box · paint · type | 44, 530 · 305 × 23 · — · 15.5px/400/normal/23px/rgb(85, 83, 78) | identical | match |
| div at 24, 688 | box · paint · type | 24, 688 · 345 × 56 · rgb(19, 19, 19) · r 28px · — | identical | match |
| “Take it” | box · paint · type | 170, 706 · 53 × 20 · — · 17px/600/0.2px/normal/rgb(255, 255, 255) | identical | match |
| div at 0, 764 | box · paint | 0, 764 · 393 × 0 · — | *absent* | **mismatch** |

**21 elements compared; 13 match, 8 differ.**
