import { useState, type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { Card, CheckDisc, CheckRow, CheckRows, Hero, HeroBoard, heroArtTop, MonoText, ScrollRegion, Tap } from '@/components/mono';
import type { HeroKey } from '@/content/heroes';
import { mono, ring, sans } from '@/lib/theme';

/**
 * The morning and night check-ins on the overhaul's mono kit (today-day §3–§4).
 *
 * Every step is the kit's board: the nav row (back · eight dashes · close), a
 * question stack at canvas 136, the step's own control, a Lesson-Illustrations
 * hero, and the primary (or the round next) at the frame's bottom. The pieces
 * here are the ones the two flows share that the kit does not carry; the
 * screens lay them out in canvas coordinates inside `Screen`.
 */

/*
 * The day a check-in names is `programmeDay` (`src/lib/day.ts`): calendar days
 * from the programme's first day, the same count Today's pill and the lesson
 * use — not 24-hour blocks from the minute the account was made.
 */

/**
 * What the bottom controls take off the screen's bottom edge, for a hero
 * between the content and them (D320 rule 1): the 58 primary at 48, the
 * primary at 96 over a ghost link, the 60 round next at 52.
 */
export const CONTROLS = { primary: 106, ghost: 154, fab: 112 } as const;

/** `[question] stack: left 24 right 24 top 136; column; gap N`. */
export function Stack({ top = 136, gap, center, children }: { top?: number; gap: number; center?: boolean; children?: ReactNode }) {
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, top, gap, alignItems: center ? 'center' : undefined }}>
      {children}
    </View>
  );
}

/**
 * A step whose stack carries copy the frame does not fix — yesterday's task
 * sentence, the standing pledge, tonight's lesson title and task, the
 * reflection being written: the stack at canvas 136 in the band between the
 * nav and the controls, and the decorative hero under it.
 *
 * At 393 × 852 with the frames' copy nothing moves (every frame keeps ≥ 60
 * between its stack and the art). With the longest copy real data puts here —
 * lesson 58's 196-character task (D339), a five-line pledge, a long entry — or
 * on a short phone, the band scrolls instead of running under the controls,
 * and the hero steps aside once the stack comes within 16 of the art, as it
 * does for the controls (D320 rule 1), rather than being written over.
 */
export function StepStack({
  gap,
  controls,
  hero,
  children,
}: {
  gap: number;
  /** what the step's bottom controls take off the screen edge (`CONTROLS`) */
  controls: number;
  hero: { id: HeroKey; top: number; scale?: number };
  children?: ReactNode;
}) {
  // Drawn until the stack is measured, so the frames' boards never flash without their art.
  const [height, setHeight] = useState(0);
  const clear = height === 0 || 136 + height + 16 <= heroArtTop(hero.id, hero.top, hero.scale);
  return (
    <>
      {clear ? <Hero id={hero.id} top={hero.top} scale={hero.scale} controls={controls} /> : null}
      {/* The band runs down to the controls' top and keeps its 16 as padding, so
          the last row of a stack that only just overflows (L58's seven lines over
          Yes / Not yet at 375 × 667) shows whole at rest instead of being cut by
          the band's edge; scrolled to its end it still stops 16 above them. */}
      <ScrollRegion top={136} bottom={controls} contentStyle={{ paddingHorizontal: 24, paddingBottom: 16 }}>
        <View onLayout={(e) => setHeight(Math.ceil(e.nativeEvent.layout.height))} style={{ gap }}>
          {children}
        </View>
      </ScrollRegion>
    </>
  );
}

/**
 * The covers (Morning / Night Check-in Cover): close only, the hero at 190,
 * caps over the 34/40 title at 452, gap 12, and "Begin". The night one is the
 * dark `#111111` shell with the white pill.
 */
export function CheckinCover({ part, day, onBegin, onClose }: { part: 'morning' | 'night'; day: number; onBegin: () => void; onClose: () => void }) {
  const night = part === 'night';
  return (
    <HeroBoard
      tone={night ? 'dark' : 'light'}
      nav={{ left: 'empty', right: 'close', onClose }}
      hero={night ? 'nightMoon' : 'sunrise'}
      gap={12}
      caps={`Day ${day}, about two minutes`}
      title={night ? 'Night check-in.' : 'Morning check-in.'}
      titleSize={34}
      cta="Begin"
      onCta={onBegin}
    />
  );
}

/**
 * Morning Task Check's card: `r24 #1E1E1E padding 22`, column gap 8 — the
 * caps "Yesterday" and the task sentence 19/700/28 ink.
 */
export function TaskCard({ label, sentence }: { label: string; sentence: string }) {
  return (
    <Card padding={22}>
      <View style={{ gap: 8 }}>
        <MonoText v="caps">{label}</MonoText>
        <MonoText v="rowLabel" wrap="wrap" style={{ fontSize: 19, lineHeight: 28 }}>
          {sentence}
        </MonoText>
      </View>
    </Card>
  );
}

export type RecordRow = { label: string; value?: string; done?: boolean };

/**
 * The record (Morning 1 Yesterday, Night 2 Record): ruled check rows at canvas
 * 208, no card. A row the day did not earn ("No pledge signed", "1 slip") keeps
 * its own words over the kit's empty disc (D355).
 */
export function RecordRows({ rows }: { rows: RecordRow[] }) {
  return (
    <View style={{ position: 'absolute', left: 24, right: 24, top: 208 }}>
      <CheckRows>
        {rows.map((r) => (
          <CheckRow key={r.label} label={r.label} value={r.value} done={r.done ?? true} />
        ))}
      </CheckRows>
    </View>
  );
}

/**
 * Night 2 Record's door into the urge log: an outline pill centred at 470 —
 * `h44 r22`, the line ring, `padding 0 18`, gap 8, 15/700 ink, after an 18px
 * "+" set on a line box of one.
 */
export function AddToRecord({ onPress }: { onPress: () => void }) {
  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, top: 470, flexDirection: 'row', justifyContent: 'center' }}>
      <Tap
        onPress={onPress}
        label="Add to the record"
        style={{ height: 44, borderRadius: 22, boxShadow: ring.outline, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18 }}>
        <Text maxFontSizeMultiplier={1.3} style={{ ...sans('700'), fontSize: 18, lineHeight: 18, color: mono.ink }}>
          +
        </Text>
        <MonoText v="rowLabel">Add to the record</MonoText>
      </Tap>
    </View>
  );
}

/** Morning 5 Done's mark: the 132 ink disc with its 56 check, centred at canvas 288. */
export function DoneMark() {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 288, flexDirection: 'row', justifyContent: 'center' }}>
      <CheckDisc size={132} />
    </View>
  );
}

/** Night 4 Closed's line under the title: 16/400/25 at 60 % white. */
export function ClosedLine({ children }: { children: string }) {
  return (
    <MonoText v="p" center wrap="pretty" color="rgba(255,255,255,0.6)" style={{ alignSelf: 'stretch', fontSize: 16, lineHeight: 25 }}>
      {children}
    </MonoText>
  );
}
