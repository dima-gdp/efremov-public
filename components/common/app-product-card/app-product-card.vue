<template>
  <div
    class="
      h-full
      flex flex-col
      items-start
      border-main-waffle border-05
      relative
      justify-between
      md:border
    "
    :class="{ inCart }"
    @click="onClickProductCard"
  >
    <span v-if="inCart" class="inCart__icon">
      <IconShoppingCart />
    </span>

    <button
      :class="{ 'favorite-btn-fills--selected': currentFavorite }"
      class="absolute top-3 right-3 z-10 favorite-btn-fills"
      data-favorite-btn
      @click="onClickFavorite"
    >
      <IconStar class="w-5 h-5" />
    </button>

    <ProductMedals v-if="medals.length" class="absolute top-3 left-3 z-10" :medals="medals" />

    <ProductFacets v-if="product.facetCount" :facets="product.facetCount" />

    <div class="product-slider">
      <div v-if="imagesList.length" ref="slider" class="swiper">
        <div class="swiper-wrapper">
          <div v-for="image in imagesList" :key="image.id" class="swiper-slide">
            <div class="product-slider__slide cursor-pointer">
              <AppImgResizer
                :url="image.file.url"
                :width="$options.CACHED_IMAGE_SIZES[450]"
                data-sizes="(min-width:1280px) 222px, (min-width:768px) 168px, 160px"
                class="swiper-lazy"
                is-swiper-lazy
              />
              <div class="swiper-lazy-preloader"></div>
            </div>
          </div>
        </div>
        <div class="swiper-pagination" data-pagination></div>
      </div>

      <div v-else class="product-slider__slide">
        <img src="~/assets/img/product-no-photo.jpg" />
      </div>
    </div>

    <div class="px-3.5 xl:px-4 md:px-3 pb-3 md:pb-3 xl:pb-4 flex flex-col">
      <div class="flex items-center mb-1 text-a">
        <span class="text-main-chocolate tracking-widest">{{ product.article }}</span>
        <span
          v-if="product.hasKit"
          class="ml-2 md:ml-2 px-1 bg-main-marzipan uppercase text-main-sugar rounded"
          >к</span
        >
      </div>

      <span class="mb-2 md:mb-1.5 text-comment-b text-main-marzipan flex-auto"
        >Вес {{ product.weight }} гр.</span
      >

      <SButton variant="ghost" color="dark" data-price-btn>
        <IconShoppingCart class="w-5 h-5 mr-1.5 md:mr-2.5" />
        <span v-if="showPrice">{{ price }}</span>
        <span v-else>{{ $options.PRICE_ON_ORDER.title }}</span>
      </SButton>
    </div>
  </div>
</template>

<script>
import Swiper, { Pagination, Lazy } from 'swiper'
import ProductFacets from './product-facets.vue'
import ProductMedals from '~/components/common/product-medals.vue'
import SButton from '~/components/ui-system/s-button/s-button.vue'
import { IconShoppingCart, IconStar } from '~/components/feather-icons'
import { CATALOG_WIDGET_TYPES, CACHED_IMAGE_SIZES } from '~/utils/constants'
import Product, { getFormattedPriceByType } from '~/domain/product'
import AppImgResizer from '~/components/common/app-img-resizer.vue'
import { getProductImages } from '~/domain/product-files'
import { PRICE_ON_ORDER } from '~/domain/carts'

Swiper.use([Pagination, Lazy])

export default {
  slider: null,

  components: {
    ProductFacets,
    ProductMedals,
    IconStar,
    IconShoppingCart,
    SButton,
    AppImgResizer,
  },

  props: {
    inCart: { type: Boolean, default: false, required: false },
    isFavorite: { type: Boolean, default: false, required: false },
    product: { type: Object, default: () => ({}), required: false },
    showPrice: { type: Boolean, default: true, required: false },
  },

  CACHED_IMAGE_SIZES,
  PRICE_ON_ORDER,

  computed: {
    medals() {
      return Product.getMedals({
        isHit: this.product.isHit,
        isSale: this.product.isSale,
        isNew: this.product.isNew,
      })
    },

    imagesList() {
      const productImages = this.product.publishedProductFiles.slice(0, 6)
      return getProductImages(productImages)
    },

    price() {
      return getFormattedPriceByType(
        this.product,
        this.$store.state.user.userData.userProfile.priceType,
      )
    },

    currentFavorite() {
      return this.isFavorite
    },
  },

  async mounted() {
    if (this.imagesList.length) {
      this.$options.slider = new Swiper(this.$refs.slider, {
        slidesPerView: 1,
        spaceBetween: 30,
        preloadImages: false,
        watchOverflow: true,
        lazy: {
          checkInView: false,
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true,
        },
      })
    }
  },

  beforeDestroy() {
    if (this.$options.slider) {
      this.$options.slider.destroy()
    }
  },

  methods: {
    onClickProductCard({ target }) {
      if (target.closest('[data-price-btn]')) {
        this.$emit('click-to-card', { id: this.product.id, type: CATALOG_WIDGET_TYPES.CART })
        return
      }
      // Тут пока так, избранного сейчас нету
      if (!target.closest('[data-favorite-btn]') && !target.closest('[data-pagination]')) {
        this.$emit('click-to-card', { id: this.product.id, type: CATALOG_WIDGET_TYPES.PRODUCT })
      }
    },

    onClickFavorite() {
      this.$emit('change-favorite', { id: this.product.id, isFavorite: !this.isFavorite })
    },
  },
}
</script>

<style lang="scss">
@import 'node_modules/swiper/swiper-bundle.min.css';
@import 'app-product-card';
</style>
