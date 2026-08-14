import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { PaperAuthButton, PaperAuthField, PaperAuthLegal, PaperAuthSurface } from '@/components/auth/kit';
import { AppText, PressScale } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { colors, sans } from '@/lib/theme';

/**
 * 102 · Save your progress and 047 · Create Account.
 *
 * The gate comes first — three ways to keep the run: Apple, Google, or an
 * address. Only the third one asks for anything, and what it asks for is a
 * first name and an email; there is no password unless you go looking for one.
 *
 * Design y's are quoted from the 393 × 852 canvas; the surface's Back row is
 * 40 tall, so content below it starts at design y 94.
 */

const laurelMark = require('../../../assets/images/laurel-mark.webp');

type Mode = 'gate' | 'form' | 'verify';

export default function SignUp() {
  const router = useRouter();
  const { signUpWithPassword, signInWithSSO, verifyEmailCode, resendEmailCode } = useAuth();
  const [mode, setMode] = useState<Mode>('gate');
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
    if (mode === 'form') return setMode('gate');
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

  return (
    <>
      <StatusBar style="dark" />
      <PaperAuthSurface onBack={back}>
        {mode === 'gate' ? (
          // 102 — design y 140 / 196 / 290 / 430 / 502 / 574 / 656
          <View style={{ paddingTop: 46 }}>
            {/* canvas line-height:1.32 on a 22px face */}
            <AppText center style={[sans('500'), { marginHorizontal: 2, fontSize: 22, lineHeight: 29.04, letterSpacing: 0.1, color: colors.text }]}>Save your progress.</AppText>
            <AppText center style={[sans('400'), { marginTop: 27, marginHorizontal: 6, fontSize: 15.5, lineHeight: 23, color: colors.textMuted }]}>
              Your reflections, your log, your path — kept safe across devices.
            </AppText>
            <Image source={laurelMark} contentFit="contain" style={{ marginTop: 48, alignSelf: 'center', width: 88, height: 88, opacity: 0.9 }} />

            <View style={{ marginTop: 52, gap: 16 }}>
              <GateButton label="Continue with Apple" onPress={() => void sso('oauth_apple')} disabled={loading} />
              <GateButton label="Continue with Google" onPress={() => void sso('oauth_google')} disabled={loading} secondary />
              <GateButton label="Continue with email" onPress={() => setMode('form')} secondary />
            </View>

            <View style={{ marginTop: 6 }}>
              <Message error={error} notice={notice} />
            </View>
            <View style={{ marginTop: 20 }}>
              <PaperAuthLegal size={12} />
            </View>
          </View>
        ) : mode === 'form' ? (
          // 047 — design y 126 / 205 / 319 / 428 / 470 / 592 / 668
          <View style={{ paddingTop: 32 }}>
            <AppText center style={[sans('500'), { fontSize: 22, letterSpacing: 0.1, color: colors.text }]}>Start where you are.</AppText>

            <View style={{ marginTop: 53 }}>
              <PaperAuthField label="Your first name" value={name} onChangeText={setName} placeholder="Sam" autoCapitalize="words" autoComplete="given-name" textContentType="givenName" />
            </View>
            <View style={{ marginTop: 34 }}>
              <PaperAuthField label="Your email" value={email} onChangeText={setEmail} placeholder="yourname@email.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
            </View>
            {/* The canvas signs you up on a magic link — no password unless
                you ask for one. */}
            {usePassword ? (
              <View style={{ marginTop: 34 }}>
                <PaperAuthField label="Choose a password" value={password} onChangeText={setPassword} placeholder="At least 8 characters" secureTextEntry autoCapitalize="none" autoComplete="new-password" textContentType="newPassword" />
              </View>
            ) : null}

            <PressScale
              onPress={() => setUpdates((value) => !value)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: updates }}
              hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
              style={{ marginTop: 29, height: 27, minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View
                style={{
                  width: 27,
                  height: 27,
                  borderRadius: 8,
                  backgroundColor: updates ? colors.ink : colors.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: updates ? undefined : '0 0 0 1px rgba(0,0,0,0.12)',
                }}>
                {updates ? (
                  <Svg width={14} height={11} viewBox="0 0 14 11" fill="none">
                    <Path d="M1.5 5.5l3.6 3.8L12.5 1.5" stroke="#FFFFFF" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                ) : null}
              </View>
              <AppText style={[sans('400'), { fontSize: 13.5, color: colors.textMuted }]}>I&apos;d like VICI updates via email.</AppText>
            </PressScale>

            <View style={{ marginTop: 15, borderRadius: 12, backgroundColor: colors.surface, paddingVertical: 12, paddingHorizontal: 16, boxShadow: '0 0 0 1px rgba(0,0,0,0.09)' }}>
              <AppText style={[sans('400'), { fontSize: 13.5, lineHeight: 20.5, color: colors.textMuted }]}>
                {usePassword
                  ? 'Your account keeps reflections, logs, and lessons safe across devices. Your password stays private.'
                  : "No password needed to create an account! To log in next time, we'll send you an email with a magic link."}
              </AppText>
              {/* 20.5 tall like the line above it — the default 44 press target
                  would stretch the card, so it comes back as hit slop */}
              <PressScale
                onPress={() => {
                  setUsePassword((on) => !on);
                  setPassword('');
                  reset();
                }}
                accessibilityRole="button"
                hitSlop={{ top: 12, bottom: 16, left: 20, right: 20 }}
                style={{ marginTop: 6, height: 20.5, minHeight: 0, alignSelf: 'flex-start' }}>
                <AppText style={[sans('500'), { fontSize: 13.5, lineHeight: 20.5, color: colors.text }]}>
                  {usePassword ? 'Use a magic link instead' : 'Use password instead'}
                </AppText>
              </PressScale>
            </View>

            <View style={{ marginTop: 6 }}>
              <Message error={error} notice={notice} />
            </View>

            <View style={{ marginTop: 4 }}>
              {/* Solid ink whatever the fields hold, as on the sign-in board —
                  pressing it short asks for what's missing. */}
              <PaperAuthButton
                label={loading ? 'Creating account…' : 'Create Account'}
                disabled={loading}
                onPress={() => {
                  if (!name.trim()) return setError('Tell us your first name.');
                  if (!email.trim()) return setError('Enter your email address.');
                  if (usePassword && password.length < 8) return setError('Passwords need at least 8 characters.');
                  void submit();
                }}
              />
            </View>
            {/* 047 widens this one line to left/right 16 and marks it
                white-space:nowrap, so it overflows rather than wraps; the box
                opens to the full frame here so the line stays unbroken on the
                same centre axis */}
            <View style={{ marginTop: 18, marginHorizontal: -24 }}>
              <PaperAuthLegal />
            </View>
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', gap: 14 }}>
            <AppText center style={[sans('500'), { fontSize: 22, letterSpacing: 0.1, color: colors.text }]}>Check your email.</AppText>
            <AppText center style={[sans('400'), { fontSize: 14.5, lineHeight: 21, color: colors.textMuted, marginBottom: 12 }]}>A code is on its way to {email.trim()}.</AppText>
            <PaperAuthField label="Verification code" value={code} onChangeText={setCode} keyboardType="number-pad" autoCapitalize="none" autoComplete="one-time-code" returnKeyType="go" onSubmitEditing={() => code && void submitCode()} />
            <Message error={error} notice={notice} />
            <PaperAuthButton label={loading ? 'Checking…' : 'Verify & continue'} disabled={loading || !code.trim()} onPress={() => void submitCode()} />
            <PressScale
              onPress={async () => {
                reset();
                const result = await resendEmailCode();
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

/** 102's pills: 56 tall, radius 28, and no provider mark beside the label. */
function GateButton({ label, onPress, disabled, secondary }: { label: string; onPress: () => void; disabled?: boolean; secondary?: boolean }) {
  return (
    <PressScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={{
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: secondary ? colors.surface : colors.ink,
        opacity: disabled ? 0.38 : 1,
        ...(secondary ? { boxShadow: '0 0 0 1px rgba(0,0,0,0.12)' } : null),
      }}>
      <AppText style={[sans('600'), { fontSize: 16.5, color: secondary ? colors.text : '#FFFFFF' }]}>{label}</AppText>
    </PressScale>
  );
}

function Message({ error, notice }: { error: string | null; notice: string | null }) {
  const message = error || notice;
  if (!message) return null;
  return <AppText center selectable style={[sans('500'), { fontSize: 13, lineHeight: 19, color: error ? colors.danger : colors.textMuted }]}>{message}</AppText>;
}
