/**
 * The shapes the functions hand out and take in, with their sensitive fields
 * sealed on the way into the database and opened on the way out — one place
 * per table, so no function can forget a field. See `crypto.ts`.
 *
 * Also the input checks every public mutation runs. The app never sends
 * anything outside these bounds; the checks exist so nobody else can either
 * (a public mutation is reachable by anyone holding a session token).
 */

import { ConvexError } from 'convex/values';

import type { Doc } from './_generated/dataModel';
import { open, openAnswers, openList, openOpt, seal, sealAnswers, sealList, sealOpt } from './crypto';

// ── input checks ─────────────────────────────────────────────────────

export const LIMITS = {
  shortText: 200,
  note: 4_000,
  journalBody: 20_000,
  journalTitle: 300,
  tag: 40,
  list: 50,
  listItem: 200,
  answers: 60,
  answer: 6_000,
  values: 24,
} as const;

function fail(message: string): never {
  throw new ConvexError(message);
}

export function checkText(value: string | undefined, max: number, name: string): void {
  if (value === undefined) return;
  if (value.length > max) fail(`${name} is too long (max ${max} characters)`);
}

export function checkList(values: string[] | undefined, name: string, maxItems: number = LIMITS.list, maxItem: number = LIMITS.listItem): void {
  if (values === undefined) return;
  if (values.length > maxItems) fail(`${name} has too many items (max ${maxItems})`);
  for (const v of values) checkText(v, maxItem, name);
}

export function checkRange(value: number | undefined, min: number, max: number, name: string, integer = false): void {
  if (value === undefined) return;
  if (!Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) fail(`${name} must be ${integer ? 'a whole number ' : ''}between ${min} and ${max}`);
}

/** A real calendar date, `YYYY-MM-DD`, within a sane window. */
export function checkDateKey(key: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) fail('date must be YYYY-MM-DD');
  const [y, m, d] = key.split('-').map(Number);
  const probe = new Date(Date.UTC(y, m - 1, d));
  if (probe.getUTCFullYear() !== y || probe.getUTCMonth() !== m - 1 || probe.getUTCDate() !== d) fail('date is not a real calendar date');
  if (y < 2020) fail('date is too far in the past');
  // tomorrow's action is filed the night before; allow a day and a half for time zones
  if (probe.getTime() > Date.now() + 2.5 * 86_400_000) fail('date is in the future');
}

/**
 * An event's moment. The slip flow lets someone say "yesterday" (and the wheel
 * reaches a week back), so the past is open to a week before the account; the
 * future only to clock skew.
 */
export function checkMoment(at: number | undefined, accountCreatedAt: number | undefined): void {
  if (at === undefined) return;
  if (!Number.isFinite(at)) fail('createdAt must be a timestamp');
  if (at > Date.now() + 10 * 60_000) fail('createdAt is in the future');
  const floor = (accountCreatedAt ?? Date.now()) - 8 * 86_400_000;
  if (at < floor) fail('createdAt is before the account');
}

// ── users ────────────────────────────────────────────────────────────

const userCtx = (userId: string, field: string) => ({ table: 'users', field, userId });

export async function sealDisplayName(userId: string, name: string | undefined): Promise<string | undefined> {
  return sealOpt(name, userCtx(userId, 'displayName'));
}

export async function openUser(doc: Doc<'users'>): Promise<Doc<'users'>> {
  return { ...doc, displayName: await openOpt(doc.displayName, userCtx(doc.clerkUserId, 'displayName')) };
}

// ── journal ──────────────────────────────────────────────────────────

const jCtx = (userId: string, field: string) => ({ table: 'journalEntries', field, userId });

export async function sealJournal(userId: string, entry: { title: string; body: string }) {
  return { title: await seal(entry.title, jCtx(userId, 'title')), body: await seal(entry.body, jCtx(userId, 'body')) };
}

export async function openJournal(doc: Doc<'journalEntries'>): Promise<Doc<'journalEntries'>> {
  return { ...doc, title: await open(doc.title, jCtx(doc.userId, 'title')), body: await open(doc.body, jCtx(doc.userId, 'body')) };
}

// ── events ───────────────────────────────────────────────────────────

const eCtx = (userId: string, field: string) => ({ table: 'events', field, userId });

type EventText = Pick<Doc<'events'>, 'trigger' | 'whatHelped' | 'lesson' | 'note' | 'precedingState'>;

