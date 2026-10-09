# VICI — deployment-readiness audit

**Scope.** Every route in `src/app` (63 files), the logic behind them (`src/lib`, `src/components`,
`src/content`) and the Convex backend, read by seven area reviewers (score; days and lessons; check-ins and
logs; SOS and slips; onboarding, auth and paywall; medallions, journey and settings; platform and backend),
each followed by an independent reviewer told to *refute* every finding, and a final gap-finder. 160 findings
were raised, 5 refuted, 155 confirmed (plus 3 confirmed in an earlier pass of the same review). Many describe the same root problem from different screens, so they
are merged here into **56 issues**. Full evidence for each finding (file:line, scenario, verifier's check) is
in `.overhaul/deploy-audit/findings.json`; `issues.json` maps each issue below to its findings.

This was a code review, not a device test: nothing was run against the live Convex/Clerk/RevenueCat
backends. Issues that depend on them are marked as such.

| | Issues |
|---|---|
| **Must fix before submitting** (store rejection, legal, safety, security, build) | 14 (B8 is strongly recommended rather than blocking) |
| **Wrong for real users** (day/lesson model, score, SOS, data, reports) | 30 |
| **Placeholder / AI-looking content** | 8 |
| **Unfinished or leftover screens** | 4 |

---

## 1. Must fix before submitting

**B1 · No notifications exist — every reminder control is a no-op.** `expo-notifications` is not installed and
nothing schedules anything. Onboarding's "Turn on reminders" stores an answer nobody reads; `/reminders` writes
settings nobody reads; `/notify-primer`'s button just closes; the check-in time and day pickers save to the
device and only feed Settings labels (the morning/night switch is fixed at 04:30/18:30 regardless). The paywall
rescue also promises "a reminder, before any charge". *Fix:* add notifications (permission on "Turn on
reminders", weekly repeats per chosen day/time, reschedule on save, cancel on sign-out) — or remove every
reminder promise. (welcome.tsx:346, reminders.tsx:21, notify-primer.tsx:32, routines.ts:47–99, settings.tsx:78)

**B2 · Crisis help is a placeholder page with no way in.** `/support` shows "[PLACEHOLDER] Crisis line",
"[PLACEHOLDER] Find a therapist" and "Note for the build: these are placeholders… must be added before this
ships". Its only door is the dev drawer. No SOS, slip or settings screen links to any human help, while a lesson
tells users to "save crisis and professional-help contacts in the app now". *Fix (your decision on sources):*
real, region-aware crisis lines (tel:/sms:) and a therapist directory; link from Settings, the SOS shell and
the slip flow's Low/Ashamed paths. (support.tsx:18–71)

**B3 · The default email sign-up sets the guessable password `magic-<email>`.** The "no password needed — we'll
send you a magic link" path calls Clerk's password sign-up with `magic-` + the email. No magic link, no
email-code sign-in and no "Forgot password" exist. Anyone who knows a user's email can open their recovery
journal; the real owner is locked out after a sign-out or reinstall. *Fix:* Clerk email-code (or email-link)
sign-up and sign-in, a "Forgot password" flow, and rotate any accounts already created this way.
(sign-up.tsx:81, welcome-back.tsx:80, clerkAuth.tsx:135)

**B4 · A store build silently ships the offline mock.** Whether the app uses Clerk/Convex/RevenueCat depends
only on env vars; if any is missing it quietly becomes the mock (accounts stored on the phone with plaintext
passwords, no cloud data, a fake purchase sheet that unlocks Plus for free). The only values live in the
gitignored `.env.local` (and are dev/test: Convex `dev:`, Clerk `pk_test_`, RevenueCat `test_`); `eas.json`'s
production profile sets none and `eas init` was never run. *Fix:* production env in EAS, and make a release
build refuse to start on the mock or test keys. (config.ts:16–72, eas.json:21)

**B5 · No account deletion, data export, Terms or Privacy links; no auto-renew disclosure.** "Delete account",
"Export my data", "Privacy policy" and "Terms of service" are rows with no action, and no deletion backend
exists. Every "Terms"/"Privacy" on the paywall, the drop and the sign-in screens is plain (sometimes
underlined) text. The paywall never says the plan renews automatically. App Store 5.1.1(v) and 3.1.2 reject
all of these. *Fix:* hosted Terms + Privacy opened from every one of those places, a renewal line under the
plans, a working delete-account flow (Clerk user + Convex data), and export or remove the export row.
(privacy.tsx:40, PaywallFlow.tsx:264–371, auth/kit.tsx:283, drop.tsx:135)

**B6 · The app ships as "tideline" with the Expo template icon.** Name, slug and URL scheme are `tideline`; the
icon is create-expo-app's blue chevron; the Android adaptive background is the template's light blue. *Fix:*
name "VICI", a VICI scheme (kept in sync with Clerk's redirect allowlist), the laurel icon set, #0D0D0D
background. (app.json, assets/images/icon.png)

**B7 · Prices are hard-coded or fall back to sample values.** The Yearly Drop always shows $26.99, a struck
$39.99, "$2.25 a month" and "Save 74%" (wrong even on its own numbers), says "billed once" for an
auto-renewing plan, is offered to existing subscribers, and can charge the normal yearly price if its offering
is missing. The paywall shows $39.99 / $12.99 / "Save 74%" / "3 days" until (or unless) RevenueCat answers.
Manage Subscription shows the current offering's price instead of the user's and invents a renewal date.
*Fix:* every price, period and saving from the store package; hide the drop for subscribers; correct the copy.
(drop.tsx:33–176, PaywallFlow.tsx, subscription.tsx)

**B8 · ~0.9 GB of design captures and exports are packed into every EAS upload** *(strongly recommended, not a
blocker).* `.overhaul/`, `.vicifull/` and the design-export folders are tracked in git and nothing ignores them
for EAS (no `.easignore`), so each build uploads ~0.9 GB of non-app files. That is under EAS's 2 GB cap (the
reviewer's 3.4 GB figure counted on-disk folder sizes; measured tracked size is ~0.9 GB) but makes every build
upload slow on a slow machine and connection. *Fix:* a `.easignore` (copy of `.gitignore` plus those folders and
root PNGs), or move the captures out of the app repo.

**B9 · The subscription unlocks nothing (decide before launch).** No screen checks the entitlement; Skip on the
paywall gives the full app, and a lapsed subscription keeps it. The only "locked" screen is dev-only and
hard-codes "You've finished week one". *Fix (your decision):* define free vs paid and gate it.
(purchases/index.ts:38, (app)/_layout.tsx:83, locked.tsx)

**B10 · Offline, the app never leaves the splash — SOS is unreachable.** Boot waits on Clerk and Convex with no
timeout, so a signed-in user with no signal sees the laurel and the old Tideline line "Finding the waterline…"
forever. The same hang happens if a single `ensureUser` call fails. Online-but-slow writes leave "Done"/"Logging…"
buttons dead. *Fix:* an SOS path that works without the backend, a boot timeout with Retry, retry
`ensureUser`, VICI copy for the slow-boot line, and timeouts on awaited writes. (index.tsx:25, realProviders.tsx:42,
ui/Waterline.tsx:67)

**B11 · No error boundary and no crash reporting.** No route exports `ErrorBoundary`, so any render error
closes the release app (one bad record can crash-loop a user at launch), and nothing reports it. Many writes
end in `.catch(() => {})`. *Fix:* a mono "Something went wrong · Try again" boundary at the root and in
`(app)`, and crash reporting with PII scrubbing.

**B12 · Public Convex mutations can overwrite the lessons table; the client can set `premium`.**
`seed:seedLessons` and `importLessons:importLessons` have no auth check and can write lorem-ipsum
"[PLACEHOLDER CONTENT]" lessons; `users:updateSettings` accepts `premium`. *Fix:* make them internal (or delete
them with the unused lessons table and queries), and keep `premium` server-only. (seed.ts:67,
importLessons.ts:15, users.ts)

**B13 · App lock and "Hide sensitive previews" are decorative.** The switches save to Convex and nothing reads
them; no biometric module is installed; nothing covers the app-switcher snapshot. Settings shows "App lock ·
Face ID" even when off. A false privacy promise in this app is a trust and review problem. *Fix:* implement it
(expo-local-authentication, foreground gate, privacy cover) or remove the screen. (applock.tsx:15–74)

**B14 · Privacy copy promises what the code doesn't do.** "All your data will be encrypted" (onboarding),
"Yours, and only yours", "No one sees this but you" (journal) — nothing is encrypted beyond transport;
journals and slips are plain documents. "Pause analytics" pauses no analytics (none exist); it only stops
sending name/email to RevenueCat later. *Fix:* reword to what's true, or build field encryption; make the
privacy policy and App Store privacy label match. (onboardingFunnel.ts:59, privacy.tsx:35, journal-new.tsx:92)

---

## 2. The day and lesson model — your "incomplete lessons vs the day" concern

The root cause behind most of this section: **the app has two clocks and ignores progress.** The programme
day is `floor((now − account createdAt) / 24 h) + 1` — 24-hour blocks starting at the minute the account was
created — while every record (check-ins, week strip, score history, "yesterday") is keyed by calendar date.
And every lesson state (Library rows, Today's tile, Today's task, the night's action) comes from that day
number alone; whether a lesson was actually completed is never read back for pacing. So "the day" and "the
lesson the user is on" drift apart silently, and so do the day number and the dates the records land on.

**L1 · "Day N" turns over at the time of day the user signed up, not at midnight.** Someone who signed up at
19:40 sees the day, the lesson and the journal titles ("Day 2 pledge") change at 19:40 each evening, while
check-ins and the week strip change at midnight; for part of every day the morning asks about one lesson's
task while Today shows the next. DST moves "yesterday"/"tomorrow" (computed as ±86,400,000 ms) onto the wrong
date. *Fix:* one helper — calendar days between the local start date and today — used everywhere.
(board.tsx:19, morning.tsx:93–151, night.tsx:63–96, score.ts:62)

**L2 · The clock starts at account creation, not at Day 0.** Onboarding calls the evening "Day 0", but Today
counts from `createdAt`. A user who signs up, leaves at the paywall and returns a week later starts on lesson 8
with seven clean days credited. *Fix:* store a programme start (the local date onboarding finishes) and count
from it. (welcome.tsx:257, users.ts:29)

**L3 · Completion is never read back; future lessons can be "finished" for points.** A user who falls behind
sees unread lessons marked done and is pushed ahead; one who reads ahead isn't acknowledged and is offered the
same lessons again. The Library opens every future lesson and credits it — a day-1 user can "finish" the
course for +252 score and the Lessons medal; Today's task row deep-links to a page whose "Finish lesson" marks
the lesson complete unread. A ready-made `useCurrentLesson` (next unfinished lesson) exists in both backends
and is unused. *Fix (your decision):* progress-paced (current lesson = first unfinished) or day-paced but
honest (missed lessons shown as "catch up", done only when completed). (WeekPage.tsx:61, today.tsx:169,
lessons-browser.tsx:59)

**L4 · No end state after day 84.** From day 85 Today's tile says "Week I · Start the first lesson", and the
morning asks about an action Today never showed. *Fix:* a course-complete / review state.

**L5 · Today and Library freeze "now" when the tab first opens.** Tabs stay mounted and nothing listens for
the app coming back, so overnight the home screen shows yesterday's day, ticks go to yesterday's date, and the
"once an hour" launch prompt is really once per app process. Today also renders Day 1 / Lesson 1 until the
account loads. *Fix:* a `useToday()` clock refreshed on resume, tab focus and local midnight.
(today.tsx:118, library.tsx:26)

**L6 · Rows for days without a check-in are created and counted as check-ins.** The morning answer writes
yesterday's row, the night action writes tomorrow's, the task tick writes today's — and score, "Days in a row",
Pulse, First Light, Vidi, Rebound and Journey count rows. After every night check-in the Log shows tomorrow as
already checked in. *Fix:* count a check-in only when the row has mood/energy/emotions, or move the action
off the check-in table. (morning.tsx:137, night.tsx:95, score.ts:69, album.ts:88, log.tsx:165)

**L7 · A night check-in after midnight files the wrong date.** The app offers the night check-in until 04:30,
but the night flow uses the new calendar day — the day's record reads empty, "closed" lands on the wrong day,
and the next action is set two days out. For late-night users, that's most nights. *Fix:* before 04:30 the
night's day is yesterday. (night.tsx:66–97, routines.ts:40)

**L8 · Morning, night and the old check-in share one `mood` field on different scales.** The night check-in
overwrites the morning's mood, which Today then shows under "This morning"; the same 1–5 value is called four
different word sets on four screens. *Fix:* a separate night field and one shared word list per scale.

**L9 · The launch prompt reopens the check-in on every cold launch, even when it's done.** It never checks
whether today's check-in exists — so the ritual nags again, can sit between a user in an urge and the SOS
button, and each repeat files another pledge entry. The night check-in has no other door (only the prompt),
and the Log's "Daily check-in" silently opens the night flow in the evening. *Fix:* gate on completion, skip
the prompt on SOS launches, add a visible night check-in entry. ((app)/_layout.tsx:75)

**L10 · "Tonight's action" is filed as tomorrow's task (a two-day lag).** The lesson says "one thing left
today — the task"; that night it is "Tonight's action"; it is written to tomorrow's row, shown on tomorrow's
Today beside the next lesson, and asked about the morning after that. The morning also re-asks a task already
ticked on Today ("Not yet" unticks it). *Fix:* pick one model (today's task vs tomorrow's action) and align the
lesson copy, night, morning and Today. (night.tsx:75–201, morning.tsx:101)

**L11 · Lesson answers and notes are saved but never shown.** 32 lessons end with "Your answers are saved to the
log"; no screen reads them back, and reopening a lesson starts blank. *Fix:* prefill on reopen and/or a
"Lesson notes" list — or change the copy. (lesson/day/[day].tsx:50–119)

---

## 3. The recovery score — why it reads as "obviously AI"

**S1 · The formula and ranks are arbitrary.** Points accrue for time passing (clean days are credited with no
check-in, so an absent user climbs); there is no floor (a few slips drop it below the lowest rank, and Ranks
then shows no "You're here"); the top rank (Captain, 1,500) arrives around day 55, leaving the last month with
nothing to climb; the nautical ranks (Deckhand, Navigator, Helmsman, Captain) share nothing with the app's
Veni/Vidi/Vici language, and the Roman numeral just restates the rung's index; Today's 30-day chart stretches
any change to full height with no scale; the flame "streak" is days since sign-up and never resets; and Today's
▲, the morning ledger and the record row give three different answers to "what did today add". *Fix (your
decision):* a model you can explain in one line — points only for things the user did, a fixed cost for a slip,
no credit for silence — ranks spread over the 12 weeks in the app's own vocabulary, a scaled chart, a real
streak or no flame, and a short "How the score works" note. (score.ts:12–68, score.tsx, today.tsx)

**S2 · Starting Score shows "1,000 of 1,000" to everyone after a fake 6.8-second loader.** None of the answers
feed it; one screen later Today shows 1,004 — above the gauge's maximum — and it's called "Your VICI rating"
here and "Recovery score" everywhere else. *Fix:* compute a real starting figure, or present 1,000 as an opening
balance without an "of 1,000" scale; one name. (tail.tsx:143–224, welcome.tsx:316)

**S3 · Two ways to log a slip with different effects.** The urge log's "I slipped" writes `urge_acted_on`;
`/lapse`, `/slip` and `/relapse` write `lapse`. The score, Today's week strip and the morning/night counts only
see `lapse`; the Log, hub, weekly report and medallions see both; the morning even counts `urge_acted_on` as an
urge *surfed*; Black Box ("First slip logged") only sees `urge_acted_on`. The week strip marks a slip day
"held", and "Pledge kept" is ticked on a slip day. *Fix:* one `isSlip()` used everywhere.
(urge-log.tsx:65, score.ts:63–190, weeklyReport.ts:150, today.tsx:153, morning.tsx:110)

**S4 · Counts include days before the account existed.** The hub's "Last 30 days" and Insights' "Days kept"
show a new user 30 clean days they never had — mid-urge. *Fix:* start at the programme's first day.
(hub.tsx:101, dashboard.tsx:48)

**S5 · Medal ladders that don't fit the course.** Lessons tops out at 110 lessons on an 84-lesson course
("Every lesson, finished" can never be earned; the quarter/half/three-quarter lines are wrong). Rebound's tiers
rise with the *number of slips* (Bronze at 10, Platinum at 100). *Fix:* [7, 21, 42, 63, 84] for Lessons;
rethink Rebound. (Medallion.tsx:375)

**S6 · The medallion post encloses "Vici, Tier I" that the album says isn't earned.** It's armed by the first
ridden urge; Vici's first rung needs five. Almost every user gets this contradiction. (medallion-post.tsx:39,
album.ts:90)

---

## 4. Placeholder and AI-looking content shipped to users

**P1 · Onboarding's cost, projection and plan boards are the designer's sample numbers.** The frequency answer
is never read: "This is your next 30 days" always says 9 of 30 "if the rate you reported stayed the same";
"One year from now" always shows 110 days; age 80 derives from the same 9/30; the line boards always show 5×
vs 2× a week; plan boards pad the user's answers with sample answers while saying "These came up together in
your answers". Personalised-looking predictions that are invented. *Fix:* derive from `freq`, or reword as
illustrations. (welcome.tsx:146–325, onboardingTail.ts:11, tail.tsx:263–466)

**P2 · Questionnaire answers are thrown away; a machine-built "reason" is quoted after every slip.** Onboarding
stores `whyStatement` as `"<goal>. The <trigger> window, guarded first."` — e.g. "i'm not sure yet. The when
i'm bored window, guarded first." The letter that arrives after a slip quotes it in bold as "the reason you
started" (or invents "I want to be present for the people I love"), and "Save to Log" files it permanently.
Life Map stores the user's pre-watching feelings as "values". *Fix:* ask for a real "why" or leave the line out.
(welcome.tsx:244, letter.tsx:43–108)

**P3 · Sample identity shown as the user's.** A blank name greets the user as "Sam, let's figure out…"; every
new user's first pledge is the designer's line ("The mornings are mine again"); with no pledge, an invented
one is shown as the user's signed words; Your Vow shows a canned vow "Signed" on a date that never happened,
and "Held for" resets to 0 every morning (it reads the newest Pledge entry, which each morning check-in
re-creates). (funnel.tsx:147, onboardingFunnel.ts:62, vow.tsx, pledge.ts)

**P4 · SOS and slip boards assume or invent.** The hub always says "This one is intense." (it never asks); the
frames' sample lines "Get out of bed." and "The relationship doesn't need solving tonight" are shown to
everyone; "You've outlasted this before" says "Waited out the timer" on every row; "Slip logged" credits a
change the user never chose; the lapse log says "one thing changed" but never asks what. (hub.tsx:172–414,
flow.tsx:538)

**P5 · Medallion and letter copy invents statistics and claims.** "The return is the strongest predictor",
"Most men vanish for a week after a night like that", references to pages that don't exist; letters framed as
personal ("A letter from day zero", "Week XII, from Sam", "— the you who makes it out") are identical for every
user; several lesson quotes are common misattributions without the course's usual "attributed" hedge; Rough
Days states unsupported mechanisms as fact. *Fix:* only claims you can source; present canned letters as from
VICI. (Medallion.tsx:282–399, medallion-post.tsx:59, letter.tsx:106)

**P6 · Purchase and trial copy that isn't true for the user.** iOS returns an intro price whether or not the
user is eligible, and eligibility is never checked — a returning user taps "Start free trial" under "three days
on us" and is charged the full year. The confirmation claims a receipt was emailed and tells a restored
subscriber they bought the yearly plan; the tier is called both "VICI Unlimited" and "VICI Plus".
(PaywallFlow.tsx:452–615, plans.ts:45)

**P7 · Profile controls that do nothing.** "Change photo"'s Take photo / Choose from library / Remove all just
close the sheet; "@username" is invented from the email; Username and Email rows show chevrons but can't be
edited. (profile.tsx:86–129)

**P8 · Consent defaults.** The "I'd like VICI updates via email" box is pre-ticked (not valid consent under
GDPR) and never stored; the under-18 gate's age is pre-filled "24". (sign-up.tsx:46–171)

---

## 5. SOS and slips

**F1 · The urge hub (Today's "Urge surfing") records nothing.** Riding an urge out there writes no event — no
medal progress, no score, nothing in the Log — while the same work through the SOS button is counted. The
three chips (Bored / Relationship / Work or school) save to a session nothing reads; reopening the hub restarts
the ring at 20:00; at 0:00 nothing happens. (hub.tsx:154–452)

**F2 · A back-swipe or Android back exits the whole SOS or slip flow.** Both are single routes with internal
steps and swipe-back enabled, so trying to change an answer mid-urge drops the user out, logging nothing; in
`/slip` it discards the slip. *Fix:* disable the gesture on those routes and route back to the previous step.
(_layout.tsx:84, flow.tsx:489, slip.tsx:109)

**F3 · Unanswered ratings are stored as answers.** A skipped strength is logged as "Intense" (8), an untouched
reassess as "Noticeable"; the urge log pre-selects "Rode it out" and "Intense". These feed every strength chart
and the weekly average. (flow.tsx:130–603, urge-log.tsx)

**F4 · SOS answers are never read back.** "What's feeding it" is stored where no trigger chart looks, so a user
who only uses SOS sees "Log an urge and its trigger" on Insights forever; the "note for tomorrow" never comes
back; closing SOS early logs nothing even after re-rating; "Done" appears on six boards that aren't the end; the
Sound setting (Ocean/Rain/Silent) does nothing; a half-built resume never resumes and can silence launch
prompts. (flow.tsx:600, dashboard.tsx:55, urge-overview.tsx:82)

**F5 · The slip flow's "Sign it again" stores nothing**, so the hub keeps "Signed N days ago" without "Kept every
day since", and the next slip skips the pledge board. `/relapse`'s "Change the pledge" opens the whole morning
check-in. (slip.tsx:388, relapse.tsx:79)

---

## 6. Unfinished, leftover and dev screens

**U1 · Built features with no door in production.** Support, Rough Days (+ protocols, first-90), Life Map,
Insights, Mail, Back Tap, the sentence journal, First Steps, the Journey campaign and Locked weeks are reachable
only from the dev drawer. Some contradict the 84-day course (Journey runs 90 days; Locked says "You've finished
week one"); `/relapse` is an older duplicate of `/slip` that logs a bare lapse. *Fix (your decision):* link the
ones you want (Support at minimum), delete the rest. ((app)/all.tsx:57–127)

**U2 · Dev routes and the router's default 404 are reachable by link.** `tideline://all` opens the developer
drawer on a release build; `tideline://kit-lab` is a blank screen with no way out; any unknown link (including a
Clerk redirect to `/sso-callback` on Android) opens expo-router's unstyled "Unmatched Route" page with a Sitemap
link listing every route; `report-ready?week=x` shows "undefined NaN – undefined NaN". *Fix:* a mono
`+not-found`, guard `/all` and `/kit-lab`, validate params.

**U3 · Old UI and unused packages still ship.** Three live routes import the old `@/components/ui` barrel
(SplashScene, WaterlineScene, LoadingView), which pulls ~24 old modules into the bundle; `/checkin` and the night
boards still use `MoodLogger`; unused fonts (EB Garamond, Fraunces, Hanken Grotesk, Newsreader) and native
modules (@expo/ui, expo-glass-effect, expo-symbols, expo-blur, expo-device, expo-image) are still linked; dead
modules (`worlds.ts`, `lessonArt.ts`, the dashboard aggregation) and the 14 orphaned reader files remain.

**U4 · Back on the first onboarding question sends a signed-in user to a Login that can't work.** Under Clerk
every button there fails ("already signed in"), with no way forward except force-quitting.
(welcome.tsx:273, (auth)/_layout.tsx:17)

---

## 7. Data and accounts

**D1 · Per-device state isn't per account.** About twelve `tideline.*` AsyncStorage keys (letter and post
delivery, report-seen, check-in times and days, SOS settings, arrival flags) ignore the user: on a shared phone
account B sees A's "a letter arrived" after A's slip; a reinstall resets check-in times and re-delivers reports.
The sign-out sheet promises it's all "saved to your email". *Fix:* namespace by user, move account-level state
to Convex, clear on sign-out.

**D2 · Onboarding lives in memory.** The ~44-step funnel is React state in one route: an app kill restarts it
at question 1, and a user who already paid walks back into the paywall and is offered "Start free trial"
again. "Begin" twice writes the Day 0 letter twice; "Done" in a check-in can save twice. *Fix:* persist step
and answers per user; skip the paywall when entitled; in-flight guards. (welcome.tsx:97–250)

**D3 · Journal entries can't be deleted**, though the backend supports it; the only list is titled "Past
pledges" but shows letters, reflections, vows and the daily auto-pledges, and opening a letter makes it
editable. (journal.tsx:42)

**D4 · Life Map spins forever on Convex** when the account has no row (the mock always has one). (convex.ts:120)

**D5 · RevenueCat identity.** The SDK starts anonymous and mirrors `premium=false` before `logIn`; a failed `logIn`
is never retried, so a paying user can read "Free" until restart. *(Depends on the live store.)*
(revenuecat.tsx:105–172)

---

## 8. Reports and labels

**R1 · Weekly reports.** Weeks are stepped back by 7×24 h, so after a spring DST change every older report keys
to a Sunday and the first week vanishes (from March for every US/EU user); a Sunday sign-up is told a report is
ready on day 2; Settings says "Every Sunday", which isn't how delivery works. (weeklyReport.ts:28)

**R2 · "Your letter · Opens Week XII" opens on day 1** and is never delivered at Week XII. (settings.tsx:88,
letter.tsx:77)

**R3 · Small display bugs.** Urge Overview says "Nothing logged" under urges it just charted and shows a private
SOS note as a "place"; Today says "Good morning." until 18:30. (urge-overview.tsx:78)

---

## Decisions only you can make

1. Crisis resources: which lines and services, and for which regions (B2).
2. What the subscription unlocks (B9).
3. How the course is paced: by calendar day or by the next unfinished lesson; and whether Day 1 is the morning
   after Day 0 (L1–L3).
4. Whether the lesson's task is "today's task" or "tomorrow's action" (L10).
5. The recovery score's model and rank names (S1, S2), and what Rebound rewards (S5).
6. Whether to build App lock, notifications and data export now, or remove those promises (B1, B13, B5).
7. Which drawer-only features to link and which to delete (U1).
8. Wording for invented numbers and claims: personalise them or present them as illustrations (P1, P5).

## Suggested order

1. **Store and safety blockers:** B6 (name/icon), B8 (.easignore, quick), B4 (production config + fail-loud), B3 (auth),
   B5 (legal links, deletion, renewal line), B7 (real prices), B2 (crisis help), B12, B11, B10.
2. **Promises that do nothing:** B1 (notifications), B13 (app lock), B14 (privacy copy), P6, P7, P8, F5.
3. **The day/lesson/score model** as one piece of work: L1–L10, S1–S6 — they share the same helpers
   (`dayNumber`, check-in counting, `isSlip`) and should change together.
4. **Content honesty:** P1–P5.
5. **SOS fixes** F1–F4, then U1–U4, D1–D5, R1–R3.
