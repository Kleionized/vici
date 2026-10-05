/**
 * Urge-surfing kit — the dark SOS stages and what the rest of the urge kit
 * stands on.
 *
 * `85F · Breathe` and the three stages no frame draws (number tap, odd one
 * out, the 90-second ring), their settings sheet, and the pieces `flow.tsx`,
 * `hub.tsx` and `src/app/relapse.tsx` all read: the question board, the dark
 * hub shell, the ring 85A draws, the SOS settings and the stage order. It is
 * the bottom of the kit — it imports from neither sibling, so the three never
 * form a cycle (D390).
 *
 * Every stage is the hub's dark board (`#111111`, `noise-dark` @ 0.09 — the
 * kit's `dark` Screen): the nav's "Ride it out", a head at 160, the play area,
 * and the white primary at `bottom 96` over "I slipped". 85F is the first
 * stage; the other three are set on its shell (D252).
 */

import { type ReactNode, useEffect, useRef, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Reanimated, { Easing, cancelAnimation, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, LinearGradient as SvgGrad, Path, RadialGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';

import {
  Check,
  GhostLink,
  Hero,
  MonoText,
  NavBar,
  PagerDots,
  PrimaryButton,
  Screen,
  ScrollRegion,
  Segmented,
  Sheet,
  Tap,
  useCanvasTop,
  type NavLeft,
} from '@/components/mono';
import type { HeroKey } from '@/content/heroes';
import { roman } from '@/lib/format';
import { LATO, mono, monoDark, sans } from '@/lib/theme';

// ════════ BOARDS ════════════════════════════════════════════════════════════

/** The nav row's bottom edge — where every scrolling band starts (canvas `top 60, height 40`). */
const BAND_TOP = 100;
/** The space a band leaves under its content when it does scroll. */
const END_GAP = 24;

/**
 * A band in canvas coordinates between the nav row and the controls (D320
 * rule 3). Its children are laid out exactly as the frame writes them — a
 * child's `top: 160` is the canvas's 160 — inside a scroller that only moves
 * when the content (which reaches canvas `height`) does not fit above the
 * controls. At 393 × 852 nothing on any SOS board scrolls.
 *
 * `lift` raises everything in the band by that many points first — the hub's
 * panes on a short phone (D258), never past `BAND_LIFT`.
 *
 * The `END_GAP` under the content belongs to a band that scrolls; content that
 * fits — however closely — leaves the band still (a pane fitted to the dots'
 * edge once had 24 to drag its head under the nav).
 */
export function CanvasBand({ controls, height, lift = 0, children }: { controls: number; height: number; lift?: number; children: ReactNode }) {
  const fits = height - lift <= useBandBottom(controls);
  return (
    <ScrollRegion top={BAND_TOP} bottom={controls}>
      <View style={{ height: height - lift - BAND_TOP + (fits ? 0 : END_GAP), pointerEvents: 'box-none' }}>
        <View style={{ position: 'absolute', left: 0, right: 0, top: -BAND_TOP - lift, height, pointerEvents: 'box-none' }}>{children}</View>
      </View>
    </ScrollRegion>
  );
}

/**
 * The most a band lifts: the head (canvas 160) then starts at 108, the floor
 * the kit's `HeroBoard` keeps its art above on the same phones.
 */
export const BAND_LIFT = 160 - 108;

/**
 * The canvas y a band's content may reach on this screen: `controls` off the
 * screen's bottom edge (D026), less `clear` — the 16 the policy keeps between
 * content and a control, when `controls` does not already hold it.
 */
export function useBandBottom(controls: number, clear = 0) {
  const { height } = useWindowDimensions();
  const canvasTop = useCanvasTop();
  return height - canvasTop - controls - clear;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/**
 * Where a block of play, `[from, to]` in the frame's canvas y, goes on this
 * screen: unchanged when it fits between `area.top` and `area.bottom` (every
 * board at 393 × 852), else moved — never past the head — as far as it must.
 * Returns the offset; a block taller than the area gets the first that fits
 * its top, and the stage then squeezes what it can.
 */
function shiftInto(from: number, to: number, area: PlayArea) {
  return clamp(from, area.top, Math.max(area.top, area.bottom - (to - from))) - from;
}

/**
 * The interrupt's question board (SOS Strength, Cue Hue Picker, the two
 * pickers, Reassess, Afterward) and Relapse Resign: the nav row (back or an
 * empty slot · 8 dashes or nothing · ✕), a left-aligned stack at canvas 136,
 * an optional decorative hero under it, the primary at `bottom 48` — `96`
 * over a ghost link.
 *
 * The stack scrolls between the nav and the controls when it does not fit
 * (D320); `layer` holds what the frames place absolutely beside the stack
 * (the intensity bars at 232 and their reading at 440), in canvas
 * coordinates, scrolling with it, and `layerBottom` is the canvas y it
 * reaches. The hero drops out on a phone too short to keep it clear of the
 * controls (D320 rule 1, the kit `Hero`'s `controls`).
 */
export function SosQuestion({
  left = 'empty',
  onBack,
  onClose,
  dashes,
  hero,
  gap,
  children,
  layer,
  layerBottom,
  cta,
  onCta,
  ghost,
  onGhost,
}: {
  left?: NavLeft;
  onBack?: () => void;
  onClose: () => void;
  /** lit dashes of eight */
  dashes?: number;
  hero?: { id: HeroKey; top: number; scale?: number };
  gap: number;
  children: ReactNode;
  layer?: ReactNode;
  layerBottom?: number;
  cta: string;
  onCta: () => void;
  ghost?: string;
  onGhost?: () => void;
}) {
  const controls = (ghost ? 96 : 48) + 58;
  return (
    <Screen>
      {hero ? <Hero id={hero.id} top={hero.top} scale={hero.scale} controls={controls} /> : null}
      <NavBar left={left} centre={dashes != null ? { step: dashes, total: 8 } : null} right="close" onBack={onBack} onClose={onClose} />
      <ScrollRegion top={BAND_TOP} bottom={controls}>
        <View
          style={{
            paddingTop: 136 - BAND_TOP,
            paddingHorizontal: 24,
            paddingBottom: END_GAP,
            gap,
            minHeight: layerBottom ? layerBottom - BAND_TOP + END_GAP : undefined,
          }}>
          {children}
        </View>
        {/* given its full height: native delivers no touch outside a parent's box */}
        {layer ? <View style={{ position: 'absolute', left: 0, right: 0, top: -BAND_TOP, height: layerBottom, pointerEvents: 'box-none' }}>{layer}</View> : null}
      </ScrollRegion>
      <PrimaryButton label={cta} onPress={onCta} bottom={ghost ? 96 : 48} />
      {ghost ? <GhostLink label={ghost} onPress={onGhost} /> : null}
    </Screen>
  );
}

/** The literal spacer `<div height:N>` the frames put inside a stack — it adds N plus one more gap. */
export function Gap({ h }: { h: number }) {
  return <View style={{ height: h }} />;
}

/**
 * The dark board's head: `left 24 right 24 top 160; column; gap 12; centred`
 * — the 26/33 title in white and the 15/24 line at 62 %.
 */
export function DarkHead({ title, body, gap = 12, onHeight }: { title: string; body?: string; gap?: number; onHeight?: (height: number) => void }) {
  return (
    <View
      onLayout={onHeight ? (e) => onHeight(e.nativeEvent.layout.height) : undefined}
      style={{ position: 'absolute', left: 24, right: 24, top: 160, gap, alignItems: 'center' }}>
      <MonoText v="h1" center color={monoDark.text} style={{ alignSelf: 'stretch' }}>
        {title}
      </MonoText>
      {body ? (
        <MonoText v="p" center color={monoDark.body} style={{ alignSelf: 'stretch' }}>
          {body}
        </MonoText>
      ) : null}
    </View>
  );
}

// ════════ THE RING (85A) ═════════════════════════════════════════════════════

const RING_R = 92;
/** 2π·92 — the frame writes it 578.1 */
const RING_C = 2 * Math.PI * RING_R;

/**
 * `85A`'s ring: an `svg 240×240` centred at canvas `top`: a `r92` track at
 * 15 % white, the white arc (stroke 10, round cap) from twelve o'clock round
 * by `fraction`, a `#111111` marker ringed in white at the arc's end, the
 * clock 46/700/−1.5 and its line 13 (the frame's 600 resolves to Lato 700).
 * No tick dots — the generator's twelve are not in the frame.
 */
export function UrgeRing({ fraction, clock, label, top = 270 }: { fraction: number; clock: string; label: string; top?: number }) {
  const f = Math.min(1, Math.max(0, fraction));
  const angle = -Math.PI / 2 + f * 2 * Math.PI;
  const mx = 120 + RING_R * Math.cos(angle);
  const my = 120 + RING_R * Math.sin(angle);
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top, flexDirection: 'row', justifyContent: 'center', pointerEvents: 'none' }}>
      <Svg width={240} height={240} viewBox="0 0 240 240">
        <Circle cx={120} cy={120} r={RING_R} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={10} />
        {f > 0 ? (
          <Circle
            cx={120}
            cy={120}
            r={RING_R}
            fill="none"
            stroke={monoDark.text}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={`${(RING_C * f).toFixed(1)} ${RING_C.toFixed(1)}`}
            transform="rotate(-90 120 120)"
          />
        ) : null}
        <Circle cx={Number(mx.toFixed(1))} cy={Number(my.toFixed(1))} r={9} fill={mono.groundDark} stroke={monoDark.text} strokeWidth={4} />
        {/* an svg text run inherits nothing from the page — the family is stated */}
        <SvgText x={120} y={126} fill={monoDark.text} textAnchor="middle" fontFamily={LATO.bold} fontWeight="normal" fontSize={46} letterSpacing={-1.5}>
          {clock}
        </SvgText>
        <SvgText x={120} y={152} fill="rgba(255,255,255,0.5)" textAnchor="middle" fontFamily={LATO.bold} fontWeight="normal" fontSize={13}>
          {label}
        </SvgText>
      </Svg>
    </View>
  );
}

