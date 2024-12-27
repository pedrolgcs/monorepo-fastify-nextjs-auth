import {
  ChevronsLeftIcon,
  ChevronsRightIcon,
  CopyIcon,
  EllipsisVerticalIcon,
  Trash2Icon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LogOut } from '@/modules/authentication'
import { EditUserProfile, UserDetails } from '@/modules/user'

const MOCK_RESPONSE = [
  {
    id: '1',
    provider: 'Safari',
    status: 'active',
    created_at: '2023-05-26T12:00:00.000Z',
    expires_at: '2023-05-26T12:00:00.000Z',
    token: '1234567890',
  },
  {
    id: '2',
    provider: 'Chrome',
    status: 'revoked',
    created_at: '2023-05-26T12:00:00.000Z',
    expires_at: '2023-05-26T12:00:00.000Z',
    token: '1234567890',
  },
  {
    id: '3',
    provider: 'Chrome',
    status: 'active',
    created_at: '2023-05-26T12:00:00.000Z',
    expires_at: '2023-05-26T12:00:00.000Z',
    token: '1234567890',
  },
  {
    id: '4',
    provider: 'Firefox',
    status: 'revoked',
    created_at: '2023-05-26T12:00:00.000Z',
    expires_at: '2023-05-26T12:00:00.000Z',
    token: '1234567890',
  },
  {
    id: '5',
    provider: 'Firefox',
    status: 'revoked',
    created_at: '2023-05-26T12:00:00.000Z',
    expires_at: '2023-05-26T12:00:00.000Z',
    token: '1234567890',
  },
  {
    id: '6',
    provider: 'Firefox',
    status: 'revoked',
    created_at: '2023-05-26T12:00:00.000Z',
    expires_at: '2023-05-26T12:00:00.000Z',
    token: '1234567890',
  },
]

export default async function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-3xl rounded-xl">
        <CardHeader className="flex-row justify-between gap-4">
          <UserDetails />

          <div className="flex items-center gap-3">
            <EditUserProfile />
            <LogOut />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Created at</TableHead>
                <TableHead>Expires at</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {MOCK_RESPONSE.map((response) => (
                <TableRow key={response.id}>
                  <TableCell>
                    {response.status === 'active' ? (
                      <div className="size-3 rounded-full bg-emerald-600" />
                    ) : (
                      <div className="size-3 rounded-full bg-rose-600" />
                    )}
                  </TableCell>

                  <TableCell>{response.provider}</TableCell>

                  <TableCell>{response.created_at}</TableCell>

                  <TableCell>{response.expires_at}</TableCell>

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
                          <DropdownMenuItem>
                            <CopyIcon />
                            Copy
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2Icon />
                            Revoke Access
                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className="flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            list of all your authentication tokens
          </p>

          <div className="flex flex-row items-center gap-2">
            <Button variant="ghost" size="icon">
              <ChevronsLeftIcon />
            </Button>

            <Button variant="ghost" size="icon">
              <ChevronsRightIcon />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
