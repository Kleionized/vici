# The Vow

* **Design frame** `Email-Login/The Vow`
* **App file** see the Comparison table below

## Transcription — `The Vow`

Source `UI Final 1/project/Email Login.dc.html`, frame `The-Vow.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#FFFFFF  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  left:0  right:0  top:130px  color:#1D1C1A  font-size:22px  font-weight:500  letter-spacing:0.1px  text-align:center
    · The vow.
  <div> position:absolute  left:44px  right:44px  top:190px  color:#55534E  font-size:15.5px  font-weight:400  line-height:24px  text-align:center  text-wrap:pretty
    · I’m giving this twelve weeks. I don’t need to be perfect. When it gets hard, I’ll use the plan before I give in. If I have a bad day, I’ll come back the next day.
  <div> position:absolute  left:50%  top:316px  width:200px  height:200px  margin-left:-100px  background:radial-gradient(closest-side, rgba(226,186,120,0.38), rgba(226,186,120,0) 72%)  border-radius:50%  filter:blur(3px)
  <div> position:absolute  left:50%  top:342px  width:56px  height:56px  margin-left:-28px  background:radial-gradient(circle at 50% 38%, #F8E9CB, #EFD3A2 70%, #E3BE85 100%)  border-radius:50%  box-shadow:0 6px 18px rgba(226,186,120,0.45)
  <div> position:absolute  left:36px  right:36px  top:442px  height:142px
    <div> position:absolute  left:0  right:0  top:34px  display:flex  justify-content:center
      <span> transform:rotate(-3deg)  color:#1D1C1A  font-family:'Snell Roundhand','Savoye LET','Segoe Script',cursive  font-size:44px  line-height:1
        · Sam
    <div> position:absolute  left:14px  bottom:44px  color:#B0AEA8  font-size:14px
      · ×
    <div> position:absolute  left:12px  right:12px  bottom:40px  height:1.5px  background:rgba(0,0,0,0.24)
    <div> position:absolute  left:0  right:0  bottom:14px  color:#B0AEA8  font-size:12px  font-weight:500  text-align:center
      · Jun 9 · Day 0
  <div> position:absolute  left:24px  right:24px  top:688px  height:54px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:27px  cursor:pointer
    <span> color:#FFFFFF  font-size:17px  font-weight:600  letter-spacing:0.2px
      · I sign it
  <div> position:absolute  left:0  right:0  top:760px  color:#8B8882  font-size:15px  font-weight:500  text-align:center
    · Not now
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| “The vow.” | box · paint · type | 0, 130 · 393 × 26 · — · 22px/500/0.1px/normal/rgb(29, 28, 26) | identical | match |
| “I’m giving this twelve weeks. I don’t need to be” | box · paint · type | 44, 190 · 305 × 96 · — · 15.5px/400/normal/24px/rgb(85, 83, 78) | identical | match |
| div at 96.5, 316 | radius | 50% | - | **mismatch** |
| div at 168.5, 342 | radius | 50% | 28px | **mismatch** |
| div at 36, 442 | box · paint · type | 36, 442 · 321 × 142 · — · — | identical | match |
| div at 36, 476 | box · paint · type | 36, 476 · 321 × 44 · — · — | identical | match |
| “Sam” | box · paint | 158.7, 474.1 · 75.6 × 47.8 · — | *absent* | **mismatch** |
| “×” | box · paint · type | 50, 523.5 · 8.7 × 16.5 · — · 14px/400/normal/normal/rgb(176, 174, 168) | identical | match |
| div at 48, 542.5 | box · paint · type | 48, 542.5 · 297 × 1.5 · rgba(0, 0, 0, 0.24) · — | identical | match |
| “Jun 9 · Day 0” | box · paint | 36, 556 · 321 × 14 · — | *absent* | **mismatch** |
| div at 24, 688 | box · paint · type | 24, 688 · 345 × 54 · rgb(19, 19, 19) · r 27px · — | identical | match |
| “I sign it” | box · paint · type | 167.2, 705 · 58.7 × 20 · — · 17px/600/0.2px/normal/rgb(255, 255, 255) | identical | match |
| “Not now” | x | 0 | 167.5 | **mismatch** |
| “Not now” | width | 393 | 58.1 | **mismatch** |

**13 elements compared; 8 match, 5 differ.**
