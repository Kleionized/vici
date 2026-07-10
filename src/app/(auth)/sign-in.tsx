import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { AK, AppleMark, AuthBtn, AuthField, AuthGhostLink, AuthNote, AuthSurface, GoogleMark, MailMark } from '@/components/auth/kit';
import { AppText } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { fonts } from '@/lib/theme';

type Mode = 'providers' | 'email' | 'verify';

// ── Sign in (canvas: auth-signin) — the ink surface: "Welcome back."
// centered on the dawn, providers at the foot. Email opens the dark,
// letterpressed field form. ──
export default function SignIn() {
  const router = useRouter();
  const { signInWithPassword, signInWithSSO, verifySignInCode, resendSignInCode } = useAuth();

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
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(auth)/splash'));

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
    setSsoLoading(true);
    reset();
    const res = await signInWithSSO(strategy);
    setSsoLoading(false);
    if (res.ok) return router.replace('/');
    if (res.error) setNotice(res.error);
  }

  // ── verify: the emailed sign-in code ────────────────────────────────
  if (mode === 'verify') {
    return (
      <>
        <StatusBar style="light" />
        <AuthSurface onClose={() => setMode('email')} brand={false}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', gap: 14 }} keyboardShouldPersistTaps="handled">
            <AppText center style={{ fontFamily: fonts.serif, fontSize: 33, lineHeight: 38, color: AK.ink }}>
              Check your email.
            </AppText>
            <AppText center style={{ fontFamily: fonts.sans, fontSize: 14, lineHeight: 21, color: AK.ink2, marginBottom: 8 }}>
              A code is on its way to {email.trim() || 'your email'}.
            </AppText>
            <AuthField label="Verification code" value={code} onChangeText={setCode} placeholder="123456" keyboardType="number-pad" autoCapitalize="none" />
            {error ? <AuthNote danger>{error}</AuthNote> : null}
            {notice ? <AuthNote>{notice}</AuthNote> : null}
            <AuthBtn variant="light" label="Verify & continue" onPress={submitCode} loading={loading} />
            <AuthGhostLink
              pre="Didn’t get it?"
              strong="Resend code"
              onPress={async () => {
                reset();
                const r = await resendSignInCode();
                if (!r.ok) setError(r.error ?? 'Could not resend code.');
                else setNotice('Code re-sent.');
              }}
            />
          </ScrollView>
        </AuthSurface>
      </>
    );
  }

  // ── email + password ────────────────────────────────────────────────
  if (mode === 'email') {
    return (
      <>
        <StatusBar style="light" />
        <AuthSurface onClose={() => setMode('providers')} brand={false}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', gap: 10 }} keyboardShouldPersistTaps="handled">
            <AppText center style={{ fontFamily: fonts.serif, fontSize: 33, lineHeight: 38, color: AK.ink, marginBottom: 14 }}>
              Welcome back.
            </AppText>
            <AuthField label="Email" value={email} onChangeText={setEmail} placeholder="you@email.com" keyboardType="email-address" autoCapitalize="none" />
            <AuthField label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry autoCapitalize="none" />
            {error ? <AuthNote danger>{error}</AuthNote> : null}
            {notice ? <AuthNote>{notice}</AuthNote> : null}
            <View style={{ marginTop: 6, gap: 12 }}>
              <AuthBtn variant="light" label="Sign in" onPress={submitPassword} loading={loading} />
              <AuthGhostLink pre="New here?" strong="Create an account" onPress={() => router.push('/(auth)/sign-up')} />
            </View>
          </ScrollView>
        </AuthSurface>
      </>
    );
  }

  // ── providers — the design's sign-in board ──────────────────────────
  return (
    <>
      <StatusBar style="light" />
      <AuthSurface onClose={back} dawn>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <AppText center style={{ fontFamily: fonts.serif, fontSize: 37, lineHeight: 43, color: AK.ink }}>
            Welcome back.
          </AppText>
        </View>
        <View style={{ gap: 12 }}>
          {notice ? <AuthNote>{notice}</AuthNote> : null}
          <AuthBtn variant="light" mark={<AppleMark color={AK.bg0} />} label="Continue with Apple" loading={ssoLoading} onPress={() => sso('oauth_apple')} />
          <AuthBtn mark={<GoogleMark />} label="Continue with Google" loading={ssoLoading} onPress={() => sso('oauth_google')} />
          <AuthBtn mark={<MailMark color={AK.ink} />} label="Continue with email" onPress={() => setMode('email')} />
          <View style={{ marginTop: 8 }}>
            <AuthGhostLink pre="New here?" strong="Create an account" onPress={() => router.push('/(auth)/sign-up')} />
          </View>
        </View>
      </AuthSurface>
    </>
  );
}
