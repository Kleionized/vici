# Onboarding Start

* **Design frame** `Email-Login/Onboarding Start`
* **App file** src/components/onboarding/v3.tsx (O3FunnelStep) + src/content/onboardingFunnel.ts

> **Re-emitted for `Latest Vici FULL` (Sep 2026).** The transcription block below is this
> drop's frame, emitted by `scripts/vicifull/spec.mjs`. **The comparison table and the
> resolutions under it were written against the PREVIOUS drop** and have not been re-measured
> row by row: where the two disagree the transcription is the frame and wins. Do not "correct"
> the app back to a row in the old table — several of them quote copy this drop withdrew
> (`Several times a day`, `What does it interfere with most?`). Re-measuring them belongs to
> F10's renumbering pass.

## Transcription — `Onboarding Start`

Source `Latest Vici FULL/project/Email Login.dc.html`, frame `Onboarding-Start.html`. Emitted by `scripts/vicifull/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:linear-gradient(180deg, rgb(15,15,13) 0%, rgb(26,25,23) 100%)  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  overflow:hidden  pointer-events:none
    <div> position:absolute  left:-40px  top:-140px  width:540px  height:270px  background:radial-gradient(closest-side, rgba(180,170,150,0.14), rgba(19,19,19,0) 72%)  border-radius:50%  filter:blur(6px)
    <div> position:absolute  left:50%  bottom:-231px  width:420px  height:420px  margin-left:-210px  background:radial-gradient(closest-side, rgba(255,236,196,0.10), rgba(255,236,196,0.05) 45%, rgba(255,236,196,0) 72%)  border-radius:50%
    <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.12
  <div> position:absolute  left:24px  right:24px  top:66px  height:4px  background:rgba(255,255,255,0.2)  border-radius:2px
    <div> position:absolute  left:0  top:0  width:4%  height:4px  background:#F4F3F0  border-radius:2px
  <div> position:absolute  left:16px  top:94px  display:flex  align-items:center  gap:9px
    <svg> viewBox="0 0 11 19"  width="11"  height="19"
      <path> d="M9.5 1.5L2 9.5l7.5 8"  fill="none"  stroke="rgba(244,243,240,0.75)"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
    <span> color:rgba(244,243,240,0.75)  font-size:17px  font-weight:400
      · Back
  <div> position:absolute  left:0  right:0  top:308px  color:rgba(244,243,240,0.55)  font-size:13px  font-weight:600  letter-spacing:0.3px  text-align:center
  <div> position:absolute  left:36px  right:36px  top:338px  color:#F4F3F0  font-size:26px  font-weight:500  letter-spacing:-0.2px  line-height:1.3  text-align:center  text-wrap:balance
    · Sam, let’s figure out what usually leads you back to porn.
  <div> position:absolute  left:44px  right:44px  top:466px  color:rgba(244,243,240,0.7)  font-size:15.5px  font-weight:400  line-height:24px  text-align:center  text-wrap:pretty
    · It’ll take about two minutes. Then we’ll show you what we’d change first.
  <div> position:absolute  left:24px  right:24px  top:744px  height:56px  display:flex  align-items:center  justify-content:center  background:#F4F3F0  border-radius:28px  cursor:pointer
    <span> color:#131313  font-size:16.5px  font-weight:600
      · Start
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at -40, -140 | radius | 50% | - | **mismatch** |
| div at -13.5, 663 | radius | 50% | - | **mismatch** |
| div at 24, 66 | box · paint · type | 24, 66 · 345 × 4 · rgba(255, 255, 255, 0.2) · r 2px · — | identical | match |
| div at 24, 66 | box · paint · type | 24, 66 · 13.8 × 4 · rgb(244, 243, 240) · r 2px · — | identical | match |
| div at 16, 94 | box · paint · type | 16, 94 · 57.6 × 20 · — · — | identical | match |
| svg at 16, 94.5 | box · paint · type | 16, 94.5 · 11 × 19 · — · — | identical | match |
| path at 18, 96 | box · paint · type | 18, 96 · 7.5 × 16 · — · — | identical | match |
| “Back” | box · paint · type | 36, 94 · 37.6 × 20 · — · 17px/400/normal/normal/rgba(244, 243, 240, 0.75) | identical | match |
| div at 0, 308 | box · paint | 0, 308 · 393 × 0 · — | *absent* | **mismatch** |
| “Sam, let’s work out when this usually happens.” | box · paint | 36, 338 · 321 × 67.6 · — | *absent* | **mismatch** |
| “It takes about two minutes. Then you’ll see what” | box · paint · type | 44, 434 · 305 × 48 · — · 15.5px/400/normal/24px/rgba(244, 243, 240, 0.7) | identical | match |
| div at 24, 744 | box · paint · type | 24, 744 · 345 × 56 · rgb(244, 243, 240) · r 28px · — | identical | match |
| “Start” | box · paint · type | 177.1, 762.3 · 38.7 × 19.5 · — · 16.5px/600/normal/normal/rgb(19, 19, 19) | identical | match |

**13 elements compared; 9 match, 4 differ.**

## Resolutions

* **"Sam"** — the canvas writes a sample name into this screen's title. The app writes the name the
  man gave three screens earlier and falls back to the canvas's own text when there is none. The
  comparison ran with `Marcus`, so the title reads as one row missing and one extra: same box
  (36, 338 · 321 × 67.6), same metrics (26px/500/−0.2px/33.8px), different name.
* **The empty eyebrow** — the frame carries a `13px/600/0.3px` eyebrow div at `top:308` with **no
  text in it**. It has zero height and paints nothing; the app does not render an empty element.
* The two `radius: 50% → -` rows are the background washes — `DECISIONS.md` D015.
