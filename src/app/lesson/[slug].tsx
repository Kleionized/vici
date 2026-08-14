import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from 'react-native-svg';

import { LessonCover } from '@/components/lesson/cover';
import {
  branchBlocks,
  CHROME_H,
  fillTemplate,
  gridTileWidth,
  isPairPage,
  PageAsk,
  PageBranch,
  PageCollect,
  PageGrid,
  PagePick,
  PageQuote,
  PageTeach,
} from '@/components/lesson/pages';
import { AppText, EmptyState, LoadingView, PressScale, Screen } from '@/components/ui';
import { useCompleteLesson, useLessonDetail, useLessons, useSaveReflection, useStartLesson } from '@/lib/backend';
import { interactiveLesson } from '@/lib/curriculum';
import { weekHeading } from '@/lib/lessonArt';
import { colors, sans, spacing } from '@/lib/theme';
import type { ILessonQuote, InteractiveLesson, IPage } from '@/lib/types';

/**
 * The lesson player. Every lesson in the curriculum runs the same shape:
 *
 *   cover → teach ×2 → ask → grid → branch → pick → collect → reflection → done
 *
 * The ask and grid record what's true for the reader; the branch page answers
 * with the copy written for exactly those selections; the collect page writes
 * the takeaway back in their own words. The reflection and the completion stamp
 * close it (canvas: Lesson Open · Reader · Question · Pair · Self Check ·
 * Feelings Grid · Your Signs · Reflection · Complete).
 *
 * The canvas is one 393 × 852 absolute frame, so the player keeps that shape:
 * chrome pinned at the top, the page filling the rest, and the pill floating
 * over the foot rather than taking a row out of the column.
 */

const noiseDark = require('../../../assets/images/noise-dark.png');

type Answers = Record<string, string | number>;

type FlowStep =
  | { kind: 'open' }
  | { kind: 'content'; index: number }
  | { kind: 'quote'; index: number }
  | { kind: 'branch'; index: number; block: number; total: number }
  | { kind: 'reflection' }
  | { kind: 'complete' };

/**
 * The branch page is authored as several answers at once — one per thing the
 * reader ticked — so it expands into one step each rather than stacking them
 * into a single wall. That makes the flow's length depend on the reader's
 * answers, which is why the steps are rebuilt whenever the selections change.
 * Selections are only made on pages that come *before* the branch, so the
 * current index never lands on a step that moves under it.
 *
 * A teach page carrying a quote expands the same way: the quote is a page of
 * its own straight after it, which is where the canvas puts it.
 */
function buildSteps(lesson: InteractiveLesson, checks: string[], grid: string[]): FlowStep[] {
  const steps: FlowStep[] = [{ kind: 'open' }];
  lesson.pages.forEach((page, index) => {
    if (page.kind === 'branch') {
      const total = Math.max(1, branchBlocks(page, checks, grid).length);
      for (let block = 0; block < total; block += 1) steps.push({ kind: 'branch', index, block, total });
    } else {
      steps.push({ kind: 'content', index });
      if (page.kind === 'teach' && page.quote) steps.push({ kind: 'quote', index });
    }
  });
  steps.push({ kind: 'reflection' }, { kind: 'complete' });
  return steps;
}

// ── chrome ───────────────────────────────────────────────────────────

/** Close on the left, progress under it. The reference carries nothing on the
 * right — the back gesture is the page's own swipe. */
