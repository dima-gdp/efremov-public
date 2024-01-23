// В следующий раз убрать зависимость от юз функции
import authAdapter from '~/services/auth-adapter'
import CookieAdapter from '~/services/cookie-adapter'
import { getExistingApiInstance } from '~/api'

export const TOKEN_KEY = 'X-AUTH-TOKEN'
const MAX_AGE = 31557600

export default class Auth {
  _store

  constructor(store) {
    this._store = store
  }

  /** Ставим куку токен сроком на 1 год
   * @param {string} token
   */
  static setAuthCookie(token) {
    document.cookie = CookieAdapter.setCookie({
      key: TOKEN_KEY,
      value: token,
      options: { path: '/', maxAge: MAX_AGE },
    })
  }

  /**
   * @returns {string} - Возвращает куки без токена
   */
  static deleteAuthCookieByServer() {
    return CookieAdapter.deleteCookie(TOKEN_KEY)
  }

  /**
   * @returns {string} - Возвращает куки без токена
   */
  static deleteAuthCookieByClient() {
    document.cookie = CookieAdapter.deleteCookie(TOKEN_KEY)
  }

  /**
   * @param {string} login
   * @param {string} password
   */
  async authClient(login, password) {
    const { token, userData } = await authAdapter().authenticate(login, password)
    if (!token) {
      throw new Error('Не удалось получить токен')
    }
    const { instance } = getExistingApiInstance()
    instance.setToken(token, 'Bearer')
    this._store.commit('user/SET_AUTH', { token, userData })
    Auth.setAuthCookie(token)
  }

  /**
   * @param {string} rawCookie - Сырые куки с браузера
   * @returns {(string|undefined)} - Вернет токен или undefined
   */
  static getAuthCookie(rawCookie) {
    const cookie = CookieAdapter.getCookie(rawCookie)
    return cookie[TOKEN_KEY]
  }

  /**
   * @param {string} cookie - Сырые куки с браузера
   * @param {function} onFailAuth - Вызовет Callback если не удалось авторизоваться
   */
  async authServer(cookie = '', onFailAuth) {
    try {
      // TODO: скидываем токен, на серваке общий api-instance, починить бы
      const { instance } = getExistingApiInstance()
      instance.setToken(null, 'Bearer')
      const token = Auth.getAuthCookie(cookie)
      if (!token) return
      // Есть токен в куках
      const { isActive, userData } = await authAdapter().checkAuth(token)
      // Если токен не активный
      if (!isActive) {
        this._store.commit('user/RESET_AUTH')
        onFailAuth()
        return
      }
      // Если токен активный
      instance.setToken(token, 'Bearer')
      this._store.commit('user/SET_AUTH', { token, userData })
    } catch (e) {
      this._store.commit('user/RESET_AUTH')
      onFailAuth()
      console.error(e)
    }
  }
}
