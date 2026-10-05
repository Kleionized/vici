import re,os,glob,json
base='/Users/admin/Documents/Vici/.overhaul/final'
def svgs(s):
    out=[]
    for m in re.finditer(r'<svg\b[^>]*data-hero="([^"]*)"[^>]*>',s):
        st=m.start(); depth=0
        for mm in re.finditer(r'<(/?)svg\b',s[st:]):
            if mm.group(1)=='': depth+=1
            else:
                depth-=1
                if depth==0: end=st+mm.end(); break
        tag=m.group(0)
        top=re.search(r'top:\s*([-\d.]+)px',tag); sc=re.search(r'scale\(([\d.]+)\)',tag)
        out.append((m.group(1), s[st+len(tag):end-6], top.group(1) if top else None, sc.group(1) if sc else None))
    return out
cards={}
for f in glob.glob(base+'/Lesson-Illustrations-v4/*.html'):
    if f.endswith('_helmet.html'): continue
    s=open(f).read(); v=svgs(s)
    if v: cards[v[0][0]]=(os.path.basename(f),v[0][1])
byart={v[1]:k for k,v in cards.items()}
res=[]
for f in sorted(glob.glob(base+'/Email-Login/*.html')):
    s=open(f).read()
    for hid,inner,top,sc in svgs(s):
        match = cards.get(hid,(None,None))[1]==inner
        alias = byart.get(inner)
        res.append((os.path.basename(f)[:-5],hid,top,sc,match,alias))
for r in res:
    if not r[4]: print('MISMATCH',r)
print(len(res),'hero svgs in Email-Login;', sum(1 for r in res if r[4]),'byte-match their id card')
json.dump([dict(frame=r[0],hero=r[1],top=r[2],scale=r[3],match=r[4],artIs=r[5]) for r in res],open('/Users/admin/Documents/Vici/.overhaul/understand/scratch-critic/heroes-email.json','w'),indent=0)
