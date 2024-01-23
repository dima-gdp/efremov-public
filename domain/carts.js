/**
 * @typedef {{
 *   id: string,
 *   userId: number,
 *   priceType: string,
 *   [cost]: string,
 *   [comment]: string,
 *   [amount]: number,
 *   [weight]: string,
 *   [createdAt]: string,
 *   [updatedAt]: string,
 * }} Cart
 */

export const PRICE_TYPES = {
  tolling: {
    id: 'tolling',
    label: 'давальческая',
  },
  main: {
    id: 'main',
    label: 'купля-продажа',
  },
}

export const PRICE_ON_ORDER = { title: 'Под заказ', cost: 0 }

/**
 * Склеивает amount и weight в нужном виде
 * @param {string|number} [amount=0]
 * @param {string|number} [weight=0]
 * @returns {string}
 */
export function getShortSumsString(amount = 0, weight = 0) {
  return `${amount} изд \u00A0 · \u00A0 ${weight} гр`
}
