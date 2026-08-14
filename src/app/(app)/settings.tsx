import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { ScrollView, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTabBarHeight } from '@/components/StoicTabBar';
import { AppText, ChevronGlyph, LoadingView, PressScale } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { useCurrentUser, useUpdateSettings } from '@/lib/backend';
import { formatTime, useRoutines } from '@/lib/routines';
import { colors, sans } from '@/lib/theme';

/**
 * 039 · Settings — a left-set title with a plain "Done", then captioned groups
 * of flat paper cards. No icon chips: the canvas list is a sentence and a
 * chevron, nothing more.
 *
 * Geometry is the canvas's 393 × 852 frame with the 54px status bar taken off:
 * the title sits at y 16, the first caption at 80, every caption stands exactly
 * 26 above its card, and the cards run 12 in from both edges.
 *
 * The canvas draws four groups; the app has more places to go than the frame
 * shows, so Check-ins, Security and Plan follow the Anchors card in the same
 * idiom — dropping them would strand /applock, /privacy and /subscription.
 */

const noiseDark = require('../../../assets/images/noise-dark.png');

const HAIRLINE = 'rgba(0,0,0,0.06)';

export default function Settings() {
  const router = useRouter();
  const { email, displayName, signOut } = useAuth();
  const user = useCurrentUser();
  const updateSettings = useUpdateSettings();
  const routines = useRoutines();
  // Settings is a Tabs.Screen, so the bar floats over it: the scroll has to be
  // able to clear the last card of it rather than ending underneath.
  const tabBar = useTabBarHeight();

  const done = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  if (user === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <LoadingView />
      </View>
    );
  }

  const name = displayName || user?.displayName || 'You';
  const premium = !!user?.settings.premium;
  const showStreak = !!user?.settings.showStreak;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.07 }} pointerEvents="none" />

      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        {/* the title box is 80 tall so the first caption opens the scroll at y 80 */}
        <View style={{ height: 80 }}>
          <AppText style={[sans('600'), { position: 'absolute', left: 16, top: 16, fontSize: 27, letterSpacing: -0.2, color: '#1D1C1A' }]}>Settings</AppText>
          <PressScale
            onPress={done}
            accessibilityRole="button"
            accessibilityLabel="Done"
            hitSlop={{ top: 16, bottom: 16, left: 20, right: 20 }}
            style={{ position: 'absolute', right: 16, top: 24, minHeight: 0 }}>
            <AppText style={[sans('400'), { fontSize: 17, color: '#3A3934' }]}>Done</AppText>
          </PressScale>
        </View>

        <ScrollView contentInsetAdjustmentBehavior="never" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: tabBar }}>
          <Section header="Progress">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16, paddingHorizontal: 18 }}>
              <AppText style={[sans('500'), { flex: 1, fontSize: 16, color: '#1D1C1A' }]}>{'Show a "days since" number'}</AppText>
              <PressScale
                onPress={() => void updateSettings({ showStreak: !showStreak })}
                accessibilityRole="switch"
                accessibilityLabel="Show a days since number"
                accessibilityState={{ checked: showStreak }}
                hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
                style={{ minHeight: 0 }}>
                <Toggle on={showStreak} />
              </PressScale>
            </View>
          </Section>

          <Section header="Daily reminder">
            <PressScale
              onPress={() => router.push('/reminders')}
              accessibilityRole="button"
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 18 }}>
              <AppText style={[sans('500'), { flex: 1, fontSize: 16, color: '#1D1C1A' }]}>Reminder time</AppText>
              <View style={{ height: 32, borderRadius: 16, backgroundColor: '#EDECE7', paddingHorizontal: 14, justifyContent: 'center' }}>
                <AppText style={[sans('600'), { fontSize: 15, color: '#1D1C1A' }]}>{user?.settings.reminderTime || 'Off'}</AppText>
              </View>
            </PressScale>
          </Section>

          <Section header="Anchors" card={{ paddingVertical: 4 }}>
            <Row title="Edit your Life Map" onPress={() => router.push('/lifemap')} />
            <Divider />
            <Row title="Find support" onPress={() => router.push('/(app)/support')} />
            <Divider />
            <Row title="Medallions" onPress={() => router.push('/milestones')} />
            <Divider />
            <Row title="Open urge surf with a Back Tap" onPress={() => router.push('/backtap')} />
          </Section>

          <Section header="Check-ins" card={{ paddingVertical: 4 }}>
            <Row title="Morning check-in" detail={formatTime(routines.morning)} onPress={() => router.push('/routines/morning-time')} />
            <Divider />
            <Row title="Nightly check-in" detail={formatTime(routines.night)} onPress={() => router.push('/routines/night-time')} />
          </Section>

          <Section header="Security & privacy" card={{ paddingVertical: 4 }}>
            <Row title="App lock · Face ID" onPress={() => router.push('/applock')} />
            <Divider />
            <Row title="Data & privacy" onPress={() => router.push('/privacy')} />
          </Section>

          {/* the canvas measures 28 between the last card and the Account caption */}
          <Section header="Plan" gap={28} card={{ paddingVertical: 4 }}>
            {premium ? (
              <Row title="Manage subscription" detail="VICI Plus" onPress={() => router.push('/subscription')} />
            ) : (
              <>
                <Row title="Go premium" detail="VICI Plus" onPress={() => router.push('/paywall')} />
                <Divider />
                <Row title="Manage subscription" onPress={() => router.push('/subscription')} />
              </>
            )}
          </Section>

          <Section header="Account" gap={0} card={{ paddingTop: 6, paddingBottom: 14, paddingHorizontal: 18 }}>
            <AccountLine label="Name" value={name} onPress={() => router.push('/profile')} />
            {/* the record's hairline runs the padded width, not the card's */}
            <View style={{ height: 1, backgroundColor: HAIRLINE }} />
            <AccountLine label="Email" value={email ?? 'On this device'} />
            <PressScale
              onPress={async () => {
                await signOut();
                router.replace('/');
              }}
              accessibilityRole="button"
              hitSlop={{ top: 8, bottom: 8, left: 0, right: 0 }}
              style={{ minHeight: 0, marginTop: 8, height: 42, borderRadius: 21, backgroundColor: '#F4F3F0', boxShadow: '0 0 0 1.5px rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center' }}>
              <AppText style={[sans('600'), { fontSize: 15, color: '#55534E' }]}>Sign out</AppText>
            </PressScale>
          </Section>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/**
 * A captioned group. The caption box is exactly 26 tall, which is the canvas's
 * caption-top to card-top distance, so the card needs no margin of its own.
 */
