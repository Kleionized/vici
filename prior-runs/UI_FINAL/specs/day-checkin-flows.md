# Spec — the morning and night check-in flows

Design frames (all `UI Final/project/Email Login.dc.html`):

| Sticky | Frame | Split file |
| --- | --- | --- |
| 21D1 | `Morning 1 Yesterday` | `.uifinal/final/Email Login/Morning-1-Yesterday.html` |
| 21D2 | `Morning Task Check` | `.uifinal/final/Email Login/Morning-Task-Check.html` |
| 21D7 | `Morning 5 Done` | `.uifinal/final/Email Login/Morning-5-Done.html` |
| 21E1 | `Night 1 Mood` | `.uifinal/final/Email Login/Night-1-Mood.html` |
| 21E2 | `Night — Emotions` | `.uifinal/final/Email Login/Checkin-Emotions.html` |
| 21E3 | `Night 2 Record` | `.uifinal/final/Email Login/Night-2-Record.html` |
| 21E4 | `Night — What fed it` | `.uifinal/final/Email Login/Checkin-Reasons.html` |
| 21E5 | `Night 3 Reflection` | `.uifinal/final/Email Login/Night-3-Reflection.html` |
| 21E5B | `Night Action Reminder` | `.uifinal/final/Email Login/Night-Action-Reminder.html` |
| 21E6 | `Night 4 Closed` | `.uifinal/final/Email Login/Night-4-Closed.html` |

App files: `src/app/day/morning.tsx`, `src/app/day/night.tsx`,
`src/components/day/kit.tsx`, `src/components/MoodLogger.tsx`.

Canvas `top` values include the frame's 54px status bar. The app draws under the
safe-area inset, so **every `top` below is the canvas value less 54** unless the
table says otherwise.

---

## 1. The step rail

Transcribed from every frame that carries one.

| Property | Design value |
| --- | --- |
| container | `position:absolute; left:0; right:0; top:72px; display:flex; justify-content:center; gap:7px` |
| inactive dot | `width:6px; height:6px; border-radius:3px` |
| inactive fill (paper) | `rgba(19,19,19,0.18)` |
| inactive fill (night) | `rgba(244,243,240,0.35)` |
| active pill | `width:18px; height:6px; border-radius:3px` |
| active fill (paper) | `#131313` |
| active fill (night) | `#F4F3F0` |

App equivalent: `DayDots` in `components/day/kit.tsx`, already at `top:18`
(= 72 − 54), gap 7, 18×6 / 6×6, radius 3, and the same two fills. **Rail geometry
matches; only the counts change.**

### Step counts — the whole of what changed

| Flow | Frame | Rail (prev) | Rail (final) |
| --- | --- | --- | --- |
| Morning | `Morning 1 Yesterday` | `▬····` (1 of 5) | `▬······` (1 of 7) |
| Morning | `Morning Task Check` | *(no rail)* | `·▬·····` (2 of 7) |
| Morning | `Morning 5 Done` | `····▬` (5 of 5) | `······▬` (7 of 7) |
| Night | `Night 1 Mood` | `▬···` (1 of 4) | `▬·····` (1 of 6) |
| Night | `Checkin Emotions` | 3-dot check-in rail, 2 of 3 | `·▬····` (2 of 6) |
| Night | `Night 2 Record` | `·▬··` (2 of 4) | `··▬···` (3 of 6) |
| Night | `Checkin Reasons` | 3-dot check-in rail, 3 of 3 | `···▬··` (4 of 6) |
| Night | `Night 3 Reflection` | `··▬·` (3 of 4) | `····▬·` (5 of 6) |
| Night | `Night Action Reminder` | *(no rail)* | *(no rail)* |
| Night | `Night 4 Closed` | `···▬` (4 of 4) | `·····▬` (6 of 6) |

`Checkin Emotions` and `Checkin Reasons` previously carried the standalone
check-in's own rail — `top:70px`, `gap:6px`, 7×7 circles at `rgba(0,0,0,0.18)`
with a 22×7 `border-radius:4px` active pill. In `UI Final` they carry the day
flow's rail instead. Together with `Daily Check-in` being deleted from the
canvas, that is the design moving those two questions **into the night flow**.

