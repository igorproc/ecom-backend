export const getCookieFromRaw = (rawCookies: string, findCookie: string) => {
  if (!rawCookies || !rawCookies.length || !findCookie.length) {
    return null
  }

  const regex = new RegExp(findCookie + '=[^;]*', 'gi')
  const matchedString = rawCookies.match(regex)
  if (!matchedString || !matchedString.length) {
    return
  }

  return matchedString[0].split('=')[1]
}
