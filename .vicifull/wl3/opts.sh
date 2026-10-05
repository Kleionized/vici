#!/bin/zsh
n=$1; nn=$(printf "%02d" $n)
d=".vicifull/wl3/shots/d-oD$nn.png"; a=".vicifull/wl3/shots/a-o$n.png"
[[ -f $d ]] || node scripts/vicifull/shot.mjs design Lessons-and-Tasks Task-D$nn-Options.html $d --sig=r-week-lessons-d-oD$nn >/dev/null 2>&1
[[ -f $a ]] || node scripts/vicifull/shot.mjs app "/task/$n" $a --sig=r-week-lessons-a-o$n --wait=1500 --do="await __sleep(1200); await tap('Continue')" >/dev/null 2>&1
echo "### options $n"
node .vicifull/wl3/rdiff.mjs $d $a --box=0,54,393,798 2>&1 | sed -n '2p;9,12p'
