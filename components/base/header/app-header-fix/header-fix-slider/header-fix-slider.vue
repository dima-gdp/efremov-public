<template>
  <div ref="slider" class="header-slider">
    <div class="swiper-wrapper">
      <div v-for="product in products" :key="product.cartProductId" class="swiper-slide">
        <div class="flex items-center">
          <a :href="`/catalog?productId=${product.productId}`" target="_blank">
            <AppImgResizer
              v-if="product.mainFileUrl"
              :url="product.mainFileUrl"
              :width="$options.CACHED_IMAGE_SIZES[120]"
              class="w-11 h-11 mr-2 xl:w-12 xl:h-12"
              data-sizes="60px"
              alt="фото"
            />
            <img
              v-else
              src="~/assets/img/product-no-photo.jpg"
              class="w-11 h-11 mr-2 xl:w-12 xl:h-12"
              alt="фото"
            />
          </a>
          <div class="flex flex-col">
            <span class="text-h6 mt-0.5">{{ product.cost }}</span>
            <span class="text-comment text-main-marzipan -mt-0.5">{{ product.sums }}</span>
          </div>
        </div>
      </div>
    </div>
    <button class="header-slider__btn header-slider__btn--next">
      <span>
        <IconChevronRight class="w-4 h-4 ml-0.5" />
      </span>
    </button>
    <button class="header-slider__btn header-slider__btn--prev">
      <span>
        <IconChevronLeft class="w-4 h-4 mr-0.5" />
      </span>
    </button>
  </div>
</template>

<script>
import Swiper, { Navigation } from 'swiper'
import { BREAKPOINT_SIZES, CACHED_IMAGE_SIZES } from '~/utils/constants'
import AppImgResizer from '~/components/common/app-img-resizer.vue'
import { IconChevronRight, IconChevronLeft } from '~/components/feather-icons'

Swiper.use([Navigation])

export default {
  components: {
    IconChevronLeft,
    IconChevronRight,
    AppImgResizer,
  },

  props: {
    products: { type: Array, default: () => [], required: true },
    isVisible: { type: Boolean, default: false, required: false },
  },

  slider: null,
  CACHED_IMAGE_SIZES,

  watch: {
    isVisible(val) {
      if (val) {
        this.$options.slider.update()
      }
    },
  },

  mounted() {
    this.$options.slider = new Swiper(this.$refs.slider, {
      slidesPerView: 'auto',
      observer: true,
      spaceBetween: 24,
      navigation: {
        nextEl: '.header-slider__btn--next',
        prevEl: '.header-slider__btn--prev',
      },
      breakpoints: {
        [BREAKPOINT_SIZES.DESKTOP]: {
          spaceBetween: 30,
        },
      },
    })
  },

  beforeDestroy() {
    this.$options.slider.destroy()
  },
}
</script>

<style lang="scss">
@import 'node_modules/swiper/swiper-bundle.min.css';
@import 'header-fix-slider';
</style>
