'use client'

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useGetTokensByAuthenticatedUser } from '@/http/hooks/use-get-tokens-by-authenticated-user'

import { UserTokenRow } from './user-token.row'

export function UserTokens() {
  const { data: tokensByAuthenticatedUser } = useGetTokensByAuthenticatedUser()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Created at</TableHead>
          <TableHead>Revoked</TableHead>
          <TableHead>Expires at</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {tokensByAuthenticatedUser?.map((token) => (
          <UserTokenRow token={token} key={token.id} />
        ))}
      </TableBody>
    </Table>
  )
}
