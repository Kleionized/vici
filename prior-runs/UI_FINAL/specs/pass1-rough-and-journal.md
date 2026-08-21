# Pass 1 — second reader — Rough Days protocols + Sentence Journal

Bundle **Email Login**.
Frames: `Rough-Anxiety-I`, `Rough-Boredom-III`, `Rough-An-argument-II`, `Rough-An-argument-III`,
`Sentence-Journal`, `Sentence-Journal-Custom-prompt`.
App: `src/components/roughDays/kit.tsx` (RDArtwork `tangle` / `threethings` / `toppled` / `writeit`,
plus the shared page chrome), `src/app/affirmation.tsx`.

Read in full from `.uifinal/pretty/final/Email Login/<Slug>.html`, cross-checked against
`.uifinal/final/Email Login/<Slug>.html` for dropped declarations (`text-wrap` confirmed present in raw).

**Coordinate note.** Every frame is 393 × 852 and the top 54px is a status bar the app never draws.
Canvas y → app y is `canvas − 54`, then the live safe-area inset is added back on device
(the house rule, written out in `src/app/score.tsx:54` as `v - 54 + insets.top`). Both numbers
are given in the Design column where it matters.

Legend: **MISMATCH** = the app can close it. **MISMATCH\*** = RN cannot express the CSS; the
substitute is named.

---

## 1. Shared page chrome — all four Rough frames (`RDMovePage`, kit.tsx:677–749)

