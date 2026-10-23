// PROTOTIPO della nuova interfaccia di Benzina Benevento Live.
// Stessi dati e stesse API del sito (/api/stations, /api/vote, /api/stations POST), stessa regola dei voti
// (regole.js) e stesso codice segreto del dispositivo: un voto dato qui vale come sul sito.

const POLL_MS = 20000;
const STALE_MS = 3 * 60 * 60 * 1000;
const BENEVENTO = { lat: 41.1300, lng: 14.7820 };
const STATUS = {
    available:  { label: 'Aperta',          short: 'Aperta',   icon: 'fa-check',          text: 'text-emerald-700', bg: 'bg-emerald-50',  ring: 'border-emerald-200', solid: 'bg-emerald-600' },
    limited:    { label: 'Code o limitata', short: 'Code',     icon: 'fa-hourglass-half', text: 'text-amber-700',   bg: 'bg-amber-50',    ring: 'border-amber-200',   solid: 'bg-amber-500' },
    closed:     { label: 'Esaurita',        short: 'Esaurita', icon: 'fa-xmark',          text: 'text-red-700',     bg: 'bg-red-50',      ring: 'border-red-200',     solid: 'bg-red-600' },
    unverified: { label: 'Nessuna notizia', short: 'Nessuna notizia', icon: 'fa-question', text: 'text-slate-600',  bg: 'bg-slate-50',    ring: 'border-slate-200',   solid: 'bg-slate-500' },
};
const DEFAULT_NOTES = ['Aperta.', 'Limitata.', 'Chiusa.', 'Aggiornata.', ''];

let stations = [];
let loaded = false, loadFailed = false;
let filter = 'all', query = '';
let me = null, meMarker = null;          // posizione, solo dopo "Vicino a me"
let map = null, markers = {};
let openId = null;                        // pompa nella scheda
let sheetMode = null;                     // 'station' | 'add' | 'help'
let myVoterId = null, secretCache = null, pendingVotes = 0;

