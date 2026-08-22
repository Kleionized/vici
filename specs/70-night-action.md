# Night Action Reminder

* **Design frame** `Email-Login/Night Action Reminder`
* **App file** src/app/day/night.tsx step ACTION; src/components/day/kit.tsx → ActionCard, NightActionArt, ActionButton

## Transcription — `Night Action Reminder`

Source `UI Final 1/project/Email Login.dc.html`, frame `Night-Action-Reminder.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:#F4F3F0  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.07  pointer-events:none
  <div> position:absolute  left:16px  top:66px  display:flex  align-items:center  gap:9px
    <svg> viewBox="0 0 11 19"  width="11"  height="19"
      <path> d="M9.5 1.5L2 9.5l7.5 8"  fill="none"  stroke="#55534E"  stroke-width="2.4"  stroke-linecap="round"  stroke-linejoin="round"
    <span> color:#55534E  font-size:17px  font-weight:400
      · Back
  <div> position:absolute  left:0  right:0  top:118px  color:#1D1C1A  font-size:22px  font-weight:500  letter-spacing:0.1px  text-align:center
    · Tonight’s action
  <div> position:absolute  left:56px  right:56px  top:236px  background:#FFFFFF  border-radius:18px  box-shadow:0 0 0 1px rgba(0,0,0,0.05), 0 10px 24px rgba(40,38,32,0.07)  overflow:hidden
    <div> position:relative  height:248px  background:linear-gradient(180deg, #0B0C0F 0%, #12151B 60%, #1A2027 100%)  overflow:hidden
      <div> position:absolute  left:64px  top:40px  width:2px  height:2px  background:rgba(244,243,240,0.45)  border-radius:50%
      <div> position:absolute  left:104px  top:72px  width:1.5px  height:1.5px  background:rgba(244,243,240,0.3)  border-radius:50%
      <div> position:absolute  right:40px  top:34px  width:2px  height:2px  background:rgba(244,243,240,0.35)  border-radius:50%
      <div> position:absolute  right:96px  top:58px  width:1.5px  height:1.5px  background:rgba(244,243,240,0.3)  border-radius:50%
      <div> position:absolute  left:22px  top:26px  width:56px  height:56px  background:radial-gradient(closest-side, rgba(223,220,211,0.16), rgba(223,220,211,0) 72%)  border-radius:50%
      <div> position:absolute  left:37px  top:41px  width:26px  height:26px
        <svg> viewBox="0 0 24 24"  width="26"  height="26"
          <path> d="M14 3 A9 9 0 1 0 21 12 A7.2 7.2 0 0 1 14 3Z"  fill="#E8E6DC"
      <svg> viewBox="0 0 281 248"  position:absolute  inset:0  width:100%  height:100%
        <path> d="M-4,248 L-4,196 Q60,178 140,190 Q210,200 285,186 L285,248 Z"  fill="#171B22"
      <div> position:absolute  left:38px  top:152px  width:8px  height:58px  background:#2C3844  border-radius:3px
      <div> position:absolute  left:44px  top:178px  width:82px  height:21px  background:#394656  border-radius:6px
      <div> position:absolute  left:50px  top:169px  width:28px  height:11px  background:#55677C  border-radius:5px
      <div> position:absolute  left:118px  top:199px  width:6px  height:12px  background:#26303C  border-radius:2px
      <div> position:absolute  right:24px  top:118px  width:92px  height:92px  background:radial-gradient(closest-side, rgba(226,186,120,0.20), rgba(226,186,120,0) 74%)  border-radius:50%
      <div> position:absolute  right:56px  top:168px  width:52px  height:9px  background:#2C3844  border-radius:3px
      <div> position:absolute  right:76px  top:177px  width:8px  height:34px  background:#26303C  border-radius:2px
      <div> position:absolute  right:70px  top:140px  width:15px  height:26px  background:#DCE3EA  border-radius:3px
      <div> position:absolute  right:48px  top:128px  width:19px  height:19px  display:flex  align-items:center  justify-content:center  background:#E9D2A4  border-radius:50%
        <svg> viewBox="0 0 9 8"  width="10"  height="9"
          <path> d="M1.5 4l2 2 4-4.5"  fill="none"  stroke="#131313"  stroke-width="1.6"  stroke-linecap="round"  stroke-linejoin="round"
    <div> padding:16px 18px 18px  display:flex  flex-direction:column  gap:12px
      <div> display:flex  align-items:center  gap:10px
        <div> width:34px  height:34px  display:flex  flex-shrink:0  align-items:center  justify-content:center  background:#131313  border-radius:50%
          <svg> viewBox="0 0 20 20"  width="16"  height="16"
            <path> d="M3 15.5V6"  stroke="#F4F3F0"  stroke-width="1.7"  stroke-linecap="round"
            <path> d="M3 12.5h14M17 15.5v-5a2 2 0 0 0-2-2H8v4.5"  fill="none"  stroke="#F4F3F0"  stroke-width="1.7"  stroke-linecap="round"  stroke-linejoin="round"
            <circle> cx="5.6"  cy="8.9"  r="1.5"  fill="#F4F3F0"
        <span> color:#1D1C1A  font-size:13px  font-weight:600
          · Surviving the night
      <div> color:#1D1C1A  font-size:15px  font-weight:500  line-height:22px  text-align:left  text-wrap:pretty
        · Put the device you use for porn out of reach before you sleep.
  <div> position:absolute  left:16px  right:16px  bottom:84px  height:54px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:27px  cursor:pointer
    <span> color:#FFFFFF  font-size:16.5px  font-weight:600  letter-spacing:0.2px
      · Done
  <div> position:absolute  left:0  right:0  bottom:44px  color:#8B8882  font-size:14.5px  font-weight:500  text-align:center  cursor:pointer
    · Skip tonight
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at 16, 66 | box · paint · type | 16, 66 · 57.6 × 20 · — · — | identical | match |
| svg at 16, 66.5 | box · paint · type | 16, 66.5 · 11 × 19 · — · — | identical | match |
| path at 18, 68 | box · paint · type | 18, 68 · 7.5 × 16 · — · — | identical | match |
| “Back” | box · paint · type | 36, 66 · 37.6 × 20 · — · 17px/400/normal/normal/rgb(85, 83, 78) | identical | match |
| “Tonight’s action” | box · paint · type | 0, 118 · 393 × 26 · — · 22px/500/0.1px/normal/rgb(29, 28, 26) | identical | match |
| div at 56, 236 | box · paint | 56, 236 · 281 × 372 · rgb(255, 255, 255) · r 18px · rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(40, 38, 32, 0.07) 0px 10px 24px 0px | *absent* | **mismatch** |
| div at 56, 236 | box · paint · type | 56, 236 · 281 × 248 · — · — | identical | match |
| div at 56, 236 | box · paint · type | 56, 236 · 281 × 248 · — · — | identical | match |
| div at 120, 276 | radius | 50% | 1px | **mismatch** |
| div at 160, 308 | radius | 50% | 0.75px | **mismatch** |
| div at 295, 270 | radius | 50% | 1px | **mismatch** |
| div at 239.5, 294 | radius | 50% | 0.75px | **mismatch** |
| div at 78, 262 | radius | 50% | - | **mismatch** |
| div at 93, 277 | box · paint · type | 93, 277 · 26 × 26 · — · — | identical | match |
| div at 93, 277 | box · paint · type | 93, 277 · 26 × 26 · — · — | identical | match |
| path at 96.3, 280 | box · paint · type | 96.3, 280 · 19.5 × 19.5 · — · — | identical | match |
| path at 52, 421.2 | box · paint · type | 52, 421.2 · 289 × 62.8 · — · — | identical | match |
| div at 94, 388 | box · paint · type | 94, 388 · 8 × 58 · rgb(44, 56, 68) · r 3px · — | identical | match |
| div at 100, 414 | box · paint · type | 100, 414 · 82 × 21 · rgb(57, 70, 86) · r 6px · — | identical | match |
| div at 106, 405 | box · paint · type | 106, 405 · 28 × 11 · rgb(85, 103, 124) · r 5px · — | identical | match |
| div at 174, 435 | box · paint · type | 174, 435 · 6 × 12 · rgb(38, 48, 60) · r 2px · — | identical | match |
| div at 221, 354 | radius | 50% | - | **mismatch** |
| div at 229, 404 | box · paint · type | 229, 404 · 52 × 9 · rgb(44, 56, 68) · r 3px · — | identical | match |
| div at 253, 413 | box · paint · type | 253, 413 · 8 × 34 · rgb(38, 48, 60) · r 2px · — | identical | match |
| div at 252, 376 | box · paint · type | 252, 376 · 15 × 26 · rgb(220, 227, 234) · r 3px · — | identical | match |
| div at 270, 364 | radius | 50% | 9.5px | **mismatch** |
| svg at 274.5, 369 | box · paint · type | 274.5, 369 · 10 × 9 · — · — | identical | match |
| path at 276.2, 370.7 | box · paint · type | 276.2, 370.7 · 6.7 × 5 · — · — | identical | match |
| div at 56, 484 | box · paint | 56, 484 · 281 × 124 · — | *absent* | **mismatch** |
| div at 74, 500 | box · paint · type | 74, 500 · 245 × 34 · — · — | identical | match |
| div at 74, 500 | radius | 50% | 17px | **mismatch** |
| svg at 83, 509 | box · paint · type | 83, 509 · 16 × 16 · — · — | identical | match |
| path at 85.4, 513.8 | box · paint · type | 85.4, 513.8 · 0 × 7.6 · — · — | identical | match |
| path at 85.4, 515.8 | box · paint · type | 85.4, 515.8 · 11.2 × 5.6 · — · — | identical | match |
| circle at 86.3, 514.9 | box · paint · type | 86.3, 514.9 · 2.4 × 2.4 · — · — | identical | match |
| “Surviving the night” | box · paint · type | 118, 509.5 · 119.5 × 15 · — · 13px/600/normal/normal/rgb(29, 28, 26) | same box and metrics, value "Choose your action" | match (value) |
| “Put the device you use for porn out of reach bef” | box · paint · type | 74, 546 · 245 × 44 · — · 15px/500/normal/22px/rgb(29, 28, 26) | same box and metrics, value "Write three simple rules for situations that have caught you before and make one easier to follow." | match (value) |
| div at 16, 714 | box · paint · type | 16, 714 · 361 × 54 · rgb(19, 19, 19) · r 27px · — | identical | match |
| “Done” | box · paint · type | 175.8, 731.3 · 41.5 × 19.5 · — · 16.5px/600/0.2px/normal/rgb(255, 255, 255) | identical | match |
| “Skip tonight” | box · paint · type | 0, 791 · 393 × 17 · — · 14.5px/500/normal/normal/rgb(139, 136, 130) | identical | match |

**40 elements compared; 30 match, 10 differ.**

## Reading — every row that is not `match`

The radius rows are the notation and node-count classes described in
`DECISIONS.md` D015: a React Native `borderRadius` is a number, not a
percentage, and a CSS `radial-gradient` div becomes a View + Svg + Circle on the
same rect. Every rect is identical.

Two rows are the card's own height, and both follow from one thing:

* **`div at 56, 236` — design 281 × 372, app 281 × 416**, and
  **`div at 56, 484` — design 281 × 124, app 281 × 168.**

The card's chrome is pinned exactly where the canvas puts it — `left: 56 right:
56 top: 236`, radius 18, the same two shadows, a 248-tall art block, and a foot
of `16 / 18 / 18` with a 12 gap — and every element inside it lands on the
canvas's coordinate, including the 34pt mark disc at `74, 500` and its label at
`118, 509.5`. The card is taller only because the body line is longer: the frame
draws day one's action, "Put the device you use for porn out of reach before you
sleep.", which wraps to two 22pt lines, and the seeded account is on day 41,
whose action wraps to four. Both are `curriculum84`'s own `task.cardSummary` for
the day in question — the copy is the account's, not the canvas's, and the two
**match (value)** rows above say so directly.

This is the bundle contradicting itself rather than the app diverging: the same
bundle's `21 · Today` heads its page "Day 41" while this frame draws day one's
lesson.

One implementation change this frame forced: the canvas pins the card at
`top: 236`, where the app had been centring it in a band between the title and
the pill. It is pinned now. The Done pill and "Skip tonight" moved too — see
`DECISIONS.md` D026 — because `DayShell` had been spending the bottom safe-area
inset, which put both 34 below where the frame draws them.
