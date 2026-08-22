# Checkin Reasons

* **Design frame** `Email-Login/Checkin Reasons`
* **App file** src/components/MoodLogger.tsx → ReasonsBoard

## Transcription — `Checkin Reasons`

Source `UI Final 1/project/Email Login.dc.html`, frame `Checkin-Reasons.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.07  pointer-events:none
  <div> position:absolute  left:16px  top:66px  display:flex  align-items:center  gap:9px
    <svg> viewBox="0 0 11 19"  width="11"  height="19"
      <path> d="M9.5 1.5L2 9.5l7.5 8"  fill="none"  stroke="#55534E"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
    <span> color:#55534E  font-size:17px  font-weight:400
      · Back
  <div> position:absolute  left:0  right:0  top:72px  display:flex  justify-content:center  gap:7px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:18px  height:6px  background:#131313  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
  <div> position:absolute  left:0  right:0  top:118px  color:#1D1C1A  font-size:22px  font-weight:500  letter-spacing:0.1px  text-align:center
    · What caused the feeling?
  <div> position:absolute  left:24px  right:24px  top:188px  height:60px  padding:0 18px  display:flex  align-items:center  gap:14px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
    <div> width:38px  height:38px  display:flex  flex-shrink:0  align-items:center  justify-content:center  background:#F1EFE9  border-radius:50%
      <svg> viewBox="0 0 24 24"  width="21"  height="21"
        <path> d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
        <path> d="M15.5 11.5a2.5 2.5 0 1 0-1.8-4.3"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
        <path> d="M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
        <path> d="M15.8 15c1.9.4 3.3 1.6 3.7 3.6"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
    <span> flex:1  color:#1D1C1A  font-size:15px  font-weight:500
      · Relationship
    <div> width:24px  height:24px  box-sizing:border-box  flex-shrink:0  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.22)
  <div> position:absolute  left:24px  right:24px  top:254px  height:60px  padding:0 18px  display:flex  align-items:center  gap:14px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
    <div> width:38px  height:38px  display:flex  flex-shrink:0  align-items:center  justify-content:center  background:#F1EFE9  border-radius:50%
      <svg> viewBox="0 0 24 24"  width="21"  height="21"
        <path> d="M9 10a2.8 2.8 0 1 0 0-5.6A2.8 2.8 0 0 0 9 10Z"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
        <path> d="M16.5 12.2a2.2 2.2 0 1 0 0-4.4"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
        <path> d="M3.5 19c.5-3 2.6-4.6 5.5-4.6 2 0 3.6.7 4.6 2"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
        <path> d="M14.2 19c.3-1.8 1.4-2.9 3-2.9 1.5 0 2.6 1 3 2.9"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
    <span> flex:1  color:#1D1C1A  font-size:15px  font-weight:500
      · Family
    <div> width:24px  height:24px  box-sizing:border-box  flex-shrink:0  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.22)
  <div> position:absolute  left:24px  right:24px  top:320px  height:60px  padding:0 18px  display:flex  align-items:center  gap:14px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
    <div> width:38px  height:38px  display:flex  flex-shrink:0  align-items:center  justify-content:center  background:#F1EFE9  border-radius:50%
      <svg> viewBox="0 0 24 24"  width="21"  height="21"
        <path> d="M4.5 9.5h15v9h-15Z"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
        <path> d="M9.5 9.5V8a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 8v1.5"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
        <path> d="M4.5 13h15"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
    <span> flex:1  color:#1D1C1A  font-size:15px  font-weight:500
      · School / work
    <div> width:24px  height:24px  box-sizing:border-box  flex-shrink:0  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.22)
  <div> position:absolute  left:24px  right:24px  top:386px  height:60px  padding:0 18px  display:flex  align-items:center  gap:14px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
    <div> width:38px  height:38px  display:flex  flex-shrink:0  align-items:center  justify-content:center  background:#F1EFE9  border-radius:50%
      <svg> viewBox="0 0 24 24"  width="21"  height="21"
        <path> d="M12 19.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
        <path> d="M14.4 9.8c-.4-.8-1.3-1.3-2.4-1.3-1.5 0-2.6.8-2.6 1.9s1 1.5 2.6 1.8c1.6.3 2.6.8 2.6 1.9s-1.2 1.9-2.6 1.9c-1.2 0-2.1-.5-2.5-1.3"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
        <path> d="M12 7v10"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
    <span> flex:1  color:#1D1C1A  font-size:15px  font-weight:500
      · Money
    <div> width:24px  height:24px  box-sizing:border-box  flex-shrink:0  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.22)
  <div> position:absolute  left:24px  right:24px  top:452px  height:60px  padding:0 18px  display:flex  align-items:center  gap:14px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1.6px #131313  cursor:pointer
    <div> width:38px  height:38px  display:flex  flex-shrink:0  align-items:center  justify-content:center  background:#131313  border-radius:50%
      <svg> viewBox="0 0 24 24"  width="21"  height="21"
        <path> d="M5.5 4.5h13v15h-13Z"  fill="none"  stroke="#F4F3F0"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
        <path> d="M12 11.2a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Z"  fill="none"  stroke="#F4F3F0"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
        <path> d="M8.5 17c.5-1.8 1.8-2.7 3.5-2.7s3 .9 3.5 2.7"  fill="none"  stroke="#F4F3F0"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
    <span> flex:1  color:#1D1C1A  font-size:15px  font-weight:600
      · Self-image
    <div> width:24px  height:24px  display:flex  flex-shrink:0  align-items:center  justify-content:center  background:#131313  border-radius:50%
      <svg> viewBox="0 0 12 10"  width="12"  height="10"
        <path> d="M1.5 5L4.5 8L10.5 1.5"  fill="none"  stroke="#FFFFFF"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
  <div> position:absolute  left:24px  right:24px  top:518px  height:60px  padding:0 18px  display:flex  align-items:center  gap:14px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1.6px #131313  cursor:pointer
    <div> width:38px  height:38px  display:flex  flex-shrink:0  align-items:center  justify-content:center  background:#131313  border-radius:50%
      <svg> viewBox="0 0 24 24"  width="21"  height="21"
        <path> d="M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"  fill="none"  stroke="#F4F3F0"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
        <path> d="M5.5 19c.7-3.4 3.2-5 6.5-5s5.8 1.6 6.5 5"  fill="none"  stroke="#F4F3F0"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
    <span> flex:1  color:#1D1C1A  font-size:15px  font-weight:600
      · Loneliness
    <div> width:24px  height:24px  display:flex  flex-shrink:0  align-items:center  justify-content:center  background:#131313  border-radius:50%
      <svg> viewBox="0 0 12 10"  width="12"  height="10"
        <path> d="M1.5 5L4.5 8L10.5 1.5"  fill="none"  stroke="#FFFFFF"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
  <div> position:absolute  left:24px  right:24px  top:584px  height:60px  padding:0 18px  display:flex  align-items:center  gap:14px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
    <div> width:38px  height:38px  display:flex  flex-shrink:0  align-items:center  justify-content:center  background:#F1EFE9  border-radius:50%
      <svg> viewBox="0 0 24 24"  width="21"  height="21"
        <path> d="M12 19.5s-7-4.4-7-9.7a4 4 0 0 1 7-2.6 4 4 0 0 1 7 2.6c0 5.3-7 9.7-7 9.7Z"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
    <span> flex:1  color:#1D1C1A  font-size:15px  font-weight:500
      · Health / wellbeing
    <div> width:24px  height:24px  box-sizing:border-box  flex-shrink:0  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.22)
  <div> position:absolute  left:24px  right:24px  top:650px  height:60px  padding:0 18px  display:flex  align-items:center  gap:14px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
    <div> width:38px  height:38px  display:flex  flex-shrink:0  align-items:center  justify-content:center  background:#F1EFE9  border-radius:50%
      <svg> viewBox="0 0 24 24"  width="21"  height="21"
        <path> d="M9.3 9a2.7 2.7 0 1 1 3.7 2.5c-.9.35-1.5 1-1.5 2v.3"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
        <circle> cx="11.7"  cy="17.2"  r="1.3"  fill="#1D1C1A"
    <span> flex:1  color:#1D1C1A  font-size:15px  font-weight:500
      · None / unknown
    <div> width:24px  height:24px  box-sizing:border-box  flex-shrink:0  border-radius:50%  box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.22)
  <div> position:absolute  left:24px  right:24px  top:744px  height:58px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:29px  cursor:pointer
    <span> color:#FFFFFF  font-size:17px  font-weight:600  letter-spacing:0.2px
      · Continue
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at 16, 66 | box · paint · type | 16, 66 · 57.6 × 20 · — · — | identical | match |
| svg at 16, 66.5 | box · paint · type | 16, 66.5 · 11 × 19 · — · — | identical | match |
| path at 18, 68 | box · paint · type | 18, 68 · 7.5 × 16 · — · — | identical | match |
| “Back” | box · paint · type | 36, 66 · 37.6 × 20 · — · 17px/400/normal/normal/rgb(85, 83, 78) | identical | match |
| div at 0, 72 | box · paint · type | 0, 72 · 393 × 6 · — · — | identical | match |
| div at 155, 72 | box · paint · type | 155, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 168, 72 | box · paint · type | 168, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 181, 72 | box · paint · type | 181, 72 · 18 × 6 · rgb(19, 19, 19) · r 3px · — | identical | match |
| div at 206, 72 | box · paint · type | 206, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 219, 72 | box · paint · type | 219, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 232, 72 | box · paint · type | 232, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| “What caused the feeling?” | box · paint · type | 0, 118 · 393 × 26 · — · 22px/500/0.1px/normal/rgb(29, 28, 26) | identical | match |
| div at 24, 188 | box · paint · type | 24, 188 · 345 × 60 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| div at 42, 199 | radius | 50% | 19px | **mismatch** |
| svg at 50.5, 207.5 | box · paint · type | 50.5, 207.5 · 21 × 21 · — · — | identical | match |
| path at 55.8, 211.9 | box · paint · type | 55.8, 211.9 · 5.3 × 5.3 · — · — | identical | match |
| path at 62.5, 213.2 | box · paint · type | 62.5, 213.2 · 3.7 × 4.4 · — · — | identical | match |
| path at 53.6, 220.2 | box · paint · type | 53.6, 220.2 · 9.6 × 3.9 · — · — | identical | match |
| path at 64.3, 220.6 | box · paint · type | 64.3, 220.6 · 3.2 × 3.1 · — · — | identical | match |
| “Relationship” | box · paint · type | 94, 209.3 · 219 × 17.5 · — · 15px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 327, 206 | radius | 50% | 12px | **mismatch** |
| div at 24, 254 | box · paint · type | 24, 254 · 345 × 60 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| div at 42, 265 | radius | 50% | 19px | **mismatch** |
| svg at 50.5, 273.5 | box · paint · type | 50.5, 273.5 · 21 × 21 · — · — | identical | match |
| path at 55.9, 277.4 | box · paint · type | 55.9, 277.4 · 4.9 × 4.9 · — · — | identical | match |
| path at 64.9, 280.3 | box · paint · type | 64.9, 280.3 · 1.9 × 3.8 · — · — | identical | match |
| path at 53.6, 286.1 | box · paint · type | 53.6, 286.1 · 8.8 × 4 · — · — | identical | match |
| path at 62.9, 287.6 | box · paint · type | 62.9, 287.6 · 5.3 × 2.5 · — · — | identical | match |
| “Family” | box · paint · type | 94, 275.3 · 219 × 17.5 · — · 15px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 327, 272 | radius | 50% | 12px | **mismatch** |
| div at 24, 320 | box · paint · type | 24, 320 · 345 × 60 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| div at 42, 331 | radius | 50% | 19px | **mismatch** |
| svg at 50.5, 339.5 | box · paint · type | 50.5, 339.5 · 21 × 21 · — · — | identical | match |
| path at 54.4, 347.8 | box · paint · type | 54.4, 347.8 · 13.1 × 7.9 · — · — | identical | match |
| path at 58.8, 345.2 | box · paint · type | 58.8, 345.2 · 4.4 × 2.6 · — · — | identical | match |
| path at 54.4, 350.9 | box · paint · type | 54.4, 350.9 · 13.1 × 0 · — · — | identical | match |
| “School / work” | box · paint · type | 94, 341.3 · 219 × 17.5 · — · 15px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 327, 338 | radius | 50% | 12px | **mismatch** |
| div at 24, 386 | box · paint · type | 24, 386 · 345 × 60 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| div at 42, 397 | radius | 50% | 19px | **mismatch** |
| svg at 50.5, 405.5 | box · paint · type | 50.5, 405.5 · 21 × 21 · — · — | identical | match |
| path at 54.4, 409.4 | box · paint · type | 54.4, 409.4 · 13.1 × 13.1 · — · — | identical | match |
| path at 58.7, 412.9 | box · paint · type | 58.7, 412.9 · 4.6 × 6.6 · — · — | identical | match |
| path at 61, 411.6 | box · paint · type | 61, 411.6 · 0 × 8.8 · — · — | identical | match |
| “Money” | box · paint · type | 94, 407.3 · 219 × 17.5 · — · 15px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 327, 404 | radius | 50% | 12px | **mismatch** |
| div at 24, 452 | box · paint · type | 24, 452 · 345 × 60 · rgb(255, 255, 255) · r 18px · rgb(19, 19, 19) 0px 0px 0px 1.6px · — | identical | match |
| div at 42, 463 | radius | 50% | 19px | **mismatch** |
| svg at 50.5, 471.5 | box · paint · type | 50.5, 471.5 · 21 × 21 · — · — | identical | match |
| path at 55.3, 475.4 | box · paint · type | 55.3, 475.4 · 11.4 × 13.1 · — · — | identical | match |
| path at 59, 477.3 | box · paint · type | 59, 477.3 · 4 × 4 · — · — | identical | match |
| path at 57.9, 484 | box · paint · type | 57.9, 484 · 6.1 × 2.4 · — · — | identical | match |
| “Self-image” | box · paint · type | 94, 473.3 · 219 × 17.5 · — · 15px/600/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 327, 470 | radius | 50% | 12px | **mismatch** |
| svg at 333, 477 | box · paint · type | 333, 477 · 12 × 10 · — · — | identical | match |
| path at 334.5, 478.5 | box · paint · type | 334.5, 478.5 · 9 × 6.5 · — · — | identical | match |
| div at 24, 518 | box · paint · type | 24, 518 · 345 × 60 · rgb(255, 255, 255) · r 18px · rgb(19, 19, 19) 0px 0px 0px 1.6px · — | identical | match |
| div at 42, 529 | radius | 50% | 19px | **mismatch** |
| svg at 50.5, 537.5 | box · paint · type | 50.5, 537.5 · 21 × 21 · — · — | identical | match |
| path at 58.4, 541.9 | box · paint · type | 58.4, 541.9 · 5.3 × 5.3 · — · — | identical | match |
| path at 55.3, 549.8 | box · paint · type | 55.3, 549.8 · 11.4 × 4.4 · — · — | identical | match |
| “Loneliness” | box · paint · type | 94, 539.3 · 219 × 17.5 · — · 15px/600/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 327, 536 | radius | 50% | 12px | **mismatch** |
| svg at 333, 543 | box · paint · type | 333, 543 · 12 × 10 · — · — | identical | match |
| path at 334.5, 544.5 | box · paint · type | 334.5, 544.5 · 9 × 6.5 · — · — | identical | match |
| div at 24, 584 | box · paint · type | 24, 584 · 345 × 60 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| div at 42, 595 | radius | 50% | 19px | **mismatch** |
| svg at 50.5, 603.5 | box · paint · type | 50.5, 603.5 · 21 × 21 · — · — | identical | match |
| path at 54.9, 608.6 | box · paint · type | 54.9, 608.6 · 12.3 × 11.9 · — · — | identical | match |
| “Health / wellbeing” | box · paint · type | 94, 605.3 · 219 × 17.5 · — · 15px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 327, 602 | radius | 50% | 12px | **mismatch** |
| div at 24, 650 | box · paint · type | 24, 650 · 345 × 60 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| div at 42, 661 | radius | 50% | 19px | **mismatch** |
| svg at 50.5, 669.5 | box · paint · type | 50.5, 669.5 · 21 × 21 · — · — | identical | match |
| path at 58.6, 675 | box · paint · type | 58.6, 675 · 4.7 × 6.6 · — · — | identical | match |
| circle at 59.6, 683.4 | box · paint · type | 59.6, 683.4 · 2.3 × 2.3 · — · — | identical | match |
| “None / unknown” | box · paint · type | 94, 671.3 · 219 × 17.5 · — · 15px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 327, 668 | radius | 50% | 12px | **mismatch** |
| div at 24, 744 | box · paint · type | 24, 744 · 345 × 58 · rgb(19, 19, 19) · r 29px · — | identical | match |
| “Continue” | box · paint · type | 159.7, 763 · 73.7 × 20 · — · 17px/600/0.2px/normal/rgb(255, 255, 255) | identical | match |

**80 elements compared; 64 match, 16 differ.**

## Reading — every row that is not `match`

Three classes of row can differ without the screen differing, and they are the
only classes present unless a row below says otherwise. `DECISIONS.md` D015
names them:

* **`radius: 50% → <n>px`.** React Native's `borderRadius` takes a number, not a
  percentage. Every one of these is exactly half the box's shorter side, so the
  painted shape is the same circle; only the notation differs.
* **`radius: 50% → -` with a node-count of 1 against 3.** A CSS
  `radial-gradient` on a `<div>` has no React Native equivalent; it is drawn as
  an `<Svg><Circle fill="url(#…)">`, which is a View, an Svg and a Circle on the
  same rect where the canvas has one div. The rect, and the gradient's stops,
  are identical.
* **`radius: 50% 50% 0 0 / Npx Npx 0 0 → -`.** An elliptical corner radius
  cannot be expressed in React Native at all, so the hill is drawn as an SVG arc
  by `src/components/ui/Hill.tsx`. Same rect, same silhouette, three nodes
  instead of one.

A row marked **match (value)** is a value the account owns rather than the
canvas: the box, the colour and the type metrics are identical and only the
characters differ, because the frame is drawn against a sample account and the
app is drawing the seeded one (`scripts/uifinal1/seed.mjs`).

Frame-specific: the list is rewritten. Eight rows on a 66 pitch from `top: 188`,
no sub-line at all, and a vocabulary of which only "Loneliness" survives from
the previous bundle — Relationship, Family, School / work, Money, Self-image,
Loneliness, Health / wellbeing, None / unknown. All eight icons are new path
data on a `0 0 24 24` box at 21×21, `stroke-width: 2`, round caps and joins,
inked `#1D1C1A` on the `#F1EFE9` plate and `#F4F3F0` on the `#131313` one; the
"None / unknown" glyph's dot is a **filled** circle rather than a stroked one
and takes the same ink swap. The title is **"What caused the feeling?"**

The app's own additions — the "Something else" text row, its `other` glyph, the
"Add" pill and the free-text rows it produced — have no canvas equivalent and
are removed: eight rows run 188 → 710 and the pill is at 744, so there is no
band left to open one into.
