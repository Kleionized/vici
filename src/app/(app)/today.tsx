import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { AppText, LoadingView, Screen } from '@/components/ui';
import { useCheckins, useCurrentLesson, useCurrentUser, useEvents, useTodayCheckin } from '@/lib/backend';
import { toDateKey } from '@/lib/date';
import { colors, fonts, sans, spacing } from '@/lib/theme';

// ── the canvas "Today" board: streak pill · DAY <roman> · avatar, the big
// Newsreader maxim, one dark NEXT LESSON card, a hairline checklist, and
// the week-moods strip; wave-divider footer over the valley river. ──

const MOOD_TONES = colors.moodTones;
const CARD = colors.surface;
const RING = colors.ring;

/** 1 → I, 24 → XXIV … the campaign speaks in Roman numerals. */
function roman(n: number): string {
  const table: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let out = '';
  let x = Math.max(1, Math.round(n));
  for (const [v, s] of table) {
    while (x >= v) {
      out += s;
      x -= v;
    }
  }
  return out;
}

// A small pool of calm maxims — one per day, picked by date.
const MAXIMS = [
  'A craving is a tide — it rises, peaks, and always recedes.',
  'You are not fighting the wave. You are learning to ride it.',
  'A streak resets. A campaign doesn’t.',
  'The urge is loud because it is losing.',
  'Don’t fail twice. That is the whole method.',
  'What you water grows. Water the life you want.',
  'Steady is not slow. Steady is how it changes.',
];

const FOOTER_MAXIM = 'Small steps. Steady days.\nThat’s how it changes.';

