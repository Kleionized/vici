# Cue Hue Picker

* **Design frame** `Email-Login/Cue Hue Picker`
* **App file** src/components/urge/index.tsx → UrgeFlow → WherePage

## Transcription — `Cue Hue Picker`

Source `UI Final 1/project/Email Login.dc.html`, frame `Cue-Hue-Picker.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  left:0  right:0  top:52px  bottom:0  background:#F4F3F0  overflow:hidden
    <div> position:absolute  left:16px  top:14px  display:flex  align-items:center  gap:9px
      <svg> viewBox="0 0 11 19"  width="11"  height="19"
        <path> d="M9.5 1.5L2 9.5l7.5 8"  fill="none"  stroke="#55534E"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
      <span> color:#55534E  font-size:17px  font-weight:400
        · Back
    <div> position:absolute  left:0  right:0  top:62px  color:#1D1C1A  font-size:22px  font-weight:500  letter-spacing:0.1px  text-align:center
      · Where are you right now?
    <div> position:absolute  left:24px  right:24px  top:162px  height:60px  padding:0 18px  display:flex  align-items:center  gap:14px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1.6px #131313  cursor:pointer
      <div> width:38px  height:38px  display:flex  flex-shrink:0  align-items:center  justify-content:center  background:#131313  border-radius:50%
        <svg> viewBox="0 0 24 24"  width="21"  height="21"  fill="none"  stroke="#F4F3F0"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
          <rect> width="12"  height="17"  x="6"  y="3.5"  rx="1.6"
          <circle> cx="14.6"  cy="12.5"  r="1.1"
      <span> flex:1  color:#1D1C1A  font-size:15px  font-weight:600
        · Somewhere private
      <div> width:7px  height:7px  flex-shrink:0  background:#131313  border-radius:50%
    <div> position:absolute  left:24px  right:24px  top:234px  height:60px  padding:0 18px  display:flex  align-items:center  gap:14px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
      <div> width:38px  height:38px  display:flex  flex-shrink:0  align-items:center  justify-content:center  background:#F1EFE9  border-radius:50%
        <svg> viewBox="0 0 24 24"  width="21"  height="21"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
          <path> d="M3.5 18.5v-8M3.5 14.5h17v4M3.5 14.5V9h6.6c2.4 0 3.7 1.3 3.7 3.3v2.2"
          <circle> cx="7.1"  cy="11.4"  r="1.2"
      <span> flex:1  color:#1D1C1A  font-size:15px  font-weight:500
        · In bed
    <div> position:absolute  left:24px  right:24px  top:306px  height:60px  padding:0 18px  display:flex  align-items:center  gap:14px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
      <div> width:38px  height:38px  display:flex  flex-shrink:0  align-items:center  justify-content:center  background:#F1EFE9  border-radius:50%
        <svg> viewBox="0 0 24 24"  width="21"  height="21"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
          <circle> cx="8.5"  cy="9"  r="3.2"
          <circle> cx="16.5"  cy="9"  r="3.2"
          <path> d="M2.5 20c.8-3.4 3.2-5 6-5 1.4 0 2.7.4 3.5 1.2.8-.8 2.1-1.2 3.5-1.2 2.8 0 5.2 1.6 6 5"
      <span> flex:1  color:#1D1C1A  font-size:15px  font-weight:500
        · A public space
    <div> position:absolute  left:24px  right:24px  top:378px  height:60px  padding:0 18px  display:flex  align-items:center  gap:14px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
      <div> width:38px  height:38px  display:flex  flex-shrink:0  align-items:center  justify-content:center  background:#F1EFE9  border-radius:50%
        <svg> viewBox="0 0 24 24"  width="21"  height="21"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
          <rect> width="18"  height="12"  x="3"  y="8"  rx="2.5"
          <path> d="M9 8V6a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18"
      <span> flex:1  color:#1D1C1A  font-size:15px  font-weight:500
        · At work or school
    <div> position:absolute  left:24px  right:24px  top:450px  height:60px  padding:0 18px  display:flex  align-items:center  gap:14px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
      <div> width:38px  height:38px  display:flex  flex-shrink:0  align-items:center  justify-content:center  background:#F1EFE9  border-radius:50%
        <svg> viewBox="0 0 24 24"  width="21"  height="21"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
          <path> d="M12 21s7-5.4 7-11a7 7 0 0 0-14 0c0 5.6 7 11 7 11z"
          <circle> cx="12"  cy="10"  r="2.6"
      <span> flex:1  color:#1D1C1A  font-size:15px  font-weight:500
        · Out and about
    <div> position:absolute  left:24px  right:24px  top:688px  height:52px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:26px  cursor:pointer
      <span> color:#FFFFFF  font-size:17.5px  font-weight:600  letter-spacing:0.3px
        · Continue
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at 0, 52 | box · paint · type | 0, 52 · 393 × 800 · rgb(244, 243, 240) · — | identical | match |
| div at 16, 66 | box · paint · type | 16, 66 · 57.6 × 20 · — · — | identical | match |
| svg at 16, 66.5 | box · paint · type | 16, 66.5 · 11 × 19 · — · — | identical | match |
| path at 18, 68 | box · paint · type | 18, 68 · 7.5 × 16 · — · — | identical | match |
| “Back” | box · paint · type | 36, 66 · 37.6 × 20 · — · 17px/400/normal/normal/rgb(85, 83, 78) | identical | match |
| “Where are you right now?” | box · paint · type | 0, 114 · 393 × 26 · — · 22px/500/0.1px/normal/rgb(29, 28, 26) | identical | match |
| div at 24, 214 | box · paint · type | 24, 214 · 345 × 60 · rgb(255, 255, 255) · r 18px · rgb(19, 19, 19) 0px 0px 0px 1.6px · — | identical | match |
| div at 42, 225 | radius | 50% | 19px | **mismatch** |
| svg at 50.5, 233.5 | box · paint · type | 50.5, 233.5 · 21 × 21 · — · — | identical | match |
| rect at 55.8, 236.6 | box · paint · type | 55.8, 236.6 · 10.5 × 14.9 · — · — | identical | match |
| circle at 62.3, 243.5 | box · paint · type | 62.3, 243.5 · 1.9 × 1.9 · — · — | identical | match |
| “Somewhere private” | box · paint · type | 94, 235.3 · 236 × 17.5 · — · 15px/600/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 344, 240.5 | radius | 50% | 3.5px | **mismatch** |
| div at 24, 286 | box · paint · type | 24, 286 · 345 × 60 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| div at 42, 297 | radius | 50% | 19px | **mismatch** |
| svg at 50.5, 305.5 | box · paint · type | 50.5, 305.5 · 21 × 21 · — · — | identical | match |
| path at 53.6, 313.4 | box · paint · type | 53.6, 313.4 · 14.9 × 8.3 · — · — | identical | match |
| circle at 55.7, 314.4 | box · paint · type | 55.7, 314.4 · 2.1 × 2.1 · — · — | identical | match |
| “In bed” | box · paint · type | 94, 307.3 · 257 × 17.5 · — · 15px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 24, 358 | box · paint · type | 24, 358 · 345 × 60 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| div at 42, 369 | radius | 50% | 19px | **mismatch** |
| svg at 50.5, 377.5 | box · paint · type | 50.5, 377.5 · 21 × 21 · — · — | identical | match |
| circle at 55.1, 382.6 | box · paint · type | 55.1, 382.6 · 5.6 × 5.6 · — · — | identical | match |
| circle at 62.1, 382.6 | box · paint · type | 62.1, 382.6 · 5.6 × 5.6 · — · — | identical | match |
| path at 52.7, 390.6 | box · paint · type | 52.7, 390.6 · 16.6 × 4.4 · — · — | identical | match |
| “A public space” | box · paint · type | 94, 379.3 · 257 × 17.5 · — · 15px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 24, 430 | box · paint · type | 24, 430 · 345 × 60 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| div at 42, 441 | radius | 50% | 19px | **mismatch** |
| svg at 50.5, 449.5 | box · paint · type | 50.5, 449.5 · 21 × 21 · — · — | identical | match |
| rect at 53.1, 456.5 | box · paint · type | 53.1, 456.5 · 15.8 × 10.5 · — · — | identical | match |
| path at 53.1, 453 | box · paint · type | 53.1, 453 · 15.8 × 7.9 · — · — | identical | match |
| “At work or school” | box · paint · type | 94, 451.3 · 257 × 17.5 · — · 15px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 24, 502 | box · paint · type | 24, 502 · 345 × 60 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| div at 42, 513 | radius | 50% | 19px | **mismatch** |
| svg at 50.5, 521.5 | box · paint · type | 50.5, 521.5 · 21 × 21 · — · — | identical | match |
| path at 54.9, 524.1 | box · paint · type | 54.9, 524.1 · 12.3 × 15.8 · — · — | identical | match |
| circle at 58.7, 528 | box · paint · type | 58.7, 528 · 4.6 × 4.6 · — · — | identical | match |
| “Out and about” | box · paint · type | 94, 523.3 · 257 × 17.5 · — · 15px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 24, 740 | box · paint · type | 24, 740 · 345 × 52 · rgb(19, 19, 19) · r 26px · — | identical | match |
| “Continue” | box · paint · type | 158.3, 755.8 · 76.5 × 20.5 · — · 17.5px/600/0.3px/normal/rgb(255, 255, 255) | identical | match |

**40 elements compared; 34 match, 6 differ.**

## Reading — every row that is not `match`

The classes that differ without the screen differing, all recorded in
`DECISIONS.md`:

* **`radius: 50% → <n>px`** (D015) — React Native's `borderRadius` is a number.
  Every one is half the box's shorter side.
* **`radius: 50% → -` with a node count of 1 against 3** (D015) — a CSS
  `radial-gradient` div is `<Svg><Ellipse fill="url(#…)">`: three nodes on one
  rect. The canvas blurs several of these 4–5px; a closest-side radial already
  dies at its own edge, so the blur term is dropped (D010) rather than faked.
* **`bg: <colour> → -`** where the canvas's box became an SVG shape — the paint
  moves to `fill`, which the probe does not read as a background.
* **The canvas's painted `<span>` is the app's View plus Text** (D022).
* **`opacity: 0.07 → -`** on grain (D019).

A row marked **match (value)** is the account's rather than the canvas's.
