# Pass 1 — Lesson reader B (second reader)

Bundle **Email Login**. Frames `Lesson-Scroll-13`, `Lesson-Scroll-16`,
`Lesson-Scroll-23`, `Lesson-Scroll-26`.

App under audit:
- `/Users/admin/Documents/tideline/src/components/lesson/scroll.tsx`
- `/Users/admin/Documents/tideline/src/app/lesson/day/[day].tsx`
- `/Users/admin/Documents/tideline/src/content/lessonScroll01.ts`

Canvas is 393 × 852. Every `top` in the frames includes a 54px status bar the
app never builds, so **app top = canvas top − 54**; both are given where a top
appears. Bottom-anchored values are unaffected.

Page → frame mapping (`LESSON_SCROLL_01`, 26 entries, `count = 26`):
index 12 → frame 13, index 15 → frame 16, index 22 → frame 23, index 25 → frame 26.
Hairline `round((index+1)/count × 100)` gives 50 / 62 / 88 / 100, which is what
all four frames literally state. That arithmetic is correct.

`MISMATCH*` = RN cannot express the CSS; the substitute is named.

---

## Frame 13 — the clock board (`prose` + `clock` mark)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| 13 | screen | background | `#F4F3F0` | `#F4F3F0` (scroll.tsx:334) | match |
| 13 | grain | image / opacity | `noise-dark.png` / `0.07` | `noise-dark.png` / `0.07` (scroll.tsx:335) | match |
| 13 | Close | left / top | `16` / canvas `66` → app `12` | `left:16, top:12` (scroll.tsx:352) | match |
| 13 | Close | font-size / weight / colour | `17` / `400` / `#3A3934` | `17` / `sans('400')` / `#3A3934` (scroll.tsx:353) | match |
| 13 | Close | z-index | `5` | `zIndex:5` (scroll.tsx:352) | match |
| 13 | progress track | left / right / top | `16` / `16` / canvas `108` → app `54` | `16 / 16 / 54` (scroll.tsx:357) | match |
| 13 | progress track | height / radius / colour | `2` / `1` / `rgba(0,0,0,0.05)` | `2` / `1` / `rgba(0,0,0,0.05)` | match |
| 13 | progress fill | width / colour / radius | `50%` / `#B4B1AB` / `1` | `50%` (computed) / `#B4B1AB` / `1` (scroll.tsx:358) | match |
| 13 | stack | inset / direction / align / justify | `inset:0` col, center, center | absolute `top:-54, height:h+54`, center/center (scroll.tsx:365) | match |
| 13 | stack | gap | `48` | `STACK_GAP = 48` (scroll.tsx:26) | match |
| 13 | stack | padding | `0 38px` | `paddingHorizontal: 38` | match |
| 13 | title | font-size / weight / line-height | `26` / `500` / `38` | `26` / `500` / `38` (scroll.tsx:91) | match |
| 13 | title | colour / align / max-width | `#1D1C1A` / center / `300` | `#1D1C1A` / center / `300` | match |
| 13 | title | text-wrap | `balance` | not expressible | MISMATCH* (RN has no `text-wrap`; substitute = natural wrap at `maxWidth:300`) |
| 13 | title | copy | `Think about the last night` | same (lessonScroll01.ts:62) | match |
| 13 | clock box | width / height | `96` / `96` | `96` / `96` (scroll.tsx:242) | match |
| 13 | clock face | inset / radius / bg | `inset:0` / `50%` / `#FFFFFF` | `0,0,96,96` / `48` / `#FFFFFF` (scroll.tsx:243) | match |
| 13 | clock face | box-shadow | `inset 0 0 0 2.5px #E4E2DB, 0 8px 20px rgba(40,38,32,0.1)` | identical string | match |
| 13 | tick N | left / top / w / h / radius / colour | `46.75` / `8` / `2.5` / `7` / `1` / `#C9C7C0` | identical (scroll.tsx:244) | match |
| 13 | tick S | left / top / w / h | `46.75` / `81` / `2.5` / `7` | identical (scroll.tsx:245) | match |
| 13 | tick W | left / top / w / h | `8` / `46.75` / `7` / `2.5` | identical (scroll.tsx:246) | match |
| 13 | tick E | left / top / w / h | `81` / `46.75` / `7` / `2.5` | identical (scroll.tsx:247) | match |
| 13 | minute hand | left / top / w / h / radius / colour | `46.5` / `20` / `3` / `28` / `1.5` / `#1D1C1A` | identical (scroll.tsx:248) | match |
| 13 | hour hand | left / top / w / h / radius / colour | `46.5` / `28` / `3` / `20` / `1.5` / `#1D1C1A` | identical (scroll.tsx:251) | match |
| 13 | hour hand | transform / origin | `rotate(-52deg)` / `50% 100%` | `rotate:'-52deg'` / `'50% 100%'` | match |
| 13 | hub | left / top / w / h / radius / colour | `44` / `44` / `8` / `8` / `50%` / `#1D1C1A` | identical (scroll.tsx:253) | match |
| 13 | clock | z-order | face, 4 ticks, minute, hour, hub | same child order | match |
| 13 | prose | size / weight / line-height / colour | `21` / `400` / `36` / `#55534E` | `21` / `400` / `36` / `#55534E` (scroll.tsx:100) | match |
| 13 | prose | max-width / align | `310` / center | `310` / center | match |
| 13 | prose | text-wrap | `pretty` | not expressible | MISMATCH* (substitute = default wrap) |
| 13 | prose | copy | `Go back to the last time it happened at night. Where were you before the searching started?` | same (lessonScroll01.ts:63) | match |
| 13 | board | CTA pill | none drawn | `PageFooter` returns null for `prose` ([day].tsx:170) | match |
| 13 | order | children | title → mark → prose | Statement → Mark → Prose ([day].tsx:117-122) | match |