**Resolved flow order** (see DECISIONS D-007/D-008):

- Night, 6 steps: `1` mood · `2` emotions · `3` record · `4` what fed it ·
  `5` reflection (+ the action reminder as a railless aside) · `6` closed.
- Morning, 7 steps: `1` yesterday · `2` yesterday's task · `3` mood · `4` energy ·
  `5` pledge · `6` today's action · `7` done.

---

## 2. `Checkin Emotions` — "What did today feel like?"

Frame background `#F4F3F0`, grain `noise-dark.png` at `opacity:0.07` over `inset:0`.

| Element | Property | Design value |
| --- | --- | --- |
| Back | box | `left:16px; top:66px; display:flex; align-items:center; gap:9px` |
| Back chevron | svg | `11×19`, `d="M9.5 1.5L2 9.5l7.5 8"`, stroke `#55534E`, width `2.4`, cap+join round |
| Back word | type | `17px / 400 / #55534E` |
| Title | box | `left:0; right:0; top:118px; text-align:center` |
| Title | type | `22px / 500 / letter-spacing 0.1px / #1D1C1A` |
| Title | copy | `What did today feel like?` |
| Sub | box | `left:0; right:0; top:158px; text-align:center` |
| Sub | type | `15px / 400 / #55534E` |
| Sub | copy | `Pick any that ring true.` |
| Wheel svg | box | `left:38px; top:244px; width:316; height:316; viewBox="38 244 316 316"` |
| Wheel svg | shadow | `drop-shadow(0 14px 28px rgba(40,38,32,0.18))` |
| Sector | geometry | 8 × 45°, r `148` about `(196, 402)` — paths listed below |
| Sector | stroke | `rgba(0,0,0,0.14)` at `1.2` |
| Sector fill | unselected | alternating `#FFFFFF` / `#F7F6F3` (index 0 is white when unselected) |
| Sector fill | selected | `#131313` |
| Hub circle | geometry | `cx=196 cy=402 r=44`, fill `#F4F3F0`, stroke `rgba(0,0,0,0.14)` @ `1.2` |
| Label box | size | `width:88px; text-align:center` |
| Label | type | `13px / 500 / #2A2924` unselected, `13px / 600 / #FFFFFF` selected |
| Label positions | frame coords | `(190,302) (243,355) (243,431) (190,484) (114,484) (61,431) (61,355) (114,302)` |
| Hub orb | box | `left:164px; top:370px; 64×64; border-radius:50%; overflow:hidden` |
| Hub orb | ring | `box-shadow:0 0 0 1.5px rgba(0,0,0,0.18)` |
| Hub sky | fill | `linear-gradient(180deg, #EFEEE8 0%, #EFEDE6 100%)` |
| Hub sun | box | `left:20%; top:14%; width:66%; height:66%; border-radius:50%` |
| Hub sun | fill | `radial-gradient(closest-side, rgba(243,227,196,0.9), rgba(243,227,196,0) 78%)` |
| Hub hill 1 | box | `left:-25%; right:-25%; top:66%; height:80%; border-radius:50% 50% 0 0 / 42% 42% 0 0`, fill `#DEDDD6` |
| Hub hill 2 | box | `left:-40%; right:-20%; top:82%; height:80%; border-radius:50% 50% 0 0 / 36% 36% 0 0`, fill `#CFCEC7` |
| Footnote | box | `left:0; right:0; top:582px; text-align:center` |
| Footnote | type | `13.5px / (no weight stated → 400) / #8B8882` |
| Footnote | copy | `Pick as many as fit.` |
| CTA | box | `left:24px; right:24px; top:744px; height:58px; border-radius:29px; background:#131313` |
| CTA | type | `17px / 600 / letter-spacing 0.2px / #FFFFFF` |
| CTA | copy | `Continue` |

Sector paths, verbatim:

