<template>
  <aside class="menu-catalog" @click="onMenuCatalogClick">
    <div
      v-if="isLoading"
      class="
        absolute
        top-1/2
        left-1/2
        transform
        -translate-x-1/2 -translate-y-1/2
        circle
        md:left-40
      "
    >
      <SSpin class="w-28 h-28 md:w-16 md:h-20" />
    </div>

    <div v-else class="menu-catalog__container" data-menu-catalog-btn>
      <nuxt-link
        to="/catalog"
        class="flex items-center relative mx-3 mb-2 md:mx-5 xl:mb-2.5 group"
        @click.native="closeMenuCatalog"
      >
        <span class="text-h3 text-main-sugar mr-1 md:mr-2 group-hover:text-main-waffle transition">Все изделия</span>
        <IconArrowRight class="w-5 h-5 xl:w-7 xl:h-7 text-main-sugar group-hover:text-main-waffle transition" />
      </nuxt-link>

      <client-only>
        <ul>
          <li v-for="cat in categories" :key="cat.id" class="mb-2">
            <MenuCatalogCategory v-model="activeCategory" :category="cat" />
          </li>
        </ul>
      </client-only>
    </div>
  </aside>
</template>

<script>
import MenuCatalogCategory from './menu-catalog-category.vue'
import { IconArrowRight } from '~/components/feather-icons'
import categoriesAdapter from '~/services/categories-adapter'
import SSpin from '~/components/ui-system/s-spin.vue'
import Categories from '~/domain/categories'
import { ESC_KEY_CODE } from '~/utils/constants'

export default {
  components: { SSpin, MenuCatalogCategory, IconArrowRight },

  props: {
    isOpen: { type: Boolean, default: false, required: false },
  },

  data() {
    return {
      activeCategory: '',
      categories: null,
      isLoading: false,
    }
  },

  async created() {
    try {
      this.isLoading = true
      const { data } = await categoriesAdapter().getCategories({
        filter: {
          parentId: null,
        },
        sort: '-sort',
      })
      this.categories = Categories.getFormattedCategories(data)
    } catch (e) {
      console.error(e)
    } finally {
      this.isLoading = false
    }
  },

  mounted() {
    document.body.addEventListener('click', this.onBodyClick)
    window.addEventListener('keydown', this.onKeyDownEsc)
  },

  beforeDestroy() {
    document.body.removeEventListener('click', this.onBodyClick)
    window.removeEventListener('keydown', this.onKeyDownEsc)
  },

  methods: {
    onBodyClick({ target }) {
      if (!target.closest('[data-menu-catalog-btn]')) {
        this.closeMenuCatalog()
      }
    },

    onKeyDownEsc(ev) {
      if (ev.keyCode === ESC_KEY_CODE) {
        this.closeMenuCatalog()
      }
    },

    onMenuCatalogClick({ target }) {
      if (target.tagName === 'A') {
        this.closeMenuCatalog()
      }
    },


    closeMenuCatalog() {
      if (this.isOpen) {
        this.$emit('close')
      }
    },
  },
}
</script>

<style lang="scss">
@import '_app-menu-catalog.scss';
</style>
