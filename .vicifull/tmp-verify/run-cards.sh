#!/bin/zsh
cd /Users/admin/Documents/tideline
for D in "$@"; do
  N=$((10#$D))
  node scripts/vicifull/shot.mjs design Lessons-and-Tasks Lesson-$D.html .vicifull/shots/v-wl-d-c$D.png >/dev/null 2>&1
  node scripts/vicifull/shot.mjs app "/lesson-card/$N" .vicifull/shots/v-wl-a-c$D.png --wait=1400 >/dev/null 2>&1
  echo "### Lesson $D"
  node .vicifull/tmp-verify/pxdiff.mjs .vicifull/shots/v-wl-d-c$D.png .vicifull/shots/v-wl-a-c$D.png 2>&1 | head -3
done
