import { getExistingApiInstance } from '~/api'

export default function offerItemsAdapter() {
  async function getOfferItems(params) {
    const api = getExistingApiInstance()
    const { data, meta }  = await api.offerItems.getMany(params)
    return {
      data,
      page: meta.page
    }
  }

  return {
    getOfferItems,
  }
}
