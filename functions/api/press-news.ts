// Pages Function di Cloudflare (/api/press-news), portata dalla versione Vercel:
// stessa logica di feed, filtri e ordinamento. La risposta resta in cache
// sull'edge per 15 minuti tramite la Cache API.

interface PressItem {
  title: string
  link: string
  source: string
  publishedAt: number | null
  summary: string
}

const FEEDS = [
  { source: 'NTR24', url: 'https://www.ntr24.tv/feed/' },
  { source: 'Il Sannio Quotidiano', url: 'https://www.ilsannioquotidiano.it/feed/' },
  { source: 'Google News', url: 'https://news.google.com/rss/search?q=benevento+(carburante+OR+benzina+OR+distributori+OR+gasolio+OR+tir+OR+autotrasportatori)+when:7d&hl=it&gl=IT&ceid=IT:it' },
]

const KEYWORDS = /carburant|benzin|gasolio|diesel|distribut|pomp[ae]|rifornim|\btir\b|autotrasport|camionist|presidi|blocc|sciopero|gpl|metano|accise/i
const MAX_ITEMS = 12
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

function decode(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

function tag(xml: string, name: string): string {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'))
  return m ? decode(m[1]) : ''
}

async function fetchFeed(feed: { source: string; url: string }): Promise<PressItem[]> {
  const res = await fetch(feed.url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (BenzinaBeneventoLive)' },
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`${feed.source}: HTTP ${res.status}`)
  const xml = await res.text()
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || []
  return items.map((raw) => {
    let title = tag(raw, 'title')
    let source = feed.source
    const gSource = tag(raw, 'source')
    if (gSource) {
      source = gSource
      title = title.replace(new RegExp(`\\s+-\\s+${gSource.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), '')
    }
    const date = Date.parse(tag(raw, 'pubDate'))
    return {
      title,
      link: tag(raw, 'link'),
      source,
      publishedAt: Number.isNaN(date) ? null : date,
      summary: tag(raw, 'description').slice(0, 220),
    }
  })
}

const CACHE_TTL_S = 900

async function buildResponse(): Promise<Response> {
  const results = await Promise.allSettled(FEEDS.map(fetchFeed))
  const now = Date.now()
  const seen = new Set<string>()
  const items = results
    .flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
    .filter((it) => it.title && it.link && KEYWORDS.test(`${it.title} ${it.summary}`))
    .filter((it) => !it.publishedAt || now - it.publishedAt < MAX_AGE_MS)
    .filter((it) => {
      const k = it.title.toLowerCase().slice(0, 60)
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
    .sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0))
    .slice(0, MAX_ITEMS)

  return Response.json(
    { updatedAt: now, items },
    { headers: { 'Cache-Control': `public, max-age=60, s-maxage=${CACHE_TTL_S}` } },
  )
}

export const onRequestGet = async (context: {
  request: Request
  waitUntil: (p: Promise<unknown>) => void
}): Promise<Response> => {
  const cache = (caches as unknown as { default: Cache }).default
  const key = new Request(new URL('/api/press-news', context.request.url).toString())
  const cached = await cache.match(key)
  if (cached) return cached

  const res = await buildResponse()
  context.waitUntil(cache.put(key, res.clone()))
  return res
}
