import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { app } from './app'

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  const spec = app.swagger()

  writeFile(
    resolve(__dirname, '..', '..', 'swagger.json'),
    JSON.stringify(spec, null, 2),
    'utf-8',
  )

  console.log('🚀 HTTP Server running on http://localhost:3333')
})
