/**
 * The science thread (D64, `.overhaul/SCIENCE.md`): the onboarding boards that
 * show what VICI is built on, and Settings › The science. Every finding here
 * comes from `Streak counters vs cognitive recovery: the evidence` (22 Oct
 * 2026), and every institution was checked against the paper or the
 * university's own page (24 Oct 2026). Claims stay inside what the studies
 * show: no success rate, no "proven", no brain claims.
 */
import type { FunnelStep } from './onboardingFunnel';

/**
 * The question streak apps don't ask: whether the trouble is control, a clash
 * with his values, or both. ICD-11 (6C72) treats the two differently, and a
 * clash with one's values explains much of the feeling of being addicted
 * (Grubbs 2019). It sits after `17 · What it affects`, drawn as the list
 * questions are.
 */
export const CONCERN_STEP: FunnelStep = {
  id: 'concern',
  label: 'Science · Concern',
  note: '17A · What bothers you',
  kind: 'list',
  multi: false,
  dashes: 5,
  stack: { top: 136, gap: 14, center: false },
  title: 'What bothers you most about it?',
  sub: null,
  spacer: 18,
  body: null,
  card: null,
  options: ['I can’t control it', 'It goes against what I believe', 'Both', 'I’m not sure'],
  drawnSelected: [],
  hero: { id: 'compass', top: 582, scale: 1.1 },
  cta: null,
  backTop: 60,
};

/** The answers that say his values are part of it. */
export const VALUES_CONCERN = new Set(['It goes against what I believe', 'Both']);

/** What a card draws instead of a paragraph (D67): two bars, one figure, or two outcomes side by side. */
export type StudyChart =
  | { kind: 'bars'; unit: string; bars: { label: string; value: number }[] }
  | { kind: 'figure'; value: string; label: string }
  | { kind: 'pair'; items: { value: string; label: string }[] };

/** A study, as a card: where it ran, what it found, in a chart, and its limit. */
export type Study = {
  id: string;
  /** journal · year, the card's caps line */
  source: string;
  /** the finding as a flat statement */
  title: string;
  /** who, in a few words */
  sample: string;
  chart: StudyChart;
  /** the limit, said plainly */
  limit: string;
  authors: string;
  year: number;
  /** where the researchers were when they ran it */
  institutions: string[];
  url: string;
};

export const STUDIES: Study[] = [
  {
    id: 'bricker2020',
    source: 'JAMA Internal Medicine · 2020',
    title: 'Accepting urges worked better.',
    sample: '2,415 smokers · 1 year',
    chart: { kind: 'bars', unit: '% quit', bars: [{ label: 'Accept urges', value: 28 }, { label: 'Avoid urges', value: 21 }] },
    limit: 'Smoking, not porn.',
    authors: 'Bricker et al.',
    year: 2020,
    institutions: ['Fred Hutch'],
    url: 'https://doi.org/10.1001/jamainternmed.2020.4055',
  },
  {
    id: 'silverman2023',
    source: 'Journal of Consumer Research · 2023',
    title: 'A broken streak stops people.',
    sample: '7 studies',
    chart: { kind: 'bars', unit: 'in 100 kept going', bars: [{ label: 'Streak kept', value: 53 }, { label: 'Broke it themselves', value: 29 }] },
    limit: 'Habits, not addiction.',
    authors: 'Silverman & Barasch',
    year: 2023,
    institutions: ['University of Delaware', 'University of Colorado Boulder'],
    url: 'https://doi.org/10.1093/jcr/ucac029',
  },
  {
    id: 'kirchner2012',
    source: 'Journal of Abnormal Psychology · 2012',
    title: 'Lost confidence brings the next slip sooner.',
    sample: '203 smokers · 1,001 slips',
    chart: { kind: 'pair', items: [{ value: 'Sooner', label: 'next slip, after confidence dropped' }, { value: 'No change', label: 'after guilt' }] },
    limit: 'Smoking, not porn.',
    authors: 'Kirchner, Shiffman & Wileyto',
    year: 2012,
    institutions: ['Johns Hopkins', 'University of Pittsburgh', 'University of Pennsylvania'],
    url: 'https://doi.org/10.1037/a0024451',
  },
  {
    id: 'bowen2014',
    source: 'JAMA Psychiatry · 2014',
    title: 'Fewer days of use after a slip.',
    sample: '286 adults · 1 year',
    chart: { kind: 'figure', value: '31%', label: 'fewer days of use with mindfulness' },
    limit: 'Drugs and alcohol, not porn.',
    authors: 'Bowen et al.',
    year: 2014,
    institutions: ['University of Washington'],
    url: 'https://doi.org/10.1001/jamapsychiatry.2013.4546',
  },
  {
    id: 'crosby2016',
    source: 'Behavior Therapy · 2016',
    title: 'ACT has been tested on porn.',
    sample: '28 men · 12 sessions',
    chart: { kind: 'bars', unit: '% less viewing', bars: [{ label: 'With ACT', value: 93 }, { label: 'Waiting to start', value: 21 }] },
    limit: 'A small trial.',
    authors: 'Crosby & Twohig',
    year: 2016,
    institutions: ['Utah State University'],
    url: 'https://pubmed.ncbi.nlm.nih.gov/27157029/',
  },
];

/** Urge surfing, on its own board. */
export const URGE_STUDY: Study = {
  id: 'bowen2009',
  source: 'Psychology of Addictive Behaviors · 2009',
  title: 'Urges pass without action.',
  sample: '123 smokers · 1 week',
  chart: { kind: 'figure', value: 'Less', label: 'smoking, with urges just as strong' },
  limit: 'Students, for one week.',
  authors: 'Bowen & Marlatt',
  year: 2009,
  institutions: ['University of Washington'],
  url: 'https://doi.org/10.1037/a0017127',
};

/** The streak study's two numbers, for the slip board's bars. */
export const STREAK_BARS = [
  { label: 'Streak kept', value: 53 },
  { label: 'Broke it themselves', value: 29 },
] as const;

/** Every institution behind the studies above, once each, in the order they come up. */
export const INSTITUTIONS: string[] = [...new Set([...STUDIES, URGE_STUDY].flatMap((s) => s.institutions))];

/** Under the institutions, wherever they are shown. */
export const NOT_AFFILIATED = 'VICI isn’t affiliated with these universities.';

/** What VICI won't say, on the last research card and in Settings › The science. */
export const NO_CLAIMS = {
  title: 'What we don’t claim.',
  lines: [
    'VICI has no outcome data yet, so we don’t give a success rate.',
    'We don’t say it rewires your brain. No study shows an app does that.',
    'Most of these studies are of smoking, drinking or habits. Few are of porn.',
  ],
};

/** The method in three lines, for Settings › The science. */
export const METHOD = [
  { icon: 'search', title: 'Notice the urge.' },
  { icon: 'wave', title: 'Let it pass.' },
  { icon: 'flag', title: 'Act on what you value.' },
] as const;
