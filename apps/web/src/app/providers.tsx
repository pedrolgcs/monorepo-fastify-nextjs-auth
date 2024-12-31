'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from 'sonner'

import { queryClient } from '@/lib/react-query'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
      >
        <NuqsAdapter>
          <Toaster position="top-right" richColors duration={3000} />
          {children}

          <ReactQueryDevtools initialIsOpen={false} />
        </NuqsAdapter>
      </NextThemesProvider>
    </QueryClientProvider>
  )
}