Identical byte-for-byte across Anxiety-I, Boredom-III, An-argument-II, An-argument-III, so audited once.

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 4 | root page | background | `#EDECE7` | `#EDECE7` (kit.tsx:702) | match |
| all 4 | status bar row | height / z-index / content | 54px, z 20, `· 9:41` 17px/600/`#1D1C1A`/ls −0.2, three svgs gap 7 | not built — OS status bar, `StatusBar style="dark"` (rough-protocol.tsx:28) | match (by convention) |
| all 4 | sheet | top | canvas `52` → app `−2` (+ inset) | `Math.max(0, insets.top - 2)` (kit.tsx:708) | match |
| all 4 | sheet | left / right / bottom | 0 / 0 / 0 | 0 / 0 / 0 | match |
| all 4 | sheet | border-radius | `24px 24px 0 0` | `borderTopLeftRadius:24, borderTopRightRadius:24` | match |
| all 4 | sheet | background | `#F4F3F0` | `#F4F3F0` | match |
| all 4 | sheet | overflow | `hidden` | `overflow:'hidden'` | match |
| all 4 | grain | image / opacity / inset | `noise-dark.png`, `0.07`, inset 0 | `Grain source={noiseDark} opacity={0.07}`, repeat, inset 0 | match |
| all 4 | grabber | top / w / h / radius / fill | 12 / 38 / 5 / 3 / `rgba(19,19,19,0.16)` | 12 / 38 / 5 / 3 / `rgba(19,19,19,0.16)` (kit.tsx:637–638) | match |
| all 4 | grabber | centering | `left:0;right:0;display:flex;justify-content:center` | `left:0,right:0,alignItems:'center'` | match |
| all 4 | close | position / size / viewBox | right 22, top 26, 20 × 20, `0 0 20 20` | right 22, top 26, 20 × 20, `0 0 20 20` (kit.tsx:649–650) | match |
| all 4 | close | path `d` | `M3 3l14 14M17 3L3 17` | `M3 3l14 14M17 3L3 17` | match |
| all 4 | close | stroke / width / linecap | `#55534E` / 2 / `round` | `#55534E` / 2 / `round` | match |
| all 4 | dots | top / gap / justify | 66 / 6 / center | 66 / 6 / center, `flexDirection:'row'` (kit.tsx:659) | match |
| all 4 | dot (active) | w × h / radius / fill | 20 × 6.5 / 4 / `#131313` | 20 × 6.5 / 4 / `#131313` | match |
| all 4 | dot (idle) | w × h / radius / fill | 6.5 × 6.5 / 4 / `rgba(19,19,19,0.18)` | 6.5 × 6.5 / 4 / `rgba(19,19,19,0.18)` | match |
| Anxiety-I | dots | active index | 1st of 3 | `index` = 0 | match |
| An-argument-II | dots | active index | 2nd of 3 | `index` = 1 | match |
| Boredom-III / An-arg-III | dots | active index | 3rd of 3 | `index` = 2 | match |
| all 4 | headline | left / right / top | 36 / 36 / 104 | 36 / 36 / 104 (kit.tsx:719) | match |
| all 4 | headline | size / weight / line-height / ls / align / colour | 26 / 500 / 33 / −0.2 / center / `#1D1C1A` | 26 / `sans('500')` / 33 / −0.2 / `center` / `#1D1C1A` | match |
| all 4 | sub | left / right / top | 44 / 44 / 152 | 44 / 44 / 152 (kit.tsx:722) | match |
| all 4 | sub | size / weight / line-height / align / colour | 14.5 / 400 / 21 / center / `#8B8882` | 14.5 / `sans('400')` / 21 / center / `#8B8882` | match |
| all 4 | sub | text-wrap | `balance` | *(absent)* | **MISMATCH\*** — RN has no `text-wrap`; substitute is the platform greedy break. No RN expression exists. |
| all 4 | artwork slot | left / top / w / h | 76 / 216 / 240 / 220 | 76 / 216 / 240 / 220 (kit.tsx:725) | match |
| all 4 | artwork inner | inset / overflow | 0 / `hidden` | 240 × 220, `overflow:'hidden'` (kit.tsx:121) | match |
| Boredom-III, An-arg-III | act line | left / right / top | 48 / 48 / 452 | 48 / 48 / 452 (kit.tsx:729) | match |
| Boredom-III, An-arg-III | act line | size / weight / line-height / align / colour | 16 / 500 / 24 / center / `#1D1C1A` | 16 / `sans('500')` / 24 / center / `#1D1C1A` | match |
| Boredom-III, An-arg-III | act line | text-wrap | `balance` | *(absent)* | **MISMATCH\*** — same substitute as above. |
| Anxiety-I, An-arg-II | act line | presence | absent | `act` undefined → not rendered | match |
| all 4 | CTA pill | left / right / bottom / h / radius / bg | 24 / 24 / 88 / 54 / 27 / `#131313` | 24 / 24 / 88 / 54 / 27 / `#131313` (kit.tsx:736) | match |
| all 4 | CTA pill | justify / align | center / center | center / center | match |
| all 4 | CTA label | size / weight / ls / colour | 16.5 / 600 / 0.2 / `#FFFFFF` | 16.5 / `sans('600')` / 0.2 / `#FFFFFF` | match |
| Anxiety-I | CTA label | text | `Walk through it` | `RD_CTA[0]` = `Walk through it` | match |
| An-argument-II | CTA label | text | `Next` | `RD_CTA[1]` = `Next` | match |
| Boredom-III / An-arg-III | CTA label | text | `Done` | `RD_CTA[2]` = `Done` | match |
| all 4 | ghost link | left / right / bottom / align | 0 / 0 / 44 / center | 0 / 0 / 44 / `alignItems:'center'` (kit.tsx:743) | match |
| all 4 | ghost label | size / weight / colour | 14.5 / 500 / `#8B8882` | 14.5 / `sans('500')` / `#8B8882` | match |
| Anxiety-I | ghost label | text | `Not tonight` | `RD_GHOST[0]` = `Not tonight` | match |
| An-arg-II / Boredom-III / An-arg-III | ghost label | text | `Back` | `RD_GHOST[1..2]` = `Back` | match |
| all 4 | headline copy | text | see per-frame below | `src/content/roughDays.ts` 56 / 74 / 97 / 98 | match |

Copy check against `src/content/roughDays.ts`:
`Wound up, not turned on.` / `Anxiety and arousal share wiring — the body confuses one for the other.` (l.56) ✓;
`The second-easiest thing.` / `The easiest thing is the screen. Pick the next one.` / `Ten push-ups, one glass of water, one open window.` (l.74) ✓;
`It offers control back.` / `The urge shows up right after the argument took your control away.` (l.97) ✓;
`Write, don’t send.` / `Spend the charge somewhere it can’t cost you.` / `Write the reply you won’t send. Then put it down.` (l.98) ✓.

---

## 2. Rough-Anxiety-I — artwork `tangle` (kit.tsx:187–203)

| Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|
| glow | l/t/w/h | 44 / 60 / 72 / 72 | `Glow l={44} t={60} size={72}` | match |
| glow | fill | `radial-gradient(closest-side, rgba(226,186,120,0.32), rgba(226,186,120,0) 74%)` | `RadialGradient r=50%`, stop 0 `#E2BA78`@0.32, stop 0.74 `#E2BA78`@0 | match |
| glow | filter | `blur(5px)` | *(none)* | **MISMATCH\*** — RN SVG has no blur filter; substitute is the gradient's own falloff (documented kit.tsx:20–23). |
| speck A | l/t/size/radius/fill | 216 / 22 / 2 × 2 / 50% / `rgba(200,225,235,0.4)` | `Specks a={[216, 22]}`, 2 × 2, r 1 | match |
| speck B | l/t/size/radius/fill | 10 / 50 / 2 × 2 / 50% / `rgba(200,225,235,0.3)` | `b={[10, 50]}` | match |
| knot svg | l / t / w × h / viewBox | 20 / 58 / 200 × 80 / `0 0 200 80` | 20 / 58 / 200 × 80 / `0 0 200 80` | match |
| ring 1 | cx/cy/r/fill/stroke/width | 42 / 42 / 19 / none / `#B4B1AB` / 2.6 | identical | match |
| ring 2 | cx/cy/r/stroke/width | 60 / 42 / 19 / `#B4B1AB` / 2.6 | identical | match |
| ring 3 | cx/cy/r/stroke/width | 78 / 42 / 19 / `#B4B1AB` / 2.6 | identical | match |
| tail | path `d` | `M95 50 C124 58 156 52 186 42` | `M95 50 C124 58 156 52 186 42` | match |
| tail | stroke / width / linecap / fill | `#B4B1AB` / 2.6 / round / none | identical | match |
| dot | l/t/w/h/radius/fill | 206 / 94 / 9 / 9 / 50% / `rgba(226,186,120,1)` | 206 / 94 / 9 / 9 / r 4.5 / `#E2BA78` | match |
| dot glow | l/t/size/alpha | 194 / 82 / 32 / 0.4 | `Glow l={194} t={82} size={32} alpha={0.4}` | match |
| dot glow | z-order | painted **after** the dot | rendered after the dot (kit.tsx:198–200) | match |
| ground shade | l/t/w/h/fill | 42 / 166 / 110 / 13 / `rgba(0,0,0,0.10)` + `blur(5px)` | `Shade l={42} t={166} w={110} h={13}` alpha 0.1 | **MISMATCH\*** — blurred solid ellipse redrawn as a radial falloff (flat to 0.45, → 0 at 1). |

---

## 3. Rough-Boredom-III — artwork `threethings` (kit.tsx:354–369)

| Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|
| glow | l/t/size/alpha | 112 / 36 / 108 / 0.34 | 112 / 36 / 108 / 0.34 | match |
| glow | filter | `blur(4px)` | *(none)* | **MISMATCH\*** — gradient falloff substitute (note: this frame blurs 4px, Anxiety-I 5px; the substitute is size-invariant either way). |
| specks | a / b | (216, 20) / (8, 48) | `<Specks />` defaults `a=[216,20] b=[8,48]` | match |
| screen body | l/t/w/h/radius/fill | 112 / 40 / 100 / 96 / 7 / `#E4E3DE` | identical | match |
| upper pane | l/t/w/h/radius | 120 / 48 / 84 / 38 / 3 | identical | match |
| upper pane | gradient | `linear-gradient(180deg, #F7F6F2, #EDECE7)` | `VGrad x1=0,y1=0 → x2=0,y2=1`, `#F7F6F2` → `#EDECE7` | match |
| lower pane | l/t/w/h/radius/fill | 120 / 92 / 84 / 36 / 3 / `#F7F6F2` | identical | match |
| glass | l/t/w/h | 40 / 124 / 24 / 40 | identical | match |
| glass | radius per corner | `3px 3px 5px 5px` | TL 3, TR 3, BR 5, BL 5 | match |
| glass | fill / ring | `#F7F6F2` / `inset 0 0 0 1.5px rgba(0,0,0,0.08)` | `#F7F6F2` / `borderWidth 1.5, borderColor rgba(0,0,0,0.08)` | match (inset ring ≡ RN inside border) |
| water | l/t/w/h/radius/fill | 43 / 140 / 18 / 21 / `0 0 4px 4px` / `#D9E2E8` | 43 / 140 / 18 / 21 / BR 4 BL 4 / `#D9E2E8` | match |
| mat | l/t/w/h/radius/fill | 84 / 152 / 40 / 6 / 3 / `#B4B1AB` | identical | match |
| shoe L | l/t/w/h/radius/fill | 80 / 146 / 9 / 18 / 3 / `#8B8880` | identical | match |
| shoe R | l/t/w/h/radius/fill | 119 / 146 / 9 / 18 / 3 / `#8B8880` | identical | match |
| shade 1 | l/t/w/h | 36 / 170 / 96 / 13 @ `rgba(0,0,0,0.10)` | identical, alpha 0.1 | **MISMATCH\*** (blur → radial falloff) |
| shade 2 | l/t/w/h | 140 / 142 / 72 / 13 @ `rgba(0,0,0,0.10)` | identical, alpha 0.1 | **MISMATCH\*** (same) |
| z-order | paint sequence | glow, specks, body, upper, lower, glass, water, mat, shoeL, shoeR, shade1, shade2 | same sequence | match |

