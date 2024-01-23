import { getMainProductFileUrl } from '~/domain/product-files'
import { getFormattedLocalePrice } from '~/utils'
import { getOfferTitle } from '~/domain/offers'
import { getShortSumsString, PRICE_ON_ORDER, PRICE_TYPES } from '~/domain/carts'
import { NO_SIZE_OFFER_NAME } from '~/utils/constants'
import Product from '~/domain/product'

export const CART_PRODUCTS_PER_PAGE_INITIAL = 10
export const CART_PRODUCTS_PER_PAGE = 100

/**
 * Считает кол-во офферов в наличии
 * @param {object} size
 * @param {object} product
 * @returns {string || number}
 */
export function countAvailabilityProductSize(size, product) {
  if (size.offer.amount == null || Product.isLeftovers(product)) {
    return size.offerItemAmount
  }
  return size.offerItemAmount + size.offer.amount
}

/**
 * Форматирует массив размеров для корзины
 * @param {array} sizes
 * @param {object} product
 * @returns {array}
 */
export function getFormattedProductSizes(sizes, product) {
  return sizes
    .map((size) => {
      return {
        id: size.id,
        size: size.size || NO_SIZE_OFFER_NAME,
        total: size.total,
        availability: countAvailabilityProductSize(size, product),
      }
    })
    .sort((prev, next) => prev.size - next.size)
}

/**
 * Создает удобный продукт корзины из cart-product и product
 * @param {object} cartProduct
 * @param {object} product
 * @param {object} favoriteProduct
 * @returns {object}
 */
export function getCartProductForCart(cartProduct, product, favoriteProduct) {
  return {
    id: cartProduct.id,
    productId: product.id,
    product,
    imageUrl: getMainProductFileUrl(product.publishedProductFiles) || '',
    hasComment: Boolean(cartProduct.comment),
    info: {
      article: product.article,
      name: product.name,
      weight: product.weight,
      type: product.productType.name,
      shortInfo: getOfferTitle({
        metal: product.metal,
        probe: product.probe,
        productInserts: product.productInserts,
      }),
    },
    amounts: {
      cost: cartProduct?.cost,
      tollingCost: cartProduct?.tollingCost,
      weight: cartProduct.weight,
      amount: cartProduct.amount,
    },
    cost: cartProduct.cost,
    tollingCost: cartProduct.tollingCost,
    sizes: getFormattedProductSizes(cartProduct.cartProductSizes, product),
    isFavorite: Boolean(favoriteProduct),
    favoriteId: favoriteProduct?.id,
  }
}

/**
 * Создает удобный массив продуктов корзины из cart-products и products
 * @param {array} cartProducts
 * @param {array} products
 * @param {array} favoritesProducts
 * @returns {array}
 */
export function getCartProductsForCart(cartProducts, products, favoritesProducts) {
  return cartProducts.map((cartProduct) => {
    const product = products.find((product) => String(product.id) === String(cartProduct.productId))
    const favoriteProduct = favoritesProducts.find(
      (product) => String(product.productId) === String(cartProduct.productId),
    )
    return getCartProductForCart(cartProduct, product, favoriteProduct)
  })
}

/**
 * Создает удобный массив продуктов не добавленных в комплект корзины
 * @param {array} noCartProducts
 * @param {array} products
 * @returns {Array<{id: string, imageUrl: string}>}
 */
function getNoCartProductsForCart(noCartProducts, products) {
  return noCartProducts.map((noCartProduct) => {
    const product = products.find((product) => product.id === noCartProduct.id)
    return { id: product.id, imageUrl: getMainProductFileUrl(product.publishedProductFiles) || '' }
  })
}

/**
 * Создает объект комплекта для корзины из cart-product и products
 * @param {object} productGroup
 * @param {array} products
 * @param {array} favoritesProducts
 * @returns {{ cartProducts: array, noCartProducts: array, id:string }}
 */
export function getKitForCart(productGroup, products, favoritesProducts) {
  const cartProducts = getCartProductsForCart(
    productGroup.cartProducts,
    products,
    favoritesProducts,
  )
  const noCartProducts = getNoCartProductsForCart(productGroup.noCartProducts, products)
  return { cartProducts, noCartProducts, id: productGroup.id }
}

/**
 * Создает удобный массив комплектов корзины из cart-products и products
 * @param {array} productGroups
 * @param {array} products
 * @param {array} favoritesProducts
 * @returns {Array<{ cartProducts: array, noCartProducts: array, id:string }>}
 */
export function getKitsForCart(productGroups, products, favoritesProducts) {
  const kits = productGroups.map((productGroup) =>
    getKitForCart(productGroup, products, favoritesProducts),
  )
  return kits
}

const COST_TYPES = {
  [PRICE_TYPES.main.id]: 'cost',
  [PRICE_TYPES.tolling.id]: 'tollingCost',
}

/**
 * Получает cost в зависимости от типа цены
 * @param {Object} item - Сущность у которой есть cost
 * @param {string} item.priceType
 * @param {string} item.cost
 * @param {string} item.tollingCost
 * @returns {string}
 */
export function getCostByType(item) {
  return item[COST_TYPES[item.priceType]]
}

/**
 * Получает форматированный cost в зависимости от типа цены
 * @param {Object} item - Сущность у которой есть cost
 * @param {string} item.priceType
 * @param {string} item.cost
 * @param {string} item.tollingCost
 * @returns {string}
 */
export function getFormattedCostByType(item) {
  const cost = getCostByType(item)
  if (Number(cost) === PRICE_ON_ORDER.cost) {
    return PRICE_ON_ORDER.title
  }
  return getFormattedLocalePrice({ price: Number(cost) })
}

/**
 * Форматирует основную информацию cartProducts из cartMains
 * @param {array} cartProducts - Сущность у которой есть cost
 * @returns {{sums: string, cost: string, mainFileUrl: string, cartProductId: number, productId: string}[]}
 */
export function getFormattedMainCartProducts(cartProducts) {
  return cartProducts.map((cartProduct) => ({
    sums: getShortSumsString(cartProduct.amount, cartProduct.totalWeight),
    cost: getFormattedCostByType(cartProduct),
    mainFileUrl: cartProduct.mainFileUrl,
    cartProductId: cartProduct.cartProductId,
    productId: cartProduct.productId,
  }))
}
