import { useRouter } from 'expo-router';
import { useState } from 'react';

import {
  GhostLink,
  LoadingView,
  MonoText,
  NavBar,
  PrimaryButton,
  Row,
  RowGroup,
  Screen,
  ScrollRegion,
  SHEET_TOP,
  Sheet,
} from '@/components/mono';
import { useAuth } from '@/lib/auth';
import { useCurrentUser } from '@/lib/backend';
import { usePurchases } from '@/lib/purchases';
import { formatTime, useRoutines } from '@/lib/routines';
import { mono } from '@/lib/theme';

/**
 * 92 · Settings — the nav row with its caption, then four captioned groups of
 * 54 rows from canvas 120 (`gap 18`), and `Sign out` as a ghost at `bottom 48`,
 * outside every card.
 *
 * `Weekly report` lives under Reminders now (the frame's third row, with
 * `Every Sunday`), and still opens the report itself (CRITIC §5, settings Q9).
 * Between the nav and the ghost the column scrolls (D320): at 393 × 852 it
 * fits flush and nothing moves; on a 667 phone it scrolls instead of running
 * under `Sign out`.
 */

/** the ghost's 18 line box at `bottom 48` — the space it takes off the screen's foot */
const GHOST_RESERVE = 48 + 18;

/**
 * Where the sign-out sheet's body ends inside its column as drawn: the 30 h1,
 * the 10 gap and two 23 lines of `…stay saved to sam@example.com.` — 12 above
 * the pill, which is anchored to the screen's foot.
 */
const SIGN_OUT_BODY_FOOT = 30 + 10 + 2 * 23;

/** `Manage subscription · Yearly` — the plan's own name, as Subscription spells it. */
const PLAN_NAME = { yearly: 'Yearly', monthly: 'Monthly', lifetime: 'Lifetime' } as const;

export default function Settings() {
  const router = useRouter();
  const { email, signOut } = useAuth();
  const user = useCurrentUser();
  const routines = useRoutines();
  const { membership } = usePurchases();
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [signOutBodyFoot, setSignOutBodyFoot] = useState(SIGN_OUT_BODY_FOOT);

  const done = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  if (user === undefined) return <LoadingView onBack={done} />;

  // Settings draws only `Yearly`; a free account has no plan to name, so the
  // row keeps its chevron and says nothing (D292).
  const plan = membership.isActive && membership.plan ? PLAN_NAME[membership.plan] : undefined;

  // The sheet's body names the account's own address, so it can wrap past the
  // drawn two lines; the kit panel keeps its drawn height (bottom-anchored, like
  // the pill), so a third line would run under `Sign out`. The panel rises by
  // what the body adds instead — the 12 above the pill holds, and at the frame's
  // address nothing moves (the sheet before this drop simply grew in flow).
  const signOutLift = Math.max(0, Math.ceil(signOutBodyFoot - SIGN_OUT_BODY_FOOT - 0.5));

  return (
    <Screen>
      <NavBar left="back" centre={{ title: 'Settings' }} right="empty" onBack={done} />

      <ScrollRegion top={100} bottom={GHOST_RESERVE} contentStyle={{ paddingTop: 20, paddingHorizontal: 24, paddingBottom: 16, gap: 18 }}>
        <RowGroup label="Reminders">
          {/* both rows carry `?from=settings`: the board is shared with onboarding,
              and the parameter is what makes its `Save time` come back here instead
              of running on into the onboarding night board and out onto Today */}
          <Row label="Morning check-in" value={formatTime(routines.morning)} onPress={() => router.push('/routines/morning-time?from=settings')} />
          <Row label="Night check-in" value={formatTime(routines.night)} onPress={() => router.push('/routines/night-time?from=settings')} />
          <Row label="Weekly report" value="Every Sunday" onPress={() => router.push('/weekly-report?from=settings')} />
        </RowGroup>

        <RowGroup label="Anchors">
          <Row label="Your vow" onPress={() => router.push('/vow')} />
          <Row label="Your letter" value="Opens Week XII" onPress={() => router.push('/letter?variant=week12')} />
        </RowGroup>

        <RowGroup label="Privacy">
          <Row label="App lock" value="Face ID" onPress={() => router.push('/applock')} />
          <Row label="Data & privacy" onPress={() => router.push('/privacy')} />
        </RowGroup>

        <RowGroup label="Account">
          <Row label="Edit profile" onPress={() => router.push('/profile')} />
          <Row label="Manage subscription" value={plan} valueLines={1} onPress={() => router.push('/subscription')} />
        </RowGroup>
      </ScrollRegion>

      {/* the first "Sign out" in the tree — the sheet's pill, which actually signs
          out, comes after it (recipes tap the text) */}
      <GhostLink label="Sign out" bottom={48} onPress={() => setSignOutOpen(true)} />

      {/* 92D · only the pill signs out; the scrim and "Stay signed in" just close */}
      <Sheet
        open={signOutOpen}
        top={SHEET_TOP.signOut - signOutLift}
        gap={10}
        onClose={() => setSignOutOpen(false)}
        footer={
          <>
            <PrimaryButton
              label="Sign out"
              bottom={96}
              sheet
              onPress={async () => {
                setSignOutOpen(false);
                await signOut();
                router.replace('/');
              }}
            />
            <GhostLink label="Stay signed in" zIndex={42} onPress={() => setSignOutOpen(false)} />
          </>
        }>
        <MonoText v="h1SheetLg">Sign out?</MonoText>
        <MonoText
          v="p"
          color={mono.sub}
          style={{ lineHeight: 23 }}
          onLayout={(e) => setSignOutBodyFoot(e.nativeEvent.layout.y + e.nativeEvent.layout.height)}>
          {`Your log, letters and medallions stay saved to ${email ?? 'this device'}.`}
        </MonoText>
      </Sheet>
    </Screen>
  );
}
