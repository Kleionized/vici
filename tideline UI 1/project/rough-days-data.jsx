// rough-days-data.jsx — the "Rough Days" zero-friction protocol book.
// The in-the-moment content: a universal 90-second interrupt plus a
// library of step-by-step protocols, grouped by state and situation.
// Data only — the UI lives in screens-rough-days.jsx.
//
// Shape:
//   RD_FIRST90: [{ t, d, ifs?: [[label, text]] }]
//   RD_PROTOCOLS: { key: { icon, title, moment, first:[..],
//                          steps:[{t, d?, ifs?:[[label,text]]}],
//                          still?, basis?, hold } }
//   RD_SECTIONS: [{ label, note, keys:[..] }]

// The First 90 Seconds — the universal interrupt, urge-style: two quick
// asks tailor the six moves, then one move per page, a few lines each.
const RD_FIRST90 = {
  where: { q: 'Where are you right now?', options: [
    ['phone', 'Phone in hand'], ['laptop', 'At a laptop'], ['bed', 'In bed'], ['stuck', 'Somewhere I can’t leave'],
  ] },
  tap: { q: 'Is there a tap or sink nearby?', options: [['yes', 'Yes, close by'], ['no', 'Not really']] },
  steps: (w, tap) => [
    w === 'laptop'
      ? { h: 'Close the lid.', s: 'All the way. Stand the laptop on the floor, or carry it to another room.' }
      : w === 'bed'
        ? { h: 'Out of the bed.', s: 'The highest-risk spot there is. Phone face-down across the room — then get out of the bed completely.' }
        : { h: 'Phone down, now.', s: 'Lock the screen. Face down across the room, in a drawer, on the counter. Out of reach — not in your pocket.' },
    { h: 'Stand up.', s: 'Both feet on the floor. Lying down? Sit up, then stand all the way up.' },
    w === 'stuck'
      ? { h: 'Change your spot.', s: 'The bathroom, a stairwell, a window, the other side of the room — any change of place counts. Truly can’t move? Light on, sit fully upright.' }
      : { h: 'Leave the room.', s: 'Put a wall between you and where it started. Kitchen, balcony, the front step — the furthest easy place. Outside beats inside.' },
    tap === 'no'
      ? { h: 'Hit the cold.', s: 'Press a cold can or bottle against your face and neck — or open a window and breathe the cold in.' }
      : { h: 'Hit the cold.', s: 'Cold water on your face, or wrists under the tap for thirty seconds. Cold resets the body faster than anything.' },
    { h: 'Five minutes. Decide nothing.', s: 'Set a timer and wait it out. Breathe slow, longer out than in. The urge peaks and falls on its own — you’re just outlasting it.' },
    { h: 'Put one human in the loop.', s: 'While the timer runs, message or call one person. Anything — even just “hey.” You’re not alone with it anymore.' },
  ],
};

