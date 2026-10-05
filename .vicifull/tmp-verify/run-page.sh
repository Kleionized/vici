#!/bin/zsh
cd /Users/admin/Documents/tideline
B=$1; L=$2; NN=$3; EXTRA=$4
TAG=w${L}f${NN}
node scripts/vicifull/shot.mjs design $B L$L-Frame-$(printf %02d $NN).html .vicifull/shots/v-wl-d-$TAG.png --sig=v-wl-d-$TAG >/dev/null 2>&1
DO="await __sleep(600); for (let i=0;i<$((NN-1));i++) { await tap('Next', {wait:150}); } $EXTRA"
node scripts/vicifull/shot.mjs app "/lesson/day/$L" .vicifull/shots/v-wl-a-$TAG.png --sig=v-wl-a-$TAG --wait=900 "--do=$DO" >/dev/null 2>&1
echo "### $B L$L Frame $NN"
node scripts/vicifull/sigdiff.mjs v-wl-d-$TAG v-wl-a-$TAG 2>&1 | tail -14
node .vicifull/tmp-verify/pxdiff.mjs .vicifull/shots/v-wl-d-$TAG.png .vicifull/shots/v-wl-a-$TAG.png 2>&1 | head -4
