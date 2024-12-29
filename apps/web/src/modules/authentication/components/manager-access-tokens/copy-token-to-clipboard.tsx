import { CopyCheckIcon, CopyIcon } from 'lucide-react'
import { useState } from 'react'

import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu'

type CopyTokenToClipboardProps = {
  token: {
    token: string
  }
}

export function CopyTokenToClipboard({ token }: CopyTokenToClipboardProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyTokenToClipboard = (e: Event) => {
    e.preventDefault()
    setIsCopied(true)

    navigator.clipboard.writeText(token.token)

    setTimeout(() => {
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    })
  }

  return (
    <DropdownMenuItem onSelect={handleCopyTokenToClipboard}>
      {isCopied ? (
        <div className="flex items-center gap-2">
          <CopyCheckIcon />
          Copied
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <CopyIcon />
          Copy
        </div>
      )}

      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
  )
}
