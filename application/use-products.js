import productGroupsAdapter from '~/services/product-groups-adapter'
import cartProductsAdapter from '~/services/cart-products-adapter'
import favoritesAdapter from '~/services/favorites-adapter'

/**
 * Форматирует продукты, докидывая к ним нужные поля
 * @param {array} products - productGroups
 * @param {array} cartProducts
 * @param {array} favoriteProducts
 * @return {array}
 */
function getFormattedProductGroups(products, cartProducts, favoriteProducts) {
  const formattedProductGroups = products.map((productGroups) => {
    const formattedProducts = productGroups.sortProducts.map((product) => {
      const cartProduct = cartProducts.find(
        (cartProduct) => String(cartProduct.productId) === product.id,
      )
      const favoriteProduct = favoriteProducts.find(
        (favoriteProduct) => String(favoriteProduct.productId) === product.id,
      )

      return {
        ...product,
        inCart: Boolean(cartProduct),
        isFavorite: Boolean(favoriteProduct),
        favoriteId: favoriteProduct?.id,
      }
    })

    return {
      id: productGroups.id,
      sortProducts: formattedProducts,
    }
  })

  return formattedProductGroups
}

/**
 * @param {object} [params] - params для productGroups
 * @param {string} cartId
 * @param {string} userId
 * @return {Promise<object>}
 */
export async function getFormattedProducts(params, cartId, userId) {
  // Получили продукт-группы
  const { products, lastPage } = await productGroupsAdapter().getProductGroups(params)
  // Взяли у них id
  const productsIds = products.reduce((prevIds, productGroup) => {
    const currentIds = productGroup.sortProducts.map((product) => product.id)
    return [...prevIds, ...currentIds]
  }, [])

  try {
    // Получаем для них избранные и cartProducts
    const [{ data: favoriteProducts }, { cartProducts }] = await Promise.all([
      favoritesAdapter().getFavorites({
        filter: { userId, productId: productsIds.join(',') },
      }),
      cartProductsAdapter().getCartProducts({
        filter: { cartId, productId: productsIds },
        fields: { 'cart-products': 'productId' },
      }),
    ])
    const formattedProductGroups = getFormattedProductGroups(
      products,
      cartProducts,
      favoriteProducts,
    )
    return {
      lastPage,
      products: formattedProductGroups,
    }
  } catch (e) {
    console.error(e)
    return { products, lastPage }
  }
}

/**
 * @param {array} productGroups
 * @param {string} productId
 * @return {object}
 */
export function findProductInSortProducts(productGroups, productId) {
  const updatedProductGroup = productGroups.find((productGroup) =>
    productGroup.sortProducts.some((product) => product.id === productId),
  )
  return updatedProductGroup.sortProducts.find((product) => product.id === productId)
}

/**
 * Находит продукт, который лежит в массиве kit.cartProducts
 * @param {array} kits
 * @param {string} productId
 * @return {object|undefined}
 */
export function findKitProduct(kits, productId) {
  const productKit = kits.find((kit) =>
    kit.cartProducts.some((product) => product.productId === productId),
  )
  if (productKit) {
    return productKit.cartProducts.find((product) => product.productId === productId)
  }
}
