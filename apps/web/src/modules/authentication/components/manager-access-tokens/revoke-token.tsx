import { LoaderCircleIcon, LockKeyholeIcon } from 'lucide-react'
import { useState } from 'react'

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
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu'
import { useShortcut } from '@/hooks/useShortcut'
import { useRevokeRefreshTokenMutation } from '@/http/hooks/use-revoke-refresh-token-mutation'
import { dispatchKeyboardEvent } from '@/utils/events'

type TokenRowProps = {
  token: {
    id: string
    token: string
    revoked: boolean
    isExpired: boolean
  }
}

export function RevokeToken({ token }: TokenRowProps) {
  const [openRevokeConfirm, setOpenRevokeConfirm] = useState(false)

  const { mutate: revokeRefreshToken, isPending: isPendingOnRevokeToken } =
    useRevokeRefreshTokenMutation()

  const isDisabledToRevokeToken = token.isExpired || token.revoked

  const handleRevokeToken = async () => {
    if (isDisabledToRevokeToken) return

    revokeRefreshToken(
      { id: token.id },
      {
        onSuccess: () => {
          setTimeout(() => {
            dispatchKeyboardEvent('Escape', document.body)
          }, 300)
        },
      },
    )
  }

  useShortcut(['Shift', 'Meta', 'D'], () => {
    setOpenRevokeConfirm(true)
  })

  if (isPendingOnRevokeToken) {
    return (
      <DropdownMenuItem disabled>
        <LoaderCircleIcon className="animate-spin" />
        Revoke Access
      </DropdownMenuItem>
    )
  }

  return (
    <AlertDialog open={openRevokeConfirm} onOpenChange={setOpenRevokeConfirm}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault()
          }}
          disabled={isDisabledToRevokeToken}
        >
          <LockKeyholeIcon />
          Revoke Access
          <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
        </DropdownMenuItem>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently revoke the
            access token.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRevokeToken}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
