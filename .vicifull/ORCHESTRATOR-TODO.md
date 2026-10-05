# What the orchestrator must do after pass 2, before the final audit

Items here are either cross-cutting sweeps that no single group can finish, or things discovered
after the agents that would have owned them had already started reading `FINDINGS.md`.

## 1. `color-interpolation-filters="sRGB"` on every `FeGaussianBlur` (F43)

Discovered mid-pass-2, so the groups already running will not have seen it. Twelve files draw a
Gaussian; two declare the colour space. Add it to the other ten:

- [ ] `src/app/(app)/today.tsx`
- [ ] `src/app/drop.tsx`
- [ ] `src/app/letter.tsx`
- [ ] `src/app/score.tsx`
- [ ] `src/components/onboarding/art.tsx`
- [ ] `src/components/onboarding/handover.tsx`
- [ ] `src/components/onboarding/plan.tsx`
- [ ] `src/components/onboarding/tail.tsx`
- [ ] `src/components/onboarding/v3.tsx`
- [ ] `src/components/paywall/PaywallFlow.tsx`

Already correct: `src/components/day/kit.tsx`, `src/components/task/TaskScene.tsx`.
Re-measure a shadow on each after the change — the skew is about +2 R, +2 G, −3 B.

## 1c. Blur the radial washes too — D010's exemption is retired (F48 / D151)

164 of the 267 frames state a `filter: blur()`. Two shared helpers draw most of them: `Wash` in
`src/components/ui/Waterline.tsx` (8 call sites) and `Wash` in `src/components/auth/kit.tsx` (3).
Same three notes as D091: pad `userSpaceOnUse` 3σ, `color-interpolation-filters="sRGB"`, grow the
`<Svg>`. The onboarding, tail, day, sos and paywall fields keep their own copies — sweep those too.

## 1b. Blurred solids must use a real `FeGaussianBlur`, not the radial model (F44 / D091)

D082's premise was wrong — `react-native-svg` 15.15 ships `FeGaussianBlur` on web, iOS and Android.
`plan` measured 13,221 → 96 differing pixels on one frame by switching. Check every group that
closed an F26 finding the old way: `tail`, `weeks`, `slip`, `week-lessons`, ~~`sos`~~. Pad the `<Svg>`
and the `userSpaceOnUse` region by 3σ, and set `color-interpolation-filters="sRGB"`.

**`sos` is DONE** (D142): `BlurredSolid` in `src/components/urge/index.tsx` and `TwiceShadow` in
`src/app/relapse.tsx` now draw the canvas's own shape under `FeGaussianBlur`, `<Svg>` and filter
region both padded 3σ in `userSpaceOnUse`, with `color-interpolation-filters="sRGB"`. The warm
floor pool on `SOS Loc Private Room` went from Δ28/6/30 at the three verifier points to Δ0/0/0.
Covers the 40 blurred solids in `sosResponses.ts`, seven hand-written layers in the urge kit and
the two contact shadows on `Relapse Twice`.

## 2. ~~Re-run `stopcheck.mjs` and settle all 19 (F23)~~ — DONE

`node scripts/vicifull/stopcheck.mjs` now reports **1** of the original 19, and that one is correct:
`src/components/keepsakes/Medallion.tsx:394-397` deliberately **doubles** the stop at offset 0.4
(`#FFFFFF` at alpha 0, then `#000000` at alpha 0) so no interpolation crosses the transparent
point — CSS gets that discontinuity for free, SVG does not. That is D048's rule extended to a
transparent stop in the middle of a ramp, recorded as D104, and the checker's pairwise heuristic
cannot tell it from a defect. Leave it.

## 3. Confirm the opacity re-check happened (F37)

The transcriber was dropping the bare SVG `opacity` attribute on 16 frames, fixed mid-run. Groups
that reported those frames clean did so with a transcription that could not show it. Re-read
`V3 Q1` (14 occurrences), `Paywall` (13), `V3 Q10` / `V3 Q2` (4 each) and the rest against the
fixed `body.mjs`.

## 4. Housekeeping (F14, F16, F7)

