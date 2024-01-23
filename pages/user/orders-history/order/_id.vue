<template>
  <main class="container">
    <section class="pt-4 md:pt-12 xl:pt-16">
      <nuxt-link to="/user/orders-history" class="flex items-center transition group mb-3 xl:mb-5">
        <span
          class="
            text-main-b
            flex
            items-center
            text-main-chocolate
            transition-colors
            hover:text-main-waffle
          "
        >
          <IconArrowRight class="transform rotate-180 w-4 h-4 mr-2 md:mr-4 md:w-5 md:h-5" />
          Вернуться к списку заказов
        </span>
      </nuxt-link>

      <h1 class="text-h1 text-main-chocolate mb-4">Заказ {{ $route.params.id }}</h1>

      <div
        v-if="isLoading"
        class="
          hidden
          items-center
          justify-center
          mb-3
          mx-auto
          md:flex md:w-20 md:h-20
          xl:w-24 xl:h-24
        "
      >
        <SSpin />
      </div>
      <div v-else>
        <AppOrderHistoryInfo
          :order-items="orderItems"
          :is-loading-repeat-order="isLoadingRepeatOrder"
          class="mb-9 md:mb-10 xl:mb-20"
          @repeat-order="repeatOrder"
          @change-sort="changeSort"
        />
      </div>
    </section>
  </main>
</template>

<script>
import IconArrowRight from '~/components/feather-icons/icon-arrow-right.vue'
import AppOrderHistoryInfo from '~/components/base/app-order-history/app-order-history-info/app-order-history-info.vue'
import { getFormattedOrderItems, SORT_ORDER_PRODUCTS } from '~/domain/order-items'
import ordersAdapter from '~/services/orders-adapter'
import orderProductsAdapter from '~/services/order-products-adapter'
import SSpin from '~/components/ui-system/s-spin.vue'
import cartFillingByOrdersAdapter from '~/services/cart-filling-by-orders-adapter'
import { routerPush } from '~/application/vue-router'
import { ERROR_CODES } from '~/domain/errors/error-codes'

export default {
  components: {
    SSpin,
    AppOrderHistoryInfo,
    IconArrowRight,
  },

  middleware: ['redirect-not-logged-in', 'redirect-cannot-catalog'],

  data() {
    return {
      orderItems: {
        title: '',
        subtitle: '',
        orderProducts: [],
        comment: '',
        priceType: 'main',
        isDisabledOptionPrice: true,
        sort: SORT_ORDER_PRODUCTS.WEIGHT_INCREASE.value,
      },
      order: null,
      isLoading: false,
      isLoadingRepeatOrder: false,
    }
  },

  async created() {
    try {
      this.isLoading = true
      await this.loadOrderItems()
    } catch (e) {
      if (String(e?.status) === ERROR_CODES.AUTHORIZATION || String(e?.status) === ERROR_CODES.NOT_FOUND) {
        await routerPush(this.$router, { name: '404' })
      } else {
        console.error(e)
      }
    } finally {
      this.isLoading = false
    }
  },

  methods: {
    async loadOrderItems() {
      const order = await ordersAdapter().getOrder(this.$route.params.id, {
        include: 'metalInsertGroup',
        filter: {
          userId: this.$store.state.user.userData.id,
        },
      })

      if (order?.id) {
        const { data } = await orderProductsAdapter().getProducts({
          include: 'product.productInserts.insert,file.file,orderProductSizes',
          filter: { orderId: this.$route.params.id },
          sort: SORT_ORDER_PRODUCTS.WEIGHT_INCREASE.value,
        })
        this.order = order
        this.orderItems = getFormattedOrderItems(
          data,
          order,
          SORT_ORDER_PRODUCTS.WEIGHT_INCREASE.value,
        )
      } else {
        await routerPush(this.$router, { name: '404' })
      }
    },

    async changeSort(sort) {
      try {
        const { data } = await orderProductsAdapter().getProducts({
          include: 'product.productInserts.insert,file.file,orderProductSizes',
          filter: { orderId: this.$route.params.id },
          sort,
        })

        this.orderItems = getFormattedOrderItems(data, this.order, sort)
      } catch (e) {
        console.error(e)
      }
    },

    async repeatOrder(orderId) {
      try {
        this.isLoadingRepeatOrder = true
        await cartFillingByOrdersAdapter().repeatOrder({
          orderId,
          cartId: this.$store.state.cart.cart.id,
        })
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoadingRepeatOrder = false
      }
    },
  },
}
</script>

<style lang="scss"></style>
