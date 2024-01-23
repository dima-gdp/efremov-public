import { PRODUCT_PRICE_FIELDS_MAP } from '~/domain/product'

export default function useCartItems() {
  /**
   * Выводит сумму по цене, весу, количеству
   * @param {array} cartItems - адаптированные оферы
   * @param {string} priceType - тип цены
   * @returns {{price: string, amount: number, weight: string}}
   */
  function getCartItemsSums(cartItems, priceType) {
    const sum = cartItems.reduce(
      (prev, current) => {
        return {
          price: current.amount * current[PRODUCT_PRICE_FIELDS_MAP[priceType]] + prev.price,
          amount: current.amount + prev.amount,
          weight: current.amount * current.weight + prev.weight,
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
  return {
    getCartItemsSums,
  }
}
