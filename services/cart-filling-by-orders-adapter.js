import { getExistingApiInstance } from '~/api'
import { getSerializedData } from '~/services/json-api-serialize-adapter'

export default function cartFillingByOrdersAdapter() {
  async function repeatOrder(attrs, params) {
    const api = getExistingApiInstance()
    const serializedData = getSerializedData({
      type: 'cart-filling-by-orders',
      data: attrs,
    })

    const { data } = await api.cartFillingByOrders.create(serializedData, params)

    return data
  }

  return {
    repeatOrder,
  }
}
