import { getExistingApiInstance } from '~/api'
import { getSerializedData } from '~/services/json-api-serialize-adapter'

export default function userProfileAdapter() {
  /** Адаптер для получения user-profile
   * @param {string} id - query params
   * @param {object} [params] - query params
   * @return {Promise<object>}
   */
  async function getUserProfile(id, params) {
    const api = getExistingApiInstance()
    const { data } = await api.userProfiles.getOne(id, params)

    return data
  }

  /** Адаптер для получения списка user-profile
   * @param {object} [params] - query params
   * @return {Promise<{data: array}>}
   */
  async function getUserProfiles(params) {
    const api = getExistingApiInstance()
    const { data } = await api.userProfiles.getMany(params)

    return {
      data,
    }
  }

  /** Адаптер для обновления user-profile
   * @param {number|string} id - id
   * @param {object} attrs - attributes
   * @param {object} [params] - query params
   * @return {Promise<object>}
   */
  async function updateUserProfile(id, attrs, params) {
    const api = getExistingApiInstance()
    const serializedData = getSerializedData({
      type: 'user-profile',
      data: attrs,
      extendedOptions: {
        user: { ref: 'id' },
      },
    })

    const { data } = await api.userProfiles.update(id, serializedData, params)

    return data
  }

  return {
    getUserProfile,
    getUserProfiles,
    updateUserProfile,
  }
}
