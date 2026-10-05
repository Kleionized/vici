#!/bin/sh
# GROUP slip — capture one state at another device size: sh .overhaul/slip-small.sh <W> <H> <name> <route> <seed> <do|->
W="$1"; H="$2"; N="$3"; R="$4"; S="$5"; D="$6"
DO="await __sleep(1200)"; [ "$D" != "-" ] && DO="$D; await __sleep(900)"
node scripts/overhaul/shot.mjs app "$R" .overhaul/shots/slip/s$W-$N.png --w=$W --h=$H --initseed=$S "--do=$DO" 2>&1 | grep -v '^shot ->\|rows ->'