// ════════ SETTINGS ═══════════════════════════════════════════════════════════

export type SosSound = 'ocean' | 'rain' | 'silent';
export type SosLight = 'blue' | 'violet' | 'gold' | 'silver';
export type SosBackground = 'night' | 'starfield' | 'dawn';

export interface SosSettings {
  sound: SosSound;
  /** Null until a light is picked — the breath disc is 85F's white until then. */
  light: SosLight | null;
  background: SosBackground;
}

export const SOS_SETTINGS_KEY = 'tideline.sos.settings';
export const DEFAULT_SOS_SETTINGS: SosSettings = { sound: 'ocean', light: null, background: 'night' };

/**
 * The orb lights the settings sheet offers. The defaults draw 85F exactly (a
 * white disc on the dark board); a light or a ground the user picks keeps the
 * look it always had — a preference, so it is honoured rather than flattened
 * into the monochrome system (D256).
 */
const SOS_LIGHTS: { key: SosLight; label: string; stops: readonly [string, string, string] }[] = [
  { key: 'blue', label: 'Blue', stops: ['#A9BFF0', '#6D87CE', '#3A4E8C'] },
  { key: 'violet', label: 'Violet', stops: ['#B7A6E3', '#8B7CC9', '#54488C'] },
  { key: 'gold', label: 'Gold', stops: ['#EED9AE', '#D9B98A', '#A8823F'] },
  { key: 'silver', label: 'Silver', stops: ['#DDE4EC', '#9FB0C2', '#6B6963'] },
];

