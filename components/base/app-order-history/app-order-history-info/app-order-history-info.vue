<template>
  <div class="bg-main-souffle py-3 px-3 md:py-5 md:px-5 xl:py-7 xl:px-7">
    <div class="flex flex-col md:flex-row justify-between mb-3 md:mb-4">
      <div class="flex flex-col">
        <h2 class="text-h3 text-main-chocolate mb-4 md:mb-2">{{ orderItems.title }}</h2>
        <span class="text-h4 text-main-marzipan hidden md:flex"> {{ orderItems.subtitle }} </span>
      </div>
      <div>
        <SButton
          type="submit"
          class="flex order-1 mb-6 md:mb-0"
          :disabled="isLoadingRepeatOrder"
          @click.native="$emit('repeat-order', orderItems.id)"
        >
          <IconRefreshCw class="w-4 h-4 mr-2 xl:w-5 xl:h-5 xl:mr-2.5" />
          <span>Повторить заказ</span>
        </SButton>
        <span class="text-h4 text-main-marzipan md:hidden">{{ orderItems.subtitle }}</span>
      </div>
    </div>

    <AppOrderHistorySort
      :sort="orderItems.sort"
      :price="orderItems.priceType"
      :price-disabled="orderItems.isDisabledOptionPrice"
      class="mb-3 md:mb-5 xl:mb-8"
      @change-sort="$emit('change-sort', $event)"
    />

    <ul v-for="item in orderItems.orderProducts" :key="item.id" class="mb-8 md:mb-6 xl:mb-12">
      <li>
        <AppOrderHistoryProduct
          :order-item="item"
          class="bg-main-sugar py-3 px-3 md:py-5 md:px-5"
        />
      </li>
    </ul>

    <div class="flex flex-col mb-5 md:mb-6 xl:mb-8">
      <div v-if="orderItems.comment">
        <h2 class="text-main-marzipan text-h2 mb-2 md:mb-3">Комментарий к заказу</h2>
        <span class="text-main-chocolate text-h4">{{ orderItems.comment }}</span>
      </div>
      <div v-else>
        <h2 class="text-main-marzipan text-h2">Без комментария</h2>
      </div>
    </div>
  </div>
</template>

<script>
import IconRefreshCw from '~/components/feather-icons/icon-refresh-cw.vue'
import { SButton } from '~/components/ui-system'
import AppOrderHistorySort from '~/components/base/app-order-history/app-order-history-sort/app-order-history-sort.vue'
import AppOrderHistoryProduct from '~/components/base/app-order-history/app-order-history-product/app-order-history-product.vue'

export default {
  components: {
    AppOrderHistoryProduct,
    AppOrderHistorySort,
    IconRefreshCw,
    SButton,
  },

  props: {
    orderItems: { type: Object, default: () => ({}), required: false },
    isLoadingRepeatOrder: {
      type: Boolean,
      default: false,
      required: false,
    },
  },

  data() {
    return {
      isDisabledOptionPrice: true,
    }
  },
}
</script>

<style lang="scss"></style>
