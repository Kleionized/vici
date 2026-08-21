# 02 · Login

* **Design frame** `Email-Login/Login` — `.uifinal1/final/Email-Login/Login.html` (canvas note `02 · Login`)
* **App file** `src/app/(auth)/sign-in.tsx` (`mode === 'email'` board) + `src/components/auth/kit.tsx` (`EnvelopeMark`, `PaperAuthGlow`)
* **Frame** 393 × 852, `background: #F4F3F0`

New in this drop. It replaces the two frames the previous bundle had here — `Login Empty`
and `Login Typing` — with a single landing board. Design y values below are the canvas's;
the app's y is **design y − 54** (D009).

## Field

| Element | Declaration |
| --- | --- |
| frame | `background: #F4F3F0`, `font-family: -apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif`, `-webkit-font-smoothing: antialiased` |
| art layer | `position:absolute; inset:0; overflow:hidden; pointer-events:none` |
| top wash | `left:-15%; top:-190px; width:130%; height:300px; border-radius:50%` · `radial-gradient(closest-side, rgba(180,170,150,0.40), rgba(180,170,150,0.12) 55%, rgba(180,170,150,0) 75%)` · `filter: blur(5px)` |
| bottom wash | `left:-60px; top:620px; width:420px; height:260px` · `radial-gradient(closest-side, rgba(180,170,150,0.22), rgba(180,170,150,0) 72%)` · `filter: blur(8px)` |

`rgb(180,170,150)` = `#B4AA96`.

## The envelope mark — 240 × 190, centred

Container: `left:50%; top:150px; width:240px; height:190px; margin-left:-120px`, with an inner
`position:absolute; inset:0; overflow:hidden` clip. **All offsets below are relative to that
240 × 190 box**, and the box is 40 wider and 20 taller than the 200 × 170 block the previous
bundle used — the whole mark is redrawn, not nudged.

| # | Part | Declaration |
| --- | --- | --- |
| 1 | warm bloom | `left:70 top:20 130×130 radius:50%` · `radial-gradient(closest-side, rgba(226,186,120,0.40), rgba(226,186,120,0) 74%)` · `blur(4px)` |
| 2 | moon, back | `left:34 top:10 30×30 radius:50% background:#DCDED8` |
| 3 | moon, front | `left:26 top:4 30×30 radius:50% background:#F4F3F0` |
| 4 | star R | `left:216 top:26 2×2 radius:50% background:rgba(200,225,235,0.4)` |
| 5 | star L | `left:14 top:64 2×2 radius:50% background:rgba(200,225,235,0.3)` |
| 6 | letter page | `left:76 top:34 104×80 radius:5px background:#FFFFFF` · `box-shadow: 0 0 0 1px rgba(0,0,0,0.06)` |
| 7 | rule 1 | `left:90 top:50 50×5 radius:3px background:#E0DFDA` |
| 8 | rule 2 | `left:90 top:63 66×5 radius:3px #E0DFDA` |
| 9 | rule 3 | `left:90 top:76 42×5 radius:3px #E0DFDA` |
| 10 | envelope body | `left:52 top:92 152×76 radius:8px background:#E4E3DE` |
| 11 | envelope face | `left:58 top:98 140×64 radius:5px` · `linear-gradient(180deg, #F0EFEA, #E9E7E0)` |
| 12 | flap | `<svg width=140 height=42 viewBox="0 0 140 42">` at `left:58 top:98` · `<path d="M2 2 L70 40 L138 2" fill=none stroke=#D6D5D0 stroke-width=2 stroke-linejoin=round>` |
| 13 | seal | `left:119 top:128 18×18 radius:50% background:#E9D2A4` |
| 14 | seal ring | `left:124 top:133 8×8 radius:50%` · `box-shadow: inset 0 0 0 1.5px rgba(122,103,67,0.45)` |
| 15 | ground shadow | `left:44 top:172 168×13 radius:50% background:rgba(0,0,0,0.10)` · `blur(5px)` |

`rgb(226,186,120)` = `#E2BA78`. `rgb(200,225,235)` = `#C8E1EB`. `rgb(122,103,67)` = `#7A6743`.

Changes from the mark the app currently draws: the block grows 200×170 → 240×190; the
rotated 72×72 tile behind the page is **gone**, replaced by the two overlapping 30×30 moon
discs at top-left; two 2×2 stars are added; the signature squiggle on the page is **gone**;
the envelope gains a separate `#E4E3DE` body behind a gradient face; the flap becomes a
stroked chevron rather than two rotated bars; the seal moves and shrinks 22 → 18 (ring 10 → 8).

## Type and controls

