/* Re-measure GROUP sos, pass 2. Captures both sides of every recipe, diffs the
 * layout signature AND the pixels, and writes one row per frame. The pixel diff
 * masks only the design's own clock strip (F49) — no gradient region, no band. */
import fs from 'node:fs'; import { execFileSync } from 'node:child_process';
const map = JSON.parse(fs.readFileSync('.vicifull/map.json','utf8'));
const byLabel = new Map(map.map(r=>[r.label,r]));
const recipes = JSON.parse(fs.readFileSync('.vicifull/recipes/sos.json','utf8'));
const only = process.argv.slice(2).filter(a=>!a.startsWith('--'));
const sh=(c,a)=>{try{return {ok:true,out:execFileSync(c,a,{encoding:'utf8',maxBuffer:1<<26,timeout:240000})};}
  catch(e){return {ok:false,out:(e.stdout??'')+(e.stderr??'')+(e.message??'')};}};
const OUT='.vicifull/vtmp/rsos'; fs.mkdirSync(OUT,{recursive:true});
const rows=[];
for(const r of recipes){
  if(only.length && !only.some(o=>r.frame.includes(o))) continue;
  if(r.unreachable && !process.argv.includes('--d038')) continue;
  const m=byLabel.get(r.frame);
  const slug=r.frame.replace(/[^A-Za-z0-9]+/g,'-');
  const route=r.route??r.verifyRoute, script=r.script??r.verifyScript, wait=r.wait??r.verifyWait??1400;
  if(!m && !r.frame.startsWith('Urge Hub —')){ rows.push({frame:r.frame,status:'NO MAP ROW'}); continue; }
  const dsig=`r-sos-d-${slug}`, asig=`r-sos-a-${slug}`;
  const dpng=`${OUT}/d-${slug}.png`, apng=`${OUT}/a-${slug}.png`;
  let dres={ok:true,out:''};
  if(m){ dres=sh('node',['scripts/vicifull/shot.mjs','design','Email-Login',m.file,dpng,`--sig=${dsig}`]); }
  const argv=['scripts/vicifull/shot.mjs','app',route,apng,`--sig=${asig}`,`--wait=${wait}`];
  if(r.initseed) argv.push(`--initseed=${r.initseed}`);
  if(r.seed===true) argv.push('--seed');
  if(r.do) argv.push(`--do=${r.do}`);
  if(script) argv.push(`--script=${script}`);
  if(r.settle!=null) argv.push(`--settle=${r.settle}`);
  const ares=sh('node',argv);
  if(!dres.ok||!ares.ok){ rows.push({frame:r.frame,status:'CAPTURE FAILED',note:(dres.out+ares.out).slice(-500)});
    console.log(`${r.frame}: CAPTURE FAILED`); continue; }
  let sig='', px='';
  if(m){
    sig=sh('node',['scripts/vicifull/sigdiff.mjs',dsig,asig]).out.trim().split('\n').pop();
    px=sh('node',['.vicifull/vtmp/r-sos-px.mjs',dpng,apng,'--tiles=6']).out.trim();
  }
  const unreachable = !!r.unreachable;
  rows.push({frame:r.frame,unreachable,sig,px});
  console.log(`### ${r.frame}${unreachable?' [D038 swap-render]':''}\n  sig: ${sig}\n  ${px.split('\n').join('\n  ')}`);
}
fs.writeFileSync(`${OUT}/rows.json`,JSON.stringify(rows,null,2));
