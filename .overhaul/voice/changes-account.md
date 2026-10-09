# Voice pass: account package

Changed 61 strings across 17 files (16 source files and the privacy policy text), then rebuilt
`legal/privacy-policy.html` with `node scripts/legal/build-privacy-html.mjs` (no contact email set, as before).
`npx tsc --noEmit -p .` and `npx eslint` on the changed files are both clean.

| File | Before | After |
|---|---|---|
| src/components/paywall/PaywallFlow.tsx (Paywall, line under the headline) | Break the cycle, rebuild your self-control, and become someone you can trust again. | Get your self-control back. Become someone you can trust again. |
| src/components/paywall/PaywallFlow.tsx (Rescue, title) | Before you go —⏎three days on us. | Before you go,⏎three days free. |
| src/components/paywall/PaywallFlow.tsx (Rescue, timeline row 1) | Today — everything unlocks | Today: full access |
| src/components/paywall/PaywallFlow.tsx (Rescue, timeline row 2, reminders possible) | Day {n−1} — a reminder, before any charge | Day {n−1}: a reminder before any charge |
| src/components/paywall/PaywallFlow.tsx (Rescue, timeline row 2, reminders blocked) | Until day {n} — cancel in {Settings}, nothing is charged | Until day {n}: cancel in {Settings} and pay nothing |
| src/components/paywall/PaywallFlow.tsx (Rescue, timeline row 3) | Day {n} — {$39.99/year} begins, unless you cancel | Day {n}: {$39.99/year} starts unless you cancel |
| src/components/paywall/PaywallFlow.tsx (Confirmed, title with name) | We’re in, {name}. | You’re in, {name}. |
| src/components/paywall/PaywallFlow.tsx (Confirmed, title without name) | We’re in. | You’re in. |
| src/components/paywall/PaywallFlow.tsx (Confirmed, `storeLine` opening) | Let’s take the first ground. | The work starts now. |
| src/components/paywall/PaywallFlow.tsx (Confirmed, `storeLine`, not active) | The campaign is unlocked. | You have full access. |
| src/components/paywall/PaywallFlow.tsx (Confirmed, `storeLine`, trial that renews) | Nothing is charged until {date} — cancelling is one tap in {Settings}. | Nothing is charged until {date}. Cancel anytime in {Settings}. |
| src/components/paywall/PaywallFlow.tsx (Confirmed, `storeLine`, lifetime) | The whole campaign is yours, for good. | You have full access, for good. |
| src/components/paywall/PaywallFlow.tsx (Confirmed, `storeLine`, monthly) | The campaign is unlocked, month by month. | You have full access, month to month. |
| src/components/paywall/PaywallFlow.tsx (Confirmed, `storeLine`, yearly) | The whole campaign is yours until {July 2027}. | You have full access until {July 2027}. |
| src/components/paywall/PaywallFlow.tsx (Confirmed offline, `drawnLine` opening) | Let’s take the first ground. | The work starts now. |
| src/components/paywall/PaywallFlow.tsx (Confirmed offline, `drawnLine`, trial) | Nothing is charged until {date} — cancelling is one tap in Settings. | Nothing is charged until {date}. Cancel anytime in Settings. |
| src/components/paywall/PaywallFlow.tsx (Confirmed offline, `drawnLine`, monthly) | The campaign is unlocked, month by month. | You have full access, month to month. |
| src/components/paywall/PaywallFlow.tsx (Confirmed offline, `drawnLine`, yearly) | The whole campaign is yours until {July 2027}. | You have full access until {July 2027}. |
| src/components/paywall/PaywallFlow.tsx (purchase error alert, title) | The store could not complete that | Purchase failed |
| src/components/paywall/OfferingPaywall.tsx (purchase error alert, title) | The store could not complete that | Purchase failed |
| src/components/paywall/RevenueCatPaywall.tsx (purchase error alert, title) | The store could not complete that | Purchase failed |
| src/app/drop.tsx (offer, title) | One decision.⏎A year of change. | One price.⏎A full year. |
| src/app/drop.tsx (offer, line under the title) | Unlock everything VICI has to offer for an entire year. | Everything in VICI for 12 months. |
| src/app/drop.tsx (offer, button) | Unlock my year | Get the year |
| src/app/drop.tsx (bought, title) | You received a drop. | Your year starts now. |
| src/app/drop.tsx (bought, body) | One drop covers the year — twelve months of VICI. It renews yearly until you cancel. | You have 12 months of VICI. It renews each year until you cancel. |
| src/app/drop.tsx (already a member, body) | {VICI Unlimited} is active on this account, so there is nothing to claim. | {VICI Unlimited} is active on this account. There’s nothing to buy. |
| src/app/drop.tsx (offer unavailable, body) | The store didn’t return it. It may have ended, or the connection dropped. Nothing has been charged. | It may have ended, or the connection dropped. Nothing has been charged. |
| src/app/drop.tsx (purchase error alert, title) | The store could not complete that | Purchase failed |
| src/app/(auth)/welcome-back.tsx (address step, empty email) | Enter your email address to carry on. | Enter your email address. |
| src/app/(auth)/welcome-back.tsx (Forgot password with no email) | Enter your email first, and we’ll send a reset code. | Enter your email to get a reset code. |
| src/app/(app)/settings.tsx (group label over Your vow / Your letter) | Anchors | Vow & letter |
| src/app/profile.tsx (group label over Started VICI / Current week / Medallions) | Journey | Progress |
| src/app/privacy.tsx (Data & privacy, heading) | Your data, your call. | How your data is kept. |
| src/app/privacy.tsx (export failed) | Your data couldn’t be prepared for sharing. Try again. | Couldn’t export your data. Try again. |
| src/app/privacy.tsx (delete: erase failed) | Your data couldn’t be erased just now. Nothing was deleted — try again. | Couldn’t erase your data. Nothing was deleted. Try again. |
| src/app/privacy.tsx (delete: check failed, fallback) | That didn’t confirm it’s you. Try again. | Couldn’t confirm it’s you. Try again. |
| src/app/privacy.tsx (delete: new code sent) | A new code is on its way. | Code re-sent. |
| src/app/privacy.tsx (delete sheet, body) | This erases your journal, urges, check-ins and lessons, and closes your account. It can’t be undone. A subscription isn’t cancelled by this — cancel it in your store settings. | This erases your journal, urges, check-ins and lessons, and closes your account. It can’t be undone. A subscription keeps running until you cancel it in your store settings. |
| src/app/applock.tsx (heading) | Only opens for you. | Keep VICI private. |
| src/app/applock.tsx (line under the heading) | This work is personal. Keep VICI behind {Face ID} so it opens only for you. | Lock it with your {Face ID} so only you can open it. |
| src/components/AppLockGate.tsx (lock screen, line) | Unlock with {Face ID} to carry on. | Unlock with your {Face ID}. |
| src/app/subscription.tsx (store unreachable, card line) | Couldn’t reach the store just now. Your plan will show here once it answers. | Couldn’t reach the store. Your plan will show here when it answers. |
| src/app/(app)/support.tsx (heading) | You’re not alone in this. | Get help. |
| src/app/(app)/support.tsx (note under the helpline row) | findahelpline.com is a maintained international directory of free, confidential crisis lines and text services, searchable by country. | findahelpline.com lists crisis lines and text services by country. |
| src/app/reminders.tsx (line under "Two reminders a day.") | At your check-in times. Nothing noisy, nothing shaming. | At your check-in times. They never name the habit. |
| src/app/notify-primer.tsx (line under "Two reminders a day.") | At your check-in times. Nothing noisy, nothing shaming. | At your check-in times. |
| src/app/notify-primer.tsx (line under the notes) | Discreet by default. Nothing names the habit. | They never name the habit. |
| src/components/routines/kit.tsx (night check-in time, heading) | When should the⏎nightly check-in come? | When should the⏎night check-in come? |
| src/lib/purchases/misconfigured.tsx (body) | It is a release build without the settings it needs, so it will not start rather than run on test or offline services. Nothing on this phone was changed. | This release build is missing settings it needs. It stops here instead of running on test or offline services. Nothing on this phone was changed. |
| src/content/privacyPolicy.json (intro) | VICI is a 12-week self-help programme for changing your relationship with porn. What you record in it is personal, so this policy sets out what the app collects, why, … | VICI is a 12-week self-help programme for quitting or cutting back on porn. What you record in it is personal. This policy explains what the app collects, why, … |
| src/content/privacyPolicy.json (What you give us, bullet 2) | … urges and slips (when they happened, how strong they were, what fed them, what helped and any note you add) … | … urges and slips (when they happened, how strong they were, what triggered them, what helped and any note you add) … |
| src/content/privacyPolicy.json (What stays on your phone, paragraph 2) | … Face ID or Touch ID is handled by your phone; VICI never receives your biometric data. | … Face ID or Touch ID is handled by your phone. VICI never receives your biometric data. |
| src/content/privacyPolicy.json (How we use it, paragraph 2) | … we may email you about VICI; you can stop them at any time. | … we may email you about VICI. You can stop them at any time. |
| src/content/privacyPolicy.json (Who handles it for us) | We use a small number of service providers. | We use a few service providers. |
| src/content/privacyPolicy.json (How your data is protected, paragraph 1) | VICI never stores your password; if you set one, our sign-in provider keeps only a secure (bcrypt) hash of it. | VICI never stores your password. If you set one, our sign-in provider keeps only a secure (bcrypt) hash of it. |
| src/content/privacyPolicy.json (How your data is protected, paragraph 2) | Our servers can read it in order to run the app, and access is limited to what running and supporting VICI requires. No system is perfectly secure, so protect your phone with a passcode, and consider turning on App lock. | Our servers can read it to run the app. Access is limited to what is needed to run and support VICI. No system is perfectly secure, so protect your phone with a passcode and consider turning on App lock. |
| src/content/privacyPolicy.json (Your choices, Export) | Export: Settings, then Data & privacy, then Export my data gives you a copy of the data stored with your account. | Export: in Settings, open Data & privacy and tap Export my data for a copy of the data stored with your account. |
| src/content/privacyPolicy.json (Your choices, email bullet) | … "Share email with billing" can be turned off in Data & privacy. | … You can turn off "Share email with billing" in Data & privacy. |
| src/content/privacyPolicy.json (Your choices, last bullet) | Reminders, Face ID and notifications can be turned on or off at any time in Settings and in your phone's settings. | You can turn reminders, Face ID and notifications on or off at any time in Settings and in your phone's settings. |
| src/content/privacyPolicy.json (How long we keep it) | We keep your data for as long as your account exists. When you delete your account, it is erased from our database straight away; copies in our providers' backups expire on their normal schedules. … | We keep your data as long as your account exists. When you delete your account, it is erased from our database straight away. Copies in our providers' backups expire on their normal schedules. … |

