#!/bin/bash
# hash each frame's first 393x240 hero svg body (children only), print hash, top, scale
cd /Users/admin/Documents/Vici
for f in .overhaul/final/Email-Login/*.html; do
  n=$(basename $f .html)
  node scripts/overhaul/body.mjs $f 2>/dev/null | awk '
    /<svg> viewBox="0 0 393 240"/ { insvg=1; depth=index($0,"<"); hdr=$0; next }
    insvg { d=index($0,"<"); if (d<=depth && d>0) { insvg=0; done=1 } else if (d==0 && $0 ~ /^ *·/) {print} else {print} }
    done { exit }
    END { }
  ' > /tmp/h_$$.txt
  if [ -s /tmp/h_$$.txt ]; then
    top=$(node scripts/overhaul/body.mjs $f 2>/dev/null | grep -m1 'viewBox="0 0 393 240"' | grep -o 'top:[0-9.-]*px' ); sc=$(node scripts/overhaul/body.mjs $f 2>/dev/null | grep -m1 'viewBox="0 0 393 240"' | grep -o 'scale([0-9.]*)')
    echo "$(sed 's/^ *//' /tmp/h_$$.txt | md5 | cut -c1-8) $n $top $sc"
  fi
done | sort
rm -f /tmp/h_$$.txt