**Frame 13 carries no closable defect.** The clock is transcribed layer for
layer, including the 46.75 / 46.5 half-pixel split between the ticks and the
hands and the `50% 100%` hour-hand origin.

---

## Frame 16 — the pick-one board (`pick`)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| 16 | progress fill | width | `62%` | `62%` (computed) | match |
| 16 | stack | gap | **`40`** | `48` ([day].tsx:63 passes `undefined` → `STACK_GAP=48`) | **MISMATCH** |
| 16 | stack | padding | `0 38px` | `38` | match |
| 16 | title | size / weight / line-height / colour | `26` / `500` / `38` / `#1D1C1A` | same | match |
| 16 | title | max-width | **`310`** | `300` (scroll.tsx:91) | **MISMATCH** |
| 16 | title | text-wrap | `balance` | — | MISMATCH* (natural wrap) |
| 16 | title | copy | `Where do most of your night-time relapses begin?` | same | match |
| 16 | spacer | height | **`18`** (zero-width child ⇒ 40+18+40 = 98 between title and helper) | absent — Statement sits one 48-gap from helper | **MISMATCH** |
| 16 | helper | font-size | **`15`** | `21` (rendered through `Prose`, [day].tsx:199) | **MISMATCH** |
| 16 | helper | font-weight | **`500`** | `400` | **MISMATCH** |
| 16 | helper | colour | **`#8B8882`** | `#55534E` | **MISMATCH** |
| 16 | helper | line-height | not declared (natural) | `36` | **MISMATCH** |
| 16 | helper | align | center | center | match |
| 16 | helper | copy | `Pick the one that happens most.` | same | match |
| 16 | option list | direction / gap / align-self | column / `12` / stretch | column / `12` / stretch ([day].tsx:200) | match |
| 16 | option row | height | `56` | `56` (+`minHeight:56`) | match |
| 16 | option row | radius | `16` | `16` `borderCurve:'continuous'` | match |
| 16 | option row | background | `#FFFFFF` | `#FFFFFF` | match |
| 16 | option row | padding | `0 18px` | `paddingHorizontal:18` | match |
| 16 | option row | gap / direction / align | `14` / row / center | `14` / row / center | match |
| 16 | option row (selected) | box-shadow ring | **`0 0 0 2px #1D1C1A`** | `0 0 0 1.6px #131313` ([day].tsx:215) | **MISMATCH** |
| 16 | option row (selected) | box-shadow drop | **`0 4px 10px rgba(40,38,32,0.08)`** | absent | **MISMATCH** |
| 16 | option row (unselected) | box-shadow | **`inset 0 0 0 1.5px #E4E2DB`** | `0 0 0 1px rgba(0,0,0,0.10)` (outset) | **MISMATCH** |
| 16 | radio | width / height / radius | `22` / `22` / `50%` | `22` / `22` / `11` | match |
| 16 | radio (selected) | border | **`2px solid #1D1C1A`**, `box-sizing:border-box` | none — the whole 22pt disc is filled `#131313` ([day].tsx:226) | **MISMATCH** |
| 16 | radio (selected) | fill | **`radial-gradient(circle, #1D1C1A 0 5px, rgba(0,0,0,0) 5.5px)`** — a 10pt dark dot on transparent, 4pt clear annulus inside the ring | an 8pt `#F4F3F0` dot on a solid dark disc ([day].tsx:231) — inverted | **MISMATCH** |
| 16 | radio (unselected) | box-shadow | **`inset 0 0 0 1.6px #C9C7C0`** | `inset 0 0 0 1.5px rgba(0,0,0,0.22)` ([day].tsx:227) | **MISMATCH** |
| 16 | radio | flex-shrink | `0` | not set (no shrink pressure — label has `flex:1`) | match |
| 16 | option label (selected) | font-size | **`16`** | `15` ([day].tsx:233) | **MISMATCH** |
| 16 | option label (selected) | weight / colour | `600` / `#1D1C1A` | `600` / `#1D1C1A` | match |
| 16 | option label (unselected) | font-size | **`16`** | `15` | **MISMATCH** |
| 16 | option label (unselected) | weight / colour | `500` / `#1D1C1A` | `500` / `#1D1C1A` | match |
| 16 | options | copy ×4 | `In bed with my phone` · `Alone on my computer` · `When I can’t sleep` · `Somewhere else` | identical (lessonScroll01.ts:80) | match |
| 16 | state drawn | which row is selected | option 1 | `useState(page.options[0])` ([day].tsx:195) | match |
| 16 | CTA pill | left / right / bottom | `16` / `16` / `30` | `16` / `16` / `30` ([day].tsx:178-180) | match |
| 16 | CTA pill | height | **`52`** | `54` (+`minHeight:54`) ([day].tsx:181) | **MISMATCH** |
| 16 | CTA pill | border-radius | **`26`** | `27` ([day].tsx:183) | **MISMATCH** |
| 16 | CTA pill | background | `#131313` | `#131313` | match |
| 16 | CTA pill | align / justify | center / center | center / center | match |
| 16 | CTA label | size / weight / colour | `17` / `600` / `#FFFFFF` | `17` / `600` / `#FFFFFF` ([day].tsx:188) | match |
| 16 | CTA label | letter-spacing | **`0.2`** | not set (AppText drops inherited tracking when a size is named) | **MISMATCH** |
| 16 | CTA label | copy | `Continue` | `'Continue'` ([day].tsx:172) | match |

