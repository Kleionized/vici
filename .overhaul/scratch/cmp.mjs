import fs from 'node:fs';
const src = fs.readFileSync('src/content/curriculum84.ts', 'utf8');
const parts = src.split(/\n\s+day: (\d+),\n\s+week: \d+,/).slice(1);
for (let i = 0; i < parts.length; i += 2) {
  const day = parts[i], b = parts[i + 1];
  const title = b.match(/\btitle: "([^"]*)"/)?.[1];
  const card = b.match(/cardSummary: "([^"]*)"/)?.[1];
  const prac = b.match(/practice: \[\s*"([^"]*)"/)?.[1];
  console.log(`L${day} | ${title}\n   card: ${card}\n   task: ${(prac ?? '').slice(0, 170)}`);
}
