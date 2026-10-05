#!/bin/zsh
# sos-boards: capture each board's recipe (one Chrome at a time), then pxdiff + sigdiff against the frame.
#   .overhaul/f-sosb-run.sh [Key …] [-- extra shot.mjs flags]   e.g. f-sosb-run.sh SOS-Loc-Bed -- --w=375 --h=667
# Writes .overhaul/shots/sosb/a-<Key><suffix>.png (+ strip) and prints one line per board.
cd /Users/admin/Documents/Vici
keys=()
extra=()
seen_dashdash=0
for a in "$@"; do
  if [[ $a == -- ]]; then seen_dashdash=1; continue; fi
  if (( seen_dashdash )); then extra+=("$a"); else keys+=("$a"); fi
done
if (( ${#keys} == 0 )); then
  keys=($(node -e "console.log(require('./.overhaul/groups.json')['sos-boards'].map(f=>f.replace('.html','')).join(' '))"))
fi
suffix=""
for e in $extra; do suffix="$suffix${e//[^A-Za-z0-9]/}"; done
[[ -n $suffix ]] && suffix="-$suffix"
for k in $keys; do
  if [[ -f .overhaul/drives/b-$k.js ]]; then
    route=/urge; script=(--script=.overhaul/drives/b-$k.js)
  else
    route="/urge?board=$k"; script=()
  fi
  out=.overhaul/shots/sosb/a-$k$suffix.png
  log=$(node scripts/overhaul/shot.mjs app "$route" $out --sig=a-sosb-$k$suffix $script --wait=1200 $extra 2>&1)
  if ! grep -q '^shot ->' <<<"$log"; then echo "$k$suffix CAPTURE FAILED: $(tail -3 <<<"$log" | tr '\n' ' ')"; continue; fi
  grep -q 'Lato NOT loaded\|pageerror\|initseed:' <<<"$log" && echo "$k$suffix WARN: $(grep 'Lato NOT\|pageerror' <<<"$log" | head -2 | tr '\n' ' ')"
  if [[ -z $suffix ]]; then
    px=$(node scripts/overhaul/pxdiff.mjs .overhaul/shots/design/Email-Login/$k.png $out 2>&1 | head -2 | tr '\n' ' ')
    sig=$(node scripts/overhaul/sigdiff.mjs d-Email-Login-$k a-sosb-$k 2>&1 | tail -1)
    echo "$k | $px | $sig"
  else
    echo "$k$suffix captured"
  fi
done
