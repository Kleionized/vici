# Every screen's way back

The ask: make sure a page that needs a back button has one, drawn the same way
as the rest of the app.

## The standard row

`BackChevron` (`src/components/ui/ScreenHeader.tsx`) — an 11 × 19 chevron,
`M9.5 1.5L2 9.5l7.5 8`, 2.4 stroke, round caps, followed by a 17px "Back", sat
at left 16. `BackGlyph` is the same chevron where a screen draws its own row,
and `PaperAuthBack` is the auth screens' copy of it. The file states the one
exception: *"a bare arrow only appears over artwork, where the label would be
unreadable."*

## How the audit was done

Reading the route files alone was not enough — several screens keep their back
row in a component next door, and following imports one level over-corrects,
because `@/components/ui` is a barrel that exports `BackChevron` to every
screen that imports anything at all.

So the real check ran in the browser: for each of the 54 non-tab routes, look
for a pressable in the top 96pt and record its label and whether it draws the
standard chevron. That reads what a person actually sees.

## What it found

Three screens had no way out in the top band.

| Screen | Was | Now |
| --- | --- | --- |
| `(auth)/sign-in` — the landing board | nothing at all | the standard row |
| `(app)/support` | a "Back" **button under the resource list** — on a screen someone opens in a bad moment, you had to scroll past every card to leave | the standard row at the top, button kept |
| `(app)/lifemap` | only "Done" top-right, which saves and exits | the standard row, "Done" kept |

## Checked and deliberately left alone

| Screen | Why |
| --- | --- |
| `today` · `log` · `library` · `all` | the four tabs — the bar is how you leave them |
| `index` · `(auth)/splash` | a redirector and the auth root; nothing is behind either |
| `score` | a **bare** chevron over dark artwork — the documented exception, and the label would be unreadable there |
| `affirmation` | a sheet: its dimmed backdrop is the dismiss, and the canvas frame (`21C · Sentence Journal`) draws no close control |
| `journal-new` · `search` · `lessons-browser` | "Cancel" — the right word for an editor, a search and a modal browser; changing it to "Back" would say the wrong thing |
| `letter` · `drop` · `medallion-post` · `report-ready` · `first-steps` · `paywall` · `relapse` · `urge` · `rough-first90` · `rough-protocol` · `lesson-card` · `task` · `lesson/day` | a Close — these are flows and deliveries, not places you navigate into |
| every other pushed screen | already drew the standard row |

## The judgement call on sign-in

The canvas draws **no** Back on `Login Typing`, because it composes that frame
as the app's first screen — and on a cold start it is: the splash `replace`s
into sign-in, so nothing is behind it. But sign-in is also *pushed* from All,
and a pushed screen with no back row strands you.

So the row appears when it has somewhere to go:

- pushed from elsewhere → it goes back there;
- no history, but the field is in play → it returns to the board's starting
  point, which is the same stepping-back its password and code steps already do;
- no history and nothing typed → hidden, because a control that does nothing is
  worse than none.

Verified in the app: absent on the cold landing, present once you type, and it
returns you to the SSO choice.
