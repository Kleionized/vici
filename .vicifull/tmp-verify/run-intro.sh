#!/bin/zsh
cd /Users/admin/Documents/tideline
for D in "$@"; do
  N=$((10#$D))
  node scripts/vicifull/shot.mjs design Lessons-and-Tasks Task-D$D-Intro.html .vicifull/shots/v-wl-d-i$D.png >/dev/null 2>&1
  node scripts/vicifull/shot.mjs app "/task/$N" .vicifull/shots/v-wl-a-i$D.png --wait=1500 >/dev/null 2>&1
  echo "### Task D$D Intro"
  node .vicifull/tmp-verify/pxdiff.mjs .vicifull/shots/v-wl-d-i$D.png .vicifull/shots/v-wl-a-i$D.png 2>&1 | head -4
done
