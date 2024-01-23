import { INSERT_WEIGHT_MEASURE } from '~/utils/constants'

export default class Insert {
  /**
   * Принимает вес
   * Возвращает вес с единицей измерения
   * @param {string | number} weight
   * @returns string
   */
  static getInsertWeight(weight) {
    return `${Number(weight)} ${INSERT_WEIGHT_MEASURE}.`
  }
  /**
   * Формирует строку вида "4 × вставка"
   * @param {string|number} amount
   * @param {string} name
   * @returns string
   */
  static getInsertAmountWithName(amount, name) {
    return `${amount} × ${name}`
  }

  /**
   * Формирует строку вида "4 × вставка вес кар"
   * @param {Object} insert
   * @returns string
   */
  static getInsertFullString(insert) {
    if (Number(insert.weight)) {
      return `${Insert.getInsertAmountWithName(
        insert.amount,
        insert.insert.name,
      )} ${Insert.getInsertWeight(insert.weight)}`
    }
    return `${Insert.getInsertAmountWithName(insert.amount, insert.insert.name)}`
  }
}
