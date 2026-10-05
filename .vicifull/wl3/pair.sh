#!/bin/zsh
# pair.sh task 56  |  pair.sh lesson 22
kind=$1; n=$2
if [[ $kind == task ]]; then
  nn=$(printf "%02d" $n)
  d=".vicifull/wl3/shots/d-tD$nn.png"; a=".vicifull/wl3/shots/a-t$n.png"
  [[ -f $d ]] || node scripts/vicifull/shot.mjs design Lessons-and-Tasks Task-D$nn-Intro.html $d --sig=r-week-lessons-d-tD$nn >/dev/null 2>&1
  [[ -f $a ]] || node scripts/vicifull/shot.mjs app "/task/$n" $a --sig=r-week-lessons-a-t$n --wait=2200 >/dev/null 2>&1
else
  nn2=$(printf "%02d" $n); d=".vicifull/wl3/shots/d-L$nn2.png"; a=".vicifull/wl3/shots/a-L$nn2.png"
  [[ -f $d ]] || node scripts/vicifull/shot.mjs design Lessons-and-Tasks Lesson-$nn2.html $d --sig=r-week-lessons-d-L$nn2 >/dev/null 2>&1
  [[ -f $a ]] || node scripts/vicifull/shot.mjs app "/lesson-card/$n" $a --sig=r-week-lessons-a-L$nn2 --wait=2000 >/dev/null 2>&1
fi
echo "### $kind $n"
node .vicifull/wl3/rdiff.mjs $d $a --box=0,54,393,798 2>&1 | sed -n '2p;12,16p'
