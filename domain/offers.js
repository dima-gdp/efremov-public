import Insert from '~/domain/insert'
import { NO_SIZE_OFFER_NAME, PRODUCT_WITH_PAIR_OFFERS } from '~/utils/constants'

const HALF_SIZE_SYMBOL = '.5'

/**
 * Если размер disabled, возвращает true
 * @param {object} size
 * @returns {boolean}
 */
function isOfferDisabled(size) {
  if (!size.isActive) {
    return true
  }
  return !(Number(size.amount) || size.isCatalogAvailable)
}

/**
 * Принимает количество оферов для данного размера
 * Вычисляет количество заказов по данному размеру
 * @param {number} amount
 * @param {boolean} isCatalogAvailable
 * @returns {string} Или количество, или подпись
 */
function getSizeStatus(amount, isCatalogAvailable) {
  if (amount) {
    return `${amount} шт.`
  }

  if (isCatalogAvailable) {
    return 'Заказ'
  }

  return 'Нет'
}

/**
 * Из парных форматированных офферов выкидывает офферы,
 * которые не надо выводить
 * @param {array} offers
 * @returns {array} Массив размеров
 */
function getVisiblePairOffers(offers) {
  return offers
    .filter((size, idx) => {
      if (size.size.includes(HALF_SIZE_SYMBOL)) {
        return !(size.disabled && offers[idx - 1]?.disabled)
      }
      return !(size.disabled && offers[idx + 1]?.disabled)
    })
    .filter((offer) => offer.isActive)
}

/**
 * Для конкретного офера находит cart-item
 * @param {array} cartItems
 * @param {array} offerId
 * @returns {object|undefined}
 */
function getCartItemByOffer(cartItems, offerId) {
  return cartItems.find((cartItem) => String(cartItem.entityId) === offerId)
}

/**
 * Принимает количество оферов, если оба офера disabled, выкинет их, остальные отформатирует
 * @param {array} sizes
 * @param {array} cartItems
 * @returns {array} Массив размеров
 */
function getFormattedPairOffers(sizes, cartItems) {
  const formattedSizes = sizes.map((size) => {
    const cartItem = getCartItemByOffer(cartItems, size.id)

    return {
      id: size.id,
      entityId: cartItem?.entityId,
      cartItemId: cartItem?.id,
      cartAmount: cartItem?.amount || 0,
      size: size.size,
      amount: size.amount,
      status: getSizeStatus(size.amount, size.isCatalogAvailable),
      disabled: isOfferDisabled(size),
      haveLimit: !size.isCatalogAvailable,
      isActive: size.isActive,
    }
  })

  return getVisiblePairOffers(formattedSizes)
}

/**
 * Принимает массив оферов с бека
 * Форматирует массив для удобного отображения в компонентах
 * @param {array} sizes
 * @param {object} productType
 * @param {array} cartItems - элементы корзины
 * @returns {array} Массив размеров
 */
export function getFormattedOffersList(sizes = [], productType, cartItems) {
  // Если пришел оффер без размера
  const noSizeOffer = sizes.find((size) => !size.size)

  if (noSizeOffer) {
    return [noSizeOffer]
      .filter((offer) => !isOfferDisabled(offer))
      .map((offer) => {
        const cartItem = getCartItemByOffer(cartItems, offer.id)
        return {
          id: offer.id,
          entityId: cartItem?.entityId,
          cartItemId: cartItem?.id,
          cartAmount: cartItem?.amount || 0,
          size: NO_SIZE_OFFER_NAME,
          amount: offer.amount,
          itemAmount: offer.itemAmount,
          status: getSizeStatus(offer.amount, offer.isCatalogAvailable),
          disabled: false,
          haveLimit: !offer.isCatalogAvailable,
        }
      })
  }

  // Если пришел товар с парными размерами
  if (productType.name.toLowerCase() === PRODUCT_WITH_PAIR_OFFERS.toLowerCase()) {
    return getFormattedPairOffers(sizes, cartItems)
  }

  // Если пришел товар с не парными размерами
  return sizes
    .filter((offer) => !isOfferDisabled(offer))
    .map((size) => {
      const cartItem = getCartItemByOffer(cartItems, size.id)
      return {
        id: size.id,
        entityId: cartItem?.entityId,
        cartItemId: cartItem?.id,
        cartAmount: cartItem?.amount || 0,
        size: size.size,
        amount: size.amount,
        status: getSizeStatus(size.amount, size.isCatalogAvailable),
        disabled: false,
        haveLimit: !size.isCatalogAvailable,
      }
    })
}

/**
 * @typedef {{
 *   [color]: string,
 *   metal: string,
 *   probe: string,
 *   productInserts: array,
 * }} TitleParams
 */

/**
 * Принимает объект данных для создания строки
 * Возвращает сгенерированный заголовок
 * @param {TitleParams} titleParams
 * @returns {string} Заголовок описания продукта
 */
export function getOfferTitle({ color, metal, probe, productInserts }) {
  const startTitle = [color, metal, probe].filter((val) => val).join(', ')

  const inserts = productInserts.map((insert) => `${Insert.getInsertFullString(insert)}`).join(', ')

  return `${startTitle}. ${inserts}`
}
