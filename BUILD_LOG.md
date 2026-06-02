# Build Log

Chronological log of the overnight build. **Running mode: OFFLINE MOCK** (no
Convex URL / Clerk key configured — see SETUP.md to go live).

## Environment notes
- Expo **SDK 56** (RN 0.85.3, React 19.2.3, TypeScript 6.0.3, expo-router 56.2.8).
  Very new — APIs verified against installed `node_modules`, not memory (spec §0.5).
- Node v25.8.1, npm 11. No watchman installed (Metro slower but functional).
- `xcrun` present → iOS simulator available.

## Milestone 1 — scaffold + neutral foundation  ✅
- Scaffolded with `create-expo-app` default template (Expo Router + TS). Removed
  the template's demo components/screens.
- Disabled `typedRoutes`, neutralised splash colour (white).
- Installed `@react-native-async-storage/async-storage` + `expo-secure-store`
  (SDK-compatible versions via `expo install`) for local persistence.
- **Theme** (`src/lib/theme.ts`): neutral placeholder tokens, single source of
  truth, TODO markers for the design pass.
- **Types** (`src/lib/types.ts`): mirror the planned Convex schema field-for-field.
- **Seed content** (`src/content/seedLessons.ts`): the 3 placeholder lessons (§7).
- **UI primitives** (`src/components/ui/*`): Screen, AppText, Button, Card, Field,
  ChoiceInput, ScaleInput, SegmentedControl, ProgressDots, MiniBars, Stat, Pill,
  ToggleRow, Divider, SectionLabel, MarkdownView (custom), Feedback (loading/empty).
- **Mock data layer** (`src/lib/backend/`): `mockStore.tsx` (per-user state,
  AsyncStorage write-through) + `mock.ts` (hooks matching the backend contract).
- **Mock auth** (`src/lib/auth/`): local sign-in/up/out (DEV ONLY, not secure).
- **Auth gate**: `src/app/index.tsx` redirects per auth + onboarding state.
- **Auth screens**: `(auth)/sign-in`, `(auth)/sign-up`.
- `npx tsc --noEmit` clean.

## Milestone 2 — onboarding + full walking skeleton  ✅
- **Auth gate** complete: `(auth)`, `(onboarding)`, `(app)` groups each guard on
  auth + onboarding state; root `index.tsx` routes between them.
- **Onboarding** (§5): welcome → why → values → done, writing the Life Map as it
  goes (`whyStatement`, `values`).
- **Lesson player** [CORE] (`src/app/lesson/[slug].tsx`): markdown body, dynamic
  reflection form (shortText/longText/scale/choice), `fitsMe` rating (invariant
  #4), sensitive-lesson support footer (invariant #5), urge-tool CTA. Saves a
  reflection + marks progress complete.
- **Today** [CORE]: leads with the user's "why" (invariant #3), surfaces the
  current lesson, calm quick-actions (urge / log / check-in / support).
- **Weeks**: lessons grouped by week with per-lesson status.
- **Ride It Out** urge tool [CORE]: rate → timed wait (1/3/5 min, configurable)
  with box-breathing prompt → neutral outcome logging (rode out / acted on) with
  HALT + trigger + what-helped + what-it-taught. In-progress session persisted to
  AsyncStorage so backgrounding doesn't lose it. No shame language on any path.
- **Log** [CORE]: lapse-as-data composer (win/lapse/urge events share identical
  calm UI — invariant #2), daily check-in (leading indicators), chronological
  history.
- **Dashboard**: leading-indicator hero (sleep/mood 7-day bars, moved/connected/
  structure counts, lessons, reflections). Optional "days since" stat ONLY when
  the user opts in via Settings (invariant #1), framed neutrally.
- **Life Map**: edit why + one-year answer + values.
- **Settings**: streak opt-in toggle, reminder time (stored; real scheduling
  deferred), Life Map / Support links, account + run-mode, sign out.
- **Support**: crisis/professional-help placeholder route (invariant #5).
- `npx tsc --noEmit` clean across all 22 source files + 17 routes.

### Stubbed / deferred so far
- Real Convex backend + Clerk auth (code paths reserved; activated by env keys).
- Real notification scheduling for the reminder time (value is stored only).
- Visual design pass (neutral placeholder in place; references pending, see
  DESIGN_NOTES.md).
