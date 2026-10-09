# Deploy WP6 decisions: honest content and unfinished screens (D470–D489)

Issues: B2 (the Support page's content), P1, P2, P3, P5 (medallion, letter and handover copy, not the lesson files),
P7, D3, U2, U4. No schema change and no Convex change: every write goes through hooks that already exist on both
backends (`useCreateJournalEntry`, `useDeleteJournalEntry`), and old data is handled where it is read.

## D470 — Support points to one maintained directory
The Support page now offers a single resource: "Find a helpline near you", which opens findahelpline.com in the in-app
browser and falls back to the system browser. That site is a maintained international directory of free, confidential
crisis lines. A list of numbers built into a release would go out of date and would be wrong for most countries. The
emergency line names no number ("call your local emergency number"), and the page says plainly that VICI is a self-help
tool, not a crisis service or medical care. The owner should review and localise these resources.

## D471 — The cost boards use the frequency answer
The onboarding answer to "How often are you watching porn right now?" is now converted to days per 30. "More than once
a day" and "About once a day" count as 30, "A few times a week" as 13, "About once a week" as 4, "A few times a month"
as 3 and "Less than once a month" as 1. The 30-day dots, the one-year figure and the "By age 80" figure all come from
that number. The dots are spread evenly, with each one's exact position drawn from the designer's own random sequence.
If the question has no answer, the three boards are skipped, and "By age 80" is skipped for anyone aged 80 or over.
"Where you're predicted to relapse" now reads "At the rate you reported, if it held all year." The line boards are
captioned as an illustration, their tooltips say "Same, or more" and "Less often" in place of the invented 5× and 2×,
and "Relapses get more frequent, not less" is gone. Mock captures taken with the sample answers will now show 13 dots,
not the frame's 9.

## D472 — A blank name drops the greeting
When no name was given, the Start board drops the "Sam, " prefix and opens with "Let's figure out…". This was the
smaller of the two fixes the brief allowed: it keeps the Name step optional (an Apple sign-in may share no name)
instead of blocking the funnel.

## D473 — Plan boards show only the user's answers
"This is where we'd start" shows only the times the user ticked, up to three. It says "These came up together" for two
or more and "This came up in your answers" for one. The evidence sentence and the Your Plan rows quote only answers the
user gave. An unanswered picker, or "Nothing obvious", is left out, and the default change (phone out of bed, offered
when none of the user's signals has a board of its own) is never presented as one of their answers. "What You Want
Back" shows only the user's picks, and no pills at all if they picked none.

## D474 — The vow is stored when signed and read back as signed
Signing the onboarding vow now files a `Vow` journal entry with the words actually signed (`VOW_TEXT`). It is written
at the end of onboarding, along with the letter, so that going back and choosing "Not now" undoes it. `/vow` reads only
`Vow` entries, so the morning's daily pledge can no longer appear there or reset the count. With no vow, the page shows
the vow VICI offers, unsigned and without a name, under "Not signed yet", and the ghost link signs it. "Held for" counts
calendar days since the newest signing. Re-signing after a slip restarts it, as the page says, and nothing else does. On
a day already signed, the ghost link's place reads "Signed today" as plain text (D487).

One link now lands somewhere else, and it is not mine to fix. In the slip flow, "The pledge still stands" shows the
user's pledge, and its "Read my pledge" ghost link still opens `/vow` (`src/app/slip.tsx`, WP5's file). Before this
change `/vow` fell back to the newest pledge, so the words matched. Now the link shows the vow, or "Not signed yet".
The fix belongs in `slip.tsx`: point that link at the Journal (`/(app)/journal`) or at the pledge entry itself.

## D475 — The sample pledge is never read back as the user's
`standingPledge` now skips "The mornings are mine again.", the frame's sample. The morning check-in has been filing it
as the user's first pledge. Today, slip and anything else that uses `standingPledge` therefore shows its "write a
pledge" state until the user writes one of their own. The morning check-in still pre-fills and files the sample, and
the urge hub and `/relapse` still fall back to it. Those files belong to other workstreams (see notFixed).

## D476 — Canned letters say they are from VICI
The week-XII letter is the same for every user, so it now arrives "From VICI, written as you at week twelve." Its
eyebrow reads "From VICI · as you at week XII", and it is saved as "A letter from week XII", signed "— VICI, written as
you at week XII". The old title, "A letter from the man at week XII", ignored the gender question. The post-slip letter
is signed "— VICI" and no longer assumes it is morning. It claims only what is true of any account, which is that
earlier records are still there. Mail lists it as "A letter from VICI", not "A letter from day zero".

## D477 — No machine-made "why", and no feelings stored as values
Onboarding no longer writes anything to the Life Map. The questionnaire has no "why" question, so the sentence built
from two chip answers is not written. The feelings a user has before watching ("Horny", "Bored") are not saved as their
values. Accounts that already hold that data are handled when it is read: `ownWhy()` treats the old assembled sentence
as no reason at all, and Life Map hides the onboarding feeling words. The post-slip letter quotes "the reason you
started" only when the user wrote one in the Life Map, and otherwise leaves the sentence out.

## D478 — Medallion lines say only what the rung proves
Rung lines that invented a record, a statistic, a mechanism, a comparison or a feature were rewritten. Examples:
"Seven check-ins, two waves ridden", "the strongest predictor there is", "Each one shortens the next", "better than
most people", "The patterns page" and "The app knows your ordinary". The other lines keep the frames' wording. The
medallion post now says only what its trigger proves: an urge was logged and ridden out. "Most men vanish for a week",
"the strongest predictor" and "Last night … This morning" are gone. The ladders, Rebound's included, and the post's
enclosed tier are unchanged; those are the owner's calls (S5, S6).

## D479 — Back on the first question offers sign-out
Back on "What should we call you?" now opens a sheet titled "Use a different account?". It shows the signed-in email,
with "Sign out" and "Keep going". Signing out cancels reminders, ends the session and returns to `/`, so the login
screen works again. This replaces dropping a signed-in user onto a login that Clerk refuses. Hiding Back was the other
option, but it would have left a user who signed in with the wrong account no way out.

## D480 — Profile: the monogram stays, the dead controls go
"Change photo" and its three-row sheet are removed. No photo pipeline exists and every row only closed the sheet, so
the monogram is now a display disc. The "Username" row is removed because the app has no usernames and the row showed
part of the email. Email is a display row with no chevron. Name keeps its chevron because it opens the name sheet.

## D481 — "Past pledges" becomes "Journal"; entries can be deleted
That list is the only place pledges, vows, night reflections and VICI's letters can be read, so it keeps all of them
and is retitled "Journal" (the review drawer's row too). Letters and vows open read-only, since editing them would
change what was sent or signed. Any existing entry can be deleted through "Delete entry", confirmed in the sign-out
sheet's shell ("Delete this entry?" / "Delete" / "Keep it"), using `useDeleteJournalEntry` on either backend. Today's
☆ ring is still labelled "Past pledges" in `today.tsx`, which belongs to another workstream.

## D482 — A not-found page in the kit, and `/sso-callback` goes home
`src/app/+not-found.tsx` is a kit statement board: the signpost hero, "This page doesn't exist.", one line, and
"Back to Today", which goes to `/` so the index can route by sign-in state. On Android, `/sso-callback` is where Clerk
can return the app after social sign-in. That path redirects straight to `/`, because the auth session completes by
itself and a user who has just signed in should not be told the page is missing.

## D483 — The dev routes redirect in release builds
`/all` (the review drawer) and `/kit-lab` now redirect to `/` unless the build is `__DEV__` or
`EXPO_PUBLIC_FORCE_MOCK=1`, which is the same rule as the drawer's long-press door. `/kit-lab` with no replica named
also redirects, rather than showing a blank screen with no way out.

## D484 — `?week=` must name a real week
The weekly report and the "Report ready" board accept `?week=` only if it is a real calendar date (`2026-02-31` fails
the round trip) and not in the future. The value is then normalised to that week's Monday. Anything else falls back to
the latest closed week. This tightens the format check an earlier workstream had already added.

## D485 — The post and Mail count weeks by the programme calendar
`postWeek()` (the "Week N post" caps line) and Mail's list of weekly reports now count from the programme start using
the shared calendar helpers in `src/lib/day.ts`, as `/letter` and the weekly report already did. Before, they counted
24-hour blocks from account creation. This keeps the screens I touched consistent with the day model; the model itself
is unchanged.

## D486 — A deleted entry stays on screen until it has gone
Both backends drop the entry from the live journal list before the delete call returns. The editor used to look the
entry up in that list, so for a moment it became the new-entry editor, with today's time, a Save button and no
"Delete entry", and a letter or vow briefly showed as editable fields. `journal-new.tsx` now holds the entry it is
deleting and draws from that copy until the screen has closed. Closing first and deleting afterwards would not have
been enough, because the screen stays on view through the back animation.

## D487 — "Signed today" is text, not a button
`GhostLink` always renders a button, so screen readers announced "Signed today, button" for a tap that did nothing.
On a day the vow is already signed, the page now shows "Signed today" as plain text with the ghost link's type, colour
and position. The kit's `GhostLink` is unchanged, since it belongs to another workstream.

## D488 — The sign-out sheet in onboarding grows with the email address
The "Use a different account?" sheet reuses the sign-out sheet's shape, which has room for a one-line title and a
two-line body above the pill. Its body includes the email address, and a long one, such as an Apple Hide My Email
address, pushes it to a third line that ran under "Sign out". The body is now measured, and the panel rises by
whatever it adds, as Settings' own sign-out sheet already does.

## D489 — "Save to Log" becomes "Save to Journal"
The post-slip letter and the medallion post both offered "Save to Log". Saving files a Letter entry, which the Journal
lists and the Log never shows, so the button promised a place the letter would not appear. Both buttons now read
"Save to Journal". The layout and type are the frame's. The old verification drives in
`.overhaul/verify/medallions-letters/drv/` still tap "Save to Log" and will need the new label if they are run again.
