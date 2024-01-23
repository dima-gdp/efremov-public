<template>
  <div class="flex flex-col w-72">
    <div class="flex flex-row items-center">
      <span class="mr-2 text-h6">Размеры</span>
      <button
        v-if="$options.BREAKPOINT_NAMES.DESKTOP !== $store.state.currentBreakpoint"
        class="mr-2 text-comment hover:text-main-marzipan transition"
        @click="isVisible = !isVisible"
      >
        <span v-if="isVisible">Скрыть</span>
        <span v-else>Посмотреть</span>
      </button>
    </div>
    <SlideUpDown :active="isVisible">
      <ul ref="product-sizes-list" class="cart-product-sizes-list">
        <li v-for="size in sizes" :key="size.id" class="cart-product-sizes-list__item">
          <div v-if="size.total" class="text-comment text-main-chocolate">
            <span class="text-h6"> {{ size.size }} </span>
            <span class="ml-2"> {{ size.total }} изд.</span>
          </div>
          <div v-else class="text-comment text-main-waffle">
            <span class="text-comment">{{ size.size }} </span>
            <span class="ml-2">{{ size.total }}</span> изд.
          </div>
        </li>
      </ul>
    </SlideUpDown>
  </div>
</template>

<script>
import SlideUpDown from 'vue-slide-up-down'
import { BREAKPOINT_NAMES } from '~/utils/constants'

export default {
  components: { SlideUpDown },
  props: {
    sizes: { type: Array, default: () => [], required: false },
  },

  data() {
    return {
      isVisible: true,
    }
  },
  BREAKPOINT_NAMES,
}
</script>

<style lang="scss"></style>
