<template>
  <div
    class="
      flex flex-col
      w-full
      bg-status-warning
      md:items-center md:flex-row md:justify-between md:h-16
      pt-3
      pr-3
      pl-3
      pb-3
    "
  >
    <span class="text-comment text-main-sugar mb-3 md:mb-0 md:mr-9 md:w-96 xl:w-4/12">
      Внимание, изменились остатки по товарам в корзине! Пожалуйста, проверьте их перед оформлением
      заказа.
    </span>
    <SButton variant="solid" color="light" @click.native="$emit('close')">Понятно, убрать уведомление</SButton>
  </div>
</template>

<script>
import SButton from '~/components/ui-system/s-button/s-button.vue'

export default {
  components: {
    SButton,
  },
}
</script>

<style lang="scss"></style>