| y (design) | y (app) | Element | Declaration |
| --- | --- | --- | --- |
| 380 | 326 | title | `left:24` · `font-size:27px; font-weight:600; letter-spacing:-0.2px; color:#1D1C1A` · **"Welcome to VICI."** |
| 420 | 366 | subtitle | `left:24` · `font-size:14.5px; font-weight:400; color:#8B8882` · **"Sign in or create an account to keep your plan and progress."** |
| 472 | 418 | Apple pill | `left:24 right:24 height:54 border-radius:27px background:#131313` · flex row, `align-items:center; justify-content:center; gap:9px; cursor:pointer` |
| — | — | ↳ mark | `<svg width=15 height=18 viewBox="0 0 384 512">`, `fill:#FFFFFF` |
| — | — | ↳ label | `font-size:16px; font-weight:600; color:#FFFFFF` · "Continue with Apple" |
| 538 | 484 | Google pill | `left:24 right:24 height:54 radius:27px background:#FFFFFF` · `box-shadow: 0 0 0 1px rgba(0,0,0,0.12)` · `gap:10px` |
| — | — | ↳ mark | `<svg width=17 height=17 viewBox="0 0 48 48">` — four paths `#EA4335 #4285F4 #FBBC05 #34A853` |
| — | — | ↳ label | `font-size:16px; font-weight:600; color:#1D1C1A` · "Continue with Google" |
| 614 | 560 | or-rule | `left:24 right:24` flex row `align-items:center; gap:14px`; two `flex:1; height:1px; background:rgba(0,0,0,0.1)` rules around `font-size:12.5px; font-weight:500; color:#8B8882` · "or" |
| 642 | 588 | email row | `left:24 right:24 height:56 box-sizing:border-box radius:16px background:#FFFFFF` · `box-shadow: 0 0 0 1px rgba(0,0,0,0.09)` · flex row `align-items:center; gap:12px; padding:0 8px 0 20px` |
| — | — | ↳ label | `flex:1; font-size:16.5px; font-weight:400; color:rgba(90,88,82,0.5)` · "Continue with email" |
| — | — | ↳ button | `40×40 radius:50% background:#131313`, centred, `flex-shrink:0; cursor:pointer` |
| — | — | ↳ arrow | `<svg width=15 height=13 viewBox="0 0 16 14">` · `d="M1.5 7h12M9 2.5L13.5 7 9 11.5" stroke=#FFFFFF stroke-width=2 fill=none stroke-linecap=round stroke-linejoin=round` |
| 740 | 686 | account row | `left:0 right:0; text-align:center; font-size:13.5px; font-weight:400; color:#8B8882` · "Already have an account? " + `<span font-weight:600 color:#1D1C1A cursor:pointer>` **"Sign in"** |
| 818 | 764 | legal | `left:0 right:0; text-align:center; font-size:12px; color:#8B8882` · "Terms &nbsp;·&nbsp; Privacy" |

No `line-height` is declared anywhere on this frame, so every run uses the platform default
for its size. No `text-transform`, no `max-lines`, no truncation. The status-bar glyphs here
are `#1D1C1A` (the dark variant) rather than the splash's `#F4F3F0`.

## States and motion

The frame draws one state. `cursor:pointer` marks four hit targets: the Apple pill, the Google
pill, the 40 × 40 arrow button, and the "Sign in" span. No pressed, disabled, loading, focus or
error styling is drawn, and no transition, animation or keyframe appears anywhere in the frame.
The app's existing press feedback (`PressScale`, 0.97 at 120 ms) and its error/notice line are
behaviour and stay.

## Comparison — design vs the board as it stood

| Property | Design | App before | Result |
| --- | --- | --- | --- |
| field colour | `#F4F3F0` | `colors.bg` = `#F4F3F0` | match |
| top wash box | −15%, −190, 130% × 300 | `Ellipse cx="50%" cy={-40} rx="65%" ry={150}` | match |
| top wash stops | .40 → .12 @55% → 0 @75% | same three stops, `#B4AA96` | match |
| bottom wash | −60, 620, 420 × 260, .22 → 0 @72% | `cx=150 cy=750 rx=210 ry=130`, .22 → 0 @72% | match |
| mark block | 240 × 190 at design y 150, centred | 200 × 170 at app y 96 | **mismatch** |
| mark contents | 15 parts (above) | 13 parts, different geometry | **mismatch** |
| title text | "Welcome to VICI." | "Welcome back." | **mismatch** |
| title metrics | 27 / 600 / −0.2 / `#1D1C1A` | 27 / 600 / −0.2 / `colors.text` `#1D1C1A` | match |
| title y | 326 | 326 | match |
| subtitle text | "Sign in or create an account to keep your plan and progress." | "Sign in to keep the run going." | **mismatch** |
| subtitle metrics | 14.5 / 400 / `#8B8882` | 14.5 / 400 / `colors.textSoft` `#8B8882` | match |
| subtitle y | 366 | 366 | match |
| Apple pill | y 418, 54 h, r 27, `#131313`, gap 9 | identical | match |
| Apple mark | 15 × 18, `#FFFFFF` | identical | match |
| Apple label | 16 / 600 / `#FFFFFF` | identical | match |
| Google pill | y 484, 54 h, r 27, `#FFFFFF`, ring `rgba(0,0,0,0.12)`, gap 10 | identical | match |
| Google label | 16 / 600 / `#1D1C1A` | identical | match |
| or-rule | y 560, gap 14, 1px `rgba(0,0,0,0.1)`, 12.5 / 500 / `#8B8882` | identical | match |
| email row box | y 588, 56 h, r 16, `#FFFFFF`, ring `rgba(0,0,0,0.09)`, gap 12, pad `0 8 0 20` | identical | match |
| email row content | static label "Continue with email" at 16.5 / 400 / `rgba(90,88,82,0.5)` | live `TextInput` placeholder `yourname@email.com` at 16.5 | **mismatch** |
| arrow button | 40 × 40, r 20, `#131313` | identical | match |
| arrow path | `M1.5 7h12M9 2.5L13.5 7 9 11.5`, 15 × 13 / `0 0 16 14`, 2px round | identical | match |
| account row | y 686, centred, 13.5 / 400 `#8B8882` + 600 `#1D1C1A` "Sign in" | "New here? **Create an account**" | **mismatch** (copy + destination) |
| legal line | y 764, centred, 12 / `#8B8882`, "Terms · Privacy" | absent | **mismatch** (missing) |
| typing board | not drawn in this bundle | present | see note |

