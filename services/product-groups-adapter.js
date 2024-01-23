import { getExistingApiInstance } from '~/api'

export default function productGroupsAdapter() {
  return {
    async getProductGroups(params) {
      const api = getExistingApiInstance()

      const { data, meta } = await api.productGroups.getMany(params)

      return {
        products: data,
        lastPage: meta?.page?.lastPage,
        meta,
      }
    },
  }
}
