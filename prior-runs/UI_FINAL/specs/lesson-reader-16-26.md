# Spec — the lesson reader, frames Lesson Scroll 16 → 26

Source frames (all read line by line, in full):

| Frame | Pretty file | Raw file |
| --- | --- | --- |
| Lesson Scroll 16 | `.uifinal/pretty/final/Email Login/Lesson-Scroll-16.html` | `.uifinal/final/Email Login/Lesson-Scroll-16.html` |
| Lesson Scroll 17 | `.uifinal/pretty/final/Email Login/Lesson-Scroll-17.html` | `.uifinal/final/Email Login/Lesson-Scroll-17.html` |
| Lesson Scroll 18 | `.uifinal/pretty/final/Email Login/Lesson-Scroll-18.html` | `.uifinal/final/Email Login/Lesson-Scroll-18.html` |
| Lesson Scroll 19 | `.uifinal/pretty/final/Email Login/Lesson-Scroll-19.html` | `.uifinal/final/Email Login/Lesson-Scroll-19.html` |
| Lesson Scroll 20 | `.uifinal/pretty/final/Email Login/Lesson-Scroll-20.html` | `.uifinal/final/Email Login/Lesson-Scroll-20.html` |
| Lesson Scroll 21 | `.uifinal/pretty/final/Email Login/Lesson-Scroll-21.html` | `.uifinal/final/Email Login/Lesson-Scroll-21.html` |
| Lesson Scroll 22 | `.uifinal/pretty/final/Email Login/Lesson-Scroll-22.html` | `.uifinal/final/Email Login/Lesson-Scroll-22.html` |
| Lesson Scroll 23 | `.uifinal/pretty/final/Email Login/Lesson-Scroll-23.html` | `.uifinal/final/Email Login/Lesson-Scroll-23.html` |
| Lesson Scroll 24 | `.uifinal/pretty/final/Email Login/Lesson-Scroll-24.html` | `.uifinal/final/Email Login/Lesson-Scroll-24.html` |
| Lesson Scroll 25 | `.uifinal/pretty/final/Email Login/Lesson-Scroll-25.html` | `.uifinal/final/Email Login/Lesson-Scroll-25.html` |
| Lesson Scroll 26 | `.uifinal/pretty/final/Email Login/Lesson-Scroll-26.html` | `.uifinal/final/Email Login/Lesson-Scroll-26.html` |

App files read in full: `src/app/lesson/[slug].tsx`, `src/components/lesson/pages.tsx`,
`src/components/lesson/scenes.tsx`, `src/components/lesson/marks.tsx`,
`src/components/lesson/cover.tsx`, `src/components/ChallengeSheet.tsx`, `src/lib/theme.ts`,
`src/lib/types.ts`.

### Reading conventions used throughout

* Every frame is a `393px × 852px` `position:relative; overflow:hidden` div. Its declared
  `top` values include the 54px status-bar band the app never builds, so every offset is
  given as **canvas → (canvas − 54)**.
* The pretty-printer prefixes each text node with `· `. That bullet is **not** copy. Verified
  against the raw files: `…letter-spacing:-0.2px;">9:41</span>` in
  `.uifinal/final/Email Login/Lesson-Scroll-17.html` carries no bullet. Every quoted string
  below is the raw text.
* HTML entities are resolved to real characters and flagged where they occur.
* The frame's own `box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)`
  is the design tool's device-card shadow. It is **not** app chrome and must not be built.

---

## a. Frame inventory

