/* Returns the visible text of the screen after driving, so a branch can be
   proved by what it lands on rather than by reading the source. */
await new Promise(r=>setTimeout(r,700));
return { url: location.pathname + location.search, text: document.body.innerText.replace(/\n+/g,' | ').slice(0,600) };
