set -e
declare -a IDS=(starting-point next30 one-year age80 change-line clean-day one-bad-day want-back)
declare -a FRAMES=(Starting-Score Cost-Next-30 Cost-Next-365 Cost-By-Age-80 Change-the-Line A-Clean-Day One-Bad-Day What-You-Want-Back)
declare -a N=(32 33 34 35 36 37 38 39)
for i in 0 1 2 3 4 5 6 7; do
  n=${N[$i]}
  node scripts/vicifull/shot.mjs design Email-Login ${FRAMES[$i]}.html .vicifull/shots/f-tail-d-$n.png --sig=f-tail-d-$n >/dev/null
  node .vicifull/vtail-cap.mjs "/welcome" .vicifull/shots/f-tail-a-$n.png --sig=f-tail-a-$n --do="window.__T=\"${IDS[$i]}\"" --script=.vicifull/drives/tail-walk.js --wait=1600 2>&1 | tail -2
  echo "== $n ${FRAMES[$i]}"
done
