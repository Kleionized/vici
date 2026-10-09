/**
 * "This build is misconfigured" — what a release build shows instead of the
 * app when `RELEASE_CONFIG_PROBLEMS` (`@/lib/config`) is not empty: no
 * backend or sign-in configured (it would otherwise fall back to the offline
 * mock), development or Test Store keys, or no privacy policy to link.
 *
 * It is mounted in place of `PurchasesProvider`, which every route sits
 * inside, so no screen, reminder or lock runs behind it, and RevenueCat is
 * never configured with a key that must not ship. It names each problem in
 * plain words so whoever installed the build knows which variable to set.
 * Nothing on the phone is changed. (D450)
 */

import { useEffect, type ReactNode } from 'react';
import { View } from 'react-native';

import { H1, LaurelMark, MonoText, P, Screen, ScrollRegion } from '@/components/mono';
import { RELEASE_CONFIG_PROBLEMS } from '@/lib/config';
import { mono } from '@/lib/theme';

export function MisconfiguredBuild(_props: { children?: ReactNode }) {
  useEffect(() => {
    // Device logs and crash consoles see it too.
    console.error(`[config] This release build is misconfigured:\n- ${RELEASE_CONFIG_PROBLEMS.join('\n- ')}`);
  }, []);
  return (
    <Screen>
      <ScrollRegion top={54} contentStyle={{ paddingTop: 72, paddingHorizontal: 24, paddingBottom: 48 }}>
        <LaurelMark size={40} />
        <View style={{ marginTop: 28, gap: 14 }}>
          <H1>This build is misconfigured.</H1>
          <P>This release build is missing settings it needs. It stops here instead of running on test or offline services. Nothing on this phone was changed.</P>
        </View>
        <View style={{ marginTop: 28, gap: 12 }}>
          <MonoText v="caps">What is missing</MonoText>
          {RELEASE_CONFIG_PROBLEMS.map((problem) => (
            <MonoText key={problem} v="p" wrap="wrap" color={mono.mute} style={{ fontSize: 14, lineHeight: 20 }}>
              {`· ${problem}`}
            </MonoText>
          ))}
        </View>
      </ScrollRegion>
    </Screen>
  );
}
