# Lesson Reader — pixel spec for frames "Lesson Scroll 1" … "Lesson Scroll 15"

Source of truth: `.uifinal/pretty/final/Email Login/Lesson-Scroll-<n>.html` (one CSS declaration per
line) cross-read against `.uifinal/final/Email Login/Lesson-Scroll-<n>.html` (raw). Every frame below
was read in full, line by line.

Two reading aids used throughout:

* **Pretty-print artefact.** In the pretty files each text node is printed with a leading `· `. That
  bullet is the printer's text-node marker, **not copy**. Verified against the raw files: e.g. raw
  frame 2 contains `>A journey of a thousand miles begins with a single step.<` with no bullet. Copy
  in this spec is transcribed from the **raw** files.
* **Measured layout.** The 15 raw frames were rendered in Chrome 151 on macOS (real `-apple-system`
  → SF Pro) at 393 px and every text/art box measured with `getBoundingClientRect()`. Those numbers
  appear in the per-frame tables as *canvas top* and *app top* = canvas − 54. They are the design's
  own rendered result, not estimates; the layout recipe (centred flex column) is still the normative
  thing to rebuild.

Canvas facts that hold for all 15 frames: the frame is `393 × 852`, and every `top` includes a 54px
status bar the app never builds. Both numbers are given everywhere.

---

## a. Frame inventory

| Frame | Page kind | Copy in one line | Owner in the app |
|---|---|---|---|
| Lesson Scroll 1 | **Cover** | WEEK I · RESET / Surviving the Night / 6 min + night-room scene + scroll chevron | `src/app/lesson/[slug].tsx` → `PageOpen`, art in `src/components/lesson/cover.tsx` |
| Lesson Scroll 2 | **Epigraph board** (serif) | "A journey of a thousand miles…" — LAO TZU | `src/components/lesson/pages.tsx` → `PageQuote` |
| Lesson Scroll 3 | **Mark + statement** | crescent + "You do not need to fix your life tonight." | `pages.tsx` → `PageTeach` (needs a statement-only slot) |
| Lesson Scroll 4 | **Prose pair** | two paragraphs, soft then ink | `pages.tsx` → `PageTeach` (needs a headline-less variant) |
| Lesson Scroll 5 | **Prose + mark + statement** | "Good. That gives us…" + sun dot + "For tonight, one decision is enough." | `pages.tsx` → `PageTeach` |
| Lesson Scroll 6 | **Statement + prose** | "Make the problem smaller" + body | `pages.tsx` → `PageTeach` |
| Lesson Scroll 7 | **Cascade** (graded) | Never again. / Ninety days. / The rest of your life. | *no component exists* — new `PageCascade` |
| Lesson Scroll 8 | **Prose pair** | "At midnight, those promises…" + "So do not carry it." | `pages.tsx` → `PageTeach` |
| Lesson Scroll 9 | **Mark + statement** | sunrise + "Get to tomorrow." | `pages.tsx` → `PageTeach` |
| Lesson Scroll 10 | **Statement + prose** | "What tonight requires" + body | `pages.tsx` → `PageTeach` |
| Lesson Scroll 11 | **Cascade + statement** | three "Not…" lines + "Just tonight." | new `PageCascade` |
| Lesson Scroll 12 | **Prose pair** | "Tomorrow, we can work…" + "Tonight, make sure…" | `pages.tsx` → `PageTeach` |
| Lesson Scroll 13 | **Statement + mark + prose** | "Think about the last night" + clock + body | `pages.tsx` → `PageTeach` |
| Lesson Scroll 14 | **Mark + prose** | bed-and-phone scene + body | `pages.tsx` → `PageTeach` |
| Lesson Scroll 15 | **Prose + cascade** (ink) | "There is usually an earlier moment…" + three "Before…" lines | new `PageCascade` |

The chrome (close, progress, grain, field) is owned by `FlowChrome` / `PaperGrain` in
`src/app/lesson/[slug].tsx` on every frame.

---

## b. Page grammar

### b.0 The frame itself (identical on all 15)

| Property | Value |
|---|---|
| width × height | `393px × 852px` |
| position / overflow | `relative` / `hidden` |
| background | `#F4F3F0` |
| font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` |
| font smoothing | `-webkit-font-smoothing:antialiased` |
| flex-shrink | `0` |
| box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` |

The box-shadow is the **design board's** card lift (it is on every screen in the bundle), not part of
the app screen. Do not build it.

**Grain layer** — first child of every frame:

| Property | Value |
|---|---|
| position | `absolute` |
| inset | `0` |
| background-image | `url('noise-dark.png')` |
| opacity | `0.07` |
| pointer-events | `none` |

### b.1 The centred body stack (all 15)

```
position:absolute; inset:0;
display:flex; flex-direction:column;
align-items:center; justify-content:center;
gap:48px;            /* 36px on frame 1 only */
padding:0 38px; box-sizing:border-box;
```

Consequences the rebuild must honour:

* The stack is centred in the **whole 852**, status bar included. There is **no absolute top** for any
  body content on any of these frames — vertical position is a function of how tall the stack is.
  In app space the stack occupies `0 … 852` of the canvas, i.e. it is centred on canvas y = 426,
  which is app y = 372 measured from the bottom of the status bar.
* Column content width ceiling = `393 − 38 − 38 = 317`. Every slot's own `max-width` (280/300/310)
  binds before the padding does.
* `gap` is uniform between *all* children, including the art slots.
* z-index: the stack is unpositioned in z (auto). Close and progress carry `z-index:5`, the status
  bar `z-index:20`, so chrome always paints over the body.

### b.2 Slot vocabulary

Every one of the 15 frames is the chrome plus a centred column built from these eight slots. No
other text style appears anywhere in frames 1–15.

#### EYEBROW (cover only)

| Property | Value |
|---|---|
| font-size / weight | `12px` / `600` |
| letter-spacing | `1.8px` |
| line-height | not set → browser normal (measured box height **15.00**) |
| text-align | `center` |
| colour | `#B0AEA8` |
| text-transform | **not set** — the copy is authored in caps |
| max-width | none |

#### TITLE (cover only)

| Property | Value |
|---|---|
| font-size / weight | `28px` / `500` |
| line-height | `40px` |
| text-align | `center` |
| colour | `#1D1C1A` |
| text-wrap | `balance` |
| max-width | `280px` |

#### META (cover only)

| Property | Value |
|---|---|
| font-size / weight | `15px` / `500` |
| line-height | normal (measured **18.00**) |
| text-align | `center` |
| colour | `#8B8882` |

#### SPACER (cover only)

