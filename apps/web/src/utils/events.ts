export function dispatchKeyboardEvent(key: string, target: Element) {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
}
