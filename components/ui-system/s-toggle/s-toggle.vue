<template>
  <label class="s-toggle" :class="{ 's-toggle--checked': value, 's-toggle--disabled': disabled }">
    <input
      :checked="value"
      type="checkbox"
      :disabled="disabled"
      hidden
      @input="$emit('input', $event.target.checked)"
    />
  </label>
</template>

<script>
export default {
  props: {
    value: { type: Boolean, default: false, required: true },
    disabled: { type: Boolean, default: false, required: false },
  },
}
</script>

<style lang="scss">
@import 's-toggle';
</style>
