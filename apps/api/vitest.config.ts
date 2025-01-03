import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ['data', 'node_modules'],
    globals: true,
    root: './',
  },
  plugins: [tsConfigPaths()],
})
