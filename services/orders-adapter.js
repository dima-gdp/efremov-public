import { getExistingApiInstance } from '~/api'
import { getSerializedData } from '~/services/json-api-serialize-adapter'

export default function ordersAdapter() {
  /** Адаптер для создания заказа
   * @param {object} attrs
   * @param {object} [params]
   * @return {Promise<Object>}
   */
  async function createOrder(attrs, params) {
    const api = getExistingApiInstance()
    const serializedData = getSerializedData({
      type: 'orders',
      data: attrs,
      extendedOptions: {
        user: { ref: 'id' },
        cart: { ref: 'id' },
        'metal-insert-group': { ref: 'id' },
      },
    })

    const { data } = await api.orders.create(serializedData, params)

    return data
  }

  /** Адаптер для получения заказов
   * @param {object} params
   * @return {Promise<object>}
   */
  async function getOrders(params) {
    const api = getExistingApiInstance()
    const { data, meta } = await api.orders.getMany(params)

    return { orders: data, currentPage: meta.page.currentPage, lastPage: meta.page.lastPage }
  }

  /** Адаптер для получения заказов
   * @param {string|number} id
   * @param {object} params
   * @return {Promise<object>}
   */
  async function getOrder(id, params) {
    const api = getExistingApiInstance()
    const { data } = await api.orders.getOne(id, params)

    return data
  }

  return {
    createOrder,
    getOrders,
    getOrder,
  }
}
