# Morning Check-in Cover

* **Design frame** `Email-Login/Morning Check-in Cover`
* **App file** src/components/day/kit.tsx → CheckinCover; src/app/day/morning.tsx step COVER

## Transcription — `Morning Check-in Cover`

Source `UI Final 1/project/Email Login.dc.html`, frame `Morning-Check-in-Cover.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.07  pointer-events:none
  <div> position:absolute  left:50%  top:120px  width:320px  height:320px  margin-left:-160px  background:radial-gradient(closest-side, rgba(226,186,120,0.3), rgba(226,186,120,0) 72%)  border-radius:50%  filter:blur(4px)
  <div> position:absolute  left:50%  top:242px  width:54px  height:54px  margin-left:-27px  background:#E9D2A4  border-radius:50%
  <div> position:absolute  left:84px  top:176px  width:54px  height:9px  background:rgba(255,255,255,0.7)  border-radius:5px
  <div> position:absolute  left:252px  top:200px  width:40px  height:8px  background:rgba(255,255,255,0.55)  border-radius:5px
  <div> position:absolute  left:-80px  right:-80px  top:268px  height:200px  background:linear-gradient(180deg, #E7E5DB 0%, #E7E5DB 30%, rgba(244,243,240,0) 90%)  border-radius:50% 50% 0 0 / 88px 88px 0 0
  <div> position:absolute  left:-150px  right:-50px  top:306px  height:190px  background:linear-gradient(180deg, #DFDDD2 0%, rgba(244,243,240,0) 78%)  border-radius:50% 50% 0 0 / 70px 70px 0 0
  <div> position:absolute  left:0  right:0  top:508px  color:#1D1C1A  font-size:27px  font-weight:500  letter-spacing:-0.1px  text-align:center
    · Morning check-in.
  <div> position:absolute  left:0  right:0  top:550px  color:#8B8882  font-size:14.5px  font-weight:400  text-align:center
    · Day 13 · two minutes
  <div> position:absolute  left:16px  right:16px  top:756px  height:52px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:26px  cursor:pointer
    <span> color:#FFFFFF  font-size:17px  font-weight:600
      · Begin day 13
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at 36.5, 120 | radius | 50% | - | **mismatch** |
| div at 169.5, 242 | radius | 50% | 27px | **mismatch** |
| div at 84, 176 | box · paint · type | 84, 176 · 54 × 9 · rgba(255, 255, 255, 0.7) · r 5px · — | identical | match |
| div at 252, 200 | box · paint · type | 252, 200 · 40 × 8 · rgba(255, 255, 255, 0.55) · r 5px · — | identical | match |
| div at -80, 268 | radius | 50% 50% 0px 0px / 88px 88px 0px 0px | - | **mismatch** |
| div at -150, 306 | radius | 50% 50% 0px 0px / 70px 70px 0px 0px | - | **mismatch** |
| “Morning check-in.” | box · paint · type | 0, 508 · 393 × 31.5 · — · 27px/500/-0.1px/normal/rgb(29, 28, 26) | identical | match |
| “Day 13 · two minutes” | box · paint · type | 0, 550 · 393 × 17 · — · 14.5px/400/normal/normal/rgb(139, 136, 130) | same box and metrics, value "Day 41 · two minutes" | match (value) |
| div at 16, 756 | box · paint · type | 16, 756 · 361 × 52 · rgb(19, 19, 19) · r 26px · — | identical | match |
| “Begin day 13” | box · paint · type | 145.9, 772 · 101.1 × 20 · — · 17px/600/normal/normal/rgb(255, 255, 255) | same box and metrics, value "Begin day 41" | match (value) |

**10 elements compared; 6 match, 4 differ.**

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

Frame-specific: new in `UI final 1`. `CheckinCover` in
`src/components/day/kit.tsx` builds it and its night twin as one component in two
registers — the two are not one drawing recoloured: the glow tops differ by 44,
the disc tops by 42, hill A's height by 50 and hill B's by 40, and the morning
carries two cloud bars where the night carries three stars. Only the three type
and CTA boxes are shared.

It is returned whole from `src/app/day/morning.tsx` rather than drawn inside
`DayShell`: it carries no rail, no Back and none of the flow's pill. The two
value rows are the day number, which the canvas prints as 13 on a frame whose
sibling `21 · Today` prints 41.
