/**
 * The weekly report as `Vici UI 2` tells it (91C … 91C6): up to five short
 * pages — the week's days, its urges, what helped, a line from the journal,
 * and what comes next — each read off the log. A page with nothing to say is
 * left out, and Report Ready counts the pages that are left.
 *
 * Every sentence is one the frames write, with the week's own numbers and
 * names in it (D43). Where the frames show one case of a sentence that has
 * others ("You rode out all three."), the other cases keep the frame's words
 * and change only what the numbers change; a clause the frames give for one
 * case only ("Both times the urge dropped from 4 to 2.") is said in that case
 * and left out otherwise.
 */
import { CURRICULUM_84 } from '@/content/curriculum84';
import { SOS_ACTIONS } from '@/content/sosLibrary.data';
import { INTENSITY_BANDS } from '@/components/ui/IntensityBands';
import { addDays, courseWeekForDay, isSlip, isSurfed, keyToDate, programmeDay, shiftKey, type ProgrammeStart } from '@/lib/day';
import { clockTime, numberWords, splitStored } from '@/lib/format';
import type { JournalEntry, TidelineEvent } from '@/lib/types';
import { completedWeekStarts, dayStatuses, weekLabel, type DayStatus } from '@/lib/weeklyReport';

export type StoryPage =
  | { kind: 'days'; title: string; line: string; days: DayStatus[] }
  | { kind: 'urges'; title: string; rows: { key: string; when: string; note: string; end: string }[] }
  | { kind: 'helped'; title: string; line: string; viz: string | null; other: { title: string; note: string; viz: string | null } | null }
  | { kind: 'journal'; line: string; words: string; label: string; count: number }
  | { kind: 'next'; title: string; line: string; week: string; rating: string };

const WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TASK_VIZ: Record<string, string> = Object.fromEntries(SOS_ACTIONS.map((a) => [a.title, a.viz]));
/** The journal tags a week's line can come from, the night's own first. */
const JOURNAL_ORDER = ['Proud of', 'Reflection', 'Goal'];

const Words = (n: number) => numberWords(n, { capital: true });
const words = (n: number) => numberWords(n);
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const times = (n: number) => (n === 1 ? 'once' : n === 2 ? 'twice' : `${words(n)} times`);
/** The urge's strength on the 1–5 scale the cards print. */
const scale = (severity: number) => Math.max(1, Math.min(5, Math.round((severity - 2) / 2) + 1));
const cleanDay = (s: DayStatus) => s === 'clean' || s === 'ridden';

export type StoryInput = {
  weekStart: string;
  events: readonly TidelineEvent[];
  journal: readonly JournalEntry[];
  start: ProgrammeStart;
  /** the recovery rating as the week closed, and its move over the week */
  rating: { value: number; delta: number };
  now?: number;
};

