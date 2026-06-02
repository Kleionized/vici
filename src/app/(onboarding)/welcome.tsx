import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { AppText, Button, ProgressDots, Screen } from '@/components/ui';
import { spacing } from '@/lib/theme';

export default function Welcome() {
  const router = useRouter();
  return (
    <Screen contentStyle={{ paddingTop: spacing.xxxl, flexGrow: 1 }}>
      <View style={{ flex: 1, gap: spacing.xl }}>
        <ProgressDots total={4} index={0} />
        <View style={{ gap: spacing.lg, flex: 1 }}>
          <AppText variant="display">Welcome to Tideline.</AppText>
          <AppText variant="muted">
            This isn&apos;t about counting days or protecting a streak. It&apos;s about building a life worth
            living — and learning from everything along the way, including the hard parts.
          </AppText>
          <AppText variant="muted">
            Let&apos;s start with what matters to you. Two quick questions, in your own words.
          </AppText>
        </View>
        <Button label="Get started" onPress={() => router.push('/(onboarding)/why')} />
      </View>
    </Screen>
  );
}
