import favoritesAdapter from '~/services/favorites-adapter'

export const state = () => ({
  favoriteProductsCount: 0,
})

export const mutations = {
  SET_PRODUCTS_COUNT(state, count) {
    state.favoriteProductsCount = count
  },
}

export const actions = {
  async updateFavoriteProductsCount({ commit, rootState }) {
    try {
      const userId = rootState.user.userData.id
      if (userId) {
        const { page } = await favoritesAdapter().getFavorites({
          filter: { userId },
          page: {
            number: 1,
            size: 1,
          },
        })
        commit('SET_PRODUCTS_COUNT', page.total)
      }
    } catch (e) {
      console.error(e)
    }
  },
}
