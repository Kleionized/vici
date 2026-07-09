import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { WorldArt } from '@/components/journey/WorldArt';
import { AppText, LoadingView, Screen, ScreenHeader } from '@/components/ui';
import { useCurrentLesson, useLessonProgressMap, useLessons } from '@/lib/backend';
import { colors, fonts, sans, spacing } from '@/lib/theme';
import { SIDE, type World, type WorldState, WORLDS } from '@/lib/worlds';

/**
 * Journey tab — the canvas itinerary (screens-worlds): ONE campaign, landing
 * to triumph, laid out as a scrolling list of grounds. Each ground leads with
 * its full landscape; state lives in the ink — a progress rule, CROSSED
 * stamps, ghosted art + a lock. Dotted legs keep the path feeling without the
 * game map. World n maps to curriculum week n.
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

  const open = (w: World) => {
    if (w.crisis) return router.push('/(app)/support');
    if (w.key === 'curio') return router.push('/search');
    if (w.state === 'locked') return;
    router.push({ pathname: '/week-roadmap', params: { week: String(w.n ?? currentWeek) } });
  };

  return (
    <Screen contentStyle={{ paddingTop: spacing.md }}>
      <ScreenHeader
        eyebrow="The journey"
        title="Landing to triumph"
        sub="One campaign, laid out as an itinerary. Tap a ground to open its lessons — there's no clock."
        pad={0}
      />

      {worlds.map((w, i) => (
        <View key={w.key}>
          {i > 0 ? <Leg /> : null}
          <GroundCard world={w} onPress={() => open(w)} />
        </View>
      ))}

      <View style={{ marginTop: 36, marginBottom: 10 }}>
        <AppText style={[sans('600'), { fontSize: 13, letterSpacing: 2.3, textTransform: 'uppercase', color: colors.text, paddingHorizontal: 4 }]}>
          Off the path
        </AppText>
      </View>
      {SIDE.map((w) => (
        <Pressable
          key={w.key}
          onPress={() => open(w)}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            backgroundColor: colors.surface,
            borderRadius: 18,
            padding: 16,
            marginBottom: 12,
            transform: [{ scale: pressed ? 0.985 : 1 }],
          })}>
          <View style={{ width: 56, height: 44, borderRadius: 12, overflow: 'hidden', backgroundColor: colors.ink }}>
            <WorldArt scene={w.key} hue={w.hue} w={56} h={44} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={[sans('500'), { fontSize: 15.5, color: colors.text }]}>{w.name}</AppText>
            <AppText style={[sans('400'), { fontSize: 13, color: colors.textMuted, marginTop: 2 }]}>{w.sub}</AppText>
          </View>
          <Svg width={9} height={16} viewBox="0 0 9 16" fill="none">
            <Path d="M1.5 1l6 7-6 7" stroke={colors.textSoft} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>
      ))}
    </Screen>
  );
}

// a short dotted leg between grounds — the path feeling without the map
function Leg() {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 10, gap: 5 }}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={{ width: 3.5, height: 3.5, borderRadius: 9999, backgroundColor: colors.textSofter, opacity: 0.8 }} />
      ))}
    </View>
  );
}

function GroundCard({ world, onPress }: { world: World; onPress: () => void }) {
  const locked = world.state === 'locked';
  const done = world.state === 'done';
  const count = world.done ?? 0;
  const pct = world.count ? Math.min(1, count / world.count) : 0;

  return (
    <Pressable
      onPress={onPress}
      disabled={locked}
      accessibilityRole="button"
      style={({ pressed }) => ({
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: colors.surface,
        transform: [{ scale: pressed ? 0.985 : 1 }],
      })}>
      {/* the landscape — full-bleed, ghosted when locked */}
      <View style={{ height: 128, backgroundColor: colors.ink, opacity: locked ? 0.38 : 1 }}>
        <WorldArt scene={world.key} hue={world.hue} w={402} h={128} />
        {done ? (
          <View
            style={{
              position: 'absolute',
              right: 14,
              top: 14,
              borderWidth: 1.6,
              borderColor: 'rgba(245,244,241,0.85)',
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 3,
              transform: [{ rotate: '-6deg' }],
            }}>
            <AppText style={[sans('700'), { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(245,244,241,0.9)' }]}>
              Crossed
            </AppText>
          </View>
        ) : null}
        {locked ? (
          <View style={{ position: 'absolute', right: 14, top: 14 }}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5" stroke="rgba(245,244,241,0.9)" strokeWidth={1.8} />
              <Path d="M4.4 10h15.2v9a2.6 2.6 0 0 1-2.6 2.6H7a2.6 2.6 0 0 1-2.6-2.6z" stroke="rgba(245,244,241,0.9)" strokeWidth={1.8} />
            </Svg>
          </View>
        ) : null}
      </View>

      {/* the itinerary line */}
      <View style={{ padding: 18, paddingTop: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
          <AppText style={{ fontFamily: fonts.serif, fontSize: 14, color: locked ? colors.textSoft : colors.textMuted, letterSpacing: 1 }}>
            {ROMAN[(world.n ?? 1) - 1]}
          </AppText>
          <AppText style={{ fontFamily: fonts.serif, fontSize: 21, lineHeight: 25, letterSpacing: 0.2, color: locked ? colors.textSoft : colors.text, flex: 1 }}>
            {world.name}
          </AppText>
          <AppText style={[sans('500'), { fontSize: 12.5, color: colors.textSoft, fontVariant: ['tabular-nums'] }]}>
            {done ? `${world.count} of ${world.count}` : locked ? `${world.count} lessons` : `${count} of ${world.count}`}
          </AppText>
        </View>
        <AppText style={[sans('400'), { fontSize: 13, color: locked ? colors.textSofter : colors.textMuted, marginTop: 3 }]}>
          {world.sub}
        </AppText>
        {!locked ? (
          <View style={{ height: 3.5, borderRadius: 9999, backgroundColor: 'rgba(0,0,0,0.08)', marginTop: 13, overflow: 'hidden' }}>
            <View style={{ width: `${Math.round(pct * 100)}%`, height: '100%', backgroundColor: colors.ink, borderRadius: 9999 }} />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
