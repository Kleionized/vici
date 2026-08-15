import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import {
  Attribution,
  BedPhoneMark,
  Cascade,
  ClockMark,
  COVER_GAP,
  CrescentMark,
  Epigraph,
  Eyebrow,
  LessonScroll,
  Meta,
  Prose,
  Spacer,
  Statement,
  SunDot,
  SunriseMark,
  Title,
} from '@/components/lesson/scroll';
import { AppText, PressScale } from '@/components/ui';
import { LESSON_SCROLL_01, type ScrollPage } from '@/content/lessonScroll01';
import { lessonForDay } from '@/content/curriculum84';
import { sans } from '@/lib/theme';

/**
 * `Lesson Scroll 1…26` — the reader, as `UI Final` draws it.
 *
 * The page advances by tapping the board: 24 of the 26 frames carry no CTA at
 * all, the set is named "Scroll", and the cover's chevron is the only hint of a
 * control. The two frames that do carry a pill draw it as a footer.
 *
 * Only lesson 01 has an authored body in the bundle. A day with no pages sends
 * the reader back to its card rather than showing an empty board.
 */
export default function LessonScrollReader() {
  const router = useRouter();
  const { day } = useLocalSearchParams<{ day?: string }>();
  const n = Number(String(day ?? '').replace(/^day-/, '')) || 1;
  const [index, setIndex] = useState(0);

  const pages = n === 1 ? LESSON_SCROLL_01 : null;
  const close = () => (router.canGoBack() ? router.back() : router.replace(`/lesson-card/${n}`));

  if (!pages) {
    // The design authors one body; the rest have a card and a task.
    return null;
  }

  const page = pages[Math.min(index, pages.length - 1)];
  const next = () => (index >= pages.length - 1 ? close() : setIndex((i) => i + 1));

  return (
    <>
      <StatusBar style="dark" />
      <LessonScroll
        index={index}
        count={pages.length}
        gap={page.kind === 'cover' ? COVER_GAP : undefined}
        chevron={page.kind === 'cover'}
        onClose={close}
        onNext={next}
        footer={<PageFooter page={page} onNext={next} />}>
        <PageBody page={page} lessonTitle={lessonForDay(n)?.title ?? ''} />
      </LessonScroll>
    </>
  );
}

/** The mark a page opens with, if it has one. */
function Mark({ name }: { name: string }) {
  if (name === 'sun12') return <SunDot size={12} />;
  if (name === 'sun14') return <SunDot size={14} />;
  if (name === 'crescent') return <CrescentMark />;
  if (name === 'sunrise') return <SunriseMark />;
  if (name === 'clock') return <ClockMark />;
  if (name === 'bedphone') return <BedPhoneMark />;
  return null;
}

function PageBody({ page, lessonTitle }: { page: ScrollPage; lessonTitle: string }) {
  switch (page.kind) {
    case 'cover':
      return (
        <>
          <Eyebrow>{page.eyebrow}</Eyebrow>
          {/* the canvas's zero-width spacers: 36 + 14 + 36 = 86, then 82 */}
          <Spacer height={14} />
          <Title>{page.title || lessonTitle}</Title>
          <Spacer height={10} />
          <Meta>{page.meta}</Meta>
          <CoverScene />
        </>
      );
    case 'epigraph':
      return (
        <>
          {page.mark ? <Mark name={page.mark} /> : null}
          <Epigraph>{page.quote}</Epigraph>
          <Attribution>{page.who}</Attribution>
        </>
      );
    case 'statement':
      return (
        <>
          {page.before ? <Prose>{page.before}</Prose> : null}
          {page.mark ? <Mark name={page.mark} /> : null}
          <Statement>{page.text}</Statement>
        </>
      );
    case 'prose':
      return (
        <>
          {page.title ? <Statement>{page.title}</Statement> : null}
          {page.mark ? <Mark name={page.mark} /> : null}
          <Prose>{page.soft}</Prose>
          {page.ink ? <Prose tone="ink">{page.ink}</Prose> : null}
        </>
      );
    case 'cascade':
      return (
        <>
          {page.before ? <Prose>{page.before}</Prose> : null}
          <Cascade lines={page.lines} ramp={page.ramp} />
          {page.after ? <Statement>{page.after}</Statement> : null}
        </>
      );
    case 'pick':
      return <PickBoard page={page} />;
    case 'task':
      return (
        <>
          <Eyebrow>{page.eyebrow}</Eyebrow>
          <Statement>{page.title}</Statement>
          <Prose>{page.body}</Prose>
          <RuleCard>{page.rule}</RuleCard>
        </>
      );
    case 'taskOptions':
      return (
        <>
          <Eyebrow>{page.eyebrow}</Eyebrow>
          <Statement>{page.title}</Statement>
          <View style={{ alignSelf: 'stretch', gap: 12 }}>
            {page.options.map((option) => (
              <View key={option.head} style={{ borderRadius: 16, borderCurve: 'continuous', backgroundColor: '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,0.06)', padding: 16 }}>
                <AppText style={[sans('600'), { fontSize: 15.5, color: '#1D1C1A' }]}>{option.head}</AppText>
                <AppText style={[sans('400'), { marginTop: 4, fontSize: 13, lineHeight: 19, color: '#8B8882' }]}>{option.note}</AppText>
              </View>
            ))}
          </View>
        </>
      );
    case 'done':
      return (
        <>
          <Statement>{page.title}</Statement>
          <Prose>{page.body}</Prose>
        </>
      );
  }
}

