# paywall-reminders decisions — Vici Overhaul run, Phase 1 (D220–D229)

Files: `src/components/onboarding/reminders.tsx`, `src/components/paywall/{PaywallFlow,OfferingPaywall,RevenueCatPaywall}.tsx`,
`src/app/{paywall,subscription,reminders,notify-primer}.tsx`, `src/app/routines/{morning-time,night-time}.tsx`,
`src/components/routines/kit.tsx` (`wheel.tsx` deleted), `src/lib/routines.ts`. Recipes:
`.overhaul/recipes/paywall-reminders.json` (replaces `paywall.json`). Controls: `node .overhaul/pr-func.mjs` (42 checks, all pass).
Sizes: `.overhaul/pr-sizes.sh <board>`.

## D220 — Paywall's way out (D323) and the Restore it displaces
The ✕ is the kit `CloseX` in the nav's right slot (svg at 353,71 — where Paywall Rescue draws its own, so the ✕
does not move between the two boards). Its label stays the old one: "Close" on `/paywall`, "Skip" inside the funnel
(the funnel drives tap it by that name). The frame's top-right "Restore" (316,70) sat in that slot, so it goes; the
footer's "Restore" becomes the control. The footer is drawn as **one** text run and an identical run in transparent
ink lies over it, whose "Restore" span is the `link`: splitting the visible run into spans re-kerned the centred line
(43 px at 152–172,788), and a nested `Text` with `accessibilityRole="button"` renders a `<button>` on RN-web whose UA
styles moved it further. Transparent ink, not `opacity: 0` (iOS drops alpha-0 views from VoiceOver); the painted run is
hidden from assistive tech. "Terms" has no destination in the app and stays words. Residual vs the frame: the 56×16
region at 316,72 (Restore → ✕), by design.

## D221 — A run is one string
`{price} on {renews}` (three JSX children → three DOM text nodes) re-kerned "$39.99 on 10 Jul 2027" by a fraction of a
point (111 px over threshold); `` {`${price} on ${renews}`} `` is exact. Every dynamic run in these files is a single
template string; the only nested runs are the price's inline cycle span (the frame's own `<span>`) and the footer
link's hit layer.

## D222 — Subscription states the frame does not draw
The frame draws a renewing yearly membership: "$39.99 a year. Renews 10 Jul 2027". The other states keep the app's own
words inside that sentence (CRITIC G12, D328): monthly `$12.99 a month. Renews …`; cancelled-but-active `… Runs until
…` (the old "runs until"); lifetime `$X · billed once` (unchanged); free `Free tools` / `Core tools included` and a
"Free" pill in the same `badge` kind, Change plan's value "Free", no next charge, no cancel line (as before). The
Change plan value is the plan name only ("Yearly"), as drawn — the old `Yearly · $39.99` detail is gone.

