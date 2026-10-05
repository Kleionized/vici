# CRITIC — completeness and consistency review of the 15 analysis documents

Read-only review for the `Vici Overhaul` run (Oct 2026). Inputs: all 15 docs in
`.overhaul/understand/*.md` (read in full), `.overhaul/groups.json`, `.overhaul/final/Email-Login/_index.json`,
`.overhaul/FLOW.txt`, the raw split frames, `Vici Overhaul/project/gen/mono-kit.js`, `src/app/**`, and spot
`body.mjs` dumps. Scripts: `.overhaul/understand/scratch-critic/heroids.py` (+ `heroes-email.json`, the
`data-hero` / top / scale of every hero on the 254 Email-Login frames).

Canvas y throughout (app y = canvas − 54, D009; bottom offsets off the screen edge, D026).

---

## 0. Verdict in twelve lines

1. **Frames: complete.** All 254 Email-Login frames are mapped exactly once (12 frame-owning groups; 25+19+8+24+24+22+30+27+20+10+31+14 = 254; `groups.json` = `_index.json`, no duplicates, no orphans). Five frames map to `NONE` today, all justified (§1.3).
2. **Routes: inventoried, not all owned.** `routes.md` accounts for all 62 screens + 4 layouts in `src/app` (66 files, checked), but **11 unframed routes have no implementation owner** and 6 more are claimed by two docs (§2).
3. **The single biggest risk is sequencing, not coverage.** `src/components/mono/*` does not exist yet (checked), and every group's doc depends on it. Three files must be split and one generator re-run before groups can work in parallel (§3.1 "Phase 0").
4. **Hero ids:** 151 hero svgs on Email-Login, 150 byte-match the `Lesson-Illustrations-v4` card their `data-hero` names; **`Checkin-Emotions` is tagged `windowNight` (no such card) but its art is byte-identical to `nightMoon`**. 284 lesson heroes all match. All 53 cards are used. sos-flow's private ids (`bedroom`, `phoneLock`, `stormCloud`, `envelopeTilted`, `dominoesTipping`, `penSigning`) must not be used (§4 C1).
5. **Four implementation recipes in the docs are wrong if followed literally** (§4): the 393-wide `overflow:visible` hero snippet (sos-flow, slip, tail, logs, paywall), slip's `alignSelf:'stretch'` summary card (breaks Lapse/Urge-Log Done), the "Lato normal = 1.2 × size" rule (auth-funnel, logs), and settings' "group-local" row kit (routes needs it on ~8 unframed screens).
6. **Contradictions settled from the frames** — hero ids, toggle OFF, mail layout, medallion-post arrival, sentence-in-ink inputs are typed state not placeholders, `/locked` lock glyph, week-strip start day — §4.
7. **~25 open questions are answerable from the frames / FLOW**; answers in §5 (e.g. the `reading` step is gone — FLOW jumps 34 → 38; morning default is 8:00 AM — both frames that state it agree; Log Chooser defaults to "An urge").
8. **Gaps no doc covers** (§6): Dynamic Type/font scaling (no cap anywhere in `src`), a shared number-to-words / day-part / comma-join util (three groups re-implement), a clock-freeze helper (seven different frozen dates), D2xx numbering collisions, the 1,273-frame lesson verification loop (needs `?page=`), PressScale `minHeight 44` and AppText's web `textWrap:'pretty'` default as kit-level traps.
9. **One unified small-screen policy is needed** — eight docs propose eight different rules (§7.3 gives one).
10. **Behaviour changes hidden in the restyle** need the user's yes (§8): Gender loses Continue, multi-select SOS pickers, `completeLesson` on Finish lesson, `Health / wellbeing` → `Health` stored value, morning default 8:00 AM, the `reading` step removed, Today's urge bar removed.
11. **Two frames draw no way out**: Paywall and Yearly Drop. A dismiss control must be added (functionality) — the user must pick where.
12. Data residues that no seed can reach in one account are already named by the owners (Starting Score 842, Today II/Task composition, Tiers Vidi, hub panes, Overview Mood 14 ≠ 9, Weekly Days wave) — listed once in §1.4 so the audit does not chase them.

---

## 1. Frame coverage (Email-Login, 254)

### 1.1 Method

* `groups.json` (12 frame-owning groups) ∪ = 254 unique files = `_index.json` frames. No file in two groups.
* Each group doc mentions every one of its frames (scripted label/stem search; medallions-letters lists
  Breakwater/Detail/Tiers as families in tables — checked by hand, all 27 present).
* The three analysis-only groups (`design-system`, `routes`, `critic`) own no frames.

### 1.2 Frames drawn by one group, implemented by another (single-owned, not duplicates)

| frame(s) | mapped by | drawn/implemented by | rule |
| --- | --- | --- | --- |
| Settings Weekly Report | settings | logs (`weekly-report.tsx`) — byte-identical to Weekly Report | logs drops the `backLabel` "Settings"; settings owns only the row → `/weekly-report?from=settings` |
| Settings Check-in Time | settings | paywall-reminders (`routines/*`) — byte-identical to Nightly Check-in Time | paywall drops `backLabel` + reassurance `note`; keeps `from=settings` navigation |
| Lesson Scroll 1–14 | lesson-scroll | **lessons** (= `Week-01-Reset/L1 Frame 1–14`, raw HTML identical but the label) | one reader implementation (lessons); lesson-scroll's doc is the L1 verification spec |
| Letter Received, Letter Week XII | tail | tail (`handover.tsx`) — also rendered by `/letter?variant=week12` | tail lands the component + new API `{name,onClose,onContinue,onKeep}` first; medallions-letters wires `letter.tsx:130` |
| Medallion Received | tail | tail — **not** the `/medallion-post` arrival (see §4 C8) | |

Template twins (different frames, one component — owners in §3): Relapse Log/Twice/Resign/Begin ≈ Slip
Entry/Dont Fail Twice/Pledge/Begin Again; Lapse When ≡ Slip When (byte-identical) ≈ Urge Log When; Lapse Done ≈
Slip Logged ≈ Urge Log Done; Morning Resign Pledge/Signed ≈ Slip Pledge ≈ Relapse Resign; SOS Strength/Reassess ≈
Urge Log Intensity; the five chip pickers (Lapse/Urge Log Trigger, Slip Fed, SOS Reason/Feeling Picker); 78
hero boards at `top 190 scale 1.1`.

### 1.3 Frames mapped to `NONE` — all justified

| frame | why NONE | what the next phase needs |
| --- | --- | --- |
| Line If Nothing Changes | new board; replaces half of the withdrawn Change the Line | new `/welcome` step `line-nothing` after `age80` (tail) |
| Line With the Plan | new board | step `line-plan` after it (tail) |
| SOS Loc Bathroom, SOS Loc Home Alone, SOS Trig Rejection | unreachable by D038 (5 places / 9 triggers for 7 / 10 boards) | a verification path — recommend a mock-only `/urge?board=<key>` (honoured only when `EXPO_PUBLIC_FORCE_MOCK=1`) instead of D146's temporary source swaps — orchestrator's call |

