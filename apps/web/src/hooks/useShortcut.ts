import { useEffect } from 'react'

type ShortcutOptions = {
  preventDefault?: boolean
  element?: HTMLElement | Window
}

type ShortcutCallback = () => void

const normalizeKey = (key: string) => key.toLowerCase()

export const useShortcut = (
  keys: string[],
  callback: ShortcutCallback,
  options: ShortcutOptions = {},
) => {
  const { preventDefault = true, element = window } = options

  useEffect(() => {
    const normalizedKeys = keys.map(normalizeKey)

    const handleKeyDown = (event: KeyboardEvent) => {
      const pressedKeys = new Set<string>()

      if (event.metaKey) pressedKeys.add('meta')
      if (event.ctrlKey) pressedKeys.add('control')
      if (event.altKey) pressedKeys.add('alt')
      if (event.shiftKey) pressedKeys.add('shift')

      pressedKeys.add(normalizeKey(event.key))

      const isMatch = normalizedKeys.every((key) => pressedKeys.has(key))

      if (isMatch) {
        if (preventDefault) event.preventDefault()
        callback()
      }
    }

    const listener = (event: Event) => {
      if (event instanceof KeyboardEvent) {
        handleKeyDown(event)
      }
    }

    element.addEventListener('keydown', listener)

    return () => {
      element.removeEventListener('keydown', listener)
    }
  }, [keys, callback, preventDefault, element])
}
