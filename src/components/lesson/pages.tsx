import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from 'react-native-svg';

import { LessonCover } from '@/components/lesson/cover';
import { LessonMark, markCaption, markFor } from '@/components/lesson/marks';
import { FeelingGlyph, HabitIcon, SignChipMark, SignScene, feelingFor, habitFor, signFor } from '@/components/lesson/scenes';
import { AppText, Laurel, PressScale } from '@/components/ui';
import { colors, fonts, sans } from '@/lib/theme';
import type { IAskPage, IBranchPage, ICollectPage, IGridPage, ILessonQuote, IPickPage, ITeachPage } from '@/lib/types';

/**
 * The curriculum's page kinds, in the latest UI's grammar (canvas: Lesson
 * Reader · Lesson Question · Lesson Pair · Lesson Self Check ×5 · Lesson
 * Feelings Grid · Lesson Your Signs).
 *
 * Each page owns its body only. The chrome, the progress dots and the CTA live
 * in the player, so every lesson keeps the same frame around it. The canvas
 * positions everything absolutely in its 393 × 852 frame; the offsets below are
 * that frame's own numbers, less the 54pt status bar and the 57pt chrome the
 * player draws above each page.
 */

/** Close row (44) + the gap the canvas leaves (6) + the progress dots (7). */
export const CHROME_H = 57;

/** What a page must keep clear at its foot so the pinned CTA never covers it. */
const CTA_CLEAR_WIDE = 128; // the 56pt-from-the-foot pill
const CTA_CLEAR = 102; // the 30pt-from-the-foot pill

const GRID_GUTTER = 24;
const GRID_GAP = 12;

/** Three tiles a row, whatever the device is. */
export function gridTileWidth(screenWidth: number): number {
  return Math.floor((screenWidth - GRID_GUTTER * 2 - GRID_GAP * 2) / 3);
}

// ── teach: one idea, centred ─────────────────────────────────────────

export function PageTeach({ page, seed = 0 }: { page: ITeachPage; seed?: number }) {
  const mark = markFor(seed);
  const caption = markCaption(mark);
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, paddingTop: 322 - 54 - CHROME_H, paddingBottom: CTA_CLEAR_WIDE }}>
      <Animated.View entering={FadeInUp.duration(280).easing(Easing.bezier(0.2, 0, 0, 1))} style={{ alignItems: 'center' }}>
        <AppText center style={[sans('500'), { paddingHorizontal: 30, fontSize: 24, lineHeight: 32, color: '#1D1C1A' }]}>
          {page.headline}
        </AppText>
        <AppText center style={[sans('400'), { marginTop: 22, paddingHorizontal: 44, fontSize: 16.5, lineHeight: 26, color: '#55534E' }]}>
          {page.body}
        </AppText>

        {page.list ? (
          <View style={{ marginTop: 20, paddingHorizontal: 44, alignSelf: 'stretch' }}>
            {page.list.items.map((item, index) => (
              <View key={item} style={{ flexDirection: 'row', marginTop: index ? 12 : 0 }}>
                <View style={{ width: 26 }}>
                  {page.list?.ordered ? (
                    <AppText style={[sans('600'), { fontSize: 16.5, lineHeight: 26, color: '#1D1C1A' }]}>
                      {index + 1}.
                    </AppText>
                  ) : (
                    <View style={{ width: 5, height: 5, borderRadius: 3, marginTop: 11, backgroundColor: colors.textSoft }} />
                  )}
                </View>
                <AppText style={[sans('400'), { flex: 1, fontSize: 16.5, lineHeight: 26, color: '#1D1C1A' }]}>{item}</AppText>
              </View>
            ))}
            {page.list.note ? (
              <AppText style={[sans('400'), { marginTop: 18, fontSize: 15.5, lineHeight: 25, color: colors.textSoft }]}>{page.list.note}</AppText>
            ) : null}
          </View>
        ) : null}

        {/* canvas: the three-line body ends at 454 and the wave starts at 462 */}
        <View style={{ marginTop: 8 }}>
          <LessonMark name={mark} />
        </View>
        {caption ? (
          <AppText center style={[sans('400'), { marginTop: 4, fontSize: 13.5, color: '#8B8882' }]}>{caption}</AppText>
        ) : null}
      </Animated.View>
    </ScrollView>
  );
}