// ---------- utilità ----------
const $ = (id) => document.getElementById(id);
const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function km(a, b) { const dLat = (a.lat - b.lat) * 111, dLng = (a.lng - b.lng) * 111 * Math.cos(a.lat * Math.PI / 180); return Math.hypot(dLat, dLng); }
function fmtKm(d) { return d < 1 ? `${Math.round(d * 100) * 10} m` : `${d.toFixed(1).replace('.', ',')} km`; }
function ago(ts) {
    if (!ts) return '';
    const m = Math.max(0, Math.round((Date.now() - ts) / 60000));
    if (m < 1) return 'adesso';
    if (m < 60) return `${m} min fa`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} ${h === 1 ? 'ora' : 'ore'} fa`;
    const d = Math.floor(h / 24);
    return `${d} ${d === 1 ? 'giorno' : 'giorni'} fa`;
}
const clock = (ts) => { const d = new Date(ts); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
const isStale = (st) => st.status !== 'unverified' && st.lastUpdated && Date.now() - st.lastUpdated > STALE_MS;
const myVote = (st) => (myVoterId && st.votes && st.votes[myVoterId]) || null;

let toastTimer = null;
function toast(text, actionLabel, action) {
    const t = $('toast'), a = $('toastAction');
    $('toastText').textContent = text;
    a.classList.toggle('hidden', !actionLabel);
    a.textContent = actionLabel || '';
    a.onclick = () => { t.classList.replace('flex', 'hidden'); action && action(); };
    t.classList.replace('hidden', 'flex');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.replace('flex', 'hidden'), actionLabel ? 6000 : 3500);
}

// ---------- identità (stessa del sito) ----------
function voterSecret() {
    if (secretCache) return secretCache;
    try { secretCache = localStorage.getItem('bn-voter-secret'); } catch (e) {}
    if (!secretCache || !/^[0-9a-f]{64}$/.test(secretCache)) {
        secretCache = [...crypto.getRandomValues(new Uint8Array(32))].map(b => b.toString(16).padStart(2, '0')).join('');
        try { localStorage.setItem('bn-voter-secret', secretCache); } catch (e) {}
    }
    return secretCache;
}
async function computeVoterId() {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('voter:' + voterSecret()));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 24);
}

// ---------- dati ----------
function fromApi(s) {
    return normalizeStation({ ...s, status: 'unverified', lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: 'Non indicata', lastNote: '' });
}
async function apiPost(url, body) {
    let res, data = {};
    try {
        res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, secret: voterSecret() }) });
        data = await res.json().catch(() => ({}));
    } catch (e) { throw new Error('Connessione non riuscita. Controlla la rete e riprova.'); }
    if (!res.ok) throw new Error(data.error || 'Errore del server. Riprova tra poco.');
    return data;
}
let loading = false;
async function load() {
    if (loading || pendingVotes) return;
    loading = true;
    try {
        const early = window.__stationsRequest; window.__stationsRequest = null;
        const res = (early && await early) || await fetch('/api/stations', { cache: 'no-store' });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !Array.isArray(data.stations)) throw new Error(data.error || `HTTP ${res.status}`);
        if (pendingVotes) return;
        stations = data.stations.filter(s => /^bn-(station|custom)-\d+$/.test(s.id)).map(fromApi);
        const first = !loaded;
        loaded = true; loadFailed = false;
        setLive(true);
        render();
        if (first) { frameMap(); openFromUrl(); }
        if (sheetMode === 'station' && openId) renderStationSheet();
    } catch (e) {
        console.warn(e);
        if (!loaded) loadFailed = true;
        setLive(false);
        render();
    } finally { loading = false; }
}
function setLive(ok) {
    $('liveStatus').innerHTML = ok
        ? '<span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 align-middle animate-pulse"></span>Aggiornato in tempo reale dai cittadini'
        : '<span class="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mr-1 align-middle"></span>Connessione assente: riprovo…';
}

// ---------- elenco ----------
const ORDER = { available: 0, limited: 1, closed: 2, unverified: 3 };
function visibleStations() {
    const q = query.trim().toLowerCase();
    return stations.filter(st => {
        if (filter !== 'all' && st.status !== filter) return false;
        return !q || [st.name, st.brand, st.address, st.zone, st.comune].some(v => (v || '').toLowerCase().includes(q));
    }).sort((a, b) => {
        if (me) return km(me, a) - km(me, b);
        // prima le notizie utili: aperte, con code, esaurite, senza notizie; dentro ogni gruppo le più fresche
        const ga = ORDER[a.status] + (isStale(a) ? 0.5 : 0), gb = ORDER[b.status] + (isStale(b) ? 0.5 : 0);
        return ga !== gb ? ga - gb : (b.lastUpdated || 0) - (a.lastUpdated || 0);
    });
}

function renderSummary() {
    const n = (s) => stations.filter(st => st.status === s).length;
    const chips = [
        ['all', 'Tutte', stations.length, 'fa-gas-pump', 'text-slate-700'],
        ['available', 'Aperte', n('available'), 'fa-check', 'text-emerald-600'],
        ['limited', 'Con code', n('limited'), 'fa-hourglass-half', 'text-amber-600'],
        ['closed', 'Esaurite', n('closed'), 'fa-xmark', 'text-red-600'],
        ['unverified', 'Senza notizie', n('unverified'), 'fa-question', 'text-slate-500'],
    ];
    $('summary').innerHTML = chips.map(([k, label, count, icon, color]) => `
        <button onclick="setFilter('${k}')" aria-pressed="${filter === k}" class="shrink-0 inline-flex items-center gap-1.5 h-10 px-3 rounded-xl border text-[14px] font-semibold transition ${filter === k ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'}">
            <i class="fa-solid ${icon} ${filter === k ? 'text-amber-400' : color}"></i>${label}<span class="font-extrabold">${loaded ? count : '–'}</span>
        </button>`).join('');
}

function queueText(st) { return st.status !== 'closed' && QUEUE_LABELS[st.queueLevel] ? QUEUE_LABELS[st.queueLevel] : ''; }

function renderList() {
    const el = $('list');
    if (!loaded) {
        el.innerHTML = loadFailed
            ? '<p class="px-4 py-10 text-center text-[15px] text-slate-600"><i class="fa-solid fa-plug-circle-exclamation text-2xl text-slate-400 block mb-2"></i>Non riesco a caricare i distributori.<br>Controlla la connessione: riprovo da solo.</p>'
            : Array.from({ length: 5 }, () => '<div class="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 animate-pulse"><span class="w-10 h-10 rounded-full bg-slate-200"></span><span class="flex-1 space-y-2"><span class="block h-3.5 w-2/3 bg-slate-200 rounded"></span><span class="block h-3 w-1/2 bg-slate-100 rounded"></span></span></div>').join('');
        return;
    }
    const list = visibleStations();
    $('listTitle').textContent = `${list.length} ${list.length === 1 ? 'distributore' : 'distributori'}${filter !== 'all' ? ' · ' + STATUS[filter].label.toLowerCase() : ''}`;
    $('listOrder').textContent = me ? 'dal più vicino' : 'prima le notizie utili';
    if (!list.length) {
        el.innerHTML = `<p class="px-4 py-10 text-center text-[15px] text-slate-600">Nessun distributore${query ? ` per "${esc(query)}"` : ''} in questo filtro.<br><button onclick="setFilter('all'); $('search').value=''; onSearch('')" class="mt-3 px-4 h-10 rounded-xl bg-slate-900 text-white font-bold">Mostra tutti</button></p>`;
        return;
    }
    el.innerHTML = list.map(st => {
        const s = STATUS[st.status], stale = isStale(st), mine = myVote(st), q = queueText(st);
        const where = [st.address, me ? fmtKm(km(me, st)) : st.zone].filter(Boolean).join(' · ');
        return `
        <button role="listitem" onclick="openStation('${esc(st.id)}')" class="w-full text-left flex items-center gap-3 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 focus:bg-amber-50 focus:outline-none ${openId === st.id ? 'bg-amber-50' : ''}">
            <span class="w-10 h-10 rounded-full ${s.solid} ${stale ? 'opacity-50' : ''} text-white flex items-center justify-center shrink-0"><i class="fa-solid ${s.icon}"></i></span>
            <span class="flex-1 min-w-0">
                <span class="block text-[15px] font-bold text-slate-900 truncate">${esc(st.name)}</span>
                <span class="block text-[13px] text-slate-500 truncate">${esc(where)}</span>
                ${q ? `<span class="inline-flex items-center gap-1 mt-0.5 text-[12px] font-semibold ${st.queueLevel === 'Scorrevole' ? 'text-emerald-700' : 'text-amber-700'}"><i class="fa-solid fa-car-side"></i>${esc(q)}</span>` : ''}
            </span>
            <span class="text-right shrink-0 max-w-[38%]">
                <span class="block text-[14px] font-bold ${stale ? 'text-slate-500' : s.text}">${s.short}</span>
                <span class="block text-[12px] ${stale ? 'text-amber-700 font-semibold' : 'text-slate-500'}">${st.lastUpdated ? (stale ? 'da confermare · ' : '') + ago(st.lastUpdated) : 'sei lì? segnala'}</span>
                ${mine ? '<span class="block text-[11px] text-blue-700 font-semibold">hai votato</span>' : ''}
            </span>
        </button>`;
    }).join('');
}

// ---------- mappa ----------
function initMap() {
    if (map || !window.L) return;
    map = L.map('map', { zoomControl: true, attributionControl: true }).setView([BENEVENTO.lat, BENEVENTO.lng], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(map);
    map.on('click', () => { if (sheetMode === 'station') closeSheet(); });
    if (window.ResizeObserver) new ResizeObserver(() => map.invalidateSize()).observe($('map'));
}
function renderMarkers() {
    if (!map) return;
    Object.values(markers).forEach(m => map.removeLayer(m));
    markers = {};
    const ids = new Set(visibleStations().map(s => s.id));
    stations.forEach(st => {
        if (!ids.has(st.id)) return;
        const sel = openId === st.id, stale = isStale(st);
        const icon = L.divIcon({ className: '', html: `<div class="pin pin-${st.status}${stale ? ' pin-stale' : ''}${sel ? ' pin-selected' : ''}"><i class="fa-solid ${STATUS[st.status].icon}"></i></div>`, iconSize: [34, 34], iconAnchor: [17, 17] });
        const z = sel ? 1000 : st.status === 'unverified' ? 0 : stale ? 100 : 500;
        markers[st.id] = L.marker([st.lat, st.lng], { icon, zIndexOffset: z, title: st.name, keyboard: true }).on('click', () => openStation(st.id)).addTo(map);
    });
}
function frameMap() {
    if (!map) return;
    const pts = stations.filter(s => km(s, BENEVENTO) < 6).map(s => [s.lat, s.lng]);
    if (pts.length > 1) map.fitBounds(pts, { padding: [24, 24], maxZoom: 15 });
}

function render() { renderSummary(); renderList(); renderMarkers(); }
window.setFilter = (f) => { filter = f; render(); };
window.onSearch = (v) => { query = v; render(); };

// ---------- vicino a me ----------
function setNearBtn(on) {
    const btn = $('nearBtn');
    ['bg-blue-600', 'text-white', 'border-blue-600'].forEach(c => btn.classList.toggle(c, on));
    ['bg-white', 'text-slate-800', 'border-slate-300'].forEach(c => btn.classList.toggle(c, !on));
    btn.setAttribute('aria-pressed', on);
}
window.toggleNearMe = function () {
    if (me) {
        me = null;
        if (meMarker) { map.removeLayer(meMarker); meMarker = null; }
        setNearBtn(false);
        render(); frameMap();
        return;
    }
    if (!navigator.geolocation) return toast('Questo browser non può dare la posizione.');
    toast('Cerco la tua posizione…');
    navigator.geolocation.getCurrentPosition((p) => {
        me = { lat: p.coords.latitude, lng: p.coords.longitude };
        setNearBtn(true);
        if (map) {
            meMarker = L.marker([me.lat, me.lng], { icon: L.divIcon({ className: '', html: '<div class="pin-me"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }), zIndexOffset: 2000, title: 'Tu sei qui' }).addTo(map);
            const near = visibleStations().slice(0, 3).map(s => [s.lat, s.lng]);
            map.fitBounds([[me.lat, me.lng], ...near], { padding: [40, 40], maxZoom: 15 });
        }
        render();
        toast('Ordinati dal più vicino.');
    }, (err) => toast(err.code === 1 ? 'Accesso alla posizione negato: puoi riattivarlo dalle impostazioni del browser.' : 'Non riesco a trovarti. Riprova tra poco.'),
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
};

// ---------- scheda (in basso su telefono, a lato su computer) ----------
function showSheet(html) {
    const sh = $('sheet');
    sh.innerHTML = `<div class="lg:hidden pt-2.5 pb-1 flex justify-center"><span class="w-10 h-1.5 rounded-full bg-slate-300"></span></div>${html}`;
    sh.classList.remove('closed');
    $('sheetBackdrop').classList.remove('hidden');
    sh.scrollTop = 0;
}
window.closeSheet = function (fromHistory) {
    if (!sheetMode) return;
    $('sheet').classList.add('closed');
    $('sheetBackdrop').classList.add('hidden');
    sheetMode = null; openId = null;
    if (!fromHistory && history.state && history.state.sheet) history.back();
    render();
};
// il tasto "indietro" del telefono chiude la scheda invece di uscire dal sito
window.addEventListener('popstate', () => { if (sheetMode) closeSheet(true); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });
function pushSheetState(url) { if (!(history.state && history.state.sheet)) history.pushState({ sheet: true }, '', url || location.href); else history.replaceState({ sheet: true }, '', url || location.href); }

const closeBtn = '<button onclick="closeSheet()" aria-label="Chiudi" class="w-10 h-10 shrink-0 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"><i class="fa-solid fa-xmark"></i></button>';

window.openStation = function (id) {
    const st = stations.find(s => s.id === id);
    if (!st) return;
    openId = id; sheetMode = 'station';
    pushSheetState(`?p=${encodeURIComponent(id)}`);
    renderStationSheet();
    render();
    if (map) map.panTo([st.lat, st.lng], { animate: true });
};

function renderStationSheet() {
    const st = stations.find(s => s.id === openId);
    if (!st) return closeSheet();
    const s = STATUS[st.status], stale = isStale(st), mine = myVote(st), counts = voteCounts(st);
    const total = counts.available + counts.limited + counts.closed;
    const q = queueText(st);
    const fuels = st.status !== 'unverified' && st.status !== 'closed' ? [['benzina', 'Benzina'], ['diesel', 'Diesel'], ['gpl', 'GPL']].filter(([k]) => typeof st.fuels?.[k] === 'boolean') : [];
    const note = st.lastNote && !DEFAULT_NOTES.includes(st.lastNote) ? st.lastNote : '';
    const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${st.lat},${st.lng}`;
    const showStep2 = mine && mine.status !== 'closed';
    showSheet(`
        <div class="px-5 pt-2 pb-safe">
            <div class="flex items-start gap-3">
                <div class="flex-1 min-w-0">
                    <h2 id="sheetTitle" class="text-[20px] font-extrabold leading-tight">${esc(st.name)}</h2>
                    <p class="text-[14px] text-slate-500 mt-0.5">${esc(st.address)} · ${esc(st.zone)}${me ? ' · ' + fmtKm(km(me, st)) : ''}</p>
                </div>
                ${closeBtn}
            </div>
            <div class="flex gap-2 mt-3">
                <a href="${dirUrl}" target="_blank" rel="noopener" class="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-blue-600 text-white text-[14px] font-bold"><i class="fa-solid fa-diamond-turn-right"></i> Indicazioni</a>
                <button onclick="shareStation()" class="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-slate-300 text-[14px] font-bold"><i class="fa-solid fa-share-nodes"></i> Condividi</button>
            </div>

            <div class="mt-4 rounded-2xl border ${s.ring} ${s.bg} p-4">
                <div class="flex items-center gap-3">
                    <span class="w-12 h-12 rounded-full ${s.solid} ${stale ? 'opacity-50' : ''} text-white text-xl flex items-center justify-center shrink-0"><i class="fa-solid ${s.icon}"></i></span>
                    <div>
                        <div class="text-[20px] font-extrabold ${s.text}">${s.label}</div>
                        <div class="text-[13px] text-slate-600">${st.lastUpdated ? `Ultimo voto ${ago(st.lastUpdated)} (alle ${clock(st.lastUpdated)})` : 'Ancora nessuna segnalazione'}</div>
                    </div>
                </div>
                ${stale ? '<p class="mt-3 text-[13px] font-semibold text-amber-800"><i class="fa-solid fa-clock-rotate-left mr-1"></i>Notizia di più di 3 ore fa: se sei lì, confermala o correggila.</p>' : ''}
                ${q ? `<p class="mt-3 text-[14px] font-semibold ${st.queueLevel === 'Scorrevole' ? 'text-emerald-800' : 'text-amber-800'}"><i class="fa-solid fa-car-side mr-1.5"></i>${esc(q)}${st.queueTs ? ` <span class="font-normal text-slate-500">· ${ago(st.queueTs)}</span>` : ''}</p>` : ''}
                ${fuels.length ? `<p class="mt-2 flex flex-wrap gap-1.5">${fuels.map(([k, l]) => `<span class="px-2 py-0.5 rounded-lg text-[13px] font-semibold ${st.fuels[k] ? 'bg-white text-emerald-800' : 'bg-white/60 text-slate-400 line-through'}">${l}</span>`).join('')}</p>` : ''}
                ${note ? `<p class="mt-2 text-[14px] text-slate-700 italic">"${esc(note)}"</p>` : ''}
                ${total ? `<p class="mt-3 text-[12px] text-slate-500">Negli ultimi voti: ${counts.available} aperta · ${counts.limited} code · ${counts.closed} esaurita <button onclick="openHowItWorks()" class="underline">come si decide</button></p>` : ''}
            </div>

            <div class="mt-5">
                <h3 class="text-[16px] font-extrabold">${mine ? 'Il tuo voto' : 'Sei lì adesso? Com’è la situazione?'}</h3>
                <p class="text-[13px] text-slate-500 mb-2.5">${mine ? `Hai votato ${ago(mine.ts)}. Puoi cambiarlo quando vuoi.` : 'Un tocco basta: il voto vale per tutti i cittadini.'}</p>
                <div class="grid grid-cols-3 gap-2">
                    ${['available', 'limited', 'closed'].map(k => {
                        const on = mine && mine.status === k, c = STATUS[k];
                        return `<button onclick="vote('${k}')" aria-pressed="${!!on}" class="h-20 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 text-[14px] font-bold transition active:scale-95 ${on ? `${c.solid} border-transparent text-white` : `bg-white ${c.ring} ${c.text}`}"><i class="fa-solid ${c.icon} text-lg"></i>${c.short}${on ? '<span class="text-[11px] font-semibold opacity-90">il tuo voto</span>' : ''}</button>`;
                    }).join('')}
                </div>
                ${showStep2 ? `
                <div class="mt-3 rounded-2xl bg-slate-50 border border-slate-200 p-3.5 space-y-3">
                    <div>
                        <div class="text-[14px] font-bold mb-1.5"><i class="fa-solid fa-car-side mr-1 text-slate-500"></i>C’è coda?</div>
                        <div class="flex flex-wrap gap-1.5">${QUEUE_CHOICES.map(qq => `<button onclick="setQueue('${qq}')" aria-pressed="${mine.queueLevel === qq}" class="h-10 px-3 rounded-xl border text-[13px] font-semibold ${mine.queueLevel === qq ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-300 hover:bg-slate-100'}">${QUEUE_LABELS[qq]}</button>`).join('')}</div>
                    </div>
                    <div>
                        <div class="text-[14px] font-bold mb-1.5"><i class="fa-solid fa-gas-pump mr-1 text-slate-500"></i>Cosa c’è? <span class="font-normal text-slate-500">(tocca per indicare)</span></div>
                        <div class="flex flex-wrap gap-1.5">${[['benzina', 'Benzina'], ['diesel', 'Diesel'], ['gpl', 'GPL']].map(([k, l]) => { const v = mine.fuels?.[k]; return `<button onclick="toggleFuel('${k}')" class="h-10 px-3 rounded-xl border text-[13px] font-semibold ${v === true ? 'bg-emerald-600 border-emerald-600 text-white' : v === false ? 'bg-white border-slate-300 text-slate-400 line-through' : 'bg-white border-slate-300'}">${v === true ? '<i class="fa-solid fa-check mr-1"></i>' : v === false ? '<i class="fa-solid fa-xmark mr-1"></i>' : ''}${l}</button>`; }).join('')}</div>
                    </div>
                </div>` : ''}
                ${mine ? '<button onclick="vote(null)" class="mt-3 text-[13px] font-semibold text-red-700 underline">Togli il mio voto</button>' : ''}
            </div>
        </div>`);
}

