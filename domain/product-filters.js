import { getMathCeil100, getMathFloor100 } from '~/utils'

/**
 * Возвращает минимальное значение для RangeInput
 * @param {number} minOption
 * @param {number} maxOption
 * @param {number} value
 * @returns number
 */
export const getMinValueRange = (minOption, maxOption, value) => {
  if (maxOption === 0) {
    return 0
  }

  return value > minOption ? value : minOption
}

/**
 * Возвращает максимальное значение для RangeInput
 * @param {number} maxOption
 * @param {number} value
 * @returns number
 */
export const getMaxValueRange = (maxOption, value) => {
  if (value === 0) {
    return maxOption
  }

  return value < maxOption ? value : maxOption
}

/**
 * @typedef {{
    minSize: number,
    maxSize: number,
    minWeight: number,
    maxWeight: number,
 * }} rangeOptions
 */

/**
 * Возвращает округленные минимальные и максимальные значения для фильтров
 * @param {Object} filterOptions
 * @param {number|string} filterOptions.minSize
 * @param {number|string} filterOptions.maxSize
 * @param {number|string} filterOptions.minWeight
 * @param {number|string} filterOptions.maxWeight
 * @returns {rangeOptions}
 */
export const getRangeInputOptions = ({ minSize, maxSize, minWeight, maxWeight }) => {
  return {
    minSize: getMathFloor100(minSize),
    maxSize: getMathCeil100(maxSize),
    minWeight: getMathFloor100(minWeight),
    maxWeight: getMathCeil100(maxWeight),
  }
}
