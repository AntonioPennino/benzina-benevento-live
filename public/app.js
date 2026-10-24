// Benzina Benevento Live: logica della pagina. Dati e voti passano dalle API del sito (functions/api);
// la regola che decide lo stato di una pompa è in regole.js.

const POLL_MS = 20000;
const STALE_MS = 3 * 60 * 60 * 1000;
const BENEVENTO = { lat: 41.1300, lng: 14.7820 };
const STATUS = {
    available:  { label: 'Aperta',          short: 'Aperta',   icon: 'fa-check',          text: 'text-emerald-700', bg: 'bg-emerald-50',  ring: 'border-emerald-200', solid: 'bg-emerald-600' },
    limited:    { label: 'Limitata', short: 'Limitata', icon: 'fa-exclamation', text: 'text-amber-700',   bg: 'bg-amber-50',    ring: 'border-amber-200',   solid: 'bg-amber-500' },
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
// aperta ma con coda segnalata: segnaposto verde con la clessidra (la coda si vota a parte)
const BUSY_QUEUES = ['Moderata', 'Lunga', 'Presidio TIR / Disagi'];
const hasQueue = (st) => st.status === 'available' && BUSY_QUEUES.includes(st.queueLevel);
const iconOf = (st) => hasQueue(st) ? 'fa-hourglass-half' : STATUS[st.status].icon;
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
    const chip = ([k, label, icon, color]) => `
        <button onclick="setFilter('${k}')" aria-pressed="${filter === k}" class="min-w-0 inline-flex items-center justify-center gap-1.5 h-11 px-2 rounded-xl border text-[14px] font-semibold transition ${filter === k ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'}">
            <i class="fa-solid ${icon} ${filter === k ? 'text-amber-400' : color}"></i><span class="truncate">${label}</span><span class="font-extrabold">${loaded ? (k === 'all' ? stations.length : n(k)) : '–'}</span>
        </button>`;
    $('summary').innerHTML = `
        <div class="grid grid-cols-2 gap-2">${[['all', 'Tutte', 'fa-gas-pump', 'text-slate-700'], ['unverified', 'Senza notizie', 'fa-question', 'text-slate-500']].map(chip).join('')}</div>
        <div class="grid grid-cols-3 gap-2 mt-2">${[['available', 'Aperte', 'fa-check', 'text-emerald-600'], ['limited', 'Limitate', 'fa-exclamation', 'text-amber-600'], ['closed', 'Esaurite', 'fa-xmark', 'text-red-600']].map(chip).join('')}</div>`;
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
        <div role="listitem" data-id="${esc(st.id)}"><button onclick="openStation('${esc(st.id)}')" class="w-full text-left flex items-center gap-3 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 focus:bg-amber-50 focus:outline-none ${openId === st.id ? 'bg-amber-50' : ''}">
            <span class="w-10 h-10 rounded-full ${s.solid} ${stale ? 'opacity-50' : ''} text-white flex items-center justify-center shrink-0"><i class="fa-solid ${iconOf(st)}"></i></span>
            <span class="flex-1 min-w-0">
                <span class="block text-[15px] font-bold text-slate-900 truncate">${esc(st.name)}</span>
                <span class="block text-[13px] text-slate-500 truncate">${esc(where)}</span>
                ${q ? `<span class="inline-flex items-center gap-1 mt-0.5 text-[12px] font-semibold ${st.queueLevel === 'Scorrevole' ? 'text-emerald-700' : 'text-amber-700'}"><i class="fa-solid fa-car-side"></i>${esc(q)}</span>` : ''}
            </span>
            <span class="text-right shrink-0 max-w-[38%]">
                <span class="block text-[14px] font-bold ${stale ? 'text-slate-500' : s.text}">${s.short}</span>
                <span class="block text-[12px] ${stale ? 'text-amber-700 font-semibold' : 'text-slate-500'}">${st.lastUpdated ? (stale ? 'da confermare · ' : '') + ago(st.lastUpdated) : 'sei lì? segnala'}</span>
                ${Object.keys(st.votes || {}).length ? `<span class="block text-[11px] text-slate-500">${Object.keys(st.votes).length} ${Object.keys(st.votes).length === 1 ? 'segnalazione' : 'segnalazioni'}</span>` : ''}
                ${mine ? '<span class="block text-[11px] text-blue-700 font-semibold">hai votato</span>' : ''}
            </span>
        </button></div>`;
    }).join('');
}

// ---------- mappa ----------
function initMap() {
    if (map || !window.L) return;
    map = L.map('map', { zoomControl: true, attributionControl: true }).setView([BENEVENTO.lat, BENEVENTO.lng], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(map);
    map.on('click', () => { if (sheetMode === 'station') closeSheet(); });
    map.on('zoomend', () => renderMarkers());
    if (window.ResizeObserver) new ResizeObserver(() => map.invalidateSize()).observe($('map'));
}
function renderMarkers() {
    if (!map) return;
    Object.values(markers).forEach(m => map.removeLayer(m));
    markers = {};
    const ids = new Set(visibleStations().map(s => s.id));
    // segnaposto che sullo schermo si sovrapporrebbero (allo zoom attuale): si affiancano senza toccarsi,
    // altrimenti quello sotto non si può toccare col dito; zoomando tornano al loro punto esatto.
    // Posizioni provate: il punto esatto, poi due giri di caselle da 36 px intorno, dalle più vicine
    const SHIFTS = [];
    for (let x = -2; x <= 2; x++) for (let y = -2; y <= 2; y++) SHIFTS.push([x * 36, y * 36]);
    SHIFTS.sort((p, q) => Math.hypot(...p) - Math.hypot(...q));
    const placedPx = [];
    const shiftOf = (st) => {
        const pt = map.latLngToLayerPoint([st.lat, st.lng]);
        // la prima posizione libera rispetto ai segnaposto già sistemati (prima il punto esatto)
        const gap = ([dx, dy]) => Math.min(Infinity, ...placedPx.map(p => p.distanceTo(L.point(pt.x + dx, pt.y + dy))));
        // se non c'è nessun posto libero, quello con più spazio intorno
        const free = SHIFTS.find(sh => gap(sh) >= 35) || SHIFTS.reduce((best, sh) => gap(sh) > gap(best) ? sh : best);
        placedPx.push(L.point(pt.x + free[0], pt.y + free[1]));
        return free;
    };
    // si sistemano prima la pompa aperta e quelle con notizie fresche: restano nel loro punto esatto
    const priority = (st) => (st.id === openId ? 0 : st.status === 'unverified' ? 3 : isStale(st) ? 2 : 1);
    stations.slice().sort((a, b) => priority(a) - priority(b) || a.id.localeCompare(b.id)).forEach(st => {
        if (!ids.has(st.id)) return;
        const sel = openId === st.id, stale = isStale(st);
        const [dx, dy] = shiftOf(st);
        const icon = L.divIcon({ className: '', html: `<div class="pin pin-${st.status}${stale ? ' pin-stale' : ''}${sel ? ' pin-selected' : ''}"><i class="fa-solid ${iconOf(st)}"></i></div>`, iconSize: [34, 34], iconAnchor: [17 - dx, 17 - dy] });
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
let sheetKey = null, sheetOpener = null;
const focusablesIn = (el) => [...el.querySelectorAll('button, a[href], input, select, textarea')];
// key: quale scheda è (pompa, passo del modulo…). La stessa scheda ridisegnata (voto, aggiornamento ogni 20 s)
// resta dov'era, anche col cursore della tastiera; una scheda nuova riparte dall'inizio, col cursore sul titolo
function showSheet(html, key) {
    const sh = $('sheet');
    const wasClosed = sh.classList.contains('closed');
    const same = !wasClosed && key === sheetKey;
    const focusIdx = same ? focusablesIn(sh).indexOf(document.activeElement) : -1;
    const scroll = sh.scrollTop;
    if (wasClosed) sheetOpener = document.activeElement;
    sheetKey = key;
    sh.innerHTML = `<div class="lg:hidden pt-2.5 pb-1 flex justify-center"><span class="w-10 h-1.5 rounded-full bg-slate-300"></span></div>${html}`;
    sh.classList.remove('closed');
    sh.removeAttribute('aria-hidden'); sh.inert = false;
    $('sheetBackdrop').classList.remove('hidden');
    if (same) {
        sh.scrollTop = scroll;
        const el = focusablesIn(sh)[focusIdx];
        if (el) { el.focus({ preventScroll: true }); try { if (el.type === 'text') el.setSelectionRange(el.value.length, el.value.length); } catch (e) {} }
    } else {
        sh.scrollTop = 0;
        $('sheetTitle')?.focus({ preventScroll: true });
    }
}
window.closeSheet = function (fromHistory) {
    if (!sheetMode) return;
    const sh = $('sheet'), closedId = openId;
    const focusWasInside = sh.contains(document.activeElement) || document.activeElement === document.body;
    sh.classList.add('closed');
    sh.setAttribute('aria-hidden', 'true'); sh.inert = true;
    $('sheetBackdrop').classList.add('hidden');
    sheetMode = null; openId = null; sheetKey = null;
    // la scheda è già chiusa: il "popstate" che arriva da questo history.back() non deve chiudere
    // un'eventuale scheda aperta subito dopo
    if (!fromHistory && history.state && history.state.sheet) { ignoreNextPop = true; history.back(); }
    render();
    // il cursore torna da dove si era aperta la scheda (l'elenco viene ridisegnato: si cerca la riga della pompa)
    if (focusWasInside) {
        const back = sheetOpener && document.contains(sheetOpener) && sheetOpener !== document.body ? sheetOpener
            : closedId && document.querySelector(`#list [data-id="${CSS.escape(closedId)}"] button`);
        if (back) back.focus({ preventScroll: true });
    }
    sheetOpener = null;
};
// il tasto "indietro" del telefono chiude la scheda invece di uscire dal sito
let ignoreNextPop = false;
window.addEventListener('popstate', () => { if (ignoreNextPop) { ignoreNextPop = false; return; } if (sheetMode) closeSheet(true); });
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
    const s = STATUS[st.status], stale = isStale(st), mine = myVote(st);
    // totale delle segnalazioni (una per persona), comprese quelle che dopo 45 minuti non contano più
    const reports = Object.keys(st.votes || {}).length;
    const q = queueText(st);
    const fuels = st.status !== 'unverified' && st.status !== 'closed' ? [['benzina', 'Benzina'], ['diesel', 'Diesel'], ['gpl', 'GPL']].filter(([k]) => typeof st.fuels?.[k] === 'boolean') : [];
    const note = st.lastNote && !DEFAULT_NOTES.includes(st.lastNote) ? st.lastNote : '';
    const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${st.lat},${st.lng}`;
    // carburanti e coda: quelli del tuo voto, oppure una bozza (Benzina e Diesel spuntati) che parte col voto
    const draft = draftFor(st, mine);
    const detailsOpen = !mine || mine.status !== 'closed';
    showSheet(`
        <div class="px-5 pt-2 pb-safe">
            <div class="flex items-start gap-3">
                <div class="flex-1 min-w-0">
                    <h2 id="sheetTitle" tabindex="-1" class="outline-none text-[20px] font-extrabold leading-tight">${esc(st.name)}</h2>
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
                    <span class="w-12 h-12 rounded-full ${s.solid} ${stale ? 'opacity-50' : ''} text-white text-xl flex items-center justify-center shrink-0"><i class="fa-solid ${iconOf(st)}"></i></span>
                    <div>
                        <div class="text-[20px] font-extrabold ${s.text}">${s.label}</div>
                        <div class="text-[13px] text-slate-600">${st.lastUpdated ? `Ultimo voto ${ago(st.lastUpdated)} (alle ${clock(st.lastUpdated)})` : 'Ancora nessuna segnalazione'}</div>
                    </div>
                </div>
                ${stale ? '<p class="mt-3 text-[13px] font-semibold text-amber-800"><i class="fa-solid fa-clock-rotate-left mr-1"></i>Notizia di più di 3 ore fa: se sei lì, confermala o correggila.</p>' : ''}
                ${q ? `<p class="mt-3 text-[14px] font-semibold ${st.queueLevel === 'Scorrevole' ? 'text-emerald-800' : 'text-amber-800'}"><i class="fa-solid fa-car-side mr-1.5"></i>${esc(q)}${st.queueTs ? ` <span class="font-normal text-slate-500">· ${ago(st.queueTs)}</span>` : ''}</p>` : ''}
                ${fuels.length ? `<p class="mt-2 flex flex-wrap gap-1.5">${fuels.map(([k, l]) => `<span class="px-2 py-0.5 rounded-lg text-[13px] font-semibold ${st.fuels[k] ? 'bg-white text-emerald-800' : 'bg-white/60 text-slate-500 line-through'}">${l}</span>`).join('')}</p>` : ''}
                ${note ? `<p class="mt-2 text-[14px] text-slate-700 italic">"${esc(note)}"</p>` : ''}
                ${reports ? `<p class="mt-3 pt-3 border-t border-black/5 text-[12px] text-slate-500">Segnalazioni totali: <strong>${reports}</strong></p>` : ''}
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
                <p class="mt-1.5 text-[12px] text-slate-500"><strong>Limitata</strong> = il carburante c’è ma con limiti (solo alcuni tipi, poca scorta, tetto di spesa). Le code si indicano qui sotto.</p>
                ${detailsOpen ? `
                <div class="mt-3 rounded-2xl bg-slate-50 border border-slate-200 p-3.5 space-y-3">
                    <div>
                        <div class="text-[14px] font-bold mb-1.5"><i class="fa-solid fa-gas-pump mr-1 text-slate-500"></i>Quali carburanti ci sono?</div>
                        <div class="flex flex-wrap gap-1.5">${[['benzina', 'Benzina'], ['diesel', 'Diesel'], ['gpl', 'GPL']].map(([k, l]) => { const on = draft.fuels[k] === true; return `<label class="inline-flex items-center gap-2 h-11 px-3 rounded-xl border bg-white text-[14px] font-semibold cursor-pointer ${on ? 'border-emerald-500 text-emerald-800' : 'border-slate-300 text-slate-500'}"><input type="checkbox" ${on ? 'checked' : ''} onchange="toggleFuel('${k}', this.checked)" class="w-5 h-5 accent-emerald-600">${l}</label>`; }).join('')}</div>
                    </div>
                    <div>
                        <div class="text-[14px] font-bold mb-1.5"><i class="fa-solid fa-car-side mr-1 text-slate-500"></i>C’è coda?</div>
                        <div class="flex flex-wrap gap-1.5">${QUEUE_CHOICES.map(qq => `<button onclick="setQueue('${qq}')" aria-pressed="${draft.queue === qq}" class="h-10 px-3 rounded-xl border text-[13px] font-semibold ${draft.queue === qq ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-300 hover:bg-slate-100'}">${QUEUE_LABELS[qq]}</button>`).join('')}</div>
                    </div>
                    ${mine ? '' : '<p class="text-[13px] text-slate-500"><i class="fa-solid fa-arrow-up mr-1"></i>Tocca Aperta o Limitata qui sopra per inviare: carburanti e coda partono insieme al voto.</p>'}
                </div>` : ''}
                ${mine ? '<button onclick="vote(null)" class="mt-3 text-[13px] font-semibold text-red-700 underline">Togli il mio voto</button>' : ''}
            </div>
        </div>`, `station:${st.id}`);
}

// bozza di carburanti e coda per chi non ha ancora votato (si azzera cambiando pompa)
let draftState = null;
function draftFor(st, mine) {
    if (mine && mine.status !== 'closed') return { fuels: { benzina: mine.fuels?.benzina === true, diesel: mine.fuels?.diesel === true, gpl: mine.fuels?.gpl === true }, queue: mine.queueLevel };
    if (!draftState || draftState.id !== st.id) draftState = { id: st.id, fuels: { benzina: true, diesel: true, gpl: false }, queue: null };
    return draftState;
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
        fuels: status === 'closed' ? { benzina: false, diesel: false, gpl: false } : { ...(prev && prev.status !== 'closed' ? draftFor(st, prev) : draftFor(st, null)).fuels },
        queueLevel: status === 'closed' ? 'Nessuna' : ((prev && prev.status !== 'closed' ? prev.queueLevel : draftFor(st, null).queue) || 'Non indicata'),
        note: status === 'available' ? 'Aperta.' : status === 'limited' ? 'Limitata.' : 'Chiusa.',
    };
    const id = st.id;
    if (await sendVote(id, v)) {
        toast(status ? `Voto registrato: ${STATUS[status].short}` : 'Voto tolto', 'Annulla', () => sendVote(id, prev ? { ...prev, ts: Date.now() } : null));
    }
};
window.setQueue = async function (q) {
    const st = stations.find(s => s.id === openId), mine = st && myVote(st);
    if (!st) return;
    if (!mine || mine.status === 'closed') { draftFor(st, null).queue = q; renderStationSheet(); return; }
    if (mine.queueLevel === q) return;
    if (await sendVote(st.id, { ...mine, queueLevel: q, ts: Date.now() })) toast(`Grazie: ${QUEUE_LABELS[q].toLowerCase()}`);
};
window.toggleFuel = async function (k, on) {
    const st = stations.find(s => s.id === openId), mine = st && myVote(st);
    if (!st) return;
    if (!mine || mine.status === 'closed') { draftFor(st, null).fuels[k] = on; renderStationSheet(); return; }
    const fuels = { ...draftFor(st, mine).fuels, [k]: on };
    await sendVote(st.id, { ...mine, fuels, ts: Date.now() });
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
            <div class="flex items-start gap-3"><h2 id="sheetTitle" tabindex="-1" class="outline-none flex-1 text-[20px] font-extrabold">Come funziona</h2>${closeBtn}</div>
            <div class="mt-3 space-y-3 text-[15px] text-slate-700">
                <p><strong>Lo stato lo segnalano i cittadini.</strong> Chi passa davanti a una pompa la vota: Aperta, Limitata o Esaurita. Non serve registrarsi.</p>
                <p><strong>Limitata</strong> vuol dire che il carburante c’è ma con limiti: solo alcuni tipi, poca scorta, un tetto di spesa. <strong>Le code si segnalano a parte</strong>: una pompa aperta con coda ha la clessidra verde.</p>
                <p><strong>Un voto a persona per pompa.</strong> Puoi cambiarlo o toglierlo quando vuoi.</p>
                <p><strong>Vince lo stato con più voti.</strong> A parità vince il più prudente (Esaurita, poi Limitata, poi Aperta): meglio non mandare nessuno a vuoto.</p>
                <p><strong>Le notizie invecchiano.</strong> Se per 45 minuti nessuno conferma lo stato, il primo voto diverso lo cambia subito (per esempio una pompa che riapre). Nella scheda trovi il totale delle segnalazioni ricevute. Dopo 3 ore senza conferme la pompa appare tratteggiata: la notizia potrebbe non valere più.</p>
                <p><strong>Code e carburanti</strong> sono quelli indicati nell’ultima segnalazione.</p>
                <p class="text-[13px] text-slate-500">Il sito non chiede nomi né account. Per riconoscere il tuo voto usa un codice casuale salvato solo sul tuo telefono.</p>
            </div>
        </div>`, 'help');
};

