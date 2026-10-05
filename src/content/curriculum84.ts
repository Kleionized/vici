/**
 * GENERATED FILE — do not edit by hand.
 *
 * The twelve-week, eighty-four-lesson curriculum the `Vici Overhaul` bundle
 * draws: week names, blurbs and heroes from the twelve Email-Login week pages;
 * each lesson's title and hero from its reader's cover (`L<n> Frame 1`), and
 * its task — the practice and the "Done when" line — from the reader's two
 * task pages. The short task sentence (`cardSummary`) is the first sentence
 * of the lesson's own task (D339); day 1 keeps the one `Today Home Task` and
 * `Night Action Reminder` draw. No frame draws a one-line `summary`; it keeps
 * the previous build's.
 *
 * Rebuild: node scripts/overhaul/gen-curriculum.mjs
 */

/** A `data-hero` id of the `Lesson-Illustrations-v4` card the frame draws (`src/content/heroes.ts`). */
export type CurriculumHeroId =
  | "battery"
  | "bed"
  | "bench"
  | "books"
  | "brain"
  | "cake"
  | "calendar"
  | "chartUp"
  | "clock"
  | "compass"
  | "dominoes"
  | "door"
  | "envelope"
  | "envelopeOpen"
  | "feedOff"
  | "flag"
  | "halfMast"
  | "hourglass"
  | "idCard"
  | "kettle"
  | "lighthouse"
  | "mirror"
  | "mountain"
  | "nightPhone"
  | "notebook"
  | "phoneTable"
  | "plant"
  | "scale"
  | "shower"
  | "signpost"
  | "sneaker"
  | "stopwatch"
  | "sunrise"
  | "tab"
  | "thermometer"
  | "thunderCloud"
  | "twoCups"
  | "umbrella";

/**
 * The day's task. It lives inside the lesson: `Today’s task` + the lesson title
 * + `practice`, then a `Done when` card (`doneWhen`) and "Finish lesson".
 * `cardTitle`/`cardSummary` are how Today, the night reminder and the morning
 * check name it. (The previous drop's two-board `/task/[day]` layout is gone:
 * that route and `/lesson-card/[day]` redirect into the reader, D324.)
 */
export interface DailyTask {
  day: number;
  /** How the task is named on the Today home and in the night reminder — the lesson's title. */
  cardTitle: string;
  /**
   * The one-line task sentence Today, the night reminder and the morning check draw:
   * the first sentence of `practice[0]` (D339; L64 skips its opening "This exercise
   * is optional."). Day 1 keeps the sentence `Today Home Task` and `Night Action
   * Reminder` draw; its task sets the same step ("put the phone out of reach from bed").
   * 17–196 characters; the longest is L58's.
   */
  cardSummary: string;
  /** The task's paragraphs, in reading order, across the reader's two task pages. */
  practice: string[];
  /** The sentence on the reader's `Done when` card. */
  doneWhen: string;
}

export interface Curriculum84Lesson {
  day: number;
  week: number;
  /** The cover's title — sentence case, the same string the week page lists. */
  title: string;
  /** The cover's hero. */
  hero: CurriculumHeroId;
  /**
   * The previous build's one-line summary, kept as it was: no frame in this drop draws
   * one, and it was written for the previous lesson under this day, so it may not
   * describe the new title (D396). Read by search, first-steps and `lib/curriculum`.
   */
  summary: string;
  task: DailyTask;
}

export interface Curriculum84Week {
  n: number;
  roman: string;
  name: string;
  blurb: string;
  /** The week page's hero — not its first lesson's cover. */
  hero: CurriculumHeroId;
  lessons: Curriculum84Lesson[];
}

