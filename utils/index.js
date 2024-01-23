import { PROMISE_STATUSES } from '~/utils/constants'

export const kebabToCamel = (str) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
export const snakeToCamel = (str) => str.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
export const camelToKebab = (str) => str.replace(/([A-Z])/g, (g) => `-${g.toLowerCase()}`)

export function isComplexType(something) {
  const strView = Object.prototype.toString.call(something)
  return ['[object Object]', '[object Array]'].includes(strView)
}

export function camelize(entry) {
  const toCamelPiped = (s) => kebabToCamel(snakeToCamel(s))

  if (Array.isArray(entry)) {
    return entry.map((e) => camelize(e))
  }
  if (!isComplexType(entry)) {
    return entry
  }
  return Object.entries(entry).reduce((accum, [key, value]) => {
    // eslint-disable-next-line no-param-reassign
    accum[toCamelPiped(key)] = isComplexType(value) ? camelize(value) : value
    return accum
  }, {})
}

export function isObject(something) {
  const strView = Object.prototype.toString.call(something)
  return ['[object Object]'].includes(strView)
}

export function decOfNum(number, titles) {
  const num = Math.floor(number)
  const cases = [2, 0, 1, 1, 1, 2]
  return titles[num % 100 > 4 && num % 100 < 20 ? 2 : cases[num % 10 < 5 ? num % 10 : 5]]
}

export function throttle(f, ms) {
  let isCoolDown = false

  return function (...args) {
    if (isCoolDown) return

    f.apply(this, args)

    isCoolDown = true

    setTimeout(() => {
      isCoolDown = false
    }, ms)
  }
}

export function debounce(func, ms, immediate) {
  let timeout

  return function executedFunction(...args) {
    const context = this

    const later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    const callNow = immediate && !timeout

    clearTimeout(timeout)

    timeout = setTimeout(later, ms)

    if (callNow) func.apply(context, args)
  }
}

/**
 * Форматирует цену
 * @param {Object} priceNumber
 * @param {number} priceNumber.price - цена
 * @param {string} [priceNumber.locale='ru-RU'] - локаль
 * @param {string} [priceNumber.currency='₽'] - валюта
 * @returns {string}
 */
export function getFormattedLocalePrice({ price, locale = 'ru-RU', currency = '₽' }) {
  const priceString = price.toLocaleString(locale)
  return `${priceString} ${currency}`
}

/**
 * Склоняет слова
 * @param {number} number кол-во
 * @param {array} words слова
 */
export function getInflectedWords(number, words) {
  return words[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? Math.abs(number) % 10 : 5]];
}

/**
 * Возвращает число округленное вниз до сотых
 * @param {number} number
 * @returns number
 */
export function getMathFloor100(number) {
  if (Number.isInteger(number)) return number
  return Math.floor(number * 100) / 100
}

/**
 * Возвращает число округленное вверх до сотых
 * @param {number} number
 * @returns number
 */
export function getMathCeil100(number) {
  if (Number.isInteger(number)) return number
  return Math.ceil(number * 100) / 100
}

/**
 * Проверяет на наличие хотя бы одного успешного промиса
 * @param {array} array
 * @returns boolean
 */
export function isSomePromiseFulfilled(array) {
  return array.some((offer) => offer.status === PROMISE_STATUSES.fulfilled)
}

/**
 * Фильтрует входящий массив так,
 * Чтобы у него не было элементов из другого массива с таким же id
 * @param {array} array
 * @param {array} anotherArray
 * @returns {array}
 */
export function getUniqItemsById(array, anotherArray) {
  return array.filter((item) => !anotherArray.some((anotherItem) => item.id === anotherItem.id))
}

/**
 * Из строки вырезает все числа
 * @param {string} string
 * @returns string - строка чисел
 */
export function parseNumbersFromString(string) {
  return string.replace(/[^0-9]/g, '')
}
