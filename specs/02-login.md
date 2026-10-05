# 02 · Login

* **Design frame** `Email-Login/Login` — `.vicifull/final/Email-Login/Login.html` (canvas note `02 · Login`)
* **Diff since the last drop** `.vicifull/fdiff/Login.diff` — 293 lines
* **App files** `src/app/(auth)/sign-in.tsx` + `src/components/auth/kit.tsx` (`AuthDoor`, `AuthNightField`, `AuthMark`)
* **Frame** 393 × 852, `background: linear-gradient(180deg, #131313 0%, #1D1C1A 55%, #2E2C29 100%)`

The board turned around in this drop. The previous bundle drew it on warm paper
(`#F4F3F0`) under a 240 × 190 envelope-and-letter mark; this one drops the envelope
entirely, puts the board on `01 · Splash`'s night field, and hangs the laurel over it.
**Every colour on the board inverted** and the mark was replaced — nothing about the old
composition survives except the geometry of the controls, which did not move by a pixel.

The bundle also adds `03 · Welcome Back`, the same composition with four strings changed.
The two are one component (`AuthDoor`) with a `variant`; see `specs/03-welcome-back.md`.

Design y values below are the canvas's; the app's y is **design y − 54** (D009).

## Field — identical on both doors

| Element | Declaration |
| --- | --- |
| frame | `linear-gradient(180deg, #131313 0%, #1D1C1A 55%, #2E2C29 100%)`, `font-family: -apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif`, `-webkit-font-smoothing: antialiased` |
| art layer | `position:absolute; inset:0; overflow:hidden; pointer-events:none` |
| warm wash | `left:82 top:120 230×230 radius:50%` · `radial-gradient(closest-side, rgba(226,190,140,0.13), rgba(226,190,140,0) 72%)` · `blur(6px)` |
| low wash | `left:-60 top:620 420×260 radius:50%` · `radial-gradient(closest-side, rgba(120,115,105,0.14), rgba(120,115,105,0) 72%)` · `blur(8px)` |
| star 1 | `left:96 top:110 2×2 radius:50% rgba(160,155,145,0.25)` |
| star 2 | `left:318 top:168 2×2 rgba(160,155,145,0.20)` |
| star 3 | `left:256 top:96 2×2 rgba(160,155,145,0.18)` |
| star 4 | `left:44 top:236 2×2 rgba(160,155,145,0.16)` |

`rgb(226,190,140)` = `#E2BE8C`, `rgb(120,115,105)` = `#787369`, `rgb(160,155,145)` = `#A09B91`.
No grain: unlike `01 · Splash` (0.10) and the funnel (0.12), neither door draws a noise layer.

The field paints under the status bar, so those y's are **not** reduced by 54. The low
wash is anchored to the bottom edge in the app (design `top:620` + 260 tall in an 852
frame → `bottom: -28`) so it stays with the edge on a taller screen (D026).

## The mark — 150 × 150, centred

Container `left:50%; top:170px; width:150px; height:150px; margin-left:-75px`. Offsets below
are relative to that box; the box has no `overflow:hidden`, so the wash overflows it.

| # | Part | Declaration |
| --- | --- | --- |
| 1 | halo | `left:50% top:50% 190×190 margin:-95px 0 0 -95px radius:50%` · `radial-gradient(closest-side, rgba(226,186,120,0.16), rgba(226,186,120,0) 72%)` · `blur(5px)` |
| 2 | laurel | `<img src="laurel-mark.webp" alt="VICI" width=96 height=96>` · `left:50% top:50% margin:-48px 0 0 -48px` · `opacity:0.95` · `filter: brightness(0) invert(1)` |

`rgb(226,186,120)` = `#E2BA78` — a warmer amber than the field's wash, and a different value.

**The `<img>` has no `object-fit`.** The asset is 280 × 252, so the browser stretches it into
the 96 × 96 box and the laurel on this frame is 11% taller than its own aspect. The app
therefore uses `contentFit="fill"`; `contain` draws a 96 × 86 mark the frame does not.

## The board

