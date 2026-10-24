// GET  /api/stations  → tutti i distributori con i voti degli ultimi 7 giorni
// POST /api/stations  → nuovo distributore segnalato da un cittadino (con il suo primo voto)
import {
  Env, ApiError, json, errorResponse, readJson, voterIdFromSecret, ipHash, parseVote, parseNewStation,
  checkIpRate, upsertVoteStmt, loadStations, loadStation, STATIONS_CACHE_S, stationsCacheKey, purgeStationsCache,
  MAX_NEW_STATIONS_PER_DAY, MAX_NEW_STATIONS_PER_IP_DAY, cleanupOldData,
} from '../../lib/benzina'

type Ctx = { request: Request; env: Env; waitUntil: (p: Promise<unknown>) => void }

export const onRequestGet = async ({ request, env, waitUntil }: Ctx): Promise<Response> => {
  try {
    const cache = (caches as unknown as { default: Cache }).default
    const key = stationsCacheKey(request)
    const cached = await cache.match(key)
    if (cached) return cached

    const now = Date.now()
    const res = json({ updatedAt: now, stations: await loadStations(env, now) }, 200, {
      // la cache del browser resta spenta: la pagina deve vedere i voti nuovi a ogni aggiornamento
      'Cache-Control': `public, max-age=0, s-maxage=${STATIONS_CACHE_S}`,
    })
    waitUntil(cache.put(key, res.clone()))
    return res
  } catch (e) {
    return errorResponse(e)
  }
}

export const onRequestPost = async ({ request, env, waitUntil }: Ctx): Promise<Response> => {
  try {
    const body = await readJson(request)
    const voter = await voterIdFromSecret(body.secret)
    const station = parseNewStation(body.station)
    const vote = body.vote ? parseVote(body.vote) : null
    const now = Date.now()
    const ip = await ipHash(env, request)

    // limite per dispositivo e per connessione (un dispositivo nuovo si crea in un attimo)
    const recent = await env.DB.prepare('SELECT SUM(created_by = ?) AS mine, SUM(created_ip = ?) AS net FROM stations WHERE created_at > ?')
      .bind(voter, ip, now - 24 * 60 * 60 * 1000).first<{ mine: number | null; net: number | null }>()
    if ((recent?.mine || 0) >= MAX_NEW_STATIONS_PER_DAY) throw new ApiError(429, 'Hai già aggiunto molti distributori oggi. Riprova domani.')
    if ((recent?.net || 0) >= MAX_NEW_STATIONS_PER_IP_DAY) throw new ApiError(429, 'Da questa connessione sono stati aggiunti molti distributori oggi. Riprova domani.')
    if (vote) await checkIpRate(env, ip, now, '', voter)

    const id = `bn-custom-${now}`
    const stmts = [
      env.DB.prepare('INSERT INTO stations (id, name, brand, address, zone, comune, lat, lng, created_at, created_by, created_ip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(id, station.name, station.brand, station.address, station.zone, station.comune, station.lat, station.lng, now, voter, ip),
    ]
    if (vote) stmts.push(upsertVoteStmt(env, id, voter, vote, now, ip))
    await env.DB.batch(stmts)
    await purgeStationsCache(request)
    waitUntil(cleanupOldData(env, now))

    return json({ station: await loadStation(env, id, now), voter }, 201)
  } catch (e) {
    return errorResponse(e)
  }
}
