# Manage Subscription — pixel spec

Transcribed from the final canvas bundle. Every number below is copied character for
character from the CSS; nothing is rounded and no theme token is substituted for a value
that differs. Where a number is *derived* (a card's total height from padding + rows, a
line box from font-size) it is labelled **derived** and the arithmetic is shown.

## Header

| Sticky note | Frame label | Split file | Target app file |
|---|---|---|---|
| `15 · Manage Subscription` (from `.uifinal/final/Email Login/_notes.json`) | Manage Subscription | `/Users/admin/Documents/tideline/.uifinal/pretty/final/Email Login/Manage-Subscription.html` (raw: `/Users/admin/Documents/tideline/.uifinal/final/Email Login/Manage-Subscription.html`, 8418 bytes) | `/Users/admin/Documents/tideline/src/app/subscription.tsx` |

Diff read: `/Users/admin/Documents/tideline/.uifinal/diffs/Manage-Subscription.html.diff`
Prev frame read: `/Users/admin/Documents/tideline/.uifinal/pretty/prev/Email Login/Manage-Subscription.html`
(prev = 8814 bytes / 448 pretty lines; final = 8418 bytes / 428 pretty lines)

**Note on the sticky number:** the app file's header comment says "canvas 107". The final
bundle's own notes file calls this frame `15 · Manage Subscription`. The bundle is the
evidence; `107` is stale.

---

## 0. What the diff changed

The whole diff is a deletion. Nothing was added, nothing was moved, no value was retyped.
The final frame ends at `Cancel subscription`; the prev frame carried a footer after it.

Deleted block (prev lines 428–447, canvas `top:768px` → app top `714`):

```
  <div style="position:absolute; left:0; right:0; top:768px; text-align:center;">
    <svg width="90" height="30" viewBox="0 0 90 30">
      <path d="M6 20c8-11 16-11 24 0s16 11 24 0 14-9 30-4" stroke="rgba(0,0,0,0.25)" stroke-width="2.2" fill="none" stroke-linecap="round"></path>
    </svg>
    <div style="margin-top:2px; font-size:12.5px; font-weight:500; color:#8B8882;">the long road, together.</div>
  </div>
```

Both nodes — the swell glyph and the caption "the long road, together." — are **gone from
the final design**. `src/app/subscription.tsx` lines 189–198 still render both.

Everything before that block is byte-identical between prev and final (verified: the diff
hunk starts at prev line 424 and only removes lines).

---

## 1. Frame shell

| Property | Value |
|---|---|
| Frame size | `393px` × `852px` |
| position / overflow | `relative` / `hidden` |
| background | `#F4F3F0` |
| font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` |
| font smoothing | `-webkit-font-smoothing:antialiased` |
| flex-shrink | `0` |
| Frame box-shadow (canvas chrome only — the app must NOT build this) | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` |
| Noise layer | `position:absolute; inset:0; background-image:url('noise-dark.png'); opacity:0.07; pointer-events:none` |

Status bar block: `position:absolute; top:0; left:0; right:0; height:54px; display:flex;
align-items:center; justify-content:space-between; padding:6px 32px 0 46px;
box-sizing:border-box; z-index:20`. **The app never builds this.** Every canvas `top`
below therefore carries an "app top" = `canvas top − 54`.

Status-bar contents, transcribed for completeness (not built):

- Clock: `font-size:17px; font-weight:600; color:#1D1C1A; letter-spacing:-0.2px`, text `9:41`
- Right cluster: `display:flex; align-items:center; gap:7px`
- Signal `<svg width="19" height="12" viewBox="0 0 19 12">` — four `rect`s, all `rx="0.7" fill="#1D1C1A"`: `x=0 y=7.5 w=3.2 h=4.5`, `x=4.8 y=5 w=3.2 h=7`, `x=9.6 y=2.5 w=3.2 h=9.5`, `x=14.4 y=0 w=3.2 h=12`
- Wifi `<svg width="17" height="12" viewBox="0 0 17 12">`:

```
M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z
M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z
```
  plus `<circle cx="8.5" cy="10.5" r="1.5" fill="#1D1C1A">`
- Battery `<svg width="27" height="13" viewBox="0 0 27 13">`: shell `rect x=0.5 y=0.5 w=23 h=12 rx=3.5 stroke="#1D1C1A" stroke-opacity="0.35" fill="none"`; fill `rect x=2 y=2 w=20 h=9 rx=2 fill="#1D1C1A"`; nub:

