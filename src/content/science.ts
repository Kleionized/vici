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

/** A study, as a card: where it ran, what it found, and its limit. */
export type Study = {
  id: string;
  /** journal · year, the card's caps line */
  source: string;
  /** the finding as a flat statement */
  title: string;
  /** who and what was found, in one or two sentences */
  body: string;
  /** the limit, said plainly */
  limit: string;
  authors: string;
  /** where the researchers were when they ran it */
  institutions: string[];
  url: string;
};

export const STUDIES: Study[] = [
  {
    id: 'bricker2020',
    source: 'JAMA Internal Medicine · 2020',
    title: 'Accepting urges worked better.',
    body: '2,415 smokers, followed for a year. An ACT app that taught them to accept urges beat one that taught them to avoid urges: 28% had quit, against 21%.',
    limit: 'Smoking, not porn. Quitting was self-reported.',
    authors: 'Bricker et al.',
    institutions: ['Fred Hutch'],
    url: 'https://doi.org/10.1001/jamainternmed.2020.4055',
  },
  {
    id: 'silverman2023',
    source: 'Journal of Consumer Research · 2023',
    title: 'A broken streak stops people.',
    body: 'Seven studies. After breaking a streak themselves, 29 in 100 kept going, against 53 with the streak intact. A way to repair it brought most of them back.',
    limit: 'Habits like exercise and language practice, not addiction.',
    authors: 'Silverman & Barasch',
    institutions: ['University of Delaware', 'University of Colorado Boulder'],
    url: 'https://doi.org/10.1093/jcr/ucac029',
  },
  {
    id: 'kirchner2012',
    source: 'Journal of Abnormal Psychology · 2012',
    title: 'Confidence counts more than guilt.',
    body: '203 smokers logged 1,001 slips. When confidence dropped after a slip, the next slip came sooner. Guilt made no difference.',
    limit: 'Smoking, not porn.',
    authors: 'Kirchner, Shiffman & Wileyto',
    institutions: ['Johns Hopkins', 'University of Pittsburgh', 'University of Pennsylvania'],
    url: 'https://doi.org/10.1037/a0024451',
  },
  {
    id: 'bowen2014',
    source: 'JAMA Psychiatry · 2014',
    title: 'What you do after a slip counts.',
    body: '286 adults after treatment. A year on, those who learned mindfulness-based relapse prevention and used again did so on 31% fewer days than those on standard relapse prevention.',
    limit: 'One trial, at one centre. Drugs and alcohol, not porn.',
    authors: 'Bowen et al.',
    institutions: ['University of Washington'],
    url: 'https://doi.org/10.1001/jamapsychiatry.2013.4546',
  },
  {
    id: 'crosby2016',
    source: 'Behavior Therapy · 2016',
    title: 'ACT has been tested on porn.',
    body: '28 men, 12 sessions of ACT. Viewing fell 93%, against 21% for the men still waiting to start.',
    limit: 'A small trial. Almost all the men were religious.',
    authors: 'Crosby & Twohig',
    institutions: ['Utah State University'],
    url: 'https://pubmed.ncbi.nlm.nih.gov/27157029/',
  },
];

/** Urge surfing, on its own board. */
export const URGE_STUDY: Study = {
  id: 'bowen2009',
  source: 'Psychology of Addictive Behaviors · 2009',
  title: 'Urges pass without action.',
  body: '123 smokers. Those taught to watch an urge rise and fall smoked less over the next week. Their urges were just as strong.',
  limit: 'Students, followed for one week.',
  authors: 'Bowen & Marlatt',
  institutions: ['University of Washington'],
  url: 'https://doi.org/10.1037/a0017127',
};

/** The streak study's two numbers, for the slip board's bars. */
export const STREAK_BARS = [
  { label: 'Streak intact', value: 53 },
  { label: 'Broke it themselves', value: 29 },
] as const;

/** Every institution behind the studies above, once each, in the order they come up. */
export const INSTITUTIONS: string[] = [...new Set([...STUDIES, URGE_STUDY].flatMap((s) => s.institutions))];

/** Under the institutions, wherever they are shown. */
export const NOT_AFFILIATED = 'VICI isn’t affiliated with these universities. Their researchers ran the studies VICI draws on.';

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
  { title: 'Notice the urge.', body: 'Name it when it starts. You don’t have to push it away.' },
  { title: 'Let it pass.', body: 'An urge rises, peaks and falls whether or not you act on it.' },
  { title: 'Act on what you value.', body: 'Choose the next thing by what matters to you.' },
];
