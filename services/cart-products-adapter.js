import { getExistingApiInstance } from '~/api'
import { getSerializedData } from '~/services/json-api-serialize-adapter'

const ENTITY = 'cart-products'

export default function cartProductsAdapter() {
  /** Адаптер для получения cart-products
   * @param {object} params - query params
   * @return {Promise<{cartProducts: array}>}
   */
  async function getCartProducts(params) {
    const api = getExistingApiInstance()
    const { data, meta } = await api.cartProducts.getMany(params)

    return {
      cartProducts: data,
      meta,
    }
  }

  /** Адаптер для получения cart-product
   * @param {string} id - query params
   * @param {object} [params] - query params
   * @return {Promise<object>}
   */
  async function getCartProduct(id, params) {
    const api = getExistingApiInstance()
    const { data } = await api.cartProducts.getOne(id, params)

    return data
  }

  /** Адаптер для обновления cart-product
   * @param {number|string} id - id
   * @param {object} attrs - attributes
   * @param {object} [params] - query params
   * @return {Promise<{cartProduct: object}>}
   */
  async function updateCartProduct(id, attrs, params) {
    const api = getExistingApiInstance()
    const serializedData = getSerializedData({
      type: ENTITY,
      data: attrs,
    })

    const { data } = await api.cartProducts.update(id, serializedData, params)

    return {
      cartProduct: data,
    }
  }

  /** Адаптер для удаления cart-product
   * @param {string|number} id
   * @return {Promise<void>}
   */
  async function deleteProduct(id) {
    const api = getExistingApiInstance()
    await api.cartProducts.delete(id)
  }

  return {
    getCartProducts,
    updateCartProduct,
    deleteProduct,
    getCartProduct
  }
}
