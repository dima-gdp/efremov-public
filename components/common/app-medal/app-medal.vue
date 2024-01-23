<template>
  <component :is="iconComponent" class="w-8 h-8 md:w-9 md:h-9 xl:w-10 xl:h-10" />
</template>

<script>
import HitMedal from '~/components/common/app-medal/icons/hit-medal.vue'
import NewMedal from '~/components/common/app-medal/icons/new-medal.vue'
import SaleMedal from '~/components/common/app-medal/icons/sale-medal.vue'

const AVAILABLE_TYPES = {
  isNew: {
    name: 'isNew',
    iconComponent: NewMedal,
  },
  isHit: {
    name: 'isHit',
    iconComponent: HitMedal,
  },
  isSale: {
    name: 'isSale',
    iconComponent: SaleMedal,
  },
}

export default {
  props: {
    type: {
      type: String,
      default: AVAILABLE_TYPES.isNew.name,
      required: false,
      validator: (val) => Object.keys(AVAILABLE_TYPES).includes(val),
    },
  },

  computed: {
    iconComponent() {
      return AVAILABLE_TYPES[this.type].iconComponent
    },
  },
}
</script>
