import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Ellipse, G, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';

import { TaskScene } from '@/components/task/TaskScene';
import { AppText, Grain, PressScale } from '@/components/ui';
import { lessonForDay } from '@/content/curriculum84';
import { TASK_OPTION_ICONS, type TaskSvgChild } from '@/content/taskScenes';
import { useCheckins, useUpsertCheckin } from '@/lib/backend';
import { todayKey } from '@/lib/date';
import { sans } from '@/lib/theme';

/**
 * `Task DNN Intro` and `Task DNN Options` — the day's task, in two boards.
 *
 * The bundle draws a third frame per day, `Task DNN Card`, but it is a
 * specimen rather than a screen: it shows the same task as it appears on the
 * Today home and again in the night reminder, both of which are cards this app
 * already builds (DECISIONS D-045).
 *
 * Canvas tops include the 54pt status bar the app never builds, so every number
 * below is the canvas value less 54.
 */

const noiseDark = require('../../../assets/images/noise-dark.png');

export default function TaskBoards() {
  const router = useRouter();
  const { day } = useLocalSearchParams<{ day?: string }>();
  const n = Number(day) || 1;
  const lesson = lessonForDay(n);
  const checkins = useCheckins();
  const upsert = useUpsertCheckin();
  const [board, setBoard] = useState(0);
  const width = useWindowDimensions().width;

  if (!lesson) return null;
  const task = lesson.task;
  const options = task.options;
  // How this day's options board is drawn. `Task D01` lays its board out in
  // flow rather than in an absolute column, so it states no top — the shared
  // canvas 225 stands in, which is where every other icon board sits.
  const board1 = task.board;
  const intro = task.intro2;
  const step = board1.kind === 'step';
  const badge = board1.badge?.size ?? (step ? 24 : 40);
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  const done = () => {
    void upsert({ date: todayKey(), dailyAction: task.cardSummary, dailyActionDone: true }).catch(() => {});
    close();
  };
  const alreadyDone = (checkins ?? []).find((c) => c.date === todayKey())?.dailyActionDone ?? false;

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <StatusBar style="dark" />
      <Grain source={noiseDark} opacity={0.07} />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <PressScale
          onPress={board === 0 ? close : () => setBoard(0)}
          accessibilityRole="button"
          accessibilityLabel={board === 0 ? 'Close' : 'Back'}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 24 }}
          style={{ position: 'absolute', left: 16, top: 12, minHeight: 0, zIndex: 5 }}>
          <AppText style={[sans('400'), { fontSize: 17, color: '#3A3934' }]}>Close</AppText>
        </PressScale>

        {/* The `DAY N · TODAY'S TASK` eyebrow the previous bundle drew at canvas
            116 is gone: the new bundle deletes it from all 166 task frames, and
            from the reader's task page too. The title keeps its own absolute
            top, so nothing below it moves. */}
        {/* canvas 144 */}
        <AppText
          center
          style={[sans('500'), { position: 'absolute', left: 30, right: 30, top: 90, fontSize: 27, lineHeight: 35, color: '#1D1C1A' }]}>
          {board === 0 ? task.title : task.secondTitle}
        </AppText>

        {board === 0 ? (
          <>
            <AppText
              center
              style={[sans('400'), { position: 'absolute', left: 38, right: 38, top: intro.introTop, fontSize: 14.5, lineHeight: 21, color: '#55534E' }]}>
              {task.intro}
            </AppText>

            {/* The scene box, at the top and size this day's frame states: it
                sits anywhere from 197 to 386, and two days draw it shorter
                than 200. */}
            <View style={{ position: 'absolute', left: intro.sceneLeft, top: intro.sceneTop }}>
              <TaskScene day={n} width={Math.min(intro.sceneWidth, width - intro.sceneLeft * 2)} />
            </View>

            {/* What finishing it means — always 20pt below the scene's foot,
                which is why it moves with the scene rather than sitting at a
                top of its own. */}
            <View
              style={{
                position: 'absolute',
                left: 24,
                right: 24,
                top: intro.ruleTop,
                minHeight: intro.ruleHeight,
                borderRadius: 16,
                borderCurve: 'continuous',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 0 0 1px rgba(0,0,0,0.07), 0 6px 16px rgba(40,38,32,0.05)',
                paddingHorizontal: 18,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 13,
              }}>
              <Svg width={18} height={15} viewBox="0 0 16 13" fill="none">
                <Path d="M1.5 7l4.4 4.5L14.5 1.5" stroke="#131313" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <AppText style={[sans('500'), { flex: 1, fontSize: 13.5, lineHeight: 19, color: '#55534E' }]}>{task.done}</AppText>
            </View>
          </>
        ) : (
          // The board's own geometry, per day. The canvas puts this column at
          // canvas 209, 225 or 260 and varies every metric inside it, so none
          // of it is hardcoded here — `board` carries what the frame states.
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ position: 'absolute', left: 24, right: 24, top: board1.top ?? 171, bottom: board1.bottom ?? 54 }}
            contentContainerStyle={{ gap: board1.rowGap ?? 22 }}>
            {options.length === 0 ? (
              // days 74 and 76 draw this board with no rows in either source
              <AppText style={[sans('400'), { fontSize: 14.5, lineHeight: 21, color: '#8B8882' }]}>{task.done}</AppText>
            ) : null}
            {options.map((option, index) => (
              <View key={`${index}-${option.head}`} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: board1.cellGap ?? 14 }}>
                {step ? (
                  // The numbered variant: a 24pt disc carrying the step's own
                  // number, hairline-ringed and nudged 1pt down off the heading.
                  <View
                    style={{
                      width: badge,
                      height: badge,
                      borderRadius: badge / 2,
                      marginTop: 1,
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 0 0 1px rgba(0,0,0,0.09)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <AppText style={[sans('600'), { fontSize: 12, color: '#55534E' }]}>{index + 1}</AppText>
                  </View>
                ) : (
                  <View
                    style={{
                      width: badge,
                      height: badge,
                      borderRadius: typeof board1.badge?.radius === 'number' ? board1.badge.radius : 12,
                      borderCurve: 'continuous',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 0 0 1px rgba(0,0,0,0.08), 0 3px 8px rgba(40,38,32,0.06)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <OptionGlyph day={n} index={index} />
                  </View>
                )}
                <View style={{ flex: 1, minWidth: 0 }}>
                  <AppText style={[sans('600'), { fontSize: board1.head?.size ?? 15.5, lineHeight: board1.head?.lineHeight ?? 21, color: '#1D1C1A' }]}>
                    {option.head}
                  </AppText>
                  {/* Some rows are a heading alone — drawing an empty line would
                      still cost its line-height and push everything below it. */}
                  {option.body ? (
                    <AppText
                      style={[
                        sans('400'),
                        {
                          marginTop: board1.body?.marginTop ?? 3,
                          fontSize: board1.body?.size ?? 13,
                          lineHeight: board1.body?.lineHeight ?? 19,
                          color: '#767370',
                        },
                      ]}>
                      {option.body}
                    </AppText>
                  ) : null}
                </View>
              </View>
            ))}
            {/* The note under the last row. On most days it repeats the intro
                board's rule; on 23 it says something else, so it is its own
                field rather than a second render of `task.done`. Day 43 writes
                two paragraphs, each with its own gap above it — and the column
                already contributes `rowGap`, so that much is taken back out. */}
            {(task.close ?? []).map((para, i) => (
              <AppText
                key={i}
                style={[
                  sans('400'),
                  {
                    marginTop: para.marginTop - (board1.rowGap ?? 22),
                    fontSize: board1.body?.size ?? 13,
                    lineHeight: board1.body?.lineHeight ?? 19,
                    color: '#767370',
                  },
                ]}>
                {para.text}
              </AppText>
            ))}
          </ScrollView>
        )}

        {/* canvas 706 — two dots, one per board */}
        <View style={{ position: 'absolute', left: 0, right: 0, top: 652, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
          {[0, 1].map((i) => (
            <View key={i} style={{ width: i === board ? 18 : 6, height: 6, borderRadius: 3, backgroundColor: i === board ? '#131313' : 'rgba(19,19,19,0.18)' }} />
          ))}
        </View>

        {/* canvas 744 */}
        <PressScale
          onPress={board === 0 ? () => setBoard(1) : done}
          accessibilityRole="button"
          style={{
            position: 'absolute',
            left: 24,
            right: 24,
            top: 690,
            height: 52,
            minHeight: 52,
            borderRadius: 26,
            backgroundColor: '#131313',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AppText style={[sans('600'), { fontSize: 17, letterSpacing: 0.2, color: '#FFFFFF' }]}>
            {board === 0 ? 'Continue' : alreadyDone ? 'Done' : 'Mark as done'}
          </AppText>
        </PressScale>
      </SafeAreaView>
    </View>
  );
}

/** The row's own glyph, 22 in a 20-unit box, transcribed off the canvas. */
function OptionGlyph({ day, index }: { day: number; index: number }) {
  const icon = TASK_OPTION_ICONS[day]?.[index];
  if (!icon) return null;
  return (
    <Svg width={22} height={22} viewBox={icon.attrs.viewBox ?? '0 0 20 20'} fill="none">
      {icon.children.map((child, i) => (
        <GlyphChild key={i} child={child} />
      ))}
    </Svg>
  );
}

const NUM = new Set(['x', 'y', 'width', 'height', 'rx', 'ry', 'cx', 'cy', 'r', 'x1', 'y1', 'x2', 'y2', 'stroke-width', 'stroke-opacity', 'fill-opacity']);

function GlyphChild({ child }: { child: TaskSvgChild }) {
  const props: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(child.attrs)) {
    props[key.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = NUM.has(key) && !Number.isNaN(Number(value)) ? Number(value) : value;
  }
  switch (child.tag) {
    case 'path':
      return <Path {...props} />;
    case 'rect':
      return <Rect {...props} />;
    case 'circle':
      return <Circle {...props} />;
    case 'ellipse':
      return <Ellipse {...props} />;
    case 'line':
      return <Line {...props} />;
    case 'polygon':
      return <Polygon {...props} />;
    case 'polyline':
      return <Polyline {...props} />;
    case 'g':
      return <G {...props} />;
    default:
      return null;
  }
}