/** `radial-gradient(circle at 36% 30%, …)` — farthest-corner, so ~95 % of the box. */
function LightDisc({ id, size, stops, mid = 46 }: { id: string; size: number; stops: readonly [string, string, string]; mid?: number }) {
  return (
    <Svg width={size} height={size} style={{ position: 'absolute', left: 0, top: 0 }}>
      <Defs>
        <RadialGradient id={id} cx="36%" cy="30%" r="95%" rx="95%" ry="95%">
          <Stop offset={0} stopColor={stops[0]} />
          <Stop offset={mid / 100} stopColor={stops[1]} />
          <Stop offset={1} stopColor={stops[2]} />
        </RadialGradient>
      </Defs>
      <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
    </Svg>
  );
}

const STARFIELD = [
  { x: 0.11, y: 0.14 },
  { x: 0.32, y: 0.09 },
  { x: 0.58, y: 0.2 },
  { x: 0.79, y: 0.12 },
  { x: 0.22, y: 0.31 },
  { x: 0.68, y: 0.35 },
  { x: 0.88, y: 0.27 },
  { x: 0.42, y: 0.42 },
  { x: 0.14, y: 0.48 },
  { x: 0.75, y: 0.52 },
  { x: 0.5, y: 0.58 },
  { x: 0.3, y: 0.64 },
];

/**
 * The two grounds a user can pick instead of the board's own (`night`, the
 * default, is the dark Screen itself). Drawn full-window, under everything.
 */
const STARFIELD_GROUND = [
  [0, '#0E1116'],
  [1, '#1A2130'],
] as const;
const DAWN_GROUND = [
  [0, '#2A2E3C'],
  [0.6, '#6B5D6E'],
  [1, '#C89A7A'],
] as const;

function SosBackdrop({ background }: { background: Exclude<SosBackground, 'night'> }) {
  const canvasTop = useCanvasTop();
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: -canvasTop, bottom: 0, pointerEvents: 'none' }}>
      <Svg width="100%" height="100%" style={{ position: 'absolute', left: 0, top: 0 }}>
        <Defs>
          <SvgGrad id="sos-ground" x1="0" y1="0" x2="0" y2="1">
            {(background === 'starfield' ? STARFIELD_GROUND : DAWN_GROUND).map(([offset, color]) => (
              <Stop key={offset} offset={offset} stopColor={color} />
            ))}
          </SvgGrad>
          <RadialGradient id="sos-dawn-sun" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset={0} stopColor="rgb(243,227,196)" stopOpacity={0.9} />
            <Stop offset={0.8} stopColor="rgb(243,227,196)" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width="100%" height="100%" fill="url(#sos-ground)" />
        {background === 'dawn' ? <Ellipse cx="50%" cy="85%" rx={110} ry={110} fill="url(#sos-dawn-sun)" /> : null}
        {background === 'starfield'
          ? STARFIELD.map((s, i) => <Circle key={i} cx={`${s.x * 100}%`} cy={`${s.y * 100}%`} r={i % 3 === 0 ? 1.25 : 1} fill={`rgba(244,243,240,${0.4 + (i % 4) * 0.1})`} />)
          : null}
      </Svg>
      {/* The old stage laid this scrim over its last 230 points (0 → 55 % → 82 %)
          so its controls read on any ground; without it "I slipped" (white at
          60 %) all but vanishes into the dawn's glow. Drawn in the board's own
          ground. */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 230 }}>
        <Svg width="100%" height="100%" style={{ position: 'absolute', left: 0, top: 0 }}>
          <Defs>
            <SvgGrad id="sos-scrim" x1="0" y1="0" x2="0" y2="1">
              <Stop offset={0} stopColor={mono.groundDark} stopOpacity={0} />
              <Stop offset={0.55} stopColor={mono.groundDark} stopOpacity={0.55} />
              <Stop offset={1} stopColor={mono.groundDark} stopOpacity={0.82} />
            </SvgGrad>
          </Defs>
          <Rect x={0} y={0} width="100%" height="100%" fill="url(#sos-scrim)" />
        </Svg>
      </View>
    </View>
  );
}

