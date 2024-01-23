<template>
  <div>
    <AppImgResizer
      v-if="url"
      :url="url"
      :width="$options.CACHED_IMAGE_SIZES[350]"
      sizes="(min-width:1280px) 300px, (min-width:768px) 122px, 82px"
      alt="фото"
    />
    <img v-else src="~/assets/img/product-no-photo.jpg" alt="фото" />
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
    url: { type: String, default: '', required: true },
  },

  CACHED_IMAGE_SIZES,
}
</script>
