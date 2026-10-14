import { readFileSync } from 'node:fs'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'

// RSS feeds block browser requests (CORS); in production vercel.json does the same rewrite
const rssProxy = (target: string, path: string) => ({
  target,
  changeOrigin: true,
  rewrite: () => path,
})

const proxy = {
  '/rss/motorsport': rssProxy('https://www.motorsport.com', '/rss/f1/news/'),
  '/rss/autosport': rssProxy('https://www.autosport.com', '/rss/f1/news/'),
}

// `npm run preview` serves the production security headers from vercel.json, so they can be tested locally
const vercelConfig = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf-8'))
const securityHeaders: Record<string, string> = Object.fromEntries(
  vercelConfig.headers[0].headers.map((header: { key: string; value: string }) => [header.key, header.value])
)

// Serves the Vercel functions in api/ during `npm run dev` (they read their keys from .env.local)
const vercelFunctions = (): Plugin => ({
  name: 'vercel-functions',
  configureServer(server) {
    server.middlewares.use('/api/translate-news', async (req, res) => {
      const { GET } = await server.ssrLoadModule('/api/translate-news.ts')
      const response: Response = await GET(new Request(new URL(req.originalUrl ?? '', 'http://localhost')))
      res.statusCode = response.status
      response.headers.forEach((value, key) => res.setHeader(key, value))
      res.end(await response.text())
    })
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Server-side keys (no VITE_ prefix) are never exposed to the browser bundle
  const { DEEPL_API_KEY } = loadEnv(mode, process.cwd(), '')
  if (DEEPL_API_KEY && !process.env.DEEPL_API_KEY) process.env.DEEPL_API_KEY = DEEPL_API_KEY

  return {
    plugins: [react(), vercelFunctions()],
    server: { proxy },
    preview: { proxy, headers: securityHeaders },
  }
})
