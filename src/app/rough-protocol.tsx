import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import { HeroBoard, MonoText, PagerDots } from '@/components/mono';
import { RD_PROTOCOLS, rdProtocolKey } from '@/content/roughDays';
import { mono } from '@/lib/theme';

/**
 * A rough-day protocol — three pages: the feeling, why the urge came with it,
 * and the one move. No frame draws it; it is the SOS response board (the kit's
 * `HeroBoard`, as `SOS Feel *` draws it): the protocol's name as the nav's
 * kicker and the ✕, the page's illustration at 190, the headline 30/36 and the
 * line under it 15/24 at 452, the third page's move as a second line in ink,
 * and the three dots that keep the whole run visible from the first page. The
 * primary sits over a ghost (bottom 96 / 60): the first page's ghost bows out
 * of the run ("Not now"), the other two step back through it.
 *
 * A key nobody knows — the `All` drawer's `?key=lonely` among them — opens a
 * protocol rather than a blank page (`rdProtocolKey`).
 */

const CTA = ['Walk through it', 'Next', 'Done'];
const GHOST = ['Not now', 'Back', 'Back'];

export default function RoughProtocol() {
  const router = useRouter();
  const { key } = useLocalSearchParams<{ key: string }>();
  const [i, setI] = useState(0);

  const p = RD_PROTOCOLS[rdProtocolKey(key)];
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/rough-days'));

  const total = p.pages.length;
  const index = Math.min(i, total - 1);
  const page = p.pages[index];

  return (
    <HeroBoard
      nav={{ centre: { title: p.title }, onClose: close }}
      hero={page.hero}
      title={page.h}
      body={page.s}
      extra={
        <>
          {page.act ? (
            <MonoText v="p" center color={mono.ink} style={{ alignSelf: 'stretch' }}>
              {page.act}
            </MonoText>
          ) : null}
          <PagerDots inline tone="light" count={total} active={index} />
        </>
      }
      cta={CTA[index]}
      onCta={() => (index + 1 >= total ? close() : setI(index + 1))}
      ghost={GHOST[index]}
      onGhost={() => (index > 0 ? setI(index - 1) : close())}
    />
  );
}
