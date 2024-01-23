export default class BaseEndpoint {
  url = ''
  type = ''

  constructor(axios) {
    this.axios = axios
  }

  getOne(id, params) {
    return this.axios.request({
      url: `${this.url}/${id}`,
      method: 'GET',
      params,
    })
  }

  getMany(params) {
    return this.axios.request({
      url: `${this.url}`,
      method: 'GET',
      params,
    })
  }

  create(data, params) {
    return this.axios.request({
      url: `${this.url}`,
      method: 'POST',
      data,
      params,
    })
  }

  update(id, data, params) {
    return this.axios.request({
      url: `${this.url}/${id}`,
      method: 'PATCH',
      data,
      params,
    })
  }

  delete(id) {
    return this.axios.request({
      url: `${this.url}/${id}`,
      method: 'DELETE',
    })
  }
}
