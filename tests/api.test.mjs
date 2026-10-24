// Prova le API dei distributori e dei voti su un server locale: in un terminale `npm run dev`,
// nell'altro `npm run test:api`. Scrive nel database LOCALE (.wrangler), mai in quello vero.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash, randomBytes } from 'node:crypto'

const BASE = process.env.API_BASE || 'http://localhost:8788'
if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(BASE)) throw new Error('I test scrivono dati: usali solo su un server locale.')

const newSecret = () => randomBytes(32).toString('hex')
const voterOf = (secret) => createHash('sha256').update('voter:' + secret).digest('hex').slice(0, 24)
const vote = (status, note = '') => ({ status, fuels: { benzina: status !== 'closed', diesel: status !== 'closed', gpl: false }, queueLevel: status === 'closed' ? 'Nessuna' : 'Scorrevole', note })

async function post(path, body, ip = '10.0.0.' + Math.floor(Math.random() * 250)) {
  const res = await fetch(BASE + path, { method: 'POST', headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': ip }, body: JSON.stringify(body) })
  return { status: res.status, data: await res.json() }
}
const getStations = async () => (await (await fetch(BASE + '/api/stations', { cache: 'no-store' })).json()).stations

test('elenco: distributori visibili con i voti, senza quelli nascosti', async () => {
  const stations = await getStations()
  assert.ok(stations.length >= 19)
  assert.ok(!stations.some((s) => s.id === 'bn-custom-1792679821068'))
  const esso = stations.find((s) => s.id === 'bn-custom-1792688137608')
  assert.equal(esso.name, 'Esso - Rotonda dei Pentri')
  for (const s of stations) assert.equal(typeof s.votes, 'object')
})

test('votare, cambiare e togliere il proprio voto', async () => {
  const secret = newSecret(), me = voterOf(secret)
  let r = await post('/api/vote', { secret, stationId: 'bn-station-3', vote: vote('closed', 'Coni davanti') })
  assert.equal(r.status, 200)
  assert.equal(r.data.voter, me)
  assert.equal(r.data.station.votes[me].status, 'closed')
  assert.equal(r.data.station.votes[me].note, '') // le note libere non si salvano
  assert.ok(Math.abs(r.data.station.votes[me].ts - Date.now()) < 60_000, "l'ora la mette il server")

  r = await post('/api/vote', { secret, stationId: 'bn-station-3', vote: vote('available') })
  assert.equal(r.data.station.votes[me].status, 'available')

  r = await post('/api/vote', { secret, stationId: 'bn-station-3', vote: null })
  assert.equal(r.status, 200)
  assert.equal(r.data.station.votes[me], undefined)
})

test("il voto di un altro non si può toccare", async () => {
  const anna = newSecret(), bruno = newSecret()
  await post('/api/vote', { secret: anna, stationId: 'bn-station-4', vote: vote('closed') })
  const r = await post('/api/vote', { secret: bruno, stationId: 'bn-station-4', vote: null })
  assert.equal(r.status, 200)
  assert.equal(r.data.station.votes[voterOf(anna)].status, 'closed')
  // l'id pubblico non basta per votare: serve il codice segreto
  const forged = await post('/api/vote', { secret: voterOf(anna), stationId: 'bn-station-4', vote: null })
  assert.equal(forged.status, 400)
})

test('voti e richieste non valide vengono rifiutati', async () => {
  const secret = newSecret()
  assert.equal((await post('/api/vote', { secret: 'abc', stationId: 'bn-station-3', vote: vote('closed') })).status, 400)
  assert.equal((await post('/api/vote', { secret, stationId: 'bn-station-3', vote: { ...vote('closed'), status: 'unverified' } })).status, 400)
  assert.equal((await post('/api/vote', { secret, stationId: 'bn-station-3', vote: { ...vote('closed'), queueLevel: 'boh' } })).status, 400)
  assert.equal((await post('/api/vote', { secret, stationId: 'bn-station-999', vote: vote('closed') })).status, 404)
  assert.equal((await post('/api/vote', { secret, stationId: 'bn-custom-1792679821068', vote: vote('closed') })).status, 404, 'nascosto')
  assert.equal((await post('/api/vote', { secret, stationId: '<script>', vote: vote('closed') })).status, 400)
})

const newStation = (extra = {}) => ({ name: 'Prova - Via Roma', brand: 'IP', address: 'Via Roma 1', zone: 'Centro / Mellusi', lat: 41.13, lng: 14.78, ...extra })

test('aggiungere un distributore con il primo voto, anche in un altro comune', async () => {
  const secret = newSecret(), me = voterOf(secret)
  let r = await post('/api/stations', { secret, station: newStation(), vote: vote('available') })
  assert.equal(r.status, 201)
  assert.match(r.data.station.id, /^bn-custom-\d+$/)
  assert.equal(r.data.station.votes[me].status, 'available')
  assert.ok((await getStations()).some((s) => s.id === r.data.station.id), "compare subito nell'elenco")

  r = await post('/api/stations', { secret, station: newStation({ zone: 'San Marco dei Cavoti', comune: 'San Marco dei Cavoti', lat: 41.31061, lng: 14.87894 }), vote: null })
  assert.equal(r.status, 201)
  assert.equal(r.data.station.comune, 'San Marco dei Cavoti')
  assert.deepEqual(r.data.station.votes, {})
})

test('distributori non validi vengono rifiutati, e massimo 5 al giorno a persona', async () => {
  const secret = newSecret()
  assert.equal((await post('/api/stations', { secret, station: newStation({ brand: 'Pippo' }) })).status, 400)
  assert.equal((await post('/api/stations', { secret, station: newStation({ lat: 45.4, lng: 9.2 }) })).status, 400, 'fuori zona')
  assert.equal((await post('/api/stations', { secret, station: newStation({ name: '' }) })).status, 400)
  assert.equal((await post('/api/stations', { secret, station: newStation({ comune: 'Milano' }) })).status, 400, 'comune fuori provincia')
  assert.equal((await post('/api/stations', { secret, station: newStation({ comune: 'Apice' }) })).status, 400, 'posizione lontana dal comune scelto')
  assert.equal((await post('/api/stations', { secret, station: newStation({ address: '1' }) })).status, 400, 'via senza lettere')
  for (let i = 0; i < 5; i++) assert.equal((await post('/api/stations', { secret, station: newStation() })).status, 201)
  assert.equal((await post('/api/stations', { secret, station: newStation() })).status, 429)
})

test('troppi voti dalla stessa connessione vengono fermati', async () => {
  const ip = '10.9.9.9'
  let last
  for (let i = 0; i < 305; i++) {
    last = await post('/api/vote', { secret: newSecret(), stationId: 'bn-station-5', vote: vote('limited') }, ip)
    if (last.status === 429) break
  }
  assert.equal(last.status, 429)
})
