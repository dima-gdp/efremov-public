import { getExistingApiInstance } from '~/api'
import { getSerializedData } from '~/services/json-api-serialize-adapter'

export default function emailVerificationsAdapter() {
  /** Адаптер для получения основных данных по корзине
   * @param {object} attrs - attributes
   * @param {object} [params] - query params
   * @return {Promise<object>}
   */
  async function verifiedEmail(attrs, params) {
    const api = getExistingApiInstance()
    const serializedData = getSerializedData({
      type: 'email-verifications',
      data: attrs,
    })

    const { data } = await api.emailVerifications.create(serializedData, params)

    return data
  }

  return {
    verifiedEmail,
  }
}
