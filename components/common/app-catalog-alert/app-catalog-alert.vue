<template>
  <div class="catalog-alert">
    <button class="catalog-alert__close" @click="$emit('close')">
      <IconX class="w-5 h-5 md:w-7 md:h-7 xl:w-10 xl:h-10" />
    </button>

    <div class="catalog-alert__container">
      <h3 class="text-h3 text-main-sugar mb-2 md:mb-3">Внимание!</h3>
      <slot />
    </div>
  </div>
</template>

<script>
import { IconX } from '~/components/feather-icons'

export default {
  components: { IconX },
}
</script>

<style lang="scss">
@import "app-catalog-alert";
</style>
