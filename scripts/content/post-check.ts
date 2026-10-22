// What `check-post.mjs` runs: the owner's notes and letters, and the rules that
// choose them (src/lib/viciPost.ts), against the two documents' "send when"
// notes. Each `ok` is one rule; a failure names it.
import { RELAPSE_CAUSES } from '@/content/relapse.data';
import { LETTER_BY_ID, MILESTONE_LETTERS, RELAPSE_LETTERS } from '@/content/viciLetters';
import { MORNING_NOTES, RELAPSE_NOTES } from '@/content/morningNotes';
import type { TidelineEvent } from '@/lib/types';
import { dueMilestone, fillName, letterText, morningNoteFor, morningNoteForDay, relapseLetterFor } from '@/lib/viciPost';

let failed = 0;
const ok = (rule: string, pass: boolean, detail = '') => {
  if (!pass) failed++;
  console.log(`${pass ? 'ok  ' : 'FAIL'} ${rule}${pass || !detail ? '' : ` — ${detail}`}`);
};

// ── the content, as the documents give it
ok('84 morning notes, one per day', MORNING_NOTES.length === 84);
ok('25 notes for the morning after a slip', RELAPSE_NOTES.length === 25);
ok('the tired, stress and repeated notes are marked for their situation only', ['tired', 'stress', 'repeated'].every((w) => RELAPSE_NOTES.filter((n) => n.when === w).length === 1));
const VICI_LETTERS = [...MILESTONE_LETTERS, ...RELAPSE_LETTERS];
const ids = VICI_LETTERS.map((l) => l.id);
const want = [...Array.from({ length: 25 }, (_, i) => `M${String(i + 1).padStart(2, '0')}`), ...Array.from({ length: 25 }, (_, i) => `R${String(i + 1).padStart(2, '0')}`)];
ok('50 letters, M01–M25 and R01–R25', ids.length === 50 && want.every((id) => ids.includes(id)));
ok('every letter has a subject, a greeting and a body', VICI_LETTERS.every((l) => l.subject && l.greeting && l.paragraphs.length > 0));

// ── the name, filled in or left out cleanly
const texts = [...MORNING_NOTES, ...RELAPSE_NOTES.map((n) => n.text), ...VICI_LETTERS.flatMap((l) => l.paragraphs)];
const withName = texts.map((t) => fillName(t, 'Sam'));
const without = texts.map((t) => fillName(t, ''));
ok('no placeholder left with a name', withName.every((t) => !t.includes('[user name]')));
ok('no placeholder left without a name', without.every((t) => !t.includes('[user name]')));
const broken = without.filter((t) => /\s[,.?]|,\s*[.?]|\s{2,}|^[a-z]/m.test(t));
ok('without a name, no stray comma, space or lower-case start', broken.length === 0, broken.slice(0, 2).join(' | '));
ok('a letter reads "Hi Sam," with a name and "Hi," without', letterText(LETTER_BY_ID.M01, 'Sam').startsWith('Hi Sam,') && letterText(LETTER_BY_ID.M01, '').startsWith('Hi,'));

// ── a record to choose from
/** the programme began on Monday 5 January 2026 (`programmeStartedAt` is a date key) */
const START = { programmeStartedAt: '2026-01-05' } as never;
const at = (y: number, m: number, d: number, h = 22) => new Date(y, m, d, h).getTime();
const key = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
type Ev = Pick<TidelineEvent, 'type' | 'createdAt' | 'trigger'>;
const slip = (y: number, m: number, d: number, trigger?: string): Ev => ({ type: 'lapse', createdAt: at(y, m, d), trigger });

