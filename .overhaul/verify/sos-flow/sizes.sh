#!/bin/bash
# verifier size sweep: sizes.sh <w> <h> [names...]   (bash 3: no assoc arrays)
cd /Users/admin/Documents/Vici
W=$1; H=$2; shift 2
mkdir -p .overhaul/verify/sos-flow/sz
for n in "$@"; do
  route=/urge; seed=; drive=
  case $n in
    intro) ;;
    strength|where|move1|move2|move3|reason|feel|reassess|afterward|done) drive=sf-$n ;;
    rlog|rtwice) route=/relapse; drive=sf-$n ;;
    rresign|rbegin) route=/relapse; drive=sf-$n; seed=.overhaul/day-seed.js ;;
    hubnow) route=/urge-hub; seed=.overhaul/sosflow-hub-seed.js ;;
    hubscore|hubproof|hubbreathe) route=/urge-hub; seed=.overhaul/sosflow-hub-seed.js; drive=sf-$n ;;
    hubsurfed) route=/urge-hub; seed=.overhaul/sosflow-hub-surfed-seed.js; drive=sf-$n ;;
    hubpledge) route=/urge-hub; seed=.overhaul/sosflow-hub-pledge-seed.js; drive=sf-$n ;;
  esac
  args=(--w=$W --h=$H --wait=900)
  [ -n "$drive" ] && args+=(--script=.overhaul/drives/$drive.js)
  [ -n "$seed" ] && args+=(--initseed=$seed)
  [ -n "$EXTRA" ] && args+=($EXTRA)
  echo "== $n $W"
  node scripts/overhaul/shot.mjs app "$route" .overhaul/verify/sos-flow/sz/$n-$W$SUFFIX.png "${args[@]}" 2>&1 | grep -v "^shot ->"
done
