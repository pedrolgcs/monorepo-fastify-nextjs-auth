'use client'

import { KeyRoundIcon, MenuIcon } from 'lucide-react'
import Link from 'next/link'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import { PrimaryMenu } from './primary-menu'
import { Profile } from './profile'
import { SecondaryMenu } from './secondary-menu'

export function Sidebar() {
  return (
    <Collapsible
      className={cn(
        'flex flex-col gap-6 border-b bg-secondary/30 p-4',
        'lg:fixed lg:inset-y-0 lg:w-[20rem] lg:border-b-0 lg:border-r lg:py-6',
      )}
    >
      <div className={cn('flex items-center justify-between', 'lg:py-2')}>
        <span
          className={cn(
            'flex w-full items-center justify-start gap-3 text-2xl font-semibold text-foreground',
            'lg:justify-center',
          )}
        >
          <Link href="/">Next OPT</Link>
          <KeyRoundIcon className="size-6 text-muted-foreground" />
        </span>

        <CollapsibleTrigger asChild className="lg:hidden">
          <button>
            <MenuIcon className="h-6 w-6" />
          </button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent
        forceMount
        className={cn(
          'flex flex-1 flex-col gap-3 divide-y-2 data-[state=closed]:hidden',
          'lg:divide-y-0 lg:data-[state=closed]:flex',
        )}
      >
        <PrimaryMenu />

        <div className="mt-auto flex flex-col gap-6">
          <SecondaryMenu />

          <Separator />

          <Profile />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
