import { Redirect, useRouter } from 'expo-router';
import { View } from 'react-native';

import { MonoText, NavBar, Row, RowGroup, Screen, ScrollRegion } from '@/components/mono';
import { FORCE_MOCK } from '@/lib/config';
import { toDateKey } from '@/lib/date';
import { latestCompletedWeek, mondayOf } from '@/lib/weeklyReport';
import { useCurrentUser } from '@/lib/backend';
import { mono } from '@/lib/theme';

/**
 * All — every screen in the app, reachable.
 *
 * Not a canvas frame. Most of what this app can show arrives on its own terms:
 * the weekly report is pushed the launch after a week closes, the letter the
 * launch after a slip, the drop once a year. That is right for the product and
 * useless for looking at the work, so this is the drawer they all live in. It
 * left the tab bar with the canvas's five items; its door is a long press on
 * the Today tab in mock and dev builds (D385), so it carries its own way back.
 *
 * Built in the Settings idiom, which is the canvas's own list treatment: the
 * nav row, a 32/38 page title and its line, then captioned groups of 54 rows
 * (`gap 18`) whose notes ellipsise before the names do. The whole column
 * scrolls under the fixed nav (D320).
 */

type Entry = { title: string; detail?: string; to: string };

/**
 * The drawer exists for the preview and development builds only — the same
 * rule as its long-press door (`DRAWER_DOOR`, TabBar.tsx). A release build
 * still registers the route, so a `tideline://all` link would have opened it;
 * there it goes to `/` instead (U2, D483).
 */
const DRAWER_OPEN = FORCE_MOCK || __DEV__;

export default function All() {
  if (!DRAWER_OPEN) return <Redirect href="/" />;
  return <AllDrawer />;
}

function AllDrawer() {
  const router = useRouter();
  const user = useCurrentUser();
  const back = () => (router.canGoBack() ? router.back() : router.navigate('/(app)/today'));

  // The report needs something real to open onto; a hub that pushes a route
  // with no params lands on an empty screen and reads as a bug rather than as a
  // screen you have not earned yet. An account under a week old has no completed
  // week, so fall back to last Monday — the report will be thin, but it is a
  // real week rather than a missing param.
  const lastMonday = toDateKey(new Date(mondayOf(new Date()).getTime() - 7 * 86_400_000));
  const week = (user?.createdAt ? latestCompletedWeek(user.createdAt) : null) ?? lastMonday;

  const groups: [string, Entry[]][] = [
    [
      'Daily',
      [
        { title: 'Today', to: '/(app)/today' },
        { title: 'Morning check-in', detail: '6 steps', to: '/day/morning' },
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
        { title: 'Urge hub', detail: 'Ride it out — five panes', to: '/urge-hub' },
        { title: 'The first 90 seconds', to: '/rough-first90' },
        { title: 'Rough days', detail: 'Seven moods, three moves each', to: '/(app)/rough-days' },
        { title: 'A rough-day protocol', to: '/rough-protocol?key=loneliness' },
        { title: 'Log an urge', to: '/urge-log' },
        { title: 'Log a lapse', to: '/lapse' },
        { title: 'Log chooser', detail: 'The three cards, outside the tab bar', to: '/log-chooser' },
        { title: 'After a slip', to: '/relapse' },
        { title: 'Post-slip flow', detail: 'It happened → begin again', to: '/slip' },
      ],
    ],
    [
      'Looking back',
      [
        { title: 'The log', to: '/(app)/log' },
        { title: 'Recovery rating', to: '/score' },
        { title: 'Insights', detail: 'Mood, urges, triggers', to: '/(app)/dashboard' },
        { title: 'Urge overview', detail: 'The week, three ways', to: '/urge-overview' },
        { title: 'Weekly report', to: `/weekly-report?week=${week}` },
        { title: 'Report ready', detail: 'The arrival card', to: `/report-ready?week=${week}` },
        { title: 'Journal', detail: 'Pledges, vows, reflections, letters', to: '/(app)/journal' },
        { title: 'Write a pledge', to: '/journal-new' },
        { title: 'Search', to: '/search' },
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
        { title: 'A week · board', to: '/week/1' },
        { title: "A day's task", to: '/task/1' },
        { title: 'A medallion · detail', to: '/medallions/vici' },
        { title: 'A medallion · tier ladder', to: '/medallions/tiers/vici' },
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
        { title: 'Your vow', to: '/vow' },
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
        { title: 'Cold open', detail: 'Splash · opening VICI', to: '/' },
        { title: 'Sign in', to: '/(auth)/sign-in' },
        { title: 'Create account', to: '/(auth)/sign-up' },
        { title: 'Welcome back', detail: 'The returning door', to: '/(auth)/welcome-back' },
        { title: 'Splash', to: '/(auth)/splash' },
        { title: 'Onboarding', detail: '26 questions', to: '/(onboarding)/welcome' },
      ],
    ],
  ];

  return (
    <Screen>
      <NavBar left="back" right="empty" onBack={back} />

      <ScrollRegion top={100} contentStyle={{ paddingTop: 8, paddingHorizontal: 24, paddingBottom: 48, gap: 18 }}>
        <View style={{ gap: 6 }}>
          <MonoText v="titlePage">All</MonoText>
          <MonoText v="p" color={mono.mute} style={{ fontSize: 14, lineHeight: 20 }}>
            Including the ones that normally come to you
          </MonoText>
        </View>
        {groups.map(([header, rows]) => (
          <RowGroup key={header} label={header}>
            {/* the note gives way before the name does — a row that can only show
                one of the two should show what it opens */}
            {rows.map((row) => (
              <Row key={row.to} label={row.title} value={row.detail} valueLines={1} onPress={() => router.push(row.to as never)} accessibilityLabel={row.title} />
            ))}
          </RowGroup>
        ))}
      </ScrollRegion>
    </Screen>
  );
}
