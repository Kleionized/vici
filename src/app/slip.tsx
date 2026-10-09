import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState, type ReactNode } from 'react';

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
import { UnsavedBoard, useBackgroundWrite, WAITING_LINE } from '@/components/urge/saving';
import { SupportPill, useStepBack } from '@/components/urge/stages';
import { SLIP_CARDS, SLIP_FED_TO_CARD, SLIP_KICKER } from '@/content/slipCards';
import { useCreateEvent, useCreateJournalEntry, useCurrentUser, useEvents, useJournalEntries } from '@/lib/backend';
import { isSlip, programmeDay } from '@/lib/day';
import { dayPartDate, dayPartTime, daysAgo, joinLower, WEEKDAYS_LONG } from '@/lib/format';
import { ACCOUNT_KEYS, writeAccountJSON } from '@/lib/accountState';
import { mono } from '@/lib/theme';
import { pledgeText, standingPledge } from '@/lib/pledge';
import { endUrgeInSlip } from '@/lib/urgeSession';

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
 *    directly at `/slip?stage=morning`; its line names the day the slip was
 *    logged for (`morningAfter`, D469).
 *
 * One route with eleven boards, so the swipe-back is off and Android's back
 * steps back a board (F2, D462). The slip is written in the background — the
 * board never waits on the network, and a refused write says so (B10, D465).
 */

/**
 * 98L's words for the day the slip was logged for. The frame's "Last night
 * happened." is only true of a slip logged for yesterday evening (or reached
 * directly, the frame's own case); yesterday daytime is "Yesterday", and
 * further back names the weekday under a title that is not "Morning after."
 */
function morningAfter(at: number, now: number, direct: boolean): { title: string; body: string } {
  const tail = 'Today still counts. Start with the next decision.';
  if (direct) return { title: 'Morning after.', body: `Last night happened. ${tail}` };
  const days = daysAgo(at, now);
  if (days <= 1) return { title: 'Morning after.', body: `${new Date(at).getHours() >= 18 ? 'Last night' : 'Yesterday'} happened. ${tail}` };
  return { title: 'Today still counts.', body: `It happened on ${WEEKDAYS_LONG[new Date(at).getDay()]}. Start with the next decision.` };
}

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

/**
 * The board each step was reached from, for back. Two are decided by the run
 * itself (see `back`): 98K came from 98J only when the pledge was shown, and
 * 98L from 98K only when this run logged a slip. 98A and 98E have none: back
 * from 98E leaves, as its ✕ does, rather than reopen answers already filed.
 */
