# Week Overview — Weeks VII–XII (pixel spec)

Source frames (read in full, line by line):

- Pretty: `/Users/admin/Documents/tideline/.uifinal/pretty/final/Email Login/<Slug>.html`
- Raw: `/Users/admin/Documents/tideline/.uifinal/final/Email Login/<Slug>.html`

**Reading the pretty files.** The pretty printer prefixes every text node with `· `.
That bullet is **not content** — verified against the raw file, where the same node reads
`<span style="font-size:17px; …">9:41</span>` with no bullet. Every quoted string below is
the raw file's text with HTML entities resolved.

**Entities in these twelve frames.** Only two appear:

| Entity | Real character | Codepoint | Where |
|---|---|---|---|
| `&middot;` | `·` | U+00B7 MIDDLE DOT | every subtitle, between the week numeral and the sentence |
| `&rsquo;` | `’` | U+2019 RIGHT SINGLE QUOTATION MARK | five lesson row labels (VII-1, VII-3, VII-P2-2, VII-P2-3) |

No `&mdash;`, no `&ndash;`, no `&nbsp;` occurs in any of the twelve.

**Coordinates.** Each frame is a `393 × 852` div. Its `top` values include a 54px status
bar the app never builds, so every offset is given as **canvas / (canvas − 54)**.

---

## a. Frame inventory

| # | Frame file | Page kind | Week | Rows | Lesson numbers | App component that should own it |
|---|---|---|---|---|---|---|
| 1 | `Week-VII-Relapse-and-Adversity.html` | Week Overview — page 1 (4 rows) | VII | 4 | 43–46 | new `src/app/week/[n].tsx`, page 1 |
| 2 | `Week-VII-Relapse-and-Adversity-P2.html` | Week Overview — page 2 (3 rows) | VII | 3 | 47–49 | same route, page 2 |
| 3 | `Week-VIII-Boredom-and-Meaning.html` | Week Overview — page 1 | VIII | 4 | 50–53 | same route |
| 4 | `Week-VIII-Boredom-and-Meaning-P2.html` | Week Overview — page 2 | VIII | 3 | 54–56 | same route |
| 5 | `Week-IX-Connection.html` | Week Overview — page 1 | IX | 4 | 57–60 | same route |
| 6 | `Week-IX-Connection-P2.html` | Week Overview — page 2 | IX | 3 | 61–63 | same route |
| 7 | `Week-X-Yourself.html` | Week Overview — page 1 | X | 4 | 64–67 | same route |
| 8 | `Week-X-Yourself-P2.html` | Week Overview — page 2 | X | 3 | 68–70 | same route |
| 9 | `Week-XI-Build-a-Life-You-Want.html` | Week Overview — page 1 | XI | 4 | 71–74 | same route |
| 10 | `Week-XI-Build-a-Life-You-Want-P2.html` | Week Overview — page 2 | XI | 3 | 75–77 | same route |
| 11 | `Week-XII-Leave-It-Behind.html` | Week Overview — page 1 | XII | 4 | 78–81 | same route |
| 12 | `Week-XII-Leave-It-Behind-P2.html` | Week Overview — page 2 | XII | 3 | 79→84 (78–81 / 82–84) | same route |

There is **exactly one page kind** across all twelve frames. The only structural variable is
the row count (4 or 3); everything else is data.

Verification performed:

- Lines 1–110 (frame shell → subtitle) are byte-identical across all twelve except
  `data-screen-label`, the title text, and the subtitle text.
- The last 32 lines (foot band) hash identically across all twelve (`43ff006e…`).
- The hero band is **byte-identical between a week's P1 and its P2** (md5 per week:
  VII `d8b5dad0fc`, VIII `3ef1e283fb`, IX `57d7815e70`, X `fd13aa56f4`,
  XI `892a05e4bc`, XII `b80309bd0a`).

Weeks VII–XII carry **7 lessons each** (4 + 3), numbered consecutively 43 → 84. Extrapolating
backwards, weeks I–VI carry 1 → 42: a **12 × 7 = 84-lesson curriculum**.

---

## b. Page grammar — the one kind: **Week Overview**

Twelve values drive a week; nothing else varies. Every number below is verbatim from the
canvas — none rounded, none substituted for a token.

### b.0 Frame shell

| Property | Value |
|---|---|
| width / height | `393px` / `852px` |
| position | `relative` |
| overflow | `hidden` |
| background | `#F4F3F0` |
| font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` |
| font smoothing | `-webkit-font-smoothing:antialiased` |
| flex-shrink | `0` |
| box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` (canvas card chrome; not built in-app) |

### b.1 Grain overlay

| Property | Value |
|---|---|
| position | `absolute`, `inset:0` |
| background-image | `url('noise-dark.png')` |
| opacity | `0.07` |
| pointer-events | `none` |

Ships as `assets/images/noise-dark.png`, `contentFit="cover"`, `opacity: 0.07`, `pointerEvents="none"`.

### b.2 Status bar (never built — the app's safe-area inset replaces it)

Box: `position:absolute; top:0; left:0; right:0; height:54px; display:flex;
align-items:center; justify-content:space-between; padding:6px 32px 0 46px;
box-sizing:border-box; z-index:20`.

Clock span: `font-size:17px; font-weight:600; color:#1D1C1A; letter-spacing:-0.2px`, text `9:41`.

Right cluster: `display:flex; align-items:center; gap:7px` holding three SVGs —
signal `19×12 viewBox 0 0 19 12`, wifi `17×12 viewBox 0 0 17 12`, battery `27×13 viewBox 0 0 27 13`,
all inked `#1D1C1A`.

### b.3 Back affordance

| Property | Value |
|---|---|
| container | `position:absolute; left:16px; top:64px / 10px; display:flex; align-items:center; gap:9px` |
| children | **one** SVG. The `gap:9px` has nothing to sit beside it — there is **no text label** |
| svg | `width="11" height="19" viewBox="0 0 11 19"` |
| path `d` | `M9.5 1.5L2 9.5l7.5 8` |
| stroke / width / caps | `#55534E` / `2.4` / `round`, `round`; `fill:none` |

```
M9.5 1.5L2 9.5l7.5 8
```

### b.4 Title

| Property | Value |
|---|---|
| position | `absolute; left:24px; top:114px / 60px` |
| font-size | `27px` |
| font-weight | `600` |
| letter-spacing | `-0.2px` |
| color | `#1D1C1A` |
| line-height | not set (browser default ≈ `1.2` × 27 ≈ 32.4) |
| right bound | none — a single unwrapped line |

### b.5 Subtitle

| Property | Value |
|---|---|
| position | `absolute; left:24px; right:60px; top:158px / 104px` |
| width | `393 − 24 − 60 = 309px` |
| font-size | `14.5px` |
| font-weight | `400` |
| line-height | `21px` |
| color | `#55534E` |
| text-wrap | `pretty` |
| copy shape | `Week <ROMAN> · <sentence.>` |

Title top → subtitle top = **44**. Subtitle top → hero top = **56**.

### b.6 Hero band (the per-week scene)

| Property | Value |
|---|---|
| position | `absolute; left:0; right:0; top:214px / 160px` |
| height | `258px` (ends canvas `472` / app `418`) |
| overflow | `hidden` — every scene element overhangs and is clipped |
| background | `linear-gradient(180deg, #F4F3F0 0%, #F3EEE1 58%, #F4F3F0 100%)` |

