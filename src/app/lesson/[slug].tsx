import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AppText,
  Button,
  CategoryBadge,
  ChoiceInput,
  EmptyState,
  Field,
  Icon,
  Illustration,
  type IllustrationName,
  LESSON_VISUAL,
  LoadingView,
  ScaleInput,
  Screen,
  SectionLabel,
} from '@/components/ui';
import { type MdBlock, parseMarkdown, renderInline } from '@/components/ui/MarkdownView';
import { URGE_TOOL_LESSON_SLUGS } from '@/content/seedLessons';
import { useCompleteLesson, useLessonDetail, useSaveReflection, useStartLesson } from '@/lib/backend';
import { CATEGORY_LABEL } from '@/lib/labels';
import { colors, radius, spacing } from '@/lib/theme';
import type { Lesson, ReflectionField } from '@/lib/types';

type Answers = Record<string, string | number>;

type StoryPage =
  | { kind: 'cover'; art: IllustrationName }
  | { kind: 'story'; heading?: string; lead?: string; rest: MdBlock[]; art: IllustrationName };

// Rotating set of spot illustrations so consecutive pages feel distinct.
const ARTS: IllustrationName[] = [
  'figure',
  'growth',
  'mountain',
  'spark',
  'bird',
  'steps',
  'horizon',
  'book',
  'orbit',
  'balance',
  'breathe',
  'path',
  'tide',
];

/** Break a lesson's markdown into picture-book pages: a cover, then one page per
 * section (heading → eyebrow, first paragraph → a big lead, the rest → body). */
function buildPages(lesson: Lesson): StoryPage[] {
  const blocks = parseMarkdown(lesson.bodyMarkdown);
  const sections: { heading?: string; blocks: MdBlock[] }[] = [];
  let cur: { heading?: string; blocks: MdBlock[] } | null = null;
  for (const b of blocks) {
    if (b.kind === 'h1' || b.kind === 'h2' || b.kind === 'h3') {
      if (cur) sections.push(cur);
      cur = { heading: b.text, blocks: [] };
    } else {
      if (!cur) cur = { heading: undefined, blocks: [] };
      cur.blocks.push(b);
    }
  }
  if (cur) sections.push(cur);

  const pages: StoryPage[] = [{ kind: 'cover', art: ARTS[0] }];
  sections.forEach((sec, i) => {
    const rest = [...sec.blocks];
    let lead: string | undefined;
    const pIdx = rest.findIndex((b) => b.kind === 'p');
    if (pIdx >= 0) {
      const block = rest[pIdx];
      if (block.kind === 'p') lead = block.text;
      rest.splice(pIdx, 1);
    }
    pages.push({ kind: 'story', heading: sec.heading, lead, rest, art: ARTS[(i + 1) % ARTS.length] });
  });
  return pages;
}

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
  const [phase, setPhase] = useState<'story' | 'task'>('story');

  // Mark in-progress on open.
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
  const pages = useMemo<StoryPage[]>(() => (detail ? buildPages(detail.lesson) : []), [detail]);

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/(app)/today');
  }

  if (detail === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style="dark" />
        <LoadingView />
      </View>
    );
  }
  if (detail === null) {
    return (
      <Screen edges={['top', 'bottom']}>
        <Pressable onPress={goBack} hitSlop={10} style={{ paddingVertical: spacing.sm }}>
          <AppText variant="soft">Close</AppText>
        </Pressable>
        <EmptyState title="Lesson not found" body="It may have been removed or not imported yet." />
      </Screen>
    );
  }

  const { lesson } = detail;
  const tint = LESSON_VISUAL[lesson.category].tint;

  function setAnswer(key: string, value: string | number) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  async function complete() {
    setSaving(true);
    await saveReflection(lesson.slug, answers);
    await completeLesson(lesson.slug, fitsMe ?? undefined);
    setSaving(false);
    goBack();
  }

  if (phase === 'task') {
    return (
      <TaskView
        lesson={lesson}
        tint={tint}
        answers={answers}
        setAnswer={setAnswer}
        fitsMe={fitsMe}
        setFitsMe={setFitsMe}
        saving={saving}
        isUrge={isUrgeLesson}
        onComplete={complete}
        onBack={() => setPhase('story')}
        onOpenUrge={() => router.push('/urge')}
        onSupport={() => router.push('/support')}
      />
    );
  }

  return <LessonReader pages={pages} lesson={lesson} tint={tint} onClose={goBack} onBegin={() => setPhase('task')} />;
}

