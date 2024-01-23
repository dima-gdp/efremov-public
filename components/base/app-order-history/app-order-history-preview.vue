<template>
  <div class="bg-main-souffle py-3 px-3 md:py-5 md:px-5">
    <div class="flex flex-col items-start md:items-center md:flex-row mb-1 md:mb-2">
      <nuxt-link :to="`/user/orders-history/order/${order.id}`"
        ><span
          class="
            text-main-b text-main-chocolate
            flex
            items-center
            hover:text-main-waffle
            transition
          "
          >Заказ {{ order.id }} <IconArrowRight class="w-4 h-4 ml-1 md:w-5 md:h-5 md:mr-5 md:ml-5"
        /></span>
      </nuxt-link>
      <span class="text-main text-main-marzipan">
        <span class="hidden md:inline-flex">Создан</span> {{ order.subTitle }}</span
      >
    </div>
    <h2 class="text-main text-main-chocolate mb-4">{{ order.title }}</h2>

    <div class="flex flex-col items-start md:flex-row md:items-center mb-5">
      <ul class="flex mb-2 md:mb-0">
        <li v-for="product in formattedProducts" :key="product.id" class="order-history-product__image">
          <AppOrderHistoryProductImage
            :product-id="product.file.productId"
            :image-url="product.file.file.url"
            :is-active-product="product.product.isActive"
          />
        </li>
      </ul>
      <span v-if="formattedAmountRemainingProducts" class="text-main text-main-marzipan">
        + еще {{ formattedAmountRemainingProducts }}</span
      >
    </div>

    <div class="flex flex-col md:flex-row items-start md:items-center">
      <SButton
        type="submit"
        class="flex mb-1 md:mr-5 md:mb-0 xl:mr-6 order-2 md:order-1"
        :disabled="isLoadingRepeatOrder"
        @click.native="$emit('repeat-order', order.id)"
      >
        <IconRefreshCw class="w-4 h-4 mr-2 xl:w-5 xl:h-5 xl:mr-2.5" />
        <span>Повторить заказ</span>
      </SButton>
      <span class="text-h4 text-main-chocolate order-1 mb-1 md:mb-0 md:order-2">{{
        order.cost
      }}</span>
    </div>
  </div>
</template>

<script>
import IconArrowRight from '~/components/feather-icons/icon-arrow-right.vue'
import IconRefreshCw from '~/components/feather-icons/icon-refresh-cw.vue'
import { SButton } from '~/components/ui-system'
import { BREAKPOINT_NAMES, CACHED_IMAGE_SIZES } from '~/utils/constants'
import {
  AMOUNT_ORDERED_PRODUCTS,
  AMOUNT_ORDERED_PRODUCTS_MOBILE,
  getAmountRemainingWithPrefix,
} from '~/domain/orders'
import AppOrderHistoryProductImage from '~/components/base/app-order-history/app-order-history-product-image/app-order-history-product-image.vue'

export default {
  CACHED_IMAGE_SIZES,
  AMOUNT_ORDERED_PRODUCTS,
  AMOUNT_ORDERED_PRODUCTS_MOBILE,
  BREAKPOINT_NAMES,

  components: {
    AppOrderHistoryProductImage,
    IconRefreshCw,
    IconArrowRight,
    SButton,
  },

  props: {
    order: { type: Object, default: () => ({}), required: false },
    isLoadingRepeatOrder: {
      type: Boolean,
      default: false,
      required: false,
    },
  },

  data() {
    return {}
  },

  computed: {
    formattedProducts() {
      if (
        this.$store.state.currentBreakpoint === BREAKPOINT_NAMES.MOBILE &&
        this.order.totalOrderedProducts > AMOUNT_ORDERED_PRODUCTS_MOBILE
      ) {
        return this.order.files.slice(0, 4)
      }
      return this.order.files
    },

    formattedAmountRemainingProducts() {
      if (this.$store.state.currentBreakpoint === BREAKPOINT_NAMES.MOBILE) {
        const amount = this.order.totalOrderedProducts - AMOUNT_ORDERED_PRODUCTS_MOBILE
        return amount > 0 ? getAmountRemainingWithPrefix(amount) : ''
      }
      const amount = this.order.totalOrderedProducts - AMOUNT_ORDERED_PRODUCTS
      return amount > 0 ? getAmountRemainingWithPrefix(amount) : ''
    },
  },
}
</script>

<style lang="scss">
@import 'app-order-history-preview';
</style>