| # | Element | Declaration |
| --- | --- | --- |
| 1 | title | `left:24 top:380` · 27px/600 · `letter-spacing:-0.2px` · `#F4F3F0` · "Welcome to VICI." |
| 2 | subtitle | `left:24 top:420` · 14.5px/400 · `rgba(244,243,240,0.5)` · "Sign in or create an account to keep your plan and progress." |
| 3 | Apple pill | `left:24 right:24 top:472 height:54 radius:27` · `background:#F4F3F0` · flex row, centred, `gap:9` · `cursor:pointer` |
| 3a | Apple glyph | `viewBox="0 0 384 512"` 15 × 18, `fill:#131313` |
| 3b | Apple label | 16px/600 · `#131313` · "Continue with Apple" |
| 4 | Google pill | `left:24 right:24 top:538 height:54 radius:27` · `background:rgba(244,243,240,0.08)` · `box-shadow: 0 0 0 1px rgba(244,243,240,0.2)` · flex row, centred, `gap:10` · `cursor:pointer` |
| 4a | Google glyph | `viewBox="0 0 48 48"` 17 × 17, the four-path mark, `#EA4335 #4285F4 #FBBC05 #34A853` |
| 4b | Google label | 16px/600 · `#F4F3F0` · "Continue with Google" |
| 5 | divider row | `left:24 right:24 top:614` · flex row, centred, `gap:14` |
| 5a | rules | `flex:1; height:1px; background:rgba(244,243,240,0.14)` (one either side) |
| 5b | "or" | 12.5px/500 · `rgba(244,243,240,0.4)` |
| 6 | email row | `left:24 right:24 top:642 height:56 radius:16 box-sizing:border-box` · `background:rgba(244,243,240,0.06)` · `box-shadow: 0 0 0 1px rgba(244,243,240,0.16)` · flex row, `gap:12`, `padding: 0 8px 0 20px` |
| 6a | label | `flex:1` · 16.5px/400 · `rgba(244,243,240,0.45)` · "Continue with email" |
| 6b | arrow button | `40×40 radius:50% background:#F4F3F0` · `flex-shrink:0` · `cursor:pointer` |
| 6c | arrow | `viewBox="0 0 16 14"` 15 × 13 · `M1.5 7h12M9 2.5L13.5 7 9 11.5` · `stroke:#131313` `stroke-width:2` round caps and joins |
| 7 | footer | `left:0 right:0 top:740 text-align:center` · 13.5px/400 · `rgba(244,243,240,0.5)` · "Already have an account? " + `<span>` 600 `#F4F3F0` `cursor:pointer` "Sign in" |
| 8 | legal | `left:0 right:0 top:818 text-align:center` · 12px · `rgba(244,243,240,0.35)` · `Terms &nbsp;·&nbsp; Privacy` |

The email row's label is static grey with no caret: the board where an address is typed
(`Login Typing`) was withdrawn a drop ago and has not come back.

## What the controls do

`cursor:pointer` is on both pills, the arrow button and the footer `<span>` — and on nothing
else. The legal line carries none, is one run in one colour, and is drawn as the caption it
is (D013; D021 for why that reading does not generalise past this board).

The canvas gives no destinations, but `03 · Welcome Back` now answers the question D011 had
to answer from the labels alone:

* **Continue with email** → `/(auth)/sign-up?step=form`. The subtitle frames this board as
  "Sign in **or create an account**" and the footer sends people who already have one
  elsewhere, so this is the create path. It opens sign-up's *form*, not its gate, because
  the gate is the same Apple / Google / email choice just made. Unchanged from D011.
* **Already have an account? Sign in** → `/(auth)/welcome-back`. D011 sent this to the app's
  own address step because the bundle drew no returning-user board. It draws one now, its
  copy is "Sign in to pick up where you left off", and it is frame #3 — directly after this
  one. The address step moved with it and now opens from that board's email row.

## Comparison — design vs `AuthDoor variant="new"`

Verified numerically: `.vicifull/sig/auth-d-login.txt` vs `.vicifull/sig/auth-a-login.txt`.
34 design rows, 0 missing, 0 positional or type differences. The eight reported rows are the
two washes and the mark halo reporting no `border-radius` (SVG, D015/D010), the four stars
and the arrow button reporting `1px`/`20px` where the canvas writes `50%` on the same box,
and the mark's `<Svg>` counting twice against one `<div>`. Pixel-differenced against the
frame at 2×, the whole board is within 1/255 of the canvas outside the status bar and home
indicator, which the app does not draw (D009).

Two things the first pass got wrong and the comparison caught:

* **`text-wrap`.** `AppText` asks for `text-wrap: pretty` on web; the frame states none, so
  Chrome wraps normally. `pretty` rebalanced the last two lines and pushed "and" off line
  one. The subtitle now overrides it back to `wrap` — a web-only property, so nothing
  changes on device, where the box already wrapped like the frame.
* **The footer's box.** The canvas's footer is one full-width centred `<div>`; the app had
  the text shrink-wrapped inside a centred press target, which put the same glyphs on the
  same centre axis in a 208-wide box. `alignSelf:'stretch'` makes the text box the frame's
  own 393 (D022 in reverse).

## Pass 2 — the SSO refusal line, and the gap the canvas leaves empty

The canvas draws nothing between the email row (bottom edge design 698) and the footer
(design 740) — 42pt of empty board. The app has to say something there when Apple or Google
sign-in fails, and pass 1 anchored that line at design 704 with no box around it. The refusal
the mock build returns ("Apple & Google sign-in need the online build. Use email for now.")
wraps to two lines at 13/19, so it ran 704 → 742 and its second line overlapped
"Already have an account? Sign in" at 740 by two points. Measured from the capture's own
signature, not by eye.

The slot is now the gap itself — `top: 644, height: 42` under the safe area, the line centred in
it — so the two-line refusal measures **700 → 738**, two points clear of the email row above and
two clear of the footer below. The box paints nothing, so it adds one unpainted extra row to the
signature and changes no drawn number.

Re-verified against `Login.html` at 2× after the change, with a block-mean diff excluding only
the D009 chrome: **0 of 19,208 8 × 8 blocks over 3/255, worst 2.8/255**; 34 design rows, 0
missing, 8 differing and all 8 D015 radius-notation.
