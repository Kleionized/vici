await tap("Log the slip"); await tap("Closed"); await tap("Continue"); await tap("Bored"); await tap("Continue · 1"); await tap("Continue"); await tap("Continue"); await tap("Continue"); await tap("Done");
await new Promise(r=>setTimeout(r,900));
return { url: location.pathname + location.search, text: document.body.innerText.replace(/\n+/g,' | ').slice(0,400) };