---

## Frame 23 — the task board and its rule card (`task`)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| 23 | progress fill | width | `88%` | `88%` (computed) | match |
| 23 | stack | gap | **`30`** | `48` | **MISMATCH** |
| 23 | eyebrow | size / weight / letter-spacing | `12` / `600` / `1.8` | `12` / `600` / `1.8` (scroll.tsx:33) | match |
| 23 | eyebrow | colour / align | `#B0AEA8` / center | `#B0AEA8` / center | match |
| 23 | eyebrow | copy | `DAY 1 · TONIGHT’S TASK` | same (lessonScroll01.ts:103) | match |
| 23 | spacer | height | **`16`** (⇒ 30+16+30 = 76 between eyebrow and title) | absent ([day].tsx:137-138) | **MISMATCH** |
| 23 | title | size / weight / line-height / colour / max-width | `26` / `500` / `38` / `#1D1C1A` / `300` | same | match |
| 23 | title | text-wrap | `balance` | — | MISMATCH* (natural wrap) |
| 23 | title | copy | `Surviving the night` | same | match |
| 23 | night scene | slot | `height:170`, `justify-content:center`, `flex-shrink:0` | **absent — the `task` page renders no mark at all** ([day].tsx:134-142) | **MISMATCH** |
| 23 | night scene | wrapper transform | `scale(0.85)`, origin `top center` | absent | **MISMATCH** |
| 23 | night scene | drawing box | `340 × 200`, inner clip `overflow:hidden` | absent | **MISMATCH** |
| 23 | scene · moon | left/top/w/h/radius/bg | `43` / `31` / `18` / `18` / `50%` / `#C5C4BD` | absent | **MISMATCH** |
| 23 | scene · moon | mask | `radial-gradient(circle at 15.3px 5.58px, transparent 7.02px, #000 7.38px)` | absent | MISMATCH* (RN has no `mask-image`; substitute = `Svg` `<Mask>` with a two-stop radial, as `CrescentMark` already does) |
| 23 | scene · star a | left/top/w/h/colour | `96` / `30` / `2` / `2` / `rgba(200,225,235,0.35)` | absent | **MISMATCH** |
| 23 | scene · star b | left/top/w/h/colour | `30` / `74` / `2` / `2` / `rgba(200,225,235,0.3)` | absent | **MISMATCH** |
| 23 | scene · star c | left/top/w/h/colour | `258` / `36` / `2.5` / `2.5` / `rgba(200,225,235,0.4)` | absent | **MISMATCH** |
| 23 | scene · floor | left/top/w/h | `-30` / `158` / `400` / `72` | absent | **MISMATCH** |
| 23 | scene · floor | radius / bg | `50% 50% 0 0 / 26px 26px 0 0` / `#EAE9E3` | absent | **MISMATCH** (elliptical corner ⇒ `Path` arc, as `CoverScene` does) |
| 23 | scene · bed shadow | left/top/w/h/radius/bg/blur | `29` / `155` / `118` / `11` / `50%` / `rgba(0,0,0,0.09)` / `blur(5px)` | absent | MISMATCH* (no `filter:blur`; substitute = radial `Ellipse` ramp) |
| 23 | scene · headboard | left/top/w/h/radius/bg | `28` / `96` / `10` / `62` / `5 5 3 3` / `#D6D5D0` | absent | **MISMATCH** |
| 23 | scene · mattress | left/top/w/h/radius/bg | `36` / `126` / `104` / `24` / `6 10 5 5` / `#E0DFDA` | absent | **MISMATCH** |
| 23 | scene · duvet | left/top/w/h/radius/bg | `70` / `124` / `70` / `26` / `12 12 5 4` / `#C9C8C1` | absent | **MISMATCH** |
| 23 | scene · duvet fold | left/top/w/h/radius/bg | `76` / `130` / `56` / `4` / `2` / `rgba(255,255,255,0.55)` | absent | **MISMATCH** |
| 23 | scene · pillow | left/top/w/h/radius/bg | `40` / `117` / `28` / `14` / `7 7 5 5` / `#FFFFFF` | absent | **MISMATCH** |
| 23 | scene · pillow | box-shadow | `inset 0 -2.5px 0 #D6D5D0, 0 1.5px 3px rgba(40,38,32,0.14)` | absent | **MISMATCH** |
| 23 | scene · bed leg L | left/top/w/h/radius/bg | `38` / `150` / `6` / `8` / `0 0 2 2` / `#C6C5C0` | absent | **MISMATCH** |
| 23 | scene · bed leg R | left/top/w/h/radius/bg | `130` / `150` / `6` / `8` / `0 0 2 2` / `#C6C5C0` | absent | **MISMATCH** |
| 23 | scene · door frame | left/top/w/h/radius/bg | `196` / `54` / `64` / `104` / `6 6 0 0` / `#F7F6F2` | absent | **MISMATCH** |
| 23 | scene · door frame | box-shadow | `inset 0 0 0 6px #E4E3DE, 0 6px 14px rgba(40,38,32,0.12)` | absent | **MISMATCH** |
| 23 | scene · doorway light | left/top/w/h | `204` / `62` / `42` / `96` | absent | **MISMATCH** |
| 23 | scene · doorway light | gradient | `linear-gradient(90deg, rgba(233,210,164,0.8) 0%, rgba(243,227,196,0.3) 55%, rgba(244,243,240,0.12) 100%)` | absent | **MISMATCH** |
| 23 | scene · door | left/top/w/h/radius/bg | `240` / `60` / `20` / `98` / `2` / `#D6D5D0` | absent | **MISMATCH** |
| 23 | scene · door | transform / origin / shadow | `skewY(-7deg)` / `top right` / `-4px 3px 7px rgba(40,38,32,0.16)` | absent | **MISMATCH** |
| 23 | scene · knob | left/top/w/h/radius/bg | `244` / `99.76` / `4` / `4` / `50%` / `#8A857C` | absent | **MISMATCH** (`99.75999999999999` verbatim) |
| 23 | scene · floor spill | left/top/w/h | `200` / `158` / `84` / `12` | absent | **MISMATCH** |
| 23 | scene · floor spill | gradient / clip-path | `linear-gradient(100deg, rgba(233,210,164,0.5), rgba(233,210,164,0.06))` / `polygon(6% 0, 78% 0, 100% 100%, 0 100%)` | absent | MISMATCH* (no `clip-path`; substitute = `Svg` `<Path>` with the same four points) |
| 23 | scene · shadow (bed side) | left/top/w/h/bg/blur | `193` / `160` / `82` / `11` / `rgba(0,0,0,0.07)` / `blur(5px)` | absent | MISMATCH* (radial `Ellipse` ramp) |
| 23 | scene · shadow (table) | left/top/w/h/bg/blur | `283` / `160` / `38` / `11` / `rgba(0,0,0,0.08)` / `blur(5px)` | absent | MISMATCH* (radial `Ellipse` ramp) |
| 23 | scene · table top | left/top/w/h/radius/bg | `282` / `136` / `40` / `8` / `4` / `#DEDDD7` | absent | **MISMATCH** |
| 23 | scene · table leg L | left/top/w/h/radius/bg | `289` / `144` / `5` / `20` / `2.5` / `#C6C5C0` | absent | **MISMATCH** |
| 23 | scene · table leg R | left/top/w/h/radius/bg | `310` / `144` / `5` / `20` / `2.5` / `#C6C5C0` | absent | **MISMATCH** |
| 23 | scene · phone glow | left/top/w/h | `285` / `113` / `34` / `34` | absent | **MISMATCH** |
| 23 | scene · phone glow | gradient / blur | `radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)` / `blur(5px)` | absent | MISMATCH* (blur folded into the falloff) |
| 23 | scene · phone shadow | left/top/w/h/bg/blur | `279` / `135` / `46` / `11` / `rgba(0,0,0,0.09)` / `blur(5px)` | absent | MISMATCH* (radial `Ellipse` ramp) |
| 23 | scene · phone | left/top/w/h/radius | `284` / `127` / `36` / `9` / `4` | absent | **MISMATCH** |
| 23 | scene · phone | gradient / ring | `linear-gradient(180deg, #12151B 0%, #1A2027 100%)` / `0 0 0 1.6px #2A2E35` | absent | **MISMATCH** |
| 23 | scene · phone screen | left/top/w/h/radius/bg | `296` / `129.5` / `12` / `2.5` / `1` / `rgba(190,205,220,0.28)` | absent | **MISMATCH** |
| 23 | prose | size / weight / line-height / colour / max-width | `21` / `400` / `36` / `#55534E` / `310` | same | match |
| 23 | prose | copy | `Set up tonight before you get tired. Use the option that matches where you sleep.` | same (lessonScroll01.ts:105) | match |
| 23 | rule card | align-self / radius / bg | stretch / `16` / `#FFFFFF` | stretch / `16` / `#FFFFFF` ([day].tsx:245) | match |
| 23 | rule card | box-shadow hairline | **`0 0 0 1px rgba(0,0,0,0.07)`** | `0 0 0 1px rgba(0,0,0,0.06)` | **MISMATCH** |
| 23 | rule card | box-shadow drop | **`0 6px 16px rgba(40,38,32,0.05)`** | absent | **MISMATCH** |
| 23 | rule card | padding | **`17px 18px`** | `16` on all four sides | **MISMATCH** |
| 23 | rule card | gap | **`14`** | `10` | **MISMATCH** |
| 23 | rule card | align-items | **`center`** | unset (RN default `stretch`), faked with `marginTop:3` on the icon | **MISMATCH** |
| 23 | rule card | direction | row | row | match |
| 23 | rule icon | width / height | **`20` / `20`** | `16` / `16` ([day].tsx:246) | **MISMATCH** |
| 23 | rule icon | viewBox | **`0 0 18 18`** | `0 0 16 13` | **MISMATCH** |
| 23 | rule icon | ring | **`<circle cx="9" cy="9" r="7.5" fill="none" stroke="#1D1C1A" stroke-width="1.6"/>`** | absent — the app draws a bare tick with no ring | **MISMATCH** |
| 23 | rule icon | tick path `d` | **`M5.8 9l2.3 2.3 4.1-4.6`** | `M1.5 7l4.4 4.5L14.5 1.5` | **MISMATCH** |
| 23 | rule icon | tick stroke / width | **`#1D1C1A`** / **`1.7`** | `#131313` / `2.4` ([day].tsx:247) | **MISMATCH** |
| 23 | rule icon | linecap / linejoin | round / round | round / round | match |
| 23 | rule icon | flex-shrink | `0` | not set (label has `flex:1`, so no shrink pressure) | match |
| 23 | rule text | font-size | **`15`** | `14` ([day].tsx:249) | **MISMATCH** |
| 23 | rule text | line-height | **`22`** | `20` | **MISMATCH** |
| 23 | rule text | colour | **`#55534E`** | `#1D1C1A` | **MISMATCH** |
| 23 | rule text | weight / align | `500` / left | `500` / left (default) | match |
| 23 | rule text | text-wrap | `pretty` | — | MISMATCH* (natural wrap) |
| 23 | rule text | copy | `Done when you can’t reach your usual device from bed without standing up.` | same (lessonScroll01.ts:106) | match |
| 23 | board | CTA pill | none drawn | `PageFooter` null for `task` | match |

