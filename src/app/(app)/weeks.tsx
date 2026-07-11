import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { WorldCardArt } from '@/components/journey/WorldCardArt';
import { AppText, LoadingView, Screen } from '@/components/ui';
import { useCurrentLesson, useLessonProgressMap, useLessons } from '@/lib/backend';
import { colors, fonts, sans, spacing } from '@/lib/theme';
import { SIDE, type World, type WorldState, WORLDS } from '@/lib/worlds';

/**
 * Journey tab (canvas: screens-worlds · WorldMapScreen) — the campaign as an
 * itinerary of worlds, sea to summit. Each ground is a large card led by its
 * full faceted landscape; state lives in the ink (frosted GROUND eyebrow,
 * CROSSED stamps, ghosted art + an "After {prev}" chip, the state chip that
 * leads each text row, and the Continue pill on the current ground).
 */

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export default function Weeks() {
  const router = useRouter();
  const lessons = useLessons();
  const current = useCurrentLesson();
  const progress = useLessonProgressMap();

  if (!lessons || current === undefined || progress === undefined) {
    return (
      <Screen>
        <LoadingView />
      </Screen>
    );
  }

  const currentWeek = current?.lesson.week ?? 1;
  const worlds: World[] = WORLDS.map((w) => {
    const n = w.n ?? 1;
    let state: WorldState = 'locked';
    let done = w.done;
    if (n < currentWeek) {
      state = 'done';
      done = w.count;
    } else if (n === currentWeek) {
      state = 'current';
      done = lessons.filter((l) => l.week === n && progress[l.slug]?.status === 'completed').length;
    }
    return { ...w, state, done };
  });

  const lessonsDone = worlds.reduce((n, w) => n + (w.state === 'done' ? w.count : w.done || 0), 0);
  const lessonsAll = worlds.reduce((n, w) => n + w.count, 0);
  const curIdx = Math.max(
    0,
    worlds.findIndex((w) => w.state === 'current'),
  );

  const open = (w: World) => {
    if (w.crisis) return router.push('/(app)/support');
    if (w.key === 'curio') return router.push('/search');
    if (w.state === 'locked') return;
    router.push({ pathname: '/week-roadmap', params: { week: String(w.n ?? currentWeek) } });
  };

  return (
    <Screen contentStyle={{ paddingTop: spacing.md }}>
      {/* header */}
      <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: colors.textSoft, marginTop: 8 }]}>
        Your journey
      </AppText>
      <AppText style={{ fontFamily: fonts.serifSharp, fontSize: 34, letterSpacing: 0.34, color: colors.text, marginTop: 8 }}>
        The campaign
      </AppText>
      <AppText style={[sans('400'), { fontSize: 14.5, lineHeight: 22, color: colors.textMuted, marginTop: 10, maxWidth: 300 }]}>
        Ten grounds between the landing and the triumph. Taken at your pace — and kept.
      </AppText>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16, marginBottom: 26 }}>
        <View style={{ flex: 1, height: 4.5, borderRadius: 9999, backgroundColor: colors.borderStrong, overflow: 'hidden' }}>
          <View style={{ width: `${Math.max(3, (lessonsDone / lessonsAll) * 100)}%`, height: '100%', borderRadius: 9999, backgroundColor: colors.ink }} />
        </View>
        <AppText style={[sans('500'), { fontSize: 12.5, color: colors.textMuted, fontVariant: ['tabular-nums'] }]}>
          Ground {ROMAN[curIdx]} · {lessonsDone} of {lessonsAll}
        </AppText>
      </View>

      {/* the worlds, shore first */}
      {worlds.map((w, i) => (
        <View key={w.key}>
          {i > 0 ? <LegDots /> : null}
          <WorldListCard w={w} prevName={i > 0 ? worlds[i - 1].name : ''} onOpen={() => open(w)} />
        </View>
      ))}

      {/* side quests */}
      <View style={{ marginTop: 38, marginBottom: 12 }}>
        <AppText style={[sans('600'), { fontSize: 11, letterSpacing: 1.8, textTransform: 'uppercase', color: colors.textSoft, paddingHorizontal: 4 }]}>
          Off the path
        </AppText>
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {SIDE.map((w) => (
          <SideQuestCard key={w.key} w={w} onOpen={() => open(w)} />
        ))}
      </View>
    </Screen>
  );
}

// dotted leg between cards — the path, quieted to punctuation
function LegDots() {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 9, gap: 5 }}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={{ width: 3.5, height: 3.5, borderRadius: 9999, backgroundColor: colors.textSofter, opacity: 0.75 - i * 0.18 }} />
      ))}
    </View>
  );
}

