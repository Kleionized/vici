import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, BackChevron, LoadingView, Screen, SectionLabel } from '@/components/ui';
import { KKMedallion, type KeepsakeSceneKey } from '@/components/keepsakes/Medallion';
import { useCheckins, useCurrentLesson, useCurrentUser, useEvents, useJournalEntries, useLessonProgressMap } from '@/lib/backend';
import { colors, fonts, sans, spacing } from '@/lib/theme';

/**
 * Medallions (canvas: screens-keepsakes) — a campaign album of phalerae.
 * Three pillars anchor it — Veni (crossed in, once), Vidi (days witnessed,
 * tiered), Vici (urges outlasted, tiered) — with eight more around them.
 * Earned ones carry a letterpress date or tier line; in-progress ones wear
 * the arc; the ones still ahead sit as blind-embossed blanks. Real counts
 * drive everything.
 */

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const RN: [number, string][] = [[100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
const romanN = (n: number) => {
  let s = '';
  let x = n;
  for (const [v, r] of RN) while (x >= v) { s += r; x -= v; }
  return s || '0';
};

type Tiers = { count: number; steps: number[]; stories: string[] };
type Keepsake = {
  key: KeepsakeSceneKey;
  name: string;
  how: string;
  story?: string;
  date?: string;
  earned: boolean;
  newest?: boolean;
  unit?: 'day';
  tiers?: Tiers;
  progress?: [number, number];
  locked?: boolean;
  rare?: boolean;
  hint?: string;
};

const kkTier = (k: Keepsake) => (k.tiers ? k.tiers.steps.filter((s) => k.tiers!.count >= s).length : null);
const kkNextStep = (k: Keepsake) => (k.tiers ? k.tiers.steps.find((s) => k.tiers!.count < s) : undefined);
const kkStory = (k: Keepsake) => (k.earned && k.tiers && k.tiers.stories.length ? k.tiers.stories[Math.max(0, (kkTier(k) || 1) - 1)] : k.story);
const kkCountLabel = (k: Keepsake) => (k.unit === 'day' ? `Day ${romanN(k.tiers!.count)}` : `×${k.tiers!.count}`);

export default function Milestones() {
  const router = useRouter();
  const events = useEvents();
  const checkins = useCheckins();
  const user = useCurrentUser();
  const journal = useJournalEntries();
  const progress = useLessonProgressMap();
  const current = useCurrentLesson();
  const [open, setOpen] = useState<Keepsake | null>(null);

  if (events === undefined || checkins === undefined || user === undefined || journal === undefined || progress === undefined || current === undefined) {
    return (
      <Screen>
        <LoadingView />
      </Screen>
    );
  }

  const checkinDays = checkins.length;
  const days = user ? Math.max(1, Math.floor((Date.now() - user.createdAt) / 86400000) + 1) : 1;
  const rode = events.filter((e) => e.type === 'urge_rode_out').length;
  const returns = events.filter((e) => e.type === 'urge_rode_out' || e.type === 'urge_acted_on').length;
  const entries = journal.length;
  const letters = journal.filter((j) => j.tag === 'Letter').length;
  const lessonsDone = Object.values(progress).filter((p) => p?.status === 'completed').length;
  const recovered = events.some((e) => e.type === 'lapse');
  const worldsDone = Math.max(0, (current?.lesson.week ?? 1) - 1);
  const stormRode = events.some((e) => e.type === 'urge_rode_out' && (e.severity ?? 0) >= 9);

  const K: Keepsake[] = [
    {
      key: 'lettersent', name: 'Letter sent', how: 'Kept a letter for your future self', earned: letters >= 1,
      date: letters >= 1 ? `Day ${romanN(days)}` : undefined,
      tiers: { count: letters, steps: [1, 4, 12, 24, 52], stories: [
        'Three honest paragraphs, sealed for the man ahead of you.',
        'It rides ahead of you now, and it knows when to arrive.',
        'A dozen letters out. You’re writing to someone you trust more than you did.',
        'Two dozen, sealed and sent. Writing to him is as old a habit as some of the ones it replaced.',
        'Fifty-two letters. A year of checking in with someone who kept believing you, on schedule, before you did.',
      ] },
    },
    {
      key: 'backondeck', name: 'Back on deck', how: 'An urge passed and you came back the same day, instead of vanishing',
      earned: returns >= 1, date: `Day ${romanN(days)}`,
      tiers: { count: returns, steps: [1, 5, 25, 100], stories: [
        'It left, and you could have too. Instead you opened the app the same day and logged it.',
        'Five returns. An urge used to end the conversation; now it doesn’t even end the evening.',
        'Twenty-five times back on deck. Returning stopped being a decision. It’s just what you do.',
        'A hundred returns. There is no version of an urge that ends with you gone.',
      ] },
    },
    {
      key: 'veni', name: 'Veni', how: 'Crossed the threshold and began the campaign', earned: true, date: 'Day 0',
      story: 'Nothing was asked of you yet. Just this: you stepped off the old shore. Everything since has been built on that alone.',
    },
    {
      key: 'vidi', name: 'Vidi', how: 'Days in the practice, witnessed one by one', earned: days >= 3, unit: 'day',
      date: `Day ${romanN(days)}`,
      tiers: { count: days, steps: [3, 7, 30, 90, 180, 365], stories: [
        'The first fog lifts right about here, on schedule.',
        'Seven check-ins, two waves ridden, zero perfect days required.',
        'This is where “trying something” quietly becomes “how you live.”',
        'The long walk. By now the view is just… Tuesday.',
        'Six months witnessed, one day at a time. Nobody walks it in a straight line. Vidi only asks that you stayed on it.',
        'A full year, witnessed. The campaign outlived the season it started in.',
      ] },
    },
    {
      key: 'vici', name: 'Vici', how: 'Urges met and outlasted', earned: rode >= 1, date: `Day ${romanN(days)}`,
      tiers: { count: rode, steps: [1, 5, 25, 100, 250, 500, 1000], stories: [
        'Nine minutes, start to finish. You watched it rise, crest, and leave without you.',
        'Five ridden. Each one shortens the next.',
        'Twenty-five behind you now. The pattern is unmistakable.',
        'A hundred waves met and outlasted. This stopped being a fight you were unsure of a while ago.',
        'Two hundred and fifty. Vici isn’t a moment anymore. It’s just what you do.',
        'Five hundred. Most of them don’t even register as events now. This one still gets a mark.',
        'A thousand. The sea hasn’t changed. You’re just not the one it moves anymore.',
      ] },
    },
    {
      key: 'bounce', name: 'Never failed twice', how: 'Slipped, and came back the next morning, not the next week',
      earned: recovered, date: recovered ? `Day ${romanN(days)}` : undefined,
      tiers: { count: recovered ? 1 : 0, steps: [1, 10, 25, 50, 100], stories: [
        'You slipped. The next morning you were back before breakfast. No spiral, no vanishing week.',
        'Ten bounces now. That’s not luck holding, that’s practice.',
        'Twenty-five times down, twenty-five mornings back. The pattern is the point, not the count.',
        'Fifty. Falling has stopped meaning anything except that you get up.',
        'A hundred mornings after. The bounce is the strongest predictor there is, and you’re the proof of it.',
      ] },
    },
    {
      key: 'firstlight', name: 'First light', how: 'Your first morning check-in', earned: checkinDays >= 1, date: 'Day I',
      story: 'Twenty seconds of honesty on an ordinary morning. Everything since has stacked on this.',
    },
    {
      key: 'honest', name: 'Honest ink', how: 'Journal entries, written honestly, not for show', earned: entries >= 10,
      date: `Day ${romanN(days)}`,
      tiers: { count: entries, steps: [10, 50, 100, 200, 365], stories: [
        'Ten entries in. Twelve honest paragraphs beat a hundred vague ones.',
        'Fifty pages of real accounting. The patterns page runs on this ink.',
        'A hundred entries. You know your own weather better than most people know their week.',
        'Two hundred. The record’s long enough now to argue with your own memory, and win.',
        'A year of entries, one for almost every day. This is a diary of a life, not a habit tracker.',
      ] },
    },
    {
      key: 'study', name: 'Steady study', how: 'Lessons finished, one at a time', earned: lessonsDone >= 5,
      progress: lessonsDone < 5 ? [lessonsDone, 5] : undefined,
      tiers: { count: lessonsDone, steps: [5, 10, 25, 50, 75, 96], stories: [
        'Five lessons in. Early enough this still feels like homework. That won’t last.',
        'Ten down. The ideas start meeting you in the moment, not just on the page.',
        'A quarter of the curriculum, done. More scaffolding built than it feels like.',
        'Halfway. The back half moves faster because the front half already changed how you think.',
        'Three-quarters through. What’s left is mostly deepening, not learning from scratch.',
        'Every lesson, finished. The curriculum’s done its job. The rest is just living it.',
      ] },
      story: `${lessonsDone} lesson${lessonsDone === 1 ? '' : 's'} in, ${Math.max(0, 5 - lessonsDone)} more to the first rung.`,
    },
    {
      key: 'groundtaken', name: 'Ground taken', how: 'A world finished, then another', earned: worldsDone >= 1,
      progress: worldsDone < 1 ? [lessonsDone, 6] : undefined,
      tiers: { count: worldsDone, steps: [1, 3, 5, 7, 10], stories: [
        'Your first world, finished. The map opens from here.',
        'Three worlds in. There’s a rhythm to this now.',
        'Five worlds down, five to go. You’ve crossed the water and started the climb.',
        'Seven worlds. The summit’s close enough to see clearly.',
        'All ten. Sea to summit, the whole campaign, met.',
      ] },
      story: 'The first ground is nearly yours. The map opens from there.',
    },
    {
      key: 'told', name: 'Let someone in', how: 'Told one person about the work: a friend, a partner, anyone',
      earned: false, locked: true,
      story: 'The habit lives in the dark. One honest conversation takes half its weight away.',
    },
    {
      key: 'storm', name: 'Storm weathered', how: 'Rode out a force-nine urge, the hardest kind',
      earned: stormRode, locked: !stormRode, rare: true, date: stormRode ? `Day ${romanN(days)}` : undefined,
      story: 'One will come. When it does, the lighthouse holds.',
    },
  ];

  // the newest medallion — the most recently earnable, hero'd on the dark card
  const newestKey: KeepsakeSceneKey = returns >= 1 ? 'backondeck' : recovered ? 'bounce' : letters >= 1 ? 'lettersent' : rode >= 1 ? 'vici' : checkinDays >= 1 ? 'firstlight' : 'veni';
  const list = K.map((k) => ({ ...k, newest: k.key === newestKey && k.earned }));
  const newest = list.find((k) => k.newest);
  const earnedList = list.filter((k) => k.earned && !k.newest);
  const reach = list.filter((k) => !k.earned && k.progress);
  const ahead = list.filter((k) => !k.earned && !k.progress);
  const nEarned = list.filter((k) => k.earned).length;

  return (
    <Screen contentStyle={{ paddingTop: spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        <BackChevron onPress={() => (router.canGoBack() ? router.back() : router.navigate('/(app)/dashboard'))} />
      </View>
      <AppText style={{ fontFamily: fonts.serifSharp, fontSize: 34, letterSpacing: 0.34, color: colors.text, marginTop: 14 }}>Medallions</AppText>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 }}>
        <View style={{ flex: 1, height: 4.5, borderRadius: 9999, backgroundColor: colors.borderStrong, overflow: 'hidden' }}>
          <View style={{ width: `${(nEarned / list.length) * 100}%`, height: '100%', borderRadius: 9999, backgroundColor: colors.ink }} />
        </View>
        <AppText style={[sans('500'), { fontSize: 13, color: colors.textMuted, fontVariant: ['tabular-nums'] }]}>
          {nEarned} of {list.length}
        </AppText>
      </View>

      {/* newest — the hero medallion, sealed dark like home's Next lesson */}
      {newest ? (
        <Pressable
          onPress={() => setOpen(newest)}
          style={({ pressed }) => ({
            marginTop: 28,
            backgroundColor: '#131313',
            borderRadius: 20,
            paddingVertical: 22,
            paddingHorizontal: 20,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          })}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            <KKMedallion scene={newest.key} size={118} earned tier={kkTier(newest)} tierMax={newest.tiers ? newest.tiers.steps.length : 0} />
            <View style={{ flex: 1 }}>
              <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: 'rgba(245,244,241,0.62)' }]}>
                Newest medallion
              </AppText>
              <AppText style={{ fontFamily: fonts.serif, fontSize: 23, lineHeight: 25, letterSpacing: 0.12, color: '#F5F4F1', marginTop: 8, marginBottom: 8 }}>
                {newest.name}
              </AppText>
              <AppText style={[sans('400'), { fontSize: 13, lineHeight: 18, color: 'rgba(245,244,241,0.62)', marginBottom: 12 }]}>{newest.how}</AppText>
              {newest.date ? <DateStamp dark>{newest.date}</DateStamp> : null}
            </View>
          </View>
        </Pressable>
      ) : null}

      {/* earned */}
      <View style={{ marginTop: 38, marginBottom: 12 }}>
        <SectionLabel>Earned</SectionLabel>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {earnedList.map((k) => (
          <Pressable
            key={k.key}
            onPress={() => setOpen(k)}
            style={({ pressed }) => ({
              width: '47.8%',
              flexGrow: 1,
              alignItems: 'center',
              gap: 11,
              backgroundColor: colors.surface,
              borderRadius: 20,
              paddingTop: 18,
              paddingBottom: 15,
              paddingHorizontal: 12,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}>
            <KKMedallion scene={k.key} size={82} earned tier={kkTier(k)} tierMax={k.tiers ? k.tiers.steps.length : 0} />
            <View style={{ alignItems: 'center' }}>
              <AppText style={[sans('500'), { fontSize: 14.5, lineHeight: 17, color: colors.text }]}>{k.name}</AppText>
              <AppText style={[sans('500'), { fontSize: 10.5, letterSpacing: 0.84, textTransform: 'uppercase', color: colors.textSoft, marginTop: 5, fontVariant: ['tabular-nums'] }]}>
                {k.tiers ? `Tier ${ROMAN[(kkTier(k) || 1) - 1] || 'I'} · ${kkCountLabel(k)}` : k.date}
              </AppText>
            </View>
          </Pressable>
        ))}
      </View>

      {/* within reach */}
      {reach.length ? (
        <>
          <View style={{ marginTop: 38, marginBottom: 12 }}>
            <SectionLabel>Within reach</SectionLabel>
          </View>
          <View style={{ gap: 10 }}>
            {reach.map((k) => (
              <Pressable
                key={k.key}
                onPress={() => setOpen(k)}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 15,
                  backgroundColor: colors.surface,
                  borderRadius: 20,
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  transform: [{ scale: pressed ? 0.99 : 1 }],
                })}>
                <KKMedallion scene={k.key} size={62} earned={false} progress={k.progress} tier={kkTier(k)} tierMax={k.tiers ? k.tiers.steps.length : 0} />
                <View style={{ flex: 1 }}>
                  <AppText style={[sans('500'), { fontSize: 14, color: colors.text }]}>{k.name}</AppText>
                  <AppText style={[sans('400'), { fontSize: 12.5, color: colors.textMuted, marginTop: 3 }]}>{k.how}</AppText>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 9 }}>
                    <View style={{ flex: 1, height: 4, borderRadius: 9999, backgroundColor: colors.borderStrong, overflow: 'hidden' }}>
                      <View style={{ width: `${Math.max(4, (k.progress![0] / k.progress![1]) * 100)}%`, height: '100%', borderRadius: 9999, backgroundColor: colors.ink }} />
                    </View>
                    <AppText style={[sans('500'), { fontSize: 12.5, color: colors.text, fontVariant: ['tabular-nums'] }]}>
                      {k.progress![0]}
                      <AppText style={[sans('500'), { fontSize: 12.5, color: colors.textSoft }]}> / {k.progress![1]}</AppText>
                    </AppText>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      {/* still ahead — blind-embossed blanks */}
      <View style={{ marginTop: 38, marginBottom: 12 }}>
        <SectionLabel>Still ahead</SectionLabel>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {ahead.map((k) => (
          <Pressable key={k.key} onPress={() => setOpen(k)} style={{ width: '30%', flexGrow: 1, alignItems: 'center', gap: 9, paddingVertical: 6 }}>
            <KKMedallion scene={k.key} size={68} earned={false} />
            <AppText center style={[sans('500'), { fontSize: 11.5, lineHeight: 14, color: colors.textSoft }]}>{k.name}</AppText>
          </Pressable>
        ))}
      </View>

      {/* the detail overlay */}
      <Modal visible={!!open} transparent animationType="fade" onRequestClose={() => setOpen(null)}>
        {open ? <Detail k={open} onClose={() => setOpen(null)} /> : null}
      </Modal>
    </Screen>
  );
}

// letterpress date chip — `dark` renders it for the #131313 card
function DateStamp({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        borderWidth: 1.4,
        borderColor: dark ? 'rgba(245,244,241,0.35)' : 'rgba(74,74,66,0.38)',
        borderRadius: 6,
        paddingHorizontal: 7,
        paddingVertical: 3,
        backgroundColor: dark ? 'transparent' : '#F8F8F6',
      }}>
      <AppText style={[sans('500'), { fontSize: 9.5, letterSpacing: 1.33, textTransform: 'uppercase', color: dark ? 'rgba(245,244,241,0.75)' : 'rgba(74,74,66,0.72)', fontVariant: ['tabular-nums'] }]}>
        {children}
      </AppText>
    </View>
  );
}

