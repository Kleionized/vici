# Pass 1 — nightly check-in (second reader)

Bundle **Email Login**. Frames audited, in flow order:

| Step | Frame | Pretty source |
|---|---|---|
| 0 | Night 1 Mood | `.uifinal/pretty/final/Email Login/Night-1-Mood.html` |
| 1 | Checkin Emotions | `.uifinal/pretty/final/Email Login/Checkin-Emotions.html` |
| 2 | Night 2 Record | `.uifinal/pretty/final/Email Login/Night-2-Record.html` |
| 3 | Checkin Reasons | `.uifinal/pretty/final/Email Login/Checkin-Reasons.html` |
| 4 | Night 3 Reflection | `.uifinal/pretty/final/Email Login/Night-3-Reflection.html` |
| 5 | Night Action Reminder | `.uifinal/pretty/final/Email Login/Night-Action-Reminder.html` |
| 6 | Night 4 Closed | `.uifinal/pretty/final/Email Login/Night-4-Closed.html` |

App under audit:

- `/Users/admin/Documents/tideline/src/app/day/night.tsx`
- `/Users/admin/Documents/tideline/src/components/day/kit.tsx`
- `/Users/admin/Documents/tideline/src/components/MoodLogger.tsx`

Supporting files read in full for token resolution (not audited, but every literal below was
traced through them): `src/components/ui/AppText.tsx`, `src/components/ui/Grain.tsx`,
`src/components/ui/marks.tsx` (`BackGlyph`), `src/components/ui/press-scale.tsx`,
`src/lib/theme.ts`, `src/lib/curriculum.ts`, `src/content/interactiveLessons.ts`,
`src/content/curriculum84.ts`.

## Coordinate convention

Every frame is 393 × 852 and every `top` in it includes a 54px status bar the app never builds.
The app equivalent is `canvas top − 54`. Both numbers are given in every position row as
`C<canvas> → <app>`.

Residual worth stating once: 393 × 852 is the iPhone 14 Pro / 15 / 16 logical size, whose real top
safe-area inset is **59**, not 54. `DayShell` puts children inside `SafeAreaView edges={['top','bottom']}`,
so a child at app-top *T* renders at device *y* = 59 + T = canvas + 5. That +5 is inherent to the
sanctioned mapping and is **not** counted as a mismatch below — but it is what makes finding F5
(the CTA clamp) fire, because the pill clamps *up* by 5 while everything above it drifts *down* by 5.

## Legend

- **match** — app value is the design literal.
- **MISMATCH** — a difference the app can close.
- **MISMATCH\*** — RN cannot express the CSS; the substitute is named in the row.

---

## Frame: Night 1 Mood (step 0)

### Root / field

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Night 1 Mood | screen root | width | 393px | flex:1 (device) | match |
| Night 1 Mood | screen root | height | 852px | flex:1 (device) | match |
| Night 1 Mood | screen root | background | `#F4F3F0` | `kit.tsx:175` `backgroundColor:'#F4F3F0'` | match |
| Night 1 Mood | screen root | overflow | hidden | n/a (device viewport) | match |
| Night 1 Mood | screen root | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | iOS `System`; web `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif` (`theme.ts:159`) | match (first family identical; tail of the stack differs, no effect on Apple platforms) |
| Night 1 Mood | screen root | -webkit-font-smoothing | antialiased | `AppText.tsx:127` web only | match |
| Night 1 Mood | screen root | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | match (frame-chrome only, not app chrome) |
| Night 1 Mood | grain | position / inset | absolute, inset 0 | `Grain` absolute 0,0,0,0 (`Grain.tsx:16`) | match |
| Night 1 Mood | grain | background-image | `url('noise-dark.png')` | `assets/images/noise-dark.png` | match |
| Night 1 Mood | grain | background-repeat | repeat (implicit, no `background-size`) | `resizeMode="repeat"` (`Grain.tsx:17`) | match |
| Night 1 Mood | grain | opacity | 0.07 | 0.07 (`kit.tsx:176`) | match |
| Night 1 Mood | grain | pointer-events | none | `pointerEvents="none"` | match |
| Night 1 Mood | grain | z-order | painted before the night band | `<Grain/>` then `{backdrop}` (`kit.tsx:176–177`) | match |

### Night band (`NightSky height=212 hillTop=142`)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Night 1 Mood | night band | left / right / top | 0 / 0 / 0 | 0 / 0 / 0 (`kit.tsx:604`) | match |
| Night 1 Mood | night band | height | 212px | `height={212}` (`night.tsx:168`) | match |
| Night 1 Mood | night band | overflow | hidden | `overflow:'hidden'` | match |
| Night 1 Mood | night band | gradient angle | `linear-gradient(180deg, …)` | `LinearGradient` default vertical (`kit.tsx:605`) | match |
| Night 1 Mood | night band | stop 1 | `#14171B` @ 0% | `#14171B`, location 0 | match |
| Night 1 Mood | night band | stop 2 | `#1A2027` @ 55% | `#1A2027`, location 0.55 | match |
| Night 1 Mood | night band | stop 3 | `#232B34` @ 100% | `#232B34`, location 1 | match |
| Night 1 Mood | moon halo | right / top | 74 / 30 | right 74, top 30 (`kit.tsx:606`) | match |
| Night 1 Mood | moon halo | width / height | 110 / 110 | `size={110}` | match |
| Night 1 Mood | moon halo | border-radius | 50% | `Circle r=55` | match |
| Night 1 Mood | moon halo | gradient type | `radial-gradient(closest-side, …)` | `RadialGradient rx/ry 50%` on a square bbox = closest-side | match |
| Night 1 Mood | moon halo | stop 1 | `rgba(226,232,240,0.22)` @ 0 | `#E2E8F0` @ 0.22, offset 0 | match |
| Night 1 Mood | moon halo | stop 2 | `rgba(226,232,240,0)` @ 78% | `#E2E8F0` @ 0, offset 0.78 | match |
| Night 1 Mood | moon disc | right / top | 104 / 60 | right 104, top 60 (`kit.tsx:567`) | match |
| Night 1 Mood | moon disc | width / height | 34 / 34 | 34 / 34 | match |
| Night 1 Mood | moon disc | border-radius | 50% | `Circle cx17 cy17 r17` | match |
| Night 1 Mood | moon disc | background | `#DDE4EC` | `#DDE4EC` (`kit.tsx:592`) | match |
| Night 1 Mood | moon disc | mask-image | `radial-gradient(circle 15px at 67% 30%, transparent 0 13.5px, #000 14.5px)` | SVG `Mask`: white rect + circle cx22.78 cy10.2 r14.5, stops 0/0.931 black → 1 white (`kit.tsx:582–590`); 0.67·34=22.78, 0.30·34=10.2, 13.5/14.5=0.93103 | match |
| Night 1 Mood | moon disc | box-shadow | `0 0 18px rgba(221,228,236,0.5)` — **clipped away** by `mask-clip: border-box` | 70×70 radial proxy, stops 0.486/0.614/0.743/0.871/1 (`kit.tsx:568–579`) | **MISMATCH** — see F11 |
| Night 1 Mood | moon crescent bite | fill | night gradient shows through | `#DDE4EC` @ 0.25 (glow proxy pads below its 0.486 first stop) | **MISMATCH** — see F11 |
| Night 1 Mood | star 1 | left / top / size / alpha | 60 / 52 / 2.5 / `rgba(244,243,240,0.6)` | `[60,52,2.5,0.6]` (`kit.tsx:542`) | match |
| Night 1 Mood | star 2 | left / top / size / alpha | 110 / 92 / 2 / `rgba(244,243,240,0.4)` | `[110,92,2,0.4]` | match |
| Night 1 Mood | star 3 | left / top / size / alpha | 158 / 44 / 2 / `rgba(244,243,240,0.5)` | `[158,44,2,0.5]` | match |
| Night 1 Mood | star 4 | left / top / size / alpha | 210 / 84 / 2.5 / `rgba(244,243,240,0.35)` | `[210,84,2.5,0.35]` | match |
| Night 1 Mood | star 5 | left / top / size / alpha | 84 / 128 / 2 / `rgba(244,243,240,0.3)` | `[84,128,2,0.3]` | match |
| Night 1 Mood | stars | border-radius | 50% | `size/2` | match |
| Night 1 Mood | hill A | left / right | −60 / −60 | `left={-60} right={-60}` (`kit.tsx:614`) | match |
| Night 1 Mood | hill A | top | 142 | `hillTop=142` (`night.tsx:168`) | match |
| Night 1 Mood | hill A | height | 110 | 110 | match |
| Night 1 Mood | hill A | border-radius | `50% 50% 0 0 / 50px 50px 0 0` | SVG arc `A (w/2) 50` from `M0 50` to `w 50` (`kit.tsx:79`), w = 393+120 = 513, rx 256.5 | match |
| Night 1 Mood | hill A | background | `#1C232B` | `#1C232B` | match |
| Night 1 Mood | hill B | left / right | −120 / −30 | `left={-120} right={-30}` (`kit.tsx:615`) | match |
| Night 1 Mood | hill B | top | 162 | `hillTop + 20` = 162 | match |
| Night 1 Mood | hill B | height | 110 | 110 | match |
| Night 1 Mood | hill B | border-radius | `50% 50% 0 0 / 44px 44px 0 0` | `ry={44}`, w = 393+150 = 543, rx 271.5 | match |
| Night 1 Mood | hill B | background | `#242C36` | `#242C36` | match |
| Night 1 Mood | horizon tick | left / top | 70 / 172 | left 70, `hillTop+30` = 172 (`kit.tsx:616`) | match |
| Night 1 Mood | horizon tick | width / height | 18 / 2.5 | 18 / 2.5 | match |
| Night 1 Mood | horizon tick | border-radius | 2 | 2 | match |
| Night 1 Mood | horizon tick | background | `rgba(244,243,240,0.14)` | `rgba(244,243,240,0.14)` | match |

