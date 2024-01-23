import favoritesAdapter from '~/services/favorites-adapter'
import cartProductsAdapter from '~/services/cart-products-adapter'

/**
 * Стучится на бэк и возвращает избранные продукты и cartProducts к ним
 * @param {Object} params
 * @param {string} params.sort
 * @param {number} [params.pageNumber = 1]
 * @param {number} [params.perPage = 35]
 * @param {string} params.cartId
 * @param {string} params.userId
 * @returns {Promise<{
 * favoritesProducts: array,
 * page: object,
 * cartProducts: array
 * }>}
 */
export async function getFavoritesProductsWithCartProducts({
  sort,
  pageNumber = 1,
  perPage = 35,
  cartId,
  userId,
}) {
  const { data: favorites, page } = await favoritesAdapter().getFavorites({
    filter: { userId, product: { isActive: true } },
    sort,
    page: {
      number: pageNumber,
      size: perPage,
    },
    include: 'product.publishedProductFiles.file',
  })
  const products = favorites.map((favorite) => ({ ...favorite.product, favoriteId: favorite.id }))

  if (page.total) {
    try {
      const productsIds = products.map((product) => product.id)
      const { cartProducts } = await cartProductsAdapter().getCartProducts({
        filter: { cartId, productId: productsIds },
        fields: { 'cart-products': 'productId' },
      })

      return { favoritesProducts: products, page, cartProducts }
    } catch (e) {
      console.error(e)
      return { favoritesProducts: products, page, cartProducts: [] }
    }
  }

  return { favoritesProducts: [], page: { total: 0 }, cartProducts: [] }
}
