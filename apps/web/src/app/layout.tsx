import './globals.css'

import { Providers } from './providers'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className="bg-primary-foreground text-primary antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
