import { UrgeFlow } from '@/components/urge';

/**
 * The First 90 Seconds, reached from the Rough Days shelf. The canvas draws
 * one interrupt (28 → 33), so this door and the SOS tab's (`/urge`) open the
 * same flow rather than two that drift apart.
 */
export default function RoughFirst90() {
  return <UrgeFlow />;
}
