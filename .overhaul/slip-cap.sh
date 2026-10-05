#!/bin/sh
# GROUP slip — capture one app state, then sigdiff + pxdiff it against its design frame.
#   sh .overhaul/slip-cap.sh <Frame> <route> <seed|-> <do|-> [shot flags…]
# PNGs land in .overhaul/shots/slip/a-<Frame>.png (+ .strip/.diff/.overlay); sig a-slip-<Frame>.
F="$1"; R="$2"; S="$3"; D="$4"; shift 4
OUT=.overhaul/shots/slip/a-$F.png
SEED=""; [ "$S" != "-" ] && SEED="--initseed=$S"
DO="await __sleep(1200)"; [ "$D" != "-" ] && DO="$D; await __sleep(900)"
node scripts/overhaul/shot.mjs app "$R" "$OUT" --sig=a-slip-$F $SEED "--do=$DO" "$@" 2>&1 | grep -v '^shot ->' | grep -v 'rows ->'
case " $* " in *" --w="*|*" --h="*|*" --scroll="*) exit 0;; esac
node scripts/overhaul/sigdiff.mjs d-Email-Login-$F a-slip-$F 2>&1 | grep -v 'MISSING in app:  svg' | tail -25
node scripts/overhaul/pxdiff.mjs .overhaul/shots/design/Email-Login/$F.png "$OUT" 2>&1 | grep -v '^->' | tail -12
rm -f .overhaul/shots/slip/a-$F.diff.png .overhaul/shots/slip/a-$F.overlay.png
