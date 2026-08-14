# Sentence Journal — pixel spec

Transcribed from the final canvas bundle. Every number below is copied character for
character from the CSS; nothing is rounded and no theme token is substituted for a value
that differs. Where a number is *derived* (a right-edge from `left`+`right`, a bottom edge
from `top`+`height`) it is labelled **derived** and the arithmetic is shown.

## Header

| Sticky note | Frame label | Split file | Target app file |
|---|---|---|---|
| `21C · Affirmation — Sentence Journal` | Sentence Journal | `/Users/admin/Documents/tideline/.uifinal/pretty/final/Email Login/Sentence-Journal.html` (raw: `/Users/admin/Documents/tideline/.uifinal/final/Email Login/Sentence-Journal.html`) | `/Users/admin/Documents/tideline/src/app/affirmation.tsx` |
| `21C2 · Affirmation — Custom prompt` | Sentence Journal Custom prompt | `/Users/admin/Documents/tideline/.uifinal/pretty/final/Email Login/Sentence-Journal-Custom-prompt.html` (raw: `/Users/admin/Documents/tideline/.uifinal/final/Email Login/Sentence-Journal-Custom-prompt.html`) | `/Users/admin/Documents/tideline/src/app/affirmation.tsx` |

Sticky-note numbers read from `/Users/admin/Documents/tideline/UI_FINAL_LEDGER.md` lines 147–148.
Both rows are `NOT_STARTED`.

Diff read: `/Users/admin/Documents/tideline/.uifinal/diffs/Sentence-Journal.html.diff`
Prev frame read: `/Users/admin/Documents/tideline/.uifinal/pretty/prev/Email Login/Sentence-Journal.html`
**No prev frame and no diff exist for `Sentence-Journal-Custom-prompt`** — verified by
`ls` of `.uifinal/pretty/prev/Email Login/`, which contains only `Sentence-Journal.html`
for this family. Frame 21C2 is **brand new in this bundle**.

### What the diff changed (21C, prev → final)

The diff is 28 lines and contains exactly one hunk, an **addition only** — no line was
removed or modified. Everything from the frame shell down to the `Save today's line`
pill is byte-identical to prev. The addition is the second, white, outlined pill:

```
+    <div style="position:absolute; left:16px; right:16px; top:370px; height:52px;
+      border-radius:26px; background:#FFFFFF; box-shadow:0 0 0 1px rgba(0,0,0,0.08);
+      display:flex; align-items:center; justify-content:center; cursor:pointer;">
+      <span style="font-size:15.5px; font-weight:600; color:#1D1C1A;">Write my own prompt</span>
+    </div>
```

Together with the new 21C2 frame this is one feature: a **"write my own prompt"**
affordance and the authoring screen it opens. Neither exists in the app today.

---

## Status-bar offset rule (both frames)

Canvas `top` values are measured from the top of the 393×852 frame, which includes the
54px status-bar row the app never builds.

| Element | Canvas top | Canvas top − 54 |
|---|---|---|
| Skeleton block 1 | `164px` | `110px` |
| Skeleton block 2 | `228px` | `174px` |
| Skeleton block 3 | `544px` | `490px` |
| Sheet top edge | `320px` | `266px` |

**Which reading applies here: the raw canvas number, not the −54 number.** Evidence:
this screen has no safe-area container — `affirmation.tsx` renders a bare
`<View style={{flex:1}}>` and positions the dim, the skeleton and the sheet absolutely
from the physical screen top, so the app's origin and the canvas's origin are the same
point. The shipped code already uses `164 / 228 / 544 / 320` verbatim
(`affirmation.tsx:69–71, 29`) and that is correct. The −54 column is recorded above only
because the convention requires both numbers to be stated; **do not apply it to this
screen.** Every element *inside* the sheet is positioned relative to the sheet, so the
rule never touches those at all.

---

## 1. Frame shell (both frames, identical)

| Property | Value |
|---|---|
| Frame size | `393px` × `852px` |
| position / overflow | `relative` / `hidden` |
| background | `#F4F3F0` |
| font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` |
| font smoothing | `-webkit-font-smoothing:antialiased` |
| flex-shrink | `0` |
| box-shadow (canvas chrome only — **not app**) | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` |

No noise layer, no gradient, no backdrop-filter, no blend mode anywhere in either frame.

---

