import { getExistingApiInstance } from '~/api'
import CookieAdapter from '~/services/cookie-adapter'
import { TOKEN_KEY } from '~/domain/auth'

export default function useUser() {
  function logout(store, ability) {
    const { instance } = getExistingApiInstance()
    instance.setToken(null, 'Bearer')
    store.commit('user/RESET_AUTH')
    store.commit('cart/RESET_CART')
    store.commit('favorites/SET_PRODUCTS_COUNT', 0)
    ability.update([])
    document.cookie = CookieAdapter.deleteCookie(TOKEN_KEY)
  }

  return {
    logout,
  }
}
