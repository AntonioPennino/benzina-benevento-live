# Analisi UX e proposta di nuova interfaccia

Ottobre 2026. Prototipo funzionante: pagina `/nuova/` sul ramo `nuova-ui`
(anteprima: https://nuova-ui.benzina-benevento-live.pages.dev/nuova/, database di prova).

## Chi usa il sito e per cosa
L'utente tipico è una persona di Benevento, **dal telefono**, spesso **in macchina o di fretta**, durante una crisi di carburante. Ha due bisogni, in quest'ordine:
1. **"Dove trovo benzina adesso, vicino a me?"** Vuole una risposta in pochi secondi e deve potersi fidare (quanto è recente la notizia?).
2. **"Sono davanti a una pompa: la segnalo."** Deve bastare un tocco, senza moduli.

## Problemi dell'interfaccia attuale (dal più grave)

### 1. Su telefono la risposta non si vede nel primo schermo
Il primo schermo è occupato da: striscia "emergenza", intestazione, riquadro delle notizie (circa il 40% dello schermo), barra Mappa/Elenco, ricerca e filtri. **La mappa comincia sotto la piega** e i contatori ("7 aperte, 4 esaurite") su telefono sono **nascosti**. Chi apre il sito non vede subito dove c'è benzina.

### 2. L'elenco è lunghissimo
Ogni pompa occupa una scheda alta circa 370 px (barra dei voti, carburanti, tre pulsanti di voto, ultimo voto, "Dettagli"): con 21 pompe sono **circa 7.000 px**, 2 pompe per schermo. Confrontare le pompe è faticoso.

### 3. Quanto è recente la notizia è un dettaglio, non l'informazione principale
"APERTA" è grande e colorato, "5 ore fa" è piccolo e grigio. In una crisi una notizia vecchia di ore può mandare la gente a vuoto. L'ordine predefinito "Aggiornati di recente" non aiuta chi cerca una pompa aperta.

### 4. Votare si fa per sbaglio, e non si capisce cosa conti
- Nell'elenco i pulsanti di voto sono anche i contatori ("Aperta 2"): toccando per **vedere** si **vota**. Ritoccare lo stesso pulsante toglie il voto, senza preavviso.
- Nella scheda grande lo stato attuale è **già evidenziato** come se l'avessi votato tu, e per confermare bisogna scorrere fino a "Conferma il mio voto".
- Ci sono due modi di votare (voto rapido e scheda grande con carburanti, coda e nota) che si comportano in modo diverso.

### 5. Etichette diverse per la stessa cosa
"Aperta / Disponibile", "APERTA", "È Aperta", "Carburante OK"; "Limitata / Code / Presidio", "Limitati/Code"; "Da verificare", "In attesa di segnalazione", "In attesa del primo voto". La legenda ripete ogni colore due volte (pallino + emoji).

### 6. Troppi elementi che urlano
Rosso e giallo ovunque ("EMERGENZA", "FONTI STAMPA VERIFICATE", "Dati Reali Cittadini + Stampa", "Dati condivisi in tempo reale"): tutto sembra importante, quindi niente lo è.

### 7. Informazioni poco affidabili presentate come certe
- I carburanti vengono dall'ultimo voto: una pompa può risultare "Aperta" con "Benzina ✗ Diesel ✗".
- I voti rapidi davano per scontato "Benzina ✓ Diesel ✓" anche se nessuno l'aveva detto.

### 8. Mappa che si legge solo con i colori
Tutte le pompe hanno la stessa icona; lo stato è solo nel colore (difficile per chi non distingue rosso e verde). La scheda piccola copre buona parte della mappa su telefono.

### 9. Aggiungere una pompa è macchinoso e crea doppioni
Marchio e quartiere obbligatori, "Nome / Via" e "Indirizzo" che si sovrappongono, stato già impostato su "Aperta", nessuna anteprima della posizione, nessun avviso se la pompa c'è già (è successo con "Oreste Tretola", aggiunta due volte), nessun modo di correggere dopo.

### 10. Dettagli che confondono
- "ID Cittadino: 82f37bec…" in fondo alla pagina.
- La nota predefinita "Aggiornata." mostrata tra virgolette come se l'avesse scritta qualcuno.
- Testi a 10-11 px e pulsanti piccoli (meno di 44 px) su telefono.
- Nessuna spiegazione di come si decide lo stato (45 minuti, parità al peggiore).
- Il tasto "indietro" del telefono esce dal sito invece di chiudere la scheda.

## Proposta (prototipo `/nuova/`)

**Principio**: prima la risposta ("dove c'è benzina, quanto è fresca la notizia"), poi l'azione ("segnala con un tocco"), il resto dopo.

| Problema | Proposta |
|---|---|
| Risposta sotto la piega | Primo schermo: riepilogo **"Aperte 7 · Con code 1 · Esaurite 4 · Senza notizie 9"** (sono anche i filtri), ricerca, **"Vicino a me"**, mappa subito sotto, poi l'elenco. Notizie della stampa in fondo, chiuse. |
| Elenco lungo | **Una riga per pompa** (~70 px): simbolo dello stato, nome, via o distanza, coda; a destra stato + "8 min fa". Circa 8 pompe per schermo. |
| Freschezza | Lo stato è sempre accompagnato da "x min fa"; oltre 3 ore diventa "da confermare" e la pompa è tratteggiata. Ordine predefinito: **prima le notizie utili** (aperte, con code, esaurite, senza notizie; le più fresche in alto). Con "Vicino a me": dal più vicino. |
| Voti per sbaglio | Dall'elenco e dalla mappa si **apre la scheda**, non si vota. Nella scheda: tre pulsanti grandi "Aperta / Code / Esaurita"; **un tocco salva il voto**, con messaggio "Voto registrato · **Annulla**". Solo dopo compaiono, facoltativi, "C'è coda?" e "Cosa c'è?". I conteggi sono testo ("2 aperta · 0 code · 0 esaurita"), non pulsanti. |
| Etichette | Un solo vocabolario: **Aperta, Code, Esaurita, Nessuna notizia**, sempre con lo stesso simbolo (✓, clessidra, ✕, ?). |
| Troppo rumore | Intestazione scura sobria, una sola striscia d'avviso chiudibile, colore usato solo per gli stati. |
| Dati poco affidabili | Carburanti mostrati solo se qualcuno li ha indicati; i voti rapidi non inventano carburanti o code. |
| Mappa a colori | Segnaposto con **simbolo** oltre al colore; notizie vecchie tratteggiate; pompa aperta in evidenza. |
| Scheda | Su telefono è un **pannello dal basso** (come Google Maps), su computer un pannello laterale. Pulsanti **Indicazioni** (navigatore) e **Condividi** in alto. Il tasto indietro la chiude. |
| Nuova pompa | Due passi: nome + via + comune → **mappa con il segnaposto trascinabile** e avviso **"Forse c'è già"** se c'è una pompa entro 200 m → marchio (facoltativo) e "Com'è adesso?" con l'opzione **Non so**. Il quartiere si ricava dalla posizione. |
| Dettagli | Niente ID nel fondo pagina; "Come funziona" spiega in 6 righe come si decide lo stato; testi ≥ 13 px, pulsanti ≥ 44 px. |

## Cosa resta da decidere prima di passarla sul sito
- Se tenere la nota libera nel voto (oggi quasi nessuno la scrive).
- Se aggiungere "Segnala un errore" sulle pompe (nome o posizione sbagliati) invece di farle riaggiungere.
- Il prototipo ha una copia della regola dei voti (`public/nuova/regole.js`): passando alla nuova interfaccia va tenuta una sola copia.
