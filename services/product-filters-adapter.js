import { getExistingApiInstance } from '~/api'
import { getSerializedData } from '~/services/json-api-serialize-adapter'

export default function productFiltersAdapter() {
  async function getProductFilters(productData) {
    const api = getExistingApiInstance()
    const reqData = getSerializedData({
      type: 'product-filters',
      data: productData,
    })

    const { data } = await api.productFilters.create(reqData)

    return {
      options: data,
    }
  }

  return {
    getProductFilters,
  }
}
