/**
 * Возвращает последнюю подстроку разделенную "/"
 * @param {string} path - Путь строкой до поля
 * @returns {string} - Возвращает имя поля
 */
function getErrorField(path) {
  return path?.split('/')?.slice(-1) || ''
}

/**
 * Преобразует массив ошибок в объект ошибок, где ключи это pointer - ошибки
 * @param {array} errorsList - Путь строкой до поля
 * @returns {object} - Возвращает имя поля
 */
export function getParsedErrorsByPointer(errorsList) {
  return Object.fromEntries(
    errorsList.map((e) => [[getErrorField(e.source?.pointer)], [e.detail]]),
  )
}
