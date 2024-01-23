<template>
  <div class="flex flex-col">
    <span class="text-h4 text-main-marzipan mb-2.5">Комментарий к товару</span>
    <div class="rounded">
      <SInput v-model="inputValue" variant="multirow" placeholder="Введите текст" />
    </div>
  </div>
</template>

<script>
import SInput from '~/components/ui-system/s-input.vue'

export default {
  components: {
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