// ---------- nuovo distributore ----------
// Facile ma con dati controllati: comune scelto dall'elenco dei 78 comuni, via scelta tra quelle vere
// trovate su OpenStreetMap (oppure dalla posizione del telefono), posizione confermata sulla mappa,
// avviso se la pompa c'è già. Il server ripete i controlli (lib/benzina.ts).
const BRANDS = ['Eni', 'Q8', 'Esso', 'IP', 'Tamoil', 'Energas', 'Pompa Bianca'];
const MAX_KM_FROM_COMUNE = 12;
let addState = null, addMap = null, streetTimer = null;

window.openAddStation = function () {
    sheetMode = 'add'; openId = null;
    addState = { step: 1, comune: 'Benevento', streetInput: '', street: null, number: '', fromGps: false, gpsPos: null, name: '', brand: '', pos: null, zone: '', status: undefined, fuels: { benzina: true, diesel: true, gpl: false }, dupConfirmed: false, suggestions: [] };
    pushSheetState();
    renderAddSheet();
};

const fieldCls = 'mt-1 w-full h-12 px-3 rounded-xl border border-slate-300 bg-white text-[16px] focus:outline-none focus:ring-2 focus:ring-amber-400';
function addStep1Ready() { const a = addState; return a.street && findComune(a.comune) && a.name.trim().length >= 3 && a.brand; }

