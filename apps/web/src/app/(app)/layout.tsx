import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/modules/authentication'

export const metadata: Metadata = {
  title: 'Home',
}

export default async function RootLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode
  sheet: React.ReactNode
}>) {
  const userIsAuthenticated = await isAuthenticated()

  if (!userIsAuthenticated) {
    redirect('/auth/sign-in')
  }

  return (
    <>
      <main>{children}</main>
      {sheet}
    </>
  )
}
