import cookie from 'cookie'

const EMPTY_VALUE = 'EMPTY_VALUE'

export default class CookieAdapter {
  static getCookie(rawCookie) {
    return cookie.parse(rawCookie)
  }

  static setCookie({ key, value, options }) {
    return cookie.serialize(key, value, options)
  }

  static deleteCookie(key) {
    return cookie.serialize(key, EMPTY_VALUE, {
      maxAge: 0,
      path: '/',
    })
  }

}
