// Checks the owner's morning notes and letters, and the rules that choose them,
// against the documents' "send when" notes (scripts/content/post-check.ts).
// Bundles the real src/lib/viciPost.ts and content with esbuild; the app's
// packages and the rest of the app are stubbed, since the rules use none of
// them.
//
//   node scripts/content/check-post.mjs
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';

const root = process.cwd();
const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'post-check-')), 'post-check.mjs');
await build({
  entryPoints: [path.join(root, 'scripts/content/post-check.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: out,
  logLevel: 'error',
  plugins: [
    {
      name: 'app',
      setup(b) {
        // the content and the pure modules the rules are made of are real; the rest of the app is not loaded
        const REAL = /^@\/(content\/|lib\/(viciPost|day|date|types)$)/;
        b.onResolve({ filter: /^@\// }, async (a) =>
          REAL.test(a.path)
            ? b.resolve('./' + path.relative(a.resolveDir, path.join(root, 'src', a.path.slice(2))), { resolveDir: a.resolveDir, kind: a.kind })
            : { path: a.path, namespace: 'stub' },
        );
        // every package the app imports is an inert stand-in here
        b.onResolve({ filter: /^[^./]/ }, (a) => ({ path: a.path, namespace: 'stub' }));
        b.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({
          contents: 'const s = new Proxy(function () {}, { get: (_t, k) => (k === "__esModule" ? true : s), apply: () => s, construct: () => s }); module.exports = s;',
          loader: 'js',
        }));
      },
    },
  ],
});
await import(pathToFileURL(out).href);
