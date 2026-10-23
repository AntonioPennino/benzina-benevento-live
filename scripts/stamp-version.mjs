// Dà ad app.js e styles.css un numero di versione nuovo in index.html (?v=...), così i browser
// scaricano subito la versione appena pubblicata invece di usare quella in cache (Cloudflare
// la tiene fino a 4 ore). Uso: node scripts/stamp-version.mjs [versione] | --restore
import { readFileSync, writeFileSync } from 'node:fs'

const file = new URL('../public/index.html', import.meta.url)
const arg = process.argv[2]
const version = arg === '--restore' ? 'dev' : (arg || Date.now().toString(36))
const html = readFileSync(file, 'utf8')
const next = html.replace(/(app\.js|styles\.css)\?v=[\w-]+/g, `$1?v=${version}`)
if (next === html && arg !== '--restore') throw new Error('app.js?v=... non trovato in index.html')
writeFileSync(file, next)
console.log(`app.js e styles.css ?v=${version}`)
