# auth-funnel — analysis (Vici Overhaul, Oct 2026)

Group: the launch, the two auth doors and the 22-screen questionnaire —
`Splash` → `Login` / `Welcome Back` → `03 · Name` … `23 · Goal confirmation`.
25 frames, all in `Email-Login`. Read-only analysis; nothing under `src/` was edited.

Scratch evidence (re-runnable) in `.overhaul/understand/scratch-auth-funnel/`:
`<Frame>.txt` (body.mjs transcriptions), `lines.mjs` (canvas line breaks vs greedy wrap),
`heromatch.mjs` (hero ↔ spot-illustration identity), `dump-funnel.mjs` (copy in the current
generated content file).

---

## 0. The one-paragraph summary

Every frame in this group is the flat monochrome system: ground `#0D0D0D`, a 96px `noise.png`
tile at **opacity 0.05** (Email-Login frames use `noise.png`/0.05, *not* the kit's
`noise-dark.png`/0.06), Lato, ink `#F2F0EC`. Nothing of the current funnel survives visually:
the night gradient, low sun, corner bloom, 4px progress rule, "‹ Back" label row, centred 22/500
titles, 60px ringed rows with ticks, the 3-up glyph grid, the checkbox rows, the 30×30 row
marks, the nine header drawings, the First-Principle wave and its pager dots — all go. The
questionnaire becomes **one template** (kit `nav` with 8 dashes + left-aligned `h1` + `options`
or `chips` + `primary`) plus **one statement template** (hero at 190 + centred h1/p at 451 +
primary). The two auth doors become a flat stack (104px white laurel, h1/p, three 58px pills,
"or" rule, footer, caption). Splash becomes a 120px white laurel + `VICI` wordmark. **Every
funnel illustration is byte-identical to a `Lesson-Illustrations-v4` spot illustration**
(only the svg `top` and `scale` differ) — see §4. **Copy is unchanged** from the current
generated content except structure (Age becomes a wheel, Gender loses its button, Goal
confirmation's third line becomes a card with a bold run, First Principle loses its dots).

---

## 1. Where the app draws these today

| Frame | Route / file | How to reach (state) |
|---|---|---|
| Splash | `/(auth)/splash` → `src/app/(auth)/splash.tsx` → `SplashScene` in `src/components/ui/Waterline.tsx`. Also `/` (`src/app/index.tsx`) paints `SplashScene` while boot resolves. | `/splash --fast --wait=250` (replaces itself into `/sign-in` 900 ms after mount); cold path `/ --fast --wait=600`. Recipes: `.overhaul/recipes/auth.json`. |
| Login | `/(auth)/sign-in` → `src/app/(auth)/sign-in.tsx` → `AuthDoor variant="new"` in `src/components/auth/kit.tsx` | `/sign-in --wait=2400` (laurel decodes late under load). |
| Welcome Back | `/(auth)/welcome-back` → `src/app/(auth)/welcome-back.tsx` (`mode==='door' && !emailStep`) → `AuthDoor variant="returning"` | designed path: `/sign-in --do='await tap("Already have an account? Sign in")' --wait=1400`; control: `/welcome-back --wait=1600`. |
| 03 Name … 23 Goal confirmation (22 frames) | `/(onboarding)/welcome` → `src/app/(onboarding)/welcome.tsx` (step index `i` over `STEPS`) → `O3Shell` + `O3FunnelStep` in `src/components/onboarding/v3.tsx`, data from `src/content/onboardingFunnel.ts` (GENERATED) | `/welcome --initseed=.overhaul/f-funnel-user.js` + `script=.overhaul/drives/funnel-walk.js` with `window.__N=<fi>` (0-based index into `FUNNEL_STEPS`) and `window.__AFTER` to put the board in its drawn state. Recipes: `.overhaul/recipes/funnel.json` (need the state updates in §8). |

`FUNNEL_STEPS` index (`fi`) = recipe `__N`: Name 0, Age 1, Gender 2, Start 3, Q1 4, Q2 5, Q3 6,
Q3b 7, First Principle 8, Q5 9, Q6 10, Q7 11, What starts it 12, Transition 13, Q21 14,
What it affects 15, Q10 16, Q13 17, Q15 18, Q16 19, Q17 20, Goal Confirmation 21. Q3b/Q10/Q13 are
conditional (§7) — the walk answers so that all three are shown.

### The generated content file

`src/content/onboardingFunnel.ts` header: *"GENERATED FILE — do not edit by hand.
`scripts/vicifull/gen-funnel.mjs` reads `Latest Vici FULL/project/Email Login.dc.html`"*. The
generator reads `.vicifull/scenes/Email-Login.json` (the previous drop) and pattern-matches
the **old** CSS (22px centred titles, 60px/16px rows, 94px/16px grid tiles, 52px/15px check
rows, 4px rule, radial suns). Run against `.overhaul/scenes/Email-Login.json` it would match
nothing (titles null, options empty). It must be **forked to `scripts/overhaul/gen-funnel.mjs`**
and rewritten for the new CSS (spec in §6). Copy check (old generated vs new frames, all 22
steps): every title, hint, note, option label and CTA label is **identical**; the differences
are structural only (listed per frame in §5).

`FUNNEL_GLYPHS` (the 22×22 grid glyphs, exported from the same file) has **no source in the new
frames** but is imported by `src/components/onboarding/plan.tsx` (`PlanGlyph`, and
`planSignals()` uses it as the whitelist of valid trigger labels). Tail-group conflict — see §10.

---

## 2. Global tokens for this group (use `mono` from `src/lib/theme.ts`)

| token | value | used for |
|---|---|---|
| ground | `#0D0D0D` | every frame background |
| noise | `assets/images/noise.png` (96×96, identical bytes to the bundle's), repeat, opacity **0.05**, full frame, under everything | every frame (`Grain` component already tiles with `resizeMode="repeat"`) |
| ink | `#F2F0EC` | h1, chevron, active dash, selected fill, primary fill, laurel is pure `#FFFFFF` (filter brightness(0) invert(1)) |
| card | `#1E1E1E` | unselected option/chip, field, Google/email pills, GC card |
| line | `#2E2E2E` | inactive dashes, pill ring `0 0 0 1.5px`, "or" rules |
| art | `#5A574F` | age wheel ±1 numbers |
| sub | `#B5B0A8` | statement/auth paragraphs, footer question |
| mute | `#9B968E` | question sub-line, "or", Terms caption, placeholder |
| onInk | `#111111` | text/check/Apple glyph on ink fills |

Type: Lato via `sans('400'|'700')` only. Weights in this group: 400 and 700 only.
`line-height: normal` on Lato = 1.2× (15→18, 16→19.2 (sig 19), 17→20.4 (sig 21)) — the option,
chip, pill and footer spans state no line-height; don't give them one that differs.

Canvas → app: every `top` below is **canvas y**; app y = canvas − 54 (D009). Bottom offsets
(`bottom:48` primary, `bottom:108` / `bottom:64` auth footer) are off the frame edge (D026).

---

## 3. The question template (document once)

Kit vocabulary: `frame` + `nav({step,total:22})` + `stack(136,[h1, p(sub), spacer, options|chips|field])`
+ (`primary('Continue')` on multi/typed screens) + an optional spot hero. **Where the kit and the
frames disagree the frame numbers below win** (noted ⚠).

### 3.1 nav (top bar)
* Row: `position:absolute; left:0; right:0; top:60 (app 6); height:40; flex-row; align-items:center;
  justify-content:space-between; padding:0 22; z-index:5`.
* Left box 36×40, align centre: back chevron `<Svg 12×20 viewBox="0 0 12 20">` path
  `M10 2L2 10l8 8`, stroke `#F2F0EC`, width 2.2, round caps/joins → chevron at x22,y70 (app 16).
  **No "Back" label** (the current row draws "‹ Back" at 17px/0.75 alpha — remove the text, keep
  `accessibilityLabel="Back"` and add hitSlop; PressScale's default `minHeight:44` must be 0 here).
* Middle: 8 dashes, row gap 6, each `24×2, radius 1`; first *k* `#F2F0EC`, rest `#2E2E2E`.
  Block is 234 wide, lands x 79.5…313.5, y 79 (app 25). Space-between centres it — do not
  hard-code x.
* Right box 36×40, empty in this group (kit uses it for close ✕ / right text elsewhere).
* **Dash count is per frame, read off the frame** (not computed from the step index — the
  canvas skips Start, so index-based maths gives Q1 = 2, frame says 1):

| frame | Name | Age | Gender | Start | Q1 | Q2 | Q3 | Q3b | FP | Q5 | Q6 | Q7 | WSI | Trans | Q21 | WIA | Q10 | Q13 | Q15 | Q16 | Q17 | GC |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| active dashes | 1 | 1 | 1 | **none** (row absent, back only) | 1 | 2 | 2 | 3 | 3 | 3 | 4 | 4 | 4 | 5 | 5 | 5 | 6 | 6 | 7 | 7 | 7 | 8 |

  (= kit `max(1, round(step/22·8))` with Name=1,Age=2,Gender=3,Start=null,Q1=4…GC=21.)
  Conditional skips do not change any screen's count.

### 3.2 stack
`position:absolute; left:24; right:24; top:136 (app 82); flex-column; gap:14`.
**top is 140 (app 86) on V3-Q5, What-starts-it and V3-Q17** (the three chip screens without a
hero) — a real per-frame difference, transcribe it.

Children in order:
1. **h1** `26px / 700 / letter-spacing -0.6 / line-height 33 / #F2F0EC / text-wrap:balance`,
   left-aligned, width 100% (345). (Currently centred 22/500/0.1 on a 44 inset.)
2. **sub** (multi-select screens and Name only) `15px / 400 / line-height 22 / #9B968E /
   text-wrap:pretty`: "Select all that apply" | "Choose up to three" | "All your data will be
   encrypted." (Currently a centred 13/500 hint at a fixed top.)
3. **spacer** div: height **10** after a sub, **18** when there is no sub.
4. **body**: options | chips | field | (Age: nothing — the wheel is a separate block).

Resulting body tops (canvas): list after 1-line h1 **215**, 2-line **248**, 3-line **281**;
chips/field after sub: `top + h1H + 74` → 243 (1-line, top 136), 247 (1-line, top 140),
276 (2-line, 136), 280 (2-line, 140).

### 3.3 options (single select — kit `options`, ⚠ frame overrides)
Column, gap 12. Row: `height:58; border-radius:18; padding:0 22; flex-row; align-items:center`.
* unselected: `background:#1E1E1E; box-shadow:0 1px 2px rgba(0,0,0,0.04)`; label `#F2F0EC`.
* selected: `background:#F2F0EC; box-shadow:none`; label `#111111`.
* label `15px / 400 / white-space:nowrap` (⚠ kit says 16 — frame draws **15**).
* **No tick, no leading mark, no ring** (current rows: 60 tall, radius 16, 1px ring, 17/500,
  trailing tick, and 30×30 gauge marks on nine boards — all removed).
* No primary on single-select screens; the board still turns itself over 260 ms after a tap
  (existing `picked` + `setTimeout(next, 260)` — keep).

### 3.4 chips (multi select — kit `chips`)
`flex-row; flex-wrap:wrap; gap:12` (row and column). Chip: `height:48; border-radius:24;
padding:0 20; flex-row; align-items:center; gap:8`.
* unselected `#1E1E1E` + `box-shadow:0 1px 2px rgba(0,0,0,0.04)`, label `#F2F0EC`.
* selected `#F2F0EC`, no shadow, leading check `<Svg 13×13 viewBox="0 0 14 14">` path
  `M2 7.5l3.2 3L12 3.5` stroke `#111111` 2.2 round, label `#111111`.
* label `15px / 400 / nowrap`. Chip widths come from content (e.g. Q5 "Late at night"
  selected = 142.5 wide; "In the morning" = 135.4) — natural flex-wrap reproduces the frame's
  rows; do not set widths.
* Replaces three current widgets: the 3-up glyph grid (Q5, Q6, Q7, WIA), the checkbox rows
  (What starts it, Q17).
* Primary "Continue" pinned (3.5).

### 3.5 primary (kit `primary`)
`position:absolute; left:24; right:24; bottom:48; height:58; border-radius:29; background:#F2F0EC;
z-index:6`, centred label `16px / 700 / letter-spacing 0.1 / #111111 / nowrap` → box top 746
(app 692), label baseline box y 765.5. (Currently `O3CTA` 56|58, 16.5|17/600, at a fixed top.)
Disabled state (multi with nothing chosen) is **not drawn** — see open questions.

### 3.6 hero (spot illustration)
`<svg viewBox="0 0 393 240" width=393 height=240 style="position:absolute; left:0; top:T;
overflow:visible; transform:scale(s); transform-origin:196px 190px">`. In RN:
`<Svg width={393} height={240} viewBox="0 0 393 240" style={{position:'absolute', top:T-54,
left:'50%', marginLeft:-196.5}}>` + `<G transform={`translate(${196*(1-s)} ${190*(1-s)}) scale(${s})`}>`
(1.1 → `translate(-19.6 -19) scale(1.1)`; 1.089 → `translate(-17.444 -16.91)`; 0.877 →
`translate(24.108 23.37)`; 0.76 → `translate(47.04 45.6)`). Never `rotation/origin` props.
Nothing in any hero exceeds the 393×240 box after scaling except horizon rects at x −40…433,
which the frame edge clips anyway — RN's Svg clipping is equivalent at 393 wide.
Question frames place it at **T = 506** (box bottom = 746 = primary top) or **T = 582** (box
bottom = 822 = 30 above the frame edge, the single-select screens with no primary); statement
frames at **T = 190**. See §4 for which picture and §9 for short screens.

### 3.7 the statement template (Start, First Principle, Transition, Goal Confirmation)
nav (Start: back only) · hero at T 190 (app 136) scale 1.1 · stack `left/right 24, top 451
(app 397), gap 18, align-items:center, text-align:center`: h1 (as 3.2 but centred, balance) +
p `15px / 400 / line-height 24 / #B5B0A8 / centred / text-wrap:pretty` (+ GC card) · primary
bottom 48. p top = 451 + h1H + 18 → 535 (2-line h1), 502 (1-line). (Currently: 26/500/-0.2 on a
36 inset at 338 and 15.5/24 on a 44 inset at 434; FP was 22/500 at 514 with pager dots.)

### 3.8 line breaks (canvas render, measured with `lines.mjs`)
RN Web passes `textWrap` to CSS, so on web set `textWrap:'balance'` on h1 and `'pretty'` on
p/sub (AppText's web default is `pretty` for body — h1 must override to `balance`). Native has
neither; these are the canvas's breaks where they differ from a greedy wrap (fixed copy → an
explicit `\n` is allowed by brief rule 6, but only at ≥393 wide or it will over-wrap at 375):

| frame | canvas lines (balance/pretty) | greedy would give |
|---|---|---|
| Login p (pretty) | Sign in or create an account to keep your plan ⏎ and progress. | …your plan and ⏎ progress. |
| Gender h1 | How do you describe ⏎ your gender? | …describe your ⏎ gender? |
| Q1 | How often are you ⏎ watching porn right now? | …you watching ⏎ porn right now? |
| Q2 | How long have you wanted ⏎ to quit or cut down? | …wanted to ⏎ quit… |
| Q3b | When you’ve tried to quit, ⏎ how long do you usually make ⏎ it before watching again? | …quit, how ⏎ long … make it ⏎ before… |
| First Principle h1 | An urge doesn’t stay at ⏎ its worst for very long. | …at its ⏎ worst… |
| Q5 | When do you usually ⏎ end up watching? | …usually end up ⏎ watching? |
| Q6 | What are you usually ⏎ feeling right before? | …usually feeling ⏎ right before? |
| Q7 | Where are you ⏎ usually watching? | Where are you usually ⏎ watching? |
| Q21 | How much is porn getting ⏎ in the way of your life? | …getting in ⏎ the way… |
| Q10 | How often have you ⏎ felt lonely lately? | …felt lonely ⏎ lately? |
| Q13 | How often are you on your ⏎ own for long stretches? | …your own ⏎ for long… |
| Q15 | What are you aiming ⏎ for with porn? | …aiming for with ⏎ porn? |

Same as greedy (no special handling): Start h1 "Sam, let’s figure out what ⏎ usually leads you
back to porn." (name-dependent — never hard-break), Start p "It’ll take about two minutes. Then
we’ll show you ⏎ what we’d change first.", FP p "…the part where giving ⏎ in feels easiest.",
Transition h1 "Okay. That’s enough to see ⏎ where things usually start.", Transition p "…then
we’ll show you what we’d ⏎ change first.", GC card "Masturbation isn’t part of what you’re
trying ⏎ to stop. **Porn is.**". All other h1s are one line.

---

## 4. Illustrations — every hero is a Lesson-Illustrations-v4 spot, verbatim

`heromatch.mjs` compares each frame's `<svg viewBox="0 0 393 240">` subtree against the 53
`Lesson-Illustrations-v4` frames: **all 17 heroes are byte-identical** to a library entry; only
the svg's `top` and `scale` differ (library draws them at scale 1.1).

| frame | spot illustration (`.overhaul/final/Lesson-Illustrations-v4/<name>.html`) | T (canvas → app) | scale |
|---|---|---|---|
| V3 Q24 Name | Pencil | 506 → 452 | 1.1 |
| V3 Q26 Gender | ID-badge | 582 → 528 | **0.877** |
| Onboarding Start | Phone-parked-for-the-night | 190 → 136 | 1.1 |
| V3 Q2 | Hourglass | 582 → 528 | 1.1 |
| V3 Q3 | Compass-and-map | 582 → 528 | 1.1 |
| V3 Q3b | Wall-calendar | 582 → 528 | **0.76** |
| First Principle | Lighthouse | 190 → 136 | 1.1 |
| V3 Q6 | Storm-cloud | 506 → 452 | 1.1 |
| V3 Q7 | Bed-at-night | 506 → 452 | **1.089** |
| Transition | Signpost | 190 → 136 | 1.1 |
| V3 Q21 | Balance-scale | 582 → 528 | 1.1 |
| What it affects | Plant | 506 → 452 | 1.1 |
| V3 Q10 | Desk-lamp | 582 → 528 | 1.1 |
| V3 Q13 | Open-door | 582 → 528 | 1.1 |
| V3 Q15 | Flag | 582 → 528 | 1.1 |
| V3 Q16 | Signpost | 582 → 528 | 1.1 |
| Goal Confirmation | Flag | 190 → 136 | 1.1 |
| (no hero) | Age, Q1, Q5, What starts it, Q17 | — | — |

These same drawings recur across SOS, lesson readers, Today, Week covers (e.g. Lighthouse in 13
frames, Signpost 18, Balance-scale 14). **Recommendation: one generated spot-illustration
module** (`scripts/overhaul/gen-spots.mjs` → `src/content/spotIllustrations.ts`, child-by-child
SVG kids keyed by name, + one `<SpotArt name top scale/>` renderer reusing v3.tsx's
`FunnelSvgKids` attribute mapper). If nobody else owns it, the funnel generator can embed each
step's hero kids (as the old generator did for `art`) — but that duplicates data the other
groups need too. Attributes to support: `rect/circle/ellipse/path/g`, `transform` on `g` and
`ellipse` (rotate/translate strings), `fill-opacity`, `stroke-dasharray`, group-level `fill`.

---

## 5. Per frame

Format: **draws** (kit decomposition + bespoke numbers) · **change** (what the app must do) ·
**state** (what the frame shows selected) · **preserve** (current function the frame doesn't show).

### Splash (`01`) — `src/components/ui/Waterline.tsx` `SplashScene`
* **Draws:** ground + noise 0.05; `<img laurel-mark.webp 120×120>` at left 136, top 330,
  `filter:brightness(0) invert(1)` (pure white, no opacity, stretched to a square — keep
  `contentFit="fill"`); text **"VICI"** `left:0 right:0 top:478 text-align:center 14px/700
  letter-spacing 7 #F2F0EC` (line box 17 tall). Nothing else.
* **Change:** remove the gradient, four washes, four stars and the `noise-dark` grain at 0.1;
  laurel 72px @ 0.9 at (40.712%, 46.948%) → **120px @ 1.0, centred (left = 50% − 60.5 → 136 at
  393), top 330/852 = 38.732% of the full frame**; add the `VICI` wordmark (new element; note CSS
  letter-spacing adds 7px after the last "I", so the visible word sits 3.5px left of centre — RN
  web does the same; check iOS). Positions are relative to the full screen (this board paints
  under the status bar; current code already uses % of the frame — keep that idiom).
* **Preserve:** 900 ms hand-over to `/sign-in` (`(auth)/splash.tsx`); `/` boot shows the same
  scene while session/user resolve; `useId` per mount no longer matters (no gradients) but keep
  the component mount-safe.

### Login (`02`) — `AuthDoor variant="new"`, `src/components/auth/kit.tsx`, route `/sign-in`
* **Draws:** ground+noise. Laurel `img 104×104` at left 144.5 (centred), top 150 (app 96),
  white. Stack `top 284 (app 230), left/right 24, gap 12, centred`: h1 "Welcome to VICI."
  (26/700/-0.6/33, centred, 1 line) + p "Sign in or create an account to keep your plan and
  progress." (15/400/24 #B5B0A8, centred, pretty → 2 lines, see 3.8). Buttons stack `top 436
  (app 382), left/right 24, gap 14`:
  1. Apple pill 58 tall r29 `#F2F0EC`, row centred gap 10: Apple glyph `<Svg 16×19 viewBox="0 0 16 19">`
     path `M13.3 10c0-2.5 2-3.6 2.1-3.7…` (full d in `scratch-auth-funnel/Login.txt`) fill `#111111`,
     label "Continue with Apple" 17/700 `#111111`. (box 436–494)
  2. Google pill 58 r29 `#1E1E1E` + `box-shadow:0 0 0 1.5px #2E2E2E`, gap 10: Google G
     `<Svg 19×19 viewBox="0 0 48 48">` (same four paths/colours as today's `GoogleMark`), label
     "Continue with Google" 17/700 `#F2F0EC` nowrap. (508–566)
  3. "or" row: `padding:2px 0; gap 12`; two `flex:1` 1px rules `#2E2E2E`; "or" 13/700 `#9B968E`.
     (580–600; rules at y 589.5)
  4. Email pill, same as Google without an icon: "Continue with email" 17/700 `#F2F0EC`, centred.
     (614–672)
  Footer `left 0 right 0 bottom 108` (top 726), centred 15px `#B5B0A8` "Already have an account? "
  + span 700 `#F2F0EC` "Sign in" (`cursor:pointer`). Caption `bottom 64` (top 773) centred
  12/700 letter-spacing 0.4 `#9B968E` "Terms · Privacy" (single spaces, middot; no pointer).
* **Change:** delete `AuthNightField` (gradient, two washes, four stars) and `AuthMark` (150
  block, 190 warm wash, 96px laurel @0.95) → plain 104 laurel. Title 27/600(→700) left-24 at
  326 → centred 26/700/-0.6/33 at 230. Subtitle 14.5 @0.5 → 15/24 `#B5B0A8` centred.
  Apple 54/27 at 418 with 15×18 FontAwesome glyph and 16/600 label → 58/29 at 382 with the new
  16×19 glyph and 17/700 label. Google 54/27 `paper(0.08)` + 1px ring → 58/29 `#1E1E1E` + 1.5px
  `#2E2E2E` ring, 19px G (was 17). "or": gap 14, 12.5/500 @0.4, rules @0.14 → gap 12, 13/700
  `#9B968E`, `#2E2E2E`, padding 2. **Email row restructured**: was a 56/16 field-like row with
  placeholder-coloured label and a 40px ink arrow button → now a centred 58/29 pill identical to
  Google minus the icon (drop the arrow svg). Footer 13.5 @0.5 / 600 at top 686 → 15 / 700,
  bottom-anchored 108. Terms 12/400 @0.35 "Terms &nbsp;·&nbsp; Privacy" → 12/700 ls 0.4 `#9B968E`
  "Terms · Privacy", bottom-anchored 64.
* **Preserve:** Apple/Google SSO (`signInWithSSO`, buttons disabled while `loading`); SSO error
  line (`AuthMessage`) — no frame; place it centred in the 54pt gap between the email pill
  (bottom 672) and the footer (top 726); email pill → `/sign-up?step=form`; footer →
  `/welcome-back`; optional Back row when `router.canGoBack()` (reached from Name's back or All)
  — restyle as the kit nav chevron (3.1) at top 60, no label; "Terms · Privacy" stays a caption.

### Welcome Back (`02B`) — `AuthDoor variant="returning"`, route `/welcome-back`
* **Draws:** Login with four strings: h1 "Welcome back.", p "Sign in to pick up where you left
  off." (1 line — so the buttons stay at 436: stack heights differ but the buttons block is
  absolutely placed), email pill "Sign in with email", footer "New here? " + **"Create an
  account"**. Everything else identical to Login.
* **Change:** as Login (same component).
* **Preserve:** footer = back to `/sign-in` (or replace); email pill opens the address step;
  the address/password/verify steps (§7.2).

### V3 Q24 Name (`03`, fi 0) — question template, typed field
* **Draws:** nav (1 dash). Stack top 136: h1 "What should we call you?" (1 line) · sub "All your
  data will be encrypted." (15/22 `#9B968E`) · spacer 10 · **field** `height 60; radius 18;
  background #1E1E1E; padding 0 22; flex-row; align-items:center; gap 2` (box 243–303, app
  189–249) containing a caret bar `2×24 #F2F0EC radius 1` (x46, y261) then placeholder "Your name"
  `17/400 #9B968E nowrap` (x50). Hero **Pencil** T 506 s 1.1. Primary "Continue".
* **Change:** h1 centred 22/500 at 158 → left 26/700 in the stack; note 13.5 @0.6 centred at
  200 → sub in stack; field 60/**16** `rgba(255,255,255,0.07)` + 1px ring, gap 3, caret 2×22 →
  radius **18**, `#1E1E1E`, **no ring**, gap 2, caret 2×**24**; placeholder colour
  `rgba(244,243,240,0.45)` → `#9B968E`. Add the Pencil hero. Remove night field/rule/Back label.
* **State:** empty, caret before placeholder (what the frame draws; recipe `__N=0`, no AFTER).
* **Preserve:** `TextInput` (autoCapitalize words, maxLength 40, `selectionColor` ink, caret
  hidden while empty and the bar shown instead, bar keeps its 2px slot once typed so nothing
  shifts); typed value style is not drawn → 17/400 `#F2F0EC`; Continue always enabled (empty
  name allowed today); Back on step 0 → `backToDoor()` (D122).

### V3 Q25 Age (`04`, fi 1) — **bespoke wheel** (no kit primitive)
* **Draws:** nav (1 dash). Stack top 136 **gap 20**: h1 "How old are you?" only. Wheel block
  `left 0 right 0 top 236 (app 182); flex-column; align-items:center; gap 0`:
  | row | text | style | box (y, h) |
  |---|---|---|---|
  | −2 | 22 | 30px/700 `#2E2E2E` lh 56 | 236, 56 |
  | −1 | 23 | 34px/700 `#5A574F` lh 60 | 292, 60 |
  | rule | — | 200×1.5 `#F2F0EC` (x 96.5) | 352 |
  | 0 | **24** | 72px/700 ls −2 `#F2F0EC` lh 100 | 353.5, 100 |
  | rule | — | 200×1.5 `#F2F0EC` | 453.5 |
  | +1 | 25 | 34px/700 `#5A574F` lh 60 | 455, 60 |
  | +2 | 26 | 30px/700 `#2E2E2E` lh 56 | 515, 56 |
  Primary "Continue". No hero.
* **Change:** replace the typed number field (60/16 row with a 17/500 value + caret bar and a
  transparent `TextInput` over it) with a vertical picker. At rest it must render exactly the
  table above (selected centre y 403.5; neighbour centres at ±81.5, ±139.5 — **non-uniform
  pitch**, so a plain FlatList snap does not reproduce it). Suggested build: discrete state +
  pan gesture (each ~40pt of drag = one step, light spring), tap on a visible neighbour selects
  it, `accessibilityRole="adjustable"` with increment/decrement actions; render the 5 rows with
  the exact rest styles (animate only translate/opacity during the drag, snap back to exact
  styles at rest). Rules are fixed; numbers move. Blank rows past the range ends.
* **State:** 24 selected (= `AGE_DEFAULT`).
* **Preserve:** stores `ageYears` as a string (welcome.tsx `parseInt`s it for `byAge80` and the
  gate) — set it to the wheel's value on mount/Continue so an untouched wheel stores "24";
  **under-18 gate**: Continue with value < 18 (`O3_AGE_MIN`) → `setGated(true)` (§7.3) — the
  range must therefore include ages < 18 (open question for the bounds).

### V3 Q26 Gender (`05`, fi 2) — question template, options
* **Draws:** nav (1). h1 "How do you describe your gender?" (2 lines, balance) · spacer 18 ·
  options ×5 (248, 318, 388, 458, 528): Male / Female / Non-binary / Another identity / Prefer not
  to say. Hero **ID-badge** T 582 **s 0.877**. **No primary.**
* **Change:** the current board has a "Continue" CTA (old frame); the new frame has none → it
  becomes an auto-advancing single select like Q1 (generator emits `cta:null` → existing
  `hasCta=false` path). Rows restyle per 3.3; labels lose `flexShrink` quirk (15/400 nowrap).
* **State:** Male selected.
* **Preserve:** answer stored under `gender`.

### Onboarding Start (`06`, fi 3) — statement template
* **Draws:** nav **back only, no dash row**. Hero **Phone-parked-for-the-night** T 190 s 1.1.
  Stack 451: h1 "Sam, let’s figure out what usually leads you back to porn." (2 lines) · p
  "It’ll take about two minutes. Then we’ll show you what we’d change first." (2 lines).
  Primary "**Start**".
* **Change:** 26/500/-0.2 on a 36 inset at 338 → 26/700/-0.6/33 at 451 in a 345 stack; note
  15.5 → 15/24 `#B5B0A8` at 535; add hero; no rule.
* **Preserve:** `withName()` swaps the leading "Sam" for the real name (keep; it means the h1
  cannot be hard-broken). Existing quirk: with no name it shows "Sam," — unchanged.

### V3 Q1 (`07`, fi 4) — options, no hero
* h1 "How often are you watching porn right now?" (2 lines) · spacer 18 · options ×6 from 248:
  More than once a day / About once a day / **A few times a week** / About once a week / A few
  times a month / Less than once a month. No hero, no primary.
* **Change:** remove the header drawing (old `art` top 232) and the 30×30 row gauges.
* **State:** "A few times a week" (idx 2).

### V3 Q2 (`08`, fi 5)
* h1 "How long have you wanted to quit or cut down?" (2) · options ×5 from 248: Less than 3
  months / 3–12 months / **1–3 years** / 3–5 years / 5+ years. Hero **Hourglass** T 582 s 1.1.
* **Change:** old header art (top 236) + row marks → bottom hero. **State:** "1–3 years".

### V3 Q3 (`09A`, fi 6)
* h1 "Have you tried to quit before?" (1) · options ×3 from 215: **Yes, several times** / Yes,
  once or twice / No. Hero **Compass-and-map** T 582 s 1.1.
* **State:** "Yes, several times" (recipe currently taps "Yes, once or twice" — update).
* **Preserve:** answer gates 09B (`startsWith('Yes')`).

### V3 Q3b (`09B`, fi 7) — conditional
* h1 3 lines (see 3.8) · options ×5 from 281: Less than a day / **A few days** / About a week / A
  few weeks / A month or longer. Hero **Wall-calendar** T 582 **s 0.76**.
* **State:** "A few days" (recipe taps "About a week" — update).

### First Principle (`10`, fi 8) — statement template
* nav (3 dashes). Hero **Lighthouse** T 190 s 1.1 (includes the translucent beams
  `fill-opacity 0.12` and a horizon rect x −40 w 473). Stack 451: h1 "An urge doesn’t stay at
  its worst for very long." (2, balance) · p "The first job is getting through the part where
  giving in feels easiest." (2). Primary "Continue".
* **Change:** delete `FirstPrincipleArt` (warm bloom, blurred ground shadow, gradient wave) and
  `O3PagerDots` (4 dots at 712); title 22/500 at 514 → statement h1 at 451; `backTop 96`
  special case disappears (nav is uniform). `kind:'card'` → statement.

### V3 Q5 (`11`, fi 9) — chips, no hero, **stack top 140**
* h1 "When do you usually end up watching?" (2) · sub "Select all that apply" · spacer 10 ·
  chips ×9 from 280 (rows: 280, 340, 400, 460, 520, 580): **Late at night** / In the morning /
  When I’m bored / When I’m stressed / **When I can’t sleep** / On weekends / After drinking /
  **When I’m home alone** / **While scrolling**. Primary "Continue".
* **Change:** 3×3 glyph grid (94-tall tiles, 22px glyphs, corner check badge) → chips.
* **State:** idx 0, 4, 7, 8 selected.
* **Preserve:** multi; Continue requires ≥1 (today); `triggers` feeds windowFor / plan /
  paywall / life-map; "When I’m home alone" earns Q10/Q13.

### V3 Q6 (`12`, fi 10)
* h1 "What are you usually feeling right before?" (2) · sub · chips ×9 from 276: Horny / **Bored**
  / **Lonely** / Stressed / Low / Angry / Numb / **Tired** / Nothing in particular. Hero
  **Storm-cloud** T 506 s 1.1. Primary.
* **State:** Bored, Lonely, Tired. **Preserve:** "Nothing in particular" exclusive.

### V3 Q7 (`13`, fi 11)
* h1 "Where are you usually watching?" (2) · sub · chips ×6 from 276: **In bed** / In the bathroom
  / At my desk / In the living room / Somewhere else at home / Outside home. Hero **Bed-at-night**
  T 506 **s 1.089**. Primary.
* **State:** In bed only (recipe adds "Somewhere else at home" — update).

### What starts it (`14`, fi 12) — chips, no hero, **stack top 140**
* h1 "What usually sets it off?" (1) · sub · chips ×7 from 247: I see something sexual online /
  **I start scrolling** / **I can’t sleep** / I’ve had a stressful day / I argue with someone or
  feel rejected / I start fantasising / Nothing obvious. Primary.
* **Change:** checkbox rows (52/15 with 22px box and trailing 26px marks) → chips.
* **State:** idx 1, 2. **Preserve:** "Nothing obvious" exclusive; "I argue with someone or feel
  rejected" is a loneliness signal (key `before`).

### Transition (`15`, fi 13) — statement template
* nav (5). Hero **Signpost** T 190 s 1.1. h1 "Okay. That’s enough to see where things usually
  start." (2) · p "A few more questions, then we’ll show you what we’d change first." (2).
  Primary "Continue".

### V3 Q21 (`16`, fi 14)
* h1 "How much is porn getting in the way of your life?" (2) · options ×4 from 248: Not really / A
  little / **Quite a bit** / A lot. Hero **Balance-scale** T 582 s 1.1.
* **State:** "Quite a bit" (recipe taps "A little" — update). **Preserve:** "Not really" lets
  What-it-affects continue with zero picks.

### What it affects (`17`, fi 15)
* h1 "What does it affect most?" (1) · sub "**Choose up to three**" · chips ×9 from 243: Time /
  **Focus** / **Sleep** / **Confidence** / Relationships / Sex or intimacy / Energy / Feeling in
  control / Peace of mind. Hero **Plant** T 506 s 1.1. Primary.
* **Change:** glyph grid → chips (this also retires the positional glyph reuse noted in the
  generated file).
* **State:** Focus, Sleep, Confidence (recipe taps Time/Confidence/Peace of mind — update).
* **Preserve:** cap of 3 (4th tap refused); zero allowed when impact = "Not really".

### V3 Q10 (`18`, fi 16) — conditional
* h1 "How often have you felt lonely lately?" (2) · options ×4 from 248: Rarely / **Sometimes** /
  Often / Most days. Hero **Desk-lamp** T 582 s 1.1. **State:** Sometimes.

### V3 Q13 (`19`, fi 17) — conditional
* h1 "How often are you on your own for long stretches?" (2) · options ×4 from 248: Most days / **A
  few days a week** / Now and then / Rarely. Hero **Open-door** T 582 s 1.1.
* **State:** "A few days a week" (recipe taps "Most days" — update).

### V3 Q15 (`20`, fi 18)
* h1 "What are you aiming for with porn?" (2) · options ×4 from 248: **Stop completely** / Watch much
  less / Set a limit and stick to it / I’m not sure yet. Hero **Flag** T 582 s 1.1.

### V3 Q16 (`21`, fi 19)
* h1 "What about masturbation?" (1) · options ×4 from 215: Stop for now / Do it less / **Keep it,
  just without porn** / I’m not sure yet. Hero **Signpost** T 582 s 1.1.
* **State:** "Keep it, just without porn" (recipe taps "Do it less" — update).

### V3 Q17 (`22`, fi 20) — chips, no hero, **stack top 140**
* h1 "What have you tried already?" (1) · sub · chips ×7, one per row, from 247: **Blocking sites or
  apps** / **Going cold turkey** / Asking someone to keep me accountable / Deleting apps or accounts /
  Therapy or counselling / Replacing it with other habits / Nothing yet. Primary.
* **Change:** checkbox rows → chips. **State:** idx 0, 1 (recipe adds "Deleting apps or
  accounts" — update). **Preserve:** "Nothing yet" exclusive.

### Goal Confirmation (`23`, fi 21) — statement template + card
* nav (8). Hero **Flag** T 190 s 1.1. Stack 451 gap 18: h1 "You want to stop." (1) · p "That’s
  what we’ll work toward." (1, top 502) · **card** `margin-top 14` (→ top 558), `padding 18px 22px;
  radius 18; background #1E1E1E; 15px / line-height 23 / #B5B0A8; text-align:left`, full stack
  width (345; card height 82): "Masturbation isn’t part of what you’re trying to stop. " +
  **span 700 `#F2F0EC` "Porn is."** Primary "Continue".
* **Change:** the current quieter third line (14.5 @0.5, centred, at its own top) becomes this
  card with a **bold run** — content must carry rich runs (`[{t:'…stop. '},{t:'Porn is.',b:true}]`).
  The stack is centred with `align-items:center`; the card's text is long enough to fill 345 —
  give it `alignSelf:'stretch'` so shorter variants don't shrink it.
* **Preserve (no frame for these):** title/line variants by goal (`O3_GOAL_CONFIRM`: watch less,
  limit, not sure — "We’ll start with getting the choice back."); card only when
  `goalMast === 'Keep it, just without porn'` (two-line form otherwise). Variant h1s wrap to 2
  lines and push p/card down — the stack is flow, so that falls out.

---

## 6. New generator spec — `scripts/overhaul/gen-funnel.mjs`

Fork of `scripts/vicifull/gen-funnel.mjs`; input `.overhaul/scenes/Email-Login.json`
(`source: Vici Overhaul/project/Email Login.dc.html`); output `src/content/onboardingFunnel.ts`
with header naming the new generator and source. Keep the `FUNNEL` id table **unchanged** (ids
are answer keys used downstream: `name, ageYears, gender, start, freq, duration, quitAttempts,
relapseSpan, firstPrinciple, triggers, emotions, places, before, transition, impact, affects,
lonely, alone, goalPorn, goalMast, tried, goalConfirm`). Per step, read off the frame:

* `dashes`: count of `24px×2px` divs with background `#F2F0EC` inside the top-60 nav; `null`
  when the nav has no dash container (Start).
* `stack`: `{ top, gap, center }` from the `left:24 right:24 flex-column` div (136/140/451;
  14/18/20).
* `kind`: `'text'` (60px/18px field with caret div), `'wheel'` (Age: the `top:236` column),
  `'list'` (58px/18px rows), `'chips'` (48px/24px in a `flex-wrap:wrap` parent),
  `'statement'` (centred stack at 451).
* `title` (26px div text), `sub` (15px/22px `#9B968E`), `spacer` (the bare `height:10|18px`
  div), `body` (15px/24px `#B5B0A8` centred p), `card` (runs: text nodes + `font-weight:700`
  spans → `{text, bold}` list), `placeholder` (field span), `wheel` (values + selected index,
  for reference), `options` (labels, plus `drawnSelected` indices for recipes/tests only — never
  used at runtime), `hero` (`{ spot: '<Lesson-Illustrations-v4 name>' | kids, top, scale }` —
  match by subtree identity as `heromatch.mjs` does), `cta` (primary span text or `null`).
* Drop: `field` (gradient/sun), `backTop`, `art`, `mark`, `rowTops`, `fine`, `note2` shape,
  size/tracking/inset per copy (now constants of the template).
* `FUNNEL_GLYPHS`: no source in the new frames. Until the tail group drops it (§10), emit it as
  a frozen legacy block copied verbatim from the current file (with a comment saying so).
* Fail loudly if any of the 22 frames yields no title or (for list/chips) no options.

---

## 7. App states in this area that no frame draws (need the new look)

### 7.1 Launch / boot
* **`WaterlineScene`** (`/` when boot is still unresolved after 900 ms; unreachable in mock —
  D131): restyle to ground+noise; closest analog **Enlisting Aegis** (tail): the 88px ring
  (`r38` dotted track `stroke-width 2, dasharray "2 7"` + `M44 6 A38 38 0 0 1 82 44` arc stroke 4,
  `#F2F0EC`) — or simply the new Splash. Keep the label/animation logic.
* Login with **Back** (pushed from All, or Name's back via `router.back()`): kit nav chevron.

### 7.2 Auth inner boards (D047 boards — no frame in this drop either)
Closest analog for all of them: **V3 Q24 Name** (nav chevron, left h1 26/700 at stack 136, sub
15/22 `#9B968E`, 60/18 `#1E1E1E` field with 17px text and `#9B968E` placeholder, primary pill
58/29 at bottom 48) — or the **Login** stack (centred laurel/h1/p) where the board is a door.
* `welcome-back` **address step** (laurel, "Sign in to keep building toward the life you want",
  email field with clear-✕, "Let's Go"): Login header (laurel 104 + centred copy) + Name field +
  primary. Keep autofocus, email keyboard, clear button, validation message.
* `welcome-back` **password** ("Welcome back.", Email + Password fields, Sign in) and **verify**
  ("Check your email.", code field, Verify & continue, Resend code): Name template; labels above
  fields → sub style 15/22 `#9B968E`; "Resend code" → kit `ghost` (15/400 `#9B968E`, centred).
* `sign-up` **gate** ("Save your progress.", laurel 88, three 56/28 buttons, legal line):
  Login template (58/29 pills, same Apple/Google/email treatment).
* `sign-up` **form** ("Start where you are.", first-name + email (+ password) fields, "I'd like
  VICI updates via email." checkbox, info card with "Use password instead" toggle link, "Create
  Account", legal): Name template; checkbox → 26px circle like Enlisting-Aegis rows (`#F2F0EC`
  fill + 13px `#111111` check when on; `#1E1E1E` + `0 0 0 1.5px #2E2E2E` when off); info card →
  GC card (`#1E1E1E`, r18, padding 18/22, 15/23 `#B5B0A8`, link run 700 `#F2F0EC`).
* `sign-up` **verify**: as welcome-back verify.
* `AuthLegal` ("By continuing, you agree to our terms of service and privacy policy.") → the
  Login caption style (12/700 ls 0.4 `#9B968E`, centred), underlines kept.
* `AuthMessage` error/notice — see open questions (colour).
* Disabled/loading button states (`opacity 0.38`, "Signing in…", "Creating account…", "Checking…").

### 7.3 Funnel
* **Under-18 gate** (`O3AgeGate`, shown in place of the funnel after Age < 18; Back is the only
  control): closest analog — Age frame chrome (nav, 1 dash) + statement copy styles; either the
  question template (left h1 at 136 + p 15/24 `#B5B0A8`) or the statement stack at 451 with no
  hero. Keep copy ("This one is for over-18s." / "Come back when you are…") — no frame supplies it.
* Name with a typed value; Age mid-drag / at range ends.
* Multi-select with nothing chosen → primary disabled (not drawn).
* Single-select "picked" flash (selected fill shown for 260 ms before advancing) — this IS the
  frame's selected state; keep.
* What-it-affects at 3 picks (4th refused, no visual); zero picks allowed after "Not really".
* Exclusive answers clearing the others (12, 14, 22).
* Goal Confirmation's other readings (3 other goals; with/without card).
* Start/GC with the real name or no name.
* The **'reading'** step (Campaign map, `O3Reading` in v3.tsx, between want-back and the letter)
  — its frames (`Campaign Map I–III`) are **withdrawn** in this drop (FLOW goes 34 → 38). Tail
  group/orchestrator decides: drop it from `STEPS` or restyle. It still renders through
  `O3Shell` with `paper:'map'`.

---

## 8. Recipe / drive changes the next phase needs (`.overhaul/recipes/funnel.json`, `.overhaul/drives/funnel-walk.js`)

* Walk step 04 Age: `typeIn(0,'24')` no longer works → just `t('Continue')` (wheel defaults to 24).
* Walk step 05 Gender: `t('Male')` alone (auto-advances; there is no Continue).
* `__AFTER` per frame to match the drawn selection: Q3 `t('Yes, several times')`; Q3b
  `t('A few days')`; Q5 `t('Late at night'); t('When I can’t sleep'); t('When I’m home alone');
  t('While scrolling')`; Q6 add `t('Tired')`; Q7 `t('In bed')` only; What starts it
  `t('I start scrolling'); t('I can’t sleep')`; Q21 `t('Quite a bit')`; What it affects
  `t('Focus'); t('Sleep'); t('Confidence')`; Q13 `t('A few days a week')`; Q16
  `t('Keep it, just without porn')`; Q17 `t('Blocking sites or apps'); t('Going cold turkey')`.
  Age: no AFTER (24 is the default). Gender `t('Male')` (with the 260 ms timer neutralised, as
  the other single-selects).
* Under-18 recipe: needs a way to set 15 on the wheel (e.g. tap the "23" neighbour 9× if
  neighbour-tap is implemented, or an accessibility decrement action).
* Auth recipes unchanged in route; the Login capture no longer has washes, so the 2400 ms wait
  is only for the laurel decode.

---

## 9. Mobile sizes (375×667 short inset 20, 390×844, 430×932)

The frames are absolutely positioned for 852. On **375×667** (content area 647 under a 20 inset):
* Question screens: primary top = 667−106 = 561. Q5 chips end at canvas 628 → app 594 (+20 inset)
  and Q17 at 655 → **chips run under the primary**; narrower width (327 vs 345) also wraps more
  chips. Bottom-anchored heroes (box bottom 106 or 30 above the edge) land on the options
  (Q3b options end ~585 on 667). → Recommend: nav fixed; stack inside a ScrollView with
  `paddingBottom` clearing the primary; hero placed at `max(T−54, stackBottom + gap)` (exact at
  852, never overlapping), or hidden when it would intersect — open question.
* Statement screens: GC with card ends at 606 > 561 → needs the same scroll treatment.
* Login/Welcome Back: buttons end at 672−34 = 638 while the bottom-anchored footer/caption sit at
  541/588 → overlap. (The current app top-anchors them at 686/764 and pushes them off-screen on
  667 instead.) → Recommend a ScrollView whose content is `max(window, 798)` tall with the footer
  bottom-anchored inside it.
* Splash: %-of-frame positions scale fine.
* 430 wide: centre everything absolutely placed by `left:50%` + negative margin (laurels, heroes);
  stacks are inset 24 so they widen — chip wrapping changes, which is correct behaviour.

---

## 10. Shared files / conflicts

* `src/content/onboardingFunnel.ts` (generated) — **tail group**: `plan.tsx` imports
  `FUNNEL_GLYPHS` (PlanGlyph and `planSignals()` whitelist). Keep the export until tail removes it.
* `src/app/(onboarding)/welcome.tsx` — owns the whole onboarding STEPS list (tail + paywall +
  handover groups render inside it); my edits: `O3Shell` props (dashes instead of `progress`/
  `backTop`), gate shell, `chrome` computation (`FUNNEL_STEPS[..].backTop` goes away). Tail
  group edits the plan/tail half. Coordinate.
* `src/components/onboarding/v3.tsx` — funnel engine (mine) but also exports `O3Reading`,
  `O3Shell` (used for 'reading' and the age gate), `buildWeekXiiLetter`, `windowFor` (tail/
  handover/reminders read these). Suggest splitting: funnel engine → new file; leave the tail
  exports in place.
* `src/app/(onboarding)/_layout.tsx` — `StatusBar style="dark"` (dark glyphs) contradicts its own
  comment and the all-dark design → `"light"`; `contentStyle` `colors.night.bottom` already maps
  to `#0D0D0D`. Shared with tail.
* `src/components/ui/Waterline.tsx` (SplashScene/WaterlineScene) — only auth/boot use it.
* `src/components/auth/kit.tsx`, `src/app/(auth)/*.tsx` — auth only.
* Orchestrator-owned: `src/components/mono/*` (needed primitives, §11), `src/lib/theme.ts`
  (already has `mono`; no change needed), `src/app/_layout.tsx` (Lato already loaded).
* `app.json` native splash already `#0D0D0D` (no change needed).
* A spot-illustration library (§4) is wanted by many groups — orchestrator should own it.

## 11. Kit components this group needs (src/components/mono)

`MonoGround` (ground + noise.png 0.05 tile) · `MonoNav` (back chevron 12×20, optional 8-dash
progress with an active count, right slot) · `MonoH1` (26/700/-0.6/33, balance on web, `center`)
· `MonoP` (15/400/24 `#B5B0A8`, pretty; variant 15/22 `#9B968E` for subs) · `MonoStack`
(absolute inset-24 column with top/gap/center) · `MonoPrimary` (58/29 bottom 48, 16/700 ls 0.1,
disabled style TBD) · `MonoOption` (58/18 row, 15/400, selected fill, frame's 0.04 shadow) ·
`MonoChip` (48/24, 13px check) · `MonoField` (60/18 `#1E1E1E`, caret bar 2×24, 17px,
placeholder `#9B968E`) · `MonoPill` (auth: 58/29 solid or card+1.5 ring, icon gap 10, 17/700) ·
`MonoOrRule` · `MonoCard` (r18 `#1E1E1E`, padding 18/22, 15/23, rich runs) · `SpotArt`
(393×240 hero with top/scale → G transform) · white `Laurel` image (contentFit fill, tint #FFF).
Bespoke to this group: `AgeWheel`.

## 12. Questionnaire logic that must survive (`.vicifull/QUESTIONNAIRE-CHANGES.txt` §5 + app)

1. 04 Age < 18 → leave the adult flow (gate board, Back returns to Age).
2. 07–09B, 16, 18–21 single select, continue immediately (260 ms beat).
3. 09B only if 09A starts with "Yes".
4. 12 "Nothing in particular", 14 "Nothing obvious", 22 "Nothing yet" exclusive (`O3_EXCLUSIVE`).
5. 17 max three (`O3_MAX_PICKS`); zero allowed if 16 = "Not really".
6. 18 only with a loneliness signal: emotions ∋ Lonely, triggers ∋ "When I’m home alone", or
   before ∋ "I argue with someone or feel rejected" (`lonelySignal`).
7. 19 only with an alone signal: triggers ∋ home alone, emotions ∋ Lonely, lonely ∈ {Often,
   Most days} (`aloneSignal`).
8. 23 reads only 20/21 (`O3_GOAL_CONFIRM`, card only for "Keep it, just without porn").
9. Back on 03 Name leaves to `/sign-in` (`backToDoor`, D122) and `(auth)/_layout` keeps the door
   open while `onboardingComplete` is false.
10. `finish()` side effects unchanged (profile name, week-XII letter journal entry, life-map why/
    values, completeOnboarding, → `/routines/morning-time`).
(The doc's 04 line "We use this for the long-term projection later on." is **not drawn** by the
new frame — frame wins; the current app doesn't draw it either.)

## 13. Open questions / canvas ambiguities

1. **Age wheel range** — frame shows 22–26 around 24 only. Proposed 13–99 (must include <18 for
   the gate). Interaction model (drag vs tap) is not drawn.
2. **Short screens** (§9): scroll vs hide the hero vs both; Login footer placement on 667.
3. **Disabled primary** (multi, nothing chosen): no frame; keep current 0.26-opacity idea or
   allow continuing with zero (doc §11 permits zero for 11 · When)? Current app requires ≥1.
4. **Auth error colour**: theme's `danger #B5624F` is "destructive actions only"; the mono system
   has no red. Use `#B5B0A8`/`#F2F0EC` text? Not drawn.
5. **Kit vs frame**: kit `options` label 16px / no shadow; frames 15px / `0 1px 2px rgba(0,0,0,0.04)`
   — took the frames. Kit `nextFab` arrow stroke `#FFFFFF` on `#F2F0EC` (unused here). Kit
   `frame` noise `noise-dark.png` 0.06 vs frames `noise.png` 0.05 — took the frames.
6. **Stack top 140 vs 136** on Q5 / What starts it / Q17 only — looks like a designer leftover
   but it is what the frames draw; transcribed per frame.
7. **Gender lost its Continue** (auto-advance now) — confirmed by frame (no primary), flagged
   because it changes behaviour.
8. **'reading' / Campaign Map** step has no frame in this drop — remove or restyle (tail/orchestrator).
9. **WaterlineScene** — keep (restyled) or always show the new Splash.
10. **Hero ownership** — one shared `SpotArt` library vs per-generator embedding (§4).
