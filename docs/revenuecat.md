# RevenueCat

VICI sells one entitlement, `vici_unlimited`, through three products. This is
how the app is wired to it, what has to exist in the RevenueCat dashboard, and
how to run it.

## The shape of it

```
src/lib/purchases/
  catalogue.ts   the entitlement, the offerings, the three products — the only
                 file that names a RevenueCat string
  types.ts       the contract both adapters implement
  plans.ts       store objects → the strings a screen draws
  revenuecat.tsx the RevenueCat adapter
  mock.tsx       the offline catalogue (the canvas's own prices)
  index.ts       the facade: PurchasesProvider, usePurchases, usePremium
```

Screens import from `@/lib/purchases` and never learn which adapter is running,
the same way they import from `@/lib/backend` and `@/lib/auth`. The adapter is
chosen once at module load from `PURCHASES_MODE`, so the rules of hooks hold.

`PurchasesProvider` is mounted by `AppProviders` inside auth and the data layer,
because it identifies the customer from the signed-in user and mirrors the
entitlement down into `settings.premium`.

## 1 · Install

```bash
npx expo install react-native-purchases react-native-purchases-ui expo-dev-client
```

`npx expo install` runs `npm install --save` underneath and pins versions Expo
56 supports. Both packages ship native code, so **Expo Go cannot make real
purchases** — you need a development build (step 5). There is no config plugin
to add: they are autolinked.

Native minimums, both already met by Expo 56: iOS 13.0, Android API 23. The
Play Billing library declares `com.android.vending.BILLING` in its own manifest,
so the merged app manifest picks it up without an `android.permissions` entry.

## 2 · Configure the dashboard

