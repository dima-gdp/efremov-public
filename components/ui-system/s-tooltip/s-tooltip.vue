<template>
  <div>
    <v-popover offset="8" placement="top" trigger="hover">
      <slot name="root-element" />

      <template #popover>
        <slot name="content" />
      </template>
    </v-popover>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
@import 's-tooltip';
</style>