---

## 4. Rough-An-argument-II — artwork `toppled` (kit.tsx:531–591)

| Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|
| specks | a / b | (214, 26) / (16, 44) | `<Specks a={[214, 26]} b={[16, 44]} />` | match |
| specks | z-order | first element in the slot | first (kit.tsx:533) | match |
| board shade | l/t/w/h/fill | 45 / 180 / 150 / 11 / `rgba(0,0,0,0.1)` + blur 5 | `Shade l={45} t={180} w={150} h={11}` alpha 0.1 | **MISMATCH\*** (blur → radial falloff) |
| board | l/t/w/h/radius/overflow | 52 / 134 / 136 / 44 / 6 / `hidden` | identical, `overflow:'hidden'` | match |
| board | box-shadow | `0 3px 8px rgba(40,38,32,0.1)` | `boxShadow:'0 3px 8px rgba(40,38,32,0.1)'` | match |
| tile columns | x positions | 0, 22.67, 45.34, 68.01, 90.68, 113.35000000000001 | same six literals (kit.tsx:90) | match |
| tile | w × h | 22.67 × 22 (last column overhangs 136 by 0.02, clipped) | 22.67 × 22, clipped by the board | match |
| tiles row y = 0 | fills L→R | `#EBEAE4`, `#D9D8D2`, `#EBEAE4`, `#D9D8D2`, `#EBEAE4`, `#D9D8D2` | `col % 2 ? '#D9D8D2' : '#EBEAE4'` → same | match |
| tiles row y = 22 | fills L→R | `#D9D8D2`, `#EBEAE4`, `#D9D8D2`, `#EBEAE4`, `#D9D8D2`, `#EBEAE4` | `col % 2 ? '#EBEAE4' : '#D9D8D2'` → same | match |
| glow | l/t/size/alpha | 62 / 48 / 52 / 0.45 | 62 / 48 / 52 / 0.45 | match |
| piece shade | l/t/w/h/alpha | 71 / 130 / 34 / 11 / `rgba(0,0,0,0.08)` | `Shade ... alpha={0.08}` | **MISMATCH\*** (blur → radial falloff) |
| standing head | l/t/w/h/radius/fill | 79 / 69 / 18 / 18 / 50% / `#6B6862` | 79 / 69 / 18 / 18 / r 9 / `#6B6862` | match |
| standing arms | l/t/w/h/radius/fill | 76 / 89 / 24 / 5 / 2.5 / `#6B6862` | identical | match |
| standing torso | l/t/w/h/radius/fill | 81 / 94 / 14 / 26 / `7px 7px 3px 3px` / `#6B6862` | TL7 TR7 BR3 BL3 | match |
| standing base | l/t/w/h/radius/fill | 74 / 120 / 28 / 8 / `4px 4px 2px 2px` / `#6B6862` | TL4 TR4 BR2 BL2 | match |
| fallen group | l/t/w/h | 132 / 96 / 52 / 30 | identical | match |
| fallen group | transform / origin / opacity | `rotate(84deg)` / `center` / 0.85 | `rotate:'84deg'`, `transformOrigin:'center'`, `opacity:0.85` | match |
| fallen head | l/t/w/h/radius/fill | 0 / 11 / 15 / 15 / 50% / `#B4B1AB` | r 7.5, `#B4B1AB` | match |
| fallen neck | l/t/w/h/radius | 14 / 13 / 5 / 11 / 2 | identical | match |
| fallen torso | l/t/w/h/radius | 18 / 11 / 22 / 14 / `3px 7px 7px 3px` | TL3 TR7 BR7 BL3 | match |
| fallen legs | l/t/w/h/radius | 39 / 8 / 8 / 21 / `2px 4px 4px 2px` | TL2 TR4 BR4 BL2 | match |
| spark | l/t/w/h/radius/fill | 88 / 60 / 5 / 5 / 50% / `rgba(226,186,120,0.9)` | 88 / 60 / 5 / 5 / r 2.5 / `rgba(226,186,120,0.9)` | match |
| slot | glow present? | **no** overall warm glow — only the 52px one at (62,48) | only `rd-toppled-glow` | match |

