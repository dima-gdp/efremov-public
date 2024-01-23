import { getExistingApiInstance } from '~/api'
import { getSerializedData } from '~/services/json-api-serialize-adapter'

const ENTITY = 'cart-items'

export default function cartItemsAdapter() {
  /** Адаптер для получения cart-items
   * @param {object} params - query params
   * @return {Promise<{cartItems: array}>}
   */
  async function getCartItems(params) {
    const api = getExistingApiInstance()
    const { data } = await api.cartItems.getMany(params)

    return {
      cartItems: data,
    }
  }

  /** Адаптер для создания cart-item
   * @param {object} attrs - attributes
   * @param {object} [params] - query params
   * @return {Promise<{cartItem: object}>}
   */
  async function createCartItem(attrs, params) {
    const api = getExistingApiInstance()
    const serializedData = getSerializedData({
      type: ENTITY,
      data: attrs,
      extendedOptions: {
        cart: { ref: 'id' },
      },
    })

    const { data } = await api.cartItems.create(serializedData, params)

    return {
      cartItem: data,
    }
  }

  /** Адаптер для обновления cart-item
   * @param {number|string} id - id
   * @param {object} attrs - attributes
   * @param {object} [params] - query params
   * @return {Promise<{cartItem: object}>}
   */
  async function updateCartItem(id, attrs, params) {
    const api = getExistingApiInstance()
    const serializedData = getSerializedData({
      type: ENTITY,
      data: attrs,
      extendedOptions: {
        cart: { ref: 'id' },
      },
    })

    const { data } = await api.cartItems.update(id, serializedData, params)

    return {
      cartItem: data,
    }
  }


  /** Адаптер для удаления cart-item
   * @param {string|number} id
   * @return {Promise<void>}
   */
  async function deleteCartItem(id) {
    const api = getExistingApiInstance()
    await api.cartItems.delete(id)
  }

  return {
    createCartItem,
    getCartItems,
    updateCartItem,
    deleteCartItem,
  }
}