Note: `ScrollPage`'s `task` variant (`lessonScroll01.ts:24`) has no `mark`
field, so the scene above cannot be requested even if the component existed.

---

## Frame 26 — the completion board (`done`)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| 26 | progress fill | width | `100%` | `100%` (computed) | match |
| 26 | stack | gap | **`44`** | `48` | **MISMATCH** |
| 26 | sun mark | box | `position:relative`, `36 × 36`, `flex-shrink:0` | **absent — the `done` page renders no mark** ([day].tsx:158-164) | **MISMATCH** |
| 26 | sun halo | left / top | `-39.5` / `-39.5` | absent | **MISMATCH** |
| 26 | sun halo | width / height / radius | `115` / `115` / `50%` | absent | **MISMATCH** |
| 26 | sun halo | gradient | `radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 76%)` | absent | **MISMATCH** |
| 26 | sun halo | filter | `blur(3px)` | absent | MISMATCH* (no `filter:blur`; substitute = absorb into the stop falloff) |
| 26 | sun disc | inset / radius | `0` / `50%` | absent | **MISMATCH** |
| 26 | sun disc | gradient | `radial-gradient(circle at 34% 30%, #F3E3C4 0%, #E2BA78 58%, #C49856 100%)` — no size keyword ⇒ farthest-corner, r = √(23.76² + 25.2²) = 34.63 on a 36 box | absent | **MISMATCH** |
| 26 | sun disc | box-shadow | `0 2px 6px rgba(160,120,50,0.3)` | absent | **MISMATCH** |
| 26 | sun mark | reusability | — | `SunDot` (scroll.tsx:146) hard-codes `halo`/`off` for size 12 and 14 only; at 36 it would give halo 45 / off 15.5, not 115 / −39.5 | **MISMATCH** |
| 26 | title | size / weight / line-height / colour / max-width | `26` / `500` / `38` / `#1D1C1A` / `300` | same | match |
| 26 | title | text-wrap | `balance` | — | MISMATCH* (natural wrap) |
| 26 | title | copy | `Lesson complete.` | same (lessonScroll01.ts:123) | match |
| 26 | prose | size / weight / line-height / colour / max-width | `21` / `400` / `36` / `#55534E` / `310` | same | match |
| 26 | prose | copy | `Your answer is saved to the log. One decision tonight — get to tomorrow.` | same, `&mdash;` resolved to `—` | match |
| 26 | CTA pill | left / right / bottom | `16` / `16` / `30` | `16` / `16` / `30` | match |
| 26 | CTA pill | height | **`52`** | `54` | **MISMATCH** |
| 26 | CTA pill | border-radius | **`26`** | `27` | **MISMATCH** |
| 26 | CTA pill | background | `#131313` | `#131313` | match |
| 26 | CTA label | size / weight / colour | `17` / `600` / `#FFFFFF` | `17` / `600` / `#FFFFFF` | match |
| 26 | CTA label | letter-spacing | **`0.2`** | not set | **MISMATCH** |
| 26 | CTA label | copy | `Done` | `page.cta` = `'Done'` | match |

