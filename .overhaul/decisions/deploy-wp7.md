# Deploy WP7 decisions: per-account phone state, offline boot, error boundaries, old kit, onboarding persistence (D490–D499)

Issues: D1, B10 (boot), B11 (the boundary; crash reporting needs an account), U3, D2. New files:
`src/lib/accountState.ts`, `src/lib/backend/bootRetry.ts`, `src/components/ErrorScreen.tsx`. Nothing in `convex/` changed
and there is no schema change. The onboarding draft and every flag below live on the phone, so the mock and Convex builds
behave the same. The only Convex-side behaviour that changed is when the client calls the existing `users:ensureUser`.

## D490 — The phone's state is kept per account, through one helper
Every product-state key that was stored under a fixed `tideline.*` name now goes through `src/lib/accountState.ts` and is
stored as `<name>:<userId>`, the shape the reminder switch and the Week XII flag already used. That covers the post-slip
letter (pending and kept), the medallion post (pending and delivered), the last weekly report seen, the Week XII
delivery, the check-in prompt clock, the check-in times and days, the SOS settings, the urge in progress, the
written-in affirmation prompt, and onboarding progress. The old names are kept as the bases, so nothing reads
differently except the suffix. Screens call `readAccountJSON` and `writeAccountJSON`, and the launch gate and onboarding
pass the account id they already hold.

The account comes from auth, through `useDeviceAccount()`. It is mounted as the first child inside the providers, so its
effect runs before any screen's effect and before the reminders read the check-in times. Before auth has loaded the
helper uses the last account signed in on this phone (`tideline.device.account`). That case is a launch with no signal,
when Clerk cannot load at all. With that fallback, the SOS opened from the offline boot board keeps its urge under the
right account. With no account, reads return null and writes are dropped, so the SOS still works but keeps nothing.
`routines.ts` resets its two caches when the account changes and reads the new account's values. A read that the change
overtook is read again.

Five kinds of key stay device-level, unchanged:
- the app-lock mirror (`tideline.applock.v1`, which must engage before any account loads and which WP2 already clears
  on sign-out);
- the mock's account book and data (`tideline.mock.*`);
- the mock session (`tideline.session.userId`);
- Clerk's token cache;
- `tideline.device.account` itself.

## D491 — Signing out clears what is pending, and keeps the reminders and the delivery marks
Signing out by any route (the Settings sheet, the onboarding sheet, an expired session, deleting the account) removes
that account's pending and in-progress state from the phone:
- the letter and post that were waiting to arrive;
- the urge session;
- the onboarding draft;
- the check-in prompt clock;
- the SOS settings;
- the affirmation prompt the user wrote.

The account's delivery marks stay: letter kept, post delivered, report seen and Week XII delivered. Its reminder switch,
times and days stay too. They are stored under its id, so no other account reads them. Clearing the marks would deliver
a letter or report again the next time that account signs in. Clearing the times would undo WP2's D420, which keeps the
switch so that signing back in brings the same reminders back. Deleting the account still runs WP1's
`clearDeviceState()`, which removes every `tideline.*` key on the phone, including other accounts' keys. That is
stricter than it needs to be now that the keys are per account, but it leaves nothing of the deleted account behind.

Review fix: "signing out" means a sign-out seen while the app runs, or a different account signing in. A launch whose
first report from auth is "signed out" clears nothing, keeps `tideline.device.account`, and leaves reads and writes on
that account, because offline Clerk can finish loading with no session it could check (D493). The reminders follow the
same rule: a launch that reports "signed out" cancels nothing, and the first sign-in of a run by an account other than
the phone's last cancels everything that one left, the trial reminder included, before its own are set. This amends
WP2's D420 for one case: a session that ended while the app was closed no longer cancels the reminders until the next
sign-in. Sign out, in Settings and on onboarding's sheet, now ends the session first and cancels the reminders only
once that has worked. Offline, Clerk cannot end the session, so the tap leaves the user signed in with everything as it
was. Neither sheet has a slot for an error line.

## D492 — An update hands the old account-less keys to the next account that signs in
Earlier builds wrote these keys with no account. If they were simply ignored, an update would reset the owner's check-in
times, and the reminders would move to 8:00 and 10:30. On every sign-in or launch, any of these old keys still on the
phone become the signed-in account's keys, unless that account already has its own, and the old copies are deleted.
Reads wait for this to finish. On a shared phone the first account to open the updated app takes them, which is the
same exposure as before the update, once. The retired `tideline.post.yearlydrop.seen`, which nothing reads, is deleted
when found. Capture seeds in `.overhaul/` that write the old names still work on a fresh browser context, because the
next load claims what they wrote.

