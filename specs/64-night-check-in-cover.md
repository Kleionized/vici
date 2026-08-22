# Night Check-in Cover

* **Design frame** `Email-Login/Night Check-in Cover`
* **App file** src/components/day/kit.tsx → CheckinCover; src/app/day/night.tsx step COVER

## Transcription — `Night Check-in Cover`

Source `UI Final 1/project/Email Login.dc.html`, frame `Night-Check-in-Cover.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:linear-gradient(180deg, #21262F 0%, #2B2E36 55%, #47403A 100%)  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.07  pointer-events:none
  <div> position:absolute  left:118px  top:148px  width:2.5px  height:2.5px  background:rgba(226,232,240,0.7)  border-radius:50%
  <div> position:absolute  left:284px  top:172px  width:2px  height:2px  background:rgba(226,232,240,0.5)  border-radius:50%
  <div> position:absolute  left:206px  top:120px  width:2px  height:2px  background:rgba(226,232,240,0.45)  border-radius:50%
  <div> position:absolute  left:50%  top:76px  width:300px  height:300px  margin-left:-150px  background:radial-gradient(closest-side, rgba(214,140,100,0.5), rgba(214,140,100,0) 72%)  border-radius:50%  filter:blur(4px)
  <div> position:absolute  left:50%  top:200px  width:52px  height:52px  margin-left:-26px  background:#E4B48E  border-radius:50%
  <div> position:absolute  left:-80px  right:-80px  top:280px  height:150px  background:linear-gradient(180deg, #272D37 0%, #272D37 30%, rgba(39,45,55,0) 90%)  border-radius:50% 50% 0 0 / 88px 88px 0 0
  <div> position:absolute  left:-150px  right:-50px  top:312px  height:150px  background:linear-gradient(180deg, #20252E 0%, #20252E 30%, rgba(32,37,46,0) 90%)  border-radius:50% 50% 0 0 / 70px 70px 0 0
  <div> position:absolute  left:0  right:0  top:508px  color:#F4F3F0  font-size:27px  font-weight:500  letter-spacing:-0.1px  text-align:center
    · Night check-in.
  <div> position:absolute  left:0  right:0  top:550px  color:rgba(244,243,240,0.55)  font-size:14.5px  font-weight:400  text-align:center
    · Day 13 · two minutes
  <div> position:absolute  left:16px  right:16px  top:756px  height:52px  display:flex  align-items:center  justify-content:center  background:#F4F3F0  border-radius:26px  cursor:pointer
    <span> color:#131313  font-size:17px  font-weight:600
      · Close the day
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at 118, 148 | radius | 50% | 1.25px | **mismatch** |
| div at 284, 172 | radius | 50% | 1px | **mismatch** |
| div at 206, 120 | radius | 50% | 1px | **mismatch** |
| div at 46.5, 76 | radius | 50% | - | **mismatch** |
| div at 170.5, 200 | radius | 50% | 26px | **mismatch** |
| div at -80, 280 | radius | 50% 50% 0px 0px / 88px 88px 0px 0px | - | **mismatch** |
| div at -150, 312 | radius | 50% 50% 0px 0px / 70px 70px 0px 0px | - | **mismatch** |
| “Night check-in.” | box · paint · type | 0, 508 · 393 × 31.5 · — · 27px/500/-0.1px/normal/rgb(244, 243, 240) | identical | match |
| “Day 13 · two minutes” | box · paint · type | 0, 550 · 393 × 17 · — · 14.5px/400/normal/normal/rgba(244, 243, 240, 0.55) | same box and metrics, value "Day 41 · two minutes" | match (value) |
| div at 16, 756 | box · paint · type | 16, 756 · 361 × 52 · rgb(244, 243, 240) · r 26px · — | identical | match |
| “Close the day” | box · paint · type | 142.5, 772 · 108 × 20 · — · 17px/600/normal/normal/rgb(19, 19, 19) | identical | match |

**11 elements compared; 4 match, 7 differ.**

## Reading — every row that is not `match`

Three classes of row can differ without the screen differing, and they are the
only classes present unless a row below says otherwise. `DECISIONS.md` D015
names them:

* **`radius: 50% → <n>px`.** React Native's `borderRadius` takes a number, not a
  percentage. Every one of these is exactly half the box's shorter side, so the
  painted shape is the same circle; only the notation differs.
* **`radius: 50% → -` with a node-count of 1 against 3.** A CSS
  `radial-gradient` on a `<div>` has no React Native equivalent; it is drawn as
  an `<Svg><Circle fill="url(#…)">`, which is a View, an Svg and a Circle on the
  same rect where the canvas has one div. The rect, and the gradient's stops,
  are identical.
* **`radius: 50% 50% 0 0 / Npx Npx 0 0 → -`.** An elliptical corner radius
  cannot be expressed in React Native at all, so the hill is drawn as an SVG arc
  by `src/components/ui/Hill.tsx`. Same rect, same silhouette, three nodes
  instead of one.

A row marked **match (value)** is a value the account owns rather than the
canvas: the box, the colour and the type metrics are identical and only the
characters differ, because the frame is drawn against a sample account and the
app is drawing the seeded one (`scripts/uifinal1/seed.mjs`).

Frame-specific: the sub reads **"Day 13 · two minutes"** on the canvas and
**"Day 41 · two minutes"** in the app. The day number is the account's, and
`21 · Today` in the same bundle heads its page "Day 41", so the two frames
disagree with each other; the app derives it from `user.createdAt` and prints
what the account actually is.

This frame is new in `UI final 1` — there is no `Night-Check-in-Cover.html` in
the previous bundle — and it is built as `CheckinCover` in
`src/components/day/kit.tsx`, one component in a light and a dark register so
`21D0 · Morning — Check-in` can share it. It is returned whole from
`src/app/day/night.tsx` rather than drawn inside `DayShell`, because it carries
no rail, no Back and none of the flow's pill.
