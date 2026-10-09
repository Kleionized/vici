/**
 * The onboarding tail — `24 · Build plan` and `28 · Your recovery rating` …
 * `34 · What You Want Back`.
 *
 * `Vici Overhaul` redrew every one of these on the kit: the #0D0D0D ground and
 * its noise, the nav row with a Back chevron (the previous drop drew none), the
 * 26/33 heading, the 15/24 paragraph and the primary at bottom 48. What is
 * left screen-specific is the drawing each board makes its point with — the
 * tick gauge, the three dot fields, the line chart, the calendar, the week
 * strip and the three pills — and each is transcribed from its frame's own svg.
 *
 * `32 · Change the Line` is gone: the drop split it into `32 · If Nothing
 * Changes` and `32A · With the Plan`, one line chart drawn two ways.
 *
 * Children of `Screen` are in canvas coordinates (D009). Where a board's copy
 * would meet its primary on a shorter phone, the band between the nav row and
 * the primary scrolls (`Band`, D320 rule 3) — at 852 it fits and nothing moves;
 * the boards with a picture over a centred stack are `HeroBoard`s and lift
 * instead (rule 2).
 */
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';

import { HeroBoard, MonoText, NavBar, Pill, PrimaryButton, Screen, ScrollRegion, Spinner, StepList, useCanvasTop } from '@/components/mono';
import { AGE_80_COLS, AGE_80_FIELD, AGE_80_NEXT_SEED, AGE_80_ROWS } from '@/content/onboardingTail';
import { groupDigits } from '@/lib/format';
import { LATO, lhNormal, mono, monoDark, sans } from '@/lib/theme';

import { spreadDays } from './v3';

/** A `<text>`'s 600/700 in the canvas's face: 600 resolves to Lato 700 (the canvas loads 400/700/900). */
const BOLD = { fontFamily: LATO.bold, fontWeight: 'normal' } as const;

/**
 * The band between the nav row (canvas 100) and the primary's top. Its
 * children keep **canvas** coordinates (the inner box starts at canvas 0).
 * `start` and `end` are the canvas y of the first and last thing drawn;
 * `bottom` is the space the controls take (106 for the primary at 48, 154 at 96).
 *
 * At 852 everything clears the controls and nothing moves. On a shorter phone
 * (D320, as `HeroBoard` does it): when the drawing would come within 16 of the
 * primary, the whole of it rises into the ground between the nav and its first
 * line (never above canvas 108) — by the deficit when there is that much ground,
 * and the board reads exactly as drawn, only higher. Where there is not, it
 * rises as far as the ground allows and the rest scrolls between the nav and
 * the controls (rule 3), never under a control — so a 667 phone sees the most
 * of the board it can before it has to scroll (D219).
 *
 * A board with an open gap in the middle passes `squeeze` (how much of it may
 * close) and children as a function of `give`: what the lift leaves over is
 * taken out of that gap first — the board moves everything under it up by
 * `give` — and only the rest scrolls (D406). `give` is 0 wherever it fits.
 */
export function Band({
  start,
  end,
  bottom = 106,
  squeeze = 0,
  children,
}: {
  start: number;
  end: number;
  bottom?: number;
  squeeze?: number;
  children: ReactNode | ((give: number) => ReactNode);
}) {
  const { height: winH } = useWindowDimensions();
  const canvasTop = useCanvasTop();
  const deficit = Math.ceil(end + 16 - (winH - canvasTop - bottom));
  const lift = deficit > 0 ? Math.min(deficit, Math.max(0, Math.floor(start - 108))) : 0;
  const give = Math.min(squeeze, Math.max(0, deficit - lift));
  return (
    <ScrollRegion top={100} bottom={bottom} alwaysBounceVertical={false} contentStyle={{ paddingBottom: 16 }}>
      <View style={{ marginTop: -100 - lift, height: end - give }}>{typeof children === 'function' ? children(give) : children}</View>
    </ScrollRegion>
  );
}

/** A heading + paragraph stack hung at a canvas top (`stack(T, { gap })`), left-aligned. */
function Stack({ top, gap = 18, onLayout, children }: { top: number; gap?: number; onLayout?: (height: number) => void; children: ReactNode }) {
  return (
    <View onLayout={onLayout ? (e) => onLayout(e.nativeEvent.layout.height) : undefined} style={{ position: 'absolute', left: 24, right: 24, top, gap }}>
      {children}
    </View>
  );
}

