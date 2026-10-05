import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';

import { FaceCoin, kkMetal, kkTierLine } from '@/components/keepsakes/Medallion';
import { LoadingView, MonoText, NavBar, Screen, Segmented, Tap, TitleHead } from '@/components/mono';
import { useMedallionLedger, type LedgerFace } from '@/lib/album';
import { roman, shortDate } from '@/lib/format';
import { mono } from '@/lib/theme';

/**
 * 88 · 88B · 88C — Medallions (`Medallions`, `Medallions Still To Earn`,
 * `Album Earned II`).
 *
 * One board, two segments: the faces that have been earned and the ones still
 * ahead. Each face is a bare cell — the 64 coin, its name and where it stands —
 * in a 3-column grid, **six to a page**: `Album Earned II` redraws the grid from
 * the same origin (288) with faces 7–10, and `Medallions` leaves row 3's place
 * empty, so the only reading that draws both frames is a horizontal pager of
 * 3 × 2 pages (CRITIC §5, medallions Q1). No page dots — none is drawn.
 * Two faces or fewer sit as a centred row instead (`Still to earn`, gap 48),
 * on either segment (Q2, D271).
 *
 * The counts are live (`src/lib/album.ts`); the canvas's "10 of 12 earned" is
 * its own sample account. Tapping a face opens its board at its own rung.
 */

type Segment = 'earned' | 'ahead';

/** `left 24 right 24 top 288; grid 1fr 1fr 1fr; row-gap 36; column-gap 8` */
const GRID = { top: 288, gutter: 24, rowGap: 36, colGap: 8, cols: 3, rows: 2 };
/** a cell: 64 coin + 10 + 18 name + 2 + 15 state */
const CELL_H = 109;
/** an unearned tiered cell adds its bar: + 10 gap + 3 */
const BAR_H = 13;

