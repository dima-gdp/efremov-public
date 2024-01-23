<template>
  <label class="s-checkbox">
    <input :checked="value" type="checkbox" hidden @input="$emit('input', $event.target.checked)" />
    <transition name="fade">
      <span v-show="value" class="s-checkbox__icon">
        <IconCheck />
      </span>
    </transition>
  </label>
</template>

<script>
import { IconCheck } from '~/components/feather-icons'

export default {
  components: { IconCheck },
  props: {
    value: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
}
</script>

<style lang="scss">
@import 's-checkbox';
</style>