## 2. Underlying page skeleton (both frames, identical)

Wrapper: `position:absolute; inset:0; opacity:0.45;` — no z-index, so it is the bottom
paint layer. Non-interactive.

| # | left | right | top | height | width (**derived**) | bottom (**derived**) | border-radius | background |
|---|---|---|---|---|---|---|---|---|
| 1 | `12px` | `12px` | `164px` | `48px` | `369` (393−12−12) | `212` (164+48) | `12px` all corners | `#E8E7E1` |
| 2 | `36px` | `36px` | `228px` | `236px` | `321` (393−36−36) | `464` (228+236) | `16px` all corners | `#E8E7E1` |
| 3 | `12px` | `12px` | `544px` | `152px` | `369` (393−12−12) | `696` (544+152) | `14px` all corners | `#E8E7E1` |

The `0.45` opacity is on the **wrapper**, not per block — so the blocks do not composite
against each other. Reproduce it on the parent view.

---

## 3. Dim scrim (both frames, identical)

| Property | Value |
|---|---|
| position | `absolute` |
| inset | `0` (top/right/bottom/left = 0) |
| background | `rgba(38,37,30,0.42)` |
| z-index | `5` |
| blur / blend | none |

Paints above the skeleton (z 5 > implicit 0) and below the sheet (z 5 < 10).

---

## 4. Status bar (both frames, identical) — **canvas chrome, the app does not build it**

Recorded for completeness only. The app ships `<StatusBar style="dark" />` instead.

| Property | Value |
|---|---|
| position / top / left / right / height | `absolute` / `0` / `0` / `0` / `54px` |
| display / align-items / justify-content | `flex` / `center` / `space-between` |
| padding | `6px 32px 0 46px` (T/R/B/L) |
| box-sizing | `border-box` |
| z-index | `20` |
| Clock text | `9:41` — `17px` / `600` / `#1D1C1A` / letter-spacing `-0.2px` |
| Icon cluster | `display:flex; align-items:center; gap:7px` |

Signal — `width="19" height="12" viewBox="0 0 19 12"`, four rects, all `fill="#1D1C1A"`, all `rx="0.7"`:

```
<rect x="0"    y="7.5" width="3.2" height="4.5" rx="0.7" fill="#1D1C1A"/>
<rect x="4.8"  y="5"   width="3.2" height="7"   rx="0.7" fill="#1D1C1A"/>
<rect x="9.6"  y="2.5" width="3.2" height="9.5" rx="0.7" fill="#1D1C1A"/>
<rect x="14.4" y="0"   width="3.2" height="12"  rx="0.7" fill="#1D1C1A"/>
```

Wi-Fi — `width="17" height="12" viewBox="0 0 17 12"`:

```
M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z
```
```
M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z
```
plus `<circle cx="8.5" cy="10.5" r="1.5" fill="#1D1C1A"/>`. Both paths `fill="#1D1C1A"`.

Battery — `width="27" height="13" viewBox="0 0 27 13"`:

```
<rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="#1D1C1A" stroke-opacity="0.35" fill="none"/>
<rect x="2"   y="2"   width="20" height="9"  rx="2"   fill="#1D1C1A"/>
<path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill="#1D1C1A" fill-opacity="0.4"/>
```

---

## 5. Sheet container (both frames, identical)

| Property | Value |
|---|---|
| position | `absolute` |
| left / right | `0` / `0` |
| top | `320px` |
| bottom | `0` |
| height (**derived**) | `532` (852 − 320) |
| border-radius | `22px 22px 0 0` — TL `22`, TR `22`, BR `0`, BL `0` |
| background | `#F4F3F0` |
| z-index | `10` |
| box-shadow | `0 -12px 36px rgba(20,19,16,0.22)` — x `0`, y `-12`, blur `36`, spread `0`, colour `rgba(20,19,16,0.22)` |
| overflow | not set (visible) |

### 5a. Grabber (both frames, identical)

| Property | Value |
|---|---|
| position / left / margin-left | `absolute` / `50%` / `-18px` |
| top | `10px` (sheet-relative) → `330` frame-absolute (**derived**) |
| width / height | `36px` / `4px` |
| border-radius | `2px` all corners |
| background | `rgba(0,0,0,0.15)` |

---

## 6. FRAME 21C — Sentence Journal, element by element

