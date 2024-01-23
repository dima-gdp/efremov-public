export default class Coatings {
  /**
   * Склеивает в строку сортированные id покрытий
   * @param {array} coatings
   * @returns string
   */
  static getSortedCoatingsIds(coatings) {
    return coatings
      .map((coating) => coating.id)
      .sort((a, b) => a - b)
      .join(',')
  }

  /**
   * Склеивает в строку value покрытий через разделитель delim
   * @param {array} coatings
   * @param {string} delim
   * @returns string
   */
  static getCoatingsValues(coatings, delim = ' и ') {
    return coatings
      .map((coating) => coating.value)
      .join(delim)
  }
}
