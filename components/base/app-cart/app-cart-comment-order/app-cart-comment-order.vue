<template>
  <div class="flex flex-col">
    <div class="flex flex-col md:flex-row md:items-center mb-2 md:mb-3.5 xl:mb-2">
      <span class="text-h4 text-main-marzipan">Комментарий к заказу</span>
      <div class="flex flex-row items-center md:ml-4 xl:ml-16 text-status-success text-comment-b">
        <IconCheckCircle class="mr-1.5 h-3.5 w-3.5" />
        <span>Сохраняется автоматически</span>
      </div>
    </div>
    <SInput
      v-model="inputValue"
      variant="multirow"
      placeholder="Введите текст"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
    />
  </div>
</template>

<script>
import SInput from '~/components/ui-system/s-input.vue'
import IconCheckCircle from '~/components/feather-icons/icon-check-circle.vue'

export default {
  components: {
    IconCheckCircle,
    SInput,
  },

  props: {
    value: {
      type: String,
      default: '',
      required: false,
    },
  },

  computed: {
    inputValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },
}
</script>

<style lang="scss">
@import 'app-cart-comment-order';
</style>
