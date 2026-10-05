#!/bin/zsh
cd /Users/admin/Documents/tideline
D=$1; N=$2
node scripts/vicifull/shot.mjs design Lessons-and-Tasks Lesson-$D.html .vicifull/shots/v-wl-d-c$D.png --sig=v-wl-d-c$D >/dev/null 2>&1
node scripts/vicifull/shot.mjs app "/lesson-card/$N" .vicifull/shots/v-wl-a-c$D.png --sig=v-wl-a-c$D --wait=1500 >/dev/null 2>&1
echo "### Lesson $D card"
node scripts/vicifull/sigdiff.mjs v-wl-d-c$D v-wl-a-c$D 2>&1 | tail -8
node .vicifull/tmp-verify/pxdiff.mjs .vicifull/shots/v-wl-d-c$D.png .vicifull/shots/v-wl-a-c$D.png 2>&1 | head -4
