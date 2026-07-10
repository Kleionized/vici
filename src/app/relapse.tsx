import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { AppText } from '@/components/ui';
import { useCreateEvent } from '@/lib/backend';
import { setJSON } from '@/lib/storage';
import { fonts, sans } from '@/lib/theme';

/**
 * Relapse — begin again (canvas: relapse series). One slip, three full-bleed
 * night pages over the supplied artwork: You slipped → Don't fail twice →
 * Begin again. "Start again" logs the lapse (data, not failure) and arms the
 * sealed letter for the next launch.
 */

const PAGES = [
  { img: require('../../assets/images/relapse-slip.webp'), label: 'It happened', headline: 'You slipped', cta: 'Continue' },
  { img: require('../../assets/images/relapse-twice.webp'), label: 'The one rule', headline: "Don't fail twice", cta: 'Continue' },
  { img: require('../../assets/images/relapse-begin.webp'), label: 'Right now', headline: 'Begin again', cta: 'Start again' },
];

export default function Relapse() {
  const router = useRouter();
  const createEvent = useCreateEvent();
  const [i, setI] = useState(0);
  const logged = useRef(false);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));
  const back = () => (i === 0 ? close() : setI(i - 1));

  async function advance() {
    if (i < PAGES.length - 1) return setI(i + 1);
    if (!logged.current) {
      logged.current = true;
      await createEvent({ type: 'lapse' }).catch(() => {});
      // the sealed letter arrives over Today on the next launch
      await setJSON('tideline.letter.pending', Date.now());
    }
    router.replace('/(app)/today');
  }

  const p = PAGES[i];
  return (
    <View style={{ flex: 1, backgroundColor: '#0B0B0C' }}>
      <StatusBar style="light" />
      <Image source={p.img} contentFit="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      <LinearGradient
        colors={['rgba(7,8,10,0.55)', 'rgba(7,8,10,0.1)', 'rgba(7,8,10,0.14)', 'rgba(7,8,10,0.7)']}
        locations={[0, 0.3, 0.56, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {/* top bar: back · 3-segment progress · close */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 29, paddingTop: 8 }}>
          <Pressable onPress={back} hitSlop={10} accessibilityLabel="Back" style={{ padding: 4, marginLeft: -4 }}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path d="M15 5l-7 7 7 7" stroke="#F5F4F1" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </Pressable>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
            {PAGES.map((_, k) => (
              <View key={k} style={{ flex: 1, maxWidth: 36, height: 4, borderRadius: 9999, backgroundColor: k <= i ? '#F5F4F1' : 'rgba(245,244,241,0.3)' }} />
            ))}
          </View>
          <Pressable onPress={close} hitSlop={10} accessibilityLabel="Close" style={{ padding: 4, marginRight: -4 }}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path d="M6 6l12 12M18 6L6 18" stroke="#F5F4F1" strokeWidth={2.1} strokeLinecap="round" />
            </Svg>
          </Pressable>
        </View>

        <View style={{ flex: 1 }} />
        <View style={{ paddingHorizontal: 29, alignItems: 'center' }}>
          <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 2.1, textTransform: 'uppercase', color: 'rgba(245,244,241,0.55)', marginBottom: 12 }]}>
            {p.label}
          </AppText>
          <AppText center style={{ fontFamily: fonts.serif, fontSize: 30, lineHeight: 34, letterSpacing: 0.3, color: '#F5F4F1' }}>
            {p.headline}
          </AppText>
        </View>
        <View style={{ flex: 1.15 }} />
        <View style={{ paddingHorizontal: 29, paddingBottom: 12 }}>
          <Pressable
            onPress={advance}
            style={({ pressed }) => ({
              width: '100%',
              backgroundColor: '#FBFAF9',
              borderRadius: 9999,
              paddingVertical: 16,
              alignItems: 'center',
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}>
            <AppText style={[sans('600'), { fontSize: 15.5, letterSpacing: 0.16, color: '#131313' }]}>{p.cta}</AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
