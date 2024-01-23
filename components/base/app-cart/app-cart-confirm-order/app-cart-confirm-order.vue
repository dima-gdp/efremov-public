<template>
  <div class="flex flex-col justify-center items-center content-center h-full">
    <div class="flex flex-col items-center max-w-3xl pl-3 pr-3 md:pl-0 md:pr-0">
      <div class="mb-4 md:mb-7 xl:mb-8">
        <icon-help-circle class="h-28 w-28 md:h-36 md:w-36 xl:h-52 xl:w-52" />
      </div>
      <h3 class="text-h1 text-center text-main-chocolate mb-2 md:mb-4 xl:mb-4">
        Подтверждение <span class="hidden md:inline-block">заказа</span>
      </h3>
      <span class="text-main-chocolate text-main text-center mb-3 md:mb-2 xl:mb-2"
        >Вы собираетесь заказать группу товаров «{{ orderInfo.name }}»</span
      >
      <p class="text-main-marzipan text-h4 mb-3 md:mb-3 xl:mb-4">
        {{ orderInfo.amount }} изд. &thinsp; · &thinsp; {{ orderInfo.weight }} гр &thinsp; ·
        &thinsp;
        {{ orderInfo.cost }}
      </p>
      <div class="flex items-center flex-col md:flex-row">
        <SButton
          variant="ghost"
          color="dark"
          class="mr-0 mb-4 md:mb-0 md:mr-6"
          @click.native="$emit('close')"
        >
          <IconXCircle class="w-5 h-5 mr-1.5 md:mr-2.5" />
          Отменить и вернуться в корзину</SButton
        >
        <SButton
          class="w-44 md:w-auto"
          variant="solid"
          color="dark"
          @click.native="$emit('register-order')"
        >
          <IconCheckCircle class="w-5 h-5 mr-1.5 md:mr-2.5" />Оформить заказ</SButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import SButton from '~/components/ui-system/s-button/s-button.vue'
import IconXCircle from '~/components/feather-icons/icon-x-circle.vue'
import IconCheckCircle from '~/components/feather-icons/icon-check-circle.vue'
import IconHelpCircle from '~/components/feather-icons/icon-help-circle.vue'

export default {
  components: {
    IconHelpCircle,
    IconCheckCircle,
    IconXCircle,
    SButton,
  },

  props: {
    orderInfo: { type: Object, default: () => ({}), required: false },
  },
}
</script>

<style lang="scss">
@import 'app-cart-confirm-order';
</style>
