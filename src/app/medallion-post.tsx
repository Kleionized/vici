import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import { LaurelStrike, LetterBody, LetterFooter, LetterP, MailArrival, MailSheet, Salutation } from '@/app/letter';
import { AppText } from '@/components/ui';
import { useCreateJournalEntry, useCurrentUser } from '@/lib/backend';
import { setJSON } from '@/lib/storage';
import { fonts } from '@/lib/theme';

/**
 * The medallion post — canvas 110 → 173.
 *
 * A medallion struck in the night arrives the same way a letter does: the thing
 * itself on the lit field, then a short letter that says what it is for. The
 * canvas retired the whole three-act version of this screen — the breathing
 * envelope card, the medallion presented mid-letter, the enclosure drawn as a
 * black offer card — and left the arrival, the letter, and a way through to the
 * enclosure, which now lives on its own page.
 *
 * Both halves are the shared post furniture in `./letter`; only the object in
 * the 260 × 260 frame and the words are this screen's own.
 */

const POST_DONE_KEY = 'tideline.post.backondeck.delivered';

type Phase = 'arrive' | 'read';

export default function MedallionPost() {
  const router = useRouter();
  const user = useCurrentUser();
  const createJournalEntry = useCreateJournalEntry();
  const [phase, setPhase] = useState<Phase>('arrive');
  const name = (user?.displayName || '').trim().split(/\s+/)[0] || 'friend';

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  /** Put it on the shelf — the medallion is yours either way; the post is done. */
  const shelve = () => {
    void setJSON(POST_DONE_KEY, Date.now());
    close();
  };

  const keep = () => {
    void (async () => {
      await setJSON(POST_DONE_KEY, Date.now());
      await createJournalEntry({
        tag: 'Letter',
        title: 'VICI Post · A medallion',
        body: `Dear ${name},\n\nLast night an urge rose, crested, and left without you. This morning you opened the app anyway — logged it, stayed. Most men vanish for a week after a night like that. You came back.\n\nThe return is the strongest predictor there is — stronger than any count. This one isn't for resisting. It's for coming back.`,
      }).catch(() => {});
    })();
    close();
  };

  return (
    <View style={{ flex: 1, backgroundColor: phase === 'arrive' ? '#F6EEDD' : '#EDECE7' }}>
      <StatusBar style="dark" />

      {phase === 'arrive' ? (
        <MailArrival
          art={<MedallionArt />}
          // 90F re-cut the arrival: a warm gradient field with one halo instead
          // of the letter's two washes, an eyebrow, the medallion's own name at
          // 27/600, and a tier chip between the name and the story.
          field={['#F6EEDD', '#F0E1C2']}
          halo={[340, 70, '#E2BA78', 0.38, 0.74]}
          eyebrow="MEDALLION EARNED"
          artTop={86}
          title="Back on Deck"
          titleTop={378}
          titleStyle={{ fontSize: 27, fontWeight: '600', letterSpacing: -0.2 }}
          chip="Tier II · The Return"
          sub="Vici, tier II — five ridden. Each one shortens the next."
          subTop={476}
          primary="Take it"
          secondary="Put it on the shelf"
          onPrimary={() => setPhase('read')}
          onSecondary={shelve}
        />
      ) : (
        <MailSheet onClose={shelve}>
          <LetterBody>
            <Salutation>Dear {name},</Salutation>
            <LetterP>
              Last night an urge rose, crested, and left without you. This morning you opened the app anyway — logged it, stayed. Most men vanish for a week
              after a night like that. You came back.
            </LetterP>
            <LetterP>
              The return is the strongest predictor there is — stronger than any count. This one isn&rsquo;t for resisting. It&rsquo;s for coming back.
            </LetterP>
          </LetterBody>
          <LetterFooter primary="Tuck it into your Log" secondary="Open the enclosure" onPrimary={keep} onSecondary={() => router.push('/drop')} />
        </MailSheet>
      )}
    </View>
  );
}

/**
 * 110 · the medallion as an object — a 136pt gold disc struck with the laurel
 * and the numeral, tilted three degrees, lit from behind and casting a contact
 * shadow. Canvas frame 260 × 260.
 */
function MedallionArt() {
  return (
    <>
      {/* the canvas blurs the light (6px) and the shadow (6px); RN SVG has no blur
          filter, so both are redrawn as radials with the same falloff */}
      <Svg width={200} height={200} style={{ position: 'absolute', left: 30, top: 20 }}>
        <Defs>
          <RadialGradient id="md-glow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.55} />
            <Stop offset="0.74" stopColor="#E2BA78" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={100} cy={100} rx={100} ry={100} fill="url(#md-glow)" />
      </Svg>
      <Svg width={156} height={16} style={{ position: 'absolute', left: 52, top: 230 }}>
        <Defs>
          <RadialGradient id="md-shadow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#000000" stopOpacity={0.11} />
            <Stop offset="0.6" stopColor="#000000" stopOpacity={0.055} />
            <Stop offset="1" stopColor="#000000" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={78} cy={8} rx={78} ry={8} fill="url(#md-shadow)" />
      </Svg>

      <View
        style={{
          position: 'absolute',
          left: 62,
          top: 52,
          width: 136,
          height: 136,
          borderRadius: 68,
          boxShadow: 'inset 0 0 0 4px rgba(255,255,255,0.25), inset 0 -8px 18px rgba(120,88,40,0.28), 0 14px 30px rgba(180,140,70,0.45)',
          transform: [{ rotate: '-3deg' }],
          alignItems: 'center',
          justifyContent: 'center',
          gap: 7,
        }}>
        <Svg width={136} height={136} style={{ position: 'absolute', top: 0, left: 0 }}>
          <Defs>
            {/* `circle at 38% 30%` is farthest-corner by default: the far corner of a
                136 box sits 0.935 of it away, so the ramp runs to 93.5% */}
            <RadialGradient id="md-face" cx="38%" cy="30%" rx="93.5%" ry="93.5%">
              <Stop offset="0" stopColor="#F0DBB4" />
              <Stop offset="0.62" stopColor="#E2BA78" />
              <Stop offset="1" stopColor="#C99F5F" />
            </RadialGradient>
          </Defs>
          <Ellipse cx={68} cy={68} rx={68} ry={68} fill="url(#md-face)" />
        </Svg>

        {/* the engraved ring, 9 in from the rim */}
        <View
          pointerEvents="none"
          style={{ position: 'absolute', top: 9, left: 9, right: 9, bottom: 9, borderRadius: 59, boxShadow: 'inset 0 0 0 1.5px rgba(91,74,40,0.35)' }}
        />

        <LaurelStrike width={42} />
        <AppText style={{ fontFamily: fonts.quote, fontWeight: '600', fontSize: 17, letterSpacing: 3, color: '#5b4a28', opacity: 0.6, marginRight: -3 }}>
          V
        </AppText>
      </View>
    </>
  );
}
