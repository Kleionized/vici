import { useRouter } from 'expo-router';
import { useState } from 'react';

import {
  AuthButton,
  AuthDoor,
  AuthField,
  AuthGhost,
  AuthMessage,
  AuthSurface,
  codePrompt,
} from '@/components/auth/kit';
import { useAuth } from '@/lib/auth';

/**
 * 02B · Welcome Back — the returning-user door.
 *
 * The frame is `02 · Login` with four strings changed: "Welcome back.", "Sign
 * in to pick up where you left off.", "Sign in with email", and a footer that
 * sends new arrivals back to the login board. It is drawn by the same
 * `AuthDoor`, which is why only those four strings live there.
 *
 * Everything past the door is this route's too: the address step, the emailed
 * code, the password step and the password reset. None has a frame; they keep
 * the overhaul's vocabulary — the address step the door's laurel and centred
 * title over Name's field, the others Name's template (see
 * `src/components/auth/kit.tsx`).
 *
 * The address step's "Let’s Go" emails a sign-in code — the road an account
 * made without a password has to take, and the default for everyone (deploy
 * D410). A password is the alternative a ghost link away, and the password
 * board carries "Forgot password?" (Clerk's reset_password_email_code).
 */

type Mode = 'door' | 'password' | 'verify' | 'reset';

export default function WelcomeBack() {
  const router = useRouter();
  const { signInWithPassword, sendSignInCode, signInWithSSO, verifySignInCode, resendSignInCode, startPasswordReset, completePasswordReset } = useAuth();
  const [mode, setMode] = useState<Mode>('door');
  /** The board a code was asked for from — where Back on the code board returns. */
  const [codeFrom, setCodeFrom] = useState<'door' | 'password' | 'reset'>('door');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
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
    setCode('');
    if (mode === 'verify') return setMode(codeFrom);
    if (mode === 'reset') return setMode('password');
    setMode('door');
  };
  /** Out of the address step and back to the door this route opened on. */
  const leave = () => {
    reset();
    setEmail('');
    setEmailStep(false);
  };

  /** The address step's primary: email a sign-in code. */
  async function sendCode() {
    if (!email.trim()) return setError('Enter your email address to carry on.');
    setLoading(true);
    reset();
    const res = await sendSignInCode(email);
    setLoading(false);
    if (!res.ok) return setError(res.error ?? 'Could not send a code.');
    setCode('');
    setCodeFrom('door');
    setMode('verify');
  }

  const usePasswordInstead = () => {
    reset();
    setMode('password');
  };

  async function submitPassword() {
    setLoading(true);
    reset();
    const res = await signInWithPassword(email, password);
    setLoading(false);
    if (res.ok) return router.replace('/');
    if (res.needsVerification) {
      setCode('');
      setCodeFrom('password');
      return setMode('verify');
    }
    setError(res.error ?? 'Could not sign in.');
  }

  async function forgotPassword() {
    if (!email.trim()) return setError('Enter your email first, and we’ll send a reset code.');
    setLoading(true);
    reset();
    const res = await startPasswordReset(email);
    setLoading(false);
    if (!res.ok) return setError(res.error ?? 'Could not send a reset code.');
    setCode('');
    setNewPassword('');
    setMode('reset');
  }

  async function submitReset() {
    if (!code.trim()) return setError('Enter the code we sent.');
    if (newPassword.length < 8) return setError('Passwords need at least 8 characters.');
    setLoading(true);
    reset();
    const res = await completePasswordReset(code, newPassword);
    setLoading(false);
    if (res.ok) return router.replace('/');
    if (res.needsVerification) {
      setCode('');
      setCodeFrom('reset');
      return setMode('verify');
    }
    setError(res.error ?? 'Could not reset the password.');
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
    // The address step: the typed boards' shell (D520), the pill straight under
    // the field so the keyboard — which opens with the board — never covers it.
    return (
      <AuthSurface
        onBack={leave}
        title="Sign in with email."
        sub="We’ll send you a 6-digit code."
        actions={
          <>
            <AuthMessage error={error} notice={notice} />
            <AuthButton label={loading ? 'Sending code…' : 'Continue'} disabled={loading} onPress={() => void sendCode()} />
            <AuthGhost label="Use a password instead" onPress={usePasswordInstead} />
          </>
        }>
        <AuthField
          value={email}
          onChangeText={setEmail}
          onClear={() => {
            setEmail('');
            reset();
          }}
          onSubmitEditing={() => void sendCode()}
          autoFocus
          placeholder="Email address"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="done"
        />
      </AuthSurface>
    );
  }

  if (mode === 'password') {
    return (
      <AuthSurface
        onBack={back}
        title="Welcome back."
        actions={
          <>
            <AuthMessage error={error} notice={notice} />
            <AuthButton label={loading ? 'Signing in…' : 'Sign in'} disabled={loading} onPress={() => (password ? void submitPassword() : setError('Enter your password.'))} />
            <AuthGhost label="Forgot password?" onPress={() => void forgotPassword()} />
            <AuthGhost
              label="Email me a code instead"
              onPress={() => {
                setEmailStep(true);
                void sendCode();
              }}
            />
          </>
        }>
        <AuthField value={email} onChangeText={setEmail} placeholder="Email address" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
        <AuthField
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="current-password"
          returnKeyType="go"
          onSubmitEditing={() => password && void submitPassword()}
        />
      </AuthSurface>
    );
  }

  if (mode === 'reset') {
    return (
      <AuthSurface
        onBack={back}
        title="Reset your password."
        sub={codePrompt(email)}
        actions={
          <>
            <AuthMessage error={error} notice={notice} />
            <AuthButton label={loading ? 'Resetting…' : 'Reset & sign in'} disabled={loading} onPress={() => void submitReset()} />
            <AuthGhost
              label="Resend code"
              onPress={async () => {
                reset();
                const result = await startPasswordReset(email);
                if (!result.ok) setError(result.error ?? 'Could not resend code.');
                else setNotice('Code re-sent.');
              }}
            />
          </>
        }>
        <AuthField value={code} onChangeText={setCode} placeholder="6-digit code" keyboardType="number-pad" autoCapitalize="none" autoComplete="one-time-code" textContentType="oneTimeCode" />
        <AuthField
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="New password (8 or more characters)"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="go"
          onSubmitEditing={() => void submitReset()}
        />
      </AuthSurface>
    );
  }

  return (
    <AuthSurface
      onBack={back}
      title="Check your email."
      sub={codePrompt(email)}
      actions={
        <>
          <AuthMessage error={error} notice={notice} />
          <AuthButton label={loading ? 'Checking…' : 'Continue'} disabled={loading} onPress={() => (code.trim() ? void submitCode() : setError('Enter the code we sent.'))} />
          <AuthGhost
            label="Resend code"
            onPress={async () => {
              reset();
              const result = await resendSignInCode();
              if (!result.ok) setError(result.error ?? 'Could not resend code.');
              else setNotice('Code re-sent.');
            }}
          />
          {codeFrom === 'door' ? <AuthGhost label="Use a password instead" onPress={usePasswordInstead} /> : null}
        </>
      }>
      <AuthField value={code} onChangeText={setCode} placeholder="6-digit code" keyboardType="number-pad" autoCapitalize="none" autoComplete="one-time-code" textContentType="oneTimeCode" returnKeyType="go" onSubmitEditing={() => code && void submitCode()} />
    </AuthSurface>
  );
}