All `top` values below are **sheet-relative**; the frame-absolute value (`+320`) is given
in the last column.

### 6.1 Prompt heading

| Property | Value |
|---|---|
| position | `absolute` |
| left / right | `24px` / `40px` |
| width (**derived**) | `329` (393 − 24 − 40) |
| top | `44px` → frame-absolute `364` |
| font-family | inherited sans (`-apple-system,'SF Pro Text',…`) |
| font-size | `22px` |
| font-weight | `500` |
| line-height | `29px` |
| letter-spacing | `-0.2px` |
| color | `#1D1C1A` |
| text-wrap | `pretty` (web-only; **no RN equivalent** — see §9 note 3) |
| text-transform / text-align | none / default (left) |
| max-lines | not set |
| Text | `Why are you choosing to abstain today?` |

At 22px in a 329px box this wraps to 2 lines → block height `58` (2 × 29) **derived**,
bottom `422` frame-absolute.

### 6.2 "Different prompt" reroll row

| Property | Value |
|---|---|
| position / left | `absolute` / `24px` |
| right | not set — row is content-width |
| top | `112px` → frame-absolute `432` |
| display / align-items / gap | `flex` / `center` / `7px` |
| padding / margin | none |

Glyph: `<svg width="13" height="13" viewBox="0 0 16 16">` — note the **13px render size
against a 16-unit viewBox** (scale factor 0.8125); the stroke width scales with it.

```
<path d="M13.5 6.5A6 6 0 1 0 14 9" fill="none" stroke="#8B8882" stroke-width="1.8" stroke-linecap="round"/>
<path d="M14 3v3.5h-3.5" fill="none" stroke="#8B8882" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
```

Label:

| Property | Value |
|---|---|
| font-size | `13px` |
| font-weight | `500` |
| color | `#8B8882` |
| letter-spacing / line-height | not set |
| Text | `Different prompt` |

### 6.3 Input card

| Property | Value |
|---|---|
| position | `absolute` |
| left / right | `16px` / `16px` |
| width (**derived**) | `361` (393 − 16 − 16) |
| top / height | `148px` / `126px` → frame-absolute `468`, bottom `594` (**derived** 148+126=274 sheet-relative) |
| border-radius | `14px` all four corners |
| background | `#FFFFFF` |
| box-shadow | `0 0 0 1px rgba(0,0,0,0.06)` — a **hairline ring**, x0 y0 blur0 spread1 |
| border | none (the ring is a shadow, not a border) |

Card text (the typed line):

| Property | Value |
|---|---|
| position | `absolute` |
| left / right | `18px` / `18px` (card-relative) |
| width (**derived**) | `325` (361 − 18 − 18) |
| top | `16px` (card-relative) |
| available height below top (**derived**) | `110` (126 − 16) |
| font-family | `Georgia,'Times New Roman',serif` |
| font-size | `17px` |
| font-style | **normal — 21C does NOT set italic** (contrast with 21C2, §7.3) |
| font-weight | not set → `400` |
| line-height | `26px` |
| color | `#1D1C1A` |
| letter-spacing | not set |
| Text | `Because I want to be at Maya’s recital on Friday with a clear head` (`&rsquo;` = U+2019) |

Caret (inline `<span>` after the text):

| Property | Value |
|---|---|
| display | `inline-block` |
| width / height | `2px` / `19px` |
| background | `#131313` |
| vertical-align | `-3px` |
| margin-left | `2px` |

### 6.4 Primary pill — "Save today's line"

| Property | Value |
|---|---|
| position | `absolute` |
| left / right | `16px` / `16px`; width `361` (**derived**) |
| top / height | `306px` / `52px` → frame-absolute `626`, bottom `678`; sheet-relative bottom `358` (**derived**) |
| border-radius | `26px` all corners (pill: 52/2) |
| background | `#131313` |
| box-shadow / border | none |
| display / align-items / justify-content | `flex` / `center` / `center` |
| cursor | `pointer` (web-only) |
| Label | `Save today’s line` — `17px` / `600` / `#FFFFFF`, no tracking, no leading set |

Gap from card bottom (274) to pill top (306) = **32px derived**.

### 6.5 Secondary pill — "Write my own prompt" — **NEW in this bundle**

