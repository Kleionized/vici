const all=[...document.querySelectorAll('div')];
const col=(l)=>all.find(c=>c.getAttribute('aria-label')===l);
const big=()=>[...document.querySelectorAll('div')].filter(d=>getComputedStyle(d).fontSize==='30px'&&d.textContent.trim().length&&d.children.length===0).map(b=>[b.textContent.trim(),Math.round(b.getBoundingClientRect().top*100)/100]);
const ap=col('AM or PM'), hour=col('Hour');
const o={};
o.rest=big();
const step=async(el,y,k)=>{el.scrollTop=y;el.dispatchEvent(new Event('scroll'));await new Promise(r=>setTimeout(r,600));o[k]={scrollTop:el.scrollTop,rows:big()};};
await step(ap,0,'ap_to_AM');
await step(ap,36,'ap_back_to_PM');
await step(hour,766+36.5*1,'hour_plus1');   // odd->even index
await step(hour,766+36.5*2,'hour_plus2');
await step(hour,766-36.5*1,'hour_minus1');
return o;