```
M196 402 L196.0 254.0 A148 148 0 0 1 300.7 297.3 Z
M196 402 L300.7 297.3 A148 148 0 0 1 344.0 402.0 Z
M196 402 L344.0 402.0 A148 148 0 0 1 300.7 506.7 Z
M196 402 L300.7 506.7 A148 148 0 0 1 196.0 550.0 Z
M196 402 L196.0 550.0 A148 148 0 0 1 91.3 506.7 Z
M196 402 L91.3 506.7 A148 148 0 0 1 48.0 402.0 Z
M196 402 L48.0 402.0 A148 148 0 0 1 91.3 297.3 Z
M196 402 L91.3 297.3 A148 148 0 0 1 196.0 254.0 Z
```

The canvas draws sectors 1 (`Calm`) and 4 (`Hopeful`) selected, so their fills
read `#131313` and their labels `600 / #FFFFFF`; the alternation of the rest is
`#F7F6F3, #FFFFFF, —, #FFFFFF, #F7F6F3, #FFFFFF, #F7F6F3` for indices 1,2,4,5,6,7,
i.e. **odd indices are `#F7F6F3` and even are `#FFFFFF`**.

Wheel words, in sector order: `Calm · Tense · Tired · Hopeful · Flat · Proud ·
Lonely · Restless`.

### Comparison against `src/components/MoodLogger.tsx` (before this run)

| Property | Design | App | |
| --- | --- | --- | --- |
| Title top | 118 → 64 | 64 | match |
| Title type | 22 / 500 / 0.1 / #1D1C1A | same | match |
| Sub top | 158 → 104 | 104 | match |
| Sub type | 15 / 400 / #55534E | same | match |
| Wheel top | 244 → 190 | 190 | match |
| Wheel box | 316 × 316 | 316 × 316 | match |
| Sector paths | (8 above) | identical strings | match |
| Sector strokes | rgba(0,0,0,0.14) @1.2 | same | match |
| Hub circle | r44 #F4F3F0 | same | match |
| Label boxes | 8 × 88 wide | same, offset by (38,244) | match |
| Label type | 13 / 500 / #2A2924 · 13 / 600 / #FFFFFF | same | match |
| Hub orb | 64, ring 1.5px rgba(0,0,0,0.18) | same | match |
| Footnote top | 582 → 528 | 528 | match |
| Footnote type | 13.5 / #8B8882 | same | match |
| CTA | top 744 → 690, 58 tall, r29, #131313, 17/600/0.2 | same | match |
| **Rail** | **6 dots, index 1, day-flow geometry** | **3 dots, check-in geometry** | **MISMATCH** |
| **Owner** | **night flow step 2** | **standalone `/checkin` step 2** | **MISMATCH** |

Everything on the board is already exact; the change is which flow owns the
board and therefore what the rail says.

---

## 3. `Checkin Reasons` — "What fed it?"

| Element | Property | Design value (final) | Design value (prev) |
| --- | --- | --- | --- |
| Title | top / type / copy | `118` / `22 / 500 / 0.1px / #1D1C1A` / `What fed it?` | same |
| Sub | top / type / copy | `158` / `15 / 400 / #55534E` / `A reason list, not a courtroom.` | same |
| Row | box | `left:24px; right:24px; height:60px; border-radius:18px; background:#FFFFFF` | `height:54px; border-radius:14px` |
| Row | layout | `display:flex; align-items:center; gap:14px; padding:0 18px` | `justify-content:space-between; padding:0 16px; gap:13px` |
| Row | tops | `206, 278, 350, 422, 494, 566` (pitch **72**) | `206, 270, 334, 398, 462, 526` (pitch 64) |
| Row | ring, unselected | `0 0 0 1px rgba(0,0,0,0.10)` | `0 0 0 1px rgba(0,0,0,0.1)` |
| Row | ring, selected | `0 0 0 1.6px #131313` | `0 0 0 2px #131313` |
| Row | pressed | `transform:scale(0.99)` | *(none)* |
| Icon disc | box | `38×38; border-radius:50%; flex-shrink:0` | *(no disc)* |
| Icon disc | fill, unselected | `#F1EFE9` | — |
| Icon disc | fill, selected | `#131313` | — |
| Icon | svg | `21×21 viewBox="0 0 24 24"`, `fill:none`, `stroke-width:2`, cap+join round | `22×22`, stroke `#55534E` @2 |
| Icon | stroke, unselected | `#1D1C1A` | `#55534E` |
| Icon | stroke, selected | `#F4F3F0` | `#55534E` |
| Label | type, unselected | `15px / 500 / #1D1C1A`, `flex:1` | `16px / 500 / #1D1C1A` |
| Label | type, selected | `15px / 600 / #1D1C1A` | `16px / 500` |
| Tick | box | `24×24; border-radius:50%; flex-shrink:0` | `24×24` |
| Tick | unselected | `box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.22); box-sizing:border-box` | `inset 0 0 0 1.5px rgba(0,0,0,0.25)` |
| Tick | selected | `background:#131313` + `12×12` check | same |
| Check | svg | `12×12 viewBox="0 0 14 14"`, `d="M2.5 7.5l3 3 6-7"`, stroke `#F4F3F0` @2.2, cap+join round | same |
| CTA | copy | `Continue` | `Log it` |
| CTA | box | `left:24; right:24; top:744; height:58; radius:29; #131313` | same |

