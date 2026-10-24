import { Stack, useLocalSearchParams } from 'expo-router';

import SosChooser from '@/app/sos';
import { RelapseFlow, RelapseLog } from '@/components/slip/relapse';
import { SosFlow } from '@/components/urge/sos';
import { TextLab, VLab } from '@/dev/TextLab';
import { RELAPSE_PRESETS, relapseInitial, relapseLogEntries, relapseNow } from '@/dev/relapseFixtures';
import { HARNESS_BUILT, HARNESS_NOW, SOS_PRESETS, sosFixture } from '@/dev/sosFixtures';

/**
 * The dev screen harness (Vici UI 2 run): any screen in any state, opened by
 * deep link, with the design's own fixture data and a stopped clock, so a
 * screenshot shows the settled frame the canvas draws.
 *
 *   xcrun simctl openurl booted "tideline://dev/harness?view=sos&state=s06"
 *
 * Loaded by `src/app/dev/harness.tsx` in development builds only; a release
 * build does not contain it.
 */
export function HarnessScreen() {
  // `view`, not `screen`: React Navigation reserves `screen` for nested navigators
  const { view, state, n } = useLocalSearchParams<{ view?: string; state?: string; n?: string }>();
  let body = null;
  if (view === 'chooser') body = <SosChooser />;
  if (view === 'textlab') body = <TextLab />;
  if (view === 'vlab') body = <VLab />;
  if (view === 'relapse') {
    const p = RELAPSE_PRESETS[state ?? 'r01'];
    if (p?.page === 'log') body = <RelapseLog key={n} entries={relapseLogEntries(p)} now={relapseNow(p)} onOpen={() => {}} onNew={() => {}} />;
    else if (p) {
      const { now, ctx, initial } = relapseInitial(state ?? 'r01', p);
      body = (
        <RelapseFlow
          key={`${state}-${n ?? ''}`}
          now={now}
          ctx={ctx}
          initial={{ ...initial, forced: p.forced }}
          history={{ hist: [], qSeen: [] }}
          onHistory={() => {}}
          store={{ create: async () => `${state}-1`, update: async () => {} }}
          onExit={() => {}}
          onRepair={() => {}}
          onClose={() => {}}
        />
      );
    }
  }
  if (view === 'sos') {
    const preset = SOS_PRESETS[state ?? 's01'];
    if (preset) body = <SosFlow key={`${state}-${n ?? ''}`} preset={preset} frozenNow={HARNESS_NOW} builtAt={HARNESS_BUILT} fixture={sosFixture(preset.cur)} />;
  }
  return (
    <>
      <Stack.Screen options={{ animation: 'none', gestureEnabled: false }} />
      {body}
    </>
  );
}
