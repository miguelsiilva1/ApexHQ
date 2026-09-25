import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
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

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy, headers: securityHeaders },
})
