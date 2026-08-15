import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTabBarHeight } from '@/components/StoicTabBar';
import { AppText, BackGlyph, ChevronGlyph, LoadingView, PressScale } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { useCurrentUser } from '@/lib/backend';
import { formatTime, useRoutines } from '@/lib/routines';
import { colors, sans } from '@/lib/theme';

/**
 * 92 · Settings — a back row, a left-set title, then four captioned groups of
 * flat paper cards. No icon chips: the canvas list is a sentence and a chevron,
 * nothing more.
 *
 * Geometry is the canvas's 393 × 852 frame with the 54px status bar taken off:
 * back at 10, title at 60, the first caption at 104, every caption exactly 26
 * above its card, and the cards 12 in from both edges. Row height is per group,
 * not global — 52 / 48 / 50 / 46 — and the gap between groups is 21, except the
 * 20 the canvas leaves between Anchors and Privacy.
 *
 * `UI Final` cut the seven groups the previous canvas drew down to four. See
 * DECISIONS D-024 for what that strands and what was kept anyway.
 */

const noiseDark = require('../../../assets/images/noise-dark.png');

const HAIRLINE = 'rgba(0,0,0,0.06)';

export default function Settings() {
  const router = useRouter();
  const { email, signOut } = useAuth();
  const user = useCurrentUser();
  const routines = useRoutines();
  // Settings is a Tabs.Screen, so the bar floats over it: the scroll has to be
  // able to clear the last card of it rather than ending underneath.
  const tabBar = useTabBarHeight();
  const [signOutOpen, setSignOutOpen] = useState(false);

  const done = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  if (user === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <LoadingView />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Image source={noiseDark} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.07 }} pointerEvents="none" />

      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        {/* canvas 64 and 114 — the header block runs to the first caption at 104 */}
        <View style={{ height: 104 }}>
          <PressScale
            onPress={done}
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 24 }}
            style={{ position: 'absolute', left: 16, top: 10, minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
            <BackGlyph color="#55534E" />
            <AppText style={[sans('400'), { fontSize: 17, color: '#55534E' }]}>Back</AppText>
          </PressScale>
          <AppText style={[sans('600'), { position: 'absolute', left: 16, top: 60, fontSize: 27, letterSpacing: -0.2, color: '#1D1C1A' }]}>Settings</AppText>
        </View>

        <ScrollView contentInsetAdjustmentBehavior="never" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: tabBar }}>
          <Section header="Reminders">
            <Row height={52} title="Morning check-in" pill={formatTime(routines.morning)} onPress={() => router.push('/routines/morning-time')} />
            <Divider />
            <Row height={52} title="Night check-in" pill={formatTime(routines.night)} onPress={() => router.push('/routines/night-time')} />
          </Section>

          <Section header="Anchors">
            <Row height={48} title="Your vow" onPress={() => router.push('/vow')} />
            <Divider />
            <Row height={48} title="Your letter" detail="Opens Week XII" onPress={() => router.push('/letter?variant=week12')} />
            <Divider />
            <Row height={48} title="Weekly reports" detail="Every Sunday" onPress={() => router.push('/weekly-report')} />
          </Section>

          {/* the canvas leaves 20 here, not the 21 it leaves elsewhere */}
          <Section header="Privacy" gap={20}>
            <Row height={50} title="App lock" detail="Face ID" onPress={() => router.push('/applock')} />
            <Divider />
            <Row height={50} title="Data & privacy" onPress={() => router.push('/privacy')} />
            <Divider />
            {/* Not on the canvas. Hard product invariant #5 requires a standing
                route to crisis help and UI Final draws none anywhere, so the
                row stays rather than stranding /support (DECISIONS D-024). */}
            <Row height={50} title="Find support" onPress={() => router.push('/(app)/support')} />
          </Section>

          <Section header="Account" gap={0}>
            <Row height={46} title="Edit profile" onPress={() => router.push('/profile')} />
            <Divider />
            <Row height={46} title="Manage subscription" onPress={() => router.push('/subscription')} />
            <Divider />
            {/* 44 tall, no background and no ring — a text link, not a pill */}
            <PressScale
              onPress={() => setSignOutOpen(true)}
              accessibilityRole="button"
              style={{ height: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
              <AppText style={[sans('600'), { fontSize: 15.5, color: '#8B8882' }]}>Sign out</AppText>
            </PressScale>
          </Section>
        </ScrollView>
      </SafeAreaView>

      <SignOutSheet
        open={signOutOpen}
        email={email ?? 'this device'}
        onCancel={() => setSignOutOpen(false)}
        onSignOut={async () => {
          setSignOutOpen(false);
          await signOut();
          router.replace('/');
        }}
      />
    </View>
  );
}

