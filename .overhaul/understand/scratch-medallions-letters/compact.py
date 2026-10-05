import sys,re
# collapse runs of identical-r small circles inside a <g> into one summary line
for fn in sys.argv[1:]:
    lines=open(fn).read().split('\n')
    out=[];i=0
    while i<len(lines):
        l=lines[i]
        m=re.match(r'^(\s*)<circle> cx="([\d.]+)"\s+cy="([\d.]+)"\s+r="([\d.]+)"\s*$',l)
        if m:
            ind,r=m.group(1),m.group(4)
            pts=[]
            j=i
            while j<len(lines):
                mm=re.match(r'^(\s*)<circle> cx="([\d.]+)"\s+cy="([\d.]+)"\s+r="([\d.]+)"\s*$',lines[j])
                if not mm or mm.group(1)!=ind or mm.group(4)!=r: break
                pts.append((float(mm.group(2)),float(mm.group(3))));j+=1
            if len(pts)>3:
                xs=[p[0] for p in pts];ys=[p[1] for p in pts]
                out.append(f'{ind}<circle>×{len(pts)} r="{r}" first=({pts[0][0]},{pts[0][1]}) x[{min(xs)}..{max(xs)}] y[{min(ys)}..{max(ys)}]')
                i=j;continue
        out.append(l);i+=1
    open(fn.replace('.txt','.c.txt'),'w').write('\n'.join(out))
