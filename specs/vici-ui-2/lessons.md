# Lessons — spec

Sources: `Vici UI 2/project/Week 01 Reset.dc.html` … `Week 12 Leave It Behind.dc.html` (1,273 frames labelled `L<day> Frame <k>`), and the app canvas's `84 · Lesson frame 1–14 of 14` (`Email Login.dc.html` artboards 374–387, lesson 1).
App: `src/app/lesson/day/[day].tsx` → `src/components/lesson/reader.tsx` (the reader for all 84 lessons), content `src/content/lessons.ts` and `src/content/curriculum84.ts` (regenerated from `Vici UI 2` by `scripts/vici-ui-2/gen-lessons.mjs` / `gen-curriculum.mjs`, owner's copy kept where the bundle left it, D28), heroes `src/content/heroes.ts` (D24).
Harness: `/lesson/day/<day>?page=<k>` with the `library-seed` account (`scripts/vici-ui-2/groups.mjs`).

## What changed in `Vici UI 2`

- The week canvases changed only in their hero drawings (`scripts/vici-ui-2/change-kinds.py`): every lesson frame's markup outside its `<svg data-hero>` is byte-identical to `Vici Overhaul`'s. The redrawn heroes are in `heroes.ts`, sized by their painted bounds (`HERO_PAINT_Y`, D24).
- Copy: none of the lesson copy changed between the bundles; the app's lessons are the owner's (lesson bodies are the owner's to edit, D28).

## The reader (unchanged rules, checked against the frames)

| element | value |
|---|---|
| nav | ✕ at left 22, lesson name 13/700 mute centred in the 60/40 row, progress rule under it (the lesson's share) |
| cover | hero at the frame's T (`HERO_BOX`), "Lesson N" caps over the 26/33 title centred, `Begin` at bottom 48 |
| body pages | hero box at its frame top, the paragraph 15/24 `#B5B0A8` in the centred column, the 44 next disc at bottom 48 |
| pick board / task options | the frame's own rows, at the metrics `lessonReader.ts` transcribes |
| close | the 84 check disc, "Lesson complete." 26/33, the line under it, `Done` |

Text runs follow the frames' line breaks (`wrapAs`, D13 / D32); tight lines carry CSS's half-leading (D40).