function GearGlyph() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z" fill="none" stroke={monoDark.text} strokeWidth={1.8} />
      <Path
        d="M19.2 12c0-.5-.05-.95-.14-1.4l2.1-1.6-2-3.4-2.45 1a7.2 7.2 0 0 0-2.4-1.4L13.9 2.6h-3.8l-.4 2.6a7.2 7.2 0 0 0-2.4 1.4l-2.46-1-2 3.4 2.1 1.6c-.08.45-.13.9-.13 1.4s.05.95.14 1.4l-2.1 1.6 2 3.4 2.45-1c.72.6 1.53 1.08 2.4 1.4l.4 2.6h3.8l.4-2.6a7.2 7.2 0 0 0 2.4-1.4l2.45 1 2-3.4-2.1-1.6c.1-.45.14-.9.14-1.4z"
        fill="none"
        stroke={monoDark.text}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * The SOS settings — sound, the breath disc's light, the ground — as the kit's
 * sheet (the four sheet frames' panel, grabber and frame-level pill). No frame
 * draws it; its three choices and their storage are the app's (D256).
 */
export function SosSettingsSheet({ open, settings, onChange, onDone }: { open: boolean; settings: SosSettings; onChange: (next: SosSettings) => void; onDone: () => void }) {
  return (
    <Sheet open={open} top={420} onClose={onDone} footer={<PrimaryButton sheet label="Done" onPress={onDone} />}>
      <MonoText v="caps">Sound</MonoText>
      <Segmented
        items={[
          { key: 'ocean', label: 'Ocean' },
          { key: 'rain', label: 'Rain' },
          { key: 'silent', label: 'Silent' },
        ]}
        value={settings.sound}
        onChange={(sound) => onChange({ ...settings, sound })}
      />
      <MonoText v="caps" style={{ marginTop: 6 }}>
        Orb light
      </MonoText>
      <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', gap: 16, paddingHorizontal: 4 }}>
        {SOS_LIGHTS.map((item) => {
          const on = settings.light === item.key;
          return (
            <Tap
              key={item.key}
              onPress={() => onChange({ ...settings, light: item.key })}
              accessibilityRole="radio"
              aria-checked={on}
              label={`${item.label} light`}
              style={{ width: 44, height: 44, borderRadius: 22, opacity: on ? 1 : 0.6, boxShadow: on ? `0 0 0 2px ${mono.sheet}, 0 0 0 4px ${mono.ink}` : undefined }}>
              <LightDisc id={`sos-swatch-${item.key}`} size={44} stops={item.stops} />
            </Tap>
          );
        })}
      </View>
      <MonoText v="caps" style={{ marginTop: 6 }}>
        Background
      </MonoText>
      <Segmented
        items={[
          { key: 'night', label: 'Night sea' },
          { key: 'starfield', label: 'Starfield' },
          { key: 'dawn', label: 'Dawn' },
        ]}
        value={settings.background}
        onChange={(background) => onChange({ ...settings, background })}
      />
    </Sheet>
  );
}

// ════════ THE STAGE SHELL ════════════════════════════════════════════════════

/** Where the stages run: the interrupt's `sos` step, or the hub's Breathe pill. */
export type SosContext = 'interrupt' | 'hub';

/**
 * Where a stage may draw on this screen, in canvas y: from 16 under its head
 * to 16 clear of the controls, and `dx`, what centres the frame's x on a
 * phone narrower or wider than 393.
 */
export interface PlayArea {
  top: number;
  bottom: number;
  dx: number;
}

/** A stage's play, laid out for the area it was given, and the canvas y it reaches. */
type Play = { node: ReactNode; bottom: number };

/**
 * The dark board every stage stands on (85F's shell): ground and noise, nav
 * (`back` in the hub — back to the panes; else an empty slot) · "Ride it out"
 * · ✕, the head at 160, the stage's own play in canvas coordinates, optional
 * stage dots at `bottom 180` (the hub's pager dots), the white primary at
 * `bottom 96` and "I slipped".
 *
 * The breathing stage's SOS settings (`onSettings`) are a gear just inside
 * the ✕, in both contexts: the old stage kept it top left, which 85F gives the
 * hub's back chevron (D256).
 *
 * `play` is handed the area this screen leaves under the head; at 393 × 852
 * every stage draws exactly where its frame (or 85F's) does, and on a short
 * phone it fits itself to the area before the band has to scroll (D252).
 */
function SosShell({
  left,
  onBack,
  onSettings,
  onClose,
  title,
  body,
  play,
  cta,
  onCta,
  onSlip,
  dots,
  background,
  overlay,
}: {
  left: 'back' | 'empty';
  onBack?: () => void;
  onSettings?: () => void;
  onClose: () => void;
  title: string;
  body?: string;
  play: (area: PlayArea) => Play;
  cta: string;
  onCta: () => void;
  onSlip: () => void;
  dots?: { count: number; active: number };
  background: SosBackground;
  overlay?: ReactNode;
}) {
  const { width } = useWindowDimensions();
  // the dots' 202 already keeps 16 clear of them; the pill's 154 does not
  const controls = dots ? 180 + 6 + 16 : 96 + 58;
  const bottom = useBandBottom(controls, dots ? 0 : 16);
  // The tallest head the stage has shown — 85F's loses its line after "In",
  // and its play must not jump when it does. One line under a one-line title
  // until measured (33 + 12 + 24), which is every head at 393.
  const [headH, setHeadH] = useState(body ? 69 : 33);
  const content = play({ top: 160 + headH + 16, bottom, dx: (width - 393) / 2 });
  return (
    <Screen variant="dark">
      {background !== 'night' ? <SosBackdrop background={background} /> : null}
      <NavBar tone="dark" left={left} centre={{ title: 'Ride it out' }} right="close" onBack={onBack} onClose={onClose} />
      {onSettings ? (
        <Tap
          label="SOS settings"
          onPress={onSettings}
          hitSlop={{ top: 4, bottom: 4, left: 12, right: 4 }}
          style={{ position: 'absolute', right: 22 + 36, top: 60, width: 36, height: 40, alignItems: 'flex-end', justifyContent: 'center', zIndex: 6 }}>
          <GearGlyph />
        </Tap>
      ) : null}
      <CanvasBand controls={controls} height={content.bottom}>
        <DarkHead title={title} body={body} onHeight={(h) => setHeadH((current) => Math.max(current, Math.ceil(h)))} />
        {content.node}
      </CanvasBand>
      {dots ? <PagerDots count={dots.count} active={dots.active} /> : null}
      <PrimaryButton label={cta} onPress={onCta} bottom={96} tone="dark" />
      <GhostLink label="I slipped" onPress={onSlip} tone="dark" />
      {overlay}
    </Screen>
  );
}

/** What every stage is handed by the flow or the hub that runs it. */
export interface StageProps {
  ctx: SosContext;
  settings: SosSettings;
  /** ✕ — the interrupt closes; the hub closes */
  onClose: () => void;
  /** the primary: the interrupt logs the urge as ridden out; the hub goes back to its panes */
  onEnd: () => void;
  /** the stage ran its course — the next stage */
  onDone: () => void;
  /** "I slipped" — the slip flow */
  onSlip: () => void;
  /** the hub's back chevron — its panes */
  onBack?: () => void;
  /** where this stage sits in the run, for the dots (the breathing board draws none) */
  dots?: { count: number; active: number };
  /** drawn over the stage — the settings sheet, which stays open if the stage moves on under it */
  overlay?: ReactNode;
}

// ════════ 85F · BREATHE ══════════════════════════════════════════════════════

/**
 * `85F · Breathe`: in 4, hold 4, out 6. Only "In" is drawn; the hold and out
 * heads are the app's own words (the old box-breathing captions), written to
 * the frame's sentence form (D253).
 */
const PHASES = [
  { key: 'In', seconds: 4, title: 'Breathe in.', body: 'Slowly, through your nose. Let your shoulders drop.' },
  { key: 'Hold', seconds: 4, title: 'Hold it.', body: undefined },
  { key: 'Out', seconds: 6, title: 'Breathe out slowly.', body: undefined },
] as const;
const CYCLE = PHASES.reduce((s, p) => s + p.seconds, 0);
/** Three full breaths is the round; the stage moves on by itself after it. */
const BREATHE_ROUND_SECONDS = CYCLE * 3;
/** The white disc breathes from r70 (drawn) to r92 (the middle ring) and back. */
const DISC_IN = 92 / 70;

function phaseAt(elapsed: number) {
  let t = elapsed % CYCLE;
  for (let i = 0; i < PHASES.length; i += 1) {
    if (t < PHASES[i].seconds) return i;
    t -= PHASES[i].seconds;
  }
  return 0;
}

/** The orb's `svg 290×290` at canvas 262, and the phase row at 590, whose last line ends at 590 + 18 + 4 + 16 + 4 + 6 + 3. */
const ORB_TOP = 262;
const ORB = 290;
const ROW_TOP = 590;
const ROW_BOTTOM = 641;
/** On a short phone the orb gives way before the band scrolls — to 60 %, the rings' hairline still clear of the disc. */
const ORB_MIN_FIT = 0.6;

/**
 * The orb: `svg 290×290` centred at canvas `top` — a hairline r140, r116 at
 * 5 %, r92 at 8 %, and the white r70 disc that breathes. The disc is its own
 * layer so it can scale without redrawing the rings; at rest it is exactly
 * the frame. `fit` < 1 draws the whole orb smaller on a short phone (it is
 * art, not type — D252), its top still at `top`.
 */
function BreathOrb({ phase, light, top = ORB_TOP, fit = 1 }: { phase: number; light: SosLight | null; top?: number; fit?: number }) {
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);
  useEffect(() => {
    if (reduced) return;
    if (phase === 0) scale.value = withTiming(DISC_IN, { duration: PHASES[0].seconds * 1000, easing: Easing.inOut(Easing.ease) });
    else if (phase === 2) scale.value = withTiming(1, { duration: PHASES[2].seconds * 1000, easing: Easing.inOut(Easing.ease) });
    return () => cancelAnimation(scale);
  }, [phase, reduced, scale]);
  const disc = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const stops = SOS_LIGHTS.find((l) => l.key === light)?.stops;
  return (
    // a transform scales about the box's centre: the box goes up by what that takes off its top
    <View style={{ position: 'absolute', left: 0, right: 0, top: top - (ORB / 2) * (1 - fit), flexDirection: 'row', justifyContent: 'center', pointerEvents: 'none' }}>
      <View style={{ width: ORB, height: ORB, transform: fit < 1 ? [{ scale: fit }] : undefined }}>
        <Svg width={ORB} height={ORB} viewBox="0 0 290 290" style={{ position: 'absolute', left: 0, top: 0 }}>
          <Circle cx={145} cy={145} r={140} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
          <Circle cx={145} cy={145} r={116} fill="rgba(255,255,255,0.05)" />
          <Circle cx={145} cy={145} r={92} fill="rgba(255,255,255,0.08)" />
        </Svg>
        <Reanimated.View style={[{ position: 'absolute', left: 75, top: 75, width: 140, height: 140 }, disc]}>
          {stops ? (
            <LightDisc id="sos-breath-light" size={140} stops={stops} />
          ) : (
            <Svg width={140} height={140} viewBox="0 0 140 140" style={{ position: 'absolute', left: 0, top: 0 }}>
              <Circle cx={70} cy={70} r={70} fill={monoDark.text} />
            </Svg>
          )}
        </Reanimated.View>
      </View>
    </View>
  );
}