```
M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z
```
  `fill="#1D1C1A" fill-opacity="0.4"`

---

## 2. Vertical map (canvas → app)

| # | Element | Canvas top | App top (−54) | Left / Right |
|---|---|---|---|---|
| 1 | Back row | `64` | `10` | `left:16` |
| 2 | Title "Subscription" | `122` | `68` | `left:24` |
| 3 | Membership block | `204` | `150` | `left:24; right:24` |
| 4 | Group label "Plan" | `330` | `276` | `left:28` |
| 5 | Plan card | `352` | `298` | `left:24; right:24` |
| 6 | Group label "Billing" | `544` | `490` | `left:28` |
| 7 | Billing card | `566` | `512` | `left:24; right:24` |
| 8 | "Cancel subscription" | `712` | `658` | `left:0; right:0` |
| — | ~~Footer swell + caption~~ | ~~`768`~~ | ~~`714`~~ | **deleted in final** |

Derived bottoms (arithmetic in §5 and §6): membership block ends ≈ canvas `304`;
Plan card ends at canvas `536`; Billing card ends at canvas `691`; the cancel line's
line box ends ≈ canvas `730`. Nothing renders below `730` in the final frame.

No element declares `z-index` except the status bar (`20`). Document order is paint order.
No `overflow` is declared on any child. No blend mode, no backdrop blur, no gradient
anywhere in this frame — every fill is a flat colour.

---

## 3. Back row

Container: `position:absolute; left:16px; top:64px` (app `top:10`); `display:flex;
align-items:center; gap:9px`. No padding, no background, no hit-slop expressed in CSS.

| Property | Value |
|---|---|
| Chevron svg | `width="11" height="19" viewBox="0 0 11 19"` |
| Chevron stroke | `#55534E`, `stroke-width="2.4"`, `fill="none"`, `stroke-linecap="round"`, `stroke-linejoin="round"` |
| Gap glyph → label | `9px` |
| Label font-size / weight | `17px` / `400` |
| Label colour | `#55534E` |
| Label letter-spacing | not declared (inherit `normal`) |
| Label text | `Back` |

```
M9.5 1.5L2 9.5l7.5 8
```

---

## 4. Title

| Property | Value |
|---|---|
| Position | `absolute; left:24px; top:122px` (app `68`) |
| font-size | `27px` |
| font-weight | `600` |
| letter-spacing | `-0.2px` |
| colour | `#1D1C1A` |
| line-height | not declared → normal line box (**derived** ≈ `27 × 1.19 ≈ 32.1`) |
| text | `Subscription` |

---

## 5. Membership block (the plan, stated not boxed)

Container: `position:absolute; left:24px; right:24px; top:204px` (app `150`).
Usable width **derived**: `393 − 24 − 24 = 345`.

### 5.1 Top row

`display:flex; justify-content:space-between; align-items:flex-start; gap:12px`.

Left column (no explicit width; flex default):

| Property | Value |
|---|---|
| Plan name font-size / weight | `24px` / `600` |
| Plan name letter-spacing | `-0.2px` |
| Plan name colour | `#1D1C1A` |
| Plan name text | `Yearly` |
| Sub-line margin-top | `5px` |
| Sub-line font-size / weight | `14px` / `400` |
| Sub-line colour | `#55534E` |
| Sub-line text | `$39.99 / year · renews 10 Jul 2027` (the `&middot;` entity, U+00B7, with a single space either side) |

Status pill (a `<span>`, so the padding is on the text box itself):

| Property | Value |
|---|---|
| font-size / weight | `12.5px` / `600` |
| colour | `#F4F3F0` |
| background | `#131313` |
| border-radius | `14px` (all four corners) |
| padding | `7px 12px` (top/bottom 7, left/right 12) |
| flex-shrink | `0` |
| margin-top | `3px` |
| text | `Active` |
| **derived** height | `7 + (12.5 × ~1.19 ≈ 14.9) + 7 ≈ 28.9` |
| **derived** width | `12 + text + 12` |

Row height **derived**: left column `≈ 28.6 (24px line box) + 5 + ≈ 16.7 (14px line box) ≈ 50.3`;
pill `3 + 28.9 = 31.9`. `align-items:flex-start` means the pill hangs from the top, so the
row is the taller of the two ≈ `50.3`.