// ── quote: the breath between two teach pages ────────────────────────

/**
 * A pull-quote, alone on the frame (canvas: Lesson Quote Lao Tzu · Seneca ·
 * Marcus). The canvas draws no Close, no progress and no pill on these three —
 * only a back chevron, which the player floats over the top — so the block is
 * centred in the whole 852, status bar included, and the page is advanced by
 * tapping it. That is the point of the page: one line, nothing to operate.
 *
 * The canvas's `gap: 26` and the quote's own `margin-top: -30` are both kept,
 * so the mark hangs 4pt into the line under it exactly as it does on the frame.
 */
export function PageQuote({ quote, onNext }: { quote: ILessonQuote; onNext: () => void }) {
  return (
    <Pressable
      onPress={onNext}
      accessibilityRole="button"
      accessibilityLabel={`${quote.text} — ${quote.who}. Continue`}
      style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
      <Animated.View
        entering={FadeIn.duration(420).easing(Easing.bezier(0.2, 0, 0, 1))}
        style={{ flex: 1, paddingHorizontal: 36, alignItems: 'center', justifyContent: 'center', gap: 26 }}>
        <AppText style={{ fontFamily: fonts.quote, fontSize: 56, lineHeight: 56, color: 'rgba(29,28,26,0.18)' }}>&ldquo;</AppText>
        <AppText
          center
          style={{ marginTop: -30, fontFamily: fonts.quote, fontSize: 23, lineHeight: 35, letterSpacing: -0.2, color: '#1D1C1A' }}>
          {quote.text}
        </AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 26, height: 1.5, backgroundColor: 'rgba(0,0,0,0.22)' }} />
          <AppText style={[sans('600'), { fontSize: 14, letterSpacing: 1.5, color: '#8B8882' }]}>{quote.who.toUpperCase()}</AppText>
          <View style={{ width: 26, height: 1.5, backgroundColor: 'rgba(0,0,0,0.22)' }} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ── ask: the self-check deck ─────────────────────────────────────────

/**
 * The signs are shown one at a time with a straight pair of answers, because
 * five warning signs presented as a checklist get skimmed and half-ticked. One
 * card, one honest yes or no, then the next; the last answer carries the reader
 * straight on, which is why this page draws no continue pill of its own.
 */
export function PageAsk({
  page,
  selected,
  onToggle,
  onDone,
}: {
  page: IAskPage;
  selected: string[];
  onToggle: (key: string) => void;
  onDone: () => void;
}) {
  const [step, setStep] = useState(0);
  const card = page.checks[Math.min(step, page.checks.length - 1)];

  const answer = (mine: boolean) => {
    if (card && mine !== selected.includes(card.key)) onToggle(card.key);
    if (step + 1 >= page.checks.length) onDone();
    else setStep((current: number) => current + 1);
  };

  const sign = card ? signFor(`${card.key} ${card.label} ${card.asIn}`) : null;

  return (
    <View style={{ flex: 1, paddingTop: 150 - 54 - CHROME_H }}>
      <AppText center style={[sans('500'), { paddingHorizontal: 40, fontSize: 22, lineHeight: 30, color: '#1D1C1A' }]}>
        {page.headline}
      </AppText>

      {card ? (
        <Animated.View
          key={card.key}
          entering={FadeInUp.duration(240).easing(Easing.bezier(0.2, 0, 0, 1))}
          style={{
            marginTop: 36,
            marginHorizontal: 24,
            borderRadius: 24,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.10)',
            paddingTop: 44,
            paddingHorizontal: 28,
            paddingBottom: 48,
            alignItems: 'center',
          }}>
          <View style={{ marginBottom: 30 }}>{sign ? <SignScene name={sign} /> : <FallbackSign seed={step} />}</View>
          <AppText center style={[sans('500'), { fontSize: 26, lineHeight: 32, color: '#1D1C1A' }]}>{card.label}</AppText>
          <AppText center style={[sans('400'), { marginTop: 16, fontSize: 14.5, lineHeight: 22, color: '#55534E' }]}>{card.asIn}</AppText>
        </Animated.View>
      ) : null}

      <View style={{ flex: 1 }} />
      <View style={{ marginHorizontal: 24, marginBottom: 38, flexDirection: 'row', gap: 12 }}>
        <DeckButton label="Not me" onPress={() => answer(false)} />
        <DeckButton label="That's me" dark onPress={() => answer(true)} />
      </View>
    </View>
  );
}

