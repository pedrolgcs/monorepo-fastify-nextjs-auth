'use client'

import {
  CopyCheckIcon,
  CopyIcon,
  EllipsisVerticalIcon,
  Trash2Icon,
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import dayjs from '@/lib/day-js'

type UserTokenRowProps = {
  token: {
    id: string
    token: string
    revoked: boolean
    device: string | null
    ipAddress: string | null
    createdAt: string
    expiresAt: string
    isExpired: boolean
    userId: string
    status: 'active' | 'disabled'
  }
}

export function UserTokenRow({ token }: UserTokenRowProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [openActions, setOpenActions] = useState(false)

  const handleCopyTokenToClipboard = (e: Event) => {
    e.preventDefault()
    setIsCopied(true)

    navigator.clipboard.writeText(token.token)

    setTimeout(() => {
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    })
  }

  return (
    <TableRow>
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

      <TableCell>{dayjs(token.createdAt).format('MMM D, YYYY')}</TableCell>

      <TableCell>
        {token.revoked ? (
          <Badge variant="destructive">YES</Badge>
        ) : (
          <Badge variant="secondary" color="">
            NO
          </Badge>
        )}
      </TableCell>

      <TableCell>{dayjs(token.expiresAt).format('MMM D, YYYY')}</TableCell>

      <TableCell className="text-right">
        <DropdownMenu open={openActions} onOpenChange={setOpenActions}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={handleCopyTokenToClipboard}>
                {isCopied ? (
                  <div className="flex items-center gap-2">
                    <CopyCheckIcon />
                    Copied
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CopyIcon />
                    Copy
                  </div>
                )}
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem disabled={token.isExpired || token.revoked}>
                <Trash2Icon />
                Revoke Access
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
