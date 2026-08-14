#!/usr/bin/env node
/**
 * Pretty-print a split design frame so line diffs are legible: one tag per line,
 * indented by depth, with inline `style="a; b; c"` exploded onto their own lines.
 *
 * Usage: node scripts/uifinal/pretty.mjs <frame.html>            # to stdout
 *        node scripts/uifinal/pretty.mjs <frame.html> <out.html> # to a file
 */
import fs from 'node:fs';

export function pretty(html) {
  // Split into tags and text runs.
  const parts = html.split(/(<[^>]*>)/g).filter((p) => p !== '');
  const out = [];
  let depth = 0;
  // Only tags that never carry an explicit close in this source. SVG children
  // (stop/path/rect/…) are always written `<rect …></rect>` on the canvas, so
  // treating them as void would unbalance the indentation.
  const VOID = new Set(['img', 'br', 'hr', 'input', 'meta', 'link', 'source']);
  for (const p of parts) {
    if (p.startsWith('</')) {
      depth = Math.max(0, depth - 1);
      out.push('  '.repeat(depth) + p);
    } else if (p.startsWith('<')) {
      const name = (p.match(/^<\s*([A-Za-z0-9-]+)/) || [])[1]?.toLowerCase();
      const selfClose = p.endsWith('/>') || VOID.has(name);
      const styleM = p.match(/\sstyle="([^"]*)"/);
      if (styleM && styleM[1].includes(';')) {
        const before = p.slice(0, styleM.index);
        const after = p.slice(styleM.index + styleM[0].length);
        const decls = styleM[1].split(';').map((d) => d.trim()).filter(Boolean);
        out.push('  '.repeat(depth) + before + ' style="');
        for (const d of decls) out.push('  '.repeat(depth + 1) + '| ' + d + ';');
        out.push('  '.repeat(depth) + '"' + after);
      } else {
        out.push('  '.repeat(depth) + p);
      }
      if (!selfClose && !p.startsWith('<!')) depth++;
    } else {
      const t = p.replace(/\s+/g, ' ').trim();
      if (t) out.push('  '.repeat(depth) + '· ' + t);
    }
  }
  return out.join('\n') + '\n';
}

const [, , input, output] = process.argv;
if (input) {
  const res = pretty(fs.readFileSync(input, 'utf8'));
  if (output) fs.writeFileSync(output, res);
  else process.stdout.write(res);
}
