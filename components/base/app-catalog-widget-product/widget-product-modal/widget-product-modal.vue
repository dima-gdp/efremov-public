<template>
  <div class="product-modal-slider">
    <div class="product-modal-slider__container">
      <div ref="product-modal-slider" class="product-modal-slider__swiper">
        <div class="swiper-wrapper">
          <div v-for="file in productFiles" :key="file.id" class="swiper-slide">
            <div class="product-modal-slider__slide">
              <video
                v-if="file.kind === $options.FILES_KIND.video"
                :src="file.file.url"
                controls
              ></video>
              <AppImgResizer
                v-else
                :url="file.file.url"
                :width="$options.CACHED_IMAGE_SIZES[600]"
                sizes="(min-width:768px) 600px, 300px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-center mt-3">
      <button class="product-modal-slider__prev product-modal-slider__btn">
        <IconChevronLeft />
      </button>
      <button class="product-modal-slider__next product-modal-slider__btn">
        <IconChevronRight />
      </button>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import { IconChevronLeft, IconChevronRight } from '~/components/feather-icons'
import AppImgResizer from '~/components/common/app-img-resizer.vue'
import { CACHED_IMAGE_SIZES, FILES_KIND } from '~/utils/constants'

export default {
  components: {
    IconChevronLeft,
    IconChevronRight,
    AppImgResizer,
  },

  props: {
    productFiles: { type: Array, default: () => [], required: false },
    initialSlide: { type: Number, default: 1, required: false },
  },

  CACHED_IMAGE_SIZES,
  FILES_KIND,
  slider: null,

  mounted() {
    this.setSlider()
  },

  beforeDestroy() {
    this.$options.slider.destroy()
  },

  methods: {
    setSlider() {
      this.$options.slider = new Swiper(this.$refs['product-modal-slider'], {
        initialSlide: this.initialSlide,
        slidesPerView: 1,
        watchSlidesProgress: true,
        navigation: {
          nextEl: '.product-modal-slider__next',
          prevEl: '.product-modal-slider__prev',
        },
      })
    },
  },
}
</script>

<style lang="scss">
@import 'node_modules/swiper/swiper-bundle.min.css';
@import 'widget-product-modal';
</style>
