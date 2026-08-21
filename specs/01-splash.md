# 01 · Splash

* **Design frame** `Email-Login/Splash` — `.uifinal1/final/Email-Login/Splash.html`
* **App files** `src/components/ui/Waterline.tsx` (`SplashScene`), used by `src/app/index.tsx` and `src/app/(auth)/splash.tsx`
* **Frame** 393 × 852, `overflow: hidden`

The frame carries no text and no controls. It is a night field, four soft washes,
four stars, a laurel mark, and a grain overlay.

## Layers, in the canvas's own paint order

| # | Element | Transcribed declaration |
| --- | --- | --- |
| 0 | frame | `background: linear-gradient(180deg, #131313 0%, #1D1C1A 55%, #2E2C29 100%)` |
| 1 | art layer | `position:absolute; inset:0; overflow:hidden; pointer-events:none` |
| 2 | wash A | `left:-30px top:-120px 480×240 border-radius:50%` · `radial-gradient(closest-side, rgba(120,115,105,0.20), rgba(120,115,105,0) 72%)` · `filter: blur(7px)` |
| 3 | wash B | `left:120px top:290px 230×230` · `radial-gradient(closest-side, rgba(120,140,150,0.10), rgba(120,140,150,0) 70%)` · `blur(6px)` |
| 4 | wash C | `left:118px top:395px 120×150` · `radial-gradient(closest-side, rgba(226,190,140,0.16), rgba(226,190,140,0) 72%)` · `blur(5px)` |
| 5 | laurel | `<img src="laurel-mark.webp" width=72 height=72>` · `left:160px top:400px` · `opacity:0.9` · `filter: brightness(0) invert(1)` |
| 6 | wash D | `left:-60px top:620px 420×260` · `radial-gradient(closest-side, rgba(120,115,105,0.14), rgba(120,115,105,0) 72%)` · `blur(8px)` |
| 7 | star 1 | `left:96px top:140px 2×2 radius:50% background:rgba(160,155,145,0.22)` |
| 8 | star 2 | `left:290px top:205px 2×2 rgba(160,155,145,0.18)` |
| 9 | star 3 | `left:200px top:590px 2×2 rgba(160,155,145,0.15)` |
| 10 | star 4 | `left:330px top:700px 2×2 rgba(160,155,145,0.14)` |
| 11 | grain | `inset:0; background-image:url('noise-dark.png'); opacity:0.10` |
| 12 | status bar | canvas chrome — 54px tall, `· 9:41` at 17px/600, `letter-spacing:-0.2px`, `rgba(255,255,255,0.4)`, three glyphs `#F4F3F0` at `gap:7px`, `opacity:.92`, `padding:6px 32px 0 46px` |
| 13 | home indicator | canvas chrome — `left:127px top:839px 139×5 radius:100px background:#131313` |

Colour conversions used below: `rgb(120,115,105)` = `#787369`, `rgb(120,140,150)` = `#788C96`,
`rgb(226,190,140)` = `#E2BE8C`, `rgb(160,155,145)` = `#A09B91`.

## Typography · spacing · states · motion

No type. No padding, margins or gaps — every child is absolutely positioned.
No pressed/disabled/loading/empty/error/focus state: the frame is not interactive
(`pointer-events:none` on the art layer, nothing else takes a touch).
No motion is declared in the frame. The app holds the mark for 900 ms and then
crossfades to `02 · Finding the Waterline`; that timing is app behaviour, not a
design value, and is left as it is.

## Comparison — design vs `SplashScene`

| Property | Design | App | Result |
| --- | --- | --- | --- |
| frame background | `linear-gradient(180deg,#131313 0%,#1D1C1A 55%,#2E2C29 100%)` | `LinearGradient id=spField` stops `0 #131313`, `0.55 #1D1C1A`, `1 #2E2C29`, y1→y2 vertical | match |
| viewBox / scaling | fixed 393 × 852 | `viewBox="0 0 393 852" preserveAspectRatio="none"` | match |
| wash A geometry | −30, −120, 480 × 240 | `Wash left={-30} top={-120} width={480} height={240}` → `cx=210 cy=0 rx=240 ry=120` | match |
| wash A colour | `rgba(120,115,105,0.20)` → 0 at 72% | `#787369` @ 0.2 → 0 at 0.72 | match |
| wash B | 120, 290, 230 × 230, `rgba(120,140,150,0.10)`, 70% | `#788C96` 0.1, fade 70 | match |
| wash C | 118, 395, 120 × 150, `rgba(226,190,140,0.16)`, 72% | `#E2BE8C` 0.16, fade 72 | match |
| wash D | −60, 620, 420 × 260, `rgba(120,115,105,0.14)`, 72% | `#787369` 0.14, fade 72 | match |
| wash blur | `blur(7/6/5/8 px)` | none — see gap note below | platform gap |
| star 1–4 x/y | (96,140) (290,205) (200,590) (330,700) | `Star x=…` renders `cx = x+1, cy = y+1, r = 1` — a 2×2 box's centre | match |
| star opacities | .22 / .18 / .15 / .14 | .22 / .18 / .15 / .14 | match |
| star colour | `rgb(160,155,145)` | `#A09B91` | match |
| laurel size | 72 × 72 | 72 × 72 | match |
| laurel position | `left:160 top:400` | `left:'40.7%' top:'46.9%'` → 159.95, 399.7 on a 393 × 852 screen | match |
| laurel opacity | 0.9 | 0.9 | match |
| laurel colour | `brightness(0) invert(1)` = pure white | `tintColor="#FFFFFF"` | match |
| laurel fit | `<img>` at intrinsic 72 × 72 | `contentFit="contain"` in a 72 × 72 box | match |
| grain source | `noise-dark.png` | `assets/images/noise-dark.png` | match |
| grain opacity | 0.10 | 0.1 | match |
| paint order | washes A–C, laurel, wash D, stars, grain | washes A–D + stars (one `<Svg>`), laurel, grain | equivalent — see note |
| status bar | drawn by the canvas | `StatusBar style="light"` (OS draws it) | match — D009 |
| home indicator | drawn by the canvas | OS draws it | match — D009 |

Every row reads match or is accounted for. **Status: no change required.**

### Paint-order note
The canvas paints the laurel *before* wash D and the stars; the app paints it after.
The three elements do not overlap: the laurel occupies (160…232, 400…472); wash D starts
at y 620, and the four stars sit at (96,140), (290,205), (200,590), (330,700). The layers
are disjoint, so the two orders produce the same image. Recorded rather than "fixed",
because moving the laurel into the `<Svg>` would cost the `tintColor` treatment for nothing.

### Platform gap — `filter: blur()`
`react-native-svg` has no filter primitive on either platform, so the four washes carry no
blur. Each is a `radial-gradient(closest-side, …)`, which already reaches zero alpha at its
own edge, and the app's `Wash` inserts an extra midpoint stop at `fade/2` with `opacity × 0.42`
to reproduce the falloff curve rather than a linear ramp. The residual difference is the
5–8 px of additional softening the canvas applies to a shape that is already soft-edged;
it is sub-perceptual against a `#131313` field. Logged in `DECISIONS.md` as D010.
