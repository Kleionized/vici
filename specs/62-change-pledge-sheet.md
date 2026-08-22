# Change Pledge Sheet

* **Design frame** `Email-Login/Change Pledge Sheet`
* **App file** src/components/day/kit.tsx → ChangePledgeSheet

## Transcription — `Change Pledge Sheet`

Source `UI Final 1/project/Email Login.dc.html`, frame `Change-Pledge-Sheet.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  opacity:0.45
    <div> position:absolute  left:12px  right:12px  top:164px  height:48px  background:#E8E7E1  border-radius:12px
    <div> position:absolute  left:36px  right:36px  top:228px  height:236px  background:#E8E7E1  border-radius:16px
    <div> position:absolute  left:12px  right:12px  top:544px  height:152px  background:#E8E7E1  border-radius:14px
  <div> position:absolute  inset:0  background:rgba(38,37,30,0.42)  z-index:5
  <div> position:absolute  left:0  right:0  top:320px  bottom:0  background:#F4F3F0  border-radius:22px 22px 0 0  box-shadow:0 -12px 36px rgba(20,19,16,0.22)  z-index:10
    <div> position:absolute  left:50%  top:10px  width:36px  height:4px  margin-left:-18px  background:rgba(0,0,0,0.15)  border-radius:2px
    <div> position:absolute  left:24px  right:40px  top:44px  color:#1D1C1A  font-size:22px  font-weight:500  letter-spacing:-0.2px  line-height:29px
      · Change the pledge
    <div> position:absolute  left:24px  right:24px  top:80px  color:#8B8882  font-size:13px  font-weight:400
      · One promise you can keep every day.
    <div> position:absolute  left:16px  right:16px  top:116px  height:126px  background:#FFFFFF  border-radius:14px  box-shadow:0 0 0 1px rgba(0,0,0,0.06)
      <div> position:absolute  left:18px  right:18px  top:16px  color:#1D1C1A  font-size:17px  font-weight:500  line-height:26px
        · Phone stays out of the bedroom
        <span> width:2px  height:19px  margin-left:2px  display:inline-block  background:#131313  vertical-align:-3px
    <div> position:absolute  left:16px  right:16px  top:274px  height:52px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:26px  cursor:pointer
      <span> color:#FFFFFF  font-size:17px  font-weight:600
        · Sign the new pledge
    <div> position:absolute  left:0  right:0  top:346px  color:#8B8882  font-size:13.5px  font-weight:500  text-align:center  cursor:pointer
      · Keep current pledge
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at 12, 164 | box · paint | 12, 164 · 369 × 48 · rgb(232, 231, 225) · r 12px | *absent* | **mismatch** |
| div at 36, 228 | box · paint | 36, 228 · 321 × 236 · rgb(232, 231, 225) · r 16px | *absent* | **mismatch** |
| div at 12, 544 | box · paint | 12, 544 · 369 × 152 · rgb(232, 231, 225) · r 14px | *absent* | **mismatch** |
| div at 0, 320 | box · paint · type | 0, 320 · 393 × 532 · rgb(244, 243, 240) · r 22px 22px 0px 0px · rgba(20, 19, 16, 0.22) 0px -12px 36px 0px · — | identical | match |
| div at 178.5, 330 | box · paint · type | 178.5, 330 · 36 × 4 · rgba(0, 0, 0, 0.15) · r 2px · — | identical | match |
| “Change the pledge” | box · paint · type | 24, 364 · 329 × 29 · — · 22px/500/-0.2px/29px/rgb(29, 28, 26) | identical | match |
| “One promise you can keep every day.” | box · paint · type | 24, 400 · 345 × 15 · — · 13px/400/normal/normal/rgb(139, 136, 130) | identical | match |
| div at 16, 436 | box · paint · type | 16, 436 · 361 × 126 · rgb(255, 255, 255) · r 14px · rgba(0, 0, 0, 0.06) 0px 0px 0px 1px · — | identical | match |
| “Phone stays out of the bedroom” | box · paint · type | 34, 452 · 325 × 26 · — · 17px/500/normal/26px/rgb(29, 28, 26) | same box and metrics, value "The mornings are mine again." | match (value) |
| span at 284.4, 455.5 | box · paint | 284.4, 455.5 · 2 × 19 · rgb(19, 19, 19) | *absent* | **mismatch** |
| div at 16, 594 | box · paint · type | 16, 594 · 361 × 52 · rgb(19, 19, 19) · r 26px · — | identical | match |
| “Sign the new pledge” | box · paint · type | 115.8, 610 · 161.4 × 20 · — · 17px/600/normal/normal/rgb(255, 255, 255) | identical | match |
| “Keep current pledge” | box · paint · type | 0, 666 · 393 × 16 · — · 13.5px/500/normal/normal/rgb(139, 136, 130) | identical | match |

**13 elements compared; 9 match, 4 differ.**

## Reading — every row that is not `match`

Three classes of row differ without the screen differing — `DECISIONS.md` D015,
D019 and D022 — plus the account's own values:

* **`radius: 50% → <n>px`.** React Native's `borderRadius` is a number, not a
  percentage; every one is exactly half the box's shorter side.
* **`radius: 50% → -` with a node count of 1 against 3.** A CSS
  `radial-gradient` div is drawn as `<Svg><Circle fill="url(#…)">` — a View, an
  Svg and a Circle on the same rect. The canvas also blurs these 4px; a
  closest-side radial already dies at its own edge, so the blur term is dropped
  (D010).
* **`radius: 50% 50% 0 0 / Npx … → -`.** An elliptical corner radius cannot be
  expressed in React Native, so each hill is an SVG arc drawn by
  `src/components/ui/Hill.tsx`. Same rect, same silhouette, three nodes.
* **`opacity: 0.07 → -`** on the grain: `expo-image` carries the opacity on the
  image and leaves its wrapper plain (D019).

A row marked **match (value)** is the account's rather than the canvas's: same
box, same colour, same type metrics, different characters. The frames are drawn
against a sample account on day 13 named Jerry; the seeded one is on day 41 and
named Marcus.

Frame-specific: a new sheet, not a new caller of the app's existing one. Its
scrim, radius, grabber, shadow and ground all differ from `ProfileSheet` and
`SignOutSheet`, and `grep` finds its scrim colour `rgba(38,37,30,0.42)` on no
other frame in the bundle. Every number inside it is sheet-relative: the sheet is
532 tall off the screen's own bottom edge and the −54 rule does not apply below
its own top.

Three rows report as absent, and all three are the frame drawing something the
app must not:

* **the three flat `#E8E7E1` blocks at 45%** (`12,164 · 369×48`,
  `36,228 · 321×236`, `12,544 · 369×152`) are the canvas's stand-in for the
  screen underneath. None of the three matches anything `21D5` actually draws —
  it has no 48-tall bar at 164, no 236-tall card at 228 and no 152-tall card at
  544 — so the live re-sign page is rendered behind the scrim instead, which is
  what the app capture's extra rows are.
