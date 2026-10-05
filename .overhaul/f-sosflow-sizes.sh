#!/bin/bash
# sos-flow size sweep: every frame's recipe at 375x667 and 430x932 → .overhaul/shots/sosflow/sz/<name>-<w>.png
run() { # name route seed
  local name=$1 route=$2 seed=$3; shift 3
  for wh in "375 667" "430 932"; do set -- $wh
    args=(--w=$1 --h=$2 --wait=900)
    [ -f .overhaul/drives/sf-$name.js ] && args+=(--script=.overhaul/drives/sf-$name.js)
    [ -n "$seed" ] && args+=(--initseed=$seed)
    node scripts/overhaul/shot.mjs app "$route" .overhaul/shots/sosflow/sz/$name-$1.png "${args[@]}" 2>&1 | grep -iv "^shot ->" | grep -v "^\s*$"
  done
}
for n in ${ONLY:-intro strength where move1 move2 move3 reason feel reassess afterward done}; do run $n /urge ""; done