### Status bar

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Night 1 Mood | status bar | height / padding / layout | 54, `6px 32px 0 46px`, space-between | not built (system bar) | n/a |
| Night 1 Mood | status bar | content colour | `#F4F3F0` (light) | `StatusBar style="light"` when `dark` (`night.tsx:138`, `dark = step 0 \|\| step 6`) | match |

### Back affordance

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Night 1 Mood | back row | left | 16 | 16 (`kit.tsx:132`) | match |
| Night 1 Mood | back row | top | C66 → 12 | 12 | match |
| Night 1 Mood | back row | flex-direction / align | row / center | row / center | match |
| Night 1 Mood | back row | gap | 9 | 9 | match |
| Night 1 Mood | back chevron | svg width / height | 11 / 19 | 11 / 19 (`marks.tsx:216`) | match |
| Night 1 Mood | back chevron | viewBox | `0 0 11 19` | `0 0 11 19` | match |
| Night 1 Mood | back chevron | path `d` | `M9.5 1.5L2 9.5l7.5 8` | `M9.5 1.5L2 9.5l7.5 8` | match |
| Night 1 Mood | back chevron | fill | none | `fill="none"` | match |
| Night 1 Mood | back chevron | stroke | `#55534E` | `#55534E` (`kit.tsx:133`) | match |
| Night 1 Mood | back chevron | stroke-width | 2.4 | 2.4 | match |
| Night 1 Mood | back chevron | linecap / linejoin | round / round | round / round | match |
| Night 1 Mood | back label | text | `Back` | `Back` | match |
| Night 1 Mood | back label | font-size | 17 | 17 (`kit.tsx:134`) | match |
| Night 1 Mood | back label | font-weight | 400 | `sans('400')` | match |
| Night 1 Mood | back label | color | `#55534E` | `#55534E` | match |
| Night 1 Mood | back label | letter-spacing | none stated | dropped by `AppText` (own fontSize, no own letterSpacing) | match |

### Rail

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Night 1 Mood | rail | left / right | 0 / 0 | 0 / 0 (`kit.tsx:89`) | match |
| Night 1 Mood | rail | top | C72 → 18 | 18 | match |
| Night 1 Mood | rail | justify-content | center | center | match |
| Night 1 Mood | rail | gap | 7 | 7 | match |
| Night 1 Mood | rail | dot count | 6 | `RAIL = 6` (`night.tsx:48`) | match |
| Night 1 Mood | rail | active index | 0 (first dot is the stadium) | `RAIL_AT[0] = 0` (`night.tsx:51`) | match |
| Night 1 Mood | rail active dot | width / height / radius | 18 / 6 / 3 | 18 / 6 / 3 | match |
| Night 1 Mood | rail active dot | background | `#F4F3F0` | `light ? '#F4F3F0'` (light = dark step) | match |
| Night 1 Mood | rail inactive dot | width / height / radius | 6 / 6 / 3 | 6 / 6 / 3 | match |
| Night 1 Mood | rail inactive dot | background | `rgba(244,243,240,0.35)` | `rgba(244,243,240,0.35)` | match |

### CTA

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Night 1 Mood | CTA | left / right | 16 / 16 | 16 / 16 (`kit.tsx:197–198`) | match |
| Night 1 Mood | CTA | top | C756 → 702 | `min(702, height − 52 − 10)` = **697** on 393×852 (`kit.tsx:173`) | **MISMATCH** — see F5 |
| Night 1 Mood | CTA | height | 52 | 52 (`CTA_HEIGHT`) | match |
| Night 1 Mood | CTA | border-radius | 26 | `pill/2` = 26 | match |
| Night 1 Mood | CTA | background | `#131313` | `#131313` | match |
| Night 1 Mood | CTA | align / justify | center / center | center / center | match |
| Night 1 Mood | CTA label | text | `Continue` | `label[0] = 'Continue'` (`night.tsx:126`) | match |
| Night 1 Mood | CTA label | font-size | 17 | 17 (`kit.tsx:207`) | match |
| Night 1 Mood | CTA label | font-weight | 600 | `sans('600')` | match |
| Night 1 Mood | CTA label | letter-spacing | none stated | `ctaWide ? 0.2 : 0` → 0 | match |
| Night 1 Mood | CTA label | color | `#FFFFFF` | `#FFFFFF` | match |

### Question and scale

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Night 1 Mood | title | text | `How was today?` | `How was today?` (`night.tsx:171`) | match |
| Night 1 Mood | title | left | 24 | 24 (`kit.tsx:254`) | match |
| Night 1 Mood | title | right bound | none (line box runs to the frame edge) | no `right` set | match |
| Night 1 Mood | title | top | C270 → 216 | `top={216}` | match |
| Night 1 Mood | title | font-size | 27 | 27 | match |
| Night 1 Mood | title | font-weight | 500 | `sans('500')` | match |
| Night 1 Mood | title | letter-spacing | −0.1 | −0.1 | match |
| Night 1 Mood | title | color | `#1D1C1A` | `#1D1C1A` | match |
| Night 1 Mood | title | line-height | not stated | inherited variant leading deleted (`AppText.tsx:139`) | match |
| Night 1 Mood | dial row | left / right | 24 / 24 | 24 / 24 (`kit.tsx:265`) | match |
| Night 1 Mood | dial row | top | C380 → 326 | `top={326}` (`night.tsx:172`) | match |
| Night 1 Mood | dial row | flex-direction / justify | row / space-between | row / space-between | match |
| Night 1 Mood | dial circle | width / height | 48 / 48 | 48 / 48 | match |
| Night 1 Mood | dial circle | border-radius | 50% | 24 | match |
| Night 1 Mood | dial circle (off) | background | `#FFFFFF` | `#FFFFFF` | match |
| Night 1 Mood | dial circle (off) | box-shadow | `inset 0 0 0 1.5px rgba(0,0,0,0.12)` | same string (`kit.tsx:283`) | match |
| Night 1 Mood | dial circle (on) | background | `#131313` | `#131313` | match |
| Night 1 Mood | dial circle (on) | box-shadow | `0 0 0 2px #F4F3F0, 0 0 0 4px #131313` | same string | match |
| Night 1 Mood | dial circle (on) | which index | 3rd of 5 (index 2) | `useState(2)` (`night.tsx:82`) | match |
| Night 1 Mood | dial pip | width / height / radius | 11 / 11 / 50% | 11 / 11 / 5.5 (`kit.tsx:285`) | match |
| Night 1 Mood | dial pip | background | `#F4F3F0` | `#F4F3F0` | match |
| Night 1 Mood | scale ends | left / right | 24 / 24 | 24 / 24 (`kit.tsx:296`) | match |
| Night 1 Mood | scale ends | top | C444 → 390 | `top={390}` | match |
| Night 1 Mood | scale ends | justify-content | space-between | space-between | match |
| Night 1 Mood | scale ends | font-size | 12.5 | 12.5 | match |
| Night 1 Mood | scale ends | font-weight | 500 | `sans('500')` | match |
| Night 1 Mood | scale ends | color | `#8B8882` | `#8B8882` | match |
| Night 1 Mood | scale end left | text | `Heavy` | `low="Heavy"` | match |
| Night 1 Mood | scale end right | text | `Bright` | `high="Bright"` | match |
| Night 1 Mood | reading label | left / right | 0 / 0 | 0 / 0 (`kit.tsx:307`) | match |
| Night 1 Mood | reading label | top | C502 → 448 | `top={448}` | match |
| Night 1 Mood | reading label | text-align | center | `center` | match |
| Night 1 Mood | reading label | font-size | 19 | 19 | match |
| Night 1 Mood | reading label | font-weight | 600 | `sans('600')` | match |
| Night 1 Mood | reading label | color | `#1D1C1A` | `#1D1C1A` | match |
| Night 1 Mood | reading label | text | `Mixed` | `MOOD_READ[2][0] = 'Mixed'` (`night.tsx:56`) | match |
| Night 1 Mood | reading note | top | C532 → 478 | `top + 30` = 478 (`kit.tsx:310`) | match |
| Night 1 Mood | reading note | font-size | 13.5 | 13.5 | match |
| Night 1 Mood | reading note | font-weight | 400 | `sans('400')` | match |
| Night 1 Mood | reading note | color | `#8B8882` | `#8B8882` | match |
| Night 1 Mood | reading note | text | `Some of both` | `MOOD_READ[2][1] = 'Some of both'` | match |
| Night 1 Mood | paint order | CTA vs middle | CTA painted before title/dial | CTA painted last | match (no overlap) |

---

