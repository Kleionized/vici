#!/bin/bash
# verifier: run.sh <name> <Frame-file-stem> <route> [extra shot args]
# captures the app into .overhaul/verify/sos-flow/a-<name>.png, sigdiff + pxdiff vs the design frame.
cd /Users/admin/Documents/Vici
name=$1; frame=$2; route=$3; shift 3
out=.overhaul/verify/sos-flow/a-$name.png
node scripts/overhaul/shot.mjs app "$route" $out --sig=v-sosflow-$name "$@" 2>&1 | grep -v "^shot ->\|rows ->"
echo "--- sigdiff"
node scripts/overhaul/sigdiff.mjs d-Email-Login-$frame v-sosflow-$name 2>&1 | tail -40
echo "--- pxdiff"
node scripts/overhaul/pxdiff.mjs .overhaul/shots/design/Email-Login/$frame.png $out 2>&1 | grep -v "^->"
