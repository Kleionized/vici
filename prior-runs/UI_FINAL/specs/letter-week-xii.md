# Letter · Week XII — pixel spec

## Header

| Field | Value |
| --- | --- |
| Sticky-note number | The bundle carries **none** — the only frame identity in the HTML is `data-screen-label="Letter Week XII"`, and `.uifinal/diff-email-login.txt` lists frames by label (`~ Letter Week XII  (7259 -> 7225, -34)`). The app numbers itself: `src/app/letter.tsx` header says `109 → 111 for the week-XII letter`, and `Week12Letter` is tagged `111 · the letter he sealed on night zero, read back from week XII`. Numbers below are quoted from the app, not the canvas. |
| Frame label | `Letter Week XII` |
| Final frame | `/Users/admin/Documents/tideline/.uifinal/pretty/final/Email Login/Letter-Week-XII.html` (381 lines) |
| Raw frame | `/Users/admin/Documents/tideline/.uifinal/final/Email Login/Letter-Week-XII.html` |
| Prev frame | `/Users/admin/Documents/tideline/.uifinal/pretty/prev/Email Login/Letter-Week-XII.html` (384 lines) — **changed** |
| Diff | `/Users/admin/Documents/tideline/.uifinal/diffs/Letter-Week-XII.html.diff` |
| Target app file | `/Users/admin/Documents/tideline/src/app/letter.tsx` (583 lines) |
| Blast radius | `LetterBody` / `LetterFooter` are exported and also consumed by `/Users/admin/Documents/tideline/src/app/medallion-post.tsx` (lines 74, 84). `MailSheet` is also consumed by `/Users/admin/Documents/tideline/src/app/drop.tsx` (line 76). **Their sibling frames did not change** — see "Scoping" below. |
| Frame box | 393 × 852, `position:relative`, `overflow:hidden`, `flex-shrink:0`, `background:#EDECE7`, frame shadow `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` (board chrome, not app) |
| Status bar | Canvas reserves 54px at the top. **App top = canvas frame top − 54.** Both numbers stated everywhere below. |
| Font stack | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` + `-webkit-font-smoothing:antialiased` → app `sans(weight)` (`'System'` on iOS, `sansFamily` in `src/lib/theme.ts:161`) |

### Coordinate conventions used below

* **Frame y** — y inside the 393 × 852 div (includes the 54px status bar).
* **Sheet y** — y measured from the sheet's own top edge, which is frame y 52.
* **App y** — frame y − 54. Because the app places the sheet at `top:-2` (= 52 − 54), every *sheet-relative* offset below is used verbatim in the app with no arithmetic.

---

## What the diff changed (final vs prev)

Four edits, all geometry. No colour, type, copy, icon or illustration geometry changed.

| # | Property | Prev | Final |
| --- | --- | --- | --- |
| 1 | Scroll body `bottom` (sheet-relative) | `bottom:160px` | `bottom:80px` |
| 2 | Scene block margin | `margin:2px auto 18px` | `margin:36px auto 40px` |
| 3 | Primary pill | **absolute** sibling of the body: `left:24px; right:24px; bottom:88px` | **in flow**, last child *inside* the scroll body: `margin:56px 0 6px` (block flex container, so width = body width) |
| 4 | Secondary link `bottom` | `bottom:44px` | `bottom:36px` |

**Design intent, stated plainly.** The pill was lifted out of the chrome and dropped into the letter itself. It is now the last thing in the scroll flow, ~160pt below the fold (arithmetic in §7), so the letter has to be read before it can be taken. The body grew 80pt taller to reclaim the space the floating pill used to reserve, and the scene got room to breathe (36 above / 40 below instead of 2 / 18).

### Scoping — do not fix this globally

The two sibling frames that share `LetterBody` / `LetterFooter` are marked `=` (unchanged) in `.uifinal/diff-email-login.txt` and still carry the **prev** geometry:

| Frame | Body `bottom` | Pill | Secondary |
| --- | --- | --- | --- |
| `Letter-Read.html` (172 · the post letter) | `bottom:160px` (line 113) | absolute `bottom:88px` (line 196) | `bottom:44px` (line 223) |
| `Medallion-Letter.html` | `bottom:160px` (line 113) | absolute `bottom:88px` (line 150) | `bottom:44px` (line 177) |
| `Letter-Week-XII.html` (**this frame**) | `bottom:80px` | **in flow**, `margin:56px 0 6px` | `bottom:36px` |

So the four edits must be opt-in (props / a week-XII-only branch), not a rewrite of the shared primitives.

---

## 1. Frame chrome and status bar

| Element | Property | Canvas value | App value | Verdict |
| --- | --- | --- | --- | --- |
| Frame | background | `#EDECE7` | `LetterScreen` root `backgroundColor: phase === 'arrive' ? '#F4F3F0' : '#EDECE7'` → `#EDECE7` in the read phase (`letter.tsx:101`) | match |
| Status bar | height / z | `height:54px`, `z-index:20`, `padding:6px 32px 0 46px`, `box-sizing:border-box`, flex row, `align-items:center`, `justify-content:space-between` | not built — OS bar; `<StatusBar style="dark" />` (`letter.tsx:102`) | match (by intent) |
| Clock | type | `font-size:17px; font-weight:600; color:#1D1C1A; letter-spacing:-0.2px`, text `9:41` | OS | n/a |
| Signal / wifi / battery | — | three inline SVGs, `gap:7px`, ink `#1D1C1A` (battery outline `stroke-opacity:0.35`, nub `fill-opacity:0.4`) | OS | n/a |

