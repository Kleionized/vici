import { useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';

import {
  BedPhoneMark,
  ClockMark,
  CrescentMark,
  SunDot,
  SunriseMark,
} from '@/components/lesson/scroll';
import { CoverSceneL1 } from '@/components/lesson/coverL1';
import { Scene } from '@/components/task/TaskScene';
import { AppText, PressScale } from '@/components/ui';
import { COVER_SCENE, COVER_SCENE_H, COVER_SCENE_W } from '@/content/coverScene';
import { READER_RAMPS, type Glyph, type MarkName, type PickOption, type ReaderCta, type ReaderPage, type ReaderPart, type TaskOptionRow } from '@/content/lessonReader';
import { READER_ROOM, READER_ROOM_H, READER_ROOM_W } from '@/content/readerRoom';
import { sans } from '@/lib/theme';

/**
 * The reader for all 84 lessons.
 *
 * The bundle authors 1,398 pages in 34 distinct type signatures, so this does
 * not switch over a fixed set of page kinds — it walks the parts each page
 * carries and draws each one at the metrics its own frame states. A layout the
 * design uses once, on one lesson out of eighty-four, therefore renders without
 * needing a case of its own.
 *
 * `src/content/lessonReader.ts` is the transcription; every number below comes
 * from there rather than from a constant here.
 */

/**
 * The canvas names `'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif`
 * for the epigraph. RN resolves a single family, so this is that stack resolved
 * per platform — the same choice the existing reader already made.
 */
const SERIF = Platform.select({
  ios: 'Iowan Old Style',
  android: 'serif',
  default: "'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif",
}) as string;

/** A run of copy, at the ramp its frame states. */
export function Run({ r, s }: { r: number; s: string }) {
  const ramp = READER_RAMPS[r];
  if (!ramp) return null;
  return (
    <AppText
      center
      style={[
        ramp.serif ? { fontFamily: SERIF, fontWeight: ramp.weight as '500' } : sans(ramp.weight as '400'),
        {
          fontSize: ramp.size,
          ...(ramp.lineHeight ? { lineHeight: ramp.lineHeight } : {}),
          ...(ramp.letterSpacing ? { letterSpacing: ramp.letterSpacing } : {}),
          color: ramp.color,
          ...(ramp.maxWidth ? { maxWidth: ramp.maxWidth } : {}),
          // The canvas balances every heading run and only prevents orphans in
          // the paragraphs. AppText's default is `pretty` for both, which
          // leaves a short heading's last line ragged.
          ...(ramp.wrap ? { textWrap: ramp.wrap } : {}),
        },
      ]}>
      {s}
    </AppText>
  );
}

/** The art a page can open with. Every mark is shared across the 84 lessons. */
export function Mark({ name, boxHeight, scale }: { name: MarkName; boxHeight?: number; scale?: number }) {
  const art =
    name === 'sun12' ? <SunDot size={12} /> :
    name === 'sun14' ? <SunDot size={14} /> :
    name === 'sun36' ? <SunDot size={36} halo={115} /> :
    name === 'crescent' ? <CrescentMark /> :
    name === 'sunrise' ? <SunriseMark /> :
    name === 'clock' ? <ClockMark /> :
    name === 'bedphone' ? <BedPhoneMark /> :
    name === 'room' ? <Scene layers={READER_ROOM} boxW={READER_ROOM_W} boxH={READER_ROOM_H} width={READER_ROOM_W * (scale ?? 1)} /> :
    name === 'cover' ? <Scene layers={COVER_SCENE} boxW={COVER_SCENE_W} boxH={COVER_SCENE_H} width={COVER_SCENE_W} /> :
    // Lesson 1 is the only lesson with cover art of its own.
    name === 'coverL1' ? <CoverSceneL1 /> :
    null;
  if (!art) return null;
  // Lesson 1's task page reserves a fixed height and scales the scene inside it.
  if (boxHeight) return <View style={{ height: boxHeight, justifyContent: 'flex-start', alignItems: 'center' }}>{art}</View>;
  return art;
}

/** One part of a page, drawn as its frame draws it. */
export function Part({ part }: { part: ReaderPart }) {
  switch (part.t) {
    case 'text':
      return <Run r={part.r} s={part.s} />;
    case 'spacer':
      return <View style={{ height: part.height }} />;
    case 'mark':
      return <Mark name={part.name} boxHeight={part.boxHeight} scale={part.scale} />;
    case 'cascade':
      return (
        <View pointerEvents="none" style={{ alignItems: 'center', gap: part.gap }}>
          {part.lines.map((line, i) => (
            <AppText
              key={i}
              center
              style={[
                sans(String(line.weight) as '500'),
                {
                  fontSize: line.size,
                  ...(line.lineHeight ? { lineHeight: line.lineHeight } : {}),
                  ...(line.maxWidth ? { maxWidth: line.maxWidth } : {}),
                  ...(line.wrap ? { textWrap: line.wrap as 'balance' } : {}),
                  color: line.color,
                },
              ]}>
              {line.text}
            </AppText>
          ))}
        </View>
      );
    case 'attribution':
      return (
        <View pointerEvents="none" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: part.gap }}>
          {part.rule ? <View style={{ width: part.rule.width, height: part.rule.height, backgroundColor: part.rule.background }} /> : null}
          <AppText style={[sans(String(part.weight) as '600'), { fontSize: part.size, ...(part.letterSpacing ? { letterSpacing: part.letterSpacing } : {}), color: part.color }]}>
            {part.text}
          </AppText>
          {part.rule ? <View style={{ width: part.rule.width, height: part.rule.height, backgroundColor: part.rule.background }} /> : null}
        </View>
      );
    case 'rule':
      return (
        <View
          // Nothing on a reading page is a control: the whole board is the way
          // on, so a filled plate must not swallow the tap that turns the page.
          pointerEvents="none"
          style={{
            alignSelf: 'stretch',
            borderRadius: part.radius,
            borderCurve: 'continuous',
            backgroundColor: part.background,
            boxShadow: part.shadow,
            paddingVertical: Number(part.padding.split(/\s+/)[0].replace('px', '')),
            paddingHorizontal: Number(part.padding.split(/\s+/)[1].replace('px', '')),
            flexDirection: 'row',
            alignItems: 'center',
            gap: part.gap,
          }}>
          <GlyphArt glyph={part.tick} />
          <AppText style={[sans(String(part.weight) as '500'), { flex: 1, fontSize: part.size, lineHeight: part.lineHeight, color: part.color }]}>{part.text}</AppText>
        </View>
      );
    case 'picklist':
      return <PickRows options={part.options} gap={part.gap} multi={false} />;
  }
}

