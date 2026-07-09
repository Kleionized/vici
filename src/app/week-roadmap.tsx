import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { AppText, Card, Glyph, LoadingView, SectionLabel } from '@/components/ui';
import { WorldArt } from '@/components/journey/WorldArt';
import { CATEGORY_LABEL } from '@/lib/labels';
import { useCurrentLesson, useLessonProgressMap, useLessons } from '@/lib/backend';
import { colors, spacing } from '@/lib/theme';
import { WORLDS } from '@/lib/worlds';

export default function WeekRoadmap() {
  const router = useRouter();
  const { week } = useLocalSearchParams<{ week?: string }>();
  const lessons = useLessons();
  const current = useCurrentLesson();
  const progress = useLessonProgressMap();
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/weeks'));

  if (!lessons || current === undefined || progress === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style="dark" />
        <LoadingView />
      </View>
    );
  }

  const weekNum = week ? Number(week) : (current?.lesson.week ?? 1);
  const worldKey = WORLDS.find((w) => w.n === weekNum)?.key ?? 'shore';
  const weekLessons = lessons.filter((l) => l.week === weekNum).sort((a, b) => a.orderIndex - b.orderIndex);
  const done = weekLessons.filter((l) => progress[l.slug]?.status === 'completed').length;
  const theme = weekLessons[0] ? CATEGORY_LABEL[weekLessons[0].category].toLowerCase() : `week ${weekNum}`;
  const currentOrder = current?.lesson.orderIndex ?? Infinity;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {/* the world's own landscape as the hub header */}
          <View style={{ height: 150, overflow: 'hidden', backgroundColor: '#EFECE1' }}>
            <View style={{ position: 'absolute', left: 0, right: 0, top: -46, aspectRatio: 402 / 300 }}>
              <WorldArt scene={worldKey} fit="xMidYMid meet" />
            </View>
          </View>
          <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, left: 22 }}>
            <Pressable onPress={back} hitSlop={10} accessibilityLabel="Close" style={{ paddingTop: spacing.sm }}>
              <Svg width={20} height={20} viewBox="0 0 20 20">
                <Path d="M3 3l14 14M17 3L3 17" stroke={colors.text} strokeWidth={2.4} strokeLinecap="round" />
              </Svg>
            </Pressable>
          </SafeAreaView>
        </View>

        <View style={{ paddingHorizontal: 24, paddingTop: 14, paddingBottom: spacing.xxl }}>
          <SectionLabel style={{ marginBottom: 4 }}>
            Week {weekNum} · {done} of {weekLessons.length} done
          </SectionLabel>
          <AppText variant="hero" style={{ fontSize: 34, marginBottom: spacing.lg }}>
            {theme}.
          </AppText>

          <View>
            <View style={{ position: 'absolute', left: 21, top: 22, bottom: 22, width: 2, backgroundColor: colors.borderStrong }} />
            <View style={{ gap: 10 }}>
              {weekLessons.map((l, i) => {
                const isDone = progress[l.slug]?.status === 'completed';
                const isCurrent = current?.lesson.slug === l.slug;
                const locked = !isDone && !isCurrent && l.orderIndex > currentOrder;
                return (
                  <Pressable
                    key={l.slug}
                    onPress={() => (!locked ? router.push(`/lesson/${l.slug}`) : undefined)}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 9999,
                        backgroundColor: isDone ? colors.accent : isCurrent ? colors.surface : colors.bg,
                        borderWidth: isCurrent ? 2 : isDone ? 0 : 2,
                        borderColor: isCurrent ? colors.text : colors.borderStrong,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {isDone ? (
                        Glyph.check(colors.accentText)
                      ) : locked ? (
                        <View style={{ width: 18, height: 18 }}>{Glyph.lock(colors.textSoft)}</View>
                      ) : (
                        <AppText weightOverride="700" style={{ fontSize: 17 }}>
                          {i + 1}
                        </AppText>
                      )}
                    </View>
                    <Card padded style={{ flex: 1, opacity: locked ? 0.55 : 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View style={{ flex: 1 }}>
                          <AppText weightOverride="700" style={{ fontSize: 16, letterSpacing: -0.2 }}>
                            {l.title}
                          </AppText>
                          <AppText variant="muted" weightOverride="500" style={{ fontSize: 13, marginTop: 1 }}>
                            {l.estimatedMinutes ? `${l.estimatedMinutes} min` : 'lesson'}
                            {l.reflectionFields.length ? ' · story + practice' : ' · story'}
                          </AppText>
                        </View>
                        {isCurrent ? (
                          <View style={{ backgroundColor: colors.accent, borderRadius: 9999, paddingHorizontal: 13, paddingVertical: 6 }}>
                            <AppText weightOverride="700" color={colors.accentText} style={{ fontSize: 12.5 }}>
                              Resume
                            </AppText>
                          </View>
                        ) : null}
                      </View>
                    </Card>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
