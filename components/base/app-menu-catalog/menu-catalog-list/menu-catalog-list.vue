<template>
  <div
    :class="isDesktopMenu ? 'desktop-menu-catalog' : 'mobile-menu-catalog'"
    class="mb-8 xl:mb-10"
  >
    <div v-for="cat in showedCategories" :key="cat.id">
      <MenuCatalogTree
        :active-category="activeCategory"
        :category="cat"
        :is-mobile="!isDesktopMenu"
        @click-button-link="changeActiveCategory"
      />
    </div>

    <template v-if="hiddenCategories.length">
      <SlideUpDown :active="isMore">
        <div>
          <div v-for="cat in hiddenCategories" :key="cat.id">
            <MenuCatalogTree :category="cat" :is-mobile="!isDesktopMenu" />
          </div>
        </div>
      </SlideUpDown>

      <div class="xl:mt-4">
        <MenuCatalogButtonMore v-model="isMore" />
      </div>
    </template>
  </div>
</template>

<script>
import SlideUpDown from 'vue-slide-up-down'
import MenuCatalogButtonMore from '../menu-catalog-button-more.vue'
import MenuCatalogTree from '~/components/base/app-menu-catalog/menu-catalog-tree/menu-catalog-tree.vue'
import { BREAKPOINT_NAMES } from '~/utils/constants'

export default {
  components: { MenuCatalogTree, MenuCatalogButtonMore, SlideUpDown },

  props: {
    categoryItems: { type: Object, default: () => ({}), required: false },
  },

  BREAKPOINT_NAMES,

  data() {
    return {
      isMore: false,
      activeCategory: '',
    }
  },

  computed: {
    isDesktopMenu() {
      return this.$store.state.currentBreakpoint === this.$options.BREAKPOINT_NAMES.DESKTOP
    },

    showedCategories() {
      const { customItems } = this.categoryItems
      return customItems.filter((i) => i.isShow)
    },

    hiddenCategories() {
      const { customItems } = this.categoryItems
      return customItems.filter((i) => !i.isShow)
    },
  },

  methods: {
    changeActiveCategory(id) {
      if (id !== this.activeCategory) {
        this.activeCategory = id
      } else {
        this.activeCategory = ''
      }
    },
  },
}
</script>

<style lang="scss"></style>
