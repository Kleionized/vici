# V3 Q26 Gender

* **Design frame** `Email-Login/V3 Q26 Gender`
* **App file** src/components/onboarding/v3.tsx (O3FunnelStep) + src/content/onboardingFunnel.ts

> **Re-emitted for `Latest Vici FULL` (Sep 2026).** The transcription block below is this
> drop's frame, emitted by `scripts/vicifull/spec.mjs`. **The comparison table and the
> resolutions under it were written against the PREVIOUS drop** and have not been re-measured
> row by row: where the two disagree the transcription is the frame and wins. Do not "correct"
> the app back to a row in the old table — several of them quote copy this drop withdrew
> (`Several times a day`, `What does it interfere with most?`). Re-measuring them belongs to
> F10's renumbering pass.

## Transcription — `V3 Q26 Gender`

Source `Latest Vici FULL/project/Email Login.dc.html`, frame `V3-Q26-Gender.html`. Emitted by `scripts/vicifull/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:linear-gradient(180deg, rgb(38,38,36) 0%, rgb(61,60,58) 100%)  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  overflow:hidden  pointer-events:none
    <div> position:absolute  left:-40px  top:-140px  width:540px  height:270px  background:radial-gradient(closest-side, rgba(180,170,150,0.14), rgba(19,19,19,0) 72%)  border-radius:50%  filter:blur(6px)
    <div> position:absolute  left:50%  bottom:-352px  width:640px  height:640px  margin-left:-320px  background:radial-gradient(closest-side, rgba(255,236,196,0.56), rgba(255,236,196,0.25) 45%, rgba(255,236,196,0) 72%)  border-radius:50%
    <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.12
  <div> position:absolute  left:24px  right:24px  top:66px  height:4px  background:rgba(255,255,255,0.2)  border-radius:2px
    <div> position:absolute  left:0  top:0  width:100%  height:4px  background:#F4F3F0  border-radius:2px
  <div> position:absolute  left:16px  top:94px  display:flex  align-items:center  gap:9px
    <svg> viewBox="0 0 11 19"  width="11"  height="19"
      <path> d="M9.5 1.5L2 9.5l7.5 8"  fill="none"  stroke="rgba(244,243,240,0.75)"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
    <span> color:rgba(244,243,240,0.75)  font-size:17px  font-weight:400
      · Back
  <div> position:absolute  left:44px  right:44px  top:158px  color:#F4F3F0  font-size:22px  font-weight:500  letter-spacing:0.1px  line-height:1.32  text-align:center  text-wrap:pretty
    · How do you describe your gender?
  <div> position:absolute  left:24px  right:24px  top:310px  height:60px  padding:0 22px  display:flex  align-items:center  justify-content:space-between  gap:12px  background:#F4F3F0  border-radius:16px  box-shadow:0 0 0 1px rgba(0,0,0,0)
    <span> color:#131313  font-size:17px  font-weight:500  line-height:20px
      · Male
    <svg> viewBox="0 0 16 12"  width="16"  height="12"
      <path> d="M1.5 6l4.4 4.5L14.5 1.5"  fill="none"  stroke="#131313"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
  <div> position:absolute  left:24px  right:24px  top:384px  height:60px  padding:0 22px  display:flex  align-items:center  justify-content:space-between  gap:12px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.22)
    <span> color:#F4F3F0  font-size:17px  font-weight:500  line-height:20px
      · Female
  <div> position:absolute  left:24px  right:24px  top:458px  height:60px  padding:0 22px  display:flex  align-items:center  justify-content:space-between  gap:12px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.22)
    <span> color:#F4F3F0  font-size:17px  font-weight:500  line-height:20px
      · Non-binary
  <div> position:absolute  left:24px  right:24px  top:532px  height:60px  padding:0 22px  display:flex  align-items:center  justify-content:space-between  gap:12px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.22)
    <span> color:#F4F3F0  font-size:17px  font-weight:500  line-height:20px
      · Another identity
  <div> position:absolute  left:24px  right:24px  top:606px  height:60px  padding:0 22px  display:flex  align-items:center  justify-content:space-between  gap:12px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.22)
    <span> color:#F4F3F0  font-size:17px  font-weight:500  line-height:20px
      · Prefer not to say
  <div> position:absolute  left:24px  right:24px  top:744px  height:58px  display:flex  align-items:center  justify-content:center  background:#F4F3F0  border-radius:29px  cursor:pointer
    <span> color:#131313  font-size:17px  font-weight:600  letter-spacing:0.2px
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
| div at -123.5, 564 | radius | 50% | - | **mismatch** |
| div at 24, 66 | box · paint · type | 24, 66 · 345 × 4 · rgba(255, 255, 255, 0.2) · r 2px · — | identical | match |
| div at 24, 66 | box · paint · type | 24, 66 · 345 × 4 · rgb(244, 243, 240) · r 2px · — | identical | match |
| div at 16, 94 | box · paint · type | 16, 94 · 57.6 × 20 · — · — | identical | match |
| svg at 16, 94.5 | box · paint · type | 16, 94.5 · 11 × 19 · — · — | identical | match |
| path at 18, 96 | box · paint · type | 18, 96 · 7.5 × 16 · — · — | identical | match |
| “Back” | box · paint · type | 36, 94 · 37.6 × 20 · — · 17px/400/normal/normal/rgba(244, 243, 240, 0.75) | identical | match |
| “How do you describe your gender?” | box · paint · type | 44, 158 · 305 × 58.1 · — · 22px/500/0.1px/29.04px/rgb(244, 243, 240) | identical | match |
| div at 24, 310 | box · paint · type | 24, 310 · 345 × 60 · rgb(244, 243, 240) · r 16px · rgba(0, 0, 0, 0) 0px 0px 0px 1px · — | identical | match |
| “Male” | box · paint · type | 46, 330 · 37.3 × 20 · — · 17px/500/normal/20px/rgb(19, 19, 19) | identical | match |
| svg at 331, 334 | box · paint · type | 331, 334 · 16 × 12 · — · — | identical | match |
| path at 332.5, 335.5 | box · paint · type | 332.5, 335.5 · 13 × 9 · — · — | identical | match |
| div at 24, 384 | box · paint · type | 24, 384 · 345 × 60 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.22) 0px 0px 0px 1px · — | identical | match |
| “Female” | box · paint · type | 46, 404 · 56.3 × 20 · — · 17px/500/normal/20px/rgb(244, 243, 240) | identical | match |
| div at 24, 458 | box · paint · type | 24, 458 · 345 × 60 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.22) 0px 0px 0px 1px · — | identical | match |
| “Non-binary” | box · paint · type | 46, 478 · 88.2 × 20 · — · 17px/500/normal/20px/rgb(244, 243, 240) | identical | match |
| div at 24, 532 | box · paint · type | 24, 532 · 345 × 60 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.22) 0px 0px 0px 1px · — | identical | match |
| “Another identity” | box · paint · type | 46, 552 · 125.3 × 20 · — · 17px/500/normal/20px/rgb(244, 243, 240) | identical | match |
| div at 24, 606 | box · paint · type | 24, 606 · 345 × 60 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.22) 0px 0px 0px 1px · — | identical | match |
| “Prefer not to say” | box · paint · type | 46, 626 · 128.1 × 20 · — · 17px/500/normal/20px/rgb(244, 243, 240) | identical | match |
| div at 24, 744 | box · paint · type | 24, 744 · 345 × 58 · rgb(244, 243, 240) · r 29px · — | identical | match |
| “Continue” | box · paint · type | 159.7, 763 · 73.7 × 20 · — · 17px/600/0.2px/normal/rgb(19, 19, 19) | identical | match |

**23 elements compared; 21 match, 2 differ.**

## Resolutions

The canvas draws `Male` selected. The comparison was run with `Male` selected in the app so both
sides measure the same state; the selected pill is `#F4F3F0` with `#131313` text, a 16 × 12 tick at
x 331, and a 1px ring at zero alpha, all of which match. The two remaining rows are the background
washes — `DECISIONS.md` D015.
