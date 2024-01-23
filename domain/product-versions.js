import Coatings from '~/domain/coatings'
import { PRODUCT_VERSIONS_MAP } from '~/utils/constants'

/**
 * @typedef {{
    label: string,
    id: string,
 * }} VersionSelectOption
 */

/**
 * Получает опции селекта вставок для вывода в шаблоне
 * @param {array} productVersions - список версий товара
 * @param {string} colorAndMetal - colorAndMetal текущего товара
 * @returns VersionSelectOption[]
 */
function getInsertSelectOptions(productVersions, colorAndMetal) {
  const insertsWithCurrentMetal = productVersions
    .reduce((prev, cur) => {
      const { versionInsertFilter } = cur

      if (versionInsertFilter) {
        const isInsertExist = prev.some((insert) => insert.id === versionInsertFilter)
        return isInsertExist
          ? prev
          : [...prev, { id: versionInsertFilter, label: versionInsertFilter }]
      }

      const isEmptyInsertExist = prev.some(
        (insert) => insert.id === PRODUCT_VERSIONS_MAP.inserts.emptyId,
      )
      return isEmptyInsertExist
        ? prev
        : [
            ...prev,
            {
              id: PRODUCT_VERSIONS_MAP.inserts.emptyId,
              label: PRODUCT_VERSIONS_MAP.inserts.emptyLabel,
            },
          ]
    }, [])
    .sort((a, b) => {
      if (a.colorAndMetal === colorAndMetal && b.colorAndMetal !== colorAndMetal) {
        return -1
      }

      if (a.colorAndMetal !== colorAndMetal && b.colorAndMetal === colorAndMetal) {
        return 1
      }

      return 0
    })
  return insertsWithCurrentMetal
}

/**
 * @typedef {{
    name: string,
    title: string,
    id: string,
    options: array,
 * }} VersionSelect
 */

/**
 * Получает селект вставок для вывода в шаблоне
 * @param {string} versionInsertFilter - краткое название вставки
 * @param {array} productVersions - список версий товара
 * @param {string} colorAndMetal - colorAndMetal текущего товара
 * @returns VersionSelect
 */
const getInsertSelect = (versionInsertFilter, productVersions, colorAndMetal) => {
  const options = getInsertSelectOptions(productVersions, colorAndMetal)

  return {
    name: PRODUCT_VERSIONS_MAP.inserts.name,
    title: PRODUCT_VERSIONS_MAP.inserts.selectTitle,
    id: versionInsertFilter,
    options,
  }
}

/**
 * Возвращает опции селекта металла для вставок
 * @param {string} versionInsertFilter - краткое название вставки
 * @param {array} productVersions - список версий товара
 * @returns VersionSelectOption[]
 */
const getColorOptionsFromInserts = (versionInsertFilter, productVersions) => {
  const productsWithCurrentInsert = productVersions
    .reduce((prev, cur) => {
      if (cur.colorAndMetal) {
        const isColorAndMetalExist = prev.some((option) => option.id === cur.colorAndMetal)
        return isColorAndMetalExist
          ? prev
          : [...prev, { id: cur.colorAndMetal, label: cur.colorAndMetal }]
      }

      const isEmptyOptionExist = prev.some(
        (product) => product.id === PRODUCT_VERSIONS_MAP.colorAndMetal.emptyId,
      )

      return isEmptyOptionExist
        ? prev
        : [
            ...prev,
            {
              id: PRODUCT_VERSIONS_MAP.colorAndMetal.emptyId,
              label: PRODUCT_VERSIONS_MAP.colorAndMetal.emptyLabel,
            },
          ]
    }, [])
    .sort((a, b) => {
      if (
        a.versionInsertFilter === versionInsertFilter &&
        b.versionInsertFilter !== versionInsertFilter
      ) {
        return -1
      }

      if (
        a.versionInsertFilter !== versionInsertFilter &&
        b.versionInsertFilter === versionInsertFilter
      ) {
        return 1
      }

      return 0
    })

  return productsWithCurrentInsert
}

/**
 * Получает опции селекта покрытий для вывода в шаблоне
 * @param {array} productVersions - список версий товара
 * @param {string} colorAndMetal - colorAndMetal текущего товара
 * @returns VersionSelectOption[]
 */