Note: `ScrollPage`'s `done` variant (`lessonScroll01.ts:27`) has no `mark`
field either.

---

## Findings

Every closable MISMATCH, in frame order.

### Frame 16 — pick-one board

1. `src/app/lesson/day/[day].tsx:63` — stack gap for the `pick` page is `48`
   (falls through to `STACK_GAP`, `src/components/lesson/scroll.tsx:26`).
   Design: `40`.
2. `src/components/lesson/scroll.tsx:91` — `Statement` `maxWidth: 300`.
   Design (frame 16): `max-width:310`.
3. `src/app/lesson/day/[day].tsx:198-199` — no spacer between title and helper.
   Design: a `height:18` zero-width child sits between them (⇒ 40 + 18 + 40).
4. `src/app/lesson/day/[day].tsx:199` — the helper is rendered with `<Prose>`:
   `fontSize 21 / weight 400 / lineHeight 36 / #55534E`. Design: `font-size:15;
   font-weight:500; color:#8B8882` with no declared line-height — the `Meta`
   slot, not `Prose`.
5. `src/app/lesson/day/[day].tsx:215` — selected row `boxShadow:
   '0 0 0 1.6px #131313'`. Design: `0 0 0 2px #1D1C1A, 0 4px 10px rgba(40,38,32,0.08)`
   (ring is 2, not 1.6; colour `#1D1C1A`; the drop shadow is missing).
