        const SEED_VERSION = 2;

        const INITIAL_BENEVENTO_STATIONS = [
            { id: "bn-station-14", name: "Eni - SS7 Appia (Tufara Valle)", brand: "Eni", address: "SS7 Appia, loc. Tufara Valle", zone: "Arteria SS7 Appia Sud-Ovest", lat: 41.0915, lng: 14.7185, svgX: 78, svgY: 435, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-1", name: "Eni - Via Napoli", brand: "Eni", address: "Via Napoli 168", zone: "Rione Libertà", lat: 41.1245, lng: 14.7615, svgX: 295, svgY: 430, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-2", name: "Eni - Via Meomartini", brand: "Eni", address: "Via Alfonso Meomartini 60", zone: "Zona Mellusi/Alta", lat: 41.1328, lng: 14.7912, svgX: 735, svgY: 280, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-3", name: "Eni - Via Paolella", brand: "Eni", address: "Via Alfredo Paolella 4", zone: "Santa Colomba / Stadio", lat: 41.1192, lng: 14.7775, svgX: 520, svgY: 515, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-4", name: "Q8 - Via Avellino", brand: "Q8", address: "Via Avellino 6", zone: "Centro / Pacevecchia", lat: 41.1310, lng: 14.7895, svgX: 685, svgY: 335, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-5", name: "Q8easy - Contrada Epitaffio", brand: "Q8", address: "C.da Epitaffio 72", zone: "C.da Epitaffio / Ovest", lat: 41.1285, lng: 14.7480, svgX: 145, svgY: 365, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-6", name: "Energas Q8 - Via Padre Pio", brand: "Energas", address: "Via Padre Pio SP71", zone: "Capodimonte / Rotonda dei Pentri", lat: 41.1415, lng: 14.7960, svgX: 790, svgY: 145, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-7", name: "Tamoil 24h - Piazza Bissolati", brand: "Tamoil", address: "Piazza Bissolati / Via Grimoaldo Re 11", zone: "Rione Ferrovia", lat: 41.1402, lng: 14.7735, svgX: 470, svgY: 160, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-8", name: "Tamoil - Via Bachelet", brand: "Tamoil", address: "Via Vittorio Bachelet", zone: "Pacevecchia", lat: 41.1345, lng: 14.8050, svgX: 880, svgY: 265, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-9", name: "Esso - Via dei Longobardi", brand: "Esso", address: "Via dei Longobardi 10", zone: "Zona Ponticelli / Centro", lat: 41.1365, lng: 14.7830, svgX: 585, svgY: 235, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-10", name: "IP - Via Pietro Nenni", brand: "IP", address: "Via Pietro Nenni 38", zone: "Zona Atlantici / Mellusi", lat: 41.1270, lng: 14.7885, svgX: 645, svgY: 392, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-11", name: "Distributore Di.Si. - Viale Virgilio", brand: "Di.Si.", address: "Viale Virgilio snc", zone: "Rione Libertà / Ponte Vanvitelli", lat: 41.1315, lng: 14.7695, svgX: 410, svgY: 335, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-12", name: "Conad Self 24h - Buonvento", brand: "Conad", address: "SS7 Appia / C.da San Vito", zone: "Buonvento / San Vito", lat: 41.1130, lng: 14.7520, svgX: 195, svgY: 575, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-13", name: "Distributore C.da Piano Cappelle", brand: "Pompa Bianca", address: "Via Valfortore / C.da Piano Cappelle", zone: "C.da Piano Cappelle / Est", lat: 41.1170, lng: 14.8080, svgX: 890, svgY: 540, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION }
        ];

        const ZONE_COORDINATES_MAP = {
            "Rione Libertà": { lat: 41.1260, lng: 14.7640, svgX: 330, svgY: 415 },
            "Centro / Mellusi": { lat: 41.1305, lng: 14.7850, svgX: 615, svgY: 340 },
            "Rione Ferrovia": { lat: 41.1410, lng: 14.7710, svgX: 440, svgY: 150 },
            "Pacevecchia": { lat: 41.1335, lng: 14.8010, svgX: 830, svgY: 270 },
            "Santa Colomba / Stadio": { lat: 41.1185, lng: 14.7750, svgX: 490, svgY: 530 },
            "Capodimonte / Pentri": { lat: 41.1425, lng: 14.7930, svgX: 760, svgY: 135 },
            "C.da Epitaffio / Ovest": { lat: 41.1295, lng: 14.7510, svgX: 165, svgY: 350 },
            "Buonvento / San Vito": { lat: 41.1145, lng: 14.7545, svgX: 220, svgY: 560 },
            "C.da Piano Cappelle / Est": { lat: 41.1185, lng: 14.8040, svgX: 855, svgY: 520 }
        };

        const firebaseConfig = {
            apiKey: "AIzaSyAGJQ8nWcKiH7tZcV3T7Am8rUEqo7YYUA4",
            authDomain: "pompe-di-benzina---benevento.firebaseapp.com",
            projectId: "pompe-di-benzina---benevento",
            storageBucket: "pompe-di-benzina---benevento.firebasestorage.app",
            messagingSenderId: "623891714489",
            appId: "1:623891714489:web:efc563c3e2f93d42f8e668",
            measurementId: "G-CS138XW9VK"
        };
        const appId = 'benzina-benevento-live';

        let stationsData = INITIAL_BENEVENTO_STATIONS.map(s => ({ ...s }));
        let currentFilterStatus = 'all';
        let currentSearchQuery = '';
        let currentSortBy = 'recent';
        let selectedStationId = null;
        let modalFlagStatusChoice = 'available';
        let mapMode = 'schematic'; 

        let leafletMap = null;
        let leafletMarkers = {};
        let db = null;
        let auth = null;
        let currentUser = null;

        function esc(v) {
            return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
        }

        function getStatusConfig(status) {
            switch (status) {
                case 'available': return { label: 'Aperta', cls: 's-available', hex: '#17803d' };
                case 'limited': return { label: 'Limitata', cls: 's-limited', hex: '#e8780a' };
                case 'closed': return { label: 'Esaurita', cls: 's-closed', hex: '#c0262d' };
                case 'unverified': default: return { label: 'Da verificare', cls: 's-unverified', hex: '#8f9ab0' };
            }
        }

        const QUEUE_LABELS = {
            'Scorrevole': 'Nessuna coda',
            'Moderata': 'Attesa 5-10 min',
            'Lunga': 'Coda lunga',
            'Presidio TIR / Disagi': 'Presidio TIR / disagi'
        };

        function parseFuels(raw) {
            const empty = { benzina: null, diesel: null, gpl: null };
            try {
                const f = typeof raw === 'string' ? JSON.parse(raw) : raw;
                return f && typeof f === 'object' ? f : empty;
            } catch (e) { return empty; }
        }

        function formatRelativeTime(timestampMs) {
            if (!timestampMs) return 'In attesa del primo flag';
            const diffSeconds = Math.max(0, Math.floor((Date.now() - timestampMs) / 1000));
            if (diffSeconds < 45) return 'Adesso (pochi secondi fa)';
            const diffMinutes = Math.floor(diffSeconds / 60);
            if (diffMinutes === 1) return '1 minuto fa';
            if (diffMinutes < 60) return `${diffMinutes} minuti fa`;
            const diffHours = Math.floor(diffMinutes / 60);
            if (diffHours === 1) return '1 ora fa';
            if (diffHours < 24) return `${diffHours} ore fa`;
            return `${Math.floor(diffHours / 24)}g fa`;
        }

        function formatExactTime(timestampMs) {
            if (!timestampMs) return '';
            const d = new Date(timestampMs);
            return `alle ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        }

        async function initFirebaseAndSync() {
            try {
                if (!window.firebase || !firebase.apps.length) {
                    firebase.initializeApp(firebaseConfig);
                }
                db = firebase.firestore();
                auth = firebase.auth();

                try {
                    const userCred = await auth.signInAnonymously();
                    currentUser = userCred.user;
                } catch (authError) {
                    currentUser = { uid: 'cittadino-bn-local' };
                }

                document.getElementById('footerUserId').textContent = currentUser?.uid || 'anonimo-bn';

                const stationsColRef = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('stations');

                stationsColRef.onSnapshot(async (snapshot) => {
                    updateConnectionUI(true, "Sincronizzazione Cloud Live attiva");

                    if (snapshot.empty) {
                        console.warn("Database vuoto! Tento il caricamento automatico...");
                        await seedInitialStationsToFirestore();
                        return;
                    }

                    const legacyPressDoc = snapshot.docs.find(d => d.id === 'bn-station-14' && d.data().isPressSource);
                    if (legacyPressDoc) {
                        const cleanSeed = INITIAL_BENEVENTO_STATIONS.find(i => i.id === 'bn-station-14');
                        await legacyPressDoc.ref.set({ ...cleanSeed, isPressSource: false, lastReporterId: null });
                        return;
                    }

                    const loadedStations = [];
                    snapshot.forEach((docSnap) => {
                        // ignora documenti con id anomali (gli id finiscono in attributi HTML)
                        if (!/^bn-(station|custom)-\d+$/.test(docSnap.id)) return;
                        const data = docSnap.data();
                        const seedRef = INITIAL_BENEVENTO_STATIONS.find(i => i.id === docSnap.id) || {};
                        
                        loadedStations.push(normalizeStation({
                            ...seedRef,
                            ...data,
                            id: docSnap.id,
                            status: ['available', 'limited', 'closed', 'unverified'].includes(data.status) ? data.status : 'unverified',
                            svgX: Number(data.svgX) || seedRef.svgX || 500,
                            svgY: Number(data.svgY) || seedRef.svgY || 340,
                            fuels: parseFuels(data.fuels)
                        }));
                    });

                    if (loadedStations.length > 0) {
                        stationsData = loadedStations;
                    }
                    renderAll();
                }, (error) => {
                    console.error("Errore sincronizzazione Firestore:", error);
                    updateConnectionUI(false, "Modalità Locale (Verificare Regole Firebase)");
                    renderAll();
                });

            } catch (err) {
                console.warn("Uso dati locali di riserva.", err);
                updateConnectionUI(false, "Modalità Locale");
                document.getElementById('footerUserId').textContent = 'locale-bn';
                renderAll();
            }
        }

        async function seedInitialStationsToFirestore() {
            if (!db) return;
            try {
                for (const st of INITIAL_BENEVENTO_STATIONS) {
                    const docRef = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('stations').doc(st.id);
                    await docRef.set({ ...st, seedVersion: SEED_VERSION, lastReporterId: st.isPressSource ? 'fonte-stampa-verificata' : null });
                }
                showToast("Database Popolato!", "Caricati i 14 distributori di Benevento su Firebase.");
            } catch (e) {
                console.error("Errore salvataggio dati iniziali:", e);
                showToast("Errore Scrittura Firebase", "Controlla le regole di sicurezza Firestore.");
            }
        }

        window.forceSeedDatabase = async function() {
            if (!db) {
                alert("Connessione a Firebase non ancora pronta. Riprova tra 2 secondi.");
                return;
            }
            showToast("Caricamento in corso...", "Invio delle 14 pompe a Firebase...");
            await seedInitialStationsToFirestore();
        };

        function updateConnectionUI(isOnline, text) {
            const dot = document.getElementById('connectionDot');
            const label = document.getElementById('connectionText');
            if (label) label.textContent = text;
            if (dot) dot.className = isOnline ? 'dot bg-online' : 'dot';
        }

        function renderAll() {
            renderCounters();
            renderSchematicSvgPins();
            renderLeafletMarkers();
            renderStationsList();
            updateMapQuickBanner();
        }

        function renderCounters() {
            const total = stationsData.length;
            const available = stationsData.filter(s => s.status === 'available').length;
            const limited = stationsData.filter(s => s.status === 'limited').length;
            const closed = stationsData.filter(s => s.status === 'closed').length;
            const unverified = stationsData.filter(s => !s.status || s.status === 'unverified').length;

            document.getElementById('count-all').textContent = total;
            document.getElementById('count-available').textContent = available;
            document.getElementById('count-limited').textContent = limited;
            document.getElementById('count-closed').textContent = closed;
            document.getElementById('count-unverified').textContent = unverified;

            ['all', 'available', 'limited', 'closed', 'unverified'].forEach(st => {
                const pill = document.getElementById(`pill-${st}`);
                if (!pill) return;
                pill.className = currentFilterStatus === st ? 'chip is-active' : 'chip';
                pill.setAttribute('aria-pressed', currentFilterStatus === st ? 'true' : 'false');
            });
        }

        function getFilteredAndSortedStations() {
            return stationsData.filter(st => {
                const effectiveStatus = st.status || 'unverified';
                if (currentFilterStatus !== 'all' && effectiveStatus !== currentFilterStatus) return false;
                if (currentSearchQuery.trim() !== '') {
                    const q = currentSearchQuery.toLowerCase().trim();
                    return [st.name, st.brand, st.address, st.zone].some(val => (val || '').toLowerCase().includes(q));
                }
                return true;
            }).sort((a, b) => {
                if (currentSortBy === 'recent') {
                    const timeA = a.lastUpdated || 0;
                    const timeB = b.lastUpdated || 0;
                    return timeB !== timeA ? timeB - timeA : (a.name || '').localeCompare(b.name || '');
                }
                if (currentSortBy === 'status') {
                    const order = { available: 1, limited: 2, closed: 3, unverified: 4 };
                    const diff = (order[a.status] || 4) - (order[b.status] || 4);
                    return diff !== 0 ? diff : (b.lastUpdated || 0) - (a.lastUpdated || 0);
                }
                if (currentSortBy === 'unverified') {
                    const order = { unverified: 1, available: 2, limited: 3, closed: 4 };
                    const diff = (order[a.status] || 1) - (order[b.status] || 1);
                    return diff !== 0 ? diff : (a.name || '').localeCompare(b.name || '');
                }
                return (a.name || '').localeCompare(b.name || '');
            });
        }

        function renderSchematicSvgPins() {
            const layer = document.getElementById('svgStationsLayer');
            if (!layer) return;

            const filteredIds = new Set(getFilteredAndSortedStations().map(s => s.id));
            let svgHtml = '';

            stationsData.forEach(station => {
                const seedRef = INITIAL_BENEVENTO_STATIONS.find(i => i.id === station.id) || {};
                const x = Number(station.svgX) || seedRef.svgX || 500;
                const y = Number(station.svgY) || seedRef.svgY || 340;

                const cfg = getStatusConfig(station.status);
                const isVisible = filteredIds.has(station.id);
                const isSelected = selectedStationId === station.id;
                const name = station.name || 'Pompa';
                const shortTitle = name.length > 22 ? name.substring(0, 21) + '…' : name;

                svgHtml += `
                    <g class="svg-pin-group" style="opacity:${isVisible ? 1 : 0.25}" onclick="window.handlePinClick('${esc(station.id)}')">
                        <title>${esc(name)} - ${cfg.label}</title>
                        <circle class="pin" cx="${x}" cy="${y}" r="${isSelected ? 15 : 12}" fill="${cfg.hex}" stroke="${isSelected ? '#111a2e' : '#ffffff'}" stroke-width="${isSelected ? 4 : 3}" />
                        ${isVisible ? `<text x="${x}" y="${y + 29}" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="${isSelected ? 700 : 500}" fill="#111a2e" stroke="#eaf0f8" stroke-width="4" paint-order="stroke" stroke-linejoin="round">${esc(shortTitle)}</text>` : ''}
                    </g>`;
            });
            layer.innerHTML = svgHtml;
        }

        function initLeafletMapIfNeeded() {
            if (leafletMap) return;
            leafletMap = L.map('leafletMap', { center: [41.1250, 14.7720], zoom: 12 });
           L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
           maxZoom: 19,
           attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
           }).addTo(leafletMap);
            renderLeafletMarkers();
        }

        function renderLeafletMarkers() {
            if (!leafletMap) return;
            Object.values(leafletMarkers).forEach(m => leafletMap.removeLayer(m));
            leafletMarkers = {};
            const filteredIds = new Set(getFilteredAndSortedStations().map(s => s.id));

            stationsData.forEach(station => {
                if (!filteredIds.has(station.id)) return;
                const cfg = getStatusConfig(station.status);
                const size = selectedStationId === station.id ? 30 : 24;
                const icon = L.divIcon({
                    className: '',
                    html: `<div class="pin-leaflet" style="width:${size}px;height:${size}px;background:${cfg.hex};${selectedStationId === station.id ? 'border-color:#111a2e;' : ''}"></div>`,
                    iconSize: [size, size], iconAnchor: [size / 2, size / 2]
                });
                const marker = L.marker([station.lat, station.lng], { icon, title: station.name }).addTo(leafletMap);
                marker.on('click', () => window.handlePinClick(station.id));
                leafletMarkers[station.id] = marker;
            });
        }

        function flagButtons(st) {
            const id = esc(st.id);
            const mine = (myVoteOf(st) || {}).status;
            const counts = voteCounts(st);
            const labels = { available: 'Aperta', limited: 'Limitata', closed: 'Esaurita' };
            return `<div class="vote" role="group" aria-label="Vota lo stato del distributore">${Object.keys(labels).map(k => `<button class="v s-${k} ${mine === k ? 'is-mine' : ''}" aria-pressed="${mine === k}" title="${mine === k ? 'Il tuo voto: tocca di nuovo per toglierlo' : 'Vota: ' + labels[k]}${counts.old[k] ? ` · ${counts.old[k]} voti meno recenti, con meno peso` : ''}" onclick="window.quickInstantFlag('${id}', '${k}')"><span class="v-label">${labels[k]}${counts.old[k] ? `<span class="v-old">+${counts.old[k]} prima</span>` : ''}</span><span class="v-count num">${counts[k]}</span></button>`).join('')}</div>`;
        }

        function updateMapQuickBanner() {
            const banner = document.getElementById('mapQuickBanner');
            if (!selectedStationId) return banner.classList.add('hidden');
            const st = stationsData.find(s => s.id === selectedStationId);
            if (!st) return banner.classList.add('hidden');

            const effectiveStatus = st.status || 'unverified';
            const cfg = getStatusConfig(effectiveStatus);
            const timeInfo = st.lastUpdated ? `Ultimo voto ${formatRelativeTime(st.lastUpdated).toLowerCase()}` : 'Nessun voto';

            banner.classList.remove('hidden');
            banner.innerHTML = `
                <div class="qb">
                    <div>
                        <h4>${esc(st.name)}</h4>
                        <p><span class="status ${cfg.cls}"><i class="dot ${cfg.cls}"></i>${cfg.label}</span> · ${esc(st.address)} · ${timeInfo}</p>
                    </div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
                        ${flagButtons(st)}
                        <button onclick="window.openStationModal('${esc(st.id)}')" class="link">Dettagli</button>
                    </div>
                </div>`;
        }

        function renderStationsList() {
            const container = document.getElementById('stationsListContainer');
            if (!container) return;
            const filtered = getFilteredAndSortedStations();
            const countEl = document.getElementById('resultCount');
            if (countEl) countEl.textContent = filtered.length === 1 ? '1 distributore' : `${filtered.length} distributori`;

            if (filtered.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <h3>Nessun distributore trovato</h3>
                        <button onclick="window.resetFilters()" class="btn">Mostra tutti</button>
                    </div>`;
                return;
            }

            const DEFAULT_NOTES = ['Aperta.', 'Limitata.', 'Chiusa.', 'Aggiornata.'];
            container.innerHTML = filtered.map(st => {
                const effectiveStatus = st.status || 'unverified';
                const cfg = getStatusConfig(effectiveStatus);
                const isSelected = selectedStationId === st.id;
                const fuels = st.fuels || { benzina: null, diesel: null, gpl: null };
                const id = esc(st.id);
                const counts = voteCounts(st);
                const total = counts.available + counts.limited + counts.closed;
                const oldTotal = counts.old.available + counts.old.limited + counts.old.closed;
                const hasVotes = effectiveStatus !== 'unverified' && total > 0;
                const queue = st.queueLevel && effectiveStatus !== 'closed' && hasVotes ? (QUEUE_LABELS[st.queueLevel] || st.queueLevel) : '';

                const ks = ['available', 'limited', 'closed'];
                const bar = total + oldTotal ? `<div class="bar" aria-hidden="true">${ks.map(k => counts[k] ? `<i class="b-${k}" style="flex:${counts[k]}"></i>` : '').join('')}${ks.map(k => counts.old[k] ? `<i class="b-${k} old" style="flex:${counts.old[k]}"></i>` : '').join('')}</div>` : '';
                const detail = hasVotes
                    ? `<p class="detail"><span class="${fuels.benzina ? '' : 'off'}">Benzina</span><span class="sep">/</span><span class="${fuels.diesel ? '' : 'off'}">Diesel</span>${fuels.gpl ? '<span class="sep">/</span><span>GPL</span>' : ''}${queue ? `<span class="sep">·</span>${esc(queue)}` : ''}</p>`
                    : `<p class="hint">Nessun voto ancora. Se sei qui, segnala com'è la situazione.</p>`;

                const last = lastVoteOf(st);
                const isStale = last && (Date.now() - last.ts) > VOTE_WINDOW_MS;
                const lastCfg = last ? getStatusConfig(last.status) : null;
                const when = last
                    ? `Ultimo voto: <span class="lastvote ${lastCfg.cls}"><i class="dot ${lastCfg.cls}"></i>${lastCfg.label}</span> ${esc(formatRelativeTime(last.ts).toLowerCase())} · ${total} ${total === 1 ? 'voto recente' : 'voti recenti'}${oldTotal ? ` · ${oldTotal} precedenti` : ''}${isStale ? ' · nessun voto da oltre 45 minuti' : ''}`
                    : 'Nessun voto';
                const showNote = st.lastNote && !DEFAULT_NOTES.includes(st.lastNote);

                return `
                    <article id="station-card-${id}" class="station ${cfg.cls} ${isSelected ? 'is-selected' : ''}">
                        <div class="station-top" role="button" tabindex="0" onclick="window.openStationModal('${id}')" onkeydown="if(event.key==='Enter'){window.openStationModal('${id}')}">
                            <div>
                                <h3>${esc(st.name)}</h3>
                                <p class="meta">${esc(st.address)} · ${esc(st.zone)}${st.isPressSource ? ' · Fonte stampa' : ''}</p>
                            </div>
                            <span class="status ${cfg.cls}"><i class="dot ${cfg.cls}"></i>${cfg.label}</span>
                        </div>
                        ${bar}
                        ${detail}
                        ${showNote ? `<p class="note">${esc(st.lastNote)}</p>` : ''}
                        ${flagButtons(st)}
                        <div class="station-foot">
                            <span class="when${isStale ? ' stale' : ''}">${when}</span>
                            <button onclick="window.openStationModal('${id}')" class="link">Dettagli</button>
                        </div>
                        ${myVoteOf(st) ? `<p class="mine">Il tuo voto: <strong>${getStatusConfig(myVoteOf(st).status).label}</strong>. Tocca di nuovo lo stesso pulsante per toglierlo.</p>` : ''}
                    </article>`;
            }).join('');
        }

        window.handlePinClick = function(stationId) {
            selectedStationId = stationId;
            renderAll();
            window.openStationModal(stationId);
        };

        window.resetMapSelection = function() {
            selectedStationId = null;
            renderAll();
            if (leafletMap) leafletMap.setView([41.1250, 14.7720], 12);
        };

        window.switchMapMode = function(mode) {
            mapMode = mode;
            document.getElementById('schematicMapContainer').classList.toggle('hidden', mode !== 'schematic');
            document.getElementById('roadMapContainer').classList.toggle('hidden', mode === 'schematic');
            document.getElementById('btnMapSchematic').classList.toggle('is-active', mode === 'schematic');
            document.getElementById('btnMapRoad').classList.toggle('is-active', mode !== 'schematic');
            if (mode === 'road') {
                initLeafletMapIfNeeded();
                setTimeout(() => { if (leafletMap) leafletMap.invalidateSize(); renderLeafletMarkers(); }, 80);
            }
        };

        window.setFilterStatus = function(status) { currentFilterStatus = status; renderAll(); };
        window.handleSearchChange = function(val) { currentSearchQuery = val; document.getElementById('clearSearchBtn').classList.toggle('hidden', !val); renderAll(); };
        window.clearSearch = function() { document.getElementById('searchInput').value = ''; window.handleSearchChange(''); };
        window.resetFilters = function() { currentFilterStatus = 'all'; window.clearSearch(); renderAll(); };
        window.handleSortChange = function(val) { currentSortBy = val; renderStationsList(); };

        window.openStationModal = function(stationId) {
            const st = stationsData.find(s => s.id === stationId);
            if (!st) return;
            selectedStationId = stationId;
            renderSchematicSvgPins(); updateMapQuickBanner();

            document.getElementById('modalBrandBadge').textContent = st.brand || 'Distributore';
            document.getElementById('modalZoneBadge').textContent = st.zone;
            document.getElementById('modalStationName').textContent = st.name;
            document.getElementById('modalStationAddress').textContent = st.address;
            const mapsQuery = encodeURIComponent(`${st.name} ${st.address} Benevento`);
            document.getElementById('modalGoogleMapsLink').href = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

            const cfg = getStatusConfig(st.status || 'unverified');
            document.getElementById('modalStatusBox').className = cfg.cls;
            document.getElementById('modalStatusBox').innerHTML = `<span class="status ${cfg.cls}"><i class="dot ${cfg.cls}"></i>${cfg.label}</span>${st.lastUpdated ? ` <span class="when">· aggiornato ${esc(formatRelativeTime(st.lastUpdated).toLowerCase())}</span>` : ''}${myVoteOf(st) ? ` <span class="when">· il tuo voto: ${getStatusConfig(myVoteOf(st).status).label}</span>` : ''}`;
            const cnt = voteCounts(st);
            ['available', 'limited', 'closed'].forEach(k => { const el = document.getElementById(`flagCount-${k}`); if (el) el.innerHTML = `${cnt[k]}${cnt.old[k] ? `<span class="v-old-inline" title="Voti precedenti, con meno peso">+${cnt.old[k]}</span>` : ''}`; });

            const f = st.fuels || {};
            const available = [f.benzina && 'Benzina', f.diesel && 'Diesel', f.gpl && 'GPL'].filter(Boolean);
            document.getElementById('modalFuelPills').textContent = st.status === 'unverified' || !st.status ? 'Carburanti non ancora verificati.' : (available.length ? `Disponibili: ${available.join(', ')}` : 'Nessun carburante disponibile.');
            document.getElementById('modalNoteBox').textContent = st.lastNote ? `"${st.lastNote}"` : 'Nessuna nota.';
            document.getElementById('chkBenzina').checked = st.fuels?.benzina !== false;
            document.getElementById('chkDiesel').checked = st.fuels?.diesel !== false;
            document.getElementById('chkGpl').checked = !!st.fuels?.gpl;
            document.getElementById('selectQueue').value = (st.queueLevel && st.queueLevel !== 'Da verificare') ? st.queueLevel : 'Scorrevole';
            document.getElementById('inputCitizenNote').value = '';

            const mine = myVoteOf(st);
            window.selectFlagChoice(mine ? mine.status : (st.status === 'unverified' ? 'available' : st.status));
            if (mine) {
                document.getElementById('chkBenzina').checked = !!mine.fuels?.benzina;
                document.getElementById('chkDiesel').checked = !!mine.fuels?.diesel;
                document.getElementById('chkGpl').checked = !!mine.fuels?.gpl;
                document.getElementById('selectQueue').value = mine.queueLevel || 'Scorrevole';
            }
            document.getElementById('removeVoteBtn').classList.toggle('hidden', !mine);
            document.getElementById('submitFlagBtn').textContent = mine ? 'Aggiorna il mio voto' : 'Conferma il mio voto';
            document.getElementById('stationModal').classList.replace('hidden', 'flex');
        };

        window.closeStationModal = function() { document.getElementById('stationModal').classList.replace('flex', 'hidden'); };

        window.selectFlagChoice = function(status) {
            modalFlagStatusChoice = status;
            ['available', 'limited', 'closed'].forEach(c => {
                const btn = document.getElementById(`flagChoice-${c}`);
                if (!btn) return;
                btn.className = c === status ? 'choice is-selected' : 'choice';
                btn.setAttribute('aria-pressed', c === status ? 'true' : 'false');
            });
            if (status === 'closed') {
                document.getElementById('chkBenzina').checked = false; document.getElementById('chkDiesel').checked = false; document.getElementById('selectQueue').value = 'Nessuna';
            } else if (status === 'available') {
                document.getElementById('chkBenzina').checked = true; document.getElementById('chkDiesel').checked = true;
                if (document.getElementById('selectQueue').value === 'Nessuna') document.getElementById('selectQueue').value = 'Scorrevole';
            }
        };

        // ---- Segnalazioni: una per persona per distributore; ripremere lo stesso stato la rimuove ----
        function myUid() { return currentUser?.uid || 'cittadino-bn-local'; }
        function myVoteOf(st) { return st && st.votes ? (st.votes[myUid()] || null) : null; }

        // Finestra dei voti "freschi": contano per lo stato solo i voti dei 45 minuti che precedono l'ultimo voto.
        // I voti più vecchi restano visibili ma "in ombra": un nuovo voto dopo una pausa riparte da zero.
        const VOTE_WINDOW_MS = 45 * 60 * 1000;

        function splitVotes(votes) {
            const list = Object.entries(votes).map(([uid, v]) => ({ ...v, uid }));
            if (!list.length) return { active: [], old: [] };
            const latestTs = Math.max(...list.map(v => v.ts));
            return {
                active: list.filter(v => v.ts >= latestTs - VOTE_WINDOW_MS),
                old: list.filter(v => v.ts < latestTs - VOTE_WINDOW_MS)
            };
        }

        function deriveFromVotes(votes, legacy) {
            const { active } = splitVotes(votes);
            if (!active.length) {
                if (legacy) return { ...legacy };
                return { status: 'unverified', lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: 'Da verificare', lastNote: '', lastReporterId: null };
            }
            const counts = {};
            active.forEach(v => { counts[v.status] = (counts[v.status] || 0) + 1; });
            const top = Math.max(...Object.values(counts));
            const tied = Object.keys(counts).filter(k => counts[k] === top);
            // vince lo stato con più voti freschi; a parità (anche 1-1-1) decide il voto più recente tra quelli a pari merito
            const winner = active.filter(v => tied.includes(v.status)).sort((x, y) => y.ts - x.ts)[0].status;
            const latest = active.filter(v => v.status === winner).sort((x, y) => y.ts - x.ts)[0];
            return { status: winner, lastUpdated: latest.ts, confirmations: top, fuels: latest.fuels, queueLevel: latest.queueLevel, lastNote: latest.note, lastReporterId: latest.uid };
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

        async function persistVote(stationId, uid, vote) {
            if (!db) return;
            const ref = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('stations').doc(stationId);
            try {
                await db.runTransaction(async (tx) => {
                    const snap = await tx.get(ref);
                    if (!snap.exists) return;
                    const data = snap.data();
                    data.fuels = parseFuels(data.fuels);
                    const next = applyVoteToStation(data, uid, vote);
                    tx.update(ref, {
                        status: next.status, lastUpdated: next.lastUpdated, confirmations: next.confirmations,
                        fuels: next.fuels, queueLevel: next.queueLevel, lastNote: next.lastNote, lastReporterId: next.lastReporterId,
                        isPressSource: false, seedVersion: SEED_VERSION, votes: next.votes, legacy: next.legacy
                    });
                });
            } catch (e) { console.error(e); }
        }

        async function castVote(stationId, vote) {
            const i = stationsData.findIndex(s => s.id === stationId);
            if (i === -1) return;
            const uid = myUid();
            stationsData[i] = applyVoteToStation(stationsData[i], uid, vote);
            renderAll();
            await persistVote(stationId, uid, vote);
        }

        window.quickInstantFlag = async function(stationId, newStatus) {
            const st = stationsData.find(s => s.id === stationId);
            if (!st) return;
            const mine = myVoteOf(st);
            if (mine && mine.status === newStatus) {
                showToast(st.name, 'Voto tolto.');
                await castVote(stationId, null);
                return;
            }
            const vote = {
                status: newStatus, ts: Date.now(),
                fuels: newStatus === 'closed' ? { benzina: false, diesel: false, gpl: false } : { benzina: true, diesel: true, gpl: st.fuels?.gpl || false },
                queueLevel: newStatus === 'closed' ? 'Nessuna' : (newStatus === 'limited' ? 'Moderata' : 'Scorrevole'),
                note: newStatus === 'available' ? 'Aperta.' : newStatus === 'limited' ? 'Limitata.' : 'Chiusa.'
            };
            showToast(st.name, mine ? 'Voto cambiato.' : 'Voto registrato.');
            await castVote(stationId, vote);
        };

        window.removeMyVote = async function(stationId) {
            const st = stationsData.find(s => s.id === stationId);
            if (!st || !myVoteOf(st)) return;
            window.closeStationModal();
            showToast(st.name, 'Voto tolto.');
            await castVote(stationId, null);
        };

        window.submitStationFlag = async function() {
            if (!selectedStationId) return;
            const id = selectedStationId;
            const vote = {
                status: modalFlagStatusChoice, ts: Date.now(),
                fuels: { benzina: document.getElementById('chkBenzina').checked, diesel: document.getElementById('chkDiesel').checked, gpl: document.getElementById('chkGpl').checked },
                queueLevel: document.getElementById('selectQueue').value,
                note: document.getElementById('inputCitizenNote').value.trim() || 'Aggiornata.'
            };
            window.closeStationModal();
            showToast('Voto registrato', 'Grazie! Puoi cambiarlo o toglierlo quando vuoi.');
            await castVote(id, vote);
        };

        window.openAddStationModal = () => document.getElementById('addStationModal').classList.replace('hidden', 'flex');
        window.closeAddStationModal = () => document.getElementById('addStationModal').classList.replace('flex', 'hidden');

        window.handleAddStationSubmit = async function(e) {
            e.preventDefault();
            const brand = document.getElementById('newStationBrand').value;
            const zone = document.getElementById('newStationZone').value;
            const name = document.getElementById('newStationName').value.trim();
            const address = document.getElementById('newStationAddress').value.trim();
            const status = document.getElementById('newStationStatus').value;
            if (!name || !address) return;

            const baseCoords = ZONE_COORDINATES_MAP[zone];
            const newId = 'bn-custom-' + Date.now();
            const newStation = {
                id: newId, name, brand, address, zone,
                lat: Number((baseCoords.lat + (Math.random() - 0.5) * 0.004).toFixed(4)), lng: Number((baseCoords.lng + (Math.random() - 0.5) * 0.004).toFixed(4)),
                svgX: Math.min(940, Math.max(60, baseCoords.svgX + Math.floor(Math.random() * 44) - 22)), svgY: Math.min(620, Math.max(60, baseCoords.svgY + Math.floor(Math.random() * 44) - 22)),
                status, lastUpdated: status !== 'unverified' ? Date.now() : null, confirmations: status !== 'unverified' ? 1 : 0,
                fuels: { benzina: status !== 'closed', diesel: status !== 'closed', gpl: false },
                queueLevel: status === 'unverified' ? 'Da verificare' : (status === 'closed' ? 'Nessuna' : 'Scorrevole'),
                lastNote: document.getElementById('newStationNote').value.trim(),
                seedVersion: SEED_VERSION, lastReporterId: currentUser?.uid || 'cittadino-bn'
            };

            stationsData.unshift(newStation); selectedStationId = newId;
            window.closeAddStationModal(); e.target.reset(); renderAll(); showToast("Nuovo distributore aggiunto!", `${name} è ora visibile.`);

            if (db) {
                try { await db.collection('artifacts').doc(appId).collection('public').doc('data').collection('stations').doc(newId).set(newStation); } 
                catch (err) { console.error(err); }
            }
        };

        let toastTimeout = null;
        function showToast(title, message) {
            const toast = document.getElementById('toastNotification');
            document.getElementById('toastTitle').textContent = title;
            document.getElementById('toastMessage').textContent = message;
            toast.classList.replace('hidden', 'flex');
            if (toastTimeout) clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => toast.classList.replace('flex', 'hidden'), 4000);
        }

        setInterval(() => { renderStationsList(); updateMapQuickBanner(); }, 30000);

        // Rendering immediato all'apertura del file
        window.onload = function() {
            renderAll();
            initFirebaseAndSync();
        };

        // Notizie dalla stampa locale (/api/press-news)
        (function() {
            const timeAgo = (ts) => {
                if (!ts) return '';
                const min = Math.round((Date.now() - ts) / 60000);
                if (min < 1) return 'adesso';
                if (min < 60) return `${min} min fa`;
                const h = Math.round(min / 60);
                if (h < 24) return `${h} h fa`;
                return `${Math.round(h / 24)} g fa`;
            };

            async function loadPressNews() {
                try {
                    const res = await fetch('/api/press-news');
                    if (!res.ok) return;
                    const data = await res.json();
                    const list = document.getElementById('pressNewsList');
                    if (!data.items || data.items.length === 0) {
                        list.innerHTML = '<li class="empty">Nessuna notizia recente.</li>';
                        return;
                    }
                    list.innerHTML = data.items.slice(0, 3).map(it => {
                        const href = /^https?:\/\//.test(it.link) ? it.link : '#';
                        return `<li><span class="src">${esc(it.source)}</span><a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(it.title)}</a><span class="ago">${timeAgo(it.publishedAt)}</span></li>`;
                    }).join('');
                    document.getElementById('pressNewsUpdated').textContent = `aggiornato ${timeAgo(data.updatedAt)}`;
                    document.getElementById('newsToggle').classList.toggle('hidden', Math.min(data.items.length, 3) < 2);
                } catch (e) {
                    console.warn('Notizie stampa non disponibili', e);
                }
            }

            loadPressNews();
            setInterval(loadPressNews, 5 * 60 * 1000);
        })();

        // ---- Usabilità: vista elenco/mappa su mobile, tastiera, focus ----
        (function() {
            window.setView = function(view) {
                document.body.dataset.view = view;
                document.getElementById('btnViewList').classList.toggle('is-active', view === 'list');
                document.getElementById('btnViewMap').classList.toggle('is-active', view === 'map');
                if (view === 'map' && leafletMap) setTimeout(() => leafletMap.invalidateSize(), 50);
                window.scrollTo({ top: 0 });
            };
            document.body.dataset.view = 'list';

            let lastFocus = null;
            const lock = () => { document.body.style.overflow = document.querySelector('.overlay.flex') ? 'hidden' : ''; };

            const wrapOpen = (name, overlayId, focusSel) => {
                const orig = window[name];
                window[name] = function(...args) {
                    lastFocus = document.activeElement;
                    orig.apply(this, args);
                    lock();
                    const el = document.querySelector(`#${overlayId} ${focusSel}`);
                    if (el) setTimeout(() => el.focus({ preventScroll: true }), 30);
                };
            };
            const wrapClose = (name) => {
                const orig = window[name];
                window[name] = function(...args) {
                    orig.apply(this, args);
                    lock();
                    if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
                };
            };
            wrapOpen('openStationModal', 'stationModal', '.choice.is-selected');
            wrapOpen('openAddStationModal', 'addStationModal', '#newStationName');
            wrapClose('closeStationModal');
            wrapClose('closeAddStationModal');

            document.addEventListener('keydown', (e) => {
                if (e.key !== 'Escape') return;
                if (!document.getElementById('stationModal').classList.contains('hidden')) window.closeStationModal();
                else if (!document.getElementById('addStationModal').classList.contains('hidden')) window.closeAddStationModal();
            });
            document.querySelectorAll('.overlay').forEach(o => o.addEventListener('mousedown', (e) => {
                if (e.target !== o) return;
                if (o.id === 'stationModal') window.closeStationModal(); else window.closeAddStationModal();
            }));
        })();

        window.toggleNews = function() {
            const open = document.querySelector('.news').classList.toggle('is-open');
            document.getElementById('newsToggle').textContent = open ? 'Mostra meno' : 'Mostra tutte';
        };
