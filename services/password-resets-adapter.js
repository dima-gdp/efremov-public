import { getExistingApiInstance } from '~/api'
import { getSerializedData } from '~/services/json-api-serialize-adapter'

export default function passwordResetsAdapter() {
  /** Адаптер для сброса пароля
   * @param {object} attrs
   * @param {object} [params]
   * @return {Promise<Object>}
   */

  async function passwordReset(attrs, params) {
    const api = getExistingApiInstance()
    const serializedData = getSerializedData({
      type: 'password-resets',
      data: attrs,
    })

    const { data } = await api.passwordResets.create(serializedData, params)

    return data
  }

  return {
    passwordReset,
  }
}
