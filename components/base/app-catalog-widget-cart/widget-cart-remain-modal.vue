<template>
  <transition name="slide-left">
    <AppCatalogAlert v-show="isShown" @close="$emit('close')">
      <p class="text-main text-main-marzipan mb-6 text-center">
        Остатки на складе изменились, в корзину будут добавлены только следующие изделия:
      </p>
      <ul class="text-main text-main-marzipan text-center mb-4 md:mb-6">
        <li v-for="offer in offers" :key="offer.id">
          Размер {{ offer.size }} — {{ offer.cartAmount }} шт.
        </li>
      </ul>
      <SButton
        color="light"
        class="mb-3 md:mb-5 xl:mb-6"
        :disabled="isLoading"
        @click.native="$emit('add')"
      >
        <span class="flex items-center text-but-lin">
          <IconShoppingCart class="w-4 h-4 mr-1.5 md:mr-2 xl:mr-2.5 xl:w-5 xl:h-5" />
          <span class="hidden md:inline">Добавить доступные изделия</span>
          <span class="md:hidden">Добавить</span>
        </span>
      </SButton>
      <SButton color="light" variant="transparent" @click.native="$emit('close')">
        <span class="flex items-center text-but-lin">
          <IconXCircle class="w-4 h-4 mr-1.5 md:mr-2 xl:mr-2.5 xl:w-5 xl:h-5" />
          <span class="hidden md:inline">Вернуться к выбору изделий</span>
          <span class="md:hidden">Отменить</span>
        </span>
      </SButton>
    </AppCatalogAlert>
  </transition>
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

  props: {
    offers: { type: Array, default: () => [], required: true },
    isShown: { type: Boolean, default: false, required: true },
    isLoading: { type: Boolean, default: false, required: true },
  },
}
</script>
