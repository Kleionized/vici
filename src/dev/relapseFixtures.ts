/**
 * The relapse frames' presets, copied from `Vici UI 2/project/Vici Relapse.dc.html`
 * (`build()`), by the id the canvas draws each under. The canvas files an
 * entry as `<frame id>-<n>`, and the message rules hash that id, so the
 * harness uses the same ids. Development builds only.
 */
import { assignMessage, dayISO, type RelapseCtx, type RelapseDraft, type RelapsePage, type SavedEntry, type SheetState } from '@/components/slip/relapse';
import { RELAPSE_MESSAGES } from '@/content/relapse.data';
import type { RelapseRecord, TidelineEvent } from '@/lib/types';

type EntryPreset = { when: string; cd?: number; ct?: number | null; causes?: string[]; watch?: string; skipped?: boolean };
type Preset = {
  clock?: string;
  page?: RelapsePage | 'log';
  draft?: Partial<RelapseDraft>;
  sheet?: SheetState;
  saving?: boolean;
  saveErr?: boolean;
  entry?: EntryPreset;
  editDraft?: Partial<RelapseDraft>;
  ctx?: Partial<RelapseCtx>;
  forced?: { msg: string; quote?: string | null };
  entries?: { when: string; dateOff: number; time: number | null; approx?: boolean; causes: string[] }[];
};

const done: EntryPreset = { when: 'now', causes: ['scroll', 'bored'] };

export const RELAPSE_PRESETS: Record<string, Preset> = {
  live: {},
  r01: { clock: '21:42' },
  r01b: { clock: '21:42', draft: { when: 'now' } },
  r01c: { clock: '21:42', sheet: { d: -2, on: true, t: 1335 } },
  r01c2: { clock: '21:42', sheet: { d: -9, on: false, t: 1260 } },
  r01d: { clock: '21:42', sheet: { d: 0, on: true, t: 1350 } },
  r01e: { clock: '21:42', draft: { when: 'custom', cd: -2, ct: 1335 } },
  r02: { clock: '21:42', page: 'led', draft: { when: 'now' } },
  r02b: { clock: '21:42', page: 'led', draft: { when: 'now', causes: ['scroll', 'bed', 'bored'] } },
  r02c: { clock: '21:42', page: 'led', draft: { when: 'now', causes: ['notsure'] } },
  r02d: { clock: '21:42', page: 'led', saving: true, draft: { when: 'now', causes: ['scroll', 'bored'] } },
  r02e: { clock: '21:42', page: 'led', saveErr: true, draft: { when: 'now', causes: ['scroll', 'bored'] } },
  r02f: { clock: '21:42', page: 'led', entry: done, editDraft: { causes: ['scroll', 'bored', 'alone'] } },
  r03: { clock: '21:42', page: 'watch', entry: done },
  r03b: { clock: '21:42', page: 'watch', entry: done, editDraft: { watch: 'unsure' } },
  r04: { clock: '15:10', ctx: { goal: 'awake' }, page: 'enc', entry: { ...done, watch: 'yes' } },
  r04b: { clock: '10:20', page: 'enc', entry: { when: 'yesterday', causes: ['cantsleep'], watch: 'no' } },
  r04c: { clock: '23:40', ctx: { goal: 'sleep' }, page: 'enc', entry: { ...done, watch: 'no' }, forced: { msg: 'E041', quote: 'Q04' } },
  r05: {
    clock: '21:42',
    page: 'log',
    entries: [
      { when: 'yesterday', dateOff: -1, time: null, causes: ['cantsleep', 'bed'] },
      { when: 'now', dateOff: 0, time: 1302, approx: true, causes: ['scroll', 'bored'] },
    ],
  },
  r01f: { clock: '21:42', draft: { when: 'today' } },
  r02g: { clock: '21:42', page: 'led', draft: { when: 'now', causes: ['scroll'] } },
  r04d: { clock: '21:42', page: 'enc', entry: { ...done, watch: 'yes' }, forced: { msg: 'E034', quote: null } },
  r04e: { clock: '21:42', page: 'enc', entry: { ...done, watch: 'no' }, forced: { msg: 'E012', quote: null } },
};

