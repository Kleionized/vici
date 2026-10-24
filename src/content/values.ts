/**
 * The value words: the Life Map's own list, and the values board in onboarding
 * picks from the same twelve (D64).
 */
import type { GlyphName } from '@/components/mono/glyphs';

export const VALUE_WORDS = [
  'Connection',
  'Health',
  'Honesty',
  'Growth',
  'Creativity',
  'Presence',
  'Discipline',
  'Adventure',
  'Family',
  'Contribution',
  'Calm',
  'Courage',
];

/** Each value's pictogram on the values board (D67). */
export const VALUE_ICONS: Record<string, GlyphName> = {
  Connection: 'people',
  Health: 'heart',
  Honesty: 'checkCircle',
  Growth: 'leaf',
  Creativity: 'pencil',
  Presence: 'sun',
  Discipline: 'clock',
  Adventure: 'pin',
  Family: 'house',
  Contribution: 'star',
  Calm: 'waves',
  Courage: 'shield',
};
