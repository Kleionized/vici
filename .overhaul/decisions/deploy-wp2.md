# deploy WP2 decisions: reminders, app lock, the Support door (D420–D429)

Issues: B1 (finding 157 included), B13, and the Support door in Settings (B2/U1). Files: `src/lib/reminders.ts` (new),
`src/components/AppLockGate.tsx` (new), `src/lib/routines.ts`, `src/components/routines/kit.tsx`,
`src/app/routines/{morning-time,night-time}.tsx`, `src/app/{reminders,notify-primer,applock,_layout}.tsx`,
`src/components/onboarding/reminders.tsx`, `src/app/(app)/settings.tsx`, `src/app/(onboarding)/welcome.tsx` (the
reminders `onAllow` handler and its one import), `app.json` (plugins), `package.json` and
the lockfile (`expo-notifications ~56.0.26`, `expo-local-authentication ~56.0.5`, both installed with `npx expo install`).

## D420: Reminders are local notifications, chosen per phone
Check-in reminders are weekly-repeating local notifications, one per ticked weekday per check-in, using the copy the
onboarding cards already show (`REMINDER_COPY`, which the cards now read too). A tap opens `/day/morning` or `/day/night`.
The on/off choice is kept on the phone per account (`tideline.reminders.enabled.v1:<userId>`), like the times and days.
Permission is per device anyway, and keeping the choice local avoids a schema change in files another agent owns.
`/reminders` no longer writes the unread account flags `morningCheckin` and `riskTimeSupport`. Signing out, whether from
the sheet, through an expired session or by deleting the account, cancels every scheduled reminder and clears any
already delivered, but leaves that account's switch alone. Signing back in to the same account brings its reminders
back, and a different account reads its own key, so it starts with them off. (The first version turned one phone-wide
switch off on any sign-out, so an expired session silently ended reminders for good.) Reminders play the default sound. While VICI is open they appear silently as a banner. Android uses
inexact alarms when exact ones are not allowed, so `SCHEDULE_EXACT_ALARM` is not requested. The module is loaded with
`require`, and only after `requireOptionalNativeModule` confirms the native side exists, so web builds and older dev
clients carry on without reminders.

