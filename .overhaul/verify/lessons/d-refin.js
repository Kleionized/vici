const uid = 'weeks-seed-user';
const data = () => JSON.parse(localStorage.getItem('tideline.mock.userdata.' + uid) || 'null');
const before = data()?.progress?.['day-05'];
await waitFor('Done when', 20000);
await tap('Finish lesson', { wait: 900 });
const after = data()?.progress?.['day-05'];
console.error('VLOG ' + JSON.stringify({ before: before?.completedAt, after: after?.completedAt, status: after?.status, same: before?.completedAt === after?.completedAt, t: __txt().slice(0, 60) }));
return 1;