function Section({ header, gap = 36, card, children }: { header: string; gap?: number; card?: ViewStyle; children: ReactNode }) {
  return (
    <View style={{ marginBottom: gap }}>
      <View style={{ height: 26, paddingHorizontal: 16 }}>
        <AppText style={[sans('600'), { fontSize: 13, color: '#55534E' }]}>{header}</AppText>
      </View>
      <View style={[{ marginHorizontal: 12, borderRadius: 16, backgroundColor: '#FFFFFF' }, card]}>{children}</View>
    </View>
  );
}

/** A list row — 52 tall on this screen, with the value set small and soft. */
function Row({ title, detail, onPress }: { title: string; detail?: string; onPress?: () => void }) {
  return (
    <PressScale onPress={onPress} disabled={!onPress} accessibilityRole={onPress ? 'button' : undefined} style={{ height: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18 }}>
      <AppText style={[sans('500'), { flex: 1, fontSize: 16, color: '#1D1C1A' }]}>{title}</AppText>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {detail ? <AppText style={[sans('400'), { fontSize: 14, color: '#8B8882' }]}>{detail}</AppText> : null}
        <ChevronGlyph color="#B0AEA8" />
      </View>
    </PressScale>
  );
}

/** The hairline stops 18 short of both card edges. */
function Divider() {
  return <View style={{ height: 1, marginHorizontal: 18, backgroundColor: HAIRLINE }} />;
}

/** The pill switch: 44 × 26 with a 20px knob inset 3 (canvas). */
function Toggle({ on }: { on: boolean }) {
  return (
    <View style={{ width: 44, height: 26, borderRadius: 13, backgroundColor: on ? '#131313' : colors.borderStrong }}>
      {/* the canvas never draws the off state — it borrows the app's resting track */}
      <View style={{ position: 'absolute', top: 3, left: on ? undefined : 3, right: on ? 3 : undefined, width: 20, height: 20, borderRadius: 10, backgroundColor: on ? '#ffffff' : '#F2F2EE' }} />
    </View>
  );
}

/** Account reads as a record rather than a list: a label, its value, no chevron. */
function AccountLine({ label, value, onPress }: { label: string; value: string; onPress?: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={{ height: 40, minHeight: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <AppText style={[sans('400'), { fontSize: 15, color: '#55534E' }]}>{label}</AppText>
      <AppText style={[sans('600'), { flexShrink: 1, fontSize: 15, color: '#1D1C1A' }]}>{value}</AppText>
    </PressScale>
  );
}
