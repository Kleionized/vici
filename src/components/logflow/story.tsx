import type { ReactNode } from 'react';
import { View } from 'react-native';

import { ROW_GAP, CalendarGlyph, Check, GhostLink, Hero, MonoText, NavBar, PrimaryButton, QuoteMark, Screen, TrendGlyph, VizArt } from '@/components/mono';
import { SOS_VIZ } from '@/content/sosViz';
import type { DayStatus } from '@/lib/weeklyReport';
import type { StoryPage } from '@/lib/weeklyStory';
import { lhNormal, mono, ring } from '@/lib/theme';

/**
 * 91C … 91C6 · The weekly report's pages (Vici UI 2), drawn from
 * `weeklyStory` (src/lib/weeklyStory.ts): the nav's dashes (one 32 × 2 per
 * page) between Back (none on the first page) and ✕, the page, and the pill —
 * Continue, and Done on the last. Every number is the frame's canvas.
 */

const WEEK_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
/** The SOS drawings' own frame, as the task page draws the top task large (393 × 272 at 150). */
const BIG_VIEWBOX = '0 0 392 272';
/** The small drawings' frame (64 × 48 in a card row). */
const SMALL_VIEWBOX = '40 44 312 184';

/** A stack hung at a canvas top, centred or left. */
function Stack({ top, gap, center, children }: { top: number; gap: number; center?: boolean; children: ReactNode }) {
  return <View style={{ position: 'absolute', left: 24, right: 24, top, gap, alignItems: center ? 'center' : undefined }}>{children}</View>;
}

