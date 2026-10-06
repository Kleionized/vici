import { memo, useState, type ReactNode } from 'react';
import { useWindowDimensions, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect, Text as SvgText } from 'react-native-svg';

import { HERO_BOUNDS, HERO_BOX, HERO_PAINT_X, HERO_SCALE, HEROES, heroId, type HeroKey, type HeroNode } from '@/content/heroes';
import { mono, monoDark } from '@/lib/theme';

import { GhostLink, PrimaryButton } from './buttons';
import { NavBar, type NavCentre, type NavLeft, type NavRight } from './NavBar';
import { Screen, ScrollRegion, useCanvasTop } from './Screen';
import { MonoText } from './Text';

/**
 * The illustrations (design-system §7.29, CRITIC §7.1). The canvas draws every
 * hero as a 393 × 240 `<svg>` with `overflow: visible`, scaled by a CSS
 * transform about (196, 190) of its own box — so the art runs past the box on
 * every side and the frame clips it. Native SVG does not honour
 * `overflow: visible`, and a 393 box stops full-bleed floors short on a wider
 * phone, so none of that is reproduced literally: each hero is a screen-wide
 * `<Svg>` covering only the art's vertical band (its bounds, plus two points),
 * and the frame's transform becomes one `translate · scale` on the art. At 393
 * it lands every point where the canvas does; on 375 or 430 the art stays
 * centred and full-bleed art reaches both edges.
 */

const FRAME_W = 393;
const FRAME_H = 852;
/** points of canvas kept above and below the art's bounds (the bounds already sit ≥ 0.8 outside the paint) */
const BLEED = 2;

const fmt = (v: number) => String(Number(v.toFixed(6)));

function Shape({ n }: { n: HeroNode }) {
  const p = n.p as Record<string, string>;
  switch (n.t) {
    case 'g':
      return (
        <G {...p}>
          {n.c?.map((c, i) => <Shape key={i} n={c} />)}
        </G>
      );
    case 'rect':
      return <Rect {...p} />;
    case 'path':
      return <Path {...p} d={p.d} />;
    case 'circle':
      return <Circle {...p} />;
    case 'ellipse':
      return <Ellipse {...p} />;
    case 'text':
      return <SvgText {...p}>{n.s}</SvgText>;
  }
}

/** The art itself, in the card's 393 × 240 user space — for a caller that places it in its own `<Svg>`. Static, so memoised. */
export const HeroArt = memo(function HeroArt({ id }: { id: HeroKey }) {
  return (
    <>
      {HEROES[heroId(id)].map((n, i) => (
        <Shape key={i} n={n} />
      ))}
    </>
  );
});

/**
 * Draws the art mapped by user (x, y) → (ox + k·x, oy + k·y) in its parent's
 * coordinates, over the full `width`, on a canvas that spans only the art's
 * vertical bounds. The canvas is snapped to whole points and the offset folded
 * into the art's transform, so the art lands at the frame's fractional
 * positions however the box itself is rounded.
 */
function Placed({ id, ox, oy, k, width }: { id: HeroKey; ox: number; oy: number; k: number; width: number }) {
  const [t, b] = HERO_BOUNDS[heroId(id)];
  const top = Math.floor(oy + k * t - BLEED);
  const height = Math.ceil(oy + k * b + BLEED) - top;
  return (
    <View
      pointerEvents="none"
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={{ position: 'absolute', left: 0, top, width, height }}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', left: 0, top: 0 }}>
        <G transform={`translate(${fmt(ox)} ${fmt(oy - top)}) scale(${fmt(k)})`}>
          <HeroArt id={id} />
        </G>
      </Svg>
    </View>
  );
}

/** Where the CSS-mode transform puts user (0, 0): the 393 box centred in `width`, scaled `s` about (196, 190). */
function cssOrigin(top: number, s: number, width: number) {
  return { ox: (width - FRAME_W) / 2 + 196 * (1 - s), oy: top + 190 * (1 - s) };
}

/**
 * Today II / Task / III draw their hero as a viewBox crop, not a scale
 * (today-day §0.5): from the bounds, `vy = t − 3`, `vh = b − t + 6`,
 * `s = round2(148 / vh)`, `vw = W / s`, `vx = 196.5 − vw / 2`, height
 * `round1(vh · s)` — rounded as the frame writes them — and the browser's
 * default `xMidYMid meet` fit of that viewBox into that box.
 *
 * The crop's box sits at a fractional `top` (241.3, 231.5), and the browser
 * paints an `<svg>`'s content from its border box's origin **snapped to the
 * whole point** (measured on both frames: the art lands as if `top` were 241
 * and 232, at its unsnapped scale — every band of the art within 0.07 pt). A
 * board that kept 241.3 would sit 0.3 pt low along every horizontal edge, so
 * the snap is kept. The CSS-mode heroes sit at whole-point tops and never snap.
 */
