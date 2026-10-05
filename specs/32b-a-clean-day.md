# 32B · A Clean Day

* **Design frame** `Email-Login/A Clean Day` — `.vicifull/final/Email-Login/A-Clean-Day.html`
* **Design badge** `32B · A Clean Day` (`.vicifull/FLOW.txt`, which the run's brief makes the
  authority on badges). The group lists this run was cut on call the same frame **#37**; this
  drop renumbered onboarding, so the two schemes disagree and both appear in the codebase. This
  file names the badge.
* **Status in `Latest Vici FULL`** **ADDED** — new in this drop, no counterpart in any previous
  one, which is why no spec existed for it before this pass
* **Flow** `32 · Change the Line` → **32B · A Clean Day** → `33 · One Bad Day`
* **App files** `src/components/onboarding/tail.tsx` (`O3CleanDay`), wired from
  `src/app/(onboarding)/welcome.tsx` as step `clean-day`
* **Frame** 393 × 852, `background: #FFFFFF` — the one tail board with **no field at all**: no
  ground gradient, no corner bloom, no sun, no grain

## Transcription — `A Clean Day`

Source `Latest Vici FULL/project/Email Login.dc.html`, frame `A-Clean-Day.html`. Emitted by `scripts/vicifull/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#FFFFFF  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  left:76px  top:300px  width:240px  height:200px
    <div> position:absolute  inset:0  overflow:hidden
      <div> position:absolute  left:56px  top:0px  width:128px  height:128px  background:radial-gradient(closest-side,rgba(226,186,120,0.42),rgba(226,186,120,0) 74%)  border-radius:50%  filter:blur(4px)
      <div> position:absolute  left:90px  top:152px  width:60px  height:16px  background:rgba(0,0,0,0.10)  border-radius:50%  filter:blur(5px)
      <div> position:absolute  left:86px  top:112px  width:68px  height:46px  background:linear-gradient(180deg,#EDECE7,#E0DFDA)  border-radius:8px 8px 14px 14px
      <div> position:absolute  left:82px  top:106px  width:76px  height:12px  background:#F1EFE9  border-radius:6px
      <div> position:absolute  left:118px  top:52px  width:4px  height:60px  background:#8E8B84  border-radius:2px
      <div> position:absolute  left:120px  top:66px  width:36px  height:20px  background:#B9B5AC  border-radius:100% 0 100% 0  transform:rotate(-14deg)  transform-origin:0 50%
      <div> position:absolute  left:84px  top:78px  width:36px  height:20px  background:#C6C2B8  border-radius:0 100% 0 100%  transform:rotate(14deg)  transform-origin:100% 50%
      <div> position:absolute  left:112px  top:40px  width:16px  height:26px  background:#A9A59B  border-radius:100% 100% 100% 100% / 120% 120% 80% 80%
      <div> position:absolute  left:152px  top:44px  width:6px  height:6px  background:#E2BA78  border-radius:50%  opacity:0.9
      <div> position:absolute  left:74px  top:92px  width:4px  height:4px  background:#E2BA78  border-radius:50%  opacity:0.7
  <div> position:absolute  left:36px  right:36px  top:150px  color:#1D1C1A  font-size:24px  font-weight:500  letter-spacing:-0.2px  line-height:32px  text-align:center  text-wrap:balance
    · One clean day.
  <div> position:absolute  left:44px  right:44px  top:194px  color:#55534E  font-size:15.5px  font-weight:400  line-height:23px  text-align:center  text-wrap:pretty
    · That’s all today has to be.
  <div> position:absolute  left:24px  right:24px  top:744px  height:58px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:29px  cursor:pointer
    <span> color:#FFFFFF  font-size:17px  font-weight:600  letter-spacing:0.2px
      · Continue
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.vicifull/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at 76, 300 | box · paint · type | 76, 300 · 240 × 200 · — · — | identical | match |
| div at 76, 300 | box · paint · type | 76, 300 · 240 × 200 · — · — | identical | match |
| div at 132, 300 | radius | 50% | - | **mismatch** |
| div at 166, 452 | background | rgba(0, 0, 0, 0.1) | - | **mismatch** |
| div at 166, 452 | radius | 50% | - | **mismatch** |
| div at 162, 412 | box · paint · type | 162, 412 · 68 × 46 · r 8px 8px 14px 14px · — | identical | match |
| div at 158, 406 | box · paint · type | 158, 406 · 76 × 12 · rgb(241, 239, 233) · r 6px · — | identical | match |
| div at 194, 352 | box · paint · type | 194, 352 · 4 × 60 · rgb(142, 139, 132) · r 2px · — | identical | match |
| div at 193.6, 357.6 | box · paint · type | 193.6, 357.6 · 39.8 × 28.1 · rgb(185, 181, 172) · r 100% 0px · — | identical | match |
| div at 158.7, 369.6 | box · paint · type | 158.7, 369.6 · 39.8 × 28.1 · rgb(198, 194, 184) · r 0px 100% · — | identical | match |
| div at 188, 340 | box · paint · type | 188, 340 · 16 × 26 · rgb(169, 165, 155) · r 100% / 120% 120% 80% 80% · — | identical | match |
| div at 228, 344 | radius | 50% | 3px | **mismatch** |
| div at 150, 392 | radius | 50% | 2px | **mismatch** |
| “One clean day.” | box · paint · type | 36, 150 · 321 × 32 · — · 24px/500/-0.2px/32px/rgb(29, 28, 26) | identical | match |
| “That’s all today has to be.” | box · paint · type | 44, 194 · 305 × 23 · — · 15.5px/400/normal/23px/rgb(85, 83, 78) | identical | match |
| div at 24, 744 | box · paint · type | 24, 744 · 345 × 58 · rgb(19, 19, 19) · r 29px · — | identical | match |
| “Continue” | box · paint · type | 159.7, 763 · 73.7 × 20 · — · 17px/600/0.2px/normal/rgb(255, 255, 255) | identical | match |

**16 elements compared; 12 match, 4 differ.**

## Resolutions

**No field.** Every other board in the tail carries `TailField` — a `#FAF9F8 → #FDFDFC` ground, a
`rgba(180,170,150,0.14)` corner bloom, a 560pt warm sun hung 300 below the bottom edge, and grain
at 0.12. This one states flat `#FFFFFF` and nothing else, so `O3CleanDay` is the one component in
the file that does not use `TailFrame`. That is also why it and `31 · If Nothing Changes` were the
two frames unaffected by the corner-bloom fade-stop defect (`DECISIONS.md` D105).

