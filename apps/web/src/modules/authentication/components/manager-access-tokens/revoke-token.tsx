import { LoaderCircleIcon, LockKeyholeIcon } from 'lucide-react'

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
import { useRevokeRefreshTokenMutation } from '@/http/hooks/use-revoke-refresh-token-mutation'

type TokenRowProps = {
  token: {
    id: string
    token: string
    revoked: boolean
    isExpired: boolean
  }
}

export function RevokeToken({ token }: TokenRowProps) {
  const { mutate: revokeRefreshToken, isPending: isPendingOnRevokeToken } =
    useRevokeRefreshTokenMutation()

  const isDisabledToRevokeToken = token.isExpired || token.revoked

  const handleRevokeToken = async () => {
    revokeRefreshToken(
      { refreshTokenId: token.id },
      {
        onSuccess: () => {
          setTimeout(() => {
            document.activeElement?.dispatchEvent(
              new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
            )
          }, 300)
        },
      },
    )
  }

  if (isPendingOnRevokeToken) {
    return (
      <DropdownMenuItem disabled>
        <LoaderCircleIcon className="animate-spin" />
        Revoke Access
      </DropdownMenuItem>
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault()
          }}
          disabled={isDisabledToRevokeToken}
        >
          <LockKeyholeIcon />
          Revoke Access
          <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
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
