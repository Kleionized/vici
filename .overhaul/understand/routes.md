# Group `routes` — every route, how it is reached, which frame draws it, and the app-wide UI

Analysis for the `Vici Overhaul` run (Oct 2026). Read-only pass: nothing under `src/` was changed.
This document is the map the implementation agents use to find a screen, its door, its frame (or
its closest analog when it has none), and the shared UI (tab bar, sheets, loading / empty / error
states, keyboard, boot, status bar) that every screen depends on.

Sources: every file under `src/app` (66 files: 4 layouts + 62 screens, all read), `grep` of every
`router.push / replace / navigate`, `<Redirect>`, `href` and data-driven `to:` / `route:` string in
`src/`, `.overhaul/FLOW.txt`, `.overhaul/groups.json`, `.overhaul/recipes/*.json`,
`.vicifull/map.json`, the other group analyses in `.overhaul/understand/*.md` (cross-referenced, not
repeated), the designer kit `Vici Overhaul/project/gen/mono-kit.js`, and `body.mjs` dumps of the
frames named below. Frame numbers are canvas px (393 × 852, status bar 0–54 included); the app
offset rule is BRIEF rule 1 (app `top` = canvas − 54 under the safe area).

---

## 0. The short version

1. **62 screens.** 38 are drawn by at least one frame; **24 have no frame** (some partially). Of
   the 24, **16 can only be reached from the `All` review drawer** (`src/app/(app)/all.tsx`), which
   is itself a tab the canvas does not draw. Removing `All` from the bar (the new bar has exactly
   Today · Log · SOS · Library · Journey) orphans all 16 unless a door is kept (§5.4, OQ-R1).
2. **The new tab bar maps to:** Today → `/(app)/today`; Log → `/log-chooser` (D124 kept; Log is
   *active* on `/log`); SOS (centre disc, a button, never active) → `/urge` recommended (sos-flow Q1);
   Library → `/(app)/library`; **Journey → `/(app)/milestones`** (Medallions). Journey is also the
   active tab on **`/score`** (Score Detail ×3 draw it). The old `/journey` campaign routes are a
   different thing with a colliding name (§2.6).
3. **Two framed screens that draw the bar live outside the tab navigator** — `/score` and
   `/week/[week]` — so today they render no bar at all. Either move them under `(app)` as hidden tab
   screens or make the bar a standalone component (§5.3).
4. **Every unframed screen is still in the previous paper system** (`#F4F3F0` grounds, `#1D1C1A`
   ink, `#131313` pills, white cards, `noise-dark.png` @ 0.07, labelled "Back" chevrons, serif-era
   sizes 27/600). Each has a recommended analog frame below with its exact kit numbers (§4).
5. **41 screens set `<StatusBar style="dark">`** on what is now a dark ground — dark glyphs on
   `#0D0D0D` on a device (invisible in web captures). Every frame's status bar is light (`#F2F0EC`,
   or `#FFFFFF` on the ten `#111111` frames). `(onboarding)/_layout.tsx` even says "light glyphs" in
   its comment while setting `dark`. All must become `light` (§11).
6. **No frame draws a loading, empty or error state.** There are 13 `LoadingView` spinners, 4
   `EmptyState`s (with the retired paper `tide` illustration), 6 screens that render `null` on a bad
   param or while loading, one `#B5624F` (a hue) auth error line, and native `Alert`s for the store.
   New styles in §7–§9.
7. **No frame draws a keyboard.** Every text-entry frame is keyboard-down; six inputs have no
   keyboard avoidance at all and their bottom-pinned primaries (bottom 48 / 96) will be covered on a
   device (§10).
8. Bugs found on the way (not visual, but they block review of a screen):
   `All → "A rough-day protocol"` pushes `/rough-protocol?key=lonely`, but the key is `loneliness`, so
   the screen renders `null` (blank). `first-steps.tsx` says it opens "from the Today card" — nothing
   pushes it any more. `MoodLogger` (the modal export in `src/components/MoodLogger.tsx`),
   `CampaignMap`, `CampaignGrounds` are dead exports. `/(app)/journal` is titled "Past pledges" but
   lists every journal tag. `backtap`'s deep link `tideline://urge` matches `app.json`'s scheme
   (`tideline`) — fine.

---

## 1. Navigation structure (layouts)

