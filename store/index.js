import { BREAKPOINT_NAMES } from '~/utils/constants'

export const state = () => ({
  currentBreakpoint: BREAKPOINT_NAMES.DESKTOP,
  isCatalogFilterExpanded: false,
  searchText: '',
  searchArticles: [],
})

export const mutations = {
  SET_CURRENT_BREAKPOINT(state, payload) {
    state.currentBreakpoint = payload
  },

  SET_CATALOG_FILTER_EXPANDED(state, payload) {
    state.isCatalogFilterExpanded = payload
  },

  SET_SEARCH_TEXT(state, payload) {
    state.searchText = payload
  },

  SET_SEARCH_ARTICLES(state, payload) {
    state.searchArticles = payload
  },
}
