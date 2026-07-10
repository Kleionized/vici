import { useRouter } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { AppText, Glyph } from '@/components/ui';
import { RD_PROTOCOLS, RD_SECTIONS } from '@/content/roughDays';
import { colors, fonts, sans, spacing } from '@/lib/theme';

// ── Rough days · the library (canvas: rd-library) — the whole book,
// grouped: the universal First-90-Seconds interrupt up top (always one
// tap away), then 29 protocols in three sections. ──

function RDGlyphIcon({ name, color, size = 19 }: { name: string; color: string; size?: number }) {
  const g = (Glyph as Record<string, (c: string) => React.ReactNode>)[name] || (Glyph as Record<string, (c: string) => React.ReactNode>).compass;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {g(color)}
    </Svg>
  );
}

export default function RoughDays() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 26, paddingBottom: 120 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Pressable
              onPress={() => (router.canGoBack() ? router.back() : router.navigate('/(app)/log'))}
              hitSlop={8}
              accessibilityLabel="Back"
              style={{ padding: 4, marginLeft: -4 }}>
              <Svg width={12} height={20} viewBox="0 0 13 22">
                <Path d="M11 2L2 11l9 9" stroke={colors.text} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </Pressable>
          </View>
          <AppText style={{ fontFamily: fonts.serifSharp, fontSize: 34, letterSpacing: 0.34, color: colors.text, marginTop: 12 }}>
            Rough days
          </AppText>
          <AppText style={[sans('400'), { fontSize: 14.5, lineHeight: 22, color: colors.textMuted, marginTop: 10 }]}>
            Open the page that matches your moment. One move at a time — no reading ahead.
          </AppText>

          {/* the universal interrupt — always first, always one tap away */}
          <Pressable
            onPress={() => router.push('/rough-first90')}
            style={({ pressed }) => ({
              marginTop: 22,
              backgroundColor: '#141414',
              borderRadius: 20,
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
              transform: [{ scale: pressed ? 0.99 : 1 }],
            })}>
            <View style={{ width: 46, height: 46, borderRadius: 9999, backgroundColor: 'rgba(245,244,241,0.1)', alignItems: 'center', justifyContent: 'center' }}>
              <RDGlyphIcon name="spark" color="#F5F4F1" size={24} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 1.9, textTransform: 'uppercase', color: 'rgba(245,244,241,0.55)' }]}>
                An urge, right now?
              </AppText>
              <AppText style={{ fontFamily: fonts.serif, fontSize: 20, color: '#F5F4F1', marginTop: 4 }}>The First 90 Seconds</AppText>
            </View>
            <Svg width={9} height={16} viewBox="0 0 9 16" fill="none">
              <Path d="M1.5 1l6 7-6 7" stroke="rgba(245,244,241,0.5)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </Pressable>

          {/* the sections */}
          {RD_SECTIONS.map((sec) => (
            <View key={sec.label} style={{ marginTop: 32 }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 4 }}>
                <AppText style={[sans('600'), { fontSize: 11, letterSpacing: 1.8, textTransform: 'uppercase', color: colors.textSoft }]}>
                  {sec.label}
                </AppText>
                <AppText style={[sans('500'), { fontSize: 12.5, color: colors.textSoft }]}>{sec.keys.length}</AppText>
              </View>
              <View style={{ backgroundColor: colors.surface, borderRadius: 20, marginTop: 10, overflow: 'hidden' }}>
                {sec.keys.map((key, i) => {
                  const p = RD_PROTOCOLS[key];
                  return (
                    <Pressable
                      key={key}
                      onPress={() => router.push({ pathname: '/rough-protocol', params: { key } })}
                      style={({ pressed }) => ({
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 14,
                        paddingVertical: 14,
                        paddingHorizontal: 18,
                        borderBottomWidth: i < sec.keys.length - 1 ? 1 : 0,
                        borderBottomColor: colors.border,
                        backgroundColor: pressed ? colors.accentSoft : 'transparent',
                      })}>
                      <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
                        <RDGlyphIcon name={p.icon} color={colors.text} />
                      </View>
                      <AppText style={[sans('500'), { flex: 1, fontSize: 15.5, color: colors.text }]}>{p.title}</AppText>
                      <Svg width={8} height={14} viewBox="0 0 8 14" fill="none">
                        <Path d="m1.5 1.5 5 5.5-5 5.5" stroke={colors.textSoft} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}

          <AppText
            center
            style={{ fontFamily: fonts.serif, fontSize: 16, lineHeight: 23, color: colors.textSoft, maxWidth: 260, alignSelf: 'center', marginTop: 34 }}>
            Nothing here resets your progress. A hard day is weather, not a verdict.
          </AppText>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