const PREV: Partial<Record<Step, Step>> = {
  closeit: 'entry',
  when: 'closeit',
  fed: 'when',
  urgenow: 'logged',
  warn: 'urgenow',
  card: 'warn',
  pledge: 'card',
  begin: 'pledge',
  morning: 'begin',
};

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
  const createJournalEntry = useCreateJournalEntry();
  const user = useCurrentUser();
  const events = useEvents();
  const journal = useJournalEntries();
  const pledge = standingPledge(journal);
  const write = useBackgroundWrite('lapse');

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
  // Whether this run has written its event — read during render to leave it
  // out of the day's slip count, so the ref is only the re-entry guard.
  const [logged, setLogged] = useState(false);
  // The write was refused and the user chose "Not now": the slip is not on the log (D465).
  const [unsaved, setUnsaved] = useState(false);
  const saving = useRef(false);
  const resigned = useRef(false);

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

  /** The slip this run wrote, when it is on the log: never counted as one before it. */
  const isThisRun = (e: { type: string; createdAt: number }) => logged && e.type === 'lapse' && e.createdAt === at;

  /**
   * Slips already on the log for this day, NOT counting the one this run has
   * just written — 98G is the first slip's screen, so a clean day must land on
   * index 0 after the save, not on 98H. This run's slip is left out by what it
   * is, not by subtracting one, so a write still on its way (or refused)
   * cannot take an earlier slip off the count.
   */
  const priorToday = (events ?? []).filter((e) => isSlip(e) && !isThisRun(e) && new Date(e.createdAt).toDateString() === new Date(at).toDateString()).length;
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
  const priorSincePledge = pledge ? (events ?? []).filter((e) => isSlip(e) && e.createdAt >= pledge.createdAt && !isThisRun(e)).length : 0;
  const pledgeEligible = Boolean(pledge) && priorSincePledge === 0;

  /**
   * Back — the on-screen chevron and Android's back alike (F2) — retraces the
   * way the run came: 98K returns to 98J only if 98J was shown, 98L to 98K only
   * after a slip this run logged, and from 98A or 98E it leaves (D462).
   */
  const back = () => {
    let prev = PREV[step];
    if (step === 'begin' && !pledgeEligible) prev = 'card';
    if (step === 'morning' && !logged) prev = undefined;
    if (prev) go(prev);
    else close();
  };

  /**
   * The deck: the cards the user's own answers name, in chip order, then every
   * other card so “Give me another” never runs out.
   */
  const cards = useMemo(() => {
    const picked = fed.map((name) => SLIP_FED_TO_CARD[name]).filter(Boolean);
    const first = picked.map((id) => SLIP_CARDS.find((card) => card.id === id)!).filter((card, i, all) => all.indexOf(card) === i);
    return [...first, ...SLIP_CARDS.filter((card) => !first.includes(card))];
  }, [fed]);

  /** The slip, written behind the boards — the flow moves on at once (D465). */
  function save() {
    if (saving.current) return;
    saving.current = true;
    setLogged(true);
    // the urge this slip ended is over: a hub under the flow starts a new one, and a
    // session left by a killed app no longer holds back the letter queued below (D460)
    void endUrgeInSlip();
    const trigger = fed.length ? fed.join(' · ') : undefined;
    const when = at;
    write.run(async () => {
      // storage keeps the `' · '` join (Log, insights and the report read it); 98E only displays commas
      await createEvent({ type: 'lapse', trigger, createdAt: when });
      // The sealed letter arrives over Today the launch after a slip is logged.
      await writeAccountJSON(ACCOUNT_KEYS.letterPending, Date.now());
    });
  }

  /**
   * "Sign it again" files the pledge again, as the morning check-in does
   * (F5, D469): the same words, as today's pledge. It is dated after the slip,
   * so the hub reads "Signed today. Kept every day since." and the next slip
   * shows this board again. Once per run; the board never waits for it.
   */
  function resign() {
    const words = pledgeText(pledge);
    if (words && !resigned.current) {
      resigned.current = true;
      void createJournalEntry({ tag: 'Pledge', title: `Day ${programmeDay(user)} pledge`, body: words }).catch((error: unknown) => {
        if (__DEV__) console.warn('the re-signed pledge was not written', error);
      });
    }
    go('begin');
  }

  /** The board for this step. */
  function board(): ReactNode {
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
              save();
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
        // a row with nothing to say is left out, as Lapse Done draws fewer rows (D302).
        // 98E's fourth row, "Change for next time", read back a card's move the
        // user never chose; the summary says only what they entered (P4, D469).
        const rows = [
          { label: 'When', value: dayPartTime(at, now) },
          { label: 'What was going on', value: joinLower(feelings) },
          { label: 'Set off by', value: joinLower(situations) },
        ]
          .filter((r) => r.value)
          .map((r) => ({ ...r, value: noOrphan(r.value) }));
        // after a refused write and "Not now", the board no longer says the slip is logged (D465)
        return (
          <SlipDone onClose={close} cta="Continue" onCta={() => go('urgenow')}>
            <H1 center style={{ alignSelf: 'stretch' }}>
              {unsaved ? 'Slip not saved.' : 'Slip logged.'}
            </H1>
            <MonoText v="p" center style={{ alignSelf: 'stretch' }}>
              {unsaved ? 'It isn’t on your log. You stopped all the same.' : write.state === 'slow' ? WAITING_LINE : 'You stopped, and you logged it.'}
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
            // shame is the card that most needs a person within reach (B2, D467)
            extra={card.id === 'feel-ashamed' ? <SupportPill /> : undefined}
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
            onCta={resign}
            ghost="Read my pledge"
            onGhost={() => (pledge ? router.push({ pathname: '/journal-new', params: { id: pledge._id } }) : router.push('/(app)/journal'))}>
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
      case 'morning': {
        const words = morningAfter(at, now, !logged);
        return (
          <HeroBoard
            key="morning"
            nav={{ onClose: close }}
            hero="bell"
            title={words.title}
            body={words.body}
            cta="Check in"
            onCta={() => router.replace('/day/morning')}
            ghost="Later"
            onGhost={() => router.dismissTo('/(app)/today')}
          />
        );
      }
    }
  }

  const refused = logged && write.state === 'failed';
  /** "Not now" on the unsaved board: back to the board the user was on, which now knows the slip is not saved. */
  const notNow = () => {
    setUnsaved(true);
    write.dismiss();
  };

  // Android's back is the flow's own back (F2); over the unsaved board it is
  // "Not now", so the board underneath does not move while it is hidden
  useStepBack(() => (refused ? notNow() : back()));

  // A refused write is said where the user is, once the slip has been logged (D465).
  if (refused) {
    return (
      <>
        <Stack.Screen options={{ gestureEnabled: false }} />
        <UnsavedBoard what="slip" onRetry={write.retry} onLater={notNow} onClose={close} />
      </>
    );
  }

  return (
    <>
      {/* one route, eleven boards: the swipe would drop the slip before it is saved (F2) */}
      <Stack.Screen options={{ gestureEnabled: false }} />
      {board()}
    </>
  );
}
