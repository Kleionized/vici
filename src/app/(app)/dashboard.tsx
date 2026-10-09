import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

import { tally, triggersOf, useLabelColumn } from '@/components/logflow';
import { AN_RANGES, HeatHeader, HeatLegend, HeatRow } from '@/components/insights/heat';
import { Caps, LoadingView, MonoText, NavBar, P, Row, RowGroup, Screen, Segmented, TitleHead } from '@/components/mono';
import { useCheckins, useCurrentUser, useEvents } from '@/lib/backend';
import { lastNDateKeys } from '@/lib/date';
import { addDays, dayMood, isCheckin, isSlip, keyToDate, programmeStartKey, useToday } from '@/lib/day';
import { mono } from '@/lib/theme';

/**
 * Insights (no frame draws it — routes §4.3): a mood heat, one disc a day over
 * 2, 4 or 12 weeks, three numbers, the four triggers that come up most, and the
 * doors to the mail and the medallions. Styled after Urge Overview: the title
 * head with the range as the segmented switch, the numbers as big-stat columns,
 * the triggers as its dot-row idiom with a bar, the doors as a settings group.
 * The whole page scrolls, its head included.
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
  const user = useCurrentUser();
  const [range, setRange] = useState(14);
  const openedAt = useToday();
  // the Library tab no longer lights for Insights, so the way back is Today
  const back = () => (router.canGoBack() ? router.back() : router.navigate('/(app)/today'));

  const data = useMemo(() => {
    if (!checkins || !events || user === undefined) return null;
    const cfg = AN_RANGES.find((r) => r.days === range)!;
    const keys = lastNDateKeys(range); // oldest → today
    // the day's mood: the morning's reading, else the night's (src/lib/day.ts)
    const moodBy = new Map(checkins.filter((c) => isCheckin(c) && dayMood(c) != null).map((c) => [c.date, (dayMood(c) as number) - 1]));
    const moods = keys.map((k) => (moodBy.has(k) ? Math.min(4, Math.max(0, moodBy.get(k)!)) : null));
    const weeks: (number | null)[][] = [];
    for (let i = 0; i < moods.length; i += 7) weeks.push(moods.slice(i, i + 7));

    // The range never reaches back past the programme's first day: a new user
    // is not shown weeks of "kept" days they never had (S4).
    const firstKey = programmeStartKey(user);
    const lived = keys.filter((k) => firstKey == null || k >= firstKey);
    const cutoff = keyToDate(lived[0] ?? keys[keys.length - 1]).getTime();
    const inRange = events.filter((e) => e.createdAt >= cutoff && e.createdAt < addDays(openedAt, 1).getTime());
    const isUrge = (t: string) => t === 'urge_rode_out' || t === 'urge_acted_on';
    const urges = inRange.filter((e) => isUrge(e.type)).length;
    // a slip is either kind, counted once per day
    const slipDays = new Set(inRange.filter(isSlip).map((e) => new Date(e.createdAt).toDateString())).size;
    const kept = Math.max(0, lived.length - slipDays);
    const nCheckins = moods.filter((v) => v != null).length;

    // top triggers — the first one each logged urge names; an SOS urge from before
    // trigger was written names it in precedingState.reasons (triggersOf reads both)
    const triggers = tally(inRange.filter((e) => isUrge(e.type)).map((e) => triggersOf([e])[0]).filter((t): t is string => Boolean(t))).slice(0, 4);
    const tMax = Math.max(...triggers.map(([, n]) => n), 1);

    return { cfg, keys, weeks, urges, kept, nCheckins, triggers, tMax };
    // `openedAt` (the screen's clock) moves the range on to the new day
  }, [checkins, events, user, openedAt, range]);

  // the trigger names are the pickers' own (`Something online`), wider than the 96 column
  const { width } = useWindowDimensions();
  const labels = useLabelColumn((data?.triggers ?? []).map(([label]) => label), width - 48 - 4);

  if (!data) return <LoadingView onBack={back} />;

  const { cfg, keys, weeks, urges, kept, nCheckins, triggers, tMax } = data;
  const lastWeekLen = weeks.length ? weeks[weeks.length - 1].length : 7;

  return (
    <Screen>
      <ScrollView style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} contentContainerStyle={{ paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        <View style={{ height: 236 }}>
          <NavBar left="back" onBack={back} />
          <TitleHead title="Insights" />
          <Segmented
            items={AN_RANGES.map((r) => ({ key: String(r.days), label: r.label }))}
            value={String(range)}
            onChange={(key) => setRange(Number(key))}
            style={{ position: 'absolute', left: 16, right: 16, top: 164 }}
          />
        </View>

        <View style={{ paddingHorizontal: 24, gap: 40 }}>
          {/* mood, one disc per day */}
          <View style={{ gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Caps>Mood, day by day</Caps>
              <Caps>
                {fmt(keys[0])} – {fmt(keys[keys.length - 1])}
              </Caps>
            </View>
            <HeatHeader first={(new Date(`${keys[0]}T00:00:00`).getDay() + 6) % 7} />
            <View style={{ gap: 8 }}>
              {weeks.map((w, i) => (
                <HeatRow key={i} week={w} d={cfg.d} todayIdx={i === weeks.length - 1 ? lastWeekLen - 1 : -1} />
              ))}
            </View>
            <HeatLegend />
          </View>

          {/* the three numbers */}
          <View style={{ flexDirection: 'row' }}>
            {(
              [
                [nCheckins, 'Check-ins'],
                [urges, 'Urges logged'],
                [kept, 'Clean days'],
              ] as [number, string][]
            ).map(([v, label]) => (
              <View key={label} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
                <MonoText v="title" center wrap="nowrap">
                  {String(v)}
                </MonoText>
                <Caps center>{label}</Caps>
              </View>
            ))}
          </View>

          {/* what sets it off — the four most named, as dot-row bars */}
          <View style={{ gap: 8 }}>
            <Caps>What sets it off</Caps>
            {triggers.length ? (
              <View>
                {labels.measure}
                {triggers.map(([label, n], i) => (
                  <View
                    key={label}
                    style={{ height: i ? 47 : 46, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 2, borderTopWidth: i ? 1 : 0, borderTopColor: mono.line }}>
                    <MonoText v="rowLabel" numberOfLines={1} style={{ width: labels.column }}>
                      {label}
                    </MonoText>
                    <View style={{ flex: 1, height: 3, borderRadius: 1.5, backgroundColor: mono.line }}>
                      <View style={{ width: `${(n / tMax) * 100}%`, height: 3, borderRadius: 1.5, backgroundColor: mono.ink }} />
                    </View>
                    <MonoText v="rowValue">{String(n)}</MonoText>
                  </View>
                ))}
              </View>
            ) : (
              <P color={mono.mute}>Log an urge to see what sets it off.</P>
            )}
            <MonoText v="pill" color={mono.mute} style={{ fontSize: 12, lineHeight: 15 }}>
              From the {urges} urge{urges === 1 ? '' : 's'} you logged in this range
            </MonoText>
          </View>

          {/* quiet doors — mail + medallions (navigation, not analytics) */}
          <RowGroup>
            <Row label="Your mail" value="Weekly reports & letters" valueLines={1} onPress={() => router.push('/mail')} />
            <Row label="Medallions" value="Earned and to come" valueLines={1} onPress={() => router.push('/milestones')} />
          </RowGroup>
        </View>
      </ScrollView>
    </Screen>
  );
}
