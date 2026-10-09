# Sign-in screens: less text, more space (owner request)

## D520 — The first screens say less and breathe more
The owner found the welcome and sign-in/register screens crowded. Sign-up no longer asks for a first name
(onboarding's `03 · Name` asks a few screens later; Clerk only receives a name when one is given), and its
explanatory card is gone: the board is the title "Create your account.", one line ("We'll email you a 6-digit
code. No password needed."), the email field, the updates checkbox, Continue, and "Use a password instead"
under it. Every typed board (sign-up, its code check, Welcome Back's email, password, reset and code steps)
shares one shell: title at 136 with at most one short line, 40 of air, fields 20 apart, 36 of air, then the
actions. Fields carry placeholders instead of labels. The legal line moves from under the button to the bottom
edge, with no-break spaces keeping "terms of service" and "privacy policy" whole. The welcome doors keep the
frames' layout with one-line subtitles: "Create an account to save your progress." and "Pick up where you left
off." The gate's line is "Keep your log and lessons safe across devices."

## D521 — VICI's privacy policy ships in the app, and says what is encrypted
The policy is written from what the code collects and lives in `src/content/privacyPolicy.json`. The app shows
it at `/legal/privacy` (mono kit), and every "Privacy policy" / "Privacy" link (sign-up, the doors, the paywall,
Data & privacy) opens it, or a hosted copy if `EXPO_PUBLIC_PRIVACY_URL` is set. `node
scripts/legal/build-privacy-html.mjs [--email=…]` builds the same text as `legal/privacy-policy.html` to host for
App Store Connect and Google Play. The encryption wording is what the providers state publicly: data travels over
TLS and Convex stores it with 256-bit AES at rest; Clerk keeps only bcrypt hashes of passwords; sign-in tokens
sit in the keychain; the data is not end-to-end encrypted. The same "encrypted in transit and at rest" line is
the onboarding name step's sub and the Data & privacy paragraph. A release build no longer requires a hosted
policy URL (the in-app copy satisfies the in-app requirement), but rejects one that isn't https.
`EXPO_PUBLIC_PRIVACY_EMAIL` supplies the contact line; without it the policy points to the App Store support link.