### 5.2 Divider

| Property | Value |
|---|---|
| height | `1px` |
| background | `rgba(0,0,0,0.09)` |
| margin | `18px 0 14px` (top 18, sides 0, bottom 14) |
| inset | none — full `345` width of the block |

### 5.3 Next-charge row

`display:flex; justify-content:space-between; font-size:14px` (size declared once on the
row, inherited by both spans). No `align-items` declared → `stretch`.

| Span | font-weight | colour | text |
|---|---|---|---|
| left | `400` | `#55534E` | `Next charge` |
| right | `500` | `#1D1C1A` | `$39.99 on 10 Jul 2027` |

Block total **derived**: `50.3 + 18 + 1 + 14 + 16.7 ≈ 100` → bottom ≈ canvas `304`,
leaving ≈ `26` of air before the "Plan" label at `330`.

---

## 6. Group labels and cards

### 6.1 Group label (both instances identical apart from `top` and text)

| Property | Value |
|---|---|
| Position | `absolute; left:28px` — note `28`, **not** the `24` the cards use |
| top | `330` (app `276`) / `544` (app `490`) |
| font-size | `12.5px` |
| font-weight | `600` |
| colour | `#8B8882` |
| letter-spacing | not declared |
| text-transform | **not declared** — the labels are sentence case `Plan` and `Billing`, not the app's caps-label treatment |

Label→card gap is `22px` in both cases (`352 − 330`, `566 − 544`).

### 6.2 Card shell (both cards identical)

| Property | Value |
|---|---|
| Position | `absolute; left:24px; right:24px` |
| top | `352` (app `298`) / `566` (app `512`) |
| border-radius | `18px` (all four corners) |
| background | `#FFFFFF` |
| box-shadow | `0 0 0 1px rgba(0,0,0,0.09)` — a hairline ring, no offset, no blur, no spread beyond the 1px |
| border | none (the ring is the shadow) |
| padding | `4px 20px` (top/bottom 4, left/right 20) |
| **derived** inner width | `393 − 24 − 24 − 20 − 20 = 305` |

### 6.3 Card row

| Property | Value |
|---|---|
| layout | `display:flex; align-items:center; gap:14px` |
| padding | `13px 0` |
| border-bottom | `1px solid rgba(0,0,0,0.06)` — present on every row **except the last row of each card** |
| cursor | `pointer` on **all five** rows |
| **derived** row height | `13 + 32 + 13 = 58`, `+1` where a border is present = `59` |

Icon chip:

| Property | Value |
|---|---|
| size | `32px` × `32px` |
| border-radius | `9px` |
| background | `#F1EFE9` |
| layout | `display:flex; align-items:center; justify-content:center` |
| flex-shrink | `0` |
| glyph size | `19` × `19`, `viewBox="0 0 24 24"` in every icon |

Row title:

| Property | Value |
|---|---|
| flex | `1` |
| font-size | `15px` |
| font-weight | `500` |
| colour | `#1D1C1A` |

Row detail (only on "Change plan" and "Payment method"):

| Property | Value |
|---|---|
| font-size | `13.5px` |
| font-weight | `400` |
| colour | `#8B8882` |

Row chevron (identical on all five rows):

| Property | Value |
|---|---|
| svg | `width="7" height="12" viewBox="0 0 8 14"` |
| stroke | `rgba(0,0,0,0.28)` |
| stroke-width | `2` |
| fill | `none` |
| linecap / linejoin | `round` / `round` |

```
M1.5 1.5 6 7l-4.5 5.5
```

### 6.4 Card heights (derived)

Plan card: `4 + 59 + 59 + 58 + 4 = 184` → canvas `352 → 536`.
Billing card: `4 + 59 + 58 + 4 = 125` → canvas `566 → 691`.

---

## 7. Row inventory and icon geometry

### Plan card (canvas top `352`, app `298`)

| Order | Title | Detail | border-bottom |
|---|---|---|---|
| 1 | `Change plan` | `Yearly · $39.99` (`&middot;`) | yes |
| 2 | `Redeem a code` | — | yes |
| 3 | `Restore purchases` | — | **no** |

