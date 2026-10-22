import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { LoadingView } from '@/components/mono';
import { draftFromRecord, readRelapseHistory, recordOf, RelapseFlow, writeRelapseHistory, type RelapseHistory } from '@/components/slip/relapse';
import { RELAPSE_CAUSES } from '@/content/relapse.data';
import { ACCOUNT_KEYS, writeAccountJSON } from '@/lib/accountState';
import { useCreateEvent, useEvents, useLessonProgressMap, useUpdateEvent } from '@/lib/backend';
import type { RelapseRecord } from '@/lib/types';
import { endUrgeInSlip } from '@/lib/urgeSession';

const CAUSE_LABEL: Record<string, string> = Object.fromEntries(RELAPSE_CAUSES.map(([k, l]) => [k, l]));

/** What the rest of the app reads from a lapse: the moment, and what led up to it as words (`' · '`, as the logs join them). */
function filed(record: RelapseRecord) {
  const reasons = record.causes.filter((k) => k !== 'notsure').map((k) => CAUSE_LABEL[k]);
  return { trigger: reasons.length ? reasons.join(' · ') : undefined, precedingState: reasons.length ? { reasons } : undefined };
}

/**
 * The relapse flow (`Vici UI 2/project/Vici Relapse.dc.html`): "A relapse" on
 * the SOS chooser and the log chooser open it; `?entry=<id>` reopens a saved
 * entry from the relapse log. Done goes on to the log (`/relapses`).
 *
 * The entry is written when "What led up to it?" is saved, as the canvas
 * saves it, and changed in place after that (`events:update`). Logging a
 * relapse ends any urge in progress and queues the post-slip letter, as the
 * old post-slip flow did.
 *
 * One route with four pages, so the swipe-back is off and Android's back steps
 * back a page (F2, D462).
 */
export default function Slip() {
  const router = useRouter();
  const { entry } = useLocalSearchParams<{ entry?: string }>();
  const events = useEvents();
  const progress = useLessonProgressMap();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const [now] = useState(() => Date.now());
  const [history, setHistory] = useState<RelapseHistory | null>(null);

  useEffect(() => {
    void readRelapseHistory().then(setHistory);
  }, []);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));
  if (!history || events === undefined || (entry && !events)) return <LoadingView onBack={close} />;

  const reopened = entry ? events.find((e) => e._id === entry && e.type === 'lapse') : undefined;
  const practice = Object.values(progress ?? {}).some((p) => p.status === 'completed' || p.completedAt != null);

  return (
    <>
      <Stack.Screen options={{ gestureEnabled: false }} />
      <RelapseFlow
        now={now}
        // "Are you trying to sleep?" is asked in the SOS, not here, and the
        // onboarding answer about earlier attempts is not kept (D17)
        ctx={{ hour: new Date(now).getHours(), goal: 'unknown', practice, attempts: false }}
        history={history}
        onHistory={(h) => {
          setHistory(h);
          void writeRelapseHistory(h);
        }}
        initial={reopened ? { draft: draftFromRecord(recordOf(reopened), now), saved: { id: reopened._id, record: recordOf(reopened), createdAt: reopened.createdAt } } : undefined}
        store={{
          create: async (record, createdAt) => {
            void endUrgeInSlip();
            const id = await createEvent({ type: 'lapse', createdAt, relapse: record, ...filed(record) });
            // the sealed letter arrives over Today the launch after a relapse is logged
            await writeAccountJSON(ACCOUNT_KEYS.letterPending, Date.now());
            return id ?? undefined;
          },
          update: async (id, record, createdAt) => {
            await updateEvent(id, { createdAt, relapse: record, ...filed(record) });
          },
        }}
        onExit={() => router.replace('/relapses')}
        onClose={close}
      />
    </>
  );
}
