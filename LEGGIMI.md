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

## Logica dei voti (in `app.js`)
- Un voto a persona per distributore (l'identità è l'utente anonimo Firebase). Ripremere lo stesso stato toglie il voto; premerne un altro lo sposta.
- Contano per lo stato solo i voti dei **45 minuti prima dell'ultimo voto** (`VOTE_WINDOW_MS`). I più vecchi restano visibili ma "in ombra" e non pesano. Un voto dopo una pausa fa ripartire il conteggio.
- Vince lo stato con più voti recenti; a parità (anche 1-1-1) decide il voto più recente.
- Lo stato mostrato si ricalcola sempre dai voti al caricamento (`normalizeStation`), mai dal valore salvato.
- Funzioni principali: `deriveFromVotes`, `splitVotes`, `voteCounts`, `applyVoteToStation`, `persistVote` (transazione Firestore), `quickInstantFlag`, `submitStationFlag`.
- Il testo inserito dagli utenti passa sempre da `esc()` prima di finire nell'HTML: mantenerlo in ogni nuovo template.

## Interfaccia
- Grafica originale (scura, con avviso giallo e rosso, emoji, mappa schematica).
- Su telefono: barra **Mappa / Elenco** (una vista alla volta, filtri sempre sopra). Su schermi larghi mappa ed elenco sono affiancati.
- La mappa semplificata si zooma (rotella, pizzico, pulsanti) e si trascina.

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
