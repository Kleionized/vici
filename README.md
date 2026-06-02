# Tideline

A mobile app that helps people change a compulsive relationship with pornography by
**building a life worth living — not by counting a streak.** Grounded in Acceptance
and Commitment Therapy (ACT) and behaviour-change science.

This repo is the **engine and walking skeleton**: the content system, navigation,
data layer, and core interactive tools, wired to a real backend, with placeholder
content and intentionally neutral visuals. Real lesson content and the real visual
design are loaded later.

> Built overnight from a detailed spec. See **BUILD_LOG.md** for what was done,
> **DECISIONS.md** for the choices made (and the product invariants), **SETUP.md**
> to go live, and **DESIGN_NOTES.md** for the visual story.

## What makes it different (hard invariants)

1. **No zero-reset streak as the hero metric** — progress is lessons + leading
   indicators + values alignment. A "days since" number is optional and off by
   default.
2. **A lapse is data, not failure** — logged as a neutral event with the same calm
   UI as a win. No shame language, no red X, no broken-streak animation.
3. **Lead with values** — the user's "why" and Life Map are first-class and resurfaced.
4. **Different methods fit different people** — lessons carry `approachTags`; users
   rate how well each one fits them.
5. **Not medical advice** — a persistent route to crisis/professional help; sensitive
   lessons show a gentle support footer.

## Run it

```bash
npm install
npx expo start      # press `i` for the iOS simulator
```

With no env keys, it runs **fully offline** in mock mode (local auth + local data) —
sign up, onboard, take a lesson, ride out an urge, log an event, see the dashboard.
To switch to the real Convex + Clerk backend, see **SETUP.md**.

```bash
npx tsc --noEmit    # typecheck (run before committing .ts/.tsx)
npx convex dev      # real backend, in a second terminal (see SETUP.md)
```

## Stack

| Layer | Tech |
|---|---|
| App | Expo SDK 56 (React Native 0.85, React 19), TypeScript, Expo Router |
| Backend | Convex (`convex/`) — queries/mutations/actions, authenticated per call |
| Auth | Clerk (`@clerk/clerk-expo`) + Clerk↔Convex integration |
| Local | AsyncStorage + expo-secure-store (mock layer, ephemeral state) |

The app talks only to a **backend facade** (`src/lib/backend`, `src/lib/auth`) that
swaps between the local mock and real Convex+Clerk based on env keys — so the UI is
identical in both modes, and demonstrable with zero credentials.

## Project structure

```
src/
  app/                  # Expo Router routes
    (auth)/             # sign-in, sign-up
    (onboarding)/       # welcome → why → values → done
    (app)/              # tabs: today, weeks, urge, log, dashboard
                        #  + hidden routes: lifemap, settings, support
    lesson/[slug].tsx   # immersive lesson player (over the tabs)
  components/ui/         # neutral, themeable primitives
  content/seedLessons.ts# the 3 placeholder lessons
  lib/
    theme.ts            # ★ single source of truth for all visual tokens
    types.ts            # domain types (mirror the Convex schema)
    backend/            # mock + convex hooks behind one contract
    auth/               # mock + clerk auth behind one contract
    dashboard.ts        # leading-indicator aggregation
convex/                 # schema + authenticated functions + seed + import
```

## Status

Core loop works end-to-end on the mock backend (verified: `tsc` clean, iOS bundle
exports clean). Real Convex+Clerk is fully wired and bundles; going live needs the
documented env setup. Visuals are intentionally neutral placeholders pending the
design pass.
