#!/bin/zsh
# verifier: capture each board (one Chrome at a time), pxdiff + sigdiff against the frame.
#   run.sh [Key …] [-- extra shot flags]
cd /Users/admin/Documents/Vici
V=.overhaul/verify/sos-boards
keys=(); extra=(); dd=0
for a in "$@"; do
  if [[ $a == -- ]]; then dd=1; continue; fi
  if (( dd )); then extra+=("$a"); else keys+=("$a"); fi
done
if (( ${#keys} == 0 )); then
  keys=($(node -e "console.log(require('./.overhaul/groups.json')['sos-boards'].map(f=>f.replace('.html','')).join(' '))"))
fi
suffix=""; for e in $extra; do suffix="$suffix${e//[^A-Za-z0-9]/}"; done; [[ -n $suffix ]] && suffix="-$suffix"
for k in $keys; do
  if [[ -f .overhaul/drives/b-$k.js ]]; then route=/urge; script=(--script=.overhaul/drives/b-$k.js)
  else route="/urge?board=$k"; script=(); fi
  out=$V/a-$k$suffix.png
  log=$(node scripts/overhaul/shot.mjs app "$route" $out --sig=v-sosb-$k$suffix $script --wait=1200 $extra 2>&1)
  if ! grep -q '^shot ->' <<<"$log"; then echo "$k$suffix CAPTURE FAILED: $(tail -3 <<<"$log" | tr '\n' ' ')"; continue; fi
  grep -q 'Lato NOT loaded\|pageerror\|initseed:' <<<"$log" && echo "$k$suffix WARN: $(grep 'Lato NOT\|pageerror' <<<"$log" | head -2 | tr '\n' ' ')"
  if [[ -z $suffix ]]; then
    px=$(node scripts/overhaul/pxdiff.mjs .overhaul/shots/design/Email-Login/$k.png $out 2>&1 | head -4 | tr '\n' ' ')
    sig=$(node scripts/overhaul/sigdiff.mjs d-Email-Login-$k v-sosb-$k 2>&1 | tail -1)
    echo "$k | $px | $sig"
  else
    echo "$k$suffix captured"
  fi
done
