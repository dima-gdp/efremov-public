<template>
  <span class="inline-block mb-1 text-main-b">
    <slot /> <span v-if="required" class="text-status-error">*</span>
  </span>
</template>

<script>
export default {
  props: {
    required: { type: Boolean, default: false, required: false },
  },
}
</script>