/** `top 590; centred; gap 36` — three columns `min-width 56, gap 4`: name, seconds, and the active one's underline. */
function PhaseRow({ active, top = ROW_TOP }: { active: number; top?: number }) {
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top, flexDirection: 'row', justifyContent: 'center', gap: 36 }}>
      {PHASES.map((p, i) => {
        const on = i === active;
        return (
          <View key={p.key} style={{ minWidth: 56, gap: 4, alignItems: 'center' }}>
            <MonoText v="rowLabel" wrap="wrap" color={on ? monoDark.text : 'rgba(255,255,255,0.4)'}>
              {p.key}
            </MonoText>
            <MonoText v="pill" wrap="wrap" style={sans('400')} color={on ? monoDark.body : 'rgba(255,255,255,0.3)'}>
              {`${p.seconds} sec`}
            </MonoText>
            <View style={{ width: 24, height: 3, borderRadius: 2, marginTop: 6, backgroundColor: on ? monoDark.text : 'transparent' }} />
          </View>
        );
      })}
    </View>
  );
}

/**
 * 85F's play on this screen: as drawn when it fits; on a short phone the
 * phase row keeps its size and sits on the area's floor, and the orb takes
 * what is left under the head (24 above the row, no less than `ORB_MIN_FIT`).
 */
