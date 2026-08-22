# Today Home

* **Design frame** `Email-Login/Today Home`
* **App file** src/app/(app)/today.tsx · src/app/score.tsx · src/components/today/kit.tsx

## Transcription — `Today Home`

Source `UI Final 1/project/Email Login.dc.html`, frame `Today-Home.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.07  pointer-events:none
  <div> position:absolute  left:16px  top:64px
    <img> width="27"  height="27"  src="laurel-mark.webp"  alt=""  display:block  object-fit:contain
  <svg> viewBox="0 0 26 26"  width="26"  height="26"  position:absolute  right:16px  top:64px
    <circle> cx="13"  cy="9.5"  r="4"  fill="none"  stroke="#55534E"  stroke-width="2"
    <path> d="M4.5 22.5c1-4.5 4.2-6.8 8.5-6.8s7.5 2.3 8.5 6.8"  fill="none"  stroke="#55534E"  stroke-width="2"  stroke-linecap="round"
  <div> position:absolute  left:16px  top:114px  color:#1D1C1A  font-size:27px  font-weight:600  letter-spacing:-0.2px  line-height:1
    · Day 41
  <div> position:absolute  left:0  right:0  top:769px  bottom:0  background:rgba(255,255,255,0.95)  z-index:14
    <div> position:absolute  left:48px  top:14px  width:44px  text-align:center
      <svg> viewBox="0 0 24 26"  width="30"  height="29"  margin:0 auto  display:block
        <path> d="M4.5 24 L4.5 10 Q4.5 2 12 2 Q19.5 2 19.5 10 L19.5 24 Z"  fill="#2A2924"
        <circle> cx="15.2"  cy="14"  r="1.7"  fill="#FFFFFF"  fill-opacity="0.92"
      <div> color:#2A2924  font-size:13px  font-weight:500  margin-top:5px
        · Home
    <div> position:absolute  left:170px  top:14px  width:52px  text-align:center
      <svg> viewBox="0 0 24 26"  width="30"  height="29"  margin:0 auto  display:block
        <rect> width="15"  height="22"  x="4.5"  y="2"  rx="3"  fill="#C6C5C0"
        <path> d="M8.5 8.5h7M8.5 13h7M8.5 17.5h4.5"  stroke="#FFFFFF"  stroke-width="2.2"  stroke-opacity="0.95"  stroke-linecap="round"
      <div> color:#8B8882  font-size:13px  font-weight:500  margin-top:5px
        · Log
    <div> position:absolute  left:288px  top:14px  width:60px  text-align:center
      <svg> viewBox="0 0 24 26"  width="30"  height="29"  margin:0 auto  display:block
        <rect> width="4.4"  height="21"  x="5"  y="2.5"  rx="1.8"  fill="#C6C5C0"
        <rect> width="4.4"  height="21"  x="10.9"  y="2.5"  rx="1.8"  fill="#C6C5C0"
        <rect> width="4.4"  height="21"  x="16.8"  y="2.5"  rx="1.8"  fill="#C6C5C0"
      <div> color:#8B8882  font-size:13px  font-weight:500  margin-top:5px
        · Library
  <div> position:absolute  left:12px  right:12px  top:164px  height:222px  background:#0C0D10  border-radius:22px  box-shadow:0 0 0 1px rgba(0,0,0,0.25), 0 14px 30px rgba(30,28,24,0.28)  overflow:hidden
    <div> position:absolute  inset:0  background:linear-gradient(180deg, #08090B 0%, #0E1014 55%, #151920 100%)
    <div> position:absolute  left:116px  top:34px  width:2px  height:2px  background:rgba(244,243,240,0.45)  border-radius:50%
    <div> position:absolute  right:150px  top:56px  width:2.5px  height:2.5px  background:rgba(244,243,240,0.35)  border-radius:50%
    <div> position:absolute  left:52px  top:96px  width:2px  height:2px  background:rgba(244,243,240,0.3)  border-radius:50%
    <div> position:absolute  right:24px  top:34px  width:84px  height:84px  background:radial-gradient(closest-side, rgba(223,220,211,0.15), rgba(223,220,211,0) 72%)  border-radius:50%  filter:blur(5px)
    <div> position:absolute  right:48px  top:56px  width:30px  height:30px  background:radial-gradient(circle at 36% 30%, #F5F3EC 0%, #D9D6CD 46%, #A5A197 100%)  border-radius:50%  box-shadow:0 0 26px rgba(223,220,211,0.26)
    <svg> viewBox="0 0 369 76"  position:absolute  left:0  right:0  top:102px  width:100%  height:64px
      <defs> 
        <lineargradient> id="hsH1"  x1="0"  y1="0"  x2="0"  y2="1"
          <stop> offset="0"  stop-color="#232830"
          <stop> offset="1"  stop-color="#0A0B0D"
        <lineargradient> id="hsH2"  x1="0"  y1="0"  x2="0"  y2="1"
          <stop> offset="0"  stop-color="#2A303B"
          <stop> offset="1"  stop-color="#0C0D10"
      <path> d="M-4,76 L-4,50 Q56,22 124,48 Q160,61 188,68 L188,76 Z"  fill="url(#hsH1)"
      <path> d="M168,76 L168,66 Q226,57 270,36 Q316,17 373,25 L373,76 Z"  fill="url(#hsH2)"
    <div> position:absolute  left:0  right:0  top:154px  height:12px  background:linear-gradient(180deg, rgba(233,199,138,0) 0%, rgba(233,199,138,0.12) 100%)  filter:blur(3px)
    <div> position:absolute  left:0  right:0  top:166px  bottom:0  background:linear-gradient(180deg, #131720 0%, #0B0C0F 100%)
    <div> position:absolute  right:50px  top:168px  width:38px  height:44px  background:linear-gradient(180deg, rgba(223,220,211,0.15), rgba(223,220,211,0))  filter:blur(5px)
    <div> position:absolute  left:20px  top:22px  color:#F7F6F2  font-size:13px  font-weight:500
      · Recovery score
    <div> position:absolute  right:16px  top:16px  height:30px  padding:0 12px  display:flex  align-items:center  gap:6px  background:rgba(20,19,16,0.25)  border:1px solid rgba(244,243,240,0.28)  border-radius:15px  cursor:pointer
      <svg> viewBox="0 0 14 10"  width="14"  height="10"
        <path> d="M1 8.5L5 4.5l2.5 2L12.5 1.5"  fill="none"  stroke="#F4F3F0"  stroke-width="1.8"  stroke-linecap="round"  stroke-linejoin="round"
        <path> d="M9.2 1.5h3.3V4.8"  fill="none"  stroke="#F4F3F0"  stroke-width="1.8"  stroke-linecap="round"  stroke-linejoin="round"
      <span> color:#F4F3F0  font-size:12px  font-weight:600
        · Trend
    <div> position:absolute  left:20px  top:48px  display:flex  align-items:baseline  gap:9px
      <span> color:#F7F6F2  font-size:43px  font-weight:500  letter-spacing:1.5px
        · 1,240
      <span> display:flex  align-items:baseline  gap:3px
        <svg> viewBox="0 0 10 9"  width="9"  height="8"
          <path> d="M5 0.5L9.5 8.5H0.5z"  fill="rgba(244,243,240,0.8)"
        <span> color:rgba(244,243,240,0.8)  font-size:13px  font-weight:500
          · 18
    <div> position:absolute  left:20px  right:20px  bottom:50px  height:6px  background:rgba(244,243,240,0.14)  border-radius:3px
      <div> width:60%  height:100%  background:rgba(244,243,240,0.92)  border-radius:3px
    <div> position:absolute  left:20px  right:20px  bottom:22px  display:flex  justify-content:space-between
      <span> color:rgba(244,243,240,0.55)  font-size:11px  font-weight:500
        · Navigator · 1,150
      <span> color:rgba(244,243,240,0.55)  font-size:11px  font-weight:500
        · Helmsman · 1,300
    <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.06  pointer-events:none
  <div> position:absolute  left:12px  right:12px  top:492px  height:184px  background:#FFFFFF  border-radius:20px  box-shadow:0 0 0 1px rgba(0,0,0,0.05), 0 10px 24px rgba(40,38,32,0.07)  overflow:hidden
    <div> position:absolute  left:20px  top:20px  color:#1D1C1A  font-size:13px  font-weight:500
      · Last 30 days
    <div> position:absolute  left:20px  top:58px  width:329px  display:flex  flex-wrap:wrap  gap:9.88px
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#FFFFFF  border-radius:50%  box-shadow:inset 0 0 0 1px rgba(0,0,0,0.14)
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#FFFFFF  border-radius:50%  box-shadow:inset 0 0 0 1px rgba(0,0,0,0.14)
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#FFFFFF  border-radius:50%  box-shadow:inset 0 0 0 1px rgba(0,0,0,0.14)
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%
      <div> width:24px  height:24px  background:#131313  border-radius:50%  box-shadow:inset 0 0 0 2px #D9A441
  <div> position:absolute  left:20px  top:402px  color:#8B8882  font-size:12.5px  font-weight:600
    · This morning
  <svg> viewBox="0 0 8 14"  width="7"  height="12"  position:absolute  right:20px  top:402px
    <path> d="M1.5 1.5L6.5 7l-5 5.5"  fill="none"  stroke="#B0AEA8"  stroke-width="2"  stroke-linecap="round"
  <div> position:absolute  left:12px  right:12px  top:428px  height:48px  display:grid  gap:8px  grid-template-columns:1fr 1fr
    <div> position:relative  background:#FFFFFF  border-radius:12px  box-shadow:0 0 0 1px rgba(0,0,0,0.06)
      <div> position:absolute  left:13px  top:0  bottom:0  display:flex  align-items:center  gap:5px
        <div> width:9px  height:9px  background:#131313  border-radius:50%
        <div> width:9px  height:9px  background:#131313  border-radius:50%
        <div> width:9px  height:9px  background:#131313  border-radius:50%  box-shadow:0 0 0 1.5px #FFFFFF, 0 0 0 2.5px #131313
        <div> width:9px  height:9px  background:rgba(19,19,19,0.13)  border-radius:50%
        <div> width:9px  height:9px  background:rgba(19,19,19,0.13)  border-radius:50%
      <div> position:absolute  right:13px  top:0  bottom:0  display:flex  align-items:center  color:#1D1C1A  font-size:12px  font-weight:600
        · Fine
    <div> position:relative  background:#FFFFFF  border-radius:12px  box-shadow:0 0 0 1px rgba(0,0,0,0.06)
      <div> position:absolute  left:13px  bottom:9px  display:flex  align-items:flex-end  gap:3.5px
        <div> width:6.5px  height:9px  background:#131313  border-radius:3px
        <div> width:6.5px  height:13px  background:#131313  border-radius:3px  box-shadow:0 0 0 1.5px #FFFFFF, 0 0 0 2.5px #131313
        <div> width:6.5px  height:17px  background:rgba(19,19,19,0.13)  border-radius:3px
        <div> width:6.5px  height:21px  background:rgba(19,19,19,0.13)  border-radius:3px
        <div> width:6.5px  height:25px  background:rgba(19,19,19,0.13)  border-radius:3px
      <div> position:absolute  right:13px  top:0  bottom:0  display:flex  align-items:center  color:#1D1C1A  font-size:12px  font-weight:600
        · Low
  <div> position:absolute  left:0  right:0  top:705px  height:64px  padding:0 16px  box-sizing:border-box  display:flex  align-items:center  gap:13px  background:#131313  border-radius:18px 18px 0 0  cursor:pointer
    <div> width:40px  height:40px  display:flex  flex-shrink:0  align-items:center  justify-content:center  background:rgba(244,243,240,0.12)  border-radius:50%
      <svg> viewBox="0 0 26 16"  width="20"  height="13"
        <path> d="M2 12c4-7 8 3 12-3s8 2 10-2"  fill="none"  stroke="#F4F3F0"  stroke-width="2.4"  stroke-linecap="round"
    <div> flex:1  color:#F7F6F2  font-size:15px  font-weight:600
      · Urge surfing
    <svg> viewBox="0 0 8 14"  width="7"  height="12"  flex-shrink:0
      <path> d="M1.5 1.5L6.5 7l-5 5.5"  fill="none"  stroke="rgba(244,243,240,0.5)"  stroke-width="2"  stroke-linecap="round"
```


## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at 16, 64 | box · paint · type | 16, 64 · 27 × 27 · — · — | identical | match |
| div at 16, 64 | box · paint · type | 16, 64 · 27 × 27 · — · — | identical | match |
| svg at 351, 64 | box · paint · type | 351, 64 · 26 × 26 · — · — | identical | match |
| circle at 360, 69.5 | box · paint · type | 360, 69.5 · 8 × 8 · — · — | identical | match |
| path at 355.5, 79.7 | box · paint · type | 355.5, 79.7 · 17 × 6.8 · — · — | identical | match |
| “Day 41” | box · paint · type | 16, 114 · 83 × 27 · — · 27px/600/-0.2px/27px/rgb(29, 28, 26) | identical | match |
| div at 0, 769 | box · paint · type | 0, 769 · 393 × 83 · rgba(255, 255, 255, 0.95) · — | identical | match |
| div at 48, 783 | box · paint · type | 48, 783 · 44 × 49 · — · — | identical | match |
| svg at 55, 783 | box · paint · type | 55, 783 · 30 × 29 · — · — | identical | match |
| path at 61.6, 785.2 | box · paint · type | 61.6, 785.2 · 16.7 × 24.5 · — · — | identical | match |
| circle at 71.7, 796.7 | box · paint · type | 71.7, 796.7 · 3.8 × 3.8 · — · — | identical | match |
| “Home” | x | 48 | 51.8 | **mismatch** |
| “Home” | width | 44 | 36.5 | **mismatch** |
| div at 170, 783 | box · paint · type | 170, 783 · 52 × 49 · — · — | identical | match |
| svg at 181, 783 | box · paint · type | 181, 783 · 30 × 29 · — · — | identical | match |
| rect at 187.6, 785.2 | box · paint · type | 187.6, 785.2 · 16.7 × 24.5 · — · — | identical | match |
| path at 192.1, 792.5 | box · paint · type | 192.1, 792.5 · 7.8 × 10 · — · — | identical | match |
| “Log” | x | 170 | 184.6 | **mismatch** |
| “Log” | width | 52 | 22.8 | **mismatch** |
| div at 288, 783 | box · paint · type | 288, 783 · 60 × 49 · — · — | identical | match |
| svg at 303, 783 | box · paint · type | 303, 783 · 30 × 29 · — · — | identical | match |
| rect at 310.2, 785.8 | box · paint · type | 310.2, 785.8 · 4.9 × 23.4 · — · — | identical | match |
| rect at 316.8, 785.8 | box · paint · type | 316.8, 785.8 · 4.9 × 23.4 · — · — | identical | match |
| rect at 323.4, 785.8 | box · paint · type | 323.4, 785.8 · 4.9 × 23.4 · — · — | identical | match |
| “Library” | x | 288 | 318.6 | **mismatch** |
| “Library” | y | 817 | 750 | **mismatch** |
| “Library” | width | 60 | 42.4 | **mismatch** |
| “Library” | height | 15 | 13 | **mismatch** |
| “Library” | type | 13px/500/normal/normal/rgb(139, 136, 130) | 11px/600/0.5px/normal/rgb(139, 136, 130) | **mismatch** |
| div at 12, 164 | box · paint · type | 12, 164 · 369 × 222 · rgb(12, 13, 16) · r 22px · rgba(0, 0, 0, 0.25) 0px 0px 0px 1px, rgba(30, 28, 24, 0.28) 0px 14px 30px 0px · — | identical | match |
| div at 12, 164 | box · paint · type | 12, 164 · 369 × 222 · — · — | identical | match |
| div at 12, 164 | opacity | 0.06 | - | **mismatch** |
| div at 128, 198 | background | rgba(244, 243, 240, 0.45) | - | **mismatch** |
| div at 128, 198 | radius | 50% | - | **mismatch** |
| div at 228.5, 220 | background | rgba(244, 243, 240, 0.35) | - | **mismatch** |
| div at 228.5, 220 | radius | 50% | - | **mismatch** |
| div at 64, 260 | background | rgba(244, 243, 240, 0.3) | - | **mismatch** |
| div at 64, 260 | radius | 50% | - | **mismatch** |
| div at 273, 198 | radius | 50% | - | **mismatch** |
| div at 303, 220 | radius | 50% | - | **mismatch** |
| div at 303, 220 | shadow | rgba(223, 220, 211, 0.26) 0px 0px 26px 0px | - | **mismatch** |
| svg at 12, 266 | box · paint · type | 12, 266 · 369 × 64 · — · — | identical | match |
| path at 8, 295.9 | box · paint · type | 8, 295.9 · 192 × 34.1 · — · — | identical | match |
| path at 180, 285.1 | box · paint · type | 180, 285.1 · 205 × 44.9 · — · — | identical | match |
| div at 12, 318 | box · paint · type | 12, 318 · 369 × 12 · — · — | identical | match |
| div at 12, 330 | box · paint · type | 12, 330 · 369 × 56 · — · — | identical | match |
| div at 293, 332 | box · paint · type | 293, 332 · 38 × 44 · — · — | identical | match |
| “Recovery score” | box · paint · type | 32, 186 · 95.3 × 15 · — · 13px/500/normal/normal/rgb(247, 246, 242) | identical | match |
| div at 285, 180 | box · paint · type | 285, 180 · 80 × 32 · rgba(20, 19, 16, 0.25) · r 15px · — | identical | match |
| svg at 298, 191 | box · paint · type | 298, 191 · 14 × 10 · — · — | identical | match |
| path at 299, 192.5 | box · paint · type | 299, 192.5 · 11.5 × 7 · — · — | identical | match |
| path at 307.2, 192.5 | box · paint · type | 307.2, 192.5 · 3.3 × 3.3 · — · — | identical | match |
| “Trend” | box · paint · type | 318, 189 · 34 × 14 · — · 12px/600/normal/normal/rgb(244, 243, 240) | identical | match |
| div at 32, 212 | box · paint | 32, 212 · 150.6 × 50.5 · — | *absent* | **mismatch** |
| “1,240” | box · paint · type | 32, 212 · 115 × 50.5 · — · 43px/500/1.5px/normal/rgb(247, 246, 242) | identical | match |
| span at 156, 241 | box · paint | 156, 241 · 26.6 × 15 · — | *absent* | **mismatch** |
| svg at 156, 245.5 | box · paint · type | 156, 245.5 · 9 × 8 · — · — | identical | match |
| path at 156.5, 245.9 | box · paint · type | 156.5, 245.9 · 8 × 7.1 · — · — | identical | match |
| “18” | box · paint · type | 168, 241 · 14.6 × 15 · — · 13px/500/normal/normal/rgba(244, 243, 240, 0.8) | same box and metrics, value "8" | match (value) |
| div at 32, 330 | box · paint · type | 32, 330 · 329 × 6 · rgba(244, 243, 240, 0.14) · r 3px · — | identical | match |
| div at 32, 330 | box · paint · type | 32, 330 · 197.4 × 6 · rgba(244, 243, 240, 0.92) · r 3px · — | identical | match |
| div at 32, 351 | box · paint · type | 32, 351 · 329 × 13 · — · — | identical | match |
| “Navigator · 1,150” | box · paint · type | 32, 351 · 89.4 × 13 · — · 11px/500/normal/normal/rgba(244, 243, 240, 0.55) | identical | match |
| “Helmsman · 1,300” | box · paint · type | 265.1, 351 · 95.9 × 13 · — · 11px/500/normal/normal/rgba(244, 243, 240, 0.55) | identical | match |
| div at 12, 492 | box · paint · type | 12, 492 · 369 × 184 · rgb(255, 255, 255) · r 20px · rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(40, 38, 32, 0.07) 0px 10px 24px 0px · — | identical | match |
| “Last 30 days” | box · paint · type | 32, 512 · 79 × 15 · — · 13px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 32, 550 | box · paint · type | 32, 550 · 329 × 91.8 · — · — | identical | match |
| div at 32, 550 | radius | 50% | 12px | **mismatch** |
| div at 65.9, 550 | radius | 50% | 12px | **mismatch** |
| div at 99.8, 550 | radius | 50% | 12px | **mismatch** |
| div at 133.6, 550 | radius | 50% | 12px | **mismatch** |
| div at 167.5, 550 | radius | 50% | 12px | **mismatch** |
| div at 201.4, 550 | radius | 50% | 12px | **mismatch** |
| div at 235.3, 550 | radius | 50% | 12px | **mismatch** |
| div at 269.1, 550 | radius | 50% | 12px | **mismatch** |
| div at 303, 550 | radius | 50% | 12px | **mismatch** |
| div at 336.9, 550 | radius | 50% | 12px | **mismatch** |
| div at 32, 583.9 | radius | 50% | 12px | **mismatch** |
| div at 65.9, 583.9 | radius | 50% | 12px | **mismatch** |
| div at 99.8, 583.9 | radius | 50% | 12px | **mismatch** |
| div at 133.6, 583.9 | radius | 50% | 12px | **mismatch** |
| div at 167.5, 583.9 | radius | 50% | 12px | **mismatch** |
| div at 201.4, 583.9 | radius | 50% | 12px | **mismatch** |
| div at 235.3, 583.9 | radius | 50% | 12px | **mismatch** |
| div at 269.1, 583.9 | radius | 50% | 12px | **mismatch** |
| div at 303, 583.9 | radius | 50% | 12px | **mismatch** |
| div at 336.9, 583.9 | radius | 50% | 12px | **mismatch** |
| div at 32, 617.8 | radius | 50% | 12px | **mismatch** |
| div at 65.9, 617.8 | radius | 50% | 12px | **mismatch** |
| div at 99.8, 617.8 | radius | 50% | 12px | **mismatch** |
| div at 133.6, 617.8 | radius | 50% | 12px | **mismatch** |
| div at 167.5, 617.8 | radius | 50% | 12px | **mismatch** |
| div at 201.4, 617.8 | radius | 50% | 12px | **mismatch** |
| div at 235.3, 617.8 | radius | 50% | 12px | **mismatch** |
| div at 269.1, 617.8 | radius | 50% | 12px | **mismatch** |
| div at 303, 617.8 | radius | 50% | 12px | **mismatch** |
| div at 336.9, 617.8 | radius | 50% | 12px | **mismatch** |
| “This morning” | box · paint · type | 20, 402 · 80 × 14.5 · — · 12.5px/600/normal/normal/rgb(139, 136, 130) | identical | match |
| svg at 366, 402 | box · paint · type | 366, 402 · 7 × 12 · — · — | identical | match |
| path at 367.4, 403.3 | box · paint · type | 367.4, 403.3 · 4.3 × 9.4 · — · — | identical | match |
| div at 12, 428 | box · paint · type | 12, 428 · 369 × 48 · — · — | identical | match |
| div at 12, 428 | box · paint · type | 12, 428 · 180.5 × 48 · rgb(255, 255, 255) · r 12px · rgba(0, 0, 0, 0.06) 0px 0px 0px 1px · — | identical | match |
| div at 25, 428 | box · paint · type | 25, 428 · 65 × 48 · — · — | identical | match |
| div at 25, 447.5 | radius | 50% | 4.5px | **mismatch** |
| div at 39, 447.5 | radius | 50% | 4.5px | **mismatch** |
| div at 53, 447.5 | radius | 50% | 4.5px | **mismatch** |
| div at 67, 447.5 | radius | 50% | 4.5px | **mismatch** |
| div at 81, 447.5 | radius | 50% | 4.5px | **mismatch** |
| “Fine” | y | 428 | 445 | **mismatch** |
| “Fine” | height | 48 | 14 | **mismatch** |
| div at 200.5, 428 | box · paint · type | 200.5, 428 · 180.5 × 48 · rgb(255, 255, 255) · r 12px · rgba(0, 0, 0, 0.06) 0px 0px 0px 1px · — | identical | match |
| div at 213.5, 442 | box · paint · type | 213.5, 442 · 46.5 × 25 · — · — | identical | match |
| div at 213.5, 458 | box · paint · type | 213.5, 458 · 6.5 × 9 · rgb(19, 19, 19) · r 3px · — | identical | match |
| div at 223.5, 454 | box · paint · type | 223.5, 454 · 6.5 × 13 · rgb(19, 19, 19) · r 3px · rgb(255, 255, 255) 0px 0px 0px 1.5px, rgb(19, 19, 19) 0px 0px 0px 2.5px · — | identical | match |
| div at 233.5, 450 | box · paint · type | 233.5, 450 · 6.5 × 17 · rgba(19, 19, 19, 0.13) · r 3px · — | identical | match |
| div at 243.5, 446 | box · paint · type | 243.5, 446 · 6.5 × 21 · rgba(19, 19, 19, 0.13) · r 3px · — | identical | match |
| div at 253.5, 442 | box · paint · type | 253.5, 442 · 6.5 × 25 · rgba(19, 19, 19, 0.13) · r 3px · — | identical | match |
| “Low” | y | 428 | 445 | **mismatch** |
| “Low” | height | 48 | 14 | **mismatch** |
| div at 0, 705 | box · paint · type | 0, 705 · 393 × 64 · rgb(19, 19, 19) · r 18px 18px 0px 0px · — | identical | match |
| div at 16, 717 | radius | 50% | 20px | **mismatch** |
| svg at 26, 730.5 | box · paint · type | 26, 730.5 · 20 × 13 · — · — | identical | match |
| path at 27.5, 736 | box · paint · type | 27.5, 736 · 16.9 × 4.1 · — · — | identical | match |
| “Urge surfing” | box · paint · type | 69, 728.3 · 288 × 17.5 · — · 15px/600/normal/normal/rgb(247, 246, 242) | identical | match |
| svg at 370, 731 | box · paint · type | 370, 731 · 7 × 12 · — · — | identical | match |
| path at 371.4, 732.3 | box · paint · type | 371.4, 732.3 · 4.3 × 9.4 · — · — | identical | match |

**114 elements compared; 65 match, 49 differ.**
