# SOS response boards — `SOS Loc *`, `SOS Feel *`, `SOS Trig *` (30 frames)

* **Design frames** `Email-Login/SOS-Loc-{Bed,Bathroom,Home-Alone,Private-Room,Work,Public,Elsewhere}.html`,
  `SOS-Feel-{Turned-On,Bored,Lonely,Stressed,Anxious,Angry,Low,Rejected,Tired,Restless,Numb,Ashamed,Unknown}.html`,
  `SOS-Trig-{Content,Doomscroll,Fantasy,Late-Phone,Habit,Cant-Sleep,Argument,Rejection,Alone,Unknown}.html`
* **App file** `src/components/urge/index.tsx` → `ResponsePage`, `SosSceneLayer`;
  content in `src/content/sosResponses.ts`
* **Sibling** `specs/104-sos-challenge.md` — the thirty-first board, the same
  shape with a challenge card in it

This is a content family, and `DECISIONS.md` D008 rules how one is handled: the
template is specced once and every frame is parsed and diffed field by field.
Both halves are below.

---

## The template

All thirty frames are one composition. Read in full with `body.mjs`; the
structural signature is identical on all thirty apart from the scene's layer
count.

| element | canvas | app |
|---|---|---|
| frame ground | `#F4F3F0` | `PaperSheet` |
| sheet | `left:0 right:0 top:52 bottom:0 background:#F4F3F0 overflow:hidden`, **square top** | `PaperSheet`, since `UI Final 1` squared it |
| close ✕ | `right:22 top:18`, `viewBox="0 0 20 20"` 20 × 20, `d="M3 3l14 14M17 3L3 17"`, `stroke #55534E` at 2, round caps | `SheetClose` |
| art box | `left:76 top:180 240 × 220`, with an `inset:0 overflow:hidden` clip child | `left: 76, top: 180, width: 240, height: 220, overflow: 'hidden'` |
| headline | `left:36 right:36 top:434`, centred, `23px/500`, `letter-spacing 0.1`, `line-height 30`, `#1D1C1A`, `text-wrap: balance` | same |
| body | `left:44 right:44 top:480`, centred, `15.5px/400`, `line-height 23`, `#55534E`, `text-wrap: pretty` | same |
| pill | `left:24 right:24 bottom:88 height:54 radius:27 #131313`, label `16.5px/600`, `letter-spacing 0.2`, `#FFFFFF` | same — note **16.5**, half a point under the flow's 17 |
| "Give me another" | `left:0 right:0 bottom:44`, centred, `15px/500 #8B8882` — on the **thirteen** `SOS Feel *` frames and on none of the seventeen others | same |

`text-wrap: balance` and `text-wrap: pretty` have no React Native equivalent and
are not implemented; RN's line breaker is not configurable.

### The scene's layer vocabulary

239 layers across the thirty, and every one of them is one of:

| kind | canvas | app |
|---|---|---|
| solid box | `background:#RRGGBB` + `border-radius` | a `View` |
| gradient box | `background:linear-gradient(180deg, A, B)` | `LinearGradient` |
| radial wash | `background:radial-gradient(closest-side, A, A0 N%)`, usually with `filter:blur(4px)` | `SoftBlob` at the same stop — a closest-side radial already dies at its own edge, so the blur term is dropped (D010) |
| blurred solid | a flat colour under `filter:blur(5px)` | the same falloff in the layer's own colour — the blur *is* the shape |
| `border-radius: 50%` | a percentage | half the box's shorter side (D015) |
| `border-radius: a b c d` | four corners, sometimes mixing `%` and `px` | resolved against the box, four corner props |
| `border-radius: a b c d / e f g h` | an elliptical corner — three layers | drawn as an SVG arc; React Native cannot express it at all (D015) |
| `transform: rotate(Ndeg)` with `transform-origin` | eight layers, four of them pinned to an edge | `transform` plus `transformOrigin`; CSS rotates about the centre and so does RN, but four of these do not |
| a CSS border triangle | `width:0 height:0` with two transparent borders and one coloured — four layers | an SVG polygon; React Native has no equivalent |
| `box-shadow` | seventeen layers | `boxShadow` |

---

## Content — every field, every frame

Every string, layer, colour, radius, transform and triangle in
`src/content/sosResponses.ts` is **read out of the frames** by
`scripts/uifinal1/gen-sos-responses.mjs`. Nothing is transcribed by eye, so the
field-by-field diff D008 asks for is a re-read:

```
node scripts/uifinal1/gen-sos-responses.mjs | diff - src/content/sosResponses.ts
```

returns nothing — the committed table is byte-identical to a fresh read of all
thirty-one frames. The same holds for `src/content/sosPickers.ts` against the two
picker frames.

---

## Comparison — design frame vs the running app

Seventeen of the thirty-one boards were driven in the app and captured with the
same probe as the frame, and diffed:

| board | design rows | app rows | rows differing outside the reporting classes |
|---|---|---|---|
| `SOS-Loc-Bed` | 19 | 23 | 0 |
| `SOS-Loc-Private-Room` | 19 | 30 | 0 |
| `SOS-Loc-Elsewhere` | 19 | 24 | 0 |
| `SOS-Trig-Content` | 15 | 18 | 0 |
| `SOS-Feel-Turned-On` | 16 | 22 | 0 |
| `SOS-Feel-Bored` | 17 | 21 | 0 |
| `SOS-Feel-Lonely` | 18 | 22 | 0 |
| `SOS-Feel-Stressed` | 17 | 23 | 0 |
| `SOS-Feel-Anxious` | 19 | 23 | 0 |
| `SOS-Feel-Angry` | 18 | 22 | 0 |
| `SOS-Feel-Low` | 16 | 21 | 0 |
| `SOS-Feel-Rejected` | 17 | 22 | 0 |
| `SOS-Feel-Tired` | 20 | 24 | 0 |
| `SOS-Feel-Restless` | 19 | 24 | 0 |
| `SOS-Feel-Numb` | 17 | 21 | 0 |
| `SOS-Feel-Ashamed` | 24 | 29 | 0 |
| `SOS-Feel-Unknown` | 17 | 21 | 0 |
| `SOS-Challenge` | 11 | 14 | 0 (`specs/104-sos-challenge.md`) |

**Every layer kind in the family is exercised by that set** — checked
mechanically against the other fourteen boards' data, which use no kind the
seventeen do not. The fourteen therefore differ from the seventeen in their data
alone, and their data is generated.

Three of the thirty cannot be reached in the app at all — `SOS-Loc-Bathroom`,
`SOS-Loc-Home-Alone` and `SOS-Trig-Rejection` have no picker card, because the
pickers were not extended when the response branch was. They are built, and
`DECISIONS.md` D038 records why they are unreachable. The four unreachable
`SOS Feel *` boards are reached through the branch's own "Give me another"
rotation, and four of them are in the captured set above.

## Reading — every row that is not `match`

The four classes are `DECISIONS.md` D015, D019 and D022, described in the layer
table above: a percentage radius becomes a number, a radial-gradient div becomes
three SVG nodes on the same rect, a canvas box that became an SVG shape reports
no background, and a painted `<span>` is a View plus a Text. No board carries a
row outside them.
