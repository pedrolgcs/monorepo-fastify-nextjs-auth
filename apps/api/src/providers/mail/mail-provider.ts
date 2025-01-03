import type { Templates } from './views'

export type SendMailParams = {
  to: {
    name?: string
    email: string[]
  }
  subject: string
  template: Templates
}

export abstract class MailProvider {
  abstract sendEmail(params: SendMailParams): Promise<unknown>
}