/** A sign the canvas never drew keeps the card's 190 × 152 art block with a line mark. */
function FallbackSign({ seed }: { seed: number }) {
  return (
    <View style={{ width: 190, height: 152, alignItems: 'center', justifyContent: 'center' }}>
      <LessonMark name={markFor(seed + 1)} height={96} />
    </View>
  );
}

/** One of the deck's two answers. */
function DeckButton({ label, dark, onPress }: { label: string; dark?: boolean; onPress: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      style={{
        flex: 1,
        height: 96,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        backgroundColor: dark ? '#131313' : '#FFFFFF',
        boxShadow: dark ? undefined : '0 0 0 1px rgba(0,0,0,0.10)',
      }}>
      <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
        <Circle cx={13} cy={13} r={11} stroke={dark ? '#F4F3F0' : '#1D1C1A'} strokeWidth={2.1} fill="none" />
        <Path
          d={dark ? 'M8 13.5l3.4 3.4L18 10' : 'M9 9l8 8M17 9l-8 8'}
          stroke={dark ? '#F4F3F0' : '#1D1C1A'}
          strokeWidth={2.1}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      <AppText style={[sans('600'), { fontSize: 15, color: dark ? '#F4F3F0' : '#1D1C1A' }]}>{label}</AppText>
    </PressScale>
  );
}

// ── grid: three-up tiles, multi-select ───────────────────────────────

export function PageGrid({
  page,
  tile,
  selected,
  onToggle,
}: {
  page: IGridPage;
  tile: number;
  selected: string[];
  onToggle: (option: string) => void;
}) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingTop: 154 - 54 - CHROME_H, paddingBottom: CTA_CLEAR }}>
      <AppText center style={[sans('500'), { paddingHorizontal: 40, fontSize: 22, lineHeight: 30, color: '#1D1C1A' }]}>{page.headline}</AppText>
      <AppText center style={[sans('400'), { marginTop: 36, fontSize: 14.5, color: '#55534E' }]}>{page.helper}</AppText>
      <View style={{ marginTop: 31, paddingHorizontal: GRID_GUTTER, flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP }}>
        {page.options.map((option) => {
          const on = selected.includes(option);
          return (
            <PressScale
              key={option}
              onPress={() => onToggle(option)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              style={{
                width: tile,
                height: 98,
                minHeight: 98,
                padding: 8,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 9,
                backgroundColor: on ? '#131313' : '#FFFFFF',
                boxShadow: on ? undefined : '0 0 0 1px rgba(0,0,0,0.10)',
              }}>
              <FeelingGlyph name={feelingFor(option)} on={on} />
              <AppText center style={[sans(on ? '600' : '500'), { fontSize: 14, lineHeight: 18, color: on ? '#F4F3F0' : '#1D1C1A' }]}>
                {option}
              </AppText>
            </PressScale>
          );
        })}
      </View>
    </ScrollView>
  );
}

// ── branch: the answer written for what you actually picked ──────────

/**
 * The most pages one branch is allowed to become. A reader who ticks every box
 * matches up to nine authored blocks, and nine screens of prose is a worse
 * answer than four. Check-matched blocks come first — they answer what the
 * reader said about themselves — and the grid blocks fill what's left.
 */
const MAX_BRANCH_BLOCKS = 4;

/** Copy blocks matched to the reader's selections. A `none` key in the
 * authored branches is the answer for having selected nothing. */
