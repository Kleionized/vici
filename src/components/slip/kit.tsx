import { useState, type ReactNode } from 'react';
import { useWindowDimensions, View } from 'react-native';

import { CheckDisc, GhostLink, Hero, heroArtTop, NavBar, PrimaryButton, Screen, ScrollRegion, useCanvasTop, type NavCentre } from '@/components/mono';
import type { HeroKey } from '@/content/heroes';

/**
 * The post-slip flow's two layouts that are not hero boards — canvas 98C, 98D,
 * 98E, 98F and 98J. (The other twenty-six frames are the kit's `HeroBoard`.)
 *
 * A question board is the kit's nav row, a left-aligned stack at canvas 136, an
 * optional decorative hero drawn **under** the stack (the frames paint the svg
 * before the stack), the primary at `bottom 48` — or `96` over a ghost link at
 * `60`. On a short phone (D320) the hero drops out once its art would reach the
 * controls; a stack that still meets the controls rises toward 108 (8 under the
 * nav row — logs' Lapse When, the same board, does the same) and only then the
 * band between the nav row (100) and the controls scrolls, so nothing ever runs
 * under the pill. At 393 × 852 everything sits exactly where the frame puts it
 * and nothing moves or scrolls.
 */

/** The nav row's bottom edge — where the scrolling band starts (canvas `top 60, height 40`). */
const BAND_TOP = 100;
/** The stack's canvas top on every question board. */
const STACK_TOP = 136;
/** Space between the band's content and the controls when it does scroll. */
const END_GAP = 24;
/** How high a stack or the done board's disc may rise on a short phone: 8 under the nav row. */
const LIFT_FLOOR = 108;

export function SlipQuestion({
  back,
  dashes,
  onBack,
  onClose,
  hero,
  gap,
  children,
  cta,
  onCta,
  ctaDisabled,
  ghost,
  onGhost,
  overlay,
}: {
  /** the back chevron (98C, 98D); every other board keeps the slot empty */
  back?: boolean;
  /** lit dashes of eight (98C 3, 98D 5) */
  dashes?: number;
  onBack?: () => void;
  onClose: () => void;
  /** the decorative hero under the stack: its id, canvas top and scale */
  hero?: { id: HeroKey; top: number; scale?: number };
  /** the stack's gap (98C 14, 98D/98F 8, 98J 14) */
  gap: number;
  children: ReactNode;
  cta: string;
  onCta: () => void;
  ctaDisabled?: boolean;
  ghost?: string;
  onGhost?: () => void;
  /** a sheet, rendered last so it covers the board */
  overlay?: ReactNode;
}) {
  // the controls' reach off the bottom edge: the pill (58) at 48, or at 96 over the ghost
  const controls = ghost ? 96 + 58 : 48 + 58;
  const centre: NavCentre = dashes != null ? { step: dashes, total: 8 } : null;
  const { height } = useWindowDimensions();
  const canvasTop = useCanvasTop();
  // The stack's height, once measured. A stack that grows into the art — a
  // three-line pledge, a long first name — drops it as a short phone does
  // (D320 rule 1); every frame keeps 36 pt or more between the two.
  const [stackH, setStackH] = useState(0);
  const stackBottom = STACK_TOP + stackH;
  const heroClear = hero != null && stackH > 0 && stackBottom + 16 <= heroArtTop(hero.id, hero.top, hero.scale);
  // A stack that would end inside END_GAP of the controls rises by the deficit, never above LIFT_FLOOR.
  const controlsTop = height - canvasTop - controls;
  const lift = stackH > 0 ? Math.max(0, Math.min(Math.ceil(stackBottom + END_GAP - controlsTop), STACK_TOP - LIFT_FLOOR)) : 0;
  return (
    <Screen>
      {hero && heroClear ? <Hero id={hero.id} top={hero.top} scale={hero.scale} controls={controls} /> : null}
      <NavBar left={back ? 'back' : 'empty'} centre={centre} right="close" onBack={onBack} onClose={onClose} />
      <ScrollRegion top={BAND_TOP} bottom={controls}>
        {/* hidden until measured, so a short phone never sees the stack jump */}
        <View style={[{ paddingTop: STACK_TOP - lift - BAND_TOP, paddingHorizontal: 24, paddingBottom: END_GAP }, stackH > 0 ? null : { opacity: 0 }]}>
          <View onLayout={(e) => setStackH(e.nativeEvent.layout.height)} style={{ gap }}>
            {children}
          </View>
        </View>
      </ScrollRegion>
      <PrimaryButton label={cta} onPress={onCta} disabled={ctaDisabled} bottom={ghost ? 96 : 48} />
      {ghost ? <GhostLink label={ghost} onPress={onGhost} /> : null}
      {overlay}
    </Screen>
  );
}

