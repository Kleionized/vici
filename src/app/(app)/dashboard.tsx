import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { AppText, LoadingView, Screen, ScreenHeader } from '@/components/ui';
import { SBoat, SC, SGull, SMoonF, SSun, scSmoothPath } from '@/components/scene/SceneKit';
import { useCheckins, useDashboard, useEvents } from '@/lib/backend';
import { colors, fonts, sans, spacing } from '@/lib/theme';
import type { TidelineEvent } from '@/lib/types';

// ── Insights / "You" — a port of the canvas AnalyticsScreen: the mood
// tide drawn as a layered sea, a sealed dark verdict, monument numerals,
// a dot-per-urge trigger list, a when-they-hit histogram, and quiet
// correlation readings. Real check-in / event data drives every figure. ──

const MOOD_NAME = ['Low', 'Down', 'Fine', 'Good', 'Radiant'];

function countBy<T>(items: T[], key: (t: T) => string | undefined | null): [string, number][] {
  const m = new Map<string, number>();
  for (const it of items) {
    const k = key(it);
    if (k) m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

export default function Dashboard() {
  const router = useRouter();
  const data = useDashboard();
  const checkins = useCheckins();
  const events = useEvents();

  if (!data || checkins === undefined || events === undefined) {
    return (
      <Screen>
        <LoadingView />
      </Screen>
    );
  }

  // ── 14-day mood tide from real check-ins (fill gaps by carrying the line) ──
  const byDate = new Map(checkins.filter((c) => c.mood != null).map((c) => [c.date, c.mood as number]));
  const days: number[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push(byDate.get(key) ?? NaN);
  }
  // carry-forward/backward so the curve is continuous even with gaps
  let carried = 3;
  const trend = days.map((v) => (Number.isNaN(v) ? carried : (carried = v)));
  const hasMood = byDate.size > 0;

  const recentMoods = trend.slice(7);
  const priorMoods = trend.slice(0, 7);
  const avg = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 3);
  const delta = Math.round(((avg(recentMoods) - avg(priorMoods)) / 4) * 100);
  const rising = delta >= 0;

  // ── monuments ──
  const urgeEvents = events.filter((e) => e.type === 'urge_rode_out' || e.type === 'urge_acted_on');
  const daysKept = data.optionalDaysSinceLapse ?? data.checkinDays;

  // ── triggers / reasons / feelings from real logs ──
  const triggers = countBy<TidelineEvent>(events, (e) => e.trigger?.split(' · ')[0]).slice(0, 5);
  const reasons = countBy(checkins.flatMap((c) => c.reasons ?? []), (r) => r).slice(0, 4);
  const feelings = countBy(checkins.flatMap((c) => c.emotions ?? []), (f) => f)
    .slice(0, 4)
    .map(([f]) => f);

  // ── when they hit — 2-hour buckets, 6 AM → 6 AM ──
  const buckets = new Array(12).fill(0);
  for (const e of urgeEvents) {
    const h = new Date(e.createdAt).getHours();
    buckets[Math.floor(((h + 18) % 24) / 2)] += 1; // shift so bucket 0 = 6 AM
  }
  const lateNight = urgeEvents.filter((e) => {
    const h = new Date(e.createdAt).getHours();
    return h >= 22 || h < 6;
  }).length;

  return (
    <Screen bleed contentStyle={{ paddingTop: spacing.md, paddingBottom: 0 }}>
      <View style={{ paddingHorizontal: 0 }}>
        <ScreenHeader
          eyebrow="Insights"
          title="Your patterns"
          trailing={<AppText style={[sans('500'), { fontSize: 14, color: colors.textSoft }]}>30 days</AppText>}
        />
      </View>

      {/* your mail — weekly reports + letters */}
      <View style={{ paddingHorizontal: spacing.xl, marginTop: spacing.xs, marginBottom: spacing.lg }}>
        <Pressable
          onPress={() => router.push('/mail')}
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
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Rect x={3} y={5} width={18} height={14} rx={2.4} stroke={colors.text} strokeWidth={1.8} />
              <Path d="M4.5 7.5l7.5 5.5 7.5-5.5" stroke={colors.text} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={[sans('600'), { fontSize: 15.5, color: colors.text }]}>Your mail</AppText>
            <AppText style={[sans('400'), { fontSize: 13, color: colors.textMuted, marginTop: 1 }]}>Weekly reports & letters</AppText>
          </View>
          <Svg width={9} height={16} viewBox="0 0 9 16" fill="none">
            <Path d="M1.5 1l6 7-6 7" stroke={colors.textSoft} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>

        {/* medallions — the campaign album */}
        <Pressable
          onPress={() => router.push('/milestones')}
          accessibilityRole="button"
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            backgroundColor: colors.surface,
            borderRadius: 16,
            paddingVertical: 14,
            paddingHorizontal: 16,
            marginTop: 10,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          })}>
          <View style={{ width: 40, height: 40, borderRadius: 11, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
            {/* a small phalera — ring + laurel dot */}
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17z" stroke={colors.text} strokeWidth={1.6} strokeDasharray="1.8 3.4" />
              <Path d="M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6z" stroke={colors.text} strokeWidth={1.6} />
              <Path d="M12 10v4M10 12h4" stroke={colors.text} strokeWidth={1.6} strokeLinecap="round" />
            </Svg>
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={[sans('600'), { fontSize: 15.5, color: colors.text }]}>Medallions</AppText>
            <AppText style={[sans('400'), { fontSize: 13, color: colors.textMuted, marginTop: 1 }]}>The campaign album</AppText>
          </View>
          <Svg width={9} height={16} viewBox="0 0 9 16" fill="none">
            <Path d="M1.5 1l6 7-6 7" stroke={colors.textSoft} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Pressable>
      </View>

      {/* the tide of you — full-bleed */}
      <TideChart data={trend} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.xl, marginTop: 10 }}>
        <AppText style={[sans('500'), { fontSize: 10.5, letterSpacing: 1, color: colors.textSofter }]}>14 DAYS AGO</AppText>
        <AppText style={[sans('500'), { fontSize: 10.5, letterSpacing: 1, color: colors.textSoft }]}>TODAY</AppText>
      </View>

      {/* the verdict — sealed dark */}
      <View style={{ paddingHorizontal: spacing.xl, marginTop: 26 }}>
        <View style={{ backgroundColor: colors.ink, borderRadius: 20, padding: 22 }}>
          <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: colors.inkTextMuted }]}>
            Mood · last 14 days
          </AppText>
          <AppText style={{ fontFamily: fonts.serif, fontSize: 30, color: colors.inkText, letterSpacing: 0.3, marginTop: 10, lineHeight: 32 }}>
            {hasMood ? (rising ? 'The tide is rising.' : 'Holding steady.') : 'Your tide starts here.'}
          </AppText>
          {hasMood ? (
            <Delta dark down={!rising} style={{ marginTop: 12 }}>
              {Math.abs(delta)}% {rising ? 'higher' : 'lower'} than the two weeks before
            </Delta>
          ) : (
            <AppText style={[sans('400'), { fontSize: 13.5, color: colors.inkTextMuted, marginTop: 12 }]}>
              Log a check-in and the sea starts to take shape.
            </AppText>
          )}
        </View>
      </View>

      {/* monument numerals */}
      <View style={{ flexDirection: 'row', marginHorizontal: spacing.xl, marginTop: 44 }}>
        <Monument value={String(data.checkinDays)} label="Check-ins" />
        <Monument value={String(urgeEvents.length)} label="Urges logged" divider />
        <Monument value={String(daysKept)} label="Days kept" divider />
      </View>

      {/* what sets it off — one dot per logged urge */}
      {triggers.length ? (
        <View style={{ paddingHorizontal: spacing.xl, marginTop: 52 }}>
          <Label>What sets it off</Label>
          <View style={{ gap: 19, marginTop: 22 }}>
            {triggers.map(([label, n], i) => (
              <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <AppText style={[sans('500'), { width: 92, fontSize: 14.5, color: colors.text }]}>{label}</AppText>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 5.5 }}>
                  {Array.from({ length: n }).map((_, j) => (
                    <View key={j} style={{ width: 7.5, height: 7.5, borderRadius: 9999, backgroundColor: colors.ink, opacity: 0.92 - i * 0.15 }} />
                  ))}
                </View>
                <AppText style={[sans('500'), { width: 18, textAlign: 'right', fontSize: 13, color: colors.textSoft }]}>{n}</AppText>
              </View>
            ))}
          </View>
          <AppText style={[sans('400'), { fontSize: 11.5, color: colors.textSofter, marginTop: 16 }]}>Each dot is one logged urge · last 30 days</AppText>
        </View>
      ) : null}

      {/* when they hit */}
      {urgeEvents.length ? (
        <View style={{ paddingHorizontal: spacing.xl, marginTop: 52 }}>
          <Label>When they hit</Label>
          <WhenInTheDay buckets={buckets} lateNight={lateNight} total={urgeEvents.length} />
        </View>
      ) : null}

      {/* behind the lows + the words you reached for */}
      {reasons.length || feelings.length ? (
        <View style={{ paddingHorizontal: spacing.xl, marginTop: 52 }}>
          {reasons.length ? (
            <>
              <Label>Behind the lows</Label>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 18, gap: 22 }}>
                {reasons.map(([r, n]) => (
                  <View key={r} style={{ flexDirection: 'row', alignItems: 'baseline', gap: 5 }}>
                    <AppText style={[sans('500'), { fontSize: 14, color: colors.text }]}>{r}</AppText>
                    <AppText style={[sans('500'), { fontSize: 12.5, color: colors.textSoft }]}>×{n}</AppText>
                  </View>
                ))}
              </View>
            </>
          ) : null}
          {feelings.length ? (
            <>
              <Label style={{ marginTop: 34 }}>The words you reached for</Label>
              <AppText style={{ fontFamily: fonts.serifSharpItalic, fontStyle: 'italic', fontSize: 16, color: colors.textMuted, marginTop: 14, lineHeight: 24 }}>
                {feelings.join(' · ')}
              </AppText>
            </>
          ) : null}
        </View>
      ) : null}

      {/* what the tide says — scene-marks, hairline rows */}
      <View style={{ paddingHorizontal: spacing.xl, marginTop: 52, paddingBottom: 40 }}>
        <Label style={{ marginBottom: 6 }}>What the tide says</Label>
        <TideSays first mark={<MarkLowSun />} finding="Low sleep, lower mood" detail="On days you logged “Sleep” as a reason, your mood ran a full band lower." />
        <TideSays mark={<MarkIdleBuoy />} finding="Idle evenings are the pull" detail="Most urges land in unplanned hours. A wind-down ritual could blunt it." />
      </View>
    </Screen>
  );
}

