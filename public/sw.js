// Service worker: il sito si apre anche con la rete debole o assente, con gli ultimi dati visti.
// - pagina principale: sempre prima dalla rete (così arriva subito la versione nuova); senza rete, l'ultima salvata
//   (le altre pagine, come /privacy, si salvano col loro indirizzo e non prendono il posto della principale)
// - /api/stations: prima dalla rete; senza rete l'ultima risposta, con X-Offline-Cached-At (l'ora dei dati)
// - file del sito (stile, script, font, icone): dalla cache e intanto si aggiornano
// - voti e altre richieste, mappa di OpenStreetMap e altri siti: non passano di qui
const CACHE = 'benzinabn-v3'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k)
  await self.clients.claim()
})()))

// una sola copia per file: salvando app.js?v=nuova si toglie app.js?v=vecchia
async function put(req, res) {
  const cache = await caches.open(CACHE)
  const url = new URL(req.url)
  if (url.search) for (const old of await cache.keys()) { const o = new URL(old.url); if (o.pathname === url.pathname && o.search !== url.search) await cache.delete(old) }
  await cache.put(req, res)
}

self.addEventListener('fetch', (e) => {
  const req = e.request
  const url = new URL(req.url)
  if (req.method !== 'GET' || url.origin !== location.origin) return

  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const res = await fetch(req)
        if (res.ok && !res.redirected) await put(new Request(url.pathname === '/' ? '/' : url.pathname), res.clone())
        return res
      } catch (err) {
        return (await caches.match(url.pathname === '/' ? '/' : url.pathname)) || Response.error()
      }
    })())
    return
  }

  if (url.pathname === '/api/stations') {
    e.respondWith((async () => {
      try {
        const res = await fetch(req)
        if (res.ok) {
          const body = await res.clone().arrayBuffer()
          // solo le intestazioni che servono: copiando anche Content-Encoding Firefox scarta la risposta (il corpo è già decompresso)
          const headers = { 'Content-Type': 'application/json', 'X-Offline-Cached-At': String(Date.now()) }
          await put(new Request('/api/stations'), new Response(body, { status: 200, headers }))
        }
        return res
      } catch (err) {
        return (await caches.match('/api/stations')) || Response.error()
      }
    })())
    return
  }
  if (url.pathname.startsWith('/api/')) return

  e.respondWith((async () => {
    const cached = await caches.match(req)
    const fresh = fetch(req).then(async (res) => { if (res.ok) await put(req, res.clone()); return res })
    if (cached) { e.waitUntil(fresh.catch(() => {})); return cached }
    return fresh
  })())
})
