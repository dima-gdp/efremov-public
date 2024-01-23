import { FILE_TYPES, FILES_KIND } from '~/utils/constants'

/**
 * @typedef {{
 *  productId: number,
 *  fileId: number,
 *  [previewFileId]: string | null,
 *  kind: string,
 *  isActive: boolean,
 *  sourceFilename: string,
 *  isMain: boolean,
 *  sort: number,
 *  [sourceCreatedAt]: string,
 *  id: number,
 *  [file]: object
 * }} productFile
 */

/**
 * Возвращает основной продукт файл
 * @param {productFile[]} productFiles Массив продукт файлов
 * @returns {object|undefined} Основной продукт файл
 */
export function getMainProductFile(productFiles) {
  return productFiles.find((f) => f.isMain)
}

/**
 * Возвращает url основного файла
 * @param {productFile[]} productFiles Массив продукт файлов
 * @returns {string|undefined} Основной продукт файл
 */
export function getMainProductFileUrl(productFiles) {
  const mainFile = getMainProductFile(productFiles)
  return mainFile?.file.url
}

/**
 * Возвращает форматированный список файлов
 * для вывода в галерею
 * @param {productFile[]} productFiles Массив продукт файлов
 * @returns {array} Массив файлов с полем preview
 */
export function getFormattedFilesForGallery(productFiles) {
  const mainFile = getMainProductFile(productFiles)

  const notMainProductFiles = productFiles.filter((f) => !f.isMain)
  const mainProductFiles = productFiles.filter((f) => f.isMain)
  const allProductFiles = [...mainProductFiles, ...notMainProductFiles]
  return allProductFiles.map((f) => ({
    ...f,
    preview: f.kind === FILES_KIND.video ? mainFile?.file?.url : f.file.url,
  }))
}

/**
 * Получает активные картинки у продукта
 * @param {productFile[]} productFiles Массив продукт файлов
 * @returns {productFile[]} productFiles
 */
export function getProductImages(productFiles) {
  return productFiles.filter((file) => file.kind === FILE_TYPES.IMAGE && file.isActive)
}
