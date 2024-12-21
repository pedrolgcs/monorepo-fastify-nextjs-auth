'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useAction } from 'next-safe-action/hooks'
import { Fragment, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { FakeDash, OTPInput, Slot } from '@/components/input-opt'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { verifyAuthenticationCodeAction } from '../actions/verify-authentication-code-action'

const authenticateFormSchema = z.object({
  code: z.string(),
})

type AuthenticateForm = z.infer<typeof authenticateFormSchema>

export function VerifyAuthenticationCode() {
  const formRef = useRef<HTMLFormElement>(null)

  const { handleSubmit, control, reset } = useForm<AuthenticateForm>({
    resolver: zodResolver(authenticateFormSchema),
  })

  const { executeAsync } = useAction(verifyAuthenticationCodeAction, {
    onError: ({ error }) => {
      toast.error(error.serverError)
      reset()
    },
  })

  const handleAuthenticate = async (data: AuthenticateForm) => {
    const { code } = data

    toast.promise(
      async () => {
        await executeAsync({
          code,
        })
      },
      {
        loading: 'Checking your code...',
      },
    )
  }

  return (
    <form
      className="flex flex-col gap-4"
      ref={formRef}
      onSubmit={handleSubmit(handleAuthenticate)}
    >
      <h1 className="text-center text-2xl font-bold">Verify your code</h1>

      <div className="mt-4 flex items-start justify-between gap-4">
        <span className="flex font-bold">Authentication code</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>What is this?</TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[300px] text-sm leading-tight">
                We sent a 6-digit code to your email. Enter the code below to
                confirm your account.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Controller
        name="code"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <OTPInput
            autoFocus
            maxLength={6}
            textAlign="center"
            containerClassName="group flex items-center has-[:disabled]:opacity-30"
            onComplete={() => formRef.current?.requestSubmit()}
            {...field}
            render={({ slots }) => (
              <Fragment>
                <div className="flex">
                  {slots.slice(0, 3).map((slot, idx) => (
                    <Slot key={idx} {...slot} />
                  ))}
                </div>

                <FakeDash />

                <div className="flex">
                  {slots.slice(3).map((slot, idx) => (
                    <Slot key={idx} {...slot} />
                  ))}
                </div>
              </Fragment>
            )}
          />
        )}
      />

      <Separator className="w-full" />

      <Button type="button" variant="link" size="lg" asChild>
        <Link href="/auth/sign-in">Didn't get the code? Try again</Link>
      </Button>

      <span className="flex items-center">
        <div className="h-px flex-1 bg-secondary"></div>
        <span className="px-4 text-gray-500 dark:text-gray-400">or</span>
        <div className="h-px flex-1 bg-secondary"></div>
      </span>

      <Button type="submit" className="w-full" variant="secondary" disabled>
        sign in with Google
      </Button>
    </form>
  )
}