import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { AppleMark, EnvelopeMark, GoogleMark, PaperAuthBack, PaperAuthButton, PaperAuthField, PaperAuthGlow, PaperAuthSurface } from '@/components/auth/kit';
import { AppText, PressScale } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { colors, sans } from '@/lib/theme';

/**
 * 045 · Login — Empty and 046 · Login — Typing.
 *
 * One screen with two faces. At rest it introduces itself: the letter mark,
 * a welcome, and the two one-tap ways in, with the email field kept below an
 * "or". The moment the field is live the pitch gets out of the way — the mark
 * slides up, the pitch collapses to a single line, and the pill becomes
 * "Let's Go", because the keyboard is about to take half the screen.
 *
 * Both faces are fixed compositions, so they are laid out at the canvas's own
 * offsets: the 393 × 852 frame's status bar ends at 54, and every `top` below
 * is that design y minus 54, measured from the safe area.
 */

type Mode = 'email' | 'password' | 'verify';

export default function SignIn() {
  const router = useRouter();
  const { signInWithPassword, signInWithSSO, verifySignInCode, resendSignInCode } = useAuth();
  const [mode, setMode] = useState<Mode>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // The board switches the moment the field is in play.
  const typing = focused || email.length > 0;

  const reset = () => {
    setError(null);
    setNotice(null);
  };
  const back = () => {
    reset();
    if (mode === 'verify') return setMode('password');
    setMode('email');
  };
  /**
   * Leaving the landing board, as opposed to stepping back within the flow.
   *
   * Where sign-in was pushed — from All, say — this is the previous screen.
   * On a cold start there is no previous screen: the splash `replace`s into
   * here, so sign-in is the root of the auth stack. Rather than show a control
   * that does nothing, the row then steps back out of the typing state to the
   * board's own starting point, which is the same thing `back` already does
   * between the password and code steps.
   */
  const canLeave = router.canGoBack() || typing;
  const leave = () => {
    reset();
    if (router.canGoBack()) return router.back();
    setEmail('');
    setFocused(false);
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


  if (mode === 'email') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style="dark" />
        <PaperAuthGlow />
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
          <View style={{ flex: 1 }}>
            {/* The way back out of the landing board. The canvas draws no Back
                here — it composes this frame as the app's first screen — but
                sign-in is also pushed from All, and a pushed screen with no
                back row strands you. Shown only when there is somewhere to
                return to: arriving from the splash is a `replace`, so on the
                cold-start path there is nothing behind this and a back row
                would be a dead control.

                The row itself is the one the board's own password and code
                steps already use, so the affordance does not change shape
                partway through the flow. */}
            {canLeave ? (
              <View style={{ position: 'absolute', left: 0, top: 10, zIndex: 5 }}>
                <PaperAuthBack onPress={leave} />
              </View>
            ) : null}

            {/* the mark rides up 10 when the keyboard is coming — design y 150 → 140 */}
            <View style={{ position: 'absolute', left: 0, right: 0, top: typing ? 86 : 96, alignItems: 'center' }}>
              <EnvelopeMark />
            </View>

            {typing ? (
              <>
                <AppText style={[sans('400'), { position: 'absolute', left: 24, top: 316, fontSize: 15, color: colors.textTitle }]}>
                  Sign in to keep building toward the life you want
                </AppText>

                <View
                  style={{
                    position: 'absolute',
                    left: 24,
                    right: 24,
                    top: 347,
                    height: 58,
                    borderRadius: 16,
                    backgroundColor: colors.surface,
                    borderWidth: 2,
                    borderColor: 'rgba(0,0,0,0.24)',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 20,
                    paddingRight: 18,
                  }}>
                  <EmailInput value={email} onChangeText={setEmail} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onSubmit={continueWithEmail} autoFocus />
                  {email.length ? (
                    <PressScale
                      onPress={() => {
                        setEmail('');
                        reset();
                      }}
                      accessibilityRole="button"
                      accessibilityLabel="Clear email"
                      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                      style={{ width: 24, height: 24, minHeight: 0 }}>
                      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                        <Path d="M5 5l14 14M19 5L5 19" stroke="#8B8882" strokeWidth={2.2} strokeLinecap="round" />
                      </Svg>
                    </PressScale>
                  ) : null}
                </View>

                <View style={{ position: 'absolute', left: 24, right: 24, top: 409 }}>
                  <Message error={error} notice={notice} />
                </View>

                <View style={{ position: 'absolute', left: 24, right: 24, top: 429 }}>
                  <PaperAuthButton label="Let's Go" onPress={continueWithEmail} />
                </View>
              </>
            ) : (
              <>
                <AppText style={[sans('600'), { position: 'absolute', left: 24, top: 326, fontSize: 27, letterSpacing: -0.2, color: colors.text }]}>Welcome back.</AppText>
                <AppText style={[sans('400'), { position: 'absolute', left: 24, top: 366, fontSize: 14.5, color: colors.textSoft }]}>Sign in to keep the run going.</AppText>

                <PressScale
                  onPress={() => void sso('oauth_apple')}
                  disabled={loading}
                  accessibilityRole="button"
                  style={{ position: 'absolute', left: 24, right: 24, top: 418, height: 54, borderRadius: 27, backgroundColor: colors.ink, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
                  <AppleMark color="#FFFFFF" />
                  <AppText style={[sans('600'), { fontSize: 16, color: '#FFFFFF' }]}>Continue with Apple</AppText>
                </PressScale>

                <PressScale
                  onPress={() => void sso('oauth_google')}
                  disabled={loading}
                  accessibilityRole="button"
                  style={{ position: 'absolute', left: 24, right: 24, top: 484, height: 54, borderRadius: 27, backgroundColor: colors.surface, boxShadow: '0 0 0 1px rgba(0,0,0,0.12)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <GoogleMark />
                  <AppText style={[sans('600'), { fontSize: 16, color: colors.text }]}>Continue with Google</AppText>
                </PressScale>

                <View style={{ position: 'absolute', left: 24, right: 24, top: 560, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(0,0,0,0.1)' }} />
                  <AppText style={[sans('500'), { fontSize: 12.5, color: colors.textSoft }]}>or</AppText>
                  <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(0,0,0,0.1)' }} />
                </View>

                <View
                  style={{
                    position: 'absolute',
                    left: 24,
                    right: 24,
                    top: 588,
                    height: 56,
                    borderRadius: 16,
                    backgroundColor: colors.surface,
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.09)',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingLeft: 20,
                    paddingRight: 8,
                  }}>
                  <EmailInput value={email} onChangeText={setEmail} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onSubmit={continueWithEmail} size={16.5} />
                  <PressScale
                    onPress={continueWithEmail}
                    accessibilityRole="button"
                    accessibilityLabel="Continue with email"
                    style={{ width: 40, height: 40, minHeight: 0, borderRadius: 20, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
                    <Svg width={15} height={13} viewBox="0 0 16 14" fill="none">
                      <Path d="M1.5 7h12M9 2.5L13.5 7 9 11.5" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </PressScale>
                </View>

                <View style={{ position: 'absolute', left: 24, right: 24, top: 650 }}>
                  <Message error={error} notice={notice} />
                </View>

                <PressScale
                  onPress={() => router.push('/(auth)/sign-up')}
                  accessibilityRole="button"
                  hitSlop={{ top: 16, bottom: 16, left: 20, right: 20 }}
                  style={{ position: 'absolute', left: 0, right: 0, top: 686, minHeight: 0, alignItems: 'center' }}>
                  <AppText style={[sans('400'), { fontSize: 13.5, color: colors.textSoft }]}>
                    New here? <AppText style={[sans('600'), { fontSize: 13.5, color: colors.text }]}>Create an account</AppText>
                  </AppText>
                </PressScale>
              </>
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <PaperAuthSurface onBack={back} glow>
        {mode === 'password' ? (
          <View style={{ flex: 1, justifyContent: 'center', gap: 14 }}>
            <AppText center style={[sans('500'), { fontSize: 22, letterSpacing: 0.1, color: colors.text, marginBottom: 18 }]}>Welcome back.</AppText>
            <PaperAuthField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
            <PaperAuthField
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
            <Message error={error} notice={notice} />
            <View style={{ marginTop: 10 }}>
              <PaperAuthButton label={loading ? 'Signing in…' : 'Sign in'} disabled={loading} onPress={() => (password ? void submitPassword() : setError('Enter your password.'))} />
            </View>
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', gap: 14 }}>
            <AppText center style={[sans('500'), { fontSize: 22, letterSpacing: 0.1, color: colors.text }]}>Check your email.</AppText>
            <AppText center style={[sans('400'), { fontSize: 14.5, lineHeight: 21, color: colors.textMuted, marginBottom: 12 }]}>A code is on its way to {email.trim()}.</AppText>
            <PaperAuthField label="Verification code" value={code} onChangeText={setCode} keyboardType="number-pad" autoCapitalize="none" autoComplete="one-time-code" returnKeyType="go" onSubmitEditing={() => code && void submitCode()} />
            <Message error={error} notice={notice} />
            <PaperAuthButton label={loading ? 'Checking…' : 'Verify & continue'} disabled={loading} onPress={() => (code.trim() ? void submitCode() : setError('Enter the code we sent.'))} />
            <PressScale
              onPress={async () => {
                reset();
                const result = await resendSignInCode();
                if (!result.ok) setError(result.error ?? 'Could not resend code.');
                else setNotice('Code re-sent.');
              }}
              style={{ minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
              <AppText style={[sans('500'), { fontSize: 14.5, color: colors.textMuted }]}>Resend code</AppText>
            </PressScale>
          </View>
        )}
      </PaperAuthSurface>
    </>
  );
}

/** The bare email input the two login states share. */
function EmailInput({
  value,
  onChangeText,
  onFocus,
  onBlur,
  onSubmit,
  size = 19,
  autoFocus,
}: {
  value: string;
  onChangeText: (v: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSubmit: () => void;
  size?: number;
  autoFocus?: boolean;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      onFocus={onFocus}
      onBlur={onBlur}
      onSubmitEditing={onSubmit}
      autoFocus={autoFocus}
      placeholder="yourname@email.com"
      placeholderTextColor="rgba(90,88,82,0.5)"
      // the canvas draws a 2.5pt ink caret beside the address; the system one
      // is the only caret we get, so it is tinted to match
      selectionColor={colors.ink}
      keyboardType="email-address"
      autoCapitalize="none"
      autoComplete="email"
      textContentType="emailAddress"
      returnKeyType="done"
      style={[
        sans('400'),
        { flex: 1, fontSize: size, color: colors.text, paddingVertical: 0 },
        Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null,
      ]}
    />
  );
}

function Message({ error, notice }: { error: string | null; notice: string | null }) {
  const message = error || notice;
  if (!message) return null;
  return <AppText center selectable style={[sans('500'), { fontSize: 13, lineHeight: 19, color: error ? colors.danger : colors.textMuted }]}>{message}</AppText>;
}
