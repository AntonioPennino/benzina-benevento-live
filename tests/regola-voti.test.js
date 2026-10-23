// Verifica la regola dei voti di public/app.js su casi d'esempio: npm test
const path = require('path');
const fs = require('fs');
const src = fs.readFileSync(path.join(__dirname, '..', 'public', 'app.js'), 'utf8');
const start = src.indexOf('const VOTE_WINDOW_MS');
const end = src.indexOf('// ultimo voto arrivato');
const { splitVotes, deriveFromVotes } = new Function(src.slice(start, end) + '; return { splitVotes, deriveFromVotes };')();
const M = 60 * 1000, T0 = Date.UTC(2026, 9, 22, 8, 0);
let n = 0;
const mk = (list) => Object.fromEntries(list.map(([s, min]) => ['u' + (n++), { status: s, ts: T0 + min * M, fuels: {}, queueLevel: '', note: '' }]));
const rep = (k, s, from, step = 1) => Array.from({ length: k }, (_, i) => [s, from + i * step]);
let fail = 0;
const check = (name, votes, exp) => {
  const r = deriveFromVotes(votes, null), { active, old } = splitVotes(votes);
  const ok = r.status === exp;
  if (!ok) fail++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}: ${r.status} (attesi ${exp}) attivi=${active.length} in ombra=${old.length}`);
};
check('10 rosse, 9 verdi', mk([...rep(10, 'closed', 0), ...rep(9, 'available', 10)]), 'closed');
check('10 rosse, 10 verdi (parità -> peggiore)', mk([...rep(10, 'closed', 0), ...rep(10, 'available', 10)]), 'closed');
check('10 rosse, 11 verdi', mk([...rep(10, 'closed', 0), ...rep(11, 'available', 10)]), 'available');
check('10 aperte (ultima 10:00), esaurita alle 10:50 -> reset', mk([...rep(10, 'available', 0, 6.67), ['closed', 110]]), 'closed');
check('10 aperte (ultima 10:00), esaurita alle 10:20 -> resta', mk([...rep(10, 'available', 0, 6.67), ['closed', 80]]), 'available');
check('2 aperte, 2 esaurite (Conad) -> peggiore', mk([['available', 0], ['available', 5], ['closed', 10], ['closed', 15]]), 'closed');
check('2 esaurite, poi 2 aperte -> peggiore', mk([['closed', 0], ['closed', 5], ['available', 10], ['available', 15]]), 'closed');
check('1 aperta, 1 limitata, 1 esaurita -> esaurita', mk([['available', 0], ['limited', 1], ['closed', 2]]), 'closed');
check('aperta confermata ogni 30 min resta aperta', mk([...rep(5, 'available', 0, 30), ['limited', 140]]), 'available');
check('dopo reset, i voti nuovi contano da capo', mk([...rep(10, 'available', 0), ['closed', 60], ['available', 62], ['available', 63]]), 'available');
check('dopo reset, 1 esaurita e 1 aperta -> esaurita', mk([...rep(10, 'available', 0), ['closed', 60], ['available', 62]]), 'closed');
check('stesso stato dopo pausa lunga non azzera', mk([...rep(3, 'closed', 0), ['available', 5], ['closed', 200]]), 'closed');
check('nessun voto', {}, 'unverified');

// code: vale l'ultima segnalata davvero, un voto rapido senza coda non la cancella
const qv = (status, min, queueLevel) => ['u' + (n++), { status, ts: T0 + min * M, fuels: {}, queueLevel, note: '' }]
const queueCase = (name, list, exp) => {
  const r = deriveFromVotes(Object.fromEntries(list), null)
  const ok = r.queueLevel === exp
  if (!ok) fail++
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}: ${r.queueLevel} (attesa ${exp})`)
}
queueCase('coda 5-10 min poi voto rapido senza coda', [qv('available', 0, 'Scorrevole'), qv('available', 5, 'Moderata'), qv('available', 10, 'Non indicata')], 'Moderata')
queueCase('coda segnalata anche da chi vota limitata', [qv('available', 0, 'Non indicata'), qv('limited', 5, 'Lunga'), qv('available', 10, 'Non indicata')], 'Lunga')
queueCase('nessuna coda indicata', [qv('available', 0, 'Non indicata')], 'Non indicata')
queueCase('pompa esaurita: niente coda', [qv('closed', 0, 'Nessuna'), qv('closed', 5, 'Nessuna')], 'Nessuna')
process.exit(fail ? 1 : 0);
