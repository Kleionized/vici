await tap('Already have an account? Sign in');
await __sleep(900);
await tap('Sign in with email');
await __sleep(800);
await typeIn(0, 'marcus@example.com');
await __sleep(200);
await tap("Let's Go");
await __sleep(1200);
return { txt: __txt().slice(0, 200), url: location.href };
