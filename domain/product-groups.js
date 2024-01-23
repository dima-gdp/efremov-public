/**
 * @typedef {{
 *   sort: string,
 *   filter: object,
 *   page: object,
 *   groupType: string,
 * }} RequestParams
 */

export default class ProductGroups {
  /**
   * Приводит параметры запроса к нужному виду
   * Возвращает объект параметров для запроса
   * @param {RequestParams} params
   * @returns object
   */
  static getRequestParams(params) {
    const formattedFilters = ProductGroups.getFormattedFilters(params.filter)

    return {
      ...params,
      filter: {
        groupType: params.groupType,
        ...formattedFilters,
      },
      include: 'sortProducts.publishedProductFiles.file',
    }
  }

  /**
   * Оставляет только те фильтры, у которых есть значения
   * @param {object} filters
   * @returns object
   */
  static getNotEmptyFilters(filters) {
    return Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => (value ? [key, value] : false)),
    )
  }

  /**
   * Проверяет установлен хотя бы 1 фильтр
   * @param {object} filters
   * @returns {boolean}
   */
  static hasSomeFilter(filters) {
    return Object.values(filters).some(filter => Array.isArray(filter) ? filter.length : filter)
  }

  /**
   * Форматирует значения фильтров для передачи беку
   * Удаляет пустые значения в фильтрах
   * @param {object} filters
   * @returns object
   */
  static getFormattedFilters(filters) {
    return Object.fromEntries(
      Object.entries(filters)
        .map(([key, value]) => (Array.isArray(value) ? [key, value.join(',')] : [key, value]))
        .filter(([key, value]) => (value ? [key, value] : false)),
    )
  }
}
