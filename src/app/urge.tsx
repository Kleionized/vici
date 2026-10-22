import { Stack } from 'expo-router';

import { SosFlow } from '@/components/urge/sos';

/**
 * The SOS (`Vici UI 2/project/Vici SOS.dc.html`): "An urge" on the SOS
 * chooser (`/sos`) opens it, as do Rough Days' `/rough-first90` and Today's
 * urge card (`/urge-hub`).
 *
 * One route with ten boards inside it, so the swipe-back is off here: a swipe
 * meant for the hub's pages used to drop the user out of the SOS mid-urge
 * (F2, D462).
 */
export default function Urge() {
  return (
    <>
      <Stack.Screen options={{ gestureEnabled: false }} />
      <SosFlow />
    </>
  );
}