## Frame: Checkin Emotions (step 1)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Checkin Emotions | root | background | `#F4F3F0` | `#F4F3F0` | match |
| Checkin Emotions | grain | inset / opacity | 0 / 0.07 | 0 / 0.07 | match |
| Checkin Emotions | status bar | content colour | `#1D1C1A` (dark) | `StatusBar style="dark"` (step ≠ 0,6) | match |
| Checkin Emotions | back row | left / top | 16 / C66 → 12 | 16 / 12 | match |
| Checkin Emotions | back chevron/label | all | as Night 1 Mood | same `DayBack` | match |
| Checkin Emotions | rail | top / gap / justify | C72 → 18 / 7 / center | 18 / 7 / center | match |
| Checkin Emotions | rail | dot count | 6 | 6 | match |
| Checkin Emotions | rail | active index | 1 | `RAIL_AT[1] = 1` | match |
| Checkin Emotions | rail active dot | size / radius / colour | 18×6 / 3 / `#131313` | 18×6 / 3 / `#131313` (`light=false`) | match |
| Checkin Emotions | rail inactive dot | colour | `rgba(19,19,19,0.18)` | `rgba(19,19,19,0.18)` | match |
| Checkin Emotions | title | left / right | 0 / 0 | 0 / 0 (`MoodLogger.tsx:533`) | match |
| Checkin Emotions | title | top | C118 → 64 | 64 | match |
| Checkin Emotions | title | text-align | center | center | match |
| Checkin Emotions | title | font-size | 22 | 22 | match |
| Checkin Emotions | title | font-weight | 500 | `sans('500')` | match |
| Checkin Emotions | title | letter-spacing | 0.1 | 0.1 | match |
| Checkin Emotions | title | color | `#1D1C1A` | `#1D1C1A` | match |
| Checkin Emotions | title | text | `What did today feel like?` | `feel="What did today feel like?"` (`night.tsx:178`) | match |
| Checkin Emotions | subtitle | top | C158 → 104 | 104 (`MoodLogger.tsx:541`) | match |
| Checkin Emotions | subtitle | font-size | 15 | 15 | match |
| Checkin Emotions | subtitle | font-weight | 400 | `sans('400')` | match |
| Checkin Emotions | subtitle | color | `#55534E` | `#55534E` | match |
| Checkin Emotions | subtitle | text | `Pick any that ring true.` | `Pick any that ring true.` (`MoodLogger.tsx:581`) | match |
| Checkin Emotions | wheel svg | width / height | 316 / 316 | 316 / 316 (`MoodLogger.tsx:335`) | match |
| Checkin Emotions | wheel svg | viewBox | `38 244 316 316` | `38 244 316 316` (`MoodLogger.tsx:347`) | match |
| Checkin Emotions | wheel svg | left | 38 | centred (`left:0,right:0,alignItems:'center'`) → 38.5 on 393 | **MISMATCH** — see F9 |
| Checkin Emotions | wheel svg | top | C244 → 190 | 190 (`MoodLogger.tsx:334`) | match |
| Checkin Emotions | wheel svg | filter | `drop-shadow(0 14px 28px rgba(40,38,32,0.18))` | `boxShadow '0 14px 28px rgba(40,38,32,0.18)'` on a 296 circle proxy at (10,10) (`MoodLogger.tsx:341`) | MISMATCH\* — substitute: circle-shaped boxShadow proxy behind the disc |
| Checkin Emotions | sector 1 | path `d` | `M196 402 L196.0 254.0 A148 148 0 0 1 300.7 297.3 Z` | identical (`MoodLogger.tsx:122`) | match |
| Checkin Emotions | sector 2 | path `d` | `M196 402 L300.7 297.3 A148 148 0 0 1 344.0 402.0 Z` | identical | match |
| Checkin Emotions | sector 3 | path `d` | `M196 402 L344.0 402.0 A148 148 0 0 1 300.7 506.7 Z` | identical | match |
| Checkin Emotions | sector 4 | path `d` | `M196 402 L300.7 506.7 A148 148 0 0 1 196.0 550.0 Z` | identical | match |
| Checkin Emotions | sector 5 | path `d` | `M196 402 L196.0 550.0 A148 148 0 0 1 91.3 506.7 Z` | identical | match |
| Checkin Emotions | sector 6 | path `d` | `M196 402 L91.3 506.7 A148 148 0 0 1 48.0 402.0 Z` | identical | match |
| Checkin Emotions | sector 7 | path `d` | `M196 402 L48.0 402.0 A148 148 0 0 1 91.3 297.3 Z` | identical | match |
| Checkin Emotions | sector 8 | path `d` | `M196 402 L91.3 297.3 A148 148 0 0 1 196.0 254.0 Z` | identical | match |
| Checkin Emotions | sector fill (on) | fill | `#131313` (sectors 1 and 4) | `on ? '#131313'` | match |
| Checkin Emotions | sector fill (odd idx) | fill | `#F7F6F3` (idx 1, 5, 7) | `index % 2 ? '#F7F6F3'` | match |
| Checkin Emotions | sector fill (even idx) | fill | `#FFFFFF` (idx 2, 4, 6) | `: '#FFFFFF'` | match |
| Checkin Emotions | sector | stroke | `rgba(0,0,0,0.14)` | `rgba(0,0,0,0.14)` | match |
| Checkin Emotions | sector | stroke-width | 1.2 | 1.2 | match |
| Checkin Emotions | hub circle | cx / cy / r | 196 / 402 / 44 | 196 / 402 / 44 (`MoodLogger.tsx:352`) | match |
| Checkin Emotions | hub circle | fill | `#F4F3F0` | `#F4F3F0` | match |
| Checkin Emotions | hub circle | stroke / width | `rgba(0,0,0,0.14)` / 1.2 | same | match |
| Checkin Emotions | label box | width | 88 | 88 (`MoodLogger.tsx:364`) | match |
| Checkin Emotions | label box | text-align | center | `center` | match |
| Checkin Emotions | label | font-size | 13 | 13 | match |
| Checkin Emotions | label (on) | font-weight / colour | 600 / `#FFFFFF` | `sans('600')` / `#FFFFFF` | match |
| Checkin Emotions | label (off) | font-weight / colour | 500 / `#2A2924` | `sans('500')` / `#2A2924` | match |
| Checkin Emotions | label 1 | left / top (disc-relative) | 190−38=152 / 302−244=58 | `{left:152, top:58}` | match |
| Checkin Emotions | label 2 | left / top | 205 / 111 | `{205,111}` | match |
| Checkin Emotions | label 3 | left / top | 205 / 187 | `{205,187}` | match |
| Checkin Emotions | label 4 | left / top | 152 / 240 | `{152,240}` | match |
| Checkin Emotions | label 5 | left / top | 76 / 240 | `{76,240}` | match |
| Checkin Emotions | label 6 | left / top | 23 / 187 | `{23,187}` | match |
| Checkin Emotions | label 7 | left / top | 23 / 111 | `{23,111}` | match |
| Checkin Emotions | label 8 | left / top | 76 / 58 | `{76,58}` | match |
| Checkin Emotions | wheel words | word set / order | Calm, Tense, Tired, Hopeful, Flat, Proud, Lonely, Restless — drawn on the frame that follows a **Mixed** dial | `wheelFor(mood+1)` with `mood=2` → `WHEELS[2]` = Flat, Restless, Tired, Uneasy, Distracted, Calm, Impatient, Hopeful | **MISMATCH** — see F1 |
| Checkin Emotions | hub scene box | left / top (disc-rel) | 164−38=126 / 370−244=126 | `{left:126, top:126}` (`MoodLogger.tsx:373`) | match |
| Checkin Emotions | hub scene box | width / height | 64 / 64 | 64 / 64 | match |
| Checkin Emotions | hub scene box | border-radius | 50% | 32 | match |
| Checkin Emotions | hub scene box | overflow | hidden | hidden | match |
| Checkin Emotions | hub scene box | box-shadow | `0 0 0 1.5px rgba(0,0,0,0.18)` | same string | match |
| Checkin Emotions | hub sky | gradient | `linear-gradient(180deg, #EFEEE8 0%, #EFEDE6 100%)` | `SvgLinearGradient` (0,0)→(0,64), `#EFEEE8`→`#EFEDE6` (`MoodLogger.tsx:315`) | match |
| Checkin Emotions | hub sun | box | left 20%, top 14%, 66%×66% of 64 → centre (33.92, 30.08), closest-side r 21.12 | `cx 33.92 cy 30.08 rx/ry 21.12` (`MoodLogger.tsx:319`) | match |
| Checkin Emotions | hub sun | stop 1 | `rgba(243,227,196,0.9)` @ 0 | `#F3E3C4` @ 0.9, offset 0 | match |
| Checkin Emotions | hub sun | stop 2 | `rgba(243,227,196,0)` @ 78% | `#F3E3C4` @ 0, offset 0.78 | match |
| Checkin Emotions | hub hill A | resolved geometry | left −16, width 96, top 42.24, height 51.2, rx 48, ry 21.504 | `M-16 93.44 L-16 63.744 A48 21.504 0 0 1 80 63.744 L80 93.44 Z` (`MoodLogger.tsx:326`) | match |
| Checkin Emotions | hub hill A | fill | `#DEDDD6` | `#DEDDD6` | match |
| Checkin Emotions | hub hill B | resolved geometry | left −25.6, width 102.4, top 52.48, height 51.2, rx 51.2, ry 18.432 | `M-25.6 103.68 L-25.6 70.912 A51.2 18.432 0 0 1 76.8 70.912 L76.8 103.68 Z` | match |
| Checkin Emotions | hub hill B | fill | `#CFCEC7` | `#CFCEC7` | match |
| Checkin Emotions | helper line | left / right / top | 0 / 0 / C582 → 528 | 0 / 0 / 528 (`MoodLogger.tsx:583`) | match |
| Checkin Emotions | helper line | text-align | center | center | match |
| Checkin Emotions | helper line | font-size | 13.5 | 13.5 | match |
| Checkin Emotions | helper line | font-weight | not stated → 400 | `sans('400')` | match |
| Checkin Emotions | helper line | color | `#8B8882` | `#8B8882` | match |
| Checkin Emotions | helper line | text | `Pick as many as fit.` | `Pick as many as fit.` | match |
| Checkin Emotions | "Something else…" region | — | frame draws nothing between C606 and C744 | ScrollView at app-top 552 (C606) with chips / own-word field | addition (frame silent) |
| Checkin Emotions | CTA | left / right | 24 / 24 | 24 / 24 (`MoodLogger.tsx:186`) | match |
| Checkin Emotions | CTA | top | C744 → 690 | `min(690, height − 58 − 16)` = **685** on 393×852 | **MISMATCH** — see F5 |
| Checkin Emotions | CTA | height | 58 | 58 (`CTA_HEIGHT`) | match |
| Checkin Emotions | CTA | border-radius | 29 | 29 | match |
| Checkin Emotions | CTA | background | `#131313` | `#131313` | match |
| Checkin Emotions | CTA label | font-size / weight | 17 / 600 | 17 / `sans('600')` | match |
| Checkin Emotions | CTA label | letter-spacing | 0.2 | 0.2 | match |
| Checkin Emotions | CTA label | color | `#FFFFFF` | `#FFFFFF` | match |
| Checkin Emotions | CTA | disabled state | frame draws only the enabled pill | `opacity 0.32` when `emotions.length === 0` (`night.tsx:152`) | addition (frame silent) |