/** The two frames that carry a pill; every other frame carries none. */
function PageFooter({ page, onNext }: { page: ScrollPage; onNext: () => void }) {
  if (page.kind !== 'pick' && page.kind !== 'done') return null;
  const label = page.kind === 'done' ? page.cta : 'Continue';
  return (
    <PressScale
      onPress={onNext}
      accessibilityRole="button"
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 30,
        height: 54,
        minHeight: 54,
        borderRadius: 27,
        backgroundColor: '#131313',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <AppText style={[sans('600'), { fontSize: 17, color: '#FFFFFF' }]}>{label}</AppText>
    </PressScale>
  );
}

/** Frame 16 — one answer, kept locally; the log takes it at the close. */
function PickBoard({ page }: { page: Extract<ScrollPage, { kind: 'pick' }> }) {
  const [chosen, setChosen] = useState(page.options[0]);
  return (
    <>
      <Statement>{page.title}</Statement>
      <Prose>{page.helper}</Prose>
      <View style={{ alignSelf: 'stretch', gap: 12 }}>
        {page.options.map((option) => {
          const on = option === chosen;
          return (
            <PressScale
              key={option}
              onPress={() => setChosen(option)}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              style={{
                height: 56,
                minHeight: 56,
                borderRadius: 16,
                borderCurve: 'continuous',
                backgroundColor: '#FFFFFF',
                boxShadow: on ? '0 0 0 1.6px #131313' : '0 0 0 1px rgba(0,0,0,0.10)',
                paddingHorizontal: 18,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
              }}>
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: on ? '#131313' : undefined,
                  boxShadow: on ? undefined : 'inset 0 0 0 1.5px rgba(0,0,0,0.22)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {on ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#F4F3F0' }} /> : null}
              </View>
              <AppText style={[sans(on ? '600' : '500'), { flex: 1, fontSize: 15, color: '#1D1C1A' }]}>{option}</AppText>
            </PressScale>
          );
        })}
      </View>
    </>
  );
}

/** Frame 23's rule card — what finishing the task actually means. */
function RuleCard({ children }: { children: string }) {
  return (
    <View style={{ alignSelf: 'stretch', borderRadius: 16, borderCurve: 'continuous', backgroundColor: '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,0.06)', padding: 16, flexDirection: 'row', gap: 10 }}>
      <Svg width={16} height={16} viewBox="0 0 16 13" fill="none" style={{ marginTop: 3 }}>
        <Path d="M1.5 7l4.4 4.5L14.5 1.5" stroke="#131313" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <AppText style={[sans('500'), { flex: 1, fontSize: 14, lineHeight: 20, color: '#1D1C1A' }]}>{children}</AppText>
    </View>
  );
}

/** Frame 1's night room — the lit window, the bed, the phone left across it. */
function CoverScene() {
  return (
    <View style={{ width: 270, height: 224 }}>
      <View style={{ position: 'absolute', left: 15, top: 0, width: 240, height: 200, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', left: -28, top: 166, width: 296, height: 64, borderTopLeftRadius: 148, borderTopRightRadius: 148, backgroundColor: '#EAE9E3' }} />
        <View style={{ position: 'absolute', left: 44, top: 16, width: 58, height: 72, borderRadius: 6, backgroundColor: '#12151B', boxShadow: '0 0 0 6px #E4E3DE, 0 5px 12px rgba(40,38,32,0.14)' }} />
        <View style={{ position: 'absolute', left: 60, top: 34, width: 26, height: 26, borderRadius: 13, backgroundColor: '#CBDAE8' }} />
        <View style={{ position: 'absolute', left: 26, top: 118, width: 10, height: 62, borderRadius: 4, backgroundColor: '#D6D5D0' }} />
        <View style={{ position: 'absolute', left: 34, top: 148, width: 120, height: 28, borderRadius: 7, backgroundColor: '#E0DFDA' }} />
        <View style={{ position: 'absolute', left: 44, top: 138, width: 42, height: 16, borderRadius: 6, backgroundColor: '#C9C7C0' }} />
        <View style={{ position: 'absolute', left: 148, top: 172, width: 8, height: 12, borderRadius: 3, backgroundColor: '#C6C5C0' }} />
        <View style={{ position: 'absolute', left: 186, top: 132, width: 46, height: 8, borderRadius: 3, backgroundColor: '#D6D5D0' }} />
        <View style={{ position: 'absolute', left: 204, top: 106, width: 16, height: 26, borderRadius: 4, backgroundColor: '#DEDDD7' }} />
      </View>
    </View>
  );
}
