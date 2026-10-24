// Codice comune alle API dei distributori e dei voti (functions/api/*). I controlli qui sotto
// sostituiscono le regole di sicurezza di Firebase: il database è raggiungibile solo da queste API.
import COMUNI from '../public/comuni.json'

export interface Env {
  DB: D1Database
}

export interface Vote {
  status: 'available' | 'limited' | 'closed'
  ts: number
  fuels: { benzina: boolean | null; diesel: boolean | null; gpl: boolean | null }
  queueLevel: string
  note: string
}

export interface Station {
  id: string
  name: string
  brand: string
  address: string
  zone: string
  comune?: string
  lat: number
  lng: number
  votes: Record<string, Vote>
}

export const STATUSES = ['available', 'limited', 'closed']
// 'Non indicata': voto rapido senza informazione sulle code (non cancella la coda segnalata da altri)
export const QUEUE_LEVELS = ['Scorrevole', 'Moderata', 'Lunga', 'Presidio TIR / Disagi', 'Nessuna', 'Non indicata']
export const BRANDS = ['Eni', 'Q8', 'Esso', 'IP', 'Tamoil', 'Energas', 'Pompa Bianca']

// voti più vecchi di così non vengono più mandati alla pagina
export const VOTES_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000
// limiti contro gli abusi
export const MAX_VOTES_PER_IP_10MIN = 300 // alto: sulle reti mobili molte persone escono dallo stesso IP
// un voto per pompa per dispositivo, ma un dispositivo "nuovo" si crea in un attimo: dalla stessa connessione
// al massimo tanti voti diversi sulla stessa pompa in un'ora (una coda di auto sulla stessa rete mobile ci sta)
export const MAX_VOTERS_PER_IP_STATION_1H = 10
export const MAX_NEW_STATIONS_PER_DAY = 5
export const MAX_NEW_STATIONS_PER_IP_DAY = 10

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message) }
}

export function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', ...headers } })
}

export function errorResponse(e: unknown): Response {
  if (e instanceof ApiError) return json({ error: e.message }, e.status)
  const msg = String((e as Error)?.message || e)
  console.error(msg)
  // limite giornaliero del piano gratuito di D1
  if (/daily row (read|write) limit/i.test(msg)) return json({ error: 'Il database ha raggiunto il limite giornaliero. Riprova più tardi.', code: 'quota' }, 503)
  return json({ error: 'Errore del server. Riprova tra poco.' }, 500)
}

async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Ogni dispositivo ha un codice segreto casuale (64 caratteri esadecimali); nei dati pubblici compare
// solo un suo hash, così nessuno può votare al posto di un altro copiandone l'id.
export async function voterIdFromSecret(secret: unknown): Promise<string> {
  if (typeof secret !== 'string' || !/^[0-9a-f]{64}$/.test(secret)) throw new ApiError(400, 'Codice del dispositivo non valido.')
  return (await sha256Hex('voter:' + secret)).slice(0, 24)
}

// IP mescolato con il codice segreto del giorno (tabella ip_salt): serve solo a contare le richieste
// degli ultimi minuti, non a riconoscere le persone. Senza il codice, che il giorno dopo si cancella,
// dall'impronta non si risale all'indirizzo (con la sola data sì: gli IPv4 sono pochi da provare tutti)
export async function ipHash(env: Env, request: Request): Promise<string> {
  const ip = request.headers.get('CF-Connecting-IP') || 'sconosciuto'
  const day = new Date().toISOString().slice(0, 10)
  let row = await env.DB.prepare('SELECT salt FROM ip_salt WHERE day = ?').bind(day).first<{ salt: string }>()
  if (!row) {
    const salt = [...crypto.getRandomValues(new Uint8Array(32))].map((b) => b.toString(16).padStart(2, '0')).join('')
    await env.DB.prepare('INSERT OR IGNORE INTO ip_salt (day, salt) VALUES (?, ?)').bind(day, salt).run()
    row = await env.DB.prepare('SELECT salt FROM ip_salt WHERE day = ?').bind(day).first<{ salt: string }>()
  }
  return (await sha256Hex(`ip:${ip}:${row!.salt}`)).slice(0, 24)
}

