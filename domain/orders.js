import { fromISOToString } from '~/services/date-time-adapter'
import { getFormattedLocalePrice, getInflectedWords } from '~/utils'
import { SUBTITLE_METAL_GROUP_PREFIX } from '~/domain/cart-metal-insert-groups'
import { PRICE_ON_ORDER } from '~/domain/carts'

export const AMOUNT_ORDERED_PRODUCTS = 6
export const VARIABLE_PRODUCTS = ['товар', 'товара', 'товаров']
export const AMOUNT_ORDERED_PRODUCTS_MOBILE = 4
export const INITIAL_ORDERS_PARAMS = {
  page: {
    size: 10,
  },
}

/**
 * Возвращает subTitle для заказа
 * @param {object} order
 * @returns string
 */
export function getSubTitle({ createdAt, amount, weight }) {
  const formattedDate = fromISOToString(createdAt)
  return `${formattedDate} \u00A0 · \u00A0 ${amount} ${SUBTITLE_METAL_GROUP_PREFIX.amount} \u00A0 · \u00A0 ${weight} ${SUBTITLE_METAL_GROUP_PREFIX.weight.gr}`
}

export function getAmountRemainingWithPrefix(amountRemainingProducts) {
  const InflectedWord = getInflectedWords(amountRemainingProducts, VARIABLE_PRODUCTS)
  return `${amountRemainingProducts} ${InflectedWord}`
}

/**
 * Возвращает форматированную цену заказа
 * @param {string} cost
 * @returns string
 */
export function getFormattedCost(cost) {
  if (Number(cost) === PRICE_ON_ORDER.cost) {
    return PRICE_ON_ORDER.title
  }

  return getFormattedLocalePrice({ price: Number(cost) })
}

/**
 * Возвращает отформатированный заказ
 * @param {object} order
 * @param {object} product
 * @returns object
 */
export function getFormattedOrder(order, product) {
  return {
    id: order.id,
    files: product.slice(0, 6),
    subTitle: getSubTitle(order),
    title: order.metalInsertGroup.name,
    totalOrderedProducts: product.length,
    cost: getFormattedCost(order.cost),
  }
}

/**
 * Возвращает список отформатированных заказов
 * @param {array} orders
 * @param {array} products
 * @returns array
 */
export function getFormattedOrdersWithProduct(orders, products) {
  return orders.map((order) => {
    const product = products.filter((product) => String(product.orderId) === String(order.id))
    return getFormattedOrder(order, product)
  })
}