/** A 15/24 paragraph with one 700 ink run inside it, as the frames write them. */
function Strong({ children }: { children: ReactNode }) {
  return (
    <MonoText v="p" style={{ ...sans('700'), color: mono.ink }}>
      {children}
    </MonoText>
  );
}

/** The ink paragraph (`16/400 lh 25 #F2F0EC`) One Bad Day and What You Want Back end on. */
function InkP({ children, center }: { children: ReactNode; center?: boolean }) {
  return (
    <MonoText v="p" center={center} color={mono.ink} style={{ fontSize: 16, lineHeight: 25, alignSelf: 'stretch' }}>
      {children}
    </MonoText>
  );
}

// ── 24 · Build plan (frame `Enlisting Aegis`) ─────────────────────────

// The questionnaire doc words the three lines differently again ("Finding
// where you usually get caught" …); the frame is what is visible, so it wins.
const AEGIS_ROWS = ['Finding where you usually struggle', 'Looking at what tends to set it off', 'Choosing where to start'];
/** How long the board holds before it hands over. The app's own timing. */
const AEGIS_MS = 6800;

/**
 * The kit's spinner over "Putting your plan together…" and the three rows in
 * the frame's state — the first done, the second in progress, the third to
 * come. The canvas draws no control: the board hands over on its own after
 * `AEGIS_MS`. The rows hold that one state (as the previous drop's did); the
 * mark turns (the kit's `Spinner`, D366). `hold` (mock builds only) keeps it up
 * for a capture.
 */
export function O3PuttingTogether({ next, hold }: { next: () => void; hold?: boolean }) {
  useEffect(() => {
    if (hold) return;
    const id = setTimeout(next, AEGIS_MS);
    return () => clearTimeout(id);
  }, [next, hold]);
  return (
    <Screen>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 236, flexDirection: 'row', justifyContent: 'center' }}>
        <Spinner />
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: 352, alignItems: 'center' }}>
        <MonoText v="h1" center style={{ alignSelf: 'stretch' }}>
          Putting your plan together…
        </MonoText>
      </View>
      <StepList style={{ position: 'absolute', left: 24, right: 24, top: 462 }} current={1} steps={AEGIS_ROWS} />
    </Screen>
  );
}

// ── 28 · Your recovery rating (frame `Starting Score`) ───────────────

/** The gauge's ticks: 49 of them over the half circle, the rating's scale 0 … 100. */
const TICKS = 48;
const GAUGE_MAX = 100;
const f1 = (v: number) => v.toFixed(1);

/**
 * The tick gauge, drawn from a rating. Tick `i` sits at 180° − 3.75°·i about
 * (150, 156); a tick at or under the rating runs r 108 → 128 at 3.4, one above
 * it r 119 → 128 at 2. The marker is an r 6 dot at r 96 on the rating's angle.
 * Endpoints are written to one decimal, as the frame writes them. The scale is
 * the recovery rating's own 0 … 100 (D516); a full gauge draws no marker (D219).
 */
function RatingGauge({ value }: { value: number }) {
  const share = Math.max(0, Math.min(value, GAUGE_MAX)) / GAUGE_MAX;
  const ticks = Array.from({ length: TICKS + 1 }, (_, i) => {
    const a = ((180 - 3.75 * i) * Math.PI) / 180;
    const on = i / TICKS <= share;
    const r0 = on ? 108 : 119;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    return { d: `M${f1(150 + r0 * cos)} ${f1(156 - r0 * sin)}L${f1(150 + 128 * cos)} ${f1(156 - 128 * sin)}`, w: on ? 3.4 : 2 };
  });
  const m = Math.PI * (1 - share);
  return (
    <Svg width={300} height={196} viewBox="0 0 300 196">
      {ticks.map((t, i) => (
        <Path key={i} d={t.d} stroke={mono.ink} strokeWidth={t.w} strokeLinecap="round" />
      ))}
      {share < 1 ? <Circle cx={f1(150 + 96 * Math.cos(m))} cy={f1(156 - 96 * Math.sin(m))} r={6} fill={mono.ink} /> : null}
      <SvgText x={150} y={146} fill={mono.ink} textAnchor="middle" fontSize={76} letterSpacing={-3} {...BOLD}>
        {groupDigits(value)}
      </SvgText>
      <SvgText x={150} y={176} fill={mono.mute} textAnchor="middle" fontSize={14} {...BOLD}>
        of 100
      </SvgText>
      <SvgText x={22} y={192} fill={mono.mute} textAnchor="middle" fontSize={12} {...BOLD}>
        0
      </SvgText>
      <SvgText x={278} y={192} fill={mono.mute} textAnchor="middle" fontSize={12} {...BOLD}>
        100
      </SvgText>
    </Svg>
  );
}

