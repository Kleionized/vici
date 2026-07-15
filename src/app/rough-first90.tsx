import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui';
import { RDAsk, RDPage, RDShell } from '@/components/roughDays/kit';
import { RD_FIRST90 } from '@/content/roughDays';
import { sans } from '@/lib/theme';

// ── The First 90 Seconds (canvas: rd-first90) — the universal interrupt:
// two asks tailor the six moves, then one move per page, a few lines each.
// Pages: ask(where) · moves 1–3 · ask(tap) · moves 4–6 · done. ──
export default function RoughFirst90() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [where, setWhere] = useState('phone');
  const [tap, setTap] = useState('yes');
  const steps = RD_FIRST90.steps(where, tap);

  const total = 9;
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/log'));
  const next = () => setI((v) => Math.min(total - 1, v + 1));
  const back = i > 0 ? () => setI(i - 1) : null;

  const stepPage = (s: { h: string; s: string }, n: number) => (
    <RDPage label={`Move ${n} of 6`} headline={s.h} sub={s.s} cta={n === 6 ? 'Done' : 'Done · next'} onNext={next} />
  );

  return (
    <>
      <StatusBar style="dark" />
      <RDShell total={total} index={i} onBack={back} onClose={close}>
        {i === 0 ? (
          <RDAsk
            label="The First 90 Seconds"
            title={RD_FIRST90.where.q}
            options={RD_FIRST90.where.options}
            onPick={(_, k) => {
              setWhere(String(k));
              next();
            }}
          />
        ) : null}
        {i >= 1 && i <= 3 ? stepPage(steps[i - 1], i) : null}
        {i === 4 ? (
          <RDAsk
            label="One more thing"
            title={RD_FIRST90.tap.q}
            options={RD_FIRST90.tap.options}
            onPick={(_, k) => {
              setTap(String(k));
              next();
            }}
          />
        ) : null}
        {i >= 5 && i <= 7 ? stepPage(steps[i - 2], i - 1) : null}
        {i === 8 ? (
          <RDPage
            label="The interrupt, run"
            headline="Most urges are past their peak by now."
            sub="If your day has a specific shape to it, take the page that matches."
            cta="Find the page for my day"
            onNext={() => router.replace('/(app)/rough-days')}
            ghost={
              <View style={{ alignItems: 'center', marginTop: 12 }}>
                <Pressable onPress={close} style={{ paddingVertical: 4, paddingHorizontal: 8 }}>
                  <AppText style={[sans('500'), { fontSize: 14.5, color: '#55534E' }]}>I’m steady now</AppText>
                </Pressable>
              </View>
            }
          />
        ) : null}
      </RDShell>
    </>
  );
}
