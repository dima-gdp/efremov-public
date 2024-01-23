<template>
  <div class="widget-cart-alert">
    <div class="flex border border-solid border-status-warning border-b mb-8 pt-2.5 pr-2 pb-2 pl-2.5 md:pt-3 md:pr-4.5 md:pb-3.5 md:pl-4 xl:pr-3 xl:pl-3">
      <div class="widget-cart-alert__icon mr-3">
        <IconClock />
      </div>
      <div class="flex flex-col">
        <p class="text-h6 text-status-warning">
          Остатки по изделиям меняются в реальном времени. Советуем как можно скорее оформить заказ,
          чтобы зарезервировать выбранные изделия.
        </p>
        <button
          class="
            text-h6
            flex
            text-main-sugar
            cursor-pointer
            mt-0.5
            md:mt-2
            hover:text-main-nuga
            transition
          "
          @click="$emit('close')"
        >
          Скрыть сообщение
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import IconClock from '~/components/feather-icons/icon-clock.vue'

export default {
  components: { IconClock },
}
</script>

<style lang="scss">
@import 'app-widget-cart-alert';
</style>
