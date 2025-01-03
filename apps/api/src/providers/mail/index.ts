import { env } from '@repo/env'

import { fakeMailClient } from './fake-mail'
import { resendMailClient } from './resend'

const providers = {
  resend: resendMailClient,
  fake: fakeMailClient,
}

export const mailClient = providers[env.MAIL_PROVIDER]
