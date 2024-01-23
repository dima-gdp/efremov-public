<template>
  <div class="relative">
    <template v-if="category.isSoon">
      <h3 class="opacity-50 mx-3 md:mx-5">
        <span class="text-h3 text-main-marzipan mr-4 md:mr-3">{{ category.name }}</span>
        <span class="text-ma text-main-marzipan uppercase tracking-widest">Скоро</span>
      </h3>
    </template>

    <template v-else>
      <h3>
        <button class="text-h3 text-main-sugar mx-3 mb-1 md:mx-5 hover:text-main-waffle transition" @click="changeActiveCategory">
          {{ category.name }}
        </button>
      </h3>
      <SlideUpDown :active="value === category.id">
        <div class="pb-3 xl:pb-7">
          <div v-for="subCat in categories" :key="subCat.id">
            <p class="text-h4 text-main-marzipan mt-1 mx-3 mb-2.5 md:mx-5 xl:mb-3">
              {{ subCat.name }}
            </p>
            <MenuCatalogList v-if="subCat.customItems.length" :category-items="subCat" />
          </div>

          <template v-if="hasSoonCategories.length">
            <div v-for="subCat in hasSoonCategories" :key="subCat.id">
              <p class="text-h4 text-main-marzipan mt-1 mx-3 mb-2.5 md:mx-5 xl:mb-3 opacity-50">
                {{ subCat.name }}
                <span class="text-ma text-main-marzipan uppercase tracking-widest">Скоро</span>
              </p>
            </div>
          </template>
        </div>
      </SlideUpDown>
    </template>
  </div>
</template>

<script>
import SlideUpDown from 'vue-slide-up-down'
import { BREAKPOINT_NAMES } from '~/utils/constants'
import MenuCatalogList from '~/components/base/app-menu-catalog/menu-catalog-list/menu-catalog-list.vue'

export default {
  components: { MenuCatalogList, SlideUpDown },

  props: {
    value: { type: String, default: '', required: false },
    category: {
      type: Object,
      default: () => ({
        isSoon: false,
        name: '',
        id: '',
        customItems: [],
      }),
      required: false,
    },
  },

  BREAKPOINT_NAMES,

  computed: {
    categories() {
      const { customItems } = this.category
      return customItems.filter((i) => !i.isSoon)
    },

    hasSoonCategories() {
      const { customItems } = this.category
      return customItems.filter((i) => i.isSoon)
    },
  },

  methods: {
    changeActiveCategory() {
      if (this.category.id !== this.value) {
        this.$emit('input', this.category.id)
      } else {
        this.$emit('input', '')
      }
    },
  },
}
</script>
