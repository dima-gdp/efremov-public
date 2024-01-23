import Insert from '~/domain/insert'
import {
  PRODUCT_FILTER_AVAILABILITY,
  PRODUCT_MEDALS,
  PRODUCT_VERSIONS_MAP,
} from '~/utils/constants'
import Coatings from '~/domain/coatings'
import { PRICE_TYPES } from '~/domain/carts'
import { getFormattedLocalePrice } from '~/utils'
import { getMainProductFileUrl } from '~/domain/product-files'

export const PRODUCT_ARTICLES_DELIMS = [',', ';']
export const PRODUCT_SEARCH_PER_PAGE = 7
export const GROUP_SEARCH_TITLE = 'Результаты группового поиска'

export default class Product {
  /**
   * @typedef {{
   *   isHit: boolean,
   *   isNew: boolean,
   *   isSale: boolean,
   * }} Medals
   */

  /**
   * Приводит объект медалей к массиву, сортирует,
   * и возвращает массив с первым элементом
   * @param {Medals} medals
   * @returns {array} массив с одним элементом
   */
  static getMedals(medals) {
    const formattedMedals = Object.entries(medals)
      .filter(([, value]) => value)
      .map(([key]) => PRODUCT_MEDALS[key])

    const sortedMedals = [...formattedMedals].sort((a, b) => a.sort - b.sort).slice(0, 1)
    return sortedMedals
  }

  /**
   * Формирует таблицу описания товара
   * @param {object} product
   * @returns array массив пар ключ - значение
   */
  static getProductDescription(product) {
    const MEASURE = 'мм'
    const MEASURE_FIELDS = ['Длина', 'Ширина', 'Высота']
    const descriptionTable = [
      { name: 'Металл', value: product.metal },
      { name: 'Цвет', value: product.color },
      { name: 'Проба', value: product.probe },
      { name: 'Плетение', value: product.weaving },
      { name: 'Длина', value: product.length },
      { name: 'Ширина', value: product.width },
      { name: 'Высота', value: product.height },
      { name: 'Покрытие', value: Coatings.getCoatingsValues(product.coatings, ', ') },
    ]
    return descriptionTable
      .filter((col) => col.value)
      .map((col) => {
        if (MEASURE_FIELDS.includes(col.name)) {
          return { ...col, value: `${col.value} ${MEASURE}` }
        }
        return col
      })
  }

  /**
   * Формирует список вставок товара в соответствие с версткой для v-for
   * @param {Array} inserts
   * @returns string[] массив строк
   */
  static getInsertsTable(inserts = []) {
    const insertsTable = inserts.reduce((prev, current) => {
      const description = Insert.getInsertAmountWithName(current.amount, current.insert.name)
      if (Number(current.weight)) {
        const weight = Insert.getInsertWeight(current.weight)
        return [...prev, `${description}`, `${weight}`]
      }
      // Вместо веса возвращаем пустую строку, чтобы не сломался grid
      return [...prev, `${description}`, '']
    }, [])

    return insertsTable
  }

  static getVersionSelects({ versionsFilters, mainInsert, currentValues }) {
    const productVersionsFields = Product.getVersionFields(mainInsert)

    return Object.entries(versionsFilters)
      .filter(
        ([key, value]) =>
          productVersionsFields.includes(PRODUCT_VERSIONS_MAP[key]?.name) && value.length,
      )
      .map(([key, value]) => ({
        id: currentValues[PRODUCT_VERSIONS_MAP[key].name],
        options: value,
        name: PRODUCT_VERSIONS_MAP[key]?.name,
        title: PRODUCT_VERSIONS_MAP[key].selectTitle,
      }))
  }

  static getVersionFields(mainInsert) {
    return [
      PRODUCT_VERSIONS_MAP.color.name,
      mainInsert ? PRODUCT_VERSIONS_MAP.inserts.name : PRODUCT_VERSIONS_MAP.coatings.name,
    ]
  }

