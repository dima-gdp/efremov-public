<template>
  <div>
    <WidgetCartSizesList
      :sizes="sizes"
      @update-amount="$emit('update-amount', $event)"
      @mass-update-amount="$emit('mass-update-amount', $event)"
      @clean-amount="$emit('clean-amount')"
    />

    <div class="mb-10 mt-10">
      <AppBaseComment v-model="commentField" />
    </div>

    <p v-if="showPrice" class="text-h2 text-main-sugar mt-6 mb-1 md:mb-2 md:mt-8 xl:mb-3 xl:mt-10">
      {{ currentCartSums.price }} ₽
    </p>

    <div class="md:flex items-center">
      <SButton
        v-if="cartProduct.id"
        color="light"
        class="mb-2 md:mb-0 md:mr-5"
        :disabled="isLoading"
        @click.native="onClickToSave"
        @keydown.enter="onClickToSave"
      >
        <span class="flex items-center text-but-lin">
          <IconSave class="w-4 h-4 mr-1.5 md:mr-2 xl:mr-2.5 xl:w-5 xl:h-5" />
          <span>Сохранить</span>
        </span>
      </SButton>

      <SButton
        v-else
        color="light"
        :disabled="!currentCartSums.amount || isLoading"
        class="mb-2 md:mb-0 md:mr-5"
        @click.native="onClickToAdd"
        @keydown.enter="onClickToAdd"
      >
        <span class="flex items-center text-but-lin">
          <IconShoppingCart class="w-4 h-4 mr-1.5 md:mr-2 xl:mr-2.5 xl:w-5 xl:h-5" />
          <span class="hidden md:inline">Добавить в корзину</span>
          <span class="md:hidden">В корзину</span>
        </span>
      </SButton>

      <div class="flex flex-col">
        <span class="text-comment text-main-marzipan">Выбрано</span>
        <span class="text-main text-main-sugar"
          >{{ currentCartSums.amount }} изд. · {{ currentCartSums.weight }} гр</span
        >
      </div>
    </div>
  </div>
</template>

<script>

import WidgetCartSizesList from '~/components/base/app-catalog-widget-cart/widget-cart-sizes-list/widget-cart-sizes-list.vue'
import { IconShoppingCart, IconSave  } from '~/components/feather-icons'
import SButton from '~/components/ui-system/s-button/s-button.vue'
import useOffers from '~/application/use-offers'
import AppBaseComment from '~/components/common/app-base-comment.vue'

export default {
  components: {
    SButton,
    WidgetCartSizesList,
    IconShoppingCart,
    IconSave,
    AppBaseComment
  },

  props: {
    sizes: { type: Array, default: () => [], required: false },
    productPrice: { type: String, default: '0', required: false },
    productWeight: { type: String, default: '0', required: true },
    cartProduct: { type: Object, default: () => ({id: null, comment: ''}), required: true },
    showPrice: { type: Boolean, default: true, required: true },
    isLoading: { type: Boolean, default: false, required: true },
  },

  data() {
    return {
      commentField: '',
    }
  },

  computed: {
    currentCartSums() {
      return useOffers().getSelectedOffersSum(this.sizes, this.productPrice, this.productWeight)
    },
  },

  created() {
    this.commentField = this.cartProduct.comment
  },

  methods: {
    onClickToAdd() {
      this.$emit('update-comment', this.commentField)
      this.$emit('add')
    },

    onClickToSave() {
      this.$emit('update-comment', this.commentField)
      this.$emit('save')
    },
  },
}
</script>

