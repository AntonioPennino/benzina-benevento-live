# Benzina Benevento Live — note per chi prosegue

Sito: https://benzinabn.it (Cloudflare Pages, progetto `benzina-benevento-live`; indirizzo tecnico https://benzina-benevento-live.pages.dev).
La vecchia versione su Vercel (https://benzina-benevento-live.vercel.app) non è più quella aggiornata.
Monitoraggio civico dei distributori di Benevento e del Sannio: i cittadini votano lo stato di ogni pompa (Aperta / Limitata / Esaurita) e, a parte, la coda.

## Com'è fatto
HTML statico + JavaScript nel browser. L'unico passaggio di "build" è lo stile: `npm run build:css` crea le icone (`scripts/build-icons.mjs`) e poi Tailwind genera `public/styles.css`. Va rifatto dopo aver cambiato classi o icone in `index.html` o nei file `.js` di `public/`; GitHub Actions lo rigenera comunque a ogni pubblicazione.

| File | Cosa contiene |
|---|---|
| `public/` | Tutto ciò che viene pubblicato: è la cartella servita da Cloudflare Pages. |
| `public/index.html` | Struttura della pagina (il font Inter si carica senza bloccare la prima schermata). |
| `public/regole.js` | Regola dei voti: da qui si calcola lo stato di ogni pompa. |
| `public/comuni.json` | I 78 comuni della provincia di Benevento con il loro centro (da OpenStreetMap): tendina del modulo e controlli del server. |
| `scripts/build-icons.mjs` | Icone Font Awesome: tiene solo quelle usate nel codice (font di pochi kB in `public/vendor/fa/`, regole in `src/icons.css`). Un'icona nuova basta scriverla nel codice e rifare `npm run build:css`. |
| `public/styles.css` | Stile generato da Tailwind con le sole classi usate (`tailwind.config.js`, `src/tailwind.css`). Non modificarlo a mano. |
| `public/app.js` | Logica della pagina: dati dalle API, mappa, elenco, scheda della pompa, voti, nuova pompa. |
| `public/vendor/leaflet/` | Libreria della mappa (Leaflet 1.9.4) ospitata sul sito, per non dipendere da unpkg.com. |
| `public/_headers`, `public/_redirects` | Header HTTP di sicurezza; `/nuova/` (indirizzo dell'anteprima della nuova interfaccia) porta alla home. |
| `functions/api/stations.ts`, `functions/api/vote.ts` | API dei distributori e dei voti (vedi "Database"). |
| `lib/benzina.ts` | Codice comune alle API: controlli sui dati, limiti contro gli abusi, letture dal database. |
| `migrations/` | Struttura del database D1 (tabelle `stations` e `votes`). |
| `functions/api/press-news.ts` | Pages Function che legge i feed delle testate locali (`/api/press-news`). Cache sull'edge di 15 minuti. |
| `wrangler.toml` | Configurazione Cloudflare Pages: cartella da pubblicare e database (`benzina-db` per il sito vero, `benzina-db-preview` per le anteprime). |
| `docs/analisi-ux.md` | Analisi di usabilità che ha portato all'interfaccia attuale (ottobre 2026). |
| `public/favicon.svg`, `public/*.png` | Icone del sito. |
| `_ui-minimale-blu/` | Una grafica alternativa (minimale, blu) fatta in precedenza. Non è pubblicata. |

## Database (Cloudflare D1)
- Database D1 sull'account Cloudflare del sito: `benzina-db` (sito vero) e `benzina-db-preview` (anteprime dei rami). Fino all'ottobre 2026 i dati erano su Firebase, su un account Google di un'altra persona.
- La pagina non parla mai direttamente col database: passa dalle API in `functions/api/`, che controllano ogni dato (stati, lunghezze, marchi, zona) e permettono a ognuno di toccare solo il proprio voto. Nessuna API cancella o riscrive distributori.
  - `GET /api/stations`: distributori visibili con i voti degli ultimi 7 giorni. Resta in cache sull'edge 5 secondi, così anche con tanta gente il database si legge poco.
  - `POST /api/vote`: salva, cambia o toglie (`vote: null`) il proprio voto. L'ora la mette il server.
  - `POST /api/stations`: nuovo distributore con il primo voto (massimo 5 al giorno a persona). Il comune deve essere uno dei 78 di `public/comuni.json` (Benevento se manca), la posizione entro 12 km dal suo centro, nome e via devono contenere lettere.
- **Chi vota**: ogni dispositivo crea un codice segreto casuale (in `localStorage`); nei dati pubblici compare solo un suo hash (`voter`), quindi nessuno può votare al posto di un altro. Cancellando i dati del browser si diventa un "nuovo" votante, come succedeva con il login anonimo di Firebase.
- Contro gli abusi: massimo 300 voti ogni 10 minuti dalla stessa connessione (l'IP viene salvato solo come hash che cambia ogni giorno).
- La pagina chiede l'elenco ogni 20 secondi mentre è aperta e visibile (`POLL_MS`), e si ferma quando la scheda è nascosta.
- **Limiti del piano gratuito** (si azzerano a mezzanotte UTC): 100.000 richieste al giorno alle API (pagine e file del sito non contano), 5 milioni di letture e 100.000 scritture al giorno sul database. Bastano per decine di migliaia di visite al giorno; oltre, il piano Workers Paid costa 5 $ al mese. In Cloudflare → Workers & Pages → benzina-benevento-live → Impostazioni → Runtime conviene lasciare "Fail open": se le richieste finiscono, il sito resta visibile.
- **Correggere i dati** (spostare una pompa, rinominarla, nasconderla) si fa con un comando sul database, ad esempio:
  `npx wrangler d1 execute benzina-db --remote --command "UPDATE stations SET hidden = 1 WHERE id = 'bn-custom-...'"`
- Struttura delle tabelle: `migrations/0001_init.sql`. Una nuova modifica va in un nuovo file `migrations/000N_...sql`, applicato con `npx wrangler d1 migrations apply benzina-db --remote` (e `benzina-db-preview --remote --env preview` per le anteprime).

## Logica dei voti (in `regole.js`)
- Un voto a persona per distributore (l'identità è il codice segreto del dispositivo, vedi sopra). Si cambia toccando un altro stato, si toglie con "Togli il mio voto"; dopo ogni voto c'è "Annulla".
- Vince lo stato con più voti. **A parità vince il peggiore** (Esaurita > Limitata > Aperta): con 10 Esaurita e 10 Aperta resta Esaurita, servono 11 Aperta.
- **Riavvio dopo 45 minuti** (`VOTE_WINDOW_MS`): se un voto per uno stato diverso arriva quando sono passati 45 minuti dall'ultimo voto dello stato in vigore, il conteggio riparte da quel voto. I voti precedenti restano salvati ma non pesano; la scheda mostra solo il totale delle segnalazioni ricevute (in grigio), l'elenco lo stesso totale sotto l'orario. Esempio: 10 Aperta con l'ultima alle 10:00; un Esaurita alle 10:50 rende subito la pompa Esaurita, alle 10:20 no.
- **Code e carburanti**: ogni voto ha una coda (`queueLevel`: Nessuna coda / Attesa 5-10 min / Coda lunga / Presidio TIR, "Non indicata", "Nessuna" per le chiuse) e i carburanti. La coda mostrata è l'ultima indicata davvero tra i voti in corso di pompe aperte o con code (`currentQueue`); i carburanti sono quelli dell'ultimo voto dello stato in vigore.
- Chi aggiunge un distributore con uno stato iniziale dà il primo voto, che segue la stessa regola.
- `npm test` verifica la regola su casi d'esempio (`tests/regola-voti.test.js`): lanciarlo dopo ogni modifica a `regole.js`.
- Lo stato mostrato si ricalcola sempre dai voti (`normalizeStation`), mai da un valore salvato.
- Il testo inserito dagli utenti passa sempre da `esc()` prima di finire nell'HTML: mantenerlo in ogni nuovo template.

## Interfaccia
Pensata per chi la usa dal telefono, di fretta: prima la risposta ("dove c'è benzina, quanto è fresca la notizia"), poi l'azione ("segnala con un tocco"). Il perché delle scelte è in `docs/analisi-ux.md`.
- **Primo schermo**: riepilogo su due righe (Tutte · Senza notizie / Aperte · Limitate · Esaurite), che è anche il filtro; ricerca; "Vicino a me"; mappa; elenco.
- **Stati**: un solo vocabolario con simbolo e colore, uguale su mappa, elenco e scheda: ✓ Aperta (verde), ! Limitata (giallo: carburante con limiti, cioè solo alcuni tipi, poca scorta, tetto di spesa), ✕ Esaurita (rosso), ? Nessuna notizia. La coda si vota a parte: una pompa aperta con coda segnalata ha il segnaposto verde con la clessidra (`iconOf`). Fino al 23/10/2026 lo stato giallo si chiamava "Code o limitata": quei voti ora valgono come Limitata.
- **Segnaposto sovrapposti**: allo zoom attuale ogni segnaposto prende la prima posizione libera vicino al suo punto (prima la pompa aperta e quelle con notizie fresche), così si possono toccare tutti; zoomando tornano al punto esatto. Oltre 3 ore senza conferme (`STALE_MS`) la pompa è tratteggiata e "da confermare".
- **Elenco**: una riga per pompa. Ordine: prima le notizie utili (aperte, con code, esaurite, senza notizie; le più fresche in alto), oppure dal più vicino con "Vicino a me" (la posizione si chiede solo lì).
- **Scheda della pompa** (dal basso su telefono, a lato su computer; si apre toccando una riga o un segnaposto; il tasto indietro e Esc la chiudono): stato con orario, coda, carburanti, Indicazioni (navigatore), Condividi (`benzinabn.it/?p=<id>` apre direttamente la scheda), tre pulsanti grandi per votare, caselle Benzina/Diesel/GPL e coda sempre visibili.
- **Nuova pompa** (pulsante "Segnala"): facile ma con dati controllati. Passo 1: "Sono alla pompa: usa la mia posizione" (trova comune e via con Nominatim), oppure comune dalla tendina, via scelta tra i suggerimenti (Photon, dati OpenStreetMap, solo vie di quel comune), numero civico facoltativo, nome e marchio obbligatori. Poi la posizione: quella del telefono, oppure il distributore vero lì vicino con lo stesso nome o marchio, oppure il numero civico o la via. Passo 2: segnaposto trascinabile solo entro 600 m, avviso "Forse c'è già" (pompe entro 200 m) che blocca finché non si conferma, stato (anche "Non so") e carburanti.
- **Posizioni**: stanno nel database (`lat`/`lng`); quelle iniziali sono i distributori reali su OpenStreetMap. Correzioni: vedi "Correggere i dati".
- Notizie della stampa locale in fondo all'elenco, chiuse; "Come funziona" spiega le regole.

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
