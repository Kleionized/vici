/* verifier: route-level checks inside one page (client-side navigation keeps storage). */
const rail = () => document.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow') ?? null;
const go = async (href) => { history.pushState({}, '', href); dispatchEvent(new PopStateEvent('popstate')); await __sleep(1500); };
return JSON.stringify({ path: location.pathname + location.search, rail: rail(), t: __txt().slice(0, 100) });