/** 98E's check disc — the board's art, at canvas 200. */
const DISC_TOP = 200;

/**
 * 98E — the done board (Lapse Done and Urge Log Done draw the same one): the
 * nav's ✕ alone, the 84 check disc at canvas 200, a centred stack at 308
 * (gap 12) and the primary at `bottom 48`.
 *
 * The disc is this board's art, so a short phone treats it as a hero board
 * (D320 rule 2): disc and stack rise together by the deficit, never above 108,
 * and only what still does not fit scrolls. At 375 × 667 the four-row card then
 * sits whole above the pill (as Lapse Done's does) instead of running into it
 * at 200 and scrolling. At 393 × 852 the lift is 0.
 */
export function SlipDone({ onClose, children, cta, onCta }: { onClose: () => void; children: ReactNode; cta: string; onCta: () => void }) {
  const { height } = useWindowDimensions();
  const canvasTop = useCanvasTop();
  const [h, setH] = useState(0);
  const controls = 48 + 58;
  const controlsTop = height - canvasTop - controls;
  const lift = h > 0 ? Math.max(0, Math.min(Math.ceil(DISC_TOP + h + END_GAP - controlsTop), DISC_TOP - LIFT_FLOOR)) : 0;
  return (
    <Screen>
      <NavBar left="empty" right="close" onClose={onClose} />
      <ScrollRegion top={BAND_TOP} bottom={controls}>
        {/* hidden until measured, so a short phone never sees it jump (HeroBoard does the same) */}
        <View style={[{ paddingTop: DISC_TOP - lift - BAND_TOP, paddingBottom: END_GAP }, h > 0 ? null : { opacity: 0 }]}>
          <View onLayout={(e) => setH(e.nativeEvent.layout.height)}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <CheckDisc size={84} />
            </View>
            {/* 308 − (200 + 84): the stack's own top */}
            <View style={{ marginTop: 24, paddingHorizontal: 24, gap: 12, alignItems: 'center' }}>{children}</View>
          </View>
        </View>
      </ScrollRegion>
      <PrimaryButton label={cta} onPress={onCta} />
    </Screen>
  );
}

/** The literal spacer `<div height:N>` the frames put inside a stack — it adds N plus one more gap. */
export function Gap({ h }: { h: number }) {
  return <View style={{ height: h }} />;
}

/** What fed it — the nine chips of 98D, in the frame's order. */
export type FedName = 'Bored' | 'Lonely' | 'Stressed' | 'Tired' | 'Phone in bed' | 'Late night' | 'Sexual content' | 'Argument' | 'Not sure';

export const SLIP_FED: readonly FedName[] = ['Bored', 'Lonely', 'Stressed', 'Tired', 'Phone in bed', 'Late night', 'Sexual content', 'Argument', 'Not sure'];

/** 98E splits the one question across two rows: the feelings, then the situations. */
export const FED_FEELINGS: readonly FedName[] = ['Bored', 'Lonely', 'Stressed', 'Tired', 'Not sure'];
