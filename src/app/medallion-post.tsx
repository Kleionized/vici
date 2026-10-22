import { useRouter } from 'expo-router';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { FaceCoin, kkFace, kkStanding } from '@/components/keepsakes/Medallion';
import { GhostLink, MonoText, MS, NavBar, popStyle, PrimaryButton, Screen, useMotion } from '@/components/mono';
import { useEvents } from '@/lib/backend';
import { roman } from '@/lib/format';
import { ACCOUNT_KEYS, writeAccountJSON } from '@/lib/accountState';
import { useSuccessHaptic } from '@/lib/haptics';
import { mono, sansItalic } from '@/lib/theme';

/**
 * A new medallion (D62). It arrives the launch after an urge was logged and
 * ridden out without a slip — exactly `Vici`'s rule — so the face is Vici at
 * the rung that count has cleared. A medallion comes on its own, never with a
 * letter: the coin lands, its name and tier, what earns it, and its Stoic line
 * (D50). The owner's letter for the first urge handled (M23, "You got through
 * it") arrives as the letters do (`src/lib/viciPost.ts`).
 *
 * Leaving — Done, the ✕, or going to the medallions — marks it seen, so the
 * launch gate never brings it again.
 */

const POST_DONE_KEY = ACCOUNT_KEYS.postDelivered;

export default function MedallionPost() {
  const router = useRouter();
  const events = useEvents();
  const motion = useMotion();
  // a medallion earned: the completion's touch, as the coin lands (D59)
  useSuccessHaptic();

  const face = kkFace('vici')!;
  const ridden = (events ?? []).filter((e) => e.type === 'urge_rode_out').length;
  const standing = Math.max(1, kkStanding(face, ridden));

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));
  // the done flag goes down before leaving: a post opened cold leaves to Today,
  // whose launch gate would otherwise deliver it again
  const seen = () => writeAccountJSON(POST_DONE_KEY, Date.now());
  const done = () => void seen().then(close);
  const toMedallions = () => void seen().then(() => router.replace('/(app)/milestones'));

  return (
    <Screen>
      <NavBar left="empty" right="close" onClose={done} />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 150, alignItems: 'center' }}>
        <Animated.View style={popStyle(motion, { delay: 120, duration: MS.slow + 220 })}>
          <FaceCoin scene={face.key} size={168} numeral={roman(standing)} />
        </Animated.View>
        <MonoText v="caps" center style={{ marginTop: 32 }}>
          New medallion
        </MonoText>
        <MonoText v="h1" center style={{ alignSelf: 'stretch', marginTop: 10 }}>
          {`${face.name}, Tier ${roman(standing)}`}
        </MonoText>
        <MonoText v="p" center wrap="pretty" style={{ alignSelf: 'stretch', marginTop: 8 }}>
          {face.long ?? face.blurb}
        </MonoText>
        <MonoText v="p" center wrap="pretty" color={mono.ink} style={{ ...sansItalic(), fontSize: 18, lineHeight: 28, alignSelf: 'stretch', marginTop: 34 }}>
          {`“${face.quote.text}”`}
        </MonoText>
        <MonoText v="caps" center style={{ marginTop: 10 }}>
          {face.quote.by}
        </MonoText>
      </View>
      <PrimaryButton label="Done" onPress={done} bottom={96} />
      <GhostLink label="See all medallions" onPress={toMedallions} />
    </Screen>
  );
}
