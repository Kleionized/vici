import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';

import {
  Chips,
  DateRow,
  H1,
  HeroBoard,
  MonoText,
  OptionList,
  PledgeCard,
  Sheet,
  SummaryCard,
  TimeWheel,
  WhenChips,
  type WheelStep,
} from '@/components/mono';
import { FED_FEELINGS, Gap, SLIP_FED, SlipDone, SlipQuestion, type FedName } from '@/components/slip/kit';
import { SLIP_CARDS, SLIP_FED_TO_CARD, SLIP_KICKER } from '@/content/slipCards';
import { useCreateEvent, useCurrentUser, useEvents, useJournalEntries } from '@/lib/backend';
import { dayPartDate, dayPartTime, daysAgo, joinLower } from '@/lib/format';
import { setJSON } from '@/lib/storage';
import { mono } from '@/lib/theme';
import { pledgeText, standingPledge } from '@/lib/pledge';

/**
 * The post-slip flow — canvas 98A–98L, plus the nineteen cards at 99A–100K.
 *
 * This is NOT `/relapse` (sos-flow's four `Relapse` boards). It is the twelve
 * `98 · RELAPSE — POST-SLIP` frames, one route with internal steps.
 *
 * Three things the canvas does not state, and how they are read here:
 *
 * 1. **98G / 98H / 98I are alternates, not a run.** “Don’t let it become two”,
 *    “Stop here” and the dark “You can still stop here” are the first, second
 *    and third slip of the same day. `FLOW.txt` lists them consecutively
 *    because it lists every frame consecutively — including all nineteen cards,
 *    which are plainly a picker.
 * 2. **The card is chosen by what fed the slip**, and “Give me another” walks
 *    the rest of the deck. The nineteen keys and the nine chips are two lists
 *    that only partly overlap; `SLIP_FED_TO_CARD` is the mapping, with its
 *    reasoning on it.
 * 3. **98L is the morning after.** Its own words say so — “Last night happened.”
 *    It is reached when the slip was logged for a day that is not today, and
 *    directly at `/slip?stage=morning`.
 */

/** The three alternates at the end of the questions, by how many slips today (98G, 98H, 98I). */
const WARNINGS = [
  { hero: 'dominoes2', title: 'Don’t let it become two.', body: 'One slip happened. You can still turn the rest of today around.' },
  { hero: 'dominoes2', title: 'Stop here.', body: 'It happened again. The next hour can still be different.' },
  { hero: 'charger', title: 'You can still stop here.', body: 'The day is not gone. The phone goes away for the rest of the evening — that’s the only job.', dark: true },
] as const;

/** 98C's presets — now, four hours ago, a day ago. */
const WHEN_CHIPS = [
  { label: 'Just now', offsetMs: 0 },
  { label: 'Earlier today', offsetMs: 4 * 3600_000 },
  { label: 'Yesterday', offsetMs: 24 * 3600_000 },
] as const;

/** One wheel row, per column, in milliseconds: the wheel shifts the moment, so 11:59 → 12:00 carries the hour. */
const WHEEL_UNIT: Record<WheelStep['column'], number> = { hour: 3600_000, minute: 60_000, period: 12 * 3600_000 };

/**
 * 98E's values wrap greedily (the frame states no `text-wrap`), so a wider
 * phone can strand one word — "Phone charges outside the / bedroom" at 430.
 * A no-break space between the last two words keeps a pair on the last line;
 * every break the frame draws at 393 already ends on a pair, so it is unchanged.
 */
const noOrphan = (value: string) => value.replace(/ (\S+)$/, ' $1');

/** How far back Change reaches: today and the six days before it. */
const DATE_DAYS = 7;
/** Change's sheet: seven 58 rows, gap 12, under the content column's 44 — ending where the primary's bottom edge does (852 − 48). */
const DATE_SHEET_TOP = 852 - 48 - (DATE_DAYS * 58 + (DATE_DAYS - 1) * 12) - 44;

type Step = 'entry' | 'closeit' | 'when' | 'fed' | 'logged' | 'urgenow' | 'warn' | 'card' | 'pledge' | 'begin' | 'morning';

const ORDER: Step[] = ['entry', 'closeit', 'when', 'fed', 'logged', 'urgenow', 'warn', 'card', 'pledge', 'begin'];

/**
 * 98F’s four answers, top to bottom.
 *
 * `relapse-workflow.md` §11 branches the post-slip flow on a 0–5 current-urge
 * scale, and this board asks the same question with four answers instead of six
 * — so the four map onto the doc's bands: “No” is 0–1, “A little” is 2, “Yes”
 * is 3 and “I’m already watching again” is the 4–5 the doc overrides on three
 * separate pages (§4, §11, §21) — D149. 0–3 all end in the same place here, because the
 * doc's “one reset action” for 2–3 is exactly what 98G/98H/98I and the card
 * already are — the canvas draws no separate reset board to send them to. 4–5
 * has a destination the app really has: the urge hub.
 */
