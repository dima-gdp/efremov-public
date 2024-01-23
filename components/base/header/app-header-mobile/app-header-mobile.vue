<template>
  <div class="header-mobile">
    <div v-if="isSearchActive" class="header-mobile__container container">
      <div class="flex items-start w-full" data-header-search>
        <nuxt-link to="/catalog" class="header-mobile__logo mt-0.5">
          <IconE class="w-7 h-7 hover:text-main-waffle transition" />
        </nuxt-link>
        <AppTagsInput
          :input-value="searchInputValue"
          :tags="foundArticles"
          :disabled="isSearchDisabled"
          @input="$emit('input', $event)"
          @delete-tag="$emit('delete-tag', $event)"
          @keydown-delete="$emit('keydown-delete')"
        />
      </div>
      <div
        v-show="foundProducts.length"
        class="header-mobile__search-result"
        :class="{ 'header-mobile__search-result--active': isSearchActive }"
        data-header-search
      >
        <AppHeaderSearchResult
          :products="foundProducts"
          :result-title="searchResultTitle"
          @click-show-all="onClickShowAllProducts"
          @reset="onResetSearch"
        />
      </div>
    </div>

    <div v-else class="header-mobile__container container">
      <div class="flex items-center">
        <nuxt-link to="/catalog" class="header-mobile__logo">
          <IconE class="w-7 h-7 hover:text-main-waffle transition" />
        </nuxt-link>
        <AppCatalogBtn
          class="header-mobile__catalog-btn text-main-b"
          :is-catalog-menu-open="isCatalogMenuOpen"
          :disabled="isCatalogBtnDisabled"
          @click-catalog-btn="$emit('click-catalog-btn')"
        />
        <button data-header-search :disabled="isSearchDisabled" @click="isSearchActive = true">
          <IconSearch class="text-main-chocolate w-4 h-4"></IconSearch>
        </button>
      </div>

      <button class="ml-1 flex items-center text-h5 text-main-chocolate" @click="onMenuBtnClick">
        <template v-if="isOpenMenu">
          <span class="mr-1.5">Закрыть</span>
          <IconX class="w-4 h-4" />
        </template>
        <template v-else>
          <span class="mr-1.5">Меню</span>
          <IconMenu class="w-4 h-4" />
        </template>
      </button>
    </div>

    <transition name="fade">
      <AppHeaderMobileMenu v-show="isOpenMenu" v-model="isOpenMenu" />
    </transition>
  </div>
</template>

<script>
import AppCatalogBtn from '~/components/common/app-catalog-btn.vue'
import { IconSearch, IconMenu, IconX } from '~/components/feather-icons'
import AppHeaderMobileMenu from '~/components/base/header/app-header-mobile-menu/app-header-mobile-menu.vue'
import { IconE } from '~/components/icons'
import { ABILITY_SUBJECTS } from '~/domain/user-ability'
import AppTagsInput from '~/components/common/app-tags-input/app-tags-input.vue'
import AppHeaderSearchResult from '~/components/base/header/app-header-search-result.vue'

export default {
  components: {
    AppHeaderMobileMenu,
    IconSearch,
    IconMenu,
    IconX,
    AppCatalogBtn,
    IconE,
    AppTagsInput,
    AppHeaderSearchResult,
  },

  props: {
    isCatalogMenuOpen: { type: Boolean, default: false, required: false },
    searchInputValue: { type: String, default: '', required: false },
    foundArticles: { type: Array, default: () => [], required: false },
    foundProducts: { type: Array, default: () => [], required: false },
    searchResultTitle: { type: String, default: '', required: false },
  },

  data() {
    return {
      isOpenMenu: false,
      isCatalogBtnDisabled: false,
      isSearchActive: false,
      isSearchDisabled: false,
    }
  },

  mounted() {
    document.body.addEventListener('click', this.onBodyClick)
  },

  beforeDestroy() {
    document.body.removeEventListener('click', this.onBodyClick)
  },

  created() {
    this.isCatalogBtnDisabled = this.$ability.cannot('read', ABILITY_SUBJECTS.CATALOG_VIEW)
    this.isSearchDisabled = this.$ability.cannot('read', ABILITY_SUBJECTS.CATALOG_VIEW)
    const onChangeAbility = this.$ability.on('updated', ({ target }) => {
      this.isCatalogBtnDisabled = target.cannot('read', ABILITY_SUBJECTS.CATALOG_VIEW)
      this.isSearchDisabled = this.$ability.cannot('read', ABILITY_SUBJECTS.CATALOG_VIEW)
    })

    this.$once('hook:beforeDestroy', function () {
      onChangeAbility()
    })
  },

  methods: {
    onClickShowAllProducts() {
      this.$emit('click-show-all')
      this.isSearchActive = false
    },

    onResetSearch() {
      this.$emit('reset')
      this.isSearchActive = false
    },

    onBodyClick({ target }) {
      if (!target.closest('[data-header-search]')) {
        this.isSearchActive = false
      }
    },

    onMenuBtnClick() {
      if (this.isOpenMenu) {
        this.closeMobileMenu()
      } else {
        this.openMobileMenu()
      }
    },

    closeMobileMenu() {
      this.isOpenMenu = false
      document.body.classList.remove('body-fixed')
    },

    openMobileMenu() {
      this.isOpenMenu = true
      document.body.classList.add('body-fixed')
    },
  },
}
</script>

<style lang="scss">
@import 'app-header-mobile';
</style>