---

## 5. Rough-An-argument-III — artwork `writeit` (kit.tsx:593–628)

| Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|
| glow | l/t/size/alpha | 70 / 42 / 120 / 0.34 | 70 / 42 / 120 / 0.34 | match |
| glow | filter | `blur(4px)` | *(none)* | **MISMATCH\*** (gradient falloff substitute) |
| specks | a / b | (216, 20) / (8, 48) | `<Specks />` defaults | match |
| page | l/t/w/h/radius/fill | 52 / 70 / 112 / 84 / 8 / `#F7F6F2` | identical | match |
| page | ring | `inset 0 0 0 1.5px rgba(0,0,0,0.06)` | `borderWidth 1.5, borderColor 'rgba(0,0,0,0.06)'` | match |
| page | transform | `rotate(-2deg)` (origin default center) | `rotate:'-2deg'` | match |
| gutter rule | l/t/w/h/fill/transform | 106 / 72 / 2 / 80 / `#E0DFDA` / `rotate(-2deg)` | identical | match |
| line 1 | l/t/w/h/radius/fill | 64 / 88 / 32 / 4 / 2 / `#E0DFDA` | identical | match |
| line 2 | l/t/w/h/radius/fill | 64 / 100 / 32 / 4 / 2 / `#E0DFDA` | identical | match |
| line 3 | l/t/w/h/radius/fill | 118 / 86 / 32 / 4 / 2 / `#E0DFDA` | identical | match |
| pen barrel | l/t/w/h/radius/fill | 142 / 120 / 44 / 6 / 3 / `#E9D2A4` | identical | match |
| pen barrel | inset shadow | `inset 0 -1.5px 0 rgba(0,0,0,0.08)` | `boxShadow:'inset 0 -1.5px 0 rgba(0,0,0,0.08)'` | match |
| pen barrel | transform / origin | `rotate(-24deg)` / `left center` | `rotate:'-24deg'`, `transformOrigin:'left center'` | match |
| nib | l/t/w/h/fill | 181 / 101.5 / 8 / 6 / `#55534E` | 181 / 101.5, Svg 8 × 6, fill `#55534E` | match |
| nib | shape | `clip-path:polygon(0 0, 100% 50%, 0 100%)` | `<Path d="M0 0 L8 3 L0 6 Z" />`, viewBox `0 0 8 6` | match (clip-path → SVG triangle) |
| nib | transform | `rotate(-24deg)` (origin center) | `rotate:'-24deg'` on the Svg | match |
| grip | l/t/w/h/radius/fill/transform | 139 / 119 / 7 / 6.5 / 3 / `#C6C5C0` / `rotate(-24deg)` | identical | match |
| ball 1 | l/t/w×h/viewBox | 34 / 150 / 30 × 28 / `0 0 30 28` | identical | match |
| ball 1 | path `d` | `M15 2 C22 2 28 8 26 15 C29 20 24 26 18 25 C12 28 5 25 5 19 C1 15 4 8 9 7 C10 3 12 2 15 2 Z` | identical | match |
| ball 1 | fill / stroke / width | `#EBEAE4` / `#D6D5D0` / 1.8 | identical | match |
| ball 2 | l/t/w×h/viewBox | 66 / 160 / 26 × 24 / `0 0 26 24` | identical | match |
| ball 2 | path `d` | `M13 2 C19 2 24 7 22 13 C25 17 20 22 15 21 C10 24 4 21 4 16 C1 12 4 7 8 6 Z` | identical | match |
| ball 2 | fill / stroke / width | `#EBEAE4` / `#D6D5D0` / 1.6 | identical | match |
| bin | l/t/w×h/viewBox | 178 / 120 / 40 × 60 / `0 0 40 60` | identical | match |
| bin body | path `d` / fill | `M6 8 L34 8 L30 56 L10 56 Z` / `#D6D5D0` | identical | match |
| bin rim | path `d` / stroke / width / linecap | `M4 8 L36 8` / `#B4B1AB` / 3 / round | identical | match |
| shade | l/t/w/h | 48 / 180 / 120 / 13 @ `rgba(0,0,0,0.10)` | identical, alpha 0.1 | **MISMATCH\*** (blur → radial falloff) |
| z-order | paint sequence | glow, specks, page, gutter, 3 lines, barrel, nib, grip, ball1, ball2, bin, shade | same sequence | match |

