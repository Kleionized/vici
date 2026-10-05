#!/bin/bash
# usage: run.sh <from> <to>  — capture /week/N P1 + P2 for N in from..to and pxdiff each
cd /Users/admin/Documents/Vici
DO='const els=[...document.querySelectorAll("*")].filter(e=>{const cs=getComputedStyle(e);const r=e.getBoundingClientRect();return /(auto|scroll)/.test(cs.overflowY)&&e.scrollHeight>e.clientHeight+1&&r.height>100&&r.left>-1&&r.right<innerWidth+1});els.forEach(e=>e.scrollTop=e.scrollHeight);return els.map(e=>e.scrollTop)'
FR=(x Week-I-Reset Week-II-Changing-Your-Mindset Week-III-In-the-Moment Week-IV-Know-Your-Brain Week-V-Why-It-Feels-Worth-It Week-VI-Discipline Week-VII-Relapse-and-Adversity Week-VIII-Boredom-and-Meaning Week-IX-Connection Week-X-Yourself Week-XI-Build-a-Life-You-Want Week-XII-Leave-It-Behind)
for n in $(seq $1 $2); do
  f=${FR[$n]}
  node scripts/overhaul/shot.mjs app /week/$n .overhaul/shots/lib/a-$f.png --sig=a-lib-$f --initseed=.overhaul/library-seed.js --wait=2500 2>&1 | grep -E "fonts|pageerror" 
  echo "== $f"; node scripts/overhaul/pxdiff.mjs .overhaul/shots/design/Email-Login/$f.png .overhaul/shots/lib/a-$f.png 2>&1 | head -6
  node scripts/overhaul/shot.mjs app /week/$n .overhaul/shots/lib/a-$f-P2.png --sig=a-lib-$f-P2 --initseed=.overhaul/library-seed.js --do="$DO" --wait=1200 2>&1 | grep -E "fonts|pageerror|do ->"
  echo "== $f-P2"; node scripts/overhaul/pxdiff.mjs .overhaul/shots/design/Email-Login/$f-P2.png .overhaul/shots/lib/a-$f-P2.png 2>&1 | head -6
done
