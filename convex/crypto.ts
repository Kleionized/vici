/**
 * Field-level encryption at rest for the sensitive things people write here —
 * journal entries, what fed an urge, the notes on a slip, reflections, the why.
 *
 * AES-256-GCM with a key held only in the deployment's environment
 * (`DATA_ENCRYPTION_KEY`, 32 random bytes, base64). A database export, a
 * backup, a log line or a teammate browsing the dashboard sees `enc:v1:…`, not
 * the words. (It is not end-to-end: the functions that serve the app can read
 * the data, which is what lets the same account work on a new phone.)
 *
 * Design notes:
 * - **Synthetic IV.** Queries and mutations run with seeded randomness, and a
 *   mutation that loses an optimistic-concurrency race is re-run. A GCM nonce
 *   reused with different plaintext is catastrophic, so the nonce is not taken
 *   from the RNG alone: it is HMAC(nonceKey, context ‖ plaintext ‖ random)
 *   truncated to 96 bits. Different plaintext → different nonce, whatever the
 *   RNG does; the same plaintext under the same nonce reveals only equality.
 * - **Bound to its place.** The table, field and owner are the GCM additional
 *   data, so a ciphertext copied onto another user's row, or into another
 *   field, does not decrypt.
 * - **Gradual.** A value without the `enc:v1:` prefix is legacy plaintext and is
 *   returned as is; it is sealed the next time it is written (or by
 *   `migrations:encryptExisting`). With no key configured the module stores
 *   plaintext and says so once in the logs, so a fresh dev deployment works
 *   before the key is set.
 * - **Rotation.** `DATA_ENCRYPTION_KEY_PREVIOUS` (optional) is tried when the
 *   current key fails, so a key can be rotated and the data re-sealed lazily.
 */

const PREFIX = 'enc:v1:';
const IV_BYTES = 12;

type Keys = { enc: CryptoKey; nonce: CryptoKey; previous?: CryptoKey };

let cached: { raw: string; prev: string; keys: Keys | null } | null = null;
let warned = false;