/**
 * 92D · the sign-out sheet. Only the ink pill signs out; the grey line under it
 * and the scrim both just close.
 */
function SignOutSheet({ open, email, onCancel, onSignOut }: { open: boolean; email: string; onCancel: () => void; onSignOut: () => void }) {
  if (!open) return null;
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end' }}>
      <PressScale
        onPress={onCancel}
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, minHeight: 0, backgroundColor: 'rgba(19,19,19,0.45)' }}>
        <View />
      </PressScale>
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#F4F3F0', borderTopLeftRadius: 24, borderTopRightRadius: 24, boxShadow: '0 -12px 40px rgba(19,19,19,0.3)' }}>
        <View style={{ paddingTop: 10, paddingHorizontal: 20, paddingBottom: 30 }}>
          <View style={{ alignSelf: 'center', width: 36, height: 5, borderRadius: 3, backgroundColor: 'rgba(19,19,19,0.15)' }} />
          <AppText center style={[sans('600'), { marginTop: 18, fontSize: 17, color: '#1D1C1A' }]}>Sign out?</AppText>
          <AppText center style={[sans('400'), { marginTop: 8, fontSize: 14.5, lineHeight: 21, color: '#55534E' }]}>
            {`You are signed in as ${email}. Your progress stays on the account — signing back in brings it all back.`}
          </AppText>
          <PressScale
            onPress={onSignOut}
            accessibilityRole="button"
            style={{ marginTop: 20, height: 54, minHeight: 54, borderRadius: 27, backgroundColor: '#131313', alignItems: 'center', justifyContent: 'center' }}>
            <AppText style={[sans('600'), { fontSize: 17, color: '#FFFFFF' }]}>Sign out</AppText>
          </PressScale>
          <PressScale onPress={onCancel} accessibilityRole="button" style={{ marginTop: 14, minHeight: 0, alignItems: 'center' }}>
            <AppText style={[sans('500'), { fontSize: 15, color: '#8B8882' }]}>Stay signed in</AppText>
          </PressScale>
        </View>
      </SafeAreaView>
    </View>
  );
}

/**
 * A captioned group. The caption box is exactly 26 tall, which is the canvas's
 * caption-top to card-top distance, so the card needs no margin of its own.
 */
function Section({ header, gap = 21, children }: { header: string; gap?: number; children: ReactNode }) {
  return (
    <View style={{ marginBottom: gap }}>
      <View style={{ height: 26, paddingHorizontal: 16 }}>
        <AppText style={[sans('600'), { fontSize: 13, color: '#55534E' }]}>{header}</AppText>
      </View>
      <View style={{ marginHorizontal: 12, borderRadius: 16, borderCurve: 'continuous', backgroundColor: '#FFFFFF', paddingVertical: 4 }}>{children}</View>
    </View>
  );
}

/**
 * A list row. The canvas gives each group its own height — 52 for the check-in
 * rows, 48 for the anchors, 50 for privacy, 46 for the account — so it is a
 * prop rather than a constant. `pill` is the inset time chip the two check-in
 * rows carry; `detail` is the plain grey line the others use.
 */
function Row({ height, title, detail, pill, onPress }: { height: number; title: string; detail?: string; pill?: string; onPress?: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={{ height, minHeight: height, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18 }}>
      <AppText style={[sans('500'), { flex: 1, fontSize: 16, color: '#1D1C1A' }]}>{title}</AppText>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {pill ? (
          <View style={{ height: 32, borderRadius: 16, backgroundColor: '#EDECE7', paddingHorizontal: 14, justifyContent: 'center' }}>
            <AppText style={[sans('600'), { fontSize: 15, color: '#1D1C1A' }]}>{pill}</AppText>
          </View>
        ) : null}
        {detail ? <AppText style={[sans('400'), { fontSize: 13, color: '#8B8882' }]}>{detail}</AppText> : null}
        <ChevronGlyph color="#B0AEA8" />
      </View>
    </PressScale>
  );
}

/** The hairline stops 18 short of both card edges. */
function Divider() {
  return <View style={{ height: 1, marginHorizontal: 18, backgroundColor: HAIRLINE }} />;
}

