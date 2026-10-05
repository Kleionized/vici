# Enlisting Aegis

* **Design frame** `Email-Login/Enlisting Aegis`
* **App file** src/components/onboarding/tail.tsx + src/content/onboardingTail.ts

> **Re-emitted for `Latest Vici FULL` (Sep 2026).** The transcription block below is this
> drop's frame, emitted by `scripts/vicifull/spec.mjs`. **The comparison table and the
> resolutions under it were written against the PREVIOUS drop** and have not been re-measured
> row by row: where the two disagree the transcription is the frame and wins. Do not "correct"
> the app back to a row in the old table — several of them quote copy this drop withdrew
> (`Several times a day`, `What does it interfere with most?`). Re-measuring them belongs to
> F10's renumbering pass.

## Transcription — `Enlisting Aegis`

Source `Latest Vici FULL/project/Email Login.dc.html`, frame `Enlisting-Aegis.html`. Emitted by `scripts/vicifull/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  background:linear-gradient(180deg, #131313 0%, #2A2924 26%, #6E7069 52%, #C9C8C4 74%, #FFFFFF 100%)
  <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.12  pointer-events:none
  <div> position:absolute  left:0  right:0  top:150px  color:rgba(244,243,240,0.8)  font-size:15px  font-weight:400  text-align:center
    · Putting your plan together…
  <div> position:absolute  left:41px  top:177px  width:311px  height:3px  background:rgba(244,243,240,0.25)  border-radius:2px
    <div> position:absolute  left:0  top:0  width:186px  height:3px  background:#F4F3F0  border-radius:2px
  <div> position:absolute  left:0  right:0  top:262px  display:flex  flex-direction:column  align-items:center  gap:16px
    <div> display:flex  align-items:center  gap:10px
      <svg> viewBox="0 0 15 15"  width="15"  height="15"
        <path> d="M2.5 8l3.2 3.2L12.5 4"  fill="none"  stroke="#F4F3F0"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
      <span> color:#F4F3F0  font-size:15.5px  font-weight:500
        · Finding where you usually struggle
    <div> display:flex  align-items:center  gap:10px
      <svg> viewBox="0 0 15 15"  width="15"  height="15"
        <path> d="M2.5 8l3.2 3.2L12.5 4"  fill="none"  stroke="#F4F3F0"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
      <span> color:#F4F3F0  font-size:15.5px  font-weight:500
        · Looking at what tends to set it off
    <div> display:flex  align-items:center  gap:10px
      <div> width:13px  height:13px  box-sizing:border-box  border:2px solid rgba(244,243,240,0.55)  border-radius:50%  border-top-color:transparent
      <span> color:rgba(244,243,240,0.75)  font-size:15.5px  font-weight:500
        · Choosing where to start
  <div> position:absolute  left:20px  right:20px  top:434px  color:#2A2924  font-size:20px  font-weight:500  letter-spacing:0.1px  line-height:31px  text-align:center  text-wrap:pretty
  <div> position:absolute  left:-3px  top:563px  width:399px  height:399px  background:#FFFFFF  border-radius:50%  box-shadow:0 -20px 70px rgba(255,255,255,0.6)  overflow:hidden
    <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.08
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| “Putting your plan together…” | box · paint · type | 0, 150 · 393 × 17.5 · — · 15px/400/normal/normal/rgba(244, 243, 240, 0.8) | identical | match |
| div at 41, 177 | box · paint · type | 41, 177 · 311 × 3 · rgba(244, 243, 240, 0.25) · r 2px · — | identical | match |
| div at 41, 177 | box · paint · type | 41, 177 · 186 × 3 · rgb(244, 243, 240) · r 2px · — | identical | match |
| div at 0, 262 | box · paint · type | 0, 262 · 393 × 87.5 · — · — | identical | match |
| div at 58, 262 | box · paint · type | 58, 262 · 276.9 × 18.5 · — · — | identical | match |
| svg at 58, 263.8 | box · paint · type | 58, 263.8 · 15 × 15 · — · — | identical | match |
| path at 60.5, 267.8 | box · paint · type | 60.5, 267.8 · 10 × 7.2 · — · — | identical | match |
| “Looking at when it usually happens” | box · paint · type | 83, 262 · 251.9 × 18.5 · — · 15.5px/500/normal/normal/rgb(244, 243, 240) | identical | match |
| div at 22.7, 296.5 | box · paint · type | 22.7, 296.5 · 347.7 × 18.5 · — · — | identical | match |
| svg at 22.7, 298.3 | box · paint · type | 22.7, 298.3 · 15 × 15 · — · — | identical | match |
| path at 25.2, 302.3 | box · paint · type | 25.2, 302.3 · 10 × 7.2 · — · — | identical | match |
| “Looking at what usually comes right before it” | box · paint · type | 47.7, 296.5 · 322.7 × 18.5 · — · 15.5px/500/normal/normal/rgb(244, 243, 240) | identical | match |
| div at 100.7, 331 | box · paint · type | 100.7, 331 · 191.7 × 18.5 · — · — | identical | match |
| div at 100.7, 333.8 | radius | 50% | 6.5px | **mismatch** |
| “Building your first week” | box · paint · type | 123.7, 331 · 168.7 × 18.5 · — · 15.5px/500/normal/normal/rgba(244, 243, 240, 0.75) | identical | match |
| div at 20, 434 | box · paint | 20, 434 · 353 × 0 · — | *absent* | **mismatch** |
| div at -3, 563 | radius | 50% | 199.5px | **mismatch** |
| div at -3, 563 | opacity | 0.08 | - | **mismatch** |

**18 elements compared; 14 match, 4 differ.**

## Resolutions

* The board draws no control at all — it hands over on its own. The app keeps its own 6.8s hold
  and the canvas's three checklist rows, two ticked and the third on a 13pt ring whose top edge is
  cut away (a spinner frozen at one frame).
* The frame carries a `20px/500` line at y 434 with **no words in it**; the app renders no empty
  element for it.
* The 399pt white disc rising off the bottom edge, its `0 -20px 70px rgba(255,255,255,0.6)` glow
  and its 0.08 grain are all drawn. `radius: 50% → 199.5px` and the grain's opacity level are the
  equivalences of `DECISIONS.md` D015 and D019.
