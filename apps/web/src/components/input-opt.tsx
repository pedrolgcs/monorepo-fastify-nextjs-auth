import { SlotProps } from 'input-otp'

import { cn } from '@/lib/utils'
export * from 'input-otp'

export function FakeCaret() {
  return (
    <div className="pointer-events-none absolute inset-0 flex animate-caret-blink items-center justify-center">
      <div className="h-9 w-px bg-white" />
    </div>
  )
}

export function FakeDash() {
  return (
    <div className="flex w-10 items-center justify-center">
      <div className="h-1 w-3 rounded-full bg-border" />
    </div>
  )
}

export function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        'relative h-16 w-14 text-[2.5rem]',
        'flex items-center justify-center',
        'transition-all duration-300',
        'border-y border-r border-border first:rounded-l-md first:border-l last:rounded-r-md',
        'group-focus-within:border-accent-foreground/20 group-hover:border-accent-foreground/20',
        'outline outline-0 outline-accent-foreground/20',
        { 'outline-4 outline-accent-foreground': props.isActive },
      )}
    >
      <div className="group-has-[input[data-input-otp-placeholder-shown]]:opacity-20">
        {props.char?.toUpperCase() ?? props.placeholderChar}
      </div>
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  )
}