Rows drawn, in order, with their selection state: `Poor sleep` (selected),
`Work stress`, `Scrolling late` (selected), `Loneliness`, `Conflict`,
`Real connection`. Icon paths per row, verbatim from the frame:

```
Poor sleep       M14.5 3.5a8.5 8.5 0 1 0 6 12.5 8 8 0 0 1-6-12.5z
Work stress      rect 3,8 18×12 r2.5  +  M9 8V6a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18
Scrolling late   rect 7,2.5 10×19 r2.5  +  M10.5 18.5h3
Loneliness       circle 12,8 r3.6  +  M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6
Conflict         M13 2L5 13.5h5.5L10 22l8-11.5h-5.5z
Real connection  circle 8.5,9 r3.2  +  circle 16.5,9 r3.2  +  M2.5 20c.8-3.4 3.2-5 6-5 1.4 0 2.7.4 3.5 1.2.8-.8 2.1-1.2 3.5-1.2 2.8 0 5.2 1.6 6 5
```

These are the same six paths the app already draws in `ReasonIcon`; only the
presentation around them changed.

---

## 4. `Night Action Reminder` — "Tonight's action"

| Element | Property | Design value (final) | prev |
| --- | --- | --- | --- |
| Title | top / type / copy | `118` / `22 / 500 / 0.1px` / `Tonight’s action` | same |
| Card | box | `left:56; right:56; top:236; border-radius:18; overflow:hidden; #FFFFFF` | same |
| Card | shadow | `0 0 0 1px rgba(0,0,0,0.05), 0 10px 24px rgba(40,38,32,0.07)` | same |
| Art | box | `height:248` | same |
| Art | sky | `linear-gradient(180deg, #0B0C0F 0%, #12151B 60%, #1A2027 100%)` | same |
| Star a | box | `left:64; top:40; 2×2; rgba(244,243,240,0.45)` | `left:84; top:48` |
| Star b | box | `left:104; top:72; 1.5×1.5; rgba(244,243,240,0.3)` | `left:118; top:84` |
| Star c | box | `right:40; top:34; 2×2; rgba(244,243,240,0.35)` | `right:116; top:76` |
| Star d | box | `right:96; top:58; 1.5×1.5; rgba(244,243,240,0.3)` | *(new)* |
| Moon glow | box | `left:22; top:26; 56×56; radial-gradient(closest-side, rgba(223,220,211,0.16), rgba(223,220,211,0) 72%)` | `left:26; top:38; 58×58` |
| Moon | box / svg | `left:37; top:41; 26×26`, `viewBox="0 0 24 24"`, `d="M14 3 A9 9 0 1 0 21 12 A7.2 7.2 0 0 1 14 3Z"`, fill `#E8E6DC` | `left:42; top:54`, svg `30×30` |
| Ridge | svg | `viewBox="0 0 281 248" preserveAspectRatio="none"`, `inset:0`, `d="M-4,248 L-4,196 Q60,178 140,190 Q210,200 285,186 L285,248 Z"`, fill `#171B22` | `viewBox="0 0 361 150"`, different path |
| Bedpost | box | `left:38; top:152; 8×58; r3; #2C3844` | *(new)* |
| Mattress | box | `left:44; top:178; 82×21; r6; #394656` | *(new)* |
| Pillow | box | `left:50; top:169; 28×11; r5; #55677C` | *(new)* |
| Bed foot | box | `left:118; top:199; 6×12; r2; #26303C` | *(new)* |
| Lamp glow | box | `right:24; top:118; 92×92; radial-gradient(closest-side, rgba(226,186,120,0.20), rgba(226,186,120,0) 74%)` | `right:26; top:104; 94×94` |
| Shelf | box | `right:56; top:168; 52×9; r3; #2C3844` | *(new)* |
| Shelf leg | box | `right:76; top:177; 8×34; r2; #26303C` | *(new)* |
| Phone | box | `right:70; top:140; 15×26; r3; #DCE3EA` | *(replaces the desk + tilted phone)* |
| Seal | box | `right:48; top:128; 19×19; r50%; #E9D2A4` | *(new)* |
| Seal tick | svg | `10×9 viewBox="0 0 9 8"`, `d="M1.5 4l2 2 4-4.5"`, stroke `#131313` @1.6, cap+join round | *(new)* |
| Caption pad | box | `padding:16px 18px 18px; gap:12px` | same |
| Mark disc | box | `34×34; r50%; #131313` | same |
| Mark glyph | svg | `16×16 viewBox="0 0 20 20"` — a bed: `M3 15.5V6` @1.7 round; `M3 12.5h14M17 15.5v-5a2 2 0 0 0-2-2H8v4.5` @1.7 round, fill none; `circle 5.6,8.9 r1.5` filled — all `#F4F3F0` | a moon glyph, `15×15` |
| Mark label | type / copy | `13px / 600 / #1D1C1A` / `Surviving the night` | `Tonight` |
| Line | type | `15px / 500 / line-height 22px / #1D1C1A` | same |
| Line | align | `text-align:left; text-wrap:pretty` | `center; balance` |
| Line | copy | `Put the device you use for porn out of reach before you sleep.` | `Put your phone somewhere difficult to access before you sleep.` |
| Done | box / type | `left:16; right:16; bottom:84; height:54; r27; #131313` / `16.5 / 600 / 0.2px / #FFFFFF` | same |
| Skip | box / type / copy | `left:0; right:0; bottom:44; center` / `14.5 / 500 / #8B8882` / `Skip tonight` | same |

