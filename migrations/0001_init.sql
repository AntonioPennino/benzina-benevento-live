-- Distributori e voti (un voto per persona per distributore). Lo stato mostrato non si salva:
-- la pagina lo ricalcola dai voti con la regola di public/app.js.

CREATE TABLE stations (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  brand      TEXT NOT NULL,
  address    TEXT NOT NULL,
  zone       TEXT NOT NULL,
  comune     TEXT,
  lat        REAL NOT NULL,
  lng        REAL NOT NULL,
  hidden     INTEGER NOT NULL DEFAULT 0,  -- 1 = non mostrato (voce sbagliata o doppione)
  created_at INTEGER NOT NULL,
  created_by TEXT                          -- id pubblico di chi l'ha aggiunto (null per quelli iniziali)
);

CREATE TABLE votes (
  station_id  TEXT NOT NULL REFERENCES stations(id),
  voter       TEXT NOT NULL,               -- id pubblico (hash del codice segreto del dispositivo)
  status      TEXT NOT NULL CHECK (status IN ('available', 'limited', 'closed')),
  ts          INTEGER NOT NULL,            -- ora del server, in millisecondi
  benzina     INTEGER,
  diesel      INTEGER,
  gpl         INTEGER,
  queue_level TEXT NOT NULL,
  note        TEXT NOT NULL DEFAULT '',
  ip_hash     TEXT,                        -- per limitare gli abusi; cambia ogni giorno
  PRIMARY KEY (station_id, voter)
);

CREATE INDEX votes_ts ON votes (ts);
CREATE INDEX votes_ip ON votes (ip_hash, ts);
CREATE INDEX stations_creator ON stations (created_by, created_at);
