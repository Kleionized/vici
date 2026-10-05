# 33 · One Bad Day

* **Design frame** `Email-Login/One Bad Day` — `.vicifull/final/Email-Login/One-Bad-Day.html`
* **Design badge** `33 · One Bad Day` (`.vicifull/FLOW.txt`, which the run's brief makes the
  authority on badges). The group lists this run was cut on call the same frame **#38**; this
  drop renumbered onboarding, so the two schemes disagree and both appear in the codebase. This
  file names the badge.
* **Status in `Latest Vici FULL`** changed, 15 diff lines
* **App files** `src/components/onboarding/tail.tsx` (`O3OneBadDay`) + `src/content/onboardingTail.ts`,
  wired from `src/app/(onboarding)/welcome.tsx`

## Transcription — `One Bad Day`

Source `Latest Vici FULL/project/Email Login.dc.html`, frame `One-Bad-Day.html`. Emitted by `scripts/vicifull/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:linear-gradient(180deg, #FAF9F8 0%, #FDFDFC 100%)  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  overflow:hidden  pointer-events:none
    <div> position:absolute  left:-40px  top:-140px  width:540px  height:270px  background:radial-gradient(closest-side, rgba(180,170,150,0.14), rgba(19,19,19,0) 72%)  border-radius:50%  filter:blur(6px)
    <div> position:absolute  left:50%  bottom:-300px  width:560px  height:560px  margin-left:-280px  background:radial-gradient(closest-side, rgba(255,236,196,0.42), rgba(255,236,196,0.19) 45%, rgba(255,236,196,0) 72%)  border-radius:50%
    <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.12
  <div> position:absolute  left:40px  right:40px  top:170px  color:#1D1C1A  font-size:24px  font-weight:500  letter-spacing:-0.2px  line-height:32px  text-align:center  text-wrap:balance
    · One bad day is one bad day.
  <div> position:absolute  left:48px  right:48px  top:230px  color:#55534E  font-size:14px  font-weight:400  line-height:21px  text-align:center  text-wrap:pretty
    · It doesn’t erase the work before it. Your lessons, logs, rating history and medallions stay.
  <div> position:absolute  left:24px  right:24px  top:316px  padding:20px 16px 16px  background:#FFFFFF  border-radius:20px  box-shadow:0 0 0 1px rgba(0,0,0,0.09)  overflow:hidden
    <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.05  pointer-events:none
    <svg> viewBox="0 0 320 190"  width="100%"  display:block  overflow:visible
      <line> x1="16"  y1="152"  x2="304"  y2="152"  stroke="rgba(19,19,19,0.16)"  stroke-width="1.5"
      <circle> cx="24"  cy="148"  r="4.5"  fill="#131313"
      <path> d="M24,148 C100,136 180,92 288,34"  fill="none"  stroke="#131313"  stroke-width="3"  stroke-linecap="round"
      <path> d="M288,34 l-10.5,-1 M288,34 l-4,9.5"  stroke="#131313"  stroke-width="3"  stroke-linecap="round"
      <path> d="M118,116 l8 8 M212,74 l8 8"  stroke="#E2BA78"  stroke-width="3.6"  stroke-linecap="round"
      <text> x="122"  y="140"  fill="#C99F5F"  font-size="11"  font-weight="500"
        · slip
      <text> x="216"  y="98"  fill="#C99F5F"  font-size="11"  font-weight="500"
        · slip
      <text> x="24"  y="170"  fill="#8B8882"  font-size="10.5"  font-weight="500"
        · day 0
      <text> x="304"  y="170"  fill="#8B8882"  text-anchor="end"  font-size="10.5"  font-weight="500"
        · today · day 41
  <div> position:absolute  left:44px  right:44px  top:572px  color:#1D1C1A  font-size:15.5px  font-weight:500  line-height:22px  text-align:center
    · What matters is that you come back.
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
| div at -40, -140 | radius | 50% | - | **mismatch** |
| div at -83.5, 592 | radius | 50% | - | **mismatch** |
| “One bad day is one bad day.” | box · paint · type | 40, 170 · 313 × 32 · — · 24px/500/-0.2px/32px/rgb(29, 28, 26) | identical | match |
| “It doesn’t erase the work before it. Your lesson” | box · paint · type | 48, 230 · 297 × 63 · — · 14px/400/normal/21px/rgb(85, 83, 78) | identical | match |
| div at 24, 316 | box · paint · type | 24, 316 · 345 × 221.8 · rgb(255, 255, 255) · r 20px · rgba(0, 0, 0, 0.09) 0px 0px 0px 1px · — | identical | match |
| div at 24, 316 | opacity | 0.05 | - | **mismatch** |
| svg at 40, 336 | box · paint · type | 40, 336 · 313 × 185.8 · — · — | identical | match |
| line at 55.7, 484.7 | box · paint · type | 55.7, 484.7 · 281.7 × 0 · — · — | identical | match |
| circle at 59.1, 476.4 | box · paint · type | 59.1, 476.4 · 8.8 × 8.8 · — · — | identical | match |
| path at 63.5, 369.3 | box · paint · type | 63.5, 369.3 · 258.2 × 111.5 · — · — | identical | match |
| path at 311.4, 368.3 | box · paint · type | 311.4, 368.3 · 10.3 × 10.3 · — · — | identical | match |
| path at 155.4, 408.4 | box · paint · type | 155.4, 408.4 · 99.8 × 48.9 · — · — | identical | match |
| “slip” | box · paint · type | 159.3, 462.9 · 18.4 × 12 · — · 11px/500/normal/normal/rgb(0, 0, 0) | identical | match |
| “slip” | box · paint · type | 251.3, 421.9 · 18.4 × 12 · — · 11px/500/normal/normal/rgb(0, 0, 0) | identical | match |
| “day 0” | box · paint · type | 63.5, 492.3 · 27.7 × 12 · — · 10.5px/500/normal/normal/rgb(0, 0, 0) | identical | match |
| “today · day 41” | box · paint · type | 267.2, 492.3 · 70.1 × 12 · — · 10.5px/500/normal/normal/rgb(0, 0, 0) | identical | match |
| “What matters is that you come back.” | box · paint · type | 44, 572 · 305 × 22 · — · 15.5px/500/normal/22px/rgb(29, 28, 26) | identical | match |
| div at 24, 744 | box · paint · type | 24, 744 · 345 × 58 · rgb(19, 19, 19) · r 29px · — | identical | match |
| “Continue” | box · paint · type | 159.7, 763 · 73.7 × 20 · — · 17px/600/0.2px/normal/rgb(255, 255, 255) | identical | match |

**19 elements compared; 16 match, 3 differ.**

## Resolutions

The rising line, its arrowhead, the two `#E2BA78` slip ticks and all four labels are the frame's
own path data, inside `viewBox="0 0 320 190"`. The chart is sized the way the canvas sizes it —
`width: 100%` with a viewBox and **no** height, so the height comes from the ratio; the app
carries the ratio on the wrapper instead, because giving the `<Svg>` a fixed height would let
`preserveAspectRatio` centre the drawing in a viewport of the wrong shape and shift every label.
(This is the opposite case to `28 · Your VICI Rating`, whose curve **does** state a height and
`preserveAspectRatio="none"` with it.) Card height falls out at the canvas's own 222.

`today · day 41` is the frame's own literal, passed as `day={41}` from `welcome.tsx`: the board is
shown during onboarding, when the user is on day 0, so the chart is the canvas's illustration
rather than a readout.

**The one row the audit still calls a difference is not one.** `scripts/vicifull/audit.mjs`
reports this frame `DIFF` on `opacity: 0.05 → -` for the card at 24,316,345,222: the canvas draws
the card's grain as a `<div>` with `background-image: noise-dark.png; opacity: 0.05`, and the app
draws `<Grain>`, whose opacity the probe attributes to a different node. Checked in the pixels, in
exactly the region the row is about — a clean 300 × 8pt strip of card at y 324…332, above the
chart: design mean 254.70, sd 0.507, range 253–255; app mean 254.58, sd 0.542, range 253–255, and
**zero** pixels differ by more than 6/255 over 30,322–360,334. The grain is there and it is at the
canvas's own strength. Remaining rows: `DECISIONS.md` D015 and D019.

Whole-image: mean |Δ| 1.23/255. The 1,240 device pixels over 6/255 inside the card are the
antialiased edges of a 3pt diagonal stroke; the curve's own vertical position, measured as the
darkness centroid down five columns clear of the baseline hairline, agrees with the canvas to
within 0.14pt.
