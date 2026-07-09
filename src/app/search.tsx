import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Glyph, type GlyphName, SectionLabel } from '@/components/ui';
import { CATEGORY_LABEL } from '@/lib/labels';
import { useLessons } from '@/lib/backend';
import type { LessonCategory } from '@/lib/types';
import { colors, fonts, spacing } from '@/lib/theme';

const RECENT = ['urge', 'shame', 'sleep'];
const CAT_GLYPH: Record<LessonCategory, GlyphName> = {
  motivation: 'spark',
  physiological: 'moon',
  environmental: 'leaf',
  psychological: 'compass',
  existential: 'anchor',
  social: 'heart',
  psychiatric: 'shield',
  meta: 'book',
};

export default function Search() {
  const router = useRouter();
  const lessons = useLessons();
  const [q, setQ] = useState('');
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/weeks'));

  const results = useMemo(() => {
    const all = lessons ?? [];
    const needle = q.trim().toLowerCase();
    if (!needle) return all;
    return all.filter(
      (l) =>
        l.title.toLowerCase().includes(needle) ||
        CATEGORY_LABEL[l.category].toLowerCase().includes(needle) ||
        l.approachTags.some((t) => t.toLowerCase().includes(needle)),
    );
  }, [lessons, q]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {/* search bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.md }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: 9999, paddingHorizontal: 18, paddingVertical: 12 }}>
            {Glyph.search(colors.text)}
            <TextInput
              value={q}
              onChangeText={setQ}
              autoFocus
              placeholder="Search lessons & practices"
              placeholderTextColor={colors.textSoft}
              style={{ flex: 1, fontFamily: fonts.body, fontSize: 15, color: colors.text, padding: 0 }}
            />
          </View>
          <Pressable onPress={back} hitSlop={8}>
            <AppText weightOverride="600" style={{ fontSize: 16 }}>
              Cancel
            </AppText>
          </Pressable>
        </View>

        {/* recent chips */}
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', paddingHorizontal: spacing.xl, paddingBottom: spacing.md }}>
          {RECENT.map((r) => (
            <Pressable key={r} onPress={() => setQ(r)} style={{ backgroundColor: colors.surface, borderRadius: 9999, paddingHorizontal: 14, paddingVertical: 8 }}>
              <AppText weightOverride="600" style={{ fontSize: 13.5, color: colors.textMuted }}>
                {r}
              </AppText>
            </Pressable>
          ))}
        </View>

        <SectionLabel style={{ paddingHorizontal: 24, paddingBottom: spacing.md }}>
          {`${results.length} result${results.length === 1 ? '' : 's'}`}
        </SectionLabel>

        <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, gap: 11 }} keyboardShouldPersistTaps="handled">
          {results.map((l) => (
            <Pressable key={l.slug} onPress={() => router.push(`/lesson/${l.slug}`)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, borderRadius: 18, padding: 14 }}>
                <View style={{ width: 46, height: 46, borderRadius: 13, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
                  {Glyph[CAT_GLYPH[l.category]](colors.text)}
                </View>
                <View style={{ flex: 1 }}>
                  <SectionLabel size={10.5} style={{ marginBottom: 3 }}>
                    {CATEGORY_LABEL[l.category]}
                  </SectionLabel>
                  <AppText weightOverride="500" style={{ fontSize: 14.5, lineHeight: 18 }}>
                    {l.title}
                  </AppText>
                  <AppText variant="muted" weightOverride="500" style={{ fontSize: 13, marginTop: 2 }}>
                    Week {l.week}
                    {l.estimatedMinutes ? ` · ${l.estimatedMinutes} min` : ''}
                  </AppText>
                </View>
                {Glyph.chevR(colors.textSoft)}
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
