
## D155 — the week scenes' blurred solids are blurred, not sampled (D082's method retired here too)

D082 redrew every `filter: blur(r)` on a solid in `WeekScene` as a radial ramp fitted to the
Gaussian, because the file had no blur primitive. D113 retired that method for `TaskScene` on the
strength of D063 — `react-native-svg` 15.15.4 carries `<FeGaussianBlur>` on web, iOS and Android —
but said in terms that "D082 still stands for `WeekScene`, which has not been changed". It is
changed now: the ten blurred solids across the twelve scenes are the canvas's own shape under
`feGaussianBlur stdDeviation = r`, since `filter: blur(r)` states σ directly.

D082's two observations are why the radial was wrong and they still hold — a solid thinner than its
own blur never reaches its stated alpha, and the falloff carries on well past the box. Modelling
them by hand got close; drawing them gets them exactly. Design against app inside each shadow's own
box, 8 × 8 block means at 2/255:

| layer | sampled radial | real Gaussian |
| --- | --- | --- |
| week I flag shadow, 56 × 10 under blur(4) | 25/180 blocks over 2, worst 5.0, mean 0.732 | **0/180, worst 0.1, mean 0.002** |
| week X glow, 30 × 44 under blur(6) | 45/285 blocks over 2, worst 4.6, mean 0.929 | **0/285, worst 0.0, mean 0.000** |

Two consequences beyond the pixels. The filter region has to be stated in user space — 3σ + 2 all
round — because the default is 10 % of the bounding box and clips a 4pt blur inside its own bloom
on a 10pt-tall shadow. And the filter needs `color-interpolation-filters="sRGB"` (FINDINGS F43),
since SVG filters compose in linearRGB and CSS's `filter: blur()` does not.

**D082's standing signature mismatch is withdrawn with its method.** The ellipse is drawn at the
box the canvas states, so the ten rows that used to report 2σ wider and taller than the frame's own
div now land on it: `sigdiff` went from one MISSING row per blurred solid to none, on all twelve
scenes.

## D156 — a spread lies wholly outside the border box, and the hulls' rings straddled the edge

D111 established this on `TaskScene`; it was never applied to `WeekScene`, which stroked the box
path with `strokeWidth = spread` centred on the edge. Both boats' hulls carry
`0 0 0 1px rgba(0,0,0,0.05)`, so half a device pixel of the ring sat inside the hull instead of
outside it. The stroked silhouette is now grown by half a spread, each non-zero corner radius
grown with it and each square corner left square.

The same pass applies D117 here: `clip-path` clips a box-shadow away with the rest of the element,
so **a layer that states a clip draws no outer shadow**. Both weeks' near sails state
`0 1px 2px rgba(0,0,0,0.06)` under `polygon(100% 0, 100% 100%, 0 100%)` and the canvas draws
neither. Pass 1's code claimed to draw them and did not: its pattern was
`/^(-?[0-9.]+)px? …/`, where the `?` binds to the `x` alone and so demands a literal `p` on the
first length — `0 1px 2px` could never match it. The pattern is repaired and the branch is gated on
the clip, which is the only pairing that is right both today and for a layer a later drop draws
unclipped.

**One measurement worth keeping, because it looks like a regression and is not.** Week VII's hull
sits at canvas y 358.04–367.34. Chrome snaps the design frame's DOM box to whole CSS pixels
(D083) and the app's SVG rect is not snapped, so the two edges round in opposite directions: after
the fix the hull's **top** edge is exact — every device row from 356.5 to 359.5 at Δ 0, where it
was Δ 13 and Δ 12 — and its **bottom** edge is 0.34pt out where it had been 0.16pt out by luck.
Whole-frame, both boats improve clearly: pixels over 8/255 fall from 491 to 328 on week VII and
from 845 to 445 on week XII. The rule is right; the residue is D083.

## D157 — the P2 frames draw a shadow a scrolling board cannot show without also showing a pip it omits

`Week II … P2` is the only frame in the family whose top card is the **current** lesson: the seed
is day 12 and week II holds days 8–14, so day 12 is that week's row 05, which is the first row the
P2 scroll position brings to the top. A current card carries
`0 0 0 2px #131313, 0 10px 24px rgba(40,38,32,0.12)`, and the canvas paints that second shadow's
upward spill in the band from canvas 472 to the card's ring at 484 — measurably: 240,239,236
against the page's own 244,243,240.

The app's row column is a scroller and it clips at 484, so that band is paper. To show the spill
the clip would have to open to 472 or above — and the 04→05 pip pair sits at 467 and 475 at this
scroll position, so anything at or above 478.5 puts the lower pip on screen, which the P2 frame
does not draw. **No clip position satisfies both.** The frame is a static composition of a board
that scrolls, and it has drawn a shadow whose source is off its own top edge while drawing nothing
else that would be.

**Taken: the clip stays at 484.** Hiding the pip costs Δ 4/255 over a 393 × 12 band (3,758 device
pixels over 2/255, and **0** blocks over 3/255 at 8 × 8 means, i.e. invisible to the block
instrument); showing it would cost Δ 44/255 over about 28 pixels of hard-edged dot where the frame
draws paper. This is the same class of judgement as D084 and it points the same way: where the
canvas's static frame and a real scroller disagree, follow the frame's *visible* seam.

## D158 — a nested `<svg>` reports its ink box, so five bird rows read MISSING while the art is exact

The canvas draws its birds as inline `<svg>` elements with their own `width`/`height`, and the
probe reads those as layout boxes: `svg | 132 | 274 | 16 | 8`. The app draws the whole scene as one
`<Svg>`, so each bird is a **nested** `<svg>` inside SVG content, which has no CSS box —
`getBoundingClientRect` returns the union of its rendered content instead, `svg | 133 | 277.5 | 14 |
2.5`, collapsing onto its own path row. `sigdiff` therefore lists five svg rows as MISSING in app
across weeks VIII, IX and XII and their P2s.

It is a measurement artefact of the structure, not a defect, and it is not fixable in the probe
without special-casing a legitimate reading. The row that carries the parity is the **path** row
underneath, and those match on both sides to 0.1pt (week XII's pair: 133,277.5,14,2.5 and
160.8,265.1,11.4,2.1, identical). The pixels settle it: the 56 × 30 box holding week XII's two
birds is **byte-identical** between design and app — 6,720 pixels, worst Δ 0.

Recorded so the next audit reads those five rows as known rather than spending a session on them.
It is the SVG trap of the brief with the sign reversed: the numbers look wrong and the art is right.
