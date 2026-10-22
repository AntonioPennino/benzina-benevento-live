// Pubblicazione a mano (npm run deploy): stessa versione di app.js che userebbe GitHub Actions,
// poi index.html torna com'era.
import { execSync } from 'node:child_process'

const run = (cmd) => execSync(cmd, { stdio: 'inherit' })
run('node scripts/stamp-version.mjs')
try {
  run('npx wrangler pages deploy --branch main --commit-dirty=true')
} finally {
  run('node scripts/stamp-version.mjs --restore')
}
