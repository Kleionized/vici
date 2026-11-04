/// <reference types="vite/client" />
import { convexTest } from 'convex-test';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { api, internal } from './_generated/api';
import schema from './schema';

const modules = import.meta.glob('./**/*.ts');

// 32 bytes, base64 — a test key, never used anywhere else
const TEST_KEY = 'q83vEjRWeJCrze8SNFZ4kKvN7xI0VniQq83vEjRWeJA=';

const asUser = (t: ReturnType<typeof convexTest>, subject: string) => t.withIdentity({ subject, tokenIdentifier: `test|${subject}`, issuer: 'test' });

beforeEach(() => {
  process.env.DATA_ENCRYPTION_KEY = TEST_KEY;
});
afterEach(() => {
  delete process.env.DATA_ENCRYPTION_KEY;
  delete process.env.DATA_ENCRYPTION_KEY_PREVIOUS;
});

describe('auth', () => {
  test('mutations reject an anonymous caller; queries soft-fail', async () => {
    const t = convexTest(schema, modules);
    await expect(t.mutation(api.journal.create, { tag: 'Reflection', title: 't', body: 'b' })).rejects.toThrow(/Not authenticated/);
    expect(await t.query(api.journal.list, {})).toEqual([]);
    expect(await t.query(api.users.getCurrentUser, {})).toBeNull();
  });

  test('one user cannot read, edit or delete another user’s rows', async () => {
    const t = convexTest(schema, modules);
    const alice = asUser(t, 'alice');
    const bob = asUser(t, 'bob');
    await alice.mutation(api.users.ensureUser, {});
    await bob.mutation(api.users.ensureUser, {});
    const entry = await alice.mutation(api.journal.create, { tag: 'Reflection', title: 'mine', body: 'private' });
    expect(entry?.body).toBe('private');
    expect(await bob.query(api.journal.list, {})).toEqual([]);
    await bob.mutation(api.journal.update, { id: entry!._id, tag: 'x', title: 'pwned', body: 'pwned' });
    await bob.mutation(api.journal.remove, { id: entry!._id });
    const [still] = await alice.query(api.journal.list, {});
    expect(still.title).toBe('mine');
  });
});