// voto: si salva subito al primo tocco; coda e carburanti lo aggiornano dopo
async function sendVote(stationId, v, previous) {
    const i = stations.findIndex(s => s.id === stationId);
    if (i === -1) return false;
    if (!myVoterId) { toast('Il dispositivo non è pronto: ricarica la pagina.'); return false; }
    const before = stations[i];
    stations[i] = applyVoteToStation(before, myVoterId, v);
    render(); if (openId === stationId) renderStationSheet();
    pendingVotes++;
    try {
        const data = await apiPost('/api/vote', { stationId, vote: v });
        const j = stations.findIndex(s => s.id === stationId);
        if (j !== -1 && data.station) stations[j] = fromApi(data.station);
        return true;
    } catch (e) {
        const j = stations.findIndex(s => s.id === stationId);
        if (j !== -1) stations[j] = before;
        toast('Voto NON salvato: ' + e.message);
        return false;
    } finally {
        pendingVotes--;
        render(); if (openId === stationId) renderStationSheet();
    }
}
window.vote = async function (status) {
    const st = stations.find(s => s.id === openId);
    if (!st) return;
    const prev = myVote(st);
    if (status && prev && prev.status === status) return; // già votato così: si cambia coda/carburanti sotto
    const v = status === null ? null : {
        status, ts: Date.now(),
        fuels: status === 'closed' ? { benzina: false, diesel: false, gpl: false } : { benzina: null, diesel: null, gpl: null },
        queueLevel: status === 'closed' ? 'Nessuna' : 'Non indicata',
        note: status === 'available' ? 'Aperta.' : status === 'limited' ? 'Limitata.' : 'Chiusa.',
    };
    const id = st.id;
    if (await sendVote(id, v)) {
        toast(status ? `Voto registrato: ${STATUS[status].short}` : 'Voto tolto', 'Annulla', () => sendVote(id, prev ? { ...prev, ts: Date.now() } : null));
    }
};
window.setQueue = async function (q) {
    const st = stations.find(s => s.id === openId), mine = st && myVote(st);
    if (!mine || mine.queueLevel === q) return;
    if (await sendVote(st.id, { ...mine, queueLevel: q, ts: Date.now() })) toast(`Grazie: ${QUEUE_LABELS[q].toLowerCase()}`);
};
window.toggleFuel = async function (k) {
    const st = stations.find(s => s.id === openId), mine = st && myVote(st);
    if (!mine) return;
    const v = mine.fuels?.[k];
    const next = v === null || v === undefined ? true : v === true ? false : null; // non indicato → c'è → non c'è → non indicato
    await sendVote(st.id, { ...mine, fuels: { ...(mine.fuels || {}), [k]: next }, ts: Date.now() });
};

