# V3 Q5

* **Design frame** `Email-Login/V3 Q5`
* **App file** src/components/onboarding/v3.tsx (O3FunnelStep) + src/content/onboardingFunnel.ts

## Transcription — `V3 Q5`

Source `UI Final 1/project/Email Login.dc.html`, frame `V3-Q5.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:linear-gradient(180deg, rgb(18,18,16) 0%, rgb(31,30,28) 100%)  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  overflow:hidden  pointer-events:none
    <div> position:absolute  left:-40px  top:-140px  width:540px  height:270px  background:radial-gradient(closest-side, rgba(180,170,150,0.14), rgba(19,19,19,0) 72%)  border-radius:50%  filter:blur(6px)
    <div> position:absolute  left:50%  bottom:-251px  width:457px  height:457px  margin-left:-228.5px  background:radial-gradient(closest-side, rgba(255,255,255,0.17), rgba(255,255,255,0.08) 45%, rgba(255,255,255,0) 72%)  border-radius:50%
    <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.12
  <div> position:absolute  left:24px  right:24px  top:66px  height:4px  background:rgba(255,255,255,0.2)  border-radius:2px
    <div> position:absolute  left:0  top:0  width:22%  height:4px  background:#F4F3F0  border-radius:2px
  <div> position:absolute  left:16px  top:94px  display:flex  align-items:center  gap:9px
    <svg> viewBox="0 0 11 19"  width="11"  height="19"
      <path> d="M9.5 1.5L2 9.5l7.5 8"  fill="none"  stroke="rgba(244,243,240,0.75)"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
    <span> color:rgba(244,243,240,0.75)  font-size:17px  font-weight:400
      · Back
  <div> position:absolute  left:44px  right:44px  top:158px  color:#F4F3F0  font-size:22px  font-weight:500  letter-spacing:0.1px  line-height:1.32  text-align:center  text-wrap:pretty
    · When are you most likely to watch?
  <div> position:absolute  left:0  right:0  top:226px  color:rgba(244,243,240,0.55)  font-size:13px  font-weight:500  text-align:center
    · Select all that apply
  <div> position:absolute  left:24px  right:24px  top:278px  display:flex  gap:10px
    <div> position:relative  height:94px  padding:0 4px  box-sizing:border-box  display:flex  flex:1  flex-direction:column  align-items:center  justify-content:center  gap:8px  background:#F4F3F0  border-radius:16px  box-shadow:0 0 0 1px rgba(0,0,0,0)
      <div> position:absolute  right:8px  top:8px  width:15px  height:15px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:50%
        <svg> viewBox="0 0 16 12"  width="8"  height="6"
          <path> d="M1.5 6l4.4 4.5L14.5 1.5"  fill="none"  stroke="#F4F3F0"  stroke-width="2.8"  stroke-linecap="round"  stroke-linejoin="round"
      <svg> viewBox="0 0 30 30"  width="22"  height="22"
        <path> d="M17 4 A10.5 10.5 0 1 0 25 20 A8.2 8.2 0 1 1 17 4 Z"  fill="#131313"
      <span> color:#131313  font-size:12px  font-weight:500  line-height:15px  text-align:center
        · Late at night
    <div> position:relative  height:94px  padding:0 4px  box-sizing:border-box  display:flex  flex:1  flex-direction:column  align-items:center  justify-content:center  gap:8px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.2)
      <svg> viewBox="0 0 24 24"  width="22"  height="22"
        <path> d="M7 15a5 5 0 0 1 10 0"  fill="none"  stroke="#F4F3F0"  stroke-width="2.5"
        <path> d="M3 18h18M12 4v3M5 7l2 2M19 7l-2 2"  stroke="#F4F3F0"  stroke-width="2.5"  stroke-linecap="round"
      <span> color:#F4F3F0  font-size:12px  font-weight:500  line-height:15px  text-align:center
        · Early morning
    <div> position:relative  height:94px  padding:0 4px  box-sizing:border-box  display:flex  flex:1  flex-direction:column  align-items:center  justify-content:center  gap:8px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.2)
      <svg> viewBox="0 0 24 24"  width="22"  height="22"
        <circle> cx="12"  cy="12"  r="8.5"  fill="none"  stroke="#F4F3F0"  stroke-width="2.5"
        <path> d="M12 7.5V12l3 2"  fill="none"  stroke="#F4F3F0"  stroke-width="2.5"  stroke-linecap="round"  stroke-linejoin="round"
      <span> color:#F4F3F0  font-size:12px  font-weight:500  line-height:15px  text-align:center
        · Bored in the day
  <div> position:absolute  left:24px  right:24px  top:380px  display:flex  gap:10px
    <div> position:relative  height:94px  padding:0 4px  box-sizing:border-box  display:flex  flex:1  flex-direction:column  align-items:center  justify-content:center  gap:8px  background:#F4F3F0  border-radius:16px  box-shadow:0 0 0 1px rgba(0,0,0,0)
      <div> position:absolute  right:8px  top:8px  width:15px  height:15px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:50%
        <svg> viewBox="0 0 16 12"  width="8"  height="6"
          <path> d="M1.5 6l4.4 4.5L14.5 1.5"  fill="none"  stroke="#F4F3F0"  stroke-width="2.8"  stroke-linecap="round"  stroke-linejoin="round"
      <svg> viewBox="0 0 24 24"  width="22"  height="22"
        <path> d="M3 16l5-6 4 4 6-8"  fill="none"  stroke="#131313"  stroke-width="2.6"  stroke-linecap="round"  stroke-linejoin="round"
      <span> color:#131313  font-size:12px  font-weight:500  line-height:15px  text-align:center
        · After stress
    <div> position:relative  height:94px  padding:0 4px  box-sizing:border-box  display:flex  flex:1  flex-direction:column  align-items:center  justify-content:center  gap:8px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.2)
      <svg> viewBox="0 0 24 24"  width="22"  height="22"
        <path> d="M3 7v10M3 14h18v3M3 11h18v3"  fill="none"  stroke="#F4F3F0"  stroke-width="2.5"  stroke-linecap="round"  stroke-linejoin="round"
        <rect> width="6"  height="3"  x="5"  y="8.5"  rx="1.5"  fill="#F4F3F0"
      <span> color:#F4F3F0  font-size:12px  font-weight:500  line-height:15px  text-align:center
        · Can’t sleep
    <div> position:relative  height:94px  padding:0 4px  box-sizing:border-box  display:flex  flex:1  flex-direction:column  align-items:center  justify-content:center  gap:8px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.2)
      <svg> viewBox="0 0 24 24"  width="22"  height="22"
        <rect> width="17"  height="15"  x="3.5"  y="5"  rx="3"  fill="none"  stroke="#F4F3F0"  stroke-width="2.5"
        <path> d="M8 3v4M16 3v4M3.5 10h17"  stroke="#F4F3F0"  stroke-width="2.5"  stroke-linecap="round"
      <span> color:#F4F3F0  font-size:12px  font-weight:500  line-height:15px  text-align:center
        · Weekends
  <div> position:absolute  left:24px  right:24px  top:482px  display:flex  gap:10px
    <div> position:relative  height:94px  padding:0 4px  box-sizing:border-box  display:flex  flex:1  flex-direction:column  align-items:center  justify-content:center  gap:8px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.2)
      <svg> viewBox="0 0 24 24"  width="22"  height="22"
        <path> d="M7 3h10l-1.2 13a3.8 3.8 0 0 1-7.6 0Z"  fill="none"  stroke="#F4F3F0"  stroke-width="2.5"  stroke-linejoin="round"
        <path> d="M9 21h6M12 17v4"  stroke="#F4F3F0"  stroke-width="2.5"  stroke-linecap="round"
      <span> color:#F4F3F0  font-size:12px  font-weight:500  line-height:15px  text-align:center
        · After drinking
    <div> position:relative  height:94px  padding:0 4px  box-sizing:border-box  display:flex  flex:1  flex-direction:column  align-items:center  justify-content:center  gap:8px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.2)
      <svg> viewBox="0 0 24 24"  width="22"  height="22"
        <path> d="M4 11l8-7 8 7"  fill="none"  stroke="#F4F3F0"  stroke-width="2.5"  stroke-linecap="round"  stroke-linejoin="round"
        <path> d="M6 10v10h12V10"  fill="none"  stroke="#F4F3F0"  stroke-width="2.5"  stroke-linejoin="round"
      <span> color:#F4F3F0  font-size:12px  font-weight:500  line-height:15px  text-align:center
        · Home alone
    <div> position:relative  height:94px  padding:0 4px  box-sizing:border-box  display:flex  flex:1  flex-direction:column  align-items:center  justify-content:center  gap:8px  background:#F4F3F0  border-radius:16px  box-shadow:0 0 0 1px rgba(0,0,0,0)
      <div> position:absolute  right:8px  top:8px  width:15px  height:15px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:50%
        <svg> viewBox="0 0 16 12"  width="8"  height="6"
          <path> d="M1.5 6l4.4 4.5L14.5 1.5"  fill="none"  stroke="#F4F3F0"  stroke-width="2.8"  stroke-linecap="round"  stroke-linejoin="round"
      <svg> viewBox="0 0 24 24"  width="22"  height="22"
        <rect> width="10"  height="18"  x="7"  y="3"  rx="2.5"  fill="none"  stroke="#131313"  stroke-width="2.5"
        <path> d="M10.5 18h3"  stroke="#131313"  stroke-width="2.5"  stroke-linecap="round"
      <span> color:#131313  font-size:12px  font-weight:500  line-height:15px  text-align:center
        · Phone in bed
  <div> position:absolute  left:24px  right:24px  top:744px  height:56px  display:flex  align-items:center  justify-content:center  background:#F4F3F0  border-radius:28px  cursor:pointer
    <span> color:#131313  font-size:16.5px  font-weight:600
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
| div at -32, 646 | radius | 50% | - | **mismatch** |
| div at 24, 66 | box · paint · type | 24, 66 · 345 × 4 · rgba(255, 255, 255, 0.2) · r 2px · — | identical | match |
| div at 24, 66 | box · paint · type | 24, 66 · 75.9 × 4 · rgb(244, 243, 240) · r 2px · — | identical | match |
| div at 16, 94 | box · paint · type | 16, 94 · 57.6 × 20 · — · — | identical | match |
| svg at 16, 94.5 | box · paint · type | 16, 94.5 · 11 × 19 · — · — | identical | match |
| path at 18, 96 | box · paint · type | 18, 96 · 7.5 × 16 · — · — | identical | match |
| “Back” | box · paint · type | 36, 94 · 37.6 × 20 · — · 17px/400/normal/normal/rgba(244, 243, 240, 0.75) | identical | match |
| “When are you most likely to watch?” | box · paint · type | 44, 158 · 305 × 58.1 · — · 22px/500/0.1px/29.04px/rgb(244, 243, 240) | identical | match |
| “Select all that apply” | box · paint · type | 0, 226 · 393 × 15 · — · 13px/500/normal/normal/rgba(244, 243, 240, 0.55) | identical | match |
| div at 24, 278 | box · paint · type | 24, 278 · 345 × 94 · — · — | identical | match |
| div at 24, 278 | box · paint · type | 24, 278 · 108.3 × 94 · rgb(244, 243, 240) · r 16px · rgba(0, 0, 0, 0) 0px 0px 0px 1px · — | identical | match |
| div at 109.3, 286 | radius | 50% | 7.5px | **mismatch** |
| svg at 112.8, 290.5 | box · paint · type | 112.8, 290.5 · 8 × 6 · — · — | identical | match |
| path at 113.6, 291.3 | box · paint · type | 113.6, 291.3 · 6.5 × 4.5 · — · — | identical | match |
| svg at 67.2, 302.5 | box · paint · type | 67.2, 302.5 · 22 × 22 · — · — | identical | match |
| path at 71.3, 305.4 | box · paint · type | 71.3, 305.4 · 14.2 × 15.4 · — · — | identical | match |
| “Late at night” | box · paint · type | 41.9, 332.5 · 72.6 × 15 · — · 12px/500/normal/15px/rgb(19, 19, 19) | identical | match |
| div at 142.3, 278 | box · paint · type | 142.3, 278 · 108.3 × 94 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.2) 0px 0px 0px 1px · — | identical | match |
| svg at 185.5, 302.5 | box · paint · type | 185.5, 302.5 · 22 × 22 · — · — | identical | match |
| path at 191.9, 311.7 | box · paint · type | 191.9, 311.7 · 9.2 × 4.6 · — · — | identical | match |
| path at 188.2, 306.2 | box · paint · type | 188.2, 306.2 · 16.5 × 12.8 · — · — | identical | match |
| “Early morning” | box · paint · type | 156.6, 332.5 · 79.8 × 15 · — · 12px/500/normal/15px/rgb(244, 243, 240) | identical | match |
| div at 260.7, 278 | box · paint · type | 260.7, 278 · 108.3 × 94 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.2) 0px 0px 0px 1px · — | identical | match |
| svg at 303.8, 302.5 | box · paint · type | 303.8, 302.5 · 22 × 22 · — · — | identical | match |
| circle at 307, 305.7 | box · paint · type | 307, 305.7 · 15.6 × 15.6 · — · — | identical | match |
| path at 314.8, 309.4 | box · paint · type | 314.8, 309.4 · 2.8 × 6 · — · — | identical | match |
| “Bored in the day” | box · paint · type | 267.8, 332.5 · 94.1 × 15 · — · 12px/500/normal/15px/rgb(244, 243, 240) | identical | match |
| div at 24, 380 | box · paint · type | 24, 380 · 345 × 94 · — · — | identical | match |
| div at 24, 380 | box · paint · type | 24, 380 · 108.3 × 94 · rgb(244, 243, 240) · r 16px · rgba(0, 0, 0, 0) 0px 0px 0px 1px · — | identical | match |
| div at 109.3, 388 | radius | 50% | 7.5px | **mismatch** |
| svg at 112.8, 392.5 | box · paint · type | 112.8, 392.5 · 8 × 6 · — · — | identical | match |
| path at 113.6, 393.3 | box · paint · type | 113.6, 393.3 · 6.5 × 4.5 · — · — | identical | match |
| svg at 67.2, 404.5 | box · paint · type | 67.2, 404.5 · 22 × 22 · — · — | identical | match |
| path at 69.9, 410 | box · paint · type | 69.9, 410 · 13.8 × 9.2 · — · — | identical | match |
| “After stress” | box · paint · type | 44.4, 434.5 · 67.5 × 15 · — · 12px/500/normal/15px/rgb(19, 19, 19) | identical | match |
| div at 142.3, 380 | box · paint · type | 142.3, 380 · 108.3 × 94 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.2) 0px 0px 0px 1px · — | identical | match |
| svg at 185.5, 404.5 | box · paint · type | 185.5, 404.5 · 22 × 22 · — · — | identical | match |
| path at 188.2, 410.9 | box · paint · type | 188.2, 410.9 · 16.5 × 9.2 · — · — | identical | match |
| rect at 190.1, 412.3 | box · paint · type | 190.1, 412.3 · 5.5 × 2.8 · — · — | identical | match |
| “Can’t sleep” | box · paint · type | 163.8, 434.5 · 65.3 × 15 · — · 12px/500/normal/15px/rgb(244, 243, 240) | identical | match |
| div at 260.7, 380 | box · paint · type | 260.7, 380 · 108.3 × 94 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.2) 0px 0px 0px 1px · — | identical | match |
| svg at 303.8, 404.5 | box · paint · type | 303.8, 404.5 · 22 × 22 · — · — | identical | match |
| rect at 307, 409.1 | box · paint · type | 307, 409.1 · 15.6 × 13.8 · — · — | identical | match |
| path at 307, 407.3 | box · paint · type | 307, 407.3 · 15.6 × 6.4 · — · — | identical | match |
| “Weekends” | box · paint · type | 285, 434.5 · 59.6 × 15 · — · 12px/500/normal/15px/rgb(244, 243, 240) | identical | match |
| div at 24, 482 | box · paint · type | 24, 482 · 345 × 94 · — · — | identical | match |
| div at 24, 482 | box · paint · type | 24, 482 · 108.3 × 94 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.2) 0px 0px 0px 1px · — | identical | match |
| svg at 67.2, 506.5 | box · paint · type | 67.2, 506.5 · 22 × 22 · — · — | identical | match |
| path at 73.6, 509.3 | box · paint · type | 73.6, 509.3 · 9.2 × 15.4 · — · — | identical | match |
| path at 75.4, 522.1 | box · paint · type | 75.4, 522.1 · 5.5 × 3.7 · — · — | identical | match |
| “After drinking” | box · paint · type | 38.5, 536.5 · 79.3 × 15 · — · 12px/500/normal/15px/rgb(244, 243, 240) | identical | match |
| div at 142.3, 482 | box · paint · type | 142.3, 482 · 108.3 × 94 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.2) 0px 0px 0px 1px · — | identical | match |
| svg at 185.5, 506.5 | box · paint · type | 185.5, 506.5 · 22 × 22 · — · — | identical | match |
| path at 189.2, 510.2 | box · paint · type | 189.2, 510.2 · 14.7 × 6.4 · — · — | identical | match |
| path at 191, 515.7 | box · paint · type | 191, 515.7 · 11 × 9.2 · — · — | identical | match |
| “Home alone” | box · paint · type | 162.2, 536.5 · 68.6 × 15 · — · 12px/500/normal/15px/rgb(244, 243, 240) | identical | match |
| div at 260.7, 482 | box · paint · type | 260.7, 482 · 108.3 × 94 · rgb(244, 243, 240) · r 16px · rgba(0, 0, 0, 0) 0px 0px 0px 1px · — | identical | match |
| div at 346, 490 | radius | 50% | 7.5px | **mismatch** |
| svg at 349.5, 494.5 | box · paint · type | 349.5, 494.5 · 8 × 6 · — · — | identical | match |
| path at 350.3, 495.3 | box · paint · type | 350.3, 495.3 · 6.5 × 4.5 · — · — | identical | match |
| svg at 303.8, 506.5 | box · paint · type | 303.8, 506.5 · 22 × 22 · — · — | identical | match |
| rect at 310.2, 509.3 | box · paint · type | 310.2, 509.3 · 9.2 × 16.5 · — · — | identical | match |
| path at 313.5, 523 | box · paint · type | 313.5, 523 · 2.8 × 0 · — · — | identical | match |
| “Phone in bed” | box · paint · type | 277.2, 536.5 · 75.2 × 15 · — · 12px/500/normal/15px/rgb(19, 19, 19) | identical | match |
| div at 24, 744 | box · paint · type | 24, 744 · 345 × 56 · rgb(244, 243, 240) · r 28px · — | identical | match |
| “Continue” | box · paint · type | 161.3, 762.3 · 70.3 × 19.5 · — · 16.5px/600/normal/normal/rgb(19, 19, 19) | identical | match |

**67 elements compared; 62 match, 5 differ.**

## Resolutions

The canvas draws `Late at night`, `After stress` and `Phone in bed` selected; the comparison ran
with the same three selected. Each tile's 22 × 22 glyph is transcribed from the frame child by
child into `FUNNEL_GLYPHS` — the `fill`/`stroke` the canvas bakes in are dropped, because the tile
flips between `#131313` on the selected paper tile and `#F4F3F0` on the unselected night one and
the ink belongs to the tile.

The `radius: 50% → 7.5px` rows are the 15 × 15 tick badges on the selected tiles; the other two are
the background washes. `DECISIONS.md` D015.
