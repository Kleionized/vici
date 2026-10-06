import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import {
  AuthBoard,
  AuthButton,
  AuthField,
  AuthGhost,
  AuthLegal,
  AuthMessage,
  AuthPill,
  AuthSub,
  AuthSurface,
  AuthTitle,
} from '@/components/auth/kit';
import { Apple, CheckDisc, Google, MonoText, Tap } from '@/components/mono';
import { useAuth } from '@/lib/auth';
import { mono, sans } from '@/lib/theme';

/**
 * Save your progress (the gate) and Create Account (the form).
 *
 * The gate comes first — three ways to keep the run: Apple, Google, or an
 * address. Only the third one asks for anything, and what it asks for is a
 * first name and an email; there is no password unless you go looking for one.
 *
 * Neither board has a frame in this drop (both were withdrawn two drops ago),
 * so they keep their copy and behaviour and take the closest frames' look:
 * the gate is the Login door's stack, the form `03 · Name`'s template.
 */

type Mode = 'gate' | 'form' | 'verify';

export default function SignUp() {
  const router = useRouter();
  const { signUpWithPassword, signInWithSSO, verifyEmailCode, resendEmailCode } = useAuth();
  // `02 · Login` sends "Continue with email" straight to the form — the board
  // it comes from already offered Apple and Google, so the gate would be the
  // same three choices a second time.
  const { step } = useLocalSearchParams<{ step?: string }>();
  const [mode, setMode] = useState<Mode>(step === 'form' ? 'form' : 'gate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [updates, setUpdates] = useState(true);
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
    // A magic-link sign-up still needs a credential in the local mock
    // store; the man never sees or types it.
    const secret = usePassword ? password : `magic-${email.trim().toLowerCase()}`;
    const result = await signUpWithPassword(email, secret, name.trim() || undefined);
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
        subtitle="Your reflections, your log, your path — kept safe across devices."
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
      <AuthSurface onBack={back}>
        <AuthTitle>Check your email.</AuthTitle>
        <AuthSub>A code is on its way to {email.trim()}.</AuthSub>
        <AuthField label="Verification code" value={code} onChangeText={setCode} keyboardType="number-pad" autoCapitalize="none" autoComplete="one-time-code" returnKeyType="go" onSubmitEditing={() => code && void submitCode()} />
        <AuthMessage error={error} notice={notice} />
        <AuthButton label={loading ? 'Checking…' : 'Verify & continue'} disabled={loading || !code.trim()} onPress={() => void submitCode()} />
        <AuthGhost
          label="Resend code"
          onPress={async () => {
            reset();
            const result = await resendEmailCode();
            if (!result.ok) setError(result.error ?? 'Could not resend code.');
            else setNotice('Code re-sent.');
          }}
        />
      </AuthSurface>
    );
  }

  return (
    <AuthSurface onBack={back}>
      <AuthTitle>Start where you are.</AuthTitle>
      <AuthField label="Your first name" value={name} onChangeText={setName} placeholder="Sam" autoCapitalize="words" autoComplete="given-name" textContentType="givenName" />
      <AuthField label="Your email" value={email} onChangeText={setEmail} placeholder="yourname@email.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
      {/* The canvas signs you up on a magic link — no password unless you ask for one. */}
      {usePassword ? (
        <AuthField label="Choose a password" value={password} onChangeText={setPassword} placeholder="At least 8 characters" secureTextEntry autoCapitalize="none" autoComplete="new-password" textContentType="newPassword" />
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
          I’d like VICI updates via email.
        </MonoText>
      </Tap>

      {/* Goal confirmation's card: `#1E1E1E`, r18, padding 18 22, 15/23 sub,
          the run that acts 700 ink. */}
      <View style={{ borderRadius: 18, backgroundColor: mono.card, paddingVertical: 18, paddingHorizontal: 22, gap: 6 }}>
        <Text maxFontSizeMultiplier={1.3} style={{ ...sans('400'), fontSize: 15, lineHeight: 23, color: mono.sub }}>
          {usePassword
            ? 'Your account keeps reflections, logs, and lessons safe across devices. Your password stays private.'
            : "No password needed to create an account! To log in next time, we’ll send you an email with a magic link."}
        </Text>
        <Tap
          onPress={() => {
            setUsePassword((on) => !on);
            setPassword('');
            reset();
          }}
          hitSlop={{ top: 10, bottom: 14, left: 16, right: 16 }}
          style={{ alignSelf: 'flex-start' }}>
          <Text maxFontSizeMultiplier={1.3} style={{ ...sans('700'), fontSize: 15, lineHeight: 23, color: mono.ink }}>
            {usePassword ? 'Use a magic link instead' : 'Use password instead'}
          </Text>
        </Tap>
      </View>

      <AuthMessage error={error} notice={notice} />
      {/* Solid ink whatever the fields hold — pressing it short asks for what's missing. */}
      <AuthButton
        label={loading ? 'Creating account…' : 'Create Account'}
        disabled={loading}
        onPress={() => {
          if (!name.trim()) return setError('Tell us your first name.');
          if (!email.trim()) return setError('Enter your email address.');
          if (usePassword && password.length < 8) return setError('Passwords need at least 8 characters.');
          void submit();
        }}
      />
      <AuthLegal />
    </AuthSurface>
  );
}
