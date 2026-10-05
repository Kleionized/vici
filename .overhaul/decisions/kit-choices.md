# kit-choices decisions — Vici Overhaul run, Phase 0 Part A (D350–D359)

Files: `src/components/mono/choices.tsx`, `rows.tsx`, `pills.tsx`, `cards.tsx`, `lab/choices.tsx`,
`lab/rows.tsx`. Replica record (route, ignore regions, result per replica):
`.overhaul/shots/kit-choices/replicas.json`. Captures and strips: `.overhaul/shots/kit-choices/`.

Exports — `choices.tsx`: `OptionList`, `Option`, `Grid2`, `Chips`, `Chip`, `WhenChips`, `DateRow`,
`Segmented`, `toggleChoice`, `OPTION_LIFT`, types `Choice`, `SelectProps`, `SegmentItem`. `rows.tsx`:
`RowGroup`, `Row`, `Toggle`, `ListRows`, `ListRow`, `RuledRows`, `RuledRow`, `SummaryCard` (= `DetailRows`),
`DetailRow`, `CheckRows`, `CheckRow`. `pills.tsx`: `Pill` (+ `PillKind`), `CheckinDisc`, `CheckDisc`.
`cards.tsx`: `Card` (+ `CardVariant`, `CardPadding`), `IconCard`.

## D350 — One controlled selection API for options, tiles and chips
`OptionList`, `Grid2` and `Chips` take `options` (a string, or `{key, label?, exclusive?, disabled?,
accessibilityLabel?}`) and either `value: K | null` + `onChange(key)` (single) or `multi` + `value: K[]` +
`onChange(keys)`, with `exclusive` (keys, or the per-option flag) and `max`. The rule is `toggleChoice()`,
lifted from the funnel's own `O3FunnelStep.pick` so stored answers do not change shape: tapping a chosen
answer removes it; an exclusive answer replaces everything and any other answer drops it; at `max` a further
pick is **refused** (not rotated in) and the picker calls **no** `onChange` — the funnel's `pick` returned
early, so a consumer's save/haptic/analytics must not fire on a no-op (verified in `States@choices`: three
taps, one refused, two calls); picks stay in **tap order** (the funnel's existing order — the SOS
pickers' "board = first selection in canvas order" is the consumer's sort, D324). Nothing advances on a pick
— the 260 ms turn-over stays with the screen. Verified by a 9-case node test of `toggleChoice` and by
tapping in the V3-Q5 lab (`In the morning` added, `Late at night` removed).

## D351 — Ruled lists: the kit row carries the canvas's content-box point
Every ruled list draws `border-top: 1px #2E2E2E` on rows 2+ and the canvas's rows are content-box, so a
ruled 54 row measures 55 (52 → 53, 58 → 59, 60 → 61; Settings' card is 54+55+55 = 164). RN boxes are
border-box, so each kit row takes `divider` and adds the point itself; `RowGroup`, `ListRows`, `RuledRows`,
`CheckRows` and `SummaryCard` hand `divider` to every child but the first (an explicit `divider` wins), and
`RuledRows` also hands down `height` (52 / 56 / 46). Children must be the kit's rows (they receive the props
by `cloneElement`); `false`/`null` children are skipped, and **Fragments are opened** first
(`{premium && (<><Row/><Row/></>)}` is ordinary settings code) with their keys prefixed, so rows inside
one are ruled and +1 like their siblings (verified in `States@choices`: rows at 289 / 344 / 399). A row with no `onPress` is a plain `View` — no
button role, no press scale; with `onPress` it is a `Tap`.

