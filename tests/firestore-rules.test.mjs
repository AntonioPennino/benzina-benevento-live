// Verifica firestore.rules con l'emulatore, usando le stesse scritture che fa il sito: npm run test:rules
// (serve Java). Le funzioni dei voti vengono prese da public/app.js, come in regola-voti.test.js.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing'
import { doc, getDoc, setDoc, updateDoc, deleteDoc, runTransaction } from 'firebase/firestore'

const src = readFileSync(new URL('../public/app.js', import.meta.url), 'utf8')
const start = src.indexOf('const VOTE_WINDOW_MS')
const end = src.indexOf('async function persistVote')
const { applyVoteToStation } = new Function(src.slice(start, end) + '; return { applyVoteToStation };')()

const PATH = 'artifacts/benzina-benevento-live/public/data/stations'
const SEED = {
  id: 'bn-station-1', name: 'Eni - Via Napoli', brand: 'Eni', address: 'Via Napoli 168', zone: 'Rione Libertà',
  lat: 41.12143, lng: 14.76953, status: 'unverified', lastUpdated: null, confirmations: 0,
  fuels: { benzina: null, diesel: null, gpl: null }, queueLevel: 'Da verificare', lastNote: '', seedVersion: 5, lastReporterId: null
}
const vote = (status) => ({
  status, ts: Date.now(),
  fuels: status === 'closed' ? { benzina: false, diesel: false, gpl: false } : { benzina: true, diesel: true, gpl: false },
  queueLevel: status === 'closed' ? 'Nessuna' : (status === 'limited' ? 'Moderata' : 'Scorrevole'),
  note: status === 'available' ? 'Aperta.' : status === 'limited' ? 'Limitata.' : 'Chiusa.'
})
// come handleAddStationSubmit
const newStation = (uid, id, extra = {}) => ({
  id, name: 'Beneco - Via dei Liguri Bebiani', brand: 'Pompa Bianca', address: 'Via dei Liguri Bebiani 7', zone: 'Capodimonte / Pentri',
  lat: 41.15123, lng: 14.77953, status: 'available', lastUpdated: Date.now(), confirmations: 1,
  fuels: { benzina: true, diesel: true, gpl: false }, queueLevel: 'Scorrevole', lastNote: '', seedVersion: 5,
  lastReporterId: uid, votes: { [uid]: vote('available') }, ...extra
})
// come persistVote
async function castVote(db, uid, id, v) {
  const ref = doc(db, PATH, id)
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref)
    const next = applyVoteToStation(snap.data(), uid, v)
    const update = {
      status: next.status, lastUpdated: next.lastUpdated, confirmations: next.confirmations,
      fuels: next.fuels, queueLevel: next.queueLevel, lastNote: next.lastNote, lastReporterId: next.lastReporterId,
      isPressSource: false, seedVersion: 5, votes: next.votes
    }
    if (next.legacy !== undefined) update.legacy = next.legacy
    tx.update(ref, update)
  })
}

let env
const as = (uid) => env.authenticatedContext(uid).firestore()

before(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-benzina', firestore: { rules: readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8') } })
})
after(async () => { await env?.cleanup() })

async function seed() {
  await env.clearFirestore()
  await env.withSecurityRulesDisabled((ctx) => setDoc(doc(ctx.firestore(), PATH, 'bn-station-1'), SEED))
}

test('chiunque può leggere', async () => {
  await seed()
  await assertSucceeds(getDoc(doc(env.unauthenticatedContext().firestore(), PATH, 'bn-station-1')))
})

test('votare, cambiare e togliere il proprio voto', async () => {
  await seed()
  await assertSucceeds(castVote(as('anna'), 'anna', 'bn-station-1', vote('closed')))
  await assertSucceeds(castVote(as('bruno'), 'bruno', 'bn-station-1', vote('available')))
  await assertSucceeds(castVote(as('anna'), 'anna', 'bn-station-1', vote('limited')))
  await assertSucceeds(castVote(as('anna'), 'anna', 'bn-station-1', null))
  let data
  await env.withSecurityRulesDisabled(async (ctx) => { data = (await getDoc(doc(ctx.firestore(), PATH, 'bn-station-1'))).data() })
  assert.deepEqual(Object.keys(data.votes), ['bruno'])
  assert.equal(data.status, 'available')
})

test('non si possono toccare i voti degli altri', async () => {
  await seed()
  await castVote(as('anna'), 'anna', 'bn-station-1', vote('closed'))
  await assertFails(updateDoc(doc(as('bruno'), PATH, 'bn-station-1'), { votes: {} }))
  await assertFails(updateDoc(doc(as('bruno'), PATH, 'bn-station-1'), { 'votes.anna': vote('available') }))
})

test('non si può riscrivere un distributore da zero (il vecchio bug che azzerava i voti)', async () => {
  await seed()
  await castVote(as('anna'), 'anna', 'bn-station-1', vote('closed'))
  await assertFails(setDoc(doc(as('bruno'), PATH, 'bn-station-1'), SEED))
})

test('senza login non si scrive', async () => {
  await seed()
  await assertFails(updateDoc(doc(env.unauthenticatedContext().firestore(), PATH, 'bn-station-1'), { status: 'closed' }))
})

test('non si cancella e non si spostano i distributori', async () => {
  await seed()
  await assertFails(deleteDoc(doc(as('anna'), PATH, 'bn-station-1')))
  await assertFails(updateDoc(doc(as('anna'), PATH, 'bn-station-1'), { lat: 41 }))
})

test('aggiungere un distributore con il primo voto', async () => {
  await seed()
  const id = 'bn-custom-' + Date.now()
  await assertSucceeds(setDoc(doc(as('anna'), PATH, id), newStation('anna', id)))
  await assertSucceeds(castVote(as('bruno'), 'bruno', id, vote('closed')))
})

test('aggiungere un distributore "in attesa di verifica" (senza voto)', async () => {
  await seed()
  const id = 'bn-custom-' + Date.now()
  await assertSucceeds(setDoc(doc(as('anna'), PATH, id), newStation('anna', id, { status: 'unverified', lastUpdated: null, confirmations: 0, queueLevel: 'Da verificare', votes: {} })))
})

test('aggiungere un distributore in un altro comune o quartiere scritto a mano', async () => {
  await seed()
  const id = 'bn-custom-' + Date.now()
  await assertSucceeds(setDoc(doc(as('anna'), PATH, id), newStation('anna', id, { zone: 'San Marco dei Cavoti', comune: 'San Marco dei Cavoti', lat: 41.31061, lng: 14.87894 })))
})

test('un distributore nuovo non può portare voti di altri né id riservati', async () => {
  await seed()
  const id = 'bn-custom-' + Date.now()
  await assertFails(setDoc(doc(as('anna'), PATH, id), newStation('anna', id, { votes: { anna: vote('available'), bruno: vote('available') }, confirmations: 2 })))
  await assertFails(setDoc(doc(as('anna'), PATH, 'bn-station-99'), newStation('anna', 'bn-station-99')))
})
