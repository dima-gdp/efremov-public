<template>
  <div>
    <div class="s-alert" :class="[`s-alert--${type}`]">
      <component :is="iconComponent" class="s-alert__icon" />

      <div class="s-alert__message text-main">
        <slot></slot>
      </div>

      <button v-if="closable" class="s-alert__message__close" @click="$emit('close')">
        <IconX />
      </button>
    </div>
  </div>
</template>

<script>
import { IconAlertTriangle, IconCheckCircle, IconX } from '~/components/feather-icons'

const STATUSES = {
  SUCCESS: {
    name: 'success',
    icon: IconCheckCircle,
  },
  ERROR: {
    name: 'error',
    icon: IconAlertTriangle,
  },
}

export default {
  components: {
    IconCheckCircle,
    IconAlertTriangle,
    IconX,
  },

  props: {
    closable: { type: Boolean, default: true, required: false },
    type: {
      type: String,
      default: 'success',
      required: false,
      validator: (val) =>
        Object.values(STATUSES)
          .map((s) => s.name)
          .includes(val),
    },
  },
  computed: {
    iconComponent() {
      return Object.values(STATUSES).find((s) => s.name === this.type)?.icon
    },
  },
}
</script>

<style lang="scss">
@import 's-alert';
</style>