| Property | Value |
|---|---|
| position | `absolute` |
| left / right | `16px` / `16px`; width `361` (**derived**) |
| top / height | `370px` / `52px` → frame-absolute `690`, bottom `742`; sheet-relative bottom `422` (**derived**) |
| border-radius | `26px` all corners |
| background | `#FFFFFF` |
| box-shadow | `0 0 0 1px rgba(0,0,0,0.08)` — **0.08, not the card's 0.06.** Do not unify. |
| border | none |
| display / align-items / justify-content | `flex` / `center` / `center` |
| cursor | `pointer` (web-only) |
| Label | `Write my own prompt` — `15.5px` / `600` / `#1D1C1A` |

`15.5px` is literal. Do not round to 15 or 16. It is deliberately **1.5px smaller** than
the primary pill's 17px.

Gap from primary pill bottom (358) to secondary pill top (370) = **12px derived**.
Space left below the secondary pill inside the 532-tall sheet = **110px derived**
(532 − 422).

### 6.6 Vertical map, frame 21C

| Element | Sheet-relative top → bottom | Frame-absolute top → bottom |
|---|---|---|
| Grabber | 10 → 14 | 330 → 334 |
| Heading (2 lines) | 44 → 102 | 364 → 422 |
| Reroll row | 112 → ~125 | 432 → ~445 |
| Input card | 148 → 274 | 468 → 594 |
| Primary pill | 306 → 358 | 626 → 678 |
| Secondary pill | 370 → 422 | 690 → 742 |
| Sheet floor | 532 | 852 |

---

## 7. FRAME 21C2 — Sentence Journal Custom prompt, element by element

Shell, skeleton, scrim, status bar, sheet and grabber are **byte-identical** to 21C
(lines 1–130 of both pretty files match apart from `data-screen-label`). Only the sheet
contents differ.

### 7.1 Title

| Property | Value |
|---|---|
| position / left / right | `absolute` / `24px` / `40px`; width `329` (**derived**) |
| top | `44px` → frame-absolute `364` |
| font-size / weight / line-height / letter-spacing | `22px` / `500` / `29px` / `-0.2px` |
| color | `#1D1C1A` |
| text-wrap | **not set** — 21C sets `pretty` on the same element, 21C2 does not (§9 note 3) |
| Text | `Write your own prompt` (single line at 22px in 329px) |

### 7.2 Subtitle

