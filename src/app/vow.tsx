import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useId, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { AppText, BackGlyph, Grain, PressScale } from '@/components/ui';
import { useCurrentUser, useJournalEntries } from '@/lib/backend';
import { fonts, sans } from '@/lib/theme';

/**
 * 92C · Your vow — the line you signed on night zero, kept where you can find
 * it again, with the signature under it and how long it has held.
 *
 * Canvas tops include the 54pt status bar the app never builds, so every number
 * below is the canvas value less 54; the ones anchored to the card's own bottom
 * are card-local and carry over unchanged.
 */

const noiseDark = require('../../assets/images/noise-dark.png');

/** The line the canvas draws when nothing has been signed yet. */
const PLACEHOLDER = 'I’m done letting the wave decide. One evening at a time, I take the watch back.';

export default function Vow() {
  const router = useRouter();
  const user = useCurrentUser();
  const journal = useJournalEntries();
  const id = useId().replace(/:/g, '');
  // Read once on mount so the day count cannot move while the page is open.
  const [now] = useState(() => Date.now());

  const vow = (journal ?? []).find((entry) => entry.tag === 'Vow') ?? (journal ?? []).find((entry) => entry.tag === 'Pledge');
  const signedAt = vow?.createdAt ?? user?.createdAt;
  const held = signedAt ? Math.max(0, Math.floor((now - signedAt) / 86_400_000)) : 0;
  const name = user?.displayName?.split(' ')[0] ?? 'You';
  const stamp = signedAt
    ? `${new Date(signedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })} · Day 0`
    : 'Not signed yet';

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <StatusBar style="dark" />
      <Grain source={noiseDark} opacity={0.07} />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* canvas 64 — the way back reads "Settings", not "Back" */}
        <PressScale
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'))}
          accessibilityRole="button"
          accessibilityLabel="Settings"
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 24 }}
          style={{ position: 'absolute', left: 16, top: 10, minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 9, zIndex: 5 }}>
          <BackGlyph color="#55534E" />
          <AppText style={[sans('400'), { fontSize: 17, color: '#55534E' }]}>Settings</AppText>
        </PressScale>

        {/* canvas 114 */}
        <AppText style={[sans('600'), { position: 'absolute', left: 16, right: 16, top: 60, fontSize: 27, letterSpacing: -0.2, color: '#1D1C1A' }]}>
          Your vow
        </AppText>

        {/* canvas 168 / 196 — a 170pt halo with the 46pt sun sitting inside it */}
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 114, alignItems: 'center' }}>
          <Svg width={170} height={170}>
            <Defs>
              <RadialGradient id={`halo${id}`} cx="85" cy="85" rx="85" ry="85" gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.38} />
                <Stop offset="0.72" stopColor="#E2BA78" stopOpacity={0} />
              </RadialGradient>
              {/* `radial-gradient(circle at 50% 38%, …)` names no size, so CSS
                  uses farthest-corner: from (50%, 38%) of a 46px box that is
                  √(23² + 28.52²) = 36.66, which is 159.4% of the box's half. */}
              <RadialGradient id={`sun${id}`} cx="85" cy="82.48" rx="36.66" ry="36.66" gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor="#F8E9CB" />
                <Stop offset="0.7" stopColor="#EFD3A2" />
                <Stop offset="1" stopColor="#E3BE85" />
              </RadialGradient>
            </Defs>
            <Circle cx={85} cy={85} r={85} fill={`url(#halo${id})`} />
            <Circle cx={85} cy={51} r={23} fill={`url(#sun${id})`} />
          </Svg>
        </View>

        {/* canvas 296 — the vow itself, set in the serif the pledge uses */}
        <AppText
          center
          style={{ position: 'absolute', left: 40, right: 40, top: 242, fontFamily: fonts.quote, fontSize: 20, lineHeight: 32, color: '#1D1C1A' }}>
          {vow?.body ?? PLACEHOLDER}
        </AppText>

        {/* canvas 452 — the signature card */}
        <View
          style={{
            position: 'absolute',
            left: 36,
            right: 36,
            top: 398,
            height: 170,
            borderRadius: 18,
            borderCurve: 'continuous',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 0 0 1.5px rgba(0,0,0,0.08), 0 14px 34px rgba(40,38,32,0.10)',
          }}>
          <AppText style={[sans('600'), { position: 'absolute', left: 16, top: 13, fontSize: 10.5, letterSpacing: 1.6, color: '#C6C3BC' }]}>
            SIGNATURE
          </AppText>
          <AppText style={{ position: 'absolute', left: 50, bottom: 40, fontFamily: fonts.script, fontSize: 34, lineHeight: 34, color: '#1D1C1A' }}>
            {name}
          </AppText>
          <AppText style={{ position: 'absolute', left: 24, bottom: 42, fontSize: 14, color: '#B0AEA8' }}>×</AppText>
          <View style={{ position: 'absolute', left: 22, right: 22, bottom: 38, height: 1.5, backgroundColor: 'rgba(0,0,0,0.26)' }} />
          <AppText style={[sans('500'), { position: 'absolute', left: 24, bottom: 15, fontSize: 11.5, color: '#B0AEA8' }]}>{name}</AppText>
          <AppText style={[sans('500'), { position: 'absolute', right: 22, bottom: 15, fontSize: 11.5, color: '#B0AEA8' }]}>{stamp}</AppText>
        </View>

        {/* canvas 648 and 692 */}
        <AppText center style={[sans('500'), { position: 'absolute', left: 0, right: 0, top: 594, fontSize: 13, color: '#8B8882' }]}>
          {`Held for ${held} ${held === 1 ? 'day' : 'days'}.`}
        </AppText>
        <AppText center style={[sans('400'), { position: 'absolute', left: 36, right: 36, top: 638, fontSize: 13, lineHeight: 19, color: '#8B8882' }]}>
          After a relapse you can re-sign the vow. It resets the promise, never the progress.
        </AppText>
      </SafeAreaView>
    </View>
  );
}
