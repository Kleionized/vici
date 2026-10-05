# 31 · If Nothing Changes

* **Design frame** `Email-Login/Cost By Age 80` — `.vicifull/final/Email-Login/Cost-By-Age-80.html`
* **Design badge** `31 · If Nothing Changes` (`.vicifull/FLOW.txt`, which the run's brief makes the
  authority on badges). The group lists this run was cut on call the same frame **#35**; this
  drop renumbered onboarding, so the two schemes disagree and both appear in the codebase. This
  file names the badge.
* **Status in `Latest Vici FULL`** changed, 29 diff lines
* **App files** `src/components/onboarding/tail.tsx` (`O3IfNothingChanges`) + `src/content/onboardingTail.ts`,
  wired from `src/app/(onboarding)/welcome.tsx`

## Transcription — `Cost By Age 80`

Source `Latest Vici FULL/project/Email Login.dc.html`, frame `Cost-By-Age-80.html`. Emitted by `scripts/vicifull/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#060606  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  background-image:radial-gradient(circle 1.3px at 61px 132px, #FFFFFF 99%, rgba(255,255,255,0) 100%), radial-gradient(circle 1.3px at 287px 96px, #FFFFFF 99%, rgba(255,255,255,0) 100%), radial-gradient(circle 1.3px at 174px 214px, #FFFFFF 99%, rgba(255,255,255,0) 100%), radial-gradient(circle 1.3px at 329px 291px, #FFFFFF 99%, rgba(255,255,255,0) 100%), radial-gradient(circle 1.3px at 96px 348px, #FFFFFF 99%, rgba(255,255,255,0) 100%), radial-gradient(circle 1.3px at 244px 407px, #FFFFFF 99%, rgba(255,255,255,0) 100%), radial-gradient(circle 1.3px at 52px 489px, #FFFFFF 99%, rgba(255,255,255,0) 100%), radial-gradient(circle 1.3px at 331px 542px, #FFFFFF 99%, rgba(255,255,255,0) 100%), radial-gradient(circle 1.3px at 158px 596px, #FFFFFF 99%, rgba(255,255,255,0) 100%), radial-gradient(circle 1.3px at 262px 671px, #FFFFFF 99%, rgba(255,255,255,0) 100%), radial-gradient(circle 1.3px at 84px 703px, #FFFFFF 99%, rgba(255,255,255,0) 100%)  z-index:5  background-repeat:no-repeat
  <div> position:absolute  left:50%  bottom:120px  width:300px  padding:18px 24px 18px  box-sizing:border-box  background:rgba(19,19,19,0.82)  backdrop-filter:blur(12px)  border-radius:16px  box-shadow:0 0 0 1px rgba(255,255,255,0.16), 0 18px 44px rgba(0,0,0,0.5)  transform:translateX(-50%)  z-index:12  text-align:center  -webkit-backdrop-filter:blur(12px)
    <div> color:rgba(255,255,255,0.7)  font-size:15px  font-weight:500
      · By age 80
    <div> color:#FFFFFF  font-size:28px  font-weight:600  letter-spacing:-0.5px  margin-top:6px
      · About 6,100 days
    <div> color:rgba(255,255,255,0.6)  font-size:13px  line-height:18px  margin-top:8px
      · If nothing changes.
  <div> position:absolute  left:24px  right:24px  top:744px  height:58px  display:flex  align-items:center  justify-content:center  background:#FFFFFF  border-radius:29px  z-index:15  cursor:pointer
    <span> color:#131313  font-size:17px  font-weight:600  letter-spacing:0.2px
      · Next
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.vicifull/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at 46.5, 613 | background | rgba(19, 19, 19, 0.82) | - | **mismatch** |
| “By age 80” | box · paint · type | 70.5, 631 · 252 × 18 · — · 15px/500/normal/normal/rgba(255, 255, 255, 0.7) | identical | match |
| “About 6,100 days” | box · paint · type | 70.5, 655 · 252 × 33 · — · 28px/600/-0.5px/normal/rgb(255, 255, 255) | identical | match |
| “If nothing changes.” | box · paint · type | 70.5, 696 · 252 × 18 · — · 13px/400/normal/18px/rgba(255, 255, 255, 0.6) | identical | match |
| div at 24, 744 | box · paint · type | 24, 744 · 345 × 58 · rgb(255, 255, 255) · r 29px · — | identical | match |
| “Next” | box · paint · type | 177.5, 763 · 38 × 20 · — · 17px/600/0.2px/normal/rgb(19, 19, 19) | identical | match |

**6 elements compared; 5 match, 1 differ.**

## Resolutions

A night board: `#060606` flat, no field, eleven 1.3pt white stars at the frame's own points, and
the pill 120 off the bottom edge. The canvas paints the stars as eleven stacked
`radial-gradient(circle 1.3px at Xpx Ypx, #FFFFFF 99%, rgba(255,255,255,0) 100%)` layers on one
`background-image`; the app draws eleven `<Circle r={1.3}>` at the same centres (`AGE_80_STARS`).

The one row that differs is the pill's fill reading on the inner box rather than the clip that
carries its ring and shadow — the same composite, one level down (`DECISIONS.md` D018).

The day count is the app's arithmetic on the canvas's own numbers: 365 × 9/30 × (80 − age),
rounded to the nearest hundred, which reproduces the frame's "about 6,100 days" for its
twenty-four-year-old exactly. Driven with that account, the readout matches character for
character rather than being excused as sample data.

Whole-image: mean |Δ| 0.13/255, the lowest in the group after `A Clean Day`. The only pixels over
12/255 are ~16 per star: the canvas's gradient stop steps 99 % → 100 %, so Chrome paints the disc
into a background layer with no shape antialiasing, and the app's `<Circle>` has the normal kind.
Same centre, same 2.6pt diameter, different rim — a rasteriser difference of the D083 kind, not a
geometry or paint error.
