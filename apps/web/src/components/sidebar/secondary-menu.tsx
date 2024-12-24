'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { LifeBuoyIcon, SettingsIcon } from 'lucide-react'

import { NavGroupItem, NavGroupRoot } from './nav-group'
import { NavItem } from './nav-item'

function SecondaryMenu() {
  return (
    <Accordion.Root type="single" collapsible>
      <nav className="space-y-0.5">
        <NavItem href="#" icon={LifeBuoyIcon}>
          Support
        </NavItem>

        <NavGroupRoot value="setting" title="Setting" icon={SettingsIcon}>
          <NavGroupItem href="/settings">Account</NavGroupItem>
          <NavGroupItem href="#">Payments</NavGroupItem>
        </NavGroupRoot>
      </nav>
    </Accordion.Root>
  )
}

export { SecondaryMenu }
