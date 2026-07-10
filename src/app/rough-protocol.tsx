import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui';
import { RDAsk, RDPage, RDShell } from '@/components/roughDays/kit';
import { RD_PROTOCOLS, RD_SECTIONS, type RDProtocol } from '@/content/roughDays';
import { colors, sans } from '@/lib/theme';

// ── A protocol (canvas: rd-protocol) — moment → do-this-first → asks &
// moves → hold-the-line. Any step with 2+ situational variants gets a
// questionnaire page BEFORE its tailored instruction, so you never read
// variants you don't need. ──

type Page = { kind: 'moment' } | { kind: 'first'; i: number } | { kind: 'ask'; i: number } | { kind: 'step'; i: number } | { kind: 'still' } | { kind: 'hold' };

function pfPages(p: RDProtocol): Page[] {
  const pages: Page[] = [{ kind: 'moment' }];
  p.first.forEach((_, i) => pages.push({ kind: 'first', i }));
  p.steps.forEach((s, i) => {
    if (s.ifs && s.ifs.length >= 2) pages.push({ kind: 'ask', i });
    pages.push({ kind: 'step', i });
  });
  if (p.still) pages.push({ kind: 'still' });
  pages.push({ kind: 'hold' });
  return pages;
}

const rdClean = (l: string) => {
  const t = l.replace(/^if\s+/i, '');
  return t.charAt(0).toUpperCase() + t.slice(1);
};

export default function RoughProtocol() {
  const router = useRouter();
  const { key } = useLocalSearchParams<{ key: string }>();
  const [i, setI] = useState(0);
  const [ans, setAns] = useState<Record<number, number>>({});

  const p = RD_PROTOCOLS[key || ''];
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/rough-days'));
  if (!p) return null;

  const pages = pfPages(p);
  const pg = pages[i];
  const next = () => (i + 1 >= pages.length ? close() : setI(i + 1));
  const back = i > 0 ? () => setI(i - 1) : null;
  const nSteps = p.steps.length;
  const section = RD_SECTIONS.find((s) => s.keys.includes(key || ''));

  let body = null;
  if (pg.kind === 'moment') {
    body = (
      <RDPage
        label={section ? section.label : 'Rough days'}
        headline={p.title}
        sub={p.moment}
        cta="Begin"
        onNext={next}
        ghost={
          <View style={{ alignItems: 'center', marginTop: 12 }}>
            <Pressable onPress={() => router.push('/rough-first90')} style={{ paddingVertical: 4, paddingHorizontal: 8 }}>
              <AppText style={[sans('500'), { fontSize: 13.5, color: colors.textMuted }]}>
                Urge live right now? <AppText style={[sans('600'), { fontSize: 13.5, color: colors.text }]}>First 90 Seconds</AppText> →
              </AppText>
            </Pressable>
          </View>
        }
      />
    );
  } else if (pg.kind === 'first') {
    body = <RDPage label="Do this first" headline={p.first[pg.i]} hSize={27} cta="Done" onNext={next} />;
  } else if (pg.kind === 'ask') {
    const s = p.steps[pg.i];
    const opts: [string | number, string][] = (s.ifs || []).map(([l], k) => [k, rdClean(l)]);
    if (s.d) opts.push([-1, 'Neither, really']);
    const stepIdx = pg.i;
    body = (
      <RDAsk
        key={`a${pg.i}`}
        label={`Step ${pg.i + 1} of ${nSteps}`}
        title="Which is closest?"
        options={opts}
        onPick={(idx) => {
          setAns((a) => ({ ...a, [stepIdx]: Number(opts[idx][0]) }));
          next();
        }}
      />
    );
  } else if (pg.kind === 'step') {
    const s = p.steps[pg.i];
    const pick = ans[pg.i];
    let sub: string | null = s.d || null;
    let small = null;
    if (s.ifs && s.ifs.length >= 2) {
      sub = pick === -1 || pick == null ? s.d || s.ifs[0][1] : s.ifs[pick][1];
    } else if (s.ifs && s.ifs.length === 1) {
      small = (
        <AppText center style={[sans('400'), { fontSize: 12.5, lineHeight: 19, color: colors.textSoft, marginTop: 12, maxWidth: 290 }]}>
          <AppText style={[sans('600'), { fontSize: 12.5, color: colors.textMuted }]}>{rdClean(s.ifs[0][0])}:</AppText> {s.ifs[0][1]}
        </AppText>
      );
    }
    body = (
      <RDPage
        label={`Step ${pg.i + 1} of ${nSteps}`}
        headline={s.t}
        sub={sub}
        small={small}
        hSize={28}
        cta={pg.i + 1 === nSteps && !p.still ? 'Done' : 'Done — next'}
        onNext={next}
      />
    );
  } else if (pg.kind === 'still') {
    body = <RDPage label="One more, if you need it" headline="If it’s still loud" sub={p.still} hSize={28} cta="Okay" onNext={next} />;
  } else {
    body = (
      <RDPage
        label="Hold the line"
        headline={p.hold}
        hSize={25}
        cta="I got through it"
        onNext={close}
        small={
          p.basis ? (
            <AppText center style={[sans('400'), { fontSize: 11.5, lineHeight: 17, color: colors.textSoft, marginTop: 16, maxWidth: 280 }]}>
              {p.basis}
            </AppText>
          ) : null
        }
      />
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <RDShell total={pages.length} index={i} onBack={back} onClose={close}>
        {body}
      </RDShell>
    </>
  );
}
