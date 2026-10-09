/**
 * The onboarding questionnaire, read off the canvas.
 *
 * GENERATED FILE — do not edit by hand. `scripts/overhaul/gen-funnel.mjs` reads
 * `Vici Overhaul/project/Email Login.dc.html` (via `.overhaul/scenes/Email-Login.json`) and writes this; the next
 * run reverts anything typed in here.
 *
 * Each step carries what its frame states and nothing the two templates fix:
 * the nav's inked dashes, the stack's top / gap / centring, the copy, the
 * spacer, the answers (with the ones the frame draws chosen, for recipes and
 * checks only — never read at runtime), the spot illustration's card id, top
 * and scale, and the primary's label (none on the single-select screens,
 * which turn themselves over).
 */

import type { HeroId } from './heroes';

/** A run of a paragraph: the frames set the closing words of a line in 700 ink. */
export type FunnelRun = { text: string; bold?: boolean };
export type FunnelHero = { id: HeroId; top: number; scale: number };
export type FunnelStep = {
  id: string;
  /** the canvas frame this screen is a port of */
  label: string;
  /** the canvas's own sticky note — its flow number and name */
  note: string;
  /** `text` the name field, `wheel` the age picker, `list` single-select rows, `chips` multi-select, `statement` the centred board */
  kind: 'text' | 'wheel' | 'list' | 'chips' | 'statement';
  multi: boolean;
  /** inked dashes of the eight in the nav row; `null` where the frame draws no dash row (Start) */
  dashes: number | null;
  /** the content column: `left 24, right 24`, its canvas top and gap, centred on the statement boards */
  stack: { top: number; gap: number; center: boolean };
  title: string;
  /** the 15/22 mute line under a question ("Select all that apply") */
  sub: string | null;
  /** the bare spacer div before the answers (10 after a sub, 18 without) */
  spacer: number | null;
  /** a statement board's 15/24 paragraph */
  body: string | null;
  /** Goal confirmation's card, as runs */
  card: FunnelRun[] | null;
  placeholder?: string;
  /** Age: the five numbers the frame draws and which is chosen (reference only) */
  wheel?: { values: number[]; selected: number };
  options: string[];
  /** the answers the frame draws chosen — recipes and checks only */
  drawnSelected: number[];
  hero: FunnelHero | null;
  cta: string | null;
  /**
   * @deprecated The previous drop's Back-row top. Every overhaul frame puts the nav row at 60;
   * kept (= 60) only because `welcome.tsx` still passes it to `O3Shell`, which ignores it.
   */
  backTop: number;
};

