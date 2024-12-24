import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { Sidebar } from '@/components/sidebar'
import { cn } from '@/lib/utils'
import { isAuthenticated } from '@/modules/authentication'

export const metadata: Metadata = {
  title: 'Home',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const userIsAuthenticated = await isAuthenticated()

  if (!userIsAuthenticated) {
    redirect('/auth/sign-in')
  }

  return (
    <main>
      <div className={cn('min-h-screen', 'lg:grid-cols-app lg:grid')}>
        <Sidebar />
        <div className={cn('p-4', 'lg:col-start-2 lg:p-8')}>{children}</div>
      </div>
    </main>
  )
}
