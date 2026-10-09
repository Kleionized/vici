/**
 * The SOS response boards — GENERATED FILE — do not edit by hand.
 * Written by `node scripts/overhaul/gen-sos-boards.mjs` from the `Vici Overhaul`
 * frames (`.overhaul/final/Email-Login/SOS-{Loc,Feel,Trig}-*.html`, `SOS-Challenge.html`);
 * `node scripts/overhaul/sos-breaks.mjs` checks the line breaks against them.
 *
 * One board per answer — seven locations, thirteen feelings, ten triggers — and
 * `SOS-Challenge`, the same board with a challenge card, reached only by
 * "Give me another". Every board draws the shared hero its frame names (the
 * Lesson-Illustrations-v4 card, asserted identical); `\n` marks a break the
 * frame's `text-wrap: balance`/`pretty` makes and a greedy wrap would not (D332).
 */
import type { HeroId } from './heroes';

export type SosBoardKind = 'location' | 'trigger' | 'feeling' | 'challenge';

export const SOS_BOARD_KEYS = [
  'SOS-Loc-Bed',
  'SOS-Loc-Bathroom',
  'SOS-Loc-Home-Alone',
  'SOS-Loc-Private-Room',
  'SOS-Loc-Work',
  'SOS-Loc-Public',
  'SOS-Loc-Elsewhere',
  'SOS-Feel-Turned-On',
  'SOS-Feel-Bored',
  'SOS-Feel-Lonely',
  'SOS-Feel-Stressed',
  'SOS-Feel-Anxious',
  'SOS-Feel-Angry',
  'SOS-Feel-Low',
  'SOS-Feel-Rejected',
  'SOS-Feel-Tired',
  'SOS-Feel-Restless',
  'SOS-Feel-Numb',
  'SOS-Feel-Ashamed',
  'SOS-Feel-Unknown',
  'SOS-Trig-Content',
  'SOS-Trig-Doomscroll',
  'SOS-Trig-Fantasy',
  'SOS-Trig-Late-Phone',
  'SOS-Trig-Habit',
  'SOS-Trig-Cant-Sleep',
  'SOS-Trig-Argument',
  'SOS-Trig-Rejection',
  'SOS-Trig-Alone',
  'SOS-Trig-Unknown',
  'SOS-Challenge',
] as const;
export type SosBoardKey = (typeof SOS_BOARD_KEYS)[number];

export interface SosResponse {
  kind: SosBoardKind;
  /** The nav's centre title — `Where you are`, `What set it off`, `How you feel`. */
  kicker?: string;
  /** The challenge draws a back chevron and dashes (`step` of `of` lit) instead of a kicker. */
  nav?: { back: true; step: number; of: number };
  hero: HeroId;
  /** The hero's canvas `top` (190; the challenge 111) and `transform: scale`. */
  heroTop: number;
  heroScale: number;
  /** The text stack's canvas `top` (452; the challenge 372). */
  stackTop: number;
  /** 30/36 on the boards, 26/33 on the challenge. */
  titleSize: 26 | 30;
  title: string;
  body: string;
  /** Only `SOS-Challenge`: the card's caps line and its sentence. */
  challengeLabel?: string;
  challenge?: string;
  cta: string;
  /** 48, or 96 over the ghost link. */
  ctaBottom: 48 | 96;
  /** Drawn only where the frame draws the "Give me another" link. */
  another?: true;
}