function FlowChrome({ total, index, onClose }: { total: number; index: number; onClose: () => void }) {
  // A hundred-page dot row would be a smear, so long flows show a bar. The
  // threshold clears the longest a lesson can run — the 11-page lessons with a
  // fully-expanded branch, which come to 17 — so the indicator never changes
  // shape underneath a reader who is still ticking boxes.
  const dots = total <= 17;
  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View style={{ height: 44, justifyContent: 'center' }}>
        <PressScale
          onPress={onClose}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Close lesson"
          style={{ width: 60, minHeight: 44, justifyContent: 'center' }}>
          <AppText style={[sans('400'), { fontSize: 17, color: '#3A3934' }]}>Close</AppText>
        </PressScale>
      </View>
      <View style={{ marginTop: 6, height: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        {dots ? (
          Array.from({ length: total }).map((_, dot) => (
            <View
              key={dot}
              style={{
                width: dot === index ? 22 : 7,
                height: 7,
                borderRadius: dot === index ? 4 : 3.5,
                backgroundColor: dot <= index ? '#131313' : 'rgba(0,0,0,0.18)',
              }}
            />
          ))
        ) : (
          <View style={{ width: 180, height: 7, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.18)', overflow: 'hidden' }}>
            <View style={{ width: `${((index + 1) / total) * 100}%`, height: '100%', borderRadius: 4, backgroundColor: '#131313' }} />
          </View>
        )}
      </View>
    </View>
  );
}

/**
 * The pill, floating over the foot of the frame. The canvas sets it 24pt in and
 * 56pt up on the pages that are only a picture and a sentence, and 16pt in and
 * 30pt up wherever the page has controls of its own to sit under.
 */
function FlowCta({
  label,
  onPress,
  enabled = true,
  loading = false,
  wide = false,
}: {
  label: string;
  onPress: () => void;
  enabled?: boolean;
  loading?: boolean;
  wide?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const gutter = wide ? 24 : 16;
  return (
    <View style={{ position: 'absolute', left: gutter, right: gutter, bottom: Math.max(insets.bottom, wide ? 56 : 30) }}>
      <PressScale
        onPress={enabled && !loading ? onPress : undefined}
        disabled={!enabled || loading}
        accessibilityRole="button"
        accessibilityState={{ disabled: !enabled || loading }}
        style={{ height: 52, borderRadius: 26, backgroundColor: '#131313', alignItems: 'center', justifyContent: 'center', opacity: enabled ? 1 : 0.34 }}>
        <AppText numberOfLines={1} style={[sans('600'), { fontSize: 17, letterSpacing: 0.2, color: '#FFFFFF' }]}>
          {loading ? 'Saving…' : label}
        </AppText>
      </PressScale>
    </View>
  );
}

/** The grain the canvas lays over the whole frame at 0.07. */
function PaperGrain() {
  return (
    <Image
      source={noiseDark}
      contentFit="cover"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.07 }}
      pointerEvents="none"
    />
  );
}

/** The quote a teach page carries, if it carries one. */
function teachQuote(page: IPage | undefined): ILessonQuote | null {
  return page && page.kind === 'teach' ? page.quote ?? null : null;
}

/**
 * All the chrome a quote page carries: one chevron at the canvas's left 16,
 * top 64. No Close, no dots, no pill — the frame draws none of them, and the
 * quote is read rather than operated. It steps back a page, which is the only
 * thing on a page you leave by tapping it that a chevron can sensibly mean.
 */
function QuoteChrome({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <PressScale
      onPress={onBack}
      accessibilityRole="button"
      accessibilityLabel="Back a page"
      hitSlop={{ top: 18, bottom: 18, left: 20, right: 24 }}
      style={{ position: 'absolute', left: 16, top: insets.top + 10, minHeight: 0 }}>
      <Svg width={11} height={19} viewBox="0 0 11 19" fill="none">
        <Path d="M9.5 1.5L2 9.5l7.5 8" stroke="#55534E" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </PressScale>
  );
}

// ── the fixed pages ──────────────────────────────────────────────────

function PageOpen({ lesson, meta }: { lesson: InteractiveLesson; meta: string }) {
  return (
    <View style={{ paddingTop: 236 - 54 - CHROME_H, alignItems: 'center' }}>
      <Animated.View entering={FadeInDown.duration(280).easing(Easing.bezier(0.2, 0, 0, 1))}>
        <LessonCover size={128} />
      </Animated.View>
      <Animated.View
        entering={FadeInUp.delay(90).duration(300).easing(Easing.bezier(0.2, 0, 0, 1))}
        style={{ alignSelf: 'stretch', alignItems: 'center' }}>
        <AppText center style={[sans('600'), { marginTop: 70, fontSize: 12.5, color: '#8B8882' }]}>{weekHeading(lesson.week)}</AppText>
        <AppText center style={[sans('500'), { marginTop: 15, paddingHorizontal: 30, fontSize: 28, lineHeight: 36, color: '#1D1C1A' }]}>
          {lesson.title}
        </AppText>
        <AppText center style={[sans('500'), { marginTop: 20, fontSize: 15, color: '#55534E' }]}>{meta}</AppText>
      </Animated.View>
    </View>
  );
}

/**
 * Reflection prompts are authored as an instruction followed by a line on why
 * it's worth doing. Set as one block they run seven lines deep at prompt size;
 * split, the ask stays large and the rationale drops to a note under it.
 */
function splitReflection(text: string): { prompt: string; note?: string } {
  const sentences = text.match(/[^.!?]+[.!?]+\s*/g);
  if (!sentences || sentences.length < 2 || text.length < 150) return { prompt: text.trim() };
  return { prompt: sentences.slice(0, -1).join('').trim(), note: sentences[sentences.length - 1].trim() };
}

/** The ringed wave over the fit scale. The canvas blurs its 92pt halo, so it is
 * drawn here as a radial with the same falloff — RN SVG has no blur filter. */
function ReflectionMark() {
  return (
    <View style={{ width: 120, height: 96 }}>
      <Svg width={120} height={96} viewBox="0 0 120 96" style={{ position: 'absolute', left: 0, top: 0 }}>
        <Defs>
          <RadialGradient id="fit-halo" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.35} />
            <Stop offset="0.74" stopColor="#E2BA78" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={60} cy={46} r={46} fill="url(#fit-halo)" />
      </Svg>
      <View
        style={{
          position: 'absolute',
          left: 22,
          top: 6,
          width: 76,
          height: 76,
          borderRadius: 38,
          backgroundColor: '#FFFFFF',
          boxShadow: 'inset 0 0 0 2px #E8E6DF',
        }}
      />
      <View style={{ position: 'absolute', left: 38, top: 28 }}>
        <Svg width={44} height={30} viewBox="0 0 26 20" fill="none">
          <Path d="M2 13c4-8 9 3 13-3s7 2 9-2" stroke="#55534E" strokeWidth={2.2} fill="none" strokeLinecap="round" />
        </Svg>
      </View>
    </View>
  );
}

