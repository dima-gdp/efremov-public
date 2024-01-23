import { getInflectedWords } from '~/utils'

export const FAVORITES_SORTS = {
  WEIGHT_INCREASE: {
    value: 'favoriteProductWeight',
    label: 'по возрастанию веса',
  },
  WEIGHT_DECREASE: {
    value: '-favoriteProductWeight',
    label: 'по убыванию веса',
  },
  UPLOADED_DECREASE: {
    value: '-favoriteProductUploadedAt',
    label: 'по новизне',
  },
}

export const FAVORITES_PER_PAGE = 35
export const NO_FAVORITES_STRING = 'Нет товаров'
export const FAVORITE_PRODUCTS_COUNT_SUFFIXES = ['товар', 'товара', 'товаров']

/**
 * Вернет количество товара в нужном падеже
 * @param {number} amount
 * @returns string
 */
export function getFavoriteProductsAmountString(amount) {
  if (amount) {
    return `${amount} ${getInflectedWords(amount, FAVORITE_PRODUCTS_COUNT_SUFFIXES)}`
  }
  return NO_FAVORITES_STRING
}
