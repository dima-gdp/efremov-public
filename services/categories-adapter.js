import { getExistingApiInstance } from '~/api'

export default function categoriesAdapter() {
  async function getCategories(params) {
    const api = getExistingApiInstance()
    const { data } = await api.catalogs.getMany(params)

    return {
      data
    }
  }

  return {
    getCategories,
  }
}
