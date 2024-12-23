import { customAlphabet } from 'nanoid'

export function generateOPTCode(): string {
  const customNanoid = customAlphabet('0123456789ABCDF', 8)
  return customNanoid()
}
