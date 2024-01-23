import { getExistingApiInstance } from '~/api'
import { getSerializedData } from '~/services/json-api-serialize-adapter'

export default function cartsAdapter() {
  /** Адаптер для получения списка корзин
   * @param {object} params - query params
   * @return {Promise<{carts: Cart[]}>}
   */
  async function getCarts(params) {
    const api = getExistingApiInstance()
    const { data } = await api.carts.getMany(params)

    return {
      carts: data,
    }
  }

  /** Адаптер для получения одной корзины
   * @param {String|Number} cartId
   * @return {Promise<object>}
   */
  async function getCart(cartId) {
    const api = getExistingApiInstance()
    const { data } = await api.carts.getOne(cartId)

    return data
  }

  /** Адаптер для создания корзины на беке
   * @param {object} attrs
   * @param {object} [params]
   * @return {Promise<Cart>}
   */
  async function createCart(attrs, params) {
    const api = getExistingApiInstance()
    const serializedData = getSerializedData({
      type: 'carts',
      data: attrs,
      extendedOptions: {
        user: { ref: 'id' },
      },
    })

    const { data } = await api.carts.create(serializedData, params)

    return data
  }

  /** Адаптер для обновления корзины
   * @param {number|string} id - id
   * @param {object} attrs - attributes
   * @param {object} [params] - query params
   * @return {Promise<object>}
   */
  async function updateCart(id, attrs, params) {
    const api = getExistingApiInstance()
    const serializedData = getSerializedData({
      type: 'carts',
      data: attrs,
      extendedOptions: {
        cart: { ref: 'id' },
      },
    })

    const { data } = await api.carts.update(id, serializedData, params)

    return data
  }

  return {
    createCart,
    getCarts,
    getCart,
    updateCart,
  }
}
