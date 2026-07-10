import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { AppText, LoadingView } from '@/components/ui';
import { useCheckins, useCurrentUser, useEvents } from '@/lib/backend';
import { getJSON } from '@/lib/storage';
import { buildWeeklyReport, completedWeekStarts } from '@/lib/weeklyReport';
import { colors, fonts, sans, spacing } from '@/lib/theme';

const LETTER_KEY = 'tideline.letter.day3';

type Item =
  | { kind: 'letter'; title: string; sub: string; kept: boolean; go: () => void }
  | { kind: 'report'; title: string; sub: string; go: () => void };

export default function Mail() {
  const router = useRouter();
  const user = useCurrentUser();
  const checkins = useCheckins();
  const events = useEvents();
  const [letter, setLetter] = useState<{ kept?: boolean } | null>(null);

  useEffect(() => {
    void getJSON<{ kept?: boolean }>(LETTER_KEY).then(setLetter);
  }, []);

  const items = useMemo<Item[]>(() => {
    if (!user || !checkins || !events) return [];
    const out: Item[] = [];

    // weekly reports — newest first
    for (const weekStart of completedWeekStarts(user.createdAt)) {
      const r = buildWeeklyReport(weekStart, checkins, events);
      const verdict =
        r.thisAvg == null
          ? 'A quiet week'
          : r.lastAvg == null
            ? 'Your first full week'
            : r.thisAvg - r.lastAvg >= 0.25
              ? 'Steadier than the week before'
              : r.lastAvg - r.thisAvg >= 0.25
                ? 'A heavier week'
                : 'A steady week';
      out.push({
        kind: 'report',
        title: 'Weekly report',
        sub: `${r.label} · ${verdict}`,
        go: () => router.push({ pathname: '/weekly-report', params: { week: weekStart } }),
      });
    }

    // the sealed letter — written on day zero, resealed after each reading
    out.push({
      kind: 'letter',
      title: 'A letter from day zero',
      sub: letter?.kept ? 'Resealed · don’t fail twice' : 'Sealed · waits until it’s needed',
      kept: !!letter?.kept,
      go: () => router.push('/letter'),
    });
    return out;
  }, [user, checkins, events, letter, router]);

  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/dashboard'));

  if (checkins === undefined || events === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <LoadingView />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ paddingHorizontal: 29, paddingTop: spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 30 }}>
            <Pressable onPress={back} hitSlop={8} accessibilityLabel="Back" style={{ padding: 4, marginLeft: -8 }}>
              <Svg width={12} height={20} viewBox="0 0 13 22">
                <Path d="M11 2L2 11l9 9" stroke={colors.text} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </Pressable>
            <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: colors.textSoft }]}>
              Your mail
            </AppText>
          </View>
          <AppText style={{ fontFamily: fonts.serif, fontSize: 28, color: colors.text, marginTop: 14 }}>Mail</AppText>
          <AppText style={[sans('400'), { fontSize: 13.5, color: colors.textMuted, marginTop: 10, lineHeight: 20 }]}>
            Your weekly reports and letters, kept in one place.
          </AppText>
        </View>

        {items.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 8 }}>
            <QuoteMark />
            <AppText center style={{ fontFamily: fonts.serif, fontSize: 22, color: colors.text, maxWidth: 260, lineHeight: 28 }}>
              Nothing’s arrived yet.
            </AppText>
            <AppText center style={[sans('400'), { fontSize: 13.5, color: colors.textMuted, maxWidth: 280, lineHeight: 20 }]}>
              At the end of each week, a report lands here — and letters find you along the way.
            </AppText>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingTop: 24, gap: 11 }}>
            {items.map((it, i) => (
              <Pressable
                key={i}
                onPress={it.go}
                accessibilityRole="button"
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  backgroundColor: colors.surface,
                  borderRadius: 18,
                  padding: 16,
                  transform: [{ scale: pressed ? 0.99 : 1 }],
                })}>
                <View style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
                  {it.kind === 'letter' ? <LetterMark /> : <ReportMark />}
                </View>
                <View style={{ flex: 1 }}>
                  <AppText style={[sans('600'), { fontSize: 15.5, color: colors.text }]}>{it.title}</AppText>
                  <AppText style={[sans('400'), { fontSize: 13, color: colors.textMuted, marginTop: 2 }]}>{it.sub}</AppText>
                </View>
                <Svg width={9} height={16} viewBox="0 0 9 16" fill="none">
                  <Path d="M1.5 1l6 7-6 7" stroke={colors.textSoft} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

function QuoteMark() {
  return (
    <AppText style={{ fontFamily: fonts.serifSharp, fontSize: 52, lineHeight: 40, color: 'rgba(29,28,26,0.18)' }}>{'“'}</AppText>
  );
}

function LetterMark() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={5} width={18} height={14} rx={2.4} stroke={colors.text} strokeWidth={1.8} />
      <Path d="M4.5 7.5l7.5 5.5 7.5-5.5" stroke={colors.text} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ReportMark() {
  return (
    <Svg width={24} height={22} viewBox="0 0 24 22" fill="none">
      <Circle cx={17} cy={7} r={3.4} fill={colors.text} />
      <Path d="M2 13c2.2-2 4.4-2 6.6 0s4.4 2 6.6 0 4.4-2 6.6 0" stroke={colors.text} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M2 17.5c2.2-2 4.4-2 6.6 0s4.4 2 6.6 0 4.4-2 6.6 0" stroke={colors.text} strokeWidth={1.6} strokeLinecap="round" opacity={0.5} />
    </Svg>
  );
}
