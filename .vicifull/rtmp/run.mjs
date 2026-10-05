/* Recheck runner for GROUP sos: capture both sides of every recipe with a
   r-sos- sig prefix, sigdiff them, pixel-diff the PNGs. Own file so the
   shared .vicifull/audit/report.json race (concurrent --group runs) is not
   touched at all. */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const args = process.argv.slice(2);
const only = args.filter(a=>!a.startsWith('--'));
const map = JSON.parse(fs.readFileSync('.vicifull/map.json','utf8'));
const byLabel = new Map(map.map(r=>[r.label,r]));
const recipes = JSON.parse(fs.readFileSync('.vicifull/recipes/sos.json','utf8'));
const sh=(c,a)=>{try{return{ok:true,out:execFileSync(c,a,{encoding:'utf8',maxBuffer:1<<26,timeout:300000})};}catch(e){return{ok:false,out:((e.stdout??'')+(e.stderr??''))};}};
fs.mkdirSync('.vicifull/rtmp/shots',{recursive:true});
const out=[];
for (const r of recipes) {
  if (only.length && !only.some(o=>r.frame.includes(o))) continue;
  const f = byLabel.get(r.frame);
  const slug = r.frame.replace(/[^A-Za-z0-9]+/g,'-');
  const route = r.route ?? r.verifyRoute, wait = r.wait ?? r.verifyWait ?? 1600, script = r.script ?? r.verifyScript;
  if (!f) { out.push({frame:r.frame, status:'NOT-A-FRAME'}); console.log(`## ${r.frame}: not a bundle frame (behaviour check)`); continue; }
  if (r.unreachable && !r.verifyScript) { out.push({frame:r.frame,status:'UNREACHABLE'}); continue; }
  const d=`r-sos-d-${slug}`, a=`r-sos-a-${slug}`;
  const dp=`.vicifull/rtmp/shots/${d}.png`, ap=`.vicifull/rtmp/shots/${a}.png`;
  const dres = fs.existsSync(dp)&&!args.includes('--force') ? {ok:true,out:''} : sh('node',['scripts/vicifull/shot.mjs','design','Email-Login',f.file,dp,`--sig=${d}`]);
  const argv=['scripts/vicifull/shot.mjs','app',route,ap,`--sig=${a}`,`--wait=${wait}`];
  if (r.initseed) argv.push(`--initseed=${r.initseed}`);
  if (r.seed===true) argv.push('--seed');
  if (r.do) argv.push(`--do=${r.do}`);
  if (script) argv.push(`--script=${script}`);
  if (r.fast) argv.push('--fast');
  if (r.settle!=null) argv.push(`--settle=${r.settle}`);
  const ares = sh('node',argv);
  if(!dres.ok||!ares.ok){ console.log(`## ${r.frame}: CAPTURE FAILED\n${(dres.out+ares.out).slice(-500)}`); out.push({frame:r.frame,status:'CAPTURE FAILED'}); continue; }
  const sd = sh('node',['scripts/vicifull/sigdiff.mjs',d,a]);
  const tail = sd.out.trim().split('\n').pop()??'';
  const px = sh('node',['.vicifull/rtmp/r-sos-px.mjs',dp,ap,'6']);
  console.log(`## ${r.frame}\n  sig: ${tail}\n${px.out.trimEnd()}`);
  out.push({frame:r.frame,sig:tail,px:px.out.trim(),sigfull:sd.out});
}
fs.writeFileSync('.vicifull/rtmp/result.json',JSON.stringify(out,null,1));