/** The week in seven 36-wide cells (gap 10): the day's letter 12/700 mute over a 34 disc — inked with a tick when the day held, an `#5A574F` ring when it did not. */
function DayRow({ days }: { days: DayStatus[] }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
      {days.map((d, i) => {
        const held = d === 'clean' || d === 'ridden';
        return (
          <View key={i} style={{ width: 36, alignItems: 'center', gap: 8 }}>
            <MonoText v="caps" style={{ fontSize: 12, lineHeight: lhNormal(12) }}>
              {WEEK_LETTERS[i]}
            </MonoText>
            <View
              style={[
                { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
                held ? { backgroundColor: mono.ink } : { boxShadow: `inset ${ring.outlineArt}` },
              ]}>
              {held ? <Check /> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

/** A card row: a 64 × 48 drawing at 10 (or none, the words at 18), the line 15/700/21 over its note 13/400/18 mute, and what the row ends on. */
function Row({ title, note, end, viz, first }: { title: string; note: string; end?: string; viz?: string | null; first: boolean }) {
  return (
    <View
      style={{
        minHeight: 68,
        paddingVertical: 10,
        paddingLeft: viz ? 10 : 18,
        paddingRight: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        borderRadius: 16,
        backgroundColor: mono.card,
      }}>
      {viz && SOS_VIZ[viz] ? (
        <View style={{ width: 64, height: 48 }}>
          <VizArt markup={SOS_VIZ[viz]} viewBox={SMALL_VIEWBOX} w={64} h={48} />
        </View>
      ) : null}
      <View style={{ flex: 1, gap: 3 }}>
        <MonoText v="rowLabel" wrap="pretty" style={{ lineHeight: 21 }}>
          {title}
        </MonoText>
        <MonoText v="p" wrap="pretty" color={mono.mute} style={{ fontSize: 13, lineHeight: 18 }}>
          {note}
        </MonoText>
      </View>
      {end ? (
        <MonoText v="rowValue" color={mono.mute}>
          {end}
        </MonoText>
      ) : null}
    </View>
  );
}

const Card = ({ children, radius = 20 }: { children: ReactNode; radius?: number }) => <View style={{ borderRadius: radius, backgroundColor: mono.card, overflow: 'hidden' }}>{children}</View>;
/** a list of rows, each its own box (D51) */
const Boxes = ({ children }: { children: ReactNode }) => <View style={{ gap: ROW_GAP }}>{children}</View>;

export function WeeklyStory({
  pages,
  page,
  onBack,
  onNext,
  onClose,
  onJournal,
}: {
  pages: StoryPage[];
  page: number;
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
  onJournal: () => void;
}) {
  const p = pages[page];
  const last = page === pages.length - 1;
  const cta = <PrimaryButton label={last ? 'Done' : 'Continue'} bottom={p.kind === 'journal' && p.count > 1 ? 96 : 48} onPress={last ? onClose : onNext} />;
  return (
    <Screen motionKey={page}>
      {p.kind === 'days' ? (
        <>
          <Hero id="sunrise" top={200} />
          <Stack top={440} gap={12} center>
            <MonoText v="title" center style={{ lineHeight: 37, alignSelf: 'stretch' }}>
              {p.title}
            </MonoText>
            <MonoText v="p" center style={{ alignSelf: 'stretch' }}>
              {p.line}
            </MonoText>
            <DayRow days={p.days} />
          </Stack>
        </>
      ) : null}

      {p.kind === 'urges' ? (
        <>
          {p.rows.length <= 3 ? <Hero id="lighthouse" top={492} /> : null}
          <Stack top={136} gap={8}>
            <MonoText v="h1">{p.title}</MonoText>
            <View style={{ height: 16 }} />
            <Boxes>
              {p.rows.map((r, i) => (
                <Row key={r.key} first={i === 0} title={r.when} note={r.note} end={r.end} />
              ))}
            </Boxes>
          </Stack>
        </>
      ) : null}

      {p.kind === 'helped' ? (
        <>
          {p.viz && SOS_VIZ[p.viz] ? (
            <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 150 }}>
              <VizArt markup={SOS_VIZ[p.viz]} viewBox={BIG_VIEWBOX} w={393} h={272} />
            </View>
          ) : null}
          <Stack top={430} gap={12} center>
            <MonoText v="title" center style={{ lineHeight: 37, alignSelf: 'stretch' }}>
              {p.title}
            </MonoText>
            <MonoText v="p" center style={{ alignSelf: 'stretch' }}>
              {p.line}
            </MonoText>
            {p.other ? (
              <View style={{ alignSelf: 'stretch', marginTop: 14 }}>
                <Row first title={p.other.title} note={p.other.note} viz={p.other.viz} />
              </View>
            ) : null}
          </Stack>
        </>
      ) : null}

      {p.kind === 'journal' ? (
        <>
          <Hero id="notebook" top={470} />
          <Stack top={136} gap={8}>
            <MonoText v="h1">From your journal.</MonoText>
            <MonoText v="pTight" color={mono.mute}>
              {p.line}
            </MonoText>
            <View style={{ height: 14 }} />
            <Card radius={24}>
              <View style={{ paddingTop: 24, paddingHorizontal: 24, paddingBottom: 22, gap: 18 }}>
                <View style={{ height: 27.3 }}>
                  <QuoteMark />
                </View>
                <MonoText v="h1" wrap="pretty" style={{ fontSize: 24, lineHeight: 33, letterSpacing: -0.4 }}>
                  {p.words}
                </MonoText>
                <MonoText v="caps">{p.label}</MonoText>
              </View>
            </Card>
          </Stack>
          {p.count > 1 ? <GhostLink label={`See all ${p.count} entries`} onPress={onJournal} /> : null}
        </>
      ) : null}

      {p.kind === 'next' ? (
        <>
          <Hero id="signpost" top={190} />
          <Stack top={452} gap={12} center>
            <MonoText v="title" center style={{ lineHeight: 37, alignSelf: 'stretch' }}>
              {p.title}
            </MonoText>
            <MonoText v="p" center style={{ alignSelf: 'stretch' }}>
              {p.line}
            </MonoText>
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 18, marginTop: 2 }}>
              {[
                [<CalendarGlyph key="c" />, p.week],
                [<TrendGlyph key="t" />, p.rating],
              ].map(([glyph, words]) => (
                <View key={words as string} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  {glyph}
                  <MonoText v="p" wrap="nowrap" color={mono.mute} style={{ fontSize: 14, lineHeight: 18 }}>
                    {words as string}
                  </MonoText>
                </View>
              ))}
            </View>
          </Stack>
        </>
      ) : null}

      {cta}
      <NavBar left={page === 0 ? 'empty' : 'back'} centre={{ bar: page + 1, of: pages.length }} right="close" onBack={onBack} onClose={onClose} />
    </Screen>
  );
}
