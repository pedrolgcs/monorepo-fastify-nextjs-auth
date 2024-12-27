import {
  type CookiesFn,
  deleteCookie as deleteCookieNext,
  getCookie as getCookieNext,
  getCookies as getCookiesNext,
  setCookie as setCookieNext,
} from 'cookies-next'

export const getCookie = async (key: string) => {
  let cookiesStore: CookiesFn | undefined

  if (typeof window === 'undefined') {
    const { cookies: serverCookies } = await import('next/headers')
    cookiesStore = serverCookies
  }

  return getCookieNext(key, { cookies: cookiesStore })
}

export const setCookie = async (key: string, value: string) => {
  return setCookieNext(key, value)
}

export const deleteCookie = async (key: string) => {
  let cookiesStore: CookiesFn | undefined

  if (typeof window === 'undefined') {
    const { cookies: serverCookies } = await import('next/headers')
    cookiesStore = serverCookies
  }

  return deleteCookieNext(key, { cookies: cookiesStore })
}

export const getCookies = async () => {
  let cookiesStore: CookiesFn | undefined

  if (typeof window === 'undefined') {
    const { cookies: serverCookies } = await import('next/headers')
    cookiesStore = serverCookies
  }

  return getCookiesNext({ cookies: cookiesStore })
}
