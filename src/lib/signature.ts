import { useEffect, useState } from 'react';

import { ACCOUNT_KEYS, readAccountJSON, writeAccountJSON } from '@/lib/accountState';

/**
 * The signature he draws with a finger (D68): on the vow in onboarding, the
 * morning pledge and re-signing the vow. The last one drawn is kept on this
 * phone under his account, and the vow and the urge hub's pledge show it in
 * place of his name in italics. `strokes` are SVG path data in the pad's own
 * points, `w` × `h`, so it draws at any size.
 */
export type Signature = { strokes: string[]; w: number; h: number; at?: number };

const listeners = new Set<(s: Signature | null) => void>();

export async function saveSignature(sig: Signature): Promise<void> {
  const kept = { ...sig, at: Date.now() };
  await writeAccountJSON(ACCOUNT_KEYS.signature, kept);
  listeners.forEach((l) => l(kept));
}

/** The kept signature: `undefined` while it is read, `null` when he has drawn none. */
export function useSignature(): Signature | null | undefined {
  const [sig, setSig] = useState<Signature | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    void readAccountJSON<Signature>(ACCOUNT_KEYS.signature).then((s) => {
      if (alive) setSig(s && Array.isArray(s.strokes) && s.strokes.length ? s : null);
    });
    listeners.add(setSig);
    return () => {
      alive = false;
      listeners.delete(setSig);
    };
  }, []);
  return sig;
}
