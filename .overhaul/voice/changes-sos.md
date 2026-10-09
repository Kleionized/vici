# Voice pass: sos package

Changed 78 strings across 11 files (the urge flow, the urge hub and its stages, the unsaved board, the SOS
response boards, the slip flow and its cards, the rough-day protocols, the Rough days shelf and Back Tap).
`npx tsc --noEmit -p .` and `npx eslint` on the changed files are both clean.

Every new string is the same length as the one it replaces or shorter, with one exception: the stress slip
card's headline "Take a short break." (was "Contained break.", which did not say what to do). It is one line
at 30pt, like the other card headlines of that length.

What went: the wave metaphor in instructions ("the wave loses its grip", "the moment the wave hits",
"not the wave"), coined images in the rough-day protocols (valve, trapdoor, switch, "close the day before it
closes you"), "X, not Y" slogans, "honest", "actually", "just", "a real break", every em dash in visible copy,
and two lines that were not true ("six moves" on the Rough days card, when the flow has three; "each round
gets a little harder" in odd one out, when it does not).

What stayed: "Ride it out", "ridden out" and "urge surfing" (the feature's name across the app and the
lessons), the urge ring's phase names, every picker label, and the SOS response boards' titles and bodies,
which were already short, plain instructions (except the challenge board's body, which talked about rejection
to users who never named it).

| File | Before | After |
|---|---|---|
| src/content/sosResponses.ts (SOS response boards, nav caption on the ten trigger boards) | What’s feeding it | What set it off |
| src/content/sosResponses.ts (SOS response boards, nav caption on the thirteen feeling boards) | What’s underneath | How you feel |
| src/content/sosResponses.ts (SOS challenge board, the challenge card) | Send one message — anything — or go stand where other people are for ten minutes. | Send one message, or go stand where other people are for ten minutes. |
| src/content/sosResponses.ts (SOS challenge board, body; the board is reached from any feeling by Give me another) | Rejection makes quick comfort look more valuable than it is. Don’t check their profile. | Being alone makes quick comfort look worth more than it is. |
| src/components/urge/flow.tsx (First 90 seconds, intro, caps line) | The interrupt | For any urge |
| src/components/urge/flow.tsx (First 90 seconds, intro, body) | A universal interrupt for the moment the wave hits. Three small moves — decide nothing until it passes. | Three small moves. Decide nothing until the urge passes. |
| src/components/urge/flow.tsx (Move I (Stand up.), body) | Both feet on the floor. The wave loses its grip the moment the room changes. | Both feet on the floor. Do it before you think about it. |
| src/components/urge/flow.tsx (Move II (Leave the room.), body) | Go somewhere with light, and somewhere you don’t usually watch. | Go somewhere bright, where you don’t usually watch. |
| src/components/urge/flow.tsx (Moves I to III, ghost link) | Try a different step | Try another move |
| src/components/urge/flow.tsx (Trigger picker, title) | What’s feeding it right now? | What set it off? |
| src/components/urge/flow.tsx (Feeling picker, title) | What’s underneath it? | What are you feeling? |
| src/components/urge/flow.tsx (Reassess, line when the urge has not moved) | Holding steady — still at {n} | Still at {n} |
| src/components/urge/flow.tsx (Reassess, line when the urge moved (Rising / Coming down / It passed)) | {word} — from {before} to {after} | {word}, from {before} to {after} |
| src/components/urge/flow.tsx (One more thing, line when the user picked An argument) | The relationship doesn’t need solving tonight. Write the one thing you need to say tomorrow. | The argument can wait until tomorrow. Write the one thing you need to say. |
| src/components/urge/flow.tsx (Last board, title) | The wave passed. | The urge passed. |
| src/components/urge/hub.tsx (Urge hub, first pane after the urge is logged, line) | Logged as ridden out. Stay here as long as you need. | Logged as ridden out. |
| src/components/urge/hub.tsx (Urge hub, first pane, line under Change where you are.) | Stand up. Move somewhere with light. | Stand up. Go somewhere bright. |
| src/components/urge/hub.tsx (Urge hub, second pane (last 30 days), title) | You’re riding a wave. | Urges pass. |
| src/components/urge/stages.tsx (Number tap stage, title) | Tap the numbers as they land. | Tap the numbers in order. |
| src/components/urge/stages.tsx (Number tap stage, line) | Eyes on the count, not the wave | Eyes on the count. |
| src/components/urge/stages.tsx (Odd one out stage, line (the rounds do not get harder)) | Each round gets a little harder | Tap it, then find the next. |
| src/components/urge/saving.tsx (That didn’t save. board, body (slip flow, Lapse and Urge log)) | Your {what} wasn’t written to your account. Check your connection, then try again. | Your {what} isn’t on your log. Check your connection and try again. |
| src/app/slip.tsx (Slip, It happened., body) | The day isn’t over. Log what happened, then stop it here. | The day isn’t over. Log it, then stop here. |
| src/app/slip.tsx (Slip not saved., line) | It isn’t on your log. You stopped all the same. | It isn’t on your log. You still stopped. |
| src/app/slip.tsx (Do you still want to keep watching?, line) | Honest answer. It changes what comes next. | Your answer changes what comes next. |
| src/app/slip.tsx (Don’t let it become two. (first slip today), body) | One slip happened. You can still turn the rest of today around. | One slip happened. Keep the rest of today clean. |
| src/app/slip.tsx (Stop here. (second slip today), body) | It happened again. The next hour can still be different. | It happened again. Make the next hour different. |
| src/app/slip.tsx (You can still stop here. (third slip today), body) | The day is not gone. The phone goes away for the rest of the evening — that’s the only job. | Put the phone away for the rest of today. That’s the only job. |
| src/content/slipCards.ts (Slip card Skip the self-lecture., body) | Don’t spend the next ten minutes punishing yourself. The useful part starts now: change what happens next. | Don’t spend the next ten minutes punishing yourself. Change what happens next. |
| src/content/slipCards.ts (Slip card Pick the next thing., body) | The slip doesn’t get to decide the rest of your day. Choose one thing to do and get out of the feed. | The slip doesn’t decide the rest of your day. Choose one thing to do and get off the feed. |
| src/content/slipCards.ts (Slip card Don’t stay cut off., body) | You don’t have to tell anyone what happened. Just don’t stay alone with it tonight. | You don’t have to tell anyone what happened. Don’t stay alone with it tonight. |
| src/content/slipCards.ts (Slip card The problem can wait., body) | Ten minutes. Stop here, take a real break, and give yourself a clean next hour. | Take a ten-minute break. Then make the next hour clean. |
| src/content/slipCards.ts (Slip card Don’t go back yet., body) | No messages, no profiles, no replies. Cool down first — then decide. | No messages, no profiles, no replies. Cool down first, then decide. |
| src/content/slipCards.ts (Slip card (tired), headline) | Do less, not more. | Do less tonight. |
| src/content/slipCards.ts (Slip card Stop feeding it., body) | Being turned on is not the problem. Cut the cue and let the rest of it pass. | Being turned on isn’t the problem. Close what set it off and let it pass. |
| src/content/slipCards.ts (Slip card (not sure), headline) | No reason needed tonight. | No reason needed. |
| src/content/slipCards.ts (Slip card (not sure), body) | You don’t need the story. Stop here and make the next slip harder. | Stop here and make the next slip harder. |
| src/content/slipCards.ts (Slip card Give the next hour a job., body) | A short, hard set beats an open feed. Then pick one thing to actually do. | Do a short, hard set. Then pick one thing to do. |
| src/content/slipCards.ts (Slip card (stress), headline) | Contained break. | Take a short break. |
| src/content/slipCards.ts (Slip card (stress), body) | Step away from the problem properly. Name one task for later — just one. | Step away from the problem. Pick one task for later. Just one. |
| src/content/slipCards.ts (Slip card Get out of bed for a few minutes., body) | Stay off feeds. Go back when you are actually ready to sleep. | Stay off feeds. Go back when you’re ready to sleep. |
| src/content/roughDays.ts (Loneliness, page I, line) | The pull isn’t about the screen. It’s about the empty room. | An empty room makes the urge louder. |
| src/content/roughDays.ts (Loneliness, page II, title) | It wants company. | You want company. |
| src/content/roughDays.ts (Loneliness, page II, line) | The itch is for another person, not a screen — the screen just answers fastest. | The screen is the fastest answer. It isn’t a person. |
| src/content/roughDays.ts (Loneliness, page III, line) | Reach outward, not inward. | Talk to someone. |
| src/content/roughDays.ts (Loneliness, page III, the move) | Message one person — not about this. A meme counts. | Message one person about anything. A meme counts. |
| src/content/roughDays.ts (Anxiety, page I, title) | Wound up, not turned on. | Wound up. |
| src/content/roughDays.ts (Anxiety, page I, line) | Anxiety and arousal share wiring — the body confuses one for the other. | Anxiety can feel like arousal. The body mixes them up. |
| src/content/roughDays.ts (Anxiety, page II, title) | The valve refills itself. | Relief doesn’t last. |
| src/content/roughDays.ts (Anxiety, page II, line) | The urge promises release, then hands the pressure back with interest. | The urge promises relief. Then the pressure comes back worse. |
| src/content/roughDays.ts (Anxiety, page III, line) | Slow the body first; the mind follows. | Slow the body. The mind follows. |
| src/content/roughDays.ts (Anxiety, page III, the move) | Four counts in, six counts out — ten times through. | Four counts in, six counts out. Ten times. |
| src/content/roughDays.ts (Stress, page I, line) | Stress narrows the mind to the nearest exit — and it knows a fast one. | Stress looks for the fastest way out. |
| src/content/roughDays.ts (Stress, page II, title) | The fast exit is a trapdoor. | It solves nothing. |
| src/content/roughDays.ts (Stress, page II, line) | Relief that costs tomorrow isn’t relief. The pile is still there after. | The relief is short. The pile is still there after. |
| src/content/roughDays.ts (Stress, page III, the move) | Step outside and walk one lap — no phone in your pocket. | Step outside and walk one lap. Leave the phone behind. |
| src/content/roughDays.ts (Boredom, page I, line) | An empty hour is the oldest trigger there is. | An empty hour is when the urge comes. |
| src/content/roughDays.ts (Boredom, page II, title) | The itch is for anything. | You need to move. |
| src/content/roughDays.ts (Boredom, page II, line) | Boredom doesn’t want the screen — it wants motion, any motion. | Boredom wants motion. The screen is only the easiest fix. |
| src/content/roughDays.ts (Boredom, page III, title) | The second-easiest thing. | Pick something else. |
| src/content/roughDays.ts (Boredom, page III, line) | The easiest thing is the screen. Pick the next one. | Skip the easiest thing. Do the next one. |
| src/content/roughDays.ts (Late night, page I, title) | Past your window. | It’s late. |
| src/content/roughDays.ts (Late night, page I, line) | After eleven, the odds tilt — willpower goes to sleep before you do. | You’re tired, and your guard is down. |
| src/content/roughDays.ts (Late night, page II, line) | The last hour awake is the weakest hour of the day. | Your last hour awake is your weakest. |
| src/content/roughDays.ts (Late night, page III, line) | Close the day before it closes you. | Decide when the day ends. |
| src/content/roughDays.ts (Home alone, page I, line) | Privacy is opportunity — the brain clocks it before you do. | No one will see. Part of you has already noticed. |
| src/content/roughDays.ts (Home alone, page II, title) | The door is a switch. | You would know. |
| src/content/roughDays.ts (Home alone, page II, line) | Alone drops the cost of a slip to zero. Knowing that is half the defense. | Alone, a slip looks free. It isn’t. |
| src/content/roughDays.ts (Home alone, page III, line) | Light and sightlines change the odds. | Make the room less private. |
| src/content/roughDays.ts (Home alone, page III, the move) | Open the curtains and work where you can be seen — or leave for twenty minutes. | Open the curtains and work where you can be seen, or go out for twenty minutes. |
| src/content/roughDays.ts (An argument, page I, line) | Anger wants a win — and a slip feels like one, briefly. | Anger wants a win. For a moment, a slip feels like one. |
| src/content/roughDays.ts (An argument, page II, title) | It offers control back. | You want control back. |
| src/content/roughDays.ts (An argument, page II, line) | The urge shows up right after the argument took your control away. | The argument took it away. The urge offers it back. |
| src/content/roughDays.ts (An argument, page III, line) | Spend the charge somewhere it can’t cost you. | Put the anger where it can’t cost you. |
| src/app/(app)/rough-days.tsx (Rough days, caps line over the first card) | The universal interrupt | For any urge |
| src/app/(app)/rough-days.tsx (Rough days, The first 90 seconds card, line (the flow has three moves, not six)) | Two quick questions, six moves that fit the answer. | Three moves for when an urge hits. |
| src/app/rough-protocol.tsx (Rough-day protocol, first page, ghost link) | Not tonight | Not now |
| src/app/backtap.tsx (Back Tap, line under the icon) | Open urge support in one move: double-tap the back of your iPhone, from anywhere. iOS runs a Shortcut that opens VICI straight to the urge tool. | Double-tap the back of your iPhone to open the urge tool from anywhere. It works through an iOS Shortcut. |

## Left alone on purpose

- Picker labels are stored on events and used as map keys: the SOS trigger and feeling cards
  (`src/content/sosPickers.ts`, read by `TRIGGER_BOARD` / `FEELING_BOARD` and filed in
  `precedingState`), the five places in `flow.tsx` (filed as `precedingState.location`), the hub's three
  chips (filed as `trigger`), the slip's nine "What fed it?" chips (filed as the lapse `trigger`, keyed in
  `SLIP_FED_TO_CARD`), the slip's when-chips (matched by label) and the four "Do you still want to keep
  watching?" answers (compared against `STILL_WATCHING`).
- "What got you through" values (`Breathing`, `Number tap`, `Odd one out`, `Waited out the timer`,
  `Breathing, number tap and odd one out`) are stored as `whatHelped` and read back on the hub.
- "What fed it?" on the slip flow and its "What fed it" card caption match `/lapse` (another package's
  file). The SOS trigger picker now says "What set it off?", matching `/urge-log`.
- `src/content/sosResponses.ts` is generated from the design frames by `scripts/overhaul/gen-sos-boards.mjs`.
  Running the generator again would undo the four changes here. `sos-breaks.mjs` and `copy-sweep.mjs`
  check against the frames and will now report these strings as different from the frames.
- The urge ring's phase names (Rising, Cresting, Passing, Settling) and the reassess words (Gone,
  Noticeable, Still there, Strong, Peaking): one-word labels, and they use the same wave words as the
  lessons on urge surfing.
