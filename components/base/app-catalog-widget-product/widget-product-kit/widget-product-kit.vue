<template>
  <div class="flex-grow md:pt-5 xl:pt-6">
    <span
      class="
        inline-block
        text-a text-main-sugar
        bg-main-marzipan
        tracking-widest
        rounded
        uppercase
        px-1
        mb-2.5
        md:mb-4
      "
    >
      Комплект
    </span>
    <ul class="widget-product__set set-widget-product">
      <li v-for="product in kit" :key="product.id" class="set-widget-product__col">
        <div
          class="set-widget-product__item"
          @click.stop="onKitItemClick(product.productId)"
        >
          <AppImgResizer
            :url="product.file.url"
            :width="$options.CACHED_IMAGE_SIZES[120]"
            sizes="55px"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import AppImgResizer from '~/components/common/app-img-resizer.vue'
import { CACHED_IMAGE_SIZES } from '~/utils/constants'

export default {
  components: {
    AppImgResizer,
  },

  props: {
    kit: { type: Array, default: () => [], required: false },
    productId: { type: String, default: '', required: false },
  },

  CACHED_IMAGE_SIZES,

  methods: {
    onKitItemClick(productId) {
      this.$emit('click-kit-item', String(productId))
    },
  },
}
</script>

<style lang="scss">
@import 'widget-product-kit';
</style>
