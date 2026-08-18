import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { AppText, CloseGlyph, LoadingView, LockGlyph, PressScale } from '@/components/ui';
import { useCurrentUser, useLessonProgressMap } from '@/lib/backend';
import { CURRICULUM_84_DAYS } from '@/content/curriculum84';
import { lessonSlug } from '@/lib/curriculum';
import { colors, sans } from '@/lib/theme';

/**
 * The six first steps, opened from the Today card. A sheet rather than a
 * screen: it is a look at a checklist, not somewhere you go — the card used to
 * jump straight into whichever lesson you were up to, which told you nothing
 * about the other five.
 */
export default function FirstSteps() {
  const router = useRouter();
  const user = useCurrentUser();
  const progress = useLessonProgressMap();
  // Read once on mount, so a re-render cannot move the lock line under a finger.
  const [now] = useState(() => Date.now());
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  if (progress === undefined) return <LoadingView />;

  // The first six days of week one, and the day the reader is on — the same
  // reckoning the week board and the lessons browser use.
  const steps = CURRICULUM_84_DAYS.slice(0, 6);
  const day = user?.createdAt ? Math.max(1, Math.floor((now - user.createdAt) / 86_400_000) + 1) : 1;
  const done = steps.filter((lesson) => progress[lessonSlug(lesson.day)]?.status === 'completed').length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        {/* the sheet's own grabber and header, as the canvas draws them */}
        <View style={{ alignItems: 'center', paddingTop: 8 }}>
          <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.14)' }} />
        </View>
        <View style={{ height: 52, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <AppText style={[sans('600'), { fontSize: 17.5, color: colors.text }]}>First steps</AppText>
          <PressScale
            onPress={close}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={10}
            style={{ position: 'absolute', right: 12, width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.05)' }}>
            <CloseGlyph />
          </PressScale>
        </View>

        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 32 }}>
          <AppText style={[sans('500'), { fontSize: 24, lineHeight: 31, letterSpacing: -0.3, color: colors.text }]}>
            Six gentle first steps
          </AppText>
          <AppText style={[sans('400'), { marginTop: 10, marginRight: 24, fontSize: 15, lineHeight: 23, color: colors.textMuted }]}>
            No rush. These help VICI fit your life, and they open one at a time as you go.
          </AppText>

          <View style={{ marginTop: 22, flexDirection: 'row', gap: 8 }}>
            {steps.map((lesson, index) => (
              <View
                key={lesson.day}
                style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: index < done ? colors.ink : '#CFDCE8' }}
              />
            ))}
          </View>
          <AppText style={[sans('500'), { marginTop: 12, fontSize: 13.5, color: colors.textSoft }]}>
            {done ? `${done} of ${steps.length} done` : `None done yet · ${steps.length} to go`}
          </AppText>

          <View style={{ marginTop: 22, borderRadius: 16, borderCurve: 'continuous', backgroundColor: colors.surface, overflow: 'hidden' }}>
            {steps.map((lesson, index) => {
              const complete = progress[lessonSlug(lesson.day)]?.status === 'completed';
              return (
                <StepRow
                  key={lesson.day}
                  n={index + 1}
                  title={lesson.title}
                  meta={lesson.summary}
                  complete={complete}
                  locked={lesson.day > day && !complete}
                  last={index === steps.length - 1}
                  onPress={() => {
                    close();
                    router.push(`/lesson-card/${lesson.day}`);
                  }}
                />
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function StepRow({
  n,
  title,
  meta,
  complete,
  locked,
  last,
  onPress,
}: {
  n: number;
  title: string;
  meta: string;
  complete: boolean;
  locked: boolean;
  last: boolean;
  onPress: () => void;
}) {
  return (
    <View>
      <PressScale
        onPress={locked ? undefined : onPress}
        disabled={locked}
        accessibilityRole="button"
        accessibilityState={{ disabled: locked }}
        accessibilityLabel={`Step ${n}, ${title}${complete ? ', done' : locked ? ', locked' : ''}`}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16, minHeight: 68, opacity: locked ? 0.6 : 1 }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: complete ? colors.ink : locked ? 'transparent' : '#E7EEF4',
            boxShadow: locked ? 'inset 0 0 0 1.5px rgba(0,0,0,0.10)' : undefined,
          }}>
          {complete ? (
            <Svg width={14} height={11} viewBox="0 0 16 13" fill="none">
              <Path d="M1.5 7l4.4 4.5L14.5 1.5" stroke="#F4F3F0" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          ) : locked ? (
            <LockGlyph color={colors.textSofter} />
          ) : (
            <AppText style={[sans('600'), { fontSize: 13, color: colors.text, fontVariant: ['tabular-nums'] }]}>{n}</AppText>
          )}
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <AppText numberOfLines={2} style={[sans('500'), { fontSize: 16, lineHeight: 21, color: colors.text }]}>{title}</AppText>
          <AppText style={[sans('400'), { fontSize: 13, color: colors.textSoft }]}>{meta}</AppText>
        </View>
      </PressScale>
      {!last ? <View style={{ position: 'absolute', left: 16, right: 16, bottom: 0, height: 1, backgroundColor: colors.hairline }} /> : null}
    </View>
  );
}
