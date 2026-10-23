// Copia distributori e voti da Firebase (vecchio database) in un file SQL per D1.
// Uso: node scripts/export-firebase.mjs > firebase-export.sql
//      npx wrangler d1 execute benzina-db-preview --remote --file firebase-export.sql
// Le posizioni dei 14 distributori iniziali vengono da public/app.js (già corrette); per quelli
// aggiunti dagli utenti valgono le correzioni qui sotto. Si può rilanciare: sostituisce i dati.
import { readFileSync } from 'node:fs'

const PROJECT = 'pompe-di-benzina---benevento'
const KEY = 'AIzaSyAGJQ8nWcKiH7tZcV3T7Am8rUEqo7YYUA4' // chiave pubblica dell'app web, non un segreto
const URL_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/artifacts/benzina-benevento-live/public/data/stations`

// correzioni verificate il 22/10/2026 (distributori reali su OpenStreetMap, o la via)
const FIXES = {
  'bn-custom-1792675781566': { lat: 41.15123, lng: 14.77953 }, // Beneco - Via dei Liguri Bebiani
  'bn-custom-1792607627389': { lat: 41.11268, lng: 14.80072 }, // Sudpetroli - Via Fratelli Rosselli (via)
  'bn-custom-1792688137608': { lat: 41.14487, lng: 14.76673, name: 'Esso - Rotonda dei Pentri', brand: 'Esso', address: 'Rotonda dei Pentri (Rotonda di Padre Pio)' },
  'bn-custom-1792687945441': { lat: 41.12129, lng: 14.76954 }, // Via Napoli (via)
  'bn-custom-1792688909975': { lat: 41.31061, lng: 14.87894, zone: 'San Marco dei Cavoti', comune: 'San Marco dei Cavoti' },
}
const HIDDEN = new Set(['bn-custom-1792679821068']) // "Benevento": voce aggiunta per errore

// distributori iniziali dal codice della pagina
const app = readFileSync(new URL('../public/app.js', import.meta.url), 'utf8')
const seedSrc = app.slice(app.indexOf('const INITIAL_BENEVENTO_STATIONS'), app.indexOf('];', app.indexOf('const INITIAL_BENEVENTO_STATIONS')) + 2)
const SEEDS = new Function('const SEED_VERSION = 0;' + seedSrc + '; return INITIAL_BENEVENTO_STATIONS;')()

function value(v) {
  const [k, x] = Object.entries(v)[0]
  if (k === 'mapValue') return Object.fromEntries(Object.entries(x.fields || {}).map(([a, b]) => [a, value(b)]))
  if (k === 'arrayValue') return (x.values || []).map(value)
  if (k === 'integerValue') return Number(x)
  if (k === 'doubleValue') return Number(x)
  if (k === 'nullValue') return null
  return x
}

const res = await fetch(`${URL_BASE}?key=${KEY}&pageSize=300`)
if (!res.ok) throw new Error(`Firebase ha risposto ${res.status}: ${await res.text()}`)
const docs = ((await res.json()).documents || []).map((d) => ({ id: d.name.split('/').pop(), ...Object.fromEntries(Object.entries(d.fields).map(([a, b]) => [a, value(b)])) }))

const q = (v) => (v === null || v === undefined ? 'NULL' : typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`)
const b = (v) => (v === true ? 1 : v === false ? 0 : null)
const voterOf = (uid) => 'fb-' + String(uid).slice(0, 21)
const SEED_CREATED = Date.parse('2026-10-20T00:00:00Z')

const out = ['-- esportato da Firebase il ' + new Date().toISOString(), 'DELETE FROM votes;', 'DELETE FROM stations;']
let nStations = 0, nVotes = 0
for (const d of docs) {
  if (!/^bn-(station|custom)-\d+$/.test(d.id)) continue
  const seed = SEEDS.find((s) => s.id === d.id)
  const base = seed ? { name: seed.name, brand: seed.brand, address: seed.address, zone: seed.zone, lat: seed.lat, lng: seed.lng } : { name: d.name, brand: d.brand, address: d.address, zone: d.zone, comune: d.comune, lat: d.lat, lng: d.lng }
  const st = { ...base, ...(FIXES[d.id] || {}) }
  const created = seed ? SEED_CREATED : Number(d.id.split('-').pop())
  const createdBy = seed || !d.lastReporterId ? null : voterOf(d.lastReporterId)
  out.push(`INSERT INTO stations (id, name, brand, address, zone, comune, lat, lng, hidden, created_at, created_by) VALUES (${[d.id, st.name, st.brand, st.address, st.zone, st.comune || null, st.lat, st.lng, HIDDEN.has(d.id) ? 1 : 0, created, createdBy].map(q).join(', ')});`)
  nStations++
  for (const [uid, v] of Object.entries(d.votes || {})) {
    if (!v || !['available', 'limited', 'closed'].includes(v.status) || typeof v.ts !== 'number') continue
    const f = v.fuels || {}
    out.push(`INSERT INTO votes (station_id, voter, status, ts, benzina, diesel, gpl, queue_level, note) VALUES (${[d.id, voterOf(uid), v.status, v.ts, b(f.benzina), b(f.diesel), b(f.gpl), v.queueLevel || 'Scorrevole', String(v.note || '').slice(0, 100)].map(q).join(', ')});`)
    nVotes++
  }
}
// distributori iniziali che in Firebase non ci fossero
for (const s of SEEDS) {
  if (docs.some((d) => d.id === s.id)) continue
  out.push(`INSERT INTO stations (id, name, brand, address, zone, comune, lat, lng, hidden, created_at, created_by) VALUES (${[s.id, s.name, s.brand, s.address, s.zone, null, s.lat, s.lng, 0, SEED_CREATED, null].map(q).join(', ')});`)
  nStations++
}
console.log(out.join('\n'))
console.error(`${nStations} distributori, ${nVotes} voti`)
