/**
 * Offering metadata, read defensively.
 *
 * RevenueCat lets an offering carry arbitrary JSON, and the guidance for
 * displaying products is to keep the paywall's strings out of the binary so a
 * headline, a benefit list or a call to action can be changed — or A/B tested —
 * from the dashboard. Every key is optional: the paywall falls back to the copy
 * the canvas gives it, so an offering with no metadata at all renders the
 * drawn paywall's words.
 *
 * The dashboard shape (Offerings → default → Metadata):
 *
 *   {
 *     "eyebrow": "UNLIMITED",
 *     "headline": "Take your life back.",
 *     "benefits_title": "What you get",
 *     "benefits": ["12-week\nplan", "SOS\nhelp", "Weekly\ninsights", "Progress\ntracking"],
 *     "cta": "Continue",
 *     "footnote": "Terms · Restore",
 *     "default_package": "$rc_annual",
 *     "badges": { "$rc_annual": "Best value" }
 *   }
 *
 * `benefits` relabels the four drawn discs and is read only when it carries
 * exactly four entries — the discs are artwork, so the dashboard can rename
 * them but cannot add a fifth.
 */

import type { PurchasesOffering } from 'react-native-purchases';

export interface OfferingCopy {
  eyebrow: string | null;
  headline: string | null;
  benefitsTitle: string | null;
  benefits: string[] | null;
  cta: string | null;
  footnote: string | null;
  /** Package identifier to select when the paywall opens. */
  defaultPackage: string | null;
  /** Package identifier → the badge beside its name. */
  badges: Record<string, string>;
}

const EMPTY: OfferingCopy = {
  eyebrow: null,
  headline: null,
  benefitsTitle: null,
  benefits: null,
  cta: null,
  footnote: null,
  defaultPackage: null,
  badges: {},
};

function str(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function strings(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const out = value.map(str).filter((s): s is string => !!s);
  return out.length ? out : null;
}

function record(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const out: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    const text = str(raw);
    if (text) out[key] = text;
  }
  return out;
}

export function offeringCopy(offering: PurchasesOffering | null): OfferingCopy {
  const m = offering?.metadata;
  if (!m) return EMPTY;
  return {
    eyebrow: str(m.eyebrow),
    headline: str(m.headline),
    benefitsTitle: str(m.benefits_title),
    benefits: strings(m.benefits),
    cta: str(m.cta),
    footnote: str(m.footnote),
    defaultPackage: str(m.default_package),
    badges: record(m.badges),
  };
}
