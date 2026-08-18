# Do the buttons work?

Four checks, because "works" fails in four different ways and no single sweep
catches them all.

## 1 · Nothing behind it

`scripts/uifinal/control-audit.mjs` reads every pressable and reports the ones
with no `onPress`, a no-op handler, a handler that is only a TODO, or a literal
`disabled`.

    pressables: 247
    with nothing behind them: 0

## 2 · Navigation that goes nowhere

`scripts/uifinal/route-audit.mjs` resolves every `router.push`/`replace`/
`navigate` target against the route tree the way expo-router does, including
`[param]` and `(group)` segments.

    navigation calls checked: 119
    routes in the app:         58
    targets that resolve to nothing: 0

Also checked: no screen navigates to itself.

## 3 · State nothing reads

A control can call a setter whose value is never used again. Every `useState`
pair was checked for a setter that is called and a value that is not read:
**none**.

## 4 · Clicked, in the running app

The three above are static. This one opens each screen, clicks every control on
it, and asks whether *anything* changed — the route or the DOM. The route is
restored between clicks so each control is tested from the same starting state.

    screens: 18 · controls clicked: 108 · flagged: 6

Every one of the six is explained, and none is a dead control:

| Flagged | Why it did nothing |
| --- | --- |
| `/subscription` — Redeem a code, Restore purchases, Payment method, Receipts & invoices | all four call `Linking.openURL` to the App Store or Play subscription page. A hand-off to the OS is invisible to a browser probe — the limitation is the probe's, not the control's |
| `/lifemap` — Add | `addCustom` returns early on an empty field, and the probe clicked it with the field blank. The guard working |
| `/score` — Three months | already the selected range. Re-selecting it correctly changes nothing |

The probe cannot see an OS hand-off and cannot type into a field first. Both are
stated here rather than counted as passes.

## The one that was actually broken

**Score over time · 1Y.**

`3M` and `1Y` both slice from the start of the record:

```
const from = Math.max(0, history.values.length - span);
```

`history.values.length` is days since sign-up. Below 90 days, `max(0, n − 90)`
and `max(0, n − 365)` are both `0` — the two windows cover exactly the same
days. Measured before the change: the pill's highlight moved, the chart hash did
not.

The canvas draws both pills because it composes a filled-in account. Offering a
choice that cannot change the answer is worse than not offering it, so the pills
appear once there is more history than the shorter window.

**Verified both ways**

| account | pills | chart |
| --- | --- | --- |
| 13 days | absent | one line, all of it |
| 200 days | present | hash differs between 3M and 1Y, and returns on switching back |
