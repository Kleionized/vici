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

### Stubbed / deferred so far
- Real Convex backend + Clerk auth (code paths reserved; activated by env keys).
- Visual design pass (neutral placeholder in place; references pending, see
  DESIGN_NOTES.md).