window.shareStation = async function () {
    const st = stations.find(s => s.id === openId);
    if (!st) return;
    const url = `${location.origin}/?p=${encodeURIComponent(st.id)}`;
    const text = `⛽ ${st.name}: ${STATUS[st.status].label.toLowerCase()}${st.lastUpdated ? ` (${ago(st.lastUpdated)})` : ''}. Guarda e aggiorna anche tu:`;
    if (navigator.share) { try { await navigator.share({ title: 'Benzina Benevento Live', text, url }); return; } catch (e) { if (e.name === 'AbortError') return; } }
    try { await navigator.clipboard.writeText(`${text} ${url}`); toast('Link copiato: incollalo dove vuoi.'); }
    catch (e) { window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank', 'noopener'); }
};

function openFromUrl() {
    const id = new URLSearchParams(location.search).get('p');
    if (id && stations.some(s => s.id === id)) { history.replaceState(null, '', location.pathname); openStation(id); }
}

// ---------- come funziona ----------
window.openHowItWorks = function () {
    sheetMode = 'help'; openId = null;
    pushSheetState();
    showSheet(`
        <div class="px-5 pt-2 pb-safe">
            <div class="flex items-start gap-3"><h2 id="sheetTitle" class="flex-1 text-[20px] font-extrabold">Come funziona</h2>${closeBtn}</div>
            <div class="mt-3 space-y-3 text-[15px] text-slate-700">
                <p><strong>Lo stato lo segnalano i cittadini.</strong> Chi passa davanti a una pompa la vota: Aperta, Code o Esaurita. Non serve registrarsi.</p>
                <p><strong>Un voto a persona per pompa.</strong> Puoi cambiarlo o toglierlo quando vuoi.</p>
                <p><strong>Vince lo stato con più voti.</strong> A parità vince il più prudente (Esaurita, poi Code, poi Aperta): meglio non mandare nessuno a vuoto.</p>
                <p><strong>Le notizie invecchiano.</strong> Se per 45 minuti nessuno conferma lo stato, il primo voto diverso lo cambia subito. Dopo 3 ore senza conferme la pompa appare tratteggiata: la notizia potrebbe non valere più.</p>
                <p><strong>Code e carburanti</strong> sono quelli indicati nell’ultima segnalazione.</p>
                <p class="text-[13px] text-slate-500">Il sito non chiede nomi né account. Per riconoscere il tuo voto usa un codice casuale salvato solo sul tuo telefono.</p>
            </div>
        </div>`);
};

// ---------- nuovo distributore ----------
let addState = null;
window.openAddStation = function () {
    sheetMode = 'add'; openId = null;
    addState = { step: 1, name: '', address: '', comune: 'Benevento', pos: null, brand: 'Pompa Bianca', status: null, zone: '' };
    pushSheetState();
    renderAddSheet();
};
function renderAddSheet() {
    const a = addState;
    const near = a.pos ? stations.filter(s => km(s, a.pos) < 0.2) : [];
    showSheet(`
        <div class="px-5 pt-2 pb-safe">
            <div class="flex items-start gap-3"><h2 id="sheetTitle" class="flex-1 text-[20px] font-extrabold">Segnala una pompa che manca</h2>${closeBtn}</div>
            <p class="text-[13px] text-slate-500 mt-1">Passo ${a.step} di 2</p>
            ${a.step === 1 ? `
            <form onsubmit="event.preventDefault(); addFind()" class="mt-4 space-y-3">
                <label class="block"><span class="text-[14px] font-bold">Nome del distributore</span>
                    <input id="addName" required maxlength="50" value="${esc(a.name)}" placeholder="Es. Oroil, Esso via Napoli" class="mt-1 w-full h-12 px-3 rounded-xl border border-slate-300 text-[16px]"></label>
                <label class="block"><span class="text-[14px] font-bold">Via (e numero, se lo sai)</span>
                    <input id="addAddress" required maxlength="70" value="${esc(a.address)}" placeholder="Es. Via Napoli 121" class="mt-1 w-full h-12 px-3 rounded-xl border border-slate-300 text-[16px]"></label>
                <label class="block"><span class="text-[14px] font-bold">Comune</span>
                    <input id="addComune" required maxlength="40" value="${esc(a.comune)}" class="mt-1 w-full h-12 px-3 rounded-xl border border-slate-300 text-[16px]"></label>
                <button id="addFindBtn" class="w-full h-12 rounded-xl bg-slate-900 text-white text-[15px] font-bold"><i class="fa-solid fa-map-location-dot mr-1.5"></i>Trova sulla mappa</button>
            </form>` : `
            <div class="mt-3">
                <div id="addMap" class="h-48 rounded-2xl overflow-hidden border border-slate-200"></div>
                <p class="text-[13px] text-slate-500 mt-1.5"><i class="fa-solid fa-hand-pointer mr-1"></i>Se il punto non è giusto, trascina il segnaposto sulla pompa.</p>
                ${near.length ? `<div class="mt-3 rounded-2xl bg-amber-50 border border-amber-200 p-3 text-[14px]"><strong>Forse c’è già:</strong>${near.map(s => `<button onclick="openStation('${esc(s.id)}')" class="block mt-1.5 text-left underline">${esc(s.name)} · ${esc(s.address)}</button>`).join('')}</div>` : ''}
                <label class="block mt-4"><span class="text-[14px] font-bold">Marchio</span>
                    <select id="addBrand" onchange="addState.brand=this.value" class="mt-1 w-full h-12 px-3 rounded-xl border border-slate-300 text-[16px] bg-white">
                        ${['Eni', 'Q8', 'Esso', 'IP', 'Tamoil', 'Energas', 'Pompa Bianca'].map(b => `<option value="${b}" ${a.brand === b ? 'selected' : ''}>${b === 'Pompa Bianca' ? 'Altro / pompa bianca' : b}</option>`).join('')}
                    </select></label>
                <div class="mt-4"><span class="text-[14px] font-bold">Com’è adesso?</span>
                    <div class="grid grid-cols-4 gap-1.5 mt-1">${[['available', 'Aperta'], ['limited', 'Code'], ['closed', 'Esaurita'], [null, 'Non so']].map(([k, l]) => `<button onclick="addState.status=${k ? `'${k}'` : 'null'}; renderAddSheet()" class="h-12 rounded-xl border text-[13px] font-bold ${a.status === k ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-300'}">${l}</button>`).join('')}</div>
                </div>
                <div class="flex gap-2 mt-5">
                    <button onclick="addState.step=1; renderAddSheet()" class="h-12 px-4 rounded-xl bg-slate-100 font-bold">Indietro</button>
                    <button id="addSaveBtn" onclick="addSave()" class="flex-1 h-12 rounded-xl bg-amber-400 text-slate-900 text-[15px] font-extrabold">Aggiungi alla mappa</button>
                </div>
            </div>`}
        </div>`);
    if (a.step === 2) setTimeout(() => {
        const m = L.map('addMap', { zoomControl: false, attributionControl: false }).setView([a.pos.lat, a.pos.lng], 17);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(m);
        L.marker([a.pos.lat, a.pos.lng], { draggable: true, icon: L.divIcon({ className: '', html: '<div class="pin pin-unverified"><i class="fa-solid fa-gas-pump"></i></div>', iconSize: [34, 34], iconAnchor: [17, 17] }) })
            .on('dragend', (e) => { const ll = e.target.getLatLng(); a.pos = { lat: ll.lat, lng: ll.lng }; }).addTo(m);
    }, 50);
}
async function nominatim(params) {
    const url = 'https://nominatim.openstreetmap.org/' + params;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    return res.ok ? res.json() : null;
}
window.addFind = async function () {
    const a = addState;
    a.name = $('addName').value.trim(); a.address = $('addAddress').value.trim(); a.comune = $('addComune').value.trim() || 'Benevento';
    const btn = $('addFindBtn'); btn.disabled = true; btn.textContent = 'Cerco…';
    try {
        const hits = await nominatim(`search?format=jsonv2&limit=1&countrycodes=it&q=${encodeURIComponent(`${a.address}, ${a.comune}`)}`);
        if (!hits || !hits[0]) { toast('Indirizzo non trovato: controlla via e comune.'); return; }
        let pos = { lat: Number(hits[0].lat), lng: Number(hits[0].lon) };
        // il distributore vero vicino (per nome o marchio) è più preciso della via
        const d = 0.006, vb = `${pos.lng - d},${pos.lat + d},${pos.lng + d},${pos.lat - d}`;
        const fuel = await nominatim(`search?format=jsonv2&limit=5&countrycodes=it&bounded=1&viewbox=${vb}&q=${encodeURIComponent(a.name.split(' - ')[0])}`).catch(() => null);
        const f = (fuel || []).find(h => h.category === 'amenity' && h.type === 'fuel');
        if (f) pos = { lat: Number(f.lat), lng: Number(f.lon) };
        const rev = await nominatim(`reverse?format=jsonv2&zoom=16&lat=${pos.lat}&lon=${pos.lng}`).catch(() => null);
        const ad = rev?.address || {};
        a.zone = (ad.suburb || ad.quarter || ad.neighbourhood || a.comune).slice(0, 40);
        a.pos = pos; a.step = 2;
        renderAddSheet();
    } catch (e) {
        toast('Ricerca non riuscita: riprova tra poco.');
    } finally { if ($('addFindBtn')) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-map-location-dot mr-1.5"></i>Trova sulla mappa'; } }
};
window.addSave = async function () {
    const a = addState, btn = $('addSaveBtn');
    btn.disabled = true; btn.textContent = 'Salvataggio…';
    const v = a.status ? { status: a.status, fuels: a.status === 'closed' ? { benzina: false, diesel: false, gpl: false } : { benzina: null, diesel: null, gpl: null }, queueLevel: a.status === 'closed' ? 'Nessuna' : 'Non indicata', note: '' } : null;
    try {
        const data = await apiPost('/api/stations', { station: { name: a.name, brand: a.brand, address: a.address, zone: a.zone || a.comune, comune: /^benevento$/i.test(a.comune) ? '' : a.comune, lat: a.pos.lat, lng: a.pos.lng }, vote: v });
        const st = fromApi(data.station);
        stations = [st, ...stations.filter(s => s.id !== st.id)];
        toast('Grazie! Pompa aggiunta alla mappa.');
        openStation(st.id);
    } catch (e) {
        toast('Non salvata: ' + e.message);
        btn.disabled = false; btn.textContent = 'Aggiungi alla mappa';
    }
};

// ---------- notizie ----------
async function loadNews() {
    try {
        const data = await (await fetch('/api/press-news')).json();
        const items = (data.items || []).slice(0, 6);
        $('newsCount').textContent = items.length ? `(${items.length})` : '';
        $('newsList').innerHTML = items.length ? items.map(it => `<li><a href="${/^https?:\/\//.test(it.link) ? esc(it.link) : '#'}" target="_blank" rel="noopener" class="font-semibold hover:underline">${esc(it.title)}</a><div class="text-[12px] text-slate-500">${esc(it.source)}${it.publishedAt ? ' · ' + ago(it.publishedAt) : ''}</div></li>`).join('') : '<li class="text-slate-500">Nessuna notizia recente.</li>';
    } catch (e) { $('newsCount').textContent = ''; }
}

// ---------- avvio ----------
(async function start() {
    try { initMap(); } catch (e) { console.error('Mappa non avviata', e); }
    render();
    try { myVoterId = await computeVoterId(); } catch (e) { console.warn(e); }
    await load();
    let timer = setInterval(load, POLL_MS);
    document.addEventListener('visibilitychange', () => { clearInterval(timer); if (!document.hidden) { load(); timer = setInterval(load, POLL_MS); } });
    loadNews();
})();