| Property | Value |
|---|---|
| position / left / right | `absolute` / `24px` / `24px`; width `345` (**derived**, 393−24−24) |
| top | `80px` → frame-absolute `400` |
| font-size | `13px` |
| font-weight | `400` (stated explicitly, unlike the 21C reroll label's `500`) |
| color | `#8B8882` |
| line-height / letter-spacing / align | not set / not set / default left |
| Text | `It’ll be waiting for you each morning.` (`&rsquo;` = U+2019) |

Gap heading baseline block → subtitle: title top 44, subtitle top 80 → **36px derived**.

### 7.3 Input card

| Property | Value |
|---|---|
| position / left / right | `absolute` / `16px` / `16px`; width `361` (**derived**) |
| top / height | `116px` / `126px` → frame-absolute `436`, bottom `562`; sheet-relative bottom `242` (**derived**) |
| border-radius | `14px` all corners |
| background | `#FFFFFF` |
| box-shadow | `0 0 0 1px rgba(0,0,0,0.06)` |

Card text:

| Property | Value |
|---|---|
| position / left / right / top | `absolute` / `18px` / `18px` / `16px` (card-relative); width `325` (**derived**) |
| font-family | `Georgia,'Times New Roman',serif` |
| font-size | `17px` |
| **font-style** | **`italic`** — present here, absent in 21C |
| line-height | `26px` |
| color | `#1D1C1A` |
| Text | `What does tomorrow-me get if I hold the line?` |

Caret span: identical to §6.3 — `display:inline-block; width:2px; height:19px; background:#131313; vertical-align:-3px; margin-left:2px`.

### 7.4 Primary pill — "Use this prompt"

| Property | Value |
|---|---|
| position / left / right | `absolute` / `16px` / `16px`; width `361` (**derived**) |
| top / height | `274px` / `52px` → frame-absolute `594`, bottom `646`; sheet-relative bottom `326` (**derived**) |
| border-radius | `26px` all corners |
| background | `#131313` |
| display / align-items / justify-content | `flex` / `center` / `center` |
| cursor | `pointer` (web-only) |
| Label | `Use this prompt` — `17px` / `600` / `#FFFFFF` |

Gap from card bottom (242) to pill top (274) = **32px derived** — the same 32 as 21C.

### 7.5 "Back to prompts" text link

| Property | Value |
|---|---|
| position | `absolute` |
| left / right | `0` / `0` — **full sheet width, 393** |
| top | `346px` → frame-absolute `666` |
| height | not set (content height) |
| text-align | `center` |
| font-size | `13.5px` — literal half-pixel; do not round |
| font-weight | `500` |
| color | `#8B8882` |
| line-height / letter-spacing | not set |
| cursor | `pointer` (web-only) |
| Text | `Back to prompts` |

Gap from pill bottom (326) to link top (346) = **20px derived**.
Space below the link inside the 532-tall sheet = **~186px derived** (532 − 346).

### 7.6 Vertical map, frame 21C2

| Element | Sheet-relative top → bottom | Frame-absolute top → bottom |
|---|---|---|
| Grabber | 10 → 14 | 330 → 334 |
| Title (1 line) | 44 → 73 | 364 → 393 |
| Subtitle | 80 → ~96 | 400 → ~416 |
| Input card | 116 → 242 | 436 → 562 |
| Primary pill | 274 → 326 | 594 → 646 |
| Back link | 346 → ~362 | 666 → ~682 |
| Sheet floor | 532 | 852 |

---

## 8. States the frames show — and the ones they do not

| State | Shown? | Evidence / what to infer |
|---|---|---|
| Input **filled** | Yes, both frames | Content colour `#1D1C1A`, full ink, plus caret span → this is a typed value, not a placeholder. |
| Input **empty / placeholder** | **No** | Neither frame shows an empty card. The canvas specifies **no placeholder colour**. The app's `rgba(139,136,130,0.7)` is an app invention with no canvas backing. |
| Caret / focus | Yes, both frames | 2×19 `#131313` bar. The field is focused in both frames; no separate focus ring, no border colour change. |
| Pill **pressed** | **No** | No pressed style in either frame. The app's 0.96 `PressScale` is an app-level behaviour, not a canvas value. |
| Pill **disabled** | **No** | The app's `opacity: saving ? 0.5 : 1` on the primary pill has no canvas backing. |
| Selected / multi-select | n/a | No selectable set in either frame. |
| Keyboard visible | **No** | Neither frame draws a keyboard, so the canvas never states the lifted geometry. The app's `lift` maths is an app-level inference (see §10 finding 3). |

---

## 9. Canvas asymmetries — named explicitly, do not "fix" them

1. **Italic on the Georgia line.** 21C2's card text sets `font-style:italic`; 21C's does
   not. Both are 17px Georgia / 26px leading / `#1D1C1A`. This is deliberate: 21C shows
   the user's *journal line* (roman), 21C2 shows the *prompt being authored* (italic,
   quoted). Do not unify.
2. **Hairline ring alphas differ.** Both input cards use `rgba(0,0,0,0.06)`; the new
   secondary pill uses `rgba(0,0,0,0.08)`. Two different values on the same screen,
   stated character for character in the CSS. Transcribe both.
3. **`text-wrap:pretty` appears in 21C but not 21C2** on the otherwise identical 22px/500
   heading. This is the one place the two frames contradict each other on a shared
   element. The evidence supports treating it as *incidental*: 21C's heading wraps to two
   lines in its 329px box so `pretty` has an effect there, and 21C2's fits on one line so
   the declaration would be inert. React Native has **no `textWrap` property at all**, so
   the distinction is unimplementable on native either way — the app renders neither.

---

## 10. Comparison — design vs current app

Current-app column read from `/Users/admin/Documents/tideline/src/app/affirmation.tsx`
(144 lines, read in full), `/Users/admin/Documents/tideline/src/components/day/kit.tsx:684-691`
(`RerollGlyph`), `/Users/admin/Documents/tideline/src/components/ui/press-scale.tsx`,
`/Users/admin/Documents/tideline/src/components/ui/AppText.tsx`, and
`/Users/admin/Documents/tideline/src/lib/theme.ts:191-220`.

### 10a. Frame 21C — Sentence Journal

