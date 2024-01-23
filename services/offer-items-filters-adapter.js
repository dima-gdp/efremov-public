import { getExistingApiInstance } from '~/api'
import { getSerializedData } from '~/services/json-api-serialize-adapter'

export default function offerItemsFiltersAdapter() {
  async function getOfferItemsFilters(reqData) {
    const api = getExistingApiInstance()
    const sData = getSerializedData({
      type: 'offer-item-filters',
      data: reqData,
    })

    const { data } = await api.offerItemsFilters.create(sData)
    return data
  }

  return {
    getOfferItemsFilters,
  }
}