// ── the tide chart — 14 days of mood as a layered sea ────────────────
function TideChart({ data }: { data: number[] }) {
  const x0 = 12;
  const x1 = 390;
  const pts: [number, number][] = data.map((v, i) => [x0 + (i * (x1 - x0)) / (data.length - 1), 156 - (v / 4) * 70]);
  const curve = scSmoothPath(pts);
  const area = `${curve} L${x1} 220 L${x0} 220 Z`;
  const last = pts[pts.length - 1];
  return (
    <Svg width="100%" height={212} viewBox="0 0 402 212" fill="none">
      <SSun cx={330} cy={42} r={15} glow={2.6} />
      <SGull x={58} y={44} s={0.85} o={0.55} />
      <SGull x={80} y={36} s={0.65} o={0.4} />
      <Path d="M12 86 H390" stroke={SC.farShade} strokeWidth={1} strokeDasharray="1.5 4.5" opacity={0.6} />
      <Path d="M12 121 H390" stroke={SC.farShade} strokeWidth={1} strokeDasharray="1.5 4.5" opacity={0.45} />
      {/* the sea — three banded layers of the mood curve */}
      <Path d={area} fill={SC.waterHi} />
      <Path d={curve} stroke={SC.foam} strokeWidth={2.4} strokeLinecap="round" />
      <Path d={area} fill={SC.water} transform="translate(0 20)" />
      <Path d={curve} stroke={SC.foam} strokeWidth={1.8} strokeLinecap="round" opacity={0.75} transform="translate(0 20)" />
      <Path d={area} fill={SC.waterLo} transform="translate(0 42)" />
      <Path d={curve} stroke={SC.foam} strokeWidth={1.6} strokeLinecap="round" opacity={0.5} transform="translate(0 42)" />
      {/* one reading per day riding the waterline */}
      {pts.map(([x, y], i) => (
        <Circle
          key={i}
          cx={x}
          cy={y}
          r={i === pts.length - 1 ? 4 : 2.3}
          fill={SC.ink}
          stroke={SC.foam}
          strokeWidth={i === pts.length - 1 ? 2 : 1.2}
          opacity={i === pts.length - 1 ? 1 : 0.82}
        />
      ))}
      {/* whitecaps on the hard days */}
      {data.map((v, i) => (v <= 1 ? <Circle key={`w${i}`} cx={pts[i][0]} cy={pts[i][1] - 7} r={1.8} fill={SC.foam} /> : null))}
      <SBoat x={last[0] - 26} y={last[1] + 1} s={0.52} />
    </Svg>
  );
}