export async function sealEventText(userId: string, e: EventText): Promise<EventText> {
  const ps = e.precedingState;
  return {
    trigger: await sealOpt(e.trigger, eCtx(userId, 'trigger')),
    whatHelped: await sealOpt(e.whatHelped, eCtx(userId, 'whatHelped')),
    lesson: await sealOpt(e.lesson, eCtx(userId, 'lesson')),
    note: await sealOpt(e.note, eCtx(userId, 'note')),
    precedingState: ps
      ? {
          ...ps,
          location: await sealOpt(ps.location, eCtx(userId, 'precedingState.location')),
          feeling: await sealOpt(ps.feeling, eCtx(userId, 'precedingState.feeling')),
          reasons: await sealList(ps.reasons, eCtx(userId, 'precedingState.reasons')),
        }
      : undefined,
  };
}

export async function openEvent(doc: Doc<'events'>): Promise<Doc<'events'>> {
  const u = doc.userId;
  const ps = doc.precedingState;
  return {
    ...doc,
    trigger: await openOpt(doc.trigger, eCtx(u, 'trigger')),
    whatHelped: await openOpt(doc.whatHelped, eCtx(u, 'whatHelped')),
    lesson: await openOpt(doc.lesson, eCtx(u, 'lesson')),
    note: await openOpt(doc.note, eCtx(u, 'note')),
    precedingState: ps
      ? {
          ...ps,
          location: await openOpt(ps.location, eCtx(u, 'precedingState.location')),
          feeling: await openOpt(ps.feeling, eCtx(u, 'precedingState.feeling')),
          reasons: await openList(ps.reasons, eCtx(u, 'precedingState.reasons')),
        }
      : undefined,
  };
}

// ── daily check-ins ──────────────────────────────────────────────────

const cCtx = (userId: string, field: string) => ({ table: 'dailyCheckins', field, userId });

type CheckinText = Partial<Pick<Doc<'dailyCheckins'>, 'note' | 'dailyAction' | 'emotions' | 'reasons'>>;

export async function sealCheckinText(userId: string, c: CheckinText): Promise<CheckinText> {
  const out: CheckinText = {};
  if (c.note !== undefined) out.note = await seal(c.note, cCtx(userId, 'note'));
  if (c.dailyAction !== undefined) out.dailyAction = await seal(c.dailyAction, cCtx(userId, 'dailyAction'));
  if (c.emotions !== undefined) out.emotions = await sealList(c.emotions, cCtx(userId, 'emotions'));
  if (c.reasons !== undefined) out.reasons = await sealList(c.reasons, cCtx(userId, 'reasons'));
  return out;
}

export async function openCheckin(doc: Doc<'dailyCheckins'>): Promise<Doc<'dailyCheckins'>> {
  const u = doc.userId;
  return {
    ...doc,
    note: await openOpt(doc.note, cCtx(u, 'note')),
    dailyAction: await openOpt(doc.dailyAction, cCtx(u, 'dailyAction')),
    emotions: await openList(doc.emotions, cCtx(u, 'emotions')),
    reasons: await openList(doc.reasons, cCtx(u, 'reasons')),
  };
}

// ── reflections ──────────────────────────────────────────────────────

const rCtx = (userId: string) => ({ table: 'reflections', field: 'answers', userId });

export async function sealReflection(userId: string, answers: Record<string, string | number>) {
  return sealAnswers(answers, rCtx(userId));
}

export async function openReflection(doc: Doc<'reflections'>): Promise<Doc<'reflections'>> {
  return { ...doc, answers: await openAnswers(doc.answers, rCtx(doc.userId)) };
}

// ── life map ─────────────────────────────────────────────────────────

const lCtx = (userId: string, field: string) => ({ table: 'lifeMap', field, userId });

export async function sealLifeMapText(userId: string, m: { whyStatement?: string; oneYearAnswer?: string; values?: { label: string; importance: number }[] }) {
  return {
    whyStatement: await sealOpt(m.whyStatement, lCtx(userId, 'whyStatement')),
    oneYearAnswer: await sealOpt(m.oneYearAnswer, lCtx(userId, 'oneYearAnswer')),
    values: m.values ? await Promise.all(m.values.map(async (v) => ({ ...v, label: await seal(v.label, lCtx(userId, 'values.label')) }))) : undefined,
  };
}

export async function openLifeMap(doc: Doc<'lifeMap'>): Promise<Doc<'lifeMap'>> {
  const u = doc.userId;
  return {
    ...doc,
    whyStatement: await openOpt(doc.whyStatement, lCtx(u, 'whyStatement')),
    oneYearAnswer: await openOpt(doc.oneYearAnswer, lCtx(u, 'oneYearAnswer')),
    values: await Promise.all(doc.values.map(async (v) => ({ ...v, label: await open(v.label, lCtx(u, 'values.label')) }))),
  };
}