Every hero closes with the same bottom fade, as its **last** child:

| Property | Value |
|---|---|
| position | `absolute; left:0; right:0; bottom:0` |
| height | `44px` |
| background | `linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)` |

Per-week scene contents are in the **Visualization** section below.

### b.7 Lesson row card

Identical in all 42 instances across the twelve frames.

| Property | Value |
|---|---|
| position | `absolute; left:24px; right:24px` |
| width (derived) | `393 − 48 = 345px` |
| height | `56px` |
| border-radius | `14px` (all four corners) |
| background | `#FFFFFF` |
| box-shadow | `0 0 0 1px rgba(0,0,0,0.06)` (a ring, not a drop shadow — pass verbatim) |
| display / align | `flex` / `align-items:center` |
| gap | `13px` |
| padding | `0 16px` (top 0, right 16, bottom 0, left 16) |
| box-sizing | `border-box` |
| border-width | none (`0`) — the hairline is the ring shadow |

Row tops: **486 / 432**, **566 / 512**, **646 / 592**, **726 / 672** (page 1 only).
Pitch **80** = 56 card + **24** gap. Hero bottom (472) → row 1 top (486) = **14**.
Row 4 bottom (782) → foot band top (798) = **16**.
On a 3-row page, row 3 bottom (702) → foot band top (798) = **96** of bare paper.

#### b.7.1 Row lock disc

| Property | Value |
|---|---|
| width / height | `30px` / `30px` |
| border-radius | `50%` |
| background | `rgba(19,19,19,0.05)` |
| box-shadow | `inset 0 0 0 1.5px rgba(0,0,0,0.08)` |
| display / align / justify | `flex` / `center` / `center` |
| flex-shrink | `0` |

#### b.7.2 Row lock glyph

| Property | Value |
|---|---|
| svg | `width="12" height="13" viewBox="0 0 16 17"` |
| body | `<rect x="3" y="7.5" width="10" height="7.5" rx="2" fill="#A5A29B"/>` |
| shackle | `<path d="M5.2 7.5 V5.6 a2.8 2.8 0 0 1 5.6 0 V7.5" stroke="#A5A29B" stroke-width="1.8" fill="none"/>` |

```
M5.2 7.5 V5.6 a2.8 2.8 0 0 1 5.6 0 V7.5
```

Every one of the 42 rows is drawn in this single **locked** state. There is no unlocked,
in-progress, done, or pressed row anywhere in these twelve frames.

#### b.7.3 Row label

| Property | Value |
|---|---|
| element | `<span>` |
| flex | `1` |
| font-size | `15.5px` |
| font-weight | `500` |
| color | `#8B8882` |
| line-height / letter-spacing / transform | not set |
| wrapping | unbounded (`flex:1` under `padding:0 16px`, `gap:13px`); no `numberOfLines` equivalent set |

#### b.7.4 Row number

| Property | Value |
|---|---|
| element | `<span>` |
| font-size | `12.5px` |
| font-weight | `500` |
| color | `#B0AEA8` |
| content | the absolute lesson index across the 84-lesson curriculum, digits only |

### b.8 Row connector dots

Two dots between consecutive cards, drawn as separate absolute divs (not a container).

| Property | Value |
|---|---|
| position | `absolute; left:52px` |
| width / height | `3.5px` / `3.5px` |
| border-radius | `50%` |
| background | `rgba(40,38,32,0.2)` |

| After row | Dot A top | Dot B top | App (−54) |
|---|---|---|---|
| 1 | `547` | `555` | `493` / `501` |
| 2 | `627` | `635` | `573` / `581` |
| 3 | `707` | `715` | `653` / `661` |

Geometry: a card ends at 542; dot A begins 5 later, dot B 8 after dot A, and dot B ends at
558.5, leaving **7.5** to the next card at 566. The pair is **not** centred in the 24 gap —
it sits 3 high. `left:52` puts the dots on the centre of the 30-wide lock disc
(24 gutter + 16 padding + 15 half-disc = 55; the canvas uses 52, i.e. **3 left of the disc
centre**, so a rebuild must use 52 literally and not centre on the disc).

3-row pages carry only the first two pairs (547/555 and 627/635).

### b.9 Foot band

| Property | Value |
|---|---|
| position | `absolute; left:0; right:0; top:798px / 744px; bottom:0` |
| height (derived) | `54px` |
| overflow | `hidden` |
| background | `linear-gradient(180deg, #ECEBE6, #E7E6E0)` — no angle-explicit stop positions; two-stop 0%/100% |

Two clipped domes inside it:

| # | left | right | top | height | border-radius | background | derived width |
|---|---|---|---|---|---|---|---|
| 1 | `-30px` | `40%` | `30px` | `80px` | `50% 50% 0 0 / 44px 44px 0 0` | `#CFD9E2` | `393 + 30 − 157.2 = 265.8px` |
| 2 | `35%` | `-40px` | `38px` | `80px` | `50% 50% 0 0 / 40px 40px 0 0` | `#C4D2DE` | `433 − 137.55 = 295.45px` |

Both are 80 tall in a 54-tall band starting 30/38 down, so only their top 24 and 16 rows of
pixels are visible; the rest is clipped. There is **no tab bar** on these frames.

### b.10 Z-order

Painted document order, no explicit `z-index` anywhere except the status bar (`z-index:20`):
grain → status bar → back chevron → title → subtitle → hero band → rows and dots interleaved
(row 1, dots, row 2, dots, row 3, dots, row 4) → foot band.

---

## c. Per-frame copy (verbatim, entities resolved)

### Week VII — `Week-VII-Relapse-and-Adversity`

Kind: Week Overview page 1. Title: `Relapse and Adversity`.
Subtitle: `Week VII · Falling without unraveling.`

| Row | Label (verbatim) | Number |
|---|---|---|
| 1 | `Relapse Isn’t the End` | `43` |
| 2 | `Learn From the Relapse` | `44` |
| 3 | `Don’t Punish Yourself` | `45` |
| 4 | `Rough Days` | `46` |

### Week VII — `Week-VII-Relapse-and-Adversity-P2`

Kind: Week Overview page 2. Title and subtitle identical to page 1.

| Row | Label | Number |
|---|---|---|
| 1 | `When Life Gets Hard` | `47` |
| 2 | `Face What You’re Avoiding` | `48` |
| 3 | `Don’t Wait for Tomorrow` | `49` |

### Week VIII — `Week-VIII-Boredom-and-Meaning`

Title: `Boredom and Meaning`. Subtitle: `Week VIII · Empty hours, and what fills them well.`

| Row | Label | Number |
|---|---|---|
| 1 | `Boredom` | `50` |
| 2 | `Escaping Boredom` | `51` |
| 3 | `Learn to Be Bored` | `52` |
| 4 | `Screen Boundaries` | `53` |

### Week VIII — `Week-VIII-Boredom-and-Meaning-P2`

| Row | Label | Number |
|---|---|---|
| 1 | `Dopamine Detox` | `54` |
| 2 | `Wake Up With Purpose` | `55` |
| 3 | `Meaning` | `56` |

### Week IX — `Week-IX-Connection`

