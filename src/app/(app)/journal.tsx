import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTabBarHeight } from '@/components/StoicTabBar';
import { AppText, BackGlyph, LoadingView, PressScale } from '@/components/ui';
import { useJournalEntries } from '@/lib/backend';
import { colors, fonts, sans } from '@/lib/theme';

/**
 * Past pledges — what Today's "Past pledges ›" opens onto.
 *
 * The canvas draws no frame for this, so it is built in the canvas's own list
 * idiom: the 27pt title at 16/16, a captioned group, flat white cards 12 in
 * from both edges. It used to carry a serif hero, a dead search field and an
 * invented empty state ("Nothing logged yet. The page is patient." over a quote
 * glyph, with a Write-the-first-line button) — all of it furniture rather than
 * anything the record actually holds, and all of it now gone. An empty list
 * says it is empty in one line and stops there.
 */

const noiseDark = require('../../../assets/images/noise-dark.png');

/** "Today · 8:12 AM" / "Mon · 7:05 AM" for an entry timestamp. */
function entryDate(ts: number): string {
  const d = new Date(ts);
  const today = new Date();
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((startOf(today) - startOf(d)) / 86400000);
  const day = days === 0 ? 'Today' : days === 1 ? 'Yesterday' : d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  return `${day} · ${d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`;
}

export default function Journal() {
  const router = useRouter();
  const entries = useJournalEntries();
  const tabBar = useTabBarHeight();

  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.07 }} pointerEvents="none" />

      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ height: 96 }}>
            <PressScale
              onPress={back}
              accessibilityRole="button"
              accessibilityLabel="Back"
              hitSlop={{ top: 16, bottom: 16, left: 20, right: 20 }}
              style={{ position: 'absolute', left: 16, top: 10, minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
              <BackGlyph color="#55534E" />
              <AppText style={[sans('400'), { fontSize: 17, color: '#55534E' }]}>Back</AppText>
            </PressScale>
            <AppText style={[sans('600'), { position: 'absolute', left: 16, top: 52, fontSize: 27, letterSpacing: -0.2, color: '#1D1C1A' }]}>Past pledges</AppText>
          </View>

          {entries === undefined ? (
            <LoadingView />
          ) : (
            <ScrollView contentInsetAdjustmentBehavior="never" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: tabBar + 24 }}>
              {entries.length === 0 ? (
                <AppText style={[sans('400'), { paddingHorizontal: 16, fontSize: 13.5, color: colors.textSoft }]}>Nothing here yet.</AppText>
              ) : (
                <View style={{ marginHorizontal: 12, gap: 10 }}>
                  {entries.map((e) => (
                    <PressScale
                      key={e._id}
                      onPress={() => router.push({ pathname: '/journal-new', params: { id: e._id } })}
                      accessibilityRole="button"
                      accessibilityLabel={e.title || 'Entry'}
                      style={{ borderRadius: 16, backgroundColor: '#FFFFFF', paddingHorizontal: 18, paddingTop: 14, paddingBottom: 16 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <AppText style={[sans('500'), { fontSize: 12.5, color: '#8B8882' }]}>{entryDate(e.createdAt)}</AppText>
                        <AppText style={[sans('600'), { fontSize: 11, letterSpacing: 0.5, color: '#8B8882' }]}>{e.tag.toUpperCase()}</AppText>
                      </View>
                      {/* the pledge is a written line, so it keeps the canvas's Georgia */}
                      <AppText numberOfLines={3} style={{ marginTop: 8, fontFamily: fonts.quote, fontSize: 16, lineHeight: 24, color: '#1D1C1A' }}>
                        {e.body || e.title || 'Untitled'}
                      </AppText>
                    </PressScale>
                  ))}
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
