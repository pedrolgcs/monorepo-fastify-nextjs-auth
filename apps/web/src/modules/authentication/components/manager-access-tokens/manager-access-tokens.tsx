'use client'

import { EllipsisVerticalIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useGetTokensByAuthenticatedUser } from '@/http/hooks/use-get-tokens-by-authenticated-user'
import dayjs from '@/lib/day-js'

import { CopyTokenToClipboard } from './copy-token-to-clipboard'
import { RevokeToken } from './revoke-token'

export function ManagerAccessTokens() {
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
          <TableRow key={token.id}>
            <TableCell>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {token.status === 'active' ? (
                      <div className="size-3 rounded-full bg-emerald-600" />
                    ) : (
                      <div className="size-3 rounded-full bg-rose-600" />
                    )}
                  </TooltipTrigger>
                  <TooltipContent>{token.status}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>

            <TableCell>{token.device}</TableCell>

            <TableCell>
              {dayjs(token.createdAt).format('MMM D, YYYY')}
            </TableCell>

            <TableCell>
              {token.revoked ? (
                <Badge variant="destructive">YES</Badge>
              ) : (
                <Badge variant="secondary" color="">
                  NO
                </Badge>
              )}
            </TableCell>

            <TableCell>
              {dayjs(token.expiresAt).format('MMM D, YYYY')}
            </TableCell>

            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <EllipsisVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <CopyTokenToClipboard token={token} />
                    <RevokeToken token={token} />
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
