import { Building2Icon, HomeIcon } from 'lucide-react'

import { Accordion } from '@/components/ui/accordion'

import { NavItem } from './nav-item'

function PrimaryMenu() {
  return (
    <Accordion type="single" collapsible>
      <nav className="space-y-2">
        <NavItem href="/" icon={HomeIcon}>
          Home
        </NavItem>

        <NavItem href="/account" icon={Building2Icon}>
          Organizations
        </NavItem>
      </nav>
    </Accordion>
  )
}

export { PrimaryMenu }