// ── Lesson reader (cover with a line-by-line reveal, then a scrollable body) ──

/** Fades its children in once, on mount. */
function FadeIn({ children, duration = 480 }: { children: React.ReactNode; duration?: number }) {
  const [o] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.timing(o, { toValue: 1, duration, useNativeDriver: true }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Animated.View style={{ opacity: o }}>{children}</Animated.View>;
}

function splitSentences(text: string): string[] {
  const parts = text.match(/[^.!?]+[.!?]+(?:["'’”)\]]+)?\s*|[^.!?]+$/g);
  return (parts ?? [text]).map((s) => s.trim()).filter(Boolean);
}

/** The text "lines" of a page, in the order they should fade in. */
function pageBeats(page: StoryPage, lesson: Lesson, tint: string): React.ReactNode[] {
  if (page.kind === 'cover') {
    return [
      <AppText key="cat" variant="label" color={tint}>
        {CATEGORY_LABEL[lesson.category]} · Week {lesson.week}
      </AppText>,
      <AppText key="title" variant="hero">
        {lesson.title}
      </AppText>,
      lesson.estimatedMinutes ? (
        <AppText key="min" variant="soft">
          {lesson.estimatedMinutes} min
        </AppText>
      ) : null,
    ].filter(Boolean) as React.ReactNode[];
  }

  const beats: React.ReactNode[] = [];
  if (page.heading) {
    beats.push(
      <AppText key="eyebrow" variant="label" color={tint}>
        {page.heading}
      </AppText>,
    );
  }
  if (page.lead) {
    beats.push(
      <AppText key="lead" variant="title">
        {renderInline(page.lead)}
      </AppText>,
    );
  }
  page.rest.forEach((b, bi) => {
    if (!('text' in b)) {
      b.items.forEach((item, j) =>
        beats.push(
          <View key={`l${bi}-${j}`} style={{ flexDirection: 'row', gap: spacing.sm }}>
            <AppText variant="muted">{b.kind === 'ol' ? `${j + 1}.` : '•'}</AppText>
            <AppText variant="muted" style={{ flex: 1 }}>
              {renderInline(item)}
            </AppText>
          </View>,
        ),
      );
    } else {
      splitSentences(b.text).forEach((s, si) =>
        beats.push(
          <AppText key={`p${bi}-${si}`} variant="muted">
            {renderInline(s)}
          </AppText>,
        ),
      );
    }
  });
  return beats;
}

function LessonReader({
  pages,
  lesson,
  tint,
  onClose,
  onBegin,
}: {
  pages: StoryPage[];
  lesson: Lesson;
  tint: string;
  onClose: () => void;
  onBegin: () => void;
}) {
  // Two screens only: an animated cover, then the whole lesson on one
  // scrollable page. The reader never advances on its own — you tap through.
  const [view, setView] = useState<'cover' | 'body'>('cover');
  const cover = pages[0];
  const sections = pages.slice(1);
  const hasBody = sections.length > 0;

  if (view === 'cover') {
    return <LessonCover cover={cover} lesson={lesson} tint={tint} nextIsBegin={!hasBody} onClose={onClose} onNext={() => (hasBody ? setView('body') : onBegin())} />;
  }
  return <LessonBody sections={sections} lesson={lesson} tint={tint} onClose={onClose} onBack={() => setView('cover')} onBegin={onBegin} />;
}

/** The cover: a title card whose lines fade in one at a time. Tap to continue —
 * no auto-advance. This is the only place the line-by-line reveal plays. */
function LessonCover({
  cover,
  lesson,
  tint,
  nextIsBegin,
  onClose,
  onNext,
}: {
  cover: StoryPage;
  lesson: Lesson;
  tint: string;
  nextIsBegin: boolean;
  onClose: () => void;
  onNext: () => void;
}) {
  const insets = useSafeAreaInsets();
  const beats = pageBeats(cover, lesson, tint);
  const total = beats.length;
  const [revealed, setRevealed] = useState(0);
  const [opacity] = useState(() => new Animated.Value(0));
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const done = revealed >= total;

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 460, useNativeDriver: true }).start();
    let i = 0;
    const step = () => {
      i += 1;
      setRevealed(i);
      if (i < total) timers.current.push(setTimeout(step, 900));
    };
    timers.current.push(setTimeout(step, 480));
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTap = () => {
    if (!done) {
      timers.current.forEach(clearTimeout);
      setRevealed(total);
    } else {
      onNext();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <Pressable style={{ flex: 1 }} onPress={onTap} accessibilityRole="button" accessibilityLabel="Continue">
        <Animated.View
          style={{
            flex: 1,
            opacity,
            paddingHorizontal: spacing.xl,
            paddingTop: insets.top + 64,
            paddingBottom: insets.bottom + 96,
            justifyContent: 'center',
            gap: spacing.xxl,
          }}>
          <View style={{ alignItems: 'center', gap: spacing.lg }}>
            <CategoryBadge category={lesson.category} size={52} />
            <Illustration name={cover.art} width={226} color={colors.text} accent={tint} />
          </View>
          <View style={{ gap: spacing.md }}>
            {beats.slice(0, revealed).map((b, idx) => (
              <FadeIn key={idx}>{b}</FadeIn>
            ))}
          </View>
        </Animated.View>
      </Pressable>

      <View pointerEvents="box-none" style={{ position: 'absolute', top: insets.top + 10, left: spacing.xl, right: spacing.xl }}>
        <Pressable onPress={onClose} hitSlop={10} style={{ alignSelf: 'flex-end' }}>
          <AppText style={{ color: colors.textMuted, fontSize: 20 }}>✕</AppText>
        </Pressable>
      </View>

      <View pointerEvents="none" style={{ position: 'absolute', left: spacing.xl, right: spacing.xl, bottom: insets.bottom + spacing.lg, alignItems: 'center' }}>
        <AppText variant="soft">{done ? (nextIsBegin ? 'Tap to begin' : 'Tap to read') : 'Tap to continue'}</AppText>
      </View>
    </View>
  );
}

/** The body: the whole lesson on one calm, scrollable page — every section's
 * text shown at once (no per-line reveal, no auto-advance), then the practice. */
function LessonBody({
  sections,
  lesson,
  tint,
  onClose,
  onBack,
  onBegin,
}: {
  sections: StoryPage[];
  lesson: Lesson;
  tint: string;
  onClose: () => void;
  onBack: () => void;
  onBegin: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [opacity] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 420, useNativeDriver: true }).start();
  }, [opacity]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingTop: insets.top + 10, paddingHorizontal: spacing.xl, paddingBottom: spacing.sm }}>
        <Pressable onPress={onBack} hitSlop={10}>
          <View style={{ transform: [{ rotate: '180deg' }] }}>
            <Icon name="arrow" size={18} color={colors.textMuted} />
          </View>
        </Pressable>
        <AppText weightOverride="700" numberOfLines={1} style={{ flex: 1, fontSize: 16 }}>
          {lesson.title}
        </AppText>
        <Pressable onPress={onClose} hitSlop={10}>
          <AppText style={{ color: colors.textMuted, fontSize: 20 }}>✕</AppText>
        </Pressable>
      </View>

      <Animated.View style={{ flex: 1, opacity }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: insets.bottom + 108, gap: spacing.xl }}>
          {sections.map((sec, si) => (
            <View key={si} style={{ gap: spacing.md }}>
              {pageBeats(sec, lesson, tint).map((b, bi) => (
                <View key={bi}>{b}</View>
              ))}
            </View>
          ))}
        </ScrollView>
      </Animated.View>

      <View style={{ position: 'absolute', left: spacing.xl, right: spacing.xl, bottom: insets.bottom + spacing.lg }}>
        <Button label="Begin the practice" onPress={onBegin} />
      </View>
    </View>
  );
}