// Meno dati possibile: si tiene solo quello che serve al sito. Gira dopo un voto o una nuova pompa,
// al massimo ogni 10 minuti per server. Vedi anche public/privacy.html (va aggiornata se cambia qualcosa qui).
export const IP_HASH_KEEP_MS = 60 * 60 * 1000          // impronta dell'IP: il limite ai voti guarda gli ultimi 10 minuti
export const VOTES_KEEP_MS = 30 * 24 * 60 * 60 * 1000  // voti: la pagina usa solo quelli degli ultimi 7 giorni
export const CREATOR_KEEP_MS = 24 * 60 * 60 * 1000     // chi ha aggiunto una pompa (dispositivo e connessione): serve solo ai limiti giornalieri
let lastCleanup = 0
export async function cleanupOldData(env: Env, now: number) {
  if (now - lastCleanup < 10 * 60 * 1000) return
  lastCleanup = now
  try {
    await env.DB.batch([
      env.DB.prepare('UPDATE votes SET ip_hash = NULL WHERE ip_hash IS NOT NULL AND ts < ?').bind(now - IP_HASH_KEEP_MS),
      env.DB.prepare('DELETE FROM votes WHERE ts < ?').bind(now - VOTES_KEEP_MS),
      env.DB.prepare('UPDATE stations SET created_by = NULL, created_ip = NULL WHERE (created_by IS NOT NULL OR created_ip IS NOT NULL) AND created_at < ?').bind(now - CREATOR_KEEP_MS),
      env.DB.prepare("UPDATE votes SET note = '' WHERE note != ''"),
      env.DB.prepare('DELETE FROM ip_salt WHERE day < ?').bind(new Date(now).toISOString().slice(0, 10)),
    ])
  } catch (e) { console.error('Pulizia dei dati vecchi non riuscita', e) }
}

export async function readJson(request: Request): Promise<any> {
  if (Number(request.headers.get('Content-Length') || 0) > 10_000) throw new ApiError(413, 'Richiesta troppo grande.')
  try { return await request.json() } catch { throw new ApiError(400, 'Richiesta non valida.') }
}

function text(v: unknown, max: number, field: string, required = true): string {
  const s = typeof v === 'string' ? v.trim() : ''
  if (required && !s) throw new ApiError(400, `Manca ${field}.`)
  if (s.length > max) throw new ApiError(400, `${field} troppo lungo (massimo ${max} caratteri).`)
  return s
}

const boolOrNull = (v: unknown) => (v === true || v === false ? v : null)

// voto ricevuto dalla pagina → voto da salvare (l'ora la mette il server)
export function parseVote(v: any): Omit<Vote, 'ts'> {
  if (!v || typeof v !== 'object') throw new ApiError(400, 'Voto non valido.')
  if (!STATUSES.includes(v.status)) throw new ApiError(400, 'Stato non valido.')
  if (!QUEUE_LEVELS.includes(v.queueLevel)) throw new ApiError(400, 'Fila non valida.')
  const f = v.fuels && typeof v.fuels === 'object' ? v.fuels : {}
  return {
    status: v.status,
    fuels: { benzina: boolOrNull(f.benzina), diesel: boolOrNull(f.diesel), gpl: boolOrNull(f.gpl) },
    queueLevel: v.queueLevel,
    // le note libere non si salvano più (la pagina non le chiede): niente testo che possa contenere dati personali
    note: '',
  }
}

