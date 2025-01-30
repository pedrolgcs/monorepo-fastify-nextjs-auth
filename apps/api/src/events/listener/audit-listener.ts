import { eventAudit } from '../events'

async function withRetry(fn: () => Promise<void>, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await fn()
      return
    } catch (error) {
      console.error(`⚠️ Tentativa ${i + 1} falhou:`, error)
      if (i === retries - 1) throw error
    }
  }
}

eventAudit.on('audit', async (data) => {
  await withRetry(async () => {
    console.log('📜 Evento de auditoria recebido:', data)

    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log('✅ Auditoria salva no banco!')
  })
})