// ── Task (light "your practice" page) ───────────────────────────────────────

function TaskView({
  lesson,
  tint,
  answers,
  setAnswer,
  fitsMe,
  setFitsMe,
  saving,
  isUrge,
  onComplete,
  onBack,
  onOpenUrge,
  onSupport,
}: {
  lesson: Lesson;
  tint: string;
  answers: Answers;
  setAnswer: (key: string, value: string | number) => void;
  fitsMe: number | null;
  setFitsMe: (v: number) => void;
  saving: boolean;
  isUrge: boolean;
  onComplete: () => void;
  onBack: () => void;
  onOpenUrge: () => void;
  onSupport: () => void;
}) {
  return (
    <Screen edges={['top', 'bottom']} contentStyle={{ gap: spacing.lg, paddingTop: spacing.sm }}>
      <StatusBar style="dark" />
      <Pressable onPress={onBack} hitSlop={10} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.sm }}>
        <View style={{ transform: [{ rotate: '180deg' }] }}>
          <Icon name="arrow" size={16} color={colors.textSoft} />
        </View>
        <AppText variant="soft">Back to story</AppText>
      </Pressable>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          backgroundColor: tint + '14',
          borderRadius: radius.lg,
          padding: spacing.lg,
        }}>
        <CategoryBadge category={lesson.category} size={48} />
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="label" color={tint}>
            Your practice
          </AppText>
          <AppText weightOverride="600">{lesson.title}</AppText>
        </View>
      </View>

      <View style={{ gap: spacing.xs }}>
        <AppText variant="title">{lesson.reflectionPrompt}</AppText>
        <AppText variant="muted">A small thing to carry out of this lesson — in your own words, no wrong answers.</AppText>
      </View>

      {isUrge ? (
        <Pressable onPress={onOpenUrge}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.md,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: radius.lg,
              padding: spacing.lg,
            }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: radius.pill,
                backgroundColor: colors.event.urge_rode_out + '20',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name="wave" size={22} color={colors.event.urge_rode_out} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <AppText weightOverride="600">Practice it now</AppText>
              <AppText variant="soft">Open the timed tool and ride one out.</AppText>
            </View>
            <Icon name="arrow" size={20} color={colors.textSofter} />
          </View>
        </Pressable>
      ) : null}

      {lesson.reflectionFields.map((field) => (
        <ReflectionInput key={field.key} field={field} value={answers[field.key]} onChange={(v) => setAnswer(field.key, v)} />
      ))}

      <View style={{ gap: spacing.sm }}>
        <SectionLabel>Did this approach fit you?</SectionLabel>
        <AppText variant="muted">Different methods fit different people. This is just for you — it shapes what we surface next.</AppText>
        <ScaleInput min={1} max={5} value={fitsMe} onChange={setFitsMe} leftLabel="Not for me" rightLabel="Fits well" />
      </View>

      {lesson.sensitive ? (
        <Pressable onPress={onSupport} hitSlop={6} style={{ paddingVertical: spacing.xs }}>
          <AppText variant="soft">This topic can bring up a lot. Find support →</AppText>
        </Pressable>
      ) : null}

      <Button label="Complete lesson" onPress={onComplete} loading={saving} />
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