export function weeklyStory({ weekStart, events, journal, start, rating, now = Date.now() }: StoryInput): StoryPage[] {
  const from = keyToDate(weekStart).getTime();
  const to = addDays(keyToDate(weekStart), 7).getTime();
  const inWeek = (ms: number) => ms >= from && ms < to;
  const pages: StoryPage[] = [];
  const label = weekLabel(weekStart);

  // 91C · the days
  const days = dayStatuses(weekStart, [...events], start, now);
  const lived = days.filter((d) => d !== 'none').length;
  const clean = days.filter(cleanDay).length;
  const slips = events.filter((e) => isSlip(e) && inWeek(e.createdAt)).sort((a, b) => a.createdAt - b.createdAt);
  let line = `${label}.`;
  if (!slips.length && lived === 7) {
    const earlier = completedWeekStarts(start, now).filter((w) => w < weekStart);
    const first = !earlier.some((w) => {
      const d = dayStatuses(w, [...events], start, now);
      return d.every((s) => s !== 'none') && d.every(cleanDay);
    });
    if (first) line += ' Your first full week without a slip.';
  } else if (slips.length === 1) {
    const at = new Date(slips[0].createdAt);
    line += ` One slip, ${WEEKDAY[at.getDay()]} at ${clockTime(at, { lower: true })}.`;
    const when = slips[0].relapse?.when;
    if (when === 'now' || when === 'today') line += ' You logged it the same night.';
  } else if (slips.length > 1) {
    line += ` ${Words(slips.length)} slips.`;
  }
  if (lived) pages.push({ kind: 'days', title: `${clean ? Words(clean) : 'No'} clean ${clean === 1 ? 'day' : 'days'}.`, line, days });

  // 91C2 · the urges, in the order they came
  const urges = events.filter((e) => (e.type === 'urge_rode_out' || e.type === 'urge_acted_on') && inWeek(e.createdAt)).sort((a, b) => a.createdAt - b.createdAt);
  if (urges.length) {
    const ridden = urges.filter(isSurfed).length;
    const n = urges.length;
    const rode = ridden === n ? (n === 1 ? ' You rode it out.' : ` You rode out all ${words(n)}.`) : ridden ? ` You rode out ${words(ridden)}.` : '';
    pages.push({
      kind: 'urges',
      title: `${Words(n)} ${n === 1 ? 'urge' : 'urges'}.${rode}`,
      rows: urges.map((e) => {
        const at = new Date(e.createdAt);
        const fed = e.trigger ? splitStored(e.trigger).map(lowerFirst) : [];
        const place = e.precedingState?.location ? [lowerFirst(e.precedingState.location)] : [];
        const strength = e.severity != null ? INTENSITY_BANDS[scale(e.severity) - 1].label : null;
        const what = [...fed, ...place].join(', ');
        return { key: e._id, when: `${WEEKDAY_SHORT[at.getDay()]}, ${clockTime(at, { lower: true })}`, note: [strength, what].filter(Boolean).join(' · '), end: isSlip(e) ? 'Slipped' : 'Rode it out' };
      }),
    });
  }

  // 91C3 · what helped: the SOS tasks done this week, most used first
  const tasks = new Map<string, TidelineEvent[]>();
  for (const e of urges) if (e.whatHelped && TASK_VIZ[e.whatHelped]) tasks.set(e.whatHelped, [...(tasks.get(e.whatHelped) ?? []), e]);
  const ranked = [...tasks.entries()].sort((a, b) => b[1].length - a[1].length);
  if (ranked.length) {
    const [top, uses] = ranked[0];
    const moves = uses.filter((e) => e.severity != null && e.severityAfter != null).map((e) => [scale(e.severity as number), scale(e.severityAfter as number)] as const);
    let helpedLine = `You used it ${times(uses.length)}.`;
    if (uses.length === 2 && moves.length === 2 && moves[0][0] === moves[1][0] && moves[0][1] === moves[1][1] && moves[0][1] < moves[0][0]) {
      helpedLine += ` Both times the urge dropped from ${moves[0][0]} to ${moves[0][1]}.`;
    }
    const second = ranked[1];
    let other: { title: string; note: string; viz: string | null } | null = null;
    if (second) {
      const m = second[1].filter((e) => e.severity != null && e.severityAfter != null);
      const move = m.length ? ` · ${Math.round(m.reduce((a, e) => a + scale(e.severity as number), 0) / m.length)} → ${Math.round(m.reduce((a, e) => a + scale(e.severityAfter as number), 0) / m.length)}` : '';
      other = { title: second[0], note: `Used ${times(second[1].length)}${move}`, viz: TASK_VIZ[second[0]] ?? null };
    }
    pages.push({ kind: 'helped', title: `${top} helped most.`, line: helpedLine, viz: TASK_VIZ[top] ?? null, other });
  }

  // 91C4 · a line from the journal: what he was proud of, else the night's reflection, else a goal
  const kept = journal.filter((j) => inWeek(j.createdAt) && JOURNAL_ORDER.includes(j.tag) && (j.body?.trim() || j.title?.trim()));
  const pick = JOURNAL_ORDER.map((tag) => kept.filter((j) => j.tag === tag).sort((a, b) => b.createdAt - a.createdAt)[0]).find(Boolean);
  if (pick) {
    const day = WEEKDAY[new Date(pick.createdAt).getDay()];
    const night = pick.tag === 'Proud of' || pick.tag === 'Reflection';
    pages.push({ kind: 'journal', line: night ? `${day} night, after the check-in.` : `${day}.`, words: (pick.body?.trim() || pick.title?.trim()) as string, label: `${pick.tag} · ${day}`, count: kept.length });
  }

  // 91C5 · what comes next: the course week that opens on the Monday after
  const nextDay = programmeDay(start, keyToDate(shiftKey(weekStart, 7)));
  const nextWeek = courseWeekForDay(nextDay);
  const course = CURRICULUM_84[nextWeek - 1];
  const thisWeek = courseWeekForDay(programmeDay(start, keyToDate(weekStart)));
  if (course && nextWeek > thisWeek) {
    const move = rating.delta ? `, ${rating.delta > 0 ? 'up' : 'down'} ${Math.abs(rating.delta)}` : '';
    pages.push({ kind: 'next', title: `Next up: ${course.name}.`, line: `Week ${nextWeek} of the course opens on Monday.`, week: `Week ${nextWeek} of 12`, rating: `Rating ${rating.value}${move}` });
  }
  return pages;
}

/** Report Ready's line: the week, and how many pages it has. */
export const pagesLine = (weekStart: string, pages: number) => `${weekLabel(weekStart)}. ${Words(pages)} short ${pages === 1 ? 'page' : 'pages'}.`;
