<template>
  <button class="flex items-center mx-3 md:mx-5 text-main-sugar group relative" @click="$emit('input', !value)">
    <span v-if="value" class="text-main-b mr-1 group-hover:text-main-waffle transition">Скрыть</span>
    <span v-else class="text-main-b mr-1 group-hover:text-main-waffle transition">Показать ещё</span>
    <IconChevronDown class="w-3 h-3 xl:w-5 h-5 transition-transform group-hover:text-main-waffle transition" :class="{ 'transform rotate-180': value }" />
  </button>
</template>

<script>
import { IconChevronDown } from '~/components/feather-icons'

export default {
  components: { IconChevronDown },
  props: {
    value: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
}
</script>