function renderAddSheet() {
    const a = addState;
    const near = a.pos ? stations.filter(s => km(s, a.pos) < 0.2) : [];
    const head = `<div class="flex items-start gap-3"><div class="flex-1"><h2 id="sheetTitle" tabindex="-1" class="outline-none text-[20px] font-extrabold">Segnala una pompa che manca</h2><p class="text-[13px] text-slate-500">Passo ${a.step} di 2 · ${a.step === 1 ? 'dove si trova' : 'conferma e stato'}</p></div>${closeBtn}</div>`;
    if (a.step === 1) {
        showSheet(`<div class="px-5 pt-2 pb-safe">${head}
            <button onclick="addUseMyPosition()" id="addGpsBtn" class="mt-4 w-full h-12 rounded-xl border-2 border-blue-600 text-blue-700 text-[15px] font-bold"><i class="fa-solid fa-location-crosshairs mr-1.5"></i>Sono alla pompa: usa la mia posizione</button>
            <p class="text-[12px] text-slate-500 mt-1 text-center">Trova da sola comune e via. Oppure scegli qui sotto.</p>
            <div class="mt-4 space-y-3">
                <label class="block"><span class="text-[14px] font-bold">Comune *</span>
                    <select id="addComune" onchange="addSetComune(this.value)" class="${fieldCls}">
                        ${COMUNI.map(c => `<option ${comuneKey(c.nome) === comuneKey(a.comune) ? 'selected' : ''}>${esc(c.nome)}</option>`).join('')}
                    </select></label>
                <div class="relative">
                    <label class="block"><span class="text-[14px] font-bold">Via *</span>
                        <input id="addStreet" autocomplete="off" value="${esc(a.street ? a.street.name : a.streetInput)}" oninput="addStreetInput(this.value)" placeholder="Inizia a scrivere, poi scegli dall'elenco" class="${fieldCls} ${a.street ? 'border-emerald-500' : ''}"></label>
                    ${a.street ? `<p class="text-[12px] text-emerald-700 mt-1"><i class="fa-solid fa-check mr-1"></i>Via trovata a ${esc(a.comune)}${a.fromGps ? ' (dalla tua posizione)' : ''}</p>` : '<p class="text-[12px] text-slate-500 mt-1">La via deve esistere: sceglila tra i suggerimenti.</p>'}
                    <ul id="addSuggestions" class="${a.suggestions.length && !a.street ? '' : 'hidden'} absolute z-10 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                        ${a.suggestions.map((sg, i) => `<li><button type="button" onclick="addPickStreet(${i})" class="w-full text-left px-3 py-2.5 text-[15px] hover:bg-slate-50 border-b border-slate-100">${esc(sg.name)}${sg.suburb ? ` <span class="text-slate-500 text-[13px]">· ${esc(sg.suburb)}</span>` : ''}</button></li>`).join('')}
                    </ul>
                </div>
                <label class="block"><span class="text-[14px] font-bold">Numero civico</span> <span class="text-[13px] text-slate-500">(se lo sai)</span>
                    <input id="addNumber" inputmode="numeric" maxlength="8" value="${esc(a.number)}" oninput="addState.number=this.value" class="${fieldCls}"></label>
                <label class="block"><span class="text-[14px] font-bold">Nome del distributore *</span>
                    <input id="addName" maxlength="50" value="${esc(a.name)}" oninput="addState.name=this.value; addRefreshNext()" placeholder="Es. Oroil, Ghepardoil" class="${fieldCls}"></label>
                <label class="block"><span class="text-[14px] font-bold">Marchio *</span>
                    <select id="addBrand" onchange="addState.brand=this.value; addRefreshNext()" class="${fieldCls}">
                        <option value="" ${a.brand ? '' : 'selected'} disabled>Scegli…</option>
                        ${BRANDS.map(b => `<option value="${b}" ${a.brand === b ? 'selected' : ''}>${b === 'Pompa Bianca' ? 'Altro / pompa bianca' : b}</option>`).join('')}
                    </select></label>
                <button id="addNextBtn" onclick="addGoStep2()" ${addStep1Ready() ? '' : 'disabled'} class="w-full h-12 rounded-xl bg-slate-900 text-white text-[15px] font-bold disabled:opacity-40">Continua</button>
            </div></div>`, 'add:1');
        return;
    }
    showSheet(`<div class="px-5 pt-2 pb-safe">${head}
        <p class="mt-3 text-[15px]"><strong>${esc(a.name)}</strong> · ${esc(a.street.name)}${a.number ? ' ' + esc(a.number) : ''}, ${esc(a.comune)}</p>
        <div id="addMap" class="mt-2 h-52 rounded-2xl overflow-hidden border border-slate-200"></div>
        <p class="text-[13px] text-slate-500 mt-1.5"><i class="fa-solid fa-hand-pointer mr-1"></i>Il segnaposto va sulla pompa: se serve, trascinalo (solo vicino alla via scelta).</p>
        ${near.length ? `<div class="mt-3 rounded-2xl bg-amber-50 border border-amber-300 p-3 text-[14px]">
            <strong><i class="fa-solid fa-triangle-exclamation mr-1 text-amber-600"></i>Forse c’è già:</strong>
            ${near.map(s => `<button onclick="openStation('${esc(s.id)}')" class="block mt-1.5 text-left underline">${esc(s.name)} · ${esc(s.address)}</button>`).join('')}
            <label class="flex items-center gap-2 mt-2.5 font-semibold"><input type="checkbox" ${a.dupConfirmed ? 'checked' : ''} onchange="addState.dupConfirmed=this.checked; renderAddSheet()" class="w-5 h-5 accent-amber-600"> No, è un’altra pompa</label>
        </div>` : ''}
        <div class="mt-4"><span class="text-[14px] font-bold">Com’è adesso? *</span>
            <div class="grid grid-cols-4 gap-1.5 mt-1">${[['available', 'Aperta'], ['limited', 'Limitata'], ['closed', 'Esaurita'], [null, 'Non so']].map(([k, l]) => `<button onclick="addState.status=${k ? `'${k}'` : 'null'}; renderAddSheet()" class="h-12 rounded-xl border text-[13px] font-bold ${a.status === k ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-300'}">${l}</button>`).join('')}</div>
        </div>
        ${a.status === 'available' || a.status === 'limited' ? `<div class="mt-3"><span class="text-[14px] font-bold">Quali carburanti ci sono?</span>
            <div class="flex flex-wrap gap-1.5 mt-1">${[['benzina', 'Benzina'], ['diesel', 'Diesel'], ['gpl', 'GPL']].map(([k, l]) => `<label class="inline-flex items-center gap-2 h-11 px-3 rounded-xl border bg-white text-[14px] font-semibold ${a.fuels[k] ? 'border-emerald-500 text-emerald-800' : 'border-slate-300 text-slate-500'}"><input type="checkbox" ${a.fuels[k] ? 'checked' : ''} onchange="addState.fuels.${k}=this.checked; renderAddSheet()" class="w-5 h-5 accent-emerald-600">${l}</label>`).join('')}</div></div>` : ''}
        <div class="flex gap-2 mt-5">
            <button onclick="addState.step=1; renderAddSheet()" class="h-12 px-4 rounded-xl bg-slate-100 font-bold">Indietro</button>
            <button id="addSaveBtn" onclick="addSave()" ${a.status === undefined || (near.length && !a.dupConfirmed) ? 'disabled' : ''} class="flex-1 h-12 rounded-xl bg-amber-400 text-slate-900 text-[15px] font-extrabold disabled:opacity-40">Aggiungi alla mappa</button>
        </div>
        ${a.status === undefined ? '<p class="text-[12px] text-slate-500 mt-1.5 text-center">Scegli com’è adesso (anche “Non so”).</p>' : ''}
    </div>`, 'add:2');
    setTimeout(() => {
        // se nel frattempo la scheda è stata ridisegnata, la mappa è già sul riquadro nuovo
        const el = $('addMap');
        if (!el || el._leaflet_id) return;
        addMap = L.map('addMap', { zoomControl: false, attributionControl: false }).setView([a.pos.lat, a.pos.lng], 17);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(addMap);
        const anchor = a.anchor;
        L.marker([a.pos.lat, a.pos.lng], { draggable: true, icon: L.divIcon({ className: '', html: '<div class="pin pin-unverified"><i class="fa-solid fa-gas-pump"></i></div>', iconSize: [34, 34], iconAnchor: [17, 17] }) })
            .on('dragend', (e) => {
                const ll = e.target.getLatLng();
                if (km({ lat: ll.lat, lng: ll.lng }, anchor) > 0.6) { e.target.setLatLng([a.pos.lat, a.pos.lng]); toast('Il segnaposto deve restare vicino alla via scelta.'); return; }
                a.pos = { lat: ll.lat, lng: ll.lng }; renderAddSheet();
            }).addTo(addMap);
    }, 50);
}
function addRefreshNext() { const b = $('addNextBtn'); if (b) b.disabled = !addStep1Ready(); }