describe('encryption at rest', () => {
  test('sensitive fields are sealed in the database and opened for their owner', async () => {
    const t = convexTest(schema, modules);
    const alice = asUser(t, 'alice');
    await alice.mutation(api.users.ensureUser, { displayName: 'Alice' });
    await alice.mutation(api.journal.create, { tag: 'Pledge', title: 'Day 1 pledge', body: 'The mornings are mine again.' });
    await alice.mutation(api.events.create, { type: 'lapse', trigger: 'Tired · Phone in bed', note: 'late', precedingState: { feeling: 'Lonely', reasons: ['Being alone'], location: 'In bed' } });
    await alice.mutation(api.checkins.upsert, { date: '2026-11-03', mood: 3, dailyAction: 'Walk', emotions: ['Calm'] });
    await alice.mutation(api.reflections.save, { slug: 'day-01', answers: { why: 'my kids', rating: 4 } });
    await alice.mutation(api.lifemap.update, { whyStatement: 'Stop completely.', values: [{ label: 'Focus', importance: 3 }] });

    const raw = await t.run(async (ctx) => ({
      user: await ctx.db.query('users').first(),
      journal: await ctx.db.query('journalEntries').first(),
      event: await ctx.db.query('events').first(),
      checkin: await ctx.db.query('dailyCheckins').first(),
      reflection: await ctx.db.query('reflections').first(),
      lifeMap: await ctx.db.query('lifeMap').first(),
    }));
    const sealed = /^enc:v1:/;
    expect(raw.user?.displayName).toMatch(sealed);
    expect(raw.journal?.body).toMatch(sealed);
    expect(raw.journal?.title).toMatch(sealed);
    expect(raw.journal?.tag).toBe('Pledge'); // categories stay readable for queries
    expect(raw.event?.trigger).toMatch(sealed);
    expect(raw.event?.precedingState?.feeling).toMatch(sealed);
    expect(raw.event?.precedingState?.reasons?.[0]).toMatch(sealed);
    expect(raw.checkin?.dailyAction).toMatch(sealed);
    expect(raw.checkin?.emotions?.[0]).toMatch(sealed);
    expect(raw.checkin?.mood).toBe(3);
    expect(raw.reflection?.answers.why).toMatch(sealed);
    expect(raw.reflection?.answers.rating).toBe(4);
    expect(raw.lifeMap?.whyStatement).toMatch(sealed);
    expect(raw.lifeMap?.values[0].label).toMatch(sealed);
    expect(JSON.stringify(raw)).not.toContain('mornings');

    expect((await alice.query(api.users.getCurrentUser, {}))?.displayName).toBe('Alice');
    expect((await alice.query(api.journal.list, {}))[0].body).toBe('The mornings are mine again.');
    const [ev] = await alice.query(api.events.list, {});
    expect(ev.trigger).toBe('Tired · Phone in bed');
    expect(ev.precedingState).toMatchObject({ feeling: 'Lonely', reasons: ['Being alone'], location: 'In bed' });
    expect((await alice.query(api.checkins.getForDate, { date: '2026-11-03' }))?.dailyAction).toBe('Walk');
    expect((await alice.query(api.reflections.getForLesson, { slug: 'day-01' }))?.answers).toEqual({ why: 'my kids', rating: 4 });
    expect((await alice.query(api.lifemap.get, {}))?.values[0].label).toBe('Focus');
  });

  test('the same words sealed twice look different', async () => {
    const t = convexTest(schema, modules);
    const alice = asUser(t, 'alice');
    await alice.mutation(api.journal.create, { tag: 'Reflection', title: 'same', body: 'same' });
    await alice.mutation(api.journal.create, { tag: 'Reflection', title: 'same', body: 'same' });
    const rows = await t.run((ctx) => ctx.db.query('journalEntries').collect());
    expect(rows[0].body).not.toBe(rows[1].body);
  });

  test('a ciphertext moved onto another user’s row does not open', async () => {
    const t = convexTest(schema, modules);
    const alice = asUser(t, 'alice');
    const bob = asUser(t, 'bob');
    await alice.mutation(api.journal.create, { tag: 'Reflection', title: 'a', body: 'alice secret' });
    await bob.mutation(api.journal.create, { tag: 'Reflection', title: 'b', body: 'bob' });
    await t.run(async (ctx) => {
      const rows = await ctx.db.query('journalEntries').collect();
      const a = rows.find((r) => r.userId === 'alice')!;
      const b = rows.find((r) => r.userId === 'bob')!;
      await ctx.db.patch(b._id, { body: a.body });
    });
    expect((await bob.query(api.journal.list, {}))[0].body).toBe('');
  });

  test('legacy plaintext still reads, and the migration seals it', async () => {
    const t = convexTest(schema, modules);
    const alice = asUser(t, 'alice');
    await t.run((ctx) => ctx.db.insert('journalEntries', { userId: 'alice', createdAt: 1, updatedAt: 1, tag: 'Reflection', title: 'old', body: 'written before the key' }));
    expect((await alice.query(api.journal.list, {}))[0].body).toBe('written before the key');
    await t.mutation(internal.migrations.encryptExisting, { table: 'journalEntries', cursor: null });
    const raw = await t.run((ctx) => ctx.db.query('journalEntries').first());
    expect(raw?.body).toMatch(/^enc:v1:/);
    expect((await alice.query(api.journal.list, {}))[0].body).toBe('written before the key');
  });

  test('a rotated key still opens what the previous key sealed', async () => {
    const t = convexTest(schema, modules);
    const alice = asUser(t, 'alice');
    await alice.mutation(api.journal.create, { tag: 'Reflection', title: 't', body: 'before rotation' });
    process.env.DATA_ENCRYPTION_KEY_PREVIOUS = TEST_KEY;
    process.env.DATA_ENCRYPTION_KEY = 'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8=';
    expect((await alice.query(api.journal.list, {}))[0].body).toBe('before rotation');
  });

  test('with no key configured, values are stored as written', async () => {
    delete process.env.DATA_ENCRYPTION_KEY;
    const t = convexTest(schema, modules);
    const alice = asUser(t, 'alice');
    await alice.mutation(api.journal.create, { tag: 'Reflection', title: 't', body: 'plain' });
    const raw = await t.run((ctx) => ctx.db.query('journalEntries').first());
    expect(raw?.body).toBe('plain');
  });
});