**1 — Change plan.** `<svg width="19" height="19" viewBox="0 0 24 24">`
`<circle cx="12" cy="12" r="9" stroke="#1D1C1A" stroke-width="1.9" fill="none">` plus a
filled needle (`fill="#1D1C1A"`, no stroke):

```
M15.5 8.5l-2 5-5 2 2-5z
```

**2 — Redeem a code.** `<svg width="19" height="19" viewBox="0 0 24 24">`
`<rect x="3.5" y="8" width="17" height="4" rx="1" stroke="#1D1C1A" stroke-width="1.9" fill="none">`
plus `stroke="#1D1C1A" stroke-width="1.9" fill="none" stroke-linejoin="round"` on:

```
M5 12v7.5h14V12M12 8v11.5M12 8c-4 0-5.5-1.6-5.5-3a2 2 0 0 1 3.6-1.2C11.2 5 12 8 12 8zm0 0c4 0 5.5-1.6 5.5-3a2 2 0 0 0-3.6-1.2C12.8 5 12 8 12 8z
```

**3 — Restore purchases.** `<svg width="19" height="19" viewBox="0 0 24 24">`, one path,
`stroke="#1D1C1A" stroke-width="1.9" fill="none" stroke-linecap="round" stroke-linejoin="round"`:

```
M4.5 12a7.5 7.5 0 1 1 2.2 5.3M4.5 12V7.5M4.5 12H9
```

### Billing card (canvas top `566`, app `512`)

| Order | Title | Detail | border-bottom |
|---|---|---|---|
| 1 | `Payment method` | `Apple ID` | yes |
| 2 | `Receipts &amp; invoices` | — | **no** |

**1 — Payment method.** `<svg width="19" height="19" viewBox="0 0 24 24">`
`<rect x="3" y="5.5" width="18" height="13" rx="2.4" stroke="#1D1C1A" stroke-width="1.9" fill="none">`
plus `stroke="#1D1C1A" stroke-width="1.9"` (no linecap declared, no fill declared) on:

```
M3 9.5h18
```

**2 — Receipts & invoices.** `<svg width="19" height="19" viewBox="0 0 24 24">`, two paths.
Sheet: `stroke="#1D1C1A" stroke-width="1.9" fill="none" stroke-linejoin="round"`.
Lines: `stroke="#1D1C1A" stroke-width="1.7" stroke-linecap="round"` — **1.7, not 1.9**.

```
M6 3.5h8l4 4v13H6z
```
```
M9 12h6M9 15.5h6
```

---

## 8. Cancel line

| Property | Value |
|---|---|
| Position | `absolute; left:0; right:0; top:712px` (app `658`) |
| text-align | `center` |
| font-size | `15px` |
| font-weight | `500` |
| colour | `#8B8882` |
| cursor | `pointer` |
| text | `Cancel subscription` |
| **derived** line box | `15 × ~1.19 ≈ 17.9` → bottom ≈ canvas `730` |

This is the last element in the final frame.

---

## 9. States shown

The frame shows exactly one state: **premium, yearly, active**. There is no pressed,
disabled, selected, loading or empty variant anywhere in this file, and no second frame in
the family. Everything else in the app (`Free tools` / `Free` / `Core tools included`, the
`$26.99` yearly-drop price) is app-side and **not represented on the canvas** — it is not a
mismatch, but it is also not design-verified.

The only interaction affordance the canvas states is `cursor:pointer`, present on all five
card rows and on the cancel line.

---

## 10. Visualization

The final frame contains **no chart, ring, gauge, calendar or streak visual**. The only
custom drawing this screen ever had was the footer swell, and the diff deletes it. Its
geometry is recorded in §0 purely so the deletion is unambiguous; it must not be rebuilt.

---

## 11. Comparison — design vs `src/app/subscription.tsx`

App values read from `/Users/admin/Documents/tideline/src/app/subscription.tsx` (203 lines,
read in full). "App top" values below are already the `canvas − 54` form the app uses.

