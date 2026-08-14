import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Glyph, Laurel, PressScale } from '@/components/ui';
import { colors, sans, spacing } from '@/lib/theme';

// ── Notification primer (canvas: screens-notify) — shows the notes
// themselves as iOS lock-screen banners, exactly as they'd arrive.
// Discretion is the promise, so it's stated. ──

const EXAMPLES: [string, string, string][] = [
  ['Morning check-in', 'now', 'Twenty seconds — where’s your head at today?'],
  ['Late night ahead', '10:41 PM', 'Your risky window. The wave tool is one tap away.'],
];

export default function NotifPrimer() {
  const router = useRouter();
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {/* dashed progress + close */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.md }}>
          <View style={{ flex: 1, flexDirection: 'row', gap: 7 }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <View key={i} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: i < 8 ? colors.ink : colors.borderStrong }} />
            ))}
          </View>
          <PressScale onPress={close} hitSlop={10} accessibilityLabel="Close" style={{ width: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
            <AppText style={{ fontSize: 20, color: colors.text }}>✕</AppText>
          </PressScale>
        </View>

        <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingHorizontal: spacing.xl }} showsVerticalScrollIndicator={false}>
          <AppText center style={[sans('500'), { fontSize: 22, lineHeight: 29, letterSpacing: 0.1, color: colors.text, marginTop: 34, marginBottom: 18 }]}>
            A gentle nudge.
          </AppText>
          <AppText center style={[sans('400'), { fontSize: 15.5, lineHeight: 23, color: colors.textMuted, marginBottom: 34, paddingHorizontal: 6 }]}>
            Two nudges a day, timed to your risky window. Nothing noisy, nothing shaming.
          </AppText>

          {/* the notes themselves — the second sits back, as it hasn't landed yet */}
          <View style={{ gap: 16 }}>
            {EXAMPLES.map(([t, time, m], index) => (
              <View
                key={t}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  borderCurve: 'continuous',
                  paddingHorizontal: 18,
                  paddingVertical: 16,
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.09)',
                  opacity: index === 0 ? 1 : 0.55,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Laurel size={24} color={colors.textMuted} muted />
                  <AppText style={[sans('600'), { flex: 1, fontSize: 15.5, color: colors.text }]}>{t}</AppText>
                  <AppText style={[sans('500'), { fontSize: 12.5, color: colors.textSoft }]}>{time}</AppText>
                </View>
                <AppText style={[sans('400'), { marginTop: 8, fontSize: 14.5, lineHeight: 21, color: colors.textMuted }]}>{m}</AppText>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 20 }}>
            <View style={{ width: 14, height: 14 }}>{Glyph.lock(colors.textSoft)}</View>
            <AppText style={[sans('400'), { fontSize: 12.5, color: colors.textSoft }]}>Discreet by default. Nothing names the habit.</AppText>
          </View>
        </ScrollView>

        <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.md }}>
          <PressScale onPress={close} style={{ minHeight: 58, backgroundColor: colors.ink, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' }}>
            <AppText style={[sans('600'), { fontSize: 17, letterSpacing: 0.3, color: '#FFFFFF' }]}>Turn on reminders</AppText>
          </PressScale>
          <PressScale onPress={close} hitSlop={8} style={{ minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
            <AppText style={[sans('500'), { fontSize: 15, color: colors.textMuted }]}>Not now</AppText>
          </PressScale>
        </View>
      </SafeAreaView>
    </View>
  );
}