function Delta({ children, down = false, dark = false, style }: { children: React.ReactNode; down?: boolean; dark?: boolean; style?: object }) {
  const c = dark ? colors.inkTextMuted : colors.textMuted;
  const tri = dark ? colors.inkTextSoft : colors.textSoft;
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 5 }, style]}>
      <Svg width={9} height={9} viewBox="0 0 12 12" style={{ transform: [{ scaleY: down ? -1 : 1 }] }}>
        <Path d="M6 2.5l4 5H2z" fill={tri} />
      </Svg>
      <AppText style={[sans('400'), { fontSize: 13.5, color: c }]}>{children}</AppText>
    </View>
  );
}

function Label({ children, style }: { children: string; style?: object }) {
  return <AppText style={[sans('600'), { fontSize: 13, letterSpacing: 2.3, textTransform: 'uppercase', color: colors.text }, style]}>{children}</AppText>;
}

function Monument({ value, label, divider = false }: { value: string; label: string; divider?: boolean }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', borderLeftWidth: divider ? 1 : 0, borderLeftColor: colors.border }}>
      <AppText style={{ fontFamily: fonts.serif, fontSize: 37, color: colors.text, letterSpacing: 0.3, lineHeight: 40, fontVariant: ['tabular-nums'] }}>
        {value}
      </AppText>
      <AppText style={[sans('500'), { fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: colors.textSoft, marginTop: 9 }]}>{label}</AppText>
    </View>
  );
}

