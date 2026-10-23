        const SEED_VERSION = 2;

        const INITIAL_BENEVENTO_STATIONS = [
            { id: "bn-station-14", name: "Eni - SS7 Appia (Tufara Valle)", brand: "Eni", address: "SS7 Appia, loc. Tufara Valle", zone: "Arteria SS7 Appia Sud-Ovest", lat: 41.06710, lng: 14.71256, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-1", name: "Eni - Via Napoli", brand: "Eni", address: "Via Napoli 168", zone: "Rione Libertà", lat: 41.12143, lng: 14.76953, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-2", name: "Eni - Via Meomartini", brand: "Eni", address: "Via Alfonso Meomartini 60", zone: "Zona Mellusi/Alta", lat: 41.12233, lng: 14.79460, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-3", name: "Eni - Via Paolella", brand: "Eni", address: "Via Alfredo Paolella 4", zone: "Santa Colomba / Stadio", lat: 41.12983, lng: 14.79477, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-4", name: "Q8 - Via Avellino", brand: "Q8", address: "Via Avellino 6", zone: "Centro / Pacevecchia", lat: 41.12326, lng: 14.78899, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-5", name: "Q8easy - Contrada Epitaffio", brand: "Q8", address: "C.da Epitaffio 72", zone: "C.da Epitaffio / Ovest", lat: 41.10604, lng: 14.74586, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-6", name: "Energas Q8 - Via Padre Pio", brand: "Energas", address: "Via Padre Pio SP71", zone: "Capodimonte / Rotonda dei Pentri", lat: 41.14642, lng: 14.76837, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-7", name: "Tamoil 24h - Piazza Bissolati", brand: "Tamoil", address: "Piazza Bissolati / Via Grimoaldo Re 11", zone: "Rione Ferrovia", lat: 41.13446, lng: 14.77290, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-8", name: "Tamoil - Via Bachelet", brand: "Tamoil", address: "Via Vittorio Bachelet", zone: "Pacevecchia", lat: 41.12103, lng: 14.80224, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-9", name: "Esso - Via dei Longobardi", brand: "Esso", address: "Via dei Longobardi 10", zone: "Zona Ponticelli / Centro", lat: 41.13888, lng: 14.77939, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-10", name: "IP - Via Pietro Nenni", brand: "IP", address: "Via Pietro Nenni 38", zone: "Zona Atlantici / Mellusi", lat: 41.12653, lng: 14.79700, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-11", name: "Distributore Di.Si. - Viale Virgilio", brand: "Di.Si.", address: "Viale Virgilio snc", zone: "Rione Libertà / Ponte Vanvitelli", lat: 41.14480, lng: 14.76496, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-12", name: "Conad Self 24h - Buonvento", brand: "Conad", address: "SS7 Appia / C.da San Vito", zone: "Buonvento / San Vito", lat: 41.11802, lng: 14.75881, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION },
            { id: "bn-station-13", name: "Distributore C.da Piano Cappelle", brand: "Pompa Bianca", address: "Via Valfortore / C.da Piano Cappelle", zone: "C.da Piano Cappelle / Est", lat: 41.10367, lng: 14.82453, status: "unverified", lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: "Da verificare", lastNote: "", seedVersion: SEED_VERSION }
        ];

        // Correzioni ai distributori aggiunti dagli utenti: posizioni verificate (distributori reali su
        // OpenStreetMap, o la via quando il distributore non c'è) ed eventuali nome/marchio/indirizzo.
        // Hanno la precedenza sui dati salvati. Per correggere una pompa basta aggiungere qui il suo id.
        const STATION_FIXES = {
            "bn-custom-1792675781566": { lat: 41.15123, lng: 14.77953 }, // Beneco - Via dei Liguri Bebiani
            "bn-custom-1792607627389": { lat: 41.11268, lng: 14.80072 }, // Sudpetroli - Via Fratelli Rosselli (via)
            "bn-custom-1792688137608": { lat: 41.14487, lng: 14.76673, name: "Esso - Rotonda dei Pentri", brand: "Esso", address: "Rotonda dei Pentri (Rotonda di Padre Pio)" },
            "bn-custom-1792687945441": { lat: 41.12129, lng: 14.76954 }, // Via Napoli (via)
            "bn-custom-1792688909975": { lat: 41.31061, lng: 14.87894 }  // Q8 - San Marco dei Cavoti (paese)
        };

        // Voci da non mostrare (aggiunte per errore o doppioni): restano nel database ma la pagina le ignora.
        const HIDDEN_STATIONS = new Set([
            "bn-custom-1792679821068" // "Benevento": nome e indirizzo "Benevento", nessun distributore reale
        ]);

        const ZONE_COORDINATES_MAP = {
            "Rione Libertà": { lat: 41.1260, lng: 14.7640 },
            "Centro / Mellusi": { lat: 41.1305, lng: 14.7850 },
            "Rione Ferrovia": { lat: 41.1410, lng: 14.7710 },
            "Pacevecchia": { lat: 41.1335, lng: 14.8010 },
            "Santa Colomba / Stadio": { lat: 41.1185, lng: 14.7750 },
            "Capodimonte / Pentri": { lat: 41.1425, lng: 14.7930 },
            "C.da Epitaffio / Ovest": { lat: 41.1295, lng: 14.7510 },
            "Buonvento / San Vito": { lat: 41.1145, lng: 14.7545 },
            "C.da Piano Cappelle / Est": { lat: 41.1185, lng: 14.8040 }
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
                    currentUser = { uid: localDeviceId() };
                }

                document.getElementById('footerUserId').textContent = currentUser?.uid || 'anonimo-bn';

                const stationsColRef = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('stations');

                stationsColRef.onSnapshot(async (snapshot) => {
                    if (snapshot.empty) {
                        // Uno snapshot vuoto "dalla cache" arriva quando il server non risponde (rete assente,
                        // quota esaurita): non vuol dire che il database sia vuoto. In quel caso non si scrive nulla.
                        if (snapshot.metadata.fromCache) {
                            updateConnectionUI(false, "Database non raggiungibile: riprovo…");
                            return;
                        }
                        console.warn("Database vuoto! Tento il caricamento automatico...");
                        await seedInitialStationsToFirestore();
                        return;
                    }
                    updateConnectionUI(true, "Sincronizzazione Cloud Live attiva");


                    const loadedStations = [];
                    snapshot.forEach((docSnap) => {
                        // ignora documenti con id anomali (gli id finiscono in attributi HTML)
                        if (!/^bn-(station|custom)-\d+$/.test(docSnap.id)) return;
                        if (HIDDEN_STATIONS.has(docSnap.id)) return;
                        const data = docSnap.data();
                        const seedRef = INITIAL_BENEVENTO_STATIONS.find(i => i.id === docSnap.id) || {};
                        // per i distributori iniziali e per quelli corretti valgono posizione (e correzioni) scritte nel codice
                        const position = STATION_FIXES[docSnap.id] || (seedRef.id ? { lat: seedRef.lat, lng: seedRef.lng } : {});
                        
                        loadedStations.push(normalizeStation({
                            ...seedRef,
                            ...data,
                            ...position,
                            id: docSnap.id,
                            status: ['available', 'limited', 'closed', 'unverified'].includes(data.status) ? data.status : 'unverified',
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
                // crea solo i distributori che mancano: una transazione legge dal server, quindi
                // non sovrascrive mai voti esistenti né accoda scritture quando si è offline
                for (const st of INITIAL_BENEVENTO_STATIONS) {
                    const docRef = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('stations').doc(st.id);
                    await db.runTransaction(async (tx) => {
                        const snap = await tx.get(docRef);
                        if (snap.exists) return;
                        tx.set(docRef, { ...st, seedVersion: SEED_VERSION, lastReporterId: st.isPressSource ? 'fonte-stampa-verificata' : null });
                    });
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

        function initLeafletMapIfNeeded() {
            if (leafletMap) return;
            if (!window.L) {
                document.getElementById('leafletMap').innerHTML = '<div class="h-full flex items-center justify-center p-6 text-center text-xs text-slate-500">Mappa non disponibile: ricarica la pagina. L’elenco dei distributori funziona comunque.</div>';
                return;
            }
            leafletMap = L.map('leafletMap', { center: [41.1250, 14.7720], zoom: 12 });
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(leafletMap);
            // il riquadro cambia misura (vista Mappa/Elenco, rotazione del telefono): la mappa si adegua
            if (window.ResizeObserver) new ResizeObserver(() => leafletMap.invalidateSize()).observe(document.getElementById('leafletMap'));
            // toccare la mappa fuori da una pompa chiude la scheda (Leaflet non lo segnala dopo un trascinamento)
            leafletMap.on('click', () => window.clearMapSelection());
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
                // "vecchio" = lo stato in vigore non riceve conferme da 45 minuti: un voto diverso lo cambierebbe subito
                const isStale = effectiveStatus !== 'unverified' && st.lastUpdated && (Date.now() - st.lastUpdated) >= VOTE_WINDOW_MS;
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
                                ${lv ? `<span>Ultimo voto: <strong class="px-1.5 py-0.5 rounded-md border ${lastCfg.badgeClass}">${lastCfg.emoji} ${lastCfg.shortLabel}</strong> ${esc(formatRelativeTime(lv.ts).toLowerCase())}</span><span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px]"><i class="fa-solid fa-users text-[9px] mr-0.5"></i>${total}</span>${isStale ? '<span>· stato non confermato da oltre 45 min</span>' : ''}` : `<span class="text-slate-500 font-medium">In attesa del primo voto</span>`}
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

        // chiude la scheda della pompa senza spostare la mappa
        window.clearMapSelection = function() {
            if (!selectedStationId) return;
            selectedStationId = null;
            renderAll();
        };

        // un tocco fuori dalla scheda la chiude; la mappa è gestita da Leaflet (sopra), le finestre
        // aperte e i pulsanti che selezionano un'altra pompa si occupano da soli della selezione
        document.addEventListener('click', (e) => {
            if (!selectedStationId) return;
            if (e.target.closest('#mapQuickBanner, #leafletMap, #stationModal, #addStationModal, [onclick], button, a, input, select, label')) return;
            window.clearMapSelection();
        });

        window.setFilterStatus = function(status) { currentFilterStatus = status; renderAll(); };
        window.handleSearchChange = function(val) { currentSearchQuery = val; document.getElementById('clearSearchBtn').classList.toggle('hidden', !val); renderAll(); };
        window.clearSearch = function() { document.getElementById('searchInput').value = ''; window.handleSearchChange(''); };
        window.resetFilters = function() { currentFilterStatus = 'all'; window.clearSearch(); renderAll(); };
        window.handleSortChange = function(val) { currentSortBy = val; renderStationsList(); };

        window.openStationModal = function(stationId) {
            const st = stationsData.find(s => s.id === stationId);
            if (!st) return;
            selectedStationId = stationId;
            renderLeafletMarkers(); updateMapQuickBanner();

            document.getElementById('modalBrandBadge').textContent = st.brand || 'Distributore';
            document.getElementById('modalZoneBadge').textContent = st.zone;
            document.getElementById('modalStationName').textContent = st.name;
            document.getElementById('modalStationAddress').innerHTML = `${esc(st.address)}`;
            const mapsQuery = encodeURIComponent(`${st.name} ${st.address} ${st.comune || 'Benevento'}`);
            document.getElementById('modalGoogleMapsLink').href = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

            const cfg = getStatusConfig(st.status || 'unverified');
            const cnt = voteCounts(st);
            const mine = myVoteOf(st);
            const lv = lastVoteOf(st);
            const lastInfo = lv
                ? `Ultima segnalazione: ${getStatusConfig(lv.status).emoji} ${esc(getStatusConfig(lv.status).shortLabel)} · <strong>${esc(formatRelativeTime(lv.ts).toLowerCase())}</strong> (${esc(formatExactTime(lv.ts))})`
                : 'Nessuna segnalazione ancora';
            document.getElementById('modalStatusBox').className = `px-5 py-3.5 border-b flex flex-wrap items-center justify-between gap-2 ${cfg.badgeClass}`;
            document.getElementById('modalStatusBox').innerHTML = `
                <div class="flex items-center gap-2"><span class="text-lg">${cfg.emoji}</span><div><div class="text-xs font-extrabold uppercase">${cfg.label}</div><div class="text-[11px] font-medium opacity-80">Voti recenti: 🟢 ${cnt.available} · 🟡 ${cnt.limited} · 🔴 ${cnt.closed}${mine ? ` · il tuo voto: ${getStatusConfig(mine.status).shortLabel}` : ''}</div><div class="text-[11px] font-semibold"><i class="fa-regular fa-clock mr-1"></i>${lastInfo}</div></div></div>
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
        // se il login anonimo non riesce, ogni dispositivo usa un proprio id (prima era uno solo per tutti,
        // e chi votava lo stesso stato toglieva il voto di un altro)
        function localDeviceId() {
            let id = null;
            try { id = localStorage.getItem('bn-device-id'); } catch (e) {}
            if (!id) {
                id = 'dispositivo-' + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
                try { localStorage.setItem('bn-device-id', id); } catch (e) {}
            }
            return id;
        }
        function myUid() { return currentUser?.uid || localDeviceId(); }
        function myVoteOf(st) { return st && st.votes ? (st.votes[myUid()] || null) : null; }

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

        function deriveFromVotes(votes, legacy) {
            const { active } = splitVotes(votes);
            if (!active.length) {
                if (legacy) return { ...legacy };
                return { status: 'unverified', lastUpdated: null, confirmations: 0, fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: 'Da verificare', lastNote: '', lastReporterId: null };
            }
            const { status: winner, count } = winnerOf(active);
            const latest = active.filter(v => v.status === winner).sort((x, y) => y.ts - x.ts)[0];
            return { status: winner, lastUpdated: latest.ts, confirmations: count, fuels: latest.fuels, queueLevel: latest.queueLevel, lastNote: latest.note, lastReporterId: latest.uid };
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

        // true se il voto è stato salvato; altrimenti avvisa chi ha votato
        async function persistVote(stationId, uid, vote) {
            const notSaved = (msg) => { showToast('Voto NON salvato', msg); return false; };
            if (!db) return notSaved('Il sito non è collegato al database. Ricarica la pagina e riprova.');
            const ref = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('stations').doc(stationId);
            try {
                await db.runTransaction(async (tx) => {
                    const snap = await tx.get(ref);
                    if (!snap.exists) throw Object.assign(new Error('distributore non trovato'), { code: 'not-found' });
                    const data = snap.data();
                    data.fuels = parseFuels(data.fuels);
                    const next = applyVoteToStation(data, uid, vote);
                    tx.update(ref, {
                        status: next.status, lastUpdated: next.lastUpdated, confirmations: next.confirmations,
                        fuels: next.fuels, queueLevel: next.queueLevel, lastNote: next.lastNote, lastReporterId: next.lastReporterId,
                        isPressSource: false, seedVersion: SEED_VERSION, votes: next.votes, legacy: next.legacy
                    });
                });
                return true;
            } catch (e) {
                console.error(e);
                return notSaved(e.code === 'resource-exhausted'
                    ? 'Il database ha raggiunto il limite giornaliero. Riprova più tardi.'
                    : 'Connessione al database non riuscita. Riprova tra poco.');
            }
        }

        async function castVote(stationId, vote) {
            const i = stationsData.findIndex(s => s.id === stationId);
            if (i === -1) return;
            const uid = myUid();
            const before = stationsData[i];
            stationsData[i] = applyVoteToStation(before, uid, vote);
            renderAll();
            // se il salvataggio fallisce si torna allo stato precedente: niente voti che sembrano
            // registrati e poi spariscono al ricaricamento
            if (!(await persistVote(stationId, uid, vote))) {
                const j = stationsData.findIndex(s => s.id === stationId);
                if (j !== -1 && stationsData[j] !== before) { stationsData[j] = before; renderAll(); }
            }
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

        // "Altro quartiere…" / "Altro Comune…": compare il campo libero, obbligatorio solo in quei casi
        window.toggleOtherZone = function() {
            const other = document.getElementById('newStationZoneOther');
            const choice = document.getElementById('newStationZone').value;
            const isOther = choice === '__altro__' || choice === '__comune__';
            other.placeholder = choice === '__comune__' ? 'Scrivi il comune' : 'Scrivi il quartiere';
            other.classList.toggle('hidden', !isOther);
            other.required = isOther;
            if (isOther) other.focus();
        };

        const BENEVENTO_CENTER = { lat: 41.1300, lng: 14.7820 };
        function distanceKm(a, b) {
            const dLat = (a.lat - b.lat) * 111, dLng = (a.lng - b.lng) * 111 * Math.cos(a.lat * Math.PI / 180);
            return Math.hypot(dLat, dLng);
        }

        // posizione esatta di un indirizzo dal servizio di ricerca di OpenStreetMap (Nominatim); null se non trovato
        async function geocodeAddress(address, place) {
            const q = address.toLowerCase().includes(place.toLowerCase()) ? address : `${address}, ${place}`;
            const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=it&accept-language=it&q=${encodeURIComponent(q)}`;
            try {
                const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
                if (!res.ok) return null;
                const [hit] = await res.json();
                if (!hit) return null;
                const pos = { lat: Number(hit.lat), lng: Number(hit.lon) };
                return Number.isFinite(pos.lat) && Number.isFinite(pos.lng) ? pos : null;
            } catch (err) {
                console.warn('Ricerca indirizzo non riuscita', err);
                return null;
            }
        }

        window.handleAddStationSubmit = async function(e) {
            e.preventDefault();
            const brand = document.getElementById('newStationBrand').value;
            const zoneChoice = document.getElementById('newStationZone').value;
            const isOtherComune = zoneChoice === '__comune__';
            const isFreeText = zoneChoice === '__altro__' || isOtherComune;
            const zone = isFreeText ? document.getElementById('newStationZoneOther').value.trim() : zoneChoice;
            const name = document.getElementById('newStationName').value.trim();
            const address = document.getElementById('newStationAddress').value.trim();
            const status = document.getElementById('newStationStatus').value;
            if (!name || !address || !zone) return;

            // la pompa va nel punto esatto dell'indirizzo; a Benevento, se la ricerca fallisce o finisce
            // lontano dalla città, si usa la zona scelta (o il centro per un quartiere scritto a mano)
            const submitBtn = document.getElementById('addStationSubmit');
            const submitLabel = submitBtn.textContent;
            submitBtn.disabled = true; submitBtn.textContent = "Cerco l'indirizzo…";
            let pos = await geocodeAddress(address, isOtherComune ? zone : 'Benevento');
            submitBtn.disabled = false; submitBtn.textContent = submitLabel;
            if (isOtherComune && !pos) {
                showToast('Indirizzo non trovato', `Controlla via e comune (${zone}) e riprova.`);
                return;
            }
            if (!isOtherComune && pos && distanceKm(pos, BENEVENTO_CENTER) > 15) pos = null;
            if (!pos) {
                const base = ZONE_COORDINATES_MAP[zone] || ZONE_COORDINATES_MAP["Centro / Mellusi"];
                pos = { lat: base.lat + (Math.random() - 0.5) * 0.004, lng: base.lng + (Math.random() - 0.5) * 0.004 };
            }
            const newId = 'bn-custom-' + Date.now();
            const note = document.getElementById('newStationNote').value.trim();
            // lo stato scelto da chi aggiunge il distributore è il suo primo voto, così segue la stessa regola degli altri
            const votes = status === 'unverified' ? {} : {
                [myUid()]: {
                    status, ts: Date.now(),
                    fuels: { benzina: status !== 'closed', diesel: status !== 'closed', gpl: false },
                    queueLevel: status === 'closed' ? 'Nessuna' : (status === 'limited' ? 'Moderata' : 'Scorrevole'),
                    note: note || (status === 'available' ? 'Aperta.' : status === 'limited' ? 'Limitata.' : 'Chiusa.')
                }
            };
            const newStation = {
                id: newId, name, brand, address, zone, ...(isOtherComune ? { comune: zone } : {}),
                lat: Number(pos.lat.toFixed(5)), lng: Number(pos.lng.toFixed(5)),
                status, lastUpdated: status !== 'unverified' ? Date.now() : null, confirmations: status !== 'unverified' ? 1 : 0,
                fuels: { benzina: status !== 'closed', diesel: status !== 'closed', gpl: false },
                queueLevel: status === 'unverified' ? 'Da verificare' : (status === 'closed' ? 'Nessuna' : 'Scorrevole'),
                lastNote: note,
                seedVersion: SEED_VERSION, lastReporterId: currentUser?.uid || 'cittadino-bn', votes
            };

            stationsData.unshift(newStation); selectedStationId = newId;
            window.closeAddStationModal(); e.target.reset(); window.toggleOtherZone(); renderAll();
            if (leafletMap) leafletMap.setView([newStation.lat, newStation.lng], 15); showToast("Nuovo distributore aggiunto!", `${name} è ora visibile.`);

            if (db) {
                try { await db.collection('artifacts').doc(appId).collection('public').doc('data').collection('stations').doc(newId).set(newStation); }
                catch (err) {
                    console.error(err);
                    stationsData = stationsData.filter(st => st.id !== newId);
                    if (selectedStationId === newId) selectedStationId = null;
                    renderAll();
                    showToast('Distributore NON salvato', err.code === 'resource-exhausted'
                        ? 'Il database ha raggiunto il limite giornaliero. Riprova più tardi.'
                        : 'Connessione al database non riuscita. Riprova tra poco.');
                }
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
                else window.clearMapSelection();
            });
            MODALS.forEach(id => document.getElementById(id).addEventListener('mousedown', (e) => {
                if (e.target.id !== id) return;
                if (id === 'stationModal') window.closeStationModal(); else window.closeAddStationModal();
            }));
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

        // Avvio: subito (lo script è in fondo alla pagina), senza aspettare font e icone;
        // un errore della mappa non deve bloccare elenco e voti
        try { initLeafletMapIfNeeded(); } catch (err) { console.error('Mappa non avviata', err); }
        renderAll();
        initFirebaseAndSync();
