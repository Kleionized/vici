# deploy WP4 decisions: store config, name and icon, prices, paywall legal, purchases (D450–D459)

Issues: B4, B6, B7, B8, B12 (seed/import only), P6, D5, and the paywall/drop part of B5. Files: `src/lib/config.ts`,
`src/lib/purchases/*` (new `misconfigured.tsx`), `src/components/paywall/*`, `src/app/{paywall,subscription,drop}.tsx`,
`app.json` (name, iOS icon, Android background), `assets/images/{icon,android-icon-*,splash-icon,favicon}.png`,
`.easignore` (new), `convex/{seed,importLessons}.ts`, `scripts/overhaul/render-icons.mjs` (new).

## D450 — A release build refuses to start without its production settings
When `__DEV__` is false, `config.ts` checks the build's settings and collects anything wrong in
`RELEASE_CONFIG_PROBLEMS`. It flags a missing Convex URL or Clerk key, a Clerk development key (`pk_test_`), and a
RevenueCat key that is missing, is a Test Store key (`test_`), or belongs to another store (iOS needs `appl_`, Android
`goog_` or `amzn_`, web `rcb_`). It also flags `EXPO_PUBLIC_FORCE_MOCK=1`, `EXPO_PUBLIC_FORCE_MOCK_PURCHASES=1`, and a
privacy URL that is missing or not https. If anything is found, `PurchasesProvider` renders a plain mono "This build
is misconfigured" screen that lists each problem and logs them. No route, reminder or lock runs behind it, and
RevenueCat is never configured.

The gate sits in `PurchasesProvider` because it is the one provider in this package that every route is inside. It
should move to `providers.tsx` once that file is free. The only exemption is `FORCE_MOCK` on web, because the design
preview is a release-mode web export that runs on the mock by choice. A native release build gets no exemption. A
store or preview profile that picked the flag up from a copied env would otherwise ship plaintext local accounts and
a drawn pay sheet that unlocks for free. The `preview` EAS profile also builds in release mode, so it needs the same
live settings. Testing against RevenueCat's Test Store or a Clerk development instance belongs in a development build.

A Convex URL looks the same for dev and prod, so the profile itself has to be right. In the EAS "production"
environment (or `eas.json` › build › production › env), set these:

- `EXPO_PUBLIC_CONVEX_URL`: the production deployment URL that `npx convex deploy` prints.
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`: the production instance's `pk_live_…` key.
- `EXPO_PUBLIC_REVENUECAT_IOS_KEY`: the `appl_…` key.
- `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`: the `goog_…` key.
- `EXPO_PUBLIC_PRIVACY_URL`: the hosted privacy policy, on https.

`EXPO_PUBLIC_TERMS_URL` (which defaults to Apple's standard EULA) and `EXPO_PUBLIC_REVENUECAT_PAYWALL` are optional.
Never set `EXPO_PUBLIC_FORCE_MOCK` or `EXPO_PUBLIC_FORCE_MOCK_PURCHASES` there, and never put a `test_` key in
`EXPO_PUBLIC_REVENUECAT_KEY`. On the Convex production deployment itself, set `CLERK_FRONTEND_API_URL` to the live
Clerk instance, and optionally `REVENUECAT_SECRET_API_KEY` (WP1's D415).

## D451 — Named VICI, with the laurel icon set; iOS uses the PNG
`expo.name` is now "VICI", which becomes the iOS display name and the Android label at prebuild. The slug and the
`tideline` scheme stay as they are, so the EAS project, existing links and Clerk's `tideline://sso-callback` redirect
keep working. The bundle id is also unchanged, because changing it would make a new store app.

The icons come from `scripts/overhaul/render-icons.mjs`, which uses headless Chrome through playwright-core. It draws
the laurel in white the way `LaurelMark` does, and works from the designer's 1254-px original so the 1024 icon is not
an upscale. The script writes the PNGs with a small encoder built on Node's own zlib (Node 22.2 or later), not pngjs.
pngjs isn't in `package.json` and resolved only through Clerk's and expo-notifications' dependencies, so a dependency
update could have broken the script. The new encoder reproduces the committed icons pixel for pixel, with the same
colour types, so the icons were not re-rendered.
`icon.png` is opaque, with no alpha channel. The Android foreground and monochrome layers keep the ink inside the 66dp
safe circle. The background and `backgroundColor` are #0D0D0D.

`ios.icon` no longer points at `assets/expo.icon`, which is the template's Icon Composer bundle with the Expo symbol.
iOS now uses `icon.png`, and the unused bundle stays on disk.

## D452 — Terms, Privacy and the renewal line wherever a subscription is sold
Every place a subscription is sold now has working Terms and Privacy links. The paywall footer reads "Terms · Privacy
· Restore", and the rescue screen gets "Terms · Privacy" under its timeline. The Yearly Drop's footer shows the same
three words, each a separate link; before, tapping "Terms" there ran a restore.

Each word opens its page through `openLegal`. "Privacy" stays plain text only while no URL is set, which only a dev
build allows. A footnote from the RevenueCat dashboard replaces the footer only if it names both documents.

Under the plans, a new line states the renewal terms of the selected plan. It is built from the store's own price,
billing period and any intro offer the customer can take. For example: "Renews automatically at $39.99/year until
cancelled in Settings." On Android it names Google Play instead of Settings. The line is new to the frames. It uses the
footer's type, and the scroll area absorbs the extra height.

An intro offer's length is always counted: "1 week free, then $39.99/year…" and "$0.99 for 1 month, then…". The
store's single-unit period comes back as a bare noun, which used to give "Week free" and "$0.99 for month" in this line
and in the offering paywall's tagline. `introOf` counts the length where it is made, and `renewalTerms` counts it again,
because it is the legal line and takes whatever intro it is handed.

