import { getExistingApiInstance } from "~/api";

export default function cartProductSizesAdapter() {
  /** Адаптер для получения cart-product-sizes
   * @param {object} params - query params
   * @return {Promise<array>}
   */
  async function getSizes(params) {
    const api = getExistingApiInstance()
    const { data } = await api.cartProductSizes.getMany(params)

    return data
  }

  return {
    getSizes,
  }
}
