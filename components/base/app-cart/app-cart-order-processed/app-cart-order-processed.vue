<template>
  <div class="flex justify-center items-center content-center h-full">
    <div class="flex flex-col items-center max-w-3xl pl-3 pr-3 md:pl-0 md:pr-0">
      <div class="mb-4 md:mb-7 xl:mb-8">
        <IconCheckCircle class="h-28 w-28 md:h-36 md:w-36 xl:h-52 xl:w-52" />
      </div>
      <h3 class="text-h1 text-main-chocolate text-center mb-2 md:mb-4 xl:mb-4">
        Заказ {{ orderId }} успешно оформлен
      </h3>
      <span class="text-main-chocolate text-main text-center mb-5 xl:mb-8">
        Вы можете найти его в Личном кабинете по ссылке:
        <button
          class="hover:text-main-waffle whitespace-nowrap transition cursor-pointer"
          @click="$emit('go-to-cabinet')"
        >
          www.efremov.jewelry/user/orders-history/order/{{ orderId }}
        </button></span
      >
      <div class="flex">
        <SButton variant="solid" color="dark" @click.native="$emit('close')">
          <IconArrowRight class="transform rotate-180 w-5 h-5 mr-1.5 md:mr-2.5" />Вернуться в
          корзину</SButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import SButton from '~/components/ui-system/s-button/s-button.vue'
import IconCheckCircle from '~/components/feather-icons/icon-check-circle.vue'
import IconArrowRight from '~/components/feather-icons/icon-arrow-right.vue'

export default {
  components: {
    IconArrowRight,
    IconCheckCircle,
    SButton,
  },

  props: {
    orderId: { type: String, default: '', required: true },
  },
}
</script>
<style lang="scss">
@import 'app-cart-order-processed';
</style>
