import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AppText, Button, Card, LoadingView, Pill, Screen } from '@/components/ui';
import { CATEGORY_LABEL } from '@/lib/labels';
import { useCurrentLesson, useCurrentUser, useLifeMap, useTodayCheckin } from '@/lib/backend';
import { colors, spacing } from '@/lib/theme';

export default function Today() {
  const router = useRouter();
  const user = useCurrentUser();
  const current = useCurrentLesson();
  const lifeMap = useLifeMap();
  const todayCheckin = useTodayCheckin();

  if (user === undefined || current === undefined) {
    return (
      <Screen>
        <LoadingView />
      </Screen>
    );
  }

  const name = user?.displayName?.split(' ')[0];
  const allDone = current && current.index === current.total - 1 && current.progress?.status === 'completed';
  const ctaLabel = !current
    ? 'Browse lessons'
    : current.progress?.status === 'completed'
      ? 'Review lesson'
      : current.progress?.status === 'in_progress'
        ? 'Continue lesson'
        : 'Start lesson';

  return (
    <Screen contentStyle={{ paddingTop: spacing.xl, gap: spacing.lg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ gap: spacing.xs, flexShrink: 1 }}>
          <AppText variant="label">Today</AppText>
          <AppText variant="display">{name ? `Hi, ${name}.` : 'Hello.'}</AppText>
        </View>
        <Pressable onPress={() => router.push('/settings')} hitSlop={8} style={{ paddingTop: spacing.sm }}>
          <AppText variant="soft">Settings</AppText>
        </Pressable>
      </View>

      {lifeMap?.whyStatement ? (
        <Pressable onPress={() => router.push('/lifemap')}>
          <Card>
            <View style={{ gap: spacing.xs }}>
              <AppText variant="label">Why you&apos;re here</AppText>
              <AppText>{lifeMap.whyStatement}</AppText>
            </View>
          </Card>
        </Pressable>
      ) : null}

      {current ? (
        <Card>
          <View style={{ gap: spacing.md }}>
            <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
              <Pill label={`Week ${current.lesson.week}`} />
              <Pill label={CATEGORY_LABEL[current.lesson.category]} />
              {current.lesson.estimatedMinutes ? <Pill label={`${current.lesson.estimatedMinutes} min`} /> : null}
            </View>
            <AppText variant="label">{allDone ? "You're at the end of the placeholder set" : "Today's lesson"}</AppText>
            <AppText variant="title">{current.lesson.title}</AppText>
            <AppText variant="muted">{current.lesson.reflectionPrompt}</AppText>
            <Button label={ctaLabel} onPress={() => router.push(`/lesson/${current.lesson.slug}`)} />
          </View>
        </Card>
      ) : (
        <Card>
          <AppText variant="muted">No lessons available yet. Add content via the import pipeline.</AppText>
        </Card>
      )}

      <View style={{ gap: spacing.sm }}>
        <AppText variant="label">In the moment</AppText>
        <Card accent={colors.event.urge_rode_out}>
          <View style={{ gap: spacing.md }}>
            <AppText variant="subtitle">Riding out an urge?</AppText>
            <AppText variant="muted">
              An urge is a wave, not a command. Take three minutes and let it pass.
            </AppText>
            <Button label="Ride it out" variant="secondary" onPress={() => router.push('/urge')} />
          </View>
        </Card>
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <View style={{ flex: 1 }}>
          <Button label="Add to log" variant="secondary" onPress={() => router.push('/log')} />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            label={todayCheckin ? 'Check-in done' : 'Daily check-in'}
            variant="secondary"
            onPress={() => router.push('/log')}
          />
        </View>
      </View>

      <Pressable onPress={() => router.push('/support')} hitSlop={8} style={{ paddingVertical: spacing.sm }}>
        <AppText variant="soft" center>
          Need support right now?
        </AppText>
      </Pressable>
    </Screen>
  );
}
