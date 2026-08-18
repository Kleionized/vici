# The signature, made real

## What it was

The vow card drew one fixed squiggle for everybody. Its own comment said why:

```
/* the signature is drawn, not set: a 216 x 64 stroke with a dot at
   the pen's rest, so it reads the same whatever the name is */
```

That is fine for a mock, which has nobody to sign it. It is not fine for the
one screen in the app whose whole point is that the promise is *theirs*.

## What it is now

`src/components/ui/Signature.tsx` — two components over one format.

- **`SignaturePad`** captures the real strokes. A pan gesture collects points,
  smoothed through the midpoints with a quadratic, because a raw polyline reads
  as shaky. Points closer than 1.6 units are dropped as bytes with no ink.
- **`SignatureMark`** draws a stored one back. No gestures, no state.

The value is a plain SVG `d` with one `M…` subpath per stroke, recorded against
a fixed 260 × 84 box so a signature drawn on one screen reads the same on
another. Reading it back is a single `<Path>` — nothing to parse.

## Where it is kept

`UserSettings.signature`, an optional string. That meant three places, since the
settings object is validated end to end:

| | |
| --- | --- |
| `convex/schema.ts` | `signature: v.optional(v.string())` in the settings object |
| `convex/users.ts` | the same in `updateSettings`'s args, or the mutation rejects it |
| `src/lib/types.ts` | `signature?: string` |

The vow card shows the pad when there is nothing signed and the mark when there
is, so signing happens where the signature belongs rather than behind a
separate flow.

## Two things worth writing down

**The updaters are pure.** The first version kept the in-progress points in a
`useRef` and called `onChange` from inside a `setState` updater. Both are wrong
in the same way — an updater has to be pure and React is free to run it twice,
and a ref written during a gesture and read while rendering is exactly what the
lint rule warns about. Finished strokes and the stroke in hand now live in one
state value, every updater is a pure function of the previous one, and telling
the caller is an effect.

**A synthetic pointer cannot test this.** Dispatching `PointerEvent`s by hand
throws `setPointerCapture … no active pointer with the given id`, which aborts
gesture-handler's sequence before it ends — so the stroke draws but never
commits, and it looks like a bug in the component. It is a limit of the probe.
A real drag commits.

## Verified

A real drag on the pad, then a full reload:

    stored:   "M24.1 37.2L240.7 19.2"   (1 stroke, in settings)
    rendered: byte-identical to the stored value

So: drawn → committed on stroke end → persisted → read back and drawn again.
