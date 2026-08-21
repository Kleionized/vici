# Morning Check-in Time

* **Design frame** `Email-Login/Morning Check-in Time`
* **App file** see the Comparison table below

## Transcription — `Morning Check-in Time`

Source `UI Final 1/project/Email Login.dc.html`, frame `Morning-Check-in-Time.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  left:16px  top:64px  display:flex  align-items:center  gap:9px
    <svg> viewBox="0 0 11 19"  width="11"  height="19"
      <path> d="M9.5 1.5L2 9.5l7.5 8"  fill="none"  stroke="#55534E"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
    <span> color:#55534E  font-size:17px  font-weight:400
      · Back
  <div> position:absolute  left:0  right:0  top:132px  color:#1D1C1A  font-size:22px  font-weight:500  text-align:center
    · When should the morning check-in come?
  <div> position:absolute  left:0  right:0  top:208px  color:#2A2924  font-size:14.5px  font-weight:600  text-align:center
    · Select time
  <div> position:absolute  left:46px  top:335px  width:301px  height:44px  background:rgba(0,0,0,0.08)  border-radius:11px
  <div> position:absolute  left:105px  top:250px  width:40px  text-align:center
    <div> color:rgba(140,137,130,0.45)  font-size:20px  line-height:29px
      · 4
    <div> color:rgba(120,117,110,0.5)  font-size:21px  line-height:29px
      · 5
    <div> color:rgba(90,88,82,0.55)  font-size:22px  line-height:29px
      · 6
    <div> color:#1D1C1A  font-size:30px  line-height:44px
      · 7
    <div> color:rgba(90,88,82,0.55)  font-size:22px  line-height:29px
      · 8
    <div> color:rgba(120,117,110,0.5)  font-size:21px  line-height:29px
      · 9
    <div> color:rgba(140,137,130,0.45)  font-size:20px  line-height:29px
      · 10
  <div> position:absolute  left:172px  top:250px  width:50px  text-align:center
    <div> color:rgba(140,137,130,0.45)  font-size:20px  line-height:29px
      · 57
    <div> color:rgba(120,117,110,0.5)  font-size:21px  line-height:29px
      · 58
    <div> color:rgba(90,88,82,0.55)  font-size:22px  line-height:29px
      · 59
    <div> color:#1D1C1A  font-size:30px  line-height:44px
      · 00
    <div> color:rgba(90,88,82,0.55)  font-size:22px  line-height:29px
      · 01
    <div> color:rgba(120,117,110,0.5)  font-size:21px  line-height:29px
      · 02
    <div> color:rgba(140,137,130,0.45)  font-size:20px  line-height:29px
      · 03
  <div> position:absolute  left:238px  top:337px  width:60px  text-align:center
    <div> color:#1D1C1A  font-size:30px  line-height:44px
      · AM
    <div> color:rgba(90,88,82,0.55)  font-size:22px  line-height:29px
      · PM
  <div> position:absolute  left:0  right:0  top:508px  color:#2A2924  font-size:14.5px  font-weight:600  text-align:center
    · Select days
  <div> position:absolute  left:34px  right:34px  top:548px  display:flex  justify-content:space-between
    <div> width:38px  height:38px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:50%  color:#F4F3F0  font-size:14px  font-weight:600
      · Su
    <div> width:38px  height:38px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:50%  color:#F4F3F0  font-size:14px  font-weight:600
      · M
    <div> width:38px  height:38px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:50%  color:#F4F3F0  font-size:14px  font-weight:600
      · Tu
    <div> width:38px  height:38px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:50%  color:#F4F3F0  font-size:14px  font-weight:600
      · W
    <div> width:38px  height:38px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:50%  color:#F4F3F0  font-size:14px  font-weight:600
      · Th
    <div> width:38px  height:38px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:50%  color:#F4F3F0  font-size:14px  font-weight:600
      · F
    <div> width:38px  height:38px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:50%  color:#F4F3F0  font-size:14px  font-weight:600
      · Sa
  <div> position:absolute  left:16px  top:744px  width:361px  height:48px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:25px  cursor:pointer
    <span> color:#FFFFFF  font-size:17.5px  font-weight:600  letter-spacing:0.2px
      · Save time
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at 16, 64 | box · paint | 16, 64 · 57.6 × 20 · — | *absent* | **mismatch** |
| svg at 16, 64.5 | box · paint · type | 16, 64.5 · 11 × 19 · — · — | identical | match |
| path at 18, 66 | box · paint · type | 18, 66 · 7.5 × 16 · — · — | identical | match |
| “Back” | box · paint · type | 36, 64 · 37.6 × 20 · — · 17px/400/normal/normal/rgb(85, 83, 78) | identical | match |
| “When should the morning check-in come?” | box · paint · type | 0, 132 · 393 × 52 · — · 22px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| “Select time” | box · paint · type | 0, 208 · 393 × 17 · — · 14.5px/600/normal/normal/rgb(42, 41, 36) | identical | match |
| div at 46, 335 | box · paint · type | 46, 335 · 301 × 44 · rgba(0, 0, 0, 0.08) · r 11px · — | identical | match |
| div at 105, 250 | box · paint · type | 105, 250 · 40 × 218 · — · — | identical | match |
| “4” | x | 105 | 118.9 | **mismatch** |
| “4” | width | 40 | 12.2 | **mismatch** |
| “5” | x | 105 | 118.8 | **mismatch** |
| “5” | width | 40 | 12.4 | **mismatch** |
| “6” | x | 105 | 118.2 | **mismatch** |
| “6” | width | 40 | 13.5 | **mismatch** |
| “7” | x | 105 | 116.6 | **mismatch** |
| “7” | width | 40 | 16.8 | **mismatch** |
| “8” | x | 105 | 118.3 | **mismatch** |
| “8” | width | 40 | 13.3 | **mismatch** |
| “9” | x | 105 | 118.6 | **mismatch** |
| “9” | width | 40 | 12.9 | **mismatch** |
| “10” | x | 105 | 114.6 | **mismatch** |
| “10” | width | 40 | 20.8 | **mismatch** |
| div at 172, 250 | box · paint · type | 172, 250 · 50 × 218 · — · — | identical | match |
| “57” | x | 172 | 185.7 | **mismatch** |
| “57” | width | 50 | 22.6 | **mismatch** |
| “58” | x | 172 | 184.5 | **mismatch** |
| “58” | width | 50 | 25.1 | **mismatch** |
| “59” | x | 172 | 183.8 | **mismatch** |
| “59” | width | 50 | 26.5 | **mismatch** |
| “00” | x | 172 | 178.4 | **mismatch** |
| “00” | width | 50 | 37.2 | **mismatch** |
| “01” | x | 172 | 185.5 | **mismatch** |
| “01” | width | 50 | 22.9 | **mismatch** |
| “02” | x | 172 | 184.7 | **mismatch** |
| “02” | width | 50 | 24.6 | **mismatch** |
| “03” | x | 172 | 185 | **mismatch** |
| “03” | width | 50 | 24 | **mismatch** |
| div at 238, 337 | box · paint | 238, 337 · 60 × 73 · — | *absent* | **mismatch** |
| “AM” | x | 238 | 245.6 | **mismatch** |
| “AM” | width | 60 | 44.8 | **mismatch** |
| “PM” | x | 238 | 252.2 | **mismatch** |
| “PM” | width | 60 | 31.5 | **mismatch** |
| “Select days” | box · paint · type | 0, 508 · 393 × 17 · — · 14.5px/600/normal/normal/rgb(42, 41, 36) | identical | match |
| div at 34, 548 | box · paint | 34, 548 · 325 × 38 · — | *absent* | **mismatch** |
| “Su” | x | 34 | 44.2 | **mismatch** |
| “Su” | y | 548 | 558.8 | **mismatch** |
| “Su” | width | 38 | 17.6 | **mismatch** |
| “Su” | height | 38 | 16.5 | **mismatch** |
| “Su” | background | rgb(19, 19, 19) | - | **mismatch** |
| “Su” | radius | 50% | - | **mismatch** |
| “M” | x | 81.8 | 94.6 | **mismatch** |
| “M” | y | 548 | 558.8 | **mismatch** |
| “M” | width | 38 | 12.4 | **mismatch** |
| “M” | height | 38 | 16.5 | **mismatch** |
| “M” | background | rgb(19, 19, 19) | - | **mismatch** |
| “M” | radius | 50% | - | **mismatch** |
| “Tu” | x | 129.7 | 140.4 | **mismatch** |
| “Tu” | y | 548 | 558.8 | **mismatch** |
| “Tu” | width | 38 | 16.6 | **mismatch** |
| “Tu” | height | 38 | 16.5 | **mismatch** |
| “Tu” | background | rgb(19, 19, 19) | - | **mismatch** |
| “Tu” | radius | 50% | - | **mismatch** |
| “W” | x | 177.5 | 189.6 | **mismatch** |
| “W” | y | 548 | 558.8 | **mismatch** |
| “W” | width | 38 | 13.8 | **mismatch** |
| “W” | height | 38 | 16.5 | **mismatch** |
| “W” | background | rgb(19, 19, 19) | - | **mismatch** |
| “W” | radius | 50% | - | **mismatch** |
| “Th” | x | 225.3 | 235.6 | **mismatch** |
| “Th” | y | 548 | 558.8 | **mismatch** |
| “Th” | width | 38 | 17.5 | **mismatch** |
| “Th” | height | 38 | 16.5 | **mismatch** |
| “Th” | background | rgb(19, 19, 19) | - | **mismatch** |
| “Th” | radius | 50% | - | **mismatch** |
| “F” | x | 273.2 | 288.1 | **mismatch** |
| “F” | y | 548 | 558.8 | **mismatch** |
| “F” | width | 38 | 8.1 | **mismatch** |
| “F” | height | 38 | 16.5 | **mismatch** |
| “F” | background | rgb(19, 19, 19) | - | **mismatch** |
| “F” | radius | 50% | - | **mismatch** |
| “Sa” | x | 321 | 331.5 | **mismatch** |
| “Sa” | y | 548 | 558.8 | **mismatch** |
| “Sa” | width | 38 | 17 | **mismatch** |
| “Sa” | height | 38 | 16.5 | **mismatch** |
| “Sa” | background | rgb(19, 19, 19) | - | **mismatch** |
| “Sa” | radius | 50% | - | **mismatch** |
| div at 16, 744 | box · paint | 16, 744 · 361 × 48 · rgb(19, 19, 19) · r 25px | *absent* | **mismatch** |
| “Save time” | y | 757.8 | 791.8 | **mismatch** |

**37 elements compared; 9 match, 28 differ.**
