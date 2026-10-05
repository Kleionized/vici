# Lessons decisions — Vici Overhaul run, Phase 1 (D310–D319)

Merged into DECISIONS.md by the orchestrator. Files: `scripts/overhaul/gen-lessons.mjs` (new),
`scripts/overhaul/lesson-breaks.json` (new, measured input), `src/content/lessons.ts` (GENERATED),
`src/app/lesson/day/[day].tsx` (rewritten), `src/components/lesson/{LessonShell,LessonPages,LessonViz,LessonText}.tsx`
(new), `src/app/lesson-card/[day].tsx` and `src/app/task/[day].tsx` (redirects).

## D310 — The readers are generated from the 1,273 Week frames, one page per frame
`node scripts/overhaul/gen-lessons.mjs` (`--check` to verify) reads every `L<n>-Frame-<k>.html`, decomposes it
into the reader grammar of lessons.md §3 and fails on any residue: an unknown atom or band child, a chrome
that is not the shared one (✕, header, rail percent = `round(k/N·100)`, noise 0.06), a bottom control that
is not the page kind's (`Begin` / `Continue` / `Finish lesson` / `Done` / ring), a vertical gap outside
the §3.3 stops, an option density that does not follow the option count. The model is then checked
against `gen/lessons-v3.json` (titles, both quotes, section titles, every reading piece in order, all 33
visual payloads, the 32 questions and their answers, practice pieces, Done-when lines, the complete line)
— 84/84 equal, or the run fails. Pages are the frames 1:1 (the designer's `paginate()` is a DP over
measured line counts; the app never re-paginates). Where `gen/lesson-pool.json` disagrees with a frame
(L52 F8 hourglass, L68 F7 twoCups) the frame's `data-hero` is emitted. Fixed copy (`Begin`, `Part n`,
`Question`, `Best answer(s)`, `After choosing`, `Add a note (optional)`, `Today’s task`, `Done when`,
`Lesson complete.`) lives in the components. The multi-choice "Choose X [or Y] alone if it fits."
instruction is parsed into `exclusive` letters (8 of 10 multi questions).

## D311 — What the reader writes (lessons.md §12.3; D324 "Finish lesson records completion once")
`Begin` → `startLesson(day-NN)` (no-op if started/completed). A question's `Continue` → the choice as the
lesson's reflection, `{ q: 'A,C' }`, only when something is chosen. The reflect page's `Continue` → the
note, `{ q?, note }`, only when one is typed. `reflections:save` replaces the whole record, so every save
merges into what is already stored. `Finish lesson` → `completeLesson(day-NN)` only when the lesson is not
already completed (the mutation re-stamps `completedAt`, which would move Morning's "finished yesterday"
and the score day). `Done` and the ✕ close (`back()`, else `/(app)/today` — the card the old fallback
named is gone). Writes are fire-and-forget (`.catch(() => {})`), as elsewhere. The day's task is still
marked done where it always was (`dailyCheckins.dailyActionDone`: Today's check, Morning's question) — the
complete page says so ("One thing left today — the task.").

## D312 — Native line breaks for the readers (D332 applied)
Web states each run's own `text-wrap` (`balance` on display/title/label/compare label, `pretty` on the
rest, `nowrap`/`wrap` where the frame says), so a web capture breaks exactly as the frame. Native has no
`text-wrap`: `lessons.ts BREAKS` carries Chrome's lines for the 297 non-body runs whose balanced/pretty
breaks differ from greedy at the canvas width (titles, quotes, prompts, options, best answers, Done-when,
viz text; keyed `<ramp>|<text>`), joined with `\n` **only on a 393-wide screen at font scale 1**. The 230
body runs that differ wrap greedily on native (D332: "lesson body wraps greedily") — a one-word difference
at most, no line-count change (the only run whose line count changes, L68 F14's task title, is a title
and is in `BREAKS`).

