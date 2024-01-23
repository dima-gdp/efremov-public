/**
 * @typedef {{
 *   isMain: boolean,
 *   insert: object,
 * }} ProductInsert
 */

/**
 * Достает из массива вставок главную вставку
 * @param {ProductInsert[]} productInserts
 * @returns {ProductInsert|undefined}
 */
export function getMainInsert(productInserts) {
  return productInserts.find((insert) => insert.isMain)
}
