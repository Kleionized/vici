import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText, Button, Field, Screen } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { colors, spacing } from '@/lib/theme';

export default function SignIn() {
  const router = useRouter();
  const { signInWithPassword, mode } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    const res = await signInWithPassword(email, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? 'Could not sign in.');
      return;
    }
    router.replace('/');
  }

  return (
    <Screen contentStyle={{ paddingTop: spacing.xxxl, gap: spacing.lg }}>
      <View style={{ gap: spacing.sm }}>
        <AppText variant="display">Welcome back</AppText>
        <AppText variant="muted">Sign in to keep building toward the life you want.</AppText>
      </View>

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
        placeholder="••••••••"
        secureTextEntry
        autoCapitalize="none"
      />

      {error ? <AppText color={colors.info}>{error}</AppText> : null}

      <Button label="Sign in" onPress={submit} loading={loading} disabled={!email || !password} />

      <Pressable onPress={() => router.push('/(auth)/sign-up')} style={{ paddingVertical: spacing.sm }}>
        <AppText variant="soft" center>
          New here? <AppText variant="soft" color={colors.text}>Create an account</AppText>
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
