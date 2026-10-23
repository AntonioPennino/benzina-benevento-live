// Regola dei voti: da qui la pagina (app.js) calcola lo stato di ogni pompa. tests/regola-voti.test.js la verifica.

// Regola dei voti:
// - vince lo stato con più voti "in corso"; a parità vince il peggiore (Esaurita > Limitata > Aperta),
//   quindi con 10 Esaurita e 10 Aperta resta Esaurita e servono 11 Aperta;
// - se un voto per uno stato diverso arriva dopo 45 minuti dall'ultimo voto dello stato in vigore,
//   il conteggio riparte da quel voto: i voti precedenti restano visibili ma "in ombra" e non pesano.
const VOTE_WINDOW_MS = 45 * 60 * 1000;
const STATUS_SEVERITY = { closed: 3, limited: 2, available: 1 };

function winnerOf(list) {
    const counts = {};
    list.forEach(v => { counts[v.status] = (counts[v.status] || 0) + 1; });
    const top = Math.max(...Object.values(counts));
    const status = Object.keys(counts).filter(k => counts[k] === top)
        .sort((a, b) => STATUS_SEVERITY[b] - STATUS_SEVERITY[a])[0];
    return { status, count: top };
}

// ripercorre i voti in ordine di tempo e applica il riavvio del conteggio
function splitVotes(votes) {
    const list = Object.entries(votes).map(([uid, v]) => ({ ...v, uid })).sort((x, y) => x.ts - y.ts);
    let active = [];
    const old = [];
    list.forEach(v => {
        if (active.length) {
            const { status } = winnerOf(active);
            const lastOfWinner = Math.max(...active.filter(a => a.status === status).map(a => a.ts));
            if (v.status !== status && v.ts - lastOfWinner >= VOTE_WINDOW_MS) {
                old.push(...active);
                active = [];
            }
        }
        active.push(v);
    });
    return { active, old };
}

// Code: etichette mostrate per i valori salvati. 'Nessuna' (pompa chiusa) e 'Non indicata' non si mostrano.
const QUEUE_LABELS = { 'Scorrevole': 'Nessuna coda', 'Moderata': 'Attesa 5-10 min', 'Lunga': 'Coda lunga (+15 min)', 'Presidio TIR / Disagi': 'Presidio TIR / Disagi' };
const QUEUE_CHOICES = ['Scorrevole', 'Moderata', 'Lunga'];

// coda in vigore: l'ultima segnalata davvero tra i voti in corso di pompe aperte o limitate
// (un voto rapido "Aperta" senza coda non cancella la coda segnalata poco prima da un altro)
function currentQueue(active) {
    const q = active.filter(v => v.status !== 'closed' && QUEUE_LABELS[v.queueLevel]).sort((x, y) => y.ts - x.ts)[0];
    return q ? { queueLevel: q.queueLevel, queueTs: q.ts } : { queueLevel: 'Non indicata', queueTs: null };
}

function deriveFromVotes(votes, legacy) {
    const { active } = splitVotes(votes);
    if (!active.length) {
        if (legacy) return { ...legacy };
        return { status: 'unverified', lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: 'Da verificare', lastNote: '', lastReporterId: null };
    }
    const { status: winner, count } = winnerOf(active);
    const latest = active.filter(v => v.status === winner).sort((x, y) => y.ts - x.ts)[0];
    const queue = winner === 'closed' ? { queueLevel: 'Nessuna', queueTs: null } : currentQueue(active);
    return { status: winner, lastUpdated: latest.ts, confirmations: count, fuels: latest.fuels, ...queue, lastNote: latest.note, lastReporterId: latest.uid };
}

// ultimo voto arrivato (di qualunque categoria), non lo stato in vigore
function lastVoteOf(st) {
    const votes = st.votes ? Object.values(st.votes) : [];
    if (votes.length) return votes.reduce((m, v) => (v.ts > m.ts ? v : m));
    return st.lastUpdated && st.status && st.status !== 'unverified' ? { status: st.status, ts: st.lastUpdated } : null;
}

// lo stato mostrato (filtri, mappa, schede) si ricalcola sempre dai voti, mai dal valore salvato:
// così non resta in vigore uno stato calcolato con regole precedenti
function normalizeStation(s) {
    const raw = s.votes && typeof s.votes === 'object' ? s.votes : {};
    const valid = {};
    Object.entries(raw).forEach(([uid, v]) => {
        if (v && ['available', 'limited', 'closed'].includes(v.status) && typeof v.ts === 'number') valid[uid] = v;
    });
    if (!Object.keys(valid).length) return s;
    return { ...s, ...deriveFromVotes(valid, s.legacy || null), votes: valid };
}

// voti per stato (per le segnalazioni vecchie, senza voti, usa il contatore storico)
function voteCounts(st) {
    const c = { available: 0, limited: 0, closed: 0 };
    const old = { available: 0, limited: 0, closed: 0 };
    const hasVotes = st.votes && Object.keys(st.votes).length;
    if (hasVotes) {
        const { active, old: older } = splitVotes(st.votes);
        active.forEach(v => { if (v.status in c) c[v.status]++; });
        older.forEach(v => { if (v.status in old) old[v.status]++; });
    } else if (st.status in c) c[st.status] = st.confirmations || 0;
    return { ...c, old };
}


function applyVoteToStation(st, uid, vote) {
    const votes = { ...(st.votes || {}) };
    let legacy = st.legacy || null;
    // segnalazioni precedenti al sistema "una per persona": le conserviamo come base
    if (!st.votes && st.status && st.status !== 'unverified' && st.lastUpdated) {
        legacy = {
            status: st.status, lastUpdated: st.lastUpdated, confirmations: st.confirmations || 1,
            fuels: st.fuels || { benzina: null, diesel: null, gpl: null }, queueLevel: st.queueLevel || 'Da verificare',
            lastNote: st.lastNote || '', lastReporterId: st.lastReporterId || null
        };
    }
    if (vote) votes[uid] = vote; else delete votes[uid];
    return { ...st, ...deriveFromVotes(votes, legacy), votes, legacy };
}

