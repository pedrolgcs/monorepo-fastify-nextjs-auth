import { KEYS } from '@/constants/cookies-key'
import { getCookie } from '@/lib/cookies'

export async function isAuthenticated() {
  const token = await getCookie(KEYS.TOKEN)
  const refreshToken = await getCookie(KEYS.REFRESH_TOKEN)

  return Boolean(refreshToken || token)
}
