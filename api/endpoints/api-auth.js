import BaseEndpoint from './base-endpoint'

export default class ApiAuth extends BaseEndpoint {
  type = 'auths'
  url = '/auths'

  authenticate(data) {
    return this.axios.request({
      url: `${this.url}`,
      method: 'POST',
      data,
      params: {
        include: 'user.userProfile'
      }
    })
  }

  checkAuth(data) {
    return this.axios.request({
      url: 'auth-checks',
      method: 'POST',
      data,
      params: {
        include: 'user.userProfile'
      }
    })
  }
}