/**
 * The rating before it has anything to count (S2, D516): no invented starting
 * figure. The gauge stands at 0 marked "Building", and the line says what the
 * number will be — it starts with the first check-in and covers the last seven
 * days. Today shows the same number from the first check-in on.
 */
export function O3StartingPoint({ next, back }: { next: () => void; back?: () => void }) {
  // the closing line wraps to three on a narrow phone; the band measures it
  const [lineH, setLineH] = useState(48);
  return (
    <Screen>
      <NavBar left="back" right="empty" onBack={back} />
      <Band start={224} end={556 + lineH}>
        <View style={{ position: 'absolute', left: 0, right: 0, top: 224 }}>
          <MonoText v="caps" center>
            Your recovery rating
          </MonoText>
        </View>
        <View style={{ position: 'absolute', left: 0, right: 0, top: 270, flexDirection: 'row', justifyContent: 'center' }}>
          <RatingGauge value={0} />
        </View>
        <View style={{ position: 'absolute', left: 0, right: 0, top: 494, flexDirection: 'row', justifyContent: 'center' }}>
          <Pill kind="outline" label="Building" />
        </View>
        <View onLayout={(e) => setLineH(e.nativeEvent.layout.height)} style={{ position: 'absolute', left: 24, right: 24, top: 556, alignItems: 'center' }}>
          <MonoText v="p" center style={{ alignSelf: 'stretch' }}>
            It starts with your first check-in and covers your last 7 days: showing up, clean days and lessons.
          </MonoText>
        </View>
      </Band>
      <PrimaryButton label="Next" onPress={next} />
    </Screen>
  );
}

// ── 29 · The Next 30 Days (frame `Cost Next 30`) ─────────────────────

/**
 * 30 circles, 6 across, r 14 at (22 + 58c, 22 + 50r). The frame's relapse days
 * are filled `#0D0D0D` stroked 1.6 and the others `#111111` stroked 1.8 — on
 * the ground they read alike, and the key's "Clean day" swatch (`#1E1E1E` in a
 * `#5A574F` ring) matches no cell. Reproduced as drawn (CRITIC §5, tail Q2).
 * Which cells are relapse days is his reported rate spread over the month
 * (`spreadDays`, D471) — the frame's own nine were its sample answer.
 */
function MonthDots({ times }: { times: number }) {
  const days = useMemo(() => spreadDays(30, times), [times]);
  return (
    <Svg width={334} height={244} viewBox="0 0 334 244">
      {days.map((relapse, i) => (
        <Circle
          key={i}
          cx={22 + 58 * (i % 6)}
          cy={22 + 50 * Math.floor(i / 6)}
          r={14}
          fill={relapse ? mono.ground : mono.onInk}
          stroke={mono.ink}
          strokeWidth={relapse ? 1.6 : 1.8}
        />
      ))}
    </Svg>
  );
}

function KeyItem({ fill, ringColor, label }: { fill: string; ringColor: string; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: fill, boxShadow: `0 0 0 1.5px ${ringColor}` }} />
      <MonoText v="rowValue" color={mono.sub} wrap="wrap">
        {label}
      </MonoText>
    </View>
  );
}

/**
 * `times` is his `07 · Frequency` answer as days in thirty (D471), so the
 * sentence's "the rate you reported" is now the rate he reported.
 */