// ── the morning notification
ok('day 1 is the first note, day 84 the last', morningNoteForDay(1) === MORNING_NOTES[0] && morningNoteForDay(84) === MORNING_NOTES[83]);
ok('a day with no slip before it gets that day’s note', morningNoteFor(key(2026, 0, 20), 16, [], 'Sam') === fillName(MORNING_NOTES[15], 'Sam'));
const general = new Set(RELAPSE_NOTES.filter((n) => !n.when).map((n) => fillName(n.text, 'Sam')));
ok('the morning after a slip gets a relapse note', general.has(morningNoteFor(key(2026, 0, 21), 17, [slip(2026, 0, 20)], 'Sam')));
const note = (w: string) => fillName(RELAPSE_NOTES.find((n) => n.when === w)!.text, 'Sam');
ok('tiredness reported: the tired note', morningNoteFor(key(2026, 0, 21), 17, [slip(2026, 0, 20, 'Couldn’t sleep')], 'Sam') === note('tired'));
ok('stress reported: the stress note', morningNoteFor(key(2026, 0, 21), 17, [slip(2026, 0, 20, 'Stressed')], 'Sam') === note('stress'));
ok('an argument is not stress: no stress note', morningNoteFor(key(2026, 0, 21), 17, [slip(2026, 0, 20, 'An argument')], 'Sam') !== note('stress'));
ok('three slip days in a week: the repeated note', morningNoteFor(key(2026, 0, 21), 17, [slip(2026, 0, 16), slip(2026, 0, 18), slip(2026, 0, 20)], 'Sam') === note('repeated'));
ok('an urge ridden out is not a slip', morningNoteFor(key(2026, 0, 21), 17, [{ type: 'urge_rode_out', createdAt: at(2026, 0, 20) }], 'Sam') === fillName(MORNING_NOTES[16], 'Sam'));

// ── the relapse letter
const first = slip(2026, 0, 10);
const letter = (...evs: Ev[]) => relapseLetterFor(evs as never, START, key(2026, 0, 20)).id;
ok('the first slip ever: R02', relapseLetterFor([slip(2026, 0, 20)] as never, START, key(2026, 0, 20)).id === 'R02');
for (const [label, id] of [
  ['Couldn’t sleep', 'R07'],
  ['Stressed', 'R08'],
  ['An argument', 'R05'],
  ['Being alone', 'R09'],
  ['Bored', 'R10'],
  ['Scrolling', 'R11'],
  ['Something I saw online', 'R11'],
  ['Phone in bed', 'R12'],
  ['Not sure', 'R17'],
] as const)
  ok(`"${label}" reported: ${id}`, letter(first, slip(2026, 0, 20, label)) === id, letter(first, slip(2026, 0, 20, label)));
ok('repeated slips: R06', letter(first, slip(2026, 0, 16), slip(2026, 0, 18), slip(2026, 0, 20, 'Bored')) === 'R06');
ok('a week or more ended by a slip, nothing said: R03', letter(first, slip(2026, 0, 20)) === 'R03');
const unmapped = new Set(['Putting something off', 'My usual routine']);
// a second slip, well apart from the first: with nothing said it gets a general or streak letter, with a cause its own
const uncovered = RELAPSE_CAUSES.map(([, l]) => l).filter((l) => !unmapped.has(l) && letter(first, slip(2026, 0, 20, l)) === letter(first, slip(2026, 0, 20)));
ok('every relapse cause the documents name reaches its letter', uncovered.length === 0, uncovered.join(', '));

// ── the milestones (counted through yesterday, once each, the furthest first)
const due = (today: string, evs: Ev[] = [], spent: string[] = []) => dueMilestone(evs as never, START, today, new Set(spent))?.letter.id ?? null;
ok('the morning after the first night: M01', due(key(2026, 0, 6)) === 'M01');
ok('after two nights: M02', due(key(2026, 0, 7), [], ['M01']) === 'M02');
ok('after seven days: M05', due(key(2026, 0, 12), [], ['M01', 'M02', 'M03', 'M04']) === 'M05');
ok('a phone away for a month brings only the furthest: M09', due(key(2026, 1, 4)) === 'M09');
ok('nothing twice', due(key(2026, 0, 6), [], ['M01']) === null);
ok('four calendar months: M19', due(key(2026, 4, 5), [], ['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10', 'M11', 'M12', 'M13', 'M14', 'M15', 'M16', 'M17', 'M18']) === 'M19');
const allEarly = ['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09'];
ok('the first night back after a slip: M24', due(key(2026, 1, 12), [slip(2026, 1, 10)], allEarly) === 'M24');
ok('the first week back after a slip: M25', due(key(2026, 1, 18), [slip(2026, 1, 10)], [...allEarly, `M24@${key(2026, 1, 11)}`]) === 'M25');
ok('the first urge handled: M23', due(key(2026, 0, 6), [{ type: 'urge_rode_out', createdAt: at(2026, 0, 5, 21) }], ['M01']) === 'M23');

console.log(failed ? `\n${failed} rule(s) failed` : '\nall rules hold');
if (failed) process.exit(1);