export const SOS_RESPONSES: Record<SosBoardKey, SosResponse> = {
  "SOS-Loc-Bed": {"kind":"location","kicker":"Where you are","hero":"bed","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Get out of bed.","body":"Both feet on the floor. Stand up and leave\nthe bedroom.","cta":"Continue","ctaBottom":48},
  "SOS-Loc-Bathroom": {"kind":"location","kicker":"Where you are","hero":"openDoor","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Leave the bathroom.","body":"Finish what you need to do, then take your phone with you and leave.","cta":"Continue","ctaBottom":48},
  "SOS-Loc-Home-Alone": {"kind":"location","kicker":"Where you are","hero":"lamp","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Move somewhere open.","body":"Turn the lights on and leave the room where you usually watch.","cta":"Continue","ctaBottom":48},
  "SOS-Loc-Private-Room": {"kind":"location","kicker":"Where you are","hero":"openDoor","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Open the door and move.","body":"Get away from the bed or chair and make the room less private.","cta":"Continue","ctaBottom":48},
  "SOS-Loc-Work": {"kind":"location","kicker":"Where you are","hero":"bench","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Stay where people are.","body":"Put your phone away. Don’t move somewhere\nmore private.","cta":"Continue","ctaBottom":48},
  "SOS-Loc-Public": {"kind":"location","kicker":"Where you are","hero":"bench","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Stay here.","body":"You’re in a safer place already. Keep the phone away and stay around people.","cta":"Continue","ctaBottom":48},
  "SOS-Loc-Elsewhere": {"kind":"location","kicker":"Where you are","hero":"signpost","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Get somewhere\nless private.","body":"Move somewhere you’d be less likely to watch.","cta":"Done","ctaBottom":48},
  "SOS-Feel-Turned-On": {"kind":"feeling","kicker":"How you feel","hero":"umbrella","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Let it pass.","body":"You don’t have to do anything with the feeling. Stay away from anything that makes it stronger.","cta":"Done","ctaBottom":96,"another":true},
  "SOS-Feel-Bored": {"kind":"feeling","kicker":"How you feel","hero":"stairs","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Do something physical.","body":"Walk, train, take the stairs, or do a short set of something. Get moving for five minutes.","cta":"Done","ctaBottom":96,"another":true},
  "SOS-Feel-Lonely": {"kind":"feeling","kicker":"How you feel","hero":"envelope","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Talk to someone.","body":"Send one message or go somewhere you’re around other people.","cta":"Done","ctaBottom":96,"another":true},
  "SOS-Feel-Stressed": {"kind":"feeling","kicker":"How you feel","hero":"kettle","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Take ten minutes off.","body":"Step away from what’s stressing you without replacing it with porn or scrolling.","cta":"Done","ctaBottom":96,"another":true},
  "SOS-Feel-Anxious": {"kind":"feeling","kicker":"How you feel","hero":"clock","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Give yourself one job.","body":"Pick one simple thing to do for the next five minutes and keep your attention there.","cta":"Done","ctaBottom":96,"another":true},
  "SOS-Feel-Angry": {"kind":"feeling","kicker":"How you feel","hero":"mountain","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Use the energy.","body":"Walk fast, train, or do a hard set of something before you open another app or send a message.","cta":"Done","ctaBottom":96,"another":true},
  "SOS-Feel-Low": {"kind":"feeling","kicker":"How you feel","hero":"lamp","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Get out of the room.","body":"Change clothes, shower, walk, or sit somewhere brighter. Don’t stay where you usually watch.","cta":"Done","ctaBottom":96,"another":true},
  "SOS-Feel-Rejected": {"kind":"feeling","kicker":"How you feel","hero":"phoneTable","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Leave it alone\nfor ten minutes.","body":"Don’t check their profile or messages. Give yourself ten minutes with no new information.","cta":"Done","ctaBottom":96,"another":true},
  "SOS-Feel-Tired": {"kind":"feeling","kicker":"How you feel","hero":"nightPhone","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Make tonight easier.","body":"Put the phone away, leave the risky room, and start getting ready to sleep.","cta":"Done","ctaBottom":96,"another":true},
  "SOS-Feel-Restless": {"kind":"feeling","kicker":"How you feel","hero":"sneaker","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Move.","body":"Walk, take the stairs, stretch, or train until the restless feeling comes down.","cta":"Done","ctaBottom":96,"another":true},
  "SOS-Feel-Numb": {"kind":"feeling","kicker":"How you feel","hero":"shower","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Wake yourself up.","body":"Wash your face, go for a walk, change rooms, or put some music on and move.","cta":"Done","ctaBottom":96,"another":true},
  "SOS-Feel-Ashamed": {"kind":"feeling","kicker":"How you feel","hero":"mirror","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Stop punishing yourself.","body":"Put the phone away and do the next useful thing. Thinking about how bad you feel can wait.","cta":"Done","ctaBottom":96,"another":true},
  "SOS-Feel-Unknown": {"kind":"feeling","kicker":"How you feel","hero":"door","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Move first.","body":"You don’t need to know why right now. Change\nrooms and put some distance between you and\nthe phone.","cta":"Done","ctaBottom":96,"another":true},
  "SOS-Trig-Content": {"kind":"trigger","kicker":"What set it off","hero":"tab","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Close it.","body":"Don’t look again to see if the urge is still there. Close it and leave it closed.","cta":"Continue","ctaBottom":48},
  "SOS-Trig-Doomscroll": {"kind":"trigger","kicker":"What set it off","hero":"feedOff","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Get off the feed.","body":"Close the app for 15 minutes. Don’t replace one feed with another.","cta":"Continue","ctaBottom":48},
  "SOS-Trig-Fantasy": {"kind":"trigger","kicker":"What set it off","hero":"balloon","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Stop adding to it.","body":"Don’t keep the thought going. Get up and do something that needs your attention.","cta":"Continue","ctaBottom":48},
  "SOS-Trig-Late-Phone": {"kind":"trigger","kicker":"What set it off","hero":"charger","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Put the phone away.","body":"Charge it away from the bed and leave it there for the next 15 minutes.","cta":"Continue","ctaBottom":48},
  "SOS-Trig-Habit": {"kind":"trigger","kicker":"What set it off","hero":"signpost","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Change what\nhappens next.","body":"Do something different from what you normally do right before you watch.","cta":"Continue","ctaBottom":48},
  "SOS-Trig-Cant-Sleep": {"kind":"trigger","kicker":"What set it off","hero":"bed","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Get out of bed.","body":"Leave the bed for a few minutes. Keep the lights low and stay off feeds.","cta":"Done","ctaBottom":48},
  "SOS-Trig-Argument": {"kind":"trigger","kicker":"What set it off","hero":"bubbles","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Don’t reply yet.","body":"Stop rereading the messages. Give yourself ten minutes before you respond.","cta":"Continue","ctaBottom":48},
  "SOS-Trig-Rejection": {"kind":"trigger","kicker":"What set it off","hero":"phoneTable","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Stop checking.","body":"No profile checks, message refreshes, or looking for something else to numb it.","cta":"Continue","ctaBottom":48},
  "SOS-Trig-Alone": {"kind":"trigger","kicker":"What set it off","hero":"openDoor","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Leave the room.","body":"Move somewhere less private. If it’s safe, go somewhere other people are around.","cta":"Done","ctaBottom":48},
  "SOS-Trig-Unknown": {"kind":"trigger","kicker":"What set it off","hero":"phoneTable","heroTop":190,"heroScale":1.1,"stackTop":452,"titleSize":30,"title":"Put the phone down.","body":"Move somewhere different and keep the phone out of reach for ten minutes.","cta":"Done","ctaBottom":48},
  "SOS-Challenge": {"kind":"challenge","nav":{"back":true,"step":7,"of":8},"hero":"twoCups","heroTop":111,"heroScale":1.1,"stackTop":372,"titleSize":26,"title":"Break the isolation.","body":"Being alone makes quick comfort look worth more than it is.","challengeLabel":"The challenge","challenge":"Send one message, or go stand where other people are for ten minutes.","cta":"Done","ctaBottom":96,"another":true},
};

export function isSosBoardKey(key: string | undefined): key is SosBoardKey {
  return key != null && Object.prototype.hasOwnProperty.call(SOS_RESPONSES, key);
}