const getCoatingsSelectOptions = (productVersions, colorAndMetal) => {
  const coatingsWithCurrentMetal = productVersions
    .reduce((prev, cur) => {
      if (cur.coatings.length) {
        const coatingsIds = Coatings.getSortedCoatingsIds(cur.coatings)
        const coatingsValues = Coatings.getCoatingsValues(cur.coatings)
        const isCoatingExist = prev.some((coating) => coating.id === coatingsIds)
        return isCoatingExist ? prev : [...prev, { id: coatingsIds, label: coatingsValues }]
      }
      const isEmptyOptionExist = prev.some(
        (coating) => coating.id === PRODUCT_VERSIONS_MAP.coatings.emptyId,
      )

      return isEmptyOptionExist
        ? prev
        : [
            ...prev,
            {
              id: PRODUCT_VERSIONS_MAP.coatings.emptyId,
              label: PRODUCT_VERSIONS_MAP.coatings.emptyLabel,
            },
          ]
    }, [])
    .sort((a, b) => {
      if (a.colorAndMetal === colorAndMetal && b.colorAndMetal !== colorAndMetal) {
        return -1
      }

      if (a.colorAndMetal !== colorAndMetal && b.colorAndMetal === colorAndMetal) {
        return 1
      }

      return 0
    })

  return coatingsWithCurrentMetal
}

/**
 * Получает селект покрытий для вывода в шаблоне
 * @param {array} curCoatings - покрытия у текущего товара
 * @param {array} productVersions - список версий товара
 * @param {string} colorAndMetal - colorAndMetal текущего товара
 * @returns VersionSelect
 */
const getCoatingsSelect = (curCoatings, productVersions, colorAndMetal) => {
  const coatingsSelect = {
    name: PRODUCT_VERSIONS_MAP.coatings.name,
    title: PRODUCT_VERSIONS_MAP.coatings.selectTitle,
    id: Coatings.getSortedCoatingsIds(curCoatings) || PRODUCT_VERSIONS_MAP.coatings.emptyId,
    options: getCoatingsSelectOptions(productVersions, colorAndMetal),
  }

  return coatingsSelect
}

/**
 * Получает опции селекта метала для покрытий
 * @param {array} coatings - покрытия у текущего товара
 * @param {array} productVersions - список версий товара
 * @returns VersionSelectOption[]
 */
const getColorOptionsFromCoatings = (coatings, productVersions) => {
  const optionsWithCurrentCoatings = productVersions
    .reduce((prev, cur) => {
      if (cur.colorAndMetal) {
        const isColorAndMetalExist = prev.some((option) => option.id === cur.colorAndMetal)
        return isColorAndMetalExist
          ? prev
          : [...prev, { id: cur.colorAndMetal, label: cur.colorAndMetal }]
      }

      const isEmptyOptionExist = prev.some(
        (product) => product.id === PRODUCT_VERSIONS_MAP.colorAndMetal.emptyId,
      )

      return isEmptyOptionExist
        ? prev
        : [
            ...prev,
            {
              id: PRODUCT_VERSIONS_MAP.colorAndMetal.emptyId,
              label: PRODUCT_VERSIONS_MAP.colorAndMetal.emptyLabel,
            },
          ]
    }, [])
    .sort((a, b) => {
      if (
        Coatings.getSortedCoatingsIds(a.coatings) === Coatings.getSortedCoatingsIds(coatings) &&
        Coatings.getSortedCoatingsIds(b.coatings) !== Coatings.getSortedCoatingsIds(coatings)
      ) {
        return -1
      }

      if (
        Coatings.getSortedCoatingsIds(a.coatings) !== Coatings.getSortedCoatingsIds(coatings) &&
        Coatings.getSortedCoatingsIds(b.coatings) === Coatings.getSortedCoatingsIds(coatings)
      ) {
        return 1
      }

      return 0
    })

  return optionsWithCurrentCoatings
}

/**
 * Получает селект colorAndMetal для вывода в шаблоне
 * @param {string} colorAndMetal - colorAndMetal у текущего товара
 * @param {VersionSelectOption[]} options - список версий товара
 * @returns VersionSelect
 */
