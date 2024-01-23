<template>
  <SButton :disabled="disabled" data-menu-catalog-btn data-menu-close @click.native="$emit('click-catalog-btn')">
    <div v-if="isCatalogMenuOpen" class="flex items-center">
      <IconXCircle class="w-4 h-4 mr-1 md:mr-2 xl:w-5 xl:h-5" />
      <span>Закрыть</span>
    </div>
    <div v-else class="flex items-center">
      <IconGrid class="w-4 h-4 mr-1 md:mr-2 xl:w-5 xl:h-5" />
      <span>Каталог</span>
    </div>
  </SButton>
</template>

<script>
import { IconGrid, IconXCircle } from '~/components/feather-icons'
import SButton from '~/components/ui-system/s-button/s-button.vue'

export default {
  components: {
    SButton,
    IconXCircle,
    IconGrid,
  },

  props: {
    isCatalogMenuOpen: { type: Boolean, default: false, required: false },
    disabled: { type: Boolean, default: false, required: false },
  },
}
</script>