| Frame | Page kind (this spec's name) | App component that should own it |
| --- | --- | --- |
| Lesson Scroll 16 | **Pick-one question board** | `PagePick` in `src/components/lesson/pages.tsx` (the non-pair branch) |
| Lesson Scroll 17 | **Prose board** — title + muted body + emphasis body | `PageTeach` in `src/components/lesson/pages.tsx` |
| Lesson Scroll 18 | **Art board** — full 340 × 200 scene + muted body | `PageTeach` + a new `BedroomScene` in `src/components/lesson/scenes.tsx` |
| Lesson Scroll 19 | **Prose board** — muted body + emphasis body, no title | `PageTeach` |
| Lesson Scroll 20 | **Prose board** — title + muted body | `PageTeach` |
| Lesson Scroll 21 | **Fading-stack board** — three lines, three greys | new `PageStack` in `src/components/lesson/pages.tsx` |
| Lesson Scroll 22 | **Glyph board** — 34 × 30 crescent above title + muted body | `PageTeach` (mark **above**, not below) + `CrescentGlyph` in `scenes.tsx` |
| Lesson Scroll 23 | **Task board (scene)** — eyebrow, title, scaled scene, body, done-rule card | new `PageTask` in `src/components/lesson/pages.tsx` |
| Lesson Scroll 24 | **Task board (options)** — eyebrow, title, four icon + label + note rows | new `PageTaskOptions` in `src/components/lesson/pages.tsx` |
| Lesson Scroll 25 | **Maxim board** — 12px orb, serif maxim, ruled attribution | `PageQuote` in `src/components/lesson/pages.tsx` |
| Lesson Scroll 26 | **Completion board** — 36px orb, title, body, `Done` pill | `PageComplete` in `src/app/lesson/[slug].tsx` |

Seven distinct page kinds across eleven frames: pick-one question board, prose board,
art board, fading-stack board, glyph board, task board (two layouts), maxim board,
completion board.

---

## b. Page grammar

### b.0 The frame itself (identical on all eleven)

| Property | Value |
| --- | --- |
| width / height | `393px` / `852px` |
| position / overflow | `relative` / `hidden` |
| background | `#F4F3F0` |
| font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` |
| font smoothing | `-webkit-font-smoothing:antialiased` |
| flex-shrink | `0` |
| grain overlay | `position:absolute; inset:0; background-image:url('noise-dark.png'); opacity:0.07; pointer-events:none` |

The grain is the **first** child, so it paints under everything.

### b.1 The centred content container — the rule that governs every frame

Nine of eleven frames declare exactly:

```
position:absolute;
inset:0;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
gap:<per frame>;
padding:0 38px;
box-sizing:border-box;
```

`inset:0` means the stack is centred over **all 852px — the status-bar band and the
Close/progress chrome included**. It is not centred in the space below the chrome, and it
is not centred in the space above the CTA. There are no `top` values on the body of these
pages at all; position is entirely a consequence of centring.

Content width inside the 38px padding: `393 − 38 − 38 = 317px`.

| Frame | container | gap | padding | note |
| --- | --- | --- | --- | --- |
| 16 | `inset:0` | `40px` | `0 38px` | plus an 18px spacer div (see b.2) |
| 17 | `inset:0` | `48px` | `0 38px` | |
| 18 | `inset:0` | `48px` | `0 38px` | |
| 19 | `inset:0` | `48px` | `0 38px` | |
| 20 | `inset:0` | `48px` | `0 38px` | |
| 21 | `inset:0` | `48px` | `0 38px` | one child, itself a column with `gap:26px` |
| 22 | `inset:0` | `48px` | `0 38px` | |
| 23 | `inset:0` | `30px` | `0 38px` | plus a 16px spacer div |
| 24 | `left:0; right:0; top:126px; bottom:56px` | `28px` | `0 32px` | **the one frame that is not `inset:0`** |
| 25 | `inset:0` | `48px` | `0 38px` | |
| 26 | `inset:0` | `44px` | `0 38px` | |

Frame 24 is the exception: its container runs `top:126px` (→ **72** after the status bar)
to `bottom:56px`, with a 32px gutter (content width `393 − 64 = 329px`) and `gap:28px`.
It still centres its stack inside that box.

### b.2 Type ramp

Every declaration below is verbatim. No size, weight, line-height or colour is rounded or
substituted.

| Role | font-family | weight | size | line-height | letter-spacing | align | colour | max-width | text-wrap | Frames |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Title** | inherited sans | `500` | `26px` | `38px` | — | `center` | `#1D1C1A` | `300px` | `balance` | 17, 20, 22, 26 |
| Title (wide) | inherited sans | `500` | `26px` | `38px` | — | `center` | `#1D1C1A` | `310px` | `balance` | 16 |
| Title (task) | inherited sans | `500` | `26px` | `38px` | — | `center` | `#1D1C1A` | `300px` | `balance` | 23 |
| Title (task, widest) | inherited sans | `500` | `26px` | `38px` | — | `center` | `#1D1C1A` | `320px` | `balance` | 24 |
| **Body, muted** | inherited sans | `400` | `21px` | `36px` | — | `center` | `#55534E` | `310px` | `pretty` | 17, 18, 19, 20, 22, 23, 26 |
| **Body, emphasis** | inherited sans | `400` | `21px` | `36px` | — | `center` | `#1D1C1A` | `310px` | `pretty` | 17, 19 |
| **Helper** | inherited sans | `500` | `15px` | — (normal) | — | `center` | `#8B8882` | — | — | 16 |
| **Eyebrow** | inherited sans | `600` | `12px` | — (normal) | `1.8px` | `center` | `#B0AEA8` | — | — | 23, 24 |
| **Maxim** | `'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif` | `500` | `28px` | `44px` | — | `center` | `#1D1C1A` | `300px` | `balance` | 25 |
| **Attribution** | inherited sans | `600` | `12px` | — (normal) | `1.8px` | — | `#B0AEA8` | — | — | 25 |
| **Stack line 1** | inherited sans | `500` | `22px` | `32px` | — | `center` | `#8B8882` | `300px` | `balance` | 21 |
| **Stack line 2** | inherited sans | `500` | `22px` | `32px` | — | `center` | `#A5A29B` | `300px` | `balance` | 21 |
| **Stack line 3** | inherited sans | `500` | `22px` | `32px` | — | `center` | `#BBB8B1` | `300px` | `balance` | 21 |
| **Option label (pick)** | inherited sans | `600` selected / `500` unselected | `16px` | — (normal) | — | left | `#1D1C1A` (both states) | — | — | 16 |
| **Rule-card text** | inherited sans | `500` | `15px` | `22px` | — | `left` | `#55534E` | — | `pretty` | 23 |
| **Option title (task)** | inherited sans | `600` | `16px` | `22px` | — | left | `#1D1C1A` | — | — | 24 |
| **Option note (task)** | inherited sans | `400` | `13px` | `19px` | — | left | `#767370` | — | `pretty` | 24 |
| **CTA label** | inherited sans | `600` | `17px` | — (normal) | `0.2px` | `center` | `#FFFFFF` | — | — | 16, 26 |
| **Close** | inherited sans | `400` | `17px` | — (normal) | — | left | `#3A3934` | — | — | all |
| **Status clock** | inherited sans | `600` | `17px` | — (normal) | `-0.2px` | left | `#1D1C1A` | — | — | all |

`text-wrap: balance` / `pretty` have no React Native equivalent. Transcribe them as the
stated `maxWidth` plus `textAlign:'center'`; where a specific break matters, break the
string by hand.

### b.3 Colour inventory (exact, with token status)

| Hex / rgba | Used for | `src/lib/theme.ts` token |
| --- | --- | --- |
| `#F4F3F0` | frame background | `colors.bg` ✅ |
| `#FFFFFF` | option cards, rule card, task icon tiles, CTA label | `colors.surface` ✅ |
| `#1D1C1A` | titles, option labels, emphasis body, selected ring, radio fill, status icons | `colors.text` ✅ |
| `#3A3934` | Close label, task icon strokes | no token — literal |
| `#55534E` | muted body, rule-card text | `colors.textMuted` ✅ |
| `#767370` | task option note (frame 24) | **no token** — literal |
| `#8B8882` | helper (16), stack line 1 | `colors.textSoft` ✅ |
| `#A5A29B` | stack line 2 | **no token** — literal |
| `#B0AEA8` | eyebrow, attribution | **no token** (`textSofter` is `#B4B1AB` — do **not** substitute) |
| `#B4B1AB` | progress-bar fill | `colors.textSofter` ✅ |
| `#BBB8B1` | stack line 3 | **no token** — literal |
| `#C9C7C0` | unselected radio ring, attribution rules | **no token** (`colors.track` is `#C6C5C0` — do **not** substitute) |
| `#E4E2DB` | unselected option-card inset ring | **no token** — literal |
| `#131313` | CTA pill fill | `colors.ink` ✅ |
| `rgba(0,0,0,0.05)` | progress track | **no token** (`colors.hairline` is `rgba(0,0,0,0.06)` — do **not** substitute) |
| `rgba(0,0,0,0.07)` | rule-card hairline ring | no token — literal |
| `rgba(0,0,0,0.08)` | task icon-tile hairline ring | no token — literal |
| `rgba(40,38,32,0.08)` | selected option-card drop | no token — literal |
| `rgba(40,38,32,0.06)` | task icon-tile drop | no token — literal |
| `rgba(40,38,32,0.05)` | rule-card drop | no token — literal |

Art-only colours are listed in section e.

### b.4 Pick-one question board (frame 16)

Stack, top to bottom, inside the `gap:40px` column:

1. Title — 26/500/38, `max-width:310px`, `text-wrap:balance`, `#1D1C1A`
2. **Spacer** `<div style="height:18px">` — an empty box, so title→helper spacing is
   `40 + 18 + 40 = 98px`
3. Helper — 15/500, `#8B8882`, centred
4. Option column — `display:flex; flex-direction:column; gap:12px; align-self:stretch`
   (stretch → `317px` wide)

Option row, both states:

| Property | Selected | Unselected |
| --- | --- | --- |
| height | `56px` | `56px` |
| border-radius | `16px` (all four corners) | `16px` |
| background | `#FFFFFF` | `#FFFFFF` |
| box-shadow | `0 0 0 2px #1D1C1A, 0 4px 10px rgba(40,38,32,0.08)` — an **outer** 2px ring plus a drop | `inset 0 0 0 1.5px #E4E2DB` — an **inset** hairline, no drop |
| display / align | `flex` / `center` | `flex` / `center` |
| padding | `0 18px` | `0 18px` |
| gap | `14px` | `14px` |
| label weight | `600` | `500` |
| label size / colour | `16px` / `#1D1C1A` | `16px` / `#1D1C1A` |

Radio, both states:

| Property | Selected | Unselected |
| --- | --- | --- |
| width / height | `22px` / `22px` | `22px` / `22px` |
| border-radius | `50%` | `50%` |
| flex-shrink | `0` | `0` |
| border | `2px solid #1D1C1A` with `box-sizing:border-box` | none |
| box-shadow | none | `inset 0 0 0 1.6px #C9C7C0` |
| background | `radial-gradient(circle, #1D1C1A 0 5px, rgba(0,0,0,0) 5.5px)` — a hard-edged 5px-radius ink dot, feathering to nothing over 0.5px | none |

Note the asymmetry the canvas actually declares: the selected ring is a real `border`
(2px, inside the 22px box because of `border-box`), the unselected ring is a 1.6px inset
shadow. Both read as a 22px circle.

Frame 16 is the only body frame among the eleven that also carries a CTA (see section d).

### b.5 Prose board (frames 17, 19, 20)

A `gap:48px` centred column of one to three text blocks. All three variants use the same
two type roles:

| Frame | Stack |
| --- | --- |
| 17 | Title (26/500/38, mw 300) → Body muted (21/400/36, `#55534E`, mw 310) → Body emphasis (21/400/36, `#1D1C1A`, mw 310) |
| 19 | Body muted → Body emphasis. **No title.** |
| 20 | Title → Body muted. **No emphasis line.** |

The emphasis line is metrically identical to the muted body; only the colour changes
(`#55534E` → `#1D1C1A`).

### b.6 Art board (frame 18)

`gap:48px` column of exactly two items:

1. The scene wrapper — `position:relative; width:340px; height:200px; flex-shrink:0`
2. Body muted — 21/400/36, `#55534E`, `max-width:310px`, `text-wrap:pretty`

**The scene is wider than the gutter.** The container's content box is 317px
(`38 … 355`), the scene is `340px` and `flex-shrink:0`, so under `align-items:center` it
overhangs by `(340 − 317) / 2 = 11.5px` on each side: the scene occupies
**x = 26.5 … 366.5** in the 393 frame. Do not clamp it to the 38px gutters.

Inside the wrapper the canvas nests three identical boxes:

```
position:relative; width:340px; height:200px; flex-shrink:0
  └ position:absolute; left:0; top:0; width:340px; height:200px
      └ position:absolute; left:0; top:0; width:340px; height:200px; overflow:hidden
          └ 27 absolutely-positioned pieces
```

Only the innermost `overflow:hidden` is load-bearing; the two outer boxes are inert.
Full piece list in section e.

### b.7 Fading-stack board (frame 21)

The outer container's `gap:48px` never applies — it holds one child:

```
display:flex; flex-direction:column; align-items:center; gap:26px;
```

Three lines, each `font-size:22px; font-weight:500; line-height:32px; text-align:center;
max-width:300px; text-wrap:balance`, differing only in colour:
`#8B8882` → `#A5A29B` → `#BBB8B1`. The stack fades away from the reader down the page.

### b.8 Glyph board (frame 22)

`gap:48px` column of three items — **the glyph is above the words**, which is the opposite
of the app's current mark placement.

1. Crescent glyph — `position:relative; width:34px; height:30px; flex-shrink:0`
2. Title — 26/500/38, mw 300, `balance`, `#1D1C1A`
3. Body muted — 21/400/36, mw 310, `pretty`, `#55534E`

Glyph pieces (see also section e):

| Piece | Declaration |
| --- | --- |
| crescent | `position:absolute; left:0; top:2px; width:28px; height:28px; border-radius:50%; background:#C5C4BD; -webkit-mask:radial-gradient(circle at 23px 9px, transparent 11px, #000 11.5px); mask:radial-gradient(circle at 23px 9px, transparent 11px, #000 11.5px)` |
| star | `position:absolute; right:0; top:0; width:3px; height:3px; border-radius:50%; background:#C6C5C0` |

### b.9 Task board — scene layout (frame 23)

`gap:30px` centred column:

1. Eyebrow — 12/600, `letter-spacing:1.8px`, `#B0AEA8`, centred
2. **Spacer** `<div style="height:16px">` → eyebrow→title spacing is `30 + 16 + 30 = 76px`
3. Title — 26/500/38, mw 300, `balance`, `#1D1C1A`
4. Scene block — `height:170px; display:flex; justify-content:center; flex-shrink:0`,
   containing `transform:scale(0.85); transform-origin:top center` wrapped around the
   **identical** 340 × 200 scene from frame 18 (byte-for-byte the same 27 pieces).
   `0.85 × 340 = 289`, `0.85 × 200 = 170`, so the painted scene is 289 × 170 and exactly
   fills the declared 170px height. The unscaled child still lays out at 340 × 200, which
   is why the wrapper measures 340 wide; the painted art therefore sits at
   **x = 52 … 341** in the 393 frame.
5. Body muted — 21/400/36, mw 310, `pretty`, `#55534E`
6. Done-rule card

Done-rule card:

| Property | Value |
| --- | --- |
| width | `align-self:stretch` → `317px` |
| border-radius | `16px` |
| background | `#FFFFFF` |
| box-shadow | `0 0 0 1px rgba(0,0,0,0.07), 0 6px 16px rgba(40,38,32,0.05)` |
| display / align | `flex` / `center` |
| gap | `14px` |
| padding | `17px 18px` |
| box-sizing | `border-box` |
| icon | `<svg width="20" height="20" viewBox="0 0 18 18" style="flex-shrink:0">` |
| icon circle | `cx=9 cy=9 r=7.5 fill=none stroke=#1D1C1A stroke-width=1.6` |
| icon tick | `d="M5.8 9l2.3 2.3 4.1-4.6" fill=none stroke=#1D1C1A stroke-width=1.7 stroke-linecap=round stroke-linejoin=round` |
| text | 15/500/22, `#55534E`, `text-wrap:pretty`, `text-align:left` |

Note the icon's 20 × 20 render box over an 18 × 18 viewBox — a 1.111× upscale. Strokes
render at `1.6 × 20/18 = 1.777…` and `1.7 × 20/18 = 1.888…` device px. Transcribe the
viewBox, not the stroke arithmetic.

### b.10 Task board — options layout (frame 24)

Container is the outlier described in b.1: `left:0; right:0; top:126px (→ 72);
bottom:56px; gap:28px; padding:0 32px`.

1. Eyebrow — 12/600, `letter-spacing:1.8px`, `#B0AEA8`
2. Title — 26/500/38, `max-width:320px`, `balance`, `#1D1C1A`
3. Option column — `display:flex; flex-direction:column; gap:18px; align-self:stretch`
   (→ `329px` wide)

Each option row: `display:flex; align-items:flex-start; gap:16px`.

Icon tile:

| Property | Value |
| --- | --- |
| width / height | `38px` / `38px` |
| border-radius | `12px` |
| background | `#FFFFFF` |
| box-shadow | `0 0 0 1px rgba(0,0,0,0.08), 0 3px 8px rgba(40,38,32,0.06)` |
| display / align / justify | `flex` / `center` / `center` |
| flex-shrink | `0` |
| svg | `width="22" height="22" viewBox="0 0 20 20"` (1.1× upscale) |
| stroke colour | `#3A3934` throughout |

Text column: `flex:1; min-width:0`, title 16/600/22 `#1D1C1A`, note `margin-top:4px`
13/400/19 `#767370` `text-wrap:pretty`.

The four icons, verbatim:

```svg
<!-- 1. Own bedroom -->
<svg width="22" height="22" viewBox="0 0 20 20">
  <path d="M3 15.5V6" stroke="#3A3934" stroke-width="1.6" stroke-linecap="round"></path>
  <path d="M3 12.5h14M17 15.5v-5a2 2 0 0 0-2-2H8v4.5" stroke="#3A3934" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>
  <circle cx="5.6" cy="8.9" r="1.5" fill="#3A3934"></circle>
</svg>
```

```svg
<!-- 2. Shared room -->
<svg width="22" height="22" viewBox="0 0 20 20">
  <rect x="4" y="3" width="12" height="14" rx="1.8" fill="none" stroke="#3A3934" stroke-width="1.6"></rect>
  <path d="M10 3v14" stroke="#3A3934" stroke-width="1.6"></path>
  <path d="M6.8 7.5h0M13.2 7.5h0" stroke="#3A3934" stroke-width="1.8" stroke-linecap="round"></path>
  <path d="M6.8 10.5v2M13.2 10.5v2" stroke="#3A3934" stroke-width="1.6" stroke-linecap="round"></path>
</svg>
```

```svg
<!-- 3. Studio, sofa bed, or temporary space -->
<svg width="22" height="22" viewBox="0 0 20 20">
  <path d="M4 9V7.5A2.5 2.5 0 0 1 6.5 5h7A2.5 2.5 0 0 1 16 7.5V9" fill="none" stroke="#3A3934" stroke-width="1.6"></path>
  <path d="M3.5 9a1.8 1.8 0 0 1 1.8 1.8V12h9.4v-1.2A1.8 1.8 0 0 1 16.5 9a1.5 1.5 0 0 1 1.5 1.5V14a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 14v-3.5A1.5 1.5 0 0 1 3.5 9Z" fill="none" stroke="#3A3934" stroke-width="1.6" stroke-linejoin="round"></path>
</svg>
```

```svg
<!-- 4. Phone needed as an alarm -->
<svg width="22" height="22" viewBox="0 0 20 20">
  <circle cx="10" cy="11" r="6" fill="none" stroke="#3A3934" stroke-width="1.6"></circle>
  <path d="M10 8.2V11l2 1.4" fill="none" stroke="#3A3934" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
  <path d="M4.5 4.5L3 6M15.5 4.5L17 6" stroke="#3A3934" stroke-width="1.6" stroke-linecap="round"></path>
</svg>
```

`M6.8 7.5h0` (icon 2) is a zero-length subpath with `stroke-linecap:round` — it renders as
a 1.8px-diameter dot at (6.8, 7.5). React Native SVG honours this; keep the path as
written rather than converting it to a `<Circle>`, or the pair of dots changes size.

### b.11 Maxim board (frame 25)

`gap:48px` centred column:

1. Orb — `position:relative; width:12px; height:12px; flex-shrink:0` (see section e)
2. Maxim — `font-family:'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif;
   font-size:28px; font-weight:500; line-height:44px; text-align:center; color:#1D1C1A;
   text-wrap:balance; max-width:300px`
3. Attribution row — `display:flex; align-items:center; justify-content:center; gap:14px`,
   a `22px × 1.5px` `#C9C7C0` rule, the 12/600/`letter-spacing:1.8px`/`#B0AEA8` name, and a
   second identical rule

There is **no** oversized open-quote glyph on this frame.

### b.12 Completion board (frame 26)

`gap:44px` centred column:

1. Orb — `position:relative; width:36px; height:36px; flex-shrink:0`
2. Title — 26/500/38, mw 300, `balance`, `#1D1C1A`
3. Body muted — 21/400/36, mw 310, `pretty`, `#55534E`

Plus the CTA pill (section d), label `Done`.

---

## c. Per-frame copy — verbatim

Entities resolved: `&rsquo;` → `’` (U+2019 right single quote), `&ldquo;` → `“` (U+201C),
`&rdquo;` → `”` (U+201D), `&middot;` → `·` (U+00B7 middle dot), `&mdash;` → `—` (U+2014 em
dash, with a space on each side as the canvas writes it).

| Frame | Kind | Slot | Copy |
| --- | --- | --- | --- |
| 16 | Pick-one | title | `Where do most of your night-time relapses begin?` |
| 16 | | helper | `Pick the one that happens most.` |
| 16 | | option 1 (**selected**) | `In bed with my phone` |
| 16 | | option 2 | `Alone on my computer` |
| 16 | | option 3 | `When I can’t sleep` (`can&rsquo;t`) |
| 16 | | option 4 | `Somewhere else` |
| 16 | | CTA | `Continue` |
| 17 | Prose | title | `Add distance` |
| 17 | | body muted | `An urge at midnight is much more convincing when the whole habit sits one thumb-movement away.` |
| 17 | | body emphasis | `Change that.` |
| 18 | Art | body muted | `If the phone is across the room, you have to stand up. If it is downstairs, you have to leave the bed.` |
| 19 | Prose | body muted | `If the laptop is closed and put away, you have to make another decision before anything happens.` |
| 19 | | body emphasis | `That small gap matters. Do not spend willpower where distance will do the job.` |
| 20 | Prose | title | `Before you sleep` |
| 20 | | body muted | `Once you have done that, you are finished for today.` |
| 21 | Fading stack | line 1 `#8B8882` | `No autopsy of the past.` |
| 21 | | line 2 `#A5A29B` | `No huge promise about the future.` |
| 21 | | line 3 `#BBB8B1` | `No test of whether you are “strong enough.”` (`&ldquo;` / `&rdquo;`; the full stop sits **inside** the closing quote) |
| 22 | Glyph | title | `Get through tonight.` |
| 22 | | body muted | `Tomorrow can have tomorrow.` |
| 23 | Task (scene) | eyebrow | `DAY 1 · TONIGHT’S TASK` (`&middot;`, `&rsquo;`) |
| 23 | | title | `Surviving the night` |
| 23 | | body muted | `Set up tonight before you get tired. Use the option that matches where you sleep.` |
| 23 | | rule card | `Done when you can’t reach your usual device from bed without standing up.` (`can&rsquo;t`) |
| 24 | Task (options) | eyebrow | `DAY 1 · TONIGHT’S TASK` |
| 24 | | title | `Match where you sleep` |
| 24 | | option 1 title | `Own bedroom` |
| 24 | | option 1 note | `Set the alarm now. Charge the phone outside the room. Put a laptop or tablet in a closed bag, drawer, or cupboard away from the bed.` |
| 24 | | option 2 title | `Shared room` |
| 24 | | option 2 note | `Put the device in a bag, locker, desk drawer, or fixed charging spot that you cannot reach while lying down.` |
| 24 | | option 3 title | `Studio, sofa bed, or temporary space` |
| 24 | | option 3 note | `Put the device at the farthest practical point from where you sleep: a kitchen counter, shelf, zipped bag, or other fixed place.` |
| 24 | | option 4 title | `Phone needed as an alarm` |
| 24 | | option 4 note | `Set the alarm first. Put the phone across the room or outside it. Turn off non-essential notifications before you put it down.` |
| 25 | Maxim | maxim | `Well begun is half done.` |
| 25 | | attribution | `ARISTOTLE` (authored in caps; **not** a `text-transform`) |
| 26 | Completion | title | `Lesson complete.` |
| 26 | | body muted | `Your answer is saved to the log. One decision tonight — get to tomorrow.` (`&mdash;`) |
| 26 | | CTA | `Done` |

The eyebrow and the attribution are authored in literal capitals. No frame declares
`text-transform` anywhere.

---

## d. Shared chrome

Lines 1–84 of all eleven pretty files are byte-identical except for the
`data-screen-label` attribute. Verified by diffing every frame's first 84 lines against
frame 16's.

### d.1 Status bar — canvas only, never built

```
position:absolute; top:0; left:0; right:0; height:54px;
display:flex; align-items:center; justify-content:space-between;
padding:6px 32px 0 46px; box-sizing:border-box; z-index:20;
```

Clock `9:41` at 17/600, `letter-spacing:-0.2px`, `#1D1C1A`. Icon row `display:flex;
align-items:center; gap:7px` holding a 19 × 12 signal bar chart, a 17 × 12 wifi fan, and a
27 × 13 battery, all `#1D1C1A`. The battery outline is `stroke-opacity:0.35`, the nub is
`fill-opacity:0.4`. The OS draws this; the app builds none of it.

### d.2 Close affordance

| Property | Value |
| --- | --- |
| position | `absolute` |
| left | `16px` |
| top | `66px` → **12** |
| font-size / weight | `17px` / `400` |
| colour | `#3A3934` |
| z-index | `5` |
| copy | `Close` |

No back chevron, no right-hand affordance, on any of the eleven frames.

### d.3 Progress bar

| Property | Value |
| --- | --- |
| position | `absolute` |
| left / right | `16px` / `16px` (→ 361px wide on a 393 frame) |
| top | `108px` → **54** |
| height | `2px` |
| border-radius | `1px` |
| track background | `rgba(0,0,0,0.05)` |
| z-index | `5` |
| fill | `position:absolute; left:0; top:0; bottom:0; border-radius:1px; background:#B4B1AB` |
| fill width | percentage, per frame |

Fill percentage per frame — transcribed, not interpolated:

| Frame | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `width` | `62%` | `65%` | `69%` | `73%` | `77%` | `81%` | `85%` | `88%` | `92%` | `96%` | `100%` |

Deltas: 3, 4, 4, 4, 4, 4, 3, 4, 4, 4. Every value is exactly `Math.round(n / 26 × 100)`
for a 26-step flow — 16/26 = 61.538 → 62, 17/26 = 65.385 → 65, 18/26 = 69.231 → 69,
19/26 = 73.077 → 73, 20/26 = 76.923 → 77, 21/26 = 80.769 → 81, 22/26 = 84.615 → 85,
23/26 = 88.462 → 88, 24/26 = 92.308 → 92, 25/26 = 96.154 → 96, 26/26 = 100. No half-cases
arise, so the rule is unambiguous. The design's progress is a continuous **bar**, not a dot
rail, and the lesson it is drawn from runs to 26 steps.

### d.4 CTA pill — frames 16 and 26 only

```
position:absolute; left:16px; right:16px; bottom:30px;
height:52px; border-radius:26px; background:#131313;
display:flex; align-items:center; justify-content:center;
cursor:pointer; z-index:5;
```

Label: 17/600, `letter-spacing:0.2px`, `#FFFFFF`. Frame 16 says `Continue`; frame 26 says
`Done`.

**Frames 17, 18, 19, 20, 21, 22, 23, 24 and 25 carry no pill at all.** They are advanced
by tapping or swiping the page. No disabled state, no loading state, and no 24px/56px
"wide" variant appears anywhere in this range.

---

## e. Visualization — the drawn art

### e.1 The bedroom scene (frames 18 and 23)

**Coordinate system.** A 340 × 200 box with `overflow:hidden`. There is no `viewBox`: every
piece is a CSS box with `left`/`top`/`width`/`height` in the same 340 × 200 space, painted
in source order (later pieces over earlier). Transcribed to `react-native-svg` this is a
`viewBox="0 0 340 200"`; transcribed to RN views it is a `View` of width 340, height 200,
`overflow:'hidden'`, holding 27 absolutely-positioned children in this exact order.

Frame 23 renders the identical markup wrapped in `transform:scale(0.85);
transform-origin:top center`, giving 289 × 170.

| # | Piece | Declaration (verbatim) |
| --- | --- | --- |
| 1 | crescent moon | `left:43px; top:31px; width:18px; height:18px; border-radius:50%; background:#C5C4BD; -webkit-mask:radial-gradient(circle at 15.299999999999999px 5.58px, transparent 7.0200000000000005px, #000 7.38px); mask:radial-gradient(circle at 15.299999999999999px 5.58px, transparent 7.0200000000000005px, #000 7.38px)` |
| 2 | star | `left:96px; top:30px; width:2px; height:2px; border-radius:50%; background:rgba(200,225,235,0.35)` |
| 3 | star | `left:30px; top:74px; width:2px; height:2px; border-radius:50%; background:rgba(200,225,235,0.3)` |
| 4 | floor dome | `left:-30px; top:158px; width:400px; height:72px; border-radius:50% 50% 0 0 / 26px 26px 0 0; background:#EAE9E3` |
| 5 | bed shadow | `left:29px; top:155px; width:118px; height:11px; border-radius:50%; background:rgba(0,0,0,0.09); filter:blur(5px)` |
| 6 | headboard | `left:28px; top:96px; width:10px; height:62px; border-radius:5px 5px 3px 3px; background:#D6D5D0` |
| 7 | mattress | `left:36px; top:126px; width:104px; height:24px; border-radius:6px 10px 5px 5px; background:#E0DFDA` |
| 8 | duvet | `left:70px; top:124px; width:70px; height:26px; border-radius:12px 12px 5px 4px; background:#C9C8C1` |
| 9 | duvet highlight | `left:76px; top:130px; width:56px; height:4px; border-radius:2px; background:rgba(255,255,255,0.55)` |
| 10 | pillow | `left:40px; top:117px; width:28px; height:14px; border-radius:7px 7px 5px 5px; background:#FFFFFF; box-shadow:inset 0 -2.5px 0 #D6D5D0, 0 1.5px 3px rgba(40,38,32,0.14)` |
| 11 | bed leg L | `left:38px; top:150px; width:6px; height:8px; border-radius:0 0 2px 2px; background:#C6C5C0` |
| 12 | bed leg R | `left:130px; top:150px; width:6px; height:8px; border-radius:0 0 2px 2px; background:#C6C5C0` |
| 13 | door frame | `left:196px; top:54px; width:64px; height:104px; border-radius:6px 6px 0 0; background:#F7F6F2; box-shadow:inset 0 0 0 6px #E4E3DE, 0 6px 14px rgba(40,38,32,0.12)` |
| 14 | doorway light | `left:204px; top:62px; width:42px; height:96px; background:linear-gradient(90deg, rgba(233,210,164,0.8) 0%, rgba(243,227,196,0.3) 55%, rgba(244,243,240,0.12) 100%)` |
| 15 | door leaf | `left:240px; top:60px; width:20px; height:98px; border-radius:2px; background:#D6D5D0; transform:skewY(-7deg); transform-origin:top right; box-shadow:-4px 3px 7px rgba(40,38,32,0.16)` |
| 16 | door handle | `left:244px; top:99.75999999999999px; width:4px; height:4px; border-radius:50%; background:#8A857C` |
| 17 | light spill | `left:200px; top:158px; width:84px; height:12px; background:linear-gradient(100deg, rgba(233,210,164,0.5), rgba(233,210,164,0.06)); clip-path:polygon(6% 0, 78% 0, 100% 100%, 0 100%)` |
| 18 | door shadow | `left:193px; top:160px; width:82px; height:11px; border-radius:50%; background:rgba(0,0,0,0.07); filter:blur(5px)` |
| 19 | table shadow | `left:283px; top:160px; width:38px; height:11px; border-radius:50%; background:rgba(0,0,0,0.08); filter:blur(5px)` |
| 20 | table top | `left:282px; top:136px; width:40px; height:8px; border-radius:4px; background:#DEDDD7` |
| 21 | table leg L | `left:289px; top:144px; width:5px; height:20px; border-radius:2.5px; background:#C6C5C0` |
| 22 | table leg R | `left:310px; top:144px; width:5px; height:20px; border-radius:2.5px; background:#C6C5C0` |
| 23 | phone halo | `left:285px; top:113px; width:34px; height:34px; border-radius:50%; background:radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%); filter:blur(5px)` |
| 24 | phone shadow | `left:279px; top:135px; width:46px; height:11px; border-radius:50%; background:rgba(0,0,0,0.09); filter:blur(5px)` |
| 25 | phone body | `left:284px; top:127px; width:36px; height:9px; border-radius:4px; background:linear-gradient(180deg, #12151B 0%, #1A2027 100%); box-shadow:0 0 0 1.6px #2A2E35` |
| 26 | phone screen sliver | `left:296px; top:129.5px; width:12px; height:2.5px; border-radius:1px; background:rgba(190,205,220,0.28)` |
| 27 | star | `left:258px; top:36px; width:2.5px; height:2.5px; border-radius:50%; background:rgba(200,225,235,0.4)` |

Gradients, in full:

* **Piece 14** — `linear-gradient(90deg, …)`. CSS `90deg` points **right**. Stops:
  `rgba(233,210,164,0.8)` @ `0%`, `rgba(243,227,196,0.3)` @ `55%`,
  `rgba(244,243,240,0.12)` @ `100%`.
* **Piece 17** — `linear-gradient(100deg, …)`, i.e. 10° clockwise past horizontal.
  Stops: `rgba(233,210,164,0.5)` (implicit `0%`), `rgba(233,210,164,0.06)` (implicit
  `100%`).
* **Piece 23** — `radial-gradient(closest-side, rgba(226,186,120,0.4),
  rgba(226,186,120,0) 74%)` on a 34 × 34 box, so `closest-side` = r 17.
* **Piece 25** — `linear-gradient(180deg, #12151B 0%, #1A2027 100%)`, i.e. top → bottom.

Masks and clips:

* **Piece 1**, the crescent: `mask:radial-gradient(circle at 15.299999999999999px 5.58px,
  transparent 7.0200000000000005px, #000 7.38px)` over an 18 × 18 disc. The bite is centred
  at (15.3, 5.58) with a hard edge from r 7.02 to r 7.38 — a 0.36px feather. RN has no CSS
  mask: draw it as an 18px `#C5C4BD` circle with a second circle of the page background
  (`#F4F3F0`) of r 7.2 centred at (43 + 15.3, 31 + 5.58) = (58.3, 36.58) in scene space, or
  as an SVG `<Mask>`.
* **Piece 17**, the light spill: `clip-path:polygon(6% 0, 78% 0, 100% 100%, 0 100%)` on an
  84 × 12 box → the quadrilateral `(5.04, 0) (65.52, 0) (84, 12) (0, 12)`.

Blur radii: pieces 5, 18, 19, 23 and 24 all carry `filter:blur(5px)`. React Native has no
blur filter. Redraw each as a radial gradient with the same falloff — the pattern already
used by `SignWash` in `src/components/lesson/scenes.tsx` (`Stop` at `0` at full opacity,
`0.55` at 60 %, `1` at 0). Pieces 5, 18, 19 and 24 are ellipses (`border-radius:50%` on a
non-square box); piece 23 is already a radial and only needs the blur folded into its
falloff.

Edge cases:

* At `scale(0.85)` (frame 23) every dimension including the blurs scales; the 2px stars
  become 1.7px and must not be rounded up to 2.
* The scene's own box clips at `overflow:hidden`: the floor dome (piece 4) starts at
  `left:-30` and runs 400 wide, so it is cut at both scene edges, and its bottom 30px
  (`158 + 72 = 230` against a 200-tall box) is cut off. That clip is what makes the floor
  read as a horizon line rather than a lozenge. Keep it.
* Piece 15's `transform:skewY(-7deg); transform-origin:top right` skews about
  (260, 60) in scene space. RN supports `skewY` in a `transform` array but has **no**
  `transformOrigin` on older versions — verify, or replace with an SVG `<Path>` for the
  four skewed corners.

### e.2 The crescent glyph (frame 22)

A 34 × 30 box. Same masking technique at a different scale: a 28px `#C5C4BD` disc at
(0, 2) with a bite of r 11 → 11.5 centred at (23, 9) in the disc's own space — i.e. at
(23, 11) in the 34 × 30 box. A 3 × 3 `#C6C5C0` dot sits at the box's top-right corner
(`right:0; top:0`).

### e.3 The orb (frames 25 and 26)

Two sizes of the same two-layer object.

| Property | Frame 25 | Frame 26 |
| --- | --- | --- |
| box | `position:relative; width:12px; height:12px; flex-shrink:0` | `position:relative; width:36px; height:36px; flex-shrink:0` |
| halo | `left:-13px; top:-13px; width:38px; height:38px` | `left:-39.5px; top:-39.5px; width:115px; height:115px` |
| halo centre | (6, 6) — concentric ✅ | (18, 18) — concentric ✅ |
| halo background | `radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 76%)` | identical |
| halo filter | `blur(3px)` | `blur(3px)` |
| halo radius | `border-radius:50%` | `border-radius:50%` |
| body | `position:absolute; inset:0; border-radius:50%` | identical |
| body background | `radial-gradient(circle at 34% 30%, #F3E3C4 0%, #E2BA78 58%, #C49856 100%)` | identical |
| body shadow | `0 2px 6px rgba(160,120,50,0.3)` | identical |

The halo is 3.1667× the orb on frame 25 and 3.1944× on frame 26 — near enough that one
component with a `size` prop and a `halo = size * 3.19` rule reproduces both within a
tenth of a pixel, but the canvas's own numbers are the ones above.

RN transcription: draw the halo as an SVG `<Circle>` filled with a `<RadialGradient>`
(`#E2BA78` at `0` / opacity `0.4`, `#E2BA78` at `0.76` / opacity `0`) — the same trick
`LessonCoverScene` already uses — and the body as an SVG `<Circle>` with a
`<RadialGradient cx="34%" cy="30%" r="50%">` carrying stops `#F3E3C4` @ `0`,
`#E2BA78` @ `0.58`, `#C49856` @ `1`, with `boxShadow: '0 2px 6px rgba(160,120,50,0.3)'` on
the wrapping `View`.

---

## f. Comparison against the app as it stands

Middle column read from the files, never guessed. File and line noted for every row.

### f.1 Chrome

| Property | Design | Current app | Verdict |
| --- | --- | --- | --- |
| frame background | `#F4F3F0` | `colors.bg` = `#F4F3F0` (`[slug].tsx:574`) | match |
| grain | `inset:0`, `noise-dark.png`, `opacity:0.07` | `PaperGrain`, same image, `opacity: 0.07`, `contentFit="cover"` (`[slug].tsx:168-177`) | match |
| Close copy / size / weight / colour | `Close` · 17 · 400 · `#3A3934` | `Close` · 17 · `sans('400')` · `#3A3934` (`[slug].tsx:105`) | match |
| Close position | `left:16px`, `top:66px` → **12** | `paddingHorizontal: 16`; inside a 44-tall row, `justifyContent:'center'`, under `paddingTop: insets.top` (`[slug].tsx:97-107, 577`) | near-match on x; y depends on `insets.top` |
| progress shape | continuous **bar** | dot rail (7px dots, 22px active pill) when `total <= 17`, bar otherwise (`[slug].tsx:95, 108-125`) | **MISMATCH** |
| progress top | `108px` → **54** | `insets.top + 44 + 6` ≈ 109 on a 59pt inset | **MISMATCH** |
| progress width | `left:16; right:16` → 361 | dots: content-sized and centred; bar: `width: 180` (`[slug].tsx:122`) | **MISMATCH** |
| progress height / radius | `2px` / `1px` | `7` / `3.5`–`4` (`[slug].tsx:113-123`) | **MISMATCH** |
| progress track colour | `rgba(0,0,0,0.05)` | `rgba(0,0,0,0.18)` (`[slug].tsx:117, 122`) | **MISMATCH** |
| progress fill colour | `#B4B1AB` | `#131313` (`[slug].tsx:117, 123`) | **MISMATCH** |
| right-hand chrome | none | none | match |

### f.2 The CTA

| Property | Design | Current app | Verdict |
| --- | --- | --- | --- |
| present on | frames 16 and 26 only | every step except `ask` (`ctaLabel = null`, `[slug].tsx:538`) and `quote` | **MISMATCH** — 9 of 11 frames get a pill they should not have |
| gutters | `left:16px; right:16px` | `wide ? 24 : 16` (`[slug].tsx:150`) | **MISMATCH** for the `wide` pages |
| bottom | `30px` | `Math.max(insets.bottom, wide ? 56 : 30)` (`[slug].tsx:152`) | **MISMATCH** for `wide`; also `insets.bottom` (34) beats 30 on a notched phone |
| height / radius | `52px` / `26px` | `52` / `26` (`[slug].tsx:158`) | match |
| background | `#131313` | `#131313` (`[slug].tsx:158`) | match |
| label | 17 · 600 · `letter-spacing:0.2px` · `#FFFFFF` | 17 · `sans('600')` · `0.2` · `#FFFFFF` (`[slug].tsx:159`) | match |
| disabled state | not drawn on these frames | `opacity: 0.34` (`[slug].tsx:158`) | app-only, no design evidence in this range |
| completion label | `Done` | `Done`, but `ctaWide = true` (`[slug].tsx:511-512`) | copy match, geometry **MISMATCH** |

### f.3 Body layout

| Property | Design | Current app | Verdict |
| --- | --- | --- | --- |
| vertical placement | flex-centred over the **whole 852**, `inset:0` (10 of 11 frames) | fixed `paddingTop` per page kind, measured from below `insets.top + CHROME_H` — e.g. `322 − 54 − 57 = 211` for teach (`pages.tsx:50`), `288 − 54 − 57 = 177` for branch (`pages.tsx:348`), `230 − 54 − 57 = 176` for complete (`[slug].tsx:365`) | **MISMATCH** — the app is top-anchored, the design is centred |
| horizontal gutter | `padding:0 38px` (content 317) | teach body `paddingHorizontal: 44` (305), headline `30` (333) (`pages.tsx:52, 55`) | **MISMATCH** |
| stack gap | `48px` (prose/art/glyph/maxim), `44px` (complete), `40px` (pick), `30px` (task scene), `28px` (task options) | ad-hoc `marginTop` per element (22, 18, 8, 78 …) | **MISMATCH** |
| scroll | none — every frame is a fixed centred stack | `ScrollView` on teach, branch, pick, grid, collect, reflection | app-only |

### f.4 Type

| Property | Design | Current app | Verdict |
| --- | --- | --- | --- |
| title size / line-height / weight | `26px` / `38px` / `500` | `24` / `32` / `sans('500')` (`pages.tsx:52`, `PageBranch` `pages.tsx:354`) | **MISMATCH** |
| title max-width | `300px` (`310` on 16, `320` on 24) | `paddingHorizontal: 30` → 333 on a 393 screen | **MISMATCH** |
| body size / line-height | `21px` / `36px` | `16.5` / `26` (`pages.tsx:55, 358`) | **MISMATCH** |
| body colour | `#55534E` | `#55534E` (`pages.tsx:55`) | match |
| body max-width | `310px` | `paddingHorizontal: 44` → 305 | **MISMATCH** (5px) |
| emphasis body | same metrics, colour `#1D1C1A` | no such role exists | **MISSING** |
| eyebrow | `12px` / `600` / `letter-spacing:1.8px` / `#B0AEA8` | `12.5` / `sans('600')` / no letter-spacing / `#8B8882` (`pages.tsx:350`) | **MISMATCH** on all four |
| helper (pick) | `15px` / `500` / `#8B8882` | `15` / `sans('400')` / `#55534E` (`pages.tsx:404`) | **MISMATCH** on weight and colour |

### f.5 Pick-one board (frame 16 vs `PagePick`)

| Property | Design | Current app | Verdict |
| --- | --- | --- | --- |
| medallion above the title | none | `LessonCover size={96} variant="water"` (`pages.tsx:399`) | **MISMATCH** — the design has no medallion |
| option width | `align-self:stretch` inside 38px padding → 317 | `marginHorizontal: 56` → 281 (`pages.tsx:405`) | **MISMATCH** |
| option height | `56px` | `52` (`pages.tsx:415`) | **MISMATCH** |
| option radius | `16px` | `26` — a full pill (`pages.tsx:419`) | **MISMATCH** |
| option gap | `12px` | `12` (`pages.tsx:405`) | match |
| option padding | `0 18px` | `paddingHorizontal: 18` (`pages.tsx:418`) | match |
| radio | 22 × 22, ring + 5px ink dot, `gap:14px` before the label | none — there is no radio at all (`pages.tsx:409-429`) | **MISSING** |
| unselected background | `#FFFFFF` | `#FFFFFF` (`pages.tsx:422`) | match |
| unselected ring | `inset 0 0 0 1.5px #E4E2DB` | `0 0 0 1.5px rgba(0,0,0,0.14)` — outer, different colour (`pages.tsx:423`) | **MISMATCH** |
| selected background | `#FFFFFF` (stays white) | `#131313` (`pages.tsx:422`) | **MISMATCH** |
| selected ring / lift | `0 0 0 2px #1D1C1A, 0 4px 10px rgba(40,38,32,0.08)` | none | **MISMATCH** |
| label size / colour | `16px`, `#1D1C1A` in both states | `16.5`, `#2A2924` / `#FFFFFF` (`pages.tsx:425`) | **MISMATCH** |
| label alignment | left of the row, after the radio | `center` (`pages.tsx:425`) | **MISMATCH** |
| CTA label | `Continue` | `Continue`, or `fillTemplate(page.result…)` on a pair page (`[slug].tsx:554`) | match for this frame |

### f.6 Maxim board (frame 25 vs `PageQuote`)

| Property | Design | Current app | Verdict |
| --- | --- | --- | --- |
| orb above the maxim | 12px orb + 38px halo | none (`pages.tsx:112-126`) | **MISSING** |
| opening `“` glyph | none | `fonts.quote` at `56/56`, `rgba(29,28,26,0.18)` (`pages.tsx:115`) | **app-only — MISMATCH** |
| face | `'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif` | `fonts.quote` → `Georgia` on iOS, `serif` on Android (`theme.ts:220`) | **MISMATCH** — Iowan Old Style is a system face on iOS and is not requested |
| size / line-height | `28px` / `44px` | `23` / `35` (`pages.tsx:118`) | **MISMATCH** |
| weight | `500` | inherited default (`400`) | **MISMATCH** |
| letter-spacing | none | `-0.2` (`pages.tsx:118`) | **MISMATCH** |
| max-width | `300px` | `paddingHorizontal: 36` → 321 (`pages.tsx:114`) | **MISMATCH** |
| stack gap | `48px` | `26` (`pages.tsx:114`), with a `-30` pull on the text (`pages.tsx:118`) | **MISMATCH** |
| rule size | `22px × 1.5px` | `26 × 1.5` (`pages.tsx:122, 124`) | **MISMATCH** |
| rule colour | `#C9C7C0` | `rgba(0,0,0,0.22)` (`pages.tsx:122`) | **MISMATCH** |
| attribution row gap | `14px` | `12` (`pages.tsx:121`) | **MISMATCH** |
| attribution type | `12px` / `600` / `1.8px` / `#B0AEA8` | `14` / `sans('600')` / `1.5` / `#8B8882` (`pages.tsx:123`) | **MISMATCH** |
| attribution case | authored caps | `quote.who.toUpperCase()` (`pages.tsx:123`) | equivalent result |
| chrome | Close + progress bar, **no** back chevron | no Close, no progress, one 11 × 19 chevron at `left:16, top:insets.top+10` (`[slug].tsx:190-204, 473-482`) | **MISMATCH** — this frame keeps the shared chrome |
| centring | over 852 | over 852 (`position:absolute` full-frame) (`pages.tsx:111`) | match |

### f.7 Completion board (frame 26 vs `PageComplete`)

| Property | Design | Current app | Verdict |
| --- | --- | --- | --- |
| mark | 36px orb + 115px halo | `LessonCover size={128}` — a ringed coast medallion (`[slug].tsx:367`) | **MISMATCH** |
| mark → title | `gap:44px` | `marginTop: 78` (`[slug].tsx:370`) | **MISMATCH** |
| title | `26px` / `500` / `line-height:38px` / mw 300 | `24` / `sans('500')` / no `lineHeight` / no width cap (`[slug].tsx:370`) | **MISMATCH** |
| title → body | `gap:44px` | `marginTop: 18` (`[slug].tsx:371`) | **MISMATCH** |
| body | `21px` / `36px` / `#55534E` / mw 310 | `15.5` / `23` / `#55534E` / `paddingHorizontal: 44` (`[slug].tsx:371`) | **MISMATCH** on size, line-height, width |
| body copy | `Your answer is saved to the log. One decision tonight — get to tomorrow.` | `Your reflection is saved to the log. Next up: {next lesson}.` (`[slug].tsx:372`) | **MISMATCH** |
| CTA | `Done`, gutters 16, bottom 30 | `Done`, `ctaWide = true` → gutters 24, bottom 56 (`[slug].tsx:511-512`) | **MISMATCH** on geometry |
| vertical placement | centred over 852 | `paddingTop: 230 − 54 − 57 = 176` (`[slug].tsx:365`) | **MISMATCH** |
| entrance | not expressible in the canvas | `FadeInDown` / `FadeInUp.delay(90)` (`[slug].tsx:366, 369`) | app-only, keep |

### f.8 Page kinds with no app equivalent at all

| Design page kind | Frames | Nearest thing in the app | Verdict |
| --- | --- | --- | --- |
| Art board (full 340 × 200 scene) | 18 | `SignScene` is 190 × 152 and draws five other subjects (`scenes.tsx:681-844`); `LessonMark` is an 84pt abstract line (`marks.tsx:51-122`) | **MISSING** |
| Glyph-above-title board | 22 | `PageTeach` puts `LessonMark` **below** the body (`pages.tsx:82-84`) | **MISSING** (and inverted) |
| Fading-stack board | 21 | nothing | **MISSING** |
| Task board (scene) | 23 | nothing. `IPage` has no `task` member (`src/lib/types.ts:333`) | **MISSING** |
| Task board (options) | 24 | nothing | **MISSING** |
| Emphasis body line | 17, 19 | nothing | **MISSING** |

### f.9 `src/components/ChallengeSheet.tsx`

`git grep -n ChallengeSheet HEAD` returns **only its own file**. The component is currently
orphaned — nothing imports it — and it does not correspond to any of these eleven frames.
For completeness, its numbers against the nearest design idea (the task boards, 23 and 24):

| Property | Design (frames 23/24) | `ChallengeSheet.tsx` | Verdict |
| --- | --- | --- | --- |
| presentation | a full page in the reader flow | `Modal transparent animationType="slide"` over `rgba(19,19,19,0.44)` (line 39-40) | **MISMATCH** |
| container | 393 × 852 paper frame | bottom sheet, `borderTopLeftRadius/RightRadius: 28` (line 44) | **MISMATCH** |
| hero | none | `height: 150`, `backgroundColor: colors.ink` (line 46) | app-only |
| title | 26 / 500 / 38 / `#1D1C1A` | `fonts.serifSharp` (= System 500) / 27 / 32 / `colors.text` (line 51) | **MISMATCH** |
| sub | 21 / 400 / 36 / `#55534E` / mw 310 | 14.5 / 22 / `colors.textMuted` / `maxWidth: 300` (line 56) | **MISMATCH** |
| eyebrow | `DAY 1 · TONIGHT’S TASK`, 12 / 600 / 1.8 / `#B0AEA8` | `This week`, 12.5 / 600 / 1.5 / uppercase / `colors.textSoft` (line 61) | **MISMATCH** |
| week dots | not present on any of these frames | 26 × 26, `gap: 13`, dashed ring unless done/today (line 64-90) | app-only |
| CTA | 52 tall, radius 26, gutters 16, bottom 30 | `paddingVertical: 16`, `borderRadius: 9999`, label 16 / `letterSpacing: 0.32` (line 93-105) | **MISMATCH** |
| decline | none | `Not now`, 14.5, `colors.textSoft` (line 106-108) | app-only |

### f.10 Contradictions and ambiguities in the canvas

1. **Frame 16 centres over the whole frame while carrying a pinned pill.** The body
   container is `inset:0`, so it centres over all 852 including the 30pt-from-the-foot
   CTA's band. The stack is short enough that they do not collide, but the evidence is
   unambiguous: centre over 852, do not centre over "852 minus the pill".
2. **Two spacer divs do work `gap` could have done.** Frame 16's `<div style="height:18px">`
   and frame 23's `<div style="height:16px">` are empty flex children, so they each pick up
   the container `gap` on both sides. Effective spacing is `40 + 18 + 40 = 98` (frame 16,
   title → helper) and `30 + 16 + 30 = 76` (frame 23, eyebrow → title). Build the spacing,
   not the spacer.
3. **Title `max-width` is not constant.** 300 on frames 17/20/22/23/25/26, 310 on frame 16,
   320 on frame 24. Not a rounding artefact — three distinct authored values. Honour each.
4. **Frame 24 breaks the `inset:0` rule** (`top:126px; bottom:56px`) *and* the 38px gutter
   (`0 32px`). Its content is the tallest in the range, which is the likely reason. Follow
   the frame.
5. **Frame 23's art wrapper declares `height:170px` while its child lays out at 200px.**
   `transform` does not affect layout, so the child overflows the wrapper by 30px in the
   layout box but paints at exactly 170px. Both readings agree on what is on screen; build
   the painted result (289 × 170).
6. **The progress percentages are not hand-authored.** All eleven are exactly
   `Math.round(n / 26 × 100)`, with no half-cases to disambiguate the rounding mode. The
   evidence supports a plain bar driven by step count over a 26-step flow.
7. **Frame 18's scene overhangs its own container's padding by 11.5px per side.** The
   declarations (`width:340px`, `flex-shrink:0`, `padding:0 38px`) leave no other reading.

---

## g. What must change — in order

1. **`src/app/lesson/[slug].tsx` — `FlowChrome`.** Replace the dot rail and the 180pt bar
   with the design's single bar: absolute, `left:16, right:16, top: 108 − 54 = 54` measured
   from the top of the screen (not from below `insets.top`), `height: 2`,
   `borderRadius: 1`, track `rgba(0,0,0,0.05)`, fill `#B4B1AB`, fill width
   `${Math.round(((index + 1) / total) * 100)}%`. Delete the `dots`/`total <= 17` branch
   and the `#131313` fills.

2. **`src/app/lesson/[slug].tsx` — `FlowChrome` Close.** Pin it absolutely at
   `left: 16, top: 66 − 54 = 12` from the top of the screen rather than laying it in a
   44-tall row under `paddingTop: insets.top`. Keep 17 / `sans('400')` / `#3A3934`. Keep
   the 44pt hit target via `hitSlop`, not via layout height.

3. **`src/app/lesson/[slug].tsx` — the shell.** Drop `paddingTop: insets.top` from the body
   container and let each page be `position:'absolute'; left:0; right:0; top:0; bottom:0`
   with `alignItems:'center'; justifyContent:'center'; paddingHorizontal: 38`, with the
   chrome floating above it at `zIndex: 5`. This is the single change that puts every one
   of these eleven frames on its right vertical.

4. **`src/app/lesson/[slug].tsx` — `FlowCta`.** Delete the `wide` variant: gutters are
   always 16 and the bottom is always 30. Then stop passing a `ctaLabel` on the page kinds
   these frames show without a pill — teach/art/stack/glyph/maxim/task all advance by tap.
   Keep the pill only on the pick-one board and the completion board.

5. **`src/components/lesson/pages.tsx` — `PageTeach`.** Retype to the design ramp: title
   26 / 500 / `lineHeight: 38` / `maxWidth: 300`; body 21 / 400 / `lineHeight: 36` /
   `maxWidth: 310` / `#55534E`. Replace the `paddingTop`/`marginTop` stack with a centred
   column at `gap: 48`. Add an optional **emphasis** body (identical metrics, `#1D1C1A`)
   for frames 17 and 19, and make the title optional so frame 19 can omit it.

6. **`src/components/lesson/pages.tsx` — mark placement.** Move `LessonMark` (and any
   scene) **above** the title, as frames 18 and 22 draw it, instead of below the body.

7. **`src/components/lesson/scenes.tsx` — new `BedroomScene`.** Transcribe the 27 pieces of
   section e.1 into a 340 × 200 `View` with `overflow:'hidden'`, in source order, with a
   `scale` prop (1 for frame 18, 0.85 for frame 23). Redraw the five `blur(5px)` pieces as
   radial gradients following the `SignWash` pattern already in this file, and the crescent
   mask as an SVG `<Mask>` or a background-coloured cut-out disc. Let the scene overhang the
   38px gutter — do not wrap it in a padded parent.

8. **`src/components/lesson/scenes.tsx` — new `CrescentGlyph` and `Orb`.** `CrescentGlyph`
   is the 34 × 30 box of section e.2. `Orb` takes a `size` and draws the two-layer object of
   section e.3 — `size: 12` for the maxim board, `size: 36` for the completion board.

9. **`src/components/lesson/pages.tsx` — `PagePick` (non-pair).** Drop the `LessonCover`.
   Rebuild the option as a 56-tall, `borderRadius: 16`, `#FFFFFF` row at the full 317pt
   width with `paddingHorizontal: 18` and `gap: 14`, a 22 × 22 radio in front of a
   left-aligned 16pt label, and the two states of section b.4 — selected keeps the white
   fill and gains `boxShadow: '0 0 0 2px #1D1C1A, 0 4px 10px rgba(40,38,32,0.08)'`;
   unselected carries `boxShadow: 'inset 0 0 0 1.5px #E4E2DB'`. Retype the helper to
   15 / 500 / `#8B8882` and the title to 26 / 500 / 38 / `maxWidth: 310`.

10. **`src/components/lesson/pages.tsx` — `PageQuote`.** Delete the 56pt opening-quote glyph
    and its `-30` pull. Put an `Orb size={12}` on top, set the maxim to
    `'Iowan Old Style'` (falling back to Palatino, then Georgia) at 28 / 500 /
    `lineHeight: 44` / `maxWidth: 300` with no letter-spacing, `gap: 48`, and rebuild the
    attribution row at `gap: 14` with `22 × 1.5` `#C9C7C0` rules and a
    12 / 600 / `letterSpacing: 1.8` / `#B0AEA8` name. Then stop routing the quote step past
    the chrome: frame 25 carries the same Close and progress bar as every other frame, so
    remove the `QuoteChrome` chevron special case in `[slug].tsx:472-482`.

11. **`src/components/lesson/pages.tsx` — new `PageStack`.** Three centred lines at
    22 / 500 / 32 / `maxWidth: 300`, `gap: 26`, colours `#8B8882`, `#A5A29B`, `#BBB8B1` in
    order.

12. **`src/lib/types.ts` — add a `task` page kind**, then
    **`src/components/lesson/pages.tsx` — new `PageTask` and `PageTaskOptions`** per
    sections b.9 and b.10, including the eyebrow role
    (12 / 600 / `letterSpacing: 1.8` / `#B0AEA8`), the done-rule card
    (`borderRadius: 16`, `#FFFFFF`, `boxShadow: '0 0 0 1px rgba(0,0,0,0.07), 0 6px 16px rgba(40,38,32,0.05)'`,
    `padding: 17px 18px`, `gap: 14`) with its 20 × 20 / `viewBox 0 0 18 18` tick, and the
    four 38 × 38 icon tiles with the four verbatim SVGs of section b.10.

13. **`src/app/lesson/[slug].tsx` — `PageComplete`.** Swap `LessonCover size={128}` for
    `Orb size={36}`, centre the stack at `gap: 44`, retype title to 26 / 500 / 38 and body
    to 21 / 400 / 36 / `maxWidth: 310`, and change the copy to
    `Your answer is saved to the log. One decision tonight — get to tomorrow.`
    (em dash U+2014, spaced). Keep `Done` but drop `ctaWide`.

14. **`src/components/ChallengeSheet.tsx` — leave it alone or delete it.** It is not imported
    anywhere in `HEAD` and none of frames 16–26 describe a modal sheet. If the task boards
    (23, 24) are meant to replace it, delete the file once `PageTask` lands; otherwise it
    stays dead code and this spec has no design evidence to retune it against.