Title: `Connection`. Subtitle: `Week IX · The people side of recovery.`

| Row | Label | Number |
|---|---|---|
| 1 | `Why Relationships Matter` | `57` |
| 2 | `Loneliness` | `58` |
| 3 | `Solitude` | `59` |
| 4 | `What Porn Replaces` | `60` |

### Week IX — `Week-IX-Connection-P2`

| Row | Label | Number |
|---|---|---|
| 1 | `Friendship` | `61` |
| 2 | `Unhealthy Relationships` | `62` |
| 3 | `Healthy Relationships` | `63` |

### Week X — `Week-X-Yourself`

Title: `Yourself`. Subtitle: `Week X · Repairing how you see and treat yourself.`

| Row | Label | Number |
|---|---|---|
| 1 | `Trauma` | `64` |
| 2 | `Your Environment` | `65` |
| 3 | `Self-Criticism` | `66` |
| 4 | `Self-Loathing` | `67` |

### Week X — `Week-X-Yourself-P2`

| Row | Label | Number |
|---|---|---|
| 1 | `Self-Compassion` | `68` |
| 2 | `Self-Trust` | `69` |
| 3 | `Self-Improvement` | `70` |

### Week XI — `Week-XI-Build-a-Life-You-Want`

Title: `Build a Life You Want`. Subtitle: `Week XI · Point the freed-up energy at something.`

| Row | Label | Number |
|---|---|---|
| 1 | `Know Yourself` | `71` |
| 2 | `Amor Fati` | `72` |
| 3 | `Memento Mori` | `73` |
| 4 | `Carpe Diem` | `74` |

### Week XI — `Week-XI-Build-a-Life-You-Want-P2`

| Row | Label | Number |
|---|---|---|
| 1 | `The Next 90 Days` | `75` |
| 2 | `Peace of Mind` | `76` |
| 3 | `This Time Next Year` | `77` |

### Week XII — `Week-XII-Leave-It-Behind`

Title: `Leave It Behind`. Subtitle: `Week XII · Make it permanent, then let it go.`

| Row | Label | Number |
|---|---|---|
| 1 | `What Forever Means` | `78` |
| 2 | `Twelve Weeks Ago` | `79` |
| 3 | `What Changed in Your Brain` | `80` |
| 4 | `Winning the Battle` | `81` |

### Week XII — `Week-XII-Leave-It-Behind-P2`

| Row | Label | Number |
|---|---|---|
| 1 | `Lessons From Addiction Recovery` | `82` |
| 2 | `Saying Goodbye` | `83` |
| 3 | `The Future` | `84` |

---

## c.1 The one data file that drives all twelve weeks

Everything above reduces to this shape. Weeks I–VI follow the same template (lesson numbers
1–42); their titles/subtitles/scenes come from the sibling spec for frames 1–6.

```ts
export interface WeekOverview {
  n: number;                 // 7…12
  numeral: string;           // 'VII' … 'XII'
  title: string;             // frame title, e.g. 'Relapse and Adversity'
  blurb: string;             // the sentence after the '·', e.g. 'Falling without unraveling.'
  scene: SceneKey;           // 'signpost-sea' | 'meadow' | 'two-flags' | 'lake' | 'summit-path'
  lessons: string[];         // exactly 7, in order; page 1 = [0..3], page 2 = [4..6]
  firstNumber: number;       // 43, 50, 57, 64, 71, 78 — the row number of lessons[0]
}
```

| n | numeral | title | blurb | firstNumber | scene |
|---|---|---|---|---|---|
| 7 | `VII` | `Relapse and Adversity` | `Falling without unraveling.` | 43 | `signpost-sea` (small) |
| 8 | `VIII` | `Boredom and Meaning` | `Empty hours, and what fills them well.` | 50 | `meadow` |
| 9 | `IX` | `Connection` | `The people side of recovery.` | 57 | `two-flags` |
| 10 | `X` | `Yourself` | `Repairing how you see and treat yourself.` | 64 | `lake` |
| 11 | `XI` | `Build a Life You Want` | `Point the freed-up energy at something.` | 71 | `summit-path` |
| 12 | `XII` | `Leave It Behind` | `Make it permanent, then let it go.` | 78 | `signpost-sea` (large) |

Subtitle is composed: `` `Week ${numeral} · ${blurb}` ``. Row number is `firstNumber + i`.
`firstNumber` is redundant with `7 * (n − 1) + 1` for every week here (43 = 7·6+1, 50 = 7·7+1, …),
so it can be derived rather than stored — but the canvas states it explicitly, so store it if
any week is ever allowed to differ in length.

---

## d. Chrome shared by every frame

| Element | Present? | Detail |
|---|---|---|
| Close affordance | **Back chevron only** | `left:16`, `top:64 / 10`, 11×19 SVG, `#55534E`, stroke 2.4. **No text label** — the container declares `gap:9px` and holds a single child, so the gap is inert. No "Cancel", no "×". |
| **Progress bar** | **None.** | There is no progress bar, no step dots, no percentage indicator on any of the twelve frames. Nothing to give a fill percentage for. The only progress-like signal is the absolute lesson number in each row (43…84) and the implicit P1/P2 pagination. Do **not** invent a bar. |
| Status bar | Yes, identical | `9:41` + signal/wifi/battery; app replaces it with the safe-area inset. |
| Grain | Yes, identical | `noise-dark.png` at `opacity:0.07`, full-bleed, non-interactive. |
| Title / subtitle | Yes, identical geometry | see b.4 / b.5 |
| Hero band | Yes, identical geometry | 258 tall at 214 / 160; art varies per week, not per page. |
| Row list | Yes, identical geometry | 4 rows on P1, 3 on P2; same card in all 42 instances. |
| Foot band | Yes, byte-identical | see b.9; no tab bar. |

---

## e. Visualization — the hero scenes

All six scenes share one coordinate system: the hero band's own box, `393 × 258`,
origin at its top-left, which is canvas `(0, 214)` / app `(0, 160)`. All offsets below are
**band-relative**. `overflow:hidden` clips everything that leaves the box, and every scene's
last child is the b.6 bottom fade.

Nothing is drawn with `<path>` except the birds. Everything else is positioned `<div>`s with
`border-radius`, `clip-path`, `filter:blur`, or a `radial-gradient` background.

### e.0 Two parameterised primitives shared by the scenes

**The sun.** A blurred radial glow with a hard disc centred inside it.

```
glow:  width = height = D + 60;  left = discLeft − 30;  top = discTop − 30
       border-radius: 50%
       background: radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)
       filter: blur(4px)
disc:  width = height = D;  border-radius: 50%;  background: #E9D2A4
```

Holds exactly for weeks VII (D=32), VIII (34), IX (32), X (42), XII (36).
**Week XI breaks it deliberately** — glow `180×180` at `(96,44)`, disc `52×52` at `(154,116)`:
the glow is neither `D+60` nor concentric (glow centre `186,134`; disc centre `180,142`), and
its inner stop is **`rgba(226,186,120,0.6)`**, the only alpha in the set that is not `0.42`.
Transcribe Week XI literally; do not normalise it to the rule.

**The cloud.** Two rounded pills, the upper one offset up-right. Given a scale `s`:

