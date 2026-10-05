await tap('Continue with email');
await __sleep(900);
return { txt: __txt().slice(0, 300), inputs: [...document.querySelectorAll('input')].map((i) => i.placeholder || i.type) };
