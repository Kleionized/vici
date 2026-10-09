/**
 * The response boards — `ResponsePage`, the one layout behind all thirty
 * `SOS-Loc-*`, `SOS-Feel-*`, `SOS-Trig-*` boards and `SOS-Challenge`, drawn
 * from `src/content/sosResponses.ts` (generated from the frames by
 * `scripts/overhaul/gen-sos-boards.mjs`). `UrgeFlow` (`flow.tsx`) decides which
 * board answers which pick; this file only draws one.
 *
 * Every board is the kit's `HeroBoard` (CRITIC §7.2): the kicker in the nav
 * (`Where you are` / `What’s feeding it` / `What’s underneath`) and the ✕, the
 * shared hero at 190 × 1.1, the title 30/36 and the body 15/24 centred at 452,
 * and the primary at bottom 48 — 96 over "Give me another" on the feeling
 * branch. The challenge is the same board with the back chevron and 7 of 8
 * dashes, its hero at 111, a 26/33 title at 372 and the challenge card.
 *
 * Split out of `urge/index.tsx` (D390); sos-boards owns it. The paper sheet,
 * its close, the scene layers and the copies of `SoftBlob`/`BlurredSolid` the
 * split put here went with the old scenes (D260).
 */

import { View } from 'react-native';

import { Card, HeroBoard, MonoText } from '@/components/mono';
import { isSosBoardKey, SOS_RESPONSES, type SosBoardKey, type SosResponse } from '@/content/sosResponses';
import { mono, sans } from '@/lib/theme';

import { SupportPill } from './stages';

/**
 * An answer the content does not know falls back to its branch's "I don’t
 * know" board — never a blank screen with no way out. The flow's maps already
 * fall back the same way; this only guards a key typed wrong.
 */
function boardFor(answer: string): SosResponse {
  if (isSosBoardKey(answer)) return SOS_RESPONSES[answer];
  if (__DEV__) console.warn(`ResponsePage: no board ${JSON.stringify(answer)}`);
  const fallback: SosBoardKey = answer.startsWith('SOS-Loc-') ? 'SOS-Loc-Elsewhere' : answer.startsWith('SOS-Trig-') ? 'SOS-Trig-Unknown' : 'SOS-Feel-Unknown';
  return SOS_RESPONSES[fallback];
}

/**
 * The challenge card: a 2-point spacer (with the stack's 18 gap either side it
 * sets the card 38 under the body, as the frame does), then `r24 #1E1E1E`,
 * padding `22 22 24`, a centred column `gap 10` of the caps line and the
 * challenge 18/700/27 ink. The card spans the stack (345) — RN would otherwise
 * shrink it to the longest wrapped line, where the canvas's fit-content box
 * fills the column.
 *
 * The frame sets the sentence with no `text-wrap`; the card wraps it `pretty`
 * on web all the same: at 375, 390 and 393 that breaks exactly where the
 * greedy wrap does (`.overhaul/f-sosb-chal-wrap.mjs`), and at 430 it keeps
 * "minutes." from standing alone on the last line.
 */
function ChallengeCard({ label, text }: { label: string; text: string }) {
  return (
    <>
      <View style={{ height: 2 }} />
      <Card padding={[22, 22, 24]} style={{ alignSelf: 'stretch' }}>
        <View style={{ gap: 10, alignItems: 'center' }}>
          <MonoText v="caps" center style={{ alignSelf: 'stretch' }}>
            {label}
          </MonoText>
          <MonoText v="p" wrap="pretty" center color={mono.ink} style={{ ...sans('700'), fontSize: 18, lineHeight: 27 }}>
            {text}
          </MonoText>
        </View>
      </Card>
    </>
  );
}

/**
 * The boards that answer a heavier feeling — low, ashamed — carry a way to a
 * person under their line (B2, D467): the kit's outline pill, in the stack,
 * so it moves with it and never meets the controls.
 */
const SUPPORT_BOARDS: ReadonlySet<SosBoardKey> = new Set<SosBoardKey>(['SOS-Feel-Low', 'SOS-Feel-Ashamed']);

/**
 * `95A–97J` and `31 · The Challenge` — the board the flow shows once it knows
 * the answer. ✕ closes the interrupt, the pill moves on, and "Give me another"
 * steps the feeling rotation. The challenge's back chevron is drawn when the
 * flow hands a way back (`onBack`); without one the slot stays empty rather
 * than holding a control that does nothing.
 *
 * Every response board leads to another question, so its pill says
 * "Continue": the frames' "Done" on sixteen of them told the user they were
 * finished and then asked them more (F4, D464). The generated content keeps
 * the frames' word; the board overrides it here, so a regeneration cannot
 * bring it back.
 */
export function ResponsePage({
  answer,
  onClose,
  onNext,
  onAnother,
  onBack,
}: {
  answer: string;
  onClose: () => void;
  onNext: () => void;
  onAnother?: () => void;
  onBack?: () => void;
}) {
  const board = boardFor(answer);
  const another = Boolean(board.another && onAnother);
  const support = isSosBoardKey(answer) && SUPPORT_BOARDS.has(answer);
  return (
    <HeroBoard
      nav={{
        left: board.nav && onBack ? 'back' : 'empty',
        centre: board.nav ? { step: board.nav.step, total: board.nav.of } : board.kicker ? { title: board.kicker } : null,
        right: 'close',
        onBack,
        onClose,
      }}
      hero={board.hero}
      heroTop={board.heroTop}
      heroScale={board.heroScale}
      stackTop={board.stackTop}
      titleSize={board.titleSize}
      title={board.title}
      body={board.body}
      extra={board.challenge ? <ChallengeCard label={board.challengeLabel ?? ''} text={board.challenge} /> : support ? <SupportPill /> : undefined}
      cta="Continue"
      onCta={onNext}
      ctaBottom={another ? board.ctaBottom : 48}
      ghost={another ? 'Give me another' : undefined}
      onGhost={onAnother}
    />
  );
}