function breathePlay(area: PlayArea) {
  const dy = shiftInto(ORB_TOP, ROW_BOTTOM, area);
  if (ROW_BOTTOM - ORB_TOP <= area.bottom - area.top) return { orbTop: ORB_TOP + dy, fit: 1, rowTop: ROW_TOP + dy };
  const rowTop = area.bottom - (ROW_BOTTOM - ROW_TOP);
  const fit = clamp((rowTop - 24 - area.top) / ORB, ORB_MIN_FIT, 1);
  return { orbTop: area.top, fit, rowTop: Math.max(rowTop, area.top + ORB * fit + 24) };
}

export function BreatheStage({ ctx, settings, onClose, onEnd, onDone, onSlip, onBack, onSettings, overlay }: StageProps & { onSettings?: () => void }) {
  // One counter drives the phase and the round, so the two never drift apart.
  const [elapsed, setElapsed] = useState(0);
  const phase = phaseAt(elapsed);
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);
  useEffect(() => {
    const tick = setInterval(() => setElapsed((v) => v + 1), 1000);
    return () => clearInterval(tick);
  }, []);
  useEffect(() => {
    if (elapsed >= BREATHE_ROUND_SECONDS) doneRef.current();
  }, [elapsed]);

  const p = PHASES[phase];
  return (
    <SosShell
      left={ctx === 'hub' ? 'back' : 'empty'}
      onBack={onBack}
      onSettings={onSettings}
      onClose={onClose}
      title={p.title}
      body={p.body}
      play={(area) => {
        const at = breathePlay(area);
        return {
          node: (
            <>
              <BreathOrb phase={phase} light={settings.light} top={at.orbTop} fit={at.fit} />
              <PhaseRow active={phase} top={at.rowTop} />
            </>
          ),
          bottom: at.rowTop + (ROW_BOTTOM - ROW_TOP),
        };
      }}
      cta="Done"
      onCta={onEnd}
      onSlip={onSlip}
      background={settings.background}
      overlay={overlay}
    />
  );
}

// ════════ NUMBER TAP (no frame) ══════════════════════════════════════════════

/**
 * Five landing spots — the old stage's centres, moved down into 85F's play
 * band (canvas 262–580) by the 56 the head took: canvas (x, y) of each disc's
 * centre on a 393-wide screen. The live disc grows to 68, so the box is
 * derived from the centre.
 */
