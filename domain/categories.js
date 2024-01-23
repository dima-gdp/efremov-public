export default class Categories {
  static getFormattedCategories(categories) {
    return categories
      .filter((category) => category.isActive)
      .map((cat) => {
        if (cat.customItems?.length) {
          return this._getFormattedCategory(cat)
        }

        return cat
      })
  }


   static _getFormattedCategory(category) {
    const customItems = category.customItems
      .filter((category) => category.isActive)
      .map((cat) => {
        if (cat.customItems) {
          return this._getFormattedCategory(cat)
        }

        return category
      })

    const filteredCategory = {
      ...category,
      customItems,
    }

    return filteredCategory
  }
}
