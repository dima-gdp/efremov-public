<template>
  <div class="order-product">
    <div class="order-product__container">
      <div class="order-product__main">
        <div class="order-product__image">
          <AppOrderHistoryProductImage
            :product-id="orderItem.file.productId"
            :is-active-product="orderItem.isActiveProduct"
            :image-url="orderItem.file.file.url"
          />
        </div>

        <div class="w-full order-0 mb-2 md:mb-0 md:order-1 md:mr-2 xl:flex">
          <div class="flex-auto mb-2 md:mb-3 xl:mb-0 xl:mr-12">
            <AppOrderHistoryProductInfo
              :article="orderItem.productInfo.article"
              :name="orderItem.productInfo.name"
              :weight="orderItem.productInfo.weight"
              :type="orderItem.productInfo.type"
              :short-info="orderItem.productInfo.shortInfo"
              :product-id="orderItem.file.productId"
              :is-active-product="orderItem.isActiveProduct"
            />
          </div>

          <div class="flex">
            <AppOrderProductSizes :sizes="orderItem.sizes" />
          </div>
        </div>

        <div class="order-2 md:flex md:flex-col md:items-end md:h-full">
          <div class="md:mb-1 whitespace-nowrap">
            <AppCartProductAmounts
              :price="orderItem.productAmount.price"
              :weight="orderItem.productAmount.weight"
              :amount="orderItem.productAmount.amount"
            />
          </div>

          <div class="text-comment md:mt-auto whitespace-nowrap">
            <span v-if="orderItem.comment">C комментарием </span>
            <span v-else>Без комментария</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppCartProductAmounts from '~/components/common/app-cart-product-amounts.vue'
import AppOrderProductSizes from '~/components/base/app-order-history/app-order-product-sizes/app-order-product-sizes.vue'
import AppOrderHistoryProductImage from '~/components/base/app-order-history/app-order-history-product-image/app-order-history-product-image.vue'
import AppOrderHistoryProductInfo from '~/components/base/app-order-history/app-order-history-product-info/app-order-history-product-info.vue'

export default {
  components: {
    AppOrderHistoryProductInfo,
    AppOrderHistoryProductImage,
    AppOrderProductSizes,
    AppCartProductAmounts,
  },

  props: {
    orderItem: { type: Object, default: () => ({}), required: false },
  },
}
</script>

<style lang="scss">
@import 'app-order-history-product';
</style>