function PageReflection({
  lesson,
  text,
  onText,
  fit,
  onFit,
}: {
  lesson: InteractiveLesson;
  text: string;
  onText: (value: string) => void;
  fit: number | null;
  onFit: (value: number) => void;
}) {
  const { prompt, note } = splitReflection(lesson.reflection);
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingTop: 158 - 54 - CHROME_H, paddingBottom: 102 }}>
      <AppText center style={[sans('500'), { paddingHorizontal: 36, fontSize: 22, lineHeight: 30, color: '#1D1C1A' }]}>
        {prompt}
      </AppText>
      {note ? (
        <AppText center style={[sans('400'), { marginTop: 14, paddingHorizontal: 36, fontSize: 14.5, lineHeight: 22, color: '#55534E' }]}>
          {note}
        </AppText>
      ) : null}

      <View
        style={{
          marginTop: 50,
          marginHorizontal: 16,
          height: 150,
          borderRadius: 16,
          borderCurve: 'continuous',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 0 0 1.5px rgba(0,0,0,0.12)',
          padding: 18,
        }}>
        <TextInput
          value={text}
          onChangeText={onText}
          multiline
          placeholder="In your own words…"
          placeholderTextColor={colors.textSofter}
          textAlignVertical="top"
          style={[sans('400'), { flex: 1, padding: 0, fontSize: 16.5, lineHeight: 26, color: '#1D1C1A' }]}
        />
      </View>

      <View style={{ marginTop: 18, alignItems: 'center' }}>
        <ReflectionMark />
      </View>

      <AppText center style={[sans('500'), { marginTop: 8, fontSize: 15.5, color: '#55534E' }]}>Does this approach fit you?</AppText>
      <View style={{ marginTop: 20, marginHorizontal: 36, flexDirection: 'row', gap: 8 }}>
        {[1, 2, 3, 4, 5].map((value) => {
          const on = fit === value;
          return (
            <PressScale
              key={value}
              onPress={() => onFit(value)}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              style={{
                flex: 1,
                height: 46,
                minHeight: 46,
                borderRadius: 12,
                borderCurve: 'continuous',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: on ? '#131313' : '#FFFFFF',
                boxShadow: on ? undefined : '0 0 0 1.5px rgba(0,0,0,0.12)',
              }}>
              <AppText style={[sans(on ? '600' : '500'), { fontSize: 16, color: on ? '#FFFFFF' : '#55534E' }]}>{value}</AppText>
            </PressScale>
          );
        })}
      </View>
      <View style={{ marginTop: 10, marginHorizontal: 36, flexDirection: 'row', justifyContent: 'space-between' }}>
        <AppText style={[sans('400'), { fontSize: 13, color: '#8B8882' }]}>Not for me</AppText>
        <AppText style={[sans('400'), { fontSize: 13, color: '#8B8882' }]}>Fits well</AppText>
      </View>
    </ScrollView>
  );
}