const ctxFor = (m: (typeof RELAPSE_MESSAGES)[number]): Partial<RelapseCtx> => {
  const r = m[2];
  const c: Partial<RelapseCtx> = {};
  if (r.includes('not_trying_to_sleep')) c.goal = 'awake';
  if (r.includes('current_sleep_goal')) c.goal = 'sleep';
  if (r.includes('known_prior_course_or_task_practice')) c.practice = true;
  if (r.includes('prior_attempt_self_reported')) c.attempts = true;
  return c;
};
const entryFor = (m: (typeof RELAPSE_MESSAGES)[number]): EntryPreset => {
  const r = m[2];
  return { when: r.includes('event_on_an_earlier_local_date') ? 'yesterday' : 'now', causes: ['scroll'], watch: r.includes('current_watch_again_no') ? 'no' : r.includes('current_watch_again_yes_or_not_sure') ? 'yes' : 'no' };
};
const clockFor = (m: (typeof RELAPSE_MESSAGES)[number]) => (m[2].includes('current_evening') ? '19:30' : m[1] === 'sleep' ? '23:40' : m[1] === 'time remaining' ? '15:10' : '21:42');
for (const m of RELAPSE_MESSAGES) RELAPSE_PRESETS[`m${m[0]}`] = { clock: clockFor(m), ctx: ctxFor(m), page: 'enc', entry: entryFor(m), forced: { msg: m[0], quote: null } };
for (const [q, e] of [['Q01', 'E025'], ['Q02', 'E002'], ['Q03', 'E009'], ['Q04', 'E041']] as const) {
  const m = RELAPSE_MESSAGES.find((x) => x[0] === e)!;
  RELAPSE_PRESETS[`q${q}`] = { clock: q === 'Q04' ? '23:40' : clockFor(m), ctx: ctxFor(m), page: 'enc', entry: { ...entryFor(m), ...(q === 'Q03' ? { causes: ['notsure'] } : {}) }, forced: { msg: e, quote: q } };
}

/** The renders' clock: 2026-10-21, at the frame's own time (09:41 when it names none). */
export function relapseNow(p: Preset): number {
  const [h, m] = (p.clock ?? '09:41').split(':').map(Number);
  return new Date(2026, 9, 21, h, m, 0).getTime();
}

/** A preset as the flow's starting state, with the entry it was saved as (`<id>-1`). */
export function relapseInitial(id: string, p: Preset) {
  const now = relapseNow(p);
  const ctx: RelapseCtx = { hour: new Date(now).getHours(), goal: 'unknown', practice: false, attempts: false, ...p.ctx };
  let saved: SavedEntry | null = null;
  let draft: Partial<RelapseDraft> = { ...p.draft };
  if (p.entry) {
    const e = p.entry;
    const nm = new Date(now).getHours() * 60 + new Date(now).getMinutes();
    const date = e.when === 'now' || e.when === 'today' ? dayISO(now) : e.when === 'yesterday' ? dayISO(now, -1) : e.when === 'custom' ? dayISO(now, e.cd ?? 0) : undefined;
    const time = e.when === 'now' ? nm : e.when === 'custom' ? (e.ct ?? undefined) : undefined;
    let record: RelapseRecord = { when: e.when, date, time, approx: e.when === 'now', causes: [...(e.causes ?? [])].sort(), skipped: Boolean(e.skipped), watch: e.watch };
    if (p.page === 'enc') record = assignMessage(`${id}-1`, record, ctx, now, { hist: [], qSeen: [] }, p.forced).record;
    saved = { id: `${id}-1`, record, createdAt: now };
    draft = { when: e.when, cd: e.cd ?? 0, ct: e.ct ?? null, causes: [...(e.causes ?? [])], watch: e.watch ?? null, ...p.editDraft };
  }
  return { now, ctx, initial: { page: p.page === 'log' ? undefined : p.page, draft, sheet: p.sheet ?? null, saved, saving: p.saving, saveErr: p.saveErr } };
}

/** `05 · Back in the app`'s two entries, as lapse events. */
export function relapseLogEntries(p: Preset): TidelineEvent[] {
  const now = relapseNow(p);
  return (p.entries ?? []).map((e, i) => {
    const date = dayISO(now, e.dateOff);
    const record: RelapseRecord = { when: e.when, date, time: e.time ?? undefined, approx: Boolean(e.approx), causes: e.causes, skipped: false };
    return { _id: `r05-${i + 1}`, userId: 'harness', type: 'lapse' as const, createdAt: now - (2 - i) * 1000, relapse: record };
  }).sort((a, b) => b.createdAt - a.createdAt);
}
