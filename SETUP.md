# Setup

Tideline runs in two modes. **You need zero setup for mock mode** — the whole app
works offline. Setting up Convex + Clerk switches it to a real backend.

## 0. Prerequisites

- Node 20+ (built/verified on Node 25), npm.
- Xcode + iOS Simulator (macOS) for `npm run ios`, or the Expo Go app on a device.
- `npm install` in the repo root.

## 1. Run in mock mode (default — no accounts, no keys)

```bash
npm install
npx expo start         # then press `i` for iOS simulator
```

With no `.env` keys set, the app uses local mock auth + a local AsyncStorage data
layer. You can sign up, onboard, take lessons, use the urge tool, log events, and
see the dashboard — all on-device. This is the mode the overnight build was
verified in.

> The mock layer is for development only. "Passwords" are stored locally in plain
> text; data lives in AsyncStorage. Don't ship it.

## 2. Go live with Convex + Clerk

The app switches to the real backend only when **both** of these are set (they're
coupled because every Convex function authenticates against the Clerk identity):

- `EXPO_PUBLIC_CONVEX_URL`
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`

Put them in `.env.local` (gitignored). Start from `.env.example`.

### 2a. Convex

```bash
npx convex dev        # first run provisions a deployment and writes
                      # EXPO_PUBLIC_CONVEX_URL into .env.local for you
```

- For a **cloud** deployment (recommended for anything shared): run `npx convex
  login` first, then `npx convex dev`. Without login the CLI provisions a **local**
  anonymous deployment (fine for solo dev).
- Leave `npx convex dev` running in a second terminal while developing — it pushes
  function changes and keeps types generated.

### 2b. Clerk

1. Create an application at <https://dashboard.clerk.com>.
2. Copy the **Publishable key** (`pk_test_…`) → set `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`.
3. Create a **JWT template named exactly `convex`** (Clerk dashboard → JWT Templates
   → New → Convex). Copy its **Issuer** URL (looks like
   `https://your-app.clerk.accounts.dev`).
4. Tell Convex about the issuer (this is what `convex/auth.config.ts` reads):

   ```bash
   npx convex env set CLERK_JWT_ISSUER_DOMAIN https://your-app.clerk.accounts.dev
   ```

   (Until this is set, `npx convex dev` will refuse to deploy — that's expected.)
5. Enable an email + **password** sign-in strategy in Clerk. Email-code
   verification is fully supported — `(auth)/sign-up.tsx` renders the code step and
   `src/lib/auth/clerkAuth.tsx` completes it (`prepare`/`attempt` + `setActive`).
6. **Enable the Native API** for the instance (Clerk dashboard → Native
   Applications). Required for the native (`@clerk/clerk-expo`) integration.

### 2c. Seed lessons

```bash
npx convex run seed:seedLessons     # upserts the 3 placeholder lessons
```

### 2d. Run

```bash
npx expo start        # both env keys present → real Convex + Clerk
```

## 3. Loading the real curriculum

`convex/importLessons.ts` is the bulk seam. Pass an array of objects matching the
`lessons` schema (see `src/lib/types.ts` → `Lesson`):

```bash
npx convex run importLessons:importLessons '{ "lessons": [ { "slug": "...", "title": "...", "week": 1, "dayInWeek": 1, "orderIndex": 0, "category": "motivation", "bodyMarkdown": "...", "reflectionPrompt": "...", "reflectionFields": [], "approachTags": [], "sensitive": false } ] }'
```

or call `api.importLessons.importLessons` from a Node script with the full ~94-lesson
array.

## 4. Payments

VICI sells one entitlement, `vici_unlimited`, through three products
(`lifetime`, `yearly`, `monthly`) via RevenueCat. The SDK is installed and
wired; what is left is the dashboard side and the store keys.

```bash
# already installed — listed here so a fresh clone knows what it needs
npx expo install react-native-purchases react-native-purchases-ui expo-dev-client
```

Add one key to `.env.local` and the app switches from the offline catalogue to
the real store:

```
EXPO_PUBLIC_REVENUECAT_KEY=test_...          # Test Store: works everywhere, simulates purchases
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_...      # production
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_...  # production
```

In-app purchases need a development build, not Expo Go — `eas.json` carries the
profiles. **docs/revenuecat.md** has the dashboard setup, the entitlement and
product identifiers, both paywalls, Customer Center and the testing notes.

## 5. What still needs a human

- Real crisis / professional-help resources in `src/app/(app)/support.tsx`
  (currently clearly-marked placeholders — invariant #5).
- The visual design pass (see DESIGN_NOTES.md) — the app is intentionally unstyled.
- Real lesson content (the 3 seeds are placeholders).
- A verification-code screen if Clerk email verification stays enabled.
- Real reminder notifications (the reminder time is stored but not scheduled).