```
base:  width = 44 × s;  height = 11 × s;  border-radius: 8px   (unscaled)
       background: rgba(255,255,255,0.85)
top:   width = 26 × s;  height = 10 × s;  border-radius: 7px   (unscaled)
       left = baseLeft + 14 × s;  top = baseTop − 7 × s
       background: rgba(255,255,255,0.75)
```

Confirmed for every cloud in the set. The canvas emits the float artefacts of that
multiplication verbatim (`30.799999999999997`, `22.099999999999998`, `23.400000000000002`);
they are `0.7 × 44`, `0.85 × 26`, `0.9 × 26` in IEEE-754 and must be copied as written rather
than rounded, since a rebuild computing `44 * 0.7` reproduces them exactly.

**The bird.** One `<svg>`, one path, no fill.

```
M1 6 Q4.5 1.5 8 5 Q11.5 1.5 15 6
```

`fill="none" stroke="#8A857C" stroke-width="1.6" stroke-linecap="round"`,
`viewBox="0 0 16 8"`, positioned absolutely by `left`/`top` on the `<svg>` itself.

**The signpost/milestone** (weeks VII and XII). One object at two scales `s`; the pole width
is the only dimension **not** scaled.

```
shadow: left = X + 6s,  top = Y + 42s,  w = 64s, h = 10s,   border-radius: 50%
        background: rgba(0,0,0,0.06);  filter: blur(3px)
pole:   left = X + 30s, top = Y,        w = 3 (fixed), h = 44s
        background: #C6C5C0
left:   left = X + 8s,  top = Y + 6s,   w = 22s, h = 36s
        background: #F7F6F2
        clip-path: polygon(100% 0, 100% 100%, 0 100%)
        box-shadow: 0 1px 2px rgba(0,0,0,0.06)
right:  left = X + 36s, top = Y + 14s,  w = 16s, h = 28s
        background: #EDECE7
        clip-path: polygon(0 0, 100% 100%, 0 100%)
base:   left = X,       top = Y + 42s,  w = 64s, h = 15s
        border-radius: 5px 5px 16px 16px   (unscaled)
        background: #E4E3DE;  box-shadow: 0 0 0 1px rgba(0,0,0,0.05)
```

Week VII: `X = 212, Y = 118, s = 0.62`. Week XII: `X = 148, Y = 96, s = 0.95`.

---

### e.1 Week VII — `signpost-sea`, small

In document order:

| # | Element | left | top | w | h | radius | fill / effect |
|---|---|---|---|---|---|---|---|
| 1 | rock | `38` | `36` | `46` | `46` | `50%` | `#C6C3BB` |
| 2 | rock | `70` | `24` | `58` | `58` | `50%` | `#D0CEC7` |
| 3 | rock | `108` | `40` | `42` | `42` | `50%` | `#C6C3BB` |
| 4 | ledge | `34` | `52` | `118` | `26` | `15px` | `#D0CEC7` |
| 5 | rain | `50` | `88` | `3` | `4` | `2px` | `#9FB4C4`, `transform:rotate(16deg)` |
| 6 | rain | `72` | `97` | `3` | `4` | `2px` | `#9FB4C4`, `rotate(16deg)` |
| 7 | rain | `94` | `88` | `3` | `4` | `2px` | `#9FB4C4`, `rotate(16deg)` |
| 8 | rain | `116` | `97` | `3` | `4` | `2px` | `#9FB4C4`, `rotate(16deg)` |
| 9 | sun glow | `266` | `28` | `92` | `92` | `50%` | `radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)`, `blur(4px)` |
| 10 | sun disc | `296` | `58` | `32` | `32` | `50%` | `#E9D2A4` |
| 11 | sea back | `-40` | `152` | `473` | `90` | `50% 50% 0 0 / 26px 26px 0 0` | `#C8D7E5` |
| 12 | sea front | `-60` | `172` | `473` | `84` | `50% 50% 0 0 / 22px 22px 0 0` | `#D5E1EA` |
| 13 | post shadow | `215.72` | `144.04` | `39.68` | `6.2` | `50%` | `rgba(0,0,0,0.06)`, `blur(3px)` |
| 14 | post pole | `230.6` | `118` | `3` | `27.28` | — | `#C6C5C0` |
| 15 | post left arm | `216.96` | `121.72` | `13.64` | `22.32` | — | `#F7F6F2`, `clip-path:polygon(100% 0, 100% 100%, 0 100%)`, `box-shadow:0 1px 2px rgba(0,0,0,0.06)` |
| 16 | post right arm | `234.32` | `126.68` | `9.92` | `17.36` | — | `#EDECE7`, `clip-path:polygon(0 0, 100% 100%, 0 100%)` |
| 17 | post base | `212` | `144.04` | `39.68` | `9.3` | `5px 5px 16px 16px` | `#E4E3DE`, `box-shadow:0 0 0 1px rgba(0,0,0,0.05)` |
| 18 | foam | `66` | `214` | `22` | `4` | `2px` | `rgba(255,255,255,0.5)` |
| 19 | fade | `0` | — | full | `44` | — | b.6 fade |

Rain drops are 3×4 rounded rects, not lines — at `rotate(16deg)` they read as slanted drops.

### e.2 Week VIII — `meadow`

| # | Element | left | top | w | h | radius | fill / effect |
|---|---|---|---|---|---|---|---|
| 1 | sun glow | `60` | `10` | `94` | `94` | `50%` | `radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)`, `blur(4px)` |
| 2 | sun disc | `90` | `40` | `34` | `34` | `50%` | `#E9D2A4` |
| 3 | cloud A base | `198` | `38` | `41.8` | `10.45` | `8px` | `rgba(255,255,255,0.85)` |
| 4 | cloud A top | `211.3` | `31.35` | `24.7` | `9.5` | `7px` | `rgba(255,255,255,0.75)` |
| 5 | cloud B base | `288` | `58` | `30.799999999999997` | `7.699999999999999` | `8px` | `rgba(255,255,255,0.85)` |
| 6 | cloud B top | `297.8` | `53.1` | `18.2` | `7` | `7px` | `rgba(255,255,255,0.75)` |
| 7 | bird | `258` | `92` | svg `16` | svg `8` | — | see e.0 |
| 8 | far hill | `-40` | `168` | `473` | `56` | `50% 50% 0 0 / 12px 12px 0 0` | `#E8E4D6` |
| 9 | field | `-40` | `198` | `473` | `80` | **none** (square) | `#F0EBDD` |
| 10 | path light | `96` | `176` | `58` | `4` | `2px` | `rgba(255,255,255,0.6)` |
| 11 | path light | `250` | `188` | `40` | `4` | `2px` | `rgba(255,255,255,0.45)` |
| 12 | grass | `76` | `214` | `3` | `4` | `2px` | `#C9CEC0`, `rotate(-14deg)` |
| 13 | grass | `84` | `212` | `3` | `4` | `2px` | `#C9CEC0`, `rotate(10deg)` |
| 14 | grass | `210` | `224` | `3` | `4` | `2px` | `#C9CEC0`, `rotate(-12deg)` |
| 15 | grass | `310` | `210` | `3` | `4` | `2px` | `#C9CEC0`, `rotate(12deg)` |
| 16 | ground shadow | `140` | `226` | `90` | `14` | `50%` | `rgba(0,0,0,0.04)`, `blur(5px)` |
| 17 | fade | — | — | full | `44` | — | b.6 fade |

