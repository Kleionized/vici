import { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { AppText, BackChevron, LoadingView, Screen, SectionLabel } from '@/components/ui';
import { KKMedallion, type KeepsakeSceneKey } from '@/components/keepsakes/Medallion';
import { useCheckins, useCurrentUser, useEvents, useJournalEntries, useLessonProgressMap } from '@/lib/backend';
import { colors, fonts, sans, spacing } from '@/lib/theme';

// ── Keepsakes · the achievements album (canvas: screens-keepsakes). Every
// keepsake is a faceted-paper medallion in a postmark ring — earned ones with
// a letterpress date, repeatable ones levelling through tiers, in-progress
// ones wearing an arc, still-ahead ones as embossed blanks. Real counts (rode
// out, check-ins, days, journal entries, lessons) drive earned/progress. ──

const ROMAN = ['I', 'II', 'III', 'IV', 'V'];
const roman = (n: number) => {
  const t: [number, string][] = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let out = '';
  let x = n;
  for (const [v, s] of t) while (x >= v) { out += s; x -= v; }
  return out || 'I';
};

type Keepsake = {
  key: KeepsakeSceneKey;
  name: string;
  how: string;
  story: string;
  count: number; // real progress count
  target?: number; // for within-reach progress bar
  earned: boolean;
  steps?: number[]; // tier ladder (repeatable keepsakes)
  date?: string;
  hint?: string;
  locked?: boolean;
};

export default function Milestones() {
  const events = useEvents();
  const checkins = useCheckins();
  const user = useCurrentUser();
  const journal = useJournalEntries();
  const progress = useLessonProgressMap();
  const [open, setOpen] = useState<Keepsake | null>(null);

  if (events === undefined || checkins === undefined || user === undefined || journal === undefined || progress === undefined) {
    return (
      <Screen>
        <LoadingView />
      </Screen>
    );
  }

  const checkinDays = checkins.length;
  const days = user ? Math.max(0, Math.floor((Date.now() - user.createdAt) / 86400000)) : 0;
  const rode = events.filter((e) => e.type === 'urge_rode_out').length;
  const entries = journal.length;
  const lessonsDone = Object.values(progress).filter((p) => p?.status === 'completed').length;
  const recovered = events.some((e) => e.type === 'lapse'); // any lapse → the bounce is available once they log again

  const K: Keepsake[] = [
    { key: 'firstlight', name: 'First light', how: 'Your first morning check-in', story: 'Twenty seconds of honesty on an ordinary morning. Everything since has stacked on this.', count: checkinDays, earned: checkinDays >= 1, date: `Day I` },
    { key: 'toe', name: 'Toe in the water', how: 'Rode out your first urge', story: 'You watched it rise, crest, and leave without you.', count: rode, earned: rode >= 1, date: `Day I` },
    { key: 'threedays', name: 'Three days clear', how: '72 hours, one tide at a time', story: 'The first fog begins to lift right about here — exactly on schedule.', count: days, earned: days >= 3, date: `Day III` },
    { key: 'week', name: 'One week in', how: 'Seven days of showing up', story: 'Seven check-ins, no perfect days required.', count: checkinDays, earned: checkinDays >= 7, date: `Day VII` },
    { key: 'honest', name: 'Honest ink', how: 'Ten honest journal entries', story: 'None of them for show. The patterns page runs on this ink.', count: entries, target: 10, earned: entries >= 10, steps: [10, 50, 100], date: `Day XV` },
    { key: 'rider', name: 'Wave rider', how: 'Ride out five urges', story: 'Each one shortens the next.', count: rode, target: 5, earned: rode >= 5, steps: [5, 25, 100] },
    { key: 'lesson10', name: 'Steady study', how: 'Finish ten lessons', story: 'Ten is where the ideas start meeting you in the moment, not just on the page.', count: lessonsDone, target: 10, earned: lessonsDone >= 10, steps: [10, 25, 50] },
    { key: 'bounce', name: 'Never failed twice', how: 'Slipped — and came back the next morning', story: 'That bounce is the strongest predictor there is.', count: recovered ? 1 : 0, earned: recovered, steps: [1, 10, 25], date: 'Begin again' },
    { key: 'longroad', name: 'The long road', how: 'Six months with tideline', story: 'Nobody walks it in a straight line — the road only asks that you stay on it.', count: days, target: 180, earned: days >= 180 },
    { key: 'shore', name: 'The Landing, taken', how: 'Finish your first ground', story: 'The map opens from there.', count: lessonsDone, target: 6, earned: lessonsDone >= 6 },
    { key: 'told', name: 'Let someone in', how: 'Tell one person about the work', story: 'One honest conversation takes half its weight away.', count: 0, earned: false, locked: true },
    { key: 'storm', name: 'Storm weathered', how: 'Ride out a force-nine urge', story: 'One will come. When it does, the lighthouse holds.', count: 0, earned: false, locked: true },
    { key: 'month', name: 'A month of mornings', how: 'Thirty days in the practice', story: 'Thirty days is where “trying something” quietly becomes “how I live”.', count: days, target: 30, earned: days >= 30, hint: days < 30 ? `${30 - days} days away` : undefined, locked: days < 30 },
    { key: 'summit', name: 'The summit', how: 'Ninety days — the new normal', story: 'By the time you stand here, the view is just… Tuesday.', count: days, target: 90, earned: days >= 90, locked: days < 90 },
  ];

  const tierOf = (k: Keepsake) => (k.steps ? k.steps.filter((s) => k.count >= s).length : null);
  const earned = K.filter((k) => k.earned);
  const newest = earned[earned.length - 1];
  const earnedRest = earned.filter((k) => k !== newest);
  const reach = K.filter((k) => !k.earned && !k.locked && k.target);
  const ahead = K.filter((k) => !k.earned && k.locked);
  const nEarned = earned.length;

  return (
    <>
      <Screen contentStyle={{ paddingTop: spacing.sm }}>
        <View style={{ marginBottom: 14 }}>
          <BackChevron onPress={() => {}} />
        </View>
        <AppText style={{ fontFamily: fonts.serif, fontSize: 34, letterSpacing: 0.34, color: colors.text }}>Medallions</AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, marginBottom: 28 }}>
          <View style={{ flex: 1, height: 4.5, borderRadius: 9999, backgroundColor: colors.borderStrong, overflow: 'hidden' }}>
            <View style={{ width: `${(nEarned / K.length) * 100}%`, height: '100%', borderRadius: 9999, backgroundColor: colors.ink }} />
          </View>
          <AppText style={[sans('500'), { fontSize: 13, color: colors.textMuted }]}>
            {nEarned} of {K.length}
          </AppText>
        </View>

        {/* newest — the hero keepsake, sealed dark */}
        {newest ? (
          <Pressable
            onPress={() => setOpen(newest)}
            style={{ backgroundColor: colors.ink, borderRadius: 20, padding: 22, marginBottom: 38 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
              <KKMedallion scene={newest.key} size={118} earned tier={tierOf(newest)} tierMax={newest.steps?.length ?? 0} />
              <View style={{ flex: 1 }}>
                <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: colors.inkTextMuted }]}>
                  Newest keepsake
                </AppText>
                <AppText style={{ fontFamily: fonts.serif, fontSize: 23, letterSpacing: 0.2, lineHeight: 26, color: colors.inkText, marginVertical: 8 }}>
                  {newest.name}
                </AppText>
                <AppText style={[sans('400'), { fontSize: 13, lineHeight: 18, color: colors.inkTextMuted, marginBottom: 12 }]}>{newest.how}</AppText>
                <DateStamp dark>{newest.date ?? 'Earned'}</DateStamp>
              </View>
            </View>
          </Pressable>
        ) : null}

        {/* earned grid */}
        {earnedRest.length ? (
          <>
            <SectionLabel>Earned</SectionLabel>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 38 }}>
              {earnedRest.map((k) => (
                <Pressable
                  key={k.key}
                  onPress={() => setOpen(k)}
                  style={{ width: '47.5%', flexGrow: 1, alignItems: 'center', gap: 11, backgroundColor: colors.surface, borderRadius: 20, paddingVertical: 18, paddingHorizontal: 12 }}>
                  <KKMedallion scene={k.key} size={82} earned tier={tierOf(k)} tierMax={k.steps?.length ?? 0} />
                  <View style={{ alignItems: 'center' }}>
                    <AppText center style={[sans('500'), { fontSize: 14.5, color: colors.text, lineHeight: 17 }]}>{k.name}</AppText>
                    <AppText style={[sans('500'), { fontSize: 10.5, letterSpacing: 0.8, textTransform: 'uppercase', color: colors.textSoft, marginTop: 5 }]}>
                      {k.steps ? `Tier ${ROMAN[(tierOf(k) ?? 1) - 1] || 'I'} · ×${k.count}` : k.date}
                    </AppText>
                  </View>
                </Pressable>
              ))}
            </View>
          </>
        ) : null}

        {/* within reach */}
        {reach.length ? (
          <>
            <SectionLabel>Within reach</SectionLabel>
            <View style={{ gap: 10, marginBottom: 38 }}>
              {reach.map((k) => (
                <Pressable key={k.key} onPress={() => setOpen(k)} style={{ flexDirection: 'row', alignItems: 'center', gap: 15, backgroundColor: colors.surface, borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16 }}>
                  <KKMedallion scene={k.key} size={62} earned={false} progress={[k.count, k.target!]} tier={tierOf(k)} tierMax={k.steps?.length ?? 0} />
                  <View style={{ flex: 1 }}>
                    <AppText style={[sans('500'), { fontSize: 14, color: colors.text }]}>{k.name}</AppText>
                    <AppText style={[sans('400'), { fontSize: 12.5, color: colors.textMuted, marginTop: 3 }]}>{k.how}</AppText>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 9 }}>
                      <View style={{ flex: 1, height: 4, borderRadius: 9999, backgroundColor: colors.borderStrong, overflow: 'hidden' }}>
                        <View style={{ width: `${Math.max(4, (k.count / k.target!) * 100)}%`, height: '100%', borderRadius: 9999, backgroundColor: colors.ink }} />
                      </View>
                      <AppText style={[sans('500'), { fontSize: 12.5, color: colors.text }]}>
                        {Math.min(k.count, k.target!)}
                        <AppText style={[sans('500'), { fontSize: 12.5, color: colors.textSoft }]}> / {k.target}</AppText>
                      </AppText>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </>
        ) : null}

        {/* still ahead — blind-embossed blanks */}
        {ahead.length ? (
          <>
            <SectionLabel>Still ahead</SectionLabel>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {ahead.map((k) => (
                <Pressable key={k.key} onPress={() => setOpen(k)} style={{ width: '30%', flexGrow: 1, alignItems: 'center', gap: 9, paddingVertical: 6 }}>
                  <KKMedallion scene={k.key} size={68} earned={false} />
                  <AppText center style={[sans('500'), { fontSize: 11.5, lineHeight: 14, color: colors.textSoft }]}>{k.name}</AppText>
                  {k.hint ? (
                    <View style={{ backgroundColor: colors.accentSoft, borderRadius: 9999, paddingVertical: 3, paddingHorizontal: 8 }}>
                      <AppText style={[sans('500'), { fontSize: 9.5, letterSpacing: 1, textTransform: 'uppercase', color: colors.textMuted }]}>{k.hint}</AppText>
                    </View>
                  ) : null}
                </Pressable>
              ))}
            </View>
          </>
        ) : null}
      </Screen>

      <Modal visible={!!open} transparent animationType="fade" onRequestClose={() => setOpen(null)}>
        {open ? <KeepsakeDetail k={open} tier={tierOf(open)} onClose={() => setOpen(null)} /> : null}
      </Modal>
    </>
  );
}