export function branchBlocks(
  page: IBranchPage,
  checks: string[],
  grid: string[],
): { headline?: string; body: string }[] {
  const blocks: { headline?: string; body: string }[] = [];
  const matchedChecks = page.fromChecks.filter((entry) => checks.includes(entry.key));
  if (matchedChecks.length) {
    for (const entry of matchedChecks) blocks.push({ headline: entry.headline, body: entry.body });
  } else {
    const fallback = page.fromChecks.find((entry) => entry.key === 'none');
    if (fallback) blocks.push({ headline: fallback.headline, body: fallback.body });
  }
  for (const entry of page.fromGrid) {
    if (entry.options.some((option) => grid.includes(option))) blocks.push({ body: entry.body });
  }
  return blocks.slice(0, MAX_BRANCH_BLOCKS);
}

/**
 * One matched block, alone on the page, in the reader's own metrics. The branch
 * is authored as a stack of answers — up to five of them — and stacking those
 * verbatim buried the reader in prose, so each gets its own screen with a
 * counter saying how far the answer runs.
 */
export function PageBranch({
  page,
  block,
  step,
  total,
  seed = 0,
}: {
  page: IBranchPage;
  block: { headline?: string; body: string };
  step: number;
  total: number;
  seed?: number;
}) {
  const mark = markFor(seed + step);
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, paddingTop: 288 - 54 - CHROME_H, paddingBottom: CTA_CLEAR_WIDE }}>
      <Animated.View key={step} entering={FadeInUp.duration(280).easing(Easing.bezier(0.2, 0, 0, 1))} style={{ alignItems: 'center' }}>
        <AppText center style={[sans('600'), { fontSize: 12.5, color: '#8B8882' }]}>
          {total > 1 ? `${page.title} · ${step + 1}/${total}` : page.title}
        </AppText>
        {block.headline ? (
          <AppText center style={[sans('500'), { marginTop: 18, paddingHorizontal: 30, fontSize: 24, lineHeight: 32, color: '#1D1C1A' }]}>
            {block.headline}
          </AppText>
        ) : null}
        <AppText center style={[sans('400'), { marginTop: 22, paddingHorizontal: 44, fontSize: 16.5, lineHeight: 26, color: '#55534E' }]}>
          {block.body}
        </AppText>
        <View style={{ marginTop: 8 }}>
          <LessonMark name={mark} />
        </View>
      </Animated.View>
    </ScrollView>
  );
}

// ── pick: the single-select ──────────────────────────────────────────

/**
 * A pick page whose options are all things the reader already does is drawn as
 * the pairing screen — an icon, the habit, one tick (canvas: Lesson Pair).
 * Anything else is the plain question (canvas: Lesson Question). The test is
 * the options themselves rather than the page's key, because "anchor" is used
 * for both a habit list and an ordinary one.
 */
export function isPairPage(page: IPickPage): boolean {
  return page.options.length > 0 && page.options.every((option) => habitFor(option) != null);
}

export function PagePick({
  page,
  value,
  onChange,
}: {
  page: IPickPage;
  value: string | null;
  onChange: (option: string) => void;
}) {
  if (isPairPage(page)) return <PagePair page={page} value={value} onChange={onChange} />;
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingTop: 156 - 54 - CHROME_H, paddingBottom: CTA_CLEAR }}>
      <View style={{ alignItems: 'center' }}>
        <LessonCover size={96} lifted={false} variant="water" />
      </View>
      <AppText center style={[sans('500'), { marginTop: 36, paddingHorizontal: 40, fontSize: 22, lineHeight: 30, color: '#1D1C1A' }]}>
        {page.headline}
      </AppText>
      <AppText center style={[sans('400'), { marginTop: 14, fontSize: 15, color: '#55534E' }]}>{page.helper}</AppText>
      <View style={{ marginTop: 34, marginHorizontal: 56, gap: 12 }}>
        {page.options.map((option) => {
          const on = value === option;
          return (
            <PressScale
              key={option}
              onPress={() => onChange(option)}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              style={{
                height: 52,
                // the canvas's answers are one short word; the authored ones run
                // to fifty characters, so the pill's round ends need clearing
                paddingHorizontal: 18,
                borderRadius: 26,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: on ? '#131313' : '#FFFFFF',
                boxShadow: on ? undefined : '0 0 0 1.5px rgba(0,0,0,0.14)',
              }}>
              <AppText center numberOfLines={2} style={[sans(on ? '600' : '500'), { fontSize: 16.5, color: on ? '#FFFFFF' : '#2A2924' }]}>
                {option}
              </AppText>
            </PressScale>
          );
        })}
      </View>
    </ScrollView>
  );
}