describe('validation', () => {
  test('rejects out-of-range and malformed input', async () => {
    const t = convexTest(schema, modules);
    const alice = asUser(t, 'alice');
    await alice.mutation(api.users.ensureUser, {});
    await expect(alice.mutation(api.checkins.upsert, { date: '2026-13-40', mood: 3 })).rejects.toThrow(/date/);
    await expect(alice.mutation(api.checkins.upsert, { date: '2026-11-03', mood: 9 })).rejects.toThrow(/mood/);
    await expect(alice.mutation(api.events.create, { type: 'urge_rode_out', severity: 42 })).rejects.toThrow(/severity/);
    await expect(alice.mutation(api.events.create, { type: 'lapse', createdAt: Date.now() + 86_400_000 })).rejects.toThrow(/future/);
    await expect(alice.mutation(api.journal.create, { tag: 'x', title: 't', body: 'x'.repeat(20_001) })).rejects.toThrow(/too long/);
    await expect(alice.mutation(api.lessons.completeLesson, { slug: 'day-01', fitsMeRating: 0 })).rejects.toThrow(/fitsMeRating/);
  });

  test('a check-in upsert merges instead of erasing', async () => {
    const t = convexTest(schema, modules);
    const alice = asUser(t, 'alice');
    await alice.mutation(api.checkins.upsert, { date: '2026-11-03', mood: 2, energy: 4 });
    await alice.mutation(api.checkins.upsert, { date: '2026-11-03', dailyActionDone: true });
    expect(await alice.query(api.checkins.getForDate, { date: '2026-11-03' })).toMatchObject({ mood: 2, energy: 4, dailyActionDone: true });
  });

  test('completing a lesson again keeps the first completion date', async () => {
    const t = convexTest(schema, modules);
    const alice = asUser(t, 'alice');
    await alice.mutation(api.lessons.completeLesson, { slug: 'day-01' });
    const [first] = await alice.query(api.lessons.progress, {});
    await new Promise((r) => setTimeout(r, 5));
    await alice.mutation(api.lessons.completeLesson, { slug: 'day-01', fitsMeRating: 4 });
    const [again] = await alice.query(api.lessons.progress, {});
    expect(again.completedAt).toBe(first.completedAt);
    expect(again.fitsMeRating).toBe(4);
  });
});

describe('deleting an account', () => {
  test('erases every row the account owns, and nobody else’s', async () => {
    const t = convexTest(schema, modules);
    const alice = asUser(t, 'alice');
    const bob = asUser(t, 'bob');
    await alice.mutation(api.users.ensureUser, {});
    await bob.mutation(api.users.ensureUser, {});
    for (let i = 0; i < 5; i++) await alice.mutation(api.events.create, { type: 'urge_rode_out', severity: 5 });
    await alice.mutation(api.journal.create, { tag: 'Reflection', title: 't', body: 'b' });
    await alice.mutation(api.checkins.upsert, { date: '2026-11-03', mood: 3 });
    await bob.mutation(api.journal.create, { tag: 'Reflection', title: 'bob', body: 'keeps' });

    await alice.mutation(api.users.deleteAccount, {});
    await t.finishAllScheduledFunctions(() => {});

    const left = await t.run(async (ctx) => ({
      users: (await ctx.db.query('users').collect()).map((u) => u.clerkUserId),
      events: (await ctx.db.query('events').collect()).length,
      journal: (await ctx.db.query('journalEntries').collect()).map((j) => j.userId),
      checkins: (await ctx.db.query('dailyCheckins').collect()).length,
    }));
    expect(left).toEqual({ users: ['bob'], events: 0, journal: ['bob'], checkins: 0 });
  });
});

describe('admin functions', () => {
  test('lesson import, seeding, migration and the delete job are not part of the public API', async () => {
    const fns = [
      (await import('./importLessons')).importLessons,
      (await import('./seed')).seedLessons,
      (await import('./migrations')).encryptExisting,
      (await import('./users')).continueDelete,
    ] as unknown as { isInternal?: boolean; isPublic?: boolean }[];
    for (const fn of fns) {
      expect(fn.isInternal).toBe(true);
      expect(fn.isPublic).toBeFalsy();
    }
  });
});