Cloud A is `s = 0.95`, cloud B is `s = 0.7`. Element 9 is the only ground plate in the set
with no `border-radius` at all.

### e.3 Week IX — `two-flags`

| # | Element | left | top | w | h | radius | fill / effect |
|---|---|---|---|---|---|---|---|
| 1 | sun glow | `26` | `8` | `92` | `92` | `50%` | `radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)`, `blur(4px)` |
| 2 | sun disc | `56` | `38` | `32` | `32` | `50%` | `#E9D2A4` |
| 3 | cloud base | `262` | `40` | `37.4` | `9.35` | `8px` | `rgba(255,255,255,0.85)` |
| 4 | cloud top | `273.9` | `34.05` | `22.099999999999998` | `8.5` | `7px` | `rgba(255,255,255,0.75)` |
| 5 | bird | `154` | `58` | svg `16` | svg `8` | — | `viewBox="0 0 16 8"` |
| 6 | bird | `174` | `50` | svg `13.6` | svg `6.8` | — | `viewBox="0 0 16 8"` — a uniform `0.85` scale |
| 7 | hill left | `-70` | `148` | `270` | `140` | `50% 50% 0 0 / 92px 92px 0 0` | `#DEDDD6` |
| 8 | hill right | `186` | `140` | `290` | `150` | `50% 50% 0 0 / 98px 98px 0 0` | `#D8D7D0` |
| 9 | shadow left | `62` | `148` | `56` | `10` | `50%` | `rgba(0,0,0,0.08)`, `blur(4px)` |
| 10 | pole left | `82` | `112` | `4` | `38` | `2px` | `#B4B1AB` |
| 11 | flag left | `86` | `112` | `22` | `14` | `1px` | `#E9D2A4` |
| 12 | shadow right | `280` | `140` | `56` | `10` | `50%` | `rgba(0,0,0,0.08)`, `blur(4px)` |
| 13 | pole right | `300` | `102` | `4` | `40` | `2px` | `#B4B1AB` |
| 14 | flag right | `304` | `102` | `22` | `14` | `1px` | `#E9D2A4` |
| 15 | near ridge | `-40` | `224` | `473` | `60` | `50% 50% 0 0 / 22px 22px 0 0` | `#CFCEC7` |
| 16 | fade | — | — | full | `44` | — | b.6 fade |

Cloud is `s = 0.85`. The two hills are the only scene elements narrower than the frame; both
overhang one edge and are clipped. The flags read as two people on two hills — the week's
subject drawn literally.

### e.4 Week X — `lake`

| # | Element | left | top | w | h | radius | fill / effect |
|---|---|---|---|---|---|---|---|
| 1 | sun glow | `118` | `24` | `102` | `102` | `50%` | `radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)`, `blur(4px)` |
| 2 | sun disc | `148` | `54` | `42` | `42` | `50%` | `#E9D2A4` |
| 3 | cloud base | `50` | `48` | `39.6` | `9.9` | `8px` | `rgba(255,255,255,0.85)` |
| 4 | cloud top | `62.6` | `41.7` | `23.400000000000002` | `9` | `7px` | `rgba(255,255,255,0.75)` |
| 5 | far ridge | `-40` | `150` | `473` | `70` | `50% 50% 0 0 / 30px 30px 0 0` | `#DEDDD6` |
| 6 | **water** | `-40` | `182` | `473` | `90` | **`24px`** (all four corners) | `#D5E1EA` |
| 7 | sun reflection | `154` | `190` | `30` | `44` | `50%` | `rgba(233,210,164,0.5)`, `blur(6px)` |
| 8 | ripple | `120` | `200` | `44` | `4` | `2px` | `rgba(255,255,255,0.6)` |
| 9 | ripple | `230` | `214` | `32` | `4` | `2px` | `rgba(255,255,255,0.5)` |
| 10 | reed | `296` | `196` | `3` | `4` | `2px` | `#B8BFAE`, `rotate(-60deg)` |
| 11 | reed | `304` | `192` | `3` | `4` | `2px` | `#B8BFAE`, `rotate(-70deg)` |
| 12 | reed | `312` | `198` | `3` | `4` | `2px` | `#C9CEC0`, `rotate(-55deg)` |
| 13 | fade | — | — | full | `44` | — | b.6 fade |

Element 6 is the only ground/water plate in the whole set drawn as a uniform `24px` rounded
rect instead of a `50% 50% 0 0 / …` dome. Its left and right rounded corners sit at x `−40`
and `433`, off-frame, so only the bottom rounding is ever visible — but a rebuild must still
set all four corners to 24, because the bottom corners *are* on-screen at band y `272`,
which is 14 below the 258-tall band and therefore clipped too. Net visible effect: a flat
band. Transcribe `24px` regardless.

Cloud is `s = 0.9`.

### e.5 Week XI — `summit-path`

| # | Element | left | top | w | h | radius | fill / effect |
|---|---|---|---|---|---|---|---|
| 1 | sun glow | `96` | `44` | `180` | `180` | `50%` | `radial-gradient(closest-side, rgba(226,186,120,0.6), rgba(226,186,120,0) 74%)`, `blur(4px)` |
| 2 | sun disc | `154` | `116` | `52` | `52` | `50%` | `#E9D2A4` |
| 3 | cloud A base | `60` | `50` | `44` | `11` | `8px` | `rgba(255,255,255,0.85)` |
| 4 | cloud A top | `74` | `43` | `26` | `10` | `7px` | `rgba(255,255,255,0.75)` |
| 5 | cloud B base | `280` | `38` | `37.4` | `9.35` | `8px` | `rgba(255,255,255,0.85)` |
| 6 | cloud B top | `291.9` | `32.05` | `22.099999999999998` | `8.5` | `7px` | `rgba(255,255,255,0.75)` |
| 7 | far ridge | `-40` | `150` | `473` | `110` | `50% 50% 0 0 / 40px 40px 0 0` | `#EAE6D9` |
| 8 | near ridge | `-70` | `178` | `483` | `100` | `50% 50% 0 0 / 34px 34px 0 0` | `#F0EBDD` |
| 9 | path dash | `186` | `236` | `18` | `4` | `2px` | `rgba(255,255,255,0.8)` |
| 10 | path dash | `180` | `216` | `15` | `4` | `2px` | `rgba(255,255,255,0.75)` |
| 11 | path dash | `176` | `198` | `12` | `4` | `2px` | `rgba(255,255,255,0.7)` |
| 12 | path dash | `173` | `184` | `9` | `4` | `2px` | `rgba(255,255,255,0.65)` |
| 13 | fade | — | — | full | `44` | — | b.6 fade |

The four dashes shrink (18 → 15 → 12 → 9), drift left (186 → 180 → 176 → 173) and fade
(0.8 → 0.75 → 0.7 → 0.65) as they climb toward the sun — a receding path. Their vertical
gaps are **not** even: 236 → 216 (20), 216 → 198 (18), 198 → 184 (14). Cloud A is `s = 1`,
cloud B is `s = 0.85`. Element 8 is the widest thing in any scene at `483`.

### e.6 Week XII — `signpost-sea`, large