6. `src/app/lesson/day/[day].tsx:215` — unselected row `boxShadow:
   '0 0 0 1px rgba(0,0,0,0.10)'` (outset). Design: `inset 0 0 0 1.5px #E4E2DB`.
7. `src/app/lesson/day/[day].tsx:226,231` — the selected radio is inverted: the
   app fills the whole 22pt disc `#131313` and puts an 8pt `#F4F3F0` dot inside.
   Design: `border:2px solid #1D1C1A` over a transparent body with
   `radial-gradient(circle, #1D1C1A 0 5px, rgba(0,0,0,0) 5.5px)` — a 10pt dark
   dot with a 4pt clear annulus between it and the ring.
8. `src/app/lesson/day/[day].tsx:227` — unselected radio `boxShadow:
   'inset 0 0 0 1.5px rgba(0,0,0,0.22)'`. Design: `inset 0 0 0 1.6px #C9C7C0`.
9. `src/app/lesson/day/[day].tsx:233` — option label `fontSize: 15`.
   Design: `16` (both the `600` selected and the `500` unselected state).
10. `src/app/lesson/day/[day].tsx:181-182` — CTA pill `height: 54`,
    `minHeight: 54`. Design: `52`.
11. `src/app/lesson/day/[day].tsx:183` — CTA pill `borderRadius: 27`.
    Design: `26`.
