'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetProfile } from '@/http/hooks/use-get-profile'

export function UserDetails() {
  const {
    data: profile,
    isLoading: isLoadingOnGetProfile,
    isError: isErrorOnGetProfile,
    error: errorOnGetProfile,
  } = useGetProfile()

  if (isLoadingOnGetProfile) {
    return (
      <div className="space-y-1">
        <Skeleton className="h-7 w-[250px]" />
        <Skeleton className="h-5 w-[150px]" />
      </div>
    )
  }

  if (isErrorOnGetProfile) {
    return (
      <p className="text-sm font-semibold leading-none tracking-tight text-muted-foreground">
        {errorOnGetProfile.message}
      </p>
    )
  }

  return (
    <div className="space-y-1">
      <p className="text-2xl font-semibold leading-none tracking-tight">
        {profile?.name || '-'}
      </p>
      <span className="block text-sm text-muted-foreground">
        Software Engineer
      </span>
    </div>
  )
}
