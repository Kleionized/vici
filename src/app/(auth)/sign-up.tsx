import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { AK, AppleMark, AuthBtn, AuthField, AuthGhostLink, AuthLegal, AuthNote, AuthSurface, GoogleMark } from '@/components/auth/kit';
import { AppText } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { fonts, sans } from '@/lib/theme';

type Mode = 'form' | 'verify';

// ── Sign up (canvas: auth-signup) — the ink surface: the moonlit sea and
// boat above "Create your account.", letterpressed fields, providers under
// an OR rule. ──
export default function SignUp() {
  const router = useRouter();
  const { signUpWithPassword, signInWithSSO, verifyEmailCode, resendEmailCode } = useAuth();

  const [mode, setMode] = useState<Mode>('form');
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
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(auth)/splash'));

  async function submit() {
    setLoading(true);
    reset();
    const res = await signUpWithPassword(email, password, name.trim() || undefined);
    setLoading(false);
    if (res.ok) return router.replace('/');
    if (res.needsVerification) return setMode('verify');
    setError(res.error ?? 'Could not create the account.');
  }

  async function submitCode() {
    setLoading(true);
    reset();
    const res = await verifyEmailCode(code);
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

  if (mode === 'verify') {
    return (
      <>
        <StatusBar style="light" />
        <AuthSurface onClose={() => setMode('form')} brand={false}>
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
                const r = await resendEmailCode();
                if (!r.ok) setError(r.error ?? 'Could not resend code.');
                else setNotice('Code re-sent.');
              }}
            />
          </ScrollView>
        </AuthSurface>
      </>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <AuthSurface onClose={back} dawn>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', gap: 28 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <AppText center style={{ fontFamily: fonts.serif, fontSize: 35, lineHeight: 40, color: AK.ink }}>
            Create your account.
          </AppText>

          <View style={{ gap: 10 }}>
            <AuthField label="Name" value={name} onChangeText={setName} placeholder="A first name, or an alias" autoCapitalize="words" />
            <AuthField label="Email" value={email} onChangeText={setEmail} placeholder="you@email.com" keyboardType="email-address" autoCapitalize="none" />
            <AuthField label="Password" value={password} onChangeText={setPassword} placeholder="Choose a password" secureTextEntry autoCapitalize="none" />
            {error ? <AuthNote danger>{error}</AuthNote> : null}
            {notice ? <AuthNote>{notice}</AuthNote> : null}
          </View>

          <View style={{ gap: 12 }}>
            <AuthBtn variant="light" label="Create account" onPress={submit} loading={loading} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 2 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: AK.hair }} />
              <AppText style={[sans('600'), { fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: AK.ink3 }]}>or</AppText>
              <View style={{ flex: 1, height: 1, backgroundColor: AK.hair }} />
            </View>
            <AuthBtn variant="light" mark={<AppleMark color={AK.bg0} />} label="Continue with Apple" loading={ssoLoading} onPress={() => sso('oauth_apple')} />
            <AuthBtn mark={<GoogleMark />} label="Continue with Google" loading={ssoLoading} onPress={() => sso('oauth_google')} />
            <AuthGhostLink pre="Already have an account?" strong="Sign in" onPress={() => router.push('/(auth)/sign-in')} />
            <AuthLegal />
          </View>
        </ScrollView>
      </AuthSurface>
    </>
  );
}