## D421: The morning/night switch follows the user's check-in times
`checkinPartNow` (used by the launch gate, Today's greeting and MoodLogger) now reads the saved times. The morning
check-in is offered from 3½ h before the morning time and the night check-in from 4 h before the night time, so the
defaults reproduce the old 4:30/18:30 exactly. Two limits stop an unusual pair of times from squeezing one part:
1. The night check-in is never offered within 8 h after the morning time, so there is no "Good evening." at 1 PM.
2. The morning check-in is never offered within 4½ h after the night time, so the small hours still belong to the night
   that hasn't been closed.

Neither switch point can move past its own check-in time. Examples: a 4:00 AM morning time gives morning from 3:00, and
a 5:30 PM night time gives night from 16:00. Both scenarios in finding 157 now get the right check-in.
`MORNING_OPENS_AT`/`NIGHT_OPENS_AT` remain as the default switch points. A later L7 fix (night after midnight) should
use `checkinEdges()`, not those constants.

## D422: Where "Turn on reminders" does its work
The onboarding step's button now asks for permission and schedules reminders inside `O3Reminders`
(`components/onboarding/reminders.tsx`) before calling `welcome.tsx`'s unchanged `onAllow`. This wires it without
editing a file that other agents are changing. It doesn't wait for the permission answer: the system prompt appears over
the next board. The check-in time boards later in the flow reschedule on "Save time". `/reminders`, `/notify-primer`
and the Settings switch go a step further. If the system would not even show its prompt, because the user refused on an
earlier visit, they open VICI's page in system Settings. That is judged before asking: iOS reports "can't ask again" the
moment someone taps Don't Allow, so judging it afterwards sent a user who had just declined straight to system Settings.
Someone who has just declined now stays on the screen. The choice is remembered even if permission is refused, so
allowing notifications later in system Settings starts the reminders the next time the app opens. In the onboarding
step, `onAllow` now runs before the scheduling starts, so the reminders are made from the time D425 suggests.

## D423: App lock: what locks, when, and the device mirror
`AppLockGate` is mounted after the navigator in `_layout.tsx`. It enforces three rules:
- With "Require Face ID" on, a cold start opens behind the lock, and so does a return after 15 minutes away (or after
  "Ask after", if that is longer). iOS can keep VICI in memory for days, so locking only on a cold start would let anyone
  holding the unlocked phone straight back in, which is not what "so it opens only for you" promises.
- With "Lock when I leave the app" also on, every return from the background locks again once the app has been away for
  the "Ask after" time. Becoming inactive (Control Center, the Face ID sheet) doesn't count. Using the longer of the two
  thresholds when it is off means switching it on never makes the lock less strict.
- With "Hide sensitive previews" on, a plain laurel cover is drawn whenever the app is not in the foreground, except
  under a system prompt VICI opened itself. `withSystemPrompt(fn)` (exported from `AppLockGate.tsx`) marks one. While
  it is open the cover skips the inactive state, and on Android also the background state, because Android reports a
  dialog activity as background. The trip also doesn't count as leaving the app. The mark is released a moment after the
  app is active again, so the cover doesn't flash. `reminders.ts` wraps the notification permission request in it. The
  purchase sheet (WP4) and SSO (WP1) should be wrapped the same way. A real trip to the background on iOS is still
  covered.

The phone keeps a mirror of the three account switches, plus "Ask after", so the lock can engage before the account
loads, including offline. The account's values replace the mirror when they arrive. The first time they arrive with the
lock on (a reinstall or a second phone), the lock engages.

Turning the lock on asks for Face ID first, so the lock can't be switched on for a phone that can't check it. If the
phone later can't check at all (nothing enrolled, no passcode), the gate opens rather than locking its owner out for
good. Android's back button is blocked while locked. Signing out clears the mirror.

## D424: The lock is named after what the phone uses
The frame says "Face ID". iPhones with only Touch ID show "Touch ID", iPhones with neither show "passcode", and Android
shows "screen lock", because its prompt also accepts the PIN or pattern. The same name appears in the row
("Require …"), the line above it and the lock screen. Web and builds without the module keep "Face ID".

## D425: "Timed to your risky window" became "At your check-in times"
`/reminders` and `/notify-primer` said "Timed to your risky window." Nothing schedules a risk-window reminder. The night
reminder fires at the night check-in time the user chooses ("You pick the time" on the card), so the line now says
"At your check-in times. Nothing noisy, nothing shaming." It is a similar length in the same style, and the layout is
unchanged.

The onboarding step keeps its frame copy ("<window> is when you're most likely to watch. Want VICI there before that
time?"), and the schedule now keeps that promise. The night time defaulted to 10:30 PM, which is after almost every
window `windowFor()` gives (6:00, 8:00, 9:00, 9:30 and 10:00 pm). A yes on that step now calls
`suggestCheckinBefore(windowFor(a)[0])` from `welcome.tsx`'s `onAllow`. That moves the check-in covering the window to
30 minutes before it: the night one for an evening window, the morning one for the 6:30 am window. The time boards then
open on that time, and the user can still change it. It only happens while no times are saved on this phone, so a time
the user picked is never moved. A window that would cross noon or midnight is left alone. This needed one import line
in `welcome.tsx` as well as the handler itself.

## D426: Settings › Reminders shows what the phone will do
The group now starts with a "Check-in reminders" switch. It shows on only when the reminders are both requested and
allowed by the OS, and it re-reads that state whenever the app returns to the foreground. Where the build can't send
notifications, the row reads "Unavailable" and is not tappable. The morning and night rows still show their time and
add "· N days" or "· No days" when a reminder isn't set for every day (the value ellipsises on a narrow phone). The
added rows make the column scroll at 852 as well (D320 already covers this). "Weekly report · Every Sunday" is R1's
and was left as it was.

## D427: App lock row shows On/Off
The Settings row used to say "Face ID" in every case. It now says "On" only when this build can lock and
`appLockFaceId` is on, and "Off" otherwise. On the App lock page, a switch left on by another phone, viewed in a build
that can't lock, shows a note saying so.

## D428: The Support door is its own group at the end
`Find support` (a plain kit `Row` with a chevron) opens `/(app)/support` from a captioned "Support" group placed after
Account, which is where the platform conventions put help. The page's contents belong to WP6. Linking the other
drawer-only screens is the owner's decision (U1) and was not done.

## D429: App lock's footnote and "Ask after"
The footnote said the switch "Hides journal previews and entry titles in notifications and the app switcher".
Reminders never contain anything the user wrote, so the switch has nothing to hide in notifications. The footnote now
reads "Covers VICI in the app switcher, so entries and titles never show. Reminders never include what you write."
(same style, one or two lines). "Ask after" opens a sheet in the style of the photo sheet: Immediately, 1, 5 or 15
minutes, or 1 hour, with a check mark on the current choice. Its panel is two rows taller than the photo sheet's
(top 402). The value is stored only on the phone, because the account has no field for it and `convex/*` isn't this
work package's. The privacy cover is not drawn on web. On Android it is best-effort, because the system can capture the
recents snapshot before JavaScript draws the cover; `FLAG_SECURE` would be the complete fix (see notFixed).

## Review round (no new numbers; the entries above were amended)
An independent review raised seven points, and all seven held up against the code:
- `loadRoutines()`/`loadCheckinDays()` returned the first disk read's object forever, so reminders kept the first times
  after every "Save time". They now return the live value (`routines.ts`).
- A user who had just declined was sent to system Settings (D422).
- "Require Face ID" alone did not lock a return to the app (D423).
- The privacy cover hid the screen behind VICI's own system prompts (D423).
- An expired session turned reminders off for good (D420).
- The onboarding sub-line promised a reminder before the window (D425).
- `clearLastNotificationResponseAsync` is deprecated in expo-notifications 56.0.26, so it is now the synchronous
  `clearLastNotificationResponse()` in a try/catch. The online v56 page labels them the other way round, but the
  installed package's types decide.