## D453 — RevenueCat waits for sign-in to settle and retries a switch that fails
Nothing touches the RevenueCat SDK until auth has loaded. The SDK is then configured with the Clerk user id, so a
signed-in launch never passes through an anonymous customer. Signing in or out later switches the SDK with `logIn` or
`logOut`. A switch that fails is retried with backoff and again whenever the app returns to the foreground.

Until the switch lands, the app reads the membership as inactive, and purchase and restore retry the switch before
they go ahead. No money moves on the wrong id. The store sheets are wrapped in WP2's `withSystemPrompt`.

Configured without an id, as it is when the user is signed out, RevenueCat resumes whichever customer it cached last.
That can be the previous account if a sign-out's `logOut` never landed before the app was killed, or if the Clerk
session ended while the app was closed. So the adapter no longer records "anonymous" just because it passed no id. It
asks the SDK `isAnonymous()` and calls `logOut` if the answer is no, with the same retries as any other switch. Until
then, nothing reads as that customer's, and no trial reminder is scheduled or kept for them.

The catalogue and the customer are now read with `Promise.allSettled`, and each half lands on its own. Offerings that
fail offline no longer throw away the CustomerInfo the SDK did return. `membershipKnown` is new in the API. It is true
once the SDK is on the signed-in person and their CustomerInfo has been read. Until then, "nothing active" means "not
known yet", not "free".

## D454 — The entitlement is no longer copied into the account
In RevenueCat mode nothing reads the mirrored `settings.premium`. Writing it was the early false-then-true flip described
in D5, and it is a value B12 says the client must not set. So the mirror is removed rather than delayed. The Drop's
unread `yearlyDrop` write goes as well.

The mock purchases adapter keeps its stand-in entitlement in `settings.premium` only on the mock backend. On Convex the
client's `premium` is now stripped (B12, WP3), so a dev build that pairs Convex and Clerk with the drawn pay sheet used
to report "purchased" while `isPremium` never turned true. On that backend the entitlement is now kept on the phone,
per account, under `tideline.mock.premium:<userId>`. A stand-in purchase that can't be recorded is reported as an error
rather than as a purchase.

## D455 — Intro offers only where the customer can take them
On iOS the app asks the store whether this Apple ID is eligible for each intro offer, using
`checkTrialOrIntroductoryPriceEligibility`. It shows the offer only on an ELIGIBLE answer, and an unknown answer counts
as no. Google Play already lists only the offers the user can take, so on Android the listing is trusted. The "three
days on us" rescue, the trial tagline and the trial wording therefore appear only for an eligible customer.

When a purchase comes back as a renewing trial, the paywall calls WP2's `scheduleTrialReminder` for one day before the
trial ends. The app also keeps that reminder in line with the store, so it is cancelled once the trial converts or the
user cancels.

The rescue screen promises "a reminder, before any charge" only where the phone can keep that promise. The build has to
be able to send notifications, they have to be allowed or still askable (WP2's `useReminderState`), and the trial has
to be at least two days long. Someone who has blocked notifications, so that the OS won't ask again, sees "Until day N
— cancel in Settings, nothing is charged" instead. A user who is still askable and declines the prompt when the trial
starts gets no reminder. The row was true when shown, and that choice is theirs.

## D456 — Every figure comes from the store; nothing drawn stands in for a price
When RevenueCat is configured, the paywall waits for the store before drawing anything. If no plans come back, it shows
"Plans aren't available right now" with a Try again button. It draws only the plans the offering actually has. The
"Save" badge is worked out from the store's own two prices or left off, so the hard-coded "Save 74%" is gone. The
template's sample prices remain only in the mock.

The Yearly Drop reads its price from the `drop` offering, and its saving is measured against the default yearly plan.
If there is no `drop` offering, the screen says the offer isn't available instead of selling the full-price year. A
current member is told they're already a member. The offer waits until the store has said whether this customer is
a member (`membershipKnown`). If the store can't say, the board reads as unavailable rather than offering the year to
someone who may already hold it. The phrase "billed once" is gone.

## D457 — One name for the paid tier, and a confirmation that only states facts
The paid tier is called "VICI Unlimited" everywhere: the lockup, the payment sheet and the restore alerts. The
confirmation sentence now comes from what the store returned rather than from whichever card was selected, so a
restored customer is no longer told they bought the yearly plan. The receipt line now reads "Your receipt is in your
App Store purchase history." (Google Play on Android), because the app itself sends no receipt.

## D458 — Manage Subscription shows the customer's own plan
The plan, price and renewal date come from the product behind the user's own entitlement, looked up through the
offerings or with `getProducts`. Someone who bought the drop sees the drop price. A figure the store hasn't provided is
left out rather than invented. A trial shows when the first charge happens, and a promotional grant shows that no
charge is due. "Cancel subscription" appears only for a plan that renews. It is not shown for lifetime or for granted
access.

"Free" is an answer only the store can give. While it is being asked, or the account switch hasn't landed, the screen
shows the mono `LoadingView` with Back. If the store can't be reached, the card's title reads "Membership" and its line
reads "Couldn't reach the store just now. Your plan will show here once it answers." The card has no pill, and "Change
plan" shows no value. The screen asks the store once more, and Restore stays available. The card's layout and type are
the frame's own; only the words differ in this state.

## D459 — What goes into a build: `.easignore` and internal lesson seeding
`.easignore` copies `.gitignore` and adds the design and run folders, the image exports at the repo root, the
agent/editor folders and `dist/`. That leaves about 10 MB of tracked files to upload, and nothing the app imports is
excluded.

`seed:seedLessons` and `importLessons:importLessons` are now `internalMutation`s. They can still be run from the Convex
dashboard or with `npx convex run`, but the app can no longer call them.