- No visible copy to change: `src/app/relapse.tsx` (a redirect), `src/app/urge.tsx`, `src/app/urge-hub.tsx`,
  `src/app/rough-first90.tsx` (wrappers), `src/components/urge/index.tsx`, `src/components/slip/kit.tsx`
  (only the stored chip labels) and `src/components/urge/boards.tsx` ("Continue", "Give me another").
- The dev-only lab (`src/components/mono/lab/misc.tsx`) still shows the old samples "Coming down — from 4
  to 2" and "You’re riding a wave.". It is out of scope.
- A guard for the two new SOS kickers against a regeneration (a code change, not copy, so it waits for the
  owner): in `src/components/urge/boards.tsx` add
  `const KICKER: Partial<Record<SosResponse['kind'], string>> = { location: 'Where you are', trigger: 'What set it off', feeling: 'How you feel' };`
  and in `ResponsePage` use
  `centre: board.nav ? { step: board.nav.step, total: board.nav.of } : KICKER[board.kind] ? { title: KICKER[board.kind]! } : null`.
  The challenge board's body and challenge line would still need a generator override or a note in DECISIONS.md.

## Review pass

An independent review raised twelve points. Eleven were applied (the rows above show the final text):

- The argument line forbade settling it tonight; it now says the argument can wait. The reviewer's "It can wait
  until tomorrow." was changed to name the argument, since "it" has nothing to point to on that screen.
- The hub's second pane said "It will pass." one swipe after "It passed."; it now says "Urges pass."
- Boredom page II called the screen a kind of motion; it is now the easiest fix (page III still refers to it).
- Home alone page II repeated page I ("No one will see." then "Nobody would know."); it now says "You would know."
- Late night page I said "late" a third time on one board; the opening clause is gone.
- The unsaved board said the same fact twice under "That didn’t save."; the body now matches the slip board's
  "It isn’t on your log." (without the reviewer's "yet", since "Not now" may leave it unsaved).
- "Change the next hour" is now "Make the next hour different."
- The bored slip card's body says "Choose" again, so it does not echo the headline's "Pick".
- The two stage lines end with a period, like the other dark-board bodies.
- The SOS challenge board, reachable from any feeling (one tap of "Give me another" after "I don’t know"),
  no longer talks about rejection and "their profile".

Not applied: the kicker guard in `boards.tsx` (listed under "Left alone on purpose"). It is a logic change, and
the reviewer marked it for the owner to approve.