The status-bar glyph paths are board chrome and are never rebuilt; they are transcribed once in §8 for completeness.

---

## 2. The sheet

Canvas: `position:absolute; left:0; right:0; top:52px; bottom:0; border-radius:24px 24px 0 0; background:#F4F3F0; overflow:hidden;`

| Property | Design value | Current app value (`MailSheet`, `letter.tsx:343–383`) | Verdict |
| --- | --- | --- | --- |
| left / right | `0` / `0` | `left: 0, right: 0` | match |
| top | frame y **52** → app y **−2** | `top: -2` | match |
| bottom | `0` | `bottom: 0` | match |
| Height | 852 − 52 = **800** | screen height + 2 (fills to bottom) | match |
| border-radius | `24px 24px 0 0` (TL 24, TR 24, BR 0, BL 0) | `borderTopLeftRadius: 24, borderTopRightRadius: 24` | match |
| background | `#F4F3F0` | `backgroundColor: '#F4F3F0'` | match |
| overflow | `hidden` | `overflow: 'hidden'` | match |
| Safe-area handling | n/a | `SafeAreaView edges={['top']}` + a plain flex child that carries the inset into its border box (Yoga lays an absolute child out from the *border* box and ignores padding) | match |

### 2a. Grain

| Property | Design value | Current app value (`letter.tsx:361`) | Verdict |
| --- | --- | --- | --- |
| Box | `position:absolute; inset:0` | `position:'absolute', top:0, left:0, right:0, bottom:0` | match |
| Source | `url('noise-dark.png')` | `require('../../assets/images/noise-dark.png')` (`letter.tsx:34`) | match |
| opacity | `0.07` | `opacity: 0.07` | match |
| pointer-events | `none` | `pointerEvents="none"` | match |
| fit | CSS default `background-repeat:repeat`, `background-size:auto` | `contentFit="cover"` | **deviation** (pre-existing, shared by every screen in the app) |
| Paint order | first child of the sheet, under everything | first child | match |

### 2b. Grabber

| Property | Design value | Current app value (`letter.tsx:363–365`) | Verdict |
| --- | --- | --- | --- |
| Wrapper | `left:0; right:0; top:12px; display:flex; justify-content:center` | `left:0, right:0, top:12, alignItems:'center'` | match |
| Size | `38px × 5px` | `width: 38, height: 5` | match |
| border-radius | `3px` (all four) | `borderRadius: 3` | match |
| background | `rgba(19,19,19,0.16)` | `'rgba(19,19,19,0.16)'` | match |
| pointer-events | (none declared) | `pointerEvents="none"` | app is stricter — harmless |

### 2c. Close ✕

| Property | Design value | Current app value (`letter.tsx:367–376`) | Verdict |
| --- | --- | --- | --- |
| Position | `position:absolute; right:22px; top:26px` (sheet-relative) | `right: 22, top: 26` | match |
| Rendered size | `width="20" height="20"` | `width={20} height={20}` | match |
| viewBox | `0 0 20 20` | `viewBox="0 0 20 20"` | match |
| stroke | `#55534E` | `stroke="#55534E"` | match |
| stroke-width | `2` | `strokeWidth={2}` | match |
| stroke-linecap | `round` | `strokeLinecap="round"` | match |
| fill | none declared → the path has no fill because it is stroke-only geometry with no closed subpath | (same) | match |
| Hit target | none (CSS `cursor` not even set on this one) | `hitSlop={{top:16,bottom:16,left:16,right:16}}`, `minHeight: 0` | app addition (required on device) |

```
M3 3l14 14M17 3L3 17
```

---

## 3. The scroll body

Canvas: `position:absolute; left:34px; right:34px; top:84px; bottom:80px; overflow:auto;`

| Property | Design value | Current app value (`LetterBody`, `letter.tsx:386–395`) | Verdict |
| --- | --- | --- | --- |
| left | `34` | `left: 34` | match |
| right | `34` | `right: 34` | match |
| top | sheet y **84** (frame y 136) | `top: 84` | match |
| bottom | **`80`** | `bottom: 160` | **MISMATCH** |
| Content width | 393 − 34 − 34 = **325** | 325 | match |
| Viewport height | 800 − 84 − 80 = **636** | 800 − 84 − 160 = 556 | **MISMATCH** (consequence of the row above) |
| overflow | `auto` (scrolls; a scrollbar is available) | `ScrollView` + `showsVerticalScrollIndicator={false}` | see §7 note |
| Scroll adjust | n/a | `contentInsetAdjustmentBehavior="never"` | match (by intent) |
| Docstring | — | `letter.tsx:385` still reads "top 84, bottom 160" — stale once fixed | must be updated |

### 3a. Salutation

Canvas `<div>`: `font-size:18px; font-weight:600; letter-spacing:-0.1px; color:#1D1C1A; margin:0 0 22px;` — text `Sam &mdash;` (first name, space, U+2014 em dash).

