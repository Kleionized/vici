import { LinearGradient } from 'expo-linear-gradient';
import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';

import { AK } from '@/components/auth/kit';
import { AppText } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { useCurrentUser } from '@/lib/backend';
import { fonts, sans } from '@/lib/theme';

/**
 * Boot (canvas: auth-boot / BootFlow) — the cold open. The quietest surface
 * in the app: ink ground, the wordmark, and the onboarding's growing ink
 * rule doing the waiting — no spinner, no percentage. The campaign day
 * stamps in beneath while it loads, then the ink breaks to Today.
 *
 * Also the route decider:
 *   not authed          → (auth)
 *   authed, !onboarded  → (onboarding)
 *   authed, onboarded   → (app)
 */

const roman = (n: number) => {
  const t: [number, string][] = [[100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let out = '';
  let x = Math.max(1, n);
  for (const [v, s] of t) while (x >= v) { out += s; x -= v; }
  return out;
};

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const user = useCurrentUser();
  // hold the boot for one fill of the rule (the canvas's 2.05s beat)
  const [booted, setBooted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 2050);
    return () => clearTimeout(t);
  }, []);

  const hydrated = isLoaded && (!isSignedIn || user !== undefined);
  if (!hydrated || !booted) {
    const day = user ? Math.max(1, Math.floor((Date.now() - user.createdAt) / 86400000) + 1) : null;
    return <Boot day={day} />;
  }
  if (!isSignedIn) return <Redirect href="/(auth)/splash" />;
  if (!user?.onboardingComplete) return <Redirect href="/(onboarding)/welcome" />;
  return <Redirect href="/(app)/today" />;
}

function Boot({ day }: { day: number | null }) {
  const [fill] = useState(() => new Animated.Value(0.04));
  const [stamp] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.timing(fill, { toValue: 1, duration: 1700, useNativeDriver: false }).start();
    Animated.timing(stamp, { toValue: 1, duration: 900, delay: 300, useNativeDriver: true }).start();
  }, [fill, stamp]);
  return (
    <View style={{ flex: 1, backgroundColor: AK.bg0 }}>
      <StatusBar style="light" />
      <LinearGradient colors={[AK.bg2, AK.bg1, AK.bg0]} locations={[0, 0.42, 1]} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <AppText style={{ fontFamily: fonts.serif, fontSize: 23, letterSpacing: 8.28, color: AK.ink, marginLeft: 8.28 }}>VICI</AppText>
        {/* the growing ink rule — the app-wide progress motif, as loader */}
        <View style={{ width: 46, height: 1.5, backgroundColor: AK.hair, marginTop: 20 }}>
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              top: -0.25,
              height: 2,
              backgroundColor: AK.ink,
              width: fill.interpolate({ inputRange: [0, 1], outputRange: ['4%', '100%'] }),
            }}
          />
        </View>
      </View>
      {/* the campaign day, stamped low while it loads */}
      {day != null ? (
        <Animated.View style={{ position: 'absolute', left: 0, right: 0, bottom: 74, alignItems: 'center', opacity: stamp }}>
          <AppText style={[sans('600'), { fontSize: 11, letterSpacing: 3.52, textTransform: 'uppercase', color: AK.ink3 }]}>
            Day {roman(day)}
          </AppText>
        </Animated.View>
      ) : null}
    </View>
  );
}
