import cartsAdapter from '~/services/carts-adapter'
import { PRICE_TYPES } from '~/domain/carts'

export default function useCarts() {
  /**
   * Получает с бека корзину
   * @param {string|number} userId
   * @return {Promise<Cart>}
   */
  async function defineUserCart(userId) {
    const { carts } = await cartsAdapter().getCarts({ filter: { userId } })
    if (carts[0]) {
      return { ...carts[0], priceType: PRICE_TYPES.main.id }
    }

    const cart = await cartsAdapter().createCart({
      user: { id: userId },
    })

    if (cart) {
      return { ...cart, priceType: PRICE_TYPES.main.id }
    }
  }



  return {
    defineUserCart,
  }
}