// confronto dei nomi dei comuni senza maiuscole, accenti e apostrofi diversi
const comuneKey = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’`]/g, "'").replace(/\s+/g, ' ').trim()
// distanza massima dal centro del comune scelto: oltre, la posizione non è credibile
const MAX_KM_FROM_COMUNE = 12

function kmBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  return Math.hypot((a.lat - b.lat) * 111, (a.lng - b.lng) * 111 * Math.cos(a.lat * Math.PI / 180))
}

// Nuovo distributore: solo nei 78 comuni della provincia di Benevento, con nome e via sensati e una
// posizione vicina al comune scelto (contro le voci inventate)
export function parseNewStation(s: any) {
  if (!s || typeof s !== 'object') throw new ApiError(400, 'Distributore non valido.')
  if (!BRANDS.includes(s.brand)) throw new ApiError(400, 'Marchio non valido.')
  const lat = Number(s.lat), lng = Number(s.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) throw new ApiError(400, 'Posizione non valida.')
  const comuneText = text(s.comune, 40, 'il comune', false) || 'Benevento'
  const comune = (COMUNI as { nome: string; lat: number; lng: number }[]).find((c) => comuneKey(c.nome) === comuneKey(comuneText))
  if (!comune) throw new ApiError(400, 'Comune non valido: scegli un comune della provincia di Benevento.')
  if (kmBetween({ lat, lng }, comune) > MAX_KM_FROM_COMUNE) throw new ApiError(400, `La posizione non corrisponde al comune di ${comune.nome}.`)
  const name = text(s.name, 50, 'il nome'), address = text(s.address, 70, "l'indirizzo")
  if (name.length < 3 || !/\p{L}/u.test(name)) throw new ApiError(400, 'Scrivi il nome del distributore.')
  if (address.length < 3 || !/\p{L}{2}/u.test(address)) throw new ApiError(400, 'Scrivi la via del distributore.')
  return {
    name,
    brand: s.brand as string,
    address,
    zone: text(s.zone, 40, 'il quartiere'),
    comune: comune.nome === 'Benevento' ? null : comune.nome,
    lat: Math.round(lat * 1e5) / 1e5,
    lng: Math.round(lng * 1e5) / 1e5,
  }
}

// stationId/voter: chi cambia il proprio voto non conta come voto in più
export async function checkIpRate(env: Env, ip: string, now: number, stationId: string, voter: string) {
  const row = await env.DB.prepare(
    'SELECT SUM(ts > ?) AS recent, SUM(station_id = ? AND voter != ?) AS here FROM votes WHERE ip_hash = ? AND ts > ?'
  ).bind(now - 10 * 60 * 1000, stationId, voter, ip, now - 60 * 60 * 1000).first<{ recent: number | null; here: number | null }>()
  if ((row?.recent || 0) >= MAX_VOTES_PER_IP_10MIN) throw new ApiError(429, 'Troppi voti da questa connessione. Riprova tra qualche minuto.')
  if ((row?.here || 0) >= MAX_VOTERS_PER_IP_STATION_1H) throw new ApiError(429, 'Troppi voti su questa pompa dalla stessa connessione. Riprova più tardi.')
}

export function upsertVoteStmt(env: Env, stationId: string, voter: string, v: Omit<Vote, 'ts'>, ts: number, ip: string) {
  const b = (x: boolean | null) => (x === null ? null : x ? 1 : 0)
  return env.DB.prepare(
    `INSERT INTO votes (station_id, voter, status, ts, benzina, diesel, gpl, queue_level, note, ip_hash)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (station_id, voter) DO UPDATE SET
       status = excluded.status, ts = excluded.ts, benzina = excluded.benzina, diesel = excluded.diesel,
       gpl = excluded.gpl, queue_level = excluded.queue_level, note = excluded.note, ip_hash = excluded.ip_hash`
  ).bind(stationId, voter, v.status, ts, b(v.fuels.benzina), b(v.fuels.diesel), b(v.fuels.gpl), v.queueLevel, v.note, ip)
}

type VoteRow = { station_id: string; voter: string; status: Vote['status']; ts: number; benzina: number | null; diesel: number | null; gpl: number | null; queue_level: string; note: string }
type StationRow = { id: string; name: string; brand: string; address: string; zone: string; comune: string | null; lat: number; lng: number }

const toBool = (x: number | null) => (x === null ? null : x === 1)
function attachVotes(stations: StationRow[], votes: VoteRow[]): Station[] {
  const byStation = new Map<string, Station>()
  const out = stations.map((s) => {
    const st: Station = { id: s.id, name: s.name, brand: s.brand, address: s.address, zone: s.zone, lat: s.lat, lng: s.lng, votes: {} }
    if (s.comune) st.comune = s.comune
    byStation.set(s.id, st)
    return st
  })
  for (const v of votes) {
    const st = byStation.get(v.station_id)
    if (st) st.votes[v.voter] = { status: v.status, ts: v.ts, fuels: { benzina: toBool(v.benzina), diesel: toBool(v.diesel), gpl: toBool(v.gpl) }, queueLevel: v.queue_level, note: v.note }
  }
  return out
}

export async function loadStations(env: Env, now: number): Promise<Station[]> {
  const [stations, votes] = await env.DB.batch([
    env.DB.prepare('SELECT id, name, brand, address, zone, comune, lat, lng FROM stations WHERE hidden = 0 ORDER BY created_at DESC'),
    env.DB.prepare('SELECT station_id, voter, status, ts, benzina, diesel, gpl, queue_level, note FROM votes WHERE ts > ?').bind(now - VOTES_MAX_AGE_MS),
  ])
  return attachVotes(stations.results as StationRow[], votes.results as VoteRow[])
}

export async function loadStation(env: Env, id: string, now: number): Promise<Station | null> {
  const [stations, votes] = await env.DB.batch([
    env.DB.prepare('SELECT id, name, brand, address, zone, comune, lat, lng FROM stations WHERE id = ? AND hidden = 0').bind(id),
    env.DB.prepare('SELECT station_id, voter, status, ts, benzina, diesel, gpl, queue_level, note FROM votes WHERE station_id = ? AND ts > ?').bind(id, now - VOTES_MAX_AGE_MS),
  ])
  return attachVotes(stations.results as StationRow[], votes.results as VoteRow[])[0] || null
}

// L'elenco completo resta in cache sull'edge per pochi secondi: con tante persone sul sito il
// database viene letto al massimo una volta ogni STATIONS_CACHE_S secondi per nodo Cloudflare.
export const STATIONS_CACHE_S = 5
export const stationsCacheKey = (request: Request) => new Request(new URL('/api/stations', request.url).toString())
export async function purgeStationsCache(request: Request) {
  try { await (caches as unknown as { default: Cache }).default.delete(stationsCacheKey(request)) } catch { /* cache non disponibile */ }
}
