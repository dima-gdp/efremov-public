<template>
  <div class="text-main-b text-main-marzipan flex items-center">
    <component
      :is="iconComponent"
      class="w-4 h-4 mr-1 md:mr-2 xl:w-5 xl:h-5"
      :class="{ 'text-status-success': statusText }"
    />
    <template v-if="statusText">
      <span class="hidden md:block">Этот товар уже в корзине: {{ statusText }}</span>
      <span class="md:hidden">{{ statusText }}</span>
    </template>
    <template v-else>
      <span class="md:hidden">Товар ещё не в корзине</span>
      <span class="hidden md:block">Этот товар ещё не добавлен в корзину</span>
    </template>
  </div>
</template>

<script>
import { IconXCircle, IconCheckCircle } from '~/components/feather-icons'

export default {
  components: { IconCheckCircle, IconXCircle },
  props: {
    statusText: { type: String, default: '', required: false },
  },

  computed: {
    iconComponent() {
      if (this.statusText) {
        return IconCheckCircle
      }
      return IconXCircle
    },
  },
}
</script>
