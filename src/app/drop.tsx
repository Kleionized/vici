import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Svg, { Defs, Ellipse, Path, RadialGradient, Stop } from 'react-native-svg';

import { MailArrival, MailSheet } from '@/app/letter';
import { AppText, PressScale } from '@/components/ui';
import { useUpdateSettings } from '@/lib/backend';
import { setJSON } from '@/lib/storage';
import { sans } from '@/lib/theme';

/**
 * The yearly drop — canvas 174 → 175.
 *
 * The enclosure that comes with the medallion post: the whole year for one
 * payment. It reads as a sheet, like the letter it was folded into, and once
 * it is claimed the year itself arrives as an object on the lit field — the
 * same arrival every other piece of post gets.
 *
 * Canvas tops inside the sheet are the sheet's own (its top edge is canvas
 * y 52); tops on the arrival are the 852 frame's, less the 54pt status bar.
 */

const laurelMark = require('../../assets/images/laurel-mark.webp');

const DROP_SEEN_KEY = 'tideline.post.yearlydrop.seen';

const FULL_PRICE = '$39.99';
const DROP_PRICE = '$26.99';

type Phase = 'offer' | 'claimed';

export default function Drop() {
  const router = useRouter();
  const updateSettings = useUpdateSettings();
  const [phase, setPhase] = useState<Phase>('offer');

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  const later = () => {
    void setJSON(DROP_SEEN_KEY, Date.now());
    close();
  };

  const claim = () => {
    void (async () => {
      await setJSON(DROP_SEEN_KEY, Date.now());
      await updateSettings({ premium: true, yearlyDrop: true }).catch(() => {});
    })();
    setPhase('claimed');
  };

  if (phase === 'claimed') {
    return (
      <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
        <StatusBar style="dark" />
        <MailArrival
          art={<YearTile />}
          title="You received a drop."
          sub="One drop covers the year — twelve months of VICI, billed once."
          primary="Begin the year"
          secondary="See the receipt"
          onPrimary={close}
          onSecondary={() => router.replace('/subscription')}
          onClose={close}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#EDECE7' }}>
      <StatusBar style="dark" />
      <MailSheet onClose={later}>
        <Offer onClaim={claim} onLater={later} />
      </MailSheet>
    </View>
  );
}

/* ------------------------------------------------------------ 174 · the offer */

function Offer({ onClaim, onLater }: { onClaim: () => void; onLater: () => void }) {
  const { width } = useWindowDimensions();
  // The twelve-month diagram is drawn on the canvas's 321pt interior (left 36,
  // right 36 of a 393 frame); the rays stretch to whatever that interior is here.
  const interior = width - 72;

  return (
    <>
      <AppText
        center
        style={[sans('500'), { position: 'absolute', left: 0, right: 0, top: 112, fontSize: 26, lineHeight: 33, letterSpacing: -0.2, color: '#1D1C1A' }]}>
        The year, at a drop
      </AppText>
      <AppText center style={[sans('400'), { position: 'absolute', left: 56, right: 56, top: 158, fontSize: 14.5, lineHeight: 21, color: '#8B8882' }]}>
        One payment covers all twelve months.
      </AppText>

      <View pointerEvents="none" style={{ position: 'absolute', left: 36, right: 36, top: 232, height: 206 }}>
        {/* canvas blurs this by 4px — redrawn as the equivalent radial falloff */}
        <Svg width={170} height={170} style={{ position: 'absolute', left: '50%', top: -24, marginLeft: -85 }}>
          <Defs>
            <RadialGradient id="drop-glow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.38} />
              <Stop offset="0.75" stopColor="#E2BA78" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={85} cy={85} rx={85} ry={85} fill="url(#drop-glow)" />
        </Svg>

        <Image source={laurelMark} contentFit="contain" style={{ position: 'absolute', left: '50%', top: 2, marginLeft: -32, width: 64, height: 64 }} />

        {/* the mark paying out to the twelve months */}
        <Svg width={interior} height={58} viewBox="0 0 321 58" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 70 }}>
          <Path
            d="M160.5 0 C160.5 20 40 24 12 50 M160.5 0 C160.5 20 281 24 309 50 M160.5 0 C160.5 24 104 28 78 52 M160.5 0 C160.5 24 217 28 243 52 M160.5 0 L160.5 52"
            stroke="rgba(19,19,19,0.15)"
            strokeWidth={1.5}
            fill="none"
            strokeDasharray="1 6"
            strokeLinecap="round"
          />
        </Svg>

        <View style={{ position: 'absolute', left: 0, right: 0, top: 130, flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <View key={i} style={{ width: 19, height: 19, borderRadius: 6, backgroundColor: '#131313' }} />
          ))}
        </View>

        <AppText style={[sans('500'), { position: 'absolute', left: 0, top: 160, fontSize: 11.5, color: '#B0AEA8' }]}>Jan</AppText>
        <AppText style={[sans('500'), { position: 'absolute', right: 0, top: 160, fontSize: 11.5, color: '#B0AEA8' }]}>Dec</AppText>
      </View>

      <View style={{ position: 'absolute', left: 0, right: 0, top: 494, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 12 }}>
        <AppText style={[sans('500'), { fontSize: 17, color: '#A5A29B', textDecorationLine: 'line-through' }]}>{FULL_PRICE}</AppText>
        <AppText style={[sans('600'), { fontSize: 46, lineHeight: 46, letterSpacing: -0.5, color: '#131313' }]}>{DROP_PRICE}</AppText>
        <AppText style={[sans('500'), { fontSize: 14, color: '#8B8882' }]}>/year</AppText>
      </View>

      <View style={{ position: 'absolute', left: 0, right: 0, top: 556, alignItems: 'center' }}>
        <View style={{ height: 30, borderRadius: 15, backgroundColor: '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,0.1)', justifyContent: 'center', paddingHorizontal: 14 }}>
          <AppText style={[sans('600'), { fontSize: 12.5, color: '#55534E' }]}>Billed once · $2.25 a month</AppText>
        </View>
      </View>

      <PressScale
        onPress={onClaim}
        accessibilityRole="button"
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          bottom: 96,
          height: 58,
          borderRadius: 29,
          backgroundColor: '#131313',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AppText style={[sans('600'), { fontSize: 16.5, letterSpacing: 0.2, color: '#FFFFFF' }]}>Claim the year — {DROP_PRICE}</AppText>
      </PressScale>
      <PressScale
        onPress={onLater}
        accessibilityRole="button"
        hitSlop={{ top: 14, bottom: 14, left: 40, right: 40 }}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 56, minHeight: 0, alignItems: 'center' }}>
        <AppText style={[sans('500'), { fontSize: 14, color: '#8B8882' }]}>Maybe later</AppText>
      </PressScale>
    </>
  );
}

