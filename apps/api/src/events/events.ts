import { EventEmitter } from 'events'

class EventAudit {
  private emitter: EventEmitter

  constructor() {
    this.emitter = new EventEmitter()
  }

  emit(event: string, data: unknown) {
    console.log(`📢 Emitindo evento: ${event}`, data)
    this.emitter.emit(event, data)
  }

  on(event: string, listener: (data: unknown) => Promise<void>) {
    this.emitter.on(event, async (data) => {
      try {
        await listener(data)
      } catch (error) {
        console.error(`❌ Erro ao processar evento ${event}:`, error)
      }
    })
  }
}

export const eventAudit = new EventAudit()
