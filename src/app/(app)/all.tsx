import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTabBarHeight } from '@/components/StoicTabBar';
import { AppText, ChevronGlyph, Grain, PressScale } from '@/components/ui';
import { toDateKey } from '@/lib/date';
import { latestCompletedWeek, mondayOf } from '@/lib/weeklyReport';
import { useCurrentUser } from '@/lib/backend';
import { colors, sans } from '@/lib/theme';

/**
 * All — every screen in the app, reachable.
 *
 * Not a canvas frame. Most of what this app can show arrives on its own terms:
 * the weekly report is pushed the launch after a week closes, the letter the
 * launch after a slip, the drop once a year. That is right for the product and
 * useless for looking at the work, so this is the drawer they all live in.
 *
 * Built in the Settings idiom, which is the canvas's own list treatment — the
 * 27pt title at 16/16, a 26-tall caption box above each group, cards 12 in from
 * both edges at radius 16, and 52-tall rows with the hairline stopping 18 short
 * of the card's edges.
 */

const noiseDark = require('../../../assets/images/noise-dark.png');

const HAIRLINE = 'rgba(0,0,0,0.06)';

type Row = { title: string; detail?: string; to: string };

export default function All() {
  const router = useRouter();
  const user = useCurrentUser();
  const tabBar = useTabBarHeight();

  // The report needs something real to open onto; a hub that pushes a route
  // with no params lands on an empty screen and reads as a bug rather than as a
  // screen you have not earned yet. An account under a week old has no completed
  // week, so fall back to last Monday — the report will be thin, but it is a
  // real week rather than a missing param.
  const lastMonday = toDateKey(new Date(mondayOf(new Date()).getTime() - 7 * 86_400_000));
  const week = (user?.createdAt ? latestCompletedWeek(user.createdAt) : null) ?? lastMonday;

  const groups: [string, Row[]][] = [
    [
      'Daily',
      [
        { title: 'Today', to: '/(app)/today' },
        { title: 'Morning check-in', detail: '5 steps', to: '/day/morning' },
        { title: 'Nightly check-in', detail: '4 steps', to: '/day/night' },
        { title: 'Quick mood check-in', to: '/checkin' },
        { title: 'Sentence journal', to: '/affirmation' },
        { title: 'First steps', to: '/first-steps' },
      ],
    ],
    [
      'In the moment',
      [
        { title: 'Urge SOS', detail: 'Breathe · tap · odd one out', to: '/urge' },
        { title: 'The first 90 seconds', to: '/rough-first90' },
        { title: 'Rough days', detail: 'Seven moods, three moves each', to: '/(app)/rough-days' },
        { title: 'Log an urge', to: '/urge-log' },
        { title: 'Log a lapse', to: '/lapse' },
        { title: 'After a slip', to: '/relapse' },
      ],
    ],
    [
      'Looking back',
      [
        { title: 'The log', to: '/(app)/log' },
        { title: 'Recovery score', to: '/score' },
        { title: 'Insights', detail: 'Mood, urges, triggers', to: '/(app)/dashboard' },
        { title: 'Urge overview', detail: 'The week, three ways', to: '/urge-overview' },
        { title: 'Weekly report', to: `/weekly-report?week=${week}` },
        { title: 'Report ready', detail: 'The arrival card', to: `/report-ready?week=${week}` },
        { title: 'Past pledges', to: '/(app)/journal' },
      ],
    ],
    [
      'The long game',
      [
        { title: 'The library', detail: 'Twelve weeks', to: '/(app)/library' },
        { title: 'The campaign', detail: 'Four chapters', to: '/journey' },
        { title: 'Chapter I · The Landing', to: '/journey/landing' },
        { title: 'Chapter II · The Crossing', to: '/journey/crossing' },
        { title: 'Chapter III · The Highlands', to: '/journey/highlands' },
        { title: 'Chapter IV · The Watch', to: '/journey/watch' },
        { title: 'Medallions', to: '/(app)/milestones' },
        { title: 'Lessons browser', to: '/lessons-browser' },
        { title: 'A lesson · card', to: '/lesson-card/1' },
        { title: 'A lesson · reader', to: '/lesson/day/1' },
        { title: 'Life map', to: '/(app)/lifemap' },
        { title: 'Locked weeks', to: '/(app)/locked' },
      ],
    ],
    [
      'Arrivals',
      [
        { title: 'A letter arrived', to: '/mail' },
        { title: 'Read the letter', to: '/letter' },
        { title: 'Letter from week XII', to: '/letter?variant=week12' },
        { title: 'Medallion post', to: '/medallion-post' },
        { title: 'The yearly drop', to: '/drop' },
      ],
    ],
    [
      'Account & setup',
      [
        { title: 'Settings', to: '/(app)/settings' },
        { title: 'Edit profile', to: '/profile' },
        { title: 'Reminders', to: '/reminders' },
        { title: 'Morning check-in time', to: '/routines/morning-time' },
        { title: 'Nightly check-in time', to: '/routines/night-time' },
        { title: 'App lock', to: '/applock' },
        { title: 'Back Tap', to: '/backtap' },
        { title: 'Data & privacy', to: '/privacy' },
        { title: 'Notifications primer', to: '/notify-primer' },
        { title: 'Find support', to: '/(app)/support' },
      ],
    ],
    [
      'Plan',
      [
        { title: 'Paywall', detail: 'Free trial', to: '/paywall' },
        { title: 'Manage subscription', to: '/subscription' },
      ],
    ],
    [
      'Before the app',
      [
        { title: 'Cold open', detail: 'Splash · finding the waterline', to: '/' },
        { title: 'Sign in', to: '/(auth)/sign-in' },
        { title: 'Create account', to: '/(auth)/sign-up' },
        { title: 'Onboarding', detail: '26 questions', to: '/(onboarding)/welcome' },
      ],
    ],
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Grain source={noiseDark} opacity={0.07} />

      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {/* the title box is 80 tall so the first caption opens the scroll at y 80 */}
          <View style={{ height: 80 }}>
            <AppText style={[sans('600'), { position: 'absolute', left: 16, top: 16, fontSize: 27, letterSpacing: -0.2, color: '#1D1C1A' }]}>All</AppText>
            {/* one line: the box is the canvas's 80, and a second line would
                sit on top of the first caption */}
            <AppText numberOfLines={1} style={[sans('400'), { position: 'absolute', left: 16, right: 16, top: 50, fontSize: 13.5, color: colors.textSoft }]}>
              Including the ones that normally come to you
            </AppText>
          </View>

          <ScrollView contentInsetAdjustmentBehavior="never" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: tabBar + 24 }}>
            {groups.map(([header, rows]) => (
              <View key={header} style={{ marginBottom: 36 }}>
                <View style={{ height: 26, paddingHorizontal: 16 }}>
                  <AppText style={[sans('600'), { fontSize: 13, color: '#55534E' }]}>{header}</AppText>
                </View>
                <View style={{ marginHorizontal: 12, borderRadius: 16, backgroundColor: '#FFFFFF', paddingVertical: 4 }}>
                  {rows.map((row, i) => (
                    <View key={row.to}>
                      {i > 0 ? <View style={{ height: 1, marginHorizontal: 18, backgroundColor: HAIRLINE }} /> : null}
                      <PressScale
                        onPress={() => router.push(row.to as never)}
                        accessibilityRole="button"
                        accessibilityLabel={row.title}
                        style={{ height: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18 }}>
                        <AppText numberOfLines={1} style={[sans('500'), { flex: 1, fontSize: 16, color: '#1D1C1A' }]}>{row.title}</AppText>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1, gap: 10 }}>
                          {/* the note gives way before the name does — a row that can only
                              show one of the two should show what it opens */}
                          {row.detail ? (
                            <AppText numberOfLines={1} style={[sans('400'), { flexShrink: 1, fontSize: 14, color: '#8B8882' }]}>
                              {row.detail}
                            </AppText>
                          ) : null}
                          <ChevronGlyph color="#B0AEA8" />
                        </View>
                      </PressScale>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}