export const CURRICULUM_84: Curriculum84Week[] = [
  {
    n: 1,
    roman: "I",
    name: "Reset",
    blurb: "Survive the nights and steady the basics.",
    hero: "nightPhone",
    lessons: [
      {
        day: 1,
        week: 1,
        title: "Prepare for tonight",
        hero: "nightPhone",
        summary: "The first nights are the steepest. Get through tonight, nothing else.",
        task: {
          day: 1,
          cardTitle: "Prepare for tonight",
          cardSummary: "Put the device you use for porn out of reach before you sleep.",
          practice: [
            "Start one private note called My recovery plan.",
            "Write your porn boundary and what you know about your starting point: when you usually watch, roughly how often or for how long, what it interrupts, and what you do after an urge or slip. Write “unknown” where needed.",
            "Prepare tonight: set the alarm, put the phone out of reach from bed, and put other devices away.",
            "Keep needed calls and accessibility available. If the device must stay close, close the content and choose a practical limit on browsing.",
          ],
          doneWhen: "Your starting notes are saved and tonight’s device setup is ready.",
        },
      },
      {
        day: 2,
        week: 1,
        title: "Remove easy access to porn",
        hero: "sunrise",
        summary: "Day zero isn’t a loss. It’s the start of the count that matters.",
        task: {
          day: 2,
          cardTitle: "Remove easy access to porn",
          cardSummary: "Spend up to twenty minutes making one change where you usually watch.",
          practice: [
            "Spend up to twenty minutes making one change where you usually watch. Clear your own space, remove saved porn or bookmarks without reopening the content, or leave an account used to find it.",
            "If there’s nothing relevant to remove, check yesterday’s device setup and fix any inconvenience. Write the useful change under Access in your plan.",
          ],
          doneWhen: "You’ve made one useful change, or confirmed that the existing setup works. Stop there rather than browse for more things to delete.",
        },
      },
      {
        day: 3,
        week: 1,
        title: "Choose where to go instead",
        hero: "bench",
        summary: "Daylight, air, one walk. The room you’re in is half the battle.",
        task: {
          day: 3,
          cardTitle: "Choose where to go instead",
          cardSummary: "Name an exact place you can go when browsing starts: the kitchen table, a shared room, or a safe walk around the block.",
          practice: [
            "Name an exact place you can go when browsing starts: the kitchen table, a shared room, or a safe walk around the block. Try it for ten to twenty minutes today, after closing any triggering content.",
            "If movement is limited, change your seat or put the device away and bring another activity within reach. Keep a phone when needed for safety or access. Save the place and first step under First response.",
          ],
          doneWhen: "You’ve tried the change and saved the steps. If you can’t try it today, prepare an accessible option and choose when to try it.",
        },
      },
      {
        day: 4,
        week: 1,
        title: "Prepare for sleep",
        hero: "bed",
        summary: "Tired brains lose to urges. Protect the hours that rebuild you.",
        task: {
          day: 4,
          cardTitle: "Prepare for sleep",
          cardSummary: "Plan the next sleep period.",
          practice: [
            "Plan the next sleep period. Choose a realistic wake time, when browsing ends, where the device goes, and a quiet activity before bed. Allow enough sleep for your circumstances.",
            "If you can’t sleep, avoid restarting the feed in bed. Save the steps under Night routine and set a Day 7 reminder to check what happened.",
          ],
          doneWhen: "The sleep plan and device setup are ready. Falling asleep on command isn’t part of the task.",
        },
      },
      {
        day: 5,
        week: 1,
        title: "Have another activity ready",
        hero: "books",
        summary: "The habit filled a slot. Decide what takes the space.",
        task: {
          day: 5,
          cardTitle: "Have another activity ready",
          cardSummary: "Choose an activity for the hour when you usually want porn.",
          practice: [
            "Choose an activity for the hour when you usually want porn. Match it to what you need: rest, interest, company, movement, or a break.",
            "Prepare the materials and try it for fifteen to twenty minutes. Write whether it was easy to start and whether it helped you stop the usual browsing. Save it under Alternatives, with one adjustment if needed.",
          ],
          doneWhen: "You’ve tried the activity and recorded what happened. An unhelpful result is worth recording too.",
        },
      },
      {
        day: 6,
        week: 1,
        title: "Make time for contact",
        hero: "twoCups",
        summary: "Urges grow in closed rooms. Open one door today.",
        task: {
          day: 6,
          cardTitle: "Make time for contact",
          cardSummary: "Call someone, send a specific invitation, or spend time in a conversation or shared activity.",
          practice: [
            "Call someone, send a specific invitation, or spend time in a conversation or shared activity. Choose contact that’s safe and appropriate.",
            "If no personal contact is available, check how to join a regular group or access a suitable service.",
            "Save one option under Support. After an unanswered invitation, leave room for a reply and continue another activity.",
          ],
          doneWhen: "You’ve taken a contact step or checked a group or service you can access. You don’t need a reply to finish.",
        },
      },
      {
        day: 7,
        week: 1,
        title: "Review the first week",
        hero: "cake",
        summary: "Seven days held. Look at what a week actually bought you.",
        task: {
          day: 7,
          cardTitle: "Review the first week",
          cardSummary: "Read your plan for five minutes.",
          practice: [
            "Read your plan for five minutes. Name one change you used and what happened. Check the sleep plan from Day 4 and the activity from Day 5. Keep what helped or change one awkward detail.",
            "If nothing helped clearly, record the obstacle and choose one change for next week. Then do something you enjoy within your means.",
          ],
          doneWhen: "You’ve recorded the review and taken time for enjoyment. A slip during the week doesn’t cancel that time.",
        },
      },
    ],
  },
  {
    n: 2,
    roman: "II",
    name: "Changing Your Mindset",
    blurb: "Streaks, relapses, and how you talk to yourself.",
    hero: "signpost",
    lessons: [
      {
        day: 8,
        week: 2,
        title: "Measure more than a streak",
        hero: "calendar",
        summary: "The count is a tool, not the point. You’re building a person.",
        task: {
          day: 8,
          cardTitle: "Measure more than a streak",
          cardSummary: "Choose one measure besides a streak: time spent watching, nights with the phone out of bed, or whether you used your response to an urge.",
          practice: [
            "Choose one measure besides a streak: time spent watching, nights with the phone out of bed, or whether you used your response to an urge.",
            "Record what you know about the last seven days, with unknown for gaps. Then repeat one useful action today, or try a small version if you’re still finding what helps.",
          ],
          doneWhen: "The measure and starting information are saved, and you’ve tried one action.",
        },
      },
      {
        day: 9,
        week: 2,
        title: "Stop sooner after a slip",
        hero: "sunrise",
        summary: "A relapse is data. Read it, log it, move.",
        task: {
          day: 9,
          cardTitle: "Stop sooner after a slip",
          cardSummary: "Add After a slip to your plan.",
          practice: [
            "Add After a slip to your plan. Using a recent example if available, note what you did in the first thirty minutes.",
            "Then write the steps you want to use: close the content, put the device in a named place, and begin the next necessary activity.",
            "Choose the activity for the likely hour, such as food, work, or bed. If you haven’t slipped, prepare the steps for a possible episode without creating one.",
          ],
          doneWhen: "The plan names the first action, device location, and what you’ll do next.",
        },
      },
      {
        day: 10,
        week: 2,
        title: "Use the hours that remain",
        hero: "scale",
        summary: "One slip doesn’t erase thirty days. Refuse the reset story.",
        task: {
          day: 10,
          cardTitle: "Use the hours that remain",
          cardSummary: "Try the after-slip steps once without an urge.",
          practice: [
            "Try the after-slip steps once without an urge. Close a harmless tab, put the device where you planned, and move to the named room or activity.",
            "Check whether it fits the hour when you usually watch. Fix one obstacle, such as an unavailable room or an unsafe late-night walk. Use an accessible option if moving isn’t possible.",
          ],
          doneWhen: "You’ve tried the steps and corrected an obstacle if needed. No sexual content or induced urge is needed.",
        },
      },
      {
        day: 11,
        week: 2,
        title: "Try one change for a week",
        hero: "chartUp",
        summary: "The curve wobbles on its way up. Zoom out.",
        task: {
          day: 11,
          cardTitle: "Try one change for a week",
          cardSummary: "Compare the past seven days with Day 1: time or disruption from porn, responses to urges or slips, and one daily routine.",
          practice: [
            "Compare the past seven days with Day 1: time or disruption from porn, responses to urges or slips, and one daily routine. Include unchanged or unknown where accurate.",
            "Choose one change for the next seven days. Prepare it today and save a Day 18 review reminder. Write what you want to learn from trying it.",
          ],
          doneWhen: "The comparison is written, the change is ready, and the review reminder is saved.",
        },
      },
      {
        day: 12,
        week: 2,
        title: "Repeat one useful action",
        hero: "idCard",
        summary: "Stop fighting as a user who quits. Act as someone who doesn’t need it.",
        task: {
          day: 12,
          cardTitle: "Repeat one useful action",
          cardSummary: "Choose one behaviour to repeat for a week.",
          practice: [
            "Choose one behaviour to repeat for a week. You can keep the Day 11 change. Write the cue and action, such as putting the phone away after brushing your teeth.",
            "Prepare what it needs and try it when the cue occurs. If it hasn’t occurred, name the first expected chance. Record missed attempts honestly and set a Day 19 review.",
          ],
          doneWhen: "The behaviour, first chance, setup, and review are clear.",
        },
      },
      {
        day: 13,
        week: 2,
        title: "Choose your own reason",
        hero: "compass",
        summary: "Shame burns fuel. Values steer. Swap the engine.",
        task: {
          day: 13,
          cardTitle: "Choose your own reason",
          cardSummary: "Write one sentence under Goal explaining why you want to change porn use.",
          practice: [
            "Write one sentence under Goal explaining why you want to change porn use. Name a real effect or a value you choose to follow, without an insult about yourself.",
            "Take one related action today: protect sleep, keep an agreement, give someone attention, or make time for a chosen faith or community activity. Make an arrangement if the action needs one.",
          ],
          doneWhen: "Your reason is clear and you’ve taken a step that follows it.",
        },
      },
      {
        day: 14,
        week: 2,
        title: "Return after a missed day",
        hero: "signpost",
        summary: "Two weeks of momentum. Don’t trade it for a quiet Tuesday.",
        task: {
          day: 14,
          cardTitle: "Return after a missed day",
          cardSummary: "Add three short answers under Continuing: when you’ll resume after a missed day, how you’ll use the after-slip steps, and which helpful behaviour you’ll keep when motivation is low.",
          practice: [
            "Add three short answers under Continuing: when you’ll resume after a missed day, how you’ll use the after-slip steps, and which helpful behaviour you’ll keep when motivation is low.",
            "Include who or which service you’ll contact if the course isn’t helping or daily life is getting worse. Adjust the pace when needed rather than make missed lessons a debt.",
          ],
          doneWhen: "Each situation has a specific next action in the plan.",
        },
      },
    ],
  },
  {
    n: 3,
    roman: "III",
    name: "In the Moment",
    blurb: "What to do in the sixty seconds that matter.",
    hero: "lighthouse",
    lessons: [
      {
        day: 15,
        week: 3,
        title: "What to do when an urge starts",
        hero: "stopwatch",
        summary: "Every urge has a birth, a peak, and a death. Learn its shape.",
        task: {
          day: 15,
          cardTitle: "What to do when an urge starts",
          cardSummary: "Write your earliest recognisable sign of an urge and a first action under Early signs and First response.",
          practice: [
            "Write your earliest recognisable sign of an urge and a first action under Early signs and First response. Then put the phone out of reach for five minutes without seeking a trigger.",
            "At the start and end, notice the wish to check it. You can rate it from zero to ten. Record whether it changed, stayed the same, or wasn’t there. No thought or sensation has to appear.",
          ],
          doneWhen: "The cue and response are saved, and the short observation is recorded. Zero throughout is a valid result.",
        },
      },
      {
        day: 16,
        week: 3,
        title: "Check what you need",
        hero: "thermometer",
        summary: "The urge points at a need. Find what it’s actually asking for.",
        task: {
          day: 16,
          cardTitle: "Check what you need",
          cardSummary: "For a recent urge, note the time and place, what you were doing beforehand, how you felt physically, and your mood or any task you were avoiding.",
          practice: [
            "For a recent urge, note the time and place, what you were doing beforehand, how you felt physically, and your mood or any task you were avoiding. Unknown or nothing obvious is fine.",
            "Choose one action for a need you can identify and try it if that need is present. If no example comes to mind, save the questions for the next urge that happens naturally.",
          ],
          doneWhen: "The facts and next action are saved, or the questions are ready for later.",
        },
      },
      {
        day: 17,
        week: 3,
        title: "Close the screen and move",
        hero: "sneaker",
        summary: "Don’t negotiate standing still. Move your body first.",
        task: {
          day: 17,
          cardTitle: "Close the screen and move",
          cardSummary: "Start where you usually browse.",
          practice: [
            "Start where you usually browse. Close a harmless tab, put the device away, and move to the place or activity in your First response. Fix anything that makes beginning awkward.",
            "At the next naturally occurring urge, try the steps and record what happened. If none occurs today, leave them ready.",
          ],
          doneWhen: "You’ve practised the movement and saved any adjustment. The result during an urge can be recorded later.",
        },
      },
      {
        day: 18,
        week: 3,
        title: "Prepare another activity",
        hero: "signpost",
        summary: "Attention is a channel. You hold the remote.",
        task: {
          day: 18,
          cardTitle: "Prepare another activity",
          cardSummary: "Review the Day 11 change: did you try it, what happened, and will you keep or change it?",
          practice: [
            "Review the Day 11 change: did you try it, what happened, and will you keep or change it? If the situation didn’t happen, move the check to after it does.",
            "Prepare an activity you can begin quickly, one that can hold your attention longer, and a contact or shared-place option.",
            "Use things you like or need. Get the materials or details ready and try the quickest option once.",
          ],
          doneWhen: "The review is recorded or rescheduled, the options are ready, and you’ve tried the quick one.",
        },
      },
      {
        day: 19,
        week: 3,
        title: "Check hunger, anger, loneliness, and tiredness",
        hero: "kettle",
        summary: "Hungry, angry, lonely, tired — check the gauges before you judge the pull.",
        task: {
          day: 19,
          cardTitle: "Check hunger, anger, loneliness, and tiredness",
          cardSummary: "Review the Day 12 behaviour: attempts, obstacles, and what to keep or change.",
          practice: [
            "Review the Day 12 behaviour: attempts, obstacles, and what to keep or change. If you haven’t had a chance to try it, keep the review for afterwards.",
            "Check hunger, anger, loneliness, and tiredness now. Mark present, absent, or unsure. Take a fitting action if one needs attention. If none fits, record that instead of forcing an explanation.",
          ],
          doneWhen: "The review and check are recorded, with an action taken where needed.",
        },
      },
      {
        day: 20,
        week: 3,
        title: "Notice an urge without acting on it",
        hero: "lighthouse",
        summary: "Don’t fight the wave. Ride it until it breaks.",
        task: {
          day: 20,
          cardTitle: "Notice an urge without acting on it",
          cardSummary: "Close triggering content.",
          practice: [
            "Close triggering content. For two to five minutes, notice a mild urge that has appeared naturally, or practise without one.",
            "Notice thoughts or sensations if present, breathe normally, and return attention when it wanders.",
            "Finish by beginning the next action you chose. Record the feeling and what you did separately.",
            "Use paper or memory if the phone is away. Stop and choose another response if the exercise is uncomfortable or unhelpful.",
          ],
          doneWhen: "You’ve tried the steps and recorded the result, or stopped and chosen another response. An urge isn’t required.",
        },
      },
      {
        day: 21,
        week: 3,
        title: "Make a separate choice about masturbation",
        hero: "shower",
        summary: "Decide the rule on purpose, not in the moment.",
        task: {
          day: 21,
          cardTitle: "Make a separate choice about masturbation",
          cardSummary: "Write your choice about masturbation separately from the porn boundary.",
          practice: [
            "Write your choice about masturbation separately from the porn boundary. Keep a choice that fits your values and experience.",
            "If masturbation repeatedly leads to searching, consider keeping devices away or a temporary pause.",
            "If unsure, keep porn out of it and observe only if masturbation happens. Prepare any device change and set a Day 35 review. Add qualified support if sexual behaviour remains difficult to control.",
          ],
          doneWhen: "The choice, setup, and review date are saved. No sexual activity is required.",
        },
      },
    ],
  },
  {
    n: 4,
    roman: "IV",
    name: "Know Your Brain",
    blurb: "The machinery behind the pull.",
    hero: "brain",
    lessons: [
      {
        day: 22,
        week: 4,
        title: "Understand what starts the habit",
        hero: "brain",
        summary: "Dopamine isn’t pleasure. It’s the promise of it.",
        task: {
          day: 22,
          cardTitle: "Understand what starts the habit",
          cardSummary: "Choose one account, feed, time, or device location that starts the habit.",
          practice: [
            "Choose one account, feed, time, or device location that starts the habit. Change what you can without reopening porn. If access is already reduced, check whether the setup held and fix one inconvenience.",
            "Save the cue and first action under Early signs. Set a Day 28 check.",
          ],
          doneWhen: "You’ve addressed a remaining cue or confirmed what works, and saved the review.",
        },
      },
      {
        day: 23,
        week: 4,
        title: "Decide before the difficult hour",
        hero: "brain",
        summary: "The prefrontal cortex tires like a muscle. Guard its hours.",
        task: {
          day: 23,
          cardTitle: "Decide before the difficult hour",
          cardSummary: "Make one decision ahead of the difficult hour.",
          practice: [
            "Make one decision ahead of the difficult hour. Write the cue and first action: where the phone goes or what you’ll begin after a named event.",
            "Prepare the charger, materials, or short instructions. Try the beginning with harmless content. If an app or device is unavailable, prepare a paper or accessible alternative.",
          ],
          doneWhen: "The cue is clear, the materials are ready, and you’ve tried the beginning or prepared the needed alternative.",
        },
      },
      {
        day: 24,
        week: 4,
        title: "Make room for food and sleep",
        hero: "kettle",
        summary: "Low fuel and low sleep read as craving. Feed the real need.",
        task: {
          day: 24,
          cardTitle: "Make room for food and sleep",
          cardSummary: "Look at two or three difficult moments if you have examples.",
          practice: [
            "Look at two or three difficult moments if you have examples. Was hunger or tiredness present? If so, try one practical change: an easy meal, eating earlier, or ending browsing in time for rest.",
            "If neither fits or you don’t know, keep normal care and note what to check next time. Save a Day 28 reminder.",
          ],
          doneWhen: "You’ve tried a fitting change or saved an observation for later, with a review date.",
        },
      },
      {
        day: 25,
        week: 4,
        title: "Respond to anger and loneliness",
        hero: "thunderCloud",
        summary: "Anger and loneliness borrow the same circuits. Name them early.",
        task: {
          day: 25,
          cardTitle: "Respond to anger and loneliness",
          cardSummary: "For a known example of anger or loneliness, write what happened and one immediate response.",
          practice: [
            "For a known example of anger or loneliness, write what happened and one immediate response.",
            "For anger, that might be stepping away safely or delaying a message. For loneliness, try appropriate contact or check a regular shared activity.",
            "Add a later step on the actual problem if needed. If neither feeling fits, leave the exercise aside or work with another feeling you’ve noticed.",
          ],
          doneWhen: "One fitting response is prepared or tried, or you’ve recorded that the topic doesn’t apply.",
        },
      },
      {
        day: 26,
        week: 4,
        title: "Notice when searching keeps going",
        hero: "tab",
        summary: "Novelty is the hook. Infinite variety is the trap.",
        task: {
          day: 26,
          cardTitle: "Notice when searching keeps going",
          cardSummary: "Give one harmless chapter, task, piece of music, or hobby ten minutes without unrelated feeds.",
          practice: [
            "Give one harmless chapter, task, piece of music, or hobby ten minutes without unrelated feeds. Make a tally when you want to switch, then return if continuing still makes sense.",
            "Record the tally and one observation. Add a short reminder for the next browsing urge: notice the wish for another option, close the content, and begin your first response.",
          ],
          doneWhen: "The short practice and reminder are recorded. A tally of zero is fine.",
        },
      },
      {
        day: 27,
        week: 4,
        title: "Try movement, breathing, or another room",
        hero: "shower",
        summary: "State beats willpower. Change temperature, posture, place.",
        task: {
          day: 27,
          cardTitle: "Try movement, breathing, or another room",
          cardSummary: "Try three minutes of gentle movement, comfortable breathing, or a change of room.",
          practice: [
            "Try three minutes of gentle movement, comfortable breathing, or a change of room. Stay within your physical limits and breathe normally if a set rhythm feels uncomfortable.",
            "Describe tension or restlessness before and after, in words or from zero to ten. Record whether you’d use the option again. Stop if it’s uncomfortable.",
          ],
          doneWhen: "You’ve tried one option and recorded what happened. The feeling doesn’t have to decrease.",
        },
      },
      {
        day: 28,
        week: 4,
        title: "Act earlier in the habit",
        hero: "dominoes",
        summary: "Half your day runs on scripts. Rewrite the opening scene.",
        task: {
          day: 28,
          cardTitle: "Act earlier in the habit",
          cardSummary: "Review the cue change from Day 22 and care adjustment from Day 24.",
          practice: [
            "Review the cue change from Day 22 and care adjustment from Day 24. What did you try, and what happened? If you haven’t used either, check the setup and keep the review for after use.",
            "Name the earliest step you can recognise in the browsing habit. Keep a response that helped, or change one step if it didn’t. Practise the beginning without seeking a trigger.",
          ],
          doneWhen: "The two reviews are recorded or kept for later, and the early response is confirmed or changed.",
        },
      },
    ],
  },
  {
    n: 5,
    roman: "V",
    name: "Why It Feels Worth It",
    blurb: "The honest math of what it gives and takes.",
    hero: "scale",
    lessons: [
      {
        day: 29,
        week: 5,
        title: "Look at the benefit and cost",
        hero: "scale",
        summary: "Every choice sits on a scale. See both pans clearly.",
        task: {
          day: 29,
          cardTitle: "Look at the benefit and cost",
          cardSummary: "Write an immediate benefit and a real cost of one recent or typical episode.",
          practice: [
            "Write an immediate benefit and a real cost of one recent or typical episode. Unknown is acceptable. Save them for Day 32.",
            "Choose one likely difficult period in the next three days. Plan the place, activity, and device rule, with an accessible backup if plans change. Set a check after the period, by Day 32 where possible.",
          ],
          doneWhen: "The notes, planned period, and review are saved. You’ll judge what helped after trying it.",
        },
      },
      {
        day: 30,
        week: 5,
        title: "Meet the need you can identify",
        hero: "tab",
        summary: "It gives something real. Name it honestly or it keeps the leverage.",
        task: {
          day: 30,
          cardTitle: "Meet the need you can identify",
          cardSummary: "Name what you wanted from a recent urge and try a fitting response: rest, an interesting activity, appropriate contact, or a first step on a task.",
          practice: [
            "Name what you wanted from a recent urge and try a fitting response: rest, an interesting activity, appropriate contact, or a first step on a task.",
            "For sexual desire, check or prepare the Day 21 boundary instead; sex or masturbation isn’t required. Record whether the response fit. If you don’t know the need, save a question for the next urge.",
          ],
          doneWhen: "You’ve tried a response, prepared the sexual boundary, or saved an observation for later.",
        },
      },
      {
        day: 31,
        week: 5,
        title: "Begin a task you are avoiding",
        hero: "envelopeOpen",
        summary: "Relief now is the hidden payment. Check the receipt.",
        task: {
          day: 31,
          cardTitle: "Begin a task you are avoiding",
          cardSummary: "Ask whether an urge happened while you were avoiding something specific.",
          practice: [
            "Ask whether an urge happened while you were avoiding something specific. If so, spend up to fifteen minutes on the smallest safe step, or request support if that needs to come first. Save a Day 47 follow-up.",
            "If no avoided problem fits, use the Day 30 response or save a question for a future urge. Don’t search for a hidden issue to satisfy the exercise.",
          ],
          doneWhen: "You’ve taken a first step or requested help, or prepared an alternative that fits.",
        },
      },
      {
        day: 32,
        week: 5,
        title: "Address one immediate cost",
        hero: "clock",
        summary: "Write down what a late relapse costs tomorrow morning and prepare that morning now.",
        task: {
          day: 32,
          cardTitle: "Address one immediate cost",
          cardSummary: "Review the period planned on Day 29: did it happen, did you follow the plan, and what needs changing?",
          practice: [
            "Review the period planned on Day 29: did it happen, did you follow the plan, and what needs changing? Keep the check for afterwards if the period is still ahead.",
            "Read the benefit and cost you recorded. Choose one practical cost to address or prevent today. If the concern is mainly a values conflict, name it honestly and take a related action instead.",
          ],
          doneWhen: "The review is recorded or rescheduled, and one fitting repair or preparation is made.",
        },
      },
      {
        day: 33,
        week: 5,
        title: "Make time for what viewing displaced",
        hero: "calendar",
        summary: "Years of nights compound. Price the decade, not the evening.",
        task: {
          day: 33,
          cardTitle: "Make time for what viewing displaced",
          cardSummary: "Choose an activity or commitment that viewing has displaced, if any.",
          practice: [
            "Choose an activity or commitment that viewing has displaced, if any. Give it a realistic block this week and begin a small part today, or make the needed invitation or booking.",
            "If your main reason is a personal value rather than lost time, choose an action that follows it. Save what you chose and why. You don’t need a new improvement project.",
          ],
          doneWhen: "You’ve begun a related action or made the arrangement and prepared what you can.",
        },
      },
      {
        day: 34,
        week: 5,
        title: "Make one change for tonight",
        hero: "scale",
        summary: "Stack today’s pan: one call, one walk, one early night.",
        task: {
          day: 34,
          cardTitle: "Make one change for tonight",
          cardSummary: "Choose the actual beginning of a recent difficult evening.",
          practice: [
            "Choose the actual beginning of a recent difficult evening. Change one part you control and try the steps without opening porn.",
            "If the setup already helped, keep it and name what made it practical. If no example is clear, prepare one observation for the next urge. Use the saved response when the situation occurs.",
          ],
          doneWhen: "You’ve tried a change, confirmed a helpful setup, or prepared an observation. You don’t need another deletion when nothing remains.",
        },
      },
      {
        day: 35,
        week: 5,
        title: "Give an activity a place in the week",
        hero: "scale",
        summary: "Rig the scale so staying clean is the easy read.",
        task: {
          day: 35,
          cardTitle: "Give an activity a place in the week",
          cardSummary: "Review the choice from Day 21.",
          practice: [
            "Review the choice from Day 21. Keep or adjust it from your experience; record unknown if you haven’t had a chance to assess it. Get help if ongoing control problems need it.",
            "Choose one weekly activity and schedule four chances to do it. Prepare materials or make the first invitation or booking.",
            "Set checks after the sessions. We’ll return on Days 42, 49, 56, and 63; keep later sessions’ checks for after they happen.",
          ],
          doneWhen: "The boundary is reviewed, and the activity has dates, a first step, and review reminders.",
        },
      },
    ],
  },
  {
    n: 6,
    roman: "VI",
    name: "Discipline",
    blurb: "Training the response you want on hard nights.",
    hero: "flag",
    lessons: [
      {
        day: 36,
        week: 6,
        title: "Prepare a simpler response when tired",
        hero: "battery",
        summary: "Willpower drains. Systems don’t. Build for the tired version of you.",
        task: {
          day: 36,
          cardTitle: "Prepare a simpler response when tired",
          cardSummary: "Read your plan for a tired evening.",
          practice: [
            "Read your plan for a tired evening. Make one action simpler: an easy meal, a shorter activity, or a response you can begin indoors.",
            "Prepare what it needs and try its first step without an urge. Save the smaller version under Bad day minimum. It should protect necessary care and fit the hour when you’ll use it.",
          ],
          doneWhen: "The smaller response is ready and you’ve tried its beginning.",
        },
      },
      {
        day: 37,
        week: 6,
        title: "Practise the response",
        hero: "sneaker",
        summary: "Reps, not speeches. Each refusal makes the next one cheaper.",
        task: {
          day: 37,
          cardTitle: "Practise the response",
          cardSummary: "Practise one response from the place where you usually begin browsing.",
          practice: [
            "Practise one response from the place where you usually begin browsing. Close a harmless tab, put the device away, and begin the next action. If you choose an urge exercise, practise its steps and ending too.",
            "Fix one awkward detail. Leave the steps ready for the next naturally occurring urge, and record that result later.",
          ],
          doneWhen: "You’ve practised the response and saved an adjustment if needed. No urge or triggering material is required.",
        },
      },
      {
        day: 38,
        week: 6,
        title: "Keep rules that serve a purpose",
        hero: "halfMast",
        summary: "Discipline isn’t punishment or gritted teeth.",
        task: {
          day: 38,
          cardTitle: "Keep rules that serve a purpose",
          cardSummary: "Choose one rule you follow and write what it protects.",
          practice: [
            "Choose one rule you follow and write what it protects. If it’s useful, keep it and use or practise it once today.",
            "If an optional rule mainly punishes you or has no clear purpose, change or remove that demand. Keep needed care. Discuss professional treatment changes with the relevant clinician.",
          ],
          doneWhen: "You’ve kept or changed the rule for a clear reason and taken the fitting action.",
        },
      },
      {
        day: 39,
        week: 6,
        title: "Practise the part that gets in the way",
        hero: "compass",
        summary: "It’s choosing once, early, and letting the choice stand.",
        task: {
          day: 39,
          cardTitle: "Practise the part that gets in the way",
          cardSummary: "Choose the part that gets in the way: noticing, remembering, beginning, stopping, continuing while tempted, or returning after interruption.",
          practice: [
            "Choose the part that gets in the way: noticing, remembering, beginning, stopping, continuing while tempted, or returning after interruption.",
            "Try one small change for that part. Add a visible cue, shorten the beginning, prepare the next activity, or practise returning to it. Use harmless content and record what made the step easier or harder.",
          ],
          doneWhen: "You’ve practised the useful part and recorded one result. If nothing needs changing, confirm what works.",
        },
      },
      {
        day: 40,
        week: 6,
        title: "Let a thought remain while you act",
        hero: "thunderCloud",
        summary: "Thoughts and feelings are weather. You’re the ground.",
        task: {
          day: 40,
          cardTitle: "Let a thought remain while you act",
          cardSummary: "When an ordinary distracting thought appears, name it briefly and return to the task.",
          practice: [
            "When an ordinary distracting thought appears, name it briefly and return to the task. You can use “There’s that thought again,” or your own words.",
            "For a naturally occurring porn urge, close the content and begin the saved response without waiting for the thought to disappear. If no thought appears, read the steps once and leave them ready.",
          ],
          doneWhen: "You’ve tried the response or prepared it for later. Don’t summon sexual thoughts for practice.",
        },
      },
      {
        day: 41,
        week: 6,
        title: "Give the action a time and place",
        hero: "signpost",
        summary: "You can’t pick the impulse. You pick the action.",
        task: {
          day: 41,
          cardTitle: "Give the action a time and place",
          cardSummary: "Write one cue and action for a decision you keep postponing.",
          practice: [
            "Write one cue and action for a decision you keep postponing. Reuse an existing commitment if it fits. Name when it begins and prepare the materials.",
            "Try the first step today. If the cue hasn’t happened, practise with harmless content and name the next expected chance. Note one obstacle and adjust it if needed.",
          ],
          doneWhen: "The plan has a clear cue, ready materials, and a tried beginning.",
        },
      },
      {
        day: 42,
        week: 6,
        title: "Plan for a difficult day",
        hero: "umbrella",
        summary: "Bad night? Contain it. One fire, not a season.",
        task: {
          day: 42,
          cardTitle: "Plan for a difficult day",
          cardSummary: "Review the latest Day 35 session if it has happened.",
          practice: [
            "Review the latest Day 35 session if it has happened. Record attendance, how it fit, and any change. If still ahead, keep its check for afterwards.",
            "Under Bad day minimum, keep two or three necessary actions for a difficult day. Include the simplest response to porn and care you need.",
            "Try one part or check it’s ready. Shorten optional tasks rather than make them a debt.",
          ],
          doneWhen: "The activity review is recorded or rescheduled, and the smaller day is ready.",
        },
      },
    ],
  },
  {
    n: 7,
    roman: "VII",
    name: "Relapse and Adversity",
    blurb: "Falling without unraveling.",
    hero: "sunrise",
    lessons: [
      {
        day: 43,
        week: 7,
        title: "Learn from a slip",
        hero: "halfMast",
        summary: "A relapse ends a streak. It doesn’t end the campaign.",
        task: {
          day: 43,
          cardTitle: "Learn from a slip",
          cardSummary: "Review a recent slip or close call, if available.",
          practice: [
            "Review a recent slip or close call, if available. Close the content first. Later, write what happened before it, the first sign you noticed, and the obstacle to using your response.",
            "Make one practical change or take a support step. If no example exists, check that your current after-slip steps still fit. Don’t create a mistake for the review.",
          ],
          doneWhen: "The review leads to a change, a confirmed plan, or a request for help.",
        },
      },
      {
        day: 44,
        week: 7,
        title: "Take care and make a repair",
        hero: "notebook",
        summary: "Autopsy, not funeral. What time, what door, what state?",
        task: {
          day: 44,
          cardTitle: "Take care and make a repair",
          cardSummary: "Describe a recent mistake factually, without an insult.",
          practice: [
            "Describe a recent mistake factually, without an insult. Take one normal act of care and a proportionate repair if needed. That might be food and an appropriate apology, or sleep and a rescheduled task.",
            "If there hasn’t been a mistake, keep ordinary care and prepare the steps for later. You don’t need to invent guilt or a confession.",
          ],
          doneWhen: "You’ve taken care of a need and addressed a real consequence where there is one.",
        },
      },
      {
        day: 45,
        week: 7,
        title: "Adjust the plan for today",
        hero: "mirror",
        summary: "Punishment teaches hiding. Debrief teaches prevention.",
        task: {
          day: 45,
          cardTitle: "Adjust the plan for today",
          cardSummary: "Adapt one commitment to today’s circumstances.",
          practice: [
            "Adapt one commitment to today’s circumstances. Shorten an activity, use the easier meal, or postpone an optional lesson while keeping necessary care and the porn response.",
            "Use the Bad day minimum if it fits. If the day is going well, confirm the version you’d use when needed and keep today’s helpful routine.",
          ],
          doneWhen: "You’ve followed a fitting version of the day or prepared it for a future difficulty.",
        },
      },
      {
        day: 46,
        week: 7,
        title: "Get support during a difficult period",
        hero: "thunderCloud",
        summary: "Some days the plan is smaller: eat, walk, sleep clean.",
        task: {
          day: 46,
          cardTitle: "Get support during a difficult period",
          cardSummary: "If a difficult period is affecting the plan, choose one temporary adjustment and one support option.",
          practice: [
            "If a difficult period is affecting the plan, choose one temporary adjustment and one support option.",
            "Check how to access the help and make the enquiry if it’s needed now. Set a realistic date to review the adjustment.",
            "If no difficult period fits, confirm the existing support details and leave the routine alone.",
          ],
          doneWhen: "The fitting adjustment and support step are made, or the existing support is confirmed. A reply isn’t required.",
        },
      },
      {
        day: 47,
        week: 7,
        title: "Return to the task you postponed",
        hero: "mountain",
        summary: "Hard seasons raise the stakes. Shrink the promise, keep it daily.",
        task: {
          day: 47,
          cardTitle: "Return to the task you postponed",
          cardSummary: "Return to the Day 31 first step.",
          practice: [
            "Return to the Day 31 first step. If it hasn’t happened, make it smaller or request the information or help you need. Spend up to fifteen minutes on the safe step now.",
            "If the issue is resolved, choose another small waiting task only if one exists. If none fits, keep a valued activity. Get support before action when safety or severe distress is involved.",
          ],
          doneWhen: "You’ve taken a fitting action or made the support request. Confrontation or painful reflection isn’t required.",
        },
      },
      {
        day: 48,
        week: 7,
        title: "Begin the next part of the day",
        hero: "door",
        summary: "The urge often guards a door. Open what you’re avoiding.",
        task: {
          day: 48,
          cardTitle: "Begin the next part of the day",
          cardSummary: "Look at the hour and choose the next necessary activity: food, work, class, washing, or bed.",
          practice: [
            "Look at the hour and choose the next necessary activity: food, work, class, washing, or bed. After a slip, close the content and follow your saved steps first.",
            "Begin a manageable part. If the day is going well, keep a useful existing commitment instead. Don’t add punishment to compensate for lost time.",
          ],
          doneWhen: "You’ve returned to one activity that fits the hour.",
        },
      },
      {
        day: 49,
        week: 7,
        title: "Take a step after a longer setback",
        hero: "calendar",
        summary: "The comeback starts tonight, not Monday.",
        task: {
          day: 49,
          cardTitle: "Take a step after a longer setback",
          cardSummary: "Review the latest Day 35 session if it’s happened; keep the check for afterwards if not.",
          practice: [
            "Review the latest Day 35 session if it’s happened; keep the check for afterwards if not.",
            "Confirm your support details. If control or daily life is seriously affected, check a qualified professional’s availability or request an appointment.",
            "If another area needs advice, make the fitting enquiry. You can use a service when no safe personal contact is available.",
          ],
          doneWhen: "The activity review is recorded or rescheduled, and support details are checked or a needed request is made.",
        },
      },
    ],
  },
  {
    n: 8,
    roman: "VIII",
    name: "Boredom and Meaning",
    blurb: "Empty hours, and what fills them well.",
    hero: "hourglass",
    lessons: [
      {
        day: 50,
        week: 8,
        title: "Give an activity time before switching",
        hero: "clock",
        summary: "Boredom is withdrawal’s echo. It fades if you don’t feed it.",
        task: {
          day: 50,
          cardTitle: "Give an activity time before switching",
          cardSummary: "Try ten to fifteen minutes of one activity without unrelated switching.",
          practice: [
            "Try ten to fifteen minutes of one activity without unrelated switching. Choose reading, a hobby, work, movement, or rest according to what you need. Devices are fine when they serve the activity.",
            "Record whether it became easier to enter, stayed dull, or didn’t fit. Choose one adjustment if useful.",
          ],
          doneWhen: "You’ve tried the activity and noted what happened. Enjoyment isn’t required.",
        },
      },
      {
        day: 51,
        week: 8,
        title: "Choose what begins in an empty gap",
        hero: "tab",
        summary: "The reflex reach is the enemy. Put friction on the exits.",
        task: {
          day: 51,
          cardTitle: "Choose what begins in an empty gap",
          cardSummary: "If a feed or unplanned gap often leads to porn, write a specific stopping rule or alternative.",
          practice: [
            "If a feed or unplanned gap often leads to porn, write a specific stopping rule or alternative. Keep it under Access or First response.",
            "During a normal gap today, begin the alternative before opening the usual feed and try it for ten minutes.",
            "If the pattern doesn’t fit, leave normal screen use alone and note the actual problem to work on instead.",
          ],
          doneWhen: "You’ve tried a fitting change or recorded that this pattern doesn’t apply. No risky browsing is needed.",
        },
      },
      {
        day: 52,
        week: 8,
        title: "Try fifteen minutes without switching",
        hero: "bench",
        summary: "Sit in the flat minutes. They’re retraining your baseline.",
        task: {
          day: 52,
          cardTitle: "Try fifteen minutes without switching",
          cardSummary: "Give one activity fifteen minutes without unrelated switching.",
          practice: [
            "Give one activity fifteen minutes without unrelated switching. Choose what fits: reading, a hobby, a task, gentle movement, or rest. Keep needed devices in use and unrelated feeds closed.",
            "At the end, record whether it became easier to enter, stayed dull, or wasn’t right for the moment. Then begin the next part of the day.",
          ],
          doneWhen: "You’ve tried the activity and recorded its fit. It needn’t be enjoyable or screen-free.",
        },
      },
      {
        day: 53,
        week: 8,
        title: "Change one screen habit",
        hero: "phoneTable",
        summary: "Screens after ten made the rules. Take the hours back.",
        task: {
          day: 53,
          cardTitle: "Change one screen habit",
          cardSummary: "Choose one screen rule for the problem you’ve observed.",
          practice: [
            "Choose one screen rule for the problem you’ve observed. Name the use, time, or place it covers, while preserving necessary calls, alarms, work, care, and accessibility.",
            "Prepare the setup and follow the rule when the situation happens. Otherwise name the first expected chance. Reuse an existing helpful rule if it fits, and set a Day 60 review.",
          ],
          doneWhen: "The rule and setup are ready, with first use completed or planned and the review saved.",
        },
      },
      {
        day: 54,
        week: 8,
        title: "Try an hour away from one feed",
        hero: "feedOff",
        summary: "You don’t need a detox monk-week. You need fewer triggers.",
        task: {
          day: 54,
          cardTitle: "Try an hour away from one feed",
          cardSummary: "Set aside one troublesome automatic feed or browsing habit for an hour.",
          practice: [
            "Set aside one troublesome automatic feed or browsing habit for an hour. Keep essential functions and your porn boundary in place.",
            "Notice when you reach for the habit and what you wanted then. At the end, decide whether a small lasting rule would help. If no such habit is causing trouble, review an existing useful rule instead.",
          ],
          doneWhen: "The hour and observation are complete, or you’ve reviewed the rule that fits your situation.",
        },
      },
      {
        day: 55,
        week: 8,
        title: "Prepare the first hour after waking",
        hero: "sunrise",
        summary: "A planned morning outruns a random night.",
        task: {
          day: 55,
          cardTitle: "Prepare the first hour after waking",
          cardSummary: "If the hour after waking is difficult, choose its first activity and prepare the materials.",
          practice: [
            "If the hour after waking is difficult, choose its first activity and prepare the materials. Set an alarm that allows enough rest. Keep needed phone functions and decide when unrelated feeds can begin.",
            "If the waking routine already works, confirm it. Save a short check for after the next waking period; we’ll revisit it on Day 56 if it has happened.",
          ],
          doneWhen: "The first activity and check are ready, or you’ve confirmed the routine that’s helping.",
        },
      },
      {
        day: 56,
        week: 8,
        title: "Give time to something that matters",
        hero: "compass",
        summary: "Meaning is the long cure. Boredom can’t survive a mission.",
        task: {
          day: 56,
          cardTitle: "Give time to something that matters",
          cardSummary: "Review the latest Day 35 session and yesterday’s waking plan if they have happened.",
          practice: [
            "Review the latest Day 35 session and yesterday’s waking plan if they have happened. Record what you tried and any adjustment. Keep future checks for afterwards.",
            "Name one person, responsibility, or activity that matters to you and give it fifteen to thirty minutes, or make the needed invitation or booking. You can reuse an existing activity.",
          ],
          doneWhen: "The reviews are recorded or rescheduled, and you’ve taken the chosen action or made its arrangement.",
        },
      },
    ],
  },
  {
    n: 9,
    roman: "IX",
    name: "Connection",
    blurb: "The people side of recovery.",
    hero: "twoCups",
    lessons: [
      {
        day: 57,
        week: 9,
        title: "Arrange a shared activity",
        hero: "twoCups",
        summary: "Recovery is a team sport played quietly.",
        task: {
          day: 57,
          cardTitle: "Arrange a shared activity",
          cardSummary: "Suggest an activity, day, and approximate time to someone you trust or enjoy.",
          practice: [
            "Suggest an activity, day, and approximate time to someone you trust or enjoy. If no safe personal contact is available, check how to attend a regular group or access an appropriate service.",
            "If social life is already working, keep a shared activity. Save details under Support or Weekly life only if they’ll help later.",
          ],
          doneWhen: "The invitation or enquiry is made, or you’ve kept the shared activity. A reply isn’t required.",
        },
      },
      {
        day: 58,
        week: 9,
        title: "Choose contact that fits",
        hero: "bench",
        summary: "Loneliness is a signal, not a sentence. Answer it in person.",
        task: {
          day: 58,
          cardTitle: "Choose contact that fits",
          cardSummary: "Choose the step that fits: more everyday contact through a shared activity, a one-to-one conversation with a safe person, or support from someone available when you’re missing a particular person.",
          practice: [
            "Choose the step that fits: more everyday contact through a shared activity, a one-to-one conversation with a safe person, or support from someone available when you’re missing a particular person.",
            "Make an invitation, attend, or check a group or service. If you aren’t lonely, give a valued relationship some attention. Respect other people’s limits.",
          ],
          doneWhen: "You’ve taken the chosen step. A reply or immediate change in loneliness isn’t required.",
        },
      },
      {
        day: 59,
        week: 9,
        title: "Choose how to spend time alone",
        hero: "bench",
        summary: "Alone on purpose is solitude. Alone by default is exposure.",
        task: {
          day: 59,
          cardTitle: "Choose how to spend time alone",
          cardSummary: "Choose ten to twenty minutes for an activity alone, or a personal activity in a shared place.",
          practice: [
            "Choose ten to twenty minutes for an activity alone, or a personal activity in a shared place. Decide what you’ll do and what follows it. Use necessary devices with unrelated feeds closed.",
            "Try it and note whether it was restful, difficult, or unhelpful. Make one adjustment if needed. Stop and choose contact or support if it becomes too distressing.",
          ],
          doneWhen: "You’ve tried a fitting activity and recorded the result, or stopped and chosen support.",
        },
      },
      {
        day: 60,
        week: 9,
        title: "Separate desire from wanting company",
        hero: "twoCups",
        summary: "It rehearses connection with none of the risk. That’s the theft.",
        task: {
          day: 60,
          cardTitle: "Separate desire from wanting company",
          cardSummary: "Review the Day 53 screen rule: did you follow it, did it help, and what should stay or change?",
          practice: [
            "Review the Day 53 screen rule: did you follow it, did it help, and what should stay or change? Keep the check for after use if you haven’t tried it.",
            "Then take a fitting step: focused time with a willing person, an invitation, a regular contact option, or checking the Day 21 sexual boundary. If no need is present, maintain something useful.",
          ],
          doneWhen: "The rule is reviewed or rescheduled, and the chosen step is taken. Sex, disclosure, and another person’s reply aren’t required.",
        },
      },
      {
        day: 61,
        week: 9,
        title: "Follow up on a connection",
        hero: "twoCups",
        summary: "Friendships grow on schedules. Plant one this week.",
        task: {
          day: 61,
          cardTitle: "Follow up on a connection",
          cardSummary: "Make one reasonable follow-up with a person or group you know.",
          practice: [
            "Make one reasonable follow-up with a person or group you know. Suggest an activity, ask about the next session, register, or attend again.",
            "If someone has declined or contact is one-sided, leave them space and choose another option. Check timing, cost, and access where needed.",
          ],
          doneWhen: "You’ve followed up or attended. Respecting a clear boundary and finding another suitable option also counts.",
        },
      },
      {
        day: 62,
        week: 9,
        title: "Set a safe limit on harmful contact",
        hero: "thunderCloud",
        summary: "Some rooms reopen the wound. Choose your rooms.",
        task: {
          day: 62,
          cardTitle: "Set a safe limit on harmful contact",
          cardSummary: "If an interaction repeatedly causes harm or ignores your limit, choose one safe change: mute a channel, limit your availability, decline an invitation, or seek support before acting.",
          practice: [
            "If an interaction repeatedly causes harm or ignores your limit, choose one safe change: mute a channel, limit your availability, decline an invitation, or seek support before acting.",
            "Save your own action if you’ll need to remember it. If no harmful interaction fits, keep or arrange time with someone you value, or check a support setting when contact isn’t available.",
          ],
          doneWhen: "You’ve made a safe change, taken a support step, or maintained a healthy connection. Confrontation isn’t required.",
        },
      },
      {
        day: 63,
        week: 9,
        title: "Give a relationship attention",
        hero: "twoCups",
        summary: "Real intimacy is slower, riskier, and worth the trade.",
        task: {
          day: 63,
          cardTitle: "Give a relationship attention",
          cardSummary: "Review the four Day 35 activity opportunities.",
          practice: [
            "Review the four Day 35 activity opportunities. Record what happened and whether to continue. Keep checks for any future sessions after they occur.",
            "Then do one useful thing for a relationship: listen, help, keep a plan, attempt a call, or make an appropriate apology or invitation.",
            "If no safe relationship is available, take a step towards a group or service.",
          ],
          doneWhen: "The activity review is recorded or kept for later, and you’ve taken one relationship or support step.",
        },
      },
    ],
  },
  {
    n: 10,
    roman: "X",
    name: "Yourself",
    blurb: "Repairing how you see and treat yourself.",
    hero: "mirror",
    lessons: [
      {
        day: 64,
        week: 10,
        title: "Choose support without revisiting painful events",
        hero: "umbrella",
        summary: "The habit started as armor. Thank it, then retire it.",
        task: {
          day: 64,
          cardTitle: "Choose support without revisiting painful events",
          cardSummary: "You can name one present-day reaction and prepare a safe response, such as noticing the room, leaving an unsafe setting, or saving a qualified support contact.",
          practice: [
            "This exercise is optional. You can name one present-day reaction and prepare a safe response, such as noticing the room, leaving an unsafe setting, or saving a qualified support contact.",
            "Try gentle grounding only if comfortable.",
            "You can also mark the topic as not relevant or skip without giving a reason. If reflection becomes upsetting, stop and choose care or support. No account of a past event is required.",
          ],
          doneWhen: "A present-day response is prepared, or you’ve chosen to skip, stop, or mark the topic not relevant.",
        },
      },
      {
        day: 65,
        week: 10,
        title: "Change one difficult setting",
        hero: "plant",
        summary: "If the house is on fire, stop blaming the smoke.",
        task: {
          day: 65,
          cardTitle: "Change one difficult setting",
          cardSummary: "Choose one setting that repeatedly makes difficult evenings harder, if any.",
          practice: [
            "Choose one setting that repeatedly makes difficult evenings harder, if any. Change a feature you safely control: timing, device use, work location, or contact with a harmful channel.",
            "If changing it is unsafe or complicated, request support first. If nothing fits, keep what’s helping and record that no change is needed.",
          ],
          doneWhen: "You’ve made a safe adjustment or support step, or confirmed no change is needed. Leaving a home, job, or relationship isn’t required.",
        },
      },
      {
        day: 66,
        week: 10,
        title: "Describe a mistake without an insult",
        hero: "mirror",
        summary: "The inner critic isn’t a coach. Fire the voice, keep the standard.",
        task: {
          day: 66,
          cardTitle: "Describe a mistake without an insult",
          cardSummary: "Choose a recent harsh judgement if available.",
          practice: [
            "Choose a recent harsh judgement if available. Write the event, actual consequence, and next action without the insult or unsupported claim about yourself.",
            "Save the brief response for Day 68. Include a repair or support step if needed. If no harsh judgement fits, describe an everyday difficulty factually or mark the task unnecessary.",
          ],
          doneWhen: "You’ve written the factual response or recorded that the pattern doesn’t apply. No new mistake is needed.",
        },
      },
      {
        day: 67,
        week: 10,
        title: "When you feel bad about yourself",
        hero: "mirror",
        summary: "Self-loathing feeds the loop it hates. Starve it.",
        task: {
          day: 67,
          cardTitle: "When you feel bad about yourself",
          cardSummary: "Use the Day 66 example if it fits.",
          practice: [
            "Use the Day 66 example if it fits. Bring a broad judgement back to the facts and take one action it has been preventing: food, washing, a commitment, appropriate contact, or professional support.",
            "If no such judgement fits, keep normal care and leave the analysis aside. Disclosure is optional and should be appropriate to the person and situation.",
          ],
          doneWhen: "You’ve taken the fitting action or requested support.",
        },
      },
      {
        day: 68,
        week: 10,
        title: "Check your response to self-criticism",
        hero: "plant",
        summary: "Talk to yourself like someone you’re responsible for.",
        task: {
          day: 68,
          cardTitle: "Check your response to self-criticism",
          cardSummary: "Review a real use of the Day 66 response if there has been one.",
          practice: [
            "Review a real use of the Day 66 response if there has been one. Record what happened next and change one detail if needed.",
            "If you haven’t needed it, read it once and name when you’d use it. If self-criticism doesn’t fit, check the after-slip steps instead. Keep this brief and stop if reflection becomes upsetting.",
          ],
          doneWhen: "You’ve reviewed actual use or practised a suitable response without creating a mistake.",
        },
      },
      {
        day: 69,
        week: 10,
        title: "Keep one manageable commitment",
        hero: "compass",
        summary: "Trust rebuilds in kept promises, smallest first.",
        task: {
          day: 69,
          cardTitle: "Keep one manageable commitment",
          cardSummary: "Choose one useful, modest action and give it a time or cue.",
          practice: [
            "Choose one useful, modest action and give it a time or cue. Prepare the materials and attempt it. An existing commitment is fine.",
            "Record completed, changed, or missed, with a practical reason if needed. If missed, choose the next realistic chance without adding punishment or restarting the course.",
          ],
          doneWhen: "You’ve made the attempt and recorded the result, including an appropriate adjustment.",
        },
      },
      {
        day: 70,
        week: 10,
        title: "Simplify the plan",
        hero: "chartUp",
        summary: "Improvement is proof. Log the gains somewhere you’ll see.",
        task: {
          day: 70,
          cardTitle: "Simplify the plan",
          cardSummary: "Review your plan.",
          practice: [
            "Review your plan. Keep something that helps, simplify something awkward if needed, and stop an optional demand only if it has no useful purpose.",
            "If every part fits, retain it. Discuss changes to professional treatment with the clinician; don’t treat it as an optional course demand. Leave a plan you can explain and use on a busy evening.",
          ],
          doneWhen: "The plan is reviewed and manageable. Another improvement project isn’t required.",
        },
      },
    ],
  },
  {
    n: 11,
    roman: "XI",
    name: "Build a Life You Want",
    blurb: "Point the freed-up energy at something.",
    hero: "mountain",
    lessons: [
      {
        day: 71,
        week: 11,
        title: "Use what your notes show",
        hero: "mirror",
        summary: "Know what pulls you, what drains you, what you’re for.",
        task: {
          day: 71,
          cardTitle: "Use what your notes show",
          cardSummary: "Read two or three useful entries.",
          practice: [
            "Read two or three useful entries. Identify one repeated difficulty and one response that helped if the record supports them. Use that information for the coming week.",
            "If the record is thin, choose one brief observation to collect instead. Keep the existing setup when it fits, and take a support step if the record shows the current help isn’t enough.",
          ],
          doneWhen: "The week reflects actual information or a focused plan to gather it.",
        },
      },
      {
        day: 72,
        week: 11,
        title: "Choose what you can do now",
        hero: "umbrella",
        summary: "Love the hand you were dealt. It’s the only playable one.",
        task: {
          day: 72,
          cardTitle: "Choose what you can do now",
          cardSummary: "If helpful, choose an everyday past event and distinguish what has happened from what you can do now.",
          practice: [
            "If helpful, choose an everyday past event and distinguish what has happened from what you can do now. Take a proportionate repair or present-day action.",
            "If no repair fits, choose a valued activity. If reflection is upsetting or unhelpful, skip and choose care or support. Gratitude, forgiveness, and retelling a painful event aren’t required.",
          ],
          doneWhen: "You’ve taken a fitting action or chosen to skip the reflection.",
        },
      },
      {
        day: 73,
        week: 11,
        title: "Reserve time for what matters",
        hero: "hourglass",
        summary: "Five years left: what stays, what goes, what starts tonight?",
        task: {
          day: 73,
          cardTitle: "Reserve time for what matters",
          cardSummary: "Choose a person, activity, or responsibility you want to give more time to.",
          practice: [
            "Choose a person, activity, or responsibility you want to give more time to. Reserve a realistic block in the next seven days and begin a small part today, or make the needed invitation or booking.",
            "Set a review after the block: did it happen, did it fit, and will you repeat it? Save it for Day 84 if due then, or for after the actual session.",
          ],
          doneWhen: "The time and review are scheduled and a first step is taken. Mortality reflection is optional.",
        },
      },
      {
        day: 74,
        week: 11,
        title: "Begin an activity you postponed",
        hero: "sunrise",
        summary: "Seize the day means this one. Before noon.",
        task: {
          day: 74,
          cardTitle: "Begin an activity you postponed",
          cardSummary: "Begin ten to twenty minutes of something you want more of, using the Day 73 choice if it fits.",
          practice: [
            "Begin ten to twenty minutes of something you want more of, using the Day 73 choice if it fits. If another person or booking is needed, make the arrangement and prepare what you can.",
            "If no postponed activity fits, keep an enjoyable commitment or deliberately rest. The task doesn’t require productivity or a reply.",
          ],
          doneWhen: "You’ve begun, made the needed arrangement, or kept a fitting commitment.",
        },
      },
      {
        day: 75,
        week: 11,
        title: "Plan the next ninety days",
        hero: "calendar",
        summary: "Ninety days is enough to change the trend line of a life.",
        task: {
          day: 75,
          cardTitle: "Plan the next ninety days",
          cardSummary: "Choose one aim for ninety days and a realistic weekly action.",
          practice: [
            "Choose one aim for ninety days and a realistic weekly action. Schedule four chances, then begin a small part or make the needed arrangement today.",
            "Set reviews after two weeks and at thirty, sixty, and ninety days. Write a smaller version for difficult weeks and how you’ll resume after interruption. You can reuse an existing activity.",
          ],
          doneWhen: "The aim, dates, reviews, smaller version, and first step are saved or completed.",
        },
      },
      {
        day: 76,
        week: 11,
        title: "Give one activity your attention",
        hero: "lighthouse",
        summary: "Peace of mind is the quiet dividend of kept vows.",
        task: {
          day: 76,
          cardTitle: "Give one activity your attention",
          cardSummary: "Set aside one distracting feed, notification source, or other input for twenty to thirty minutes when you’d normally use it.",
          practice: [
            "Set aside one distracting feed, notification source, or other input for twenty to thirty minutes when you’d normally use it.",
            "Keep essential functions and commitments available. Choose what gets your attention instead.",
            "Record whether the limit helped and whether to repeat it. If no input fits, give an enjoyable activity the time without unrelated switching.",
          ],
          doneWhen: "You’ve tried the limit or chosen activity and recorded the result. Silence or feeling calmer isn’t required.",
        },
      },
      {
        day: 77,
        week: 11,
        title: "Schedule something you want to keep doing",
        hero: "envelope",
        summary: "Picture next year’s you. Start acting like their friend.",
        task: {
          day: 77,
          cardTitle: "Schedule something you want to keep doing",
          cardSummary: "Name one recurring activity you’d like in life a year from now.",
          practice: [
            "Name one recurring activity you’d like in life a year from now. Schedule four chances, or confirm dates already made on Day 35 or 75. Make the first invitation, booking, or preparation.",
            "Set a review after the first session and another after four weeks. Add the first to Day 84 if it’s happened by then; otherwise keep the later reminder.",
          ],
          doneWhen: "The activity has dates, a first step, and both review reminders.",
        },
      },
    ],
  },
  {
    n: 12,
    roman: "XII",
    name: "Leave It Behind",
    blurb: "Make it permanent, then let it go.",
    hero: "door",
    lessons: [
      {
        day: 78,
        week: 12,
        title: "Keep the reason and next action clear",
        hero: "lighthouse",
        summary: "Forever is just today, kept daily.",
        task: {
          day: 78,
          cardTitle: "Keep the reason and next action clear",
          cardSummary: "Keep or rewrite the reason from Day 13 under Goal.",
          practice: [
            "Keep or rewrite the reason from Day 13 under Goal. Choose one behaviour that has helped to keep for ninety days and save a review date. You can reuse a date from Day 75.",
            "Use the behaviour today when its cue occurs. Otherwise practise the first step and keep the setup ready. Don’t create a risky test.",
          ],
          doneWhen: "The reason and review are saved, and the behaviour is used or its first step practised.",
        },
      },
      {
        day: 79,
        week: 12,
        title: "Compare the start with now",
        hero: "calendar",
        summary: "Twelve weeks ago this felt impossible. Read your own letter.",
        task: {
          day: 79,
          cardTitle: "Compare the start with now",
          cardSummary: "Compare your actual starting notes with now: time or disruption from viewing, responses to urges and slips, and one routine or activity.",
          practice: [
            "Compare your actual starting notes with now: time or disruption from viewing, responses to urges and slips, and one routine or activity. If recalling the start, say so.",
            "Include unchanged, worse, and unknown honestly. Choose one decision: keep a helpful change, adjust a weak one, or seek more support. Take its first step.",
          ],
          doneWhen: "The comparison and next decision are recorded, with a fitting first action.",
        },
      },
      {
        day: 80,
        week: 12,
        title: "Prepare for a changed situation",
        hero: "brain",
        summary: "The pathways quieted. The wiring is yours again.",
        task: {
          day: 80,
          cardTitle: "Prepare for a changed situation",
          cardSummary: "Choose a response that helped and a likely changed situation, such as travel, a shared room, or no phone.",
          practice: [
            "Choose a response that helped and a likely changed situation, such as travel, a shared room, or no phone. Prepare an accessible first step and practise the response once without an urge.",
            "If you choose an urge exercise, practise its steps and ending. If no response has helped, check a more suitable support option and enquire if help is needed now.",
          ],
          doneWhen: "You’ve checked the response in a changed situation or prepared and used the needed support option.",
        },
      },
      {
        day: 81,
        week: 12,
        title: "Use the changes that helped",
        hero: "flag",
        summary: "Keep the morning pledge, the log, the walk. Drop the scaffolding.",
        task: {
          day: 81,
          cardTitle: "Use the changes that helped",
          cardSummary: "Choose up to three changes that helped and use them in today’s routine: device placement, a response, an activity, a sleep rule, or support.",
          practice: [
            "Choose up to three changes that helped and use them in today’s routine: device placement, a response, an activity, a sleep rule, or support.",
            "If a cue doesn’t occur, practise the first step rather than create a test. If nothing helped clearly, record what’s missing and take a step towards other support.",
          ],
          doneWhen: "You’ve used or practised the chosen changes, or taken a support step. Preparation alone isn’t the whole task.",
        },
      },
      {
        day: 82,
        week: 12,
        title: "Check how to ask for help",
        hero: "books",
        summary: "Borrow from the recovered: meetings, sponsors, service, honesty.",
        task: {
          day: 82,
          cardTitle: "Check how to ask for help",
          cardSummary: "Confirm a first support contact or service and a backup.",
          practice: [
            "Confirm a first support contact or service and a backup. Check details, access conditions, and how to begin the request. Both options can be services if personal contacts aren’t available.",
            "Draft a short opening message if helpful. If support is needed now, send the enquiry or make the call. Use the backup when the first option is unavailable.",
          ],
          doneWhen: "Support details are checked and any needed first request is made. Personal disclosure or a reply isn’t required.",
        },
      },
      {
        day: 83,
        week: 12,
        title: "Finish with an honest next step",
        hero: "envelopeOpen",
        summary: "Say goodbye like you mean it. Write it down.",
        task: {
          day: 83,
          cardTitle: "Finish with an honest next step",
          cardSummary: "Read an early entry beside a recent one.",
          practice: [
            "Read an early entry beside a recent one. Note an honest observation, including no clear change where accurate.",
            "Remove remaining access to porn only if relevant and possible without reopening it.",
            "Otherwise spend fifteen to twenty minutes on a person or activity you value. If the record shows a serious continuing problem, use the support details now.",
          ],
          doneWhen: "The record is reviewed and one fitting action is taken. A positive ending or another deletion isn’t required.",
        },
      },
      {
        day: 84,
        week: 12,
        title: "Save a short plan for after the course",
        hero: "sunrise",
        summary: "The future is unwritten and finally yours to write.",
        task: {
          day: 84,
          cardTitle: "Save a short plan for after the course",
          cardSummary: "Save a short plan with your goal, early signs, first response, after-slip steps, smaller day, support details, and next review.",
          practice: [
            "Save a short plan with your goal, early signs, first response, after-slip steps, smaller day, support details, and next review. Keep it accessible, with a backup if needed.",
            "Review the Day 73 block and first Day 77 session if they’ve happened; otherwise keep their reminders.",
            "Set a check in two weeks and retain the thirty-, sixty-, and ninety-day reviews. If control or daily life is worsening, request help now.",
          ],
          doneWhen: "The short plan is saved, due reviews are completed or kept for later, and any needed support request is made.",
        },
      },
    ],
  },
];

/** Every lesson, flattened, in day order. */
export const CURRICULUM_84_DAYS: Curriculum84Lesson[] = CURRICULUM_84.flatMap((w) => w.lessons);

export function lessonForDay(day: number): Curriculum84Lesson | undefined {
  return CURRICULUM_84_DAYS.find((l) => l.day === day);
}

export function weekFor(n: number): Curriculum84Week | undefined {
  return CURRICULUM_84.find((w) => w.n === n);
}
