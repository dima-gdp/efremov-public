import { getExistingApiInstance } from '~/api'
import { getSerializedData } from '~/services/json-api-serialize-adapter'

export default function usersAdapter() {
  /** Адаптер для создания user
   * @param {object} attrs - attributes
   * @param {object} [params] - query params
   * @return {Promise<User> | Promise<array>}
   */
  async function createUser(attrs, params) {
    const api = getExistingApiInstance()
    const serializedData = getSerializedData({
      type: 'registrations',
      data: attrs,
    })

    const { data } = await api.registrations.create(serializedData, params)
    return data
  }

  /** Адаптер для обновления user
   * @param {number|string} id - id
   * @param {object} attrs - attributes
   * @param {object} [params] - query params
   * @return {Promise<object>}
   */
  async function updateUser(id, attrs, params) {
    const api = getExistingApiInstance()
    const serializedData = getSerializedData({
      type: 'users',
      data: attrs,
    })

    const { data } = await api.users.update(id, serializedData, params)

    return data
  }

  /** Адаптер для создания изменения пароля
   * @param {object} attrs - attributes
   * @param {object} [params] - query params
   * @return {Promise<object>}
   */
  async function changePassword(attrs, params) {
    const api = getExistingApiInstance()
    const serializedData = getSerializedData({
      type: 'change-passwords',
      data: attrs,
    })

    const { data } = await api.changePasswords.create(serializedData, params)
    return data
  }

  return {
    createUser,
    updateUser,
    changePassword,
  }
}