The mark label is now the **lesson title** the action came from, not the time of
day. The glyph is a bed rather than a moon.

---

## 5. `Night 1 Mood`

Two changes beyond the rail:

| Element | Property | final | prev |
| --- | --- | --- | --- |
| Moon | mask | `mask-image: radial-gradient(circle 15px at 67% 30%, transparent 0 13.5px, #000 14.5px)` | *(none)* |
| Shadow disc | box | *(deleted)* | `right:112; top:64; 22×22; r50%; #1A2027; opacity:0.55` |

The crescent is now cut out of the disc with a mask instead of being covered by
a second dark disc. Visually the same crescent, but the cut is clean against the
glow rather than leaving a 0.55-opacity disc over it. In RN the mask is drawn as
an SVG `<Mask>` on the moon circle.

Moon disc, for reference: `#DDE4EC`, `box-shadow: 0 0 18px rgba(221,228,236,0.5)`.

---

## 6. Frames whose only change is the rail

`Morning 1 Yesterday`, `Morning 5 Done`, `Night 2 Record`, `Night 3 Reflection`,
`Night 4 Closed` — the diff is the two extra dots and nothing else. Every other
property was compared line by line via
`diff -u .uifinal/pretty/{prev,final}/…` and came back empty.

`Morning Task Check` gains the rail (2 of 7) and the same
`Checkin Reasons`-style card treatment is **not** applied — its card is
unchanged; the +194 bytes are exactly the seven rail children.
