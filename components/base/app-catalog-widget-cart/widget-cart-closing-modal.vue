<template>
  <AppCatalogAlert @close="$emit('close')">
    <p class="text-main text-main-marzipan mb-6 text-center">
      Вы выбрали несколько размеров товара, но не добавили их в корзину. Если закрыть это окно —
      придётся добавлять товары заново
    </p>
    <SButton color="light" class="mb-3 md:mb-5 xl:mb-6" @click.native="$emit('click-add')">
      <span class="flex items-center text-but-lin">
        <IconShoppingCart class="w-4 h-4 mr-1.5 md:mr-2 xl:mr-2.5 xl:w-5 xl:h-5" />
        <span class="hidden md:inline">Вернуться и добавить размеры в корзину</span>
        <span class="md:hidden">Добавить</span>
      </span>
    </SButton>
    <SButton color="light" variant="transparent" @click.native="$emit('close')">
      <span class="flex items-center text-but-lin">
        <IconXCircle class="w-4 h-4 mr-1.5 md:mr-2 xl:mr-2.5 xl:w-5 xl:h-5" />
        <span class="hidden md:inline">Закрыть окно без добавления товаров</span>
        <span class="md:hidden">Закрыть окно</span>
      </span>
    </SButton>
  </AppCatalogAlert>
</template>

<script>
import SButton from '~/components/ui-system/s-button/s-button.vue'
import { IconXCircle, IconShoppingCart } from '~/components/feather-icons'
import AppCatalogAlert from '~/components/common/app-catalog-alert/app-catalog-alert.vue'

export default {
  components: {
    AppCatalogAlert,
    IconXCircle,
    IconShoppingCart,
    SButton,
  },
}
</script>
