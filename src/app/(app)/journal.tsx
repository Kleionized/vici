import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Card, EmptyState, LoadingView, MonoText, NavBar, Screen } from '@/components/mono';
import { useJournalEntries } from '@/lib/backend';
import { WEEKDAYS_SHORT, clockTime, shortDate } from '@/lib/format';
import { mono, sans } from '@/lib/theme';

/**
 * Past pledges — what Today III's ☆ opens onto (and the review drawer's
 * "Past pledges"). No frame draws it, so it takes the title-head pages' idiom
 * (Medallions, Your log): the back chevron at 60, the 32/700 title at 108, and
 * the entries as the frames' `#1E1E1E` r24 cards in the 24 gutter, the whole
 * page scrolling under the fixed nav (D320). Each card is the entry's day and
 * time beside its tag in the caps line, then the line itself in the task
 * sentence's 17/700 ink. A tap opens it in the editor, as before. An empty list
 * says so in its one existing line.
 */

/** "Today · 8:12 AM" / "Mon, Jul 14 · 7:05 AM" for an entry timestamp. */
function entryDate(ts: number): string {
  const d = new Date(ts);
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((startOf(new Date()) - startOf(d)) / 86_400_000);
  const day = days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${WEEKDAYS_SHORT[d.getDay()]}, ${shortDate(d)}`;
  return `${day} · ${clockTime(d)}`;
}

export default function Journal() {
  const router = useRouter();
  const entries = useJournalEntries();

  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  if (entries === undefined) return <LoadingView onBack={back} />;

  return (
    <Screen>
      <NavBar left="back" onBack={back} />
      <View style={{ position: 'absolute', left: 0, right: 0, top: 100, bottom: 0 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8, paddingHorizontal: 24, paddingBottom: 48 }}>
          <MonoText v="titlePage">Past pledges</MonoText>
          {entries.length === 0 ? (
            <EmptyState body="Nothing here yet." style={{ paddingHorizontal: 0 }} />
          ) : (
            <View style={{ marginTop: 24, gap: 12 }}>
              {entries.map((e) => (
                <Card
                  key={e._id}
                  padding={[18, 20]}
                  onPress={() => router.push({ pathname: '/journal-new', params: { id: e._id } })}
                  accessibilityLabel={e.title || 'Entry'}
                  style={{ gap: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <MonoText v="caps">{entryDate(e.createdAt)}</MonoText>
                    <MonoText v="caps">{e.tag}</MonoText>
                  </View>
                  <MonoText v="p" wrap="pretty" numberOfLines={3} style={{ ...sans('700'), fontSize: 17, lineHeight: 24, letterSpacing: -0.4, color: mono.ink }}>
                    {e.body || e.title || 'Untitled'}
                  </MonoText>
                </Card>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Screen>
  );
}