export function O3Next30({ times, next, back }: { times: number; next: () => void; back?: () => void }) {
  const share = times >= 30 ? 'every one of the next 30 days' : `about ${times} of the next 30 days`;
  return (
    <Screen>
      <NavBar left="back" right="empty" onBack={back} />
      {/* the ~54 between the paragraph and the first row of days may close to 30 (D406) */}
      <Band start={199} end={675} squeeze={24}>
        {(give) => (
          <>
            <Stack top={199}>
              <MonoText v="h1">This is your next 30 days.</MonoText>
              <MonoText v="p">
                If the rate you reported stayed the same, <Strong>{share}</Strong> could end with porn.
              </MonoText>
            </Stack>
            <View style={{ position: 'absolute', left: 24, right: 24, top: 343 - give, flexDirection: 'row', justifyContent: 'center' }}>
              <MonthDots times={times} />
            </View>
            <View style={{ position: 'absolute', left: 0, right: 0, top: 603 - give, flexDirection: 'row', justifyContent: 'center', gap: 28 }}>
              <KeyItem fill={mono.ground} ringColor={mono.ink} label="Relapse" />
              <KeyItem fill={mono.card} ringColor={mono.art} label="Clean day" />
            </View>
            <View style={{ position: 'absolute', left: 24, right: 24, top: 653 - give }}>
              <MonoText v="pTight" color={mono.mute} center wrap="wrap">
                The line can start changing with the next one.
              </MonoText>
            </View>
          </>
        )}
      </Band>
      <PrimaryButton label="Next" onPress={next} />
    </Screen>
  );
}

// ── 30 · One Year From Now (frame `Cost Next 365`) ───────────────────

/** A circle as two arcs — one `<Path>` draws a whole class of dots (thousands of `<Circle>`s are heavy on native). */
const dot = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

/** The column the frames draw the year grid and the line chart in: 345 at left 24 on a 393 frame. */
const COLUMN = 345;

/**
 * The 365 grid and the line chart span the column on every width (D219). The
 * frames draw them 345 wide at left 24, which is the column at 393 — but held
 * at 345 they run 6 from the edge of a 375 phone and stop 61 short of it on a
 * 430. So their x's scale by `k` = (window − 48) / 345; radii, strokes, type and
 * every y stay the frame's, and at 393 `k` is exactly 1 (as Today's and the
 * report's charts scale theirs).
 */
function useColumn() {
  const w = useWindowDimensions().width - 48;
  return { w, k: w / COLUMN };
}

/** An absolute `M`/`C` path with every x scaled by `k` — the frame's own string at `k` = 1. */
const scaleX = (d: string, k: number) => (k === 1 ? d : d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x: string, y: string) => `${f1(Number(x) * k)} ${y}`));

/**
 * 365 dots, 25 across at (7 + 13.8c, 7 + 13.8r): a relapse day r 4.4 ink, the
 * rest r 2.4 at 0.28. `days` of them, spread over the year (D471).
 */
function YearDots({ days }: { days: number }) {
  const { w, k } = useColumn();
  const marked = useMemo(() => spreadDays(365, days), [days]);
  return (
    <Svg width={w} height={208} viewBox={`0 0 ${w} 208`}>
      {marked.map((relapse, i) => (
        <Circle key={i} cx={(7 + (i % 25) * 13.8) * k} cy={7 + Math.floor(i / 25) * 13.8} r={relapse ? 4.4 : 2.4} fill={relapse ? mono.ink : 'rgba(242,240,236,0.28)'} />
      ))}
    </Svg>
  );
}

/** The 44/700 figure ("About 110 days", "About 6,100 days"). */
function Figure({ children, color = mono.ink }: { children: string; color?: string }) {
  return (
    <MonoText v="statValue" wrap="wrap" color={color} style={{ fontSize: 44, lineHeight: 52, letterSpacing: -1.5 }}>
      {children}
    </MonoText>
  );
}

/**
 * The year at his reported rate. The frame's line, "Where you’re predicted to
 * relapse.", claimed a forecast the app cannot make; the line now says what the
 * figure is — his own rate, carried over a year (D471).
 */
export function O3OneYear({ days, next, back }: { days: number; next: () => void; back?: () => void }) {
  return (
    <Screen>
      <NavBar left="back" right="empty" onBack={back} />
      <Band start={199} end={612}>
        <Stack top={199} gap={20}>
          <MonoText v="h1">One year from now.</MonoText>
        </Stack>
        <View style={{ position: 'absolute', left: 24, top: 284 }}>
          <YearDots days={days} />
        </View>
        <Stack top={530} gap={6}>
          <Figure>{days >= 365 ? 'All 365 days' : `About ${groupDigits(days)} days`}</Figure>
          <MonoText v="p">At the rate you reported, if it held all year.</MonoText>
        </Stack>
      </Band>
      <PrimaryButton label="Next" onPress={next} />
    </Screen>
  );
}