| # | Element | left | top | w | h | radius | fill / effect |
|---|---|---|---|---|---|---|---|
| 1 | sun glow | `48` | `66` | `96` | `96` | `50%` | `radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)`, `blur(4px)` |
| 2 | sun disc | `78` | `96` | `36` | `36` | `50%` | `#E9D2A4` |
| 3 | cloud base | `220` | `42` | `39.6` | `9.9` | `8px` | `rgba(255,255,255,0.85)` |
| 4 | cloud top | `232.6` | `35.7` | `23.400000000000002` | `9` | `7px` | `rgba(255,255,255,0.75)` |
| 5 | bird | `132` | `60` | svg `16` | svg `8` | — | `viewBox="0 0 16 8"` |
| 6 | bird | `160` | `48` | svg `13` | svg `7` | — | `viewBox="0 0 16 8"` — see note |
| 7 | sea back | `-40` | `148` | `473` | `90` | `50% 50% 0 0 / 26px 26px 0 0` | `#C8D7E5` |
| 8 | sea front | `-60` | `168` | `473` | `84` | `50% 50% 0 0 / 22px 22px 0 0` | `#D5E1EA` |
| 9 | post shadow | `153.7` | `135.9` | `60.8` | `9.5` | `50%` | `rgba(0,0,0,0.06)`, `blur(3px)` |
| 10 | post pole | `176.5` | `96` | `3` | `41.8` | — | `#C6C5C0` |
| 11 | post left arm | `155.6` | `101.7` | `20.9` | `34.199999999999996` | — | `#F7F6F2`, `clip-path:polygon(100% 0, 100% 100%, 0 100%)`, `box-shadow:0 1px 2px rgba(0,0,0,0.06)` |
| 12 | post right arm | `182.2` | `109.3` | `15.2` | `26.599999999999998` | — | `#EDECE7`, `clip-path:polygon(0 0, 100% 100%, 0 100%)` |
| 13 | post base | `148` | `135.9` | `60.8` | `14.25` | `5px 5px 16px 16px` | `#E4E3DE`, `box-shadow:0 0 0 1px rgba(0,0,0,0.05)` |
| 14 | foam | `120` | `212` | `26` | `4` | `2px` | `rgba(255,255,255,0.6)` |
| 15 | foam | `96` | `224` | `20` | `4` | `2px` | `rgba(255,255,255,0.45)` |
| 16 | fade | — | — | full | `44` | — | b.6 fade |