const RD_PROTOCOLS = {
  // ── Difficult emotional states ─────────────────────────────────────
  loneliness: {
    icon: 'user', title: 'Loneliness',
    moment: 'The quiet has teeth. No one’s around, no one’s texted back, and the ache is shopping for something to fill it.',
    first: ['Phone down and out of reach.', 'Stand up and leave the room you’re in.'],
    steps: [
      { t: 'Put one real human in the loop within two minutes.',
        ifs: [['People are awake', 'Call someone — don’t text. First name who won’t feel weird. No answer? Leave a voice note that you were thinking of them.'], ['Can’t face talking', 'Send one text. Steal this: “Hey, random — how’s your week going?”'], ['Middle of the night', 'Draft it now, leave it ready for morning, and move on. Don’t hunt for connection on a screen at 2am.']] },
      { t: 'Get your body near other humans, even strangers.',
        ifs: [['You can go out', 'A cafe, a shop, a gym, a late garage. Buy something or nothing. Twenty minutes in shared air.'], ['You can’t go out', 'A podcast, call-in radio, or a long video of people talking. Real voices change the room.']] },
    ],
    still: 'Do one small kind thing for someone — reply to a message you’ve sat on, leave a warm comment. Giving connection scratches the same itch. If the loneliness is most days, that’s worth telling a friend or a professional.',
    basis: 'Using porn to fill a connection gap is one of the most commonly self-reported patterns in recovery-community accounts (Fernandez et al., 2021).',
    hold: 'The urge is pointing at a real need. Feed the real one and the fake one loses its grip.',
  },
  anxiety: {
    icon: 'spark', title: 'Anxiety and worry',
    moment: 'Chest tight, thoughts sprinting into everything that could go wrong, and a voice promising ten minutes of quiet.',
    first: ['Phone down.', 'Stand up, both feet flat on the floor.'],
    steps: [
      { t: 'Slow your body before your mind.', d: 'Breathe in for four, out for eight. Six times. Count on your fingers so your mind has a job.',
        ifs: [['Counting won’t stick', 'Just make every out-breath longer than the in, and sigh it out loud. Ten of those.'], ['In public', 'Breathe slow through your nose — no one notices — and press your feet into the floor on each out-breath.']] },
      { t: 'Get the worry out of your head and onto something.',
        ifs: [['You can write', 'One sentence: “Right now I’m scared that ___.” Naming it shrinks it.'], ['You can’t write', 'Say it out loud: “I’m anxious about ___.”']] },
      { t: 'Discharge the stress chemicals physically. Ten minutes.',
        ifs: [['You can leave', 'Walk fast, outside, arms moving.'], ['Stuck inside', 'Twenty squats, ten press-ups, run the stairs twice, or shake your arms out hard for thirty seconds.']] },
    ],
    still: 'Find the one undone thing the anxiety is circling and do the first five minutes of it. Action is the off-switch for dread.',
    basis: 'Slow breathing and exercise have general evidence for easing acute anxiety. This is the mechanism, not a porn-specific number.',
    hold: 'Breathing gives you the calm porn promises — and you get to keep it.',
  },
  stress: {
    icon: 'flag', title: 'Stress and pressure',
    moment: 'Too much on the plate, a deadline at your neck, and your brain wants to flip the table and check out completely.',
    first: ['Phone down and out of reach.', 'Stand up and step away from the desk.'],
    steps: [
      { t: 'Take a real break, away from all screens, for five minutes.',
        ifs: [['You can go outside', 'Out the door, and look at something far away to unlock your eyes and your head.'], ['Stuck at a desk', 'Stand, stretch overhead, get water, look out a window for sixty seconds.']] },
      { t: 'Shrink the mountain.', d: 'Write the three things that actually have to happen today. Everything else waits.',
        ifs: [['Even three is too much', 'Write one. Just the next single thing.']] },
      { t: 'Start one of them for fifteen minutes.', d: 'Phone in another room, timer on. Momentum kills the overwhelm.' },
    ],
    still: 'If the load is genuinely too big, tell one person: “I’m underwater — can you take this, or give me an extra day?” Saying it out loud cuts it down.',
    hold: 'A break that costs you nothing is the one you want. Porn charges interest.',
  },
  anger: {
    icon: 'spark', title: 'Anger and frustration',
    moment: 'Something’s wound you up — jaw tight, heat in your chest — and the urge offers somewhere to dump it.',
    first: ['Phone down.', 'Get on your feet.'],
    steps: [
      { t: 'Give the heat a physical exit, now.',
        ifs: [['You can be loud', 'Twenty fast press-ups or squats, or a hard, fast walk. Push until the edge comes off.'], ['Quiet or public', 'Clench and release your fists ten times, or press your palms hard together for ten seconds, three times.']] },
      { t: 'Cool the body.',
        ifs: [['There’s a tap', 'Cold water on your face and wrists for thirty seconds.'], ['No tap', 'Step into cold air, or hold something cold against your neck.']] },
      { t: 'If it’s aimed at a person, write the message you won’t send.', d: 'Type every word into a blank note — then delete it, or screenshot it just for you and close it. Send nothing while you’re hot.' },
    ],
    still: 'Once the heat drops, give it twenty minutes, then decide if there’s something to actually say or fix. Calmly, later.',
    hold: 'Anger wants out, not in. Give it an exit that leaves you bigger, not smaller.',
  },
  shame: {
    icon: 'shield', title: 'Shame and guilt',
    moment: 'You feel low, dirty, not enough — maybe right after a slip — and the shame itself is dragging you back toward the thing that caused it.',
    first: ['Phone down.', 'Stand up and say out loud: “Shame is the fuel. I’m not feeding it back.”'],
    steps: [
      { t: 'Break the spiral with your body and one small clean act.',
        ifs: [['If you can', 'Take a shower. Warm water, two minutes, a literal reset.'], ['If you can’t', 'Wash your face and hands, change your shirt, tidy one surface near you.']] },
      { t: 'Swap the judge for a friend.', d: 'Say one true, kind sentence out loud: “I’m a person with a hard habit. That’s not the same as being a bad person.”',
        ifs: [['If it feels fake', 'Ask, “What would I say to a friend in this exact spot?” Then say that to yourself.']] },
      { t: 'If you slipped, turn it into data, not a verdict.', d: 'One line: what set that off — when, where, what were you feeling?' },
    ],
    still: 'Do one ordinary, forward thing: make food, step outside, message your accountability person. Re-enter the day.',
    basis: 'Moral disapproval of porn inflates self-perceived “addiction” and distress on its own, separate from how much someone actually uses (Grubbs et al., 2019). Shame is a driver here, not a brake.',
    hold: 'Shame says you’re bad. The truth is you’re mid-climb — and harsh self-talk only makes the climb steeper.',
  },
  sadness: {
    icon: 'compass', title: 'Sadness and low mood',
    moment: 'Everything’s flat and heavy, nothing seems worth doing, and porn is the one thing promising a flicker of feeling.',
    first: ['Phone down.', 'Sit up, then stand. Open the curtains or turn on a bright light.'],
    steps: [
      { t: 'Do one tiny active thing before you feel like it.', d: 'Motivation comes after action here, not before.',
        ifs: [['You’re in bed', 'Get out, make the bed, put clothes on. That’s the whole task.'], ['Already up', 'Wash one dish, wipe one surface, take out the bin. One thing.']] },
      { t: 'Get light and air on you.',
        ifs: [['You can go out', 'Step outside for five minutes, even just to stand. Daylight on your face.'], ['You can’t', 'Open a window, stand in the light, get fresh air.']] },
      { t: 'Lower the bar all the way and reach one person.', d: 'Text someone: “Feeling a bit flat today.” You don’t have to perform being okay.' },
    ],
    still: 'Pick one slightly bigger thing you usually enjoy and do it at half effort. Half counts. If the flatness has lasted weeks, please tell a GP or someone you trust — low mood that won’t lift is treatable.',
    basis: 'Doing small activities before motivation returns is behavioural activation, an established treatment for low mood. A general principle, not a porn-specific result.',
    hold: 'Waiting to feel like it is the trap. The small thing done is what lifts the feeling — in that order.',
  },
  boredom: {
    icon: 'compass', title: 'Boredom and restlessness',
    moment: 'Empty time, nothing gripping you, a buzz under the skin that wants stimulation now.',
    first: ['Phone down — scrolling is the boredom, not the cure.', 'Stand up and leave the room.'],
    steps: [
      { t: 'Raise the stimulation honestly, with your hands or your body.',
        ifs: [['You have energy', 'A workout, a run or walk, clean something, cook a real meal, play an instrument.'], ['Low energy', 'Music on and tidy one area, a puzzle, draw, stretch, a hot-then-cold shower.']] },
      { t: 'Change your location.',
        ifs: [['You can go out', 'Leave the house with no agenda. A walk, a shop, a library.'], ['You can’t', 'Move to a different room and start the activity there.']] },
      { t: 'Use your ready-made list so a bored brain doesn’t have to decide.', d: 'No list yet? Make it now — five things you can always do. Keep it where you’ll see it.' },
    ],
    hold: 'Boredom is a nudge to engage with life, not to numb out of it.',
  },
  grief: {
    icon: 'book', title: 'Grief and heartbreak',
    moment: 'A loss is sitting on your chest, the world feels thin, and you want to not feel it for a while.',
    first: ['Phone down.', 'Sit somewhere you feel safe.'],
    steps: [
      { t: 'Let the feeling have room instead of skipping it.', d: 'Numbing only delays grief and stacks a second weight on top.',
        ifs: [['If it wants to come', 'Let it. Cry if it comes. Set a timer for ten minutes and just feel it. That’s the task.'], ['If you’re numb', 'That’s okay too. Don’t force it. Just sit, breathe, and don’t reach for the screen.']] },
      { t: 'Put a person in it.',
        ifs: [['Someone knew the loss', 'Call them. Grief shared is grief carried.'], ['It’s late', 'Message one kind person: “Having a hard night — can we talk tomorrow?”']] },
      { t: 'Hold the basics together.', d: 'Water, something to eat, a little movement and daylight. Grief wrecks these first.' },
      { t: 'Do one gentle, non-screen comfort.', d: 'A warm drink, a bath, a blanket, slow music, a walk.' },
    ],
    still: 'If grief is swallowing everything for a long stretch, a counsellor or grief support can really help. That’s strength, not weakness.',
    hold: 'The way out of grief is through it — slowly, with people, not around it.',
  },
  burnout: {
    icon: 'flag', title: 'Overwhelm and burnout',
    moment: 'Running on empty, everything is too much, and you just want to vanish into something that asks nothing.',
    first: ['Phone down.', 'Lie or sit down somewhere quiet.'],
    steps: [
      { t: 'Actually rest, not with a screen. Ten minutes.',
        ifs: [['You can lie down', 'Eyes closed, on your back, do nothing. Real rest, no input.'], ['You can’t', 'Sit, close your eyes, slow breaths, hands still.']] },
      { t: 'Take one thing off the load today, for real.', d: 'Cancel, postpone, or hand off one task. Send the message now.' },
      { t: 'Check the basics.', d: 'Have you eaten, drunk water, slept? Fix the missing one.' },
      { t: 'Protect tonight’s sleep above everything.', d: 'Most of this clears with one real night.' },
    ],
    still: 'Ask one person for help with one thing. Burnout lies and says you have to carry it all.',
    hold: 'When the tank is empty, the answer is fuel and rest — not another withdrawal.',
  },
  rejection: {
    icon: 'shield', title: 'Rejection',
    moment: 'You got turned down, ignored, or left out, and the sting is steering you somewhere no one can reject you.',
    first: ['Phone down — don’t re-read the message or check whether they’ve seen it.', 'Stand up and move to another room or outside.'],
    steps: [
      { t: 'Let the sting be there without acting on it.', d: 'It peaks and passes. Give it twenty minutes — until the timer goes off, you make no moves and check nothing.' },
      { t: 'Don’t let one “no” write a story about your worth.', d: 'Say it: “One no is one no. It’s not a verdict on me.”' },
      { t: 'Get proof that real acceptance exists.', d: 'Message or call someone who’s on your side — about anything at all.' },
      { t: 'Move your body to burn off the sting.', d: 'A walk, a workout, get outside. Ten to fifteen minutes.' },
    ],
    hold: 'The risk-free counterfeit is how the fear of rejection grows. Stay in the real game.',
  },
  numbness: {
    icon: 'spark', title: 'Numbness and emptiness',
    moment: 'You feel nothing — flat and detached — and the urge offers the one guaranteed way to feel something.',
    first: ['Phone down.', 'Stand up.'],
    steps: [
      { t: 'Get a strong, clean sensation, fast.', d: 'You’re feeling-seeking, not pleasure-seeking — so give the body a legitimate jolt.',
        ifs: [['Best option', 'Cold. A cold shower, cold water on the face, or step into cold air for a minute.'], ['Other options', 'Intense exercise until you’re out of breath, loud music, something spicy or sour, a brisk walk.']] },
      { t: 'Come back into the body.', d: 'Feet flat. Name five things you can see, four you can hear, three you can touch. Out loud.' },
      { t: 'Do one small thing that used to mean something.', d: 'Even with no feeling attached. Feeling sometimes follows the action.' },
    ],
    still: 'If the numbness is constant and not just today, please flag it to a professional. It often sits on top of depression or burnout — both treatable.',
    hold: 'You want to feel alive. There are real ways to do that which don’t leave you emptier.',
  },
  discouraged: {
    icon: 'compass', title: 'Discouraged with recovery itself',
    moment: 'Sick of trying, progress feels too slow, and a voice says what’s the point — you’ll just slip again.',
    first: ['Phone down.', 'Stand up. The hopeless feeling is the setup for the slip — treat it as the danger it is.'],
    steps: [
      { t: 'Zoom out, on paper.', d: 'Write one way this month beats six months ago — longer gaps, faster recoveries, more awareness, anything.' },
      { t: 'Drop the all-or-nothing ruler.', d: 'Say it: “Progress here is jagged, not a straight line. Slow progress is still progress.”' },
      { t: 'Pick the journey back up at the next small step.', d: 'Not back at the start. Nothing resets to zero. Name the one next small thing — and do it.' },
    ],
    still: 'Talk to your accountability person, or someone who’s been at this. Discouragement shrinks fast when it’s said out loud.',
    hold: 'The only way to truly fail is to stop walking. You haven’t.',
  },

  // ── Hard situations ────────────────────────────────────────────────
  sick: {
    icon: 'bell', title: 'Sick days',
    moment: 'You’re ill, stuck in bed, low energy, no routine, phone in hand — every normal guard down at once.',
    first: ['Get out of the bed. Bed + sick + phone is the danger zone. Move to the sofa or a chair.', 'Put the phone on a charger across the room, not next to you.'],
    steps: [
      { t: 'Build a tiny structure for the next few hours.', d: 'So the day isn’t one open, empty stretch. Pick now: a rest block, fluids, a simple meal, one show or audiobook, maybe a short slow walk.' },
      { t: 'Choose your input in advance.', d: 'A comfort film, a long series, an audiobook, or a call. Decide before you’re bored, not during.' },
      { t: 'Keep the phone out of the bed for naps and at night.', d: 'Use a real alarm or leave it across the room. Sick + tired + screen-in-bed is the exact combo to avoid.' },
    ],
    still: 'Message someone that you’re ill and bored. A check-in or a call breaks the isolation.',
    hold: 'You’re not weak today — you’re unguarded. Move the phone and you remove most of the danger.',
  },
  travel: {
    icon: 'compass', title: 'Travelling or away from home',
    moment: 'Hotel room, alone, off your routine, somewhere no one knows you — and the usual rules feel suspended.',
    first: ['If you can, get out of the room for a bit.', 'In for the night? Set the room up: TV off, laptop away, phone charging across the room.'],
    steps: [
      { t: 'Rebuild a scrap of routine.', d: 'Set a wake time. Plan a workout or walk and a real meal. The same anchors as home.' },
      { t: 'Don’t let the room become a trap.', d: 'Work in the lobby or a cafe. Rest with the TV off and the laptop shut.' },
      { t: 'Stay tied to home.', d: 'Call or message someone back home daily. It keeps your real standards in the room with you.' },
      { t: 'Wear yourself out.', d: 'Explore on foot, use the gym, walk the city. A full day and a tired body leave little room.' },
    ],
    hold: 'You didn’t leave yourself at home. The standards that matter travelled with you.',
  },
  weekend: {
    icon: 'home', title: 'Weekends or empty time',
    moment: 'No work, no plans, a long open stretch — and the openness itself starts to feel dangerous.',
    first: ['Phone down.', 'Get off the sofa and decide the next two hours.'],
    steps: [
      { t: 'Give the day a shape.', d: 'Do this the night before when you can: one morning thing, one afternoon thing, one social thing. Write them down.' },
      { t: 'Plan the high-risk window specifically.', d: 'If late-morning-alone-in-bed is your danger zone, put something there — the gym, a walk, meeting someone.' },
      { t: 'Get out of the house for part of it.', d: 'Empty room + empty time is the risk. Break at least one. Go somewhere.' },
      { t: 'Put a person in the weekend.', d: 'Text someone to make a plan. Something to show up for protects itself.' },
    ],
    hold: 'Free time isn’t the enemy. Unplanned, unguarded, alone time is. Shape it and it’s yours.',
  },
  latenight: {
    icon: 'bell', title: 'Late nights or can’t sleep',
    moment: 'Late, tired but wired, phone glowing in a dark room, willpower at its lowest of the day.',
    first: ['Get the phone out of the bedroom right now. Charge it in another room; use a real alarm.', 'Turn a dim light on. Don’t lie in the dark with a screen.'],
    steps: [
      { t: 'If you’re not sleeping, get out of bed.', d: 'Go to another room and do something calm and boring in low light — a paper book, fold laundry, a slow stretch — for twenty minutes, then come back.',
        ifs: [['The trap', 'Lying in bed scrolling until you’re sleepy. Don’t.']] },
      { t: 'Set tomorrow’s guard now.', d: 'Decide the phone’s nightly charging spot, outside the bedroom. Make it the default every single night.' },
    ],
    still: 'Cut late caffeine and late screens going forward so the wired feeling fades earlier.',
    hold: 'Willpower runs out at night. Don’t rely on it — just keep the phone out of reach.',
  },
  aftermath: {
    icon: 'flag', title: 'The morning after a relapse',
    moment: 'You slipped. You wake flat and disgusted, and the “I’ve ruined it, might as well keep going” pull is already starting.',
    first: ['Get out of bed immediately and put the phone across the room. The second slip is more dangerous than the first — the spiral is the real threat.', 'Say out loud: “One slip. I’m not failing twice.”'],
    steps: [
      { t: 'Draw the line at this one.', d: 'The streak number isn’t the point. The next choice is.' },
      { t: 'Turn it into data, calmly, on paper.', d: 'What was the time, the place, the feeling, the trigger? You just learned something about your pattern.' },
      { t: 'Don’t punish yourself.', d: 'Shame fuels the next slip. Be matter-of-fact — like a coach reviewing the tape, not cruel.' },
      { t: 'Take one clean action to re-enter the day.', d: 'A shower, a real breakfast, get outside, message your accountability person.' },
    ],
    basis: 'The all-or-nothing reset (“I slipped, so I’ve failed”) is itself a relapse mechanism — the abstinence-violation effect. Treating a lapse as data, not a verdict, is the evidence-based alternative.',
    hold: 'Nothing resets to zero. The fall only happens if you let the first slip take a second with it.',
  },
  conflict: {
    icon: 'user', title: 'Relationship conflict or an argument',
    moment: 'A fight with your partner has left you hurt, angry, or distant, and the urge offers a private place to lick the wound.',
    first: ['Phone down.', 'Physically leave the room the argument is in. Get space.'],
    steps: [
      { t: 'Cool down before you act on anything.', d: 'Walk, breathe, splash cold water — fifteen to twenty minutes, until the heat drops.' },
      { t: 'See the move for what it is.', d: 'Say it: “This is turning to a counterfeit instead of toward them. That widens the gap I’m upset about.”' },
      { t: 'Discharge the feeling physically, then turn back.', d: 'Walk or work out to burn the charge, then come back with one honest sentence to reopen the door.' },
    ],
    hold: 'Conflict is a call to repair connection. The counterfeit only deepens the rift.',
  },
  breakup: {
    icon: 'book', title: 'A breakup',
    moment: 'It’s over, you’re raw and alone, and porn offers a hit of the intimacy you just lost.',
    first: ['Phone down — don’t check their socials or reread old messages.', 'Get out of the room, ideally out of the house.'],
    steps: [
      { t: 'Lean on real people, hard.', d: 'This is the time to over-reach for friends and family. Call someone now. If no one’s free, go where people are.' },
      { t: 'Hold the basics together.', d: 'Eat, sleep, move, daylight. Breakups demolish routine, and routine is protection.' },
      { t: 'Let grief be grief; don’t numb it.', d: 'Numbing just stretches it out.' },
      { t: 'Fill the slots the relationship used to fill.', d: 'Deliberately, with people and activity.' },
    ],
    still: 'If you’re spiralling badly, tell someone how bad it is, or talk to a professional. You don’t white-knuckle a breakup alone.',
    hold: 'You’re grieving a person, not a habit. Reach for people, who can actually help you heal.',
  },
  homealone: {
    icon: 'home', title: 'Home alone all day',
    moment: 'Working from home or a day off, the house empty for hours, no one coming or going.',
    first: ['If an urge is live, phone to another room and move to a different space — ideally not the bedroom.'],
    steps: [
      { t: 'Add friction before you need it.', d: 'Work in a room without the bed. Phone in another room. Blocker on the laptop. Door open.' },
      { t: 'Break the solitude.', d: 'Work from a cafe or library part of the day, or call someone on a break.' },
      { t: 'Block the day with real breaks.', d: 'Work in chunks. On breaks, stretch, step outside, get water. Don’t let it become one shapeless stretch.' },
      { t: 'Get out at least once.', d: 'A walk or an errand resets the day and breaks the isolation.' },
    ],
    hold: 'It’s the empty, unguarded hours that are risky, not being home. Add friction and company and the day is safe.',
  },
  drinking: {
    icon: 'spark', title: 'After drinking',
    moment: 'You’ve had a few, guard down, judgement fuzzy — and an urge that’s easy to resist sober suddenly seems reasonable.',
    first: ['Get the phone out of reach before bed. Charge it in another room. Decide this while you still can.', 'If the urge is loud, the move is simple: go to sleep. Make no decisions tonight.'],
    steps: [
      { t: 'Don’t trust drunk-you with this.', d: 'It’s chemistry, not character. Remove the means — phone in another room, every time you drink.' },
      { t: 'If alone-and-drunk is your pattern, don’t drink alone.', d: 'Use company as protection: be around people, or call it a night earlier.' },
      { t: 'Plan it sober.', d: 'Decide your after-drinking rules now, while clear-headed: where the phone goes, when you head to bed.' },
    ],
    basis: 'Alcohol reducing inhibition and impairing judgement is well established, and it’s a known relapse risk factor across addictions.',
    hold: 'Drunk-you can’t be trusted with this, and that’s fine. Decide while sober and remove the means.',
  },
  holidays: {
    icon: 'compass', title: 'Holidays or long time off',
    moment: 'A long break, structure gone for days, lots of downtime — maybe family stress or boredom on top.',
    first: ['If an urge is live, run The First 90 Seconds.', 'Then look at the days ahead, not just the moment.'],
    steps: [
      { t: 'Give the days a loose shape.', d: 'Each day: a morning anchor, some activity, some people. It stops the break drifting into shapeless time.' },
      { t: 'Keep one or two daily habits alive.', d: 'A workout, a walk, a wake time. They carry you through the unstructured days.' },
      { t: 'Plan for the specific stressor.', d: 'Family friction? Boredom? Too much alone time? Have an exit for each — a walk, a friend to text, an errand.' },
      { t: 'Spend the freed-up energy on something real.', d: 'Something you’ve been meaning to do.' },
    ],
    hold: 'A break is for rest and people, not for sliding back. A little structure keeps it yours.',
  },
  crunch: {
    icon: 'doc', title: 'Exam, deadline, or work crunch',
    moment: 'High pressure, long hours at a desk, brain fried — and porn offers an escape hatch from the strain.',
    first: ['Phone to another room, blocker on.', 'Stand up and step away from the desk for the break.'],
    steps: [
      { t: 'Work in focused blocks with real breaks.', d: 'Twenty-five to fifty minutes on, then a five-to-ten-minute break away from the desk — not a screen break.' },
      { t: 'Make the workspace clean.', d: 'Blocker on, phone elsewhere, tabs closed — so it’s not one click away.' },
      { t: 'Move on breaks.', d: 'A short walk, press-ups, a stretch. Far better than a screen.' },
      { t: 'Protect sleep even in crunch.', d: 'A rested brain resists better and works faster.' },
    ],
    hold: 'The escape feels like relief but steals the time and focus you can least afford now.',
  },
  morning: {
    icon: 'bell', title: 'Morning urges',
    moment: 'You wake up, body responsive, half-asleep, phone within reach, no one else awake — the old pattern right there.',
    first: ['Get both feet on the floor and stand up immediately, before anything else. Don’t lie there.', 'The phone is not in the bed. Keep it out of the bedroom so it can’t be.'],
    steps: [
      { t: 'Start the morning routine straight away.', d: 'First two minutes: water, then a shower, then daylight. Move your body right away.' },
      { t: 'Remember the arousal is just biology and passes on its own.', d: 'Once you’re up and moving, it fades within minutes. You don’t have to do anything with it.' },
    ],
    still: 'If mornings are your weak point, set the phone-out-of-bedroom rule tonight so tomorrow’s first reach isn’t a screen.',
    basis: 'Physical arousal peaks and fades on its own within minutes without any action needed — the same mechanism behind urge-surfing (Bowen et al., 2014).',
    hold: 'Morning wood is just biology. Getting up and moving is all it asks.',
  },

  // ── High-risk moments ──────────────────────────────────────────────
  accidental: {
    icon: 'spark', title: 'You saw something by accident',
    moment: 'An ad, a scene, a post, a thumbnail caught you off guard, and a spark is lit and climbing.',
    first: ['Break contact instantly. Close it, scroll past, lock the screen, look away. Don’t “just look once more.”', 'Put the phone down and stand up.'],
    steps: [
      { t: 'Change your physical state right now.', d: 'Stand, walk to another room, splash cold water on your face.' },
      { t: 'Let the spark fall.', d: 'It peaks and fades within minutes if you don’t feed it. Set a five-minute timer and breathe slow.' },
      { t: 'Add a guard so it’s rarer.', d: 'Blockers on, clean up the feed, less aimless scrolling where the cues live.' },
    ],
    basis: 'A craving triggered by a cue peaks and fades on its own within minutes if you don’t act on it — the same finding behind urge-surfing (Bowen et al., 2014).',
    hold: 'The spark isn’t a decision and it isn’t your fault. The next sixty seconds are yours.',
  },
  win: {
    icon: 'flag', title: 'Celebrating a win',
    moment: 'Something went well, you’re riding high, and a voice says you’ve earned a treat — just this once.',
    first: ['Catch the “I earned it” story and name it out loud: “That’s a justification, not a reward.”', 'Phone down.'],
    steps: [
      { t: 'Celebrate for real instead.', d: 'Tell someone your news, go out, do something you actually enjoy — with people if you can.' },
      { t: 'Mark the win in a way that fits the new you.', d: 'Pick a reward you’ll be glad about tomorrow. A reward that costs you the win is not a reward.' },
      { t: 'Stay a little alert.', d: 'Don’t let the high tell you the rules are off today.' },
    ],
    hold: 'A real reward leaves you better the next morning. “I earned it” is the oldest trick the habit knows.',
  },
  badnews: {
    icon: 'book', title: 'After a failure or bad news',
    moment: 'Something went wrong, you got knocked back, and the urge offers comfort — a soft place to land.',
    first: ['Phone down.', 'Reach for a real comfort instead, immediately.'],
    steps: [
      { t: 'Let the disappointment sting without medicating it.', d: 'It passes.' },
      { t: 'Get real comfort.',
        ifs: [['Someone’s around', 'Talk to them. A walk, a proper meal, rest.'], ['You’re alone', 'Call someone, or do one genuinely soothing non-screen thing — a warm drink, a walk, a shower.']] },
      { t: 'Spot the “I deserve this after today” story and decline it.', d: 'Say it: “I deserve actual care, not a counterfeit.”' },
      { t: 'Deal with the setback tomorrow.', d: 'When you’re not raw. Tonight, just steady yourself.' },
    ],
    hold: 'Bad news is heavy enough. Don’t add a slip you’ll carry on top of it.',
  },
  procrastination: {
    icon: 'doc', title: 'Procrastinating a hard task',
    moment: 'There’s something you’re dreading, you keep not starting it, and porn becomes the perfect way to not-start a little longer.',
    first: ['Phone to another room.', 'Name the task you’re avoiding, out loud. The urge is pointing straight at it.'],
    steps: [
      { t: 'Shrink it to a five-minute start.', d: 'Not the whole thing. Just open the document, write one line, lay out the tools.' },
      { t: 'Set a timer.', d: 'Five or ten minutes on the dreaded task. Resistance almost always breaks once you’re moving.' },
      { t: 'Notice the relief you actually want is finishing this, not escaping it.' },
    ],
    hold: 'The urge isn’t really about porn. It’s about the thing you don’t want to do. Start that, even badly.',
  },
  exhausted: {
    icon: 'bell', title: 'Running on empty (exhausted)',
    moment: 'You’re wiped out, no fuel left, and the easiest possible hit is the only thing that appeals.',
    first: ['Phone to another room.', 'Lie or sit down. Don’t make any decisions while this depleted.'],
    steps: [
      { t: 'Treat the tiredness directly.',
        ifs: [['You can sleep', 'Nap, or go to bed early. The urge often fades when the exhaustion does.'], ['You can’t sleep yet', 'Lie down with eyes closed for ten minutes, no screen.']] },
      { t: 'Check the basics.', d: 'Eaten? Drunk water? Moved at all today? Fix the missing one.' },
      { t: 'Keep the phone out of reach while you rest.', d: 'So tired-you isn’t tempted with it in hand.' },
    ],
    hold: 'When you’re this empty, the answer is sleep and food, not willpower. Refuel first.',
  },
};

const RD_SECTIONS = [
  { label: 'Difficult emotional states', note: 'When a feeling is driving it',
    keys: ['loneliness', 'anxiety', 'stress', 'anger', 'shame', 'sadness', 'boredom', 'grief', 'burnout', 'rejection', 'numbness', 'discouraged'] },
  { label: 'Hard situations', note: 'When the day itself is the risk',
    keys: ['sick', 'travel', 'weekend', 'latenight', 'aftermath', 'conflict', 'breakup', 'homealone', 'drinking', 'holidays', 'crunch', 'morning'] },
  { label: 'High-risk moments', note: 'When a single moment tips',
    keys: ['accidental', 'win', 'badnews', 'procrastination', 'exhausted'] },
];

Object.assign(window, { RD_FIRST90, RD_PROTOCOLS, RD_SECTIONS });
