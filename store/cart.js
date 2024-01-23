import cartMainsAdapter from '~/services/cart-mains-adapter'

export const state = () => ({
  isOpenCart: false,
  cart: {
    id: '',
  },
  cartMains: {
    cartId: '',
    itemsCount: 0,
    cartTotalWeight: '0',
    cartCost: '0',
    items: [],
  },
})

export const mutations = {
  SET_IS_OPEN_CART(state, statusCart) {
    state.isOpenCart = statusCart
  },

  SET_CART(state, cart) {
    state.cart = cart
  },

  SET_CART_MAINS(state, cartMains) {
    state.cartMains = cartMains
  },

  RESET_CART(state) {
    state.cart = {
      id: null,
    }
    state.cartMains = {
      cartId: null,
      itemsCount: 0,
      cartTotalWeight: '0',
      cartCost: '0',
      items: [],
    }
  },
}

export const actions = {
  async updateCartMains({ commit, state }) {
    try {
      const cartMainInfo = await cartMainsAdapter().getCartInfo({
        cartId: state.cart.id,
        isSelected: true,
      })
      commit('SET_CART_MAINS', cartMainInfo)
    } catch (e) {
      console.error(e)
    }
  },
}