---

## Frame: Night 2 Record (step 2)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Night 2 Record | grain | inset / opacity | 0 / 0.07 | 0 / 0.07 | match |
| Night 2 Record | backdrop | — | none | `backdrop` undefined for step 2 | match |
| Night 2 Record | status bar | content colour | `#1D1C1A` | `dark` | match |
| Night 2 Record | rail | active index | 2 | `RAIL_AT[2] = 2` | match |
| Night 2 Record | rail | count / top / gap | 6 / C72 → 18 / 7 | 6 / 18 / 7 | match |
| Night 2 Record | back row | left / top | 16 / C66 → 12 | 16 / 12 | match |
| Night 2 Record | title | text | `The record.` | `The record.` (`night.tsx:182`) | match |
| Night 2 Record | title | left / top | 24 / C170 → 116 | 24 / 116 | match |
| Night 2 Record | title | font-size / weight / tracking / colour | 27 / 500 / −0.1 / `#1D1C1A` | same | match |
| Night 2 Record | ledger card | left / right | 12 / 12 | 12 / 12 (`night.tsx:183`) | match |
| Night 2 Record | ledger card | top | C240 → 186 | 186 | match |
| Night 2 Record | ledger card | height | 230 | 230 | match |
| Night 2 Record | ledger card | border-radius | 14 | 14 | match |
| Night 2 Record | ledger card | background | `#FFFFFF` | `#FFFFFF` | match |
| Night 2 Record | ledger card | box-shadow | `0 0 0 1px rgba(0,0,0,0.06)` | same string | match |
| Night 2 Record | row 1 | left / right / top / height | 16 / 16 / 14 / 48 | 16 / 16 / 14 / 48 (`kit.tsx:735`) | match |
| Night 2 Record | row 1 | flex / align / gap | row / center / 13 | row / center / 13 | match |
| Night 2 Record | row chip | width / height / radius | 36 / 36 / 50% | 36 / 36 / 18 | match |
| Night 2 Record | row chip | background | `#F1EFE9` | `#F1EFE9` | match |
| Night 2 Record | row 1 glyph | svg width / height | 13 / 11 | `glyph={[13,11]}` (`night.tsx:186`) | match |
| Night 2 Record | row 1 glyph | viewBox | `0 0 16 13` | `0 0 16 13` (`kit.tsx:717`) | match |
| Night 2 Record | row 1 glyph | path `d` | `M1.5 7l4.4 4.5L14.5 1.5` | identical | match |
| Night 2 Record | row 1 glyph | stroke / width / caps | `#131313` / 2.6 / round, round | `#131313` / 2.6 / round, round | match |
| Night 2 Record | row 1 glyph | fill | none | `fill="none"` | match |
| Night 2 Record | row title | flex / font-size / weight / colour | 1 / 15 / 500 / `#1D1C1A` | `flex:1` / 15 / `sans('500')` / `#1D1C1A` | match |
| Night 2 Record | row 1 title | text | `Pledge kept` | `pledge ? 'Pledge kept' : 'No pledge signed today'` | match |
| Night 2 Record | row detail | font-size / weight / colour | 13.5 / 500 / `#8B8882` | 13.5 / `sans('500')` / `#8B8882` | match |
| Night 2 Record | row 1 detail | text | `signed 7:12 AM` | `` `signed ${clockTime(...)}` `` | match |
| Night 2 Record | rule 1 | left / right / top / height | 16 / 16 / 63 / 1 | same (`kit.tsx:749`) | match |
| Night 2 Record | rule 1 | background | `rgba(0,0,0,0.06)` | `rgba(0,0,0,0.06)` | match |
| Night 2 Record | row 2 | top | 70 | 70 | match |
| Night 2 Record | row 2 glyph | svg width / height | 17 / 12 | `[17,12]` | match |
| Night 2 Record | row 2 glyph | viewBox | `0 0 26 20` | `0 0 26 20` | match |
| Night 2 Record | row 2 glyph | path `d` | `M2 13c4-8 9 3 13-3s7 2 9-2` | identical | match |
| Night 2 Record | row 2 glyph | stroke / width / linecap | `#131313` / 2.4 / round | same | match |
| Night 2 Record | row 2 title | text | `One urge · 7:42 PM` | `` `One urge · ${clockTime(...)}` `` | match |
| Night 2 Record | row 2 detail | text | `passed in 4 min` | `rodeOut === urges.length ? 'rode it out' : 'logged'` (`night.tsx:197`) | **MISMATCH** — see F4 |
| Night 2 Record | rule 2 | top | 119 | 119 | match |
| Night 2 Record | row 3 | top | 126 | 126 | match |
| Night 2 Record | row 3 glyph | svg width / height | 11 / 14 | `[11,14]` | match |
| Night 2 Record | row 3 glyph | viewBox | `0 0 18 22` | `0 0 18 22` | match |
| Night 2 Record | row 3 glyph | margin-left | 2 | `marginLeft: 2` (`kit.tsx:723`) | match |
| Night 2 Record | row 3 glyph | path `d` | `M3 2v18L16.5 11z` | identical | match |
| Night 2 Record | row 3 glyph | fill | `#131313` | `#131313` | match |
| Night 2 Record | row 3 title | text | `Part IV finished` | `` `Part ${roman(finished.dayInWeek)} finished` `` | match |
| Night 2 Record | row 3 detail | text | `9 min` | `` `${finished.estimatedMinutes ?? 7} min` `` | match |
| Night 2 Record | add row | left / right / bottom | 16 / 16 / 0 | 16 / 16 / 0 (`night.tsx:212`) | match |
| Night 2 Record | add row | height | 44 content-box + 1 border = 45 | `height: 45` border-box | match |
| Night 2 Record | add row | border-top | `1px solid rgba(0,0,0,0.07)` | `borderTopWidth:1, borderTopColor:'rgba(0,0,0,0.07)'` | match |
| Night 2 Record | add row | flex / align / gap | row / center / 9 | row / center / 9 | match |
| Night 2 Record | add glyph | svg width / height / viewBox | 12 / 12 / `0 0 14 14` | 12 / 12 / `0 0 14 14` | match |
| Night 2 Record | add glyph | path `d` | `M7 1v12M1 7h12` | identical | match |
| Night 2 Record | add glyph | stroke / width / linecap | `#55534E` / 2 / round | same | match |
| Night 2 Record | add label | text / size / weight / colour | `Add to the record` / 13.5 / 600 / `#55534E` | same (`night.tsx:216`) | match |
| Night 2 Record | notebook | left | 86 | centred (`left:'50%', marginLeft:-110`) → 86.5 on 393 | **MISMATCH** — see F10 |
| Night 2 Record | notebook | top | C500 → 446 | `top={446}` (`night.tsx:219`) | match |
| Night 2 Record | notebook | width / height | 220 / 160 | 220 / 160 (`kit.tsx:624`) | match |
| Night 2 Record | notebook glow | left / top / size | 44 / 6 / 130×130 | 44 / 6 / 130 (`kit.tsx:625`) | match |
| Night 2 Record | notebook glow | gradient stops | `rgba(142,153,168,0.28)` → `rgba(142,153,168,0)` @ 74% | `#8E99A8` 0.28 → 0 @ 0.74 | match |
| Night 2 Record | notebook glow | filter | `blur(4px)` | none (gradient falloff stands in) | MISMATCH\* — substitute: the radial falloff itself |
| Night 2 Record | notebook shadow | left / top / w / h | 50 / 134 / 120 / 12 | 50 / 134 / 120 / 12 (`kit.tsx:626`) | match |
| Night 2 Record | notebook shadow | border-radius | 50% | `Ellipse rx 60 ry 6` | match |
| Night 2 Record | notebook shadow | background | `rgba(0,0,0,0.10)` | `#000000` @ 0.1 | match |
| Night 2 Record | notebook shadow | filter | `blur(4px)` | none (gradient falloff) | MISMATCH\* — substitute: 0→0.55→1 radial ramp |
| Night 2 Record | page back | left / top / w / h | 48 / 38 / 126 / 94 | same (`kit.tsx:627`) | match |
| Night 2 Record | page back | border-radius / background / transform | 10 / `#E0DFDA` / `rotate(-2deg)` | same | match |
| Night 2 Record | page front | left / top / w / h | 54 / 32 / 114 / 94 | same (`kit.tsx:628`) | match |
| Night 2 Record | page front | radius / background / shadow / transform | 8 / `#F7F6F2` / `0 0 0 1px rgba(0,0,0,0.05)` / `rotate(-2deg)` | same | match |
| Night 2 Record | gutter | left / top / w / h / bg / transform | 110 / 34 / 2 / 88 / `#E0DFDA` / `rotate(-2deg)` | same (`kit.tsx:629`) | match |
| Night 2 Record | rule L1 | left / top / w / h / r / bg | 66 / 54 / 34 / 4 / 2 / `#E0DFDA` | same | match |
| Night 2 Record | rule L2 | left / top / w | 66 / 68 / 34 | same | match |
| Night 2 Record | rule L3 | left / top / w | 66 / 82 / 24 | same | match |
| Night 2 Record | rule R1 | left / top / w | 122 / 52 / 34 | same | match |
| Night 2 Record | rule R2 | left / top / w | 122 / 66 / 26 | same | match |
| Night 2 Record | pen | left / top / w / h / r | 140 / 84 / 64 / 8 / 4 | same (`kit.tsx:635`) | match |
| Night 2 Record | pen | background / transform / origin | `#55534E` / `rotate(-28deg)` / `left center` | same | match |
| Night 2 Record | nib | left / top / w / h / r / bg / transform | 196 / 52 / 8 / 8 / 2 / `#B4B1AB` / `rotate(17deg)` | same (`kit.tsx:636`) | match |
| Night 2 Record | CTA | left / right / height / radius / bg | 16 / 16 / 52 / 26 / `#131313` | same | match |
| Night 2 Record | CTA | top | C756 → 702 | 697 on 393×852 | **MISMATCH** — see F5 |
| Night 2 Record | CTA label | text / size / weight / colour | `Continue` / 17 / 600 / `#FFFFFF` | same | match |