export function heroCrop(key: HeroKey, top: number, width = FRAME_W) {
  const [t, b] = HERO_BOUNDS[heroId(key)];
  const r2 = (v: number) => Math.round(v * 100) / 100;
  const vy = t - 3;
  const vh = b - t + 6;
  const s = r2(148 / vh);
  const vw = r2(width / s);
  const vx = r2(196.5 - vw / 2);
  const height = Math.round(vh * s * 10) / 10;
  let k = Math.min(width / vw, height / vh);
  let ox = (width - vw * k) / 2 - vx * k;
  let oy = Math.round(top) + (height - vh * k) / 2 - vy * k;
  /* A full-bleed floor (painted −40 … 433) must reach both edges. The fit above
     leaves it short whenever width/s exceeds the painted width — nightMoon at
     430, openDoor and lighthouse at every width. Grow the art just enough to
     cover, about the box's centre. Every crop a frame draws already covers at
     393 (within the 1 pt slack), so the frames are untouched. */
  const [px0, px1] = HERO_PAINT_X[heroId(key)];
  if (px0 <= -39 && px1 >= 432 && (ox + px0 * k > 1 || ox + px1 * k < width - 1)) {
    const cx = width / 2, cy = oy + ((vy + vh / 2) * k);
    const ax = (px0 + px1) / 2;
    const k2 = width / (px1 - px0);
    ox = cx - ax * k2;
    oy = cy - (vy + vh / 2) * k2;
    k = k2;
  }
  return { vx, vy, vw, vh, width, height, k, ox, oy };
}

