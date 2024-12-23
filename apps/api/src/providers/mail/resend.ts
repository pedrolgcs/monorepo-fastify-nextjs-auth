import path from 'node:path'
import { fileURLToPath } from 'node:url'

import pug from 'pug'
import { type CreateEmailResponse, Resend } from 'resend'

import type { Templates } from './views'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const VIEWS_PATH = path.resolve(__dirname, 'views')

type SendMailParams = {
  to: {
    name?: string
    email: string[]
  }
  subject: string
  template: Templates
}

class MailClient {
  private _client: Resend

  constructor() {
    this._client = new Resend('re_K9srbDD4_DMt43krjyPP1AtZGXCYcLbSD')
  }

  async sendEmail(params: SendMailParams): Promise<CreateEmailResponse> {
    const { to, subject, template } = params

    const response = await this._client.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: to.email,
      subject,
      html: pug.renderFile(
        path.join(VIEWS_PATH, template.file.concat('.pug')),
        template.variables,
      ),
    })

    return response
  }
}

export const resendMailClient = new MailClient()