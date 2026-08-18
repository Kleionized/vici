import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTabBarHeight } from '@/components/StoicTabBar';
import { WeekBoard, weekBoardHeight } from '@/components/library/WeekBoard';
import { Grain } from '@/components/ui';
import { CURRICULUM_84 } from '@/content/curriculum84';
import { useCurrentUser } from '@/lib/backend';

/**
 * The Library tab — the twelve weeks, Reset through Leave It Behind.
 *
 * The canvas draws each week as its own board and each board twice, at two
 * scroll positions. Here they run end to end down one scroll, every board at
 * its natural height so all seven of its lessons stand rather than hiding
 * behind an inner scroller — the same treatment the journey chapters get, and
 * the reason a board's pieces live in `components/library/WeekBoard` rather
 * than in the pushed `/week/[week]` route.
 *
 * The Back row every week frame carries belongs to that pushed route, not here:
 * a tab has nowhere to go back to.
 *
 * The campaign and its four chapters have not moved — they are still at
 * `/journey/[chapter]`, and `All` lists them.
 */

const noiseDark = require('../../../assets/images/noise-dark.png');

export default function Library() {
  const user = useCurrentUser();
  const tabBar = useTabBarHeight();

  // Day one is the day they signed up, not the day after. Read once on mount so
  // a re-render cannot move the current row under the reader.
  const [now] = useState(() => Date.now());
  const day = user?.createdAt ? Math.max(1, Math.floor((now - user.createdAt) / 86_400_000) + 1) : 1;

  // Every week is seven lessons, so every board is the same height — which is
  // what lets the list window rather than mount twelve scenes at once.
  const boardH = weekBoardHeight(7);

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <StatusBar style="dark" />
      <Grain source={noiseDark} opacity={0.07} />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <FlatList
          data={CURRICULUM_84}
          keyExtractor={(week) => String(week.n)}
          renderItem={({ item }) => <WeekBoard week={item} day={day} />}
          getItemLayout={(_, index) => ({ length: boardH, offset: boardH * index, index })}
          initialNumToRender={2}
          windowSize={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: tabBar }}
        />
      </SafeAreaView>
    </View>
  );
}
