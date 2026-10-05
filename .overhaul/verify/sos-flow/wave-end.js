const r = Date.now.bind(Date); Date.now = () => r() + 120000;
const t0 = r(); while (r() - t0 < 4000) { if (__txt().includes('The wave passed.')) break; await __sleep(100); }
return __txt().slice(0, 120);