function PageComplete({ nextTitle }: { nextTitle?: string }) {
  return (
    <View style={{ paddingTop: 230 - 54 - CHROME_H, alignItems: 'center' }}>
      <Animated.View entering={FadeInDown.duration(260)}>
        <LessonCover size={128} />
      </Animated.View>
      <Animated.View entering={FadeInUp.delay(90).duration(280)} style={{ alignSelf: 'stretch', alignItems: 'center' }}>
        <AppText center style={[sans('500'), { marginTop: 78, fontSize: 24, color: '#1D1C1A' }]}>Lesson complete.</AppText>
        <AppText center style={[sans('400'), { marginTop: 18, paddingHorizontal: 44, fontSize: 15.5, lineHeight: 23, color: '#55534E' }]}>
          {nextTitle ? `Your reflection is saved to the log. Next up: ${nextTitle.toLowerCase()}.` : 'Your reflection is saved to the log.'}
        </AppText>
      </Animated.View>
    </View>
  );
}

// ── the player ───────────────────────────────────────────────────────

export default function LessonPlayer() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { slug, from } = useLocalSearchParams<{ slug: string; from?: string }>();
  const detail = useLessonDetail(slug ?? '');
  const lessons = useLessons();
  const startLesson = useStartLesson();
  const saveReflection = useSaveReflection();
  const completeLesson = useCompleteLesson();

  const [answers, setAnswers] = useState<Answers>({});
  const [checks, setChecks] = useState<string[]>([]);
  const [grid, setGrid] = useState<string[]>([]);
  const [pick, setPick] = useState<string | null>(null);
  const [fitsMe, setFitsMe] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [index, setIndex] = useState(0);

  const content = useMemo(() => (slug ? interactiveLesson(slug) : null), [slug]);
  const steps = useMemo(() => (content ? buildSteps(content, checks, grid) : []), [content, checks, grid]);

  useEffect(() => {
    // Marking the lesson open is bookkeeping — if the backend rejects it (an
    // expired session, say) the reader should still get to read.
    if (slug && detail) void Promise.resolve(startLesson(slug)).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, !!detail]);

  useEffect(() => {
    if (detail && 'reflection' in detail) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- persisted lesson data arrives asynchronously.
      if (detail.reflection?.answers) setAnswers(detail.reflection.answers);
      if (detail.progress?.fitsMeRating != null) setFitsMe(detail.progress.fitsMeRating);
    }
  }, [detail]);

  // Entering from the overview means the cover was already shown there.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot, once the steps exist.
    if (from === 'overview' && steps.length > 1) setIndex((current) => (current === 0 ? 1 : current));
  }, [from, steps.length]);

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
  if (detail === null || !content) {
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
  const step = steps[Math.min(index, steps.length - 1)];
  const next = () => setIndex((current) => Math.min(steps.length - 1, current + 1));
  const back = () => setIndex((current) => Math.max(0, current - 1));
  const meta = `${lesson.estimatedMinutes ?? 4} min`;

  async function saveAndAdvance() {
    setSaving(true);
    try {
      await saveReflection(lesson.slug, answers);
      await completeLesson(lesson.slug, fitsMe ?? undefined);
    } finally {
      // A failed save must not strand the reader on a pill reading "Saving…".
      setSaving(false);
    }
    next();
  }

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

  // The quote page is drawn on the whole frame — the canvas centres its block
  // over all 852, status bar included, and hangs nothing on it but a chevron —
  // so it skips the chrome-and-pill shell the rest of the flow shares.
  const quote = step.kind === 'quote' ? teachQuote(content.pages[step.index]) : null;
  if (quote) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style="dark" />
        <PaperGrain />
        <PageQuote key={`${lesson.slug}-${index}`} quote={quote} onNext={next} />
        <QuoteChrome onBack={back} />
      </View>
    );
  }

  let body: React.ReactNode = null;
  let ctaLabel: string | null = 'Continue';
  let ctaEnabled = true;
  let ctaWide = false;
  let onCta: () => void = next;

  if (step.kind === 'open') {
    body = <PageOpen lesson={content} meta={meta} />;
    ctaLabel = 'Begin';
    ctaWide = true;
  } else if (step.kind === 'reflection') {
    const text = typeof answers.reflection === 'string' ? answers.reflection : '';
    body = (
      <PageReflection
        lesson={content}
        text={text}
        onText={(value) => setAnswers((prev) => ({ ...prev, reflection: value }))}
        fit={fitsMe}
        onFit={setFitsMe}
      />
    );
    ctaLabel = 'Save reflection & complete';
    ctaEnabled = text.trim().length > 0 && fitsMe != null;
    onCta = () => void saveAndAdvance();
  } else if (step.kind === 'complete') {
    const nextLesson = lessons?.find((item) => item.orderIndex === content.order + 1);
    body = <PageComplete nextTitle={nextLesson?.title} />;
    ctaLabel = 'Done';
    ctaWide = true;
    onCta = goBack;
  } else if (step.kind === 'branch') {
    const page = content.pages[step.index];
    if (page.kind === 'branch') {
      const blocks = branchBlocks(page, checks, grid);
      body = (
        <PageBranch
          page={page}
          block={blocks[step.block] ?? { body: page.title }}
          step={step.block}
          total={step.total}
          seed={content.order + step.index}
        />
      );
      ctaWide = true;
    }
  } else {
    const page = content.pages[step.index];
    if (page.kind === 'teach') {
      body = <PageTeach page={page} seed={content.order + step.index} />;
      ctaWide = true;
    } else if (page.kind === 'ask') {
      // The deck's own pair of answers carries the reader on, so the frame
      // draws no pill under it.
      body = <PageAsk page={page} selected={checks} onToggle={(key) => setChecks((prev) => toggle(prev, key))} onDone={next} />;
      ctaLabel = null;
    } else if (page.kind === 'grid') {
      body = (
        <PageGrid
          page={page}
          tile={gridTileWidth(width)}
          selected={grid}
          onToggle={(option) => setGrid((prev) => toggle(prev, option))}
        />
      );
      ctaLabel = 'Continue';
      ctaEnabled = grid.length > 0;
    } else if (page.kind === 'pick') {
      body = <PagePick page={page} value={pick} onChange={setPick} />;
      // The pairing page commits you to a habit, so its pill says what you
      // committed to; the plain question is only an answer, so it says Continue.
      ctaLabel = isPairPage(page) && pick ? fillTemplate(page.result, { pick }) : 'Continue';
      ctaEnabled = pick != null;
    } else if (page.kind === 'collect') {
      const askPage = content.pages.find((item) => item.kind === 'ask');
      const shorts =
        askPage && askPage.kind === 'ask'
          ? askPage.checks.filter((check) => checks.includes(check.key)).map((check) => check.short)
          : [];
      const anySelected = checks.length > 0 || grid.length > 0 || pick != null;
      const sentence = fillTemplate(anySelected ? page.template : page.fallback, {
        pick: pick ?? '',
        checks: shorts,
        grid,
      });
      body = <PageCollect page={page} sentence={sentence} chips={page.source === 'grid' ? grid : shorts} />;
      ctaLabel = page.cta;
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <PaperGrain />
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <FlowChrome total={steps.length} index={index} onClose={goBack} />
        <View key={`${lesson.slug}-${index}`} style={{ flex: 1, minHeight: 0 }}>
          {body}
        </View>
        {ctaLabel ? (
          <FlowCta label={ctaLabel} onPress={onCta} enabled={ctaEnabled} loading={step.kind === 'reflection' && saving} wide={ctaWide} />
        ) : null}
      </View>
    </View>
  );
}
