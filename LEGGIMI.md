# Benzina Benevento Live — note per chi prosegue

Sito: https://benzinabn.it (Cloudflare Pages, progetto `benzina-benevento-live`; indirizzo tecnico https://benzina-benevento-live.pages.dev).
La vecchia versione su Vercel (https://benzina-benevento-live.vercel.app) non è più quella aggiornata.
Monitoraggio civico dei distributori di Benevento: i cittadini votano lo stato di ogni pompa (Aperta / Limitata / Esaurita).

## Com'è fatto
Nessuna build: HTML statico + JavaScript nel browser.

| File | Cosa contiene |
|---|---|
| `public/` | Tutto ciò che viene pubblicato: è la cartella servita da Cloudflare Pages. |
| `public/index.html` | Struttura e stile (Tailwind via CDN, Font Awesome, Leaflet, SDK Firebase). |
| `public/app.js` | Tutta la logica: dati iniziali, Firebase, voti, rendering di mappa, elenco e schede. |
| `public/vendor/leaflet/` | Libreria della mappa (Leaflet 1.9.4) ospitata sul sito, per non dipendere da unpkg.com. |
| `public/_headers` | Header HTTP di sicurezza applicati da Cloudflare a tutte le pagine. |
| `functions/api/press-news.ts` | Pages Function che legge i feed delle testate locali (`/api/press-news`). Cache sull'edge di 15 minuti. |
| `wrangler.toml` | Configurazione Cloudflare Pages (nome progetto e cartella da pubblicare). |
| `firestore.rules` | Regole di sicurezza del database, **scritte e testate ma NON ancora pubblicate** (vedi sotto). |
| `public/favicon.svg`, `public/*.png` | Icone del sito. |
| `_ui-minimale-blu/` | Una grafica alternativa (minimale, blu) fatta in precedenza. Non è pubblicata. |

La configurazione Firebase dentro `app.js` è quella pubblica di un'app web: non è un segreto.

## Database (Firebase)
- Progetto Firebase: `pompe-di-benzina---benevento`. Dati in Firestore, percorso `artifacts/benzina-benevento-live/public/data/stations`. Gli utenti entrano con login anonimo.
- Il progetto appartiene a **un altro account Google** rispetto a quello usato per Vercel: chi vuole modificare regole o dati deve essere aggiunto in Firebase (Impostazioni → Utenti e autorizzazioni).
- **Le regole di sicurezza non sono attive**: oggi chiunque può leggere e scrivere. Per attivarle: Firebase Console → Firestore → Regole → incolla `firestore.rules` → Pubblica (oppure `npx firebase-tools deploy --only firestore:rules --project pompe-di-benzina---benevento` con l'account giusto).
- Anche con le regole attive, restano due limiti: chi crea molti account anonimi può votare più volte, e il database non verifica che lo stato mostrato coincida con i voti. Per chiuderli servono App Check e una Cloud Function.
- Dopo l'attivazione delle regole non si possono più riscrivere i distributori dalla pagina: per azzerare i dati servono la console Firebase o un accesso da amministratore.
- **Quota**: il progetto è sul piano gratuito Spark (circa 50.000 letture e 20.000 scritture al giorno, si azzera verso le 9 italiane). Con molti visitatori si esaurisce e i voti smettono di salvarsi: in quel caso il proprietario deve passare al piano Blaze (a consumo).
- La pagina non riscrive mai i distributori esistenti: se il server non risponde ignora lo snapshot vuoto della cache, e il popolamento iniziale crea solo i documenti mancanti. (Prima di ottobre 2026 un utente offline poteva azzerare i voti di tutti.)

## Logica dei voti (in `app.js`)
- Un voto a persona per distributore (l'identità è l'utente anonimo Firebase). Ripremere lo stesso stato toglie il voto; premerne un altro lo sposta.
- Vince lo stato con più voti. **A parità vince il peggiore** (Esaurita > Limitata > Aperta): con 10 Esaurita e 10 Aperta resta Esaurita, servono 11 Aperta.
- **Riavvio dopo 45 minuti** (`VOTE_WINDOW_MS`): se un voto per uno stato diverso arriva quando sono passati 45 minuti dall'ultimo voto dello stato in vigore, il conteggio riparte da quel voto. I voti precedenti restano visibili ma "in ombra" e non pesano. Esempio: 10 Aperta con l'ultima alle 10:00; un Esaurita alle 10:50 rende subito la pompa Esaurita, alle 10:20 no.
- Chi aggiunge un distributore con uno stato iniziale dà il primo voto, che segue la stessa regola.
- `npm test` verifica la regola su casi d'esempio (`tests/regola-voti.test.js`): lanciarlo dopo ogni modifica a `splitVotes`/`deriveFromVotes`.
- Lo stato mostrato si ricalcola sempre dai voti al caricamento (`normalizeStation`), mai dal valore salvato.
- Funzioni principali: `deriveFromVotes`, `splitVotes`, `winnerOf`, `voteCounts`, `applyVoteToStation`, `persistVote` (transazione Firestore), `quickInstantFlag`, `submitStationFlag`.
- Il testo inserito dagli utenti passa sempre da `esc()` prima di finire nell'HTML: mantenerlo in ogni nuovo template.

## Interfaccia
- Grafica originale (scura, con avviso giallo e rosso, emoji). Mappa stradale OpenStreetMap con Leaflet (la vecchia mappa semplificata è stata tolta).
- Su telefono: barra **Mappa / Elenco** (una vista alla volta, filtri sempre sopra). Su schermi larghi mappa ed elenco sono affiancati.
- **Posizioni delle pompe**: quelle dei distributori iniziali sono in `INITIAL_BENEVENTO_STATIONS`, le correzioni per i distributori aggiunti dagli utenti (posizione, e se serve nome/marchio/indirizzo) in `STATION_FIXES`; le voci da nascondere in `HIDDEN_STATIONS` (in `app.js`). Entrambe hanno la precedenza sulle coordinate salvate nel database: per spostare una pompa basta modificarle lì. Le posizioni vengono dai distributori reali su OpenStreetMap.
- Toccando una pompa si apre la scheda grande e, sotto la mappa, la scheda rapida; un tocco fuori dalla scheda rapida (o Esc) la chiude.
- Nuovo distributore: la pompa va nel punto esatto dell'indirizzo, cercato con Nominatim (OpenStreetMap). Con "Altro Comune…" si scrive il comune e, se l'indirizzo non si trova, il distributore non viene aggiunto; a Benevento, se la ricerca fallisce, si usa la zona scelta.

## Pubblicazione (Cloudflare Pages)
Progetto Cloudflare Pages: `benzina-benevento-live`, ramo di produzione `main`. Si pubblica con la CLI dalla cartella del progetto (la prima volta `npm install` e `npx wrangler login`):

```bash
npm run deploy
```

Codice su GitHub: https://github.com/AntonioPennino/benzina-benevento-live (repository pubblico).
Ogni push pubblica in automatico tramite GitHub Actions (`.github/workflows/deploy.yml`):
- push su `main` → sito di produzione (https://benzinabn.it);
- push su un altro ramo → anteprima su `https://<ramo>.benzina-benevento-live.pages.dev`, utile per far vedere una modifica prima del merge.

Il workflow usa due secret del repository: `CLOUDFLARE_API_TOKEN` (token con permesso "Cloudflare Pages: Edit") e `CLOUDFLARE_ACCOUNT_ID`. I collaboratori non hanno bisogno di un account Cloudflare.
La pubblicazione a mano con `npm run deploy` resta possibile per chi ha accesso all'account Cloudflare.
Il dominio `benzinabn.it` è collegato al progetto in Cloudflare → Workers & Pages → benzina-benevento-live → Domini personalizzati.

## Provare in locale
```bash
npm run dev
```
Poi apri http://localhost:8788. Funzionano sia la pagina sia le notizie (`/api/press-news`). La pagina usa il database reale: **attenzione, i voti che dai in locale finiscono sui dati veri.**