| Property | Design value | Current app value | Verdict |
|---|---|---|---|
| Screen background | `#F4F3F0` | `'#F4F3F0'` (L64) | match |
| Skeleton wrapper opacity | `0.45` | `0.45` (L68) | match |
| Skeleton block 1 | l12 r12 t164 h48 r12 `#E8E7E1` | l12 r12 t164 h48 r12 `#E8E7E1` (L69) | match |
| Skeleton block 2 | l36 r36 t228 h236 r16 `#E8E7E1` | l36 r36 t228 h236 r16 `#E8E7E1` (L70) | match |
| Skeleton block 3 | l12 r12 t544 h152 r14 `#E8E7E1` | l12 r12 t544 h152 r14 `#E8E7E1` (L71) | match |
| Dim scrim colour | `rgba(38,37,30,0.42)` | `'rgba(38,37,30,0.42)'` (L78) | match |
| Dim scrim z-order | `z-index:5`, below sheet | Pressable declared before the sheet → paints below | match |
| Dim scrim interactivity | canvas silent | `onPress={close}`, `accessibilityLabel="Close"` | canvas silent — app addition, keep |
| Status-bar row | 54px row, clock + 3 SVGs | not built; `<StatusBar style="dark" />` (L65) | match (by convention) |
| Sheet top | `320px` | `SHEET_TOP = 320` (L29), `top: SHEET_TOP - lift` (L86) | match |
| Sheet radii | `22px 22px 0 0` | `borderTopLeftRadius: 22, borderTopRightRadius: 22` (L88-89) | match |
| Sheet background | `#F4F3F0` | `'#F4F3F0'` (L90) | match |
| Sheet shadow | `0 -12px 36px rgba(20,19,16,0.22)` | `boxShadow: '0 -12px 36px rgba(20,19,16,0.22)'` (L91) | match |
| Grabber | l50% ml−18 t10 36×4 r2 `rgba(0,0,0,0.15)` | identical (L93) | match |
| Heading position | l24 r40 t44 | l24 r40 t44 (L95) | match |
| Heading type | 22 / 500 / 29 / −0.2 / `#1D1C1A` | `sans('500')` + `fontSize:22, lineHeight:29, letterSpacing:-0.2, color:'#1D1C1A'` (L95) | match |
| Heading text | `Why are you choosing to abstain today?` | `PROMPTS[0]` = same string (L21) | match |
| Heading `text-wrap:pretty` | `pretty` | no equivalent | N/A on RN (§9 note 3) |
| Reroll row position | l24 t112, row, gap 7 | l24 t112, `flexDirection:'row'`, `gap:7` (L103) | match |
| Reroll row min height | content height | `minHeight: 0` override of `PressScale`'s 44 default (L103) | match (override required) |
| Reroll glyph size / viewBox | `13`×`13`, `0 0 16 16` | `size={13}`, `viewBox="0 0 16 16"` (kit.tsx:686) | match |
| Reroll path 1 `d` | `M13.5 6.5A6 6 0 1 0 14 9` | identical (kit.tsx:687) | match |
| Reroll path 2 `d` | `M14 3v3.5h-3.5` | identical (kit.tsx:688) | match |
| Reroll stroke / width / caps | `#8B8882` / `1.8` / round (+ round join on p2) | identical (kit.tsx:687-688) | match |
| Reroll label | `Different prompt`, 13 / 500 / `#8B8882` | same string, `sans('500')`, 13, `#8B8882` (L105) | match |
| Input card | l16 r16 t148 h126 r14 `#FFFFFF` + `0 0 0 1px rgba(0,0,0,0.06)` | identical (L108) | match |
| Card text position | l18 r18 t16 | l18 r18 t16 (L116) | match |
| Card text font | `Georgia,'Times New Roman',serif` | `fontFamily: fonts.quote` → iOS `Georgia`, web `Georgia,'Times New Roman',serif`, **Android `serif`** (theme.ts:220) | match on iOS/web; Android substitutes the platform serif |
| Card text size / leading / colour | 17 / 26 / `#1D1C1A` | 17 / 26 / `#1D1C1A` (L116) | match |
| Card text style | roman (no `font-style`) | no `fontStyle` set | match |
| Card text height | canvas silent (110px of room below top) | `height: 94` (L116) | canvas silent — app inference (16 top + 94 + 16 bottom = 126) |
| Card content state | filled value, ink `#1D1C1A` | rendered as **placeholder** with `rgba(139,136,130,0.7)` (L113-114) | state difference — canvas never shows empty; see §8 |
| Caret | 2×19 `#131313`, `vertical-align:-3px`, `margin-left:2px` | no `selectionColor` / `cursorColor` set → platform default (blue on iOS) | **MISMATCH** |
| Primary pill box | l16 r16 t306 h52 r26 `#131313` | identical, plus `minHeight: 52` (L126-137) | match |
| Primary pill label | `Save today’s line`, 17 / 600 / `#FFFFFF` | same string, `sans('600')`, 17, `#FFFFFF` (L139) | match |
| Primary pill disabled tint | not shown by canvas | `opacity: saving ? 0.5 : 1` (L137) | canvas silent — app addition |
| **Secondary pill box** | l16 r16 **t370** h52 r26 `#FFFFFF` + `0 0 0 1px rgba(0,0,0,0.08)` | **absent** | **MISMATCH — missing element** |
| **Secondary pill label** | `Write my own prompt`, **15.5** / 600 / `#1D1C1A` | **absent** | **MISMATCH — missing element** |
| Bottom-most control bottom edge | `422` sheet-relative | `PILL_BOTTOM = 358` (L30) | **MISMATCH — keyboard lift maths is 64px short** |

