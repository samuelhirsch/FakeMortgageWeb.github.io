import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'

/**
 * Must match GitHub Pages path: https://<user>.github.io/<repo-name>/
 * This repo is "FakeMortgageWeb.github.io" → base is `/FakeMortgageWeb.github.io/`
 * (not `/FakeMortgageWeb/` — that breaks asset URLs and you get a blank page.)
 *
 * Special case: repo named exactly `<username>.github.io` is served from site root → use `'/'`.
 */
const REPO_PAGES_PATH = '/FakeMortgageWeb.github.io/'

/** GitHub Pages serves 404.html for unknown paths — copy SPA entry so refreshes work. */
function githubPagesSpaFallback(): Plugin {
  let outDir = 'dist'
  return {
    name: 'github-pages-spa-fallback',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const index = resolve(process.cwd(), outDir, 'index.html')
      copyFileSync(index, resolve(process.cwd(), outDir, '404.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), githubPagesSpaFallback()],
  base: REPO_PAGES_PATH,
})
