# 03 · Welcome Back

* **Design frame** `Email-Login/Welcome-Back` — `.vicifull/final/Email-Login/Welcome-Back.html`
* **Status** ADDED — new in `Latest Vici FULL`, no counterpart in any previous drop
* **App files** `src/app/(auth)/welcome-back.tsx` + `src/components/auth/kit.tsx` (`AuthDoor`)
* **Frame** 393 × 852, `background: linear-gradient(180deg, #131313 0%, #1D1C1A 55%, #2E2C29 100%)`

The returning-user door, and frame #3 — directly after `02 · Login`, which is where its
footer link comes from.

## What differs from `02 · Login`

The two frames are byte-for-byte the same composition apart from four strings. Every
offset, colour, radius, shadow, font size, weight, tracking and SVG path is identical, and
the field and the mark are stated with the same numbers. See `specs/02-login.md` for the
full transcription; only the differences are listed here.

| # | Element | `02 · Login` | `03 · Welcome Back` |
| --- | --- | --- | --- |
| 1 | title (`left:24 top:380`, 27px/600, `-0.2px`, `#F4F3F0`) | "Welcome to VICI." | "Welcome back." |
| 2 | subtitle (`left:24 top:420`, 14.5px/400, `rgba(244,243,240,0.5)`) | "Sign in or create an account to keep your plan and progress." | "Sign in to pick up where you left off." |
| 6a | email row label (16.5px/400, `rgba(244,243,240,0.45)`) | "Continue with email" | "Sign in with email" |
| 7 | footer (`top:740`, 13.5px/400) | "Already have an account? " + **Sign in** | "New here? " + **Create an account** |

The footer's plain run and its `<span>` are separated by one ordinary space in both frames,
and the `<span>` is 600 weight, `#F4F3F0`, `cursor:pointer` in both.

The subtitle is one line here, so the `text-wrap` correction that `02 · Login` needed has
no effect on this board — it is applied by the shared component either way.

## What the controls do

* **Continue with Apple / Continue with Google** → the same SSO calls as the login board.
* **Sign in with email** → the address step, which lives on this route. That step, the
  password step and the code step have no frame in this bundle — `Login Typing` was
  withdrawn a drop ago — so they keep their composition and take the night dress the funnel
  states on `04 · V3 Q24 Name`.
* **New here? Create an account** → back to `02 · Login`. `router.back()` where this board
  was pushed from there, and a `replace` into `/(auth)/sign-in` where it was opened cold.

The canvas draws no Back row on either door, and this one does not need one: its footer
link is the way back to the board it came from.

## Comparison — design vs `AuthDoor variant="returning"`

Verified numerically: `.vicifull/sig/auth-d-wb.txt` vs `.vicifull/sig/auth-a-wb.txt`. 34
design rows, 0 missing, 0 positional or type differences; the eight reported rows are the
same `border-radius` and `<Svg>`-count equivalences `02 · Login` reports, for the same
reasons. Pixel-differenced at 2×, the board is within 1/255 of the frame outside the status
bar and home indicator (D009).

## Pass 2 — verified on the path the bundle designs, not at its URL

The pass-1 numbers above were taken at `/welcome-back`. That is the path that **cannot** show
this board's one real defect. Pushed from `02 · Login`'s footer link — the way the bundle draws
the flow — it was losing all three radial washes to a duplicate SVG gradient id under the
`display: none` login board (D130). The signature was clean throughout: every box at its stated
offset, only the paint gone.

Re-measured on the pushed path after the fix, with a block-mean diff that excludes **only** the
D009 status bar and home indicator — no flatness test, no gradient exclusion (F35):

| path | blocks ≥ 3/255 (8 × 8, of 19,208) | worst block |
| --- | --- | --- |
| pushed from `02 · Login` — before | 2,650 | 48.3/255 |
| pushed from `02 · Login` — after | 0 | 2.8/255 |
| `/welcome-back` direct — after | 0 | 2.8/255 |

Wash samples on the pushed board, canvas coordinates: 196,235 reads 74,63,48 against the frame's
72,61,47 (it read 24,23,22 before); 150,760 reads 51,49,45 against 52,49,46; the mark's halo at
196,196 reads 45,40,34 against 44,40,34.

The capture recipe is `.vicifull/recipes/auth.json`, and the audit entry for this frame drives the
pushed path deliberately.
