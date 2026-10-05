#!/bin/zsh
cd /Users/admin/Documents/tideline
D=$1   # zero padded day
N=$2   # numeric day
K=$3   # Intro|Options
if [ "$K" = "Intro" ]; then DO=""; else DO="--do=await __sleep(1200); await tap('Continue')"; fi
node scripts/vicifull/shot.mjs design Lessons-and-Tasks Task-D$D-$K.html .vicifull/shots/v-wl-d-t$D$K.png --sig=v-wl-d-t$D$K >/dev/null 2>&1
if [ -z "$DO" ]; then
  node scripts/vicifull/shot.mjs app "/task/$N" .vicifull/shots/v-wl-a-t$D$K.png --sig=v-wl-a-t$D$K --wait=1500 >/dev/null 2>&1
else
  node scripts/vicifull/shot.mjs app "/task/$N" .vicifull/shots/v-wl-a-t$D$K.png --sig=v-wl-a-t$D$K --wait=1500 "$DO" >/dev/null 2>&1
fi
echo "### D$D $K"
node scripts/vicifull/sigdiff.mjs v-wl-d-t$D$K v-wl-a-t$D$K 2>&1 | grep -v "radius: 50% → -" | tail -25
