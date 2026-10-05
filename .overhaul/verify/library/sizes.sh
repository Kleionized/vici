#!/bin/bash
# sequential captures of the library group's screens at three sizes
cd /Users/admin/Documents/Vici
O=.overhaul/verify/library
S38=.overhaul/library-seed.js
S3=.overhaul/library-day3-seed.js
END='const els=[...document.querySelectorAll("*")].filter(e=>{const cs=getComputedStyle(e);const r=e.getBoundingClientRect();return /(auto|scroll)/.test(cs.overflowY)&&e.scrollHeight>e.clientHeight+1&&r.height>100&&r.left>-1&&r.right<innerWidth+1});els.forEach(e=>e.scrollTop=e.scrollHeight);return els.map(e=>[e.scrollTop,e.scrollHeight,e.clientHeight])'
shot() { # name route seed size extra...
  local name=$1 route=$2 seed=$3 w=$4 h=$5; shift 5
  echo "=== $name ($w x $h) $route"
  node scripts/overhaul/shot.mjs app "$route" $O/s-$name-${w}x$h.png --initseed=$seed --w=$w --h=$h --wait=2500 "$@" 2>&1 | grep -v "^shot ->"
}
for sz in "393 852" "375 667" "430 932"; do
  set -- $sz; W=$1; H=$2
  case "$*" in
    "393 852") ;;
    *) shot lib6 /week/6 $S38 $W $H
       shot lib6end /week/6 $S38 $W $H "--do=$END"
       shot lib3 /week/3 $S38 $W $H ;;
  esac
  shot browser /lessons-browser $S38 $W $H
  shot browserend /lessons-browser $S38 $W $H "--do=$END"
  shot search /search $S38 $W $H
  shot searchend /search $S38 $W $H "--do=$END"
  shot first /first-steps $S3 $W $H
  shot firstend /first-steps $S3 $W $H "--do=$END"
  shot locked /locked $S38 $W $H
  shot lockedend /locked $S38 $W $H "--do=$END"
  shot journey /journey $S38 $W $H
  shot journeyend /journey $S38 $W $H "--do=$END"
  shot crossing /journey/crossing $S38 $W $H
  shot crossingend /journey/crossing $S38 $W $H "--do=$END"
done
echo DONE