function b64ToBytes(b64: string): Uint8Array {
  const clean = b64.replace(/-/g, '+').replace(/_/g, '/');
  const pad = clean.length % 4 === 0 ? clean : clean + '='.repeat(4 - (clean.length % 4));
  const bin = atob(pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToB64(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const utf8 = new TextEncoder();
const fromUtf8 = new TextDecoder();

/** Copy into a fresh ArrayBuffer-backed view, as Web Crypto's types want. */
function buf(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(new ArrayBuffer(bytes.length));
  out.set(bytes);
  return out;
}

async function deriveKeys(raw: string): Promise<{ enc: CryptoKey; nonce: CryptoKey }> {
  const master = b64ToBytes(raw);
  if (master.length !== 32) throw new Error('DATA_ENCRYPTION_KEY must be 32 bytes, base64-encoded');
  const hkdf = await crypto.subtle.importKey('raw', buf(master), 'HKDF', false, ['deriveKey']);
  const params = (info: string) => ({ name: 'HKDF', hash: 'SHA-256', salt: buf(utf8.encode('tideline.fields')), info: buf(utf8.encode(info)) });
  const enc = await crypto.subtle.deriveKey(params('aes-gcm.v1'), hkdf, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  const nonce = await crypto.subtle.deriveKey(params('siv-nonce.v1'), hkdf, { name: 'HMAC', hash: 'SHA-256', length: 256 }, false, ['sign']);
  return { enc, nonce };
}

async function keys(): Promise<Keys | null> {
  const raw = (process.env.DATA_ENCRYPTION_KEY ?? '').trim();
  const prev = (process.env.DATA_ENCRYPTION_KEY_PREVIOUS ?? '').trim();
  if (cached && cached.raw === raw && cached.prev === prev) return cached.keys;
  if (!raw) {
    if (!warned) {
      warned = true;
      console.warn('DATA_ENCRYPTION_KEY is not set: sensitive fields are being stored as plaintext. Set it with `npx convex env set DATA_ENCRYPTION_KEY <32 random bytes, base64>`.');
    }
    cached = { raw, prev, keys: null };
    return null;
  }
  const current = await deriveKeys(raw);
  const previous = prev ? (await deriveKeys(prev)).enc : undefined;
  cached = { raw, prev, keys: { ...current, previous } };
  return cached.keys;
}

/** Whether encryption is configured on this deployment. */
export async function encryptionEnabled(): Promise<boolean> {
  return (await keys()) != null;
}

/** Where a value lives: table, field and owner. Bound into the ciphertext. */
export type FieldContext = { table: string; field: string; userId: string };

const aad = (c: FieldContext) => utf8.encode(`${c.table}\u0000${c.field}\u0000${c.userId}`);

export function isSealed(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith(PREFIX);
}

/** Seal one string. Empty strings are left empty (nothing to hide, and `''` checks keep working). */
export async function seal(value: string, ctx: FieldContext): Promise<string> {
  if (value === '' || isSealed(value)) return value;
  const k = await keys();
  if (!k) return value;
  const plain = utf8.encode(value);
  const extra = aad(ctx);
  const random = crypto.getRandomValues(new Uint8Array(16));
  const material = new Uint8Array(extra.length + 1 + plain.length + random.length);
  material.set(extra, 0);
  material.set(plain, extra.length + 1);
  material.set(random, extra.length + 1 + plain.length);
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', k.nonce, buf(material)));
  const iv = mac.slice(0, IV_BYTES);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: buf(iv), additionalData: buf(extra) }, k.enc, buf(plain)));
  const out = new Uint8Array(iv.length + ct.length);
  out.set(iv, 0);
  out.set(ct, iv.length);
  return PREFIX + bytesToB64(out);
}

/**
 * Open one string. Legacy plaintext comes back unchanged. A value that cannot
 * be opened (wrong key, tampered, moved) comes back as `''` and is logged — one
 * unreadable field must not take the whole screen down with a thrown query.
 */
export async function open(value: string, ctx: FieldContext): Promise<string> {
  if (!isSealed(value)) return value;
  const k = await keys();
  if (!k) {
    console.error(`Sealed ${ctx.table}.${ctx.field} found but DATA_ENCRYPTION_KEY is not set`);
    return '';
  }
  const bytes = b64ToBytes(value.slice(PREFIX.length));
  const iv = bytes.slice(0, IV_BYTES);
  const ct = bytes.slice(IV_BYTES);
  const extra = aad(ctx);
  for (const key of [k.enc, k.previous]) {
    if (!key) continue;
    try {
      const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: buf(iv), additionalData: buf(extra) }, key, buf(ct));
      return fromUtf8.decode(plain);
    } catch {
      // try the previous key, if any
    }
  }
  console.error(`Could not open ${ctx.table}.${ctx.field} — wrong key or tampered value`);
  return '';
}

// ── conveniences for the shapes the schema uses ─────────────────────

export async function sealOpt(value: string | undefined, ctx: FieldContext): Promise<string | undefined> {
  return value === undefined ? undefined : seal(value, ctx);
}

export async function openOpt(value: string | undefined, ctx: FieldContext): Promise<string | undefined> {
  return value === undefined ? undefined : open(value, ctx);
}

export async function sealList(values: string[] | undefined, ctx: FieldContext): Promise<string[] | undefined> {
  return values === undefined ? undefined : Promise.all(values.map((v) => seal(v, ctx)));
}

export async function openList(values: string[] | undefined, ctx: FieldContext): Promise<string[] | undefined> {
  return values === undefined ? undefined : Promise.all(values.map((v) => open(v, ctx)));
}

/** Answers keep their numbers as numbers; strings are sealed under their own key. */
export async function sealAnswers(answers: Record<string, string | number>, ctx: FieldContext): Promise<Record<string, string | number>> {
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(answers)) out[k] = typeof v === 'string' ? await seal(v, { ...ctx, field: `${ctx.field}.${k}` }) : v;
  return out;
}

export async function openAnswers(answers: Record<string, string | number>, ctx: FieldContext): Promise<Record<string, string | number>> {
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(answers)) out[k] = typeof v === 'string' ? await open(v, { ...ctx, field: `${ctx.field}.${k}` }) : v;
  return out;
}
