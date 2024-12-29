import { ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { LogOut, ManagerAccessTokens } from '@/modules/authentication'
import { EditUserProfile, UserDetails } from '@/modules/user'

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
          <ManagerAccessTokens />
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