- [ ] delete `scripts/vicifull/gen-dry.mjs` (my own dry-run copy)
- [ ] delete `.vicifull/wtmp/` (the weeks agent's measurement helpers)
- [ ] `src/components/ui/` — `SignaturePad` / `SignatureMark` and `UserSettings.signature` are dead
- [ ] `src/components/ChallengeSheet.tsx` — 115 dead lines
- [ ] `src/components/onboarding/v3.tsx` — 22 dead exported screens (~900 lines)
- [ ] head comments in `src/components/lesson/reader.tsx` and `src/app/lesson/day/[day].tsx` still
      say 1,398 pages; this drop authors 1,858
- [ ] renumber `specs/` to the canvas's own badges (F10) — `specs/03-welcome-back.md` is badge 02B
- [ ] repoint `scripts/vicifull/gen-reader-art.mjs` at `Lesson 1 Surviving the Night` (F39 — the
      output is byte-identical today, but the provenance is wrong)

## 5. Recipes for every frame (F27)

`node scripts/vicifull/audit.mjs` reports `NO RECIPE` per frame. Drive that count to zero, or to
frames explicitly marked `unreachable` with a reason. Watch the five pager pages that D065 was
blocking.

## 4b. Two things the rechecks found that must be fixed, not just recorded

**A regression the fix pass introduced (week-lessons).** D109 taught
`src/components/task/TaskScene.tsx` to draw all 232 inset shadows instead of only the spread-only
ones, but `{insets.map(...)}` at line ~755 paints them in written order, and **CSS paints a shadow
list first-on-top**. The one layer in either corpus with two insets —
`inset 0 0 0 6px #E9D2A4, inset 0 0 0 7.5px #E2BA78` at `src/content/lessonPlates.ts:13227` — now
draws the darker outer inset over the pale one that belongs above it. **Δ44/255 across the whole
ring band, 1,705 body pixels.** The same agent wrote that exact rule into D112 for the *outer*
shadow list and did not carry it to the inset list. Reverse the inset paint order.

**A second regression the fix pass introduced (paywall).** `src/components/routines/wheel.tsx` —
`settle()`'s early return (`if (target === landed && snapTo(target) === y) return;`) skips
`park()`, which is the only place `lead` is resynced. After any user scroll the column's leading
pad can be stale by 0.5pt, so **every row in that column paints half a point high** whenever the
new target's index parity differs from the last parked one. Measured live: AM at 336.5 instead of
337; hour `11` and `9` likewise. Introduced by the same change that fixed the static rounding.

**A "NOT A DEFECT" verdict the recheck disproved (settings).** The fix pass closed
`#197 Edit Profile`'s `Started VICI` row as D121 — "the two rows cannot both hold for any single
account". The recheck disproved it with a counterexample: `profile.tsx:59` derives the week as
`floor((now − createdAt)/7d)+1`, so **any date 35–41 days after 14 Mar 2026 satisfies both rows**.
It proved it by pinning the page clock to 19 Apr 2026 — the same instrument F47 used to settle the
Vow's date line. D121 needs withdrawing and the row needs seeding, not excusing.

**A pass-1 "known equivalence" that is actually a transcription miss.** The chosen pick row's
0.5pt dot feather, **75 boards**, Δ106 on the rim, at `src/components/lesson/reader.tsx:238`. The
pass-1 verifier waved it through and never decided it. It is not a platform limit.

## 5b. Typecheck fallout to clear at the end

Two known type errors were open while agents were mid-edit; re-check both after pass 2:

- `src/app/drop.tsx:442` — a CSS `filter` string in an `ImageStyle`.
- `src/components/lesson/coverL1.tsx:49,103` — `colorInterpolationFilters` written as a bare prop.
  `react-native-svg`'s `FilterProps` does not declare it; the file's own idiom (and
  `day/kit.tsx:98`, `task/TaskScene.tsx:454`) is
  `{...({ colorInterpolationFilters: 'sRGB' } as object)}`. Two of the four in that file already
  use it. Apply the same to the other two when nobody is editing the file.

## 6. The final audit and the report

- [ ] `node scripts/vicifull/audit.mjs` over all 267 frames
- [ ] `node scripts/vicifull/copy-sweep.mjs Email-Login --missing` (baseline 508 → 244 at last run)
- [ ] `npx tsc --noEmit`, `npx expo lint` against the 22-error baseline (D012)
- [ ] REPORT.md: what matched, what deliberately does not (F5, F6, F32, F42, D094–D096), what is
      still open, and the two decisions that are the user's rather than mine (F15 crisis support,
      and anything else where the canvas removes an affordance)

## 7. Things that are the user's call, to surface at the top of the report

- **F15** — following the canvas removes the last tap-reachable route to crisis support. The canvas
  draws no support entry on any of its 267 frames. `/lifemap` is in the same position.
- **F25** — the paywall that ships with a RevenueCat key was the previous drop's design. Fixed in
  pass 2, but it means the real purchase path needs a look on a real build, which this run cannot do.
- **F30** — the Convex mutation fix is unverified against a real backend for the same reason.

## 8. Device QA — now possible, and not yet done

The dev build works: `com.tideline.vici` compiles, installs and runs on the iPhone 17 Pro
simulator against a bundler on 8081 (`EXPO_PUBLIC_FORCE_MOCK=1 npx expo start --dev-client
--port 8081`, then `xcrun simctl openurl <udid> "tideline://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081"`).
Two gotchas that cost an hour: `expo run:ios` invokes CocoaPods **without a UTF-8 locale** and dies
(`LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8` fixes it), and its final "activate the Simulator window"
step fails via osascript **after a successful build** — the app is installed, just launch it.

**Every measurement in this run was the web build.** Verified on device so far: the auth door
renders correctly, both washes and the laurel halo paint, and the F50 subtitle now wraps. Nothing
else has been looked at natively. Still to check, in rough order of how much of this run depends
on it:

- [ ] **`FeGaussianBlur` on iOS.** D063/D091/D113/D151 added filters in twelve files and the whole
      blurred-solid and wash-blur rework assumes they work. If they do not render on device, a
      large share of pass 2 is wrong there.
- [ ] **`RadialGradient` with `r`** (D064) — the web bug is well understood; confirm native agrees.
- [ ] **`Mask`** — the crescent moons and the medallion bites.
- [ ] **`resizeMode="repeat"`** for the grain (F31) on iOS.
- [ ] **The serif and script faces** — `Iowan Old Style` and `Snell Roundhand` by their iOS names.
- [ ] **Safe areas.** The mock web build forces `{top: 54}` so captures land on canvas
      coordinates; on device the inset is the phone's. The iPhone 17 Pro is **402 × 874**, not the
      canvas's 393 × 852, so every screen has 9 more points across and 22 more down. Bottom-anchored
      elements are fine by D026; check the ones that are not.
- [ ] **The SSO refusal message** (`kit.tsx`, the `AuthMessage` slot) — on device with the real
      string it runs to two lines and sits tight under the email row, close to the footer. The auth
      recheck called this latent; it is now observed. A three-line message would collide.
