/* The designed entry into `03 · Name`: 02 · Login -> "Continue with email" ->
   `047 · Create Account` (which asks for a first name) -> Create Account ->
   router.replace('/') -> the funnel. No seed: this is the path a real man
   walks, and it is what decides what the name field shows when 03 opens. */
await window.tap('Continue with email', { wait: 1200 });
await window.typeIn(0, 'Marcus');
await window.typeIn(1, 'marcus@example.com');
await window.tap('Create Account', { wait: 2200 });
await new Promise((r) => setTimeout(r, 2500));
return [location.pathname, window.__txt().slice(0, 140)];
