-- Limite alle pompe nuove anche per connessione (non solo per dispositivo: un codice del dispositivo
-- nuovo si crea in un attimo). Impronta dell'IP come in votes.ip_hash; si azzera dopo un giorno.
ALTER TABLE stations ADD COLUMN created_ip TEXT;