Urge Hub Breathe has a route (`/urge-hub` → Breathe) but is a **new screen** that replaces the old
`BreatheStage`. Paywall Rescue's route depends on the paywall dismiss control being restored (§8 D-1).

### 1.4 Frames whose drawn state is not reachable from one account (named once, so the audit does not chase them)

| frame | why | owner's ruling |
| --- | --- | --- |
| Starting Score | prints **842 of 1,000**; the app opens at `SCORE_BASE` 1,000, and the canvas's own Score Detail draws a solid **1,000 baseline** and Ranks' lowest rung **Deckhand 1,000** — the canvas contradicts itself | user decision (§8 D-6); build the gauge parametric |
| Today Home II, Today Home Task | day-41 header + lesson-1 task + mock "Lesson 5 / Naming your triggers" tile | special seeds; tile number = global lesson number (§5) |
| Morning 1 Yesterday | "+12 → 1,240" (a day-41 figure) on the day-13 seed | D097 stands |
| Tiers Vidi | "Day 13" cannot coexist with Pulse ×19 (one check-in per date) | own seed |
| Urge Hub Now | arc 62 % vs "17:42" (88.5 % of the 20-min window) | keep D066, name the arc diff |
| Urge Hub Score / Pledges | slip at −10 d vs "Kept every day since" a −14 d signing | per-pane seeds |
| Urge Hub Proof / Surfed | 85D's four lengths are not 85C's four newest bars | per-pane seeds |
| Urge Overview Mood | counts sum 14 vs 9 urges on Summary | per-page seeds (D126 style) |
| Weekly Report Days | only Friday carries the wave though Urges lists Tue/Thu/Fri | seed for the frame; rule per logs Q11 |
| Edit Profile | Started 14 Mar 2026 vs Week VI | D121 stands |
| Your Vow Page | Held for 92 days + Signed Apr 18 only coexist on 19 Jul | frozen clock |
| Cost Next 30 | key's "Clean day" swatch style is used by no cell; relapse vs clean cells differ by 4/255 | reproduce literally |
| Cost By Age 80 | back chevron stroked `#17160F` on `#111111` (invisible) | reproduce, keep the tap target |
| Medallion Letter | encloses Rebound; the post's rule earns Vici | data-driven card, record the divergence |
| Detail Paper | "First at ×1" + "Nine minutes…" vs Tiers Vici's ×5 / `stories[0]` | compute (D057 successor) |

### 1.5 The other bundles

* **Week-01 … Week-12 (1,273 frames, 84 lessons)** — lessons doc, every lesson in its appendix A, every
  question in appendix C, every viz in §4.8. All 284 hero svgs byte-match their `data-hero` card (checked).
  **Gap:** `audit.mjs` walks Email-Login only; the lessons doc's verification loop (§16 there) needs the
  reader's `?page=<k>` param (lessons §12.2) — make it a requirement, not an option, or 1,273 frames are only
  reachable by tapping through.
* **Lesson-Illustrations-v4 (53 cards)** — not screens; the hero source. All 53 are used somewhere (Email-Login
  uses 50 + `windowNight`; lessons 50; Email-only: `balloon`, `bell`, `fountainPen`). Only the **first**
  393×240 svg of a card is current art (the `Before` thumbnail is the old art).

---

## 2. Route coverage (src/app: 4 layouts + 62 screens, all accounted for by routes.md)

### 2.1 Framed routes and their implementing group (no conflicts beyond §3)

auth-funnel: `/`, `/splash`, `/sign-in`, `/welcome-back`, `/sign-up` (unframed inner boards; analogs in its §7).
auth-funnel + tail + paywall-reminders: `/welcome`. paywall-reminders: `/routines/morning-time`,
`/routines/night-time`, `/paywall`, `/subscription`, `/reminders`, `/notify-primer` (last two unframed).
today-day: `/today`, `/score`, `/day/morning`, `/day/night`, `/checkin` (partly framed). library: `/library`
(no frame of its own), `/week/[week]`. lessons: `/lesson/day/[day]`, `/lesson-card/[day]` and `/task/[day]`
(both → redirects). sos-flow: `/urge`, `/rough-first90`, `/urge-hub`, `/relapse`. sos-boards: the boards inside
`/urge`. slip: `/slip`. logs: `/log`, `/log-chooser`, `/lapse`, `/urge-log`, `/urge-overview`, `/report-ready`,
`/weekly-report`. medallions-letters: `/milestones`, `/medallions/[key]`, `/medallions/tiers/[key]`,
`/letter`, `/medallion-post`, `/drop`. settings: `/settings`, `/profile`, `/vow`, `/privacy`, `/applock`.

### 2.2 Unframed routes with no implementation owner — assign before Phase 1

routes.md gives each a restyle spec (its §4); nobody is assigned to build them. Recommended owners (reason):

| route | file | recommended owner | why |
| --- | --- | --- | --- |
| `/all` | `(app)/all.tsx` | settings | "Settings idiom" (its own comment); uses the 54-row groups |
| `/journal` | `(app)/journal.tsx` | today-day | Today III's ☆ is its door; pledge type 22/700 |
| `/journal-new` | `journal-new.tsx` | today-day | sibling of `/journal` |
| `/affirmation` | `affirmation.tsx` | today-day | imports `RerollGlyph` from `components/day/kit.tsx`; Change-Pledge-Sheet idiom |
| `/dashboard` | `(app)/dashboard.tsx` | logs | Urge Overview idiom, same data |
| `/lifemap` | `(app)/lifemap.tsx` | auth-funnel | V3 chips + field idiom; onboarding writes the life map |
| `/rough-days`, `/rough-protocol` | `(app)/rough-days.tsx`, `rough-protocol.tsx` (+ `components/roughDays/kit.tsx`, `content/roughDays.ts`) | sos-boards | the canvas files the 30 coping boards under the section **"ROUGH DAYS — COPING"**; protocols = the HeroBoard |
| `/first-steps` | `first-steps.tsx` | library | week-page rows + new titles |
| `/journey`, `/journey/[chapter]` | `journey/*` (+ `components/journey/JourneyScreens.tsx`, `WorldArt.tsx`, `WorldCardArt.tsx`) | library if kept; **retire recommended** (OQ-R3) | name collides with the Journey tab |

### 2.3 Unframed routes claimed by two docs (pick one spec)

| route | docs | ruling |
| --- | --- | --- |
| `/mail` | medallions-letters (owns the file) vs routes §4.15 | owner medallions-letters, **spec = routes' ruled rows** (§4 C6) |
| `/locked`, `/lessons-browser`, `/search` | library §11 vs routes §4.5/4.10/4.11 | owner library; for `/locked` use library's upcoming-row style (§4 C7) |
| `/support`, `/backtap` | settings §12 vs routes §4.7/4.13 | owner settings; the two specs agree (App Lock / Data & Privacy analogs) |