  static getVersionFilters(filters) {
    const versionFilters = Object.fromEntries(
      filters.map((field) => {
        if (PRODUCT_VERSIONS_MAP[field.name].isNestedFilter) {
          return [PRODUCT_VERSIONS_MAP[field.name].filterName, { id: [field.id] }]
        }
        return [PRODUCT_VERSIONS_MAP[field.name].filterName, field.id]
      }),
    )

    return versionFilters
  }

  /**
   * Определяет показывать ли цену у товара
   * @param {string} availability - значение из фильтра
   * @returns boolean
   */
  static isVisibilityPrice(availability) {
    return availability === PRODUCT_FILTER_AVAILABILITY.isAvailable
  }

  /**
   * Возвращает текст статуса товара
   * @param {string|number} amount - значение из фильтра
   * @param {string|number} weight - значение из фильтра
   * @returns {string}
   */
  static getCartProductStatus(amount, weight) {
    return `${amount} шт. · ${weight} гр.`
  }

  static isLeftovers(product) {
    return !product.isLeftoversAvailable || !product.isLeftovers
  }
}

export const PRODUCT_PRICE_FIELDS_MAP = {
  [PRICE_TYPES.main.id]: 'price',
  [PRICE_TYPES.tolling.id]: 'tollingPrice',
}

/**
 * Получает productPrice в зависимости от типа цены
 * @param {object} product
 * @param {string} priceType
 * @returns {string}
 */
export function getProductPriceByType(product, priceType) {
  return product[PRODUCT_PRICE_FIELDS_MAP[priceType]]
}

/**
 * Получает форматированный productPrice в зависимости от типа цены
 * @param {object} product
 * @param {string} priceType
 * @returns {string}
 */
export function getFormattedPriceByType(product, priceType) {
  const price = getProductPriceByType(product, priceType)
  return getFormattedLocalePrice({ price: Number(price) })
}

/**
 * К продуктам добавляет поле inCart, если товар заказан
 * @param {array} products
 * @param {array} cartProducts
 * @returns {array}
 */
export function getFavProductsWithInCartField(products, cartProducts) {
  return products.map((product) => {
    const cartProduct = cartProducts.find(
      (cartProduct) => String(cartProduct.productId) === product.id,
    )
    return {
      ...product,
      isFavorite: true,
      inCart: Boolean(cartProduct?.id),
    }
  })
}
/**
 * Из массива артикулов удаляет пустые и повторяющиеся
 * @param {string[]} articles
 * @returns {string[]}
 */
export function getFormattedSearchArticles(articles) {
  const uniqArticles = new Set(articles.filter((article) => article))
  return Array.from(uniqArticles.map((articles) => articles.trim()))
}

/**
 * Из массива артикулов достает их разделитель
 * @param {string[]} articles
 * @returns {string}
 */
export function getArticlesDelim(articles) {
  if (articles.includes(',')) {
    return ','
  }
  return ';'
}

/**
 * Из строки ввода вырезает артикулы
 * @param {string} input - строка в которой есть артикулы
 * @param {string} delim - разделитель
 * @param {string[]} articles - вырезаемые артикулы
 * @returns {string}
 */
export function getStringWithoutArticles(input, delim, articles) {
  return input
    .split(delim)
    .map(article => article.trim())
    .filter((article) => !articles.includes(article))
    .join(delim)
}

/**
 * Возвращает массив продуктов для результата поиска
 * @param {array} products - строка в которой есть артикулы
 * @returns {array}
 */
export function getSearchProductsFromProducts(products) {
  return products.map((product) => ({
    id: product.id,
    article: product.article,
    imageUrl: getMainProductFileUrl(product.publishedProductFiles) || '',
  }))
}

/**
 * Проверяет есть ли артикулы в строке
 * @param {string} string - строка в которой есть артикулы
 * @returns {boolean}
 */
export function hasStringArticle(string) {
  return PRODUCT_ARTICLES_DELIMS.some((delim) => string.includes(delim))
}
