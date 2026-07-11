import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AppText, Card, Glyph, type GlyphName, LoadingView, Screen, ScreenHeader } from '@/components/ui';
import { useJournalEntries } from '@/lib/backend';
import { colors, fonts, sans, spacing } from '@/lib/theme';

const TAG_GLYPH: Record<string, GlyphName> = { Reflection: 'spark', Urge: 'wave', Lesson: 'book' };

/** Relative "Today · 8:12 AM" / "Mon · 7:05 AM" label for an entry timestamp. */
function entryDate(ts: number): string {
  const d = new Date(ts);
  const today = new Date();
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((startOf(today) - startOf(d)) / 86400000);
  const day = days === 0 ? 'Today' : days === 1 ? 'Yesterday' : d.toLocaleDateString(undefined, { weekday: 'short' });
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${day} · ${time}`;
}

export default function Journal() {
  const router = useRouter();
  const entries = useJournalEntries();

  return (
    <Screen contentStyle={{ paddingTop: spacing.xl, gap: spacing.md }}>
      <ScreenHeader
        hue={150}
        eyebrow="Your practice"
        title="Journal"
        pad={0}
        trailing={
          <Pressable
            onPress={() => router.push('/journal-new')}
            accessibilityLabel="New entry"
            style={{ width: 44, height: 44, borderRadius: 9999, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={20} height={20} viewBox="0 0 24 24">
              <Path d="M12 4v16M4 12h16" stroke={colors.accentText} strokeWidth={2.4} strokeLinecap="round" />
            </Svg>
          </Pressable>
        }
      />

      {/* search */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: 9999, paddingHorizontal: 18, paddingVertical: 13, marginBottom: spacing.sm }}>
        {Glyph.search(colors.textSoft)}
        <AppText weightOverride="500" style={{ fontSize: 16, color: colors.textSoft }}>
          Search your entries
        </AppText>
      </View>

      {entries === undefined ? (
        <LoadingView />
      ) : entries.length === 0 ? (
        <View style={{ alignItems: 'center', paddingTop: spacing.xxxl, paddingHorizontal: spacing.xl }}>
          <AppText style={{ fontFamily: fonts.serifSharp, fontSize: 52, lineHeight: 42, color: colors.textSofter }}>“</AppText>
          <AppText center style={{ fontFamily: fonts.serif, fontSize: 22, lineHeight: 29, color: colors.text, maxWidth: 240, marginTop: 10 }}>
            Nothing logged yet. The page is patient.
          </AppText>
          <Pressable
            onPress={() => router.push('/journal-new')}
            style={{ marginTop: 22, borderWidth: 1.4, borderColor: colors.borderStrong, borderRadius: 9999, paddingVertical: 11, paddingHorizontal: 22 }}>
            <AppText style={[sans('600'), { fontSize: 13.5, color: colors.text }]}>Write the first line</AppText>
          </Pressable>
        </View>
      ) : (
        entries.map((e) => (
          <Pressable key={e._id} onPress={() => router.push({ pathname: '/journal-new', params: { id: e._id } })}>
            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
                <AppText style={[sans('500'), { fontSize: 13, color: colors.textSoft }]}>
                  {entryDate(e.createdAt)}
                </AppText>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.accentSoft, borderRadius: 9999, paddingVertical: 4, paddingLeft: 7, paddingRight: 9 }}>
                  <View style={{ width: 13, height: 13 }}>{Glyph[TAG_GLYPH[e.tag] ?? 'pen'](colors.textMuted)}</View>
                  <AppText style={[sans('500'), { fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', color: colors.textMuted }]}>
                    {e.tag}
                  </AppText>
                </View>
              </View>
              <AppText style={{ fontFamily: fonts.serif, fontSize: 19.5, letterSpacing: 0.1, marginBottom: 5, color: colors.text }}>
                {e.title || 'Untitled'}
              </AppText>
              {e.body ? (
                <AppText variant="muted" numberOfLines={2} style={{ fontSize: 14.5, lineHeight: 21 }}>
                  {e.body}
                </AppText>
              ) : null}
            </Card>
          </Pressable>
        ))
      )}
    </Screen>
  );
}