/* ---------------------------------------------------------------- the pills */

/**
 * The pick rows. The canvas draws one row already chosen so the reader can see
 * the chosen state; the app starts with none and lets the choice be made, which
 * is why `selected` in the data is the *specimen* rather than the initial state.
 */
function PickRows({ options, gap, multi }: { options: PickOption[]; gap: number; multi: boolean }) {
  const [chosen, setChosen] = useState<number[]>([]);
  const toggle = (i: number) => setChosen((c) => (multi ? (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]) : c.includes(i) ? [] : [i]));
  // The frame draws one row already chosen, so its weight is the *chosen*
  // weight and every other row's is the resting one. The app starts with none
  // chosen, so a row takes the resting weight until it is.
  const chosenWeight = String(options.find((o) => o.selected)?.weight ?? 600) as '600';
  const restWeight = String(options.find((o) => !o.selected)?.weight ?? 500) as '500';
  return (
    <View style={{ alignSelf: 'stretch', gap }}>
      {options.map((o, i) => {
        const on = chosen.includes(i);
        return (
          <PressScale
            key={i}
            onPress={() => toggle(i)}
            accessibilityRole={multi ? 'checkbox' : 'radio'}
            accessibilityState={{ checked: on }}
            style={{
              minHeight: o.minHeight ?? 56,
              borderRadius: o.radius ?? 16,
              borderCurve: 'continuous',
              backgroundColor: '#FFFFFF',
              // The frame states both states: chosen is a 2pt ring and a lift,
              // unchecked a 1.5pt inset hairline.
              boxShadow: on ? '0 0 0 2px #1D1C1A, 0 4px 10px rgba(40,38,32,0.08)' : 'inset 0 0 0 1.5px #E4E2DB',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 18,
              paddingVertical: 9,
              gap: o.rowGap ?? 14,
            }}>
            <View
              style={{
                width: o.dot?.size ?? 22,
                height: o.dot?.size ?? 22,
                borderRadius: (o.dot?.size ?? 22) / 2,
                ...(on
                  ? { borderWidth: 2, borderColor: '#1D1C1A', alignItems: 'center', justifyContent: 'center' }
                  : { boxShadow: 'inset 0 0 0 1.6px #C9C7C0' }),
              }}>
              {on ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#1D1C1A' }} /> : null}
            </View>
            {/* the canvas's label is a `<span>`: it takes the width of its own
                words and wraps only when they do not fit */}
            <AppText style={[sans(on ? chosenWeight : restWeight), { flexShrink: 1, fontSize: o.size ?? 16, lineHeight: o.lineHeight ?? 21, color: '#1D1C1A' }]}>
              {o.text}
            </AppText>
          </PressScale>
        );
      })}
    </View>
  );
}

/* --------------------------------------------------------------- the boards */

