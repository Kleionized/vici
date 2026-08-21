# Letter Received

* **Design frame** `Email-Login/Letter Received`
* **App file** see the Comparison table below

## Transcription — `Letter Received`

Source `UI Final 1/project/Email Login.dc.html`, frame `Letter-Received.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.07  pointer-events:none
  <div> position:absolute  inset:0  overflow:hidden  pointer-events:none
    <div> position:absolute  left:-15%  top:-190px  width:130%  height:300px  background:radial-gradient(closest-side, rgba(180,170,150,0.32), rgba(180,170,150,0.1) 55%, rgba(180,170,150,0) 75%)  border-radius:50%  filter:blur(5px)
    <div> position:absolute  left:50%  bottom:-260px  width:520px  height:520px  margin-left:-260px  background:radial-gradient(closest-side, rgba(255,236,196,0.4), rgba(255,236,196,0.18) 45%, rgba(255,236,196,0) 72%)  border-radius:50%
  <svg> viewBox="0 0 18 18"  width="18"  height="18"  position:absolute  right:20px  top:66px
    <path> d="M3 3l12 12M15 3L3 15"  stroke="#55534E"  stroke-width="2.2"  stroke-linecap="round"
  <div> position:absolute  left:50%  top:160px  width:260px  height:260px  margin-left:-130px
    <div> position:absolute  left:40px  top:10px  width:180px  height:180px  background:radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)  border-radius:50%  filter:blur(5px)
    <div> position:absolute  left:40px  top:226px  width:180px  height:16px  background:rgba(0,0,0,0.10)  border-radius:50%  filter:blur(6px)
    <div> position:absolute  left:46px  top:70px  width:168px  height:118px  background:linear-gradient(180deg, #FCFAF4, #F1EEE4)  border-radius:10px  box-shadow:0 0 0 1px rgba(0,0,0,0.07), 0 16px 32px rgba(40,38,32,0.18)  transform:rotate(-2deg)  overflow:hidden
      <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.07
      <svg> viewBox="0 0 168 118"  width="168"  height="118"  position:absolute  inset:0
        <path> d="M2 4 L84 66 L166 4"  fill="none"  stroke="rgba(0,0,0,0.12)"  stroke-width="1.6"
    <div> position:absolute  left:106px  top:112px  width:48px  height:48px  display:flex  align-items:center  justify-content:center  background:radial-gradient(circle at 38% 30%, #F0DBB4, #E2BA78 62%, #C99F5F 100%)  border-radius:50%  box-shadow:inset 0 0 0 3px rgba(255,255,255,0.25), 0 5px 12px rgba(180,140,70,0.45)  transform:rotate(-2deg)
      <svg> viewBox="0 0 40 26"  width:20px  opacity:0.55
        <path> d="M21 3 L21 16 L12 16 Z"  fill="#5b4a28"
        <path> d="M7 18 L33 18 Q30 24 20 24 Q10 24 7 18 Z"  fill="#5b4a28"
  <div> position:absolute  left:36px  right:36px  top:472px  color:#1D1C1A  font-size:24px  font-weight:500  letter-spacing:-0.1px  line-height:32px  text-align:center  text-wrap:balance
    · A letter arrived.
  <div> position:absolute  left:44px  right:44px  top:522px  color:#55534E  font-size:15.5px  font-weight:400  line-height:23px  text-align:center  text-wrap:pretty
    · From you, twelve weeks from now.
  <div> position:absolute  left:24px  right:24px  top:688px  height:56px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:28px  cursor:pointer
    <span> color:#FFFFFF  font-size:17px  font-weight:600  letter-spacing:0.2px
      · Open it
  <div> position:absolute  left:0  right:0  top:764px  color:#8B8882  font-size:15px  font-weight:500  text-align:center
    · Save it for later
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at -58.9, -190 | radius | 50% | - | **mismatch** |
| div at -63.5, 592 | radius | 50% | - | **mismatch** |
| svg at 355, 66 | box · paint · type | 355, 66 · 18 × 18 · — · — | identical | match |
| path at 358, 69 | box · paint · type | 358, 69 · 12 × 12 · — · — | identical | match |
| div at 66.5, 160 | box · paint · type | 66.5, 160 · 260 × 260 · — · — | identical | match |
| div at 106.5, 170 | radius | 50% | - | **mismatch** |
| div at 106.5, 386 | background | rgba(0, 0, 0, 0.1) | - | **mismatch** |
| div at 106.5, 386 | radius | 50% | - | **mismatch** |
| div at 110.5, 227.1 | box · paint · type | 110.5, 227.1 · 172 × 123.8 · r 10px · rgba(0, 0, 0, 0.07) 0px 0px 0px 1px, rgba(40, 38, 32, 0.18) 0px 16px 32px 0px · — | identical | match |
| div at 110.5, 227.1 | opacity | 0.07 | - | **mismatch** |
| div at 110.5, 227.1 | box · paint · type | 110.5, 227.1 · 172 × 123.8 · — · — | identical | match |
| path at 112.6, 231.2 | box · paint · type | 112.6, 231.2 · 166.1 × 67.7 · — · — | identical | match |
| div at 171.7, 271.2 | radius | 50% | 24px | **mismatch** |
| svg at 186.3, 289.2 | box · paint · type | 186.3, 289.2 · 20.4 × 13.7 · α 0.55 · — | identical | match |
| path at 192.3, 291 | box · paint · type | 192.3, 291 · 4.7 × 6.7 · — · — | identical | match |
| path at 190.1, 298.3 | box · paint · type | 190.1, 298.3 · 13.1 × 3.5 · — · — | identical | match |
| “A letter arrived.” | box · paint · type | 36, 472 · 321 × 32 · — · 24px/500/-0.1px/32px/rgb(29, 28, 26) | identical | match |
| “From you, twelve weeks from now.” | box · paint · type | 44, 522 · 305 × 23 · — · 15.5px/400/normal/23px/rgb(85, 83, 78) | identical | match |
| div at 24, 688 | box · paint · type | 24, 688 · 345 × 56 · rgb(19, 19, 19) · r 28px · — | identical | match |
| “Open it” | box · paint · type | 167.1, 706 · 58.8 × 20 · — · 17px/600/0.2px/normal/rgb(255, 255, 255) | identical | match |
| “Save it for later” | x | 0 | 143.6 | **mismatch** |
| “Save it for later” | width | 393 | 105.7 | **mismatch** |

**20 elements compared; 13 match, 7 differ.**
