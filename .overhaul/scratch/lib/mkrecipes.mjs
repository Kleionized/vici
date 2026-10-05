import fs from 'node:fs';
const W = [['I','Reset'],['II','Changing Your Mindset'],['III','In the Moment'],['IV','Know Your Brain'],['V','Why It Feels Worth It'],['VI','Discipline'],['VII','Relapse and Adversity'],['VIII','Boredom and Meaning'],['IX','Connection'],['X','Yourself'],['XI','Build a Life You Want'],['XII','Leave It Behind']];
const DO = 'const els=[...document.querySelectorAll("*")].filter(e=>{const cs=getComputedStyle(e);const r=e.getBoundingClientRect();return /(auto|scroll)/.test(cs.overflowY)&&e.scrollHeight>e.clientHeight+1&&r.height>100&&r.left>-1&&r.right<innerWidth+1});els.forEach(e=>e.scrollTop=e.scrollHeight);return els.map(e=>e.scrollTop)';
const out = [];
W.forEach(([r, name], i) => {
  const n = i + 1;
  out.push({ frame: `Week ${r} ${name}`, route: `/week/${n}`, initseed: '.overhaul/library-seed.js', wait: 2500,
    note: `Day-38 seed (lessons 01–37 done, 38 current, 39–84 upcoming — the state all 24 week pages draw). /week/${n} redirects to the Library tab turned to week ${r} (/library?week=${n}, D240). Rows viewport at scroll 0.` });
  out.push({ frame: `Week ${r} ${name} P2`, route: `/week/${n}`, initseed: '.overhaul/library-seed.js', do: DO, wait: 1200,
    note: 'Same page with the rows viewport (canvas 472–736) scrolled to its end, 264 = four rows, so rows 5–7 sit at 472/538/604. Not --scroll=end: the pager keeps the neighbouring week pages mounted, each with its own rows scroller, and --scroll picks the first; the `do` scrolls only the scrollers inside the viewport.' });
});
out.push({ frame: 'Library tab (current week)', route: '/library', initseed: '.overhaul/library-seed.js', wait: 2500, note: 'No ?week: the pager opens on the current week (day 38 → Week VI) — pixel-identical to Week VI Discipline.' });
fs.writeFileSync('.overhaul/recipes/library.json', JSON.stringify(out, null, 1) + '\n');
console.log(out.length);
