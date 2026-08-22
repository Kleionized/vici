# Night 3 Reflection

* **Design frame** `Email-Login/Night 3 Reflection`
* **App file** src/app/day/night.tsx step REFLECTION

## Transcription — `Night 3 Reflection`

Source `UI Final 1/project/Email Login.dc.html`, frame `Night-3-Reflection.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.07  pointer-events:none
  <div> position:absolute  left:0  right:0  top:72px  display:flex  justify-content:center  gap:7px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:18px  height:6px  background:#131313  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
    <div> width:6px  height:6px  background:rgba(19,19,19,0.18)  border-radius:3px
  <div> position:absolute  left:24px  top:230px  color:#1D1C1A  font-size:27px  font-weight:500  letter-spacing:-0.1px
    · Anything worth keeping?
  <div> position:absolute  left:12px  right:12px  top:310px  height:150px  background:#FFFFFF  border-radius:14px  box-shadow:0 0 0 1px rgba(0,0,0,0.07)
    <div> position:absolute  left:20px  right:20px  top:22px  color:#8B8882  font-family:Georgia,'Times New Roman',serif  font-size:17px  font-style:italic  line-height:27px
      · Sam called at the right moment…
      <span> width:2px  height:18px  margin-left:3px  display:inline-block  background:#131313  vertical-align:-3px
    <div> position:absolute  right:16px  bottom:12px  color:#B0AEA8  font-size:11px  font-weight:500
      · Optional
  <div> position:absolute  left:16px  right:16px  top:756px  height:52px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:26px  cursor:pointer
    <span> color:#FFFFFF  font-size:17px  font-weight:600
      · Close the day
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at 0, 72 | box · paint · type | 0, 72 · 393 × 6 · — · — | identical | match |
| div at 155, 72 | box · paint · type | 155, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 168, 72 | box · paint · type | 168, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 181, 72 | box · paint · type | 181, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 194, 72 | box · paint · type | 194, 72 · 18 × 6 · rgb(19, 19, 19) · r 3px · — | identical | match |
| div at 219, 72 | box · paint · type | 219, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| div at 232, 72 | box · paint · type | 232, 72 · 6 × 6 · rgba(19, 19, 19, 0.18) · r 3px · — | identical | match |
| “Anything worth keeping?” | box · paint · type | 24, 230 · 295.8 × 31.5 · — · 27px/500/-0.1px/normal/rgb(29, 28, 26) | identical | match |
| div at 12, 310 | box · paint · type | 12, 310 · 369 × 150 · rgb(255, 255, 255) · r 14px · rgba(0, 0, 0, 0.07) 0px 0px 0px 1px · — | identical | match |
| “Sam called at the right moment…” | box · paint | 32, 332 · 329 × 27 · — | *absent* | **mismatch** |
| span at 288.6, 336.5 | box · paint | 288.6, 336.5 · 2 × 18 · rgb(19, 19, 19) | *absent* | **mismatch** |
| “Optional” | box · paint · type | 319.7, 435 · 45.3 × 13 · — · 11px/500/normal/normal/rgb(176, 174, 168) | identical | match |
| div at 16, 756 | box · paint · type | 16, 756 · 361 × 52 · rgb(19, 19, 19) · r 26px · — | identical | match |
| “Close the day” | box · paint · type | 142.5, 772 · 108 × 20 · — · 17px/600/normal/normal/rgb(255, 255, 255) | identical | match |

**14 elements compared; 12 match, 2 differ.**

## Reading — every row that is not `match`

Two rows, both the same thing: the canvas is a static picture of a text field
and the app is a real one.

* **"Sam called at the right moment…"** — the canvas draws the sample line as a
  text node inside the card; the app is a `TextInput` and the same run is its
  `placeholder`, which is an attribute rather than a text node, so the probe
  cannot see it. The field's own box is captured at the canvas's origin
  (`32, 332`) and the run is styled with the canvas's own metrics: Georgia
  italic, 17px on a 27px line, `#8B8882`.
* **The 2 × 18 `#131313` span at 288.6, 336.5** — the canvas's stand-in for a
  text cursor. iOS, Android and the web each draw their own caret, blinking and
  only while focused; painting this one as well would show two while typing and
  a false one while not. It is chrome in the same class as the status bar, and
  is not drawn. See `DECISIONS.md` D025.

Everything else on the frame matches exactly, including the rail moving to index
3 and the Back row being dropped, which are this bundle's changes.
