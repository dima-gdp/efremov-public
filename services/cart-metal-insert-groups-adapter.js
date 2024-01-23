import { getExistingApiInstance } from '~/api'
import { getSerializedData } from '~/services/json-api-serialize-adapter'

export default function cartMetalInsertGroupsAdapter() {
  /** Адаптер для получения cart-metal-insert-groups
   * @param {object} [params] - query params
   * @return {Promise<array>}
   */
  async function getCartGroups(params) {
    const api = getExistingApiInstance()
    const { data } = await api.cartMetalInsertGroups.getMany(params)

    return data
  }

  /** Адаптер для получения cart-metal-insert-groups
   * @param {string} id - query params
   * @param {object} [params] - query params
   * @return {Promise<object>}
   */
  async function getGroup(id, params) {
    const api = getExistingApiInstance()
    const { data } = await api.cartMetalInsertGroups.getOne(id, params)

    return data
  }

  /** Адаптер для обновления cart-metal-insert-groups
   * @param {number|string} id - id
   * @param {object} attrs - attributes
   * @param {object} [params] - query params
   * @return {Promise<object>}
   */
  async function updateCartGroups(id, attrs, params) {
    const api = getExistingApiInstance()
    const serializedData = getSerializedData({
      type: 'cart-metal-insert-groups',
      data: attrs,
    })

    const { data } = await api.cartMetalInsertGroups.update(id, serializedData, params)

    return data
  }

  return {
    getCartGroups,
    updateCartGroups,
    getGroup,
  }
}
