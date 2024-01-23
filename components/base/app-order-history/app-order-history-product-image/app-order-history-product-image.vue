<template>
  <div>
    <a v-if="isActiveProduct" target="_blank" :href="`/catalog?productId=${productId}`">
      <AppImgResizer
        v-if="imageUrl"
        :url="imageUrl"
        :width="$options.CACHED_IMAGE_SIZES[350]"
        sizes="(min-width:1280px) 300px, (min-width:768px) 122px, 82px"
        alt="фото"
      />
      <img v-else src="~/assets/img/product-no-photo.jpg" alt="фото" />
    </a>
    <div v-else>
      <AppImgResizer
        v-if="imageUrl"
        :url="imageUrl"
        :width="$options.CACHED_IMAGE_SIZES[350]"
        sizes="(min-width:1280px) 300px, (min-width:768px) 122px, 82px"
        alt="фото"
      />
      <img v-else src="~/assets/img/product-no-photo.jpg" alt="фото" />
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
    imageUrl: { type: String, default: '', required: true },
    isActiveProduct: {
      type: Boolean,
      default: false,
      required: false,
    },
    productId: { type: Number, default: null, required: false },
  },

  CACHED_IMAGE_SIZES,
}
</script>