/** The pill at the foot of the pick and completion boards. */
export function Cta({ cta, onPress, bottomInset = 0 }: { cta: ReaderCta; onPress: () => void; bottomInset?: number }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      style={{
        position: 'absolute',
        left: cta.left,
        right: cta.left,
        bottom: cta.bottom - bottomInset,
        height: cta.height,
        minHeight: cta.height,
        borderRadius: cta.radius,
        backgroundColor: '#131313',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
      }}>
      <AppText style={[sans(String(cta.weight) as '600'), { fontSize: cta.size, ...(cta.letterSpacing ? { letterSpacing: cta.letterSpacing } : {}), color: '#FFFFFF' }]}>
        {cta.text}
      </AppText>
    </PressScale>
  );
}

/** The task-options board's row: a glyph plate and a heading over a body. */
function OptionRow({ option }: { option: TaskOptionRow }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: option.rowGap ?? 16 }}>
      {option.plate ? (
        <View
          style={{
            width: option.plate.size,
            height: option.plate.size,
            borderRadius: option.plate.radius,
            borderCurve: 'continuous',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.08), 0 3px 8px rgba(40,38,32,0.06)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <GlyphArt glyph={option.glyph} />
        </View>
      ) : null}
      <View style={{ flex: 1, minWidth: 0 }}>
        {option.head ? (
          <AppText style={[sans('600'), { fontSize: option.headSize ?? 16, lineHeight: option.headLine ?? 22, color: '#1D1C1A' }]}>{option.head}</AppText>
        ) : null}
        {option.body ? (
          <AppText style={[sans('400'), { marginTop: option.bodyTop ?? 4, fontSize: option.bodySize ?? 13, lineHeight: option.bodyLine ?? 19, color: '#767370' }]}>
            {option.body}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const NUM = new Set(['x', 'y', 'width', 'height', 'rx', 'ry', 'cx', 'cy', 'r', 'x1', 'y1', 'x2', 'y2', 'stroke-width', 'stroke-opacity', 'fill-opacity']);

function GlyphArt({ glyph }: { glyph?: Glyph }) {
  if (!glyph) return null;
  return (
    <Svg width={glyph.width} height={glyph.height ?? glyph.width} viewBox={glyph.viewBox ?? '0 0 20 20'} fill="none">
      {glyph.children.map((child, i) => {
        const props: Record<string, string | number> = {};
        for (const [key, value] of Object.entries(child.attrs)) {
          props[key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())] = NUM.has(key) && !Number.isNaN(Number(value)) ? Number(value) : value;
        }
        switch (child.tag) {
          case 'path': return <Path key={i} {...props} />;
          case 'rect': return <Rect key={i} {...props} />;
          case 'circle': return <Circle key={i} {...props} />;
          case 'ellipse': return <Ellipse key={i} {...props} />;
          case 'line': return <Line key={i} {...props} />;
          case 'polygon': return <Polygon key={i} {...props} />;
          case 'polyline': return <Polyline key={i} {...props} />;
          case 'g': return <G key={i} {...props} />;
          default: return null;
        }
      })}
    </Svg>
  );
}

/**
 * The two board pages, which unlike the 1,241 centred pages lay themselves out
 * from a stated top with the pill pinned to the foot.
 */
export function Board({ page }: { page: Extract<ReaderPage, { k: 'pick' | 'board' }> }) {
  const pad = page.k === 'board' ? page.padding.split(/\s+/).map((v) => Number(v.replace('px', ''))) : null;
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: page.top,
        bottom: page.bottom,
        alignItems: 'center',
        justifyContent: page.k === 'board' ? 'flex-start' : 'center',
        gap: page.gap,
        ...(pad ? { paddingTop: pad[0], paddingHorizontal: pad[1] } : { paddingHorizontal: 38 }),
      }}>
      {page.k === 'pick' ? (
        <>
          {page.question ? <Run r={page.question.r} s={page.question.s} /> : null}
          {page.helper ? <Run r={page.helper.r} s={page.helper.s} /> : null}
          <PickRows options={page.options} gap={page.rowGap ?? 12} multi={page.multi} />
        </>
      ) : (
        // Five option rows and a closing note is taller than the band the frame
        // gives them on a short screen, so the list scrolls inside its own box
        // rather than running out of it. A board that fits does not move.
        <ScrollView
          style={{ alignSelf: 'stretch' }}
          // centred, because the frame's own column is `align-items: center`
          // and the title takes the width of its words inside its 320 max
          contentContainerStyle={{ flexGrow: 1, gap: page.gap, alignItems: 'center' }}
          showsVerticalScrollIndicator={false}>
          {page.title ? <Run r={page.title.r} s={page.title.s} /> : null}
          <View style={{ alignSelf: 'stretch', gap: page.rowGap ?? 18 }}>
            {page.options.map((o, i) => (
              <OptionRow key={i} option={o} />
            ))}
          </View>
          {page.close.map((c, i) => (
            <AppText key={i} style={[sans('400'), { alignSelf: 'stretch', marginTop: (c.marginTop ?? 0) - page.gap, fontSize: c.size ?? 13, lineHeight: c.lineHeight ?? 19, color: c.color ?? '#767370' }]}>
              {c.text}
            </AppText>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
