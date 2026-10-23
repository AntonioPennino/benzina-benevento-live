// Codice comune alle API dei distributori e dei voti (functions/api/*). I controlli qui sotto
// sostituiscono le regole di sicurezza di Firebase: il database è raggiungibile solo da queste API.

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
export const QUEUE_LEVELS = ['Scorrevole', 'Moderata', 'Lunga', 'Presidio TIR / Disagi', 'Nessuna']
export const BRANDS = ['Eni', 'Q8', 'Esso', 'IP', 'Tamoil', 'Energas', 'Pompa Bianca']

// voti più vecchi di così non vengono più mandati alla pagina
export const VOTES_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000
// limiti contro gli abusi
export const MAX_VOTES_PER_IP_10MIN = 300 // alto: sulle reti mobili molte persone escono dallo stesso IP
export const MAX_NEW_STATIONS_PER_DAY = 5

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

// IP mescolato con la data: serve solo a contare le richieste recenti, non a riconoscere le persone
export async function ipHash(request: Request): Promise<string> {
  const ip = request.headers.get('CF-Connecting-IP') || 'sconosciuto'
  return (await sha256Hex(`ip:${ip}:${new Date().toISOString().slice(0, 10)}`)).slice(0, 24)
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
    note: text(v.note, 100, 'la nota', false),
  }
}

export function parseNewStation(s: any) {
  if (!s || typeof s !== 'object') throw new ApiError(400, 'Distributore non valido.')
  if (!BRANDS.includes(s.brand)) throw new ApiError(400, 'Marchio non valido.')
  const lat = Number(s.lat), lng = Number(s.lng)
  // area larga attorno a Benevento (anche gli altri comuni della provincia)
  if (!(lat > 40.0 && lat < 42.0 && lng > 13.5 && lng < 16.0)) throw new ApiError(400, 'Posizione fuori zona.')
  const comune = text(s.comune, 40, 'il comune', false)
  return {
    name: text(s.name, 50, 'il nome'),
    brand: s.brand as string,
    address: text(s.address, 70, "l'indirizzo"),
    zone: text(s.zone, 40, 'il quartiere'),
    comune: comune || null,
    lat: Math.round(lat * 1e5) / 1e5,
    lng: Math.round(lng * 1e5) / 1e5,
  }
}

export async function checkIpRate(env: Env, ip: string, now: number) {
  const row = await env.DB.prepare('SELECT COUNT(*) AS n FROM votes WHERE ip_hash = ? AND ts > ?').bind(ip, now - 10 * 60 * 1000).first<{ n: number }>()
  if ((row?.n || 0) >= MAX_VOTES_PER_IP_10MIN) throw new ApiError(429, 'Troppi voti da questa connessione. Riprova tra qualche minuto.')
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