// ── 31 · If Nothing Changes (frame `Cost By Age 80`) ─────────────────

/**
 * The night field: dots every 12 from (6, 6) over the whole window — bright
 * r 2.6 `#FFFFFF`, dim r 1.6 at 0.22. The frame's 33 × 71 are `AGE_80_FIELD`
 * (the designer's LCG, verified by the generator); a larger screen continues
 * the same LCG for the cells the frame does not have, so 393 × 852 is the frame
 * dot for dot. Anchored at the window's (0, 0), as the canvas's is at the
 * frame's — it runs under the status bar.
 */
function AgeField({ width, height }: { width: number; height: number }) {
  const [bright, dim] = useMemo(() => {
    const cols = Math.max(AGE_80_COLS, Math.ceil((width - 3) / 12));
    const rows = Math.max(AGE_80_ROWS, Math.ceil((height - 3) / 12));
    let seed = AGE_80_NEXT_SEED;
    const a: string[] = [];
    const b: string[] = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        let on: boolean;
        if (r < AGE_80_ROWS && c < AGE_80_COLS) on = AGE_80_FIELD[r * AGE_80_COLS + c];
        else {
          seed = (seed * 9301 + 49297) % 233280;
          on = seed / 233280 < 0.3;
        }
        (on ? a : b).push(dot(6 + c * 12, 6 + r * 12, on ? 2.6 : 1.6));
      }
    return [a.join(''), b.join('')];
  }, [width, height]);
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', left: 0, top: 0 }}>
      <Path d={dim} fill="rgba(255,255,255,0.22)" />
      <Path d={bright} fill={monoDark.dotOn} />
    </Svg>
  );
}

/**
 * The kit's dark frame (`#111111`, noise-dark at 0.09). The field, then a veil
 * from 96 to 326 (`#111111` solid to 62 %, clear by 100 %) behind the caps, the
 * figure and the line. The Back chevron is stroked `#17160F` — the old light
 * kit's ink, near-invisible on `#111111` — reproduced, with its 36×40 target
 * intact (CRITIC §5, tail Q3).
 */
export function O3IfNothingChanges({ days, next, back }: { days: number; next: () => void; back?: () => void }) {
  const win = useWindowDimensions();
  const canvasTop = useCanvasTop();
  return (
    <Screen variant="dark">
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: -canvasTop, width: win.width, height: win.height }}>
        <AgeField width={win.width} height={win.height} />
      </View>
      <LinearGradient
        pointerEvents="none"
        colors={[mono.groundDark, mono.groundDark, 'rgba(17,17,17,0)']}
        locations={[0, 0.62, 1]}
        style={{ position: 'absolute', left: 0, right: 0, top: 96, height: 230 }}
      />
      <NavBar left="back" right="empty" tone="dark" chevronColor="#17160F" onBack={back} />
      <View style={{ position: 'absolute', left: 24, top: 126, zIndex: 2 }}>
        <MonoText v="caps" color={monoDark.caps}>
          By age 80
        </MonoText>
      </View>
      <View style={{ position: 'absolute', left: 24, top: 160, zIndex: 2 }}>
        <Figure color={monoDark.text}>{`About ${groupDigits(days)} days`}</Figure>
      </View>
      <View style={{ position: 'absolute', left: 24, top: 222, zIndex: 2 }}>
        <MonoText v="p" wrap="wrap" color="rgba(255,255,255,0.75)" style={{ fontSize: 17, lineHeight: 26 }}>
          If nothing changes.
        </MonoText>
      </View>
      <PrimaryButton label="Next" onPress={next} tone="dark" />
    </Screen>
  );
}

// ── 32 · If Nothing Changes / 32A · With the Plan ────────────────────

/**
 * The two line boards share one chart (345 × 270 at 24, 389): the caption, the
 * axis, the lead-in, then the board's own line, the dashed drop at x 208, the
 * tooltip and the marker. Every value is the frame's literal — an illustration,
 * not a readout of his frequency (CRITIC §5, tail Q7) — and spans the column on
 * another width (`useColumn`: the x's scale, the tooltip keeps its 128).
 *
 * The frame's tooltips ("5× a week", "2× a week") and "Relapses get more
 * frequent, not less" read as his own forecast and a research finding; they
 * were neither. The caption now says the chart is an illustration, the
 * tooltips name a direction rather than invent a number, and the copy claims
 * only what is true of any habit left alone (D471).
 */