export const FUNNEL_STEPS: FunnelStep[] = [
  {"id":"name","label":"V3 Q24 Name","note":"03 · Name","kind":"text","multi":false,"dashes":1,"stack":{"top":136,"gap":14,"center":false},"title":"What’s your name?","sub":"Encrypted in transit and at rest.","spacer":10,"body":null,"card":null,"placeholder":"Your name","options":[],"drawnSelected":[],"hero":{"id":"pencil","top":506,"scale":1.1},"cta":"Continue","backTop":60},
  {"id":"ageYears","label":"V3 Q25 Age","note":"04 · Age","kind":"wheel","multi":false,"dashes":1,"stack":{"top":136,"gap":20,"center":false},"title":"How old are you?","sub":null,"spacer":null,"body":null,"card":null,"wheel":{"values":[22,23,24,25,26],"selected":2},"options":[],"drawnSelected":[],"hero":null,"cta":"Continue","backTop":60},
  {"id":"gender","label":"V3 Q26 Gender","note":"05 · Gender","kind":"list","multi":false,"dashes":1,"stack":{"top":136,"gap":14,"center":false},"title":"How do you describe your gender?","sub":null,"spacer":18,"body":null,"card":null,"options":["Male","Female","Non-binary","Another identity","Prefer not to say"],"drawnSelected":[0],"hero":{"id":"idCard","top":582,"scale":0.877},"cta":null,"backTop":60},
  {"id":"start","label":"Onboarding Start","note":"06 · Start","kind":"statement","multi":false,"dashes":null,"stack":{"top":451,"gap":18,"center":true},"title":"Sam, what usually leads you back to porn?","sub":null,"spacer":null,"body":"It takes about two minutes. Then you’ll see what to change first.","card":null,"options":[],"drawnSelected":[],"hero":{"id":"nightPhone","top":190,"scale":1.1},"cta":"Start","backTop":60},
  {"id":"freq","label":"V3 Q1","note":"07 · Frequency","kind":"list","multi":false,"dashes":1,"stack":{"top":136,"gap":14,"center":false},"title":"How often are you watching porn right now?","sub":null,"spacer":18,"body":null,"card":null,"options":["More than once a day","About once a day","A few times a week","About once a week","A few times a month","Less than once a month"],"drawnSelected":[2],"hero":null,"cta":null,"backTop":60},
  {"id":"duration","label":"V3 Q2","note":"08 · How long","kind":"list","multi":false,"dashes":2,"stack":{"top":136,"gap":14,"center":false},"title":"How long have you wanted to quit or cut down?","sub":null,"spacer":18,"body":null,"card":null,"options":["Less than 3 months","3–12 months","1–3 years","3–5 years","5+ years"],"drawnSelected":[2],"hero":{"id":"hourglass","top":582,"scale":1.1},"cta":null,"backTop":60},
  {"id":"quitAttempts","label":"V3 Q3","note":"09A · Previous quit attempts","kind":"list","multi":false,"dashes":2,"stack":{"top":136,"gap":14,"center":false},"title":"Have you tried to quit before?","sub":null,"spacer":18,"body":null,"card":null,"options":["Yes, several times","Yes, once or twice","No"],"drawnSelected":[0],"hero":{"id":"compass","top":582,"scale":1.1},"cta":null,"backTop":60},
  {"id":"relapseSpan","label":"V3 Q3b","note":"09B · Relapse","kind":"list","multi":false,"dashes":3,"stack":{"top":136,"gap":14,"center":false},"title":"When you try to quit, how long until you watch again?","sub":null,"spacer":18,"body":null,"card":null,"options":["Less than a day","A few days","About a week","A few weeks","A month or longer"],"drawnSelected":[1],"hero":{"id":"calendar","top":582,"scale":0.76},"cta":null,"backTop":60},
  {"id":"firstPrinciple","label":"First Principle","note":"10 · First principle","kind":"statement","multi":false,"dashes":3,"stack":{"top":451,"gap":18,"center":true},"title":"An urge doesn’t stay at its worst for long.","sub":null,"spacer":null,"body":"The first job is to get through the worst of it.","card":null,"options":[],"drawnSelected":[],"hero":{"id":"lighthouse","top":190,"scale":1.1},"cta":"Continue","backTop":60},
  {"id":"triggers","label":"V3 Q5","note":"11 · When","kind":"chips","multi":true,"dashes":3,"stack":{"top":140,"gap":14,"center":false},"title":"When do you usually end up watching?","sub":"Select all that apply","spacer":10,"body":null,"card":null,"options":["Late at night","In the morning","When I’m bored","When I’m stressed","When I can’t sleep","On weekends","After drinking","When I’m home alone","While scrolling"],"drawnSelected":[0,4,7,8],"hero":null,"cta":"Continue","backTop":60},
  {"id":"emotions","label":"V3 Q6","note":"12 · Beforehand","kind":"chips","multi":true,"dashes":4,"stack":{"top":136,"gap":14,"center":false},"title":"What are you usually feeling right before?","sub":"Select all that apply","spacer":10,"body":null,"card":null,"options":["Horny","Bored","Lonely","Stressed","Low","Angry","Numb","Tired","Nothing in particular"],"drawnSelected":[1,2,7],"hero":{"id":"thunderCloud","top":506,"scale":1.1},"cta":"Continue","backTop":60},
  {"id":"places","label":"V3 Q7","note":"13 · Place","kind":"chips","multi":true,"dashes":4,"stack":{"top":136,"gap":14,"center":false},"title":"Where are you usually watching?","sub":"Select all that apply","spacer":10,"body":null,"card":null,"options":["In bed","In the bathroom","At my desk","In the living room","Somewhere else at home","Outside home"],"drawnSelected":[0],"hero":{"id":"bed","top":506,"scale":1.089},"cta":"Continue","backTop":60},
  {"id":"before","label":"What starts it","note":"14 · What starts it","kind":"chips","multi":true,"dashes":4,"stack":{"top":140,"gap":14,"center":false},"title":"What usually sets it off?","sub":"Select all that apply","spacer":10,"body":null,"card":null,"options":["I see something sexual online","I start scrolling","I can’t sleep","I’ve had a stressful day","I argue with someone or feel rejected","I start fantasising","Nothing obvious"],"drawnSelected":[1,2],"hero":null,"cta":"Continue","backTop":60},
  {"id":"transition","label":"Transition","note":"15 · Transition","kind":"statement","multi":false,"dashes":5,"stack":{"top":451,"gap":18,"center":true},"title":"That’s enough to see where it usually starts.","sub":null,"spacer":null,"body":"A few more questions. Then you’ll see what to change first.","card":null,"options":[],"drawnSelected":[],"hero":{"id":"signpost","top":190,"scale":1.1},"cta":"Continue","backTop":60},
  {"id":"impact","label":"V3 Q21","note":"16 · Impact","kind":"list","multi":false,"dashes":5,"stack":{"top":136,"gap":14,"center":false},"title":"How much is porn getting in the way of your life?","sub":null,"spacer":18,"body":null,"card":null,"options":["Not really","A little","Quite a bit","A lot"],"drawnSelected":[2],"hero":{"id":"scale","top":582,"scale":1.1},"cta":null,"backTop":60},
  {"id":"affects","label":"What it affects","note":"17 · What it affects","kind":"chips","multi":true,"dashes":5,"stack":{"top":136,"gap":14,"center":false},"title":"What does it affect most?","sub":"Choose up to three","spacer":10,"body":null,"card":null,"options":["Time","Focus","Sleep","Confidence","Relationships","Sex or intimacy","Energy","Feeling in control","Peace of mind"],"drawnSelected":[1,2,3],"hero":{"id":"plant","top":506,"scale":1.1},"cta":"Continue","backTop":60},
  {"id":"lonely","label":"V3 Q10","note":"18 · Loneliness","kind":"list","multi":false,"dashes":6,"stack":{"top":136,"gap":14,"center":false},"title":"How often have you felt lonely lately?","sub":null,"spacer":18,"body":null,"card":null,"options":["Rarely","Sometimes","Often","Most days"],"drawnSelected":[1],"hero":{"id":"lamp","top":582,"scale":1.1},"cta":null,"backTop":60},
  {"id":"alone","label":"V3 Q13","note":"19 · Time alone","kind":"list","multi":false,"dashes":6,"stack":{"top":136,"gap":14,"center":false},"title":"How often are you on your own for long stretches?","sub":null,"spacer":18,"body":null,"card":null,"options":["Most days","A few days a week","Now and then","Rarely"],"drawnSelected":[1],"hero":{"id":"openDoor","top":582,"scale":1.1},"cta":null,"backTop":60},
  {"id":"goalPorn","label":"V3 Q15","note":"20 · Goal","kind":"list","multi":false,"dashes":7,"stack":{"top":136,"gap":14,"center":false},"title":"What are you aiming for with porn?","sub":null,"spacer":18,"body":null,"card":null,"options":["Stop completely","Watch much less","Set a limit and stick to it","I’m not sure yet"],"drawnSelected":[0],"hero":{"id":"flag","top":582,"scale":1.1},"cta":null,"backTop":60},
  {"id":"goalMast","label":"V3 Q16","note":"21 · Masturbation goal","kind":"list","multi":false,"dashes":7,"stack":{"top":136,"gap":14,"center":false},"title":"What about masturbation?","sub":null,"spacer":18,"body":null,"card":null,"options":["Stop for now","Do it less","Keep it, just without porn","I’m not sure yet"],"drawnSelected":[2],"hero":{"id":"signpost","top":582,"scale":1.1},"cta":null,"backTop":60},
  {"id":"tried","label":"V3 Q17","note":"22 · What you’ve tried","kind":"chips","multi":true,"dashes":7,"stack":{"top":140,"gap":14,"center":false},"title":"What have you tried already?","sub":"Select all that apply","spacer":10,"body":null,"card":null,"options":["Blocking sites or apps","Going cold turkey","Asking someone to keep me accountable","Deleting apps or accounts","Therapy or counselling","Replacing it with other habits","Nothing yet"],"drawnSelected":[0,1],"hero":null,"cta":"Continue","backTop":60},
  {"id":"goalConfirm","label":"Goal Confirmation","note":"23 · Goal confirmation","kind":"statement","multi":false,"dashes":8,"stack":{"top":451,"gap":18,"center":true},"title":"You want to stop.","sub":null,"spacer":null,"body":"That’s what we’ll work toward.","card":[{"text":"Masturbation isn’t what you’re changing. "},{"text":"Porn is.","bold":true}],"options":[],"drawnSelected":[],"hero":{"id":"flag","top":190,"scale":1.1},"cta":"Continue","backTop":60},
];
