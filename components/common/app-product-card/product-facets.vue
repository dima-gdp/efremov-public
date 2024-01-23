<template>
  <div
    class="
      absolute
      top-28
      md:top-32
      xl:top-44
      right-3
      h-4
      xl:h-6
      flex
      items-center
      bg-main-souffle
      rounded-xl
      z-10
      px-0.5
    "
  >
    <span class="flex items-center w-9 xl:w-12">
      <component :is="iconFacets" class="w-3.5 h-3.5 xl:w-5 md:h-5 text-main-marzipan mr-0.5" />
      <span v-if="facets" class="text-comment text-main-marzipan">{{ facets }}</span>
    </span>
  </div>
</template>

<script>
import { IconFacets17, IconFacets57, IconNoFacets } from '~/components/feather-icons'

export default {
  components: { IconFacets17, IconFacets57, IconNoFacets },

  props: {
    facets: { type: Number, default: 17, required: false },
  },

  computed: {
    iconFacets() {
      switch (this.facets) {
        case 17:
          return IconFacets17

        case 57:
          return IconFacets57

        default:
          return IconNoFacets
      }
    },
  },
}
</script>
