import { LockKeyholeIcon } from 'lucide-react'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
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
  const { mutate: revokeRefreshToken } = useRevokeRefreshTokenMutation()

  const isDisabledToRevokeToken = token.isExpired || token.revoked

  const handleRevokeToken = (e: Event) => {
    e.preventDefault()
    revokeRefreshToken({ refreshTokenId: token.id })
  }

  return (
    <DropdownMenuItem
      onSelect={handleRevokeToken}
      disabled={isDisabledToRevokeToken}
    >
      <LockKeyholeIcon />
      Revoke Access
    </DropdownMenuItem>
  )
}
