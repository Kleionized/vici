import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import {
  AuthButton,
  AuthDoor,
  AuthField,
  AuthGhost,
  AuthLaurel,
  AuthMessage,
  AuthSub,
  AuthSurface,
  AuthTitle,
} from '@/components/auth/kit';
import { NavBar, Screen, ScrollRegion } from '@/components/mono';
import { useAuth } from '@/lib/auth';

/**
 * 02B · Welcome Back — the returning-user door.
 *
 * The frame is `02 · Login` with four strings changed: "Welcome back.", "Sign
 * in to pick up where you left off.", "Sign in with email", and a footer that
 * sends new arrivals back to the login board. It is drawn by the same
 * `AuthDoor`, which is why only those four strings live there.
 *
 * Everything past the door is this route's too: the address step, the password
 * step and the verification code. None has a frame; they keep their copy and
 * behaviour and take the overhaul's vocabulary — the address step the door's
 * laurel and centred title over Name's field, the other two Name's template
 * (see `src/components/auth/kit.tsx`).
 */

type Mode = 'door' | 'password' | 'verify';

export default function WelcomeBack() {
  const router = useRouter();
  const { signInWithPassword, signInWithSSO, verifySignInCode, resendSignInCode } = useAuth();
  const [mode, setMode] = useState<Mode>('door');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  /**
   * The address step, opened from the door's email pill.
   *
   * It cannot ride on the field's focus alone: blurring an empty field would
   * drop the board back to the door mid-flow, which is not what the control did
   * when the board carried the field itself.
   */
  const [emailStep, setEmailStep] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setError(null);
    setNotice(null);
  };
  const back = () => {
    reset();
    if (mode === 'verify') return setMode('password');
    setMode('door');
  };
  /** Out of the address step and back to the door this route opened on. */
  const leave = () => {
    reset();
    setEmail('');
    setEmailStep(false);
  };

  const continueWithEmail = () => {
    if (!email.trim()) return setError('Enter your email address to carry on.');
    reset();
    setMode('password');
  };

  async function submitPassword() {
    setLoading(true);
    reset();
    const res = await signInWithPassword(email, password);
    setLoading(false);
    if (res.ok) return router.replace('/');
    if (res.needsVerification) return setMode('verify');
    setError(res.error ?? 'Could not sign in.');
  }

  async function submitCode() {
    setLoading(true);
    reset();
    const res = await verifySignInCode(code);
    setLoading(false);
    if (!res.ok) return setError(res.error ?? 'Could not verify code.');
    router.replace('/');
  }

  async function sso(strategy: 'oauth_apple' | 'oauth_google') {
    setLoading(true);
    reset();
    const res = await signInWithSSO(strategy);
    setLoading(false);
    if (res.ok) return router.replace('/');
    setError(res.error ?? 'Could not complete sign in.');
  }

  if (mode === 'door' && !emailStep) {
    return (
      <AuthDoor
        variant="returning"
        loading={loading}
        message={<AuthMessage error={error} notice={notice} />}
        onApple={() => void sso('oauth_apple')}
        onGoogle={() => void sso('oauth_google')}
        onEmail={() => {
          reset();
          setEmailStep(true);
        }}
        // "New here? Create an account" is the way back to `02 · Login`,
        // which is where this board was opened from.
        onFooter={() => (router.canGoBack() ? router.back() : router.replace('/(auth)/sign-in'))}
      />
    );
  }

  if (mode === 'door') {
    // The address step. No frame draws it: the door's laurel (150) and centred
    // title (284) over Name's field, with the pill straight under it so the
    // keyboard — which opens with the board — never covers it.
    return (
      <Screen>
        <NavBar left="back" right="empty" onBack={leave} />
        <ScrollRegion top={100} contentStyle={{ paddingHorizontal: 24, paddingTop: 50, paddingBottom: 48 }}>
          <AuthLaurel />
          <View style={{ marginTop: 30, gap: 14 }}>
            <AuthTitle center>Sign in to keep building toward the life you want</AuthTitle>
            <AuthField
              value={email}
              onChangeText={setEmail}
              onClear={() => {
                setEmail('');
                reset();
              }}
              onSubmitEditing={continueWithEmail}
              autoFocus
              placeholder="yourname@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="done"
            />
            <AuthMessage error={error} notice={notice} />
            <AuthButton label="Let's Go" onPress={continueWithEmail} />
          </View>
        </ScrollRegion>
      </Screen>
    );
  }

  return (
    <AuthSurface onBack={back}>
      {mode === 'password' ? (
        <>
          <AuthTitle>Welcome back.</AuthTitle>
          <AuthField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
          <AuthField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="current-password"
            returnKeyType="go"
            onSubmitEditing={() => password && void submitPassword()}
          />
          <AuthMessage error={error} notice={notice} />
          <AuthButton label={loading ? 'Signing in…' : 'Sign in'} disabled={loading} onPress={() => (password ? void submitPassword() : setError('Enter your password.'))} />
        </>
      ) : (
        <>
          <AuthTitle>Check your email.</AuthTitle>
          <AuthSub>A code is on its way to {email.trim()}.</AuthSub>
          <AuthField label="Verification code" value={code} onChangeText={setCode} keyboardType="number-pad" autoCapitalize="none" autoComplete="one-time-code" returnKeyType="go" onSubmitEditing={() => code && void submitCode()} />
          <AuthMessage error={error} notice={notice} />
          <AuthButton label={loading ? 'Checking…' : 'Verify & continue'} disabled={loading} onPress={() => (code.trim() ? void submitCode() : setError('Enter the code we sent.'))} />
          <AuthGhost
            label="Resend code"
            onPress={async () => {
              reset();
              const result = await resendSignInCode();
              if (!result.ok) setError(result.error ?? 'Could not resend code.');
              else setNotice('Code re-sent.');
            }}
          />
        </>
      )}
    </AuthSurface>
  );
}
