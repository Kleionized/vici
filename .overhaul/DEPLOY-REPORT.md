# VICI: where the app stands before release

9 October 2026. Written from the audit in `DEPLOY-AUDIT.md` and the fixes recorded in `decisions/deploy-*.md`.

## The short version

The audit found 56 problems. Most of them are now fixed in code. What remains falls into two groups: setup work only
you can do, because it needs your accounts, and a handful of product decisions only you can make. None of the
remaining work is large. Nothing here has been tested against the production backends, because they don't exist yet.

## What was wrong, and what was done

The worst problem was the sign-up. The default "no password" path quietly set every account's password to
`magic-` plus the email address. Anyone who knew your email could open your journal. That path is gone. Sign-up and
sign-in now use a 6-digit code that Clerk emails, and a "Forgot password" flow exists for people who choose a password.
Today I also turned off the dev instance's "password required" setting, which was blocking code sign-ups.

Several promises in the app were empty. Reminders were saved and never scheduled. App lock was a switch that locked
nothing. "Delete account", "Export my data", "Terms" and "Privacy" were rows that did nothing. All of these now work.
Reminders are local notifications on the days and times you pick. App lock uses Face ID and covers the app in the app
switcher. Deleting an account erases the Convex data and the Clerk user. Export produces a copy of what is stored. The
privacy policy is written, ships inside the app at `/legal/privacy`, and states plainly what is encrypted and what is
not.

The store build had problems of its own. A missing setting made a release build fall back to the offline mock, with
free purchases and passwords stored in plain text. A release build now refuses to start and lists what is missing.
The app is named VICI with the laurel icon. Prices, trial lengths and savings come from the store instead of
hard-coded numbers. The paywall states that plans renew. A returning user is no longer offered a free trial they
can't receive. A `.easignore` keeps 0.9 GB of design files out of every build upload.

The day and lesson model was the deepest problem. The app counted days in 24-hour blocks from the minute the account
was made, while everything else used the calendar. The day turned over at sign-up time, a night check-in after
midnight landed on the wrong day, and empty rows were counted as check-ins. There is now one programme calendar,
starting from the day onboarding ends. A check-in counts only when it holds an answer. A slip is one rule everywhere.
Today and the Library refresh when the app comes back. The course has an end state after day 84. Lesson answers
come back when a lesson is reopened.

The 1,000-point score is gone. In its place is a recovery rating out of 100 that covers only the last seven days, so
a slip costs something but never buries anyone. Showing up is worth 30, clean days 45, lessons 25. After day 84 the
weights become 40 and 60. The bands are Starting, Steadying, Holding and Strong. The first week shows "Building" and
the number of days so far.

The SOS and slip flows had smaller faults. The urge hub recorded nothing. A back swipe dropped you out mid-urge.
Unanswered ratings were stored as "Intense". All of that is fixed, and both flows now link to a Support page that
points to findahelpline.com.

Invented content was removed. Onboarding showed the designer's sample numbers as if they were your projections, and
greeted a blank name as "Sam". A slip letter quoted a machine-built "reason you started". Medallions cited
statistics nobody can source. The boards now use your own answers or say nothing.

The rest were smaller: offline launch now gives up after 8 seconds and still reaches SOS, an error screen replaces
crashes, dev screens are blocked in release builds, phone storage is kept per account, and onboarding resumes where
you left it.

## What you need to do

These need your accounts, so I can't do them.

1. **Production backends.** Run `eas init`. Create a Clerk production instance with the same settings as dev: email
   code on, password not required, names not required, and self-delete allowed. Create the `convex` JWT template.
   Run `npx convex deploy`, and set `CLERK_FRONTEND_API_URL` on the production deployment.
2. **EAS production settings.** Set `EXPO_PUBLIC_CONVEX_URL`, `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` (the `pk_live_` key),
   `EXPO_PUBLIC_REVENUECAT_IOS_KEY` (`appl_`), `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` (`goog_`) and
   `EXPO_PUBLIC_PRIVACY_URL`. Never set the two `FORCE_MOCK` flags there.
3. **The privacy policy.** Give me a contact email. Then build the page with
   `node scripts/legal/build-privacy-html.mjs --email=you@example.com`, host `legal/privacy-policy.html` anywhere on
   https, and put that address in App Store Connect and in `EXPO_PUBLIC_PRIVACY_URL`.
4. **RevenueCat.** Create the products and offerings, including the separate offering for the yearly drop.
5. **Crash reporting.** Pick a provider, such as Sentry. The error screen is in place but nothing reports to you yet.
6. **Support resources.** Check that findahelpline.com is right for the countries you launch in.

## What you need to decide

1. **What the subscription unlocks.** Right now nothing checks it. Skip on the paywall gives the whole app.
2. **How lessons are paced.** By calendar day, as now, or by the next unfinished lesson.
3. **When the lesson's task happens.** Today, or as tomorrow's action. The app currently mixes the two.
4. **What Rebound rewards.** Its tiers still rise with the number of slips.
5. **The first medallion post.** It still announces a Vici tier the album says you haven't earned.
6. **Drawer-only screens.** Life Map, Insights, Mail, Back Tap, First Steps, Journey and Locked weeks are reachable
   only from the developer drawer. Link the ones you want and delete the rest, along with 14 orphaned files.
7. **One rating detail.** Once you check in, today's lesson enters the window. A morning check-in made before the
   lesson can read about 4 points low until you finish it. I can exclude today's lesson until it's done if you prefer.

## What still needs checking

The recovery rating's independent review was interrupted and should be finished. The full design comparison at 393
points wide should be run again. The app copy is being rewritten now in a plainer voice, apart from the lessons,
notifications and letters, which you are changing yourself.
