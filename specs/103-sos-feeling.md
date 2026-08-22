# SOS Feeling Picker

* **Design frame** `Email-Login/SOS Feeling Picker`
* **App file** src/components/urge/index.tsx → UrgeFlow → FeelingPage, PickerGrid

## Transcription — `SOS Feeling Picker`

Source `UI Final 1/project/Email Login.dc.html`, frame `SOS-Feeling-Picker.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
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
      · What’s underneath it?
    <div> position:absolute  left:24px  right:24px  top:128px  display:flex  flex-direction:column  gap:10px
      <div> display:flex  gap:10px
        <div> height:96px  display:flex  flex:1  flex-direction:column  align-items:center  justify-content:center  gap:9px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
          <div> width:46px  height:46px  display:flex  align-items:center  justify-content:center  background:#F1EFE9  border-radius:50%
            <svg> viewBox="0 0 24 24"  width="21"  height="21"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
              <path> d="M4.5 10.5h15a7.5 6.5 0 0 1-15 0z"
              <path> d="M9.5 7c0-1 .7-1.3.7-2.3M13.8 7c0-1 .7-1.3.7-2.3"
          <span> color:#1D1C1A  font-size:13.5px  font-weight:500
            · Turned on
        <div> height:96px  display:flex  flex:1  flex-direction:column  align-items:center  justify-content:center  gap:9px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
          <div> width:46px  height:46px  display:flex  align-items:center  justify-content:center  background:#F1EFE9  border-radius:50%
            <svg> viewBox="0 0 24 24"  width="21"  height="21"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
              <path> d="M13 2L5 13.5h5.5L10 22l8-11.5h-5.5z"
          <span> color:#1D1C1A  font-size:13.5px  font-weight:500
            · Bored
      <div> display:flex  gap:10px
        <div> height:96px  display:flex  flex:1  flex-direction:column  align-items:center  justify-content:center  gap:9px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
          <div> width:46px  height:46px  display:flex  align-items:center  justify-content:center  background:#F1EFE9  border-radius:50%
            <svg> viewBox="0 0 24 24"  width="21"  height="21"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
              <circle> cx="12"  cy="8"  r="3.6"
              <path> d="M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6"
          <span> color:#1D1C1A  font-size:13.5px  font-weight:500
            · Lonely
        <div> height:96px  display:flex  flex:1  flex-direction:column  align-items:center  justify-content:center  gap:9px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
          <div> width:46px  height:46px  display:flex  align-items:center  justify-content:center  background:#F1EFE9  border-radius:50%
            <svg> viewBox="0 0 24 24"  width="21"  height="21"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
              <path> d="M14.5 3.5a8.5 8.5 0 1 0 6 12.5 8 8 0 0 1-6-12.5z"
          <span> color:#1D1C1A  font-size:13.5px  font-weight:500
            · Stressed or anxious
      <div> display:flex  gap:10px
        <div> height:96px  display:flex  flex:1  flex-direction:column  align-items:center  justify-content:center  gap:9px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
          <div> width:46px  height:46px  display:flex  align-items:center  justify-content:center  background:#F1EFE9  border-radius:50%
            <svg> viewBox="0 0 24 24"  width="21"  height="21"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
              <path> d="M3.5 13c2.4-3.4 4.6-3.4 7 0s4.6 3.4 7 0"
              <path> d="M6.5 7h.01M14.5 7h.01"
          <span> color:#1D1C1A  font-size:13.5px  font-weight:500
            · Angry
        <div> height:96px  display:flex  flex:1  flex-direction:column  align-items:center  justify-content:center  gap:9px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
          <div> width:46px  height:46px  display:flex  align-items:center  justify-content:center  background:#F1EFE9  border-radius:50%
            <svg> viewBox="0 0 24 24"  width="21"  height="21"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
              <path> d="M3 13.5h3.5L9 8l3 9 2.5-6.5 1.5 3H21"
          <span> color:#1D1C1A  font-size:13.5px  font-weight:500
            · Low
      <div> display:flex  gap:10px
        <div> height:96px  display:flex  flex:1  flex-direction:column  align-items:center  justify-content:center  gap:9px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
          <div> width:46px  height:46px  display:flex  align-items:center  justify-content:center  background:#F1EFE9  border-radius:50%
            <svg> viewBox="0 0 24 24"  width="21"  height="21"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
              <path> d="M4.5 10.5h15a7.5 6.5 0 0 1-15 0z"
              <path> d="M9.5 7c0-1 .7-1.3.7-2.3M13.8 7c0-1 .7-1.3.7-2.3"
          <span> color:#1D1C1A  font-size:13.5px  font-weight:500
            · Tired
        <div> height:96px  display:flex  flex:1  flex-direction:column  align-items:center  justify-content:center  gap:9px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
          <div> width:46px  height:46px  display:flex  align-items:center  justify-content:center  background:#F1EFE9  border-radius:50%
            <svg> viewBox="0 0 24 24"  width="21"  height="21"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
              <path> d="M13 2L5 13.5h5.5L10 22l8-11.5h-5.5z"
          <span> color:#1D1C1A  font-size:13.5px  font-weight:500
            · Restless
      <div> display:flex  gap:10px
        <div> height:96px  display:flex  flex:1  flex-direction:column  align-items:center  justify-content:center  gap:9px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.10)  cursor:pointer
          <div> width:46px  height:46px  display:flex  align-items:center  justify-content:center  background:#F1EFE9  border-radius:50%
            <svg> viewBox="0 0 24 24"  width="21"  height="21"  fill="none"  stroke="#1D1C1A"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"
              <circle> cx="12"  cy="8"  r="3.6"
              <path> d="M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6"
          <span> color:#1D1C1A  font-size:13.5px  font-weight:500
            · I don’t know
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
| “What’s underneath it?” | box · paint · type | 0, 114 · 393 × 26 · — · 22px/500/0.1px/normal/rgb(29, 28, 26) | identical | match |
| div at 24, 180 | box · paint · type | 24, 180 · 345 × 520 · — · — | identical | match |
| div at 24, 180 | box · paint · type | 24, 180 · 345 × 96 · — · — | identical | match |
| div at 24, 180 | box · paint · type | 24, 180 · 167.5 × 96 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| div at 84.8, 192.5 | radius | 50% | 23px | **mismatch** |
| svg at 97.3, 205 | box · paint · type | 97.3, 205 · 21 × 21 · — · — | identical | match |
| path at 101.2, 214.2 | box · paint · type | 101.2, 214.2 · 13.1 × 5.7 · — · — | identical | match |
| path at 105.6, 209.1 | box · paint · type | 105.6, 209.1 · 4.4 × 2 · — · — | identical | match |
| “Turned on” | box · paint · type | 75.4, 247.5 · 64.6 × 16 · — · 13.5px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 201.5, 180 | box · paint · type | 201.5, 180 · 167.5 × 96 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| div at 262.3, 192.5 | radius | 50% | 23px | **mismatch** |
| svg at 274.8, 205 | box · paint · type | 274.8, 205 · 21 × 21 · — · — | identical | match |
| path at 279.1, 206.8 | box · paint · type | 279.1, 206.8 · 11.4 × 17.5 · — · — | identical | match |
| “Bored” | box · paint · type | 266.2, 247.5 · 38.1 × 16 · — · 13.5px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 24, 286 | box · paint · type | 24, 286 · 345 × 96 · — · — | identical | match |
| div at 24, 286 | box · paint · type | 24, 286 · 167.5 × 96 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| div at 84.8, 298.5 | radius | 50% | 23px | **mismatch** |
| svg at 97.3, 311 | box · paint · type | 97.3, 311 · 21 × 21 · — · — | identical | match |
| circle at 104.6, 314.9 | box · paint · type | 104.6, 314.9 · 6.3 × 6.3 · — · — | identical | match |
| path at 101.2, 323.7 | box · paint · type | 101.2, 323.7 · 13.1 × 5.3 · — · — | identical | match |
| “Lonely” | box · paint · type | 86.8, 353.5 · 42 × 16 · — · 13.5px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 201.5, 286 | box · paint · type | 201.5, 286 · 167.5 × 96 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| div at 262.3, 298.5 | radius | 50% | 23px | **mismatch** |
| svg at 274.8, 311 | box · paint · type | 274.8, 311 · 21 × 21 · — · — | identical | match |
| path at 278.7, 314 | box · paint · type | 278.7, 314 · 13.9 × 14.9 · — · — | identical | match |
| “Stressed or anxious” | box · paint · type | 222.1, 353.5 · 126.4 × 16 · — · 13.5px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 24, 392 | box · paint · type | 24, 392 · 345 × 96 · — · — | identical | match |
| div at 24, 392 | box · paint · type | 24, 392 · 167.5 × 96 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| div at 84.8, 404.5 | radius | 50% | 23px | **mismatch** |
| svg at 97.3, 417 | box · paint · type | 97.3, 417 · 21 × 21 · — · — | identical | match |
| path at 100.3, 426.1 | box · paint · type | 100.3, 426.1 · 12.3 × 4.5 · — · — | identical | match |
| path at 102.9, 423.1 | box · paint · type | 102.9, 423.1 · 7 × 0 · — · — | identical | match |
| “Angry” | box · paint · type | 88.6, 459.5 · 38.3 × 16 · — · 13.5px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 201.5, 392 | box · paint · type | 201.5, 392 · 167.5 × 96 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| div at 262.3, 404.5 | radius | 50% | 23px | **mismatch** |
| svg at 274.8, 417 | box · paint · type | 274.8, 417 · 21 × 21 · — · — | identical | match |
| path at 277.4, 424 | box · paint · type | 277.4, 424 · 15.8 × 7.9 · — · — | identical | match |
| “Low” | box · paint · type | 272.4, 459.5 · 25.7 × 16 · — · 13.5px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 24, 498 | box · paint · type | 24, 498 · 345 × 96 · — · — | identical | match |
| div at 24, 498 | box · paint · type | 24, 498 · 167.5 × 96 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| div at 84.8, 510.5 | radius | 50% | 23px | **mismatch** |
| svg at 97.3, 523 | box · paint · type | 97.3, 523 · 21 × 21 · — · — | identical | match |
| path at 101.2, 532.2 | box · paint · type | 101.2, 532.2 · 13.1 × 5.7 · — · — | identical | match |
| path at 105.6, 527.1 | box · paint · type | 105.6, 527.1 · 4.4 × 2 · — · — | identical | match |
| “Tired” | box · paint · type | 91.3, 565.5 · 33 × 16 · — · 13.5px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 201.5, 498 | box · paint · type | 201.5, 498 · 167.5 × 96 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| div at 262.3, 510.5 | radius | 50% | 23px | **mismatch** |
| svg at 274.8, 523 | box · paint · type | 274.8, 523 · 21 × 21 · — · — | identical | match |
| path at 279.1, 524.8 | box · paint · type | 279.1, 524.8 · 11.4 × 17.5 · — · — | identical | match |
| “Restless” | box · paint · type | 258.3, 565.5 · 53.9 × 16 · — · 13.5px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 24, 604 | box · paint · type | 24, 604 · 345 × 96 · — · — | identical | match |
| div at 24, 604 | box · paint · type | 24, 604 · 345 × 96 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.1) 0px 0px 0px 1px · — | identical | match |
| div at 173.5, 616.5 | radius | 50% | 23px | **mismatch** |
| svg at 186, 629 | box · paint · type | 186, 629 · 21 × 21 · — · — | identical | match |
| circle at 193.4, 632.8 | box · paint · type | 193.4, 632.8 · 6.3 × 6.3 · — · — | identical | match |
| path at 189.9, 641.7 | box · paint · type | 189.9, 641.7 · 13.1 × 5.3 · — · — | identical | match |
| “I don’t know” | box · paint · type | 157.4, 671.5 · 78.2 × 16 · — · 13.5px/500/normal/normal/rgb(29, 28, 26) | identical | match |
| div at 24, 740 | box · paint · type | 24, 740 · 345 × 52 · rgb(19, 19, 19) · r 26px · — | identical | match |
| “Continue” | box · paint · type | 158.3, 755.8 · 76.5 × 20.5 · — · 17.5px/600/0.3px/normal/rgb(255, 255, 255) | identical | match |

**64 elements compared; 55 match, 9 differ.**

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

Frame-specific: the same replacement as `102` — see `specs/102-sos-trigger.md`.
The six H·A·L·T rows and their `note` sub-labels are retired, `Hungry` with
them, and the footnote under the list is deleted. Six of the nine glyphs are the
old list's, positionally (D036).
