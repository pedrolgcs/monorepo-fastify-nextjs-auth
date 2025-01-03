'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { signInWithEmail } from '@/http/requests/sign-in-with-email'
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

    await signInWithEmail({ email })
  },
  {
    onSuccess: () => {
      redirect('/auth/verify')
    },
  },
)
