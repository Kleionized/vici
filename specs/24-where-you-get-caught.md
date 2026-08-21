# Root Loop

* **Design frame** `Email-Login/Root Loop`
* **App file** src/components/onboarding/tail.tsx + src/content/onboardingTail.ts

## Transcription — `Root Loop`

Source `UI Final 1/project/Email Login.dc.html`, frame `Root-Loop.html`. Emitted by `scripts/uifinal1/spec.mjs` from the
frame's own inline styles, so every number below is the canvas's, not a reading of a render.
The 54px status bar and the home indicator are omitted (`DECISIONS.md` D009); every other
element on the frame is here, in paint order, indented by depth.

```
<div> position:relative  width:393px  height:852px  flex-shrink:0  background:linear-gradient(180deg, #FAF9F8 0%, #FDFDFC 100%)  box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)  overflow:hidden  font-family:-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif  -webkit-font-smoothing:antialiased
  <div> position:absolute  inset:0  overflow:hidden  pointer-events:none
    <div> position:absolute  left:-40px  top:-140px  width:540px  height:270px  background:radial-gradient(closest-side, rgba(180,170,150,0.14), rgba(19,19,19,0) 72%)  border-radius:50%  filter:blur(6px)
    <div> position:absolute  left:50%  bottom:-300px  width:560px  height:560px  margin-left:-280px  background:radial-gradient(closest-side, rgba(255,236,196,0.42), rgba(255,236,196,0.19) 45%, rgba(255,236,196,0) 72%)  border-radius:50%
    <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.12
  <div> position:absolute  left:36px  right:36px  top:166px  color:#1D1C1A  font-size:24px  font-weight:500  letter-spacing:-0.2px  line-height:32px  text-align:center  text-wrap:balance
    · Sam, this is where you seem to get caught most often.
  <div> position:absolute  left:24px  right:24px  top:316px  padding:18px 12px 12px  background:#FFFFFF  border-radius:20px  box-shadow:0 0 0 1px rgba(0,0,0,0.09)  overflow:hidden
    <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.05  pointer-events:none
    <div> position:absolute  left:50%  top:50%  width:64px  height:64px  margin:-32px 0 0 -32px  background:radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)  border-radius:50%  filter:blur(3px)
    <div> position:absolute  left:50%  top:50%  width:34px  height:34px  margin:-14px 0 0 -17px  background:radial-gradient(circle at 50% 30%, #FBF2E2, #F0DBB4 65%, #DFC08B 100%)  border-radius:50%  box-shadow:0 0 0 1px rgba(0,0,0,0.06)  overflow:hidden
      <div> position:absolute  inset:0  background-image:url('noise-dark.png')  opacity:0.4
    <svg> viewBox="0 0 300 172"  width="100%"  position:relative  display:block
      <ellipse> cx="150"  cy="86"  rx="104"  ry="55"  fill="none"  stroke="#8B8882"  stroke-width="1.7"
      <path> d="M249 80 h11 l-5.5 10 z"  fill="#8B8882"
      <path> d="M40 92 h11 l-5.5 -10 z"  fill="#8B8882"
      <text> x="150"  y="36"  fill="#1D1C1A"  text-anchor="middle"  font-size="11.5"  font-weight="600"  paint-order:stroke  stroke:#FFFFFF  stroke-width:7px  stroke-linejoin:round
        · the loneliness rises
      <text> x="254"  y="90"  fill="#55534E"  text-anchor="middle"  font-size="11"  font-weight="400"  paint-order:stroke  stroke:#FFFFFF  stroke-width:7px  stroke-linejoin:round
        · the escape
      <text> x="150"  y="143"  fill="#55534E"  text-anchor="middle"  font-size="11"  font-weight="400"  paint-order:stroke  stroke:#FFFFFF  stroke-width:7px  stroke-linejoin:round
        · minutes of relief
      <text> x="46"  y="90"  fill="#55534E"  text-anchor="middle"  font-size="11"  font-weight="400"  paint-order:stroke  stroke:#FFFFFF  stroke-width:7px  stroke-linejoin:round
        · back — deeper
  <div> position:absolute  left:44px  right:44px  top:566px  color:#55534E  font-size:14px  font-weight:400  line-height:21px  text-align:center  text-wrap:pretty
    · Late at night · Home alone · Phone in bed — the first situation VICI will help you change.
  <div> position:absolute  left:24px  right:24px  top:744px  height:58px  display:flex  align-items:center  justify-content:center  background:#131313  border-radius:29px  cursor:pointer
    <span> color:#FFFFFF  font-size:17px  font-weight:600  letter-spacing:0.2px
      · Continue
```