**Canvas inconsistency.** Bird 6 is `width="13" height="7"` on a `viewBox="0 0 16 8"` —
a **non-uniform** scale of `0.8125 × 0.875`. Every other scaled bird in the set is uniform
(Week IX's second bird is exactly `0.85 × 16` and `0.85 × 8`). The evidence supports treating
Week XII's as a hand-typed literal rather than a computed scale: build it as `13 × 7` with
`viewBox="0 0 16 8"`, i.e. `preserveAspectRatio` left at its default `xMidYMid meet`, which in
practice renders the path at scale `0.8125` letterboxed inside 7 rows. Do not "fix" it to
`13 × 6.5`.

Week XII is Week VII's scene at `0.95` instead of `0.62`, with the sun moved from the right
to the left, the seas raised 4px, the rain and rocks removed, and two foam marks added — the
same place, later and calmer.

### e.7 Edge cases the scenes must survive

| Case | Required behaviour |
|---|---|
| Narrower device (e.g. 375) | The band is `left:0; right:0`, so it stretches. Scene children are pinned to the **left** edge with fixed pixel `left` values, so a 375-wide device pushes the right-anchored objects (Week VII's sun at 296, Week VIII's cloud B at 288, Week X's reeds at 312, Week IX's right flag at 304) off-screen by 18. Either scale the whole scene by `width / 393` or accept the clip; the canvas gives no fluid rule. |
| Wider device | Same, with paper on the right. The full-bleed plates are 473–483 wide precisely so they still overhang a wider frame. |
| 3-row page | Rows 1–3 and the first two dot pairs only. The foot band does **not** move up — 96 of bare paper opens between row 3 and the band. |
| Long row label | The canvas never wraps one: `flex:1` with no bound and no `numberOfLines`. `Lessons From Addiction Recovery` is the longest at 31 characters and still fits on one 15.5/500 line inside 345 − 32 − 30 − 13 − (number width) ≈ 240. Clamp to 1 line in the rebuild. |
| RTL | Not drawn. |

---

## f. Comparison against the current app

Middle column read from `src/app/(app)/lifemap.tsx`, `src/lib/curriculum.ts`,
`src/lib/worlds.ts`, plus the files that actually render week/lesson lists today:
`src/app/lessons-browser.tsx`, `src/app/lesson-overview/[slug].tsx`, `src/app/(app)/locked.tsx`,
`src/app/(app)/library.tsx`, `src/lib/lessonArt.ts`, `src/content/interactiveLessons.ts`,
`src/lib/theme.ts`.

### f.1 Structure and data

| Property | Design | Current app | Verdict |
|---|---|---|---|
| A screen that shows one week's lessons | Yes — 12 weeks × 2 pages | **None.** `src/app/(app)/lifemap.tsx` is a Life Map *values editor* (why-statement, one-year answer, value chips) — nothing to do with these frames. The nearest analogues are `/lessons-browser` (all weeks as horizontal tile shelves) and `/lesson-overview/[slug]` (one lesson) | **MISMATCH** |
| Route | one per week | no `week/[n]` route exists (`src/app/` has `journey/[chapter].tsx`, `lesson/[slug].tsx`, `lesson-overview/[slug].tsx`) | **MISMATCH** |
| Week count | **12** | **10** — `INTERACTIVE_WEEKS.length === 10`; `WORLDS.length === 10`. Weeks XI and XII do not exist | **MISMATCH** |
| Lessons per week | **7**, uniform | 7, 23, 20, 9, 6, 17, 10, 5, 9, 4 | **MISMATCH** |
| Total lessons | **84** | **110** (`interactiveLessons.ts` header: "10 parts · 110 lessons") | **MISMATCH** |
| Row number shown | absolute index 43…84 | `InteractiveLesson.number` runs 83…110 for weeks 7–10 | **MISMATCH** |
| Week VII title | `Relapse and Adversity` | `WORLDS[6].name` = `The Watchfire`; `INTERACTIVE_WEEKS[6].title` = `Part VI · Connection` | **MISMATCH** |
| Week VII subtitle | `Week VII · Falling without unraveling.` | `weekHeading(7)` (`src/lib/lessonArt.ts:48`) → `Week VII · You're not alone` | **MISMATCH** |
| Week VIII title | `Boredom and Meaning` | `High Ground` / `Part VII · When it goes wrong` | **MISMATCH** |
| Week IX title | `Connection` | `The Gates` / `Part VIII · The deep fires` | **MISMATCH** |
| Week X title | `Yourself` | `The Triumph` / `Part IX · Run the campaign` | **MISMATCH** |
| Week XI title | `Build a Life You Want` | does not exist | **MISMATCH** |
| Week XII title | `Leave It Behind` | does not exist | **MISMATCH** |
| Week VII lesson 1 | `Relapse Isn’t the End` | week 7 lesson 1 is `Alone is the setting` | **MISMATCH** |
| Two-page pagination | P1 4 rows, P2 3 rows | none — `lessons-browser` scrolls a week horizontally with no page break | **MISMATCH** |
| Data source shape | one flat `WeekOverview[]` of 12 | `INTERACTIVE_WEEKS` (generated, `subs[].lessons[]` nested) + a parallel `WORLDS` table in `worlds.ts` that duplicates week naming | **MISMATCH** (two tables, neither with the design's fields) |
| `worlds.ts` `sub` used as the subtitle source | design blurb is a full sentence ending in `.` | `WORLDS[n].sub` are fragments without terminal stops (`"You're not alone"`, `"The deeper work"`) | **MISMATCH** |

### f.2 Chrome and type

| Property | Design | Current app | Verdict |
|---|---|---|---|
| Screen background | `#F4F3F0` | `colors.bg = '#F4F3F0'` (`theme.ts`) | match |
| Grain opacity | `0.07` | `0.07` in `all.tsx` and `locked.tsx`; `0.05` inside `lesson-overview`'s scene; `lessons-browser` has no page grain | match (for the pattern to copy) |
| Title font-size / weight / tracking / colour | `27` / `600` / `-0.2px` / `#1D1C1A` | `sans('600')`, `27`, `-0.2`, `#1D1C1A` in `all.tsx:149` and `locked.tsx:124` | match |
| Title left gutter | `24` | `16` in `all.tsx`; `24` in `locked.tsx` | **MISMATCH** if built on the `all.tsx` idiom; `locked.tsx` is right |
| Title top | `114 / 60` | `all.tsx` 16 (inside an 80-tall box); `locked.tsx` 68 | **MISMATCH** |
| Subtitle size / weight / leading / colour | `14.5` / `400` / `21px` / `#55534E` | no equivalent — `all.tsx` uses `13.5 / 400 / colors.textSoft (#8B8882)`; `locked.tsx` sub-rows use `13 / 400 / #55534E` | **MISMATCH** |
| Subtitle right bound | `right:60` | none anywhere | **MISMATCH** |
| Back chevron path / stroke / caps | `M9.5 1.5L2 9.5l7.5 8`, `#55534E`, `2.4`, round/round | identical in `lesson-overview/[slug].tsx:256` and `locked.tsx:119` | match |
| Back label | **none** | `lesson-overview` renders `Library`; `locked.tsx` renders `Back` | **MISMATCH** |
| Back position | `left:16, top:64 / 10` | `locked.tsx` `left:16, top:10` | match |
| Progress bar | **none** | none | match |
| Tab bar | **none on frame** | `lesson-overview` and `library` mount `<StoicTabBar />` | **MISMATCH** for this screen |
| Foot band | two clipped domes, `#CFD9E2` / `#C4D2DE`, on `linear-gradient(180deg, #ECEBE6, #E7E6E0)` | nothing equivalent | **MISMATCH** |

### f.3 The row card

| Property | Design | Current app (`lessons-browser` tile / `all.tsx` row / `locked.tsx` row) | Verdict |
|---|---|---|---|
| Shape | 345 × 56 card, one per lesson | `lessons-browser`: 118 × 168 **tile** in a horizontal scroller; `all.tsx`: 52-tall row inside a grouped card; `locked.tsx`: 40-glyph + two-line text row | **MISMATCH** |
| Border radius | `14` | `radius.md === 14`; `all.tsx` group uses `16`; `lessons-browser` tile uses `12` | **MISMATCH** at the call sites, token available |
| Background | `#FFFFFF` | `colors.surface = '#FFFFFF'` | match |
| Ring | `0 0 0 1px rgba(0,0,0,0.06)` | `colors.hairline = 'rgba(0,0,0,0.06)'` exists; `all.tsx` draws it as a 1px `View` hairline between rows, not as a ring on the card; `lessons-browser` tile ring is `0 0 0 1px rgba(40,60,90,0.08)` | **MISMATCH** |
| Padding | `0 16px` | `all.tsx` `paddingHorizontal: 18` | **MISMATCH** |
| Gap | `13` | `all.tsx` `gap: 10` on the right cluster only | **MISMATCH** |
| Row pitch | `80` (56 + 24) | `all.tsx` rows are contiguous inside one card | **MISMATCH** |
| Leading glyph container | 30 circle, `rgba(19,19,19,0.05)`, `inset 0 0 0 1.5px rgba(0,0,0,0.08)` | `locked.tsx` uses a 40 **square** `borderRadius:12` at `#EAE8E1`; `lessons-browser` uses a 24 circle at `rgba(19,19,19,0.45)` | **MISMATCH** |
| Glyph disc fill token | `rgba(19,19,19,0.05)` | `colors.accentSoft = 'rgba(0,0,0,0.045)'` — different hue **and** different alpha | **MISMATCH** — do not substitute the token |
| Lock glyph | `12 × 13`, `viewBox 0 0 16 17`, fill+stroke `#A5A29B`, stroke `1.8` | `locked.tsx` `LockGlyph`: `17 × 19`, `viewBox 0 0 17 19`, stroke `#55534E`, width `1.9`; `lessons-browser`: `10 × 12`, `viewBox 0 0 14 16`, fill `#F4F3F0` | **MISMATCH** (three lock glyphs, none of them this one) |
| Label size / weight / colour | `15.5` / `500` / `#8B8882` | `all.tsx` `16 / 500 / #1D1C1A`; `lessons-browser` tile title `13.5 / 600 / #1D1C1A` | **MISMATCH** |
| Label colour token | `#8B8882` | `colors.textSoft = '#8B8882'` | match (value) |
| Trailing number size / weight / colour | `12.5` / `500` / `#B0AEA8` | `all.tsx` detail is `14 / 400 / #8B8882` + a `ChevronGlyph` at `#B0AEA8` | **MISMATCH** |
| `#B0AEA8` as a token | — | `colors.textSofter = '#B4B1AB'` — **different colour** | **MISMATCH** — hard-code `#B0AEA8`, do not use `textSofter` |
| Trailing chevron | **none** | `all.tsx` and most list rows render `<ChevronGlyph/>` | **MISMATCH** |
| Row states drawn | locked only | `lessons-browser` draws locked vs open; `lesson-overview` `PartRow` draws done/current/ahead | n/a — the frames show one state |

### f.4 Connector dots

| Property | Design | Current app | Verdict |
|---|---|---|---|
| Exists | 2 dots between rows, `3.5` at `left:52`, `rgba(40,38,32,0.2)` | nothing like it anywhere | **MISMATCH** |
| Nearest analogue | — | `lesson-overview` `DetailBody` part dots: `7 × 7`, `rgba(19,19,19,0.28)` / `#131313`, laid horizontally | different element |

### f.5 Hero art

| Property | Design | Current app | Verdict |
|---|---|---|---|
| Per-week scene | 6 distinct 393 × 258 scenes for weeks VII–XII, hue-free paper + `#E9D2A4` sun + `#C8D7E5`/`#D5E1EA` sea | `components/lesson/scenes.tsx` `LessonCoverScene`/`LessonScene`/`LessonHorizon`/`LessonTrail`, tinted per *lesson* by `tintForLesson(title)`; `lessons-browser` has 12 `TILE_ART` objects keyed on `lesson.order % 12` | **MISMATCH** — nothing is keyed on the week |
| Sun colour | `#E9D2A4` disc, `rgba(226,186,120,·)` glow | `lessons-browser` `TileLight` uses `#E2BA78` glow and `#E9D2A4` dot | partial — glow tone matches, geometry does not |
| Blur | CSS `filter: blur(3–6px)` on 8 elements | RN has no blur filter; `lessons-browser` and `locked.tsx` already re-express blurs as `RadialGradient` stops | pattern exists, values differ |
| `clip-path: polygon(...)` | 2 elements per signpost scene | not used anywhere | **MISMATCH** — needs `Svg <Polygon>` or a rotated square |
| `worlds.ts` `hue` field | design uses **no** hue at all | `WORLDS[n].hue` = 268/280/290/300 for weeks 7–10 | **MISMATCH** — the hue field is dead for this screen |

---

## g. What must change, in order

1. **`src/lib/weeks.ts` (new).** Add the single data file that drives all twelve weeks:
   `export interface WeekOverview` and `export const WEEK_OVERVIEWS: WeekOverview[]` exactly
   as in §c.1 — `n`, `numeral`, `title`, `blurb`, `scene`, `lessons[7]`, `firstNumber`.
   Fill rows 7–12 from §c.1 verbatim (`’` U+2019 in the five labels that carry it, `·` U+00B7
   composed at render time, never stored inside `blurb`). Weeks 1–6 come from the sibling
   spec; leave the array typed for 12 entries.

2. **`src/lib/worlds.ts`.** Stop using `WORLDS[n].name` / `.sub` as week naming. Either
   (a) extend `WORLDS` to 12 and align `name`/`sub` with the canvas titles/blurbs, or
   (b) leave `WORLDS` alone as the journey-map table and have the week screen read only
   `WEEK_OVERVIEWS`. Prefer (b): `WORLDS[n].hue` is meaningless on this screen and the file's
   own header already says the map-node tables outlived their screens. Add a comment saying
   week naming now lives in `weeks.ts`.

3. **`src/lib/lessonArt.ts`.** Rewrite `weekHeading(week)` to return
   `` `Week ${numeral} · ${blurb}` `` from `WEEK_OVERVIEWS`, not
   `` `Week ${roman(week)} · ${WORLDS[…].sub}` ``. Keep `roman()`. Rewrite `weekEyebrow` the
   same way or delete it if the canvas dropped page-top caps eyebrows (commit `ed87661`).

4. **`src/app/week/[n].tsx` (new).** Build the Week Overview screen against §b:
   - grain `noise-dark.png` at `0.07`, full-bleed, `pointerEvents="none"`;
   - `SafeAreaView edges={['top']}`, then everything at canvas − 54;
   - back chevron at `left:16, top:10`, 11 × 19, `d="M9.5 1.5L2 9.5l7.5 8"`, `#55534E`,
     `strokeWidth 2.4`, round caps — **no label**;
   - title `left:24, top:60`, `sans('600')`, `27`, `letterSpacing -0.2`, `#1D1C1A`, 1 line;
   - subtitle `left:24, right:60, top:104`, `sans('400')`, `14.5`, `lineHeight 21`, `#55534E`;
   - hero band `top:160`, `height:258`, `overflow:'hidden'`, background as a `LinearGradient`
     with stops `#F4F3F0 0%`, `#F3EEE1 58%`, `#F4F3F0 100%`, closing with the 44-tall bottom
     fade `rgba(244,243,240,0) → #F4F3F0`;
   - rows at `top: 432 / 512 / 592 / 672`, `left:24, right:24`, `height 56`,
     `borderRadius 14`, `#FFFFFF`, `boxShadow: '0 0 0 1px rgba(0,0,0,0.06)'` passed verbatim,
     `paddingHorizontal 16`, `gap 13`;
   - dot pairs at `left:52`, `3.5 × 3.5`, `rgba(40,38,32,0.2)`, tops `493/501`, `573/581`,
     `653/661`;
   - foot band at `top:744`, `height 54`, `overflow:'hidden'`, gradient `#ECEBE6 → #E7E6E0`
     with the two clipped domes of §b.9;
   - **no** `StoicTabBar`, **no** progress bar, **no** trailing chevron on rows.

5. **`src/components/week/rows.tsx` (new, or inline).** The row: 30 circle at
   `rgba(19,19,19,0.05)` with `boxShadow: 'inset 0 0 0 1.5px rgba(0,0,0,0.08)'`, holding the
   12 × 13 lock on `viewBox="0 0 16 17"` — `<Rect x=3 y=7.5 w=10 h=7.5 rx=2 fill="#A5A29B"/>`
   and `<Path d="M5.2 7.5 V5.6 a2.8 2.8 0 0 1 5.6 0 V7.5" stroke="#A5A29B" strokeWidth={1.8}
   fill="none"/>`; label `sans('500')`, `15.5`, `#8B8882`, `flex:1`, `numberOfLines={1}`;
   number `sans('500')`, `12.5`, `#B0AEA8` — **hard-coded, not `colors.textSofter`**
   (`#B4B1AB` is a different colour).

6. **`src/components/week/scenes.tsx` (new).** The six scenes of §e as data tables, not as
   six hand-written components: a shared `sun(discLeft, discTop, D, alpha = 0.42)`,
   `cloud(left, top, s)`, `bird(left, top, w, h)` and `signpost(X, Y, s)` builder, plus a
   per-week list of plates. Blurs (`3/4/5/6px`) become `RadialGradient` stops the way
   `lessons-browser.tsx` `TileLight` and `locked.tsx` `MistRoadArt` already do. The two
   `clip-path: polygon(...)` triangles become `Svg <Polygon>`. Week XI keeps its literal
   `0.6` glow alpha and its non-concentric offset; Week XII keeps its literal `13 × 7` bird.

7. **`src/app/(app)/all.tsx`.** Add the twelve week routes under "The long game" so the new
   screen is reachable: `{ title: 'Week VII · Relapse and Adversity', to: '/week/7' }` … through
   week XII. Drop or re-point `Locked weeks` if the new screen supersedes it.

8. **`src/content/interactive/*.md` + `scripts/build-interactive.mjs` + `src/lib/curriculum.ts`.**
   The blocking mismatch: the canvas curriculum is **12 weeks × 7 = 84 lessons** and the app's
   is **10 parts × 110 lessons** with per-week counts of 4–23. Either regenerate the content to
   the 84-lesson shape (then `curriculum.ts`'s header comment, `minutesFor`, and every
   `week`/`order`/`number` field follow), or make the week screen read `WEEK_OVERVIEWS` for
   titles and numbering and treat `INTERACTIVE_WEEKS` purely as the reader's page source with
   an explicit slug mapping. Do **not** ship the screen reading `INTERACTIVE_WEEKS[6].title`
   — it renders `Part VI · Connection` where the canvas says `Relapse and Adversity`.

9. **`src/app/(app)/lifemap.tsx`.** No change from this spec. It was named as a target file but
   it is the Life Map values editor (`Why you're here`, `One year from now`, value chips built
   on `Screen`/`Header`/`Field`/`Button` and `spacing`/`radius` tokens) and owns none of these
   twelve frames. Note this explicitly so the next pass does not re-open it.
