import type { MailProvider, SendMailParams } from './mail-provider'

class MailClient implements MailProvider {
  private inbox: Record<string, string[]> = {}

  async sendEmail(params: SendMailParams): Promise<void> {
    const { to, subject, template } = params

    to.email.forEach((email) => {
      if (!this.inbox[email]) {
        this.inbox[email] = []
      }

      this.inbox[email].push(`Subject: ${subject}\n\n${template}`)
    })
  }
}

export const fakeMailClient = new MailClient()