12. `src/app/lesson/day/[day].tsx:188` — CTA label has no `letterSpacing`.
    Design: `letter-spacing:0.2px`.

### Frame 23 — task board and rule card

13. `src/app/lesson/day/[day].tsx:63` — stack gap for the `task` page is `48`.
    Design: `30`.
14. `src/app/lesson/day/[day].tsx:137-138` — no spacer between eyebrow and
    title. Design: a `height:16` zero-width child (⇒ 30 + 16 + 30).
15. `src/app/lesson/day/[day].tsx:134-142` — **the entire night-room scene is
    missing.** Design draws a `height:170` centred slot holding a
    `transform:scale(0.85)` / `transform-origin:top center` wrapper around a
    `340 × 200` `overflow:hidden` box with 27 layers (masked crescent at 43,31;
    three stars; the 400 × 72 elliptical floor at −30,158; the bed — headboard
    28,96, mattress 36,126, duvet 70,124 with its 76,130 fold, pillow 40,117,
    legs 38,150 and 130,150; the doorway — frame 196,54, light wedge 204,62,
    `skewY(-7deg)` door 240,60, knob 244,99.76, floor spill 200,158; the side
    table 282,136 with legs 289,144 and 310,144; the phone 284,127 with its
    glow 285,113 and screen line 296,129.5; and four blurred cast shadows at
    29,155 / 193,160 / 283,160 / 279,135). Full per-layer values are in the
    frame-23 table above. `ScrollPage`'s `task` variant
    (`src/content/lessonScroll01.ts:24`) also has no `mark` field to request it.
