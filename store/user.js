export const state = () => ({
  isLoggedIn: false,
  userToken: null,
  userData: {
    id: '',
    roles: [],
    userProfile: null,
  },
})

export const mutations = {
  SET_AUTH(state, { token, userData }) {
    state.userToken = token
    state.userData = userData
    state.isLoggedIn = true
  },

  SET_USER_DATA(state, userData ) {
    state.userData = userData
  },

  SET_USER_PROFILE(state, userProfile) {
    state.userData.userProfile = userProfile
  },

  RESET_AUTH(state) {
    state.isLoggedIn = false
    state.userToken = null
    state.userData = {
      id: null,
      roles: []
    }
  },
}