Bugs routes.md found that block review (fix in the owning group): All → `/rough-protocol?key=lonely` renders
blank (key is `loneliness`); five routes render `null` on a bad param (clamp or redirect, never a nav-less
screen).

---

## 3. Shared-file conflicts — who owns what

### 3.1 Phase 0 — must land before the groups start in parallel (orchestrator)

1. **`src/components/mono/*`** (does not exist — checked) and the token additions in `src/lib/theme.ts`
   (`tokens.json` has the values). Use design-system §11's names; every group asked for the same pieces under
   different names (MonoGround/MonoFrame/Screen…). Contents in §7.6.
2. **Hero registry**: `scripts/overhaul/gen-heroes.mjs` → `src/content/heroes.ts` (+ `mono/Hero.tsx`), §7.1.
   Requested by 10 groups.
3. **`scripts/overhaul/body.mjs`**: add `paint-order` and `data-hero` to `SVG_ATTRS` (library, lessons,
   sos-boards, tail, slip all transcribed around it).
4. **File splits** (mechanical, no visual change), so two groups never edit one file:
   * `src/components/urge/index.tsx` (3,600 lines; sos-flow + sos-boards) → `urge/flow.tsx`, `urge/hub.tsx`,
     `urge/stages.tsx` (sos-flow), `urge/boards.tsx` (sos-boards; hosts the SOS-Challenge layout), `index.tsx`
     re-exports `UrgeFlow`/`UrgeHub`.
   * `src/components/onboarding/handover.tsx` (tail + paywall-reminders) → move `O3Reminders`, `O3DayZero` to
     `onboarding/reminders.tsx` (paywall-reminders).
   * `src/components/onboarding/v3.tsx` (auth-funnel + tail) → funnel engine (`O3Shell`, `O3FunnelStep`,
     `O3AgeGate`) to `onboarding/funnel.tsx` (auth-funnel); `windowFor`, `buildWeekXiiLetter`, `O3Reading`
     stay (tail).
5. **`src/content/curriculum84.ts`** regenerated once by **lessons** via `scripts/overhaul/gen-curriculum.mjs`
   (titles from `L<n>-Frame-1`, `hero` = cover `data-hero`, `task.cardSummary` kept from `task-src.json` per
   lessons §10.3; API unchanged). Today, Library, Day Zero, Night Action, search, profile all read it.
6. **Tab bar + layouts**: `StoicTabBar.tsx`, `(app)/_layout.tsx`, `_layout.tsx` (five items, Journey,
   `/score` and `/week/*` decisions, bar ground fill — §8).
7. **D2xx ranges** — give each group a block (e.g. auth-funnel D200–209, tail 210–219, paywall 220–229,
   today-day 230–239, library 240–249, sos-flow 250–259, sos-boards 260–269, medallions 270–279, logs
   280–289, settings 290–299, slip 300–309, lessons 310–319, orchestrator 320+). Twelve groups appending
   "D200" to a 215 KB file at once will collide.

### 3.2 Files more than one group plans to rewrite (assign one owner each)

| file | groups | recommended owner | the others |
| --- | --- | --- | --- |
| `src/app/(onboarding)/welcome.tsx` | auth-funnel, tail, paywall-reminders | **tail** (largest edit: STEPS, `line-nothing`/`line-plan`, remove `change-line`/`reading`, vow date format, medallion props, back on 13 boards) | auth-funnel sends the `O3Shell`/gate call change; paywall-reminders only the import path + `O3DayZero` props |
| `src/app/(onboarding)/_layout.tsx` | auth-funnel, tail | auth-funnel | one word: `StatusBar style="light"` |
| `src/content/onboardingFunnel.ts` (`FUNNEL_GLYPHS`) | auth-funnel (generates), tail (`planSignals` whitelist) | auth-funnel | tail decouples `planSignals` from `FUNNEL_GLYPHS` (filter on the nine `13 · When` labels) **before** auth-funnel drops the legacy block |
| `src/app/letter.tsx` | medallions-letters, tail | medallions-letters | tail lands `O3LetterRead` + `WEEK_XII_LETTER` (4 paragraphs, bold run) first |
| `src/content/weekXiiLetter.ts` + `scripts/overhaul/gen-letter.mjs` | tail | tail | letters reads |
| `src/content/sosResponses.ts` + `scripts/overhaul/gen-sos-boards.mjs` | sos-boards (generates), sos-flow (Challenge) | sos-boards | shape per sos-boards §8 incl. `challengeLabel` |
| `src/app/relapse.tsx` | sos-flow (+ slip twins) | sos-flow | renders through kit `HeroBoard` + `PledgeCard` |
| `src/app/urge-log.tsx` | logs, slip (imports 8 symbols) | logs | logs creates `src/components/logflow/*` (`WhenPicker`, `ChipsQuestion`, `DoneSummary`, …), keeps re-exports until slip switches |
| `src/components/routines/wheel.tsx` (+ `kit.tsx`) | paywall-reminders, logs, slip | **orchestrator** as `mono/TimePicker` (or paywall-reminders with an agreed API) | API: value `{hour12, minute, period}`, `onChange`, loop hours/minutes, 2-item period, snap 44, **tap a neighbour row to step** (slip needs it) |
| `src/app/routines/*-time.tsx` | paywall-reminders, settings | paywall-reminders | settings verifies `?from=settings` (back/save return to Settings) |
| `src/app/weekly-report.tsx` | logs, settings | logs | drop `backLabel`; keep `from` |
| `src/lib/weeklyReport.ts` | logs (+ readers `(app)/_layout`, `mail`, `all`) | logs | additive only |
| `src/lib/score.ts` | today-day (moves `scoreHistory`/`monthLedger` in), logs, tail | today-day | additive only |
| `src/lib/routines.ts` | paywall-reminders (morning 8:00 AM) | paywall-reminders | settings/today read |
| `src/components/keepsakes/Medallion.tsx` | medallions-letters, settings (`profile.tsx` imports `KKMedallion`), logs (reads `KK_ALBUM`, `KK_METALS`) | medallions-letters | keep `KK_ALBUM`/`kkStanding`/`KK_METALS` exports; shim `KKMedallion` until profile lands |
| album counting hook (from `milestones.tsx`) | medallions-letters (`useMedallionLedger`), settings (`useAlbumStanding` in `src/lib/album.ts`) | medallions-letters, **one file** `src/lib/album.ts` exporting both names | settings consumes for "10 of 12" |
| `src/app/lesson/day/[day].tsx`, `src/components/lesson/*`, `src/content/lessonReader.ts` → `lessons.ts` | lessons, lesson-scroll | lessons | lesson-scroll verifies L1 |
| `src/app/lesson-card/[day].tsx`, `src/app/task/[day].tsx` (→ redirects) | lessons; callers in today-day, library, routes screens | lessons | callers switch to `/lesson/day/N` (or keep pushing the redirect) |
| `src/app/(app)/today.tsx` | today-day (+ sos-flow door, lessons task route) | today-day | |
| `src/components/day/kit.tsx` | today-day (+ `affirmation.tsx` imports `RerollGlyph`) | today-day | keep or move the export |
| `src/components/MoodLogger.tsx` | today-day (+ logs routes to `/checkin`) | today-day | |
| `src/components/ui/Feedback.tsx` (`LoadingView`, `EmptyState`) | routes + every screen with a loading state | orchestrator | mono variant per routes §7–8 |
| `src/components/ui/AppText.tsx`, `ui/press-scale.tsx` | everyone | orchestrator | do not change defaults globally; kit primitives pass `textWrap` and `minHeight` explicitly (§6 G6) |
| `convex/schema.ts`, `src/lib/types.ts` | sos-flow (optional `feelings[]`) | orchestrator, only with user approval | |
| `.overhaul/recipes/sos.json`, `drives/b-SOS-*.js`, `sos-*.js`, `rel-*.js`, `hub-*.js` | sos-flow, sos-boards, slip | sos-flow owns `sos.json`; sos-boards writes `sos-boards.json` + `b-SOS-*` | |
| `.overhaul/recipes/lesson-scrolls.json` (stale, 31 old entries; sorts after a new `lesson-scroll.json` and overrides it) | lesson-scroll, lessons | lessons deletes it | |
| `DECISIONS.md` | all | orchestrator allocates ranges (§3.1.7) | |