// ── the tier ladder: how a medallion grows ───────────────────────────
function TierLadder({ k }: { k: Keepsake }) {
  const { count, steps } = k.tiers!;
  const next = kkNextStep(k);
  const dense = steps.length >= 6;
  return (
    <View style={{ marginTop: 20, marginHorizontal: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {steps.map((s, i) => {
          const hit = count >= s;
          const isNext = s === next;
          return (
            <View key={s} style={{ flexDirection: 'row', alignItems: 'center', flex: i > 0 ? 1 : 0 }}>
              {i > 0 ? <View style={{ flex: 1, height: 2, borderRadius: 9999, backgroundColor: hit ? 'rgba(74,74,66,0.6)' : colors.borderStrong, marginHorizontal: dense ? 3 : 5, minWidth: 4 }} /> : null}
              <View style={{ alignItems: 'center', gap: 5 }}>
                <View
                  style={{
                    minWidth: dense ? 24 : 30,
                    height: dense ? 24 : 30,
                    borderRadius: 9999,
                    paddingHorizontal: dense ? 4 : 7,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: hit ? colors.ink : colors.surface,
                    borderWidth: isNext && !hit ? 1.8 : 0,
                    borderColor: 'rgba(74,74,66,0.55)',
                  }}>
                  <AppText style={[sans('500'), { fontSize: dense ? 10 : 11.5, color: hit ? colors.inkText : isNext ? colors.text : colors.textSoft, fontVariant: ['tabular-nums'] }]}>
                    {s}
                  </AppText>
                </View>
                <AppText style={[sans('500'), { fontSize: 8.5, letterSpacing: 0.68, color: hit ? colors.textMuted : colors.textSofter }]}>{ROMAN[i]}</AppText>
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
          <AppText center style={[sans('500'), { fontSize: 12, color: colors.textSoft, marginTop: 8, fontVariant: ['tabular-nums'] }]}>
            {k.unit === 'day' ? `Day ${count}` : count} so far · tier {ROMAN[steps.indexOf(next)]} at {k.unit === 'day' ? `day ${next}` : `×${next}`}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

// ── the detail overlay: one medallion, told properly ─────────────────
function Detail({ k, onClose }: { k: Keepsake; onClose: () => void }) {
  const earned = k.earned;
  const p = k.progress || null;
  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(38,37,30,0.42)' }}>
      <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={onClose} />
      <SafeAreaView style={{ flex: 1, justifyContent: 'center' }} pointerEvents="box-none">
        <View style={{ marginHorizontal: 29, backgroundColor: colors.surface, borderRadius: 24, paddingTop: 30, paddingBottom: 24, paddingHorizontal: 26, alignItems: 'center' }}>
          <KKMedallion scene={k.key} size={136} earned={earned} progress={p} tier={kkTier(k)} tierMax={k.tiers ? k.tiers.steps.length : 0} />
          <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: colors.textSoft, marginTop: 20 }]}>
            {earned && k.tiers
              ? `Medallion · Tier ${ROMAN[(kkTier(k) || 1) - 1] || 'I'} of ${ROMAN[k.tiers.steps.length - 1]}`
              : earned
                ? 'Medallion · earned'
                : p
                  ? `Within reach · ${p[0]} of ${p[1]}`
                  : k.rare
                    ? 'Rare · still ahead'
                    : 'Still ahead'}
          </AppText>
          <AppText center style={{ fontFamily: fonts.serifSharp, fontSize: 26, lineHeight: 30, color: colors.text, marginTop: 9 }}>{k.name}</AppText>
          {earned && k.date ? (
            <View style={{ marginTop: 12 }}>
              <DateStamp>
                {k.date}
                {k.tiers && k.unit !== 'day' ? ` · ×${k.tiers.count}` : ''}
              </DateStamp>
            </View>
          ) : null}
          <AppText center style={[sans('400'), { fontSize: 14.5, lineHeight: 22, color: colors.textMuted, marginTop: 14, maxWidth: 280 }]}>
            {kkStory(k)}
          </AppText>
          {k.tiers && (earned || !p) ? <View style={{ alignSelf: 'stretch' }}><TierLadder k={k} /></View> : null}
          {!k.tiers && p ? (
            <View style={{ alignSelf: 'stretch', marginTop: 20, marginHorizontal: 4 }}>
              <View style={{ height: 6, borderRadius: 9999, backgroundColor: colors.borderStrong, overflow: 'hidden' }}>
                <View style={{ width: `${Math.max(3, (p[0] / p[1]) * 100)}%`, height: '100%', borderRadius: 9999, backgroundColor: colors.ink }} />
              </View>
              <AppText center style={[sans('500'), { fontSize: 12, color: colors.textSoft, marginTop: 9, fontVariant: ['tabular-nums'] }]}>
                {p[0]} of {p[1]}
              </AppText>
            </View>
          ) : null}
          <View style={{ alignSelf: 'stretch', marginTop: 22 }}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => ({
                backgroundColor: earned ? colors.ink : colors.surface,
                borderWidth: earned ? 0 : 1.5,
                borderColor: colors.border,
                borderRadius: 9999,
                paddingVertical: 16,
                alignItems: 'center',
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}>
              <AppText style={[sans('600'), { fontSize: 15.5, color: earned ? colors.inkText : colors.text }]}>
                {earned ? 'Keep it' : 'Keep going'}
              </AppText>
            </Pressable>
            <Pressable onPress={onClose} style={{ alignItems: 'center', paddingTop: 13, paddingBottom: 2 }}>
              <AppText style={[sans('500'), { fontSize: 14.5, color: colors.textMuted }]}>Back to medallions</AppText>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