const LINES = {
  nothing: {
    title: 'If nothing changes.',
    body: 'Left alone, the pattern stays — and it can grow. An illustration, not a forecast.',
    line: 'M86 150 C 170 128, 250 92, 330 58',
    y: 104,
    rate: 'Same, or more',
    cta: 'Next',
  },
  plan: {
    title: 'With the plan.',
    body: 'You only have to make the next decision different. Then the next one. Then come back tomorrow.',
    line: 'M86 150 C 140 138, 190 172, 240 190 C 272 200, 304 206, 330 208',
    y: 172,
    rate: 'Less often',
    cta: 'Continue',
  },
} as const;

function LineBoard({ mode, next, back }: { mode: keyof typeof LINES; next: () => void; back?: () => void }) {
  const L = LINES[mode];
  const { w, k } = useColumn();
  const x = 208 * k;
  return (
    <Screen>
      <NavBar left="back" right="empty" onBack={back} />
      <Band start={199} end={659}>
        <Stack top={199}>
          <MonoText v="h1">{L.title}</MonoText>
          <MonoText v="p">{L.body}</MonoText>
        </Stack>
        <View style={{ position: 'absolute', left: 24, top: 389 }}>
          <Svg width={w} height={270} viewBox={`0 0 ${w} 270`}>
            <SvgText x={0} y={16} fill={mono.ink} fontSize={14} {...BOLD}>
              Relapse frequency · an illustration
            </SvgText>
            <Path d={`M0 236H${w}`} stroke={mono.ink} strokeWidth={1.5} />
            <Path d={scaleX('M0 172 C 30 168, 60 158, 86 150', k)} fill="none" stroke={mono.ink} strokeWidth={4.5} strokeLinecap="round" />
            <Path d={scaleX(L.line, k)} fill="none" stroke={mono.ink} strokeWidth={4.5} strokeLinecap="round" />
            <Path d={`M${x} ${L.y}V236`} stroke={mono.ink} strokeWidth={1.5} strokeDasharray="3 5" />
            <Rect x={x - 64} y={L.y - 58} width={128} height={40} rx={10} fill={mono.ink} />
            <SvgText x={x} y={L.y - 42} fill="#6B675F" textAnchor="middle" fontSize={11} letterSpacing={1.2} {...BOLD}>
              3 MONTHS
            </SvgText>
            <SvgText x={x} y={L.y - 26} fill={mono.onInk} textAnchor="middle" fontSize={14} {...BOLD}>
              {L.rate}
            </SvgText>
            <Circle cx={x} cy={L.y} r={9} fill={mono.ground} stroke={mono.ink} strokeWidth={4} />
          </Svg>
        </View>
      </Band>
      <PrimaryButton label={L.cta} onPress={next} />
    </Screen>
  );
}

export function O3LineIfNothingChanges(p: { next: () => void; back?: () => void }) {
  return <LineBoard mode="nothing" {...p} />;
}

export function O3LineWithThePlan(p: { next: () => void; back?: () => void }) {
  return <LineBoard mode="plan" {...p} />;
}

// ── 32B · A Clean Day ────────────────────────────────────────────────

/** The calendar page: 393 × 240 at 175, no transform — drawn in the frame's own user space. */
function CleanDayArt() {
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 175, height: 240, alignItems: 'center' }}>
      <Svg width={393} height={240} viewBox="0 0 393 240">
        <Rect x={126} y={40} width={140} height={150} rx={16} fill={mono.ink} />
        <Rect x={134} y={82} width={124} height={100} rx={8} fill={mono.ground} />
        <Rect x={150} y={26} width={10} height={30} rx={5} fill={mono.ink} />
        <Rect x={153} y={30} width={4} height={22} rx={2} fill={mono.ground} />
        <Rect x={232} y={26} width={10} height={30} rx={5} fill={mono.ink} />
        <Rect x={235} y={30} width={4} height={22} rx={2} fill={mono.ground} />
        <SvgText x={196} y={152} fill={mono.ink} textAnchor="middle" fontSize={68} letterSpacing={-2} {...BOLD}>
          1
        </SvgText>
        <SvgText x={196} y={172} fill={mono.mute} textAnchor="middle" fontSize={11} {...BOLD}>
          Clean day
        </SvgText>
        <Path d="M170 66h52" stroke={mono.ground} strokeWidth={3} strokeLinecap="round" />
      </Svg>
    </View>
  );
}

