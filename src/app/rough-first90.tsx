import { UrgeFlow } from '@/components/urge';

/**
 * The First 90 Seconds, reached from the Rough Days library. The canvas draws
 * one interrupt (145 → 151), so this door and the pinned urge bar open the
 * same flow rather than two that drift apart.
 */
export default function RoughFirst90() {
  return <UrgeFlow />;
}
