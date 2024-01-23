import { getExistingApiInstance } from '~/api'

export default function orderProductsAdapter() {
  /** Адаптер для получения продуктов заказа
   * @param {object} params
   * @return {Promise<object>}
   */
  async function getProducts(params) {
    const api = getExistingApiInstance()
    const { data, meta } = await api.orderProducts.getMany(params)

    return {
      data,
      page: meta.page,
    }
  }

  return {
    getProducts,
  }
}
