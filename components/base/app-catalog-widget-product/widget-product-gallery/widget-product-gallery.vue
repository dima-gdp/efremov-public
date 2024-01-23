<template>
  <div class="gallery">
    <!-- Main слайдер-->
    <div class="gallery__main" :class="{ 'gallery__main--empty': !productFiles.length }">
      <div class="gallery__main-swiper" data-slider>
        <div class="swiper-wrapper">
          <template v-if="productFiles.length">
            <div
              v-for="(image, idx) in productFiles"
              :key="image.id"
              class="swiper-slide"
              @click="openFileModal(idx)"
            >
              <AppImgResizer
                v-if="image.preview"
                :url="image.preview"
                :width="$options.CACHED_IMAGE_SIZES[800]"
                data-sizes="(min-width:1280px) 490px, (min-width:768px) 278px, 226px"
                class="swiper-lazy"
                is-swiper-lazy
              />
              <div v-else class="swiper-slide">
                <img src="~/assets/img/product-no-photo.jpg" class="swiper-lazy" />
              </div>
              <IconPlayButton
                v-if="image.kind === $options.FILES_KIND.video"
                class="
                    absolute
                    top-1/2
                    left-1/2
                    transform
                    -translate-x-1/2 -translate-y-1/2
                    w-10
                    h-10
                    xl:w-16 xl:h-16
                  "
              />
              <div class="swiper-lazy-preloader"></div>
            </div>
          </template>
          <template v-else>
            <div class="swiper-slide">
              <img src="~/assets/img/product-no-photo.jpg" class="swiper-lazy" />
            </div>
          </template>
        </div>
      </div>
      <button
        :class="{ 'favorite-btn-fills--selected': isFavorite }"
        class="
          favorite-btn-fills
          absolute
          top-2
          right-1
          z-20
          md:top-2.5 md:right-2.5
          xl:top-5 xl:right-2
        "
        @click="$emit('click-favorite')"
      >
        <IconStar class="w-5 h-5" />
      </button>
      <ProductMedals class="absolute top-2 left-2 z-10 xl:top-5 xl:left-5" :medals="medals" />
      <IconSearch class="gallery__search-icon" />
    </div>

    <!-- Thumb слайдер-->
    <div class="gallery__thumb" ref="thumb-slider">
      <div class="gallery__thumb-swiper">
        <div class="swiper-wrapper">
          <template v-if="productFiles.length">
            <div v-for="image in productFiles" :key="image.id" class="swiper-slide">
              <div class="gallery__thumb-slide cursor-pointer">
                <AppImgResizer
                  v-if="image.preview"
                  :url="image.preview"
                  :width="$options.CACHED_IMAGE_SIZES[120]"
                  sizes="56px"
                />
                <img v-else src="~/assets/img/product-no-photo.jpg" />
                <IconPlayButton
                  v-if="image.kind === $options.FILES_KIND.video"
                  class="
                    absolute
                    top-1/2
                    left-1/2
                    transform
                    -translate-x-1/2 -translate-y-1/2
                    w-5
                    h-5
                    md:w-6 md:h-6
                  "
                />
              </div>
            </div>
          </template>
          <template v-else>
            <div class="swiper-slide">
              <div class="gallery__thumb-slide">
                <img src="~/assets/img/product-no-photo.jpg" />
              </div>
            </div>
          </template>
        </div>
        <button class="gallery__prev gallery__btn">
          <IconChevronUp />
        </button>
        <button class="gallery__next gallery__btn">
          <IconChevronDown />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconStar,
  IconPlayButton,
} from '~/components/feather-icons'
import ProductMedals from '~/components/common/product-medals.vue'
import AppImgResizer from '~/components/common/app-img-resizer.vue'
import { CACHED_IMAGE_SIZES, FILES_KIND } from '~/utils/constants'

export default {
  components: {
    IconPlayButton,
    IconChevronDown,
    IconChevronUp,
    IconSearch,
    ProductMedals,
    IconStar,
    AppImgResizer,
  },

  props: {
    productFiles: { type: Array, default: () => [], required: false },
    medals: { type: Array, default: () => [], required: false },
    isFavorite: { type: Boolean, default: false, required: false },
  },

  CACHED_IMAGE_SIZES,
  FILES_KIND,

  beforeDestroy() {
    // Чтоб не было видно как деактивируется swiper
    this.$refs['thumb-slider'].style.opacity = '0'
  },

  methods: {
    openFileModal(idx) {
      this.$emit('click-image', idx)
    },
  },
}
</script>

<style lang="scss">
@import 'node_modules/swiper/swiper-bundle.min.css';
@import 'widget-product-gallery';
</style>
