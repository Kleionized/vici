Relapse / Post-Slip Workflow
Full branching logic for what happens after “I slipped”
CORE PRODUCT PRINCIPLE
The slip happened. The day is not over. The next job is to stop one bad moment becoming the rest of the day or night.
This document defines the decision logic, screen order, logging questions, post-slip actions, pledge handling, repeat-slip branches, safety rules, and learning model for VICI’s relapse flow.
The flow begins when an SOS session ends with “I slipped,” or when the user manually records a slip later. It should feel calm and decisive: no shame, no dramatic reset, and no long explanation while the user may still be vulnerable.
## Implementation Brief
Build this as a separate post-slip flow, not as the final screen of urge surfing. The user should feel, almost immediately, that the day is still recoverable. The first question is not “why did you fail?” It is “what helps you stop here and turn the next hour around?”
When the slip was recent, prevent continuation first. Then capture the minimum useful facts while they are fresh. After that, give one concrete change for the next risky window, remind the user that the campaign still stands, and bring them back into the app with a clear sense that they can recover the rest of the day.
Use “slip” consistently in user-facing copy. The current mockups mix slip, lapse, and relapse. Keep “relapse” as an internal feature name if useful, but do not switch terms inside the experience.
Recommended response hierarchy:
1) End the current viewing session
2) Break access to the next one
3) Log when it happened
4) Capture what fed it
5) Check whether the user is still at risk of continuing
6) Give one specific reset action
7) Remind them the pledge and campaign still stand
8) Set up the next risky window
9) Follow up the next morning
# 0. System at a Glance
Stage
Question / signal
What it controls
A
Entry source
SOS bypass vs manual log.
B
How recent was the slip?
Whether the flow prioritises immediate anti-repeat action or reflection.
C
Is porn still open / is the session still continuing?
Whether access must be broken before any questions.
D
When did it happen?
Timestamp and same-day repeat logic.
E
What was going on?
Feeling/state module.
F
What set it off?
Trigger-removal / prevention module.
G
How strong is the urge to continue now?
Whether to return to SOS-style command mode.
H
Repeat count in the last 24 hours
Normal reset vs same-day repeat branch.
I
Existing pledge
Re-sign / change / skip.
J
Final action + next-morning follow-up
What the user actually does next.
## Recommended Order
Recent slip, still vulnerable: Stop access → log time → capture cause → current urge → reset action → pledge → summary → Begin Again. The emotional arc is: it happened → stop here → the day is still yours → begin again.
Older slip: Log time → capture cause → prevention action → summary. Do not run emergency copy for something that happened yesterday.
If the app already knows the time or trigger from the SOS session, prefill it. Do not ask the user to repeat information.
# 1. Design Rules
## Rules Every Branch Should Obey
No punishment. A slip changes one event in the record; it does not erase lessons, medallions, prior check-ins, or the campaign. Make that visible so the user understands that most of the day is still theirs to decide.
Prevent continuation before reflection. If porn is still open or the current urge is high, close access and move first.
Never celebrate the slip. Logging can be acknowledged without confetti, praise, or “great job” language.
Never punish honesty. Recording a slip should unlock more useful support, not a worse score screen or a lecture. The response should make it easier to recover quickly, not make the user feel that the day has already been lost.
Keep the questions short. The post-slip flow is not a journal prompt. One or two taps should capture most of the event.
Use concrete verbs: close it, put the phone away, leave the room, block the feed, go to bed, message someone.
Do not make the user analyse childhood, relationships, or “the root cause” immediately after a slip.
Do not imply that a sexual thought, masturbation without porn, or arousal itself is a slip unless that is explicitly part of the user’s chosen goal.
If the user already slipped twice, do not show “Don’t fail twice.” Use the repeat-slip branch instead.
Same safety filters as SOS: leaving home is never required when it is late or unsafe; strenuous actions are filtered for health, mobility, and context.
Forward-looking copy should be concrete: “The day is not over,” “The next hour still counts,” “You can stop here,” “Nothing else was reset.” Avoid grand comeback language, shame, or promises that tomorrow will be easy.
# 2. Input Model
## Minimum Data Needed for Useful Branching
Field
Allowed values
Purpose
entry_source
sos / manual / checkin
Determines what is already known.
recency
just_now / earlier_today / yesterday / custom
Controls urgency and timestamp UI.
current_state
stopped / still_open / unknown
Triggers access-break bypass.
current_urge
0–5
Controls post-slip intervention intensity.
repeat_count_24h
0 / 1 / 2+ previous slips
Controls normal vs repeat-slip copy and friction.
feeling
bored / lonely / stressed / anxious / angry / rejected / tired / low / restless / sexual / unknown
Chooses state-response module.
trigger
sexual_content / social_scroll / phone_in_bed / fantasy / insomnia / conflict / rejection / alone / habit / other / unknown
Chooses what to remove or change.
location
bed / bathroom / private_room / home_alone / work_school / public / other
Filters actions.
context_flags
night / safe_to_leave / mobility_ok / discreet_required
Safety filtering.
pledge_state
none / active / changed_recently
Controls pledge screen.
recent_slip_action_ids
last 3 actions shown
Avoids repeating the same reset every time.
## Keep Feelings and Triggers Separate Internally
The current “What fed it?” grid mixes feelings, situations, devices, and times of day. That is fine visually if the screen is simple, but store the answers in two groups so the app can respond correctly.
Group
Examples
What it changes
What was going on
Bored, lonely, stressed, tired, rejected, angry, sexually aroused
What the user needed / what regulation helps now.
What set it off
Phone in bed, social media, sexual content, argument, fantasy, could not sleep, being alone
What should be removed or made harder next time.
# 3. Terminology and Core Copy
Current / avoid
Use instead
Reason
“Lapse logged.”
“Slip logged.”
Matches the rest of the app.
“Relapse” in body copy
“Slip”
Less clinical and consistent with the rest of VICI.
“That’s data.”
“The day is not over. Log it while it’s fresh.”
More human; still preserves the learning idea.
“One slip is a data point; two is a pattern.”
“Don’t turn one slip into the rest of the night.”
Avoids pseudo-analytical language.
“Start over.”
“Begin again.”
Keeps progress intact.
“Your streak reset.”
Never show
Campaign does not reset.
# 4. Entry and Bypass States
## Handle These Before the Normal Logger
State
Immediate branch
Then
Still viewing / porn still open
“Close it now.” → confirmation → put device out of reach / leave private context.
Resume logging only after access is broken.
Slipped just now, urge 4–5
Use SOS-style environment actions first. One action per screen at 5/5.
When urge ≤3, continue log.
Slipped just now, urge 2–3
Log quickly, then require one reset action before final screen.
Pledge / summary / Begin Again.
Slipped just now, urge 0–1
Normal logger.
Prevention action, then finish.
Slip happened earlier today
Do not run emergency screens unless current urge is high.
Log + one prevention change.
Slip happened yesterday or earlier
Treat as record + learning.
No “Don’t fail twice” screen unless user is currently at risk.
Second slip within 24h
Skip “Don’t fail twice.” Use “Stop here.” repeat-slip branch.
Stronger access barrier + current-urge check.
Third+ slip within 24h
Do not add more guilt or more questions.
Break access for the rest of the vulnerable window; surface permanent friction change after stabilisation.
## Current-Urge Check
After logging a recent slip, ask one direct question:
“How strong is the urge to keep going right now?”
Use the same 0–5 language as SOS so the user does not have to learn a second scale. If the answer is 4–5, route back into the SOS environment/action engine with the post-slip state preserved.
# 5. The Core Screen Sequence
## Recommended Flow From “I Slipped”
Screen
Purpose
Recommended copy / UI
1. Slipped
Acknowledge without shame; move into log.
Title: “It happened.” Body: “The day is not over. Log it while it’s fresh, then turn the next hour around.” CTA: “Log the slip”.
2. Access break (conditional)
Only if still viewing / continuing.
“Close it now.” Confirmation button: “Closed”.
3. When
Timestamp.
Just now / Earlier today / Yesterday / Specify time.
4. What fed it
Capture state + trigger.
Two compact groups or one grouped grid. Multi-select.
5. Slip logged
Show facts, not judgement.
When · What was going on · Set off by. CTA: “Continue”.
6. Current urge
Measure repeat risk.
“How strong is the urge to keep going right now?” 0–5.
7. Anti-repeat branch
Prevent the next one.
“Don’t fail twice.” or repeat-slip variant. One concrete action, with a clear reminder that the rest of the day can still be recovered.
8. Pledge (conditional)
Preserve commitment without forcing perfection.
“The pledge still stands.” Re-sign / Change the pledge.
9. Begin again
Return user to campaign.
“Begin again.” “Slip logged. Nothing else was reset. The rest of today still counts.” CTA: “Start again”.
# 6. Logging Screens
## Screen: When Did It Happen?
Keep the fast options from the mockup. The custom picker should only open when the user taps “Specify time.”
Option
Behaviour
Just now
Use current timestamp. Mark event as recent.
Earlier today
Ask approximate time only if useful; otherwise store date + “earlier today”.
Yesterday
Store prior date; no emergency copy by default.
Specify time
Open date/time picker.
Primary CTA should say “Continue” or “Next.” Do not use “Log the urge” on a slip screen.
## Screen: What Fed It?
The current 3×3 grid is visually strong, but the labels should be grouped so the answers are conceptually clean.
Feeling / state
Situation / trigger
Bored
Late night
Lonely
Phone / scrolling
Stressed
Sexual content
Tired
Couldn’t sleep
Angry / upset
Argument / rejection
Rejected
Being alone
Sexually aroused
Fantasy / memory
Low / numb
Habit / automatic
Not sure
Other
The UI can still present these as compact tiles. Internally, store them separately. Allow multiple selections, but do not require the user to choose a feeling if they genuinely do not know.
## Screen: Slip Logged
Replace the current “What I did — Rode it out” row, which belongs to urge logging. Use the summary to show the actual slip record and the change that follows from it.
Row
Example
When
Last night · 11:40 PM
What was going on
Bored · Tired
Set off by
Phone in bed · Late night
Change for next time
Phone charges outside the bedroom
# 7. Anti-Repeat Branching
## First Slip in the Current Window
Keep the title “Don’t fail twice.” It is direct and memorable. The body should be encouraging without becoming sentimental: the slip happened, but the rest of the day is still available.
Recommended copy:
“Don’t fail twice.”
“The day is not over. Don’t give one slip the rest of it.”
Then show one action chosen from the relevant trigger/location pool. Do not make the screen a speech.
## Second Slip in the Last 24 Hours
Do not show “Don’t fail twice” after the user already has. Switch the language completely, but keep the message hopeful: even after a second slip, the next hour can still be different.
Element
Copy
Title
“Stop here.”
Body
“It happened again. You can still stop here. The next hour still counts.”
Action
Break access for 15–30 minutes: phone away, blocker on, leave private room, or stay in a shared/public context.
CTA
Completion statement: “Phone is away”, “I’ve moved”, “Blocked”.
## Third or Later Slip in the Last 24 Hours
## Recommended opener: “You can still stop here. The day is not gone. Let’s make the next hour different.”
More copy will not help. Reduce questions and increase friction.
Close current access and keep the device inaccessible for the rest of the immediate vulnerable window.
If it is late, default to safe indoor separation rather than telling the user to go outside.
If the same app/site is involved repeatedly, offer a temporary block for the rest of the evening.
If the current urge remains 4–5, route into SOS command mode.
Do not ask the user to rewrite the pledge after every same-day slip.
## Why This Matters
The repeat branch should feel more practical, not more severe. The app is not increasing punishment; it is increasing friction because the first reset did not hold. Every repeat branch should still make clear that the user can stop now and salvage the rest of the day.
# 8. Trigger-Specific Reset Actions
## The Slip Should Produce One Concrete Change
What fed it
Immediate reset
Next-window change
Late night + tired
Phone away; leave bed/room briefly if needed; low-stimulation reset.
Charge phone outside bedroom; use non-phone alarm if practical.
Phone / scrolling
Exit feed and lock it for 15–30 minutes.
Temporary limit/block during vulnerable hours; move charger.
Sexual content
Close the source. Do not check it again.
Mute/unfollow/block recurring source if appropriate.
Boredom
Short physical or distance challenge; then choose one intentional activity.
Keep a small list of phone-free alternatives that have actually worked.
Loneliness
Message one person or move toward people if safe. No disclosure required.
Put one real contact point on tomorrow’s calendar.
Stress / overwhelm
Take a contained break; name one task for later.
Schedule the next concrete work/school/money action.
Argument / rejection
No message/profile checking for 30 minutes; do not reply while activated.
Revisit the conversation later, outside the urge window.
Couldn’t sleep
Leave bed briefly if needed; dim light; no feeds.
Phone out of bedroom and a low-stimulation sleep routine.
Being alone / private
Move to the least private safe place available; device out of reach.
Pre-plan where the phone goes when alone.
Habit / automatic
Break the exact sequence now.
Change one cue: bathroom phone-free, charger moved, app blocked, door open, etc.
Not sure
Default device separation + location change.
Do not force a story; watch for repeats over future logs.
## Action Variation
Use the same rotation rules as SOS. The mandatory first move can stay fixed when it matters, but the second action should vary. Suppress exact actions shown in the previous three slip/SOS sessions when another safe option exists.
Do not use gimmicky “races,” scavenger tasks, or chores as reset challenges. Prefer physical distance, device separation, a short hard-but-safe movement set, a timed no-checking rule, or moving into a more protective setting.
# 9. Pledge Logic
## The Pledge Does Not Break Automatically
The pledge screen is useful because it prevents the slip from turning into “I failed the whole commitment.” It should remind the user that one event did not erase the decision they made to change. But it should not appear mechanically after every slip.
Condition
Show
Behaviour
Active pledge + first slip since signing
Yes
Show the pledge card. Primary: “Sign it again.” Secondary: “Change the pledge”.
Active pledge + same-day repeat slip
Usually no
Focus on access/friction first. Re-signing again can feel ritualistic.
Pledge changed in last 7 days
Optional
Prefer “Keep this pledge” over another signature.
No pledge exists
No
Skip the screen.
User taps Change the pledge
Yes
Let them edit one sentence; no essay or moral framing.
## Recommended Copy
“The pledge still stands.”
“A slip does not cancel it. You can still keep the pledge for the rest of today. Sign it again — or change it into something you can actually keep.”
Keep the pledge itself visual and personal, with the user’s name/signature. Do not add an inspirational quote beneath it.
# 10. Begin Again Screen
This should be the clean end state. No analysis. No score penalty animation. No “day zero.” The screen should feel like the user has already started recovering, not like they are waiting for tomorrow to try again.
Element
Recommended copy
Title
Begin again.
Status
Slip logged · nothing else was reset. The rest of today still counts.
Visual
Simple reset / sunrise / neutral transition. Avoid celebratory confetti.
Primary CTA
Start again
Secondary
Back / Done only if needed
If your campaign model marks the slip day differently, show that change elsewhere. The purpose of this screen is to make continuation obvious.
# 11. Current-Urge Reassessment
## A Slip Can End While the Urge Stays High
Do not assume that logging the slip means the user is safe from repeating it. After a recent slip, ask for the current urge and branch exactly as the SOS engine does.
Current urge
Post-slip behaviour
0–1
Finish log + one prevention change. No emergency actions.
2
One 5–10 minute reset action, then finish.
3
Require location/device change before pledge/final screen.
4
Return to SOS emergency mode: move first, remove access, minimal reflection.
5
Return to SOS command mode: one action per screen, confirmation after each.
Prompt: “How strong is the urge to keep going right now?”
Do not ask “Are you going to relapse again?” The event has already happened and the wording is accusatory. Measure the current state instead.
# 12. Feeling Modules After a Slip
Feeling
What to do now
Copy direction
Ashamed / guilty
No self-lecture; complete one visible reset action.
“Do not spend the next ten minutes punishing yourself. The useful part starts now: change what happens next.”
Bored
Movement / intentional activity.
“The slip does not have to decide the rest of your day. Pick one thing to do next and get out of the feed.”
Lonely
Break isolation.
“You do not need to tell anyone what happened. Just do not stay cut off. The next part of the day can be different.”
Stressed / anxious
Contained state break, then one next task later.
“The problem can wait ten minutes. Stop here, take a real break, and give yourself a clean next hour.”
Rejected / angry
No checking or replying.
“Do not go back to the message, profile, or argument yet. Give yourself time to cool down before the next decision.”
Tired
Low-energy protection, sleep routine.
“Do less, not more. Put the phone away and make the rest of the night easier.”
Sexually aroused
Cue removal without shame.
“Being turned on is not the problem. Stop feeding it now and let the rest of the urge pass.”
Unknown
Default action; no forced meaning.
“You do not need the reason tonight. Stop here and make the next slip harder.”
# 13. Pattern Learning and Permanent Friction
## Use Repeated Logs to Change the Product, Not to Diagnose the User
After enough data exists, VICI can surface repeated combinations. Keep the language factual: “This has happened three times after midnight with your phone in bed,” not “Your real problem is avoidance.”
Repeated pattern
Suggested change
Bed + late-night phone
Charge phone outside bedroom; bedtime blocker; non-phone alarm.
Bathroom + phone
Make bathroom phone-free.
Social media / sexual content
Mute/unfollow recurring sources; block feed during risky hours.
Home alone / private room
Use a less private work/rest spot; device outside the relapse room.
Boredom
Rank saved alternatives by what previously reduced urge intensity.
Loneliness
Schedule one recurring social contact; one-tap message shortcut.
School/work stress
End post-slip flow with one small next task for tomorrow.
Insomnia
Phone separation + low-stimulation sleep routine.
Argument / rejection
No-checking window; delay replies; remove profile/message refresh loop.
## When to Show a Permanent Change
After the immediate urge is ≤2, not during command/emergency mode.
When the same trigger/location pair has appeared at least 2–3 times recently.
When the user has skipped the same suggested action repeatedly, offer a different family instead of nagging.
Never turn one log into a claim about the user’s personality or “root cause.”
# 14. Next-Morning Follow-Up
A post-slip flow should continue once, the next morning. The morning check-in matters more than another late-night lecture. It should reinforce that the previous night ended and today is still completely usable.
Element
Copy / behaviour
Notification / card
“Morning after.”
Body
“Last night happened. Today still counts. Start with the next decision.”
CTA
Check in
If completed
Record the day-after return. This can contribute to the Rebound medallion.
If ignored
No punishment, no “you missed your recovery check-in” copy.
If current urge high
Open SOS, not another relapse explanation.
# 15. Worked Flows
## A. Just Slipped · Bed · Late Night · Phone · Urge 4/5
It happened. Log it while it’s fresh.
When? → Just now.
What was going on? → Tired. What set it off? → Phone in bed · Late night.
How strong is the urge to keep going? → 4/5.
Get out of bed. [I’m up]
Put the phone outside the bedroom for 15 minutes. [Phone is away]
Don’t fail twice. The day is not over. Don’t give one slip the rest of it.
The pledge still stands. [Sign it again]
Begin again. Slip logged · nothing else was reset. The rest of today still counts.
## B. Slip Earlier Today · Stress · Work · Urge 1/5
Log time → Earlier today.
What was going on? → Stressed. Set off by → Work / scrolling.
No emergency environment sequence.
Change for next time: block the feed for the next work block and write the next 15-minute task.
Slip logged.
Begin again.
## C. Second Slip Tonight · Home Alone · Bored · Urge 3/5
Do not show “Don’t fail twice.”
Title: Stop here.
The day is still recoverable. You can stop here and turn the next hour around.
Move to the least private safe room and leave the phone in another room.
Use a short physical/distance challenge if safe.
No pledge re-sign screen a second time.
Summary shows the repeat and the new friction rule.
Begin again.
## D. Slip Logged Yesterday · User Is Public Now
Log yesterday’s time and triggers.
Do not tell the user to leave the protective public setting or perform a conspicuous exercise.
Show one prevention change for the next risky window.
Finish without SOS reassessment unless current urge is elevated.
# 16. Variation Without Losing Consistency
## What Can Rotate
Layer
Keep fixed
Rotate
First acknowledgement
No shame; the slip is over and the rest of the day is still recoverable.
2–3 short opener variants.
Mandatory safety move
Close access / leave high-risk context when needed.
The follow-up challenge.
Trigger action
The objective (e.g. stop checking).
Exact task / duration where safe.
Pledge
Meaning stays the same.
Do not rotate into poetic copy; just show/skip based on eligibility.
Final screen
“Begin again” concept.
Small status line can vary by context.
## Approved Plain-Copy Variants
Moment
Variant A
Variant B
Variant C
Entry
It happened.
You slipped.
Okay. Stop here.
Body
The day is not over. Log it while it’s fresh.
This does not have to become the rest of the day. Record it, then move on.
Keep it simple. Log it now, then stop here.
Anti-repeat
Don’t fail twice.
End it here. The day is still yours.
Do not give it the rest of the night. You can still turn this around.
Final
Begin again.
Start again.
Back to today.
Do not rotate into motivational slogans. Variation should keep repeated flows from feeling identical, not turn the product into a quote generator.
# 17. Conflict-Resolution Rules
Combination
Override
Still open + any cause
Close access first. Everything else waits.
Urge 4–5 + any cause
Return to SOS action mode; delay reflection.
Second slip + “Don’t fail twice”
Replace with “Stop here.”
Night + leaving-home action
Filter out unless leaving is explicitly safe.
Tired + physical challenge
Prefer low-energy distance/device separation over hard exercise.
Public/work + manual old slip
Keep the protective setting; no conspicuous actions.
Rejected + argument trigger
No profile/message checking or replying for a fixed window.
No clear cause
Do not force interpretation; default to environment/device prevention.
Pledge shown already today
Do not make the user sign repeatedly.
Same reset action recently
Suppress it if another safe action exists.
# 18. Suggested Implementation Schema
## Compact Representation for Product Logic / Analytics
type SlipSession = {  entrySource: 'sos' | 'manual' | 'checkin'  happenedAt: timestamp  recency: 'just_now' | 'earlier_today' | 'yesterday' | 'custom'  currentState: 'stopped' | 'still_open' | 'unknown'  currentUrge: 0 | 1 | 2 | 3 | 4 | 5  repeatCount24h: number  location?: Location  feelingTags: Feeling[]  triggerTags: Trigger[]  contextFlags: { night, safeToLeave, mobilityOk, discreetRequired }  pledgeAction?: 'resigned' | 'kept' | 'changed' | 'skipped'  resetActionShown?: ActionId  resetActionCompleted?: ActionId  permanentChangeShown?: ActionId  permanentChangeAccepted?: boolean  nextMorningCheckinCompleted?: boolean  finalState: 'stable' | 'returned_to_sos' | 'exited'}
Store action IDs separately from the display copy. That lets copy evolve without losing the ability to learn which reset actions are completed and which are followed by fewer same-day repeats.
# 19. Medallion / Progress Interaction
If Black Box is still the one-off medallion for the first honestly logged slip, it may fire here, but do not interrupt the flow with a celebratory earned-medallion popup.
Record it quietly after the slip is saved.
Do not use confetti or congratulatory language.
The collection can show it later as part of the record.
The next-morning check-in can advance Rebound. Again, the point is return, not rewarding the slip itself.
# 20. Authoring Requirements
Module set
Approx. count
Notes
Entry / acknowledgement
3–4
Short, plain variants.
Repeat branches
3
First slip / second / third+.
Feeling modules
8–10
One action + one line.
Trigger modules
10–12
Immediate removal + next-window friction.
Location reset actions
Reuse SOS pools
Do not duplicate a new location system.
Pledge states
3–4
Show / keep / change / skip.
Final states
2–3
Begin Again + older-slip finish.
Next-morning follow-up
2
Normal + high-urge route.
Conflict rules
~10
Safety, repeat, context, anti-repeat.
# 21. QA Checklist
## Before Shipping the Post-Slip Flow
User-facing terminology is “slip” throughout; “lapse” and “relapse” do not appear randomly in the same flow.
If porn is still open, the first actionable instruction is to close it.
A recent 4–5/5 urge routes back to SOS action mode before more reflection.
The user is never told that all progress, the campaign, medallions, or lessons reset.
The app never congratulates the slip or uses confetti for logging it.
“Don’t fail twice” is only shown when it still makes literal sense.
Same-day repeat slips increase friction, not shame.
Pledge re-sign is not shown repeatedly in the same day.
The log screen asks only for information that will change advice or analytics.
The summary does not contain urge-specific text such as “Rode it out.”
Late-night branches never require the user to go outside when safety is unknown.
Tired users are not given stimulating exercise by default.
Public/work branches remain discreet.
Unknown cause does not trigger a forced psychological explanation.
Repeated patterns are described factually, not as diagnoses.
The final screen clearly communicates that the campaign continues.
Next-morning follow-up is supportive and can be ignored without penalty.
# 22. Canonical Decision Tree
## Single Source of Truth
START — user selects “I slipped” or manually logs a slip├─ Is porn still open / continuing?│  ├─ YES → CLOSE → REMOVE ACCESS → MOVE IF PRIVATE│  └─ NO  → continue├─ WHEN DID IT HAPPEN? → timestamp├─ WHAT WAS GOING ON? → feeling/state tags├─ WHAT SET IT OFF? → trigger tags├─ If recent → CURRENT URGE 0–5│  ├─ 4–5 → SOS emergency/command mode → reassess│  ├─ 2–3 → one reset action│  └─ 0–1 → continue├─ REPEAT COUNT 24H?│  ├─ 0 previous → “DON’T FAIL TWICE” + action│  ├─ 1 previous → “STOP HERE” + stronger friction│  └─ 2+ previous → minimal copy + access barrier + permanent friction later├─ PLEDGE ELIGIBLE?│  ├─ first slip since signing → re-sign / change│  └─ otherwise → skip├─ SLIP SUMMARY → include one change for next time├─ BEGIN AGAIN → campaign continues└─ NEXT MORNING → check-in / SOS if current urge high
## North-Star Test
At every screen ask: “Does this make another slip less likely, capture something we can use later, or help the user continue without throwing away the rest of the day?” If not, the screen probably does not belong in the post-slip flow.