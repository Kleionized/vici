import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, LinearGradient as SvgLinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

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
import { Scene } from '@/components/task/TaskScene';
import { LESSON_SCROLL_01, type ScrollPage } from '@/content/lessonScroll01';
import { READER_ROOM, READER_ROOM_H, READER_ROOM_W } from '@/content/readerRoom';
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
        gap={GAP[page.kind]}
        chevron={page.kind === 'cover'}
        onClose={close}
        onNext={next}
        footer={<PageFooter page={page} onNext={next} />}>
        <PageBody page={page} lessonTitle={lessonForDay(n)?.title ?? ''} />
      </LessonScroll>
    </>
  );
}

/** The stack gap each board declares. Everything not named here uses 48. */
const GAP: Partial<Record<ScrollPage['kind'], number>> = { cover: COVER_GAP, pick: 40, task: 30, done: 44 };

/** The mark a page opens with, if it has one. */
function Mark({ name }: { name: string }) {
  if (name === 'sun12') return <SunDot size={12} />;
  if (name === 'sun14') return <SunDot size={14} />;
  if (name === 'crescent') return <CrescentMark />;
  if (name === 'sunrise') return <SunriseMark />;
  if (name === 'clock') return <ClockMark />;
  if (name === 'bedphone') return <BedPhoneMark />;
  // the 340 x 200 night room, which frames 18 and 23 draw identically at 0.85
  if (name === 'room') return <Scene layers={READER_ROOM} boxW={READER_ROOM_W} boxH={READER_ROOM_H} width={READER_ROOM_W * 0.85} />;
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
          <Spacer height={16} />
          <Statement>{page.title}</Statement>
          {page.room ? <Mark name="room" /> : null}
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
          <SunDot size={36} halo={115} />
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
        height: 52,
        minHeight: 52,
        borderRadius: 26,
        backgroundColor: '#131313',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <AppText style={[sans('600'), { fontSize: 17, letterSpacing: 0.2, color: '#FFFFFF' }]}>{label}</AppText>
    </PressScale>
  );
}

/** Frame 16 — one answer, kept locally; the log takes it at the close. */
function PickBoard({ page }: { page: Extract<ScrollPage, { kind: 'pick' }> }) {
  const [chosen, setChosen] = useState(page.options[0]);
  return (
    <>
      <Statement maxWidth={310}>{page.title}</Statement>
      <Spacer height={18} />
      <Meta>{page.helper}</Meta>
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
                boxShadow: on ? '0 0 0 2px #1D1C1A, 0 4px 10px rgba(40,38,32,0.08)' : 'inset 0 0 0 1.5px #E4E2DB',
                paddingHorizontal: 18,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
              }}>
              {/* the selected radio is a 2pt ring with a 10pt dot inside it and
                  a clear annulus between — not a filled disc */}
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  borderWidth: on ? 2 : 0,
                  borderColor: '#1D1C1A',
                  boxShadow: on ? undefined : 'inset 0 0 0 1.6px #C9C7C0',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {on ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#1D1C1A' }} /> : null}
              </View>
              <AppText style={[sans(on ? '600' : '500'), { flex: 1, fontSize: 16, color: '#1D1C1A' }]}>{option}</AppText>
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
    <View
      style={{
        alignSelf: 'stretch',
        borderRadius: 16,
        borderCurve: 'continuous',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.07), 0 6px 16px rgba(40,38,32,0.05)',
        paddingVertical: 17,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
      }}>
      <Svg width={20} height={20} viewBox="0 0 18 18" fill="none">
        <Circle cx={9} cy={9} r={7.5} fill="none" stroke="#1D1C1A" strokeWidth={1.6} />
        <Path d="M5.8 9l2.3 2.3 4.1-4.6" stroke="#1D1C1A" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <AppText style={[sans('500'), { flex: 1, fontSize: 15, lineHeight: 22, color: '#55534E' }]}>{children}</AppText>
    </View>
  );
}

