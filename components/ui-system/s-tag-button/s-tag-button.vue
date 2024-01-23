<template>
  <button
    class="s-tag-button text-comment"
    :class="{ 's-tag-button--dark': color === $options.AVAILABLE_COLORS.DARK }"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script>
const AVAILABLE_COLORS = {
  LIGHT: 'light',
  DARK: 'dark',
}

export default {
  AVAILABLE_COLORS,
  props: {
    color: {
      type: String,
      required: false,
      default: AVAILABLE_COLORS.LIGHT,
      validator: (val) => Object.values(AVAILABLE_COLORS).includes(val),
    },
    disabled: { type: Boolean, required: false, default: false },
  },
}
</script>

<style lang="scss">
@import 's-tag-button';
</style>