## Resolutions

**The email row is a button, not a field.** The canvas draws a static grey label, not a caret
or a value, and the previous bundle's `Login Typing` frame — the board where an address is
actually typed — has been withdrawn. The app still has to collect an address, so the row
becomes a control that opens the typing board, and the typing board keeps the implementation
it already has. That is the only reading that changes the look to what is drawn without
inventing a screen the bundle does not contain (`DECISIONS.md` D011).

**"Already have an account? Sign in".** The board is now the shared entry for both new and
returning users — its own subtitle says "Sign in or create an account", and `Create Account` was
withdrawn from the bundle. In the app this board *is* `(auth)/sign-in`, so the link routes to
the password step for an address already on file rather than to a separate screen (D011).

**"Terms · Privacy" is added**, replacing nothing — the board previously ended at the account row.

## Numeric verification — 2026-08-21

Both the served design frame and the running app were measured with the same probe
(`getBoundingClientRect` plus computed paint properties, in frame coordinates). Every box on
the board agrees to 0.1 px and every type run agrees on size, weight, tracking and colour:

| Element | Design x/y/w/h | App x/y/w/h |
| --- | --- | --- |
| mark block | 76.5, 150, 240 × 190 | 76.5, 150, 240 × 190 |
| bloom | 146.5, 170, 130 × 130 | 146.5, 170, 130 × 130 |
| moon back / front | 110.5, 160, 30 × 30 · 102.5, 154, 30 × 30 | identical |
| star R / L | 292.5, 176, 2 × 2 · 90.5, 214, 2 × 2 | identical |
| page | 152.5, 184, 104 × 80 | identical |
| rules | 166.5 at y 200 / 213 / 226, w 50 / 66 / 42, h 5 | identical |
| envelope body | 128.5, 242, 152 × 76 | identical |
| envelope face | 134.5, 248, 140 × 64 | identical |
| flap path | 136.5, 250, 136 × 38 | identical |
| seal / ring | 195.5, 278, 18 × 18 · 200.5, 283, 8 × 8 | identical |
| ground shadow | 120.5, 322, 168 × 13 | identical |
| title | 24, 380, 205.8 × 31.5 · 27px/600/−0.2px/rgb(29,28,26) | identical |
| subtitle | 24, 420, 369 × 34 · 14.5px/400/normal/rgb(139,136,130) | identical — wraps to the same two lines |
| Apple pill / mark / label | 24, 472, 345 × 54 · 108, 490, 15 × 18 · 132, 489.5, 153.1 × 19 | identical |
| Google pill / mark / label | 24, 538, 345 × 54 · 101.6, 556.5, 17 × 17 · 128.6, 555.5, 162.8 × 19 | identical |
| or-rule / "or" | 24, 620.8, 152.3 × 1 · 190.3, 614, 12.4 × 14.5 · 216.7, 620.8, 152.3 × 1 | identical |
| email row / label / button / arrow | 24, 642, 345 × 56 · 44, 660.3, 265 × 19.5 · 321, 650, 40 × 40 · 333.5, 663.5, 15 × 13 | identical |
| account row / "Sign in" span | 0, 740, 393 × 16 · 256.4, 740, 44.2 × 16 | identical |
| legal | 0, 818, 393 × 14 · 12px/400/rgb(139,136,130) | identical |

The app carries one extra box the design does not: a zero-height container at 24, 704 that
holds the error/notice line. It is the app's own feedback slot, has no height when empty, and
displaces nothing.

**Status: implemented, numerically verified.**
