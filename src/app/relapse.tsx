import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { View } from 'react-native';

import { CLAY, HUE, INK_DARK, JourneyPage, RelapseLineArt } from '@/components/urge';
import { useCreateEvent } from '@/lib/backend';
import { setJSON } from '@/lib/storage';

/**
 * The relapse series on the night sky — you slipped → don't fail twice →
 * begin again. Reframes a lapse as data, not failure (invariant #2).
 * "Start again" logs the lapse and returns home for a clean fresh start.
 */
export default function Relapse() {
  const router = useRouter();
  const createEvent = useCreateEvent();
  const [i, setI] = useState(0);
  const logged = useRef(false);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));
  const next = () => setI((v) => v + 1);
  const back = () => setI((v) => Math.max(0, v - 1));

  async function startAgain() {
    if (!logged.current) {
      logged.current = true;
      await createEvent({ type: 'lapse' }).catch(() => {});
      // the sealed letter arrives over Today on the next launch
      await setJSON('tideline.letter.pending', Date.now());
    }
    router.replace('/(app)/today');
  }

  return (
    <View style={{ flex: 1, backgroundColor: INK_DARK }}>
      <StatusBar style="dark" />
      {i === 0 ? (
        <JourneyPage
          tint={CLAY}
          hue={HUE.clay}
          total={3}
          index={0}
          back="close"
          onBack={close}
          label="It happened"
          headline="You slipped"
          sub="That's all it is — one moment, now behind you."
          visual={<RelapseLineArt tint={CLAY} mode="down" />}
          onNext={next}
        />
      ) : null}

      {i === 1 ? (
        <JourneyPage
          tint={CLAY}
          hue={HUE.clay}
          total={3}
          index={1}
          back="back"
          onBack={back}
          label="The one rule"
          headline="Don't fail twice"
          sub="A slip isn't a collapse. The streak resets; your progress doesn't."
          visual={<RelapseLineArt tint={CLAY} mode="trough" />}
          onNext={next}
        />
      ) : null}

      {i === 2 ? (
        <JourneyPage
          tint={CLAY}
          hue={HUE.clay}
          total={3}
          index={2}
          back="back"
          onBack={back}
          label="Right now"
          headline="Begin again"
          sub="The next choice is the one that counts. Start fresh from here."
          visual={<RelapseLineArt tint={CLAY} mode="up" />}
          onNext={startAgain}
          nextLabel="Start again"
        />
      ) : null}
    </View>
  );
}
