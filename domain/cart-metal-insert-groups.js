import { CART_PRODUCTS_PER_PAGE_INITIAL } from '~/domain/cart-products'
import { getFormattedLocalePrice } from '~/utils'
import { GROUP_PRODUCTS } from '~/utils/constants'
import { PRICE_ON_ORDER } from '~/domain/carts'

export const SORT_CART_PRODUCTS = {
  AMOUNT_DECREASE: {
    value: '-cartProductsAmount,id',
    label: 'по убыванию количества',
  },
  AMOUNT_INCREASE: {
    value: 'cartProductsAmount,id',
    label: 'по возрастанию количества',
  },
  WEIGHT_DECREASE: {
    value: '-cartProductsWeight,id',
    label: 'по убыванию веса',
  },
  WEIGHT_INCREASE: {
    value: 'cartProductsWeight,id',
    label: 'по возрастанию веса',
  },
  CREATED_INCREASE: {
    value: '-cartProductsCreatedAt,id',
    label: 'по времени добавления',
  },
}

export const CART_METAL_GROUP_PRICE_TYPES = {
  COST: {
    value: 'main',
    label: 'купля-продажа',
  },
  TOLLING_COST: {
    value: 'tolling',
    label: 'давальческая',
  },
}

export const SUBTITLE_METAL_GROUP_PREFIX = {
  weight: {
    gr: 'гр',
  },
  cost: {
    rub: '₽',
  },
  amount: 'изд',
}

export const DELAY_COMMENT_UPDATE = 5000

// Временное решение, пока эта вставка не понадобится
export const METAL_INSERT_OTHER = 'другое'
export const METAL_INSERT_SILVER = 'серебро'

const PRODUCT_PRICE_FIELDS_MAP = {
  [CART_METAL_GROUP_PRICE_TYPES.COST.value]: 'cost',
  [CART_METAL_GROUP_PRICE_TYPES.TOLLING_COST.value]: 'tollingCost',
}

/**
 * Возвращает subTitle для группы метала
 * @param {object} metalGroup
 * @returns string
 */
export function getSubTitleMetalGroups({ amount, weight, cost }) {
  if (amount) {
    return `${amount}  ${SUBTITLE_METAL_GROUP_PREFIX.amount}. \u00A0 · \u00A0 ${weight}  ${SUBTITLE_METAL_GROUP_PREFIX.weight.gr} \u00A0 · \u00A0 ${cost}`
  }

  return `0  ${SUBTITLE_METAL_GROUP_PREFIX.amount}. \u00A0 · \u00A0 0  ${SUBTITLE_METAL_GROUP_PREFIX.weight.gr}  \u00A0 · \u00A0 0`
}

/**
 * Возвращает набор опций для смены цены
 * @param {string} metalGroupName
 * @returns array
 */
export function getOptionsPrice(metalGroupName) {
  if (metalGroupName.toLowerCase() === METAL_INSERT_SILVER) {
    return [CART_METAL_GROUP_PRICE_TYPES.COST]
  }
  return Object.values(CART_METAL_GROUP_PRICE_TYPES)
}

/**
 * Возвращает список отформатированных групп металлов
 * @param {array} metalGroups
 * @param {array} cartMetalGroups
 * @returns array
 */
export function getFormattedMetalGroups(metalGroups, cartMetalGroups) {
  return metalGroups
    .map((metalGroup) => {
      const cartMetalGroup = cartMetalGroups.find(
        (cmg) => cmg.metalInsertGroupId === Number(metalGroup.id),
      )

      return {
        id: metalGroup.id,
        title: metalGroup.name,
        isEmpty: !cartMetalGroup?.amount,
        comment: cartMetalGroup?.comment,
        cartMetalGroupId: cartMetalGroup?.id,
        amount: cartMetalGroup?.amount,
        weight: cartMetalGroup?.weight,
        cost: cartMetalGroup?.cost,
        priceType: cartMetalGroup?.priceType,
        tollingCost: cartMetalGroup?.tollingCost,
        cartProducts: [],
        kits: [],
        products: [],
        pagination: {
          currentPage: 1,
          perPage: CART_PRODUCTS_PER_PAGE_INITIAL,
          lastPage: 1,
        },
        sort: SORT_CART_PRODUCTS.CREATED_INCREASE.value,
        groupType: GROUP_PRODUCTS.PRODUCTS.value,
        isLoading: false,
        optionsPrice: getOptionsPrice(metalGroup.name),
        isDisabledOptionPrice: metalGroup.name.toLowerCase() === METAL_INSERT_SILVER,
      }
    })
    .filter((metalGroup) => metalGroup.title.toLowerCase() !== METAL_INSERT_OTHER)
}

/**
 * Возвращает цену в зависимости от типа цены
 * @param {object} product
 * @param {string} priceType
 * @returns {string}
 */
export function getProductCostByType(product, priceType) {
  return product[PRODUCT_PRICE_FIELDS_MAP[priceType]]
}

/**
 * Возвращает форматированную цену в зависимости от типа цены
 * @param {object} product
 * @param {string} priceType
 * @returns {string}
 */
export function getFormattedCostByType(product, priceType) {
  const cost = getProductCostByType(product, priceType)
  if (Number(cost) === PRICE_ON_ORDER.cost) {
    return PRICE_ON_ORDER.title
  }
  return getFormattedLocalePrice({ price: Number(cost) })
}

/**
 * Возвращает данные заказа
 * @param {Object} orderInfo
 * @returns Object
 */
export function getFormattedOrderInfo(orderInfo) {
  return {
    name: orderInfo.metalInsertGroup.name,
    weight: orderInfo.weight,
    amount: orderInfo.amount,
    cost: getFormattedCostByType(orderInfo, orderInfo.priceType),
  }
}

/**
 * Возвращает изначальные данные для фильтра корзины
 * @returns Object
 */
export function getEmptyCartFilter() {
  return {
    collectionIds: null,
    metals: null,
    kindIds: [],
    availability: null,
    minSize: null,
    maxSize: null,
    minWeight: null,
    maxWeight: null,
    insertIds: [],
    colors: null,
    probes: null,
    coatingIds: null,
    cartId: null,
  }
}
