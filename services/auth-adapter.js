import { getExistingApiInstance } from '~/api'
import { getSerializedData } from '~/services/json-api-serialize-adapter'

export default function authAdapter() {
  return {
    async authenticate(login, password) {
      const api = getExistingApiInstance()
      const reqData = getSerializedData({ type: 'auths', data: { login, password } })

      const { data } = await api.auth.authenticate(reqData)
      return {
        token: data.token,
        userData: data.user,
      }
    },

    async checkAuth(token) {
      const api = getExistingApiInstance()
      const reqData = getSerializedData({ type: 'auth-checks', data: { token } })

      const { data } = await api.auth.checkAuth(reqData)
      return {
        isActive: data.isActive,
        userData: data.user,
      }
    },
  }
}