---

## Frame: Checkin Reasons (step 3)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Checkin Reasons | grain | inset / opacity | 0 / 0.07 | 0 / 0.07 | match |
| Checkin Reasons | status bar | content colour | `#1D1C1A` | `dark` | match |
| Checkin Reasons | back row | left / top | 16 / C66 → 12 | 16 / 12 | match |
| Checkin Reasons | rail | count / active | 6 / index 3 | 6 / `RAIL_AT[3] = 3` | match |
| Checkin Reasons | rail | top / gap / colours | C72 → 18 / 7 / `#131313`, `rgba(19,19,19,0.18)` | same | match |
| Checkin Reasons | title | top / align / size / weight / tracking / colour | C118 → 64 / center / 22 / 500 / 0.1 / `#1D1C1A` | same (`BoardTitle`) | match |
| Checkin Reasons | title | text | `What fed it?` | `What fed it?` (`MoodLogger.tsx:676`) | match |
| Checkin Reasons | subtitle | top / size / weight / colour | C158 → 104 / 15 / 400 / `#55534E` | same (`BoardSub`) | match |
| Checkin Reasons | subtitle | text | `A reason list, not a courtroom.` | identical (`MoodLogger.tsx:677`) | match |
| Checkin Reasons | row list | first row top | C206 → 152 | ScrollView top 152, no content paddingTop (`MoodLogger.tsx:681–682`) | match |
| Checkin Reasons | row list | pitch | 72 (206, 278, 350, 422, 494, 566) | 60 height + `gap: 12` = 72 | match |
| Checkin Reasons | row list | left / right | 24 / 24 | `paddingHorizontal: 24` | match |
| Checkin Reasons | row | height | 60 | 60 / minHeight 60 (`MoodLogger.tsx:495`) | match |
| Checkin Reasons | row | border-radius | 18 (circular) | 18 + `borderCurve:'continuous'` (`MoodLogger.tsx:498`) | **MISMATCH** — see F8 |
| Checkin Reasons | row | background | `#FFFFFF` | `#FFFFFF` | match |
| Checkin Reasons | row (off) | box-shadow | `0 0 0 1px rgba(0,0,0,0.10)` | same string | match |
| Checkin Reasons | row (on) | box-shadow | `0 0 0 1.6px #131313` | same string | match |
| Checkin Reasons | row | padding | `0 18px` | `paddingHorizontal: 18` | match |
| Checkin Reasons | row | flex / align / gap | row / center / 14 | row / center / 14 | match |
| Checkin Reasons | icon disc | width / height / radius | 38 / 38 / 50% | 38 / 38 / 19 (`MoodLogger.tsx:506`) | match |
| Checkin Reasons | icon disc (off) | background | `#F1EFE9` | `#F1EFE9` | match |
| Checkin Reasons | icon disc (on) | background | `#131313` | `#131313` | match |
| Checkin Reasons | icon | svg width / height | 21 / 21 | default `size = 21` (`MoodLogger.tsx:406`) | match |
| Checkin Reasons | icon | viewBox | `0 0 24 24` | `0 0 24 24` | match |
| Checkin Reasons | icon | fill | none | `fill="none"` + `fill:'none'` per shape | match |
| Checkin Reasons | icon | stroke-width | 2 | 2 | match |
| Checkin Reasons | icon (off) | stroke | `#1D1C1A` | `#1D1C1A` | match |
| Checkin Reasons | icon (on) | stroke | `#F4F3F0` | `#F4F3F0` | match |
| Checkin Reasons | icon | stroke-linecap | round (on the `<svg>`, inherited by every child) | per-shape; see rows below | mixed |
| Checkin Reasons | icon | stroke-linejoin | round (on the `<svg>`, inherited) | per-shape; see rows below | mixed |
| Checkin Reasons | icon `sleep` | path `d` | `M14.5 3.5a8.5 8.5 0 1 0 6 12.5 8 8 0 0 1-6-12.5z` | identical (`MoodLogger.tsx:411`) | match |
| Checkin Reasons | icon `sleep` | linecap | round | omitted | match (closed subpath — cap unused) |
| Checkin Reasons | icon `work` | rect | `x3 y8 w18 h12 rx2.5` | identical (`MoodLogger.tsx:414`) | match |
| Checkin Reasons | icon `work` | rect linejoin | round | omitted | match (rx 2.5 makes joins tangent-continuous) |
| Checkin Reasons | icon `work` | path `d` | `M9 8V6a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18` | identical (`MoodLogger.tsx:415`) | match |
| Checkin Reasons | icon `work` | path linecap | round (4 open ends) | omitted → butt | **MISMATCH** — see F6 |
| Checkin Reasons | icon `phone` | rect | `x7 y2.5 w10 h19 rx2.5` | identical | match |
| Checkin Reasons | icon `phone` | path `d` / linecap | `M10.5 18.5h3` / round | identical / `strokeLinecap="round"` | match |
| Checkin Reasons | icon `person` | circle | `cx12 cy8 r3.6` | identical | match |
| Checkin Reasons | icon `person` | path `d` / linecap | `M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6` / round | identical / round | match |
| Checkin Reasons | icon `bolt` | path `d` / linejoin | `M13 2L5 13.5h5.5L10 22l8-11.5h-5.5z` / round | identical / `strokeLinejoin="round"` | match |
| Checkin Reasons | icon `people` | circles | `cx8.5 cy9 r3.2`, `cx16.5 cy9 r3.2` | identical | match |
| Checkin Reasons | icon `people` | path `d` | `M2.5 20c.8-3.4 3.2-5 6-5 1.4 0 2.7.4 3.5 1.2.8-.8 2.1-1.2 3.5-1.2 2.8 0 5.2 1.6 6 5` | identical | match |
| Checkin Reasons | icon `people` | linejoin | round (≈90° corner at (12, 16.2)) | omitted → miter (`MoodLogger.tsx:435`) | **MISMATCH** — see F7 |
| Checkin Reasons | label | flex / font-size / colour | 1 / 15 / `#1D1C1A` | `flex:1` / 15 / `#1D1C1A` | match |
| Checkin Reasons | label (off) | font-weight | 500 | `sans('500')` | match |
| Checkin Reasons | label (on) | font-weight | 600 | `sans('600')` | match |
| Checkin Reasons | checkbox | width / height / radius | 24 / 24 / 50% | 24 / 24 / 12 (`MoodLogger.tsx:512`) | match |
| Checkin Reasons | checkbox (off) | box-shadow | `inset 0 0 0 1.5px rgba(0,0,0,0.22)` | same string | match |
| Checkin Reasons | checkbox (off) | background | not declared → transparent | `'transparent'` | match |
| Checkin Reasons | checkbox (off) | box-sizing | border-box | RN is border-box | match |
| Checkin Reasons | checkbox (on) | background | `#131313` | `#131313` | match |
| Checkin Reasons | check glyph | svg width / height / viewBox | 12 / 12 / `0 0 14 14` | identical (`MoodLogger.tsx:521`) | match |
| Checkin Reasons | check glyph | path `d` | `M2.5 7.5l3 3 6-7` | identical | match |
| Checkin Reasons | check glyph | stroke / width / fill / caps | `#F4F3F0` / 2.2 / none / round, round | identical | match |
| Checkin Reasons | rows 1–6 | labels | Poor sleep, Work stress, Scrolling late, Loneliness, Conflict, Real connection | `REASONS[0..5]` (`MoodLogger.tsx:67–72`) | match |
| Checkin Reasons | rows 1–6 | icons | moon, briefcase, phone, person, bolt, two-people | `sleep, work, phone, person, bolt, people` | match |
| Checkin Reasons | rows selected | which | rows 1 and 3 | state-driven, starts empty | match (frame shows a mid-flow state) |
| Checkin Reasons | row | `:active` transform | `scale(0.99)` | `PressScale` → `scale(0.96)` (`press-scale.tsx:25`) | MISMATCH\* — substitute: shared press motion; the frame's inline `style-active` is not a rendered state |
| Checkin Reasons | rows 7–13 + "Something else" | — | frame draws six rows only | seven more rows + own-reason field, scrolled | addition (frame silent) |
| Checkin Reasons | CTA | left / right / top / height / radius / bg | 24 / 24 / C744 → 690 / 58 / 29 / `#131313` | 24 / 24 / **685** / 58 / 29 / `#131313` | **MISMATCH** on top — see F5; rest match |
| Checkin Reasons | CTA label | text / size / weight / tracking / colour | `Continue` / 17 / 600 / 0.2 / `#FFFFFF` | same | match |

