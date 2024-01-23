import { CART_OPEN_QUERY_PARAM } from '~/utils/constants'

export default function useCart() {
  function openCart({ store, route, router }) {
    // Важен порядок открытия корзины
    store.commit('cart/SET_IS_OPEN_CART', true)
    return router.push({
      query: {
        ...route.query,
        isOpenCart: true,
      },
    })
  }

  function getRouteQueryWithoutCart(query) {
    return Object.fromEntries(
      Object.entries(query).filter(([key]) => key !== CART_OPEN_QUERY_PARAM),
    )
  }

  return {
    openCart,
    getRouteQueryWithoutCart,
  }
}
