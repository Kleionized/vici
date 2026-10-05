#!/bin/zsh
# reader.sh <bundle> <lesson> <frameNN>
b=$1; L=$2; NN=$3
d=".vicifull/wl3/shots/d-L${L}F${NN}.png"; a=".vicifull/wl3/shots/a-L${L}F${NN}.png"
[[ -f $d ]] || node scripts/vicifull/shot.mjs design $b L${L}-Frame-${NN}.html $d --sig=r-week-lessons-d-L${L}F${NN} >/dev/null 2>&1
n=$((10#$NN - 1))
[[ -f $a ]] || node scripts/vicifull/shot.mjs app "/lesson/day/$L" $a --sig=r-week-lessons-a-L${L}F${NN} --wait=900 --settle=1200 --do="for (let i=0;i<$n;i++) { await tap('Next', {wait:170}); }" >/dev/null 2>&1
echo "### L$L Frame $NN ($b)"
node .vicifull/wl3/rdiff.mjs $d $a --box=0,54,393,798 2>&1 | sed -n '2p;9,13p'
