import { UrgeFlow } from '@/components/urge';

/**
 * The First 90 Seconds — canvas 145 → 151, handing off to the SOS at 138 → 141.
 *
 * The whole flow lives in the urge kit because two doors open onto it: the
 * pinned urge bar (`/urge`) and the Rough Days library (`/rough-first90`).
 */
export default function Urge() {
  return <UrgeFlow />;
}