| Property | Design value | Current app value | Verdict |
|---|---|---|---|
| Screen background | `#F4F3F0` | `#F4F3F0` (line 125) | match |
| Noise overlay opacity | `0.07` | `0.07` (line 127) | match |
| Noise overlay inset | `inset:0`, `pointer-events:none` | `top/left/right/bottom: 0`, `pointerEvents="none"` (line 127) | match |
| Noise tiling | `background-image` (CSS default `repeat`) | `contentFit="cover"` (line 127) | match in intent; **cover stretches where CSS tiles** — same across the app, not a numeric miss |
| Frame drop shadow | canvas chrome only | not built | match (correctly omitted) |
| Status bar | canvas-only 54px block | not built; `<StatusBar style="dark" />` (line 126) | match (correctly omitted) |
| Back row left / top | `16` / canvas `64` → app `10` | `left: 16, top: 10` (line 135) | match |
| Back row gap | `9` | `gap: 9` (line 135) | match |
| Back row minHeight | not declared | `minHeight: 0` overriding PressScale's 44 (line 135) | match |
| Back chevron svg | `11 × 19`, `viewBox="0 0 11 19"` | `width={11} height={19} viewBox="0 0 11 19"` (line 136) | match |
| Back chevron `d` | `M9.5 1.5L2 9.5l7.5 8` | `M9.5 1.5L2 9.5l7.5 8` (line 137) | match |
| Back chevron stroke / width / caps | `#55534E` / `2.4` / round, round | `#55534E` / `2.4` / round, round (line 137) | match |
| Back label size / weight / colour | `17` / `400` / `#55534E` | `17` / `sans('400')` / `#55534E` (line 139) | match |
| Title left / top | `24` / canvas `122` → app `68` | `left: 24, top: 68` (line 142) | match |
| Title size / weight / tracking / colour | `27` / `600` / `-0.2` / `#1D1C1A` | `27` / `sans('600')` / `-0.2` / `#1D1C1A` (line 142) | match |
| Membership block left/right/top | `24` / `24` / canvas `204` → app `150` | `left: 24, right: 24, top: 150` (line 145) | match |
| Membership top row layout | `space-between`, `align-items:flex-start`, `gap:12` | `flexDirection: 'row'`, `justifyContent: 'space-between'`, `alignItems: 'flex-start'`, `gap: 12` (line 146) | match |
| Plan name size / weight / tracking / colour | `24` / `600` / `-0.2` / `#1D1C1A` | `24` / `sans('600')` / `-0.2` / `#1D1C1A` (line 148) | match |
| Plan name text | `Yearly` | `premium ? 'Yearly' : 'Free tools'` (line 148) | match for the state the canvas shows |
| Sub-line margin-top / size / weight / colour | `5` / `14` / `400` / `#55534E` | `marginTop: 5` / `14` / `sans('400')` / `#55534E` (line 149) | match |
| Sub-line text shape | `$39.99 / year · renews 10 Jul 2027` | `` `${price} / year · renews ${renews}` `` with `en-GB {day:'numeric',month:'short',year:'numeric'}` → `10 Jul 2027` shape (lines 116–121, 150) | match |
| Pill background / radius | `#131313` / `14` | `#131313` / `14` (line 153) | match |
| Pill padding | `7px 12px` | `paddingVertical: 7, paddingHorizontal: 12` (line 153) | match |
| Pill margin-top | `3` | `marginTop: 3` (line 153) | match |
| Pill flex-shrink | `0` | not set; RN/Yoga default `flexShrink: 0` (line 153) | match |
| Pill text size / weight / colour | `12.5` / `600` / `#F4F3F0` | `12.5` / `sans('600')` / `#F4F3F0` (line 154) | match |
| Divider height / colour | `1` / `rgba(0,0,0,0.09)` | `1` / `rgba(0,0,0,0.09)` (line 159) | match |
| Divider margin | `18` top / `14` bottom / `0` sides | `marginTop: 18, marginBottom: 14` (line 159) | match |
| Next-charge row layout | `space-between` | `row`, `space-between` (line 160) | match |
| Next-charge label size / weight / colour | `14` / `400` / `#55534E` | `14` / `sans('400')` / `#55534E` (line 161) | match |
| Next-charge value size / weight / colour | `14` / `500` / `#1D1C1A` | `14` / `sans('500')` / `#1D1C1A` (line 162) | match |
| Group label left | `28` | `left: 28` (line 51) | match |
| Group label size / weight / colour | `12.5` / `600` / `#8B8882` | `12.5` / `sans('600')` / `#8B8882` (line 51) | match |
| Group label case | sentence case, no `text-transform`, no tracking | `"Plan"` / `"Billing"` as plain strings; `AppText` drops inherited tracking because the caller names `fontSize` (AppText.tsx line ~120) | match |
| "Plan" label top | canvas `330` → app `276` | `top={276}` (line 170) | match |
| "Billing" label top | canvas `544` → app `490` | `top={490}` (line 177) | match |
| Card left / right | `24` / `24` | `left: 24, right: 24` (line 60) | match |
| Plan card top | canvas `352` → app `298` | `top={298}` (line 171) | match |
| Billing card top | canvas `566` → app `512` | `top={512}` (line 178) | match |
| Card radius | `18` | `borderRadius: 18` (line 62) | match |
| Card background | `#FFFFFF` | `#FFFFFF` (line 63) | match |
| Card ring | `box-shadow:0 0 0 1px rgba(0,0,0,0.09)` | `boxShadow: '0 0 0 1px rgba(0,0,0,0.09)'` verbatim (line 64) | match |
| Card padding | `4px 20px` | `paddingVertical: 4, paddingHorizontal: 20` (lines 65–66) | match |
| Row layout / gap / padding | `align-items:center`, `gap:14`, `13px 0` | `row`, `center`, `gap: 14`, `paddingVertical: 13` (line 41) | match |
| Row hairline | `1px solid rgba(0,0,0,0.06)`, absent on last row of each card | `borderBottomWidth: last ? 0 : 1`, `rgba(0,0,0,0.06)` (line 41) | match |
| Icon chip size / radius / fill | `32` / `9` / `#F1EFE9` | `32` / `9` / `#F1EFE9` (line 42) | match |
| Icon chip centring / shrink | flex centre, `flex-shrink:0` | `alignItems/justifyContent: center`; RN default `flexShrink: 0` (line 42) | match |
| Row title size / weight / colour / flex | `15` / `500` / `#1D1C1A` / `flex:1` | `15` / `sans('500')` / `#1D1C1A` / `flex: 1` (line 43) | match |
| Row detail size / weight / colour | `13.5` / `400` / `#8B8882` | `13.5` / `sans('400')` / `#8B8882` (line 44) | match |
| Row chevron svg / `d` / stroke / width / caps | `7 × 12`, `viewBox="0 0 8 14"`, `M1.5 1.5 6 7l-4.5 5.5`, `rgba(0,0,0,0.28)`, `2`, round/round | identical (lines 24, 28–29) | match |
| Icon `plan` circle | `cx=12 cy=12 r=9`, `#1D1C1A`, `1.9`, `fill:none` | identical (line 76) | match |
| Icon `plan` needle `d` | `M15.5 8.5l-2 5-5 2 2-5z`, `fill="#1D1C1A"` | identical (line 77) | match |
| Icon `code` rect | `x=3.5 y=8 w=17 h=4 rx=1`, `1.9`, `fill:none` | identical (line 82) | match |
| Icon `code` path `d` + linejoin | long ribbon path, `1.9`, `stroke-linejoin="round"` | identical (lines 84–88) | match |
| Icon `restore` `d` + caps | `M4.5 12a7.5 7.5 0 1 1 2.2 5.3M4.5 12V7.5M4.5 12H9`, `1.9`, round/round | identical (line 94) | match |
| Icon `card` rect | `x=3 y=5.5 w=18 h=13 rx=2.4`, `1.9`, `fill:none` | identical (line 99) | match |
| Icon `card` stripe | `M3 9.5h18`, `1.9`, no linecap | identical (line 100) | match |
| Icon `receipts` sheet | `M6 3.5h8l4 4v13H6z`, `1.9`, linejoin round | identical (line 105) | match |
| Icon `receipts` lines | `M9 12h6M9 15.5h6`, **`1.7`**, linecap round | `strokeWidth={1.7}` (line 106) | match |
| All glyph viewBoxes / sizes | `19 × 19`, `viewBox="0 0 24 24"` | `width={19} height={19} viewBox="0 0 24 24"` on all five | match |
| Plan row order + copy | Change plan / Redeem a code / Restore purchases | same order, same strings (lines 172–174) | match |
| "Change plan" detail | `Yearly · $39.99` | `` `Yearly · ${price}` `` (line 172) | match |
| Billing row order + copy | Payment method / Receipts & invoices | same order, same strings (lines 179–180) | match |
| "Payment method" detail | `Apple ID` | `"Apple ID"` (line 179) | match |
| Cancel line left/right/top | `0` / `0` / canvas `712` → app `658` | `left: 0, right: 0, top: 658` (line 184) | match |
| Cancel line align / size / weight / colour | centre / `15` / `500` / `#8B8882` | `center` prop / `15` / `sans('500')` / `#8B8882` (line 184) | match |
| **Footer swell SVG** | **absent — deleted by the diff** | still rendered: `Svg 90 × 30`, `viewBox="0 0 90 30"`, path `M6 20c8-11 16-11 24 0s16 11 24 0 14-9 30-4`, `rgba(0,0,0,0.25)`, `2.2`, cap round (lines 190–193) | **MISMATCH** |
| **Footer caption** | **absent — deleted by the diff** | still rendered: `"the long road, together."`, `marginTop: 5.7`, `12.5`, `sans('500')`, `#8B8882` (line 197) | **MISMATCH** |
| Footer container top | n/a (element deleted) | `position:'absolute', left:0, right:0, top:714, alignItems:'center'` (line 190) | **MISMATCH** (whole container must go) |
| Scroll content height | frame body is `852 − 54 = 798`; final content ends ≈ app `676` (**derived**: `658 + 15 × ~1.19`) | `contentContainerStyle={{ height: 780 }}` (line 129) — a number sized for the now-deleted footer (`714 + 30 + 5.7 + ~15 ≈ 765`) | **MISMATCH** (consequential) |
| Row interactivity | `cursor:pointer` on **all five** rows | only "Change plan" gets `onPress`; the other four are `disabled` (lines 41, 172–174, 179–180) | **MISMATCH** (affordance) |
| Cancel line interactivity | `cursor:pointer` | plain `AppText`, no `Pressable`, no handler (lines 183–187) | **MISMATCH** (affordance) |
| Sticky-note reference | `15 · Manage Subscription` | header comment says "canvas 107" (line 14) | **MISMATCH** (doc only) |
| Header comment content | frame has no footer | comment still promises "the shore seeing you out: 'the long road, together.'" (lines 16–17) | **MISMATCH** (doc only) |
| Font family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | `sans()` → `'System'` on iOS / `SANS_WEB_STACK` on web (theme.ts 159–179) | match (project-wide equivalence) |
| Non-premium state (`Free tools` / `Free` / `Core tools included`, `$26.99`) | not on canvas | rendered (lines 116, 148, 150, 154, 172) | not design-verified — leave as is |

