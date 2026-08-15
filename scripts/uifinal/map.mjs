/**
 * Design frame -> app file mapping, and the disposition of every frame in the
 * `UI Final` bundle.
 *
 * `target` is the app file that owns the screen. `note` records the frame's
 * disposition where it is not simply "implement it" — superseded drafts,
 * byte-identical duplicates, and the sets that are data rather than screens.
 */

/** Email Login.dc.html — the primary, authoritative canvas. */
const EMAIL_LOGIN = {
  // --- Rough days (95–101C) -------------------------------------------------
  'Rough Loneliness I': 'src/app/(app)/rough-days.tsx',
  'Rough Loneliness II': 'src/app/(app)/rough-days.tsx',
  'Rough Loneliness III': 'src/app/(app)/rough-days.tsx',
  'Rough Anxiety I': 'src/app/(app)/rough-days.tsx',
  'Rough Anxiety II': 'src/app/(app)/rough-days.tsx',
  'Rough Anxiety III': 'src/app/(app)/rough-days.tsx',
  'Rough Stress I': 'src/app/(app)/rough-days.tsx',
  'Rough Stress II': 'src/app/(app)/rough-days.tsx',
  'Rough Stress III': 'src/app/(app)/rough-days.tsx',
  'Rough Boredom I': 'src/app/(app)/rough-days.tsx',
  'Rough Boredom II': 'src/app/(app)/rough-days.tsx',
  'Rough Boredom III': 'src/app/(app)/rough-days.tsx',
  'Rough Late night I': 'src/app/(app)/rough-days.tsx',
  'Rough Late night II': 'src/app/(app)/rough-days.tsx',
  'Rough Late night III': 'src/app/(app)/rough-days.tsx',
  'Rough Home alone I': 'src/app/(app)/rough-days.tsx',
  'Rough Home alone II': 'src/app/(app)/rough-days.tsx',
  'Rough Home alone III': 'src/app/(app)/rough-days.tsx',
  'Rough An argument I': 'src/app/(app)/rough-days.tsx',
  'Rough An argument II': 'src/app/(app)/rough-days.tsx',
  'Rough An argument III': 'src/app/(app)/rough-days.tsx',

  // --- Medallions (88–89F) --------------------------------------------------
  Medallions: 'src/app/(app)/milestones.tsx',
  'Medallions Still To Earn': 'src/app/(app)/milestones.tsx',
  'Detail Paper': 'src/app/medallions/[key].tsx',
  'Detail Bronze': 'src/app/medallions/[key].tsx',
  'Detail Silver': 'src/app/medallions/[key].tsx',
  'Detail Gold': 'src/app/medallions/[key].tsx',
  'Detail Platinum': 'src/app/medallions/[key].tsx',

  // --- Log + lapse (90–91H) -------------------------------------------------
  'Log Chooser': 'src/app/(app)/log.tsx',
  'Lapse When': 'src/app/lapse.tsx',
  'Lapse Trigger': 'src/app/lapse.tsx',
  'Lapse Done': 'src/app/lapse.tsx',
  'Log Urges': 'src/app/(app)/log.tsx',
  'Log Check-ins': 'src/app/(app)/log.tsx',
  'Log Reports': 'src/app/(app)/log.tsx',
  'Urge Overview Summary': 'src/app/urge-overview.tsx',
  'Urge Overview': 'src/app/urge-overview.tsx',
  'Urge Overview Mood': 'src/app/urge-overview.tsx',
  'Urge Overview When': 'src/app/urge-overview.tsx',
  'Report Ready': 'src/app/report-ready.tsx',
  'Weekly Report': 'src/app/weekly-report.tsx',
  'Weekly Report Days': 'src/app/weekly-report.tsx',
  'Weekly Report Urges': 'src/app/weekly-report.tsx',
  'Urge Log Intensity': 'src/app/urge-log.tsx',
  'Urge Log Trigger': 'src/app/urge-log.tsx',
  'Urge Log Outcome': 'src/app/urge-log.tsx',
  'Urge Log When': 'src/app/urge-log.tsx',
  'Urge Log Done': 'src/app/urge-log.tsx',

  // --- Settings (92–95) -----------------------------------------------------
  Settings: 'src/app/(app)/settings.tsx',
  'Edit Profile': 'src/app/profile.tsx',
  'Sheet Profile Photo': 'src/app/profile.tsx',
  'Sheet Edit Name': 'src/app/profile.tsx',
  'Settings Weekly Report': 'src/app/(app)/settings.tsx',
  'Settings Check-in Time': 'src/app/routines/night-time.tsx',
  'Your Vow Page': 'src/app/vow.tsx',
  'Sheet Sign Out': 'src/app/(app)/settings.tsx',
  'Data Privacy': 'src/app/privacy.tsx',
  'App Lock': 'src/app/applock.tsx',

  // --- Launch + auth (01–07) ------------------------------------------------
  Splash: 'src/app/index.tsx',
  'Standing Guard': 'src/app/index.tsx',
  'Login Empty': 'src/app/(auth)/sign-in.tsx',
  'Login Typing': 'src/app/(auth)/sign-in.tsx',
  'Create Account': 'src/app/(auth)/sign-up.tsx',

  // --- Onboarding v3 (60–86D) ----------------------------------------------
  'V3 Section 1 Intro': 'src/components/onboarding/v3.tsx',
  'V3 Section 2 Intro': 'src/components/onboarding/v3.tsx',
  'V3 Section 3 Intro': 'src/components/onboarding/v3.tsx',
  'V3 Section 4 Intro': 'src/components/onboarding/v3.tsx',
  'V3 Section 5 Intro': 'src/components/onboarding/v3.tsx',
  'V3 Section 6 Intro': 'src/components/onboarding/v3.tsx',
  'V3 Section 7 Intro': 'src/components/onboarding/v3.tsx',
  'Lesson Willpower': 'src/components/onboarding/v3.tsx',
  'Lesson Rewire': 'src/components/onboarding/v3.tsx',
  'Lesson Anchor': 'src/components/onboarding/v3.tsx',
  'Lesson Small Steps': 'src/components/onboarding/v3.tsx',

  // --- Onboarding results (87–90F) -----------------------------------------
  'Enlisting Aegis': 'src/components/onboarding/v3.tsx',
  'Plan Ready': 'src/components/onboarding/v3.tsx',
  'Root Loop': 'src/components/onboarding/v3.tsx',
  'Current Pattern': 'src/components/onboarding/v3.tsx',
  'Cost Next 30': 'src/components/onboarding/v3.tsx',
  'Cost Next 365': 'src/components/onboarding/v3.tsx',
  'Cost By Age 80': 'src/components/onboarding/v3.tsx',
  'Hopeful Reversal': 'src/components/onboarding/v3.tsx',
  'Streak Sawtooth': 'src/components/onboarding/v3.tsx',
  'Campaign Line': 'src/components/onboarding/v3.tsx',
  'Rewire Curve': 'src/components/onboarding/v3.tsx',
  'Results Pattern': 'src/components/onboarding/v3.tsx',
  'The Vow': 'src/components/onboarding/v3.tsx',
  'Campaign Map': 'src/components/onboarding/v3.tsx',
  'Campaign Map II': 'src/components/onboarding/v3.tsx',
  'Campaign Map III': 'src/components/onboarding/v3.tsx',
  'Letter Received': 'src/app/letter.tsx',
  'Letter Week XII': 'src/app/letter.tsx',
  'Medallion Received': 'src/app/medallion-post.tsx',
  'Reminders Setup': 'src/app/reminders.tsx',
  'Auth Save Progress': 'src/app/(auth)/sign-up.tsx',

  // --- Money (11–15) --------------------------------------------------------
  'Free Trial Paywall': 'src/components/paywall/PaywallFlow.tsx',
  'Paywall Rescue': 'src/components/paywall/PaywallFlow.tsx',
  'Paywall Confirmed': 'src/components/paywall/PaywallFlow.tsx',
  'Manage Subscription': 'src/app/subscription.tsx',

  // --- Routines (19B–19C) ---------------------------------------------------
  'Morning Check-in Time': 'src/app/routines/morning-time.tsx',
  'Nightly Check-in Time': 'src/app/routines/night-time.tsx',

  // --- Today + score (21–21C2) ---------------------------------------------
  'Today Home': 'src/app/(app)/today.tsx',
  'Today Home II': 'src/app/(app)/today.tsx',
  'Today Home Task': 'src/app/(app)/today.tsx',
  'Today Home III': 'src/app/(app)/today.tsx',
  'Score Detail': 'src/app/score.tsx',
  'Score Detail Moves': 'src/app/score.tsx',
  'Score Detail Ranks': 'src/app/score.tsx',
  'Sentence Journal': 'src/app/affirmation.tsx',
  'Sentence Journal Custom prompt': 'src/app/affirmation.tsx',

  // --- Daily check-ins (21D–21E6) ------------------------------------------
  'Morning 1 Yesterday': 'src/app/day/morning.tsx',
  'Morning Task Check': 'src/app/day/morning.tsx',
  'Morning 5 Done': 'src/app/day/morning.tsx',
  'Night 1 Mood': 'src/app/day/night.tsx',
  'Checkin Emotions': 'src/app/day/night.tsx',
  'Night 2 Record': 'src/app/day/night.tsx',
  'Checkin Reasons': 'src/app/day/night.tsx',
  'Night 3 Reflection': 'src/app/day/night.tsx',
  'Night Action Reminder': 'src/app/day/night.tsx',
  'Night 4 Closed': 'src/app/day/night.tsx',

  // --- SOS / urge (28–37) ---------------------------------------------------
  'Cue Intro Modal': 'src/app/urge.tsx',
  'SOS Strength': 'src/app/urge.tsx',
  'Cue Hue Picker': 'src/app/urge.tsx',
  'SOS Feeling Picker': 'src/app/urge.tsx',
  'SOS Reason Picker': 'src/app/urge.tsx',
  'Cue Set Confirmation': 'src/app/urge.tsx',
  'Surf Step 1': 'src/app/urge.tsx',
  'Surf Step 3': 'src/app/urge.tsx',
  'Surf Complete': 'src/app/urge.tsx',
  'Relapse Log': 'src/app/relapse.tsx',
  'Relapse Twice': 'src/app/relapse.tsx',
  'Relapse Begin': 'src/app/relapse.tsx',

  // --- Post (39–39D, 90B) ---------------------------------------------------
  'Letter Arrival': 'src/app/mail.tsx',
  'Letter Read': 'src/app/letter.tsx',
  'Medallion Letter': 'src/app/mail.tsx',
  'Yearly Drop': 'src/app/mail.tsx',
  'Drop Received': 'src/app/drop.tsx',

  // --- Journey (32–32C) -----------------------------------------------------
  'Journey Chapter I': 'src/app/journey/[chapter].tsx',
  'Journey Campaign': 'src/app/journey/[chapter].tsx',
  'Journey Chapter III': 'src/app/journey/[chapter].tsx',
  'Journey Chapter IV': 'src/app/journey/[chapter].tsx',
};

