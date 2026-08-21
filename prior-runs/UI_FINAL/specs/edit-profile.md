# Edit Profile — pixel spec

Transcribed from the final canvas bundle. Every number below is copied character for
character from the CSS; nothing is rounded and no theme token is substituted for a value
that differs. Where a number is *derived* (e.g. a card's total height from padding + rows)
it is labelled **derived** and the arithmetic is shown.

## Header

| Sticky note | Frame label | Split file | Target app file |
|---|---|---|---|
| `93 · Edit Profile` | Edit Profile | `/Users/admin/Documents/tideline/.uifinal/pretty/final/Email Login/Edit-Profile.html` (raw: `/Users/admin/Documents/tideline/.uifinal/final/Email Login/Edit-Profile.html`) | `/Users/admin/Documents/tideline/src/app/profile.tsx` |
| `93B · Profile photo sheet` | Sheet Profile Photo | `/Users/admin/Documents/tideline/.uifinal/pretty/final/Email Login/Sheet-Profile-Photo.html` | `/Users/admin/Documents/tideline/src/app/profile.tsx` |
| `93C · Edit name sheet` | Sheet Edit Name | `/Users/admin/Documents/tideline/.uifinal/pretty/final/Email Login/Sheet-Edit-Name.html` | `/Users/admin/Documents/tideline/src/app/profile.tsx` |

Diff read: `/Users/admin/Documents/tideline/.uifinal/diffs/Edit-Profile.html.diff`
Prev frame read: `/Users/admin/Documents/tideline/.uifinal/pretty/prev/Email Login/Edit-Profile.html`
No diff file exists for `Sheet-Profile-Photo` or `Sheet-Edit-Name` — both are new/unchanged frames.

**Frame relationship (verified by byte diff):** lines 1–618 of `Sheet-Profile-Photo.html` and
`Sheet-Edit-Name.html` are byte-identical to `Edit-Profile.html` apart from the
`data-screen-label` attribute. Both sheets are pure overlays appended after the base screen —
the screen behind is **not** scaled, dimmed at the element level, or re-laid-out. Only the
full-bleed scrim sits on top.

---

## 1. Frame shell (all three frames)

| Property | Value |
|---|---|
| Frame size | `393px` × `852px` |
| position / overflow | `relative` / `hidden` |
| background | `#F4F3F0` |
| font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` |
| font smoothing | `-webkit-font-smoothing:antialiased` |
| flex-shrink | `0` |
| Frame box-shadow (canvas chrome only, not app) | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` |
| Noise layer | `position:absolute; inset:0; background-image:url('noise-dark.png'); opacity:0.07; pointer-events:none` |

Status bar block: `position:absolute; top:0; left:0; right:0; height:54px; display:flex;
align-items:center; justify-content:space-between; padding:6px 32px 0 46px; box-sizing:border-box;
z-index:20`. **The app never builds this.** Every canvas `top` below therefore gets a matching
"app top" column = `canvas top − 54`.

---

## 2. Edit Profile — vertical map

| Element | Canvas top | App top (canvas − 54) | Height |
|---|---|---|---|
| Status bar (not built) | `0` | — | `54` |
| Back row | `64` | **`10`** | `≈20.3` (17px line box) — **derived** |
| Title "Edit profile" | `114` | **`60`** | `≈32.2` (27px line box) — **derived** |
| Monogram block (full-width, centred column) | `166` | **`112`** | `≈117.3` — **derived**: `88 + 12 + ≈17.3` |
| Identity card | `318` | **`264`** | `148` — **derived**: `4 + 46 + 1 + 46 + 1 + 46 + 4` |
| Identity card bottom | `466` | `412` | — |
| Caption "Medallions" | `486` | **`432`** | `≈15.5` (13px line box) |
| Medallions card | `512` | **`458`** | `80` — **derived**: `16 + 48 + 16` |
| Medallions card bottom | `592` | `538` | — |
| Caption "Journey" | `620` | **`566`** | `≈15.5` |
| Journey card | `646` | **`592`** | `148` — **derived**: `4 + 46 + 1 + 46 + 1 + 46 + 4` |
| Journey card bottom | `794` | `740` | — |

Derived gaps that the rebuild must reproduce:

| Gap | Value |
|---|---|
| Frame top → Back row | `10` (app space) |
| Back row top → Title top | `50` |
| Title top → Monogram block top | `52` |
| Monogram block bottom → Identity card top | `≈34.7` |
| Identity card bottom → "Medallions" caption top | **`20`** |
| "Medallions" caption top → Medallions card top | **`26`** |
| Medallions card bottom → "Journey" caption top | **`28`** |
| "Journey" caption top → Journey card top | **`26`** |

> **Canvas inconsistency, stated explicitly.** The two card→caption gaps are *not* equal:
> `20` before "Medallions" and `28` before "Journey". Both caption→card gaps *are* equal at
> `26`. The evidence supports transcribing both card→caption gaps literally (20 and 28) rather
> than normalising them: the medallion coins carry a `0 0 0 5.4px` outer ring that paints
> outside the 48px layout box, so the extra 8px under that card is optically load-bearing.

---

## 3. Edit Profile — element table

### 3.1 Back row

| Property | Value |
|---|---|
| position | `absolute; left:16px; top:64px` (app `top:10`) |
| layout | `display:flex; align-items:center; gap:9px` |
| Glyph | `<svg width="11" height="19" viewBox="0 0 11 19">` |
| Glyph stroke | `#55534E`, `stroke-width:2.4`, `stroke-linecap:round`, `stroke-linejoin:round`, `fill:none` |
| Label | `Back` — `font-size:17px; font-weight:400; color:#55534E`; no letter-spacing, no line-height declared |

```
M9.5 1.5L2 9.5l7.5 8
```

### 3.2 Page title

| Property | Value |
|---|---|
| position | `absolute; left:16px; top:114px` (app `top:60`) |
| text | `Edit profile` |
| font | `font-size:27px; font-weight:600; letter-spacing:-0.2px; color:#1D1C1A` |
| align | left (default) |

### 3.3 Monogram block

| Property | Value |
|---|---|
| Container | `position:absolute; left:0; right:0; top:166px` (app `112`); `display:flex; flex-direction:column; align-items:center` |
| Avatar | `width:88px; height:88px; border-radius:50%` (→ RN `borderRadius:44`); `background:#EDECE7`; flex-centred both axes |
| Monogram letter | `S` — `font-size:28px; font-weight:600; color:#55534E` |
| Edit badge | `position:absolute; bottom:-2px; right:-2px; width:30px; height:30px; border-radius:50%` (→ RN `15`); `background:#131313`; flex-centred |
| Badge icon | `<svg width="14" height="14" viewBox="0 0 24 24">`, `stroke:#F4F3F0`, `stroke-width:2`, `fill:none`, `stroke-linejoin:round` (no `stroke-linecap` declared) |
| "Change photo" | `margin-top:12px; font-size:14.5px; font-weight:600; color:#1D1C1A` |

```
M4 20l4-1L19 8a2 2 0 00-3-3L5 16l-1 4z
```

**State:** the frame shows only the filled-monogram (no-photo) state. Tapping "Change photo"
(and, by the badge's presence, the badge itself) opens frame 93B.

### 3.4 Identity card

| Property | Value |
|---|---|
| position | `absolute; left:12px; right:12px; top:318px` (app `264`) |
| radius | `16px` (all four corners) |
| background | `#FFFFFF` |
| padding | `4px 18px` (top/bottom 4, left/right 18) |
| box-sizing | `border-box` |
| border / shadow | none |

Rows (three, identical geometry):

| Property | Value |
|---|---|
| Row height | `46px` |
| Row layout | `display:flex; align-items:center; gap:12px` |
| Divider | `border-bottom:1px solid rgba(0,0,0,0.06)` on rows 1 and 2; row 3 has **no** border |
| Divider inset | none — the border runs the full padded width (`18px` in from each card edge) |
| Label | `width:86px; font-size:13.5px; color:#8B8882; flex-shrink:0` (weight not declared → 400) |
| Value | `font-size:14.5px; font-weight:500; color:#1D1C1A` |

| # | Label | Value |
|---|---|---|
| 1 | `Name` | `Sam Reyes` |
| 2 | `Username` | `@sam` |
| 3 | `Email` | `sam@example.com` |

**States:** all three rows render as static text — there is no `TextInput`, no caret, no
chevron, and no placeholder state in the frame. The Name row is the entry point to frame 93C.

### 3.5 Section captions

| Property | Value |
|---|---|
| position | `absolute; left:16px` — "Medallions" `top:486px` (app `432`), "Journey" `top:620px` (app `566`) |
| font | `font-size:13px; font-weight:600; color:#55534E` |
| transform | **none** — not uppercase, no letter-spacing |

### 3.6 Medallions card

| Property | Value |
|---|---|
| position | `absolute; left:12px; right:12px; top:512px` (app `458`) |
| radius | `16px` |
| background | `#FFFFFF` |
| padding | `16px 18px` |
| Row layout | `display:flex; align-items:center; gap:10px` |
| Coin | `width:48px; height:48px; border-radius:50%` (→ RN `24`); `overflow:hidden`; `flex-shrink:0` |
| Coin ring | `box-shadow:0 0 0 1.5px rgba(0,0,0,0.2), 0 0 0 4px #FFFFFF, 0 0 0 5.4px rgba(0,0,0,0.16)` |
| Overflow badge | `width:48px; height:48px; border-radius:50%; background:#EDECE7`, flex-centred, `flex-shrink:0` |
| Overflow label | `+3` — `font-size:12.5px; font-weight:600; color:#55534E` |
| Spacer | `<div style="flex:1">` between the badge and the chevron |
| Chevron | `<svg width="8" height="14" viewBox="0 0 8 14">`, `stroke:#B0AEA8`, `stroke-width:2`, `fill:none`, `stroke-linecap:round`, `stroke-linejoin:round` |

```
M1 1l6 6-6 6
```

Frame content: **4 coins + `+3`** (i.e. 7 earned). See §6 for the coin artwork.

### 3.7 Journey card

| Property | Value |
|---|---|
| position | `absolute; left:12px; right:12px; top:646px` (app `592`) |
| radius | `16px` |
| background | `#FFFFFF` |
| padding | `4px 18px` |

| # | Row layout | Left | Right | Divider |
|---|---|---|---|---|
| 1 | `height:46px; display:flex; align-items:center; justify-content:space-between` | `Started VICI` — `font-size:15px; color:#55534E` (weight 400) | `14 Mar 2026` — `font-size:15px; font-weight:600; color:#1D1C1A` | `border-bottom:1px solid rgba(0,0,0,0.06)` |
| 2 | same | `Current week` — `font-size:15px; color:#55534E` | `VI · Discipline` (`VI &middot; Discipline`) — `font-size:15px; font-weight:600; color:#1D1C1A` | `border-bottom:1px solid rgba(0,0,0,0.06)` |
| 3 | same | `Weekly reports` — **`font-size:16px; font-weight:500; color:#1D1C1A`** | chevron `8×14`, `#B0AEA8`, `stroke-width:2` (same `d` as §3.6) | none |

Row 3 is a distinct treatment: a single 16px/500 ink label plus a disclosure chevron. It is
**not** the 15/400 + 15/600 record pair used by rows 1–2.

---

## 4. Frame 93B — Sheet Profile Photo

Base screen: identical to §3. Appended on top:

### 4.1 Scrim

| Property | Value |
|---|---|
| position | `absolute; inset:0` |
| background | `rgba(19,19,19,0.45)` |
| z-index | `30` |
| blur / blend | none — no `backdrop-filter`, no `mix-blend-mode` |

### 4.2 Sheet container (shared by 93B and 93C)

| Property | Value |
|---|---|
| position | `absolute; left:0; right:0; bottom:0` |
| radius | `24px 24px 0 0` (top-left 24, top-right 24, bottom 0/0) |
| background | `#F4F3F0` |
| shadow | `0 -12px 40px rgba(19,19,19,0.3)` (x `0`, y `-12`, blur `40`, spread `0`) |
| z-index | `31` |
| padding | `10px 20px 30px` (top 10, sides 20, bottom 30) |
| box-sizing | `border-box` |
| Grabber | `width:36px; height:5px; border-radius:3px; background:rgba(19,19,19,0.15); margin:0 auto` |
| Sheet title | `margin-top:16px; text-align:center; font-size:17px; font-weight:600; color:#1D1C1A` |

93B title text: `Profile photo`. 93C title text: `Name`.

### 4.3 Options card (93B)

| Property | Value |
|---|---|
| container | `margin-top:16px; border-radius:16px; background:#FFFFFF; padding:4px 0` |
| Option row | `height:52px; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:500` |
| Divider | `height:1px; background:rgba(0,0,0,0.06); margin:0 18px` (**18px inset each side** — unlike the identity card, this divider is an explicit 1px element, not a border) |

| # | Text | Colour |
|---|---|---|
| 1 | `Take photo` | `#1D1C1A` |
| 2 | `Choose from library` | `#1D1C1A` |
| 3 | `Remove photo` | **`#A4613C`** |

Card height = `4 + 52 + 1 + 52 + 1 + 52 + 4` = **166** — *derived*.

### 4.4 Cancel button (93B)

| Property | Value |
|---|---|
| box | `margin-top:12px; height:50px; border-radius:25px; background:#F4F3F0` |
| ring | `box-shadow:0 0 0 1.5px rgba(0,0,0,0.2)` (inset-less spread ring, no offset, no blur) |
| layout | `display:flex; align-items:center; justify-content:center` |
| label | `Cancel` — `font-size:16px; font-weight:600; color:#55534E` |

Sheet height ≈ `10 + 5 + 16 + 20.3 + 16 + 166 + 12 + 50 + 30` = **≈325.3** — *derived*, assuming a
17px system line box of ≈20.3. Canvas top ≈ `527`, app top ≈ `473`. The sheet is bottom-anchored,
so this figure is informational only.

**States shown:** default only. No pressed, disabled or destructive-confirm state appears.

---

## 5. Frame 93C — Sheet Edit Name

Base screen and scrim: identical to §4.1/§4.2. Sheet title `Name`.

| Element | Property | Value |
|---|---|---|
| Input box | container | `margin-top:16px; height:54px; border-radius:16px; background:#FFFFFF; display:flex; align-items:center; padding:0 18px` |
| | ring | `box-shadow:0 0 0 1.5px rgba(0,0,0,0.14)` — note **0.14**, weaker than the Cancel pill's 0.2 |
| | value text | `Sam Reyes` — `font-size:16.5px; font-weight:500; color:#1D1C1A` |
| | caret | `width:2px; height:22px; background:#131313; margin-left:2px` (sits immediately after the text — the frame shows the **focused/editing** state) |
| Helper | | `margin-top:8px; font-size:12.5px; color:#8B8882` (weight 400, left-aligned) — `Shown on your vow and your letters.` |
| Save button | box | `margin-top:16px; height:54px; border-radius:27px; background:#131313; display:flex; align-items:center; justify-content:center` |
| | label | `Save` — `font-size:17px; font-weight:600; color:#FFFFFF` |

Sheet height ≈ `10 + 5 + 16 + 20.3 + 16 + 54 + 8 + 15 + 16 + 54 + 30` = **≈244.3** — *derived*.
Canvas top ≈ `608`, app top ≈ `554`.

**States shown:** focused-with-value only. No empty, error or disabled-Save state appears.

---

## 6. Visualization — medallion coin artwork (48px coins, Medallions card)

Each coin is a `48 × 48` circle with `overflow:hidden`, containing an absolutely-positioned
stack. Percentages are of the 48px box (so `62% = 29.76px`, `80% = 38.4px`, etc.).
Coordinate origin: top-left of the coin. Layer order = document order (later paints on top).

### Coin 1

| Layer | Geometry | Paint |
|---|---|---|
| Sky | `inset:0` | `linear-gradient(180deg, #EFEEE8 0%, #EFEDE6 100%)` — 180deg = top→bottom |
| Sun | `left:14%; top:4%; width:62%; height:62%; border-radius:50%` | `radial-gradient(closest-side, rgba(243,227,196,0.95), rgba(243,227,196,0) 78%)` |
| Hill A | `left:-25%; right:-25%; top:56%; height:80%; border-radius:50% 50% 0 0 / 46% 46% 0 0` | `#DEDDD6` |
| Hill B | `left:-45%; right:-15%; top:70%; height:80%; border-radius:50% 50% 0 0 / 40% 40% 0 0` | `#CFCEC7` |
| Hill C | `left:-15%; right:-45%; top:84%; height:80%; border-radius:50% 50% 0 0 / 36% 36% 0 0` | `#C0BFB8` |

### Coin 2

| Layer | Geometry | Paint |
|---|---|---|
| Sky | `inset:0` | `linear-gradient(180deg, #EFEEE8 0%, #EFEDE6 100%)` |
| Sun | `left:20%; top:14%; width:66%; height:66%; border-radius:50%` | `radial-gradient(closest-side, rgba(243,227,196,0.9), rgba(243,227,196,0) 78%)` |
| Hill A | `left:-25%; right:-25%; top:66%; height:80%; border-radius:50% 50% 0 0 / 42% 42% 0 0` | `#DEDDD6` |
| Hill B | `left:-40%; right:-20%; top:82%; height:80%; border-radius:50% 50% 0 0 / 36% 36% 0 0` | `#CFCEC7` |

### Coin 3 (no sun — cool sky band instead)

| Layer | Geometry | Paint |
|---|---|---|
| Sky | `inset:0` | `linear-gradient(180deg, #EFEEE8 0%, #EFEDE6 100%)` |
| Band | `left:-25%; right:-25%; top:46%; height:80%; border-radius:50% 50% 0 0 / 48% 48% 0 0` | `#D8E3ED` |
| Hill A | `left:-45%; right:-15%; top:62%; height:80%; border-radius:50% 50% 0 0 / 42% 42% 0 0` | `#CFCEC7` |
| Hill B | `left:-15%; right:-45%; top:78%; height:80%; border-radius:50% 50% 0 0 / 38% 38% 0 0` | `#C0BFB8` |

### Coin 4 — the `veni` scene (sail + hull)

| Layer | Geometry | Paint |
|---|---|---|
| Sky | `inset:0` | `linear-gradient(180deg, #F1F0EB 0%, #ECEAE3 100%)` |
| Sun | `left:16%; top:6%; width:56%; height:56%; border-radius:50%` | `radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 75%)` |
| Hill A | `left:-25%; right:-25%; top:64%; height:80%; border-radius:50% 50% 0 0 / 46% 46% 0 0` | `#DEDDD6` |
| Hill B | `left:-45%; right:-15%; top:78%; height:80%; border-radius:50% 50% 0 0 / 40% 40% 0 0` | `#CFCEC7` |
| Scene SVG | `position:absolute; inset:0; width:100%; height:100%` | `viewBox="0 0 100 100"` |

Scene SVG contents, verbatim:

```
<defs>
  <linearGradient id="cg8" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#4A4843"></stop>
    <stop offset="1" stop-color="#1D1C19"></stop>
  </linearGradient>
</defs>
<ellipse cx="50" cy="68" rx="21" ry="3.5" fill="rgba(40,38,32,0.14)"></ellipse>
<path d="M52 24 L52 50 L35 50 Z" fill="#3A3934"></path>
<path d="M29 54 L73 54 Q69 64 51 64 Q33 64 29 54 Z" fill="url(#cg8)"></path>
<path d="M34 56.5 L68 56.5" stroke="rgba(255,255,255,0.18)" stroke-width="2" stroke-linecap="round"></path>
```

Path `d` strings alone:

```
M52 24 L52 50 L35 50 Z
M29 54 L73 54 Q69 64 51 64 Q33 64 29 54 Z
M34 56.5 L68 56.5
```

**Data → pixel mapping.** The coin row is a fixed-count strip, not a scale: up to **4** earned
coins are shown at `48px` with `gap:10`, followed by a `+N` badge when more are earned, then a
`flex:1` spacer, then the chevron.

| Case | Rendering |
|---|---|
| No coins earned | Not depicted in the frame. Row would collapse to spacer + chevron; the card's `16px` vertical padding gives it a 32px height, which the canvas never shows — treat as undefined and keep the row at 48 tall. |
| 1–4 earned | That many coins, **no** `+N` badge, spacer, chevron. |
| Exactly 5+ earned | 4 coins + `+N` badge (`N = earned − 4`), spacer, chevron. Frame shows `+3` → 7 earned. |
| Overflow | Row never wraps and never scrolls; the `flex:1` spacer absorbs the slack. Widest state = `4×48 + 48 + 5×10 + 8` = `298` inside a `369 − 36 = 333`-wide content box — 35px of slack remains, so it never clips. |

No axes, ticks, gridlines, dash arrays, clip paths or masks appear anywhere in these three frames.

---

## 7. Comparison — design vs `src/app/profile.tsx`

| Property | Design value | Current app value | Verdict |
|---|---|---|---|
| **Header — structure** | Back row (glyph + "Back") at app `top:10`, then a large left-aligned title at app `top:60` | Centred 18.5px title at `top:10` with `Cancel` (left 16, top 12) and `Save` (right 16, top 12) — profile.tsx L87–106 | **MISMATCH** |
| Header container height | Title bottom ≈ app `92`, monogram starts `112` | `View {height: 64}` — L87 | **MISMATCH** |
| Back glyph | `11×19`, `viewBox 0 0 11 19`, `d="M9.5 1.5L2 9.5l7.5 8"`, `#55534E`, `stroke-width:2.4`, round cap/join | not present (`BackGlyph` in `src/components/ui/marks.tsx:205` is an exact match if adopted) | **MISMATCH** (absent) |
| Back label | `Back`, `17px`, weight `400`, `#55534E` | `Cancel`, `17px`, weight `400`, `#3A3934` — L97 | **MISMATCH** |
| Save affordance in header | none (Save lives in sheet 93C) | `Save`, `17px`, weight `600`, `#1D1C1A`, right 16 — L104 | **MISMATCH** |
| Title text/size/weight | `Edit profile`, `27px`, `600` | `Edit profile`, `18.5px`, `600` — L89 | **MISMATCH** |
| Title letter-spacing | `-0.2px` | `0.2` — L89 | **MISMATCH** (sign flipped) |
| Title alignment / position | left, `left:16`, `top:60` (app) | centred, `left:80 right:80`, `top:10` — L89 | **MISMATCH** |
| Title colour | `#1D1C1A` | `#1D1C1A` — L89 | match |
| Monogram block top (app space) | `112` | `64` (header 64 + scroll y 0) — L87/L110 | **MISMATCH** |
| Monogram block height | `≈117.3` content, block occupies `112 → 264` = `152` | `156` — L110 | **MISMATCH** |
| Avatar size / radius / fill | `88×88`, `border-radius:50%` (44), `#EDECE7` | `88`, `44`, `#EDECE7` — L112 | match |
| Monogram letter | `28px`, `600`, `#55534E` | `28`, `'600'`, `#55534E` — L113 | match |
| Edit badge | `bottom:-2; right:-2; 30×30; r15; #131313` | `bottom:-2, right:-2, 30, 30, 15, #131313` — L115 | match |
| Badge icon | `14×14`, `viewBox 0 0 24 24`, `d="M4 20l4-1L19 8a2 2 0 00-3-3L5 16l-1 4z"`, `#F4F3F0`, `sw 2`, `linejoin round` | identical — L116–118 | match |
| "Change photo" text style | `margin-top:12`, `14.5px`, `600`, `#1D1C1A` | `marginTop:12`, `14.5`, `'600'`, `#1D1C1A` — L121–122 | match |
| "Change photo" action | opens sheet 93B | `PressScale` with **no `onPress`** — L121 | **MISMATCH** |
| Identity card top (app space) | `264` | `220` — derived from L87 + L110 | **MISMATCH** |
| Identity card gutters / radius / fill / padding | `left:12 right:12`, `16`, `#FFFFFF`, `4px 18px` | `marginHorizontal:12`, `borderRadius:16`, `#FFFFFF`, `paddingVertical:4`, `paddingHorizontal:18` — L126 | match |
| Identity card bottom margin | `20` (card bottom 412 → caption 432) | `marginBottom: 26` — L126 | **MISMATCH** |
| Identity row height / gap | `46`, `gap:12` | `46`, `gap:12` — L127, L203 | match |
| Identity label style | `width:86; 13.5px; 400; #8B8882` | `width:86, fontSize:13.5, color:'#8B8882'`, `sans('400')` — L128/L204 | match |
| Identity value style | `14.5px; 500; #1D1C1A` | `14.5`, `sans('500')`, `#1D1C1A` — L134/L205 | match |
| Identity dividers | `1px rgba(0,0,0,0.06)` after rows 1 and 2 only | `height:1, HAIRLINE='rgba(0,0,0,0.06)'` after rows 1 and 2 — L137, L139 | match |
| Name row control | static text; row opens sheet 93C | live `TextInput` with placeholder `Your name`, `placeholderTextColor="#B0AEA8"` — L129–135 | **MISMATCH** |
| Section caption font | `13px`, `600`, `#55534E`, **no** transform, **no** tracking | `13`, `sans('600')`, `#55534E`, no transform — L186 | match |
| Caption box height (caption top → card top) | `26` | `height: 26` — L185 | match |
| Caption gutter | `left:16` | `paddingHorizontal: 16` — L185 | match |
| Medallions card top (app space) | `458` | `420` | **MISMATCH** |
| Medallions card padding | `16px 18px` | `paddingVertical:16, paddingHorizontal:18` — L143 | match |
| Medallions card bottom margin | `28` (card bottom 538 → caption 566) | `gap={24}` → `marginBottom: 24` — L143/L184 | **MISMATCH** |
| Coin size / radius / gap | `48`, `50%` (24), `gap:10` | `48`, `24`, `gap:10` — L148, L151 | match |
| Coin ring shadow | `0 0 0 1.5px rgba(0,0,0,0.2), 0 0 0 4px #FFFFFF, 0 0 0 5.4px rgba(0,0,0,0.16)` | identical string — L151 | match |
| Coin clipping | wrapper has `overflow:hidden` | wrapper has no `overflow:'hidden'` (relies on `KKMedallion`'s own clip) — L151 | **MISMATCH** (low risk) |
| `+N` badge | `48×48`, `50%`, `#EDECE7`, label `12.5px/600/#55534E` | `48`, `24`, `#EDECE7`, `12.5`, `sans('600')`, `#55534E` — L156–157 | match |
| Spacer + chevron | `flex:1` spacer, then `8×14` chevron `#B0AEA8`, `sw 2`, round cap/join, `d="M1 1l6 6-6 6"` | `<View style={{flex:1}} />` + `<ChevronGlyph color="#B0AEA8" />` (marks.tsx:223 — same geometry) — L160–161 | match |
| Coin count shown | 4 + `+3` | `slice(0, 4)` + `+N` — L77–78 | match |
| Medallions row target | disclosure chevron implies a push | `router.push('/milestones')` — L145 | match |
| Journey card top (app space) | `592` | `550` | **MISMATCH** |
| Journey card gutters / radius / fill / padding | `left:12 right:12`, `16`, `#FFFFFF`, `4px 18px` | `marginHorizontal:12`, `16`, `#FFFFFF`, `paddingVertical:4, paddingHorizontal:18` — L165 | match |
| Journey row 1 | `Started VICI` `15/400/#55534E` → `14 Mar 2026` `15/600/#1D1C1A`, hairline below | `FieldLine label="Started VICI" record` → `15/400/#55534E` + `15/600/#1D1C1A`, hairline below — L166–167 | match |
| Journey row 2 | `Current week` → `VI · Discipline`, `15/400/#55534E` + `15/600/#1D1C1A`, hairline below | `My values` → `${valuesCount} chosen`, tappable to `/lifemap`, **no** hairline below — L168 | **MISMATCH** |
| Journey row 3 | `Weekly reports` `16px/500/#1D1C1A` + `8×14` chevron `#B0AEA8`, no divider | **row does not exist** | **MISMATCH** (absent) |
| Journey card row count | 3 | 2 — L166–168 | **MISMATCH** |
| Extra "App" section | not in any of the three frames | `Section header="App"` with a `Settings` row — L172–174 | **addition** (documented as deliberate at L171; flagged, not a canvas finding) |
| **Sheet 93B — scrim** | `rgba(19,19,19,0.45)`, `inset:0`, z `30` | not built | **MISMATCH** (absent) |
| Sheet 93B — container | radius `24 24 0 0`, `#F4F3F0`, `0 -12px 40px rgba(19,19,19,0.3)`, padding `10px 20px 30px` | not built | **MISMATCH** (absent) |
| Sheet 93B — grabber | `36×5`, r`3`, `rgba(19,19,19,0.15)`, centred | not built | **MISMATCH** (absent) |
| Sheet 93B — title | `Profile photo`, `17/600/#1D1C1A`, centred, `margin-top:16` | not built | **MISMATCH** (absent) |
| Sheet 93B — options card | `margin-top:16`, r`16`, `#FFFFFF`, `padding:4px 0`; rows `52` tall, centred, `16/500`; dividers `1px rgba(0,0,0,0.06)` inset `18` | not built | **MISMATCH** (absent) |
| Sheet 93B — destructive row | `Remove photo`, `#A4613C` | not built; nearest token `colors.danger = '#B5624F'` **differs** | **MISMATCH** (absent; use the literal) |
| Sheet 93B — Cancel pill | `margin-top:12`, `h50`, `r25`, `#F4F3F0`, `0 0 0 1.5px rgba(0,0,0,0.2)`, label `16/600/#55534E` | not built | **MISMATCH** (absent) |
| **Sheet 93C — title** | `Name`, `17/600/#1D1C1A`, centred | not built | **MISMATCH** (absent) |
| Sheet 93C — input box | `margin-top:16`, `h54`, `r16`, `#FFFFFF`, `0 0 0 1.5px rgba(0,0,0,0.14)`, `padding:0 18px` | not built (name is edited inline in the identity card) | **MISMATCH** (absent) |
| Sheet 93C — value text | `16.5px/500/#1D1C1A` | inline `TextInput` at `14.5/500` — L134 | **MISMATCH** |
| Sheet 93C — caret | `2×22`, `#131313`, `margin-left:2` | native caret on the inline input | **MISMATCH** |
| Sheet 93C — helper | `margin-top:8`, `12.5px`, `400`, `#8B8882`, `Shown on your vow and your letters.` | not present | **MISMATCH** (absent) |
| Sheet 93C — Save button | `margin-top:16`, `h54`, `r27`, `#131313`, label `17/600/#FFFFFF` | header text `Save` at `17/600/#1D1C1A` — L104 | **MISMATCH** |
| Frame background | `#F4F3F0` | `colors.bg = '#F4F3F0'` — theme.ts | match |
| Noise overlay | `opacity:0.07`, full-bleed, non-interactive | `opacity: 0.07`, `position:'absolute'` inset 0, `pointerEvents="none"` — L83 | match |

Token checks worth stating so no substitution creeps in during the rebuild:

| Canvas literal | Nearest theme token | Same? |
|---|---|---|
| `#F4F3F0` | `colors.bg` | yes |
| `#FFFFFF` | `colors.surface` | yes |
| `#131313` | `colors.ink` / `colors.accent` | yes |
| `#1D1C1A` | `colors.text` | yes |
| `#55534E` | `colors.textMuted` | yes |
| `#8B8882` | `colors.textSoft` | yes |
| `rgba(0,0,0,0.06)` | `colors.hairline` | yes |
| `rgba(0,0,0,0.14)` | `colors.borderStrong` | yes |
| `#B0AEA8` | `colors.textSofter = #B4B1AB` | **no — use the literal** |
| `#EDECE7` | `colors.surfaceAlt = #EFEEEA` | **no — use the literal** |
| `#A4613C` | `colors.danger = #B5624F` | **no — use the literal** |
| `#FFFFFF` (Save label) | `colors.accentText = #F5F4F1` | **no — use the literal** |
| `rgba(19,19,19,0.45)` | `colors.overlay = rgba(24,23,21,0.5)` | **no — use the literal** |

Note on reuse: `SettingsTopBar` (`src/components/ui/kit.tsx:253`) is structurally the header this
frame wants (BackGlyph + 17/400 muted "Back", then a 27px/600 title) but its title uses
`letterSpacing: -0.4` and `colors.inkAlt (#26251F)`, where the canvas says `-0.2` and `#1D1C1A`.
Adopting it as-is would introduce two new mismatches; either pass overrides or build the header
inline.

---

## 8. What must change — `/Users/admin/Documents/tideline/src/app/profile.tsx`

1. **Replace the Cancel/Save header (L87–106) with the Back + big-title header.** Container
   height `112`. Back row at `top:10`, `left:16`, `flexDirection:'row'`, `alignItems:'center'`,
   `gap:9`, `BackGlyph` (default `colors.textMuted` is correct) + `AppText sans('400')
   {fontSize:17, color:'#55534E'}` reading `Back`, wired to `close()`. Title at `top:60`,
   `left:16`, left-aligned, `sans('600') {fontSize:27, letterSpacing:-0.2, color:'#1D1C1A'}`.
   Delete the header `Save` press target — Save now lives in the name sheet.
2. **Change the monogram block height from `156` to `152` (L110)** so the identity card lands at
   app `264` under the new 112-tall header.
3. **Change the identity card's `marginBottom` from `26` to `20` (L126).**
4. **Change the Medallions `Section gap` from `24` to `28` (L143).**
5. **Replace the inline `TextInput` in the Name row (L129–135) with static text** styled
   `sans('500') {fontSize:14.5, color:'#1D1C1A'}`, wrapped in a press target that opens the new
   name sheet. Keep the `86`-wide `13.5/#8B8882` label untouched.
6. **Rebuild the Journey card (L165–169) as three rows:** `Started VICI` → date (hairline),
   `Current week` → `VI · Discipline` roman-numeral + virtue (hairline), then a new
   action-row type — single label `sans('500') {fontSize:16, color:'#1D1C1A'}` reading
   `Weekly reports` plus `<ChevronGlyph color="#B0AEA8" />`, `justifyContent:'space-between'`,
   height `46`, no divider — pushing to `/weekly-report`. `FieldLine` cannot express this row;
   add a sibling component (e.g. `ActionLine`). The `My values` row is gone from the canvas —
   if the `/lifemap` door must survive, it needs a home outside this card.
7. **Add the Profile Photo sheet (93B).** New `Modal transparent animationType="slide"` (follow
   the pattern in `src/components/ChallengeSheet.tsx:39`, but with this frame's own numbers:
   scrim `rgba(19,19,19,0.45)`, top radius `24` not 28). Contents per §4: grabber `36×5/r3/
   rgba(19,19,19,0.15)`; title `Profile photo` `17/600` centred with `marginTop:16`; white card
   `marginTop:16, r16, paddingVertical:4`; three `52`-tall centred `16/500` rows
   (`Take photo`, `Choose from library`, `Remove photo` in `#A4613C`) with `1px rgba(0,0,0,0.06)`
   dividers inset `18`; Cancel pill `marginTop:12, h50, r25, bg #F4F3F0,
   boxShadow '0 0 0 1.5px rgba(0,0,0,0.2)'`, label `16/600/#55534E`. Open it from "Change photo"
   (L121) and from the badge.
8. **Add the Edit Name sheet (93C).** Same shell; title `Name`; input box `marginTop:16, h54,
   r16, #FFFFFF, boxShadow '0 0 0 1.5px rgba(0,0,0,0.14)', paddingHorizontal:18` holding a
   `16.5/500/#1D1C1A` `TextInput`; helper `marginTop:8, 12.5, #8B8882` reading
   `Shown on your vow and your letters.`; Save pill `marginTop:16, h54, r27, bg #131313`, label
   `17/600/#FFFFFF`, calling the existing `save()` (L44–48) and dismissing the sheet rather than
   the screen.
9. **Add `overflow:'hidden'` to the coin wrapper (L151)** to match the canvas clip contract.
10. **Decide the fate of the extra "App" section (L172–174).** It is not in any of the three
    frames. If it stays, its `Section gap` and the Journey `Section gap={26}` are outside the
    canvas's authority and should be left alone; if it goes, the Journey card becomes the last
    element at app `592 → 740` exactly as the frame shows.
