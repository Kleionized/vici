# The reader: scrolling, motion, and room to breathe

## Scrolling, per page

The canvas draws every page at 852 and centres it. The app was doing the same
with a fixed box — so a page taller than the screen simply had its ends off it,
with no way to reach them. A task page is a title, a sentence, a 190pt scene and
a rule card at gap 30; on a 667-tall phone that does not fit.

Each page is now a scroller whose content **centres when it fits and moves when
it does not**:

```
contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 38, paddingVertical: 72 }}
```

`flexGrow` with a centred main axis keeps a page that fits exactly where the
frame centres it. Measured: a cover on a 812-tall screen reports content 812 in
a scroller of 812 — it does not move. On a 420-tall screen the same page reports
610 of content and scrolls 189.

The 72 top and bottom is what clears the chrome — the Close row and rail take
the first ~56, the chevron the last ~54. It is **symmetric on purpose**: equal
padding leaves the midpoint exactly where the frame puts it, so nothing that
fitted before has moved.

### Two things this turned up

- **The scroller cannot depend on a measured height.** The first version took
  the height from an `onLayout`, which is `0` on the first paint — the scroller
  opened one status bar tall with the page already scrolled out of it. It is
  pinned to all four edges instead, so it needs no measurement.
- **The board pages had to come out of the stack.** The pick and task-options
  boards state their own top and foot, so inside a scroller their absolute tops
  would resolve against the scrolling content. They render in an `overlay` slot
  over the scroller now — which also **corrected a 54pt misplacement**: they had
  been positioned from the screen's top rather than from below the notch, so
  every board sat a status bar too high.

The options board scrolls inside its own band as well: five rows and a closing
note is taller than the frame's band on a short screen.

## Motion

| | what | why |
| --- | --- | --- |
| page change | `FadeIn`, 220ms, `cubic-bezier(.2,0,0,1)`, keyed on the page | each page arrives, instead of the words swapping under the reader mid-sentence |
| progress rail | `LinearTransition`, 320ms, same curve | it is the one part that shows progress; a step it animates through reads as progress, a jump reads as a redraw |
| screen push | `slide_from_right`, 260ms, gesture enabled, set once on the Stack | the default varies by platform and by presentation, which made the app feel assembled rather than designed |
| press | unchanged — `scale(0.99)`, 110ms in, 160ms out | the canvas declares this on all 62 of its pressed states and never any other value |

The page's own press target is `static`: scaling a whole page of type on touch
reads as a glitch rather than as feedback.

**Reduced motion is respected.** `useReducedMotion()` drops the page fade and
the rail transition; the reader still works, it just cuts.

## Spacing

The gaps between a page's parts — 48 reading, 36 cover, 30 task, 44 done — are
the canvas's own and are unchanged. What was missing was room around the page,
not within it: content could sit under the rail or behind the chevron. The
symmetric 72 fixes that without touching the design's internal rhythm.
