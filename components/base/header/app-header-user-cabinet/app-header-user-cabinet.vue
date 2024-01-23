<template>
  <div>
    <div v-if="isLoggedIn" class="relative">
      <button class="flex" data-user-cabinet @click="isUserCabinetOpen = true">
        <IconUser class="text-main-marzipan w-5 h-5 mr-2.5" />
        <span class="text-but-lin text-main-chocolate mr-2 flex group">
          <span class="group-hover:text-main-waffle transition">Кабинет</span>
          <IconChevronDown
            class="
              text-main-chocolate
              w-2.5
              h-2.5
              ml-2
              self-center
              group-hover:text-main-waffle
              transition
            "
          />
        </span>
      </button>
      <span class="text-comment text-main-marzipan">{{ userName }}</span>
      <transition name="fade">
        <div v-show="isUserCabinetOpen" class="header-user-cabinet" data-user-cabinet>
          <div class="flex mb-3 ml-3">
            <IconUser class="text-main-marzipan w-5 h-5 mr-2.5" />
            <span class="text-but-lin text-main-chocolate mr-2">Кабинет</span>
          </div>
          <ul>
            <li>
              <nuxt-link
                to="/user/orders-history"
                class="
                  text-main
                  block
                  text-main-chocolate
                  whitespace-nowrap
                  transition
                  py-1
                  px-3
                  hover:text-main-sugar hover:bg-main-chocolate
                "
                >История заказов</nuxt-link
              >
              <nuxt-link
                to="/user/profile"
                class="
                  text-main
                  block
                  text-main-chocolate
                  whitespace-nowrap
                  transition
                  py-1
                  px-3
                  hover:text-main-sugar hover:bg-main-chocolate
                "
                >Личные данные</nuxt-link
              >
              <button
                class="
                  text-main
                  block
                  w-full
                  text-left text-main-chocolate
                  whitespace-nowrap
                  transition
                  py-1
                  px-3
                  hover:text-main-sugar hover:bg-main-chocolate
                "
                @click="$emit('click-logout')"
              >
                Выход
              </button>
            </li>
          </ul>
        </div>
      </transition>
    </div>

    <nuxt-link v-else to="/user/sign-in/login">
      <div class="flex">
        <IconUser class="text-main-marzipan w-5 h-5 mr-2.5" />
        <span class="text-but-lin text-main-chocolate mr-2 flex group">
          <span class="group-hover:text-main-waffle transition">Кабинет</span>
          <IconChevronUp
            class="
              text-main-chocolate
              w-2.5
              h-2.5
              ml-2
              self-center
              group-hover:text-main-waffle
              transition
            "
          />
        </span>
      </div>
      <span class="text-comment text-main-chocolate hover:text-main-waffle transition">Войти</span>
    </nuxt-link>
  </div>
</template>

<script>
import { IconUser, IconChevronDown, IconChevronUp } from '~/components/feather-icons'

export default {
  components: {
    IconChevronDown,
    IconUser,
    IconChevronUp,
  },

  props: {
    userData: { type: Object, default: () => ({ name: '' }), required: false },
    isLoggedIn: { type: Boolean, default: () => false, required: false },
  },

  data() {
    return {
      isUserCabinetOpen: false,
    }
  },

  computed: {
    userName() {
      return this.userData.userProfile?.firstName
    },
  },

  mounted() {
    document.body.addEventListener('click', this.closeUserCabinet)
  },

  methods: {
    closeUserCabinet({ target }) {
      if (!target.closest('[data-user-cabinet]')) {
        this.isUserCabinetOpen = false
      }
    },
  },
}
</script>

<style lang="scss">
@import 'app-header-user-cabinet';
</style>