const getColorAndMetalSelect = (colorAndMetal, options) => {
  return {
    name: PRODUCT_VERSIONS_MAP.colorAndMetal.name,
    title: PRODUCT_VERSIONS_MAP.colorAndMetal.selectTitle,
    id: colorAndMetal || PRODUCT_VERSIONS_MAP.colorAndMetal.emptyId,
    options,
  }
}

/**
 * Создает массив селектов для вывода в шаблоне
 * @param {Object} product
 * @param {string} product.colorAndMetal
 * @param {array} product.coatings - покрытия
 * @param {string} product.versionInsertFilter - краткое название вставки
 * @param {array} product.productVersions - версии
 * @returns VersionSelect[]
 */
export function getVersionSelects({
  colorAndMetal,
  coatings,
  versionInsertFilter,
  productVersions,
}) {
  const colorAndMetalOptions = versionInsertFilter
    ? getColorOptionsFromInserts(versionInsertFilter, productVersions)
    : getColorOptionsFromCoatings(coatings, productVersions)

  const selects = [
    getColorAndMetalSelect(colorAndMetal, colorAndMetalOptions),
    versionInsertFilter
      ? getInsertSelect(versionInsertFilter, productVersions, colorAndMetal)
      : getCoatingsSelect(coatings, productVersions, colorAndMetal),
  ]

  return selects
}

/**
 * Находит версию продукта согласно опциям селекта
 * @param {VersionSelect[]} versionSelect - селекты из шаблона
 * @param {array} productVersions - список версий товара
 * @param {string} selectName - название селекта
 * @returns object - продукт из массива версий
 */
export function findProductVersion(versionSelect, productVersions, selectName) {
  const colorAndMetalSelect = versionSelect.find(
    (select) => select.name === PRODUCT_VERSIONS_MAP.colorAndMetal.name,
  )

  const insertSelect = versionSelect.find(
    (select) => select.name === PRODUCT_VERSIONS_MAP.inserts.name,
  )

  const coatingsSelect = versionSelect.find(
    (select) => select.name === PRODUCT_VERSIONS_MAP.coatings.name,
  )

  const versionByFieldMap = {
    [PRODUCT_VERSIONS_MAP.colorAndMetal.name]() {
      return productVersions.find((version) => {
        const versionMetal = version.colorAndMetal || PRODUCT_VERSIONS_MAP.colorAndMetal.emptyId
        return versionMetal === colorAndMetalSelect.id
      })
    },

    [PRODUCT_VERSIONS_MAP.inserts.name]() {
      return productVersions.find((v) => {
        const versionInsert = v.versionInsertFilter || PRODUCT_VERSIONS_MAP.inserts.emptyId
        return versionInsert === insertSelect.id
      })
    },

    [PRODUCT_VERSIONS_MAP.coatings.name]() {
      return productVersions.find((version) => {
        const versionCoatings =
          Coatings.getSortedCoatingsIds(version.coatings) || PRODUCT_VERSIONS_MAP.coatings.emptyId
        return versionCoatings === coatingsSelect.id
      })
    },
  }

  const versionsWithCurrentColorAndMetal = productVersions.filter((v) => {
    if (v.colorAndMetal) {
      return v.colorAndMetal === colorAndMetalSelect.id
    }
    return false
  })

  if (insertSelect) {
    const versionWithCurrentInsert = versionsWithCurrentColorAndMetal.find((v) => {
      const versionInsert = v.versionInsertFilter || PRODUCT_VERSIONS_MAP.inserts.emptyId
      return versionInsert === insertSelect.id
    })

    return versionWithCurrentInsert || versionByFieldMap[selectName]()
  }

  const versionWithCurrentCoatings = versionsWithCurrentColorAndMetal.find((v) => {
    const versionCoatings =
      Coatings.getSortedCoatingsIds(v.coatings) || PRODUCT_VERSIONS_MAP.coatings.emptyId
    return versionCoatings === coatingsSelect.id
  })

  return versionWithCurrentCoatings || versionByFieldMap[selectName]()
}

/**
 * Проверяет нужно ли показывать селекты с другими исполнениями
 * @param {VersionSelect[]} selects - селекты из шаблона
 * @returns boolean
 */
export function isVersionsSelectsVisible(selects) {
  return selects.some((select) => select.options.length > 1)
}
