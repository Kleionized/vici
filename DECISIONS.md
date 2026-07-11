# Decisions

## HARD PRODUCT INVARIANTS (never violate — build spec §3)

1. **No zero-reset streak as the hero metric.** A "days since" number may exist as
   an optional, secondary, opt-in stat. The primary progress surface is lessons
   completed + leading indicators + values-alignment. A lapse never resets a
   counter to zero in a way framed as failure.
2. **A lapse is data, not failure.** The log models a lapse as one neutral event
   type with structured fields (trigger, preceding state, what was learned). Copy
   is neutral and curious. No "you failed", no broken-streak animation, no red X.
3. **Lead with values, not abstinence.** The user's own "why" and Life Map are
   first-class data the app resurfaces. Framing is toward a life, not away from a
   behaviour.
4. **Different methods fit different people.** The content engine supports many
   lesson types/approaches side by side (`approachTags`) and lets the user mark
   what fits them (`fitsMeRating`). No single methodology is hardcoded.
5. **Not medical advice.** A persistent route to crisis/professional help exists
   (`/support`, placeholder resources). Lessons flagged `sensitive` show a brief,
   non-dramatic support footer.

These are encoded in the data model (no `streak`/`daysClean` field anywhere; the
events table treats all event types uniformly) and the UI copy (`src/lib/labels.ts`).

---

## Ambiguous calls made during the overnight build

Where the spec left a product decision open, I built the simplest thing that
compiles and logged it here (per spec §0).

- **`src/` layout, not root `app/`.** Expo SDK 56's default template scaffolds
  routes under `src/app/` with `@/* → ./src/*` path aliases and typed routes. The
  spec's §5 tree shows root-level `app/`/`components/`/`lib/`. I kept the template's
  working `src/` layout to preserve its path aliases + Metro config rather than
  fight it. Folder *roles* match the spec; only the `src/` prefix differs.
- **Dual backend, mock-first.** Cloud projects (Convex deployment, Clerk app)
  require human-only interactive setup, so per spec §9.5 the app ships with a fully
  functional local mock layer (`src/lib/backend/mock.ts` + `mockStore.tsx`, and
  `src/lib/auth/mockAuth.tsx`) behind the same hook interface the real Convex/Clerk
  code targets. Presence of `EXPO_PUBLIC_CONVEX_URL` / `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
  flips each layer to real. Default run mode is **mock**.
- **Mock auth is DEV-ONLY and not secure.** It stores "passwords" in plain text
  locally purely to exercise sign-in/up/gate flows offline. Real auth is Clerk.
- **`typedRoutes` disabled.** The template enabled experimental typed routes, whose
  generated route types are regenerated on `expo start` and are brittle to iterate
  against in an unattended build. Disabled for build stability; `reactCompiler`
  kept on. Trade-off: lost compile-time href checking.
- **Custom minimal markdown renderer** (`src/components/ui/MarkdownView.tsx`)
  instead of a markdown library — avoids a dependency that may not yet support
  RN 0.85 / React 19. Handles the subset lessons use (headings, bold, italic,
  bullet/ordered lists, paragraphs).
- **Navigation placement.** Tab bar = Today, Weeks, Urge, Log, Dashboard. The
  secondary screens (Life Map, Settings, Support) are routes in the `(app)` group
  hidden from the tab bar (`href: null`); the immersive lesson player lives at the
  root (`src/app/lesson/[slug].tsx`) so it presents over the tab bar. Spec §5
  nested some of these differently; behaviour matches the spec's intent.
- **Neutral placeholder visuals.** Per spec §0.4 the app is intentionally unstyled
  (system font, hairline borders, near-black on white, no brand colour) until the
  design pass. All tokens live in `src/lib/theme.ts` for a one-file restyle.

## Reference-conflict note (build spec §6.5)

The human provided 5 reference screenshots that span **two different visual
languages** (a dark-navy serif "Imprint"-style onboarding, and a light, rounded-sans,
pink-illustration "Fabulous"-style journey UI). They cannot both be the single
system. Resolution is deferred to the design pass; see DESIGN_NOTES.md for the
token inventory and the proposed primary direction. No invariant is violated by
either; the Fabulous references show a large progress % which we treat as a
leading-indicator surface, never a zero-reset streak (invariant #1).

---

## Overnight v2 (tideline UI 1) self-answered questions

- Q: Platform icons (icon.png, splash-icon.png, android-icon-*, favicon.png) are PNG — convert? A: Kept PNG; Expo's build pipeline requires PNG for app icons/splash. §1.11 read as covering in-app raster assets, which are now all WebP (template leftovers deleted).
- Q: laurel.png replaced by which of laurel/laurel2/laurel3.webp? A: `laurel.webp`; laurel2/3 are canvas alternates, unused.
- Q: Where does the boot screen live in expo-router? A: `src/app/index.tsx` (the existing route decider) — it already gates on auth/onboarding, so the ink boot renders there while state hydrates, then breaks to Today.
- Q: Material Symbols `partly_cloudy_day` — load the icon font? A: No; drew the FILL=1 glyph as an RN-SVG path at 21px. Same silhouette, no new font dependency.
- Q: Weather icon tint when no check-in today? A: Tints `colors.textSoft` (quiet grey) until a mood is logged — calmest option; the canvas always shows a tone.
- Q: `onb3-q-*` boards — which questions? A: Enumerated from `O3_QUESTIONS` in the new screens-onb3.jsx; each has a VERIFICATION.md row.
- Q: Insights when-in-the-day buckets — keep? A: Cut; the new screens-analytics.jsx layout does not include them (§1.8 "otherwise cut").
- Q: Yearly-drop entitlement storage? A: `settings.yearlyDrop` flag on user settings; managesub renders $29.99 when set.
- Q: Medallion "email" delivery? A: No mail transport in this bundle — the email copy lands as a Mail-inbox item with the same content; real SMTP is server work outside the canvas.
- Q: Lesson interactive pages — which lessons? A: Wired as first-class page kinds in the reader's content model; "The early warnings" (Day 34) carries the demonstrated set per the canvas.
- Q: Boot progress duration? A: Canvas timing (~1.8s) with an early break when hydration finishes first; reduced-motion/cold render shows the finished state.