export function mapFor(bundle, label) {
  if (bundle === 'Email Login') {
    if (/^Lesson Scroll \d+$/.test(label)) {
      return { target: 'src/components/lesson/pages.tsx', note: 'lesson reader frame — 26-frame paged scroll' };
    }
    if (/^Week [IVX]+ /.test(label)) {
      return { target: 'src/app/week/[week].tsx', note: 'week overview, two pages per week' };
    }
    if (/^V3 Q\d+/.test(label)) {
      return { target: 'src/components/onboarding/v3.tsx', note: 'onboarding question board' };
    }
    const target = EMAIL_LOGIN[label];
    if (target) return { target, note: '—' };
    return { target: '—', note: 'UNMAPPED — resolve during spec extraction' };
  }

  if (bundle === 'Lessons and Tasks') {
    if (/^L01 Reader \d+$/.test(label)) {
      return {
        target: '—',
        note: 'SUPERSEDED draft — verified: 3 frames match Lesson Scroll at the same index, 2 at a one-frame shift, 20 rewritten',
      };
    }
    if (/^Lesson \d+$/.test(label)) {
      return { target: 'src/content/curriculum84.ts', note: 'lesson cover card — content row + shared card template' };
    }
    if (/^Task D\d+ Intro$/.test(label)) return { target: 'src/app/task/[day].tsx', note: 'daily task, page 1 of 3' };
    if (/^Task D\d+ Options$/.test(label)) return { target: 'src/app/task/[day].tsx', note: 'daily task, page 2 of 3' };
    if (/^Task D\d+ Card$/.test(label)) return { target: 'src/app/task/[day].tsx', note: 'daily task, page 3 of 3' };
    return { target: '—', note: 'UNMAPPED — resolve during spec extraction' };
  }

  if (bundle === 'Lesson 1 Surviving the Night') {
    return {
      target: 'src/components/lesson/pages.tsx',
      note: 'DUPLICATE — verified: all 26 hash-identical to Lesson Scroll N with the label normalised away',
    };
  }

  if (bundle === 'VICI (previous)' || bundle === 'vici-prev') {
    return {
      target: '—',
      note: 'SUPERSEDED — previous-generation canvas; the two copies verified byte-identical with cmp',
    };
  }

  if (bundle.startsWith('screenshots/')) {
    // Pass 2: the author's own check renders. Five `*-apply.js` scripts in the
    // same folder read and write `Lessons and Tasks.dc.html`, so the canvas is
    // the applied result and these are its input — 55 of the 97 are byte-copies
    // of a canonical frame, and the other 42 are the discarded variants.
    return {
      target: '—',
      note: 'HARNESS — the author\'s own check render; the main canvas is the applied result (DECISIONS D-061)',
    };
  }

  if (bundle === 'exports/Journey Campaign') return { target: 'src/components/journey/JourneyScreens.tsx', note: 'export of the campaign map' };
  if (bundle === 'exports/Lesson Detail') return { target: 'src/app/lesson-overview/[slug].tsx', note: 'export — lesson cover/detail' };
  if (bundle === 'exports/Lesson Parts') return { target: 'src/app/lesson-overview/[slug].tsx', note: 'export — lesson parts list' };

  return { target: '—', note: '—' };
}