---

## 6. Sentence-Journal (`src/app/affirmation.tsx`, journal mode)

| Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|
| root | background | `#F4F3F0` | `#F4F3F0` (l.86) | match |
| skeleton wrapper | inset / opacity | 0 / `0.45` | inset 0 / `0.45` (l.90) | match |
| skeleton block 1 | l/r/top/h/radius/fill | 12 / 12 / canvas 164 → app 110 (+inset) / 48 / 12 / `#E8E7E1` | 12 / 12 / **164** / 48 / 12 / `#E8E7E1` (l.91) | **MISMATCH** — raw canvas y, no `−54 + insets.top` |
| skeleton block 2 | l/r/top/h/radius/fill | 36 / 36 / canvas 228 → app 174 (+inset) / 236 / 16 / `#E8E7E1` | 36 / 36 / **228** / 236 / 16 / `#E8E7E1` (l.92) | **MISMATCH** — same |
| skeleton block 3 | l/r/top/h/radius/fill | 12 / 12 / canvas 544 → app 490 (+inset) / 152 / 14 / `#E8E7E1` | 12 / 12 / **544** / 152 / 14 / `#E8E7E1` (l.93) | **MISMATCH** — same |
| scrim | inset / fill / z | 0 / `rgba(38,37,30,0.42)` / 5 | inset 0 / `rgba(38,37,30,0.42)` / between skeleton and sheet (l.100) | match |
| status bar | z-index | 20 — drawn **over** scrim and sheet | OS bar, `StatusBar style="dark"` (l.87) | match |
| sheet | top | canvas `320` → app `266` (+inset) | `SHEET_TOP = 320` flat (l.37, l.108) | **MISMATCH** — assumes `insets.top === 54`; 5pt high on a 59pt-inset device |
| sheet | left / right / bottom | 0 / 0 / 0 | 0 / 0 / 0 | match |
| sheet | radius | `22px 22px 0 0` | 22 / 22 top corners (l.110–111) | match |
| sheet | background | `#F4F3F0` | `#F4F3F0` | match |
| sheet | box-shadow | `0 -12px 36px rgba(20,19,16,0.22)` | `'0 -12px 36px rgba(20,19,16,0.22)'` (l.113) | match |
| grabber | left / margin-left / top | `50%` / −18 / 10 | `'50%'` / −18 / 10 (l.115) | match |
| grabber | w / h / radius / fill | 36 / 4 / 2 / `rgba(0,0,0,0.15)` | 36 / 4 / 2 / `rgba(0,0,0,0.15)` | match |
| prompt heading | left / right / top | 24 / 40 / 44 | 24 / 40 / 44 (l.133) | match |
| prompt heading | size / weight / line-height / ls / colour | 22 / 500 / 29 / −0.2 / `#1D1C1A` | 22 / `sans('500')` / 29 / −0.2 / `#1D1C1A` | match |
| prompt heading | text-wrap | `pretty` | *(absent)* | **MISMATCH\*** — no RN equivalent; platform greedy break stands in |
| prompt heading | text | `Why are you choosing to abstain today?` | `PROMPTS[0]` = same (l.25) | match |
| reroll row | left / top / gap / align | 24 / 112 / 7 / center | 24 / 112 / 7 / `alignItems:'center'`, row (l.144) | match |
| reroll glyph | w × h / viewBox | 13 × 13 / `0 0 16 16` | `RerollGlyph size={13}`, viewBox `0 0 16 16` (day/kit.tsx:688) | match |
| reroll glyph | arc `d` / stroke / width / linecap | `M13.5 6.5A6 6 0 1 0 14 9` / `#8B8882` / 1.8 / round | identical | match |
| reroll glyph | tick `d` / stroke / width / caps | `M14 3v3.5h-3.5` / `#8B8882` / 1.8 / round + `stroke-linejoin:round` | identical | match |
| reroll label | size / weight / colour / text | 13 / 500 / `#8B8882` / `Different prompt` | 13 / `sans('500')` / `#8B8882` / `Different prompt` (l.146) | match |
| card | l/r/top/h/radius/fill | 16 / 16 / 148 / 126 / 14 / `#FFFFFF` | 16 / 16 / 148 / 126 / 14 / `#FFFFFF` (l.149) | match |
| card | ring | `0 0 0 1px rgba(0,0,0,0.06)` | `boxShadow:'0 0 0 1px rgba(0,0,0,0.06)'` | match |
| card text | left / right / top | 18 / 18 / 16 | 18 / 18 / 16 (l.157) | match |
| card text | font-family / size / line-height / colour | `Georgia,'Times New Roman',serif` / 17 / 26 / `#1D1C1A` | `fonts.quote` (`Georgia` on iOS) / 17 / 26 / `#1D1C1A` | match |
| card text | height | auto (no height declared) | `height: 94` (126 − 16 top − 16 bottom) | match (RN `TextInput` needs a box; matches the frame's own inset) |
| card text | drawn state | entered ink `#1D1C1A`, text `Because I want to be at Maya’s recital on Friday with a clear head` | that exact string used as **placeholder** at `rgba(139,136,130,0.7)` (l.154–155) | **MISMATCH** — the frame's one drawn state (filled, full-ink) is never reachable from the drawn string; the app inverts it to an empty state |
| card caret | w / h / fill / vertical-align / margin-left | 2 / 19 / `#131313` / −3 / 2 | `selectionColor`/`cursorColor` `#131313`, native caret metrics (l.160–161) | **MISMATCH\*** — RN cannot size or offset the caret; native caret is the substitute |
| primary pill | l/r/top/h/radius/bg | 16 / 16 / 306 / 52 / 26 / `#131313` | 16 / 16 / 306 / 52 / 26 / `#131313` (l.171–177) | match |
| primary pill | justify / align | center / center | center / center | match |
| primary label | size / weight / colour / text | 17 / 600 / `#FFFFFF` / `Save today’s line` | 17 / `sans('600')` / `#FFFFFF` / `Save today’s line` (l.182) | match |
| secondary pill | l/r/top/h/radius/bg | 16 / 16 / 370 / 52 / 26 / `#FFFFFF` | 16 / 16 / 370 / 52 / 26 / `#FFFFFF` (l.193–200) | match |
| secondary pill | ring | `0 0 0 1px rgba(0,0,0,0.08)` | `boxShadow:'0 0 0 1px rgba(0,0,0,0.08)'` | match |
| secondary label | size / weight / colour / text | 15.5 / 600 / `#1D1C1A` / `Write my own prompt` | 15.5 / `sans('600')` / `#1D1C1A` / `Write my own prompt` (l.205) | match |

---

## 7. Sentence-Journal-Custom-prompt (`CustomPrompt`, affirmation.tsx:215–268)

Shell, skeleton, scrim, sheet and grabber are byte-identical to §6 — same three coordinate
findings apply and are not repeated.

| Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|
| heading | left / right / top | 24 / 40 / 44 | 24 / 40 / 44 (l.218) | match |
| heading | size / weight / line-height / ls / colour | 22 / 500 / 29 / −0.2 / `#1D1C1A` | 22 / `sans('500')` / 29 / −0.2 / `#1D1C1A` | match |
| heading | text-wrap | *(none — unlike the journal heading)* | *(none)* | match |
| heading | text | `Write your own prompt` | `Write your own prompt` (l.219) | match |
| sub | left / right / top | 24 / 24 / 80 | 24 / 24 / 80 (l.221) | match |
| sub | size / weight / colour / line-height | 13 / 400 / `#8B8882` / *(unset)* | 13 / `sans('400')` / `#8B8882` / unset | match |
| sub | text | `It’ll be waiting for you each morning.` | `It’ll be waiting for you each morning.` (l.222) | match |
| card | l/r/top/h/radius/fill/ring | 16 / 16 / 116 / 126 / 14 / `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.06)` | identical (l.225) | match |
| card text | left / right / top | 18 / 18 / 16 | 18 / 18 / 16 (l.236) | match |
| card text | family / size / style / line-height / colour | `Georgia,'Times New Roman',serif` / 17 / **italic** / 26 / `#1D1C1A` | `fonts.quote` / 17 / `fontStyle:'italic'` / 26 / `#1D1C1A` | match |
| card text | drawn value | `What does tomorrow-me get if I hold the line?` (filled, `#1D1C1A`) | placeholder `What am I protecting today?` at `rgba(139,136,130,0.7)` (l.230–231) | **MISMATCH** — the app's string appears nowhere in the bundle (grep over `.uifinal/final` returns nothing); the frame's string is dropped |
| card caret | w / h / fill / margins | 2 / 19 / `#131313` / va −3, ml 2 | native caret, `cursorColor` `#131313` (l.232–233) | **MISMATCH\*** — same substitute as §6 |
| primary pill | l/r/top/h/radius/bg | 16 / 16 / 274 / 52 / 26 / `#131313` | 16 / 16 / 274 / 52 / 26 / `#131313` (l.246–255) | match |
| primary label | size / weight / colour / text | 17 / 600 / `#FFFFFF` / `Use this prompt` | 17 / `sans('600')` / `#FFFFFF` / `Use this prompt` (l.257) | match |
| back link | left / right / top / align | 0 / 0 / 346 / center | 0 / 0 / 346 / `alignItems:'center'` (l.264) | match |
| back link | size / weight / colour | 13.5 / 500 / `#8B8882` | 13.5 / `sans('500')` / `#8B8882` (l.265) | match |
| back link | text | `Back to prompts` | `Back to today’s prompt` (l.265) | **MISMATCH** — substituted copy |

---

## Findings

1. **`src/app/affirmation.tsx:265`** — back link copy. Current: `Back to today’s prompt`.
   Design (`Sentence-Journal-Custom-prompt`): `Back to prompts`.

2. **`src/app/affirmation.tsx:230`** — custom-prompt field text. Current placeholder:
   `What am I protecting today?` — a string that appears in no frame in the bundle.
   Design: the field is drawn holding `What does tomorrow-me get if I hold the line?`.

3. **`src/app/affirmation.tsx:37` (and `:108`)** — `SHEET_TOP = 320` is the raw canvas y.
   Design: canvas `320` → app `266` + `insets.top` (the house conversion, `src/app/score.tsx:54`,
   `src/components/roughDays/kit.tsx:708`, `src/app/relapse.tsx:99`). Current value is correct only
   where `insets.top === 54`; on a 59pt device the whole sheet and everything in it sits 5pt high.

4. **`src/app/affirmation.tsx:91`** — skeleton block 1 `top: 164`. Design: canvas `164` → app
   `110` + `insets.top`.

5. **`src/app/affirmation.tsx:92`** — skeleton block 2 `top: 228`. Design: canvas `228` → app
   `174` + `insets.top`.

6. **`src/app/affirmation.tsx:93`** — skeleton block 3 `top: 544`. Design: canvas `544` → app
   `490` + `insets.top`.

7. **`src/app/affirmation.tsx:154`** — journal card state. Current: the frame's own sentence is
   wired as `placeholder` at `rgba(139,136,130,0.7)`. Design: the frame draws that sentence as
   *entered* text at `#1D1C1A` with a caret after it — the app never renders the state the frame draws.

### MISMATCH\* — no RN expression, substitute named

- `kit.tsx:722` (sub) and `kit.tsx:729` (act line), and `affirmation.tsx:133` (prompt heading) —
  `text-wrap: balance` / `text-wrap: pretty`. RN has no `text-wrap`; the platform's greedy line
  breaker stands in. No RN property can express either value.
- `kit.tsx:28–40` `Glow` — `filter: blur(4px|5px)` over `radial-gradient(closest-side, …)`.
  Substitute: an SVG `RadialGradient` whose 0 → 0.74 falloff stands in for the blur.
- `kit.tsx:44–57` `Shade` — a blurred solid ellipse (`blur(5px)`). Substitute: a radial gradient
  held flat to offset 0.45 and faded to 0 at 1.
- `affirmation.tsx:160–161` and `:232–233` — the drawn caret (2 × 19, `#131313`, `vertical-align:-3px`,
  `margin-left:2px`). RN exposes only `cursorColor`/`selectionColor`; the native caret's width,
  height and offset are not settable.
