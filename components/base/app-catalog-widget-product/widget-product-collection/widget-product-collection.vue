<template>
  <div class="widget-product-collection">
    <span class="text-main text-main-marzipan">Коллекция</span>
    <h3 class="text-h4 text-main-chocolate mb-1 md:mb-2 xl:mb-1.5">{{ name }}</h3>
    <div v-if="imageUrl">
      <AppImgResizer
        class="widget-product-collection__img"
        :url="imageUrl"
        :width="$options.CACHED_IMAGE_SIZES[450]"
        sizes="180px"
      />
    </div>
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
    name: { type: String, default: '', required: false },
    imageUrl: { type: String, default: '', required: false },
  },

  CACHED_IMAGE_SIZES,
}
</script>

<style lang="scss">
@import 'widget-product-collection';
</style>