## D352 — Toggle: the frames' on state, D322's off state, and who is the control
On (the only drawn state, App Lock / Data & Privacy): track `#F2F0EC`, knob `#1E1E1E` at right 3. Off
(D322): track `#2E2E2E`, knob `#F2F0EC` at left 3. The knob slides 3 ↔ 23 and both fills cross-fade over
180 ms (Reanimated); the first render is already at the value, so captures never catch it mid-way. Inside a
`Row` (`toggle={{ value, onChange }}`) the **row** is the control — role `switch`, `aria-checked`, a tap
anywhere flips it (the app's applock/privacy rows already behaved so) and the `Toggle` only shows the
state; a standalone `Toggle` with `onChange` is its own switch. Checked in the App-Lock lab by switching
two rows off (`[role=switch]` fired — drive.js's `tap()` does not look at `switch`, same as before).

## D353 — Selection state goes to the DOM as `aria-*`, not `accessibilityState`
RN-web 0.21's `createDOMProps` reads `aria-checked` / `accessibilityChecked` and ignores
`accessibilityState` — measured: an `Option` built with `accessibilityState={{checked}}` rendered
`role=radio` with **no** `aria-checked`. The kit now passes `aria-checked` (options, tiles, chips, when
chips, row switches), `aria-selected` (segments) and `aria-disabled`; RN 0.85 reads the same props on
native. Roles: `radio` (single), `checkbox` (multi), `tablist`/`tab` (Segmented — as the Log register
already was), `switch` (toggle rows), `button` (pressable rows/pills/cards). Recipes can read the selection
with `[aria-checked=true]`.

## D354 — Pills: one `Pill` with `kind`; inline-flex is opt-in
`kind` = `range` (+ `dot`) · `badge` · `status` (+ `filled`) · `darkTag` · `place` · `lessonTag` ·
`outline` · `streak` · `delta` · `checkin` (+ `lead`, usually a `CheckinDisc` — tone dot, ringed icon, or
the done disc), each with design-system §7.17's box and its span's own `line-height: normal`. The canvas's
`display: inline-flex` hugs the words; RN has no inline boxes, and a default `alignSelf: 'flex-start'`
would break the frames' centred rows (Today's header aligns the streak pill and the avatar on their
centres), so **`inline` is a prop** for pills placed in a column. The paywall plan card's "Save 74%" tab
(h24 card + ink ring, 11/700 ls 1) is drawn once, on one screen — left to the paywall group, not a kind.
`DateRow` (§7.17's "date row": the When step's chosen-moment row + ground "Change" pill) lives in
`choices.tsx` with `WhenChips`, the step it belongs to. `WhenChips` **wraps** (gap 10 both ways): the three
chips need 326.6 of a 375 phone's 327, so at 360 or at a larger text size the last one drops to a second
line instead of running 14.6 past the gutter (checked at 360×780); at 393 it is one line, as drawn.
`streak` and `delta` draw their own glyph unless `lead` is passed (`lead={null}` draws none); `delta` takes
`down` for a falling score — the 10 up arrow turned 180°, today-day §5's "down-arrow mirror" (undrawn); a
zero delta is the screen's to hide.

## D355 — CheckDisc states and glyph sizes
`state` = `done` (ink + `#111111` check) · `inverse` (Paywall's selected radio: `#1E1E1E` + ink check) ·
`pending` (`#1E1E1E` + line ring) · `current` (`#1E1E1E` + ink ring + 8 ink dot) · `empty` (transparent +
line ring: Paywall's unselected radio). The check's size defaults to §7.23's table per disc (22→11, 24→12,
26→13, 28→12, 30→13, 32→13, 34→14, 36→14, 40→16, 52→20, 84→36, 96→34, 132→56; the inverse 22→12);
`glyph` overrides (Score Detail Ranks' 26→12). `CheckRow` draws `done` by default; `done={false}` (a negative:
"No urges logged") uses the **`empty`** disc — a bare 1.5 `#2E2E2E` ring, no check — exactly today-day OQ-M2's
recommendation for the undrawn row (the negatives keep their own copy).

## D356 — Summary card and long values
`SummaryCard` (= `DetailRows`) is shrink-to-fit per CRITIC C10: `alignSelf: 'center'`, `maxWidth: '100%'`,
label `flexShrink: 0`, value `flexShrink: 1` + right-aligned lh 22 — Lapse Done measures **326** and Urge
Log Done **249** wide, exactly the frames; `stretch` opts out. Per C11 only dynamic values may ellipsise:
`Row`/`ListRow` take `valueLines` (then the right cluster and the value may shrink); fixed copy never passes
it and nowrap is never `numberOfLines` (design-system §10.10).

## D357 — The 0.04 lift, cards, and what each variant pads
`lift` (`OPTION_LIFT`, `0 1px 2px rgba(0,0,0,0.04)`) is a prop on `OptionList`/`Option`/`Chips`/`Chip`
only, on the unselected state, as the V3 frames write it; `Grid2` never carries it (no frame does). `Card`
variants: `filled` r24 card pad 22 22 (pass the frame's own `padding` in CSS order — `[26,26,24]` Your Vow
Page …), `outline` r22 card + line ring pad 20 18 18, `selected` r22 ink pad 20 18 18, `tile` h150 r24
pad 18 column space-between; `overflow` is never clipped by the card. A `Card` with `onPress` is a `Tap` with
role **`button`** unless `accessibilityRole` says otherwise — `Tap` spreads its props over its own default, so
passing the caller's `undefined` through had erased the role (no `role` on web, nothing for VoiceOver, and
drive.js could not find it); measured after the fix: `role=button`, `tabindex=0`. `IconCard` is Your Plan's
row card (42 ink disc + 20 glyph, 16/700 title, 13/400 mute line).

## D358 — Lab keys: one replica per frame stem where this part can give it
`lab/index.ts` spreads the parts in order core → choices → rows → overlay → hero → tabbar → misc, so a later
part's key silently wins. **`Lapse-When`** is registered here, at the frame's own stem: the whole frame from
kit pieces — `WhenChips` + `DateRow` around kit-overlay's real `TimeWheel` (0.00 %). The overlay part keys its
chips-as-boxes check `Lapse-When@overlay` and its decisions (D367) say Part A owns the plain key; the earlier
`Lapse-When@choices` is gone. **`Log-Urges`** stays kit-chrome's (bar-only, spread later); this part's
`Log-Urges@choices` now draws kit-chrome's real `TabBar` too, so it is the whole frame at 0.00 % — the
orchestrator decides which replica keeps the stem. `V3-Q1` is registered here built from `OptionList`, and
**supersedes** the core lab's raw-row `V3-Q1` (same numbers, same 0.00 %). The three replicas whose frames
carry a hero now draw kit-hero's `Hero` (Checkin Emotions `windowNight` 506/0.954, Your Vow Page `flag` 104,
Morning 1 Yesterday `sunrise` 506), in the frame's paint order, so every required replica is a whole-frame
check. Extra checks are keyed `<Frame>@choices` so they never shadow anyone's; `States@choices` is not a frame
— it shows the undrawn states and drives `max`. The replicas are recorded in
`.overhaul/shots/kit-choices/replicas.json`, **not** in `.overhaul/recipes/` — `audit.mjs` keys recipes by frame
label across files in name order, so a `kit-choices.json` there would override `day.json`'s real `Checkin
Emotions` recipe with a lab route.

## D359 — The `→` in "+12 → 1,240" is a fallback glyph (orchestrator's call)
Lato 700 (the `@expo-google-fonts/lato` TTF — Google's v1 cut) has no U+2192 (checked in its cmap). The
canvas's stack `'Lato',-apple-system,system-ui,sans-serif` draws it from the system face; the app's
`fontFamily: 'Lato_700Bold'` has no fallback on web, so the browser's default face draws a thinner arrow
(the run is 85.1 wide against 84). It is the only residue on Morning 1 Yesterday (0.05 % of the whole frame, hero drawn).
Native iOS falls back to the system face already. Fix belongs to `theme.ts` (`sans()` on web: append
`, -apple-system, system-ui, sans-serif`) — requested, not made here.

## Verification (all at 393×852, Lato loaded, strips looked at)

Required replicas — whole-frame pxdiff, nothing ignored:

| key | pxdiff | residue |
| --- | --- | --- |
| V3-Q1, V3-Q5, Checkin-Emotions, Lapse-When, Settings, App-Lock, Manage-Subscription, Log-Urges@choices, Lapse-Done, Urge-Log-Done, Your-Vow-Page | **0.00 %** | — (heroes, wheel and tab bar drawn by the other parts' kit components) |
| Morning-1-Yesterday | 0.05 % | the `→` glyph only (280,232 32×12 · 312,232 16×12 · 328,232 12×12; D359); the sunrise is exact |

Extra checks: Slip-Logged@choices (C10's third case: card 24,431 345×241, rows 54/55/55/77, last value 158.5
wide at x 190.5 on two lines) 0.00 %; Your-Plan@choices (IconCard) 0.00 %; Paywall@choices (selected/outline
cards, inverse/empty radios, 34 discs) 0.00 % (laurel ignored); Today-Home@choices (streak, delta, two check-in
chips) 0.00 % (strip/chart/bar ignored); Urge-Overview@choices (range pill, 4-segment, 46 dot rows) 0.00 %;
Where-We-d-Start@choices (place pills) 0.02 % = sub-point glyph offsets in the screen's inline-bold paragraph
(y 664); region diffs 0.00 % for the 26 step discs (done/current/pending), dark tag, outline pill, range + dot,
lesson tag. Signature diffs: every remaining row is the D022 span→View+Text box or the explicit `lhNormal` line
height equal to the frame's `normal`. Size sweep 375×667 and 430×932 of every replica touched in the fix pass
(Lapse-When, Checkin-Emotions, Your-Vow-Page, Morning-1-Yesterday, Log-Urges@choices, Slip-Logged@choices),
plus Lapse-When at 360×780: no horizontal clipping or overflow from these components (the when-chips wrap at
360; the summary card fills 382 at 430 and re-wraps its last value); vertical collisions with bottom controls
at 667 are the screens' D320 work, not the kit's. Intermittent: Expo web's fast-refresh badge (a bolt at
8,800 44×44) appears in a capture taken while another agent's edit hot-reloads — re-shoot, it is not app
content (it hit one Log-Urges@choices capture in this pass).
