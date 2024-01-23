<template>
  <transition name="modal">
    <div v-if="value" class="s-dialog">
      <button
        class="absolute top-10 hover:text-main-waffle transition right-5 md:right-6 xl:right-12"
        @click="$emit('input', false)"
      >
        <IconX class="w-8 h-8 md:h-12 md:w-12" />
      </button>
      <slot />
    </div>
  </transition>
</template>

<script>
import IconX from '~/components/feather-icons/icon-x.vue'
import { lockBodyScroll, unlockBodyScroll } from '~/application/body-overflow'
import { ESC_KEY_CODE } from '~/utils/constants'

export default {
  components: { IconX },

  props: {
    value: { type: Boolean, default: false, required: false },
    lockScroll: { type: Boolean, default: false, required: false },
  },

  watch: {
    value(val) {
      if (!this.lockScroll) return
      if (val) {
        lockBodyScroll()
      } else {
        unlockBodyScroll()
      }
    },
  },

  mounted() {
    if (this.lockScroll && this.value) {
      lockBodyScroll()
    }

    window.addEventListener('keydown', this.onKeyDownEsc)
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeyDownEsc)
  },

  methods: {
    onKeyDownEsc(ev) {
      if (ev.keyCode === ESC_KEY_CODE && this.value) {
        this.$emit('input', false)
      }
    },
  },
}
</script>

<style lang="scss">
@import 's-dialog';
</style>