function DateStamp({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        borderWidth: 1.4,
        borderColor: dark ? 'rgba(245,244,241,0.35)' : 'rgba(74,74,66,0.38)',
        borderRadius: 6,
        paddingVertical: 3,
        paddingHorizontal: 7,
        backgroundColor: dark ? 'transparent' : '#F8F8F6',
      }}>
      <AppText style={[sans('500'), { fontSize: 9.5, letterSpacing: 1.3, textTransform: 'uppercase', color: dark ? 'rgba(245,244,241,0.75)' : 'rgba(74,74,66,0.72)' }]}>
        {children}
      </AppText>
    </View>
  );
}

function KeepsakeDetail({ k, tier, onClose }: { k: Keepsake; tier: number | null; onClose: () => void }) {
  const earned = k.earned;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(38,37,30,0.42)' }}>
      <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={onClose} />
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xl }}>
        <View style={{ backgroundColor: colors.surface, borderRadius: 24, padding: 26, paddingTop: 30, alignItems: 'center' }}>
          <KKMedallion scene={k.key} size={136} earned={earned} progress={!earned && k.target ? [k.count, k.target] : null} tier={tier} tierMax={k.steps?.length ?? 0} />
          <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: colors.textSoft, marginTop: 20 }]}>
            {earned && k.steps ? `Keepsake · Tier ${ROMAN[(tier ?? 1) - 1] || 'I'} of ${ROMAN[k.steps.length - 1]}` : earned ? 'Keepsake · earned' : k.target ? `Within reach · ${Math.min(k.count, k.target)} of ${k.target}` : 'Still ahead'}
          </AppText>
          <AppText center style={{ fontFamily: fonts.serif, fontSize: 26, letterSpacing: 0.26, lineHeight: 30, color: colors.text, marginTop: 9 }}>
            {k.name}
          </AppText>
          {earned && k.date ? (
            <View style={{ marginTop: 12 }}>
              <DateStamp>{k.date}{k.steps ? ` · ×${k.count}` : ''}</DateStamp>
            </View>
          ) : null}
          {!earned && k.hint ? (
            <View style={{ marginTop: 12 }}>
              <DateStamp>{k.hint}</DateStamp>
            </View>
          ) : null}
          <AppText center style={[sans('400'), { fontSize: 14.5, lineHeight: 22, color: colors.textMuted, marginTop: 14, maxWidth: 280 }]}>
            {k.story}
          </AppText>

          {k.steps ? <TierLadder steps={k.steps} count={k.count} /> : null}

          <View style={{ width: '100%', marginTop: 22 }}>
            {earned ? (
              <Pressable style={{ backgroundColor: colors.ink, borderRadius: 9999, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Path d="M12 15V4.2M12 4.2 8 8.2M12 4.2l4 4" stroke={colors.inkText} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
                  <Path d="M5 12.5v6A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-6" stroke={colors.inkText} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <AppText style={[sans('600'), { fontSize: 15.5, color: colors.inkText }]}>Share it</AppText>
              </Pressable>
            ) : (
              <Pressable onPress={onClose} style={{ borderWidth: 1.5, borderColor: colors.border, borderRadius: 9999, paddingVertical: 16, alignItems: 'center' }}>
                <AppText style={[sans('600'), { fontSize: 15.5, color: colors.text }]}>Keep going</AppText>
              </Pressable>
            )}
            <Pressable onPress={onClose} style={{ paddingVertical: 13, paddingTop: 15, alignItems: 'center' }}>
              <AppText style={[sans('500'), { fontSize: 14.5, color: colors.textMuted }]}>Back to keepsakes</AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function TierLadder({ steps, count }: { steps: number[]; count: number }) {
  const next = steps.find((s) => count < s);
  return (
    <View style={{ width: '100%', marginTop: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {steps.map((s, i) => {
          const hit = count >= s;
          const isNext = s === next;
          return (
            <View key={s} style={{ flexDirection: 'row', alignItems: 'center', flex: i > 0 ? 1 : 0 }}>
              {i > 0 ? <View style={{ flex: 1, height: 2, borderRadius: 9999, backgroundColor: hit ? 'rgba(74,74,66,0.6)' : colors.borderStrong, marginHorizontal: 5 }} /> : null}
              <View style={{ alignItems: 'center', gap: 5 }}>
                <View
                  style={{
                    minWidth: 30,
                    height: 30,
                    borderRadius: 9999,
                    paddingHorizontal: 7,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: hit ? colors.ink : colors.surface,
                    borderWidth: isNext && !hit ? 1.8 : 0,
                    borderColor: 'rgba(74,74,66,0.55)',
                  }}>
                  <AppText style={[sans('500'), { fontSize: 11.5, color: hit ? colors.inkText : isNext ? colors.text : colors.textSoft }]}>{s}</AppText>
                </View>
                <AppText style={[sans('500'), { fontSize: 8.5, letterSpacing: 0.7, color: hit ? colors.textMuted : colors.textSofter }]}>{ROMAN[i]}</AppText>
              </View>
            </View>
          );
        })}
      </View>
      {next != null ? (
        <View style={{ marginTop: 12 }}>
          <View style={{ height: 5, borderRadius: 9999, backgroundColor: colors.borderStrong, overflow: 'hidden' }}>
            <View style={{ width: `${Math.max(3, (count / next) * 100)}%`, height: '100%', borderRadius: 9999, backgroundColor: colors.ink }} />
          </View>
          <AppText center style={[sans('500'), { fontSize: 12, color: colors.textSoft, marginTop: 8 }]}>
            {count} so far · tier {roman(steps.indexOf(next) + 1)} at ×{next}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}
