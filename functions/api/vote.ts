// POST /api/vote  { secret, stationId, vote }  → salva, cambia o (con vote: null) toglie il proprio voto.
// Ognuno può toccare solo il voto legato al proprio codice segreto.
import { Env, ApiError, json, errorResponse, readJson, voterIdFromSecret, ipHash, parseVote, checkIpRate, upsertVoteStmt, loadStation, purgeStationsCache, cleanupOldData } from '../../lib/benzina'

type Ctx = { request: Request; env: Env; waitUntil: (p: Promise<unknown>) => void }

export const onRequestPost = async ({ request, env, waitUntil }: Ctx): Promise<Response> => {
  try {
    const body = await readJson(request)
    const voter = await voterIdFromSecret(body.secret)
    const stationId = typeof body.stationId === 'string' ? body.stationId : ''
    if (!/^bn-(station|custom)-\d+$/.test(stationId)) throw new ApiError(400, 'Distributore non valido.')
    const now = Date.now()

    const exists = await env.DB.prepare('SELECT 1 FROM stations WHERE id = ? AND hidden = 0').bind(stationId).first()
    if (!exists) throw new ApiError(404, 'Distributore non trovato.')

    if (body.vote === null) {
      await env.DB.prepare('DELETE FROM votes WHERE station_id = ? AND voter = ?').bind(stationId, voter).run()
    } else {
      const vote = parseVote(body.vote)
      const ip = await ipHash(env, request)
      await checkIpRate(env, ip, now)
      await upsertVoteStmt(env, stationId, voter, vote, now, ip).run()
    }
    await purgeStationsCache(request)
    waitUntil(cleanupOldData(env, now))

    return json({ station: await loadStation(env, stationId, now), voter })
  } catch (e) {
    return errorResponse(e)
  }
}
