-- Meno dati: un codice segreto casuale per ogni giorno, mescolato all'IP per l'impronta usata contro gli
-- abusi. Il giorno dopo si cancella (lib/benzina.ts, cleanupOldData): da quel momento le impronte di quel
-- giorno non si possono più ricondurre a nessun indirizzo. Le impronte stesse si cancellano dopo un'ora.
CREATE TABLE ip_salt (
  day  TEXT PRIMARY KEY,   -- AAAA-MM-GG (UTC)
  salt TEXT NOT NULL
);