| Property | Design value | Current app value (`Salutation`, `letter.tsx:449–451`; call site `letter.tsx:514–516`) | Verdict |
| --- | --- | --- | --- |
| font-family | SF Pro Text | `sans('600')` → `'System'` | match |
| font-weight | `600` | `'600'` | match |
| font-size | `18px` | `fontSize: 18` | match |
| line-height | not declared → `normal` (≈ 1.2 em ≈ 21.5px for SF Pro Text) | not declared → RN font-natural line height | match |
| letter-spacing | `-0.1px` | `letterSpacing: -0.1` | match |
| text-transform | none | none | match |
| text-align | inherited `left` | default `left` | match |
| colour | `#1D1C1A` | `color: '#1D1C1A'` | match |
| max-lines | none | none | match |
| margin | `0 0 22px 0` | `marginBottom: 22` (`gap={22}`) | match |
| Copy | `Sam —` | `{name} —`, `name = user?.displayName?.trim().split(/\s+/)[0] || 'friend'` (`letter.tsx:66`) | match |

### 3b. Body paragraphs — shared type

All four `<p>` share: `font-size:15.5px; font-weight:400; line-height:1.8; color:#3A3934; text-wrap:pretty;`

| Property | Design value | Current app value (`LetterP`, `letter.tsx:454–456`) | Verdict |
| --- | --- | --- | --- |
| font-weight | `400` | `sans('400')` | match |
| font-size | `15.5px` | `fontSize: 15.5` | match |
| line-height | `1.8` → **27.9px** | `lineHeight: 15.5 * 1.8` = 27.9 | match |
| letter-spacing | not declared → `normal` (0) | not declared | match |
| colour | `#3A3934` | `color: '#3A3934'` | match |
| text-align | `left` | `left` | match |
| text-wrap | `pretty` | no RN equivalent | **deviation, unfixable** — RN has no orphan/ragged-edge control. Expect slightly different last-line breaks. |
| max-lines | none | none | match |

### 3c. Body paragraphs — per-paragraph spacing and copy

CSS collapses adjacent block margins to `max(bottom, top)`; Yoga adds them. The **Effective gap** column is what the canvas actually opens, and is the number the app must reproduce.

| # | Canvas margin | Next sibling's margin-top | **Effective gap below** | App gap prop | Verdict |
| --- | --- | --- | --- | --- | --- |
| p1 | `0 0 20px` | 0 (p2) | **20** | `gap={20}` (`letter.tsx:517`) | match |
| p2 | `0 0 16px` | **36** (scene) | **36** | `gap={16}` (`letter.tsx:518`) + scene `marginTop` 0 → **16** | **MISMATCH** |
| scene | `36px auto 40px` | 0 (p3) | **40** below | `marginBottom: 18` (`letter.tsx:548`) | **MISMATCH** |
| p3 | `0 0 20px` | 0 (p4) | **20** | `gap={20}` (`letter.tsx:523`) | match |
| p4 | `0` | **26** (signoff) | **26** | `gap={0}` (`letter.tsx:527`) + `Signoff gap={26}` → 26 | match |

Copy, verbatim (canvas → app):

| # | Canvas text | App text | Verdict |
| --- | --- | --- | --- |
| p1 | `It’s week XII where I’m writing from, and the first thing to say is: we made it out.` | identical (`letter.tsx:517`) | match |
| p2 | `The first three weekends were the worst of it, so I’ll say it plainly: nothing you feel this month lasts longer than a night. You wait one out, and the next one comes back smaller.` | identical (`letter.tsx:518–521`) | match |
| p3 | `The late nights stopped being dangerous around week IV. The urges got shorter, then quieter, then rare — somewhere in week IX I stopped bracing for them.` | identical (`letter.tsx:523–526`) | match |
| p4 | `Everything you circled tonight — it’s here, waiting.` | identical (`letter.tsx:527`) | match |

Curly apostrophes are U+2019 (`&rsquo;`), dashes are U+2014 (`&mdash;`).

### 3d. Signoff

Canvas `<div>`: `font-size:16px; font-weight:600; color:#1D1C1A; margin-top:26px;` — text `&mdash; Sam, at week XII`.

| Property | Design value | Current app value (`Signoff`, `letter.tsx:466–475`; call `letter.tsx:528`) | Verdict |
| --- | --- | --- | --- |
| font-weight | `600` | `sans('600')` | match |
| font-size | `16px` | `fontSize: 16` | match |
| line-height | `normal` | RN natural | match |
| letter-spacing | not declared → 0 | not declared | match |
| colour | `#1D1C1A` | `'#1D1C1A'` | match |
| margin-top | `26px`, collapsed against p4's `margin-bottom:0` → **26 effective** | `marginTop: 26` (`gap={26}`) | match |
| Copy | `— Sam, at week XII` | `— {name}, at week XII` | match |

### 3e. Pen stroke

Canvas `<svg width="150" height="12" viewBox="0 0 150 12" style="margin-top:4px">`.

| Property | Design value | Current app value (`letter.tsx:470–472`) | Verdict |
| --- | --- | --- | --- |
| Rendered size | `150 × 12` | `width={150} height={12}` | match |
| viewBox | `0 0 150 12` | `viewBox="0 0 150 12"` | match |
| margin-top | `4px` | `marginTop: 4` | match |
| stroke | `rgba(38,38,31,0.5)` | `stroke="rgba(38,38,31,0.5)"` | match |
| stroke-width | `1.6` (user units = rendered px, scale 1:1) | `strokeWidth={1.6}` | match |
| fill | `none` | `fill="none"` on both `<Svg>` and `<Path>` | match |
| stroke-linecap | `round` | `strokeLinecap="round"` | match |
| stroke-linejoin | not declared → `miter` | not declared | match |