⏎ marks an explicit `\n` line break. Values in braces are filled in at run time and work as before.

## Why some of these read the way they do

- Rescue title: the em dash was the break point. The comma keeps the same two lines ("Before you go," / "three
  days free."), and the title is two characters shorter.
- Rescue row 2 (reminders blocked): "nothing is charged" became "pay nothing" so the row stays one clause after
  the colon. The meaning is unchanged: cancel before day {n} and nothing is charged.
- Confirmed: "Let’s" and "the first ground" / "the campaign" were metaphor. The lines now state the plain fact
  (access, the date, where to cancel). "Cancelling is one tap" was a claim about Apple’s and Google’s screens
  that the app cannot keep; "Cancel any time in Settings" is true and shorter.
- Drop, bought: "You received a drop" was the postal metaphor the owner flagged ("the post is in"). The caps
  line above it still says "The year".
- Data & privacy: "Your data, your call" implied a level of control the paragraph under it rules out ("our
  servers read them"). The new heading says what the paragraph is about.
- Delete sheet: the old line said deleting does not cancel a subscription. The new one says the same thing as a
  fact about what happens next.
- Support: "You’re not alone in this" is a stock comfort line. "Get help." says what the page is for. The
  Settings row that opens it still reads "Find support".
- Reminders: "Nothing noisy, nothing shaming" was a slogan. The promise it carried is the one the reminder
  copy is built on (`src/lib/reminders.ts`: "nothing names the habit"), so that is what both boards now say.
  The primer says it once, under the notes, rather than twice.
- App lock: the line said "This work is personal" to set a mood. It now says what the switch does.

## After review

- Drop title: "One payment." is what the app prints for a lifetime purchase ("One payment. Nothing renews."),
  and the drop renews each year. "One price." avoids reading as a one-off charge.
- Delete check fallback: it shows on the "Confirm it’s you." step, so it now says what failed.
- "Code re-sent." matches the sign-in and sign-up boards for the same event.
- "Cancel anytime": the same flow already spells it this way ("Cancel anytime" card, "· cancel anytime").
- App lock lines: the lock name can be "passcode" or "screen lock" (always on Android), so both lines read
  "your {name}" ("Unlock with your screen lock.").
- Support note: the line above already says a helpline is free and confidential, so the note no longer
  repeats it.
- Kept: the rescue title's comma ("Before you go,⏎three days free."). The guide replaces em dashes with a
  period or a comma, and the short elliptical form is ordinary headline English; a colon reads as a label.

## Privacy policy

Every legal statement is kept, with the same meaning: what is collected, what stays on the phone, use, no
sale, no ads or trackers, each provider and what it receives, encryption in transit and at rest (TLS,
256-bit AES), not end-to-end encrypted, bcrypt, export, deletion, rights, retention, backups, age, transfers
and safeguards, changes, contact. The edits only split semicolon sentences, cut "in order to" / "for as long
as" / "a small number of", put two passive lines in the active voice, and replace the metaphor "fed" with
"triggered". The intro now describes the programme plainly ("quitting or cutting back on porn") instead of
"changing your relationship with porn". `legal/privacy-policy.html` was rebuilt from the JSON and differs
only in those lines.

## Left alone on purpose

- Sign-in boards (`kit.tsx` DOOR strings, sign-up, welcome-back titles and buttons): the owner shortened these
  in D520 and they are already plain. Only the two remaining wordy error lines changed.
- Auth error fallbacks ("Could not sign in.", "Could not send a code.", "Code re-sent." …): short and plain.
- Paywall: "Take your life back." (a plain command), plan cards ("Yearly", "Best value", "Monthly", "Cancel
  anytime", "Billed monthly", "{price} a month", "Save {n}%"), "What you get", the four feature labels
  (`PW_FEATURES` is also the length check for dashboard benefit lists in OfferingPaywall), "Start free trial",
  "No thanks", "Plans aren’t available right now." and its body, "Your free days run until {date}.", "Your
  receipt is in your {store} purchase history.", "Nothing to restore", "Could not restore".
- The drawn pay sheet ("Pay", "Confirm with Side Button", the sample card, "Due today", "· cancel anytime"):
  offline only, a stand-in for the system sheet, never drawn in a release build.
- Drop: "The year", "You’re already a member.", "This offer isn’t available right now.", "Yearly access",
  "That’s {price} a month.", the three perks (their line breaks are fitted to the cell width), "See the
  receipt", "Manage subscription", "Not now".
- Subscription: every state line ("Core tools included", "Granted access. Runs until …", "Free trial. Ends …",
  "Renews …"), row labels and alerts. They are plain and built from store figures.
- Settings, profile and app lock row labels and values ("Check-in reminders", "After each week", "Opens Week
  XII", "Edit profile", "Ask after" and its choices, "Hide sensitive previews" …): plain. The "—" shown on
  Profile for an unknown start date or week is an empty-value placeholder, not prose.
- Data & privacy paragraph ("Your journal, urges and log are stored … We never sell your data."): the
  encryption wording was set on purpose in commit a520d89a. The RevenueCat sharing note and the deletion
  warning are already plain and carry legal meaning.
- `contactLine()` in `src/app/legal/privacy.tsx`: the same sentence is written into
  `scripts/legal/build-privacy-html.mjs` (outside this package). Changing only one would make the app and the
  hosted page say different things.
- App lock "Unlock", "Unlock VICI", "Turn on app lock": literal, about the lock.
- Check-in time boards ("When should the morning check-in come?", "Select time", "Select days", "Save time"):
  a direct question and plain labels; the native line break is written for the question. Only "nightly"
  became "night", the word Settings, Log and the privacy policy use.
- Boot and errors ("VICI can’t connect right now.", "Opening VICI…", "Something went wrong.", "This page
  doesn’t exist." and their lines, "Ride out an urge", "Back to Today"): already plain.
- "Two reminders a day." and "Turn on reminders": plain. The notification previews on those boards
  (`REMINDER_NOTES`) are notification copy and out of scope.

## Note for the owner

Some dev verification scripts match on the old text and will need the new words if you run them:
`.overhaul/recipes/medallions-letters.json` taps "Unlock my year";
`.overhaul/verify/paywall-reminders/func.mjs` checks "We’re in";
`.overhaul/verify/settings/v-support.js` waits for "not alone";
`.overhaul/verify/auth-funnel/func.mjs` checks "Enter your email address to carry on.".
`.overhaul/recipes/paywall-reminders.json` waits for "Before you go", which still matches. The design canvas
files (`Vici Overhaul/`, `UI Final/` …) still show the old copy.

## Added in the final check

Sign-in error lines in `src/lib/auth/clerkAuth.tsx` (outside the package list, found by the closing sweep):

| File | Before | After |
|---|---|---|
| src/lib/auth/clerkAuth.tsx (sign-up or sign-in before Clerk loads, four places) | Auth is still loading. | Still loading. Try again. |
| src/lib/auth/clerkAuth.tsx (code sign-up on an instance that needs a password) | This sign-up needs a password. Tap “Use password instead” and choose one. | This sign-up needs a password. Tap “Use a password instead” and choose one. |
| src/lib/auth/clerkAuth.tsx (second code needed) | One more code is on its way — enter that one. | We sent another code. Enter that one. |
| src/lib/auth/clerkAuth.tsx (email confirmed, password still needed) | Your email is confirmed, but this sign-up also needs a password. Go back and choose “Use password instead”. | Your email is confirmed, but this sign-up also needs a password. Go back and tap “Use a password instead”. |

The button is labelled "Use a password instead" on both sign-in screens, so the two error lines now name it as it reads.