export function O3CleanDay({ next, back }: { next: () => void; back?: () => void }) {
  return (
    <HeroBoard
      nav={{ left: 'back', right: 'empty', onBack: back }}
      art={<CleanDayArt />}
      artTop={175 + 26}
      stackTop={451}
      gap={18}
      titleSize={26}
      title="One clean day."
      body="That’s all today has to be."
      cta="Continue"
      onCta={next}
    />
  );
}

// ── 33 · One Bad Day ─────────────────────────────────────────────────

const WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
/** The week strip's one bad day — Thursday. */
const BAD_DAY = 3;

/** Seven 36 × 56 cells at cx 22 + 48i: six ink with a ground check, Thursday ground in an ink ring with a dot. */
function WeekStrip() {
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 329, flexDirection: 'row', justifyContent: 'center' }}>
      <Svg width={344} height={86} viewBox="0 0 344 86">
        {WEEK.map((d, i) => {
          const cx = 22 + 48 * i;
          const bad = i === BAD_DAY;
          return [
            <SvgText key={`l${i}`} x={cx} y={12} fill={mono.mute} textAnchor="middle" fontSize={12} {...BOLD}>
              {d}
            </SvgText>,
            <Rect key={`c${i}`} x={cx - 18} y={22} width={36} height={56} rx={12} fill={bad ? mono.ground : mono.ink} stroke={mono.ink} strokeWidth={bad ? 2.5 : 0} />,
            bad ? (
              <Circle key={`d${i}`} cx={cx} cy={50} r={4} fill={mono.ink} />
            ) : (
              <Path key={`k${i}`} d={`M${cx - 8} 51 l5 5 l11 -12`} fill="none" stroke={mono.ground} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            ),
          ];
        })}
      </Svg>
    </View>
  );
}

export function O3OneBadDay({ next, back }: { next: () => void; back?: () => void }) {
  return (
    <HeroBoard
      nav={{ left: 'back', right: 'empty', onBack: back }}
      art={<WeekStrip />}
      artTop={329}
      stackTop={451}
      gap={16}
      titleSize={26}
      title="One bad day is one bad day."
      body="It doesn’t erase the work before it. Your lessons, logs, rating history and medallions stay."
      extra={<InkP center>What matters is that you come back.</InkP>}
      cta="Continue"
      onCta={next}
    />
  );
}

// ── 34 · What You Want Back ──────────────────────────────────────────

/**
 * Up to three 64pt ink pills: his `17 · What it affects` answers read back in
 * the picker's order (CRITIC §5, tail Q5). Only what he picked — the frame's
 * trio (Focus, Sleep, Confidence) is its sample answer, and topping a shorter
 * pick up from it put words in his mouth under "This is what you’re doing it
 * for" (D473). Picking none (allowed after "Not really") draws no pills.
 */
export function wantBackPills(affects: string[], order: readonly string[]): string[] {
  const picked = [...new Set(affects)].sort((x, y) => order.indexOf(x) - order.indexOf(y));
  return picked.slice(0, 3);
}

export function O3WhatYouWantBack({ pills = [], next, back }: { pills?: string[]; next: () => void; back?: () => void }) {
  // the heading takes two lines on a narrow phone; the band measures the stack
  const [stackH, setStackH] = useState(445);
  return (
    <Screen>
      <NavBar left="back" right="empty" onBack={back} />
      <Band start={193} end={193 + stackH}>
        <Stack top={193} onLayout={setStackH}>
          <MonoText v="h1">This is what you’re doing it for.</MonoText>
          {pills.length ? <View style={{ height: 10 }} /> : null}
          {pills.map((label) => (
            <View key={label} style={{ height: 64, borderRadius: 32, backgroundColor: mono.ink, alignItems: 'center', justifyContent: 'center' }}>
              <MonoText v="gridLabel" color={mono.onInk} wrap="wrap" style={{ lineHeight: lhNormal(16) }}>
                {label}
              </MonoText>
            </View>
          ))}
          <View style={{ height: 10 }} />
          <MonoText v="p">Not a perfect streak for its own sake.</MonoText>
          <InkP>More of your time and attention going where you actually want them.</InkP>
        </Stack>
      </Band>
      <PrimaryButton label="Continue" onPress={next} />
    </Screen>
  );
}
