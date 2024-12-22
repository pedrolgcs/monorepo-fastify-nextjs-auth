import crypto from 'node:crypto'

export function generateOPTCode(): string {
  return crypto.randomInt(10000000, 100000000).toString()
}