Bare `<div style="height:14px">` and `<div style="height:10px">`, zero width, sitting as full children
of the `gap:36px` column. Effective separation across a spacer = `36 + h + 36`, i.e. **86px** for the
14 spacer and **82px** for the 10 spacer. This is the canvas's way of getting three different gaps
out of one `gap` value; a rebuild may express them as margins instead, as long as the resulting
separations are 86 and 82.

#### EPIGRAPH (frame 2 only)

| Property | Value |
|---|---|
| font-family | `'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif` |
| font-size / weight | `28px` / `500` |
| line-height | `44px` |
| text-align | `center` |
| colour | `#1D1C1A` |
| text-wrap | `balance` |
| max-width | `300px` |
| letter-spacing | not set (`normal`) |

There is **no** decorative quotation-mark glyph on the frame.

#### ATTRIBUTION ROW (frame 2 only)

```
display:flex; align-items:center; justify-content:center; gap:14px;
```

| Part | Value |
|---|---|
| rule (×2, one each side) | `width:22px; height:1.5px; background:#C9C7C0` |
| caps span | `font-size:12px; font-weight:600; letter-spacing:1.8px; color:#B0AEA8` (measured height 15.00) |
| row width, measured | `137.27px` for `LAO TZU` |

#### STATEMENT

| Property | Value |
|---|---|
| font-size / weight | `26px` / `500` |
| line-height | `38px` |
| text-align | `center` |
| colour | `#1D1C1A` |
| text-wrap | `balance` |
| max-width | `280px` on frame 3; `300px` on frames 5, 6, 9, 10, 11, 13 |

**Canvas contradiction.** Frame 3's statement carries `max-width:280px`; the six other statements all
carry `300px`. Everything else about the slot is identical. The evidence (6 frames against 1)
supports **300px** as the slot's value and frame 3 as the outlier; frame 3's copy — "You do not need
to fix your life tonight." — breaks to two lines at both widths, so adopting 300 changes nothing
visible on that frame. Build 300.

#### PROSE

| Property | Value |
|---|---|
| font-size / weight | `21px` / `400` |
| line-height | `36px` |
| text-align | `center` |
| text-wrap | `pretty` |
| max-width | `310px` |
| colour, soft | `#55534E` |
| colour, ink | `#1D1C1A` |

The two colours are a rhetorical pair, not a theme switch: the soft paragraph sets the situation, the
ink paragraph is the line the page exists to land (frames 4, 8, 12). Frames 5, 6, 10, 13, 14, 15 use
soft only.

#### CASCADE GROUP

```
display:flex; flex-direction:column; align-items:center; gap:26px;
```

Each line:

| Property | Value |
|---|---|
| font-size / weight | `22px` / `500` |
| line-height | `32px` |
| text-align | `center` |
| max-width | `300px` |
| text-wrap | `balance` |
| colour, **fading** ramp (frames 7, 11) | line 1 `#8B8882` · line 2 `#A5A29B` · line 3 `#BBB8B1` |
| colour, **solid** ramp (frame 15) | all three `#1D1C1A` |

The two ramps are semantic: the fading ramp is used for the promises the lesson is dismissing
(*Never again / Ninety days / The rest of your life*; *Not forever / Not for the next three months /
Not even for the rest of the week*), the solid ramp for the moments it wants you to keep (*Before the
search / Before the tab / Before you are fully caught in it*). Both ramps are exactly three lines on
every frame that uses them.

#### MARK (art)

Six distinct drawings across frames 1–15, all built from absolutely-positioned `div`s — **no SVG
anywhere in the body of these frames**. Full transcription in section (e).

| Mark | Frames | Box (w × h) |
|---|---|---|
| night-room scene | 1 | `270 × 224` (inner drawing `240 × 200`, scaled 1.12 from top centre) |
| sun dot, small | 2 | `12 × 12` |
| crescent | 3 | `34 × 30` |
| sun dot, large | 5 | `14 × 14` |
| sunrise over horizon | 9 | `240 × 96` |
| clock | 13 | `96 × 96` |
| bed with phone | 14 | `240 × 100` |

All marks carry `position:relative; flex-shrink:0` on their box.

---

## c. Per-frame table: kind, slots and exact copy

Copy is transcribed character for character from the **raw** frames. Only one HTML entity occurs in
frames 1–15 — `&middot;` on frame 1 — resolved below to the real character **·** (U+00B7 MIDDLE DOT).
There are no `&rsquo;`, `&mdash;`, `&ldquo;` or `&rdquo;` in this range; no apostrophes, dashes or
quotation marks appear in any of this copy.

Tops are measured; canvas value first, app value (canvas − 54) in brackets.

### Frame 1 — Cover · progress 4%

Column `gap:36px`, padding `0 38px`.

| Order | Slot | Canvas top (app top) | Height | Copy |
|---|---|---|---|---|
| 1 | EYEBROW | 175.50 (121.50) | 15.00 | `WEEK I · RESET` (raw: `WEEK I &middot; RESET`) |
| 2 | SPACER 14 | 226.50 (172.50) | 14.00 | — |
| 3 | TITLE | 276.50 (222.50) | 40.00 (one line) | `Surviving the Night` |
| 4 | SPACER 10 | 352.50 (298.50) | 10.00 | — |
| 5 | META | 398.50 (344.50) | 18.00 | `6 min` |
| 6 | MARK night-room | 452.50 (398.50) | 224.00 | — |

Bottom-of-frame chevron: see section (d).

### Frame 2 — Epigraph board · progress 8%

| Order | Slot | Canvas top (app top) | Height | Copy |
|---|---|---|---|---|
| 1 | MARK sun dot 12 | 298.50 (244.50) | 12.00 | — |
| 2 | EPIGRAPH | 358.50 (304.50) | 132.00 (3 × 44) | `A journey of a thousand miles begins with a single step.` |
| 3 | ATTRIBUTION | 538.50 (484.50) | 15.00 | `LAO TZU` |

### Frame 3 — Mark + statement · progress 12%

| Order | Slot | Canvas top (app top) | Height | Copy |
|---|---|---|---|---|
| 1 | MARK crescent | 349.00 (295.00) | 30.00 | — |
| 2 | STATEMENT (max-width 280) | 427.00 (373.00) | 76.00 (2 × 38) | `You do not need to fix your life tonight.` |

### Frame 4 — Prose pair · progress 15%

