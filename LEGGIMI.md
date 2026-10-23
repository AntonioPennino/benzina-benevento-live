# Benzina Benevento Live — note per chi prosegue

Sito: https://benzinabn.it (Cloudflare Pages, progetto `benzina-benevento-live`; indirizzo tecnico https://benzina-benevento-live.pages.dev).
La vecchia versione su Vercel (https://benzina-benevento-live.vercel.app) non è più quella aggiornata.
Monitoraggio civico dei distributori di Benevento: i cittadini votano lo stato di ogni pompa (Aperta / Limitata / Esaurita).

## Com'è fatto
HTML statico + JavaScript nel browser. L'unico passaggio di "build" è lo stile: Tailwind genera `public/styles.css` (`npm run build:css`), che va ricreato dopo aver cambiato classi in `index.html` o `app.js`; GitHub Actions lo rigenera comunque a ogni pubblicazione.

| File | Cosa contiene |
|---|---|
| `public/` | Tutto ciò che viene pubblicato: è la cartella servita da Cloudflare Pages. |
| `public/index.html` | Struttura della pagina (font e icone Font Awesome si caricano senza bloccare la prima schermata). |
| `public/styles.css` | Stile generato da Tailwind con le sole classi usate (`tailwind.config.js`, `src/tailwind.css`). Non modificarlo a mano. |
| `public/app.js` | Tutta la logica della pagina: lettura dei dati dalle API, voti, rendering di mappa, elenco e schede. |
| `public/vendor/leaflet/` | Libreria della mappa (Leaflet 1.9.4) ospitata sul sito, per non dipendere da unpkg.com. |
| `public/_headers` | Header HTTP di sicurezza applicati da Cloudflare a tutte le pagine. |
| `functions/api/stations.ts`, `functions/api/vote.ts` | API dei distributori e dei voti (vedi "Database"). |
| `lib/benzina.ts` | Codice comune alle API: controlli sui dati, limiti contro gli abusi, letture dal database. |
| `migrations/` | Struttura del database D1 (tabelle `stations` e `votes`). |
| `functions/api/press-news.ts` | Pages Function che legge i feed delle testate locali (`/api/press-news`). Cache sull'edge di 15 minuti. |
| `wrangler.toml` | Configurazione Cloudflare Pages: cartella da pubblicare e database (`benzina-db` per il sito vero, `benzina-db-preview` per le anteprime). |
| `scripts/export-firebase.mjs` | Copia distributori e voti dal vecchio database Firebase in un file SQL per D1. |
| `public/favicon.svg`, `public/*.png` | Icone del sito. |
| `_ui-minimale-blu/` | Una grafica alternativa (minimale, blu) fatta in precedenza. Non è pubblicata. |

## Database (Cloudflare D1)
- Database D1 sull'account Cloudflare del sito: `benzina-db` (sito vero) e `benzina-db-preview` (anteprime dei rami). Fino all'ottobre 2026 i dati erano su Firebase, su un account Google di un'altra persona.
- La pagina non parla mai direttamente col database: passa dalle API in `functions/api/`, che controllano ogni dato (stati, lunghezze, marchi, zona) e permettono a ognuno di toccare solo il proprio voto. Nessuna API cancella o riscrive distributori.
  - `GET /api/stations`: distributori visibili con i voti degli ultimi 7 giorni. Resta in cache sull'edge 5 secondi, così anche con tanta gente il database si legge poco.
  - `POST /api/vote`: salva, cambia o toglie (`vote: null`) il proprio voto. L'ora la mette il server.
  - `POST /api/stations`: nuovo distributore con il primo voto (massimo 5 al giorno a persona).
- **Chi vota**: ogni dispositivo crea un codice segreto casuale (in `localStorage`); nei dati pubblici compare solo un suo hash (`voter`), quindi nessuno può votare al posto di un altro. Cancellando i dati del browser si diventa un "nuovo" votante, come succedeva con il login anonimo di Firebase.
- Contro gli abusi: massimo 300 voti ogni 10 minuti dalla stessa connessione (l'IP viene salvato solo come hash che cambia ogni giorno).
- La pagina chiede l'elenco ogni 20 secondi mentre è aperta e visibile (`POLL_MS`), e si ferma quando la scheda è nascosta.
- **Limiti del piano gratuito** (si azzerano a mezzanotte UTC): 100.000 richieste al giorno alle API (pagine e file del sito non contano), 5 milioni di letture e 100.000 scritture al giorno sul database. Bastano per decine di migliaia di visite al giorno; oltre, il piano Workers Paid costa 5 $ al mese. In Cloudflare → Workers & Pages → benzina-benevento-live → Impostazioni → Runtime conviene lasciare "Fail open": se le richieste finiscono, il sito resta visibile.
- **Correggere i dati** (spostare una pompa, rinominarla, nasconderla) si fa con un comando sul database, ad esempio:
  `npx wrangler d1 execute benzina-db --remote --command "UPDATE stations SET hidden = 1 WHERE id = 'bn-custom-...'"`
- Struttura delle tabelle: `migrations/0001_init.sql`. Una nuova modifica va in un nuovo file `migrations/000N_...sql`, applicato con `npx wrangler d1 migrations apply benzina-db --remote` (e `benzina-db-preview --remote --env preview` per le anteprime).

## Logica dei voti (in `app.js`)
- Un voto a persona per distributore (l'identità è il codice segreto del dispositivo, vedi sopra). Ripremere lo stesso stato toglie il voto; premerne un altro lo sposta.
- Vince lo stato con più voti. **A parità vince il peggiore** (Esaurita > Limitata > Aperta): con 10 Esaurita e 10 Aperta resta Esaurita, servono 11 Aperta.
- **Riavvio dopo 45 minuti** (`VOTE_WINDOW_MS`): se un voto per uno stato diverso arriva quando sono passati 45 minuti dall'ultimo voto dello stato in vigore, il conteggio riparte da quel voto. I voti precedenti restano visibili ma "in ombra" e non pesano. Esempio: 10 Aperta con l'ultima alle 10:00; un Esaurita alle 10:50 rende subito la pompa Esaurita, alle 10:20 no.
- Chi aggiunge un distributore con uno stato iniziale dà il primo voto, che segue la stessa regola.
- `npm test` verifica la regola su casi d'esempio (`tests/regola-voti.test.js`): lanciarlo dopo ogni modifica a `splitVotes`/`deriveFromVotes`.
- Lo stato mostrato si ricalcola sempre dai voti al caricamento (`normalizeStation`), mai dal valore salvato.
- Funzioni principali: `deriveFromVotes`, `splitVotes`, `winnerOf`, `voteCounts`, `applyVoteToStation`, `persistVote` (chiama `/api/vote`), `loadStationsFromApi`, `quickInstantFlag`, `submitStationFlag`.
- Il testo inserito dagli utenti passa sempre da `esc()` prima di finire nell'HTML: mantenerlo in ogni nuovo template.

## Interfaccia
- Grafica originale (scura, con avviso giallo e rosso, emoji). Mappa stradale OpenStreetMap con Leaflet (la vecchia mappa semplificata è stata tolta).
- Su telefono: barra **Mappa / Elenco** (una vista alla volta, filtri sempre sopra). Su schermi larghi mappa ed elenco sono affiancati.
- **Posizioni delle pompe**: stanno nel database (colonne `lat`/`lng`); quelle dei distributori iniziali vengono dai distributori reali su OpenStreetMap. `INITIAL_BENEVENTO_STATIONS` in `app.js` serve solo per la prima schermata, prima che arrivino i dati.
- Finché non arrivano i dati l'elenco mostra "Caricamento distributori…" (niente pompe finte). La prima richiesta a `/api/stations` parte già dall'`<head>` di `index.html`, in parallelo al resto.
- Al primo caricamento la mappa inquadra i distributori entro 6 km dal centro.
- Ordine "Più vicini a me": chiede la posizione al browser solo quando lo si sceglie, ordina per distanza, mostra la distanza su ogni scheda e un pallino blu sulla mappa.
- Sulla mappa le pompe il cui stato non riceve conferme da più di 3 ore sono sbiadite (`STALE_MS`); se si sovrappongono, quelle con notizie fresche stanno sopra.
- "Condividi" nella scheda grande: menu di condivisione del telefono, oppure copia il link `benzinabn.it/?p=<id>`, che apre direttamente la scheda di quella pompa.
- Toccando una pompa si apre la scheda grande e, sotto la mappa, la scheda rapida; un tocco fuori dalla scheda rapida (o Esc) la chiude.
- Nuovo distributore: la pompa va nel punto esatto dell'indirizzo, cercato con Nominatim (OpenStreetMap); poi si cerca nei dintorni (circa 600 m) il distributore vero con lo stesso nome o marchio (`findFuelStation`) e, se c'è, si usa la sua posizione. Con "Altro Comune…" si scrive il comune e, se l'indirizzo non si trova, il distributore non viene aggiunto; a Benevento, se la ricerca fallisce, si usa la zona scelta.

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
La prima volta crea il database locale (in `.wrangler/`, separato da quello vero) e, se vuoi dati realistici, copiaci quelli attuali:
```bash
npm run db:local
```
Poi avvia il sito (genera anche lo stile) e apri http://localhost:8788:
```bash
npm run dev
```
In locale funzionano pagina, voti, nuovi distributori e notizie, tutto sul database locale: i voti di prova **non** finiscono sui dati veri.
Se cambi classi Tailwind mentre lavori, in un altro terminale lascia acceso `npm run watch:css`.
Con il server acceso, `npm run test:api` prova le API (scrive solo nel database locale); `npm test` prova la regola dei voti.