export default function Today() {
  const router = useRouter();
  const user = useCurrentUser();
  const current = useCurrentLesson();
  const todayCheckin = useTodayCheckin();
  const checkins = useCheckins();
  const events = useEvents();

  if (user === undefined || current === undefined) {
    return (
      <Screen>
        <LoadingView />
      </Screen>
    );
  }

  // Day number = days into the campaign (since the account began), 1-based.
  const dayNumber = user?.createdAt ? Math.max(1, Math.floor((Date.now() - user.createdAt) / 86400000) + 1) : 1;
  const maxim = MAXIMS[dayNumber % MAXIMS.length];

  // Sun–Sat week around today, with each day's logged mood (1–5 → tone index).
  const sunday = new Date();
  sunday.setDate(sunday.getDate() - sunday.getDay());
  const todayKey = toDateKey(new Date());
  const moodByDate = new Map((checkins ?? []).filter((c) => c.mood != null).map((c) => [c.date, c.mood as number]));
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    const key = toDateKey(d);
    const mood = moodByDate.get(key);
    return {
      letter: 'SMTWTFS'[i],
      key,
      today: key === todayKey,
      future: d.getTime() > Date.now() && key !== todayKey,
      tone: mood != null ? Math.min(4, Math.max(0, Math.round(mood) - 1)) : null,
    };
  });
  const loggedTones = week.filter((w) => w.tone != null).map((w) => w.tone as number);
  const moodWord =
    loggedTones.length === 0
      ? 'this week'
      : loggedTones.reduce((a, b) => a + b, 0) / loggedTones.length < 1.4
        ? 'heavy'
        : loggedTones.reduce((a, b) => a + b, 0) / loggedTones.length < 2.8
          ? 'steady'
          : 'lifting';

  // Today's steps — real, data-backed, each row navigates to its flow.
  const loggedToday = (events ?? []).some((e) => toDateKey(new Date(e.createdAt)) === todayKey);
  const steps = [
    {
      id: 'lesson',
      label: current ? 'Read today’s lesson' : 'Browse the journey',
      done: current?.progress?.status === 'completed',
      go: () => (current ? router.push(`/lesson/${current.lesson.slug}`) : router.navigate('/(app)/weeks')),
    },
    {
      id: 'mood',
      label: 'Log how you’re feeling',
      done: todayCheckin?.mood != null,
      go: () => router.push('/checkin'),
    },
    {
      id: 'log',
      label: 'Capture today in your log',
      done: loggedToday,
      go: () => router.navigate('/(app)/log'),
    },
  ];
  const doneCount = steps.filter((s) => s.done).length;

  return (
    <Screen contentStyle={{ paddingTop: spacing.sm, paddingBottom: 0 }}>
      {/* header: streak pill · DAY N · avatar */}
      <View style={{ position: 'relative', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: CARD,
            borderRadius: 9999,
            paddingVertical: 7,
            paddingLeft: 11,
            paddingRight: 13,
          }}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 3.2c.4 2.6-.9 4.1-2.3 5.6C8.2 10.4 7 12 7 14.4A5.4 5.4 0 0 0 12.4 19.8 5.6 5.6 0 0 0 18 14.2c0-2.1-1-3.6-2.1-4.9-.3 1-.9 1.9-1.9 2.4.3-2.7-.6-6.3-2-8.5z"
              fill={colors.text}
            />
          </Svg>
          <AppText style={[sans('600'), { fontSize: 14.5, color: colors.text, fontVariant: ['tabular-nums'] }]}>
            {dayNumber}
          </AppText>
        </View>

        <View
          pointerEvents="none"
          style={{ position: 'absolute', left: 0, right: 0, top: 7, alignItems: 'center', gap: 8 }}>
          <AppText style={[sans('600'), { fontSize: 13.5, letterSpacing: 3.2, textTransform: 'uppercase', color: colors.text }]}>
            {'Day ' + roman(dayNumber)}
          </AppText>
          <View style={{ width: 40, height: 1.5, backgroundColor: colors.text }} />
        </View>

        <Pressable
          onPress={() => router.push('/profile')}
          hitSlop={8}
          accessibilityLabel="Profile"
          style={{
            width: 34,
            height: 34,
            borderRadius: 9999,
            backgroundColor: colors.ink,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={9.2} r={3.1} stroke={colors.inkText} strokeWidth={1.6} />
            <Path d="M5.9 18.4c1-2.7 3.4-4.2 6.1-4.2s5.1 1.5 6.1 4.2" stroke={colors.inkText} strokeWidth={1.6} strokeLinecap="round" />
          </Svg>
        </Pressable>
      </View>

      {/* the day's maxim — big Newsreader quote */}
      <View style={{ alignItems: 'center', marginTop: 34, height: 32 }}>
        <AppText style={{ fontFamily: fonts.serifSharp, fontSize: 60, lineHeight: 60, color: 'rgba(29,28,26,0.2)' }}>
          {'“'}
        </AppText>
      </View>
      <AppText
        center
        style={{
          fontFamily: fonts.serifSharp,
          fontSize: 24,
          lineHeight: 29,
          color: colors.text,
          maxWidth: 280,
          alignSelf: 'center',
        }}>
        {maxim}
      </AppText>

      {/* NEXT LESSON — the one dark card */}
      {current ? (
        <Pressable
          onPress={() => router.push(`/lesson/${current.lesson.slug}`)}
          accessibilityRole="button"
          style={({ pressed }) => ({
            marginTop: 48,
            height: 214,
            borderRadius: 20,
            overflow: 'hidden',
            backgroundColor: colors.ink,
            transform: [{ scale: pressed ? 0.985 : 1 }],
          })}>
          <Image
            source={require('../../../assets/images/next-lesson-dark.webp')}
            contentFit="cover"
            contentPosition={{ top: '32%', left: '50%' }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <View style={{ flex: 1, padding: 22, paddingBottom: 20 }}>
            <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: colors.inkTextMuted }]}>
              Next lesson
            </AppText>
            <AppText
              numberOfLines={1}
              style={{ fontFamily: fonts.serif, fontSize: 24, lineHeight: 28, letterSpacing: 0.12, color: colors.inkText, marginTop: 8 }}>
              {current.lesson.title}
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 }}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={12} r={8.5} stroke="rgba(245,244,241,0.65)" strokeWidth={1.8} />
                <Path d="M12 7.5V12l3 2" stroke="rgba(245,244,241,0.65)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <AppText style={[sans('500'), { fontSize: 13.5, letterSpacing: 0.27, color: 'rgba(245,244,241,0.65)' }]}>
                {(current.lesson.estimatedMinutes ?? 3) + ' min read'}
              </AppText>
            </View>
            <View
              style={{
                marginTop: 'auto',
                width: 42,
                height: 42,
                borderRadius: 9999,
                backgroundColor: colors.inkText,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
                <Path d="M4.5 12h14M12.5 5.5 19 12l-6.5 6.5" stroke={colors.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
          </View>
        </Pressable>
      ) : null}

      {/* today's steps */}
      <View style={{ marginTop: 46 }}>
        <SectionHead title="Today's steps" meta={`${doneCount} of ${steps.length}`} />
        <View style={{ backgroundColor: CARD, borderRadius: 18, paddingVertical: 4, paddingHorizontal: 20 }}>
          {steps.map((s, i) => (
            <Pressable
              key={s.id}
              onPress={s.go}
              accessibilityRole="button"
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 18,
                paddingVertical: 14,
                borderBottomWidth: i < steps.length - 1 ? 1 : 0,
                borderBottomColor: 'rgba(0,0,0,0.06)',
              }}>
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 9999,
                  backgroundColor: s.done ? colors.ink : 'transparent',
                  borderWidth: s.done ? 0 : 1.5,
                  borderColor: RING,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {s.done ? (
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <Path d="m5 12.5 4.5 4.5L19 7.5" stroke={colors.inkText} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                ) : null}
              </View>
              <AppText
                style={[
                  sans('400'),
                  {
                    flex: 1,
                    fontSize: 17,
                    lineHeight: 26,
                    letterSpacing: 0.17,
                    color: s.done ? colors.textSoft : colors.text,
                    textDecorationLine: s.done ? 'line-through' : 'none',
                  },
                ]}>
                {s.label}
              </AppText>
              <Svg width={8} height={14} viewBox="0 0 8 14" fill="none">
                <Path d="m1.5 1.5 5 5.5-5 5.5" stroke={colors.textSoft} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </Pressable>
          ))}
        </View>
      </View>

      {/* your week moods */}
      <View style={{ marginTop: 40 }}>
        <SectionHead title="Your week moods" meta={moodWord} />
        <View style={{ backgroundColor: CARD, borderRadius: 20, paddingTop: 18, paddingBottom: 19, paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row' }}>
            {week.map((w, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center', gap: 8 }}>
                <AppText style={[sans(w.today ? '700' : '500'), { fontSize: 11, letterSpacing: 0.66, color: w.today ? colors.text : colors.textSoft }]}>
                  {w.letter}
                </AppText>
                {w.today ? (
                  <Pressable
                    onPress={() => router.push('/checkin')}
                    accessibilityLabel="Log today's mood"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9999,
                      borderWidth: 1.5,
                      borderColor: colors.text,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        width: 25,
                        height: 25,
                        borderRadius: 9999,
                        backgroundColor: w.tone != null ? MOOD_TONES[w.tone] : 'transparent',
                        borderWidth: w.tone != null ? 0 : 1.5,
                        borderColor: RING,
                        borderStyle: w.tone != null ? 'solid' : 'dashed',
                      }}
                    />
                  </Pressable>
                ) : w.tone != null ? (
                  <View style={{ width: 30, height: 30, borderRadius: 9999, backgroundColor: MOOD_TONES[w.tone] }} />
                ) : (
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 9999,
                      borderWidth: 1,
                      borderColor: RING,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
                      <Path d="M12 5v14M5 12h14" stroke={colors.textSoft} strokeWidth={2} strokeLinecap="round" />
                    </Svg>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* footer — wave divider + maxim over the valley river */}
      <View style={{ marginTop: 44, position: 'relative' }}>
        <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.1)' }} />
        <View
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            marginLeft: -19,
            marginTop: -19,
            width: 38,
            height: 38,
            borderRadius: 9999,
            backgroundColor: '#FDFDFC',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Svg width={16} height={8} viewBox="0 0 16 8" fill="none">
            <Path d="M1 5.5C3 1.5 5 1.5 8 4s5 2.5 7-1.5" stroke={colors.textMuted} strokeWidth={1.6} strokeLinecap="round" />
          </Svg>
        </View>
      </View>
      <AppText
        center
        style={{
          fontFamily: fonts.serifSharp,
          fontSize: 19,
          lineHeight: 27,
          color: colors.text,
          maxWidth: 250,
          alignSelf: 'center',
          marginTop: 38,
        }}>
        {FOOTER_MAXIM}
      </AppText>

      <View style={{ marginTop: 30, marginHorizontal: -spacing.xl, height: 260 }}>
        <Image
          source={require('../../../assets/images/valley-river.webp')}
          contentFit="cover"
          contentPosition={{ top: '42%', left: '50%' }}
          style={{ width: '100%', height: '100%' }}
        />
        {/* melt the photo's top edge into the paper + a dim wash so it doesn't glare */}
        <LinearGradient
          colors={[colors.bg, 'rgba(244,243,240,0)']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 96 }}
        />
        <LinearGradient
          colors={['rgba(244,243,240,0)', 'rgba(58,56,52,0.14)', 'rgba(43,41,38,0.3)']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
      </View>
    </Screen>
  );
}

// ── section header — caps outside the card, muted meta on the right ──
function SectionHead({ title, meta }: { title: string; meta?: string }) {
  return (
    <View
      style={{
        paddingHorizontal: 4,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
      }}>
      <AppText style={[sans('600'), { fontSize: 13, letterSpacing: 2.3, textTransform: 'uppercase', color: colors.text }]}>
        {title}
      </AppText>
      {meta ? (
        <AppText style={[sans('500'), { fontSize: 13.5, color: colors.textSoft, fontVariant: ['tabular-nums'] }]}>{meta}</AppText>
      ) : null}
    </View>
  );
}
