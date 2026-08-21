# Reminders Setup

* **Design frame** `Email-Login/Reminders Setup`
* **App file** see the Comparison table below

## Transcription — `Reminders Setup`

Source `UI Final 1/project/Email Login.dc.html`, frame `Reminders-Setup.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  left:26px  right:26px  top:140px  color:#1D1C1A  font-size:22px  font-weight:500  letter-spacing:0.1px  line-height:1.32  text-align:center  text-wrap:pretty
    · Late night is when you’re most likely to watch.
  <div> position:absolute  left:30px  right:30px  top:214px  color:#55534E  font-size:15.5px  font-weight:400  line-height:23px  text-align:center  text-wrap:pretty
    · Want VICI there before that window starts?
  <div> position:absolute  left:24px  right:24px  top:280px  padding:16px 18px  box-sizing:border-box  background:#FFFFFF  border-radius:16px  box-shadow:0 0 0 1px rgba(0,0,0,0.09)  opacity:1
    <div> display:flex  align-items:center  gap:12px
      <img> width="24"  height="24"  src="laurel-mark.webp"  alt=""  opacity:0.8
      <div> flex:1  color:#1D1C1A  font-size:15.5px  font-weight:600
        · Morning check-in
      <div> color:#8B8882  font-size:12.5px  font-weight:500
        · now
    <div> color:#55534E  font-size:14.5px  font-weight:400  line-height:21px  margin-top:8px
      · Twenty seconds — where's your head at today?
  <div> position:absolute  left:24px  right:24px  top:392px  padding:16px 18px  box-sizing:border-box  background:#FFFFFF  border-radius:16px  box-shadow:0 0 0 1px rgba(0,0,0,0.09)  opacity:0.55
    <div> display:flex  align-items:center  gap:12px
      <img> width="24"  height="24"  src="laurel-mark.webp"  alt=""  opacity:0.8
      <div> flex:1  color:#1D1C1A  font-size:15.5px  font-weight:600
        · Late night ahead
      <div> color:#8B8882  font-size:12.5px  font-weight:500
        · 10:41 PM
    <div> color:#55534E  font-size:14.5px  font-weight:400  line-height:21px  margin-top:8px
      · Your risky window. The wave tool is one tap away.
  <div> position:absolute  left:24px  right:24px  top:688px  height:56px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:28px  cursor:pointer
    <span> color:#FFFFFF  font-size:17px  font-weight:600  letter-spacing:0.3px
      · Turn on reminders
  <div> position:absolute  left:0  right:0  top:764px  color:#8B8882  font-size:15px  font-weight:500  text-align:center  cursor:pointer
    · Not now
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| “Late night is when you’re most likely to watch.” | box · paint · type | 26, 140 · 341 × 58.1 · — · 22px/500/0.1px/29.04px/rgb(29, 28, 26) | identical | match |
| “Want VICI there before that window starts?” | box · paint · type | 30, 214 · 333 × 23 · — · 15.5px/400/normal/23px/rgb(85, 83, 78) | identical | match |
| div at 24, 280 | box · paint · type | 24, 280 · 345 × 106 · rgb(255, 255, 255) · r 16px · rgba(0, 0, 0, 0.09) 0px 0px 0px 1px · — | identical | match |
| div at 42, 296 | box · paint · type | 42, 296 · 309 × 24 · — · — | identical | match |
| img at 42, 296 | box · paint · type | 42, 296 · 24 × 24 · α 0.8 · — | identical | match |
| “Morning check-in” | box · paint · type | 78, 298.8 · 236.4 × 18.5 · — · 15.5px/600/normal/normal/rgb(29, 28, 26) | identical | match |
| “now” | box · paint · type | 326.4, 300.8 · 24.6 × 14.5 · — · 12.5px/500/normal/normal/rgb(139, 136, 130) | identical | match |
| “Twenty seconds — where's your head at today?” | box · paint · type | 42, 328 · 309 × 42 · — · 14.5px/400/normal/21px/rgb(85, 83, 78) | identical | match |
| div at 24, 392 | box · paint · type | 24, 392 · 345 × 106 · rgb(255, 255, 255) · r 16px · α 0.55 · rgba(0, 0, 0, 0.09) 0px 0px 0px 1px · — | identical | match |
| div at 42, 408 | box · paint · type | 42, 408 · 309 × 24 · — · — | identical | match |
| img at 42, 408 | box · paint · type | 42, 408 · 24 × 24 · α 0.8 · — | identical | match |
| “Late night ahead” | box · paint · type | 78, 410.8 · 206.6 × 18.5 · — · 15.5px/600/normal/normal/rgb(29, 28, 26) | identical | match |
| “10:41 PM” | box · paint · type | 296.6, 412.8 · 54.4 × 14.5 · — · 12.5px/500/normal/normal/rgb(139, 136, 130) | identical | match |
| “Your risky window. The wave tool is one tap away” | box · paint · type | 42, 440 · 309 × 42 · — · 14.5px/400/normal/21px/rgb(85, 83, 78) | identical | match |
| div at 24, 688 | box · paint · type | 24, 688 · 345 × 56 · rgb(19, 19, 19) · r 28px · — | identical | match |
| “Turn on reminders” | box · paint · type | 121.3, 706 · 150.4 × 20 · — · 17px/600/0.3px/normal/rgb(255, 255, 255) | identical | match |
| “Not now” | box · paint · type | 0, 764 · 393 × 17.5 · — · 15px/500/normal/normal/rgb(139, 136, 130) | identical | match |

**17 elements compared; 17 match, 0 differ.**