16. `src/app/lesson/day/[day].tsx:245` — rule card `boxShadow:
    '0 0 0 1px rgba(0,0,0,0.06)'`. Design: `0 0 0 1px rgba(0,0,0,0.07),
    0 6px 16px rgba(40,38,32,0.05)` — alpha is 0.07 and the drop shadow is
    missing.
17. `src/app/lesson/day/[day].tsx:245` — rule card `padding: 16`.
    Design: `17px 18px`.
18. `src/app/lesson/day/[day].tsx:245` — rule card `gap: 10`. Design: `14`.
19. `src/app/lesson/day/[day].tsx:245-246` — rule card has no `alignItems`, and
    the icon is nudged with `marginTop: 3`. Design: `align-items:center`, no
    icon offset.
20. `src/app/lesson/day/[day].tsx:246` — rule icon `width={16} height={16}
    viewBox="0 0 16 13"`. Design: `width="20" height="20" viewBox="0 0 18 18"`.
21. `src/app/lesson/day/[day].tsx:246-248` — the icon's outer ring is missing.
    Design: `<circle cx="9" cy="9" r="7.5" fill="none" stroke="#1D1C1A"
    stroke-width="1.6"/>` behind the tick.
22. `src/app/lesson/day/[day].tsx:247` — tick `d="M1.5 7l4.4 4.5L14.5 1.5"`,
    `stroke="#131313"`, `strokeWidth={2.4}`. Design: `d="M5.8 9l2.3 2.3
    4.1-4.6"`, `stroke="#1D1C1A"`, `stroke-width="1.7"`.
23. `src/app/lesson/day/[day].tsx:249` — rule text `fontSize: 14,
    lineHeight: 20, color: '#1D1C1A'`. Design: `15 / 22 / #55534E`.

### Frame 26 — completion board

24. `src/app/lesson/day/[day].tsx:63` — stack gap for the `done` page is `48`.
    Design: `44`.
25. `src/app/lesson/day/[day].tsx:158-164` — **the sun mark is missing.**
    Design: a `36 × 36` box holding a `115 × 115` halo at `left:-39.5;
    top:-39.5` with `radial-gradient(closest-side, rgba(226,186,120,0.4),
    rgba(226,186,120,0) 76%)` and `blur(3px)`, over a disc with
    `radial-gradient(circle at 34% 30%, #F3E3C4 0%, #E2BA78 58%, #C49856 100%)`
    and `box-shadow:0 2px 6px rgba(160,120,50,0.3)`.
    `SunDot` (`src/components/lesson/scroll.tsx:146-150`) hard-codes its halo
    for size 12/14 only and would give 45 / −15.5 at size 36, not 115 / −39.5.
    `ScrollPage`'s `done` variant (`src/content/lessonScroll01.ts:27`) has no
    `mark` field either.
26. `src/app/lesson/day/[day].tsx:181-183,188` — same CTA pill defects as
    frame 16: `height 54` and `minHeight 54` vs `52`, `borderRadius 27` vs `26`,
    and no `letterSpacing: 0.2` on the label.

### Not closable in RN (MISMATCH*)

- `text-wrap: balance` on every `Statement` and `text-wrap: pretty` on every
  `Prose` and on the rule-card text — RN has no `text-wrap`; the substitute is
  the natural break inside the declared `maxWidth`.
- `filter: blur(5px)` on the four frame-23 cast shadows and `blur(3px)` on the
  frame-26 halo — the substitute is a `react-native-svg` radial ramp whose
  stops reproduce the falloff, which is the pattern `CoverScene` already uses
  (`src/app/lesson/day/[day].tsx:287-298`).
- `mask-image` on the frame-23 crescent — substitute is an SVG `<Mask>` with a
  two-stop radial, as `CrescentMark` already does
  (`src/components/lesson/scroll.tsx:193-198`).
- `clip-path: polygon(...)` on the frame-23 floor spill — substitute is an SVG
  `<Path>` through the same four points.
- `border-radius: 50% 50% 0 0 / 26px 26px 0 0` on the frame-23 floor — RN has no
  elliptical corner radii; substitute is an SVG arc `Path`.