| Order | Slot | Canvas top (app top) | Height | Copy |
|---|---|---|---|---|
| 1 | PROSE soft | 294.00 (240.00) | 144.00 (4 × 36) | `Maybe you opened this after a relapse. Maybe the last few days have been bad. Maybe nothing dramatic happened at all.` |
| 2 | PROSE ink | 486.00 (432.00) | 72.00 | `You are simply tired of ending up in the same place.` |

### Frame 5 — Prose + mark + statement · progress 19%

| Order | Slot | Canvas top (app top) | Height | Copy |
|---|---|---|---|---|
| 1 | PROSE soft | 297.00 (243.00) | 72.00 | `Good. That gives us somewhere to start.` |
| 2 | MARK sun dot 14 | 417.00 (363.00) | 14.00 | — |
| 3 | STATEMENT | 479.00 (425.00) | 76.00 | `For tonight, one decision is enough.` |

### Frame 6 — Statement + prose · progress 23%

| Order | Slot | Canvas top (app top) | Height | Copy |
|---|---|---|---|---|
| 1 | STATEMENT | 347.00 (293.00) | 38.00 | `Make the problem smaller` |
| 2 | PROSE soft | 433.00 (379.00) | 72.00 | `The mind likes to turn quitting into an enormous promise.` |

### Frame 7 — Cascade, fading · progress 27%

Single child: the cascade group (top 352.00 / 298.00, height 148.00).

| Line | Canvas top (app top) | Colour | Copy |
|---|---|---|---|
| 1 | 352.00 (298.00) | `#8B8882` | `Never again.` |
| 2 | 410.00 (356.00) | `#A5A29B` | `Ninety days.` |
| 3 | 468.00 (414.00) | `#BBB8B1` | `The rest of your life.` |

### Frame 8 — Prose pair · progress 31%

| Order | Slot | Canvas top (app top) | Height | Copy |
|---|---|---|---|---|
| 1 | PROSE soft | 312.00 (258.00) | 144.00 | `At midnight, those promises are almost useless. They ask a tired version of you to carry a future that has not happened yet.` |
| 2 | PROSE ink | 504.00 (450.00) | 36.00 | `So do not carry it.` |

### Frame 9 — Mark + statement · progress 35%

| Order | Slot | Canvas top (app top) | Height | Copy |
|---|---|---|---|---|
| 1 | MARK sunrise | 335.00 (281.00) | 96.00 | — |
| 2 | STATEMENT | 479.00 (425.00) | 38.00 | `Get to tomorrow.` |

### Frame 10 — Statement + prose · progress 38%

| Order | Slot | Canvas top (app top) | Height | Copy |
|---|---|---|---|---|
| 1 | STATEMENT | 347.00 (293.00) | 38.00 | `What tonight requires` |
| 2 | PROSE soft | 433.00 (379.00) | 72.00 | `For the next few hours, the job is simple: do not relapse.` |

### Frame 11 — Cascade + statement · progress 42%

| Order | Slot | Canvas top (app top) | Height | Copy |
|---|---|---|---|---|
| 1 | CASCADE line 1 | 293.00 (239.00) | 32.00 | `Not forever.` (`#8B8882`) |
| 1 | CASCADE line 2 | 351.00 (297.00) | 32.00 | `Not for the next three months.` (`#A5A29B`) |
| 1 | CASCADE line 3 | 409.00 (355.00) | 64.00 (2 lines) | `Not even for the rest of the week.` (`#BBB8B1`) |
| 2 | STATEMENT | 521.00 (467.00) | 38.00 | `Just tonight.` |

### Frame 12 — Prose pair · progress 46%

| Order | Slot | Canvas top (app top) | Height | Copy |
|---|---|---|---|---|
| 1 | PROSE soft | 330.00 (276.00) | 72.00 | `Tomorrow, we can work on the habit itself.` |
| 2 | PROSE ink | 450.00 (396.00) | 72.00 | `Tonight, make sure it does not get another round.` |

### Frame 13 — Statement + mark + prose · progress 50%

| Order | Slot | Canvas top (app top) | Height | Copy |
|---|---|---|---|---|
| 1 | STATEMENT | 257.00 (203.00) | 38.00 | `Think about the last night` |
| 2 | MARK clock | 343.00 (289.00) | 96.00 | — |
| 3 | PROSE soft | 487.00 (433.00) | 108.00 (3 lines) | `Go back to the last time it happened at night. Where were you before the searching started?` |

### Frame 14 — Mark + prose · progress 54%

| Order | Slot | Canvas top (app top) | Height | Copy |
|---|---|---|---|---|
| 1 | MARK bed+phone | 262.00 (208.00) | 100.00 | — |
| 2 | PROSE soft | 410.00 (356.00) | 180.00 (5 lines) | `Maybe you were in bed with your phone. Maybe you could not sleep. Maybe you had a bad day and wanted something that would switch your head off for a while.` |

### Frame 15 — Prose + cascade, solid · progress 58%

| Order | Slot | Canvas top (app top) | Height | Copy |
|---|---|---|---|---|
| 1 | PROSE soft | 276.00 (222.00) | 72.00 | `There is usually an earlier moment when stopping is cheap.` |
| 2 | CASCADE line 1 | 396.00 (342.00) | 32.00 | `Before the search.` (`#1D1C1A`) |
| 2 | CASCADE line 2 | 454.00 (400.00) | 32.00 | `Before the tab.` (`#1D1C1A`) |
| 2 | CASCADE line 3 | 512.00 (458.00) | 64.00 (2 lines) | `Before you are fully caught in it.` (`#1D1C1A`) |

---

## d. Shared chrome

### Status bar (never built by the app)

`position:absolute; top:0; left:0; right:0; height:54px; display:flex; align-items:center;
justify-content:space-between; padding:6px 32px 0 46px; box-sizing:border-box; z-index:20`.
Time: `9:41`, `font-size:17px; font-weight:600; color:#1D1C1A; letter-spacing:-0.2px`. Right group
`display:flex; align-items:center; gap:7px` with three SVGs (bars 19×12, wifi 17×12, battery 27×13).
Transcribed in section (e) for completeness; **do not build any of it** — the app's own status bar
occupies this band.

### Close

| Property | Value |
|---|---|
| position | `absolute` |
| left | `16px` |
| top | `66px` canvas → **12px** app (from the bottom of the status bar) |
| font-size / weight | `17px` / `400` |
| colour | `#3A3934` |
| z-index | `5` |
| measured box | `left 16.00, top 66.00, w 42.97, h 20.00` |
| copy | `Close` |

There is no icon, no right-hand affordance and no back chevron on any of frames 1–15.

### Progress bar

