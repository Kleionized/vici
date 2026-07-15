import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { View } from 'react-native';

import { AnCaps, AnDowHeader, AnLabel, AnStats, AnWeekRow, Delta, MOOD_NAME } from '@/components/insights/heat';
import { AppText, LoadingView, Screen, ScreenHeader } from '@/components/ui';
import { useCheckins, useCurrentUser, useEvents } from '@/lib/backend';
import { colors, fonts, sans, spacing } from '@/lib/theme';
import { buildWeeklyReport, latestCompletedWeek } from '@/lib/weeklyReport';

/**
 * Weekly report (canvas: screens-analytics · WeeklyReportScreen) — one
 * verdict line, this week vs last as two heatmap rows, three numerals
 * with quiet deltas, one focus. Nothing else.
 */

export default function WeeklyReport() {
  const router = useRouter();
  const { week } = useLocalSearchParams<{ week?: string }>();
  const user = useCurrentUser();
  const checkins = useCheckins();
  const events = useEvents();

  const weekStart = week || (user ? latestCompletedWeek(user.createdAt) : null);
  const report = useMemo(
    () => (weekStart && checkins && events ? buildWeeklyReport(weekStart, checkins, events) : null),
    [weekStart, checkins, events],
  );
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/dashboard'));

  if (checkins === undefined || events === undefined || user === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style="dark" />
        <LoadingView />
      </View>
    );
  }

  if (!report || report.thisAvg == null) {
    return (
      <Screen contentStyle={{ paddingTop: spacing.md }}>
        <StatusBar style="dark" />
        <ScreenHeader title="This week" pad={0} onBack={back} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 120 }}>
          <AppText center style={{ fontFamily: fonts.serif, fontSize: 22, lineHeight: 29, color: colors.text, maxWidth: 250 }}>
            Your first week is still being written.
          </AppText>
          <AppText center style={[sans('400'), { fontSize: 13.5, lineHeight: 20, color: colors.textMuted, marginTop: 12, maxWidth: 260 }]}>
            Keep checking in. Once a full week closes, its report lands here.
          </AppText>
        </View>
      </Screen>
    );
  }

  const tw = report.thisAvg;
  const lw = report.lastAvg;
  const verdict =
    lw == null
      ? 'Your first full week.'
      : tw - lw >= 0.25
        ? 'Steadier than last week.'
        : lw - tw >= 0.25
          ? 'A heavier week than last.'
          : 'A steady week.';
  const toIdx = (v: number) => Math.max(0, Math.min(4, Math.round(v) - 1));
  const thisRow = report.thisMoods.map((m) => (m == null ? null : toIdx(m)));
  const lastRow = report.lastMoods.map((m) => (m == null ? null : toIdx(m)));

  // one focus, read off the week
  const focus =
    report.lateNightUrges > 0
      ? {
          title: 'Protect your wind-down.',
          body: `${report.lateNightUrges} of this week’s urges came after 10pm. The late window is where the week leans.`,
        }
      : report.relapses > 0
        ? { title: 'Never fail twice.', body: 'One slip this week. The next choice is the one that counts: water, daylight, one lesson.' }
        : report.checkins < 5
          ? { title: 'Keep the check-ins daily.', body: 'The heatmap only reads as well as it’s fed. Twenty seconds a day is enough.' }
          : { title: 'Hold the line.', body: 'The week held. Same anchors next week, nothing new to add.' };

  const dUrges = report.urges - report.urgesLast;
  const dRelapses = report.relapses - report.relapsesLast;

  return (
    <Screen contentStyle={{ paddingTop: spacing.md }}>
      <StatusBar style="dark" />
      <ScreenHeader
        title="This week"
        pad={0}
        onBack={back}
        trailing={<AppText style={[sans('500'), { fontSize: 14, color: colors.textSoft, fontVariant: ['tabular-nums'] }]}>{report.label}</AppText>}
      />

      {/* the verdict */}
      <View style={{ paddingTop: 2 }}>
        <AppText style={{ fontFamily: fonts.serif, fontSize: 31, lineHeight: 33.5, letterSpacing: 0.16, color: colors.text }}>{verdict}</AppText>
        <AppText style={[sans('400'), { fontSize: 14, lineHeight: 21, color: colors.textMuted, marginTop: 12 }]}>
          Your mood averaged <AppText style={[sans('600'), { fontSize: 14, color: colors.text }]}>{MOOD_NAME[toIdx(tw)]}</AppText>
          {lw != null ? (
            <>
              , {tw >= lw ? 'up from' : 'down from'}{' '}
              <AppText style={[sans('600'), { fontSize: 14, color: colors.text }]}>{MOOD_NAME[toIdx(lw)]}</AppText>
            </>
          ) : null}
          .
        </AppText>
      </View>

      {/* day by day — the same cell language as the patterns heatmap */}
      <View style={{ paddingTop: 48 }}>
        <AnLabel>Day by day</AnLabel>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20, marginBottom: 8 }}>
          <View style={{ width: 74 }} />
          <AnDowHeader style={{ flex: 1 }} />
        </View>
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <AnCaps style={{ width: 74 }}>Last week</AnCaps>
            <AnWeekRow week={lastRow} h={34} r={9} alpha={30} style={{ flex: 1 }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <AnCaps style={{ width: 74 }}>This week</AnCaps>
            <AnWeekRow week={thisRow} h={34} r={9} style={{ flex: 1 }} />
          </View>
        </View>
      </View>

      {/* the numerals, with quiet deltas */}
      <View style={{ marginTop: 52 }}>
        <AnStats
          stats={[
            [report.urges, 'Urges', dUrges !== 0 ? <Delta down={dUrges < 0}>{Math.abs(dUrges)}</Delta> : undefined],
            [report.relapses, 'Relapses', dRelapses !== 0 ? <Delta down={dRelapses < 0}>{Math.abs(dRelapses)}</Delta> : undefined],
            [report.checkins, 'Check-ins', undefined],
          ]}
        />
      </View>

      {/* one focus — plain, no card */}
      <View style={{ paddingTop: 56, paddingBottom: 24 }}>
        <View style={{ height: 1, backgroundColor: colors.border, marginBottom: 40 }} />
        <AnLabel>Next week’s focus</AnLabel>
        <AppText style={{ fontFamily: fonts.serif, fontSize: 27, lineHeight: 30, letterSpacing: 0.14, color: colors.text, marginTop: 12 }}>
          {focus.title}
        </AppText>
        <AppText style={[sans('400'), { fontSize: 13.5, lineHeight: 20, color: colors.textMuted, marginTop: 12 }]}>{focus.body}</AppText>
      </View>
    </Screen>
  );
}
