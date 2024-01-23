import { getExistingApiInstance } from '~/api'
import { getSerializedData } from '~/services/json-api-serialize-adapter'

export default function cartMainsAdapter() {
  /** Адаптер для получения основных данных по корзине
   * @param {object} attrs - attributes
   * @param {object} [params] - query params
   * @return {Promise<object>}
   */
  async function getCartInfo(attrs, params) {
    const api = getExistingApiInstance()
    const serializedData = getSerializedData({
      type: 'cart-mains',
      data: attrs,
    })

    const { data } = await api.cartMains.create(serializedData, params)

    return data
  }

  return {
    getCartInfo,
  }
}
