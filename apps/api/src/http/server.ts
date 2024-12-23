import { writeFile } from 'node:fs/promises'
import path, { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { app } from './app'

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  const spec = app.swagger()

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  writeFile(
    resolve(__dirname, '..', '..', 'swagger.json'),
    JSON.stringify(spec, null, 2),
    'utf-8',
  )

  console.log('🚀 HTTP Server running on http://localhost:3333')
})
