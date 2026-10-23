// Dà ad app.js, regole.js e styles.css un numero di versione nuovo in index.html (?v=...), così i browser
// scaricano subito la versione appena pubblicata invece di usare quella in cache (Cloudflare
// la tiene fino a 4 ore). Uso: node scripts/stamp-version.mjs [versione] | --restore
import { readFileSync, writeFileSync } from 'node:fs'

const arg = process.argv[2]
const version = arg === '--restore' ? 'dev' : (arg || Date.now().toString(36))
for (const [path, required] of [['../public/index.html', true]]) {
  const file = new URL(path, import.meta.url)
  let html
  try { html = readFileSync(file, 'utf8') } catch (e) { if (required) throw e; continue }
  const next = html.replace(/(app\.js|styles\.css|regole\.js)\?v=[\w-]+/g, `$1?v=${version}`)
  if (next === html && arg !== '--restore' && required) throw new Error('app.js?v=... non trovato in index.html')
  writeFileSync(file, next)
}
console.log(`app.js e styles.css ?v=${version}`)
