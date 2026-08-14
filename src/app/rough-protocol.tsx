import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import { RDMovePage } from '@/components/roughDays/kit';
import { RD_PROTOCOLS } from '@/content/roughDays';

// ── A protocol (canvas 001–021) — three pages: the feeling, why the urge came
// with it, and the one move. The dots count all three, so the whole run is
// visible from the first page. The first page's ghost bows out of the run
// ("Not tonight"); the other two step back through it. ──

export default function RoughProtocol() {
  const router = useRouter();
  const { key } = useLocalSearchParams<{ key: string }>();
  const [i, setI] = useState(0);

  const p = RD_PROTOCOLS[key || ''];
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/rough-days'));
  if (!p) return null;

  const total = p.pages.length;
  const index = Math.min(i, total - 1);
  const page = p.pages[index];

  return (
    <>
      <StatusBar style="dark" />
      <RDMovePage
        art={page.art}
        total={total}
        index={index}
        headline={page.h}
        sub={page.s}
        act={page.act}
        onNext={() => (index + 1 >= total ? close() : setI(index + 1))}
        onGhost={() => (index > 0 ? setI(index - 1) : close())}
        onClose={close}
      />
    </>
  );
}
