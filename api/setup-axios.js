/* eslint-disable no-param-reassign */
import { Deserializer } from 'jsonapi-serializer'
import Qs from 'qs'

import HttpError from '~/domain/errors/http-error'
import { kebabToCamel } from '~/utils'

/**
 * @typedef NuxtAxiosInstance
 * @typedef VuexStoreInstance
 */

/**
 * @param {NuxtAxiosInstance} axios
 */
export default function setupAxios(axios) {
  axios.onResponse(async (res) => {
    const jsonApiOpts = { keyForAttribute: 'camelCase', dataLinks: {} }
    const deserializer = new Deserializer(jsonApiOpts)

    const { data, status } = res
    const { meta = {} } = data

    const camelMeta = Object.entries(meta).reduce((accum, [key, value]) => {
      accum[kebabToCamel(key)] = value
      return accum
    }, {})

    if (data.data) {
      const desData = await deserializer.deserialize(data).catch((err) => {
        throw new Error(err.stack)
      })

      return {
        data: desData || [],
        meta: camelMeta || {},
        status,
      }
    }

    return {
      data: res.data || [],
      meta: camelMeta || {},
      status,
    }
  })

  axios.onRequest((config) => {
    config.paramsSerializer = (params) => Qs.stringify(params)
    return config
  })

  axios.onError((error) => {
    if (!error.response) {
      throw error
    }
    const { data, status, statusText } = error.response
    const httpError = new HttpError({
      message: `${statusText}: ${status}`,
      status,
      payload: { ...data },
      request: error.request,
    })

    console.error(httpError.shortErrorInfo)

    throw httpError
  })
}
