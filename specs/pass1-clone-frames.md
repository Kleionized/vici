# Pass 1 — the four clone frames

`Settings Weekly Report` (93D), `Settings Check-in Time` (92B),
`Morning Check-in Time` (19B), `Nightly Check-in Time` (19C).

Audited by hashing each clone against the frame it clones and diffing every
text run, rather than by re-reading two near-identical boards by eye.

| Frame | vs | Bytes | Every difference the canvas draws | App | |
| --- | --- | --- | --- | --- | --- |
| `Settings Weekly Report` | `Weekly Report` | 9709 / 9696 | one text run: `Settings` where the base draws `Back` | `weekly-report.tsx:50` — `from === 'settings' ? 'Settings' : 'Back'`, passed to both `BackRow` call sites (`:86`, `:145`) | match |
| `Settings Check-in Time` | `Nightly Check-in Time` | 6669 / 6664 | one text run: `Settings` where the base draws `Back` | `night-time.tsx:36` — same param, passed to `RoutineBack` via `backLabel` | match |
| `Morning Check-in Time` | `Nightly Check-in Time` | — | title `When should the morning check-in come?`; the wheel at rest on 4–10 / 57–03 rather than 7–1 / 27–33; footnote `Twenty seconds, first thing — you can change this any time.` | `morning-time.tsx:37` title verbatim; `:38` footnote verbatim; the wheel is the app's looped column, which renders its own rest position from the stored time | match |
| `Nightly Check-in Time` | — | — | title `When should the nightly check-in come?`; footnote `Set it for the start of your riskiest hours — you can change this any time.` | `night-time.tsx:38`, `:39` — both verbatim | match |

Everything else on all four frames is byte-identical to a base frame that has
already been through Pass 1, so no property is unchecked: the hash proves the
set of differences is complete, and each difference is accounted for above.

**Findings: none.** The em dash in both footnotes is the real character in the
app where the canvas writes `&mdash;`, which is the same glyph.

The one canvas contradiction already recorded stands: `Settings Check-in Time`
declares `letter-spacing` twice on its CTA (0.3px then 0.2px). Last wins, and
the app uses 0.2.
