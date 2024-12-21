'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { InputError } from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { signInAction } from '../actions/sign-in-action'

const signInFormSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please, provide a valid email address.' }),
})

type SignInForm = z.infer<typeof signInFormSchema>

export function SignIn() {
  const { isPending, executeAsync } = useAction(signInAction, {
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  const { register, handleSubmit, formState } = useForm<SignInForm>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: 'pedro@gmail.com',
    },
  })

  const handleSignIn = async (data: SignInForm) => {
    const { email } = data

    await executeAsync({
      email,
    })
  }

  return (
    <form className="w-full space-y-4" onSubmit={handleSubmit(handleSignIn)}>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          placeholder="johndoe@gmail.com"
          {...register('email')}
        />
        {formState.errors.email?.message && (
          <InputError error={formState.errors.email?.message} />
        )}
      </div>

      {isPending ? (
        <Button type="submit" className="w-full" disabled={isPending}>
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
        </Button>
      ) : (
        <Button type="submit" className="w-full" disabled={isPending}>
          sign in with e-mail
        </Button>
      )}

      <span className="flex items-center">
        <div className="h-px flex-1 bg-secondary"></div>
        <span className="px-4 text-gray-500 dark:text-gray-400">OR</span>
        <div className="h-px flex-1 bg-secondary"></div>
      </span>

      <Button type="submit" className="w-full" variant="secondary" disabled>
        sign in with Google
      </Button>
    </form>
  )
}
