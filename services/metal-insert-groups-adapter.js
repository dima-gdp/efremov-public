import { getExistingApiInstance } from '~/api'

export default function metalInsertGroupsAdapter() {
  /** Адаптер для получения metal-insert-groups
   * @param {object} [params] - query params
   * @return {Promise<array>}
   */
  async function getGroups(params) {
    const api = getExistingApiInstance()
    const { data } = await api.metalInsertGroups.getMany(params)

    return data
  }

  return {
    getGroups,
  }
}