| Property | Value |
|---|---|
| position | `absolute` |
| left / right | `16px` / `16px` (track width `361px`) |
| top | `108px` canvas → **54px** app |
| height | `2px` |
| border-radius | `1px` |
| track background | `rgba(0,0,0,0.05)` |
| z-index | `5` |
| fill | `position:absolute; left:0; top:0; bottom:0; width:<n>%; border-radius:1px; background:#B4B1AB` |

Fill percentage per frame — **transcribed verbatim**, and the derivation is exact:

| Frame | Fill | `round(n/26 × 100)` |
|---|---|---|
| 1 | `4%` | 3.85 → 4 |
| 2 | `8%` | 7.69 → 8 |
| 3 | `12%` | 11.54 → 12 |
| 4 | `15%` | 15.38 → 15 |
| 5 | `19%` | 19.23 → 19 |
| 6 | `23%` | 23.08 → 23 |
| 7 | `27%` | 26.92 → 27 |
| 8 | `31%` | 30.77 → 31 |
| 9 | `35%` | 34.62 → 35 |
| 10 | `38%` | 38.46 → 38 |
| 11 | `42%` | 42.31 → 42 |
| 12 | `46%` | 46.15 → 46 |
| 13 | `50%` | 50.00 → 50 |
| 14 | `54%` | 53.85 → 54 |
| 15 | `58%` | 57.69 → 58 |

Confirmed against the rest of the set: frames 16–26 read 62, 65, 69, 73, 77, 81, 85, 88, 92, 96,
**100** %. So the flow is **26 pages** and the bar is `(index + 1) / 26`. The bar is continuous — it
is never a dot row at any length.

### Scroll affordance

Frame 1 only:

```
position:absolute; left:0; right:0; bottom:42px;
display:flex; justify-content:center; z-index:5;
```

```svg
<svg width="22" height="12" viewBox="0 0 22 12">
  <path d="M2 2l9 8 9-8" fill="none" stroke="#B0AEA8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### What the chrome does **not** contain

No CTA pill, no "Continue"/"Begin" button, no dots, no header title, no right-hand action — on any of
frames 1–15. The only interactive-looking things on the frame are `Close` and (on the cover) the
chevron. The frame set is named "Lesson **Scroll**", and the chevron says the page advances by
scrolling/tapping rather than by a pinned button.

---

## e. Visualization — every drawing, transcribed

All body art is built from absolutely-positioned `div`s. Coordinates below are the drawing box's own
top-left origin, x → right, y → down, in CSS px at 1× (393-wide canvas). There are no `viewBox`es,
paths, gradients-with-IDs, clip-paths or masks in the body art **except** the one `mask` on the
crescent, noted below. The only SVG in these frames is the status bar and the cover chevron.

### e.1 Frame 1 — night room (the cover scene)

Outer box: `position:relative; width:270px; height:224px; flex-shrink:0`.

Transform wrapper:

```
position:absolute; left:50%; top:0; margin-left:-120px;
transform:scale(1.12); transform-origin:top center;
width:240px; height:200px;
```

Clipper (immediate child): `position:absolute; inset:0; overflow:hidden`. So the drawing is authored
in a **240 × 200** coordinate system, clipped to it, then scaled 1.12 from the top centre —
`240 × 1.12 = 268.8` wide and `200 × 1.12 = 224` tall, which is why the outer box is `270 × 224`.

Paint order (first = furthest back), all `position:absolute` inside the 240 × 200 box:

| # | Part | left | top | w | h | radius | fill / effect |
|---|---|---|---|---|---|---|---|
| 1 | floor | `-28` | `166` | `296` | `64` | `50% 50% 0 0 / 26px 26px 0 0` | `#EAE9E3` |
| 2 | window glow | `26` | `118` | `80` | `80` | `50%` | `radial-gradient(closest-side, rgba(203,218,232,0.24), rgba(203,218,232,0) 76%)`, `filter:blur(5px)` |
| 3 | window pane | `44` | `16` | `58` | `72` | `6px` | `linear-gradient(180deg, #12151B 0%, #1A2027 100%)`, `box-shadow:0 0 0 6px #E4E3DE, 0 5px 12px rgba(40,38,32,0.14)` |
| 4 | window mullion | `71` | `16` | `4` | `72` | — | `#E4E3DE` |
| 5 | window sill | `37` | `88` | `72` | `7` | `3px` | `#D6D5D0` |
| 6 | moon | `82` | `28` | `13` | `13` | `50%` | `#DCDED8`, `box-shadow:0 0 10px rgba(220,222,216,0.6)` |
| 7 | star a | `54` | `50` | `2.5` | `2.5` | `50%` | `rgba(244,243,240,0.6)` |
| 8 | star b | `62` | `68` | `2` | `2` | `50%` | `rgba(244,243,240,0.4)` |
| 9 | table shadow | `53` | `167` | `50` | `11` | `50%` | `rgba(0,0,0,0.08)`, `filter:blur(5px)` |
| 10 | table body | `56` | `136` | `44` | `28` | `5px` | `#E4E3DE` |
| 11 | drawer pull | `65` | `145` | `26` | `4` | `2px` | `#B4B1AB` |
| 12 | table leg L | `60` | `164` | `5` | `6` | — | `#C6C5C0` |
| 13 | table leg R | `91` | `164` | `5` | `6` | — | `#C6C5C0` |
| 14 | lamp glow | `62` | `98` | `32` | `32` | `50%` | `radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)`, `filter:blur(5px)` |
| 15 | lamp shade | `67` | `100` | `22` | `15` | `8px 8px 3px 3px` | `#E9D2A4` |
| 16 | lamp stem | `76.5` | `115` | `3` | `16` | — | `#C6C5C0` |
| 17 | lamp base | `70` | `131` | `16` | `5` | `2.5px` | `#C6C5C0` |
| 18 | bed shadow | `115` | `167` | `118` | `11` | `50%` | `rgba(0,0,0,0.09)`, `filter:blur(5px)` |
| 19 | headboard | `114` | `108` | `10` | `62` | `5px 5px 3px 3px` | `#D6D5D0` |
| 20 | mattress | `122` | `138` | `104` | `24` | `6px 10px 5px 5px` | `#E0DFDA` |
| 21 | duvet | `156` | `136` | `70` | `26` | `12px 12px 5px 4px` | `#C9C8C1` |
| 22 | duvet fold | `162` | `142` | `56` | `4` | `2px` | `rgba(255,255,255,0.55)` |
| 23 | pillow | `126` | `129` | `28` | `14` | `7px 7px 5px 5px` | `#FFFFFF`, `box-shadow:inset 0 -2.5px 0 #D6D5D0, 0 1.5px 3px rgba(40,38,32,0.14)` |
| 24 | bed foot L | `124` | `162` | `6` | `8` | `0 0 2px 2px` | `#C6C5C0` |
| 25 | bed foot R | `216` | `162` | `6` | `8` | `0 0 2px 2px` | `#C6C5C0` |
| 26 | star c | `212` | `40` | `2` | `2` | `50%` | `rgba(200,225,235,0.4)` |
| 27 | star d | `198` | `68` | `2` | `2` | `50%` | `rgba(200,225,235,0.3)` |

