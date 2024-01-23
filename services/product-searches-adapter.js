import { getExistingApiInstance } from '~/api'

export default function productSearchesAdapter() {
  /** Адаптер для получения продуктов по поисковому тексту
   * @param {object} [params] - query params
   * @return {Promise<object>}
   */
  async function getProducts(params) {
    const api = getExistingApiInstance()
    const { data } = await api.productSearches.getMany(params)

    return data
  }

  return {
    getProducts
  }
}
