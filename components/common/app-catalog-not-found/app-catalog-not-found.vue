<template>
  <div class="flex flex-col items-center">
    <IconSearchRing class="w-24 h-24 mb-5 md:mb-7 md:w-28 md:h-28 xl:w-48 xl:h-48" />
    <p class="text-h1 text-main-marzipan mb-3">Ничего не найдено</p>
    <p class="text-main text-main-marzipan text-center mb-5">
      Попробуйте изменить поисковый запрос или параметры фильтра
    </p>
    <SButton color="dark" @click.native="$emit('click-catalog-btn')">
      <span class="flex items-center">
        <IconRefreshCw class="w-4 h-4 mr-1.5 md:mr-2 xl:w-5 xl:h-5 xl:mr-2.5" />
        <span class="text-but-lin">Вернуться в начало каталога</span>
      </span>
    </SButton>
  </div>
</template>

<script>
import { IconSearchRing, IconRefreshCw } from '~/components/feather-icons'
import SButton from '~/components/ui-system/s-button/s-button.vue'

export default {
  components: { IconRefreshCw, SButton, IconSearchRing },
}
</script>
