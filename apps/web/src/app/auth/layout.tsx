import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/modules/authentication'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const userAlreadyAuthenticated = await isAuthenticated()

  if (userAlreadyAuthenticated) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      {children}
    </div>
  )
}
