#!/bin/zsh
cd /Users/admin/Documents/tideline
for NN in "$@"; do
 F=.vicifull/final/Lesson-1-Surviving-the-Night/L1-Frame-$(printf %02d $NN).html
 CH=$(node .vicifull/tmp-verify/chosen.mjs $F)
 EXTRA=""; if [ -n "$CH" ]; then EXTRA="await tap(${(qq)CH});"; fi
 TAG=l1f$NN
 node scripts/vicifull/shot.mjs design Lesson-1-Surviving-the-Night L1-Frame-$(printf %02d $NN).html .vicifull/shots/v-wl-d-$TAG.png --sig=v-wl-d-$TAG >/dev/null 2>&1
 DO="await __sleep(600); for (let i=0;i<$((NN-1));i++) { await tap('Next', {wait:150}); } $EXTRA"
 node scripts/vicifull/shot.mjs app "/lesson/day/1" .vicifull/shots/v-wl-a-$TAG.png --sig=v-wl-a-$TAG --wait=900 "--do=$DO" >/dev/null 2>&1
 echo "### L1 Frame $NN ${CH:+[tapped: $CH]}"
 node scripts/vicifull/sigdiff.mjs v-wl-d-$TAG v-wl-a-$TAG 2>&1 | tail -6
 node .vicifull/tmp-verify/pxdiff.mjs .vicifull/shots/v-wl-d-$TAG.png .vicifull/shots/v-wl-a-$TAG.png 2>&1 | head -3
done
