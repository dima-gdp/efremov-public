import { fromISOToString } from '~/services/date-time-adapter'
import { SUBTITLE_METAL_GROUP_PREFIX } from '~/domain/cart-metal-insert-groups'
import { getFormattedLocalePrice } from '~/utils'
import { NO_SIZE_OFFER_NAME } from '~/utils/constants'
import { getOfferTitle } from '~/domain/offers'
import { PRICE_ON_ORDER } from '~/domain/carts'

export const SORT_ORDER_PRODUCTS = {
  AMOUNT_DECREASE: {
    value: '-amount,id',
    label: 'по убыванию количества',
  },
  AMOUNT_INCREASE: {
    value: 'amount,id',
    label: 'по возрастанию количества',
  },
  WEIGHT_DECREASE: {
    value: '-weight,id',
    label: 'по убыванию веса',
  },
  WEIGHT_INCREASE: {
    value: 'weight,id',
    label: 'по возрастанию веса',
  },
}

/**
 * Возвращает subTitle для заказа
 * @param {object} order
 * @returns string
 */
export function getSubTitle({ createdAt, amount, weight, cost }) {
  const formattedDate = fromISOToString(createdAt)
  const formattedPrice = getFormattedLocalePrice({ price: Number(cost) })
  return `${formattedDate} \u00A0 · \u00A0 ${amount} ${SUBTITLE_METAL_GROUP_PREFIX.amount} \u00A0 · \u00A0 ${weight} ${SUBTITLE_METAL_GROUP_PREFIX.weight.gr} \u00A0 · \u00A0 ${formattedPrice}`
}

/**
 * Форматирует массив размеров для корзины
 * @param {array} sizes
 * @returns {array}
 */
export function getFormattedProductSizes(sizes) {
  return sizes
    .map((size) => {
      return {
        id: size.id,
        size: size.size || NO_SIZE_OFFER_NAME,
        total: size.total,
      }
    })
    .sort((prev, next) => prev.size - next.size)
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

export function getFormattedOrderProducts(orderItems) {
  return orderItems.map((item) => {
    return {
      id: item.id,
      file: item.file,
      isActiveProduct: item.product.isActive,
      sizes: getFormattedProductSizes(item.orderProductSizes),
      comment: item.comment,
      productInfo: {
        article: item.article,
        name: item.name,
        weight: item.weight,
        type: item.type,
        shortInfo: getOfferTitle({
          metal: item.product.metal,
          probe: item.product.probe,
          productInserts: item.product.productInserts,
        }),
      },
      productAmount: {
        price: getFormattedCost(item.cost),
        weight: item.weight,
        amount: item.amount,
      },
    }
  })
}

export function getFormattedOrderItems(orderItems, order, sort) {
  return {
    id: order.id,
    title: order.metalInsertGroup.name,
    subtitle: getSubTitle(order),
    orderProducts: getFormattedOrderProducts(orderItems),
    comment: order.comment,
    priceType: order.priceType,
    isDisabledOptionPrice: true,
    sort,
  }
}
