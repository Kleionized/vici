import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText, Button, Field, Screen } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { colors, spacing } from '@/lib/theme';

export default function SignUp() {
  const router = useRouter();
  const { signUpWithPassword, mode } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    const res = await signUpWithPassword(email, password, name);
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? 'Could not create account.');
      return;
    }
    router.replace('/');
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
    </Screen>
  );
}