Create these in [app.revenuecat.com](https://app.revenuecat.com), exactly as
named — `src/lib/purchases/catalogue.ts` is keyed on these strings, and a
mismatch shows up as "no offerings" rather than as an error.

**Entitlement**

| Identifier | Attach |
| --- | --- |
| `vici_unlimited` | all three products below |

**Products**

| Identifier | Type |
| --- | --- |
| `lifetime` | non-consumable / one-time |
| `yearly` | auto-renewing, 1 year |
| `monthly` | auto-renewing, 1 month |

Give `yearly` a **3-day free trial** if you want the paywall's rescue page: it
promises free days, so it only appears when the yearly product actually carries
a free introductory offer.

**Offerings**

| Identifier | Packages |
| --- | --- |
| `default` | `$rc_lifetime` → `lifetime`, `$rc_annual` → `yearly`, `$rc_monthly` → `monthly` |
| `drop` *(optional)* | `$rc_annual` → a cheaper yearly, for the yearly-drop enclosure |

`drop` backs `/drop`, the enclosure that sells the year at a lower price. If it
does not exist the app falls back to `default`, so the drop still sells the year
rather than failing shut.

Then design a **Paywall** on the `default` offering (Offerings → default →
Paywall). That is what `/paywall` presents.

## 3 · Keys

Public SDK keys go in `.env.local` (see `.env.example`):

```
EXPO_PUBLIC_REVENUECAT_KEY=test_...          # Test Store — dev only
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_...      # production
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_...  # production
```

A platform key wins over the shared key on its own platform. RevenueCat's client
keys are public by design, so shipping them in the bundle is expected.

**A `test_…` key must never reach the App Store or Google Play.** The app warns
loudly at configure time if one is present in a non-development build.

## 4 · What each environment does

| Where | What runs |
| --- | --- |
| Development / store build | the native SDK against the real store |
| Expo Go | RevenueCat Browser Mode — needs a `test_…` or `rcb_…` key, simulates the sheet |
| Web | the same Browser Mode |
| No key, or `EXPO_PUBLIC_FORCE_MOCK=1` | the offline catalogue in `mock.tsx` |

The SDK detects Expo Go and web itself, so nothing in the app branches on
platform except code redemption (iOS only) and the native manage-subscriptions
screen.

## 5 · Run it

```bash
npx expo start --web
```

For a real store, build a development client:

```bash
npm install -g eas-cli && eas login && eas init
eas build --platform ios --profile ios-simulator
eas build --platform android --profile development
npx expo start
```

`eas.json` already carries `development`, `ios-simulator`, `preview` and
`production` profiles. `eas init` writes the project id into `app.json`.

To exercise RevenueCat without Convex and Clerk credentials, pair the offline
data layer with the real store:

```bash
EXPO_PUBLIC_FORCE_MOCK=1 EXPO_PUBLIC_FORCE_MOCK_PURCHASES=0 npx expo start --web
```

That is what the `tideline-web-purchases` entry in `.claude/launch.json` runs.
It opens the offering paywall against your real offering, which is the one worth
previewing on web — the RevenueCat dashboard paywall renders there only as
`react-native-purchases-ui`'s preview stub.

## 6 · Using it in a screen

```tsx
import { usePremium, usePurchases } from '@/lib/purchases';

// the entitlement check — never a stored flag
const unlocked = usePremium();

// the whole surface
const { ready, membership, plans, planFor, purchase, restore,
        presentCustomerCenter, manageSubscriptions } = usePurchases();
```

`usePremium()` is `vici_unlimited`, read live from CustomerInfo, so a renewal, a
refund, a cancellation made in the store's own settings or a Family Sharing
change takes effect without a round trip through our backend. It is false while
the first fetch is in flight — pair it with `ready` where "not yet known" has to
read differently from "no".

`useEntitlement(id)` does the same for any other entitlement, should the
catalogue grow.

Purchases return a `PurchaseOutcome` rather than throwing:

```tsx
const outcome = await purchase('yearly');
if (outcome.status === 'purchased') { /* unlocked */ }
else if (outcome.status === 'cancelled') { /* they backed out — not an error */ }
else if (outcome.status === 'error') Alert.alert('…', outcome.message);
```

`settings.premium` is still written, mirrored down from the entitlement, so
nothing that already read it had to change. Treat it as a cache: RevenueCat is
the truth.

## 7 · The three paywalls

| `EXPO_PUBLIC_REVENUECAT_PAYWALL` | File | What it is |
| --- | --- | --- |
| `offering` *(default)* | `components/paywall/OfferingPaywall.tsx` | VICI's own paywall, drawn from whatever the offering contains |
| `revenuecat` | `components/paywall/RevenueCatPaywall.tsx` | the paywall designed in the RevenueCat dashboard, via `react-native-purchases-ui` |
| `designed` | `components/paywall/PaywallFlow.tsx` | the drawn VICI paywall (canvas 103 · 104 · 105) — two rows, no lifetime |

Each falls back to the one below it: the offering paywall and the dashboard
paywall both hand over to the drawn paywall when there is no offering to draw,
rather than leaving an empty board between the customer and the purchase. Where
purchases are mocked, `designed` is forced.

The onboarding funnel always uses the drawn paywall — it is one step inside a
pixel-exact sequence, and a store paywall would break that sequence.

### The offering paywall

It renders **every** package the offering carries, in the dashboard's own order.
Nothing about the three products is compiled in: a row is named from its package
type (`ANNUAL` → "Yearly", `LIFETIME` → "Lifetime", `SIX_MONTH` → "Six months"),
priced from the store, and subtitled with the introductory offer if the customer
is eligible, else the comparable monthly price, else the store's own description.
"Best value" lands on the lowest cost-per-month. So adding a six-month plan,
reordering the rows or changing a price is a dashboard change, not a release.

Its copy comes from the offering's **metadata**, with the canvas's own words as
the fallback — an offering with no metadata renders the paywall as drawn. Set it
under Offerings → *your offering* → Metadata:

```json
{
  "eyebrow": "PLUS",
  "headline": "Give it twelve weeks",
  "benefits_title": "Everything, unlocked",
  "benefits": ["The full twelve-week programme", "SOS whenever an urge hits"],
  "cta": "Start my free trial",
  "footnote": "Terms  ·  Restore",
  "default_package": "$rc_annual",
  "badges": { "$rc_annual": "Best value" }
}
```

Every key is optional and every value is read defensively — a wrong type is
ignored rather than crashing the paywall.

It also accepts a `placement` prop, for showing a paywall at a named point in
the app:

```tsx
<OfferingPaywall placement="onboarding_end" onDone={close} />
```

That resolves through `Purchases.getCurrentOfferingForPlacement`. RevenueCat
treats an unresolved placement as "show nothing here"; `/paywall` is opened by a
deliberate tap, so this falls back to the current offering instead of stranding
the customer.

## 8 · Customer Center

`/subscription` presents RevenueCat's Customer Center for payment method,
receipts, plan changes, refunds and cancellation, and falls through to the
store's own subscription settings on builds that cannot present it (Expo Go,
web). Configure it under **Customer Center** in the dashboard — the paths,
surveys and promotional offers it shows are dashboard-side, not in this repo.

"Redeem a code" uses the App Store's offer-code sheet on iOS and Customer Center
elsewhere.

## 9 · Testing

Test Store purchases behave like real ones, with two differences worth knowing:
renewals accelerate hard (a yearly renews hourly) and stop after five cycles.
Product identifiers, durations and prices cannot be edited once created — make a
new product instead.
