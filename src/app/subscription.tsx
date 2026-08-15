import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { AppText, Grain, PressScale } from '@/components/ui';
import { useCurrentUser } from '@/lib/backend';
import { sans } from '@/lib/theme';

/**
 * 15 · Manage subscription — the membership stated plainly up top
 * (plan · price · renewal · Active), then the Plan and Billing cards, and the
 * quiet cancel the board now ends on. `UI Final` withdrew the swell and the
 * line under it; nothing renders below the cancel any more.
 *
 * Laid out from the canvas's 393 × 852 frame; the status bar ends at 54, so
 * every canvas `top` is written here as `top − 54` under the safe area.
 */

const noiseDark = require('../../assets/images/noise-dark.png');

const CHEVRON = 'M1.5 1.5 6 7l-4.5 5.5';

function RowChevron() {
  return (
    <Svg width={7} height={12} viewBox="0 0 8 14">
      <Path d={CHEVRON} stroke="rgba(0,0,0,0.28)" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** A row inside one of the two cards: 32pt inset chip, label, optional value. */
function Row({ icon, title, detail, last, onPress }: { icon: ReactNode; title: string; detail?: string; last?: boolean; onPress?: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13, borderBottomWidth: last ? 0 : 1, borderBottomColor: 'rgba(0,0,0,0.06)' }}>
      <View style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: '#F1EFE9', alignItems: 'center', justifyContent: 'center' }}>{icon}</View>
      <AppText style={[sans('500'), { flex: 1, fontSize: 15, color: '#1D1C1A' }]}>{title}</AppText>
      {detail ? <AppText style={[sans('400'), { fontSize: 13.5, color: '#8B8882' }]}>{detail}</AppText> : null}
      <RowChevron />
    </PressScale>
  );
}

function GroupLabel({ text, top }: { text: string; top: number }) {
  return <AppText style={[sans('600'), { position: 'absolute', left: 28, top, fontSize: 12.5, color: '#8B8882' }]}>{text}</AppText>;
}

function Card({ top, children }: { top: number; children: ReactNode }) {
  return (
    <View
      style={{
        position: 'absolute',
        left: 24,
        right: 24,
        top,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.09)',
        paddingVertical: 4,
        paddingHorizontal: 20,
      }}>
      {children}
    </View>
  );
}

const ICON = {
  plan: (
    <Svg width={19} height={19} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={9} stroke="#1D1C1A" strokeWidth={1.9} fill="none" />
      <Path d="M15.5 8.5l-2 5-5 2 2-5z" fill="#1D1C1A" />
    </Svg>
  ),
  code: (
    <Svg width={19} height={19} viewBox="0 0 24 24">
      <Rect x={3.5} y={8} width={17} height={4} rx={1} stroke="#1D1C1A" strokeWidth={1.9} fill="none" />
      <Path
        d="M5 12v7.5h14V12M12 8v11.5M12 8c-4 0-5.5-1.6-5.5-3a2 2 0 0 1 3.6-1.2C11.2 5 12 8 12 8zm0 0c4 0 5.5-1.6 5.5-3a2 2 0 0 0-3.6-1.2C12.8 5 12 8 12 8z"
        stroke="#1D1C1A"
        strokeWidth={1.9}
        fill="none"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  restore: (
    <Svg width={19} height={19} viewBox="0 0 24 24">
      <Path d="M4.5 12a7.5 7.5 0 1 1 2.2 5.3M4.5 12V7.5M4.5 12H9" stroke="#1D1C1A" strokeWidth={1.9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  card: (
    <Svg width={19} height={19} viewBox="0 0 24 24">
      <Rect x={3} y={5.5} width={18} height={13} rx={2.4} stroke="#1D1C1A" strokeWidth={1.9} fill="none" />
      <Path d="M3 9.5h18" stroke="#1D1C1A" strokeWidth={1.9} />
    </Svg>
  ),
  receipts: (
    <Svg width={19} height={19} viewBox="0 0 24 24">
      <Path d="M6 3.5h8l4 4v13H6z" stroke="#1D1C1A" strokeWidth={1.9} fill="none" strokeLinejoin="round" />
      <Path d="M9 12h6M9 15.5h6" stroke="#1D1C1A" strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  ),
};

export default function Subscription() {
  const router = useRouter();
  const user = useCurrentUser();
  const premium = !!user?.settings.premium;
  const drop = !!user?.settings.yearlyDrop;
  const price = drop ? '$26.99' : '$39.99';
  const renews = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  })();
  const back = () => (router.canGoBack() ? router.back() : router.replace('/(app)/settings'));

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <StatusBar style="dark" />
      <Grain source={noiseDark} opacity={0.07} />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ height: 700 }} showsVerticalScrollIndicator={false}>
          <PressScale
            onPress={back}
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={{ top: 14, bottom: 14, left: 16, right: 16 }}
            style={{ position: 'absolute', left: 16, top: 10, minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
            <Svg width={11} height={19} viewBox="0 0 11 19">
              <Path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke="#55534E" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <AppText style={[sans('400'), { fontSize: 17, color: '#55534E' }]}>Back</AppText>
          </PressScale>

          <AppText style={[sans('600'), { position: 'absolute', left: 24, top: 68, fontSize: 27, letterSpacing: -0.2, color: '#1D1C1A' }]}>Subscription</AppText>

          {/* the membership, stated rather than boxed */}
          <View style={{ position: 'absolute', left: 24, right: 24, top: 150 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <View>
                <AppText style={[sans('600'), { fontSize: 24, letterSpacing: -0.2, color: '#1D1C1A' }]}>{premium ? 'Yearly' : 'Free tools'}</AppText>
                <AppText style={[sans('400'), { marginTop: 5, fontSize: 14, color: '#55534E' }]}>
                  {premium ? `${price} / year · renews ${renews}` : 'Core tools included'}
                </AppText>
              </View>
              <View style={{ backgroundColor: '#131313', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 7, marginTop: 3 }}>
                <AppText style={[sans('600'), { fontSize: 12.5, color: '#F4F3F0' }]}>{premium ? 'Active' : 'Free'}</AppText>
              </View>
            </View>
            {premium ? (
              <>
                <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.09)', marginTop: 18, marginBottom: 14 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <AppText style={[sans('400'), { fontSize: 14, color: '#55534E' }]}>Next charge</AppText>
                  <AppText style={[sans('500'), { fontSize: 14, color: '#1D1C1A' }]}>
                    {price} on {renews}
                  </AppText>
                </View>
              </>
            ) : null}
          </View>

          <GroupLabel text="Plan" top={276} />
          <Card top={298}>
            <Row icon={ICON.plan} title="Change plan" detail={premium ? `Yearly · ${price}` : 'Free'} onPress={() => router.push('/paywall')} />
            <Row icon={ICON.code} title="Redeem a code" />
            <Row icon={ICON.restore} title="Restore purchases" last />
          </Card>

          <GroupLabel text="Billing" top={490} />
          <Card top={512}>
            <Row icon={ICON.card} title="Payment method" detail="Apple ID" />
            <Row icon={ICON.receipts} title="Receipts & invoices" last />
          </Card>

          {premium ? (
            <AppText center style={[sans('500'), { position: 'absolute', left: 0, right: 0, top: 658, fontSize: 15, color: '#8B8882' }]}>
              Cancel subscription
            </AppText>
          ) : null}

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
