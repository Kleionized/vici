import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, G, Path } from 'react-native-svg';

import { AppText, LoadingView } from '@/components/ui';
import { SBoat, SC, SGull, SMoonF, SSun } from '@/components/scene/SceneKit';
import { useCheckins, useCurrentUser, useEvents } from '@/lib/backend';
import { buildWeeklyReport, latestCompletedWeek, MOOD_NAME, severityWord } from '@/lib/weeklyReport';
import { colors, fonts, sans, spacing } from '@/lib/theme';

const MTONE = colors.moodTones;
const moodColor = (v: number) => MTONE[Math.max(0, Math.min(4, Math.round(v) - 1))];

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

  if (checkins === undefined || events === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <LoadingView />
      </View>
    );
  }

  if (!report) {
    // account younger than a full week — nothing to compare yet
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style="dark" />
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 29 }} edges={['top', 'bottom']}>
          <Header label="—" onBack={back} />
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <AppText center style={{ fontFamily: fonts.serif, fontSize: 27, color: colors.text, maxWidth: 260 }}>
              Your first week is still being written.
            </AppText>
            <AppText center style={[sans('400'), { fontSize: 14, color: colors.textMuted, maxWidth: 280, lineHeight: 21 }]}>
              Keep checking in — once a full week closes, its report lands here.
            </AppText>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const { thisAvg, lastAvg } = report;
  const rising = thisAvg != null && lastAvg != null && thisAvg - lastAvg >= 0.25;
  const dipping = thisAvg != null && lastAvg != null && lastAvg - thisAvg >= 0.25;
  const verdict = thisAvg == null
    ? 'A quiet week.'
    : lastAvg == null
      ? 'Your first full week.'
      : rising
        ? 'Steadier than last week.'
        : dipping
          ? 'A heavier week than last.'
          : 'A steady week.';

  const urgeDelta = report.urges - report.urgesLast;
  const relapseDelta = report.relapses - report.relapsesLast;
  const sevWord = severityWord(report.avgSeverity);
  const sevWordLast = severityWord(report.avgSeverityLast);
  const easier = report.urges > 0 && report.urgesLast > 0 && report.urges < report.urgesLast;
  const nightPct = report.urges > 0 ? Math.round((report.lateNightUrges / report.urges) * 100) : 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 56 }}>
        <SafeAreaView edges={['top']} style={{ paddingHorizontal: 29 }}>
          <Header label={report.label} onBack={back} />
        </SafeAreaView>

        {/* the week, clearing — full-bleed */}
        <View style={{ marginTop: 4 }}>
          <ClearingScene />
        </View>

        {/* how you're feeling */}
        <View style={{ paddingHorizontal: 29, marginTop: 26 }}>
          <Label>How you’re feeling</Label>
          <AppText style={{ fontFamily: fonts.serif, fontSize: 31, lineHeight: 34, color: colors.text, marginTop: 10 }}>
            {verdict}
          </AppText>
          {thisAvg != null && (
            <AppText style={[sans('400'), { fontSize: 14, color: colors.textMuted, marginTop: 12, maxWidth: 290, lineHeight: 21 }]}>
              Your mood averaged{' '}
              <AppText style={[sans('600'), { fontSize: 14, color: colors.text }]}>{MOOD_NAME[Math.round(thisAvg) - 1]}</AppText>
              {lastAvg != null ? (
                <>
                  , {rising ? 'up' : dipping ? 'down' : 'level'} from{' '}
                  <AppText style={[sans('600'), { fontSize: 14, color: colors.text }]}>{MOOD_NAME[Math.round(lastAvg) - 1]}</AppText>
                </>
              ) : (
                ' across the week'
              )}
              .
            </AppText>
          )}
        </View>

        {/* day by day */}
        <View style={{ paddingHorizontal: 29, marginTop: 44 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Label>Day by day</Label>
            <View style={{ flexDirection: 'row', gap: 13, alignItems: 'center' }}>
              <LegendDot tone={moodColor(3)} faint label="Last week" />
              <LegendDot tone={moodColor(3)} label="This week" />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              alignItems: 'flex-end',
              height: 92,
              marginTop: 20,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((_, i) => (
              <View key={i} style={{ flex: 1, flexDirection: 'row', gap: 3, alignItems: 'flex-end', height: '100%' }}>
                <Bar mood={report.lastMoods[i]} faint />
                <Bar mood={report.thisMoods[i]} />
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <AppText key={i} style={[sans('500'), { flex: 1, textAlign: 'center', fontSize: 10.5, color: colors.textSofter }]}>
                {d}
              </AppText>
            ))}
          </View>
        </View>

        {/* the counts — two quiet monuments */}
        <View style={{ flexDirection: 'row', marginHorizontal: 29, marginTop: 48 }}>
          <Monument value={report.urges} delta={urgeDelta} label="Urges" note={deltaNote(report.urges, report.urgesLast, 'last week')} />
          <Monument
            value={report.relapses}
            delta={relapseDelta}
            label="Relapses"
            note={deltaNote(report.relapses, report.relapsesLast, 'last week')}
            divider
          />
        </View>

        {/* easier to ride */}
        {easier && (
          <View style={{ paddingHorizontal: 29, marginTop: 44 }}>
            <View style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-start', paddingTop: 22, borderTopWidth: 1, borderTopColor: colors.border }}>
              <View style={{ width: 46, marginTop: 2 }}>
                <MarkShrinkingWaves />
              </View>
              <View style={{ flex: 1 }}>
                <AppText style={[sans('500'), { fontSize: 14, color: colors.text }]}>Urges are getting easier to ride</AppText>
                <AppText style={[sans('400'), { fontSize: 13.5, color: colors.textMuted, marginTop: 5, lineHeight: 20 }]}>
                  {Math.round(((report.urgesLast - report.urges) / report.urgesLast) * 100)}% fewer than last week
                  {sevWord && sevWordLast && sevWord !== sevWordLast ? `, and the average pull eased from ${sevWordLast} to ${sevWord}` : ''}. The
                  wave is shrinking.
                </AppText>
              </View>
            </View>
          </View>
        )}

        {/* where it's hardest */}
        {report.lateNightUrges > 0 && (
          <View style={{ paddingHorizontal: 29, marginTop: 44 }}>
            <Label>Where it’s hardest</Label>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 20 }}>
              <View style={{ width: 46 }}>
                <MarkNight />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <AppText style={[sans('500'), { fontSize: 14.5, color: colors.text }]}>Late nights</AppText>
                <AppText style={[sans('400'), { fontSize: 13, color: colors.textMuted, marginTop: 3 }]}>
                  {report.lateNightUrges} of your {report.urges} urges hit after 10 PM
                </AppText>
              </View>
              <AppText style={{ fontFamily: fonts.serif, fontSize: 29, color: colors.text }}>{nightPct}%</AppText>
            </View>
          </View>
        )}

        {/* next week's focus — sealed dark */}
        <View style={{ paddingHorizontal: 29, marginTop: 48 }}>
          <View style={{ height: 1, backgroundColor: colors.border, marginBottom: 30 }} />
          <View style={{ backgroundColor: colors.ink, borderRadius: 20, padding: 22 }}>
            <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: colors.inkTextMuted }]}>
              Next week’s focus
            </AppText>
            <AppText style={{ fontFamily: fonts.serif, fontSize: 27, lineHeight: 30, color: colors.inkText, marginTop: 10 }}>
              {report.lateNightUrges > 0 ? 'Protect your wind-down.' : rising ? 'Keep the tide rising.' : 'One steady day at a time.'}
            </AppText>
            <AppText style={[sans('400'), { fontSize: 13.5, color: colors.inkTextMuted, marginTop: 12, lineHeight: 20 }]}>
              {report.lateNightUrges > 0
                ? 'The late hours are where the pull is strongest — a planned wind-down blunts it before it builds.'
                : 'You don’t have to be perfect. You only have to stay in the water.'}
            </AppText>
          </View>
        </View>

        <View style={{ paddingHorizontal: 29, marginTop: 16 }}>
          <Pressable
            onPress={back}
            style={({ pressed }) => ({
              backgroundColor: colors.ink,
              borderRadius: 9999,
              paddingVertical: 16,
              alignItems: 'center',
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}>
            <AppText style={[sans('600'), { fontSize: 15.5, color: colors.inkText }]}>Carry it into next week</AppText>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

// ── chrome ────────────────────────────────────────────────────────────
function Header({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <View style={{ paddingTop: spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 30 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable onPress={onBack} hitSlop={8} accessibilityLabel="Close" style={{ padding: 4, marginLeft: -8 }}>
            <Svg width={12} height={20} viewBox="0 0 13 22">
              <Path d="M11 2L2 11l9 9" stroke={colors.text} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </Pressable>
          <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: colors.textSoft }]}>
            Weekly report
          </AppText>
        </View>
        <AppText style={[sans('500'), { fontSize: 14, color: colors.textSoft }]}>{label}</AppText>
      </View>
      <AppText style={{ fontFamily: fonts.serif, fontSize: 28, color: colors.text, marginTop: 14 }}>This week</AppText>
    </View>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <AppText style={[sans('600'), { fontSize: 13, letterSpacing: 2.3, textTransform: 'uppercase', color: colors.text }]}>
      {children}
    </AppText>
  );
}

function LegendDot({ tone, label, faint }: { tone: string; label: string; faint?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <View style={{ width: 9, height: 9, borderRadius: 3, backgroundColor: tone, opacity: faint ? 0.3 : 1 }} />
      <AppText style={[sans('500'), { fontSize: 11, color: colors.textSoft }]}>{label}</AppText>
    </View>
  );
}

function Bar({ mood, faint }: { mood: number | null; faint?: boolean }) {
  const h = mood == null ? 8 : 16 + ((mood - 1) / 4) * 80;
  return (
    <View
      style={{
        flex: 1,
        height: `${h}%`,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        backgroundColor: mood == null ? colors.borderStrong : moodColor(mood),
        opacity: faint ? 0.3 : 1,
      }}
    />
  );
}

function Monument({ value, delta, label, note, divider }: { value: number; delta: number; label: string; note: string; divider?: boolean }) {
  return (
    <View
      style={{
        flex: 1,
        paddingLeft: divider ? 22 : 0,
        paddingRight: divider ? 0 : 18,
        borderLeftWidth: divider ? 1 : 0,
        borderLeftColor: colors.border,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
        <AppText style={{ fontFamily: fonts.serif, fontSize: 37, lineHeight: 37, color: colors.text }}>{value}</AppText>
        {delta !== 0 && <Delta down={delta < 0}>{Math.abs(delta)}</Delta>}
      </View>
      <AppText style={[sans('500'), { fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: colors.textSoft, marginTop: 9 }]}>
        {label}
      </AppText>
      <AppText style={[sans('400'), { fontSize: 12.5, color: colors.textMuted, marginTop: 5 }]}>{note}</AppText>
    </View>
  );
}

function Delta({ children, down }: { children: React.ReactNode; down?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Svg width={9} height={9} viewBox="0 0 12 12" style={{ transform: [{ scaleY: down ? -1 : 1 }] }}>
        <Path d="M6 2.5l4 5H2z" fill={colors.textSoft} />
      </Svg>
      <AppText style={[sans('400'), { fontSize: 13.5, color: colors.textMuted }]}>{children}</AppText>
    </View>
  );
}

function deltaNote(now: number, prev: number, suffix: string): string {
  if (prev === 0 && now === 0) return `None ${suffix}`;
  if (now === prev) return `Same as ${suffix}`;
  return now < prev ? `Down from ${prev} ${suffix}` : `Up from ${prev} ${suffix}`;
}

// ── the week, clearing (canvas: ClearingScene) ──────────────────────────
function calmPath(y: number, amps: number[], x0 = -4, x1 = 406): string {
  const seg = (x1 - x0) / amps.length;
  let d = `M${x0} ${y}`;
  amps.forEach((a, i) => {
    const sx = x0 + i * seg;
    const dir = i % 2 ? 1 : -1;
    d += ` C ${sx + seg * 0.33} ${y + dir * a}, ${sx + seg * 0.66} ${y + dir * a}, ${sx + seg} ${y}`;
  });
  return d;
}

function ClearingScene() {
  const b1 = calmPath(108, [10, 7, 4, 2]);
  const b2 = calmPath(134, [8, 5.5, 3, 1.5]);
  const b3 = calmPath(160, [6, 4, 2, 1]);
  return (
    <Svg width="100%" height={188} viewBox="0 0 402 188" fill="none">
      <SSun cx={310} cy={46} r={17} glow={2.8} />
      {/* the storm, already leaving the frame */}
      <G opacity={0.9}>
        <Path d="M-30 58 C -34 42 -18 30 0 34 C 6 18 34 13 48 28 C 62 20 80 30 78 44 C 88 47 86 58 74 58 Z" fill={SC.nearShade} />
        <Path d="M-26 58 L74 58 C 73 62 67 65 58 65 L-12 65 C -20 65 -25 62 -26 58 Z" fill={SC.fgShade} opacity={0.7} />
        <G stroke="#948F77" strokeWidth={2} strokeLinecap="round" opacity={0.6}>
          <Path d="M6 72 l-3.4 11 M28 74 l-3.4 11 M50 72 l-3.4 11" />
        </G>
      </G>
      <SGull x={346} y={82} s={0.85} o={0.6} />
      <SGull x={368} y={72} s={0.65} o={0.45} />
      {/* the sea settles as it leaves the storm behind */}
      <Path d={`${b1} L406 188 L-4 188 Z`} fill={SC.waterHi} />
      <Path d={b1} stroke={SC.foam} strokeWidth={2.2} strokeLinecap="round" />
      <Path d={`${b2} L406 188 L-4 188 Z`} fill={SC.water} />
      <Path d={b2} stroke={SC.foam} strokeWidth={1.8} strokeLinecap="round" opacity={0.75} />
      <Path d={`${b3} L406 188 L-4 188 Z`} fill={SC.waterLo} />
      <Path d={b3} stroke={SC.foam} strokeWidth={1.6} strokeLinecap="round" opacity={0.5} />
      {/* chop only under the storm */}
      <Circle cx={30} cy={102} r={1.8} fill={SC.foam} />
      <Circle cx={52} cy={98} r={1.4} fill={SC.foam} />
      <Circle cx={74} cy={103} r={1.5} fill={SC.foam} opacity={0.8} />
      {/* sailing into the clear */}
      <SBoat x={258} y={94} s={0.62} />
    </Svg>
  );
}

function MarkShrinkingWaves() {
  return (
    <Svg width={46} height={40} viewBox="0 0 46 40" fill="none">
      <Path d="M2 32 C 6 16 12 16 16 32" stroke={SC.waterDeep} strokeWidth={2.6} strokeLinecap="round" fill="none" />
      <Path d="M19 32 C 22 21 27 21 30 32" stroke={SC.waterDeep} strokeWidth={2.4} strokeLinecap="round" fill="none" opacity={0.75} />
      <Path d="M33 32 C 35 26 38 26 40 32" stroke={SC.waterLo} strokeWidth={2.2} strokeLinecap="round" fill="none" />
      <Circle cx={9} cy={13} r={1.6} fill={SC.foam} stroke={SC.waterLo} strokeWidth={0.6} />
      <Path d="M2 36 h42" stroke={SC.waterLo} strokeWidth={1.6} strokeLinecap="round" opacity={0.6} />
    </Svg>
  );
}

function MarkNight() {
  return (
    <Svg width={46} height={40} viewBox="0 0 46 40" fill="none">
      <SMoonF cx={22} cy={15} r={10} phase={0.3} />
      <Circle cx={38} cy={8} r={1.2} fill={SC.farShade} />
      <Circle cx={7} cy={10} r={1} fill={SC.farShade} />
      <Path d="M3 33 C 12 30 22 29 30 31 C 36 32 41 33 44 34" stroke={SC.waterLo} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}
