# deploy WP5 decisions: SOS, urges and slips (D460–D469)

Issues: F1, F2, F3, F4, F5, P4, S4 (the urge hub's "Last 30 days"), the urge, slip and lapse parts of B10, the Support doors
from B2, `/relapse` from U1, and Back Tap's "Test it now". Files: `src/components/urge/*` (adds `saving.tsx`),
`src/app/{urge,urge-hub,urge-log,slip,lapse,relapse,backtap,rough-first90}.tsx`, `src/lib/urgeSession.ts`,
`src/content/slipCards.ts`, and `triggersOf` in `src/components/logflow/data.ts`. Nothing in `convex/` changed: the events
table already accepts every field written here (`trigger`, `whatHelped`, `note`, `severityAfter`, `durationSeconds`, `reopens`),
and the mock store keeps whatever fields it is given, so both backends take the same writes.

## D460 — The urge hub rides a real urge
The hub used to write nothing. Now it opens the live urge session when it mounts, or starts and saves a new one, so its
twenty-minute ring keeps its own clock if the app is closed and reopened. One `urge_rode_out` is written when the urge is
ridden out, and there are three ways that happens. The three stages can run to the end, filed with "what got you through"
as "Breathing, number tap and odd one out". The ring can reach 0:00, filed as "Waited out the timer". Or the user can leave
the hub, by ✕, a swipe or Android's back, after the ring has run for at least a minute; that event carries no "what helped".
A visit shorter than a minute counts as looking, not riding an urge out: it just ends the session. The chosen chip becomes
the event's `trigger`. The duration is the ring's run, capped at twenty minutes. A strength is filed only when the session
came from an SOS where the user rated one.

At 0:00, or once the stages have finished, 85A goes quiet. The ring empties, its clock shows how long the urge ran, the line
reads "It passed", the head reads "It passed. / Logged as ridden out…", and the chips are put away. "I slipped" holds the
urge, uncounted, while the slip flow is open, and leaves its session saved. Only a logged slip ends it: the slip flow's
save calls `endUrgeInSlip`, which clears the session and notes the time in memory. Back on the hub, `slipLoggedSince`
decides what happens. If a slip was logged, a fresh urge starts, which is what 98F's "already watching again" means. If the
flow was left without logging ("Not now", ✕, back), the same urge carries on with its ring and chip, or 85A stays quiet if
it had already passed. If the ring ran out while the slip flow was open, a new urge starts and nothing is logged as waited
out, because the user said they slipped. `begin()` lets the old urge go before storage answers, so in that gap the clock
and the close cannot log a finished urge again. (Review fix.)

The hub never asks how strong the urge is, so "This one is intense." is said only for a rated urge. Without a rating the
line is "None has lasted past N minutes.", or nothing when there is no record. The head is "Change where you are." over the
frame's own "Stand up. Move somewhere with light."; "Get out of bed." was the frame's sample. 85D's rows show the stored
"what helped" or nothing. 85B's "Last 30 days" draws days before the programme's first day (`programmeStartKey`) as faint
rings and does not count them, and it counts slips with `isSlip`. With no pledge signed, 85E shows no card and says "No
pledge signed yet." (it used to quote the designer's line as the user's own).

## D461 — One urge session: resumed, or ended, never left lying around
`urgeSession.ts` now holds a version-2 session. It records only a strength the user gave, which door opened it, its reopen
count, the hub's chip, and the interrupt's answers so far. `openUrgeSession` resumes the live session, adding one reopen, or
starts a new one, and saves it straight away. The interrupt saves every answer as it is given, so `/urge` reopened within
twenty minutes of an app kill lands on the board it stopped at. `reopens` is written on the event. Every way out clears the
session: logged, ✕, a logged slip (from any door, so a session left by a killed app cannot hold back the letter that slip
queues), the hub closing, or the flow unmounting. The only session left behind is one the app was
killed in the middle of, and it lapses twenty minutes after it was last touched. Older sessions, which carried the default
strength 8, are dropped on read. So the (app) layout's `loadUrgeSession()` check, which holds back the letter, the post, the
report and check-in prompts, only fires for a genuinely live urge, and only until that urge lapses. That file was not
changed; it still only returns early and does not route to `/urge`.

## D462 — No swipe-back inside a one-route flow; Android's back steps back
`/urge`, `/rough-first90` and `/slip` set `gestureEnabled: false` through `<Stack.Screen options>` in the route component,
which Expo Router v56 documents for a page. `useStepBack` (in `stages.tsx`) listens for Android's back only while its
screen is focused, so Support or the vow pushed on top keep their own back. An open sheet's own handler still runs first.
In the interrupt, back goes to the previous board, or the previous stage inside the SOS, and leaves only from the intro or
the relief board, through `close`, which logs as D463 says. In the slip flow it is the flow's own `back()`, which goes back
the way the run came rather than walking a fixed list: 98K returns to 98J only if the pledge board was shown (otherwise to
the card, so nobody is shown a pledge they never signed or one a slip already broke), and 98L returns to 98K only after a
slip logged in this run. From 98E back leaves the flow, as ✕ does, so it never reopens answers that are already filed.
Over the unsaved board, back means "Not now". In the hub's stages it returns to the panes. (Review fix.)

## D463 — Only answers the user gave are stored
In the SOS, the strength starts with no bar lit. Continue waits for a pick, and "Skip this step" moves on with no strength.
Reassess also starts unlit; moving on without answering files no second read. The place is no longer pre-chosen: Continue
with none answers with the "somewhere less private" board and files no location. `severity`, `severityAfter` and
`location` are written only when answered. In the urge log, no bar and no outcome are pre-selected. Strength stays
optional (unrated shows "—"), but Continue waits for an outcome, because the outcome decides whether the entry is ridden out
or a slip. Closing the SOS logs what the user gave if they are past Reassess, re-rated the urge, or wrote the note. A first
rating alone is not logged, because the app cannot say how an urge closed that early ended.

## D464 — The SOS's answers reach the record, and "Done" means done
`urge_rode_out` now writes `trigger`: every "What's feeding it" reason, joined with `' · '` as the logs do, minus "I don't
know", which is an answer, not a trigger. Insights and the overview read `trigger`. `triggersOf` also reads
`precedingState.reasons` for older SOS urges that have no `trigger`. `whatHelped` is the stage the user ended on (Breathing,
Number tap, Odd one out, or Waited out the timer). The response boards' pill always says Continue, overriding the generated
file's "Done" (the override lives in `boards.tsx`, so a regeneration cannot undo it). Afterward says Continue. A second read
of "Gone" goes straight to the relief board. The intro says "Three small moves", because the flow has three. Afterward's
"The relationship doesn't need solving tonight…" is shown only to someone who picked "An argument". Everyone else sees
"Write down one thing you want to remember from this.", which promises no "tomorrow", because nothing in WP5's files shows
the note again (see notFixed).

## D465 — Writes never hold a screen
`saving.tsx`'s `useBackgroundWrite` runs a write behind a screen that has already moved on. After 8 s unanswered, the done
board says "Waiting for a connection… leave VICI open until then". Convex queues the mutation in memory and sends it on
reconnect, but loses it if the app is killed first. A refused write shows `UnsavedBoard` ("That didn't save." with Try
again, Not now, and ✕). `/lapse`, `/urge-log` and `/slip` use it. Their old awaits, with no catch, left "Logging…" stuck
forever. The SOS and the hub already fired and forgot, and they still do. In the logs and the slip flow, the letter and post flags
are set only after the write succeeds. In the slip flow, "Not now" returns to the board the user was on. From then on 98E
reads "Slip not saved. / It isn't on your log. You stopped all the same." instead of the frame's "Slip logged.", with the
same layout and type. The day's slip count leaves out this run's slip by matching it, not by subtracting one, so a write
that is still pending or was refused never undercounts 98G/98H/98I. (Review fix.)

## D466 — The Sound setting is gone
The app plays no audio and has no audio package, and WP5 may not install one, so Ocean / Rain / Silent did nothing. The row
is removed. The sheet's panel top moves from 420 to 510, exactly the height the row took, so Orb light and Background sit
where they did. `readSosSettings` keeps only the keys this build knows, so a stored `sound` is ignored.

## D467 — A way to a person from the SOS and the slip flow
Every dark SOS board (the hub's panes and all four stages, in both contexts) carries "Help" in the nav row's left slot,
styled like the kit's own text slot. Where the hub's back chevron sits, it stands just inside it, the way the gear stands
inside the ✕. The SOS's Low and Ashamed boards and the slip flow's Ashamed card carry a "Talk to someone" outline pill in
their stack. All of these push `/(app)/support`, so Support's Back returns to the board the user left. What Support lists
is WP6's (B2).

## D468 — `/relapse` is the slip flow; Back Tap tests the shortcut itself
`/relapse` was a four-board twin of `/slip` that logged a bare lapse. It now redirects to `/slip`. Back Tap's "Test it now"
opens `/urge`, the same route its shortcut link opens. The link is built from the app's own `scheme`
(`Constants.expoConfig.scheme`), so renaming the scheme (B6) carries through to it.

## D469 — The slip flow says what happened, and "Sign it again" signs
"Sign it again" now files a Pledge entry with the standing words, titled "Day N pledge" as the morning check-in titles it,
once per run and without blocking the flow. Because it is dated after the slip, the hub reads "Kept every day since" and the
next slip shows the pledge board again. 98E no longer says "and changed something for next time" or shows a "Change for
next time" row taken from a card the user never chose; the line is "You stopped, and you logged it." The unused `change`
field is removed from `slipCards.ts`. The lapse log's line is "Stopped and logged." and its `Changed` row, which printed the
day's lesson task, is gone. 98L says "Last night happened." only for a slip logged for yesterday evening, or when reached
directly; for yesterday daytime it says "Yesterday", and further back it names the weekday under "Today still counts." The
slip flow counts the day's slips and the slips since the pledge with `isSlip`.