| layout | file | what it does | overhaul notes |
| --- | --- | --- | --- |
| Root stack | `src/app/_layout.tsx` (orchestrator) | Loads Lato 400/700/700i/900, holds the native splash until fonts are in (`return <View bg=colors.bg/>` meanwhile), wraps `GestureHandlerRootView` → `SafeAreaProvider` → `CanvasInsets` (mock web: `{top:54}`; window < 700 tall: `{top:20}`) → `AppProviders` → `<StatusBar style="light"/>` → `Stack` with `headerShown:false`, `contentStyle: {backgroundColor: colors.bg}` (#0D0D0D), `animation:'slide_from_right'`, 260 ms, gesture on. Per-screen: `letter` → `animation:'fade', gestureEnabled:false`; `first-steps` and `lessons-browser` → `presentation:'modal'`. | Already on the new ground and fonts. **`presentation:'modal'`** draws an iOS page sheet (previous screen peeking above a rounded card, ~10pt from the top) on native — no frame draws that; both screens are unframed, so either drop the option (plain push) or use `fullScreenModal` (OQ-R4). For `/affirmation` (a sheet over a page) `presentation:'transparentModal'` + `animation:'fade'` would let the real page show under the 0.68 scrim instead of its painted skeleton (§4.8). |
| `(auth)` stack | `src/app/(auth)/_layout.tsx` | Door guard: signed-in **and** onboarded → `<Redirect href="/">`. Otherwise a bare `Stack` (inherits root options). | No visual. Keep (D122: Name's Back returns to Login during onboarding). |
| `(onboarding)` stack | `src/app/(onboarding)/_layout.tsx` | Signed out → `/`; onboarded → `/(app)/today`. `<StatusBar style="dark"/>` (comment says light), `Stack` `gestureEnabled:false`, `contentStyle: colors.night.bottom` (= #0D0D0D). | **Fix the StatusBar to `light`.** Not in the orchestrator's owned list; auth-funnel or this group may take the one-word change. |
| `(app)` tabs | `src/app/(app)/_layout.tsx` (orchestrator) | Auth + onboarding guards; **launch gate** (once per mount, skipped on `/all`, waits for checkins + events): pending urge session → stay; `tideline.letter.pending` → push `/letter`; post pending → push `/medallion-post`; a newly closed week with content → push `/report-ready?week=`; else at most hourly → push `/day/morning` or `/day/night` (`checkinPartNow()`). `Tabs` with `tabBar={() => <StoicTabBar/>}` and 12 screens: today, log, library, all, dashboard, lifemap, settings, support, locked, journal, milestones, rough-days. | Bar rules change (§5). Keep the gate exactly; its four arrivals are framed (Letter Arrival, Medallion Letter, Report Ready, Morning/Night Check-in Cover). |

There is no layout for any other folder (`day/`, `lesson/`, `medallions/`, `journey/`, …) — every
non-tab screen is a plain root-stack push.

---

## 2. Route inventory

Columns: **URL** (expo-router path; group segments are not part of the URL) · **file** · **reached
from** (every caller found by grep; "All" = the `All` drawer row) · **reach** (`yes` = reachable in
normal use; `All only`; `gate` = pushed automatically) · **renders** · **frames** (Email-Login labels
unless a bundle is named) · **owner** (the analysis group whose doc specifies it; `routes` = this doc).

### 2.1 Boot, auth, onboarding

| URL | file | reached from | reach | renders | frames | owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | `src/app/index.tsx` | cold launch; every guard's `<Redirect href="/">`; sign-in/up/welcome-back success `replace('/')`; settings sign-out `replace('/')`; All "Cold open" | yes | Boot decider: while auth/user resolve shows `SplashScene`, after 900 ms `WaterlineScene`; then redirects to `/(auth)/splash`, `/(onboarding)/welcome` or `/(app)/today` | Splash (the waiting face). `WaterlineScene` has no frame | auth-funnel (§7.1 there) |
| `/splash` | `src/app/(auth)/splash.tsx` | `index` redirect when signed out; All | yes | `SplashScene`, then `replace('/(auth)/sign-in')` after 900 ms | Splash | auth-funnel |
| `/sign-in` | `src/app/(auth)/sign-in.tsx` | splash; sign-up "back"; welcome-back footer; onboarding Name Back (`backToDoor`) | yes | Login door (`AuthDoor`): Apple, Google, "or", email row → `/sign-up?step=form`, footer → `/welcome-back` | Login | auth-funnel |
| `/welcome-back` | `src/app/(auth)/welcome-back.tsx` | sign-in footer; All | yes | Returning door + address / password / code steps | Welcome Back (door only); inner steps **no frame** | auth-funnel (§7.2) |
| `/sign-up` | `src/app/(auth)/sign-up.tsx` | sign-in email row (`?step=form`); All | yes | Gate (3 ways in) + form (name, email, optional password, updates checkbox) + verify | **no frame** (withdrawn a drop ago) | auth-funnel (§7.2) |
| `/welcome` | `src/app/(onboarding)/welcome.tsx` | `index`/guards when `!onboardingComplete`; All | yes | The whole funnel + tail + handover + paywall (`PaywallFlow` embedded), ends `replace('/routines/morning-time')` | V3 Q24…Goal Confirmation; Enlisting Aegis…What You Want Back; Letter Received, Letter Week XII, The Vow, Medallion Received, Reminders Setup, Paywall, Paywall Rescue, Paywall Confirmed, Day Zero | auth-funnel, tail, paywall-reminders |
| `/routines/morning-time` | `src/app/routines/morning-time.tsx` | onboarding end; settings `?from=settings`; All | yes | Time wheel + day discs; onboarding path pushes `/routines/night-time` | Morning Check-in Time | paywall-reminders |
| `/routines/night-time` | `src/app/routines/night-time.tsx` | morning-time; settings `?from=settings`; All | yes | Time wheel + day discs; onboarding path `replace('/(app)/today')`, settings path `back()` | Nightly Check-in Time; Settings Check-in Time (`?from=settings`) | paywall-reminders / settings |

### 2.2 The tab group `(app)`

| URL | file | reached from | reach | renders | frames | owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/today` | `src/app/(app)/today.tsx` | tab Today; `index`; every `replace('/(app)/today')` fallback | yes | 3-page vertical pager: score/mood (→ `/score`, `/day/morning`), task + lesson (→ `/task/N`, `/lesson-card/N` or `/lessons-browser` after day 84, `/(app)/library`), pledge (→ `/(app)/journal`); settings glyph → `/(app)/settings`; pinned ink urge bar → `/urge-hub` | Today Home, Today Home II, Today Home Task, Today Home III | today-day |
| `/log` | `src/app/(app)/log.tsx` | log-chooser close X (`navigate`); urge-log / lapse / urge-overview fallbacks; All | yes | Register with Urges / Check-ins / Reports switch; back → `/log-chooser`; reports → `/weekly-report?week=` | Log Urges, Log Check-ins, Log Reports | logs |
| `/library` | `src/app/(app)/library.tsx` | tab Library; Today `onLibrary`; search / week / locked / rough-days / dashboard fallbacks; All | yes | All 12 week boards end to end in one scroll | (none of its own) — Week I…XII (+P2) are the closest; library doc recommends the tab **be** the week pages | library (§9 there) |
| `/all` | `src/app/(app)/all.tsx` | tab **All** (`SHOW_ALL_TAB = true`) | yes (tab) | Review drawer: 8 groups, 66 rows linking every route (§2.10) | **no frame** | routes (§4.1) |
| `/milestones` | `src/app/(app)/milestones.tsx` | profile Medallions row; dashboard; medallion detail / tiers fallbacks; All; **new tab Journey** | yes | Medallions album, Earned / Still to earn segments, tap → `/medallions/<key>?tier=` | Medallions, Medallions Still To Earn, Album Earned II | medallions-letters |
| `/settings` | `src/app/(app)/settings.tsx` | Today settings glyph (new: avatar); many fallbacks; All | yes | Four captioned groups, Sign-out sheet | Settings, Sheet Sign Out (and entries to Settings Weekly Report / Settings Check-in Time) | settings |
| `/journal` | `src/app/(app)/journal.tsx` | Today page 3 "Past pledges"; journal-new fallback; All | yes | "Past pledges": every journal entry (all tags) as white cards; tap → `/journal-new?id=` | **no frame** | routes (§4.2) |
| `/dashboard` | `src/app/(app)/dashboard.tsx` | All; mail + weekly-report back fallbacks | All only | "Insights": mood heatmap (2W/4W/12W), 3 numerals, 4 trigger bars, doors to `/mail` and `/milestones` | **no frame** | routes (§4.3) |
| `/lifemap` | `src/app/(app)/lifemap.tsx` | All | All only | Life Map editor: why, one-year answer, value chips, add-your-own, save | **no frame** | routes (§4.4) |
| `/locked` | `src/app/(app)/locked.tsx` | All | All only | "Weeks": week I walked, 3 ghosted weeks, mist vignette, "N more weeks ahead", Unlock → `/paywall` | **no frame** | library (§11 there) / routes (§4.5) |
| `/rough-days` | `src/app/(app)/rough-days.tsx` | All; rough-protocol fallback | All only | Shelf: "The First 90 Seconds" ink card → `/rough-first90`; 7 protocol rows → `/rough-protocol?key=` | **no frame** | routes (§4.6); sos-flow flags ownership |
| `/support` | `src/app/(app)/support.tsx` | All (Settings' "Find support" row was removed against the canvas) | All only | Crisis / professional-help placeholders (README invariant #5) | **no frame** | routes (§4.7); settings proposes taking it |

### 2.3 Daily (score, check-ins, reminders)

| URL | file | reached from | reach | renders | frames | owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/score` | `src/app/score.tsx` | Today page 1 `onScore` | yes | Recovery score detail, Months/Moves/Ranks | Score Detail, Score Detail Moves, Score Detail Ranks (**draw the tab bar, Journey active**) | today-day |
| `/day/morning` | `src/app/day/morning.tsx` | launch gate; Today `onMorning`; slip morning-after; relapse "Change the pledge"; `/checkin?part=morning` redirect; All | yes (gate) | 7-step morning check-in + Change Pledge sheet | Morning Check-in Cover … Morning 5 Done, Change Pledge Sheet | today-day |
| `/day/night` | `src/app/day/night.tsx` | launch gate; All | gate | 7-step night check-in (→ `/urge-log` from Record) | Night Check-in Cover … Night 4 Closed | today-day |
| `/checkin` | `src/app/checkin.tsx` | log-chooser "Daily check-in"; All | yes | `CheckinFlow` (mood orb + slider, emotions, reasons); `?part=morning` → `<Redirect href="/day/morning">` | **partial** — Checkin Emotions, Checkin Reasons; the mood step's closest is Night 1 Mood | today-day (its §5 row) |
| `/affirmation` | `src/app/affirmation.tsx` | All | All only | Sentence-journal sheet: prompt, reroll, one line, save; custom-prompt mode | **no frame** | routes (§4.8) |
| `/first-steps` | `src/app/first-steps.tsx` | All (comment claims a Today card; none exists) | All only | Checklist sheet of the first 6 lessons | **no frame** | routes (§4.9) |
| `/notify-primer` | `src/app/notify-primer.tsx` | All | All only | Notification primer: 9-dash rail, ✕, two lock-screen banners (retired copy), "Turn on reminders" / "Not now" (both just close) | **no frame** | paywall-reminders (§8 there) |
| `/reminders` | `src/app/reminders.tsx` | All | All only | Two banners + "Turn on reminders" (writes `morningCheckin`, `riskTimeSupport`) | **no frame** | paywall-reminders (§8 there) |

### 2.4 Library and lessons

| URL | file | reached from | reach | renders | frames | owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/week/[week]` | `src/app/week/[week].tsx` | lesson-card "Back to Week N" + close fallback (`replace`); All | yes (indirect) | One week board; rows → `/lesson-card/N`; returns `null` for a bad week | Week I Reset … Week XII Leave It Behind + P2 (24, **draw the tab bar, Library active**) | library |
| `/lesson-card/[day]` | `src/app/lesson-card/[day].tsx` | Today lesson tile; week rows (`WeekBoard`); search; lessons-browser; first-steps; reader close fallback; All | yes | Paper sheet: 7-dot week rail, plate, title, summary, "Start lesson" → `/lesson/day/N`, "Back to Week N"; `null` for a bad day | **no frame** in this drop — the new reader's `L<n> Frame 1` (cover, "Begin") replaces it | lessons (library §5 notes the card may be retired) |
| `/lesson/day/[day]` | `src/app/lesson/day/[day].tsx` | lesson-card "Start lesson"; All | yes | Tap-to-advance reader over `LESSON_READER[n]`; `null` if no pages | `Week-NN-*/L<n> Frame k` (84 lessons, 14–16 frames each); Email-Login `Lesson Scroll 1–14` = `L1 Frame 1–14` byte-identical | lessons / lesson-scroll |
| `/task/[day]` | `src/app/task/[day].tsx` | Today task card `onStep` (when the day has a lesson); All | yes | Task Intro + Options boards (previous drop); `null` for a bad day | **no frame** in this drop — the task is now inside the reader (`L1 Frame 12` "Today’s task", `Frame 13` "Done when" + "Finish lesson"); Today Home Task draws the summary card | lessons |
| `/lessons-browser` | `src/app/lessons-browser.tsx` | Today lesson tile **only when the day has no lesson (day > 84)**; All | rarely | 12 horizontal shelves of 118×168 paper tiles with plates; Cancel; search glyph → `/search` | **no frame** | library (§11 there) / routes (§4.10) |
| `/search` | `src/app/search.tsx` | lessons-browser search glyph; All | rarely | Search field, 3 recent chips, result count, result cards → `/lesson-card/N` | **no frame** | library (§11) / routes (§4.11) |
| `/journey` | `src/app/journey/index.tsx` | All; chapter fallback | All only | The old four-chapter campaign, one scroll (`JourneyScroll`), labelled Back | **no frame** (Campaign Map I–III withdrawn this drop) | routes (§4.12) |
| `/journey/[chapter]` | `src/app/journey/[chapter].tsx` | All (`landing`, `crossing`, `highlands`, `watch`) | All only | One chapter (`JourneyChapter`), unknown key → `landing` | **no frame** | routes (§4.12) |

### 2.5 SOS, slip

| URL | file | reached from | reach | renders | frames | owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/urge` | `src/app/urge.tsx` | relapse "Back to the wave tool" (`replace`); All; **new SOS tab disc (recommended)** | All only today | `UrgeFlow` — intro → strength → where → 3 moves → reason → feeling → boards → reassess → afterward → SOS stages → done | Cue Intro Modal … Surf Complete; SOS Loc/Feel/Trig boards (30) | sos-flow, sos-boards |
| `/rough-first90` | `src/app/rough-first90.tsx` | rough-days ink card; All | All only (via rough-days) | Same `UrgeFlow` | same as `/urge` | sos-flow |
| `/rough-protocol` | `src/app/rough-protocol.tsx` | rough-days rows (`?key=`); All (`?key=lonely` → **blank**, bug) | All only | `RDMovePage` × 3 per protocol (paper sheet, dots, art, CTA, ghost) ; `null` on unknown key | **no frame** | routes (§4.6) |
| `/urge-hub` | `src/app/urge-hub.tsx` | Today urge bar (new: Today II/III "Urge surfing" card); slip "still watching"; backtap "Test it now"; All | yes | Five-pane hub + Breathe pill + "I slipped" → `/slip` | Urge Hub Now, Score, Proof, Surfed, Pledges, **Urge Hub Breathe (new)** | sos-flow |
| `/relapse` | `src/app/relapse.tsx` | All (D147 moved SOS's "I slipped" to `/slip`) | All only | 4 boards: log, twice, re-sign (→ `/day/morning`), begin again | Relapse Log, Relapse Twice, Relapse Resign, Relapse Begin | sos-flow |
| `/slip` | `src/app/slip.tsx` | urge flow "I slipped" (`replace`), hub "I slipped"; All; `?stage=morning` | yes | 12-step post-slip flow + feel/trigger cards; → `/urge-hub`, `/vow`, `/day/morning`, `/(app)/today` | Slip Entry … Slip Morning After; Slip Feel ×8; Slip Trigger ×11 | slip |
| `/backtap` | `src/app/backtap.tsx` | All | All only | Back Tap setup: copy deep link, 4 steps, open Shortcuts, test → `/urge-hub` | **no frame** | settings proposes (§12 there) / routes (§4.13) |

### 2.6 Log family, mail

| URL | file | reached from | reach | renders | frames | owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/log-chooser` | `src/app/log-chooser.tsx` | **tab Log**; log back chevron; All | yes | Three cards (Daily check-in → `/checkin`, An urge → `/urge-log`, A lapse → `/lapse`), Continue, ✕ → `/(app)/log` | Log Chooser | logs |
| `/lapse` | `src/app/lapse.tsx` | log-chooser; All | yes | When → What fed it → Logged | Lapse When, Lapse Trigger, Lapse Done | logs |
| `/urge-log` | `src/app/urge-log.tsx` | log-chooser; night Record; slip; All | yes | Intensity → Triggers → Outcome → When → Logged | Urge Log Intensity … Urge Log Done | logs |
| `/urge-overview` | `src/app/urge-overview.tsx` | weekly-report Urges page "open" (`?week=`); All | yes | Summary / Strength / Mood / Timing segments | Urge Overview Summary, Urge Overview, Urge Overview Mood, Urge Overview When | logs |
| `/report-ready` | `src/app/report-ready.tsx` | launch gate (`?week=`); All | gate | Arrival card; Open → `replace('/weekly-report?week=')`; Later | Report Ready | logs |
| `/weekly-report` | `src/app/weekly-report.tsx` | report-ready; log Reports rows; mail; settings (`?from=settings`); profile "Weekly reports"; All | yes | Score / Days / Urges segments | Weekly Report, Weekly Report Days, Weekly Report Urges; Settings Weekly Report (byte-identical) | logs |
| `/journal-new` | `src/app/journal-new.tsx` | journal row (edit, `?id=`); All "Write a pledge" (create) | yes (edit) | Journal editor: Cancel / timestamp / Save, 3 tag chips, title + body inputs, decorative B/I/U toolbar | **no frame** | routes (§4.14) |
| `/mail` | `src/app/mail.tsx` | dashboard "Your mail"; All | All only | List of weekly reports + medallion post + day-zero letter; empty state | **no frame** | routes (§4.15) |

### 2.7 Medallions, letters, drop

| URL | file | reached from | reach | renders | frames | owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/medallions/[key]` | `src/app/medallions/[key].tsx` | milestones faces (`?tier=`); All | yes | Medallion detail; pill → tiers; unknown key → `EmptyState "Medallion not found"` | Breakwater Paper…Platinum, Detail Paper…Platinum | medallions-letters |
| `/medallions/tiers/[key]` | `src/app/medallions/tiers/[key].tsx` | detail pill; All | yes | Tier ladder; unknown → `EmptyState` | Tiers Vidi … Tiers One-offs (9) | medallions-letters |
| `/letter` | `src/app/letter.tsx` | launch gate; mail; settings "Your letter" (`?variant=week12`); All | gate / yes | Arrival → letter sheet | Letter Arrival, Letter Read; `?variant=week12` → Letter Received, Letter Week XII (handover frames) | medallions-letters, tail |
| `/medallion-post` | `src/app/medallion-post.tsx` | launch gate; mail; All | gate | Arrival (medallion) → letter sheet → "Open the enclosure" `/drop` | Medallion Letter (read phase); **arrival phase has no frame** (Medallion Received / Letter Arrival analog, medallions-letters Q10) | medallions-letters |
| `/drop` | `src/app/drop.tsx` | medallion-post enclosure; All | yes (indirect) | Yearly drop offer; → `/subscription`; store `Alert`s | Yearly Drop, Drop Received | medallions-letters |

### 2.8 Account, settings, purchase

| URL | file | reached from | reach | renders | frames | owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/profile` | `src/app/profile.tsx` | settings "Edit profile"; All | yes | Profile, photo sheet + name sheet (RN `Modal`), Medallions → `/milestones`, Weekly reports → `/weekly-report` | Edit Profile, Sheet Profile Photo, Sheet Edit Name | settings |
| `/vow` | `src/app/vow.tsx` | settings "Your vow"; slip "Read my pledge"; All | yes | The signed vow card | Your Vow Page | settings |
| `/privacy` | `src/app/privacy.tsx` | settings "Data & privacy"; All | yes | Data & privacy | Data Privacy | settings |
| `/applock` | `src/app/applock.tsx` | settings "App lock"; All | yes | App lock toggles | App Lock | settings |
| `/subscription` | `src/app/subscription.tsx` | settings "Manage subscription"; drop; All | yes | Manage subscription; "Change plan" → `/paywall`; restore `Alert`s | Manage Subscription | paywall-reminders |
| `/paywall` | `src/app/paywall.tsx` | subscription "Change plan"; locked "Unlock VICI Plus"; All | yes | `OfferingPaywall` (RevenueCat) or drawn `PaywallFlow` | Paywall, Paywall Rescue, Paywall Confirmed | paywall-reminders |

### 2.9 Reachability summary

* **Reachable only from `All`** (16): `/dashboard`, `/mail` (via dashboard), `/lifemap`, `/locked`,
  `/rough-days`, `/rough-protocol`, `/rough-first90` (via rough-days), `/support`, `/affirmation`,
  `/first-steps`, `/notify-primer`, `/reminders`, `/backtap`, `/journey`, `/journey/[chapter]`,
  `/relapse`. `/urge` joins them unless the SOS disc opens it. `/journal-new` *create* mode is All-only
  (edit mode is reachable from `/journal`).
* **Rarely reachable:** `/lessons-browser` (Today, only after day 84) and `/search` (only from it).
* **Indirect:** `/week/[week]` (only via a lesson card's "Back to Week N" — the Library tab draws the
  boards inline), `/drop` (only via the medallion post).
* **Gate-only:** `/day/night` (and `/report-ready`, `/letter`, `/medallion-post` arrivals) — pushed by
  the `(app)` launch gate; nothing on the new Today frames opens the night check-in.
* **Dead components** (no route renders them): `MoodLogger` modal (`src/components/MoodLogger.tsx`
  l.667; its `CheckinFlow`/boards are live), `CampaignMap` / `CampaignGrounds`
  (`src/components/journey/JourneyScreens.tsx`), and `src/components/onboarding/art.tsx`
  `CampaignMapField/Rail` once tail removes the withdrawn `reading` step.

### 2.10 Frames that no route reaches (for completeness)

`SOS Loc Bathroom`, `SOS Loc Home Alone`, `SOS Trig Rejection` (no picker card leads to them — sos
recipes, D146); `Urge Hub Breathe` (new screen, sos-flow §3.23); `Line If Nothing Changes` / `Line
With the Plan` (new, replace `Change the Line` — tail); `Morning Pledge Signed` (today-day). Withdrawn
since `.vicifull`: `Change the Line`, `Campaign Map I–III`, `Lesson Scroll 15–26`.

---

## 3. The kit vocabulary used below (exact numbers, from the frames)

These are the pieces the unframed screens are restyled with. Every one is quoted from a frame dump;
where the kit source disagrees, the frame wins (noted).

| piece | spec (canvas px) | source frame |
| --- | --- | --- |
| **frame** | bg `#0D0D0D`; `noise.png` @ 0.05 `inset:0` (Email-Login). Lesson readers: `noise-dark.png` @ 0.06. The ten `#111111` frames: `noise-dark.png` @ 0.09. Assets already in `assets/images/` (md5 identical). | every frame |
| **nav** | row `top 60 h 40 padding 0 22 space-between z5`. Left slot 36×40: chevronL `<svg 12×20 viewBox 0 0 12 20><path d="M10 2L2 10l8 8" stroke #F2F0EC sw 2.2 round/round>` → (22,70). Centre: title 13/700 `#9B968E` nowrap, **or** 8 dashes `24×2 r1 gap 6` (`#F2F0EC` lit / `#2E2E2E`), or empty. Right slot 36×40 `justify flex-end`: closeX `<svg 18×18><path d="M2 2l14 14M16 2L2 16" sw 2 round>` → (353,71), or empty. **No "Back" word anywhere.** | Settings, App Lock, Night 3 Reflection, SOS Feel * |
| **title head** | chevron as nav; title `left 24 right 24 top 108` **32/700 ls −0.6 lh 38** `#F2F0EC`; optional right pill `h32 r16 #1E1E1E padding 0 14` 13/700 `#F2F0EC` nowrap, ending at x 371, y 64 | Log Reports, Urge Overview Mood, Weekly Report |
| **segmented** | `left 16 right 16 top 164`, track `h44 r22 #1E1E1E padding 4`; items `flex 1 h36 r18` 13/700; on `#F2F0EC`/`#111111`; off transparent/`#9B968E` (kit writes `#FFFFFF` on — frame wins) | Log Reports |
| **h1 / p / caps** | h1 26/700 ls −0.6 lh 33 `#F2F0EC` (`text-wrap: balance`); h1 30/700 ls −0.6 lh 36 on boards/covers; p 15/400 lh 24 `#B5B0A8` (`pretty`); caps 13/700 `#9B968E` nowrap (mixed case, lh 16 when stated) | Data Privacy, SOS Feel *, Week pages |
| **settings group** | stack `left 24 right 24 top 120 column gap 18`; group `column gap 10` = caps + card `r20 #1E1E1E overflow hidden`; row `h54 padding 0 18 gap 12 space-between`, label 15/700 `#F2F0EC` nowrap, detail 14/700 `#9B968E` nowrap, chevronR `<svg 14×14><path d="M5 2l5 5-5 5" stroke #5A574F sw 2 round>`, rows after the first `border-top 1px #2E2E2E` | Settings, Data Privacy, App Lock |
| **ruled rows** | no card; row `h52 padding 0 2 gap 14 space-between`, rows after first `border-top 1px #2E2E2E`; left 15/700 `#F2F0EC`, right 14/700 `#9B968E`; wrapper `column gap 8` | Log Reports (rows at top 518) |
| **week-page row** | `h58 r18 #1E1E1E padding 0 18 gap 16`; lead cell w28 (done: 24 disc `#F2F0EC` + check 12 `#111111` sw 2.2; number 14/700 `#9B968E`); title 15/700 `#F2F0EC` lh 18; trailing chevronR `#9B968E` (done) / `#5A574F` (upcoming); current row `#F2F0EC` with `#111111` title + "Continue" 13/700. Rows pitch 66 (58 + gap 8). | Week pages (library §3.5) |
| **primary** | `left 24 right 24 bottom 48 h58 r29 #F2F0EC`, label 16/700 ls 0.1 `#111111` nowrap. Board/sheet variant: `bottom 96`. | everywhere |
| **ghost** | `left 0 right 0 bottom 60` text-align center 15/400 `#9B968E` | SOS Feel *, Sheet Sign Out |
| **sheet** | scrim `rgba(0,0,0,0.68)` full screen z40 (status bar included); sheet `left 0 right 0 top T bottom 0 r 28 28 0 0 #171717` z41; grabber `40×4 r2 #2E2E2E` at top 10 centred; content `left 24 right 24 top 44 column gap 12`; sheet title 22/700 ls −0.6 lh 28; primary/ghost at frame level `bottom 96 / 60` z42. Kit `sheet()` (scrim `rgba(17,17,17,0.5)`, bg GROUND) is **not** what frames draw. | Sheet Edit Name (T 420), Sheet Sign Out (T 556), Sheet Profile Photo (T 512), Change Pledge Sheet (T 120) |
| **field** | `h60 r18 #1E1E1E padding 0 20` 18/700 `#F2F0EC`, caret `2×22 #F2F0EC margin-left 2`; helper below 14/400 lh 20 `#9B968E` | Sheet Edit Name |
| **bare text area** | no box: 22/400 lh 34 `#F2F0EC`, caret `2×24 vertical-align −4`; caps "Optional" above | Night 3 Reflection |
| **chips** (multi) | wrap gap 12; chip `h48 r24 padding 0 20 gap 8`; off `#1E1E1E` 15/400 `#F2F0EC`; on `#F2F0EC` + check 13 `#111111` + 15/400 `#111111` | Lapse Trigger, V3 Q17 |
| **options** (single) | column gap 12; row `h58 r18 padding 0 22`, 15/400; on `#F2F0EC`/`#111111`, off `#1E1E1E`/`#F2F0EC` | V3 questions |
| **toggle** | `50×30 r15`; on: `#F2F0EC`, thumb `24×24 r12 #1E1E1E` at right 3 top 3 (off state: settings OQ 3) | App Lock |
| **icon disc** | 76×76 r50% `#F2F0EC` with a 30 glyph `#111111` at top 124 centred; outline variant `box-shadow 0 0 0 1.5px #2E2E2E` (42, 40) | App Lock; Today III; Today header avatar |
| **big stat** | `stack top 236 centre gap 10`: value 64/700 ls −2.2 lh 67; word variant 44/700 ls −1.5 lh 67; caption 15/400 lh 22 `#9B968E` | Log Reports, Urge Overview Mood |
| **hero** | `<svg 393×240 viewBox 0 0 393 240 position absolute left 0 top T overflow visible transform scale(s) origin 196px 190px>`; RN: `<Svg style={{position:'absolute',top:T-54,left:0}}>` + `<G transform="translate(196 190) scale(s) translate(-196 -190)">` (BRIEF SVG traps) | SOS Feel *, Night 3 Reflection, Log Chooser |
| **lesson cover** | ✕ at left 22 top 60; progress `left 24 right 24 top 108 h3 r2 #2E2E2E`, fill `#F2F0EC` width %; block `left 32 right 32 top 140 bottom 128 padding-bottom 24` column centred: hero box 393×176 (`margin 0 −32`, svg top −36 scale 1.1), caps `Lesson N` 13/700 lh 16 ls 0.2 `#9B968E` mt 36, title 30/700 lh 36 ls −0.6 mt 12; primary "Begin" | `L1 Frame 1` |
| **lesson task** | reading p **18/400 lh 28 `#B5B0A8`** (mt 22 between); "Done when" card `mt 28 r20 #1E1E1E padding 18 20 gap 14` with 28 disc `#F2F0EC` + check 12, caps 13/700 lh 16 ls 0.2, line 16/700 lh 22 `#F2F0EC`; primary "Finish lesson"; centred nav caption "Lesson N" | `L1 Frame 13` |
| **SOS board** | nav caption ("What’s underneath") + ✕; hero top 190 scale 1.1; stack `top 452 centre gap 18`: h1 30/36, p 15/24; primary `bottom 96` ("Done"); ghost `bottom 60` ("Give me another") | SOS Feel Lonely |
| **pledge block** | caps "Your pledge" 13/700 lh 16 at 413; pledge 22/700 ls −0.3 lh 31 `#F2F0EC`; signature 16/700 **italic** `#9B968E` (Lato 700 italic); three 42 outline discs gap 10 mt 6 | Today Home III |
| **pager dots** | `6×6 r3`, active `18×6`, gap 7; `#F2F0EC` / `#2E2E2E` | kit `pagerDots`, Urge Hub |

---

## 4. Routes with no frame — closest analog, UI inventory, restyle

For every one: keep every control and behaviour listed under **Preserve**; replace the paper colours
1:1 (`#F4F3F0`/`#EDECE7` ground → `#0D0D0D` + noise; white cards → `#1E1E1E`; `#1D1C1A` ink →
`#F2F0EC`; `#55534E`/`#8B8882` greys → `#B5B0A8` (paragraph) / `#9B968E` (caption); `#131313` pill
with white label → `#F2F0EC` pill with `#111111` label; `rgba(0,0,0,0.06)` hairlines → `#2E2E2E`;
labelled `Back` chevrons → kit chevronL alone); every weight through `sans()` (600 → 700, 500 → 400).
Lay content out in flow inside a `ScrollView` from canvas 120 (app 66) unless the analog is a fixed
board, so 667-tall phones scroll instead of clipping.

### 4.1 `/(app)/all` — review drawer → **Settings**
* **Now:** title "All" 27/600 `#1D1C1A` at 16/16, sub "Including the ones that normally come to you"
  13.5 `textSoft`; 8 caption groups (Daily, In the moment, Looking back, The long game, Arrivals,
  Account & setup, Plan, Before the app) of white r16 cards, 52-tall rows with title 16/500, optional
  detail 14 `#8B8882`, chevron; `paddingBottom: tabBar + 24`.
* **New:** nav with caption `All` (or the 32/38 title head — its own comment says "Settings idiom"),
  then settings groups exactly as §3 (caps 13/700, r20 `#1E1E1E` cards, 54 rows, 15/700 label,
  14/700 detail `numberOfLines 1` shrinking first, chevronR `#5A574F`). No tab bar once it leaves
  the bar (§5.4); bottom padding 48.
* **Preserve:** every row and its target; `week` param fallback (last Monday); the `(app)/_layout`
  check-in prompt skip on `/all`. **Fix** `/rough-protocol?key=lonely` → `?key=loneliness` (the only
  broken row). Every one of the 62 screens already has a row; the only *states* it cannot open are
  parameter variants — worth adding: `/slip?stage=morning` (Slip Morning After),
  `/routines/night-time?from=settings` (Settings Check-in Time), `/medallions/breakwater?tier=gold`.

### 4.2 `/(app)/journal` — Past pledges → **Log Reports title head + Today III pledge block**
* **Now:** labelled Back (`#55534E`) at 10, title "Past pledges" 27/600 at 52, list of white r16
  cards (12 in): date `Today · 8:12 AM` 12.5/500 `#8B8882` + TAG 11/600 ls 0.5 uppercase, body 16 lh 24
  (Lato 700 via `fonts.quote`), 3 lines; tap → `/journal-new?id=`; empty: "Nothing here yet." 13.5;
  loading: `LoadingView`; pads for the tab bar although the bar is hidden here (`NO_BAR`).
* **New:** chevronL (22,70) + title head "Past pledges" 32/38 at 108 (no pill). Entries as **ruled
  rows** grown to content: date caps 13/700 `#9B968E` + tag 13/700 `#9B968E` right-aligned (mixed
  case, no tracking), body 22/700 ls −0.3 lh 31 `#F2F0EC` (the Today III pledge type) — or 17/700 lh
  24 if three-line entries are too tall (OQ-R8); rows separated by `border-top 1px #2E2E2E`, padding
  16 0. Empty: p 15/400 lh 24 `#9B968E` "Nothing here yet." at top 164. No tab bar; bottom padding 48.
* **Preserve:** newest-first list, tap-to-edit, `entryDate` format, back fallback `/(app)/today`.
  Today III's ☆ (saved pledges) is the door (today-day OQ-T5).

### 4.3 `/(app)/dashboard` — Insights → **Urge Overview (title head + pill + segmented + rows)**
* **Now:** `ScreenHeader` "Insights" with Back and `AnRangeFilter` (2W/4W/12W); "Mood, day by day"
  label + date range caps; day-of-week header; heat rows (one tinted cell per day,
  `src/components/insights/heat.tsx`); legend; three numerals (Check-ins, Urges logged, Days kept);
  "What sets it off" + 4 bars (3pt track `accentSoft`, ink fill, count); empty-bars sentence; footnote;
  two door cards (Your mail → `/mail`, Medallions → `/milestones`) with 40 r11 icon tiles.
* **New:** chevronL + title head "Insights" 32/38; range as the **segmented** control (2 weeks · 4
  weeks · 12 weeks) at 164; heat cells as the Weekly Report Days 40 discs scaled to the row
  (`#F2F0EC` levels — use the check-in disc palette `#34322F #5A5751 #8A857D #BAB5AD #F2F0EC` from
  today-day §0.6/OQ-T4b), today ringed `0 0 0 1.5px #2E2E2E`; numerals as three big-stat columns
  (value 30/700 ls −0.6, caption 13/700 `#9B968E`); trigger bars as the overview's **dot rows**
  (label w96 15/700, track `#2E2E2E` 3 → fill `#F2F0EC`, count 14/700 `#9B968E`); doors as a settings
  group ("Your mail" · "Weekly reports & letters", "Medallions" · "The album"). Empty bars: p 15/24
  `#9B968E`.
* **Preserve:** range state, all computations, two doors, back fallback `/(app)/library` (should
  become `/(app)/today` — the Library tab no longer lights for it).

### 4.4 `/(app)/lifemap` — Life Map → **V3 Q17 chips + Night 3 Reflection + Settings**
* **Now:** `BackChevron`; `Header` "Life Map" + sub "Your anchor. The app brings this back to you
  when it helps." + "Done" action; two multiline `Field`s ("Why you're here", "One year from now");
  "What you value" label + 12 suggested value pills (toggle) + custom ones; "Add your own" field +
  "Add" secondary button; primary "Save Life Map" / "Saved · update" (loading spinner).
* **New:** nav chevronL + right text "Done" (15/700 `#F2F0EC`, the nav's right slot style); h1 26/33
  "Life Map" + p at stack 136 gap 14; each question as caps (13/700 `#9B968E`) + **bare text area**
  (22/400 lh 34 — or the Sheet Edit Name **field** grown multiline, 18/700, if two areas are too tall:
  OQ-R9); values as **chips** (multi-select, check when on); add-your-own as a **field** (60/18) with
  an outline 48 disc `+` at its right; primary "Save Life Map" pinned `bottom 48` (label swaps to
  "Saved · update", spinner `#111111` while saving). Scrolls; keyboard per §10.
* **Preserve:** hydrate-once from `useLifeMap`, `toggle`, `addCustom`, importance ordering on save,
  Done/back.

### 4.5 `/(app)/locked` — Weeks → **Week page rows + primary**
* **Now:** labelled Back; "Weeks" 27/600 at 68; week I row (40 r12 ink tile + check, "Week I ·
  Reset", "Completed · 7 lessons"); three ghosted rows at 214/292/370 (opacity 0.55, lock tile, week
  name + blurb); `MistRoadArt` vignette (fog gradients) at 466; "11 more weeks ahead" 20/500; sub;
  "Unlock VICI Plus" pill at 690 → `/paywall`. Fixed 764-tall scroll.
* **New:** chevronL; header as the week page (caps `Your course`, h1 30/36 "Weeks", p) at 120 or the
  title head; rows = **week-page rows** (done row: check disc + "Week I · Reset"; locked rows:
  number `II`… 14/700 `#9B968E`, title `#F2F0EC`, trailing a 14 lock glyph `#5A574F` instead of the
  chevron — no opacity fade); replace the mist vignette with a Lesson-Illustrations-v4 hero (e.g. the
  Closed-door or Stairs card, `scale 1.1`, top ≈ 420) — the paper fog has no dark equivalent;
  "N more weeks ahead" as h1 26/33 centred + p; primary "Unlock VICI Plus" `bottom 48`.
* **Preserve:** real week names from `CURRICULUM_84`, count, `/paywall` door.

### 4.6 `/(app)/rough-days` and `/rough-protocol` → **Settings list + SOS board**
* **Shelf now:** labelled Back; "Rough days" 27/600; ink card "The universal interrupt / The First 90
  Seconds / Two quick questions, six moves that fit the answer." with a 34 arrow disc → `/rough-first90`;
  caption "What today feels like"; white card of 7 rows (Loneliness, Anxiety, Stress, Boredom, Late
  night, Home alone, An argument) → `/rough-protocol?key=`.
* **Shelf new:** nav caption "Rough days" (or title head); the interrupt as a **filled card** (Today
  III's "Urge surfing" card: `r24 #1E1E1E padding 18 20`, 52 disc `#F2F0EC` with a glyph, title 18/700,
  sub 14 `#B5B0A8`, chevronR) ; the 7 rows as one **settings group** captioned "What today feels like".
* **Protocol now:** `RDMovePage` — paper sheet from `insets.top − 2` r24, grabber, ✕ (20, `#55534E`),
  dots at 66 (`20×6.5` active), headline 26/500 centred at 104, sub 14.5 at 152, 240×220 `RDArtwork`
  (paper art with gold glows) at 216, act line 16/500 at 452, CTA 54/27 `#131313` at bottom 88
  ("Walk through it" / "Next" / "Done"), ghost at bottom 44 ("Not tonight" / "Back" / "Back").
* **Protocol new:** the **SOS board** (SOS Feel *): nav caption = protocol title (e.g. "Loneliness"),
  ✕ right; hero at 190 (map each `RDArt` to a Lesson-Illustrations-v4 card — emptyroom/mugphone/
  sendtext have obvious analogs: Empty-chair/Mug/Phone cards; list in the implementing agent's notes);
  stack 452: h1 30/36 = headline, p 15/24 = sub, act line as a second p in `#F2F0EC`; **pager dots**
  (3) between hero and stack or at `bottom 180`; primary `bottom 96` with the same 3 labels; ghost
  `bottom 60`.
* **Preserve:** 3-page stepping, ghost = back / close on page 1, close ✕, unknown-key handling (make it
  `router.back()` or fall back to the first protocol instead of `null`).

### 4.7 `/(app)/support` — crisis help → **Data Privacy**
* **Now:** `BackChevron`; `Header` "You're not alone in this." + long sub (not medical advice…);
  two placeholder cards (`[PLACEHOLDER] Crisis line`, `[PLACEHOLDER] Find a therapist`, optional
  "Open →" link); build note; secondary "Back" button.
* **New:** nav chevronL + caption "Find support"; stack 120 gap 16: h1 26/33, p 15/24 `#B5B0A8`;
  resources as a **settings group** captioned "Right now" (row label = name, detail = "Call"/"Text",
  chevronR; tapping opens the URL); the build note as p 14/400 lh 20 `#9B968E` (keep it visibly
  placeholder); drop the redundant Back button (the chevron is the way out).
* **Preserve:** invariant #5 — a **persistent** route; today only All reaches it (OQ-R2).

### 4.8 `/affirmation` — sentence journal sheet → **Sheet Edit Name + Night 3 Reflection**
* **Now:** a fake page skeleton (3 `#E8E7E1` blocks at 0.45) + scrim `rgba(38,37,30,0.42)` (tap =
  close); sheet at canvas 320 (app 266 + inset) r22 `#F4F3F0`, grabber 36×4; **journal mode:** prompt
  22/500 (5 rotating `PROMPTS` or the stored custom one), "Different prompt" (13 `#8B8882` + reroll
  glyph), white r14 text card 126 tall (placeholder "Because I want to be at Maya’s recital on Friday
  with a clear head"), primary "Save today’s line" (saves an `Affirmation` journal entry), paper pill
  "Write my own prompt"; **custom mode:** "Write your own prompt", "It’ll be waiting for you each
  morning.", italic text card, "Use this prompt" (persists `tideline.affirmation.prompt`), "Back to
  prompts". Manual keyboard lift.
* **New:** the **sheet** (§3): scrim 0.68, `#171717` r28, grabber 40×4 `#2E2E2E`, content at 44 gap
  12: title 22/700 ls −0.6 lh 28 = prompt; reroll as a 14/700 `#9B968E` row with the reroll glyph in
  `#9B968E`; the line as the **field** grown to 2–3 lines (`r18 #1E1E1E padding 18 20`, 18/700 lh 26
  `#F2F0EC`, placeholder `#9B968E`); helper p 14/20 `#9B968E` ("It’ll be waiting for you each
  morning." in custom mode); primary "Save today’s line" / "Use this prompt" at frame `bottom 96`;
  ghost "Write my own prompt" / "Back to prompts" at `bottom 60`. Sheet top: canvas 420 (Edit Name's)
  so the field clears a 336 keyboard after the lift (§10). Prefer the **real** page underneath
  (`transparentModal`) over the painted skeleton (OQ-R4).
* **Preserve:** reroll, custom prompt persistence, empty save = close, saving state, scrim tap closes.

### 4.9 `/first-steps` — six first steps → **Week page rows in a full-screen board**
* **Now:** modal sheet: grabber 44×5, "First steps" 17.5/600 + 34 close disc; "Six gentle first
  steps" 24/500; p; 6-segment progress (5 tall, ink / `#CFDCE8` — a blue hue); "N of 6 done" /
  "None done yet · 6 to go"; card of 6 `StepRow` (32 disc: done = ink + check, locked = ring + lock,
  open = number; title 16/500 2 lines; summary 13; hairlines; locked rows opacity 0.6 disabled); tap →
  close + push `/lesson-card/N`.
* **New:** nav close-only (✕ right) + caption "First steps"; h1 26/33 + p at stack 136; progress =
  the lesson reader's bar (`left 24 right 24 h3 r2 #2E2E2E`, fill `#F2F0EC` = done/6) or a 6-segment
  rail of `24×2` dashes; caption line 13/700 `#9B968E`; rows = **week-page rows** (done / current
  / upcoming states map 1:1 to complete / open / locked; locked = upcoming + lock glyph, disabled).
  Titles come from the new curriculum (library §6). Push target follows the lessons group's decision
  (`/lesson/day/N` if the card is retired).
* **Preserve:** lock rule (`lesson.day > day && !complete`), done count from `useLessonProgressMap`,
  close-then-push.

### 4.10 `/lessons-browser` → **Week page rows grouped per week** (library §11 has the same proposal)
* **Now:** `#F4F3F0`; "Cancel" 17/400 left, "Lessons" 18.5/600 centred, search glyph right; 12
  shelves: "Week I · Reset" 20/600 + horizontal row of 118×168 r12 paper tiles (title 13.5/600 + the
  lesson's plate, padlock disc when locked).
* **New:** nav: left text "Cancel" (nav `rightText` style 15/700 `#F2F0EC` in an 80 slot), caption
  "Lessons", right a 18 search glyph `#F2F0EC`; per week the week header (caps `Week <roman>`, h1
  30/36 name — or a 20/700 one-liner) then its 7 **week-page rows** (vertical, not shelves); locked
  lessons = upcoming rows, disabled. Plates (paper `LESSON_PLATES`) are retired with the old lesson
  art — if thumbnails are wanted, use the lesson's cover hero shrunk into a `r18` box (library §11).
* **Preserve:** day reckoning, lock rule, `/search` door, Cancel/back.

### 4.11 `/search` → **Sheet Edit Name field + week-page rows**
* **Now:** search pill (`colors.surface`, glyph + `TextInput` autoFocus "Search the twelve weeks") +
  "Cancel"; 3 recent chips (urge, sleep, relapse) fill the query; `SectionLabel` "N results"; result
  cards (46 plate tile, week caps 10.5, title 14.5, summary 13 2 lines, chevron).
* **New:** nav row: the **field** (`h60 r18 #1E1E1E`, 18/700 text, 18 glyph `#9B968E`, placeholder
  `#9B968E`) from x 24 to the "Cancel" text (15/700 `#F2F0EC`); recent as **chips** (unselected);
  count as caps; results as **week-page rows** with a caps week line above the title (two-line rows
  grow from 58). **Empty results** (none today): p 15/24 `#9B968E` "Nothing in the twelve weeks
  matches “…”." centred at ~top 260.
* **Preserve:** filter over title + summary + week name/blurb, `keyboardShouldPersistTaps`, Cancel →
  back / `/(app)/library`.

### 4.12 `/journey` and `/journey/[chapter]` — the old campaign → **Week page**
* **Now:** `#F4F3F0`, labelled Back at 64, per chapter: title 27/600 at 60, line 14.5 at 108, a
  paper `ChapterScene` band at 160, status row cards at 512 (label, meta, state), a closing land band
  54 tall (`watch` adds "Day 90 · the vow, renewed"); index runs the four chapters end to end.
* **New:** if kept (OQ-R3): chevronL; hero (393×240, one Lesson-Illustrations-v4 card per chapter,
  e.g. Flag/Bridge/Mountain/Lighthouse) at 120; header stack centred (caps `Chapter I`, h1 30/36, p
  15/22); status rows as **week-page rows** (done = check disc, in progress = current row, ahead =
  upcoming). Index = the four chapters stacked, or a settings group linking them. The new tab named
  **Journey does not open these** (it opens Medallions) — rename the route group or retire it.
* **Preserve:** `CHAPTER_LAST_DAY`, ctx (waves, mornings, vowed), unknown key → `landing`.

### 4.13 `/backtap` → **App Lock** (settings §12 proposes the same)
* **Now:** `SettingsTopBar` "Back Tap"; 46 `IconChip` (wave) + intro p; card "Shortcut link" with
  `tideline://urge` (selectable) + "Copy"/"Copied" pill (1.6 s); 4 numbered steps (28 discs); primary
  "Open Shortcuts app"; secondary "Test it now" → `/urge-hub`; shield note card.
* **New:** nav caption "Back Tap"; 76 icon disc `#F2F0EC` at 124 (a wave/phone glyph `#111111`);
  stack 222: h1 26/33 centred ("Double-tap to ride it out." — or keep a neutral title, copy is not
  authored: OQ-R6), p 15/24 centred; a settings group "Shortcut link" with one row (label = the link
  15/700, detail "Copy"/"Copied" 14/700); a settings group "Set it up" with the 4 steps as rows
  (lead = number 14/700 `#9B968E`, label wraps — rows grow from 54); primary "Open Shortcuts"
  `bottom 96`, ghost "Test it now" `bottom 60`; note as p 14/20 `#9B968E`.
* **Preserve:** clipboard + timer, `shortcuts://`, `/urge-hub` test.

### 4.14 `/journal-new` — entry editor → **Night 3 Reflection + chips**
* **Now:** top bar "Cancel" (16.5/600) · timestamp 14/600 · "Save" ink pill; tag chips Reflection /
  Urge / Lesson (44 tall, outline when off); title input 26 (Lato 400 via `fonts.serif`) placeholder
  "A quiet win"; body input 15.5 lh 23 multiline autoFocus; a **non-functional** B / I / U / list
  toolbar; `KeyboardAvoidingView` (iOS padding).
* **New:** nav: left "Cancel" text, centre caption = timestamp (13/700 `#9B968E`), right "Save" text
  (15/700 `#F2F0EC`; kit `rightText` slots are 80 wide); tags as **chips** (single-select here) at
  stack 120; title as h1-sized input (26/700 ls −0.6 lh 33, placeholder `#5A574F`); body as the
  **bare text area** (22/400 lh 34 — or 18/400 lh 28 like the lesson reading, OQ-R9). **Drop the
  decorative toolbar** (it does nothing; no frame has one) or keep it as a `#1E1E1E` r22 segmented
  strip if the team wants it visible.
* **Preserve:** edit vs create (`?id=`), hydrate once, empty save = close, `Untitled` default,
  keyboard avoidance.

### 4.15 `/mail` → **Log Reports (title head + ruled rows)**
* **Now:** `BackChevron`; "Mail" 27/600; list of r18 cards (46 r12 icon tile with letter/report
  glyph, title 15.5/600, sub 13, chevron); **empty:** quote mark 52 + "Nothing’s arrived yet." 22/500 +
  "A report lands here at the end of each week, and letters arrive along the way." 13.5; **loading:**
  `LoadingView`.
* **New:** chevronL + title head "Mail" 32/38; items as **ruled rows** (left: title 15/700, a second
  line 14/700 `#9B968E` for the sub — rows grow to 64; right: chevronR `#5A574F`), or as a settings
  group "Post" + group "Weekly reports". Empty: h1 26/33 centred "Nothing’s arrived yet." + p 15/24
  `#9B968E` centred at ~top 300; no quote glyph.
* **Preserve:** report verdict logic, post/letter rows and their targets, back fallback (→
  `/(app)/today` rather than `/(app)/dashboard` if the dashboard is retired).

### 4.16 `/lesson-card/[day]` and `/task/[day]` (lessons group decides)
* **lesson-card now:** paper sheet r24 from `inset − 2`, ✕ `#55534E`, 7-dot week rail, plate, title
  26/600, summary 15.5, "Start lesson" `#131313` pill at bottom 88, "Back to Week N" at bottom 44.
  **Analog:** `L<n> Frame 1` (lesson cover, §3) — which *is* the cover with "Begin". Recommendation:
  retire the card — every door (Today lesson tile, week rows, search, lessons-browser, first-steps)
  pushes `/lesson/day/N`, and `/lesson-card/[day]` becomes `<Redirect href={'/lesson/day/'+day}/>` so
  deep links and recipes survive. The "Back to Week N" door disappears (the reader's ✕ goes back).
* **task now:** two paper boards (Task Intro with a rule card, Task Options with icon rows) writing
  `dailyActionDone`. **Analog:** `L<n> Frame 12` ("Today’s task" caps + title + p) and `Frame 13`
  (reading + "Done when" card + "Finish lesson"). Recommendation: Today's task card opens the reader
  at its task frame (`/lesson/day/N?at=task`), and `/task/[day]` redirects there; keep the
  `dailyActionDone` write on "Finish lesson" (or on the Today card's tick).

### 4.17 Partially framed screens (owners already specify the drawn part)
* `/checkin` — mood step is an orb + slider; closest is **Night 1 Mood** (disc row) — today-day §5.
* `/medallion-post` arrival — **Medallion Received** or **Letter Arrival** — medallions-letters Q10.
* `/welcome-back` inner steps, `/sign-up` gate/form/verify, `index` `WaterlineScene` — **V3 Q24
  Name** / **Login** / **Enlisting Aegis** ring — auth-funnel §7.
* `/(app)/library` root — **Week pages** (library §9 option A).

---

## 5. The tab bar (app-wide)

Specified in full in today-day §0.6 and library §3.7 (`src/components/StoicTabBar.tsx` and
`src/app/(app)/_layout.tsx` are orchestrator-owned). Summary + the route mapping this group owns:

### 5.1 Drawn bar
Container `left 0 right 0 bottom 0 height 104 padding 14 14 0 flex space-between align flex-start
z8`, **no background, border or shadow**. Five items, each `width 72 column gap 4 align center`:
26×26 glyph (stroke 1.8, `fill none`) + label 11.5 (active 700 `#F2F0EC`, inactive 400 `#9B968E`,
glyph stroke follows). Centres 50 / 126.25 / 196.5 / 266.75 / 343. SOS = `60×60 r30 #F2F0EC
margin-top −6` with "SOS" 13/700 **`#111111`** (kit says `#FFFFFF`; the frame draws `#111111`).
Glyph paths are in today-day §0.6. The bar is drawn on **37 frames**: Today ×4 (Today), Log Urges /
Check-ins / Reports (Log), the 24 week pages (Library), Medallions ×3 + Score Detail ×3 (Journey).

### 5.2 What each tab is in the app today, and what it should be

| new tab | today's equivalent | new target | active on | notes |
| --- | --- | --- | --- | --- |
| **Today** | `Home` → `/(app)/today` (active also on `/profile`, `/milestones`) | `/(app)/today` | `/today` only | drop `/profile` and `/milestones` from its rule |
| **Log** | `Log` → `/log-chooser` (active on `/log`) | `/log-chooser` (D124 stands; logs Q14) | `/log` | chooser itself draws no bar (pushed outside `(app)`) |
| **SOS** | none — Today's pinned ink "Urge surfing" bar → `/urge-hub` | **`/urge`** (Cue Intro Modal) recommended (sos-flow Q1); `/urge-hub` is reached from Today II/III's "Urge surfing" card | never | a button, not a tab: `router.push`, no active state |
| **Library** | `Library` → `/(app)/library` (active also on `/rough-days`, `/dashboard`, `/lesson*`) | `/(app)/library` | `/library`, `/week/*` | drop `/rough-days`, `/dashboard`, `/lesson*` (readers draw no bar) |
| **Journey** | none (the drawer tab `All` sat in that slot) | **`/(app)/milestones`** | `/milestones`, **`/score`** | not `/journey` (§4.12). Medallion detail / tiers draw no bar |
| ~~All~~ | `All` → `/(app)/all` (`SHOW_ALL_TAB = true`) | removed from the bar | — | needs another door (§5.4) |

### 5.3 Where the bar must render
* **With bar:** `/today`, `/log`, `/library`, `/milestones` (all in `(app)` already) **plus `/score`
  and `/week/[week]`**, which live outside `(app)` and render no bar today. Either move
  `src/app/score.tsx` → `src/app/(app)/score.tsx` and `src/app/week/[week].tsx` →
  `src/app/(app)/week/[week].tsx` (URLs unchanged; register hidden `Tabs.Screen`s) or export the bar
  as a standalone component those screens render (BRIEF: orchestrator decides; today-day §6 and
  library §9 make the same request).
* **No bar:** every other `(app)` screen — `settings`, `journal`, `dashboard`, `lifemap`, `locked`,
  `rough-days`, `support`, and `all` once it leaves the bar. Today's `NO_BAR` list already holds all of
  them except `all` and `milestones`; add `/all`.
* **Height:** frame 104 includes the 34pt home-indicator zone; suggested `70 + max(insets.bottom,
  34)` with contents pinned to the 14 top padding (today-day §0.6). `useTabBarHeight()` consumers:
  `today.tsx` (page height), `library.tsx`, `log.tsx`, `journal.tsx`, `all.tsx` (the last two stop
  needing it once they have no bar).
* **Transparent bar over scrolling content:** the frames place content to end above 748, but any
  scroller (Log rows, Library rows, Medallions grid) shows through the labels on small phones. A ground
  fill (`#0D0D0D` + the noise layer) on the bar is invisible in every frame and fixes it (library §10,
  OQ-R10).

### 5.4 Keeping the review drawer reachable (OQ-R1)
`All` is the only door to 16 screens (§2.9), several of which only ever *arrive* (letter, post,
report, drop), so the team needs it for review — but no frame draws it. Recommended: keep the route,
remove the tab, and add a **pixel-free door**: long-press on Today's header avatar (40×40 at canvas 329,64)
opens `/all` in mock/dev builds (`FORCE_MOCK || __DEV__`), plus the URL `/all` on web. Keep the
`(app)/_layout` prompt skip for `/all`.

---

## 6. Modals and sheets

| sheet / modal | where | mechanism today | frame | new style |
| --- | --- | --- | --- | --- |
| Sign-out sheet | `settings.tsx` `SignOutSheet` | absolute overlay | Sheet Sign Out (T 556) | §3 sheet, primary `bottom 96`, ghost `bottom 60` — settings |
| Profile photo / name sheets | `profile.tsx` `ProfileSheet` (RN `Modal transparent slide statusBarTranslucent`) | RN Modal | Sheet Profile Photo (T 512), Sheet Edit Name (T 420) | §3 sheet; name field + keyboard lift (§10) — settings |
| Change pledge | `day/kit.tsx` `ChangePledgeSheet` | absolute overlay | Change Pledge Sheet (T 120) | §3 sheet — today-day |
| Letter / post sheet | `letter.tsx` `MailSheet` (exported, reused by medallion-post) | full screen | Letter Read, Medallion Letter (`#121212` ground) | medallions-letters |
| Slip sheet | `components/slip/kit.tsx` `SlipSheet` | absolute | Slip frames | slip |
| SOS paper sheet + settings sheet | `urge/index.tsx` `PaperSheet`, `SosSettingsSheet` | absolute | SOS boards (full screen, **no sheet**); settings sheet has no frame | sos-flow §4 (kit sheet; hue swatches are an open question there) |
| Apple Pay sheet (mock) | `PaywallFlow.tsx` `PwPaySheet` | absolute | none | paywall-reminders §5a |
| When picker ("Change") | `urge-log.tsx` `WhenPicker` | inline | none | logs §5: §3 sheet + options |
| Affirmation | `/affirmation` | full route painting its own scrim | none | §4.8 |
| First steps / lessons browser | root `presentation: 'modal'` | native page sheet | none | full-screen (OQ-R4) |
| Letter arrival | root `animation: 'fade'` | stack | Letter Arrival | keep fade |
| `MoodLogger` modal | `components/MoodLogger.tsx` | — | — | **dead**, nothing renders it |

All sheets share one spec (§3 "sheet"): it should be one component in `src/components/mono/` with
`top`, children, and a frame-level primary/ghost slot. Scrim tap = cancel everywhere (Sign Out,
Profile, Change Pledge already do; keep).

---

## 7. Loading states

No frame draws one. Mock data resolves in one tick, so these flash for a frame at most on web; on a
device with Convex they show for real.

| where | condition | renders now | new style |
| --- | --- | --- | --- |
| `src/app/_layout.tsx` | fonts not loaded | blank `View` `colors.bg` (native splash still up) | keep (= `#0D0D0D`) |
| `src/app/index.tsx` | auth/user unresolved | `SplashScene`, after 900 ms `WaterlineScene` | new Splash (laurel 120 white at 136,330 + `VICI` 14/700 ls 7 at 478); Waterline per auth-funnel §7.1 or drop it |
| `(app)/today.tsx` | progress / checkins / events undefined | `LoadingView` | ground only (no spinner) — Today appears instantly in practice and a spinner under the tab bar reads as broken |
| `(app)/milestones.tsx`, `(app)/settings.tsx`, `(app)/journal.tsx`, `(app)/dashboard.tsx`, `(app)/lifemap.tsx`, `score.tsx`, `weekly-report.tsx`, `urge-overview.tsx`, `mail.tsx`, `checkin.tsx`, `first-steps.tsx`, `JourneyScreens` (×3) | their queries undefined | `LoadingView` = `ActivityIndicator` `colors.textSoft` (#9B968E) centred, no ground of its own | **mono `LoadingView`**: frame ground `#0D0D0D` + `noise.png` @ 0.05, `ActivityIndicator` `#9B968E` (small), shown only after 300 ms; keep the screen's nav row (chevron/✕) drawn so the user can leave |
| `(app)/log.tsx` Reports tab | user / checkins / events undefined | `null` | mono `LoadingView` inline (or nothing — the switch stays) |
| `OfferingPaywall.tsx` | `!purchases.ready` | `#FAF8F3` paper + `#131313` spinner | ground + `#9B968E` spinner (paywall-reminders) |
| `Button` (`ui/Button.tsx`) `loading` | lifemap save | `ActivityIndicator` label colour | on the kit primary: `#111111` spinner on `#F2F0EC` |
| flows' saving | urge-log / lapse "Logging…", auth "Signing in…" / "Checking…", lifemap "Saved · update" | label swaps | keep the swaps (no frame contradicts) |

---

## 8. Empty states

| where | today | new style |
| --- | --- | --- |
| `(app)/log.tsx` (`LogEmpty` → `EmptyState` with `tide` illustration) — no urges / no check-ins / "No reports yet" | paper illustration + subtitle + soft body | logs §5 (header + big `0` + p 15/24 `#9B968E`, no illustration) |
| `medallions/[key].tsx`, `medallions/tiers/[key].tsx` — "Medallion not found" | `EmptyState` | nav back + centred h1 26/33 + p 15/24 `#9B968E` (medallions-letters) |
| `mail.tsx` — "Nothing’s arrived yet." | quote glyph + 22/500 + 13.5 | §4.15 |
| `(app)/journal.tsx` — "Nothing here yet." | 13.5 `textSoft` | §4.2 |
| `search.tsx` — 0 results | count only ("0 results"), empty list | §4.11 sentence |
| `(app)/dashboard.tsx` — no triggers | 13.5 sentence | p 15/24 `#9B968E` |
| `weekly-report.tsx` — no closed week / empty week | two sentences | logs §5 |
| `urge-overview.tsx` — empty range | — | logs §5 |
| Today — no pledge, no morning check-in yet | stock pledge / chips | today-day OQ-T4b, OQ-T5 |
| Urge hub — no timed urges / no pledge | — | sos-flow §4 |
| `vow.tsx` — no vow | placeholder sentence | settings §12 |
| `relapse.tsx` Resign — no pledge | stock pledge | sos-flow Q10 |

**`EmptyState` itself** (`src/components/ui/Feedback.tsx`) should become the mono variant used for
every row above that has no bespoke spec: no illustration (the `tide` art is paper-system), title
22/700 ls −0.6 lh 28 `#F2F0EC` centred (optional), body 15/400 lh 24 `#9B968E` centred, max width
`left/right 24`.

---

## 9. Error states

| where | today | new style |
| --- | --- | --- |
| auth boards (`AuthMessage`, `src/components/auth/kit.tsx`) | one centred line 13/500 lh 19, **`colors.danger` `#B5624F`** for errors, `paper(0.6)` for notices | the palette has no hue; recommended: error 14/700 lh 20 `#F2F0EC`, notice 14/400 lh 20 `#9B968E` (OQ-R7) — auth-funnel |
| store purchase / restore (`subscription.tsx`, `drop.tsx`, `PaywallFlow`, `OfferingPaywall`, `RevenueCatPaywall`) | native `Alert.alert` | keep — system UI, no frame |
| bad route params: `rough-protocol` (unknown key), `lesson-card` / `task` / `lesson/day` (unknown day), `week/[week]` (unknown week) | `return null` → blank `#0D0D0D` with no way back | clamp (day 1–84, week 1–12) or redirect (`router.back()` / `/(app)/today`); never a screen without a nav row |
| medallion unknown key | `EmptyState` | §8 |
| failed writes (21 `.catch(() => {})` in `src/app`, e.g. affirmation save, reminders, medallion-post keep) | silent | keep silent (no frame draws a failure); optionally a one-line p under the primary |
| validation (sign-up name/email/password, welcome-back) | `setError` → `AuthMessage` | as the auth row above |

No toast / snackbar component exists anywhere, and no frame draws one. Transient feedback is done
by label swaps (`Copy`→`Copied` 1.6 s in backtap, `Saved · update`, `Logging…`) — keep that idiom.

---

## 10. Keyboard handling

No frame draws a keyboard; every text-entry frame is keyboard-down, so the keyboard-up layout is
ours to define. Rule proposed for all: **frame layout when the keyboard is down; when it is up, lift
only what it would cover** — a bottom-pinned primary rides to `keyboardTop − 16`, a sheet rides up by
`max(0, fieldBottom + 16 − (H − kb))` (affirmation's existing formula, generalised). Use
`KeyboardAvoidingView behavior="padding"` (iOS) / `"height"` (Android) on full screens, `Keyboard`
listeners on sheets.

| input | file | handling today | risk / recommendation |
| --- | --- | --- | --- |
| Name, Age (onboarding) | `components/onboarding/v3.tsx` l.611 | none | primary at `bottom 48` covered — auth-funnel |
| Sign-up form, welcome-back steps | `components/auth/kit.tsx` (ScrollView `keyboardShouldPersistTaps`) | scroll only | lift the CTA — auth-funnel |
| Night reflection | `day/night.tsx` l.271 | none | Continue at `bottom 48` covered; Night 3 Reflection's typed line sits at canvas ~233–267, safe — today-day |
| Change pledge | `day/kit.tsx` l.554 (comment: "the last link is the keyboard's") | none | sheet T 120 — field visible, primary may be covered |
| Profile name sheet | `profile.tsx` l.228 in RN `Modal` | none | sheet T 420: field ends at canvas 564 > 516 (852 − 336 keyboard) → **covered**; lift ≈ 64 |
| SOS afterward note | `urge/index.tsx` l.1686 | none | sos-flow |
| Affirmation | `affirmation.tsx` | manual `Keyboard` listeners + lift | keep, generalise |
| Journal editor | `journal-new.tsx` | `KeyboardAvoidingView` (iOS padding) + autoFocus | keep |
| Search | `search.tsx` | `keyboardShouldPersistTaps="handled"` on results, autoFocus | keep |
| Life Map | `ui/Field.tsx` in `ui/Screen.tsx` (`keyboardShouldPersistTaps`) | scroll | add KAV when restyled |

Web previews never show a soft keyboard, so these are checked on a simulator only.

---

## 11. Boot / splash sequence and StatusBar

**Boot:** native splash (`expo-splash-screen`, bg `#0D0D0D`; Android image `splash-icon.png` 76 wide,
iOS none) held by `SplashScreen.preventAutoHideAsync()` until Lato loads → `index.tsx` paints
`SplashScene` (the **old** washed field: gradient `#131313→#2E2C29`, four radial washes, stars, a
72×72 laurel at 0.9 opacity, `noise-dark` @ 0.1) while auth/user resolve, `WaterlineScene` after
900 ms → redirect. Signed out → `/(auth)/splash` paints the same `SplashScene` for 900 ms → `/sign-in`.
**New Splash frame:** flat `#0D0D0D` + `noise.png` @ 0.05, laurel `120×120` at `left 136 top 330`
with `filter: brightness(0) invert(1)` (pure white), `VICI` 14/700 ls 7 `#F2F0EC` centred at top 478
— auth-funnel owns `SplashScene`. Note the native splash's centred 76pt Android image does not sit
where the 120pt frame laurel sits (centre 196,390 vs screen centre ~196,426): either drop the native
image (plain `#0D0D0D`, which iOS already is) or accept a jump at hand-off (OQ-R5).

**StatusBar:** the root sets `light` (correct). Then **41 files override with `style="dark"`** —
`(app)/library`, `(app)/milestones`, `(onboarding)/_layout`, affirmation, applock, backtap, checkin,
day/morning, drop, first-steps, journal-new, journey/index, journey/[chapter], lapse, lesson-card,
lesson/day, lessons-browser, letter, mail, medallion-post, medallions/tiers, notify-primer, paywall,
privacy, profile, relapse, reminders, report-ready, rough-protocol, routines/morning-time,
routines/night-time, search, slip, subscription, task, urge-log, urge-overview, vow, week,
weekly-report, `components/urge/index.tsx` — and three are conditional (`slip.tsx:446`
`warning.dark ? 'light':'dark'`, `day/night.tsx:173`, `medallions/[key].tsx:173 skin.bar`).
**Every frame's status bar is light** (`#F2F0EC` text; `#FFFFFF` on the ten `#111111` frames:
Cost By Age 80, Night 4 Closed, Night Check-in Cover, …). Remove the per-screen overrides (the root
`light` then holds) or set them all to `light`. Each owner should do it in their files; the list is
here so none is missed. (Web captures cannot show this; it is a device-only bug.)

---

## 12. Other phone sizes (unframed screens)

* **375 × 667** (inset 20): every unframed screen above is a flow layout in a `ScrollView` from app
  66 (canvas 120) — nothing clips; bottom-pinned primaries stay `bottom 48/96` off the frame edge
  (D026) and the scroll content gets `paddingBottom = primaryBottom + 58 + 24` so the last row clears
  the pill. Sheets: keep `top` as a fraction (`T/852`) or anchor them to the bottom with the frame's
  height (`852 − T`), whichever keeps the grabber below the status bar (Change Pledge's T 120 needs
  `max(T × H/852, inset + 8)`).
* **430 × 932:** groups/rows stretch with `left/right 24`; heroes centre their 393 box
  (`viewBox` x offset `−(W−393)/2`) so full-bleed art reaches both edges.
* Long strings: settings-row details `numberOfLines 1` and shrink before the label (All already does
  this); week-page row titles may wrap to 2 lines (library §3.5 scan).

---

## 13. How to reach each unframed screen (for captures — not yet verified by a capture)

Use any onboarded seed, e.g. `--initseed=.overhaul/today-seed.js` (Jerry, ~40 days of data) or
`.overhaul/settings-seed.js`. Empty states need a fresh onboarded account with no logs (no such
seed exists yet; `vday-seed-d1.js` is a day-1 user worth checking).

| screen | command |
| --- | --- |
| All | `shot.mjs app /all … --initseed=.overhaul/today-seed.js --do="await __sleep(1500)"` |
| Past pledges | `/journal` (or `/today` → page 3 → tap "Past pledges") |
| Insights | `/dashboard` |
| Life Map | `/lifemap` |
| Weeks (locked) | `/locked` |
| Rough days / a protocol | `/rough-days`, `/rough-protocol?key=loneliness` (`lonely` is blank) |
| Find support | `/support` |
| Affirmation | `/affirmation`, then `tap('Write my own prompt')` for custom mode |
| First steps | `/first-steps` |
| Notification primer / Reminders | `/notify-primer`, `/reminders` |
| Lessons browser / Search | `/lessons-browser`, `/search` (type via `--do`) |
| Campaign | `/journey`, `/journey/landing` … `/journey/watch` |
| Back Tap | `/backtap` |
| Journal editor | `/journal-new` (create), `/journal-new?id=<id>` (edit; tap a row on `/journal`) |
| Mail | `/mail` |
| Lesson card / Task | `/lesson-card/1`, `/task/1` |

Record verified ones in `.overhaul/recipes/routes.json` when captured.

---

## 14. Shared files this area touches (requests, not edits)

| file | owner | request |
| --- | --- | --- |
| `src/components/StoicTabBar.tsx` | orchestrator | five-item bar (§5.1); targets and active rules (§5.2); `NO_BAR` += `/all`; standalone export or `(app)` moves for `/score`, `/week/*` |
| `src/app/(app)/_layout.tsx` | orchestrator | register hidden `score` / `week/[week]` if moved; keep the launch gate and the `/all` skip |
| `src/app/_layout.tsx` | orchestrator | `first-steps`, `lessons-browser`: drop `presentation:'modal'` (or `fullScreenModal`); `affirmation`: `transparentModal` + fade (OQ-R4) |
| `src/app/(onboarding)/_layout.tsx` | auth-funnel / routes | `StatusBar style="light"` |
| `src/components/ui/Feedback.tsx` | orchestrator (shared) | mono `LoadingView` (ground + noise + delayed `#9B968E` spinner) and `EmptyState` (§8) |
| `src/components/ui/ScreenHeader.tsx` (`BackChevron`, `ScreenHeader`), `ui/Screen.tsx`, `ui/Button.tsx`, `ui/Field.tsx`, `ui/Header.tsx`, `ui/kit.tsx` (`SettingsTopBar`, `IconChip`) | orchestrator | used only by unframed screens (support, lifemap, backtap, dashboard, mail, profile) — superseded by `src/components/mono/*`; retire once their callers move |
| `src/components/auth/kit.tsx` (`AuthMessage`) | auth-funnel | error colour (OQ-R7) |
| `src/components/paywall/OfferingPaywall.tsx` | paywall-reminders | loading ground/spinner |
| `src/components/roughDays/kit.tsx`, `src/content/roughDays.ts` | routes (sos-flow flags) | art mapping to Lesson-Illustrations-v4 |
| `src/components/journey/JourneyScreens.tsx`, `WeekScene.tsx`, `WorldCardArt.tsx` | routes / library | restyle or retire with `/journey` (OQ-R3); `WeekScene` is library's to delete |
| `src/components/insights/heat.tsx` | routes | dashboard restyle |
| the 41 `StatusBar` files | each owner | §11 |

---

## 15. Open questions

* **OQ-R1 — the review drawer.** Keep `/(app)/all` without a tab, reachable by a pixel-free door
  (long-press the Today avatar in mock/dev) and by URL? Or keep a sixth tab in dev builds only? The
  canvas draws five.
* **OQ-R2 — invariant #5.** `/support` (crisis / professional help) is reachable only from All. The
  Settings frame has no row for it. Options: a row in Data & Privacy or Settings (adds pixels the
  frame lacks), a link in the slip flow's "Stop Here" / third-slip boards, or All only (fails the
  invariant in production).
* **OQ-R3 — retire or restyle** the All-only screens with no canvas presence: `/journey*` (name
  collides with the Journey tab), `/dashboard` + `/mail`, `/lifemap`, `/locked`, `/rough-days` +
  `/rough-protocol` (+ `/rough-first90`), `/affirmation`, `/first-steps`, `/notify-primer`,
  `/reminders`, `/backtap`, `/relapse` (D147 superseded by `/slip`). This doc gives a restyle for
  each; retiring is cheaper and loses nothing a user can reach.
* **OQ-R4 — presentation.** `first-steps` and `lessons-browser` use native `modal` presentation (a
  page sheet no frame draws). Plain push or `fullScreenModal`? `affirmation`: `transparentModal`
  so the real page shows under the 0.68 scrim?
* **OQ-R5 — native splash.** Plain `#0D0D0D` (no image), or a laurel image placed where the frame's
  sits?
* **OQ-R6 — copy for unframed screens.** Keep each screen's existing strings (recommended — no frame
  authors them), only restyled.
* **OQ-R7 — error colour.** `#B5624F` is the only hue left in the app. Ink 700 for errors and
  `#9B968E` for notices?
* **OQ-R8 — Past pledges.** It lists every tag (Reflection, Urge, Lesson, Affirmation, Letter, Vow,
  Pledge). Filter to `Pledge`/`Vow` to match its title, or retitle "Journal"?
* **OQ-R9 — long-form text type.** Bare 22/400 lh 34 (Night 3 Reflection) or 18/400 lh 28 (lesson
  reading) for multi-paragraph bodies (journal editor, Life Map)?
* **OQ-R10 — tab bar ground.** Fill the transparent bar with the frame ground + noise so scrolling
  content does not show through (invisible in every frame)?
* **OQ-R11 — `/lesson-card` and `/task`.** Retire both behind redirects into the reader (cover /
  task frame), as recommended in §4.16 — lessons group to confirm.

---

## 16. Risks

* **Orphaned screens.** Removing `All` from the bar without another door makes 16 screens (and the
  arrival screens' manual review path) unreachable.
* **Bar on `/score` and `/week/*`** silently missing if the routes stay outside `(app)` — a capture
  of Score Detail would differ by the whole bar.
* **StatusBar `dark`** on 41 screens — invisible in web captures, wrong on every device.
* **Native page-sheet presentation** (`modal`) would make two screens visibly different from every
  other screen on iOS while web captures look fine.
* **Blank screens** on bad params (5 routes return `null`) — including one link in All today.
* **Keyboard** covering pinned primaries on six inputs (device-only).
* **Lesson-card / task retirement** touches Today (two doors), week rows, search, lessons-browser,
  first-steps and the reader's close fallback (`replace('/lesson-card/N')`) — change them together.
* **Name collision:** "Journey" tab (Medallions + Score) vs `/journey` routes (old campaign);
  implementers must not wire the tab to `/journey`.
