# Property audit — money & score

Frames audited (6), all read in full from `.uifinal/pretty/final/Email Login/`:

| Frame | Pretty file | Lines | App target |
|---|---|---|---|
| Free-Trial-Paywall | `Free-Trial-Paywall.html` | 529 | `src/components/paywall/PaywallFlow.tsx` (`PwMain`, `PwHeaderArt`, `PwPlanRow`, `PwBenefit`, `PwX`, `PwCTA`), entered via `src/app/paywall.tsx` |
| Paywall-Rescue | `Paywall-Rescue.html` | 276 | `src/components/paywall/PaywallFlow.tsx` (`PwTrialOffer`, `OfferIcon`, `PwFloorGlow`) |
| Paywall-Confirmed | `Paywall-Confirmed.html` | 171 | `src/components/paywall/PaywallFlow.tsx` (`PwConfirmed`) |
| Score-Detail | `Score-Detail.html` | 611 | `src/app/score.tsx` (`NightHeader`, `OverTime`, `InsightCard`) |
| Score-Detail-Moves | `Score-Detail-Moves.html` | 643 | `src/app/score.tsx` (`NightHeader`, `WhatMoved`) |
| Score-Detail-Ranks | `Score-Detail-Ranks.html` | 612 | `src/app/score.tsx` (`NightHeader`, `TheRanks`) |

## Coordinate convention

Every frame is a `393px × 852px` div and every `top` in it is measured from the
physical frame top, which **includes a 54px status-bar row the app never builds**.
The app's equivalent top is `canvas top − 54`. Both numbers are stated in every
absolute-offset row below as `canvas <n> / app <n−54>`.

Two exceptions where no `−54` applies:

- **The score sheet's children.** The sheet div sits at canvas `top:302` and its
  children are positioned relative to *it*, so their tops carry over unchanged.
  `src/app/score.tsx:55` defines `y = (v) => v - 54 + insets.top` and applies it
  only to the header and to `sheetTop` (`:56`), never to sheet children. Correct.
- **Anything anchored with `bottom`.** The canvas measures from the frame's
  bottom edge, which the app shares (its `SafeAreaView` takes `edges={['top']}`
  only). `bottom:96` is `bottom: 96`.

The app writes the offset as `insets.top` rather than a literal 54, so it lands on
the canvas number exactly when the device's top inset is 54 and tracks the real
notch otherwise. Every "app value" below is given at `insets.top = 54`.

## Canvas contradictions found

1. **Page-dot count on the score sheet.** `Score-Detail.html:581–608` draws
   **four** 6px dots; `Score-Detail-Moves.html:620–640` and
   `Score-Detail-Ranks.html:589–609` each draw **three**. The evidence supports
   **three**: the design set contains exactly three score pages (Score over time
   / What moved it / The ranks), the two later frames agree on three, and the
   active dot in those frames is the 2nd of 3 and the 3rd of 3 respectively —
   a four-dot rail would leave a dot that no frame ever activates.
   `src/app/score.tsx:96` renders `[0, 1, 2]` → three. Audited against the
   three-dot reading.
2. **The chart's plot frame.** `Score-Detail.html` places the 1,300 rank line at
   `y=32` and the end marker at `cy=52`, but its own y-axis labels
   (`top:-6 / 58 / 124 / 183` for 1,400 / 1,200 / 1,000 / 800) imply
   1,400 → y≈1 and 800 → y≈190, which puts 1,300 at 32.5 and 1,240 at 51.4.
   The frame is internally ~0.5–0.6px inconsistent. `src/app/score.tsx:258–259`
   adopts the label-derived reading (`PLOT_TOP = 1`, `PLOT_BOTTOM = 190`); the
   rows below are written against the frame's literal `32` / `52`.
3. **The ledger bar widths.** `Score-Detail-Moves.html` draws 150 / 58 / 44 / 34
   / 52 for +64 / +18 / +12 / +8 / −16. Those five points do not lie on any
   line: the extremes fix the ramp at `w = 2.0714·|p| + 17.43`, which returns
   54.71 / 42.29 / 50.57 for the three middles, not 58 / 44 / 52. The frame's
   endpoints are self-consistent, its middles are eyeballed. Rows below give
   both numbers.

---

## Frame 1 — Free-Trial-Paywall

App: `src/components/paywall/PaywallFlow.tsx` · route `src/app/paywall.tsx`

