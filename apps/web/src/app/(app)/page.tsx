import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
      </Card>
    </div>
  )
}
