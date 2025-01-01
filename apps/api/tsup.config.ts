import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src'],
  splitting: false,
  sourcemap: true,
  format: ['esm'],
  clean: true,
  noExternal: ['@repo/env'],
  loader: {
    '.pug': 'copy',
  },
})