const TAP_SLOTS = [
  { cx: 102, cy: 310 },
  { cx: 286, cy: 346 },
  { cx: 188, cy: 428 },
  { cx: 94, cy: 518 },
  { cx: 290, cy: 536 },
];
const TAP_FIRST = 310;
const TAP_SPAN = 536 - 310;
/** Half the live disc. */
const TAP_R = 34;
/**
 * How close a short phone may draw the spots, as a share of their drawn
 * spacing: at 45 % the nearest pair that share a column (the first and the
 * fourth, 208 apart) are still 94 apart, past the 62 a live and an idle disc
 * need — and pairs closer than that sit at least 86 apart across.
 */
const TAP_MIN_FIT = 0.45;

/** A stage's running line, where 85F sets its phase names: canvas 590, 15/700 white, centred. */
const CAPTION_TOP = 590;
const CAPTION_H = 18;

function StageCaption({ text, top = CAPTION_TOP }: { text: string; top?: number }) {
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, top, alignItems: 'center' }}>
      <MonoText v="rowLabel" center color={monoDark.text}>
        {text}
      </MonoText>
    </View>
  );
}

const COUNT_WORD = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five'];

/**
 * The tap stage's play on this screen: the spots and the caption as placed
 * at 393 × 852 when they fit; on a short phone the caption sits on the area's
 * floor and the spots' heights close up (never their size) into what is left
 * above it, 20 clear — no spot or caption under the band's edge at rest.
 */
function tapPlay(area: PlayArea) {
  const from = TAP_FIRST - TAP_R;
  const to = CAPTION_TOP + CAPTION_H;
  if (to - from <= area.bottom - area.top) {
    const dy = shiftInto(from, to, area);
    return { y: (cy: number) => cy + dy, caption: CAPTION_TOP + dy };
  }
  const caption = area.bottom - CAPTION_H;
  const first = area.top + TAP_R;
  const k = clamp((caption - 20 - TAP_R - first) / TAP_SPAN, TAP_MIN_FIT, 1);
  return { y: (cy: number) => first + (cy - TAP_FIRST) * k, caption: Math.max(caption, first + TAP_SPAN * k + TAP_R + 20) };
}

export function TapStage({ ctx, settings, onClose, onEnd, onDone, onSlip, onBack, dots, overlay }: StageProps) {
  const [next, setNext] = useState(0);
  function tap(index: number) {
    if (index !== next) return;
    if (index === TAP_SLOTS.length - 1) onDone();
    else setNext(index + 1);
  }
  return (
    <SosShell
      left={ctx === 'hub' ? 'back' : 'empty'}
      onBack={onBack}
      onClose={onClose}
      title="Tap the numbers as they land."
      body="Eyes on the count, not the wave"
      play={(area) => {
        const at = tapPlay(area);
        return {
          node: (
            <>
              {TAP_SLOTS.map((slot, index) => {
                const done = index < next;
                const live = index === next;
                const size = live ? 68 : 56;
                return (
                  <Tap
                    key={index}
                    onPress={() => tap(index)}
                    label={`Number ${index + 1}`}
                    style={{
                      position: 'absolute',
                      left: slot.cx + area.dx - size / 2,
                      top: at.y(slot.cy) - size / 2,
                      width: size,
                      height: size,
                      borderRadius: size / 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: live ? monoDark.text : done ? mono.card : 'transparent',
                      boxShadow: live || done ? undefined : `0 0 0 1.5px ${monoDark.chipRing}`,
                    }}>
                    {done ? (
                      <Check color={monoDark.text} size={16} />
                    ) : (
                      <MonoText v="h1" center wrap="nowrap" color={live ? mono.onInk : monoDark.body} style={{ fontSize: live ? 28 : 22, lineHeight: live ? 34 : 27, letterSpacing: 0 }}>
                        {String(index + 1)}
                      </MonoText>
                    )}
                  </Tap>
                );
              })}
              <StageCaption top={at.caption} text={`${COUNT_WORD[next + 1]} down, ${COUNT_WORD[TAP_SLOTS.length - next - 1].toLowerCase()} to go`} />
            </>
          ),
          bottom: at.caption + CAPTION_H,
        };
      }}
      cta="End early"
      onCta={onEnd}
      onSlip={onSlip}
      dots={dots}
      background={settings.background}
      overlay={overlay}
    />
  );
}

// ════════ ODD ONE OUT (no frame) ═════════════════════════════════════════════

const ODD_ROUNDS = 6;
/** A 3 × 3 of 72 tiles, gap 12 — 240 square at canvas 300, centred. */
const GRID_TOP = 300;
const TILE = 72;
const TILE_GAP = 12;
/** The smallest a short phone draws a tile before the band scrolls instead. */
const TILE_MIN = 56;

/**
 * The odd-one-out stage's play on this screen: as placed at 393 × 852 when it
 * fits; on a short phone the caption sits on the area's floor and the grid
 * takes the square left above it (20 clear), its tiles no smaller than
 * `TILE_MIN` — the 12 dot inside each keeps its size.
 */
