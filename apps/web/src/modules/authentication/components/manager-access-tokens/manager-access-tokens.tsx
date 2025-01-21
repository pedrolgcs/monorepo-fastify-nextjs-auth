'use client'

import {
  ChevronsLeftIcon,
  ChevronsRightIcon,
  EllipsisVerticalIcon,
} from 'lucide-react'
import { parseAsInteger, useQueryState } from 'nuqs'

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
  const [page, setPge] = useQueryState('page', parseAsInteger.withDefault(1))

  const { data: tokensByAuthenticatedUser } = useGetTokensByAuthenticatedUser({
    page,
    pageSize: 5,
  })

  const isLastPage = tokensByAuthenticatedUser?.meta.totalPages === Number(page)

  const isFistPage = Number(page) === 1

  const handleNavigateToNextPage = () => {
    if (!tokensByAuthenticatedUser) return
    if (Number(page) > tokensByAuthenticatedUser.meta.totalPages) return
    const nextPage = Number(page) + 1
    setPge(nextPage)
  }

  const handleNavigateToPreviousPage = () => {
    if (Number(page) === 1) return
    const previousPage = Number(page) - 1
    setPge(previousPage)
  }

  return (
    <div className="space-y-4">
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
          {tokensByAuthenticatedUser?.tokens.map((token) => (
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          You're on page {page} of {tokensByAuthenticatedUser?.meta.totalPages},
          browsing a total of {tokensByAuthenticatedUser?.meta.totalCount}{' '}
          items.
        </p>

        <div className="flex flex-row items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNavigateToPreviousPage}
            disabled={isFistPage}
            data-testid="previous-page-button"
          >
            <ChevronsLeftIcon />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNavigateToNextPage}
            disabled={isLastPage}
            data-testid="next-page-button"
          >
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
