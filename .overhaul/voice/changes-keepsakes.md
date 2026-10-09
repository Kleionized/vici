# Voice pass: keepsakes package

Changed 86 strings (84 rows below; two rows cover a string that appears twice) across 14 files: the medallion
album and its boards, the letter arrival boards and the chrome around both letters, Mail, the four journey
chapters, First steps, the locked weeks, Your vow, the journal editor, the sentence journal, Life Map and
Search. One of the 14, `src/components/onboarding/handover.tsx`, belongs to the onboarding package; its Week XII
board title was changed so both envelope boards say the same thing. `npx tsc --noEmit -p .` and `npx eslint` on
the changed files are both clean.

Every new string is the same length as the one it replaces or shorter, except for six:
"Read later" (was "Tonight", +3, a one-line ghost link), "No moods logged" (was "A quiet week", +3, a Mail
row line that already holds the longer "Your first full week"), "First urge ridden out" (was "First wave
outlasted", +1, a row title that wraps), "See the yearly offer" (was "Open the enclosure", +2, one centred ghost
line), Rebound's album cell "0 of 1 check-in" (was "0 of 1 morning", +1; Pulse's cell already shows the longer
"0 of 5 check-ins") and the Re-sign sheet's "The vow’s day count restarts. Your progress stays." (was 42
characters, now 50; the sheet body holds two lines, as the sign-out sheet's longer body does, and the extra words
say which count restarts).

