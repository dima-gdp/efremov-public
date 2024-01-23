<template>
  <div>
    <p class="text-h5 text-main-waffle mb-3 xl:mb-4">{{ resultTitle }}</p>
    <ul class="flex items-center mb-3 space-x-3 md:space-x-5 md:mb-6">
      <li v-for="product in products" :key="product.id">
        <a :href="`/catalog?productId=${product.id}`" class="search-product" target="_blank">
          <div class="search-product__image">
            <AppImgResizer
              v-if="product.imageUrl"
              :url="product.imageUrl"
              :width="$options.CACHED_IMAGE_SIZES[250]"
              sizes="160px"
              alt="фото"
            />
            <img v-else src="~/assets/img/product-no-photo.jpg" alt="фото" />
          </div>
          <span class="text-ma text-main-chocolate uppercase tracking-widest">{{
            product.article
          }}</span>
        </a>
      </li>
    </ul>
    <div class="flex justify-between items-center">
      <SButton
        v-if="products.length"
        class="mr-1"
        color="dark"
        variant="transparent"
        @click.native="$emit('click-show-all')"
      >
        <span class="flex items-center">
          <span class="text-but-lin mr-1">Показать все товары</span>
          <IconArrowRightCircle class="w-4 h-4 mr-1 xl:w-5 xl:h-5" />
        </span>
      </SButton>
      <SButton
        class="reset-search"
        color="dark"
        variant="transparent"
        @click.native="$emit('reset')"
      >
        <span class="flex items-center">
          <IconXCircle class="w-4 h-4 mr-1.5 md:mr-2 xl:w-5 xl:h-5 xl:mr-2.5" />
          <span class="text-but-lin">Очистить<span class="hidden md:inline"> поиск</span></span>
        </span>
      </SButton>
    </div>
  </div>
</template>

<script>
import AppImgResizer from '~/components/common/app-img-resizer.vue'
import { IconArrowRightCircle, IconXCircle } from '~/components/feather-icons'
import { SButton } from '~/components/ui-system'
import { CACHED_IMAGE_SIZES } from '~/utils/constants'

export default {
  components: { IconXCircle, SButton, IconArrowRightCircle, AppImgResizer },
  props: {
    products: { type: Array, default: () => [], required: false },
    resultTitle: { type: String, default: '', required: false },
  },

  CACHED_IMAGE_SIZES,
}
</script>

<style lang="scss">
.search-product {
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    .search-product__image:after {
      opacity: 1;
    }
  }


  &__image {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    margin-bottom: 9px;
    border: 1px solid theme('colors.main.waffle');
    position: relative;

    &:after {
      content: '';
      position: absolute;
      top: -1px;
      left: -1px;
      width: 80px;
      height: 80px;
      border: 1px solid theme('colors.main.chocolate');
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.1s;

      @media (min-width: theme('screens.md')) {
        width: 82px;
        height: 82px;
        border: 3px solid theme('colors.main.chocolate');
      }
    }
  }
}

.reset-search {
  color: theme('colors.status.error') !important;
  &:hover {
    color: theme('colors.main.waffle') !important;
  }
}
</style>
