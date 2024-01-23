<template>
  <span
    class="text-comment px-2 md:px-2.5 rounded-xl border whitespace-nowrap"
    :class="[status.colorClass]"
  >
    {{ status.text }}
  </span>
</template>

<script>
import { PRODUCT_AVAILABLE_STATUSES } from '~/utils/constants'

export default {
  props: {
    isCatalogAvailable: { type: Boolean, default: false, required: false },
    isLeftoversAvailable: { type: Boolean, default: false, required: false },
  },

  computed: {
    status() {
      if (!this.isCatalogAvailable) {
        return PRODUCT_AVAILABLE_STATUSES.DISCONTINUED
      }

      if (this.isLeftoversAvailable) {
        return PRODUCT_AVAILABLE_STATUSES.AVAILABLE
      }

      return PRODUCT_AVAILABLE_STATUSES.ORDER_ONLY
    },
  },
}
</script>
