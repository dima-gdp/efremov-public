import { getExistingApiInstance } from '~/api'

export default function productsAdapter() {
  async function getProduct(id, params) {
    const api = getExistingApiInstance()
    const { data } = await api.products.getOne(id, params)

    return data
  }

  async function getProducts(params) {
    const api = getExistingApiInstance()
    const { data } = await api.products.getMany(params)

    return data
  }

  return {
    getProduct,
    getProducts
  }
}