---

## Frame: Night 3 Reflection (step 4)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Night 3 Reflection | grain | inset / opacity | 0 / 0.07 | 0 / 0.07 | match |
| Night 3 Reflection | status bar | content colour | `#1D1C1A` | `dark` | match |
| Night 3 Reflection | rail | count / active / top / gap | 6 / index 4 / C72 → 18 / 7 | 6 / `RAIL_AT[4] = 4` / 18 / 7 | match |
| Night 3 Reflection | back row | left / top | 16 / C66 → 12 | 16 / 12 | match |
| Night 3 Reflection | title | text | `Anything worth keeping?` | identical (`night.tsx:227`) | match |
| Night 3 Reflection | title | left / top | 24 / C230 → 176 | 24 / 176 | match |
| Night 3 Reflection | title | size / weight / tracking / colour | 27 / 500 / −0.1 / `#1D1C1A` | same | match |
| Night 3 Reflection | card | left / right | 12 / 12 | 12 / 12 (`night.tsx:228`) | match |
| Night 3 Reflection | card | top | C310 → 256 | 256 | match |
| Night 3 Reflection | card | height | 150 | 150 | match |
| Night 3 Reflection | card | border-radius | 14 | 14 | match |
| Night 3 Reflection | card | background | `#FFFFFF` | `#FFFFFF` | match |
| Night 3 Reflection | card | box-shadow | `0 0 0 1px rgba(0,0,0,0.07)` | same string (0.07, not the 0.06 of Night 2) | match |
| Night 3 Reflection | prompt | left / right | 20 / 20 | 20 / 20 (`night.tsx:236`) | match |
| Night 3 Reflection | prompt | top | 22 (card-relative) | 22 | match |
| Night 3 Reflection | prompt | height | auto | `height: 96` | addition (frame silent; multiline input needs a box) |
| Night 3 Reflection | prompt | font-family | `Georgia,'Times New Roman',serif` | `fonts.quote` → iOS `Georgia`, web `Georgia, 'Times New Roman', serif` (`theme.ts:220`) | match |
| Night 3 Reflection | prompt | font-size | 17 | 17 | match |
| Night 3 Reflection | prompt | font-style | italic | `fontStyle:'italic'` | match |
| Night 3 Reflection | prompt | line-height | 27 | 27 | match |
| Night 3 Reflection | prompt | color | `#8B8882` | `placeholderTextColor="#8B8882"` | match |
| Night 3 Reflection | prompt | text | `Sam called at the right moment…` | identical | match |
| Night 3 Reflection | prompt | typed-text colour | not drawn | `#1D1C1A` | match (frame silent) |
| Night 3 Reflection | prompt | inner padding | none | `padding: 0` (kills RN's default) | match |
| Night 3 Reflection | caret | width / height | 2 / 18 | none — platform caret | MISMATCH\* — substitute: the native TextInput caret |
| Night 3 Reflection | caret | background | `#131313` | platform default | MISMATCH\* — same substitute |
| Night 3 Reflection | caret | vertical-align / margin-left | −3 / 3 | n/a | MISMATCH\* — same substitute |
| Night 3 Reflection | Optional | right / bottom | 16 / 12 | 16 / 12 (`night.tsx:240`) | match |
| Night 3 Reflection | Optional | font-size | 11 | 11 | match |
| Night 3 Reflection | Optional | font-weight | 500 | `sans('500')` | match |
| Night 3 Reflection | Optional | color | `#B0AEA8` | `#B0AEA8` | match |
| Night 3 Reflection | CTA | left / right / height / radius / bg | 16 / 16 / 52 / 26 / `#131313` | same | match |
| Night 3 Reflection | CTA | top | C756 → 702 | 697 on 393×852 | **MISMATCH** — see F5 |
| Night 3 Reflection | CTA label | text | `Close the day` | `label[4] = 'Close the day'` | match |
| Night 3 Reflection | CTA label | size / weight / tracking / colour | 17 / 600 / none / `#FFFFFF` | 17 / 600 / 0 / `#FFFFFF` | match |

---

## Frame: Night Action Reminder (step 5)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Night Action Reminder | grain | inset / opacity | 0 / 0.07 | 0 / 0.07 | match |
| Night Action Reminder | status bar | content colour | `#1D1C1A` | `dark` (step 5) | match |
| Night Action Reminder | rail | presence | **no rail drawn** | `RAIL_AT[5] = null` → `rail` undefined (`night.tsx:51,141`) | match |
| Night Action Reminder | back row | left / top | 16 / C66 → 12 | 16 / 12 | match |
| Night Action Reminder | title | left / right / top | 0 / 0 / C118 → 64 | 0 / 0 / 64 (`kit.tsx:242`) | match |
| Night Action Reminder | title | text-align | center | `center` | match |
| Night Action Reminder | title | font-size / weight / tracking / colour | 22 / 500 / 0.1 / `#1D1C1A` | same | match |
| Night Action Reminder | title | text | `Tonight’s action` | `Tonight’s action` (`night.tsx:247`) | match |
| Night Action Reminder | card | left / right | 56 / 56 | 56 / 56 (`kit.tsx:889–890`) | match |
| Night Action Reminder | card | top | C236 → 182 | `top={182}` (`night.tsx:248`) | match |
| Night Action Reminder | card | height | auto | auto | match |
| Night Action Reminder | card | border-radius | 18 | 18 | match |
| Night Action Reminder | card | overflow | hidden | hidden | match |
| Night Action Reminder | card | background | `#FFFFFF` | `#FFFFFF` | match |
| Night Action Reminder | card | box-shadow | `0 0 0 1px rgba(0,0,0,0.05), 0 10px 24px rgba(40,38,32,0.07)` | same string | match |
| Night Action Reminder | art | height / overflow | 248 / hidden | 248 / hidden (`kit.tsx:843,897`) | match |
| Night Action Reminder | art | gradient | `linear-gradient(180deg, #0B0C0F 0%, #12151B 60%, #1A2027 100%)` | `['#0B0C0F','#12151B','#1A2027']`, locations `[0,0.6,1]` (`kit.tsx:844`) | match |
| Night Action Reminder | speck a | left / top / size / colour | 64 / 40 / 2 / `rgba(244,243,240,0.45)` | identical (`kit.tsx:834`) | match |
| Night Action Reminder | speck b | left / top / size / colour | 104 / 72 / 1.5 / `rgba(244,243,240,0.3)` | identical | match |
| Night Action Reminder | speck c | right / top / size / colour | 40 / 34 / 2 / `rgba(244,243,240,0.35)` | identical | match |
| Night Action Reminder | speck d | right / top / size / colour | 96 / 58 / 1.5 / `rgba(244,243,240,0.3)` | identical | match |
| Night Action Reminder | specks | border-radius | 50% | 1 / 0.75 | match |
| Night Action Reminder | moon glow | left / top / size | 22 / 26 / 56 | 22 / 26 / 56 (`kit.tsx:848`) | match |
| Night Action Reminder | moon glow | stops | `rgba(223,220,211,0.16)` → `rgba(223,220,211,0)` @ 72% | `#DFDCD3` 0.16 → 0 @ 0.72 | match |
| Night Action Reminder | moon glyph | left / top | 37 / 41 | 37 / 41 (`kit.tsx:849`) | match |
| Night Action Reminder | moon glyph | svg size / viewBox | 26×26 / `0 0 24 24` | 26 / `0 0 24 24` (`kit.tsx:790`) | match |
| Night Action Reminder | moon glyph | path `d` | `M14 3 A9 9 0 1 0 21 12 A7.2 7.2 0 0 1 14 3Z` | identical (`MOON_PATH`, `kit.tsx:785`) | match |
| Night Action Reminder | moon glyph | fill | `#E8E6DC` | `#E8E6DC` | match |
| Night Action Reminder | ridge | viewBox / preserveAspectRatio | `0 0 281 248` / none | identical (`kit.tsx:855`) | match |
| Night Action Reminder | ridge | width / height | 100% / 100% of the 281×248 art box | `w = windowWidth − 112` (= 281 on 393) / 248 | match |
| Night Action Reminder | ridge | path `d` | `M-4,248 L-4,196 Q60,178 140,190 Q210,200 285,186 L285,248 Z` | identical | match |
| Night Action Reminder | ridge | fill | `#171B22` | `#171B22` | match |
| Night Action Reminder | headboard | left / top / w / h / r / bg | 38 / 152 / 8 / 58 / 3 / `#2C3844` | identical (`kit.tsx:860`) | match |
| Night Action Reminder | mattress | left / top / w / h / r / bg | 44 / 178 / 82 / 21 / 6 / `#394656` | identical | match |
| Night Action Reminder | pillow | left / top / w / h / r / bg | 50 / 169 / 28 / 11 / 5 / `#55677C` | identical | match |
| Night Action Reminder | bed foot | left / top / w / h / r / bg | 118 / 199 / 6 / 12 / 2 / `#26303C` | identical | match |
| Night Action Reminder | shelf glow | right / top / size | 24 / 118 / 92 | 24 / 118 / 92 (`kit.tsx:866`) | match |
| Night Action Reminder | shelf glow | stops | `rgba(226,186,120,0.20)` → 0 @ 74% | `#E2BA78` 0.2 → 0 @ 0.74 | match |
| Night Action Reminder | shelf | right / top / w / h / r / bg | 56 / 168 / 52 / 9 / 3 / `#2C3844` | identical | match |
| Night Action Reminder | shelf leg | right / top / w / h / r / bg | 76 / 177 / 8 / 34 / 2 / `#26303C` | identical | match |
| Night Action Reminder | phone | right / top / w / h / r / bg | 70 / 140 / 15 / 26 / 3 / `#DCE3EA` | identical | match |
| Night Action Reminder | seal | right / top / w / h / r / bg | 48 / 128 / 19 / 19 / 50% / `#E9D2A4` | 48 / 128 / 19 / 19 / 9.5 / `#E9D2A4` | match |
| Night Action Reminder | seal check | svg w / h / viewBox | 10 / 9 / `0 0 9 8` | identical (`kit.tsx:871`) | match |
| Night Action Reminder | seal check | path `d` / stroke / width / caps | `M1.5 4l2 2 4-4.5` / `#131313` / 1.6 / round, round | identical | match |
| Night Action Reminder | card body | padding | `16px 18px 18px` | `paddingTop 16, paddingHorizontal 18, paddingBottom 18` (`kit.tsx:898`) | match |
| Night Action Reminder | card body | flex-direction / gap | column / 12 | column (default) / 12 | match |
| Night Action Reminder | mark row | flex / align / gap | row / center / 10 | row / center / 10 | match |
| Night Action Reminder | mark disc | w / h / radius / bg | 34 / 34 / 50% / `#131313` | 34 / 34 / 17 / `#131313` | match |
| Night Action Reminder | bed glyph | svg size / viewBox | 16×16 / `0 0 20 20` | 16 / `0 0 20 20` (`kit.tsx:802`) | match |
| Night Action Reminder | bed glyph | path 1 `d` / stroke-width / linecap | `M3 15.5V6` / 1.7 / round | identical | match |
| Night Action Reminder | bed glyph | path 2 `d` | `M3 12.5h14M17 15.5v-5a2 2 0 0 0-2-2H8v4.5` | identical | match |
| Night Action Reminder | bed glyph | path 2 stroke-width / caps / fill | 1.7 / round, round / none | identical | match |
| Night Action Reminder | bed glyph | circle | `cx5.6 cy8.9 r1.5` | identical | match |
| Night Action Reminder | bed glyph | colour | `#F4F3F0` | `#F4F3F0` | match |
| Night Action Reminder | mark label | font-size / weight / colour | 13 / 600 / `#1D1C1A` | 13 / `sans('600')` / `#1D1C1A` (`kit.tsx:903`) | match |
| Night Action Reminder | mark label | text | `Surviving the night` | `lessons[0].title` = `The slip equation` (`night.tsx:105`) | **MISMATCH** — see F3 |
| Night Action Reminder | action line | text-align | left | default left (`kit.tsx:906`) | match |
| Night Action Reminder | action line | font-size | 15 | 15 | match |
| Night Action Reminder | action line | font-weight | 500 | `sans('500')` | match |
| Night Action Reminder | action line | line-height | 22 | 22 | match |
| Night Action Reminder | action line | color | `#1D1C1A` | `#1D1C1A` | match |
| Night Action Reminder | action line | letter-spacing | not stated | dropped by `AppText` | match |
| Night Action Reminder | action line | text-wrap | pretty | `textWrap:'pretty'` on web only (`AppText.tsx:128`); no native equivalent | MISMATCH\* — substitute: platform line breaking on native |
| Night Action Reminder | action line | text | `Put the device you use for porn out of reach before you sleep.` | `NIGHT_ACTIONS[0]` = `Put your phone somewhere difficult to access before you sleep.` (`kit.tsx:761`) | **MISMATCH** — see F2 |
| Night Action Reminder | Done pill | left / right | 16 / 16 | 16 / 16 (`kit.tsx:223–224`) | match |
| Night Action Reminder | Done pill | bottom | 84 → 50 (84 − 34 home indicator) | `bottom: 50` | match |
| Night Action Reminder | Done pill | height | 54 | 54 | match |
| Night Action Reminder | Done pill | border-radius | 27 | 27 | match |
| Night Action Reminder | Done pill | background | `#131313` | `#131313` | match |
| Night Action Reminder | Done label | text / size / weight / tracking / colour | `Done` / 16.5 / 600 / 0.2 / `#FFFFFF` | identical (`kit.tsx:234`, `night.tsx:157`) | match |
| Night Action Reminder | Skip | left / right | 0 / 0 | 0 / 0 (`night.tsx:162`) | match |
| Night Action Reminder | Skip | bottom | 44 → 10 (44 − 34) | `bottom: 10` | match |
| Night Action Reminder | Skip | text-align | center | `alignItems:'center'` | match |
| Night Action Reminder | Skip | font-size | 14.5 | 14.5 (`night.tsx:163`) | match |
| Night Action Reminder | Skip | font-weight | 500 | `sans('500')` | match |
| Night Action Reminder | Skip | color | `#8B8882` | `#8B8882` | match |
| Night Action Reminder | Skip | text | `Skip tonight` | `Skip tonight` | match |

---

## Frame: Night 4 Closed (step 6)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Night 4 Closed | grain | inset / opacity / order | 0 / 0.07 / before the band | same | match |
| Night 4 Closed | night band | left / right / top | 0 / 0 / 0 | 0 / 0 / 0 | match |
| Night 4 Closed | night band | height | 360 | `height={360}` (`night.tsx:168`) | match |
| Night 4 Closed | night band | overflow | hidden | hidden | match |
| Night 4 Closed | night band | gradient | `180deg, #14171B 0%, #1A2027 55%, #232B34 100%` | identical | match |
| Night 4 Closed | moon halo | right / top / size / stops | 74 / 30 / 110 / `rgba(226,232,240,0.22)` → 0 @ 78% | identical | match |
| Night 4 Closed | moon disc | right / top / size / bg / mask | 104 / 60 / 34 / `#DDE4EC` / same radial mask | identical | match |
| Night 4 Closed | moon disc | box-shadow | `0 0 18px rgba(221,228,236,0.5)` — clipped by `mask-clip: border-box` | 70×70 glow proxy | **MISMATCH** — see F11 |
| Night 4 Closed | stars 1–5 | left / top / size / alpha | 60/52/2.5/.6, 110/92/2/.4, 158/44/2/.5, 210/84/2.5/.35, 84/128/2/.3 | identical | match |
| Night 4 Closed | hill A | left / right / top / height / ry / bg | −60 / −60 / 290 / 110 / 50 / `#1C232B` | `hillTop = 290` | match |
| Night 4 Closed | hill B | left / right / top / height / ry / bg | −120 / −30 / 310 / 110 / 44 / `#242C36` | `hillTop + 20 = 310` | match |
| Night 4 Closed | horizon tick | left / top / w / h / r / bg | 70 / 320 / 18 / 2.5 / 2 / `rgba(244,243,240,0.14)` | `hillTop + 30 = 320` | match |
| Night 4 Closed | status bar | content colour | `#F4F3F0` (light) | `StatusBar style="light"` (step 6) | match |
| Night 4 Closed | back row | left / top / colour | 16 / C66 → 12 / `#55534E` | 16 / 12 / `#55534E` | match |
| Night 4 Closed | rail | count / active / top / gap | 6 / index 5 / C72 → 18 / 7 | 6 / `RAIL_AT[6] = 5` / 18 / 7 | match |
| Night 4 Closed | rail active dot | size / colour | 18×6 / `#F4F3F0` | 18×6 / `#F4F3F0` (`light=true`) | match |
| Night 4 Closed | rail inactive dot | colour | `rgba(244,243,240,0.35)` | identical | match |
| Night 4 Closed | badge row | left / right / justify | 0 / 0 / center | 0 / 0 / `alignItems:'center'` (`kit.tsx:644`) | match |
| Night 4 Closed | badge row | top | C420 → 366 | `top={366}` (`night.tsx:254`) | match |
| Night 4 Closed | badge disc | width / height / radius | 64 / 64 / 50% | 64 / 64 / 32 | match |
| Night 4 Closed | badge disc | background | `#FFFFFF` | `#FFFFFF` | match |
| Night 4 Closed | badge disc | box-shadow | `0 0 0 1px rgba(0,0,0,0.07), 0 8px 18px rgba(40,38,32,0.12)` | same string (`kit.tsx:651`) | match |
| Night 4 Closed | badge check | svg width / height | 22 / 18 | 22 / 18 (`kit.tsx:658`) | match |
| Night 4 Closed | badge check | viewBox | `0 0 16 13` | `0 0 16 13` | match |
| Night 4 Closed | badge check | path `d` | `M1.5 7l4.4 4.5L14.5 1.5` | identical | match |
| Night 4 Closed | badge check | fill / stroke / width / caps | none / `#131313` / 2.6 / round, round | identical | match |
| Night 4 Closed | headline | left / right / top | 0 / 0 / C512 → 458 | 0 / 0 / 458 (`night.tsx:255`) | match |
| Night 4 Closed | headline | text-align | center | `center` | match |
| Night 4 Closed | headline | font-size / weight / tracking / colour | 27 / 500 / −0.1 / `#1D1C1A` | identical (`kit.tsx:671`) | match |
| Night 4 Closed | headline | text | `Day 13, closed.` | `` `Day ${day}, closed.` `` | match (13 is data) |
| Night 4 Closed | note | top | C554 → 500 | `top + 42` = 500 (`kit.tsx:674`) | match |
| Night 4 Closed | note | font-size / weight / colour | 14.5 / 400 / `#8B8882` | identical | match |
| Night 4 Closed | note | text | `See you in the morning.` | identical | match |
| Night 4 Closed | CTA | left / right / height / radius / bg | 16 / 16 / 52 / 26 / `#131313` | identical | match |
| Night 4 Closed | CTA | top | C756 → 702 | 697 on 393×852 | **MISMATCH** — see F5 |
| Night 4 Closed | CTA label | text / size / weight / colour | `Goodnight` / 17 / 600 / `#FFFFFF` | `label[6] = 'Goodnight'` / identical | match |

---

## Findings

**510 rows written across 7 frames: 477 match, 18 MISMATCH rows (collapsing to the 11 distinct
findings below — the CTA top repeats on 5 frames and the moon on 2), 8 MISMATCH\* rows, 7 rows
that are n/a, app-side additions the frame is silent on, or pointers into a per-shape breakdown.**

Rows per frame: Night 1 Mood 133 · Checkin Emotions 87 · Night 2 Record 80 · Checkin Reasons 62 ·
Night 3 Reflection 35 · Night Action Reminder 77 · Night 4 Closed 36.

### F1 — the emotion wheel shows the wrong eight words for the flow's own default mood
- **File / line:** `src/app/day/night.tsx:178` (with `src/components/MoodLogger.tsx:53–60`, `115`, `745`)
- **Current:** `wheelFor(mood + 1)`. The flow's dial defaults to `mood = 2` (`night.tsx:82`), so `wheelFor(3)` → `moodRung(3) = 2` → `WHEELS[2]` = *Flat, Restless, Tired, Uneasy, Distracted, Calm, Impatient, Hopeful*.
- **Design:** `Checkin-Emotions` draws *Calm, Tense, Tired, Hopeful, Flat, Proud, Lonely, Restless* — which is `WHEELS[3]` in the app. The two frames are one session: `Night-1-Mood` selects the **middle** dial circle (index 2, reading "Mixed"), and `Checkin-Emotions` is the next screen. So the canvas assigns those eight words to the **Mixed** rung, and the app assigns them to rung 3 ("Mostly clear"). Only rung 3's words are drawn anywhere in this bundle, so the frame is the only evidence and it contradicts the code comment at `MoodLogger.tsx:57` ("this is the default rung"), which is true for the standalone `CheckinFlow` (default 0.64 → index 3) but not for the night flow.

### F2 — the action card's sentence is not the one the frame draws
- **File / line:** `src/components/day/kit.tsx:761` (used by `night.tsx:102, 248`)
- **Current:** `NIGHT_ACTIONS[0]` = `Put your phone somewhere difficult to access before you sleep.`
- **Design:** `Put the device you use for porn out of reach before you sleep.` That exact string already exists in the repo as `task.cardSummary` for day 1 (`src/content/curriculum84.ts:81`), so the frame is transcribing real content the flow is not reading.

### F3 — the action card's mark label is not the one the frame draws
- **File / line:** `src/app/day/night.tsx:105`
- **Current:** `(lessons ?? [])[Math.max(0, day - 1) % …]?.title` → on day 1 this is `The slip equation` (`src/content/interactiveLessons.ts:28`, the first entry of `INTERACTIVE_WEEKS`).
- **Design:** `Surviving the night`. The comment on `night.tsx:104` asserts this "is lesson one", but lesson one of the interactive curriculum is *The slip equation*; `Surviving the night` is `curriculum84.ts:69/80`, a different list. Every day is therefore mislabelled, not just day 1.

### F4 — the urge row reads back a verdict where the frame reads back a duration
- **File / line:** `src/app/day/night.tsx:197`
- **Current:** `rodeOut === urges.length ? 'rode it out' : 'logged'`
- **Design:** `passed in 4 min` — an elapsed time, which is a different quantity from a pass/fail verdict. The other two rows in the same card are both durations/timestamps (`signed 7:12 AM`, `9 min`), so the frame's column is a measurement column throughout.

### F5 — both CTA pills land 5pt above the canvas top on the reference device
- **File / line:** `src/components/day/kit.tsx:173`; `src/components/MoodLogger.tsx:176`
- **Current:** narrow pill `min(702, height − 52 − 10)`; wide pill `min(690, height − 58 − 16)`. On 393 × 852 the safe-area insets are 59 top / 34 bottom, so `height = 759` and the clamps fire: **697** and **685**.
- **Design:** C756 → 702 (steps 0, 2, 4, 6) and C744 → 690 (steps 1, 3). The floors were sized for a 54pt top inset (`852 − 54 − 34 = 764`), which the reference device does not have. Net effect: everything above the pill drifts +5 from the 59pt inset while the pill moves −5, so the gap under the last element is 10pt tighter than the canvas everywhere in this flow.

### F6 — the "Work stress" glyph loses its round caps
- **File / line:** `src/components/MoodLogger.tsx:415`
- **Current:** `<Path d="M9 8V6a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" {...line} />` — `line` carries only `stroke`, `strokeWidth`, `fill`.
- **Design:** `Checkin-Reasons` sets `stroke-linecap="round" stroke-linejoin="round"` on the `<svg>`, which every child inherits. This path has four open ends (the two handle feet and both ends of the `M3 13h18` divider), so the app draws butt caps: the divider renders 18 long with flat ends instead of 20 with round ones.

### F7 — the "Real connection" glyph loses its round join
- **File / line:** `src/components/MoodLogger.tsx:435`
- **Current:** `{...line} strokeLinecap="round"` — `strokeLinejoin` omitted, so the default `miter` applies.
- **Design:** round. The path turns through ~90° at (12, 16.2) (the valley between the two figures); at stroke-width 2 a miter reaches ~1.41 from the corner against round's 1.0, so the join renders as a small spike.

### F8 — the reason rows use a continuous corner where the frame draws a circular one
- **File / line:** `src/components/MoodLogger.tsx:498` (and the matching "Something else" row, `MoodLogger.tsx:702`)
- **Current:** `borderRadius: 18, borderCurve: 'continuous'`
- **Design:** `border-radius: 18px`, which in CSS is a circular arc. `borderCurve: 'continuous'` renders an iOS squircle — a different corner profile. Nothing else in this flow (the ledger card, the reflection card, the action card, either pill) asks for a continuous curve, so the two reason rows are also inconsistent with their own screen.

### F9 — the emotion wheel is centred rather than placed at the canvas's left
- **File / line:** `src/components/MoodLogger.tsx:334`
- **Current:** `left: 0, right: 0, alignItems: 'center'` around a 316-wide box → left **38.5** on a 393 frame.
- **Design:** `left: 38px`. 0.5pt right of the literal. The canvas centres the disc on x = 196, not on the frame's own 196.5.

### F10 — the notebook drawing is centred rather than placed at the canvas's left
- **File / line:** `src/components/day/kit.tsx:624`
- **Current:** `left: '50%', marginLeft: -110` around a 220-wide box → left **86.5** on a 393 frame.
- **Design:** `left: 86px`. Same 0.5pt right shift, same cause (the canvas centres on 196).

### F11 — the moon's glow proxy paints through the crescent's cut-out, and reproduces a shadow the canvas clips away
- **File / line:** `src/components/day/kit.tsx:568–579` (`Night-1-Mood` and `Night-4-Closed`)
- **Current:** a 70 × 70 radial whose first stop is at offset **0.486**. Per SVG stop padding, everything inside `0.486 × 35 = 17` holds that first stop, so the app paints `#DDE4EC` at **0.25 alpha** across the whole disc footprint — including the crescent's cut-out, which the mask leaves transparent. The bite therefore reads as a pale wash rather than bare sky.
- **Design:** the disc's `box-shadow: 0 0 18px rgba(221,228,236,0.5)` sits outside the border box, and `mask-image` brings `mask-clip: border-box` with it, so the browser clips that glow away entirely. The frame renders a hard-edged crescent over the separate 110px halo and nothing else.
- **Canvas contradiction, named:** the frame declares a box-shadow it cannot show. The evidence supports the clipped reading — `mask-clip`'s initial value is `border-box`, and the 110px `radial-gradient` disc directly above it in the source is where the moon's visible halo actually comes from. Either way the 0.25-alpha fill inside the crescent is wrong: even on the unclipped reading the shadow would be a falloff *outside* the disc, never a flat wash inside it.
