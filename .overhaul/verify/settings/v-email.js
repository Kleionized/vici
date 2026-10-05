const out = {}; try {
await waitFor('Manage subscription'); await __sleep(500);
await tap('Sign out'); await __sleep(900);
const dlg = document.querySelector('[role="dialog"]');
const p = [...document.querySelectorAll('div')].filter((d) => d.childElementCount === 0 && /stay saved to/.test(d.textContent))[0];
const pill = [...__btns()].filter((b) => b.textContent.trim() === 'Sign out').pop();
out.pillTop = Math.round(pill.getBoundingClientRect().top);
const emails = ['sam@example.com', 'jonathan.richardson@gmail.com', 'christopher.montgomery@protonmail.com', 'alexandra.whitfield-jones@outlook.com', 'samuel.alexander.reyes@longcompanyname-example.com', 'samuelalexanderreyesmontgomery@longcompanyname.com', 'firstname.middlename.lastname@universitydepartment.ac.uk'];
out.rows = emails.map((e) => { p.textContent = `Your log, letters and medallions stay saved to ${e}.`; const r = p.getBoundingClientRect(); return `${e.length}ch bottom=${Math.round(r.bottom)} lines=${Math.round(r.height / 23)} right=${Math.round(r.right)}`; });
} catch (e) { out.err = e.message.slice(0, 200); }
console.error('RESULT ' + JSON.stringify(out)); return 1;
