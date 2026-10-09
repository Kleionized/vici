# deploy WP1 decisions — Clerk auth, account deletion and export, legal links, privacy copy (D410–D419)

Issues: B3, B5 (deletion, export, Terms/Privacy on the auth screens and /privacy), B14, P8 (the email box).
Files: `src/lib/auth/*`, `src/app/(auth)/sign-up.tsx`, `src/app/(auth)/welcome-back.tsx`,
`src/components/auth/kit.tsx`, `src/app/privacy.tsx`, `src/lib/legal.ts` (new), `convex/account.ts` (new),
`src/lib/backend/*` (incl. new `deviceState.ts`), `src/lib/types.ts`, `src/content/onboardingFunnel.ts:59`,
`src/app/journal-new.tsx:92`.

## D410 — Accounts made without a password run on Clerk's emailed code
The synthetic `magic-<email>` password is gone. "No password" sign-up is `signUp.create({ emailAddress,
firstName, unsafeMetadata })` → `prepareEmailAddressVerification('email_code')` → the existing verify board
→ `attemptEmailAddressVerification` → `setActive`. Welcome Back's "Let’s Go" now emails a sign-in code
(`signIn.create({ identifier })` → the `email_code` factor → `prepareFirstFactor` → the verify board →
`attemptFirstFactor`); "Use password instead" sits under it as a ghost. Copy says "6-digit code", never
"magic link". The mock accepts any six digits and sends nothing.
Review fix: if the instance requires a password (or any field the app doesn't send), the sign-up stops
right after `signUp.create`, before a code is emailed, and says to use the password path instead.

## D411 — Terms and Privacy open real documents; the door caption keeps its look
`src/lib/legal.ts`: `TERMS_URL` defaults to Apple's standard EULA (overridable by `EXPO_PUBLIC_TERMS_URL`);
`PRIVACY_URL` is `EXPO_PUBLIC_PRIVACY_URL` or empty. `openLegal()` uses `WebBrowser.openBrowserAsync`
(falls back to `Linking`). The Login/Welcome Back caption "Terms · Privacy" keeps its 12/700 style with no
underline (D013/D021) — each word is now a pressable run; `AuthLegal`'s underlined runs press too. While
the privacy URL is unset its run is plain words, and the /privacy row reads "Not linked yet" with a line
saying it will be linked before release (WP4 blocks a release build without it).

## D412 — Data & privacy: every row acts, and the switch is named for what it does
Export gathers the account's records (`account:exportData` / the mock store) plus the email into
versioned JSON and hands it to React Native's `Share` as text (expo-sharing/file-system are not
installed; a very large history could hit Android's intent size limit). "Pause analytics" (there are no
analytics) becomes "Share email with billing", on by default: the same `settings.pauseAnalytics` field,
inverted, with a caption naming RevenueCat and saying it stops sending from then on. Heading "Yours, and
only yours." → "Your data, your call."; the line now says stored in your private account, encrypted in
transit, never sold. Layout and type unchanged.

## D413 — The email-updates box starts empty and its answer is kept
`useState(false)`. The answer goes to Clerk `unsafeMetadata` as `{ emailUpdates, emailUpdatesAnsweredAt }`
(ISO time, for a consent record) and to the mock's user record. Apple/Google sign-ups are never asked,
so nothing is stored for them — treat a missing value as "no".

## D414 — Deletion order: prove it’s you, erase the data, delete the sign-in, clear the phone
Clerk treats "Delete account" as a sensitive action needing reverification within ~10 minutes, so the
sheet first runs `session.startVerification({ level: 'first_factor' })` and asks for the emailed code
(or the password where codes are off), then: `account:deleteAccountData` → `user.delete()` → sign out →
clear device state → `/`. Data goes first because once the Clerk user is gone the Convex token stops
refreshing. If `user.delete()` then fails, the sheet says the data is erased and the account isn't
closed yet; a retry is idempotent. The copy says the store subscription is not cancelled by this.
Review fix: before anything is erased, `prepareAccountDeletion` refuses when `user.deleteSelfEnabled` is
false or `user.twoFactorEnabled` is true, the two cases where Clerk is known to refuse `user.delete()` (a
first-factor check never satisfies its reverification for a 2FA account). The error says nothing was erased.

## D415 — Server-side erase is batched and finishes on the scheduler
`deleteAccountData` deletes the `users` row, then up to 250 rows across events, dailyCheckins,
journalEntries, lessonProgress, reflections and lifeMap (all `by_user`), and schedules
`internal purgeBatch` until none remain. The scheduler is given a name reference
(`makeFunctionReference('account:purgeBatch')`) because `_generated/api` only learns about the new
module on the next `convex dev`/`deploy`. It also schedules `purgeRevenueCat`, which deletes the
RevenueCat customer when `REVENUECAT_SECRET_API_KEY` is set on the deployment, and does nothing otherwise.
Review fix: the RevenueCat purge runs twice, now and ten minutes later. Between the two, the phone can
recreate the customer under the same id (an attribute sync or a customer-info read before it logs out),
and the second sweep removes it.

## D416 — Export reads at most 2,500 rows per table and says when it stopped
Six tables × 2,501 reads stays well inside a query's read limits, so it is one query, not pagination. A table that
ran past the cap is listed in `truncated` and the screen says so. The mock never truncates.

## D417 — Deleting clears this phone's `tideline.*` keys
Letter/post delivery flags, report-seen marks, check-in times, SOS settings and the urge session aren't
in the account (audit D1), so deletion removes every `tideline.*` AsyncStorage key except the mock's
own account book (`tideline.mock.*`, whose entries for the deleted account the mock auth and store
remove). Scheduled reminders are cancelled by WP2's sign-out lifecycle.

## D418 — Frame copy changed only where it promised something untrue
Onboarding 03 · Name's sub "All your data will be encrypted." → "Stored in your private account." (same
length, same slot). Journal placeholder "Write freely. No one sees this but you." → "Write freely. It stays
in your account." The kit-lab overlay still shows the old onboarding line (`src/components/mono/lab/
overlay.tsx:533`, not in this package, dev-only).

## D419 — Forgot password lives on the password board and signs you in
"Forgot password?" (ghost under Sign in) runs `signIn.create({ strategy: 'reset_password_email_code' })`;
the reset board takes the code and a new password (`attemptFirstFactor`, then `resetPassword({
signOutOfOtherSessions: true })` if Clerk asks for that step) and signs in. An email second factor, after
a reset, a password or a code, goes on to the same verify board. "Email me a code instead" is the
password board's second ghost. The mock checks the account exists and accepts any six digits.