## D493 — Boot gives up waiting at 8 seconds, and the account's row is retried
Boot shows the mark alone for 900 ms, as before. It then adds the kit spinner and "Opening VICI…", which replaces
Tideline's "Finding the waterline…" as `WaterlineScene`'s default. At 8 s it stops waiting and shows the kit statement
board: the compass hero, "VICI can’t connect right now.", "Check your signal, then try again. The SOS works without
one.", Try again, and the ghost link "Ride out an urge". Eight seconds is long enough for a slow cold start to finish,
and short enough that someone in an urge with no signal is not left looking at the mark.

Try again waits again and calls `retryBoot()`. "Ride out an urge" pushes `/urge`, which needs only a queued
`events:create`. Closing the SOS comes back to boot, and boot's redirect runs only once boot is in front again.

The Convex bootstrap used to call `ensureUser` once, when Clerk said "signed in". If that call failed, boot sat on the
splash for good. Now it calls `ensureUser` when Convex has authenticated and finds no `users` row. A failure is retried
after 2, 4 and 8 s, up to 30 s, and Try again retries at once. Only a row this sign-in has never read is created. The
deletion flow erases the row before the Clerk user goes, and recreating it would leave a row behind for a deleted
account.

Review fix: Clerk now gets its offline resource cache (`@clerk/clerk-expo/resource-cache`, native only). Without it,
clerk-js 5.125 on React Native answers a failed `/client` fetch with null, because `navigator.onLine` is undefined. Once
its fetch retries ran out with no signal, Clerk finished loading with an empty client. The app read that as a sign-out:
it cleared the account's keys, cancelled the reminders and sent boot to `(auth)/splash`. With the cache, Clerk loads the
last client it saw ("degraded", still signed in) after one failed fetch. Failed requests now throw a network error
instead of emptying the client. Offline, sign-in and account deletion fail with their error line, and Sign out leaves
the user signed in (D491). Convex is wired through its own copy of the Clerk adapter, and Try again also makes Convex
fetch its token again. Otherwise Convex stays unauthenticated after the one fetch that failed offline, and the board
could not recover when the signal came back. The first launch of this build with no signal has no cache yet. In that
case Clerk still loads signed out, and boot goes to `(auth)/splash`. Clerk then retries every few seconds, and once it
reaches the server the `(auth)` layout sends an onboarded user back to `/`.

## D494 — The old kit's barrel is off the live routes; seven unused packages are removed
`index.tsx` and `(auth)/splash.tsx` now import `SplashScene` and `WaterlineScene` from `components/ui/Waterline`, which
imports only mono parts. `checkin.tsx` takes `LoadingView` from the mono kit. Only the orphaned
`lesson/{reader,scroll,pages}` still import the `@/components/ui` barrel. Those files are the owner's to delete, and
they are not bundled, because nothing imports them.

Seven packages are uninstalled with `npm uninstall`. A grep of `src/`, `app.json`, `eas.json`, `scripts/`, `convex/` and
the configs found no import of them, and nothing in `node_modules` requires them:
- `@expo-google-fonts/eb-garamond`;
- `@expo-google-fonts/fraunces`;
- `@expo-google-fonts/hanken-grotesk`;
- `@expo-google-fonts/newsreader`;
- `expo-blur`;
- `expo-device`;
- `expo-image`. This corrects the first version of this entry, which kept it as "used by `ui/Grain`". Grain uses React
  Native's `Image`, because `expo-image` has no repeat mode. The only other mention in `node_modules` is a doc comment in
  `expo-router`.

Three packages stay. `@expo/ui`, `expo-glass-effect` and `expo-symbols` are dependencies of `expo-router` 56.2.8, which
requires `expo-glass-effect` at runtime. They would stay in the binary anyway, and listing them directly keeps them on
the SDK's pinned versions.

## D495 — "Something went wrong" is a kit statement board at the root and in the app group
`src/app/_layout.tsx` and `src/app/(app)/_layout.tsx` export `ErrorBoundary`. Expo Router wraps a route that exports
one in a React error boundary, and errors from routes that don't export one go to the nearest parent. Both draw
`ErrorScreen`: the umbrella hero, "Something went wrong.", "VICI couldn’t show this screen. Everything you’ve logged is
still saved.", and Try again, which calls `retry` to draw the route again.