/**
 * `Lesson Scroll 1`'s night room, transcribed layer by layer.
 *
 * The canvas draws it in a 240 × 200 box scaled 1.12 from the top centre inside
 * a 270 × 224 slot, so the drawing is laid out at its own size and the scale is
 * applied to the wrapper — which is what keeps every child's offset the
 * canvas's own number rather than 1.12 times it.
 *
 * Five layers carry `filter: blur(5px)`. RN has no blur, so each is drawn as
 * the falloff it is: the two gradient discs keep their own stops, and the two
 * cast shadows become a radial ramp.
 */
function CoverScene() {
  return (
    <View style={{ width: 270, height: 224 }}>
      <View style={{ position: 'absolute', left: 15, top: 0, width: 240, height: 200, transform: [{ scale: 1.12 }], transformOrigin: 'top center' }}>
        <View style={{ position: 'absolute', left: 0, top: 0, width: 240, height: 200, overflow: 'hidden' }}>
          {/* the floor */}
          <SceneSvg>
            <Path d="M-28 192 A148 26 0 0 1 268 192 L268 230 L-28 230 Z" fill="#EAE9E3" />
            <Defs>
              <RadialGradient id="cs-win" cx="66" cy="158" rx="40" ry="40" gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor="#CBDAE8" stopOpacity={0.24} />
                <Stop offset="0.76" stopColor="#CBDAE8" stopOpacity={0} />
              </RadialGradient>
              <SvgLinearGradient id="cs-glass" x1="0" y1="16" x2="0" y2="88" gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor="#12151B" />
                <Stop offset="1" stopColor="#1A2027" />
              </SvgLinearGradient>
              <RadialGradient id="cs-lamp" cx="78" cy="114" rx="16" ry="16" gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.45} />
                <Stop offset="0.74" stopColor="#E2BA78" stopOpacity={0} />
              </RadialGradient>
              <RadialGradient id="cs-sh1" cx="78" cy="172.5" rx="25" ry="5.5" gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor="#000000" stopOpacity={0.08} />
                <Stop offset="0.5" stopColor="#000000" stopOpacity={0.058} />
                <Stop offset="0.78" stopColor="#000000" stopOpacity={0.024} />
                <Stop offset="1" stopColor="#000000" stopOpacity={0} />
              </RadialGradient>
              <RadialGradient id="cs-sh2" cx="174" cy="172.5" rx="59" ry="5.5" gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor="#000000" stopOpacity={0.09} />
                <Stop offset="0.5" stopColor="#000000" stopOpacity={0.065} />
                <Stop offset="0.78" stopColor="#000000" stopOpacity={0.027} />
                <Stop offset="1" stopColor="#000000" stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Circle cx={66} cy={158} r={40} fill="url(#cs-win)" />
          </SceneSvg>

          {/* the window, its mullion and its sill */}
          <View style={{ position: 'absolute', left: 44, top: 16, width: 58, height: 72, borderRadius: 6, overflow: 'hidden', boxShadow: '0 0 0 6px #E4E3DE, 0 5px 12px rgba(40,38,32,0.14)' }}>
            <SceneSvg width={58} height={72}>
              <Rect x={0} y={0} width={58} height={72} fill="url(#cs-glass)" />
            </SceneSvg>
          </View>
          <View style={{ position: 'absolute', left: 71, top: 16, width: 4, height: 72, backgroundColor: '#E4E3DE' }} />
          <View style={{ position: 'absolute', left: 37, top: 88, width: 72, height: 7, borderRadius: 3, backgroundColor: '#D6D5D0' }} />
          <View style={{ position: 'absolute', left: 82, top: 28, width: 13, height: 13, borderRadius: 6.5, backgroundColor: '#DCDED8', boxShadow: '0 0 10px rgba(220,222,216,0.6)' }} />
          <View style={{ position: 'absolute', left: 54, top: 50, width: 2.5, height: 2.5, borderRadius: 1.25, backgroundColor: 'rgba(244,243,240,0.6)' }} />
          <View style={{ position: 'absolute', left: 62, top: 68, width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(244,243,240,0.4)' }} />

          {/* the side table, the lamp on it, and what each casts */}
          <SceneSvg>
            <Ellipse cx={78} cy={172.5} rx={25} ry={5.5} fill="url(#cs-sh1)" />
          </SceneSvg>
          <View style={{ position: 'absolute', left: 56, top: 136, width: 44, height: 28, borderRadius: 5, backgroundColor: '#E4E3DE' }} />
          <View style={{ position: 'absolute', left: 65, top: 145, width: 26, height: 4, borderRadius: 2, backgroundColor: '#B4B1AB' }} />
          <View style={{ position: 'absolute', left: 60, top: 164, width: 5, height: 6, backgroundColor: '#C6C5C0' }} />
          <View style={{ position: 'absolute', left: 91, top: 164, width: 5, height: 6, backgroundColor: '#C6C5C0' }} />
          <SceneSvg>
            <Circle cx={78} cy={114} r={16} fill="url(#cs-lamp)" />
          </SceneSvg>
          <View style={{ position: 'absolute', left: 67, top: 100, width: 22, height: 15, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomRightRadius: 3, borderBottomLeftRadius: 3, backgroundColor: '#E9D2A4' }} />
          <View style={{ position: 'absolute', left: 76.5, top: 115, width: 3, height: 16, backgroundColor: '#C6C5C0' }} />
          <View style={{ position: 'absolute', left: 70, top: 131, width: 16, height: 5, borderRadius: 2.5, backgroundColor: '#C6C5C0' }} />

          {/* the bed */}
          <SceneSvg>
            <Ellipse cx={174} cy={172.5} rx={59} ry={5.5} fill="url(#cs-sh2)" />
          </SceneSvg>
          <View style={{ position: 'absolute', left: 114, top: 108, width: 10, height: 62, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomRightRadius: 3, borderBottomLeftRadius: 3, backgroundColor: '#D6D5D0' }} />
          <View style={{ position: 'absolute', left: 122, top: 138, width: 104, height: 24, borderTopLeftRadius: 6, borderTopRightRadius: 10, borderBottomRightRadius: 5, borderBottomLeftRadius: 5, backgroundColor: '#E0DFDA' }} />
          <View style={{ position: 'absolute', left: 156, top: 136, width: 70, height: 26, borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomRightRadius: 5, borderBottomLeftRadius: 4, backgroundColor: '#C9C8C1' }} />
          <View style={{ position: 'absolute', left: 162, top: 142, width: 56, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.55)' }} />
          <View
            style={{ position: 'absolute', left: 126, top: 129, width: 28, height: 14, borderTopLeftRadius: 7, borderTopRightRadius: 7, borderBottomRightRadius: 5, borderBottomLeftRadius: 5, backgroundColor: '#FFFFFF', boxShadow: 'inset 0 -2.5px 0 #D6D5D0, 0 1.5px 3px rgba(40,38,32,0.14)' }}
          />
          <View style={{ position: 'absolute', left: 124, top: 162, width: 6, height: 8, borderBottomRightRadius: 2, borderBottomLeftRadius: 2, backgroundColor: '#C6C5C0' }} />
          <View style={{ position: 'absolute', left: 216, top: 162, width: 6, height: 8, borderBottomRightRadius: 2, borderBottomLeftRadius: 2, backgroundColor: '#C6C5C0' }} />

          <View style={{ position: 'absolute', left: 212, top: 40, width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(200,225,235,0.4)' }} />
          <View style={{ position: 'absolute', left: 198, top: 68, width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(200,225,235,0.3)' }} />
        </View>
      </View>
    </View>
  );
}

/** A full-bleed SVG layer over the 240 x 200 scene box. */
function SceneSvg({ width = 240, height = 200, children }: { width?: number; height?: number; children: ReactNode }) {
  return (
    <Svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0 }} pointerEvents="none">
      {children}
    </Svg>
  );
}
