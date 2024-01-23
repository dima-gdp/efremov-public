<template>
  <ul class="flex items-center">
    <li v-for="(medal, idx) in medals" :key="idx" class="first:ml-0 -ml-2">
      <AppMedal :type="medal.name" />
    </li>
  </ul>
</template>

<script>
import AppMedal from '~/components/common/app-medal/app-medal.vue'

export default {
  components: {
    AppMedal,
  },

  props: {
    medals: { type: Array, default: () => [], required: false },
  },
}
</script>
