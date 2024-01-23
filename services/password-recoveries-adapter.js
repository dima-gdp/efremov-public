import { getExistingApiInstance } from '~/api'
import { getSerializedData } from '~/services/json-api-serialize-adapter'

export default function passwordRecoveriesAdapter() {
  /** Адаптер для восстановления пароля
   * @param {object} attrs
   * @param {object} [params]
   * @return {Promise<Object>}
   */

  async function passwordRecovery(attrs, params) {
    const api = getExistingApiInstance()
    const serializedData = getSerializedData({
      type: 'password-recoveries',
      data: attrs,
    })

    const { data } = await api.passwordRecoveries.create(serializedData, params)

    return data
  }

  return {
    passwordRecovery,
  }
}
