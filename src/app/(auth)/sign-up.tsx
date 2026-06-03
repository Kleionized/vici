import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText, Button, Field, Screen } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { colors, spacing } from '@/lib/theme';

export default function SignUp() {
  const router = useRouter();
  const { signUpWithPassword, verifyEmailCode, resendEmailCode, mode } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    const res = await signUpWithPassword(email, password, name);
    setLoading(false);
    if (res.ok) {
      router.replace('/');
      return;
    }
    if (res.needsVerification) {
      setPendingVerification(true);
      return;
    }
    setError(res.error ?? 'Could not create account.');
  }

  async function verify() {
    setLoading(true);
    setError(null);
    const res = await verifyEmailCode(code);
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? 'Could not verify code.');
      return;
    }
    router.replace('/');
  }

  if (pendingVerification) {
    return (
      <Screen contentStyle={{ paddingTop: spacing.xxxl, gap: spacing.lg }}>
        <View style={{ gap: spacing.sm }}>
          <AppText variant="display">Check your email</AppText>
          <AppText variant="muted">We sent a verification code to {email}. Enter it to finish.</AppText>
        </View>

        <Field
          label="Verification code"
          value={code}
          onChangeText={setCode}
          placeholder="123456"
          keyboardType="number-pad"
          autoCapitalize="none"
        />

        {error ? <AppText color={colors.info}>{error}</AppText> : null}

        <Button label="Verify & continue" onPress={verify} loading={loading} disabled={!code.trim()} />

        <Pressable
          onPress={async () => {
            setError(null);
            const r = await resendEmailCode();
            if (!r.ok) setError(r.error ?? 'Could not resend code.');
          }}
          style={{ paddingVertical: spacing.sm }}>
          <AppText variant="soft" center>
            Didn&apos;t get it? <AppText variant="soft" color={colors.text}>Resend code</AppText>
          </AppText>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen contentStyle={{ paddingTop: spacing.xxxl, gap: spacing.lg }}>
      <View style={{ gap: spacing.sm }}>
        <AppText variant="display">Start where you are</AppText>
        <AppText variant="muted">No streaks to protect. Just a place to build a life worth living.</AppText>
      </View>

      <Field label="Name (optional)" value={name} onChangeText={setName} placeholder="What should we call you?" autoCapitalize="words" />
      <Field
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Field
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Choose a password"
        secureTextEntry
        autoCapitalize="none"
      />

      {error ? <AppText color={colors.info}>{error}</AppText> : null}

      <Button label="Create account" onPress={submit} loading={loading} disabled={!email || !password} />

      <Pressable onPress={() => router.push('/(auth)/sign-in')} style={{ paddingVertical: spacing.sm }}>
        <AppText variant="soft" center>
          Already have an account? <AppText variant="soft" color={colors.text}>Sign in</AppText>
        </AppText>
      </Pressable>

      {mode === 'mock' ? (
        <AppText variant="soft" center>
          Offline mode — accounts are stored locally on this device for now.
        </AppText>
      ) : null}

      {/* Clerk smart-CAPTCHA mount point (bot protection on sign-up). */}
      <View nativeID="clerk-captcha" />
    </Screen>
  );
}
