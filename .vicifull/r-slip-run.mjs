/* Capture every slip recipe on both sides with the r-slip- sig prefix, then
   sigdiff. Independent of audit.mjs's own au- captures so two agents do not
   overwrite each other's PNGs. Usage: node .vicifull/r-slip-run.mjs [frameSubstr] */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const map = JSON.parse(fs.readFileSync('.vicifull/map.json','utf8'));
const byLabel = new Map(map.map(r=>[r.label,r]));
const list = JSON.parse(fs.readFileSync('.vicifull/recipes/slip.json','utf8')).filter(r=>r.frame && byLabel.has(r.frame));
const only = process.argv[2];
const sh=(c,a)=>{try{return{ok:true,out:execFileSync(c,a,{encoding:'utf8',maxBuffer:1<<26})};}catch(e){return{ok:false,out:(e.stdout??'')+(e.stderr??'')};}};
for (const r of list) {
  if (only && !r.frame.includes(only)) continue;
  const f = byLabel.get(r.frame);
  const slug = r.frame.replace(/[^A-Za-z0-9]+/g,'-');
  const d=`r-slip-d-${slug}`, a=`r-slip-a-${slug}`;
  const dr = sh('node',['scripts/vicifull/shot.mjs','design','Email-Login',f.file,`.vicifull/shots/${d}.png`,`--sig=${d}`]);
  const av=['scripts/vicifull/shot.mjs','app',r.route,`.vicifull/shots/${a}.png`,`--sig=${a}`,`--wait=${r.wait??1600}`];
  if(r.initseed) av.push(`--initseed=${r.initseed}`);
  if(r.do) av.push(`--do=${r.do}`);
  if(r.script) av.push(`--script=${r.script}`);
  if(r.settle!=null) av.push(`--settle=${r.settle}`);
  const ar = sh('node',av);
  if(!dr.ok||!ar.ok){ console.log(`${r.frame}\tCAPTURE FAILED\t${(dr.out+ar.out).slice(-200).replace(/\n/g,' ')}`); continue; }
  const df = sh('node',['scripts/vicifull/sigdiff.mjs',d,a,...(r.data?['--data']:[])]);
  const tail = df.out.trim().split('\n').pop()??'';
  fs.writeFileSync(`.vicifull/shots/${a}.sigdiff.txt`, df.out);
  console.log(`${r.frame}\t${tail}`);
}
