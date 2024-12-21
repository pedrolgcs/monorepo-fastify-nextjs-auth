'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { verifyAuthenticationCode } from '@/http/requests/verify-authentication-code'
import { actionClient } from '@/lib/safe-action'

const schema = z.object({
  code: z.string().length(6, { message: 'Please, provide a valid code.' }),
})

export const verifyAuthenticationCodeAction = actionClient
  .schema(schema)
  .action(
    async (data) => {
      const {
        parsedInput: { code },
      } = data

      await verifyAuthenticationCode({ code })
    },
    {
      onSuccess: () => {
        redirect('/')
      },
    },
  )