## D313 — Band modes at runtime, and the keyboard
The stack is measured and the generator's thresholds applied to the real band (`screenH − (insetTop+86)
− 128`): ≤ band − 24 centre (with the 24 lift), ≤ band tall (lift dropped), else scroll (top-aligned at
140, scrolling to the screen's foot, content padded 152 so the last row clears the pill, under the
frame's 150 fade `rgba(13,13,13,0) → #0D0D0D 40%`, drawn as an SVG gradient). At 393×852 this
reproduces the canvas's three non-centre frames (L16 F11, L58 F12 tall; L7 F11 scroll) and on a short
phone gives every overflowing page the canvas's own answer (D320 rule 5). With the keyboard up (native;
the reflect page's note) the band rises until the stack's foot is 16 above the keyboard, never past the
band's top.

## D314 — Controls (none of it is drawn; the old reader's behaviour kept)
The pill and the 44 ring (kit `PrimaryButton`/`RingNext`, both `Next`/label-addressable) are real
buttons. A tap anywhere in the band does what the page's bottom control does (ring → next, `Begin`,
`Continue` on the best-answer page, `Finish lesson`, `Done`) — every page except the question (its rows
own their taps) and the reflect page (the note field); a drag scrolls instead. The band's press carries
`accessibilityLabel="Next"`, the ✕ `Close` (the word the old reader drew is gone). FadeIn 220 ms
bezier(0.2,0,0,1) per page and the rail's 320 ms `LinearTransition`, both off under reduced motion. No
back-a-page control (none drawn, none before); the stack's back gesture / Android back close.

## D315 — Undrawn option state (D322) and Continue
Every question frame is drawn with nothing chosen. Chosen: ink row, `#111111` text, the 24 mark a filled
`#111111` disc with the ink letter, no ring — same geometry, nothing moves. Single choice is a radio
(role `radio`), multi a checkbox set with the exclusive rule (`toggleChoice`): an exclusive letter clears
the others and any other pick clears it. `Continue` is never disabled — the frame draws it live with
nothing chosen.

## D316 — `/lesson-card/[day]` and `/task/[day]` are redirects; `?page=`
No frame in this drop draws either. `/lesson-card/<n>` → `/lesson/day/<n>` (the cover is the way in);
`/task/<n>` → `/lesson/day/<n>?page=task` (the first `Today’s task` page). Both keep the `day-` prefix
tolerance. `?page=<k>` (1-based, clamped) opens on frame k — Today's task row, the verification sweep and
the recipes use it. The cursor (page, choice, note) belongs to the lesson and deep link it was opened
with, so opening another lesson in the same component starts clean.

## D317 — Unknown lesson
`/lesson/day/999` draws the lesson ground and the ✕ (it rendered nothing — a blank screen with no way out).
Phase 2: the band also carries the kit's not-found state, `EmptyState` "Lesson not found" / "The course has 84
lessons." — the medallion routes' own pattern ("Medallion not found"), so a bad link says what happened instead
of showing an empty ground. The body is short enough to stay on one line at 375.

## D318 — Visualisations on other widths
Card inner width = screen − 64 − 40 (289 at 393). `track` computes `cw = inner/n`, `cx = round1(cw·i +
cw/2)` from it (the frame's own numbers at 393, incl. 254.1). The `wave` svg's viewport is widened to
`-2 -8 293 104` to hold what the frame's `overflow: visible` draws outside its 289×96 box (the dashed
marker from y −8, the curve's round cap past x 289) — native svg clips at its viewport — and scales with
the inner width. Compare cards are `flex: 1 1 0` (150.5 each at 375); pairs' fixed left columns
(112/64/44) still fit.

## D319 — Old reader code left on disk (deletion pending)
The rewrite orphans `src/components/lesson/{scroll,reader,pages,cover,coverL1,marks,scenes}.tsx` and
`src/content/{lessonReader,coverScene,readerRoom}.ts` (grepped: nothing outside that set imports them;
`lib/curriculum.ts` names `lessonReader.ts` only in a comment). Deleting them was refused by the session's
permission policy, so they stay, unimported, until the user approves the deletion. `lessonPlates.ts`,
`taskScenes.ts` and `src/components/task/*` are still imported by search, lessons-browser and the today kit
(CRITIC G13) and stay regardless.
