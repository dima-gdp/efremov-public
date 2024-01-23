<template>
  <div class="default-layout">
    <AppCart v-if="$store.state.cart.isOpenCart" />
    <!-- Остатки изменились-->
    <PortalTarget name="remains-modal" data-cart-widget />

    <!-- Не добавили в корзину-->
    <PortalTarget name="closing-modal" data-cart-widget />

    <!-- Переключились в режим наличия-->
    <PortalTarget name="presence-modal" data-cart-widget />

    <!-- Галерея со страницы товара -->
    <PortalTarget name="files-modal" data-cart-widget />

    <AppGlobalAlert />

    <transition v-if="$ability.can('read', $options.ABILITY_SUBJECTS.CATALOG_VIEW)" name="fade">
      <AppMenuCatalog
        v-show="isCatalogMenuOpen"
        :is-open="isCatalogMenuOpen"
        @close="closeCatalogMenu"
      />
    </transition>

    <AppHeader
      ref="header"
      @click-catalog-btn="openCatalogMenu"
    />

    <transition v-if="$store.state.cart.cart.id" name="fade">
      <AppHeaderFix
        v-show="isFixedHeaderVisible"
        :is-visible="isFixedHeaderVisible"
        :is-catalog-menu-open="isCatalogMenuOpen"
        @click-catalog-btn="onClickCatalogBtn"
      />
    </transition>

    <div class="hidden">
      <AppAsideCart />
    </div>
    <div class="flex-auto relative flex flex-col">
      <Nuxt />
    </div>
    <AppFooter @click-catalog-btn="openCatalogMenu" />
  </div>
</template>

<script>
import AppAsideCart from '~/components/base/app-aside-cart/app-aside-cart.vue'
import AppFooter from '~/components/base/app-footer.vue'
import AppHeader from '~/components/base/header/app-header/app-header.vue'
import AppHeaderFix from '~/components/base/header/app-header-fix/app-header-fix.vue'
import AppMenuCatalog from '~/components/base/app-menu-catalog/app-menu-catalog.vue'
import AppGlobalAlert from '~/components/base/app-global-alert.vue'
import AppCart from '~/components/base/app-cart/app-cart.vue'
import { lockBodyScroll, unlockBodyScroll } from '~/application/body-overflow'
import useCart from '~/application/use-cart'
import cartMainsAdapter from '~/services/cart-mains-adapter'
import useCarts from '~/application/useCarts'
import { ABILITY_SUBJECTS } from '~/domain/user-ability'

export default {
  components: {
    AppGlobalAlert,
    AppHeaderFix,
    AppFooter,
    AppHeader,
    AppMenuCatalog,
    AppCart,
    AppAsideCart,
  },

  ABILITY_SUBJECTS,

  data() {
    return {
      isFixedHeaderVisible: false,
      isCatalogMenuOpen: false,
      needRemoveFixedHeader: false,
    }
  },

  async fetch() {
    if (this.$ability.cannot('manage', ABILITY_SUBJECTS.CATALOG_VIEW)) {
      return
    }

    try {
      await this.setCart(this.$store.state.user.userData.id)
    } catch (e) {
      console.error(e)
    }
  },

  created() {
    const { isOpenCart } = this.$route.query
    if (!isOpenCart) return

    if (this.$ability.can('manage', ABILITY_SUBJECTS.CATALOG_VIEW)) {
      this.$store.commit('cart/SET_IS_OPEN_CART', true)
    } else {
      const newQuery = useCart().getRouteQueryWithoutCart(this.$route.query)
      this.$router.push({
        query: newQuery,
      })
    }
  },

  mounted() {
    this.initIntersectionObserver()
  },

  methods: {
    initIntersectionObserver() {
      if ('IntersectionObserver' in window) {
        const options = {
          root: document.querySelector('#scrollArea'),
          rootMargin: '0px',
          threshold: 0.5,
        }
        const observer = new IntersectionObserver(this.callbackIntersectionObserver, options)
        observer.observe(this.$refs.header.$el)
      } else {
        console.info('%cYour browser does not support IntersectionObserver', 'color: tomato')
      }
    },

    callbackIntersectionObserver(entries) {
      entries.forEach((entry) => {
        if (entry.intersectionRatio >= 0.5) {
          this.isFixedHeaderVisible = false
        } else {
          this.isFixedHeaderVisible = true
        }
      })
    },

    openCatalogMenu() {
      if (!this.isFixedHeaderVisible) {
        this.needRemoveFixedHeader = true
        this.isFixedHeaderVisible = true
      }
      this.isCatalogMenuOpen = true
      lockBodyScroll()
    },

    onClickCatalogBtn() {
      if (this.isCatalogMenuOpen) {
        this.closeCatalogMenu()
      } else {
        this.isCatalogMenuOpen = true
        lockBodyScroll()
      }
    },

    closeCatalogMenu() {
      if (this.needRemoveFixedHeader) {
        this.isFixedHeaderVisible = false
        this.needRemoveFixedHeader = false
      }
      this.isCatalogMenuOpen = false
      unlockBodyScroll()
    },

    async setCart(userId) {
      const userCart = await useCarts().defineUserCart(userId)
      if (userCart) {
        this.$store.commit('cart/SET_CART', userCart)
      }

      const cartId = this.$store.state.cart.cart.id
      if (cartId) {
        const cartMainInfo = await cartMainsAdapter().getCartInfo({ cartId, isSelected: true })
        this.$store.commit('cart/SET_CART_MAINS', cartMainInfo)
      }
    },
  },
}
</script>

<style lang="scss">
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
}

.favorite-btn-fills {
  svg {
    fill: theme('colors.main.sugar');
    transition: fill 0.3s;
  }
  &:hover {
    svg {
      fill: theme('colors.main.chocolate');
    }
  }

  &--selected {
    svg {
      fill: theme('colors.main.chocolate');
    }
    &:hover {
      svg {
        fill: theme('colors.main.sugar');
      }
    }
  }
}
</style>
