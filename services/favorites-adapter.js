import { getExistingApiInstance } from '~/api'
import { getSerializedData } from '~/services/json-api-serialize-adapter'

export default function favoritesAdapter() {
  /** Адаптер для получения списка корзин
   * @param {object} params - query params
   * @return {Promise<object>}
   */
  async function getFavorites(params) {
    const api = getExistingApiInstance()
    const { data, meta } = await api.favorites.getMany(params)
    return {
      data,
      page: meta?.page,
    }
  }

  /** Адаптер для создания favorites
   * @param {object} attrs - attributes
   * @param {object} [params] - query params
   * @return {Promise<object>}
   */
  async function addToFavorites(attrs, params) {
    const api = getExistingApiInstance()
    const serializedData = getSerializedData({
      type: 'favorites',
      data: attrs,
      extendedOptions: {
        user: { ref: 'id' },
        product: { ref: 'id' },
      },
    })

    const { data } = await api.favorites.create(serializedData, params)

    return { data }
  }

  /** Адаптер для удаления favorites
   * @param {string|number} id
   * @return {Promise<void>}
   */
  async function deleteFavorites(id) {
    const api = getExistingApiInstance()
    await api.favorites.delete(id)
  }

  return {
    getFavorites,
    addToFavorites,
    deleteFavorites,
  }
}
