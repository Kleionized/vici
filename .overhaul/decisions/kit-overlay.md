# kit-overlay decisions — Phase 0 Part B (D360–D369)

Files: `src/components/mono/Sheet.tsx`, `TimeWheel.tsx`, `Field.tsx`, `PledgeCard.tsx`, `Progress.tsx`,
`lab/overlay.tsx`. Evidence: the replicas below (`/kit-lab?f=<key>`), captured at 393×852 and diffed with
`scripts/overhaul/pxdiff.mjs` against `.overhaul/shots/design/Email-Login/<Frame>.png`; strips kept at
`.overhaul/shots/lab/ov-<key>.strip.png` (`@` → `_`), size sweeps at `.overhaul/shots/lab/sz/`.

Second pass (after the independent verification): the wheel is fully controlled and drags through
native gesture handlers (D362); the sheet's modal flag moved to the layer (D360); the keyboard lift
leaves the field clear on a 667 phone (D361); `TextField` composes a caller's `onContentSizeChange` and
gains `multiline` / `accessory` (D364); the `quote`-light and `plain` PledgeCard replicas are back under
suffixed keys, plus a `modal` sheet replica (D367); the hero boards drop their art on short screens (D368).

## D360 — `Sheet` is an in-tree overlay with frame-level buttons
The four sheet frames draw the whole screen underneath, a `rgba(0,0,0,0.68)` scrim over everything
(status-bar band included, z 40), the `#171717` `28 28 0 0` panel (z 41) with the 40×4 `#2E2E2E` grabber at
10 and its content column at `left 24 right 24 top 44`, and the buttons **outside** the panel at z 42,
anchored to the screen bottom. So `Sheet` renders as the last child of `Screen` (canvas coordinates), its
scrim starting at `-canvasTop` (the window's top), and takes the buttons as `footer` in canvas coordinates
(`<PrimaryButton sheet bottom={96} />`, `<GhostLink zIndex={42} />`). `modal` renders the same layer in a
transparent RN `Modal` (statusBarTranslucent, navigationBarTranslucent) for a sheet that must also cover
navigator chrome — e.g. D333's Score "Months" sheet over the tab bar; replica `Sheet-Sign-Out@modal` diffs
0.00 %, and its scrim tap closes it (real mouse, hit-tested).
Dismissal = `onClose`: scrim tap (`Dismiss`), Android back (BackHandler), Escape on web, a downward drag
on the panel past 96 pt or faster than 0.9 pt/ms (shorter drags spring back — a 40 pt drag returns the
photo panel to 512, a 130 pt drag closes it). Without `onClose` only the sheet's own buttons close it.
The panel drag's `onResponderGrant` returns `true` (blocks the native responder, so an Android scroll
view under the finger cannot intercept it). Motion: open 300 ms out-cubic, close 220 ms in-cubic then
unmount; Reduce Motion makes both instant. Closing a sheet dismisses its keyboard.
**Accessibility:** `accessibilityViewIsModal` + `aria-modal` + `role="dialog"` sit on the **layer** that
holds scrim, panel and footer — not on the panel. VoiceOver hides a modal view's siblings, and the
frame-level buttons are the panel's siblings, so on the panel the flag hid Save / Sign out / Sign the new
pledge / Keep current pledge / Stay signed in / Cancel from VoiceOver. The layer is `collapsable={false}`
so Fabric cannot flatten the flag away. In `modal` mode the RN `Modal` is already the dialog (its own
window natively, `role="dialog"` on web), so the layer does not repeat it — one dialog either way
(checked: the dialog element contains Dismiss and every footer button).
**Web `box-none`:** an inline `style.pointerEvents: 'box-none'` is written as CSS, where `box-none` is not
a value — the full-window footer layer then swallowed every tap meant for the scrim. The layer uses a
`StyleSheet`-registered box-none; the Reanimated footer (whose web view flattens styles inline) keeps the
`pointerEvents` prop, which costs one RN-web deprecation notice.

## D361 — A sheet keeps its drawn height, not its drawn top; the keyboard lifts it
`top` is the frame's panel top at 852 (`SHEET_TOP` = pledge 120, name 420, photo 512, signOut 556). Off 852
the panel stays **bottom-anchored at height 852 − T** (like the buttons it carries), clamped so it never
climbs past canvas 60. Without this, Sign Out on a 667 phone would put its own pill above the panel's top.
Checked at 375×667 and 430×932.
Keyboard (settings R3, today-day R6): the footer rides the keyboard **less 32** (`KEYBOARD_GIVE`): the
buttons' 48 off the screen edge exists to clear the home indicator, which the keyboard covers, so over
the keyboard it becomes 16. The panel rises by `min(lift, panelTop − 60)`; a native-only `#171717`
underlay fills what a lifted panel leaves below its edge. Computed for Change Pledge on 375×667 with a
260 keyboard: the full-keyboard lift put the pill (window 253–311) 18 pt into the 100-tall field
(171–271); with the give the pill top is 285, 14 clear. At 852 (336 keyboard incl. the 34 inset) Edit
Name's pill sits 16 above the keyboard. Where Android resizes the window instead, the lift subtracts what
the resize absorbed. Web has no keyboard events, so captures see the drawn geometry. **Not verifiable on
the web build — check on a device.**

