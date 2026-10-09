import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import {
  AuthBoard,
  AuthButton,
  AuthField,
  AuthGhost,
  AuthLegal,
  AuthMessage,
  AuthPill,
  AuthSurface,
} from '@/components/auth/kit';
import { Apple, CheckDisc, Google, MonoText, Tap } from '@/components/mono';
import { useAuth } from '@/lib/auth';

/**
 * Save your progress (the gate) and Create Account (the form).
 *
 * The gate comes first — three ways to keep the run: Apple, Google, or an
 * address. Only the third one asks for anything, and all it asks for is an
 * email (the name comes a few screens later, in onboarding's `03 · Name`);
 * there is no password unless you go looking for one (owner, D520).
 * Without one, the account is made on an emailed 6-digit code (the verify
 * board), and Welcome Back signs it in the same way (deploy D410).
 *
 * "VICI updates via email" starts unticked and its answer is stored with the
 * account (Clerk `unsafeMetadata`; the mock's user record) — D413.
 *
 * Neither board has a frame in this drop (both were withdrawn two drops ago),
 * so they keep their copy and behaviour and take the closest frames' look:
 * the gate is the Login door's stack, the form `03 · Name`'s template.
 */

type Mode = 'gate' | 'form' | 'verify';

export default function SignUp() {
  const router = useRouter();
  const { signUpWithPassword, signUpWithEmailCode, signInWithSSO, verifyEmailCode, resendEmailCode } = useAuth();
  // `02 · Login` sends "Continue with email" straight to the form — the board
  // it comes from already offered Apple and Google, so the gate would be the
  // same three choices a second time.
  const { step } = useLocalSearchParams<{ step?: string }>();
  const [mode, setMode] = useState<Mode>(step === 'form' ? 'form' : 'gate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [updates, setUpdates] = useState(false);
  const [usePassword, setUsePassword] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setError(null);
    setNotice(null);
  };
  const back = () => {
    reset();
    if (mode === 'verify') return setMode('form');
    // Arriving on the form directly means the gate was never on screen, so
    // stepping back to it would show a board this route never passed through.
    if (mode === 'form' && step !== 'form') return setMode('gate');
    if (router.canGoBack()) router.back();
    else router.replace('/(auth)/sign-in');
  };

  async function sso(strategy: 'oauth_apple' | 'oauth_google') {
    setLoading(true);
    reset();
    const result = await signInWithSSO(strategy);
    setLoading(false);
    if (result.ok) return router.replace('/');
    setError(result.error ?? 'Could not complete sign up.');
  }

  async function submit() {
    setLoading(true);
    reset();
    const options = { emailUpdates: updates };
    const result = usePassword
      ? await signUpWithPassword(email, password, undefined, options)
      : await signUpWithEmailCode(email, undefined, options);
    setLoading(false);
    if (result.ok) return router.replace('/');
    if (result.needsVerification) return setMode('verify');
    setError(result.error ?? 'Could not create the account.');
  }

  async function submitCode() {
    setLoading(true);
    reset();
    const result = await verifyEmailCode(code);
    setLoading(false);
    if (!result.ok) return setError(result.error ?? 'Could not verify code.');
    router.replace('/');
  }

  if (mode === 'gate') {
    return (
      <AuthBoard
        onBack={back}
        title="Save your progress."
        subtitle="Keep your log and lessons safe across devices."
        controls={
          <>
            <AuthPill kind="ink" icon={<Apple />} label="Continue with Apple" onPress={() => void sso('oauth_apple')} disabled={loading} />
            <AuthPill icon={<Google />} label="Continue with Google" onPress={() => void sso('oauth_google')} disabled={loading} />
            <AuthPill
              label="Continue with email"
              onPress={() => {
                // the gate's Apple/Google refusal belongs to the gate, not to the form
                reset();
                setMode('form');
              }}
            />
          </>
        }
        message={<AuthMessage error={error} notice={notice} />}
        caption={
          <View style={{ paddingHorizontal: 24 }}>
            <AuthLegal />
          </View>
        }
      />
    );
  }

  if (mode === 'verify') {
    return (
      <AuthSurface
        onBack={back}
        title="Check your email."
        sub={`Enter the code we sent to ${email.trim()}.`}
        actions={
          <>
            <AuthMessage error={error} notice={notice} />
            <AuthButton label={loading ? 'Checking…' : 'Continue'} disabled={loading || !code.trim()} onPress={() => void submitCode()} />
            <AuthGhost
              label="Resend code"
              onPress={async () => {
                reset();
                const result = await resendEmailCode();
                if (!result.ok) setError(result.error ?? 'Could not resend code.');
                else setNotice('Code re-sent.');
              }}
            />
          </>
        }>
        <AuthField value={code} onChangeText={setCode} placeholder="6-digit code" keyboardType="number-pad" autoCapitalize="none" autoComplete="one-time-code" textContentType="oneTimeCode" returnKeyType="go" onSubmitEditing={() => code && void submitCode()} />
      </AuthSurface>
    );
  }

  const toggleMethod = () => {
    setUsePassword((on) => !on);
    setPassword('');
    reset();
  };

  return (
    <AuthSurface
      onBack={back}
      title="Create your account."
      sub={usePassword ? 'Choose a password of at least 8 characters.' : 'We’ll email you a 6-digit code. No password needed.'}
      legal
      actions={
        <>
          <AuthMessage error={error} notice={notice} />
          {/* Solid ink whatever the fields hold — pressing it short asks for what's missing. */}
          <AuthButton
            label={loading ? 'Creating account…' : 'Continue'}
            disabled={loading}
            onPress={() => {
              if (!email.trim()) return setError('Enter your email address.');
              if (usePassword && password.length < 8) return setError('Passwords need at least 8 characters.');
              void submit();
            }}
          />
          <AuthGhost label={usePassword ? 'Use an email code instead' : 'Use a password instead'} onPress={toggleMethod} />
        </>
      }>
      <AuthField value={email} onChangeText={setEmail} placeholder="Email address" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
      {/* No password unless you ask for one: the account is made on an emailed code. */}
      {usePassword ? (
        <AuthField value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry autoCapitalize="none" autoComplete="new-password" textContentType="newPassword" />
      ) : null}
      {/* The kit's 26 disc (Enlisting Aegis's rows): ink with the `#111111`
          check when on, the card under the line ring when off. */}
      <Tap
        onPress={() => setUpdates((value) => !value)}
        accessibilityRole="checkbox"
        aria-checked={updates}
        hitSlop={{ top: 10, bottom: 10 }}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <CheckDisc size={26} state={updates ? 'done' : 'pending'} />
        <MonoText v="pTight" style={{ flexShrink: 1 }}>
          Send me VICI updates by email.
        </MonoText>
      </Tap>
    </AuthSurface>
  );
}