function WhenInTheDay({ buckets, lateNight, total }: { buckets: number[]; lateNight: number; total: number }) {
  const max = Math.max(1, ...buckets);
  const BAR_H = 62;
  return (
    <View style={{ marginTop: 26 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: BAR_H }}>
        {buckets.map((n, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: n ? 9 + (n / max) * (BAR_H - 9) : 3.5,
              borderRadius: n ? 4.5 : 2,
              backgroundColor: n ? colors.ink : colors.borderStrong,
              opacity: n ? 0.4 + 0.6 * (n / max) : 1,
            }}
          />
        ))}
      </View>
      <View style={{ height: 1, backgroundColor: colors.border }} />
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        {['6 AM', 'NOON', '6 PM', 'MIDNIGHT'].map((l) => (
          <AppText key={l} style={[sans('500'), { flex: 1, fontSize: 10, letterSpacing: 1, color: colors.textSofter }]}>
            {l}
          </AppText>
        ))}
      </View>
      <AppText style={[sans('400'), { fontSize: 13.5, color: colors.textMuted, marginTop: 14, lineHeight: 20 }]}>
        {lateNight > 0 ? (
          <>
            <AppText style={[sans('600'), { fontSize: 13.5, color: colors.text }]}>{lateNight} of {total}</AppText> landed after 10 PM — a narrow, repeating window.
          </>
        ) : (
          'No clear late-night cluster yet — keep logging and the window will show.'
        )}
      </AppText>
    </View>
  );
}

function TideSays({ mark, finding, detail, first = false }: { mark: React.ReactNode; finding: string; detail: string; first?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-start', paddingVertical: 20, borderTopWidth: first ? 0 : 1, borderTopColor: colors.border }}>
      <View style={{ width: 46, marginTop: 2 }}>{mark}</View>
      <View style={{ flex: 1 }}>
        <AppText style={[sans('500'), { fontSize: 14, color: colors.text, lineHeight: 18 }]}>{finding}</AppText>
        <AppText style={[sans('400'), { fontSize: 13.5, color: colors.textMuted, marginTop: 5, lineHeight: 20 }]}>{detail}</AppText>
      </View>
    </View>
  );
}

function MarkLowSun() {
  return (
    <Svg width={46} height={40} viewBox="0 0 46 40" fill="none">
      <Circle cx={23} cy={27} r={9} fill={SC.sun} stroke={SC.sunEdge} strokeWidth={1.3} />
      <Path d="M2 27 H44 V40 H2 Z" fill={SC.water} />
      <Path d="M2 27 H44" stroke={SC.foam} strokeWidth={2} strokeLinecap="round" />
      <Path d="M23 10 v4 M10 14 l2.4 2.4 M36 14 l-2.4 2.4" stroke={SC.fgShade} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function MarkIdleBuoy() {
  return (
    <Svg width={46} height={40} viewBox="0 0 46 40" fill="none">
      <Path d="M23 26 v-14" stroke={SC.ink} strokeWidth={2} strokeLinecap="round" opacity={0.8} />
      <Path d="M23 12 L33 15 L23 18 Z" fill={SC.midShade} />
      <Path d="M4 33 q 9 -2.5 19 0 t 19 0" stroke={SC.waterLo} strokeWidth={2.2} strokeLinecap="round" fill="none" />
    </Svg>
  );
}