export default function Milestones() {
  const router = useRouter();
  const ledger = useMedallionLedger();
  const { width } = useWindowDimensions();
  const [segment, setSegment] = useState<Segment>('earned');
  const pager = useRef<ScrollView>(null);

  const back = () => (router.canGoBack() ? router.back() : router.navigate('/(app)/today'));

  // The two segments hold different pages; a carried-over offset would open
  // the other one on a page it may not have.
  const show = (next: Segment) => {
    setSegment(next);
    pager.current?.scrollTo({ x: 0, animated: false });
  };

  if (!ledger) return <LoadingView onBack={back} />;

  const shown = ledger.faces.filter((f) => (segment === 'earned' ? f.earned : !f.earned));
  const open = (f: LedgerFace) => router.push(`/medallions/${f.face.key}?tier=${f.earned ? kkMetal(f.face, f.standing) : 'none'}`);

  const perPage = GRID.cols * GRID.rows;
  const pages: LedgerFace[][] = [];
  for (let i = 0; i < shown.length; i += perPage) pages.push(shown.slice(i, i + perPage));
  // The pager is as tall as its tallest page: a row holding an unearned tiered
  // face grows by that face's bar, and a pager cut at two bare rows clips it.
  const rowH = shown.some((f) => !f.earned && f.face.steps.length > 0) ? CELL_H + BAR_H : CELL_H;

  return (
    <Screen>
      <NavBar left="back" onBack={back} />
      <TitleHead title="Medallions" />
      <Segmented
        items={[
          { key: 'earned', label: 'Earned' },
          { key: 'ahead', label: 'Still to earn' },
        ]}
        value={segment}
        onChange={show}
        style={{ position: 'absolute', left: 16, right: 16, top: 164 }}
      />
      <View style={{ position: 'absolute', left: 0, right: 0, top: 238 }}>
        <MonoText v="caps" center style={{ lineHeight: 22 }}>
          {segment === 'earned' ? `${ledger.earned} of ${ledger.total} earned` : `${ledger.total - ledger.earned} still to earn`}
        </MonoText>
      </View>

      {shown.length <= 2 ? (
        <View style={{ position: 'absolute', left: GRID.gutter, right: GRID.gutter, top: GRID.top, flexDirection: 'row', justifyContent: 'center', gap: 48 }}>
          {shown.map((f) => (
            <FaceCell key={f.face.key} entry={f} onPress={() => open(f)} />
          ))}
        </View>
      ) : (
        <ScrollView
          ref={pager}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={{ position: 'absolute', left: 0, right: 0, top: GRID.top, height: rowH * GRID.rows + GRID.rowGap + 24 }}>
          {pages.map((page, p) => (
            <View key={p} style={{ width, paddingHorizontal: GRID.gutter, gap: GRID.rowGap }}>
              {Array.from({ length: Math.ceil(page.length / GRID.cols) }, (_, r) => page.slice(r * GRID.cols, r * GRID.cols + GRID.cols)).map((row, r) => (
                <View key={r} style={{ flexDirection: 'row', gap: GRID.colGap, alignItems: 'flex-start' }}>
                  {Array.from({ length: GRID.cols }, (_, c) => {
                    const f = row[c];
                    // an empty track keeps the grid's 1fr columns where a page ends short
                    return f ? <FaceCell key={f.face.key} entry={f} grid onPress={() => open(f)} /> : <View key={`_${c}`} style={{ flex: 1 }} />;
                  })}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}

/**
 * Where a face stands, in the album's words. Earned and tiered: its rung
 * (`Tier I, Day 7`). Earned once: the day it minted (`Jun 9`). Unearned and
 * tiered: the count toward its first rung (`9 of 10 entries`). Unearned once:
 * what would mint it (`After 7 days away`).
 */
function stateLine(f: LedgerFace): string {
  const { face } = f;
  if (f.earned) return face.steps.length ? kkTierLine(face, f.standing) : f.date != null ? shortDate(f.date) : face.blurb;
  if (face.steps.length) {
    // a first rung of one reads in the singular (`0 of 1 wave`) — only Breakwater's
    // waves and Rebound's mornings start at one, both plain -s plurals
    const noun = face.noun && face.steps[0] === 1 ? face.noun.replace(/s$/, '') : face.noun;
    return `${f.count} of ${face.steps[0]}${noun ? ` ${noun}` : ''}`;
  }
  return face.ahead ?? face.blurb;
}

/**
 * One face: `column center gap 10` — the 64 coin, then the name (15/700 −0.2,
 * ink earned / mute not) over the state line (12/700 mute), `gap 2`. An
 * unearned tiered face adds a 56 × 3 bar filled to its first rung.
 */
function FaceCell({ entry, grid, onPress }: { entry: LedgerFace; grid?: boolean; onPress: () => void }) {
  const { face } = entry;
  const tiered = face.steps.length > 0;
  const line = stateLine(entry);
  // the numeral is the rung it stands on — or, unearned, the one it is waiting on
  const numeral = tiered ? roman(Math.max(1, entry.standing)) : undefined;
  return (
    <Tap onPress={onPress} label={`${face.name}. ${line}`} style={[{ alignItems: 'center', gap: 10 }, grid ? { flex: 1 } : null]}>
      <FaceCoin scene={face.key} size={64} earned={entry.earned} numeral={numeral} />
      <View style={{ gap: 2 }}>
        <MonoText v="rowLabel" center color={entry.earned ? mono.ink : mono.mute} style={{ letterSpacing: -0.2 }}>
          {face.name}
        </MonoText>
        <MonoText v="legal" center wrap="nowrap" style={{ letterSpacing: 0 }}>
          {line}
        </MonoText>
      </View>
      {!entry.earned && tiered ? (
        <View style={{ width: 56, height: 3, borderRadius: 2, backgroundColor: mono.line }}>
          <View style={{ width: `${Math.min(100, (entry.count / face.steps[0]) * 100)}%`, height: 3, borderRadius: 2, backgroundColor: mono.ink }} />
        </View>
      ) : null}
    </Tap>
  );
}