* **the 2 × 19 `#131313` bar** after the words is the frame's stand-in for a text
  cursor; the platform draws its own (`DECISIONS.md` D025).

The field's own text is a draft being typed — **"Phone stays out of the
bedroom"** appears on no other frame in the bundle — so the app opens the field
on the standing pledge instead, which is the only thing it can truthfully carry.

What the two buttons do is `DECISIONS.md` D032.

Two further notes from the audit of `.uifinal1/gaps/morning.md`:

* **This is the only frame of the eight with no grain layer at all** — the other
  seven carry `inset:0 noise-dark.png opacity:0.07` and this one carries none.
  The app's sheet ground is an opaque `#F4F3F0` View drawn over everything, so
  no grain reaches it either.
* **The sheet's ground is the frame's ground.** Both are `#F4F3F0`: the sheet
  separates from what is behind it by its 22pt corners and its
  `0 -12px 36px rgba(20,19,16,0.22)` shadow alone, with no tonal step.
* Of the three grey stand-in blocks, the middle one — `36, 228 · 321 × 236` at
  radius 16 — has the same gutters and the same height as `Relapse-Resign`'s
  pledge card, and the other two sit in the bundle's common 12/12 card slots
  (`top: 164` is the Today-Home card, `top: 544` the Settings privacy group).
  The layer is a generic under-screen schematic, not a picture of this screen.
