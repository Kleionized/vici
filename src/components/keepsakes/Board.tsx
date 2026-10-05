import { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';

import { MonoText, NavBar, PrimaryButton, Screen, ScrollRegion, Tap, TierLadder, type Tier } from '@/components/mono';
import { mono, sansItalic } from '@/lib/theme';

import { FaceCoin, type KeepsakeSceneKey } from './Medallion';

/**
 * The medallion board (medallions-letters §1.5): the face's own page, as
 * `Breakwater *` / `Detail *` draw it, and the ladder page `Tiers *` draws on
 * the same bones. Everything hangs off one anchor, **T** — the coin's top:
 *
 * | piece | canvas y |
 * |---|---|
 * | 168 coin | T |
 * | name 32/38, line 15/22, 4 spacer, caps 13/700 (`gap 8`) | T + 196 |
 * | the tier track (absolute — it does not follow the stack) | T + 338 |
 * | the italic quote (boards) | T + 438 (T + 338 with no track) |
 * | the count block (ladders) | T + 448 |
 * | primary | bottom 48 |
 *
 * The boards centre the whole block on the quote's length:
 * `T = 196 − 13 · quoteLines`, measured on all ten (CRITIC §5, Q4) — plus one
 * on the two Platinum frames, which sit a point lower than their siblings
 * (`nudge`). The ladders always sit at T 155.
 *
 * Between the nav row and the pill the page is a `ScrollRegion` (D320): at
 * 852 nothing moves, on a 667 phone the block scrolls rather than run under
 * the pill, and stops 24 above it.
 */

const NAV_BOTTOM = 100;
/** the primary at bottom 48 and its 58 */
const CONTROLS = 106;
const QUOTE_LH = 28;
/** the quote's `left 44 right 44` at 393: the measure every frame breaks its lines in */
const QUOTE_INSET = 44;
const QUOTE_W = 393 - 2 * QUOTE_INSET;
/** what the block keeps clear above the pill when it scrolls (D320) */
const CLEAR = 24;

export type BoardBelow = { kind: 'quote'; text: string; nudge?: number } | { kind: 'count'; count: string; next?: string };

export function MedalBoard({
  scene,
  earned,
  numeral,
  title,
  body,
  caps,
  capsMuted,
  onCaps,
  capsLabel,
  ladder,
  onLadder,
  below,
  cta,
  onCta,
  onBack,
  onShare,
}: {
  scene: KeepsakeSceneKey;
  earned: boolean;
  numeral?: string;
  title: string;
  body: string;
  caps: string;
  /** `#5A574F` caps — a face with nothing behind it */
  capsMuted?: boolean;
  /** makes the caps line the door (the one-offs' way to their shared page) */
  onCaps?: () => void;
  capsLabel?: string;
  /** the tier track; omitted for a face that mints once */
  ladder?: { reached: -1 | Tier; progress?: number; thresholds?: readonly string[] };
  /** makes the track the door to the face's ladder page */
  onLadder?: () => void;
  below: BoardBelow;
  cta: string;
  onCta: () => void;
  onBack: () => void;
  /** draws the nav's share icon */
  onShare?: () => void;
}) {
  const [lines, setLines] = useState(0);
  const { width } = useWindowDimensions();
  // On a wider phone the quote keeps the frame's 305 measure, centred, so its
  // lines break where the frames break them (the Drop's perk rule, D279): left free, a
  // 430 window sets "The / wall did." and "unsure of a / while ago.", and a
  // quote that drops to one line moves the whole block 13 lower. Exactly 44 at
  // 393 and below.
  const quoteInset = Math.max(QUOTE_INSET, (width - QUOTE_W) / 2);
  const quote = below.kind === 'quote';
  // A face that mints once has no track (no frame draws one): its quote takes
  // the track's place and the shorter block stays centred where the boards'
  // blocks centre — 100 less block, so T sits 50 lower.
  const T = quote ? 196 - 13 * lines + (below.nudge ?? 0) + (ladder ? 0 : 50) : 155;
  // until the quote has been measured its line count — and so T — is unknown;
  // nothing is shown rather than one frame at the wrong height
  const hidden = quote && lines === 0 ? { opacity: 0 } : null;
  const belowTop = T + (quote ? (ladder ? 438 : 338) : 448);
  const belowBottom = belowTop + (quote ? Math.max(1, lines) * QUOTE_LH : 78);
  const y = (canvas: number) => canvas - NAV_BOTTOM;

  const capsText = (
    <MonoText v="caps" center color={capsMuted ? mono.art : mono.mute}>
      {caps}
    </MonoText>
  );

  return (
    <Screen>
      <NavBar left="back" right={onShare ? 'share' : null} onBack={onBack} onShare={onShare} />
      <ScrollRegion top={NAV_BOTTOM} bottom={CONTROLS}>
        <View style={[{ height: belowBottom + CLEAR - NAV_BOTTOM }, hidden]}>
          <View style={{ position: 'absolute', left: 0, right: 0, top: y(T), alignItems: 'center' }}>
            <FaceCoin scene={scene} size={168} earned={earned} numeral={numeral} />
          </View>

          <View style={{ position: 'absolute', left: 24, right: 24, top: y(T + 196), alignItems: 'center', gap: 8 }}>
            <MonoText v="titlePage" center style={{ alignSelf: 'stretch' }}>
              {title}
            </MonoText>
            <MonoText v="pTight" center style={{ alignSelf: 'stretch' }}>
              {body}
            </MonoText>
            <View style={{ height: 4 }} />
            {onCaps ? (
              <Tap onPress={onCaps} label={capsLabel ?? caps} hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}>
                {capsText}
              </Tap>
            ) : (
              capsText
            )}
          </View>

          {ladder ? (
            onLadder ? (
              <Tap onPress={onLadder} label="See every tier" style={{ position: 'absolute', left: 24, right: 24, top: y(T + 338) }}>
                <TierLadder reached={ladder.reached} progress={ladder.progress} thresholds={ladder.thresholds} />
              </Tap>
            ) : (
              <TierLadder
                reached={ladder.reached}
                progress={ladder.progress}
                thresholds={ladder.thresholds}
                style={{ position: 'absolute', left: 24, right: 24, top: y(T + 338) }}
              />
            )
          ) : null}

          {below.kind === 'quote' ? (
            <MonoText
              wrap="pretty"
              onLayout={(e) => setLines(Math.max(1, Math.round(e.nativeEvent.layout.height / QUOTE_LH)))}
              style={{ position: 'absolute', left: quoteInset, right: quoteInset, top: y(belowTop), textAlign: 'center', ...sansItalic(), fontSize: 18, lineHeight: QUOTE_LH, color: mono.ink }}>
              {below.text}
            </MonoText>
          ) : (
            <View style={{ position: 'absolute', left: 24, right: 24, top: y(belowTop), alignItems: 'center', gap: 6 }}>
              <MonoText v="titlePage" wrap="nowrap" style={{ fontSize: 48, lineHeight: 50, letterSpacing: -1.7 }}>
                {below.count}
              </MonoText>
              {below.next ? (
                <MonoText v="pTight" wrap="nowrap" center color={mono.mute}>
                  {below.next}
                </MonoText>
              ) : null}
            </View>
          )}
        </View>
      </ScrollRegion>
      <PrimaryButton label={cta} onPress={onCta} />
    </Screen>
  );
}
