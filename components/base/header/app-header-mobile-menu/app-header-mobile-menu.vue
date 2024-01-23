<template>
  <div ref="mobile-menu" class="header-menu-mob">
    <ul class="mb-6 space-y-1">
      <li v-for="(link, index) in $options.NAVIGATE_MENU_LIST" :key="index">
        <nuxt-link
          v-if="link.to"
          :to="link.to"
          class="text-main-chocolate text-h3 hover:text-main-waffle"
          data-menu-close
          >{{ link.title }}</nuxt-link
        >
        <a
          v-else
          :href="link.href"
          class="text-main-chocolate text-h3 hover:text-main-waffle"
          target="_blank"
          data-menu-close
          >{{ link.title }}</a
        >
      </li>
    </ul>

    <div class="flex">
      <div class="mr-2 flex">
        <IconUser class="mt-1 w-8 h-8 text-main-marzipan" />
      </div>
      <div class="header-mobile__nav-item-info">
        <div class="text-main-b text-main-chocolate hover:text-main-waffle">Кабинет</div>
        <div v-if="isLoggedIn" class="text-comment text-main-marzipan">{{ userName }}</div>
        <nuxt-link
          v-else
          to="/user/sign-in/login"
          class="text-comment text-main-chocolate"
          data-menu-close
          @click.native="isOpenMenu = false"
        >
          Войти
        </nuxt-link>
      </div>
    </div>

    <div
      v-if="isLoggedIn"
      class="mt-2 flex flex-col items-start space-y-0.5 text-h5 text-main-chocolate select-none"
    >
      <nuxt-link to="/user/orders-history" data-menu-close>История заказов</nuxt-link>
      <nuxt-link to="/user/profile" data-menu-close>Личные данные</nuxt-link>
      <button class="text-h5 text-main-chocolate" data-menu-close @click="logout">Выйти</button>
    </div>

    <div class="mt-6 flex">
      <div class="flex" :class="{ 'group cursor-pointer': userCanCart }" @click="openCart">
        <div class="mr-2">
          <IconBasket
            class="mt-1 w-8 h-8 text-main-marzipan transition-colors"
            :class="{ 'group-hover:text-main-waffle ': userCanCart }"
          />
        </div>
        <div>
          <div
            class="text-main-b text-main-chocolate transition-colors"
            :class="{ 'group-hover:text-main-waffle ': userCanCart }"
          >
            {{ cartCost }}
          </div>
          <div
            class="text-comment text-main-marzipan transition-colors"
            :class="{ 'group-hover:text-main-waffle ': userCanCart }"
          >
            {{ cartSums }}
          </div>
        </div>
      </div>
    </div>

    <nuxt-link v-if="userCanCart" to="/favorites" class="mt-5 inline-flex group" data-menu-close>
      <div class="mr-2">
        <IconStar
          class="mt-1 w-8 h-8 text-main-marzipan group-hover:text-main-waffle transition-colors"
        />
      </div>
      <div>
        <div class="text-main-b text-main-chocolate group-hover:text-main-waffle transition-colors">
          Избранное
        </div>
        <div class="text-comment text-main-marzipan group-hover:text-main-waffle transition-colors">
          {{ favoritesCount }}
        </div>
      </div>
    </nuxt-link>
    <span v-else class="mt-5 inline-flex group">
      <div class="mr-2">
        <IconStar class="mt-1 w-8 h-8 text-main-marzipan" />
      </div>
      <div>
        <div class="text-main-b text-main-chocolate">Избранное</div>
        <div class="text-comment text-main-marzipan">
          {{ favoritesCount }}
        </div>
      </div>
    </span>

    <div class="mt-9 flex items-center">
      <a class="mr-4 hover:text-main-waffle" href="tel:84942425311">
        <IconPhone class="w-8 h-8" />
      </a>
      <a href="mailto:info@efremov.gold" class="hover:text-main-waffle">
        <IconMail class="h-8 w-8" />
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { IconStar, IconUser, IconPhone, IconMail, IconBasket } from '~/components/feather-icons'
import useUser from '~/application/use-user'
import useCart from '~/application/use-cart'
import { getShortSumsString } from '~/domain/carts'
import { getFormattedLocalePrice } from '~/utils'
import { getFavoriteProductsAmountString } from '~/domain/favorites'
import { ABILITY_SUBJECTS } from '~/domain/user-ability'
import { NAVIGATE_MENU_LIST } from '~/utils/constants'

export default {
  components: {
    IconStar,
    IconUser,
    IconPhone,
    IconMail,
    IconBasket,
  },

  props: {
    value: { type: Boolean, default: () => false, required: false },
  },

  NAVIGATE_MENU_LIST,

  data() {
    return {
      links: [
        {
          title: 'Новинки',
          to: '/catalog?params[sort]=-uploadedAt%2Cid',
        },
        {
          title: 'Коллекции',
          to: '/',
        },
        {
          title: 'Новости',
          to: '/',
        },
        {
          title: 'О компании',
          to: '/',
        },
        {
          title: 'Контакты',
          to: '/',
        },
      ],
      userCanCart: true,
    }
  },

  computed: {
    ...mapState({
      isLoggedIn: (state) => state.user.isLoggedIn,
      userName: (state) => state.user.userData.userProfile?.firstName,
      cartMains: (state) => state.cart.cartMains,
      favoritesCount: (state) => {
        return getFavoriteProductsAmountString(state.favorites.favoriteProductsCount)
      },
    }),

    cartSums() {
      return getShortSumsString(this.cartMains.itemsCount, this.cartMains.cartTotalWeight)
    },

    cartCost() {
      return getFormattedLocalePrice({ price: Number(this.cartMains.cartCost) })
    },
  },

  created() {
    this.userCanCart = this.$ability.can('read', ABILITY_SUBJECTS.CATALOG_VIEW)
    const onChangeAbility = this.$ability.on('updated', ({ target }) => {
      this.userCanCart = target.can('read', ABILITY_SUBJECTS.CATALOG_VIEW)
    })

    this.$once('hook:beforeDestroy', function () {
      onChangeAbility()
    })
  },

  mounted() {
    document.body.addEventListener('click', this.onBodyClick)
  },

  beforeDestroy() {
    document.body.removeEventListener('click', this.onBodyClick)
  },

  methods: {
    async logout() {
      useUser().logout(this.$store, this.$ability)
      await this.$router.push('/')
      this.closeMobileMenu()
    },

    openCart() {
      if (this.$ability.can('read', ABILITY_SUBJECTS.CATALOG_VIEW)) {
        const params = {
          store: this.$store,
          route: this.$route,
          router: this.$router,
        }
        useCart().openCart(params)
      }
    },

    onBodyClick({ target }) {
      if (target.closest('[data-menu-close]')) {
        this.closeMobileMenu()
      }
    },

    closeMobileMenu() {
      this.$emit('input', false)
      document.body.classList.remove('body-fixed')
    },
  },
}
</script>

<style lang="scss">
.header-menu-mob {
  position: fixed;
  width: 100%;
  height: calc(100% - 40px);
  top: 40px;
  left: 0;
  background: theme('colors.main.sugar');
  z-index: 960;
  padding: 20px 12px 16px 12px;
  overflow: auto;
}
</style>
