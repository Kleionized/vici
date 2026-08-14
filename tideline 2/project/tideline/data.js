/* ===================== TIDELINE — content data ===================== */

window.SUGGESTED_VALUES = [
  "Connection","Health","Honesty","Growth","Creativity","Presence",
  "Discipline","Adventure","Family","Contribution","Calm","Courage"
];

// field types: 'short' | 'long' | 'scale' | 'choice'
window.LESSONS = [
  {
    slug:"why-youre-here", week:1, category:"Foundations", minutes:6,
    title:"Why you're really here",
    approach:["ACT","values"], sensitive:false,
    prompt:"In your own words, what is the life this change is making room for?",
    fields:[{ id:"life", type:"long", label:"The life I'm building toward" }],
    body:`## You're not here to win a game

Most change tools hand you a streak and dare you not to break it. The problem: the day you slip, the number resets to zero and the story becomes *"I failed."*

Tideline starts somewhere else. The question isn't **"how many days?"** It's **"what is this in service of?"**

## Lead with the life, not the rule

When the rule ("don't") is the only thing in front of you, every urge becomes a fight you can lose. When a **life you actually want** is in front of you, the same choice becomes obvious more often — not because you white-knuckled it, but because it stopped being worth it.

- A rule says *no.*
- A value says *toward what.*

That's the whole shift. We'll keep coming back to it.`
  },
  {
    slug:"not-a-straight-line", week:1, category:"Foundations", minutes:5,
    title:"Progress isn't a straight line",
    approach:["reframe","evidence"], sensitive:false,
    prompt:"When you've changed something hard before, how did it actually go?",
    fields:[
      { id:"shape", type:"choice", label:"Which felt truest of past change?", options:[
        "Smooth and steady","Two steps forward, one back","All at once, then drifting","I've never quite managed it"] },
      { id:"note", type:"long", label:"What that taught you" }
    ],
    body:`## The myth of the clean line

We picture progress as a line going up. Real change looks more like a tide: in, out, in again — but the waterline moves over weeks, not hours.

## Why this matters

If you expect the clean line, the first dip *feels* like proof it isn't working. It isn't proof of anything except that you're human and time exists.

> The people who change for good aren't the ones who never dip. They're the ones who stopped treating the dip as a verdict.`
  },
  {
    slug:"urge-is-a-wave", week:1, category:"Foundations", minutes:7,
    title:"An urge is a wave",
    approach:["ACT","urge-surfing"], sensitive:false, tool:"urge",
    prompt:"What does an urge feel like in your body, right before it peaks?",
    fields:[{ id:"body", type:"long", label:"How an urge shows up for me" }],
    body:`## Urges crest and fade

An urge feels like it will rise forever until you give in. It won't. Urges follow a curve — they build, peak, and recede, usually within minutes, **whether or not you act on them.**

## Surfing, not fighting

You don't have to defeat a wave. You float, you breathe, you let it pass under you. "Urge surfing" is exactly that: noticing the urge, staying with the sensation, and watching it crest and come down.

Whatever you do at the peak is **information**, not a verdict on who you are.

## Try the tool

The next time a wave comes, you have a place to ride it out.`
  },

  {
    slug:"spotting-triggers", week:2, category:"Understanding urges", minutes:6,
    title:"Spotting your triggers",
    approach:["CBT","awareness"], sensitive:false,
    prompt:"Think of a recent urge. What happened in the hour before it?",
    fields:[
      { id:"where", type:"short", label:"Where were you?" },
      { id:"before", type:"long", label:"What happened just before" }
    ],
    body:`## Triggers aren't mysterious

Urges feel like they come from nowhere. Usually they come from somewhere very specific: a time of day, a place, a feeling, a person, a transition.

## The four common shapes

- **Emotional** — stress, boredom, loneliness, even celebration.
- **Situational** — a place or routine your habit lives inside.
- **Social** — certain people, certain settings.
- **Physical** — tired, hungry, in pain, wired.

Naming the trigger doesn't make the urge disappear. It moves it from *"something is wrong with me"* to *"ah, this again — I know this one."*`
  },
  {
    slug:"halt", week:2, category:"Understanding urges", minutes:5,
    title:"HALT: the four warning lights",
    approach:["self-care"], sensitive:false,
    prompt:"Which of HALT tends to catch you most often?",
    fields:[
      { id:"halt", type:"choice", label:"My most frequent warning light", options:["Hungry","Angry","Lonely","Tired"] },
      { id:"plan", type:"long", label:"One small thing I can do when it shows up" }
    ],
    body:`## Hungry · Angry · Lonely · Tired

HALT is a check you can run in five seconds. When an urge spikes, ask: am I **H**ungry, **A**ngry, **L**onely, or **T**ired?

Often the urge isn't really about the thing you crave. It's the body asking for food, rest, repair, or company — and reaching for the fastest fix it knows.

## Why it helps

Meeting the real need takes the air out of the urge. A snack, a walk, a text to one person, ten minutes lying down — small, unglamorous, effective.`
  },

  {
    slug:"lapse-is-information", week:3, category:"Setbacks & self-compassion", minutes:6,
    title:"A lapse is information",
    approach:["reframe","self-compassion"], sensitive:false,
    prompt:"If a lapse were just data, what would your last one be telling you?",
    fields:[{ id:"data", type:"long", label:"What my last setback was pointing at" }],
    body:`## The difference between a lapse and a collapse

A lapse is a single moment. A collapse is the story we tell *after* the lapse — *"see, I always do this, what's the point"* — that turns one moment into ten.

The shame spiral does more damage than the lapse itself.

## Treat it like a scientist

When something goes off, a scientist doesn't quit the experiment. They write down the conditions. What was happening? What did I need? What would I set up differently?

In Tideline, a lapse is logged with the **exact same calm screen** as a win. No red. No reset. Just a note for next time.`
  },
  {
    slug:"talk-like-a-friend", week:3, category:"Setbacks & self-compassion", minutes:7,
    title:"Talking to yourself like a friend",
    approach:["self-compassion","evidence"], sensitive:false,
    prompt:"What would you say to a close friend in your exact situation?",
    fields:[
      { id:"friend", type:"long", label:"What I'd say to a friend" },
      { id:"harsh", type:"scale", label:"How harsh is your inner voice, usually? (1 gentle – 10 brutal)" }
    ],
    body:`## Self-criticism feels productive. It isn't.

Being hard on yourself feels like accountability. The research points the other way: harsh self-talk raises stress, and stress is a trigger. You end up fueling the thing you're trying to change.

## The friend test

You'd never talk to someone you love the way you talk to yourself on a bad day. Self-compassion isn't going soft — it's removing a trigger and freeing up the energy you were spending on the fight.`
  },
  {
    slug:"when-it-gets-dark", week:3, category:"Setbacks & self-compassion", minutes:5,
    title:"When it gets dark",
    approach:["safety"], sensitive:true,
    prompt:"What's one anchor — a person, place, or action — that helps when things feel heavy?",
    fields:[{ id:"anchor", type:"long", label:"My anchor when it gets heavy" }],
    body:`## Some days are heavier than others

Change can stir up a lot — not just cravings, but grief, shame, and low moods that go deeper than a hard afternoon. That's not weakness and it's not a setback. But it does deserve real care.

## This is the honest part

Tideline is a self-help companion. It is **not** a crisis service or a substitute for a professional. If things feel dark, reaching out to a person — a friend, a clinician, a helpline — is the strong move, not the failing one.`
  },

  {
    slug:"life-this-makes-room-for", week:4, category:"Building the life", minutes:6,
    title:"The life this makes room for",
    approach:["values"], sensitive:false,
    prompt:"One year from now, if this is working — what's different on an ordinary Tuesday?",
    fields:[{ id:"year", type:"long", label:"An ordinary Tuesday, one year on" }],
    body:`## Picture the ordinary day

Not the highlight reel — the Tuesday. Who do you wake up next to or call? What do you do with the hours and the attention this change gives back to you?

The clearer that ordinary day is, the more pull it has when an urge shows up. You're not resisting something. You're protecting something.`
  },
  {
    slug:"leading-indicators", week:4, category:"Building the life", minutes:5,
    title:"Leading indicators, not scoreboards",
    approach:["behavioral","evidence"], sensitive:false,
    prompt:"Which leading indicator would tell you most about a good week?",
    fields:[{ id:"indicator", type:"choice", label:"My most telling signal", options:[
      "Sleep","Movement","Real connection","Some structure","Mood"] }],
    body:`## Stop watching the scoreboard

A streak is a *lagging* indicator — it tells you what already happened, and it punishes you the moment it breaks.

**Leading indicators** are the inputs that quietly decide how your week goes: sleep, movement, connection, a little structure, your mood. Tend to those, and the outcome tends to follow.

## What Tideline shows you

Your dashboard leads with these — not a number to protect. On a hard day, "I slept and I talked to someone" is a better story than any streak.`
  }
];

window.WEEKS_META = {
  1:"Foundations",
  2:"Understanding urges",
  3:"Setbacks & self-compassion",
  4:"Building the life"
};
