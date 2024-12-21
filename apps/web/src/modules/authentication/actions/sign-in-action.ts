'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { actionClient } from '@/lib/safe-action'

const schema = z.object({
  email: z
    .string()
    .email({ message: 'Please, provide a valid email address.' }),
})

export const signInAction = actionClient.schema(schema).action(
  async (data) => {
    const {
      parsedInput: { email },
    } = data

    console.log(email)
    // POST IN SEND AUTHENTICATION CODE
  },
  {
    onSuccess: () => {
      redirect('/auth/verify')
    },
  },
)