Edge cases: the floor (#1) is 296 wide against a 240 box and the clipper cuts it — the ellipse's left
and right ends must be **outside** the visible box, so the horizon reads as a straight-ish curve, not
a lens. The scale wrapper's origin is `top center`, so the drawing grows downward only; the box's
bottom edge is exactly the scaled drawing's bottom edge, no bleed.

### e.2 Frames 2 and 5 — the sun dot

Box: `position:relative; flex-shrink:0`; `12 × 12` on frame 2, `14 × 14` on frame 5.

| Part | Frame 2 | Frame 5 |
|---|---|---|
| halo | `left:-13px; top:-13px; width:38px; height:38px` | `left:-15.5px; top:-15.5px; width:45px; height:45px` |
| halo fill | `radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 76%)`, `border-radius:50%`, `filter:blur(3px)` | identical |
| disc | `position:absolute; inset:0; border-radius:50%` | identical |
| disc fill | `radial-gradient(circle at 34% 30%, #F3E3C4 0%, #E2BA78 58%, #C49856 100%)` | identical |
| disc shadow | `0 2px 6px rgba(160,120,50,0.3)` | identical |

The halo is centred on the disc in both cases: frame 2 `(38 − 12)/2 = 13`, frame 5
`(45 − 14)/2 = 15.5`.

### e.3 Frame 3 — the crescent

Box: `position:relative; width:34px; height:30px; flex-shrink:0`.

| Part | Value |
|---|---|
| disc | `position:absolute; left:0; top:2px; width:28px; height:28px; border-radius:50%; background:#C5C4BD` |
| disc mask | `-webkit-mask:radial-gradient(circle at 23px 9px, transparent 11px, #000 11.5px);` and `mask:` the same |
| companion dot | `position:absolute; right:0; top:0; width:3px; height:3px; border-radius:50%; background:#C6C5C0` |

The mask punches a circle of radius 11 centred at (23, 9) **in the disc's own 28 × 28 space**, with a
0.5px feather to 11.5 — that bite is what makes the crescent, and its centre sits outside the disc's
right edge, so the crescent opens up-and-right. React Native has no CSS mask: rebuild as an SVG
even-odd path or two circles with a `<Mask>` in `react-native-svg`, keeping r = 11 at (23, 9) and the
disc at r = 14 centred (14, 16) in a 34 × 30 box.

### e.4 Frame 9 — sunrise over a horizon

Box: `position:relative; width:240px; height:96px; flex-shrink:0`.

| # | Part | left | top | w | h | radius | fill / effect |
|---|---|---|---|---|---|---|---|
| 1 | halo | `70` | `8` | `100` | `100` | `50%` | `radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 76%)`, `filter:blur(4px)` |
| 2 | sun clipper | `96` | `56` | `48` | `24` | — | `overflow:hidden` |
| 2a | sun disc (inside clipper) | `0` | `0` | `48` | `48` | `50%` | `radial-gradient(circle at 40% 30%, #F3E3C4 0%, #E2BA78 58%, #C49856 100%)` |
| 3 | horizon line | `0` (`right:0`) | `79` | `240` | `1.5` | `1px` | `#D6D5D0` |
| 4 | tick left | `24` | `78` | `26` | `3.5` | `2px` | `#E4E3DE` |
| 5 | tick right | `192` | `78` | `20` | `3.5` | `2px` | `#E4E3DE` |

The clipper shows the **top half only** of a 48px disc (24 of 48), so the sun is a half-disc resting
on y = 80, one pixel under the horizon line at y = 79. The halo (100px, centred at x = 120, y = 58)
is deliberately off-centre relative to the sun (centred x = 120, y = 80) — it sits 22px higher, which
is what gives the glow its "rising" bias. The art box is 96 tall but the halo runs to y = 108: the
box does **not** clip it (`overflow` is not set), so the glow bleeds 12px past the bottom of the box
and into the 48px gap under it. Preserve that bleed.

### e.5 Frame 13 — the clock

Box: `position:relative; width:96px; height:96px; flex-shrink:0`.

| # | Part | left | top | w | h | radius | fill / effect |
|---|---|---|---|---|---|---|---|
| 1 | face | `inset:0` | | `96` | `96` | `50%` | `#FFFFFF`, `box-shadow:inset 0 0 0 2.5px #E4E2DB, 0 8px 20px rgba(40,38,32,0.1)` |
| 2 | tick 12 | `46.75` | `8` | `2.5` | `7` | `1px` | `#C9C7C0` |
| 3 | tick 6 | `46.75` | `81` | `2.5` | `7` | `1px` | `#C9C7C0` |
| 4 | tick 9 | `8` | `46.75` | `7` | `2.5` | `1px` | `#C9C7C0` |
| 5 | tick 3 | `81` | `46.75` | `7` | `2.5` | `1px` | `#C9C7C0` |
| 6 | minute hand | `46.5` | `20` | `3` | `28` | `1.5px` | `#1D1C1A` |
| 7 | hour hand | `46.5` | `28` | `3` | `20` | `1.5px` | `#1D1C1A`, `transform:rotate(-52deg); transform-origin:50% 100%` |
| 8 | pin | `44` | `44` | `8` | `8` | `50%` | `#1D1C1A` |

Both hands end at y = 48, i.e. the face centre (48, 48), and the hour hand pivots about that point.
`-52deg` from vertical is 1.733 hours counter-clockwise of 12, so the clock reads **a little after
ten** with the minute hand straight up. Only four ticks are drawn — 12, 3, 6, 9. Note the half-pixel
offsets (`46.75`, `46.5`) are intentional optical centring of 2.5 and 3px bars in a 96 box; keep them.

### e.6 Frame 14 — bed with a phone

Box: `position:relative; width:240px; height:100px; flex-shrink:0`.

| # | Part | left | top | w | h | radius | fill / effect |
|---|---|---|---|---|---|---|---|
| 1 | bed shadow | `56` | `81` | `130` | `11` | `50%` | `rgba(0,0,0,0.08)`, `filter:blur(5px)` |
| 2 | headboard | `52` | `20` | `10` | `64` | `5px 5px 3px 3px` | `#D6D5D0` |
| 3 | mattress | `60` | `52` | `110` | `24` | `6px 10px 5px 5px` | `#E0DFDA` |
| 4 | duvet | `96` | `50` | `74` | `26` | `12px 12px 5px 4px` | `#C9C8C1` |
| 5 | duvet fold | `102` | `56` | `58` | `4` | `2px` | `rgba(255,255,255,0.55)` |
| 6 | pillow | `64` | `43` | `28` | `14` | `7px 7px 5px 5px` | `#FFFFFF`, `box-shadow:inset 0 -2.5px 0 #D6D5D0, 0 1.5px 3px rgba(40,38,32,0.14)` |
| 7 | bed foot L | `62` | `76` | `6` | `8` | `0 0 2px 2px` | `#C6C5C0` |
| 8 | bed foot R | `162` | `76` | `6` | `8` | `0 0 2px 2px` | `#C6C5C0` |
| 9 | phone glow | `118` | `14` | `44` | `44` | `50%` | `radial-gradient(closest-side, rgba(203,218,232,0.5), rgba(203,218,232,0) 74%)`, `filter:blur(4px)` |
| 10 | phone | `132` | `26` | `14` | `22` | `3px` | `linear-gradient(180deg, #12151B 0%, #1A2027 100%)`, `box-shadow:0 0 8px rgba(190,210,230,0.35)`, `transform:rotate(8deg)` |

This is the **same bed** as frame 1's, shifted and slightly resized — the shared primitive is worth
extracting. Frame 1: headboard at (114, 108) 10 × 62, mattress 104 × 24, duvet 70 × 26, pillow at
(126, 129). Frame 14: headboard at (52, 20) 10 × **64**, mattress **110** × 24, duvet **74** × 26,
pillow at (64, 43). Same radii, same fills, same shadow recipe throughout; the phone is frame 1's
window pane gradient at 14 × 22 with a cool glow instead of a paper ring.

### e.7 Status bar SVGs (reference only — not built)

```svg
<svg width="19" height="12" viewBox="0 0 19 12">
  <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill="#1D1C1A"></rect>
  <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill="#1D1C1A"></rect>
  <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill="#1D1C1A"></rect>
  <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill="#1D1C1A"></rect>
</svg>
```

```svg
<svg width="17" height="12" viewBox="0 0 17 12">
  <path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill="#1D1C1A"></path>
  <path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill="#1D1C1A"></path>
  <circle cx="8.5" cy="10.5" r="1.5" fill="#1D1C1A"></circle>
</svg>
```

```svg
<svg width="27" height="13" viewBox="0 0 27 13">
  <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="#1D1C1A" stroke-opacity="0.35" fill="none"></rect>
  <rect x="2" y="2" width="20" height="9" rx="2" fill="#1D1C1A"></rect>
  <path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill="#1D1C1A" fill-opacity="0.4"></path>
</svg>
```

---

## f. Comparison against the current app

Middle column read from `src/app/lesson/[slug].tsx`, `src/components/lesson/pages.tsx`,
`src/components/lesson/cover.tsx`, `src/components/lesson/marks.tsx`, `src/lib/theme.ts`,
`src/lib/lessonArt.ts`. Nothing here is guessed.

### f.1 Frame and chrome

| Property | Design | Current app | Verdict |
|---|---|---|---|
| Field colour | `#F4F3F0` | `colors.bg = '#F4F3F0'` (`[slug].tsx:574`) | match |
| Grain | `noise-dark.png`, `opacity 0.07`, full bleed | `PaperGrain`, `noiseDark`, `opacity: 0.07`, full bleed (`[slug].tsx:168-177`) | match |
| Close copy / size / weight / colour | `Close`, 17, 400, `#3A3934` | `Close`, `fontSize: 17`, `sans('400')`, `#3A3934` (`[slug].tsx:105`) | match |
| Close position | left 16, top 66 canvas → **12** app | `paddingHorizontal: 16`, 44-high row, text vertically centred → 12 from the top of chrome | match |
| Close hit target | n/a (static frame) | 60 × 44 with `hitSlop={10}` | match (design silent) |
| Progress shape | continuous bar, always | dot row when `total <= 17`, else a 180-wide bar (`[slug].tsx:109-125`) | **MISMATCH** |
| Progress geometry | left 16, right 16 (361 wide), height **2**, radius 1, top **54** app | dots 7 tall (active 22 wide), centred, `marginTop: 6` under a 44 row → top **50** app | **MISMATCH** |
| Progress track colour | `rgba(0,0,0,0.05)` | `rgba(0,0,0,0.18)` | **MISMATCH** |
| Progress fill colour | `#B4B1AB` | `#131313` | **MISMATCH** |
| Progress value | `round((index+1)/26 × 100)` % of a 26-page flow | `((index + 1) / total) * 100` where `total = steps.length` (variable, branch-dependent) | **MISMATCH** (formula right, denominator floats) |
| CTA pill | **none on frames 1–15** | `FlowCta` on every non-`ask` step: 52 tall, radius 26, `#131313`, label 17/600, ls 0.2, white | **MISMATCH** |
| Scroll chevron (cover) | 22 × 12, `d="M2 2l9 8 9-8"`, `#B0AEA8`, 2.4 round | absent | **MISMATCH** (missing) |
| Right-hand chrome | none | none | match |
| Body vertical model | flex column centred in the full 852 | fixed `paddingTop` per page kind (`322 − 54 − 57` teach, `236 − 54 − 57` cover, …) inside a `ScrollView` | **MISMATCH** |
| Body horizontal padding | `0 38px` on the column | per-slot `paddingHorizontal` 30 / 44 (`PageTeach`) | **MISMATCH** |
| Inter-slot gap | `48px` uniform (36 on cover) | `marginTop: 22` headline→body, `marginTop: 8` body→mark | **MISMATCH** |

### f.2 Cover (frame 1) vs `PageOpen` + `LessonCover`

| Property | Design | Current app | Verdict |
|---|---|---|---|
| Order | eyebrow → title → meta → **art** | **art (medallion)** → eyebrow → title → meta (`[slug].tsx:208-225`) | **MISMATCH** |
| Art | 270 × 224 night-room scene (window, lamp, bed, moon, stars) | `LessonCover size={128}` — a circular medallion of three domes, ringed `0 0 0 1.5px rgba(0,0,0,0.2), 0 0 0 6px #F4F3F0, 0 0 0 7.5px rgba(0,0,0,0.14), 0 16px 32px rgba(40,38,32,0.22)` | **MISMATCH** |
| Eyebrow copy | `WEEK I · RESET` (caps, from the canvas) | `weekHeading(week)` → `Week I · <world.sub>` — **mixed case**, world name not "Reset" | **MISMATCH** |
| Eyebrow size / weight | 12 / 600 | 12.5 / 600 | **MISMATCH** |
| Eyebrow letter-spacing | `1.8px` | none set | **MISMATCH** |
| Eyebrow colour | `#B0AEA8` | `#8B8882` | **MISMATCH** |
| Title size / weight | 28 / 500 | 28 / 500 | match |
| Title line-height | `40` | `36` | **MISMATCH** |
| Title width control | `max-width: 280` + `text-wrap: balance` | `paddingHorizontal: 30` (→ 333 wide on a 393 screen) | **MISMATCH** |
| Title colour | `#1D1C1A` | `#1D1C1A` | match |
| Meta copy | `6 min` | `` `${estimatedMinutes ?? 4} min` `` | match in shape |
| Meta size / weight | 15 / 500 | 15 / 500 | match |
| Meta colour | `#8B8882` | `#55534E` | **MISMATCH** |
| Separations | eyebrow→title **86**, title→meta **82**, meta→art **36** | medallion→eyebrow `marginTop: 70`, eyebrow→title 15, title→meta 20 | **MISMATCH** |
| Entrance motion | none authored on the frame | `FadeInDown` 280ms on the cover, `FadeInUp` delay 90 / 300ms on the text | design silent — keep |

### f.3 Epigraph board (frame 2) vs `PageQuote`

| Property | Design | Current app | Verdict |
|---|---|---|---|
| Chrome | Close **and** progress present, at 8% | `PageQuote` renders with **no** chrome; the player swaps in a back chevron (`[slug].tsx:472-482, 190-204`) | **MISMATCH** |
| Mark above the quote | sun dot 12 × 12 with halo, gap 48 | none | **MISMATCH** (missing) |
| Decorative `"` glyph | **absent** | `&ldquo;` at 56/56 in `rgba(29,28,26,0.18)`, then `marginTop: -30` on the quote (`pages.tsx:115-120`) | **MISMATCH** |
| Quote face | `'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif` | `fonts.quote` = Georgia (iOS) | **MISMATCH** (Iowan Old Style is the canvas's first choice and ships on iOS) |
| Quote size / weight | 28 / 500 | 23 / default | **MISMATCH** |
| Quote line-height | `44` | `35` | **MISMATCH** |
| Quote letter-spacing | not set | `-0.2` | **MISMATCH** |
| Quote width | `max-width: 300` | `paddingHorizontal: 36` (→ 321) | **MISMATCH** |
| Quote colour | `#1D1C1A` | `#1D1C1A` | match |
| Attribution rules | 22 × 1.5, `#C9C7C0`, row gap 14 | 26 × 1.5, `rgba(0,0,0,0.22)`, row gap 12 | **MISMATCH** |
| Attribution text | 12 / 600 / `1.8px` / `#B0AEA8`, authored in caps | 14 / 600 / `1.5` / `#8B8882`, `.toUpperCase()` | **MISMATCH** |
| Stack gap | `48` between mark, quote and attribution | `gap: 26` | **MISMATCH** |
| Advance | (frame is static; no pill, no chevron) | whole page is a `Pressable` → next | plausible — keep |

### f.4 Body pages (frames 3–15) vs `PageTeach`

| Property | Design | Current app | Verdict |
|---|---|---|---|
| Statement size / weight | 26 / 500 | headline 24 / 500 (`pages.tsx:52`) | **MISMATCH** |
| Statement line-height | `38` | `32` | **MISMATCH** |
| Statement width | `max-width: 300` (280 on frame 3) | `paddingHorizontal: 30` → 333 | **MISMATCH** |
| Statement colour | `#1D1C1A` | `#1D1C1A` | match |
| Prose size / weight | 21 / 400 | body 16.5 / 400 (`pages.tsx:55`) | **MISMATCH** |
| Prose line-height | `36` | `26` | **MISMATCH** |
| Prose width | `max-width: 310` | `paddingHorizontal: 44` → 305 | close, still **MISMATCH** |
| Prose soft colour | `#55534E` | `#55534E` | match |
| Prose ink colour (2nd paragraph) | `#1D1C1A` | no such slot — a teach page has one body | **MISMATCH** (missing) |
| Headline-less page | frames 4, 8, 12, 14 have no statement at all | `PageTeach` always renders `page.headline` | **MISMATCH** |
| Statement-only page | frames 3, 9 (mark + statement, no prose) | `PageTeach` always renders `page.body` | **MISMATCH** |
| Slot order | prose-then-statement occurs (frames 5, 15); statement-then-prose occurs (6, 10, 13) | fixed headline → body → mark | **MISMATCH** |
| Mark vocabulary | crescent, sun dot, sunrise, clock, bed+phone — object drawings tied to the copy | `LessonMark` line glyphs (`crest`/`scales`/`rings`/`fork`/`rise`/`horizon`/`links`/`gate`) chosen by `markFor(seed)` — rotation, not meaning | **MISMATCH** |
| Mark size | 12–96 tall, per drawing | fixed 84-tall band, `stroke rgba(29,28,26,0.28)`, width 2.4, ink dot r 5.5 | **MISMATCH** |
| Mark position | any slot in the column (top on 3, 9, 14; middle on 5, 13) | always last, after the body | **MISMATCH** |
| Mark caption | none anywhere in 1–15 | `CREST_CAPTION` = "You are here — near the crest." under the `crest` mark | **MISMATCH** |
| Cascade lines (22/500/32, gap 26, 3 colours) | frames 7, 11, 15 | nothing renders this | **MISMATCH** (missing) |
| `text-wrap: balance` / `pretty` | on every text slot | RN has no equivalent | not buildable — approximate with the design's `max-width` values, which is what actually controls the wrap on a 393 frame |
| Bullet / ordered lists | none in 1–15 | `page.list` rendering in `PageTeach` | design silent for this range — leave |

### f.5 Type tokens

| Token | Design need | `src/lib/theme.ts` | Verdict |
|---|---|---|---|
| Body face | SF Pro Text via `-apple-system` | `sansFamily` → `'System'` on iOS | match |
| Weights used | 400, 500, 600 | `sans('400' \| '500' \| '600')` | match |
| Serif for the epigraph | Iowan Old Style → Palatino → Georgia | `fonts.quote` = `Georgia` on iOS, `serif` on Android | **MISMATCH** |
| Ink | `#1D1C1A` | `colors.text` | match |
| Muted prose | `#55534E` | `colors.textMuted` | match |
| Soft caps / cascade line 1 | `#8B8882` | `colors.textSoft` | match |
| Eyebrow / attribution / chevron | `#B0AEA8` | not a token (`colors.textSofter` is `#B4B1AB`) | **MISMATCH** — `#B0AEA8` is a new value |
| Progress fill | `#B4B1AB` | `colors.textSofter` = `#B4B1AB` | match (reuse the token) |
| Cascade line 2 / line 3 | `#A5A29B` / `#BBB8B1` | not tokens | **MISMATCH** — two new values |
| Attribution rule | `#C9C7C0` | not a token (`colors.track` is `#C6C5C0`) | **MISMATCH** — new value |
| Close ink | `#3A3934` | not a token; hard-coded in `[slug].tsx:105` | matches by literal |

---

## g. What must change, in order

1. **`src/app/lesson/[slug].tsx` → `FlowChrome`.** Replace the dot row / 180-wide bar with the
   canvas's hairline: a full-width track `marginHorizontal: 16`, `height: 2`, `borderRadius: 1`,
   `backgroundColor: 'rgba(0,0,0,0.05)'`, holding a fill of `width: '<pct>%'`, `borderRadius: 1`,
   `backgroundColor: '#B4B1AB'`. Position it so its top lands **54** below the status bar (the Close
   row is 44 and the text sits at 12; add `marginTop: 10` under the row instead of the current 6, and
   drop the 7-high dot band). Delete the `dots` branch and the `total <= 17` threshold.
2. **`src/app/lesson/[slug].tsx` → remove `FlowCta` from the reader pages.** Frames 1–15 carry no
   pill. Keep a pill only where a later frame in the set actually draws one (frames 16–26 are outside
   this spec — confirm there before deleting the component outright), and add the cover's scroll
   chevron instead: absolute, `left: 0, right: 0, bottom: 42`, centred, `Svg 22 × 12` viewBox
   `0 0 22 12`, path `M2 2l9 8 9-8`, `stroke="#B0AEA8"`, `strokeWidth={2.4}`, round cap and join.
3. **`src/components/lesson/pages.tsx` → new layout primitive `LessonStack`.** A `View` with
   `flex: 1`, `alignItems: 'center'`, `justifyContent: 'center'`, `gap: 48`, `paddingHorizontal: 38`,
   filling the whole screen **including** the area behind the chrome (the canvas centres on the full
   852). Every body page becomes a list of slots inside it. This replaces the per-page
   `paddingTop: <canvas> − 54 − CHROME_H` arithmetic and the `CTA_CLEAR*` bottom padding.
4. **`src/components/lesson/pages.tsx` → slot components.** `Statement` (26/500/38, `#1D1C1A`,
   `maxWidth: 300`), `Prose` (21/400/36, `maxWidth: 310`, tone `soft = #55534E` | `ink = #1D1C1A`),
   `Cascade` (column, `gap: 26`, lines 22/500/32, `maxWidth: 300`, ramp `fading` =
   `#8B8882` / `#A5A29B` / `#BBB8B1` or `solid` = all `#1D1C1A`). Drive them from an ordered slot
   list so prose can precede a statement (frames 5, 15) as well as follow it (6, 10, 13).
5. **`src/components/lesson/pages.tsx` → `PageTeach`.** Make `headline` and `body` independently
   optional and render through the slot list; drop `paddingHorizontal: 30 / 44` in favour of the
   `maxWidth` values; drop the automatic `LessonMark` tail.
6. **`src/components/lesson/marks.tsx` → add the six canvas drawings** (`sun-dot` at 12 and 14,
   `crescent`, `sunrise`, `clock`, `bed-phone`) transcribed from section (e), and stop selecting a
   mark with `markFor(seed)` — the canvas ties each drawing to its page. Build the crescent's
   `radial-gradient` mask as an SVG mask/even-odd path (r 11 at (23, 9) against a disc r 14 at
   (14, 16) in a 34 × 30 box); RN cannot do the CSS `mask` property. Drop `CREST_CAPTION` from these
   pages.
7. **`src/components/lesson/cover.tsx` → the night-room scene.** Add a `LessonCoverScene` at
   `270 × 224` built exactly as section (e.1): author it in a 240 × 200 space, wrap in
   `transform: [{ scale: 1.12 }]` from the top centre (RN needs an explicit
   `translateY` compensation or a pre-scaled transcription, since RN scales about the centre), and
   clip with `overflow: 'hidden'`. The circular medallion stays available for other screens but is
   not what this cover shows.
8. **`src/app/lesson/[slug].tsx` → `PageOpen`.** Reorder to eyebrow → title → meta → scene.
   Eyebrow 12/600, `letterSpacing: 1.8`, `#B0AEA8`, **uppercase** (`weekEyebrow(week)` in
   `src/lib/lessonArt.ts` already returns caps — use it in place of `weekHeading`, or add a
   Roman-numeral caps variant to match `WEEK I · RESET`). Title line-height 36 → **40**,
   `paddingHorizontal: 30` → `maxWidth: 280`. Meta colour `#55534E` → `#8B8882`. Separations
   86 / 82 / 36.
9. **`src/components/lesson/pages.tsx` → `PageQuote`.** Restore the chrome (the frame keeps Close and
   the progress bar), delete the `&ldquo;` glyph and its `marginTop: -30`, add the 12 × 12 sun dot
   above at gap 48, set the quote to 28/500/44 with `maxWidth: 300` and no letter-spacing, and set the
   attribution to rules 22 × 1.5 `#C9C7C0`, gap 14, caps 12/600/`1.8`/`#B0AEA8`.
10. **`src/lib/theme.ts`.** Add the four values the canvas introduces and the app has no token for:
    `#B0AEA8` (eyebrow / attribution / chevron), `#A5A29B` and `#BBB8B1` (cascade ramp), `#C9C7C0`
    (attribution rule). Add `'Iowan Old Style'` ahead of Palatino/Georgia in `fonts.quote` for iOS.
    Do **not** re-point `colors.textSofter` (`#B4B1AB`) — the progress fill legitimately reuses it.
11. **`src/lib/types.ts` (follow-on).** Frames 4, 8, 12, 14, 15 and 7, 11 cannot be expressed by
    `ITeachPage` (headline + body + optional list). Either add an ordered `slots` array to the teach
    page or add a `cascade` page kind; without it the reader can render the design's typography but
    not its page shapes.
