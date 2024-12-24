import { LogOutIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function Profile() {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full">
        <AvatarImage
          className="h-full w-full object-cover"
          src="https://github.com/pedrolgcs.png"
          alt="Pedro H."
        />

        <AvatarFallback className="flex h-full w-full items-center justify-center bg-zinc-100 font-medium text-violet-500">
          PH
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col truncate">
        <span
          className={cn(
            'text-sm font-semibold text-zinc-700',
            'dark:text-zinc-100',
          )}
        >
          Pedro H.
        </span>
        <span
          className={cn('truncate text-sm text-zinc-500', 'dark:text-zinc-400')}
        >
          pedro.lg.cs@gmail.com
        </span>
      </div>

      <Button type="button" variant="ghost">
        <LogOutIcon className="h-5 w-5 text-zinc-500" />
      </Button>
    </div>
  )
}

export { Profile }
