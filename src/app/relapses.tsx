import { useRouter } from 'expo-router';
import { useState } from 'react';

import { LoadingView } from '@/components/mono';
import { RelapseLog } from '@/components/slip/relapse';
import { useEvents } from '@/lib/backend';

/**
 * `05 · Back in the app` (`Vici UI 2/project/Vici Relapse.dc.html`): every
 * relapse logged, newest first. A row reopens the entry in the relapse flow;
 * "Log a relapse" starts a new one. Where the relapse flow's Done goes.
 */
export default function Relapses() {
  const router = useRouter();
  const events = useEvents();
  const [now] = useState(() => Date.now());
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));
  if (events === undefined) return <LoadingView onBack={close} />;
  const lapses = events.filter((e) => e.type === 'lapse').sort((a, b) => b.createdAt - a.createdAt);
  return <RelapseLog entries={lapses} now={now} onOpen={(e) => router.push({ pathname: '/slip', params: { entry: e._id } })} onNew={() => router.push('/slip')} />;
}
