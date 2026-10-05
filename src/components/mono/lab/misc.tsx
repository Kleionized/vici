import { useState, type ComponentType, type ReactNode } from 'react';
import { View } from 'react-native';

import { mono, monoDark, ring } from '@/lib/theme';

import { GhostLink, PrimaryButton } from '../buttons';
import { EmptyState, LoadingView } from '../Feedback';
import { NavBar } from '../NavBar';
import { EnergyBars, IntensityScale, PagerDots, ScaleReading, ToneScale } from '../scales';
import { Screen } from '../Screen';
import { MonoText } from '../Text';

/**
 * Kit-lab replicas for `scales.tsx` (PagerDots, ToneScale, IntensityScale,
 * EnergyBars, ScaleReading). The rest of each frame is built from the core kit
 * (nav, h1, primary, ghost); the hero art is Part C's and is left out — its
 * region is named, not counted, in the diff.
 */

/** `[question] stack: left 24 right 24 top 136; column; gap N` */
function Stack({ gap, children }: { gap: number; children: ReactNode }) {
  return <View style={{ position: 'absolute', left: 24, right: 24, top: 136, gap }}>{children}</View>;
}

function SOSStrength() {
  return (
    <Screen>
      <NavBar left="back" centre={{ step: 1, total: 8 }} right="close" />
      <Stack gap={20}>
        <MonoText v="h1">How strong is it right now?</MonoText>
      </Stack>
      <IntensityScale value={3} />
      <ScaleReading word="Intense" line="Hard to resist" />
      <PrimaryButton label="Continue" bottom={96} />
      <GhostLink label="Skip this step" />
    </Screen>
  );
}

function SOSReassess() {
  return (
    <Screen>
      <NavBar left="back" centre={{ step: 8, total: 8 }} right="close" />
      <Stack gap={8}>
        <MonoText v="h1">Where is the urge now?</MonoText>
        <MonoText v="pTight" color={mono.mute}>
          Rate it again from 1–5.
        </MonoText>
      </Stack>
      <IntensityScale value={1} previous={3} />
      <ScaleReading word="Noticeable" line="Coming down — from 4 to 2" />
      <PrimaryButton label="Continue" />
    </Screen>
  );
}

function MorningFeeling() {
  return (
    <Screen>
      <NavBar left="back" centre={{ step: 5, total: 8 }} right="close" />
      <Stack gap={20}>
        <MonoText v="h1">How are you feeling?</MonoText>
      </Stack>
      <ToneScale value={2} />
      <ScaleReading word="Steady" line="On level ground" />
      <PrimaryButton label="Continue" />
    </Screen>
  );
}

function MorningEnergy() {
  return (
    <Screen>
      <NavBar left="back" centre={{ step: 6, total: 8 }} right="close" />
      <Stack gap={20}>
        <MonoText v="h1">Where’s your energy?</MonoText>
      </Stack>
      <EnergyBars value={1} />
      <ScaleReading word="Low" line="Still warming up" />
      <PrimaryButton label="Continue" />
    </Screen>
  );
}

/** 28 clean, 2 slips — the frame's own pattern (open rings at 9 and 20). */
const LAST_30 = Array.from({ length: 30 }, (_, i) => i !== 8 && i !== 19);

function UrgeHubScore() {
  // the dots as the hub uses them — controls that jump to their pane
  const [pane, setPane] = useState(1);
  return (
    <Screen variant="dark">
      <NavBar left="empty" centre={{ title: 'Ride it out' }} right="close" tone="dark" />
      <View style={{ position: 'absolute', left: 24, right: 24, top: 160, gap: 12, alignItems: 'center' }}>
        <MonoText v="h1" center color={monoDark.text} style={{ alignSelf: 'stretch' }}>
          You’re riding a wave.
        </MonoText>
        <MonoText v="p" center color={monoDark.body} style={{ alignSelf: 'stretch' }}>
          This one is strong. None this strong has lasted past forty minutes.
        </MonoText>
      </View>
      {/* the card is the sos group's; built plainly here to place the dots */}
      <View style={{ position: 'absolute', left: 24, right: 24, top: 276 }}>
        <View style={{ borderRadius: 24, backgroundColor: mono.card, paddingVertical: 20, paddingHorizontal: 22, gap: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <MonoText v="caps" color="rgba(255,255,255,0.5)">
              Last 30 days
            </MonoText>
            <MonoText v="pill" color={monoDark.text}>
              28 clean, 2 slips
            </MonoText>
          </View>
          {/* three rows of ten (`grid-template-columns: repeat(10, 1fr)`), so
              the grid keeps ten across at any width */}
          <View style={{ gap: 10 }}>
            {[0, 10, 20].map((row) => (
              <View key={row} style={{ flexDirection: 'row', gap: 10 }}>
                {LAST_30.slice(row, row + 10).map((clean, i) => (
                  <View
                    key={i}
                    style={{
                      flex: 1,
                      aspectRatio: 1,
                      borderRadius: 999,
                      backgroundColor: clean ? monoDark.text : 'transparent',
                      boxShadow: clean ? undefined : ring.outlineDark,
                    }}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
      <PagerDots active={pane} onChange={setPane} />
      <PrimaryButton label="Breathe" bottom={96} tone="dark" />
      <GhostLink label="I slipped" tone="dark" />
    </Screen>
  );
}

/**
 * No frame draws these two (routes §7–8) — bench views to look at, not diff:
 * the wait with its way out kept, and an empty list under a page title.
 */
function Loading() {
  return <LoadingView delay={0} onBack={() => {}} />;
}

function Empty() {
  return (
    <Screen>
      <NavBar left="back" />
      <View style={{ position: 'absolute', left: 0, right: 0, top: 300 }}>
        <EmptyState title="No reports yet" body="The first one arrives once a full week has closed." />
      </View>
    </Screen>
  );
}

/** Kit-lab replicas for the misc part of the kit. Key = the frame's split file stem. */
export const LAB_MISC: Record<string, ComponentType> = {
  '_Loading': Loading,
  '_Empty': Empty,
  'SOS-Strength': SOSStrength,
  'SOS-Reassess': SOSReassess,
  'Morning-Feeling': MorningFeeling,
  'Morning-Energy': MorningEnergy,
  'Urge-Hub-Score': UrgeHubScore,
};