| File | Before | After |
|---|---|---|
| src/components/keepsakes/Medallion.tsx (Veni, requirement (album cell, Earned once page)) | Finished onboarding | Finished setup |
| src/components/keepsakes/Medallion.tsx (Veni, quote on its board) | Nothing was asked of you yet. Just this: you stepped off the old shore. Everything since has been built on that alone. | You started. Everything else comes after that. |
| src/components/keepsakes/Medallion.tsx (First light, quote on its board) | Twenty seconds on an ordinary morning. Everything since has stacked on this. | One check-in on an ordinary day. Now do it again. |
| src/components/keepsakes/Medallion.tsx (Vidi, requirement (board and ladder line)) | Days Vici was opened and something recorded. | Days you opened VICI and logged something. |
| src/components/keepsakes/Medallion.tsx (Vidi, quote at Day 30) | Around here, “trying something” turns into “how you live.” | Thirty days on the record. This is how you live now. |
| src/components/keepsakes/Medallion.tsx (Vidi, quote at Day 90) | The long walk. By now the view is just… Tuesday. | Ninety days. By now this is what you do. |
| src/components/keepsakes/Medallion.tsx (Vidi, quote at Day 180) | Six months witnessed, one day at a time. Vidi only asks that you stayed on it. | A hundred and eighty days on the record. You stayed with it. |
| src/components/keepsakes/Medallion.tsx (Vidi, quote at Day 365) | A full year, witnessed. The campaign outlived the season it started in. | A full year on the record. Keep showing up. |
| src/components/keepsakes/Medallion.tsx (Vici, line under the name on its board) | Urges met and outlasted — the conquering half of the campaign. | Urges you rode out without a slip. |
| src/components/keepsakes/Medallion.tsx (Vici, quote at ×100) | A hundred waves met and outlasted. You know how this one goes. | A hundred ridden out. You know how this goes now. |
| src/components/keepsakes/Medallion.tsx (Vici, quote at ×250) | Two hundred and fifty. The sea keeps coming. You keep standing. | Two hundred and fifty. They still come. You still hold. |
| src/components/keepsakes/Medallion.tsx (Vici, quote at ×1,000) | A thousand. The sea hasn’t changed. You’re just not the one it moves anymore. | A thousand ridden out. Keep going. |
| src/components/keepsakes/Medallion.tsx (Breakwater, quote at ×1) | The first wave broke against you, not over you. | One overwhelming urge. It passed. You held. |
| src/components/keepsakes/Medallion.tsx (Breakwater, quote at ×5) | Five storms met at full height. The wall is real now. | Five overwhelming urges. None of them won. |
| src/components/keepsakes/Medallion.tsx (Breakwater, quote at ×10) | Ten overwhelming urges, none of them decisive. | Ten overwhelming urges. Each one passed. |
| src/components/keepsakes/Medallion.tsx (Breakwater, quote at ×25) | Twenty-five at full strength, and not one of them decided it. | Twenty-five overwhelming urges. You held every time. |
| src/components/keepsakes/Medallion.tsx (Breakwater, quote at ×50) | Fifty waves. The sea hasn’t changed. The wall did. | Fifty overwhelming urges, ridden out. |
| src/components/keepsakes/Medallion.tsx (Breakwater, count noun in the unearned album cell: "0 of 1 wave" / "0 of 1 urge") | waves | urges |
| src/components/keepsakes/Medallion.tsx (Rebound, quote at ×1) | You slipped. The next day you were back and checked in. No vanishing week. | You slipped. The next day you checked in anyway. |
| src/components/keepsakes/Medallion.tsx (Rebound, quote at ×10) | Ten bounces now. Ten is past the point where luck explains it. | Ten times, you came back the next day. That is not luck. |
| src/components/keepsakes/Medallion.tsx (Rebound, quote at ×25) | Twenty-five times down, twenty-five days back. The second number is the one that keeps up. | Twenty-five times down. Twenty-five times back the next day. |
| src/components/keepsakes/Medallion.tsx (Rebound, quote at ×50) | Fifty. Falling has stopped meaning anything except that you get up. | Fifty. You fall, and the next day you get up. |
| src/components/keepsakes/Medallion.tsx (Rebound, quote at ×100) | A hundred days after. Every one of them, you came back. | A hundred. Every time, you came back the next day. |
| src/components/keepsakes/Medallion.tsx (Rebound, count noun in the unearned album cell: "0 of 1 morning" / "0 of 1 check-in") | mornings | check-ins |
| src/components/keepsakes/Medallion.tsx (Logbook, quote at ×5) | Five logged. The point was never the outcome — it was writing it down at all. | Five logged. You wrote each one down. |
| src/components/keepsakes/Medallion.tsx (Logbook, quote at ×25) | Twenty-five entries. The log is long enough now to argue with a bad memory. | Twenty-five logs. Write it down every time. |
| src/components/keepsakes/Medallion.tsx (Logbook, quote at ×75) | Seventy-five. Every one of them is a moment you looked at instead of away from. | Seventy-five times, you looked at the urge and wrote it down. |
| src/components/keepsakes/Medallion.tsx (Logbook, quote at ×500) | Five hundred. The record is long enough to show you your own weather. | Five hundred logged, whatever the outcome. |
| src/components/keepsakes/Medallion.tsx (Pulse, quote at ×5) | Five check-ins. Twenty seconds each, and already a line on the chart. | Five check-ins. Already a line on the chart. |
| src/components/keepsakes/Medallion.tsx (Pulse, quote at ×75) | Seventy-five. Your ordinary is on the record now, so the unusual stands out. | Seventy-five. Now a bad day stands out. |
| src/components/keepsakes/Medallion.tsx (Pulse, quote at ×200) | Two hundred. This is the record of a life, kept a day at a time. | Two hundred. A record kept one day at a time. |
| src/components/keepsakes/Medallion.tsx (Pulse, quote at ×500) | Five hundred check-ins. Turning up stopped being a decision a long way back. | Five hundred check-ins. Showing up is a habit now. |
| src/components/keepsakes/Medallion.tsx (Black Box, quote on its board) | You wrote down the one you lost. That entry is what the next ten are built on. | You logged the slip instead of hiding it. Start from there. |
| src/components/keepsakes/Medallion.tsx (Lessons, quote at ×7) | Seven lessons in, a week’s worth. Early enough this still feels like homework. That won’t last. | Seven lessons, a week’s worth. Keep going. |
| src/components/keepsakes/Medallion.tsx (Lessons, quote at ×21) | A quarter of the course, done. More scaffolding built than it feels like. | Twenty-one lessons. A quarter of the course. |
| src/components/keepsakes/Medallion.tsx (Lessons, quote at ×42) | Halfway. The back half builds on everything the front half set down. | Halfway. The second half builds on the first. |
| src/components/keepsakes/Medallion.tsx (Lessons, quote at ×63) | Three-quarters through. What’s left is mostly deepening, not learning from scratch. | Three-quarters through. Finish what you started. |
| src/components/keepsakes/Medallion.tsx (Lessons, quote at ×84) | All eighty-four lessons, finished. The course has done its job. The rest is just living it. | All eighty-four lessons, done. Now live them. |
| src/components/keepsakes/Medallion.tsx (Archive, quote at ×10) | Ten entries in. A few specific paragraphs beat a hundred vague ones. | Ten entries. Keep them specific. |
| src/components/keepsakes/Medallion.tsx (Archive, quote at ×50) | Fifty entries. Read back, they show what a single day can’t. | Fifty entries. Read them back. |
| src/components/keepsakes/Medallion.tsx (Archive, quote at ×100) | A hundred entries. Your own weather, written down. | A hundred entries, in your own words. |
| src/components/keepsakes/Medallion.tsx (Archive, quote at ×200) | Two hundred. The record’s long enough now to argue with your own memory, and win. | Two hundred entries. Reread the first ones. |
| src/components/keepsakes/Medallion.tsx (Archive, quote at ×365) | A year of entries, one for almost every day. This is a diary of a life, not a habit tracker. | Three hundred and sixty-five entries. Keep writing. |
| src/components/keepsakes/Medallion.tsx (Return, quote on its board) | A week gone, and you came back anyway. Nobody was watching. That is the whole of it. | A week away, and you came back. Nobody made you. |
| src/components/keepsakes/Letter.tsx (Letter arrival board, caps line (also the medallion letter’s)) | Week {III} post | Week {III} |
| src/components/keepsakes/Letter.tsx (Letter arrival board, title) | The post is in. | A letter came. |
| src/components/keepsakes/Letter.tsx (Letter arrival board, line under the title) | A short letter from VICI — two minutes, worth keeping. | It takes a minute to read. |
| src/components/keepsakes/Letter.tsx (Letter arrival board, ghost link) | Tonight | Read later |
| src/app/medallion-post.tsx (Medallion letter, nav title over the card) | Enclosure from VICI | From VICI |
| src/app/medallion-post.tsx (Medallion letter, ghost link (opens /drop, the yearly offer)) | Open the enclosure | See the yearly offer |
| src/app/medallion-post.tsx (Medallion letter, title of the Journal entry Save to Journal writes) | VICI Post · A medallion | A medallion from VICI |
| src/app/letter.tsx (Post-slip letter arrival board, caps line) | Week {III} post | Week {III} |
| src/app/letter.tsx (Week XII letter arrival board, title (the handover's board, re-opened)) | A letter arrived. | A letter came. |
| src/app/letter.tsx (Week XII letter opened early, line under "Sealed until Week XII.") | It opens on Day {78} — {tomorrow / N days from now}. | It opens {tomorrow / in N days}, on Day {78}. |
| src/app/mail.tsx (Mail, weekly report row, verdict when no mood was logged that week) | A quiet week | No moods logged |
| src/app/mail.tsx (Mail, weekly report row, verdict when mood rose) | Steadier than the week before | A better week |
| src/app/mail.tsx (Mail, weekly report row, verdict when mood fell) | A heavier week | A harder week |
| src/app/mail.tsx (Mail, medallion letter row, title) | VICI Post · A medallion | A medallion from VICI |
| src/app/mail.tsx (Mail, medallion letter row, line) | {Vici}, Tier {I} · enclosure inside | {Vici}, Tier {I} |
| src/app/mail.tsx (Mail, post-slip letter row, line once saved to the Journal) | Resealed · don’t fail twice | Saved to your journal |
| src/app/mail.tsx (Mail, post-slip letter row, line before that) | Sealed · waits until it’s needed | Read it after a slip |
| src/app/mail.tsx (Mail, empty, title) | Nothing’s arrived yet. | Nothing here yet. |
| src/app/mail.tsx (Mail, empty, line) | A report lands here at the end of each week, and letters arrive along the way. | Weekly reports and letters from VICI come here. |
| src/components/journey/JourneyScreens.tsx (Chapter I (The Landing), line under the title) | Getting ashore — the vow, the first check-ins, the first wave faced. | The first week. Sign the vow, check in, ride out your first urge. |
| src/components/journey/JourneyScreens.tsx (Chapter I row "Seven mornings" and Chapter II row "The Landing", day range (it said "held" whether or not it was)) | Days 1–7 · held | Days 1–7 |
| src/components/journey/JourneyScreens.tsx (Chapter I, third row) | First wave outlasted | First urge ridden out |
| src/components/journey/JourneyScreens.tsx (Chapter II (The Crossing), line under the title) | Open water — the first hard weeks. Hold the pledge, ride the waves, learn your triggers. | The first hard weeks. Keep the pledge, ride out urges, learn your triggers. |
| src/components/journey/JourneyScreens.tsx (Chapter III (The Highlands), line under the title) | Thinner air, longer views — the habits hold under real stress. | The habits meet real stress. Hold them. |
| src/components/journey/JourneyScreens.tsx (Chapter IV (The Watch), line under the title) | The habit is yours. Now you keep the light on for the long run. | The habit is yours now. Keep it. |
| src/components/onboarding/handover.tsx (Week XII letter arrival board, title; onboarding package, changed so both envelope boards match) | A letter arrived. | A letter came. |
| src/app/first-steps.tsx (First steps, heading) | Six gentle first steps | Start with these six |
| src/app/first-steps.tsx (First steps, line under the heading) | No rush. These help VICI fit your life, and they open one at a time as you go. | One opens each day. |
| src/app/(app)/locked.tsx (Locked weeks, heading) | {11} more weeks ahead | {11} weeks to go |
| src/app/(app)/locked.tsx (Locked weeks, line under the heading) | You’ve finished week one. / The road carries on past the mist. | You’ve finished week one. / The rest come with {VICI Unlimited}. |
| src/app/vow.tsx (Your vow, line under the card once signed) | After a relapse you can re-sign the vow. It resets the promise, never the progress. | After a slip, sign it again. The vow’s day count restarts. Your progress stays. |
| src/app/vow.tsx (Re-sign sheet, line under "Re-sign the vow?") | It resets the promise, never the progress. | The vow’s day count restarts. Your progress stays. |
| src/app/journal-new.tsx (Journal entry editor, title field placeholder) | A quiet win | Title |
| src/app/journal-new.tsx (Delete entry sheet, line under "Delete this entry?") | It’s removed from your account for good. This can’t be undone. | This can’t be undone. |
| src/app/affirmation.tsx (Sentence journal, prompt 1) | Why are you choosing to abstain today? | Why stay clean today? |
| src/app/affirmation.tsx (Sentence journal, prompt 4) | Who benefits from the version of you that shows up today? | Who is counting on you today? |
| src/app/affirmation.tsx (Write your own prompt, line under the heading) | It’ll be waiting for you each morning. | It comes back each morning. |
| src/app/affirmation.tsx (Write your own prompt, field placeholder) | What does tomorrow-me get if today stays clean? | What do you get if today stays clean? |
| src/app/(app)/lifemap.tsx (Life Map, line under the heading) | Your anchor. The app brings this back to you when it helps. | Why you’re doing this. VICI reminds you after a slip. |
| src/app/search.tsx (Search, field placeholder and its screen-reader label) | Search the twelve weeks | Search lessons |

## Notes

- **What went.** The postal metaphor the owner flagged: "The post is in.", "Week III post", "enclosure",
  "VICI Post", "Sealed" and "Resealed". The sea, wall, shore and weather images in the medallion quotes and the
  chapter lines. Every em dash in visible copy. The "X, never Y" slogan on Your vow ("It resets the promise,
  never the progress"). Mood-setting and coaching words: "gentle", "No rush", "Your anchor", "tomorrow-me",
  "the version of you that shows up", "A quiet win".
- **Medallion quotes.** Each rung's line still says only what reaching that rung proves (the rule in the
  file's comments, D478). Most are now a count and one short line after it: a fact, or a push to keep going.
  Lines that were already plain stayed: Vici ×5 and ×25, Vidi Day 7, Logbook ×200, Pulse ×25.
- **Lines that were not true.**
  - The arrival board's "Tonight" did not bring the letter back tonight. Both ways out shelve the letter, and
    it stays in Mail, so the ghost now says "Read later".
  - "Days 1–7 · held" printed "held" whether or not the week was clean. It now says "Days 1–7".
  - "two minutes" was too long for letters of about 90 and 40 words. The board now says "It takes a minute to read."
  - Mail called a week with urges but no mood logged "A quiet week". It now says "No moods logged".
  - Mail called the post-slip letter "Sealed", but it opens from that row at any time.
  - "Twenty seconds" per check-in: the daily package now says a check-in takes two minutes, so durations
    are gone from the quotes.
  - Archive ×365 said "one for almost every day", but 365 entries can include several on one day.
  - The medallion letter's ghost opens `/drop`, the yearly offer, not the medallion (the medallion is already
    on the card, under the sign-off). It now says "See the yearly offer".
  - First light and Rebound count any check-in, morning or night, so "an ordinary morning" became "an ordinary
    day" and Rebound's album cell counts "check-ins", not "mornings".
  - Vidi counts days with something recorded, not calendar time, so its Day 180 line no longer says "Six months".
  - Your vow: "The count restarts" could be read as the programme's day count. Only the vow's "Held for N days"
    restarts, so both lines now say "The vow’s day count restarts."
- **Departures from the guide's example.** STYLE.md suggests "A letter came. It takes two minutes to read."
  I used its title, but wrote "a minute" for the reason above. The Week XII arrival board now uses the same
  title, "A letter came.", in both places it is drawn: the handover (handover.tsx, onboarding package) and
  `/letter?variant=week12`, which re-opens it.
- **Journal title.** "Save to Journal" on the medallion letter now files the entry as "A medallion from VICI",
  the same as the Mail row. Nothing reads this title back or compares it. Entries saved earlier keep
  "VICI Post · A medallion".
- **Mail verdicts** now form one set: "No moods logged", "Your first full week", "A better week",
  "A harder week", "A steady week".

## Left alone

- Medallion names (Veni, First light, Vidi, Vici, Breakwater, Rebound, Logbook, Pulse, Black Box, Lessons,
  Archive, Return). They are names, and they go into the share text.
- Chapter and stretch names (The Landing, The Crossing, The Highlands, The Watch, The Long Climb, The Pass,
  The Ridge, Home waters, Keeping the watch, The vow, renewed). They are names. The chapter titles are also
  used in the dev drawer (all.tsx), and the row labels double as React keys.
- Journal tags (Reflection, Urge, Lesson, Letter, Vow, Affirmation, Pledge). They are stored and compared.
- Life Map values (Connection … Courage). They are stored labels and chip keys.
- Search chips "urge", "sleep", "relapse". Each chip is the search query itself and is compared with it.
- Letter bodies, which the owner edits: letter.tsx P1–P4 and "So is the reason you started:",
  medallion-post.tsx P1 and P2, "Dear {name},", the "— VICI" sign-off, and the journal copies built from
  them. Also the post-slip letter's journal title "Don’t fail twice", which is the letter's own last line.
- Week names, week blurbs, lesson titles and lesson summaries on the week pages, the lessons browser, Search
  and First steps. They come from the curriculum.
- The Week XII arrival board's "Open" and "Save it for later". Its title changed (see above); its body,
  "From VICI, written as you at week twelve.", is the onboarding package's and stayed.
- Strings that already followed the guide: "One tier. Kept for good.", "Earned once", "Not yet. First at ×N",
  "Share this", "Back to medallions", "Save to Journal", "Sealed until Week XII.", "You haven’t signed the
  vow yet. Sign it when you mean it.", "Your name goes under it, dated today.", "Write freely. It stays in
  your account.", "Delete this entry?", "Nothing here yet.", the other three sentence-journal prompts, the
  Maya’s recital example answer, "If this goes well, what does a year from now look like?",
  "In your own words…" (a placeholder, not drama) and "Saved · update".
- Code comments, and the old copies of these strings in the dev-only kit lab (src/components/mono/lab/*).

## Review pass

An independent reviewer raised 17 points. 16 were applied:

- Medallion letter ghost: "See the medallion" became "See the yearly offer", and its row above now says what it
  opens.
- Medallion quotes: Logbook ×5 lost "What matters is"; Vici ×1,000 lost the "haven’t changed. You have."
  reversal; Archive ×200 lost the "Memory forgets. The record does not." aphorism; Vidi Day 90 lost "just";
  Breakwater ×25 now matches its neighbours; First light, Vidi Day 180 and Rebound's noun now say only what is
  counted. Breakwater's album noun "waves" became "urges" (the sea image the rest of the pass removed).
- Journey, Chapter III: "Real stress tests the habits. Keep them." read as "stress tests" at first, and three of
  the four chapter lines said "Keep". It is now "The habits meet real stress. Hold them."
- Your vow: both lines now name the vow’s day count.
- Locked weeks: "Unlock the rest to keep going." repeated the "Unlock VICI Unlimited" button under it. It now
  states the fact the button acts on: "The rest come with VICI Unlimited." (same length; `TIER_NAME`, so it
  follows the product name).
- Week XII arrival board: "A letter arrived." became "A letter came." in handover.tsx and letter.tsx, to match
  the other envelope board.

One was not applied, because it is a code change, not a copy edit:

- **For the owner.** An unearned medallion board (`/medallions/[key]?tier=none`, opened from "Still to earn")
  shows the face's first quote, so someone who has not earned First light, Black Box or Return reads "Now do it
  again", "You logged the slip instead of hiding it" or "A week away, and you came back". The board does this on
  purpose (`Detail Paper`, D274: the unearned board previews the first rung's line). If that should change, the
  board could show no quote, or the requirement (`face.ahead ?? face.blurb`), when `standing` is 0. That is a
  layout and logic decision, left for you.