```
M2 8 C 34 2, 58 10, 86 6 S 132 4, 148 7
```

**One CSS nuance to be aware of.** An `<svg>` in HTML is an inline *replaced* element, so it sits on the text baseline of an anonymous line box. Its 12px + 4px margin box is aligned on that baseline, and the strut of the containing block (font-size 16px inherited from the frame root, `line-height:normal`) adds roughly 4px of descender space *below* it before the block ends. The app renders `<Svg>` as a block-level view with no such slack. Net: the app's gap between the pen stroke and whatever follows is ~4px tighter than the browser's. Called out, not "fixed" — inventing 4px would contradict the transcribed values.

---

## 4. Primary pill — "Tuck it into your Log"

**This is the element the diff moved.** In the final frame it is the **last child of the scroll body** (opens at line 342, closes at 365, inside the body div that closes at line 366), not a sibling of it.

Canvas: `margin:56px 0 6px; height:54px; border-radius:27px; background:#131313; display:flex; align-items:center; justify-content:center; gap:9px; cursor:pointer;`

| Property | Design value | Current app value (`LetterFooter`, `letter.tsx:411–436`) | Verdict |
| --- | --- | --- | --- |
| Layout mode | **in flow**, block-level flex container inside the scroll body | `position: 'absolute'` | **MISMATCH** |
| Left edge (sheet x) | **34** (inherits the body's content box) | `left: 24` | **MISMATCH** |
| Right edge (sheet x) | **359** (393 − 34) | `right: 24` → 369 | **MISMATCH** |
| Width | **325** | 345 | **MISMATCH** |
| Vertical placement | `margin-top:56px` after the pen stroke, `margin-bottom:6px` (the body's last content) | `bottom: 88` off the sheet bottom | **MISMATCH** |
| margin left / right | `0` / `0` | n/a (stretched by left/right) | n/a |
| height | `54px` | `height: 54` | match |
| border-radius | `27px` all four corners (= height/2, full pill) | `borderRadius: 27` | match |
| background | `#131313` | `backgroundColor: '#131313'` | match |
| border | none | none | match |
| shadow | none | none | match |
| flex-direction | `row` (CSS default) | `flexDirection: 'row'` | match |
| align-items | `center` | `alignItems: 'center'` | match |
| justify-content | `center` | `justifyContent: 'center'` | match |
| gap | `9px` | `gap: 9` | match |
| flex-wrap | `nowrap` (default) | default | match |
| cursor | `pointer` | `PressScale` → `scale 0.96` over 110ms in, 160ms out | app addition (native press state; canvas shows no pressed state) |

### 4a. Bookmark icon

| Property | Design value | Current app value (`letter.tsx:427–434`) | Verdict |
| --- | --- | --- | --- |
| Rendered size | `16 × 16` | `width={16} height={16}` | match |
| viewBox | `0 0 24 24` (scale factor 16/24 = **0.6667**) | `viewBox="0 0 24 24"` | match |
| `fill` on `<svg>` | `none` | `fill="none"` | match |
| stroke | `#FFFFFF` | `stroke="#FFFFFF"` | match |
| stroke-width | `2` user units → **1.333 rendered px** | `strokeWidth={2}` | match |
| stroke-linejoin | `round` | `strokeLinejoin="round"` | match |
| stroke-linecap | not declared → `butt` | not declared | match |
| Order | icon first, then label (gap 9 between) | same | match |

```
M6 4.4h12a1 1 0 0 1 1 1v14.3a.8.8 0 0 1-1.27.65L12 16.7l-5.73 3.65A.8.8 0 0 1 5 19.7V5.4a1 1 0 0 1 1-1z
```

### 4b. Pill label

| Property | Design value | Current app value (`letter.tsx:435`) | Verdict |
| --- | --- | --- | --- |
| font-size | `16.5px` | `fontSize: 16.5` | match |
| font-weight | `600` | `sans('600')` | match |
| letter-spacing | `0.2px` | `letterSpacing: 0.2` | match |
| line-height | `normal` | RN natural | match |
| text-transform | none | none | match |
| colour | `#FFFFFF` | `color: '#FFFFFF'` | match |
| Copy | `Tuck it into your Log` | `primary="Tuck it into your Log"` (`letter.tsx:119`) | match |

Behaviour note (not a visual property): `keep()` at `letter.tsx:77–91` short-circuits for `variant === 'week12'` and only dismisses — the week-XII letter was written to the Log the night it was sealed. That is correct and unaffected by this spec.

---

## 5. Secondary link — "Continue"

Canvas: `position:absolute; left:0; right:0; bottom:36px; text-align:center; font-size:14.5px; font-weight:500; color:#8B8882; cursor:pointer;` — sibling of the scroll body, inside the sheet.

| Property | Design value | Current app value (`letter.tsx:437–443`) | Verdict |
| --- | --- | --- | --- |
| left / right | `0` / `0` (full sheet width) | `left: 0, right: 0` | match |
| bottom (sheet-relative) | **`36`** | `bottom: 44` | **MISMATCH** |
| text-align | `center` | `alignItems: 'center'` on the wrapper | match |
| font-size | `14.5px` | `fontSize: 14.5` | match |
| font-weight | `500` | `sans('500')` | match |
| letter-spacing | not declared → 0 | not declared | match |
| line-height | `normal` (≈ 17.3px) | RN natural | match |
| colour | `#8B8882` | `color: '#8B8882'` | match |
| Copy | `Continue` | `secondary={variant === 'week12' ? 'Continue' : 'Close'}` (`letter.tsx:119`) → `Continue` | match |
| Hit target | full sheet width × line height | text width + `hitSlop {14,14,40,40}`, `minHeight: 0` | app addition |

**Clearance check.** The link box occupies sheet-bottom 36 → ~53.3. The body's bottom edge is at sheet-bottom 80. Clearance ≈ **26.7px**. No overlap.

**Home-indicator note.** The frame draws no home indicator. On device the 34pt bottom inset puts the indicator over sheet-bottom 0 → 34, i.e. ~2px below the link box. Transcribed as-is; flagged because it is tight.

---

## 6. Paint order inside the sheet

| z | Canvas | App |
| --- | --- | --- |
| 1 | grain (`inset:0`, opacity 0.07) | `<Image source={noiseDark} …>` |
| 2 | grabber wrapper | grabber `<View>` |
| 3 | close ✕ | `<PressScale>` ✕ |
| 4 | scroll body (salutation → paragraphs → scene → paragraphs → signoff → pen stroke → **pill**) | `<LetterBody>` children |
| 5 | Continue | secondary `<PressScale>` |

Match — all five layers are positioned/static in document order and paint in source order in both. No `z-index` anywhere except the status bar (`z-index:20`), which the app does not build.

---

## 7. Scroll arithmetic — where the pill lands

Fixed (non-text) heights inside the body, exact:

| Item | Height |
| --- | --- |
| gap: salutation → p1 | 22 |
| gap: p1 → p2 | 20 |
| gap: p2 → scene | 36 |
| scene | 186 |
| gap: scene → p3 | 40 |
| gap: p3 → p4 | 20 |
| gap: p4 → signoff | 26 |
| gap: signoff → pen stroke | 4 |
| pen stroke | 12 |
| gap: pen stroke → pill | 56 |
| pill | 54 |
| below the pill | 6 |
| **Fixed subtotal** | **482** |

Text heights: salutation ≈ 21 (18px × normal), signoff ≈ 19 (16px × normal), and the four paragraphs at 27.9 per line. At 325px content width and 15.5px SF Pro Text the four paragraphs are **at least** 2 + 4 + 4 + 2 = **12 lines** = 334.8.

Lower bound on content height: **482 + 21 + 19 + 334.8 ≈ 857**.
Viewport: 800 − 84 − 80 = **636**.

So the content overflows by **≥ 221pt**, and the pill's top edge sits at content-y ≈ 857 − 6 − 54 = 797, i.e. **≥ 161pt below the fold**. Under the prev geometry (556pt viewport, pill floating at bottom 88) the pill was always visible. This is a deliberate reversal, not a regression.

Two consequences worth naming, neither of them a transcription mismatch:

1. `showsVerticalScrollIndicator={false}` (`letter.tsx:390`) leaves no affordance that anything is below. The canvas uses `overflow:auto`, which on desktop shows a scrollbar. Consider flipping this to `true` for the week-XII body, or adding a bottom fade.
2. The scroll body must not be given a bottom content inset that hides the pill's 6px tail — RN measures the last child's `marginBottom` into `contentSize`, so plain `marginBottom: 6` is correct.

---

## 8. Visualization — the week-XII scene

The one custom drawing in the frame: the walk out, three ridges deep, sun up, one signpost passed. The canvas builds it from **fifteen absolutely-positioned divs** in a clipping window; the app redraws it as one `<Svg>` (`Week12Scene`, `letter.tsx:540–583`).

### 8a. Coordinate system

| Property | Canvas | App | Verdict |
| --- | --- | --- | --- |
| Window | `position:relative; width:240px; height:186px; overflow:hidden` | `<Svg width={240} height={186} viewBox="0 0 240 186">` — SVG clips to its viewport by default | match |
| User-unit scale | 1 CSS px = 1 unit | viewBox 240 × 186 into 240 × 186 → **1:1** | match |
| Horizontal placement | `margin: … auto …` (centred in the 325 content box → left offset 42.5) | `alignSelf: 'center'` | match |
| margin-top | **36** effective (canvas `36px`, collapsed against p2's `16px`) | `0` (relies on p2's `gap={16}`) → **16** | **MISMATCH** |
| margin-bottom | **40** effective | `marginBottom: 18` | **MISMATCH** |
| Stale comment | — | `letter.tsx:546–547` still describes the prev `margin:2px auto 18px` | must be rewritten |

Origin is the window's top-left. Every canvas `left`/`top` is a *box* offset; the app converts each to a centre (circles/ellipses) or a rect origin. All conversions below are exact.

### 8b. Layer table — canvas div → SVG primitive, in paint order

| # | Canvas box | Canvas paint | App primitive (`letter.tsx`) | Verdict |
| --- | --- | --- | --- | --- |
| 1 | `left:128 top:4 w:112 h:112 radius:50%` | `radial-gradient(closest-side, rgba(226,186,120,0.38), rgba(226,186,120,0) 74%)`, `filter:blur(4px)` | `<Ellipse cx={184} cy={60} rx={56} ry={56} fill="url(#w12-sun)" />` (L562) | geometry match |
| 2 | `left:162 top:32 w:34 h:34 radius:50%` | `#E9D2A4` | `<Circle cx={179} cy={49} r={17} fill="#E9D2A4" />` (L563) | match |
| 3 | `left:14 top:24 w:2 h:2 radius:50%` | `rgba(200,225,235,0.4)` | `<Circle cx={15} cy={25} r={1} fill="rgba(200,225,235,0.4)" />` (L564) | match |
| 4 | `left:44 top:52 w:2 h:2 radius:50%` | `rgba(200,225,235,0.3)` | `<Circle cx={45} cy={53} r={1} fill="rgba(200,225,235,0.3)" />` (L565) | match |
| 5 | `left:-40 right:-40 top:100 h:100 radius:50% 50% 0 0 / 48px 48px 0 0` | `#DEDDD6` | `<Path d={hill(-40, 320, 100, 48)} fill="#DEDDD6" />` (L567) | match |
| 6 | `left:-90 right:-30 top:126 h:100 radius:50% 50% 0 0 / 42px 42px 0 0` | `#CFCEC7` | `<Path d={hill(-90, 360, 126, 42)} fill="#CFCEC7" />` (L568) | match |
| 7 | `left:-30 right:-100 top:148 h:100 radius:50% 50% 0 0 / 36px 36px 0 0` | `#C5C4BD` | `<Path d={hill(-30, 370, 148, 36)} fill="#C5C4BD" />` (L569) | match |
| 8 | `left:34 top:150 w:13 h:4 radius:2 transform:rotate(14deg)` | `rgba(255,255,255,0.55)` | `<Rect x={34} y={150} width={13} height={4} rx={2} … transform="rotate(14 40.5 152)" />` (L571) | match |
| 9 | `left:58 top:136 w:13 h:4 radius:2 transform:rotate(10deg)` | `rgba(255,255,255,0.55)` | `<Rect x={58} y={136} … transform="rotate(10 64.5 138)" />` (L572) | match |
| 10 | `left:84 top:124 w:13 h:4 radius:2 transform:rotate(6deg)` | `rgba(255,255,255,0.55)` | `<Rect x={84} y={124} … transform="rotate(6 90.5 126)" />` (L573) | match |
| 11 | `left:139 top:56 w:3 h:46 radius:2` | `#C6C5C0` | `<Rect x={139} y={56} width={3} height={46} rx={1.5} fill="#C6C5C0" />` (L576) | match — see clamp note |
| 12 | `left:142 top:57 w:15 h:10 radius:1px 3px 3px 1px` | `#E9D2A4` | hand-written `<Path>` (L577) | match |
| 13 | `left:112 top:64 w:11 h:11 radius:50%` | `#B4B1AB` | `<Circle cx={117.5} cy={69.5} r={5.5} fill="#B4B1AB" />` (L578) | match |
| 14 | `left:110 top:77 w:15 h:27 radius:7` | `#C6C5C0` | `<Rect x={110} y={77} width={15} height={27} rx={7} fill="#C6C5C0" />` (L579) | match |
| 15 | `left:100 top:100 w:44 h:10 radius:50%` | `rgba(0,0,0,0.10)`, `filter:blur(4px)` | `<Ellipse cx={122} cy={105} rx={22} ry={5} fill="url(#w12-cast)" />` (L580) | geometry match |

Paint order is identical in both — the cast shadow is painted **last**, over the man's legs. No `z-index`, no blend mode, no backdrop filter anywhere in the scene.

### 8c. Gradients

| id | Canvas declaration | App declaration (`letter.tsx:550–558`) | Verdict |
| --- | --- | --- | --- |
| sun glow | `radial-gradient(closest-side, rgba(226,186,120,0.38), rgba(226,186,120,0) 74%)` on a 112 × 112 box → centre (50%, 50%), radius **56**, stop 0% `#E2BA78` @ **0.38**, stop 74% `#E2BA78` @ **0** | `<RadialGradient id="w12-sun" cx="50%" cy="50%" rx="50%" ry="50%">` `<Stop offset="0" stopColor="#E2BA78" stopOpacity={0.38} />` `<Stop offset="0.74" stopColor="#E2BA78" stopOpacity={0} />` | match (`rgba(226,186,120)` **is** `#E2BA78`) |
| cast shadow | flat `rgba(0,0,0,0.10)` + `filter:blur(4px)` | `<RadialGradient id="w12-cast">` `0 → #000 @0.1`, `0.62 → #000 @0.05`, `1 → #000 @0` | **documented substitution** |

`filter: blur(4px)` has no react-native-svg equivalent (no `feGaussianBlur` on the RN backend). Both blurred layers are approximated:

* **Sun glow** — the gradient already reaches 0 alpha at 0.74 × 56 = **41.44px**, well inside the 56px clip, so a 4px blur changes almost nothing. The approximation is close to exact.
* **Cast shadow** — the canvas blurs a flat 10%-black ellipse, which spreads soft alpha ~4px *outside* rx 22 / ry 5 and drops the peak by roughly 15% (σ = 2 against a 10px-tall shape). The app instead keeps the hard rx 22 / ry 5 extent and ramps the alpha inward. Visually near-identical at this size; the difference is a slightly crisper outer edge. **Leave it.**

### 8d. The hill formula

Each ridge is a CSS box whose two top corners carry an elliptical radius (`50%` horizontal / `Npx` vertical) and whose body runs 100px down, past the 186px clip.

```js
const hill = (x, w, y, ry) =>
  `M${x} ${y + ry} A${w / 2} ${ry} 0 0 1 ${x + w} ${y + ry} L${x + w} ${y + 100} L${x} ${y + 100} Z`;
```

Derivation: `50%` of the box width is `w/2`, so the crown is a half-ellipse of `rx = w/2`, `ry = ry`, spanning the full width. Its apex is at `y`; its two ends land at `y + ry`. The arc flag pair `0 1` (large-arc 0, sweep 1) draws the upper half left-to-right.

Widths come from the negative insets against the 240px window:

| Ridge | `left` | `right` | Width | x-range | `top` | `ry` | Expanded `d` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A | −40 | −40 | 240 + 40 + 40 = **320** | −40 → 280 | 100 | 48 | `M-40 148 A160 48 0 0 1 280 148 L280 200 L-40 200 Z` |
| B | −90 | −30 | 240 + 90 + 30 = **360** | −90 → 270 | 126 | 42 | `M-90 168 A180 42 0 0 1 270 168 L270 226 L-90 226 Z` |
| C | −30 | −100 | 240 + 30 + 100 = **370** | −30 → 340 | 148 | 36 | `M-30 184 A185 36 0 0 1 340 184 L340 248 L-30 248 Z` |

All three run past y 186 and are cut by the viewBox, exactly as `overflow:hidden` cuts them on the canvas.

### 8e. Verbatim path strings

Signpost board (canvas `border-radius:1px 3px 3px 1px` on a 15 × 10 box at 142, 57 — TL 1, TR 3, BR 3, BL 1; no CSS clamping applies since 1 + 3 ≤ 15 and 1 + 1 ≤ 10 and 3 + 3 ≤ 10):

```
M143 57 L154 57 A3 3 0 0 1 157 60 L157 64 A3 3 0 0 1 154 67 L143 67 A1 1 0 0 1 142 66 L142 58 A1 1 0 0 1 143 57 Z
```

Verified corner by corner: TL ends at x 143 (142 + 1); the top run stops at 154 (157 − 3); the r3 arc lands on (157, 60); the right run stops at 64 (67 − 3); the r3 arc lands on (154, 67); the bottom run stops at 143 (142 + 1); the r1 arc lands on (142, 66); the left run stops at 58 (57 + 1); the r1 arc closes on (143, 57).

Hill paths, expanded from the formula:

```
M-40 148 A160 48 0 0 1 280 148 L280 200 L-40 200 Z
M-90 168 A180 42 0 0 1 270 168 L270 226 L-90 226 Z
M-30 184 A185 36 0 0 1 340 184 L340 248 L-30 248 Z
```

### 8f. Border-radius clamping — the one place the canvas contradicts itself

Layer 11 (the signpost pole) declares `border-radius: 2px` on a box that is only **3px wide**. CSS §5.5 overlapping-curves rule: for each side, `f = side_length / (sum of the two radii on it)`; the smallest `f` scales *every* radius. Top side: 3 / (2 + 2) = **0.75**. Left side: 46 / (2 + 2) = 11.5. So `f = 0.75` and all four radii render as **1.5px**, not 2px.

The app writes `rx={1.5}` (`letter.tsx:576`). **The app is right.** A literal `rx={2}` in SVG would *not* clamp the same way (SVG clamps `rx` to `width/2` = 1.5 independently, so it happens to land in the same place here — but the reasoning differs and 1.5 is the honest number). The declared `2px` is the contradiction; the rendered `1.5px` is what the evidence supports.

Layer 14 (the body, `radius:7` on 15 × 27): top side 15 / (7 + 7) = 1.07 ≥ 1, left side 27 / 14 = 1.93 ≥ 1 → **no clamping**, radius stays 7. App `rx={7}` correct.

### 8g. States

The scene is a single static illustration. There is no data domain, no axis, no tick, no gridline, no dash array, no clip path and no mask; nothing in it varies with user data, so there is no no-data / one-point / min / max / overflow rendering to specify. The only conditional content in the whole frame is `{name}` in the salutation and the signoff, which falls back to `'friend'` (`letter.tsx:66`).

---

## 9. Comparison — full table

| Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- |
| Frame background | `#EDECE7` | `#EDECE7` (read phase) | match |
| Sheet top | frame 52 / app −2 | `-2` | match |
| Sheet radius | `24 24 0 0` | `borderTopLeftRadius/borderTopRightRadius: 24` | match |
| Sheet background | `#F4F3F0` | `#F4F3F0` | match |
| Grain opacity | `0.07` | `0.07` | match |
| Grabber | 38 × 5, r3, `rgba(19,19,19,0.16)`, top 12 | 38 × 5, r3, same rgba, top 12 | match |
| Close ✕ | right 22, top 26, 20 × 20, `#55534E`, sw 2, cap round | identical | match |
| **Body bottom** | **80** | **160** | **MISMATCH** |
| Body left / right / top | 34 / 34 / 84 | 34 / 34 / 84 | match |
| Salutation | 18 / 600 / ls −0.1 / `#1D1C1A` / mb 22 | 18 / '600' / −0.1 / `#1D1C1A` / 22 | match |
| Paragraph type | 15.5 / 400 / lh 27.9 / `#3A3934` | 15.5 / '400' / 27.9 / `#3A3934` | match |
| p1 gap below | 20 | 20 | match |
| **Gap p2 → scene** | **36** | **16** | **MISMATCH** |
| **Gap scene → p3** | **40** | **18** | **MISMATCH** |
| p3 gap below | 20 | 20 | match |
| p4 gap below | 0 | 0 | match |
| Signoff | 16 / 600 / `#1D1C1A` / mt 26 | 16 / '600' / `#1D1C1A` / 26 | match |
| Pen stroke | 150 × 12, sw 1.6, `rgba(38,38,31,0.5)`, cap round, mt 4 | identical | match |
| Scene window | 240 × 186, centred, clipped | 240 × 186, `alignSelf:'center'`, viewBox clip | match |
| Scene layers 1–15 | see §8b | see §8b | match (all 15) |
| Sun gradient stops | `0 → #E2BA78 0.38`, `0.74 → 0` | identical | match |
| Cast-shadow paint | flat `rgba(0,0,0,0.10)` + `blur(4px)` | 3-stop radial ramp | documented substitution |
| Sun-glow blur | `blur(4px)` | none (gradient already fades at 41.44px) | documented substitution |
| Pole radius | declared `2px`, renders `1.5` after CSS clamping | `rx={1.5}` | match |
| **Pill layout** | **in flow, last child of the scroll body** | `position:'absolute'` | **MISMATCH** |
| **Pill left / right** | **34 / 359 (width 325)** | 24 / 369 (width 345) | **MISMATCH** |
| **Pill vertical** | **`margin:56px 0 6px`** | `bottom: 88` | **MISMATCH** |
| Pill height / radius / fill | 54 / 27 / `#131313` | 54 / 27 / `#131313` | match |
| Pill flex | row, center, center, gap 9 | row, center, center, gap 9 | match |
| Bookmark icon | 16 × 16, viewBox 24, `#FFFFFF`, sw 2, join round | identical | match |
| Pill label | 16.5 / 600 / ls 0.2 / `#FFFFFF` | 16.5 / '600' / 0.2 / `#FFFFFF` | match |
| Pill copy | `Tuck it into your Log` | same | match |
| **Continue bottom** | **36** | **44** | **MISMATCH** |
| Continue type | 14.5 / 500 / `#8B8882`, centred | 14.5 / '500' / `#8B8882`, centred | match |
| Continue copy | `Continue` | `Continue` (week12 branch) | match |
| Paint order (5 layers) | grain → grabber → ✕ → body → Continue | identical | match |
| `text-wrap: pretty` | on all four paragraphs | no RN equivalent | unfixable deviation |
| Pressed state | none drawn (`cursor:pointer` only) | `PressScale` 0.96 / 110ms / 160ms | app addition |
| Scroll indicator | `overflow:auto` | `showsVerticalScrollIndicator={false}` | see §7 |

**Six mismatches**, all geometry, all introduced by this diff.

---

## 10. What must change

All edits are in `/Users/admin/Documents/tideline/src/app/letter.tsx`. **Every one must be opt-in** — `Letter-Read.html` and `Medallion-Letter.html` are unchanged in the bundle and still want the old geometry (§ "Scoping").

1. **`LetterBody` (line 386) — add a `bottom` prop, default `160`.**
   Signature becomes `LetterBody({ bottom = 160, children })`; the style uses `bottom`. `medallion-post.tsx:74` and the `post` variant keep the default. The week-XII call site passes `bottom={80}`.
   Also rewrite the docstring at line 385 — it says "bottom 160" as if that were universal.

2. **Move the pill into the scroll flow, for the week-XII variant only.**
   The pill must be the **last child of the ScrollView** while `Continue` stays a sibling of it, so the two can no longer be emitted by one `LetterFooter`. Extract the pill's inner content (icon + label, `letter.tsx:427–435`) into a shared `KeepPill({ label, onPress, style })`, then:
   * `LetterFooter` keeps rendering `KeepPill` absolutely at `left:24, right:24, bottom:88` for the two unchanged frames.
   * `Week12Letter` (line 511) renders `<KeepPill label="Tuck it into your Log" onPress={keep} style={{ marginTop: 56, marginBottom: 6, height: 54, borderRadius: 27 }} />` as its own last child, after `<Signoff>`. No `left`/`right` — the ScrollView content container stretches it to the body's 325px width, which is what the canvas does.
   * `keep` has to reach `Week12Letter`; pass it down as a prop from `LetterScreen` (line 117).

3. **Secondary link `bottom` 44 → 36, week-XII only.**
   Give `LetterFooter` (or the new week-XII branch) a `secondaryBottom` prop defaulting to `44`; the week-XII branch passes `36`. `letter.tsx:441`.

4. **`Week12Scene` (line 548) — fix the space around the scene.**
   `marginBottom: 18` → **`marginBottom: 40`**. For the space above, follow the file's own convention (the `Signoff` docstring at line 458: "`gap` is the space that actually opens, not the canvas's `margin-top`"): change the preceding paragraph at line 518 from `<LetterP gap={16}>` to **`<LetterP gap={36}>`** and leave the scene with no `marginTop`. The canvas pair is `16px` below p2 and `36px` above the scene; CSS collapses them to 36, Yoga would add them to 52 — 36 is the number to reproduce.
   Rewrite the stale comment at lines 546–547, which still explains the removed `margin:2px auto 18px`.

5. **Consider `showsVerticalScrollIndicator` for the week-XII body (line 390).**
   Advisory, not a transcription mismatch: the pill is now ≥ 161pt below the fold (§7) and the app currently draws no scroll affordance at all. `overflow:auto` on the canvas does.

6. **Leave alone, deliberately:** the two blur substitutions (§8c), `rx={1.5}` on the signpost pole (§8f), the `PressScale` press state, and the `contentFit="cover"` grain. These are documented deviations, not findings.