### 3.3 Kit components several groups would otherwise build separately (put in `mono/`)

`HeroBoard` (slip 26 frames, sos-boards 30, sos-flow 9, logs 1, medallions 2, tail/auth statement boards) ·
`PledgeCard` (today-day, slip, sos-flow) · `UrgeScale`/`IntensityScale` (sos-flow, logs) · `TimePicker` +
`WhenStep` (paywall, logs, slip) · `DoneSummary`/`SummaryCard` (logs, slip) · `Chips`/`Options`/`Grid2` (6
groups) · `RowGroup`/`Row`/`Toggle` (settings + routes' unframed screens) · `Sheet` (today-day, settings,
routes, logs' date chooser) · `TabBar` usable standalone (today-day, library, logs, medallions) · `CheckDisc` ·
`Hero` (10 groups).

---

## 4. Contradictions between documents — checked against the frames

**C1. Hero ids.** sos-flow §2.7 invents ids (`bedroom`, `phoneLock`, `stormCloud`, `envelopeTilted`,
`dominoesTipping`, `penSigning`); auth-funnel names cards by file (Pencil, ID-badge…); everyone else uses
`data-hero`. **Ruling:** key the registry on the 53 cards' own `data-hero` ids (each card carries it);
sos-flow's map is `bed`, `feedOff`, `thunderCloud`, `envelope`, `dominoes2`, `fountainPen`. **New finding:**
`Checkin-Emotions.html` is tagged `data-hero="windowNight"` — no card has that id (the kit's `H.windowNight`
is an older window drawing) — but its art is **byte-identical to `nightMoon`** (verified). today-day is right
to call it nightMoon; sos-boards' proposed generator assert ("svg body equals the card with the same
`data-hero`", sos-boards §8.4) would throw on it. Add an alias `windowNight → nightMoon`, or key by art hash.

**C2. Hero RN implementation.** Five docs (sos-flow §2.7, slip §2.7, tail §1, logs §1, paywall §1) give a
393×240 `<Svg>` at `left:0` with `overflow:'visible'`; auth-funnel centres a 393 box with `left:'50%'`;
library/lessons/sos-boards give a **screen-wide** `<Svg>` with a viewBox x-offset and vertical padding;
design-system a bounds-based viewBox. Frames: full-bleed art runs x −63.6…456.7 and the frame clips at 0/393.
Native `react-native-svg` does not honour `overflow:visible`, and a 393 box at `left:0` stops full-bleed
grounds at x 393 on a 430 phone. **Ruling:** the screen-wide padded form (§7.1). The other snippets are
pixel-identical only at 393 on web.

**C3. Settings rows: group-local vs shared.** settings §0.3/§11 builds the 54-row `SettingsGroup/Row/Toggle`
locally ("no frame outside this group draws it" — true); routes §4 uses exactly that row group for `/all`,
`/dashboard` doors, `/rough-days`, `/support`, `/backtap`, `/mail` (option), and design-system §7.14 lists it
as the dominant `RowGroup`. **Ruling:** `mono/RowGroup` (+ `Row`, `Toggle`); settings builds it there.

**C4. Toggle OFF** (never drawn). design-system §9: track `#2E2E2E`, knob `#F2F0EC`; settings OQ3: knob
`#9B968E`. Kit (`mono-kit.js` l.47): off = track LINE `#2E2E2E`, knob `#FFFFFF` at left 3. The frames'
correction pattern for kit `#FFFFFF` is "map to the palette" (on-ink text → `#111111`, ON knob → `#1E1E1E`);
the light knob on a dark track maps to ink. **Ruling:** design-system — `#2E2E2E` track, `#F2F0EC` knob,
`left 3`. (Record as D2xx; user may prefer settings' dimmer knob.)

**C5. Lato `line-height: normal`.** auth-funnel §2 and logs §1 say "1.2 × size"; design-system §3.2 gives
`round(0.987·s) + round(0.213·s)` with a table. Signatures: 17 px → **21** (auth-funnel's own sig note; 1.2×
gives 20.4), 26 → 32, 76 → 91. **Ruling:** design-system's table (`lhNormal(size)` in theme). Same numbers at
15/16/13 px, so the other docs' measured values stand; only the formula is wrong.

**C6. `/mail` layout.** routes §4.15: title head + **ruled rows** (Log Reports idiom). medallions-letters §6:
"titleHead + kit listRows-style **card** as in Log-Reports/Settings" — but Log Reports draws **no card**
(ruled rows on the ground; verified in logs §3.7). Mail lists weekly reports, which Log Reports already
shows as ruled rows (`Jul 7–13 · +8`). **Ruling:** routes' ruled rows, empty state per routes §4.15.

**C7. `/locked` rows.** routes §4.5 swaps the chevron for a 14 lock glyph; library §11 uses the upcoming row
(number `#9B968E`, chevron `#5A574F`). No frame draws a lock anywhere (library verified all 24 week pages;
lessons none). **Ruling:** library — upcoming style, no invented glyph; the title "Weeks", the count line
and the "Unlock VICI Plus" primary carry the meaning. Same for `/first-steps` locked rows (routes §4.9 says
"+ lock glyph") — drop the glyph, keep `disabled`.

**C8. `/medallion-post` arrival.** tail §2.19 says it "borrows Medallion Received (D138)"; medallions-letters
Q10 recommends **Letter Arrival** for both posts. FLOW: the section `ROUTINES & JOURNEY` runs `90B · VICI Post —
Arrival` → `39 · The Letter — Read` → `39B · Post — Medallion Letter` → `39C` → `39D`; Medallion Received is
`41 · Medallion Earned` inside onboarding. **Ruling:** Letter Arrival is the arrival for both posts
(medallions-letters option B); its caps line becomes data (`Week <roman> post`, medallions Q7).

**C9. Sentence-in-ink inputs: typed state or placeholder?** sos-flow Q7 recommends painting SOS Afterward's
"I need to say…" as a placeholder in `#F2F0EC`; today-day OQ-N3 treats Night 3 Reflection's identical
situation as typed text (placeholder colour undrawn). The canvas has one convention, visible on three
frames: **V3 Q24 Name** draws the caret *before* a `#9B968E` placeholder ("Your name"); **Sheet Edit Name** and
**Change Pledge Sheet** draw the caret *after* ink text = a typed value. Afterward and Reflection draw the
caret after ink text. **Ruling:** both are typed states; placeholders are `#9B968E` everywhere; the recipes type
the sentence. (Do not set `placeholderTextColor` to ink.)

**C10. Summary card width.** slip §2.11 tells the shared card to `alignSelf:'stretch'` (98E happens to render
345 because its content exceeds 345). logs §3.4/§3.20: Lapse Done card is shrink-to-fit **326** wide, Urge Log
Done **249** wide (x 72). A stretched shared `DoneSummary` breaks both. **Ruling:** shrink-to-fit
(`alignSelf:'center'`, `maxWidth:'100%'`, label `flexShrink 0`, value `flexShrink 1`) — reproduces all three.

**C11. `numberOfLines`.** design-system §10.10: never use `numberOfLines` for `nowrap` (it truncates).
settings R1: settings-row values `numberOfLines={1}` + ellipsis so "Week II, Changing Your Mindset" does not
overflow a 375 row. **Ruling:** both, scoped — fixed copy never truncates; a **dynamic** value may ellipsise
only where the 393 frame shows it whole (so parity holds at 393 and nothing overflows at 375).

**C12. SOS tab target.** today-day leaves it open between `/urge-hub` and Cue Intro; sos-flow Q1 and routes
§5.2 recommend `/urge`. The frame is named **"Cue Intro *Modal*"** and FLOW opens the section `URGE SOS — FIRST
90 SECONDS 28 · SOS — First 90 Seconds`. **Ruling:** the disc pushes `/urge`; the hub's doors are Today's
"Urge surfing" tile/card. Present `/urge` as `fullScreenModal` or a plain push — never `modal` (an iOS page
sheet no frame draws).

**C13. Small-screen behaviour** — eight different rules (sos-boards: lift hero+stack; slip/sos-flow/logs: hide
bottom heroes, scroll question boards; paywall/settings: ScrollView with min-height; tail: lift or scroll;
library: rows viewport then page scroll < 720; lessons: band modes + fade; auth-funnel: scroll + hero at
`max(T, stackBottom+gap)`). Not wrong individually; inconsistent together. One policy in §7.3.

**C14. Disabled primary** (never drawn): auth-funnel "0.26 idea", logs "0.34 as now", app code uses 0.38
(`auth/kit.tsx`, `sign-up.tsx`) and 0.4 (`ui/Button.tsx`). **Ruling:** one kit constant — same pill at
`opacity 0.38` (the auth convention; no new colour, per design-system §7.5). Needs a D2xx.

**C15. Lesson reader small screens.** lesson-scroll §6 (L1 only: "plain clipped scroll, fade optional") vs
lessons §2.1 (runtime band modes centre / tall / scroll + 150 fade, 122 overflowing pages at 375×667).
lesson-scroll's L7 F11 "5 options" is wrong — **9** (verified). **Ruling:** lessons' band-mode rule.

**C16. Week-strip start day** — not a doc contradiction but a canvas one nobody should "fix": Today Home's
strip is **Sunday-first** `Su Mo Tu We Th Fr Sa` (verified in the dump); Log Urges/Check-ins are
**Monday-first** `M T W T F S S`; Weekly Report Days is Monday-first; check-in-time day toggles are
Sunday-first. Transcribe per screen.

**C17. Medallion count hook name** — `useMedallionLedger` (medallions-letters) vs `useAlbumStanding` in
`src/lib/album.ts` (settings): one file, both exports (§3.2).

Numbers checked and consistent across design-system and every group (no action): nav row, dashes formula,
primary/ghost anchors (ghost 60, not the kit's 62), sheet shells (scrim `rgba(0,0,0,0.68)`, `#171717`, r28,
T 120/420/512/556), segmented on-text `#111111`, NextFab chevron `#111111`, SOS label `#111111`, tone ramp,
intensity bars, energy bars (index 1 = two ink bars, verified), grid2, chips/options 15 px, tab bar centres,
pager dots 6×6, the ten `#111111` frames, letter `#121212`, Paywall/Drop top chrome.

---

## 5. Open questions the frames already answer

| doc · question | answer (evidence) |
| --- | --- |
| auth-funnel Q8 / tail Q4 — keep the `reading` (Campaign Map) step? | **Remove it.** FLOW goes `34 · What You Want Back` → `38 · A Letter Arrived` (35–37 absent) and Want Back's CTA is now "Continue". Record as a behaviour change (§8). |
| auth-funnel Q7 — Gender auto-advance | Yes: the frame has no primary; every no-primary option screen auto-advances (260 ms). Behaviour change, flag (§8). |
| auth-funnel Q6 — stack top 140 on Q5/What starts it/Q17 | Transcribe per frame. |
| auth-funnel Q11 — Age's projection line | Omitted (frame wins; app already omits it). |
| tail Q2 — Cost Next 30 grid | Reproduce literally (`#0D0D0D`/1.6 vs `#111111`/1.8; key swatches as drawn). |
| tail Q3 / design-system Q4 — Age-80 chevron `#17160F` | Reproduce colour, keep the 36×40 tap target. |
| tail Q5 — What You Want Back reads `affects`? | The frames support it: What-it-affects selects Focus, Sleep, Confidence and the pills show exactly those, in chip order. Read back; fall back to the fixed trio when fewer than three. |
| tail Q7 — Line boards' "5× / 2× a week", "3 MONTHS" | Fixed illustration (no data rule drawn). |
| tail Q10 — Letter/Medallion Received lose ✕ | Yes; "Save it for later" / "Continue" remain. |
| tail Q11/Q13 | "Continue"; row-5 bolt. |
| paywall OQ2 — morning default | **8:00 AM**: Morning Check-in Time's wheel and Settings' row both say 8:00 AM. |
| paywall OQ3 / settings Q8 — night default | Frames disagree (wheel 10:30 PM, Settings row 9:30 PM): keep 10:30 PM, seed per frame. |
| paywall OQ10 — Day 0 lesson title | `lessonForDay(1).title` = "Prepare for tonight" after lessons regenerates `curriculum84.ts` (Phase 0). |
| paywall OQ8, settings Q10, medallions Q12, sos-flow Q15, sos-boards kit list, slip Q7, library generator list, logs 16 | Frame wins everywhere (already ruled by each doc). |
| today-day OQ-T6 — lesson tile number | Global lesson number: every other frame numbers lessons 1–84 globally (Day Zero "Lesson 1", covers "Lesson 8", reader header "Lesson 84"). |
| today-day OQ-S3 — Score pager dots | None drawn; swipe only. |
| today-day OQ-M5 — signature row height | 65.5 (12 + 44 + 8 + 1.5). |
| today-day OQ-X1 | Frozen clock Fri 18 Jul 2025 (09:00; 20:00 for Today III). |
| logs Q1 — Log Chooser default | **"An urge" (index 1).** Where the app already has a default for a control, the frames draw it (SOS Strength band 3, Urge-Log intensity 3, outcome 0, place "private"); the chooser's drawn selection is reached with no tap. Same rule changes the hub chip default to *none* (sos-flow Q11). It does **not** pre-select Morning Task Check's "Yes" (the app has no default there and a default "Yes" would write a false completion) — keep today-day's OQ-M1 recommendation. |
| logs Q6 / slip Q5 — display join | `", "` + lower-case after the first item (frames); storage stays `' · '`. |
| logs Q5 / slip Q3 — day words | Both docs derived the same rule from the frames (Tonight/Today/Last night/Yesterday/none); one helper (§6 G2). |
| logs Q10 — bubble sizes | Fixed rank series 88/66/54/36. |
| logs Q14 | Log tab → chooser (D124); chooser draws no bar. |
| logs Q15 — "this week" | Monday-start calendar week for the Log tab (strip M…S); Today's strip stays Sunday-first (C16). |
| medallions Q1 — album paging | Pages of six (only reading that draws Medallions + Album Earned II); horizontal pager, no dots. |
| medallions Q4 — Platinum +1 | Reproduce with `T = 196 − 13·quoteLines + (standing===5 ? 1 : 0)`. |
| medallions Q10 | Letter Arrival (C8). |
| medallions Q11 | Lato 700 italic (`sansItalic()`). |
| sos-flow Q1 | `/urge` (C12). |
| sos-flow Q7 | Typed state, placeholder `#9B968E` (C9). |
| sos-boards Q2 — Continue vs Done | Verbatim per frame (Elsewhere, Cant-Sleep, Alone, Unknown keep "Done"). |
| slip Q1 — wheel always open | Yes (frame draws it inline under a caps label; no "Choose a time" control). Same for Lapse/Urge-Log When. |
| settings Q2 — Username/Email chevrons | Draw them (frame); rows stay inert. |
| settings Q9 — Weekly report row | Opens the report (`93D · Weekly report` is the report board). |
| library Q2 — P1/P2 | One 264-pt rows viewport scrolled 0/264. |
| lessons "correction" | L7 F11 has 9 options (verified). |

---

## 6. Gaps no document covers

* **G1 Dynamic Type / font scaling.** Nothing in `src` sets `allowFontScaling` or `maxFontSizeMultiplier`
  (grep). Every board is absolutely positioned for 852; at the largest accessibility sizes text overruns pills,
  rows and the tab bar. Decide once in the kit text primitives (e.g. `maxFontSizeMultiplier 1.2` on chrome,
  nav, pills, tab labels; body copy free but inside a scroll region).
* **G2 Shared text utilities** that three groups would each write: number → words, sentence-initial and
  hyphenated to at least 1,000 (sos-flow "Twenty-two minutes", logs "Twenty-three ridden out. Two to Bronze.",
  the hub's `hubWord` stops at "Twenty"); day-part phrases (`Tonight, Tue Jul 22`, `Last night`, `Tonight,
  11:40 PM`); the comma/lower-case join; en-US short dates assembled by hand (settings: `en-GB` prints "Sept");
  roman numerals. Put them in `src/lib/format.ts` (orchestrator) before logs/slip/sos-flow start.
* **G3 Clock-freeze helper.** Seven recipe worlds need a frozen `Date`: Fri 18 Jul 2025 09:00/20:00 (Today,
  Score), Sun 20 Jul 2025 (Log, Overview), Mon 21 Jul 2025+ (Reports), Tue 22 Jul 2025 23:40 (Lapse/Slip/Urge
  When), 21 Jul 2026 (Paywall Confirmed), 10 Jul 2026 (Subscription), 2026-06-09 (The Vow), ~19 Jul 2026 (Your
  Vow). logs §9 has a snippet; slip uses `f-slip-seed*-2340.js`. One `.overhaul/clock.js` (`?now=` or a global
  set before the seed) avoids five forks.
* **G4 Lesson verification loop** — see §1.5 (`?page=` + a sequential capture script; design PNGs for the week
  bundles are still being captured).
* **G5 D2xx numbering** — §3.1.7.
* **G6 Two shared defaults that silently break frames:** `PressScale` forces `minHeight: 44`
  (`ui/press-scale.tsx:35`) — distorts the 36×40 nav slots, 48 chips, 24 pills; `AppText` sets web
  `textWrap: 'pretty'` on every non-heading (`ui/AppText.tsx:128`) — wrong for every run the frames leave at
  `wrap` (vow body, notification bodies, summary values, lesson-row titles, paywall features) and for `label`
  runs that say `balance`. The kit primitives must pass both explicitly; don't change the globals mid-run.
* **G7 Accessibility labels for icon-only controls.** The words "Back", "Close", "‹ Back", "Skip" disappear
  everywhere (chevron/✕ only). Recipes and screen readers find controls by text; every icon control needs
  `accessibilityLabel` (`Back`, `Close`, `Share`, `Next`) — lesson-scroll noticed it for the reader only.
* **G8 `-webkit-font-smoothing: antialiased`** on the web root (design-system §10.12): the canvas root sets
  it, the app has no `+html.tsx`. Glyph-edge residue in every pxdiff otherwise. Orchestrator.
* **G9 Interaction states the frames never draw, decided once:** pressed (keep `PressScale`), disabled (C14),
  toggle off (C4), day toggle off (`#1E1E1E` + ink), selected lesson option (lessons §13.1 — ink row with a
  **filled `#111111` mark** and `#F2F0EC` letter; precedent: Paywall's selected radio is a dark disc with an ink
  check on an ink card — prefer it to design-system's "ring + letter" wording), focus (platform caret, ink).
* **G10 Status bar on sheets.** The canvas scrim covers the status bar (z 40 over z 20); the native status bar
  cannot be dimmed — ignore 0–54 in pxdiff for the four sheet frames (design-system noted; recipes should
  carry `--ignore=0,0,393,54`).
* **G11 Android chrome.** `app.json` sets `userInterfaceStyle: dark` (good: keyboards/alerts dark) but no
  Android navigation-bar style; with edge-to-edge the tab bar formula `70 + max(insets.bottom, 34)` covers
  gesture and 3-button bars — check on an emulator once.
* **G12 Copy for unframed screens** — routes OQ-R6 (keep existing strings). Make it the rule for every
  group's "no frame" list so nobody authors copy (exceptions the user must approve: Breathe Hold/Out heads,
  Reassess same/rising notes, Surf Complete `<1 min`, hub empty states, Rescue/Subscription undrawn states,
  vow re-sign confirmation).
* **G13 Dead-code deletion order.** `lessonPlates.ts`, `taskScenes.ts`, `TaskScene` are still imported by
  search, lessons-browser and the today kit; `WeekScene`/`weekScenes.ts` only by library; `slip/art.tsx` only by
  slip; `MoodLogger` modal export, `CampaignMap`/`CampaignGrounds` already dead. Delete after the consumers
  switch, in the owning group, and re-grep before deleting.

---

## 7. Canonical cross-cutting specs (resolving the forks above)

### 7.1 Hero (registry + component)

* Generator `scripts/overhaul/gen-heroes.mjs`: for each of the 53 `Lesson-Illustrations-v4` cards take the
  **first** `viewBox="0 0 393 240"` svg; emit `HEROES: Record<HeroId, Node[]>` (tag + all attributes, inner
  `<g transform>` strings, inherited `<g fill>`, `fill-opacity`, `stroke-dasharray`/`-dashoffset`, Medal's
  `<text>`); **`paint-order="stroke"` emitted as two elements** (shape with fill + stroke, then the same shape
  `stroke="none"`) — 22 elements in 17 cards; alias `windowNight → nightMoon`; `HERO_BOUNDS` from
  `gen/hero-bounds.json`; `HERO_BOX` for the lesson reader (lessons appendix B).
* `mono/Hero` (CSS mode): props `id, top (canvas), scale (default 1.1)`. Render
  `<Svg style={{position:'absolute', left:0, top: top − 54 − P}} width={W} height={240 + 2P}
  viewBox={`${−(W−393)/2} ${−P} ${W} ${240+2P}`}>` + `<G transform={`translate(${196(1−s)} ${190(1−s)})
  scale(${s})`}>`, `P` from the bounds (≥ 24). Pixel-identical at 393; centred and edge-to-edge at 375/430;
  no reliance on `overflow`. Always `position:'absolute'` (SVG trap). Never `rotation/origin` props.
* `mono/Hero` (crop mode, Today II/Task/III only): `viewBox` crop per today-day §0.5 (`vy = top_b − 3`,
  `vh = b − t + 6`, `s = round2(148/vh)`, `vw = W/s`, `vx = 196.5 − vw/2`), no transform.
* Lesson reader wraps it in the hero box (`h`, `T` per id) — lessons §5.2.

### 7.2 HeroBoard (kit)

`{ tone: 'sos'|'hub'; nav: { left?: 'back'; centre?: kicker | {step,total} ; right?: 'close' };
hero: {id, top=190, scale=1.1}; stack: {top=452, gap=18, center=true}; titleSize: 30/36 | 26/33 | 34/40;
title; body; extra?; cta; ctaBottom: 48|96; ghost?; onClose; onCta; onGhost }`. Covers sos-boards (30),
slip (26), sos-flow (Intro, Moves ×3, Complete, Relapse ×3), Letter Arrival, Drop Received (medal instead of
hero), Report Ready, and — with `titleSize 26/33, stack 451, gap 16|18` — the tail/auth statement boards.

### 7.3 Small-screen policy (one rule for every board; a no-op at 393×852)

Let a board's bottom controls (primary, ghost, fab, tab bar) stay anchored to the screen bottom (D026) and
top-anchored content stay at `canvasY − 54 + insetTop` (D009). If the content's bottom + 16 ≤ the top of the
highest bottom control, render as the canvas. Otherwise, in this order:
1. **Hide decorative heroes that sit between content and controls** (question boards' heroes at T 458/506/582,
   check-in heroes) — they carry no information.
2. **Hero boards** (hero at 190 + centred stack at 451/452): translate hero + stack up together by the deficit,
   capped so the art's top stays ≥ canvas 108 (≈ 100 pt of free ground; sos-boards' worst case needs 67).
3. **Everything else** (forms, lists, cards, letters, pickers): the region between the nav row and the
   controls becomes a vertical `ScrollView` with `paddingBottom = controlsHeight + 24`; the nav stays fixed;
   title-head pages (Settings, Log, Medallions) scroll whole.
4. Tab screens scroll under a tab bar painted with ground + noise (invisible at 852; OQ-R10 → yes).
5. Lesson reader: lessons' band modes (centre / tall / scroll + fade).
6. Never shrink type, never overlap a control. Check 375×667 (inset 20), 390×844, 430×932.
Library's week page is case 3 below H ≈ 720 (its rows viewport collapses to 79 pt at 667).

### 7.4 States never drawn (kit defaults; record as one D2xx)

Disabled primary: same pill, opacity 0.38. Toggle off: track `#2E2E2E`, knob `#F2F0EC` at left 3. Day toggle
off: `#1E1E1E` + 14/700 ink. Chip/option/grid pressed: `PressScale` only. Lesson option selected: ink row,
`#111111` filled mark, `#F2F0EC` letter. Inputs: caret ink (`selectionColor/cursorColor`, web `caretColor`),
placeholder `#9B968E`, `keyboardAppearance` follows `userInterfaceStyle` (dark).

### 7.5 Text rules

`lineHeight` explicit everywhere a frame states one, else `lhNormal(size)` (design-system table) where box
position matters. `textWrap` explicit on web per run (`balance` | `pretty` | `wrap` | `nowrap`); native gets
`\n` only for fixed copy that breaks differently from greedy at 393 (lists exist: auth-funnel §3.8, sos-boards
§6, slip §2.5, tail, paywall time titles; lessons' `BREAKS` table needs a ruling). `numberOfLines` per C11.
Weight → family via `sans()`; italic → `sansItalic()` (Lato 700 italic, including the medallion quotes).

### 7.6 Kit component list (canonical names, design-system §11) with consumers

`Screen` (variant app / lesson / dark / letter; noise anchored at window (0,0), outside any ScrollView;
scroll-with-min-height mode) · `NavBar` (left back/none/80-wide; centre title/dashes; right
close/share/text/pill/dropdown; tone; chevron colour override for Age 80) · `NavDashes` · `TitleHead` ·
`H1/Title/P/Caps` (all size/lh variants in design-system §3.3) · `Stack` · `PrimaryButton` (bottom 48/82/96,
tone, `tracking={0}` for sheets, disabled) · `GhostLink` (bottom 48/56/60, weight 400/700, tone) · `NextFab` ·
`RingNext`/`IconCircle` · `OptionList` · `Grid2` · `Chips` · `WhenChips` (44 pills) · `Card` variants ·
`RowGroup`/`Row`/`Toggle` (54) · `ListRows` (60, Manage Subscription only) · `RuledRows` (logs, mail) ·
`DetailRows`/`SummaryCard` (shrink-to-fit) · `CheckRows` · `Segmented` · `Pill` variants (range, badge,
status, dark tag, place, outline small, check-in chip, streak, delta) · `TabBar` (+ icons; standalone-capable)
· `PagerDots` · `ToneScale` · `IntensityScale` · `EnergyBars` · `CheckDisc` · `Sheet` (frame shell, frame-level
buttons, keyboard lift) · `TimePicker` + `DayToggles` · `TextField`/`FieldCard` variants · `Spinner` +
`StepList` · `Hero` + registry · `HeroBoard` · `PledgeCard` (unsigned dashed / signed) · `LaurelMark`
(`tintColor #FFFFFF`, stretched) · `MedalTier` · icons (`ChevronL/R/D`, `FabChevron`, `CloseX`, `Check`,
`Share`, `Flame`, `Person`, `Bolt`, `ArrowUp`, `Quote`, `Pencil`, `Apple`, `Google`) · mono `LoadingView` /
`EmptyState`.

---

## 8. Decisions the orchestrator must take (or ask the user) — consolidated, with recommendations

| # | decision | raised by | recommendation |
| --- | --- | --- | --- |
| D-1 | Paywall draws no dismiss; funnel would be trapped | paywall OQ1 | ✕ in the nav right slot where Paywall Rescue draws it (353,71); make footer "Restore" tappable. **User's call** (visible change to the frame). |
| D-2 | Yearly Drop draws no close | medallions Q9 | ✕ in the empty left 80-pt slot. User's call, decide with D-1. |
| D-3 | Library tab root (canvas draws no index) | library Q1, routes | Library tab = horizontal pager of the 12 week pages opening on the current week; `/week/[week]` → redirect. |
| D-4 | `/score` and `/week/*` must show the tab bar | today-day, library, routes | move `score.tsx` into `(app)` as a hidden tab screen; week via D-3. |
| D-5 | Tab bar ground fill | design-system, library, routes OQ-R10 | yes (ground + noise; invisible at 852). |
| D-6 | Starting Score 842 vs SCORE_BASE 1,000 | tail Q1 | user's call; the canvas's own Score/Ranks floor (1,000) argues for showing the app's rating on a parametric gauge. |
| D-7 | `All` drawer leaves the bar; 16 screens reachable only from it | routes OQ-R1 | keep the route; long-press the Today avatar in mock/dev builds + URL. |
| D-8 | Invariant #5 — `/support` reachable only from All | routes OQ-R2 | needs a production door; user's call (a row the frames do not draw). |
| D-9 | Retire or restyle All-only screens (`/journey*`, `/dashboard`, `/mail`, `/lifemap`, `/locked`, rough days, `/affirmation`, `/first-steps`, `/notify-primer`, `/reminders`, `/backtap`, `/relapse`) | routes OQ-R3 | restyle (functionality must be preserved — user's own instruction); retire only `/journey*` if the user agrees. |
| D-10 | Behaviour changes in the restyle | auth-funnel, sos-flow, lessons, today-day, paywall, tail | user's yes on each: Gender auto-advances; SOS pickers multi-select (board = first selected in canvas order; `reasons` = all; `feeling` stays single unless a schema field is approved); `completeLesson` on "Finish lesson" (only if not completed); `Health / wellbeing` → `Health` (map old stored values on read); morning default 8:00 AM; `reading` step removed; Today's pinned urge bar removed (doors move to the SOS disc + "Urge surfing"); Today II's task row opens the reader's task page; `/lesson-card` and `/task` become redirects. |
| D-11 | Unreachable SOS boards — verification path | sos-boards Q3 | mock-only `/urge?board=`. |
| D-12 | Small-screen policy | 8 docs | §7.3. |
| D-13 | Undrawn states | design-system §9 + 6 docs | §7.4. |
| D-14 | Native line breaks for lessons (527 runs) | lessons Q6 | accept greedy on native except at 393 with font scale 1 (lessons' `BREAKS` option) — user's call on effort. |
| D-15 | Score "Months" dropdown options | today-day OQ-S1 | Months = 3M, Year = 1Y in a kit sheet. |
| D-16 | Native splash image | routes OQ-R5 | plain `#0D0D0D` (no image). |
| D-17 | `presentation:'modal'` on `first-steps`, `lessons-browser`; `affirmation` transparent | routes OQ-R4 | plain push / `fullScreenModal`; affirmation `transparentModal` + fade. |
| D-18 | Auth error colour (`#B5624F` is the only hue left) | auth-funnel Q4, routes OQ-R7 | error 14/700 ink, notice 14/400 `#9B968E`. |
| D-19 | Age wheel range | auth-funnel Q1 | 13–99 (keeps the under-18 gate reachable). |
| D-20 | Reassess same/rising notes, Breathe Hold/Out heads, Surf Complete `<1 min`, hub empty states, vow "Re-sign" behaviour, Rescue/Subscription undrawn copy | sos-flow, settings, paywall | user approves the proposed strings once, as a batch. |

---

## 9. Risks (cross-cutting)

* Parallel groups building local copies of kit pieces before Phase 0 lands → 3–4 drifting versions of the
  same board, wheel and pledge card.
* Web-invisible heroes (SVG trap) — a passing signature with the art gone; every group must look at the PNG.
* Generator forks re-run against stale dirs (`scripts/vicifull/*`, `scripts/uifinal1/*`): funnel, tail, letter,
  sos boards, curriculum, lesson reader, week scenes — the new forks live in `scripts/overhaul/`; old scripts
  must not be re-run.
* Recipes/drives tap ~40 renamed labels (`Start the interrupt`, `Door is open`, `I’m up`, `Continue · 2`,
  `Weekly reports`, `Read it`, `Open it`, `I sign it`, `Take it`, `Start my 3 free days`, `I can do that`,
  `See the twelve weeks`, `YOUR VICI RATING`, `Close`/`Skip` on the paywall…) and some titles now appear on
  two screens (`Get out of bed.`, `Leave the room.`, `Put the phone away.`, `If nothing changes.`) — drives
  must wait on the step before and on first lines only.
* `StatusBar style="dark"` in 41 files (counted) — invisible in web captures, wrong on every device.
* Data-contract edits (`Health`, multi-select reasons, completion writes, morning default) ripple into Log,
  weekly report, insights and medallion counts owned by other groups.
* Removing `KKMedallion`, `FUNNEL_GLYPHS`, `O3LetterRead`'s old API, `urge-log` exports or `lessonPlates.ts`
  before their consumers switch breaks compiles in another group's area.
* 2,343 + 365 SVG circles (tail), ~500 coin-rim circles (album) — batch into paths on native.