The root board catches errors in the providers too, so it uses nothing they provide. ExpoRoot still supplies the
safe-area context. The `(app)` board adds "Ride out an urge", because `/urge` is outside the group and opens even when
the group can't draw. The error goes to `console.error`, which is the device log. Crash reporting needs an account with
a provider and a PII-scrubbing setup, so it is the owner's to add (see ownerActions).

Review fix: the root board replaces the providers too, and Try again mounts them again. `RealProviders` built its
`ConvexReactClient` in a `useMemo`, so every root retry left the previous client's socket and token refresh running. The
client is now built once per run, on first use (mock mode still never builds one), and a remount reuses it.

## D496 — Onboarding keeps its place per account
The funnel writes `{ step id, answers, plan pick, filed }` to the account's `tideline.onboarding.v1` on every board and
every answer. When the route opens it reads that back before drawing, showing only the ground for those few
milliseconds, so an app the OS reclaimed or that crashed reopens on the same board with every answer. The step is kept
by id, not index, so a reordered funnel in a later build falls back to question one rather than to the wrong board. The
draft is removed once `completeOnboarding` has landed, and on sign-out. Mock captures opened with `?step=` neither read
nor write it. A drive that walks the funnel from question one with a mock user who already has a draft will now resume
that draft, so drives should start from a fresh account or fresh storage.

## D497 — A member is not shown the paywall again
The paywall step is skipped when the store says the entitlement is active: on the way forward, on the way back, and
when the funnel is restored onto it. A member who reaches the paywall before the store has answered is moved on when it
does. Once the store has said "not a member" while the paywall is open, a purchase made there runs the paywall's own
confirmation and moves on itself. One edge remains: a purchase completed before the store's first answer arrives skips
that confirmation board.

## D498 — Day 0's "Begin" runs once and doesn't move on until it has landed
"Begin" already had a re-entry guard. While it runs, the button is now also disabled and dimmed (`O3DayZero` `busy`), so
the tap visibly registers. The letter and the vow are filed once, ever: each is marked in the draft when it lands, so a
"Begin" run again after a failure skips them. If `completeOnboarding` is refused, the user stays on Day 0 and "Begin"
works again. Before, the app moved on to the time boards anyway, and the `(app)` layout then sent the user back to
question one with the answers lost. With no connection, Convex holds the call, so "Begin" stays dimmed until the
connection comes back. There is no error line on the board, because the frame has no slot for one.

## D499 — A check-in's "Done" files once and closes at once
In the morning and night check-ins, Done and the closing ✕ now share an in-flight guard. They close the screen
straight away, and the writes (rows, pledge, reflection, the night's action) finish in the background, in the same order
as before. A second tap files nothing, and a slow connection no longer leaves Done looking dead: Convex holds the writes
until it reconnects. The quick check-in (`/checkin`) works the same way and no longer leaves the screen stuck if its
upsert is refused.

## D500 — The age gate waits for a turn of the wheel; the morning pledge is the user's own
(Final pass, after WP1–WP7.) `04 · Age` still draws the frame's 24, but an untouched wheel no longer stores it:
Continue stays dimmed until the wheel moves, so the under-18 gate is not answered "24" for anyone who taps
through (P8). The morning check-in no longer puts the design's sample line ("The mornings are mine again.")
on a user who has no pledge: the step says "No pledge yet…", offers "Write your pledge" and "Skip for today",
and only a signed pledge of the user's own words is filed (P3). Today's ☆ button is labelled "Journal", the
page's title.

## D501 — Loose ends between packages, closed in the final pass
The locked-weeks button says "Unlock VICI Unlimited" (TIER_NAME), the one name the paywall uses. First Steps
counts days from the programme start, like every other screen. Insights' top triggers read SOS urges logged
before `trigger` was written (triggersOf, which also reads precedingState.reasons). The Log chooser's "Daily
check-in" opens the morning or night check-in for the time of day (checkinPartNow, the user's own edges) instead
of the old /checkin MoodLogger flow, and the lapse row no longer promises "what changes", which the flow never
asks. The slip flow's "Read my pledge" opens the pledge entry itself rather than /vow, which now shows only the
vow.
