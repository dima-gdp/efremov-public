import { getExistingApiInstance } from '~/api'
import { getSerializedData } from '~/services/json-api-serialize-adapter'

export default function useOfferItemsFilters() {
  async function getVersionFilters(reqData) {
    const api = getExistingApiInstance()
    const sData = getSerializedData({
      type: 'version-filters',
      data: reqData,
    })

    const { data } = await api.versionFilters.create(sData)
    return data
  }

  return {
    getVersionFilters,
  }
}
