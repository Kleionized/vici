import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import {
  AppText,
  Button,
  Card,
  ChoiceInput,
  Divider,
  EmptyState,
  Field,
  LoadingView,
  MarkdownView,
  Pill,
  ScaleInput,
  Screen,
  SectionLabel,
} from '@/components/ui';
import { URGE_TOOL_LESSON_SLUGS } from '@/content/seedLessons';
import {
  useCompleteLesson,
  useLessonDetail,
  useSaveReflection,
  useStartLesson,
} from '@/lib/backend';
import { CATEGORY_LABEL } from '@/lib/labels';
import { colors, spacing } from '@/lib/theme';
import type { ReflectionField } from '@/lib/types';

type Answers = Record<string, string | number>;

export default function LessonPlayer() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const detail = useLessonDetail(slug ?? '');
  const startLesson = useStartLesson();
  const saveReflection = useSaveReflection();
  const completeLesson = useCompleteLesson();

  const [answers, setAnswers] = useState<Answers>({});
  const [fitsMe, setFitsMe] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // Mark in-progress on open (no-op if already completed/in-progress).
  useEffect(() => {
    if (slug && detail) startLesson(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, !!detail]);

  // Prefill from any existing reflection / rating.
  useEffect(() => {
    if (detail && detail !== null && 'reflection' in detail) {
      if (detail.reflection?.answers) setAnswers(detail.reflection.answers);
      if (detail.progress?.fitsMeRating != null) setFitsMe(detail.progress.fitsMeRating);
    }
  }, [detail]);

  const isUrgeLesson = useMemo(() => (slug ? URGE_TOOL_LESSON_SLUGS.includes(slug) : false), [slug]);

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/(app)/today');
  }

  if (detail === undefined) {
    return (
      <Screen scroll={false} edges={['top', 'bottom']}>
        <LoadingView />
      </Screen>
    );
  }
  if (detail === null) {
    return (
      <Screen edges={['top', 'bottom']}>
        <TopBar onClose={goBack} />
        <EmptyState title="Lesson not found" body="It may have been removed or not imported yet." />
      </Screen>
    );
  }

  const { lesson } = detail;

  function setAnswer(key: string, value: string | number) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    await saveReflection(lesson.slug, answers);
    await completeLesson(lesson.slug, fitsMe ?? undefined);
    setSaving(false);
    goBack();
  }

  return (
    <Screen edges={['top', 'bottom']} contentStyle={{ gap: spacing.lg, paddingTop: spacing.sm }}>
      <TopBar onClose={goBack} />

      <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
        <Pill label={`Week ${lesson.week}`} />
        <Pill label={CATEGORY_LABEL[lesson.category]} />
        {lesson.approachTags.map((t) => (
          <Pill key={t} label={t} />
        ))}
      </View>

      <MarkdownView content={lesson.bodyMarkdown} />

      {isUrgeLesson ? (
        <Card accent={colors.event.urge_rode_out}>
          <View style={{ gap: spacing.md }}>
            <AppText variant="subtitle">Practice it now</AppText>
            <AppText variant="muted">Open the timed tool and ride one out with the wave.</AppText>
            <Button label="Open Ride It Out" variant="secondary" onPress={() => router.push('/urge')} />
          </View>
        </Card>
      ) : null}

      {lesson.sensitive ? <SensitiveFooter onSupport={() => router.push('/support')} /> : null}

      <Divider />

      <View style={{ gap: spacing.lg }}>
        <View style={{ gap: spacing.xs }}>
          <SectionLabel>Reflection</SectionLabel>
          <AppText variant="muted">{lesson.reflectionPrompt}</AppText>
        </View>

        {lesson.reflectionFields.map((field) => (
          <ReflectionInput key={field.key} field={field} value={answers[field.key]} onChange={(v) => setAnswer(field.key, v)} />
        ))}

        <View style={{ gap: spacing.sm }}>
          <SectionLabel>Does this approach fit you?</SectionLabel>
          <AppText variant="muted">
            Different methods fit different people. This is just for you — it shapes what we surface next.
          </AppText>
          <ScaleInput min={1} max={5} value={fitsMe} onChange={setFitsMe} leftLabel="Not for me" rightLabel="Fits well" />
        </View>

        <Button label="Save reflection & complete" onPress={save} loading={saving} />
      </View>
    </Screen>
  );
}

function ReflectionInput({
  field,
  value,
  onChange,
}: {
  field: ReflectionField;
  value: string | number | undefined;
  onChange: (v: string | number) => void;
}) {
  if (field.type === 'scale') {
    const min = field.options?.[0] ? Number(field.options[0]) : 1;
    const max = field.options?.[1] ? Number(field.options[1]) : 10;
    return (
      <View style={{ gap: spacing.sm }}>
        <SectionLabel>{field.label}</SectionLabel>
        <ScaleInput min={min} max={max} value={typeof value === 'number' ? value : null} onChange={onChange} />
      </View>
    );
  }
  if (field.type === 'choice') {
    return (
      <View style={{ gap: spacing.sm }}>
        <SectionLabel>{field.label}</SectionLabel>
        <ChoiceInput options={field.options ?? []} value={typeof value === 'string' ? value : null} onChange={onChange} />
      </View>
    );
  }
  return (
    <Field
      label={field.label}
      value={typeof value === 'string' ? value : ''}
      onChangeText={onChange}
      multiline={field.type === 'longText'}
      placeholder="Your words…"
    />
  );
}

function TopBar({ onClose }: { onClose: () => void }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm }}>
      <Pressable onPress={onClose} hitSlop={10}>
        <AppText variant="soft">Close</AppText>
      </Pressable>
    </View>
  );
}

function SensitiveFooter({ onSupport }: { onSupport: () => void }) {
  return (
    <Card style={{ backgroundColor: colors.surfaceAlt }}>
      <View style={{ gap: spacing.xs }}>
        <AppText variant="soft">
          This topic can bring up a lot. Go gently, and take a break if you need one.
        </AppText>
        <Pressable onPress={onSupport} hitSlop={6}>
          <AppText variant="soft" color={colors.text}>
            Find support →
          </AppText>
        </Pressable>
      </View>
    </Card>
  );
}
