export const CART_ITEM_ENTITY_NAMES = {
  offer: 'offer',
  offerItem: 'offer-item'
}

export const REMAINS_ERROR = {
  code: '4221',
  message: 'Кол-во превышает остатки'
}

/**
 * Получает сумму amount из каждого cart-item
 * @param {array} cartItems
 * @returns {number}
 */
export function getCartItemsAmount(cartItems) {
  return cartItems.reduce((prev, current) => {
    return prev + current.amount
  }, 0)
}

/**
 * Получает сумму weight из каждого cart-item
 * @param {array} cartItems
 * @returns {number}
 */
export function getCartItemsWeight(cartItems) {
  return cartItems.reduce((prev, current) => {
    return prev + current.weight * current.amount
  }, 0)
}
