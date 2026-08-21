# Paywall Confirmed

* **Design frame** `Email-Login/Paywall Confirmed`
* **App file** see the Comparison table below

## Transcription — `Paywall Confirmed`

Source `UI Final 1/project/Email Login.dc.html`, frame `Paywall-Confirmed.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.07  pointer-events:none
  <div> position:absolute  left:50%  bottom:-300px  width:560px  height:560px  margin-left:-280px  background:radial-gradient(closest-side, rgba(255,236,196,0.44), rgba(255,236,196,0.2) 45%, rgba(255,236,196,0) 72%)  border-radius:50%  pointer-events:none
  <div> position:absolute  left:0  right:0  top:296px  display:flex  justify-content:center
    <div> width:84px  height:84px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:50%  box-shadow:0 14px 30px rgba(40,38,32,0.3)
      <svg> viewBox="0 0 24 24"  width="34"  height="34"  fill="none"
        <path> d="M4.5 12.5l4.8 4.8L19.5 6.8"  stroke="#F4F3F0"  stroke-width="2.6"  stroke-linecap="round"  stroke-linejoin="round"
  <div> position:absolute  left:0  right:0  top:414px  color:#1D1C1A  font-size:28px  font-weight:500  letter-spacing:-0.2px  text-align:center
    · We're in, Sam.
  <div> position:absolute  left:56px  right:56px  top:466px  color:#55534E  font-size:14.5px  font-weight:400  line-height:22px  text-align:center  text-wrap:pretty
    · Let's take the first ground. Nothing is charged until Jul 24 — cancelling is one tap in Settings.
  <div> position:absolute  left:24px  right:24px  bottom:96px  height:58px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:29px  cursor:pointer
    <span> color:#FFFFFF  font-size:17px  font-weight:600  letter-spacing:0.2px
      · Begin Day I
  <div> position:absolute  left:0  right:0  bottom:60px  color:#8B8882  font-size:12px  font-weight:400  text-align:center
    · Receipt sent to sam@hey.com
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at -83.5, 592 | radius | 50% | - | **mismatch** |
| div at 0, 296 | box · paint · type | 0, 296 · 393 × 84 · — · — | identical | match |
| div at 154.5, 296 | radius | 50% | 42px | **mismatch** |
| svg at 179.5, 321 | box · paint · type | 179.5, 321 · 34 × 34 · — · — | identical | match |
| path at 185.9, 330.6 | box · paint · type | 185.9, 330.6 · 21.3 × 14.9 · — · — | identical | match |
| “We're in, Sam.” | box · paint | 0, 414 · 393 × 33 · — | *absent* | **mismatch** |
| “Let's take the first ground. Nothing is charged ” | box · paint | 56, 466 · 281 × 66 · — | *absent* | **mismatch** |
| div at 24, 698 | background | rgb(19, 19, 19) | - | **mismatch** |
| div at 24, 698 | radius | 29px | - | **mismatch** |
| “Begin Day I” | box · paint · type | 151, 717 · 91 × 20 · — · 17px/600/0.2px/normal/rgb(255, 255, 255) | identical | match |
| “Receipt sent to sam@hey.com” | box · paint | 0, 778 · 393 × 14 · — | *absent* | **mismatch** |

**10 elements compared; 4 match, 6 differ.**
