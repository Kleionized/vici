import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AppText, Button, Field } from '@/components/ui';
import { AppleMark, AuthBtn, AuthHero, AuthStage, GoogleMark, LegalLine, MailMark, Wordmark } from '@/components/auth/kit';
import { useAuth } from '@/lib/auth';
import { colors, spacing } from '@/lib/theme';

type Mode = 'providers' | 'email' | 'verify';

export default function SignIn() {
  const router = useRouter();
  const { signInWithPassword, signInWithSSO, verifySignInCode, resendSignInCode, mode: authMode } = useAuth();

  const [mode, setMode] = useState<Mode>('providers');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);

  const reset = () => {
    setError(null);
    setNotice(null);
  };

  async function submitPassword() {
    setLoading(true);
    reset();
    const res = await signInWithPassword(email, password);
    setLoading(false);
    if (res.ok) {
      router.replace('/');
      return;
    }
    if (res.needsVerification) {
      // Clerk wants an emailed code (device verification / MFA) — finish in-app.
      setMode('verify');
      return;
    }
    setError(res.error ?? 'Could not sign in.');
  }

  async function submitCode() {
    setLoading(true);
    reset();
    const res = await verifySignInCode(code);
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? 'Could not verify code.');
      return;
    }
    router.replace('/');
  }

  async function sso(strategy: 'oauth_apple' | 'oauth_google') {
    setSsoLoading(true);
    reset();
    const res = await signInWithSSO(strategy);
    setSsoLoading(false);
    if (res.ok) {
      router.replace('/');
      return;
    }
    if (res.error) setNotice(res.error);
  }

  // ── verify: the emailed sign-in code ──────────────────────────────────────
  if (mode === 'verify') {
    return (
      <AuthStage>
        <BackRow onPress={() => setMode('email')} />
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', gap: spacing.lg }} keyboardShouldPersistTaps="handled">
          <View style={{ gap: spacing.sm }}>
            <AppText weightOverride="700" color={colors.text} style={{ fontSize: 30, letterSpacing: -0.84 }}>
              Check your email
            </AppText>
            <AppText variant="muted" weightOverride="500" style={{ fontSize: 16, lineHeight: 23 }}>
              This device needs a quick verification — we sent a code to {email.trim() || 'your email'}.
            </AppText>
          </View>
          <Field label="Verification code" value={code} onChangeText={setCode} placeholder="123456" keyboardType="number-pad" autoCapitalize="none" />
          {error ? <AppText color={colors.danger}>{error}</AppText> : null}
          <Button label="Verify & continue" onPress={submitCode} loading={loading} disabled={!code.trim()} />
          <Pressable
            onPress={async () => {
              reset();
              const r = await resendSignInCode();
              if (!r.ok) setError(r.error ?? 'Could not resend code.');
              else setNotice('Code re-sent.');
            }}
            style={{ paddingVertical: spacing.sm }}>
            <AppText variant="soft" center>
              Didn&apos;t get it? <AppText variant="soft" color={colors.text}>Resend code</AppText>
            </AppText>
          </Pressable>
          {notice ? (
            <AppText variant="soft" center>
              {notice}
            </AppText>
          ) : null}
        </ScrollView>
      </AuthStage>
    );
  }

  // ── email + password ───────────────────────────────────────────────────────
  if (mode === 'email') {
    return (
      <AuthStage>
        <BackRow onPress={() => setMode('providers')} />
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', gap: spacing.lg }} keyboardShouldPersistTaps="handled">
          <View style={{ gap: spacing.sm }}>
            <AppText weightOverride="700" color={colors.text} style={{ fontSize: 30, letterSpacing: -0.84 }}>
              Welcome back
            </AppText>
            <AppText variant="muted" weightOverride="500" style={{ fontSize: 16, lineHeight: 23 }}>
              Sign in to pick up right where you left off.
            </AppText>
          </View>

          <Field label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />
          <View style={{ gap: spacing.sm }}>
            <Field label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry autoCapitalize="none" />
            <Pressable
              onPress={() => setNotice(authMode === 'mock' ? 'Offline accounts stay on this device — create a new one if you’re locked out.' : 'If that email exists, we’ll send a reset link.')}
              hitSlop={6}
              style={{ alignSelf: 'flex-end', paddingVertical: spacing.xs }}>
              <AppText variant="soft" color={colors.textMuted} weightOverride="600">
                Forgot password?
              </AppText>
            </Pressable>
          </View>

          {error ? <AppText color={colors.danger}>{error}</AppText> : null}
          {notice ? <AppText variant="soft">{notice}</AppText> : null}

          <Button label="Sign in" onPress={submitPassword} loading={loading} disabled={!email || !password} />

          <Pressable onPress={() => router.push('/(auth)/sign-up')} style={{ paddingVertical: spacing.sm }}>
            <AppText variant="soft" center>
              New here?{' '}
              <AppText variant="soft" color={colors.text} weightOverride="700">
                Create an account
              </AppText>
            </AppText>
          </Pressable>
        </ScrollView>
      </AuthStage>
    );
  }

  // ── providers (the design's login page) ────────────────────────────────────
  return (
    <AuthStage>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <Wordmark />
      </View>

      <AuthHero title="Welcome back." lead="Sign in to pick up right where you left off." />

      <View style={{ gap: 12 }}>
        {notice ? (
          <AppText variant="soft" center style={{ marginBottom: 2 }}>
            {notice}
          </AppText>
        ) : null}
        <AuthBtn variant="dark" mark={<AppleMark color={colors.accentText} />} label="Continue with Apple" loading={ssoLoading} onPress={() => sso('oauth_apple')} />
        <AuthBtn mark={<GoogleMark />} label="Continue with Google" loading={ssoLoading} onPress={() => sso('oauth_google')} />
        <AuthBtn mark={<MailMark color={colors.text} />} label="Continue with email" onPress={() => setMode('email')} />
        <Pressable onPress={() => router.push('/(auth)/sign-up')} style={{ alignItems: 'center', marginTop: 10, paddingVertical: 4 }}>
          <AppText variant="soft" weightOverride="600" style={{ fontSize: 15 }}>
            New here?{' '}
            <AppText weightOverride="700" color={colors.text} style={{ fontSize: 15 }}>
              Create an account
            </AppText>
          </AppText>
        </Pressable>
        <LegalLine />
      </View>
    </AuthStage>
  );
}

function BackRow({ onPress }: { onPress: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
      <Pressable onPress={onPress} hitSlop={10} style={{ padding: 4, marginLeft: -4 }}>
        <Svg width={13} height={22} viewBox="0 0 13 22">
          <Path d="M11 2L2 11l9 9" stroke={colors.text} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Pressable>
    </View>
  );
}