async function nominatim(params) {
    const res = await fetch('https://nominatim.openstreetmap.org/' + params + '&accept-language=it', { signal: AbortSignal.timeout(8000) });
    return res.ok ? res.json() : null;
}
const placeOf = (ad) => ad.city || ad.town || ad.village || ad.municipality || '';

window.addSetComune = function (name) {
    const a = addState;
    a.comune = name; a.street = null; a.fromGps = false; a.suggestions = [];
    a.name = $('addName').value; a.number = $('addNumber').value;
    renderAddSheet();
};
// suggerimenti di vie vere nel comune scelto mentre si scrive: Photon (dati OpenStreetMap, accetta parole
// a metà); si tengono solo le strade di quel comune
window.addStreetInput = function (v) {
    const a = addState;
    a.streetInput = v; a.street = null; a.fromGps = false;
    addRefreshNext();
    clearTimeout(streetTimer);
    if (v.trim().length < 3) { a.suggestions = []; $('addSuggestions').classList.add('hidden'); return; }
    streetTimer = setTimeout(async () => {
        const c = findComune(a.comune);
        let feats = [];
        try {
            const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(v.trim())}&limit=15&osm_tag=highway${c ? `&lat=${c.lat}&lon=${c.lng}` : ''}`;
            const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
            if (res.ok) feats = (await res.json()).features || [];
        } catch (e) { console.warn('Suggerimenti vie non disponibili', e); }
        if (addState !== a || a.streetInput !== v) return;
        const seen = new Set();
        a.suggestions = feats.filter(f => f.properties?.name && comuneKey(f.properties.city || f.properties.town || f.properties.village || '') === comuneKey(a.comune))
            .map(f => ({ name: f.properties.name, suburb: f.properties.district || f.properties.locality || '', lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] }))
            .filter(sg => { const k = sg.name + sg.suburb; if (seen.has(k)) return false; seen.add(k); return true; })
            .slice(0, 8);
        const ul = $('addSuggestions');
        if (!ul) return;
        ul.innerHTML = a.suggestions.length
            ? a.suggestions.map((sg, i) => `<li><button type="button" onclick="addPickStreet(${i})" class="w-full text-left px-3 py-2.5 text-[15px] hover:bg-slate-50 border-b border-slate-100">${esc(sg.name)}${sg.suburb ? ` <span class="text-slate-500 text-[13px]">· ${esc(sg.suburb)}</span>` : ''}</button></li>`).join('')
            : `<li class="px-3 py-2.5 text-[14px] text-slate-500">Nessuna via così a ${esc(a.comune)}. Controlla il nome o il comune.</li>`;
        ul.classList.remove('hidden');
    }, 600);
};
window.addPickStreet = function (i) {
    const a = addState, sg = a.suggestions[i];
    a.street = sg; a.streetInput = sg.name; a.fromGps = false; a.gpsPos = null; a.suggestions = [];
    a.name = $('addName').value; a.number = $('addNumber').value;
    renderAddSheet();
};
// "Sono alla pompa": posizione del telefono → comune e via; la pompa va esattamente lì
window.addUseMyPosition = function () {
    if (!navigator.geolocation) return toast('Questo browser non può dare la posizione.');
    const btn = $('addGpsBtn'); btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i>Cerco la tua posizione…';
    const done = () => { if ($('addGpsBtn')) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-location-crosshairs mr-1.5"></i>Sono alla pompa: usa la mia posizione'; } };
    navigator.geolocation.getCurrentPosition(async (p) => {
        const pos = { lat: p.coords.latitude, lng: p.coords.longitude };
        try {
            const rev = await nominatim(`reverse?format=jsonv2&zoom=18&addressdetails=1&lat=${pos.lat}&lon=${pos.lng}`);
            const ad = rev?.address || {};
            const c = findComune(placeOf(ad));
            if (!c) { toast('Sei fuori dalla provincia di Benevento: qui si segnalano solo pompe del Sannio.'); return; }
            if (!ad.road) { toast('Non trovo la via qui: sceglila a mano.'); return; }
            const a = addState;
            a.name = $('addName').value;
            Object.assign(a, { comune: c.nome, street: { name: ad.road, suburb: ad.suburb || ad.hamlet || '', lat: pos.lat, lng: pos.lng }, streetInput: ad.road, number: ad.house_number || '', fromGps: true, gpsPos: pos, suggestions: [] });
            renderAddSheet();
            toast(`Trovato: ${ad.road}, ${c.nome}`);
        } catch (e) { toast('Ricerca non riuscita: riprova o scegli a mano.'); }
        finally { done(); }
    }, (err) => { done(); toast(err.code === 1 ? 'Accesso alla posizione negato: scegli comune e via a mano.' : 'Non riesco a trovarti: scegli comune e via a mano.'); },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
};

window.addGoStep2 = async function () {
    const a = addState;
    a.name = $('addName').value.trim(); a.number = $('addNumber').value.trim();
    if (!addStep1Ready()) return;
    const btn = $('addNextBtn'); btn.disabled = true; btn.textContent = 'Cerco la pompa…';
    try {
        let pos = a.gpsPos || { lat: a.street.lat, lng: a.street.lng };
        if (!a.gpsPos && a.number) {
            const h = await nominatim(`search?format=jsonv2&addressdetails=1&limit=3&countrycodes=it&street=${encodeURIComponent(a.number + ' ' + a.street.name)}&city=${encodeURIComponent(a.comune)}`).catch(() => null);
            const hit = (h || []).find(x => comuneKey(placeOf(x.address || {})) === comuneKey(a.comune));
            if (hit) pos = { lat: Number(hit.lat), lng: Number(hit.lon) };
        }
        // il distributore vero lì vicino (per nome o marchio) è più preciso della via
        if (!a.gpsPos) {
            const dd = 0.006, vb = `${pos.lng - dd},${pos.lat + dd},${pos.lng + dd},${pos.lat - dd}`;
            for (const term of [...new Set([a.name.split(' - ')[0], a.brand === 'Pompa Bianca' ? '' : a.brand].filter(t => t && t.length >= 2))]) {
                const f = ((await nominatim(`search?format=jsonv2&limit=5&countrycodes=it&bounded=1&viewbox=${vb}&q=${encodeURIComponent(term)}`).catch(() => null)) || []).find(h => h.category === 'amenity' && h.type === 'fuel');
                if (f) { pos = { lat: Number(f.lat), lng: Number(f.lon) }; break; }
            }
        }
        const c = findComune(a.comune);
        if (km(pos, c) > MAX_KM_FROM_COMUNE) { toast(`La posizione trovata non è a ${a.comune}: controlla comune e via.`); return; }
        const rev = await nominatim(`reverse?format=jsonv2&zoom=16&addressdetails=1&lat=${pos.lat}&lon=${pos.lng}`).catch(() => null);
        const ad = rev?.address || {};
        a.zone = (ad.suburb || ad.quarter || ad.neighbourhood || ad.hamlet || a.comune).slice(0, 40);
        a.pos = pos; a.anchor = pos; a.step = 2; a.dupConfirmed = false;
        renderAddSheet();
    } catch (e) {
        toast('Ricerca non riuscita: riprova tra poco.');
    } finally { if ($('addNextBtn')) { btn.disabled = !addStep1Ready(); btn.textContent = 'Continua'; } }
};

window.addSave = async function () {
    const a = addState, btn = $('addSaveBtn');
    btn.disabled = true; btn.textContent = 'Salvataggio…';
    const v = a.status ? {
        status: a.status,
        fuels: a.status === 'closed' ? { benzina: false, diesel: false, gpl: false } : { ...a.fuels },
        queueLevel: a.status === 'closed' ? 'Nessuna' : 'Non indicata', note: '',
    } : null;
    try {
        const address = `${a.street.name}${a.number ? ' ' + a.number : ''}`.slice(0, 70);
        const data = await apiPost('/api/stations', { station: { name: a.name, brand: a.brand, address, zone: a.zone || a.comune, comune: a.comune, lat: a.pos.lat, lng: a.pos.lng }, vote: v });
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

// ---------- comuni della provincia (public/comuni.json, lo stesso elenco usato dal server) ----------
let COMUNI = [];
const comuneKey = (t) => (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’`]/g, "'").replace(/\s+/g, ' ').trim();
const findComune = (name) => COMUNI.find(c => comuneKey(c.nome) === comuneKey(name));
async function loadComuni() { try { COMUNI = await (await fetch('/comuni.json')).json(); } catch (e) { console.warn('Elenco comuni non disponibile', e); } }

// ---------- avvio ----------
(async function start() {
    try { initMap(); } catch (e) { console.error('Mappa non avviata', e); }
    render();
    try { myVoterId = await computeVoterId(); } catch (e) { console.warn(e); }
    await load();
    let timer = setInterval(load, POLL_MS);
    document.addEventListener('visibilitychange', () => { clearInterval(timer); if (!document.hidden) { load(); timer = setInterval(load, POLL_MS); } });
    loadNews();
    loadComuni();
})();