type HeroCss = {
  mode?: 'css';
  id: HeroKey;
  /** the svg's canvas `top` */
  top: number;
  /** the frame's `transform: scale(s)`; defaults to the card's own (1.1; the medal 1) */
  scale?: number;
  width?: number;
  /**
   * A decorative hero between the content and the bottom controls (the
   * question boards' T 458 / 506 / 582, the check-in heroes): the space the
   * controls take off the screen's bottom edge — 106 for the primary at
   * bottom 48, 0 for a board with none. Given, the hero is not drawn when its
   * art would come within 16 of them (or of the edge) — D320 rule 1. At
   * 393 × 852 every frame keeps ≥ 21.8 there, so it only acts on shorter phones.
   */
  controls?: number;
};
type HeroCrop = { mode: 'crop'; id: HeroKey; top: number; width?: number };
type HeroBoxProps = {
  mode: 'box';
  id: HeroKey;
  /** the content gutter the box bleeds through (`margin: 0 −32px`) */
  bleed?: number;
  width?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * One hero, three ways the frames place it:
 *
 * - **css** (default) — `<svg style="left:0; top:T; transform:scale(s);
 *   transform-origin:196px 190px">` on a board. `top` is the frame's T in
 *   canvas coordinates (a child of `Screen`); a point (x, y) lands at
 *   (196 + s(x − 196), round(T) + 190 + s(y − 190)).
 * - **crop** — Today II / Task / III's viewBox crop at `top` (`heroCrop`).
 * - **box** — the lesson reader's in-flow `393 × h` box with the svg at its
 *   `HERO_BOX` top inside (lessons §5.2): render it in the content column, and
 *   it bleeds through the column's gutter to the screen edges.
 *
 * Always absolutely positioned art (the web SVG trap) and never a touch target.
 */
export function Hero(props: HeroCss | HeroCrop | HeroBoxProps) {
  const win = useWindowDimensions();
  const canvasTop = useCanvasTop();
  const width = props.width ?? win.width;
  if (props.mode === 'crop') {
    const c = heroCrop(props.id, props.top, width);
    return <Placed id={props.id} ox={c.ox} oy={c.oy} k={c.k} width={width} />;
  }
  const id = heroId(props.id);
  if (props.mode === 'box') {
    const { h, top } = HERO_BOX[id];
    const s = HERO_SCALE[id];
    const { ox, oy } = cssOrigin(top, s, width);
    const bleed = props.bleed ?? 32;
    return (
      <View pointerEvents="none" style={[{ width, height: h, marginHorizontal: -bleed, flexShrink: 0 }, props.style]}>
        <Placed id={id} ox={ox} oy={oy} k={s} width={width} />
      </View>
    );
  }
  const s = props.scale ?? HERO_SCALE[id];
  // the screen's bottom edge in canvas y is `height − canvasTop` (Screen's children box)
  // whole points: the art's bottom is a fraction (716.034) and a 0.03 pt overrun must not drop it
  const shortfall = props.controls != null ? Math.round(heroArtBottom(id, props.top, s)) + 16 - (win.height - canvasTop - props.controls) : 0;
  // A small shortfall (a phone a few points shorter than the frame) raises the art
  // instead of losing it — every such board keeps ≥ 30 clear above its art at 852
  // (D349). A larger one drops it (D320 rule 1).
  if (shortfall > 16) return null;
  const rise = Math.max(0, shortfall);
  /* A hero between the content and the bottom controls belongs to the bottom
     of the board: T 506 sets its box on the primary's top, T 582 30 above the
     edge. On a phone taller than the frame it keeps that distance to the
     bottom instead of to the top, so the extra height opens above the art
     rather than between the art and the pill (D344). The frame (852) and
     shorter phones are untouched — there `controls` already drops the art when
     it would meet the controls. */
  const extra = props.controls != null ? Math.max(0, win.height - canvasTop - FRAME_H) : 0;
  // the browser paints the svg from its box's origin snapped to the whole point (see heroCrop) — the
  // week covers' 98.9, 63.9, 114.4 and 88.8 draw as 99, 64, 114 and 89
  const { ox, oy } = cssOrigin(Math.round(props.top) + Math.round(extra) - rise, s, width);
  return <Placed id={id} ox={ox} oy={oy} k={s} width={width} />;
}

/** Canvas y of the hero's art top (its bounds) when drawn in CSS mode. */
export function heroArtTop(key: HeroKey, top: number, scale?: number) {
  const id = heroId(key);
  const s = scale ?? HERO_SCALE[id];
  return Math.round(top) + 190 + s * (HERO_BOUNDS[id][0] - 190);
}

/** Canvas y of the hero's art bottom (its bounds) when drawn in CSS mode. */
export function heroArtBottom(key: HeroKey, top: number, scale?: number) {
  const id = heroId(key);
  const s = scale ?? HERO_SCALE[id];
  return Math.round(top) + 190 + s * (HERO_BOUNDS[id][1] - 190);
}

const TITLE_VARIANT = { 26: 'h1', 30: 'title', 34: 'titleCover' } as const;

/**
 * The hero board (CRITIC §7.2): a nav row, a hero at `top 190`, a centred
 * stack under it (caps · title · body · extra) and the primary — over a ghost
 * link when there is one. One component for the SOS / slip / relapse / surf
 * boards (title 30/36, stack 452, gap 18), the statement boards of the funnel
 * and the tail (title 26/33, stack 451, gap 16 or 18), the check-in covers
 * (34/40, gap 12) and the dark `#111111` boards. A board whose art is not an
 * illustration (Drop Received's medal at 212) passes it as `art`, in canvas
 * coordinates, with `artTop` for the small-screen cap.
 *
 * Small screens (D320): when the stack would come within 16 of the highest
 * control, the hero and the stack rise together by the deficit (whole points,
 * so the art and the text move as one) — never so far that the art's top
 * passes canvas 108, under the nav row. Where that is not enough (no frame
 * needs it; Dynamic Type on a 667 phone could) the art is dropped — it is
 * decoration (rule 1) — and the stack rises alone up to 108, then scrolls
 * between 108 and the controls: never under a control. Until the stack has
 * been measured the art and the stack are not shown, so a short screen does
 * not draw one unlifted frame and jump. At 393 × 852 every board is exactly
 * the frame.
 */
export function HeroBoard({
  tone = 'light',
  nav,
  hero,
  art,
  artTop,
  heroTop = 190,
  heroScale,
  stackTop = 452,
  gap = 18,
  caps,
  title,
  titleSize = 30,
  body,
  extra,
  cta,
  onCta,
  ctaDisabled,
  ctaBottom,
  ghost,
  onGhost,
  children,
}: {
  tone?: 'light' | 'dark';
  nav?: { left?: NavLeft; centre?: NavCentre; right?: NavRight; onBack?: () => void; onClose?: () => void };
  hero?: HeroKey;
  /** art drawn instead of a hero — children of a canvas-coordinate layer that rises with the stack */
  art?: ReactNode;
  /** canvas y of `art`'s top (caps the small-screen lift at 108); without it the art cannot rise, so a short screen drops it */
  artTop?: number;
  heroTop?: number;
  heroScale?: number;
  stackTop?: number;
  gap?: number;
  caps?: string;
  title: string;
  titleSize?: 26 | 30 | 34;
  /** a string is the board's paragraph (15/24 sub); a node replaces it */
  body?: ReactNode;
  /** anything the stack carries after the body (a chip, a card, the places row) */
  extra?: ReactNode;
  cta: string;
  onCta?: () => void;
  ctaDisabled?: boolean;
  /** 48, or 96 over a ghost link (the default when there is one) */
  ctaBottom?: number;
  ghost?: string;
  onGhost?: () => void;
  children?: ReactNode;
}) {
  const dark = tone === 'dark';
  const { height: winH, width: winW } = useWindowDimensions();
  // The text column keeps the frame's 345 on a wider phone, so the frame's line
  // breaks hold at 430 instead of re-wrapping across 382 (D404); 24 at 393.
  const gutter = Math.max(24, (winW - 345) / 2);
  const canvasTop = useCanvasTop();
  const [stackH, setStackH] = useState(0);
  const bottom = ctaBottom ?? (ghost ? 96 : 48);

  // canvas y of the highest control's top (the screen's bottom edge is `winH − canvasTop`)
  const controlsTop = winH - canvasTop - bottom - 58;
  const measured = stackH > 0;
  const deficit = Math.ceil(stackTop + stackH + 16 - controlsTop);
  const room = Math.floor(Math.max(0, (hero ? heroArtTop(hero, heroTop, heroScale) : (artTop ?? 108)) - 108));
  let lift = 0;
  let dropArt = false;
  let scroll = false;
  /* Where a lift by the whole deficit would push the art under the nav, the art
     rises as far as it can (its top to 108) and keeps its place, and the stack
     scrolls in the band between where it then starts and the controls — D320
     rule 2, then rule 3. Only when that band is too short to read in (under
     MIN_BAND) is the art let go, and then the stack is centred between the nav
     and the controls rather than lifted by the deficit, so the board does not
     open on empty ground (D349). */
  const MIN_BAND = 160;
  if (measured && deficit > 0) {
    if (deficit <= room) lift = deficit;
    else if (controlsTop - 16 - (stackTop - room) >= MIN_BAND) {
      lift = room;
      scroll = true;
    } else {
      dropArt = true;
      const band = controlsTop - 16 - 108;
      lift = stackTop - 108 - Math.max(0, Math.floor((band - stackH) / 2));
      scroll = stackH > band;
    }
  }
  const scrollTop = dropArt ? 108 : stackTop - lift;
  const hidden = measured ? null : { opacity: 0 };

  const stack = (
    <View
      onLayout={(e) => setStackH(e.nativeEvent.layout.height)}
      style={[scroll ? { gap, alignItems: 'center' } : { position: 'absolute', left: gutter, right: gutter, top: stackTop - lift, gap, alignItems: 'center' }, hidden]}>
      {caps ? (
        <MonoText v="caps" center color={dark ? monoDark.caps : mono.mute} style={{ alignSelf: 'stretch' }}>
          {caps}
        </MonoText>
      ) : null}
      <MonoText v={TITLE_VARIANT[titleSize]} center color={dark ? monoDark.text : mono.ink} style={{ alignSelf: 'stretch' }}>
        {title}
      </MonoText>
      {typeof body === 'string' ? (
        <MonoText v="p" center color={dark ? monoDark.body : mono.sub} style={{ alignSelf: 'stretch' }}>
          {body}
        </MonoText>
      ) : (
        body
      )}
      {extra}
    </View>
  );

  return (
    <Screen variant={dark ? 'dark' : 'app'}>
      <NavBar
        tone={tone}
        left={nav?.left ?? 'empty'}
        centre={nav?.centre ?? null}
        right={nav?.right ?? 'close'}
        onBack={nav?.onBack}
        onClose={nav?.onClose}
      />
      {hero && !dropArt ? (
        <View pointerEvents="none" style={[{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }, hidden]}>
          <Hero id={hero} top={heroTop - lift} scale={heroScale} />
        </View>
      ) : null}
      {art && !dropArt ? (
        <View pointerEvents="box-none" style={[{ position: 'absolute', left: 0, right: 0, top: -lift, bottom: lift }, hidden]}>
          {art}
        </View>
      ) : null}
      {scroll ? (
        <ScrollRegion top={scrollTop} bottom={bottom + 58} contentStyle={{ paddingHorizontal: gutter, paddingBottom: 16 }}>
          {stack}
        </ScrollRegion>
      ) : (
        stack
      )}
      <PrimaryButton label={cta} onPress={onCta} bottom={bottom} tone={tone} disabled={ctaDisabled} />
      {ghost ? <GhostLink label={ghost} onPress={onGhost} tone={tone} /> : null}
      {children}
    </Screen>
  );
}