---

## 12. What must change

Ordered, all in `/Users/admin/Documents/tideline/src/app/subscription.tsx`:

1. **Delete the footer block, lines 189–198** — the comment `{/* the shore, seeing you out */}`,
   the wrapping `<View style={{ position:'absolute', left:0, right:0, top:714, alignItems:'center' }}>`,
   the `<Svg width={90} height={30} viewBox="0 0 90 30">` swell, the explanatory comment on
   lines 194–196, and the `<AppText …>the long road, together.</AppText>`. The final frame
   ends at `Cancel subscription`; nothing renders below app-top `676`.
2. **Drop the now-unused import** — after step 1 nothing else in the file uses the swell, but
   `Svg`/`Path` are still needed by the icons, so the import line 7 stays as is. Verify no
   other symbol goes unused (nothing does: `Circle`, `Rect`, `Path`, `Svg` all remain in `ICON`).
3. **Retune `contentContainerStyle` on line 129** — `height: 780` was sized for the deleted
   footer. Content now ends at app-top ≈ `676`. Set `height: 700` (**derived**: content bottom
   `676` + a `24` tail, still under the frame's `798` body height) so the screen does not
   invent a scroll on shorter devices.
4. **Fix the header comment, lines 13–20** — remove the sentence "and the shore seeing you
   out: 'the long road, together.'" and change "canvas 107" to "canvas 15" to match
   `.uifinal/final/Email Login/_notes.json`.
5. **Optional, canvas-supported affordance:** the canvas puts `cursor:pointer` on all five
   card rows and on the cancel line. Four rows (`Redeem a code`, `Restore purchases`,
   `Payment method`, `Receipts & invoices`) and the cancel line are inert in the app. If the
   handlers exist, wire them; if not, this is a known gap, not a licence to restyle the rows —
   every colour and metric above already matches.

Nothing else in this file may be touched. Every geometry, colour, radius, shadow, font size,
weight and SVG path in §11 above already matches the final canvas character for character.
