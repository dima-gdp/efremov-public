<template>
  <div class="flex items-center md:mr-auto">
    <div class="flex flex-col mr-2" data-size>
      <span class="text-main-b text-main-sugar">{{ size.size }}</span>
      <span class="text-comment text-main-marzipan">{{ size.status }}</span>
    </div>
    <div>
      <SInputNumber
        v-model="cartAmount"
        color="dark"
        :disabled="size.disabled"
        :have-limit="size.haveLimit"
        :max-value="size.amount"
      />
    </div>
  </div>
</template>

<script>
import SInputNumber from '~/components/ui-system/s-input-number/s-input-number.vue'

export default {
  components: { SInputNumber },

  props: {
    size: { type: Object, default: null, required: false },
  },

  computed: {
    cartAmount: {
      get() {
        return this.size.cartAmount
      },

      set(val) {
        this.$emit('update-amount', { cartAmount: val, entityId: this.size.id })
      },
    },
  },
}
</script>