## D362 — `TimeWheel`: one strip per column, fully controlled, native gesture handlers
Replaces `src/components/routines/wheel.tsx` (not edited — its owners switch). Not a ScrollView: each
column is a window onto an unbounded strip (virtual row → `values[row mod n]`), so hours and minutes loop
with no copies and no re-centring jump, and every row sits at `88 + 44·k` — whole points, so FINDINGS §4b's
half-point `lead` bug has nothing to come from. The frame's three looks (30/900 ink · 22/400 mute ·
22/400 `#2E2E2E`) switch at the half-row mid-drag.
**Controlled like a text input.** `value` is the truth: after every settle (a `settles` counter re-runs
the check once the caller has answered) and on every value change, the strip is compared with `value` and
rolled to it by the shortest way round, without reporting back. So a caller that refuses a change (keeps
its state) or clamps it (slip.md §98C: never in the future) sees the column roll back to what it holds. A
value arriving from outside while the strip is still or settling after the finger lifted wins (the
settle is stopped and does not report); one arriving while a finger holds the column becomes the
reference the drag's step is counted from, so the release reports relative to it — wheel and state end
equal either way. Steps are built on `value` as the caller holds it (the old `latest` ref, which kept a
refused value, is gone). Callers must answer inside `onChange`; a value that only arrives later rolls the
wheel back and then forward.
**Gestures:** `react-native-gesture-handler` `Gesture.Pan().runOnJS(true)` with `activeOffsetY ±4` and
`failOffsetX ±10`. JS responder props could not keep a parent ScrollView from taking the touch: Android's
ScrollView intercepts unless the native responder is blocked, and iOS Fabric ignores
`blockNativeResponder` entirely — `RCTMountingManager setIsJSResponder` drops it, and the scroll view only
stands down when an *ancestor* is the JS responder (`RCTScrollViewComponentView
_shouldDisableScrollInteraction`). An RN ScrollView's vertical scroll bounces even when its content fits
(`alwaysBounceVertical` defaults true), so the problem existed at 852 too, wherever a wheel sits in a
`ScrollRegion`. With native handlers the first to activate wins, and 4 pt is under Android's 8 dp slop
and UIKit's scroll pan. Release projects `velocity·180 ms`, ignoring velocity if the finger stood still
for 90 ms (the web tracker keeps its last speed through a pause — a 250 ms pause produced a 2-row throw
before this). Settles take 160–520 ms out-cubic; the meridiem rubber-bands at a third past its ends.
**Tap a row above/below the band to step to it**; rows stay `Pressable`s labelled `Hour 10`,
`Minute 59`, `AM or PM PM` for drives and screen readers; a touch that became a drag never also presses
(guard, for the web build where a mouse drag still ends in a click). The gesture builder is wrapped in a
scoped `eslint-disable react-hooks/refs, react-hooks/purity`: RNGH only stores the callbacks, which the
compiler's rules cannot see.
`onChange(next, { column, delta })` fires once a column settles; `delta` is for callers that shift a
timestamp. Columns do not carry into each other (59 → 00 leaves the hour). `minuteStep` thins the minute
column; an off-step minute shows as the step at or below it (58 → 55 at step 5 — the old rounding showed
the next hour's 00) and nothing is reported until that column moves: hold minutes on the step. At rest a
column mounts exactly its five rows (drives' `scrollBy` must never find a wheel). Each column is
`adjustable` with increment/decrement and `aria-valuetext`. Helpers: `wheelToMinutes` / `wheelFromMinutes`.
Checked with real mouse input on `_Wheel-Controlled` (a caller clamping at now = 11:40 PM, plus an outside
preset): tap/drag/clamp/refuse/preset-at-rest/preset-mid-settle/preset-while-held all leave
`aria-valuetext` equal to the caller's state; slow 220 pt drags step exactly 5; a 100 pt flick steps 4; a
20 pt drag starting on a neighbour row steps nothing. **Device check still needed:** the iOS/Android
arbitration against a real parent ScrollView.

## D363 — `DayToggles`: Sunday-first, `value: number[]` (0 = Sunday)
As `routines/kit.tsx` stores days. On = ink disc + `#111111` 14/700 (every frame); off = `#1E1E1E` + ink
letter (D322). Checkbox role, day names as labels, state as `aria-checked` (RN-web did not render
`accessibilityState`; now `Monday=false` after a tap, the rest `true`).

## D364 — `TextField`: a real input everywhere; only `name` keeps a drawn bar
Variants `name` (V3 Q24: 60 r18, padding 0 22, 17/400), `sheet` (Sheet Edit Name: 60 r18, padding 0 20,
18/700), `card` (Change Pledge: min 100 r20, padding 20 22, 20/700/29, grows), `note` (SOS Afterward:
min 150 r22, padding 22 24, 20/400/30, grows), `bare` (Night 3 Reflection: 22/400/34, grows). Placeholder
`#9B968E`, value ink, caret ink (`selectionColor`/`cursorColor`, web `caretColor`), dark keyboard, no web
focus ring. The frames' caret bars are a static frame's stand-in for focus (CRITIC C9): the platform caret
replaces them, so **each typed-state replica's only residual is the drawn 2×22 caret** (Change Pledge
0.01 %, Edit Name 0.01 %, Reflection 0.02 %, Afterward 0.01 %). `name` is the exception (the app's
`onboarding/v3.tsx` precedent): its frame draws the bar *before* the placeholder, so the bar is part of the
layout — shown while focused and empty, keeping its 2-pt slot once typed so the text stays at x 50.
Growing fields size from `onContentSizeChange`; a caller's own `onContentSizeChange` now runs after the
growth instead of replacing it. For the unframed screens (routes.md §4.4 Life Map, OQ-R9): `multiline`
grows a one-line variant from 60 tall with its first line where the single line sat (`sheet` grown:
padding (60 − 22)/2, two lines → 82), and `accessory` puts a control at the box's right (the 48 "+" disc).
Checked on `_Field-Grown`. On web RN-web reports `scrollHeight`, so a field grows but does not shrink back
after deleting lines (native shrinks).

## D365 — `PledgeCard`: three settings, the signature rule as the frame draws it
`sign` (Morning Resign / Signed, Slip Pledge, Relapse Resign), `quote` light (Your Vow Page) / dark (Urge
Hub Pledges), `plain` (Today Home III; `children` follow in its gap-10 column). The signature line is the
box's own bottom border: on web a CSS border, which Chrome dashes and snaps exactly as it did the frame's
(the 1.5 rule renders 1 pt, 60 dashes of 3 on / 2 off fitted to 297); native cannot dash one side, so there
the dashed rule is an SVG line `3 2`. The signed name has **no `numberOfLines`** — its overflow clip shaved
the italic's overhang. Every variant now has a kept replica: `quote` light is `Your-Vow-Page@overlay`
(whole frame, 0.00 %), `plain` is `Today-Home-III@overlay` (the pledge block 405–565 with the frame's
three 42 rings as children, 0.00 % with `--ignore=0,0,393,405;0,565,393,287`).

## D366 — `Spinner` turns the whole mark; `StepList` uses the kit `CheckDisc`
The frame's spinner is static; the app rotates the 88 mark (1.2 s a turn, linear), still under Reduce
Motion or `spinning={false}` (the replica's pose). `StepList({ steps, current })`: before `current` done,
at it current, after it pending — 26 `CheckDisc` (Part A, glyph 13) + 16/700 ink or 16/400 mute.

## D367 — Replica keys
`Change-Pledge-Sheet`, `Sheet-Edit-Name`, `Sheet-Sign-Out`, `Sheet-Sign-Out@modal`, `Sheet-Profile-Photo`
(backdrops as plain boxes; the photo sheet's rows are Part A's `RowGroup`/`Row`), `Morning-Check-in-Time`,
`Nightly-Check-in-Time`, `Lapse-When@overlay` (Part A keys `Lapse-When` itself — its replica now runs this
`TimeWheel` too, 0.00 %), `Morning-Resign-Pledge`, `Morning-Pledge-Signed`, `Slip-Pledge`,
`Urge-Hub-Pledges` (Part D's `PagerDots`), `Your-Vow-Page@overlay`, `Today-Home-III@overlay` (partial —
ignore string above), `Enlisting-Aegis`, `V3-Q24-Name`, `Night-3-Reflection`, `SOS-Afterward` (heroes from
Part C's `Hero`). Not frames: `_Wheel-Controlled` (D362), `_Field-Grown` (D364). Sheet replicas hold real
`open` state, so dismissal can be driven. No recipe entries were written: a kit-lab route in
`.overhaul/recipes/*.json` would replace the real screen's recipe for the same frame label.

## D368 — Short screens in the replicas (D320 rule 1)
The pledge boards (`Morning-Resign-Pledge`, `Morning-Pledge-Signed`, `Slip-Pledge`) and the question
boards (`V3-Q24-Name`, `Night-3-Reflection`, `SOS-Afterward`) leave their hero out when its art bottom
(`heroArtBottom`) would pass the highest control's top — at 375×667 the pen ran across "Confirm" and
"Change the pledge". Every one clears its controls at 852 and 932, so the frames are unchanged.
`Your-Vow-Page@overlay` follows `HeroBoard`'s rule (flag and stack rise together within the flag's room
above 108; past it the flag goes and the stack rises alone). The check-in-time replicas still run their
day toggles under the pill at 375×667 on the web build only: they sit in the core `ScrollRegion`, which
does not scroll on web (reported to the orchestrator).

Results at 393×852 (pxdiff, chrome excluded): every replica 0.00 % except the four typed fields' drawn
caret (0.01–0.02 %, one 4×28 region each — D364).
