import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { AppText, Card, LoadingView, MiniBars, Screen, SectionLabel, Stat } from '@/components/ui';
import { useDashboard } from '@/lib/backend';
import { colors, spacing } from '@/lib/theme';

export default function Dashboard() {
  const router = useRouter();
  const data = useDashboard();

  if (!data) {
    return (
      <Screen>
        <LoadingView />
      </Screen>
    );
  }

  return (
    <Screen contentStyle={{ paddingTop: spacing.xl, gap: spacing.xl }}>
      <View style={{ gap: spacing.xs }}>
        <AppText variant="label">You</AppText>
        <AppText variant="display">How you&apos;re really doing</AppText>
        <AppText variant="muted">
          The things that move the needle — sleep, mood, connection, structure — not a number to protect.
        </AppText>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
        <Stat value={`${data.lessonsCompleted}/${data.lessonsTotal}`} label="Lessons" caption="completed" />
        <Stat value={String(data.reflectionsCount)} label="Reflections" caption="in your words" />
      </View>

      <View style={{ gap: spacing.sm }}>
        <SectionLabel>Sleep · last 7 days</SectionLabel>
        <Card>
          <MiniBars points={data.sleepTrend} max={12} />
        </Card>
      </View>

      <View style={{ gap: spacing.sm }}>
        <SectionLabel>Mood · last 7 days</SectionLabel>
        <Card>
          <MiniBars points={data.moodTrend} max={5} />
        </Card>
      </View>

      <View style={{ gap: spacing.sm }}>
        <SectionLabel>This week</SectionLabel>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
          <Stat value={`${data.movedBodyDays}/7`} label="Moved" />
          <Stat value={`${data.socialContactDays}/7`} label="Connected" />
          <Stat value={`${data.structureDays}/7`} label="Structure" />
        </View>
      </View>

      {data.optionalDaysSinceLapse != null ? (
        <View style={{ gap: spacing.sm }}>
          <SectionLabel>Optional stat</SectionLabel>
          <Card style={{ backgroundColor: colors.surfaceAlt }}>
            <View style={{ gap: spacing.xs }}>
              <AppText variant="title">{data.optionalDaysSinceLapse} days</AppText>
              <AppText variant="soft">
                since your last logged lapse. Just a number you asked to see — not a streak to defend. You
                can turn it off in Settings.
              </AppText>
            </View>
          </Card>
        </View>
      ) : null}

      <AppText variant="soft" onPress={() => router.push('/log')}>
        See everything in your log →
      </AppText>
    </Screen>
  );
}
