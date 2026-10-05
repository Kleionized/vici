# V3 Q24 Name

* **Design frame** `Email-Login/V3 Q24 Name`
* **App file** src/components/onboarding/v3.tsx (O3FunnelStep) + src/content/onboardingFunnel.ts

> **Re-emitted for `Latest Vici FULL` (Sep 2026).** The transcription block below is this
> drop's frame, emitted by `scripts/vicifull/spec.mjs`. **The comparison table and the
> resolutions under it were written against the PREVIOUS drop** and have not been re-measured
> row by row: where the two disagree the transcription is the frame and wins. Do not "correct"
> the app back to a row in the old table — several of them quote copy this drop withdrew
> (`Several times a day`, `What does it interfere with most?`). Re-measuring them belongs to
> F10's renumbering pass.

## Transcription — `V3 Q24 Name`

Source `Latest Vici FULL/project/Email Login.dc.html`, frame `V3-Q24-Name.html`. Emitted by `scripts/vicifull/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:linear-gradient(180deg, rgb(36,36,34) 0%, rgb(59,58,56) 100%)  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
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
    · What should we call you?
  <div> position:absolute  left:44px  right:44px  top:200px  color:rgba(244,243,240,0.6)  font-size:13.5px  font-weight:400  line-height:20px  text-align:center  text-wrap:pretty
    · All your data will be encrypted.
  <div> position:absolute  left:24px  right:24px  top:281px  height:60px  padding:0 22px  display:flex  align-items:center  gap:3px  background:rgba(255,255,255,0.07)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.22)
    <div> width:2px  height:22px  background:#F4F3F0  border-radius:1px
    <span> color:rgba(244,243,240,0.45)  font-size:17px  font-weight:400
      · Your name
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
| div at 16, 94 | box · paint | 16, 94 · 57.6 × 20 · — | *absent* | **mismatch** |
| svg at 16, 94.5 | box · paint | 16, 94.5 · 11 × 19 · — | *absent* | **mismatch** |
| path at 18, 96 | box · paint | 18, 96 · 7.5 × 16 · — | *absent* | **mismatch** |
| “Back” | box · paint | 36, 94 · 37.6 × 20 · — | *absent* | **mismatch** |
| “What should we call you?” | box · paint · type | 44, 158 · 305 × 29 · — · 22px/500/0.1px/29.04px/rgb(244, 243, 240) | identical | match |
| div at 24, 281 | box · paint · type | 24, 281 · 345 × 60 · rgba(255, 255, 255, 0.07) · r 16px · rgba(255, 255, 255, 0.22) 0px 0px 0px 1px · — | identical | match |
| div at 46, 300 | box · paint · type | 46, 300 · 2 × 22 · rgb(244, 243, 240) · r 1px · — | identical | match |
| “Your name” | box · paint | 51, 301 · 80.9 × 20 · — | *absent* | **mismatch** |
| div at 24, 744 | box · paint · type | 24, 744 · 345 × 58 · rgb(244, 243, 240) · r 29px · — | identical | match |
| “Continue” | box · paint · type | 159.7, 763 · 73.7 × 20 · — · 17px/600/0.2px/normal/rgb(19, 19, 19) | identical | match |

**14 elements compared; 7 match, 7 differ.**

## Resolutions

* **Back row** — the canvas draws it at `left:16, top:94` and **the app now draws it**, on this
  frame as on every other funnel frame. `DECISIONS.md` **D122 supersedes D016**, which had left it
  off because the auth stack redirected a signed-in man straight back out and the control would
  have looped: `(auth)/_layout.tsx` now exempts a man whose onboarding is incomplete, so Back from
  here leaves at `/sign-in` — `02 · Login`, the board the account was made on. Measured after:
  0 blocks over 4/255 on the whole frame below the status-bar chrome.
* **"Your name"** — the canvas draws the placeholder as a `<span>` at x 51; the app draws a
  `TextInput` whose box starts at exactly x 51 and whose `placeholder` is the canvas's own string.
  A DOM placeholder has no element of its own for the probe to measure, so it reads as one row
  missing and one input row extra at the same x.
* **The caret bar** — the canvas's 2 × 22 `#F4F3F0` bar is a static frame's stand-in for a caret.
  It is drawn in flow ahead of the field with the row's own `gap: 3px`, and fades to zero once
  there is a value so the native caret can take over without anything shifting.
* The two `radius: 50% → -` rows are the background washes — `DECISIONS.md` D015.
