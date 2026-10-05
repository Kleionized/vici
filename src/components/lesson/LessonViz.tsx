import { useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { MonoText, Pill } from '@/components/mono';
import type { LessonViz } from '@/content/lessons';
import { mono, ring, sans } from '@/lib/theme';

import { LT } from './LessonText';

/**
 * The six parametric cards the readers lead a page with (lessons.md §4,
 * `gen/lesson-v3.js VIZ`) — 33 frames, all drawn from the generated payloads.
 * A visualisation always leads its page and is full column width.
 */

/** the band's 32 gutters and a card's 20 padding: 289 at 393 */
const innerWidth = (screenW: number) => screenW - 64 - 40;

const card = { borderRadius: 20, backgroundColor: mono.card } as const;

/** `chain` — a vertical sequence; the marked step is a filled dot and may carry a tag. */
function Chain({ v }: { v: Extract<LessonViz, { type: 'chain' }> }) {
  return (
    <View style={[card, { padding: 20 }]}>
      {v.cap ? <LT r="label">{v.cap}</LT> : null}
      <View style={{ marginTop: v.cap ? 14 : 0 }}>
        {v.steps.map((s, i) => {
          const last = i === v.steps.length - 1;
          const marked = i === v.mark;
          return (
            <View key={i} style={{ flexDirection: 'row', gap: 14 }}>
              {/* the rail column stretches to the row (the text sets its height); the connector fills it */}
              <View style={{ width: 12, flexShrink: 0, alignItems: 'center' }}>
                <View
                  style={[
                    { marginTop: 5, width: 12, height: 12, borderRadius: 6, flexShrink: 0 },
                    marked ? { backgroundColor: mono.ink } : { borderWidth: 2, borderColor: mono.mute },
                  ]}
                />
                {last ? null : <View style={{ flex: 1, width: 2, marginTop: 5, backgroundColor: mono.art }} />}
              </View>
              <View style={{ flex: 1, minWidth: 0, paddingBottom: last ? 0 : 16 }}>
                <LT r="chainT">{s}</LT>
                {marked && v.tag ? (
                  <View style={{ marginTop: 8, flexDirection: 'row' }}>
                    <Pill kind="lessonTag" label={v.tag} />
                  </View>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/** `compare` — two cards side by side; one may carry the ink inset ring. */
function Compare({ v }: { v: Extract<LessonViz, { type: 'compare' }> }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'stretch' }}>
      {v.items.map((it, i) => (
        <View
          key={i}
          style={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: 0,
            minWidth: 0,
            borderRadius: 18,
            backgroundColor: mono.card,
            padding: 16,
            boxShadow: v.hi === i ? ring.insetInk : undefined,
          }}>
          <LT r="cmpL">{it.l}</LT>
          {it.v ? (
            <MonoText v="lessonHeading" wrap="nowrap" style={{ marginTop: 8 }}>
              {it.v}
            </MonoText>
          ) : null}
          <LT r="cmpT" style={{ marginTop: 8 }}>
            {it.t}
          </LT>
        </View>
      ))}
    </View>
  );
}

const PAIR_LEFT = { wide: 112, narrow: 44, letters: 64 } as const;

/** `pairs` — a two-column table: wide (a 112 phrase), narrow (If / Then) or letters (H · A · L · T). */
function Pairs({ v }: { v: Extract<LessonViz, { type: 'pairs' }> }) {
  const wl = PAIR_LEFT[v.variant];
  return (
    <View style={[card, { paddingVertical: 6, paddingHorizontal: 20 }]}>
      {v.head ? (
        <View style={{ flexDirection: 'row', gap: 16, paddingTop: 12, paddingBottom: 10 }}>
          <View style={{ width: wl, flexShrink: 0 }}>
            <LT r="label">{v.head[0]}</LT>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <LT r="label">{v.head[1]}</LT>
          </View>
        </View>
      ) : null}
      {v.rows.map((row, i) => (
        <View
          key={i}
          style={[
            { flexDirection: 'row', gap: 16, paddingVertical: 14 },
            i > 0 || v.head ? { borderTopWidth: 1, borderTopColor: mono.line } : null,
            v.variant === 'letters' ? { alignItems: 'center' } : null,
          ]}>
          <View style={{ width: wl, flexShrink: 0 }}>
            {v.variant === 'letters' ? (
              <>
                {/* 24/31 700, no tracking (the frame states none) */}
                <MonoText v="lessonHeading" wrap="wrap" style={{ letterSpacing: 0 }}>
                  {row[0]}
                </MonoText>
                <MonoText v="lessonCaps" wrap="nowrap" style={{ marginTop: 2 }}>
                  {row[1]}
                </MonoText>
              </>
            ) : v.variant === 'narrow' ? (
              // "If" / "Then": 15/22 700 ink, no wrap rule stated
              <LT r="pairL" wrap="wrap">
                {row[0]}
              </LT>
            ) : (
              <LT r="pairL">{row[0]}</LT>
            )}
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <LT r="pairR">{v.variant === 'letters' ? row[2] : row[1]}</LT>
          </View>
        </View>
      ))}
    </View>
  );
}

/**
 * `wave` (L15 F5) — the urge curve. The frame's svg is 289 × 96 with
 * `overflow: visible` (the dashed marker starts at y −8, the curve's round cap
 * passes x 289); native svg clips at its viewport, so the viewport is widened
 * to hold what the frame draws outside it, and scales with the card's inner
 * width on other phones — the box and the `Time` label follow the plot's
 * scaled foot, so the label never meets the baseline.
 */
function Wave({ v }: { v: Extract<LessonViz, { type: 'wave' }> }) {
  const { width } = useWindowDimensions();
  const k = innerWidth(width) / 289;
  const curve = 'M0 84 C28 82 52 14 96 10 C134 7 150 56 182 60 C206 63 214 38 236 40 C258 42 270 70 289 76';
  return (
    <View style={[card, { padding: 20 }]}>
      {/* 144 at 393: the 96 plot at 32 and the `Time` label under it, which follows the plot's scaled foot */}
      <View style={{ height: 32 + 96 * k + 16 }}>
        <Svg width={293 * k} height={104 * k} viewBox="-2 -8 293 104" style={{ position: 'absolute', left: -2 * k, top: 32 - 8 * k }}>
          <Path d={`${curve} L289 88 L0 88 Z`} fill={mono.art} fillOpacity={0.35} />
          <Path d="M0 88 H289" stroke={mono.art} strokeWidth={1.5} />
          <Path d={curve} fill="none" stroke={mono.ink} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M40 -8 V88" stroke={mono.ink} strokeWidth={1.5} strokeDasharray="3 4" />
          <Circle cx={40} cy={50} r={6} fill={mono.ink} stroke={mono.card} strokeWidth={3} />
        </Svg>
        <View style={{ position: 'absolute', left: 28, top: 0 }}>
          <Pill kind="lessonTag" label={v.tag} />
        </View>
        <MonoText v="lessonCaps" wrap="wrap" style={{ position: 'absolute', right: 0, top: 4 }}>
          Urge
        </MonoText>
        <MonoText v="lessonCaps" wrap="wrap" style={{ position: 'absolute', right: 0, top: 32 + 96 * k }}>
          Time
        </MonoText>
      </View>
      <LT r="vcap" style={{ marginTop: 16 }}>
        {v.cap}
      </LT>
    </View>
  );
}

const round1 = (x: number) => Math.round(x * 10) / 10;

/** `track` (L35 F5, L75 F8) — check-in nodes on a line; the first is now. */
function Track({ v }: { v: Extract<LessonViz, { type: 'track' }> }) {
  const { width } = useWindowDimensions();
  const w = innerWidth(width);
  const n = v.nodes.length;
  const cw = w / n;
  const cx = (i: number) => round1(cw * i + cw / 2);
  return (
    <View style={[card, { padding: 20 }]}>
      {v.cap ? <LT r="label">{v.cap}</LT> : null}
      <View style={{ height: 38, marginTop: 18 }}>
        <View style={{ position: 'absolute', left: cx(0), right: cx(0), top: 5, height: 2, backgroundColor: mono.art }} />
        {v.nodes.map((node, i) => (
          <View
            key={`d${i}`}
            style={[
              { position: 'absolute', left: round1(cx(i) - 6), top: 0, width: 12, height: 12, borderRadius: 6 },
              i === 0 ? { backgroundColor: mono.ink } : { backgroundColor: mono.card, borderWidth: 2, borderColor: mono.mute },
            ]}
          />
        ))}
        {v.nodes.map((node, i) => (
          <MonoText
            key={`l${i}`}
            v="lessonCaps"
            wrap="nowrap"
            center
            color={i === 0 ? mono.ink : mono.mute}
            style={{ position: 'absolute', top: 22, left: round1(cw * i), width: round1(cw) }}>
            {node}
          </MonoText>
        ))}
      </View>
    </View>
  );
}

/** `bars` (L41 F4) — two horizontal bars; the width and the printed value are separate fields. */
function Bars({ v }: { v: Extract<LessonViz, { type: 'bars' }> }) {
  return (
    <View style={[card, { padding: 20 }]}>
      {v.cap ? <LT r="label">{v.cap}</LT> : null}
      <View style={{ marginTop: 16, gap: 16 }}>
        {v.rows.map((row, i) => (
          <View key={i}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
              <MonoText v="pTight" wrap="nowrap" color={mono.ink}>
                {row.label}
              </MonoText>
              <MonoText v="pTight" wrap="nowrap" color={mono.ink} style={sans('700')}>
                {row.value}
              </MonoText>
            </View>
            <View style={{ marginTop: 8, height: 8, borderRadius: 4, backgroundColor: mono.line }}>
              <View
                style={{
                  width: `${row.pct}%`,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === v.rows.length - 1 ? mono.ink : mono.mute,
                }}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export function LessonVizCard({ viz }: { viz: LessonViz }) {
  switch (viz.type) {
    case 'chain':
      return <Chain v={viz} />;
    case 'compare':
      return <Compare v={viz} />;
    case 'pairs':
      return <Pairs v={viz} />;
    case 'wave':
      return <Wave v={viz} />;
    case 'track':
      return <Track v={viz} />;
    case 'bars':
      return <Bars v={viz} />;
  }
}
