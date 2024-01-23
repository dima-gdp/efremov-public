import { getExistingApiInstance } from '~/api'
import { getSerializedData } from '~/services/json-api-serialize-adapter'

export default function cartProductChangesAdapter() {
  /** Адаптер для создания изменения cartProduct
   * @param {object} attrs - attributes
   * @param {object} [params] - query params
   * @return {Promise<object>}
   */
  async function changeCartProduct(attrs, params) {
    const api = getExistingApiInstance()
    const serializedData = getSerializedData({
      type: 'cart-product-changes',
      data: attrs,
    })

    const { data } = await api.cartProductChanges.create(serializedData, params)

    return data
  }

  return {
    changeCartProduct,
  }
}
