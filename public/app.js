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
                case 'available': return { label: 'Aperta / Disponibile', shortLabel: 'APERTA', emoji: '🟢', hex: '#10B981', badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300', cardBorderClass: 'border-l-4 border-l-emerald-500', pulseClass: 'pin-pulse-available' };
                case 'limited': return { label: 'Limitata / Code / Presidio', shortLabel: 'LIMITATA', emoji: '🟡', hex: '#F59E0B', badgeClass: 'bg-amber-100 text-amber-900 border-amber-300', cardBorderClass: 'border-l-4 border-l-amber-500', pulseClass: 'pin-pulse-limited' };
                case 'closed': return { label: 'Chiusa / Esaurito', shortLabel: 'ESAURITO', emoji: '🔴', hex: '#E11D48', badgeClass: 'bg-rose-100 text-rose-900 border-rose-300', cardBorderClass: 'border-l-4 border-l-rose-600', pulseClass: 'pin-pulse-closed' };
                case 'unverified': default: return { label: 'In attesa di segnalazione', shortLabel: 'DA VERIFICARE', emoji: '⚪', hex: '#64748B', badgeClass: 'bg-slate-100 text-slate-700 border-slate-300', cardBorderClass: 'border-l-4 border-l-slate-400', pulseClass: '' };
            }
        }


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
            if (dot) dot.className = isOnline ? "w-2 h-2 rounded-full bg-emerald-400 animate-pulse" : "w-2 h-2 rounded-full bg-amber-400";
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
                pill.className = currentFilterStatus === st
                    ? "px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition bg-slate-900 text-amber-400 shadow-xs"
                    : "px-2 py-1.5 rounded-lg text-xs font-bold transition bg-slate-100 text-slate-700 hover:bg-slate-200";
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
                const opacity = isVisible ? '1' : '0.2';
                const fullName = station.name || 'Pompa';
                const shortTitle = esc(fullName.length > 18 ? fullName.substring(0, 17) + '…' : fullName);
                const lv = lastVoteOf(station);
                const isVerifiedAndRecent = station.status !== 'unverified' && lv && (Date.now() - lv.ts) < VOTE_WINDOW_MS;

                svgHtml += `
                    <g class="svg-pin-group ${isSelected ? 'svg-pin-selected' : ''}" style="opacity: ${opacity};" onclick="window.handlePinClick('${esc(station.id)}')">
                        ${isVisible && (isVerifiedAndRecent || isSelected) && cfg.pulseClass ? `<circle cx="${x}" cy="${y}" r="22" fill="${cfg.hex}" class="${cfg.pulseClass}" />` : ''}

                        <!-- Label Pill sotto il pin -->
                        <g transform="translate(${x}, ${y + 27})" filter="url(#cardShadow)">
                            <rect x="-66" y="-10" width="132" height="20" rx="6" fill="${isSelected ? '#0F172A' : '#FFFFFF'}" stroke="${cfg.hex}" stroke-width="1.8" />
                            <text x="0" y="3.5" text-anchor="middle" font-family="Inter, sans-serif" font-size="9.5" font-weight="800" fill="${isSelected ? '#FACC15' : '#0F172A'}">${shortTitle}</text>
                        </g>

                        <!-- Cerchio Principale Segnaposto -->
                        <circle cx="${x}" cy="${y}" r="${isSelected ? 19 : 16}" fill="${cfg.hex}" stroke="#FFFFFF" stroke-width="3.5" filter="url(#pinShadow)" />

                        <!-- Icona Vettoriale Pompa Carburante -->
                        <g transform="translate(${x - 6}, ${y - 7}) scale(0.65)">
                            <rect x="1" y="2" width="12" height="15" rx="2" fill="none" stroke="#FFFFFF" stroke-width="2.2" />
                            <rect x="3" y="4" width="8" height="4" rx="1" fill="#FFFFFF" />
                            <path d="M 13 6 L 16 6 L 16 14 L 14 16" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
                        </g>
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
                const size = selectedStationId === station.id ? 40 : 34;
                const icon = L.divIcon({
                    className: '',
                    html: `<div class="custom-leaflet-pin" style="width:${size}px;height:${size}px;background:${cfg.hex};"><i class="fa-solid fa-gas-pump text-xs"></i></div>`,
                    iconSize: [size, size], iconAnchor: [size / 2, size / 2]
                });
                const marker = L.marker([station.lat, station.lng], { icon }).addTo(leafletMap);
                marker.on('click', () => window.handlePinClick(station.id));
                leafletMarkers[station.id] = marker;
            });
        }

        // Pulsanti di voto con contatore (voti recenti in grande, voti precedenti in ombra)
        function flagButtons(st, compact) {
            const id = esc(st.id);
            const mine = (myVoteOf(st) || {}).status;
            const counts = voteCounts(st);
            const defs = [
                ['available', '🟢 Aperta', 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100', 'bg-emerald-600 text-white'],
                ['limited', '🟡 Limitata', 'bg-amber-50 text-amber-800 hover:bg-amber-100', 'bg-amber-500 text-white'],
                ['closed', '🔴 Esaurita', 'bg-rose-50 text-rose-800 hover:bg-rose-100', 'bg-rose-600 text-white']
            ];
            return `<div class="grid grid-cols-3 gap-1.5 ${compact ? 'min-w-[260px]' : ''}" role="group" aria-label="Vota lo stato">${defs.map(([k, label, idle, on]) => `
                <button onclick="window.quickInstantFlag('${id}', '${k}')" aria-pressed="${mine === k}" title="${mine === k ? 'Il tuo voto: tocca di nuovo per toglierlo' : 'Vota: ' + label.slice(3)}" class="px-2 py-2 rounded-xl text-[11px] sm:text-xs font-bold border transition active:scale-95 ${mine === k ? on + ' border-transparent ring-2 ring-slate-900/30' : idle + ' border-transparent'}">
                    <span class="block leading-tight">${label}</span>
                    <span class="mt-0.5 block font-mono text-sm font-extrabold">${counts[k]}</span>
                    ${mine === k ? '<span class="block text-[10px] font-semibold leading-none opacity-90">il tuo voto</span>' : ''}
                </button>`).join('')}</div>`;
        }

        // Barra di distribuzione dei voti: verde / giallo / rosso (i voti precedenti restano, sbiaditi)
        function voteBar(counts) {
            const ks = [['available', 'bg-emerald-500'], ['limited', 'bg-amber-400'], ['closed', 'bg-rose-600']];
            const act = ks.map(([k, c]) => counts[k] ? `<i class="block ${c}" style="flex:${counts[k]}"></i>` : '').join('');
            const old = ks.map(([k, c]) => counts.old[k] ? `<i class="block ${c} opacity-30" style="flex:${counts.old[k]}"></i>` : '').join('');
            if (!act && !old) return '';
            return `<div class="flex h-2 rounded-full overflow-hidden gap-0.5 bg-slate-100" aria-hidden="true">${act}${old}</div>`;
        }

        function updateMapQuickBanner() {
            const banner = document.getElementById('mapQuickBanner');
            if (!selectedStationId) return banner.classList.add('hidden');
            const st = stationsData.find(s => s.id === selectedStationId);
            if (!st) return banner.classList.add('hidden');

            const cfg = getStatusConfig(st.status);
            const lv = lastVoteOf(st);
            const timeInfo = lv ? `Ultimo voto: <strong>${esc(formatRelativeTime(lv.ts))}</strong> (${esc(formatExactTime(lv.ts))})` : `<strong>Nessun voto ancora</strong>`;

            banner.classList.remove('hidden');
            banner.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div class="flex items-start gap-2.5">
                        <span class="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 font-bold shadow-xs" style="background:${cfg.hex}">
                            <i class="fa-solid fa-gas-pump"></i>
                        </span>
                        <div>
                            <div class="flex items-center gap-2 flex-wrap">
                                <h4 class="text-xs sm:text-sm font-extrabold text-slate-900">${esc(st.name)}</h4>
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${cfg.badgeClass}">${cfg.emoji} ${cfg.label}</span>
                            </div>
                            <p class="text-[11px] text-slate-600">${esc(st.address)} (${esc(st.zone)}) • ${timeInfo}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5 shrink-0 flex-wrap">
                        ${flagButtons(st, true)}
                        <button onclick="window.openStationModal('${esc(st.id)}')" class="px-2.5 py-1.5 rounded-lg bg-slate-900 text-amber-400 text-[11px] font-bold">Dettagli</button>
                    </div>
                </div>`;
        }

        function renderStationsList() {
            const container = document.getElementById('stationsListContainer');
            if (!container) return;
            const filtered = getFilteredAndSortedStations();

            if (filtered.length === 0) {
                container.innerHTML = `
                    <div class="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
                        <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-lg"><i class="fa-solid fa-gas-pump"></i></div>
                        <h3 class="text-sm font-bold text-slate-800">Nessun distributore in questo filtro</h3>
                        <button onclick="window.resetFilters()" class="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold">Mostra tutti</button>
                    </div>`;
                return;
            }

            const DEFAULT_NOTES = ['Aperta.', 'Limitata.', 'Chiusa.', 'Aggiornata.'];
            let html = '';
            filtered.forEach(st => {
                const effectiveStatus = st.status || 'unverified';
                const cfg = getStatusConfig(effectiveStatus);
                const isSelected = selectedStationId === st.id;
                const fuels = st.fuels || { benzina: null, diesel: null, gpl: null };
                const id = esc(st.id);
                const counts = voteCounts(st);
                const total = counts.available + counts.limited + counts.closed;
                const lv = lastVoteOf(st);
                const lastCfg = lv ? getStatusConfig(lv.status) : null;
                const isStale = lv && (Date.now() - lv.ts) > VOTE_WINDOW_MS;
                const mine = myVoteOf(st);

                let fuelSectionHtml = effectiveStatus === 'unverified'
                    ? `<div class="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-dashed border-slate-300"><i class="fa-regular fa-circle-question text-slate-400"></i><span>Nessun voto ancora: se sei qui, segnala com'è la situazione.</span></div>`
                    : `<div class="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span class="px-2 py-0.5 rounded-md font-bold ${fuels.benzina ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-400 line-through'}">Benzina ${fuels.benzina ? '✓' : '✗'}</span>
                        <span class="px-2 py-0.5 rounded-md font-bold ${fuels.diesel ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-400 line-through'}">Diesel ${fuels.diesel ? '✓' : '✗'}</span>
                        ${fuels.gpl ? `<span class="px-2 py-0.5 rounded-md font-bold bg-blue-50 text-blue-800 border-blue-200">GPL ✓</span>` : ''}
                        ${st.queueLevel && effectiveStatus !== 'closed' ? `<span class="px-2 py-0.5 rounded-md font-semibold bg-amber-50 text-amber-900 border-amber-200"><i class="fa-solid fa-car-side mr-1 text-amber-600"></i>${esc(st.queueLevel)}</span>` : ''}
                       </div>`;

                html += `
                    <div id="station-card-${id}" class="bg-white rounded-2xl border ${isSelected ? 'border-slate-900 ring-2 ring-slate-900/15' : 'border-slate-200'} ${cfg.cardBorderClass} p-3.5 shadow-xs hover:shadow-md transition flex flex-col gap-2.5">
                        <div class="flex items-start justify-between gap-2 cursor-pointer" onclick="window.openStationModal('${id}')">
                            <div>
                                <div class="flex items-center gap-1.5 flex-wrap">
                                    <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-slate-900 text-amber-400">${esc(st.brand || 'Distributore')}</span>
                                    ${st.isPressSource ? `<span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-red-600 text-white"><i class="fa-solid fa-newspaper mr-1"></i>Fonte Stampa</span>` : ''}
                                    <span class="text-[11px] font-semibold text-slate-500">• ${esc(st.zone)}</span>
                                </div>
                                <h3 class="text-sm font-extrabold text-slate-900 mt-0.5 hover:text-red-600 transition">${esc(st.name)}</h3>
                                <p class="text-xs text-slate-500 flex items-center gap-1"><i class="fa-solid fa-location-dot text-slate-400"></i><span>${esc(st.address)}</span></p>
                            </div>
                            <span class="px-2.5 py-1 rounded-xl text-xs font-extrabold border shrink-0 ${cfg.badgeClass}">${cfg.emoji} ${cfg.shortLabel}</span>
                        </div>
                        ${voteBar(counts)}
                        ${fuelSectionHtml}
                        ${st.lastNote && !DEFAULT_NOTES.includes(st.lastNote) ? `<div class="text-xs ${st.isPressSource ? 'bg-amber-50/90 text-slate-900 border-amber-300 font-medium' : 'bg-slate-50 text-slate-700 border-slate-200/80 italic'} px-3 py-2 rounded-xl border">${st.isPressSource ? '<i class="fa-solid fa-bullhorn text-red-600 mr-1"></i>' : ''}"${esc(st.lastNote)}"</div>` : ''}
                        ${flagButtons(st)}
                        ${mine ? `<div class="text-[11px] text-slate-600">Il tuo voto: <strong>${getStatusConfig(mine.status).emoji} ${getStatusConfig(mine.status).shortLabel}</strong> · tocca di nuovo lo stesso pulsante per toglierlo.</div>` : ''}
                        <div class="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                            <div class="text-[11px] ${isStale ? 'text-amber-700 font-semibold' : 'text-slate-500'} flex items-center flex-wrap gap-1.5">
                                <i class="fa-regular fa-clock text-slate-400"></i>
                                ${lv ? `<span>Ultimo voto: <strong class="px-1.5 py-0.5 rounded-md border ${lastCfg.badgeClass}">${lastCfg.emoji} ${lastCfg.shortLabel}</strong> ${esc(formatRelativeTime(lv.ts).toLowerCase())}</span><span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px]"><i class="fa-solid fa-users text-[9px] mr-0.5"></i>${total}</span>${isStale ? '<span>· nessun voto da oltre 45 min</span>' : ''}` : `<span class="text-slate-500 font-medium">In attesa del primo voto</span>`}
                            </div>
                            <button onclick="window.openStationModal('${id}')" class="px-2 py-1 rounded-lg bg-slate-900 text-amber-400 text-[11px] font-bold"><i class="fa-solid fa-pen-to-square"></i> Dettagli</button>
                        </div>
                    </div>`;
            });
            container.innerHTML = html;
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
            const on = 'px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 bg-white text-slate-900 shadow-sm';
            const off = 'px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 text-slate-600 hover:text-slate-900';
            document.getElementById('btnMapSchematic').className = mode === 'schematic' ? on : off;
            document.getElementById('btnMapRoad').className = mode === 'road' ? on : off;
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
            document.getElementById('modalStationAddress').innerHTML = `${esc(st.address)}`;
            const mapsQuery = encodeURIComponent(`${st.name} ${st.address} Benevento`);
            document.getElementById('modalGoogleMapsLink').href = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

            const cfg = getStatusConfig(st.status || 'unverified');
            const cnt = voteCounts(st);
            const mine = myVoteOf(st);
            document.getElementById('modalStatusBox').className = `px-5 py-3.5 border-b flex flex-wrap items-center justify-between gap-2 ${cfg.badgeClass}`;
            document.getElementById('modalStatusBox').innerHTML = `
                <div class="flex items-center gap-2"><span class="text-lg">${cfg.emoji}</span><div><div class="text-xs font-extrabold uppercase">${cfg.label}</div><div class="text-[11px] font-medium opacity-80">Voti recenti: 🟢 ${cnt.available} · 🟡 ${cnt.limited} · 🔴 ${cnt.closed}${mine ? ` · il tuo voto: ${getStatusConfig(mine.status).shortLabel}` : ''}</div></div></div>
            `;
            ['available', 'limited', 'closed'].forEach(k => {
                const el = document.getElementById(`flagCount-${k}`);
                if (el) el.textContent = cnt[k];
            });

            const f = st.fuels || {};
            const avail = [f.benzina && 'Benzina', f.diesel && 'Diesel', f.gpl && 'GPL'].filter(Boolean);
            document.getElementById('modalFuelPills').innerHTML = (st.status && st.status !== 'unverified')
                ? (avail.length ? avail.map(n => `<span class="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">${n}</span>`).join('') : '<span class="text-[11px] text-slate-500">Nessun carburante disponibile.</span>')
                : '<span class="text-[11px] text-slate-500">Carburanti non ancora verificati.</span>';
            document.getElementById('modalNoteBox').textContent = st.lastNote ? `"${st.lastNote}"` : 'Nessuna nota presente.';
            document.getElementById('chkBenzina').checked = st.fuels?.benzina !== false;
            document.getElementById('chkDiesel').checked = st.fuels?.diesel !== false;
            document.getElementById('chkGpl').checked = !!st.fuels?.gpl;
            document.getElementById('selectQueue').value = (st.queueLevel && st.queueLevel !== 'Da verificare') ? st.queueLevel : 'Scorrevole';
            document.getElementById('inputCitizenNote').value = '';

            window.selectFlagChoice(mine ? mine.status : (st.status === 'unverified' ? 'available' : st.status));
            if (mine) {
                document.getElementById('chkBenzina').checked = !!mine.fuels?.benzina;
                document.getElementById('chkDiesel').checked = !!mine.fuels?.diesel;
                document.getElementById('chkGpl').checked = !!mine.fuels?.gpl;
                document.getElementById('selectQueue').value = mine.queueLevel || 'Scorrevole';
            }
            document.getElementById('removeVoteBtn').classList.toggle('hidden', !mine);
            const submitLabel = document.querySelector('#submitFlagBtn span');
            if (submitLabel) submitLabel.textContent = mine ? 'Aggiorna il mio voto' : 'Conferma il mio voto';
            document.getElementById('stationModal').classList.replace('hidden', 'flex');
        };


        window.closeStationModal = function() { document.getElementById('stationModal').classList.replace('flex', 'hidden'); };

        window.selectFlagChoice = function(status) {
            modalFlagStatusChoice = status;
            ['available', 'limited', 'closed'].forEach(c => {
                const btn = document.getElementById(`flagChoice-${c}`);
                if (!btn) return;
                btn.className = c === status
                    ? `flex sm:flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition text-left sm:text-center ${c === 'available' ? 'border-emerald-600 bg-emerald-50 ring-2' : c === 'limited' ? 'border-amber-500 bg-amber-50 ring-2' : 'border-rose-600 bg-rose-50 ring-2'}`
                    : "flex sm:flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-50 transition text-left opacity-75";
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
                    if (!data.items || data.items.length === 0) {
                        document.getElementById('pressNewsList').innerHTML = '<li class="text-slate-500 italic">Nessuna notizia recente dalla stampa locale.</li>';
                        return;
                    }
                    document.getElementById('pressNewsList').innerHTML = data.items.slice(0, 5).map(it => {
                        const href = /^https?:\/\//.test(it.link) ? it.link : '#';
                        return `<li class="flex gap-1.5"><span class="shrink-0 px-1.5 rounded bg-slate-900 text-amber-400 text-[10px] font-extrabold uppercase leading-5">${esc(it.source)}</span><a href="${esc(href)}" target="_blank" rel="noopener noreferrer" class="hover:text-red-600 hover:underline font-semibold">${esc(it.title)}</a><span class="shrink-0 text-[10px] text-slate-500 leading-5">${timeAgo(it.publishedAt)}</span></li>`;
                    }).join('');
                    document.getElementById('pressNewsUpdated').textContent = `• aggiornato ${timeAgo(data.updatedAt)}`;
                } catch (e) {
                    console.warn('Notizie stampa non disponibili', e);
                }
            }

            loadPressNews();
            setInterval(loadPressNews, 5 * 60 * 1000);
        })();

        // ---- Usabilità: tastiera e focus delle schede ----
        (function() {
            const MODALS = ['stationModal', 'addStationModal'];
            let lastFocus = null;
            const isOpen = (id) => document.getElementById(id).classList.contains('flex');
            const lock = () => { document.body.style.overflow = MODALS.some(isOpen) ? 'hidden' : ''; };

            const wrapOpen = (name, focusSel, overlayId) => {
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
            wrapOpen('openStationModal', '[aria-pressed="true"]', 'stationModal');
            wrapOpen('openAddStationModal', '#newStationName', 'addStationModal');
            wrapClose('closeStationModal');
            wrapClose('closeAddStationModal');

            document.addEventListener('keydown', (e) => {
                if (e.key !== 'Escape') return;
                if (isOpen('stationModal')) window.closeStationModal();
                else if (isOpen('addStationModal')) window.closeAddStationModal();
            });
            MODALS.forEach(id => document.getElementById(id).addEventListener('mousedown', (e) => {
                if (e.target.id !== id) return;
                if (id === 'stationModal') window.closeStationModal(); else window.closeAddStationModal();
            }));
        })();

        // ---- Mappa semplificata: zoom (rotella, pizzico, pulsanti) e trascinamento ----
        (function() {
            const svg = document.getElementById('beneventoSchematicSvg');
            const box = document.getElementById('schematicMapContainer');
            if (!svg || !box) return;

            const W = 1000, H = 680, MAX_ZOOM = 6;
            let vb = { x: 0, y: 0, w: W, h: H };
            const pointers = new Map();
            let dragMoved = false, pinchStart = null;

            svg.style.touchAction = 'none';
            svg.style.cursor = 'grab';

            function apply() {
                // il rettangolo visibile resta dentro la mappa
                vb.w = Math.min(W, Math.max(W / MAX_ZOOM, vb.w));
                vb.h = vb.w * (H / W);
                vb.x = Math.min(W - vb.w, Math.max(0, vb.x));
                vb.y = Math.min(H - vb.h, Math.max(0, vb.y));
                svg.setAttribute('viewBox', `${vb.x.toFixed(1)} ${vb.y.toFixed(1)} ${vb.w.toFixed(1)} ${vb.h.toFixed(1)}`);
                svg.style.cursor = vb.w < W ? 'grab' : 'default';
                const zin = document.getElementById('mapZoomIn'), zout = document.getElementById('mapZoomOut');
                if (zin) zin.disabled = vb.w <= W / MAX_ZOOM + 0.5;
                if (zout) zout.disabled = vb.w >= W - 0.5;
            }

            // da coordinate dello schermo a coordinate della mappa
            function toMap(cx, cy) {
                const r = svg.getBoundingClientRect();
                return { x: vb.x + (cx - r.left) / r.width * vb.w, y: vb.y + (cy - r.top) / r.height * vb.h };
            }

            // zoom di un fattore f mantenendo fermo il punto sotto (cx, cy)
            function zoomAt(f, cx, cy) {
                const p = toMap(cx, cy);
                const r = svg.getBoundingClientRect();
                const nw = Math.min(W, Math.max(W / MAX_ZOOM, vb.w / f));
                const nh = nw * (H / W);
                vb.x = p.x - (cx - r.left) / r.width * nw;
                vb.y = p.y - (cy - r.top) / r.height * nh;
                vb.w = nw; vb.h = nh;
                apply();
            }

            function zoomCenter(f) {
                const r = svg.getBoundingClientRect();
                zoomAt(f, r.left + r.width / 2, r.top + r.height / 2);
            }

            window.mapZoomReset = function() { vb = { x: 0, y: 0, w: W, h: H }; apply(); };

            svg.addEventListener('wheel', (e) => {
                e.preventDefault();
                zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX, e.clientY);
            }, { passive: false });

            svg.addEventListener('pointerdown', (e) => {
                pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY });
                dragMoved = false;
                if (pointers.size === 2) {
                    const [a, b] = [...pointers.values()];
                    pinchStart = { d: Math.hypot(a.x - b.x, a.y - b.y) };
                    dragMoved = true;
                }
            });

            svg.addEventListener('pointermove', (e) => {
                const p = pointers.get(e.pointerId);
                if (!p) return;
                const dx = e.clientX - p.x, dy = e.clientY - p.y;

                if (pointers.size === 2 && pinchStart) {
                    const [a, b] = [...pointers.values()];
                    const before = Math.hypot(a.x - b.x, a.y - b.y);
                    p.x = e.clientX; p.y = e.clientY;
                    const [a2, b2] = [...pointers.values()];
                    const now = Math.hypot(a2.x - b2.x, a2.y - b2.y);
                    if (before > 0 && now > 0) zoomAt(now / before, (a2.x + b2.x) / 2, (a2.y + b2.y) / 2);
                    // sposta anche il centro del pizzico
                    const r = svg.getBoundingClientRect();
                    const mdx = dx / 2, mdy = dy / 2;
                    vb.x -= mdx / r.width * vb.w; vb.y -= mdy / r.height * vb.h;
                    apply();
                    return;
                }

                if (!dragMoved && Math.hypot(e.clientX - p.sx, e.clientY - p.sy) < 6) return;
                if (!dragMoved) { dragMoved = true; try { svg.setPointerCapture(e.pointerId); } catch (err) {} }
                const r = svg.getBoundingClientRect();
                vb.x -= dx / r.width * vb.w; vb.y -= dy / r.height * vb.h;
                p.x = e.clientX; p.y = e.clientY;
                apply();
            });

            const end = (e) => {
                pointers.delete(e.pointerId);
                if (pointers.size < 2) pinchStart = null;
                try { svg.releasePointerCapture(e.pointerId); } catch (err) {}
            };
            svg.addEventListener('pointerup', end);
            svg.addEventListener('pointercancel', end);
            svg.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') pointers.delete(e.pointerId); });

            // dopo un trascinamento il tocco finale non deve aprire il distributore sotto il dito
            svg.addEventListener('click', (e) => {
                if (dragMoved) { e.stopPropagation(); e.preventDefault(); dragMoved = false; }
            }, true);

            // pulsanti + / - / ripristina
            const ctl = document.createElement('div');
            ctl.className = 'absolute bottom-2.5 left-2.5 z-10 flex flex-row overflow-hidden rounded-xl border border-slate-300 bg-white shadow-md';
            const mk = (id, icon, label, fn) => {
                const b = document.createElement('button');
                b.id = id; b.type = 'button'; b.setAttribute('aria-label', label); b.title = label;
                b.className = 'w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white transition border-r border-slate-200 last:border-r-0';
                b.innerHTML = `<i class="fa-solid ${icon}"></i>`;
                b.addEventListener('click', fn);
                ctl.appendChild(b);
            };
            mk('mapZoomIn', 'fa-plus', 'Ingrandisci', () => zoomCenter(1.6));
            mk('mapZoomOut', 'fa-minus', 'Riduci', () => zoomCenter(1 / 1.6));
            mk('mapZoomReset', 'fa-expand', 'Mostra tutta la mappa', () => window.mapZoomReset());
            box.appendChild(ctl);

            // "Centra mappa" riporta anche lo zoom a tutta la città
            const origReset = window.resetMapSelection;
            window.resetMapSelection = function() { origReset.apply(this, arguments); window.mapZoomReset(); };

            apply();
        })();

        // ---- Mobile: vista Mappa / Elenco ----
        (function() {
            const on = 'px-3 py-2.5 rounded-lg text-sm font-extrabold transition bg-white text-slate-900 shadow-sm flex items-center justify-center gap-2';
            const off = 'px-3 py-2.5 rounded-lg text-sm font-bold transition text-slate-500 flex items-center justify-center gap-2';
            window.setView = function(view) {
                document.body.dataset.view = view;
                const m = document.getElementById('tabViewMap'), l = document.getElementById('tabViewList');
                m.className = view === 'map' ? on : off; l.className = view === 'list' ? on : off;
                m.setAttribute('aria-selected', view === 'map'); l.setAttribute('aria-selected', view === 'list');
                if (view === 'map' && leafletMap) setTimeout(() => leafletMap.invalidateSize(), 50);
                // riporta l'inizio della vista sotto la barra
                const bar = document.getElementById('tabViewMap').closest('nav');
                const filters = document.getElementById('searchInput').closest('div.rounded-2xl');
                if (window.innerWidth < 1024 && window.scrollY > filters.offsetTop) window.scrollTo({ top: filters.offsetTop - bar.offsetHeight, behavior: 'auto' });
            };
            document.body.dataset.view = 'map';
        })();
