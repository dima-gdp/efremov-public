<template>
  <main class="container">
    <section class="pt-4 md:pt-12 xl:pt-16">
      <h1 class="text-h1 text-main-chocolate mb-3 md:mb-4 xl:mb-5">История заказов</h1>
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
        <div
          v-if="isVisibleAlert"
          class="bg-main-souffle py-2 px-2 w-auto md:w-max flex mb-4 md:mb-5 xl:mb-8 items-center"
        >
          <IconAlertTriangle class="h-4 w-4 mr-2 md:mr-4" />
          <span class="text-comment text-main-marzipan text-center"
            >Цены и наличие товаров актуальны только на дату создания заказа</span
          >
          <button
            class="hover:text-main-waffle transition ml-2 md:ml-4"
            @click="isVisibleAlert = false"
          >
            <IconX class="h-4 w-4" />
          </button>
        </div>

        <div class="flex w-full">
          <ul class="w-full">
            <li v-for="order in orders" :key="order.id" class="mb-3 md:mb-5">
              <AppOrderHistoryPreview
                :order="order"
                :is-loading-repeat-order="isLoadingRepeatOrder"
                @repeat-order="repeatOrder"
              />
            </li>
          </ul>
        </div>

        <div class="flex justify-center mt-5 mb-9 md:mb-10 xl:mb-20 md:mt-10">
          <SButton
            v-if="canLoadMore"
            :disabled="isLoading"
            type="submit"
            class="flex mb-3 md:mr-5 md:mb-0 xl:mr-6 order-2 md:order-1"
            @click.native="loadMoreOrders"
          >
            <IconLoader class="w-4 h-4 mr-2 xl:w-5 xl:h-5 xl:mr-2.5" />
            <span>Загрузить больше</span>
          </SButton>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import IconX from '~/components/feather-icons/icon-x.vue'
import IconAlertTriangle from '~/components/feather-icons/icon-alert-triangle.vue'
import AppOrderHistoryPreview from '~/components/base/app-order-history/app-order-history-preview.vue'
import { SButton } from '~/components/ui-system'
import IconLoader from '~/components/feather-icons/icon-loader.vue'
import { INITIAL_ORDERS_PARAMS, getFormattedOrdersWithProduct } from '~/domain/orders'
import SSpin from '~/components/ui-system/s-spin.vue'
import useOrders from '~/application/use-orders'
import cartFillingByOrdersAdapter from '~/services/cart-filling-by-orders-adapter'

export default {
  components: {
    SSpin,
    IconLoader,
    AppOrderHistoryPreview,
    IconAlertTriangle,
    IconX,
    SButton,
  },

  middleware: ['redirect-not-logged-in', 'redirect-cannot-catalog'],

  data() {
    return {
      isVisibleAlert: true,
      orders: [],
      isLoading: false,
      isLoadingRepeatOrder: false,
      params: {
        pagination: {
          lastPage: null,
          currentPage: null,
        },
      },
    }
  },

  async fetch() {
    await this.loadOrders()
  },

  computed: {
    canLoadMore() {
      return this.params.pagination.currentPage < this.params.pagination.lastPage
    },
  },

  methods: {
    async loadOrders() {
      try {
        this.isLoading = true

        const { orders, products } = await useOrders().getOrdersWithProduct({
          userId: this.$store.state.user.userData.id,
          orderPage: { size: INITIAL_ORDERS_PARAMS.page.size },
          sort: '-createdAt',
        })

        this.params.pagination.lastPage = orders.lastPage
        this.params.pagination.currentPage = orders.currentPage

        this.orders = getFormattedOrdersWithProduct(orders.orders, products)
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    async loadMoreOrders() {
      try {
        this.isLoading = true
        this.params.pagination.currentPage += 1

        // Изначально было 10 заказов, теперь получаем все остальные
        const { orders, products } = await useOrders().getOrdersWithProduct({
          userId: this.$store.state.user.userData.id,
          orderPage: {
            size: INITIAL_ORDERS_PARAMS.page.size,
            number: this.params.pagination.currentPage,
          },
          sort: '-createdAt',
        })

        this.params.pagination.currentPage = orders.currentPage

        // Склеиваем 10 первых заказов и новые
        this.orders = [...this.orders, ...getFormattedOrdersWithProduct(orders.orders, products)]

        // Рекурсивно запрашиваем оставшиеся заказы
        await this.loadAllOrders(
          this.params.pagination.currentPage,
          this.params.pagination.lastPage,
        )
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    async loadAllOrders(pageCurrent, pageLast) {
      if (pageCurrent >= pageLast) {
        return
      }

      this.params.pagination.currentPage += 1

      // Получаем оставшиеся заказы
      const { orders, products } = await useOrders().getOrdersWithProduct({
        userId: this.$store.state.user.userData.id,
        orderPage: {
          size: INITIAL_ORDERS_PARAMS.page.size,
          number: this.params.pagination.currentPage,
        },
        sort: '-createdAt',
      })

      this.params.pagination.currentPage = orders.currentPage

      // Склеиваем текущие заказы и новые
      this.orders = [...this.orders, ...getFormattedOrdersWithProduct(orders.orders, products)]

      // Рекурсивно запрашиваем оставшиеся заказы
      await this.loadAllOrders(this.params.pagination.currentPage, this.params.pagination.lastPage)
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