### Frame shell

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Free-Trial-Paywall | frame | width | `393px` | device width (`useWindowDimensions().width`, `:482`) | match (canvas reference width) |
| Free-Trial-Paywall | frame | height | `852px` | device height, `flex: 1` (`:515`) | match (canvas reference height) |
| Free-Trial-Paywall | frame | position | `relative` | `flex: 1` root `View` (`:515`) | match |
| Free-Trial-Paywall | frame | overflow | `hidden` | screen root, no overflow set | match (no overflow possible) |
| Free-Trial-Paywall | frame | background | `#F4F3F0` | `backgroundColor: '#F4F3F0'` (`:515`) | match |
| Free-Trial-Paywall | frame | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | iOS `'System'`; web `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif` (`theme.ts:159–186`) | match on iOS (both resolve to SF Pro); web fallback chain differs after `-apple-system` |
| Free-Trial-Paywall | frame | -webkit-font-smoothing | `antialiased` | `WebkitFontSmoothing: 'antialiased'` on web (`AppText.tsx:118`) | match |
| Free-Trial-Paywall | frame | flex-shrink | `0` | n/a (gallery-only) | n/a |
| Free-Trial-Paywall | frame | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | n/a (canvas device bezel, not app chrome) |
| Free-Trial-Paywall | status bar row | height / padding / contents | `54px`, `padding:6px 32px 0 46px`, mock 9:41 + 3 glyphs | not built; `<StatusBar style="dark" />` (`paywall.tsx:13`) | n/a by design (dark content matches the mock's `#1D1C1A`) |

### Header band (canvas `top:0 height:296`)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Free-Trial-Paywall | header band | position / left / right | `absolute`, `left:0`, `right:0` | `position:'absolute', left:0, right:0` (`:522`) | match |
| Free-Trial-Paywall | header band | top | canvas `0` / app `0` (drawn from the physical top, behind the status bar) | `top: 0` (`:522`) | match |
| Free-Trial-Paywall | header band | height | `296px` | `bandH = insets.top + 242` = 296 (`:512`, `:522`) | match |
| Free-Trial-Paywall | header band | overflow | `hidden` | `overflow: 'hidden'` (`:522`) | match |
| Free-Trial-Paywall | header band | pointer-events | not stated | `pointerEvents="none"` (`:522`) | app-only (no design contradiction) |
| Free-Trial-Paywall | band base fill | gradient angle | `linear-gradient(180deg, …)` | `LinearGradient` default `start {x:.5,y:0}` → `end {x:.5,y:1}` (`:523`) | match |
| Free-Trial-Paywall | band base fill | stop 1 | `#F0EFE9 0%` | `'#F0EFE9'` at 0 (`:523`) | match |
| Free-Trial-Paywall | band base fill | stop 2 | `#F0EBDF 100%` | `'#F0EBDF'` at 1 (`:523`) | match |
| Free-Trial-Paywall | band base fill | inset | `inset:0` | `left:0,right:0,top:0,bottom:0` (`:523`) | match |
| Free-Trial-Paywall | sun halo | left | `52%` | ellipse `cx = 0.74·w` = `0.52 + 0.22` (`:89`,`:110`) | match |
| Free-Trial-Paywall | sun halo | top | `-4%` | ellipse `cy = 0.18·h` = `−0.04 + 0.22` (`:90`,`:110`) | match |
| Free-Trial-Paywall | sun halo | width | `44%` | `rx = 0.22·w` (`:110`) | match |
| Free-Trial-Paywall | sun halo | height | `44%` | `ry = 0.22·h` (`:110`) | match |
| Free-Trial-Paywall | sun halo | border-radius | `50%` | `<Ellipse>` (`:110`) | match |
| Free-Trial-Paywall | sun halo | gradient type | `radial-gradient(closest-side, …)` | `RadialGradient cx="50%" cy="50%" r="50%"` on the ellipse box (`:104`) | match (closest-side on a centred ellipse = the ellipse itself) |
| Free-Trial-Paywall | sun halo | stop 1 | `rgba(243,227,196,0.95)` at 0 | `#F3E3C4` `stopOpacity 0.95` at `0` (`:105`) | match (`#F3E3C4` = `rgb(243,227,196)`) |
| Free-Trial-Paywall | sun halo | stop 2 | `rgba(243,227,196,0)` at `78%` | `#F3E3C4` `stopOpacity 0` at `0.78` (`:106`) | match |
| Free-Trial-Paywall | sun halo | stop 3 | not stated (CSS holds the last stop) | `#F3E3C4` `stopOpacity 0` at `1` (`:107`) | match (explicit tail, same result) |
| Free-Trial-Paywall | cloud 1 | left / top | `8%` / `12%` | `x = 0.08·w`, `y = 0.12·h` (`:111`) | match |
| Free-Trial-Paywall | cloud 1 | width / height | `16%` / `5%` | `0.16·w` / `0.05·h` (`:111`) | match |
| Free-Trial-Paywall | cloud 1 | border-radius | `999px` (clamps to half of `5%·h`) | `rx = 0.025·h` (`:111`) | match (CSS clamp value transcribed) |
| Free-Trial-Paywall | cloud 1 | background | `#FFFFFF` | `fill="#FFFFFF"` (`:111`) | match |
| Free-Trial-Paywall | cloud 1 | opacity | `0.7` | `opacity={0.7}` (`:111`) | match |
| Free-Trial-Paywall | cloud 2 | left / top | `74%` / `20%` | `0.74·w` / `0.2·h` (`:112`) | match |
| Free-Trial-Paywall | cloud 2 | width / height | `12%` / `4%` | `0.12·w` / `0.04·h` (`:112`) | match |
| Free-Trial-Paywall | cloud 2 | border-radius | `999px` (clamps to half of `4%·h`) | `rx = 0.02·h` (`:112`) | match |
| Free-Trial-Paywall | cloud 2 | background / opacity | `#FFFFFF` / `0.55` | `fill="#FFFFFF"` / `opacity={0.55}` (`:112`) | match |
| Free-Trial-Paywall | low sun | viewBox | `0 0 40 26` | scale `s = (0.11·w)/40` applied to the same box (`:91`) | match |
| Free-Trial-Paywall | low sun | left / top | `58%` / `30%` | `cx = 0.58·w + 20·s`, `cy = 0.3·h + 13·s` (`:113`) | match |
| Free-Trial-Paywall | low sun | width | `11%` | `s·40 = 0.11·w` (`:91`) | match |
| Free-Trial-Paywall | low sun | circle cx/cy/r | `20` / `13` / `9` | `20·s` / `13·s` / `9·s` offset by the svg origin (`:113`) | match |
| Free-Trial-Paywall | low sun | fill | `#E9D2A4` | `fill="#E9D2A4"` (`:113`) | match |
| Free-Trial-Paywall | hill 1 | left / right | `-20%` / `-20%` | `hill(-0.2, 1.2, …)` → x1 `−0.2w`, x2 `1.2w` (`:114`) | match |
| Free-Trial-Paywall | hill 1 | top | `48%` | `top = 0.48` (`:114`) | match |
| Free-Trial-Paywall | hill 1 | height | `80%` | `bottom = top·h + 0.8·h` (`:98`) | match |
| Free-Trial-Paywall | hill 1 | border-radius | `50% 50% 0 0 / 60% 60% 0 0` | `rx = (x2−x1)/2` (the 50% horizontal), `ry = 0.6·0.8·h` (`:95–97`) | match |
| Free-Trial-Paywall | hill 1 | background | `#DEDDD6` | `fill="#DEDDD6"` (`:114`) | match |
| Free-Trial-Paywall | hill 2 | left / right / top | `-42%` / `-10%` / `62%` | `hill(-0.42, 1.1, 0.62, …)` (`:115`) | match |
| Free-Trial-Paywall | hill 2 | border-radius | `50% 50% 0 0 / 52% 52% 0 0` | `ryPct = 0.52` (`:115`) | match |
| Free-Trial-Paywall | hill 2 | height / background | `80%` / `#C8D7E5` | `0.8·h` / `fill="#C8D7E5"` (`:115`) | match |
| Free-Trial-Paywall | hill 3 | left / right / top | `-10%` / `-42%` / `78%` | `hill(-0.1, 1.42, 0.78, …)` (`:116`) | match |
| Free-Trial-Paywall | hill 3 | border-radius | `50% 50% 0 0 / 46% 46% 0 0` | `ryPct = 0.46` (`:116`) | match |
| Free-Trial-Paywall | hill 3 | height / background | `80%` / `#C0BFB8` | `0.8·h` / `fill="#C0BFB8"` (`:116`) | match |
| Free-Trial-Paywall | hills | z-order | source order: hill1, hill2, hill3 over the sun | same order (`:114–116`) after `Circle` (`:113`) | match |
| Free-Trial-Paywall | band fade | left / right / bottom | `0` / `0` / `0` | `left:0, right:0, bottom:0` (`:528`) | match |
| Free-Trial-Paywall | band fade | height | `240px` | `height: 240` (`:528`) | match |
| Free-Trial-Paywall | band fade | gradient angle | `180deg` | `LinearGradient` default vertical (`:525`) | match |
| Free-Trial-Paywall | band fade | stops | `rgba(244,243,240,0) 0%`, `#F4F3F0 62%`, `#F4F3F0 100%` | `['rgba(244,243,240,0)','#F4F3F0','#F4F3F0']`, `locations={[0, 0.62, 1]}` (`:526–527`) | match |
| Free-Trial-Paywall | paper seam | left / right | `0` / `0` | `left:0, right:0` (`:240`) | match |
| Free-Trial-Paywall | paper seam | top | canvas `288` / app `234` | `top: 234` (`:240`) | match |
| Free-Trial-Paywall | paper seam | height | `38px` | `height: 38` (`:240`) | match |
| Free-Trial-Paywall | paper seam | background | `#F4F3F0` | `backgroundColor: '#F4F3F0'` (`:240`) | match |
| Free-Trial-Paywall | paper seam | z-index | `2` (over the band, under the rows) | painted first inside `PwMain`, before every row (`:240`) | match |

### Chrome

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Free-Trial-Paywall | close disc | left | `20px` | `left: 20` (`:242`) | match |
| Free-Trial-Paywall | close disc | top | canvas `66` / app `12` | `top: 12` (`:242`) | match |
| Free-Trial-Paywall | close disc | width / height | `34px` / `34px` | `width: 34, height: 34` (`:57`) | match |
| Free-Trial-Paywall | close disc | border-radius | `50%` | `borderRadius: 17` (`:57`) | match |
| Free-Trial-Paywall | close disc | background | `rgba(19,19,19,0.06)` | `fill="rgba(19,19,19,0.06)"` (`:243`) | match |
| Free-Trial-Paywall | close disc | box-shadow (ring) | `0 0 0 1px rgba(0,0,0,0.18)` | `boxShadow: '0 0 0 1px rgba(0,0,0,0.18)'` (`:57`, `:243`) | match |
| Free-Trial-Paywall | close disc | align / justify | `center` / `center` | `alignItems:'center', justifyContent:'center'` (`:57`) | match |
| Free-Trial-Paywall | close disc | z-index | `5` | painted after the seam, before the rows | match |
| Free-Trial-Paywall | close disc | min-height | not stated (34) | `minHeight: 0` overriding `PressScale`'s 44 (`:57`, `press-scale.tsx:33`) | match (keeps the 34 box) |
| Free-Trial-Paywall | close glyph | width / height | `15` / `15` | `width={15} height={15}` (`:58`) | match |
| Free-Trial-Paywall | close glyph | viewBox | `0 0 20 20` | `viewBox="0 0 20 20"` (`:58`) | match |
| Free-Trial-Paywall | close glyph | path d | `M3 3l14 14M17 3L3 17` | `"M3 3l14 14M17 3L3 17"` (`:59`) | match |
| Free-Trial-Paywall | close glyph | stroke | `#1D1C1A` | `stroke="#1D1C1A"` (`:59`) | match |
| Free-Trial-Paywall | close glyph | stroke-width | `2.4` | `strokeWidth={2.4}` (`:59`) | match |
| Free-Trial-Paywall | close glyph | stroke-linecap | `round` | `strokeLinecap="round"` (`:59`) | match |
| Free-Trial-Paywall | Restore | right | `20px` | `right: 20` (`:245`) | match |
| Free-Trial-Paywall | Restore | top | canvas `74` / app `20` | `top: 20` (`:245`) | match |
| Free-Trial-Paywall | Restore | font-size | `14px` | `fontSize: 14` (`:245`) | match |
| Free-Trial-Paywall | Restore | font-weight | `500` | `sans('500')` (`:245`) | match |
| Free-Trial-Paywall | Restore | colour | `#55534E` | `color: '#55534E'` (`:245`) | match |
| Free-Trial-Paywall | Restore | letter-spacing | not stated | dropped by `AppText` when the caller names a size (`AppText.tsx:129`) | match |
| Free-Trial-Paywall | Restore | line-height | not stated | dropped by `AppText` (`AppText.tsx:130`) | match |
| Free-Trial-Paywall | Restore | text | `Restore` | `Restore` (`:245`) | match |
| Free-Trial-Paywall | Restore | z-index | `5` | painted after the seam | match |

### Wordmark + headline

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Free-Trial-Paywall | mark row | left | `20px` | `left: 20` (`:247`) | match |
| Free-Trial-Paywall | mark row | top | canvas `228` / app `174` | `top: 174` (`:247`) | match |
| Free-Trial-Paywall | mark row | display / align-items | `flex` / `center` | `flexDirection:'row', alignItems:'center'` (`:247`) | match |
| Free-Trial-Paywall | mark row | gap | `9px` | `gap: 9` (`:247`) | match |
| Free-Trial-Paywall | mark row | z-index | `5` | paint order | match |
| Free-Trial-Paywall | "VICI" | font-family | `Georgia,'Times New Roman',serif` | `fonts.quote` → iOS `Georgia`, web `Georgia, 'Times New Roman', serif` (`theme.ts:220`, `:248`) | match |
| Free-Trial-Paywall | "VICI" | font-size | `15px` | `fontSize: 15` (`:248`) | match |
| Free-Trial-Paywall | "VICI" | font-weight | `500` | `fontWeight: '500'` (`:248`) | match |
| Free-Trial-Paywall | "VICI" | letter-spacing | `4px` | `letterSpacing: 4` (`:248`) | match |
| Free-Trial-Paywall | "VICI" | colour | `#1D1C1A` | `color: '#1D1C1A'` (`:248`) | match |
| Free-Trial-Paywall | "VICI" | text | `VICI` | `VICI` (`:248`) | match |
| Free-Trial-Paywall | PLUS pill | font-size | `10.5px` | `fontSize: 10.5` (`:250`) | match |
| Free-Trial-Paywall | PLUS pill | font-weight | `600` | `sans('600')` (`:250`) | match |
| Free-Trial-Paywall | PLUS pill | letter-spacing | `1px` | `letterSpacing: 1` (`:250`) | match |
| Free-Trial-Paywall | PLUS pill | colour | `#F4F3F0` | `color: '#F4F3F0'` (`:250`) | match |
| Free-Trial-Paywall | PLUS pill | background | `#131313` | `backgroundColor: '#131313'` (`:249`) | match |
| Free-Trial-Paywall | PLUS pill | border-radius | `7px` | `borderRadius: 7` (`:249`) | match |
| Free-Trial-Paywall | PLUS pill | padding | `3px 8px` | `paddingHorizontal: 8, paddingVertical: 3` (`:249`) | match |
| Free-Trial-Paywall | PLUS pill | text-transform | none (literal caps) | literal `PLUS` (`:250`) | match |
| Free-Trial-Paywall | PLUS pill | text | `PLUS` | `PLUS` (`:250`) | match |
| Free-Trial-Paywall | headline | left / right | `20px` / `80px` | `left: 20, right: 80` (`:253`) | match |
| Free-Trial-Paywall | headline | top | canvas `260` / app `206` | `top: 206` (`:253`) | match |
| Free-Trial-Paywall | headline | font-size | `28px` | `fontSize: 28` (`:253`) | match |
| Free-Trial-Paywall | headline | font-weight | `500` | `sans('500')` (`:253`) | match |
| Free-Trial-Paywall | headline | letter-spacing | `-0.2px` | `letterSpacing: -0.2` (`:253`) | match |
| Free-Trial-Paywall | headline | line-height | `36px` | `lineHeight: 36` (`:253`) | match |
| Free-Trial-Paywall | headline | colour | `#1D1C1A` | `color: '#1D1C1A'` (`:253`) | match |
| Free-Trial-Paywall | headline | text-align | not stated (left) | not set (left) | match |
| Free-Trial-Paywall | headline | text-wrap | not stated | `textWrap:'pretty'` on web only (`AppText.tsx:119`) | app-only on web; no native effect |
| Free-Trial-Paywall | headline | text | `The long road, together` | `The long road, together` (`:254`) | match |
| Free-Trial-Paywall | headline | z-index | `5` | paint order | match |

### Plan row — Yearly (selected / ink state)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Free-Trial-Paywall | yearly row | left / right | `16px` / `16px` | `left: 16, right: 16` (`:173–174`) | match |
| Free-Trial-Paywall | yearly row | top | canvas `330` / app `276` | `top={276}` (`:257`) | match |
| Free-Trial-Paywall | yearly row | height | `76px` | `height: 76` (`:176`) | match |
| Free-Trial-Paywall | yearly row | border-radius | `18px` (all four corners) | `borderRadius: 18` (`:177`) | match |
| Free-Trial-Paywall | yearly row | background | `#131313` | `active ? '#131313'` (`:182`) | match |
| Free-Trial-Paywall | yearly row | box-shadow | none on the ink state | `active ? undefined` (`:183`) | match |
| Free-Trial-Paywall | yearly row | display / align-items | `flex` / `center` | `flexDirection:'row', alignItems:'center'` (`:178–179`) | match |
| Free-Trial-Paywall | yearly row | gap | `14px` | `gap: 14` (`:180`) | match |
| Free-Trial-Paywall | yearly row | padding | `0 18px` | `paddingHorizontal: 18` (`:181`) | match |
| Free-Trial-Paywall | yearly row | box-sizing | `border-box` | RN border-box default | match |
| Free-Trial-Paywall | yearly row | z-index | `4` (over the seam) | painted after the seam (`:257`) | match |
| Free-Trial-Paywall | yearly radio | width / height | `23px` / `23px` | `width: 23, height: 23` (`:186`) | match |
| Free-Trial-Paywall | yearly radio | border-radius | `50%` | `borderRadius: 11.5` (`:186`) | match |
| Free-Trial-Paywall | yearly radio | background | `#F4F3F0` | `backgroundColor: '#F4F3F0'` (`:186`) | match |
| Free-Trial-Paywall | yearly radio | align / justify | `center` / `center` | `alignItems:'center', justifyContent:'center'` (`:186`) | match |
| Free-Trial-Paywall | yearly radio | flex-shrink | `0` | RN default `0` | match |
| Free-Trial-Paywall | yearly tick | width / height / viewBox | `12` / `12` / `0 0 24 24` | `width={12} height={12} viewBox="0 0 24 24"` (`:187`) | match |
| Free-Trial-Paywall | yearly tick | path d | `M4 12l5 5L20 6` | `"M4 12l5 5L20 6"` (`:188`) | match |
| Free-Trial-Paywall | yearly tick | stroke / width | `#131313` / `3.2` | `stroke="#131313" strokeWidth={3.2}` (`:188`) | match |
| Free-Trial-Paywall | yearly tick | linecap / linejoin | `round` / `round` | `strokeLinecap="round" strokeLinejoin="round"` (`:188`) | match |
| Free-Trial-Paywall | yearly tick | fill | `none` | `fill="none"` (`:187`) | match |
| Free-Trial-Paywall | yearly body | flex | `1` | `flex: 1` (`:194`) | match |
| Free-Trial-Paywall | yearly name row | display / align-items / gap | `flex` / `center` / `8px` | `flexDirection:'row', alignItems:'center', gap: 8` (`:195`) | match |
| Free-Trial-Paywall | "Yearly" | font-size / weight | `15px` / `500` | `fontSize: 15`, `sans('500')` (`:196`) | match |
| Free-Trial-Paywall | "Yearly" | colour | `#F5F4F1` | `active ? '#F5F4F1'` (`:196`) | match |
| Free-Trial-Paywall | "Yearly" | text | `Yearly` | `name="Yearly"` (`:257`) | match |
| Free-Trial-Paywall | "Best value" badge | font-size / weight | `12.5px` / `500` | `fontSize: 12.5`, `sans('500')` (`:201`) | match |
| Free-Trial-Paywall | "Best value" badge | colour | `#F5F4F1` | `active ? '#F5F4F1'` (`:201`) | match |
| Free-Trial-Paywall | "Best value" badge | border | `1px solid rgba(245,244,241,0.4)` | `borderWidth: 1, borderColor: 'rgba(245,244,241,0.4)'` on ink (`:200`) | match |
| Free-Trial-Paywall | "Best value" badge | border-radius | `9px` | `borderRadius: 9` (`:200`) | match |
| Free-Trial-Paywall | "Best value" badge | padding | `3px 8px` | `paddingHorizontal: 8, paddingVertical: 3` (`:200`) | match |
| Free-Trial-Paywall | "Best value" badge | white-space | `nowrap` | RN default `0` flex-shrink keeps the box intact (`:200`) | match (equivalent) |
| Free-Trial-Paywall | "Best value" badge | flex-shrink | `0` | RN default `0` | match |
| Free-Trial-Paywall | "Best value" badge | text | `Best value` | `badge="Best value"` (`:257`) | match |
| Free-Trial-Paywall | "Best value" badge | off-ink state | never drawn by the canvas | `borderColor 'rgba(0,0,0,0.18)'`, `color '#1D1C1A'` (`:200–201`) | app-only state (canvas silent) |
| Free-Trial-Paywall | yearly sub | margin-top | `3px` | `marginTop: 3` (`:205`) | match |
| Free-Trial-Paywall | yearly sub | font-size | `13px` | `fontSize: 13` (`:205`) | match |
| Free-Trial-Paywall | yearly sub | font-weight | not stated (400) | `sans('400')` (`:205`) | match |
| Free-Trial-Paywall | yearly sub | colour | `rgba(245,244,241,0.62)` | `active ? 'rgba(245,244,241,0.62)'` (`:205`) | match |
| Free-Trial-Paywall | yearly sub | text | `$3.33 a month` | `sub="$3.33 a month"` (`:257`) | match |
| Free-Trial-Paywall | yearly price col | text-align | `right` | `alignItems: 'flex-end'` (`:207`) | match (equivalent) |
| Free-Trial-Paywall | yearly price | font-size / weight | `16px` / `500` | `fontSize: 16`, `sans('500')` (`:208`) | match |
| Free-Trial-Paywall | yearly price | colour | `#F5F4F1` | `active ? '#F5F4F1'` (`:208`) | match |
| Free-Trial-Paywall | yearly price | text | `$39.99` | `price="$39.99"` (`:257`) | match |
| Free-Trial-Paywall | yearly cycle | font-size | `12px` | `fontSize: 12` (`:209`) | match |
| Free-Trial-Paywall | yearly cycle | font-weight | not stated (400) | `sans('400')` (`:209`) | match |
| Free-Trial-Paywall | yearly cycle | colour | `rgba(245,244,241,0.45)` | `active ? 'rgba(245,244,241,0.45)'` (`:209`) | match |
| Free-Trial-Paywall | yearly cycle | text | `/year` | `cycle="/year"` (`:257`) | match |

### Plan row — Monthly (unselected / paper state)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Free-Trial-Paywall | monthly row | left / right | `16px` / `16px` | `left: 16, right: 16` (`:173–174`) | match |
| Free-Trial-Paywall | monthly row | top | canvas `418` / app `364` | `top={364}` (`:258`) | match |
| Free-Trial-Paywall | monthly row | height / border-radius | `76px` / `18px` | `height: 76, borderRadius: 18` (`:176–177`) | match |
| Free-Trial-Paywall | monthly row | background | `#FFFFFF` | `: '#FFFFFF'` (`:182`) | match |
| Free-Trial-Paywall | monthly row | box-shadow | `0 0 0 1px rgba(0,0,0,0.08)` | `'0 0 0 1px rgba(0,0,0,0.08)'` (`:183`) | match |
| Free-Trial-Paywall | monthly row | gap / padding | `14px` / `0 18px` | `gap: 14, paddingHorizontal: 18` (`:180–181`) | match |
| Free-Trial-Paywall | monthly row | z-index | `4` | paint order | match |
| Free-Trial-Paywall | monthly radio | width / height | `23px` / `23px` | `width: 23, height: 23` (`:192`) | match |
| Free-Trial-Paywall | monthly radio | border-radius | `50%` | `borderRadius: 11.5` (`:192`) | match |
| Free-Trial-Paywall | monthly radio | border | `2px solid rgba(0,0,0,0.18)` | `borderWidth: 2, borderColor: 'rgba(0,0,0,0.18)'` (`:192`) | match |
| Free-Trial-Paywall | monthly radio | box-sizing | `border-box` | RN default | match |
| Free-Trial-Paywall | monthly radio | flex-shrink | `0` | RN default `0` | match |
| Free-Trial-Paywall | monthly radio | fill | none (empty ring) | no children (`:192`) | match |
| Free-Trial-Paywall | "Monthly" | font-size / weight | `15px` / `500` | `fontSize: 15`, `sans('500')` (`:196`) | match |
| Free-Trial-Paywall | "Monthly" | colour | `#1D1C1A` | `: '#1D1C1A'` (`:196`) | match |
| Free-Trial-Paywall | monthly badge | presence | none | `badge` omitted (`:258`) | match |
| Free-Trial-Paywall | monthly sub | margin-top / font-size | `3px` / `13px` | `marginTop: 3, fontSize: 13` (`:205`) | match |
| Free-Trial-Paywall | monthly sub | colour | `#8B8882` | `: '#8B8882'` (`:205`) | match |
| Free-Trial-Paywall | monthly sub | text | `Cancel anytime` | `sub="Cancel anytime"` (`:258`) | match |
| Free-Trial-Paywall | monthly price | font-size / weight / colour | `16px` / `500` / `#1D1C1A` | `fontSize: 16`, `sans('500')`, `'#1D1C1A'` (`:208`) | match |
| Free-Trial-Paywall | monthly price | text | `$12.99` | `price="$12.99"` (`:258`) | match |
| Free-Trial-Paywall | monthly cycle | font-size / colour | `12px` / `#8B8882` | `fontSize: 12`, `'#8B8882'` (`:209`) | match |
| Free-Trial-Paywall | monthly cycle | text | `/month` | `cycle="/month"` (`:258`) | match |

### Benefits block

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Free-Trial-Paywall | "Everything, unlocked" | left | `18px` | `left: 18` (`:260`) | match |
| Free-Trial-Paywall | "Everything, unlocked" | top | canvas `530` / app `476` | `top: 476` (`:260`) | match |
| Free-Trial-Paywall | "Everything, unlocked" | font-size | `12.5px` | `fontSize: 12.5` (`:260`) | match |
| Free-Trial-Paywall | "Everything, unlocked" | font-weight | `600` | `sans('600')` (`:260`) | match |
| Free-Trial-Paywall | "Everything, unlocked" | colour | `#8B8882` | `color: '#8B8882'` (`:260`) | match |
| Free-Trial-Paywall | "Everything, unlocked" | letter-spacing / text-transform | not stated / none | dropped by `AppText`; literal sentence case | match |
| Free-Trial-Paywall | benefit 1 | left / top | `18px` / canvas `560` / app `506` | `left={18} top={506}` (`:261`) | match |
| Free-Trial-Paywall | benefit 2 | left / top | `208px` / canvas `560` / app `506` | `left={208} top={506}` (`:262`) | match |
| Free-Trial-Paywall | benefit 3 | left / top | `18px` / canvas `610` / app `556` | `left={18} top={556}` (`:263`) | match |
| Free-Trial-Paywall | benefit 4 | left / top | `208px` / canvas `610` / app `556` | `left={208} top={556}` (`:264`) | match |
| Free-Trial-Paywall | benefit box | width | `165px` | `width: 165` (`:226`) | match |
| Free-Trial-Paywall | benefit box | display / gap / align-items | `flex` / `9px` / `flex-start` | `flexDirection:'row', gap: 9, alignItems:'flex-start'` (`:226`) | match |
| Free-Trial-Paywall | benefit tick | width / height / viewBox | `13` / `13` / `0 0 24 24` | `width={13} height={13} viewBox="0 0 24 24"` (`:227`) | match |
| Free-Trial-Paywall | benefit tick | margin-top | `2.5px` | `marginTop: 2.5` (`:227`) | match |
| Free-Trial-Paywall | benefit tick | flex-shrink | `0` | RN default `0` | match |
| Free-Trial-Paywall | benefit tick | path d | `M4 12.5l4.8 4.8L20 6.5` | `"M4 12.5l4.8 4.8L20 6.5"` (`:228`) | match |
| Free-Trial-Paywall | benefit tick | stroke / width / caps | `#1D1C1A` / `3` / `round`+`round` | `stroke="#1D1C1A" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"` (`:228`) | match |
| Free-Trial-Paywall | benefit tick | fill | `none` | `fill="none"` (`:227`) | match |
| Free-Trial-Paywall | benefit text | font-size | `13.5px` | `fontSize: 13.5` (`:230`) | match |
| Free-Trial-Paywall | benefit text | line-height | `18px` | `lineHeight: 18` (`:230`) | match |
| Free-Trial-Paywall | benefit text | font-weight | not stated (400) | `sans('400')` (`:230`) | match |
| Free-Trial-Paywall | benefit text | colour | `#55534E` | `color: '#55534E'` (`:230`) | match |
| Free-Trial-Paywall | benefit text | flex | not stated | `flex: 1` (`:230`) | match (same 143 wrap width) |
| Free-Trial-Paywall | benefit 1 text | content | `Progress that never resets` | `PW_BENEFITS[0]` (`:218`) | match |
| Free-Trial-Paywall | benefit 2 text | content | `Full curriculum, every week` | `PW_BENEFITS[1]` (`:219`) | match |
| Free-Trial-Paywall | benefit 3 text | content | `Unlimited urge support` | `PW_BENEFITS[2]` (`:220`) | match |
| Free-Trial-Paywall | benefit 4 text | content | `Insights &amp; weekly reports` → `Insights & weekly reports` | `'Insights & weekly reports'` (`:221`) | match |

### CTA + footer

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Free-Trial-Paywall | CTA | left / right | `16px` / `16px` | `left: 16, right: 16` (`:266`) | match |
| Free-Trial-Paywall | CTA | top | canvas `684` / app `630` | `top: 630` (`:266`) | match |
| Free-Trial-Paywall | CTA | height | `52px` | `height={52}` (`:267`) | match |
| Free-Trial-Paywall | CTA | border-radius | `26px` | `radius={26}` (`:267`) | match |
| Free-Trial-Paywall | CTA | background | `#131313` | `backgroundColor: '#131313'` (`:73`) | match |
| Free-Trial-Paywall | CTA | align / justify | `center` / `center` | `alignItems:'center', justifyContent:'center'` (`:73`) | match |
| Free-Trial-Paywall | CTA label | font-size | `16.5px` | `size={16.5}` (`:267`, `:74`) | match |
| Free-Trial-Paywall | CTA label | font-weight | `600` | `sans('600')` (`:74`) | match |
| Free-Trial-Paywall | CTA label | letter-spacing | not stated | `tracking` undefined → `AppText` drops the inherited tracking (`:68`, `AppText.tsx:129`) | match |
| Free-Trial-Paywall | CTA label | colour | `#FFFFFF` | `color: '#FFFFFF'` (`:74`) | match |
| Free-Trial-Paywall | CTA label | text | `Continue &mdash; $39.99/year` (U+2014) | `'Continue — $39.99/year'` (U+2014, `:267`) | match |
| Free-Trial-Paywall | CTA label | monthly state | never drawn by the canvas | `'Continue — $12.99/month'` (`:267`) | app-only state (canvas silent) |
| Free-Trial-Paywall | footer | left / right | `0` / `0` | `left: 0, right: 0` (`:269`) | match |
| Free-Trial-Paywall | footer | top | canvas `756` / app `702` | `top: 702` (`:269`) | match |
| Free-Trial-Paywall | footer | text-align | `center` | `center` prop (`:269`) | match |
| Free-Trial-Paywall | footer | font-size | `13px` | `fontSize: 13` (`:269`) | match |
| Free-Trial-Paywall | footer | font-weight | not stated (400) | `sans('400')` (`:269`) | match |
| Free-Trial-Paywall | footer | colour | `#8B8882` | `color: '#8B8882'` (`:269`) | match |
| Free-Trial-Paywall | footer | text | `Terms &nbsp;·&nbsp; Restore` (space+NBSP+U+00B7+NBSP+space) | `'Terms  ·  Restore'` — identical byte sequence (`:270`) | match |

---

## Frame 2 — Paywall-Rescue

App: `src/components/paywall/PaywallFlow.tsx` → `PwTrialOffer` (`:309–347`), reached from `decline()` (`:493–500`)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Paywall-Rescue | frame | width / height | `393px` / `852px` | device size (`:515`) | match (canvas reference) |
| Paywall-Rescue | frame | background | `#F4F3F0` | `backgroundColor: '#F4F3F0'` (`:515`) | match |
| Paywall-Rescue | frame | overflow | `hidden` | screen root | match |
| Paywall-Rescue | frame | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | `sans()` stack (`theme.ts:159–186`) | match on iOS; web fallback chain differs |
| Paywall-Rescue | frame | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | n/a (canvas bezel) |
| Paywall-Rescue | header band | presence | absent (no band on this frame) | `offer` branch skips the band (`:516–531`) | match |
| Paywall-Rescue | noise | inset | `0` | `top:0,left:0,right:0,bottom:0` (`:518`) | match |
| Paywall-Rescue | noise | image | `url('noise-dark.png')` | `require('assets/images/noise-dark.png')` (`:25`) | match (same asset) |
| Paywall-Rescue | noise | repeat / fit | CSS default `repeat` — the 96×96 tile repeats across 393×852 | `contentFit="cover"` — one 96×96 tile upscaled ≈4.1× wide / 8.9× tall (`:518`) | **MISMATCH** |
| Paywall-Rescue | noise | opacity | `0.07` | `opacity: 0.07` (`:518`) | match |
| Paywall-Rescue | noise | pointer-events | `none` | `pointerEvents="none"` (`:518`) | match |
| Paywall-Rescue | floor glow | left | `50%` | `left: '50%'` (`:128`) | match |
| Paywall-Rescue | floor glow | bottom | `-300px` | `bottom: -300` (`:128`) | match |
| Paywall-Rescue | floor glow | width / height | `560px` / `560px` | `width: 560, height: 560` (`:128`) | match |
| Paywall-Rescue | floor glow | margin-left | `-280px` | `marginLeft: -280` (`:128`) | match |
| Paywall-Rescue | floor glow | border-radius | `50%` | `<Circle cx={280} cy={280} r={280}>` (`:140`) | match |
| Paywall-Rescue | floor glow | gradient type | `radial-gradient(closest-side, …)` | `RadialGradient cx="50%" cy="50%" r="50%"` (`:133`) | match |
| Paywall-Rescue | floor glow | stop 1 | `rgba(255,236,196,0.3)` at 0 | `#FFECC4` `stopOpacity={0.3}` at `0` (`:134`, `:519`) | match |
| Paywall-Rescue | floor glow | stop 2 | `rgba(255,236,196,0.13)` at `45%` | `#FFECC4` `stopOpacity={0.13}` at `0.45` (`:135`, `:519`) | match |
| Paywall-Rescue | floor glow | stop 3 | `rgba(255,236,196,0)` at `72%` | `#FFECC4` `stopOpacity={0}` at `0.72` (`:136`) | match |
| Paywall-Rescue | floor glow | stop 4 | not stated (CSS holds) | `stopOpacity={0}` at `1` (`:137`) | match (explicit tail) |
| Paywall-Rescue | floor glow | pointer-events | `none` | `pointerEvents="none"` (`:128`) | match |
| Paywall-Rescue | floor glow | z-order | after the noise, before content | rendered after the noise `Image` (`:518–519`) | match |
| Paywall-Rescue | status bar | height / contents | `54px` mock | not built; `<StatusBar style="dark" />` (`paywall.tsx:13`) | n/a by design |
| Paywall-Rescue | close disc | left | `20px` | `left: 20` (`:312`) | match |
| Paywall-Rescue | close disc | top | canvas `66` / app `12` | `top: 12` (`:312`) | match |
| Paywall-Rescue | close disc | width / height | `34px` / `34px` | `width: 34, height: 34` (`:57`) | match |
| Paywall-Rescue | close disc | border-radius | `50%` | `borderRadius: 17` (`:57`) | match |
| Paywall-Rescue | close disc | background | `rgba(0,0,0,0.06)` | `fill="rgba(0,0,0,0.06)"` (`:313`) | match (note: 103 uses `rgba(19,19,19,0.06)`; both are honoured separately) |
| Paywall-Rescue | close disc | box-shadow | `0 0 0 1px rgba(0,0,0,0.10)` | `ring="rgba(0,0,0,0.10)"` (`:313`) | match |
| Paywall-Rescue | close disc | align / justify | `center` / `center` | `alignItems:'center', justifyContent:'center'` (`:57`) | match |
| Paywall-Rescue | close disc | z-index | not stated | paint order (first child) | match |
| Paywall-Rescue | close glyph | width / height / viewBox | `15` / `15` / `0 0 20 20` | same (`:58`) | match |
| Paywall-Rescue | close glyph | path d | `M3 3l14 14M17 3L3 17` | same (`:59`) | match |
| Paywall-Rescue | close glyph | stroke / width / cap | `#1D1C1A` / `2.4` / `round` | same (`:59`) | match |
| Paywall-Rescue | headline | left / right | `24px` / `60px` | `left: 24, right: 60` (`:315`) | match |
| Paywall-Rescue | headline | top | canvas `158` / app `104` | `top: 104` (`:315`) | match |
| Paywall-Rescue | headline | font-size | `28px` | `fontSize: 28` (`:315`) | match |
| Paywall-Rescue | headline | font-weight | `500` | `sans('500')` (`:315`) | match |
| Paywall-Rescue | headline | letter-spacing | `-0.2px` | `letterSpacing: -0.2` (`:315`) | match |
| Paywall-Rescue | headline | line-height | `36px` | `lineHeight: 36` (`:315`) | match |
| Paywall-Rescue | headline | colour | `#1D1C1A` | `color: '#1D1C1A'` (`:315`) | match |
| Paywall-Rescue | headline | text-wrap | `balance` | `textWrap:'pretty'` (variant `body`, `AppText.tsx:119`) | **MISMATCH** (web only) |
| Paywall-Rescue | headline | text | `Before you go &mdash; three days on us.` (U+2014) | `Before you go — three days on us.` (U+2014, `:316`) | match |
| Paywall-Rescue | thread | left | `45px` | `left: 45` (`:320`) | match |
| Paywall-Rescue | thread | top | canvas `344` / app `290` | `top: 290` (`:320`) | match |
| Paywall-Rescue | thread | width / height | `2px` / `192px` | `width: 2, height: 192` (`:320`) | match |
| Paywall-Rescue | thread | background | `rgba(0,0,0,0.12)` | `backgroundColor: 'rgba(0,0,0,0.12)'` (`:320`) | match |
| Paywall-Rescue | thread | z-order | before the three rows | rendered before the `PW_OFFER` map (`:320–321`) | match |
| Paywall-Rescue | offer row 1 | left / right | `24px` / `24px` | `left: 24, right: 24` (`:322`) | match |
| Paywall-Rescue | offer row 1 | top | canvas `300` / app `246` | `246` (`:304`) | match |
| Paywall-Rescue | offer row 2 | top | canvas `396` / app `342` | `342` (`:305`) | match |
| Paywall-Rescue | offer row 3 | top | canvas `492` / app `438` | `438` (`:306`) | match |
| Paywall-Rescue | offer rows | display / align-items | `flex` / `center` | `flexDirection:'row', alignItems:'center'` (`:322`) | match |
| Paywall-Rescue | offer rows | gap | `16px` | `gap: 16` (`:322`) | match |
| Paywall-Rescue | offer disc | width / height | `44px` / `44px` | `width: 44, height: 44` (`:325–326`) | match |
| Paywall-Rescue | offer disc | border-radius | `50%` | `borderRadius: 22` (`:327`) | match |
| Paywall-Rescue | offer disc | flex-shrink | `0` | RN default `0` | match |
| Paywall-Rescue | offer disc 1 | background | `#131313` | `i === 0 ? '#131313'` (`:328`) | match |
| Paywall-Rescue | offer disc 1 | box-shadow | none | `i === 0 ? undefined` (`:329`) | match |
| Paywall-Rescue | offer disc 2/3 | background | `#FFFFFF` | `: '#FFFFFF'` (`:328`) | match |
| Paywall-Rescue | offer disc 2/3 | box-shadow | `0 0 0 1px rgba(0,0,0,0.12)` | `'0 0 0 1px rgba(0,0,0,0.12)'` (`:329`) | match |
| Paywall-Rescue | offer disc | align / justify | `center` / `center` | `alignItems:'center', justifyContent:'center'` (`:330–331`) | match |
| Paywall-Rescue | icon (today) | width / height / viewBox | `21` / `21` / `0 0 24 24` | same (`:280`) | match |
| Paywall-Rescue | icon (today) | fill | `none` | `fill="none"` (`:280`) | match |
| Paywall-Rescue | icon (today) | stroke | `#F4F3F0` | `c = '#F4F3F0'` for `i === 0` (`:333`) | match |
| Paywall-Rescue | icon (today) | stroke-width | `1.8` | `strokeWidth={1.8}` (`:281–283`) | match |
| Paywall-Rescue | icon (today) | linecap / linejoin | `round` / `round` | round on both drawn segments; the `Rect` carries `strokeLinejoin` only (caps are moot on a closed shape) (`:281–283`) | match |
| Paywall-Rescue | icon (today) | shackle d | `M7.5 10.5V7a4.5 4.5 0 0 1 8.6-1.8` | `"M7.5 10.5V7a4.5 4.5 0 0 1 8.6-1.8"` (`:281`) | match |
| Paywall-Rescue | icon (today) | body rect | `x=4.4 y=10 w=15.2 h=10.5 rx=2.6` | `x={4.4} y={10} width={15.2} height={10.5} rx={2.6}` (`:282`) | match |
| Paywall-Rescue | icon (today) | keyhole d | `M12 14v2.6` | `"M12 14v2.6"` (`:283`) | match |
| Paywall-Rescue | icon (day2) | bell d | `M12 3.4a5.8 5.8 0 0 1 5.8 5.8v3.6l1.7 2.4a1 1 0 0 1-.8 1.6H5.3a1 1 0 0 1-.8-1.6l1.7-2.4V9.2A5.8 5.8 0 0 1 12 3.4z` | identical string (`:289`) | match |
| Paywall-Rescue | icon (day2) | clapper d | `M10 19.6a2.2 2.2 0 0 0 4 0` | `"M10 19.6a2.2 2.2 0 0 0 4 0"` (`:290`) | match |
| Paywall-Rescue | icon (day2) | stroke / width / caps | `#1D1C1A` / `1.8` / `round`+`round` | `c = '#1D1C1A'`, `strokeWidth={1.8}`, round/round (`:289–290`, `:333`) | match |
| Paywall-Rescue | icon (day3) | card rect | `x=3.5 y=5.5 w=17 h=13.5 rx=2.6` | `x={3.5} y={5.5} width={17} height={13.5} rx={2.6}` (`:295`) | match |
| Paywall-Rescue | icon (day3) | stripe d | `M3.5 9.5h17` | `"M3.5 9.5h17"` (`:296`) | match |
| Paywall-Rescue | icon (day3) | number d | `M7 15h4` | `"M7 15h4"` (`:297`) | match |
| Paywall-Rescue | icon (day3) | stroke / width | `#1D1C1A` / `1.8` | same (`:295–297`, `:333`) | match |
| Paywall-Rescue | offer label | font-size | `15px` | `fontSize: 15` (`:335`) | match |
| Paywall-Rescue | offer label | font-weight | `500` | `sans('500')` (`:335`) | match |
| Paywall-Rescue | offer label | line-height | `21px` | `lineHeight: 21` (`:335`) | match |
| Paywall-Rescue | offer label | colour | `#1D1C1A` | `color: '#1D1C1A'` (`:335`) | match |
| Paywall-Rescue | offer label | text-wrap | `pretty` | `textWrap:'pretty'` on web (`AppText.tsx:119`) | match |
| Paywall-Rescue | offer label | flex | not stated | `flex: 1` (`:335`) | match (same wrap box) |
| Paywall-Rescue | offer label 1 | text | `Today &mdash; everything unlocks` | `'Today — everything unlocks'` (U+2014, `:304`) | match |
| Paywall-Rescue | offer label 2 | text | `Day 2 &mdash; a reminder, before any charge` | `'Day 2 — a reminder, before any charge'` (`:305`) | match |
| Paywall-Rescue | offer label 3 | text | `Day 3 &mdash; $39.99/year begins, unless you cancel` | `'Day 3 — $39.99/year begins, unless you cancel'` (`:306`) | match |
| Paywall-Rescue | CTA | left / right | `24px` / `24px` | `left: 24, right: 24` (`:339`) | match |
| Paywall-Rescue | CTA | bottom | `96px` | `bottom: 96` (`:339`) | match |
| Paywall-Rescue | CTA | height | `58px` | `height={58}` (`:340`) | match |
| Paywall-Rescue | CTA | border-radius | `29px` | `radius={29}` (`:340`) | match |
| Paywall-Rescue | CTA | background | `#131313` | `backgroundColor: '#131313'` (`:73`) | match |
| Paywall-Rescue | CTA | align / justify | `center` / `center` | same (`:73`) | match |
| Paywall-Rescue | CTA label | font-size | `17px` | `size={17}` (`:340`) | match |
| Paywall-Rescue | CTA label | font-weight | `600` | `sans('600')` (`:74`) | match |
| Paywall-Rescue | CTA label | letter-spacing | `0.2px` | `tracking={0.2}` (`:340`) | match |
| Paywall-Rescue | CTA label | colour | `#FFFFFF` | `color: '#FFFFFF'` (`:74`) | match |
| Paywall-Rescue | CTA label | text | `Start my 3 free days` | `"Start my 3 free days"` (`:340`) | match |
| Paywall-Rescue | "No thanks" | left / right | `0` / `0` | `left: 0, right: 0` (`:342`) | match |
| Paywall-Rescue | "No thanks" | bottom | `56px` | `bottom: 56` (`:342`) | match |
| Paywall-Rescue | "No thanks" | text-align | `center` | `alignItems: 'center'` (`:342`) | match |
| Paywall-Rescue | "No thanks" | font-size | `13.5px` | `fontSize: 13.5` (`:343`) | match |
| Paywall-Rescue | "No thanks" | font-weight | `500` | `sans('500')` (`:343`) | match |
| Paywall-Rescue | "No thanks" | colour | `#8B8882` | `color: '#8B8882'` (`:343`) | match |
| Paywall-Rescue | "No thanks" | min-height | not stated (line box) | `minHeight: 0` overrides `PressScale`'s 44 (`:342`) | match |
| Paywall-Rescue | "No thanks" | cursor | `pointer` | `PressScale` press target (`:342`) | match |
| Paywall-Rescue | "No thanks" | text | `No thanks` | `No thanks` (`:343`) | match |

---

## Frame 3 — Paywall-Confirmed

App: `src/components/paywall/PaywallFlow.tsx` → `PwConfirmed` (`:412–453`)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Paywall-Confirmed | frame | width / height | `393px` / `852px` | device size (`:425`) | match (canvas reference) |
| Paywall-Confirmed | frame | background | `#F4F3F0` | `backgroundColor: '#F4F3F0'` (`:425`) | match |
| Paywall-Confirmed | frame | overflow | `hidden` | screen root | match |
| Paywall-Confirmed | frame | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | `sans()` stack | match on iOS; web fallback chain differs |
| Paywall-Confirmed | frame | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | n/a (canvas bezel) |
| Paywall-Confirmed | noise | inset / opacity / pointer-events | `0` / `0.07` / `none` | `top/left/right/bottom: 0`, `opacity: 0.07`, `pointerEvents="none"` (`:426`) | match |
| Paywall-Confirmed | noise | repeat / fit | CSS `repeat` (96×96 tile) | `contentFit="cover"` (single tile upscaled) (`:426`) | **MISMATCH** |
| Paywall-Confirmed | floor glow | left / bottom / margin-left | `50%` / `-300px` / `-280px` | `left:'50%', bottom:-300, marginLeft:-280` (`:128`) | match |
| Paywall-Confirmed | floor glow | width / height | `560px` / `560px` | `560` / `560` (`:128`) | match |
| Paywall-Confirmed | floor glow | border-radius | `50%` | `<Circle r={280}>` (`:140`) | match |
| Paywall-Confirmed | floor glow | stop 1 | `rgba(255,236,196,0.44)` at 0 | `peak={0.44}` (`:427`, `:134`) | match |
| Paywall-Confirmed | floor glow | stop 2 | `rgba(255,236,196,0.2)` at `45%` | `mid={0.2}` at `0.45` (`:427`, `:135`) | match |
| Paywall-Confirmed | floor glow | stop 3 | `rgba(255,236,196,0)` at `72%` | `stopOpacity={0}` at `0.72` (`:136`) | match |
| Paywall-Confirmed | floor glow | pointer-events | `none` | `pointerEvents="none"` (`:128`) | match |
| Paywall-Confirmed | status bar | height / contents | `54px` mock | not built | n/a by design |
| Paywall-Confirmed | check disc wrapper | left / right | `0` / `0` | `left: 0, right: 0` (`:430`) | match |
| Paywall-Confirmed | check disc wrapper | top | canvas `296` / app `242` | `top: 242` (`:430`) | match |
| Paywall-Confirmed | check disc wrapper | justify-content | `center` | `alignItems: 'center'` on a column (`:430`) | match (equivalent) |
| Paywall-Confirmed | check disc | width / height | `84px` / `84px` | `width: 84, height: 84` (`:431`) | match |
| Paywall-Confirmed | check disc | border-radius | `50%` | `borderRadius: 42` (`:431`) | match |
| Paywall-Confirmed | check disc | background | `#131313` | `backgroundColor: '#131313'` (`:431`) | match |
| Paywall-Confirmed | check disc | align / justify | `center` / `center` | `alignItems:'center', justifyContent:'center'` (`:431`) | match |
| Paywall-Confirmed | check disc | box-shadow x/y/blur/spread | `0` / `14px` / `30px` / — | `'0 14px 30px …'` (`:431`) | match |
| Paywall-Confirmed | check disc | box-shadow colour/alpha | `rgba(40,38,32,0.3)` | `rgba(40,38,32,0.3)` (`:431`) | match |
| Paywall-Confirmed | check glyph | width / height / viewBox | `34` / `34` / `0 0 24 24` | `width={34} height={34} viewBox="0 0 24 24"` (`:432`) | match |
| Paywall-Confirmed | check glyph | fill | `none` | `fill="none"` (`:432`) | match |
| Paywall-Confirmed | check glyph | path d | `M4.5 12.5l4.8 4.8L19.5 6.8` | `"M4.5 12.5l4.8 4.8L19.5 6.8"` (`:433`) | match |
| Paywall-Confirmed | check glyph | stroke / width | `#F4F3F0` / `2.6` | `stroke="#F4F3F0" strokeWidth={2.6}` (`:433`) | match |
| Paywall-Confirmed | check glyph | linecap / linejoin | `round` / `round` | `strokeLinecap="round" strokeLinejoin="round"` (`:433`) | match |
| Paywall-Confirmed | title | left / right | `0` / `0` | `left: 0, right: 0` (`:437`) | match |
| Paywall-Confirmed | title | top | canvas `414` / app `360` | `top: 360` (`:437`) | match |
| Paywall-Confirmed | title | text-align | `center` | `center` prop (`:437`) | match |
| Paywall-Confirmed | title | font-size | `28px` | `fontSize: 28` (`:437`) | match |
| Paywall-Confirmed | title | font-weight | `500` | `sans('500')` (`:437`) | match |
| Paywall-Confirmed | title | letter-spacing | `-0.2px` | `letterSpacing: -0.2` (`:437`) | match |
| Paywall-Confirmed | title | line-height | not stated | dropped by `AppText` (`AppText.tsx:130`) | match |
| Paywall-Confirmed | title | colour | `#1D1C1A` | `color: '#1D1C1A'` (`:437`) | match |
| Paywall-Confirmed | title | text | `We're in, Sam.` (plain U+0027) | `` `We're in, ${name}.` `` (plain U+0027, `:438`); `name` = first word of `displayName` (`paywall.tsx:14`) | match |
| Paywall-Confirmed | title | no-name state | never drawn by the canvas | `We're in.` (`:438`) | app-only state (canvas silent) |
| Paywall-Confirmed | body | left / right | `56px` / `56px` | `left: 56, right: 56` (`:440`) | match |
| Paywall-Confirmed | body | top | canvas `466` / app `412` | `top: 412` (`:440`) | match |
| Paywall-Confirmed | body | text-align | `center` | `center` prop (`:440`) | match |
| Paywall-Confirmed | body | font-size | `14.5px` | `fontSize: 14.5` (`:440`) | match |
| Paywall-Confirmed | body | font-weight | `400` | `sans('400')` (`:440`) | match |
| Paywall-Confirmed | body | line-height | `22px` | `lineHeight: 22` (`:440`) | match |
| Paywall-Confirmed | body | colour | `#55534E` | `color: '#55534E'` (`:440`) | match |
| Paywall-Confirmed | body | text-wrap | `pretty` | `textWrap:'pretty'` on web (`AppText.tsx:119`) | match |
| Paywall-Confirmed | body | text | `Let's take the first ground. Nothing is charged until Jul 24 &mdash; cancelling is one tap in Settings.` | `` `Let's take the first ground. Nothing is charged until ${in3} — cancelling is one tap in Settings.` `` where `in3 = fmtShort(now+3d)` → `Jul 24` format (`:414`, `:420`, `:34`) | match |
| Paywall-Confirmed | body | non-trial states | never drawn by the canvas | month / year variants (`:421–423`) | app-only states (canvas silent) |
| Paywall-Confirmed | CTA | left / right / bottom | `24px` / `24px` / `96px` | `left: 24, right: 24, bottom: 96` (`:443`) | match |
| Paywall-Confirmed | CTA | height / border-radius | `58px` / `29px` | `height={58} radius={29}` (`:444`) | match |
| Paywall-Confirmed | CTA | background | `#131313` | `'#131313'` (`:73`) | match |
| Paywall-Confirmed | CTA | align / justify | `center` / `center` | same (`:73`) | match |
| Paywall-Confirmed | CTA label | font-size / weight | `17px` / `600` | `size={17}`, `sans('600')` (`:444`, `:74`) | match |
| Paywall-Confirmed | CTA label | letter-spacing | `0.2px` | `tracking={0.2}` (`:444`) | match |
| Paywall-Confirmed | CTA label | colour | `#FFFFFF` | `color: '#FFFFFF'` (`:74`) | match |
| Paywall-Confirmed | CTA label | text | `Begin Day I` | `confirmLabel` default `'Begin Day I'` (`:461`); `paywall.tsx:14` passes none | match |
| Paywall-Confirmed | receipt | left / right | `0` / `0` | `left: 0, right: 0` (`:446`) | match |
| Paywall-Confirmed | receipt | bottom | `60px` | `bottom: 60` (`:446`) | match |
| Paywall-Confirmed | receipt | text-align | `center` | `center` prop (`:446`) | match |
| Paywall-Confirmed | receipt | font-size | `12px` | `fontSize: 12` (`:446`) | match |
| Paywall-Confirmed | receipt | font-weight | `400` | `sans('400')` (`:446`) | match |
| Paywall-Confirmed | receipt | colour | `#8B8882` | `color: '#8B8882'` (`:446`) | match |
| Paywall-Confirmed | receipt | text | `Receipt sent to sam@hey.com` | `Receipt sent to {email}` from `useAuth()`, falling back to `'your Apple ID'` (`:447`, `:490`) | match (data-driven) |

---

## Frames 4–6 — the night header (byte-identical across all three score frames)

`sed -n '2,314p'` over `Score-Detail.html`, `Score-Detail-Moves.html` and
`Score-Detail-Ranks.html` yields the same MD5 (`8db7ee04…`). Audited once; every
row below applies verbatim to all three frames.
App: `src/app/score.tsx` → `NightHeader` (`:112–250`).

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Score ×3 | frame | width / height | `393px` / `852px` | device size (`:59`) | match (canvas reference) |
| Score ×3 | frame | background | `#0C0D10` | `backgroundColor: '#0C0D10'` (`:59`) | match |
| Score ×3 | frame | overflow | `hidden` | screen root | match |
| Score ×3 | frame | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | `sans()` stack | match on iOS; web fallback chain differs |
| Score ×3 | frame | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | n/a (canvas bezel) |
| Score ×3 | band | left / right / top | `0` / `0` / `0` | `left:0, right:0, top:0` (`:121`) | match |
| Score ×3 | band | height | `330px` | `H = y(330) = insets.top + 276` = 330 (`:116`, `:121`) | match |
| Score ×3 | band | overflow | `hidden` | `overflow: 'hidden'` (`:121`) | match |
| Score ×3 | band | gradient angle | `180deg` | `SvgLinearGradient x1="0" y1="0" x2="0" y2="1"` (`:124`) | match |
| Score ×3 | band | stop 1 | `#08090B 0%` | `#08090B` at `0` (`:125`) | match |
| Score ×3 | band | stop 2 | `#0E1014 55%` | `#0E1014` at `0.55` (`:126`) | match |
| Score ×3 | band | stop 3 | `#151920 100%` | `#151920` at `1` (`:127`) | match |
| Score ×3 | star 1 | left / top | `126px` / canvas `44` / app `-10` | `cx={127}` (126 + r), `cy={y(44) + 1}` (`:148`) | match |
| Score ×3 | star 1 | width / height | `2px` / `2px` | `r={1}` (`:148`) | match |
| Score ×3 | star 1 | border-radius | `50%` | `<Circle>` (`:148`) | match |
| Score ×3 | star 1 | colour / alpha | `rgba(244,243,240,0.45)` | `fill="#F4F3F0" fillOpacity={0.45}` (`:148`) | match |
| Score ×3 | star 2 | right / top | `62px` / canvas `38` / app `-16` | `cx={W - 63.25}` (62 + r), `cy={y(38) + 1.25}` (`:149`) | match |
| Score ×3 | star 2 | width / height | `2.5px` / `2.5px` | `r={1.25}` (`:149`) | match |
| Score ×3 | star 2 | colour / alpha | `rgba(244,243,240,0.35)` | `fill="#F4F3F0" fillOpacity={0.35}` (`:149`) | match |
| Score ×3 | star 3 | left / top | `58px` / canvas `128` / app `74` | `cx={59}`, `cy={y(128) + 1}` (`:150`) | match |
| Score ×3 | star 3 | width / height / alpha | `2px` / `2px` / `0.3` | `r={1}`, `fillOpacity={0.3}` (`:150`) | match |
| Score ×3 | moon halo | right / top | `22px` / canvas `80` / app `26` | `cx={W - 80}` (22 + 58), `cy={y(80) + 58}` (`:151`) | match |
| Score ×3 | moon halo | width / height | `116px` / `116px` | `r={58}` (`:151`) | match |
| Score ×3 | moon halo | border-radius | `50%` | `<Circle>` (`:151`) | match |
| Score ×3 | moon halo | gradient | `radial-gradient(closest-side, rgba(223,220,211,0.15), rgba(223,220,211,0) 72%)` | `RadialGradient` `#DFDCD3` `0.15` at `0` → `0` at `0.72` (`:130–133`) | match (`#DFDCD3` = `rgb(223,220,211)`) |
| Score ×3 | moon halo | filter | `blur(5px)` | none — RN SVG has no blur primitive (`:129` comment) | **MISMATCH** (deliberate substitution) |
| Score ×3 | moon | right / top | `54px` / canvas `110` / app `56` | `cx={W - 75}` (54 + 21), `cy={y(110) + 21}` (`:153`) | match |
| Score ×3 | moon | width / height | `42px` / `42px` | `r={21}` (`:153`) | match |
| Score ×3 | moon | border-radius | `50%` | `<Circle>` (`:153`) | match |
| Score ×3 | moon | gradient centre | `circle at 36% 30%` | `cx="36%" cy="30%"` (`:141`) | match |
| Score ×3 | moon | gradient extent | default `farthest-corner` = 39.836 in a 42 box | `rx="94.85%" ry="94.85%"` → 39.837 (`:141`) | match (computed value transcribed) |
| Score ×3 | moon | stop 1 | `#F5F3EC 0%` | `#F5F3EC` at `0` (`:142`) | match |
| Score ×3 | moon | stop 2 | `#D9D6CD 46%` | `#D9D6CD` at `0.46` (`:143`) | match |
| Score ×3 | moon | stop 3 | `#A5A197 100%` | `#A5A197` at `1` (`:144`) | match |
| Score ×3 | moon | box-shadow | `0 0 26px rgba(223,220,211,0.26)` | redrawn as `<Circle r={47}>` with `#DFDCD3` `0.26` at `0.45` → `0` at `1` (`:135–138`, `:152`) | **MISMATCH** (deliberate substitution) |
| Score ×3 | headland svg | viewBox | `0 0 393 80` | `viewBox="0 0 393 80"` (`:156`) | match |
| Score ×3 | headland svg | preserveAspectRatio | `none` | `preserveAspectRatio="none"` (`:156`) | match |
| Score ×3 | headland svg | left / right | `0` / `0` | `left: 0`, `width={W}` (`:156`) | match |
| Score ×3 | headland svg | top | canvas `160` / app `106` | `top: y(160)` = 106 (`:156`) | match |
| Score ×3 | headland svg | width / height | `100%` / `80px` | `width={W} height={80}` (`:156`) | match |
| Score ×3 | headland grad 1 | id / angle | `sdH1`, `x1=0 y1=0 x2=0 y2=1` | `sdH1${id}`, same coords (`:158`) | match |
| Score ×3 | headland grad 1 | stops | `#232830` at `0`, `#0A0B0D` at `1` | `#232830` at `0`, `#0A0B0D` at `1` (`:159–160`) | match |
| Score ×3 | headland grad 2 | stops | `#2A303B` at `0`, `#0C0D10` at `1` | `#2A303B` at `0`, `#0C0D10` at `1` (`:163–164`) | match |
| Score ×3 | headland path 1 | d | `M-4,80 L-4,52 Q60,24 132,50 Q170,64 200,72 L200,80 Z` | identical string (`:167`) | match |
| Score ×3 | headland path 1 | fill | `url(#sdH1)` | `url(#sdH1${id})` (`:167`) | match |
| Score ×3 | headland path 2 | d | `M180,80 L180,70 Q240,60 288,38 Q336,18 397,26 L397,80 Z` | identical string (`:168`) | match |
| Score ×3 | headland path 2 | fill | `url(#sdH2)` | `url(#sdH2${id})` (`:168`) | match |
| Score ×3 | waterline glow | left / right | `0` / `0` | `x={0}`, `width={W}` (`:187`) | match |
| Score ×3 | waterline glow | top | canvas `226` / app `172` | svg at `top: y(226)` = 172, rect `y={0}` (`:171`, `:187`) | match |
| Score ×3 | waterline glow | height | `16px` | `height={16}` (`:187`) | match |
| Score ×3 | waterline glow | gradient | `180deg`, `rgba(233,199,138,0) 0%` → `rgba(233,199,138,0.12) 100%` | `#E9C78A` `0` at `0` → `0.12` at `1`, vertical (`:173–176`) | match (`#E9C78A` = `rgb(233,199,138)`) |
| Score ×3 | waterline glow | filter | `blur(3px)` | none (`:181` comment covers the family) | **MISMATCH** (deliberate substitution) |
| Score ×3 | sea | left / right | `0` / `0` | `x={0}`, `width={W}` (`:188`) | match |
| Score ×3 | sea | top | canvas `238` / app `184` | svg origin 172 + `y={12}` = 184 (`:188`) | match |
| Score ×3 | sea | height | `92px` | `height={92}` (`:188`) | match |
| Score ×3 | sea | gradient | `180deg`, `#131720 0%` → `#0B0C0F 100%` | `#131720` at `0` → `#0B0C0F` at `1` (`:177–180`) | match |
| Score ×3 | reflection shaft | right / top | `56px` / canvas `240` / app `186` | ellipse `cx={W - 75}` (centre), `cy={43}` in a layer starting at 172 → 215 centre (`:196`) | match on centre-x; see height row |
| Score ×3 | reflection shaft | width | `38px` | `rx={19}` → 38 (`:196`) | match |
| Score ×3 | reflection shaft | height | `58px` (box 240→298) | `ry={31}` → 62 (box 184→246), grown for the missing blur (`:196`, `:189–195` comment) | **MISMATCH** (58 → 62) |
| Score ×3 | reflection shaft | shape | rectangle | ellipse (`:196`) | **MISMATCH** (deliberate substitution) |
| Score ×3 | reflection shaft | gradient type | `linear-gradient(180deg, …)` | `RadialGradient cx="50%" cy="0%" rx="50%" ry="100%"` (`:182`) | **MISMATCH** (deliberate substitution) |
| Score ×3 | reflection shaft | stops | `rgba(223,220,211,0.15)` → `rgba(223,220,211,0)` | `#DFDCD3` `0.15` at `0` → `0` at `1` (`:183–184`) | match |
| Score ×3 | reflection shaft | filter | `blur(5px)` | none | **MISMATCH** (folded into the ellipse substitution above) |
| Score ×3 | horizon tick | right | `62px` | `x={W - 88}` (right edge at W−62, width 26) (`:197`) | match |
| Score ×3 | horizon tick | top | canvas `248` / app `194` | svg origin 172 + `y={22}` = 194 (`:197`) | match |
| Score ×3 | horizon tick | width / height | `26px` / `1.5px` | `width={26} height={1.5}` (`:197`) | match |
| Score ×3 | horizon tick | background | `rgba(244,243,240,0.2)` | `fill="rgba(244,243,240,0.2)"` (`:197`) | match |
| Score ×3 | horizon tick | border-radius | `1px`, CSS-clamped to `0.75` on a 1.5 height | `rx={0.75}` (`:197`) | match (computed value transcribed) |
| Score ×3 | band noise | inset | `0` | `top/left/right/bottom: 0` inside the band (`:200`) | match |
| Score ×3 | band noise | opacity | `0.06` | `opacity: 0.06` (`:200`) | match |
| Score ×3 | band noise | pointer-events | `none` | `pointerEvents="none"` (`:200`) | match |
| Score ×3 | band noise | repeat / fit | CSS `repeat` (96×96 tile) | `contentFit="cover"` (single tile upscaled) (`:200`) | **MISMATCH** |
| Score ×3 | status bar | height / contents / colour | `54px`, 9:41 + glyphs in `#F4F3F0` | not built; `<StatusBar style="light" />` (`:60`) | n/a by design (light content matches `#F4F3F0`) |
| Score ×3 | back chevron | left | `16px` | `left: 16` (`:208`) | match |
| Score ×3 | back chevron | top | canvas `62` / app `8` | `top: y(62)` = 8 (`:208`) | match |
| Score ×3 | back chevron | width / height / viewBox | `10` / `17` / `0 0 10 17` | `width={10} height={17} viewBox="0 0 10 17"` (`:209`) | match |
| Score ×3 | back chevron | path d | `M8.5 1.5L2 8.5l6.5 7` | `"M8.5 1.5L2 8.5l6.5 7"` (`:210`) | match |
| Score ×3 | back chevron | fill / stroke | `none` / `#F4F3F0` | `fill="none"` / `stroke="#F4F3F0"` (`:209–210`) | match |
| Score ×3 | back chevron | stroke-width / linecap | `2.2` / `round` | `strokeWidth={2.2} strokeLinecap="round"` (`:210`) | match |
| Score ×3 | back chevron | z-index | `5` | painted after the band (`:203`) | match |
| Score ×3 | back chevron | min-height | not stated | `minHeight: 0` overriding `PressScale`'s 44 (`:208`) | match |
| Score ×3 | "Recovery score" | left / right | `0` / `0` | `left: 0, right: 0` (`:214`) | match |
| Score ×3 | "Recovery score" | top | canvas `96` / app `42` | `top: y(96)` = 42 (`:214`) | match |
| Score ×3 | "Recovery score" | text-align | `center` | `textAlign: 'center'` (`:214`) | match |
| Score ×3 | "Recovery score" | font-size | `13px` | `fontSize: 13` (`:214`) | match |
| Score ×3 | "Recovery score" | font-weight | `500` | `sans('500')` (`:214`) | match |
| Score ×3 | "Recovery score" | letter-spacing | `0.2px` | `letterSpacing: 0.2` (`:214`) | match |
| Score ×3 | "Recovery score" | colour | `rgba(244,243,240,0.55)` | `color: 'rgba(244,243,240,0.55)'` (`:214`) | match |
| Score ×3 | "Recovery score" | text-transform | none | literal sentence case (`:215`) | match |
| Score ×3 | "Recovery score" | z-index | `5` | paint order | match |
| Score ×3 | score number | left / right | `0` / `0` | `left: 0, right: 0` (`:220`) | match |
| Score ×3 | score number | top | canvas `118` / app `64` | `top: y(118)` = 64 (`:220`) | match |
| Score ×3 | score number | text-align | `center` | `textAlign: 'center'` (`:220`) | match |
| Score ×3 | score number | font-size | `58px` | `fontSize: 58` (`:220`) | match |
| Score ×3 | score number | font-weight | `500` | `sans('500')` (`:219`) | match |
| Score ×3 | score number | letter-spacing | `2px` | `letterSpacing: 2` (`:220`) | match |
| Score ×3 | score number | colour | `#FFFFFF` | `color: '#FFFFFF'` (`:220`) | match |
| Score ×3 | score number | line-height | not stated | dropped by `AppText` | match |
| Score ×3 | score number | text | `1,240` | `score.total.toLocaleString()` (`:222`) | match (data-driven, same grouping) |
| Score ×3 | rank row | left / right | `0` / `0` | `left: 0, right: 0` (`:225`) | match |
| Score ×3 | rank row | top | canvas `198` / app `144` | `top: y(198)` = 144 (`:225`) | match |
| Score ×3 | rank row | justify-content | `center` | `justifyContent: 'center'` (`:225`) | match |
| Score ×3 | rank row | align-items | `center` | `alignItems: 'center'` (`:225`) | match |
| Score ×3 | rank row | gap | `8px` | `gap: 8` (`:225`) | match |
| Score ×3 | rank row | z-index | `5` | paint order | match |
| Score ×3 | sail glyph | viewBox | `0 0 40 26` | `viewBox="0 0 40 26"` (`:226`) | match |
| Score ×3 | sail glyph | width | `15px` | `width={15}` (`:226`) | match |
| Score ×3 | sail glyph | height | auto (26/40 × 15 = `9.75`) | `height={9.75}` (`:226`) | match |
| Score ×3 | sail glyph | sail d | `M21 3 L21 16 L12 16 Z` | `"M21 3 L21 16 L12 16 Z"` (`:227`) | match |
| Score ×3 | sail glyph | hull d | `M7 18 L33 18 Q30 24 20 24 Q10 24 7 18 Z` | identical string (`:228`) | match |
| Score ×3 | sail glyph | fill | `rgba(244,243,240,0.75)` (both paths) | `fill="rgba(244,243,240,0.75)"` (both, `:227–228`) | match |
| Score ×3 | rank label | font-size | `13.5px` | `fontSize: 13.5` (`:230`) | match |
| Score ×3 | rank label | font-weight | `500` | `sans('500')` (`:230`) | match |
| Score ×3 | rank label | letter-spacing | `0.3px` | `letterSpacing: 0.3` (`:230`) | match |
| Score ×3 | rank label | colour | `rgba(244,243,240,0.85)` | `color: 'rgba(244,243,240,0.85)'` (`:230`) | match |
| Score ×3 | rank label | text | `Navigator &middot; II` (U+00B7) | `{score.rank.name} · {TIER[tier-1]}` → `Navigator · II` for 1,240 (`:231`, `score.ts:36–41`, `:31`) | match |
| Score ×3 | rung track | left / right | `32px` / `32px` | `left: 32, right: 32` (`:235`) | match |
| Score ×3 | rung track | top | canvas `250` / app `196` | `top: y(250)` = 196 (`:235`) | match |
| Score ×3 | rung track | height | `5px` | `height: 5` (`:235`) | match |
| Score ×3 | rung track | border-radius | `3px` | `borderRadius: 3` (`:235`) | match |
| Score ×3 | rung track | background | `rgba(244,243,240,0.14)` | `backgroundColor: 'rgba(244,243,240,0.14)'` (`:235`) | match |
| Score ×3 | rung track | overflow | not stated | `overflow: 'hidden'` (`:235`) | app-only (no visual difference at 60%) |
| Score ×3 | rung track | z-index | `5` | paint order | match |
| Score ×3 | rung fill | width | `60%` | `${score.progress * 100}%` → 60% at 1,240 between 1,150 and 1,300 (`:236`, `score.ts:53`) | match |
| Score ×3 | rung fill | height | `100%` | `height: 5` (`:236`) | match |
| Score ×3 | rung fill | border-radius | `3px` | `borderRadius: 3` (`:236`) | match |
| Score ×3 | rung fill | background | `rgba(244,243,240,0.92)` | `backgroundColor: 'rgba(244,243,240,0.92)'` (`:236`) | match |
| Score ×3 | rung labels | left / right | `32px` / `32px` | `left: 32, right: 32` (`:238`) | match |
| Score ×3 | rung labels | top | canvas `268` / app `214` | `top: y(268)` = 214 (`:238`) | match |
| Score ×3 | rung labels | justify-content | `space-between` | `justifyContent: 'space-between'` (`:238`) | match |
| Score ×3 | rung labels | z-index | `5` | paint order | match |
| Score ×3 | rung label L | font-size / weight | `11.5px` / `500` | `fontSize: 11.5`, `sans('500')` (`:239`) | match |
| Score ×3 | rung label L | colour | `rgba(244,243,240,0.5)` | `color: 'rgba(244,243,240,0.5)'` (`:239`) | match |
| Score ×3 | rung label L | text | `Navigator &middot; 1,150` | `{score.rank.name} · {score.rank.at.toLocaleString()}` (`:240`) | match |
| Score ×3 | rung label R | font-size / weight / colour | `11.5px` / `500` / `rgba(244,243,240,0.5)` | same (`:243`) | match |
| Score ×3 | rung label R | text | `Helmsman &middot; 1,300` | `{score.next.name} · {score.next.at.toLocaleString()}` (`:244`) | match |
| Score ×3 | rung label R | top-rank state | never drawn by the canvas | omitted when `score.next` is undefined (`:242`) | app-only state (canvas silent) |
| Score ×3 | sheet | left / right | `0` / `0` | `left: 0, right: 0` (`:67–68`) | match |
| Score ×3 | sheet | top | canvas `302` / app `248` | `sheetTop = y(302)` = 248 (`:56`, `:69`) | match |
| Score ×3 | sheet | bottom | `0` | `bottom: 0` (`:70`) | match |
| Score ×3 | sheet | border-radius | `26px 26px 0 0` | `borderTopLeftRadius: 26, borderTopRightRadius: 26` (`:71–72`) | match |
| Score ×3 | sheet | background | `#F6F5F2` | `backgroundColor: '#F6F5F2'` (`:73`) | match |
| Score ×3 | sheet | overflow | `hidden` | `overflow: 'hidden'` (`:74`) | match |

---

## Frame 4 — Score-Detail (sheet page 1)

App: `src/app/score.tsx` → `OverTime` (`:263–389`). All tops are sheet-relative (no `−54`).

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Score-Detail | title | left / top | `20px` / `26px` | `left: 20, top: 26` (`:307`) | match |
| Score-Detail | title | font-size | `18px` | `fontSize: 18` (`:307`) | match |
| Score-Detail | title | font-weight | `600` | `sans('600')` (`:307`) | match |
| Score-Detail | title | letter-spacing | `-0.2px` | `letterSpacing: -0.2` (`:307`) | match |
| Score-Detail | title | colour | `#1D1C1A` | `color: '#1D1C1A'` (`:307`) | match |
| Score-Detail | title | text | `Score over time` | `Score over time` (`:307`) | match |
| Score-Detail | range group | right / top | `16px` / `22px` | `right: 16, top: 22` (`:309`) | match |
| Score-Detail | range group | display / gap | `flex` / `6px` | `flexDirection:'row', gap: 6` (`:309`) | match |
| Score-Detail | "3M" pill | height | `30px` | `height: 30` (`:319`) | match |
| Score-Detail | "3M" pill | border-radius | `15px` | `borderRadius: 15` (`:320`) | match |
| Score-Detail | "3M" pill | background | `#131313` | `range === r ? '#131313'` (`:321`) | match |
| Score-Detail | "3M" pill | align-items | `center` | `alignItems:'center', justifyContent:'center'` (`:322–323`) | match |
| Score-Detail | "3M" pill | padding | `0 14px` | `paddingHorizontal: 14` (`:324`) | match |
| Score-Detail | "3M" pill | min-height | not stated (30) | `minHeight: 0` overriding `PressScale`'s 44 (`:318`) | match |
| Score-Detail | "3M" label | font-size / weight | `12.5px` / `600` | `fontSize: 12.5`, `sans('600')` (`:326`) | match |
| Score-Detail | "3M" label | colour | `#FFFFFF` | `range === r ? '#FFFFFF'` (`:326`) | match |
| Score-Detail | "3M" label | text | `3M` | `'3M'` (`:310`) | match |
| Score-Detail | "1Y" pill | background | `rgba(19,19,19,0.06)` | `: 'rgba(19,19,19,0.06)'` (`:321`) | match |
| Score-Detail | "1Y" pill | height / radius / padding | `30px` / `15px` / `0 14px` | same as 3M (`:319–324`) | match |
| Score-Detail | "1Y" label | font-size / weight | `12.5px` / `600` | `fontSize: 12.5`, `sans('600')` (`:326`) | match |
| Score-Detail | "1Y" label | colour | `#8B8882` | `: '#8B8882'` (`:326`) | match |
| Score-Detail | "1Y" label | text | `1Y` | `'1Y'` (`:310`) | match |
| Score-Detail | value callout | left | `352px` | `endX = (352/393)·W` = 352 at W=393 (`:299`, `:367`) | match |
| Score-Detail | value callout | top | `132px` | `120 + endY − 40` = 132 when `endY = 52` (`:368`) | match (see chart-frame note) |
| Score-Detail | value callout | transform | `translateX(-50%)` | `transform: [{ translateX: '-50%' }]` (`:376`) | match |
| Score-Detail | value callout | height | `30px` | `height: 30` (`:369`) | match |
| Score-Detail | value callout | border-radius | `15px` | `borderRadius: 15` (`:370`) | match |
| Score-Detail | value callout | background | `#131313` | `backgroundColor: '#131313'` (`:371`) | match |
| Score-Detail | value callout | align / justify | `center` / `center` | `alignItems:'center', justifyContent:'center'` (`:372–373`) | match |
| Score-Detail | value callout | padding | `0 13px` | `paddingHorizontal: 13` (`:374`) | match |
| Score-Detail | value callout | shadow x/y/blur | `0` / `6px` / `14px` | `'0 6px 14px …'` (`:375`) | match |
| Score-Detail | value callout | shadow colour/alpha | `rgba(19,19,19,0.22)` | `rgba(19,19,19,0.22)` (`:375`) | match |
| Score-Detail | value callout | z-index | `6` (over the chart) | painted after the chart box (`:363` comment, `:364`) | match |
| Score-Detail | value callout | font-size / weight | `13px` / `600` | `fontSize: 13`, `sans('600')` (`:378`) | match |
| Score-Detail | value callout | colour | `#FFFFFF` | `color: '#FFFFFF'` (`:378`) | match |
| Score-Detail | value callout | text | `1,240` | `total.toLocaleString()` (`:378`) | match |
| Score-Detail | chart box | left / right / top | `0` / `0` / `120px` | `left: 0, right: 0, top: 120` (`:331`) | match |
| Score-Detail | chart box | height | `236px` | `height: 236` (`:331`) | match |
| Score-Detail | chart svg | viewBox | `0 0 393 236` | `viewBox="0 0 393 236"` (`:332`) | match |
| Score-Detail | chart svg | preserveAspectRatio | `none` | `preserveAspectRatio="none"` (`:332`) | match |
| Score-Detail | chart svg | inset / size | `inset:0`, `100%` × `100%` | `left:0, top:0`, `width={W} height={236}` (`:332`) | match |
| Score-Detail | area gradient | id / angle | `sdF2`, `x1=0 y1=0 x2=0 y2=1` | `sdF2${id}`, same coords (`:334`) | match |
| Score-Detail | area gradient | stop 1 | `rgba(19,19,19,0.11)` at `0%` | `#131313` `stopOpacity={0.11}` at `0%` (`:335`) | match |
| Score-Detail | area gradient | stop 2 | `rgba(19,19,19,0)` at `100%` | `#131313` `stopOpacity={0}` at `100%` (`:336`) | match |
| Score-Detail | guide line 1 | x1 / x2 | `150` / `150` | `x1={150} x2={150}` (`:339`) | match |
| Score-Detail | guide line 1 | y1 / y2 | `16` / `200` | `y1={16} y2={200}` (`:339`) | match |
| Score-Detail | guide line 1 | stroke / width | `rgba(19,19,19,0.05)` / `1` | same (`:339`) | match |
| Score-Detail | guide line 2 | x1 / x2 / y1 / y2 | `282` / `282` / `16` / `200` | same (`:340`) | match |
| Score-Detail | guide line 2 | stroke / width | `rgba(19,19,19,0.05)` / `1` | same (`:340`) | match |
| Score-Detail | rank line | x1 / x2 | `52` / `393` | `x1={52} x2={393}` (`:342`) | match |
| Score-Detail | rank line | y1 / y2 | `32` / `32` | `at(threshold)` = `1 + ((1400−1300)/600)·189` = `32.5` (`:283`, `:342`) | **MISMATCH** (0.5px; canvas is self-inconsistent — see contradiction 2) |
| Score-Detail | rank line | stroke / width | `rgba(19,19,19,0.12)` / `1` | same (`:342`) | match |
| Score-Detail | rank line | stroke-dasharray | `6 5` | `strokeDasharray="6 5"` (`:342`) | match |
| Score-Detail | rank line | top-rank state | never drawn by the canvas | omitted when `threshold == null` (`:341`) | app-only state (canvas silent) |
| Score-Detail | end rule | x1 / x2 / y1 / y2 | `352` / `352` / `4` / `200` | `x1={352} x2={352} y1={4} y2={200}` (`:344`) | match |
| Score-Detail | end rule | stroke / width | `rgba(19,19,19,0.14)` / `1` | same (`:344`) | match |
| Score-Detail | end rule | stroke-dasharray | `3 5` | `strokeDasharray="3 5"` (`:344`) | match |
| Score-Detail | area path | start / end x | `56` → `352` | `PLOT_L = 56` → `PLOT_R = 352` (`:256–257`, `:292`) | match |
| Score-Detail | area path | closure | `L352,236 L56,236 Z` | `` `L${PLOT_R},236 L${PLOT_L},236 Z` `` (`:294`) | match |
| Score-Detail | area path | d (curve) | fixed 5-cubic drawn shape `M56,190 C88,186 … 352,52` | Catmull-Rom through the user's own replayed history, ≤48 samples (`:281`, `:293`, `:681–693`) | n/a (data-driven by design) |
| Score-Detail | area path | fill | `url(#sdF2)` | `url(#sdF2${id})` (`:345`) | match |
| Score-Detail | line path | fill | `none` | `fill="none"` (`:346`) | match |
| Score-Detail | line path | stroke | `#131313` | `stroke="#131313"` (`:346`) | match |
| Score-Detail | line path | stroke-width | `2.6` | `strokeWidth={2.6}` (`:346`) | match |
| Score-Detail | line path | linecap / linejoin | `round` / `round` | `strokeLinecap="round" strokeLinejoin="round"` (`:346`) | match |
| Score-Detail | end marker outer | cx | `352` | `cx={352}` (`:347`) | match |
| Score-Detail | end marker outer | cy | `52` | `endY` = `at(1240)` = `51.4` for the drawn data (`:295`, `:347`) | **MISMATCH** (0.6px; same canvas inconsistency) |
| Score-Detail | end marker outer | r | `9` | `r={9}` (`:347`) | match |
| Score-Detail | end marker outer | fill | `#F6F5F2` | `fill="#F6F5F2"` (`:347`) | match |
| Score-Detail | end marker outer | stroke / width | `rgba(19,19,19,0.22)` / `1.5` | same (`:347`) | match |
| Score-Detail | end marker inner | cx / cy / r | `352` / `52` / `4.5` | `cx={352} cy={endY} r={4.5}` (`:348`) | **MISMATCH** on cy (same 0.6px) |
| Score-Detail | end marker inner | fill | `#131313` | `fill="#131313"` (`:348`) | match |
| Score-Detail | y label 1 | left / top | `16px` / `-6px` | `left: 16`, `Y_LABEL_TOP[0] = -6` (`:260`, `:352`) | match |
| Score-Detail | y label 2 | left / top | `16px` / `58px` | `Y_LABEL_TOP[1] = 58` (`:260`) | match |
| Score-Detail | y label 3 | left / top | `16px` / `124px` | `Y_LABEL_TOP[2] = 124` (`:260`) | match |
| Score-Detail | y label 4 | left / top | `16px` / `183px` | `Y_LABEL_TOP[3] = 183` (`:260`) | match |
| Score-Detail | y labels | font-size / weight | `11.5px` / `500` | `fontSize: 11.5`, `sans('500')` (`:352`) | match |
| Score-Detail | y labels | colour | `#B0AEA8` | `color: '#B0AEA8'` (`:352`) | match |
| Score-Detail | y labels | text | `1,400` / `1,200` / `1,000` / `800` | `(scale.top − i·scale.step).toLocaleString()`; `niceScale` returns top 1,400, step 200, bottom 800 for this run (`:353`, `:663–670`) | match |
| Score-Detail | x label 1 | left / top | `40px` / `210px` | `X_LABEL_LEFT[0] = 40`, `top: 210` (`:261`, `:357`) | match |
| Score-Detail | x label 2 | left / top | `178px` / `210px` | `X_LABEL_LEFT[1] = 178` (`:261`) | match |
| Score-Detail | x label 3 | left / top | `314px` / `210px` | `X_LABEL_LEFT[2] = 314` (`:261`) | match |
| Score-Detail | x labels | font-size / weight | `12px` / `500` | `fontSize: 12`, `sans('500')` (`:357`) | match |
| Score-Detail | x labels | colour | `#8B8882` | `color: '#8B8882'` (`:357`) | match |
| Score-Detail | x labels | text | `May` / `Jun` / `Jul` | `toLocaleDateString(undefined, { month: 'short' })` of first / mid / last day (`:358`) | match (data-driven, same format) |
| Score-Detail | insight card | left / right / top | `16px` / `16px` / `396px` | `left: 16, right: 16, top: 396` (`:534–536`) | match |
| Score-Detail | insight card | height | `64px` | `height: 64` (`:537`) | match |
| Score-Detail | insight card | border-radius | `18px` | `borderRadius: 18` (`:538`) | match |
| Score-Detail | insight card | background | `#ECEBE4` | `backgroundColor: '#ECEBE4'` (`:539`) | match |
| Score-Detail | insight card | display / align-items | `flex` / `center` | `flexDirection:'row', alignItems:'center'` (`:540–541`) | match |
| Score-Detail | insight card | gap | `12px` | `gap: 12` (`:542`) | match |
| Score-Detail | insight card | padding | `0 14px` | `paddingHorizontal: 14` (`:543`) | match |
| Score-Detail | insight card | box-sizing | `border-box` | RN default | match |
| Score-Detail | insight disc | width / height | `38px` / `38px` | `width: 38, height: 38` (`:545`) | match |
| Score-Detail | insight disc | border-radius | `50%` | `borderRadius: 19` (`:545`) | match |
| Score-Detail | insight disc | background | `#131313` | `backgroundColor: '#131313'` (`:545`) | match |
| Score-Detail | insight disc | align / justify | `center` / `center` | same (`:545`) | match |
| Score-Detail | insight disc | flex-shrink | `0` | RN default `0` | match |
| Score-Detail | trend glyph | width / height / viewBox | `16` / `11` / `0 0 16 11` | `width={16} height={11} viewBox="0 0 16 11"` (`:558`) | match |
| Score-Detail | trend glyph | line d | `M1.5 9.5L6 5l3 2.5L14.5 1.5` | identical string (`:559`) | match |
| Score-Detail | trend glyph | arrow d | `M10.8 1.5h3.7V5.2` | `"M10.8 1.5h3.7V5.2"` (`:560`) | match |
| Score-Detail | trend glyph | stroke / width | `#FFFFFF` / `1.9` | `stroke="#FFFFFF" strokeWidth={1.9}` (`:559–560`) | match |
| Score-Detail | trend glyph | fill | `none` | `fill="none"` (`:558`) | match |
| Score-Detail | trend glyph | linecap / linejoin | `round` / `round` | round / round on both paths (`:559–560`) | match |
| Score-Detail | insight text block | flex-shrink | `0` | RN default `0` (`:546`) | match |
| Score-Detail | insight title | font-size / weight | `13.5px` / `600` | `fontSize: 13.5`, `sans('600')` (`:547`) | match |
| Score-Detail | insight title | colour | `#1D1C1A` | `color: '#1D1C1A'` (`:547`) | match |
| Score-Detail | insight title | text | `+90 points` | `` `${gain < 0 ? '−' : '+'}${Math.abs(gain)} points` `` — U+2212 for the negative (`:383`) | match (data-driven) |
| Score-Detail | insight sub | margin-top | `2px` | `marginTop: 2` (`:548`) | match |
| Score-Detail | insight sub | font-size / weight | `11.5px` / `400` | `fontSize: 11.5`, `sans('400')` (`:548`) | match |
| Score-Detail | insight sub | colour | `#8B8882` | `color: '#8B8882'` (`:548`) | match |
| Score-Detail | insight sub | text | `vs Apr 3 &ndash; May 3` — a window that **ends** where the chart begins (chart runs May–Jul) | `` `vs ${monthDay(firstDay)} – ${monthDay(lastDay)}` `` — the chart's **own** span, i.e. `vs May 3 – Aug 1` (`:384`, `:300–301`) | **MISMATCH** (wrong window) |
| Score-Detail | insight sub | dash | `&ndash;` (U+2013) | `–` (U+2013) (`:384`) | match |
| Score-Detail | insight spacer | flex | `1` | `flex: 1` (`:550`) | match |
| Score-Detail | insight body | width | `152px` | `width: 152` (`:551`) | match |
| Score-Detail | insight body | font-size / weight | `12px` / `400` | `fontSize: 12`, `sans('400')` (`:551`) | match |
| Score-Detail | insight body | line-height | `17px` | `lineHeight: 17` (`:551`) | match |
| Score-Detail | insight body | colour | `#55534E` | `color: '#55534E'` (`:551`) | match |
| Score-Detail | insight body | text-wrap | `pretty` | `textWrap:'pretty'` on web (`AppText.tsx:119`) | match |
| Score-Detail | insight body | text | `Keep going. You&rsquo;re building real momentum.` (U+2019) | `'Keep going. You’re building real momentum.'` (U+2019, `:385`) | match |
| Score-Detail | page dots | left / right / top | `0` / `0` / `504px` | `left: 0, right: 0, top: 504` (`:95`) | match |
| Score-Detail | page dots | justify-content / gap | `center` / `8px` | `justifyContent:'center', gap: 8` (`:95`) | match |
| Score-Detail | page dots | count | `4` | `3` (`:96`) | **MISMATCH** on the frame's literal; app matches the two other frames — see contradiction 1 |
| Score-Detail | page dots | dot size / radius | `6px` × `6px` / `50%` | `width: 6, height: 6, borderRadius: 3` (`:97`) | match |
| Score-Detail | page dots | active dot | 1st, `#131313` | `i === page ? '#131313'`, page 0 (`:97`) | match |
| Score-Detail | page dots | inactive dot | `rgba(19,19,19,0.16)` | `: 'rgba(19,19,19,0.16)'` (`:97`) | match |
| Score-Detail | page dots | pointer-events | not stated | `pointerEvents="none"` (`:95`) | app-only (no visual difference) |

---

## Frame 5 — Score-Detail-Moves (sheet page 2)

App: `src/app/score.tsx` → `WhatMoved` (`:399–442`). Sheet-relative tops.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Score-Detail-Moves | title | left / top | `20px` / `26px` | `left: 20, top: 26` (`:406`) | match |
| Score-Detail-Moves | title | font-size / weight | `18px` / `600` | `fontSize: 18`, `sans('600')` (`:406`) | match |
| Score-Detail-Moves | title | letter-spacing | `-0.2px` | `letterSpacing: -0.2` (`:406`) | match |
| Score-Detail-Moves | title | colour | `#1D1C1A` | `color: '#1D1C1A'` (`:406`) | match |
| Score-Detail-Moves | title | text | `What moved it` | `What moved it` (`:406`) | match |
| Score-Detail-Moves | eyebrow | right / top | `20px` / `32px` | `right: 20, top: 32` (`:407`) | match |
| Score-Detail-Moves | eyebrow | font-size / weight | `12.5px` / `500` | `fontSize: 12.5`, `sans('500')` (`:407`) | match |
| Score-Detail-Moves | eyebrow | colour | `#8B8882` | `color: '#8B8882'` (`:407`) | match |
| Score-Detail-Moves | eyebrow | text-transform | none | literal lower case (`:407`) | match |
| Score-Detail-Moves | eyebrow | text | `this month` | `this month` (`:407`) | match |
| Score-Detail-Moves | ledger row 1 | top | `100px` | `100 + 0·52` = 100 (`:413`) | match |
| Score-Detail-Moves | ledger row 2 | top | `152px` | `100 + 1·52` = 152 (`:413`) | match |
| Score-Detail-Moves | ledger row 3 | top | `204px` | `100 + 2·52` = 204 (`:413`) | match |
| Score-Detail-Moves | ledger row 4 | top | `256px` | `100 + 3·52` = 256 (`:413`) | match |
| Score-Detail-Moves | ledger row 5 | top | `308px` | `100 + 4·52` = 308 (`:413`) | match |
| Score-Detail-Moves | ledger rows | left / right | `20px` / `20px` | `left: 20, right: 20` (`:413`) | match |
| Score-Detail-Moves | ledger rows | display / align-items | `flex` / `center` | `flexDirection:'row', alignItems:'center'` (`:413`) | match |
| Score-Detail-Moves | ledger rows | gap | `12px` | `gap: 12` (`:413`) | match |
| Score-Detail-Moves | ledger label | width | `108px` | `width: 108` (`:414`) | match |
| Score-Detail-Moves | ledger label | flex-shrink | `0` | RN default `0` | match |
| Score-Detail-Moves | ledger label | font-size / weight | `13.5px` / `500` | `fontSize: 13.5`, `sans('500')` (`:414`) | match |
| Score-Detail-Moves | ledger label | colour | `#1D1C1A` | `color: '#1D1C1A'` (`:414`) | match |
| Score-Detail-Moves | ledger label 1 | text | `Clean days` | `'Clean days'` (`:643`) | match |
| Score-Detail-Moves | ledger label 2 | text | `Check-ins` | `'Check-ins'` (`:644`) | match |
| Score-Detail-Moves | ledger label 3 | text | `Lessons` | `'Lessons'` (`:645`) | match |
| Score-Detail-Moves | ledger label 4 | text | `Urges ridden` | `'Urges ridden'` (`:646`) | match |
| Score-Detail-Moves | ledger label 5 | text | `Slip &middot; Jul 8` (U+00B7) | `` `Slip · ${monthDay(last.createdAt)}` `` (`:650`) | match |
| Score-Detail-Moves | ledger label 5 | multi-slip state | never drawn by the canvas | `` `${slips.length} slips` `` (`:650`) | app-only state (canvas silent) |
| Score-Detail-Moves | bar track | flex | `1` | `flex: 1` (`:415`) | match |
| Score-Detail-Moves | bar | height | `10px` | `height: 10` (`:419`) | match |
| Score-Detail-Moves | bar | border-radius | `5px` | `borderRadius: 5` (`:420`) | match |
| Score-Detail-Moves | bar 1 | width | `150px` | `BAR_MIN + ((64−8)/(64−8))·(150−34)` = `150` (`:395–396`, `:410`) | match |
| Score-Detail-Moves | bar 2 | width | `58px` | `34 + (10/56)·116` = `54.71` (`:410`) | **MISMATCH** (3.29px) |
| Score-Detail-Moves | bar 3 | width | `44px` | `34 + (4/56)·116` = `42.29` (`:410`) | **MISMATCH** (1.71px) |
| Score-Detail-Moves | bar 4 | width | `34px` | `34 + 0` = `34` (`:410`) | match |
| Score-Detail-Moves | bar 5 | width | `52px` | `34 + (8/56)·116` = `50.57` (`:410`) | **MISMATCH** (1.43px) |
| Score-Detail-Moves | bar 1 | background | `rgba(19,19,19,1)` | `BAR_TONE[0] = 'rgba(19,19,19,1)'` (`:397`) | match |
| Score-Detail-Moves | bar 2 | background | `rgba(19,19,19,0.55)` | `BAR_TONE[1]` (`:397`) | match |
| Score-Detail-Moves | bar 3 | background | `rgba(19,19,19,0.38)` | `BAR_TONE[2]` (`:397`) | match |
| Score-Detail-Moves | bar 4 | background | `rgba(19,19,19,0.25)` | `BAR_TONE[3]` (`:397`) | match |
| Score-Detail-Moves | bar 5 | background | none (outline only) | `down ? undefined` (`:421`) | match |
| Score-Detail-Moves | bar 5 | box-shadow | `inset 0 0 0 1.5px #131313` | `'inset 0 0 0 1.5px #131313'` (`:422`) | match |
| Score-Detail-Moves | bars 1–4 | box-shadow | none | `undefined` (`:422`) | match |
| Score-Detail-Moves | ledger value | width | `38px` | `width: 38` (`:426`) | match |
| Score-Detail-Moves | ledger value | flex-shrink | `0` | RN default `0` | match |
| Score-Detail-Moves | ledger value | text-align | `right` | `textAlign: 'right'` (`:426`) | match |
| Score-Detail-Moves | ledger value | font-size / weight | `13.5px` / `600` | `fontSize: 13.5`, `sans('600')` (`:426`) | match |
| Score-Detail-Moves | ledger value | colour | `#1D1C1A` | `color: '#1D1C1A'` (`:426`) | match |
| Score-Detail-Moves | ledger value 1–4 | text | `+64` / `+18` / `+12` / `+8` | `+` + `Math.abs(points)` (`:427–428`) | match (data-driven) |
| Score-Detail-Moves | ledger value 5 | sign glyph | `&minus;` (U+2212) | `'−'` (U+2212, `:427`) | match |
| Score-Detail-Moves | ledger value 5 | text | `&minus;16` | `−16` (`:427–428`) | match |
| Score-Detail-Moves | insight card | left / right / top / height | `16px` / `16px` / `396px` / `64px` | same (`:534–537`) | match |
| Score-Detail-Moves | insight card | radius / background | `18px` / `#ECEBE4` | `borderRadius: 18`, `'#ECEBE4'` (`:538–539`) | match |
| Score-Detail-Moves | insight card | gap / padding | `12px` / `0 14px` | `gap: 12, paddingHorizontal: 14` (`:542–543`) | match |
| Score-Detail-Moves | insight disc | 38 / 38 / 50% / `#131313` | as Score-Detail | `width/height 38, borderRadius 19, '#131313'` (`:545`) | match |
| Score-Detail-Moves | trend glyph | width / height / viewBox / d / stroke / width / caps | identical to Score-Detail's | `TrendGlyph` (`:556–563`) | match |
| Score-Detail-Moves | insight title | font-size / weight / colour | `13.5px` / `600` / `#1D1C1A` | same (`:547`) | match |
| Score-Detail-Moves | insight title | text | `+86 net` | `` `${net < 0 ? '−' : '+'}${Math.abs(net)} net` `` (`:436`); 64+18+12+8−16 = 86 | match |
| Score-Detail-Moves | insight sub | margin-top / size / weight / colour | `2px` / `11.5px` / `400` / `#8B8882` | same (`:548`) | match |
| Score-Detail-Moves | insight sub | text | `this month` | `sub="this month"` (`:437`) | match |
| Score-Detail-Moves | insight spacer | flex | `1` | `flex: 1` (`:550`) | match |
| Score-Detail-Moves | insight body | width / size / line-height / colour | `152px` / `12px` / `17px` / `#55534E` | same (`:551`) | match |
| Score-Detail-Moves | insight body | text-wrap | `pretty` | `textWrap:'pretty'` on web | match |
| Score-Detail-Moves | insight body | text | `Clean days do the heavy lifting. Keep the evenings boring.` | identical string (`:438`) | match |
| Score-Detail-Moves | page dots | left / right / top / gap | `0` / `0` / `504px` / `8px` | same (`:95`) | match |
| Score-Detail-Moves | page dots | count | `3` | `3` (`:96`) | match |
| Score-Detail-Moves | page dots | dot size / radius | `6px` × `6px` / `50%` | `6 / 6 / 3` (`:97`) | match |
| Score-Detail-Moves | page dots | active dot | 2nd, `#131313` | `i === page`, page 1 (`:97`) | match |
| Score-Detail-Moves | page dots | inactive dots | `rgba(19,19,19,0.16)` | same (`:97`) | match |

---

## Frame 6 — Score-Detail-Ranks (sheet page 3)

App: `src/app/score.tsx` → `TheRanks` (`:446–510`). Sheet-relative tops.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Score-Detail-Ranks | title | left / top | `20px` / `26px` | `left: 20, top: 26` (`:449`) | match |
| Score-Detail-Ranks | title | font-size / weight | `18px` / `600` | `fontSize: 18`, `sans('600')` (`:449`) | match |
| Score-Detail-Ranks | title | letter-spacing | `-0.2px` | `letterSpacing: -0.2` (`:449`) | match |
| Score-Detail-Ranks | title | colour | `#1D1C1A` | `color: '#1D1C1A'` (`:449`) | match |
| Score-Detail-Ranks | title | text | `The ranks` | `The ranks` (`:449`) | match |
| Score-Detail-Ranks | eyebrow | presence | none on this frame | none | match |
| Score-Detail-Ranks | rank row 1 | top | `92px` | `92 + 0·64` = 92 (`:461`) | match |
| Score-Detail-Ranks | rank row 2 | top | `156px` | `92 + 1·64` = 156 (`:461`) | match |
| Score-Detail-Ranks | rank row 3 | top | `220px` | `92 + 2·64` = 220 (`:461`) | match |
| Score-Detail-Ranks | rank row 4 | top | `284px` | `92 + 3·64` = 284 (`:461`) | match |
| Score-Detail-Ranks | rank rows | left / right | `16px` / `16px` | `left: 16, right: 16` (`:459–460`) | match |
| Score-Detail-Ranks | rank rows | height | `56px` | `height: 56` (`:462`) | match |
| Score-Detail-Ranks | rank rows | border-radius | `16px` | `borderRadius: 16` (`:463`) | match |
| Score-Detail-Ranks | rank rows | display / align-items | `flex` / `center` | `flexDirection:'row', alignItems:'center'` (`:465–466`) | match |
| Score-Detail-Ranks | rank rows | gap | `13px` | `gap: 13` (`:467`) | match |
| Score-Detail-Ranks | rank rows | padding | `0 12px` | `paddingHorizontal: 12` (`:468`) | match |
| Score-Detail-Ranks | rank rows | box-sizing | `border-box` | RN default | match |
| Score-Detail-Ranks | rank row 1 | background | none | `here ? '#ECEBE4' : undefined` (`:464`) | match |
| Score-Detail-Ranks | rank row 2 | background | `#ECEBE4` | `here ? '#ECEBE4'` (`:464`) | match |
| Score-Detail-Ranks | rank rows 3–4 | background | none | `undefined` (`:464`) | match |
| Score-Detail-Ranks | rank disc | width / height | `34px` / `34px` | `width: 34, height: 34` (`:471–472`) | match |
| Score-Detail-Ranks | rank disc | border-radius | `50%` | `borderRadius: 17` (`:473`) | match |
| Score-Detail-Ranks | rank disc | flex-shrink | `0` | RN default `0` | match |
| Score-Detail-Ranks | rank disc 1 | background | `#131313` | `reached ? '#131313'` (`:474`) | match |
| Score-Detail-Ranks | rank disc 1 | box-shadow | none | `reached ? undefined` (`:475`) | match |
| Score-Detail-Ranks | rank disc 1 | align / justify | `center` / `center` | `alignItems:'center', justifyContent:'center'` (`:476–477`) | match |
| Score-Detail-Ranks | rank disc 1 tick | width / height / viewBox | `13` / `10` / `0 0 16 12` | `width={13} height={10} viewBox="0 0 16 12"` (`:486`) | match |
| Score-Detail-Ranks | rank disc 1 tick | path d | `M1.5 6l4.4 4.5L14.5 1.5` | `"M1.5 6l4.4 4.5L14.5 1.5"` (`:487`) | match |
| Score-Detail-Ranks | rank disc 1 tick | fill / stroke | `none` / `#FFFFFF` | `fill="none"` / `stroke="#FFFFFF"` (`:486–487`) | match |
| Score-Detail-Ranks | rank disc 1 tick | stroke-width | `2.4` | `strokeWidth={2.4}` (`:487`) | match |
| Score-Detail-Ranks | rank disc 1 tick | linecap / linejoin | `round` / `round` | `strokeLinecap="round" strokeLinejoin="round"` (`:487`) | match |
| Score-Detail-Ranks | rank disc 2 | background | `#131313` | `reached ? '#131313'` (`:474`) | match |
| Score-Detail-Ranks | rank disc 2 sail | viewBox | `0 0 40 26` | `viewBox="0 0 40 26"` (`:481`) | match |
| Score-Detail-Ranks | rank disc 2 sail | width | `16px` | `width={16}` (`:481`) | match |
| Score-Detail-Ranks | rank disc 2 sail | height | auto (26/40 × 16 = `10.4`) | `height={10.4}` (`:481`) | match |
| Score-Detail-Ranks | rank disc 2 sail | sail d | `M21 3 L21 16 L12 16 Z` | identical (`:482`) | match |
| Score-Detail-Ranks | rank disc 2 sail | hull d | `M7 18 L33 18 Q30 24 20 24 Q10 24 7 18 Z` | identical (`:483`) | match |
| Score-Detail-Ranks | rank disc 2 sail | fill | `#F4F3F0` (both paths) | `fill="#F4F3F0"` (both, `:482–483`) | match |
| Score-Detail-Ranks | rank discs 3–4 | background | `#FFFFFF` | `: '#FFFFFF'` (`:474`) | match |
| Score-Detail-Ranks | rank discs 3–4 | box-shadow | `inset 0 0 0 1.5px rgba(0,0,0,0.14)` | `'inset 0 0 0 1.5px rgba(0,0,0,0.14)'` (`:475`) | match |
| Score-Detail-Ranks | rank discs 3–4 | contents | empty | `null` (`:489`) | match |
| Score-Detail-Ranks | rank name | flex | `1` | `flex: 1` (`:491`) | match |
| Score-Detail-Ranks | rank name | font-size / weight | `15px` / `600` | `fontSize: 15`, `sans('600')` (`:491`) | match |
| Score-Detail-Ranks | rank name 1 | colour | `#1D1C1A` | `reached ? '#1D1C1A'` (`:491`) | match |
| Score-Detail-Ranks | rank name 2 | colour | `#1D1C1A` | `reached ? '#1D1C1A'` (`:491`) | match |
| Score-Detail-Ranks | rank names 3–4 | colour | `#8B8882` | `: '#8B8882'` (`:491`) | match |
| Score-Detail-Ranks | rank names | text | `Deckhand` / `Navigator` / `Helmsman` / `Captain` | `RANKS[i].name` (`score.ts:29–34`) | match |
| Score-Detail-Ranks | "you're here" pill | font-size / weight | `11.5px` / `600` | `fontSize: 11.5`, `sans('600')` (`:494`) | match |
| Score-Detail-Ranks | "you're here" pill | colour | `#F4F3F0` | `color: '#F4F3F0'` (`:494`) | match |
| Score-Detail-Ranks | "you're here" pill | background | `#131313` | `backgroundColor: '#131313'` (`:493`) | match |
| Score-Detail-Ranks | "you're here" pill | border-radius | `9px` | `borderRadius: 9` (`:493`) | match |
| Score-Detail-Ranks | "you're here" pill | padding | `3px 9px` | `paddingHorizontal: 9, paddingVertical: 3` (`:493`) | match |
| Score-Detail-Ranks | "you're here" pill | text | `you&rsquo;re here` (U+2019) | `you’re here` (U+2019, `:494`) | match |
| Score-Detail-Ranks | "you're here" pill | placement | row 2 only, between name and threshold | rendered when `here`, in the same slot (`:492–496`) | match |
| Score-Detail-Ranks | rank threshold | font-size / weight | `13px` / `500` | `fontSize: 13`, `sans('500')` (`:497`) | match |
| Score-Detail-Ranks | rank threshold | colour | `#8B8882` (all four rows) | `color: '#8B8882'` (`:497`) | match |
| Score-Detail-Ranks | rank threshold | text | `1,000` / `1,150` / `1,300` / `1,500` | `rank.at.toLocaleString()` (`:497`, `score.ts:29–34`) | match |
| Score-Detail-Ranks | insight card | left / right / top / height | `16px` / `16px` / `396px` / `64px` | same (`:534–537`) | match |
| Score-Detail-Ranks | insight card | radius / background / gap / padding | `18px` / `#ECEBE4` / `12px` / `0 14px` | same (`:538–543`) | match |
| Score-Detail-Ranks | insight disc | 38 / 38 / 50% / `#131313` | as the other pages | same (`:545`) | match |
| Score-Detail-Ranks | flag glyph | width / height / viewBox | `14` / `16` / `0 0 24 24` | `width={14} height={16} viewBox="0 0 24 24"` (`:567`) | match |
| Score-Detail-Ranks | flag glyph | staff d | `M6 22V3` | `"M6 22V3"` (`:568`) | match |
| Score-Detail-Ranks | flag glyph | staff stroke / width / cap | `#FFFFFF` / `2.4` / `round` | same (`:568`) | match |
| Score-Detail-Ranks | flag glyph | pennant d | `M6.5 3.5h11.5l-3.1 4.5 3.1 4.5H6.5Z` | identical string (`:569`) | match |
| Score-Detail-Ranks | flag glyph | pennant fill | `#FFFFFF` | `fill="#FFFFFF"` (`:569`) | match |
| Score-Detail-Ranks | insight title | font-size / weight / colour | `13.5px` / `600` / `#1D1C1A` | same (`:547`) | match |
| Score-Detail-Ranks | insight title | text | `60 to go` | `` `${toGo} to go` ``; 1,300 − 1,240 = 60 (`:504`, `score.ts:50`) | match |
| Score-Detail-Ranks | insight title | top-rank state | never drawn by the canvas | `'Top of the ladder'` (`:504`) | app-only state (canvas silent) |
| Score-Detail-Ranks | insight sub | margin-top / size / weight / colour | `2px` / `11.5px` / `400` / `#8B8882` | same (`:548`) | match |
| Score-Detail-Ranks | insight sub | text | `Helmsman` | `next ?? RANKS[last].name` (`:505`) | match |
| Score-Detail-Ranks | insight spacer | flex | `1` | `flex: 1` (`:550`) | match |
| Score-Detail-Ranks | insight body | width / size / line-height / colour | `152px` / `12px` / `17px` / `#55534E` | same (`:551`) | match |
| Score-Detail-Ranks | insight body | text-wrap | `pretty` | `textWrap:'pretty'` on web | match |
| Score-Detail-Ranks | insight body | text | `About a week at this pace. Steady beats fast.` | `paceLine()` returns exactly that when `weeks === 1` (`:523`) | match |
| Score-Detail-Ranks | page dots | left / right / top / gap | `0` / `0` / `504px` / `8px` | same (`:95`) | match |
| Score-Detail-Ranks | page dots | count | `3` | `3` (`:96`) | match |
| Score-Detail-Ranks | page dots | dot size / radius | `6px` × `6px` / `50%` | `6 / 6 / 3` (`:97`) | match |
| Score-Detail-Ranks | page dots | active dot | 3rd, `#131313` | `i === page`, page 2 (`:97`) | match |
| Score-Detail-Ranks | page dots | inactive dots | `rgba(19,19,19,0.16)` | same (`:97`) | match |

---

# Findings

**11 mismatches** across 6 frames / **824 comparison rows**.

The tables carry 19 rows whose verdict cell reads MISMATCH. They collapse to 11
defects plus one canvas error: the noise texture fails on 3 rows (one per frame
that draws it), the reflection shaft on 4 (height, shape, gradient type, filter),
the chart's plot frame on 3 (rank line, outer marker, inner marker), and the
4th page dot on `Score-Detail` is a fault in the frame, not the app — it is
recorded under "Non-mismatches worth recording" below rather than here.

1. **Noise texture is stretched, not tiled** — `src/components/paywall/PaywallFlow.tsx:426`
   (`PwConfirmed`), `:518` (`PwTrialOffer` branch) and `src/app/score.tsx:200`
   (`NightHeader`).
   Current: `<Image source={noiseDark} contentFit="cover" …>`.
   Design: `background-image:url('noise-dark.png')` with CSS's default
   `background-repeat: repeat`. The asset is **96 × 96** (verified), so the design
   tiles it ~4 × 9 times over the 393 × 852 frame while the app blows one tile up
   to ~4.1× wide and ~8.9× tall — the grain frequency is off by roughly an order
   of magnitude and reads as a soft blotch rather than paper noise.
   Affects Paywall-Rescue, Paywall-Confirmed, Score-Detail, Score-Detail-Moves,
   Score-Detail-Ranks.

2. **Score-Detail insight sub names the wrong window** — `src/app/score.tsx:384`.
   Current: `` sub={`vs ${monthDay(firstDay)} – ${monthDay(lastDay)}`} `` where
   `firstDay` / `lastDay` (`:300–301`) are the **first and last day of the chart's
   own range**, so a 3M view renders `vs May 3 – Aug 1` — the same window the
   chart already plots.
   Design (`Score-Detail.html:554`): `vs Apr 3 – May 3` — a window that ends where
   the chart's x-axis begins (the axis runs May / Jun / Jul). The design compares
   against the **preceding** period; the app labels the current one.

3. **Reflection shaft is the wrong shape, gradient and height** — `src/app/score.tsx:196`.
   Current: `<Ellipse cx={W-75} cy={43} rx={19} ry={31} fill="url(#sdShaft…)" />`
   with a `RadialGradient` (`:182`).
   Design (`Score-Detail.html:129–138`): a **rectangle** `right:56 top:240
   width:38 height:58` filled `linear-gradient(180deg, rgba(223,220,211,0.15),
   rgba(223,220,211,0))` with `filter:blur(5px)`.
   Height 58 → 62 (`ry 31`), rect → ellipse, linear → radial. Deliberate (the
   comment at `:189–195` explains it) but it is a divergence from the literal.

4. **Moon halo `filter: blur(5px)` is not rendered** — `src/app/score.tsx:151`
   with the gradient at `:130–133`.
   Current: a hard-edged `<Circle r={58}>` with a two-stop radial.
   Design (`Score-Detail.html:51–61`): the same disc plus `filter:blur(5px)`.
   Deliberate (comment at `:129`); the falloff approximates it but the literal
   filter is absent.

5. **Moon `box-shadow: 0 0 26px rgba(223,220,211,0.26)` is redrawn as a gradient**
   — `src/app/score.tsx:152` with the gradient at `:135–138`.
   Current: `<Circle r={47} fill="url(#moonglow…)" />`, stops `0.26` at `0.45` → `0` at `1`.
   Design (`Score-Detail.html:70`): a real 26px-blur box-shadow. Deliberate, but
   the spread profile is not the literal.

6. **Waterline glow `filter: blur(3px)` is not rendered** — `src/app/score.tsx:187`.
   Current: a hard-edged 16px `<Rect>` with the correct gradient.
   Design (`Score-Detail.html:100–108`): the same rect plus `filter:blur(3px)`,
   which is what softens the seam between the headland and the sea.

7. **Rescue headline wraps `pretty`, not `balance`** — `src/components/paywall/PaywallFlow.tsx:315`
   via `src/components/ui/AppText.tsx:119`.
   Current: variant `body` → `textWrap: 'pretty'` on web.
   Design (`Paywall-Rescue.html:114`): `text-wrap:balance` on
   "Before you go — three days on us." Web-only; no effect on native.

8. **Ledger bar 2 is 3.29px short** — `src/app/score.tsx:410`.
   Current: `BAR_MIN + ((|18|−8)/(64−8))·(150−34)` = **54.71**.
   Design (`Score-Detail-Moves.html:408`): `width:58px`.

9. **Ledger bar 3 is 1.71px short** — `src/app/score.tsx:410`.
   Current: **42.29**. Design (`Score-Detail-Moves.html:448`): `width:44px`.

10. **Ledger bar 5 (the slip) is 1.43px short** — `src/app/score.tsx:410`.
    Current: **50.57**. Design (`Score-Detail-Moves.html:528`): `width:52px`.
    (8–10 share one cause: the canvas's own five widths do not lie on a line —
    see contradiction 3. The app's ramp reproduces the extremes exactly, which is
    the reading the evidence supports, so these three are sub-4px consequences of
    a canvas the frame itself cannot satisfy.)

11. **Chart plot frame sits ~0.5px low** — `src/app/score.tsx:258–259`
    (`PLOT_TOP = 1`, `PLOT_BOTTOM = 190`), used at `:283`, `:342`, `:347–348`.
    Current: the 1,300 rank line lands at `at(1300)` = **32.5** and the end marker
    at `at(1240)` = **51.4**.
    Design (`Score-Detail.html:425`, `:431–433`): `y=32` for the dashed rank line
    and `cy=52` for both end-marker circles.
    The frame contradicts itself here (contradiction 2): its own y-axis labels
    imply the app's numbers, its drawn geometry says 32 / 52.

## Non-mismatches worth recording

- **Score-Detail's 4th page dot** (`Score-Detail.html:581–608`) is a canvas error,
  not an app defect. `Score-Detail-Moves.html` and `Score-Detail-Ranks.html` both
  draw three, the design set has exactly three score pages, and no frame ever
  activates a fourth dot. `src/app/score.tsx:96` renders three — the reading the
  evidence supports.
- **The web font fallback chain** (`theme.ts:159`) is
  `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`
  against the canvas's
  `-apple-system, 'SF Pro Text', system-ui, 'Helvetica Neue', sans-serif`.
  Both resolve to SF Pro on Apple platforms, which is the ship target; only a
  non-Apple browser would land on a different face.
- **`border-radius: 1px` on the 1.5-tall horizon tick** (`Score-Detail.html:136`)
  computes to 0.75 after CSS's radius clamp; `src/app/score.tsx:197` writes
  `rx={0.75}`, the computed literal. Match, not a rounding.