/* --------------------------------------------------------- 175 · the year, in */

/**
 * The year as an object: an ink tile, tilted, with the mark inverted on it.
 * Same 260 × 260 frame, same light and contact shadow as the medallion.
 */
function YearTile() {
  return (
    <>
      {/* canvas blurs the light and the shadow by 6px — both redrawn as radials */}
      <Svg width={200} height={200} style={{ position: 'absolute', left: 30, top: 20 }}>
        <Defs>
          <RadialGradient id="year-glow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.55} />
            <Stop offset="0.74" stopColor="#E2BA78" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={100} cy={100} rx={100} ry={100} fill="url(#year-glow)" />
      </Svg>
      <Svg width={156} height={16} style={{ position: 'absolute', left: 52, top: 230 }}>
        <Defs>
          <RadialGradient id="year-shadow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#000000" stopOpacity={0.11} />
            <Stop offset="0.6" stopColor="#000000" stopOpacity={0.055} />
            <Stop offset="1" stopColor="#000000" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={78} cy={8} rx={78} ry={8} fill="url(#year-shadow)" />
      </Svg>

      <View
        style={{
          position: 'absolute',
          left: 62,
          top: 52,
          width: 136,
          height: 136,
          borderRadius: 32,
          backgroundColor: '#131313',
          boxShadow: 'inset 0 0 0 1.5px rgba(244,243,240,0.14), 0 14px 30px rgba(30,28,24,0.35)',
          transform: [{ rotate: '-3deg' }],
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}>
        {/* the canvas inverts the dark-on-transparent mark and lifts it — a tint */}
        <Image source={laurelMark} tintColor="#FFFFFF" contentFit="contain" style={{ width: 58, height: 58 }} />
        <AppText style={[sans('600'), { fontSize: 12, letterSpacing: 2.5, color: 'rgba(244,243,240,0.65)', marginRight: -2.5 }]}>THE YEAR</AppText>
      </View>
    </>
  );
}
