import { getExistingApiInstance } from '~/api'

export default function offersAdapter() {
  async function getOffers(params) {
    const api = getExistingApiInstance()
    const { data } = await api.offers.getMany(params)

    return data
  }

  return {
    getOffers,
  }
}
