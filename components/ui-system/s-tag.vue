<template>
  <span class="flex bg-main-chocolate rounded-xl pl-2 md:pl-2.5 xl:pl-3">
    <span class="text-main text-main-sugar">
      <slot />
    </span>
    <button
      class="
        flex
        items-center
        justify-center
        w-4
        md:w-5 md:w-6
        text-main-marzipan
        hover:text-main-sugar
        cursor-pointer
      "
      data-close-tag
      @click="$emit('close-tag')"
    >
      <IconX class="w-2.5 h-2.5 md:w-3 md:h-3" />
    </button>
  </span>
</template>

<script>
import { IconX } from '~/components/feather-icons'

export default {
  components: { IconX },
}
</script>
