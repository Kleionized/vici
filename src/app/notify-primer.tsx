import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { AppText, Glyph } from '@/components/ui';
import { colors, fonts, sans, spacing } from '@/lib/theme';

// ── Notification primer (canvas: screens-notify) — shows the notes
// themselves as iOS lock-screen banners, exactly as they'd arrive.
// Discretion is the promise, so it's stated. ──

const EXAMPLES: [string, string, string][] = [
  ['Morning check-in', '8:00 AM', 'Twenty seconds. How did you sleep, and where’s your head today?'],
  ['A quiet word', '10:52 PM', 'This hour is usually your hardest. One breath before the scroll.'],
  ['A good week', '6:15 PM', 'Day XXIV. You’ve ridden every wave this week.'],
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
          <Pressable onPress={close} hitSlop={10} accessibilityLabel="Close">
            <AppText style={{ fontSize: 20, color: colors.text }}>✕</AppText>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.xl }} showsVerticalScrollIndicator={false}>
          <AppText center style={{ fontFamily: fonts.serif, fontSize: 36, letterSpacing: 0.36, color: colors.text, marginBottom: 12 }}>
            Stay close
          </AppText>
          <AppText center variant="muted" style={{ fontSize: 14, lineHeight: 21, marginBottom: 26 }}>
            The hardest moments rarely happen inside the app. These are the only notes we’d send, shown exactly as they’d arrive.
          </AppText>

          <View style={{ gap: 10 }}>
            {EXAMPLES.map(([t, time, m]) => (
              <View key={t} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start', backgroundColor: colors.surface, borderRadius: 20, padding: 15, paddingVertical: 13 }}>
                <View style={{ width: 38, height: 38, borderRadius: 9.5, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
                  <Svg width={20} height={13} viewBox="0 0 34 20" fill="none">
                    <Path d="M2 11h6l2.6-8 4.4 16 2.6-8h3l1.6-3 1.6 3H32" stroke={colors.inkText} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
                    <AppText style={[sans('600'), { fontSize: 13.5, color: colors.text }]}>{t}</AppText>
                    <AppText style={[sans('500'), { fontSize: 11.5, color: colors.textSoft }]}>{time}</AppText>
                  </View>
                  <AppText style={[sans('400'), { fontSize: 13, lineHeight: 18, color: colors.textMuted, marginTop: 3 }]}>{m}</AppText>
                </View>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 20 }}>
            <View style={{ width: 14, height: 14 }}>{Glyph.lock(colors.textSoft)}</View>
            <AppText style={[sans('400'), { fontSize: 12.5, color: colors.textSoft }]}>Discreet by default. Nothing names the habit.</AppText>
          </View>
        </ScrollView>

        <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.md }}>
          <Pressable onPress={close} style={{ backgroundColor: colors.ink, borderRadius: 9999, paddingVertical: 17, alignItems: 'center' }}>
            <AppText style={[sans('600'), { fontSize: 15.5, color: colors.inkText }]}>Turn on reminders</AppText>
          </Pressable>
          <Pressable onPress={close} hitSlop={8} style={{ alignItems: 'center', paddingVertical: spacing.md }}>
            <AppText style={[sans('500'), { fontSize: 15, color: colors.textMuted }]}>Not now</AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
