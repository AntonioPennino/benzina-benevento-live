// Icone: invece di scaricare tutto Font Awesome (~150 kB) il sito tiene solo le icone che usa davvero.
// Cerca le classi "fa-..." in index.html e nei .js di public/, crea i font ridotti in public/vendor/fa/
// (il nome contiene un'impronta del contenuto: si possono tenere in cache per sempre) e src/icons.css,
// che entra in styles.css. Gira da solo con "npm run build:css": un'icona nuova nel codice basta aggiungerla lì.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, mkdtempSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { fontawesomeSubset } = require('fontawesome-subset')
const meta = require('@fortawesome/fontawesome-free/metadata/icon-families.json')

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const pub = join(root, 'public')
const sources = ['index.html', ...readdirSync(pub).filter(f => f.endsWith('.js'))].map(f => readFileSync(join(pub, f), 'utf8')).join('\n')

const freeStyles = (name) => (meta[name]?.familyStylesByLicense?.free || []).filter(s => s.family === 'classic').map(s => s.style)
const names = [...new Set([...sources.matchAll(/\bfa-([a-z0-9-]+)/g)].map(m => m[1]))].filter(n => freeStyles(n).length).sort()
const regular = [...new Set([...sources.matchAll(/\bfa-regular\s+fa-([a-z0-9-]+)/g)].map(m => m[1]))].filter(n => freeStyles(n).includes('regular')).sort()
const solid = names.filter(n => freeStyles(n).includes('solid'))

const tmp = mkdtempSync(join(tmpdir(), 'fa-'))
await fontawesomeSubset({ solid, regular }, tmp, { package: 'free', targetFormats: ['woff2'] })
const out = join(pub, 'vendor', 'fa')
rmSync(out, { recursive: true, force: true }); mkdirSync(out, { recursive: true })
const files = {}
for (const [style, weight, base] of [['solid', 900, 'fa-solid-900'], ['regular', 400, 'fa-regular-400']]) {
  const data = readFileSync(join(tmp, `${base}.woff2`))
  files[style] = { weight, name: `${base}.${createHash('sha256').update(data).digest('hex').slice(0, 8)}.woff2` }
  writeFileSync(join(out, files[style].name), data)
}
rmSync(tmp, { recursive: true, force: true })

const css = `/* Generato da scripts/build-icons.mjs: non modificare a mano. Font Awesome Free 6.5.1 (font: SIL OFL 1.1, icone: CC BY 4.0) */
${Object.values(files).map(f => `@font-face{font-family:"Font Awesome 6 Free";font-style:normal;font-weight:${f.weight};font-display:block;src:url(/vendor/fa/${f.name}) format("woff2")}`).join('\n')}
.fa-solid,.fa-regular{font-family:"Font Awesome 6 Free";-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:inline-block;font-style:normal;font-variant:normal;line-height:1;text-rendering:auto}
.fa-solid{font-weight:900}.fa-regular{font-weight:400}
.fa-spin{animation:fa-spin 2s linear infinite}@keyframes fa-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.fa-spin{animation:none}}
${names.map(n => `.fa-${n}:before{content:"\\${meta[n].unicode}"}`).join('\n')}
`
writeFileSync(join(root, 'src', 'icons.css'), css)

// il font principale si chiede subito (preload in index.html, col nome nuovo)
const indexPath = join(pub, 'index.html')
const html = readFileSync(indexPath, 'utf8')
const next = html.replace(/\/vendor\/fa\/fa-solid-900\.[a-f0-9]+\.woff2/g, `/vendor/fa/${files.solid.name}`)
if (!next.includes(files.solid.name)) throw new Error('preload del font delle icone non trovato in index.html')
writeFileSync(indexPath, next)
console.log(`icone: ${solid.length} piene, ${regular.length} vuote → ${files.solid.name}, ${files.regular.name}`)
