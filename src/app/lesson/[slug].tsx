import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Button, CategoryBadge, ChoiceInput, EmptyState, Field, Icon, Illustration, LESSON_VISUAL, Laurel, LoadingView, ScaleInput, Screen, SectionLabel, type IllustrationName } from '@/components/ui';
import { INTERACTIVE_LESSONS, type InteractivePage, LpgCheck, LpgCollect, LpgGrid, LpgPick, LpgTeach } from '@/components/lesson/interactive';
import { type MdBlock, parseMarkdown, renderInline } from '@/components/ui/MarkdownView';
import { URGE_TOOL_LESSON_SLUGS } from '@/content/seedLessons';
import { useCompleteLesson, useLessonDetail, useSaveReflection, useStartLesson } from '@/lib/backend';
import { CATEGORY_LABEL } from '@/lib/labels';
import { colors, fonts, radius, sans, spacing } from '@/lib/theme';
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

// ── Lesson reader (canvas: screens-lesson-flow) — paged, not scrolled:
// one idea per page in the urge-flow grammar: segmented progress, back, ✕,
// a title page, one section per page, then the laurel done page. ──

function romanNum(n: number): string {
  const table: [number, string][] = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let out = '';
  let x = Math.max(1, Math.round(n));
  for (const [v, r] of table) while (x >= v) { out += r; x -= v; }
  return out;
}
const MIN_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

function LFTopBar({ total, index, onBack, onClose }: { total: number; index: number; onBack: () => void; onClose: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 29, paddingTop: 8 }}>
      <Pressable onPress={onBack} hitSlop={10} accessibilityLabel="Back" style={{ padding: 4, marginLeft: -4 }}>
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path d="M15 5l-7 7 7 7" stroke={colors.text} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Pressable>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 6, paddingHorizontal: 4 }}>
        {Array.from({ length: total }).map((_, i) => (
          <View key={i} style={{ flex: 1, maxWidth: 26, height: 4, borderRadius: 9999, backgroundColor: i <= index ? colors.ink : colors.borderStrong }} />
        ))}
      </View>
      <Pressable onPress={onClose} hitSlop={10} accessibilityLabel="Close" style={{ padding: 4, marginRight: -4 }}>
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path d="M6 6l12 12M18 6L6 18" stroke={colors.text} strokeWidth={2.1} strokeLinecap="round" />
        </Svg>
      </Pressable>
    </View>
  );
}

function LFCTA({ label = 'Continue', onPress }: { label?: string; onPress: () => void }) {
  return (
    <View style={{ paddingHorizontal: 29, paddingBottom: 14 }}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={({ pressed }) => ({
          width: '100%',
          backgroundColor: colors.ink,
          borderRadius: 9999,
          paddingVertical: 16,
          alignItems: 'center',
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}>
        <AppText style={[sans('600'), { fontSize: 15.5, letterSpacing: 0.16, color: colors.inkText }]}>{label}</AppText>
      </Pressable>
    </View>
  );
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
  const insets = useSafeAreaInsets();
  const [i, setI] = useState(0);
  const interactive = INTERACTIVE_LESSONS[lesson.slug]?.pages ?? null;
  const sections = pages.filter((p): p is Extract<StoryPage, { kind: 'story' }> => p.kind === 'story');
  const midCount = interactive ? interactive.length : sections.length;
  const total = midCount + 2; // title · pages · done
  const back = () => (i === 0 ? onClose() : setI(i - 1));
  const next = () => setI((v) => Math.min(total - 1, v + 1));
  const eyebrow = `Ground ${romanNum(lesson.week)} · Lesson ${romanNum(lesson.dayInWeek)}`;
  const mins = lesson.estimatedMinutes ?? 3;
  const minLabel = mins <= 10 ? `${MIN_WORDS[mins]} minutes` : `${mins} minutes`;

  let body: React.ReactNode;
  if (i === 0) {
    // title page
    body = (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34 }}>
        <AppText style={[sans('600'), { fontSize: 11, letterSpacing: 2.64, textTransform: 'uppercase', color: colors.textSoft }]}>
          {eyebrow}
        </AppText>
        <View style={{ width: 40, height: 1.5, backgroundColor: colors.text, marginTop: 18, marginBottom: 22 }} />
        <AppText center style={{ fontFamily: fonts.serifSharp, fontSize: 36, lineHeight: 41, color: colors.text }}>
          {lesson.title}
        </AppText>
        <AppText style={[sans('500'), { fontSize: 13.5, color: colors.textSoft, marginTop: 18 }]}>{minLabel}</AppText>
      </View>
    );
  } else if (interactive && i <= interactive.length) {
    // an interactive page — the takeaway line is the button
    const pg: InteractivePage = interactive[i - 1];
    if (pg.kind === 'teach') body = <LpgTeach page={pg} next={next} />;
    else if (pg.kind === 'pick') body = <LpgPick page={pg} next={next} />;
    else if (pg.kind === 'check') body = <LpgCheck key={`c${pg.qIndex}`} page={pg} next={next} />;
    else if (pg.kind === 'grid') body = <LpgGrid page={pg} next={next} />;
    else body = <LpgCollect page={pg} next={next} />;
  } else if (!interactive && i <= sections.length) {
    // one idea per page
    const sec = sections[i - 1];
    const rest = sec.rest.filter((b) => b.kind === 'p' || b.kind === 'ul' || b.kind === 'ol');
    body = (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 34, paddingVertical: 20 }} showsVerticalScrollIndicator={false}>
        {sec.heading ? (
          <AppText center style={{ fontFamily: fonts.serifSharp, fontSize: 31, lineHeight: 36, color: colors.text, maxWidth: 300, alignSelf: 'center' }}>
            {sec.heading}
          </AppText>
        ) : null}
        {sec.lead ? (
          <AppText center style={[sans('400'), { fontSize: 14, lineHeight: 21.7, color: colors.textMuted, marginTop: 14, maxWidth: 290, alignSelf: 'center' }]}>
            {sec.lead}
          </AppText>
        ) : null}
        {rest.map((b, bi) => (
          <AppText
            key={bi}
            center
            style={[sans('400'), { fontSize: 14, lineHeight: 21.7, color: colors.textMuted, marginTop: 14, maxWidth: 290, alignSelf: 'center' }]}>
            {'text' in b ? b.text : b.items.map((it) => `· ${it}`).join('\n')}
          </AppText>
        ))}
      </ScrollView>
    );
  } else {
    // done page — the laurel stamps in
    body = (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34 }}>
        <Laurel size={46} color={colors.text} />
        <AppText center style={{ fontFamily: fonts.serifSharp, fontSize: 33, lineHeight: 38, color: colors.text, marginTop: 24 }}>
          Lesson {romanNum(lesson.dayInWeek)}, ridden.
        </AppText>
        <AppText style={[sans('500'), { fontSize: 13, color: colors.textSoft, marginTop: 16 }]}>
          Ground {romanNum(lesson.week)} · {lesson.title}
        </AppText>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 14) }}>
      <StatusBar style="dark" />
      <LFTopBar total={total} index={i} onBack={back} onClose={onClose} />
      {body}
      {interactive && i > 0 && i < total - 1 ? null : (
        <LFCTA label={i === 0 ? 'Begin' : i === total - 1 ? 'On to the practice' : 'Continue'} onPress={i === total - 1 ? onBegin : next} />
      )}
    </View>
  );
}


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
        <AppText variant="muted">A small thing to carry out of this lesson, in your own words.</AppText>
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
        <AppText variant="muted">Different methods fit different people. This shapes what we surface next.</AppText>
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
