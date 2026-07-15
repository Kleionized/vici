import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { AN_RANGES, AnCaps, AnDowHeader, AnLabel, AnLegend, AnRangeFilter, AnStats, AnWeekRow } from '@/components/insights/heat';
import { AppText, LoadingView, Screen, ScreenHeader } from '@/components/ui';
import { useCheckins, useEvents } from '@/lib/backend';
import { lastNDateKeys } from '@/lib/date';
import { colors, sans, spacing } from '@/lib/theme';

/**
 * You · Insights (canvas: screens-analytics · AnalyticsScreen) — stripped
 * to essentials: a mood heatmap (one tinted cell per day, 2W/4W/12W),
 * three numerals, four trigger bars. Nothing else.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmt = (k: string) => {
  const d = new Date(`${k}T00:00:00`);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
};

export default function Dashboard() {
  const router = useRouter();
  const checkins = useCheckins();
  const events = useEvents();
  const [range, setRange] = useState(14);

  const data = useMemo(() => {
    if (!checkins || !events) return null;
    const cfg = AN_RANGES.find((r) => r.days === range)!;
    const keys = lastNDateKeys(range); // oldest → today
    const moodBy = new Map(checkins.filter((c) => c.mood != null).map((c) => [c.date, (c.mood as number) - 1]));
    const moods = keys.map((k) => (moodBy.has(k) ? Math.min(4, Math.max(0, moodBy.get(k)!)) : null));
    const weeks: (number | null)[][] = [];
    for (let i = 0; i < moods.length; i += 7) weeks.push(moods.slice(i, i + 7));

    const cutoff = Date.now() - range * 86400000;
    const inRange = events.filter((e) => e.createdAt >= cutoff);
    const isUrge = (t: string) => t === 'urge_rode_out' || t === 'urge_acted_on';
    const urges = inRange.filter((e) => isUrge(e.type)).length;
    const lapses = new Set(inRange.filter((e) => e.type === 'lapse').map((e) => new Date(e.createdAt).toDateString())).size;
    const kept = range - lapses;
    const nCheckins = moods.filter((v) => v != null).length;

    // top triggers — counted off the logged urges in this range
    const counts = new Map<string, number>();
    for (const e of inRange) {
      if (!isUrge(e.type) || !e.trigger) continue;
      const first = e.trigger.split(' · ')[0];
      counts.set(first, (counts.get(first) ?? 0) + 1);
    }
    const triggers = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
    const tMax = Math.max(...triggers.map(([, n]) => n), 1);

    return { cfg, keys, weeks, urges, kept, nCheckins, triggers, tMax };
  }, [checkins, events, range]);

  if (!data) {
    return (
      <Screen>
        <LoadingView />
      </Screen>
    );
  }

  const { cfg, keys, weeks, urges, kept, nCheckins, triggers, tMax } = data;
  const lastWeekLen = weeks.length ? weeks[weeks.length - 1].length : 7;

  return (
    <Screen contentStyle={{ paddingTop: spacing.md }}>
      <ScreenHeader title="Your patterns" pad={0} trailing={<AnRangeFilter value={range} onChange={setRange} />} />

      {/* mood, one cell per day */}
      <View style={{ paddingTop: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <AnLabel>Mood, day by day</AnLabel>
          <AnCaps>
            {fmt(keys[0])} – {fmt(keys[keys.length - 1])}
          </AnCaps>
        </View>
        <AnDowHeader style={{ marginTop: 20, marginBottom: 8 }} />
        <View style={{ gap: 6 }}>
          {weeks.map((w, i) => (
            <AnWeekRow key={i} week={w} h={cfg.h} r={cfg.r} todayIdx={i === weeks.length - 1 ? lastWeekLen - 1 : -1} />
          ))}
        </View>
        <AnLegend />
      </View>

      {/* the numerals */}
      <View style={{ marginTop: 52 }}>
        <AnStats stats={[[nCheckins, 'Check-ins'], [urges, 'Urges logged'], [kept, 'Days kept']]} />
      </View>

      {/* top triggers — four thin bars */}
      <View style={{ paddingTop: 52, paddingBottom: 24 }}>
        <AnLabel>What sets it off</AnLabel>
        {triggers.length ? (
          <View style={{ gap: 21, marginTop: 24 }}>
            {triggers.map(([label, n]) => (
              <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <AppText style={[sans('500'), { width: 84, fontSize: 14, color: colors.text }]} numberOfLines={1}>
                  {label}
                </AppText>
                <View style={{ flex: 1, height: 3, borderRadius: 9999, backgroundColor: colors.accentSoft }}>
                  <View style={{ width: `${(n / tMax) * 100}%`, height: '100%', borderRadius: 9999, backgroundColor: colors.ink }} />
                </View>
                <AppText style={[sans('500'), { width: 20, textAlign: 'right', fontSize: 13, color: colors.textSoft, fontVariant: ['tabular-nums'] }]}>
                  {n}
                </AppText>
              </View>
            ))}
          </View>
        ) : (
          <AppText style={[sans('400'), { fontSize: 13.5, color: colors.textMuted, marginTop: 20 }]}>
            Log an urge and its trigger. The bars build from there.
          </AppText>
        )}
        <AppText style={[sans('400'), { fontSize: 11.5, color: colors.textSofter, marginTop: 18 }]}>
          From the {urges} urge{urges === 1 ? '' : 's'} you logged in this range
        </AppText>
      </View>

      {/* quiet doors — mail + medallions (navigation, not analytics) */}
      <View style={{ gap: 10, marginTop: 12, marginBottom: 8 }}>
        {(
          [
            ['Your mail', 'Weekly reports & letters', () => router.push('/mail')],
            ['Medallions', 'The campaign album', () => router.push('/milestones')],
          ] as [string, string, () => void][]
        ).map(([title, sub, go]) => (
          <Pressable
            key={title}
            onPress={go}
            accessibilityRole="button"
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              backgroundColor: colors.surface,
              borderRadius: 16,
              paddingVertical: 14,
              paddingHorizontal: 16,
              transform: [{ scale: pressed ? 0.99 : 1 }],
            })}>
            <View style={{ width: 40, height: 40, borderRadius: 11, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
              {title === 'Your mail' ? (
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Rect x={3} y={5} width={18} height={14} rx={2.4} stroke={colors.text} strokeWidth={1.8} />
                  <Path d="M4.5 7.5l7.5 5.5 7.5-5.5" stroke={colors.text} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              ) : (
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path d="M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17z" stroke={colors.text} strokeWidth={1.6} strokeDasharray="1.8 3.4" />
                  <Path d="M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6z" stroke={colors.text} strokeWidth={1.6} />
                </Svg>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <AppText style={[sans('600'), { fontSize: 15.5, color: colors.text }]}>{title}</AppText>
              <AppText style={[sans('400'), { fontSize: 13, color: colors.textMuted, marginTop: 1 }]}>{sub}</AppText>
            </View>
            <Svg width={9} height={16} viewBox="0 0 9 16" fill="none">
              <Path d="M1.5 1l6 7-6 7" stroke={colors.textSoft} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