## D223 — OfferingPaywall on the frame's board, any number of packages
It renders `PwBoard` (the frame's chrome, words and discs) with one `PwPlanCard` per package: two packages are the
frame exactly; one takes the full width; three or more wrap two to a row with a 24 row gap so the "Save" tab (−12
overhang) clears the card above; an odd last card takes its row; the band scrolls (verified with a throwaway harness,
`.overhaul/shots/pr/m-offering.png`). Per package: name → title; tagline = dashboard badge ?? "Best value" on the best
?? intro offer ?? "Cancel anytime" (a lifetime takes the store's description — nothing to cancel); bottom line =
`${perMonth} a month` (non-monthly), "Billed monthly" (monthly), else the store's description; "Save NN%" (title case)
on the best card. Metadata: `eyebrow` now replaces the lockup words (default "VICI Unlimited"); `benefits` (exactly 4)
are read with any `\n` folded to a space, since the new discs break nowhere by hand. Loading = mono `LoadingView` with a
✕ (was a paper `ActivityIndicator`). Not reachable in the mock build (no packages offline → `PaywallFlow`), so only the
layout was captured. `savingBadge`/`savingFor` now say "Save 74%".

## D224 — The drawn pay sheet is the kit sheet
No frame draws it; it stands in, offline only, for the store's purchase sheet. It was a light imitation of Apple's in
the system face with a blue side-button cue — a bare `System` family and hues the system no longer has. It is now the
kit `Sheet` (scrim, `#171717` panel, grabber, frame-level buttons): the Apple glyph + "Pay" as an `h1Sheet`, a
`RowGroup` of App / Trial / Account / Payment / Billing / Due today, the note line in 14/20 mute, the primary "Confirm
with Side Button" (the string the drives tap) and a "Cancel" ghost; the scrim and a downward drag cancel too. Panel top
is computed from its rows so the content ends 24 above the pill (229 with the trial row, 284 without).

## D225 — `/reminders` and `/notify-primer` are Reminders Setup's board
Both show the same two notifications the frame draws, so both render `ReminderBoard` (bell at 90, words at 320, notes,
pill) with their own nav and words. `/reminders`: kit back chevron, "Two reminders a day." / "Timed to your risky
window…" (D328), pill alone at bottom 48 (it has Back; no "Not now" added). `/notify-primer`: its ✕ and its progress
(the old 9-segment strip with 8 filled → kit `NavDashes` step 8 of 9), the same words, "Not now"; the notes take the
frame's words — the "10:41 PM" / "wave tool" pair it still carried was retired by D099 — and the "Discreet by default."
promise follows the notes in 14/20 mute with the lock glyph dropped (no frame draws a lock, CRITIC C7). To keep that
line clear of the pill at 852 the primer takes 18 from the space above the notes (`notesGap` 24). Behaviour unchanged
(primer: all three controls close; `/reminders`: writes `morningCheckin`/`riskTimeSupport`, goes back).

## D226 — Short phones, board by board (D320)
Paywall, Rescue, Confirmed, Manage Subscription, Reminders Setup (+ the two routes above) and the check-in-time boards
lay their stack **in flow** inside a `ScrollRegion` from the nav row's foot (100) to the controls, with the frame's
offsets as padding/margins — identical at 393×852, scrolling instead of meeting the pill at 375×667 (Paywall's discs,
Reminders' second note, Subscription's Billing group and the check-in days scroll; Rescue and Confirmed fit). The bell
scrolls with the words (it sits above them). Day 0 is a hero board: hero + both stacks rise together by the deficit
(44 at 375×667), never past the art's top at 108; past that the art is dropped. Checked at 375×667 and 430×932.

## D227 — Copy that changed with the frames
Rescue: CTA "Start free trial" (fixed); the title's day word through `numberWords` ("three"; a 7-day offer says
"seven", was "7"); rows keep `Day ${n−1}` / `Day ${n}` from the offer. Confirmed: `We’re in, Sam.` / `Let’s …` with
curly apostrophes (the "105 uses U+0027" note is obsolete), default `confirmLabel` "Begin" (was "Begin Day I"), the
charge date from `shortDate`, and "Jul 24 —" bound with no-break spaces so a wider phone never splits the date or
opens a line on the dash (no change at 393: the frame breaks before "Jul"). Reminders card 1 body `where’s` (U+2019).
Paywall: "VICI Unlimited", "Save 74%", taglines "Best value"/"Cancel anytime", new bottom line "Billed monthly", feature
labels without `\n`.

## D228 — `O3DayZero` takes the lesson either way
`welcome.tsx` (tail's) passes `lesson="Lesson 1 · Prepare for tonight"` from `lessonForDay(1)`; the card's two runs
are that string split at the middot. `number` / `title` props say the same thing directly, for when tail wants them.
No change to `welcome.tsx` was needed.

## D229 — The check-in time boards on the kit
`RoutineShell`/`RoutineBack`/`RoutineCTA`/`CheckinPicker` and `routines/wheel.tsx` are replaced by one
`CheckinTimeBoard` on `NavBar` + kit `TimeWheel` + `DayToggles` + `PrimaryButton` (the Phase 0 lab replica, 0.00 %);
`wheel.tsx` is deleted (its only importer was the old kit). `?from=settings` keeps its navigation (Save/Back → Settings)
but loses the "Settings" back word and the reassurance line — `Settings Check-in Time` is now byte-identical to
`Nightly Check-in Time`. The questions balance after "the" on web; native carries `\n` there (D332).
`DEFAULT_ROUTINES.morning` is 8:00 AM (D324) — Settings' Morning row reads it too. D120/D154's period/hour excuses are
obsolete: both frames draw a real two-row meridiem.

## Verification (393×852, Lato loaded, strips read)

| frame | route | pxdiff (t=24) | residual |
| --- | --- | --- | --- |
| Reminders Setup | `/welcome?step=reminders` | 0.00 % (0 px) | — |
| Paywall | `/paywall` | 0.11 % (1,312 px) | 316,72 56×16 — Restore → ✕ (D220/D323) |
| Day Zero | `/welcome?step=day-zero` | 0.00 % (0 px) | — |
| Paywall Rescue | `/paywall` + Close | 0.00 % (1 px) | — |
| Paywall Confirmed | `/paywall` + drive | 0.00 % (15 px) | two 4-pt spots on the 132 disc's antialiased rim (152,380 / 236,380) |
| Manage Subscription | `/subscription` | 0.00 % (0 px) | — |
| Morning Check-in Time | `/routines/morning-time` | 0.00 % (0 px) | — |
| Nightly Check-in Time | `/routines/night-time` | 0.00 % (0 px) | — |
| Settings Check-in Time | `/routines/night-time?from=settings` | 0.00 % (0 px) | — |