**The seedling.** A 240 × 200 art box at 76,300 with `overflow: hidden`, holding, in the canvas's
own paint order: a 128pt glow, the ground shadow, the pot, its rim, the stem, two leaves, the bud
and two 6/4pt pollen dots. The leaves are `border-radius: 100% 0 100% 0` boxes swung ±14° off one
end with `transform-origin: 0 50%` / `100% 50%`; a percentage radius is elliptical, which is the
shape, so they are written as the canvas writes them rather than redrawn as paths. The bud's
`border-radius: 100% 100% 100% 100% / 120% 120% 80% 80%` is likewise transcribed, and lands to the
pixel.

**The ground shadow.** The canvas draws a **solid** `rgba(0,0,0,0.10)` ellipse, 60 × 16 at 90,152
inside the art box, under `filter: blur(5px)`. `DECISIONS.md` D010 absorbs a blur on a
`radial-gradient(closest-side, …)`, which has no edge to soften; this is the case D082 carves out,
where the blur *is* the shape — the fill holds its stated alpha across the middle and carries on
past the box. Pass 1 drew a radial falling from 0.10 at the centre to 0 at the box edge, clipped to
the box, which measured 9–12/255 too light and left the canvas's spill below the box unpainted. It
is now the canvas's own solid under a real `<FeGaussianBlur stdDeviation="5">` (D063), in an
`<Svg>` that overhangs the box by 4σ so the viewport does not clip the falloff. Re-measured:
180,460 exact (design 234, app 234), 210,460 within 1/255, 180,468 exact.

The remaining mismatched rows are notation only: the glow, the two pollen dots and the shadow are
`border-radius: 50%` CSS circles in the canvas and SVG shapes in the app, so the probe reports a
radius on one side and none on the other (`DECISIONS.md` D015 for the same reason on the washes).
The shadow's app row also sits 4σ wider than the frame's div — the declared consequence of D082,
because the div is not what the canvas paints.

**Whole-image.** Mean |Δ| 0.03/255 over the body — the closest match in the group. Over the whole
240 × 200 art box, 192 device pixels differ by more than 6/255 out of 192,000 (0.1 %), peaking at
19/255 on the rotated tip of the right-hand leaf; before the shadow fix the same box had 2,535.
The only other pixels over 12/255 on the board are on the CTA pill's own corner radius, which is
the app's `PressScale` compositing layer and is present on every CTA in the app.