### 10b. Frame 21C2 — Custom prompt

The app has **no custom-prompt screen, route, state flag or storage**. Every row is a
missing element; the "current app value" column records what exists in its place.

| Property | Design value | Current app value | Verdict |
|---|---|---|---|
| Screen exists at all | full sheet variant | no state, no route, no branch in `affirmation.tsx` | **MISMATCH — entire frame missing** |
| Title | `Write your own prompt`, l24 r40 t44, 22 / 500 / 29 / −0.2 / `#1D1C1A` | n/a | **MISMATCH** |
| Subtitle | `It’ll be waiting for you each morning.`, l24 r24 t80, 13 / 400 / `#8B8882` | n/a | **MISMATCH** |
| Input card | l16 r16 **t116** h126 r14 `#FFFFFF` + ring `rgba(0,0,0,0.06)` | n/a | **MISMATCH** |
| Card text | Georgia serif, 17, **italic**, 26, `#1D1C1A` | n/a | **MISMATCH** |
| Card text sample | `What does tomorrow-me get if I hold the line?` | n/a | **MISMATCH** |
| Caret | 2×19 `#131313` | n/a | **MISMATCH** |
| Primary pill | l16 r16 **t274** h52 r26 `#131313` | n/a | **MISMATCH** |
| Primary pill label | `Use this prompt`, 17 / 600 / `#FFFFFF` | n/a | **MISMATCH** |
| Back link | `Back to prompts`, l0 r0 t346, centered, **13.5** / 500 / `#8B8882` | n/a | **MISMATCH** |
| Prompt persistence | subtitle promises "each morning" → the custom prompt outlives the session | `PROMPTS` is a hard-coded 5-item array (L20-26); nothing is stored | **MISMATCH — behaviour** |
| Reroll row | **absent** in 21C2 | n/a | (nothing to build) |

### 10c. Non-pixel notes verified while reading the app

| Item | Finding |
|---|---|
| `AppText` metric inheritance | `AppText` deletes inherited `lineHeight`/`letterSpacing` when a caller names its own `fontSize` and stays silent about them (`AppText.tsx:117-139`). So `fontSize:13` + no tracking yields tracking `0`, which is what both frames specify. Safe to keep using `AppText` for the new nodes. |
| `PressScale` default `minHeight: 44` | `press-scale.tsx:33`. Any absolutely-positioned `PressScale` whose canvas height is < 44 (the reroll row, the new back link) must pass `minHeight: 0` and compensate with `hitSlop`, exactly as the reroll row already does (L102-103). |
| Doc comment frame number | `affirmation.tsx:12` says "Frame 115 · Affirmation"; the ledger sticky is `21C`. Stale comment. |
| Route entry point | `/affirmation` is reached from `src/app/(app)/all.tsx:56` (`{ title: 'Sentence journal', to: '/affirmation' }`). It is the only entry. |
| Colour tokens | `#F4F3F0`, `#131313`, `#1D1C1A`, `#8B8882` all exist as `colors.bg / colors.ink / colors.text / colors.textSoft` with identical values (theme.ts:29, 44, 52, 56). `#E8E7E1` has no token. The file's house style hard-codes them; keep that. |

