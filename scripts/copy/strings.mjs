// Every user-facing string in the app, for a copy pass: JSX text and string
// literals that read as words (two or more, or a sentence), with file:line.
// Lessons, notification text and letter bodies are the owner's and are left out
// (.overhaul/voice/STYLE.md, "Out of scope").
//
//   node scripts/copy/strings.mjs > copy-strings.tsv
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const SKIP = [
  /^src\/dev\//, /\/lab\//, /^src\/content\/(lessons|curriculum84|wraps|heroes|sosViz|overviewArt)\.ts$/,
  /^src\/components\/lesson\//, /^src\/app\/lesson\//, /^src\/app\/task\//, /^src\/app\/lesson-card\//,
  /^src\/lib\/reminders\.ts$/, /^src\/content\/(morningNotes|viciLetters)\.ts$/, /\.test\.tsx?$/,
];
const files = [];
const walk = (d) => {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.tsx?$/.test(f) && !SKIP.some((r) => r.test(p))) files.push(p);
  }
};
walk('src');
const wordy = (s) => /[A-Za-z]{2}/.test(s) && (/\s/.test(s.trim()) || /[.?]$/.test(s.trim())) && !/^[./@#]|\.(png|ts|tsx|json)$|^\w+:\/\/|^[\w-]+\/[\w/-]+$/.test(s.trim()) && !/^[a-z]+([A-Z][a-z]+)+$/.test(s);
const out = [];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true, f.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const visit = (n) => {
    let text = null;
    if (ts.isJsxText(n)) text = n.getText().replace(/\s+/g, ' ').trim();
    else if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) {
      const p = n.parent;
      // not module paths, object keys, type names or style values
      if (ts.isImportDeclaration(p) || ts.isExportDeclaration(p) || (ts.isCallExpression(p) && /require|import/.test(p.expression.getText()))) text = null;
      else if (ts.isPropertyAssignment(p) && p.name === n) text = null;
      else if (ts.isLiteralTypeNode(p)) text = null;
      else text = n.text;
    } else if (ts.isTemplateExpression(n)) text = n.getText().slice(1, -1);
    if (text && wordy(text)) {
      const { line } = sf.getLineAndCharacterOfPosition(n.getStart());
      out.push(`${f}:${line + 1}\t${text.replace(/\n/g, '\\n')}`);
    }
    if (!ts.isTemplateExpression(n)) ts.forEachChild(n, visit);
  };
  visit(sf);
}
console.log(out.join('\n'));
