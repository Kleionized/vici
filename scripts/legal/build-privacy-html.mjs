#!/usr/bin/env node
/**
 * Build the hostable privacy policy page from the text the app shows
 * (src/content/privacyPolicy.json), so the two never drift (D521).
 *
 *   node scripts/legal/build-privacy-html.mjs [--email=privacy@example.com]
 *
 * Writes legal/privacy-policy.html: one self-contained page (no external
 * assets) to host anywhere, then put its https address in App Store Connect,
 * Google Play and, optionally, EXPO_PUBLIC_PRIVACY_URL. The contact line uses
 * --email, else EXPO_PUBLIC_PRIVACY_EMAIL, else the App Store support link.
 */
import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const email = (args.email ?? process.env.EXPO_PUBLIC_PRIVACY_EMAIL ?? '').trim();
const policy = JSON.parse(fs.readFileSync('src/content/privacyPolicy.json', 'utf8'));

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const contact = email
  ? `Questions about your privacy, or a request to use your rights: email <a href="mailto:${esc(email)}">${esc(email)}</a>.`
  : 'Questions about your privacy, or a request to use your rights: use the support link on VICI’s App Store page.';
const text = (s) => (s === '{contact}' ? contact : esc(s));

const sections = policy.sections
  .map((s) => {
    const paras = (s.paragraphs ?? []).map((p) => `      <p>${text(p)}</p>`).join('\n');
    const bullets = s.bullets?.length ? `      <ul>\n${s.bullets.map((b) => `        <li>${esc(b)}</li>`).join('\n')}\n      </ul>` : '';
    return `    <section>\n      <h2>${esc(s.heading)}</h2>\n${[paras, bullets].filter(Boolean).join('\n')}\n    </section>`;
  })
  .join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>VICI · ${esc(policy.title)}</title>
  <style>
    :root { --ground: #f7f6f2; --ink: #111111; --sub: #4a4741; --mute: #77736b; --rule: #dedbd3; }
    @media (prefers-color-scheme: dark) { :root { --ground: #0d0d0d; --ink: #f2f0ec; --sub: #b5b0a8; --mute: #9b968e; --rule: #2a2a2a; } }
    body { margin: 0; background: var(--ground); color: var(--sub); font: 17px/1.6 -apple-system, system-ui, "Lato", sans-serif; }
    main { max-width: 680px; margin: 0 auto; padding: 48px 20px 80px; }
    h1 { color: var(--ink); font-size: 32px; line-height: 1.2; margin: 0 0 8px; }
    .effective { color: var(--mute); font-size: 14px; font-weight: 700; letter-spacing: 0.2px; margin: 0 0 24px; }
    h2 { color: var(--ink); font-size: 19px; margin: 36px 0 10px; padding-top: 20px; border-top: 1px solid var(--rule); }
    p, li { margin: 0 0 12px; }
    ul { padding-left: 20px; margin: 0 0 12px; }
    a { color: var(--ink); }
  </style>
</head>
<body>
  <main>
    <h1>${esc(policy.title)}</h1>
    <p class="effective">VICI · Effective ${esc(policy.effective)}</p>
    <p>${esc(policy.intro)}</p>
${sections}
  </main>
</body>
</html>
`;

const out = path.join('legal', 'privacy-policy.html');
fs.mkdirSync('legal', { recursive: true });
fs.writeFileSync(out, html);
console.log(`wrote ${out}${email ? ` (contact ${email})` : ' (no contact email set: pass --email=…)'}`);
