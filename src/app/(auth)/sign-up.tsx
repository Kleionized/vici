import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AppText, Button, Field } from '@/components/ui';
import { AppleMark, AuthBtn, AuthHero, AuthStage, GoogleMark, LegalLine, MailMark, Wordmark } from '@/components/auth/kit';
import { useAuth } from '@/lib/auth';
import { colors, spacing } from '@/lib/theme';

type Mode = 'providers' | 'email' | 'verify';

export default function SignUp() {
  const router = useRouter();
  const { signUpWithPassword, signInWithSSO, verifyEmailCode, resendEmailCode, mode: authMode } = useAuth();

  const [mode, setMode] = useState<Mode>('providers');
  const [name, setName] = useState('');
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

  async function submit() {
    setLoading(true);
    reset();
    const res = await signUpWithPassword(email, password, name);
    setLoading(false);
    if (res.ok) {
      router.replace('/');
      return;
    }
    if (res.needsVerification) {
      setMode('verify');
      return;
    }
    setError(res.error ?? 'Could not create account.');
  }

  async function verify() {
    setLoading(true);
    reset();
    const res = await verifyEmailCode(code);
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

  // ── verify: the emailed sign-up code ───────────────────────────────────────
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
              We sent a verification code to {email.trim() || 'your email'}. Enter it to finish.
            </AppText>
          </View>

          <Field label="Verification code" value={code} onChangeText={setCode} placeholder="123456" keyboardType="number-pad" autoCapitalize="none" />
          {error ? <AppText color={colors.danger}>{error}</AppText> : null}
          {notice ? (
            <AppText variant="soft" center>
              {notice}
            </AppText>
          ) : null}
          <Button label="Verify & continue" onPress={verify} loading={loading} disabled={!code.trim()} />
          <Pressable
            onPress={async () => {
              reset();
              const r = await resendEmailCode();
              if (!r.ok) setError(r.error ?? 'Could not resend code.');
              else setNotice('Code re-sent.');
            }}
            style={{ paddingVertical: spacing.sm }}>
            <AppText variant="soft" center>
              Didn&apos;t get it? <AppText variant="soft" color={colors.text}>Resend code</AppText>
            </AppText>
          </Pressable>
        </ScrollView>
      </AuthStage>
    );
  }

  // ── email + password form ──────────────────────────────────────────────────
  if (mode === 'email') {
    return (
      <AuthStage>
        <BackRow onPress={() => setMode('providers')} />
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', gap: spacing.lg }} keyboardShouldPersistTaps="handled">
          <View style={{ gap: spacing.sm }}>
            <AppText weightOverride="700" color={colors.text} style={{ fontSize: 30, letterSpacing: -0.84 }}>
              Start where you are
            </AppText>
            <AppText variant="muted" weightOverride="500" style={{ fontSize: 16, lineHeight: 23 }}>
              No streaks to protect. Just a place to build a life worth living.
            </AppText>
          </View>

          <Field label="Name (optional)" value={name} onChangeText={setName} placeholder="What should we call you?" autoCapitalize="words" />
          <Field label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />
          <Field label="Password" value={password} onChangeText={setPassword} placeholder="Choose a password" secureTextEntry autoCapitalize="none" />

          {error ? <AppText color={colors.danger}>{error}</AppText> : null}

          <Button label="Create account" onPress={submit} loading={loading} disabled={!email || !password} />

          <Pressable onPress={() => router.push('/(auth)/sign-in')} style={{ paddingVertical: spacing.sm }}>
            <AppText variant="soft" center>
              Already have an account? <AppText variant="soft" color={colors.text}>Sign in</AppText>
            </AppText>
          </Pressable>

          {/* Clerk smart-CAPTCHA mount point (bot protection on sign-up). */}
          <View nativeID="clerk-captcha" />
        </ScrollView>
      </AuthStage>
    );
  }

  // ── providers ──────────────────────────────────────────────────────────────
  return (
    <AuthStage>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <Wordmark />
        <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/(auth)/sign-in'))} hitSlop={10} accessibilityLabel="Close" style={{ padding: 4, marginRight: -4 }}>
          <Svg width={20} height={20} viewBox="0 0 20 20">
            <Path d="M3 3l14 14M17 3L3 17" stroke={colors.textSoft} strokeWidth={2.4} strokeLinecap="round" />
          </Svg>
        </Pressable>
      </View>

      <AuthHero title="Start where you are." lead="A calm, private place to begin — no streaks to protect." />

      <View style={{ gap: 12 }}>
        {notice ? (
          <AppText variant="soft" center style={{ marginBottom: 2 }}>
            {notice}
          </AppText>
        ) : null}
        <AuthBtn variant="dark" mark={<AppleMark color={colors.accentText} />} label="Continue with Apple" loading={ssoLoading} onPress={() => sso('oauth_apple')} />
        <AuthBtn mark={<GoogleMark />} label="Continue with Google" loading={ssoLoading} onPress={() => sso('oauth_google')} />
        <AuthBtn mark={<MailMark color={colors.text} />} label="Sign up with email" onPress={() => setMode('email')} />
        <Pressable onPress={() => router.push('/(auth)/sign-in')} style={{ alignItems: 'center', marginTop: 10, paddingVertical: 4 }}>
          <AppText variant="soft" weightOverride="600" style={{ fontSize: 15 }}>
            Already have an account?{' '}
            <AppText weightOverride="700" color={colors.text} style={{ fontSize: 15 }}>
              Sign in
            </AppText>
          </AppText>
        </Pressable>
        <LegalLine />
      </View>

      {/* Clerk smart-CAPTCHA mount point (bot protection on sign-up). */}
      <View nativeID="clerk-captcha" />
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