function oddPlay(area: PlayArea) {
  const to = CAPTION_TOP + CAPTION_H;
  if (to - GRID_TOP <= area.bottom - area.top) {
    const dy = shiftInto(GRID_TOP, to, area);
    return { top: GRID_TOP + dy, tile: TILE, caption: CAPTION_TOP + dy };
  }
  const caption = area.bottom - CAPTION_H;
  const room = caption - 20 - area.top;
  const tile = Math.floor(clamp((room - 2 * TILE_GAP) / 3, TILE_MIN, TILE));
  const size = 3 * tile + 2 * TILE_GAP;
  const top = area.top + Math.max(0, Math.floor((room - size) / 2));
  return { top, tile, caption: Math.max(caption, top + size + 20) };
}

export function OddStage({ ctx, settings, onClose, onEnd, onDone, onSlip, onBack, dots, overlay }: StageProps) {
  const [round, setRound] = useState(1);
  const [odd, setOdd] = useState(() => Math.floor(Math.random() * 9));
  function pick(index: number) {
    if (index !== odd) return;
    if (round >= ODD_ROUNDS) {
      onDone();
      return;
    }
    setRound(round + 1);
    setOdd((current) => (current + 1 + Math.floor(Math.random() * 8)) % 9);
  }
  return (
    <SosShell
      left={ctx === 'hub' ? 'back' : 'empty'}
      onBack={onBack}
      onClose={onClose}
      title="Find the one that’s different."
      body="Each round gets a little harder"
      play={(area) => {
        const at = oddPlay(area);
        const size = 3 * at.tile + 2 * TILE_GAP;
        return {
          node: (
            <>
              <View style={{ position: 'absolute', left: 0, right: 0, top: at.top, flexDirection: 'row', justifyContent: 'center' }}>
                <View style={{ width: size, height: size, flexDirection: 'row', flexWrap: 'wrap', gap: TILE_GAP }}>
                  {Array.from({ length: 9 }, (_, index) => {
                    const on = index === odd;
                    return (
                      <Tap
                        key={index}
                        onPress={() => pick(index)}
                        label={`Tile ${index + 1}`}
                        style={{ width: at.tile, height: at.tile, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? monoDark.text : mono.card }}>
                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: on ? mono.onInk : 'rgba(255,255,255,0.35)' }} />
                      </Tap>
                    );
                  })}
                </View>
              </View>
              <StageCaption top={at.caption} text={`Round ${roman(round)} of ${roman(ODD_ROUNDS)}`} />
            </>
          ),
          bottom: at.caption + CAPTION_H,
        };
      }}
      cta="End early"
      onCta={onEnd}
      onSlip={onSlip}
      dots={dots}
      background={settings.background}
      overlay={overlay}
    />
  );
}

// ════════ THE 90-SECOND RING (no frame) ══════════════════════════════════════

export const SURF_SECONDS = 90;
const SURF_PHASES = [
  { at: 0, name: 'Rising' },
  { at: 0.28, name: 'Cresting' },
  { at: 0.62, name: 'Passing' },
  { at: 0.86, name: 'Settling' },
];
/**
 * 85A's ring box at 270; what it draws runs from the track's top (270 + 23)
 * to the marker's lowest (270 + 223). The stage fits the box's bottom (270 +
 * 240), not the ink's: on web a scroller counts the svg's empty 17 under the
 * marker, and a ring that fit by its ink still scrolled 11 at 375 × 667.
 */
const RING_TOP = 270;
const RING_INK_TOP = RING_TOP + 23;
const RING_BOX_BOTTOM = RING_TOP + 240;

/**
 * The fourth stage — the wave outlasting itself — drawn as 85A's ring: the
 * arc is what is left of the ninety seconds, the clock counts it down, and
 * the line under it names where the wave is. At zero the flow finishes the
 * session on its own. The ring keeps its size (its clock is type); on a
 * phone too short for it the band scrolls.
 */
export function WaveStage({ ctx, settings, progress, remaining, onClose, onEnd, onSlip, onBack, dots, overlay }: Omit<StageProps, 'onDone'> & { progress: number; remaining: number }) {
  const phase = SURF_PHASES.reduce((current, candidate) => (progress >= candidate.at ? candidate : current), SURF_PHASES[0]);
  const clock = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;
  return (
    <SosShell
      left={ctx === 'hub' ? 'back' : 'empty'}
      onBack={onBack}
      onClose={onClose}
      title="Ride it out."
      play={(area) => {
        const dy = shiftInto(RING_INK_TOP, RING_BOX_BOTTOM, area);
        return { node: <UrgeRing top={RING_TOP + dy} fraction={1 - progress} clock={clock} label={phase.name} />, bottom: RING_BOX_BOTTOM + dy };
      }}
      cta="End early"
      onCta={onEnd}
      onSlip={onSlip}
      dots={dots}
      background={settings.background}
      overlay={overlay}
    />
  );
}

// ── the order the four stages run in — `UrgeFlow` steps through all four; the
// hub's Breathe pill runs the first three (its own ring is the clock) ────────
export type SosStageName = 'breathe' | 'tap' | 'odd' | 'wave';
export const SOS_ORDER: SosStageName[] = ['breathe', 'tap', 'odd', 'wave'];
