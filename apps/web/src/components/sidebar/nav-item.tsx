import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { tv } from 'tailwind-variants'

import { cn } from '@/lib/utils'

const navItem = tv({
  slots: {
    wrapper: cn('group flex items-center gap-3 rounded py-2 px-2'),
    text: cn(
      'font-medium text-muted-foreground transition group-hover:text-foreground',
    ),
    icon: cn('h-5 w-5 text-muted-foreground group-hover:text-foreground'),
  },

  variants: {
    variant: {
      active: {
        wrapper: cn('bg-gradient-to-l from-primary/10 rounded-md'),
        text: cn('text-foreground font-medium text-primary'),
        icon: cn('text-foreground font-medium text-primary'),
      },
    },
  },
})

type NavItemProps = {
  href: string
  icon?: React.ElementType
  children: React.ReactNode
}

function NavItem({ href, icon: Icon, children }: NavItemProps) {
  const pathname = usePathname()

  const variant =
    pathname === href
      ? 'active'
      : href.split('/').length > 2 && pathname.includes(href)
        ? 'active'
        : undefined

  const slots = navItem({ variant })

  return (
    <Link href={href} className={slots.wrapper()}>
      {Icon && <Icon className={slots.icon()} />}

      <span className={slots.text()}>{children}</span>
    </Link>
  )
}

export { NavItem }
