import cartItemsAdapter from '~/services/cart-items-adpater'
import { CART_ITEM_ENTITY_NAMES } from '~/domain/cart-items'
import offersAdapter from '~/services/offers-adapter'

export default function useOffers() {
  /**
   * Выводит суммы показателей выбранных оферов
   * @param {array} offers - адаптированные оферы
   * @param {string} price - цена товара
   * @param {string} weight - вес товара
   * @returns {{price: string, amount: number, weight: string}}
   */
  function getSelectedOffersSum(offers, price, weight) {
    const sum = offers.reduce(
      (prev, current) => {
        return {
          price: current.cartAmount * price + prev.price,
          amount: current.cartAmount + prev.amount,
          weight: current.cartAmount * weight + prev.weight,
        }
      },
      {
        price: 0,
        amount: 0,
        weight: 0,
      },
    )

    sum.price = sum.price.toLocaleString()
    sum.weight = sum.weight.toLocaleString()

    return sum
  }

  /**
   * Возвращает офферы, которые нужно отправить на бэк
   * @param {array} offers - инпуты оферов
   * @returns {array}
   */
  function getOffersForSend(offers) {
    return offers.filter((offer) => offer.cartItemId || offer.cartAmount)
  }

  /**
   * Создает массив промисов для отправки на бэк
   * @param {array} offers - инпуты оферов
   * @param {string} cartId - id корзины
   * @returns {array | Promise[]}
   */
  function getArrayPromisesForOffers(offers, cartId) {
    return offers.map((offer) => {
      // Для create
      if (!offer.cartItemId && offer.cartAmount) {
        return cartItemsAdapter().createCartItem({
          entity: CART_ITEM_ENTITY_NAMES.offer,
          entityId: Number(offer.id),
          amount: offer.cartAmount,
          cart: {
            id: cartId,
          },
        })
      }

      // Для update
      if (offer.cartItemId && offer.cartAmount) {
        return cartItemsAdapter().updateCartItem(offer.cartItemId, {
          id: offer.cartItemId,
          amount: offer.cartAmount,
        })
      }

      // Для delete
      return cartItemsAdapter().deleteCartItem(offer.cartItemId)
    })
  }

  /**
   * Плюсует ко всем оферам число
   * @param {array} offers - адаптированные оферы
   * @param {number} amount - количество
   * @returns {array}
   */
  function getIncrementedOffersByAmount(offers, amount) {
    return offers.map((offer) => {
      if (!offer.disabled) {
        return { ...offer, cartAmount: offer.cartAmount + amount }
      }
      return offer
    })
  }

  /**
   * Оферам сбрасывает cartAmount на 0
   * @param {array} offers - адаптированные оферы
   * @returns {array}
   */
  function nullifyOffersCartAmount(offers) {
    return offers.map((offer) => {
      if (!offer.disabled) {
        return { ...offer, cartAmount: 0 }
      }
      return offer
    })
  }

  /**
   * Обработчик ошибки остатков(4221), который возвращает количество остатков с бэка
   * @param {array} cartOffers - оферы, которые отправляли
   * @return {Promise<array>}
   */
  async function onRemainError(cartOffers) {
    const offers = await offersAdapter().getOffers({
      filter: { id: cartOffers.map((offer) => offer.id) },
    })

    const availableCartOffers = offers
      .map((offer, idx) => {
        const appropriateCartOffer = cartOffers[idx]
        return {
          ...offer,
          cartAmount: offer.isCatalogAvailable ? appropriateCartOffer.cartAmount : offer.amount,
        }
      })
      .sort((a, b) => a.size - b.size)

    return availableCartOffers
  }

  /**
   * Проверяет есть ли хоть в одном офере cartAmount
   * @param {array} offers - список оферов
   * @return {boolean}
   */
  function hasSomeOfferAmount(offers) {
    return offers.some((offer) => offer.cartAmount !== 0)
  }

  return {
    getSelectedOffersSum,
    getOffersForSend,
    getIncrementedOffersByAmount,
    nullifyOffersCartAmount,
    getArrayPromisesForOffers,
    onRemainError,
    hasSomeOfferAmount,
  }
}
