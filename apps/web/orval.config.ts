import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: '../api/swagger.json',
    output: {
      target: './src/http/generated/orval',
      client: 'zod',
      mode: 'tags',
      httpClient: 'fetch',
    },
  },
})