// the state chip that leads each card's text row
function WorldStateChip({ w }: { w: World }) {
  if (w.state === 'done') {
    return (
      <View style={{ width: 36, height: 36, borderRadius: 9999, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Path d="M5 12.5l4.5 4.5L19 7" stroke={colors.inkText} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </View>
    );
  }
  if (w.state === 'locked') {
    return (
      <View style={{ width: 36, height: 36, borderRadius: 9999, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
          <Rect x={5} y={11} width={14} height={9} rx={2} stroke={colors.textSoft} strokeWidth={2} />
          <Path d="M8 11V8a4 4 0 018 0v3" stroke={colors.textSoft} strokeWidth={2} />
        </Svg>
      </View>
    );
  }
  return (
    <View style={{ width: 36, height: 36, borderRadius: 9999, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
      <AppText style={[sans('500'), { fontSize: 14, color: colors.text, fontVariant: ['tabular-nums'] }]}>{w.n}</AppText>
    </View>
  );
}

// one leg of the journey — a big illustrated card
function WorldListCard({ w, prevName, onOpen }: { w: World; prevName: string; onOpen: () => void }) {
  const cur = w.state === 'current';
  const locked = w.state === 'locked';
  const done = w.state === 'done';
  const pct = cur ? (w.done || 0) / w.count : done ? 1 : 0;
  const artHeight = cur ? 176 : locked ? 118 : 148;
  return (
    <Pressable
      onPress={onOpen}
      accessibilityRole="button"
      style={({ pressed }) => ({
        backgroundColor: colors.surface,
        borderRadius: 20,
        overflow: 'hidden',
        transform: [{ scale: pressed ? 0.985 : 1 }],
      })}>
      <WorldCardArt sceneKey={w.key} height={artHeight} ghost={locked}>
        {/* world eyebrow, frosted onto the art */}
        <View style={{ position: 'absolute', top: 12, left: 12, borderRadius: 9999, paddingHorizontal: 11, paddingVertical: 5, backgroundColor: 'rgba(247,245,240,0.72)' }}>
          <AppText style={[sans('500'), { fontSize: 9.5, letterSpacing: 1.33, textTransform: 'uppercase', color: colors.textMuted }]}>
            Ground {ROMAN[(w.n ?? 1) - 1]} of X
          </AppText>
        </View>
        {done ? (
          <View
            style={{
              position: 'absolute',
              top: 14,
              right: 12,
              transform: [{ rotate: '8deg' }],
              borderWidth: 2.2,
              borderColor: 'rgba(59,59,51,0.65)',
              borderRadius: 9,
              paddingHorizontal: 10,
              paddingVertical: 5,
              backgroundColor: '#F7F6F2',
            }}>
            <AppText style={[sans('500'), { fontSize: 10.5, letterSpacing: 1.58, color: 'rgba(59,59,51,0.75)' }]}>CROSSED</AppText>
          </View>
        ) : null}
        {locked ? (
          <View
            style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              borderRadius: 9999,
              paddingHorizontal: 11,
              paddingVertical: 5,
              backgroundColor: 'rgba(247,245,240,0.72)',
            }}>
            <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
              <Rect x={5} y={11} width={14} height={9} rx={2} stroke={colors.textMuted} strokeWidth={2.4} />
              <Path d="M8 11V8a4 4 0 018 0v3" stroke={colors.textMuted} strokeWidth={2.4} />
            </Svg>
            <AppText style={[sans('500'), { fontSize: 10.5, color: colors.textMuted }]}>After {prevName}</AppText>
          </View>
        ) : null}
      </WorldCardArt>

      <View style={{ paddingHorizontal: 18, paddingTop: 15, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
          <WorldStateChip w={w} />
          <View style={{ flex: 1 }}>
            <AppText style={{ fontFamily: fonts.serif, fontSize: 20.5, lineHeight: 23, letterSpacing: 0.1, color: locked ? colors.textMuted : colors.text }}>
              {w.name}
            </AppText>
            <AppText style={[sans('400'), { fontSize: 13, color: colors.textSoft, marginTop: 4 }]}>{w.sub}</AppText>
          </View>
          <AppText style={[sans('400'), { fontSize: 12, lineHeight: 16, color: colors.textSoft, textAlign: 'right', fontVariant: ['tabular-nums'] }]}>
            {w.count} lessons{w.mins ? `\n~${w.mins} min` : ''}
          </AppText>
        </View>
        {cur ? (
          <View style={{ marginTop: 15 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flex: 1, height: 5, borderRadius: 9999, backgroundColor: colors.borderStrong, overflow: 'hidden' }}>
                <View style={{ width: `${Math.max(4, pct * 100)}%`, height: '100%', borderRadius: 9999, backgroundColor: colors.ink }} />
              </View>
              <AppText style={[sans('500'), { fontSize: 12.5, color: colors.textMuted, fontVariant: ['tabular-nums'] }]}>
                {w.done || 0} of {w.count}
              </AppText>
            </View>
            <View style={{ marginTop: 14, borderRadius: 9999, paddingVertical: 13, alignItems: 'center', backgroundColor: colors.ink }}>
              <AppText style={[sans('600'), { fontSize: 14.5, letterSpacing: 0.15, color: colors.inkText }]}>
                Continue · lesson {(w.done || 0) + 1}
              </AppText>
            </View>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

// side quests — smaller companions at the foot of the list
function SideQuestCard({ w, onOpen }: { w: World; onOpen: () => void }) {
  return (
    <Pressable
      onPress={onOpen}
      accessibilityRole="button"
      style={({ pressed }) => ({
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 20,
        overflow: 'hidden',
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}>
      <WorldCardArt sceneKey={w.key} height={88} />
      <View style={{ paddingHorizontal: 14, paddingTop: 12, paddingBottom: 13 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          {w.crisis ? (
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M12 3l9 16H3L12 3z" stroke={colors.text} strokeWidth={2.2} strokeLinejoin="round" />
              <Path d="M12 10v4M12 17v.5" stroke={colors.text} strokeWidth={2.2} strokeLinecap="round" />
            </Svg>
          ) : (
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16z" stroke={colors.text} strokeWidth={2.2} />
              <Path d="M12 8.5v7M8.5 12h7" stroke={colors.text} strokeWidth={2.2} strokeLinecap="round" />
            </Svg>
          )}
          <AppText style={[sans('500'), { flex: 1, fontSize: 13.5, lineHeight: 16, color: colors.text }]}>{w.name.split(' & ')[0]}</AppText>
        </View>
        <AppText style={[sans('400'), { fontSize: 11.5, color: colors.textSoft, marginTop: 4 }]}>{w.sub}</AppText>
      </View>
    </Pressable>
  );
}
