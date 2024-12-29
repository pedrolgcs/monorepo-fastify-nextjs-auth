'use client'

import { LoaderCircleIcon, LogOutIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useLogoutMutation } from '@/http/hooks/use-logout-mutation'
import { deleteCookie } from '@/lib/cookies'

export function LogOut() {
  const router = useRouter()
  const { mutate: logout, isPending: isPendingOnLogout } = useLogoutMutation()

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        deleteCookie('token')
        router.push('/auth/sign-in')
      },
    })
  }

  if (isPendingOnLogout) {
    return (
      <Button variant="destructive" size="sm" disabled>
        <LoaderCircleIcon className="spin size-3 animate-spin" />
      </Button>
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <LogOutIcon className="size-3" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will log you out of your account.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
