<template>
  <div class="header-fix">
    <div class="header-fix__container">
      <AppCatalogBtn
        class="header-fix__catalog-btn text-main-b"
        :is-catalog-menu-open="isCatalogMenuOpen"
        :disabled="isCatalogBtnDisabled"
        @click-catalog-btn="$emit('click-catalog-btn')"
      />

      <button
        class="group flex items-center px-2 md:flex-col md:items-start md:px-3 md:mr-3 xl:px-4"
        @click="onClickCart"
      >
        <span
          class="
            flex
            items-center
            mr-3
            md:mr-0 md:mt-0.5
            group-hover:text-main-waffle
            transition-colors
          "
        >
          <IconShoppingCart
            class="hidden w-4 h-4 mr-2.5 text-main-marzipan md:block xl:w-5 xl:h-5"
          />
          <span class="text-h5 mr-1">Корзина</span>
          <IconChevronDown class="w-4 h-4 xl:w-5 xl:h-5" />
        </span>
        <span class="text-comment text-main-marzipan whitespace-nowrap md:-mt-0.5">
          {{ cartSums }}
        </span>
      </button>

      <div v-if="isProductsSliderShown" class="flex-auto">
        <client-only>
          <HeaderFixSlider :products="cartProducts" :is-visible="isVisible" />
        </client-only>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppCatalogBtn from '~/components/common/app-catalog-btn.vue'
import { IconChevronDown, IconShoppingCart } from '~/components/feather-icons'
import HeaderFixSlider from '~/components/base/header/app-header-fix/header-fix-slider/header-fix-slider.vue'
import { BREAKPOINT_NAMES } from '~/utils/constants'
import useCart from '~/application/use-cart'
import { getShortSumsString } from '~/domain/carts'
import { getFormattedMainCartProducts } from '~/domain/cart-products'
import { ABILITY_SUBJECTS } from '~/domain/user-ability'


export default {
  components: {
    HeaderFixSlider,
    IconShoppingCart,
    IconChevronDown,
    AppCatalogBtn,
  },

  props: {
    isCatalogMenuOpen: { type: Boolean, default: false, required: false },
    isVisible: { type: Boolean, default: false, required: false },
  },

  data() {
    return {
      isCatalogBtnDisabled: false,
    }
  },

  computed: {
    ...mapState({
      cartMains: (state) => state.cart.cartMains,
      currentBreakpoint: (state) => state.currentBreakpoint,
    }),

    cartProducts() {
      return getFormattedMainCartProducts(this.cartMains.items)
    },

    isProductsSliderShown() {
      return this.currentBreakpoint !== BREAKPOINT_NAMES.MOBILE && this.cartMains.items.length
    },

    cartSums() {
      return getShortSumsString(this.cartMains.itemsCount, this.cartMains.cartTotalWeight)
    },
  },

  created() {
    this.isCatalogBtnDisabled = this.$ability.cannot('read', ABILITY_SUBJECTS.CATALOG_VIEW)
    const onChangeAbility = this.$ability.on('updated', ({ target }) => {
      this.isCatalogBtnDisabled = target.cannot('read', ABILITY_SUBJECTS.CATALOG_VIEW)
    })

    this.$once('hook:beforeDestroy', function () {
      onChangeAbility()
    })
  },

  methods: {
    onClickCart() {
      const params = {
        store: this.$store,
        route: this.$route,
        router: this.$router,
      }
      useCart().openCart(params)
    },
  },
}
</script>

<style lang="scss">
@import 'app-header-fix';
</style>