## Comparison — design frame vs the running app

Both sides measured with the same probe (`.uifinal1/probe.js`): every visible box's rect in
frame coordinates plus its background, radius, opacity, shadow and type metrics. The design
frame is served from the split at `localhost:8097`; the app is the Expo web build. The canvas
status bar and home indicator are excluded on both sides (`DECISIONS.md` D009).

| Element | Property | Design | App | Result |
| --- | --- | --- | --- | --- |
| div at -40, -140 | radius | 50% | - | **mismatch** |
| div at -83.5, 592 | radius | 50% | - | **mismatch** |
| “Sam, this is where you seem to get caught most o” | box · paint | 36, 166 · 321 × 64 · — | *absent* | **mismatch** |
| div at 24, 316 | box · paint · type | 24, 316 · 345 × 214 · rgb(255, 255, 255) · r 20px · rgba(0, 0, 0, 0.09) 0px 0px 0px 1px · — | identical | match |
| div at 24, 316 | opacity | 0.05 | - | **mismatch** |
| div at 164.5, 391 | radius | 50% | - | **mismatch** |
| div at 179.5, 409 | radius | 50% | 17px | **mismatch** |
| div at 179.5, 409 | opacity | 0.4 | - | **mismatch** |
| svg at 36, 334 | box · paint · type | 36, 334 · 321 × 184 · — · — | identical | match |
| ellipse at 85.2, 367.2 | box · paint · type | 85.2, 367.2 · 222.6 × 117.7 · — · — | identical | match |
| path at 302.4, 419.6 | box · paint · type | 302.4, 419.6 · 11.8 × 10.7 · — · — | identical | match |
| path at 78.8, 421.7 | box · paint · type | 78.8, 421.7 · 11.8 × 10.7 · — · — | identical | match |
| “the loneliness rises” | box · paint | 137.9, 360.5 · 117.2 × 14.5 · — | *absent* | **mismatch** |
| “the escape” | box · paint · type | 276.9, 418.8 · 61.8 × 14 · — · 11px/400/normal/normal/rgb(0, 0, 0) | identical | match |
| “minutes of relief” | box · paint · type | 151.1, 475.5 · 90.8 × 14 · — · 11px/400/normal/normal/rgb(0, 0, 0) | identical | match |
| “back — deeper” | box · paint · type | 43.5, 418.8 · 83.5 × 14 · — · 11px/400/normal/normal/rgb(0, 0, 0) | identical | match |
| “Late at night · Home alone · Phone in bed — the ” | box · paint | 44, 566 · 305 × 42 · — | *absent* | **mismatch** |
| div at 24, 744 | box · paint · type | 24, 744 · 345 × 58 · rgb(19, 19, 19) · r 29px · — | identical | match |
| “Continue” | box · paint · type | 159.7, 763 · 73.7 × 20 · — · 17px/600/0.2px/normal/rgb(255, 255, 255) | identical | match |

**19 elements compared; 10 match, 9 differ.**

## Resolutions

* **The title and the caption are personalised**, so they read as one row missing and one extra
  with the same box and metrics. The canvas's sample says "Sam"; the app says the name he gave.
* **The loop's first station** names the feeling with a noun: the canvas's sample draws
  "the loneliness rises", the app draws whichever of `O3_ISSUE`'s words the answers select. Every
  noun in that table is a word the bundle or the app already uses — see `DECISIONS.md` and the
  table's own comment.
* **The canvas's caption disagrees with the canvas's own answers.** It lists
  "Late at night · Home alone · Phone in bed", but `11 · Risky Times`, two frames earlier in the
  same bundle, draws `Late at night`, `After stress` and `Phone in bed` selected. The app lists
  what was actually picked.
* **`paint-order: stroke`** — the canvas knocks each label out of the ellipse by painting a 7pt
  white stroke *under* the fill. React Native SVG has no paint-order property, so each label is
  drawn twice, stroke first. That is why four labels report as one design element against two app
  elements; the pixels are the same.
* The glow and the bead are placed from the card's own top-left rather than by a centring rule:
  the canvas puts them at `left:50%; top:50%` with `margin-top` −32 and −14, so the bead sits
  3 below the card's centre and the glow on it. Both measure identically now.