---

## 11. Visualization section

**There is no chart, ring, gauge, calendar, streak visual or plotted data in either
frame.** The only custom vector content is:

1. The three status-bar glyphs (§4) — canvas chrome, not built by the app.
2. The reroll glyph (§6.2) — a 13×13 render of a 16-unit viewBox, two stroked paths,
   `d` strings transcribed verbatim above and already matched exactly by
   `RerollGlyph` in `src/components/day/kit.tsx:684-691`. No fill, no gradient, no
   clip path, no mask, no dash array.
3. The text caret (§6.3 / §7.3) — a plain 2×19 rectangle, not a drawing.

No coordinate system, data domain, axis, tick or gridline exists to specify.

---

## 12. What must change — ordered

All edits land in **`/Users/admin/Documents/tideline/src/app/affirmation.tsx`**.

1. **Add the secondary pill to the default view.** A `PressScale` at
   `position:'absolute', left:16, right:16, top:370, height:52, minHeight:52,
   borderRadius:26, backgroundColor:'#FFFFFF', boxShadow:'0 0 0 1px rgba(0,0,0,0.08)',
   alignItems:'center', justifyContent:'center'`, containing
   `<AppText style={[sans('600'), { fontSize: 15.5, color: '#1D1C1A' }]}>Write my own prompt</AppText>`.
   Note the ring alpha is `0.08` (not the card's `0.06`) and the label is `15.5` (not 17).

2. **Fix the keyboard-lift constant.** `PILL_BOTTOM = 358` (line 30) is the *primary*
   pill's bottom edge. The bottom-most control is now the secondary pill at `422`.
   Change to `422` in the default view, or the new pill sits under the keyboard.
   (Check: `852 − 320 − 422 = 110px` of free sheet below it, vs the 174 the old constant
   assumed.) When the custom-prompt view is showing, the bottom-most control is the back
   link at `~362`, so the constant must be view-dependent, not a single module constant.

3. **Build the custom-prompt view (frame 21C2).** Add a `mode: 'journal' | 'custom'`
   state to the same screen — the shell, skeleton, scrim, sheet and grabber are
   byte-identical between frames, so only the sheet body swaps. Wire the new secondary
   pill to `setMode('custom')`. Contents, in order:
   - Title `Write your own prompt` — `l24 r40 t44`, `sans('500')`, `fontSize:22,
     lineHeight:29, letterSpacing:-0.2, color:'#1D1C1A'`.
   - Subtitle `It’ll be waiting for you each morning.` — `l24 r24 t80`, `sans('400')`,
     `fontSize:13, color:'#8B8882'`.
   - Card `l16 r16 t116 h126 r14 #FFFFFF` + `boxShadow:'0 0 0 1px rgba(0,0,0,0.06)'`,
     holding a `TextInput` at `l18 r18 t16` with `fontFamily: fonts.quote, fontSize:17,
     fontStyle:'italic', lineHeight:26, color:'#1D1C1A', padding:0`. **Italic here only.**
   - Primary pill `l16 r16 t274 h52 r26 #131313`, label `Use this prompt`
     (`sans('600')`, 17, `#FFFFFF`).
   - Back link at `l0 r0 t346`, `textAlign:'center'`, `sans('500')`, `fontSize:13.5,
     color:'#8B8882'`, `minHeight:0` + `hitSlop`, `onPress={() => setMode('journal')}`.

4. **Persist the custom prompt.** The 21C2 subtitle promises the prompt returns "each
   morning", so `Use this prompt` must store it (not just set local state) and the
   default view must prefer the stored prompt over `PROMPTS[promptIndex]`. `PROMPTS`
   (lines 20-26) becomes the fallback rotation, not the only source.

5. **Set the caret colour on both `TextInput`s.** Canvas caret is `#131313`; the app
   currently inherits the platform default. Add `selectionColor="#131313"` (iOS caret +
   selection) and `cursorColor="#131313"` (Android).

6. **Optional, low priority:** correct the stale `Frame 115` doc comment on line 12 to
   `21C / 21C2`, and note that `fonts.quote` resolves to Android's generic `serif`
   rather than Georgia — the only platform where the card text will not be Georgia.