function PagePair({ page, value, onChange }: { page: IPickPage; value: string | null; onChange: (option: string) => void }) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingTop: 150 - 54 - CHROME_H, paddingBottom: CTA_CLEAR }}>
      <AppText center style={[sans('500'), { paddingHorizontal: 36, fontSize: 22, lineHeight: 30, color: '#1D1C1A' }]}>{page.headline}</AppText>
      <AppText center style={[sans('600'), { marginTop: 26, fontSize: 12.5, color: '#8B8882' }]}>While…</AppText>
      <View style={{ marginTop: 21, marginHorizontal: 24, gap: 12 }}>
        {page.options.map((option) => {
          const on = value === option;
          const icon = habitFor(option);
          return (
            <PressScale
              key={option}
              onPress={() => onChange(option)}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              style={{
                height: 60,
                borderRadius: 18,
                backgroundColor: '#FFFFFF',
                boxShadow: on ? '0 0 0 1.6px #131313' : '0 0 0 1px rgba(0,0,0,0.10)',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                paddingHorizontal: 18,
              }}>
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: on ? '#131313' : '#F1EFE9',
                }}>
                {icon ? <HabitIcon name={icon} on={on} /> : null}
              </View>
              <AppText numberOfLines={1} style={[sans(on ? '600' : '500'), { flex: 1, fontSize: 15, color: '#1D1C1A' }]}>{option}</AppText>
              {on ? <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#131313' }} /> : null}
            </PressScale>
          );
        })}
      </View>
    </ScrollView>
  );
}

// ── collect: the takeaway, in the reader's own selections ────────────

/** Fill {pick}, {checks} and {grid} from what the reader chose. */
export function fillTemplate(template: string, values: { pick?: string; checks?: string[]; grid?: string[] }): string {
  const list = (items?: string[]) => (items && items.length ? items.join(', ') : '');
  return template
    .replace(/\{pick\}/g, values.pick ?? '')
    .replace(/\{checks\}/g, list(values.checks))
    .replace(/\{grid\}/g, list(values.grid))
    .replace(/^"|"$/g, '');
}

export function PageCollect({
  page,
  sentence,
  chips,
}: {
  page: ICollectPage;
  sentence: string;
  chips: string[];
}) {
  return (
    <View style={{ flex: 1 }}>
      {/* the warm floor the canvas bleeds off the bottom of the frame */}
      <View style={{ position: 'absolute', left: '50%', bottom: -300, marginLeft: -280, width: 560, height: 560 }} pointerEvents="none">
        <Svg width={560} height={560} viewBox="0 0 560 560">
          <Defs>
            <RadialGradient id="signs-floor" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor="#FFECC4" stopOpacity={0.32} />
              <Stop offset="0.45" stopColor="#FFECC4" stopOpacity={0.14} />
              <Stop offset="0.72" stopColor="#FFECC4" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={280} cy={280} r={280} fill="url(#signs-floor)" />
        </Svg>
      </View>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 196 - 54 - CHROME_H, paddingBottom: CTA_CLEAR }}>
        <Animated.View entering={FadeInDown.duration(260)} style={{ alignItems: 'center', opacity: 0.85 }}>
          <Laurel size={44} color={colors.text} />
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(80).duration(280)}>
          <AppText center style={[sans('500'), { marginTop: 30, paddingHorizontal: 40, fontSize: 24, lineHeight: 31, color: '#1D1C1A' }]}>
            {page.title}
          </AppText>
          <AppText center style={[sans('400'), { marginTop: 29, paddingHorizontal: 52, fontSize: 16, lineHeight: 25, color: '#55534E' }]}>
            {sentence}
          </AppText>
          {chips.length ? (
            <View style={{ marginTop: 47, paddingHorizontal: 36, flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {chips.map((chip) => (
                <View
                  key={chip}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.10)',
                  }}>
                  <SignChipMark name={signFor(chip)} />
                  <AppText style={[sans('500'), { fontSize: 13.5, color: '#1D1C1A' }]}>{chip}</AppText>
                </View>
              ))}
            </View>
          ) : null}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