const WATCHING = ['No', 'A little', 'Yes', 'I’m already watching again'] as const;
type Watching = (typeof WATCHING)[number];

/** The one answer that leaves the flow. */
const STILL_WATCHING: Watching = 'I’m already watching again';

export default function Slip() {
  const router = useRouter();
  const { stage } = useLocalSearchParams<{ stage?: string }>();
  const createEvent = useCreateEvent();
  const user = useCurrentUser();
  const events = useEvents();
  const journal = useJournalEntries();
  const pledge = standingPledge(journal);

  const [step, setStep] = useState<Step>(stage === 'morning' ? 'morning' : 'entry');
  const [when, setWhen] = useState(0);
  // A time moved on the wheel or the date outranks the chips (and lights none of them).
  const [customAt, setCustomAt] = useState<number | null>(null);
  const [dateOpen, setDateOpen] = useState(false);
  const [fed, setFed] = useState<FedName[]>([]);
  const [watching, setWatching] = useState<Watching | null>(null);
  const [deck, setDeck] = useState(0);
  // Read once: the wheel must not slide under a re-render.
  const [now] = useState(() => Date.now());
  // Whether this run has written its event — read during render to discount it
  // from the day's slip count, so the ref is only the re-entry guard.
  const [logged, setLogged] = useState(false);
  const saving = useRef(false);

  // 'Earlier today' stays today: before 04:00 a four-hour offset would land in
  // last night while the chip still says today (D403)
  const at = customAt ?? Math.max(WHEN_CHIPS[when].offsetMs === 24 * 3600_000 ? 0 : new Date(now).setHours(0, 0, 0, 0), now - WHEN_CHIPS[when].offsetMs);
  /** A picked moment may not be in the future. */
  // a pick that leaves the moment where it is (the day already chosen, a wheel step the
  // future-clamp undoes) keeps the lit chip lit
  const pick = (t: number) => {
    const next = Math.min(t, now);
    if (next !== at) setCustomAt(next);
  };
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));
  const go = (next: Step) => setStep(next);
  const back = () => {
    const here = ORDER.indexOf(step);
    if (here <= 0) close();
    else go(ORDER[here - 1]);
  };

  /**
   * Slips already on the log for this day, NOT counting the one this run has
   * just written — 98G is the first slip's screen, so a clean day must land on
   * index 0 after the save, not on 98H.
   */
  const slipsToday = (events ?? []).filter((e) => e.type === 'lapse' && new Date(e.createdAt).toDateString() === new Date(at).toDateString()).length;
  const priorToday = Math.max(0, slipsToday - (logged ? 1 : 0));
  const warning = WARNINGS[Math.min(priorToday, WARNINGS.length - 1)];

  /**
   * 98J is conditional, and the canvas cannot say so — it draws one state (D148).
   * `relapse-workflow.md` §9 gives the table: an active pledge on the first slip
   * since signing shows the card; a same-day repeat “usually no, focus on
   * access/friction first”; **no pledge exists → skip the screen**. Both collapse
   * into one test: there must be a pledge, and no slip may already stand between
   * the signature and this one — a same-day repeat necessarily has one. The card
   * is only ever drawn over words the user actually signed.
   */
  const priorSincePledge = pledge
    ? (events ?? []).filter((e) => e.type === 'lapse' && e.createdAt >= pledge.createdAt && !(logged && e.createdAt === at)).length
    : 0;
  const pledgeEligible = Boolean(pledge) && priorSincePledge === 0;

  /**
   * The deck: the cards the user's own answers name, in chip order, then every
   * other card so “Give me another” never runs out.
   */
  const cards = useMemo(() => {
    const picked = fed.map((name) => SLIP_FED_TO_CARD[name]).filter(Boolean);
    const first = picked.map((id) => SLIP_CARDS.find((card) => card.id === id)!).filter((card, i, all) => all.indexOf(card) === i);
    return [...first, ...SLIP_CARDS.filter((card) => !first.includes(card))];
  }, [fed]);

  async function save() {
    if (saving.current) return;
    saving.current = true;
    setLogged(true);
    try {
      // storage keeps the `' · '` join (Log, insights and the report read it); 98E only displays commas
      await createEvent({ type: 'lapse', trigger: fed.length ? fed.join(' · ') : undefined, createdAt: at });
      // The sealed letter arrives over Today the launch after a slip is logged.
      await setJSON('tideline.letter.pending', Date.now());
    } catch {
      // no frame draws a failed save; the flow carries on (relapse.tsx does the same)
    }
  }

  switch (step) {
    // ── 98A · Slip — It Happened ────────────────────────────────────
    case 'entry':
      return (
        <HeroBoard
          key="entry"
          nav={{ onClose: close }}
          hero="dominoes"
          title="It happened."
          body="The day isn’t over. Log what happened, then stop it here."
          cta="Log the slip"
          onCta={() => go('closeit')}
          ghost="Not now"
          onGhost={close}
        />
      );

    // ── 98B · Slip — Close It Now ───────────────────────────────────
    case 'closeit':
      return (
        <HeroBoard
          key="closeit"
          nav={{ onClose: close }}
          hero="tab"
          title="Close it now."
          body="Everything else can wait. Close the tab, close the app, put the screen down."
          cta="Continue"
          onCta={() => go('when')}
        />
      );

    // ── 98C · Slip — When ───────────────────────────────────────────
    case 'when': {
      const t = new Date(at);
      const h24 = t.getHours();
      const ago = daysAgo(at, now);
      const days = Array.from({ length: DATE_DAYS }, (_, k) => {
        const d = new Date(at);
        d.setDate(d.getDate() + ago - k);
        return { key: String(k), label: dayPartDate(d, now) };
      });
      return (
        <SlipQuestion
          back
          dashes={3}
          onBack={back}
          onClose={close}
          gap={14}
          cta="Continue"
          onCta={() => go('fed')}
          overlay={
            <Sheet open={dateOpen} top={DATE_SHEET_TOP} onClose={() => setDateOpen(false)}>
              <OptionList
                options={days}
                value={String(ago)}
                onChange={(key) => {
                  const d = new Date(at);
                  d.setDate(d.getDate() + ago - Number(key));
                  pick(d.getTime());
                  // let the row show it was picked, as the funnel's auto-advance does
                  setTimeout(() => setDateOpen(false), 260);
                }}
              />
            </Sheet>
          }>
          <H1>When did it happen?</H1>
          <Gap h={2} />
          <WhenChips
            options={WHEN_CHIPS.map((c) => c.label)}
            value={customAt == null ? WHEN_CHIPS[when].label : null}
            onChange={(label) => {
              setWhen(WHEN_CHIPS.findIndex((c) => c.label === label));
              setCustomAt(null);
            }}
          />
          <Gap h={6} />
          <MonoText v="caps">Or choose a time</MonoText>
          <TimeWheel
            value={{ hour12: h24 % 12 || 12, minute: t.getMinutes(), period: h24 >= 12 ? 'PM' : 'AM' }}
            onChange={(_, s) => pick(at + s.delta * WHEEL_UNIT[s.column])}
          />
          <DateRow label={dayPartDate(at, now)} onPress={() => setDateOpen(true)} />
        </SlipQuestion>
      );
    }

    // ── 98D · Slip — What Fed It ────────────────────────────────────
    case 'fed':
      return (
        <SlipQuestion
          back
          dashes={5}
          onBack={back}
          onClose={close}
          hero={{ id: 'nightPhone', top: 506 }}
          gap={8}
          cta="Continue"
          // no frame draws it, but a slip needs at least one answer (D321's dimmed pill)
          ctaDisabled={fed.length === 0}
          onCta={() => {
            void save();
            go('logged');
          }}>
          <H1>What fed it?</H1>
          <MonoText v="pTight" color={mono.mute}>
            Tap all that apply.
          </MonoText>
          <Gap h={6} />
          <Chips<FedName> multi options={SLIP_FED} value={fed} onChange={setFed} />
        </SlipQuestion>
      );

    // ── 98E · Slip — Logged ─────────────────────────────────────────
    case 'logged': {
      const feelings = fed.filter((name) => FED_FEELINGS.includes(name));
      const situations = fed.filter((name) => !FED_FEELINGS.includes(name));
      // 98E's own sample takes the change line off the SITUATION, not the
      // feeling: `Tired, Phone in bed, Late night` reads back as “Phone charges
      // outside the bedroom”, which is the Late night card's move.
      const change = (cards.find((card) => card.kind === 'trigger' && fed.some((name) => SLIP_FED_TO_CARD[name] === card.id)) ?? cards[0])?.change;
      // a row with nothing to say is left out, as Lapse Done draws fewer rows (D302)
      const rows = [
        { label: 'When', value: dayPartTime(at, now) },
        { label: 'What was going on', value: joinLower(feelings) },
        { label: 'Set off by', value: joinLower(situations) },
        { label: 'Change for next time', value: change ?? '' },
      ]
        .filter((r) => r.value)
        .map((r) => ({ ...r, value: noOrphan(r.value) }));
      return (
        <SlipDone onClose={close} cta="Continue" onCta={() => go('urgenow')}>
          <H1 center style={{ alignSelf: 'stretch' }}>
            Slip logged.
          </H1>
          <MonoText v="p" center style={{ alignSelf: 'stretch' }}>
            You stopped, logged it, and changed something for next time.
          </MonoText>
          <Gap h={6} />
          <SummaryCard rows={rows} />
        </SlipDone>
      );
    }

    // ── 98F · Slip — Current Urge ───────────────────────────────────
    case 'urgenow':
      return (
        <SlipQuestion
          onClose={close}
          hero={{ id: 'tab', top: 506, scale: 0.965 }}
          gap={8}
          cta="Continue"
          // the answer is optional (D149); the one that says it is still going leaves the flow
          // dismissTo: back to the hub when the hub opened the flow (no second hub on the
          // stack under it), a replace when the surf stage did (D402)
          onCta={() => (watching === STILL_WATCHING ? router.dismissTo('/urge-hub') : go('warn'))}>
          {/* balance breaks it here on the web; native gets the same two lines from the \n (D332) */}
          <H1>{'Do you still want\nto keep watching?'}</H1>
          <MonoText v="pTight" color={mono.mute}>
            Honest answer. It changes what comes next.
          </MonoText>
          <Gap h={6} />
          <OptionList options={WATCHING} value={watching} onChange={setWatching} />
        </SlipQuestion>
      );

    // ── 98G / 98H / 98I · one slip, two, or three ───────────────────
    case 'warn':
      return (
        <HeroBoard
          key={`warn-${priorToday}`}
          tone={'dark' in warning ? 'dark' : 'light'}
          nav={{ onClose: close }}
          hero={warning.hero}
          title={warning.title}
          body={warning.body}
          cta="Continue"
          onCta={() => go('card')}
        />
      );

    // ── 99A–99H, 100A–100K · the card the answers named ─────────────
    case 'card': {
      const card = cards[deck % cards.length];
      return (
        <HeroBoard
          key={`card-${card.id}`}
          nav={{ centre: { title: SLIP_KICKER[card.kind] }, onClose: close }}
          hero={card.hero}
          title={card.headline}
          body={card.body}
          cta={card.cta}
          onCta={() => go(pledgeEligible ? 'pledge' : 'begin')}
          ghost="Give me another"
          onGhost={() => setDeck((index) => index + 1)}
        />
      );
    }

    // ── 98J · Slip — The Pledge Still Stands ────────────────────────
    case 'pledge':
      return (
        <SlipQuestion
          onClose={close}
          hero={{ id: 'fountainPen', top: 458, scale: 0.869 }}
          gap={14}
          cta="Sign it again"
          onCta={() => go('begin')}
          ghost="Read my pledge"
          onGhost={() => router.push('/vow')}>
          <H1>The pledge still stands.</H1>
          <MonoText v="p">A slip doesn’t erase what you decided. Sign it again and keep going.</MonoText>
          <Gap h={6} />
          {/* gated on `pledgeEligible`, so the words are always ones the user signed */}
          <PledgeCard pledge={pledgeText(pledge)} name={user?.displayName?.split(' ')[0] || 'You'} signed />
        </SlipQuestion>
      );

    // ── 98K · Slip — Begin Again ────────────────────────────────────
    case 'begin':
      return (
        <HeroBoard
          key="begin"
          nav={{ onClose: close }}
          hero="sunrise"
          title="The day is still yours."
          body="One part of it went wrong. Nothing else has to."
          cta="Start again"
          // a slip logged for a day that is not today IS last night's, which is
          // the board 98L writes for — read the timestamp, not the chip, because
          // the wheel can move it after the chip was picked
          // back to the Today already on the stack: a replace mounted a second (app)
          // and re-ran its once-per-launch prompts straight away (D402)
          onCta={() => (daysAgo(at, now) !== 0 ? go('morning') : router.dismissTo('/(app)/today'))}
        />
      );

    // ── 98L · Slip — Morning After ──────────────────────────────────
    case 'morning':
      return (
        <HeroBoard
          key="morning"
          nav={{ onClose: close }}
          hero="bell"
          title="Morning after."
          body="Last night happened. Today still counts. Start with the next decision."
          cta="Check in"
          onCta={() => router.replace('/day/morning')}
          ghost="Later"
          onGhost={() => router.dismissTo('/(app)/today')}
        />
      );
  }
}
